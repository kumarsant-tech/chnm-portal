// Builds the static site into ./dist. Netlify runs this on every deploy; the
// functions directory stays at the repository root and is bundled separately.
import { chmod, cp, mkdir, rm, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

export const SITE_ITEMS = [
  "index.html",
  "assets",
  "Computer-Lab",
  "SMPS-Lab",
  "exam",
  "study",
  "404.html",
  "robots.txt",
  ".nojekyll",
];

async function walk(dir) {
  let files = 0;
  let bytes = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(full);
      files += nested.files;
      bytes += nested.bytes;
    } else if (entry.isFile()) {
      const info = await stat(full);
      files += 1;
      bytes += info.size;
    }
  }
  return { files, bytes };
}

async function makeWritable(dir) {
  if (process.platform !== "win32") await chmod(dir, 0o777);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await makeWritable(full);
    } else if (entry.isFile()) {
      await chmod(full, 0o666);
    }
  }
}

export async function build() {
  if (existsSync(DIST)) await makeWritable(DIST);
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const copied = [];
  for (const item of SITE_ITEMS) {
    const source = path.join(ROOT, item);
    if (!existsSync(source)) {
      throw new Error("Build इनपुट नहीं मिला: " + item);
    }
    await cp(source, path.join(DIST, item), { recursive: true });
    copied.push(item);
  }

  for (const required of ["index.html", "exam/index.html", "exam/admin.html", "exam/test.html", "exam/result.html", "study/index.html", "study/chapter.html"]) {
    if (!existsSync(path.join(DIST, required))) {
      throw new Error("Build आउटपुट में आवश्यक फ़ाइल नहीं है: " + required);
    }
  }

  const summary = await walk(DIST);
  console.log(
    "dist तैयार: " + summary.files + " फाइलें, " + (summary.bytes / (1024 * 1024)).toFixed(2) + " MB"
  );
  return { dist: DIST, ...summary, copied };
}

const invokedDirectly =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  build().catch((error) => {
    console.error("Build विफल:", error.message || error);
    process.exit(1);
  });
}
