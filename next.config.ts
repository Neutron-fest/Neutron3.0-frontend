import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog reverse proxy: /ingest/* is forwarded to PostHog US so ad blockers don't drop events.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required so PostHog API paths with trailing slashes (e.g. /ingest/e/) aren't redirected.
  skipTrailingSlashRedirect: true,
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },

    ],

  },
};

export default nextConfig;
