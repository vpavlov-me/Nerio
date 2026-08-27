import Link from "next/link";
import { foundationPageMetadata } from "../lib/generated/foundation-search-pages";

export function FoundationDirectory() {
  return (
    <ul className="doc-list" aria-label="Foundation documentation">
      {foundationPageMetadata.map((page) => (
        <li key={page.path}>
          <Link href={page.path}>{page.label}</Link> — {page.description}
        </li>
      ))}
    </ul>
  );
}
