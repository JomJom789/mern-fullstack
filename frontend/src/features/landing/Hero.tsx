import {
  ArrowDownRight,
  Atom,
  Braces,
  Container,
  CreditCard,
  Database,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from 'react';
import portraitLarge from '../../assets/jomel-portrait-1086.webp';
import portraitSmall from '../../assets/jomel-portrait-640.webp';
import { useIntro } from '../../components/layout/Intro';
import { useScrollTo } from '../../components/layout/SmoothScroll';
import { SplitText } from '../../components/motion/SplitText';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { Ribbon } from '../../components/ui/Ribbon';

const RIBBON_A = [
  'Engineered for Scale',
  'Crafted with Precision',
  'Web · Mobile · AI',
  'From Idea to App Store',
] as const;
const RIBBON_B = [
  'Secure by Design',
  'Built to Perform',
  'Pixel-Perfect Interfaces',
  'Real-Time Systems',
] as const;

/** Ribbons fade out where they end on-screen, so they read as flowing in from their corner. */
const RIBBON_FADE_LEFT = 'linear-gradient(to right, transparent 0%, #000 22%)';
const RIBBON_FADE_RIGHT = 'linear-gradient(to left, transparent 0%, #000 22%)';

/**
 * At rest the portrait is a dark, gold-toned monochrome that melts into the ink/gold palette.
 * On hover (or tap on touch screens) it eases back to the original photo colours. Both strings
 * list the same filter functions in the same order so Motion can interpolate between them.
 */
const PORTRAIT_BLENDED = 'grayscale(1) sepia(0.5) saturate(1.15) brightness(0.6) contrast(1.1)';
const PORTRAIT_ORIGINAL = 'grayscale(0) sepia(0) saturate(1) brightness(1) contrast(1)';

/** True when (x, y) falls on the body of the portrait (edges are faded out, so they're ignored). */
function isOverPortrait(img: HTMLImageElement | null, x: number, y: number): boolean {
  if (!img) return false;
  const rect = img.getBoundingClientRect();
  return (
    x >= rect.left + rect.width * 0.22 &&
    x <= rect.right - rect.width * 0.08 &&
    y >= rect.top + rect.height * 0.05 &&
    y <= rect.bottom - rect.height * 0.3
  );
}

function Portrait({
  play,
  revealed,
  imgRef,
  pointerX,
  scrollYProgress,
}: {
  play: boolean;
  revealed: boolean;
  imgRef: RefObject<HTMLImageElement | null>;
  pointerX: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const x = useTransform(pointerX, (v) => v * -14);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-12 bottom-[54%] z-0 flex items-start justify-end sm:top-14 sm:bottom-[46%] lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[46%] lg:items-end xl:w-[58%]"
      style={reduced ? undefined : { x, y }}
    >
      {/* Gold halo behind the head and shoulders; it dims when the photo shows its own colours. */}
      <div
        style={{ opacity: revealed ? 0.55 : 1 }}
        className="absolute top-[6%] right-[8%] size-[75vw] rounded-full bg-[radial-gradient(circle,rgba(201,169,97,0.26),transparent_64%)] blur-2xl transition-opacity duration-700 sm:size-[60vw] lg:top-auto lg:right-[14%] lg:bottom-[22%] lg:size-[min(68vh,42rem)]"
        aria-hidden="true"
      />
      <motion.img
        ref={imgRef}
        src={portraitLarge}
        srcSet={`${portraitSmall} 640w, ${portraitLarge} 1086w`}
        sizes="(min-width: 1024px) 45vw, 80vw"
        width={1086}
        height={1448}
        alt="Jomel"
        decoding="async"
        fetchPriority="high"
        className="hero-portrait relative -mr-[12%] h-full w-auto max-w-none object-contain lg:mr-0 lg:h-[min(78svh,50rem)] xl:h-[min(94svh,62rem)]"
        initial={{
          opacity: 0,
          y: reduced ? 0 : 40,
          scale: reduced ? 1 : 1.03,
          filter: PORTRAIT_BLENDED,
        }}
        animate={{
          ...(play ? { opacity: 1, y: 0, scale: 1 } : {}),
          filter: revealed ? PORTRAIT_ORIGINAL : PORTRAIT_BLENDED,
        }}
        transition={{
          default: { duration: 1.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] },
        }}
      />
      {/* Ink wash over the lower body so it melts into the section below. */}
      <div
        className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-linear-to-b from-transparent to-ink lg:block"
        aria-hidden="true"
      />
    </motion.div>
  );
}

