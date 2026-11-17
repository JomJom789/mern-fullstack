import { contactInputSchema, type ContactInput } from '@jomel/shared';
import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { logger } from '../../lib/logger.js';
import { getValidated, validate } from '../../middleware/validate.js';
import { submitContactMessage } from './contact.service.js';

/** Public contact form: /api/contact */
export function contactRouter(limiter: RequestHandler): Router {
  const router = Router();
  router.post(
    '/',
    limiter,
    validate({ body: contactInputSchema, query: z.strictObject({}) }),
    async (req, res) => {
      const input = getValidated<ContactInput>(res, 'body');
      if (input.website.trim().length > 0) {
        // Honeypot filled: pretend success so bots learn nothing, but store nothing.
        logger.info({ requestId: res.locals.requestId }, 'Contact honeypot triggered');
        res.status(202).json({ ok: true });
        return;
      }
      await submitContactMessage(input, { ip: req.ip, userAgent: req.get('user-agent') });
      res.status(201).json({ ok: true });
    },
  );
  return router;
}
