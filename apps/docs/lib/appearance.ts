import { densities, modes, themes } from "@nerio/tokens";
import type { NerioDensity, NerioMode, NerioPresetTheme } from "@nerio/tokens";

export const appearanceStorageKeys = {
  theme: "nerio-docs-theme",
  mode: "nerio-docs-mode",
  density: "nerio-docs-density",
} as const;

export const defaultAppearance = {
  theme: "purple",
  mode: "system",
  density: "comfortable",
} as const satisfies {
  theme: NerioPresetTheme;
  mode: NerioMode;
  density: NerioDensity;
};

export type Appearance = {
  theme: NerioPresetTheme;
  mode: NerioMode;
  density: NerioDensity;
};

function includesValue<const Values extends readonly string[]>(
  values: Values,
  value: string | null,
): value is Values[number] {
  return value !== null && values.some((candidate) => candidate === value);
}

export function readAppearanceFromRoot(root: HTMLElement): Appearance {
  const theme = root.getAttribute("data-theme");
  const mode = root.getAttribute("data-mode");
  const density = root.getAttribute("data-density");

  return {
    theme: includesValue(themes, theme) ? theme : defaultAppearance.theme,
    mode: includesValue(modes, mode) ? mode : defaultAppearance.mode,
    density: includesValue(densities, density) ? density : defaultAppearance.density,
  };
}

export function persistAppearanceAxis<Axis extends keyof Appearance>(
  root: HTMLElement,
  axis: Axis,
  value: Appearance[Axis],
) {
  root.setAttribute(`data-${axis}`, value);
  try {
    window.localStorage.setItem(appearanceStorageKeys[axis], value);
  } catch {
    // The selected value still applies for this session when storage is unavailable.
  }
}

export function createAppearanceInitializationScript() {
  return `(() => {
    const root = document.documentElement;
    const contracts = ${JSON.stringify({
      theme: { values: themes, fallback: defaultAppearance.theme, attribute: "data-theme" },
      mode: { values: modes, fallback: defaultAppearance.mode, attribute: "data-mode" },
      density: {
        values: densities,
        fallback: defaultAppearance.density,
        attribute: "data-density",
      },
    })};
    const storageKeys = ${JSON.stringify(appearanceStorageKeys)};
    for (const axis of Object.keys(contracts)) {
      const contract = contracts[axis];
      let stored = null;
      try { stored = window.localStorage.getItem(storageKeys[axis]); } catch {}
      root.setAttribute(
        contract.attribute,
        contract.values.includes(stored) ? stored : contract.fallback,
      );
    }
  })();`;
}
