/**
 * A same-site path to send someone after login or signup, or `fallback`.
 * Rejects absolute URLs and protocol-relative ones ("//evil.com"), so a
 * crafted ?redirect= link can't bounce a fresh login to another site.
 */
export function safeRedirect(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
