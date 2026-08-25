import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqebpqqgsqyzeydfpbyw.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_INZBpilT5yAh4_OWJeJEQ_xg91voAs';

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}
