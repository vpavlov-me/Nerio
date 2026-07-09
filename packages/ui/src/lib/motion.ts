export const motionClasses = {
  hover: "n-motion-hover",
  press: "n-motion-press",
  focus: "n-motion-focus",
  overlayEnter: "n-motion-overlay-enter",
  overlayExit: "n-motion-overlay-exit",
  disclosure: "n-motion-disclosure",
  tabIndicator: "n-motion-tab-indicator",
  toastEnter: "n-motion-toast-enter",
  toastExit: "n-motion-toast-exit",
  skeleton: "n-motion-skeleton",
} as const;

export type MotionClassName = (typeof motionClasses)[keyof typeof motionClasses];
