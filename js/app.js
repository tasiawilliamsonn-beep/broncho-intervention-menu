/* Shared helpers for The Broncho Intervention Menu. Everything is stored only in this browser. */
var BIM = (function () {
  var PLAN_KEY = "bim.plan.v1";
  var LOGS_KEY = "bim.logs.v1";

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { toast("Copied. Paste it into the PowerSchool log."); });
    }
    var ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Copied. Paste it into the PowerSchool log."); } catch (e) { toast("Select the text and copy it."); }
    ta.remove();
    return Promise.resolve();
  }
  /* "(Allday & Pakurar, 2007)" style short cite from a full APA reference */
  function shortCite(key) {
    var full = REFS[key]; if (!full) return key;
    var year = (full.match(/\((\d{4})\)/) || [])[1] || "";
    var authors = full.split(" (" + year + ")")[0];
    var names = authors.split(/\.,\s(?:&\s)?/).map(function (s) { return s.split(",")[0].trim(); });
    if (/^U\.S\./.test(authors)) return "U.S. Dept. of Education, " + year;
    if (/^American Psychological/.test(authors)) return "APA Zero Tolerance Task Force, " + year;
    if (names.length === 1) return names[0] + ", " + year;
    if (names.length === 2) return names[0] + " & " + names[1] + ", " + year;
    return names[0] + " et al., " + year;
  }

  /* ---------- printing (pages provide <div class="print-only" id="print-area">) ---------- */
  function sheetHead(title) {
    return '<div class="sheet-head"><img src="img/broncho-logo.png" alt=""><div><b>Lafayette Sunnyside Intermediate School</b><span>' + esc(title) + "</span></div></div>";
  }
  function printHTML(html) {
    var area = document.getElementById("print-area"); if (!area) return;
    area.innerHTML = html;
    document.body.classList.add("printing");
    window.print();
    setTimeout(function () { document.body.classList.remove("printing"); }, 500);
  }

  /* ---------- Daily Behavior Report tracking ---------- */
  var TRACK_KEY = "bim.dbrtrack.v1";
  function skey(s) { return String(s || "").trim().toUpperCase(); }
  function fmt(d) { var p = d.split("-"); return +p[1] + "/" + +p[2]; }
  /* % of checks for each day that has at least one mark */
  function series(rec) {
    return Object.keys(rec.days || {}).sort().map(function (d) {
      var marks = rec.days[d].filter(function (v) { return v === 1 || v === 0; });
      if (!marks.length) return null;
      var yes = marks.filter(function (v) { return v === 1; }).length;
      return { d: d, pct: Math.round(yes / marks.length * 100), yes: yes, n: marks.length };
    }).filter(Boolean);
  }
  function avg(a) { return a.length ? Math.round(a.reduce(function (s, x) { return s + x.pct; }, 0) / a.length) : 0; }
  /* Decision rules: each intervention runs 2-3 weeks (at least 10 school days of data); refer after three intervention periods without adequate response (Sunnyside MTSS process). */
  function decision(rec) {
    var pts = series(rec), goal = rec.goal || 80;
    var phases = (rec.phases || []).slice().sort(function (a, b) { return a.start.localeCompare(b.start); });
    var curStart = phases.length > 1 ? phases[phases.length - 1].start : "";
    var cur = pts.filter(function (p) { return !curStart || p.d >= curStart; });
    if (cur.length < 10) return { cls: "", title: "Keep collecting data", text: cur.length + " of 10 school days in this intervention period. Rate every day for at least 2 weeks before deciding whether the intervention is working." };
    var last = cur.slice(-10), first5 = cur.slice(0, 5), last5 = cur.slice(-5), a10 = avg(last), gain = avg(last5) - avg(first5);
    if (a10 >= goal) return { cls: "ok", title: "Responding: keep going", text: "The last 10 days average " + a10 + "%, at or above the " + goal + "% goal. Continue the intervention. After the goal is met for 2 more weeks, begin fading it (less frequent prompts and rewards), and keep praising the behavior." };
    if (gain >= 10) return { cls: "warn", title: "Some response: strengthen and recheck", text: "Scores are improving (+" + gain + " points) but the last 10 days average " + a10 + "%, below the " + goal + "% goal. Continue, increase how often you use the intervention, or add a Prevent or Teach strategy. Recheck in 1 to 2 weeks." };
    if (phases.length >= 3) return { cls: "red", title: "Bring it to the MTSS team", text: "This is intervention period " + phases.length + " without adequate response (last 10 days average " + a10 + "%, goal " + goal + "%). Three Tier 1 interventions, each tried for 2 to 3 weeks, meet the Sunnyside MTSS expectation. Print the Request for Support packet from the Log Builder." };
    return { cls: "red", title: "Not yet responding: change the intervention", text: "Intervention period " + Math.max(1, phases.length) + " of 3. The last 10 days average " + a10 + "% with little improvement (goal " + goal + "%). Check that the intervention is being used consistently, check the likely function with the ABC organizer, and choose a different matched intervention. Mark the change below to start the next 2-3 week period." };
  }
  /* Tier 1 timeline: at least 3 interventions, each tried for 2-3 weeks, before an MTSS referral (Level 1-2 behaviors). */
  function timeline() {
    return '<div class="tl">' +
      '<div><span class="wk">Weeks 1-3</span><b>Intervention 1</b><p>Choose a matched Prevent or Teach strategy. Use it every day, log it, and rate the behavior daily. Contact the family for Level 2.</p></div>' +
      '<div><span class="wk">Weeks 4-6</span><b>Intervention 2</b><p>Review the data. Working: keep going. Not working: change or add a matched intervention and start a new 2-3 week period.</p></div>' +
      '<div><span class="wk">Weeks 7-9</span><b>Intervention 3</b><p>Same review. Keep what helped, change what did not, and keep logging family contact.</p></div>' +
      '<div><span class="wk">After 6-9 weeks</span><b>MTSS team</b><p>Three interventions with little or no change: print the Request for Support packet and bring it to the MTSS team.</p></div>' +
      '</div><p class="why"><b>Why 2 to 3 weeks each:</b> a behavior needs at least 5 data points in each phase to show a trend (Kratochwill et al., 2013); 10 school days of daily ratings gives a dependable picture (Chafouleas, Riley-Tillman, &amp; Sugai, 2007). Changing sooner hides whether the intervention worked. <b>Why at least 3:</b> the Sunnyside MTSS expectation for documented Tier 1 support. Level 3 and 4 behaviors still go to an administrator right away.</p>';
  }
  function trendChart(rec, opts) {
    opts = opts || {};
    var pts = series(rec), goal = rec.goal || 80;
    if (!pts.length) return '<p class="hint">No days entered yet.</p>';
    var W = 640, H = 240, L = 42, R = 18, T = 14, B = 34, iw = W - L - R, ih = H - T - B;
    var x = function (i) { return L + (pts.length === 1 ? iw / 2 : i * iw / (pts.length - 1)); };
    var y = function (v) { return T + ih - v / 100 * ih; };
    var g = "";
    [0, 25, 50, 75, 100].forEach(function (v) {
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" style="stroke:var(--line,#ddd)" stroke-width="1"/>' +
        '<text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" class="ct-axis">' + v + "%</text>";
    });
    var every = Math.max(1, Math.ceil(pts.length / 8));
    pts.forEach(function (p, i) { if (i % every === 0 || i === pts.length - 1) g += '<text x="' + x(i) + '" y="' + (H - 12) + '" text-anchor="middle" class="ct-axis">' + fmt(p.d) + "</text>"; });
    (rec.phases || []).forEach(function (ph, k) {
      if (k === 0) return;
      var idx = pts.findIndex(function (p) { return p.d >= ph.start; }); if (idx < 0) return;
      var px = idx === 0 ? x(0) : (x(idx - 1) + x(idx)) / 2;
      g += '<line x1="' + px + '" x2="' + px + '" y1="' + T + '" y2="' + (T + ih) + '" style="stroke:var(--muted,#666)" stroke-width="1.5" stroke-dasharray="3 4"/>' +
        '<text x="' + (px + 4) + '" y="' + (T + 10) + '" class="ct-note">New intervention</text>';
    });
    g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(goal) + '" y2="' + y(goal) + '" style="stroke:var(--ink,#111)" stroke-width="1.5" stroke-dasharray="6 5"/>' +
      '<text x="' + (W - R) + '" y="' + (y(goal) - 6) + '" text-anchor="end" class="ct-note">Goal ' + goal + "%</text>";
    var d = pts.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.pct).toFixed(1); }).join(" ");
    g += '<path d="' + d + '" fill="none" style="stroke:var(--red,#c8102e)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach(function (p, i) {
      var tip = fmt(p.d) + ": " + p.yes + " of " + p.n + " checks (" + p.pct + "%)";
      g += '<circle cx="' + x(i) + '" cy="' + y(p.pct) + '" r="4.5" style="fill:var(--red,#c8102e);stroke:var(--surface,#fff)" stroke-width="2"/>' +
        '<circle class="ct-hit" cx="' + x(i) + '" cy="' + y(p.pct) + '" r="12" fill="transparent" data-tip="' + esc(tip) + '"><title>' + esc(tip) + "</title></circle>";
    });
    return '<div class="trend"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Daily percent of checks for ' + esc(opts.label || "student") + '">' + g + "</svg></div>";
  }
  /* hover tooltip for any chart point with data-tip */
  if (typeof document !== "undefined") {
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest && e.target.closest("[data-tip]"); var tip = document.getElementById("chart-tip");
      if (!t) { if (tip) tip.hidden = true; return; }
      if (!tip) { tip = document.createElement("div"); tip.id = "chart-tip"; tip.className = "chart-tip"; document.body.appendChild(tip); }
      tip.textContent = t.getAttribute("data-tip"); tip.hidden = false;
      var r = t.getBoundingClientRect(); tip.style.left = (r.left + r.width / 2 + window.scrollX) + "px"; tip.style.top = (r.top + window.scrollY - 8) + "px";
    });
  }

  return {
    sheetHead: sheetHead, printHTML: printHTML,
    getTrack: function () { return read(TRACK_KEY, {}); },
    setTrack: function (t) { return write(TRACK_KEY, t); },
    skey: skey, series: series, decision: decision, trendChart: trendChart,
    esc: esc, timeline: timeline, toast: toast, copy: copy, shortCite: shortCite,
    getPlan: function () { return read(PLAN_KEY, { behaviors: [], interventions: [] }); },
    setPlan: function (p) { return write(PLAN_KEY, p); },
    getLogs: function () { return read(LOGS_KEY, []); },
    setLogs: function (l) { return write(LOGS_KEY, l); }
  };
})();
