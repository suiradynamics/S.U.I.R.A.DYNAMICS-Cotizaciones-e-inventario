# S.U.I.R.A. DYNAMICS — Cotizaciones e Inventario

Este repositorio contiene un frontend Next.js y utilidades para una plataforma de cotizaciones, enlaces públicos, chat básico y tablas SQL para usar con Supabase/Postgres.

Qué agregué en la rama feature/rls-auth
- db/schema.sql — esquema SQL con tablas: tenants, users, products, inventory, services, quotes, quote_items, quote_links, chat_messages, event_logs, subscriptions.
- db/rls_policies.sql — políticas RLS para proteger tenant_id con jwt.claims.tenant_id.
- lib/supabaseServer.ts — cliente Supabase de servidor (usa SUPABASE_SERVICE_ROLE_KEY) y helper getUserFromToken.
- lib/auth.ts — helper requireAuth(req) que valida token y extrae tenant_id desde metadata.
- app/api/quotes/route.ts — endpoint POST protegido para crear cotizaciones y generar link público.
- app/api/public/route.ts — endpoint GET público para leer una cotización por token (marca seen_at y registra evento).
- app/api/chat/route.ts — endpoint POST para enviar mensajes asociados a un `quote_link_token` (acepta mensajes públicos y mensajes de staff validados).
- middleware.ts — middleware que añade header x-tenant con el subdominio inferido.
- README.md, .env.example — instrucciones de instalación y variables de entorno.

Instrucciones rápidas (sin coste)
1. Crea un proyecto en Supabase (plan gratuito).
2. En SQL Editor de Supabase pega y ejecuta `db/schema.sql`.
3. Luego pega y ejecuta `db/rls_policies.sql` para activar RLS.
4. En Settings -> API copia SUPABASE_URL y crea una API key (Service Role Key) y añádela a tu entorno como SUPABASE_SERVICE_ROLE_KEY.
5. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY a tus variables públicas (Vercel/Cloudflare).
6. Ejecuta la app localmente: `npm install` y `npm run dev`.

Qué falta y qué deberías hacer manualmente
- Añadir tenant_id en user metadata cuando crees usuarios (puedes usar un script SQL o la API de Supabase Auth para atualizar user_metadata).
- Configurar Supabase Realtime si quieres push en tiempo real al admin panel.
- Implementar subida de imágenes a Supabase Storage (puedo añadir un ejemplo si quieres).
- Validaciones y tests.

Seguridad importante
- No subas la SUPABASE_SERVICE_ROLE_KEY al repositorio.
- Verifica las políticas RLS y que los usuarios tengan tenant_id en sus claims.

Si quieres que agregue scripts para crear un tenant demo y un usuario admin con tenant_id en metadata, dime y lo añadiré.