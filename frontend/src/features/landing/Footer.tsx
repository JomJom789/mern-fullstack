import { ArrowUp } from 'lucide-react';
import { GithubIcon } from '../../components/ui/GithubIcon';
import { NAV_LINKS, useSectionNavigation } from '../../components/layout/Navbar';
import { useScrollTo } from '../../components/layout/SmoothScroll';
import { Reveal } from '../../components/motion/Reveal';
import { Monogram } from '../../components/ui/Monogram';
import { CONTACT } from './contactInfo';

export function Footer() {
  const goTo = useSectionNavigation();
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-gold/10 pt-28 pb-10 sm:pt-36">
      <div className="section">
        <Reveal>
          <a
            href={`mailto:${CONTACT.email}`}
            className="group inline-block max-w-6xl"
            aria-label={`Email Jomel at ${CONTACT.email}`}
          >
            <span className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.9] font-light text-ivory">
              Let&apos;s build something{' '}
              <span className="relative inline-block italic">
                <span className="gold-text">remarkable.</span>
                <span
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[image:var(--gold-gradient)] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  aria-hidden="true"
                />
              </span>
            </span>
          </a>
        </Reveal>

        <div className="mt-24 flex flex-col gap-10 border-t border-gold/10 pt-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Monogram className="size-10" />
            <div>
              <p className="font-display text-xl text-ivory">Jomel</p>
              <p className="text-xs text-stone">Full-Stack Web &amp; Mobile App Developer</p>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    onClick={goTo(link.id)}
                    className="text-[0.7rem] font-semibold tracking-[0.26em] text-stone uppercase transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-11 items-center justify-center rounded-full border border-gold/25 text-ivory transition-colors hover:border-gold hover:text-gold"
              aria-label="GitHub profile (opens in a new tab)"
            >
              <GithubIcon className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="flex size-11 items-center justify-center rounded-full border border-gold/25 text-ivory transition-colors hover:border-gold hover:text-gold"
              aria-label="Back to top"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
        <p className="mt-10 text-xs text-stone-dark">© {year} Jomel. All rights reserved.</p>
      </div>
    </footer>
  );
}
