import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["sprig-design-system"],
  devIndicators: false,
  agentRules: false,
};

export default nextConfig;
