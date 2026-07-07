import Link from "next/link";
import { Badge, Button, Card, EmptyState, Stat } from "@nerio/ui";

export default function HomePage() {
  return (
    <div className="hero">
      <Badge variant="info">Foundation preview</Badge>
      <h1>Source-first UI for adaptable product teams.</h1>
      <p>
        Nerio combines semantic tokens, accessible React components, a local registry, CLI tooling,
        and AI-readable metadata for modern digital products.
      </p>
      <div className="hero-actions">
        <Button render={<Link href="/docs/getting-started" />}>Start building</Button>
        <Button variant="secondary" render={<Link href="/docs/components/button" />}>
          View components
        </Button>
      </div>
      <div className="grid">
        <Stat label="Themes" value="3" trend="Runtime CSS variables" />
        <Stat label="Density modes" value="2" trend="Comfortable and compact" />
        <Stat label="Registry slice" value="Button" trend="Local source install" />
      </div>
      <div className="grid">
        <Card>
          <h2>Universal by design</h2>
          <p>
            Use Nerio for projects, collections, content, collaboration, settings, search, activity,
            and analytics.
          </p>
        </Card>
        <Card>
          <h2>Token first</h2>
          <p>
            Primitive, semantic, and component tokens keep themes and product branding resilient.
          </p>
        </Card>
        <EmptyState
          title="No locked-in vertical"
          description="Nerio avoids domain-specific motifs so teams can brand it through tokens."
        />
      </div>
    </div>
  );
}
