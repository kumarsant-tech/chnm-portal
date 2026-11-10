/* Trade Theory · विषय-वार सूची — थीम, खोज और सीधे सेक्शन लिंक */
(function () {
  "use strict";

  var modules = window.TRADE_MODULES || [];
  var themes = window.TRADE_THEMES || [];
  var listEl = document.getElementById("topicList");
  var searchInput = document.getElementById("topicSearch");
  var chipsEl = document.getElementById("themeChips");
  var resultText = document.getElementById("resultText");
  var topicTotal = document.getElementById("topicTotal");
  var chapterTotal = document.getElementById("chapterTotal");
  var diagramTotal = document.getElementById("diagramTotal");
  var liveTotal = document.getElementById("liveTotal");
  if (!listEl) return;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function simsOf(module) {
    var list = [];
    if (module.sim) list.push(module.sim);
    if (Array.isArray(module.sims)) list = list.concat(module.sims);
    return list;
  }

  function liveOf(module) {
    return simsOf(module).filter(function (sim) { return sim.type === "live"; });
  }

  function tableText(table) {
    if (!table || !table.rows) return "";
    return table.rows.map(function (row) { return row.join(" "); }).join(" ");
  }

  function sectionText(section) {
    return [section.h]
      .concat(section.p || [])
      .concat(section.list || [])
      .concat(section.note ? [section.note] : [])
      .concat(section.exam ? [section.exam] : [])
      .concat((section.steps || []).map(function (step) { return (step.t || step) + " " + (step.d || ""); }))
      .concat((section.terms || []).map(function (term) { return term.t + " " + term.d; }))
      .concat(section.table ? [tableText(section.table)] : [])
      .concat((section.tables || []).map(tableText))
      .join(" ")
      .toLowerCase();
  }

  var topics = [];
  modules.forEach(function (module) {
    (module.sections || []).forEach(function (section, index) {
      topics.push({
        module: module,
        section: section,
        index: index,
        text: sectionText(section)
      });
    });
  });

  var totalDiagrams = modules.reduce(function (total, module) {
    return total + (Array.isArray(module.diagrams) ? module.diagrams.length : 0);
  }, 0);
  var totalLives = modules.reduce(function (total, module) {
    return total + liveOf(module).length;
  }, 0);

  if (topicTotal) topicTotal.textContent = String(topics.length);
  if (chapterTotal) chapterTotal.textContent = String(modules.length);
  if (diagramTotal) diagramTotal.textContent = String(totalDiagrams);
  if (liveTotal) liveTotal.textContent = String(totalLives);

  var params = new URLSearchParams(window.location.search);
  var requestedTheme = params.get("theme");
  var state = {
    theme: themes.some(function (theme) { return theme.id === requestedTheme; }) ? requestedTheme : "all",
    query: ""
  };

  function themeOf(module) {
    return themes.filter(function (theme) { return theme.id === module.theme; })[0];
  }

  function countTopics(themeId) {
    return topics.filter(function (topic) {
      return themeId === "all" || topic.module.theme === themeId;
    }).length;
  }

  function renderChips() {
    if (!chipsEl) return;
    var all = [{ id: "all", label: "सभी विषय" }].concat(themes);
    chipsEl.innerHTML = all.map(function (theme) {
      return '<button class="chip' + (state.theme === theme.id ? " is-on" : "") + '" type="button" data-theme="' +
        theme.id + '" aria-pressed="' + (state.theme === theme.id ? "true" : "false") + '">' +
        (theme.icon ? '<span aria-hidden="true">' + theme.icon + "</span> " : "") + esc(theme.label) +
        " <small>" + countTopics(theme.id) + "</small></button>";
    }).join("");
  }

  function matches(topic) {
    var query = state.query.trim().toLowerCase();
    if (!query) return state.theme === "all" || topic.module.theme === state.theme;
    var haystack = [topic.module.title, topic.module.subtitle, topic.module.code, topic.section.h, topic.text]
      .join(" ").toLowerCase();
    return query.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
  }

  function topicRow(topic) {
    var module = topic.module;
    var section = topic.section;
    var kind = section.steps ? section.steps.length + " चरण"
      : section.table || section.tables ? "तालिका"
      : section.formula ? "सूत्र"
      : section.terms ? "शब्दावली"
      : "व्याख्या";
    return '<a class="topic-row" href="chapter.html?m=' + module.id + "#sec-" + (topic.index + 1) + '">' +
      '<span class="topic-no">' + pad(module.id) + "." + pad(topic.index + 1) + "</span>" +
      '<span class="topic-name">' + esc(section.h) + "</span>" +
      '<span class="topic-kind">' + esc(kind) + "</span>" +
      '<span class="topic-go" aria-hidden="true">→</span>' +
      "</a>";
  }

  function chapterBlock(module, group) {
    var links = "";
    if (module.diagrams && module.diagrams.length) {
      links += '<a href="chapter.html?m=' + module.id + '#diagrams">' + module.diagrams.length + " चित्र</a>";
    }
    var lives = liveOf(module).length;
    if (lives) links += '<a href="chapter.html?m=' + module.id + '#labs">' + lives + " लाइव लैब</a>";
    if (module.quiz && module.quiz.length) {
      links += '<a href="chapter.html?m=' + module.id + '#quizMount">' + module.quiz.length + " प्रश्न</a>";
    }
    return '<article class="topic-chapter">' +
      '<header class="topic-chapter-head">' +
        '<a class="topic-chapter-title" href="chapter.html?m=' + module.id + '">' +
          '<span class="topic-chapter-num">' + pad(module.id) + "</span>" +
          "<span><b>" + esc(module.title) + "</b><small>" + esc(module.subtitle) + "</small></span>" +
        "</a>" +
        '<div class="topic-chapter-links">' + links + "</div>" +
      "</header>" +
      '<div class="topic-rows">' + group.map(topicRow).join("") + "</div>" +
      "</article>";
  }

  function render() {
    var visible = topics.filter(matches);
    listEl.innerHTML = "";

    if (resultText) {
      var chapters = {};
      visible.forEach(function (topic) { chapters[topic.module.id] = true; });
      var chapterCount = Object.keys(chapters).length;
      resultText.textContent = state.query
        ? "‘" + state.query + "’ के लिए " + visible.length + " विषय · " + chapterCount + " अध्याय"
        : visible.length + " विषय · " + chapterCount + " अध्याय";
    }

    if (!visible.length) {
      listEl.innerHTML = '<div class="empty study-empty"><strong>कोई विषय नहीं मिला</strong>' +
        "दूसरा शब्द खोजें या थीम बदलकर देखें।</div>";
      return;
    }

    var html = "";
    var knownTheme = {};
    themes.forEach(function (theme) {
      var inTheme = visible.filter(function (topic) { return topic.module.theme === theme.id; });
      if (!inTheme.length) return;
      knownTheme[theme.id] = true;
      var modulesHere = modules.filter(function (module) {
        return module.theme === theme.id && inTheme.some(function (topic) { return topic.module.id === module.id; });
      });
      html += '<section class="topic-theme" aria-labelledby="theme-' + theme.id + '">' +
        '<div class="topic-theme-head">' +
          '<span class="theme-ico" aria-hidden="true">' + theme.icon + "</span>" +
          '<div><h2 id="theme-' + theme.id + '">' + esc(theme.label) + "</h2>" +
          "<p>" + inTheme.length + " विषय · " + modulesHere.length + " अध्याय</p></div>" +
        "</div>" +
        modulesHere.map(function (module) {
          return chapterBlock(module, inTheme.filter(function (topic) { return topic.module.id === module.id; }));
        }).join("") +
        "</section>";
    });

    var other = visible.filter(function (topic) { return !knownTheme[topic.module.theme]; });
    if (other.length) {
      html += '<section class="topic-theme"><div class="topic-theme-head"><div><h2>अन्य विषय</h2></div></div>' +
        other.map(topicRow).join("") + "</section>";
    }

    listEl.innerHTML = html;
  }

  if (chipsEl) {
    chipsEl.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-theme]");
      if (!chip) return;
      state.theme = chip.getAttribute("data-theme") || "all";
      renderChips();
      render();
      var url = state.theme === "all" ? "topics.html" : "topics.html?theme=" + state.theme;
      if (window.history && window.history.replaceState) window.history.replaceState(null, "", url);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value || "";
      render();
    });
  }

  renderChips();
  render();
})();
