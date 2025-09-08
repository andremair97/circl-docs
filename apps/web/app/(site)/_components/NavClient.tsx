'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  connectors: string[];
}

// Client component renders the navigation bar and highlights the active route.
export default function NavClient({ connectors }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const format = (name: string) =>
    name
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex items-center gap-4 p-4">
        <Link href="/" className="font-semibold">
          Circl
        </Link>
        <details className="relative">
          <summary
            className={`cursor-pointer list-none ${
              isActive('/connectors') ? 'font-semibold' : ''
            }`}
          >
            Connectors
          </summary>
          <ul className="absolute left-0 mt-2 w-48 border bg-white shadow-md">
            {connectors.map((name) => {
              const href = `/connectors/${name}`;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      isActive(href) ? 'font-semibold' : ''
                    }`}
                  >
                    {format(name)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
        {process.env.NEXT_PUBLIC_SHOW_DEBUG === '1' && (
          <Link
            href="/debug/connectors"
            className={isActive('/debug/connectors') ? 'font-semibold' : ''}
          >
            Diagnostics
          </Link>
        )}
      </div>
    </nav>
  );
}
