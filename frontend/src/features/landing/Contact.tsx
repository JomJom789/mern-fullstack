import { zodResolver } from '@hookform/resolvers/zod';
import { contactInputSchema, type ContactFormValues, type ContactInput } from '@jomel/shared';
import { ArrowUpRight, Check, Loader2, Mail, Phone } from 'lucide-react';
import { GithubIcon } from '../../components/ui/GithubIcon';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Reveal } from '../../components/motion/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { errorMessage } from '../../lib/api';
import { cn } from '../../lib/utils';
import { useSendContact } from '../contact/api';
import { CONTACT } from './contactInfo';

const CHANNELS = [
  { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Phone, label: 'Phone', value: CONTACT.phone, href: CONTACT.phoneHref },
  {
    icon: GithubIcon,
    label: 'GitHub',
    value: CONTACT.githubLabel,
    href: CONTACT.github,
    external: true,
  },
] as const;

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-caps">
        {label}
      </label>
      {children}
      <p
        id={`${htmlFor}-error`}
        className={cn('mt-2 min-h-5 text-xs text-danger', !error && 'invisible')}
        role={error ? 'alert' : undefined}
      >
        {error ?? ' '}
      </p>
    </div>
  );
}

export default function Contact() {
  const send = useSendContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues, unknown, ContactInput>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
  });

  const onSubmit = handleSubmit((values) => {
    send.mutate(values, { onSuccess: () => reset() });
  });

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-x-clip py-28 sm:py-36"
      aria-label="Contact"
    >
      <div
        className="pointer-events-none absolute right-0 bottom-0 -z-10 size-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.09),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="section grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            index="07"
            label="Contact"
            title="Let's build something together"
            intro="Feel free to get in touch with questions, ideas or a project brief. I reply personally."
          />
          <ul className="mt-12 space-y-3">
            {CHANNELS.map((channel, i) => {
              const Icon = channel.icon;
              return (
                <li key={channel.label}>
                  <Reveal delay={0.08 * i} blur={false} y={16}>
                    <a
                      href={channel.href}
                      {...('external' in channel
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="group -ml-3 flex items-center gap-5 rounded-2xl border border-transparent p-3 transition-colors duration-500 hover:border-gold/15 hover:bg-ivory/[0.02]"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full border border-gold/30 text-gold transition-transform duration-500 group-hover:scale-110">
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="label-caps block">{channel.label}</span>
                        <span className="mt-1 block text-base break-all text-ivory sm:text-lg">
                          {channel.value}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="ml-auto size-4 text-stone opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-24" delay={0.1}>
          <form
            onSubmit={(event) => void onSubmit(event)}
            noValidate
            className="glass relative rounded-3xl p-7 sm:p-10"
            aria-label="Contact form"
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <Field label="Name" htmlFor="contact-name" error={errors.name?.message}>
                <input
                  id="contact-name"
                  autoComplete="name"
                  maxLength={80}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby="contact-name-error"
                  className="input-luxe"
                  placeholder="Your name"
                  {...register('name')}
                />
              </Field>
              <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="contact-email-error"
                  className="input-luxe"
                  placeholder="you@company.com"
                  {...register('email')}
                />
              </Field>
            </div>
            <div className="mt-2">
              <Field label="Message" htmlFor="contact-message" error={errors.message?.message}>
                <textarea
                  id="contact-message"
                  rows={5}
                  maxLength={4000}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby="contact-message-error"
                  className="input-luxe resize-none"
                  placeholder="Tell me about your product, timeline and goals…"
                  {...register('message')}
                />
              </Field>
            </div>

            {/* Honeypot: invisible to people and assistive tech, attractive to bots. */}
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('website')}
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={send.isPending}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[image:var(--gold-gradient)] px-8 py-4 text-sm font-semibold tracking-[0.08em] text-ink transition-opacity disabled:opacity-60"
              >
                {send.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {send.isPending ? 'Sending…' : 'Send message'}
                {!send.isPending ? (
                  <ArrowUpRight
                    className="size-4 transition-transform duration-500 group-hover:rotate-45"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
              <div aria-live="polite" className="text-sm">
                <AnimatePresence mode="wait">
                  {send.isSuccess ? (
                    <motion.p
                      key="ok"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-success"
                    >
                      <Check className="size-4" aria-hidden="true" /> Thank you — I&apos;ll be in
                      touch soon.
                    </motion.p>
                  ) : send.isError ? (
                    <motion.p
                      key="err"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-danger"
                      role="alert"
                    >
                      {errorMessage(send.error)}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
