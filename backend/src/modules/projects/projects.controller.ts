import type { Request, Response } from 'express';
import { getValidated } from '../../middleware/validate.js';
import type {
  AdminProjectListQuery,
  ProjectInput,
  ProjectListQuery,
  ProjectUpdate,
  ReorderInput,
} from './projects.schema.js';
import * as service from './projects.service.js';

/** Public responses may be cached briefly by browsers and CDNs. */
const PUBLIC_CACHE = 'public, max-age=60, stale-while-revalidate=300';

export async function listPublic(_req: Request, res: Response) {
  const query = getValidated<ProjectListQuery>(res, 'query');
  const result = await service.listProjects(query, { includeDrafts: false });
  res.set('Cache-Control', PUBLIC_CACHE).json(result);
}

export async function meta(_req: Request, res: Response) {
  res.set('Cache-Control', PUBLIC_CACHE).json(await service.getProjectMeta());
}

export async function getBySlug(_req: Request, res: Response) {
  const { slug } = getValidated<{ slug: string }>(res, 'params');
  res.set('Cache-Control', PUBLIC_CACHE).json(await service.getPublishedProjectBySlug(slug));
}

export async function listAdmin(_req: Request, res: Response) {
  const query = getValidated<AdminProjectListQuery>(res, 'query');
  res
    .set('Cache-Control', 'no-store')
    .json(await service.listProjects(query, { includeDrafts: true }));
}

export async function create(_req: Request, res: Response) {
  const input = getValidated<ProjectInput>(res, 'body');
  res.status(201).json(await service.createProject(input));
}

export async function update(_req: Request, res: Response) {
  const { id } = getValidated<{ id: string }>(res, 'params');
  const input = getValidated<ProjectUpdate>(res, 'body');
  res.json(await service.updateProject(id, input));
}

export async function remove(_req: Request, res: Response) {
  const { id } = getValidated<{ id: string }>(res, 'params');
  await service.deleteProject(id);
  res.status(204).end();
}

export async function reorder(_req: Request, res: Response) {
  await service.reorderProjects(getValidated<ReorderInput>(res, 'body'));
  res.status(204).end();
}
