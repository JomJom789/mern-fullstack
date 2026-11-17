import { env } from './config/env.js';
import { createApp } from './app.js';
import { logger } from './lib/logger.js';
import { connectRateLimitRedis, createRateLimiters } from './middleware/rateLimit.js';

const redis = await connectRateLimitRedis();
const app = createApp(createRateLimiters(redis));

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Portfolio API listening');
});
server.on('error', (error) => {
  logger.fatal({ err: error }, 'HTTP server failed to start');
  process.exit(1);
});

let shuttingDown = false;
function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Shutting down');
  const force = setTimeout(() => process.exit(1), 10_000);
  force.unref();
  server.close(() => {
    void (redis ? redis.quit().catch(() => undefined) : Promise.resolve()).finally(() =>
      process.exit(0),
    );
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});
