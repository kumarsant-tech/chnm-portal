import { K, getJson, putJson, listJson, listKeys } from "./db.mjs";
import { normalizeText, DEFAULT_TRADE_ID, PRIMARY_SUBJECT_IDS } from "./validate.mjs";

export { DEFAULT_TRADE_ID, PRIMARY_SUBJECT_IDS };

export const DEFAULT_SUBJECTS = [
  { id: "trade-theory", name: "Trade Theory", code: "TT" },
  { id: "training-methodology", name: "Training Methodology (TM)", code: "TM" },
  { id: "soft-skills", name: "Soft Skills", code: "SS" },
];

export const DEFAULT_TRADES = [{ id: "chnm", name: "CHNM", code: "CHNM" }];

export const DEFAULT_SETTINGS = {
  siteName: "Future Instructor – CHNM Portal",
  collegeName: "Future Instructor Group",
  groupName: "Future Instructor Group",
  registrationOpen: true,
  defaultPassPct: 40,
  defaultDurationMin: 60,
  defaultInstructions:
    "1. परीक्षा शुरू होने के बाद टाइमर लगातार चलेगा।\n2. प्रत्येक प्रश्न के एक ही सही उत्तर को चुनें।\n3. Save & Next से अगले प्रश्न पर जाएँ।\n4. उत्तर बदलने के लिए उसी प्रश्न पर वापस जाएँ।\n5. परीक्षा समाप्त होने पर स्वतः सबमिट हो जाएगी।",
  defaultInstructionsEn:
    "1. Once the exam starts the timer keeps running continuously.\n2. Choose only one correct answer for each question.\n3. Use Save & Next to move to the next question.\n4. To change an answer, go back to the same question.\n5. The exam is submitted automatically when time ends.",
  resultsReleaseDefault: false,
  showAnswersDefault: false,
  maxPhotoKb: 200,
  updatedAt: null,
};

const SEED_MARKER = "settings/seed-defaults-v1";
const SCOPE_MARKER = "settings/subject-scope-v2";

// One-time, non-destructive: hides seeded subjects/trades that fall outside the
// three-subject CHNM model. Records still holding questions, exams or students
// are left untouched, and nothing is ever deleted — old questions stay visible
// to the admin because the admin catalog loads inactive records too.
async function ensureScope(store) {
  const scoped = await getJson(store, SCOPE_MARKER);
  if (scoped?.done) return;
  const now = new Date().toISOString();

  for (const subject of DEFAULT_SUBJECTS) {
    if (await getJson(store, K.subjects(subject.id))) continue;
    await putJson(store, K.subjects(subject.id), {
      ...subject,
      active: true,
      createdAt: now,
      updatedAt: now,
      seeded: true,
    });
  }

  const subjects = await listJson(store, "subjects/");
  for (const subject of subjects) {
    if (subject.active === false || PRIMARY_SUBJECT_IDS.includes(subject.id)) continue;
    const used = await countSubjectUsage(store, subject.id);
    if (used.questions || used.exams) continue;
    await putJson(store, K.subjects(subject.id), {
      ...subject,
      active: false,
      scopedOut: true,
      updatedAt: now,
    });
  }

  for (const trade of DEFAULT_TRADES) {
    if (await getJson(store, K.trades(trade.id))) continue;
    await putJson(store, K.trades(trade.id), {
      ...trade,
      active: true,
      createdAt: now,
      updatedAt: now,
      seeded: true,
    });
  }
  for (const trade of await listJson(store, "trades/")) {
    if (trade.active === false || trade.id === DEFAULT_TRADE_ID) continue;
    const used = await countTradeUsage(store, trade.id);
    if (used.exams || used.students) continue;
    await putJson(store, K.trades(trade.id), {
      ...trade,
      active: false,
      scopedOut: true,
      updatedAt: now,
    });
  }

  await putJson(store, SCOPE_MARKER, { done: true, at: now });
}

export async function ensureSeed(store) {
  let settings = await getJson(store, K.settings());
  if (!settings) {
    settings = { ...DEFAULT_SETTINGS, createdAt: new Date().toISOString() };
    await putJson(store, K.settings(), settings);
  }
  const marker = await getJson(store, SEED_MARKER);
  if (marker?.done) {
    await ensureScope(store);
    return settings;
  }

  const now = new Date().toISOString();
  await ensureScope(store);
  try {
    await seedLegacyQuestions(store);
  } catch (error) {
    console.error("प्रारंभिक प्रश्न बैंक seed नहीं हो सका", error);
  }
  await putJson(store, SEED_MARKER, { done: true, at: now });
  return settings;
}

