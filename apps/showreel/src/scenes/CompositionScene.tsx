import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

const componentNames = ["Button", "Input", "Tabs", "Card", "Badge", "Avatar"] as const;

export function CompositionScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame format={format} label="Built to compose">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Interactive.Div
          name="Built to compose headline"
          style={{
            fontSize: format === "wide" ? 154 : format === "vertical" ? 118 : 94,
            fontWeight: 540,
            letterSpacing: "-0.068em",
            lineHeight: 0.92,
            opacity: interpolate(frame, [0.35 * fps, 0.9 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            position: "relative",
            zIndex: 2,
          }}
        >
          Built to
          <br />
          compose.
        </Interactive.Div>
        {componentNames.map((name, index) => {
          const angle = (index / componentNames.length) * Math.PI * 2;
          const radiusX = format === "wide" ? 610 : format === "vertical" ? 360 : 390;
          const radiusY = format === "wide" ? 330 : format === "vertical" ? 560 : 350;
          const x = Math.cos(angle) * radiusX;
          const y = Math.sin(angle) * radiusY;

          return (
            <Interactive.Div
              key={name}
              name={`${name} composition label`}
              style={{
                background:
                  index === 0 ? "var(--n-color-action-primary)" : "var(--n-color-surface-subtle)",
                borderRadius: 999,
                color: index === 0 ? "white" : "var(--n-color-text-secondary)",
                fontSize: format === "wide" ? 20 : 18,
                left: "50%",
                opacity: interpolate(
                  frame,
                  [(0.1 + index * 0.08) * fps, (0.55 + index * 0.08) * fps],
                  [0, 1],
                  {
                    easing: nerioEase,
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
                padding: "12px 18px",
                position: "absolute",
                top: "50%",
                translate: interpolate(
                  frame,
                  [0, 1.15 * fps],
                  [`${x * 1.18 - 56}px ${y * 1.18 - 24}px`, `${x - 56}px ${y - 24}px`],
                  {
                    easing: nerioEase,
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
              }}
            >
              {name}
            </Interactive.Div>
          );
        })}
      </div>
    </SceneFrame>
  );
}
