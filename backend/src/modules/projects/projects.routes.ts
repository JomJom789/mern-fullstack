import { Router, type RequestHandler } from 'express';
import { validate } from '../../middleware/validate.js';
import * as controller from './projects.controller.js';
import {
  adminProjectListQuerySchema,
  idParamsSchema,
  projectInputSchema,
  projectListQuerySchema,
  projectUpdateSchema,
  reorderSchema,
  slugParamsSchema,
} from './projects.schema.js';
import { z } from 'zod';

const noQuery = z.strictObject({});

/** Public read API: /api/projects */
export function publicProjectsRouter(limiter: RequestHandler): Router {
  const router = Router();
  router.use(limiter);
  router.get('/', validate({ query: projectListQuerySchema }), controller.listPublic);
  // `/meta` is registered before `/:slug` so it is never treated as a slug.
  router.get('/meta', validate({ query: noQuery }), controller.meta);
  router.get(
    '/:slug',
    validate({ params: slugParamsSchema, query: noQuery }),
    controller.getBySlug,
  );
  return router;
}

/** Admin API: /api/admin/projects (mounted behind requireAdmin). */
export function adminProjectsRouter(): Router {
  const router = Router();
  router.get('/', validate({ query: adminProjectListQuerySchema }), controller.listAdmin);
  router.post('/', validate({ body: projectInputSchema, query: noQuery }), controller.create);
  // `/reorder` is registered before `/:id`.
  router.patch('/reorder', validate({ body: reorderSchema, query: noQuery }), controller.reorder);
  router.patch(
    '/:id',
    validate({ params: idParamsSchema, body: projectUpdateSchema, query: noQuery }),
    controller.update,
  );
  router.delete('/:id', validate({ params: idParamsSchema, query: noQuery }), controller.remove);
  return router;
}
