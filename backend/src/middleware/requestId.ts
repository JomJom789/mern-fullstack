import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const SAFE_REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/;

/** Assigns a request id (reusing a well-formed upstream X-Request-Id) and echoes it back. */
export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.get('x-request-id');
  const id = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
  res.locals.requestId = id;
  res.locals.validated = {};
  res.setHeader('X-Request-Id', id);
  next();
};
