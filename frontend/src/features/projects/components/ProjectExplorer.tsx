import { SAFE_TAG_REGEX } from '@jomel/shared/constants';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useScrollTo } from '../../../components/layout/SmoothScroll';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { errorMessage } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import { useProjectMeta, useProjects } from '../hooks';
import { SORT_OPTIONS, isSortKey, type PublicProjectFilters } from '../types';
import { Pagination } from './Pagination';
import { ProjectCard, ProjectCardSkeleton } from './ProjectCard';

const PAGE_SIZE = 9;
const SECTION_ID = 'projects';

/** Reads explorer state from the URL, discarding anything malformed. */
function readFilters(params: URLSearchParams): PublicProjectFilters {
  const q = (params.get('q') ?? '').slice(0, 100);
  const category = params.get('category');
  const tech = (params.get('tech') ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter((t) => SAFE_TAG_REGEX.test(t))
    .slice(0, 10);
  const sort = params.get('sort');
  const page = Number.parseInt(params.get('page') ?? '1', 10);
  return {
    q: q || undefined,
    category: category && SAFE_TAG_REGEX.test(category) ? category : undefined,
    tech: tech.length > 0 ? tech : undefined,
    sort: isSortKey(sort) ? sort : 'curated',
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 10_000) : 1,
    pageSize: PAGE_SIZE,
  };
}

function TechSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (tag: string) =>
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-12 items-center gap-2.5 rounded-full border border-smoke px-5 text-sm text-ivory transition-colors hover:border-gold/50 focus-visible:border-gold"
      >
        <SlidersHorizontal className="size-4 text-gold" aria-hidden="true" />
        Technologies
        {selected.length > 0 ? (
          <span className="rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-ink">
            {selected.length}
          </span>
        ) : null}
        <ChevronDown
          className={cn('size-4 text-stone transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="glass absolute right-0 z-30 mt-2 max-h-80 w-64 overflow-y-auto rounded-2xl p-2 sm:left-0"
            data-lenis-prevent
          >
            <ul role="listbox" aria-multiselectable="true" aria-label="Filter by technology">
              {options.length === 0 ? (
                <li className="px-3 py-2 text-sm text-stone">No technologies yet</li>
              ) : null}
              {options.map((tag) => {
                const active = selected.includes(tag);
                return (
                  <li key={tag} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => toggle(tag)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors',
                        active ? 'bg-gold/10 text-gold-light' : 'text-ivory/85 hover:bg-ivory/5',
                      )}
                    >
                      {tag}
                      {active ? <Check className="size-4" aria-hidden="true" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            {selected.length > 0 ? (
              <button
                type="button"
                onClick={() => onChange([])}
                className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold tracking-wider text-stone uppercase hover:text-ivory"
              >
                Clear selection
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ProjectExplorer() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const scrollTo = useScrollTo();
  const [search, setSearch] = useState(filters.q ?? '');
  const debouncedSearch = useDebouncedValue(search, 300);

  // Keep the input in sync when the URL changes from outside (back/forward, reset links).
  const [syncedQ, setSyncedQ] = useState(filters.q ?? '');
  const urlQ = filters.q ?? '';
  if (urlQ !== syncedQ) {
    setSyncedQ(urlQ);
    if (urlQ !== debouncedSearch.trim()) setSearch(urlQ);
  }
  const meta = useProjectMeta();
  const { data, isPending, isFetching, isError, error } = useProjects(filters);

  const update = (
    patch: Partial<Record<'q' | 'category' | 'tech' | 'sort' | 'page', string | undefined>>,
    replace = false,
  ) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value === undefined || value === '') next.delete(key);
          else next.set(key, value);
        }
        if (!('page' in patch)) next.delete('page');
        if (next.get('sort') === 'curated') next.delete('sort');
        return next;
      },
      { replace, preventScrollReset: true },
    );
  };

  // Push the debounced search term into the URL (replace, so typing doesn't spam history).
  useEffect(() => {
    if ((filters.q ?? '') === debouncedSearch.trim()) return;
    update({ q: debouncedSearch.trim() || undefined }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the debounced term
  }, [debouncedSearch]);

  const goToPage = (page: number) => {
    update({ page: page > 1 ? String(page) : undefined });
    scrollTo(SECTION_ID, { offset: -96 });
  };

  const hasFilters = Boolean(filters.q || filters.category || filters.tech?.length);
  const resetAll = () => {
    setSearch('');
    setParams(new URLSearchParams(), { preventScrollReset: true });
  };
  const gridKey = JSON.stringify(filters);

  return (
    <section
      id={SECTION_ID}
      className="relative scroll-mt-24 py-28 sm:py-36"
      aria-label="All projects"
    >
      <div className="section">
        <SectionHeading
          index="04"
          label="All Projects"
          title="Explore the full archive"
          intro="Search, filter by category or technology, and sort the complete collection."
        />

        <div className="mt-14 flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search projects</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-gold"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value.slice(0, 100))}
                placeholder="Search by name, stack or idea…"
                maxLength={100}
                className="h-12 w-full rounded-full border border-smoke bg-charcoal/60 pr-11 pl-12 text-sm text-ivory placeholder:text-stone-dark focus:border-gold/60 focus:outline-none"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-stone hover:text-ivory"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <TechSelect
                options={meta.data?.tech ?? []}
                selected={filters.tech ?? []}
                onChange={(next) => update({ tech: next.length > 0 ? next.join(',') : undefined })}
              />
              <label className="relative">
                <span className="sr-only">Sort projects</span>
                <select
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value })}
                  className="h-12 appearance-none rounded-full border border-smoke bg-charcoal/60 pr-11 pl-5 text-sm text-ivory focus:border-gold/60 focus:outline-none"
                >
                  {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-stone"
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {['All', ...(meta.data?.categories ?? [])].map((category) => {
              const active = category === 'All' ? !filters.category : filters.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ category: category === 'All' ? undefined : category })}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-300',
                    active
                      ? 'border-gold bg-gold text-ink'
                      : 'border-smoke text-stone hover:border-gold/50 hover:text-ivory',
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-sm text-stone" aria-live="polite">
            <span>
              {data ? `${data.total} project${data.total === 1 ? '' : 's'}` : 'Loading projects…'}
              {isFetching && !isPending ? (
                <span className="ml-2 text-gold/80">Updating…</span>
              ) : null}
            </span>
            {hasFilters ? (
              <button
                type="button"
                onClick={resetAll}
                className="font-semibold text-gold hover:text-gold-light"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative mt-10 min-h-[24rem]">
          {isError ? (
            <p className="glass rounded-2xl p-8 text-stone">
              Projects could not be loaded. {errorMessage(error)}
            </p>
          ) : isPending ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={gridKey}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {data.data.length === 0 ? (
                  <div className="flex flex-col items-center py-24 text-center">
                    <span className="font-display text-7xl text-gold/40 italic" aria-hidden="true">
                      ∅
                    </span>
                    <p className="mt-6 font-display text-3xl text-ivory">Nothing matches — yet.</p>
                    <p className="mt-3 max-w-sm text-stone">
                      Try a different search term, or clear the filters to see everything.
                    </p>
                    {hasFilters ? (
                      <button
                        type="button"
                        onClick={resetAll}
                        className="mt-8 rounded-full border border-gold/40 px-6 py-3 text-xs font-semibold tracking-[0.2em] text-gold uppercase hover:bg-gold hover:text-ink"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data.data.map((project, i) => (
                      <motion.li
                        key={project.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.6 }}
                      >
                        <ProjectCard project={project} index={(filters.page - 1) * PAGE_SIZE + i} />
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {data && data.totalPages > 1 ? (
          <Pagination page={filters.page} totalPages={data.totalPages} onChange={goToPage} />
        ) : null}
      </div>
    </section>
  );
}
