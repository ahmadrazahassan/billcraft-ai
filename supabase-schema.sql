-- ============================================================================
-- BILLCRAFT DATABASE SCHEMA
-- Production-Grade Invoice Management System
-- Version: 1.0.0
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Create a new query
-- 4. Paste this entire file
-- 5. Click "Run" to execute
--
-- This will create all tables, indexes, RLS policies, functions, and triggers
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- DROP EXISTING OBJECTS (for clean reinstall)
-- ============================================================================

-- Drop functions first (this will cascade to triggers)
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_invoice_number(UUID) CASCADE;
DROP FUNCTION IF EXISTS check_subscription_limits(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_dashboard_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_invoice_totals() CASCADE;
DROP FUNCTION IF EXISTS get_client_stats(UUID) CASCADE;

-- Drop tables (CASCADE will handle foreign keys)
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================
CREATE TYPE subscription_plan AS ENUM ('starter', 'professional', 'business');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'canceled', 'past_due', 'incomplete', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'overdue', 'canceled', 'refunded');

-- ============================================================================
-- PROFILES TABLE
-- Extends auth.users with additional user information
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  -- Company Information
  company_name TEXT,
  company_logo TEXT,
  company_address TEXT,
  company_city TEXT,
  company_state TEXT,
  company_zip TEXT,
  company_country TEXT DEFAULT 'United States',
  company_phone TEXT,
  company_email TEXT,
  company_website TEXT,
  company_tax_id TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- USER SETTINGS TABLE
-- Stores user preferences and default values
-- ============================================================================
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Invoice Defaults
  default_currency TEXT DEFAULT 'USD',
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  default_payment_terms INTEGER DEFAULT 14, -- days
  default_template TEXT DEFAULT 'minimal',
  default_notes TEXT,
  default_terms TEXT DEFAULT 'Payment is due within the specified payment terms. Late payments may be subject to additional fees.',
  -- Notification Preferences
  notify_invoice_paid BOOLEAN DEFAULT TRUE,
  notify_invoice_viewed BOOLEAN DEFAULT TRUE,
  notify_invoice_overdue BOOLEAN DEFAULT TRUE,
  notify_weekly_summary BOOLEAN DEFAULT FALSE,
  notify_marketing BOOLEAN DEFAULT FALSE,
  -- Display Preferences
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  number_format TEXT DEFAULT 'en-US',
  timezone TEXT DEFAULT 'America/New_York',
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- Manages user subscription plans and billing
-- ============================================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Plan Information
  plan subscription_plan DEFAULT 'professional' NOT NULL,
  status subscription_status DEFAULT 'trialing' NOT NULL,
  -- Trial Period
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  -- Billing Period
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  -- Payment Provider (for future Stripe integration)
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- ============================================================================
-- CLIENTS TABLE
-- Stores client/customer information
-- ============================================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Basic Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'United States',
  -- Additional Info
  tax_id TEXT,
  website TEXT,
  notes TEXT,
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INVOICES TABLE
-- Main invoice records
-- ============================================================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Invoice Details
  invoice_number TEXT NOT NULL,
  status invoice_status DEFAULT 'draft' NOT NULL,
  template_id TEXT DEFAULT 'minimal',
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
  due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '14 days') NOT NULL,
  -- Financial
  subtotal DECIMAL(12,2) DEFAULT 0 NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0 NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0 NOT NULL,
  discount_rate DECIMAL(5,2) DEFAULT 0 NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0 NOT NULL,
  shipping_amount DECIMAL(12,2) DEFAULT 0 NOT NULL,
  total DECIMAL(12,2) DEFAULT 0 NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0 NOT NULL,
  amount_due DECIMAL(12,2) DEFAULT 0 NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  -- Content
  notes TEXT,
  terms TEXT,
  footer TEXT,
  -- Tracking
  viewed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  -- Payment Info
  payment_method TEXT,
  payment_reference TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INVOICE ITEMS TABLE
-- Line items for invoices
-- ============================================================================
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  -- Item Details
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1 NOT NULL,
  rate DECIMAL(12,2) DEFAULT 0 NOT NULL,
  amount DECIMAL(12,2) DEFAULT 0 NOT NULL,
  -- Optional
  unit TEXT, -- e.g., 'hours', 'items', 'units'
  tax_rate DECIMAL(5,2) DEFAULT 0,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  -- Ordering
  sort_order INTEGER DEFAULT 0,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);

