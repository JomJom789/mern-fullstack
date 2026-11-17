import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12 */
export function pageWindow(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) result.push('gap');
    result.push(p);
  });
  return result;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  const button =
    'flex size-11 items-center justify-center rounded-full border text-sm transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30';
  return (
    <nav
      className={cn('mt-14 flex items-center justify-center gap-2', className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        className={cn(button, 'border-smoke text-ivory hover:border-gold/60')}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ArrowLeft className="size-4" />
      </button>
      {pageWindow(page, totalPages).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-stone" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              button,
              item === page
                ? 'border-gold bg-gold font-semibold text-ink'
                : 'border-smoke text-stone hover:border-gold/60 hover:text-ivory',
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(button, 'border-smoke text-ivory hover:border-gold/60')}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ArrowRight className="size-4" />
      </button>
    </nav>
  );
}
