import { motionTransitions, motionVariants, NerioMotionConfig } from "@nerio-ui/adapters/motion";

export function MotionAdapterFixture({ children }: { children: React.ReactNode }) {
  return <NerioMotionConfig>{children}</NerioMotionConfig>;
}

export const motionFixture = {
  transition: motionTransitions.layout,
  variants: motionVariants.fadeScale,
};
