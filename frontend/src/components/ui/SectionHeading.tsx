import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Reveal } from '../motion/Reveal';
import { SplitText } from '../motion/SplitText';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  intro?: ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  index,
  label,
  title,
  intro,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <header className={cn('max-w-4xl', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal blur={false} y={16}>
        <p
          className={cn(
            'label-caps flex items-center gap-4',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="text-gold">{index}</span>
          <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
          {label}
        </p>
      </Reveal>
      <SplitText
        as="h2"
        inView
        text={title}
        className="mt-6 font-display text-5xl leading-[0.95] font-light text-ivory sm:text-6xl lg:text-7xl 3xl:text-8xl"
        wordClassName={(_, i) => (i % 3 === 1 ? 'italic gold-text' : undefined)}
      />
      {intro ? (
        <Reveal delay={0.15}>
          <div className="mt-8 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
            {intro}
          </div>
        </Reveal>
      ) : null}
    </header>
  );
}
