import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-md bg-graphite', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-ivory/[0.05] to-transparent" />
    </div>
  );
}
