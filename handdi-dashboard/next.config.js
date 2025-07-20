/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from local public folder
    domains: [],
    unoptimized: true,
  },
  // Enable React strict mode for better error handling
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
}

module.exports = nextConfig 