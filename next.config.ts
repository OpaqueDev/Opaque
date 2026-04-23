import type { NextConfig } from "next";

// eslint.ignoreDuringBuilds removed from NextConfig in Next 16 — suppress via type cast
const nextConfig = {
  /* config options here */
} satisfies NextConfig;

export default nextConfig;
