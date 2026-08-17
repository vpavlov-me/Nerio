import * as React from "react";
import { ArrowRight } from "@nerio-ui/adapters/icons";
import { Button } from "@nerio-ui/ui/client";
import {
  AbsoluteFill,
  Img,
  Interactive,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { showreelConfig } from "../showreel.config";

export function NerioHeroLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const orbitX = Math.cos(phase) * 26;
  const orbitY = Math.sin(phase) * 18;
  const secondaryX = Math.cos(phase + Math.PI) * 18;
  const secondaryY = Math.sin(phase + Math.PI) * 24;

  return (
    <AbsoluteFill
      className="showreel-root"
      data-density="comfortable"
      data-mode="light"
      data-theme="purple"
    >
      <div className="showreel-frame" data-format="wide" style={{ alignItems: "center" }}>
        <div style={{ display: "grid", gap: 40, maxWidth: 980, zIndex: 2 }}>
          <div className="showreel-eyebrow">Open source · {showreelConfig.releaseLabel}</div>
          <h1 className="showreel-heading">Build the product. Own the source.</h1>
          <p className="showreel-lede">
            A calm, accessible React design system for modern digital products.
          </p>
          <div>
            <Button trailingIcon={ArrowRight}>Explore Nerio</Button>
          </div>
        </div>
        <Interactive.Div
          name="Looping Nerio mark"
          style={{
            alignItems: "center",
            display: "flex",
            height: 560,
            justifyContent: "center",
            position: "absolute",
            right: 130,
            top: 250,
            width: 560,
          }}
        >
          <div
            style={{
              border: "1px solid var(--n-color-border-subtle)",
              borderRadius: 999,
              height: 500,
              position: "absolute",
              translate: `${orbitX}px ${orbitY}px`,
              width: 500,
            }}
          />
          <div
            style={{
              background: "var(--n-color-surface-subtle)",
              borderRadius: 999,
              height: 390,
              position: "absolute",
              translate: `${secondaryX}px ${secondaryY}px`,
              width: 390,
            }}
          />
          <Img
            name="Nerio mark"
            src={staticFile("brand/mark.svg")}
            style={{ height: 250, position: "relative", width: 250 }}
          />
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
}
