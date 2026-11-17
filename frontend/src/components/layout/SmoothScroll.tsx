import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true });
    const onTick = (time: number) => instance.raf(time * 1000);
    instance.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    // Publishing the instance created by this effect (an external system) to consumers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  // Async content (project grids, lazy images) changes page height after mount; keep pinned
  // ScrollTrigger sections measured correctly.
  useEffect(() => {
    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return <LenisContext value={lenis}>{children}</LenisContext>;
}

export function useLenis(): Lenis | null {
  return use(LenisContext);
}

/** Scrolls to an element id using Lenis when active, or native scrolling otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string | number, options: { offset?: number; immediate?: boolean } = {}) => {
    const offset = options.offset ?? -24;
    if (lenis) {
      lenis.scrollTo(typeof target === 'number' ? target : `#${target}`, {
        offset,
        immediate: options.immediate ?? false,
        duration: 1.4,
      });
      return;
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'auto' });
      return;
    }
    const el = document.getElementById(target);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  };
}
