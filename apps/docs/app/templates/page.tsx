import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Workspace demo",
  description:
    "Explore an app-local Nerio Core workspace demo built with accessible components and semantic design tokens.",
  path: "/templates",
  indexable: false,
});

export default function TemplatesPage() {
  const demoAppUrl = process.env.NEXT_PUBLIC_DEMO_APP_URL ?? "http://localhost:3002";

  return (
    <article className="doc-page templates-page">
      <div>
        <p className="doc-kicker">Demo · Core alpha</p>
        <h1>Explore the Nerio workspace demo.</h1>
        <p className="doc-lede">
          This app-local demonstration shows an adaptable product workspace built with Cards,
          Fields, Buttons, navigation patterns, and semantic design tokens.
        </p>
        <p>
          It is a product stress test for Core primitives, not a released Core template or Pro
          distribution surface. It demonstrates the current alpha contract and may change before
          1.0.
        </p>
        <a className="text-link" href={demoAppUrl} target="_blank" rel="noreferrer">
          Open the workspace demo in a new tab
        </a>
      </div>
      <iframe
        className="templates-demo-frame"
        src={demoAppUrl}
        title="Nerio Demo App"
        allow="clipboard-read; clipboard-write"
      />
    </article>
  );
}
