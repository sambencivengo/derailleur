/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['oslo', '@prisma/client', 'prisma'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd203wdkr6gpe3h.cloudfront.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'd2z0y093pyq347.cloudfront.net',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
