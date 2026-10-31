'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
import { Turnstile, type TurnstileRef } from '@/components/ui/Turnstile';
import { AuthShell, Field, Form, Primary, Tick } from '@/components/auth/AuthShell';

const needsCaptcha = () => !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.NODE_ENV !== 'development';

/*
 * The API answers the same way whether or not the email has an account, so this
 * page does too: it never tells anyone which emails are registered.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileRef>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter the email on your account.');
    if (needsCaptcha() && !token) return setError('One moment: we’re checking you’re not a bot. Try again in a second.');
    setBusy(true);
    try {
      await resetPassword(email.trim(), token);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We couldn’t send the link. Please try again.');
      turnstile.current?.reset();
      setToken(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell context={false} info={{ kind: 'direct', redirect: ROUTES.APP.DASHBOARD, back: { href: ROUTES.AUTH.LOGIN, label: 'Back to log in' } }}>
      {sent ? (
        <Form as="div">
          <div className="done" role="status">
            <Tick />
            <h1>Check your email.</h1>
            <p>If there’s an account for <b>{email.trim()}</b>, a link to reset the password is on its way. It can take a minute; check spam too.</p>
            <p className="switch">Didn’t get it? <a href="#" onClick={(e) => { e.preventDefault(); setSent(false); }}>Send it again</a> · <Link href={ROUTES.AUTH.LOGIN}>Back to log in</Link></p>
          </div>
        </Form>
      ) : (
        <Form onSubmit={submit} noValidate>
          <p className="k">Password</p>
          <h1>Reset your password.</h1>
          <p className="lead">Enter the email on your account and we’ll send you a link to choose a new one.</p>
          <Field id="email" label="Email" type="email" inputMode="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@school.edu" />
          <Turnstile ref={turnstile} onVerify={setToken} onError={() => setToken(null)} onExpire={() => setToken(null)} />
          {error && <p className="err" role="alert">{error}</p>}
          <Primary type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send the link'}</Primary>
          <p className="switch"><Link href={ROUTES.AUTH.LOGIN}>Back to log in</Link></p>
        </Form>
      )}
    </AuthShell>
  );
}
