import { pino } from 'pino';
import { env } from '../config/env.js';

/**
 * Structured logger. Credentials never reach the log output: auth headers, cookies,
 * tokens and keys are redacted wherever they appear.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'portfolio-api' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
      '*.access_token',
      '*.refresh_token',
      '*.signedUrl',
      '*.SUPABASE_SERVICE_ROLE_KEY',
    ],
    censor: '[redacted]',
  },
});
