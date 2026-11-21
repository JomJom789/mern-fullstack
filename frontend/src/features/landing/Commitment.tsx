import { Reveal } from '../../components/motion/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import chat1 from '../../assets/sacrifice/chat-1.webp';
import chat2 from '../../assets/sacrifice/chat-2.webp';
import chat3 from '../../assets/sacrifice/chat-3.webp';
import chat4 from '../../assets/sacrifice/chat-4.webp';
import chatVideo from '../../assets/sacrifice/chat-scroll.mp4';
import chatPoster from '../../assets/sacrifice/chat-scroll-poster.webp';

const SCREENSHOTS = [
  {
    src: chat1,
    alt: 'Client message saying the budget has run out, and my reply offering to work the next month unpaid',
  },
  {
    src: chat2,
    alt: 'My full reply: happy to go unpaid so the app gets finished and published, plus advice on App Store pricing limits',
  },
  {
    src: chat3,
    alt: 'Client thanking me and saying they really appreciate the help getting the app over the line',
  },
  {
    src: chat4,
    alt: 'Client saying they cannot wait to get the app on the App Store, and me following up on the final steps',
  },
] as const;

export function Commitment() {
  return (
    <section id="commitment" className="relative py-28 sm:py-36 lg:py-44" aria-label="Commitment">
      <div className="section">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading
              index="06"
              label="Beyond the code"
              title="I finish what I start"
              intro={
                <>
                  <p>
                    Near the end of a mobile app project, my client told me the budget had run out.
                    The app was close to the App Store, but not there yet.
                  </p>
                  <p className="mt-6">
                    So I offered to{' '}
                    <span className="text-ivory">give up my next month&apos;s pay</span> and keep
                    working until the app was finished and published. They had backed me from the
                    start, and I wanted to see that work make it to launch.
                  </p>
                </>
              }
            />

            <Reveal delay={0.2}>
              <blockquote className="mt-12 max-w-2xl border-l border-gold/40 pl-6">
                <p className="font-display text-3xl leading-snug font-light text-ivory italic sm:text-4xl">
                  &ldquo;As a developer, I genuinely want to see the results of my hard work and
                  craftsmanship.&rdquo;
                </p>
                <footer className="label-caps mt-4 text-gold/80">My reply · November 2026</footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.3}>
              <blockquote className="mt-10 max-w-2xl rounded-2xl border border-gold/10 bg-charcoal p-6">
                <p className="text-base leading-relaxed text-stone sm:text-lg">
                  &ldquo;Yeah I think we defo need to get it over the line, really appreciate your
                  help!&rdquo;
                </p>
                <footer className="label-caps mt-3 text-stone-dark">The client</footer>
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal blur={false} y={24}>
              <figure className="mx-auto max-w-xs overflow-hidden rounded-[2rem] border border-gold/15 bg-ink p-2 shadow-xl shadow-gold/5">
                <video
                  className="aspect-[880/1920] w-full rounded-[1.6rem] bg-graphite object-cover"
                  src={chatVideo}
                  poster={chatPoster}
                  controls
                  muted
                  playsInline
                  preload="none"
                  aria-label="Screen recording scrolling through the full conversation"
                />
                <figcaption className="px-2 pt-3 pb-1 text-center text-xs text-stone-dark">
                  The full conversation. Names blurred for privacy.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {SCREENSHOTS.map((shot, i) => (
            <li key={shot.src}>
              <Reveal delay={0.08 * i} blur={false} y={24}>
                <a
                  href={shot.src}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-gold/10 bg-charcoal transition-colors hover:border-gold/40 focus-visible:border-gold"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={720}
                    height={1560}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[720/1560] w-full object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
