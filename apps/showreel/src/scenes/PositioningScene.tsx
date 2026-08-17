import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CodePanel } from "../components/CodePanel";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import { showreelConfig, type ShowreelFormat } from "../showreel.config";

export function PositioningScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stacked = format !== "wide";

  return (
    <SceneFrame format={format} label="Positioning">
      <div
        style={{
          alignItems: stacked ? "stretch" : "center",
          display: "grid",
          gap: stacked ? 58 : 96,
          gridTemplateColumns: stacked ? "1fr" : "1.08fr 0.92fr",
          width: "100%",
        }}
      >
        <div style={{ display: "grid", gap: 36 }}>
          <Interactive.Div
            name="Positioning eyebrow"
            className="showreel-eyebrow"
            style={{
              opacity: interpolate(frame, [0, 0.45 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Build with the source
          </Interactive.Div>
          <Interactive.H1
            name="Positioning title"
            className="showreel-heading"
            style={{
              opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [0.2 * fps, 0.9 * fps], ["0px 44px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Source-first design system
            <span className="showreel-accent"> for modern digital products.</span>
          </Interactive.H1>
        </div>
        <CodePanel
          name="Current package imports"
          lines={[
            "$ pnpm add @nerio-ui/ui @nerio-ui/tokens @nerio-ui/adapters",
            "",
            'import { Card } from "@nerio-ui/ui";',
            'import { Button } from "@nerio-ui/ui/client";',
            'import "@nerio-ui/ui/styles.css";',
            "",
            `<Button>${showreelConfig.productName}</Button>`,
          ]}
        />
      </div>
    </SceneFrame>
  );
}
