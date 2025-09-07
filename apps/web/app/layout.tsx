import './globals.css';
import React from 'react';

// Root layout renders global styles and could host providers later.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Applying minimal Tailwind classes keeps the layout readable across pages. */}
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}
