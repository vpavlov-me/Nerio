import * as React from "react";
import { ArrowRight } from "@nerio-ui/adapters/icons";
import { Badge, Input } from "@nerio-ui/ui";
import { Button, Tabs, TabsIndicator, TabsList, TabsTrigger } from "@nerio-ui/ui/client";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function ComponentPortraitsScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stacked = format !== "wide";

  return (
    <SceneFrame format={format} label="Component portraits">
      <div
        style={{ alignContent: "center", display: "grid", gap: stacked ? 36 : 52, width: "100%" }}
      >
        <div style={{ display: "grid", gap: 18 }}>
          <div className="showreel-eyebrow">Core components</div>
          <h1 className="showreel-heading" style={{ fontSize: stacked ? 78 : 112 }}>
            Real components.
          </h1>
        </div>
        <div
          style={{
            display: "grid",
            gap: stacked ? 20 : 24,
            gridTemplateColumns: stacked ? "1fr" : "repeat(3, minmax(0, 1fr))",
          }}
        >
          <Interactive.Div
            name="Button portrait"
            className="showreel-portrait"
            style={{
              opacity: interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [0.2 * fps, 0.8 * fps], ["0px 56px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div className="showreel-portrait-label">Button</div>
            <div className="showreel-portrait-content">
              <Button trailingIcon={ArrowRight}>Approve</Button>
              <Button variant="secondary">Review</Button>
            </div>
          </Interactive.Div>
          <Interactive.Div
            name="Input portrait"
            className="showreel-portrait"
            style={{
              opacity: interpolate(frame, [0.45 * fps, 0.95 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [0.45 * fps, 1.05 * fps], ["0px 56px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div className="showreel-portrait-label">Input</div>
            <div className="showreel-portrait-content">
              <Input aria-label="Release name" readOnly value="Release candidate" />
            </div>
          </Interactive.Div>
          <Interactive.Div
            name="Tabs portrait"
            className="showreel-portrait"
            style={{
              opacity: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [0.7 * fps, 1.3 * fps], ["0px 56px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div className="showreel-portrait-label">Tabs</div>
            <div className="showreel-portrait-content" style={{ display: "grid", gap: 16 }}>
              <Tabs value="overview" variant="segmented">
                <TabsList aria-label="Release sections">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                  <TabsIndicator />
                </TabsList>
              </Tabs>
              <Badge tone="success">Ready for review</Badge>
            </div>
          </Interactive.Div>
        </div>
      </div>
    </SceneFrame>
  );
}
