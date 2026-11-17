import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { env } from '../../lib/env';
import { attemptsLeft, lockRemainingMs, recordFailure, recordSuccess } from './lockout';
import { supabase } from './supabase';
import { Turnstile, type TurnstileHandle } from './Turnstile';

const loginSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email('Enter a valid email')),
  password: z.string().min(1, 'Enter your password').max(256),
});
type LoginValues = z.infer<typeof loginSchema>;

function formatRemaining(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [lockMs, setLockMs] = useState(lockRemainingMs);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  const captchaRequired = Boolean(env.turnstileSiteKey);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Tick the lockout countdown.
  useEffect(() => {
    if (lockMs <= 0) return;
    const id = window.setInterval(() => setLockMs(lockRemainingMs()), 1000);
    return () => window.clearInterval(id);
  }, [lockMs]);

  const locked = lockMs > 0;

  const submit = async ({ email, password }: LoginValues) => {
    if (lockRemainingMs() > 0) return;
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
      ...(captchaToken ? { options: { captchaToken } } : {}),
    });
    turnstile.current?.reset();

    if (signInError) {
      recordFailure();
      resetField('password');
      const remaining = lockRemainingMs();
      setLockMs(remaining);
      if (remaining > 0) setError('Too many failed attempts. Sign-in is paused for 15 minutes.');
      else if (signInError.status === 429)
        setError('Too many attempts. Please wait before trying again.');
      else
        setError(
          `Invalid credentials. ${attemptsLeft()} attempt${attemptsLeft() === 1 ? '' : 's'} left.`,
        );
      return;
    }
    recordSuccess();
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(submit)(event)}
      noValidate
      className="space-y-6"
      aria-label="Sign in"
    >
      <div>
        <label htmlFor="login-email" className="label-caps">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          className="field-luxe mt-2"
          aria-invalid={Boolean(errors.email)}
          disabled={locked}
          {...register('email')}
        />
        {errors.email ? <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p> : null}
      </div>
      <div>
        <label htmlFor="login-password" className="label-caps">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className="field-luxe mt-2"
          aria-invalid={Boolean(errors.password)}
          disabled={locked}
          {...register('password')}
        />
        {errors.password ? (
          <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>
        ) : null}
      </div>

      {env.turnstileSiteKey ? (
        <Turnstile ref={turnstile} siteKey={env.turnstileSiteKey} onToken={setCaptchaToken} />
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || locked || (captchaRequired && !captchaToken)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gold-gradient)] px-6 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Lock className="size-4" aria-hidden="true" />
        )}
        {locked ? `Locked — try again in ${formatRemaining(lockMs)}` : 'Continue'}
      </button>
    </form>
  );
}
