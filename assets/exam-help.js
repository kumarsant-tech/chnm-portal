/* exam-help.js — परीक्षा पेज को आसान बनाने वाली जोड़-परत (exam pages only).
   कोई API action, localStorage key, timer या scoring को छूता नहीं —
   केवल मौजूदा बटनों/पैलेट पर क्लिक भेजकर काम करता है। */
(function () {
  "use strict";

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function el(id) {
    return document.getElementById(id);
  }

  var ORDER = ["answered", "not-answered", "not-visited", "marked"];

  /* ---------- CBT: गिनती टाइल से उसी स्थिति के प्रश्न पर जाएँ ---------- */
  function setupCbtHelpers() {
    var palette = el("palette");
    var stats = document.querySelector(".cand-stats");
    if (!palette || !stats) return;

    ORDER.forEach(function (key) {
      var tile = stats.querySelector(".stat." + key);
      if (!tile || tile.dataset.fiJump) return;
      tile.dataset.fiJump = "1";
      tile.setAttribute("role", "button");
      tile.tabIndex = 0;
      tile.title = "इसी स्थिति का अगला प्रश्न खोलें / open next question of this kind";
      tile.addEventListener("click", function () {
        jumpToStatus(key);
      });
      tile.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          jumpToStatus(key);
        }
      });
    });

    function jumpToStatus(key) {
      var btns = Array.prototype.slice.call(palette.querySelectorAll(".pal-btn:not([hidden])"));
      if (!btns.length) return;
      var from = btns.findIndex(function (b) {
        return b.classList.contains("current");
      });
      for (var step = 1; step <= btns.length; step++) {
        var idx = (from + step) % btns.length;
        var b = btns[idx];
        if (b.classList.contains(key) && !b.classList.contains("current")) {
          b.click();
          if (typeof navigator.vibrate === "function") navigator.vibrate(8);
          return;
        }
      }
      /* आगे कहीं नहीं मिला — पहला मेल खाता प्रश्न खोलें */
      var first = btns.filter(function (x) { return x.classList.contains(key); })[0];
      if (first) first.click();
    }
  }

  /* ---------- CBT: अतिरिक्त कीबोर्ड शॉर्टकट (कोई दृश्य तत्व नहीं) ---------- */
  function setupShortcuts() {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (document.body.classList.contains("modal-open")) return;
      var testView = el("cbtView");
      if (!testView || testView.hidden) return;
      var tag = (event.target && event.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      var k = String(event.key).toLowerCase();
      var map = { s: "saveNextBtn", m: "markBtn", c: "clearBtn" };
      if (map[k]) {
        var b = el(map[k]);
        if (b && !b.disabled) {
          event.preventDefault();
          b.click();
        }
      } else if (event.key === "Escape") {
        var side = el("sidePanel");
        if (side && side.classList.contains("open")) {
          var closeBtn = el("paletteClose");
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }

  onReady(function () {
    try {
      if (document.body.getAttribute("data-page") === "test") {
        setupCbtHelpers();
        setupShortcuts();
      }
    } catch (e) {
      /* जोड़-परत कभी पेज न तोड़े */
      if (window.console) console.warn("exam-help:", e && e.message);
    }
  });
})();
