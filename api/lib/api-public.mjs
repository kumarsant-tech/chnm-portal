import { K, getJson, putJson, listJson } from "./db.mjs";
import { HttpError, json, readJson, getIp } from "./http.mjs";
import { clean, validateStudent, phone, temporaryPasswordFromDob } from "./validate.mjs";
import {
  issueStudentToken,
  rateLimit,
  clearRateLimit,
  audit,
  checkPin,
  checkPassword,
  hashPassword,
} from "./auth.mjs";
import { publicSettings, studentSelf } from "./serializers.mjs";
import { loadCatalog, nextRegistrationId, publicSubject, publicTrade } from "./domain.mjs";
import { DEFAULT_SETTINGS } from "./seed.mjs";
import { sendEmail, escapeEmailHtml } from "./email.mjs";

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
    passwordHash: hashPassword(temporaryPasswordFromDob(input.dateOfBirth)),
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
      text: [
        `नमस्ते ${student.name},`,
        "आपका परीक्षा पोर्टल रजिस्ट्रेशन सफलतापूर्वक पूरा हो गया है।",
        `लॉगिन ID: ${loginId}`,
        `ग्रुप: ${groupName}`,
        "पहली बार लॉगिन करने के लिए अपनी जन्मतिथि DDMMYYYY प्रारूप में अस्थायी पासवर्ड के रूप में दर्ज करें। इसके बाद नया पासवर्ड सेट करना आवश्यक है।",
      ].join("\n\n"),
      html: `<p>नमस्ते ${escapeEmailHtml(student.name)},</p><p>आपका परीक्षा पोर्टल रजिस्ट्रेशन सफलतापूर्वक पूरा हो गया है।</p><p><strong>लॉगिन ID:</strong> ${escapeEmailHtml(loginId)}<br><strong>ग्रुप:</strong> ${escapeEmailHtml(groupName)}</p><p>पहली बार लॉगिन करने के लिए अपनी जन्मतिथि DDMMYYYY प्रारूप में अस्थायी पासवर्ड के रूप में दर्ज करें। इसके बाद नया पासवर्ड सेट करना आवश्यक है।</p>`,
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
  await rateLimit(store, "student-login-id", identifier, 8, 15 * 60 * 1000);
  const student = await findStudentByIdentifier(store, identifier);
  if (!student) throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
  if (student.active === false) {
    throw new HttpError("यह छात्र खाता निष्क्रिय है — एडमिन से संपर्क करें", 403);
  }
  if (student.passwordHash) {
    if (!checkPassword(password, student.passwordHash)) {
      throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
    }
  } else {
    const legacyIdMatches = identifier === String(student.id).toUpperCase() ||
      identifier === String(student.mobile || "");
    if (!legacyIdMatches || !mobile || mobile !== student.mobile) {
      throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
    }
    if (student.pinHash && !checkPin(password, student.pinHash)) {
      throw new HttpError("लॉगिन ID या पासवर्ड सही नहीं है", 401);
    }
    if (!student.mustChangePassword) {
      student.mustChangePassword = true;
      await putJson(store, K.students(student.id), student);
    }
  }
  await clearRateLimit(store, "student-login-id", identifier);
  await audit(store, "student.login", student.id, { ip });
  return json({
    ok: true,
    token: issueStudentToken(student.id, env),
    student: studentSelf(student),
    requiresPasswordChange: Boolean(student.mustChangePassword || !student.passwordHash),
  });
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

export async function handleStudentPasswordChange({ req, ctx, store, student }) {
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
  if (student.passwordHash && !checkPassword(currentPassword, student.passwordHash)) {
    throw new HttpError("अस्थायी/वर्तमान पासवर्ड सही नहीं है", 401);
  }
  if (!student.passwordHash && student.pinHash && !checkPin(currentPassword, student.pinHash)) {
    throw new HttpError("वर्तमान PIN सही नहीं है", 401);
  }
  student.passwordHash = hashPassword(newPassword);
  student.mustChangePassword = false;
  delete student.pinHash;
  student.updatedAt = new Date().toISOString();
  await putJson(store, K.students(student.id), student);
  await audit(store, "student.password.change", student.id, { ip: getIp(req, ctx) });
  return json({ ok: true, student: studentSelf(student) });
}
