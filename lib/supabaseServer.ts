import { createClient } from '@supabase/supabase-js';

// Server-side Supabase admin client. Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in env.
const url = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !serviceKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. Server admin operations will fail.');
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

// Helper to get user and claims from an access token
export async function getUserFromToken(accessToken) {
  if (!accessToken) return null;
  try {
    const res = await supabaseAdmin.auth.getUser(accessToken);
    if (res.error) return null;
    return res.data.user || null;
  } catch (e) {
    console.error('getUserFromToken error', e);
    return null;
  }
}
