import { Easing } from "remotion";

export const nerioEase = Easing.bezier(0.16, 1, 0.3, 1);
export const nerioExitEase = Easing.bezier(0.7, 0, 0.84, 0);

export const transitionFrames = {
  wide: 15,
  vertical: 12,
  square: 10,
} as const;
