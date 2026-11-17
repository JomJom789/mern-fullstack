import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { SectionHeading } from '../../components/ui/SectionHeading';

const STEPS = [
  {
    title: 'Discover',
    body: 'Workshops, workflows and constraints. I map who uses the product, what they need on day one, and what must never break.',
    points: ['User & business goals', 'Scope and milestones', 'Technical risks'],
  },
  {
    title: 'Design',
    body: 'Information architecture, interface design and the data model, shaped together so the experience and the schema agree.',
    points: ['Flows & wireframes', 'UI system', 'Database & API design'],
  },
  {
    title: 'Engineer',
    body: 'Type-safe web and mobile apps on a secure API — validated inputs, row-level security and tested business logic.',
    points: ['React & React Native', 'Node.js / Supabase', 'Security by default'],
  },
  {
    title: 'Ship',
    body: 'Automated builds, containerised deployments and store releases, with monitoring in place before launch day.',
    points: ['CI/CD & Docker', 'Render deployments', 'App Store & Play'],
  },
  {
    title: 'Scale',
    body: 'Iterate on real usage: performance work, payments and subscriptions, integrations and AI features that earn their place.',
    points: ['Performance', 'Payments & integrations', 'AI features'],
  },
] as const;

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!pin || !track || !progress) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // Horizontal pinned scroll only on wide screens with motion allowed.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.scrollWidth - pin.clientWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: true,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>('[data-step]', track).forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0.35 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: step,
                containerAnimation: tween,
                start: 'left 75%',
                end: 'left 35%',
                scrub: true,
              },
            },
          );
        });
      });
    }, sectionRef);

    // Images and fonts change layout after first paint.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    void document.fonts.ready.then(refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-28 sm:py-36 lg:pb-0"
      aria-label="Process"
    >
      <div className="section">
        <SectionHeading
          index="05"
          label="Process"
          title="From first call to scale"
          intro="A calm, transparent way of working — five stages, each with clear outcomes you can see."
        />
      </div>

      <div
        ref={pinRef}
        className="relative mt-16 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden"
      >
        <ol
          ref={trackRef}
          className="section flex flex-col gap-6 lg:w-max lg:max-w-none lg:flex-row lg:gap-8 lg:pr-[20vw]"
        >
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              data-step
              className="glass relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 sm:p-10 lg:h-[62vh] lg:w-[min(34rem,40vw)]"
            >
              <span
                className="pointer-events-none absolute -top-8 -right-2 font-display text-[11rem] leading-none text-gold/[0.07] italic select-none"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <p className="label-caps text-gold">Step {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-6 font-display text-5xl font-light text-ivory sm:text-6xl">
                  {step.title}
                  {i < STEPS.length - 1 ? (
                    <span className="ml-3 text-gold/60" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </h3>
                <p className="mt-6 max-w-md text-base leading-relaxed text-stone">{step.body}</p>
              </div>
              <ul className="mt-10 space-y-3 border-t border-gold/10 pt-6">
                {step.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-ivory/85">
                    <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="section mt-10 hidden lg:block" aria-hidden="true">
          <div className="h-px w-full bg-smoke">
            <div ref={progressRef} className="h-px origin-left scale-x-0 bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
