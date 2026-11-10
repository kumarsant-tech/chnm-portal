import { K, getJson, putJson, mapLimit } from "./db.mjs";
import { email } from "./validate.mjs";
import { examResults } from "./domain.mjs";
import { sendEmail, escapeEmailHtml } from "./email.mjs";

const MAX_EMAILS_PER_RUN = 25;
const MAX_CONCURRENT_EMAILS = 5;
const MAX_ATTEMPTS = 5;
const RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;

function isReleaseDue(exam, now) {
  return (
    exam?.releaseResults === true &&
    (!exam.releaseAt || Date.parse(exam.releaseAt) <= now)
  );
}

function resultPortalUrl(env) {
  const fallback = "https://chnm-portal.kumarsant1947.workers.dev/exam/index.html";
  try {
    const base = new URL(env?.PUBLIC_BASE_URL || fallback);
    if (base.protocol !== "https:") return fallback;
    return new URL("/exam/index.html", base.origin).toString();
  } catch {
    return fallback;
  }
}

function retryDelay(attempt) {
  return Math.min(60 * 60 * 1000, 5 * 60 * 1000 * 2 ** Math.max(0, attempt - 1));
}

export async function processResultReleaseEmails(store, env, exam) {
  const now = Date.now();
  if (exam?.notifyResultsOnRelease !== true || !isReleaseDue(exam, now)) {
    return { pending: false, attempted: 0 };
  }

  const results = await examResults(store, exam.id);
  if (!results.length) return { pending: true, attempted: 0 };

  const studentIds = [
    ...new Set(results.map((result) => String(result.studentId || "")).filter(Boolean)),
  ];
  const students = await mapLimit(studentIds, 12, async (studentId) => {
    const [student, state] = await Promise.all([
      getJson(store, K.students(studentId)),
      getJson(store, K.resultReleaseEmail(exam.id, studentId)),
    ]);
    const address = email(student?.email);
    return address ? { studentId, student, address, state } : null;
  });
  const eligible = students.filter((entry) => {
    if (!entry) return false;
    return !["sent", "failed", "expired"].includes(entry.state?.status);
  });
  const batch = eligible.slice(0, MAX_EMAILS_PER_RUN);
  const hasEmailConfig = Boolean(env?.RESEND_API_KEY && env?.EMAIL_FROM);
  const portalUrl = resultPortalUrl(env);

  const outcomes = await mapLimit(
    batch,
    MAX_CONCURRENT_EMAILS,
    async ({ studentId, student, address, state }) => {
      const firstAttemptAt = state?.firstAttemptAt || new Date(now).toISOString();
      const elapsed = now - Date.parse(firstAttemptAt);
      if (Number.isFinite(elapsed) && elapsed >= RETRY_WINDOW_MS) {
        await putJson(store, K.resultReleaseEmail(exam.id, studentId), {
          ...state,
          status: "expired",
          updatedAt: new Date(now).toISOString(),
        });
        return "done";
      }

      if (Number(state?.nextAttemptAt) > now) return "pending";
      if (!hasEmailConfig) return "pending";

      const attempts = Number(state?.attempts) || 0;
      if (attempts >= MAX_ATTEMPTS) {
        await putJson(store, K.resultReleaseEmail(exam.id, studentId), {
          ...state,
          status: "failed",
          updatedAt: new Date(now).toISOString(),
        });
        return "done";
      }

      const key = K.resultReleaseEmail(exam.id, studentId);
      const nextAttempt = attempts + 1;
      const attemptedAt = new Date(now).toISOString();
      const pendingState = {
        status: "pending",
        attempts: nextAttempt,
        firstAttemptAt,
        lastAttemptAt: attemptedAt,
        nextAttemptAt: now + retryDelay(nextAttempt),
      };
      await putJson(store, key, pendingState);

      const name = String(student.name || "छात्र");
      const title = String(exam.title || "परीक्षा");
      const delivery = await sendEmail(env, {
        to: address,
        subject: `परीक्षा परिणाम जारी — ${title}`,
        text: [
          `नमस्ते ${name},`,
          `आपकी ${title} परीक्षा का परिणाम जारी कर दिया गया है।`,
          `परिणाम देखने के लिए पोर्टल में लॉगिन करें: ${portalUrl}`,
        ].join("\n\n"),
        html: `<p>नमस्ते ${escapeEmailHtml(name)},</p><p>आपकी <strong>${escapeEmailHtml(title)}</strong> परीक्षा का परिणाम जारी कर दिया गया है।</p><p>परिणाम देखने के लिए <a href="${escapeEmailHtml(portalUrl)}">पोर्टल में लॉगिन करें</a>।</p>`,
        idempotencyKey: `result-release/${exam.id}/${studentId}`,
      });

      if (delivery.sent) {
        await putJson(store, key, {
          ...pendingState,
          status: "sent",
          sentAt: new Date().toISOString(),
        });
        return "done";
      }

      if (nextAttempt >= MAX_ATTEMPTS) {
        await putJson(store, key, {
          ...pendingState,
          status: "failed",
          lastFailure: delivery.reason,
          updatedAt: new Date().toISOString(),
        });
        return "done";
      }
      return "pending";
    }
  );

  const pending = eligible.length > batch.length || outcomes.includes("pending");
  if (!pending) {
    exam.notifyResultsOnRelease = false;
    exam.resultNotificationsFinishedAt = new Date().toISOString();
    await putJson(store, K.exams(exam.id), exam);
  }
  return { pending, attempted: batch.length };
}
