import * as React from "react";
import { Check, Sparkles } from "@nerio-ui/adapters/icons";
import { Badge, Progress } from "@nerio-ui/ui";
import { Button, Dialog, DialogFooter, Switch, Toggle } from "@nerio-ui/ui/client";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { nerioEase } from "../motion/timing";
import type { ShowreelFormat } from "../showreel.config";

export function InteractionScene({ format }: { format: ShowreelFormat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const selected = frame >= 0.9 * fps;
  const dialogOpen = frame >= 2.2 * fps;
  const progress = Math.min(
    100,
    Math.round(
      interpolate(frame, [0.7 * fps, 4.4 * fps], [18, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  return (
    <SceneFrame format={format} label="Interaction choreography">
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 52,
          gridTemplateColumns: format === "wide" ? "0.8fr 1.2fr" : "1fr",
          width: "100%",
        }}
      >
        <div style={{ display: "grid", gap: 28 }}>
          <div className="showreel-eyebrow">Interaction choreography</div>
          <h1 className="showreel-heading" style={{ fontSize: format === "wide" ? 92 : 74 }}>
            State stays spatially coherent.
          </h1>
          <p className="showreel-lede" style={{ fontSize: format === "wide" ? 30 : 26 }}>
            Controlled state, restrained travel, predictable feedback.
          </p>
        </div>
        <Interactive.Div
          name="Controlled interaction state"
          className="showreel-stage showreel-component-scale"
          style={{
            display: "grid",
            gap: 26,
            opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
              easing: nerioEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            padding: 42,
          }}
        >
          <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Toggle leadingIcon={Sparkles} pressed={selected}>
              Motion tokens
            </Toggle>
            <Switch checked={selected} label="Reduced-motion safe" readOnly />
            <Badge leadingIcon={Check} tone={progress === 100 ? "success" : "primary-soft"}>
              {progress === 100 ? "Ready" : "Rendering"}
            </Badge>
          </div>
          <Progress label="Render evidence" value={progress} valueLabel={`${progress}%`} />
          <Dialog
            open={dialogOpen}
            trigger={<Button variant="secondary">Review candidate</Button>}
            title="Review release candidate"
            description="The actual Nerio Dialog settles over the current interface."
          >
            <Progress label="Quality gate" value={progress} valueLabel={`${progress}%`} />
            <DialogFooter>
              <Button variant="secondary">Keep reviewing</Button>
              <Button>Approve draft</Button>
            </DialogFooter>
          </Dialog>
        </Interactive.Div>
      </div>
    </SceneFrame>
  );
}
