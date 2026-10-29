/* Daily Behavior Report tracking: enter each day's checks, graph progress, apply decision rules. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var all = BIM.getTrack(), cur = null, marks = [];
  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function fmt(d) { var p = d.split("-"); return +p[1] + "/" + +p[2] + "/" + p[0]; }
  function save() { if (!BIM.setTrack(all)) BIM.toast("This browser blocked saving."); }
  function setupItems() {
    var items = Array.prototype.filter.call(document.querySelectorAll(".dbr-item"), function (c) { return c.checked; }).map(function (c) { return c.getAttribute("data-t"); });
    if ($("dbr-extra").value.trim()) items.push($("dbr-extra").value.trim());
    if ($("dbr-hw").checked) items.push("The student completed and turned in classwork and homework.");
    return items;
  }
  function intName(id) { return id && INTERVENTIONS[id] ? INTERVENTIONS[id].name : "Not specified"; }

  function list() {
    $("trk-list").innerHTML = Object.keys(all).sort().map(function (k) { return '<option value="' + esc(all[k].name || k) + '">'; }).join("");
  }
  function open(name) {
    var k = BIM.skey(name); if (!k) { BIM.toast("Enter the student's initials or ID"); return; }
    if (!all[k]) {
      var items = setupItems();
      if (!items.length) { BIM.toast("Choose behaviors to rate in the setup above first"); return; }
      all[k] = { name: name.trim(), items: items, goal: +$("dbr-goal").value || 80, phases: [{ start: today(), int: $("dbr-int").value }], days: {} };
      save(); list(); BIM.toast("Tracking started for " + name.trim());
    }
    cur = k; render();
  }
  function render() {
    var box = $("trk-body");
    if (!cur || !all[cur]) { box.innerHTML = '<p class="hint">Enter a student and choose <b>Start or open</b>. Tracking uses the behaviors, goal, and intervention from the setup above.</p>'; return; }
    var r = all[cur], date = $("trk-date") ? $("trk-date").value : today();
    marks = (r.days[date] || r.items.map(function () { return null; })).slice();
    var phase = r.phases[r.phases.length - 1];
    var dec = BIM.decision(r);
    var pts = BIM.series(r);
    box.innerHTML =
      '<div class="trk-head"><div><b>' + esc(r.name) + "</b> &middot; Goal: " + r.goal + "% of checks &middot; Current intervention: <b>" + esc(intName(phase.int)) + "</b> (since " + fmt(phase.start) + ")</div></div>" +
      '<div class="grid g2" style="align-items:start;gap:18px">' +
      '<div><label class="f" for="trk-date">Day</label><input type="date" id="trk-date" value="' + date + '">' +
      '<table class="trk-table"><tbody>' + r.items.map(function (t, i) {
        return "<tr><td>" + esc(t) + '</td><td class="trk-btns"><button type="button" class="ckbtn yes" data-m="' + i + '" data-v="1" aria-pressed="' + (marks[i] === 1) + '" aria-label="Check">&#10003;</button>' +
          '<button type="button" class="ckbtn no" data-m="' + i + '" data-v="0" aria-pressed="' + (marks[i] === 0) + '" aria-label="X">&#10007;</button></td></tr>';
      }).join("") + "</tbody></table>" +
      '<button class="btn" type="button" id="trk-save">Save this day</button></div>' +
      '<div><div class="alert ' + (dec.cls || "tipbox") + '"><h3>' + esc(dec.title) + "</h3><p>" + esc(dec.text) + "</p></div>" +
      '<label class="f" for="trk-newint">Changing the intervention?</label><div class="row2"><select id="trk-newint"><option value="">Choose the new intervention...</option>' +
      Object.keys(INTERVENTIONS).map(function (id) { return '<option value="' + id + '">' + esc(INTERVENTIONS[id].name) + "</option>"; }).join("") +
      '</select><button class="btn dark sm" type="button" id="trk-phase">Start new period today</button></div></div></div>' +
      '<h3 class="fc-h" style="margin-top:16px">Progress: % of checks each day</h3>' + BIM.trendChart(r, { label: r.name }) +
      (pts.length ? '<details style="margin-top:8px"><summary>Data table</summary><table class="hist"><thead><tr><th>Date</th><th>Checks</th><th>%</th><th></th></tr></thead><tbody>' +
        pts.slice().reverse().map(function (p) { return "<tr><td>" + fmt(p.d) + "</td><td>" + p.yes + " of " + p.n + "</td><td>" + p.pct + '%</td><td><button class="btn ghost sm" type="button" data-del="' + p.d + '">Delete</button></td></tr>'; }).join("") + "</tbody></table></details>" : "") +
      '<p class="hint" style="margin-top:10px">Saved on this device. The Request for Support packet in the Log Builder includes this graph. <button class="btn ghost sm" type="button" id="trk-remove">Stop tracking this student</button></p>';
  }

  $("trk-open").addEventListener("click", function () { open($("trk-student").value); });
  $("trk-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-m]");
    if (b) {
      var i = +b.getAttribute("data-m"), v = +b.getAttribute("data-v");
      marks[i] = marks[i] === v ? null : v;
      b.parentNode.querySelectorAll("[data-m]").forEach(function (x) { x.setAttribute("aria-pressed", marks[i] === +x.getAttribute("data-v")); });
      return;
    }
    var r = all[cur]; if (!r) return;
    if (e.target.id === "trk-save") {
      if (!marks.some(function (m) { return m === 0 || m === 1; })) { BIM.toast("Mark at least one behavior"); return; }
      var d = $("trk-date").value;
      r.days[d] = marks.slice();
      if (r.phases.length === 1 && d < r.phases[0].start) r.phases[0].start = d;
      save(); BIM.toast("Day saved"); render();
    } else if (e.target.id === "trk-phase") {
      var id = $("trk-newint").value; if (!id) { BIM.toast("Choose the new intervention"); return; }
      r.phases.push({ start: today(), int: id }); save(); BIM.toast("New intervention period started"); render();
    } else if (e.target.hasAttribute("data-del")) {
      if (!confirm("Delete this day's data?")) return;
      delete r.days[e.target.getAttribute("data-del")]; save(); render();
    } else if (e.target.id === "trk-remove") {
      if (!confirm("Stop tracking " + r.name + " and delete all of this student's daily data on this device?")) return;
      delete all[cur]; cur = null; save(); list(); render();
    }
  });
  $("trk-body").addEventListener("change", function (e) { if (e.target.id === "trk-date") render(); });
  list(); render();
})();
