/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['oslo'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'derailleurimages.s3.us-east-2.amazonaws.com',
        pathname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
