/* अध्ययन प्रगति — केवल इस ब्राउज़र में सुरक्षित (localStorage). */
(function () {
  var KEY = "fiStudyProgressV1";

  function defaults() {
    return { read: {}, quiz: {}, sims: {}, last: null };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return defaults();
      return {
        read: data.read && typeof data.read === "object" ? data.read : {},
        quiz: data.quiz && typeof data.quiz === "object" ? data.quiz : {},
        sims: data.sims && typeof data.sims === "object" ? data.sims : {},
        last: typeof data.last === "number" ? data.last : null
      };
    } catch (error) {
      return defaults();
    }
  }

  function save(progress) {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch (error) {
      /* private mode / quota — progress will not persist */
    }
  }

  function markRead(id) {
    var p = load();
    p.read[id] = true;
    p.last = id;
    save(p);
    return p;
  }

  function unmarkRead(id) {
    var p = load();
    delete p.read[id];
    save(p);
    return p;
  }

  function markLast(id) {
    var p = load();
    p.last = id;
    save(p);
  }

  function saveQuiz(id, score, total) {
    var p = load();
    p.quiz[id] = { score: score, total: total, at: Date.now() };
    p.last = id;
    save(p);
    return p;
  }

  function markSim(id) {
    var p = load();
    p.sims[id] = true;
    p.last = id;
    save(p);
    return p;
  }

  function stats() {
    var modules = window.STUDY_MODULES || [];
    var p = load();
    var read = 0;
    var sims = 0;
    var quizDone = 0;
    var earned = 0;
    var possible = 0;
    modules.forEach(function (m) {
      if (p.read[m.id]) read += 1;
      if (p.sims[m.id]) sims += 1;
      var q = p.quiz[m.id];
      if (q && q.total) {
        quizDone += 1;
        earned += Number(q.score) || 0;
        possible += Number(q.total) || 0;
      }
    });
    return {
      total: modules.length,
      read: read,
      sims: sims,
      quizDone: quizDone,
      quizPercent: possible ? Math.round((earned / possible) * 100) : 0,
      last: p.last
    };
  }

  window.FIStudy = {
    load: load,
    save: save,
    markRead: markRead,
    unmarkRead: unmarkRead,
    markLast: markLast,
    saveQuiz: saveQuiz,
    markSim: markSim,
    stats: stats
  };
})();
