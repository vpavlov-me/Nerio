import { Code, Heading, Text } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { LocalizationPreview } from "../../../../components/localization-preview";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Direction and localization",
  description:
    "Configure LTR and RTL behavior, deterministic locale-sensitive output, and overridable Core labels in Nerio.",
  path: "/docs/foundations/localization",
});

const providerExample = `"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const direction = "rtl";
  return <DirectionProvider direction={direction}>{children}</DirectionProvider>;
}`;

const documentExample = `<html dir="rtl" data-theme="purple" data-mode="system" data-density="comfortable">
  <body>{/* Render the matching DirectionProvider inside the app. */}</body>
</html>`;

const fixtureExample = `import { DirectionProvider } from "@base-ui/react/direction-provider";
import { SidebarProvider, Slider, Tabs, TabsContent, TabsList, TabsPanels, TabsTrigger } from "@nerio-ui/ui/client";

<DirectionProvider direction="rtl">
  <div dir="rtl">
    <Tabs defaultValue="overview">
      <TabsList aria-label="RTL workspace sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsPanels>
        <TabsContent value="overview">Overview content</TabsContent>
        <TabsContent value="details">Details content</TabsContent>
      </TabsPanels>
    </Tabs>
    <Slider label="RTL priority" defaultValue={35} />
    <SidebarProvider>Inherited Sidebar direction</SidebarProvider>
  </div>
</DirectionProvider>`;

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Foundation</p>
        <h1>Direction and localization</h1>
        <p className="doc-lede">
          HTML owns reading direction, Base UI receives the same direction for interactive behavior,
          and components accept locale only when they own durable formatting.
        </p>
      </header>

      <section className="doc-section">
        <Heading id="direction" as="h2">
          Direction
        </Heading>
        <Text>
          Set <Code>dir</Code> on the document or an intentional product surface. Nerio layout uses
          inherited direction and logical properties. Physical sides remain physical only for APIs
          such as Sheet and Sidebar side placement.
        </Text>
        <CodeExample code={documentExample} />
      </section>

      <section className="doc-section">
        <Heading id="base-ui-behavior" as="h2">
          Base UI behavior
        </Heading>
        <Text>
          Base UI does not infer behavioral direction from CSS. Wrap direction-sensitive interactive
          primitives once and keep its value synchronized with the HTML direction.
        </Text>
        <CodeExample code={providerExample} />
      </section>

      <section className="doc-section">
        <Heading id="rtl-fixture" as="h2">
          RTL fixture
        </Heading>
        <Text>
          This fixture pairs inherited CSS direction with the behavioral provider. Arrow keys follow
          RTL reading order in horizontal Tabs and Slider.
        </Text>
        <LocalizationPreview snippet={fixtureExample} />
      </section>

      <section className="doc-section">
        <Heading id="locale" as="h2">
          Locale-sensitive output
        </Heading>
        <Text>
          Calendar, DatePicker, Slider, and Command accept locale where formatting, value text, or
          filtering belongs to the component. Calendar and DatePicker default to explicit
          <Code>en-US</Code> output so server and client markup agree. Pass the same explicit locale
          on both sides when your application uses another locale.
        </Text>
      </section>

      <section className="doc-section">
        <Heading id="labels" as="h2">
          Labels and copy
        </Heading>
        <Text>
          Built-in English strings are overridable fallbacks for Core-owned controls, not a message
          catalog. Translation loading, product terminology, pluralization, routing, currency, and
          time-zone policy remain application responsibilities.
        </Text>
      </section>

      <section className="doc-section">
        <Heading id="keyboard" as="h2">
          Keyboard and visual direction
        </Heading>
        <Text>
          Horizontal navigation follows reading direction where the platform or component contract
          requires it. Previous and next icons may mirror; arbitrary product icons do not mirror
          automatically. Calendar keeps locale formatting, week start, and direction as separate
          decisions.
        </Text>
      </section>

      <section className="doc-section">
        <Heading id="consumer-boundary" as="h2">
          Consumer boundary
        </Heading>
        <Text>
          Nerio does not provide a locale provider or an i18n framework. Consumers own catalogs,
          routing, product copy, domain formatting, and data localization. See the repository
          contract in <Code>docs/direction-localization.md</Code> for the complete audited boundary.
        </Text>
      </section>
    </article>
  );
}
