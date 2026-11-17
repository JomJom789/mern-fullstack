import { RotateCcw } from 'lucide-react';
import { ClipReveal } from '../../../components/motion/ClipReveal';
import { Parallax } from '../../../components/motion/Parallax';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { errorMessage } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import { useProjects } from '../hooks';
import type { PublicProjectFilters } from '../types';
import { ProjectCard, ProjectCardSkeleton } from './ProjectCard';

const FEATURED: PublicProjectFilters = { featured: true, sort: 'curated', page: 1, pageSize: 6 };

/** Editorial, asymmetric placement. Cycles for any number of featured projects. */
const LAYOUT = [
  { wrap: 'lg:col-span-7', aspect: 'aspect-[4/3]', size: 'lg', parallax: -40 },
  { wrap: 'lg:col-span-5 lg:mt-56', aspect: 'aspect-[4/5]', size: 'md', parallax: -110 },
  {
    wrap: 'lg:col-span-6 lg:col-start-4 lg:-mt-10',
    aspect: 'aspect-[16/10]',
    size: 'lg',
    parallax: -60,
  },
  { wrap: 'lg:col-span-5 lg:col-start-2', aspect: 'aspect-[4/5]', size: 'md', parallax: -30 },
  {
    wrap: 'lg:col-span-5 lg:col-start-8 lg:mt-40',
    aspect: 'aspect-[4/3]',
    size: 'md',
    parallax: -90,
  },
  { wrap: 'lg:col-span-8 lg:col-start-3', aspect: 'aspect-[16/9]', size: 'lg', parallax: -50 },
] as const;

export function SelectedWork() {
  const { data, isPending, isError, error, refetch } = useProjects(FEATURED);

  return (
    <section id="work" className="relative scroll-mt-24 py-28 sm:py-36" aria-label="Selected work">
      <div className="section">
        <SectionHeading
          index="03"
          label="Selected Work"
          title="Products built to be used every day"
          intro="A few platforms I've designed and engineered end to end — live, in production, with real customers."
        />

        <div className="mt-20 grid gap-x-8 gap-y-16 lg:grid-cols-12 lg:gap-y-24">
          {isPending
            ? LAYOUT.slice(0, 3).map((slot, i) => (
                <div key={i} className={slot.wrap}>
                  <ProjectCardSkeleton aspect={slot.aspect} />
                </div>
              ))
            : null}

          {isError ? (
            <div className="glass col-span-full flex flex-col items-start gap-4 rounded-2xl p-8">
              <p className="text-stone">Selected work could not be loaded. {errorMessage(error)}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light"
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Try again
              </button>
            </div>
          ) : null}

          {data?.data.length === 0 ? (
            <p className="col-span-full font-display text-3xl text-stone italic">
              New work is being polished — check back soon.
            </p>
          ) : null}

          {data?.data.map((project, i) => {
            const slot = LAYOUT[i % LAYOUT.length] ?? LAYOUT[0];
            return (
              <div key={project.id} className={cn(slot.wrap)}>
                <Parallax distance={slot.parallax}>
                  <ClipReveal delay={0.05 * (i % 2)}>
                    <ProjectCard
                      project={project}
                      index={i}
                      aspect={slot.aspect}
                      size={slot.size}
                    />
                  </ClipReveal>
                </Parallax>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
