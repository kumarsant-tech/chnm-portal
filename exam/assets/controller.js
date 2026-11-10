(function () {
  "use strict";

  const UI = window.UI;
  const $ = UI.$;
  const esc = UI.esc;
  const TOKEN_KEY = "fig.exam-controller.token";
  const PROFILE_KEY = "fig.exam-controller.profile";
  let token = "";
  let profile = null;
  let refreshTimer = 0;
  let exams = [];
  let liveItems = [];

  function readSession(key) {
    try {
      return sessionStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function writeSession(key, value) {
    try {
      if (value) sessionStorage.setItem(key, value);
      else sessionStorage.removeItem(key);
    } catch {
      UI.toast("ब्राउज़र सत्र उपलब्ध नहीं है।", "bad");
    }
  }

  function saveSession(nextToken, nextProfile) {
    token = nextToken || "";
    profile = nextProfile || null;
    writeSession(TOKEN_KEY, token);
    writeSession(PROFILE_KEY, profile ? JSON.stringify(profile) : "");
  }

  function showLogin() {
    clearInterval(refreshTimer);
    refreshTimer = 0;
    $("#controllerLogin").hidden = false;
    $("#controllerDashboard").hidden = true;
  }

  function showDashboard() {
    $("#controllerLogin").hidden = true;
    $("#controllerDashboard").hidden = false;
    $("#controllerWelcome").textContent = profile?.displayName || "परीक्षा संचालन";
  }

  function examStatus(status) {
    return {
      draft: "तैयारी में",
      locked: "पेपर लॉक",
      published: "प्रकाशित",
      archived: "आर्काइव",
    }[status] || status || "अज्ञात";
  }

  function examAction(exam) {
    if (exam.status === "draft") {
      return Number(exam.questionCount) > 0
        ? '<button class="btn btn-sm" type="button" data-conduct="lock" data-exam="' + UI.attr(exam.id) + '">पेपर लॉक करें</button>'
        : '<span class="tiny muted">पेपर तैयार होने पर admin इसे उपलब्ध कराएँगे।</span>';
    }
    if (exam.status === "locked") {
      return '<button class="btn btn-sm" type="button" data-conduct="publish" data-exam="' + UI.attr(exam.id) + '">परीक्षा प्रकाशित करें</button>';
    }
    if (exam.status === "published") {
      return '<button class="btn btn-sm btn-warn" type="button" data-conduct="unpublish" data-exam="' + UI.attr(exam.id) + '">नई शुरुआत रोकें</button><small class="muted">चल रहे प्रयास जारी रहेंगे।</small>';
    }
    return "";
  }

  function renderExams() {
    const node = $("#controllerExamList");
    if (!exams.length) {
      node.innerHTML = '<p class="muted">अभी कोई परीक्षा उपलब्ध नहीं है।</p>';
      return;
    }
    node.innerHTML = exams.map((exam) =>
      '<article class="exam-card"><div class="row-between"><span class="pill ' +
      (exam.status === "published" ? "good" : "info") +
      '">' + esc(examStatus(exam.status)) + '</span><small class="muted">' +
      esc(exam.code || "") + '</small></div><h3>' + esc(exam.title || "परीक्षा") +
      '</h3><div class="exam-meta"><span>प्रश्न <b>' + esc(exam.totalQuestions || exam.questionCount || 0) +
      '</b></span><span>सक्रिय प्रयास <b>' + esc(exam.activeAttempts || 0) +
      '</b></span></div><p class="tiny muted">शुरू: ' + esc(exam.startAt ? UI.fmtDateTime(exam.startAt) : "निर्धारित नहीं") +
      ' · समाप्ति: ' + esc(exam.endAt ? UI.fmtDateTime(exam.endAt) : "निर्धारित नहीं") +
      '</p><div class="exam-actions">' + examAction(exam) + '</div></article>'
    ).join("");
    node.querySelectorAll("[data-conduct]").forEach((button) => {
      button.addEventListener("click", () => conductExam(button));
    });
  }

  function renderLive() {
    const node = $("#controllerLiveList");
    $("#controllerLiveCount").textContent = String(liveItems.length);
    if (!liveItems.length) {
      node.innerHTML = '<p class="muted">अभी कोई सक्रिय परीक्षा प्रयास नहीं है।</p>';
      return;
    }
    node.innerHTML = liveItems.map((item) =>
      '<article class="panel"><div class="row-between"><div><b>' + esc(item.studentName || "छात्र") +
      '</b><p class="tiny muted" style="margin:3px 0 0">' + esc(item.examTitle || item.examId) +
      ' · ID ' + esc(item.studentId) + '</p></div><span class="pill ' +
      (item.expired ? "warn" : "good") + '">' +
      (item.expired ? "समय समाप्त" : esc(Math.ceil((Number(item.remainingSec) || 0) / 60) + " मिनट शेष")) +
      '</span></div><div class="row-between" style="margin-top:10px"><small>उत्तर ' +
      esc(item.answered || 0) + " / " + esc(item.totalQuestions || 0) +
      '</small><button class="btn btn-sm btn-ghost" type="button" data-finalize="' +
      UI.attr(item.examId) + '" data-student="' + UI.attr(item.studentId) +
      '">प्रयास जमा करें</button></div></article>'
    ).join("");
    node.querySelectorAll("[data-finalize]").forEach((button) => {
      button.addEventListener("click", () => finalizeAttempt(button));
    });
  }

  async function refresh() {
    if (!token) return;
    try {
      const [examData, liveData] = await Promise.all([
        UI.call("controller_exams", {}, token),
        UI.call("controller_live", {}, token),
      ]);
      exams = examData.exams || [];
      liveItems = liveData.items || [];
      renderExams();
      renderLive();
      $("#controllerUpdated").textContent = "अपडेट: " + UI.fmtTime(new Date().toISOString());
    } catch (error) {
      if (error.status === 401) {
        saveSession("", null);
        showLogin();
      }
      UI.toast(error.message || "परीक्षा सूची लोड नहीं हुई।", "bad");
    }
  }

  async function conductExam(button) {
    const operation = button.dataset.conduct;
    const examId = button.dataset.exam;
    const labels = {
      lock: "पेपर लॉक करें?",
      publish: "परीक्षा प्रकाशित करें?",
      unpublish: "नई परीक्षा शुरुआत रोकें? चल रहे प्रयास अपनी समय-सीमा तक जारी रहेंगे।",
    };
    if (!window.confirm(labels[operation] || "जारी रखें?")) return;
    button.disabled = true;
    try {
      await UI.call("controller_exam_" + operation, { examId }, token);
      UI.toast("परीक्षा स्थिति अपडेट हो गई।", "good");
      await refresh();
    } catch (error) {
      UI.toast(error.message || "परीक्षा स्थिति अपडेट नहीं हुई।", "bad");
      button.disabled = false;
    }
  }

  async function finalizeAttempt(button) {
    if (!window.confirm("इस विद्यार्थी का परीक्षा प्रयास जमा करना है?")) return;
    button.disabled = true;
    try {
      await UI.call("controller_attempt_finalize", {
        examId: button.dataset.finalize,
        studentId: button.dataset.student,
      }, token);
      UI.toast("परीक्षा प्रयास जमा कर दिया गया।", "good");
      await refresh();
    } catch (error) {
      UI.toast(error.message || "प्रयास जमा नहीं हो सका।", "bad");
      button.disabled = false;
    }
  }

  $("#controllerLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    $("#controllerLoginError").hidden = true;
    const button = $("#controllerLoginButton");
    UI.setButtonBusy(button, true, "लॉगिन हो रहा है…");
    try {
      const result = await UI.call("exam_controller_login", {
        username: $("#controllerLoginUsername").value.trim(),
        password: $("#controllerLoginPassword").value,
      });
      $("#controllerLoginPassword").value = "";
      saveSession(result.token, result.controller);
      showDashboard();
      await refresh();
      clearInterval(refreshTimer);
      refreshTimer = setInterval(() => {
        if (!document.hidden) refresh();
      }, 15000);
    } catch (error) {
      $("#controllerLoginError").textContent = error.message || "लॉगिन नहीं हो सका।";
      $("#controllerLoginError").hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
  });

  $("#controllerRefresh").addEventListener("click", refresh);
  $("#controllerLogout").addEventListener("click", () => {
    saveSession("", null);
    showLogin();
  });

  token = readSession(TOKEN_KEY);
  try {
    profile = JSON.parse(readSession(PROFILE_KEY) || "null");
  } catch {
    profile = null;
  }
  if (token) {
    showDashboard();
    refresh();
    refreshTimer = setInterval(() => {
      if (!document.hidden) refresh();
    }, 15000);
  } else {
    showLogin();
  }
})();
