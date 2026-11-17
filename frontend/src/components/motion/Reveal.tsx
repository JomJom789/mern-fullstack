import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Blur-to-sharp. Disabled automatically for reduced motion. */
  blur?: boolean;
  once?: boolean;
}

/** Fade-up + blur-to-sharp section reveal, triggered when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  blur = true,
  once = true,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }
      }
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduced ? 0.4 : 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
