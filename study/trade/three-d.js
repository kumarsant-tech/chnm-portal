/* Trade Theory · 3D मॉडल व्यूअर — CSS 3D, कोई बाहरी लाइब्रेरी नहीं */
(function () {
  "use strict";

  var MODELS = {
    pc: {
      title: "पीसी टावर — अंदर के भाग",
      en: "PC tower — internal parts",
      caption: "माउस या उंगली से घुमाएँ; नीचे किसी भाग पर क्लिक करके उसे चिह्नित करें।",
      parts: [
        { id: "case", label: "केस / Case", x: 0, y: 0, z: 0, w: 230, h: 280, d: 120, color: "#7f8fa6", glass: true },
        { id: "board", label: "मदरबोर्ड / Motherboard", x: -75, y: -15, z: -35, w: 10, h: 210, d: 150, color: "#1f7a4d" },
        { id: "cpu", label: "CPU + कूलर / CPU & cooler", x: -50, y: -45, z: -5, w: 52, h: 52, d: 46, color: "#37474f" },
        { id: "ram1", label: "RAM मॉड्यूल 1 / RAM module 1", x: -26, y: -95, z: 3, w: 10, h: 95, d: 28, color: "#1565c0" },
        { id: "ram2", label: "RAM मॉड्यूल 2 / RAM module 2", x: -12, y: -95, z: 3, w: 10, h: 95, d: 28, color: "#1976d2" },
        { id: "gpu", label: "ग्राफ़िक्स कार्ड / Graphics card", x: 25, y: 55, z: 20, w: 150, h: 22, d: 65, color: "#263238" },
        { id: "psu", label: "SMPS / Power supply", x: 25, y: 108, z: -20, w: 120, h: 65, d: 95, color: "#546e7a" },
        { id: "hdd", label: "हार्ड डिस्क / Hard disk", x: 10, y: -110, z: -10, w: 105, h: 30, d: 70, color: "#90a4ae" },
        { id: "fan", label: "केस पंखा / Case fan", x: -112, y: -95, z: 25, w: 20, h: 105, d: 105, color: "#00acc1", glass: true }
      ]
    },
    hdd: {
      title: "हार्ड डिस्क — प्लेटर और एक्ट्यूएटर",
      en: "Hard disk — platter and actuator",
      caption: "प्लेटर घूमता है और आर्म हेड को सही ट्रैक पर ले जाती है। हर भाग पर क्लिक करें।",
      parts: [
        { id: "base", label: "कवच / Base casting", x: 0, y: 20, z: 0, w: 250, h: 30, d: 180, color: "#78909c" },
        { id: "pcb", label: "कंट्रोलर PCB / Controller PCB", x: 0, y: 43, z: 0, w: 230, h: 8, d: 160, color: "#1b5e20" },
        { id: "platter", label: "प्लेटर / Platter", x: -15, y: -8, z: 5, w: 175, h: 10, d: 175, color: "#cfd8dc" },
        { id: "spindle", label: "स्पिंडल मोटर / Spindle motor", x: -15, y: -18, z: 5, w: 55, h: 22, d: 55, color: "#455a64" },
        { id: "arm", label: "एक्ट्यूएटर आर्म / Actuator arm", x: 55, y: -16, z: 40, w: 130, h: 8, d: 18, color: "#b0bec5", rotZ: -18 },
        { id: "head", label: "रीड/राइट हेड / Read-write head", x: 118, y: -35, z: 40, w: 22, h: 6, d: 18, color: "#ffb300" },
        { id: "connector", label: "SATA + पावर कनेक्टर", x: -105, y: 20, z: -85, w: 55, h: 18, d: 25, color: "#ffcc80" }
      ]
    },
    ram: {
      title: "RAM मॉड्यूल — DIMM की बनावट",
      en: "RAM module — DIMM construction",
      caption: "हरे PCB पर मेमोरी चिप, सुनहरे संपर्क और नॉच — लगाने से पहले दिशा पहचानें।",
      parts: [
        { id: "pcb", label: "PCB / Circuit board", x: 0, y: 0, z: 0, w: 300, h: 100, d: 5, color: "#1b5e20" },
        { id: "chip1", label: "मेमोरी चिप / Memory chips", x: -105, y: -20, z: 6, w: 34, h: 24, d: 4, color: "#212121" },
        { id: "chip2", label: "मेमोरी चिप / Memory chip", x: -55, y: -20, z: 6, w: 34, h: 24, d: 4, color: "#212121" },
        { id: "chip3", label: "मेमोरी चिप / Memory chip", x: -5, y: -20, z: 6, w: 34, h: 24, d: 4, color: "#212121" },
        { id: "chip4", label: "मेमोरी चिप / Memory chip", x: 45, y: -20, z: 6, w: 34, h: 24, d: 4, color: "#212121" },
        { id: "chip5", label: "मेमोरी चिप / Memory chip", x: 95, y: -20, z: 6, w: 34, h: 24, d: 4, color: "#212121" },
        { id: "contacts", label: "सुनहरे संपर्क / Gold contacts", x: 0, y: 55, z: 2, w: 290, h: 9, d: 6, color: "#ffb300" },
        { id: "notch", label: "नॉच / Key notch", x: -35, y: 55, z: 4, w: 10, h: 17, d: 7, color: "#263238" },
        { id: "label", label: "लेबल / Label", x: 55, y: 10, z: 6, w: 90, h: 30, d: 2, color: "#eceff1" }
      ]
    },
    smps: {
      title: "SMPS — प्राथमिक और द्वितीयक भाग",
      en: "SMPS — primary and secondary sections",
      caption: "ट्रांसफॉर्मर, कैपेसिटर, हीटसिंक और फैन — बिजली के रास्ते को पहचानें।",
      parts: [
        { id: "pcb", label: "PCB / Circuit board", x: 0, y: 18, z: 0, w: 250, h: 10, d: 180, color: "#1b5e20" },
        { id: "filter", label: "EMI फिल्टर / EMI filter", x: -105, y: 2, z: -58, w: 55, h: 24, d: 38, color: "#455a64" },
        { id: "bridge", label: "ब्रिज रेक्टिफायर / Bridge rectifier", x: -58, y: 4, z: -56, w: 40, h: 22, d: 30, color: "#263238" },
        { id: "cap1", label: "बल्क कैपेसिटर / Bulk capacitor", x: -12, y: -30, z: -50, w: 34, h: 62, d: 34, color: "#0d47a1" },
        { id: "cap2", label: "बल्क कैपेसिटर / Bulk capacitor", x: 24, y: -30, z: -50, w: 34, h: 62, d: 34, color: "#0d47a1" },
        { id: "mosfet", label: "स्विचिंग MOSFET + हीटसिंक", x: 52, y: -12, z: 8, w: 45, h: 50, d: 12, color: "#90a4ae" },
        { id: "transformer", label: "ट्रांसफॉर्मर / Transformer", x: -2, y: -22, z: 52, w: 80, h: 55, d: 58, color: "#f9a825" },
        { id: "schottky", label: "Schottky डायोड हीटसिंक", x: 82, y: -8, z: 46, w: 45, h: 40, d: 12, color: "#b0bec5" },
        { id: "output", label: "आउटपुट कनेक्टर / Output connectors", x: 82, y: 12, z: -58, w: 70, h: 18, d: 45, color: "#ffcc80" },
        { id: "fan", label: "कूलिंग फैन / Cooling fan", x: -112, y: -28, z: -80, w: 82, h: 82, d: 14, color: "#00acc1", glass: true }
      ]
    },
    motherboard: {
      title: "मदरबोर्ड — सॉकेट, स्लॉट और कनेक्टर",
      en: "Motherboard — socket, slots and connectors",
      caption: "CPU सॉकेट, RAM स्लॉट, PCIe, M.2 और पावर हेडर — अपग्रेड से पहले यही पहचानें।",
      parts: [
        { id: "board", label: "PCB / Motherboard", x: 0, y: 0, z: 0, w: 300, h: 250, d: 7, color: "#1b5e20" },
        { id: "socket", label: "CPU सॉकेट / CPU socket", x: -55, y: -55, z: 6, w: 65, h: 65, d: 5, color: "#90a4ae" },
        { id: "cpu", label: "CPU", x: -55, y: -55, z: 10, w: 48, h: 48, d: 5, color: "#37474f" },
        { id: "ram1", label: "RAM स्लॉट 1 / RAM slot", x: 45, y: -55, z: 6, w: 12, h: 120, d: 9, color: "#1565c0" },
        { id: "ram2", label: "RAM स्लॉट 2 / RAM slot", x: 65, y: -55, z: 6, w: 12, h: 120, d: 9, color: "#1565c0" },
        { id: "ram3", label: "RAM स्लॉट 3 / RAM slot", x: 85, y: -55, z: 6, w: 12, h: 120, d: 9, color: "#1565c0" },
        { id: "ram4", label: "RAM स्लॉट 4 / RAM slot", x: 105, y: -55, z: 6, w: 12, h: 120, d: 9, color: "#1565c0" },
        { id: "pcie", label: "PCIe x16 स्लॉट / PCIe x16 slot", x: -20, y: 40, z: 6, w: 185, h: 14, d: 9, color: "#263238" },
        { id: "pcie2", label: "PCIe x1 स्लॉट / PCIe x1 slot", x: -10, y: 75, z: 6, w: 110, h: 10, d: 8, color: "#37474f" },
        { id: "m2", label: "M.2 स्लॉट / M.2 slot", x: 30, y: 2, z: 6, w: 100, h: 10, d: 5, color: "#ffb300" },
        { id: "chipset", label: "चिपसेट + हीटसिंक / Chipset", x: 95, y: 78, z: 6, w: 55, h: 55, d: 9, color: "#546e7a" },
        { id: "atx", label: "24-pin पावर / ATX power", x: 128, y: -75, z: 6, w: 14, h: 65, d: 12, color: "#eceff1" },
        { id: "sata", label: "SATA पोर्ट / SATA ports", x: 125, y: 20, z: 8, w: 22, h: 45, d: 14, color: "#e53935" },
        { id: "battery", label: "CMOS बैटरी / CMOS battery", x: -95, y: 65, z: 8, w: 30, h: 30, d: 8, color: "#cfd8dc" }
      ]
    }
  };

  var SIDES = ["front", "back", "right", "left", "top", "bottom"];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function makePart(part) {
    var el = document.createElement("div");
    el.className = "td-cube" + (part.glass ? " is-glass" : "");
    el.setAttribute("data-part", part.id);
    el.style.setProperty("--w", part.w + "px");
    el.style.setProperty("--h", part.h + "px");
    el.style.setProperty("--d", part.d + "px");
    el.style.setProperty("--c", part.color || "#607d8b");
    var transform = "translate3d(" + part.x + "px," + part.y + "px," + part.z + "px)";
    if (part.rotZ) transform += " rotateZ(" + part.rotZ + "deg)";
    if (part.rotY) transform += " rotateY(" + part.rotY + "deg)";
    if (part.rotX) transform += " rotateX(" + part.rotX + "deg)";
    el.style.transform = transform;
    SIDES.forEach(function (side) {
      var face = document.createElement("span");
      face.className = "td-face td-" + side;
      el.appendChild(face);
    });
    return el;
  }

  function mount(modelId, container) {
    var model = MODELS[modelId];
    if (!model || !container) return false;

    var card = document.createElement("div");
    card.className = "td-card";
    card.innerHTML =
      '<div class="td-stage" data-td-stage tabindex="0" role="img" aria-label="' + esc(model.en) + ' का 3D मॉडल">' +
        '<div class="td-floor" aria-hidden="true"></div>' +
        '<div class="td-model" data-td-model></div>' +
        '<span class="td-badge">3D · Drag</span>' +
      "</div>" +
      '<div class="td-side">' +
        "<h3>" + esc(model.title) + "</h3>" +
        '<p class="td-sub">' + esc(model.en) + "</p>" +
        '<p class="td-caption">' + esc(model.caption) + "</p>" +
        '<div class="td-parts" role="group" aria-label="मॉडल के भाग"></div>' +
        '<div class="td-controls">' +
          '<button type="button" class="btn btn-sm btn-soft" data-td-auto aria-pressed="true">' +
            '<span class="td-auto-dot" aria-hidden="true"></span>घुमाव रोकें</button>' +
          '<button type="button" class="btn btn-sm btn-ghost" data-td-reset>रीसेट</button>' +
        "</div>" +
      "</div>";
    container.appendChild(card);

    var stage = card.querySelector("[data-td-stage]");
    var modelEl = card.querySelector("[data-td-model]");
    var partsEl = card.querySelector(".td-parts");
    var autoBtn = card.querySelector("[data-td-auto]");
    var resetBtn = card.querySelector("[data-td-reset]");

    model.parts.forEach(function (part) {
      modelEl.appendChild(makePart(part));
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "td-part-btn";
      btn.setAttribute("data-target", part.id);
      btn.innerHTML = '<i style="background:' + part.color + '"></i>' + esc(part.label);
      btn.addEventListener("click", function () {
        var target = modelEl.querySelector('[data-part="' + part.id + '"]');
        if (!target) return;
        var hot = target.classList.contains("is-hot");
        Array.prototype.forEach.call(modelEl.children, function (child) { child.classList.remove("is-hot"); });
        Array.prototype.forEach.call(partsEl.children, function (child) { child.classList.remove("is-on"); });
        if (!hot) {
          target.classList.add("is-hot");
          btn.classList.add("is-on");
        }
      });
      partsEl.appendChild(btn);
    });

    var rx = -18;
    var ry = 35;
    var auto = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var dragging = false;
    var lastX = 0;
    var lastY = 0;
    var velocity = 0.22;

    function paint() {
      modelEl.style.setProperty("--rx", rx + "deg");
      modelEl.style.setProperty("--ry", ry + "deg");
    }

    function setAuto(on) {
      auto = on;
      autoBtn.setAttribute("aria-pressed", on ? "true" : "false");
      autoBtn.innerHTML = '<span class="td-auto-dot" aria-hidden="true"></span>' + (on ? "घुमाव रोकें" : "घुमाव चलाएँ");
      card.classList.toggle("is-paused", !on);
    }

    autoBtn.addEventListener("click", function () { setAuto(!auto); });
    resetBtn.addEventListener("click", function () {
      rx = -18;
      ry = 35;
      paint();
      Array.prototype.forEach.call(modelEl.children, function (child) { child.classList.remove("is-hot"); });
      Array.prototype.forEach.call(partsEl.children, function (child) { child.classList.remove("is-on"); });
    });

    stage.addEventListener("pointerdown", function (event) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.setPointerCapture(event.pointerId);
      setAuto(false);
    });
    stage.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var dx = event.clientX - lastX;
      var dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      ry += dx * 0.5;
      rx = Math.max(-78, Math.min(78, rx - dy * 0.4));
      paint();
    });
    function stopDrag() { dragging = false; }
    stage.addEventListener("pointerup", stopDrag);
    stage.addEventListener("pointercancel", stopDrag);
    stage.addEventListener("pointerleave", stopDrag);
    stage.addEventListener("keydown", function (event) {
      var step = 12;
      if (event.key === "ArrowLeft") ry -= step;
      else if (event.key === "ArrowRight") ry += step;
      else if (event.key === "ArrowUp") rx = Math.min(78, rx + step);
      else if (event.key === "ArrowDown") rx = Math.max(-78, rx - step);
      else return;
      event.preventDefault();
      setAuto(false);
      paint();
    });

    var raf = null;
    var last = 0;
    function tick(now) {
      if (!auto || dragging) {
        last = now;
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!last) last = now;
      var dt = Math.min(64, now - last);
      last = now;
      ry += velocity * (dt / 16.67);
      paint();
      raf = requestAnimationFrame(tick);
    }

    setAuto(auto);
    paint();
    if (auto) raf = requestAnimationFrame(tick);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            if (raf) { cancelAnimationFrame(raf); raf = null; }
          } else if (!raf && auto) {
            last = 0;
            raf = requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.12 });
      io.observe(stage);
    }

    return true;
  }

  window.FITrade3D = {
    models: MODELS,
    mount: mount
  };
})();
