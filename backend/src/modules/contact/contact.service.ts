import { createHmac } from 'node:crypto';
import type { ContactInput } from '@jomel/shared';
import { Resend } from 'resend';
import { env } from '../../config/env.js';
import { HttpError } from '../../lib/httpError.js';
import { logger } from '../../lib/logger.js';
import { sanitizePlainText } from '../../lib/sanitize.js';
import { supabaseAdmin } from '../../lib/supabase.js';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

/** Stores a one-way hash of the IP (useful for spotting abuse without keeping the raw address). */
function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  return createHmac('sha256', env.SUPABASE_SERVICE_ROLE_KEY).update(ip).digest('hex').slice(0, 32);
}

interface Meta {
  ip: string | undefined;
  userAgent: string | undefined;
}

export async function submitContactMessage(input: ContactInput, meta: Meta): Promise<void> {
  const message = {
    name: sanitizePlainText(input.name),
    email: input.email.toLowerCase(),
    message: sanitizePlainText(input.message),
  };

  const { error } = await supabaseAdmin.from('contact_messages').insert({
    ...message,
    ip_hash: hashIp(meta.ip),
    user_agent: meta.userAgent?.slice(0, 300) ?? null,
  });
  if (error) {
    logger.error({ code: error.code, message: error.message }, 'Failed to store contact message');
    throw HttpError.internal('Could not send your message. Please try again later.');
  }

  if (!resend) return;

  const { error: emailError } = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
    to: env.CONTACT_TO_EMAIL ?? env.ADMIN_EMAIL,
    replyTo: message.email,
    subject: `New portfolio enquiry from ${message.name}`,
    text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
  });
  if (emailError) {
    // The message is already stored, so the visitor still gets a success response.
    logger.warn({ name: emailError.name, message: emailError.message }, 'Contact email failed');
  }
}
