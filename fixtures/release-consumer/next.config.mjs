/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@nerio-ui/adapters",
    "@nerio-ui/registry",
    "@nerio-ui/tokens",
    "@nerio-ui/ui",
  ],
};

export default nextConfig;
