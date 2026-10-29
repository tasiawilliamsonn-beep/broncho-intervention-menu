/* Essential Behaviors: prioritize essential academic and social behaviors, then plan and print
   a behavior lesson to teach one like an academic standard. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = "bim.essential.v1";
  var st = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  st.r = st.r || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var TYPES2 = { academic: ["Academic behaviors", "skill-based: the habits students need to learn"], social: ["Social behaviors", "will-based: how students choose to treat others and themselves"] };

  function item(type, i) { return ESSENTIAL[type][i]; }
  function renderRate() {
    $("es-rate").innerHTML = Object.keys(ESSENTIAL).map(function (type) {
      return '<div class="panel" style="margin-bottom:16px"><header><h2>' + TYPES2[type][0] + '</h2><span class="hint">' + TYPES2[type][1] + '</span></header><div class="body">' +
        ESSENTIAL[type].map(function (b, i) {
          var k = type.charAt(0) + i, v = st.r[k] || {};
          return '<div class="es-row"><div><b>' + esc(b.n) + '</b> <span class="pill m">' + esc(b.h) + '</span><p class="hint" style="margin:2px 0 0">' + esc(b.looks) + "</p></div>" +
            '<div class="es-sel"><label>Impact on learning<select data-es="' + k + '" data-f="i"><option value="">-</option><option value="1"' + (v.i == 1 ? " selected" : "") + '>Low</option><option value="2"' + (v.i == 2 ? " selected" : "") + '>Medium</option><option value="3"' + (v.i == 3 ? " selected" : "") + ">High</option></select></label>" +
            '<label>Students who struggle<select data-es="' + k + '" data-f="n"><option value="">-</option><option value="1"' + (v.n == 1 ? " selected" : "") + '>Few</option><option value="2"' + (v.n == 2 ? " selected" : "") + '>Some</option><option value="3"' + (v.n == 3 ? " selected" : "") + ">Many</option></select></label></div></div>";
        }).join("") + "</div></div>";
    }).join("");
  }
  function ranked(type) {
    return ESSENTIAL[type].map(function (b, i) { var v = st.r[type.charAt(0) + i] || {}; return { b: b, i: i, type: type, s: (+v.i || 0) * (+v.n || 0) }; })
      .filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
  }
  function renderPriority() {
    var h = "";
    Object.keys(ESSENTIAL).forEach(function (type) {
      var list = ranked(type).slice(0, 3);
      h += '<h3 class="fc-h">' + TYPES2[type][0] + "</h3>" + (list.length ? '<ol class="fc-top">' + list.map(function (x) {
        return "<li><b>" + esc(x.b.n) + '</b> <span class="hint">(priority ' + x.s + '/9)</span> <button class="btn ghost sm" type="button" data-teach="' + x.type + ":" + x.i + '">Plan a lesson</button></li>';
      }).join("") + "</ol>" : '<p class="hint">Rate impact and need for each behavior to see your top 3.</p>');
    });
    h += '<p class="hint">Priority = impact on learning &times; how many students struggle. Focus Tier 1 teaching on your top 3 academic and top 3 social behaviors.</p>' +
      '<button class="btn dark" type="button" id="es-print-list">Print our essential behaviors</button>';
    $("es-priority").innerHTML = h;
  }

  /* ---------- lesson plan ---------- */
  var FIELDS = [["define", "What it looks like (observable)"], ["why", "Why it matters"], ["ido", "I do: model it"], ["ex", "Example and non-example"], ["wedo", "We do: practice together"],
    ["youdo", "You do: show it in real class time"], ["prompt", "Prompts and pre-corrections"], ["reinforce", "Reinforce it"], ["monitor", "Monitor and re-teach"]];
  function defaults(b) {
    return {
      define: b.looks,
      why: "This behavior helps everyone learn and shows " + b.h + " in our classroom. Explain it to students in your own words, connected to your class.",
      ido: "Name the behavior and model it out loud, thinking aloud about each step: \"Watch what I do when...\"",
      ex: "Show one quick example and one non-example (acted by the teacher, never by calling out a student). Ask: \"What was different? Which one shows " + b.h + "?\"",
      wedo: "Students role-play two short scenarios where this behavior is needed (for example, during independent work and during group work). Give specific feedback after each try.",
      youdo: "Students show the behavior during real class time today. Watch for it and give behavior-specific praise the first time you see it.",
      prompt: "Pre-correct right before the times it is needed most. Point to the HEART poster as a quick reminder.",
      reinforce: "Name the behavior and the HEART value: \"I noticed you [describe what you saw]. That's " + b.h + ".\" Pair Broncho Bucks with specific praise, often at first, then less often.",
      monitor: "Do a quick tally of how many students show the behavior for one week. Re-teach after long breaks or when the tally drops. Students who still struggle get a self-monitoring card or Daily Behavior Report."
    };
  }
  var cur = null;
  function openPlan(key) {
    var p = key.split(":"), b = item(p[0], +p[1]);
    cur = { key: key, b: b, type: p[0] };
    var saved = (st.plans || {})[key] || defaults(b);
    $("es-plan").hidden = false;
    $("es-plan-title").textContent = "Behavior lesson: " + b.n;
    $("es-fields").innerHTML = FIELDS.map(function (f) { return '<label class="f" for="es-' + f[0] + '">' + f[1] + '</label><textarea id="es-' + f[0] + '" data-pf="' + f[0] + '">' + esc(saved[f[0]] || "") + "</textarea>"; }).join("") +
      '<p class="hint" style="margin-top:8px">Matched interventions from the menu for students who need more: ' + esc(b.ints.map(function (id) { return INTERVENTIONS[id] ? INTERVENTIONS[id].name : id; }).join(", ")) + ".</p>";
    $("es-plan").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function planData() { var d = {}; FIELDS.forEach(function (f) { d[f[0]] = $("es-" + f[0]).value; }); return d; }
  function planSheet() {
    var d = planData(), b = cur.b;
    return '<div class="sheet">' + window.BIMSheetHead("Essential Behavior Lesson Plan") +
      '<table class="sheet-meta"><tr><td>Behavior: <b>' + esc(b.n) + "</b></td><td>Type: <b>" + (cur.type === "academic" ? "Academic (skill)" : "Social (will)") + "</b> &middot; HEART: <b>" + esc(b.h) + "</b></td></tr>" +
      "<tr><td>Teacher/team: ______________________</td><td>Date taught: __________ &nbsp; Re-teach: __________</td></tr></table>" +
      FIELDS.map(function (f) { return '<div class="ct-box"><b>' + esc(f[1]) + "</b><p>" + esc(d[f[0]]).replace(/\n/g, "<br>") + "</p></div>"; }).join("") +
      '<p class="sheet-cite">Framework: essential academic and social behaviors taught and reinforced at Tier 1 (Hannigan, Djabrayan Hannigan, Mattos, &amp; Buffum, 2020). Explicit instruction of expectations: Center on PBIS (2022); Fairbanks et al. (2007).</p></div>';
  }

  $("es-rate").addEventListener("change", function (e) {
    var k = e.target.getAttribute("data-es"); if (!k) return;
    st.r[k] = st.r[k] || {}; st.r[k][e.target.getAttribute("data-f")] = e.target.value; save(); renderPriority();
  });
  $("es-priority").addEventListener("click", function (e) {
    var b = e.target.closest("[data-teach]"); if (b) openPlan(b.getAttribute("data-teach"));
    if (e.target.id === "es-print-list") {
      var rows = [];
      Object.keys(ESSENTIAL).forEach(function (type) { ranked(type).slice(0, 3).forEach(function (x) { rows.push({ t: type, b: x.b }); }); });
      if (!rows.length) { BIM.toast("Rate the behaviors first"); return; }
      window.BIMPrint('<div class="sheet poster">' + window.BIMSheetHead("Our Essential Behaviors") +
        ["academic", "social"].map(function (type) {
          var r = rows.filter(function (x) { return x.t === type; }); if (!r.length) return "";
          return "<h3>" + TYPES2[type][0] + '</h3><table class="sheet-grid"><thead><tr><th>Behavior</th><th>What it looks like</th><th>HEART</th></tr></thead><tbody>' +
            r.map(function (x) { return "<tr><td><b>" + esc(x.b.n) + "</b></td><td>" + esc(x.b.looks) + "</td><td>" + esc(x.b.h) + "</td></tr>"; }).join("") + "</tbody></table>";
        }).join("") + '<p class="sheet-cite">Hannigan, Djabrayan Hannigan, Mattos, &amp; Buffum (2020), Behavior Solutions.</p></div>');
    }
  });
  $("es-fields").addEventListener("input", function () { if (!cur) return; st.plans = st.plans || {}; st.plans[cur.key] = planData(); save(); });
  $("es-plan-print").addEventListener("click", function () { if (cur) window.BIMPrint(planSheet()); });
  $("es-plan-reset").addEventListener("click", function () { if (!cur) return; if (st.plans) delete st.plans[cur.key]; save(); openPlan(cur.key); });

  renderRate(); renderPriority();
})();
