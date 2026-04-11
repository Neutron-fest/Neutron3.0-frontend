import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ['ik.imagekit.io'],
  },
};

export default nextConfig;
