import {
  Bot,
  Code2,
  CreditCard,
  Server,
  Smartphone,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { useState, type PointerEvent } from 'react';
import { Reveal } from '../../components/motion/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { cn } from '../../lib/utils';

interface Tile {
  key: string;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  icon: LucideIcon;
  span: string;
}

const TILES: Tile[] = [
  {
    key: 'web',
    title: 'Web',
    summary: 'Fast, accessible React applications with a premium feel.',
    detail:
      'Type-safe frontends with server state handled by TanStack Query and design systems in Tailwind.',
    tags: ['React', 'TypeScript', 'Vite', 'TanStack Query', 'Tailwind'],
    icon: Code2,
    span: 'md:col-span-4 lg:col-span-4 lg:row-span-2',
  },
  {
    key: 'mobile',
    title: 'Mobile',
    summary: 'React Native Expo apps for iOS & Android.',
    detail:
      'EAS builds, store releases and in-app subscriptions from a single TypeScript codebase.',
    tags: ['React Native', 'Expo', 'iOS & Android', 'EAS Build', 'In-app subscriptions'],
    icon: Smartphone,
    span: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
  },
  {
    key: 'backend',
    title: 'Backend',
    summary: 'Secure REST APIs on Node.js and Supabase.',
    detail:
      'Express services, Postgres schemas, Auth, Storage and row-level security designed together.',
    tags: ['Node.js', 'Express', 'REST APIs', 'Supabase', 'Postgres', 'Auth', 'Storage', 'RLS'],
    icon: Server,
    span: 'md:col-span-3 lg:col-span-2',
  },
  {
    key: 'devops',
    title: 'DevOps',
    summary: 'Containerised, automated delivery.',
    detail: 'Docker images, CI/CD pipelines and Render deployments with health checks.',
    tags: ['Docker', 'CI/CD', 'Render'],
    icon: Workflow,
    span: 'md:col-span-3 lg:col-span-2',
  },
  {
    key: 'ai',
    title: 'AI Integration',
    summary: 'Useful AI, called securely from the server.',
    detail:
      'Prompt engineering, AI diagnostics and structured outputs — with keys kept server-side.',
    tags: [
      'OpenAI ChatGPT',
      'Anthropic Claude',
      'Google Gemini',
      'Structured outputs',
      'Prompt engineering',
    ],
    icon: Bot,
    span: 'md:col-span-3 lg:col-span-2',
  },
  {
    key: 'payments',
    title: 'Payments & Integrations',
    summary: 'Billing, subscriptions, accounting and email.',
    detail:
      'Checkout and subscriptions, mobile entitlements, accounting sync and transactional email.',
    tags: ['Stripe', 'RevenueCat', 'QuickBooks Online', 'Resend'],
    icon: CreditCard,
    span: 'md:col-span-3 lg:col-span-6',
  },
];

function BentoTile({ tile, index }: { tile: Tile; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = tile.icon;

  // Spotlight follows the pointer via CSS variables (no React re-render per move).
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <Reveal delay={0.06 * index} className={cn('min-h-[13.5rem]', tile.span)}>
      <div
        tabIndex={0}
        role="group"
        aria-label={tile.title}
        onPointerMove={onPointerMove}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        className="group glass relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 transition-colors duration-500 hover:border-gold/40 focus-visible:border-gold/60 sm:p-9"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(37,99,235,0.14), transparent 60%)',
          }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -right-2 -bottom-10 font-display text-[10rem] leading-none text-gold/[0.06] italic transition-transform duration-1000 select-none group-hover:-translate-y-2 sm:text-[13rem]"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl text-ivory sm:text-4xl">{tile.title}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-stone sm:text-base">
              {tile.summary}
            </p>
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-12deg]">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="relative mt-8">
          <p
            className={cn(
              'max-w-lg text-sm leading-relaxed text-ivory/80 transition-[opacity,transform] duration-500',
              open ? 'translate-y-0 opacity-100' : 'md:translate-y-1 md:opacity-55',
            )}
          >
            {tile.detail}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${tile.title} technologies`}>
            {tile.tags.map((tag, i) => (
              <li
                key={tag}
                className={cn(
                  'rounded-full border border-gold/20 bg-ink/40 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-ivory/85 transition-[opacity,transform] duration-500',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-60',
                )}
                style={{ transitionDelay: open ? `${i * 45}ms` : '0ms' }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

export function Expertise() {
  return (
    <section
      id="expertise"
      className="relative overflow-x-clip py-28 sm:py-36"
      aria-label="Expertise"
    >
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[60vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.07),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="section">
        <SectionHeading
          index="02"
          label="Expertise"
          title="The full stack, end to end"
          intro="One engineer across interface, API, data, mobile and infrastructure — so the product feels coherent from the first tap to the last database row."
        />
        <div className="mt-16 grid auto-rows-[minmax(13.5rem,auto)] gap-4 md:grid-cols-6 lg:gap-5">
          {TILES.map((tile, i) => (
            <BentoTile key={tile.key} tile={tile} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
