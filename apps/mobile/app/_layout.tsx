import React from 'react';
import { Stack } from 'expo-router';
import { TamaguiProvider } from '@circl/ui';

// Layout wraps screens with UI provider.
export default function Layout() {
  return (
    <TamaguiProvider>
      <Stack />
    </TamaguiProvider>
  );
}
