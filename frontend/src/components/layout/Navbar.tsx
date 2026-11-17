import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { cn } from '../../lib/utils';
import { Monogram } from '../ui/Monogram';
import { useLenis, useScrollTo } from './SmoothScroll';

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof NAV_LINKS)[number]['id'];

/** Navigates to a home-page section from anywhere (smooth-scrolls when already on "/"). */
export function useSectionNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTo = useScrollTo();
  return (id: string) => (event: MouseEvent) => {
    event.preventDefault();
    if (location.pathname === '/') scrollTo(id);
    else void navigate('/', { state: { scrollTo: id } });
  };
}

export function Navbar() {
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const goTo = useSectionNavigation();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 40);
    setHidden(current > previous && current > 320 && !open);
  });

  // Freeze page scroll while the mobile menu is open.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            'transition-[background-color,border-color,backdrop-filter] duration-700',
            scrolled
              ? 'border-b border-gold/10 bg-ink/70 backdrop-blur-xl'
              : 'border-b border-transparent',
          )}
        >
          <nav
            className="section flex h-18 items-center justify-between sm:h-20"
            aria-label="Primary"
          >
            <Link to="/" className="flex items-center gap-3" aria-label="Jomel — home">
              <Monogram className="size-9" />
              <span className="hidden font-display text-xl tracking-wide text-ivory sm:inline">
                Jomel
              </span>
            </Link>

            <ul className="hidden items-center gap-10 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    onClick={goTo(link.id)}
                    className="group relative py-2 text-[0.72rem] font-semibold tracking-[0.28em] text-stone uppercase transition-colors duration-300 hover:text-ivory focus-visible:text-ivory"
                  >
                    {link.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="/#contact"
                onClick={goTo('contact')}
                className="hidden rounded-full border border-gold/40 px-5 py-2.5 text-[0.72rem] font-semibold tracking-[0.22em] text-gold uppercase transition-colors duration-500 hover:bg-gold hover:text-ink sm:inline-flex"
              >
                Let&apos;s talk
              </a>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full border border-gold/25 text-ivory lg:hidden"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="section space-y-3">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.6 }}
                >
                  <a
                    href={`/#${link.id}`}
                    onClick={(event) => {
                      setOpen(false);
                      goTo(link.id)(event);
                    }}
                    className="flex items-baseline gap-5 py-2 font-display text-5xl text-ivory sm:text-6xl"
                  >
                    <span className="font-sans text-xs tracking-[0.3em] text-gold">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
