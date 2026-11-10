const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
async function api(action, data = {}, tok) {
  let r;
  try { r = await fetch("/api", { method: "POST", headers: { "content-type": "application/json", ...(tok ? { authorization: "Bearer " + tok } : {}) }, body: JSON.stringify({ action, ...data }) }); }
  catch { throw new Error("इंटरनेट/सर्वर से कनेक्शन नहीं हुआ"); }
  const j = await r.json().catch(() => ({ error: "सर्वर जवाब नहीं दे रहा" }));
  if (!r.ok) { const e = new Error(j.error || "त्रुटि"); e.status = r.status; throw e; }
  return j;
}
document.body.insertAdjacentHTML("afterbegin", '<nav><b>Future Instructor</b><a href="../index.html">पोर्टल</a><a href="index.html">टेस्ट होम</a><a href="register.html">रजिस्टर</a><a href="test.html">टेस्ट</a><a href="result.html">रिजल्ट</a></nav>');
