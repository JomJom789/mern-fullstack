import type { Project, ProjectListResponse, ProjectMeta } from '@jomel/shared';
import { apiRequest, as } from '../../lib/api';
import { SORT_OPTIONS, type PublicProjectFilters } from './types';

export function fetchProjects(filters: PublicProjectFilters, signal?: AbortSignal) {
  const { sort, order } = SORT_OPTIONS[filters.sort];
  return apiRequest('/api/projects', {
    query: {
      q: filters.q?.trim() || undefined,
      category: filters.category,
      tech: filters.tech,
      featured: filters.featured,
      sort,
      order,
      page: filters.page,
      pageSize: filters.pageSize,
    },
    parse: as<ProjectListResponse>(),
    signal,
  });
}

export function fetchProject(slug: string, signal?: AbortSignal) {
  return apiRequest(`/api/projects/${encodeURIComponent(slug)}`, { parse: as<Project>(), signal });
}

export function fetchProjectMeta(signal?: AbortSignal) {
  return apiRequest('/api/projects/meta', { parse: as<ProjectMeta>(), signal });
}
