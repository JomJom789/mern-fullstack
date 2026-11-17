import { motion, useReducedMotion } from 'motion/react';
import { Fragment } from 'react';
import { cn } from '../../lib/utils';

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

interface SplitTextProps {
  text: string;
  as?: keyof typeof MOTION_TAGS;
  className?: string;
  wordClassName?: (word: string, index: number) => string | undefined;
  /** Start animating (e.g. after the preloader). */
  play?: boolean;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view instead of on `play`. */
  inView?: boolean;
}

/**
 * Per-word mask reveal: each word sits in an overflow-hidden span and slides up into place.
 * Screen readers get the sentence once, from a visually hidden copy.
 */
export function SplitText({
  text,
  as = 'span',
  className,
  wordClassName,
  play = true,
  delay = 0,
  stagger = 0.08,
  inView = false,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
  };
  const word = {
    hidden: reduced ? { opacity: 0 } : { y: '110%', opacity: 0 },
    show: {
      y: '0%',
      opacity: 1,
      transition: { duration: reduced ? 0.4 : 1.05, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const MotionTag = MOTION_TAGS[as] as typeof motion.span;
  const trigger = inView
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { animate: play ? 'show' : 'hidden' };

  return (
    <MotionTag className={className} initial="hidden" variants={container} {...trigger}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              variants={word}
              className={cn('inline-block will-change-transform', wordClassName?.(w, i))}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
