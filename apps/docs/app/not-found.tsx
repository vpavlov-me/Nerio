import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="doc-page">
      <header>
        <p className="doc-kicker">Not found</p>
        <h1>Page not found</h1>
        <p className="doc-lede">The page you requested does not exist or has moved.</p>
      </header>
    </main>
  );
}
