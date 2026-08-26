'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';

export default function HomePage() {
  const [isSignUp, setIsSignUp] = useState(false); // Alterna entre Iniciar sesión y Registrarse
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (isSignUp) {
      // Registro de usuario nuevo
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccessMsg('¡Registro exitoso! Revisa tu correo o inicia sesión.');
        setLoading(false);
      }
    } else {
      // Inicio de sesión normal
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    }
  };

  const handleOAuthLogin = async (provider: Provider) => {
    setOauthLoading(provider);
    setError(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });

    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Cabecera / Presentación de la app */}
      <div className="text-center max-w-xl mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          S.U.I.R.A. Dynamics
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Control total de productos, servicios y generación de cotizaciones profesionales al instante.
        </p>
      </div>

      {/* Tarjeta de Acceso (Login / Registro unificado) */}
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg border border-gray-100">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            {isSignUp ? 'Crea tu cuenta' : 'Ingresa a tu cuenta'}
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            {isSignUp ? 'Registrate para comenzar' : 'Cotizaciones e Inventario'}
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Contraseña"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (isSignUp ? 'Registrarse' : 'Entrar al Sistema')}
            </button>
          </div>
        </form>

        {/* Alternar entre Iniciar Sesión y Registrarse */}
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isSignUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

        {/* Separador */}
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">O continúa con</span>
          </div>
        </div>

        {/* Botón de Google */}
        <div className="mt-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={oauthLoading !== null}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            {oauthLoading === 'google' ? 'Conectando...' : 'Google'}
          </button>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-gray-400">
        Sistema Activo v1.0 • S.U.I.R.A. Dynamics
      </footer>
    </div>
  );
}
