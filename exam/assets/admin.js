/* Future Instructor – CHNM Portal · admin console */
(function () {
  "use strict";

  const UI = window.UI;
  const $ = UI.$;
  const $$ = UI.$$;
  const esc = UI.esc;
  const attr = UI.attr;

  const state = {
    token: UI.adminToken(),
    route: "",
    overview: null,
    exams: null,
    questionFilter: { subjectId: "", setId: "", q: "", active: "", page: 1 },
    studentFilter: { q: "", tradeId: "", active: "", page: 1 },
    resultFilter: { examId: "", subjectId: "", tradeId: "", type: "", q: "", page: 1 },
    settings: null,
  };

  let detailModal = null;
  let liveTimer = 0;

  const NAV_ICONS = {
    dashboard: "dashboard",
    live: "clock",
    exams: "file",
    questions: "layers",
    results: "chart",
    students: "users",
    notify: "bell",
    catalog: "book",
    stats: "stats",
    settings: "settings",
    tools: "archive",
  };

  const ROUTES = {
    dashboard: { title: "डैशबोर्ड", crumb: "सारांश, हाल के परिणाम और गतिविधि", render: renderDashboard },
    live: { title: "लाइव परीक्षा", crumb: "अभी परीक्षा दे रहे विद्यार्थियों की निगरानी", render: renderLive },
    exams: { title: "परीक्षाएँ", crumb: "परीक्षा बनाएँ, पेपर लॉक करें और प्रकाशित करें", render: renderExams },
    questions: { title: "प्रश्न बैंक", crumb: "विषय-वार प्रश्न, Excel/CSV आयात और सत्यापन", render: renderQuestions },
    results: { title: "परिणाम", crumb: "परीक्षा, विषय और ट्रेड के अनुसार परिणाम", render: renderResults },
    students: { title: "विद्यार्थी", crumb: "पंजीकरण, प्रोफ़ाइल और परीक्षा प्रयास", render: renderStudents },
    notify: { title: "सूचना और चैट", crumb: "सभी छात्रों को सूचना भेजें और समूह चैट देखें", render: renderNotify },
    catalog: { title: "विषय और ट्रेड", crumb: "विषय तथा ट्रेड प्रबंधन", render: renderCatalog },
    stats: { title: "आँकड़े", crumb: "परीक्षा, विषय और ट्रेड-वार प्रदर्शन", render: renderStats },
    settings: { title: "सेटिंग्स", crumb: "पोर्टल डिफ़ॉल्ट और सुरक्षा", render: renderSettings },
    tools: { title: "टूल्स", crumb: "पुराना डेटा, बैकअप और ऑडिट लॉग", render: renderTools },
  };

  /* ---------- boot ---------- */
  function boot() {
    $$("[data-login-icon]").forEach((node) => {
      node.innerHTML = UI.icon(node.dataset.loginIcon);
    });
    const lockIcon = $("#loginLockIcon");
    if (lockIcon) lockIcon.innerHTML = UI.icon("lock");
    const secureNote = $("#loginSecureNote");
    if (secureNote) secureNote.textContent = "सुरक्षित सर्वर सत्यापन — पासवर्ड ब्राउज़र में सेव नहीं होता";
    const passInput = $("#adminPassword");
    const passToggle = $("#adminPasswordToggle");
    if (passInput && passToggle) {
      passToggle.innerHTML = UI.icon("eye");
      passToggle.addEventListener("click", () => {
        const show = passInput.type === "password";
        passInput.type = show ? "text" : "password";
        passToggle.innerHTML = UI.icon(show ? "eye-off" : "eye");
        passToggle.setAttribute("aria-label", show ? "पासवर्ड छिपाएँ" : "पासवर्ड दिखाएँ");
        passToggle.setAttribute("aria-pressed", show ? "true" : "false");
        passInput.focus();
      });
    }
    const navButtons = $$("[data-nav]");
    navButtons.forEach((button) => {
      const label = button.textContent.trim();
      button.innerHTML = UI.icon(NAV_ICONS[button.dataset.nav] || "file") + "<span>" + esc(label) + "</span>";
      button.addEventListener("click", () => {
        closeSidebar();
        goRoute(button.dataset.nav);
      });
    });
    $("#sidebarToggle").innerHTML = UI.icon("menu");
    $("#adminRefreshBtn").innerHTML = UI.icon("refresh");
    $("#adminRefreshBtn").addEventListener("click", () => renderRoute(state.route || "dashboard", true));
    $("#sidebarToggle").addEventListener("click", () => $("#adminSidebar").classList.toggle("open"));
    $("#adminLogoutBtn").addEventListener("click", () => logout(true));
    $("#adminLoginForm").addEventListener("submit", adminLogin);
    $("#adminForgotOpen").addEventListener("click", () => {
      $("#adminLoginForm").hidden = true;
      $("#adminForgotForm").hidden = false;
      $("#adminForgotMessage").hidden = true;
    });
    $("#adminForgotBack").addEventListener("click", () => {
      $("#adminForgotForm").hidden = true;
      $("#adminLoginForm").hidden = false;
    });
    $("#adminForgotForm").addEventListener("submit", requestAdminReset);
    $("#adminResetForm").addEventListener("submit", completeAdminReset);
    window.addEventListener("hashchange", () => {
      const route = routeFromHash();
      if (route !== state.route) renderRoute(route);
    });

    if (!state.token) {
      showLogin();
      const resetToken = new URLSearchParams(window.location.search).get("reset");
      if (resetToken) {
        $("#adminLoginForm").hidden = true;
        $("#adminForgotForm").hidden = true;
        $("#adminResetForm").hidden = false;
      }
      return;
    }
    showShell();
    renderRoute(routeFromHash(), true);
  }

  function routeFromHash() {
    const name = window.location.hash.replace(/^#/, "");
    return ROUTES[name] ? name : "dashboard";
  }

  function showLogin() {
    $("#adminLogin").hidden = false;
    $("#adminShell").hidden = true;
  }

  function showShell() {
    $("#adminLogin").hidden = true;
    $("#adminShell").hidden = false;
  }

  function closeSidebar() {
    $("#adminSidebar").classList.remove("open");
  }

  async function adminLogin(event) {
    event.preventDefault();
    const button = $("#adminLoginBtn");
    const error = $("#adminLoginError");
    error.hidden = true;
    UI.setButtonBusy(button, true, "लॉगिन हो रहा है…");
    try {
      const data = await UI.call("admin_login", { password: $("#adminPassword").value });
      state.token = data.token;
      UI.setAdminSession(data.token);
      $("#adminPassword").value = "";
      state.overview = null;
      showShell();
      await renderRoute(routeFromHash(), true);
    } catch (err) {
      error.hidden = false;
      error.textContent = err.message || "लॉगिन नहीं हो सका";
    } finally {
      UI.setButtonBusy(button, false);
    }
  }

  async function requestAdminReset(event) {
    event.preventDefault();
    const button = $("#adminForgotBtn");
    const message = $("#adminForgotMessage");
    message.hidden = true;
    UI.setButtonBusy(button, true, "ईमेल भेजा जा रहा है…");
    try {
      const data = await UI.call("admin_forgot_password", {});
      message.className = "notice good";
      message.textContent = data.message;
      message.hidden = false;
    } catch (error) {
      message.className = "notice bad";
      message.textContent = error.message || "रीसेट ईमेल नहीं भेजा जा सका।";
      message.hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
  }

  async function completeAdminReset(event) {
    event.preventDefault();
    const errorNode = $("#adminResetError");
    errorNode.hidden = true;
    const password = $("#adminResetPassword").value;
    if (password !== $("#adminResetConfirm").value) {
      errorNode.textContent = "दोनों पासवर्ड एक जैसे नहीं हैं।";
      errorNode.hidden = false;
      return;
    }
    const token = new URLSearchParams(window.location.search).get("reset") || "";
    const button = $("#adminResetBtn");
    UI.setButtonBusy(button, true, "पासवर्ड रीसेट हो रहा है…");
    try {
      const data = await UI.call("admin_reset_password", { token, newPassword: password });
      $("#adminResetForm").hidden = true;
      $("#adminLoginForm").hidden = false;
      $("#adminPassword").focus();
      UI.toast(data.message || "पासवर्ड रीसेट हो गया।", "good");
      window.history.replaceState(null, "", window.location.pathname);
    } catch (error) {
      errorNode.textContent = error.message || "पासवर्ड रीसेट नहीं हो सका।";
      errorNode.hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
  }

  function logout(confirmFirst) {
    const finish = () => {
      state.token = "";
      state.overview = null;
      state.exams = null;
      UI.setAdminSession("");
      showLogin();
      $("#adminContent").innerHTML = "";
      window.location.hash = "";
      UI.toast("लॉगआउट हो गया", "good");
    };
    if (!confirmFirst) {
      finish();
      return;
    }
    UI.confirm({
      title: "लॉगआउट करें?",
      message: "एडमिन सत्र बंद हो जाएगा।",
      confirmText: "लॉगआउट",
      tone: "btn-bad",
    }).then((ok) => {
      if (ok) finish();
    });
  }

  async function api(action, body) {
    try {
      return await UI.call(action, body, state.token);
    } catch (error) {
      if (error && error.status === 401) {
        state.token = "";
        UI.setAdminSession("");
        showLogin();
        UI.toast("एडमिन सत्र समाप्त हो गया — दोबारा लॉगिन करें", "bad");
      }
      throw error;
    }
  }

  /* ---------- routing ---------- */
  async function goRoute(name, replace) {
    const route = ROUTES[name] ? name : "dashboard";
    if (replace) {
      const url = window.location.pathname + window.location.search + "#" + route;
      window.history.replaceState(null, "", url);
    } else if (window.location.hash !== "#" + route) {
      window.location.hash = route;
      return;
    }
    await renderRoute(route);
  }

  async function renderRoute(name, force) {
    const route = ROUTES[name] ? name : "dashboard";
    if (liveTimer) {
      clearInterval(liveTimer);
      liveTimer = 0;
    }
    state.route = route;
    const meta = ROUTES[route];
    $("#adminPageTitle").textContent = meta.title;
    $("#adminPageCrumb").textContent = meta.crumb;
    $$("[data-nav]").forEach((button) => {
      if (button.dataset.nav === route) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    const content = $("#adminContent");
    content.innerHTML = '<div class="admin-loading"><div class="brand-mark">FI</div><p>लोड हो रहा है…</p></div>';
    try {
      await meta.render(content, force);
    } catch (error) {
      if (error && error.status === 401) return;
      console.error("[admin] route " + route + " failed", error);
      UI.showError(content, error.message || "डेटा लोड नहीं हो सका");
      const retry = content.querySelector("[data-retry]");
      if (retry) retry.addEventListener("click", () => renderRoute(route, true));
    }
  }

  async function ensureOverview(force) {
    if (state.overview && !force) return state.overview;
    const data = await api("admin_overview");
    state.overview = data;
    state.settings = data.settings;
    $("#adminSiteName").textContent = data.settings.siteName || "Future Instructor";
    return data;
  }

  function subjects() {
    return (state.overview && state.overview.subjects) || [];
  }

  function trades() {
    return (state.overview && state.overview.trades) || [];
  }

  /* ---------- tiny render helpers ---------- */
  function optionList(items, selected, placeholder) {
    return (
      (placeholder ? '<option value="">' + esc(placeholder) + "</option>" : "") +
      items
        .map(
          (item) =>
            '<option value="' +
            attr(item.value) +
            '"' +
            (String(item.value) === String(selected) ? " selected" : "") +
            ">" +
            esc(item.label) +
            "</option>"
        )
        .join("")
    );
  }

  function pager(data) {
    if (!data || !data.pages || data.pages <= 1) {
      return '<div class="pagination"><span>कुल ' + (data ? data.total : 0) + " रिकॉर्ड</span></div>";
    }
    return (
      '<div class="pagination"><span>पेज ' +
      data.page +
      " / " +
      data.pages +
      " · कुल " +
      data.total +
      "</span>" +
      '<button class="btn btn-ghost btn-sm" type="button" data-page="' +
      (data.page - 1) +
      '"' +
      (data.page <= 1 ? " disabled" : "") +
      ">पिछला</button>" +
      '<button class="btn btn-ghost btn-sm" type="button" data-page="' +
      (data.page + 1) +
      '"' +
      (data.page >= data.pages ? " disabled" : "") +
      ">अगला</button></div>"
    );
  }

  function statCard(label, value, note, tone) {
    return (
      '<div class="stat-card' +
      (tone ? " " + tone : "") +
      '"><span class="s-label">' +
      esc(label) +
      "</span><b>" +
      esc(value) +
      "</b><small>" +
      esc(note || "") +
      "</small></div>"
    );
  }

  function emptyBox(message, compact) {
    return '<div class="empty' + (compact ? " compact" : "") + '"><strong>' + esc(message) + "</strong></div>";
  }

  function truncate(text, length) {
    const value = String(text || "");
    return value.length > length ? value.slice(0, length - 1) + "…" : value;
  }

  function resultBadge(result) {
    if (!result) return '<span class="pill">—</span>';
    if (result.percentage === null || result.percentage === undefined) {
      return '<span class="pill warn">प्रतीक्षित</span>';
    }
    return (
      '<span class="pill ' +
      (result.pass ? "good" : "bad") +
      '">' +
      esc(UI.trimNumber(result.percentage)) +
      "%</span>"
    );
  }

  function examStatus(exam) {
    return UI.statusChip(exam.status) + ' <span class="pill ' + (exam.type === "practice" ? "info" : "dark") + '">' + esc(UI.examTypeLabel(exam.type)) + "</span>";
  }

  /* ---------- dashboard ---------- */
  async function renderDashboard(content) {
    const ov = await ensureOverview(true);
    const s = ov.summary;
    const legacy = ov.legacy;
    const legacyCount = legacy ? (legacy.students || 0) + (legacy.results || 0) : 0;

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>स्वागत है, एडमिन</h1><p>' +
      esc(ov.settings.siteName || "Future Instructor") +
      " · " +
      esc(ov.settings.collegeName || "CHNM") +
      '</p></div><div class="row"><button class="btn btn-ghost btn-sm" type="button" data-go="questions">प्रश्न बैंक</button><button class="btn btn-sm" type="button" data-new-exam>नई परीक्षा</button></div></div>' +
      (legacyCount
        ? '<div class="legacy-banner"><b>पुराने पोर्टल का डेटा मिला:</b> ' +
          esc(legacy.students || 0) +
          " विद्यार्थी, " +
          esc(legacy.results || 0) +
          ' परिणाम। आयात सुरक्षित और दोबारा-सुरक्षित (idempotent) है। <button class="btn btn-sm btn-soft" type="button" data-legacy-import>अभी आयात करें</button></div>'
        : "") +
      '<div class="stat-grid">' +
      statCard("विद्यार्थी", s.students, (s.activeStudents || 0) + " सक्रिय", "brand") +
      statCard("प्रकाशित परीक्षाएँ", (s.examStatus && s.examStatus.published) || 0, "कुल परीक्षा: " + s.exams) +
      statCard("प्रश्न बैंक", s.questions, "7 विषयों में") +
      statCard("फाइनल परिणाम", s.finalResults, "अभ्यास: " + s.practiceResults) +
      statCard("पास दर", UI.trimNumber(s.passRate) + "%", "फाइनल परीक्षाओं में", "gold") +
      statCard("औसत प्रतिशत", UI.trimNumber(s.average) + "%", "फाइनल परीक्षाओं में") +
      statCard("सक्रिय प्रयास", s.activeAttempts, "अभी परीक्षा में") +
      statCard("Draft / Locked", ((s.examStatus && s.examStatus.draft) || 0) + " / " + ((s.examStatus && s.examStatus.locked) || 0), "प्रकाशन शेष") +
      "</div>" +
      '<div class="grid-2">' +
      '<section class="admin-card"><div class="admin-section-head"><div><h3>हाल के परिणाम</h3><p class="admin-card-sub">नवीनतम जमा परिणाम</p></div><button class="btn btn-ghost btn-sm" type="button" data-go="results">सभी</button></div>' +
      (ov.recentResults.length
        ? '<div class="table-wrap"><table class="data"><thead><tr><th>विद्यार्थी</th><th>परीक्षा</th><th>प्रकार</th><th>प्रतिशत</th><th></th></tr></thead><tbody>' +
          ov.recentResults
            .map(
              (r) =>
                "<tr><td><span class=\"t-main\">" +
                esc(r.studentName || r.regId) +
                '</span><div class="t-sub">' +
                esc(r.regId || "") +
                "</div></td><td>" +
                esc(truncate(r.examTitle, 34)) +
                '</td><td><span class="pill ' +
                (r.examType === "practice" ? "info" : "dark") +
                '">' +
                esc(UI.examTypeLabel(r.examType)) +
                "</span></td><td>" +
                resultBadge(r) +
                '</td><td class="actions"><button class="btn btn-sm btn-ghost" type="button" data-result-open="' +
                attr(r.resultId) +
                '">देखें</button></td></tr>'
            )
            .join("") +
          "</tbody></table></div>"
        : emptyBox("अभी कोई परिणाम नहीं है", true)) +
      "</section>" +
      '<section class="admin-card"><div class="admin-section-head"><div><h3>विषय-वार प्रश्न</h3><p class="admin-card-sub">प्रश्न बैंक की स्थिति</p></div><button class="btn btn-ghost btn-sm" type="button" data-go="catalog">प्रबंधन</button></div><div class="admin-side-list">' +
      ov.subjects
        .map(
          (subject) =>
            '<div class="side-item"><div><b>' +
            esc(subject.name) +
            '</b><div class="small muted">' +
            esc(subject.code || subject.id) +
            " · " +
            esc(subject.exams) +
            ' परीक्षाएँ</div></div><div class="row"><span class="badge-count">' +
            esc(subject.questions) +
            '</span><button class="btn btn-sm btn-ghost" type="button" data-subject-bank="' +
            attr(subject.id) +
            '">प्रश्न</button></div></div>'
        )
        .join("") +
      "</div></section></div>" +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>हाल की गतिविधि</h3><p class="admin-card-sub">ऑडिट लॉग (नवीनतम ' +
      ov.recentAudit.length +
      ')</p></div><button class="btn btn-ghost btn-sm" type="button" data-go="tools">पूरा लॉग</button></div>' +
      (ov.recentAudit.length ? auditList(ov.recentAudit) : emptyBox("कोई गतिविधि दर्ज नहीं", true)) +
      "</section>";

    $$("[data-new-exam]", content).forEach((button) => button.addEventListener("click", () => openExamEditor()));
    $$("[data-go]", content).forEach((button) => button.addEventListener("click", () => goRoute(button.dataset.go)));
    $$("[data-exam-open]", content).forEach((button) =>
      button.addEventListener("click", () => openExamDetail(button.dataset.examOpen))
    );
    $$("[data-result-open]", content).forEach((button) =>
      button.addEventListener("click", () => openResultDetail(button.dataset.resultOpen))
    );
    $$("[data-subject-bank]", content).forEach((button) =>
      button.addEventListener("click", () => {
        state.questionFilter = { subjectId: button.dataset.subjectBank, setId: "", q: "", active: "", page: 1 };
        goRoute("questions");
      })
    );
    $$("[data-legacy-import]", content).forEach((button) =>
      button.addEventListener("click", () => importLegacy())
    );
  }

  function auditList(entries) {
    return (
      '<div class="audit-list">' +
      entries
        .map(
          (entry) =>
            '<div class="audit-row"><time>' +
            esc(UI.fmtDateTime(entry.at)) +
            "</time><b>" +
            esc(entry.action) +
            "</b><span>" +
            esc(JSON.stringify(entry.details || {})) +
            "</span></div>"
        )
        .join("") +
      "</div>"
    );
  }

  /* ---------- live exam monitor ---------- */
  function clockText(seconds) {
    const total = Math.max(0, Math.round(Number(seconds) || 0));
    const hh = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const ss = total % 60;
    const pad = (value) => String(value).padStart(2, "0");
    return (hh ? pad(hh) + ":" : "") + pad(mm) + ":" + pad(ss);
  }

  function agoText(value) {
    const at = Date.parse(value) || 0;
    if (!at) return "—";
    const seconds = Math.max(0, Math.round((Date.now() - at) / 1000));
    if (seconds < 45) return "अभी ऐक्टिव";
    if (seconds < 3600) return Math.round(seconds / 60) + " मिनट पहले";
    return UI.fmtDateTime(value);
  }

  async function renderLive(content) {
    await ensureOverview();
    content.innerHTML =
      '<div class="admin-section-head"><div><h1>लाइव परीक्षा</h1><p>अभी परीक्षा दे रहे विद्यार्थियों की स्थिति। हर 15 सेकंड में अपने आप ताज़ा होती है।</p></div><div class="row"><span class="pill info" id="liveStamp">लोड हो रहा है…</span><button class="btn btn-sm" type="button" id="liveRefresh">' +
      UI.icon("refresh") +
      " रिफ़्रेश</button></div></div>" +
      '<div id="liveStats" class="stat-grid"></div><div id="liveRows"></div>';

    const statsWrap = $("#liveStats", content);
    const rowsWrap = $("#liveRows", content);
    const stamp = $("#liveStamp", content);

    function rowHtml(item) {
      const total = Number(item.totalQuestions) || 0;
      const answered = Number(item.answered) || 0;
      const percent = total ? Math.round((answered / total) * 100) : 0;
      const status = item.expired
        ? '<span class="pill bad">समय समाप्त</span>'
        : item.remainingSec <= 300
          ? '<span class="pill warn">जल्द समाप्त</span>'
          : '<span class="pill good">चालू</span>';
      return (
        '<tr><td><span class="t-main">' +
        esc(item.studentName) +
        '</span><div class="t-sub">' +
        esc(item.regId || "") +
        '</div></td><td><span class="t-main">' +
        esc(truncate(item.examTitle, 38)) +
        '</span><div class="t-sub">' +
        esc(item.examCode || "") +
        (item.tradeName ? " · " + esc(item.tradeName) : "") +
        '</div></td><td><div class="progress" title="' +
        attr(answered + " / " + total + " उत्तर") +
        '"><i style="width:' +
        percent +
        '%"></i></div><div class="t-sub">' +
        esc(answered + " / " + total) +
        " · चिह्नित " +
        esc(item.marked || 0) +
        '</div></td><td>' +
        esc(agoText(item.lastSeenAt)) +
        '</td><td><b class="mono">' +
        esc(clockText(item.remainingSec)) +
        '</b></td><td>' +
        status +
        '</td><td class="actions"><button class="btn btn-sm btn-ghost" type="button" data-live-finalize="' +
        attr(item.studentId) +
        '" data-live-exam="' +
        attr(item.examId) +
        '" data-live-name="' +
        attr(item.studentName) +
        '">फाइनल करें</button></td></tr>'
      );
    }

    function paint(data) {
      const items = data.items || [];
      statsWrap.innerHTML =
        statCard("सक्रिय परीक्षार्थी", data.active || 0, "अभी लिख रहे हैं", "brand") +
        statCard("समय समाप्त", data.expired || 0, "फाइनल करना शेष") +
        statCard("कुल प्रयास", items.length, "लाइव सूची में") +
        statCard(
          "कुल उत्तर",
          items.reduce((sum, item) => sum + (Number(item.answered) || 0), 0),
          "सभी प्रयासों में"
        );
      stamp.textContent =
        "अंतिम अपडेट " + new Date(data.serverNow || Date.now()).toLocaleTimeString("hi-IN");
      if (!items.length) {
        rowsWrap.innerHTML =
          '<div class="empty"><strong>अभी कोई विद्यार्थी परीक्षा नहीं दे रहा</strong><p class="muted">जैसे ही कोई परीक्षा शुरू करेगा, यहाँ 15 सेकंड के भीतर दिखेगा।</p></div>';
        return;
      }
      rowsWrap.innerHTML =
        '<div class="table-wrap"><table class="data"><thead><tr><th>विद्यार्थी</th><th>परीक्षा</th><th>प्रगति</th><th>अंतिम गतिविधि</th><th>शेष समय</th><th>स्थिति</th><th></th></tr></thead><tbody>' +
        items.map(rowHtml).join("") +
        "</tbody></table></div>";
      $$("[data-live-finalize]", rowsWrap).forEach((button) =>
        button.addEventListener("click", () =>
          finalizeLive(
            button.dataset.liveFinalize,
            button.dataset.liveExam,
            button.dataset.liveName
          )
        )
      );
    }

    async function finalizeLive(studentId, examId, name) {
      const ok = await UI.confirm({
        title: "प्रयास फाइनल करें?",
        message:
          (name || "विद्यार्थी") +
          " का प्रयास अभी जमा कर परिणाम बना दिया जाएगा। विद्यार्थी दोबारा नहीं लिख पाएगा।",
        confirmText: "फाइनल करें",
        tone: "btn-bad",
      });
      if (!ok) return;
      try {
        await api("admin_attempt_finalize", { examId, studentId });
        UI.toast("प्रयास फाइनल हो गया", "good");
        await load(true);
      } catch (error) {
        UI.toast(error.message || "प्रयास फाइनल नहीं हो सका", "bad");
      }
    }

    async function load(silent) {
      try {
        const data = await api("admin_live");
        paint(data);
      } catch (error) {
        if (error && error.status === 401) return;
        if (!silent) {
          UI.showError(rowsWrap, error.message || "लाइव स्थिति लोड नहीं हो सकी");
          const retry = rowsWrap.querySelector("[data-retry]");
          if (retry) retry.addEventListener("click", () => load(false));
        }
      }
    }

    $("#liveRefresh", content).addEventListener("click", () => load(false));
    await load(false);
    liveTimer = setInterval(() => {
      if (state.route !== "live" || document.hidden) return;
      load(true);
    }, 15000);
  }

  /* ---------- shared detail actions ---------- */
  async function refreshExamCache() {
    state.exams = null;
  }

  async function loadExams(force) {
    if (state.exams && !force) return state.exams;
    const data = await api("admin_exams");
    state.exams = data.exams || [];
    return state.exams;
  }

  /* ---------- exams list ---------- */
  async function renderExams(content) {
    await ensureOverview();
    const exams = await loadExams(true);
    if (!state.examFilter) state.examFilter = { q: "", status: "", type: "", subjectId: "" };
    const filter = state.examFilter;

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>परीक्षाएँ</h1><p>ड्राफ्ट से प्रकाशन तक पूरा वर्कफ़्लो। पेपर लॉक होने पर स्नैपशॉट सुरक्षित रहता है।</p></div><button class="btn" type="button" data-new-exam>नई परीक्षा बनाएँ</button></div>' +
      '<div class="toolbar"><input class="input grow-input" id="examSearch" placeholder="नाम, कोड या विषय खोजें…" value="' +
      attr(filter.q) +
      '"><select class="select compact" id="examStatusFilter">' +
      optionList(
        [
          { value: "", label: "सभी स्थिति" },
          { value: "draft", label: "Draft" },
          { value: "locked", label: "Locked" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ],
        filter.status
      ) +
      '</select><select class="select compact" id="examTypeFilter">' +
      optionList(
        [
          { value: "", label: "सभी प्रकार" },
          { value: "final", label: "फाइनल" },
          { value: "practice", label: "अभ्यास" },
        ],
        filter.type
      ) +
      '</select><select class="select compact" id="examSubjectFilter">' +
      optionList(
        [{ value: "", label: "सभी विषय" }].concat(
          subjects().map((subject) => ({ value: subject.id, label: subject.name }))
        ),
        filter.subjectId
      ) +
      '</select><button class="btn btn-ghost btn-sm" type="button" data-import>प्रश्न आयात</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-cbt>सीबीटी श्रृंखला</button></div>' +
      '<div id="examRows"></div>';

    const wrap = $("#examRows", content);

    function matches(exam) {
      if (filter.status && exam.status !== filter.status) return false;
      if (filter.type && exam.type !== filter.type) return false;
      if (filter.subjectId && exam.subjectId !== filter.subjectId) return false;
      const q = filter.q.trim().toLowerCase();
      if (!q) return true;
      return [exam.title, exam.code, exam.subjectName, exam.tradeName]
        .join(" ")
        .toLowerCase()
        .includes(q);
    }

    function paint() {
      const rows = exams.filter(matches);
      if (!rows.length) {
        wrap.innerHTML = emptyBox(exams.length ? "इस फ़िल्टर पर कोई परीक्षा नहीं मिली" : "अभी कोई परीक्षा नहीं बनी — नई परीक्षा बनाएँ");
        return;
      }
      wrap.innerHTML =
        '<div class="table-wrap"><table class="data"><thead><tr><th>परीक्षा</th><th>विषय / ट्रेड</th><th>स्थिति</th><th>प्रश्न</th><th>परिणाम</th><th>प्रयास</th><th>अपडेट</th><th></th></tr></thead><tbody>' +
        rows
          .map(
            (exam) =>
              "<tr><td><span class=\"t-main\">" +
              esc(exam.title) +
              '</span><div class="t-sub">' +
              esc(exam.code) +
              "</div></td><td>" +
              esc(exam.subjectName || "") +
              '<div class="t-sub">' +
              esc(exam.tradeName || "सभी ट्रेड") +
              "</div></td><td>" +
              examStatus(exam) +
              "</td><td>" +
              esc(exam.totalQuestions ?? exam.questionCount ?? 0) +
              " / " +
              esc(exam.totalMarks || 0) +
              ' अंक</td><td><span class="badge-count">' +
              esc(exam.resultCount || 0) +
              '</span></td><td><span class="badge-count">' +
              esc(exam.activeAttempts || 0) +
              "</span></td><td>" +
              esc(UI.fmtDate(exam.updatedAt)) +
              '</td><td class="actions"><div class="row-actions"><button class="btn btn-sm btn-ghost" type="button" data-exam-edit="' +
              attr(exam.id) +
              '">एडिट</button><button class="btn btn-sm" type="button" data-exam-view="' +
              attr(exam.id) +
              '">विवरण</button></div></td></tr>'
          )
          .join("") +
        "</tbody></table></div>";
    }

    $("#examSearch", content).addEventListener("input", UI.debounce((event) => {
      filter.q = event.target.value;
      paint();
    }, 180));
    $("#examStatusFilter", content).addEventListener("change", (event) => {
      filter.status = event.target.value;
      paint();
    });
    $("#examTypeFilter", content).addEventListener("change", (event) => {
      filter.type = event.target.value;
      paint();
    });
    $("#examSubjectFilter", content).addEventListener("change", (event) => {
      filter.subjectId = event.target.value;
      paint();
    });
    $("[data-new-exam]", content).addEventListener("click", () => openExamEditor());
    $("[data-import]", content).addEventListener("click", () => openImport());
    $("[data-cbt]", content).addEventListener("click", () => openCbtSeries());
    wrap.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-exam-edit]");
      if (edit) {
        openExamEditor(edit.dataset.examEdit);
        return;
      }
      const view = event.target.closest("[data-exam-view]");
      if (view) openExamDetail(view.dataset.examView);
    });
    paint();
  }

  /* ---------- exam editor ---------- */
  async function openExamEditor(examId) {
    await ensureOverview();
    let data = null;
    if (examId) data = await api("admin_exam_get", { examId });
    const existing = data ? data.exam : null;
    const catalogSubjects = subjects();
    const exam = existing || {
      title: "",
      code: "",
      subjectId: catalogSubjects[0] ? catalogSubjects[0].id : "trade-theory",
      tradeId: "",
      type: "final",
      durationMin: (state.settings && state.settings.defaultDurationMin) || 60,
      passPct: (state.settings && state.settings.defaultPassPct) || 40,
      marksPerQuestion: 1,
      negativeMarks: 0,
      attemptsAllowed: 1,
      instructions: (state.settings && state.settings.defaultInstructions) || "",
      instructionsEn: (state.settings && state.settings.defaultInstructionsEn) || "",
      startAt: null,
      endAt: null,
      releaseAt: null,
      releaseResults: Boolean(state.settings && state.settings.resultsReleaseDefault),
      showAnswers: Boolean(state.settings && state.settings.resultsReleaseDefault),
      active: true,
      status: "draft",
    };
    const published = exam.status === "published";
    const selected = [...(data && data.exam.questionIds ? data.exam.questionIds : [])];
    const questionMap = new Map();
    ((data && data.preview) || []).forEach((question) => questionMap.set(question.qid, question));
    let pickerPage = 1;
    let pickerData = null;
    let pickerRequest = 0;

    const body =
      '<div class="' +
      (published ? "notice warn" : exam.status === "locked" ? "notice info" : "notice") +
      '" style="margin-bottom:14px">' +
      (published
        ? "<strong>Published परीक्षा:</strong> प्रश्न, विषय और अंक नहीं बदले जा सकते। बदलाव के लिए पहले Unpublish करें। अन्य जानकारी सुरक्षित रूप से बदली जा सकती है।"
        : exam.status === "locked"
          ? "<strong>Locked परीक्षा:</strong> प्रश्न बदलने पर परीक्षा दोबारा Draft हो जाएगी और पुनः Lock करना होगा। पुराना पेपर स्नैपशॉट सुरक्षित रहेगा।"
          : "<strong>Draft:</strong> प्रश्न जोड़ें, सेव करें, फिर पेपर Lock और Publish करें।") +
      (exam.id ? " · ID: <b>" + esc(exam.id) + "</b>" : "") +
      "</div>" +
      '<form id="examEditorForm" autocomplete="off"><div class="editor-grid"><div class="editor-card">' +
      '<div class="form-grid">' +
      '<label class="field full"><span>परीक्षा शीर्षक *</span><input class="input" id="examTitle" required value="' + attr(exam.title) + '" placeholder="जैसे: Trade Theory Final Test"></label>' +
      '<label class="field"><span>Exam Code *</span><input class="input" id="examCode" value="' + attr(exam.code) + '" placeholder="TT-FINAL-1"><small>खाली छोड़ने पर शीर्षक से बनेगा।</small></label>' +
      '<label class="field"><span>विषय *</span><select class="select" id="examSubject"' + (published ? " disabled" : "") + ">" +
      optionList(
        catalogSubjects.map((subject) => ({ value: subject.id, label: subject.name })).concat([{ value: "mixed", label: "Mixed (सभी विषय)" }]),
        exam.subjectId
      ) +
      "</select></label>" +
      '<label class="field"><span>ट्रेड</span><select class="select" id="examTrade">' +
      optionList(
        [{ value: "", label: "सभी ट्रेड" }].concat(trades().map((trade) => ({ value: trade.id, label: trade.name }))),
        exam.tradeId || ""
      ) +
      "</select></label>" +
      '<label class="field"><span>प्रकार</span><select class="select" id="examType"' + (published ? " disabled" : "") + ">" +
      optionList(
        [
          { value: "final", label: "फाइनल परीक्षा" },
          { value: "practice", label: "अभ्यास परीक्षा" },
        ],
        exam.type
      ) +
      "</select></label>" +
      '<label class="field"><span>अवधि (मिनट) *</span><input class="input" id="examDuration" type="number" min="1" max="300" value="' + attr(exam.durationMin) + '"></label>' +
      '<label class="field"><span>पास प्रतिशत</span><input class="input" id="examPass" type="number" min="0" max="100" step="0.01" value="' + attr(exam.passPct) + '"></label>' +
      '<label class="field"><span>प्रति प्रश्न अंक</span><input class="input" id="examMarks" type="number" min="0.1" max="100" step="0.01" value="' + attr(exam.marksPerQuestion) + '"' + (published ? " disabled" : "") + "></label>" +
      '<label class="field"><span>ऋणात्मक अंक</span><input class="input" id="examNegative" type="number" min="0" max="100" step="0.01" value="' + attr(exam.negativeMarks) + '"' + (published ? " disabled" : "") + "></label>" +
      '<label class="field"><span>अनुमत प्रयास</span><input class="input" id="examAttempts" type="number" min="1" max="50" value="' + attr(exam.attemptsAllowed) + '"></label>' +
      '<label class="field"><span>शुरू होने का समय (वैकल्पिक)</span><input class="input" id="examStartAt" type="datetime-local" value="' + attr(UI.toLocalInput(exam.startAt)) + '"></label>' +
      '<label class="field"><span>समाप्ति समय (वैकल्पिक)</span><input class="input" id="examEndAt" type="datetime-local" value="' + attr(UI.toLocalInput(exam.endAt)) + '"></label>' +
      '<label class="field"><span>परिणाम जारी समय (वैकल्पिक)</span><input class="input" id="examReleaseAt" type="datetime-local" value="' + attr(UI.toLocalInput(exam.releaseAt)) + '"></label>' +
      '<label class="field full"><span>निर्देश (हिंदी)</span><textarea class="textarea" id="examInstructions" rows="4">' +
      esc(exam.instructions) +
      "</textarea></label>" +
      '<label class="field full"><span>निर्देश (English)</span><textarea class="textarea" id="examInstructionsEn" rows="4">' +
      esc(exam.instructionsEn || "") +
      '</textarea><small>छात्रों को निर्देश हिंदी और अंग्रेज़ी दोनों में दिखते हैं — यहाँ अंग्रेज़ी रूप लिखें।</small></label>' +
      '</div><div class="editor-section"><div class="stack">' +
      '<label class="check"><input type="checkbox" id="examReleaseResults"' + (exam.releaseResults ? " checked" : "") + "><span>सबमिट के बाद परिणाम घोषित करें (Final + उत्तर-कुंजी)</span></label>" +
      '<label class="check"><input type="checkbox" id="examActive"' + (exam.active !== false ? " checked" : "") + "><span>परीक्षा सक्रिय रखें</span></label>" +
      "</div></div></div>" +
      '<div class="editor-card paper-builder"><div class="admin-section-head"><div><h3>प्रश्न पत्र</h3><p class="admin-card-sub">क्रम और चयन</p></div><span class="badge-count" id="builderCount">0</span></div>' +
      '<div class="builder-summary" id="builderSummary"></div>' +
      '<div class="row" style="margin:10px 0 4px;align-items:center;gap:8px"><button class="btn btn-sm btn-soft" type="button" id="builderPreviewBtn">पूरा पेपर प्रीव्यू देखें</button><span class="tiny muted">सभी चुने प्रश्न, विकल्प, सही उत्तर, व्याख्या और अंक एक साथ देखें।</span></div>' +
      '<div class="selected-list" id="selectedList"></div>' +
      '<div class="editor-section"><div class="row-between"><h4 style="margin:0">विषय-वार प्रश्न-पत्र (Topic-wise)</h4><span class="tiny muted">हर टॉपिक की प्रश्न संख्या भरें</span></div>' +
      '<div class="topic-board" id="topicBoard"><p class="muted small">टॉपिक गिने जा रहे हैं…</p></div>' +
      '<div class="row topic-actions"><label class="check"><input type="checkbox" id="topicRandom"' +
      (published ? " disabled" : "") +
      "><span>प्रश्न बेतरतीब चुनें (Random)</span></label>" +
      '<button class="btn btn-sm btn-soft" type="button" id="topicRefreshBtn">सूची ताज़ा करें</button>' +
      '<span class="grow"></span>' +
      '<button class="btn btn-sm btn-navy" type="button" id="topicBuildBtn"' +
      (published ? " disabled" : "") +
      ">इससे पेपर बनाएँ</button></div>" +
      '<p class="tiny muted">' +
      (published
        ? "Published परीक्षा का पेपर नहीं बदला जा सकता।"
        : "पेपर बनाने पर नीचे के चयन की जगह यह प्रश्न-पत्र आ जाएगा। सेव करने तक कुछ नहीं बदलता।") +
      "</p></div>" +
      '<div class="editor-section"><h4>बैंक से प्रश्न जोड़ें</h4>' +
      '<div class="picker-toolbar"><input class="input grow-input" id="pickerSearch" placeholder="प्रश्न खोजें…"><select class="select compact" id="pickerSet"><option value="">सभी फ़ोल्डर</option></select><button class="btn btn-sm btn-ghost" type="button" id="pickerGo">खोजें</button></div>' +
      '<div class="row" style="margin-top:8px"><button class="btn btn-sm btn-soft" type="button" id="pickerAll"' +
      (published ? " disabled" : "") +
      '>इस फ़ोल्डर के सभी प्रश्न चुनें</button><span class="tiny muted" id="pickerSetHint">फ़ोल्डर चुनें तो सिर्फ़ उसी सेट के प्रश्न जुड़ेंगे।</span></div>' +
      '<div class="picker" id="pickerList"><p class="muted small">प्रश्न लोड हो रहे हैं…</p></div>' +
      '<div id="pickerPager"></div>' +
      (published ? '<p class="palette-note">Published परीक्षा में प्रश्न नहीं जोड़े या हटाए जा सकते।</p>' : "") +
      "</div></div></div></form>";

    const modal = UI.modal({
      title: existing ? "परीक्षा संपादित करें" : "नई परीक्षा",
      subtitle: existing ? existing.code + " · " + (existing.subjectName || "") : "विवरण भरें और प्रश्न चुनें",
      size: "lg",
      body: body,
      actions: [
        { label: "रद्द करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "पूरा पेपर देखें",
          ghost: true,
          id: "examPreviewBtnFoot",
          onClick: async (handle) => previewFromEditor(handle),
        },
        {
          label: existing ? "ड्राफ्ट में सेव करें" : "ड्राफ्ट बनाएँ",
          tone: "btn-navy",
          id: "examSaveBtn",
          onClick: async (handle) => saveExamFromEditor(handle),
        },
      ],
    });

    const root = modal.body;
    const selectedList = $("#selectedList", root);
    const pickerList = $("#pickerList", root);
    const pickerPager = $("#pickerPager", root);

    function currentSubject() {
      return $("#examSubject", root).value;
    }

    function defaultMarks() {
      return Number($("#examMarks", root).value) || 1;
    }

    function renderSelected() {
      $("#builderCount", root).textContent = String(selected.length);
      if (!selected.length) {
        selectedList.innerHTML = emptyBox("अभी कोई प्रश्न नहीं चुना", true);
      } else {
        selectedList.innerHTML = selected
          .map((qid, index) => {
            const question = questionMap.get(qid);
            return (
              '<div class="selected-q"><span class="qm">' +
              (index + 1) +
              '</span><div class="grow"><b>' +
              esc(truncate(question ? question.text : qid, 90)) +
              '</b><div class="tiny muted">' +
              esc(qid) +
              (question && question.marks !== undefined ? " · " + esc(UI.trimNumber(question.marks)) + " अंक" : "") +
              '</div></div><button type="button" data-remove="' +
              attr(qid) +
              '" aria-label="हटाएँ"' +
              (published ? " disabled" : "") +
              ">&times;</button></div>"
            );
          })
          .join("");
      }
      let total = 0;
      let missing = 0;
      selected.forEach((qid) => {
        const question = questionMap.get(qid);
        if (!question) missing += 1;
        total += Number(question && question.marks !== null && question.marks !== undefined ? question.marks : defaultMarks()) || 0;
      });
      $("#builderSummary", root).innerHTML =
        "<div>प्रश्न: <b>" +
        selected.length +
        "</b></div><div>अनुमानित अंक: <b>" +
        UI.trimNumber(total) +
        "</b></div><div>प्रति प्रश्न: <b>" +
        UI.trimNumber(defaultMarks()) +
        "</b></div><div>खाली प्रश्न: <b>" +
        missing +
        "</b></div>";
    }

    function pick(qid, shouldAdd) {
      if (published) return;
      const index = selected.indexOf(qid);
      if (shouldAdd && index < 0) selected.push(qid);
      if (!shouldAdd && index >= 0) selected.splice(index, 1);
      renderSelected();
      paintPickerSelection();
    }

    function paintPickerSelection() {
      $$("[data-pick]", pickerList).forEach((input) => {
        input.checked = selected.includes(input.dataset.pick);
        const item = input.closest(".picker-item");
        if (item) item.classList.toggle("selected", input.checked);
      });
    }

    async function loadPicker(page) {
      const requestId = ++pickerRequest;
      pickerPage = page || 1;
      pickerList.innerHTML = '<p class="muted small">प्रश्न लोड हो रहे हैं…</p>';
      const subject = currentSubject();
      try {
        const data = await api("admin_questions", {
          subjectId: subject === "mixed" ? "" : subject,
          setId: $("#pickerSet", root).value,
          q: $("#pickerSearch", root).value.trim(),
          page: pickerPage,
          pageSize: 30,
          active: true,
        });
        if (requestId !== pickerRequest) return;
        pickerData = data;
        paintPickerSets(data.sets || [], subject);
        const items = pickerData.items || [];
        items.forEach((question) => questionMap.set(question.qid, question));
        if (!items.length) {
          pickerList.innerHTML = emptyBox("इस फ़िल्टर पर कोई प्रश्न नहीं मिला", true);
          pickerPager.innerHTML = "";
          return;
        }
        pickerList.innerHTML = items
          .map(
            (question) =>
              '<label class="picker-item' +
              (selected.includes(question.qid) ? " selected" : "") +
              '"><input type="checkbox" data-pick="' +
              attr(question.qid) +
              '"' +
              (selected.includes(question.qid) ? " checked" : "") +
              (published ? " disabled" : "") +
              '><div class="p-text"><b>' +
              esc(truncate(question.text, 120)) +
              '</b><small>' +
              esc(question.qid) +
              (subject === "mixed" ? " · " + esc(question.subjectName || "") : "") +
              (question.setName ? " · 📁 " + esc(question.setName) : "") +
              " · " +
              esc(UI.trimNumber(question.marks)) +
              " अंक</small></div></label>"
          )
          .join("");
        pickerPager.innerHTML = pager(pickerData);
        $$("[data-page]", pickerPager).forEach((button) =>
          button.addEventListener("click", () => loadPicker(Number(button.dataset.page)))
        );
      } catch (error) {
        if (requestId !== pickerRequest) return;
        pickerList.innerHTML = emptyBox(error.message || "प्रश्न लोड नहीं हो सके", true);
      }
    }

    function paintPickerSets(sets, subject) {
      const select = $("#pickerSet", root);
      const previousValue = select.value;
      const kept = sets.some((set) => set.setId === previousValue);
      const options = [
        {
          value: "",
          label: "सभी फ़ोल्डर (" + sets.reduce((sum, set) => sum + set.count, 0) + ")",
        },
      ].concat(
        sets.map((set) => ({
          value: set.setId,
          label:
            (subject === "mixed" ? set.subjectName + " · " : "") +
            set.setName +
            " (" +
            set.count +
            ")",
        }))
      );
      select.innerHTML = optionList(options, kept ? previousValue : "");
      select.disabled = !sets.length;
      const hint = $("#pickerSetHint", root);
      const chosen = sets.find((set) => set.setId === select.value);
      const allButton = $("#pickerAll", root);
      if (allButton) {
        allButton.textContent = chosen
          ? "इस फ़ोल्डर के सभी प्रश्न चुनें"
          : "इस विषय के सभी प्रश्न चुनें";
      }
      if (hint) {
        hint.textContent = chosen
          ? "चुना फ़ोल्डर: " + chosen.setName + " — ऊपर वाला बटन इसी सेट के सभी प्रश्न जोड़ेगा।"
          : "फ़ोल्डर चुनें तो सिर्फ़ उसी सेट के प्रश्न जुड़ेंगे।";
      }
    }

    async function selectAllQuestions() {
      if (published) return;
      const button = $("#pickerAll", root);
      UI.setButtonBusy(button, true, "प्रश्न चुने जा रहे हैं…");
      try {
        const subject = currentSubject();
        const setId = $("#pickerSet", root).value;
        const q = $("#pickerSearch", root).value.trim();
        let page = 1;
        let pages = 1;
        let found = 0;
        let added = 0;
        let limitHit = false;
        do {
          const data = await api("admin_questions", {
            subjectId: subject === "mixed" ? "" : subject,
            setId,
            q,
            page,
            pageSize: 100,
            active: true,
          });
          for (const question of data.items || []) {
            found += 1;
            questionMap.set(question.qid, question);
            if (selected.includes(question.qid)) continue;
            if (selected.length >= 500) {
              limitHit = true;
              break;
            }
            selected.push(question.qid);
            added += 1;
          }
          pages = Number(data.pages) || 1;
          page += 1;
        } while (page <= pages && !limitHit);
        renderSelected();
        paintPickerSelection();
        UI.toast(
          limitHit
            ? "एक परीक्षा में अधिकतम 500 प्रश्न — " + added + " नए जोड़े गए"
            : added
              ? added + " नए प्रश्न जोड़े गए"
              : found
                ? "सभी प्रश्न पहले से चुने हुए हैं"
                : "इस विषय में कोई प्रश्न नहीं मिला",
          limitHit || !added ? "warn" : "good"
        );
      } catch (error) {
        UI.toast(error.message || "प्रश्न नहीं चुने जा सके", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    }

    async function loadTopicBoard() {
      const board = $("#topicBoard", root);
      if (!board) return;
      const subject = currentSubject();
      if (subject === "mixed") {
        board.innerHTML = emptyBox("टॉपिक-वार पेपर के लिए पहले एक विषय चुनें", true);
        return;
      }
      board.innerHTML = '<p class="muted small">टॉपिक गिने जा रहे हैं…</p>';
      try {
        const data = await api("admin_topics", { subjectId: subject });
        const rows = data.topics || [];
        if (!rows.length) {
          board.innerHTML = emptyBox("इस विषय में अभी प्रश्न नहीं हैं — पहले प्रश्न जोड़ें", true);
          return;
        }
        board.innerHTML = rows
          .map(
            (row) =>
              '<div class="topic-row"><span class="topic-name"><b>' +
              esc(row.topic) +
              '</b><small>' +
              esc(row.count) +
              " प्रश्न · " +
              esc(UI.trimNumber(row.marks)) +
              " अंक</small></span>" +
              '<input class="input topic-count" type="number" min="0" max="' +
              esc(row.count) +
              '" value="0" data-topic="' +
              attr(row.topic) +
              '" aria-label="' +
              attr(row.topic) +
              ' प्रश्न संख्या">' +
              '<button class="btn btn-ghost btn-sm" type="button" data-topic-all="' +
              attr(row.topic) +
              '" data-max="' +
              esc(row.count) +
              '">सभी</button></div>'
          )
          .join("");
      } catch (error) {
        board.innerHTML = emptyBox(error.message || "टॉपिक नहीं मिल सके", true);
      }
    }

    async function buildTopicPaper(button) {
      if (published) return;
      const plan = $$("[data-topic]", $("#topicBoard", root))
        .map((input) => ({ topic: input.dataset.topic, count: Number(input.value) || 0 }))
        .filter((row) => row.count > 0);
      if (!plan.length) {
        UI.toast("कम से कम एक टॉपिक के लिए प्रश्न संख्या भरें", "bad");
        return;
      }
      UI.setButtonBusy(button, true, "पेपर बन रहा है…");
      try {
        const data = await api("admin_paper_build", {
          subjectId: currentSubject(),
          plan,
          randomize: $("#topicRandom", root).checked,
        });
        selected.length = 0;
        (data.questions || []).forEach((question) => {
          if (!questionMap.has(question.qid)) {
            questionMap.set(question.qid, {
              qid: question.qid,
              text: question.text,
              marks: question.marks,
              topic: question.topic,
            });
          }
          selected.push(question.qid);
        });
        renderSelected();
        paintPickerSelection();
        const short = data.short || [];
        UI.toast(
          data.total +
            " प्रश्न · " +
            UI.trimNumber(data.marks) +
            " अंक का पेपर तैयार" +
            (short.length
              ? " · कम पड़े: " + short.map((row) => row.topic + " (" + row.have + "/" + row.want + ")").join(", ")
              : ""),
          short.length ? "warn" : "good"
        );
      } catch (error) {
        UI.toast(error.message || "पेपर नहीं बन सका", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    }

    const topicBoard = $("#topicBoard", root);
    topicBoard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-topic-all]");
      if (!button) return;
      const input = $$("[data-topic]", topicBoard).find(
        (field) => field.dataset.topic === button.dataset.topicAll
      );
      if (input) input.value = Number(input.max) || 0;
    });
    topicBoard.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        buildTopicPaper($("#topicBuildBtn", root));
      }
    });
    $("#topicRefreshBtn", root).addEventListener("click", loadTopicBoard);
    $("#topicBuildBtn", root).addEventListener("click", (event) => buildTopicPaper(event.currentTarget));

    selectedList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button || button.disabled) return;
      pick(button.dataset.remove, false);
    });
    pickerList.addEventListener("change", (event) => {
      const input = event.target.closest("[data-pick]");
      if (!input) return;
      pick(input.dataset.pick, input.checked);
    });
    $("#pickerGo", root).addEventListener("click", () => loadPicker(1));
    $("#pickerSet", root).addEventListener("change", () => loadPicker(1));
    $("#pickerAll", root).addEventListener("click", selectAllQuestions);
    $("#builderPreviewBtn", root).addEventListener("click", () => previewFromEditor(modal));
    $("#pickerSearch", root).addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        loadPicker(1);
      }
    });
    $("#examMarks", root).addEventListener("input", renderSelected);
    $("#examSubject", root).addEventListener("change", async (event) => {
      if (selected.length) {
        const ok = await UI.confirm({
          title: "विषय बदलें?",
          message: "विषय बदलने पर चुने हुए प्रश्न हट जाएँगे।",
          confirmText: "विषय बदलें",
          tone: "btn-warn",
        });
        if (!ok) {
          event.target.value = exam.subjectId;
          return;
        }
        selected.length = 0;
        renderSelected();
      }
      exam.subjectId = event.target.value;
      loadPicker(1);
      loadTopicBoard();
    });

    function collectExamPayload() {
      const title = $("#examTitle", root).value.trim();
      if (title.length < 2) {
        UI.toast("परीक्षा का शीर्षक दर्ज करें", "bad");
        $("#examTitle", root).focus();
        return null;
      }
      let code = $("#examCode", root).value.trim().toUpperCase().replace(/\s+/g, "-");
      if (!code) {
        code =
          title
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 24) || "EXAM-" + Date.now().toString(36).toUpperCase();
      }
      const payload = {
        title,
        code,
        subjectId: currentSubject(),
        tradeId: $("#examTrade", root).value,
        type: $("#examType", root).value,
        durationMin: Number($("#examDuration", root).value),
        passPct: Number($("#examPass", root).value),
        marksPerQuestion: Number($("#examMarks", root).value),
        negativeMarks: Number($("#examNegative", root).value),
        attemptsAllowed: Number($("#examAttempts", root).value),
        startAt: UI.fromLocalInput($("#examStartAt", root).value),
        endAt: UI.fromLocalInput($("#examEndAt", root).value),
        releaseAt: UI.fromLocalInput($("#examReleaseAt", root).value),
        instructions: $("#examInstructions", root).value,
        instructionsEn: $("#examInstructionsEn", root).value,
        releaseResults: $("#examReleaseResults", root).checked,
        showAnswers: $("#examReleaseResults", root).checked,
        active: $("#examActive", root).checked,
      };
      if (existing) payload.id = existing.id;
      return payload;
    }

    async function saveExamFromEditor(handle) {
      const payload = collectExamPayload();
      if (!payload) return;
      const saveBtn = $("#examSaveBtn", handle.foot);
      UI.setButtonBusy(saveBtn, true, "सेव हो रहा है…");
      try {
        const result = await api("admin_exam_save", { exam: payload, questionIds: selected });
        handle.close();
        UI.toast(existing ? "परीक्षा अपडेट हुई" : "परीक्षा बन गई", "good");
        await afterExamChange(result.exam && result.exam.id);
      } catch (error) {
        UI.toast(error.message || "परीक्षा सेव नहीं हो सकी", "bad");
      } finally {
        UI.setButtonBusy(saveBtn, false);
      }
    }

    async function previewFromEditor(handle) {
      if (!selected.length) {
        UI.toast("प्रीव्यू से पहले कम से कम एक प्रश्न चुनें", "bad");
        return;
      }
      const payload = collectExamPayload();
      if (!payload) return;
      const previewBtn = $("#examPreviewBtnFoot", handle.foot) || $("#builderPreviewBtn", root);
      UI.setButtonBusy(previewBtn, true, "ड्राफ्ट सेव हो रहा है…");
      try {
        const result = await api("admin_exam_save", { exam: payload, questionIds: selected });
        handle.close();
        UI.toast("पेपर ड्राफ्ट में सेव हुआ — पूरा प्रीव्यू खुल रहा है", "good");
        await refreshExamCache();
        state.overview = null;
        if (state.route === "exams" || state.route === "dashboard") await renderRoute(state.route, true);
        await openExamPreview(result.exam.id, { manage: true });
      } catch (error) {
        UI.toast(error.message || "प्रीव्यू नहीं खुल सका", "bad");
      } finally {
        UI.setButtonBusy(previewBtn, false);
      }
    }

    renderSelected();
    loadPicker(1);
    loadTopicBoard();
  }

  /* ---------- CBT series (CBT1, CBT2 …) ---------- */
  async function openCbtSeries() {
    await ensureOverview();
    const catalogSubjects = subjects().filter((subject) => subject.id !== "mixed");
    if (!catalogSubjects.length) {
      UI.toast("पहले कोई विषय बनाएँ", "bad");
      return;
    }
    const defaultTrade = (trades()[0] && trades()[0].id) || "chnm";
    const settings = state.settings || {};
    const body =
      '<div class="form-grid">' +
      '<label class="field"><span>विषय *</span><select class="select" id="cbtSubject">' +
      optionList(catalogSubjects.map((subject) => ({ value: subject.id, label: subject.name })), catalogSubjects[0].id) +
      "</select></label>" +
      '<label class="field"><span>कितनी सीबीटी *</span><input class="input" id="cbtCount" type="number" min="1" max="10" value="3"><small>3 लिखने पर CBT1, CBT2, CBT3 बनेंगी।</small></label>' +
      '<label class="field"><span>नाम का आधार</span><input class="input" id="cbtPrefix" maxlength="12" value="CBT"><small>अंग्रेज़ी अक्षर/अंक, जैसे CBT या Mock</small></label>' +
      '<label class="field"><span>ट्रेड</span><select class="select" id="cbtTrade">' +
      optionList(trades().map((trade) => ({ value: trade.id, label: trade.name })), defaultTrade) +
      "</select></label>" +
      '<label class="field"><span>प्रकार</span><select class="select" id="cbtType">' +
      optionList(
        [
          { value: "practice", label: "अभ्यास परीक्षा" },
          { value: "final", label: "फाइनल परीक्षा" },
        ],
        "practice"
      ) +
      "</select></label>" +
      '<label class="field"><span>अवधि (मिनट)</span><input class="input" id="cbtDuration" type="number" min="1" max="300" value="' +
      attr(settings.defaultDurationMin || 60) +
      '"></label>' +
      '<label class="field"><span>पास प्रतिशत</span><input class="input" id="cbtPass" type="number" min="0" max="100" value="' +
      attr(settings.defaultPassPct || 40) +
      '"></label>' +
      '<label class="field"><span>प्रति प्रश्न अंक</span><input class="input" id="cbtMarks" type="number" min="0.1" max="100" step="0.01" value="1"></label>' +
      '<label class="field"><span>ऋणात्मक अंक</span><input class="input" id="cbtNegative" type="number" min="0" max="100" step="0.01" value="0.25"></label>' +
      '<label class="field"><span>अनुमत प्रयास</span><input class="input" id="cbtAttempts" type="number" min="1" max="50" value="1"></label>' +
      "</div>" +
      '<div class="notice info">हर टॉपिक के प्रश्न बारी-बारी सब सीबीटी में बाँटे जाते हैं — इसलिए हर पेपर में टॉपिक का असर बराबर रहेगा और प्रश्न एक-दूसरे से अलग रहेंगे। बैंक छोटा पड़ा तो कुछ सीबीटी में कम प्रश्न रहेंगे (बाद में एडिट कर सकते हैं)। पेपर <b>Draft</b> बनेंगे — जाँचकर Lock/Publish करें।</div>' +
      '<div id="cbtPlan"></div>';

    const modal = UI.modal({
      title: "सीबीटी श्रृंखला बनाएँ",
      subtitle: "एक ही विषय के लिए CBT1, CBT2 … — टॉपिक-वार संतुलित पेपर",
      size: "lg",
      body: body,
      actions: [
        { label: "रद्द करें", ghost: true, onClick: (handle) => handle.close() },
        { label: "बनाएँ", tone: "btn-navy", id: "cbtRunBtn", onClick: async (handle) => run(handle) },
      ],
    });
    const root = modal.body;

    async function run(handle) {
      const subjectId = $("#cbtSubject", root).value;
      const subject = catalogSubjects.find((item) => item.id === subjectId);
      const series = Math.min(10, Math.max(1, Number($("#cbtCount", root).value) || 1));
      const prefix = ($("#cbtPrefix", root).value || "CBT").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) || "CBT";
      const planWrap = $("#cbtPlan", root);
      const button = $("#cbtRunBtn", handle.foot);
      UI.setButtonBusy(button, true, "प्रश्न बैंक पढ़ा जा रहा है…");
      try {
        const topicData = await api("admin_topics", { subjectId });
        const topics = (topicData.topics || []).filter((row) => row.count > 0);
        if (!topics.length) throw new Error("इस विषय में सक्रिय प्रश्न नहीं हैं — पहले प्रश्न जोड़ें या आयात करें");
        const build = await api(
          "admin_paper_build",
          { subjectId, plan: topics.map((row) => ({ topic: row.topic, count: row.count })), randomize: true }
        );
        const grouped = new Map();
        (build.questions || []).forEach((question) => {
          if (!grouped.has(question.topic)) grouped.set(question.topic, []);
          grouped.get(question.topic).push(question.qid);
        });
        const buckets = [];
        for (let i = 0; i < series; i += 1) buckets.push([]);
        topics.forEach((row) => {
          const list = grouped.get(row.topic) || [];
          list.forEach((qid, index) => buckets[index % series].push(qid));
        });

        const takenCodes = new Set((await loadExams(true)).map((exam) => String(exam.code || "").toUpperCase()));
        const created = [];
        const skipped = [];
        for (let i = 0; i < series; i += 1) {
          const ids = buckets[i];
          if (!ids.length) {
            skipped.push(prefix + (i + 1) + " (इस भाग में प्रश्न नहीं बचे)");
            continue;
          }
          let code = (prefix + (i + 1) + "-" + (subject.code || "EXAM")).slice(0, 30);
          let guard = 1;
          while (takenCodes.has(code.toUpperCase())) {
            code = (prefix + (i + 1) + "-" + (subject.code || "EXAM") + "-" + ++guard).slice(0, 30);
          }
          takenCodes.add(code.toUpperCase());
          const result = await api("admin_exam_save", {
            exam: {
              title: prefix + (i + 1) + " — " + subject.name,
              code,
              subjectId,
              tradeId: $("#cbtTrade", root).value,
              type: $("#cbtType", root).value,
              durationMin: Number($("#cbtDuration", root).value) || 60,
              passPct: Number($("#cbtPass", root).value) || 40,
              marksPerQuestion: Number($("#cbtMarks", root).value) || 1,
              negativeMarks: Number($("#cbtNegative", root).value) || 0,
              attemptsAllowed: Number($("#cbtAttempts", root).value) || 1,
              instructions: settings.defaultInstructions || "",
              instructionsEn: settings.defaultInstructionsEn || "",
              releaseResults: false,
              active: true,
            },
            questionIds: ids,
          });
          created.push(result.exam);
        }

        planWrap.innerHTML =
          '<div class="notice ' + (created.length ? "good" : "warn") + '" style="margin-top:12px"><b>' +
          created.length +
          "</b> परीक्षा बन गईं" +
          (skipped.length ? " · छोड़ी गई: " + esc(skipped.join(", ")) : "") +
          "</div>" +
          (created.length
            ? '<div class="table-wrap"><table class="data"><thead><tr><th>परीक्षा</th><th>कोड</th><th>प्रश्न</th><th>अंक</th><th></th></tr></thead><tbody>' +
              created
                .map(
                  (exam) =>
                    "<tr><td>" +
                    esc(exam.title) +
                    '</td><td><span class="t-sub">' +
                    esc(exam.code) +
                    "</span></td><td>" +
                    esc(exam.totalQuestions) +
                    "</td><td>" +
                    esc(UI.trimNumber(exam.totalMarks)) +
                    '</td><td class="actions"><button class="btn btn-sm btn-ghost" type="button" data-open-exam="' +
                    attr(exam.id) +
                    '">विवरण</button></td></tr>'
                )
                .join("") +
              "</tbody></table></div>"
            : "");
        if (created.length) {
          $$("[data-open-exam]", planWrap).forEach((node) =>
            node.addEventListener("click", () => {
              handle.close();
              openExamDetail(node.dataset.openExam);
            })
          );
          UI.toast(created.length + " सीबीटी ड्राफ्ट बन गईं — जाँचकर Publish करें", "good");
          await afterExamChange();
        } else {
          UI.toast("कोई परीक्षा नहीं बन सकी", "warn");
        }
      } catch (error) {
        planWrap.innerHTML = '<div class="notice bad" style="margin-top:12px">' + esc(error.message || "श्रृंखला नहीं बन सकी") + "</div>";
      } finally {
        UI.setButtonBusy(button, false);
      }
    }
  }

  async function afterExamChange(openId) {
    await refreshExamCache();
    state.overview = null;
    if (state.route === "exams" || state.route === "dashboard") {
      await renderRoute(state.route, true);
    }
    if (openId) openExamDetail(openId);
  }

  /* ---------- exam detail ---------- */
  async function openExamDetail(examId) {
    if (detailModal) {
      detailModal.close();
      detailModal = null;
    }
    const data = await api("admin_exam_get", { examId });
    const exam = data.exam;
    const stats = data.stats || {};
    const published = exam.status === "published";

    const body =
      '<div class="row-between" style="margin-bottom:14px"><div class="row">' +
      examStatus(exam) +
      '<span class="pill">' +
      esc(exam.subjectName || "") +
      (exam.tradeName ? " · " + esc(exam.tradeName) : "") +
      '</span><span class="pill">' +
      esc(UI.fmtDuration(exam.durationMin)) +
      "</span></div><div class=\"row\"><button class=\"btn btn-sm btn-ghost\" type=\"button\" id=\"examEditBtn\">एडिट</button><button class=\"btn btn-sm btn-ghost\" type=\"button\" id=\"examPreviewBtn\">पूरा पेपर देखें</button></div></div>" +
      '<div class="grid-2"><div><dl class="detail-list">' +
      detailRow("परीक्षा कोड", exam.code) +
      detailRow("प्रश्न / पूर्णांक", (exam.totalQuestions ?? exam.questionCount ?? 0) + " प्रश्न · " + UI.trimNumber(exam.totalMarks) + " अंक") +
      detailRow("प्रति प्रश्न", UI.trimNumber(exam.marksPerQuestion) + " अंक · ऋणात्मक " + UI.trimNumber(exam.negativeMarks)) +
      detailRow("पास प्रतिशत", UI.trimNumber(exam.passPct) + "%") +
      detailRow("अनुमत प्रयास", exam.attemptsAllowed) +
      detailRow("पेपर वर्ज़न", exam.paperVersion ? "v" + exam.paperVersion + (exam.paperLockedAt ? " · लॉक " + UI.fmtDateTime(exam.paperLockedAt) : "") : "अभी लॉक नहीं") +
      detailRow("परिणाम जारी", exam.releaseResults ? (exam.releaseAt ? UI.fmtDateTime(exam.releaseAt) + " से" : "हाँ") : "नहीं") +
      detailRow("उत्तर-कुंजी", exam.releaseResults ? "परिणाम के साथ दिख रही है" : "परिणाम जारी होने पर दिखेगी") +
      detailRow("प्रकाशित", exam.publishedAt ? UI.fmtDateTime(exam.publishedAt) : "—") +
      "</dl></div><div><div class=\"stat-grid\" style=\"grid-template-columns:1fr 1fr;margin-bottom:0\">" +
      statCard("परिणाम", stats.count || 0, "जमा") +
      statCard("सक्रिय प्रयास", exam.activeAttempts || 0, "अभी चालू") +
      statCard("औसत", UI.trimNumber(stats.average || 0) + "%", "") +
      statCard("पास दर", UI.trimNumber(stats.passRate || 0) + "%", "") +
      "</div></div></div>" +
      (exam.instructions || exam.instructionsEn
        ? '<div class="editor-section"><h4>निर्देश / Instructions</h4>' +
          (exam.instructions ? '<div class="instruction-box">' + esc(exam.instructions) + "</div>" : "") +
          (exam.instructionsEn
            ? '<div class="instruction-box" style="margin-top:8px">' + esc(exam.instructionsEn) + "</div>"
            : "") +
          "</div>"
        : "") +
      '<div class="editor-section"><div class="admin-section-head"><div><h4 style="margin:0">सक्रिय प्रयास</h4><p class="admin-card-sub">आवश्यक होने पर प्रयास अभी समाप्त करें</p></div></div>' +
      (data.attempts.length
        ? '<div class="attempt-list">' +
          data.attempts
            .map(
              (attempt) =>
                '<div class="attempt-row"><div class="a-main"><b>' +
                esc(attempt.studentName) +
                "</b><small>" +
                esc(attempt.regId) +
                " · " +
                esc(attempt.attempted) +
                " उत्तर · शुरू " +
                esc(UI.fmtDateTime(attempt.startedAt)) +
                '</small></div><button class="btn btn-sm btn-warn" type="button" data-finalize="' +
                attr(attempt.studentId) +
                '">अभी समाप्त करें</button></div>'
            )
            .join("") +
          "</div>"
        : emptyBox("कोई सक्रिय प्रयास नहीं", true)) +
      "</div>" +
      '<div class="editor-section"><div class="admin-section-head"><div><h4 style="margin:0">हाल के परिणाम</h4></div><button class="btn btn-sm btn-ghost" type="button" id="examResultsBtn">सभी परिणाम</button></div>' +
      (data.results.length
        ? '<div class="table-wrap"><table class="data"><thead><tr><th>विद्यार्थी</th><th>अंक</th><th>प्रतिशत</th><th>समय</th><th></th></tr></thead><tbody>' +
          data.results
            .map(
              (result) =>
                "<tr><td><span class=\"t-main\">" +
                esc(result.studentName) +
                '</span><div class="t-sub">' +
                esc(result.regId) +
                "</div></td><td>" +
                esc(UI.trimNumber(result.obtained)) +
                " / " +
                esc(UI.trimNumber(result.maxMarks)) +
                "</td><td>" +
                resultBadge(result) +
                "</td><td>" +
                esc(UI.fmtDateTime(result.submittedAt)) +
                '</td><td class="actions"><button class="btn btn-sm btn-ghost" type="button" data-detail-result="' +
                attr(result.resultId) +
                '">देखें</button></td></tr>'
            )
            .join("") +
          "</tbody></table></div>"
        : emptyBox("अभी कोई परिणाम नहीं", true)) +
      "</div>" +
      '<div class="editor-section"><div class="row-between"><div class="row"><button class="btn btn-sm btn-soft" type="button" id="examReleaseBtn">परिणाम जारी करें</button>' +
      (exam.releaseResults
        ? '<button class="btn btn-sm btn-ghost" type="button" id="examNoticeBtn">पोर्टल सूचना भेजें</button>'
        : "") +
      '<button class="btn btn-sm btn-ghost" type="button" id="examCsvBtn">परिणाम CSV</button></div>' +
      (exam.status === "draft"
        ? '<button class="btn btn-sm btn-bad" type="button" id="examDeleteBtn">Draft हटाएँ</button>'
        : '<span class="small muted">परिणाम/प्रयास मौजूद होने पर परीक्षा हटाना सुरक्षित रूप से रोका गया है।</span>') +
      "</div>";

    const actions = [{ label: "बंद करें", ghost: true, onClick: (handle) => handle.close() }];
    if (!published) {
      actions.push({
        label: exam.status === "locked" ? "पेपर फिर लॉक करें" : "पेपर लॉक करें",
        tone: "btn-navy",
        onClick: async (handle) => {
          const ok = await UI.confirm({
            title: "पेपर लॉक करें?",
            message: "लॉक करने पर पेपर का स्थायी स्नैपशॉट बनेगा। इसके बाद पेपर Publish किया जा सकता है।",
            confirmText: "लॉक करें",
            tone: "btn-navy",
          });
          if (!ok) return;
          await examAction(handle, "admin_exam_lock", { examId: exam.id }, "पेपर लॉक हो गया");
        },
      });
    }
    if (exam.status === "locked") {
      actions.push({
        label: "प्रकाशित करें",
        tone: "",
        onClick: async (handle) => {
          const ok = await UI.confirm({
            title: "परीक्षा प्रकाशित करें?",
            message: "प्रकाशित होते ही विद्यार्थी परीक्षा शुरू कर सकेंगे।",
            detail: exam.startAt ? "निर्धारित शुरुआत: " + UI.fmtDateTime(exam.startAt) : "",
            confirmText: "प्रकाशित करें",
            tone: "btn-navy",
          });
          if (!ok) return;
          await examAction(handle, "admin_exam_publish", { examId: exam.id }, "परीक्षा प्रकाशित हो गई");
        },
      });
    }
    if (published) {
      actions.push({
        label: "Unpublish करें",
        tone: "btn-warn",
        onClick: async (handle) => {
          const ok = await UI.confirm({
            title: "परीक्षा Unpublish करें?",
            message: "नए विद्यार्थी इसे शुरू नहीं कर पाएँगे। पहले से जमा परिणाम और पेपर सुरक्षित रहेंगे।",
            confirmText: "Unpublish",
            tone: "btn-warn",
          });
          if (!ok) return;
          await examAction(handle, "admin_exam_unpublish", { examId: exam.id }, "परीक्षा Unpublish हो गई");
        },
      });
    }

    detailModal = UI.modal({
      title: exam.title,
      subtitle: exam.code + " · " + (exam.subjectName || ""),
      size: "lg",
      body: body,
      actions: actions,
    });

    const root = detailModal.body;
    $("#examEditBtn", root).addEventListener("click", () => {
      if (detailModal) {
        detailModal.close();
        detailModal = null;
      }
      openExamEditor(exam.id);
    });
    $("#examPreviewBtn", root).addEventListener("click", () => openExamPreview(exam.id));
    $("#examReleaseBtn", root).addEventListener("click", () => openReleaseModal(exam));
    const examNoticeBtn = $("#examNoticeBtn", root);
    if (examNoticeBtn) examNoticeBtn.addEventListener("click", () => openResultNoticeModal(exam));
    $("#examCsvBtn", root).addEventListener("click", () => exportResultsCsv({ examId: exam.id }));
    $("#examResultsBtn", root).addEventListener("click", () => {
      state.resultFilter = { examId: exam.id, subjectId: "", tradeId: "", type: "", q: "", page: 1 };
      if (detailModal) detailModal.close();
      detailModal = null;
      goRoute("results");
    });
    const deleteBtn = $("#examDeleteBtn", root);
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async () => {
        const typed = await UI.confirm({
          title: "Draft परीक्षा हटाएँ?",
          message: "यह केवल Draft परीक्षा के लिए है और इसे वापस नहीं लाया जा सकता।",
          detail: "पुष्टि के लिए परीक्षा का नाम टाइप करें: " + exam.title,
          requireText: exam.title,
          confirmText: "स्थायी रूप से हटाएँ",
          tone: "btn-bad",
        });
        if (!typed) return;
        try {
          await api("admin_exam_delete", { examId: exam.id, confirm: typed });
          if (detailModal) detailModal.close();
          detailModal = null;
          UI.toast("Draft परीक्षा हटा दी गई", "good");
          await afterExamChange();
        } catch (error) {
          UI.toast(error.message || "परीक्षा हटाई नहीं जा सकी", "bad");
        }
      });
    }
    $$("[data-finalize]", root).forEach((button) =>
      button.addEventListener("click", async () => {
        const ok = await UI.confirm({
          title: "प्रयास अभी समाप्त करें?",
          message: "विद्यार्थी का चालू प्रयास बंद होकर परिणाम बन जाएगा। विद्यार्थी आगे उत्तर नहीं दे पाएगा।",
          confirmText: "समाप्त करें",
          tone: "btn-warn",
        });
        if (!ok) return;
        try {
          await api("admin_attempt_finalize", { examId: exam.id, studentId: button.dataset.finalize });
          UI.toast("प्रयास समाप्त और परिणाम बन गया", "good");
          openExamDetail(exam.id);
        } catch (error) {
          UI.toast(error.message || "प्रयास समाप्त नहीं हो सका", "bad");
        }
      })
    );
    $$("[data-detail-result]", root).forEach((button) =>
      button.addEventListener("click", () => openResultDetail(button.dataset.detailResult))
    );
  }

  function detailRow(label, value) {
    return "<div><dt>" + esc(label) + "</dt><dd>" + esc(value) + "</dd></div>";
  }

  async function examAction(handle, action, payload, message) {
    const buttons = $$("button", handle.foot);
    const target = buttons[buttons.length - 1];
    UI.setButtonBusy(target, true, "कृपया प्रतीक्षा करें…");
    try {
      await api(action, payload);
      handle.close();
      if (detailModal === handle) detailModal = null;
      UI.toast(message, "good");
      await afterExamChange(payload.examId);
    } catch (error) {
      UI.toast(error.message || "कार्य पूरा नहीं हो सका", "bad");
      UI.setButtonBusy(target, false);
    }
  }

  async function openExamPreview(examId, options = {}) {
    const data = await api("admin_exam_preview", { examId });
    const exam = data.exam;
    const status = exam.status || "draft";
    const statusText = status === "published" ? "प्रकाशित" : status === "locked" ? "लॉक — प्रकाशन योग्य" : "ड्राफ्ट";
    const body =
      '<div class="notice ' + (status === "published" ? "good" : status === "locked" ? "info" : "") + '">' +
      "<b>स्थिति: " + statusText + "</b> · कुल <b>" +
      data.totalQuestions +
      "</b> प्रश्न · <b>" +
      UI.trimNumber(data.totalMarks) +
      "</b> अंक · " +
      esc(UI.fmtDuration(exam.durationMin)) +
      " · पास " +
      esc(UI.trimNumber(exam.passPct)) +
      "% · प्रति प्रश्न +" +
      esc(UI.trimNumber(exam.marksPerQuestion)) +
      (Number(exam.negativeMarks) > 0 ? " / −" + esc(UI.trimNumber(exam.negativeMarks)) : "") +
      "</div>" +
      (options.manage && status === "draft"
        ? '<div class="notice warn">यह पेपर ड्राफ्ट में सेव है। नीचे पहले <b>पेपर लॉक करें</b>, फिर <b>प्रकाशित करें</b> — तभी विद्यार्थी परीक्षा शुरू कर सकेंगे।</div>'
        : options.manage && status === "locked"
          ? '<div class="notice info">पेपर लॉक हो चुका है। नीचे <b>प्रकाशित करें</b> दबाने पर परीक्षा विद्यार्थियों के लिए खुल जाएगी।</div>'
          : "") +
      (data.missing && data.missing.length
        ? '<div class="notice bad">गायब प्रश्न: ' + esc(data.missing.join(", ")) + "</div>"
        : "") +
      (exam.instructions || exam.instructionsEn
        ? '<div class="editor-section"><h4>परीक्षा निर्देश / Exam Instructions</h4>' +
          (exam.instructions ? '<div class="instruction-box">' + esc(exam.instructions) + "</div>" : "") +
          (exam.instructionsEn
            ? '<div class="instruction-box" style="margin-top:8px">' + esc(exam.instructionsEn) + "</div>"
            : "") +
          "</div>"
        : "") +
      '<div class="answer-review">' +
      data.questions
        .map((question, index) => {
          const correct = Number(question.correctIndex);
          return (
            '<article class="answer-card"><div class="a-head"><div class="a-q"><span class="muted small">प्रश्न ' +
            (index + 1) +
            " · " +
            esc(question.qid) +
            " </span><br>" +
            esc(question.text) +
            '</div><div><span class="pill">+' +
            esc(UI.trimNumber(question.marks)) +
            (Number(question.negativeMarks) > 0 ? " / −" + esc(UI.trimNumber(question.negativeMarks)) : "") +
            "</span></div></div>" +
            (question.image ? '<img class="q-image" src="' + attr(question.image) + '" alt="">' : "") +
            '<div class="answer-opts">' +
            question.options
              .map(
                (option, optionIndex) =>
                  '<div class="answer-opt' +
                  (optionIndex === correct ? " correct" : "") +
                  '"><b>' +
                  esc(UI.optionLetter(optionIndex)) +
                  ".</b><span>" +
                  esc(option) +
                  "</span>" +
                  (optionIndex === correct ? '<span class="tag">सही उत्तर</span>' : "") +
                  "</div>"
              )
              .join("") +
            "</div>" +
            (question.explanation
              ? '<div class="answer-explanation"><b>व्याख्या:</b> ' + esc(question.explanation) + "</div>"
              : "") +
            "</article>"
          );
        })
        .join("") +
      "</div>";

    const actions = [{ label: "प्रिंट", ghost: true, onClick: () => window.print() }];
    if (options.manage) {
      actions.push({
        label: "एडिट करें",
        ghost: true,
        onClick: (handle) => {
          handle.close();
          openExamEditor(examId);
        },
      });
      if (status === "draft") {
        actions.push({
          label: "पेपर लॉक करें",
          tone: "btn-navy",
          id: "previewLockBtn",
          onClick: async (handle) => {
            const ok = await UI.confirm({
              title: "पेपर लॉक करें?",
              message: "लॉक करने पर पेपर का स्थायी स्नैपशॉट बनेगा और अब प्रश्न नहीं बदले जाएँगे।",
              detail: "इसके बाद आप परीक्षा प्रकाशित कर सकते हैं।",
              confirmText: "लॉक करें",
              tone: "btn-navy",
            });
            if (!ok) return;
            const button = $("#previewLockBtn", handle.foot);
            UI.setButtonBusy(button, true, "लॉक हो रहा है…");
            try {
              await api("admin_exam_lock", { examId });
              UI.toast("पेपर लॉक हो गया — अब प्रकाशित कर सकते हैं", "good");
              handle.close();
              await refreshExamCache();
              state.overview = null;
              await openExamPreview(examId, { manage: true });
              if (state.route === "exams" || state.route === "dashboard") await renderRoute(state.route, true);
            } catch (error) {
              UI.toast(error.message || "पेपर लॉक नहीं हो सका", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        });
      }
      if (status === "locked") {
        actions.push({
          label: "प्रकाशित करें",
          tone: "",
          id: "previewPublishBtn",
          onClick: async (handle) => {
            const ok = await UI.confirm({
              title: "परीक्षा प्रकाशित करें?",
              message: "प्रकाशित होते ही विद्यार्थी परीक्षा शुरू कर सकेंगे।",
              detail: exam.startAt ? "निर्धारित शुरुआत: " + UI.fmtDateTime(exam.startAt) : "",
              confirmText: "प्रकाशित करें",
              tone: "btn-navy",
            });
            if (!ok) return;
            const button = $("#previewPublishBtn", handle.foot);
            UI.setButtonBusy(button, true, "प्रकाशित हो रहा है…");
            try {
              await api("admin_exam_publish", { examId });
              handle.close();
              UI.toast("परीक्षा प्रकाशित हो गई", "good");
              await afterExamChange(examId);
            } catch (error) {
              UI.toast(error.message || "परीक्षा प्रकाशित नहीं हो सकी", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        });
      }
      if (status === "published") {
        actions.push({
          label: "Unpublish करें",
          tone: "btn-warn",
          onClick: async (handle) => {
            const ok = await UI.confirm({
              title: "परीक्षा Unpublish करें?",
              message: "नए विद्यार्थी इसे शुरू नहीं कर पाएँगे। पहले से जमा परिणाम सुरक्षित रहेंगे।",
              confirmText: "Unpublish",
              tone: "btn-warn",
            });
            if (!ok) return;
            try {
              await api("admin_exam_unpublish", { examId });
              handle.close();
              UI.toast("परीक्षा Unpublish हो गई", "good");
              await afterExamChange(examId);
            } catch (error) {
              UI.toast(error.message || "Unpublish नहीं हो सका", "bad");
            }
          },
        });
      }
    }
    actions.push({ label: "बंद करें", ghost: true, onClick: (handle) => handle.close() });

    UI.modal({
      title: "पेपर प्रीव्यू — " + exam.title,
      subtitle: "प्रकाशन से पहले सभी प्रश्न, विकल्प, सही उत्तर, व्याख्या और अंक जाँचें",
      size: "lg",
      body: body,
      actions: actions,
    });
  }

  function openReleaseModal(exam) {
    const body =
      '<p class="confirm-message">फाइनल परीक्षा का परिणाम तभी दिखेगा जब यहाँ से जारी किया जाएगा। जारी होते ही विद्यार्थी को अंक, प्रतिशत, सही उत्तर और व्याख्या दिखेगी। अभ्यास परीक्षा के परिणाम हमेशा तुरंत उपलब्ध रहते हैं।</p>' +
      '<div class="stack"><label class="check"><input type="checkbox" id="releaseResults"' +
      (exam.releaseResults ? " checked" : "") +
      '><span><b>परिणाम और उत्तर-कुंजी जारी करें</b> — विद्यार्थी अपने अंक तथा हर प्रश्न का सही उत्तर देख सकेंगे</span></label>' +
      '<label class="field"><span>जारी होने का समय (वैकल्पिक)</span><input class="input" type="datetime-local" id="releaseAt" value="' +
      attr(UI.toLocalInput(exam.releaseAt)) +
      '"><small>खाली छोड़ने पर पूरा परिणाम तुरंत जारी माना जाएगा।</small></label></div>' +
      '<div class="notice info">उत्तर-कुंजी अलग से खोलनी नहीं पड़ती — परिणाम जारी करते ही छात्र को सही उत्तर और व्याख्या दिखने लगती है।</div>';

    const modal = UI.modal({
      title: "परिणाम जारी करें",
      subtitle: exam.title,
      size: "sm",
      body: body,
      actions: [
        { label: "रद्द करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "सेव करें",
          tone: "btn-navy",
          id: "releaseSaveBtn",
          onClick: async (handle) => {
            const releaseResults = $("#releaseResults", modal.body).checked;
            const releaseAt = UI.fromLocalInput($("#releaseAt", modal.body).value);
            const button = $("#releaseSaveBtn", handle.foot);
            UI.setButtonBusy(button, true, "सेव हो रहा है…");
            try {
              await api("admin_exam_release", {
                examId: exam.id,
                releaseResults,
                releaseAt,
              });
              handle.close();
              UI.toast(
                releaseResults ? "परिणाम और उत्तर-कुंजी जारी कर दिए गए" : "परिणाम छिपा दिया गया",
                "good"
              );
              if (releaseResults) {
                await afterExamChange();
                if (detailModal) {
                  detailModal.close();
                  detailModal = null;
                }
                openResultNoticeModal({ ...exam, releaseResults: true, releaseAt: releaseAt || exam.releaseAt });
              } else {
                await afterExamChange(exam.id);
              }
            } catch (error) {
              UI.toast(error.message || "सेटिंग सेव नहीं हो सकी", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        },
      ],
    });
    return modal;
  }

  function resultNoticeDraft(exam) {
    const when = exam.releaseAt ? new Date(exam.releaseAt) : null;
    const future = when && !Number.isNaN(when.getTime()) && when.getTime() > Date.now();
    const title = (exam.title || "CHNM परीक्षा").trim();
    return {
      title: future
        ? title + " — परिणाम " + UI.fmtDateTime(exam.releaseAt) + " से जारी होंगे"
        : title + " का परिणाम जारी हो गया है",
      body: future
        ? "परिणाम निर्धारित समय पर छात्र पोर्टल में जारी हो जाएँगे। लॉगिन करके अपना परिणाम, प्रतिशत और सही उत्तर देखें।"
        : "अपना परिणाम, प्रतिशत, उत्तर-कुंजी और सुधार के सुझाव छात्र पोर्टल में देखें। लॉगिन के लिए रजिस्ट्रेशन ID और मोबाइल नंबर चाहिए।",
    };
  }

  /* परिणाम की सूचना सीधे छात्र पोर्टल में — हर छात्र के डैशबोर्ड पर तुरंत दिखती है। */
  function openResultNoticeModal(exam) {
    const draft = resultNoticeDraft(exam);
    const body =
      '<p class="confirm-message">सूचना पोर्टल पर भेजते ही सभी छात्रों के डैशबोर्ड और सूचना पैनल में दिखने लगती है। साथ में समूह चैट में भी संदेश चला जाएगा।</p>' +
      '<label class="field"><span>शीर्षक</span><input class="input" id="noticeTitle" maxlength="120" value="' +
      attr(draft.title) +
      '"></label>' +
      '<label class="field" style="margin-top:10px"><span>संदेश</span><textarea class="textarea" id="noticeBody" rows="5" maxlength="4000">' +
      esc(draft.body) +
      "</textarea></label>" +
      '<label class="check" style="margin-top:10px"><input type="checkbox" id="noticeChat" checked><span>समूह चैट में भी भेजें</span></label>';
    const modal = UI.modal({
      title: "परिणाम की सूचना — छात्र पोर्टल",
      subtitle: exam.title,
      size: "sm",
      body: body,
      actions: [
        { label: "बंद करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "सभी छात्रों को भेजें",
          id: "portalNoticeSendBtn",
          onClick: async (handle) => {
            const button = $("#portalNoticeSendBtn", handle.foot);
            UI.setButtonBusy(button, true, "भेजी जा रही है…");
            const title = $("#noticeTitle", modal.body).value.trim();
            const text = $("#noticeBody", modal.body).value.trim();
            if (title.length < 2 || text.length < 2) {
              UI.toast("शीर्षक और संदेश दोनों लिखें", "bad");
              UI.setButtonBusy(button, false);
              return;
            }
            try {
              await api("admin_notice_save", {
                notice: { title, body: text, level: "important", audience: "all", active: true },
              });
              if ($("#noticeChat", modal.body).checked) {
                await api("admin_chat_send", { text: "📢 " + title + "\n" + text });
              }
              handle.close();
              UI.toast("सूचना भेज दी गई — सभी छात्रों को दिखेगी", "good");
            } catch (error) {
              UI.toast(error.message || "सूचना भेजी नहीं जा सकी", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        },
      ],
    });
    return modal;
  }

  /* ---------- question bank ---------- */
  async function renderQuestions(content) {
    await ensureOverview();
    const filter = state.questionFilter;
    content.innerHTML =
      '<div class="admin-section-head"><div><h1>प्रश्न बैंक</h1><p>विषय-वार प्रश्न बनाएँ, सत्यापित करें और Excel/CSV/JSON/HTML से आयात करें। हर आयात का अपना फ़ोल्डर बनता है ताकि पेपर बनाते समय सेट न मिलें।</p></div><div class="row"><a class="btn btn-ghost btn-sm" href="templates/guide.html" target="_blank" rel="noopener">अपलोड गाइड</a><a class="btn btn-ghost btn-sm" href="templates/questions-template.xlsx" download>Excel टेम्पलेट</a><button class="btn btn-ghost btn-sm" type="button" data-import>आयात करें</button><button class="btn btn-sm" type="button" data-new-question>नया प्रश्न</button></div></div>' +
      '<div class="folder-strip" id="questionFolders"></div>' +
      '<div class="toolbar"><input class="input grow-input" id="questionSearch" placeholder="प्रश्न या Question ID खोजें…" value="' +
      attr(filter.q) +
      '"><select class="select compact" id="questionSubject">' +
      optionList(
        [{ value: "", label: "सभी विषय" }].concat(subjects().map((subject) => ({ value: subject.id, label: subject.name }))),
        filter.subjectId
      ) +
      '</select><select class="select compact" id="questionSet">' +
      optionList([{ value: "", label: "सभी फ़ोल्डर" }], filter.setId) +
      '</select><select class="select compact" id="questionActive">' +
      optionList(
        [
          { value: "", label: "सभी प्रश्न" },
          { value: "true", label: "सक्रिय" },
          { value: "false", label: "निष्क्रिय" },
        ],
        filter.active
      ) +
      '</select><span class="grow"></span><span class="builder-count" id="questionTotal"></span></div>' +
      '<div id="questionRows"></div>';

    const rowsWrap = $("#questionRows", content);
    const foldersWrap = $("#questionFolders", content);
    let current = null;

    async function load() {
      rowsWrap.innerHTML = '<div class="admin-loading" style="min-height:220px">लोड हो रहा है…</div>';
      const payload = {
        subjectId: filter.subjectId,
        setId: filter.setId,
        q: filter.q,
        page: filter.page,
        pageSize: 20,
      };
      if (filter.active === "true") payload.active = true;
      if (filter.active === "false") payload.active = false;
      try {
        current = await api("admin_questions", payload);
        paintFolders();
        paint();
      } catch (error) {
        rowsWrap.innerHTML = emptyBox(error.message || "प्रश्न लोड नहीं हो सके");
        foldersWrap.innerHTML = "";
      }
    }

    function paintFolders() {
      const sets = (current && current.sets) || [];
      const setSelect = $("#questionSet", content);
      const options = [{ value: "", label: "सभी फ़ोल्डर (" + sets.reduce((sum, set) => sum + set.count, 0) + ")" }];
      sets.forEach((set) => {
        options.push({
          value: set.setId,
          label: (filter.subjectId || !set.subjectName ? "" : set.subjectName + " · ") + set.setName + " (" + set.count + ")",
        });
      });
      setSelect.innerHTML = optionList(options, filter.setId);
      setSelect.disabled = !sets.length;
      if (!sets.length) {
        foldersWrap.innerHTML = '<div class="notice info">अभी कोई फ़ोल्डर नहीं है। ऊपर से प्रश्न आयात करें — हर आयात का अलग फ़ोल्डर अपने आप बन जाएगा।</div>';
        return;
      }
      foldersWrap.innerHTML = sets
        .map((set) => {
          const active = filter.setId === set.setId && (!filter.subjectId || filter.subjectId === set.subjectId);
          return (
            '<button class="folder-card' +
            (active ? " active" : "") +
            '" type="button" data-folder-subject="' +
            attr(set.subjectId) +
            '" data-folder-set="' +
            attr(set.setId) +
            '"><span class="folder-icon" aria-hidden="true">' +
            (active ? "📂" : "📁") +
            '</span><span class="folder-text"><b>' +
            esc(set.setName) +
            "</b><small>" +
            esc(set.subjectName) +
            " · " +
            esc(set.count) +
            " प्रश्न" +
            (set.activeCount !== set.count ? " · " + esc(set.count - set.activeCount) + " निष्क्रिय" : "") +
            "</small></span></button>"
          );
        })
        .join("");
      $$("[data-folder-set]", foldersWrap).forEach((button) =>
        button.addEventListener("click", () => {
          const same =
            filter.setId === button.dataset.folderSet &&
            filter.subjectId === button.dataset.folderSubject;
          filter.setId = same ? "" : button.dataset.folderSet;
          filter.subjectId = same ? filter.subjectId : button.dataset.folderSubject;
          filter.page = 1;
          $("#questionSubject", content).value = filter.subjectId;
          load();
        })
      );
    }

    function paint() {
      const data = current;
      if (!data) return;
      $("#questionTotal", content).textContent = "कुल " + data.total + " प्रश्न";
      if (!data.items.length) {
        rowsWrap.innerHTML = emptyBox("इस फ़िल्टर पर कोई प्रश्न नहीं मिला");
        return;
      }
      rowsWrap.innerHTML =
        '<div class="table-wrap"><table class="data"><thead><tr><th>Question ID</th><th>प्रश्न</th><th>विषय</th><th>फ़ोल्डर</th><th>अंक</th><th>सही उत्तर</th><th>स्थिति</th><th>अपडेट</th><th></th></tr></thead><tbody>' +
        data.items
          .map(
            (question) =>
              "<tr><td><span class=\"t-sub\">" +
              esc(question.qid) +
              '</span></td><td><span class="t-main">' +
              esc(truncate(question.text, 90)) +
              (question.image ? ' <span class="pill">चित्र</span>' : "") +
              "</span></td><td>" +
              esc(question.subjectName || "") +
              '<div class="t-sub">' +
              esc(question.topic || "बिना टॉपिक") +
              "</div></td><td><span class=\"t-sub\">" +
              esc(question.setName || "") +
              "</span></td><td>" +
              esc(UI.trimNumber(question.marks)) +
              (Number(question.negativeMarks) > 0 ? '<div class="t-sub">−' + esc(UI.trimNumber(question.negativeMarks)) + "</div>" : "") +
              "</td><td><b>" +
              esc(UI.optionLetter(question.correctIndex)) +
              "</b></td><td>" +
              (question.active === false ? '<span class="pill">निष्क्रिय</span>' : '<span class="pill good">सक्रिय</span>') +
              "</td><td>" +
              esc(UI.fmtDate(question.updatedAt)) +
              '</td><td class="actions"><div class="row-actions"><button class="btn btn-sm btn-ghost" type="button" data-q-edit="' +
              attr(question.qid) +
              '">एडिट</button><button class="btn btn-sm btn-ghost" type="button" data-q-delete="' +
              attr(question.qid) +
              '">हटाएँ</button></div></td></tr>'
          )
          .join("") +
        "</tbody></table></div>" +
        pager(data);
      $$("[data-page]", rowsWrap).forEach((button) =>
        button.addEventListener("click", () => {
          filter.page = Number(button.dataset.page);
          load();
        })
      );
    }

    $("#questionSearch", content).addEventListener("input", UI.debounce((event) => {
      filter.q = event.target.value;
      filter.page = 1;
      load();
    }, 220));
    $("#questionSubject", content).addEventListener("change", (event) => {
      filter.subjectId = event.target.value;
      filter.setId = "";
      filter.page = 1;
      load();
    });
    $("#questionSet", content).addEventListener("change", (event) => {
      filter.setId = event.target.value;
      const set = (current && current.sets || []).find((item) => item.setId === filter.setId);
      if (set && !filter.subjectId) {
        filter.subjectId = set.subjectId;
        $("#questionSubject", content).value = filter.subjectId;
      }
      filter.page = 1;
      load();
    });
    $("#questionActive", content).addEventListener("change", (event) => {
      filter.active = event.target.value;
      filter.page = 1;
      load();
    });
    $("[data-new-question]", content).addEventListener("click", () =>
      openQuestionEditor(null, filter.subjectId)
    );
    $("[data-import]", content).addEventListener("click", () => openImport());
    rowsWrap.addEventListener("click", async (event) => {
      const edit = event.target.closest("[data-q-edit]");
      if (edit) {
        openQuestionEditor(edit.dataset.qEdit);
        return;
      }
      const remove = event.target.closest("[data-q-delete]");
      if (remove) {
        const qid = remove.dataset.qDelete;
        const typed = await UI.confirm({
          title: "प्रश्न हटाएँ?",
          message: "प्रश्न बैंक से यह प्रश्न स्थायी रूप से हट जाएगा। Locked/Published परीक्षा में प्रयुक्त प्रश्न सुरक्षित रूप से नहीं हटेगा।",
          detail: "पुष्टि के लिए Question ID टाइप करें: " + qid,
          requireText: qid,
          confirmText: "प्रश्न हटाएँ",
          tone: "btn-bad",
        });
        if (!typed) return;
        try {
          await api("admin_question_delete", { qid, confirm: typed });
          UI.toast("प्रश्न हटा दिया गया", "good");
          load();
        } catch (error) {
          UI.toast(error.message || "प्रश्न हटाया नहीं जा सका", "bad");
        }
      }
    });

    await load();
  }

  async function openQuestionEditor(qid, presetSubjectId) {
    await ensureOverview();
    let question = null;
    if (qid) {
      const data = await api("admin_question_get", { qid });
      question = data.question;
    }
    const subjectId =
      (question && question.subjectId) ||
      (presetSubjectId && presetSubjectId !== "mixed" ? presetSubjectId : "") ||
      (subjects()[0] && subjects()[0].id) ||
      "";
    if (!subjectId) {
      UI.toast("पहले कोई विषय बनाएँ", "bad");
      return;
    }
    const options = question ? [...question.options] : ["", "", "", ""];
    const correct = question ? Number(question.correctIndex) : 0;
    let editorSets = [];
    try {
      const setData = await api("admin_questions", { subjectId, page: 1, pageSize: 1 });
      editorSets = setData.sets || [];
    } catch (error) {
      editorSets = [];
    }
    const currentSet = question
      ? { setId: question.setId || "manual", setName: question.setName || "मैनुअल प्रश्न" }
      : { setId: "manual", setName: "मैनुअल प्रश्न" };
    const topicSuggestions = { "": [] };
    try {
      const topicData = await api("admin_topics", { subjectId });
      topicSuggestions[subjectId] = (topicData.topics || [])
        .map((row) => row.topic)
        .filter((name) => name && name !== "— विषय नहीं —");
    } catch (error) {
      topicSuggestions[subjectId] = [];
    }
    const setOptions = [
      { value: "manual", label: "मैनुअल प्रश्न (डिफ़ॉल्ट)" },
    ].concat(
      editorSets
        .filter((set) => set.setId !== "manual")
        .map((set) => ({ value: set.setId, label: set.setName + " (" + set.count + ")" }))
    );
    if (!setOptions.some((option) => option.value === currentSet.setId)) {
      setOptions.push({ value: currentSet.setId, label: currentSet.setName });
    }
    setOptions.push({ value: "__new", label: "＋ नया फ़ोल्डर…" });

    const body =
      '<form id="questionForm" autocomplete="off"><div class="form-grid">' +
      '<label class="field"><span>विषय *</span><select class="select" id="qSubject"' +
      (question ? " disabled" : "") +
      ">" +
      optionList(subjects().map((subject) => ({ value: subject.id, label: subject.name })), subjectId) +
      "</select></label>" +
      '<label class="field"><span>Question ID</span><input class="input" id="qId" value="' +
      attr(question ? question.qid : "") +
      '" placeholder="खाली छोड़ने पर स्वतः बनेगा"' +
      (question ? ' readonly' : "") +
      "></label>" +
      '<label class="field"><span>फ़ोल्डर / सेट</span><select class="select" id="qSet">' +
      optionList(setOptions, currentSet.setId) +
      "</select></label>" +
      '<label class="field" id="qSetNameWrap" hidden><span>नया फ़ोल्डर नाम</span><input class="input" id="qSetName" maxlength="120" placeholder="जैसे CHNM Set-11 (नवंबर)"></label>' +
      '<label class="field"><span>टॉपिक / उप-विषय</span><input class="input" id="qTopic" maxlength="120" list="topicSuggest" value="' +
      esc(question ? question.topic || "" : "") +
      '" placeholder="जैसे SMPS, ब्लूम टैक्सोनॉमी"><datalist id="topicSuggest">' +
      (topicSuggestions[subjectId] || []).map((name) => '<option value="' + attr(name) + '"></option>').join("") +
      "</datalist><small>इसी टॉपिक से विषय-वार प्रश्न-पत्र बनता है।</small></label>" +
      '<label class="field full"><span>प्रश्न *</span><textarea class="textarea" id="qText" rows="3" required>' +
      esc(question ? question.text : "") +
      "</textarea></label>" +
      "</div>" +
      '<div class="editor-section"><div class="row-between"><h4 style="margin:0">विकल्प और सही उत्तर</h4><span class="builder-count">सही उत्तर के आगे रेडियो चुनें</span></div>' +
      '<div class="option-editor" id="optionEditor"></div>' +
      '<button class="btn btn-ghost btn-sm" type="button" id="addOptionBtn" style="margin-top:9px">+ विकल्प जोड़ें</button></div>' +
      '<div class="form-grid" style="margin-top:14px">' +
      '<label class="field"><span>अंक</span><input class="input" id="qMarks" type="number" min="0.1" max="100" step="0.01" value="' +
      attr(question && question.marks !== null ? question.marks : "") +
      '" placeholder="खाली = डिफ़ॉल्ट"></label>' +
      '<label class="field"><span>ऋणात्मक अंक</span><input class="input" id="qNegative" type="number" min="0" max="100" step="0.01" value="' +
      attr(question && question.negativeMarks !== null ? question.negativeMarks : "") +
      '" placeholder="खाली = डिफ़ॉल्ट"></label>' +
      '<label class="field full"><span>व्याख्या (वैकल्पिक)</span><textarea class="textarea" id="qExplanation" rows="2">' +
      esc(question ? question.explanation : "") +
      "</textarea></label>" +
      '<label class="field full"><span>चित्र URL (वैकल्पिक)</span><input class="input" id="qImage" value="' +
      attr(question ? question.image : "") +
      '" placeholder="https://… या data:image/…"></label>' +
      '<label class="check full"><input type="checkbox" id="qActive"' +
      (!question || question.active !== false ? " checked" : "") +
      "><span>प्रश्न सक्रिय है</span></label>" +
      "</div></form>";

    const modal = UI.modal({
      title: question ? "प्रश्न संपादित करें" : "नया प्रश्न",
      subtitle: question ? question.qid : "प्रश्न बैंक में जोड़ें",
      size: "lg",
      body: body,
      actions: [
        { label: "रद्द करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "सेव करें",
          tone: "btn-navy",
          id: "questionSaveBtn",
          onClick: async (handle) => saveQuestion(handle),
        },
      ],
    });

    const root = modal.body;
    const editor = $("#optionEditor", root);
    let correctIndex = correct;

    const setSelect = $("#qSet", root);
    const setNameWrap = $("#qSetNameWrap", root);
    function syncSetNameField() {
      setNameWrap.hidden = setSelect.value !== "__new";
    }
    setSelect.addEventListener("change", syncSetNameField);
    syncSetNameField();
    if (!question) {
      $("#qSubject", root).addEventListener("change", async (event) => {
        try {
          const data = await api("admin_questions", { subjectId: event.target.value, page: 1, pageSize: 1 });
          editorSets = data.sets || [];
        } catch (error) {
          editorSets = [];
        }
        try {
          const topicData = await api("admin_topics", { subjectId: event.target.value });
          topicSuggestions[event.target.value] = (topicData.topics || [])
            .map((row) => row.topic)
            .filter((name) => name && name !== "— विषय नहीं —");
        } catch (error) {
          topicSuggestions[event.target.value] = [];
        }
        $("#topicSuggest", root).innerHTML = (topicSuggestions[event.target.value] || [])
          .map((name) => '<option value="' + attr(name) + '"></option>')
          .join("");
        const list = [{ value: "manual", label: "मैनुअल प्रश्न (डिफ़ॉल्ट)" }].concat(
          editorSets
            .filter((set) => set.setId !== "manual")
            .map((set) => ({ value: set.setId, label: set.setName + " (" + set.count + ")" }))
        );
        list.push({ value: "__new", label: "＋ नया फ़ोल्डर…" });
        setSelect.innerHTML = optionList(list, "manual");
        syncSetNameField();
      });
    }

    function renderOptions() {
      editor.innerHTML = options
        .map(
          (value, index) =>
            '<div class="option-row" data-opt-row><span class="opt-letter">' +
            UI.optionLetter(index) +
            '</span><input class="input option-input" data-opt="' +
            index +
            '" value="' +
            attr(value) +
            '" placeholder="विकल्प ' +
            UI.optionLetter(index) +
            '"><input type="radio" name="correctOpt" value="' +
            index +
            '"' +
            (index === correctIndex ? " checked" : "") +
            ' aria-label="सही उत्तर ' +
            UI.optionLetter(index) +
            '"><button class="btn btn-ghost remove-opt" type="button" data-remove-opt="' +
            index +
            '" aria-label="विकल्प हटाएँ"' +
            (options.length <= 2 ? " disabled" : "") +
            ">&times;</button></div>"
        )
        .join("");
      $("#addOptionBtn", root).disabled = options.length >= 6;
    }

    editor.addEventListener("input", (event) => {
      const input = event.target.closest("[data-opt]");
      if (input) options[Number(input.dataset.opt)] = input.value;
    });
    editor.addEventListener("change", (event) => {
      if (event.target.name === "correctOpt") correctIndex = Number(event.target.value);
    });
    editor.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-opt]");
      if (!button || button.disabled) return;
      const index = Number(button.dataset.removeOpt);
      options.splice(index, 1);
      if (correctIndex === index) correctIndex = 0;
      else if (correctIndex > index) correctIndex -= 1;
      renderOptions();
    });
    $("#addOptionBtn", root).addEventListener("click", () => {
      if (options.length >= 6) return;
      options.push("");
      renderOptions();
    });

    async function saveQuestion(handle) {
      const subject = $("#qSubject", root).value;
      const text = $("#qText", root).value.trim();
      const filled = options.map((option) => option.trim());
      if (text.length < 3) {
        UI.toast("प्रश्न लिखें (कम से कम 3 अक्षर)", "bad");
        return;
      }
      if (filled.length < 2 || filled.some((option) => !option)) {
        UI.toast("कम से कम दो विकल्प भरें — कोई विकल्प खाली न छोड़ें", "bad");
        return;
      }
      if (correctIndex < 0 || correctIndex >= filled.length) {
        UI.toast("सही उत्तर चुनें", "bad");
        return;
      }
      const marksValue = $("#qMarks", root).value.trim();
      const negativeValue = $("#qNegative", root).value.trim();
      const setChoice = setSelect.value;
      let setId = "";
      let setName = "";
      if (setChoice === "__new") {
        setName = $("#qSetName", root).value.trim();
        if (setName.length < 2) {
          UI.toast("फ़ोल्डर का नाम लिखें (कम से कम 2 अक्षर)", "bad");
          $("#qSetName", root).focus();
          return;
        }
      } else if (setChoice === "manual") {
        setId = "manual";
        setName = "मैनुअल प्रश्न";
      } else {
        const chosen = editorSets.find((set) => set.setId === setChoice);
        setId = setChoice;
        setName = chosen ? chosen.setName : currentSet.setName;
      }
      const payload = {
        subjectId: subject,
        question: {
          qid: $("#qId", root).value.trim(),
          text,
          options: filled,
          correctIndex,
          marks: marksValue === "" ? null : Number(marksValue),
          negativeMarks: negativeValue === "" ? null : Number(negativeValue),
          explanation: $("#qExplanation", root).value.trim(),
          image: $("#qImage", root).value.trim(),
          topic: $("#qTopic", root).value.trim(),
          active: $("#qActive", root).checked,
          setId,
          setName,
        },
      };
      if (question && question.id) payload.question.id = question.id;
      const button = $("#questionSaveBtn", handle.foot);
      UI.setButtonBusy(button, true, "सेव हो रहा है…");
      try {
        await api("admin_question_save", payload);
        handle.close();
        UI.toast(question ? "प्रश्न अपडेट हुआ" : "प्रश्न जोड़ दिया गया", "good");
        if (state.route === "questions") await renderRoute("questions", true);
        else if (state.route === "exams") await refreshExamCache();
      } catch (error) {
        UI.toast(error.message || "प्रश्न सेव नहीं हो सका", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    }

    renderOptions();
  }

  /* ---------- import ---------- */
  async function openImport(presetExamId) {
    await ensureOverview();
    const exams = await loadExams();
    const usableExams = exams.filter((exam) => exam.status !== "published" && exam.status !== "archived");
    const importState = { rows: null, ready: 0, warnings: 0, fileName: "", imported: false };

    const body =
      '<div class="notice info"><strong>नियम:</strong> एक फाइल में अधिकतम 1000 प्रश्न। Upload → सत्यापन → डुप्लीकेट जाँच → प्रीव्यू → आयात। कोई भी पंक्ति गलत होने पर बाकी सही पंक्तियाँ आयात हो सकती हैं और गलतियाँ अलग दिखेंगी।</div>' +
      '<div class="row" style="margin:12px 0"><a class="btn btn-sm btn-ghost" href="templates/questions-template.xlsx" download>Excel टेम्पलेट</a><a class="btn btn-sm btn-ghost" href="templates/questions-template.csv" download>CSV टेम्पलेट</a><a class="btn btn-sm btn-ghost" href="templates/questions-sample.json" download>JSON नमूना</a><a class="btn btn-sm btn-ghost" href="templates/question-paper-sample.html" download>HTML नमूना</a><a class="btn btn-sm btn-ghost" href="templates/guide.html" target="_blank" rel="noopener">अपलोड गाइड</a></div>' +
      '<div class="form-grid">' +
      '<label class="field"><span>डिफ़ॉल्ट विषय</span><select class="select" id="importSubject">' +
      optionList(
        [{ value: "", label: "फाइल की Subject कॉलम से लें" }].concat(
          subjects().map((subject) => ({ value: subject.id, label: subject.name }))
        ),
        ""
      ) +
      "</select></label>" +
      '<label class="field"><span>सीधे परीक्षा में जोड़ें (वैकल्पिक)</span><select class="select" id="importExam">' +
      optionList(
        [{ value: "", label: "केवल प्रश्न बैंक में" }].concat(
          usableExams.map((exam) => ({
            value: exam.id,
            label: exam.title + " (" + UI.examStatusText(exam.status) + ")",
          }))
        ),
        presetExamId || ""
      ) +
      "</select></label>" +
      '<label class="field"><span>फ़ोल्डर (सेट) का नाम *</span><input class="input" id="importSetName" maxlength="120" placeholder="जैसे CHNM Set-11 (नवंबर)"></label>' +
      '<div class="field full"><span class="tiny muted">इस फाइल के सभी प्रश्न इसी फ़ोल्डर में जाएँगे। अगली बार आयात करने पर नया फ़ोल्डर बनेगा — इसलिए अलग-अलग सेट आपस में नहीं मिलेंगे।</span></div></div>' +
      '<label class="dropzone" id="dropzone" for="importFile"><input type="file" id="importFile" accept=".xlsx,.xls,.csv,.json,.html,.htm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/json,text/html">' +
      "<strong>फाइल चुनें या यहाँ खींचकर छोड़ें</strong><span>XLSX, XLS, CSV, JSON या HTML · अधिकतम 1000 प्रश्न</span>" +
      '<div class="file-picked" id="filePicked" hidden></div></label>' +
      '<div id="importPreview" style="margin-top:14px"></div>';

    const modal = UI.modal({
      title: "प्रश्न आयात करें",
      subtitle: "Excel / CSV / JSON / HTML",
      size: "lg",
      body: body,
      actions: [
        { label: "बंद करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "आयात करें",
          tone: "btn-navy",
          id: "importRunBtn",
          onClick: async (handle) => {
            if (importState.imported) {
              handle.close();
              return;
            }
            if (!importState.rows || !importState.rows.length) {
              UI.toast("पहले फाइल चुनें", "bad");
              return;
            }
            const setName =
              $("#importSetName", modal.body).value.trim() ||
              importState.fileName.replace(/\.[^.]+$/, "") ||
              "आयात " + new Date().toISOString().slice(0, 10);
            const button = $("#importRunBtn", handle.foot);
            UI.setButtonBusy(button, true, "आयात हो रहा है…");
            try {
              const result = await api("admin_questions_import", {
                subjectId: $("#importSubject", modal.body).value,
                examId: $("#importExam", modal.body).value,
                setName,
                questions: importState.rows,
              });
              importState.imported = true;
              UI.toast(result.added + " प्रश्न जोड़े गए", result.added ? "good" : "warn");
              renderImportResult(handle, result);
              button.disabled = false;
              button.textContent = "बंद करें";
              await refreshExamCache();
              if (state.route === "questions" || state.route === "exams") {
                state.overview = null;
              }
            } catch (error) {
              UI.toast(error.message || "आयात नहीं हो सका", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        },
      ],
    });

    const root = modal.body;
    $("#importRunBtn", modal.foot).disabled = true;
    const fileInput = $("#importFile", root);
    const zone = $("#dropzone", root);

    async function handleFile(file) {
      if (!file) return;
      importState.fileName = file.name;
      const setInput = $("#importSetName", root);
      if (setInput && !setInput.value.trim()) {
        setInput.value =
          file.name.replace(/\.[^.]+$/, "").slice(0, 80) +
          " · " +
          new Date().toISOString().slice(0, 10);
      }
      $("#filePicked", root).hidden = false;
      $("#filePicked", root).textContent = file.name + " · " + Math.round(file.size / 1024) + " KB";
      $("#importPreview", root).innerHTML = '<div class="admin-loading" style="min-height:120px">फाइल पढ़ी जा रही है…</div>';
      try {
        const rawRows = await parseQuestionFile(file);
        if (!rawRows.length) throw new Error("फाइल में कोई पंक्ति नहीं मिली");
        if (rawRows.length > 1000) throw new Error("एक बार में अधिकतम 1000 प्रश्न आयात कर सकते हैं");
        const mapped = rawRows.map(mapImportRow);
        importState.rows = mapped;
        renderImportPreview();
        $("#importRunBtn", modal.foot).disabled = false;
      } catch (error) {
        importState.rows = null;
        $("#importPreview", root).innerHTML = '<div class="notice bad">' + esc(error.message || "फाइल पढ़ी नहीं जा सकी") + "</div>";
        $("#importRunBtn", modal.foot).disabled = true;
      }
    }

    function renderImportPreview() {
      const rows = importState.rows || [];
      const issues = [];
      let ready = 0;
      rows.forEach((row, index) => {
        const problems = [];
        if (!String(row.question || "").trim()) problems.push("प्रश्न खाली");
        if (!Array.isArray(row.options) || row.options.length < 2) problems.push("दो विकल्प नहीं");
        if (row.correctAnswer === "" || row.correctAnswer === null || row.correctAnswer === undefined) {
          problems.push("सही उत्तर खाली");
        }
        if (problems.length) issues.push({ row: index + 2, message: problems.join(", ") });
        else ready += 1;
      });
      importState.ready = ready;
      importState.warnings = issues.length;
      $("#importPreview", root).innerHTML =
        '<div class="notice ' +
        (issues.length ? "warn" : "good") +
        '"><b>' +
        rows.length +
        "</b> पंक्तियाँ पढ़ी गईं · तैयार: <b>" +
        ready +
        "</b>" +
        (issues.length ? " · चेतावनी: <b>" + issues.length + "</b> (आयात के बाद सर्वर विस्तृत त्रुटि देगा)" : "") +
        "</div>" +
        '<div class="import-preview"><table class="data"><thead><tr><th>#</th><th>प्रश्न</th><th>विषय</th><th>टॉपिक</th><th>विकल्प</th><th>उत्तर</th><th>अंक</th></tr></thead><tbody>' +
        rows
          .slice(0, 12)
          .map(
            (row, index) =>
              "<tr><td>" +
              (index + 2) +
              "</td><td>" +
              esc(truncate(row.question || "", 80)) +
              "</td><td>" +
              esc(row.subject || row.subjectId || "डिफ़ॉल्ट") +
              "</td><td>" +
              esc(row.topic || "—") +
              "</td><td>" +
              esc((row.options || []).length) +
              "</td><td><b>" +
              esc(row.correctAnswer) +
              "</b></td><td>" +
              esc(row.marks === "" || row.marks === null || row.marks === undefined ? "डिफ़ॉल्ट" : row.marks) +
              "</td></tr>"
          )
          .join("") +
        "</tbody></table></div>" +
        (rows.length > 12 ? '<p class="table-note">पहली 12 पंक्तियाँ दिख रही हैं।</p>' : "") +
        (issues.length
          ? '<div class="import-errors" style="margin-top:10px">' +
            issues
              .slice(0, 25)
              .map((issue) => "<div>पंक्ति " + issue.row + ": " + esc(issue.message) + "</div>")
              .join("") +
            "</div>"
          : "");
    }

    function renderImportResult(handle, result) {
      const errors = result.errors || [];
      const duplicates = result.duplicates || [];
      root.innerHTML =
        '<div class="notice ' +
        (result.added ? "good" : "warn") +
        '"><h3 style="margin:0 0 6px">आयात पूरा</h3><b>' +
        result.added +
        "</b> प्रश्न जोड़े गए · कुल पंक्तियाँ: " +
        result.total +
        " · त्रुटियाँ: " +
        errors.length +
        " · डुप्लीकेट: " +
        duplicates.length +
        (result.set && result.set.setName
          ? " · फ़ोल्डर: <b>" + esc(result.set.setName) + "</b>"
          : "") +
        (result.examQuestionCount !== null && result.examQuestionCount !== undefined
          ? " · परीक्षा में कुल प्रश्न: " + result.examQuestionCount
          : "") +
        "</div>" +
        (errors.length
          ? '<h4>त्रुटियाँ</h4><div class="import-errors">' +
            errors.map((error) => "<div>पंक्ति " + error.row + ": " + esc(error.message) + "</div>").join("") +
            "</div>"
          : "") +
        (duplicates.length
          ? '<h4 style="margin-top:12px">डुप्लीकेट (छोड़े गए)</h4><div class="import-errors">' +
            duplicates
              .map(
                (dup) =>
                  "<div>पंक्ति " +
                  dup.row +
                  ": " +
                  esc(dup.reason) +
                  (dup.qid ? " (" + esc(dup.qid) + ")" : "") +
                  "</div>"
              )
              .join("") +
            "</div>"
          : "") +
        (result.preview && result.preview.length
          ? '<h4 style="margin-top:12px">जोड़े गए प्रश्न (पहले ' + result.preview.length + ")</h4>" +
            '<div class="import-preview"><table class="data"><thead><tr><th>QID</th><th>प्रश्न</th><th>विषय</th><th>उत्तर</th></tr></thead><tbody>' +
            result.preview
              .map(
                (question) =>
                  "<tr><td>" +
                  esc(question.qid) +
                  "</td><td>" +
                  esc(truncate(question.text, 70)) +
                  "</td><td>" +
                  esc(question.subjectName || "") +
                  "</td><td><b>" +
                  esc(UI.optionLetter(question.correctIndex)) +
                  "</b></td></tr>"
              )
              .join("") +
            "</tbody></table></div>"
          : "") +
        '<div class="notice" style="margin-top:12px">अब प्रश्न बैंक या परीक्षा संपादक में जाकर इन्हें पेपर में जोड़ें, प्रीव्यू करें और Lock करें।</div>';
      if (state.route === "questions") {
        setTimeout(() => renderRoute("questions", true), 400);
      }
    }

    fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));
    ["dragenter", "dragover"].forEach((name) =>
      zone.addEventListener(name, (event) => {
        event.preventDefault();
        zone.classList.add("drag");
      })
    );
    ["dragleave", "drop"].forEach((name) =>
      zone.addEventListener(name, (event) => {
        event.preventDefault();
        zone.classList.remove("drag");
      })
    );
    zone.addEventListener("drop", (event) => {
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) handleFile(file);
    });
  }

  async function parseQuestionFile(file) {
    const name = String(file.name || "").toLowerCase();
    if (name.endsWith(".json")) {
      const text = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("JSON फाइल खराब है");
      }
      const rows = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.questions) ? parsed.questions : null;
      if (!rows) throw new Error("JSON में प्रश्नों की सूची नहीं मिली");
      return rows;
    }
    if (name.endsWith(".html") || name.endsWith(".htm")) {
      const text = await file.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const table = doc.querySelector("table");
      if (!table) throw new Error("HTML फाइल में <table> नहीं मिली — नीचे दिए HTML नमूने जैसी तालिका बनाएँ");
      const grid = Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => cell.textContent.trim()));
      if (grid.length < 2) throw new Error("HTML तालिका में हेडर पंक्ति और कम से कम एक प्रश्न होना चाहिए");
      const headers = grid[0];
      const rows = [];
      grid.slice(1).forEach((cells) => {
        if (!cells.some((cell) => cell)) return;
        const record = {};
        headers.forEach((header, index) => {
          if (header) record[header] = cells[index] === undefined ? "" : cells[index];
        });
        rows.push(record);
      });
      return rows;
    }
    if (!/\.(xlsx|xls|csv)$/.test(name)) {
      throw new Error("केवल XLSX, XLS, CSV, JSON या HTML फाइल चुनें");
    }
    if (!window.XLSX) {
      await UI.loadScript("assets/vendor/xlsx.full.min.js");
    }
    if (!window.XLSX) throw new Error("Excel लाइब्रेरी लोड नहीं हो सकी");
    // CSV must be parsed from decoded text: reading its bytes makes the sheet
    // library treat Hindi UTF-8 as Latin-1 and the preview turns into mojibake.
    const workbook = name.endsWith(".csv")
      ? window.XLSX.read((await file.text()).replace(/^\uFEFF/, ""), { type: "string" })
      : window.XLSX.read(await file.arrayBuffer(), { type: "array" });
    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) throw new Error("फाइल में कोई शीट नहीं मिली");
    const sheet = workbook.Sheets[firstSheet];
    return window.XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
  }

  function mapImportRow(raw) {
    if (!raw || typeof raw !== "object") {
      return { question: "", options: [], correctAnswer: "" };
    }
    const norm = {};
    Object.keys(raw).forEach((key) => {
      norm[String(key).toLowerCase().replace(/[^a-z0-9]/g, "")] = raw[key];
    });
    const optionValues = Array.isArray(raw.options)
      ? raw.options.map((value) => String(value || "").trim())
      : ["optiona", "optionb", "optionc", "optiond", "optione", "optionf"]
          .map((key) => String(norm[key] || "").trim())
          .filter(Boolean);
    return {
      qid: raw.qid || raw.id || norm.questionid || norm.qid || "",
      subject: raw.subject || norm.subject || "",
      subjectId: raw.subjectId || norm.subjectid || "",
      question: raw.question || raw.text || norm.question || "",
      options: optionValues.filter(Boolean),
      correctAnswer:
        raw.correctIndex !== undefined
          ? raw.correctIndex
          : raw.correctAnswer !== undefined
            ? raw.correctAnswer
            : norm.correctanswer !== undefined
              ? norm.correctanswer
              : norm.correct !== undefined
                ? norm.correct
                : norm.correctindex !== undefined
                  ? norm.correctindex
                  : norm.answer !== undefined
                    ? norm.answer
                    : "",
      marks: raw.marks !== undefined ? raw.marks : norm.marks !== undefined ? norm.marks : "",
      negativeMarks:
        raw.negativeMarks !== undefined
          ? raw.negativeMarks
          : norm.negativemarks !== undefined
            ? norm.negativemarks
            : "",
      explanation: raw.explanation || norm.explanation || "",
      image: raw.image || norm.image || "",
      topic: raw.topic || raw.Topic || norm.topic || raw["टॉपिक"] || raw["विषयक"] || raw["उप-विषय"] || "",
    };
  }

  /* ---------- students ---------- */
  /* ---------- सूचना और समूह चैट ---------- */
  async function renderNotify(content) {
    await ensureOverview();
    let editingId = "";

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>सूचना और समूह चैट</h1><p>सूचना भेजते ही सभी छात्रों के पोर्टल में दिखती है। समूह चैट में हर पंजीकृत छात्र अपने आप शामिल रहता है — यहाँ उसी चैट की निगरानी होती है।</p></div>' +
      '<div class="row"><button class="btn btn-sm btn-ghost" type="button" data-notify-refresh>ताज़ा करें</button></div></div>' +
      '<div class="notify-grid">' +
      '<div class="editor-card"><h3>नई सूचना</h3><form id="noticeForm" class="stack" autocomplete="off">' +
      '<label class="field"><span>शीर्षक *</span><input class="input" id="ntTitle" maxlength="120" required placeholder="जैसे CBT3 परीक्षा बुधवार सुबह 10 बजे"></label>' +
      '<label class="field"><span>संदेश *</span><textarea class="textarea" id="ntBody" rows="4" maxlength="4000" required placeholder="पूरा विवरण यहाँ लिखें…"></textarea></label>' +
      '<div class="form-grid">' +
      '<label class="field"><span>महत्व</span><select class="select" id="ntLevel">' +
      optionList(
        [
          { value: "info", label: "सामान्य" },
          { value: "warn", label: "ध्यान दें" },
          { value: "important", label: "अति आवश्यक" },
        ],
        "info"
      ) +
      "</select></label>" +
      '<label class="field"><span>किसे दिखे</span><select class="select" id="ntAudience"></select></label>' +
      "</div>" +
      '<label class="check"><input type="checkbox" id="ntActive" checked><span>तुरंत दिखाएँ (बंद करने पर सूचना छिपी रहेगी)</span></label>' +
      '<div class="row"><button class="btn" type="submit" id="ntSaveBtn">सभी को भेजें</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" id="ntResetBtn" hidden>नई सूचना</button></div>' +
      "</form>" +
      '<h3 style="margin-top:18px">भेजी गई सूचनाएँ</h3><div id="noticeRows"></div></div>' +
      '<div class="editor-card"><h3>समूह चैट <span class="badge-count" id="chatCount">0</span></h3>' +
      '<p class="tiny muted">सभी पंजीकृत छात्र इसी चैट में हैं। संदेश हटाने से वह सबकी स्क्रीन से हट जाएगा।</p>' +
      '<div class="chat-log" id="chatLog"><p class="muted small">चैट लोड हो रही है…</p></div>' +
      '<form id="chatForm" class="chat-compose"><input class="input" id="chatText" maxlength="500" placeholder="सभी छात्रों को संदेश लिखें…" aria-label="चैट संदेश">' +
      '<button class="btn btn-sm" type="submit">भेजें</button></form>' +
      '<h3 style="margin-top:16px">छात्र <span class="badge-count" id="memberCount">0</span></h3><div class="member-strip" id="memberStrip"></div>' +
      "</div></div>";

    const audienceSelect = $("#ntAudience", content);

    function paintAudience(students) {
      const batches = [...new Set(students.map((student) => String(student.batch || "").trim()).filter(Boolean))].sort();
      const options = [{ value: "all", label: "सभी छात्र" }].concat(
        batches.map((batch) => ({ value: "batch:" + batch, label: "बैच " + batch + " فقط" }))
      );
      audienceSelect.innerHTML = optionList(options, audienceSelect.value || "all");
    }

    function noticeLevelChip(level) {
      const tone = level === "important" ? "bad" : level === "warn" ? "warn" : "info";
      const label = level === "important" ? "अति आवश्यक" : level === "warn" ? "ध्यान दें" : "सामान्य";
      return '<span class="pill ' + tone + '">' + esc(label) + "</span>";
    }

    async function loadNotices() {
      const data = await api("admin_notices");
      const rows = data.notices || [];
      noticeCache = rows;
      const wrap = $("#noticeRows", content);
      if (!rows.length) {
        wrap.innerHTML = emptyBox("अभी कोई सूचना भेजी नहीं गई", true);
        return;
      }
      wrap.innerHTML =
        '<div class="table-wrap"><table class="data"><thead><tr><th>सूचना</th><th>महत्व</th><th>किसे</th><th>भेजी</th><th></th></tr></thead><tbody>' +
        rows
          .map(
            (notice) =>
              '<tr><td><span class="t-main">' +
              esc(notice.title) +
              '</span><div class="t-sub">' +
              esc(truncate(notice.body || "", 90)) +
              "</div></td><td>" +
              noticeLevelChip(notice.level) +
              (notice.active === false ? ' <span class="pill">छिपी</span>' : "") +
              "</td><td>" +
              esc(notice.audience === "all" ? "सभी" : notice.audience) +
              "</td><td>" +
              esc(UI.fmtDate(notice.createdAt)) +
              '</td><td class="actions"><div class="row-actions"><button class="btn btn-sm btn-ghost" type="button" data-nt-edit="' +
              attr(notice.id) +
              '">एडिट</button><button class="btn btn-sm btn-ghost" type="button" data-nt-del="' +
              attr(notice.id) +
              '">हटाएँ</button></div></td></tr>'
          )
          .join("") +
        "</tbody></table></div>";
    }

    let noticeCache = [];

    async function loadChat() {
      const data = await api("admin_chat");
      const log = $("#chatLog", content);
      const messages = data.messages || [];
      $("#chatCount", content).textContent = String(messages.length);
      $("#memberCount", content).textContent = String((data.members || []).length);
      paintAudience(data.members || []);
      $("#memberStrip", content).innerHTML = (data.members || [])
        .slice(0, 80)
        .map(
          (member) =>
            '<span class="member-chip' +
            (member.active === false ? " off" : "") +
            '"><b>' +
            esc(member.name || member.id) +
            "</b><small>" +
            esc(member.id) +
            (member.batch ? " · " + esc(member.batch) : "") +
            "</small></span>"
        )
        .join("");
      if (!messages.length) {
        log.innerHTML = emptyBox("अभी कोई संदेश नहीं — छात्र पोर्टल से चैट करेंगे", true);
        return;
      }
      log.innerHTML = messages
        .map(
          (message) =>
            '<div class="chat-msg' +
            (message.sid === "ADMIN" ? " from-admin" : "") +
            '"><div class="chat-meta"><b>' +
            esc(message.name || message.sid) +
            "</b><small>" +
            esc(UI.fmtDate(message.createdAt)) +
            '</small><button class="btn btn-sm btn-ghost chat-del" type="button" data-chat-del="' +
            attr(message.id) +
            '" aria-label="संदेश हटाएँ">×</button></div><p>' +
            esc(message.text) +
            "</p></div>"
        )
        .join("");
      log.scrollTop = log.scrollHeight;
    }

    function fillComposer(notice) {
      editingId = notice.id;
      $("#ntTitle", content).value = notice.title || "";
      $("#ntBody", content).value = String(notice.body || "");
      $("#ntLevel", content).value = notice.level || "info";
      audienceSelect.value = notice.audience || "all";
      $("#ntActive", content).checked = notice.active !== false;
      $("#ntSaveBtn", content).textContent = "सूचना अपडेट करें";
      $("#ntResetBtn", content).hidden = false;
    }

    function resetComposer() {
      editingId = "";
      $("#noticeForm", content).reset();
      $("#ntActive", content).checked = true;
      audienceSelect.value = "all";
      $("#ntSaveBtn", content).textContent = "सभी को भेजें";
      $("#ntResetBtn", content).hidden = true;
    }

    $("#noticeForm", content).addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("#ntSaveBtn", content);
      UI.setButtonBusy(button, true, "भेजी जा रही है…");
      try {
        const notice = {
          title: $("#ntTitle", content).value.trim(),
          body: $("#ntBody", content).value.trim(),
          level: $("#ntLevel", content).value,
          audience: audienceSelect.value,
          active: $("#ntActive", content).checked,
        };
        if (editingId) notice.id = editingId;
        await api("admin_notice_save", { notice });
        UI.toast(editingId ? "सूचना अपडेट हुई — सभी के पास पहुँच गई" : "सूचना भेज दी गई — सभी छात्रों को तुरंत दिखेगी", "good");
        resetComposer();
        await loadNotices();
      } catch (error) {
        UI.toast(error.message || "सूचना नहीं भेजी जा सकी", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    });
    $("#ntResetBtn", content).addEventListener("click", resetComposer);

    $("#noticeRows", content).addEventListener("click", async (event) => {
      const edit = event.target.closest("[data-nt-edit]");
      if (edit) {
        const notice = noticeCache.find((row) => row.id === edit.dataset.ntEdit);
        if (notice) {
          fillComposer(notice);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      const remove = event.target.closest("[data-nt-del]");
      if (!remove) return;
      const ok = await UI.confirm({
        title: "सूचना हटाएँ?",
        message: "यह सूचना सभी छात्रों की स्क्रीन से हट जाएगी।",
        confirmText: "हटाएँ",
        tone: "btn-bad",
      });
      if (!ok) return;
      try {
        await api("admin_notice_delete", { noticeId: remove.dataset.ntDel });
        UI.toast("सूचना हटा दी गई", "good");
        if (editingId === remove.dataset.ntDel) resetComposer();
        await loadNotices();
      } catch (error) {
        UI.toast(error.message || "सूचना हटाई नहीं जा सकी", "bad");
      }
    });

    $("#chatForm", content).addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = $("#chatText", content);
      const text = input.value.trim();
      if (!text) {
        UI.toast("संदेश लिखें", "bad");
        return;
      }
      const button = event.target.querySelector("button");
      UI.setButtonBusy(button, true, "भेजा जा रहा है…");
      try {
        await api("admin_chat_send", { text });
        input.value = "";
        await loadChat();
      } catch (error) {
        UI.toast(error.message || "संदेश नहीं भेजा जा सका", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    });

    $("#chatLog", content).addEventListener("click", async (event) => {
      const button = event.target.closest("[data-chat-del]");
      if (!button) return;
      const ok = await UI.confirm({
        title: "संदेश हटाएँ?",
        message: "यह संदेश सभी छात्रों की चैट से हट जाएगा।",
        confirmText: "संदेश हटाएँ",
        tone: "btn-bad",
      });
      if (!ok) return;
      try {
        await api("admin_chat_delete", { messageId: button.dataset.chatDel });
        UI.toast("संदेश हटा दिया गया", "good");
        await loadChat();
      } catch (error) {
        UI.toast(error.message || "संदेश हटाया नहीं जा सका", "bad");
      }
    });

    $$("[data-notify-refresh]", content).forEach((button) =>
      button.addEventListener("click", () => renderRoute("notify", true))
    );

    await Promise.all([loadNotices(), loadChat()]);
    liveTimer = setInterval(loadChat, 25_000);
  }

  async function renderStudents(content) {
    await ensureOverview();
    const filter = state.studentFilter;
    const tradeOptions = trades().map((trade) => ({ value: trade.id, label: trade.name }));

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>विद्यार्थी</h1><p>पंजीकरण, प्रोफ़ाइल, सक्रियता और परीक्षा प्रयास एक जगह प्रबंधित करें।</p></div><div class="row"><button class="btn btn-ghost btn-sm" type="button" data-new-student>नया विद्यार्थी</button><button class="btn btn-sm" type="button" data-student-import-go>पुराना डेटा</button></div></div>' +
      '<div class="toolbar"><input class="input grow-input" id="studentSearch" placeholder="नाम, Registration ID, मोबाइल या ईमेल खोजें…" value="' +
      attr(filter.q) +
      '"><select class="select compact" id="studentTradeFilter">' +
      optionList([{ value: "", label: "सभी ट्रेड" }].concat(tradeOptions), filter.tradeId) +
      '</select><select class="select compact" id="studentActiveFilter">' +
      optionList(
        [
          { value: "", label: "सभी विद्यार्थी" },
          { value: "true", label: "सक्रिय" },
          { value: "false", label: "निष्क्रिय" },
        ],
        filter.active
      ) +
      '</select><span class="table-note" id="studentTotal"></span></div>' +
      '<div id="studentRows"></div>';

    const wrap = $("#studentRows", content);
    let current = null;

    function paint(data) {
      current = data;
      $("#studentTotal", content).textContent = "कुल " + data.total + " विद्यार्थी";
      if (!data.items.length) {
        wrap.innerHTML = emptyBox("इस फ़िल्टर पर कोई विद्यार्थी नहीं मिला");
        return;
      }
      wrap.innerHTML =
        '<div class="table-wrap"><table class="data"><thead><tr><th>विद्यार्थी</th><th>ट्रेड / बैच</th><th>संपर्क</th><th>परिणाम</th><th>स्थिति</th><th>पंजीकरण</th><th></th></tr></thead><tbody>' +
        data.items
          .map(
            (student) =>
              '<tr><td><div class="row">' +
              UI.avatar("", student.name) +
              '<div><span class="t-main">' +
              esc(student.name) +
              '</span><div class="t-sub">' +
              esc(student.id) +
              (student.fatherName ? " · पिता: " + esc(student.fatherName) : "") +
              "</div></div></div></td><td>" +
              esc(student.tradeName || "—") +
              (student.batch ? '<div class="t-sub">' + esc(student.batch) + "</div>" : "") +
              '</td><td><span class="t-main">' +
              esc(student.mobile) +
              "</span>" +
              (student.email ? '<div class="t-sub">' + esc(student.email) + "</div>" : "") +
              '</td><td><span class="badge-count">' +
              esc(student.resultCount || 0) +
              "</span>" +
              (student.hasPin ? ' <span class="pill">PIN</span>' : "") +
              "</td><td>" +
              (student.active === false ? '<span class="pill">निष्क्रिय</span>' : '<span class="pill good">सक्रिय</span>') +
              "</td><td>" +
              esc(UI.fmtDate(student.createdAt)) +
              '</td><td class="actions"><div class="row-actions"><button class="btn btn-sm btn-ghost" type="button" data-student-view="' +
              attr(student.id) +
              '">विवरण</button><button class="btn btn-sm btn-ghost" type="button" data-student-edit="' +
              attr(student.id) +
              '">एडिट</button><button class="btn btn-sm btn-bad" type="button" data-student-del="' +
              attr(student.id) +
              '">हटाएँ</button></div></td></tr>'
          )
          .join("") +
        "</tbody></table></div>" +
        pager(data);
      $$("[data-page]", wrap).forEach((button) =>
        button.addEventListener("click", () => {
          filter.page = Number(button.dataset.page);
          load();
        })
      );
    }

    async function load() {
      wrap.innerHTML = '<div class="table-note">लोड हो रहा है…</div>';
      try {
        const data = await api("admin_students", {
          q: filter.q,
          tradeId: filter.tradeId || undefined,
          active: filter.active === "" ? undefined : filter.active === "true",
          page: filter.page,
        });
        paint(data);
      } catch (error) {
        wrap.innerHTML = emptyBox(error.message || "विद्यार्थी लोड नहीं हो सके");
      }
    }

    $("#studentSearch", content).addEventListener("input", UI.debounce((event) => {
      filter.q = event.target.value;
      filter.page = 1;
      load();
    }, 220));
    $("#studentTradeFilter", content).addEventListener("change", (event) => {
      filter.tradeId = event.target.value;
      filter.page = 1;
      load();
    });
    $("#studentActiveFilter", content).addEventListener("change", (event) => {
      filter.active = event.target.value;
      filter.page = 1;
      load();
    });
    $("[data-new-student]", content).addEventListener("click", () => openStudentEditor());
    $("[data-student-import-go]", content).addEventListener("click", () => goRoute("tools"));

    wrap.addEventListener("click", async (event) => {
      const view = event.target.closest("[data-student-view]");
      if (view) {
        openStudentDetail(view.dataset.studentView);
        return;
      }
      const edit = event.target.closest("[data-student-edit]");
      if (edit) {
        openStudentEditor(edit.dataset.studentEdit);
        return;
      }
      const remove = event.target.closest("[data-student-del]");
      if (remove) {
        const student = current && (current.items || []).find((item) => item.id === remove.dataset.studentDel);
        if (!student) return;
        try {
          if (await deleteStudent(student)) {
            state.overview = null;
            filter.page = 1;
            await load();
          }
        } catch (error) {
          UI.toast(error.message || "विद्यार्थी हटाया नहीं जा सका", "bad");
        }
      }
    });

    await load();
  }

  async function openStudentEditor(studentId) {
    await ensureOverview();
    let existing = null;
    if (studentId) {
      const data = await api("admin_student_get", { studentId });
      existing = data.student;
    }
    const student = existing || {
      id: "",
      name: "",
      fatherName: "",
      mobile: "",
      citsNumber: "",
      email: "",
      tradeId: (trades()[0] && trades()[0].id) || "",
      batch: "",
      active: true,
      hasPin: false,
      photo: "",
    };
    let photoValue = student.photo || "";

    const body =
      '<div id="studentForm" autocomplete="off"><div class="photo-pick"><img class="preview' +
      (photoValue ? " has-image" : "") +
      '" id="studentPhotoPreview"' +
      (photoValue ? ' src="' + attr(photoValue) + '"' : "") +
      ' alt=""><div class="grow"><label class="btn btn-soft btn-sm" for="studentPhotoInput">फोटो चुनें</label><input id="studentPhotoInput" type="file" accept="image/jpeg,image/png,image/webp"><small class="hint">JPG / PNG / WebP · अधिकतम ' +
      esc((state.settings && state.settings.maxPhotoKb) || 200) +
      ' KB के लिए स्वतः छोटी होगी</small><div><button class="btn btn-ghost btn-sm" type="button" id="studentPhotoClear">फोटो हटाएँ</button></div></div></div>' +
      '<div class="form-grid">' +
      '<label class="field"><span>Registration ID ' +
      (existing ? "" : "(वैकल्पिक)") +
      "</span><input class=\"input\" id=\"studentRegId\" maxlength=\"40\" value=\"" +
      attr(existing ? existing.id : "") +
      '"' +
      (existing ? " readonly" : ' placeholder="खाली छोड़ने पर स्वतः बनेगा"') +
      "></label>" +
      '<label class="field"><span>पूरा नाम *</span><input class="input" id="studentName" maxlength="60" value="' +
      attr(student.name) +
      '"></label>' +
      '<label class="field"><span>पिता का नाम</span><input class="input" id="studentFather" maxlength="60" value="' +
      attr(student.fatherName || "") +
      '"></label>' +
      '<label class="field"><span>CITS नंबर</span><input class="input" id="studentCits" maxlength="30" value="' +
      attr(student.citsNumber || "") +
      '" placeholder="CITS या मोबाइल में से एक आवश्यक"></label>' +
      '<label class="field"><span>मोबाइल नंबर</span><input class="input" id="studentMobile" inputmode="numeric" maxlength="10" value="' +
      attr(student.mobile || "") +
      '"></label>' +
      '<label class="field"><span>ईमेल</span><input class="input" id="studentEmail" type="email" maxlength="100" value="' +
      attr(student.email || "") +
      '"></label>' +
      '<label class="field"><span>ट्रेड</span><select class="select" id="studentTrade">' +
      optionList(trades().map((trade) => ({ value: trade.id, label: trade.name })), student.tradeId) +
      "</select></label>" +
      '<label class="field"><span>बैच</span><input class="input" id="studentBatch" maxlength="40" value="' +
      attr(student.batch || "") +
      '" placeholder="जैसे: 2026-27"></label>' +
      '<label class="field"><span>पुराना PIN (वैकल्पिक)</span><input class="input" id="studentPin" inputmode="numeric" maxlength="8" placeholder="4–8 अंक"><small>सिर्फ़ पुराने लॉगिन के लिए; पहली बार लॉगिन के बाद छात्र नया पासवर्ड बनाएगा।' +
      (student.hasPin ? " + PIN" : "") +
      "</small></label>" +
      "</div>" +
      '<div class="stack" style="margin-top:8px">' +
      '<label class="check"><input type="checkbox" id="studentActive"' +
      (student.active === false ? "" : " checked") +
      '><span>सक्रिय — लॉगिन और परीक्षा की अनुमति</span></label>' +
      (student.hasPin
        ? '<label class="check"><input type="checkbox" id="studentClearPin"><span>मौजूदा PIN हटाएँ</span></label>'
        : "") +
      "</div></div>" +
      '<div class="notice info small" style="margin-top:12px">लॉगिन ID CITS नंबर होगा; न होने पर मोबाइल नंबर।</div>';

    const modal = UI.modal({
      title: existing ? "विद्यार्थी एडिट करें" : "नया विद्यार्थी",
      subtitle: existing ? existing.name + " · " + existing.id : "Registration ID खाली छोड़ने पर स्वतः बनेगा",
      size: "lg",
      body: body,
      actions: [
        { label: "रद्द करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "सेव करें",
          tone: "btn-navy",
          id: "studentSaveBtn",
          onClick: async (handle) => {
            const name = $("#studentName", modal.body).value.trim();
            const mobile = $("#studentMobile", modal.body).value.trim();
            const citsNumber = $("#studentCits", modal.body).value.trim();
            const tradeId = $("#studentTrade", modal.body).value;
            if (name.length < 2) {
              UI.toast("छात्र का सही नाम दर्ज करें", "bad");
              return;
            }
            if (mobile && !/^[6-9]\d{9}$/.test(mobile.replace(/[\s-]/g, ""))) {
              UI.toast("10 अंकों का सही मोबाइल नंबर दें", "bad");
              return;
            }
            if (!mobile && !citsNumber) {
              UI.toast("CITS नंबर या मोबाइल नंबर में से एक आवश्यक है", "bad");
              return;
            }
            if (citsNumber && !/^[A-Za-z0-9/-]{2,30}$/.test(citsNumber)) {
              UI.toast("सही CITS नंबर दर्ज करें", "bad");
              return;
            }
            if (!tradeId) {
              UI.toast("ट्रेड चुनें", "bad");
              return;
            }
            const payload = {
              name: name,
              fatherName: $("#studentFather", modal.body).value.trim(),
              citsNumber: $("#studentCits", modal.body).value.trim(),
              mobile: mobile,
              email: $("#studentEmail", modal.body).value.trim(),
              tradeId: tradeId,
              batch: $("#studentBatch", modal.body).value.trim(),
              photo: photoValue,
              active: $("#studentActive", modal.body).checked,
            };
            if (!existing) {
              const customId = $("#studentRegId", modal.body).value.trim();
              if (customId) payload.id = customId;
            }
            const pin = $("#studentPin", modal.body).value.trim();
            if (pin) payload.pin = pin;
            const clearPin = $("#studentClearPin", modal.body);
            if (clearPin && clearPin.checked) payload.clearPin = true;
            const button = $("#studentSaveBtn", handle.foot);
            UI.setButtonBusy(button, true, "सेव हो रहा है…");
            try {
              await api("admin_student_save", { student: payload });
              handle.close();
              UI.toast(existing ? "विद्यार्थी अपडेट हो गया" : "विद्यार्थी जोड़ दिया गया", "good");
              state.overview = null;
              if (state.route === "students" || state.route === "dashboard") {
                await renderRoute(state.route, true);
              }
            } catch (error) {
              UI.toast(error.message || "विद्यार्थी सेव नहीं हो सका", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        },
      ],
    });

    $("#studentPhotoInput", modal.body).addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const maxKb = (state.settings && state.settings.maxPhotoKb) || 200;
        const dataUrl = await UI.compressPhoto(file, { maxKb: maxKb, maxDim: 640 });
        photoValue = dataUrl;
        const preview = $("#studentPhotoPreview", modal.body);
        preview.src = dataUrl;
        preview.classList.add("has-image");
      } catch (error) {
        UI.toast(error.message || "फोटो नहीं पढ़ी जा सकी", "bad");
        event.target.value = "";
      }
    });
    $("#studentPhotoClear", modal.body).addEventListener("click", () => {
      photoValue = "";
      const preview = $("#studentPhotoPreview", modal.body);
      preview.removeAttribute("src");
      preview.classList.remove("has-image");
      $("#studentPhotoInput", modal.body).value = "";
    });
  }

  async function openStudentDetail(studentId) {
    const data = await api("admin_student_get", { studentId });
    const student = data.student;
    const stats = student.stats || {};
    const body =
      '<div class="profile-modal-head">' +
      UI.avatar(student.photo || "", student.name, "avatar-lg") +
      "<div><h2>" +
      esc(student.name) +
      "</h2><p>" +
      esc(student.id) +
      " · " +
      esc(student.tradeName || "ट्रेड नहीं") +
      (student.batch ? " · " + esc(student.batch) : "") +
      "</p><div class=\"row\" style=\"margin-top:6px\">" +
      (student.active === false ? '<span class="pill">निष्क्रिय</span>' : '<span class="pill good">सक्रिय</span>') +
      (student.hasPin ? ' <span class="pill">PIN सेट</span>' : "") +
      "</div></div></div>" +
      '<div class="grid-2" style="margin-top:14px"><dl class="detail-list">' +
      detailRow("पिता का नाम", student.fatherName || "—") +
      detailRow("मोबाइल", student.mobile) +
      detailRow("ईमेल", student.email || "—") +
      detailRow("बैच", student.batch || "—") +
      detailRow("पंजीकरण", UI.fmtDateTime(student.createdAt)) +
      "</dl><div class=\"stat-grid\" style=\"grid-template-columns:1fr 1fr;margin-bottom:0\">" +
      statCard("परिणाम", stats.count || 0, "सभी प्रकार") +
      statCard("औसत", UI.trimNumber(stats.average || 0) + "%", "") +
      statCard("पास दर", UI.trimNumber(stats.passRate || 0) + "%", "") +
      statCard("सक्रिय प्रयास", data.attempts.length, "अभी चालू") +
      "</div></div>" +
      '<div class="editor-section"><div class="admin-section-head"><div><h4 style="margin:0">परिणाम</h4></div></div>' +
      (data.results.length
        ? '<div class="table-wrap"><table class="data"><thead><tr><th>परीक्षा</th><th>प्रकार</th><th>अंक</th><th>प्रतिशत</th><th>दिनांक</th><th></th></tr></thead><tbody>' +
          data.results
            .map(
              (result) =>
                "<tr><td><span class=\"t-main\">" +
                esc(result.examTitle) +
                '</span><div class="t-sub">' +
                esc(result.examCode) +
                "</div></td><td>" +
                esc(UI.examTypeLabel(result.examType)) +
                "</td><td>" +
                esc(UI.trimNumber(result.obtained)) +
                " / " +
                esc(UI.trimNumber(result.maxMarks)) +
                "</td><td>" +
                resultBadge(result) +
                "</td><td>" +
                esc(UI.fmtDateTime(result.submittedAt)) +
                '</td><td class="actions"><button class="btn btn-sm btn-ghost" type="button" data-student-result="' +
                attr(result.resultId) +
                '">देखें</button></td></tr>'
            )
            .join("") +
          "</tbody></table></div>"
        : emptyBox("अभी कोई परिणाम नहीं", true)) +
      "</div>" +
      '<div class="editor-section"><div class="admin-section-head"><div><h4 style="margin:0">सक्रिय प्रयास</h4></div></div>' +
      (data.attempts.length
        ? '<div class="attempt-list">' +
          data.attempts
            .map(
              (attempt) =>
                '<div class="attempt-row"><div class="a-main"><b>' +
                esc(attempt.examTitle) +
                "</b><small>शुरू " +
                esc(UI.fmtDateTime(attempt.startedAt)) +
                " · " +
                esc(attempt.attempted) +
                ' उत्तर</small></div><button class="btn btn-sm btn-warn" type="button" data-student-finalize="' +
                attr(attempt.examId) +
                '">अभी समाप्त करें</button></div>'
            )
            .join("") +
          "</div>"
        : emptyBox("कोई सक्रिय प्रयास नहीं", true)) +
      "</div>" +
      '<div class="editor-section"><div class="danger-zone"><h4>विद्यार्थी हटाना</h4><p>यदि परिणाम या प्रयास मौजूद हैं तो हटाने से पहले अलग स्पष्ट पुष्टि ली जाएगी। सामान्यतः निष्क्रिय करना सुरक्षित है।</p><button class="btn btn-sm btn-bad" type="button" id="studentDeleteBtn">विद्यार्थी हटाएँ</button></div></div>';

    const modal = UI.modal({
      title: "विद्यार्थी विवरण",
      subtitle: student.tradeName || "",
      size: "lg",
      body: body,
      actions: [
        { label: "बंद करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "स्थिति बदलें",
          tone: "btn-warn",
          id: "studentToggleBtn",
          onClick: async (handle) => {
            const button = $("#studentToggleBtn", handle.foot);
            UI.setButtonBusy(button, true, "अपडेट…");
            try {
              await api("admin_student_status", { studentId: student.id, active: student.active === false });
              handle.close();
              UI.toast(student.active === false ? "विद्यार्थी सक्रिय कर दिया" : "विद्यार्थी निष्क्रिय कर दिया", "good");
              state.overview = null;
              if (state.route === "students") await renderRoute("students", true);
            } catch (error) {
              UI.toast(error.message || "स्थिति बदली नहीं जा सकी", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        },
        {
          label: "एडिट करें",
          tone: "btn-navy",
          id: "studentEditBtn",
          onClick: (handle) => {
            handle.close();
            openStudentEditor(student.id);
          },
        },
      ],
    });

    const root = modal.body;
    $("#studentDeleteBtn", root).addEventListener("click", async () => {
      try {
        if (await deleteStudent(student)) {
          modal.close();
          state.overview = null;
          if (state.route === "students") await renderRoute("students", true);
        }
      } catch (error) {
        UI.toast(error.message || "विद्यार्थी हटाया नहीं जा सका", "bad");
      }
    });
    $$("[data-student-result]", root).forEach((button) =>
      button.addEventListener("click", () => openResultDetail(button.dataset.studentResult))
    );
    $$("[data-student-finalize]", root).forEach((button) =>
      button.addEventListener("click", async () => {
        const ok = await UI.confirm({
          title: "प्रयास अभी समाप्त करें?",
          message: "विद्यार्थी का चालू प्रयास बंद होकर परिणाम बन जाएगा।",
          confirmText: "समाप्त करें",
          tone: "btn-warn",
        });
        if (!ok) return;
        try {
          await api("admin_attempt_finalize", { examId: button.dataset.studentFinalize, studentId: student.id });
          UI.toast("प्रयास समाप्त और परिणाम बन गया", "good");
          modal.close();
          openStudentDetail(student.id);
        } catch (error) {
          UI.toast(error.message || "प्रयास समाप्त नहीं हो सका", "bad");
        }
      })
    );
  }

  async function deleteStudent(student) {
    const hasResults = Number(student.resultCount || 0) > 0;
    if (hasResults) {
      const typed = await UI.confirm({
        title: "विद्यार्थी और परिणाम हटाएँ?",
        message:
          "इस विद्यार्थी के " +
          student.resultCount +
          " परिणाम और सभी प्रयास स्थायी रूप से हट जाएँगे। यह कार्रवाई वापस नहीं हो सकती। सुरक्षित विकल्प: विद्यार्थी को निष्क्रिय करें।",
        detail: "पुष्टि के लिए Registration ID टाइप करें: " + student.id,
        requireText: student.id,
        confirmText: "आगे बढ़ें",
        tone: "btn-bad",
      });
      if (!typed) return false;
      const second = await UI.confirm({
        title: "परिणाम सहित हटाना पक्का?",
        message: "परिणाम, उत्तर और प्रयास भी मिट जाएँगे। केवल तभी आगे बढ़ें जब आपने बैकअप लिया हो।",
        requireText: "DELETE",
        confirmText: "परिणाम सहित हटाएँ",
        tone: "btn-bad",
      });
      if (!second) return false;
      await api("admin_student_delete", {
        studentId: student.id,
        confirm: student.id,
        deleteResults: true,
      });
    } else {
      const typed = await UI.confirm({
        title: "विद्यार्थी हटाएँ?",
        message: "यह विद्यार्थी स्थायी रूप से हट जाएगा। यदि उसका कोई परिणाम/प्रयास है तो सर्वर हटाने से रोक देगा।",
        detail: "पुष्टि के लिए Registration ID टाइप करें: " + student.id,
        requireText: student.id,
        confirmText: "हटाएँ",
        tone: "btn-bad",
      });
      if (!typed) return false;
      await api("admin_student_delete", { studentId: student.id, confirm: student.id });
    }
    UI.toast("विद्यार्थी हटा दिया गया", "good");
    return true;
  }

  /* ---------- results ---------- */
  async function renderResults(content) {
    await ensureOverview();
    const exams = await loadExams();
    const filter = state.resultFilter;
    const subjectOptions = [{ value: "mixed", label: "Mixed" }].concat(
      subjects().map((subject) => ({ value: subject.id, label: subject.name }))
    );

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>परिणाम</h1><p>परीक्षा, विषय और ट्रेड के अनुसार परिणाम देखें, खोजें और CSV निकालें।</p></div><button class="btn btn-sm" type="button" id="resultsCsvBtn">CSV डाउनलोड</button></div>' +
      '<div class="toolbar"><input class="input grow-input" id="resultSearch" placeholder="नाम, Registration ID, परीक्षा या Result ID…" value="' +
      attr(filter.q) +
      '"><select class="select compact" id="resultExam">' +
      optionList(
        [{ value: "", label: "सभी परीक्षाएँ" }].concat(
          exams.map((exam) => ({ value: exam.id, label: exam.title + " (" + exam.code + ")" }))
        ),
        filter.examId
      ) +
      '</select><select class="select compact" id="resultSubject">' +
      optionList([{ value: "", label: "सभी विषय" }].concat(subjectOptions), filter.subjectId) +
      '</select><select class="select compact" id="resultTrade">' +
      optionList(
        [{ value: "", label: "सभी ट्रेड" }].concat(trades().map((trade) => ({ value: trade.id, label: trade.name }))),
        filter.tradeId
      ) +
      '</select><select class="select compact" id="resultType">' +
      optionList(
        [
          { value: "", label: "सभी प्रकार" },
          { value: "final", label: "फाइनल" },
          { value: "practice", label: "अभ्यास" },
        ],
        filter.type
      ) +
      "</select></div>" +
      '<div id="resultStats" class="stat-grid"></div>' +
      '<div id="resultMerit"></div>' +
      '<div id="resultRows"></div>';

    const wrap = $("#resultRows", content);
    const statsWrap = $("#resultStats", content);
    const meritWrap = $("#resultMerit", content);

    function payload() {
      return {
        examId: filter.examId || undefined,
        subjectId: filter.subjectId || undefined,
        tradeId: filter.tradeId || undefined,
        type: filter.type || undefined,
        q: filter.q || undefined,
        page: filter.page,
      };
    }

    function paintStats(stats) {
      statsWrap.innerHTML =
        statCard("परिणाम", stats.count || 0, "फ़िल्टर किए गए फाइनल", "brand") +
        statCard("औसत", UI.trimNumber(stats.average || 0) + "%", "") +
        statCard("पास दर", UI.trimNumber(stats.passRate || 0) + "%", (stats.pass || 0) + " पास · " + (stats.fail || 0) + " फेल") +
        statCard("उच्चतम", UI.trimNumber(stats.highest || 0) + "%", "न्यूनतम " + UI.trimNumber(stats.lowest || 0) + "%");
    }

    function paintMerit(merit) {
      if (!merit || !merit.length) {
        meritWrap.innerHTML = "";
        return;
      }
      meritWrap.innerHTML =
        '<section class="admin-card" style="margin-bottom:18px"><div class="admin-section-head"><div><h3>मेरिट सूची (शीर्ष ' +
        merit.length +
        ')</h3><p class="admin-card-sub">चयनित फ़िल्टर में सर्वाधिक प्रतिशत — रैंक के अनुसार</p></div></div>' +
        '<div class="table-wrap"><table class="data"><thead><tr><th>रैंक</th><th>विद्यार्थी</th><th>परीक्षा</th><th>ट्रेड</th><th>अंक</th><th>प्रतिशत</th></tr></thead><tbody>' +
        merit
          .map(
            (row) =>
              '<tr><td><span class="pill ' +
              (row.rank <= 3 ? "good" : "dark") +
              '">' +
              esc(row.rank) +
              '</span></td><td><span class="t-main">' +
              esc(row.studentName) +
              '</span><div class="t-sub">' +
              esc(row.regId) +
              '</div></td><td><span class="t-main">' +
              esc(truncate(row.examTitle, 38)) +
              '</span><div class="t-sub">' +
              esc(row.examCode || "") +
              "</div></td><td>" +
              esc(row.tradeName || "—") +
              "</td><td>" +
              esc(UI.trimNumber(row.obtained)) +
              " / " +
              esc(UI.trimNumber(row.maxMarks)) +
              "</td><td>" +
              resultBadge(row) +
              "</td></tr>"
          )
          .join("") +
        "</tbody></table></div></section>";
    }

    function paint(data) {
      paintStats(data.stats || {});
      paintMerit(data.merit || []);
      if (!data.items.length) {
        wrap.innerHTML = emptyBox("इस फ़िल्टर पर कोई परिणाम नहीं मिला");
        return;
      }
      wrap.innerHTML =
        '<div class="table-wrap"><table class="data"><thead><tr><th>विद्यार्थी</th><th>परीक्षा</th><th>विषय / ट्रेड</th><th>प्रकार</th><th>अंक</th><th>प्रतिशत</th><th>दिनांक</th><th></th></tr></thead><tbody>' +
        data.items
          .map(
            (result) =>
              '<tr><td><span class="t-main">' +
              esc(result.studentName) +
              '</span><div class="t-sub">' +
              esc(result.regId) +
              '</div></td><td><span class="t-main">' +
              esc(truncate(result.examTitle, 42)) +
              '</span><div class="t-sub">' +
              esc(result.examCode) +
              '</div></td><td>' +
              esc(result.subjectName || result.subjectId) +
              (result.tradeName ? '<div class="t-sub">' + esc(result.tradeName) + "</div>" : "") +
              '</td><td><span class="pill ' +
              (result.examType === "practice" ? "info" : "dark") +
              '">' +
              esc(UI.examTypeLabel(result.examType)) +
              "</span></td><td>" +
              esc(UI.trimNumber(result.obtained)) +
              " / " +
              esc(UI.trimNumber(result.maxMarks)) +
              "</td><td>" +
              resultBadge(result) +
              "</td><td>" +
              esc(UI.fmtDateTime(result.submittedAt)) +
              (result.autoSubmitted ? '<div class="t-sub">स्वतः सबमिट</div>' : "") +
              '</td><td class="actions"><button class="btn btn-sm btn-ghost" type="button" data-result-detail="' +
              attr(result.resultId) +
              '">विवरण</button></td></tr>'
          )
          .join("") +
        "</tbody></table></div>" +
        pager(data);
      $$("[data-page]", wrap).forEach((button) =>
        button.addEventListener("click", () => {
          filter.page = Number(button.dataset.page);
          load();
        })
      );
      $$("[data-result-detail]", wrap).forEach((button) =>
        button.addEventListener("click", () => openResultDetail(button.dataset.resultDetail))
      );
    }

    async function load() {
      wrap.innerHTML = '<div class="table-note">लोड हो रहा है…</div>';
      try {
        const data = await api("admin_results", payload());
        paint(data);
      } catch (error) {
        wrap.innerHTML = emptyBox(error.message || "परिणाम लोड नहीं हो सके");
      }
    }

    $("#resultSearch", content).addEventListener("input", UI.debounce((event) => {
      filter.q = event.target.value;
      filter.page = 1;
      load();
    }, 240));
    ["resultExam", "resultSubject", "resultTrade", "resultType"].forEach((id) => {
      $("#" + id, content).addEventListener("change", (event) => {
        const key = { resultExam: "examId", resultSubject: "subjectId", resultTrade: "tradeId", resultType: "type" }[id];
        filter[key] = event.target.value;
        filter.page = 1;
        load();
      });
    });
    $("#resultsCsvBtn", content).addEventListener("click", () => exportResultsCsv(payload()));

    await load();
  }

  async function exportResultsCsv(filter) {
    try {
      const filename = await UI.download("admin_results_csv", filter || {}, state.token);
      UI.toast("CSV डाउनलोड: " + filename, "good");
    } catch (error) {
      UI.toast(error.message || "CSV डाउनलोड नहीं हो सका", "bad");
    }
  }

  async function openResultDetail(resultId) {
    const data = await api("admin_result_get", { resultId });
    const result = data.result;
    const exam = data.exam || {};
    if (!result.subjectName) {
      result.subjectName = exam.subjectName || (result.subjectId === "mixed" ? "Mixed" : result.subjectId);
    }
    if (!result.tradeName && exam.tradeName) result.tradeName = exam.tradeName;
    const extraMeta = [result.subjectName, result.tradeName].filter(Boolean).join(" · ");
    const body =
      '<div class="result-wrap">' +
      window.ResultView.html(result, {
        studentName: (data.student && data.student.name) || result.studentName,
        extraMeta: extraMeta,
        answersNote:
          "उत्तर-कुंजी अभी जारी नहीं है। एडमिन के रूप में आप पूरा विवरण देख रहे हैं; विद्यार्थी को केवल परिणाम जारी होने पर दिखेगा।",
      }) +
      "</div>" +
      '<div class="row" style="margin-top:12px"><button class="btn btn-sm btn-ghost" type="button" id="resultCsvBtn">इस परीक्षा का CSV</button></div>';

    const modal = UI.modal({
      title: "परिणाम विवरण",
      subtitle: result.examTitle + " · " + result.regId,
      size: "lg",
      body: body,
      actions: [{ label: "बंद करें", ghost: true, onClick: (handle) => handle.close() }],
    });
    $("#resultCsvBtn", modal.body).addEventListener("click", () =>
      exportResultsCsv({ examId: result.examId, q: result.regId })
    );
  }

  /* ---------- catalog ---------- */
  async function renderCatalog(content) {
    await ensureOverview(true);
    const [subjectData, tradeData] = await Promise.all([api("admin_subjects"), api("admin_trades")]);
    const subjectList = subjectData.subjects || [];
    const tradeList = tradeData.trades || [];

    function subjectRows() {
      if (!subjectList.length) return emptyBox("कोई विषय नहीं — नया विषय जोड़ें", true);
      return (
        '<div class="table-wrap"><table class="data"><thead><tr><th>विषय</th><th>कोड</th><th>प्रश्न</th><th>परीक्षाएँ</th><th>स्थिति</th><th></th></tr></thead><tbody>' +
        subjectList
          .map(
            (subject) =>
              "<tr><td><span class=\"t-main\">" +
              esc(subject.name) +
              '</span><div class="t-sub">' +
              esc(subject.id) +
              "</div></td><td>" +
              esc(subject.code || "—") +
              "</td><td>" +
              esc(subject.questions || 0) +
              "</td><td>" +
              esc(subject.exams || 0) +
              "</td><td>" +
              (subject.active === false ? '<span class="pill">निष्क्रिय</span>' : '<span class="pill good">सक्रिय</span>') +
              '</td><td class="actions"><div class="row-actions"><button class="btn btn-sm btn-ghost" type="button" data-cat-edit="subject" data-cat-id="' +
              attr(subject.id) +
              '">एडिट</button><button class="btn btn-sm btn-ghost" type="button" data-cat-toggle="subject" data-cat-id="' +
              attr(subject.id) +
              '">' +
              (subject.active === false ? "सक्रिय" : "निष्क्रिय") +
              '</button><button class="btn btn-sm btn-ghost" type="button" data-cat-delete="subject" data-cat-id="' +
              attr(subject.id) +
              '">हटाएँ</button></div></td></tr>'
          )
          .join("") +
        "</tbody></table></div>"
      );
    }

    function tradeRows() {
      if (!tradeList.length) return emptyBox("कोई ट्रेड नहीं — नया ट्रेड जोड़ें", true);
      return (
        '<div class="table-wrap"><table class="data"><thead><tr><th>ट्रेड</th><th>कोड</th><th>परीक्षाएँ</th><th>विद्यार्थी</th><th>स्थिति</th><th></th></tr></thead><tbody>' +
        tradeList
          .map(
            (trade) =>
              "<tr><td><span class=\"t-main\">" +
              esc(trade.name) +
              '</span><div class="t-sub">' +
              esc(trade.id) +
              "</div></td><td>" +
              esc(trade.code || "—") +
              "</td><td>" +
              esc(trade.exams || 0) +
              "</td><td>" +
              esc(trade.students || 0) +
              "</td><td>" +
              (trade.active === false ? '<span class="pill">निष्क्रिय</span>' : '<span class="pill good">सक्रिय</span>') +
              '</td><td class="actions"><div class="row-actions"><button class="btn btn-sm btn-ghost" type="button" data-cat-edit="trade" data-cat-id="' +
              attr(trade.id) +
              '">एडिट</button><button class="btn btn-sm btn-ghost" type="button" data-cat-toggle="trade" data-cat-id="' +
              attr(trade.id) +
              '">' +
              (trade.active === false ? "सक्रिय" : "निष्क्रिय") +
              '</button><button class="btn btn-sm btn-ghost" type="button" data-cat-delete="trade" data-cat-id="' +
              attr(trade.id) +
              '">हटाएँ</button></div></td></tr>'
          )
          .join("") +
        "</tbody></table></div>"
      );
    }

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>विषय और ट्रेड</h1><p>विषय-वार परीक्षा और प्रश्न बैंक के लिए कैटलॉग प्रबंधित करें। प्रयोग में आने वाला विषय/ट्रेड हटाने के बजाय निष्क्रिय करें।</p></div></div>' +
      '<div class="grid-2">' +
      '<section class="admin-card"><div class="admin-section-head"><div><h3>विषय</h3><p class="admin-card-sub">ट्रेड थ्योरी, TM, प्रैक्टिकल, सॉफ्ट स्किल्स, SMPS, हार्डवेयर, नेटवर्किंग और अन्य</p></div><button class="btn btn-sm" type="button" data-cat-new="subject">नया विषय</button></div>' +
      subjectRows() +
      "</section>" +
      '<section class="admin-card"><div class="admin-section-head"><div><h3>ट्रेड</h3><p class="admin-card-sub">विद्यार्थी और परीक्षा के लिए ट्रेड</p></div><button class="btn btn-sm" type="button" data-cat-new="trade">नया ट्रेड</button></div>' +
      tradeRows() +
      "</section></div>";

    $$("[data-cat-new]", content).forEach((button) =>
      button.addEventListener("click", () => openCatalogEditor(button.dataset.catNew))
    );
    $$("[data-cat-edit]", content).forEach((button) =>
      button.addEventListener("click", () =>
        openCatalogEditor(button.dataset.catEdit, button.dataset.catId)
      )
    );
    $$("[data-cat-toggle]", content).forEach((button) =>
      button.addEventListener("click", () => toggleCatalog(button.dataset.catToggle, button.dataset.catId))
    );
    $$("[data-cat-delete]", content).forEach((button) =>
      button.addEventListener("click", () => deleteCatalog(button.dataset.catDelete, button.dataset.catId))
    );
  }

  function openCatalogEditor(kind, id) {
    const isSubject = kind === "subject";
    const list = isSubject ? subjects() : trades();
    const existing = id ? list.find((item) => item.id === id) : null;
    if (id && !existing) {
      UI.toast("रिकॉर्ड नहीं मिला — पेज रीफ़्रेश करें", "bad");
      return;
    }
    const item = existing || { name: "", code: "", active: true };
    const label = isSubject ? "विषय" : "ट्रेड";
    const body =
      '<div class="stack"><label class="field"><span>' +
      label +
      ' का नाम *</span><input class="input" id="catName" maxlength="60" value="' +
      attr(item.name) +
      '"></label><label class="field"><span>कोड</span><input class="input" id="catCode" maxlength="12" value="' +
      attr(item.code || "") +
      '" placeholder="जैसे: TT, TM, SMPS"><small>खाली छोड़ने पर स्वतः बनेगा।</small></label><label class="check"><input type="checkbox" id="catActive"' +
      (item.active === false ? "" : " checked") +
      '><span>सक्रिय</span></label></div>' +
      (existing
        ? '<div class="notice warn small" style="margin-top:10px">नाम/कोड बदलने से पुराने प्रश्न और परीक्षा नहीं बदलते; ID स्थिर रहता है।</div>'
        : "");

    const modal = UI.modal({
      title: existing ? label + " एडिट करें" : "नया " + label,
      size: "sm",
      body: body,
      actions: [
        { label: "रद्द करें", ghost: true, onClick: (handle) => handle.close() },
        {
          label: "सेव करें",
          tone: "btn-navy",
          id: "catSaveBtn",
          onClick: async (handle) => {
            const name = $("#catName", modal.body).value.trim();
            if (name.length < 2) {
              UI.toast("नाम दर्ज करें", "bad");
              return;
            }
            const payload = {
              name: name,
              code: $("#catCode", modal.body).value.trim(),
              active: $("#catActive", modal.body).checked,
            };
            if (existing) payload.id = existing.id;
            const button = $("#catSaveBtn", handle.foot);
            UI.setButtonBusy(button, true, "सेव हो रहा है…");
            try {
              await api(isSubject ? "admin_subject_save" : "admin_trade_save", {
                [isSubject ? "subject" : "trade"]: payload,
              });
              handle.close();
              UI.toast(label + " सेव हो गया", "good");
              state.overview = null;
              await renderRoute("catalog", true);
            } catch (error) {
              UI.toast(error.message || "सेव नहीं हो सका", "bad");
              UI.setButtonBusy(button, false);
            }
          },
        },
      ],
    });
    return modal;
  }

  async function toggleCatalog(kind, id) {
    const isSubject = kind === "subject";
    const list = isSubject ? subjects() : trades();
    const item = list.find((entry) => entry.id === id);
    if (!item) return;
    try {
      await api(isSubject ? "admin_subject_save" : "admin_trade_save", {
        [isSubject ? "subject" : "trade"]: {
          id: item.id,
          name: item.name,
          code: item.code || "",
          active: item.active === false,
        },
      });
      UI.toast(item.active === false ? "सक्रिय कर दिया" : "निष्क्रिय कर दिया", "good");
      state.overview = null;
      await renderRoute("catalog", true);
    } catch (error) {
      UI.toast(error.message || "स्थिति नहीं बदली", "bad");
    }
  }

  async function deleteCatalog(kind, id) {
    const isSubject = kind === "subject";
    const list = isSubject ? subjects() : trades();
    const item = list.find((entry) => entry.id === id);
    if (!item) return;
    const label = isSubject ? "विषय" : "ट्रेड";
    const typed = await UI.confirm({
      title: label + " हटाएँ?",
      message: "यह " + label + " स्थायी रूप से हट जाएगा। यदि इसका उपयोग प्रश्न/परीक्षा/विद्यार्थी में हो रहा है तो सर्वर सुरक्षित रूप से रोक देगा।",
      detail: "पुष्टि के लिए " + label + " का नाम टाइप करें: " + item.name,
      requireText: item.name,
      confirmText: "हटाएँ",
      tone: "btn-bad",
    });
    if (!typed) return;
    try {
      await api(isSubject ? "admin_subject_delete" : "admin_trade_delete", {
        id: item.id,
        confirm: typed,
      });
      UI.toast(label + " हटा दिया गया", "good");
      state.overview = null;
      await renderRoute("catalog", true);
    } catch (error) {
      UI.toast(error.message || "हटाया नहीं जा सका", "bad");
    }
  }

  /* ---------- statistics ---------- */
  async function renderStats(content) {
    const data = await api("admin_stats");

    function statBlock(title, stats, note) {
      return (
        '<div class="admin-card"><div class="admin-section-head"><div><h3>' +
        esc(title) +
        '</h3><p class="admin-card-sub">' +
        esc(note || "") +
        '</p></div></div><div class="stat-grid" style="margin:0">' +
        statCard("परिणाम", stats.count || 0, "कुल", "brand") +
        statCard("औसत", UI.trimNumber(stats.average || 0) + "%", "") +
        statCard("पास दर", UI.trimNumber(stats.passRate || 0) + "%", (stats.pass || 0) + " पास · " + (stats.fail || 0) + " फेल") +
        statCard("उच्चतम / न्यूनतम", UI.trimNumber(stats.highest || 0) + "% / " + UI.trimNumber(stats.lowest || 0) + "%", "") +
        "</div></div>"
      );
    }

    function statsTable(title, rows, labelKey, labelHeader) {
      if (!rows.length) return emptyBox(title + " का कोई फाइनल परिणाम नहीं", true);
      return (
        '<div class="table-wrap"><table class="data"><thead><tr><th>' +
        esc(labelHeader) +
        "</th><th>परिणाम</th><th>औसत</th><th>उच्चतम</th><th>न्यूनतम</th><th>पास दर</th><th>पास / फेल</th></tr></thead><tbody>" +
        rows
          .map(
            (row) =>
              "<tr><td><span class=\"t-main\">" +
              esc(row[labelKey] || "—") +
              "</span></td><td>" +
              esc(row.count || 0) +
              "</td><td>" +
              esc(UI.trimNumber(row.average || 0)) +
              "%</td><td>" +
              esc(UI.trimNumber(row.highest || 0)) +
              "%</td><td>" +
              esc(UI.trimNumber(row.lowest || 0)) +
              "%</td><td>" +
              esc(UI.trimNumber(row.passRate || 0)) +
              "%</td><td>" +
              esc(row.pass || 0) +
              " / " +
              esc(row.fail || 0) +
              "</td></tr>"
          )
          .join("") +
        "</tbody></table></div>"
      );
    }

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>आँकड़े</h1><p>केवल फाइनल परीक्षा के परिणाम नीचे की तालिकाओं में हैं; अभ्यास परीक्षा अलग से दिखाई गई है।</p></div></div>' +
      '<div class="grid-3" style="margin-bottom:18px">' +
      '<div class="stat-tile"><small>विद्यार्थी</small><b>' +
      esc(data.students || 0) +
      '</b><p>पंजीकृत</p></div><div class="stat-tile"><small>सक्रिय प्रयास</small><b>' +
      esc(data.activeAttempts || 0) +
      "</b><p>अभी परीक्षा में</p></div><div class=\"stat-tile\"><small>कुल फाइनल परिणाम</small><b>" +
      esc(data.overall.count || 0) +
      "</b><p>सभी परीक्षाएँ</p></div></div>" +
      statBlock("समग्र प्रदर्शन (फाइनल)", data.overall, "सभी फाइनल परीक्षाओं का संयुक्त सारांश") +
      '<div class="grid-2" style="margin-top:18px"><section class="admin-card"><div class="admin-section-head"><div><h3>परीक्षा-वार</h3></div></div>' +
      statsTable("परीक्षा-वार", data.exams, "examTitle", "परीक्षा") +
      '</section><section class="admin-card"><div class="admin-section-head"><div><h3>विषय-वार</h3></div></div>' +
      statsTable("विषय-वार", data.subjects, "subjectName", "विषय") +
      "</section></div>" +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>ट्रेड-वार</h3></div></div>' +
      statsTable("ट्रेड-वार", data.trades, "tradeName", "ट्रेड") +
      "</section>" +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>अभ्यास परीक्षा</h3><p class="admin-card-sub">फाइनल परिणाम से अलग — केवल अभ्यास प्रयास</p></div></div><div class="stat-grid" style="margin:0">' +
      statCard("अभ्यास परिणाम", data.practice.count || 0, "कुल", "gold") +
      statCard("औसत", UI.trimNumber(data.practice.average || 0) + "%", "") +
      statCard("पास दर", UI.trimNumber(data.practice.passRate || 0) + "%", (data.practice.pass || 0) + " पास") +
      statCard("उच्चतम", UI.trimNumber(data.practice.highest || 0) + "%", "न्यूनतम " + UI.trimNumber(data.practice.lowest || 0) + "%") +
      "</div></section>";
  }

  /* ---------- settings ---------- */
  async function renderSettings(content) {
    const [ov, controllerData] = await Promise.all([
      ensureOverview(true),
      api("admin_exam_controller_get"),
    ]);
    const s = ov.settings;
    const controller = controllerData.controller;

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>सेटिंग्स</h1><p>नई परीक्षाओं के डिफ़ॉल्ट, पंजीकरण और परिणाम जारी करने की नीति।</p></div></div>' +
      '<form id="settingsForm" class="admin-card"><div class="settings-grid">' +
      '<label class="field"><span>पोर्टल का नाम</span><input class="input" id="setSiteName" maxlength="80" value="' +
      attr(s.siteName || "") +
      '"></label>' +
      '<label class="field"><span>ग्रुप का नाम</span><input class="input" id="setGroupName" maxlength="80" value="' +
      attr(s.groupName || s.collegeName || "") +
      '"></label>' +
      '<label class="field"><span>डिफ़ॉल्ट पास प्रतिशत</span><input class="input" id="setPassPct" type="number" min="0" max="100" step="0.5" value="' +
      attr(s.defaultPassPct) +
      '"></label>' +
      '<label class="field"><span>डिफ़ॉल्ट अवधि (मिनट)</span><input class="input" id="setDuration" type="number" min="1" max="300" value="' +
      attr(s.defaultDurationMin) +
      '"></label>' +
      '<label class="field"><span>फोटो अधिकतम (KB)</span><input class="input" id="setMaxPhotoKb" type="number" min="50" max="1000" value="' +
      attr(s.maxPhotoKb || 200) +
      '"><small>50–1000 KB — विद्यार्थी/एडमिन फोटो स्वतः छोटी की जाती है।</small></label>' +
      '<div class="stack" style="justify-content:flex-end"><label class="check"><input type="checkbox" id="setRegistrationOpen"' +
      (s.registrationOpen !== false ? " checked" : "") +
      '><span>नया पंजीकरण चालू रखें</span></label><label class="check"><input type="checkbox" id="setReleaseDefault"' +
      (s.resultsReleaseDefault ? " checked" : "") +
      '><span>नई फाइनल परीक्षा में परिणाम जारी रखें</span></label></div>' +
      '<label class="field full" style="grid-column:1 / -1"><span>डिफ़ॉल्ट निर्देश (हिंदी)</span><textarea class="textarea" id="setInstructions" rows="6">' +
      esc(s.defaultInstructions || "") +
      '</textarea></label><label class="field full" style="grid-column:1 / -1"><span>डिफ़ॉल्ट निर्देश (English)</span><textarea class="textarea" id="setInstructionsEn" rows="6">' +
      esc(s.defaultInstructionsEn || "") +
      "</textarea></label></div>" +
      '<div class="editor-actions"><button class="btn btn-navy" type="submit" id="settingsSaveBtn">सेटिंग्स सेव करें</button></div></form>' +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>एडमिन पासवर्ड</h3><p class="admin-card-sub">नया पासवर्ड कम-से-कम 12 अक्षरों का होना चाहिए।</p></div></div>' +
      '<form id="adminPasswordChangeForm" class="settings-grid">' +
      '<label class="field"><span>वर्तमान पासवर्ड</span><input class="input" id="adminCurrentPassword" type="password" autocomplete="current-password" maxlength="128" required></label>' +
      '<label class="field"><span>नया पासवर्ड</span><input class="input" id="adminNewPassword" type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label>' +
      '<label class="field"><span>नया पासवर्ड दोबारा लिखें</span><input class="input" id="adminConfirmPassword" type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label>' +
      '<div class="editor-actions"><button class="btn btn-navy" type="submit" id="adminPasswordChangeBtn">पासवर्ड बदलें</button></div></form>' +
      '<p class="tiny muted">भूला हुआ पासवर्ड रीसेट लिंक केवल Cloudflare secret ADMIN_EMAIL पर भेजा जाता है।</p></section>' +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>परीक्षा कंट्रोलर खाता</h3><p class="admin-card-sub">कंट्रोलर केवल पेपर लॉक/प्रकाशित/रोक, लाइव निगरानी और प्रयास जमा कर सकता है। छात्र, प्रश्न, परिणाम और सेटिंग्स का access admin के पास ही रहेगा।</p></div><a class="btn btn-ghost btn-sm" href="controller.html">कंट्रोलर लॉगिन पेज</a></div>' +
      '<form id="examControllerForm" class="settings-grid">' +
      '<label class="field"><span>कंट्रोलर नाम</span><input class="input" id="controllerDisplayName" maxlength="60" value="' +
      attr(controller?.displayName || "") +
      '" required></label>' +
      '<label class="field"><span>यूज़रनेम</span><input class="input" id="controllerUsername" minlength="3" maxlength="32" value="' +
      attr(controller?.username || "") +
      '" autocomplete="username" required></label>' +
      '<label class="field"><span>' +
      (controller ? "नया पासवर्ड (वैकल्पिक)" : "पहला पासवर्ड") +
      '</span><input class="input" id="controllerPassword" type="password" minlength="12" maxlength="128" autocomplete="new-password"' +
      (controller ? "" : " required") +
      '><small>कम-से-कम 12 अक्षर। खाली छोड़ने पर मौजूदा पासवर्ड नहीं बदलेगा।</small></label>' +
      '<label class="check"><input type="checkbox" id="controllerActive"' +
      (controller?.active !== false ? " checked" : "") +
      '> कंट्रोलर लॉगिन चालू रखें</label>' +
      '<div class="editor-actions"><button class="btn btn-navy" type="submit" id="controllerSaveBtn">कंट्रोलर खाता सेव करें</button></div>' +
      '</form><p class="tiny muted">' +
      (controller ? "वर्तमान यूज़रनेम: " + esc(controller.username) : "अभी कंट्रोलर खाता नहीं बनाया गया है।") +
      "</p></section>" +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>Cloudflare सुरक्षा कॉन्फ़िगरेशन</h3><p class="admin-card-sub">Secret values केवल Cloudflare Worker settings में रखें — फ्रंटएंड या GitHub में नहीं।</p></div></div>' +
      '<dl class="detail-list">' +
      detailRow("ADMIN_PASSWORD", "शुरुआती पासवर्ड (पासवर्ड बदलने के बाद वैकल्पिक)") +
      detailRow("ADMIN_SECRET", "सत्र टोकन हस्ताक्षर के लिए स्थिर, 32+ byte secret") +
      detailRow("ADMIN_EMAIL", "एडमिन रिकवरी ईमेल") +
      detailRow("GMAIL_CLIENT_ID", "Gmail API OAuth client ID") +
      detailRow("GMAIL_CLIENT_SECRET", "Gmail API OAuth client secret") +
      detailRow("GMAIL_REFRESH_TOKEN", "gmail.send scope वाला OAuth refresh token") +
      detailRow("RESEND_API_KEY", "वैकल्पिक Resend API key") +
      detailRow("EMAIL_FROM", "Resend के लिए सत्यापित sender; Gmail में आवश्यक नहीं") +
      detailRow("PUBLIC_BASE_URL", "HTTPS वेबसाइट origin, जैसे https://portal.example") +
      "</dl><div class=\"notice warn\" style=\"margin-top:12px\">D1 में पासवर्ड का salted hash रखा जाता है; ADMIN_SECRET न बदलें।</div></section>";

    $("#settingsForm", content).addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("#settingsSaveBtn", content);
      const settings = {
        siteName: $("#setSiteName", content).value.trim(),
        groupName: $("#setGroupName", content).value.trim(),
        registrationOpen: $("#setRegistrationOpen", content).checked,
        defaultPassPct: Number($("#setPassPct", content).value),
        defaultDurationMin: Number($("#setDuration", content).value),
        maxPhotoKb: Number($("#setMaxPhotoKb", content).value),
        defaultInstructions: $("#setInstructions", content).value,
        defaultInstructionsEn: $("#setInstructionsEn", content).value,
        resultsReleaseDefault: $("#setReleaseDefault", content).checked,
      };
      UI.setButtonBusy(button, true, "सेव हो रहा है…");
      try {
        const data = await api("admin_settings_save", { settings: settings });
        state.overview = null;
        state.settings = data.settings;
        $("#adminSiteName").textContent = data.settings.siteName || "Future Instructor";
        UI.toast("सेटिंग्स सेव हो गईं", "good");
        UI.setButtonBusy(button, false);
      } catch (error) {
        UI.toast(error.message || "सेटिंग्स सेव नहीं हो सकीं", "bad");
        UI.setButtonBusy(button, false);
      }
    });

    $("#examControllerForm", content).addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("#controllerSaveBtn", content);
      UI.setButtonBusy(button, true, "सेव हो रहा है…");
      try {
        const result = await api("admin_exam_controller_save", {
          controller: {
            displayName: $("#controllerDisplayName", content).value.trim(),
            username: $("#controllerUsername", content).value.trim(),
            password: $("#controllerPassword", content).value,
            active: $("#controllerActive", content).checked,
          },
        });
        $("#controllerPassword", content).value = "";
        UI.toast("परीक्षा कंट्रोलर खाता सेव हो गया", "good");
        const note = $("#examControllerForm + p", content);
        if (note) note.textContent = "वर्तमान यूज़रनेम: " + result.controller.username;
      } catch (error) {
        UI.toast(error.message || "कंट्रोलर खाता सेव नहीं हो सका", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    });

    $("#adminPasswordChangeForm", content).addEventListener("submit", async (event) => {
      event.preventDefault();
      const currentPassword = $("#adminCurrentPassword", content).value;
      const newPassword = $("#adminNewPassword", content).value;
      if (newPassword !== $("#adminConfirmPassword", content).value) {
        UI.toast("दोनों नए पासवर्ड एक जैसे नहीं हैं।", "bad");
        return;
      }
      const button = $("#adminPasswordChangeBtn", content);
      UI.setButtonBusy(button, true, "पासवर्ड बदला जा रहा है…");
      try {
        const result = await api("admin_password_change", { currentPassword, newPassword });
        state.token = result.token;
        UI.setAdminSession(result.token);
        $("#adminCurrentPassword", content).value = "";
        $("#adminNewPassword", content).value = "";
        $("#adminConfirmPassword", content).value = "";
        UI.toast(result.message, "good");
      } catch (error) {
        UI.toast(error.message || "पासवर्ड बदला नहीं जा सका।", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    });
  }

  /* ---------- tools ---------- */
  async function renderTools(content) {
    const [legacyData, auditData] = await Promise.all([
      api("admin_legacy_preview"),
      api("admin_audit", { limit: 100 }),
    ]);
    const legacy = legacyData.legacy || {};
    const legacyCount = (legacy.students || 0) + (legacy.results || 0) + (legacy.activeAttempts || 0);

    content.innerHTML =
      '<div class="admin-section-head"><div><h1>टूल्स</h1><p>पुराने डेटा का सुरक्षित आयात, पूरा बैकअप और ऑडिट लॉग।</p></div></div>' +
      '<div class="grid-2">' +
      '<section class="admin-card"><div class="admin-section-head"><div><h3>पुराने पोर्टल का डेटा</h3><p class="admin-card-sub">दोबारा चलाने पर डुप्लिकेट नहीं बनते (idempotent)</p></div></div>' +
      (legacyCount
        ? '<dl class="detail-list">' +
          detailRow("विद्यार्थी", legacy.students || 0) +
          detailRow("परिणाम", legacy.results || 0) +
          detailRow("सक्रिय प्रयास", legacy.activeAttempts || 0) +
          detailRow("पुराना विषय", (legacy.config && legacy.config.subject) || "—") +
          detailRow("स्टोर", legacy.store || "—") +
          '</dl><div class="editor-actions"><button class="btn btn-navy btn-sm" type="button" data-legacy-import>पुराना डेटा आयात करें</button></div><div class="notice warn small" style="margin-top:10px">आयात से पहले पूरा JSON बैकअप निकालने की सलाह है। मौजूदा परिणाम नहीं बदले जाएँगे।</div>'
        : '<div class="notice info">इस स्टोर में पुराने पोर्टल का कोई डेटा नहीं मिला।</div>') +
      "</section>" +
      '<section class="admin-card"><div class="admin-section-head"><div><h3>पूरा डेटा बैकअप</h3><p class="admin-card-sub">Students, Exams, Papers, Questions, Results, Settings</p></div></div><p class="small muted">पूरा डेटा JSON में डाउनलोड करें। इसे सुरक्षित जगह रखें — इसमें छात्रों की जानकारी और परीक्षा पेपर शामिल हैं।</p><div class="backup-actions" style="margin-top:12px"><button class="btn btn-sm" type="button" id="exportAllBtn">JSON बैकअप डाउनलोड</button><a class="btn btn-ghost btn-sm" href="templates/questions-template.xlsx" download>Excel टेम्पलेट</a><a class="btn btn-ghost btn-sm" href="templates/questions-sample.json" download>Sample JSON</a></div></section></div>' +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>ऑडिट लॉग</h3><p class="admin-card-sub">एडमिन की सभी संवेदनशील गतिविधियाँ</p></div><div class="row"><select class="select compact" id="auditLimit">' +
      optionList(
        [
          { value: "50", label: "50" },
          { value: "100", label: "100" },
          { value: "200", label: "200" },
        ],
        "100"
      ) +
      '<button class="btn btn-sm btn-ghost" type="button" id="auditRefreshBtn">रिफ़्रेश</button></div></div><div id="auditBox">' +
      (auditData.entries.length ? auditList(auditData.entries) : emptyBox("कोई गतिविधि दर्ज नहीं", true)) +
      "</div></section>" +
      '<section class="admin-card" style="margin-top:18px"><div class="admin-section-head"><div><h3>सुरक्षा जाँच सूची</h3></div></div><div class="stack small">' +
      '<div class="check"><span>✔ एडमिन पासवर्ड केवल Netlify Environment Variable में है</span></div>' +
      '<div class="check"><span>✔ हर एडमिन API सर्वर पर Bearer टोकन जाँचता है</span></div>' +
      '<div class="check"><span>✔ टाइमर, स्कोरिंग और प्रकाशन-स्थिति सर्वर पर लागू होती है</span></div>' +
      '<div class="check"><span>✔ विद्यार्थी केवल अपना परिणाम और अपने उत्तर देख सकता है</span></div>' +
      '<div class="check"><span>✔ अंतिम सबमिशन के बाद उत्तर बदलना सर्वर रोकता है</span></div>' +
      '<div class="check"><span>✔ लॉक किए पेपर का स्नैपशॉट पुराने प्रयासों को सुरक्षित रखता है</span></div>' +
      "</div></section>";

    const legacyImportBtn = $("[data-legacy-import]", content);
    if (legacyImportBtn) legacyImportBtn.addEventListener("click", () => importLegacy());
    $("#exportAllBtn", content).addEventListener("click", async () => {
      const button = $("#exportAllBtn", content);
      UI.setButtonBusy(button, true, "डाउनलोड…");
      try {
        const filename = await UI.download("admin_export", {}, state.token);
        UI.toast("बैकअप डाउनलोड: " + filename, "good");
      } catch (error) {
        UI.toast(error.message || "बैकअप डाउनलोड नहीं हो सका", "bad");
      } finally {
        UI.setButtonBusy(button, false);
      }
    });
    const loadAudit = async () => {
      const box = $("#auditBox", content);
      if (!box) return;
      box.innerHTML = '<div class="table-note">लोड हो रहा है…</div>';
      try {
        const data = await api("admin_audit", { limit: Number($("#auditLimit", content).value) || 100 });
        box.innerHTML = data.entries.length ? auditList(data.entries) : emptyBox("कोई गतिविधि दर्ज नहीं", true);
      } catch (error) {
        box.innerHTML = emptyBox(error.message || "ऑडिट लोड नहीं हो सका");
      }
    };
    $("#auditLimit", content).addEventListener("change", loadAudit);
    $("#auditRefreshBtn", content).addEventListener("click", loadAudit);
  }

  async function importLegacy() {
    const ok = await UI.confirm({
      title: "पुराने पोर्टल का डेटा आयात करें?",
      message: "पुराने विद्यार्थी, परिणाम और सेटिंग्स नए स्टोर में सुरक्षित रूप से जोड़े जाएँगे। पहले से मौजूद रिकॉर्ड नहीं बदलेंगे।",
      detail: "आयात से पहले JSON बैकअप डाउनलोड करने की सलाह है।",
      confirmText: "आयात करें",
      tone: "btn-navy",
    });
    if (!ok) return;
    try {
      const data = await api("admin_legacy_import");
      const report = data.report || {};
      state.overview = null;
      await ensureOverview(true);
      const skippedLine = (section) => {
        const skipped = (section && section.skipped) || [];
        if (!skipped.length) return "";
        return (
          '<details class="editor-section"><summary class="small">छोड़े गए रिकॉर्ड (' +
          skipped.length +
          ")</summary><ul class=\"small\">" +
          skipped
            .slice(0, 50)
            .map((entry) => "<li>" + esc(typeof entry === "string" ? entry : JSON.stringify(entry)) + "</li>")
            .join("") +
          "</ul></details>"
        );
      };
      UI.modal({
        title: "आयात पूर्ण",
        size: "sm",
        body:
          '<dl class="detail-list">' +
          detailRow("विद्यार्थी — नए", (report.students && report.students.imported) || 0) +
          detailRow("विद्यार्थी — पहले से", (report.students && report.students.existing) || 0) +
          detailRow("परिणाम — नए", (report.results && report.results.imported) || 0) +
          detailRow("परिणाम — पहले से", (report.results && report.results.existing) || 0) +
          detailRow("बनाई परीक्षाएँ", Array.isArray(report.exams) ? report.exams.length : 0) +
          "</dl>" +
          skippedLine(report.students) +
          skippedLine(report.results) +
          '<div class="notice info small" style="margin-top:10px">पुराने परिणाम नए फाइनल परिणामों से अलग रिकॉर्ड हैं; कुछ भी ओवरराइट नहीं हुआ।</div>',
        actions: [{ label: "ठीक है", tone: "btn-navy", onClick: (handle) => handle.close() }],
      });
      if (state.route === "dashboard" || state.route === "tools" || state.route === "students") {
        await renderRoute(state.route, true);
      }
    } catch (error) {
      UI.toast(error.message || "आयात नहीं हो सका", "bad");
    }
  }

  /* ---------- boot ---------- */
  boot();
})();
