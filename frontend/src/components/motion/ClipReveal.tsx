import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left';
}

/** Image curtain reveal using clip-path inset, triggered on scroll. */
export function ClipReveal({ children, className, delay = 0, direction = 'up' }: ClipRevealProps) {
  const reduced = useReducedMotion();
  const hidden = direction === 'up' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)';
  return (
    <motion.div
      className={cn('relative', className)}
      initial={reduced ? { opacity: 0 } : { clipPath: hidden }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: reduced ? 0.4 : 1.4, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}
