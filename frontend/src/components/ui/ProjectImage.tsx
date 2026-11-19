import { useState } from 'react';
import { cn } from '../../lib/utils';

interface ProjectImageProps {
  src: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Eager-load images above the fold (e.g. the detail page hero). */
  priority?: boolean;
  /** Seed for the gradient placeholder when there is no image. */
  seed?: string;
}

function hue(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash) % 360;
}

/**
 * Lazy image that fades in over a soft gradient placeholder (blur-up). Projects without an
 * image keep a tasteful generated gold/charcoal gradient with their initial.
 */
export function ProjectImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  seed = alt,
}: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const h = hue(seed);
  const placeholder = {
    backgroundImage: `radial-gradient(120% 80% at 20% 10%, hsl(${(h + 40) % 360} 60% 88% / 0.9), transparent 60%), radial-gradient(90% 70% at 85% 90%, rgba(37,99,235,0.35), transparent 60%), linear-gradient(135deg, #EEF3FB, #F7F9FD)`,
  };

  return (
    <div className={cn('relative overflow-hidden bg-charcoal', className)} style={placeholder}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'size-full object-cover transition-opacity duration-700 ease-out',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      ) : (
        <div className="flex size-full items-center justify-center" role="img" aria-label={alt}>
          <span className="font-display text-6xl text-gold/40 italic">{alt.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}
