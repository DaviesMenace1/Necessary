export type AppRole = 'client' | 'designer' | 'installer' | 'admin'

export type TimelinePhase =
  | 'concept'
  | 'architectural_review'
  | 'sourcing'
  | 'importing'
  | 'installation'
  | 'handover'

export type SourcingStatus =
  | 'pending'
  | 'sourcing'
  | 'ordered'
  | 'in_transit'
  | 'customs'
  | 'delivered'
  | 'installed'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  company_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: AppRole
  assigned_at: string
}

export interface Project {
  id: string
  client_id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  timeline_phase: TimelinePhase
  budget: number | null
  layout_url: string | null
  description: string | null
  site_address: string | null
  designer_id: string | null
  installer_id: string | null
  created_at: string
  updated_at: string
}

export interface Cart {
  id: string
  client_id: string
  is_active: boolean
  created_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string | null
  custom_title: string
  custom_specs: Record<string, unknown>
  quantity: number
  unit_price_ugx: number
  import_duties_ugx: number
  installation_fee_ugx: number
  required_deposit_percentage: number
  sourcing_status: SourcingStatus
  image_url: string | null
  notes: string | null
  added_by: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  project_id: string | null
  client_id: string
  title: string
  doc_type: 'blueprint' | 'floor_plan' | 'mood_board' | 'contract' | 'invoice' | 'report'
  file_url: string
  file_size: number | null
  is_signed: boolean
  created_at: string
}

// Computed types
export interface CartSummary {
  subtotal: number
  totalDuties: number
  totalInstallation: number
  grandTotal: number
  depositDue: number
  balanceDue: number
}

export function computeCartSummary(items: CartItem[]): CartSummary {
  let subtotal = 0
  let totalDuties = 0
  let totalInstallation = 0
  let depositDue = 0

  for (const item of items) {
    const itemTotal = item.quantity * item.unit_price_ugx
    const duties = item.import_duties_ugx * item.quantity
    const install = item.installation_fee_ugx
    const lineTotal = itemTotal + duties + install
    const deposit = (lineTotal * item.required_deposit_percentage) / 100

    subtotal += itemTotal
    totalDuties += duties
    totalInstallation += install
    depositDue += deposit
  }

  const grandTotal = subtotal + totalDuties + totalInstallation
  const balanceDue = grandTotal - depositDue

  return { subtotal, totalDuties, totalInstallation, grandTotal, depositDue, balanceDue }
}

export function formatUGX(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      user_roles: { Row: UserRole; Insert: Partial<UserRole>; Update: Partial<UserRole> }
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project> }
      carts: { Row: Cart; Insert: Partial<Cart>; Update: Partial<Cart> }
      cart_items: { Row: CartItem; Insert: Partial<CartItem>; Update: Partial<CartItem> }
      documents: { Row: Document; Insert: Partial<Document>; Update: Partial<Document> }
    }
  }
}
