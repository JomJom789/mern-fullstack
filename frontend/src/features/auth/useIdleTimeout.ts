import { useEffect, useRef } from 'react';

const EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'] as const;

/** Calls `onIdle` after `timeoutMs` without user activity (tab visibility counts). */
export function useIdleTimeout(onIdle: () => void, timeoutMs: number, enabled = true) {
  const callback = useRef(onIdle);
  useEffect(() => {
    callback.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    if (!enabled) return;
    let lastActivity = Date.now();
    let timer = 0;

    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const idleFor = Date.now() - lastActivity;
        if (idleFor >= timeoutMs) callback.current();
        else schedule(timeoutMs - idleFor);
      }, delay);
    };
    const onActivity = () => {
      lastActivity = Date.now();
    };
    // Timers are throttled in background tabs; re-check when the tab becomes visible.
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastActivity >= timeoutMs) {
        callback.current();
      }
    };

    for (const event of EVENTS) window.addEventListener(event, onActivity, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    schedule(timeoutMs);
    return () => {
      window.clearTimeout(timer);
      for (const event of EVENTS) window.removeEventListener(event, onActivity);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [timeoutMs, enabled]);
}
