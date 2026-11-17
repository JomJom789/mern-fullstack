import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Toaster, toast } from 'sonner';
import { Seo } from '../../components/seo/Seo';
import { Monogram } from '../../components/ui/Monogram';
import { env } from '../../lib/env';
import NotFoundPage from '../../pages/NotFoundPage';
import { LoginForm } from '../auth/LoginForm';
import { MfaStep } from '../auth/MfaStep';
import { useAdminAuth } from '../auth/useAdminAuth';
import { useIdleTimeout } from '../auth/useIdleTimeout';
import { adminKeys, useAdminSession } from './api';
import { Dashboard } from './Dashboard';

const IDLE_TIMEOUT_MS = 30 * 60_000;

function Centered({ children }: { children: ReactNode }) {
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-16"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,97,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      {children}
    </main>
  );
}

function Spinner() {
  return (
    <Centered>
      <Loader2 className="size-7 animate-spin text-gold" aria-label="Loading" />
    </Centered>
  );
}

function AuthCard({ children }: { children: ReactNode }) {
  return (
    <Centered>
      <div className="glass w-full max-w-sm rounded-3xl p-8">
        <Monogram className="size-11" />
        <h1 className="mt-6 font-display text-4xl text-ivory">Studio</h1>
        <p className="mt-1 text-sm text-stone">Private area.</p>
        <div className="mt-8">{children}</div>
      </div>
    </Centered>
  );
}

/**
 * Hidden, lazy-loaded admin. Flow: password → TOTP (aal2) → backend check → dashboard.
 * Any failed backend check, and any sub-path, renders the ordinary 404 page.
 */
function AdminContent() {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { state, signOut } = useAdminAuth();
  const ready = state.status === 'ready';
  const session = useAdminSession(ready);

  const handleSignOut = useCallback(async () => {
    await signOut();
    queryClient.removeQueries({ queryKey: adminKeys.all });
    queryClient.removeQueries({ queryKey: adminKeys.session() });
  }, [signOut, queryClient]);

  const signedIn = state.status === 'ready' || state.status === 'mfa';
  useIdleTimeout(
    () => {
      void handleSignOut();
      toast('Signed out after 30 minutes of inactivity.');
    },
    IDLE_TIMEOUT_MS,
    signedIn,
  );

  // A valid session that the API refuses (wrong account, not in admins) is signed out.
  // The 404 then sticks for the rest of this visit instead of bouncing back to the login form.
  const rejected = ready && session.isError;
  const [denied, setDenied] = useState(false);
  if (rejected && !denied) setDenied(true);
  useEffect(() => {
    if (rejected) void handleSignOut();
  }, [rejected, handleSignOut]);

  const isAdminRoot = pathname.replace(/\/+$/, '') === env.adminPath;
  if (!isAdminRoot || denied) return <NotFoundPage />;

  const seo = <Seo title="Studio" description="Private area." path={env.adminPath} noindex />;

  if (state.status === 'loading')
    return (
      <>
        {seo}
        <Spinner />
      </>
    );

  if (state.status === 'signedOut') {
    return (
      <>
        {seo}
        <AuthCard>
          <LoginForm />
        </AuthCard>
      </>
    );
  }

  if (state.status === 'mfa') {
    return (
      <>
        {seo}
        <AuthCard>
          <MfaStep onCancel={() => void handleSignOut()} />
        </AuthCard>
      </>
    );
  }

  if (session.isPending)
    return (
      <>
        {seo}
        <Spinner />
      </>
    );

  return (
    <>
      {seo}
      <Dashboard email={state.email} onSignOut={() => void handleSignOut()} />
    </>
  );
}

/** Toasts are mounted for the whole admin area (including the idle sign-out notice). */
export default function AdminApp() {
  return (
    <>
      <AdminContent />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#121214',
            border: '1px solid rgba(201,169,97,0.25)',
            color: '#F5F1E8',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </>
  );
}
