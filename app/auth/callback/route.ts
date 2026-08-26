import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error al intercambiar el código por sesión:', error);
      // Si falla, redirige al usuario a la página principal con un error opcional
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
    }
  }

  // Redirección limpia usando el origen de la solicitud actual (evita caídas en localhost)
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
