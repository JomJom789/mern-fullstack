export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  /** Safe to show to the client. 5xx messages are replaced with a generic one in production. */
  readonly expose: boolean;

  constructor(status: number, message: string, code = 'error', details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.expose = status < 500;
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new HttpError(400, message, 'bad_request', details);
  }

  static notFound(message = 'Not found') {
    return new HttpError(404, message, 'not_found');
  }

  static conflict(message = 'Conflict') {
    return new HttpError(409, message, 'conflict');
  }

  static internal(message = 'Internal server error') {
    return new HttpError(500, message, 'internal_error');
  }
}
