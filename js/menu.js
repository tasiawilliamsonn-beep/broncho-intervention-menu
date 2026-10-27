/* Intervention Menu: behavior selection, function matching, ranked interventions. */
(function () {
  var plan = BIM.getPlan();
  var sel = {};            // key -> true; keys are "behaviorId:variantIndex", "L3:i", "L4:i"
  var funcs = {};          // function id -> true
  var funcsTouched = false;
  var typeFilter = "all";
  var esc = BIM.esc;

  (plan.behaviors || []).forEach(function (b) { sel[b.key] = true; });
  (plan.functions || []).forEach(function (f) { funcs[f] = true; });
  if ((plan.functions || []).length) funcsTouched = true;
  var qf = (location.search.match(/[?&]f=([a-z]+)/g) || []).map(function (m) { return m.split("=")[1]; }).filter(function (f) { return FUNCTIONS[f]; });
  if (qf.length) { funcs = {}; qf.forEach(function (f) { funcs[f] = true; }); funcsTouched = true; }
  plan.interventions = plan.interventions || [];

  var byId = {};
  BEHAVIORS.forEach(function (b) { byId[b.id] = b; });

  function selectedBehaviors() {
    var out = [];
    Object.keys(sel).forEach(function (k) {
      var p = k.split(":"), i = +p[1];
      if (p[0] === "L3") out.push({ key: k, bid: "L3", level: 3, name: LEVEL3[i], look: LEVEL3[i], f: [] });
      else if (p[0] === "L4") out.push({ key: k, bid: "L4", level: 4, name: LEVEL4[i], look: LEVEL4[i], f: [] });
      else if (byId[p[0]] && byId[p[0]].v[i]) {
        var b = byId[p[0]];
        out.push({ key: k, bid: b.id, level: b.level, name: b.name, look: b.v[i].t, f: b.v[i].f });
      }
    });
    return out;
  }

  function save() {
    var sb = selectedBehaviors();
    plan.behaviors = sb.map(function (b) { return { key: b.key, bid: b.bid, level: b.level, name: b.name, look: b.look }; });
    plan.functions = Object.keys(funcs);
    BIM.setPlan(plan);
  }

  /* ---------- left panel ---------- */
  function renderBehaviors() {
    var html = "";
    [1, 2].forEach(function (lvl) {
      html += '<div class="lvl-head"><span class="lvl-badge l' + lvl + '">Level ' + lvl + "</span>" + esc(LEVELS[lvl].who) + "</div>";
      BEHAVIORS.filter(function (b) { return b.level === lvl; }).forEach(function (b) {
        var n = b.v.filter(function (_, i) { return sel[b.id + ":" + i]; }).length;
        html += '<details class="beh"' + (n ? " open" : "") + "><summary>" + esc(b.name) + (n ? '<span class="count">' + n + "</span>" : "") + '</summary><div class="vs-list">';
        b.v.forEach(function (v, i) {
          var k = b.id + ":" + i;
          html += '<label class="opt"><input type="checkbox" data-k="' + k + '"' + (sel[k] ? " checked" : "") + "><span>" + esc(v.t) + "</span></label>";
        });
        html += "</div>" + (b.note ? '<div class="note">' + esc(b.note) + "</div>" : "") + "</details>";
      });
    });
    [[3, LEVEL3, "L3"], [4, LEVEL4, "L4"]].forEach(function (g) {
      var n = g[1].filter(function (_, i) { return sel[g[2] + ":" + i]; }).length;
      html += '<div class="lvl-head"><span class="lvl-badge l' + g[0] + '">Level ' + g[0] + "</span>" + esc(LEVELS[g[0]].who) + "</div>";
      html += '<details class="beh"' + (n ? " open" : "") + "><summary>Level " + g[0] + " behaviors" + (n ? '<span class="count">' + n + "</span>" : "") + '</summary><div class="vs-list">';
      g[1].forEach(function (t, i) {
        var k = g[2] + ":" + i;
        html += '<label class="opt"><input type="checkbox" data-k="' + k + '"' + (sel[k] ? " checked" : "") + "><span>" + esc(t) + "</span></label>";
      });
      html += "</div></details>";
    });
    document.getElementById("behaviors").innerHTML = html;
  }

  function autoFuncs() {
    var f = {};
    selectedBehaviors().forEach(function (b) { b.f.forEach(function (x) { f[x] = true; }); });
    return f;
  }

  function renderFunctions() {
    if (!funcsTouched) funcs = autoFuncs();
    document.getElementById("functions").innerHTML = Object.keys(FUNCTIONS).map(function (id) {
      return '<button type="button" class="chip" data-f="' + id + '" aria-pressed="' + (!!funcs[id]) + '" title="' + esc(FUNCTIONS[id].hint) + '">' + esc(FUNCTIONS[id].name) + "</button>";
    }).join("");
  }

  /* ---------- results ---------- */
  function rank(sb) {
    var scores = {}, why = {};
    sb.forEach(function (b) {
      var beh = byId[b.bid]; if (!beh) return;
      beh.ints.forEach(function (id, pos) {
        scores[id] = (scores[id] || 0) + 4 + Math.max(0, 3 - pos * 0.25);
        (why[id] = why[id] || {})[beh.name] = true;
      });
    });
    var fl = Object.keys(funcs);
    Object.keys(scores).forEach(function (id) {
      var it = INTERVENTIONS[id];
      var fit = it.functions.filter(function (f) { return fl.indexOf(f) > -1; }).length;
      scores[id] += fit * 3 + (it.m ? 1 : 0);
    });
    return Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; }).map(function (id) {
      return { id: id, score: scores[id], for: Object.keys(why[id]) };
    });
  }
  /* No behavior chosen, but a function is (e.g., arriving from the ABC organizer) */
  function rankByFunction() {
    var fl = Object.keys(funcs);
    return Object.keys(INTERVENTIONS).map(function (id) {
      var it = INTERVENTIONS[id];
      var fit = it.functions.filter(function (f) { return fl.indexOf(f) > -1; });
      return { id: id, score: fit.length / it.functions.length * 4 + fit.length * 2 + (it.m ? 0.5 : 0), for: fit.map(function (f) { return FUNCTIONS[f].name; }) };
    }).filter(function (r) { return r.for.length; }).sort(function (a, b) { return b.score - a.score; });
  }

  function card(r, best) {
    var it = INTERVENTIONS[r.id];
    var fl = Object.keys(funcs);
    var fits = it.functions.filter(function (f) { return fl.indexOf(f) > -1; });
    var inPlan = plan.interventions.indexOf(r.id) > -1;
    return '<article class="int ' + it.type + '">' +
      '<div class="int-top"><div><h3>' + esc(it.name) + "</h3>" +
      '<div class="tags"><span class="tag type ' + it.type + '">' + TYPES[it.type].name + "</span>" +
      (best ? '<span class="tag fit">Top match</span>' : "") +
      (it.m ? '<span class="tag pill m">On the Sunnyside matrix</span>' : "") +
      fits.map(function (f) { return '<span class="tag fit">Fits: ' + esc(FUNCTIONS[f].name) + "</span>"; }).join("") +
      '<span class="tag">' + esc(it.time) + "</span></div></div>" +
      '<button type="button" class="btn sm add" data-add="' + r.id + '" aria-pressed="' + inPlan + '">' + (inPlan ? "✓ In my plan" : "+ Add to my plan") + "</button></div>" +
      "<p>" + esc(it.summary) + "</p>" +
      "<ol>" + it.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
      '<div class="why"><b>Research basis:</b> ' + esc(it.research) + "</div>" +
      '<p class="hint" style="margin:8px 0 0">Matched to: ' + esc(r.for.join(", ")) + "</p>" +
      "<details><summary>Full citations</summary><ul>" + it.refs.map(function (k) { return '<li class="cite">' + esc(REFS[k]) + "</li>"; }).join("") + "</ul></details>" +
      "</article>";
  }

  function renderResults() {
    var sb = selectedBehaviors();
    var alerts = "", levels = {};
    sb.forEach(function (b) { levels[b.level] = true; });

    if (levels[4]) alerts += '<div class="alert red"><h3>Level 4: contact an administrator immediately</h3><p>Ensure safety first. Do not wait to finish a log. After an administrator is involved, log the incident as <b>DISCIPLINE</b> with objective facts. The Tier 1 menu is not the response to a Level 4 behavior.</p></div>';
    if (levels[3]) alerts += '<div class="alert red"><h3>Level 3: office referral (DISCIPLINE log)</h3><p>This behavior is for an administrator to address. Use the <a href="log.html">Log Builder</a> to write an objective DISCIPLINE entry and list the Tier 1 interventions you already documented. If you chose "little/no change in Level 2 behaviors," the matrix requires at least <b>three logged parent/guardian communications</b> first.</p></div>';
    if (levels[2]) alerts += '<div class="alert warn"><h3>Level 2: parent notification is required</h3><p>Handle it in the classroom with the interventions below, log each one as <b>INTERVENTION</b>, and contact the family as a partner (log that call or email as <b>COMMUNICATION</b>). Do not log Level 2 behaviors as DISCIPLINE.</p></div>';
    if (levels[1] && !levels[2] && !levels[3] && !levels[4]) alerts += '<div class="alert ok"><h3>Level 1: handled within the classroom</h3><p>Choose 2 or 3 interventions below, use them consistently, and log as <b>INTERVENTION</b> including what you did and how the student responded. Do not log Level 1 behaviors as DISCIPLINE.</p></div>';
    document.getElementById("alerts").innerHTML = alerts;

    var tier = sb.filter(function (b) { return b.level <= 2; });
    var out = document.getElementById("results");
    var byFn = !tier.length && !sb.length && Object.keys(funcs).length;
    if (!tier.length && !byFn) {
      out.innerHTML = sb.length ? "" : '<div class="panel empty"><img src="img/broncho-logo.png" alt=""><h2 style="text-transform:uppercase">Start with what you see</h2><p>Open a behavior on the left and check what it looks like in your classroom. You can choose more than one.</p>' + legend() + "</div>";
      return;
    }
    var ranked = byFn ? rankByFunction() : rank(tier);
    var counts = { all: ranked.length };
    ranked.forEach(function (r) { var t = INTERVENTIONS[r.id].type; counts[t] = (counts[t] || 0) + 1; });
    var shown = ranked.filter(function (r) { return typeFilter === "all" || INTERVENTIONS[r.id].type === typeFilter; });
    var html = '<div class="res-head"><h2>' + ranked.length + " matched Tier 1 interventions</h2>" +
      '<div class="filters" role="group" aria-label="Filter by type">' +
      ["all", "prevent", "teach", "reinforce", "respond"].map(function (t) {
        return '<button type="button" class="chip" data-type="' + t + '" aria-pressed="' + (typeFilter === t) + '">' + (t === "all" ? "All" : TYPES[t].name) + " (" + (counts[t] || 0) + ")</button>";
      }).join("") + "</div></div>";
    if (byFn) html += '<div class="alert ok"><p>Showing interventions matched to the <b>function</b> you chose. Add the behavior on the left to rank them by behavior too and see the matrix level.</p></div>';
    html += '<p class="hint">Ranked by how directly each one addresses the behaviors you chose and the likely function. A strong plan uses at least one <b>Prevent</b> or <b>Teach</b> strategy, plus <b>Reinforce</b>, not only in-the-moment responses.</p>';
    var notes = tier.map(function (b) { return byId[b.bid].note; }).filter(Boolean);
    notes.filter(function (n, i) { return notes.indexOf(n) === i; }).forEach(function (n) { html += '<div class="alert warn"><p>' + esc(n) + "</p></div>"; });
    html += shown.map(function (r, i) { return card(r, typeFilter === "all" && i < 3); }).join("");
    out.innerHTML = html;
  }

  function legend() {
    return '<div class="legend" style="text-align:left;margin-top:18px">' + Object.keys(TYPES).map(function (t) {
      return '<div class="' + t + '"><b>' + TYPES[t].name + "</b>" + esc(TYPES[t].verb) + "</div>";
    }).join("") + "</div>";
  }

  function renderPlanBar() {
    var n = plan.interventions.length;
    document.getElementById("plan-sum").innerHTML = n
      ? "<b>" + n + "</b> intervention" + (n > 1 ? "s" : "") + " in your plan: " + esc(plan.interventions.map(function (id) { return INTERVENTIONS[id].name; }).join(", "))
      : "Your plan is empty. Add interventions you will try.";
  }

  function renderAll() { renderBehaviors(); renderFunctions(); renderResults(); renderPlanBar(); }

  document.getElementById("conlist").innerHTML = "<p>These may be appropriate under the matrix, but on their own they do not count as Tier 1 intervention, and they should not be the first response to a Level 1 or 2 behavior.</p><ul class=\"check x\">" +
    CONSEQUENCES.map(function (c) { return "<li><b>" + esc(c.name) + ".</b> " + esc(c.why) + "</li>"; }).join("") + "</ul>";

  document.addEventListener("change", function (e) {
    var k = e.target.getAttribute && e.target.getAttribute("data-k");
    if (!k) return;
    if (e.target.checked) sel[k] = true; else delete sel[k];
    renderFunctions(); renderResults(); save();
    var d = e.target.closest("details.beh");
    var n = d.querySelectorAll("input:checked").length;
    var c = d.querySelector(".count");
    if (n && !c) { c = document.createElement("span"); c.className = "count"; d.querySelector("summary").appendChild(c); }
    if (c) { if (n) c.textContent = n; else c.remove(); }
  });

  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-f]");
    if (f) {
      funcsTouched = true;
      var id = f.getAttribute("data-f");
      if (funcs[id]) delete funcs[id]; else funcs[id] = true;
      renderFunctions(); renderResults(); save();
      return;
    }
    var t = e.target.closest("[data-type]");
    if (t) { typeFilter = t.getAttribute("data-type"); renderResults(); return; }
    var a = e.target.closest("[data-add]");
    if (a) {
      var id2 = a.getAttribute("data-add"), i = plan.interventions.indexOf(id2);
      if (i > -1) plan.interventions.splice(i, 1); else plan.interventions.push(id2);
      save(); renderResults(); renderPlanBar();
      BIM.toast(i > -1 ? "Removed from your plan" : "Added to your plan");
    }
  });

  document.getElementById("clear").addEventListener("click", function () {
    sel = {}; funcs = {}; funcsTouched = false; plan.interventions = [];
    save(); renderAll();
  });
  document.getElementById("print").addEventListener("click", function () { window.print(); });

  renderAll();
})();
