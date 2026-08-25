'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { InventoryItem } from '@/lib/types';
import Link from 'next/link';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'product' | 'service'>('product');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('inventory').select('*').order('name');
    if (data) setItems(data);
    setLoading(false);
  }

  // Cálculo de valor exacto en inventario
  const totalInventoryValue = items
    .filter(i => i.item_type === 'product')
    .reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

  const handleDelete = async () => {
    if (deletePassword !== 'ADMIN123') { // Contraseña de seguridad configurable
      setDeleteError('Contraseña de seguridad incorrecta.');
      return;
    }

    if (deleteId) {
      const supabase = createClient();
      await supabase.from('inventory').delete().eq('id', deleteId);
      setDeleteId(null);
      setDeletePassword('');
      setDeleteError(null);
      fetchItems();
    }
  };

  const filteredItems = items.filter(i => i.item_type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Catálogo de Inventario y Servicios</h1>
            <p className="text-sm text-gray-600">S.U.I.R.A. Dynamics System</p>
          </div>
          <Link href="/dashboard" className="rounded-md bg-navy-900 px-4 py-2 text-sm text-white font-semibold hover:bg-navy-800">
            Volver al Panel
          </Link>
        </div>

        {/* Métrica de Valor Total */}
        <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border-l-4 border-navy-900">
          <p className="text-sm text-gray-500 font-medium uppercase">Valor Total del Inventario Físico</p>
          <p className="text-3xl font-bold text-navy-900">${totalInventoryValue.toFixed(2)}</p>
        </div>

        {/* Filtros Pestañas */}
        <div className="flex gap-4 mb-4 border-b">
          <button
            onClick={() => setActiveTab('product')}
            className={`pb-2 px-4 font-semibold ${activeTab === 'product' ? 'border-b-2 border-navy-900 text-navy-900' : 'text-gray-400'}`}
          >
            Productos Físicos
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`pb-2 px-4 font-semibold ${activeTab === 'service' ? 'border-b-2 border-navy-900 text-navy-900' : 'text-gray-400'}`}
          >
            Servicios
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Categoría / Área</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Precio Unit.</th>
                {activeTab === 'product' && <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Stock</th>}
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map(item => {
                const isLowStock = item.item_type === 'product' && item.stock <= item.min_stock_alert;
                return (
                  <tr key={item.id} className={isLowStock ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${Number(item.price).toFixed(2)}</td>
                    {activeTab === 'product' && (
                      <td className="px-6 py-4 text-sm font-bold">
                        <span className={isLowStock ? 'text-brandRed-600 font-extrabold' : 'text-gray-900'}>
                          {item.stock} {isLowStock && '⚠️ (Poco Stock)'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-brandRed-600 font-semibold hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Seguridad para Eliminar */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold text-navy-900 mb-2">Requiere Contraseña Administrativa</h3>
            <p className="text-sm text-gray-600 mb-4">Ingresa la clave autorizada para eliminar este ítem del inventario.</p>
            <input
              type="password"
              placeholder="Contraseña de seguridad"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              className="w-full p-2 border rounded mb-3 text-sm"
            />
            {deleteError && <p className="text-xs text-brandRed-600 mb-3">{deleteError}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm bg-gray-200 rounded">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-brandRed-600 text-white rounded">Confirmar Eliminación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
