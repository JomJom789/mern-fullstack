import { z } from 'zod';
import { SAFE_TAG_REGEX, SLUG_REGEX } from './constants.js';

export const tagSchema = z
  .string()
  .trim()
  .min(1, 'Required')
  .max(40, 'Max 40 characters')
  .regex(SAFE_TAG_REGEX, 'Only letters, numbers, spaces and . + # - _ are allowed');

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Required')
  .max(80, 'Max 80 characters')
  .regex(SLUG_REGEX, 'Lower-case letters, numbers and single dashes only');

export const uuidSchema = z.uuid();

/** An absolute https:// URL. Plain http and other protocols are rejected. */
export const httpsUrlSchema = z
  .string()
  .trim()
  .max(2048, 'URL is too long')
  .pipe(z.url({ protocol: /^https$/, error: 'Must be a valid https:// URL' }));

export const idParamsSchema = z.strictObject({ id: uuidSchema });
export const slugParamsSchema = z.strictObject({ slug: slugSchema });

/** Response envelope for paginated lists. */
export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    data: z.array(item),
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  });

export const apiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
    requestId: z.string().optional(),
    details: z.unknown().optional(),
  }),
});
export type ApiError = z.infer<typeof apiErrorSchema>;
