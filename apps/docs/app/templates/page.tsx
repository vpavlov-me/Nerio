import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Workspace template",
  description:
    "Explore a live Nerio Core workspace template built with accessible components and semantic design tokens for product teams.",
  path: "/templates",
});

export default function TemplatesPage() {
  const demoAppUrl = process.env.NEXT_PUBLIC_DEMO_APP_URL ?? "http://localhost:3002";

  return (
    <article className="doc-page templates-page">
      <div>
        <p className="doc-kicker">Templates</p>
        <h1>Explore the Nerio workspace template.</h1>
        <p className="doc-lede">
          This live Nerio Core demonstration shows an adaptable product workspace built with Cards,
          Fields, Buttons, navigation patterns, and semantic design tokens for SaaS and product
          teams.
        </p>
        <p>
          Use it to evaluate how editable source components work together in a complete interface,
          then adapt the same Core building blocks to your own product.
        </p>
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
