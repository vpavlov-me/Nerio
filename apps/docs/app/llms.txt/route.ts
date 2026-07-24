import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { arePreviewSurfacesEnabled } from "../../lib/deployment";

const previewStart = "<!-- nerio-preview-surfaces:start -->";
const previewEnd = "<!-- nerio-preview-surfaces:end -->";
const previewSectionPattern =
  /<!-- nerio-preview-surfaces:start -->[\s\S]*?<!-- nerio-preview-surfaces:end -->\n*/g;

export const dynamic = "force-static";

function renderLlmsText(source: string) {
  if (!arePreviewSurfacesEnabled()) {
    return source.replaceAll(previewSectionPattern, "");
  }

  return source.replaceAll(previewStart, "").replaceAll(previewEnd, "");
}

export async function GET() {
  const source = await readFile(join(process.cwd(), "content", "llms.txt"), "utf8");

  return new Response(renderLlmsText(source), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
