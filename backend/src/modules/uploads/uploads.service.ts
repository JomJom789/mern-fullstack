import { randomUUID } from 'node:crypto';
import { IMAGE_EXTENSIONS, type SignUploadInput, type SignUploadResponse } from '@jomel/shared';
import { HttpError } from '../../lib/httpError.js';
import { logger } from '../../lib/logger.js';
import { PROJECT_IMAGES_BUCKET, publicImageUrl, supabaseAdmin } from '../../lib/supabase.js';

/**
 * Creates a one-time signed upload URL. The object name is a server-generated UUID with an
 * extension derived from the validated MIME type, so the client's file name is never used.
 * The bucket enforces the same MIME whitelist and 5 MB limit server-side.
 */
export async function createSignedImageUpload(input: SignUploadInput): Promise<SignUploadResponse> {
  const path = `projects/${randomUUID()}.${IMAGE_EXTENSIONS[input.contentType]}`;
  const { data, error } = await supabaseAdmin.storage
    .from(PROJECT_IMAGES_BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    logger.error({ message: error.message }, 'Failed to create signed upload URL');
    throw HttpError.internal('Could not prepare the upload');
  }

  return {
    path: data.path,
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl: publicImageUrl(data.path) ?? '',
  };
}
