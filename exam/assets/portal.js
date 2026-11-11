/* Student portal: login, registration, dashboard, exam cards and own results. */
(function () {
  "use strict";
  const UI = window.UI;
  const $ = UI.$;
  const $$ = UI.$$;
  const esc = UI.esc;

  const LANG_KEY = "chnm.lang";
  const STRINGS = {
    hi: {
      welcome: "Future Instructor ग्रुप आपका स्वागत करता है",
      quote: "आज में जिए, कल को छोड़ दे — जो होगा देखा जाएगा।",
      dashTitle: "परीक्षा डैशबोर्ड",
      dashSub: "अपनी उपलब्ध परीक्षाएँ, अभ्यास और परिणाम यहाँ देखें।",
      refresh: "रीफ़्रेश करें",
      profile: "मेरी प्रोफ़ाइल",
      logout: "लॉगआउट",
      tabExams: "उपलब्ध परीक्षा",
      tabPractice: "अभ्यास",
      tabUpcoming: "आगामी",
      tabCompleted: "पूर्ण",
      tabResults: "परिणाम",
      tabResources: "अध्ययन सामग्री",
      statExams: "उपलब्ध परीक्षा",
      statPractice: "अभ्यास परीक्षा",
      statCompleted: "पूर्ण परीक्षा",
      statBest: "सर्वश्रेष्ठ",
      statPreparing: "तैयार हो रही",
      studentId: "ID",
      trade: "ट्रेड",
      batch: "बैच",
      mobile: "मोबाइल",
      preparingBanner: "📝 {title} का पेपर तैयार हो रहा है — प्रकाशित होते ही परीक्षा शुरू कर पाएँगे।",
      preparingMore: " और {count} अन्य परीक्षाएँ तैयार हो रही हैं।",
      preparingPill: "पेपर तैयार हो रहा है",
      preparingNote: "एडमिन इस पेपर पर काम कर रहे हैं।",
      resultPending: "परिणाम प्रतीक्षित",
      resultLabel: "परिणाम",
      attemptOngoing: "प्रयास जारी",
      lastTime: "अंतिम समय",
      upcoming: "आगामी",
      startsFrom: "{date} से",
      closed: "समय समाप्त",
      availableNow: "अभी उपलब्ध",
      resumeExam: "परीक्षा फिर से जोड़ें",
      startExam: "परीक्षा शुरू करें",
      startPractice: "अभ्यास शुरू करें",
      practiceAgain: "फिर से अभ्यास करें",
      viewResult: "परिणाम देखें",
      waitResult: "परिणाम प्रतीक्षित",
      notStarted: "परीक्षा अभी शुरू नहीं हुई",
      closedReason: "परीक्षा की समय-सीमा समाप्त",
      notAvailable: "अभी उपलब्ध नहीं",
      duration: "अवधि",
      questions: "प्रश्न",
      totalMarks: "कुल अंक",
      pass: "पास",
      perQuestion: "प्रति प्रश्न",
      negative: "नकारात्मक",
      attempts: "प्रयास",
      no: "नहीं",
      starts: "शुरू",
      ends: "अंत",
      practiceType: "अभ्यास",
      finalType: "फाइनल",
      emptyExams: "अभी कोई उपलब्ध फाइनल परीक्षा नहीं",
      emptyExamsSub: "एडमिन द्वारा परीक्षा प्रकाशित करने पर वह यहाँ दिखेगी।",
      emptyPractice: "अभी कोई अभ्यास परीक्षा नहीं",
      emptyPracticeSub: "अभ्यास परीक्षा उपलब्ध होने पर यहाँ दिखेगी।",
      emptyUpcoming: "कोई आगामी परीक्षा नहीं",
      emptyUpcomingSub: "निर्धारित समय वाली परीक्षाएँ यहाँ दिखेंगी।",
      emptyCompleted: "अभी कोई पूर्ण परीक्षा नहीं",
      emptyCompletedSub: "परीक्षा जमा करने के बाद यहाँ दिखेगी।",
      emptyResults: "अभी कोई परिणाम नहीं",
      emptyResultsSub: "परीक्षा पूरी करने के बाद आपके परिणाम यहाँ दिखेंगे।",
      pendingShort: "प्रतीक्षित",
      detail: "विवरण",
      legacyRecord: "पुराना रिकॉर्ड",
      profileTitle: "मेरी प्रोफ़ाइल",
      profileSub: "यह जानकारी आपके रजिस्ट्रेशन रिकॉर्ड से है।",
      regId: "रजिस्ट्रेशन ID",
      fullName: "पूरा नाम",
      fatherName: "पिता का नाम",
      email: "ईमेल",
      regDate: "रजिस्ट्रेशन तिथि",
      copyId: "ID कॉपी करें",
      close: "बंद करें",
      mapLoaded: "आपका डैशबोर्ड लोड हो रहा है…",
      dashRefreshOk: "डैशबोर्ड अपडेट हो गया",
      dashFail: "डैशबोर्ड लोड नहीं हो सका",
      failSub: "सर्वर से संपर्क नहीं हो सका",
      retry: "दोबारा प्रयास करें",
      notices: "सूचनाएँ",
      chat: "समूह चैट",
      resourcesSub: "एडमिन द्वारा साझा किए गए आपके ट्रेड के अध्ययन दस्तावेज़।",
      resourcesEmpty: "अभी कोई अध्ययन फ़ाइल उपलब्ध नहीं",
      resourcesEmptySub: "नई सामग्री साझा होने पर यहाँ दिखाई देगी।",
      pdfFolder: "PDF फ़ोल्डर",
      pptFolder: "PPT फ़ोल्डर",
      folderEmpty: "इस फ़ोल्डर में अभी कोई फ़ाइल नहीं",
      resourcesLoadError: "अध्ययन सामग्री लोड नहीं हो सकी",
      downloadResource: "डाउनलोड",
      noticeOpen: "पूरा पढ़ें",
      tabNoticesSub: "एडमिन द्वारा भेजी गई सूचनाएँ — नई सूचना आते ही यहाँ दिखती है।",
      emptyNotices: "अभी कोई सूचना नहीं",
      emptyNoticesSub: "एडमिन जैसे ही सूचना भेजेंगे, वह यहाँ दिखेगी।",
      markAllRead: "सभी पढ़े हुए चिह्नित करें",
      newTag: "नई",
      markRead: "पढ़ा हुआ चिह्नित करें",
      readTag: "पढ़ी गई",
      chatMembers: "सदस्य",
      chatHint: "हर पंजीकृत छात्र इस चैट में अपने आप शामिल है।",
      chatPlaceholder: "अपना संदेश लिखें…",
      chatSend: "भेजें",
      chatEmpty: "अभी कोई संदेश नहीं — नीचे से पहला संदेश भेजें।",
      chatTooFast: "थोड़े ठहराव के बाद फिर भेजें।",
      chatFail: "संदेश भेजा नहीं जा सका",
      chatLoading: "चैट लोड हो रही है…",
      you: "आप",
      adminName: "संस्था",
    },
    en: {
      welcome: "Future Instructor Group welcomes you",
      quote: "Live for today, let tomorrow go — what will be, will be.",
      dashTitle: "Exam dashboard",
      dashSub: "See your available exams, practice sets and results here.",
      refresh: "Refresh",
      profile: "My profile",
      logout: "Logout",
      tabExams: "Available exams",
      tabPractice: "Practice",
      tabUpcoming: "Upcoming",
      tabCompleted: "Completed",
      tabResults: "Results",
      tabResources: "Study files",
      statExams: "Available exams",
      statPractice: "Practice exams",
      statCompleted: "Completed",
      statBest: "Best score",
      statPreparing: "In preparation",
      studentId: "ID",
      trade: "Trade",
      batch: "Batch",
      mobile: "Mobile",
      preparingBanner: "📝 {title} is being prepared — you can start it as soon as it is published.",
      preparingMore: " and {count} more exam(s) are being prepared.",
      preparingPill: "Paper in preparation",
      preparingNote: "The admin is still working on this paper.",
      resultPending: "Result awaited",
      resultLabel: "Result",
      attemptOngoing: "Attempt in progress",
      lastTime: "Deadline",
      upcoming: "Upcoming",
      startsFrom: "from {date}",
      closed: "Window closed",
      availableNow: "Available now",
      resumeExam: "Resume exam",
      startExam: "Start exam",
      startPractice: "Start practice",
      practiceAgain: "Practice again",
      viewResult: "View result",
      waitResult: "Result awaited",
      notStarted: "Exam has not started yet",
      closedReason: "Exam window is closed",
      notAvailable: "Not available yet",
      duration: "Duration",
      questions: "Questions",
      totalMarks: "Total marks",
      pass: "Pass",
      perQuestion: "Per question",
      negative: "Negative",
      attempts: "Attempts",
      no: "No",
      starts: "Starts",
      ends: "Ends",
      practiceType: "Practice",
      finalType: "Final",
      emptyExams: "No available final exam right now",
      emptyExamsSub: "It will appear here once the admin publishes it.",
      emptyPractice: "No practice exam right now",
      emptyPracticeSub: "Practice exams will appear here when available.",
      emptyUpcoming: "No upcoming exam",
      emptyUpcomingSub: "Exams with a scheduled time will appear here.",
      emptyCompleted: "No completed exam yet",
      emptyCompletedSub: "It will appear here after you submit the paper.",
      emptyResults: "No result yet",
      emptyResultsSub: "Your results will appear here after you complete an exam.",
      pendingShort: "Awaited",
      detail: "Details",
      legacyRecord: "Legacy record",
      profileTitle: "My profile",
      profileSub: "This information comes from your registration record.",
      regId: "Registration ID",
      fullName: "Full name",
      fatherName: "Father's name",
      email: "Email",
      regDate: "Registered on",
      copyId: "Copy ID",
      close: "Close",
      mapLoaded: "Loading your dashboard…",
      dashRefreshOk: "Dashboard updated",
      dashFail: "Dashboard could not load",
      failSub: "Could not reach the server",
      retry: "Try again",
      notices: "Notices",
      chat: "Group chat",
      resourcesSub: "Study documents shared for your trade.",
      resourcesEmpty: "No study files are available yet",
      resourcesEmptySub: "New files will appear here when shared.",
      pdfFolder: "PDF folder",
      pptFolder: "PPT folder",
      folderEmpty: "This folder is empty",
      resourcesLoadError: "Study files could not be loaded",
      downloadResource: "Download",
      noticeOpen: "Read full",
      tabNoticesSub: "Notices sent by the admin — new ones appear here as soon as they are posted.",
      emptyNotices: "No notice yet",
      emptyNoticesSub: "It will appear here the moment the admin posts one.",
      markAllRead: "Mark all as read",
      newTag: "New",
      markRead: "Mark as read",
      readTag: "Read",
      chatMembers: "Members",
      chatHint: "Every registered student is part of this chat automatically.",
      chatPlaceholder: "Write your message…",
      chatSend: "Send",
      chatEmpty: "No messages yet — send the first one below.",
      chatTooFast: "Please wait a little before sending again.",
      chatFail: "Message could not be sent",
      chatLoading: "Loading chat…",
      you: "You",
      adminName: "Institute",
    },
  };

  let lang = "hi";
  try {
    lang = localStorage.getItem(LANG_KEY) === "en" ? "en" : "hi";
  } catch (error) {
    lang = "hi";
  }

  function renderResourceList(node) {
    node.innerHTML =
      '<p class="section-sub">' + esc(t("resourcesSub")) + "</p>" +
      '<div class="empty"><strong>' + esc(t("mapLoaded")) + "</strong></div>";
    UI.resourceCall("", {}, UI.studentToken()).then((data) => {
      const resources = data.resources || [];
      const renderFolder = (kind, title) => {
        const items = resources.filter((resource) =>
          kind === "pdf"
            ? String(resource.fileName || "").toLowerCase().endsWith(".pdf")
            : /\.(ppt|pptx)$/i.test(String(resource.fileName || ""))
        );
        return '<section class="resource-folder"><h3><span>' + esc(title) + '</span><small>' +
          items.length + '</small></h3>' +
          (items.length
            ? '<div class="resource-list">' + items.map((resource) =>
              '<article class="resource-row"><div class="grow"><strong>' + esc(resource.title) +
              '</strong><p class="small muted">' + esc(resource.description || resource.fileName) +
              '</p><small>' + esc(resource.fileName) + ' · ' +
              esc(resource.size >= 1024 * 1024
                ? (resource.size / (1024 * 1024)).toFixed(1) + " MB"
                : Math.max(1, Math.round(resource.size / 1024)) + " KB") +
              '</small></div><button class="btn btn-sm" type="button" data-resource-download="' +
              esc(resource.id) + '">' + esc(t("downloadResource")) + "</button></article>"
            ).join("") + '</div>'
            : '<div class="resource-folder-empty">' + esc(t("folderEmpty")) + "</div>") +
          "</section>";
      };
      node.innerHTML =
        '<p class="section-sub">' + esc(t("resourcesSub")) + "</p>" +
        '<div class="resource-folders">' +
        renderFolder("pdf", t("pdfFolder")) +
        renderFolder("ppt", t("pptFolder")) +
        "</div>";
      $$("[data-resource-download]", node).forEach((button) => {
        button.addEventListener("click", async () => {
          button.disabled = true;
          try {
            const result = await UI.resourceCall(
              "/" + encodeURIComponent(button.dataset.resourceDownload),
              {},
              UI.studentToken()
            );
            UI.downloadBlob(result.blob, result.filename);
          } catch (error) {
            UI.toast(error.message || t("resourcesLoadError"), "bad");
          } finally {
            button.disabled = false;
          }
        });
      });
    }).catch((error) => {
      node.innerHTML = emptyState(t("resourcesLoadError"), error.message || t("failSub"));
    });
  }

  function t(key, vars) {
    const table = STRINGS[lang] || STRINGS.hi;
    let value = table[key];
    if (value === undefined) value = STRINGS.hi[key] || key;
    return String(value).replace(/\{(\w+)\}/g, (match, name) =>
      vars && vars[name] !== undefined ? String(vars[name]) : match
    );
  }

  function fmtDuration(minutes) {
    if (lang !== "en") return UI.fmtDuration(minutes);
    const value = Number(minutes) || 0;
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    if (hours && mins) return hours + "h " + mins + "m";
    if (hours) return hours + "h";
    return mins + " min";
  }

  function passPill(pass) {
    if (pass === null || pass === undefined) {
      return '<span class="pill">' + esc(t("pendingShort")) + "</span>";
    }
    const text = pass ? (lang === "en" ? "Pass" : "उत्तीर्ण") : lang === "en" ? "Fail" : "अनुत्तीर्ण";
    return '<span class="pill ' + (pass ? "good" : "bad") + '">' + esc(text) + "</span>";
  }

  function typeLabel(type) {
    return type === "practice" ? t("practiceType") : t("finalType");
  }

  const STAT_ICONS = {    exams:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5A1.5 1.5 0 0 1 18.5 21H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M8 7h8M8 11h6M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></svg>',
    practice:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>',
    completed:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.4 2.6 2.6L16.4 9"/></svg>',
    best:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5C4 9 6 11 8.5 11M16 5h2.5A1.5 1.5 0 0 1 20 6.5C20 9 18 11 15.5 11"/><path d="M12 13v4M9 21h6M10 17h4v4h-4z"/></svg>',
  };

  const state = {
    boot: null,
    data: null,
    tab: "exams",
    photo: "",
    trades: [],
    registrationOpen: true,
    notices: [],
    chatMessages: [],
    chatCursor: 0,
    chatMembers: 0,
    chatDraft: "",
  };
  let chatTimer = null;

  const page = document.body.dataset.page || "portal";
  const registerOnly = page === "register";

  function hide(el, hidden) {
    if (el) el.hidden = Boolean(hidden);
  }

  function showAuth(tab) {
    hide($("#loadingView"), true);
    hide($("#dashboardView"), true);
    hide($("#authView"), false);
    hide($(".auth-tabs"), false);
    $("#userSlot").hidden = true;
    setAuthTab(tab || "login");
  }

  function showPasswordChange() {
    hide($("#loadingView"), true);
    hide($("#dashboardView"), true);
    hide($("#authView"), false);
    hide($(".auth-tabs"), true);
    hide($("#loginForm"), true);
    hide($("#studentForgotForm"), true);
    hide($("#studentResetForm"), true);
    hide($("#registerForm"), true);
    hide($("#registerSuccess"), true);
    hide($("#passwordChangePanel"), false);
    $("#authTitle").textContent = "नया पासवर्ड सेट करें";
    $("#authSub").textContent = "अपना खाता सुरक्षित करने के लिए नया पासवर्ड बनाएं।";
    setHeaderUser(UI.studentData());
  }

  function setNotice(target, message, tone) {
    const node = typeof target === "string" ? $(target) : target;
    if (!node) return;
    if (!message) {
      node.innerHTML = "";
      return;
    }
    node.innerHTML = '<div class="notice ' + (tone || "warn") + '">' + esc(message) + "</div>";
  }

  function setAuthTab(tab) {
    if (registerOnly) tab = "register";
    if (!state.registrationOpen && tab === "register" && !registerOnly) tab = "login";
    state.tab = tab;
    $$("[data-auth-tab]").forEach((button) => {
      button.setAttribute("aria-selected", button.dataset.authTab === tab ? "true" : "false");
    });
    hide($("#loginForm"), tab !== "login");
    hide($("#studentForgotForm"), true);
    hide($("#studentResetForm"), true);
    hide($("#registerForm"), tab !== "register");
    hide($("#passwordChangePanel"), true);
    hide($("#registerSuccess"), true);
    $("#authTitle").textContent = tab === "register" ? "नया रजिस्ट्रेशन" : "छात्र लॉगिन";
    $("#authSub").textContent =
      tab === "register"
        ? "सभी जानकारी ध्यान से भरें। रजिस्ट्रेशन के बाद ID सुरक्षित रखें।"
        : "रजिस्ट्रेशन ID और मोबाइल नंबर दर्ज करें।";
    if (tab === "register" && !state.registrationOpen) {
      setNotice("#authNotice", "नया रजिस्ट्रेशन अभी बंद है — परीक्षा संयोजक से संपर्क करें।", "warn");
    }
  }

  function setError(id, message) {
    const node = $(id);
    if (!node) return;
    if (!message) {
      node.hidden = true;
      node.textContent = "";
      return;
    }
    node.hidden = false;
    node.textContent = message;
  }

  function fillTrades() {
    const select = $("#regTrade");
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">ट्रेड चुनें</option>';
    state.trades.forEach((trade) => {
      const option = document.createElement("option");
      option.value = trade.id;
      option.textContent = trade.name;
      select.appendChild(option);
    });
    if (current) select.value = current;
    else if (state.trades.length === 1) select.value = state.trades[0].id;
  }

  function tradeName(id) {
    const trade = state.trades.find((item) => item.id === id);
    return trade ? trade.name : id || "";
  }

  function setHeaderUser(student) {
    const slot = $("#userSlot");
    if (!slot || !student) return;
    slot.hidden = false;
    slot.innerHTML =
      UI.avatar(student.photo, student.name) +
      '<span class="header-user-text"><b>' +
      esc(student.name) +
      "</b><small>" +
      esc(student.id) +
      "</small></span>";
    slot.title = student.name + " · " + student.id;
  }

  function panelError(message, retry) {
    const node = $("#dashContent");
    if (!node) return;
    node.innerHTML =
      '<div class="empty"><strong>' +
      esc(t("dashFail")) +
      "</strong><p>" +
      esc(message) +
      '</p><button class="btn btn-sm" type="button" data-dash-retry>' +
      esc(t("retry")) +
      "</button></div>";
    const button = $("[data-dash-retry]", node);
    if (button && retry) button.addEventListener("click", retry);
  }

  async function handleAuthFailure(error) {
    if (error && error.status === 428) {
      const student = UI.studentData() || {};
      student.passwordChangeRequired = true;
      UI.setStudentSession(UI.studentToken(), student);
      showPasswordChange();
      return true;
    }
    if (error && error.status === 401) {
      UI.clearStudentSession();
      showAuth("login");
      setNotice("#authNotice", "आपका लॉगिन सत्र समाप्त हो गया है — दोबारा लॉगिन करें।", "warn");
      return true;
    }
    return false;
  }

  async function loadDashboard(showToast) {
    const token = UI.studentToken();
    if (!token) {
      showAuth("login");
      return;
    }
    hide($("#loadingView"), true);
    hide($("#authView"), true);
    hide($("#dashboardView"), false);
    $("#dashContent").innerHTML =
      '<div class="panel"><div class="row"><span class="sync saving"><span class="dot"></span></span><b>' +
      esc(t("mapLoaded")) +
      "</b></div></div>";
    try {
      const data = await UI.call("student_dashboard", {}, token);
      state.data = data;
      UI.setStudentSession(token, data.student);
      setHeaderUser(data.student);
      renderHero(data);
      updateCounts(data);
      renderTab(state.tab);
      await Promise.all([loadNotices(), loadChat(false)]);
      if (showToast) UI.toast(t("dashRefreshOk"), "good");
    } catch (error) {
      if (await handleAuthFailure(error)) return;
      panelError(error.message || t("failSub"), () => loadDashboard(false));
    }
  }

  function applyLanguage() {
    document.documentElement.lang = lang === "en" ? "en" : "hi";
    $$("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    $$("[data-lang]").forEach((button) => {
      button.setAttribute("aria-selected", button.dataset.lang === lang ? "true" : "false");
    });
    if (state.data) {
      renderHero(state.data);
      renderTab(state.tab);
    }
  }

  function setLang(next) {
    lang = next === "en" ? "en" : "hi";
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (error) {
      /* private mode */
    }
    applyLanguage();
  }

  function renderHero(data) {
    const student = data.student || {};
    $("#dashAvatar").innerHTML = UI.avatar(student.photo, student.name);
    $("#dashName").textContent = student.name || "छात्र";
    const welcome = $("#dashWelcome");
    if (welcome) welcome.textContent = t("welcome");
    const quote = $("#dashQuote");
    if (quote) quote.textContent = "“" + t("quote") + "”";
    const meta = [
      t("studentId") + ": " + (student.id || "—"),
      t("trade") + ": " + (tradeName(student.tradeId) || "—"),
      student.batch ? t("batch") + ": " + student.batch : "",
      t("mobile") + ": " + (student.mobile || "—"),
    ].filter(Boolean);
    $("#dashMeta").innerHTML = meta.map((item) => "<span>" + esc(item) + "</span>").join("");
    const released = (data.results || []).filter((result) => !result.pending && result.percentage !== null);
    const best = released.length ? Math.max.apply(null, released.map((result) => Number(result.percentage) || 0)) : null;
    const stats = [
      ["exams", t("statExams"), (data.exams || []).length],
      ["practice", t("statPractice"), (data.practice || []).length],
      ["completed", t("statCompleted"), (data.completed || []).length],
      ["best", t("statBest"), best === null ? "—" : UI.fmtPct(best)],
    ];
    $("#heroStats").innerHTML = stats
      .map(
        (item) =>
          '<div class="hero-stat tone-' +
          item[0] +
          '"><span class="hero-stat-icon">' +
          (STAT_ICONS[item[0]] || "") +
          "</span><div><b>" +
          esc(item[2]) +
          "</b><small>" +
          esc(item[1]) +
          "</small></div></div>"
      )
      .join("");
    renderNoticeDirect();
    renderPreparingBanner(data);
  }

  /* ---------- सूचनाएँ (notifications) ---------- */
  async function loadNotices() {
    const token = UI.studentToken();
    if (!token) return;
    try {
      const data = await UI.call("notices_list", {}, token);
      state.notices = data.notices || [];
      paintNoticeCounts();
      renderNoticeDirect();
      if (state.tab === "notices") renderTab("notices");
    } catch (error) {
      if (await handleAuthFailure(error)) return;
    }
  }

  function paintNoticeCounts() {
    const unread = state.notices.filter((notice) => !notice.read).length;
    setCount("[data-count='notices']", unread);
    const bell = $("#noticeBellCount");
    if (bell) {
      bell.textContent = String(unread);
      bell.hidden = unread === 0;
    }
  }

  function setCount(selector, value) {
    const node = $(selector);
    if (node) node.textContent = String(value);
  }

  /* सबसे नई महत्वपूर्ण सूचना डैशबोर्ड पर सीधे दिखाई दे। */
  function renderNoticeDirect() {
    const node = $("#noticeDirect");
    if (!node) return;
    const latest = state.notices.find((notice) => !notice.read) || state.notices[0];
    if (!latest) {
      node.hidden = true;
      return;
    }
    node.hidden = false;
    node.classList.toggle("level-important", latest.level === "important");
    node.classList.toggle("level-warn", latest.level === "warn");
    $("#noticeDirectTitle").textContent = latest.title;
    $("#noticeDirectMeta").textContent =
      UI.fmtDateTime(latest.createdAt) +
      " · " +
      (latest.read ? t("readTag") : t("newTag"));
  }

  function noticeCard(notice) {
    const tone = notice.level === "important" ? "bad" : notice.level === "warn" ? "warn" : "info";
    return (
      '<div class="notice-card ' +
      tone +
      (notice.read ? " read" : "") +
      '" data-notice="' +
      UI.attr(notice.id) +
      '"><div class="row-between"><b>' +
      esc(notice.title) +
      '</b><span class="pill ' +
      (notice.read ? "" : tone) +
      '">' +
      esc(notice.read ? t("readTag") : t("newTag")) +
      "</span></div><p>" +
      esc(notice.body) +
      '</p><div class="row-between"><small>' +
      esc(UI.fmtDateTime(notice.createdAt)) +
      "</small>" +
      (notice.read
        ? ""
        : '<button class="btn btn-sm btn-ghost" type="button" data-notice-read>✓ ' +
          esc(t("markRead")) +
          "</button>") +
      "</div></div>"
    );
  }

  function renderNoticeList(node) {
    const list = state.notices;
    node.innerHTML =
      '<div class="row-between section-sub-row"><p class="section-sub">' +
      esc(t("tabNoticesSub")) +
      "</p><button class='btn btn-sm btn-ghost' type='button' id='markAllReadBtn'>" +
      esc(t("markAllRead")) +
      "</button></div>" +
      (list.length
        ? '<div class="notice-list">' + list.map(noticeCard).join("") + "</div>"
        : emptyState(t("emptyNotices"), t("emptyNoticesSub")));
    const markAll = $("#markAllReadBtn", node);
    if (markAll) {
      markAll.addEventListener("click", async () => {
        const unread = list.filter((notice) => !notice.read);
        if (!unread.length) return;
        for (const notice of unread) {
          try {
            await UI.call("notice_read", { noticeId: notice.id }, UI.studentToken());
            notice.read = true;
          } catch (error) {
            /* एक-दो सूचना चिह्नित न हो तो बाकी जारी रहें */
          }
        }
        paintNoticeCounts();
        renderNoticeDirect();
        renderTab("notices");
      });
    }
    $$("[data-notice-read]", node).forEach((button) => {
      button.addEventListener("click", async () => {
        const card = button.closest("[data-notice]");
        const notice = list.find((item) => item.id === card.dataset.notice);
        if (!notice) return;
        try {
          await UI.call("notice_read", { noticeId: notice.id }, UI.studentToken());
          notice.read = true;
          paintNoticeCounts();
          renderNoticeDirect();
          renderTab("notices");
        } catch (error) {
          if (await handleAuthFailure(error)) return;
          UI.toast(error.message || "सूचना चिह्नित नहीं हो सकी", "bad");
        }
      });
    });
  }

  /* ---------- समूह चैट (group chat) ---------- */
  async function loadChat(append) {
    const token = UI.studentToken();
    if (!token) return;
    try {
      const data = await UI.call("chat_list", append ? { after: state.chatCursor } : {}, token);
      const messages = data.messages || [];
      if (append) state.chatMessages = state.chatMessages.concat(messages);
      else state.chatMessages = messages;
      state.chatMembers = data.members || 0;
      if (messages.length) {
        state.chatCursor = Math.max(
          state.chatCursor,
          ...messages.map((message) => Number(String(message.id).slice(0, 14)) || 0)
        );
      }
      if (state.tab === "chat") renderTab("chat");
    } catch (error) {
      if (await handleAuthFailure(error)) return;
    }
  }

  function chatBubble(message) {
    const mine = message.sid === ((state.data && state.data.student) || {}).id;
    const isAdmin = message.sid === "ADMIN";
    return (
      '<div class="chat-msg' +
      (mine ? " mine" : "") +
      (isAdmin ? " from-admin" : "") +
      '"><div class="chat-meta"><b>' +
      esc(mine ? t("you") : isAdmin ? t("adminName") : message.name || message.sid) +
      "</b><small>" +
      esc(UI.fmtTime(message.createdAt)) +
      "</small></div><p>" +
      esc(message.text) +
      "</p></div>"
    );
  }

  function renderChatPanel(node) {
    setCount("[data-count='chat']", state.chatMessages.length);
    // The dashboard shell and the 15s poll both rebuild this panel, so the
    // in-progress message is kept in state instead of in the old DOM node.
    const draft = state.chatDraft || "";
    node.innerHTML =
      '<div class="chat-panel"><div class="row-between"><p class="section-sub">' +
      esc(t("chatHint")) +
      '</p><span class="badge-count">' +
      esc(t("chatMembers")) + ": " +
      esc(state.chatMembers) +
      "</span></div>" +
      '<div class="chat-log" id="chatLog">' +
      (state.chatMessages.length
        ? state.chatMessages.map(chatBubble).join("")
        : '<p class="muted small">' + esc(t("chatEmpty")) + "</p>") +
      "</div>" +
      '<form id="chatForm" class="chat-compose"><input class="input" id="chatText" maxlength="500" placeholder="' +
      esc(t("chatPlaceholder")) +
      '" aria-label="' +
      esc(t("chat")) +
      '"><button class="btn" type="submit">' +
      esc(t("chatSend")) +
      "</button></form></div>";
    const log = $("#chatLog", node);
    if (log) log.scrollTop = log.scrollHeight;
    const input = $("#chatText", node);
    if (input) {
      if (draft) input.value = draft;
      input.addEventListener("input", () => {
        state.chatDraft = input.value;
      });
    }
    const form = $("#chatForm", node);
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = $("#chatText", node);
        const text = input.value.trim();
        if (!text) return;
        const button = form.querySelector("button");
        UI.setButtonBusy(button, true, "…");
        try {
          const data = await UI.call("chat_send", { text: text }, UI.studentToken());
          state.chatMessages.push(data.message);
          state.chatCursor = Math.max(state.chatCursor, Number(String(data.message.id).slice(0, 14)) || 0);
          input.value = "";
          state.chatDraft = "";
          renderTab("chat");
          $("#chatText", $("#dashContent"))?.focus();
        } catch (error) {
          if (await handleAuthFailure(error)) return;
          UI.toast(error.message || t("chatFail"), "bad");
          UI.setButtonBusy(button, false);
        }
      });
    }
  }

  function startChatPolling() {
    stopChatPolling();
    chatTimer = setInterval(() => {
      if (state.tab === "chat" && !document.hidden) loadChat(true);
    }, 15_000);
  }

  function stopChatPolling() {
    if (chatTimer) clearInterval(chatTimer);
    chatTimer = null;
  }

  function renderPreparingBanner(data) {
    const node = $("#dashBanner");
    if (!node) return;
    const list = data.preparing || [];
    if (!list.length) {
      node.hidden = true;
      node.innerHTML = "";
      return;
    }
    const first = list[0];
    node.hidden = false;
    node.innerHTML =
      '<span class="dash-banner-icon" aria-hidden="true">' +
      STAT_ICONS.exams +
      '</span><div class="dash-banner-text"><p>' +
      esc(t("preparingBanner", { title: first.title })) +
      (list.length > 1 ? esc(t("preparingMore", { count: list.length - 1 })) : "") +
      '</p><small>' +
      esc(first.subjectName || "") +
      (first.subjectName ? " • " : "") +
      esc(first.totalQuestions || 0) +
      " " +
      esc(t("questions").toLowerCase()) +
      '</small></div><span class="pill warn">' +
      esc(t("preparingPill")) +
      "</span>";
  }

  function updateCounts(data) {
    const counts = {
      exams: (data.exams || []).length,
      practice: (data.practice || []).length,
      upcoming: (data.upcoming || []).length + (data.preparing || []).length,
      completed: (data.completed || []).length,
      results: (data.results || []).length,
      notices: state.notices.filter((notice) => !notice.read).length,
      chat: state.chatMessages.length,
    };
    Object.keys(counts).forEach((key) => {
      const node = $('[data-count="' + key + '"]');
      if (node) node.textContent = counts[key];
    });
    paintNoticeCounts();
  }

  function examTypePill(exam) {
    return exam.type === "practice"
      ? '<span class="pill info">' + esc(t("practiceType")) + "</span>"
      : '<span class="pill mark">' + esc(t("finalType")) + "</span>";
  }

  function attemptReachedLimit(exam) {
    return Number(exam.attemptsUsed || 0) >= Number(exam.attemptsAllowed || 1);
  }

  function preparingCard(exam) {
    return (
      '<article class="exam-card preparing-card"><div class="exam-top"><div class="row" style="gap:6px">' +
      examTypePill(exam) +
      '<span class="pill">' +
      esc(exam.subjectName || "") +
      '</span></div><span class="pill warn">' +
      esc(t("preparingPill")) +
      "</span></div><h3>" +
      esc(exam.title) +
      '</h3><div class="exam-meta"><span>' +
      esc(t("duration")) +
      " <b>" +
      esc(fmtDuration(exam.durationMin)) +
      "</b></span><span>" +
      esc(t("questions")) +
      " <b>" +
      esc(exam.totalQuestions || 0) +
      "</b></span><span>" +
      esc(t("pass")) +
      " <b>" +
      esc(UI.fmtPct(exam.passPct)) +
      "</b></span>" +
      (exam.startAt
        ? "<span>" + esc(t("starts")) + " <b>" + esc(UI.fmtDateTime(exam.startAt)) + "</b></span>"
        : "") +
      '</div><p class="tiny muted" style="margin:0">' +
      esc(t("preparingNote")) +
      '</p><div class="exam-result-line"><span class="preparing-pulse"><i></i>' +
      esc(t("preparingPill")) +
      "</span></div></article>"
    );
  }

  function examCard(exam) {
    const canStart = Boolean(exam.availability && exam.availability.canStart) && !attemptReachedLimit(exam);
    const resultHref = exam.resultId
      ? "result.html?resultId=" + encodeURIComponent(exam.resultId)
      : "";
    const startHref = "test.html?exam=" + encodeURIComponent(exam.id);
    const actions = [];
    if (exam.attemptInProgress) {
      actions.push(
        '<a class="btn" href="' + esc(startHref) + '">' + esc(t("resumeExam")) + "</a>"
      );
    } else if (canStart) {
      actions.push(
        '<a class="btn" href="' +
          esc(startHref) +
          '">' +
          (exam.type === "practice"
            ? Number(exam.attemptsUsed || 0) > 0
              ? t("practiceAgain")
              : t("startPractice")
            : t("startExam")) +
          "</a>"
      );
    } else if (!exam.resultId) {
      const reason =
        exam.availability && exam.availability.state === "upcoming"
          ? t("notStarted")
          : exam.availability && exam.availability.state === "closed"
            ? t("closedReason")
            : t("notAvailable");
      actions.push('<button class="btn btn-ghost" type="button" disabled>' + esc(reason) + "</button>");
    }
    if (resultHref) {
      actions.push(
        '<a class="btn btn-ghost" href="' +
          esc(resultHref) +
          '">' +
          (exam.resultReleased ? t("viewResult") : t("waitResult")) +
          "</a>"
      );
    }

    let statusLine = "";
    if (exam.resultId) {
      statusLine = exam.resultReleased
        ? '<span class="muted">' +
          esc(t("resultLabel")) +
          "</span> <b>" +
          esc(UI.fmtPct(exam.percentage)) +
          "</b> " +
          passPill(exam.pass)
        : '<span class="pill warn">' + esc(t("resultPending")) + "</span>";
    } else if (exam.attemptInProgress) {
      statusLine =
        '<span class="pill info">' +
        esc(t("attemptOngoing")) +
        '</span><span class="muted small">' +
        esc(t("lastTime")) +
        " " +
        esc(UI.fmtTime(exam.attemptEndAt)) +
        "</span>";
    } else if (exam.availability && exam.availability.state === "upcoming") {
      statusLine =
        '<span class="pill warn">' +
        esc(t("upcoming")) +
        '</span><span class="muted small">' +
        esc(t("startsFrom", { date: UI.fmtDateTime(exam.startAt) })) +
        "</span>";
    } else if (exam.availability && exam.availability.state === "closed") {
      statusLine = '<span class="pill bad">' + esc(t("closed")) + "</span>";
    } else {
      statusLine = '<span class="pill good">' + esc(t("availableNow")) + "</span>";
    }

    const windows = [];
    if (exam.startAt) windows.push(t("starts") + ": " + UI.fmtDateTime(exam.startAt));
    if (exam.endAt) windows.push(t("ends") + ": " + UI.fmtDateTime(exam.endAt));

    return (
      '<article class="exam-card"><div class="exam-top"><div class="row" style="gap:6px">' +
      examTypePill(exam) +
      '<span class="pill">' +
      esc(exam.subjectName || exam.subjectId || "") +
      "</span></div></div><h3>" +
      esc(exam.title) +
      '</h3><div class="exam-meta"><span>' +
      esc(t("duration")) +
      " <b>" +
      esc(fmtDuration(exam.durationMin)) +
      "</b></span><span>" +
      esc(t("questions")) +
      " <b>" +
      esc(exam.totalQuestions || 0) +
      "</b></span><span>" +
      esc(t("totalMarks")) +
      " <b>" +
      esc(UI.fmtMarks(exam.totalMarks)) +
      "</b></span><span>" +
      esc(t("pass")) +
      " <b>" +
      esc(UI.fmtPct(exam.passPct)) +
      "</b></span><span>" +
      esc(t("perQuestion")) +
      " <b>" +
      esc(UI.fmtMarks(exam.marksPerQuestion)) +
      "</b></span><span>" +
      esc(t("negative")) +
      " <b>" +
      esc(exam.negativeMarks ? "−" + UI.fmtMarks(exam.negativeMarks) : t("no")) +
      "</b></span>" +
      (exam.attemptsAllowed > 1
        ? "<span>" + esc(t("attempts")) + " <b>" + esc(exam.attemptsUsed || 0) + " / " + esc(exam.attemptsAllowed) + "</b></span>"
        : "") +
      "</div>" +
      (windows.length ? '<p class="tiny muted" style="margin:0">' + esc(windows.join(" • ")) + "</p>" : "") +
      '<div class="exam-result-line">' +
      statusLine +
      "</div>" +
      '<div class="exam-actions">' +
      actions.join("") +
      "</div></article>"
    );
  }

  function resultRow(result) {
    const href = "result.html?resultId=" + encodeURIComponent(result.resultId);
    const pending = result.pending === true || result.percentage === null;
    return (
      '<div class="result-row"><div><div class="r-title">' +
      esc(result.examTitle || t("tabExams")) +
      '</div><div class="r-sub">' +
      esc(result.subjectName || "") +
      (result.subjectName ? " • " : "") +
      esc(typeLabel(result.examType)) +
      " • " +
      esc(UI.fmtDateTime(result.submittedAt)) +
      "</div></div>" +
      '<div><div class="r-score">' +
      (pending ? "—" : esc(UI.fmtPct(result.percentage))) +
      '</div><div class="r-sub">' +
      (pending ? esc(t("pendingShort")) : esc(UI.fmtMarks(result.obtained) + " / " + UI.fmtMarks(result.maxMarks))) +
      "</div></div>" +
      "<div>" +
      (pending ? '<span class="pill warn">' + esc(t("pendingShort")) + "</span>" : passPill(result.pass)) +
      "</div>" +
      '<div class="r-sub">' +
      (result.legacy ? '<span class="pill">' + esc(t("legacyRecord")) + "</span>" : esc(result.resultId || "")) +
      '</div><div class="r-actions"><a class="btn btn-sm btn-ghost" href="' +
      esc(href) +
      '">' +
      esc(t("detail")) +
      "</a></div></div>"
    );
  }

  function emptyState(title, text) {
    return (
      '<div class="empty"><strong>' +
      esc(title) +
      "</strong><p>" +
      esc(text) +
      "</p></div>"
    );
  }

  function renderTab(tab) {
    const data = state.data;
    if (!data) return;
    state.tab = tab;
    $$("[data-dash-tab]").forEach((button) => {
      button.setAttribute("aria-selected", button.dataset.dashTab === tab ? "true" : "false");
    });
    const node = $("#dashContent");
    if (tab === "notices") {
      renderNoticeList(node);
      return;
    }
    if (tab === "chat") {
      renderChatPanel(node);
      return;
    }
    if (tab === "resources") {
      renderResourceList(node);
      return;
    }
    if (tab === "results") {
      const results = data.results || [];
      node.innerHTML = results.length
        ? '<div class="result-list">' + results.map(resultRow).join("") + "</div>"
        : emptyState(t("emptyResults"), t("emptyResultsSub"));
      return;
    }
    const lists = {
      exams: data.exams || [],
      practice: data.practice || [],
      upcoming: data.upcoming || [],
      completed: data.completed || [],
    };
    const exams = lists[tab] || [];
    const preparing = tab === "upcoming" ? data.preparing || [] : [];
    if (!exams.length && !preparing.length) {
      const copy = {
        exams: [t("emptyExams"), t("emptyExamsSub")],
        practice: [t("emptyPractice"), t("emptyPracticeSub")],
        upcoming: [t("emptyUpcoming"), t("emptyUpcomingSub")],
        completed: [t("emptyCompleted"), t("emptyCompletedSub")],
      }[tab] || [t("emptyExams"), t("emptyExamsSub")];
      node.innerHTML = emptyState(copy[0], copy[1]);
      return;
    }
    node.innerHTML =
      '<div class="exam-grid">' +
      preparing.map(preparingCard).join("") +
      exams.map(examCard).join("") +
      "</div>";
  }

  function openProfile() {
    const student = (state.data && state.data.student) || UI.studentData();
    if (!student) return;
    const rows = [
      [t("regId"), student.id],
      [t("fullName"), student.name],
      [t("fatherName"), student.fatherName || "—"],
      [t("trade"), tradeName(student.tradeId) || "—"],
      [t("batch"), student.batch || "—"],
      [t("mobile"), student.mobile || "—"],
      [t("email"), student.email || "—"],
      [t("regDate"), UI.fmtDateTime(student.createdAt)],
    ];
    const modal = UI.modal({
      title: t("profileTitle"),
      subtitle: t("profileSub"),
      size: "sm",
      body:
        '<div class="profile-modal"><div class="profile-modal-head">' +
        UI.avatar(student.photo, student.name, "avatar-lg") +
        "<div><b>" +
        esc(student.name) +
        "</b><small>" +
        esc(student.id) +
        "</small></div></div>" +
        '<div class="detail-list">' +
        rows
          .map(
            (row) =>
              '<div><span>' + esc(row[0]) + "</span><b>" + esc(row[1]) + "</b></div>"
          )
          .join("") +
        "</div></div>",
      actions: [
        {
          label: t("copyId"),
          ghost: true,
          icon: "copy",
          onClick: async () => {
            try {
              await UI.copyText(student.id);
              UI.toast(lang === "en" ? "Registration ID copied" : "रजिस्ट्रेशन ID कॉपी हो गया", "good");
            } catch {
              UI.toast(lang === "en" ? "Could not copy" : "कॉपी नहीं हो सका", "bad");
            }
          },
        },
        { label: t("close"), onClick: () => modal.close() },
      ],
    });
  }

  function wireAuthTabs() {
    $$("[data-auth-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        setAuthTab(button.dataset.authTab);
        setError("#loginError", "");
        setError("#regError", "");
        if (button.dataset.authTab === "register") {
          history.replaceState(null, "", "#register");
        } else if (location.hash === "#register") {
          history.replaceState(null, "", location.pathname + location.search);
        }
      });
    });
  }

  function wireLogin() {
    const form = $("#loginForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setError("#loginError", "");
      const id = $("#loginId").value.trim().toUpperCase();
      const mobile = $("#loginMobile").value.replace(/\D/g, "").slice(0, 10);
      const password = $("#loginPassword").value;
      if (!/^[A-Za-z0-9][A-Za-z0-9_/-]{1,39}$/.test(id)) {
        setError("#loginError", "CITS नंबर या पंजीकृत मोबाइल सही दर्ज करें।");
        return;
      }
      const button = $("#loginBtn");
      await UI.withBusy(button, async () => {
        try {
          const data = await UI.call("student_login", {
            identifier: id,
            mobile: mobile,
            password: password,
          });
          UI.setStudentSession(data.token, data.student);
          $("#loginPassword").value = "";
          if (data.requiresPasswordChange) {
            showPasswordChange();
          } else {
            await loadDashboard(false);
            UI.toast("लॉगिन सफल", "good");
          }
        } catch (error) {
          if (error.status === 401) {
            setError("#loginError", error.message || "लॉगिन ID या पासवर्ड सही नहीं है।");
          } else if (error.status === 403) {
            setError("#loginError", error.message);
          } else {
            setError("#loginError", error.message || "लॉगिन नहीं हो सका।");
          }
        }
      }, "लॉगिन हो रहा है…");
    });

    const forgotOpen = $("#studentForgotOpen");
    const forgotForm = $("#studentForgotForm");
    const resetForm = $("#studentResetForm");
    const resetToken = new URLSearchParams(location.search).get("reset") || "";
    if (forgotOpen && forgotForm) {
      forgotOpen.addEventListener("click", () => {
        hide(form, true);
        hide($(".auth-tabs"), true);
        hide(forgotForm, false);
        $("#authTitle").textContent = "पासवर्ड रीसेट";
        $("#authSub").textContent = "पंजीकृत जानकारी की पुष्टि करें।";
      });
      $("#studentForgotBack").addEventListener("click", () => showAuth("login"));
      forgotForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        setError("#studentForgotError", "");
        $("#studentForgotError").className = "notice bad";
        const identifier = $("#studentForgotId").value.trim().toUpperCase();
        const email = $("#studentForgotEmail").value.trim();
        await UI.withBusy($("#studentForgotBtn"), async () => {
          try {
            const data = await UI.call("student_forgot_password", { identifier, email });
            const note = $("#studentForgotError");
            note.className = "notice info";
            note.hidden = false;
            note.textContent = data.message || "यदि जानकारी मेल खाती है, तो रीसेट लिंक पंजीकृत ईमेल पर भेजा जाएगा।";
          } catch (error) {
            setError("#studentForgotError", error.message || "रीसेट लिंक नहीं भेजा जा सका।");
          }
        }, "जानकारी जाँची जा रही है…");
      });
    }

    if (resetForm) {
      resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        setError("#studentResetError", "");
        $("#studentResetError").className = "notice bad";
        const newPassword = $("#studentResetNewPassword").value;
        if (newPassword.length < 10) {
          setError("#studentResetError", "नया पासवर्ड कम-से-कम 10 अक्षरों का रखें।");
          return;
        }
        if (newPassword !== $("#studentResetConfirmPassword").value) {
          setError("#studentResetError", "दोनों नए पासवर्ड एक जैसे नहीं हैं।");
          return;
        }
        await UI.withBusy($("#studentResetBtn"), async () => {
          try {
            await UI.call("student_reset_password", { token: resetToken, newPassword });
            UI.clearStudentSession();
            history.replaceState(null, "", location.pathname);
            showAuth("login");
            setNotice("#authNotice", "पासवर्ड रीसेट हो गया है। अब नए पासवर्ड से लॉगिन करें।", "good");
          } catch (error) {
            setError("#studentResetError", error.message || "पासवर्ड रीसेट नहीं हो सका।");
          }
        }, "पासवर्ड रीसेट हो रहा है…");
      });
    }

    const changeForm = $("#passwordChangePanel");
    if (changeForm) {
      changeForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        setError("#passwordChangeError", "");
        const currentPassword = $("#changeCurrentPassword").value;
        const newPassword = $("#changeNewPassword").value;
        if (newPassword.length < 10) {
          setError("#passwordChangeError", "नया पासवर्ड कम-से-कम 10 अक्षरों का रखें।");
          return;
        }
        if (newPassword !== $("#changeConfirmPassword").value) {
          setError("#passwordChangeError", "दोनों नए पासवर्ड एक जैसे नहीं हैं।");
          return;
        }
        await UI.withBusy($("#passwordChangeBtn"), async () => {
          try {
            const data = await UI.call(
              "student_password_change",
              { currentPassword, newPassword },
              UI.studentToken()
            );
            UI.setStudentSession(data.token, data.student);
            $("#changeCurrentPassword").value = "";
            $("#changeNewPassword").value = "";
            $("#changeConfirmPassword").value = "";
            await loadDashboard(false);
            UI.toast("नया पासवर्ड सुरक्षित हो गया", "good");
          } catch (error) {
            setError("#passwordChangeError", error.message || "पासवर्ड बदला नहीं जा सका।");
          }
        }, "पासवर्ड सुरक्षित हो रहा है…");
      });
    }
  }

  function wireRegistration() {
    const form = $("#registerForm");
    if (!form) return;
    const photoInput = $("#photoInput");
    if (photoInput) {
      photoInput.addEventListener("change", async () => {
        const file = photoInput.files && photoInput.files[0];
        if (!file) return;
        setError("#regError", "");
        try {
          const maxKb = Math.min(180, Number((state.boot && state.boot.settings && state.boot.settings.maxPhotoKb) || 200));
          const dataUrl = await UI.compressPhoto(file, { maxKb: maxKb, maxDim: 640 });
          state.photo = dataUrl;
          const preview = $("#photoPreview");
          preview.src = dataUrl;
          preview.classList.add("has-image");
        } catch (error) {
          state.photo = "";
          setError("#regError", error.message);
          photoInput.value = "";
        }
      });
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setError("#regError", "");
      if (!state.registrationOpen) {
        setError("#regError", "नया रजिस्ट्रेशन अभी बंद है — परीक्षक से संपर्क करें।");
        return;
      }
      const name = $("#regName").value.trim();
      const fatherName = $("#regFather").value.trim();
      const citsNumber = $("#regCits").value.trim().toUpperCase();
      const mobile = $("#regMobile").value.replace(/\D/g, "").slice(0, 10);
      const dateOfBirth = $("#regDob").value;
      const email = $("#regEmail").value.trim();
      const tradeId = $("#regTrade").value;
      const batch = $("#regBatch").value.trim();
      const consent = $("#regConsent").checked;
      if (name.length < 2) return setError("#regError", "पूरा नाम दर्ज करें।");
      if (citsNumber && !/^[A-Z0-9/-]{2,30}$/.test(citsNumber)) return setError("#regError", "सही CITS नंबर दर्ज करें।");
      if (mobile && !/^[6-9]\d{9}$/.test(mobile)) return setError("#regError", "10 अंकों का सही मोबाइल नंबर दर्ज करें।");
      if (!mobile && !citsNumber) return setError("#regError", "CITS नंबर या मोबाइल नंबर में से एक दर्ज करें।");
      if (!dateOfBirth) return setError("#regError", "जन्मतिथि दर्ज करें।");
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("#regError", "सही ईमेल दर्ज करें।");
      if (!tradeId) return setError("#regError", "अपना ट्रेड चुनें।");
      if (!consent) return setError("#regError", "रजिस्ट्रेशन के लिए सहमति पर टिक करें।");

      const button = $("#registerBtn");
      await UI.withBusy(button, async () => {
        try {
          const data = await UI.call("register", {
            name: name,
            fatherName: fatherName,
            citsNumber: citsNumber,
            mobile: mobile,
            dateOfBirth: dateOfBirth,
            email: email,
            tradeId: tradeId,
            batch: batch,
            photo: state.photo,
            consent: true,
          });
          $("#regLoginValue").textContent = data.loginId;
          $("#registerEmailNotice").textContent = data.notification?.message || "रजिस्ट्रेशन पूरा हो गया।";
          hide($("#registerForm"), true);
          hide($("#registerSuccess"), false);
          $$("[data-auth-tab]").forEach((tab) => {
            tab.disabled = true;
          });
          $("#authTitle").textContent = "रजिस्ट्रेशन सफल";
          $("#authSub").textContent = "अपना लॉगिन ID सुरक्षित रखें।";
          setNotice("#authNotice", "", "");
          UI.toast("रजिस्ट्रेशन सफल — लॉगिन ID सुरक्षित रखें", "good");
        } catch (error) {
          setError("#regError", error.message || "रजिस्ट्रेशन नहीं हो सका।");
        }
      }, "रजिस्ट्रेशन हो रहा है…");
    });

    const copy = $("#copyRegId");
    if (copy) {
      copy.addEventListener("click", async () => {
        try {
          await UI.copyText($("#regLoginValue").textContent);
          UI.toast("ID कॉपी हो गया", "good");
        } catch {
          UI.toast("कॉपी नहीं हो सका", "bad");
        }
      });
    }
  }

  function wireDashboard() {
    if (!$("#dashboardView") || !$("#heroStats")) return;
    const refresh = $("#refreshDash");
    if (refresh) refresh.addEventListener("click", () => loadDashboard(true));
    const profile = $("#profileBtn");
    if (profile) profile.addEventListener("click", openProfile);
    const logout = $("#logoutBtn");
    if (logout) {
      logout.addEventListener("click", async () => {
        const yes = await UI.confirm({
          title: "लॉगआउट करें?",
          message: "आपको दोबारा लॉगिन करना होगा। परीक्षा चल रही हो तो पहले उसे जमा करें।",
          confirmText: "लॉगआउट",
          tone: "btn-bad",
        });
        if (!yes) return;
        UI.clearStudentSession();
        state.data = null;
        showAuth("login");
        setNotice("#authNotice", "आप लॉगआउट हो गए हैं।", "good");
      });
    }
    $$("[data-dash-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.dashTab;
        renderTab(tab);
        if (tab === "notices") loadNotices();
        if (tab === "chat") loadChat(false);
      });
    });
    const openTab = (tab) => {
      const button = $('[data-dash-tab="' + tab + '"]');
      if (button) button.click();
      const head = $("#dashTabs");
      if (head) head.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    const bell = $("#noticeBellBtn");
    if (bell) bell.addEventListener("click", () => openTab("notices"));
    const chatBtn = $("#chatOpenBtn");
    if (chatBtn) chatBtn.addEventListener("click", () => openTab("chat"));
    const directOpen = $("#noticeDirectOpen");
    if (directOpen) directOpen.addEventListener("click", () => openTab("notices"));
    startChatPolling();
    $$("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => setLang(button.dataset.lang));
    });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted && UI.studentToken() && !$("#dashboardView").hidden) {
        loadDashboard(false);
      }
    });
  }

  async function init() {
    applyLanguage();
    const hash = (location.hash || "").replace("#", "").toLowerCase();
    const DASH_TABS = ["exams", "practice", "upcoming", "completed", "results", "resources", "notices", "chat"];
    if (DASH_TABS.includes(hash)) state.tab = hash;
    if (!registerOnly) wireAuthTabs();
    wireLogin();
    wireRegistration();
    wireDashboard();

    try {
      state.boot = await UI.bootstrap();
      state.trades = state.boot.trades || [];
      state.registrationOpen = state.boot.settings.registrationOpen !== false;
      const groupFooter = $("#portalGroupFooter");
      if (groupFooter && state.boot.settings.groupName) {
        groupFooter.textContent = state.boot.settings.groupName + " · CHNM / CITS परीक्षा पोर्टल";
      }
      fillTrades();
      if (!state.registrationOpen) {
        const tab = $('[data-auth-tab="register"]');
        if (tab) tab.disabled = true;
        setNotice("#authNotice", "नया रजिस्ट्रेशन अभी बंद है। पहले से रजिस्टर्ड छात्र लॉगिन कर सकते हैं।", "warn");
      }
    } catch (error) {
      setNotice("#authNotice", error.message || "सर्वर से जानकारी नहीं मिल सकी।", "bad");
    }

    const resetToken = new URLSearchParams(location.search).get("reset");
    if (resetToken && !registerOnly) {
      showAuth("login");
      hide($(".auth-tabs"), true);
      hide($("#loginForm"), true);
      hide($("#studentResetForm"), false);
      $("#authTitle").textContent = "नया पासवर्ड बनाएँ";
      $("#authSub").textContent = "रीसेट लिंक का उपयोग करके नया पासवर्ड सेट करें।";
      return;
    }

    const token = UI.studentToken();
    if (token && !registerOnly) {
      if (UI.studentData()?.passwordChangeRequired) showPasswordChange();
      else await loadDashboard(false);
      return;
    }
    if (registerOnly && token) {
      const student = UI.studentData();
      hide($("#loadingView"), true);
      hide($("#authView"), false);
      hide($("#dashboardView"), true);
      setHeaderUser(student);
      if (student) {
        setAuthTab("register");
        setNotice(
          "#authNotice",
          "आप पहले से लॉगिन हैं (" + student.name + " · " + student.id + ")। इस पेज से नया रजिस्ट्रेशन करना हो तो पहले लॉगआउट करें।",
          "info"
        );
        $("#authNotice").insertAdjacentHTML(
          "beforeend",
          '<div class="row" style="margin-top:8px"><a class="btn btn-sm" href="index.html">डैशबोर्ड खोलें</a><button class="btn btn-sm btn-ghost" type="button" id="regPageLogout">लॉगआउट</button></div>'
        );
        const out = $("#regPageLogout");
        if (out) {
          out.addEventListener("click", () => {
            UI.clearStudentSession();
            location.reload();
          });
        }
        hide($("#registerForm"), true);
      }
      return;
    }
    if (registerOnly) {
      hide($("#loadingView"), true);
      hide($("#dashboardView"), true);
      hide($("#authView"), false);
      setAuthTab("register");
      if (!state.registrationOpen) {
        hide($("#registerForm"), true);
      }
      return;
    }
    showAuth(hash === "register" || hash === "signup" ? "register" : "login");
    if (hash === "register") history.replaceState(null, "", "#register");
  }

  init().catch((error) => {
    hide($("#loadingView"), true);
    hide($("#authView"), false);
    setAuthTab(registerOnly ? "register" : "login");
    setNotice("#authNotice", error.message || "पोर्टल लोड नहीं हो सका — पेज रीफ़्रेश करें।", "bad");
  });
})();
