import { signUploadInputSchema, type SignUploadInput } from '@jomel/shared';
import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { getValidated, validate } from '../../middleware/validate.js';
import { createSignedImageUpload } from './uploads.service.js';

/** Admin uploads: /api/admin/uploads (mounted behind requireAdmin). */
export function adminUploadsRouter(signLimiter: RequestHandler): Router {
  const router = Router();
  router.post(
    '/sign',
    signLimiter,
    validate({ body: signUploadInputSchema, query: z.strictObject({}) }),
    async (_req, res) => {
      const input = getValidated<SignUploadInput>(res, 'body');
      res
        .set('Cache-Control', 'no-store')
        .status(201)
        .json(await createSignedImageUpload(input));
    },
  );
  return router;
}
