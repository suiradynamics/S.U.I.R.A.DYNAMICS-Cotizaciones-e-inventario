import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware'; // O la lógica directa de actualización

// Nota: Para mantenerlo limpio, aquí configuramos el matcher básico de Supabase
export async function middleware(request: NextRequest) {
  // Por ahora dejamos pasar la petición mientras estructuramos los componentes base
  return;
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto las que empiezan por:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo de favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
