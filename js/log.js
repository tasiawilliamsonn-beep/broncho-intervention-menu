/* PowerSchool Log Builder: log type from the matrix, objective-language check, Proof of Intervention record. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var plan = BIM.getPlan();
  var logs = BIM.getLogs();
  var state = { purpose: "behavior", behaviors: [], ints: [], heart: [], showAll: false };

  var HEART = ["Honesty", "Effort", "Attitude", "Respect", "Teamwork"];
  var SUBJECTIVE = [
    [/\b(disrespectful|rude)\b/i, "\"disrespectful/rude\": describe the words or actions instead (e.g., said \"...\" in a raised voice)."],
    [/\blazy\b|\bunmotivated\b|\bdoesn'?t care\b/i, "\"lazy/unmotivated\": describe the work behavior (e.g., completed 1 of 10 problems in 20 minutes)."],
    [/\b(bad|negative|poor) attitude\b|\battitude\b/i, "\"attitude\": name the observable behavior (eye rolling, sighing, muttering \"...\")."],
    [/\balways\b|\bnever\b|\bconstantly\b/i, "\"always/never/constantly\": give a count or time frame (e.g., 4 times this period)."],
    [/\bdefian(t|ce)\b/i, "\"defiant\": describe the direction given and the student's response. \"Overt defiance\" is a Level 3 term; use it only for a Level 3 referral."],
    [/\b(out of control|crazy|wild|psycho)\b/i, "Avoid labels; describe what the student did and for how long."],
    [/\b(liar|lied|sneaky|manipulative)\b/i, "Avoid judgments of intent; record what was said and what you observed."],
    [/\b(annoying|obnoxious|whin(y|ing)|mean|brat|terrible|awful|horrible)\b/i, "Avoid judgmental words; record the observable behavior."],
    [/\bhates?\b/i, "Avoid guessing feelings; quote what the student said."],
    [/\bADHD\b|\bbipolar\b|\bautis(m|tic)\b|\bdisorder\b/i, "Do not diagnose or reference a disability in a behavior log."]
  ];

  var byId = {};
  BEHAVIORS.forEach(function (b) { byId[b.id] = b; });

  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function fmtDate(s) { if (!s) return ""; var p = s.split("-"); return p[1] + "/" + p[2] + "/" + p[0]; }
  function key(s) { return String(s || "").trim().toUpperCase(); }

  /* ---------- behavior pickers ---------- */
  function fillBehaviorSelect() {
    var h = '<option value="">Choose a behavior...</option>';
    [1, 2].forEach(function (l) {
      h += '<optgroup label="Level ' + l + ': ' + LEVELS[l].who + '">';
      BEHAVIORS.filter(function (b) { return b.level === l; }).forEach(function (b) { h += '<option value="' + b.id + '">' + esc(b.name) + "</option>"; });
      h += "</optgroup>";
    });
    h += '<optgroup label="Level 3: Office referral">' + LEVEL3.map(function (t, i) { return '<option value="L3:' + i + '">' + esc(t) + "</option>"; }).join("") + "</optgroup>";
    h += '<optgroup label="Level 4: Contact administrator immediately">' + LEVEL4.map(function (t, i) { return '<option value="L4:' + i + '">' + esc(t) + "</option>"; }).join("") + "</optgroup>";
    $("beh").innerHTML = h;
    fillLook();
  }
  function fillLook() {
    var v = $("beh").value, b = byId[v];
    $("look").innerHTML = b ? b.v.map(function (x, i) { return '<option value="' + i + '">' + esc(x.t) + "</option>"; }).join("") : '<option value="">(not needed)</option>';
    $("look").disabled = !b;
  }
  function addBehavior(entry) {
    if (state.behaviors.some(function (b) { return b.key === entry.key; })) return;
    state.behaviors.push(entry);
  }
  function behaviorFromKey(k) {
    var p = k.split(":"), i = +p[1];
    if (p[0] === "L3") return { key: k, bid: "L3", level: 3, name: LEVEL3[i], look: LEVEL3[i] };
    if (p[0] === "L4") return { key: k, bid: "L4", level: 4, name: LEVEL4[i], look: LEVEL4[i] };
    var b = byId[p[0]]; if (!b || !b.v[i]) return null;
    return { key: k, bid: b.id, level: b.level, name: b.name, look: b.v[i].t };
  }
  function renderBehaviorList() {
    $("beh-list").innerHTML = state.behaviors.map(function (b, i) {
      return '<button type="button" class="chip" aria-pressed="true" data-rm="' + i + '" title="Remove">L' + b.level + " &middot; " + esc(b.bid.charAt(0) === "L" ? b.name : b.name + ": " + b.look) + " &times;</button>";
    }).join("") || '<span class="hint">No behavior added yet.</span>';
  }

  /* ---------- interventions ---------- */
  function suggestedInts() {
    var ids = [];
    (plan.interventions || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    state.behaviors.forEach(function (b) { var beh = byId[b.bid]; if (beh) beh.ints.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
    state.ints.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    return ids;
  }
  function renderInts() {
    var ids = state.showAll ? Object.keys(INTERVENTIONS) : suggestedInts();
    if (!ids.length) ids = Object.keys(INTERVENTIONS);
    var groups = {};
    ids.forEach(function (id) { var t = INTERVENTIONS[id].type; (groups[t] = groups[t] || []).push(id); });
    var inPlan = plan.interventions || [];
    $("int-list").innerHTML = Object.keys(TYPES).filter(function (t) { return groups[t]; }).map(function (t) {
      return '<div class="lvl-head"><span class="tag type ' + t + '">' + TYPES[t].name + "</span></div>" + groups[t].map(function (id) {
        return '<label class="opt"><input type="checkbox" data-int="' + id + '"' + (state.ints.indexOf(id) > -1 ? " checked" : "") + "><span>" + esc(INTERVENTIONS[id].name) +
          (inPlan.indexOf(id) > -1 ? ' <span class="pill ok">in plan</span>' : "") + "</span></label>";
      }).join("");
    }).join("");
    $("more-int").textContent = state.showAll ? "Show matched interventions only" : "Show all interventions";
  }

  function renderHeart() {
    $("heart").innerHTML = HEART.map(function (h) { return '<button type="button" class="chip" data-h="' + h + '" aria-pressed="' + (state.heart.indexOf(h) > -1) + '">' + h + "</button>"; }).join("");
  }

  /* ---------- records ---------- */
  function studentLogs(s) { var k = key(s); return logs.filter(function (l) { return key(l.student) === k; }); }
  function commsCount(list) { return list.filter(function (l) { return l.type === "COMMUNICATION" || (l.contact && l.contact.made); }).length; }
  function intLogs(list) { return list.filter(function (l) { return l.ints && l.ints.length; }); }

  /* ---------- core logic: decide the log type ---------- */
  function decide() {
    var lv = state.behaviors.reduce(function (m, b) { return Math.max(m, b.level); }, 0);
    var contact = $("contact-made").checked;
    var prior = studentLogs($("student").value);
    var g = []; // guard messages: [class, title, text]
    var type, sub;
    var noChange = state.behaviors.some(function (b) { return b.key === "L3:0"; });

    if (lv === 4) {
      type = "DISCIPLINE"; sub = "Level 4: contact an administrator immediately";
      g.push(["red", "Safety first", "Contact an administrator now. Do not wait to finish this log. Then log the facts as DISCIPLINE."]);
    } else if (lv === 3) {
      type = "DISCIPLINE"; sub = "Level 3: office referral";
      if (noChange) {
        var c = commsCount(prior) + (contact ? 1 : 0);
        var ni = intLogs(prior).length + (state.ints.length ? 1 : 0);
        if (c < 3) g.push(["red", "Does not yet meet the matrix requirement", "The matrix requires little/no change in Level 2 behaviors after at least three logged parent/guardian communications. This record shows " + c + " of 3. Continue Tier 1 interventions and log each contact as COMMUNICATION first."]);
        else g.push(["ok", "Matrix requirement met: " + c + " logged parent communications", "Attach a summary of the " + ni + " documented intervention entries (see the Proof of Intervention record below)."]);
        if (ni < 2) g.push(["warn", "Little documented intervention", "Only " + ni + " intervention entr" + (ni === 1 ? "y is" : "ies are") + " on this device's record for this student. A referral is strongest when it shows several matched Tier 1 interventions used over 2 to 3 weeks."]);
      } else {
        g.push(["warn", "Include prior interventions", "Even for Level 3, list any Tier 1 interventions you already used and the student's response so the administrator has the full picture."]);
      }
    } else if (state.purpose === "contact") {
      type = "COMMUNICATION"; sub = "Written or verbal parent/guardian contact";
      if (!contact) g.push(["warn", "Add the contact details", "Check \"I contacted a parent/guardian\" and describe what was shared."]);
    } else if (state.purpose === "info" && lv < 2) {
      type = "INFORMATION"; sub = lv ? "Level 1: details you would like documented" : "Details you would like documented";
    } else {
      type = "INTERVENTION"; sub = lv ? "Level " + lv + ": " + LEVELS[lv].who : "Behavior you have addressed";
      if (state.purpose === "admin") g.push(["red", "Level " + (lv || "1-2") + " behaviors are not logged as DISCIPLINE", "The matrix handles Level 1 and 2 behaviors in the classroom. This entry is set to INTERVENTION. If a Level 2 behavior has shown little or no change after at least three logged parent communications, add the Level 3 behavior \"Little/no change in Level 2 behaviors...\" instead."]);
      if (state.purpose === "info" && lv === 2) g.push(["warn", "Level 2 uses INTERVENTION or COMMUNICATION", "INFORMATION is a Level 1 option on the matrix. This entry is set to INTERVENTION."]);
      if (!state.behaviors.length) g.push(["warn", "Add the behavior", "Choose the behavior from the matrix so the level is documented."]);
      if (!state.ints.length) g.push(["red", "An INTERVENTION log must include the intervention", "Check the Tier 1 intervention(s) you used. A consequence alone (detention, loss of privilege) is not an intervention."]);
      if (lv === 2 && !contact) g.push(["warn", "Level 2 requires parent notification", "Contact the family and record it here, or log it as a separate COMMUNICATION entry."]);
      var onlyRespond = state.ints.length && state.ints.every(function (id) { return INTERVENTIONS[id].type === "respond"; });
      if (onlyRespond) g.push(["warn", "Add a Prevent or Teach strategy", "Only in-the-moment responses are checked. Research-based plans include an antecedent (Prevent) or skill-building (Teach) strategy so the behavior is less likely next time."]);
    }
    var cm = prior.length ? commsCount(prior) : 0;
    if (lv && lv <= 2 && cm) g.push(["ok", "On record for this student", intLogs(prior).length + " intervention entries and " + cm + " parent communication(s) saved on this device."]);
    return { type: type, sub: sub, level: lv, guards: g };
  }

  /* ---------- text ---------- */
  function lcFirst(s) { return /^I\b/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1); }
  function sentence(s) { s = String(s || "").trim(); if (!s) return ""; return s.charAt(0).toUpperCase() + s.slice(1) + (/[.!?"]$/.test(s) ? "" : "."); }
  function build(d) {
    var stu = $("student").value.trim() || "[Student]";
    var lines = [];
    var head = "LOG TYPE: " + d.type + (d.level ? " | Sunnyside Matrix Level " + d.level : "");
    lines.push(head);
    var when = [fmtDate($("date").value), $("period").value.trim(), $("setting").value].filter(Boolean).join(" | ");
    if (when) lines.push("When/where: " + when);
    if (d.type !== "COMMUNICATION" || state.behaviors.length) {
      if (state.behaviors.length) lines.push("Behavior: " + state.behaviors.map(function (b) { return b.bid.charAt(0) === "L" ? b.name : b.name + " (" + lcFirst(b.look) + ")"; }).join("; ") + ".");
      if ($("desc").value.trim()) lines.push("Observed: " + sentence($("desc").value));
      if ($("freq").value.trim()) lines.push("Frequency/duration: " + sentence($("freq").value));
      if (state.heart.length) lines.push("Expectation(s) missed: " + state.heart.join(", ") + ".");
    }
    if (state.ints.length) {
      lines.push("Tier 1 intervention(s): " + state.ints.map(function (id, i) {
        var it = INTERVENTIONS[id];
        return (i + 1) + ") " + it.name + ": teacher " + it.log + ($("cites").checked ? " (" + BIM.shortCite(it.refs[0]) + ")" : "");
      }).join("; ") + ".");
    } else if (d.type === "INTERVENTION") {
      lines.push("Tier 1 intervention(s): [ADD THE INTERVENTION USED]");
    }
    if ($("response").value) lines.push("Student response: " + $("response").value + ".");
    if ($("contact-made").checked) lines.push(contactLine());
    else if (d.level === 2) lines.push("Parent/guardian contact: not yet made; required for Level 2.");
    var nx = [$("next").value, $("next-note").value.trim()].filter(Boolean).join(": ");
    if (nx) lines.push("Next step: " + sentence(nx));
    var t = lines.join("\n");
    return t.replace(/\[Student\]/g, stu);
  }
  function contactLine() {
    var bits = [$("c-method").value, $("c-with").value.trim() ? "with " + $("c-with").value.trim() : "", $("c-date").value ? "on " + fmtDate($("c-date").value) : ""].filter(Boolean).join(" ");
    return "Parent/guardian contact: " + bits + (($("c-sum").value.trim()) ? ". " + sentence($("c-sum").value) : ".");
  }
  function buildComm() {
    var lines = ["LOG TYPE: COMMUNICATION"];
    var when = [fmtDate($("c-date").value || $("date").value), $("c-method").value].filter(Boolean).join(" | ");
    lines.push("Contact: " + when + ($("c-with").value.trim() ? " | with " + $("c-with").value.trim() : ""));
    if (state.behaviors.length) lines.push("Regarding: " + state.behaviors.map(function (b) { return b.name; }).join("; ") + ".");
    if (state.ints.length) lines.push("Interventions shared with family: " + state.ints.map(function (id) { return INTERVENTIONS[id].name; }).join(", ") + ".");
    if ($("c-sum").value.trim()) lines.push("Summary: " + sentence($("c-sum").value));
    return lines.join("\n");
  }

  function checkLanguage() {
    var text = $("desc").value + " " + $("c-sum").value;
    var hits = SUBJECTIVE.filter(function (r) { return r[0].test(text); });
    $("flags").innerHTML = hits.map(function (r) { return "<li><b>Objective language check:</b> " + esc(r[1]) + "</li>"; }).join("");
  }

  function update() {
    var d = decide();
    var tb = $("typebox");
    tb.className = "typebox" + (d.type === "DISCIPLINE" ? " disc" : "");
    $("type-t").textContent = d.type;
    $("type-s").textContent = LOG_TYPES[d.type];
    $("type-lv").textContent = d.sub;
    $("guards").innerHTML = d.guards.map(function (x) { return '<div class="alert ' + x[0] + '"><h3>' + esc(x[1]) + "</h3><p>" + esc(x[2]) + "</p></div>"; }).join("");
    $("out").textContent = build(d);
    var second = $("contact-made").checked && d.type !== "COMMUNICATION";
    $("out2-wrap").hidden = !second;
    if (second) $("out2").textContent = buildComm();
    $("fs-int").style.display = state.purpose === "contact" && !state.behaviors.length ? "none" : "";
    checkLanguage();
    return d;
  }

  /* ---------- proof of intervention ---------- */
  function renderProof() {
    var names = {};
    logs.forEach(function (l) { names[key(l.student)] = l.student.trim(); });
    var list = Object.keys(names).sort();
    $("students").innerHTML = list.map(function (k) { return '<option value="' + esc(names[k]) + '">'; }).join("");
    var cur = $("proof-student").value || key($("student").value);
    $("proof-student").innerHTML = list.length ? list.map(function (k) { return '<option value="' + esc(k) + '"' + (k === cur ? " selected" : "") + ">" + esc(names[k]) + "</option>"; }).join("") : "<option>No saved records</option>";
    var sk = list.indexOf(cur) > -1 ? cur : list[0];
    if (!sk) {
      $("proof-body").innerHTML = '<p class="empty">Saved entries appear here as a running record of the interventions you tried, the dates, the student\'s response, and family contacts. This is your proof of intervention for MTSS meetings and referrals.</p>';
      return;
    }
    var mine = studentLogs(sk).sort(function (a, b) { return (a.date || "").localeCompare(b.date || ""); });
    var il = intLogs(mine), cm = commsCount(mine);
    var distinct = {}; il.forEach(function (l) { l.ints.forEach(function (id) { distinct[id] = true; }); });
    var types = {}; Object.keys(distinct).forEach(function (id) { types[INTERVENTIONS[id].type] = true; });
    var dates = mine.map(function (l) { return l.date; }).filter(Boolean).sort();
    var span = dates.length > 1 ? Math.round((new Date(dates[dates.length - 1]) - new Date(dates[0])) / 864e5) : 0;
    var noChangeCount = mine.filter(function (l) { return l.response === "No change" || l.response === "Partial improvement" || l.response === "Behavior escalated"; }).length;
    function item(ok, text) { return '<li><span class="ic ' + (ok ? "yes" : "no") + '">' + (ok ? "✓" : "!") + "</span><span>" + text + "</span></li>"; }
    var h = '<div class="grid g2"><div>' +
      '<h3 style="text-transform:uppercase;margin-bottom:8px">Summary for ' + esc(names[sk]) + "</h3>" +
      '<ul class="checklist">' +
      item(il.length > 0, "<b>" + il.length + "</b> documented intervention entr" + (il.length === 1 ? "y" : "ies")) +
      item(Object.keys(distinct).length >= 2, "<b>" + Object.keys(distinct).length + "</b> different Tier 1 interventions tried") +
      item(types.prevent || types.teach, "Includes a Prevent or Teach strategy" + (Object.keys(types).length ? " (" + Object.keys(types).map(function (t) { return TYPES[t].name; }).join(", ") + ")" : "")) +
      item(span >= 14, "Interventions span <b>" + span + "</b> day" + (span === 1 ? "" : "s") + " (RTI guidance: monitor at least 2 to 3 weeks)") +
      item(cm >= 3, "<b>" + cm + "</b> of 3 logged parent/guardian communications (matrix requirement for a Level 3 \"little/no change\" referral)") +
      item(true, "<b>" + noChangeCount + "</b> entr" + (noChangeCount === 1 ? "y" : "ies") + " show partial, no change, or escalation") +
      "</ul></div><div>" +
      '<h3 style="text-transform:uppercase;margin-bottom:8px">Interventions tried</h3>' +
      (Object.keys(distinct).length ? '<ul class="check">' + Object.keys(distinct).map(function (id) {
        var n = il.filter(function (l) { return l.ints.indexOf(id) > -1; }).length;
        return "<li>" + esc(INTERVENTIONS[id].name) + ' <span class="hint">(' + n + "x)</span></li>";
      }).join("") + "</ul>" : '<p class="hint">None yet.</p>') + "</div></div>";
    h += '<div class="table-scroll" style="margin-top:18px"><table class="hist"><thead><tr><th>Date</th><th>Type</th><th>Behavior</th><th>Intervention(s)</th><th>Response</th><th>Parent contact</th><th></th></tr></thead><tbody>' +
      mine.map(function (l) {
        return "<tr><td>" + esc(fmtDate(l.date)) + "</td><td><b>" + esc(l.type) + "</b></td><td>" + esc((l.behaviors || []).map(function (b) { return "L" + b.level + " " + b.name; }).join("; ")) +
          "</td><td>" + esc((l.ints || []).map(function (id) { return INTERVENTIONS[id] ? INTERVENTIONS[id].name : id; }).join("; ")) + "</td><td>" + esc(l.response || "") +
          "</td><td>" + (l.contact && l.contact.made ? esc(l.contact.method + (l.contact.date ? " " + fmtDate(l.contact.date) : "")) : (l.type === "COMMUNICATION" ? "Yes" : "")) +
          '</td><td><button class="btn ghost sm" type="button" data-del="' + l.id + '" aria-label="Delete entry">Delete</button></td></tr>';
      }).join("") + "</tbody></table></div>";
    $("proof-body").innerHTML = h;
  }

  function saveEntry() {
    var d = update();
    if (!$("student").value.trim()) { BIM.toast("Add student initials or ID first"); $("student").focus(); return; }
    if (d.type === "INTERVENTION" && !state.ints.length) { BIM.toast("Add the intervention you used first"); return; }
    var rec = {
      id: Date.now().toString(36), student: $("student").value.trim(), date: $("date").value, period: $("period").value.trim(), setting: $("setting").value,
      type: d.type, level: d.level, behaviors: state.behaviors.map(function (b) { return { name: b.name, look: b.look, level: b.level }; }),
      ints: state.ints.slice(), response: $("response").value,
      contact: { made: $("contact-made").checked, method: $("c-method").value, with: $("c-with").value.trim(), date: $("c-date").value, summary: $("c-sum").value.trim() },
      text: $("out").textContent, savedAt: new Date().toISOString()
    };
    logs.push(rec);
    if (!BIM.setLogs(logs)) BIM.toast("This browser blocked saving; copy the text instead.");
    else BIM.toast("Saved to " + rec.student + "'s Proof of Intervention record");
    $("proof-student").value = key(rec.student);
    renderProof(); update();
  }

  function csv() {
    var rows = [["Student", "Date", "Period", "Setting", "Log type", "Level", "Behaviors", "Interventions", "Response", "Parent contact", "Contact summary", "Log text"]];
    var sk = $("proof-student").value;
    studentLogs(sk).forEach(function (l) {
      rows.push([l.student, l.date, l.period, l.setting, l.type, l.level || "", (l.behaviors || []).map(function (b) { return b.name + " - " + b.look; }).join("; "),
        (l.ints || []).map(function (id) { return INTERVENTIONS[id] ? INTERVENTIONS[id].name : id; }).join("; "), l.response,
        l.contact && l.contact.made ? [l.contact.method, l.contact.with, l.contact.date].filter(Boolean).join(" ") : "", l.contact ? l.contact.summary : "", l.text]);
    });
    var body = rows.map(function (r) { return r.map(function (c) { return '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"'; }).join(","); }).join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "proof-of-intervention-" + (sk || "student").replace(/[^A-Z0-9]+/gi, "_") + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (t.hasAttribute("data-p")) {
      state.purpose = t.getAttribute("data-p");
      document.querySelectorAll("[data-p]").forEach(function (b) { b.setAttribute("aria-pressed", b === t); });
      if (state.purpose === "contact" && !$("contact-made").checked) { $("contact-made").checked = true; $("contact-fields").hidden = false; }
      update();
    } else if (t.hasAttribute("data-rm")) {
      state.behaviors.splice(+t.getAttribute("data-rm"), 1); renderBehaviorList(); renderInts(); update();
    } else if (t.hasAttribute("data-h")) {
      var h = t.getAttribute("data-h"), i = state.heart.indexOf(h);
      if (i > -1) state.heart.splice(i, 1); else state.heart.push(h);
      renderHeart(); update();
    } else if (t.hasAttribute("data-del")) {
      if (!confirm("Delete this saved entry from the record?")) return;
      var id = t.getAttribute("data-del");
      logs = logs.filter(function (l) { return l.id !== id; }); BIM.setLogs(logs); renderProof(); update();
    }
  });
  $("beh").addEventListener("change", fillLook);
  $("add-beh").addEventListener("click", function () {
    var v = $("beh").value; if (!v) { BIM.toast("Choose a behavior first"); return; }
    var b = behaviorFromKey(v.indexOf(":") > -1 ? v : v + ":" + ($("look").value || 0));
    if (b) addBehavior(b);
    renderBehaviorList(); renderInts(); update();
  });
  $("int-list").addEventListener("change", function (e) {
    var id = e.target.getAttribute("data-int"); if (!id) return;
    var i = state.ints.indexOf(id);
    if (e.target.checked && i < 0) state.ints.push(id); else if (!e.target.checked && i > -1) state.ints.splice(i, 1);
    update();
  });
  $("more-int").addEventListener("click", function () { state.showAll = !state.showAll; renderInts(); });
  $("contact-made").addEventListener("change", function () { $("contact-fields").hidden = !this.checked; if (this.checked && !$("c-date").value) $("c-date").value = $("date").value; update(); });
  ["student", "date", "period", "setting", "desc", "freq", "response", "c-method", "c-with", "c-date", "c-sum", "next", "next-note", "cites"].forEach(function (id) {
    $(id).addEventListener("input", update); $(id).addEventListener("change", update);
  });
  $("student").addEventListener("change", function () { if (key(this.value)) { $("proof-student").value = key(this.value); renderProof(); } });
  $("proof-student").addEventListener("change", renderProof);
  $("copy").addEventListener("click", function () {
    var t = $("out").textContent + ($("out2-wrap").hidden ? "" : "\n\n" + $("out2").textContent);
    BIM.copy(t);
  });
  $("save").addEventListener("click", saveEntry);
  $("csv").addEventListener("click", csv);
  $("print").addEventListener("click", function () { window.print(); });
  $("startover").addEventListener("click", function () {
    var stu = $("student").value;
    $("form").reset(); $("student").value = stu; $("date").value = today();
    state.behaviors = []; state.ints = []; state.heart = []; state.purpose = "behavior";
    document.querySelectorAll("[data-p]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-p") === "behavior"); });
    $("contact-fields").hidden = true;
    renderBehaviorList(); renderInts(); renderHeart(); update();
  });

  /* ---------- init: prefill from the Intervention Menu plan ---------- */
  $("date").value = today();
  fillBehaviorSelect();
  (plan.behaviors || []).forEach(function (b) { var x = behaviorFromKey(b.key); if (x) addBehavior(x); });
  state.ints = (plan.interventions || []).filter(function (id) { return INTERVENTIONS[id]; });
  if (state.behaviors.some(function (b) { return b.level >= 3; })) {
    state.purpose = "admin";
    document.querySelectorAll("[data-p]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-p") === "admin"); });
  }
  renderBehaviorList(); renderInts(); renderHeart(); renderProof(); update();
})();
