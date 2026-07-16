/**
 * Figma asset export helper.
 * fileKey: z9fgcNb7ViU8p0wsTzL4fN (720:9415)
 *
 * Run with FIGMA_ASSET_URL_<NAME> env vars set from download_assets MCP output.
 *
 * Example:
 *   FIGMA_ASSET_URL_TAB_GRID="https://..." node scripts/export-figma-assets.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/assets");

/** @type {{ env: string; file: string; node: string }[]} */
const ASSETS = [
  { env: "FIGMA_ASSET_URL_TAB_GRID", file: "icon-tab-grid.svg", node: "726:11162" },
  { env: "FIGMA_ASSET_URL_TAB_FOLDER", file: "icon-tab-folder.svg", node: "726:11163" },
  { env: "FIGMA_ASSET_URL_TAB_FOLDER_OPEN", file: "icon-tab-folder-open.svg", node: "726:11164" },
  { env: "FIGMA_ASSET_URL_MORE_HORIZ", file: "icon-more-horiz.svg", node: "883:8620" },
  { env: "FIGMA_ASSET_URL_CLOSE", file: "icon-close.svg", node: "883:8790" },
  { env: "FIGMA_ASSET_URL_BOOKMARK", file: "icon-bookmark.svg", node: "883:8019" },
  { env: "FIGMA_ASSET_URL_EDIT", file: "icon-edit.svg", node: "883:7945" },
  { env: "FIGMA_ASSET_URL_DELETE", file: "icon-delete.svg", node: "883:7939" },
  { env: "FIGMA_ASSET_URL_ADD_CIRCLE", file: "icon-add-circle.svg", node: "883:8023" },
  { env: "FIGMA_ASSET_URL_CHECK", file: "icon-check.svg", node: "883:8784" },
  { env: "FIGMA_ASSET_URL_FILTER_ALT", file: "icon-filter-alt.svg", node: "893:6762" },
  { env: "FIGMA_ASSET_URL_EMPTY", file: "empty-state.png", node: "907:9074" },
  { env: "FIGMA_ASSET_URL_ONBOARDING_1", file: "onboarding-01.png", node: "907:9230" },
  { env: "FIGMA_ASSET_URL_ONBOARDING_2", file: "onboarding-02.png", node: "907:8270" },
  { env: "FIGMA_ASSET_URL_ONBOARDING_3", file: "onboarding-03.png", node: "907:8298" },
];

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${file}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT, file), buf);
  console.log(`saved ${file}`);
}

await mkdir(OUT, { recursive: true });

for (const { env, file, node } of ASSETS) {
  const url = process.env[env];
  if (url) await download(url, file);
  else console.log(`skip ${file} (node ${node}, ${env} not set)`);
}
