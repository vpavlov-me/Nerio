"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Select } from "@nerio/ui";

const nav: Array<{ href: string; label: string }> = [
  { href: "/docs/getting-started", label: "Getting started" },
  { href: "/docs/foundations/tokens", label: "Tokens" },
  { href: "/docs/foundations/typography", label: "Typography" },
  { href: "/docs/foundations/themes", label: "Themes" },
  { href: "/docs/components/button", label: "Button" },
  { href: "/docs/components/icon-button", label: "IconButton" },
  { href: "/docs/components/badge", label: "Badge" },
  { href: "/docs/components/input", label: "Input" },
  { href: "/docs/components/dialog", label: "Dialog" },
  { href: "/docs/components/select", label: "Select" },
  { href: "/docs/components/toast", label: "Toast" },
  { href: "/docs/components/table", label: "Table" },
  { href: "/docs/components/tabs", label: "Tabs" },
  { href: "/docs/components/dropdown-menu", label: "DropdownMenu" },
  { href: "/docs/registry", label: "Registry" },
  { href: "/docs/ai", label: "AI tooling" },
];

export function DocsChrome({ children }: { children: React.ReactNode }) {
  const [theme, setThemeValue] = React.useState("purple-light");
  const [density, setDensityValue] = React.useState("comfortable");
  const setTheme = (value: string) => {
    setThemeValue(value);
    document.documentElement.setAttribute("data-theme", value);
  };
  const setDensity = (value: string) => {
    setDensityValue(value);
    document.documentElement.setAttribute("data-density", value);
  };

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span>Nerio</span>
        </Link>
        <div className="docs-controls">
          <Select
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              { label: "Purple light", value: "purple-light" },
              { label: "Neutral light", value: "neutral-light" },
              { label: "Neutral dark", value: "neutral-dark" },
              { label: "Fintech blue light", value: "fintech-blue-light" },
            ]}
          />
          <Select
            label="Density"
            value={density}
            onChange={setDensity}
            options={[
              { label: "Comfortable", value: "comfortable" },
              { label: "Compact", value: "compact" },
            ]}
          />
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText("nerio add button")}
          >
            Copy command
          </Button>
        </div>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav aria-label="Documentation">
            {nav.map(({ href, label }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
