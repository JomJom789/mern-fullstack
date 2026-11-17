import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';

interface IntroState {
  /** True once the preloader curtain has lifted (or was skipped). */
  done: boolean;
  finish: () => void;
}

const IntroContext = createContext<IntroState>({ done: true, finish: () => undefined });

const SEEN_KEY = 'jomel:intro-seen';

function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(hasSeenIntro);
  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Storage can be unavailable (private mode); the intro simply plays again next visit.
    }
    setDone(true);
  }, []);
  const value = useMemo(() => ({ done, finish }), [done, finish]);
  return <IntroContext value={value}>{children}</IntroContext>;
}

export const useIntro = () => use(IntroContext);
