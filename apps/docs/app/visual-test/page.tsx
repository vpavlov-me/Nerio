import type { Metadata } from "next";
import { VisualTestFixture } from "../../components/visual-test-fixture";

export const metadata: Metadata = {
  title: "Core visual regression fixture",
  robots: { index: false, follow: false },
};

export default function VisualTestPage() {
  return <VisualTestFixture />;
}
