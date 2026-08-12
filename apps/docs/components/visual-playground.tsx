"use client";

import * as React from "react";
import { densities, themes } from "@nerio-ui/tokens";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Select,
  ToastProvider,
  ToastViewport,
} from "@nerio-ui/ui/client";
import { PlaygroundShowcase } from "./playground-showcase";
import styles from "./visual-playground.module.css";

type Theme = (typeof themes)[number];
type Density = (typeof densities)[number];
type NeutralRecipe = "slate" | "gray" | "mauve" | "sage" | "olive" | "sand";
type RadiusPreset = "none" | "small" | "medium" | "large" | "full";
type MotionPreset = "reduced" | "calm" | "standard";
type PanelStyle = "flat" | "raised";
type PlaygroundStyle = React.CSSProperties & Record<`--${string}`, string | number>;

type SemanticColors = {
  canvas: string;
  surface: string;
  control: string;
  controlHover: string;
  controlActive: string;
  subtle: string;
  sunken: string;
  raised: string;
  overlay: string;
  selected: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textInverse: string;
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;
  borderInteractive: string;
  borderFocus: string;
  borderDanger: string;
  actionPrimary: string;
  actionPrimaryHover: string;
  actionPrimaryActive: string;
  actionOnPrimary: string;
  statusInfo: string;
  statusInfoSoft: string;
  statusSuccess: string;
  statusSuccessSoft: string;
  statusWarning: string;
  statusWarningSoft: string;
  statusDanger: string;
  statusDangerSoft: string;
  statusNeutral: string;
  statusNeutralSoft: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

const lightDefaults: SemanticColors = {
  canvas: "#ffffff",
  surface: "#ffffff",
  control: "rgb(15 23 42 / 0.06)",
  controlHover: "rgb(15 23 42 / 0.1)",
  controlActive: "rgb(15 23 42 / 0.12)",
  subtle: "rgb(15 23 42 / 0.04)",
  sunken: "rgb(15 23 42 / 0.06)",
  raised: "#ffffff",
  overlay: "#ffffff",
  selected: "rgb(15 23 42 / 0.08)",
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textTertiary: "#94a3b8",
  textDisabled: "#cbd5e1",
  textInverse: "#ffffff",
  borderSubtle: "rgb(15 23 42 / 0.06)",
  borderDefault: "rgb(15 23 42 / 0.1)",
  borderStrong: "rgb(15 23 42 / 0.12)",
  borderInteractive: "rgb(15 23 42 / 0.2)",
  borderFocus: "#6d5bd0",
  borderDanger: "#d34d4d",
  actionPrimary: "#6d5bd0",
  actionPrimaryHover: "#5e4bc2",
  actionPrimaryActive: "#503fad",
  actionOnPrimary: "#ffffff",
  statusInfo: "#3478d4",
  statusInfoSoft: "#eaf2ff",
  statusSuccess: "#2f8260",
  statusSuccessSoft: "#e8f5ef",
  statusWarning: "#a96620",
  statusWarningSoft: "#fff3df",
  statusDanger: "#c54c4c",
  statusDangerSoft: "#ffeded",
  statusNeutral: "#657086",
  statusNeutralSoft: "rgb(15 23 42 / 0.06)",
  chart1: "#6d5bd0",
  chart2: "#3478d4",
  chart3: "#2f8260",
  chart4: "#c76f2d",
  chart5: "#b44f8f",
};

const darkDefaults: SemanticColors = {
  canvas: "#000000",
  surface: "#000000",
  control: "rgb(255 255 255 / 0.08)",
  controlHover: "rgb(255 255 255 / 0.12)",
  controlActive: "rgb(255 255 255 / 0.16)",
  subtle: "rgb(255 255 255 / 0.08)",
  sunken: "#000000",
  raised: "#000000",
  overlay: "#000000",
  selected: "rgb(255 255 255 / 0.1)",
  textPrimary: "#f4f7fb",
  textSecondary: "#aab4c4",
  textTertiary: "#7f899a",
  textDisabled: "#596273",
  textInverse: "#10131a",
  borderSubtle: "rgb(255 255 255 / 0.06)",
  borderDefault: "rgb(255 255 255 / 0.1)",
  borderStrong: "rgb(255 255 255 / 0.12)",
  borderInteractive: "rgb(255 255 255 / 0.24)",
  borderFocus: "#9a89f0",
  borderDanger: "#eb7474",
  actionPrimary: "#8271e2",
  actionPrimaryHover: "#9181e9",
  actionPrimaryActive: "#a091ef",
  actionOnPrimary: "#ffffff",
  statusInfo: "#62a1ef",
  statusInfoSoft: "#172a42",
  statusSuccess: "#63b28d",
  statusSuccessSoft: "#142c23",
  statusWarning: "#d59a50",
  statusWarningSoft: "#352612",
  statusDanger: "#e67575",
  statusDangerSoft: "#391b1e",
  statusNeutral: "#aab4c4",
  statusNeutralSoft: "rgb(255 255 255 / 0.08)",
  chart1: "#9a89f0",
  chart2: "#62a1ef",
  chart3: "#63b28d",
  chart4: "#e29a5b",
  chart5: "#d77ab7",
};

const themeAccents: Record<Theme, [string, string, string, string, string]> = {
  purple: ["#6d5bd0", "#5e4bc2", "#503fad", "#f0edff", "#272240"],
  blue: ["#3478d4", "#2869c1", "#2059a7", "#eaf2ff", "#172a42"],
  green: ["#2f8260", "#257252", "#1f6246", "#e8f5ef", "#142c23"],
  orange: ["#c76f2d", "#b46124", "#9b511e", "#fff1e6", "#352313"],
  red: ["#c54c4c", "#b33f3f", "#9c3434", "#ffeded", "#391b1e"],
  neutral: ["#536071", "#465161", "#3a4452", "#eef2f7", "#252d3a"],
};

const neutralRecipeOptions = ["slate", "gray", "mauve", "sage", "olive", "sand"] as const;
const radiusOptions = ["none", "small", "medium", "large", "full"] as const;
const panelOptions = ["flat", "raised"] as const;

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ColorOption({ color, label }: { color: string; label: string }) {
  return (
    <span className="playground-color-option">
      <span
        aria-hidden
        className="playground-color-option__swatch"
        style={{ "--playground-option-color": color } as React.CSSProperties}
      />
      <span>{label}</span>
    </span>
  );
}

function selectHandler<T extends string>(options: readonly T[], onChange: (value: T) => void) {
  return (value: string) => {
    const selected = options.find((option) => option === value);
    if (selected) onChange(selected);
  };
}

const neutralRecipes: Record<
  NeutralRecipe,
  Pick<
    SemanticColors,
    | "subtle"
    | "control"
    | "borderSubtle"
    | "borderDefault"
    | "textPrimary"
    | "textSecondary"
    | "textTertiary"
  >
> = {
  slate: {
    subtle: "rgb(15 23 42 / 0.04)",
    control: "rgb(15 23 42 / 0.06)",
    borderSubtle: "rgb(15 23 42 / 0.06)",
    borderDefault: "rgb(15 23 42 / 0.1)",
    textPrimary: "#172033",
    textSecondary: "#657086",
    textTertiary: "#8993a5",
  },
  gray: {
    subtle: "#f6f6f6",
    control: "#f1f1f1",
    borderSubtle: "#e7e7e7",
    borderDefault: "#d9d9d9",
    textPrimary: "#1f1f1f",
    textSecondary: "#6b6b6b",
    textTertiary: "#8c8c8c",
  },
  mauve: {
    subtle: "#f8f6f8",
    control: "#f2eff3",
    borderSubtle: "#e9e4ea",
    borderDefault: "#ddd6df",
    textPrimary: "#221f22",
    textSecondary: "#746b75",
    textTertiary: "#968e97",
  },
  sage: {
    subtle: "#f5f7f5",
    control: "#eef1ef",
    borderSubtle: "#e1e6e2",
    borderDefault: "#d2d8d4",
    textPrimary: "#1d221f",
    textSecondary: "#667068",
    textTertiary: "#89928b",
  },
  olive: {
    subtle: "#f7f7f3",
    control: "#f0f1e9",
    borderSubtle: "#e5e6dc",
    borderDefault: "#d8d9cc",
    textPrimary: "#21221d",
    textSecondary: "#6e7065",
    textTertiary: "#919287",
  },
  sand: {
    subtle: "#f8f7f4",
    control: "#f2f0eb",
    borderSubtle: "#e8e4dc",
    borderDefault: "#dbd6cc",
    textPrimary: "#24221f",
    textSecondary: "#746f67",
    textTertiary: "#969088",
  },
};

const darkNeutralRecipes: typeof neutralRecipes = {
  slate: {
    subtle: "rgb(255 255 255 / 0.04)",
    control: "rgb(255 255 255 / 0.08)",
    borderSubtle: "rgb(255 255 255 / 0.06)",
    borderDefault: "rgb(255 255 255 / 0.1)",
    textPrimary: "#f4f7fb",
    textSecondary: "#aab4c4",
    textTertiary: "#7f899a",
  },
  gray: {
    subtle: "rgb(255 255 255 / 0.045)",
    control: "rgb(255 255 255 / 0.09)",
    borderSubtle: "rgb(255 255 255 / 0.065)",
    borderDefault: "rgb(255 255 255 / 0.11)",
    textPrimary: "#f5f5f5",
    textSecondary: "#b5b5b5",
    textTertiary: "#858585",
  },
  mauve: {
    subtle: "rgb(249 240 250 / 0.045)",
    control: "rgb(249 240 250 / 0.09)",
    borderSubtle: "rgb(249 240 250 / 0.065)",
    borderDefault: "rgb(249 240 250 / 0.11)",
    textPrimary: "#f7f2f7",
    textSecondary: "#bdb2be",
    textTertiary: "#8e8490",
  },
  sage: {
    subtle: "rgb(236 250 241 / 0.045)",
    control: "rgb(236 250 241 / 0.09)",
    borderSubtle: "rgb(236 250 241 / 0.065)",
    borderDefault: "rgb(236 250 241 / 0.11)",
    textPrimary: "#f0f7f2",
    textSecondary: "#adbbb0",
    textTertiary: "#7f8d82",
  },
  olive: {
    subtle: "rgb(247 248 226 / 0.045)",
    control: "rgb(247 248 226 / 0.09)",
    borderSubtle: "rgb(247 248 226 / 0.065)",
    borderDefault: "rgb(247 248 226 / 0.11)",
    textPrimary: "#f5f6ed",
    textSecondary: "#b8baa9",
    textTertiary: "#898b7b",
  },
  sand: {
    subtle: "rgb(253 245 232 / 0.045)",
    control: "rgb(253 245 232 / 0.09)",
    borderSubtle: "rgb(253 245 232 / 0.065)",
    borderDefault: "rgb(253 245 232 / 0.11)",
    textPrimary: "#f8f4ed",
    textSecondary: "#bdb5aa",
    textTertiary: "#8e867c",
  },
};

function scaled(value: number, scale: number) {
  return `${Math.round(value * scale * 100) / 100}px`;
}

function toStyle(
  colors: SemanticColors,
  scalePercent: number,
  density: Density,
  radius: RadiusPreset,
  motion: MotionPreset,
  panel: PanelStyle,
  isDark: boolean,
): PlaygroundStyle {
  const scale = scalePercent / 100;
  const compact = density === "compact";
  const densityScaled = (compactValue: number, comfortableValue: number) =>
    scaled(compact ? compactValue : comfortableValue, scale);
  const radiusValues: Record<
    RadiusPreset,
    {
      primitive: [number, number, number, number, number, number];
      control: number;
      container: number;
      overlay: number;
      pill: number;
    }
  > = {
    none: { primitive: [0, 0, 0, 0, 0, 0], control: 0, container: 0, overlay: 0, pill: 0 },
    small: {
      primitive: [2, 4, 6, 8, 10, 12],
      control: 4,
      container: 8,
      overlay: 12,
      pill: 4,
    },
    medium: {
      primitive: [4, 6, 8, 10, 14, 18],
      control: 8,
      container: 14,
      overlay: 18,
      pill: 8,
    },
    large: {
      primitive: [4, 8, 10, 12, 20, 24],
      control: 12,
      container: 20,
      overlay: 24,
      pill: 12,
    },
    full: {
      primitive: [4, 8, 12, 16, 28, 32],
      control: 999,
      container: 28,
      overlay: 32,
      pill: 999,
    },
  };
  const { primitive, control, container, overlay, pill } = radiusValues[radius];
  const [xs, sm, md, lg, xl, xxl] = primitive;
  const durations: Record<MotionPreset, [number, number, number]> = {
    reduced: [1, 1, 1],
    calm: [160, 260, 400],
    standard: [140, 220, 360],
  };
  const [fast, normal, slow] = durations[motion];
  return {
    "--n-color-surface-canvas": colors.canvas,
    "--n-color-surface-default": colors.surface,
    "--n-color-surface-control": colors.control,
    "--n-color-surface-control-hover": colors.controlHover,
    "--n-color-surface-control-active": colors.controlActive,
    "--n-color-surface-subtle": colors.subtle,
    "--n-color-surface-sunken": colors.sunken,
    "--n-color-surface-raised": colors.raised,
    "--n-color-surface-overlay": colors.overlay,
    "--n-color-surface-selected": colors.selected,
    "--n-color-surface-muted": colors.subtle,
    "--n-input-background": colors.control,
    "--n-input-background-hover": colors.controlHover,
    "--n-input-background-on-muted": colors.surface,
    "--n-overlay-background": colors.overlay,
    "--n-overlay-border": colors.borderSubtle,
    "--n-overlay-foreground": colors.textPrimary,
    "--n-overlay-foreground-muted": colors.textSecondary,
    "--n-overlay-control-background": colors.control,
    "--n-overlay-control-background-hover": colors.controlHover,
    "--n-overlay-selected-background": colors.selected,
    "--n-overlay-divider": colors.borderSubtle,
    "--n-input-background-on-overlay": colors.control,
    "--n-input-background-on-overlay-hover": colors.controlHover,
    "--n-input-foreground-on-overlay": colors.textPrimary,
    "--n-input-placeholder-on-overlay": colors.textTertiary,
    "--n-color-text-primary": colors.textPrimary,
    "--n-color-text-secondary": colors.textSecondary,
    "--n-color-text-tertiary": colors.textTertiary,
    "--n-color-text-disabled": colors.textDisabled,
    "--n-color-text-inverse": colors.textInverse,
    "--n-color-border-subtle": colors.borderSubtle,
    "--n-color-border-default": colors.borderDefault,
    "--n-color-border-strong": colors.borderStrong,
    "--n-color-border-interactive": colors.borderInteractive,
    "--n-color-border-focus": colors.borderFocus,
    "--n-color-border-danger": colors.borderDanger,
    "--n-color-action-primary": colors.actionPrimary,
    "--n-color-action-primary-hover": colors.actionPrimaryHover,
    "--n-color-action-primary-active": colors.actionPrimaryActive,
    "--n-color-action-on-primary": colors.actionOnPrimary,
    "--n-color-focus-ring": colors.borderFocus,
    "--n-color-status-info": colors.statusInfo,
    "--n-color-status-info-soft": colors.statusInfoSoft,
    "--n-color-status-success": colors.statusSuccess,
    "--n-color-status-success-soft": colors.statusSuccessSoft,
    "--n-color-status-warning": colors.statusWarning,
    "--n-color-status-warning-soft": colors.statusWarningSoft,
    "--n-color-status-danger": colors.statusDanger,
    "--n-color-status-danger-soft": colors.statusDangerSoft,
    "--n-color-status-neutral": colors.statusNeutral,
    "--n-color-status-neutral-soft": colors.statusNeutralSoft,
    "--n-chart-categorical-1": colors.chart1,
    "--n-chart-categorical-2": colors.chart2,
    "--n-chart-categorical-3": colors.chart3,
    "--n-chart-categorical-4": colors.chart4,
    "--n-chart-categorical-5": colors.chart5,
    "--n-card-background": colors.raised,
    "--n-card-background-secondary": colors.subtle,
    "--n-card-background-secondary-hover": colors.controlHover,
    "--n-card-background-interactive-hover": colors.subtle,
    "--n-card-border-color": isDark ? "rgb(255 255 255 / 0.14)" : colors.borderSubtle,
    "--n-card-border-secondary": isDark ? "rgb(255 255 255 / 0.14)" : colors.borderSubtle,
    "--n-card-border-interactive": colors.borderDefault,
    "--n-card-shadow":
      panel === "raised"
        ? "0 1px 2px rgb(31 45 68 / 0.05), 0 8px 24px rgb(31 45 68 / 0.07)"
        : "none",
    "--n-button-background-primary": colors.actionPrimary,
    "--n-button-background-primary-hover": colors.actionPrimaryHover,
    "--n-button-background-primary-active": colors.actionPrimaryActive,
    "--n-button-foreground-primary": colors.actionOnPrimary,
    "--n-button-background-secondary": colors.control,
    "--n-button-background-secondary-hover": colors.controlHover,
    "--n-button-background-secondary-active": colors.controlActive,
    "--n-button-foreground-secondary": colors.textPrimary,
    "--n-button-background-outline-hover": colors.controlHover,
    "--n-button-background-outline-active": colors.controlActive,
    "--n-button-border-outline": colors.borderDefault,
    "--n-button-foreground-outline": colors.textPrimary,
    "--n-button-background-ghost-hover": colors.subtle,
    "--n-button-background-ghost-active": colors.controlActive,
    "--n-button-foreground-ghost": colors.textSecondary,
    "--n-input-placeholder": colors.textTertiary,
    "--n-input-foreground": colors.textPrimary,
    "--n-input-disabled-background": colors.subtle,
    "--n-input-disabled-foreground": colors.textDisabled,
    "--n-input-readonly-background": colors.subtle,
    "--n-input-readonly-border": colors.borderSubtle,
    "--n-input-addon-foreground": colors.textTertiary,
    "--n-alert-background": colors.subtle,
    "--n-alert-title-color": colors.textPrimary,
    "--n-alert-icon-color": colors.statusNeutral,
    "--n-badge-background": colors.subtle,
    "--n-badge-foreground": colors.textSecondary,
    "--n-badge-background-primary-soft": colors.selected,
    "--n-badge-foreground-primary-soft": colors.actionPrimary,
    "--n-badge-background-info": colors.statusInfoSoft,
    "--n-badge-foreground-info": colors.statusInfo,
    "--n-badge-background-success": colors.statusSuccessSoft,
    "--n-badge-foreground-success": colors.statusSuccess,
    "--n-badge-background-warning": colors.statusWarningSoft,
    "--n-badge-foreground-warning": colors.statusWarning,
    "--n-badge-background-danger": colors.statusDangerSoft,
    "--n-badge-foreground-danger": colors.statusDanger,
    "--n-avatar-foreground": colors.textSecondary,
    "--n-progress-label-color": colors.textSecondary,
    "--n-progress-value-color": colors.textSecondary,
    "--n-progress-track-background": colors.subtle,
    "--n-progress-indicator-background": colors.actionPrimary,
    "--n-empty-state-mark-background": colors.selected,
    "--n-empty-state-mark-foreground": colors.actionPrimary,
    "--n-form-group-title-color": colors.textPrimary,
    "--n-form-group-description-color": colors.textTertiary,
    "--n-form-group-message-color": colors.statusDanger,
    "--n-switch-background": colors.control,
    "--n-switch-background-hover": colors.controlHover,
    "--n-switch-background-checked": colors.actionPrimary,
    "--n-switch-background-checked-hover": colors.actionPrimaryHover,
    "--n-switch-background-checked-active": colors.actionPrimaryActive,
    "--n-switch-border": colors.borderSubtle,
    "--n-switch-border-hover": colors.borderInteractive,
    "--n-slider-label-color": colors.textPrimary,
    "--n-slider-value-color": colors.textTertiary,
    "--n-slider-track-background": colors.control,
    "--n-slider-indicator-background": colors.actionPrimary,
    "--n-slider-thumb-border": colors.borderStrong,
    "--n-slider-thumb-border-hover": colors.borderInteractive,
    "--n-item-background-hover": colors.controlHover,
    "--n-item-background-active": colors.controlActive,
    "--n-item-background-selected": colors.control,
    "--n-item-background-soft": colors.subtle,
    "--n-item-border": colors.borderSubtle,
    "--n-item-border-selected": colors.borderSubtle,
    "--n-item-foreground": colors.textPrimary,
    "--n-item-description": colors.textSecondary,
    "--n-item-media-background": colors.control,
    "--n-table-border": colors.borderSubtle,
    "--n-table-container-background": colors.subtle,
    "--n-table-header-foreground": colors.textTertiary,
    "--n-table-row-background-hover": colors.subtle,
    "--n-table-row-background-selected": colors.selected,
    "--n-table-row-selection-indicator": colors.borderDefault,
    "--n-table-cell-foreground-disabled": colors.textDisabled,
    "--n-table-cell-foreground-danger": colors.statusDanger,
    "--n-space-0-5": scaled(2, scale),
    "--n-space-1": scaled(4, scale),
    "--n-space-1-5": scaled(6, scale),
    "--n-space-2": scaled(8, scale),
    "--n-space-2-5": scaled(10, scale),
    "--n-space-3": scaled(12, scale),
    "--n-space-4": scaled(16, scale),
    "--n-space-5": scaled(20, scale),
    "--n-space-6": scaled(24, scale),
    "--n-space-8": scaled(32, scale),
    "--n-space-10": scaled(40, scale),
    "--n-space-12": scaled(48, scale),
    "--n-font-size-2xs": scaled(11, scale),
    "--n-font-size-xs": scaled(12, scale),
    "--n-font-size-sm": scaled(13, scale),
    "--n-font-size-md": scaled(14, scale),
    "--n-font-size-lg": scaled(16, scale),
    "--n-font-size-xl": scaled(18, scale),
    "--n-font-size-2xl": scaled(20, scale),
    "--n-font-size-3xl": scaled(22.5, scale),
    "--n-font-size-4xl": scaled(25.25, scale),
    "--n-font-size-5xl": scaled(28.5, scale),
    "--n-size-control-sm": densityScaled(24, 28),
    "--n-size-control-md": densityScaled(28, 32),
    "--n-size-control-lg": densityScaled(32, 36),
    "--n-density-space-md": densityScaled(8, 12),
    "--n-density-space-lg": densityScaled(12, 16),
    "--n-density-space-xl": densityScaled(16, 20),
    "--n-button-height-sm": densityScaled(24, 28),
    "--n-button-height-md": densityScaled(28, 32),
    "--n-button-height-lg": densityScaled(32, 36),
    "--n-button-padding-inline-md": densityScaled(8, 12),
    "--n-button-padding-inline-lg": densityScaled(12, 16),
    "--n-toggle-height-sm": densityScaled(24, 28),
    "--n-toggle-height-md": densityScaled(28, 32),
    "--n-toggle-height-lg": densityScaled(32, 36),
    "--n-toggle-padding-inline-md": densityScaled(8, 12),
    "--n-icon-button-size-sm": densityScaled(24, 28),
    "--n-icon-button-size-md": densityScaled(28, 32),
    "--n-icon-button-size-lg": densityScaled(32, 36),
    "--n-input-height-sm": densityScaled(24, 28),
    "--n-input-height-md": densityScaled(28, 32),
    "--n-input-height-lg": densityScaled(32, 36),
    "--n-input-padding-inline": densityScaled(8, 12),
    "--n-input-addon-padding-inline": densityScaled(8, 12),
    "--n-select-height-sm": densityScaled(24, 28),
    "--n-select-height-md": densityScaled(28, 32),
    "--n-select-height-lg": densityScaled(32, 36),
    "--n-select-trigger-gap": densityScaled(8, 12),
    "--n-select-item-gap": densityScaled(8, 12),
    "--n-select-item-padding-inline": densityScaled(8, 12),
    "--n-select-group-label-padding-inline": densityScaled(8, 12),
    "--n-select-empty-padding": densityScaled(8, 12),
    "--n-field-gap": densityScaled(4, 6),
    "--n-form-group-gap": densityScaled(8, 12),
    "--n-form-group-inline-gap": densityScaled(12, 16),
    "--n-tabs-trigger-height-sm": densityScaled(24, 28),
    "--n-tabs-trigger-height-md": densityScaled(28, 32),
    "--n-tabs-trigger-height-lg": densityScaled(32, 36),
    "--n-tabs-trigger-padding-inline-md": densityScaled(8, 12),
    "--n-avatar-size-sm": densityScaled(20, 24),
    "--n-avatar-size-md": densityScaled(28, 32),
    "--n-avatar-size-lg": densityScaled(32, 36),
    "--n-badge-height-sm": densityScaled(16, 18),
    "--n-badge-height": densityScaled(22, 24),
    "--n-badge-height-lg": densityScaled(24, 28),
    "--n-spinner-size-sm": densityScaled(12, 14),
    "--n-spinner-size-md": densityScaled(14, 16),
    "--n-spinner-size-lg": densityScaled(18, 20),
    "--n-card-padding-md": densityScaled(20, 24),
    "--n-card-padding": densityScaled(20, 24),
    "--n-card-padding-inline": densityScaled(20, 24),
    "--n-card-padding-block": densityScaled(20, 24),
    "--n-card-gap": densityScaled(12, 16),
    "--n-alert-gap": densityScaled(8, 12),
    "--n-alert-padding": densityScaled(12, 16),
    "--n-alert-list-padding-inline": densityScaled(12, 16),
    "--n-progress-height": densityScaled(6, 8),
    "--n-skeleton-height": densityScaled(14, 16),
    "--n-empty-state-mark-size": densityScaled(28, 32),
    "--n-item-gap": densityScaled(8, 12),
    "--n-item-gap-lg": densityScaled(12, 16),
    "--n-item-padding-sm": densityScaled(6, 8),
    "--n-item-padding-md": densityScaled(8, 12),
    "--n-item-padding-lg": densityScaled(12, 16),
    "--n-item-padding": densityScaled(8, 12),
    "--n-list-item-padding": densityScaled(6, 8),
    "--n-pagination-item-size": densityScaled(28, 32),
    "--n-command-input-height": densityScaled(32, 36),
    "--n-command-item-height": densityScaled(32, 36),
    "--n-command-item-padding-block": densityScaled(6, 8),
    "--n-command-item-padding-inline": densityScaled(8, 12),
    "--n-table-row-min-height": densityScaled(36, 44),
    "--n-table-cell-padding-y": densityScaled(8, 12),
    "--n-table-cell-padding-x": densityScaled(8, 12),
    "--n-table-cell-padding": `${densityScaled(8, 12)} ${densityScaled(8, 12)}`,
    "--n-calendar-cell-size": densityScaled(28, 32),
    "--n-calendar-padding": densityScaled(8, 16),
    "--n-calendar-header-gap": densityScaled(8, 12),
    "--n-calendar-grid-gap": densityScaled(8, 12),
    "--n-dialog-padding": densityScaled(20, 24),
    "--n-dialog-viewport-inset": densityScaled(12, 16),
    "--n-dialog-header-gap": densityScaled(12, 16),
    "--n-dialog-header-margin": densityScaled(12, 16),
    "--n-dialog-body-gap": densityScaled(12, 16),
    "--n-sheet-padding": densityScaled(20, 24),
    "--n-sheet-gap": densityScaled(12, 16),
    "--n-sheet-viewport-inset": densityScaled(12, 16),
    "--n-sheet-transition-distance": densityScaled(12, 16),
    "--n-checkbox-size": densityScaled(14, 16),
    "--n-radio-size": densityScaled(14, 16),
    "--n-radio-dot-size": densityScaled(5, 6),
    "--n-switch-height": scaled(20, scale),
    "--n-switch-width": densityScaled(30, 34),
    "--n-switch-thumb-size": densityScaled(14, 16),
    "--n-switch-thumb-offset": densityScaled(12, 14),
    "--n-switch-padding": scaled(1, scale),
    "--n-switch-field-gap": densityScaled(8, 12),
    "--n-slider-control-size": densityScaled(28, 32),
    "--n-slider-thumb-size": densityScaled(14, 16),
    "--n-slider-header-gap": densityScaled(8, 16),
    "--n-sidebar-region-padding": densityScaled(12, 20),
    "--n-sidebar-inset-gap": densityScaled(12, 24),
    "--n-sidebar-rail-hit-area": densityScaled(28, 32),
    "--n-command-group-spacing": densityScaled(4, 8),
    "--n-command-state-padding": densityScaled(16, 20),
    "--n-radius-xs": `${xs}px`,
    "--n-radius-sm": `${sm}px`,
    "--n-radius-md": `${md}px`,
    "--n-radius-lg": `${lg}px`,
    "--n-radius-xl": `${xl}px`,
    "--n-radius-2xl": `${xxl}px`,
    "--n-radius-control": `${control}px`,
    "--n-radius-container": `${container}px`,
    "--n-radius-overlay": `${overlay}px`,
    "--n-radius-pill": `${pill}px`,
    "--n-alert-radius": `${container}px`,
    "--n-avatar-radius": `${pill}px`,
    "--n-badge-radius": `${pill}px`,
    "--n-button-radius": `${control}px`,
    "--n-icon-button-radius": `${control}px`,
    "--n-toggle-radius": `${control}px`,
    "--n-input-radius": `${control}px`,
    "--n-pagination-radius": `${control}px`,
    "--n-calendar-radius": `${container}px`,
    "--n-calendar-day-radius": `${control}px`,
    "--n-card-radius": `${container}px`,
    "--n-checkbox-radius": `${Math.min(xs, 4)}px`,
    "--n-command-radius": `${Math.min(xxl, 24)}px`,
    "--n-command-item-radius": `${md}px`,
    "--n-dropdown-radius": `${lg}px`,
    "--n-empty-state-mark-radius": `${md}px`,
    "--n-item-radius": `${md}px`,
    "--n-item-media-radius": `${sm}px`,
    "--n-kbd-radius": `${sm}px`,
    "--n-list-item-radius": `${lg}px`,
    "--n-popover-radius": `${lg}px`,
    "--n-progress-radius": `${pill}px`,
    "--n-radio-radius": `${pill}px`,
    "--n-select-popup-radius": `${md}px`,
    "--n-sheet-radius": `${overlay}px`,
    "--n-sidebar-control-radius": `${control}px`,
    "--n-slider-track-radius": `${pill}px`,
    "--n-slider-thumb-radius": `${pill}px`,
    "--n-switch-radius": `${pill}px`,
    "--n-switch-thumb-radius": `${pill}px`,
    "--n-table-container-radius": `${lg}px`,
    "--n-table-row-group-radius": `${md}px`,
    "--n-tabs-radius": `${control}px`,
    "--n-tabs-list-radius": `${control}px`,
    "--n-toast-radius": `${Math.min(overlay, 20)}px`,
    "--n-toast-status-indicator-radius": `${md}px`,
    "--n-tooltip-radius": `${lg}px`,
    "--n-duration-fast": `${fast}ms`,
    "--n-duration-normal": `${normal}ms`,
    "--n-duration-slow": `${slow}ms`,
    "--n-shadow-surface-raised":
      panel === "raised"
        ? "0 1px 2px rgb(31 45 68 / 0.05), 0 8px 24px rgb(31 45 68 / 0.07)"
        : "none",
    "--n-shadow-surface-floating":
      panel === "raised"
        ? "0 4px 12px rgb(31 45 68 / 0.08), 0 24px 64px rgb(31 45 68 / 0.14)"
        : "none",
  };
}

export function VisualPlayground() {
  const [theme, setTheme] = React.useState<Theme>("purple");
  const [appearanceMode, setAppearanceMode] = React.useState<"light" | "dark" | "system" | null>(
    null,
  );
  const [systemDark, setSystemDark] = React.useState(false);
  const [density, setDensity] = React.useState<Density>("comfortable");
  const [neutral, setNeutral] = React.useState<NeutralRecipe>("slate");
  const [radius, setRadius] = React.useState<RadiusPreset>("full");
  const [panel, setPanel] = React.useState<PanelStyle>("raised");
  const [lightColors, setLightColors] = React.useState(lightDefaults);
  const [darkColors, setDarkColors] = React.useState(darkDefaults);
  const playgroundRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const root = document.documentElement;
    const updateSystem = () => setSystemDark(query.matches);
    const updateAppearance = () => {
      const nextMode = root.dataset.mode;
      setAppearanceMode(
        nextMode === "light" || nextMode === "dark" || nextMode === "system" ? nextMode : "system",
      );
    };
    const observer = new MutationObserver(updateAppearance);

    updateSystem();
    updateAppearance();
    query.addEventListener("change", updateSystem);
    observer.observe(root, { attributeFilter: ["data-mode"], attributes: true });

    return () => {
      query.removeEventListener("change", updateSystem);
      observer.disconnect();
    };
  }, []);

  const resolvedMode =
    appearanceMode === null
      ? null
      : appearanceMode === "system"
        ? systemDark
          ? "dark"
          : "light"
        : appearanceMode;
  const colors = resolvedMode === "dark" ? darkColors : lightColors;
  const style =
    resolvedMode === null
      ? undefined
      : toStyle(colors, 100, density, radius, "calm", panel, resolvedMode === "dark");

  React.useEffect(() => {
    const playground = playgroundRef.current;
    if (!playground || !resolvedMode || !style) return;

    let portalIntentUntil = 0;
    const registerPortalIntent = () => {
      portalIntentUntil = Date.now() + 1_000;
    };
    const applyPortalTheme = (portal: HTMLElement) => {
      portal.dataset.playgroundPortal = "";
      portal.dataset.theme = theme;
      portal.dataset.mode = resolvedMode;
      portal.dataset.density = density;
      Object.entries(style).forEach(([property, value]) => {
        portal.style.setProperty(property, String(value));
      });
    };
    document
      .querySelectorAll<HTMLElement>(
        '[data-playground-portal], .n-toast-viewport[data-slot="viewport"]',
      )
      .forEach(applyPortalTheme);

    const observer = new MutationObserver((mutations) => {
      if (Date.now() > portalIntentUntil) return;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const portal = node.parentElement === document.body ? node : node.closest("body > div");
          if (portal instanceof HTMLElement) applyPortalTheme(portal);
        });
      });
    });
    observer.observe(document.body, { childList: true });
    playground.addEventListener("pointerdown", registerPortalIntent, true);
    playground.addEventListener("focusin", registerPortalIntent, true);
    playground.addEventListener("keydown", registerPortalIntent, true);

    return () => {
      observer.disconnect();
      playground.removeEventListener("pointerdown", registerPortalIntent, true);
      playground.removeEventListener("focusin", registerPortalIntent, true);
      playground.removeEventListener("keydown", registerPortalIntent, true);
      document.querySelectorAll<HTMLElement>("[data-playground-portal]").forEach((portal) => {
        delete portal.dataset.playgroundPortal;
        delete portal.dataset.theme;
        delete portal.dataset.mode;
        delete portal.dataset.density;
        Object.keys(style).forEach((property) => portal.style.removeProperty(property));
      });
    };
  }, [density, resolvedMode, style, theme]);

  const applyTheme = (nextTheme: Theme) => {
    const [accent, hover, active] = themeAccents[nextTheme];
    setTheme(nextTheme);
    setLightColors((current) => ({
      ...current,
      actionPrimary: accent,
      actionPrimaryHover: hover,
      actionPrimaryActive: active,
      borderFocus: accent,
      chart1: accent,
    }));
    setDarkColors((current) => ({
      ...current,
      actionPrimary: accent,
      actionPrimaryHover: hover,
      actionPrimaryActive: active,
      borderFocus: accent,
      chart1: accent,
    }));
  };

  const applyNeutral = (nextNeutral: NeutralRecipe) => {
    setNeutral(nextNeutral);
    setLightColors((current) => ({
      ...current,
      ...neutralRecipes[nextNeutral],
      controlHover: neutralRecipes[nextNeutral].borderSubtle,
      controlActive: neutralRecipes[nextNeutral].borderDefault,
      sunken: neutralRecipes[nextNeutral].control,
      statusNeutral: neutralRecipes[nextNeutral].textSecondary,
      statusNeutralSoft: neutralRecipes[nextNeutral].control,
    }));
    setDarkColors((current) => ({
      ...current,
      ...darkNeutralRecipes[nextNeutral],
      controlHover: darkNeutralRecipes[nextNeutral].borderSubtle,
      controlActive: darkNeutralRecipes[nextNeutral].borderDefault,
      sunken: darkNeutralRecipes[nextNeutral].control,
      statusNeutral: darkNeutralRecipes[nextNeutral].textSecondary,
      statusNeutralSoft: darkNeutralRecipes[nextNeutral].control,
    }));
  };

  const reset = () => {
    setTheme("purple");
    setDensity("comfortable");
    setNeutral("slate");
    setRadius("full");
    setPanel("raised");
    setLightColors(lightDefaults);
    setDarkColors(darkDefaults);
  };

  const isCustomized =
    theme !== "purple" ||
    density !== "comfortable" ||
    neutral !== "slate" ||
    radius !== "full" ||
    panel !== "raised";

  return (
    <ToastProvider>
      <div
        ref={playgroundRef}
        className={`visual-playground visual-playground--lab ${styles.root}`}
        data-theme={theme}
        data-mode={resolvedMode}
        data-density={density}
        style={style}
      >
        <div className="visual-playground__workspace visual-playground__workspace--radix">
          <section
            aria-label="Nerio scenario canvas"
            className="playground-canvas playground-canvas--catalog"
            tabIndex={0}
          >
            <div className="playground-sr-only">
              <h1>Playground</h1>
              <p>Chart aliases remain token-only; there is no Chart component in Core.</p>
            </div>
            <div className="playground-canvas__surface">
              <PlaygroundShowcase />
            </div>
          </section>

          <Card
            id="playground-theme-settings"
            as="div"
            role="complementary"
            className="playground-settings playground-settings--radix"
            aria-label="Theme settings"
          >
            <CardContent className="playground-settings__body">
              <Select
                label="Accent color"
                value={theme}
                options={themes.map((value) => ({
                  label: <ColorOption color={themeAccents[value][0]} label={titleCase(value)} />,
                  textValue: titleCase(value),
                  value,
                }))}
                onValueChange={selectHandler(themes, applyTheme)}
              />
              <Select
                label="Neutral color"
                value={neutral}
                options={neutralRecipeOptions.map((value) => ({
                  label: (
                    <ColorOption
                      color={neutralRecipes[value].textSecondary}
                      label={titleCase(value)}
                    />
                  ),
                  textValue: titleCase(value),
                  value,
                }))}
                onValueChange={selectHandler(neutralRecipeOptions, applyNeutral)}
              />
              <Select
                label="Density"
                value={density}
                options={densities.map((value) => ({ label: titleCase(value), value }))}
                onValueChange={selectHandler(densities, setDensity)}
              />
              <Select
                label="Radii"
                value={radius}
                options={radiusOptions.map((value) => ({ label: titleCase(value), value }))}
                onValueChange={selectHandler(radiusOptions, setRadius)}
              />
              <Select
                label="Panel style"
                value={panel}
                options={panelOptions.map((value) => ({ label: titleCase(value), value }))}
                onValueChange={selectHandler(panelOptions, setPanel)}
              />
            </CardContent>
            {isCustomized ? (
              <CardFooter className="playground-settings__actions">
                <Button size="sm" variant="secondary" onClick={reset}>
                  Reset
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        </div>
      </div>
      <ToastViewport swipeDirection={["left", "right", "up", "down"]} />
    </ToastProvider>
  );
}
