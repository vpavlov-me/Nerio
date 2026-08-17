import * as React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BrandLockup } from "../components/BrandLockup";
import { showreelConfig, type ShowreelFormat } from "../showreel.config";

export function PosterFrame() {
  const { height, width } = useVideoConfig();
  const format: ShowreelFormat = height > width ? "vertical" : width === height ? "square" : "wide";

  return (
    <AbsoluteFill
      className="showreel-root"
      data-density="comfortable"
      data-mode="light"
      data-theme="purple"
    >
      <div
        className="showreel-frame"
        data-format={format}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 48,
            textAlign: "center",
          }}
        >
          <BrandLockup format={format} static />
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontSize: format === "wide" ? 44 : 34, fontWeight: 500 }}>
              {showreelConfig.positioning}
            </div>
            <div className="showreel-meta">Public beta · {showreelConfig.releaseLabel}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
