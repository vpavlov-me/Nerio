import type { ReactNode } from "react";
import "@nerio/ui/styles.css";
import "./source-styles.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="purple" data-mode="light" data-density="comfortable">
      <body>{children}</body>
    </html>
  );
}
