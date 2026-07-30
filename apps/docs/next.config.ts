import type { NextConfig } from "next";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  transpilePackages: [
    "@nerio-ui/ui",
    "@nerio-ui/tokens",
    "@nerio-ui/adapters",
    "@nerio-ui/registry",
  ],
  async redirects() {
    return [
      {
        source: "/docs/foundations/animations",
        destination: "/docs/foundations/motion",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
