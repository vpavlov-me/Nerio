import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const showreelDirectory = resolve(scriptDirectory, "..");
const stillDirectory = resolve(showreelDirectory, "stills");

mkdirSync(stillDirectory, { recursive: true });

const stills = [
  ["NerioShowreel", "main-identity.png", "90"],
  ["NerioShowreel", "main-build.png", "300"],
  ["NerioShowreel", "main-own.png", "510"],
  ["NerioShowreel", "main-system.png", "700"],
  ["NerioShowreel", "main-components.png", "1050"],
  ["NerioShowreel", "main-compose.png", "1380"],
  ["NerioShowreel", "main-approval.png", "1740"],
  ["NerioShowreel", "main-developer.png", "2080"],
  ["NerioShowreel", "main-outro.png", "2270"],
  ["NerioShowreelVertical", "vertical-components.png", "590"],
  ["NerioShowreelVertical", "vertical-approval.png", "920"],
  ["NerioShowreelSquare", "square-components.png", "390"],
  ["NerioShowreelSquare", "square-approval.png", "600"],
  ["NerioHeroLoop", "hero-loop.png", "60"],
  ["NerioPosterWide", "poster-wide.png"],
  ["NerioPosterVertical", "poster-vertical.png"],
  ["NerioPosterSquare", "poster-square.png"],
];

for (const [composition, file, frame] of stills) {
  const args = [
    "exec",
    "remotion",
    "still",
    "src/index.ts",
    composition,
    resolve(stillDirectory, file),
    "--overwrite",
  ];
  if (frame) args.push(`--frame=${frame}`);
  const result = spawnSync("pnpm", args, { cwd: showreelDirectory, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
