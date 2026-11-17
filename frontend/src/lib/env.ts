/**
 * Validates the public build-time environment. Written without Zod so the validator does not
 * add weight to the main bundle.
 */
const raw = import.meta.env;
const read = (name: keyof ImportMetaEnv): string => {
  const value: unknown = raw[name];
  return typeof value === 'string' ? value.trim() : '';
};
const problems: string[] = [];

function url(name: keyof ImportMetaEnv, required: boolean): string | undefined {
  const value = read(name);
  if (!value) {
    if (required) problems.push(`${name} is required`);
    return undefined;
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('protocol');
    return value.replace(/\/+$/, '');
  } catch {
    problems.push(`${name} must be an http(s) URL`);
    return undefined;
  }
}

const apiUrl = url('VITE_API_URL', true);
const siteUrl = url('VITE_SITE_URL', false);
const supabaseUrl = url('VITE_SUPABASE_URL', true);
const supabaseAnonKey = read('VITE_SUPABASE_ANON_KEY');
if (supabaseAnonKey.length < 20) problems.push('VITE_SUPABASE_ANON_KEY is required');
const adminPath = read('VITE_ADMIN_PATH');
if (!/^\/[a-z0-9][a-z0-9-]{5,63}$/.test(adminPath)) {
  problems.push('VITE_ADMIN_PATH must look like /studio-8f3k2 (lower-case, 7–65 chars)');
}

if (problems.length > 0) {
  throw new Error(`Invalid frontend environment variables:\n${problems.join('\n')}`);
}

export const env = {
  apiUrl: apiUrl ?? '',
  siteUrl: siteUrl ?? window.location.origin,
  supabaseUrl: supabaseUrl ?? '',
  supabaseAnonKey,
  adminPath,
  turnstileSiteKey: read('VITE_TURNSTILE_SITE_KEY') || undefined,
} as const;
