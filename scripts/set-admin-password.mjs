// Rotates the server-side fallback admin password used when ADMIN_PASSWORD is
// not available at function runtime. Run: node scripts/set-admin-password.mjs "new-password"
import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('उपयोग: node scripts/set-admin-password.mjs "नया-मजबूत-पासवर्ड"');
  console.error("पासवर्ड कम से कम 10 अक्षर का होना चाहिए।");
  process.exit(1);
}

const salt = crypto.randomBytes(32);
const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
const target = fileURLToPath(new URL("../netlify/lib/admin-credentials.mjs", import.meta.url));

const content = `// Server-side only: imported by Netlify Functions, never copied into dist.
// ADMIN_PASSWORD / ADMIN_SECRET environment variables take precedence when set.
// Regenerate with: node scripts/set-admin-password.mjs "new-password"
export const FALLBACK_ADMIN = {
  salt: "${salt.toString("hex")}",
  hash: "${hash.toString("hex")}",
  n: 16384,
  r: 8,
  p: 1,
  keylen: 64,
};
`;

await writeFile(target, content, "utf8");
console.log("admin-credentials.mjs अपडेट हो गया। अब साइट दोबारा deploy करें।");
