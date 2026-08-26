import { supabaseAdmin } from '../../../lib/supabaseServer';

export async function POST(req: Request) {
  try {
    // Validate auth and extract tenant_id
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return new Response(JSON.stringify({ error: 'missing_token' }), { status: 401 });

    // get user and claims
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401 });

    const user = userData.user || userData;
    const tenant_id = (user.user_metadata && user.user_metadata.tenant_id) || (user.app_metadata && user.app_metadata.tenant_id) || null;
    if (!tenant_id) return new Response(JSON.stringify({ error: 'tenant_missing_in_user' }), { status: 401 });

    const body = await req.json();
    const { customer_name, customer_email, items = [], taxes = [], subtotal = 0, total = 0 } = body;

    // Create quote using tenant_id from token (prevent spoofing)
    const { data: quote, error: quoteErr } = await supabaseAdmin
      .from('quotes')
      .insert([{ tenant_id, customer_name, customer_email, subtotal, taxes, total, created_by: user.id }])
      .select('*')
      .single();

    if (quoteErr || !quote) {
      console.error('Error creating quote', quoteErr);
      return new Response(JSON.stringify({ error: 'failed_create_quote' }), { status: 500 });
    }

    // Insert items
    for (const it of items) {
      const line_total = (it.qty || 1) * (it.unit_price || 0);
      await supabaseAdmin.from('quote_items').insert([{
        quote_id: quote.id,
        tenant_id,
        item_type: it.type || 'product',
        item_id: it.item_id || null,
        description: it.description || it.name || null,
        qty: it.qty || 1,
        unit_price: it.unit_price || 0,
        tax_override: it.tax_override || null,
        line_total
      }]);
    }

    // Generate secure token for public link
    const tokenStr = cryptoRandomURLSafe();
    const expires_at = null; // optional

    const { data: link, error: linkErr } = await supabaseAdmin
      .from('quote_links')
      .insert([{ quote_id: quote.id, token: tokenStr, expires_at }])
      .select('*')
      .single();

    if (linkErr || !link) {
      console.error('Error creating quote link', linkErr);
      return new Response(JSON.stringify({ error: 'failed_create_link' }), { status: 500 });
    }

    const publicPath = `/api/public/quote?token=${encodeURIComponent(tokenStr)}`;

    return new Response(JSON.stringify({ quote, link, publicPath }), { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST /api/quotes', err);
    return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
  }
}

function cryptoRandomURLSafe(len = 36) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  const b = Buffer.from(bytes).toString('base64');
  return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
