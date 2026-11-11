/* Future Instructor – CHNM Portal · shared browser helpers */
(function () {
  "use strict";

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (value) => String(value === undefined || value === null ? "" : value).replace(/[&<>"']/g, (ch) => ESC_MAP[ch]);
  const attr = esc;

  const ICONS = {
    dashboard:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    file:
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    help:
      '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
    layers:
      '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user:
      '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    stats:
      '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    archive:
      '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    logout:
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    refresh:
      '<path d="M21 12a9 9 0 0 1-15.5 6.4L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.5 5.6L21 8"/><path d="M21 3v5h-5"/>',
    home:
      '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash:
      '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
    upload:
      '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/>',
    download:
      '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/>',
    play: '<path d="m8 5 12 7-12 7Z"/>',
    eye:
      '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    "eye-off":
      '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path d="m4 4 16 16"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    unlock:
      '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.7-1.5"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/>',
    printer:
      '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    warning:
      '<path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    copy:
      '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    shield:
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    book:
      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    bell:
      '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    chat:
      '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-3.9-.9L3 21l1.9-5.1A8.5 8.5 0 1 1 21 11.5Z"/>',
  };

  function icon(name, cls) {
    const path = ICONS[name] || ICONS.file;
    return (
      '<svg class="' +
      attr(cls || "") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      path +
      "</svg>"
    );
  }

  /* ---------- storage + sessions ---------- */
  function readStorage(kind, key) {
    try {
      return window[kind].getItem(key) || "";
    } catch {
      return "";
    }
  }
  function writeStorage(kind, key, value) {
    try {
      if (value === null) window[kind].removeItem(key);
      else window[kind].setItem(key, value);
    } catch {
      /* storage can be disabled; the app still works for this page */
    }
  }

  const STUDENT_TOKEN_KEY = "fig.student.token";
  const STUDENT_DATA_KEY = "fig.student.data";
  const ADMIN_TOKEN_KEY = "fig.admin.token";

  function studentToken() {
    return readStorage("localStorage", STUDENT_TOKEN_KEY);
  }
  function setStudentSession(token, student) {
    writeStorage("localStorage", STUDENT_TOKEN_KEY, token || null);
    writeStorage("localStorage", STUDENT_DATA_KEY, student ? JSON.stringify(student) : null);
  }
  function clearStudentSession() {
    setStudentSession("", null);
  }
  function studentData() {
    const raw = readStorage("localStorage", STUDENT_DATA_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function adminToken() {
    const stored = readStorage("localStorage", ADMIN_TOKEN_KEY);
    if (stored) return stored;
    const legacy = readStorage("sessionStorage", ADMIN_TOKEN_KEY);
    if (legacy) writeStorage("localStorage", ADMIN_TOKEN_KEY, legacy);
    return legacy;
  }
  function setAdminSession(token) {
    writeStorage("localStorage", ADMIN_TOKEN_KEY, token || null);
    writeStorage("sessionStorage", ADMIN_TOKEN_KEY, token || null);
  }
  function staffToken() {
    return readStorage("sessionStorage", "fig.staff.token");
  }
  function setStaffSession(token, profile) {
    writeStorage("sessionStorage", "fig.staff.token", token || null);
    writeStorage("sessionStorage", "fig.staff.profile", profile ? JSON.stringify(profile) : null);
  }
  function staffProfile() {
    const raw = readStorage("sessionStorage", "fig.staff.profile");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /* ---------- API ---------- */
  class ApiError extends Error {
    constructor(message, status, details) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.details = details || null;
    }
  }

  async function parseResponse(res) {
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }
    if (!res.ok) {
      const message =
        (data && data.error) ||
        (res.status === 429
          ? "बहुत अधिक कोशिशें — कुछ समय बाद प्रयास करें"
          : "सर्वर से अनुरोध पूरा नहीं हो सका (" + res.status + ")");
      throw new ApiError(message, res.status, data && data.details);
    }
    return data;
  }

  async function call(action, data, token) {
    const payload = Object.assign({ action: action }, data || {});
    let res;
    try {
      res = await fetch("/api", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        credentials: "same-origin",
      });
    } catch {
      throw new ApiError("इंटरनेट या सर्वर से कनेक्शन नहीं हुआ — दोबारा प्रयास करें", 0);
    }
    return parseResponse(res);
  }

  async function apiBlob(action, data, token) {
    let res;
    try {
      res = await fetch("/api", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify(Object.assign({ action: action }, data || {})),
        cache: "no-store",
        credentials: "same-origin",
      });
    } catch {
      throw new ApiError("इंटरनेट या सर्वर से कनेक्शन नहीं हुआ — दोबारा प्रयास करें", 0);
    }
    if (!res.ok) {
      const type = res.headers.get("content-type") || "";
      let message = "डाउनलोड नहीं हो सका (" + res.status + ")";
      if (type.includes("json")) {
        try {
          const body = await res.json();
          if (body && body.error) message = body.error;
        } catch {
          /* ignore */
        }
      }
      throw new ApiError(message, res.status);
    }
    const disposition = res.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="?([^";]+)"?/i);
    const filename = match ? decodeURIComponent(match[1]) : "chnm-download";
    return { blob: await res.blob(), filename: filename };
  }

  async function resourceCall(path, options, token) {
    const opts = options || {};
    let response;
    try {
      response = await fetch("/api/resources" + (path || ""), {
        method: opts.method || "GET",
        headers: {
          ...(opts.body instanceof FormData ? {} : { "content-type": "application/json" }),
          ...(token ? { authorization: "Bearer " + token } : {}),
        },
        body: opts.body,
        cache: "no-store",
        credentials: "same-origin",
      });
    } catch {
      throw new ApiError("इंटरनेट या सर्वर से कनेक्शन नहीं हुआ — दोबारा प्रयास करें", 0);
    }
    if (!response.ok) return parseResponse(response);
    if ((response.headers.get("content-type") || "").includes("application/json")) {
      return response.json();
    }
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    const filename = match
      ? decodeURIComponent(match[1] || match[2])
      : "chnm-resource";
    return { blob: await response.blob(), filename };
  }

  let bootstrapPromise = null;
  function bootstrap(force) {
    if (force || !bootstrapPromise) {
      bootstrapPromise = call("bootstrap").catch((error) => {
        bootstrapPromise = null;
        throw error;
      });
    }
    return bootstrapPromise;
  }

  /* ---------- formatting ---------- */
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function fmtDate(iso) {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  function fmtDateTime(iso) {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return (
      date.toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      ", " +
      date.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })
    );
  }
  function fmtTime(iso) {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" });
  }
  function fmtDuration(minutes) {
    const value = Number(minutes) || 0;
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    if (hours && mins) return hours + " घंटे " + mins + " मिनट";
    if (hours) return hours + " घंटे";
    return mins + " मिनट";
  }
  function fmtClock(totalSeconds) {
    const value = Math.max(0, Math.round(Number(totalSeconds) || 0));
    const hours = Math.floor(value / 3600);
    const mins = Math.floor((value % 3600) / 60);
    const secs = value % 60;
    return hours > 0 ? pad(hours) + ":" + pad(mins) + ":" + pad(secs) : pad(mins) + ":" + pad(secs);
  }
  function trimNumber(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return String(Math.round(n * 10000) / 10000);
  }
  function fmtPct(value) {
    if (value === null || value === undefined || value === "") return "—";
    return trimNumber(value) + "%";
  }
  function fmtMarks(value) {
    if (value === null || value === undefined || value === "") return "—";
    return trimNumber(value);
  }
  function studentInitials(name) {
    const words = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!words.length) return "?";
    return (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();
  }
  function avatar(photo, name, cls) {
    const klass = cls || "avatar";
    if (photo) return '<img class="' + attr(klass) + '" src="' + attr(photo) + '" alt="">';
    return '<span class="' + attr(klass) + '">' + esc(studentInitials(name)) + "</span>";
  }
  function optionLetter(index) {
    return String.fromCharCode(65 + Number(index || 0));
  }
  function examTypeLabel(type) {
    return type === "practice" ? "अभ्यास" : "फाइनल";
  }
  function examStatusText(status) {
    return (
      { draft: "Draft", locked: "Locked", published: "Published", archived: "Archived" }[status] ||
      status ||
      "—"
    );
  }
  function statusChip(status) {
    const cls =
      { draft: "status-draft", locked: "status-locked", published: "status-published", archived: "status-archived" }[
        status
      ] || "status-draft";
    return '<span class="status-chip ' + cls + '">' + esc(examStatusText(status)) + "</span>";
  }
  function passPill(pass) {
    if (pass === null || pass === undefined) return '<span class="pill">प्रतीक्षित</span>';
    return pass
      ? '<span class="pill good">उत्तीर्ण</span>'
      : '<span class="pill bad">अनुत्तीर्ण</span>';
  }
  function availabilityText(availability) {
    if (!availability) return "";
    return (
      {
        available: "उपलब्ध",
        upcoming: "आगामी",
        closed: "समय समाप्त",
        unpublished: "अप्रकाशित",
      }[availability.state] || availability.reason || ""
    );
  }

  /* ---------- date inputs ---------- */
  function toLocalInput(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }
  function fromLocalInput(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  /* ---------- toast ---------- */
  function toastWrap() {
    let wrap = $("#toastWrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "toastWrap";
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    return wrap;
  }
  function toast(message, type) {
    const wrap = toastWrap();
    const node = document.createElement("div");
    node.className = "toast" + (type ? " " + type : "");
    node.setAttribute("role", "status");
    node.textContent = String(message || "");
    wrap.appendChild(node);
    window.setTimeout(() => {
      node.style.opacity = "0";
      node.style.transition = "opacity .2s";
      window.setTimeout(() => node.remove(), 220);
    }, type === "bad" ? 6500 : 4200);
    return node;
  }

  /* ---------- modal ---------- */
  let modalCount = 0;
  function modal(options) {
    const opts = options || {};
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    const box = document.createElement("div");
    box.className = "modal" + (opts.size ? " " + opts.size : "");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    if (opts.title) box.setAttribute("aria-label", String(opts.title));
    box.innerHTML =
      '<div class="modal-head"><div class="grow"><h2>' +
      esc(opts.title || "") +
      "</h2>" +
      (opts.subtitle ? "<p>" + esc(opts.subtitle) + "</p>" : "") +
      '</div><button class="modal-close" type="button" aria-label="बंद करें">&times;</button></div>' +
      '<div class="modal-body"></div>' +
      (opts.actions && opts.actions.length ? '<div class="modal-foot"></div>' : "");
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    document.body.classList.add("modal-open");
    modalCount += 1;

    const body = $(".modal-body", box);
    if (typeof opts.body === "string") body.innerHTML = opts.body;
    else if (opts.body instanceof Node) body.appendChild(opts.body);

    const foot = $(".modal-foot", box);
    const close = function () {
      if (wrap.dataset.closed) return;
      wrap.dataset.closed = "1";
      wrap.remove();
      modalCount = Math.max(0, modalCount - 1);
      if (!modalCount) document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      if (typeof opts.onClose === "function") opts.onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape" && opts.dismissible !== false) close();
    };
    document.addEventListener("keydown", onKey);
    $(".modal-close", box).addEventListener("click", () => {
      if (opts.dismissible !== false) close();
    });
    wrap.addEventListener("mousedown", (event) => {
      if (event.target === wrap && opts.dismissible !== false) close();
    });

    const handle = { root: wrap, box: box, body: body, foot: foot, close: close };
    (opts.actions || []).forEach((action) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn " + (action.ghost ? "btn-ghost" : action.tone || "");
      btn.innerHTML = action.icon ? icon(action.icon) + "<span>" + esc(action.label) + "</span>" : esc(action.label);
      if (action.id) btn.id = action.id;
      btn.addEventListener("click", async () => {
        if (btn.disabled) return;
        try {
          await action.onClick(handle);
        } catch (error) {
          toast(error.message || "कार्य पूरा नहीं हो सका", "bad");
        }
      });
      foot.appendChild(btn);
      action.el = btn;
    });

    if (typeof opts.onOpen === "function") {
      window.setTimeout(() => opts.onOpen(handle), 0);
    }
    const focusTarget = $("input, select, textarea, button", body);
    if (focusTarget) window.setTimeout(() => focusTarget.focus(), 40);
    return handle;
  }

  function confirmDialog(options) {
    const opts = options || {};
    return new Promise((resolve) => {
      let settled = false;
      let handle = null;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        if (handle) handle.close();
        resolve(value);
      };
      const body =
        '<p class="confirm-message">' +
        esc(opts.message || "").replace(/\n/g, "<br>") +
        "</p>" +
        (opts.detail ? '<div class="notice ' + (opts.detailTone || "warn") + '">' + esc(opts.detail) + "</div>" : "") +
        (opts.requireText
          ? '<label class="field"><span>' +
            esc(opts.inputLabel || "पुष्टि के लिए टाइप करें") +
            "</span><input class=\"input\" id=\"confirmInput\" autocomplete=\"off\" spellcheck=\"false\"><small>ठीक यही लिखें: <b>" +
            esc(opts.requireText) +
            "</b></small></label><p class=\"notice bad\" id=\"confirmError\" hidden></p>"
          : "");
      handle = modal({
        title: opts.title || "पुष्टि करें",
        subtitle: opts.subtitle || "",
        size: "sm",
        body: body,
        dismissible: true,
        actions: [
          { label: "रद्द करें", ghost: true, onClick: () => finish(false) },
          {
            label: opts.confirmText || "हाँ, आगे बढ़ें",
            tone: opts.tone || "btn-bad",
            id: "confirmOk",
            onClick: () => {
              if (opts.requireText) {
                const input = $("#confirmInput", handle.body);
                const value = input.value.trim();
                if (value !== opts.requireText) {
                  const error = $("#confirmError", handle.body);
                  error.hidden = false;
                  error.textContent = "टाइप किया हुआ मेल नहीं खाता।";
                  input.focus();
                  return;
                }
                finish(value);
                return;
              }
              finish(true);
            },
          },
        ],
        onClose: () => finish(false),
      });
      if (opts.requireText) {
        window.setTimeout(() => {
          const input = $("#confirmInput", handle.body);
          if (input) input.focus();
        }, 60);
      }
    });
  }

  /* ---------- misc helpers ---------- */
  async function withBusy(button, task, busyLabel) {
    if (!button) return task();
    const before = button.innerHTML;
    button.disabled = true;
    if (busyLabel) button.textContent = busyLabel;
    try {
      return await task();
    } finally {
      button.disabled = false;
      button.innerHTML = before;
    }
  }

  function debounce(fn, wait) {
    let timer = 0;
    return function debounced() {
      const args = arguments;
      const context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(context, args), wait || 250);
    };
  }

  function query(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function copyText(text) {
    const value = String(text || "");
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch {
        reject(new Error("कॉपी नहीं हो सका"));
      } finally {
        area.remove();
      }
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function download(action, data, token) {
    const result = await apiBlob(action, data, token);
    downloadBlob(result.blob, result.filename);
    return result.filename;
  }

  function compressPhoto(file, options) {
    const opts = options || {};
    const maxBytes = (opts.maxKb || 150) * 1024;
    const maxDim = opts.maxDim || 640;
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("फोटो चुनें"));
        return;
      }
      if (!/^image\//.test(file.type || "")) {
        reject(new Error("फोटो JPG, PNG या WebP में चुनें"));
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        reject(new Error("फोटो 12 MB से छोटी होनी चाहिए"));
        return;
      }
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          let quality = 0.86;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length > maxBytes && quality > 0.38) {
            quality -= 0.07;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          URL.revokeObjectURL(url);
          if (dataUrl.length > maxBytes) {
            reject(new Error("फोटो छोटी नहीं हो सकी — दूसरी फोटो चुनें"));
            return;
          }
          resolve(dataUrl);
        } catch {
          URL.revokeObjectURL(url);
          reject(new Error("फोटो पढ़ी नहीं जा सकी"));
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("फोटो फाइल खराब है"));
      };
      image.src = url;
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[data-src="' + src + '"]')) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("लाइब्रेरी लोड नहीं हो सकी — इंटरनेट जाँचें"));
      document.head.appendChild(script);
    });
  }

  function showError(target, message, title) {
    if (!target) return;
    target.innerHTML =
      '<div class="empty"><strong>' +
      esc(title || "कुछ गलत हो गया") +
      "</strong><p>" +
      esc(message || "दोबारा प्रयास करें") +
      '</p><button class="btn btn-sm" type="button" data-retry>दोबारा प्रयास करें</button></div>';
  }

  function setButtonBusy(button, busy, label) {
    if (!button) return;
    if (busy) {
      if (!button.dataset.original) button.dataset.original = button.innerHTML;
      button.disabled = true;
      if (label) button.textContent = label;
    } else {
      button.disabled = false;
      if (button.dataset.original) button.innerHTML = button.dataset.original;
    }
  }

  function formValues(form) {
    const values = {};
    new FormData(form).forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  function closeOnNavigate() {
    document.body.classList.remove("modal-open");
  }

  window.addEventListener("beforeunload", closeOnNavigate);

  window.UI = {
    $: $,
    $$: $$,
    esc: esc,
    attr: attr,
    icon: icon,
    call: call,
    apiBlob: apiBlob,
    resourceCall: resourceCall,
    download: download,
    downloadBlob: downloadBlob,
    bootstrap: bootstrap,
    studentToken: studentToken,
    setStudentSession: setStudentSession,
    clearStudentSession: clearStudentSession,
    studentData: studentData,
    adminToken: adminToken,
    setAdminSession: setAdminSession,
    staffToken: staffToken,
    setStaffSession: setStaffSession,
    staffProfile: staffProfile,
    toast: toast,
    modal: modal,
    confirm: confirmDialog,
    fmtDate: fmtDate,
    fmtDateTime: fmtDateTime,
    fmtTime: fmtTime,
    fmtDuration: fmtDuration,
    fmtClock: fmtClock,
    fmtPct: fmtPct,
    fmtMarks: fmtMarks,
    trimNumber: trimNumber,
    avatar: avatar,
    initials: studentInitials,
    optionLetter: optionLetter,
    examTypeLabel: examTypeLabel,
    examStatusText: examStatusText,
    statusChip: statusChip,
    passPill: passPill,
    availabilityText: availabilityText,
    toLocalInput: toLocalInput,
    fromLocalInput: fromLocalInput,
    withBusy: withBusy,
    debounce: debounce,
    query: query,
    copyText: copyText,
    compressPhoto: compressPhoto,
    loadScript: loadScript,
    showError: showError,
    setButtonBusy: setButtonBusy,
    formValues: formValues,
    ApiError: ApiError,
  };
})();
