'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email ?? 'Usuario');
      }
    }
    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">
                S.U.I.R.A. Dynamics - Panel Principal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <h3 className="text-lg font-medium text-gray-900">Inventario Activo</h3>
              <p className="mt-1 text-3xl font-semibold text-blue-600">0</p>
              <p className="mt-2 text-sm text-gray-500">Productos y servicios registrados</p>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <h3 className="text-lg font-medium text-gray-900">Cotizaciones Emitidas</h3>
              <p className="mt-1 text-3xl font-semibold text-green-600">0</p>
              <p className="mt-2 text-sm text-gray-500">Documentos generados este mes</p>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <h3 className="text-lg font-medium text-gray-900">Clientes Registrados</h3>
              <p className="mt-1 text-3xl font-semibold text-purple-600">0</p>
              <p className="mt-2 text-sm text-gray-500">Base de datos comercial</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
