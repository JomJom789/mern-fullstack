import { env } from '../../lib/env';

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/" (canonical + og:url). */
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_IMAGE = '/og-image.png';

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head> automatically.
 * JSON-LD is serialised with "<" escaped so API text can never break out of the script tag.
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex,
  jsonLd,
}: SeoProps) {
  const url = `${env.siteUrl}${path}`;
  const imageUrl = image ?? `${env.siteUrl}${DEFAULT_IMAGE}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>
      ) : null}
    </>
  );
}
