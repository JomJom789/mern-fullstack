import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchProject, fetchProjectMeta, fetchProjects } from './api';
import type { PublicProjectFilters } from './types';

/** Every project query starts with this key, so one invalidation refreshes public + admin views. */
export const projectKeys = {
  all: ['projects'] as const,
  publicList: (filters: PublicProjectFilters) => ['projects', 'public', 'list', filters] as const,
  detail: (slug: string) => ['projects', 'public', 'detail', slug] as const,
  meta: () => ['projects', 'public', 'meta'] as const,
};

export function useProjects(filters: PublicProjectFilters) {
  return useQuery({
    queryKey: projectKeys.publicList(filters),
    queryFn: ({ signal }) => fetchProjects(filters, signal),
    placeholderData: keepPreviousData,
  });
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(slug ?? ''),
    queryFn: ({ signal }) => fetchProject(slug ?? '', signal),
    enabled: Boolean(slug),
  });
}

export function useProjectMeta() {
  return useQuery({
    queryKey: projectKeys.meta(),
    queryFn: ({ signal }) => fetchProjectMeta(signal),
    staleTime: 5 * 60_000,
  });
}
