
window.addEventListener('message', function (ev) {
  var d = (ev && ev.data) || {};
  if (d.type !== 'c3d-lang') return;
  var m = d.mode;
  if (m !== 'hi' && m !== 'en') return;
  try {
    document.documentElement.dataset.lang = m;
    var b = document.getElementById('btnLang');
    if (b) { b.textContent = (m === 'en') ? '🌐 English only' : '🌐 सिर्फ़ हिंदी'; b.title = '\u092d\u093e\u0937\u093e \u092c\u0926\u0932\u0947\u0902'; }
  } catch (e) {}
});
try { if (window.parent !== window) window.parent.postMessage({ type: 'c3d-hel' }, '*'); } catch (e) {}
window.addEventListener('message', function (ev) {
  var d = (ev && ev.data) || {};
  if (d.type !== 'c3d-topic' || !d.sec) return;
  try {
    var b = document.querySelector('.nav-item[data-id="' + d.sec + '"]');
    if (b) b.click();
  } catch (e) {}
});
