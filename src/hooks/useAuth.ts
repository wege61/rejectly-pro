'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/lib/constants';
import type { User } from '@supabase/supabase-js';

export function useAuth(redirectTo?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Redirect if no user and redirectTo is specified
      if (!session?.user && redirectTo) {
        router.push(redirectTo);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (!session?.user && redirectTo) {
        router.push(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, redirectTo]);

  return { user, loading };
}