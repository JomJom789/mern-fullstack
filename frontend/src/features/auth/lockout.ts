/**
 * Client-side login throttle: after 5 failed attempts the form locks for 15 minutes.
 * Kept in memory on purpose (a refresh resets it) — this is a UX speed bump; Supabase Auth's
 * own server-side rate limits are the real enforcement.
 */
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60_000;

let failures = 0;
let lockedUntil = 0;

export function lockRemainingMs(now = Date.now()): number {
  return Math.max(0, lockedUntil - now);
}

export function recordFailure(now = Date.now()): void {
  failures += 1;
  if (failures >= MAX_FAILURES) {
    lockedUntil = now + LOCK_MS;
    failures = 0;
  }
}

export function recordSuccess(): void {
  failures = 0;
  lockedUntil = 0;
}

export function attemptsLeft(): number {
  return MAX_FAILURES - failures;
}
