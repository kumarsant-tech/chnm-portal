/* Shared result presentation for the student result page and admin result modal. */
(function () {
  "use strict";
  const UI = window.UI;
  const esc = UI.esc;

  function metric(label, value, tone) {
    return (
      '<div class="metric' +
      (tone ? " " + tone : "") +
      '"><small>' +
      esc(label) +
      "</small><b>" +
      esc(value) +
      "</b></div>"
    );
  }

  function answerCard(answer, index) {
    const correctIndex = Number(answer.correctIndex);
    const selected =
      answer.selected === null || answer.selected === undefined ? null : Number(answer.selected);
    const options = Array.isArray(answer.options) ? answer.options : [];
    const rows = options
      .map((option, optionIndex) => {
        let cls = "answer-opt";
        const tags = [];
        if (optionIndex === correctIndex) {
          cls += " correct";
          tags.push("सही उत्तर");
        }
        if (selected === optionIndex) {
          if (optionIndex !== correctIndex) cls += " wrong";
          tags.push("आपका उत्तर");
        }
        return (
          '<div class="' +
          cls +
          '"><b>' +
          esc(UI.optionLetter(optionIndex)) +
          ".</b><span>" +
          esc(option) +
          "</span>" +
          (tags.length ? '<span class="tag">' + esc(tags.join(" • ")) + "</span>" : "") +
          "</div>"
        );
      })
      .join("");
    const notice =
      selected === null
        ? '<span class="pill">उत्तर नहीं दिया</span>'
        : answer.correct
          ? '<span class="pill good">सही</span>'
          : '<span class="pill bad">गलत</span>';
    /* answer.marks प्रश्न के अधिकतम अंक हैं, मिले हुए नहीं — scoring.mjs के नियम से
       awarded निकालो: सही = +marks, गलत = −negativeMarks, छोड़ा = 0 */
    const maxMarks = Number(answer.marks) || 0;
    const negative = Number(answer.negativeMarks) || 0;
    const awarded =
      selected === null ? 0 : answer.correct ? maxMarks : -negative;
    const awardText =
      awarded > 0
        ? "+" + UI.trimNumber(awarded)
        : awarded < 0
          ? "−" + UI.trimNumber(Math.abs(awarded))
          : "0";
    const awardTone = awarded > 0 ? " good" : awarded < 0 ? " bad" : "";
    const awardTitle =
      "इस प्रश्न पर मिले अंक: " + awardText + " · अधिकतम " + UI.trimNumber(maxMarks) +
      (negative > 0 ? " · गलत पर −" + UI.trimNumber(negative) : " · कोई ऋणात्मक अंक नहीं");
    return (
      '<article class="answer-card"><div class="a-head"><div class="a-q"><span class="muted small">प्रश्न ' +
      (index + 1) +
      " </span><br>" +
      esc(answer.text || "") +
      "</div><div>" +
      notice +
      ' <span class="pill' + awardTone + '" title="' + UI.attr(awardTitle) + '">' +
      esc(awardText) +
      "</span></div></div>" +
      (answer.image
        ? '<img class="q-image" src="' + esc(answer.image) + '" alt="" loading="lazy">'
        : "") +
      '<div class="answer-opts">' +
      rows +
      "</div>" +
      (answer.explanation
        ? '<div class="answer-explanation"><b>व्याख्या:</b> ' + esc(answer.explanation) + "</div>"
        : "") +
      "</article>"
    );
  }

  function studyPlan(result) {
    const plan = Array.isArray(result.studyPlan) ? result.studyPlan : [];
    if (!plan.length) return "";
    const weak = plan.filter((item) => item.weak);
    const cards = plan
      .map((item) => {
        const pct = Math.max(0, Math.min(100, Number(item.percentage) || 0));
        const tone = pct >= 70 ? "good" : pct >= 40 ? "warn" : "bad";
        const advice =
          pct >= 70
            ? "अच्छा प्रदर्शन — थोड़ा दोहराव काफ़ी है।"
            : pct >= 40
              ? "इस विषय को एक बार फिर पढ़ें और प्रश्न अभ्यास करें।"
              : "इस विषय पर सबसे पहले ध्यान दें — नोट्स से शुरुआत करें।";
        return (
          '<article class="study-card ' +
          tone +
          '"><div class="study-card-head"><b>' +
          esc(item.subjectName) +
          '</b><span class="pill ' +
          (tone === "good" ? "good" : tone === "warn" ? "warn" : "bad") +
          '">' +
          esc(UI.trimNumber(pct)) +
          "%</span></div>" +
          '<div class="study-bar"><i style="width:' +
          pct +
          '%"></i></div>' +
          '<small>सही ' +
          esc(item.correct) +
          " / " +
          esc(item.total) +
          (item.wrong ? " • गलत " + esc(item.wrong) : "") +
          (item.unattempted ? " • छूटे " + esc(item.unattempted) : "") +
          "</small><p>" +
          esc(advice) +
          "</p>" +
          (item.studyHref
            ? '<a class="btn btn-sm btn-soft" href="' + esc(item.studyHref) + '">ट्रेड थ्योरी पढ़ें</a>'
            : '<span class="tiny muted">इस विषय के नोट्स अपने इंस्ट्रक्टर से लें।</span>') +
          "</article>"
        );
      })
      .join("");
    return (
      '<section class="study-plan"><div class="panel-head"><div><h2>📚 ये पढ़ें आप</h2><p>' +
      (weak.length
        ? "इन विषयों पर अगली बार बेहतर करने के लिए यह रहा आपका अध्ययन प्लान।"
        : "शाबाश! सभी विषयों में आपका प्रदर्शन अच्छा रहा — दोहराव जारी रखें।") +
      "</p></div></div>" +
      (weak.length
        ? '<div class="study-focus"><b>सबसे पहले पढ़ें:</b> ' +
          esc(weak.map((item) => item.subjectName).join(" , ")) +
          "</div>"
        : "") +
      '<div class="study-grid">' +
      cards +
      "</div></section>"
    );
  }

  function html(result, options) {
    if (!result) return "";
    const opts = options || {};
    const pending = result.pending === true || result.percentage === null || result.percentage === undefined;
    const percentage = pending ? 0 : Number(result.percentage) || 0;
    const name = opts.studentName || result.studentName || "छात्र";
    const photo = opts.studentPhoto || "";
    const subject = result.subjectName || "";
    const typeLabel = UI.examTypeLabel(result.examType);
    const meta = [
      result.regId || result.studentId || "",
      subject,
      typeLabel,
      result.submittedAt ? UI.fmtDateTime(result.submittedAt) : "",
    ].filter(Boolean);

    const scoreRing = pending
      ? '<span class="pill warn">परिणाम प्रतीक्षित</span>'
      : '<div class="score-ring" style="--pct:' +
        Math.max(0, Math.min(100, percentage)) +
        '"><div><b>' +
        esc(UI.trimNumber(percentage)) +
        '%</b><small>प्रतिशत</small></div></div>';

    const metrics = pending
      ? ""
      : '<div class="metric-grid">' +
        metric("प्राप्तांक", UI.trimNumber(result.obtained) + " / " + UI.trimNumber(result.maxMarks)) +
        metric("सही उत्तर", result.correct, "good") +
        metric("गलत उत्तर", result.wrong, "bad") +
        metric("हल किए", result.attempted + " / " + result.totalQuestions) +
        metric("छूटे प्रश्न", result.unattempted) +
        metric("समय", UI.fmtClock(result.timeTakenSec || 0)) +
        (result.autoSubmitted ? metric("स्वतः सबमिट", "हाँ", "bad") : "") +
        "</div>";

    const answers = Array.isArray(result.answers) ? result.answers : null;
    const review = answers && answers.length
      ? '<section class="answer-review"><div class="panel-head"><div><h2>उत्तर समीक्षा</h2><p>हर प्रश्न का सही उत्तर और आपका चुना हुआ उत्तर नीचे देखें।</p></div></div>' +
        answers.map(answerCard).join("") +
        "</section>"
      : opts.answersNote
        ? '<div class="notice info">' + esc(opts.answersNote) + "</div>"
        : "";

    return (
      '<div class="scorecard"><div class="score-top"><div class="score-who">' +
      UI.avatar(photo, name) +
      "<div><h1>" +
      esc(name) +
      "</h1><p>" +
      esc(result.examTitle || "") +
      (result.examCode ? " • " + esc(result.examCode) : "") +
      "</p></div></div>" +
      scoreRing +
      '</div><div class="score-meta"><span>' +
      esc(meta.join(" • ")) +
      "</span>" +
      (!pending ? "<span>" + UI.passPill(result.pass) + "</span>" : "") +
      (opts.extraMeta ? "<span>" + esc(opts.extraMeta) + "</span>" : "") +
      "</div></div>" +
      metrics +
      (pending
        ? '<div class="notice warn" style="margin-top:16px">आपका पेपर सुरक्षित जमा हो गया है। एडमिन द्वारा परिणाम जारी करने के बाद अंक और उत्तर-कुंजी यहाँ दिखेंगे।</div>'
        : "") +
      (pending ? "" : studyPlan(result)) +
      review +
      '<div class="notice small" style="margin-top:16px"><b>Result ID:</b> ' +
      esc(result.resultId || "—") +
      " &nbsp;•&nbsp; <b>Attempt ID:</b> " +
      esc(result.attemptId || "—") +
      (result.autoSubmitted ? " &nbsp;•&nbsp; समय समाप्त होने पर स्वतः सबमिट" : "") +
      "</div>"
    );
  }

  window.ResultView = { html: html };
})();
