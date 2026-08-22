import * as React from "react";
import { Check, MessageCircle } from "@nerio-ui/adapters/icons";
import { Avatar, Badge, Card, CardContent, Progress } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import { showreelConfig, type ShowreelFormat } from "../showreel.config";

const evidence = ["Core contracts", "Accessibility", "Docs and registry"] as const;

export function ApprovalScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stacked = format !== "wide";

  return (
    <SceneFrame format={format} label="Approval composition">
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: stacked ? 38 : 76,
          gridTemplateColumns: stacked ? "1fr" : "0.72fr 1.28fr",
          width: "100%",
        }}
      >
        <div style={{ display: "grid", gap: 24 }}>
          <div className="showreel-eyebrow">From components to decisions</div>
          <h1 className="showreel-heading" style={{ fontSize: stacked ? 76 : 102 }}>
            Ready for approval.
          </h1>
        </div>
        <Interactive.Div
          name="Release approval surface"
          className="showreel-approval showreel-component-scale"
          style={{
            opacity: interpolate(frame, [0.25 * fps, 0.85 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0.25 * fps, 1 * fps], ["60px 0px", "0px 0px"], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ alignItems: "start", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "grid", gap: 7 }}>
              <div className="showreel-meta">Release candidate</div>
              <div style={{ fontSize: stacked ? 25 : 29, fontWeight: 600 }}>Nerio Core</div>
            </div>
            <Badge tone="primary-soft">{showreelConfig.releaseLabel}</Badge>
          </div>
          <Card variant="secondary">
            <CardContent>
              <Progress label="Release evidence" value={96} valueLabel="96%" />
            </CardContent>
          </Card>
          <div style={{ display: "grid", gap: 2 }}>
            {evidence.map((item, index) => (
              <Interactive.Div
                key={item}
                name={`${item} evidence`}
                style={{
                  alignItems: "center",
                  borderBottom:
                    index < evidence.length - 1 ? "1px solid var(--n-color-border-subtle)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: interpolate(
                    frame,
                    [(0.7 + index * 0.16) * fps, (1.15 + index * 0.16) * fps],
                    [0, 1],
                    {
                      easing: nerioEase,
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  ),
                  padding: "16px 2px",
                }}
              >
                <span style={{ fontSize: 17 }}>{item}</span>
                <Badge leadingIcon={Check} tone="success">
                  Verified
                </Badge>
              </Interactive.Div>
            ))}
          </div>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
            <div style={{ alignItems: "center", display: "flex" }}>
              {["Maya Chen", "Amina Hassan", "Arjun Patel"].map((name, index) => (
                <div key={name} style={{ marginInlineStart: index === 0 ? 0 : -10 }}>
                  <Avatar name={name} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button leadingIcon={MessageCircle} variant="secondary">
                Request changes
              </Button>
              <Button leadingIcon={Check}>Approve release</Button>
            </div>
          </div>
        </Interactive.Div>
      </div>
    </SceneFrame>
  );
}