interface Chip {
  label: string;
  icon: LucideIcon;
  corner: 'tr' | 'bl';
  /** Position inside the corner zone, in % of the hero. */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  depth: number;
}

// Resting positions sit in the free zones (right column, and right of the CTAs), never over text.
const CHIPS: Chip[] = [
  { label: 'React', icon: Atom, corner: 'tr', top: '33%', right: '5%', depth: 1.4 },
  { label: 'TypeScript', icon: Braces, corner: 'tr', top: '44%', right: '19%', depth: 0.8 },
  { label: 'React Native', icon: Smartphone, corner: 'tr', top: '55%', right: '5%', depth: 1.1 },
  { label: 'AI Integration', icon: Sparkles, corner: 'tr', top: '65%', right: '21%', depth: 0.6 },
  { label: 'Secure APIs', icon: ShieldCheck, corner: 'tr', top: '75%', right: '8%', depth: 0.5 },
  { label: 'Docker', icon: Container, corner: 'tr', top: '40%', right: '33%', depth: 1.3 },
  { label: 'Supabase', icon: Database, corner: 'bl', bottom: '15%', left: '47%', depth: 1.2 },
  { label: 'Node.js', icon: Server, corner: 'bl', bottom: '24%', left: '58%', depth: 0.7 },
  { label: 'Stripe', icon: CreditCard, corner: 'bl', bottom: '13%', left: '66%', depth: 0.9 },
];

