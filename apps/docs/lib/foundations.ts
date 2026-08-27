import { foundationPageMetadata } from "./generated/foundation-search-pages";

export type FoundationPath = (typeof foundationPageMetadata)[number]["path"];

export function getFoundationPage(path: FoundationPath) {
  const page = foundationPageMetadata.find((candidate) => candidate.path === path);
  if (!page) throw new Error(`Unknown canonical foundation path: ${path}`);
  return page;
}
