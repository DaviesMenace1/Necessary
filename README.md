# INTERIO — Luxury Interior Design Platform

A full-stack Next.js + Supabase platform for an interior design and architecture firm handling custom design projects, global material sourcing, importing logistics, and precision installations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS with custom luxury design tokens |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Security | Supabase Row-Level Security (RLS) |
| Payments | Flutterwave / Stripe (integration-ready) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              → Public home (cinematic split hero)
│   ├── showcase/page.tsx     → Portfolio gallery with Shop the Look hotspots
│   ├── auth/page.tsx         → Sign in / Register
│   ├── client/
│   │   ├── page.tsx          → Client dashboard overview
│   │   ├── timeline/page.tsx → Visual project phase tracker
│   │   ├── vault/page.tsx    → Secure document vault
│   │   └── cart/page.tsx     → Procurement cart with deposit split
│   ├── admin/
│   │   ├── page.tsx          → Executive dashboard + project table
│   │   └── sourcing/page.tsx → Designer sourcing tool (inject items)
│   └── installer/
│       └── page.tsx          → Mobile-friendly installation job list
├── components/
│   └── layouts/
│       └── DashboardSidebar.tsx → Role-aware sidebar + mobile bar
├── lib/
│   ├── supabase.ts           → Browser client
│   └── supabase-server.ts    → Server client + admin client
├── middleware.ts              → Route protection by user role
└── types/
    └── database.ts           → TypeScript types + cart calculation utils
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase-schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Schema

### Tables
| Table | Purpose |
|---|---|
| `profiles` | Extended user data linked to auth.users |
| `user_roles` | Maps users to app_role enum |
| `projects` | Architectural/design projects with phase tracking |
| `carts` | One active cart per client |
| `cart_items` | Custom items with full pricing breakdown (unit price + duties + installation) |
| `documents` | Secure document vault per project/client |
| `newsletter_subscribers` | Marketing list with interest segmentation |

### Roles (`app_role` enum)
| Role | Access |
|---|---|
| `client` | Own profile, own projects, own cart only |
| `designer` | All profiles, all projects, inject items into any cart |
| `admin` | Full access including role management |
| `installer` | Only assigned projects, installation specs, completion actions |

---

## User Portals

### Public Pages
- **Home** (`/`) — Cinematic split hero (Residential / Commercial), 6-phase process timeline, newsletter signup
- **Showcase** (`/showcase`) — Immersive portfolio gallery with interactive Shop the Look hotspots

### Client Dashboard (`/client`)
- **Overview** — Project summary, quick stats, budget tracker
- **Project Timeline** (`/client/timeline`) — Visual 6-phase roadmap with milestone tracking
- **Document Vault** (`/client/vault`) — Secure download of blueprints, floor plans, mood boards, contracts
- **Procurement Cart** (`/client/cart`) — Itemised cart with duties + installation fees + deposit/balance split

### Admin / Designer (`/admin`)
- **Executive Dashboard** — Live project values, deposits collected, outstanding balances
- **Sourcing Tool** (`/admin/sourcing`) — Configure and inject custom items into any client cart with live price preview

### Installer (`/installer`)
- Mobile-optimised job list with technical specs, site address, client contact, and "Complete & Request Invoice" action

---

## Row-Level Security Summary

All tables have RLS enabled. Key policies:

```sql
-- Clients see only their own data
CREATE POLICY "client_own_cart" ON carts
  FOR SELECT USING (client_id = auth.uid() AND has_role('client'));

-- Staff (admin/designer) can do everything
CREATE POLICY "staff_all_projects" ON projects
  FOR ALL USING (is_staff());

-- Installers see only assigned projects
CREATE POLICY "installer_assigned" ON projects
  FOR SELECT USING (installer_id = auth.uid() AND has_role('installer'));
```

See `supabase-schema.sql` for the full set of 15+ RLS policies.

---

## Key Design Decisions

**Pricing Model** — Each `cart_item` stores `unit_price_ugx`, `import_duties_ugx`, and `installation_fee_ugx` separately, enabling transparent client-facing breakdowns. The `required_deposit_percentage` defaults to 50% but can be set per-item by designers.

**Role Assignment** — The `handle_new_user()` trigger automatically creates a `client` role on signup. Admins can upgrade roles via the `user_roles` table.

**Designer Cart Injection** — Designers never interact with a client's cart directly through the client UI. The Sourcing Tool (`/admin/sourcing`) is the controlled interface for injecting custom-configured items.

---

## Connecting Payments

The cart's "Pay Deposit" button is wired to trigger a payment flow. To connect:

**Flutterwave (recommended for Uganda/Africa):**
```bash
npm install flutterwave-node-v3
```

**Stripe:**
```bash
npm install stripe @stripe/stripe-js
```

Create a server action in `src/app/actions/payment.ts` that creates a payment intent for `summary.depositDue` and returns a checkout URL.

---

## Design System

The luxury aesthetic is built on:
- **Fonts**: Cormorant Garamond (display serif) + Jost (body sans) + JetBrains Mono (labels)
- **Palette**: Obsidian (#1a1816) · Ivory (#faf8f4) · Champagne (#de9825)
- **Motion**: 150–300ms transitions, `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing
- **Effects**: Glassmorphism panels, grain texture overlay, champagne shimmer text

All tokens are defined in `tailwind.config.js` and `globals.css`.
