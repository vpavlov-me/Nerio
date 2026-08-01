import type { NextConfig } from "next";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "../..");
const isDevelopment = process.env.NODE_ENV === "development";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://mc.yandex.ru https://yastatic.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://mc.yandex.ru https://mc.webvisor.org",
  "font-src 'self' data:",
  `connect-src 'self'${isDevelopment ? " ws:" : ""} https://mc.yandex.ru https://mc.yandex.com https://mc.yandex.com.ge https://mc.webvisor.org wss://mc.yandex.ru wss://mc.webvisor.org`,
  "child-src 'self' blob: https://mc.yandex.ru https://mc.webvisor.org",
  "frame-src 'self' blob: https://mc.yandex.ru https://mc.webvisor.org",
  "frame-ancestors 'self' https://*.yandex.ru https://*.yandex.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
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
