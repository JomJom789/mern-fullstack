import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { recordFailure, lockRemainingMs } from './lockout';
import { supabase } from './supabase';

interface Enrollment {
  factorId: string;
  qrCode: string;
  secret: string;
}

const CODE_REGEX = /^\d{6}$/;

function CodeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <input
      id="mfa-code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{6}"
      maxLength={6}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
      className="field-luxe mt-2 text-center font-mono text-2xl tracking-[0.6em]"
      aria-describedby="mfa-help"
      autoFocus
    />
  );
}

/**
 * Second factor. If the account already has a verified TOTP factor, asks for a code
 * (challenge + verify → aal2). Otherwise enrolls one first, showing the QR code.
 */
export function MfaStep({ onCancel }: { onCancel: () => void }) {
  const [mode, setMode] = useState<'loading' | 'challenge' | 'enroll'>('loading');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error: listError } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;
      if (listError) {
        setError('Could not load your authenticator settings.');
        return;
      }
      const verified = data.totp[0];
      if (verified) {
        setFactorId(verified.id);
        setMode('challenge');
        return;
      }
      // Clean up abandoned (unverified) enrollments before starting a fresh one.
      for (const factor of data.all) {
        if (factor.factor_type === 'totp' && factor.status === 'unverified') {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }
      const { data: enrolled, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Portfolio admin',
      });
      if (cancelled) return;
      if (enrollError) {
        setError(
          'Could not start authenticator setup. Make sure MFA (TOTP) is enabled in Supabase.',
        );
        return;
      }
      setFactorId(enrolled.id);
      setEnrollment({
        factorId: enrolled.id,
        qrCode: enrolled.totp.qr_code,
        secret: enrolled.totp.secret,
      });
      setMode('enroll');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!factorId || !CODE_REGEX.test(code) || lockRemainingMs() > 0) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    setBusy(false);
    if (verifyError) {
      recordFailure();
      setCode('');
      setError(
        lockRemainingMs() > 0
          ? 'Too many failed attempts. Sign-in is paused for 15 minutes.'
          : 'That code did not match. Check your authenticator and try again.',
      );
    }
  };

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="space-y-6"
      aria-label="Two-factor verification"
    >
      <div className="flex items-center gap-3 text-gold">
        <ShieldCheck className="size-5" aria-hidden="true" />
        <p className="label-caps text-gold">
          {mode === 'enroll' ? 'Set up two-factor' : 'Two-factor verification'}
        </p>
      </div>

      {mode === 'loading' && !error ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-gold" aria-label="Loading" />
        </div>
      ) : null}

      {mode === 'enroll' && enrollment ? (
        <div className="space-y-4">
          <p className="text-sm text-stone">
            Scan this QR code with an authenticator app (1Password, Google Authenticator, Authy…),
            then enter the 6-digit code to finish.
          </p>
          <div className="mx-auto w-fit rounded-xl bg-ivory p-3">
            <img src={enrollment.qrCode} alt="Authenticator QR code" className="size-44" />
          </div>
          <p className="text-center text-xs text-stone">
            Can&apos;t scan? Enter this key:{' '}
            <code className="rounded bg-graphite px-1.5 py-0.5 font-mono text-[0.7rem] break-all text-ivory select-all">
              {enrollment.secret}
            </code>
          </p>
        </div>
      ) : null}

      {mode !== 'loading' ? (
        <div>
          <label htmlFor="mfa-code" className="label-caps">
            Authentication code
          </label>
          <CodeInput value={code} onChange={setCode} disabled={busy} />
          <p id="mfa-help" className="mt-2 text-xs text-stone-dark">
            Codes refresh every 30 seconds.
          </p>
        </div>
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        {mode !== 'loading' ? (
          <button
            type="submit"
            disabled={busy || !CODE_REGEX.test(code)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gold-gradient)] px-6 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Verify
          </button>
        ) : null}
        <button type="button" onClick={onCancel} className="text-sm text-stone hover:text-ivory">
          Use a different account
        </button>
      </div>
    </form>
  );
}
