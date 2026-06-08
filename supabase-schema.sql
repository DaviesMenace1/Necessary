-- ============================================================
-- INTERIO LUXURY — Supabase Database Schema & RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Custom role enum
CREATE TYPE public.app_role AS ENUM ('client', 'designer', 'installer', 'admin');

-- 2. Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  email        TEXT UNIQUE,
  phone        TEXT,
  company_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User roles mapping
CREATE TABLE public.user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 4. Projects (architectural/design projects)
CREATE TABLE public.projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  timeline_phase  TEXT DEFAULT 'concept' CHECK (timeline_phase IN (
    'concept', 'architectural_review', 'sourcing', 'importing', 'installation', 'handover'
  )),
  budget          NUMERIC(15, 2),
  layout_url      TEXT,
  description     TEXT,
  site_address    TEXT,
  designer_id     UUID REFERENCES public.profiles(id),
  installer_id    UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Carts (one active cart per client)
CREATE TABLE public.carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, is_active)
);

-- 6. Cart items (specialized procurement items)
CREATE TABLE public.cart_items (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id                     UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id                  UUID,                    -- optional, nullable for custom items
  custom_title                TEXT NOT NULL,
  custom_specs                JSONB DEFAULT '{}',      -- dimensions, fabric, finish, origin, etc.
  quantity                    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_ugx              NUMERIC(15, 2) NOT NULL DEFAULT 0,
  import_duties_ugx           NUMERIC(15, 2) NOT NULL DEFAULT 0,
  installation_fee_ugx        NUMERIC(15, 2) NOT NULL DEFAULT 0,
  required_deposit_percentage INTEGER NOT NULL DEFAULT 50 CHECK (required_deposit_percentage BETWEEN 0 AND 100),
  sourcing_status             TEXT DEFAULT 'pending' CHECK (sourcing_status IN (
    'pending', 'sourcing', 'ordered', 'in_transit', 'customs', 'delivered', 'installed'
  )),
  image_url                   TEXT,
  notes                       TEXT,
  added_by                    UUID REFERENCES public.profiles(id),   -- designer/admin who added
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  first_name   TEXT,
  interest     TEXT CHECK (interest IN ('residential', 'commercial', 'both')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active    BOOLEAN DEFAULT TRUE
);

-- 8. Documents vault
CREATE TABLE public.documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES public.profiles(id),
  title        TEXT NOT NULL,
  doc_type     TEXT CHECK (doc_type IN ('blueprint', 'floor_plan', 'mood_board', 'contract', 'invoice', 'report')),
  file_url     TEXT NOT NULL,
  file_size    BIGINT,
  is_signed    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HELPER FUNCTION: Check user role
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(check_role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND   role    = check_role
  );
$$;

-- Helper: check admin OR designer
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND   role IN ('admin', 'designer')
  );
$$;

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  -- Default role: client
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');

  -- Create an empty cart
  INSERT INTO public.carts (client_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents              ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES RLS
-- ============================================================
-- Clients: own profile only
CREATE POLICY "clients_own_profile" ON public.profiles
  FOR ALL USING (
    id = auth.uid() AND public.has_role('client')
  );

-- Staff (admin/designer): all profiles
CREATE POLICY "staff_all_profiles" ON public.profiles
  FOR ALL USING (public.is_staff());

-- Installer: own profile only
CREATE POLICY "installer_own_profile" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() AND public.has_role('installer')
  );

-- ============================================================
-- USER_ROLES RLS
-- ============================================================
CREATE POLICY "users_view_own_role" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_manage_roles" ON public.user_roles
  FOR ALL USING (public.has_role('admin'));

-- ============================================================
-- PROJECTS RLS
-- ============================================================
-- Clients: only their own projects
CREATE POLICY "client_own_projects" ON public.projects
  FOR SELECT USING (
    client_id = auth.uid() AND public.has_role('client')
  );

-- Staff: all projects
CREATE POLICY "staff_all_projects" ON public.projects
  FOR ALL USING (public.is_staff());

-- Installer: only assigned projects
CREATE POLICY "installer_assigned_projects" ON public.projects
  FOR SELECT USING (
    installer_id = auth.uid() AND public.has_role('installer')
  );

-- ============================================================
-- CARTS RLS
-- ============================================================
CREATE POLICY "client_own_cart" ON public.carts
  FOR SELECT USING (
    client_id = auth.uid() AND public.has_role('client')
  );

CREATE POLICY "staff_all_carts" ON public.carts
  FOR ALL USING (public.is_staff());

-- ============================================================
-- CART_ITEMS RLS
-- ============================================================
-- Client: only items in their own cart
CREATE POLICY "client_own_cart_items" ON public.cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_items.cart_id
      AND   c.client_id = auth.uid()
    )
    AND public.has_role('client')
  );

-- Staff: can view and insert/modify any client's cart
CREATE POLICY "staff_all_cart_items" ON public.cart_items
  FOR ALL USING (public.is_staff());

-- ============================================================
-- DOCUMENTS RLS
-- ============================================================
CREATE POLICY "client_own_documents" ON public.documents
  FOR SELECT USING (
    client_id = auth.uid() AND public.has_role('client')
  );

CREATE POLICY "staff_all_documents" ON public.documents
  FOR ALL USING (public.is_staff());

-- ============================================================
-- NEWSLETTER: anyone can subscribe (anon insert)
-- ============================================================
CREATE POLICY "anyone_subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "admin_view_subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.has_role('admin'));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_projects_client_id   ON public.projects(client_id);
CREATE INDEX idx_projects_installer   ON public.projects(installer_id);
CREATE INDEX idx_cart_items_cart_id   ON public.cart_items(cart_id);
CREATE INDEX idx_user_roles_user_id   ON public.user_roles(user_id);
CREATE INDEX idx_documents_project    ON public.documents(project_id);
CREATE INDEX idx_documents_client     ON public.documents(client_id);

-- ============================================================
-- SEED: Demo data (remove in production)
-- ============================================================
-- INSERT INTO public.profiles (id, full_name, email, company_name) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'James Okafor', 'james@client.com', NULL),
--   ('00000000-0000-0000-0000-000000000002', 'Anika Mensah', 'anika@interio.com', 'Interio Design Group');
