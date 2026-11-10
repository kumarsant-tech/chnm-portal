import { K, getJson, putJson } from "./db.mjs";
import { HttpError, json, readJson, getIp } from "./http.mjs";
import { clean, validateStudent, validKey, phone } from "./validate.mjs";
import { issueStudentToken, rateLimit, audit, checkPin } from "./auth.mjs";
import { publicSettings, studentSelf } from "./serializers.mjs";
import { loadCatalog, nextRegistrationId, publicSubject, publicTrade } from "./domain.mjs";
import { DEFAULT_SETTINGS } from "./seed.mjs";

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
  if (input.tradeId) {
    const trade = await getJson(store, K.trades(input.tradeId));
    if (!trade || trade.active === false) throw new HttpError("चुना गया ट्रेड उपलब्ध नहीं है", 400);
  }
  const holder = await getJson(store, K.mobileIndex(input.mobile));
  if (holder) throw new HttpError("यह मोबाइल नंबर पहले से रजिस्टर है", 409);

  const now = new Date().toISOString();
  const id = await nextRegistrationId(store);
  const student = {
    id,
    name: input.name,
    fatherName: input.fatherName,
    mobile: input.mobile,
    email: input.email,
    tradeId: input.tradeId,
    batch: input.batch,
    photo: input.photo,
    active: true,
    source: "self",
    createdAt: now,
    updatedAt: now,
  };
  await putJson(store, K.students(id), student);
  await putJson(store, K.mobileIndex(input.mobile), { studentId: id });
  await audit(store, "student.register", id, { ip });
  return json({ ok: true, token: issueStudentToken(id, env), student: studentSelf(student) });
}

export async function handleStudentLogin({ req, ctx, store, env }) {
  const ip = getIp(req, ctx);
  const body = await readJson(req);
  const id = clean(body.id, 40).toUpperCase();
  const mobile = phone(body.mobile);
  const pin = String(body.pin || "").trim();
  await rateLimit(store, "student-login", ip, 20, 15 * 60 * 1000);
  if (!validKey(id) || !mobile) {
    throw new HttpError("रजिस्ट्रेशन ID और 10 अंकों का मोबाइल नंबर दें", 400);
  }
  const student = await getJson(store, K.students(id));
  if (!student || student.mobile !== mobile) {
    throw new HttpError("रजिस्ट्रेशन ID या मोबाइल नंबर सही नहीं है", 401);
  }
  if (student.active === false) {
    throw new HttpError("यह छात्र खाता निष्क्रिय है — एडमिन से संपर्क करें", 403);
  }
  if (student.pinHash && !checkPin(pin, student.pinHash)) {
    throw new HttpError("PIN सही नहीं है", 401);
  }
  await audit(store, "student.login", student.id, { ip });
  return json({ ok: true, token: issueStudentToken(student.id, env), student: studentSelf(student) });
}
