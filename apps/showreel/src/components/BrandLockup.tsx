import * as React from "react";
import {
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function BrandLockup({
  format,
  compact = false,
  static: isStatic = false,
}: {
  format: ShowreelFormat;
  compact?: boolean;
  static?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markSize = compact ? (format === "vertical" ? 156 : 120) : format === "wide" ? 210 : 176;

  return (
    <Interactive.Div
      name="Nerio brand lockup"
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: format === "vertical" && !compact ? "column" : "row",
        gap: compact ? 28 : 44,
        opacity: isStatic
          ? 1
          : interpolate(frame, [0, 0.7 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
        scale: isStatic
          ? 1
          : interpolate(frame, [0, 0.9 * fps], [0.94, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
      }}
    >
      <Img
        name="Nerio mark"
        src={staticFile("brand/mark.svg")}
        style={{ height: markSize, width: markSize }}
      />
      <div className="showreel-logo-text">Nerio</div>
    </Interactive.Div>
  );
}
