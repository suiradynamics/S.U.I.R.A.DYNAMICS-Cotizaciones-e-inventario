import { supabaseAdmin } from '../../../../lib/supabaseServer';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return new Response(JSON.stringify({ error: 'token required' }), { status: 400 });

    // Find link
    const { data: link, error: linkErr } = await supabaseAdmin
      .from('quote_links')
      .select('*')
      .eq('token', token)
      .limit(1)
      .single();

    if (linkErr || !link) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });

    // Get quote and items (service role key used here to bypass RLS for public access)
    const { data: quote, error: qErr } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('id', link.quote_id)
      .limit(1)
      .single();

    if (qErr || !quote) return new Response(JSON.stringify({ error: 'quote_not_found' }), { status: 404 });

    const { data: items } = await supabaseAdmin
      .from('quote_items')
      .select('*')
      .eq('quote_id', quote.id);

    // Update seen_at and log event
    await supabaseAdmin.from('quote_links').update({ seen_at: new Date().toISOString() }).eq('id', link.id);
    await supabaseAdmin.from('event_logs').insert([{ quote_link_id: link.id, tenant_id: quote.tenant_id, event_type: 'link_open', payload: { ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null } }]);

    return new Response(JSON.stringify({ quote, items }), { status: 200 });
  } catch (err) {
    console.error('Error in GET /api/public/quote', err);
    return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
  }
}
