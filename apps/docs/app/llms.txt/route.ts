import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const dynamic = "force-static";

export async function GET() {
  const source = await readFile(join(process.cwd(), "content", "llms.txt"), "utf8");

  return new Response(source, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
