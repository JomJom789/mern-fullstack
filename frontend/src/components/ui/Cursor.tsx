import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { useIsTouch, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const LAGGING = { stiffness: 260, damping: 28, mass: 0.6 };
const INSTANT = { stiffness: 2000, damping: 100 };

/**
 * Gold dot + lagging ring. Elements with `data-cursor="view"` grow the ring and show "View".
 * Not rendered on touch devices; with reduced motion the ring follows without lag.
 */
export function Cursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, reduced ? INSTANT : LAGGING);
  const ringY = useSpring(y, reduced ? INSTANT : LAGGING);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (isTouch) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor]') : null;
      const value = target?.dataset.cursor;
      setLabel(value === 'view' ? 'View' : (value ?? null));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;

  const active = label !== null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        className="absolute top-0 left-0 -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-gold"
        style={{ x, y }}
        animate={{ opacity: visible && !active ? 1 : 0, scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute top-0 left-0 -mt-11 -ml-11 flex size-22 items-center justify-center rounded-full border border-gold/60"
        style={{ x: ringX, y: ringY }}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: active ? 1 : pressed ? 0.3 : 0.4,
          backgroundColor: active ? 'rgba(37,99,235,0.92)' : 'rgba(37,99,235,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <motion.span
          className="text-[0.7rem] font-semibold tracking-[0.25em] text-ink uppercase"
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </div>
  );
}
