import { type AdminProjectListQuery, type Project, type SortField } from '@jomel/shared';
import { ArrowDownUp, LogOut, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Monogram } from '../../components/ui/Monogram';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { errorMessage } from '../../lib/api';
import { Pagination } from '../projects/components/Pagination';
import { useProjectMeta } from '../projects/hooks';
import { useAdminProjects, useDeleteProject } from './api';
import { ConfirmDialog } from './components/Overlay';
import { ProjectEditor } from './components/ProjectEditor';
import { ProjectsTable } from './components/ProjectsTable';
import { ReorderPanel } from './components/ReorderPanel';

type Filters = Pick<
  AdminProjectListQuery,
  'status' | 'category' | 'featured' | 'sort' | 'order' | 'page'
>;

const PAGE_SIZE = 10;

export function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [search, setSearch] = useState('');
  const q = useDebouncedValue(search.trim(), 300);
  const [filters, setFilters] = useState<Filters>({ sort: 'sort_order', order: 'asc', page: 1 });
  // `key` remounts the editor on every open, so the form always starts from fresh values.
  const [editing, setEditing] = useState<{ open: boolean; project: Project | null; key: number }>({
    open: false,
    project: null,
    key: 0,
  });
  const openEditor = (project: Project | null) =>
    setEditing((e) => ({ open: true, project, key: e.key + 1 }));
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [reordering, setReordering] = useState(false);

  // The debounced search starts a new result set, so it always resets to page 1.
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setFilters((f) => ({ ...f, page: 1 }));
  }

  const query: AdminProjectListQuery = { ...filters, q: q || undefined, pageSize: PAGE_SIZE };
  const list = useAdminProjects(query);
  const meta = useProjectMeta();
  const remove = useDeleteProject();

  const patch = (next: Partial<Filters>) => setFilters((f) => ({ ...f, page: 1, ...next }));
  const onSort = (field: SortField) =>
    setFilters((f) => ({
      ...f,
      page: 1,
      sort: field,
      order: f.sort === field && f.order === 'asc' ? 'desc' : 'asc',
    }));

  const confirmDelete = () => {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    remove.mutate(target.id, {
      onSuccess: () => toast.success(`Deleted “${target.title}”`),
      onError: (error) => toast.error(`Could not delete: ${errorMessage(error)}`),
    });
  };

  const nextSortOrder = (list.data?.total ?? 0) + 1;

  return (
    <div className="min-h-[100svh]">
      <header className="border-b border-smoke bg-charcoal/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Monogram className="size-9" />
            <div>
              <p className="font-display text-xl text-ivory">Studio</p>
              <p className="text-xs text-stone">{email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-smoke px-4 py-2 text-sm text-ivory hover:border-gold/50"
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-caps text-gold">Content</p>
            <h1 className="mt-2 font-display text-5xl text-ivory">Projects</h1>
            <p className="mt-2 text-sm text-stone">
              {list.data ? `${list.data.total} total, drafts included` : 'Loading…'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReordering(true)}
              className="inline-flex items-center gap-2 rounded-full border border-smoke px-5 py-2.5 text-sm text-ivory hover:border-gold/50"
            >
              <ArrowDownUp className="size-4" aria-hidden="true" /> Reorder
            </button>
            <button
              type="button"
              onClick={() => openEditor(null)}
              className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gold-gradient)] px-5 py-2.5 text-sm font-semibold text-ink"
            >
              <Plus className="size-4" aria-hidden="true" /> New project
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <label className="relative">
            <span className="sr-only">Search projects</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              maxLength={100}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, stack, description…"
              className="field-luxe pl-10"
            />
          </label>
          <label>
            <span className="sr-only">Status</span>
            <select
              className="field-luxe"
              value={filters.status ?? ''}
              onChange={(event) =>
                patch({
                  status:
                    event.target.value === ''
                      ? undefined
                      : (event.target.value as Filters['status']),
                })
              }
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Category</span>
            <select
              className="field-luxe"
              value={filters.category ?? ''}
              onChange={(event) => patch({ category: event.target.value || undefined })}
            >
              <option value="">All categories</option>
              {(meta.data?.categories ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Featured</span>
            <select
              className="field-luxe"
              value={filters.featured === undefined ? '' : String(filters.featured)}
              onChange={(event) =>
                patch({
                  featured: event.target.value === '' ? undefined : event.target.value === 'true',
                })
              }
            >
              <option value="">Featured: any</option>
              <option value="true">Featured only</option>
              <option value="false">Not featured</option>
            </select>
          </label>
        </div>

        <div className="mt-6">
          {list.isError ? (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
              {errorMessage(list.error)}
            </p>
          ) : (
            <ProjectsTable
              rows={list.data?.data}
              loading={list.isPending}
              sort={filters.sort}
              order={filters.order}
              onSort={onSort}
              onEdit={openEditor}
              onDelete={setDeleting}
            />
          )}
        </div>

        {list.data && list.data.totalPages > 1 ? (
          <Pagination
            page={filters.page}
            totalPages={list.data.totalPages}
            onChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        ) : null}
      </main>

      <ProjectEditor
        key={editing.key}
        open={editing.open}
        project={editing.project}
        nextSortOrder={nextSortOrder}
        onClose={() => setEditing((e) => ({ ...e, open: false }))}
      />
      <ReorderPanel open={reordering} onClose={() => setReordering(false)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Delete project?"
        message={
          <>
            <strong className="text-ivory">{deleting?.title}</strong> and its image will be
            permanently removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        busy={remove.isPending}
      />
    </div>
  );
}
