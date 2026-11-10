(function () {
  "use strict";

  function start() {
    var home = document.getElementById("home");
    var title = document.getElementById("hnFestivalTitle");
    var titleHindi = document.getElementById("hnFestivalTitleHi");
    var wish = document.getElementById("hnFestivalWish");
    var icon = document.getElementById("hnFestivalIcon");
    var copy = home && home.querySelector(".hn-festival-copy");
    var greetings = [
      {
        id: "diwali",
        en: "Diwali",
        hi: "शुभ दीपावली",
        icon: "🪔",
        wishHi: "दीपों का प्रकाश आपके जीवन में खुशियाँ और नई उम्मीदें लाए।",
        wishEn: "May the light of Diwali bring happiness and new hope to your life."
      },
      {
        id: "new-year",
        en: "New Year",
        hi: "नववर्ष की हार्दिक शुभकामनाएँ",
        icon: "🎆",
        wishHi: "नया साल आपके लिए नई सीख, सफलता और खुशियाँ लेकर आए।",
        wishEn: "May the New Year bring you fresh learning, success, and happiness."
      },
      {
        id: "holi",
        en: "Holi",
        hi: "होली की हार्दिक शुभकामनाएँ",
        icon: "🎨",
        wishHi: "रंगों का यह त्योहार आपके जीवन में उमंग और खुशियाँ भर दे।",
        wishEn: "May this festival of colors fill your life with joy and cheer."
      },
      {
        id: "basant",
        en: "Basant Panchami",
        hi: "वसंत पंचमी की शुभकामनाएँ",
        icon: "🌼",
        wishHi: "माँ सरस्वती की कृपा से ज्ञान और नई शुरुआत का प्रकाश फैले।",
        wishEn: "May Saraswati's blessings bring knowledge and bright new beginnings."
      },
      {
        id: "christmas",
        en: "Christmas",
        hi: "क्रिसमस की हार्दिक शुभकामनाएँ",
        icon: "🎄",
        wishHi: "क्रिसमस आपके घर में प्रेम, शांति और खुशियाँ लेकर आए।",
        wishEn: "May Christmas bring love, peace, and happiness to your home."
      }
    ];
    var greetingIndex = 0;

    var stage = document.getElementById("hnFestival");
    var canvas = document.getElementById("hnFireworks");
    var toggle = document.getElementById("hnMotionToggle");
    var legacyContent = document.getElementById("student-mode");
    var syncFestival = function () {};
    var welcomeBand = document.querySelector('.v7-band[aria-label="स्वागत / Welcome"]');
    if (welcomeBand && stage) home.insertBefore(welcomeBand, stage);
    var galleryDescription = document.querySelector(".v8-gal + p");
    if (galleryDescription) galleryDescription.remove();

    function syncHomePanel(id) {
      var isHome = id === "home";
      if (legacyContent) legacyContent.classList.toggle("pv-hide", isHome);
      var dock = document.getElementById("bx-dock");
      if (dock) dock.classList.toggle("hide", isHome);
      var leads = document.getElementById("bx-leads");
      if (leads) leads.style.display = isHome ? "none" : "";
    }

    syncHomePanel(window.__panels ? window.__panels.current() : ((location.hash || "#home").slice(1)));
    document.addEventListener("smps-panel", function (event) {
      syncHomePanel(event.detail);
    });

    function showGreeting(greeting) {
      if (!title || !titleHindi || !wish || !icon) return;
      if (copy) copy.classList.add("is-changing");
      window.setTimeout(function () {
        title.querySelector("strong").textContent = greeting.en;
        titleHindi.textContent = greeting.hi;
        title.setAttribute("aria-label", "Happy " + greeting.en + " — " + greeting.hi);
        icon.textContent = greeting.icon;
        wish.querySelector('[data-lang="hi"]').textContent = greeting.wishHi;
        wish.querySelector('[data-lang="en"]').textContent = greeting.wishEn;
        if (stage) stage.dataset.festival = greeting.id;
        if (window.__applyLang) window.__applyLang(home);
        if (copy) copy.classList.remove("is-changing");
        syncFestival();
      }, 180);
    }

    if (title && titleHindi && wish && icon) {
      window.setInterval(function () {
        if (document.hidden) return;
        greetingIndex = (greetingIndex + 1) % greetings.length;
        showGreeting(greetings[greetingIndex]);
      }, 10000);
    }

    if (!home || !stage || !canvas || !canvas.getContext) return;

    var context = canvas.getContext("2d", { alpha: true });
    var width = 0;
    var height = 0;
    var ratio = 1;
    var rockets = [];
    var particles = [];
    var stars = [];
    var seasonalParticles = [];
    var frameId = 0;
    var lastTime = 0;
    var launchClock = [120, 520];
    var visible = true;
    var userPaused = false;
    var reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var colors = ["#ffd45c", "#ff8a38", "#f04493", "#5de4d0", "#4f8cff", "#fff5d6"];
    try { userPaused = localStorage.getItem("chnm-festival-motion") === "off"; } catch (error) {}

    function motionAllowed() {
      return !userPaused && !reducedQuery.matches && !document.documentElement.classList.contains("hm-no-motion");
    }

    function random(min, max) { return min + Math.random() * (max - min); }
    function festival() { return stage.dataset.festival || "diwali"; }
    function usesFireworks() { return festival() === "diwali" || festival() === "new-year"; }

    function makeSeasonalParticles() {
      var mode = festival();
      var count = Math.min(110, Math.max(34, Math.round(width / 9)));
      seasonalParticles = [];
      if (mode === "holi" || mode === "basant" || mode === "christmas") {
        for (var i = 0; i < count; i += 1) {
          seasonalParticles.push({
            x: random(0, width),
            y: random(0, height),
            size: mode === "holi" ? random(8, 24) : random(2, mode === "basant" ? 9 : 4),
            speed: random(0.25, mode === "christmas" ? 1.15 : 0.8),
            drift: random(-0.45, 0.45),
            phase: random(0, Math.PI * 2),
            rotation: random(0, Math.PI * 2),
            spin: random(-0.012, 0.012),
            color: colors[(Math.random() * colors.length) | 0]
          });
        }
      }
    }

    function resize() {
      var rect = stage.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      width = rect.width;
      height = rect.height;
      ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      makeSeasonalParticles();
      stars = [];
      var count = Math.min(70, Math.round(width / 15));
      for (var i = 0; i < count; i += 1) {
        stars.push({ x: random(0, width), y: random(8, height * 0.82), r: random(0.35, 1.25), a: random(0.18, 0.7), p: random(0, Math.PI * 2) });
      }
      drawStill();
    }

    function clear() {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
    }

    function paintStars(time) {
      if (festival() !== "diwali" && festival() !== "new-year" && festival() !== "christmas") return;
      context.save();
      context.fillStyle = festival() === "christmas" ? "#dff7ff" : "#fff5d6";
      for (var i = 0; i < stars.length; i += 1) {
        var star = stars[i];
        context.globalAlpha = star.a * (0.72 + Math.sin(time * 0.0015 + star.p) * 0.28);
        context.beginPath();
        context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    function burst(x, y, color, amount) {
      var speed = Math.max(1.35, Math.min(width, height) * 0.0085);
      var second = colors[(Math.random() * colors.length) | 0];
      for (var i = 0; i < amount; i += 1) {
        var angle = Math.PI * 2 * i / amount + random(-0.035, 0.035);
        var velocity = speed * random(0.55, 1.2);
        particles.push({
          x: x, y: y, px: x, py: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1, decay: random(0.009, 0.017),
          color: Math.random() < 0.76 ? color : second,
          size: random(0.8, 1.9)
        });
      }
      if (particles.length > 620) particles.splice(0, particles.length - 620);
    }

    function launch(side) {
      var left = side === 0;
      var x = width * (left ? random(0.055, 0.245) : random(0.755, 0.945));
      rockets.push({
        x: x, y: height + 5, px: x, py: height + 5,
        vx: random(-0.22, 0.22),
        vy: -random(height * 0.010, height * 0.014),
        target: height * random(0.16, 0.48),
        color: colors[(Math.random() * colors.length) | 0]
      });
    }

    function drawRocket(rocket) {
      context.strokeStyle = rocket.color;
      context.lineWidth = 1.5;
      context.globalAlpha = 0.9;
      context.beginPath();
      context.moveTo(rocket.px, rocket.py);
      context.lineTo(rocket.x, rocket.y);
      context.stroke();
      context.fillStyle = "#fff5d6";
      context.beginPath();
      context.arc(rocket.x, rocket.y, 1.7, 0, Math.PI * 2);
      context.fill();
    }

    function drawParticle(particle) {
      context.globalAlpha = Math.max(0, particle.life);
      context.strokeStyle = particle.color;
      context.lineWidth = particle.size;
      context.beginPath();
      context.moveTo(particle.px, particle.py);
      context.lineTo(particle.x, particle.y);
      context.stroke();
    }

    function drawStill() {
      if (!width || !height) return;
      clear();
      var mode = festival();
      if (mode === "holi" || mode === "basant" || mode === "christmas") {
        context.save();
        for (var i = 0; i < seasonalParticles.length; i += 1) {
          var particle = seasonalParticles[i];
          context.globalAlpha = mode === "holi" ? 0.16 : (mode === "basant" ? 0.7 : 0.82);
          context.fillStyle = mode === "christmas" ? "#e5f8ff" : particle.color;
          if (mode === "basant") {
            context.translate(particle.x, particle.y);
            context.rotate(particle.rotation);
            context.beginPath();
            context.ellipse(0, 0, particle.size * 0.48, particle.size, 0, 0, Math.PI * 2);
            context.fill();
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
          } else {
            context.beginPath();
            context.arc(particle.x, particle.y, mode === "holi" ? particle.size : particle.size * 0.6, 0, Math.PI * 2);
            context.fill();
          }
        }
        context.restore();
        return;
      }
      paintStars(900);
      context.save();
      context.globalCompositeOperation = "lighter";
      var points = mode === "new-year"
        ? [[0.18, 0.32], [0.82, 0.27], [0.34, 0.58], [0.68, 0.55]]
        : [[0.14, 0.31], [0.86, 0.29], [0.21, 0.62], [0.79, 0.61]];
      points.forEach(function (point, index) {
        var x = width * point[0];
        var y = height * point[1];
        var radius = Math.min(width, height) * (index < 2 ? 0.105 : 0.07);
        context.strokeStyle = colors[index];
        context.fillStyle = colors[index];
        context.lineWidth = 1.25;
        for (var ray = 0; ray < 22; ray += 1) {
          var angle = Math.PI * 2 * ray / 22;
          var inner = radius * 0.34;
          var outer = radius * (ray % 2 ? 0.82 : 1);
          context.globalAlpha = 0.62;
          context.beginPath();
          context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
          context.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
          context.stroke();
          context.globalAlpha = 0.9;
          context.beginPath();
          context.arc(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer, 1.35, 0, Math.PI * 2);
          context.fill();
        }
      });
      context.restore();
    }

    function updateButton() {
      if (!toggle) return;
      var playing = motionAllowed();
      var labelHi = usesFireworks() ? (playing ? "पटाखे रोकें" : "पटाखे चलाएँ") : (playing ? "सजावट रोकें" : "सजावट चलाएँ");
      var labelEn = usesFireworks() ? (playing ? "Pause fireworks" : "Play fireworks") : (playing ? "Pause animation" : "Play animation");
      toggle.setAttribute("aria-pressed", String(playing));
      var icon = toggle.querySelector(".hn-motion-icon");
      if (icon) icon.textContent = playing ? "Ⅱ" : "▶";
      toggle.querySelectorAll('[data-lang="hi"]').forEach(function (node) { node.textContent = labelHi; });
      toggle.querySelectorAll('[data-lang="en"]').forEach(function (node) { node.textContent = labelEn; });
      toggle.title = labelHi + " / " + labelEn;
      if (window.__applyLang) window.__applyLang(toggle);
    }

    function stop() {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastTime = 0;
    }

    function frame(time) {
      frameId = 0;
      if (!motionAllowed() || !visible || document.hidden || !width || !height) return;
      var delta = Math.min(34, time - (lastTime || time));
      var step = delta / 16.667;
      lastTime = time;
      clear();
      paintStars(time);
      if (!usesFireworks()) {
        context.save();
        for (var s = 0; s < seasonalParticles.length; s += 1) {
          var seasonal = seasonalParticles[s];
          seasonal.y += seasonal.speed * step;
          seasonal.x += (seasonal.drift + Math.sin(time * 0.001 + seasonal.phase) * 0.35) * step;
          seasonal.rotation += seasonal.spin * step;
          if (seasonal.y > height + seasonal.size) {
            seasonal.y = -seasonal.size;
            seasonal.x = random(0, width);
          }
          if (seasonal.x < -seasonal.size) seasonal.x = width + seasonal.size;
          if (seasonal.x > width + seasonal.size) seasonal.x = -seasonal.size;
          if (festival() === "holi") {
            context.globalAlpha = 0.1;
            context.fillStyle = seasonal.color;
            context.beginPath();
            context.arc(seasonal.x, seasonal.y, seasonal.size, 0, Math.PI * 2);
            context.fill();
          } else if (festival() === "basant") {
            context.globalAlpha = 0.82;
            context.fillStyle = seasonal.color === "#ffd45c" ? "#ffd45c" : "#ffe7a3";
            context.translate(seasonal.x, seasonal.y);
            context.rotate(seasonal.rotation);
            context.beginPath();
            context.ellipse(0, 0, seasonal.size * 0.48, seasonal.size, 0, 0, Math.PI * 2);
            context.fill();
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
          } else {
            context.globalAlpha = 0.8;
            context.fillStyle = "#e5f8ff";
            context.beginPath();
            context.arc(seasonal.x, seasonal.y, seasonal.size, 0, Math.PI * 2);
            context.fill();
          }
        }
        context.restore();
        frameId = requestAnimationFrame(frame);
        return;
      }
      context.save();
      context.globalCompositeOperation = "lighter";
      launchClock[0] -= delta;
      launchClock[1] -= delta;
      for (var side = 0; side < 2; side += 1) {
        if (launchClock[side] <= 0) {
          launch(side);
          launchClock[side] = random(620, 1120);
        }
      }
      for (var r = rockets.length - 1; r >= 0; r -= 1) {
        var rocket = rockets[r];
        rocket.px = rocket.x;
        rocket.py = rocket.y;
        rocket.x += rocket.vx * step;
        rocket.y += rocket.vy * step;
        rocket.vy *= Math.pow(0.988, step);
        drawRocket(rocket);
        if (rocket.y <= rocket.target || rocket.vy > -0.7) {
          burst(rocket.x, rocket.y, rocket.color, width < 560 ? 34 : 48);
          rockets.splice(r, 1);
        }
      }
      for (var p = particles.length - 1; p >= 0; p -= 1) {
        var particle = particles[p];
        particle.px = particle.x;
        particle.py = particle.y;
        particle.vx *= Math.pow(0.978, step);
        particle.vy = particle.vy * Math.pow(0.978, step) + 0.038 * step;
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        particle.life -= particle.decay * step;
        if (particle.life <= 0) { particles.splice(p, 1); continue; }
        drawParticle(particle);
      }
      context.restore();
      frameId = requestAnimationFrame(frame);
    }

    function sync() {
      updateButton();
      stop();
      rockets = [];
      particles = [];
      makeSeasonalParticles();
      if (motionAllowed() && visible && !document.hidden && width && height && (usesFireworks() || seasonalParticles.length)) {
        launchClock = [80, 420];
        frameId = requestAnimationFrame(frame);
      } else {
        drawStill();
      }
    }

    if (toggle) toggle.addEventListener("click", function () {
      if (reducedQuery.matches) return;
      userPaused = !userPaused;
      try { localStorage.setItem("chnm-festival-motion", userPaused ? "off" : "on"); } catch (error) {}
      sync();
    });
    syncFestival = sync;
    document.addEventListener("visibilitychange", sync);
    if (reducedQuery.addEventListener) reducedQuery.addEventListener("change", sync);
    else if (reducedQuery.addListener) reducedQuery.addListener(sync);
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "lang"] });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting && entries[0].boundingClientRect.width > 0;
        sync();
      }, { threshold: 0.02 }).observe(stage);
    }
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize, { passive: true });
    resize();
    sync();

    var note = home.querySelector(":scope > p:not([class])");
    if (note) note.id = "home-community-note";
    if (window.__applyLang) window.__applyLang(home);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();