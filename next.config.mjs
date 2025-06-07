/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure image domains if needed
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  // Enable proper error checking but allow warnings
  eslint: {
    ignoreDuringBuilds: false,
    // Allow builds to continue with warnings
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
