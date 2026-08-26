import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const code = url.searchParams.get('code');
    if (!code) {
      console.error('Auth callback called without code:', request.url);
      return NextResponse.redirect(new URL('/login?error=auth_callback_missing_code', url));
    }

    const supabase = createServerActionClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Log the full error object to server logs for debugging
      console.error('Supabase exchangeCodeForSession error:', error);
      return NextResponse.redirect(new URL('/login?error=auth_callback_failed', url));
    }

    // Successful exchange: redirect to dashboard (or desired route)
    return NextResponse.redirect(new URL('/dashboard', url));
  } catch (err) {
    console.error('Unexpected error in auth callback route:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', url));
  }
}
