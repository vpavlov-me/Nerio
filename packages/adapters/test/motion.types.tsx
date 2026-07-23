import type { ReactNode } from "react";
import { NerioMotionConfig, type NerioMotionConfigProps } from "../src/motion";

const children: ReactNode = null;

const stableConfigProps: NerioMotionConfigProps = {
  children,
  nonce: "content-security-policy-nonce",
  skipAnimations: true,
};

void stableConfigProps;
void (<NerioMotionConfig nonce="content-security-policy-nonce">{children}</NerioMotionConfig>);
void (<NerioMotionConfig skipAnimations>{children}</NerioMotionConfig>);

// @ts-expect-error Nerio locks reduced motion to the operating-system preference.
void (<NerioMotionConfig reducedMotion="never">{children}</NerioMotionConfig>);

// @ts-expect-error Global transition overrides bypass the token-aligned transition contract.
void (<NerioMotionConfig transition={{ duration: 2 }}>{children}</NerioMotionConfig>);

// @ts-expect-error Motion implementation hooks are not part of the bounded Nerio wrapper.
void (<NerioMotionConfig isValidProp={() => true}>{children}</NerioMotionConfig>);
