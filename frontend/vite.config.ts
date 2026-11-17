import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';

function origin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Production-only Content Security Policy, injected as a <meta> tag. It allows this site,
 * the API, Supabase and Cloudflare Turnstile — nothing else. Headers that cannot be set from a
 * meta tag (frame-ancestors, HSTS) are configured on the host (nginx.conf / render.yaml).
 */
function cspPlugin(env: Record<string, string>): Plugin {
  const api = origin(env.VITE_API_URL);
  const supabase = origin(env.VITE_SUPABASE_URL);
  const supabaseWs = supabase?.replace(/^http/, 'ws') ?? null;
  const list = (...values: (string | null)[]) => values.filter(Boolean).join(' ');

  const policy = [
    `default-src 'self'`,
    `script-src ${list("'self'", TURNSTILE_ORIGIN)}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src ${list("'self'", 'data:', 'blob:', supabase)}`,
    `font-src 'self'`,
    `connect-src ${list("'self'", api, supabase, supabaseWs, TURNSTILE_ORIGIN)}`,
    `frame-src ${TURNSTILE_ORIGIN}`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');

  return {
    name: 'portfolio-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
          injectTo: 'head-prepend',
        },
      ],
    },
  };
}

/** Replaces %SITE_URL% in index.html (canonical, Open Graph and JSON-LD URLs). */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'portfolio-site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
  };
}

/**
 * Emits robots.txt and sitemap.xml at build time. Project pages are fetched from the API; if it
 * is unreachable during the build the sitemap still lists the home page. The hidden admin path
 * is never written to either file.
 */
function seoFilesPlugin(siteUrl: string, apiUrl: string | undefined): Plugin {
  async function fetchSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
    if (!apiUrl) return [];
    const slugs: { slug: string; updatedAt: string }[] = [];
    for (let page = 1; page <= 20; page += 1) {
      const response = await fetch(`${apiUrl}/api/projects?pageSize=50&page=${page}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as {
        data: { slug: string; updatedAt: string }[];
        totalPages: number;
      };
      slugs.push(...body.data.map(({ slug, updatedAt }) => ({ slug, updatedAt })));
      if (page >= body.totalPages) break;
    }
    return slugs;
  }

  return {
    name: 'portfolio-seo-files',
    apply: 'build',
    async generateBundle() {
      let projects: { slug: string; updatedAt: string }[] = [];
      try {
        projects = await fetchSlugs();
      } catch (error) {
        this.warn(
          `sitemap: could not load projects from ${apiUrl ?? '(VITE_API_URL unset)'} — ` +
            `only the home page is listed (${error instanceof Error ? error.message : String(error)})`,
        );
      }

      const today = new Date().toISOString().slice(0, 10);
      const urls = [
        `  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`,
        ...projects.map(
          ({ slug, updatedAt }) =>
            `  <url><loc>${siteUrl}/work/${encodeURIComponent(slug)}</loc><lastmod>${updatedAt.slice(0, 10)}</lastmod><priority>0.8</priority></url>`,
        ),
      ];

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_');
  const siteUrl = (env.VITE_SITE_URL ?? 'http://localhost:5173').replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      siteUrlPlugin(siteUrl),
      cspPlugin(env),
      seoFilesPlugin(siteUrl, env.VITE_API_URL?.replace(/\/+$/, '')),
    ],
    server: { port: 5173, strictPort: true },
    preview: { port: 4173 },
    build: {
      target: 'es2022',
      sourcemap: false,
      cssCodeSplit: true,
      // Fonts are always emitted as files: the CSP allows `font-src 'self'` only (no data: URIs).
      assetsInlineLimit: (filePath: string) =>
        /\.(woff2?|ttf|otf)$/.test(filePath) ? false : undefined,
      chunkSizeWarningLimit: 600,
    },
  };
});
