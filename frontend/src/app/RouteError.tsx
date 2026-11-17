import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import NotFoundPage from '../pages/NotFoundPage';

/** Router-level error boundary: 404s look like any other 404; crashes get a calm fallback. */
export function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6 text-center">
      <div>
        <p className="label-caps text-gold">Something went wrong</p>
        <h1 className="mt-6 font-display text-5xl text-ivory">An unexpected error occurred.</h1>
        <p className="mt-4 text-stone">
          Please refresh the page. If it keeps happening, try again later.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full border border-gold/40 px-6 py-3 text-sm text-gold"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
