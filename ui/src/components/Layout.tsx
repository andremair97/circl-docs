import { Outlet } from 'react-router-dom';

// Layout provides top-level structure with skip link and footer links.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-gray-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-surface focus:px-3 focus:py-1 focus:text-primary"
      >
        Skip to content
      </a>
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-soft-border py-4 text-center text-sm text-gray-600">
        <a
          href="/docs"
          className="mx-2 text-primary hover:underline"
        >
          Docs
        </a>
        <a
          href="https://github.com/andremair97/circl"
          className="mx-2 text-primary hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