-- User Settings
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_end ON subscriptions(trial_end);

-- Clients
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_is_active ON clients(is_active);

-- Invoices
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);

-- Invoice Items
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User Settings Policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clients Policies
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Invoices Policies
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Invoice Items Policies
CREATE POLICY "Users can view own invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

CREATE POLICY "Users can update own invoice items" ON invoice_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own invoice items" ON invoice_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- Create user settings with defaults
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  
  -- Create subscription with 14-day trial (Professional plan)
  INSERT INTO subscriptions (
    user_id, 
    plan, 
    status, 
    trial_start, 
    trial_end,
    current_period_start,
    current_period_end
  )
  VALUES (
    NEW.id,
    'professional',
    'trialing',
    NOW(),
    NOW() + INTERVAL '14 days',
    NOW(),
    NOW() + INTERVAL '14 days'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Generate unique invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_count INTEGER;
  v_year TEXT;
  v_number TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  
  -- Get count of invoices for this user this year
  SELECT COUNT(*) + 1 INTO v_count 
  FROM invoices 
  WHERE user_id = p_user_id 
  AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  v_number := 'INV-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM invoices WHERE invoice_number = v_number AND user_id = p_user_id) LOOP
    v_count := v_count + 1;
    v_number := 'INV-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');
  END LOOP;
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_subtotal DECIMAL(12,2);
  v_tax_amount DECIMAL(12,2);
  v_discount_amount DECIMAL(12,2);
  v_total DECIMAL(12,2);
  v_tax_rate DECIMAL(5,2);
  v_discount_rate DECIMAL(5,2);
  v_shipping DECIMAL(12,2);
  v_amount_paid DECIMAL(12,2);
