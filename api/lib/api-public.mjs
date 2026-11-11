import { K, getJson, putJson, listJson } from "./db.mjs";
import { HttpError, json, readJson, getIp } from "./http.mjs";
import { clean, email, validateStudent, phone, temporaryPasswordFromDob } from "./validate.mjs";
import {
  issueStudentToken,
  rateLimit,
  clearRateLimit,
  assertAuthUnlocked,
  recordAuthFailure,
  clearAuthFailures,
  audit,
  checkPin,
  checkPassword,
  hashPassword,
} from "./auth.mjs";
import { publicSettings, studentSelf } from "./serializers.mjs";
import { loadCatalog, nextRegistrationId, publicSubject, publicTrade } from "./domain.mjs";
import { DEFAULT_SETTINGS } from "./seed.mjs";
import { sendEmail, escapeEmailHtml, emailConfigured } from "./email.mjs";
import { createResetToken, hashResetToken, resetBaseUrl, validResetToken } from "./recovery.mjs";

function registrationLoginUrl(env) {
  const fallback = "https://futureinstructor.in/exam/index.html";
  try {
    const base = new URL(env?.PUBLIC_BASE_URL || fallback);
    if (base.protocol !== "https:") return fallback;
    return new URL("/exam/index.html", base.origin).toString();
  } catch {
    return fallback;
  }
}

