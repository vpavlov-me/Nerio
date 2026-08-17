export const showreelConfig = {
  productName: "Nerio",
  positioning: "Source-first design system for modern digital products",
  releaseLabel: "1.0.0-beta.1",
  technologyLabel: "React · TypeScript · Open source",
  canonicalUrl: "nerio.vpavlov.com",
  repositoryUrl: "github.com/vpavlov-me/Nerio",
  installCommand: "pnpm add @nerio-ui/ui @nerio-ui/tokens @nerio-ui/adapters",
  cliCommands: [
    "pnpm add -D @nerio-ui/registry@1.0.0-beta.1 @nerio-ui/cli@1.0.0-beta.1",
    "pnpm exec nerio init",
    "pnpm exec nerio add button",
    "pnpm exec nerio doctor",
  ],
} as const;

export type ShowreelFormat = "square" | "vertical" | "wide";
