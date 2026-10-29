/* Request for Support packet: one printable summary of a student's documented Tier 1 record
   for the MTSS/RTI team (interventions, parent contacts, progress data, log history). */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  function fmt(s) { if (!s) return ""; var p = s.split("-"); return +p[1] + "/" + +p[2] + "/" + p[0]; }
  function v(id) { return ($(id).value || "").trim(); }
  function para(t, w) { return t ? esc(t).replace(/\n/g, "<br>") : '<span class="blank" style="min-width:' + (w || 480) + 'px"></span><br><span class="blank" style="min-width:' + (w || 480) + 'px"></span>'; }

  $("rfs-fn").innerHTML = '<option value="">Not sure yet</option>' + Object.keys(FUNCTIONS).map(function (f) { return '<option value="' + f + '">' + esc(FUNCTIONS[f].name) + "</option>"; }).join("");
  $("rfs-open").addEventListener("click", function () {
    var k = $("proof-student").value;
    if (!k || !BIM.getLogs().some(function (l) { return BIM.skey(l.student) === k; })) { BIM.toast("Save at least one log entry for the student first"); return; }
    $("rfs").hidden = false; $("rfs-name").textContent = k; $("rfs").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("rfs-close").addEventListener("click", function () { $("rfs").hidden = true; });

  function packet() {
    var k = $("proof-student").value;
    var logs = BIM.getLogs().filter(function (l) { return BIM.skey(l.student) === k; }).sort(function (a, b) { return (a.date || "").localeCompare(b.date || ""); });
    var name = logs.length ? logs[0].student : k;
    var intLogs = logs.filter(function (l) { return l.ints && l.ints.length; });
    var comms = logs.filter(function (l) { return l.type === "COMMUNICATION" || (l.contact && l.contact.made); });
    var used = {};
    intLogs.forEach(function (l) { l.ints.forEach(function (id) { var u = used[id] = used[id] || { n: 0, first: l.date, last: l.date }; u.n++; if (l.date < u.first) u.first = l.date; if (l.date > u.last) u.last = l.date; }); });
    var ids = Object.keys(used).filter(function (id) { return INTERVENTIONS[id]; });
    var types = {}; ids.forEach(function (id) { types[INTERVENTIONS[id].type] = 1; });
    var dates = logs.map(function (l) { return l.date; }).filter(Boolean).sort();
    var span = dates.length > 1 ? Math.round((new Date(dates[dates.length - 1]) - new Date(dates[0])) / 864e5) : 0;
    var track = BIM.getTrack()[k], dec = track ? BIM.decision(track) : null, days = track ? BIM.series(track).length : 0;
    function chk(ok, t) { return '<li><span class="ic ' + (ok ? "yes" : "no") + '">' + (ok ? "&#10003;" : "!") + "</span><span>" + t + "</span></li>"; }

    var h = '<div class="sheet">' + BIM.sheetHead("Request for Support: MTSS/RTI Team") +
      '<table class="sheet-meta"><tr><td>Student: <b>' + esc(name) + "</b></td><td>Grade: <b>" + esc(v("rfs-grade")) + "</b></td></tr>" +
      "<tr><td>Teacher: <b>" + esc(v("rfs-teacher")) + "</b></td><td>Date prepared: <b>" + fmt(new Date().toISOString().slice(0, 10)) + "</b></td></tr></table>" +
      '<div class="ct-box"><b>Area of concern</b><p>' + para(v("rfs-concern")) + "</p></div>" +
      '<div class="grid g2" style="gap:10px"><div class="ct-box"><b>Student strengths</b><p>' + para(v("rfs-strengths"), 220) + '</p></div><div class="ct-box"><b>Likely function of the behavior</b><p>' +
      ($("rfs-fn").value ? esc(FUNCTIONS[$("rfs-fn").value].name) + ": " + esc(FUNCTIONS[$("rfs-fn").value].hint) : "Not yet determined") + "</p></div></div>" +
      '<div class="ct-box"><b>What I am asking the team for</b><p>' + esc($("rfs-ask").value) + (v("rfs-asknote") ? ". " + esc(v("rfs-asknote")) : "") + "</p></div>" +

      "<h3>Tier 1 documentation summary</h3><ul class=\"checklist\">" +
      chk(intLogs.length > 0, "<b>" + intLogs.length + "</b> documented intervention log entr" + (intLogs.length === 1 ? "y" : "ies")) +
      chk(ids.length >= 2, "<b>" + ids.length + "</b> different Tier 1 interventions tried") +
      chk(types.prevent || types.teach, "Includes a Prevent or Teach strategy") +
      chk(span >= 14, "Documented over <b>" + span + "</b> days (at least 2-3 weeks recommended)") +
      chk(comms.length >= 3, "<b>" + comms.length + "</b> logged parent/guardian communications (3 required before a Level 3 \"little/no change\" referral)") +
      chk(days >= 10, "<b>" + days + "</b> days of Daily Behavior Report data") + "</ul>" +

      "<h3>Tier 1 interventions tried</h3>" + (ids.length ? '<table class="sheet-grid"><thead><tr><th>Intervention</th><th>Type</th><th>Times logged</th><th>First</th><th>Last</th></tr></thead><tbody>' +
        ids.map(function (id) { var u = used[id]; return "<tr><td>" + esc(INTERVENTIONS[id].name) + "</td><td>" + esc(TYPES[INTERVENTIONS[id].type].name) + "</td><td>" + u.n + "</td><td>" + fmt(u.first) + "</td><td>" + fmt(u.last) + "</td></tr>"; }).join("") + "</tbody></table>" : "<p>None logged yet.</p>") +

      "<h3>Parent/guardian communications</h3>" + (comms.length ? '<table class="sheet-grid"><thead><tr><th>Date</th><th>How</th><th>Summary</th></tr></thead><tbody>' +
        comms.map(function (l) { var c = l.contact || {}; return "<tr><td>" + fmt(c.date || l.date) + "</td><td>" + esc(c.method || "") + (c.with ? " (" + esc(c.with) + ")" : "") + "</td><td>" + esc(c.summary || (l.type === "COMMUNICATION" ? l.text : "")) + "</td></tr>"; }).join("") + "</tbody></table>" : "<p>None logged yet.</p>") +

      "<h3>Progress monitoring: Daily Behavior Report</h3>" + (track ? BIM.trendChart(track, { label: name }) +
        '<p><b>' + esc(dec.title) + ".</b> " + esc(dec.text) + "</p>" +
        "<p>Intervention periods: " + track.phases.map(function (p) { return esc(p.int && INTERVENTIONS[p.int] ? INTERVENTIONS[p.int].name : "Not specified") + " (from " + fmt(p.start) + ")"; }).join("; ") + ".</p>" +
        "<p>Behaviors rated: " + esc(track.items.join(" ")) + "</p>"
        : "<p>No Daily Behavior Report data on this device. Track it in Classroom Tools &rarr; Daily Behavior Report.</p>") +

      "<h3>Log history</h3>" + '<table class="sheet-grid"><thead><tr><th>Date</th><th>Type</th><th>Behavior</th><th>Intervention(s)</th><th>Response</th></tr></thead><tbody>' +
        logs.map(function (l) { return "<tr><td>" + fmt(l.date) + "</td><td>" + esc(l.type) + "</td><td>" + esc((l.behaviors || []).map(function (b) { return "L" + b.level + " " + b.name; }).join("; ")) + "</td><td>" +
          esc((l.ints || []).map(function (id) { return INTERVENTIONS[id] ? INTERVENTIONS[id].name : id; }).join("; ")) + "</td><td>" + esc(l.response || "") + "</td></tr>"; }).join("") + "</tbody></table>" +

      '<h3>For the team</h3><div class="ct-box"><b>Team decision</b><p><span class="box"></span> Continue Tier 1 with adjustments &nbsp; <span class="box"></span> Add Tier 2 support &nbsp; <span class="box"></span> Further assessment &nbsp; <span class="box"></span> Other</p><p class="rl"></p><p class="rl"></p></div>' +
      '<p class="sheet-sign">Next review date: ____________ &nbsp; Team members: ____________________________________________</p>' +
      '<p class="sheet-cite">Prepared with The Broncho Intervention Menu. Tier 1 process and decision rules: RTI Handbook; Sunnyside Behavior Intervention Matrix.</p></div>';
    return h;
  }
  $("rfs-print").addEventListener("click", function () { BIM.printHTML(packet()); });
})();
