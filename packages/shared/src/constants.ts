/**
 * Zod-free constants and helpers. Import from "@jomel/shared/constants" in code that must stay
 * light (the public frontend bundle); the schemas in the main entry re-export all of this.
 */

/** Allowed characters for category and tech tags. Also used to reject PostgREST filter injection. */
export const SAFE_TAG_REGEX = /^[\w .+#-]{1,40}$/;

/** Lower-case kebab slug, e.g. `intelligent-engineer`. */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Storage object path inside the `project-images` bucket. */
export const IMAGE_PATH_REGEX = /^(projects|seed)\/[a-z0-9-]{1,80}\.(png|jpg|jpeg|webp|avif)$/;

export const SORT_FIELDS = ['created_at', 'title', 'sort_order'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 9;

export const PROJECT_STATUSES = ['draft', 'published'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Suggested categories for the admin form. Any value matching the tag regex is accepted. */
export const SUGGESTED_CATEGORIES = ['SaaS', 'Web App', 'Mobile App', 'AI'] as const;

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

/** 5 MB upload ceiling, enforced by the API and by the storage bucket. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<AllowedImageType, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Turns any title into a slug that satisfies {@link SLUG_REGEX}. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}
