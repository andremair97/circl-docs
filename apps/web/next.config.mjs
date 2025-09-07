/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@circl/ui', 'react-native', 'react-native-web'],
  webpack: (config) => {
    // Ensure React Native imports resolve to web-compatible implementations
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    return config;
  },
};

export default nextConfig;
