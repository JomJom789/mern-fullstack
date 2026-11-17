import type { RequestHandler, Response } from 'express';
import type { z } from 'zod';
import { HttpError } from '../lib/httpError.js';

interface Schemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

type Part = keyof Schemas;

function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

/**
 * Validates body, query and params with Zod. Use strict object schemas so unknown keys are
 * rejected. Parsed values are stored on `res.locals.validated` (Express 5 `req.query` is
 * read-only), and handlers read them with {@link getValidated}.
 */
export function validate(schemas: Schemas): RequestHandler {
  return (req, res, next) => {
    const sources: Record<Part, unknown> = {
      body: req.body ?? {},
      query: req.query,
      params: req.params,
    };

    for (const part of ['params', 'query', 'body'] as const) {
      const schema = schemas[part];
      if (!schema) continue;
      const result = schema.safeParse(sources[part]);
      if (!result.success) {
        next(HttpError.badRequest(`Invalid request ${part}`, formatIssues(result.error)));
        return;
      }
      res.locals.validated[part] = result.data;
    }
    next();
  };
}

/** Typed accessor for values produced by {@link validate}. */
export function getValidated<T>(res: Response, part: Part): T {
  return res.locals.validated[part] as T;
}
