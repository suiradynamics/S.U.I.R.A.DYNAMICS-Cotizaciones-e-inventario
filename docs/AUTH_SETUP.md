# Configuración de autenticación (Guía rápida)

Este documento describe los pasos mínimos para que el registro por correo/contraseña y el login con Google funcionen correctamente en tu proyecto.

1) Variables de entorno (Cloudflare Pages)
- NEXT_PUBLIC_SUPABASE_URL = https://<tu-proyecto>.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_...
- SUPABASE_SERVICE_ROLE_KEY = (solo para endpoints server-side, opcional)

En Cloudflare Pages: Pages → tu proyecto → Settings → Environment variables → Add variable. Luego fuerza un nuevo deploy.

2) Supabase (Project → Authentication → URL Configuration)
- Site URL: https://appcot.suiradynamics.com
- Redirect URLs: agregar al menos
  - https://appcot.suiradynamics.com/auth/callback
  - http://localhost:3000/auth/callback  (si pruebas en local)

3) Google Cloud Console (Credentials)
- En tu OAuth 2.0 Client (Web application) añade en `Authorized redirect URIs` la callback de Supabase que vimos en logs:
  - https://<tu-proyecto>.supabase.co/auth/v1/callback
- Copia el Client ID y Client Secret y pégalos en Supabase → Auth → Settings → External OAuth → Google.

4) Supabase → Auth → Settings → External OAuth
- Pega el Client ID y Client Secret de Google.
- Añade también en Redirect URLs la URL de tu app (https://appcot.suiradynamics.com/auth/callback) para que Supabase reenvíe a tu aplicación.

5) Probar localmente
- Crea `.env.local` en la raíz del proyecto con las variables (sin espacios):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
  ```
- Reinicia el servidor dev (npm run dev / bun dev).
- Prueba registro por email/password y login con Google. Revisa DevTools → Network y los logs del servidor.

6) Registro de contraseña / enlazar cuentas
- Si quieres permitir que un usuario que inició con Google pueda también usar contraseña, implementa un formulario en su perfil que llame:
  ```js
  await supabase.auth.updateUser({ password: newPassword });
  ```
- Para fusionar cuentas (cuando existe una cuenta por email y otra por proveedor social) es necesario un proceso server-side usando la `service_role` key; esto requiere precaución y no está activado por defecto.

7) Logging en el callback
- Hemos añadido logging en `app/auth/callback/route.ts` para que puedas ver en los logs del servidor por qué falla el intercambio de código (exchangeCodeForSession). Si ves errores, pégalos aquí y te ayudo a interpretarlos.

---

Si quieres, puedo añadir un endpoint server-side para buscar usuarios por email (usando `SUPABASE_SERVICE_ROLE_KEY`) y ayudarte a planear la fusión/ligado de cuentas, pero ese paso lo haremos con cuidado porque implica claves con privilegios.
