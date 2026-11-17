import type { AdminProjectListQuery, Project, SortField } from '@jomel/shared';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Pencil, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { ProjectImage } from '../../../components/ui/ProjectImage';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn, formatDate } from '../../../lib/utils';

interface ProjectsTableProps {
  rows: Project[] | undefined;
  loading: boolean;
  sort: AdminProjectListQuery['sort'];
  order: AdminProjectListQuery['order'];
  onSort: (field: SortField) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function SortHeader({
  field,
  label,
  sort,
  order,
  onSort,
  className,
}: {
  field: SortField;
  label: string;
  sort: SortField;
  order: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  className?: string;
}) {
  const active = sort === field;
  const Icon = active ? (order === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn('px-4 py-3 text-left', className)}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn('inline-flex items-center gap-1.5 hover:text-ivory', active && 'text-gold')}
      >
        {label}
        <Icon className="size-3.5" aria-hidden="true" />
      </button>
    </th>
  );
}

export function ProjectsTable({
  rows,
  loading,
  sort,
  order,
  onSort,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-smoke" data-lenis-prevent>
      <table className="w-full min-w-[860px] text-sm">
        <caption className="sr-only">Projects, including drafts</caption>
        <thead className="bg-graphite/60 text-xs font-semibold tracking-wider text-stone uppercase">
          <tr>
            <th scope="col" className="w-20 px-4 py-3 text-left">
              <span className="sr-only">Image</span>
            </th>
            <SortHeader field="title" label="Project" sort={sort} order={order} onSort={onSort} />
            <th scope="col" className="px-4 py-3 text-left">
              Category
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Status
            </th>
            <SortHeader
              field="sort_order"
              label="Order"
              sort={sort}
              order={order}
              onSort={onSort}
            />
            <SortHeader
              field="created_at"
              label="Created"
              sort={sort}
              order={order}
              onSort={onSort}
            />
            <th scope="col" className="px-4 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-smoke">
          {loading && !rows
            ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            : null}
          {rows?.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-14 text-center text-stone">
                No projects match these filters.
              </td>
            </tr>
          ) : null}
          {rows?.map((project) => (
            <tr key={project.id} className="transition-colors hover:bg-ivory/[0.02]">
              <td className="px-4 py-3">
                <ProjectImage
                  src={project.imageUrl}
                  alt={project.title}
                  seed={project.slug}
                  className="h-11 w-16 rounded-md"
                  imgClassName="object-top"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ivory">{project.title}</span>
                  {project.featured ? (
                    <Star className="size-3.5 fill-gold text-gold" aria-label="Featured" />
                  ) : null}
                </div>
                <span className="font-mono text-xs text-stone-dark">/{project.slug}</span>
              </td>
              <td className="px-4 py-3 text-stone">{project.category}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide uppercase',
                    project.status === 'published'
                      ? 'bg-success/15 text-success'
                      : 'bg-stone/15 text-stone',
                  )}
                >
                  {project.status}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-stone">{project.sortOrder}</td>
              <td className="px-4 py-3 whitespace-nowrap text-stone">
                {formatDate(project.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  {project.status === 'published' ? (
                    <Link
                      to={`/work/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-stone hover:bg-ivory/5 hover:text-ivory"
                      aria-label={`View ${project.title} on the site`}
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="rounded-full p-2 text-stone hover:bg-ivory/5 hover:text-gold"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project)}
                    className="rounded-full p-2 text-stone hover:bg-danger/10 hover:text-danger"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
