export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionPlan = "starter" | "professional" | "business"
export type SubscriptionStatus = "trialing" | "active" | "canceled" | "past_due" | "incomplete" | "expired"
export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue" | "canceled" | "refunded"

// Profile type
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  company_logo: string | null
  company_address: string | null
  company_city: string | null
  company_state: string | null
  company_zip: string | null
  company_country: string | null
  company_phone: string | null
  company_email: string | null
  company_website: string | null
  company_tax_id: string | null
  created_at: string
  updated_at: string
}

// User Settings type
export interface UserSettings {
  id: string
  user_id: string
  default_currency: string
  default_tax_rate: number
  default_payment_terms: number
  default_template: string
  default_notes: string | null
  default_terms: string | null
  notify_invoice_paid: boolean
  notify_invoice_viewed: boolean
  notify_invoice_overdue: boolean
  notify_weekly_summary: boolean
  notify_marketing: boolean
  date_format: string
  number_format: string
  timezone: string
  created_at: string
  updated_at: string
}

// Subscription type
export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  trial_start: string | null
  trial_end: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  created_at: string
  updated_at: string
}

// Client type
export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  tax_id: string | null
  website: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Invoice type
export interface Invoice {
  id: string
  user_id: string
  client_id: string | null
  invoice_number: string
  status: InvoiceStatus
  template_id: string
  issue_date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  shipping_amount: number
  total: number
  amount_paid: number
  amount_due: number
  currency: string
  notes: string | null
  terms: string | null
  footer: string | null
  viewed_at: string | null
  sent_at: string | null
  paid_at: string | null
  canceled_at: string | null
  payment_method: string | null
  payment_reference: string | null
  created_at: string
  updated_at: string
}

// Invoice Item type
export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
  unit: string | null
  tax_rate: number | null
  discount_rate: number | null
  sort_order: number
  created_at: string
}

// Dashboard Stats type
export interface DashboardStats {
  total_revenue: number
  pending_amount: number
  overdue_amount: number
  total_invoices: number
  paid_invoices: number
  pending_invoices: number
  overdue_invoices: number
  draft_invoices: number
  total_clients: number
  this_month_revenue: number
  last_month_revenue: number
  this_month_invoices: number
}

// Client Stats type
export interface ClientStats {
  total_invoiced: number
  total_paid: number
  total_pending: number
  invoice_count: number
  paid_count: number
  last_invoice_date: string | null
}

// Subscription Limits type
export interface SubscriptionLimits {
  allowed: boolean
  reason: string
  limit: number
  current: number
}

// Invoice with relations
export interface InvoiceWithClient extends Invoice {
  client?: Client | null
  items?: InvoiceItem[]
}

// Client with stats
export interface ClientWithStats extends Client {
  stats?: ClientStats
}
