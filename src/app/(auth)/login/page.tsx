'use client';

import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { Turnstile, type TurnstileRef } from '@/components/ui/Turnstile';
import { AuthShell, Field, Form, GoogleButton, Primary } from '@/components/auth/AuthShell';
import { contextCopy, useAuthContext } from '@/components/auth/context';

const needsCaptcha = () => !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.NODE_ENV !== 'development';

function LoginForm() {
  const info = useAuthContext();
  const copy = contextCopy(info);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileRef>(null);

  useEffect(() => {
    if (!loading && user) router.replace(info.redirect);
  }, [loading, user, info.redirect, router]);

  const signupHref = info.redirect === ROUTES.APP.DASHBOARD ? ROUTES.AUTH.SIGNUP : `${ROUTES.AUTH.SIGNUP}?redirect=${encodeURIComponent(info.redirect)}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (needsCaptcha() && !token) return setError('One moment: we’re checking you’re not a bot. Try again in a second.');
    setBusy(true);
    try {
      await signIn(email.trim(), password, token);
      // A full load, so every part of the app sees the new session.
      window.location.href = info.redirect;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We couldn’t log you in. Please try again.');
      turnstile.current?.reset();
      setToken(null);
      setBusy(false);
    }
  };

  return (
    <AuthShell info={info}>
      <Form onSubmit={submit} noValidate>
        <p className="k">{copy.eyebrow}</p>
        <h1>{copy.login.title}</h1>
        <GoogleButton onClick={() => { setGoogleBusy(true); signInWithGoogle(info.redirect); }} busy={googleBusy} />
        <div className="or">or</div>
        <Field id="email" label="Email" type="email" inputMode="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@school.edu" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" aside={<Link href={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot password?</Link>} />
        <Turnstile ref={turnstile} onVerify={setToken} onError={() => setToken(null)} onExpire={() => setToken(null)} />
        {error && <p className="err" role="alert">{error}</p>}
        <Primary type="submit" disabled={busy || googleBusy}>{busy ? 'Logging in…' : copy.login.button}</Primary>
        <p className="switch">New here? <Link href={signupHref}>Create a free account</Link></p>
      </Form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
