/* Future Instructor – CHNM Portal · CBT exam screen */
(function () {
  "use strict";

  const UI = window.UI;
  const $ = UI.$;
  const esc = UI.esc;

  function readLang() {
    try {
      return localStorage.getItem("fig.cbt.lang") === "en" ? "en" : "hi";
    } catch {
      return "hi";
    }
  }

  const state = {
    token: "",
    examParam: "",
    student: null,
    exam: null,
    paper: null,
    attempt: null,
    responses: {},
    marked: new Set(),
    visited: new Set(),
    current: 0,
    seq: 0,
    dirty: false,
    saving: false,
    pendingSave: false,
    submitted: false,
    submitting: false,
    started: false,
    autoTried: false,
    lang: readLang(),
    brandName: "",
    settings: null,
    instrStep: 0,
    paletteFilter: "all",
    offset: 0,
    tickTimer: 0,
    saveTimer: 0,
    retryTimer: 0,
    warned: { ten: false, five: false, one: false },
    fsExits: 0,
  };

  const els = {};
  const ids = [
    "loadingView", "landingView", "cbtView", "finishedView",
    "landingTitle", "landingSub", "landingType", "landingMeta", "landingNotice",
    "startBtn", "landingResultWrap", "declareCheck", "declareWrap",
    "instrSheet", "instrTitle", "instrSub", "instrStep", "instrBody", "instrBack", "instrNext", "instrDots",
    "landingLangHi", "landingLangEn", "langHi", "langEn", "topLangHi", "topLangEn", "markNextBtn",
    "cbtTitle", "cbtSub", "cbtBrandName", "cbtBrandSub", "candAvatar", "candName", "candReg", "timerBox", "timerText",
    "miniAvatar", "miniName", "miniReg", "miniTrade", "sideDate", "sideMobile", "paletteProgress",
    "qNo", "qType", "qMarkedTag", "qMarks", "qText", "qImage", "options",
    "paperType", "instrBtn", "submitBtnTop",
    "fsBanner", "fsBtn", "fsBtnBanner", "fsExitCount",
    "clearBtn", "markBtn", "prevBtn", "saveNextBtn",
    "palette", "paletteFilters", "paletteEmpty",
    "countAnswered", "countRemaining", "countMarked", "countNotVisited",
    "syncStatus", "answeredCount", "paletteToggle", "paletteClose", "sidePanel",
    "drawerBackdrop", "submitBtn", "submitBtnFoot", "offlineBanner",
    "submitGate", "submitGateFoot",
    "finishTitle", "finishMessage", "finishResultId", "finishResult", "finishDash",
    "toastWrap",
  ];
  ids.forEach((id) => {
    els[id] = document.getElementById(id);
  });

  function shadowKey() {
    return "fig.test." + state.examParam;
  }

  function showView(name) {
    ["loadingView", "landingView", "cbtView", "finishedView"].forEach((id) => {
      if (els[id]) els[id].hidden = id !== name;
    });
    document.body.classList.toggle("cbt-body", name === "cbtView");
    document.body.classList.toggle("cbt-landing", name === "landingView");
  }

  function goLogin() {
    UI.clearStudentSession();
    window.location.replace("index.html");
  }

  function isNetwork(error) {
    return !error || error.status === 0;
  }

  function showFatal(hi, en, withRetry) {
    els.loadingView.hidden = true;
    showView("landingView");
    els.landingTitle.textContent = hi;
    els.landingSub.textContent = en;
    els.landingMeta.innerHTML = "";
    els.landingNotice.innerHTML = "";
    if (els.instrBody) {
      els.instrBody.innerHTML =
        '<div class="notice bad">' +
        esc(hi) +
        "<br><small>" +
        esc(en) +
        "</small>" +
        (withRetry ? '<button class="btn btn-sm btn-ghost" type="button" data-retry>फिर कोशिश करें / Retry</button>' : "") +
        "</div>";
      els.instrBody.scrollIntoView({ block: "nearest" });
    }
    const foot = els.instrSheet && els.instrSheet.querySelector(".instr-foot");
    if (foot) foot.hidden = true;
    if (els.declareWrap) els.declareWrap.hidden = true;
    els.startBtn.hidden = true;
    const retry = els.instrBody && els.instrBody.querySelector("[data-retry]");
    if (retry) retry.addEventListener("click", () => window.location.reload());
  }

  function handleAuthError(error, context) {
    if (error && error.status === 401) {
      goLogin();
      return true;
    }
    if (error && error.status === 409 && /सत्र|session/i.test(error.message || "")) {
      UI.modal({
        title: "परीक्षा सत्र बदल गया / Examination session changed",
        subtitle: context || "",
        size: "sm",
        dismissible: false,
        body:
          '<p class="confirm-message">यह परीक्षा किसी दूसरे डिवाइस या टैब में खोली गई है। ' +
          "सुरक्षा के लिए यह पेज अब सक्रिय नहीं है — कृपया डैशबोर्ड से परीक्षा दोबारा खोलें।</p>" +
          '<p class="confirm-message"><small>This exam was opened on another device or tab, so for safety this page is no longer active. ' +
          "Please reopen the exam from your dashboard.</small></p>",
        actions: [
          { label: "डैशबोर्ड पर जाएँ / Go to Dashboard", tone: "btn-navy", onClick: () => window.location.replace("index.html") },
        ],
      });
      return true;
    }
    return false;
  }

  /* ---------- formatting ---------- */
  function setSync(text, tone) {
    if (!els.syncStatus) return;
    els.syncStatus.className = "sync" + (tone ? " " + tone : "");
    const label = els.syncStatus.querySelector("span");
    if (label) label.textContent = text;
  }

  function updateAnsweredLabel() {
    const total = state.paper ? state.paper.questions.length : 0;
    const answered = Object.keys(state.responses).length;
    if (els.answeredCount) {
      els.answeredCount.innerHTML = bi(answered + " / " + total + " उत्तर दिए", answered + " / " + total + " answered");
    }
  }

  /* ---------- bilingual paper ---------- */
  const HAS_DEVANAGARI = /[\u0900-\u097F]/;

  function splitBilingual(text) {
    const raw = String(text || "");
    const separator = " / ";
    const first = raw.indexOf(separator);
    if (first >= 0) {
      const a = raw.slice(0, first).trim();
      if (a && a === raw.slice(first + separator.length).trim()) return { hi: a, en: a };
    }
    let hindiFirst = -1;
    let englishFirst = -1;
    for (let at = raw.indexOf(separator); at >= 0; at = raw.indexOf(separator, at + separator.length)) {
      const leftHindi = HAS_DEVANAGARI.test(raw.slice(0, at));
      const rightHindi = HAS_DEVANAGARI.test(raw.slice(at + separator.length));
      if (leftHindi && !rightHindi) {
        hindiFirst = at;
        break;
      }
      if (englishFirst < 0 && !leftHindi && rightHindi) englishFirst = at;
    }
    if (hindiFirst < 0 && englishFirst < 0) return { hi: raw, en: raw };
    const at = hindiFirst >= 0 ? hindiFirst : englishFirst;
    const hi = raw.slice(0, at).trim();
    const en = raw.slice(at + separator.length).trim();
    if (!hi || !en) {
      const single = hi || en || raw;
      return { hi: single, en: single };
    }
    return hindiFirst >= 0 ? { hi, en } : { hi: en, en: hi };
  }

  function paintLangButtons() {
    [
      [els.landingLangHi, "hi"],
      [els.landingLangEn, "en"],
      [els.langHi, "hi"],
      [els.langEn, "en"],
      [els.topLangHi, "hi"],
      [els.topLangEn, "en"],
    ].forEach(([button, value]) => {
      if (!button) return;
      const active = state.lang === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLang(lang) {
    state.lang = lang === "en" ? "en" : "hi";
    try {
      localStorage.setItem("fig.cbt.lang", state.lang);
    } catch {
      /* storage can be disabled; language still applies this session */
    }
    paintLangButtons();
    if (state.paper) renderQuestion();
  }

  function syncDeclaration() {
    const lastStep = state.instrStep >= INSTRUCTION_STEPS.length - 1;
    if (els.declareWrap) els.declareWrap.hidden = !lastStep;
    if (!els.startBtn || els.startBtn.hidden) return;
    els.startBtn.disabled = !(lastStep && els.declareCheck && els.declareCheck.checked);
  }

  /* ---------- bilingual interface labels ---------- */
  function bi(hi, en) {
    return '<span class="bi-hi">' + esc(hi) + '</span><span class="bi-en">' + esc(en) + "</span>";
  }

  function row(labelHi, labelEn, value) {
    return (
      '<div class="instr-row"><span>' +
      esc(labelHi) +
      " / " +
      esc(labelEn) +
      "</span><b>" +
      esc(value) +
      "</b></div>"
    );
  }

  function rule(hi, en) {
    return '<li><span class="bi-hi">' + esc(hi) + '</span><span class="bi-en">' + esc(en) + "</span></li>";
  }

  const INSTRUCTION_STEPS = [
    { hi: "परीक्षा का विवरण", en: "Exam Details" },
    { hi: "प्रश्न पैलेट और चिह्न", en: "Question Palette & Symbols" },
    { hi: "महत्वपूर्ण निर्देश", en: "Important Instructions" },
    { hi: "घोषणा और सहमति", en: "Declaration & Agreement" },
  ];

  function paletteSample(cls, hi, en) {
    return (
      '<div class="pal-sample"><span class="pal-btn ' +
      cls +
      '">12</span><span class="bi-hi">' +
      esc(hi) +
      '</span><span class="bi-en">' +
      esc(en) +
      "</span></div>"
    );
  }

  function specialInstructions() {
    const exam = state.exam || {};
    const hi = String(exam.instructions || "").trim();
    const en = String(exam.instructionsEn || "").trim() || String((state.settings && state.settings.defaultInstructionsEn) || "").trim();
    if (!hi && !en) return "";
    return (
      '<div class="instr-block"><h4>विशेष निर्देश / Special Instructions</h4>' +
      (hi ? '<p class="instr-hi">' + esc(hi) + "</p>" : "") +
      (en ? '<p class="instr-en">' + esc(en) + "</p>" : "") +
      "</div>"
    );
  }

  function markingText(kind) {
    const marks = UI.trimNumber(state.exam.marksPerQuestion || 0);
    const negative = Number(state.exam.negativeMarks) || 0;
    if (kind === "correct") return "+" + marks + " अंक / marks";
    if (kind === "wrong") return negative > 0 ? "−" + UI.trimNumber(negative) + " अंक / marks" : "0 (कोई ऋणात्मक अंक नहीं / no negative marking)";
    return "0 अंक / marks";
  }

  function instructionHtml(step) {
    const exam = state.exam || {};
    const total = Number(exam.totalQuestions) || 0;

    if (step === 0) {
      return (
        '<div class="instr-block"><h4>यह पेपर हिंदी और अंग्रेज़ी दोनों में है</h4>' +
        '<p class="instr-en">This question paper is available in both Hindi and English. Use the हिंदी / English button to change the language of the question and its options; both languages are always shown for the question text.</p></div>' +
        '<div class="instr-block"><h4>परीक्षा विवरण / Exam Summary</h4>' +
        [
          row("परीक्षा", "Examination", exam.title || "—"),
          row("विषय", "Subject", exam.subjectName || "—"),
          row("ट्रेड", "Trade", exam.tradeName || "CHNM"),
          row("अवधि", "Duration", UI.fmtDuration(exam.durationMin)),
          row("प्रश्नों की संख्या", "Total no. of questions", String(total)),
          row("कुल अंक", "Maximum marks", UI.fmtMarks(exam.totalMarks)),
          row("सही उत्तर", "Correct answer", markingText("correct")),
          row("ग़लत उत्तर", "Wrong answer", markingText("wrong")),
          row("बिना उत्तर", "Unanswered", markingText("unanswered")),
          row("पास प्रतिशत", "Passing percentage", UI.fmtPct(exam.passPct)),
          row("अनुमत प्रयास", "Attempts allowed", String(exam.attemptsAllowed || 1)),
          row("पेपर का प्रकार", "Question paper type", "Objective MCQ — " + UI.examTypeLabel(exam.type)),
        ].join("") +
        "</div>"
      );
    }

    if (step === 1) {
      return (
        '<div class="instr-block"><h4>स्क्रीन के दाईं ओर प्रश्न पैलेट / Question Palette on the right</h4>' +
        '<p class="instr-en">हर प्रश्न संख्या उसकी स्थिति बताती है। / Every question number shows its own status:</p>' +
        '<div class="pal-samples">' +
        paletteSample("not-visited", "अभी नहीं देखा", "Not Visited") +
        paletteSample("not-answered", "उत्तर नहीं दिया", "Not Answered") +
        paletteSample("answered", "उत्तर दिया", "Answered") +
        paletteSample("marked", "समीक्षा हेतु चिह्नित", "Marked for Review") +
        paletteSample("marked answered", "उत्तर दिया और चिह्नित", "Answered & Marked") +
        "</div>" +
        '<p class="instr-en">पैलेट के नीचे के बटन (All, Answered, Not Answered, Marked, Not Visited, Answered &amp; Marked) से केवल उसी स्थिति के प्रश्न दिखाए जा सकते हैं। / The buttons below the palette (All, Answered, Not Answered, Marked, Not Visited, Answered &amp; Marked) filter the question numbers by status.</p></div>' +
        '<div class="instr-block"><h4>प्रश्न के नीचे के बटन / Buttons below the question</h4>' +
        '<ul class="instr-list">' +
        rule("बाईं ओर नीचे — समीक्षा हेतु चिह्नित: इस प्रश्न को बाद में देखने के लिए चिह्नित करता है; चुना हुआ उत्तर वैसा ही रहता है। दोबारा दबाने पर चिह्न हट जाता है।", "Bottom left — Mark for Review: flags this question to look at again later; the answer you chose stays as it is. Press again to remove the mark.") +
        rule("बाईं ओर नीचे — उत्तर हटाएँ: इस प्रश्न का चुना हुआ उत्तर साफ़ कर देता है।", "Bottom left — Clear Response: removes the option chosen for this question.") +
        rule("दाईं ओर नीचे — उत्तर + चिह्नित कर अगला: उत्तर सहेजता है, प्रश्न समीक्षा हेतु चिह्नित भी होता है, फिर अगले प्रश्न पर चले जाते हैं।", "Bottom right — Answer & Mark for Review & Next: saves the answer, marks the question for review, then moves to the next question.") +
        rule("दाईं ओर नीचे — सहेजें और अगला: उत्तर सहेजकर अगले प्रश्न पर ले जाता है।", "Bottom right — Save & Next: saves the answer and moves to the next question.") +
        rule("दाईं ओर नीचे — ← पिछला: पिछले प्रश्न पर वापस जाने के लिए।", "Bottom right — Back: returns to the previous question.") +
        rule("पैलेट की प्रश्न संख्या दबाकर सीधे उस प्रश्न पर जा सकते हैं।", "Click any question number in the palette to jump straight to that question.") +
        "</ul></div>"
      );
    }

    if (step === 2) {
      return (
        '<div class="instr-block"><h4>नियम / Rules</h4><ol class="instr-list">' +
        rule("परीक्षा शुरू होने के बाद टाइमर चलता रहेगा — यह सर्वर पर गिना जाता है।", "Once the examination starts the timer keeps counting down; it is counted on the server.") +
        rule("पेज रीफ़्रेश, बंद या नेविगेट न करें। उत्तर अपने आप सुरक्षित होते रहते हैं।", "Do not refresh, close or navigate away from this page. Your answers are saved automatically.") +
        rule("यह परीक्षा केवल एक ही डिवाइस और एक ही ब्राउज़र टैब में दें।", "Attempt this examination on one device and one browser tab only.") +
        rule("परीक्षा शुरू करते ही यह पेज फ़ुल स्क्रीन हो जाएगा। कंप्यूटर में ESC दबाने, या मोबाइल/टच में ऊपर वाली परीक्षा पट्टी पर दो बार टैप करने से फ़ुल स्क्रीन बंद होती है — तब ऊपर पीली पट्टी दिखेगी, उसमें “फ़ुल स्क्रीन करें” बटन दबाकर वापस जाएँ। फ़ुल स्क्रीन बंद रहने पर भी टाइमर नहीं रुकता।", "The page goes full screen as soon as the examination starts. Press ESC on a computer, or tap twice on the top exam bar on a phone, to leave full screen — a yellow strip then appears; use its “Enter Full Screen” button to go back. The timer does not stop while full screen is off.") +
        rule("नेटवर्क जाने पर घबराएँ नहीं — उत्तर डिवाइस में रहते हैं और कनेक्शन आते ही सिंक हो जाते हैं।", "If the internet drops, do not panic — answers stay on this device and sync as soon as the connection returns.") +
        rule("अंतिम सबमिट का बटन तब तक नहीं दिखता, जब तक पेपर के 90% प्रश्नों के उत्तर न दे दें या परीक्षा के 30 मिनट न बीत जाएँ (कम समय वाली परीक्षा में कुल समय का तीन-चौथाई)। शर्त पूरी होते ही बटन अपने आप दिखने लगेगा।", "The Final Submit button stays hidden until 90% of the questions are answered or 30 minutes of the examination have passed (three-quarters of the total time in a shorter exam). It appears by itself as soon as either happens.") +
        rule("समय 00:00 होने पर परीक्षा अपने आप जमा हो जाएगी।", "The examination is submitted automatically when the time reaches 00:00.") +
        rule("हर प्रश्न के केवल एक ही उत्तर चुनें; ग़लत उत्तर पर " + markingText("wrong") + ", बिना उत्तर पर " + markingText("unanswered") + "।", "Choose only one option per question. A wrong answer scores " + markingText("wrong") + ", an unanswered question scores " + markingText("unanswered") + ".") +
        rule("किसी भी प्रकार की नकल, सहायता या अनुचित साधन परीक्षा रद्द करा सकता है।", "Copying, help from anyone, or any unfair means can lead to cancellation of the examination.") +
        rule("परिणाम संस्थान द्वारा घोषित किए जाने के बाद ही डैशबोर्ड पर दिखेगा।", "The result appears on your dashboard only after the institute releases it.") +
        rule("तकनीकी समस्या होने पर तुरंत पर्यवेक्षक/सर से बताएँ।", "Report any technical problem to the invigilator or instructor immediately.") +
        "</ol>" + specialInstructions() + "</div>"
      );
    }

    return (
      '<div class="instr-block"><h4>घोषणा / Declaration</h4>' +
      '<p class="instr-hi">मैं प्रमाणित करता/करती हूँ कि मैंने उपरोक्त सभी निर्देश ध्यान से पढ़ और समझ लिए हैं, और मैं इन्हीं शर्तों के अंतर्गत यह परीक्षा दे रहा/रही हूँ। परीक्षा के नियम तोड़ने पर मेरा परिणाम रद्द किया जा सकता है।</p>' +
      '<p class="instr-en">I certify that I have carefully read and understood all the instructions above and I am taking this examination under the same conditions. My result may be cancelled if any examination rule is broken.</p></div>' +
      '<div class="instr-block"><h4>आगे बढ़ने के लिए / To proceed</h4>' +
      '<p class="instr-hi">नीचे दिया गया सहमति बॉक्स भरें, फिर “परीक्षा शुरू करें” दबाएँ। सहमति के बिना टाइमर नहीं चलेगा।</p>' +
      '<p class="instr-en">Tick the agreement box below, then press “Start Examination”. The timer does not start until you agree.</p></div>'
    );
  }

  function renderInstructions() {
    const step = INSTRUCTION_STEPS[state.instrStep];
    if (els.instrTitle) els.instrTitle.textContent = step.hi;
    if (els.instrSub) els.instrSub.textContent = step.en;
    if (els.instrStep) els.instrStep.textContent = state.instrStep + 1 + " / " + INSTRUCTION_STEPS.length;
    if (els.instrBody) els.instrBody.innerHTML = instructionHtml(state.instrStep);
    if (els.instrBack) els.instrBack.disabled = state.instrStep === 0;
    if (els.instrNext) els.instrNext.hidden = state.instrStep >= INSTRUCTION_STEPS.length - 1;
    if (els.instrDots) {
      els.instrDots.innerHTML = INSTRUCTION_STEPS.map(
        (_, index) => '<i class="' + (index === state.instrStep ? "on" : "") + '"></i>'
      ).join("");
    }
    syncDeclaration();
  }

  function goInstructionStep(delta) {
    const next = Math.max(0, Math.min(INSTRUCTION_STEPS.length - 1, state.instrStep + delta));
    if (next === state.instrStep) return;
    state.instrStep = next;
    renderInstructions();
    if (els.instrBody) els.instrBody.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function instructionSheetHtml() {
    return INSTRUCTION_STEPS.map(
      (step, index) =>
        '<div class="instr-sheet-block"><h4>' +
        esc(step.hi) +
        " / " +
        esc(step.en) +
        "</h4>" +
        instructionHtml(index) +
        "</div>"
    ).join("");
  }

  function openInstructionSheet() {
    UI.modal({
      title: "निर्देश / Instructions",
      subtitle: (state.exam && state.exam.title) || "परीक्षा / Examination",
      size: "lg",
      body: '<div class="instr-body instr-body-modal">' + instructionSheetHtml() + "</div>",
      actions: [{ label: "बंद करें / Close", tone: "btn-navy", onClick: (handle) => handle.close() }],
    });
  }

  /* ---------- local shadow ---------- */
  function persistShadow() {
    if (!state.attempt || state.submitted) return;
    try {
      localStorage.setItem(
        shadowKey(),
        JSON.stringify({
          examId: state.examParam,
          attemptId: state.attempt.attemptId,
          responses: state.responses,
          marked: [...state.marked],
          visited: [...state.visited],
          current: state.current,
          seq: state.seq,
          savedAt: Date.now(),
        })
      );
    } catch {
      /* private mode: autosave to server still works */
    }
  }

  function readShadow() {
    try {
      const raw = localStorage.getItem(shadowKey());
      if (!raw) return null;
      const value = JSON.parse(raw);
      if (!value || value.examId !== state.examParam) return null;
      return value;
    } catch {
      return null;
    }
  }

  function clearShadow() {
    try {
      localStorage.removeItem(shadowKey());
    } catch {
      /* ignore */
    }
  }

  function validResponses(paper, source) {
    const output = {};
    if (!source || typeof source !== "object") return output;
    for (const question of paper.questions) {
      const raw = source[question.qid];
      if (Number.isInteger(raw) && raw >= 0 && raw < question.options.length) {
        output[question.qid] = raw;
      }
    }
    return output;
  }

  function validQids(paper, list) {
    const valid = new Set(paper.questions.map((question) => question.qid));
    if (!Array.isArray(list)) return [];
    return [...new Set(list.map(String).filter((qid) => valid.has(qid)))];
  }

  /* ---------- cloud load / timer offset ---------- */
  function syncClock(serverNow) {
    const value = Number(serverNow);
    if (Number.isFinite(value) && value > 0) state.offset = value - Date.now();
  }

  async function api(action, payload) {
    const data = await UI.call(action, payload, state.token);
    if (data && data.serverNow) syncClock(data.serverNow);
    return data;
  }

  function serverNow() {
    return Date.now() + state.offset;
  }

  /* ---------- institute branding ---------- */
  function updateDocumentTitle() {
    const group = state.brandName || "Future Instructor";
    const exam = state.exam && state.exam.title;
    document.title = (exam ? exam + " · " : "परीक्षा · ") + group;
  }

  function applyInstituteBrand(settings) {
    const source = settings || {};
    state.settings = source;
    const group = String(source.collegeName || source.siteName || "").trim();
    if (!group) return;
    state.brandName = group;
    if (els.cbtBrandName) els.cbtBrandName.textContent = group;
    if (els.cbtBrandSub) els.cbtBrandSub.textContent = "CHNM परीक्षा पोर्टल";
    const headerBrand = document.querySelector(".fi-header .brand-text strong");
    if (headerBrand) headerBrand.textContent = group;
    updateDocumentTitle();
  }

  /* ---------- entrance ---------- */
  async function init() {
    state.token = UI.studentToken();
    state.examParam = UI.query("exam") || UI.query("examId") || UI.query("id");
    if (!state.token) {
      goLogin();
      return;
    }
    if (!state.examParam) {
      showFatal("परीक्षा नहीं चुनी गई", "कृपया डैशबोर्ड से परीक्षा चुनें / Please choose an examination from the dashboard.");
      return;
    }

    state.student = UI.studentData();
    paintLangButtons();
    bindEvents();
    syncDeclaration();
    UI.bootstrap()
      .then((data) => {
        applyInstituteBrand(data && data.settings);
        if (!state.started && els.landingView && !els.landingView.hidden) renderInstructions();
      })
      .catch(() => {});
    try {
      if (!state.student) {
        const dash = await api("student_dashboard", {});
        state.student = dash.student;
        UI.setStudentSession(state.token, dash.student);
      }
      await loadExam();
    } catch (error) {
      if (handleAuthError(error)) return;
      showFatal(
        "परीक्षा लोड नहीं हो सकी",
        (error.message || "परीक्षा लोड नहीं हो सकी") + " / The examination could not be loaded.",
        true
      );
    }
  }

  async function loadExam() {
    const data = await api("student_exam_get", { examId: state.examParam });
    state.exam = data.exam;
    state.attempt = data.attempt;
    state.paper = data.paper;
    if (state.attempt) {
      state.seq = Number(state.attempt.seq) || 0;
      state.responses = validResponses(state.paper, state.attempt.responses);
      state.marked = new Set(validQids(state.paper, state.attempt.marked));
      state.visited = new Set(validQids(state.paper, state.attempt.visited));
      state.current = clampIndex(state.attempt.current);
      const shadow = readShadow();
      if (shadow && shadow.attemptId === state.attempt.attemptId) {
        const shadowSeq = Number(shadow.seq) || 0;
        if (shadowSeq > state.seq) {
          state.seq = shadowSeq;
          state.responses = validResponses(state.paper, shadow.responses);
          state.marked = new Set(validQids(state.paper, shadow.marked));
          state.visited = new Set(validQids(state.paper, shadow.visited));
          state.current = clampIndex(shadow.current);
          state.dirty = true;
        }
      }
    }
    renderLanding(data);
    updateDocumentTitle();
    els.loadingView.hidden = true;
    showView("landingView");
    syncDeclaration();
    if (state.attempt && state.paper) {
      setSync(
        state.dirty
          ? "अभी सुरक्षित नहीं — फिर शुरू करने पर सिंक होगा / Not synced yet — it will sync when you resume"
          : "उत्तर सुरक्षित हैं / Answers saved",
        state.dirty ? "saving" : ""
      );
    }
  }

  function clampIndex(value) {
    const total = state.paper ? state.paper.questions.length : 0;
    if (!total) return 0;
    const n = Number(value);
    if (!Number.isInteger(n)) return 0;
    return Math.max(0, Math.min(total - 1, n));
  }

  function setStartButton(hi, en) {
    els.startBtn.innerHTML = bi(hi, en);
  }

  function renderLanding(data) {
    const exam = state.exam;
    const student = state.student || {};
    els.landingTitle.textContent = exam.title || "परीक्षा";
    els.landingSub.textContent =
      [exam.subjectName, exam.code ? "कोड / Code: " + exam.code : "", exam.tradeName]
        .filter(Boolean)
        .join(" · ");
    els.landingType.className = "pill " + (exam.type === "practice" ? "info" : "dark");
    els.landingType.textContent = UI.examTypeLabel(exam.type) + " परीक्षा / Examination";

    els.landingMeta.innerHTML = [
      ["प्रश्न / Questions", String(exam.totalQuestions || 0)],
      ["पूर्णांक / Max marks", UI.fmtMarks(exam.totalMarks)],
      ["अवधि / Duration", UI.fmtDuration(exam.durationMin)],
      ["पास % / Passing", UI.fmtPct(exam.passPct)],
      ["प्रति प्रश्न / Per question", UI.trimNumber(exam.marksPerQuestion) + " अंक / marks"],
      [
        "ऋणात्मक / Negative",
        exam.negativeMarks ? "−" + UI.trimNumber(exam.negativeMarks) : "नहीं / None",
      ],
    ]
      .map(
        ([label, value]) =>
          "<div><small>" + esc(label) + "</small><b>" + esc(value) + "</b></div>"
      )
      .join("");

    const notices = [];
    const result = data.result || null;
    const resultId = exam.resultId || (result && result.resultId) || "";
    const completed = Boolean(exam.completed || resultId);

    if (student.name) {
      notices.push(
        "<strong>अभ्यर्थी / Candidate:</strong> " + esc(student.name) + " (" + esc(student.id || "") + ")"
      );
    }
    if (exam.type === "final") {
      notices.push(
        "यह फाइनल परीक्षा है — सबमिट के बाद उत्तर नहीं बदले जा सकते। / This is a final examination; answers cannot be changed after submit."
      );
    } else {
      notices.push(
        "यह अभ्यास परीक्षा है — सबमिट के बाद उत्तर और व्याख्या तुरंत दिखेंगे / This is a practice test; answers and explanations appear right after submit."
      );
    }
    if (exam.attemptsAllowed > 1 && !completed) {
      notices.push(
        "अनुमत प्रयास / Attempts allowed: " +
          exam.attemptsAllowed +
          " · अब तक / used: " +
          (exam.attemptsUsed || 0)
      );
    }

    const practiceRetry =
      completed &&
      exam.type === "practice" &&
      (exam.attemptsUsed || 0) < (exam.attemptsAllowed || 1) &&
      (!exam.availability || exam.availability.canStart);

    if (completed) {
      const pending = exam.resultPending || (result && result.percentage === null);
      notices.push(
        pending
          ? "<strong>यह परीक्षा पूरी हो चुकी है।</strong> परिणाम अभी घोषित नहीं हुआ है। / <strong>This exam is already complete.</strong> The result is not declared yet."
          : "<strong>यह परीक्षा पूरी हो चुकी है।</strong> आपका परिणाम उपलब्ध है। / <strong>This exam is already complete.</strong> Your result is available."
      );
      if (practiceRetry) {
        notices.push(
          "अभ्यास के लिए अभी " +
            ((exam.attemptsAllowed || 1) - (exam.attemptsUsed || 0)) +
            " प्रयास शेष हैं। नया प्रयास शुरू करने पर पिछला परिणाम सुरक्षित रहेगा। / " +
            ((exam.attemptsAllowed || 1) - (exam.attemptsUsed || 0)) +
            " practice attempts remain. Your previous result stays safe."
        );
        els.startBtn.hidden = false;
        setStartButton("फिर से अभ्यास करें", "Practice Again");
      } else {
        els.startBtn.hidden = true;
      }
    } else {
      const availability = exam.availability || {};
      if (!exam.availability || exam.availability.canStart) {
        els.startBtn.hidden = false;
        setStartButton(
          state.attempt ? "परीक्षा फिर से शुरू करें" : "परीक्षा शुरू करें",
          state.attempt ? "Resume Examination" : "Start Examination"
        );
        if (state.attempt) {
          notices.push(
            "<strong>आपकी चालू परीक्षा सुरक्षित है।</strong> वहीं से आगे बढ़ें। / <strong>Your ongoing answers are saved.</strong> Continue from where you left."
          );
        }
        if (!exam.availability && exam.status !== "published") {
          els.startBtn.disabled = true;
          setStartButton("परीक्षा उपलब्ध नहीं", "Examination not available");
        }
      } else {
        els.startBtn.hidden = false;
        els.startBtn.disabled = true;
        setStartButton("अभी उपलब्ध नहीं", "Not available yet");
        notices.push("<strong>" + esc(availabilityText(availability)) + "</strong>");
      }
    }

    els.landingNotice.innerHTML = notices.length
      ? '<div class="notice info">' + notices.join("<br>") + "</div>"
      : "";
    els.landingResultWrap.innerHTML = "";
    if (resultId) {
      const link = document.createElement("a");
      link.className = "btn btn-ghost";
      link.href = "result.html?resultId=" + encodeURIComponent(resultId);
      link.textContent = "परिणाम देखें / View Result";
      els.landingResultWrap.appendChild(link);
    }
    state.instrStep = 0;
    renderInstructions();
  }

  function availabilityText(availability) {
    if (!availability) return "";
    if (availability.reason) return availability.reason;
    return UI.availabilityText(availability);
  }

  async function startExam() {
    if (!state.exam) return;
    if (state.instrStep < INSTRUCTION_STEPS.length - 1) {
      UI.toast("पहले अंतिम निर्देश पृष्ठ तक जाएँ / Please read through all instruction pages first", "warn");
      return;
    }
    if (els.declareCheck && !els.declareCheck.checked) {
      UI.toast("पहले निर्देश पढ़कर सहमति दें / Read the instructions and accept the declaration first", "warn");
      return;
    }
    // क्लिक के ही gesture से फ़ुल स्क्रीन माँगते हैं — बाद में browser इसे रोक देता है
    requestExamFullscreen(true);
    UI.setButtonBusy(els.startBtn, true, "शुरू हो रहा है… / Starting…");
    try {
      const data = await api("student_start", { examId: state.examParam });
      state.exam = data.exam || state.exam;
      state.attempt = data.attempt;
      state.paper = data.paper;
      if (!state.paper || !state.paper.questions || !state.paper.questions.length) {
        throw new Error("इस परीक्षा का पेपर उपलब्ध नहीं है — एडमिन से संपर्क करें / This question paper is not available — contact the instructor");
      }
      state.seq = Number(state.attempt.seq) || 1;
      state.responses = validResponses(state.paper, state.attempt.responses);
      state.marked = new Set(validQids(state.paper, state.attempt.marked));
      state.visited = new Set(validQids(state.paper, state.attempt.visited));
      state.current = clampIndex(state.attempt.current);

      const shadow = readShadow();
      if (shadow && shadow.attemptId === state.attempt.attemptId && Number(shadow.seq) > state.seq) {
        state.seq = Number(shadow.seq);
        state.responses = validResponses(state.paper, shadow.responses);
        state.marked = new Set(validQids(state.paper, shadow.marked));
        state.visited = new Set(validQids(state.paper, shadow.visited));
        state.current = clampIndex(shadow.current);
        state.dirty = true;
      }

      state.started = true;
      state.submitted = false;
      enterCbt();
      if (state.dirty) saveNow();
    } catch (error) {
      if (handleAuthError(error)) return;
      UI.toast(error.message || "परीक्षा शुरू नहीं हो सकी", "bad");
    } finally {
      UI.setButtonBusy(els.startBtn, false);
    }
  }

  /* ---------- CBT ---------- */
  function enterCbt() {
    showView("cbtView");
    renderCandidate();
    state.visited.add(state.paper.questions[state.current].qid);
    renderAll();
    startTimer();
    renderFsUi();
    setSync("उत्तर सुरक्षित हैं / Answers saved", "");
    if (state.dirty) saveNow();
    window.setTimeout(() => els.options.querySelector("input")?.focus(), 80);
  }

  /* ---------- परीक्षा फ़ुल स्क्रीन / exam full screen ---------- */
  let fsPainted = "";
  let lastFsTap = 0;

  function fsNode() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
  }

  function fsPossible() {
    if (document.fullscreenEnabled === false || document.webkitFullscreenEnabled === false) return false;
    const el = document.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen || el.webkitEnterFullscreen || el.msRequestFullscreen);
  }

  function fsEnter() {
    const el = document.documentElement;
    const call = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen || el.webkitEnterFullscreen;
    if (!call) return Promise.reject(new Error("unsupported"));
    try {
      const out = call.call(el, { navigationUI: "hide" });
      return out && typeof out.then === "function" ? out : Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function fsLeave() {
    const call = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!call || !fsNode()) return Promise.resolve();
    try {
      const out = call.call(document);
      if (out && typeof out.then === "function") return out.catch(() => {});
    } catch {
      /* already out of full screen */
    }
    return Promise.resolve();
  }

  function renderFsUi() {
    const running = state.started && !state.submitted;
    const shown = !!fsNode();
    const possible = fsPossible();
    const key = [running, shown, possible, state.fsExits].join("|");
    if (key === fsPainted) return;
    fsPainted = key;
    if (els.fsBtn) {
      els.fsBtn.hidden = !(running && possible);
      els.fsBtn.classList.toggle("urgent", running && !shown);
      els.fsBtn.setAttribute("aria-pressed", shown ? "true" : "false");
      els.fsBtn.title = shown
        ? "फ़ुल स्क्रीन से बाहर / Exit full screen (ESC)"
        : "फ़ुल स्क्रीन करें / Enter full screen";
    }
    if (els.fsBanner) els.fsBanner.hidden = !(running && !shown && possible);
    if (els.fsExitCount) {
      els.fsExitCount.hidden = state.fsExits < 1;
      els.fsExitCount.textContent = "× " + state.fsExits;
    }
  }

  function requestExamFullscreen(withHint) {
    if (!fsPossible()) {
      if (withHint) {
        UI.toast(
          "इस ब्राउज़र में फ़ुल स्क्रीन उपलब्ध नहीं है — परीक्षा सामान्य स्क्रीन पर भी पूरी चलेगी / Full screen is not available in this browser; the exam still works normally.",
          "warn"
        );
      }
      renderFsUi();
      return;
    }
    fsEnter()
      .then(() => renderFsUi())
      .catch(() => {
        if (withHint) {
          UI.toast("फ़ुल स्क्रीन अपने आप नहीं खुली — “फ़ुल स्क्रीन करें” बटन दबाएँ / Full screen did not open — press the Full Screen button", "warn");
        }
        renderFsUi();
      });
  }

  function toggleExamFullscreen() {
    if (fsNode()) {
      fsLeave().then(() => renderFsUi());
      return;
    }
    requestExamFullscreen(true);
  }

  function onFsChange() {
    if (!fsNode() && state.started && !state.submitted) state.fsExits += 1;
    renderFsUi();
  }

  /* मोबाइल/टच: ऊपर की परीक्षा पट्टी पर दो बार टैप = फ़ुल स्क्रीन बंद (कंप्यूटर में ESC) */
  function onFsDoubleTap(event) {
    if (!fsNode()) return;
    if (event.target.closest("button, input, select, a, .cbt-lang")) return;
    const now = Date.now();
    if (now - lastFsTap > 420) {
      lastFsTap = now;
      return;
    }
    lastFsTap = 0;
    if (event.cancelable) event.preventDefault();
    fsLeave().then(() => {
      renderFsUi();
      UI.toast("फ़ुल स्क्रीन बंद की — वापस जाने के लिए “फ़ुल स्क्रीन करें” दबाएँ / Full screen closed — press Enter Full Screen to go back", "warn");
    });
  }

  function renderCandidate() {
    const student = state.student || {};
    const photo = student.photo || "";
    els.candAvatar.innerHTML = UI.avatar(photo, student.name, "avatar");
    els.miniAvatar.innerHTML = UI.avatar(photo, student.name, "avatar");
    els.candName.textContent = student.name || "";
    els.candReg.textContent = student.id || "";
    els.miniName.textContent = student.name || "";
    els.miniReg.textContent = student.id || "";
    els.miniTrade.textContent =
      state.exam.tradeName || [student.tradeName, student.batch].filter(Boolean).join(" · ") || "—";
    if (els.sideMobile) els.sideMobile.textContent = student.mobile || "—";
    if (els.sideDate) {
      const value = state.attempt && state.attempt.startedAt ? new Date(state.attempt.startedAt) : new Date();
      els.sideDate.textContent = Number.isNaN(value.getTime())
        ? "—"
        : value.toLocaleDateString("en-GB");
    }
    els.cbtTitle.textContent = state.exam.title || "परीक्षा";
    els.cbtSub.textContent =
      (state.exam.subjectName || "") +
      (state.exam.code ? " · " + state.exam.code : "") +
      " · " + UI.examTypeLabel(state.exam.type);
    if (els.paperType) {
      els.paperType.innerHTML =
        "<b>प्रश्न पत्र का प्रकार / Question Paper Type:</b> Objective MCQ · " +
        esc(UI.examTypeLabel(state.exam.type));
    }
  }

  function currentQuestion() {
    return state.paper ? state.paper.questions[state.current] : null;
  }

  function renderAll() {
    renderQuestion();
    renderPalette();
    updateAnsweredLabel();
    updateMarkButton();
    renderSubmitGate();
  }

  function bilingualHtml(text) {
    const parts = splitBilingual(text);
    if (parts.hi === parts.en) return esc(parts.hi);
    const primary = state.lang === "en" ? parts.en : parts.hi;
    const other = state.lang === "en" ? parts.hi : parts.en;
    const otherLabel = state.lang === "en" ? "हिंदी में" : "In English";
    return (
      '<span class="q-primary">' +
      esc(primary) +
      '</span><span class="q-alt"><small>' +
      esc(otherLabel) +
      "</small> " +
      esc(other) +
      "</span>"
    );
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (!question) {
      els.qText.innerHTML = bi("कोई प्रश्न उपलब्ध नहीं है।", "No question is available.");
      els.options.innerHTML = "";
      return;
    }
    const total = state.paper.questions.length;
    const number = state.current + 1;
    els.qNo.innerHTML = bi("प्रश्न " + number + " / " + total, "Question " + number + " / " + total);
    if (els.qType) els.qType.innerHTML = bi("वस्तुनिष्ठ — एक सही उत्तर", "Objective — single correct answer");
    const marks = UI.trimNumber(question.marks ?? state.exam.marksPerQuestion ?? 1);
    const negative = Number(question.negativeMarks ?? state.exam.negativeMarks) || 0;
    els.qMarks.innerHTML =
      "<b>+" + marks + "</b>" + (negative > 0 ? "<span class=\"q-neg\">−" + UI.trimNumber(negative) + "</span>" : "");
    els.qMarks.title = "सही उत्तर पर अंक / marks for correct answer · ग़लत उत्तर पर अंक / marks for wrong answer";
    els.qMarkedTag.hidden = !state.marked.has(question.qid);
    if (!els.qMarkedTag.hidden) {
      els.qMarkedTag.innerHTML = bi("● समीक्षा हेतु चिह्नित", "● Marked for review");
    }

    els.qText.innerHTML = bilingualHtml(question.text);
    if (question.image) {
      els.qImage.src = question.image;
      els.qImage.hidden = false;
    } else {
      els.qImage.removeAttribute("src");
      els.qImage.hidden = true;
    }

    const selected = state.responses[question.qid];
    els.options.innerHTML = question.options
      .map((text, index) => {
        const active = selected === index;
        return (
          '<label class="option' + (active ? " selected" : "") + '">' +
          '<input type="radio" name="qopt" value="' + index + '"' + (active ? " checked" : "") + ">" +
          '<span class="opt-key">' + UI.optionLetter(index) + "</span>" +
          '<span class="opt-text">' + bilingualHtml(text) + "</span>" +
          "</label>"
        );
      })
      .join("");

    els.prevBtn.disabled = state.current === 0;
    const last = state.current === total - 1;
    els.saveNextBtn.innerHTML = last
      ? bi("सहेजें और समीक्षा करें", "Save & Review")
      : bi("सहेजें और अगला", "Save & Next");
    if (last) els.saveNextBtn.classList.add("btn-navy");
    else els.saveNextBtn.classList.remove("btn-navy");
  }

  const PALETTE_FILTERS = [
    { key: "all", hi: "सभी", en: "All" },
    { key: "answered", hi: "उत्तर दिए", en: "Answered" },
    { key: "notAnswered", hi: "उत्तर नहीं दिए", en: "Not Answered" },
    { key: "marked", hi: "चिह्नित", en: "Marked" },
    { key: "answeredMarked", hi: "उत्तर + चिह्नित", en: "Answered & Marked" },
    { key: "notVisited", hi: "नहीं देखे", en: "Not Visited" },
  ];

  function statusOf(question) {
    const answered = Number.isInteger(state.responses[question.qid]);
    const marked = state.marked.has(question.qid);
    if (marked && answered) return "answeredMarked";
    if (marked) return "marked";
    if (answered) return "answered";
    if (state.visited.has(question.qid)) return "notAnswered";
    return "notVisited";
  }

  const STATUS_CLASS = {
    answered: "answered",
    notAnswered: "not-answered",
    notVisited: "not-visited",
    marked: "marked",
    answeredMarked: "marked answered",
  };

  function matchesFilter(filter, status) {
    return filter === "all" || filter === status;
  }

  function renderPaletteFilters(statuses) {
    if (!els.paletteFilters) return;
    els.paletteFilters.innerHTML = PALETTE_FILTERS.map((filter) => {
      const value = statuses.filter((status) => matchesFilter(filter.key, status)).length;
      return (
        '<button type="button" class="pal-filter' +
        (state.paletteFilter === filter.key ? " active" : "") +
        '" data-filter="' +
        filter.key +
        '" aria-pressed="' +
        (state.paletteFilter === filter.key ? "true" : "false") +
        '">' +
        esc(filter.hi) +
        " / " +
        esc(filter.en) +
        "<b>" +
        value +
        "</b></button>"
      );
    }).join("");
  }

  function renderPalette() {
    const questions = state.paper.questions;
    const statuses = questions.map(statusOf);
    els.palette.innerHTML = questions
      .map((question, index) => {
        const classes = ["pal-btn", STATUS_CLASS[statuses[index]]];
        if (index === state.current) classes.push("current");
        return (
          '<button type="button" class="' + classes.join(" ") + '" data-index="' + index +
          '" aria-label="प्रश्न ' + (index + 1) + " / Question " + (index + 1) + '"' +
          (index === state.current ? ' aria-current="true"' : "") +
          (matchesFilter(state.paletteFilter, statuses[index]) ? "" : " hidden") +
          ">" + (index + 1) + "</button>"
        );
      })
      .join("");
    const shown = statuses.filter((status) => matchesFilter(state.paletteFilter, status)).length;
    if (els.paletteEmpty) els.paletteEmpty.hidden = shown > 0;
    renderPaletteFilters(statuses);

    const countOf = (status) => statuses.filter((value) => value === status).length;
    const answered = statuses.filter((status) => status === "answered" || status === "answeredMarked").length;
    els.countAnswered.textContent = String(answered);
    els.countRemaining.textContent = String(countOf("notAnswered"));
    els.countMarked.textContent = String(countOf("marked") + countOf("answeredMarked"));
    els.countNotVisited.textContent = String(countOf("notVisited"));
    if (els.paletteProgress) {
      els.paletteProgress.textContent = (state.current + 1) + " / " + questions.length;
    }
  }

  function updateMarkButton() {
    const question = currentQuestion();
    if (!question) return;
    const marked = state.marked.has(question.qid);
    els.markBtn.innerHTML = marked
      ? bi("चिह्न हटाएँ", "Remove Review Mark")
      : bi("समीक्षा हेतु चिह्नित", "Mark for Review");
    els.markBtn.classList.toggle("btn-warn", marked);
    els.markBtn.classList.toggle("btn-soft", !marked);
  }

  function goTo(index) {
    if (!state.paper) return;
    const next = Math.max(0, Math.min(state.paper.questions.length - 1, index));
    state.current = next;
    state.visited.add(state.paper.questions[next].qid);
    state.seq += 1;
    state.dirty = true;
    persistShadow();
    renderAll();
    els.options.querySelector("input")?.focus();
    scheduleSave();
  }

  function selectOption(index) {
    const question = currentQuestion();
    if (!question) return;
    state.visited.add(question.qid);
    state.responses[question.qid] = index;
    state.seq += 1;
    state.dirty = true;
    persistShadow();
    renderQuestion();
    renderPalette();
    updateAnsweredLabel();
    renderSubmitGate();
    scheduleSave();
  }

  function clearResponse() {
    const question = currentQuestion();
    if (!question) return;
    if (!Number.isInteger(state.responses[question.qid])) {
      UI.toast("इस प्रश्न का कोई उत्तर नहीं दिया गया है / This question has no answer to clear", "warn");
      return;
    }
    delete state.responses[question.qid];
    state.seq += 1;
    state.dirty = true;
    persistShadow();
    renderAll();
    scheduleSave();
  }

  function toggleMark() {
    const question = currentQuestion();
    if (!question) return;
    if (state.marked.has(question.qid)) state.marked.delete(question.qid);
    else state.marked.add(question.qid);
    state.visited.add(question.qid);
    state.seq += 1;
    state.dirty = true;
    persistShadow();
    renderQuestion();
    renderPalette();
    updateMarkButton();
    scheduleSave();
  }

  function markAndNext() {
    const question = currentQuestion();
    if (!question) return;
    if (!state.marked.has(question.qid)) {
      state.marked.add(question.qid);
      state.visited.add(question.qid);
      state.seq += 1;
      state.dirty = true;
      persistShadow();
      scheduleSave();
    }
    const last = state.current === state.paper.questions.length - 1;
    if (last) renderAll();
    else goTo(state.current + 1);
  }

  function saveAndNext() {
    const last = state.current === state.paper.questions.length - 1;
    if (last) {
      saveNow();
      openSubmit();
      return;
    }
    goTo(state.current + 1);
    saveNow();
  }

  /* ---------- autosave ---------- */
  function scheduleSave() {
    setSync("सुरक्षित किया जा रहा है… / Saving…", "saving");
    window.clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(saveNow, 900);
  }

  async function saveNow() {
    if (!state.attempt || state.submitted || !state.started) return;
    if (state.saving) {
      state.pendingSave = true;
      return;
    }
    window.clearTimeout(state.saveTimer);
    if (!state.dirty) {
      setSync("उत्तर सुरक्षित हैं / Answers saved", "");
      return;
    }
    const snapshot = {
      seq: state.seq,
      responses: Object.assign({}, state.responses),
      marked: [...state.marked],
      visited: [...state.visited],
      current: state.current,
    };
    state.saving = true;
    state.pendingSave = false;
    setSync("सुरक्षित किया जा रहा है… / Saving…", "saving");
    try {
      const data = await api("student_autosave", {
        examId: state.examParam,
        attemptId: state.attempt.attemptId,
        seq: snapshot.seq,
        responses: snapshot.responses,
        marked: snapshot.marked,
        visited: snapshot.visited,
        current: snapshot.current,
      });
      if (data.expired || data.submitted) {
        if (data.resultId) finish(data.resultId, true);
        return;
      }
      if (state.seq === snapshot.seq) state.dirty = false;
      if (Number(data.savedSeq) > state.seq) state.seq = Number(data.savedSeq);
      if (data.endAt) state.attempt.endAt = data.endAt;
      setSync(
        new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }) +
          " बजे सुरक्षित / saved",
        ""
      );
      persistShadow();
    } catch (error) {
      if (handleAuthError(error) || state.submitted) return;
      state.dirty = true;
      setSync(
        isNetwork(error)
          ? "कनेक्शन नहीं — स्थानीय रूप से सुरक्षित / Offline — saved on this device"
          : "सिंक में समस्या — दोबारा कोशिश होगी / Sync problem — retrying",
        "error"
      );
      window.clearTimeout(state.retryTimer);
      state.retryTimer = window.setTimeout(saveNow, 6000);
      if (!isNetwork(error) && error.status !== 429) {
        UI.toast(error.message || "ऑटो-सेव नहीं हो सका / Autosave failed", "bad");
      }
    } finally {
      state.saving = false;
      if (state.pendingSave && !state.submitted) {
        state.pendingSave = false;
        scheduleSave();
      }
    }
  }

  /* ---------- timer ---------- */
  function startTimer() {
    window.clearInterval(state.tickTimer);
    tick();
    state.tickTimer = window.setInterval(tick, 500);
  }

  function tick() {
    if (!state.attempt || state.submitted) return;
    const remainingMs = Number(state.attempt.endAt) - serverNow();
    const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
    els.timerText.textContent = UI.fmtClock(seconds);
    els.timerBox.classList.toggle("warn", seconds <= 600 && seconds > 300);
    els.timerBox.classList.toggle("danger", seconds <= 300);
    if (seconds <= 600 && !state.warned.ten) {
      state.warned.ten = true;
      UI.toast("परीक्षा में 10 मिनट शेष हैं / 10 minutes left", "warn");
    }
    if (seconds <= 300 && !state.warned.five) {
      state.warned.five = true;
      UI.toast("परीक्षा में केवल 5 मिनट शेष हैं / Only 5 minutes left", "bad");
    }
    if (seconds <= 60 && !state.warned.one) {
      state.warned.one = true;
      UI.toast("अंतिम 1 मिनट — उत्तर जाँच लें / Last 1 minute — check your answers", "bad");
    }
    renderSubmitGate();
    renderFsUi();
    if (remainingMs <= 0 && !state.submitting) {
      autoSubmit();
    }
  }

  async function autoSubmit() {
    if (state.submitted || state.submitting) return;
    state.autoTried = true;
    setSync("समय समाप्त — परीक्षा स्वतः सबमिट हो रही है / Time over — submitting", "saving");
    await submitExam(true);
  }

  /* ---------- submit ---------- */
  function summary() {
    const questions = state.paper.questions;
    let answered = 0;
    for (const question of questions) {
      if (Number.isInteger(state.responses[question.qid])) answered += 1;
    }
    return {
      total: questions.length,
      answered,
      unanswered: questions.length - answered,
      marked: state.marked.size,
    };
  }

  function submitRow(hi, en, value, cls) {
    return (
      '<tr><td><span class="pal-swatch ' +
      cls +
      '"></span>' +
      esc(hi) +
      " / " +
      esc(en) +
      "</td><td><b>" +
      value +
      "</b></td></tr>"
    );
  }

  /* ---------- अंतिम सबमिट खोलने की शर्त / final submit gate ---------- */
  const SUBMIT_ANSWER_RATIO = 0.9;
  const SUBMIT_WAIT_MIN = 30;
  let gatePainted = "";

  function submitGateState() {
    const questions = state.paper ? state.paper.questions : [];
    const total = questions.length;
    let answered = 0;
    for (const question of questions) {
      if (Number.isInteger(state.responses[question.qid])) answered += 1;
    }
    const needAnswered = Math.ceil(total * SUBMIT_ANSWER_RATIO);
    const startedAt = Number(state.attempt && state.attempt.startedAt) || serverNow();
    const endAt = Number(state.attempt && state.attempt.endAt) || startedAt;
    const totalMs = Math.max(0, endAt - startedAt);
    // छोटी परीक्षा में इंतज़ार कुल समय से ज़्यादा न हो — तीन-चौथाई तक सीमित।
    const waitMs = totalMs > 0
      ? Math.min(SUBMIT_WAIT_MIN * 60000, totalMs * 0.75)
      : SUBMIT_WAIT_MIN * 60000;
    const elapsedMs = Math.max(0, serverNow() - startedAt);
    return {
      total,
      answered,
      needAnswered,
      waitMin: Math.max(1, Math.round(waitMs / 60000)),
      elapsedMin: Math.floor(elapsedMs / 60000),
      byAnswers: needAnswered > 0 && answered >= needAnswered,
      byTime: elapsedMs >= waitMs,
    };
  }

  function gateHintEnglish(moreAnswers, moreMinutes) {
    return "Submit: " + moreAnswers + " more answer" + (moreAnswers === 1 ? "" : "s") +
      " or " + moreMinutes + " more minute" + (moreMinutes === 1 ? "" : "s");
  }

  function renderSubmitGate() {
    if (!state.paper || !state.attempt || state.submitted) return;
    const gate = submitGateState();
    const open = gate.byAnswers || gate.byTime;
    const mark = open ? "open" : gate.answered + "|" + gate.elapsedMin;
    if (mark === gatePainted) return;
    const wasLocked = gatePainted !== "" && gatePainted !== "open";
    gatePainted = mark;
    [els.submitBtnTop, els.submitBtn, els.submitBtnFoot].forEach((button) => {
      if (button) button.hidden = !open;
    });
    if (els.submitGate) els.submitGate.hidden = open;
    if (els.submitGateFoot) els.submitGateFoot.hidden = open;
    if (open) {
      if (wasLocked) UI.toast("अंतिम सबमिट खुल गया / Final submit is now available", "good");
      return;
    }
    const moreAnswers = Math.max(0, gate.needAnswered - gate.answered);
    const moreMinutes = Math.max(0, gate.waitMin - gate.elapsedMin);
    if (els.submitGate) {
      els.submitGate.innerHTML = bi(
        "🔒 अंतिम सबमिट अभी बंद है। यह खुलेगा जब पेपर के 90% यानी कम से कम " + gate.needAnswered +
          " प्रश्नों के उत्तर हो जाएँ, या परीक्षा के " + gate.waitMin + " मिनट बीत जाएँ। अभी " +
          gate.answered + "/" + gate.total + " उत्तर और " + gate.elapsedMin + " मिनट पूरे हुए हैं।",
        "🔒 Final submit is still locked. It opens once 90% of the paper (at least " + gate.needAnswered +
          " answers) is reached or " + gate.waitMin + " minutes of the exam have passed. Right now: " +
          gate.answered + "/" + gate.total + " answered, " + gate.elapsedMin + " minutes gone."
      );
    }
    if (els.submitGateFoot) {
      els.submitGateFoot.innerHTML =
        esc("🔒 सबमिट: " + moreAnswers + " और उत्तर या " + moreMinutes + " मिनट शेष") +
        " / " +
        esc(gateHintEnglish(moreAnswers, moreMinutes));
    }
  }

  function openSubmit() {
    if (state.submitted || state.submitting) return;
    const gate = submitGateState();
    if (!gate.byAnswers && !gate.byTime) {
      UI.toast(
        "अंतिम सबमिट अभी बंद है / Final submit is locked — " +
          gateHintEnglish(
            Math.max(0, gate.needAnswered - gate.answered),
            Math.max(0, gate.waitMin - gate.elapsedMin)
          ),
        "warn"
      );
      renderSubmitGate();
      return;
    }
    const counts = summary();
    const seconds = Math.max(0, Math.ceil((Number(state.attempt.endAt) - serverNow()) / 1000));
    const statuses = state.paper.questions.map(statusOf);
    const countOf = (status) => statuses.filter((value) => value === status).length;
    UI.modal({
      title: "क्या आप परीक्षा समाप्त करना चाहते हैं?",
      subtitle: "Do you want to finish the examination? सबमिट के बाद उत्तर नहीं बदले जा सकते / Answers cannot be changed after submitting.",
      size: "sm",
      body:
        '<table class="data submit-summary"><tbody>' +
        submitRow("उत्तर दिया", "Answered", countOf("answered"), "answered") +
        submitRow("उत्तर नहीं दिए", "Not Answered", statuses.filter((s) => s === "notAnswered").length, "not-answered") +
        submitRow("समीक्षा हेतु चिह्नित", "Marked for Review", countOf("marked"), "marked") +
        submitRow("उत्तर दिया और चिह्नित", "Answered & Marked", countOf("answeredMarked"), "marked answered") +
        submitRow("अभी नहीं देखे", "Not Visited", countOf("notVisited"), "not-visited") +
        '<tr class="total"><td>कुल प्रश्न / Total questions</td><td><b>' + counts.total + "</b></td></tr>" +
        "</tbody></table>" +
        '<p class="confirm-message">शेष समय / Time left: <b>' + UI.fmtClock(seconds) + "</b></p>",
      actions: [
        { label: "नहीं, परीक्षा जारी रखें / No, continue", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "हाँ, अंतिम सबमिट / Yes, Final Submit",
          tone: "btn-navy",
          onClick: (handle) => {
            handle.close();
            submitExam(false);
          },
        },
      ],
    });
  }

  async function submitExam(auto) {
    if (state.submitted || state.submitting) return;
    state.submitting = true;
    window.clearTimeout(state.saveTimer);
    setSync(
      auto ? "स्वतः सबमिट हो रहा है… / Submitting automatically…" : "सबमिट हो रहा है… / Submitting…",
      "saving"
    );
    const payload = {
      examId: state.examParam,
      attemptId: state.attempt.attemptId,
      confirm: true,
      seq: state.seq,
      responses: Object.assign({}, state.responses),
      marked: [...state.marked],
      visited: [...state.visited],
      current: state.current,
    };
    try {
      const data = await api("student_submit", payload);
      finish(data.resultId, auto);
    } catch (error) {
      if (handleAuthError(error)) return;
      state.submitting = false;
      if (isNetwork(error)) {
        setSync("सबमिट नहीं हुआ — कनेक्शन लौटने पर दोबारा कोशिश होगी / Not submitted — will retry when you are back online", "error");
        UI.toast(
          "नेटवर्क नहीं है — उत्तर सुरक्षित हैं। कनेक्शन आने पर अंतिम सबमिट दोबारा करें। / No network — your answers are safe. Press final submit again once online.",
          "bad"
        );
        if (auto) {
          window.clearTimeout(state.retryTimer);
          state.retryTimer = window.setTimeout(() => submitExam(true), 8000);
        }
      } else {
        setSync("सबमिट नहीं हुआ — दोबारा प्रयास करें / Not submitted — try again", "error");
        UI.toast(error.message || "अंतिम सबमिट नहीं हो सका / Final submit failed", "bad");
      }
    } finally {
      if (!state.submitted) state.submitting = false;
    }
  }

  function finish(resultId, auto) {
    if (state.submitted) return;
    state.submitted = true;
    state.submitting = false;
    state.started = false;
    window.clearInterval(state.tickTimer);
    window.clearTimeout(state.saveTimer);
    window.clearTimeout(state.retryTimer);
    clearShadow();
    fsLeave().then(() => renderFsUi());
    showView("finishedView");
    const practice = state.exam && state.exam.type === "practice";
    els.finishTitle.innerHTML = auto
      ? bi("समय समाप्त — परीक्षा सबमिट हो गई", "Time over — your examination was submitted")
      : bi("परीक्षा सबमिट हो गई", "Examination submitted");
    els.finishMessage.innerHTML = practice
      ? bi(
          "आपका परिणाम तैयार है। उत्तर और व्याख्या देख सकते हैं।",
          "Your result is ready — you can view the answers and explanations."
        )
      : bi(
          "आपके उत्तर सुरक्षित हो गए हैं। परिणाम घोषित होने पर डैशबोर्ड पर उपलब्ध होगा।",
          "Your answers are saved. The result will appear on your dashboard once the institute declares it."
        );
    els.finishResultId.textContent = resultId || "—";
    if (resultId) {
      els.finishResult.href = "result.html?resultId=" + encodeURIComponent(resultId);
      els.finishResult.hidden = false;
    } else {
      els.finishResult.hidden = true;
    }
    if (auto) UI.toast("समय समाप्त होने पर परीक्षा स्वतः सबमिट की गई / Submitted automatically when time ended", "warn");
  }

  /* ---------- events ---------- */
  function bindEvents() {
    els.startBtn.addEventListener("click", startExam);
    if (els.instrNext) els.instrNext.addEventListener("click", () => goInstructionStep(1));
    if (els.instrBack) els.instrBack.addEventListener("click", () => goInstructionStep(-1));
    if (els.instrBtn) els.instrBtn.addEventListener("click", openInstructionSheet);
    if (els.submitBtnTop) els.submitBtnTop.addEventListener("click", openSubmit);
    if (els.paletteFilters) {
      els.paletteFilters.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        state.paletteFilter = button.dataset.filter;
        renderPalette();
      });
    }
    els.palette.addEventListener("click", (event) => {
      const button = event.target.closest("[data-index]");
      if (button) {
        goTo(Number(button.dataset.index));
        closeDrawer();
      }
    });
    els.options.addEventListener("change", (event) => {
      const input = event.target.closest('input[name="qopt"]');
      if (!input) return;
      selectOption(Number(input.value));
    });
    els.clearBtn.addEventListener("click", clearResponse);
    els.markBtn.addEventListener("click", toggleMark);
    els.markNextBtn.addEventListener("click", markAndNext);
    if (els.declareCheck) els.declareCheck.addEventListener("change", syncDeclaration);
    [els.landingLangHi, els.langHi, els.topLangHi].forEach((button) => {
      if (button) button.addEventListener("click", () => setLang("hi"));
    });
    [els.landingLangEn, els.langEn, els.topLangEn].forEach((button) => {
      if (button) button.addEventListener("click", () => setLang("en"));
    });
    els.prevBtn.addEventListener("click", () => goTo(state.current - 1));
    els.saveNextBtn.addEventListener("click", saveAndNext);
    els.submitBtn.addEventListener("click", openSubmit);
    els.submitBtnFoot.addEventListener("click", openSubmit);
    els.paletteToggle.addEventListener("click", openDrawer);
    els.paletteClose.addEventListener("click", closeDrawer);
    els.drawerBackdrop.addEventListener("click", closeDrawer);

    if (els.fsBtn) els.fsBtn.addEventListener("click", toggleExamFullscreen);
    if (els.fsBtnBanner) els.fsBtnBanner.addEventListener("click", () => requestExamFullscreen(true));
    ["fullscreenchange", "webkitfullscreenchange"].forEach((name) => {
      document.addEventListener(name, onFsChange);
    });
    ["fullscreenerror", "webkitfullscreenerror"].forEach((name) => {
      document.addEventListener(name, () => renderFsUi());
    });
    document.querySelectorAll(".cbt-top, .cbt-statusbar").forEach((bar) => {
      bar.addEventListener("pointerup", onFsDoubleTap);
    });

    window.addEventListener("online", () => {
      els.offlineBanner.hidden = true;
      UI.toast("कनेक्शन वापस आ गया / Connection restored", "good");
      if (state.started && !state.submitted) {
        state.dirty = true;
        saveNow();
      }
      if (state.submitting) submitExam(true);
    });
    window.addEventListener("offline", () => {
      els.offlineBanner.hidden = false;
      setSync("इंटरनेट बंद — उत्तर स्थानीय रूप से सुरक्षित / Offline — answers saved on this device", "error");
    });
    if (!navigator.onLine) els.offlineBanner.hidden = false;

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && state.started && !state.submitted) {
        persistShadow();
        saveNow();
      } else {
        renderFsUi();
      }
    });

    window.addEventListener("beforeunload", (event) => {
      if (!state.started || state.submitted) return;
      persistShadow();
      event.preventDefault();
      event.returnValue = "";
    });

    document.addEventListener("keydown", (event) => {
      if (!state.started || state.submitted) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = (event.target && event.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (/^[1-9]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        const question = currentQuestion();
        if (question && index < question.options.length) {
          event.preventDefault();
          selectOption(index);
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(state.current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(state.current + 1);
      }
    });
  }

  function openDrawer() {
    els.sidePanel.classList.add("open");
    els.drawerBackdrop.classList.add("show");
  }

  function closeDrawer() {
    els.sidePanel.classList.remove("open");
    els.drawerBackdrop.classList.remove("show");
  }

  init();
})();
