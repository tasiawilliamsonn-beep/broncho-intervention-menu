/* Classroom Tools: ABC organizer, Tier 1 self-check, Daily Behavior Report, behavior checklist maker. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var SELF_KEY = "bim.selfcheck.v1";

  /* ---------- tabs ---------- */
  function showTab(name) {
    document.querySelectorAll("[data-tab]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === name); });
    document.querySelectorAll(".tool").forEach(function (s) { s.hidden = s.id !== "tool-" + name; });
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
  }
  document.querySelectorAll("[data-tab]").forEach(function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); }); });

  function printArea(areaId, html) {
    $(areaId).innerHTML = html;
    document.body.classList.add("printing");
    window.print();
    setTimeout(function () { document.body.classList.remove("printing"); }, 500);
  }
  function sheetHead(title) {
    return '<div class="sheet-head"><img src="img/broncho-logo.png" alt=""><div><b>Sunnyside Intermediate School</b><span>' + esc(title) + "</span></div></div>";
  }

  /* ---------- ABC organizer ---------- */
  var abc = { a: [], b: [], c: [] };
  function joinAnd(list) { return list.length < 2 ? list.join("") : list.slice(0, -1).join(", ") + " and " + list[list.length - 1]; }
  function renderAbcLists() {
    $("abc-a").innerHTML = ABC.antecedents.map(function (t, i) {
      return '<label class="opt"><input type="checkbox" data-abc="a" value="' + i + '"' + (abc.a.indexOf(i) > -1 ? " checked" : "") + "><span>" + esc(t) + "</span></label>";
    }).join("");
    $("abc-b").innerHTML = ABC.behaviors.map(function (x, i) {
      return '<label class="opt"><input type="checkbox" data-abc="b" value="' + i + '"' + (abc.b.indexOf(i) > -1 ? " checked" : "") + "><span>Student " + esc(x.t) + "</span></label>";
    }).join("");
    renderConsequences();
  }
  function renderConsequences() {
    $("abc-c").innerHTML = ABC.consequences.map(function (x, i) {
      var r = abc.c.indexOf(i);
      return '<button type="button" class="rank-opt" data-c="' + i + '" aria-pressed="' + (r > -1) + '"><span class="rank">' + (r > -1 ? r + 1 : "") + "</span><span>Student " + esc(x.t) + "</span></button>";
    }).join("");
  }
  function scoreFunctions() {
    var s = {};
    Object.keys(FUNCTIONS).forEach(function (f) { s[f] = 0; });
    abc.b.forEach(function (i) { ABC.behaviors[i].f.forEach(function (f, k) { s[f] += k === 0 ? 2 : 1; }); });
    abc.c.forEach(function (i, rank) {
      var w = ABC.consequences[i].w, m = [1.5, 1, 0.6][rank] || 0.4;
      Object.keys(w).forEach(function (f) { s[f] += w[f] * m; });
    });
    var academic = /Reading|Writing|Math|Independent seat|Tests|computer/;
    abc.a.forEach(function (i) { if (academic.test(ABC.antecedents[i])) { s.escape += 0.5; s.skill += 0.5; } });
    return Object.keys(s).map(function (f) { return { f: f, v: s[f] }; }).sort(function (x, y) { return y.v - x.v; });
  }
  function statement() {
    var stu = $("abc-student").value.trim() || "the student";
    if (!abc.a.length && !abc.b.length && !abc.c.length) return "";
    var a = abc.a.length ? "During " + joinAnd(abc.a.map(function (i) { return ABC.antecedents[i].toLowerCase(); })) + ", " : "";
    var b = abc.b.length ? stu + " " + joinAnd(abc.b.map(function (i) { return ABC.behaviors[i].t; })) : stu + " [behavior]";
    var c = abc.c.length ? ", and " + joinAnd(abc.c.map(function (i, r) { return ABC.consequences[i].t + (abc.c.length > 1 && r === 0 ? " (most often)" : ""); })) : "";
    var s = a + b + c + ".";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function updateAbc() {
    var st = statement();
    $("abc-out").textContent = st || "Choose an antecedent, a behavior, and what usually happens next.";
    var sc = scoreFunctions(), top = sc[0];
    if (!top || top.v === 0) {
      $("abc-fn").innerHTML = '<p class="hint">Your hypothesis will appear here. The most common functions in classrooms are escape/avoidance and peer or adult attention (Packenham, Shute, &amp; Reid, 2004).</p>';
      return;
    }
    var max = top.v, close = sc.filter(function (x) { return x.v > 0 && x.v >= max * 0.75; });
    var h = '<div class="alert black"><h3 style="color:#fff">Most likely: ' + esc(FUNCTIONS[top.f].name) + "</h3><p>" + esc(FUNCTIONS[top.f].hint) + "</p></div>";
    h += sc.filter(function (x) { return x.v > 0; }).map(function (x) {
      return '<div class="fn-row"><span>' + esc(FUNCTIONS[x.f].name) + '</span><div class="meter"><span style="width:' + Math.round(x.v / max * 100) + '%"></span></div></div>';
    }).join("");
    if (close.length > 1) h += '<div class="alert warn" style="margin-top:12px"><p><b>Two or more functions are close.</b> Keep observing and noting antecedents and consequences to rule out all but one (Packenham et al., 2004).</p></div>';
    if (top.f === "escape" || top.f === "skill") h += '<div class="alert warn" style="margin-top:12px"><p><b>Check academics first.</b> Misbehavior and academic difficulty are closely linked. Confirm the student can do the work before assuming poor motivation (Gable et al., 2009).</p></div>';
    if (abc.c.some(function (i) { return ABC.consequences[i].w.escape >= 3; }) && top.f === "escape") h += '<div class="alert red" style="margin-top:12px"><p><b>The current consequence may be reinforcing the behavior.</b> If removal from class or unfinished work follows the behavior, the student gets out of the task. Choose interventions that keep the student engaged instead.</p></div>';
    var q = close.map(function (x) { return "f=" + x.f; }).join("&");
    h += '<a class="btn" style="margin-top:14px" href="menu.html?' + q + '">See interventions matched to this function &rarr;</a>';
    $("abc-fn").innerHTML = h;
  }
  document.addEventListener("change", function (e) {
    var k = e.target.getAttribute && e.target.getAttribute("data-abc"); if (!k) return;
    var v = +e.target.value, list = abc[k], i = list.indexOf(v);
    if (e.target.checked && i < 0) list.push(v); else if (!e.target.checked && i > -1) list.splice(i, 1);
    updateAbc();
  });
  $("abc-c").addEventListener("click", function (e) {
    var b = e.target.closest("[data-c]"); if (!b) return;
    var v = +b.getAttribute("data-c"), i = abc.c.indexOf(v);
    if (i > -1) abc.c.splice(i, 1); else if (abc.c.length < 3) abc.c.push(v); else { BIM.toast("Limit consequences to 3"); return; }
    renderConsequences(); updateAbc();
  });
  $("abc-student").addEventListener("input", updateAbc);
  $("abc-copy").addEventListener("click", function () {
    var st = statement(); if (!st) { BIM.toast("Build the statement first"); return; }
    var sc = scoreFunctions().filter(function (x) { return x.v > 0; });
    BIM.copy("LOG TYPE: INFORMATION\nABC behavior statement: " + st + "\nHypothesized function: " + (sc[0] ? FUNCTIONS[sc[0].f].name : "undetermined") +
      (sc[1] && sc[1].v >= sc[0].v * 0.75 ? " or " + FUNCTIONS[sc[1].f].name : "") + "\nNext step: Select Tier 1 interventions matched to the function and continue observing.");
  });
  $("abc-clear").addEventListener("click", function () { abc = { a: [], b: [], c: [] }; renderAbcLists(); updateAbc(); });

  /* ---------- Self-check ---------- */
  var self = (function () { try { return JSON.parse(localStorage.getItem(SELF_KEY)) || {}; } catch (e) { return {}; } })();
  var RATES = [["2", "In place"], ["1", "Partly"], ["0", "Not yet"]];
  function renderSelf() {
    $("self-list").innerHTML = SELFCHECK.map(function (a, ai) {
      return '<div class="panel" style="margin-bottom:16px"><header><h2>' + (ai + 1) + ". " + esc(a.area) + '</h2></header><div class="body"><p class="hint">' + esc(a.lead) + "</p>" +
        a.items.map(function (it, ii) {
          var k = ai + "." + ii;
          return '<div class="sc-item"><div><b>' + esc(it.t) + "</b><p>" + esc(it.d) + '</p><span class="cite">' + esc(it.c) + '</span></div><div class="chips" role="group" aria-label="' + esc(it.t) + '">' +
            RATES.map(function (r) { return '<button type="button" class="chip" data-sc="' + k + '" data-r="' + r[0] + '" aria-pressed="' + (self[k] === r[0]) + '">' + r[1] + "</button>"; }).join("") + "</div></div>";
        }).join("") + "</div></div>";
    }).join("");
    renderSelfOut();
  }
  function renderSelfOut() {
    var total = 0, got = 0, rated = 0, gaps = [];
    var rows = SELFCHECK.map(function (a, ai) {
      var t = 0, g = 0;
      a.items.forEach(function (it, ii) {
        var r = self[ai + "." + ii];
        if (r != null) { rated++; t += 2; g += +r; if (r !== "2") gaps.push({ it: it, r: r }); }
      });
      total += t; got += g;
      return '<div class="fn-row"><span>' + esc(a.area) + '</span><div class="meter"><span style="width:' + (t ? Math.round(g / t * 100) : 0) + '%"></span></div></div>';
    }).join("");
    var count = SELFCHECK.reduce(function (n, a) { return n + a.items.length; }, 0);
    var h = rated ? '<div class="stat">' + Math.round(got / (rated * 2) * 100) + '%</div><p class="hint">Tier 1 implementation score (In place = 2, Partly = 1, Not yet = 0; ' + rated + " of " + count + " rated)</p>" + rows : '<p class="hint">Rate each practice as In place, Partly, or Not yet. Your results and next steps appear here.</p>';
    gaps.sort(function (x, y) { return x.r - y.r; });
    if (gaps.length) {
      h += '<h3 style="text-transform:uppercase;margin:16px 0 8px">Next steps</h3><ul class="check x">' + gaps.slice(0, 8).map(function (g) {
        var ints = g.it.i.filter(function (id) { return INTERVENTIONS[id]; }).map(function (id) { return INTERVENTIONS[id].name; });
        return "<li><b>" + esc(g.it.t) + "</b> (" + (g.r === "0" ? "not yet" : "partly") + ")" + (ints.length ? '<br><span class="hint">Menu: ' + esc(ints.join(", ")) + "</span>" : "") + "</li>";
      }).join("") + "</ul>";
    } else if (rated === count) {
      h += '<div class="alert ok" style="margin-top:12px"><p>All Tier 1 foundations are in place. If a student still struggles, document individual interventions and progress data before Tier 2.</p></div>';
    }
    $("self-out").innerHTML = h;
  }
  $("self-list").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sc]"); if (!b) return;
    var k = b.getAttribute("data-sc"), r = b.getAttribute("data-r");
    if (self[k] === r) delete self[k]; else self[k] = r;
    try { localStorage.setItem(SELF_KEY, JSON.stringify(self)); } catch (err) {}
    b.parentNode.querySelectorAll("[data-sc]").forEach(function (x) { x.setAttribute("aria-pressed", self[k] === x.getAttribute("data-r")); });
    renderSelfOut();
  });
  $("self-print").addEventListener("click", function () { window.print(); });

  /* ---------- Daily Behavior Report ---------- */
  function mondayOf(d) { var x = new Date(d); var day = x.getDay(); x.setDate(x.getDate() - ((day + 6) % 7)); return x; }
  function iso(d) { var x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10); }
  function weekDays() {
    var v = $("dbr-week").value; if (!v) return ["", "", "", "", ""];
    var p = v.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
    return [0, 1, 2, 3, 4].map(function (i) { var x = new Date(d); x.setDate(d.getDate() + i); return (x.getMonth() + 1) + "/" + x.getDate(); });
  }
  $("dbr-int").innerHTML += Object.keys(INTERVENTIONS).map(function (id) { return '<option value="' + id + '">' + esc(INTERVENTIONS[id].name) + "</option>"; }).join("");
  var plan = BIM.getPlan();
  if (plan.interventions && plan.interventions[0]) $("dbr-int").value = plan.interventions[0];
  $("dbr-items").innerHTML = DBR_ITEMS.map(function (t, i) { return '<label class="opt"><input type="checkbox" class="dbr-item" value="' + i + '" checked><span>' + esc(t) + "</span></label>"; }).join("");
  $("dbr-week").value = iso(mondayOf(new Date()));

  function dbrSheet() {
    var days = weekDays(), names = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    var items = Array.prototype.filter.call(document.querySelectorAll(".dbr-item"), function (c) { return c.checked; }).map(function (c) { return DBR_ITEMS[+c.value]; });
    if ($("dbr-extra").value.trim()) items.push($("dbr-extra").value.trim());
    var iv = $("dbr-int").value ? INTERVENTIONS[$("dbr-int").value].name : "";
    var h = '<div class="sheet">' + sheetHead("Student Daily Behavior Report") +
      '<table class="sheet-meta"><tr><td>Student: <b>' + esc($("dbr-student").value) + "</b></td><td>Grade: <b>" + esc($("dbr-grade").value) + "</b></td></tr>" +
      "<tr><td>Completed by: <b>" + esc($("dbr-rater").value) + "</b></td><td>Intervention: <b>" + esc(iv) + "</b></td></tr></table>" +
      '<p class="sheet-dir">At the end of the class period or day, rate each behavior: <b>1-3</b> Never/Seldom &middot; <b>4-6</b> Sometimes &middot; <b>7-9</b> Most/All of the time.</p>' +
      '<table class="sheet-grid"><thead><tr><th>Student behaviors</th>' + names.map(function (n, i) { return "<th>" + n + "<br><small>" + (days[i] || "__/__") + "</small></th>"; }).join("") + "</tr></thead><tbody>" +
      items.map(function (t) { return "<tr><td>" + esc(t) + '<div class="scale">1 2 3 | 4 5 6 | 7 8 9</div></td>' + names.map(function () { return "<td></td>"; }).join("") + "</tr>"; }).join("") +
      ($("dbr-hw").checked ? '<tr><td>The student completed and turned in classwork and homework.<div class="scale">0-19% | 20-39% | 40-59% | 60-79% | 80-100%</div></td>' + names.map(function () { return "<td></td>"; }).join("") + "</tr>" : "") +
      "</tbody></table>" +
      '<div class="sheet-comments"><b>Daily comments</b>' + names.map(function (n, i) { return "<div><span>" + n + " " + (days[i] || "") + "</span><i></i></div>"; }).join("") + "</div>" +
      ($("dbr-parent").checked ? '<p class="sheet-sign">Parent sign-off: I have reviewed this report and discussed it with my child.<br>Signature: ______________________________ Date: __________</p>' : "") +
      '<p class="sheet-cite">Daily Behavior Report format: Chafouleas, Riley-Tillman, &amp; Sugai (2007); J. Wright, Intervention Central.</p></div>';
    return h;
  }
  function updateDbr() { $("dbr-sheet").innerHTML = dbrSheet(); }
  ["dbr-student", "dbr-grade", "dbr-rater", "dbr-week", "dbr-int", "dbr-extra", "dbr-hw", "dbr-parent"].forEach(function (id) { $(id).addEventListener("input", updateDbr); $(id).addEventListener("change", updateDbr); });
  $("dbr-items").addEventListener("change", updateDbr);
  $("dbr-print").addEventListener("click", function () { printArea("dbr-print-area", dbrSheet()); });

  /* ---------- Behavior checklist ---------- */
  function ckSheet() {
    var steps = $("ck-steps").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    var days = $("ck-days").checked, names = ["M", "T", "W", "Th", "F"];
    return '<div class="sheet">' + sheetHead("My Behavior Checklist") +
      ($("ck-student").value.trim() ? '<p class="sheet-meta-line">Name: <b>' + esc($("ck-student").value.trim()) + "</b></p>" : '<p class="sheet-meta-line">Name: ______________________________</p>') +
      '<h3 class="sheet-goal">' + esc($("ck-goal").value.trim() || "My goal") + "</h3>" +
      '<table class="sheet-grid ck"><thead><tr><th>Steps</th>' + (days ? names.map(function (n) { return "<th>" + n + "</th>"; }).join("") : "<th>Done</th>") + "</tr></thead><tbody>" +
      (steps.length ? steps : ["", "", "", ""]).map(function (s) { return "<tr><td>" + esc(s) + "</td>" + (days ? names.map(function () { return '<td><span class="box"></span></td>'; }).join("") : '<td><span class="box"></span></td>') + "</tr>"; }).join("") +
      "</tbody></table>" +
      '<p class="sheet-sign">I checked my steps honestly. Teacher check: ____</p>' +
      '<p class="sheet-cite">Task analysis and self-monitoring: Kazdin (2013); Bruhn, McDaniel, &amp; Kreigh (2015).</p></div>';
  }
  function updateCk() { $("ck-sheet").innerHTML = ckSheet(); }
  ["ck-student", "ck-goal", "ck-steps", "ck-days"].forEach(function (id) { $(id).addEventListener("input", updateCk); $(id).addEventListener("change", updateCk); });
  $("ck-example").addEventListener("click", function () { $("ck-goal").value = CHECKLIST_EXAMPLE.goal; $("ck-steps").value = CHECKLIST_EXAMPLE.steps.join("\n"); updateCk(); });
  $("ck-print").addEventListener("click", function () { printArea("ck-print-area", ckSheet()); });

  /* ---------- init ---------- */
  renderAbcLists(); updateAbc(); renderSelf(); updateDbr(); updateCk();
  var start = (location.hash || "").slice(1);
  showTab(["abc", "self", "dbr", "check"].indexOf(start) > -1 ? start : "abc");
})();
