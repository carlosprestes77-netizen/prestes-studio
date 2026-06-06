/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/prestes-studio',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/prestes-studio',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
