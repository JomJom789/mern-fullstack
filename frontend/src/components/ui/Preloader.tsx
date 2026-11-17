import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useIntro } from '../layout/Intro';

const J_PATH = 'M70 28v64c0 19-12.5 30-30 30-13 0-23-6.5-27-17';
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

/** Monogram "J" draws in gold, then a two-panel curtain lifts to reveal the hero. */
export function Preloader() {
  const { done, finish } = useIntro();
  const reduced = useReducedMotion();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => setDrawn(true), reduced ? 250 : 1500);
    return () => window.clearTimeout(id);
  }, [done, reduced]);

  useEffect(() => {
    if (!drawn) return;
    const id = window.setTimeout(finish, reduced ? 150 : 350);
    return () => window.clearTimeout(id);
  }, [drawn, finish, reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[80] flex items-center justify-center"
          exit={{ opacity: reduced ? 0 : 1 }}
          transition={{ duration: reduced ? 0.3 : 1.2 }}
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading</span>
          {/* Curtain panels slide away (transform only). */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            exit={reduced ? { opacity: 0 } : { y: '-100%' }}
            transition={{ duration: 1.1, ease: CURTAIN_EASE }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            exit={reduced ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: 1.1, ease: CURTAIN_EASE }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-6"
            exit={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
            transition={{ duration: 0.45 }}
          >
            <svg viewBox="0 0 100 140" className="h-28 w-20 sm:h-36 sm:w-24" aria-hidden="true">
              <defs>
                <linearGradient id="preloader-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E6CF97" />
                  <stop offset="0.5" stopColor="#C9A961" />
                  <stop offset="1" stopColor="#9C7F3F" />
                </linearGradient>
              </defs>
              <motion.path
                d={J_PATH}
                fill="none"
                stroke="url(#preloader-gold)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 0 : 1 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduced ? 0.2 : 1.35, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
            <motion.span
              className="label-caps text-gold/80"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.6, duration: 0.6 }}
            >
              Jomel · Portfolio
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
