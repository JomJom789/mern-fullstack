import { ArrowUpRight } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { useRef, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { ProjectImage } from '../../../components/ui/ProjectImage';
import { useIsTouch, usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { cn } from '../../../lib/utils';
import type { Project } from '../types';

const MAX_TILT = 6;

interface ProjectCardProps {
  project: Project;
  index?: number;
  /** Aspect ratio class for the media, e.g. "aspect-[4/5]". */
  aspect?: string;
  className?: string;
  size?: 'lg' | 'md';
}

export const projectImageLayoutId = (slug: string) => `project-image-${slug}`;

export function ProjectCard({
  project,
  index = 0,
  aspect = 'aspect-[4/3]',
  className,
  size = 'md',
}: ProjectCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const tiltEnabled = !isTouch && !reduced;
  // On touch devices the card "activates" when it crosses the centre band of the viewport.
  const centred = useInView(ref, { margin: '-42% 0px -42% 0px' });

  const rotateX = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * MAX_TILT * 2);
    rotateX.set(-py * MAX_TILT * 2);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className={cn('[perspective:1200px]', className)}>
      <motion.div
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      >
        <Link
          ref={ref}
          to={`/work/${project.slug}`}
          data-cursor="view"
          data-active={isTouch && centred ? 'true' : 'false'}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="project-card group relative block rounded-2xl focus-visible:outline-offset-8"
          aria-label={`${project.title} — ${project.tagline ?? project.category}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-ivory/5 bg-charcoal">
            <motion.div
              layoutId={projectImageLayoutId(project.slug)}
              className={cn('project-media relative', aspect)}
            >
              <ProjectImage
                src={project.imageUrl}
                alt={`${project.title} preview`}
                seed={project.slug}
                className="absolute inset-0"
                imgClassName="object-top"
              />
            </motion.div>
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink from-15% via-ink/90 via-50% to-transparent to-85%"
              aria-hidden="true"
            />
            <span className="sheen" aria-hidden="true" />
            <span className="border-sweep" aria-hidden="true" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="label-caps text-gold/90">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
                <span className="label-caps">{project.category}</span>
              </div>
              <div className="mt-3 overflow-hidden">
                <h3
                  className={cn(
                    'font-display leading-none font-light text-ivory transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 group-data-[active=true]:-translate-y-1',
                    size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl',
                  )}
                >
                  {project.title}
                </h3>
              </div>
              {project.tagline ? (
                <p className="mt-3 max-w-md text-sm text-stone transition-transform duration-700 group-hover:-translate-y-1">
                  {project.tagline}
                </p>
              ) : null}
              {project.techStack.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
                  {project.techStack.slice(0, 6).map((tag, i) => (
                    <li
                      key={tag}
                      className="translate-y-3 rounded-full border border-gold/25 bg-ink/60 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-ivory/90 opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 motion-reduce:translate-y-0"
                      style={{ transitionDelay: `${80 + i * 55}ms` }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <span
              className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full border border-gold/30 bg-ink/50 text-gold opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[active=true]:opacity-100"
              aria-hidden="true"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

export function ProjectCardSkeleton({ aspect = 'aspect-[4/3]' }: { aspect?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-ivory/5 bg-charcoal',
        aspect,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-ivory/[0.04] to-transparent" />
      <div className="absolute inset-x-6 bottom-6 space-y-3">
        <div className="h-3 w-24 rounded bg-graphite" />
        <div className="h-8 w-2/3 rounded bg-graphite" />
        <div className="h-3 w-1/2 rounded bg-graphite" />
      </div>
    </div>
  );
}
