import * as React from "react";
import type { ReactNode } from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function SceneFrame({
  children,
  format,
  label,
  dark = false,
}: {
  children: ReactNode;
  format: ShowreelFormat;
  label: string;
  dark?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      className="showreel-root"
      data-density="comfortable"
      data-mode={dark ? "dark" : "light"}
      data-nerio-theme-scope=""
      data-theme="purple"
      style={{
        backgroundColor: "var(--n-color-surface-canvas)",
        color: "var(--n-color-text-primary)",
      }}
    >
      <Interactive.Div
        name={`${label} frame`}
        className="showreel-frame"
        data-format={format}
        style={{
          opacity: interpolate(frame, [0, 0.35 * fps], [0, 1], {
            easing: nerioEase,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {children}
      </Interactive.Div>
    </AbsoluteFill>
  );
}
