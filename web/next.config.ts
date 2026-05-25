
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  // ...other configurations
  images: {
    domains: ['i.postimg.cc', 'media-hosting.imagekit.io'],
    unoptimized: true
  },
  reactStrictMode: true,
  experimental: {
    // serverActions is enabled by default // Ensure APIs work properly in App Router
  },
};

module.exports = nextConfig;

export default nextConfig;
