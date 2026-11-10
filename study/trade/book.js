/* Trade Theory केंद्र — 25 अध्यायों की सूची, खोज और प्रगति */
(function () {
  var modules = window.TRADE_MODULES || [];
  var grid = document.getElementById("moduleGrid");
  var searchInput = document.getElementById("studySearch");
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var progressText = document.getElementById("progressText");
  var progressFill = document.getElementById("progressFill");
  var progressBar = document.getElementById("progressBar");
  var resumeBtn = document.getElementById("resumeBtn");
  var simCount = document.getElementById("simCount");
  var quizCount = document.getElementById("quizCount");
  var chapterCount = document.getElementById("chapterCount");
  var topicCount = document.getElementById("topicCount");
  var liveCount = document.getElementById("liveCount");
  var diagramCount = document.getElementById("diagramCount");
  var themeGrid = document.getElementById("themeGrid");
  if (!grid) return;

  var themes = window.TRADE_THEMES || [];
  var state = { filter: "all", query: "" };

  function countSims(module) {
    var list = [];
    if (module.sim) list.push(module.sim);
    if (Array.isArray(module.sims)) list = list.concat(module.sims);
    return list;
  }

  var totalSims = modules.reduce(function (total, m) { return total + countSims(m).length; }, 0);
  var totalQuiz = modules.reduce(function (total, m) {
    return total + (Array.isArray(m.quiz) ? m.quiz.length : 0);
  }, 0);
  var totalTopics = modules.reduce(function (total, m) {
    return total + (Array.isArray(m.sections) ? m.sections.length : 0);
  }, 0);
  var totalLive = modules.reduce(function (total, m) {
    return total + countSims(m).filter(function (sim) { return sim.type === "live"; }).length;
  }, 0);
  var totalDiagrams = modules.reduce(function (total, m) {
    return total + (Array.isArray(m.diagrams) ? m.diagrams.length : 0);
  }, 0);

  if (simCount) simCount.textContent = String(totalSims);
  if (quizCount) quizCount.textContent = String(totalQuiz);
  if (chapterCount) chapterCount.textContent = String(modules.length);
  if (topicCount) topicCount.textContent = String(totalTopics);
  if (liveCount) liveCount.textContent = String(totalLive);
  if (diagramCount) diagramCount.textContent = String(totalDiagrams);

  function themeOf(module) {
    return themes.filter(function (theme) { return theme.id === module.theme; })[0];
  }

  function renderThemes() {
    if (!themeGrid) return;
    themeGrid.innerHTML = themes.map(function (theme) {
      var list = modules.filter(function (module) { return module.theme === theme.id; });
      var topics = list.reduce(function (total, module) { return total + (module.sections || []).length; }, 0);
      return '<a class="theme-card" href="topics.html?theme=' + theme.id + '">' +
        '<span class="theme-ico" aria-hidden="true">' + theme.icon + "</span>" +
        "<b>" + theme.label + "</b>" +
        "<span>" + list.length + " अध्याय · " + topics + " विषय</span>" +
        '<small>अध्याय ' + list.map(function (module) { return module.id; }).join(", ") + "</small>" +
        "</a>";
    }).join("");
  }

  renderThemes();

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function matches(module, query) {
    if (!query) return true;
    var text = [module.code, module.title, module.subtitle, module.tagline, module.intro]
      .concat(module.keywords || [])
      .concat((module.sections || []).map(function (section) {
        return [section.h, (section.p || []).join(" "), (section.list || []).join(" ")].join(" ");
      }));
    return text.join(" ").toLowerCase().indexOf(query) !== -1;
  }

  function quizLabel(progress, id) {
    var quiz = progress.quiz[id];
    if (!quiz) return "क्विज़ बाकी";
    return "क्विज़: " + quiz.score + "/" + quiz.total;
  }

  function buildCard(module, progress) {
    var isRead = Boolean(progress.read[module.id]);
    var card = document.createElement("article");
    card.className = "module-card" + (isRead ? " is-read" : "") + (module.theme ? " theme-" + module.theme : "");

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

    var theme = themeOf(module);
    if (theme) {
      var themeTag = document.createElement("p");
      themeTag.className = "module-theme";
      themeTag.textContent = theme.icon + " " + theme.label;
      card.appendChild(themeTag);
    }

    var meta = document.createElement("div");
    meta.className = "module-meta";
    var time = document.createElement("span");
    time.textContent = module.minutes + " मिनट";
    var sim = document.createElement("span");
    var simsHere = countSims(module).length;
    sim.textContent = simsHere + " सिमुलेटर";
    var quiz = document.createElement("span");
    quiz.textContent = module.quiz ? module.quiz.length + " प्रश्न" : "क्विज़";
    meta.appendChild(time);
    meta.appendChild(sim);
    var liveHere = countSims(module).filter(function (item) { return item.type === "live"; }).length;
    if (liveHere) {
      var liveTag = document.createElement("span");
      liveTag.className = "module-live";
      liveTag.textContent = liveHere + " लाइव";
      meta.appendChild(liveTag);
    }
    if (module.diagrams && module.diagrams.length) {
      var diagTag = document.createElement("span");
      diagTag.className = "module-diagram";
      diagTag.textContent = module.diagrams.length + " चित्र";
      meta.appendChild(diagTag);
    }
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
    var progress = window.FITrade.load();
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
    var stats = window.FITrade.stats();
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
