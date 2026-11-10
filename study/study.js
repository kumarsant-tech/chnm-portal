/* अध्ययन केंद्र — सभी अध्यायों की सूची, खोज और प्रगति */
(function () {
  var modules = window.STUDY_MODULES || [];
  var grid = document.getElementById("moduleGrid");
  var searchInput = document.getElementById("studySearch");
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var progressText = document.getElementById("progressText");
  var progressFill = document.getElementById("progressFill");
  var progressBar = document.getElementById("progressBar");
  var resumeBtn = document.getElementById("resumeBtn");
  var simCount = document.getElementById("simCount");
  if (!grid) return;

  var state = { filter: "all", query: "" };

  if (simCount) simCount.textContent = String(modules.reduce(function (total, m) {
    return total + (m.sim ? 1 : 0) + (Array.isArray(m.sims) ? m.sims.length : 0);
  }, 0));

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function matches(module, query) {
    if (!query) return true;
    var parts = [module.title, module.subtitle, module.tagline, module.intro]
      .concat(module.keywords || [])
      .concat((module.sections || []).map(function (section) { return section.h; }));
    return parts.join(" ").toLowerCase().indexOf(query) !== -1;
  }

  function quizLabel(progress, id) {
    var quiz = progress.quiz[id];
    if (!quiz) return "क्विज़ बाकी";
    return "क्विज़: " + quiz.score + "/" + quiz.total;
  }

  function buildCard(module, progress) {
    var isRead = Boolean(progress.read[module.id]);
    var card = document.createElement("article");
    card.className = "module-card" + (isRead ? " is-read" : "");

    var top = document.createElement("div");
    top.className = "module-card-top";
    var num = document.createElement("span");
    num.className = "module-num";
    num.textContent = pad(module.id);
    var badge = document.createElement("span");
    badge.className = "pill " + (isRead ? "good" : "");
    badge.textContent = isRead ? "पढ़ा हुआ" : "बाकी";
    top.appendChild(num);
    top.appendChild(badge);

    var heading = document.createElement("h3");
    var link = document.createElement("a");
    link.href = "chapter.html?m=" + module.id;
    link.textContent = module.title;
    heading.appendChild(link);

    var sub = document.createElement("p");
    sub.className = "module-sub";
    sub.textContent = module.subtitle;

    var tagline = document.createElement("p");
    tagline.className = "module-tagline";
    tagline.textContent = module.tagline;

    var meta = document.createElement("div");
    meta.className = "module-meta";
    var time = document.createElement("span");
    time.textContent = module.minutes + " मिनट";
    var sim = document.createElement("span");
    sim.textContent = "सिमुलेटर";
    var quiz = document.createElement("span");
    quiz.textContent = module.quiz ? module.quiz.length + " प्रश्न" : "क्विज़";
    meta.appendChild(time);
    meta.appendChild(sim);
    meta.appendChild(quiz);

    var foot = document.createElement("div");
    foot.className = "module-card-foot";
    var quizState = document.createElement("span");
    quizState.className = "quiz-state";
    quizState.textContent = quizLabel(progress, module.id);
    var action = document.createElement("a");
    action.className = "btn btn-sm " + (isRead ? "btn-soft" : "");
    action.href = "chapter.html?m=" + module.id;
    action.textContent = isRead ? "दोबारा पढ़ें" : "पढ़ें";
    foot.appendChild(quizState);
    foot.appendChild(action);

    card.appendChild(top);
    card.appendChild(heading);
    card.appendChild(sub);
    card.appendChild(tagline);
    card.appendChild(meta);
    card.appendChild(foot);
    return card;
  }

  function render() {
    var progress = window.FIStudy.load();
    grid.innerHTML = "";
    var query = state.query.trim().toLowerCase();
    var visible = modules.filter(function (module) {
      if (state.filter === "done" && !progress.read[module.id]) return false;
      if (state.filter === "pending" && progress.read[module.id]) return false;
      return matches(module, query);
    });

    if (!visible.length) {
      var empty = document.createElement("div");
      empty.className = "empty study-empty";
      empty.innerHTML = query
        ? "<strong>कोई अध्याय नहीं मिला</strong>कोई दूसरा शब्द खोजें या फ़िल्टर हटाएँ।"
        : "<strong>इस फ़िल्टर में कुछ नहीं है</strong>“सभी” चुनकर देखें।";
      grid.appendChild(empty);
      return;
    }

    visible.forEach(function (module) {
      grid.appendChild(buildCard(module, progress));
    });
  }

  function updateProgress() {
    var stats = window.FIStudy.stats();
    if (progressText) progressText.textContent = stats.read + " / " + stats.total + " अध्याय";
    var percent = stats.total ? Math.round((stats.read / stats.total) * 100) : 0;
    if (progressFill) progressFill.style.width = percent + "%";
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", String(stats.read));
      progressBar.setAttribute("aria-valuemax", String(stats.total));
    }
    if (resumeBtn) {
      var last = modules.filter(function (m) { return m.id === stats.last; })[0];
      if (last) {
        resumeBtn.href = "chapter.html?m=" + last.id;
        resumeBtn.textContent = "जहाँ से छोड़ा था: अध्याय " + pad(last.id);
      } else {
        resumeBtn.href = "chapter.html?m=1";
        resumeBtn.textContent = "पढ़ना शुरू करें";
      }
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.filter = chip.getAttribute("data-filter") || "all";
      chips.forEach(function (other) {
        other.setAttribute("aria-pressed", other === chip ? "true" : "false");
      });
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value || "";
      render();
    });
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      updateProgress();
      render();
    }
  });

  updateProgress();
  render();
})();
