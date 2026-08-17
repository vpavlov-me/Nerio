import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ProductWindow } from "../components/ProductWindow";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function ProductScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stacked = format !== "wide";

  return (
    <SceneFrame format={format} label="Product composition">
      <div style={{ display: "grid", gap: stacked ? 28 : 36, width: "100%" }}>
        <div style={{ alignItems: "end", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "grid", gap: 18 }}>
            <div className="showreel-eyebrow">Primitives become products</div>
            <h1 className="showreel-heading" style={{ fontSize: stacked ? 68 : 86 }}>
              Different shapes. One language.
            </h1>
          </div>
          {format === "wide" ? (
            <div className="showreel-meta">Same-origin deterministic Views</div>
          ) : null}
        </div>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: stacked ? "1fr" : "1fr 1fr",
            minHeight: 0,
          }}
        >
          <Interactive.Div
            name="Operations Workspace source"
            style={{
              height: stacked ? (format === "vertical" ? 560 : 350) : 660,
              opacity: interpolate(frame, [0.25 * fps, 0.9 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [0.25 * fps, 1 * fps], ["-64px 0px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <ProductWindow capture="operations-workspace.png" label="Operations Workspace" />
          </Interactive.Div>
          <Interactive.Div
            name="Finance and Assets source"
            style={{
              height: stacked ? (format === "vertical" ? 560 : 350) : 660,
              opacity: interpolate(frame, [0.55 * fps, 1.2 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [0.55 * fps, 1.3 * fps], ["64px 0px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <ProductWindow
              capture="finance-assets.png"
              label="Finance & Assets"
              objectPosition="top center"
            />
          </Interactive.Div>
        </div>
      </div>
    </SceneFrame>
  );
}
