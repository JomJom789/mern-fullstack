import {
  projectListResponseSchema,
  projectSchema,
  signUploadResponseSchema,
  type AdminProjectListQuery,
  type ProjectInput,
  type ProjectListResponse,
  type ProjectUpdate,
  type ReorderInput,
  type SignUploadInput,
} from '@jomel/shared';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { z } from 'zod';
import { apiRequest } from '../../lib/api';
import { projectKeys } from '../projects/hooks';
import { getAccessToken } from '../auth/supabase';

const auth = { getAccessToken };

export const adminKeys = {
  all: ['projects', 'admin'] as const,
  list: (query: AdminProjectListQuery) => ['projects', 'admin', 'list', query] as const,
  everything: () => ['projects', 'admin', 'everything'] as const,
  session: () => ['admin', 'session'] as const,
};

const sessionSchema = z.object({ ok: z.literal(true), email: z.string().optional() });

/** Confirms the backend accepts this session (email, admins table, aal2). 404 otherwise. */
export function useAdminSession(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.session(),
    queryFn: ({ signal }) =>
      apiRequest('/api/admin/session', { ...auth, parse: (d) => sessionSchema.parse(d), signal }),
    enabled,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

function listQuery(query: AdminProjectListQuery) {
  return {
    q: query.q,
    category: query.category,
    tech: query.tech,
    featured: query.featured,
    status: query.status,
    sort: query.sort,
    order: query.order,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export function useAdminProjects(query: AdminProjectListQuery) {
  return useQuery({
    queryKey: adminKeys.list(query),
    queryFn: ({ signal }) =>
      apiRequest('/api/admin/projects', {
        ...auth,
        query: listQuery(query),
        parse: (d) => projectListResponseSchema.parse(d),
        signal,
      }),
    placeholderData: keepPreviousData,
  });
}

/** Every project (all pages) in curated order — used by the reorder panel. */
export function useAllAdminProjects(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.everything(),
    enabled,
    queryFn: async ({ signal }) => {
      const all: ProjectListResponse['data'] = [];
      for (let page = 1; page <= 20; page += 1) {
        const res = await apiRequest('/api/admin/projects', {
          ...auth,
          query: { sort: 'sort_order', order: 'asc', page, pageSize: 50 },
          parse: (d) => projectListResponseSchema.parse(d),
          signal,
        });
        all.push(...res.data);
        if (page >= res.totalPages) break;
      }
      return all;
    },
  });
}

/** After any mutation, refresh admin and public project queries alike. */
function useInvalidateProjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: projectKeys.all });
}

export function useCreateProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (input: ProjectInput) =>
      apiRequest('/api/admin/projects', {
        ...auth,
        method: 'POST',
        body: input,
        parse: (d) => projectSchema.parse(d),
      }),
    onSettled: invalidate,
  });
}

export function useUpdateProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProjectUpdate }) =>
      apiRequest(`/api/admin/projects/${encodeURIComponent(id)}`, {
        ...auth,
        method: 'PATCH',
        body: input,
        parse: (d) => projectSchema.parse(d),
      }),
    onSettled: invalidate,
  });
}

/** Optimistic delete: the row disappears immediately and comes back if the request fails. */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/projects/${encodeURIComponent(id)}`, { ...auth, method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.all });
      const snapshots: [QueryKey, unknown][] = queryClient.getQueriesData({
        queryKey: adminKeys.all,
      });
      queryClient.setQueriesData<ProjectListResponse>(
        { queryKey: [...adminKeys.all, 'list'] },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((p) => p.id !== id),
                total: Math.max(0, old.total - 1),
              }
            : old,
      );
      queryClient.setQueryData<ProjectListResponse['data']>(adminKeys.everything(), (old) =>
        old?.filter((p) => p.id !== id),
      );
      return { snapshots };
    },
    onError: (_error, _id, context) => {
      for (const [key, data] of context?.snapshots ?? []) queryClient.setQueryData(key, data);
    },
    onSettled: invalidate,
  });
}

export function useReorderProjects() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (input: ReorderInput) =>
      apiRequest('/api/admin/projects/reorder', { ...auth, method: 'PATCH', body: input }),
    onSettled: invalidate,
  });
}

export function signImageUpload(input: SignUploadInput) {
  return apiRequest('/api/admin/uploads/sign', {
    ...auth,
    method: 'POST',
    body: input,
    parse: (d) => signUploadResponseSchema.parse(d),
  });
}
