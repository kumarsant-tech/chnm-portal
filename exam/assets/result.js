/* Future Instructor – CHNM Portal · student result page */
(function () {
  "use strict";

  const UI = window.UI;
  const $ = UI.$;
  const esc = UI.esc;

  const state = {
    token: UI.studentToken(),
    student: UI.studentData(),
    resultId: UI.query("resultId") || "",
    result: null,
  };

  const els = {};
  ["loadingView", "errorView", "listView", "resultView", "resultBox", "resultsList", "userSlot"].forEach(
    (id) => {
      els[id] = document.getElementById(id);
    }
  );

  function showView(name) {
    ["loadingView", "errorView", "listView", "resultView"].forEach((id) => {
      if (els[id]) els[id].hidden = id !== name;
    });
  }

  function goLogin() {
    UI.clearStudentSession();
    window.location.replace("index.html");
  }

  async function api(action, payload) {
    try {
      return await UI.call(action, payload, state.token);
    } catch (error) {
      if (error && error.status === 401) {
        goLogin();
      }
      throw error;
    }
  }

  function setHeaderUser() {
    if (!state.student || !els.userSlot) return;
    els.userSlot.hidden = false;
    els.userSlot.innerHTML =
      UI.avatar(state.student.photo, state.student.name) +
      '<span class="header-user-text"><b>' +
      esc(state.student.name) +
      "</b><small>" +
      esc(state.student.id) +
      "</small></span>";
    els.userSlot.title = state.student.name + " · " + state.student.id;
  }

  function errorView(message, backToList) {
    showView("errorView");
    els.errorView.innerHTML =
      '<div class="panel"><div class="empty"><strong>परिणाम नहीं मिला</strong><p>' +
      esc(message || "यह परिणाम आपका नहीं है या उपलब्ध नहीं है।") +
      '</p><div class="row" style="justify-content:center"><a class="btn btn-sm" href="index.html">डैशबोर्ड</a>' +
      (backToList ? '<a class="btn btn-ghost btn-sm" href="result.html">मेरे परिणाम</a>' : "") +
      "</div></div></div>";
  }

  function pendingOf(result) {
    return result.pending === true || result.percentage === null || result.percentage === undefined;
  }

  function renderList(results) {
    showView("listView");
    if (!results.length) {
      els.resultsList.innerHTML =
        '<div class="empty"><strong>अभी कोई परिणाम नहीं है</strong><p>परीक्षा पूरी करने के बाद आपका परिणाम यहाँ दिखेगा। फाइनल परीक्षा के अंक एडमिन द्वारा जारी होने पर दिखते हैं।</p><a class="btn btn-sm" href="index.html">परीक्षा चुनें</a></div>';
      return;
    }
    els.resultsList.innerHTML =
      '<div class="result-list">' +
      results
        .map((result) => {
          const pending = pendingOf(result);
          return (
            '<article class="result-row"><div><div class="r-title">' +
            esc(result.examTitle || "परीक्षा") +
            '</div><div class="r-sub">' +
            esc(result.subjectName || "") +
            (result.subjectName ? " • " : "") +
            esc(UI.examTypeLabel(result.examType)) +
            " • " +
            esc(UI.fmtDateTime(result.submittedAt)) +
            (result.legacy ? ' <span class="pill">पुराना</span>' : "") +
            '</div></div><div><div class="r-score">' +
            (pending ? "—" : esc(UI.fmtPct(result.percentage))) +
            '</div><div class="r-sub">' +
            (pending
              ? '<span class="pill warn">प्रतीक्षित</span>'
              : esc(UI.fmtMarks(result.obtained) + " / " + UI.fmtMarks(result.maxMarks)) + " · " + UI.passPill(result.pass)) +
            '</div></div><div class="row-actions"><a class="btn btn-sm btn-ghost" href="result.html?resultId=' +
            encodeURIComponent(result.resultId) +
            '">विवरण</a></div></article>'
          );
        })
        .join("") +
      "</div>" +
      '<div class="notice info small" style="margin-top:14px">अभ्यास परीक्षा के परिणाम तुरंत दिखते हैं। फाइनल परीक्षा के अंक और उत्तर-कुंजी केवल एडमिन द्वारा जारी किए जाने पर दिखते हैं।</div>';
  }

  async function loadList() {
    showView("loadingView");
    try {
      const data = await api("student_results");
      const results = (data.results || []).slice().sort((a, b) => {
        return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
      });
      renderList(results);
    } catch (error) {
      if (error && error.status === 401) return;
      showView("errorView");
      els.errorView.innerHTML = "";
      UI.showError(els.errorView, error.message || "परिणाम लोड नहीं हो सके");
      const retry = $("#errorView [data-retry]");
      if (retry) retry.addEventListener("click", loadList);
    }
  }

  async function loadResult(resultId) {
    showView("loadingView");
    try {
      const data = await api("student_result_get", { resultId: resultId });
      const result = data.result || {};
      result.pending = data.pending === true || pendingOf(result);
      state.result = result;

      let meta = null;
      try {
        const list = await api("student_results");
        meta = (list.results || []).find((entry) => entry.resultId === result.resultId) || null;
      } catch {
        meta = null;
      }
      if (meta) {
        result.subjectName = meta.subjectName || result.subjectName;
        result.tradeName = meta.tradeName || result.tradeName;
        result.examType = result.examType || meta.examType;
      }

      showView("resultView");
      const extraMeta = [result.subjectName, result.tradeName].filter(Boolean).join(" · ");
      let answersNote = "";
      if (!result.pending && !result.answers) {
        answersNote = "इस परिणाम के सही उत्तर उपलब्ध नहीं हैं। कृपया एडमिन से संपर्क करें।";
      }
      els.resultBox.innerHTML = window.ResultView.html(result, {
        studentName: (state.student && state.student.name) || result.studentName,
        studentPhoto: (state.student && state.student.photo) || "",
        extraMeta: extraMeta,
        answersNote: answersNote,
      });
      document.title = (result.examTitle || "परिणाम") + " — Future Instructor CHNM";
    } catch (error) {
      if (error && error.status === 401) return;
      if (error && error.status === 404) {
        errorView("यह परिणाम आपके खाते से नहीं जुड़ा है या उपलब्ध नहीं है।", true);
        return;
      }
      showView("errorView");
      els.errorView.innerHTML = "";
      UI.showError(els.errorView, error.message || "परिणाम लोड नहीं हो सका");
      const retry = $("#errorView [data-retry]");
      if (retry) retry.addEventListener("click", () => loadResult(resultId));
    }
  }

  function init() {
    setHeaderUser();
    if (!state.token) {
      goLogin();
      return;
    }

    $("#resultLogoutBtn").addEventListener("click", async () => {
      const yes = await UI.confirm({
        title: "लॉगआउट करें?",
        message: "आपको दोबारा लॉगिन करना होगा।",
        confirmText: "लॉगआउट",
        tone: "btn-bad",
      });
      if (!yes) return;
      UI.clearStudentSession();
      window.location.replace("index.html");
    });

    $("#printBtn").addEventListener("click", () => window.print());
    $("#refreshBtn").addEventListener("click", () => {
      if (state.resultId) loadResult(state.resultId);
      else loadList();
    });
    $("#listRefreshBtn").addEventListener("click", loadList);

    if (state.resultId) loadResult(state.resultId);
    else loadList();
  }

  init();
})();
