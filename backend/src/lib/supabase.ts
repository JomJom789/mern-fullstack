import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import type { Database } from './database.types.js';

export const PROJECT_IMAGES_BUCKET = 'project-images';

/**
 * Service-role client. It bypasses RLS, so it lives on the server only and every
 * route that reaches it is validated (Zod) and, for writes, guarded by requireAdmin.
 */
export const supabaseAdmin = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { 'x-application-name': 'portfolio-api' },
    },
  },
);

/** Public URL for an object in the project image bucket (or null when there is no image). */
export function publicImageUrl(path: string | null): string | null {
  if (!path) return null;
  return supabaseAdmin.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}
