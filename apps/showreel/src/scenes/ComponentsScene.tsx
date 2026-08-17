import * as React from "react";
import { Bell, LayoutDashboard, Save, Settings } from "@nerio-ui/adapters/icons";
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Stat,
} from "@nerio-ui/ui";
import {
  Button,
  Checkbox,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Toggle,
} from "@nerio-ui/ui/client";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function ComponentsScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const activeTab = frame < 4 * fps ? "overview" : "source";
  const compact = format !== "wide";

  return (
    <SceneFrame format={format} label="Core components">
      <div style={{ display: "grid", gap: compact ? 28 : 42, width: "100%" }}>
        <div style={{ display: "grid", gap: 20 }}>
          <div className="showreel-eyebrow">Frozen Core 1.0 surface</div>
          <h1 className="showreel-heading" style={{ fontSize: compact ? 70 : 90 }}>
            One system. Real states.
          </h1>
        </div>
        <Interactive.Div
          name="Core component board"
          className="showreel-stage showreel-component-scale"
          style={{
            display: "grid",
            gap: compact ? 22 : 30,
            gridTemplateColumns: compact ? "1fr" : "1.05fr 0.95fr",
            opacity: interpolate(frame, [0.35 * fps, 0.95 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            padding: compact ? 28 : 40,
            translate: interpolate(frame, [0.35 * fps, 1 * fps], ["0px 54px", "0px 0px"], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <Card variant="secondary">
              <CardHeader>
                <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
                  <Avatar name="Nerio maintainer" />
                  <div style={{ display: "grid", gap: 2 }}>
                    <CardTitle>Release workspace</CardTitle>
                    <span className="showreel-meta">Source-first · beta.1</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress
                  label="Evidence complete"
                  value={frame < 3 * fps ? 62 : 78}
                  valueLabel="78%"
                />
              </CardContent>
            </Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Button leadingIcon={LayoutDashboard}>Open workspace</Button>
              <Button leadingIcon={Settings} variant="secondary">
                Configure
              </Button>
              <Toggle aria-label="Follow updates" icon={Bell} pressed={frame >= 2.1 * fps} />
              <Toggle
                aria-label="Save release"
                icon={Save}
                pressed={frame >= 3.4 * fps}
                variant="outline"
              />
            </div>
            <Checkbox checked={frame >= 1.6 * fps} label="Include source metadata" readOnly />
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            <Tabs value={activeTab} variant="segmented">
              <TabsList aria-label="Showreel component sections">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
                <TabsIndicator />
              </TabsList>
              <TabsPanels>
                <TabsContent value="overview">
                  <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                    <Stat label="Components" value="51" trend="Stable Core" />
                    <Stat label="Runtime axes" value="3" trend="Composable" />
                  </div>
                </TabsContent>
                <TabsContent value="source">
                  <Card variant="secondary">
                    <CardContent>
                      <code style={{ fontSize: 15 }}>pnpm exec nerio add button</code>
                    </CardContent>
                  </Card>
                </TabsContent>
              </TabsPanels>
            </Tabs>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Badge tone="neutral">Neutral-first</Badge>
              <Badge tone="primary-soft">Source installed</Badge>
              <Badge tone="success">WCAG target</Badge>
              <Badge tone="warning">Beta evidence</Badge>
            </div>
          </div>
        </Interactive.Div>
      </div>
    </SceneFrame>
  );
}
