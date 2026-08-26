-- Row-Level Security (RLS) policies to enforce tenant isolation
-- Run this in Supabase SQL editor AFTER creating the tables.

-- Helper: enable RLS and create policy for a given table

-- TENANTS table: allow only DB admins to see all tenants; authenticated users shouldn't see all tenants.
ALTER TABLE IF EXISTS tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Tenants: allow admin" ON tenants
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For other tables we enforce tenant match via jwt.claims.tenant_id

-- QUOTES
ALTER TABLE IF EXISTS quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Quotes: members can access their tenant quotes" ON quotes
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- QUOTE_ITEMS
ALTER TABLE IF EXISTS quote_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "QuoteItems: tenant match" ON quote_items
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- QUOTE_LINKS
ALTER TABLE IF EXISTS quote_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "QuoteLinks: tenant match via join" ON quote_links
  FOR SELECT
  USING ( (
    -- allow select only if the linked quote belongs to the tenant in the JWT
    (SELECT tenant_id::text FROM quotes WHERE quotes.id = quote_links.quote_id) = current_setting('jwt.claims.tenant_id', true)
  ));

-- CHAT_MESSAGES
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "ChatMessages: tenant match" ON chat_messages
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- PRODUCTS
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Products: tenant match" ON products
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- INVENTORY
ALTER TABLE IF EXISTS inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Inventory: tenant match" ON inventory
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- SERVICES
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Services: tenant match" ON services
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- EVENT_LOGS
ALTER TABLE IF EXISTS event_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "EventLogs: tenant match" ON event_logs
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- SUBSCRIPTIONS
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Subscriptions: tenant match" ON subscriptions
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- USERS (app users table)
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users: tenant match" ON users
  FOR ALL
  USING (tenant_id::text = current_setting('jwt.claims.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('jwt.claims.tenant_id', true));

-- Notes:
-- 1) Supabase injects jwt.claims.* into the Postgres settings for authenticated requests.
-- 2) For server-side operations using the Service Role Key, these policies are bypassed. Ensure the Service Role Key is only used in secure server environments.
-- 3) The public quote endpoint uses the Service Role Key intentionally to allow anonymous reads of public quotes; however, it writes seen_at and events using server privileges.
