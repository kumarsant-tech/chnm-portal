/* FI MODERN UI · प्रगति पट्टी, ऊपर जाएँ बटन, हल्का reveal */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    try {
      var bar = document.createElement("div");
      bar.id = "fi-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);

      var top = document.createElement("button");
      top.id = "fi-top";
      top.type = "button";
      top.setAttribute("aria-label", "ऊपर जाएँ");
      top.textContent = "↑";
      document.body.appendChild(top);

      var raf = 0;
      function update() {
        raf = 0;
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        var pct = max > 40 ? (doc.scrollTop || document.body.scrollTop) / max : 0;
        bar.style.width = Math.min(100, Math.max(0, pct * 100)) + "%";
        top.classList.toggle("show", (doc.scrollTop || 0) > 600);
      }
      function onScroll() {
        if (!raf) raf = requestAnimationFrame(update);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
      update();

      if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("fi-in");
              io.unobserve(entry.target);
            }
          });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
        // केवल बड़े ब्लॉक कंटेंर — मौजूद लेआउट/सिमुलेटर को छुआ नहीं गया
        Array.prototype.slice.call(document.querySelectorAll(".card, .panel, .cits-card, .m-card, .v5-box")).slice(0, 60).forEach(function (node) {
          node.classList.add("fi-reveal");
          io.observe(node);
        });
      }

      document.querySelectorAll('a[href^="http"]').forEach(function (a) {
        if (a.target === "_blank" && !/noopener/.test(a.rel || "")) a.rel = (a.rel + " noopener").trim();
      });
    } catch (error) {
      /* सजावट है — मुख्य पेज कभी न टूटे */
    }
  });
})();
