// Scheduled safety net: finalizes attempts whose server-side timer expired,
// even if the student closed the browser. Runs every 5 minutes on Netlify.
import { getDb, listJson } from "../lib/db.mjs";
import { finalizeExpiredForExam } from "../lib/scoring.mjs";

export default async () => {
  const store = await getDb();
  const exams = await listJson(store, "exams/");
  const finalized = [];
  for (const exam of exams) {
    if (!exam || exam.status !== "published") continue;
    const ids = await finalizeExpiredForExam(store, exam);
    finalized.push(...ids);
  }
  return new Response(
    JSON.stringify({ ok: true, finalized: finalized.length, resultIds: finalized }),
    { headers: { "content-type": "application/json" } }
  );
};

export const config = { schedule: "*/5 * * * *" };
