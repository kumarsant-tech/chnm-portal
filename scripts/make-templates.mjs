// Generates the downloadable question templates (XLSX, CSV, JSON).
// Run: ELECTRON_RUN_AS_NODE=1 <node> scripts/make-templates.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const XLSX = require("../exam/assets/vendor/xlsx.full.min.js");

const OUT = path.resolve("exam/templates");
fs.mkdirSync(OUT, { recursive: true });

const headers = [
  "Question ID",
  "Subject",
  "Question",
  "Option A",
  "Option B",
  "Option C",
  "Option D",
  "Correct Answer",
  "Marks",
  "Negative Marks",
  "Explanation",
  "Image",
];

const rows = [];

const instructions = [
  ["Column", "नियम"],
  ["Question ID", "वैकल्पिक। खाली छोड़ने पर सिस्टम स्वयं ID बनाएगा। पहले से मौजूद ID दोबारा न दें।"],
  ["Subject", "Trade Theory / Training Methodology (TM) / Trade Practical / Soft Skills / SMPS / Computer Hardware / Networking — या Admin Panel में बनाया गया विषय।"],
  ["Question", "प्रश्न अनिवार्य है (कम से कम 3 अक्षर)।"],
  ["Option A-D", "कम से कम दो विकल्प दें। एक ही प्रश्न में दो विकल्प समान नहीं हो सकते।"],
  ["Correct Answer", "A, B, C, D (या 1, 2, 3, 4) लिखें।"],
  ["Marks", "वैकल्पिक। 0.1 से 100 तक। खाली होने पर परीक्षा के डिफ़ॉल्ट अंक लगेंगे।"],
  ["Negative Marks", "वैकल्पिक। 0 से प्रश्न के अंकों तक। खाली होने पर परीक्षा का डिफ़ॉल्ट लगेगा।"],
  ["Explanation", "वैकल्पिक। परिणाम/उत्तर समीक्षा में दिखेगा।"],
  ["Image", "वैकल्पिक। पूरा https:// URL या data:image URL।"],
  ["ध्यान दें", "एक ही प्रश्न दो बार न रखें। Upload से पहले Admin Panel Preview में सभी प्रश्न जाँचें, फिर Practice Test चलाएँ, उसके बाद Final Paper Lock और Publish करें।"],
];

const workbook = XLSX.utils.book_new();
const dataSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
dataSheet["!cols"] = [
  { wch: 16 },
  { wch: 28 },
  { wch: 52 },
  { wch: 22 },
  { wch: 22 },
  { wch: 22 },
  { wch: 22 },
  { wch: 14 },
  { wch: 8 },
  { wch: 14 },
  { wch: 48 },
  { wch: 26 },
];
XLSX.utils.book_append_sheet(workbook, dataSheet, "Questions");
const guideSheet = XLSX.utils.aoa_to_sheet(instructions);
guideSheet["!cols"] = [{ wch: 18 }, { wch: 110 }];
XLSX.utils.book_append_sheet(workbook, guideSheet, "Instructions");
const xlsxBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
fs.writeFileSync(path.join(OUT, "questions-template.xlsx"), xlsxBuffer);

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}
const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
fs.writeFileSync(path.join(OUT, "questions-template.csv"), `\ufeff${csv}`, "utf8");

const json = rows.map((row) => ({
  qid: row[0],
  subject: row[1],
  question: row[2],
  options: [row[3], row[4], row[5], row[6]],
  correctAnswer: row[7],
  marks: row[8] === "" ? null : Number(row[8]),
  negativeMarks: row[9] === "" ? null : Number(row[9]),
  explanation: row[10],
  image: row[11],
}));
fs.writeFileSync(
  path.join(OUT, "questions-sample.json"),
  JSON.stringify(json, null, 2),
  "utf8"
);

console.log("Templates written to", OUT);
console.log(fs.readdirSync(OUT).join(", "));
