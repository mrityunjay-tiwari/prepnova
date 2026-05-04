import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  allowedDevOrigins: ['10.176.139.220', 'capture-recycled-episode.ngrok-free.dev'],
};

export default nextConfig;
