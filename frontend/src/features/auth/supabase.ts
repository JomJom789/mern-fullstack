import { createClient } from '@supabase/supabase-js';
import { env } from '../../lib/env';

/**
 * Browser Supabase client — used for authentication only (data goes through the API).
 * Imported exclusively by the lazy admin chunk, so it never ships in the public bundle.
 * Sessions live in sessionStorage: closing the tab signs the owner out.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage,
    storageKey: 'jomel-admin-auth',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
