import type { SortField, SortOrder } from '@jomel/shared';

export type { Project, ProjectListResponse, ProjectMeta } from '@jomel/shared';

/** UI sort options for the public explorer, mapped to whitelisted API sort params. */
export const SORT_OPTIONS = {
  curated: { label: 'Curated', sort: 'sort_order', order: 'asc' },
  newest: { label: 'Newest', sort: 'created_at', order: 'desc' },
  oldest: { label: 'Oldest', sort: 'created_at', order: 'asc' },
  az: { label: 'A–Z', sort: 'title', order: 'asc' },
} as const satisfies Record<string, { label: string; sort: SortField; order: SortOrder }>;

export type SortKey = keyof typeof SORT_OPTIONS;

export const isSortKey = (value: string | null): value is SortKey =>
  value !== null && Object.hasOwn(SORT_OPTIONS, value);

export interface PublicProjectFilters {
  q?: string;
  category?: string;
  tech?: string[];
  featured?: boolean;
  sort: SortKey;
  page: number;
  pageSize: number;
}
