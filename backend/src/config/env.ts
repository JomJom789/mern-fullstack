import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

// Load backend/.env for local development. Hosted environments (Render, Docker) inject vars directly.
const envFile = resolve(import.meta.dirname, '../../.env');
const envFileFromDist = resolve(import.meta.dirname, '../../../.env');
for (const file of [envFile, envFileFromDist]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === undefined || value === '' ? undefined : value));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  SUPABASE_URL: z.url({ protocol: /^https?$/ }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(20, 'SUPABASE_SERVICE_ROLE_KEY looks invalid'),

  ADMIN_EMAIL: z
    .string()
    .trim()
    .pipe(z.email())
    .transform((value) => value.toLowerCase()),

  CORS_ORIGINS: z
    .string()
    .trim()
    .min(1, 'CORS_ORIGINS must list at least one origin')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim().replace(/\/+$/, ''))
        .filter((origin) => origin.length > 0),
    )
    .pipe(z.array(z.url({ protocol: /^https?$/ })).min(1)),

  REDIS_URL: optionalString.pipe(z.url({ protocol: /^rediss?$/ }).optional()),
  RESEND_API_KEY: optionalString,
  CONTACT_FROM_EMAIL: optionalString,
  CONTACT_TO_EMAIL: optionalString.pipe(z.email().optional()),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    // Logger is not available yet (it depends on env), so write directly to stderr.
    process.stderr.write(`\n❌ Invalid backend environment variables:\n${issues}\n\n`);
    process.exit(1);
  }
  return Object.freeze(parsed.data);
}

export const env = loadEnv();
export const isProduction = env.NODE_ENV === 'production';
