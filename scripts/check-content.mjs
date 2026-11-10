/* Trade Theory + Training Methodology कंटेंट जाँच: आरेख आच्छादन, आरेख संरचना, LIVE लैब smoke */
import fs from "fs";
import vm from "vm";

function load(dir, files) {
  const ctx = { window: {}, document: {}, console };
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(fs.readFileSync(dir + f, "utf8"), ctx, { filename: f }));
  return ctx;
}

const FIG_TYPES = new Set(["flow", "cycle", "pyramid", "ladder", "compare", "map"]);
const problems = [];

function checkFigures(label, mods, key) {
  let total = 0, drawn = 0;
  mods.forEach((m) => {
    (m.sections || []).forEach((s) => {
      total++;
      const f = s[key];
      if (!f) { problems.push(`${label} ${m.code || "M" + m.id} आरेख नहीं: ${s.h}`); return; }
      drawn++;
      const list = Array.isArray(f) ? f : [f];
      list.forEach((fig) => {
        if (!FIG_TYPES.has(fig.type)) problems.push(`${label} ${m.code} गलत type ${fig.type}: ${s.h}`);
        if (!fig.title || !fig.caption) problems.push(`${label} ${m.code} शीर्षक/कैप्शन नहीं: ${s.h}`);
        if (fig.type === "cycle" && !fig.loop) problems.push(`${label} ${m.code} cycle में loop नहीं: ${s.h}`);
        if (fig.type === "map" && !fig.center) problems.push(`${label} ${m.code} map में center नहीं: ${s.h}`);
        if (fig.type === "compare") ["left", "right"].forEach((side) => {
          const p = fig[side];
          if (!p || !p.title || !Array.isArray(p.items)) problems.push(`${label} ${m.code} compare.${side} अधूरा: ${s.h}`);
        });
        if (["flow", "pyramid", "ladder"].includes(fig.type) && (!Array.isArray(fig.items) || !fig.items.length))
          problems.push(`${label} ${m.code} items खाली: ${s.h}`);
        (fig.items || []).forEach((it) => { if (!it.label) problems.push(`${label} ${m.code} item.label नहीं: ${s.h}`); });
      });
    });
  });
  console.log(`${label}: खंड ${total}, आरेख ${drawn}`);
  return total - drawn;
}

const trade = load("study/trade/data/", [
  "ch-01-05.js", "ch-06-10.js", "ch-11-15.js", "ch-16-20.js", "ch-21-25.js",
  "clarity-trade-figs-a.js", "clarity-trade-figs-b.js", "clarity-trade-figs-c.js",
  "clarity-trade-figs-d.js", "clarity-trade-figs-e.js",
]);
vm.runInContext(fs.readFileSync("study/trade/trade-live.js", "utf8"), trade);
checkFigures("Trade Theory", trade.window.TRADE_MODULES, "figure");

const tm = load("study/data/", [
  "modules-1-4.js", "modules-5-8.js", "modules-9-12.js", "modules-13-16.js",
  "extra-topics.js", "extra-topics-2.js",
  "clarity-tm-figs-a.js", "clarity-tm-figs-b.js", "clarity-tm-figs-c.js", "clarity-tm-figs-d.js",
  "clarity-tm-live.js",
]);
checkFigures("Training Methodology", tm.window.STUDY_MODULES, "figure");

function simCount(mods) {
  let sims = 0, live = 0, withLive = 0;
  mods.forEach((m) => {
    const list = (m.sim ? [m.sim] : []).concat(m.sims || []);
    sims += list.length;
    const l = list.filter((s) => s.type === "live").length;
    live += l;
    if (l) withLive++;
  });
  return { sims, live, withLive };
}
const tSim = simCount(trade.window.TRADE_MODULES), mSim = simCount(tm.window.STUDY_MODULES);
console.log(`Trade सिमुलेटर ${tSim.sims} (LIVE ${tSim.live}, अध्याय-with-LIVE ${tSim.withLive}/25)`);
console.log(`TM सिमुलेटर ${mSim.sims} (LIVE ${mSim.live}, मॉड्यूल-with-LIVE ${mSim.withLive}/16)`);
if (tSim.withLive < 25) problems.push("Trade: किसी अध्याय में LIVE लैब नहीं है");

const LABS = trade.window.TRADE_LABS || {};
const badText = (v) => /undefined|NaN|\[object Object\]/.test(String(v));
Object.keys(LABS).forEach((name) => {
  const lab = LABS[name];
  const base = {};
  (lab.vars || []).forEach((v) => (base[v.k] = v.value));
  (lab.opts || []).forEach((o) => (base[o.k] = o.options[o.def || 0]));
  (lab.flags || []).forEach((f) => (base[f.k] = !!f.value));
  const states = [{ ...base }];
  (lab.vars || []).forEach((v) => {
    const step = v.step || 1;
    [v.min, v.min + Math.round((v.max - v.min) / 2 / step) * step, v.max].forEach((val) =>
      states.push({ ...base, [v.k]: val }));
  });
  (lab.opts || []).forEach((o) => o.options.forEach((op) => states.push({ ...base, [o.k]: op })));
  (lab.flags || []).forEach((f) => { states.push({ ...base, [f.k]: true }); states.push({ ...base, [f.k]: false }); });
  states.forEach((s) => {
    const tag = `${name} लैब (${JSON.stringify(s)})`;
    try {
      const r = lab.calc(s);
      const texts = [];
      (lab.meters ? lab.meters(s, r) : []).forEach((m) => texts.push(m.label, m.show));
      lab.stats(s, r).forEach((st) => texts.push(st.label, st.value));
      texts.push(lab.judge(s, r).text);
      if (lab.lock) texts.push(lab.lock(s, r));
      texts.forEach((t) => {
        if (t === undefined || t === null) problems.push(`${tag}: टेक्स्ट फ़ील्ड गायब`);
        else if (badText(t)) problems.push(`${tag}: ${String(t).slice(0, 80)}`);
      });
    } catch (e) {
      problems.push(`${tag}: अपवाद ${e.message}`);
    }
  });
});
console.log(`LIVE लैब smoke: ${Object.keys(LABS).length} लैब`);

if (problems.length) {
  console.log("\nसमस्याएँ (" + problems.length + "):");
  console.log([...new Set(problems)].slice(0, 40).join("\n"));
  process.exit(1);
}
console.log("\nसभी आरेख, LIVE लैब और लैब-पाठ सही");
