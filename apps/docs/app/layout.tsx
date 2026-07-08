import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DocsChrome } from "../components/docs-chrome";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--n-font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--n-font-geist-mono",
});

export const metadata: Metadata = {
  title: "Nerio",
  description: "A source-first design system for modern digital products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="purple"
      data-mode="system"
      data-density="comfortable"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <DocsChrome>{children}</DocsChrome>
      </body>
    </html>
  );
}
