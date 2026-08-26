// name=app/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';

export default function LoginPage() {
  // ...
  const [oauthLoading, setOauthLoading] = useState<Provider | null>(null);
  // ...
  const handleOAuthLogin = async (provider: Provider) => {
    setOauthLoading(provider);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };
  // ...
}
