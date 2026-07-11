import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#17131f",
        color: "#faf8ff",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", color: "#c4b5fd", fontSize: 32 }}>
        <span
          style={{
            marginRight: 16,
            width: 18,
            height: 18,
            borderRadius: 18,
            background: "#8b5cf6",
          }}
        />
        {siteConfig.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-3px" }}>
          Open-source React design system
        </div>
        <div
          style={{ marginTop: 28, maxWidth: 850, color: "#d6d3d1", fontSize: 31, lineHeight: 1.3 }}
        >
          Accessible components, semantic tokens, editable source code, CLI tooling, and AI-ready
          documentation.
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", color: "#c4b5fd", fontSize: 27 }}
      >
        <span>Source-first UI</span>
        <span>{siteConfig.version}</span>
      </div>
    </div>,
    socialImageSize,
  );
}
