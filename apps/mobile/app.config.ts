import { ExpoConfig, ConfigContext } from 'expo/config';

// Basic Expo config; extend as needed.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Circl Mobile',
  slug: 'circl-mobile',
  scheme: 'circl',
});