// The 27 questions from the original exam module.
// Format: [subject, question, options, correct index, explanation]
export const LEGACY_QUESTIONS = [
  ["TM", "शिल्पकार प्रशिक्षण योजना (CTS) कब शुरू हुई?", ["1947", "1950", "1961", "1972"], 1, "CTS 1950 में शुरू हुई।"],
  ["TM", "NSQF में कुल कितने स्तर हैं?", ["5", "8", "10", "12"], 2, "NSQF में लेवल 1 से 10 तक हैं।"],
  ["TM", "पावलोव किस सिद्धांत से जुड़े हैं?", ["शास्त्रीय अनुबंधन", "क्रिया-प्रसूत अनुबंधन", "प्रयास-त्रुटि", "सूझ"], 0, "पावलोव = Classical Conditioning।"],
  ["TM", "स्किनर किस सिद्धांत से जुड़े हैं?", ["शास्त्रीय अनुबंधन", "क्रिया-प्रसूत (Operant)", "सूझ", "अनुकरण"], 1, "स्किनर = Operant Conditioning।"],
  ["TM", "ADDIE मॉडल में पहला 'A' क्या है?", ["Analysis", "Assessment", "Application", "Approval"], 0, "Analysis, Design, Development, Implementation, Evaluation।"],
  ["TM", "संशोधित ब्लूम टैक्सोनॉमी में सबसे ऊँचा स्तर कौन-सा है?", ["याद रखना", "समझना", "विश्लेषण", "सृजन (Create)"], 3, "संशोधित वर्गीकरण में Create सबसे ऊपर है।"],
  ["TM", "माइक्रो-टीचिंग चक्र की मानक अवधि कितनी होती है?", ["20 मिनट", "36 मिनट", "45 मिनट", "60 मिनट"], 1, "6+6+12+6+6 = 36 मिनट।"],
  ["TM", "अपरेंटिस अधिनियम किस वर्ष बना?", ["1950", "1961", "1975", "1988"], 1, "Apprentices Act, 1961।"],
  ["TM", "रचनात्मक मूल्यांकन (Formative) कब होता है?", ["प्रशिक्षण के दौरान", "केवल अंत में", "प्रवेश से पहले", "कभी नहीं"], 0, "यह सीखने के दौरान फीडबैक के लिए होता है।"],
  ["TM", "OHP किस प्रकार की सहायक सामग्री है?", ["प्रोजेक्टेड विज़ुअल एड", "नॉन-प्रोजेक्टेड एड", "ऑडियो एड", "3D मॉडल"], 0, "OHP एक projected visual aid है।"],
  ["Trade Theory", "SMPS का पूरा नाम क्या है?", ["Switch Mode Power Supply", "Simple Main Power Supply", "Single Mode Power Supply", "Sync Main Power System"], 0, "Switch Mode Power Supply।"],
  ["Trade Theory", "कौन-सी मेमोरी Volatile है?", ["RAM", "ROM", "BIOS चिप", "हार्ड डिस्क"], 0, "बिजली जाने पर RAM का डेटा मिट जाता है।"],
  ["Trade Theory", "HTTP का डिफ़ॉल्ट पोर्ट कौन-सा है?", ["21", "53", "80", "25"], 2, "HTTP = 80, HTTPS = 443।"],
  ["Trade Theory", "DNS का डिफ़ॉल्ट पोर्ट कौन-सा है?", ["53", "67", "110", "443"], 0, "DNS = 53।"],
  ["Trade Theory", "क्लास C का डिफ़ॉल्ट सबनेट मास्क क्या है?", ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"], 2, "/24 = 255.255.255.0।"],
  ["Trade Theory", "स्ट्रेट-थ्रू RJ45 केबल में दोनों सिरों पर पिन-आउट कैसा होता है?", ["सिर्फ T568A", "सिर्फ T568B", "दोनों सिरों पर एक ही", "दोनों अलग"], 2, "Straight-through में दोनों सिरे एक ही मानक पर होते हैं।"],
  ["Trade Theory", "DHCP का काम क्या है?", ["IP पता अपने-आप देना", "नाम से IP खोजना", "ईमेल भेजना", "फाइल शेयर करना"], 0, "DHCP = Dynamic Host Configuration Protocol।"],
  ["Trade Theory", "SCR में कुल कितने टर्मिनल होते हैं?", ["2", "3", "4", "5"], 1, "Anode, Cathode, Gate।"],
  ["Trade Theory", "ESD से बचाव के लिए क्या पहनें?", ["एंटी-स्टैटिक रिस्ट स्ट्रैप", "ऊनी कपड़े", "गीले हाथ", "सिर्फ रबर चप्पल"], 0, "रिस्ट स्ट्रैप स्थैतिक चार्ज को ग्राउंड कर देता है।"],
  ["Trade Theory", "POST का पूरा नाम क्या है?", ["Power On Self Test", "Primary Operating System Test", "Program On Start Test", "Power Output Safety Test"], 0, "POST बूट के समय हार्डवेयर जाँचता है।"],
  ["Trade Theory", "नेटवर्क स्विच सामान्यतः OSI की किस लेयर पर काम करता है?", ["Layer 1", "Layer 2", "Layer 4", "Layer 7"], 1, "सामान्य स्विच Data Link (Layer 2) पर चलता है।"],
  ["Soft Skills", "एक्टिव लिसनिंग क्या है?", ["बीच में टोकना", "ध्यान से सुनकर प्रतिक्रिया देना", "फोन देखते रहना", "सिर्फ बोलना"], 1, "ध्यान से सुनना और जवाब देना।"],
  ["Soft Skills", "SWOT में 'S' का मतलब क्या है?", ["Strengths", "Skills", "Speed", "Safety"], 0, "Strengths, Weaknesses, Opportunities, Threats।"],
  ["Soft Skills", "इंटरव्यू में सबसे अच्छा व्यवहार कौन-सा है?", ["समय से पहले पहुँचना", "देर से आना", "बिना तैयारी जाना", "फोन चालू रखना"], 0, "समय की पाबंदी पहली छाप बनाती है।"],
  ["Soft Skills", "'जरूरी और अर्जेंट' काम के साथ क्या करें?", ["तुरंत करें", "टाल दें", "छोड़ दें", "किसी और को टरकाएँ"], 0, "Eisenhower matrix: Do first।"],
  ["Soft Skills", "480 का 25% कितना होता है?", ["100", "120", "150", "90"], 1, "480 ÷ 4 = 120।"],
  ["Soft Skills", "संवाद में सबसे बड़ी बाधा कौन-सी है?", ["शोर", "स्पष्ट भाषा", "आँख मिलाना", "सारांश देना"], 0, "शोर (Noise) संदेश बिगाड़ता है।"],
];

const LEGACY_SUBJECT_MAP = {
  TM: "training-methodology",
  "Trade Theory": "trade-theory",
  "Soft Skills": "soft-skills",
};

export async function seedLegacyQuestions(store) {
  const subjects = await listJson(store, "subjects/");
  const byName = new Map(subjects.map((subject) => [subject.name.toLowerCase(), subject]));
  const added = [];
  const skipped = [];
  const now = new Date().toISOString();

  for (let index = 0; index < LEGACY_QUESTIONS.length; index += 1) {
    const [subjectName, text, options, correctIndex, explanation] = LEGACY_QUESTIONS[index];
    const subject =
      byName.get(subjectName.toLowerCase()) ||
      byName.get(LEGACY_SUBJECT_MAP[subjectName]?.replace(/-/g, " ")) ||
      subjects.find((item) => item.id === LEGACY_SUBJECT_MAP[subjectName]);
    if (!subject) {
      skipped.push({ index: index + 1, reason: `विषय नहीं मिला: ${subjectName}` });
      continue;
    }
    const qid = `LEG-${String(index + 1).padStart(3, "0")}`;
    const existingIndex = await getJson(store, K.questionIndex(qid));
    if (existingIndex) {
      skipped.push({ index: index + 1, reason: "पहले से मौजूद" });
      continue;
    }
    const subjectQuestions = await listJson(store, `questions/${subject.id}/`);
    const duplicate = subjectQuestions.find((question) => normalizeText(question.text) === normalizeText(text));
    if (duplicate) {
      skipped.push({ index: index + 1, reason: `डुप्लीकेट: ${duplicate.qid}` });
      continue;
    }
    const question = {
      qid,
      subjectId: subject.id,
      text,
      options,
      correctIndex,
      marks: 1,
      negativeMarks: 0,
      explanation,
      image: "",
      active: true,
      source: "legacy",
      createdAt: now,
      updatedAt: now,
    };
    await putJson(store, K.questions(subject.id, qid), question);
    await putJson(store, K.questionIndex(qid), { qid, subjectId: subject.id });
    added.push(qid);
  }
  return { added, skipped, total: LEGACY_QUESTIONS.length };
}

export async function subjectNameMap(store) {
  const subjects = await listJson(store, "subjects/");
  return new Map(subjects.map((subject) => [subject.id, subject.name]));
}

export async function tradeNameMap(store) {
  const trades = await listJson(store, "trades/");
  return new Map(trades.map((trade) => [trade.id, trade.name]));
}

export async function countSubjectUsage(store, subjectId) {
  const questions = await listKeys(store, `questions/${subjectId}/`);
  const exams = (await listJson(store, "exams/")).filter((exam) => exam.subjectId === subjectId);
  return { questions: questions.length, exams: exams.length };
}

export async function countTradeUsage(store, tradeId) {
  const exams = (await listJson(store, "exams/")).filter((exam) => exam.tradeId === tradeId);
  const students = (await listJson(store, "students/")).filter((student) => student.tradeId === tradeId);
  return { exams: exams.length, students: students.length };
}
