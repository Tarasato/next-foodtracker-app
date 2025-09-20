import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "dtdiacpxnijwznqxxevs.supabase.co",
      }
      // {
      //   protocol: "https",
      //   hostname: "*",
      // },
    ],
  },
};

export default nextConfig;
