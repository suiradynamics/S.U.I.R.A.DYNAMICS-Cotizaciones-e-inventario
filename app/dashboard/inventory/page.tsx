'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { InventoryItem, ItemType } from '@/lib/types';
import Link from 'next/link';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para formulario de nuevo ítem
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [itemType, setItemType] = useState<ItemType>('product');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [imageUrl, setImageUrl] = useState('');
  
  // Estado para el modal de contraseña de supervisor (eliminación)
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [supervisorPassword, setSupervisorPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const { data } = await supabase.from('inventory').select('*').order('name');
    if (data) setItems(data);
    setLoading(false);
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('inventory').insert([{
      user_id: user.id,
      name,
      sku,
      category: category || 'General',
      item_type: itemType,
      price,
      stock: itemType === 'product' ? stock : 0,
      min_stock_alert: itemType === 'product' ? minStockAlert : 0,
      image_url: imageUrl || null
    }]);

    if (!error) {
      setName('');
      setSku('');
      setCategory('');
      setPrice(0);
      setStock(0);
      setImageUrl('');
      fetchInventory();
    }
  };

  const verifyAndDelete = async () => {
    if (!itemToDelete) return;
    setDeleteError(null);

    // Verificación de contraseña del usuario actual en Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      setDeleteError('Sesión no válida.');
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: supervisorPassword,
    });

    if (authError) {
      setDeleteError('Contraseña de supervisor incorrecta.');
      return;
    }

    // Si la contraseña es correcta, procede a eliminar
    const { error } = await supabase.from('inventory').delete().eq('id', itemToDelete.id);
    if (!error) {
      setItemToDelete(null);
      setSupervisorPassword('');
      fetchInventory();
    } else {
      setDeleteError('Error al eliminar de la base de datos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Gestión de Inventario y Servicios</h1>
            <p className="text-sm text-gray-600">S.U.I.R.A. Dynamics Commercial Hub</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Volver al Panel
          </Link>
        </div>

        {/* Formulario para Agregar Nuevo Ítem */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Registrar Nuevo Producto o Servicio</h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nombre del ítem *"
              value={name}
              onChange={e => setName(e.target.value)}
              className="p-2 border rounded text-sm"
              required
            />
            <input
              type="text"
              placeholder="SKU o Código *"
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="p-2 border rounded text-sm"
              required
            />
            <input
              type="text"
              placeholder="Categoría / Área (Ej: Ferretería)"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="p-2 border rounded text-sm"
            />
            <select
              value={itemType}
              onChange={e => setItemType(e.target.value as ItemType)}
              className="p-2 border rounded text-sm"
            >
              <option value="product">Producto Físico (Con Stock)</option>
              <option value="service">Servicio (Sin Stock)</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Precio ($) *"
              value={price || ''}
              onChange={e => setPrice(Number(e.target.value))}
              className="p-2 border rounded text-sm"
              required
            />
            {itemType === 'product' && (
              <>
                <input
                  type="number"
                  placeholder="Stock inicial *"
                  value={stock || ''}
                  onChange={e => setStock(Number(e.target.value))}
                  className="p-2 border rounded text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Alerta de Stock Mínimo"
                  value={minStockAlert || ''}
                  onChange={e => setMinStockAlert(Number(e.target.value))}
                  className="p-2 border rounded text-sm"
                />
              </>
            )}
            <input
              type="url"
              placeholder="URL de Imagen (Opcional)"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="p-2 border rounded text-sm md:col-span-2"
            />
            <button
              type="submit"
              className="md:col-span-3 bg-navy-900 text-white font-bold py-2.5 rounded hover:bg-navy-800 transition text-sm"
            >
              + Guardar en el Inventario
            </button>
          </form>
        </div>

        {/* Tabla de Listado */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Cargando inventario...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No hay productos ni servicios registrados todavía.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Ítems</th>
                  <th className="px-6 py-3 text-left font-semibold">SKU / Área</th>
                  <th className="px-6 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-right font-semibold">Precio</th>
                  <th className="px-6 py-3 text-center font-semibold">Stock / Alerta</th>
                  <th className="px-6 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => {
                  const isLowStock = item.item_type === 'product' && item.stock <= item.min_stock_alert;
                  return (
                    <tr key={item.id} className={isLowStock ? 'bg-red-50/50' : ''}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded border" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-gray-700">{item.sku}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${item.item_type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {item.item_type === 'product' ? 'Producto' : 'Servicio'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        {item.item_type === 'product' ? (
                          <div>
                            <span className={`font-bold ${item.stock === 0 ? 'text-brandRed-600' : isLowStock ? 'text-yellow-600' : 'text-gray-900'}`}>
                              {item.stock} unids.
                            </span>
                            {isLowStock && <p className="text-[10px] text-brandRed-600 font-semibold">⚠️ Stock Bajo</p>}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="bg-red-100 text-brandRed-600 hover:bg-red-200 px-3 py-1.5 rounded text-xs font-bold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal de Seguridad (Contraseña Gerencial para Eliminar) */}
        {itemToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 className="text-lg font-bold text-navy-900 mb-2">Restricción de Seguridad</h3>
              <p className="text-sm text-gray-600 mb-4">
                Para eliminar <span className="font-semibold text-gray-900">{itemToDelete.name}</span> del inventario, se requiere introducir la contraseña de supervisor/cuenta:
              </p>
              {deleteError && (
                <div className="mb-4 bg-red-50 text-brandRed-600 p-3 rounded text-sm">
                  {deleteError}
                </div>
              )}
              <input
                type="password"
                placeholder="Contraseña de supervisor"
                value={supervisorPassword}
                onChange={e => setSupervisorPassword(e.target.value)}
                className="w-full p-2 border rounded text-sm mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setItemToDelete(null); setSupervisorPassword(''); setDeleteError(null); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={verifyAndDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700"
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
