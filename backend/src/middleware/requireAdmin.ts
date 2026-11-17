import type { RequestHandler } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { HttpError } from '../lib/httpError.js';
import { logger } from '../lib/logger.js';
import { supabaseAdmin } from '../lib/supabase.js';

const BEARER = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/;

const claimsSchema = z.object({ aal: z.string() }).loose();

/**
 * Reads the `aal` claim. Only called AFTER supabase.auth.getUser() has verified the token
 * against the Auth server, so the payload is trusted at this point.
 */
function readAal(jwt: string): string | null {
  const payload = jwt.split('.')[1];
  if (!payload) return null;
  try {
    const json: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const parsed = claimsSchema.safeParse(json);
    return parsed.success ? parsed.data.aal : null;
  } catch {
    return null;
  }
}

/**
 * Single-owner guard. Every failure returns the same generic 404, so the admin API
 * looks exactly like a route that does not exist.
 */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const deny = (reason: string) => {
    logger.warn({ requestId: res.locals.requestId, reason, path: req.path }, 'Admin access denied');
    next(HttpError.notFound());
  };

  const match = BEARER.exec(req.get('authorization') ?? '');
  const jwt = match?.[1];
  if (!jwt) return deny('missing_bearer');

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(jwt);
    const user = data.user;
    if (error || !user) return deny('invalid_token');

    if (!user.email || user.email.toLowerCase() !== env.ADMIN_EMAIL) return deny('email_mismatch');
    if (!user.email_confirmed_at) return deny('email_unconfirmed');
    if (readAal(jwt) !== 'aal2') return deny('mfa_required');

    const { data: adminRow, error: adminError } = await supabaseAdmin
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (adminError) throw adminError;
    if (!adminRow) return deny('not_in_admins');

    res.locals.admin = { userId: user.id, email: user.email };
    next();
  } catch (error) {
    next(error);
  }
};
