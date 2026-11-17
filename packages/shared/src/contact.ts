import { z } from 'zod';

export const contactInputSchema = z.strictObject({
  name: z.string().trim().min(2, 'Please enter your name').max(80, 'Max 80 characters'),
  email: z.string().trim().max(254).pipe(z.email('Please enter a valid email')),
  message: z
    .string()
    .trim()
    .min(10, 'Tell me a little more (10+ characters)')
    .max(4000, 'Max 4000 characters'),
  /** Honeypot. Hidden from people; bots tend to fill it. Must stay empty. */
  website: z.string().max(200).optional().default(''),
});
export type ContactInput = z.infer<typeof contactInputSchema>;
export type ContactFormValues = z.input<typeof contactInputSchema>;

export const contactResponseSchema = z.object({ ok: z.literal(true) });
export type ContactResponse = z.infer<typeof contactResponseSchema>;
