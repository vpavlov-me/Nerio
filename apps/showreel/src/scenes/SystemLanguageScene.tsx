import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

const categories = ["Actions", "Forms", "Navigation", "Data", "Feedback"] as const;

export function SystemLanguageScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame dark format={format} label="System language">
      <div style={{ alignContent: "center", display: "grid", gap: 64, width: "100%" }}>
        <Interactive.Div
          name="One system headline"
          style={{
            fontSize: format === "wide" ? 178 : format === "vertical" ? 132 : 104,
            fontWeight: 540,
            letterSpacing: "-0.072em",
            lineHeight: 0.9,
            opacity: interpolate(frame, [0, 0.55 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 0.7 * fps], ["0px 70px", "0px 0px"], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          One system.
        </Interactive.Div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {categories.map((category, index) => (
            <Interactive.Div
              key={category}
              name={`${category} category`}
              style={{
                border: "1px solid #27272a",
                borderRadius: 999,
                color: index === 0 ? "#c4b5fd" : "#a1a1aa",
                fontSize: format === "wide" ? 25 : 21,
                opacity: interpolate(
                  frame,
                  [(0.65 + index * 0.12) * fps, (1.1 + index * 0.12) * fps],
                  [0, 1],
                  {
                    easing: nerioEase,
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
                padding: "13px 20px",
                translate: interpolate(
                  frame,
                  [(0.65 + index * 0.12) * fps, (1.15 + index * 0.12) * fps],
                  ["0px 24px", "0px 0px"],
                  {
                    easing: nerioEase,
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
              }}
            >
              {category}
            </Interactive.Div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}
