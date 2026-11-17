import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

export type AdminAuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  /** Password accepted; a TOTP code (or enrollment) is still required to reach aal2. */
  | { status: 'mfa'; email: string }
  | { status: 'ready'; email: string };

/** Tracks the Supabase session and its authenticator assurance level. */
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      setState({ status: 'signedOut' });
      return;
    }
    const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const email = session.user.email ?? '';
    if (error) {
      setState({ status: 'signedOut' });
      return;
    }
    setState(aal.currentLevel === 'aal2' ? { status: 'ready', email } : { status: 'mfa', email });
  }, []);

  useEffect(() => {
    // Supabase emits INITIAL_SESSION on subscribe, so this also performs the first check.
    const { data } = supabase.auth.onAuthStateChange(() => {
      // Defer: calling Supabase from inside this callback can deadlock the auth lock.
      window.setTimeout(() => void refresh(), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ status: 'signedOut' });
  }, []);

  return { state, signOut };
}
