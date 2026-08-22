import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function DeveloperScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneFrame dark format={format} label="Developer experience">
      <div
        style={{
          alignContent: "center",
          display: "grid",
          gap: format === "wide" ? 52 : 44,
          width: "100%",
        }}
      >
        <Interactive.Div
          name="Inspect install own headline"
          style={{
            fontSize: format === "wide" ? 142 : format === "vertical" ? 108 : 86,
            fontWeight: 540,
            letterSpacing: "-0.068em",
            lineHeight: 0.92,
            opacity: interpolate(frame, [0, 0.55 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 0.7 * fps], ["0px 60px", "0px 0px"], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Inspect. Install.
          <br />
          Own.
        </Interactive.Div>
        <Interactive.Code
          name="Install command"
          style={{
            color: "#c4b5fd",
            fontFamily: "var(--n-font-mono)",
            fontSize: format === "wide" ? 34 : 25,
            opacity: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          pnpm exec nerio add button
        </Interactive.Code>
      </div>
    </SceneFrame>
  );
}
