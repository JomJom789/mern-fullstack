import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { Providers } from './app/providers';
import { router } from './app/router';
import './styles/index.css';

// index.html ships static SEO tags for crawlers that don't run JavaScript. Once the app is
// running, each page renders its own tags (React 19 hoists them), so drop the static copies.
document.head.querySelectorAll('[data-seo]').forEach((node) => node.remove());

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
