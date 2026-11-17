import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, type ComponentProps, type PointerEvent, type ReactNode } from 'react';
import { useIsTouch, usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/utils';

type Variant = 'gold' | 'ghost';

interface MagneticButtonProps extends Omit<ComponentProps<'a'>, 'children' | 'ref'> {
  children: ReactNode;
  variant?: Variant;
  /** Pull strength as a fraction of the pointer offset. */
  strength?: number;
}

const variants: Record<Variant, string> = {
  gold: 'text-ink bg-[image:var(--gold-gradient)] shadow-[0_10px_40px_-12px_rgba(201,169,97,0.55)]',
  ghost: 'text-ivory hairline bg-ivory/[0.02] hover:bg-ivory/[0.05]',
};

/** Anchor that is gently attracted to the cursor. Static on touch and reduced-motion. */
export function MagneticButton({
  children,
  variant = 'gold',
  strength = 0.35,
  className,
  onPointerMove,
  onPointerLeave,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const enabled = !isTouch && !reduced;
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const innerX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const innerY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const handleMove = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(event);
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
    innerX.set(dx * strength * 0.4);
    innerY.set(dy * strength * 0.4);
  };

  const handleLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(event);
    x.set(0);
    y.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      style={enabled ? { x, y } : undefined}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold tracking-[0.08em] transition-[background-color,box-shadow] duration-500 sm:px-9 sm:py-5',
        variants[variant],
        className,
      )}
      {...(rest as ComponentProps<typeof motion.a>)}
    >
      <motion.span
        className="relative z-10 inline-flex items-center gap-3"
        style={enabled ? { x: innerX, y: innerY } : undefined}
      >
        {children}
      </motion.span>
    </motion.a>
  );
}