function registrationEmailHtml({ name, loginId, group, loginUrl }) {
  return `<!DOCTYPE html>
<html lang="hi"><body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',Arial,'Noto Sans Devanagari',sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
  <tr><td style="background:#0b5ed7;padding:26px 24px;text-align:center;">
    <div style="color:#ffffff;font-size:22px;font-weight:700;">Future Instructor Group</div>
    <div style="color:#cfe2ff;font-size:13px;margin-top:4px;">आपका प्यार ही हमारी प्रगति है</div>
  </td></tr>
  <tr><td style="padding:28px 24px 8px;color:#222;font-size:16px;line-height:1.7;">
    <p style="margin:0 0 8px;">नमस्ते <b>${escapeEmailHtml(name)}</b>,</p>
    <p style="margin:0 0 12px;">🙏 <b>Future Instructor Group</b> से जुड़ने के लिए हृदय से धन्यवाद!</p>
    <p style="margin:0;">🎉 आपका परीक्षा पोर्टल रजिस्ट्रेशन <b style="color:#198754;">सफलतापूर्वक पूरा</b> हो गया है।</p>
  </td></tr>
  <tr><td style="padding:16px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9ff;border:1px solid #d6e4ff;border-radius:8px;">
      <tr><td style="padding:14px 16px;color:#555;font-size:14px;">लॉगिन ID</td>
          <td style="padding:14px 16px;color:#111;font-size:18px;font-weight:700;" align="right">${escapeEmailHtml(loginId)}</td></tr>
      <tr><td style="padding:0 16px 14px;color:#555;font-size:14px;">ग्रुप</td>
          <td style="padding:0 16px 14px;color:#111;font-size:15px;font-weight:600;" align="right">${escapeEmailHtml(group)}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:0 24px 8px;color:#222;font-size:15px;line-height:1.7;">
    <b>पहली बार लॉगिन कैसे करें:</b>
    <ol style="margin:8px 0 0;padding-left:20px;">
      <li>नीचे दिए बटन से पोर्टल खोलें।</li>
      <li>लॉगिन ID डालें।</li>
      <li>पासवर्ड की जगह अपनी <b>जन्मतिथि DDMMYYYY</b> में डालें।</li>
      <li>लॉगिन के बाद <b>नया पासवर्ड सेट करना ज़रूरी</b> है।</li>
    </ol>
  </td></tr>
  <tr><td align="center" style="padding:20px 24px 8px;">
    <a href="${escapeEmailHtml(loginUrl)}" style="background:#0b5ed7;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 32px;border-radius:8px;display:inline-block;">पोर्टल में लॉगिन करें</a>
  </td></tr>
  <tr><td style="padding:20px 24px 8px;">
    <div style="background:#fff0f3;border-radius:8px;padding:16px;text-align:center;color:#7a1f3d;font-size:15px;line-height:1.7;">
      <div style="font-size:17px;font-weight:700;">❤️ आपका प्यार ही हमारी प्रगति है</div>
      <div style="margin-top:6px;">आपके विश्वास और साथ से ही हम आगे बढ़ते हैं। आपकी सफलता के सफ़र में हम हर कदम पर आपके साथ हैं।</div>
    </div>
  </td></tr>
  <tr><td style="padding:16px 24px 8px;color:#222;font-size:15px;line-height:1.7;">
    शुभकामनाओं सहित,<br><b>टीम Future Instructor Group</b>
  </td></tr>
  <tr><td style="padding:12px 24px 24px;color:#856404;font-size:13px;line-height:1.6;">
    <div style="background:#fff8e1;border-left:4px solid #ffc107;padding:10px 12px;border-radius:4px;">
      ⚠️ अपना पासवर्ड किसी के साथ साझा न करें। यह मेल रजिस्ट्रेशन होने की वजह से आया है। अगर आपने रजिस्ट्रेशन नहीं किया, तो इसे अनदेखा करें।
    </div>
  </td></tr>
  <tr><td style="background:#f5f5f5;padding:14px 24px;text-align:center;color:#888;font-size:12px;">
    Future Instructor Group · futureinstructor.in
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export async function handleBootstrap({ store }) {
  const catalog = await loadCatalog(store);
  const settings = (await getJson(store, K.settings())) || DEFAULT_SETTINGS;
  return json({
    ok: true,
    settings: publicSettings(settings),
    subjects: catalog.subjects.map(publicSubject),
    trades: catalog.trades.map(publicTrade),
    serverNow: Date.now(),
  });
}

export async function handleRegister({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  await rateLimit(store, "register", ip, 12, 60 * 60 * 1000);
  const body = await readJson(req);
  const settings = (await getJson(store, K.settings())) || DEFAULT_SETTINGS;
  if (settings.registrationOpen === false) {
    throw new HttpError("नया रजिस्ट्रेशन अभी बंद है — एडमिन से संपर्क करें", 403);
  }
  const input = validateStudent(body);
  if (!input.dateOfBirth) throw new HttpError("जन्मतिथि दर्ज करना आवश्यक है", 400);
  if (input.tradeId) {
    const trade = await getJson(store, K.trades(input.tradeId));
    if (!trade || trade.active === false) throw new HttpError("चुना गया ट्रेड उपलब्ध नहीं है", 400);
  }
  let existingStudents;
  const allStudents = async () => {
    if (!existingStudents) existingStudents = await listJson(store, "students/");
    return existingStudents;
  };
  const holder = input.mobile ? await getJson(store, K.mobileIndex(input.mobile)) : null;
  if (holder) throw new HttpError("यह मोबाइल नंबर पहले से रजिस्टर है — लॉगिन करें", 409);
  if (
    input.mobile &&
    (await allStudents()).some((record) => phone(record.mobile) === input.mobile)
  ) {
    throw new HttpError("यह मोबाइल नंबर पहले से रजिस्टर है — लॉगिन करें", 409);
  }
  if (input.citsNumber) {
    const citsHolder = await getJson(store, K.studentCitsIndex(input.citsNumber));
    if (citsHolder) throw new HttpError("यह CITS नंबर पहले से रजिस्टर है", 409);
    const legacyMatch = (await allStudents()).some(
      (record) =>
        String(record.citsNumber || "").trim().toUpperCase() === input.citsNumber ||
        phone(record.mobile) === input.citsNumber
    );
    if (legacyMatch) throw new HttpError("यह CITS नंबर पहले से रजिस्टर है", 409);
  }

  const now = new Date().toISOString();
  const id = await nextRegistrationId(store);
  const student = {
    id,
    name: input.name,
    fatherName: input.fatherName,
    mobile: input.mobile,
    citsNumber: input.citsNumber,
    email: input.email,
    tradeId: input.tradeId,
    batch: input.batch,
    photo: input.photo,
    active: true,
    source: "self",
    createdAt: now,
    updatedAt: now,
    passwordHash: await hashPassword(temporaryPasswordFromDob(input.dateOfBirth)),
    mustChangePassword: true,
  };
  const mobileReserved = input.mobile
    ? await store.setIfAbsent(K.mobileIndex(input.mobile), { studentId: id })
    : true;
  if (!mobileReserved) throw new HttpError("यह मोबाइल नंबर पहले से रजिस्टर है", 409);
  let citsReserved = false;
  try {
    if (input.citsNumber) {
      citsReserved = await store.setIfAbsent(K.studentCitsIndex(input.citsNumber), {
        studentId: id,
      });
      if (!citsReserved) throw new HttpError("यह CITS नंबर पहले से रजिस्टर है", 409);
    }
    await putJson(store, K.students(id), student);
  } catch (error) {
    if (input.mobile) await store.delete(K.mobileIndex(input.mobile));
    if (citsReserved) await store.delete(K.studentCitsIndex(input.citsNumber));
    throw error;
  }
  try {
    await audit(store, "student.register", id, { ip });
  } catch (error) {
    console.error("registration audit logging failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }
  const groupName = settings.groupName || settings.collegeName || DEFAULT_SETTINGS.groupName;
  let notification = { sent: false, reason: "not_provided" };
  if (input.email) {
    const loginId = input.citsNumber || input.mobile;
    const result = await sendEmail(env, {
      to: input.email,
      subject: `रजिस्ट्रेशन सफल — ${groupName}`,
      html: registrationEmailHtml({
        name: student.name,
        loginId,
        group: groupName,
        loginUrl: registrationLoginUrl(env),
      }),
      text: [
        `नमस्ते ${student.name},`,
        "आपका परीक्षा पोर्टल रजिस्ट्रेशन सफलतापूर्वक पूरा हो गया है।",
        `लॉगिन ID: ${loginId}`,
        `ग्रुप: ${groupName}`,
        "पहली बार लॉगिन करने के लिए अपनी जन्मतिथि DDMMYYYY प्रारूप में अस्थायी पासवर्ड के रूप में दर्ज करें। इसके बाद नया पासवर्ड सेट करना आवश्यक है।",
        `पोर्टल में लॉगिन करें: ${registrationLoginUrl(env)}`,
      ].join("\n\n"),
    });
    notification = result;
  }
  const notificationMessage = notification.sent
    ? "पुष्टिकरण ईमेल भेज दिया गया है।"
    : notification.reason === "not_configured"
      ? "रजिस्ट्रेशन पूरा है; ईमेल सुविधा अभी सेट नहीं है।"
      : notification.reason === "not_provided"
        ? "रजिस्ट्रेशन पूरा है। ईमेल पता नहीं दिया गया, इसलिए सूचना ईमेल नहीं भेजा गया।"
        : "रजिस्ट्रेशन पूरा है, लेकिन ईमेल नहीं भेजा जा सका।";
  return json({
    ok: true,
    loginId: input.citsNumber || input.mobile,
    student: studentSelf(student),
    notification: { ...notification, message: notificationMessage },
  });
}

export async function handleStudentLogin({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  const body = await readJson(req);
  const identifier = clean(body.identifier ?? body.id, 40).toUpperCase();
  const mobile = phone(body.mobile);
  const password = String(body.password ?? body.pin ?? "");
  await rateLimit(store, "student-login", ip, 20, 15 * 60 * 1000);
  if (!/^[A-Z0-9][A-Z0-9_/-]{1,39}$/.test(identifier)) {
    throw new HttpError("CITS नंबर या पंजीकृत मोबाइल नंबर दर्ज करें", 400);
  }
  const student = await findStudentByIdentifier(store, identifier);
  const authIdentities = studentAuthIdentities(student, identifier);
  const counterIdentity = student ? `student:${student.id}` : `identifier:${identifier}`;
  await assertAuthUnlocked(store, "student", authIdentities);
  await rateLimit(store, "student-login-id", identifier, 8, 15 * 60 * 1000);
  if (!student) {
    if (await recordAuthFailure(store, "student", counterIdentity, authIdentities)) {
      throw new HttpError(
        "तीन गलत प्रयासों के बाद लॉगिन और पासवर्ड रीसेट एक घंटे के लिए लॉक है",
        429,
        { retryAfter: 3600 }
      );
    }
    throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
  }
  if (student.active === false) {
    throw new HttpError("यह छात्र खाता निष्क्रिय है — एडमिन से संपर्क करें", 403);
  }
  if (student.passwordHash) {
    if (!(await checkPassword(password, student.passwordHash))) {
      if (await recordAuthFailure(store, "student", counterIdentity, authIdentities)) {
        throw new HttpError(
          "तीन गलत प्रयासों के बाद लॉगिन और पासवर्ड रीसेट एक घंटे के लिए लॉक है",
          429,
          { retryAfter: 3600 }
        );
      }
      throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
    }
  } else {
    const legacyIdMatches = identifier === String(student.id).toUpperCase() ||
      identifier === String(student.mobile || "");
    if (!legacyIdMatches || !mobile || mobile !== student.mobile) {
      if (await recordAuthFailure(store, "student", counterIdentity, authIdentities)) {
        throw new HttpError(
          "तीन गलत प्रयासों के बाद लॉगिन और पासवर्ड रीसेट एक घंटे के लिए लॉक है",
          429,
          { retryAfter: 3600 }
        );
      }
      throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
    }
    if (student.pinHash && !(await checkPin(password, student.pinHash))) {
      if (await recordAuthFailure(store, "student", counterIdentity, authIdentities)) {
        throw new HttpError(
          "तीन गलत प्रयासों के बाद लॉगिन और पासवर्ड रीसेट एक घंटे के लिए लॉक है",
          429,
          { retryAfter: 3600 }
        );
      }
      throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
    }
    if (!student.mustChangePassword) {
      student.mustChangePassword = true;
      await putJson(store, K.students(student.id), student);
    }
  }
  await clearRateLimit(store, "student-login-id", identifier);
  await clearAuthFailures(store, "student", authIdentities);
  await audit(store, "student.login", student.id, { ip });
  return json({
    ok: true,
    token: issueStudentToken(student.id, env, student.authVersion),
    student: studentSelf(student),
    requiresPasswordChange: Boolean(student.mustChangePassword || !student.passwordHash),
  });
}

function studentAuthIdentities(student, identifier) {
  if (!student) return [`identifier:${identifier}`];
  return [
    `student:${student.id}`,
    student.citsNumber ? `cits:${String(student.citsNumber).toUpperCase()}` : "",
    student.mobile ? `mobile:${student.mobile}` : "",
    `identifier:${identifier}`,
  ].filter(Boolean);
}

async function findStudentByIdentifier(store, identifier) {
  if (phone(identifier)) {
    const indexed = await getJson(store, K.mobileIndex(identifier));
    if (indexed?.studentId) {
      const student = await getJson(store, K.students(indexed.studentId));
      if (student) return student;
    }
  } else {
    const indexed = await getJson(store, K.studentCitsIndex(identifier));
    if (indexed?.studentId) {
      const student = await getJson(store, K.students(indexed.studentId));
      if (student) return student;
    }
  }
  const students = await listJson(store, "students/");
  return students.find((student) =>
    String(student.citsNumber || "").toUpperCase() === identifier ||
    String(student.mobile || "") === identifier ||
    String(student.id || "").toUpperCase() === identifier
  ) || null;
}

export async function handleStudentPasswordChange({ req, ctx, store, env, student }) {
  const body = await readJson(req);
  await rateLimit(store, "student-password-change", student.id, 6, 15 * 60 * 1000);
  const newPassword = String(body.newPassword || "");
  if (newPassword.length < 10 || newPassword.length > 128) {
    throw new HttpError("नया पासवर्ड 10 से 128 अक्षरों का होना चाहिए", 400);
  }
  const currentPassword = String(body.currentPassword || "");
  if (newPassword === currentPassword) {
    throw new HttpError("नया पासवर्ड अस्थायी/वर्तमान पासवर्ड से अलग होना चाहिए", 400);
  }
  if (student.passwordHash && !(await checkPassword(currentPassword, student.passwordHash))) {
    throw new HttpError("अस्थायी/वर्तमान पासवर्ड सही नहीं है", 401);
  }
  if (!student.passwordHash && student.pinHash && !(await checkPin(currentPassword, student.pinHash))) {
    throw new HttpError("वर्तमान PIN सही नहीं है", 401);
  }
  student.passwordHash = await hashPassword(newPassword);
  student.mustChangePassword = false;
  student.authVersion = (Number(student.authVersion) || 0) + 1;
  delete student.pinHash;
  student.updatedAt = new Date().toISOString();
  await putJson(store, K.students(student.id), student);
  await audit(store, "student.password.change", student.id, { ip: getIp(req, ctx) });
  return json({
    ok: true,
    token: issueStudentToken(student.id, env, student.authVersion),
    student: studentSelf(student),
  });
}

const STUDENT_RESET_TTL = 30 * 60 * 1000;
const GENERIC_STUDENT_RESET_MESSAGE =
  "यदि दी गई जानकारी किसी खाते से मेल खाती है, तो रीसेट लिंक पंजीकृत ईमेल पर भेजा जाएगा।";

export async function handleStudentForgotPassword({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  await rateLimit(store, "student-forgot-password-ip", ip, 5, 60 * 60 * 1000);
  const body = await readJson(req);
  const identifier = clean(body.identifier ?? body.id, 40).toUpperCase();
  const emailAddress = email(body.email);
  if (!/^[A-Z0-9][A-Z0-9_/-]{1,39}$/.test(identifier) || !emailAddress) {
    throw new HttpError("पंजीकृत CITS/मोबाइल और सही ईमेल दर्ज करें", 400);
  }
  await rateLimit(store, "student-forgot-password-id", identifier, 5, 60 * 60 * 1000);

  const baseUrl = resetBaseUrl(env);
  if (!baseUrl || !emailConfigured(env)) {
    throw new HttpError(
      "पासवर्ड रिकवरी उपलब्ध नहीं है। PUBLIC_BASE_URL और Resend (RESEND_API_KEY, EMAIL_FROM) configure करें।",
      503
    );
  }

  const student = await findStudentByIdentifier(store, identifier);
  const authIdentities = studentAuthIdentities(student, identifier);
  await assertAuthUnlocked(store, "student", authIdentities);
  if (!student || !student.email || email(student.email) !== emailAddress) {
    return json({ ok: true, message: GENERIC_STUDENT_RESET_MESSAGE });
  }

  const previous = await getJson(store, K.studentPasswordResetIndex(student.id));
  if (previous?.tokenHash) {
    await store.delete(K.studentPasswordReset(previous.tokenHash));
  }
  const token = createResetToken();
  const tokenHash = hashResetToken(token);
  const expiresAt = Date.now() + STUDENT_RESET_TTL;
  await putJson(store, K.studentPasswordReset(tokenHash), {
    studentId: student.id,
    expiresAt,
  });
  await putJson(store, K.studentPasswordResetIndex(student.id), { tokenHash });
  const resetUrl = `${baseUrl}/exam/index.html?reset=${encodeURIComponent(token)}`;
  const delivery = await sendEmail(env, {
    to: student.email,
    subject: "छात्र पासवर्ड रीसेट",
    text: [
      `नमस्ते ${student.name},`,
      "पासवर्ड रीसेट करने के लिए इस लिंक को 30 मिनट के भीतर खोलें:",
      resetUrl,
      "यदि आपने यह अनुरोध नहीं किया है, तो इस ईमेल को अनदेखा करें।",
    ].join("\n\n"),
    html: `<p>नमस्ते ${escapeEmailHtml(student.name)},</p><p>पासवर्ड रीसेट करने के लिए <a href="${escapeEmailHtml(resetUrl)}">इस लिंक</a> को 30 मिनट के भीतर खोलें।</p><p>यदि आपने यह अनुरोध नहीं किया है, तो इस ईमेल को अनदेखा करें।</p>`,
  });
  if (!delivery.sent) {
    await store.delete(K.studentPasswordReset(tokenHash));
    await store.delete(K.studentPasswordResetIndex(student.id));
    throw new HttpError(
      "रीसेट ईमेल नहीं भेजा जा सका। ईमेल provider configuration जाँचकर फिर प्रयास करें।",
      503
    );
  }
  return json({ ok: true, message: GENERIC_STUDENT_RESET_MESSAGE });
}

export async function handleStudentResetPassword({ req, ctx, store }) {
  const ip = getIp(req, ctx);
  await rateLimit(store, "student-reset-password", ip, 8, 15 * 60 * 1000);
  const body = await readJson(req);
  const token = String(body.token || "");
  const newPassword = String(body.newPassword || "");
  if (!validResetToken(token)) {
    throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);
  }
  if (newPassword.length < 10 || newPassword.length > 128) {
    throw new HttpError("नया पासवर्ड 10 से 128 अक्षरों का होना चाहिए", 400);
  }
  const tokenHash = hashResetToken(token);
  const resetKey = K.studentPasswordReset(tokenHash);
  const pending = await getJson(store, resetKey);
  if (!pending || Number(pending.expiresAt) <= Date.now()) {
    throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);
  }
  const student = await getJson(store, K.students(pending.studentId));
  if (!student || student.active === false) {
    throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);
  }
  const authIdentities = studentAuthIdentities(student, `student:${student.id}`);
  await assertAuthUnlocked(store, "student", authIdentities);
  const currentIndex = await getJson(store, K.studentPasswordResetIndex(student.id));
  if (currentIndex?.tokenHash !== tokenHash) {
    throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);
  }
  const consumed = await store.consumeResetToken(resetKey, Date.now());
  if (!consumed) throw new HttpError("रीसेट लिंक अमान्य या समाप्त हो गया है", 400);

  student.passwordHash = await hashPassword(newPassword);
  student.mustChangePassword = false;
  student.authVersion = (Number(student.authVersion) || 0) + 1;
  delete student.pinHash;
  student.updatedAt = new Date().toISOString();
  await putJson(store, K.students(student.id), student);
  await store.delete(K.studentPasswordResetIndex(student.id));
  await clearAuthFailures(store, "student", authIdentities);
  await audit(store, "student.password.reset", student.id, { ip });
  return json({ ok: true, message: "पासवर्ड रीसेट हो गया है। अब नए पासवर्ड से लॉगिन करें।" });
}
