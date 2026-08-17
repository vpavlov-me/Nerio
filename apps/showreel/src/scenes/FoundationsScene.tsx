import * as React from "react";
import { Check, Layers, Sparkles } from "@nerio-ui/adapters/icons";
import { Badge, Card, CardContent, CardHeader, CardTitle, Input, Progress } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

const swatches = [
  ["Canvas", "var(--n-color-surface-canvas)"],
  ["Subtle", "var(--n-color-surface-subtle)"],
  ["Selected", "var(--n-color-surface-selected)"],
  ["Action", "var(--n-color-action-primary)"],
] as const;

export function FoundationsScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stacked = format === "vertical";

  return (
    <SceneFrame format={format} label="Foundations">
      <div style={{ display: "grid", gap: format === "wide" ? 44 : 36, width: "100%" }}>
        <div style={{ alignItems: "end", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "grid", gap: 22 }}>
            <div className="showreel-eyebrow">Foundations</div>
            <h1 className="showreel-heading" style={{ fontSize: format === "wide" ? 92 : 72 }}>
              Tokens become interface.
            </h1>
          </div>
          {format === "wide" ? <div className="showreel-meta">Theme · mode · density</div> : null}
        </div>
        <div
          style={{
            alignItems: "stretch",
            display: "grid",
            gap: 28,
            gridTemplateColumns: stacked ? "1fr" : "0.86fr 1.14fr",
            minHeight: 0,
          }}
        >
          <Interactive.Div
            name="Foundation tokens"
            className="showreel-stage"
            style={{
              display: "grid",
              gap: 22,
              opacity: interpolate(frame, [0.25 * fps, 0.8 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              padding: 34,
              translate: interpolate(frame, [0.25 * fps, 0.9 * fps], ["-42px 0px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {swatches.map(([label, color], index) => (
              <div
                key={label}
                style={{
                  alignItems: "center",
                  display: "grid",
                  gap: 18,
                  gridTemplateColumns: "54px 1fr auto",
                  opacity: interpolate(
                    frame,
                    [(0.45 + index * 0.12) * fps, (0.9 + index * 0.12) * fps],
                    [0, 1],
                    {
                      easing: nerioEase,
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  ),
                }}
              >
                <span
                  style={{
                    background: color,
                    border: "1px solid var(--n-color-border-subtle)",
                    borderRadius: 16,
                    height: 54,
                  }}
                />
                <span style={{ fontSize: 22 }}>{label}</span>
                <code className="showreel-meta">--n-*</code>
              </div>
            ))}
          </Interactive.Div>
          <Interactive.Div
            name="Foundation component result"
            className="showreel-stage showreel-component-scale"
            style={{
              alignContent: "center",
              display: "grid",
              gap: 22,
              opacity: interpolate(frame, [0.6 * fps, 1.15 * fps], [0, 1], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              padding: 38,
              translate: interpolate(frame, [0.6 * fps, 1.2 * fps], ["44px 0px", "0px 0px"], {
                easing: nerioEase,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Button leadingIcon={Sparkles}>Create interface</Button>
              <Button leadingIcon={Layers} variant="secondary">
                Inspect source
              </Button>
              <Badge leadingIcon={Check} tone="success">
                Accessible
              </Badge>
            </div>
            <Input
              aria-label="Project name"
              placeholder="Project name"
              value="Nerio launch"
              readOnly
            />
            <Card variant="secondary">
              <CardHeader>
                <CardTitle>Release evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress label="Public beta" value={72} valueLabel="72%" />
              </CardContent>
            </Card>
          </Interactive.Div>
        </div>
      </div>
    </SceneFrame>
  );
}
