/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  transpilePackages: ['@circl/ui'],
};

export default nextConfig;