function FloatingChip({
  chip,
  index,
  pointerX,
  pointerY,
  scrollShift,
  play,
}: {
  chip: Chip;
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollShift: MotionValue<number>;
  play: boolean;
}) {
  const reduced = useReducedMotion();
  const x = useTransform(pointerX, (v) => v * 22 * chip.depth);
  const y = useTransform(
    [pointerY, scrollShift],
    ([py, s]) => (py as number) * 22 * chip.depth + (s as number) * chip.depth,
  );
  const fromX = chip.corner === 'tr' ? 160 : -160;
  const fromY = chip.corner === 'tr' ? -120 : 120;
  const Icon = chip.icon;

  return (
    <motion.div
      className="absolute z-10 hidden xl:flex"
      style={{
        top: chip.top,
        bottom: chip.bottom,
        left: chip.left,
        right: chip.right,
        ...(reduced ? {} : { x, y }),
      }}
    >
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: fromX, y: fromY, scale: 0.85 }}
        animate={play ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.6, delay: 0.9 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="glass flex animate-float items-center gap-2.5 rounded-full bg-ink/70! px-4 py-2.5 text-xs font-medium tracking-wide text-ivory/90 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
          style={{ animationDelay: `${index * -1.3}s` }}
        >
          <Icon className="size-3.5 text-gold" aria-hidden="true" />
          {chip.label}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { done } = useIntro();
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();
  const ref = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const [portraitRevealed, setPortraitRevealed] = useState(false);

  const pointerX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const pointerY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const spotX = useSpring(useMotionValue(0), { stiffness: 80, damping: 25 });
  const spotY = useSpring(useMotionValue(0), { stiffness: 80, damping: 25 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scrollShift = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || !ref.current) return;
    // The headline layer sits above the photo, so hover is detected from the pointer position.
    setPortraitRevealed(isOverPortrait(portraitRef.current, event.clientX, event.clientY));
    if (reduced) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx);
    pointerY.set(ny);
    spotX.set(event.clientX - rect.left);
    spotY.set(event.clientY - rect.top);
  };

  const go = (id: string) => (event: MouseEvent) => {
    event.preventDefault();
    scrollTo(id);
  };

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPortraitRevealed(false)}
      onPointerDown={(event) => {
        // Touch screens have no hover: a tap on the photo toggles its colours instead.
        if (event.pointerType !== 'touch') return;
        if (isOverPortrait(portraitRef.current, event.clientX, event.clientY)) {
          setPortraitRevealed((value) => !value);
        }
      }}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pt-60 pb-44 sm:pt-64 lg:pt-[clamp(12rem,24vh,15rem)] lg:pb-[clamp(6.5rem,12vh,9rem)]"
      aria-labelledby="hero-title"
    >
      {/* Aurora / gold mesh background (transform-only animation). */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-1/4 -left-1/4 size-[70vmax] animate-aurora-a rounded-full bg-[radial-gradient(circle,rgba(201,169,97,0.22),transparent_62%)] blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/3 size-[65vmax] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgba(120,98,60,0.28),transparent_60%)] blur-3xl" />
        <div className="absolute top-1/3 left-1/3 size-[40vmax] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgba(245,241,232,0.06),transparent_60%)] blur-2xl [animation-delay:-9s]" />
        <motion.div
          className="absolute top-0 left-0 -mt-[30vmax] -ml-[30vmax] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(230,207,151,0.13),transparent_55%)]"
          style={reduced ? { opacity: 0 } : { x: spotX, y: spotY }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0A0B_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-ink" />
      </div>

      {/* Flowing ribbons: top-right (−12°) and bottom-left (+12°). */}
      <motion.div
        className="pointer-events-none absolute top-[4.75rem] -right-[14%] -z-0 w-[90vw] origin-right sm:top-[5.5rem] lg:-right-[6%] lg:w-[50vw]"
        style={{ rotate: -12, maskImage: RIBBON_FADE_LEFT, WebkitMaskImage: RIBBON_FADE_LEFT }}
        initial={{ opacity: 0, x: reduced ? 0 : '30%' }}
        animate={done ? { opacity: 1, x: '0%' } : undefined}
        transition={{ duration: 1.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <Ribbon phrases={RIBBON_A} baseVelocity={-2} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-[7rem] -left-[8%] -z-0 w-[95vw] origin-left sm:bottom-[8rem] lg:bottom-[1.5rem] lg:w-[52vw]"
        style={{ rotate: 12, maskImage: RIBBON_FADE_RIGHT, WebkitMaskImage: RIBBON_FADE_RIGHT }}
        initial={{ opacity: 0, x: reduced ? 0 : '-30%' }}
        animate={done ? { opacity: 1, x: '0%' } : undefined}
        transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <Ribbon phrases={RIBBON_B} baseVelocity={2} />
      </motion.div>

      <Portrait
        play={done}
        revealed={portraitRevealed}
        imgRef={portraitRef}
        pointerX={pointerX}
        scrollYProgress={scrollYProgress}
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {CHIPS.map((chip, i) => (
          <FloatingChip
            key={chip.label}
            chip={chip}
            index={i}
            pointerX={pointerX}
            pointerY={pointerY}
            scrollShift={scrollShift}
            play={done}
          />
        ))}
      </div>

      <motion.div
        className="section relative z-20"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="label-caps flex items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={done ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          Web · Mobile · AI
        </motion.p>

        <h1
          id="hero-title"
          className="mt-7 max-w-[16ch] font-display text-[clamp(2.75rem,7vw,7.25rem)] leading-[0.95] font-light tracking-[-0.01em] text-ivory lg:max-w-[20ch] 3xl:text-[8.5rem]"
        >
          <SplitText
            text="Jomel — Full-Stack Web & Mobile App Developer"
            play={done}
            delay={0.2}
            stagger={0.075}
            wordClassName={(_, i) =>
              i === 0 ? 'italic gold-text pr-[0.04em]' : i === 1 ? 'text-gold/70' : undefined
            }
          />
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-base leading-relaxed text-stone sm:text-lg lg:text-xl"
          initial={{ opacity: 0, y: 18, filter: reduced ? 'blur(0px)' : 'blur(8px)' }}
          animate={done ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 1.2, delay: 0.95 }}
        >
          I design and engineer premium SaaS products — from React web apps to React Native mobile
          experiences, powered by secure APIs and AI.
        </motion.p>

        <motion.div
          className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 18 }}
          animate={done ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 1.15 }}
        >
          <MagneticButton href="#work" onClick={go('work')}>
            View Selected Work
            <ArrowDownRight className="size-4 transition-transform duration-500 group-hover:rotate-[-45deg]" />
          </MagneticButton>
          <MagneticButton href="#contact" onClick={go('contact')} variant="ghost">
            Let&apos;s Build Together
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
