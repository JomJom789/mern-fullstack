import type { ErrorRequestHandler, RequestHandler } from 'express';
import { isProduction } from '../config/env.js';
import { HttpError } from '../lib/httpError.js';
import { logger } from '../lib/logger.js';

interface BodyParserError extends Error {
  type?: string;
  status?: number;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return error instanceof Error && typeof (error as BodyParserError).type === 'string';
}

/** Same body as every other 404, so hidden routes are indistinguishable from missing ones. */
export const notFound: RequestHandler = (_req, _res, next) => {
  next(HttpError.notFound());
};

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, _next) => {
  const requestId = res.locals.requestId;
  let httpError: HttpError;

  if (error instanceof HttpError) {
    httpError = error;
  } else if (isBodyParserError(error)) {
    httpError =
      error.type === 'entity.too.large'
        ? new HttpError(413, 'Request body is too large', 'payload_too_large')
        : new HttpError(400, 'Malformed request body', 'bad_request');
  } else {
    httpError = HttpError.internal();
  }

  if (httpError.status >= 500) {
    logger.error({ err: error, requestId, method: req.method, path: req.path }, 'Unhandled error');
  } else {
    logger.debug({ requestId, status: httpError.status, code: httpError.code }, httpError.message);
  }

  if (res.headersSent) {
    res.end();
    return;
  }

  const exposeMessage = httpError.expose || !isProduction;
  res.status(httpError.status).json({
    error: {
      message: exposeMessage ? httpError.message : 'Internal server error',
      code: httpError.code,
      requestId,
      ...(httpError.details !== undefined && httpError.expose
        ? { details: httpError.details }
        : {}),
      ...(!isProduction && httpError.status >= 500 && error instanceof Error
        ? { stack: error.stack }
        : {}),
    },
  });
};
