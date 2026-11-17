import compression from 'compression';
import cors from 'cors';
import express, { Router, type Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import type { RateLimiters } from './middleware/rateLimit.js';
import { requestId } from './middleware/requestId.js';
import { requireAdmin } from './middleware/requireAdmin.js';
import { contactRouter } from './modules/contact/contact.routes.js';
import { healthRouter } from './modules/health/health.routes.js';
import { adminProjectsRouter, publicProjectsRouter } from './modules/projects/projects.routes.js';
import { adminUploadsRouter } from './modules/uploads/uploads.routes.js';

const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';

export function createApp(limiters: RateLimiters): Express {
  const app = express();
  const supabaseOrigin = new URL(env.SUPABASE_URL).origin;

  // Render (and most PaaS) terminate TLS at one proxy hop: trust exactly one, for req.ip.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (_req, res) => (res as express.Response).locals.requestId,
      customLogLevel: (_req, res, error) =>
        error || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      serializers: {
        req: (req: { id: string; method: string; url: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
        res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
      },
      autoLogging: { ignore: (req) => req.url === '/api/health' },
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'none'"],
          baseUri: ["'none'"],
          formAction: ["'none'"],
          frameAncestors: ["'none'"],
          connectSrc: ["'self'", supabaseOrigin, ...env.CORS_ORIGINS],
          imgSrc: ["'self'", 'data:', supabaseOrigin],
          scriptSrc: ["'self'", TURNSTILE_ORIGIN],
          frameSrc: [TURNSTILE_ORIGIN],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      strictTransportSecurity: { maxAge: 63_072_000, includeSubDomains: true, preload: true },
    }),
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        // Non-browser clients (curl, health checks) send no Origin header.
        if (!origin || env.CORS_ORIGINS.includes(origin)) callback(null, true);
        else callback(null, false);
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      exposedHeaders: [
        'X-Request-Id',
        'RateLimit-Limit',
        'RateLimit-Remaining',
        'RateLimit-Reset',
        'Retry-After',
      ],
      maxAge: 600,
    }),
  );

  app.use(compression());
  app.use(express.json({ limit: '100kb', strict: true, type: 'application/json' }));
  app.use(hpp());
  app.use(limiters.global);

  const api = Router();
  api.use('/health', healthRouter());
  api.use('/projects', publicProjectsRouter(limiters.publicProjects));
  api.use('/contact', contactRouter(limiters.contact));

  const admin = Router();
  admin.use(limiters.admin, requireAdmin);
  admin.get('/session', (_req, res) => {
    res.set('Cache-Control', 'no-store').json({ ok: true, email: res.locals.admin?.email });
  });
  admin.use('/projects', adminProjectsRouter());
  admin.use('/uploads', adminUploadsRouter(limiters.uploadSign));
  api.use('/admin', admin);

  app.use('/api', api);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
