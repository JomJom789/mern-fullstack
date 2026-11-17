import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { RootLayout } from '../components/layout/RootLayout';
import { env } from '../lib/env';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProjectPage from '../pages/ProjectPage';
import { RouteError } from './RouteError';

// The admin bundle is code-split: it is only downloaded when the hidden path is visited.
const AdminApp = lazy(() => import('../features/admin/AdminApp'));

function AdminFallback() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center" aria-busy="true">
      <span className="size-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'work/:slug', element: <ProjectPage /> },
      {
        path: `${env.adminPath.slice(1)}/*`,
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminApp />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
