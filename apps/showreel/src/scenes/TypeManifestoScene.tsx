import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function TypeManifestoScene({
  durationInFrames,
  format,
}: {
  durationInFrames: number;
  format: ShowreelFormat;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headlineSize = format === "wide" ? 166 : format === "vertical" ? 132 : 104;

  return (
    <SceneFrame format={format} label="Type manifesto">
      <div style={{ alignItems: "center", display: "flex", flex: 1, width: "100%" }}>
        <Interactive.Div
          name="Build the product"
          style={{
            fontSize: headlineSize,
            fontWeight: 540,
            letterSpacing: "-0.072em",
            lineHeight: 0.88,
            opacity: interpolate(
              frame,
              [0, 0.45 * fps, durationInFrames * 0.45, durationInFrames * 0.55],
              [0, 1, 1, 0],
              {
                easing: [nerioEase, nerioEase, nerioEase],
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            position: "absolute",
            translate: interpolate(
              frame,
              [0, 0.6 * fps, durationInFrames * 0.45, durationInFrames * 0.56],
              ["0px 70px", "0px 0px", "0px 0px", "0px -70px"],
              {
                easing: [nerioEase, nerioEase, nerioEase],
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          Build the
          <br />
          product.
        </Interactive.Div>
        <Interactive.Div
          name="Own the source"
          style={{
            fontSize: headlineSize,
            fontWeight: 540,
            letterSpacing: "-0.072em",
            lineHeight: 0.88,
            opacity: interpolate(
              frame,
              [durationInFrames * 0.47, durationInFrames * 0.59],
              [0, 1],
              {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            position: "absolute",
            translate: interpolate(
              frame,
              [durationInFrames * 0.47, durationInFrames * 0.61],
              ["0px 70px", "0px 0px"],
              {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          Own the
          <br />
          <span className="showreel-accent">source.</span>
        </Interactive.Div>
        <Interactive.Div
          name="Manifesto note"
          style={{
            bottom: format === "vertical" ? 140 : 112,
            color: "var(--n-color-text-tertiary)",
            fontSize: format === "wide" ? 22 : 20,
            letterSpacing: "0.01em",
            opacity: interpolate(
              frame,
              [durationInFrames * 0.64, durationInFrames * 0.74],
              [0, 1],
              {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            position: "absolute",
          }}
        >
          Source-first by design.
        </Interactive.Div>
      </div>
    </SceneFrame>
  );
}
