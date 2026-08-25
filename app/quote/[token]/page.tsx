'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Quote } from '@/lib/types';
import { useParams } from 'next/navigation';

export default function PublicQuotePage() {
  const params = useParams();
  const token = params?.token as string;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [expired, setExpired] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!token) return;

    async function loadQuote() {
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('public_token', token)
        .single();

      if (data) {
        setQuote(data);

        // Registrar lectura en vivo si es la primera vez que entra
        if (!data.viewed_at) {
          await supabase
            .from('quotes')
            .update({ viewed_at: new Date().toISOString() })
            .eq('id', data.id);
        }
      }
    }

    loadQuote();
  }, [token, supabase]);

  // Cronómetro de validez en vivo
  useEffect(() => {
    if (!quote) return;

    const timer = setInterval(() => {
      const expires = new Date(quote.expires_at).getTime();
      const now = new Date().getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft('Cotización Expirada');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quote]);

  const handleDownload = async () => {
    if (!quote) return;
    
    // Registrar evento de descarga
    await supabase
      .from('quotes')
      .update({ downloaded_at: new Date().toISOString() })
      .eq('id', quote.id);

    window.print(); // Abre el diálogo nativo para imprimir o guardar como PDF
  };

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando cotización...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden border">
        {/* Encabezado Corporativo */}
        <div className="bg-navy-900 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">S.U.I.R.A. Dynamics</h1>
            <p className="text-xs text-gray-300">Cotización Oficial Nº #{quote.quote_number}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-300">Tiempo de Validez:</p>
            <p className={`text-sm font-extrabold ${expired ? 'text-brandRed-500' : 'text-green-400'}`}>
              {timeLeft}
            </p>
          </div>
        </div>

        {/* Datos del Cliente y Empresa */}
        <div className="p-6 border-b grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold text-gray-700">Cliente:</p>
            <p className="text-navy-900 font-semibold">{quote.client_name}</p>
            <p className="text-gray-500">{quote.client_phone}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-700">Fecha de Emisión:</p>
            <p className="text-gray-600">{new Date(quote.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Tabla de Productos/Servicios */}
        <div className="p-6">
          <table className="w-full text-left text-sm mb-6">
            <thead>
              <tr className="border-b text-navy-900 font-bold">
                <th className="py-2">Descripción</th>
                <th className="py-2 text-center">Cant.</th>
                <th className="py-2 text-right">Precio U.</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quote.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3">
                    <p className="font-semibold text-gray-800">{item.item_name}</p>
                    <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                  </td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">${item.unit_price.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales */}
          <div className="w-full md:w-1/2 ml-auto space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${quote.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto ({quote.tax_rate}%):</span>
              <span>${quote.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-navy-900 text-lg border-t pt-2">
              <span>Total Final:</span>
              <span>${quote.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Acciones para el consumidor */}
        <div className="bg-gray-50 p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-t">
          <button
            onClick={handleDownload}
            className="w-full md:w-auto bg-navy-900 text-white font-bold px-6 py-2.5 rounded shadow hover:bg-navy-800 text-sm"
          >
            📥 Descargar / Imprimir PDF
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hola, quisiera confirmar la cotización Nº #${quote.quote_number}`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto bg-green-600 text-white font-bold px-6 py-2.5 rounded shadow hover:bg-green-500 text-center text-sm"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
