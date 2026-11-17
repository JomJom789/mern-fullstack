import type { Paginated, SortField } from '@jomel/shared';
import type { PostgrestError } from '@supabase/supabase-js';
import type { ProjectInsertRow, ProjectRow } from '../../lib/database.types.js';
import { HttpError } from '../../lib/httpError.js';
import { logger } from '../../lib/logger.js';
import { sanitizeNullable, sanitizePlainText } from '../../lib/sanitize.js';
import { PROJECT_IMAGES_BUCKET, publicImageUrl, supabaseAdmin } from '../../lib/supabase.js';
import type {
  AdminProjectListQuery,
  Project,
  ProjectInput,
  ProjectListQuery,
  ProjectMeta,
  ProjectUpdate,
  ReorderInput,
} from './projects.schema.js';

/** Columns returned to clients. The generated `search` tsvector column is never selected. */
const PROJECT_COLUMNS =
  'id, slug, title, tagline, description, category, tech_stack, live_url, repo_url, image_path, featured, status, sort_order, created_at, updated_at';

/** Sort whitelist: user input never reaches .order() directly. */
const SORT_COLUMNS: Record<SortField, keyof ProjectRow> = {
  created_at: 'created_at',
  title: 'title',
  sort_order: 'sort_order',
};

const PG_UNIQUE_VIOLATION = '23505';
const PGRST_RANGE_NOT_SATISFIABLE = 'PGRST103';

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    techStack: row.tech_stack,
    liveUrl: row.live_url,
    repoUrl: row.repo_url,
    imagePath: row.image_path,
    imageUrl: publicImageUrl(row.image_path),
    featured: row.featured,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function dbError(error: PostgrestError): HttpError {
  if (error.code === PG_UNIQUE_VIOLATION) {
    return HttpError.conflict('A project with this slug already exists');
  }
  logger.error({ code: error.code, message: error.message }, 'Supabase query failed');
  return HttpError.internal();
}

function toInsertRow(input: ProjectInput): ProjectInsertRow {
  return {
    slug: input.slug,
    title: sanitizePlainText(input.title),
    tagline: sanitizeNullable(input.tagline),
    description: sanitizePlainText(input.description),
    category: input.category,
    tech_stack: [...new Set(input.techStack)],
    live_url: input.liveUrl,
    repo_url: input.repoUrl,
    image_path: input.imagePath,
    featured: input.featured,
    status: input.status,
    sort_order: input.sortOrder,
  };
}

function toUpdateRow(update: ProjectUpdate): Partial<ProjectInsertRow> {
  const row: Partial<ProjectInsertRow> = {};
  if (update.slug !== undefined) row.slug = update.slug;
  if (update.title !== undefined) row.title = sanitizePlainText(update.title);
  if (update.tagline !== undefined) row.tagline = sanitizeNullable(update.tagline);
  if (update.description !== undefined) row.description = sanitizePlainText(update.description);
  if (update.category !== undefined) row.category = update.category;
  if (update.techStack !== undefined) row.tech_stack = [...new Set(update.techStack)];
  if (update.liveUrl !== undefined) row.live_url = update.liveUrl;
  if (update.repoUrl !== undefined) row.repo_url = update.repoUrl;
  if (update.imagePath !== undefined) row.image_path = update.imagePath;
  if (update.featured !== undefined) row.featured = update.featured;
  if (update.status !== undefined) row.status = update.status;
  if (update.sortOrder !== undefined) row.sort_order = update.sortOrder;
  return row;
}

async function removeImage(path: string | null): Promise<void> {
  if (!path) return;
  const { error } = await supabaseAdmin.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
  if (error) {
    // The row change already succeeded; an orphaned object is logged rather than failing the request.
    logger.warn({ path, message: error.message }, 'Failed to delete old project image');
  }
}

interface ListOptions {
  /** When false, only published projects are visible (public API). */
  includeDrafts: boolean;
}

export async function listProjects(
  query: ProjectListQuery | AdminProjectListQuery,
  { includeDrafts }: ListOptions,
): Promise<Paginated<Project>> {
  const { page, pageSize } = query;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const run = (rangeFrom: number, rangeTo: number) => {
    let builder = supabaseAdmin.from('projects').select(PROJECT_COLUMNS, { count: 'exact' });

    if (!includeDrafts) {
      builder = builder.eq('status', 'published');
    } else if ('status' in query && query.status) {
      builder = builder.eq('status', query.status);
    }
    if (query.q) {
      builder = builder.textSearch('search', query.q, { type: 'websearch', config: 'english' });
    }
    if (query.category) builder = builder.eq('category', query.category);
    if (query.tech && query.tech.length > 0) builder = builder.contains('tech_stack', query.tech);
    if (query.featured !== undefined) builder = builder.eq('featured', query.featured);

    return builder
      .order(SORT_COLUMNS[query.sort], { ascending: query.order === 'asc' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(rangeFrom, rangeTo)
      .overrideTypes<ProjectRow[], { merge: false }>();
  };

  const { data, error, count } = await run(from, to);

  if (error?.code === PGRST_RANGE_NOT_SATISFIABLE) {
    // The page is past the end: report an empty page with the real (filtered) total.
    const first = await run(0, 0);
    if (first.error) throw dbError(first.error);
    const total = first.count ?? 0;
    return { data: [], page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
  }
  if (error) throw dbError(error);

  const total = count ?? 0;
  return {
    data: data.map(toProject),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
    .overrideTypes<ProjectRow | null, { merge: false }>();
  if (error) throw dbError(error);
  if (!data) throw HttpError.notFound('Project not found');
  return toProject(data);
}

export async function getProjectMeta(): Promise<ProjectMeta> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('category, tech_stack')
    .eq('status', 'published');
  if (error) throw dbError(error);

  const categories = new Set<string>();
  const tech = new Set<string>();
  for (const row of data) {
    categories.add(row.category);
    for (const tag of row.tech_stack) tech.add(tag);
  }
  const byName = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' });
  return { categories: [...categories].sort(byName), tech: [...tech].sort(byName) };
}

async function findRow(id: string): Promise<ProjectRow> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()
    .overrideTypes<ProjectRow | null, { merge: false }>();
  if (error) throw dbError(error);
  if (!data) throw HttpError.notFound('Project not found');
  return data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert(toInsertRow(input))
    .select(PROJECT_COLUMNS)
    .single()
    .overrideTypes<ProjectRow, { merge: false }>();
  if (error) throw dbError(error);
  return toProject(data);
}

export async function updateProject(id: string, update: ProjectUpdate): Promise<Project> {
  const existing = await findRow(id);
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(toUpdateRow(update))
    .eq('id', id)
    .select(PROJECT_COLUMNS)
    .single()
    .overrideTypes<ProjectRow, { merge: false }>();
  if (error) throw dbError(error);

  if (update.imagePath !== undefined && existing.image_path !== data.image_path) {
    await removeImage(existing.image_path);
  }
  return toProject(data);
}

export async function deleteProject(id: string): Promise<void> {
  const existing = await findRow(id);
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
  if (error) throw dbError(error);
  await removeImage(existing.image_path);
}

export async function reorderProjects(input: ReorderInput): Promise<void> {
  const { error } = await supabaseAdmin.rpc('reorder_projects', {
    items: input.items.map((item) => ({ id: item.id, sort_order: item.sortOrder })),
  });
  if (error) throw dbError(error);
}
