"use client";

import { useSyncExternalStore, type PropsWithChildren } from "react";
import { MotionConfig, type Transition, type Variants } from "motion/react";

const motionDurations = {
  instant: 0.08,
  fast: 0.14,
  normal: 0.22,
  slow: 0.36,
} as const;

const motionEasings = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  expressive: [0.16, 1, 0.3, 1],
} as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function useNerioReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

export const motionTransitions = {
  instant: { type: "tween", duration: motionDurations.instant, ease: motionEasings.standard },
  fast: { type: "tween", duration: motionDurations.fast, ease: motionEasings.standard },
  normal: { type: "tween", duration: motionDurations.normal, ease: motionEasings.standard },
  slow: { type: "tween", duration: motionDurations.slow, ease: motionEasings.expressive },
  enter: { type: "tween", duration: motionDurations.normal, ease: motionEasings.enter },
  exit: { type: "tween", duration: motionDurations.fast, ease: motionEasings.exit },
  expressive: {
    type: "tween",
    duration: motionDurations.slow,
    ease: motionEasings.expressive,
  },
  layout: {
    type: "spring",
    visualDuration: motionDurations.slow,
    bounce: 0,
  },
} as const satisfies Record<string, Transition>;

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: motionTransitions.enter },
  exit: { opacity: 0, transition: motionTransitions.exit },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: motionTransitions.enter },
  exit: { opacity: 0, scale: 0.98, transition: motionTransitions.exit },
};

const slideDistance = "0.375rem";

function slide(axis: "x" | "y", distance: string): Variants {
  const hidden = axis === "x" ? { opacity: 0, x: distance } : { opacity: 0, y: distance };
  const visible = axis === "x" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 };

  return {
    hidden,
    visible: { ...visible, transition: motionTransitions.enter },
    exit: { ...hidden, transition: motionTransitions.exit },
  };
}

export const motionVariants = {
  fade,
  fadeScale,
  slide: {
    up: slide("y", slideDistance),
    right: slide("x", `-${slideDistance}`),
    down: slide("y", `-${slideDistance}`),
    left: slide("x", slideDistance),
  },
  collapse: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: motionTransitions.enter },
    exit: { height: 0, opacity: 0, transition: motionTransitions.exit },
  } satisfies Variants,
} as const;

export type NerioMotionConfigProps = PropsWithChildren<{
  nonce?: string;
  skipAnimations?: boolean;
}>;

export function NerioMotionConfig({ children, nonce, skipAnimations }: NerioMotionConfigProps) {
  return (
    <MotionConfig nonce={nonce} reducedMotion="user" skipAnimations={skipAnimations}>
      {children}
    </MotionConfig>
  );
}
