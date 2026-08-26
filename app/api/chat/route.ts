import { supabaseAdmin } from '../../../lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quote_link_token, content, sender_type = 'customer' } = body;
    if (!quote_link_token || !content) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 400 });
    }

    // find link
    const { data: link, error: linkErr } = await supabaseAdmin.from('quote_links').select('*').eq('token', quote_link_token).limit(1).single();
    if (linkErr || !link) return new Response(JSON.stringify({ error: 'link_not_found' }), { status: 404 });

    // For staff messages, require Authorization header
    const authHeader = req.headers.get('authorization') || '';
    let sender_id = null;
    let tenant_id = null;

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
      if (userErr || !userData) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401 });
      const user = userData.user || userData;
      sender_id = user.id;
      tenant_id = (user.user_metadata && user.user_metadata.tenant_id) || (user.app_metadata && user.app_metadata.tenant_id) || null;

      if (!tenant_id) return new Response(JSON.stringify({ error: 'tenant_missing' }), { status: 401 });

      // Ensure tenant matches the quote's tenant
      const { data: quote, error: qErr } = await supabaseAdmin.from('quotes').select('id, tenant_id').eq('id', link.quote_id).limit(1).single();
      if (qErr || !quote) return new Response(JSON.stringify({ error: 'quote_not_found' }), { status: 404 });
      if (quote.tenant_id !== tenant_id) return new Response(JSON.stringify({ error: 'tenant_mismatch' }), { status: 403 });
    } else {
      // public customer message: get tenant from quote
      const { data: quote, error: qErr } = await supabaseAdmin.from('quotes').select('id, tenant_id').eq('id', link.quote_id).limit(1).single();
      if (qErr || !quote) return new Response(JSON.stringify({ error: 'quote_not_found' }), { status: 404 });
      tenant_id = quote.tenant_id;
    }

    // insert chat message
    const { data: msg, error: msgErr } = await supabaseAdmin.from('chat_messages').insert([{ quote_link_id: link.id, tenant_id, sender_type, sender_id, content }]).select('*').single();
    if (msgErr) return new Response(JSON.stringify({ error: 'failed_insert' }), { status: 500 });

    // log event
    await supabaseAdmin.from('event_logs').insert([{ quote_link_id: link.id, tenant_id, event_type: 'message_sent', payload: { sender_type, content } }]);

    return new Response(JSON.stringify({ message: msg }), { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/chat', err);
    return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
  }
}
