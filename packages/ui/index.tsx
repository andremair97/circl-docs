import * as React from 'react';
import { View as RNView, Text as RNText, Pressable } from 'react-native';

// Cross-platform UI primitives backed by react-native.
// For web builds, react-native-web supplies compatible implementations via alias.
export const View = RNView;
export const Text = RNText;
export const Button = ({ children, ...props }: React.ComponentProps<typeof Pressable>) => (
  <Pressable {...props}>{typeof children === 'string' ? <RNText>{children}</RNText> : children}</Pressable>
);

// No-op provider placeholder until theming is introduced.
export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
