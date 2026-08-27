import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  Manrope,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google";
import { VisualPlayground } from "../../components/visual-playground";
import { createPageMetadata } from "../../lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--n-font-sans-inter", preload: false });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--n-font-sans-ibm-plex",
  preload: false,
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--n-font-mono-ibm-plex",
  preload: false,
});
const manrope = Manrope({ subsets: ["latin"], variable: "--n-font-sans-manrope", preload: false });
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--n-font-sans-source-sans",
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--n-font-sans-space-grotesk",
  preload: false,
});

const playgroundFontVariables = [
  inter.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
  manrope.variable,
  sourceSans.variable,
  spaceGrotesk.variable,
].join(" ");

export const metadata = createPageMetadata({
  title: "Playground",
  description: "Tune Nerio tokens and inspect Core components in one interactive canvas.",
  path: "/playground",
  indexable: false,
});

export default function PlaygroundPage() {
  return <VisualPlayground fontClassName={playgroundFontVariables} />;
}
