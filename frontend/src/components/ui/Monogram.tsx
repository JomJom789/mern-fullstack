import { useId } from 'react';
import { cn } from '../../lib/utils';

export function Monogram({ className }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="30.5"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.4"
      />
      <path
        d="M38 16v22c0 6.5-4.2 10-10 10-4.4 0-7.7-2.3-9-5.8"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
