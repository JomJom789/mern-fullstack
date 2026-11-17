/**
 * Request schemas for the projects module. They live in @jomel/shared so the frontend
 * builds requests from exactly the same definitions.
 */
export {
  adminProjectListQuerySchema,
  idParamsSchema,
  projectInputSchema,
  projectListQuerySchema,
  projectUpdateSchema,
  reorderSchema,
  slugParamsSchema,
  type AdminProjectListQuery,
  type Project,
  type ProjectInput,
  type ProjectListQuery,
  type ProjectMeta,
  type ProjectUpdate,
  type ReorderInput,
} from '@jomel/shared';
