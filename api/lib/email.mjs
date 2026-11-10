const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

function emailProvider(env) {
  const gmail = {
    clientId: String(env?.GMAIL_CLIENT_ID || "").trim(),
    clientSecret: String(env?.GMAIL_CLIENT_SECRET || "").trim(),
    refreshToken: String(env?.GMAIL_REFRESH_TOKEN || "").trim(),
  };
  if (gmail.clientId || gmail.clientSecret || gmail.refreshToken) {
    return Object.values(gmail).every(Boolean) ? { type: "gmail", ...gmail } : null;
  }

  const resend = {
    apiKey: String(env?.RESEND_API_KEY || "").trim(),
    from: String(env?.EMAIL_FROM || "").trim(),
  };
  return resend.apiKey && resend.from ? { type: "resend", ...resend } : null;
}

export function emailConfigured(env) {
  return Boolean(emailProvider(env));
}

function base64(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64Lines(value) {
  const encoded = base64(new TextEncoder().encode(String(value ?? "")));
  return encoded.match(/.{1,76}/g)?.join("\r\n") || "";
}

function base64Url(value) {
  return base64(new TextEncoder().encode(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function gmailRawMessage({ to, subject, text, html }) {
  if (/[\r\n]/.test(to)) throw new Error("Invalid email recipient");
  const safeSubject = String(subject ?? "").replace(/[\r\n]/g, " ").trim();
  const encodedSubject = `=?UTF-8?B?${base64(new TextEncoder().encode(safeSubject))}?=`;
  const boundary = `chnm-${crypto.randomUUID()}`;
  const parts = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(text),
  ];
  if (html) {
    parts.push(
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      base64Lines(html)
    );
  }
  parts.push(`--${boundary}--`, "");
  return parts.join("\r\n");
}

async function sendGmail(provider, message) {
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        refresh_token: provider.refreshToken,
        grant_type: "refresh_token",
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!tokenResponse.ok) {
      console.error("Gmail OAuth token request rejected", { status: tokenResponse.status });
      return { sent: false, reason: "provider_error" };
    }
    const tokenData = await tokenResponse.json();
    const accessToken = typeof tokenData?.access_token === "string" ? tokenData.access_token : "";
    if (!accessToken) {
      console.error("Gmail OAuth response omitted access token");
      return { sent: false, reason: "provider_error" };
    }

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ raw: base64Url(gmailRawMessage(message)) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      console.error("Gmail API rejected message", { status: response.status });
      return { sent: false, reason: "provider_error" };
    }
    return { sent: true };
  } catch (error) {
    console.error("Gmail email request failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return { sent: false, reason: "provider_error" };
  }
}

export async function sendEmail(env, { to, subject, text, html, idempotencyKey }) {
  const provider = emailProvider(env);
  if (!provider) return { sent: false, reason: "not_configured" };
  const message = { to, subject, text, html };
  if (provider.type === "gmail") return sendGmail(provider, message);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${provider.apiKey}`,
        "content-type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify({ from: provider.from, to: [to], subject, text, html }),
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
