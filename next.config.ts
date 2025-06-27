import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
      },
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/:path*`
      }
    ]
  }
};

export default nextConfig;
