import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        // destination: "https://easylife-api.vercel.app/api/v1/:path*",
        destination: "http://localhost:8081/api/:path*",
      },
    ];
  },
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
