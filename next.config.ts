import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 82],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  poweredByHeader: false,
  // A stray package-lock.json in the user home folder confuses root detection.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
