import * as React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLockup } from "../components/BrandLockup";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import { showreelConfig, type ShowreelFormat } from "../showreel.config";

export function IdentityScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame format={format} label="Identity">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: format === "wide" ? 54 : 70,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <BrandLockup format={format} />
        <Interactive.Div
          name="Release status"
          className="showreel-eyebrow"
          style={{
            opacity: interpolate(frame, [0.85 * fps, 1.35 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0.85 * fps, 1.35 * fps], ["0px 18px", "0px 0px"], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Public beta · {showreelConfig.releaseLabel}
        </Interactive.Div>
      </div>
    </SceneFrame>
  );
}
