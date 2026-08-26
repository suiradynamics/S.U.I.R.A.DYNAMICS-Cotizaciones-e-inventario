'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      alert('¡Registro exitoso! Revisa tu correo para verificar tu cuenta o inicia sesión.');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error en el registro.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 shadow-sm text-gray-900">
          S.U.I.R.A. Dynamics &nbsp;
          <code className="font-bold">Cotizaciones e Inventario</code>
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8 my-8 text-gray-900">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-500 transition-all"
            >
              {loading ? 'Procesando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
        >
          Continuar con Google
        </button>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-center">¿No tienes cuenta?</h3>
          <form onSubmit={handleRegister} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 text-white font-semibold rounded-lg text-sm hover:bg-gray-800 transition-all"
            >
              {loading ? 'Procesando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
