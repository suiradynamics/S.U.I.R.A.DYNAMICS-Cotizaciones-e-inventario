import { supabaseAdmin, getUserFromToken } from './supabaseServer';

export async function requireAuth(req) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    throw new Error('401: missing_token');
  }

  const userRes = await getUserFromToken(token);
  if (!userRes) throw new Error('401: invalid_token');

  // Supabase stores custom claims in user.user_metadata or user.app_metadata depending on flow
  const tenant_id = (userRes.user_metadata && userRes.user_metadata.tenant_id) || (userRes.app_metadata && userRes.app_metadata.tenant_id) || null;
  if (!tenant_id) throw new Error('401: tenant_missing');

  return { user: userRes, tenant_id };
}
