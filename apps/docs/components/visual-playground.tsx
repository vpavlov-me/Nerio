"use client";

import * as React from "react";
import { Check, Copy, Palette } from "@nerio-ui/adapters/icons";
import { densities, modes, themes } from "@nerio-ui/tokens";
import { Badge, Button, Icon, ToastProvider, ToastViewport } from "@nerio-ui/ui/client";
import { ComponentPlayground } from "./component-playground-specimens";

type Theme = (typeof themes)[number];
type Mode = (typeof modes)[number];
type Density = (typeof densities)[number];
type NeutralRecipe = "slate" | "gray" | "mauve" | "sage" | "olive" | "sand";
type RadiusPreset = "none" | "small" | "medium" | "large" | "full";
type MotionPreset = "reduced" | "calm" | "standard";
type PanelStyle = "flat" | "raised";
type SettingsView = "theme" | "colors";
type PlaygroundStyle = React.CSSProperties & Record<`--${string}`, string | number>;

const playgroundModes = [modes[1], modes[2], modes[0]] as const;

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

type ColorKey = keyof SemanticColors;

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

const colorGroups: Array<{ label: string; colors: Array<[ColorKey, string]> }> = [
  {
    label: "Surfaces",
    colors: [
      ["canvas", "Canvas"],
      ["surface", "Default"],
      ["control", "Control"],
      ["controlHover", "Control hover"],
      ["controlActive", "Control active"],
      ["subtle", "Subtle"],
      ["sunken", "Sunken"],
      ["raised", "Raised"],
      ["overlay", "Overlay"],
      ["selected", "Selected"],
    ],
  },
  {
    label: "Text",
    colors: [
      ["textPrimary", "Primary"],
      ["textSecondary", "Secondary"],
      ["textTertiary", "Tertiary"],
      ["textDisabled", "Disabled"],
      ["textInverse", "Inverse"],
    ],
  },
  {
    label: "Borders",
    colors: [
      ["borderSubtle", "Subtle"],
      ["borderDefault", "Default"],
      ["borderStrong", "Strong"],
      ["borderInteractive", "Interactive"],
      ["borderFocus", "Focus"],
      ["borderDanger", "Danger"],
    ],
  },
  {
    label: "Action",
    colors: [
      ["actionPrimary", "Primary"],
      ["actionPrimaryHover", "Hover"],
      ["actionPrimaryActive", "Active"],
      ["actionOnPrimary", "On primary"],
    ],
  },
  {
    label: "Status",
    colors: [
      ["statusInfo", "Info"],
      ["statusInfoSoft", "Info soft"],
      ["statusSuccess", "Success"],
      ["statusSuccessSoft", "Success soft"],
      ["statusWarning", "Warning"],
      ["statusWarningSoft", "Warning soft"],
      ["statusDanger", "Danger"],
      ["statusDangerSoft", "Danger soft"],
      ["statusNeutral", "Neutral"],
      ["statusNeutralSoft", "Neutral soft"],
    ],
  },
  {
    label: "Chart aliases (tokens only)",
    colors: [
      ["chart1", "Categorical 1"],
      ["chart2", "Categorical 2"],
      ["chart3", "Categorical 3"],
      ["chart4", "Categorical 4"],
      ["chart5", "Categorical 5"],
    ],
  },
];

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
): PlaygroundStyle {
  const scale = scalePercent / 100;
  const compact = density === "compact";
  const radiusValues: Record<RadiusPreset, [number, number, number, number, number, number]> = {
    none: [0, 0, 0, 0, 0, 0],
    small: [4, 6, 8, 10, 12, 14],
    medium: [6, 8, 12, 16, 20, 24],
    large: [8, 12, 16, 20, 24, 28],
    full: [8, 12, 16, 20, 28, 32],
  };
  const [xs, sm, md, lg, xl, xxl] = radiusValues[radius];
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
    "--n-table-container-background": colors.subtle,
    "--n-overlay-background": "rgb(0 0 0 / 0.88)",
    "--n-overlay-foreground": "#ffffff",
    "--n-overlay-foreground-muted": "#cbd5e1",
    "--n-overlay-control-background": "rgb(255 255 255 / 0.1)",
    "--n-overlay-control-background-hover": "rgb(255 255 255 / 0.14)",
    "--n-overlay-selected-background": "rgb(255 255 255 / 0.12)",
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
    "--n-font-size-3xl": scaled(24, scale),
    "--n-size-control-sm": scaled(compact ? 24 : 28, scale),
    "--n-size-control-md": scaled(compact ? 28 : 32, scale),
    "--n-size-control-lg": scaled(compact ? 32 : 36, scale),
    "--n-density-space-md": scaled(compact ? 10 : 12, scale),
    "--n-density-space-lg": scaled(compact ? 14 : 16, scale),
    "--n-density-space-xl": scaled(compact ? 16 : 20, scale),
    "--n-button-height-sm": scaled(compact ? 24 : 28, scale),
    "--n-button-height-md": scaled(compact ? 28 : 32, scale),
    "--n-button-height-lg": scaled(compact ? 32 : 36, scale),
    "--n-icon-button-size-sm": scaled(compact ? 24 : 28, scale),
    "--n-icon-button-size-md": scaled(compact ? 28 : 32, scale),
    "--n-icon-button-size-lg": scaled(compact ? 32 : 36, scale),
    "--n-input-height-sm": scaled(compact ? 24 : 28, scale),
    "--n-input-height-md": scaled(compact ? 28 : 32, scale),
    "--n-input-height-lg": scaled(compact ? 32 : 36, scale),
    "--n-select-height-sm": scaled(compact ? 24 : 28, scale),
    "--n-select-height-md": scaled(compact ? 28 : 32, scale),
    "--n-select-height-lg": scaled(compact ? 32 : 36, scale),
    "--n-tabs-trigger-height-sm": scaled(compact ? 24 : 28, scale),
    "--n-tabs-trigger-height-md": scaled(compact ? 28 : 32, scale),
    "--n-tabs-trigger-height-lg": scaled(compact ? 32 : 36, scale),
    "--n-avatar-size-sm": scaled(compact ? 20 : 24, scale),
    "--n-avatar-size-md": scaled(compact ? 28 : 32, scale),
    "--n-avatar-size-lg": scaled(compact ? 32 : 36, scale),
    "--n-badge-height-sm": scaled(compact ? 16 : 18, scale),
    "--n-badge-height": scaled(compact ? 22 : 24, scale),
    "--n-badge-height-lg": scaled(compact ? 24 : 28, scale),
    "--n-spinner-size-sm": scaled(compact ? 12 : 14, scale),
    "--n-spinner-size-md": scaled(compact ? 14 : 16, scale),
    "--n-spinner-size-lg": scaled(compact ? 18 : 20, scale),
    "--n-pagination-item-size": scaled(compact ? 28 : 32, scale),
    "--n-command-input-height": scaled(compact ? 32 : 36, scale),
    "--n-command-item-height": scaled(compact ? 32 : 36, scale),
    "--n-table-row-min-height": scaled(compact ? 36 : 44, scale),
    "--n-checkbox-size": scaled(compact ? 14 : 16, scale),
    "--n-radio-size": scaled(compact ? 14 : 16, scale),
    "--n-switch-height": scaled(20, scale),
    "--n-switch-width": scaled(compact ? 30 : 34, scale),
    "--n-radius-xs": `${xs}px`,
    "--n-radius-sm": `${sm}px`,
    "--n-radius-md": `${md}px`,
    "--n-radius-lg": `${lg}px`,
    "--n-radius-xl": `${xl}px`,
    "--n-radius-2xl": `${xxl}px`,
    "--n-radius-control": `${lg}px`,
    "--n-radius-container": `${xl}px`,
    "--n-radius-overlay": `${xxl}px`,
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

function toCss(style: PlaygroundStyle) {
  return `:root {\n${Object.entries(style)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")}\n}`;
}

function colorPickerValue(value: string) {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;

  const channels = value.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)/i);
  if (!channels) return "#000000";

  return `#${channels
    .slice(1, 4)
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="playground-color-control">
      <span>{label}</span>
      <span className="playground-color-control__input">
        <input
          className="playground-color-control__picker"
          type="color"
          value={colorPickerValue(value)}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className="playground-color-control__hex"
          type="text"
          aria-label={`${label} CSS color value`}
          value={value}
          spellCheck={false}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (/^#[0-9a-fA-F]{6}$/.test(nextValue) || /^rgb\(.+\)$/.test(nextValue)) {
              onChange(nextValue.toLowerCase());
            }
          }}
        />
      </span>
    </label>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="playground-segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          data-active={value === option || undefined}
          onClick={() => onChange(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}

export function VisualPlayground() {
  const [theme, setTheme] = React.useState<Theme>("purple");
  const [mode, setMode] = React.useState<Mode>("light");
  const [systemDark, setSystemDark] = React.useState(false);
  const [density, setDensity] = React.useState<Density>("comfortable");
  const [neutral, setNeutral] = React.useState<NeutralRecipe>("slate");
  const [radius, setRadius] = React.useState<RadiusPreset>("full");
  const [scale, setScale] = React.useState(100);
  const [motion, setMotion] = React.useState<MotionPreset>("calm");
  const [panel, setPanel] = React.useState<PanelStyle>("flat");
  const [settingsView, setSettingsView] = React.useState<SettingsView>("theme");
  const [lightColors, setLightColors] = React.useState(lightDefaults);
  const [darkColors, setDarkColors] = React.useState(darkDefaults);
  const [copyState, setCopyState] = React.useState("Copy theme");

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const resolvedMode = mode === "system" ? (systemDark ? "dark" : "light") : mode;
  const colors = resolvedMode === "dark" ? darkColors : lightColors;
  const style = toStyle(colors, scale, density, radius, motion, panel);

  const updateColor = (key: ColorKey, value: string) => {
    const setter = resolvedMode === "dark" ? setDarkColors : setLightColors;
    setter((current) => ({ ...current, [key]: value }));
  };

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
  };

  const copyCss = async () => {
    await navigator.clipboard.writeText(toCss(style));
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy theme"), 1600);
  };

  const reset = () => {
    setTheme("purple");
    setMode("light");
    setDensity("comfortable");
    setNeutral("slate");
    setRadius("full");
    setScale(100);
    setMotion("calm");
    setPanel("flat");
    setLightColors(lightDefaults);
    setDarkColors(darkDefaults);
  };

  return (
    <ToastProvider>
      <div
        className="visual-playground visual-playground--lab"
        data-theme={theme}
        data-mode={resolvedMode}
        data-density={density}
        style={style}
      >
        <header className="visual-playground__intro">
          <div>
            <span className="visual-playground__kicker">Core component laboratory</span>
            <h1>Nerio Playground</h1>
            <p>
              Every implemented Core component, organized by its public visual API. Tune the system
              globally, then inspect variants, sizes, states, and interactive behavior in place.
            </p>
          </div>
          <Badge tone="neutral">Core alpha workbench</Badge>
        </header>
        <div className="visual-playground__workspace visual-playground__workspace--radix">
          <main className="playground-canvas playground-canvas--catalog">
            <ComponentPlayground />
          </main>

          <aside
            className="playground-settings playground-settings--radix"
            aria-label="Theme settings"
          >
            <div className="playground-settings__heading">
              <div>
                <span>Live settings</span>
                <h2>Theme</h2>
              </div>
              <Icon icon={Palette} aria-hidden />
            </div>
            <Segmented
              label="Settings view"
              value={settingsView}
              options={["theme", "colors"] as const}
              onChange={setSettingsView}
            />
            {settingsView === "theme" ? (
              <>
                <div className="playground-settings__group">
                  <h3>Accent color</h3>
                  <div
                    className="playground-swatch-options"
                    role="radiogroup"
                    aria-label="Accent color"
                  >
                    {themes.map((name) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={theme === name}
                        aria-label={name}
                        key={name}
                        data-active={theme === name || undefined}
                        style={{ "--playground-swatch": themeAccents[name][0] } as PlaygroundStyle}
                        onClick={() => applyTheme(name)}
                      />
                    ))}
                  </div>
                </div>
                <div className="playground-settings__group">
                  <h3>Neutral recipe</h3>
                  <div
                    className="playground-swatch-options playground-swatch-options--neutral"
                    role="radiogroup"
                    aria-label="Neutral recipe"
                  >
                    {(Object.keys(neutralRecipes) as NeutralRecipe[]).map((name) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={neutral === name}
                        aria-label={name}
                        key={name}
                        data-active={neutral === name || undefined}
                        style={
                          {
                            "--playground-swatch": neutralRecipes[name].textSecondary,
                          } as PlaygroundStyle
                        }
                        onClick={() => applyNeutral(name)}
                      />
                    ))}
                  </div>
                </div>
                <div className="playground-settings__group">
                  <h3>Appearance</h3>
                  <Segmented
                    label="Appearance"
                    value={mode}
                    options={playgroundModes}
                    onChange={setMode}
                  />
                </div>
                <div className="playground-settings__group">
                  <h3>Density</h3>
                  <Segmented
                    label="Density"
                    value={density}
                    options={densities}
                    onChange={setDensity}
                  />
                </div>
                <div className="playground-settings__group">
                  <h3>Radius</h3>
                  <div className="playground-radius-options" role="radiogroup" aria-label="Radius">
                    {(["none", "small", "medium", "large", "full"] as RadiusPreset[]).map(
                      (value) => (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={radius === value}
                          key={value}
                          data-active={radius === value || undefined}
                          onClick={() => setRadius(value)}
                        >
                          <span data-radius={value} />
                          <small>{value}</small>
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <div className="playground-settings__group">
                  <h3>Scaling</h3>
                  <div className="playground-scale-options" role="radiogroup" aria-label="Scaling">
                    {[90, 95, 100, 105, 110].map((value) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={scale === value}
                        key={value}
                        data-active={scale === value || undefined}
                        onClick={() => setScale(value)}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>
                <div className="playground-settings__group">
                  <h3>Motion</h3>
                  <Segmented
                    label="Motion"
                    value={motion}
                    options={["reduced", "calm", "standard"] as const}
                    onChange={setMotion}
                  />
                </div>
                <div className="playground-settings__group">
                  <h3>Panel style</h3>
                  <Segmented
                    label="Panel style"
                    value={panel}
                    options={["flat", "raised"] as const}
                    onChange={setPanel}
                  />
                </div>
              </>
            ) : (
              <div className="playground-color-groups">
                <p className="playground-settings__note">
                  Editing {resolvedMode} values. Chart colors are foundation aliases only; there is
                  no Chart component in Core. Transient overlays use the shared inverted black-glass
                  recipe rather than the flat surface aliases below.
                </p>
                {colorGroups.map((group) => (
                  <details
                    key={group.label}
                    open={group.label === "Surfaces" || group.label === "Text"}
                  >
                    <summary>
                      {group.label}
                      <span>{group.colors.length}</span>
                    </summary>
                    <div>
                      {group.colors.map(([key, label]) => (
                        <ColorControl
                          key={key}
                          label={label}
                          value={colors[key]}
                          onChange={(value) => updateColor(key, value)}
                        />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            )}
            <div className="playground-settings__actions">
              <Button size="sm" variant="secondary" onClick={reset}>
                Reset
              </Button>
              <Button
                size="sm"
                leadingIcon={copyState === "Copied" ? Check : Copy}
                onClick={copyCss}
              >
                {copyState}
              </Button>
            </div>
          </aside>
        </div>
      </div>
      <ToastViewport swipeDirection={["left", "right", "up", "down"]} />
    </ToastProvider>
  );
}
