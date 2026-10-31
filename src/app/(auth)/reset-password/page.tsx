'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/lib/constants';
import { AuthShell, Field, Form, Primary, Tick } from '@/components/auth/AuthShell';

/* Reached from the reset email (via /auth/callback), which signs the visitor in for this one step. */
export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<{ text: string; expired?: boolean } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError({ text: 'Use at least 8 characters.' });
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return setError({ text: 'This reset link has expired or was already used.', expired: true });
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
    } catch (err) {
      setError({ text: err instanceof Error ? err.message : 'We couldn’t save the password. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell context={false} info={{ kind: 'direct', redirect: ROUTES.APP.DASHBOARD, back: { href: ROUTES.AUTH.LOGIN, label: 'Back to log in' } }}>
      {done ? (
        <Form as="div">
          <div className="done" role="status">
            <Tick />
            <h1>Password saved.</h1>
            <p>You’re logged in with your new password.</p>
            <Primary as={Link} href={ROUTES.APP.DASHBOARD} style={{ display: 'grid', placeItems: 'center', width: '100%', textDecoration: 'none' }}>Go to your dashboard</Primary>
          </div>
        </Form>
      ) : (
        <Form onSubmit={submit} noValidate>
          <p className="k">Password</p>
          <h1>Choose a new password.</h1>
          <Field id="password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 8 characters" hint="At least 8 characters. A short sentence is easy to remember and hard to guess." />
          {error && (
            <p className="err" role="alert">
              {error.text}{error.expired && <> <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>Send a new link →</Link></>}
            </p>
          )}
          <Primary type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save the new password'}</Primary>
        </Form>
      )}
    </AuthShell>
  );
}
