// PWA temporarily disabled for initial deployment
// import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  images: { remotePatterns: [] },
};

export default nextConfig;