import type { RequestHandler } from 'express';
import { rateLimit, type Options, type Store } from 'express-rate-limit';
import { RedisStore, type RedisReply } from 'rate-limit-redis';
import { createClient } from 'redis';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

/** The subset of the Redis client the rate-limit store needs. */
interface RedisCommandClient {
  sendCommand(args: string[]): Promise<unknown>;
  quit(): Promise<unknown>;
}

export interface RateLimiters {
  global: RequestHandler;
  publicProjects: RequestHandler;
  admin: RequestHandler;
  uploadSign: RequestHandler;
  contact: RequestHandler;
}

const MINUTE = 60_000;

/**
 * Connects to Redis when REDIS_URL is set, so limits are shared across instances.
 * Returns null (in-memory stores) when Redis is not configured or unreachable at boot.
 */
export async function connectRateLimitRedis(): Promise<RedisCommandClient | null> {
  if (!env.REDIS_URL) return null;
  const client = createClient({ url: env.REDIS_URL });
  client.on('error', (error: unknown) =>
    logger.warn({ err: error }, 'Redis rate-limit store error'),
  );
  try {
    await client.connect();
    logger.info('Rate limiting uses the Redis store');
    return client;
  } catch (error) {
    logger.warn({ err: error }, 'Redis unavailable — falling back to in-memory rate limiting');
    client.destroy();
    return null;
  }
}

export function createRateLimiters(redis: RedisCommandClient | null): RateLimiters {
  const store = (prefix: string): Store | undefined =>
    redis
      ? new RedisStore({
          prefix: `rl:${prefix}:`,
          sendCommand: (...args: string[]) => redis.sendCommand(args) as Promise<RedisReply>,
        })
      : undefined;

  const make = (prefix: string, windowMs: number, limit: number): RequestHandler => {
    const options: Partial<Options> = {
      windowMs,
      limit,
      standardHeaders: 'draft-6',
      legacyHeaders: false,
      handler: (_req, res, _next, opts) => {
        res.status(opts.statusCode).json({
          error: {
            message: 'Too many requests — please slow down and try again shortly.',
            code: 'rate_limited',
            requestId: res.locals.requestId,
          },
        });
      },
    };
    const redisStore = store(prefix);
    if (redisStore) options.store = redisStore;
    return rateLimit(options);
  };

  return {
    global: make('global', 15 * MINUTE, 300),
    publicProjects: make('projects', MINUTE, 120),
    admin: make('admin', MINUTE, 60),
    uploadSign: make('upload-sign', 10 * MINUTE, 20),
    contact: make('contact', 60 * MINUTE, 5),
  };
}
