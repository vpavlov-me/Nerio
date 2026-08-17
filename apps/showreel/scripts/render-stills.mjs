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
  ["NerioShowreel", "main-foundations.png", "570"],
  ["NerioShowreel", "main-components.png", "1060"],
  ["NerioShowreel", "main-interaction.png", "1640"],
  ["NerioShowreel", "main-products.png", "2160"],
  ["NerioShowreel", "main-developer.png", "2570"],
  ["NerioShowreel", "main-outro.png", "2800"],
  ["NerioShowreelVertical", "vertical-products.png", "1120"],
  ["NerioShowreelSquare", "square-components.png", "410"],
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
