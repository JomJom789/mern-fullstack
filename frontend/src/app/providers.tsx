import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { IntroProvider } from '../components/layout/Intro';
import { SmoothScroll } from '../components/layout/SmoothScroll';
import { queryClient } from './queryClient';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
        <SmoothScroll>
          <IntroProvider>{children}</IntroProvider>
        </SmoothScroll>
      </MotionConfig>
    </QueryClientProvider>
  );
}
