import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Seo } from '../components/seo/Seo';
import { Monogram } from '../components/ui/Monogram';

/** The one and only 404 — also rendered for hidden or unauthorised routes. */
export default function NotFoundPage() {
  return (
    <main id="main" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Seo
        title="Page not found | Jomel"
        description="This page does not exist."
        path="/404"
        noindex
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,97,0.12),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="section text-center">
        <Monogram className="mx-auto size-14" />
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="gold-text mt-10 font-display text-[clamp(6rem,22vw,16rem)] leading-none font-light italic"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mx-auto mt-4 max-w-md font-display text-2xl text-ivory sm:text-3xl"
        >
          This page has wandered off the canvas.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link
            to="/"
            className="group mt-12 inline-flex items-center gap-3 rounded-full border border-gold/40 px-7 py-4 text-xs font-semibold tracking-[0.24em] text-gold uppercase transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-500 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Return home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
