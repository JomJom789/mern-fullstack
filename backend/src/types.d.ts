import 'express';

declare global {
  namespace Express {
    interface Locals {
      /** Correlation id for logs and error responses. */
      requestId: string;
      /** Output of the `validate` middleware (Zod-parsed, unknown keys rejected). */
      validated: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
      /** Set by requireAdmin after every check passes. */
      admin?: { userId: string; email: string };
    }
  }
}
