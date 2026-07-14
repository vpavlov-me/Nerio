export const siteConfig = {
  name: "Nerio",
  url: "https://nerio.vpavlov.com",
  repositoryUrl: "https://github.com/vpavlov-me/Nerio",
  version: "v0.1.0-alpha.0",
  defaultTitle: "Nerio — Open-source React design system",
  titleTemplate: "%s · Nerio",
  defaultDescription:
    "Nerio is an open-source, source-first React design system with accessible components, semantic tokens, editable source code, CLI tooling, and AI-ready documentation.",
  author: {
    name: "Vladimir Pavlov",
    url: "https://vpavlov.com",
  },
  locale: "en_US",
} as const;

export const siteUrl = new URL(siteConfig.url);
