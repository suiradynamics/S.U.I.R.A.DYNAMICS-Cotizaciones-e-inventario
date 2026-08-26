'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Contraseña actualizada correctamente.');
      setPassword('');
      setConfirm('');
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '24px auto', padding: 16 }}>
      <h2>Perfil — Establecer / Cambiar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>Nueva contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />

        <label style={{ display: 'block', marginBottom: 8 }}>Confirmar contraseña</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />

        <button type="submit" disabled={loading} style={{ padding: '10px 16px' }}>
          {loading ? 'Guardando...' : 'Guardar contraseña'}
        </button>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
