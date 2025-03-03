import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img3.huamaocdn.com",
        port: "",
        pathname: "/**/*",
        search: "",
      },
    ],
  },
};

export default nextConfig;
