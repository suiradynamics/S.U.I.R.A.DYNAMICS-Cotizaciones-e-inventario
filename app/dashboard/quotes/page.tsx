'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Quote } from '@/lib/types';
import Link from 'next/link';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setQuotes(data);
    setLoading(false);
  }

  const handleMarkAsSold = async (quote: Quote) => {
    if (quote.status === 'vendida') return;
    const supabase = createClient();

    // 1. Cambiar estado a vendida
    await supabase
      .from('quotes')
      .update({ status: 'vendida' })
      .eq('id', quote.id);

    // 2. Descontar stock de productos físicos automáticamente
    for (const item of quote.items) {
      if (item.item_type === 'product') {
        const { data: prod } = await supabase
          .from('inventory')
          .select('stock')
          .eq('id', item.item_id)
          .single();

        if (prod) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          await supabase
            .from('inventory')
            .update({ stock: newStock })
            .eq('id', item.item_id);
        }
      }
    }

    // 3. Registrar en historial de ventas
    const summary = quote.items.map(i => `${i.item_name} (x${i.quantity})`).join(', ');
    await supabase.from('sales_history').insert([{
      quote_id: quote.id,
      total_sale: quote.total_amount,
      items_summary: summary
    }]);

    fetchQuotes();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Gestión de Cotizaciones</h1>
            <p className="text-sm text-gray-600">S.U.I.R.A. Dynamics Commercial Hub</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/quotes/create"
              className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-800"
            >
              + Nueva Cotización
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              Volver al Panel
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Cargando cotizaciones...</div>
          ) : quotes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No hay cotizaciones registradas aún.</p>
              <Link
                href="/dashboard/quotes/create"
                className="inline-block rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Crear Primera Cotización
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Nº</th>
                  <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left font-semibold">Total</th>
                  <th className="px-6 py-3 text-left font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left font-semibold">Rastreo</th>
                  <th className="px-6 py-3 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-6 py-4 font-bold text-navy-900">#{quote.quote_number}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{quote.client_name}</p>
                      <p className="text-xs text-gray-500">{quote.client_phone}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${Number(quote.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        quote.status === 'vendida' 
                          ? 'bg-green-100 text-green-800' 
                          : quote.status === 'expirada' 
                          ? 'bg-red-100 text-brandRed-600' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quote.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p>{quote.viewed_at ? `👁️ Vista: ${new Date(quote.viewed_at).toLocaleTimeString()}` : '⏳ No vista'}</p>
                      <p>{quote.downloaded_at ? `📥 Descargada` : '⏳ No descargada'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {quote.status === 'pendiente' && (
                        <button
                          onClick={() => handleMarkAsSold(quote)}
                          className="bg-green-600 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-green-700"
                        >
                          Marcar como Vendida
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