BEGIN
  -- Get invoice details
  SELECT tax_rate, discount_rate, shipping_amount, amount_paid
  INTO v_tax_rate, v_discount_rate, v_shipping, v_amount_paid
  FROM invoices WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Calculate subtotal from items
  SELECT COALESCE(SUM(amount), 0) INTO v_subtotal
  FROM invoice_items WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Calculate tax and discount
  v_discount_amount := v_subtotal * (v_discount_rate / 100);
  v_tax_amount := (v_subtotal - v_discount_amount) * (v_tax_rate / 100);
  v_total := v_subtotal - v_discount_amount + v_tax_amount + v_shipping;
  
  -- Update invoice
  UPDATE invoices SET
    subtotal = v_subtotal,
    tax_amount = v_tax_amount,
    discount_amount = v_discount_amount,
    total = v_total,
    amount_due = v_total - v_amount_paid,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function: Get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_revenue', COALESCE((
      SELECT SUM(total) FROM invoices 
      WHERE user_id = p_user_id AND status = 'paid'
    ), 0),
    'pending_amount', COALESCE((
      SELECT SUM(amount_due) FROM invoices 
      WHERE user_id = p_user_id AND status IN ('sent', 'viewed')
    ), 0),
    'overdue_amount', COALESCE((
      SELECT SUM(amount_due) FROM invoices 
      WHERE user_id = p_user_id AND status = 'overdue'
    ), 0),
    'total_invoices', (
      SELECT COUNT(*) FROM invoices WHERE user_id = p_user_id
    ),
    'paid_invoices', (
      SELECT COUNT(*) FROM invoices WHERE user_id = p_user_id AND status = 'paid'
    ),
    'pending_invoices', (
      SELECT COUNT(*) FROM invoices WHERE user_id = p_user_id AND status IN ('sent', 'viewed')
    ),
    'overdue_invoices', (
      SELECT COUNT(*) FROM invoices WHERE user_id = p_user_id AND status = 'overdue'
    ),
    'draft_invoices', (
      SELECT COUNT(*) FROM invoices WHERE user_id = p_user_id AND status = 'draft'
    ),
    'total_clients', (
      SELECT COUNT(*) FROM clients WHERE user_id = p_user_id AND is_active = TRUE
    ),
    'this_month_revenue', COALESCE((
      SELECT SUM(total) FROM invoices 
      WHERE user_id = p_user_id 
      AND status = 'paid'
      AND DATE_TRUNC('month', paid_at) = DATE_TRUNC('month', NOW())
    ), 0),
    'last_month_revenue', COALESCE((
      SELECT SUM(total) FROM invoices 
      WHERE user_id = p_user_id 
      AND status = 'paid'
      AND DATE_TRUNC('month', paid_at) = DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    ), 0),
    'this_month_invoices', (
      SELECT COUNT(*) FROM invoices 
      WHERE user_id = p_user_id 
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limits(p_user_id UUID, p_resource TEXT)
RETURNS JSON AS $$
DECLARE
  v_plan subscription_plan;
  v_status subscription_status;
  v_count INTEGER;
  v_limit INTEGER;
  v_allowed BOOLEAN;
BEGIN
  -- Get user's subscription
  SELECT plan, status INTO v_plan, v_status
  FROM subscriptions
  WHERE user_id = p_user_id;
  
  -- Check if subscription is active
  IF v_status NOT IN ('trialing', 'active') THEN
    RETURN json_build_object('allowed', FALSE, 'reason', 'Subscription not active', 'limit', 0, 'current', 0);
  END IF;
  
  -- During trial, allow unlimited access
  IF v_status = 'trialing' THEN
    RETURN json_build_object('allowed', TRUE, 'reason', 'Trial active', 'limit', -1, 'current', 0);
  END IF;
  
  -- Check limits based on plan and resource
  IF p_resource = 'invoices_monthly' THEN
    SELECT COUNT(*) INTO v_count FROM invoices 
    WHERE user_id = p_user_id 
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());
    
    v_limit := CASE v_plan
      WHEN 'starter' THEN 5
      WHEN 'professional' THEN -1 -- unlimited
      WHEN 'business' THEN -1 -- unlimited
    END;
    
  ELSIF p_resource = 'clients' THEN
    SELECT COUNT(*) INTO v_count FROM clients WHERE user_id = p_user_id AND is_active = TRUE;
    
    v_limit := CASE v_plan
      WHEN 'starter' THEN 10
      WHEN 'professional' THEN 100
      WHEN 'business' THEN -1 -- unlimited
    END;
  ELSE
    RETURN json_build_object('allowed', TRUE, 'reason', 'Unknown resource', 'limit', -1, 'current', 0);
  END IF;
  
  v_allowed := v_limit = -1 OR v_count < v_limit;
  
  RETURN json_build_object(
    'allowed', v_allowed, 
    'reason', CASE WHEN v_allowed THEN 'Within limits' ELSE 'Limit reached' END,
    'limit', v_limit,
    'current', v_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get client statistics
CREATE OR REPLACE FUNCTION get_client_stats(p_client_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_invoiced', COALESCE(SUM(total), 0),
    'total_paid', COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0),
    'total_pending', COALESCE(SUM(CASE WHEN status IN ('sent', 'viewed') THEN amount_due ELSE 0 END), 0),
    'invoice_count', COUNT(*),
    'paid_count', COUNT(*) FILTER (WHERE status = 'paid'),
    'last_invoice_date', MAX(issue_date)
  ) INTO v_result
  FROM invoices WHERE client_id = p_client_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: New user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Triggers: Update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers: Update invoice totals when items change
CREATE TRIGGER update_invoice_totals_on_insert
  AFTER INSERT ON invoice_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

CREATE TRIGGER update_invoice_totals_on_update
  AFTER UPDATE ON invoice_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

CREATE TRIGGER update_invoice_totals_on_delete
  AFTER DELETE ON invoice_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

-- ============================================================================
-- CRON JOBS (requires pg_cron extension - enable in Supabase Dashboard)
-- ============================================================================
-- Uncomment these if you have pg_cron enabled:

-- -- Check for overdue invoices daily at midnight
-- SELECT cron.schedule(
--   'check-overdue-invoices',
--   '0 0 * * *',
--   $$
--   UPDATE invoices 
--   SET status = 'overdue', updated_at = NOW()
--   WHERE status IN ('sent', 'viewed') 
--   AND due_date < CURRENT_DATE;
--   $$
-- );

-- -- Check for expired trials daily at midnight
-- SELECT cron.schedule(
--   'check-expired-trials',
--   '0 0 * * *',
--   $$
--   UPDATE subscriptions 
--   SET status = 'expired', updated_at = NOW()
--   WHERE status = 'trialing' 
--   AND trial_end < NOW();
--   $$
-- );

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- DONE!
-- ============================================================================
-- Your database is now ready. 
-- Make sure to enable Email Auth in Supabase Dashboard:
-- Authentication > Providers > Email
-- ============================================================================
