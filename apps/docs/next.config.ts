import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["withy-ui"],
  devIndicators: false,
  agentRules: false,
};

export default nextConfig;
