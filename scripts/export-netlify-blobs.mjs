import { getStore } from "@netlify/blobs";
import { chmod, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteID = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_AUTH_TOKEN;
const output = process.argv[2] ? path.resolve(process.argv[2]) : "";

if (!siteID || !token || !output) {
  console.error(
    "उपयोग: $env:NETLIFY_SITE_ID='...'; $env:NETLIFY_AUTH_TOKEN='...'; node scripts/export-netlify-blobs.mjs <secure-output.json>"
  );
  process.exit(1);
}
const relativeOutput = path.relative(ROOT, output);
if (
  relativeOutput === "" ||
  (!relativeOutput.startsWith(`..${path.sep}`) &&
    relativeOutput !== ".." &&
    !path.isAbsolute(relativeOutput))
) {
  console.error("निजी Blobs backup को project/GitHub folder के बाहर save करें।");
  process.exit(1);
}

const store = getStore({ name: "chnm-exam-v2", siteID, token });
const keys = [];
for await (const page of store.list({ paginate: true })) {
  for (const entry of page.blobs || []) {
    if (entry?.key) keys.push(entry.key);
  }
}
if (!keys.length) throw new Error("Netlify Blobs store खाली है या backup पढ़ा नहीं जा सका");

const blobs = {};
let cursor = 0;
const workers = Array.from({ length: Math.min(12, keys.length) }, async () => {
  while (cursor < keys.length) {
    const key = keys[cursor++];
    const value = await store.get(key);
    if (value === null) throw new Error("Export के दौरान एक Blobs record उपलब्ध नहीं रहा");
    blobs[key] = value;
  }
});
await Promise.all(workers);

const backup = {
  exportedAt: new Date().toISOString(),
  site: "chnm26",
  store: "chnm-exam-v2",
  count: keys.length,
  blobs,
};
await writeFile(output, JSON.stringify(backup), { encoding: "utf8", flag: "wx", mode: 0o600 });
if (process.platform !== "win32") await chmod(output, 0o600);
console.log(`सुरक्षित Netlify backup तैयार: ${keys.length} records · ${output}`);
