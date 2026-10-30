/* Student Logs: every saved entry on this device, filterable and sortable. */
(function () {
  var esc = BIM.esc, $ = function (id) { return document.getElementById(id); };
  var logs = BIM.getLogs(), open = {};
  var sortKey = "date", sortDir = -1;
  function fmt(s) { if (!s) return ""; var p = s.split("-"); return +p[1] + "/" + +p[2] + "/" + p[0]; }
  function intName(id) { return INTERVENTIONS[id] ? INTERVENTIONS[id].name : id; }
  function behs(l) { return (l.behaviors || []).map(function (b) { return b.name; }); }
  function contact(l) { return !!((l.contact && l.contact.made) || l.type === "COMMUNICATION"); }
  function val(l, k) {
    if (k === "behavior") return behs(l).join("; ").toLowerCase();
    if (k === "level") return l.level || 0;
    if (k === "student") return (l.student || "").toLowerCase();
    return (l[k] || "").toString().toLowerCase();
  }
  function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }).sort(); }
  function opts(id, list, label) {
    var cur = $(id).value;
    $(id).innerHTML = '<option value="">All ' + label + "</option>" + list.map(function (x) { var v = Array.isArray(x) ? x : [x, x]; return '<option value="' + esc(v[0]) + '"' + (v[0] === cur ? " selected" : "") + ">" + esc(v[1]) + "</option>"; }).join("");
  }
  function fillFilters() {
    var names = {}; logs.forEach(function (l) { names[BIM.skey(l.student)] = l.student.trim(); });
    opts("sl-student", Object.keys(names).sort().map(function (k) { return [k, names[k]]; }), "students");
    opts("sl-type", uniq(logs.map(function (l) { return l.type; })), "log types");
    opts("sl-level", uniq(logs.map(function (l) { return l.level ? String(l.level) : ""; })).map(function (x) { return [x, "Level " + x]; }), "levels");
    opts("sl-beh", uniq([].concat.apply([], logs.map(behs))), "behaviors");
    opts("sl-setting", uniq(logs.map(function (l) { return l.setting; })), "locations");
    opts("sl-int", uniq([].concat.apply([], logs.map(function (l) { return l.ints || []; }))).map(function (id) { return [id, intName(id)]; }).sort(function (a, b) { return a[1].localeCompare(b[1]); }), "interventions");
    opts("sl-resp", uniq(logs.map(function (l) { return l.response; })), "responses");
    $("sl-students").innerHTML = Object.keys(names).sort().map(function (k) {
      var n = logs.filter(function (l) { return BIM.skey(l.student) === k; }).length;
      return '<button type="button" class="chip" data-stu="' + esc(k) + '" aria-pressed="' + ($("sl-student").value === k) + '">' + esc(names[k]) + " (" + n + ")</button>";
    }).join("");
  }
  function filtered() {
    var f = function (id) { return $(id).value; }, q = f("sl-q").trim().toLowerCase();
    return logs.filter(function (l) {
      if (f("sl-student") && BIM.skey(l.student) !== f("sl-student")) return false;
      if (f("sl-type") && l.type !== f("sl-type")) return false;
      if (f("sl-level") && String(l.level || "") !== f("sl-level")) return false;
      if (f("sl-beh") && behs(l).indexOf(f("sl-beh")) < 0) return false;
      if (f("sl-setting") && l.setting !== f("sl-setting")) return false;
      if (f("sl-int") && (l.ints || []).indexOf(f("sl-int")) < 0) return false;
      if (f("sl-resp") && l.response !== f("sl-resp")) return false;
      if (f("sl-contact") && contact(l) !== (f("sl-contact") === "yes")) return false;
      if (f("sl-from") && (l.date || "") < f("sl-from")) return false;
      if (f("sl-to") && (l.date || "") > f("sl-to")) return false;
      if (q && [l.text, l.title, l.student, behs(l).join(" "), (l.ints || []).map(intName).join(" ")].join(" ").toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).sort(function (a, b) {
      var x = val(a, sortKey), y = val(b, sortKey);
      return (x < y ? -1 : x > y ? 1 : 0) * sortDir || (b.date || "").localeCompare(a.date || "");
    });
  }
  function render() {
    var list = filtered();
    $("sl-count").textContent = list.length + " of " + logs.length + " log entr" + (logs.length === 1 ? "y" : "ies");
    var t = {}; list.forEach(function (l) { t[l.type] = (t[l.type] || 0) + 1; });
    $("sl-sum").innerHTML = list.length ? Object.keys(t).sort().map(function (k) { return '<span class="pill' + (k === "DISCIPLINE" ? " no" : " ok") + '">' + esc(k) + ": " + t[k] + "</span>"; }).join(" ") : "";
    document.querySelectorAll("[data-sort]").forEach(function (b) {
      var k = b.getAttribute("data-sort"); b.setAttribute("aria-sort", k === sortKey ? (sortDir > 0 ? "ascending" : "descending") : "none");
      b.textContent = b.textContent.replace(/ [▲▼]$/, "") + (k === sortKey ? (sortDir > 0 ? " ▲" : " ▼") : "");
    });
    $("sl-body").innerHTML = list.length ? list.map(function (l) {
      var row = '<tr class="sl-row" data-open="' + esc(l.id) + '"><td>' + esc(fmt(l.date)) + "</td><td><b>" + esc(l.student) + "</b></td><td>" + esc(l.type) + "</td><td>" + (l.level ? "L" + l.level : "") +
        "</td><td>" + esc(behs(l).join("; ")) + "</td><td>" + esc(l.setting || "") + "</td><td>" + esc((l.ints || []).map(intName).join("; ")) + "</td><td>" + esc(l.response || "") +
        "</td><td>" + (contact(l) ? "Yes" : "") + '</td><td><button class="btn ghost sm" type="button" data-open="' + esc(l.id) + '">' + (open[l.id] ? "Hide" : "View") + "</button></td></tr>";
      if (open[l.id]) row += '<tr class="sl-detail"><td colspan="10"><p><b>Title:</b> ' + esc(l.title || "") + '</p><div class="output" id="txt-' + esc(l.id) + '">' + esc(l.text || "") + '</div>' +
        '<div class="cta" style="margin-top:8px"><button class="btn sm" type="button" data-copy="txt-' + esc(l.id) + '">Copy log entry</button><button class="btn ghost sm" type="button" data-del="' + esc(l.id) + '">Delete</button></div></td></tr>';
      return row;
    }).join("") : '<tr><td colspan="10" class="empty">' + (logs.length ? "No entries match these filters." : 'No saved logs on this device yet. Save entries in the <a href="log.html">Log Builder</a>.') + "</td></tr>";
  }
  function refresh() { fillFilters(); render(); }

  document.querySelector(".sl-filters").addEventListener("input", render);
  document.querySelector(".sl-filters").addEventListener("change", function (e) {
    if (e.target.id === "sl-sort") { var p = e.target.value.split(":"); sortKey = p[0]; sortDir = +p[1]; }
    if (e.target.id === "sl-student") fillFilters();
    render();
  });
  $("sl-clear").addEventListener("click", function () {
    document.querySelectorAll(".sl-filters input, .sl-filters select").forEach(function (el) { if (el.id !== "sl-sort") el.value = ""; });
    refresh();
  });
  $("sl-students").addEventListener("click", function (e) {
    var b = e.target.closest("[data-stu]"); if (!b) return;
    $("sl-student").value = $("sl-student").value === b.getAttribute("data-stu") ? "" : b.getAttribute("data-stu");
    refresh();
  });
  document.querySelector(".sl-table thead").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sort]"); if (!b) return;
    var k = b.getAttribute("data-sort"); sortDir = k === sortKey ? -sortDir : (k === "date" || k === "level" ? -1 : 1); sortKey = k;
    render();
  });
  $("sl-body").addEventListener("click", function (e) {
    var c = e.target.closest("[data-copy]"); if (c) { BIM.copy($(c.getAttribute("data-copy")).textContent); return; }
    var d = e.target.closest("[data-del]");
    if (d) { if (confirm("Delete this log entry from this device?")) { logs = logs.filter(function (l) { return l.id !== d.getAttribute("data-del"); }); BIM.setLogs(logs); refresh(); } return; }
    var o = e.target.closest("[data-open]"); if (o) { var id = o.getAttribute("data-open"); open[id] = !open[id]; render(); }
  });
  $("sl-csv").addEventListener("click", function () {
    var rows = [["Date", "Student", "Log type", "Level", "Behaviors", "Location", "Interventions", "Response", "Parent contact", "Title", "Log entry"]].concat(filtered().map(function (l) {
      return [l.date, l.student, l.type, l.level || "", behs(l).join("; "), l.setting || "", (l.ints || []).map(intName).join("; "), l.response || "", contact(l) ? "Yes" : "", l.title || "", l.text || ""];
    }));
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\r\n")], { type: "text/csv" }));
    a.download = "student-logs.csv"; document.body.appendChild(a); a.click(); a.remove();
  });
  $("sl-print").addEventListener("click", function () {
    var list = filtered();
    BIM.printHTML('<div class="sheet">' + BIM.sheetHead("Student Logs") + '<table class="sheet-grid"><thead><tr><th>Date</th><th>Student</th><th>Type</th><th>Behavior</th><th>Location</th><th>Intervention(s)</th><th>Response</th><th>Log entry</th></tr></thead><tbody>' +
      list.map(function (l) { return "<tr><td>" + esc(fmt(l.date)) + "</td><td>" + esc(l.student) + "</td><td>" + esc(l.type) + "</td><td>" + esc(behs(l).join("; ")) + "</td><td>" + esc(l.setting || "") + "</td><td>" + esc((l.ints || []).map(intName).join("; ")) + "</td><td>" + esc(l.response || "") + "</td><td>" + esc(l.text || "") + "</td></tr>"; }).join("") +
      "</tbody></table></div>");
  });
  $("bk-save").addEventListener("click", BIM.backup);
  $("bk-load").addEventListener("change", function (e) { if (e.target.files[0]) BIM.restore(e.target.files[0], function () { logs = BIM.getLogs(); refresh(); }); });
  var q = new URLSearchParams(location.search).get("student"); refresh(); if (q) { $("sl-student").value = BIM.skey(q); refresh(); }
})();
