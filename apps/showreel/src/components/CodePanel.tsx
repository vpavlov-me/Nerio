import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { nerioEase } from "../motion/timing";

export function CodePanel({ lines, name }: { lines: readonly string[]; name: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hasLongLine = lines.some((line) => line.length > 64);

  return (
    <Interactive.Pre
      name={name}
      className="showreel-code"
      style={{
        fontSize: hasLongLine ? 17 : undefined,
        opacity: interpolate(frame, [0.35 * fps, 0.85 * fps], [0, 1], {
          easing: nerioEase,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0.35 * fps, 0.95 * fps], ["0px 36px", "0px 0px"], {
          easing: nerioEase,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {lines.map((line, index) => (
        <span
          className={line.startsWith("$") ? "showreel-code-line-accent" : undefined}
          key={`${line}-${index}`}
        >
          {line}
          {index < lines.length - 1 ? "\n" : ""}
        </span>
      ))}
    </Interactive.Pre>
  );
}
