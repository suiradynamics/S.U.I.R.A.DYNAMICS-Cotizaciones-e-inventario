'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchQuotes() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Consultamos las cotizaciones en Supabase (asumiendo una tabla llamada 'quotes')
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setQuotes(data);
      }
      setLoading(false);
    }

    fetchQuotes();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
            <p className="text-sm text-gray-600">Emisión y seguimiento de documentos comerciales</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
            >
              Volver al Panel
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Cargando cotizaciones...</div>
          ) : quotes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No hay cotizaciones registradas todavía.</p>
              <span className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                Próximamente: Botón para crear nueva cotización
              </span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Cotización</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.quote_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.client_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quote.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        quote.status === 'Aprobada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString()}
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
