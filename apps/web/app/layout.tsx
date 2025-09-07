import React from 'react';
import { TamaguiProvider } from '@circl/ui';

// Root layout wraps pages with shared providers.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TamaguiProvider>{children}</TamaguiProvider>
      </body>
    </html>
  );
}
