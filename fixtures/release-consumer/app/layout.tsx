import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="purple" data-mode="light" data-density="comfortable">
      <body>{children}</body>
    </html>
  );
}
