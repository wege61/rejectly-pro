'use client';

/* Each auth page draws its own frame (components/auth/AuthShell), so the layout adds nothing. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
