import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLockup } from "../components/BrandLockup";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import { showreelConfig, type ShowreelFormat } from "../showreel.config";

export function OutroScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame format={format} label="Outro">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: format === "wide" ? 54 : 66,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <BrandLockup compact format={format} />
        <Interactive.Div
          name="Open source technology statement"
          style={{
            display: "grid",
            gap: 18,
            opacity: interpolate(frame, [0.55 * fps, 1.1 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0.55 * fps, 1.2 * fps], ["0px 28px", "0px 0px"], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ fontSize: format === "wide" ? 44 : 34, fontWeight: 500 }}>
            {showreelConfig.technologyLabel}
          </div>
          <div className="showreel-meta">Public beta · {showreelConfig.releaseLabel}</div>
          <div
            style={{
              color: "var(--n-color-action-primary)",
              fontSize: format === "wide" ? 30 : 26,
            }}
          >
            {showreelConfig.canonicalUrl}
          </div>
        </Interactive.Div>
      </div>
    </SceneFrame>
  );
}
