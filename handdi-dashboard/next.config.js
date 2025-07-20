/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from local public folder
    domains: [],
  },
  // Enable React strict mode for better error handling
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
}

module.exports = nextConfig 