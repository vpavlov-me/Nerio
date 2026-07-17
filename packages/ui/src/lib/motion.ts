export const motionClasses = {
  hover:
    "transition-[background-color,border-color,color,opacity] duration-(--n-motion-hover-duration) ease-(--n-motion-hover-easing)",
  press:
    "transition-[background-color,border-color,color,opacity,scale] duration-(--n-motion-hover-duration) ease-(--n-motion-hover-easing) [&:active:not(:disabled):not([data-disabled])]:scale-(--n-motion-scale-subtle) motion-reduce:[&:active:not(:disabled):not([data-disabled])]:scale-100",
  focus:
    "transition-[border-color,box-shadow,outline-color] duration-(--n-motion-focus-duration) ease-(--n-motion-focus-easing)",
  overlayEnter:
    "animate-[n-overlay-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:animate-[n-overlay-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:animate-[n-fade-only_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] motion-reduce:data-ending-style:animate-[n-fade-only_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)]",
  overlayExit:
    "animate-[n-overlay-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:animate-[n-fade-only_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)]",
  disclosure:
    "transition-[block-size,opacity] duration-(--n-motion-reveal-duration) ease-(--n-motion-reveal-easing)",
  tabIndicator:
    "transition-[inline-size,transform] duration-(--n-motion-hover-duration) ease-(--n-motion-hover-easing)",
  toastEnter:
    "animate-[n-toast-enter_var(--n-motion-reveal-duration)_var(--n-motion-reveal-easing)] motion-reduce:animate-[n-fade-only_var(--n-motion-reveal-duration)_var(--n-motion-reveal-easing)]",
  toastExit:
    "animate-[n-toast-exit_var(--n-motion-collapse-duration)_var(--n-motion-collapse-easing)] motion-reduce:animate-[n-fade-only_var(--n-motion-collapse-duration)_var(--n-motion-collapse-easing)]",
  skeleton:
    "animate-[n-pulse_var(--n-skeleton-duration)_var(--n-easing-standard)_infinite] motion-reduce:animate-none motion-reduce:opacity-(--n-opacity-skeleton)",
} as const;

export type MotionClassName = (typeof motionClasses)[keyof typeof motionClasses];
