import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { Fragment, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { cn, wrap } from '../../lib/utils';

interface RibbonProps {
  phrases: readonly string[];
  /** Base drift in % of one copy's width per second. */
  baseVelocity?: number;
  className?: string;
}

/**
 * Infinitely flowing marquee band. Speed follows scroll velocity (eases back to idle) and the
 * direction flips with the scroll direction. Alternates serif italic / sans caps phrases,
 * separated by gold ✦ glyphs. Static when the user prefers reduced motion.
 */
export function Ribbon({ phrases, baseVelocity = -2.2, className }: RibbonProps) {
  const reduced = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const direction = useRef(1);
  // Four copies; the track is shifted between 0% and -25% (exactly one copy) and wraps.
  const x = useTransform(baseX, (value) => `${wrap(-25, 0, value)}%`);

  useAnimationFrame((_time, delta) => {
    if (reduced) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += direction.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  const copy = (key: number) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key > 0}>
      {phrases.map((phrase, i) => (
        <Fragment key={phrase}>
          <span
            className={cn(
              'px-6 whitespace-nowrap sm:px-9',
              i % 2 === 0
                ? 'font-display text-2xl text-ivory italic sm:text-4xl'
                : 'font-sans text-[0.72rem] font-semibold tracking-[0.35em] text-stone uppercase sm:text-sm',
            )}
          >
            {phrase}
          </span>
          <span className="text-sm text-gold sm:text-base" aria-hidden="true">
            ✦
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        'glass overflow-hidden border-x-0 py-3.5 shadow-[0_20px_60px_-20px_rgba(15,27,51,0.16)] sm:py-5',
        className,
      )}
    >
      <motion.div className="flex w-max will-change-transform" style={reduced ? undefined : { x }}>
        {[0, 1, 2, 3].map(copy)}
      </motion.div>
    </div>
  );
}
