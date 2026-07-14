/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@nerio/adapters", "@nerio/registry", "@nerio/tokens", "@nerio/ui"],
};

export default nextConfig;
