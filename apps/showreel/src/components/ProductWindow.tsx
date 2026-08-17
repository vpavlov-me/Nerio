import * as React from "react";
import { Img, Interactive, staticFile } from "remotion";

export function ProductWindow({
  capture,
  label,
  objectPosition = "top left",
}: {
  capture: string;
  label: string;
  objectPosition?: string;
}) {
  return (
    <Interactive.Div name={`${label} product window`} className="showreel-window">
      <div className="showreel-window-bar" aria-hidden="true">
        <span className="showreel-window-dot" />
        <span className="showreel-window-dot" />
        <span className="showreel-window-dot" />
        <span style={{ color: "var(--n-color-text-tertiary)", fontSize: 14, marginInlineStart: 8 }}>
          {label}
        </span>
      </div>
      <Img
        className="showreel-capture"
        name={`${label} capture`}
        src={staticFile(`captures/${capture}`)}
        style={{ objectPosition }}
      />
    </Interactive.Div>
  );
}
