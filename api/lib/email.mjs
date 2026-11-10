const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

export async function sendEmail(env, { to, subject, text, html, idempotencyKey }) {
  const apiKey = String(env?.RESEND_API_KEY || "");
  const from = String(env?.EMAIL_FROM || "");
  if (!apiKey || !from) return { sent: false, reason: "not_configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      console.error("email provider rejected message", { status: response.status });
      return { sent: false, reason: "provider_error" };
    }
    return { sent: true };
  } catch (error) {
    console.error("email provider request failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return { sent: false, reason: "provider_error" };
  }
}

export function escapeEmailHtml(value) {
  return escapeHtml(value);
}
