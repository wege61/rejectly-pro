'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, signInWithGoogle } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { Turnstile, type TurnstileRef } from '@/components/ui/Turnstile';
import { AuthShell, Field, Form, GoogleButton, Primary } from '@/components/auth/AuthShell';
import { contextCopy, useAuthContext } from '@/components/auth/context';

const needsCaptcha = () => !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.NODE_ENV !== 'development';

export default function SignupPage() {
  const info = useAuthContext();
  const copy = contextCopy(info);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<{ text: string; taken?: boolean } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileRef>(null);

  // Already signed in: go where they were headed.
  useEffect(() => {
    if (!loading && user) router.replace(info.redirect);
  }, [loading, user, info.redirect, router]);

  const loginHref = info.redirect === ROUTES.APP.DASHBOARD ? ROUTES.AUTH.LOGIN : `${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(info.redirect)}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError({ text: 'Add your name.' });
    if (password.length < 8) return setError({ text: 'Use at least 8 characters for your password.' });
    if (needsCaptcha() && !token) return setError({ text: 'One moment: we’re checking you’re not a bot. Try again in a second.' });

    setBusy(true);
    try {
      await signUp(email.trim(), password, name.trim(), token);
      router.push(info.redirect);
    } catch (err) {
      const text = err instanceof Error ? err.message : 'We couldn’t create your account. Please try again.';
      setError({ text, taken: /already exists/i.test(text) });
      turnstile.current?.reset();
      setToken(null);
    } finally {
      setBusy(false);
    }
  };

  const google = () => {
    setGoogleBusy(true);
    signInWithGoogle(info.redirect);
  };

  const [a, mark, b] = copy.signup.title;
  return (
    <AuthShell info={info}>
      <Form onSubmit={submit} noValidate>
        <p className="k">{copy.eyebrow}</p>
        <h1>{a}<mark>{mark}</mark>{b}</h1>
        <p className="lead">{copy.signup.lead}</p>
        <GoogleButton onClick={google} busy={googleBusy} />
        <div className="or">or</div>
        <Field id="name" label="Name" value={name} onChange={setName} autoComplete="name" placeholder="Your name" />
        <Field id="email" label="Email" type="email" inputMode="email" value={email} onChange={(v) => { setEmail(v); setError(null); }} autoComplete="email" placeholder="you@school.edu" invalid={error?.taken} />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 8 characters" />
        <Turnstile ref={turnstile} onVerify={setToken} onError={() => setToken(null)} onExpire={() => setToken(null)} />
        {error && (
          <p className="err" role="alert">
            {error.text}{error.taken && <> <Link href={loginHref}>Log in instead →</Link></>}
          </p>
        )}
        <Primary type="submit" disabled={busy || googleBusy}>{busy ? 'Creating your account…' : copy.signup.button}</Primary>
        <p className="legal">By creating an account you agree to the <Link href={ROUTES.PUBLIC.TERMS}>Terms</Link> and <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy Policy</Link>.</p>
        <p className="switch">Already have an account? <Link href={loginHref}>Log in</Link></p>
      </Form>
    </AuthShell>
  );
}
