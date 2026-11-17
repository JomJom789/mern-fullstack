import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Cursor } from '../ui/Cursor';
import { useLenis } from './SmoothScroll';

/** Resets scroll on navigation (Lenis-aware) unless the target state asks for a section. */
function ScrollManager() {
  const location = useLocation();
  const pathname = location.pathname;
  const state: unknown = location.state;
  const lenis = useLenis();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Only real page changes reset scroll (not state updates on the same page).
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const target = (state as { scrollTo?: string } | null)?.scrollTo;
    if (target) return; // HomePage handles section scrolling once it has rendered.
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname, state, lenis]);

  return null;
}

export function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Outlet />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
