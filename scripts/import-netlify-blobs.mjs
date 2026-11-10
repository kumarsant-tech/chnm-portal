import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MARKER_KEY = "_migration/netlify-blobs";
const sourcePath = process.argv[2];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function findRow(value, key) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findRow(item, key);
      if (found !== undefined) return found;
    }
  } else if (value && typeof value === "object") {
    if (Object.hasOwn(value, key)) return value[key];
    for (const item of Object.values(value)) {
      const found = findRow(item, key);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function runWrangler(args) {
  const executable = path.join(ROOT, "node_modules", "wrangler", "bin", "wrangler.js");
  const result = spawnSync(process.execPath, [executable, ...args], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error("Wrangler command विफल हुआ");
  }
  return result.stdout;
}

async function main() {
  if (!sourcePath) {
    fail("उपयोग: node scripts/import-netlify-blobs.mjs <ताज़ा-Netlify-Blobs-backup.json>");
    return;
  }

  const backup = JSON.parse(await readFile(path.resolve(sourcePath), "utf8"));
  const exportedAt = Date.parse(backup.exportedAt);
  if (
    backup.site !== "chnm26" ||
    backup.store !== "chnm-exam-v2" ||
    !Number.isFinite(exportedAt) ||
    exportedAt > Date.now() + 5 * 60 * 1000 ||
    Date.now() - exportedAt > MAX_AGE_MS
  ) {
    throw new Error("ताज़ा chnm26 / chnm-exam-v2 Blobs backup आवश्यक है (अधिकतम 24 घंटे पुराना)");
  }

  const entries = Object.entries(backup.blobs || {});
  if (!entries.length || entries.length !== Number(backup.count)) {
    throw new Error("Blobs backup अधूरा या खाली है");
  }
  for (const [key, value] of entries) {
    if (!key || typeof value !== "string") throw new Error("Blobs backup का format गलत है");
    JSON.parse(value);
  }

  const currentOutput = runWrangler([
    "d1",
    "execute",
    "chnm-portal",
    "--remote",
    "--json",
    "--command",
    `SELECT value FROM app_kv WHERE key = ${sqlString(MARKER_KEY)}`,
  ]);
  const current = JSON.parse(currentOutput);
  const marker = findRow(current, "value");
  const existingCountOutput = runWrangler([
    "d1",
    "execute",
    "chnm-portal",
    "--remote",
    "--json",
    "--command",
    "SELECT COUNT(*) AS count FROM app_kv",
  ]);
  const existingCount = Number(findRow(JSON.parse(existingCountOutput), "count"));
  if (!Number.isFinite(existingCount)) throw new Error("D1 database की स्थिति जाँची नहीं जा सकी");

  if (marker) {
    const state = JSON.parse(marker);
    if (state.exportedAt !== backup.exportedAt || state.status !== "importing") {
      throw new Error("इस D1 database में पहले से migration/data है; इसे overwrite नहीं किया गया");
    }
  } else if (existingCount !== 0) {
    throw new Error("D1 database खाली नहीं है; import रोक दिया गया ताकि मौजूदा data न बदले");
  }

  const markerValue = JSON.stringify({
    exportedAt: backup.exportedAt,
    expectedKeys: entries.length,
    status: "importing",
  });
  const statements = [
    `INSERT INTO app_kv (key, value) VALUES (${sqlString(MARKER_KEY)}, ${sqlString(markerValue)}) ON CONFLICT(key) DO NOTHING;`,
    ...entries.map(
      ([key, value]) =>
        `INSERT INTO app_kv (key, value) VALUES (${sqlString(key)}, ${sqlString(value)}) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;`
    ),
    `UPDATE app_kv SET value = ${sqlString(JSON.stringify({ ...JSON.parse(markerValue), status: "complete" }))}, updated_at = CURRENT_TIMESTAMP WHERE key = ${sqlString(MARKER_KEY)};`,
  ];

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "chnm-d1-import-"));
  const sqlPath = path.join(tempDir, "import.sql");
  try {
    await writeFile(sqlPath, statements.join("\n"), { encoding: "utf8", flag: "wx" });
    runWrangler(["d1", "execute", "chnm-portal", "--remote", "--file", sqlPath]);
    const verification = runWrangler([
      "d1",
      "execute",
      "chnm-portal",
      "--remote",
      "--json",
      "--command",
      `SELECT key, value, NULL AS count FROM app_kv WHERE key = ${sqlString(MARKER_KEY)} UNION ALL SELECT 'count', NULL, COUNT(*) FROM app_kv`,
    ]);
    const verified = JSON.parse(verification);
    const verifiedMarker = JSON.parse(findRow(verified, "value") || "{}");
    const verifiedCount = Number(findRow(verified, "count"));
    if (
      verifiedMarker.status !== "complete" ||
      verifiedMarker.exportedAt !== backup.exportedAt ||
      verifiedCount !== entries.length + 1
    ) {
      throw new Error("D1 import verification विफल; नई साइट पर traffic भेजने से पहले जाँचें");
    }
    console.log(`Netlify Blobs backup import पूरा: ${entries.length} records`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => fail(error.message || String(error)));
