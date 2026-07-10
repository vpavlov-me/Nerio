import type { NextConfig } from "next";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  transpilePackages: ["@nerio/ui", "@nerio/tokens", "@nerio/adapters", "@nerio/registry"],
  async redirects() {
    return [
      {
        source: "/docs/compositions/:slug*",
        destination: "/docs/blocks/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
