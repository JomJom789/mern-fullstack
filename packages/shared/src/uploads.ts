import { z } from 'zod';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from './constants.js';

export const signUploadInputSchema = z.strictObject({
  contentType: z.enum(ALLOWED_IMAGE_TYPES),
  size: z.number().int().min(1).max(MAX_IMAGE_BYTES, 'Images must be 5 MB or smaller'),
});
export type SignUploadInput = z.infer<typeof signUploadInputSchema>;

export const signUploadResponseSchema = z.object({
  path: z.string(),
  signedUrl: z.string(),
  token: z.string(),
  publicUrl: z.string(),
});
export type SignUploadResponse = z.infer<typeof signUploadResponseSchema>;
