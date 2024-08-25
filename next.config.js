/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['oslo'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd203wdkr6gpe3h.cloudfront.net',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
