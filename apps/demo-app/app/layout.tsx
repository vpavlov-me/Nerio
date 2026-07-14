import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { createAppearanceInitializationScript } from "../lib/appearance";

const yandexMetrikaId = "110539538";

export const metadata: Metadata = {
  title: "Nerio Workspace",
  description: "Universal product workspace built with Nerio.",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      data-theme="purple"
      data-mode="system"
      data-density="comfortable"
    >
      <head>
        <script
          id="nerio-appearance"
          dangerouslySetInnerHTML={{ __html: createAppearanceInitializationScript() }}
        />
      </head>
      <body>
        {children}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${yandexMetrikaId}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
