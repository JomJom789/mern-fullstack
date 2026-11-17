import { Counter } from '../../components/motion/Counter';
import { Reveal } from '../../components/motion/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';

const STATS = [
  { value: 10, suffix: '+', label: 'Years building software', note: 'Shipping since 2015' },
  { value: 3, suffix: '+', label: 'Live products in production', note: 'SaaS & web platforms' },
  { value: 2, suffix: '', label: 'Platforms, one codebase mindset', note: 'Web & mobile' },
] as const;

const JOURNEY = [
  {
    period: '2015 — 2017',
    title: 'Native Android',
    body: 'Android apps in Java with Eclipse and Android Studio, structured with MVP and MVVM.',
  },
  {
    period: '2017 →',
    title: 'Kotlin & Flutter',
    body: 'Moved to Kotlin, then Flutter and Dart with Bloc state management, SQFLite and ObjectBox — consuming REST APIs across Android and iOS.',
  },
  {
    period: 'MERN years',
    title: 'Full-stack web',
    body: 'Complete web applications with React, Express.js, JWT authentication, Socket.IO real-time features and MongoDB.',
  },
  {
    period: 'Today',
    title: 'SaaS, mobile & AI',
    body: 'React + TypeScript, React Native Expo, Node.js and Supabase — with payments, subscriptions and AI built in securely.',
  },
] as const;

export function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36 lg:py-44" aria-label="About">
      <div className="section">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading index="01" label="About" title="Software that does more, for less" />
            <Reveal delay={0.1}>
              <div className="mt-10 max-w-2xl space-y-6 text-base leading-relaxed text-stone sm:text-lg">
                <p>
                  I&apos;m a full-stack developer who has spent most of my career working directly
                  with clients as a freelancer. My focus has always been the same: building software
                  that helps small businesses achieve{' '}
                  <span className="text-ivory">maximum results at minimum cost.</span>
                </p>
                <p>
                  I take products from the first sketch to production — designing the interface,
                  engineering the API and database, shipping the mobile app, and keeping the whole
                  system secure and fast once real customers depend on it.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-28">
            <ol className="relative space-y-10 border-l border-gold/15 pl-8">
              {JOURNEY.map((step, i) => (
                <li key={step.title} className="relative">
                  <Reveal delay={0.08 * i} blur={false} y={24}>
                    <span
                      className="absolute top-1.5 -left-[37px] size-2.5 rounded-full border border-gold bg-ink"
                      aria-hidden="true"
                    />
                    <p className="label-caps text-gold/80">{step.period}</p>
                    <h3 className="mt-2 font-display text-2xl text-ivory">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <dl className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-gold/10 bg-gold/10 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={0.1 * i} className="bg-ink p-8 sm:p-10">
              <dt className="label-caps">{stat.label}</dt>
              <dd className="mt-5">
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  className="gold-text block font-display text-7xl leading-none font-light sm:text-8xl"
                />
                <span className="mt-3 block text-sm text-stone-dark">{stat.note}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
