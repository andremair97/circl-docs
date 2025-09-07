// React namespace import keeps typings compatible with both web and native builds
import * as React from 'react';
import { TamaguiProvider as Provider, Button, View, Text } from 'tamagui';
import { config } from './tamagui.config';

// Provider exporting shared Tamagui components.
export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider config={config}>{children}</Provider>
);

export { Button, View, Text };
