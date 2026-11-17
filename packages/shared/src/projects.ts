import { z } from 'zod';
import {
  DEFAULT_PAGE_SIZE,
  IMAGE_PATH_REGEX,
  MAX_PAGE_SIZE,
  PROJECT_STATUSES,
  SORT_FIELDS,
  SORT_ORDERS,
} from './constants.js';
import { httpsUrlSchema, paginatedSchema, slugSchema, tagSchema, uuidSchema } from './common.js';

export const imagePathSchema = z.string().regex(IMAGE_PATH_REGEX, 'Invalid image path');

// ---------------------------------------------------------------------------
// Output shape (what the API returns)
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  id: uuidSchema,
  slug: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  description: z.string(),
  category: z.string(),
  techStack: z.array(z.string()),
  liveUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  imagePath: z.string().nullable(),
  imageUrl: z.string().nullable(),
  featured: z.boolean(),
  status: z.enum(PROJECT_STATUSES),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectListResponseSchema = paginatedSchema(projectSchema);
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;

export const projectMetaSchema = z.object({
  categories: z.array(z.string()),
  tech: z.array(z.string()),
});
export type ProjectMeta = z.infer<typeof projectMetaSchema>;

// ---------------------------------------------------------------------------
// Query strings
// ---------------------------------------------------------------------------

const techListSchema = z
  .string()
  .trim()
  .max(500)
  .transform((value) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
  )
  .pipe(z.array(tagSchema).max(10, 'Up to 10 tech filters'));

const listQueryShape = {
  q: z.string().trim().max(100, 'Search is limited to 100 characters').optional(),
  category: tagSchema.optional(),
  tech: techListSchema.optional(),
  featured: z.stringbool().optional(),
  sort: z.enum(SORT_FIELDS).default('sort_order'),
  order: z.enum(SORT_ORDERS).default('asc'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
};

export const projectListQuerySchema = z.strictObject(listQueryShape);
export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;
export type ProjectListQueryInput = z.input<typeof projectListQuerySchema>;

export const adminProjectListQuerySchema = z.strictObject({
  ...listQueryShape,
  status: z.enum(PROJECT_STATUSES).optional(),
});
export type AdminProjectListQuery = z.infer<typeof adminProjectListQuerySchema>;

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Max ${max} characters`)
    .transform((value) => (value.length === 0 ? null : value))
    .nullable();

const nullableHttpsUrl = z
  .union([z.literal(''), httpsUrlSchema])
  .transform((value) => (value === '' ? null : value))
  .nullable();

export const projectInputSchema = z.strictObject({
  slug: slugSchema,
  title: z.string().trim().min(2, 'At least 2 characters').max(120, 'Max 120 characters'),
  tagline: nullableText(160).default(null),
  description: z.string().trim().min(10, 'At least 10 characters').max(5000, 'Max 5000 characters'),
  category: tagSchema,
  techStack: z.array(tagSchema).max(30, 'Up to 30 technologies').default([]),
  liveUrl: nullableHttpsUrl.default(null),
  repoUrl: nullableHttpsUrl.default(null),
  imagePath: imagePathSchema.nullable().default(null),
  featured: z.boolean().default(false),
  status: z.enum(PROJECT_STATUSES).default('draft'),
  sortOrder: z.number().int().min(0).max(100_000).default(0),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectFormValues = z.input<typeof projectInputSchema>;

export const projectUpdateSchema = z
  .strictObject({
    slug: slugSchema,
    title: z.string().trim().min(2).max(120),
    tagline: nullableText(160),
    description: z.string().trim().min(10).max(5000),
    category: tagSchema,
    techStack: z.array(tagSchema).max(30),
    liveUrl: nullableHttpsUrl,
    repoUrl: nullableHttpsUrl,
    imagePath: imagePathSchema.nullable(),
    featured: z.boolean(),
    status: z.enum(PROJECT_STATUSES),
    sortOrder: z.number().int().min(0).max(100_000),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Nothing to update' });
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export const reorderSchema = z.strictObject({
  items: z
    .array(z.strictObject({ id: uuidSchema, sortOrder: z.number().int().min(0).max(100_000) }))
    .min(1)
    .max(200),
});
export type ReorderInput = z.infer<typeof reorderSchema>;
