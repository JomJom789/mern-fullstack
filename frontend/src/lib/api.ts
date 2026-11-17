import { env } from './env';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | undefined;
  readonly details: unknown;

  constructor(
    status: number,
    message: string,
    code: string,
    requestId?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | string[] | undefined | null;

export interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  query?: Record<string, QueryValue>;
  body?: unknown;
  /**
   * Turns the JSON body into a typed value. The admin area passes the shared Zod schema's
   * `.parse` (full runtime validation); public pages pass a typed cast to keep Zod out of the
   * main bundle — the types still come from the same shared schemas.
   */
  parse?: (data: unknown) => T;
  /** Supplies a bearer token (admin calls only). */
  getAccessToken?: () => Promise<string | null>;
  signal?: AbortSignal | undefined;
}

export function toSearchParams(query: Record<string, QueryValue>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  }
  return params;
}

interface ErrorBody {
  error: { message: string; code: string; requestId?: string; details?: unknown };
}

function isErrorBody(value: unknown): value is ErrorBody {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false;
  const error = value.error;
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as { message?: unknown }).message === 'string' &&
    typeof (error as { code?: unknown }).code === 'string'
  );
}

export async function apiRequest<T = void>(
  path: string,
  options: RequestOptions<T> = {},
): Promise<T> {
  const { method = 'GET', query, body, parse, getAccessToken, signal } = options;
  const search = query ? toSearchParams(query).toString() : '';
  const url = `${env.apiUrl}${path}${search ? `?${search}` : ''}`;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (getAccessToken) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? null : JSON.stringify(body),
      signal: signal ?? null,
      credentials: 'omit',
      mode: 'cors',
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'Network error — please check your connection.', 'network_error');
  }

  if (!response.ok) {
    const json: unknown = await response.json().catch(() => null);
    if (isErrorBody(json)) {
      const { message, code, requestId, details } = json.error;
      throw new ApiError(response.status, message, code, requestId, details);
    }
    throw new ApiError(response.status, response.statusText || 'Request failed', 'http_error');
  }

  if (response.status === 204 || !parse) return undefined as T;
  const data: unknown = await response.json();
  return parse(data);
}

/** Typed pass-through for trusted public responses (see RequestOptions.parse). */
export const as =
  <T>() =>
  (data: unknown): T =>
    data as T;

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return 'Too many requests — please wait a moment and try again.';
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}
