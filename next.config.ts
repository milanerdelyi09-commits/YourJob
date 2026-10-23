import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.127",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;