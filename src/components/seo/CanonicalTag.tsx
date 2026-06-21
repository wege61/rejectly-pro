'use client';

import { usePathname } from 'next/navigation';

export function CanonicalTag() {
  const pathname = usePathname();

  // If we are on a private route, don't output a canonical tag
  // (We'll also add noindex to these routes via metadata)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/billing') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/analyze') ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/cover-letters') ||
    pathname.startsWith('/cv')
  ) {
    return null;
  }

  // Remove trailing slashes for canonical (except for root)
  const canonicalPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const canonicalUrl = `https://rejectly.pro${canonicalPath}`;

  return <link rel="canonical" href={canonicalUrl} />;
}
