'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { InventoryItem, QuoteItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateQuotePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [taxRate, setTaxRate] = useState<number>(7); // Impuesto por defecto (editable)
  const [loading, setLoading] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchInventory() {
      const { data } = await supabase.from('inventory').select('*').order('name');
      if (data) setInventory(data);
    }
    fetchInventory();
  }, [supabase]);

  const addItemToQuote = (item: InventoryItem) => {
    if (item.item_type === 'product' && item.stock <= 0) return; // Bloquear sin stock

    const existing = selectedItems.find(i => i.item_id === item.id);
    if (existing) {
      if (item.item_type === 'product' && existing.quantity >= item.stock) return;
      setSelectedItems(selectedItems.map(i => 
        i.item_id === item.id 
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unit_price }
          : i
      ));
    } else {
      setSelectedItems([...selectedItems, {
        item_id: item.id,
        item_name: item.name,
        sku: item.sku,
        item_type: item.item_type,
        unit_price: item.price,
        quantity: 1,
        subtotal: item.price
      }]);
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.item_id !== id));
  };

  const subtotal = selectedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleCreateQuote = async () => {
    if (!clientName || selectedItems.length === 0) return;
    setLoading(true);

    const publicToken = Math.random().toString(36).substring(2, 10);

    const { data, error } = await supabase.from('quotes').insert([{
      public_token: publicToken,
      client_name: clientName,
      client_phone: clientPhone,
      items: selectedItems,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_amount: total,
      status: 'pendiente'
    }]).select();

    setLoading(false);
    if (!error && data) {
      setCreatedToken(publicToken);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Crear Nueva Cotización</h1>
          <Link href="/dashboard/quotes" className="text-sm bg-gray-200 text-gray-800 px-3 py-2 rounded">
            Volver
          </Link>
        </div>

        {createdToken ? (
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-navy-900 text-center">
            <h2 className="text-xl font-bold text-navy-900 mb-2">¡Cotización Generada con Éxito!</h2>
            <p className="text-sm text-gray-600 mb-4">Puedes enviar el enlace de seguimiento al cliente por WhatsApp:</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <a
                href={`https://wa.me/${clientPhone}?text=${encodeURIComponent(`Hola ${clientName}, aquí tienes tu cotización: ${window.location.origin}/quote/${createdToken}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 text-white font-bold px-4 py-2 rounded shadow hover:bg-green-500"
              >
                Enviar por WhatsApp
              </a>
              <button 
                onClick={() => router.push('/dashboard/quotes')} 
                className="bg-navy-900 text-white font-bold px-4 py-2 rounded"
              >
                Ir a Cotizaciones
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selección de Ítems */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-navy-900 mb-3">Catálogo Disponible</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {inventory.map(item => {
                  const isOut = item.item_type === 'product' && item.stock <= 0;
                  return (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.sku} | ${item.price.toFixed(2)}</p>
                      </div>
                      {isOut ? (
                        <span className="text-xs font-bold text-brandRed-600 bg-red-100 px-2 py-1 rounded">
                          AGOTADO
                        </span>
                      ) : (
                        <button
                          onClick={() => addItemToQuote(item)}
                          className="text-xs bg-navy-900 text-white px-3 py-1 rounded"
                        >
                          + Agregar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hoja Resumen */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-navy-900 mb-3">Resumen de Cotización</h2>
                
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nombre del Cliente *"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Teléfono (WhatsApp)"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>

                <div className="border-t pt-3 space-y-2 max-h-48 overflow-y-auto">
                  {selectedItems.map(i => (
                    <div key={i.item_id} className="flex justify-between text-sm">
                      <span>{i.item_name} (x{i.quantity})</span>
                      <div className="flex gap-2">
                        <span>${i.subtotal.toFixed(2)}</span>
                        <button onClick={() => removeItem(i.item_id)} className="text-brandRed-600 font-bold">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <label>Impuesto (%):</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={e => setTaxRate(Number(e.target.value))}
                    className="w-20 p-1 border rounded text-right"
                  />
                </div>
                <div className="flex justify-between font-bold text-navy-900 text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCreateQuote}
                  disabled={loading || selectedItems.length === 0 || !clientName}
                  className="w-full mt-4 bg-navy-900 text-white font-bold py-2 rounded disabled:bg-gray-400"
                >
                  {loading ? 'Generando...' : 'Finalizar y Crear Cotización'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
