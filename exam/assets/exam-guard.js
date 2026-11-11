/* Browser signals are audit hints only; exam timing and submission remain server-authoritative. */
(function () {
  "use strict";

  const EVENTS = new Set([
    "visibility_hidden",
    "fullscreen_exit",
    "fullscreen_enter_failed",
  ]);

  async function report(event, examId, token) {
    if (!EVENTS.has(event) || !examId || !token) return;
    return window.UI.call("student_exam_event", { examId: examId, event: event }, token);
  }

  window.ExamGuard = { report: report };
})();
