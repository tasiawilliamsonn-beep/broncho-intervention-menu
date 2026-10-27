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

  return {
    esc: esc, toast: toast, copy: copy, shortCite: shortCite,
    getPlan: function () { return read(PLAN_KEY, { behaviors: [], interventions: [] }); },
    setPlan: function (p) { return write(PLAN_KEY, p); },
    getLogs: function () { return read(LOGS_KEY, []); },
    setLogs: function (l) { return write(LOGS_KEY, l); }
  };
})();
