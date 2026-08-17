import * as React from "react";
import { ArrowRight, Check } from "@nerio-ui/adapters/icons";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CodePanel } from "../components/CodePanel";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import { showreelConfig, type ShowreelFormat } from "../showreel.config";

export function DeveloperScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stacked = format !== "wide";

  return (
    <SceneFrame dark format={format} label="Developer experience">
      <div
        style={{
          display: "grid",
          gap: 44,
          gridTemplateColumns: stacked ? "1fr" : "0.9fr 1.1fr",
          width: "100%",
        }}
      >
        <div style={{ alignContent: "center", display: "grid", gap: 30 }}>
          <div
            className="showreel-eyebrow"
            style={{ background: "rgb(255 255 255 / 10%)", color: "#d4d4d8" }}
          >
            Developer experience
          </div>
          <h1 className="showreel-heading" style={{ color: "#fff", fontSize: stacked ? 76 : 94 }}>
            Inspect. Install. Own the source.
          </h1>
          <p className="showreel-lede" style={{ color: "#a1a1aa", fontSize: 28 }}>
            Registry metadata, editable files, and public commands stay aligned.
          </p>
        </div>
        <div style={{ alignContent: "center", display: "grid", gap: 20 }}>
          <CodePanel
            name="Nerio CLI workflow"
            lines={showreelConfig.cliCommands.map((line) => `$ ${line}`)}
          />
          <Interactive.Div
            name="Installed source result"
            style={{
              opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Card style={{ background: "#18181b", borderColor: "#27272a", color: "#fff" }}>
              <CardHeader>
                <CardTitle style={{ color: "#fff" }}>button installed</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
                  <Badge leadingIcon={Check} tone="success">
                    Integrity verified
                  </Badge>
                  <Button trailingIcon={ArrowRight}>Open source</Button>
                </div>
              </CardContent>
            </Card>
          </Interactive.Div>
        </div>
      </div>
    </SceneFrame>
  );
}
