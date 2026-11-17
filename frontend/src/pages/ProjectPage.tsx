import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router';
import { Navbar } from '../components/layout/Navbar';
import { Reveal } from '../components/motion/Reveal';
import { SplitText } from '../components/motion/SplitText';
import { Seo } from '../components/seo/Seo';
import { GithubIcon } from '../components/ui/GithubIcon';
import { ProjectImage } from '../components/ui/ProjectImage';
import { Skeleton } from '../components/ui/Skeleton';
import { Footer } from '../features/landing/Footer';
import { projectImageLayoutId } from '../features/projects/components/ProjectCard';
import { useProject } from '../features/projects/hooks';
import { ApiError } from '../lib/api';
import { env } from '../lib/env';
import NotFoundPage from './NotFoundPage';

function ProjectSkeleton() {
  return (
    <div className="section pt-36" aria-busy="true" aria-label="Loading project">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-8 h-20 w-3/4" />
      <Skeleton className="mt-12 aspect-[16/9] w-full rounded-3xl" />
    </div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams();
  const { data: project, isPending, isError, error } = useProject(slug);

  if (isError && error instanceof ApiError && (error.status === 404 || error.status === 400)) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen">
        {isPending ? <ProjectSkeleton /> : null}
        {isError && !(error instanceof ApiError && error.status === 404) ? (
          <div className="section pt-40">
            <p className="text-stone">
              This project could not be loaded right now. Please try again shortly.
            </p>
            <Link to="/" className="mt-6 inline-flex text-gold">
              ← Back home
            </Link>
          </div>
        ) : null}

        {project ? (
          <article>
            <Seo
              title={`${project.title} — ${project.tagline ?? project.category} | Jomel`}
              description={project.tagline ?? project.description.slice(0, 155)}
              path={`/work/${project.slug}`}
              image={project.imageUrl}
              type="article"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: project.title,
                headline: project.tagline ?? project.title,
                description: project.description,
                genre: project.category,
                keywords: project.techStack.join(', '),
                url: `${env.siteUrl}/work/${project.slug}`,
                ...(project.imageUrl ? { image: project.imageUrl } : {}),
                creator: { '@type': 'Person', name: 'Jomel', url: `${env.siteUrl}/` },
              }}
            />

            <header className="section pt-32 sm:pt-40">
              <Link
                to="/"
                state={{ scrollTo: 'work' }}
                className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.28em] text-stone uppercase transition-colors hover:text-gold"
              >
                <ArrowLeft
                  className="size-4 transition-transform duration-500 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                All work
              </Link>
              <motion.p
                className="label-caps mt-10 flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="text-gold">{project.category}</span>
                <span className="h-px w-10 bg-gold/40" aria-hidden="true" />
                Case study
              </motion.p>
              <SplitText
                as="h1"
                text={project.title}
                delay={0.15}
                className="mt-6 block font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] font-light text-ivory"
                wordClassName={(_, i) => (i === 1 ? 'italic gold-text' : undefined)}
              />
              {project.tagline ? (
                <motion.p
                  className="mt-6 max-w-2xl text-lg text-stone sm:text-xl"
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  {project.tagline}
                </motion.p>
              ) : null}
            </header>

            <div className="section mt-14 sm:mt-20">
              <motion.div
                layoutId={projectImageLayoutId(project.slug)}
                className="relative overflow-hidden rounded-3xl border border-gold/10"
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectImage
                  src={project.imageUrl}
                  alt={`${project.title} — product screenshot`}
                  seed={project.slug}
                  priority
                  className="max-h-[85vh] min-h-[40vh]"
                  imgClassName="object-contain bg-ink"
                />
              </motion.div>
            </div>

            <div className="section mt-20 grid gap-14 pb-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <h2 className="label-caps">Overview</h2>
                <p className="mt-6 text-lg leading-relaxed whitespace-pre-line text-ivory/90 sm:text-xl">
                  {project.description}
                </p>
              </Reveal>
              <Reveal className="space-y-10 lg:col-span-4 lg:col-start-9" delay={0.1}>
                {project.techStack.length > 0 ? (
                  <div>
                    <h2 className="label-caps">Tech stack</h2>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {project.techStack.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-gold/25 px-3.5 py-1.5 text-xs font-medium text-ivory/90"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="flex flex-col gap-3">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-between gap-3 rounded-full bg-[image:var(--gold-gradient)] px-7 py-4 text-sm font-semibold tracking-[0.08em] text-ink"
                    >
                      Visit Live Site
                      <ArrowUpRight
                        className="size-4 transition-transform duration-500 group-hover:rotate-45"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hairline inline-flex items-center justify-between gap-3 rounded-full px-7 py-4 text-sm font-semibold text-ivory hover:bg-ivory/5"
                    >
                      View source
                      <GithubIcon className="size-4" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </article>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
