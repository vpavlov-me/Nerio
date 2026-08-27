import type { Metadata } from "next";
import { DisclosureVisualFixture } from "./disclosure-visual-fixture";

export const metadata: Metadata = {
  title: "Disclosure visual regression fixture",
  robots: { index: false, follow: false },
};

export default function DisclosureVisualTestPage() {
  return <DisclosureVisualFixture />;
}
