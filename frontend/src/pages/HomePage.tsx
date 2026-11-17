import { lazy, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useIntro } from '../components/layout/Intro';
import { Navbar } from '../components/layout/Navbar';
import { useScrollTo } from '../components/layout/SmoothScroll';
import { Seo } from '../components/seo/Seo';
import { Preloader } from '../components/ui/Preloader';
import { ProjectExplorer } from '../features/projects/components/ProjectExplorer';
import { SelectedWork } from '../features/projects/components/SelectedWork';
import { About } from '../features/landing/About';
import { Expertise } from '../features/landing/Expertise';
import { Footer } from '../features/landing/Footer';
import { Hero } from '../features/landing/Hero';
import { env } from '../lib/env';

// Below-the-fold sections with heavier dependencies (GSAP; react-hook-form + Zod) are split out of
// the main bundle. Placeholders keep their anchors and approximate height until they load.
const Process = lazy(() => import('../features/landing/Process'));
const Contact = lazy(() => import('../features/landing/Contact'));

function SectionPlaceholder({ id }: { id: string }) {
  return <section id={id} className="min-h-screen" aria-busy="true" />;
}

/** Scrolls to a section requested from another page (navigate('/', { state: { scrollTo } })). */
function useSectionFromState() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTo = useScrollTo();
  const { done } = useIntro();
  const target = (location.state as { scrollTo?: string } | null)?.scrollTo;

  useEffect(() => {
    if (!target || !done) return;
    const id = window.setTimeout(() => {
      scrollTo(target, { offset: -80 });
      // Clear the state so a refresh doesn't scroll again.
      void navigate('.', { replace: true, state: null, preventScrollReset: true });
    }, 120);
    return () => window.clearTimeout(id);
  }, [target, done, scrollTo, navigate]);
}

export default function HomePage() {
  useSectionFromState();

  return (
    <>
      <Seo
        title="Jomel — Full-Stack Web & Mobile App Developer"
        description="I design and engineer premium SaaS products — from React web apps to React Native mobile experiences, powered by secure APIs and AI."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Jomel',
          jobTitle: 'Full-Stack Web & Mobile App Developer',
          url: `${env.siteUrl}/`,
          sameAs: ['https://github.com/JomJom789'],
          knowsAbout: [
            'React',
            'TypeScript',
            'React Native',
            'Node.js',
            'Supabase',
            'AI integration',
          ],
        }}
      />
      <Preloader />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Expertise />
        <SelectedWork />
        <ProjectExplorer />
        <Suspense fallback={<SectionPlaceholder id="process" />}>
          <Process />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder id="contact" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
