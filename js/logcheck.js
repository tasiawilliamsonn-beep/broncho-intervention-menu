/* "Check an entry I wrote": reads a teacher-written PowerSchool log entry, finds the matrix level,
   checks the log type, and gives specific advice to strengthen it. Keyword-based, so it supports
   (not replaces) teacher judgment. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };

  /* Matrix behaviors: [id or "L3:i"/"L4:i", regex] */
  var BEH_RX = [
    ["L4:1", /\b(weapon|knife|gun|firearm)\b/i],
    ["L4:2", /\b(drugs?|alcohol|vap(e|ing)|marijuana|thc|edible)\b/i],
    ["L4:4", /\b(fight|fighting|punch(ed|ing)?|hit (him|her|them|a student|another student|a classmate)|battery|beat up)\b/i],
    ["L4:5", /\b(hit|kick(ed)?|push(ed)?|shov(ed)?|assault(ed)?) (a |the )?(teacher|adult|staff|sub|substitute)\b/i],
    ["L4:0", /(could not|couldn'?t|unable to) (be )?(locate|find)|left campus|missing from (campus|school)/i],
    ["L3:2", /\b(bull(y|ied|ying)|harass(ed|ing|ment)?)\b/i],
    ["L3:3", /\b(racial|racist|slur|n-word|sexual(ly)?)\b/i],
    ["L3:5", /\b(stole|steal(ing)?|theft)\b/i],
    ["L3:6", /\b(shov(e|ed|ing)|pushed .{0,20}(down|hard|into))\b/i],
    ["L3:1", /\b(cuss(ed)?|swore|cursed) (at|out)\b|aggressive language|(profanity|curse words?) (at|toward|directed)/i],
    ["L3:4", /\b(destroyed|serious (damage|vandalism))\b/i],
    ["L3:7", /\bovert(ly)? defian/i],
    ["tardy", /\b(tardy|late to class|arrived late|skipp(ed|ing) class|truan)/i],
    ["intimidation", /\b(threat(en(ed|ing)?)?|intimidat(e|ed|ing))\b/i],
    ["horseplay", /\b(horseplay|play[- ]?fight(ing)?|wrestl(e|ed|ing)|chas(e|ed|ing))\b/i],
    ["hands", /\b(pok(e|ed|ing)|kick(ed|ing)?|grabb(ed|ing)|touch(ed|ing) (another|a|his|her|their) (student|peer|classmate)|hands on (a|another)|pushed)\b/i],
    ["vandalism", /\b(wr(ote|iting) on (the |a )?(desk|wall|table)|ripp(ed|ing)|tore up|broke (a|the|his|her|their)? ?(pencil|marker|crayon|ruler)|damag(ed|ing)|graffiti|vandal)/i],
    ["refusal", /\b(refus(ed|al|ing)|would not|wouldn'?t|did not follow|didn'?t follow|ignored (the |my )?(direction|request|instruction)|non-?complian)/i],
    ["pda", /\b(kiss(ed|ing)?|hugg(ed|ing)|holding hands|display(s)? of affection|on (his|her|their) lap)\b/i],
    ["putdowns", /\b(teas(e|ed|ing)|name[- ]calling|called (him|her|them) (names|a name|an? [a-z]+ name)|called (a |another )?(classmate|peer|student)( a| an)? [a-z]+|put[- ]?downs?|laughed at|made fun)\b/i],
    ["running", /\b(running|ran) (in|down|through) the hall/i],
    ["unsafe", /\b(tipp(ed|ing)|rock(ed|ing)) (in |on )?(his|her|their|the)? ?chair|\bunsafe|misus(ed|ing)|thr(ew|owing) (a |an |the |his |her )?(pencil|paper|eraser|object|ball)/i],
    ["language", /\b(profan(e|ity)|curs(e|ed|ing)|swear(ing)?|bad words?|inappropriate (language|comments?|words?))\b/i],
    ["homework", /\b(homework|did not turn in|didn'?t turn in|missing (work|assignments?|materials)|no pencil|unprepared|without (his|her|their) materials)\b/i],
    ["tone", /\b(tone|eye[- ]?roll(ed|ing)?|rolled (his|her|their) eyes|sigh(ed|ing)|argu(ed|ing)|talk(ed)? back|raised (his|her|their) voice|yell(ed|ing))\b/i],
    ["outofarea", /\bout of (his |her |their )?(assigned )?(seat|area)|wander(ed|ing)|left (the |his |her |their )?(room|class|group|seat)|walk(ed|ing) around\b/i],
    ["offtask", /\b(off[- ]task|not working|did not (start|begin|complete|finish)|didn'?t (start|begin|complete|finish)|head (down|on (the|his|her|their) desk)|doodl(ed|ing)|sleep(ing)?|daydream|distract(ed|ing))/i],
    ["talking", /\b(talk(ed|ing) (out|during|while|to (his|her|their) (neighbor|friend|peer))|call(ed|ing)? out|blurt(ed|ing)?|side conversations?|interrupt(ed|ing)?|making noises|noises)\b/i]
  ];

  var INT_RX = [
    ["redirect", /\b(redirect(ed|ion)?|remind(ed)?|reminder|nonverbal|cue(d)?|sticky note)\b/i],
    ["proximity", /\b(proximity|stood (near|by|next to)|moved (closer|near)|walked over)\b/i],
    ["bsp", /\b(prais(e|ed|ing)|thanked (him|her|them|the student)|positive (feedback|attention)|acknowledg(ed|ing))\b/i],
    ["teach", /\b(re-?taught|re-?teach|modeled|taught (the|him|her|them)|reviewed the expectation|explained the expectation)\b/i],
    ["practice", /\bpractic(e|ed)\b/i],
    ["ask", /asked (him|her|them|the student) (which|what) expectation/i],
    ["precorrect", /\bpre-?correct(ed|ion)?\b/i],
    ["choice", /\b(gave (him|her|them|the student) (a )?choice|offered (a )?choice|choice of|let (him|her|them) choose)\b/i],
    ["seating", /\b(moved (his|her|their|the student'?s)? ?seat|seat change|changed (his|her|their)? ?seat|new seat|strategic seat)/i],
    ["breakcard", /\b(break card|offered a break|gave (him|her|them|the student) a (short )?break|calm[- ]down (break|corner|space|area))\b/i],
    ["chunk", /\b(chunk(ed)?|broke (the |it )?(task|assignment|work)? ?(into|down)|smaller (parts|pieces|steps))\b/i],
    ["match", /\b(checked (for )?understanding|helped (him|her|them|the student) (get )?start|one-on-one help|scaffold(ed)?|modified the)\b/i],
    ["momentum", /\b(behavioral momentum|easy requests|high[- ]p(robability)?)\b/i],
    ["calm", /\b(calm(ly)?|lowered my voice|privately)\b/i],
    ["openq", /\b(asked (him|her|them|the student) what|asked what happened)\b/i],
    ["reentry", /\b(re-?entry|conferenced|private conference|talked (privately|1:1|one-on-one) with)\b/i],
    ["restorative", /\b(restorative|repair (the )?harm|make it right)\b/i],
    ["ifthen", /\b(if\/then|first\/then|if (he|she|they) .{0,40} then)\b/i],
    ["schedattn", /\b(checked (in|back) (with|on)|check-ins?|timer)\b/i],
    ["gbg", /good behavior game/i], ["tootling", /\btootl/i], ["greet", /\bgreet(ed|ing)?\b/i],
    ["relationship", /\b(2x10|two by ten|2-by-10)\b/i], ["selfmonitor", /\bself-?monitor/i], ["goal", /\b(set a goal|goal[- ]setting)\b/i],
    ["dbr", /daily behavior (report|rating)|\bdbr\b/i], ["abc", /\babc (data|chart)/i], ["ignore", /planned ignor|ignored the behavior/i],
    ["replacement", /\b(replacement behavior|taught (him|her|them) to (ask|use|say))\b/i], ["ladder", /\bsupportive response/i]
  ];
  var CONSEQ_RX = /\b(detention|silent lunch|lost (recess|privileges?)|loss of (recess|privileges?)|no recess|took away|sent (him|her|them|the student)? ?(out|to the office|to the hall|into the hall)|removed (him|her|them|the student)? ?from (class|the room)|write[- ]?up|wrote (him|her|them) up|suspend|clip (down|moved)|moved (his|her|their) clip|points? (taken|deducted|lost))\b/i;
  var PARENT_RX = /(call(ed)?|email(ed)?|contact(ed)?|spoke (with|to)|messag(ed|e)|text(ed)?|voicemail|note home|conference(d)?|reached out).{0,40}\b(parent|mom|mother|dad|father|guardian|grand(ma|pa|mother|father|parent)|family|home)\b|\b(parent|mom|mother|dad|father|guardian|family)\b.{0,30}(call|email|contact|messag|conference|was notified|notified)/i;
  var RESPONSE_RX = /\b(responded|corrected|stopped|complied|returned to (work|task|(his|her|their) seat)|got back to work|began (working|the)|started (working|the)|improv(ed|ement)|no change|did not change|continued|escalat(ed|ion)|refused again|was able to|followed (the )?(direction|request))/i;
  var NEXT_RX = /\b(will |plan|next step|follow[- ]?up|continue|monitor)\b/i;
  var HEART_RX = /\b(honesty|effort|attitude|respect|teamwork|expectation)\b/i;
  var DATE_RX = /\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b|\b\d{1,2}:\d{2}\s?(am|pm)?\b|\b(monday|tuesday|wednesday|thursday|friday)\b/i;
  var LABEL_RX = /^\s*[A-Z][A-Za-z /]{2,25}:\s/m;
  var NOCHANGE_RX = /(three|3|several|multiple) (logged )?(parent|phone|family)? ?(calls|contacts|communications|conferences)|little (or|to) no change|no change after/i;

  var byId = {}; BEHAVIORS.forEach(function (b) { byId[b.id] = b; });
  function behFromKey(k) {
    var p = k.split(":");
    if (p[0] === "L3") return { key: k, level: 3, name: LEVEL3[+p[1]] };
    if (p[0] === "L4") return { key: k, level: 4, name: LEVEL4[+p[1]] };
    return { key: k, level: byId[k].level, name: byId[k].name };
  }

  function analyze(text, chosen) {
    var behs = BEH_RX.filter(function (r) { return r[1].test(text); }).map(function (r) { return behFromKey(r[0]); });
    var ints = INT_RX.filter(function (r) { return r[1].test(text); }).map(function (r) { return r[0]; });
    var lv = behs.reduce(function (m, b) { return Math.max(m, b.level); }, 0);
    var parent = PARENT_RX.test(text), conseq = CONSEQ_RX.test(text);
    var noChange = lv === 2 && NOCHANGE_RX.test(text);
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    var rec, refer = false;
    if (lv === 4) { rec = "DISCIPLINE"; refer = true; }
    else if (lv === 3) { rec = "DISCIPLINE"; refer = true; }
    else if (noChange && chosen === "DISCIPLINE") { rec = "DISCIPLINE"; refer = true; }
    else if (!behs.length && parent) rec = "COMMUNICATION";
    else if (lv) rec = "INTERVENTION";
    else rec = chosen === "INFORMATION" || chosen === "COMMUNICATION" ? chosen : "";

    var align = [], fixes = [], good = [];
    /* log type vs. matrix */
    if (!text.trim()) return null;
    if (!behs.length && chosen !== "COMMUNICATION" && chosen !== "INFORMATION")
      align.push(["warn", "No matrix behavior recognized", "Name the behavior in plain terms (for example \"refused to start the assignment\" or \"called out during instruction\") so the level is clear. You can also use the builder to choose it from the matrix."]);
    if (chosen && rec && chosen !== rec) {
      if (chosen === "DISCIPLINE" && lv <= 2)
        align.push(["red", "This does not align with the matrix: Level " + (lv || "1-2") + " is not logged as Discipline",
          "The behaviors described (" + behs.map(function (b) { return b.name; }).join(", ") + ") are handled in the classroom. Log this as Intervention. Discipline is for Level 3 and 4, or for Level 2 behaviors with little or no change after at least three logged parent/guardian communications. If that is the case, say so in the entry."]);
      else if (rec === "DISCIPLINE")
        align.push(["red", "This should be a Discipline log with Office Referral checked", "The entry describes a Level " + lv + " behavior (" + behs.filter(function (b) { return b.level >= 3; }).map(function (b) { return b.name; }).join(", ") + "), which an administrator addresses." + (lv === 4 ? " Contact an administrator immediately." : "")]);
      else if (chosen === "INFORMATION" && lv === 2)
        align.push(["warn", "Level 2 is logged as Intervention or Communication", "INFORMATION is a Level 1 option on the matrix. Since you addressed a Level 2 behavior, choose Intervention."]);
      else if (chosen === "COMMUNICATION" && !parent)
        align.push(["warn", "No parent contact found", "A Communication log documents written or verbal contact with a parent or guardian. Say who you contacted and how, or choose " + (rec || "Intervention") + "."]);
      else if (chosen === "INTERVENTION" && rec === "COMMUNICATION")
        align.push(["warn", "This reads like a parent contact", "If the main purpose is documenting a call or email home, choose Communication."]);
    }
    if (chosen === "DISCIPLINE" && noChange) align.push(["ok", "Little/no change after parent communications", "This matches the Level 3 criterion. Make sure at least three parent/guardian communications are already logged in PowerSchool."]);
    if (lv === 4) align.push(["red", "Level 4: contact an administrator now", "Safety first. Do not wait to finish the log."]);

    /* intervention vs. consequence */
    if ((rec === "INTERVENTION" || chosen === "INTERVENTION") && !ints.length)
      fixes.push(["red", "Add the Tier 1 intervention you used", "An Intervention log must say what you did to teach, prevent, or redirect the behavior." + suggest(behs)]);
    else if (ints.length) good.push("Names the intervention: " + ints.map(function (id) { return INTERVENTIONS[id].name; }).join(", "));
    if (conseq && !ints.length) fixes.push(["red", "Only consequences are listed", "Detention, lost privileges, or removal are consequences, not interventions. Add the Tier 1 intervention you tried first (see the options above)."]);
    else if (conseq) fixes.push(["warn", "A consequence is listed", "That is fine under the matrix, but make sure the intervention comes first and is clearly described. A consequence does not count as Tier 1 evidence."]);
    if (ints.length && ints.every(function (id) { return INTERVENTIONS[id].type === "respond"; }) && lv && lv <= 2)
      fixes.push(["tip", "Add a Prevent or Teach strategy", "Only in-the-moment responses are described. Adding one strategy that prevents the behavior or teaches the skill makes the entry stronger evidence." + suggest(behs, ["prevent", "teach"])]);

    /* completeness */
    if (lv && lv <= 2 && !RESPONSE_RX.test(text)) fixes.push(["warn", "Add how the student responded", "For example: \"The student returned to work after the second prompt\" or \"The behavior did not change.\" This is what shows whether the intervention worked."]);
    else if (RESPONSE_RX.test(text)) good.push("Describes the student's response");
    if (lv === 2 && !parent) fixes.push(["warn", "Level 2 requires parent notification", "Contact the family and log it as a separate Communication entry, or mention the contact here."]);
    else if (parent) good.push("Documents parent/guardian contact");
    if (!HEART_RX.test(text) && lv && lv <= 2) fixes.push(["tip", "Name the expectation", "Connect the behavior to HEART, for example \"This did not meet our expectation of Respect.\""]);
    if (!NEXT_RX.test(text) && lv) fixes.push(["tip", "Add a next step", "For example: \"I will continue the break card and check in daily.\""]);

    /* wording */
    (window.BIM_SUBJECTIVE || []).forEach(function (r) { if (r[0].test(text)) fixes.push(["warn", "Objective language", r[1]]); });
    if (DATE_RX.test(text)) fixes.push(["tip", "Remove dates and times", "PowerSchool has separate Incident Date and Time fields, so the log entry doesn't need them."]);
    if (LABEL_RX.test(text)) fixes.push(["tip", "Write it as one paragraph", "Labels like \"Behavior:\" aren't needed. Full sentences read more clearly in the log history."]);
    if (words && words < 25) fixes.push(["warn", "Add more detail", "This is very short. Describe what you saw and heard, what you did, and how the student responded."]);
    if (words > 250) fixes.push(["tip", "Trim it down", "Keep it to the facts: the behavior, the intervention, the response, and the next step."]);

    var red = align.concat(fixes).filter(function (f) { return f[0] === "red"; }).length;
    var warn = align.concat(fixes).filter(function (f) { return f[0] === "warn"; }).length;
    var rating = red ? ["red", "Needs changes before you submit"] : warn ? ["warn", "Good start: a few things to strengthen"] : ["ok", "Strong entry"];
    return { behs: behs, ints: ints, lv: lv, rec: rec || chosen, refer: refer, align: align, fixes: fixes, good: good, rating: rating, parent: parent };
  }

  function suggest(behs, types) {
    var ids = [];
    behs.forEach(function (b) { var x = byId[b.key]; if (x) x.ints.forEach(function (id) { if (ids.indexOf(id) < 0 && (!types || types.indexOf(INTERVENTIONS[id].type) > -1)) ids.push(id); }); });
    ids = ids.slice(0, 3);
    if (!ids.length) return " Use the Intervention Menu to find one matched to the behavior.";
    return " Matched options from the menu: " + ids.map(function (id) { return INTERVENTIONS[id].name + " (\"I " + INTERVENTIONS[id].log + "\")"; }).join("; ") + ".";
  }

  var last = null;
  function render() {
    var text = $("own-text").value, chosen = $("own-type").value;
    var a = analyze(text, chosen); last = a;
    if (!a) { $("own-out").innerHTML = '<p class="hint">Paste or type your log entry, choose the Log Type you plan to use, and the feedback will appear here.</p>'; return; }
    var typeName = a.rec ? a.rec.charAt(0) + a.rec.slice(1).toLowerCase() : "Not sure yet";
    var h = '<div class="alert ' + a.rating[0] + '"><h3>' + esc(a.rating[1]) + "</h3></div>";
    h += '<div class="ps-form">' +
      '<div class="ps-row"><span class="ps-lab">Matrix level</span><div>' + (a.lv ? "<b>Level " + a.lv + "</b>: " + esc(LEVELS[a.lv].who) : "Not recognized") + "</div></div>" +
      '<div class="ps-row"><span class="ps-lab">Behaviors found</span><div>' + (a.behs.length ? esc(a.behs.map(function (b) { return "L" + b.level + " " + b.name; }).join("; ")) : "None") + "</div></div>" +
      '<div class="ps-row"><span class="ps-lab">Log Type</span><div><b>' + esc(typeName) + "</b>" + (chosen && a.rec && chosen !== a.rec ? ' <span class="pill no">you chose ' + esc(chosen.charAt(0) + chosen.slice(1).toLowerCase()) + "</span>" : "") + "</div></div>" +
      '<div class="ps-row"><span class="ps-lab">Office Referral</span><div>' + (a.refer ? '<span class="pill no">Check it</span>' : '<span class="pill ok">Leave unchecked</span>') + "</div></div></div>";
    if (a.align.length) h += '<h3 class="subhead" style="font-size:1.05rem;margin:16px 0 8px">Matrix alignment</h3>' + a.align.map(box).join("");
    if (a.fixes.length) h += '<h3 class="subhead" style="font-size:1.05rem;margin:16px 0 8px">How to strengthen it</h3>' + a.fixes.map(box).join("");
    if (a.good.length) h += '<h3 class="subhead" style="font-size:1.05rem;margin:16px 0 8px">What\'s working</h3><ul class="check">' + a.good.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul>";
    h += '<p class="hint" style="margin-top:12px">This checker looks for key words, so use your judgment. It does not read for meaning the way a person would.</p>';
    $("own-out").innerHTML = h;
  }
  function box(f) {
    var cls = f[0] === "tip" ? "" : f[0];
    return '<div class="alert ' + (cls || "tipbox") + '"><h3>' + (f[0] === "tip" ? "Tip: " : "") + esc(f[1]) + "</h3><p>" + esc(f[2]) + "</p></div>";
  }

  $("own-text").addEventListener("input", render);
  $("own-type").addEventListener("change", render);
  $("own-save").addEventListener("click", function () {
    var stu = $("own-student").value.trim();
    if (!stu) { BIM.toast("Add student initials or ID first"); $("own-student").focus(); return; }
    if (!last) { BIM.toast("Write the log entry first"); return; }
    var logs = BIM.getLogs();
    logs.push({ id: Date.now().toString(36), student: stu, date: $("own-date").value, period: "", setting: "", type: last.rec || $("own-type").value || "INFORMATION", level: last.lv,
      behaviors: last.behs.map(function (b) { return { name: b.name, look: b.name, level: b.level }; }), ints: last.ints.slice(), response: "",
      contact: { made: last.parent, method: last.parent ? "See entry" : "", with: "", date: "", summary: "" }, title: $("own-title").value.trim(), text: $("own-text").value.trim(), savedAt: new Date().toISOString() });
    if (BIM.setLogs(logs)) BIM.toast("Saved to " + stu + "'s Proof of Intervention record");
    if (window.BIMRenderProof) window.BIMRenderProof(stu);
  });

  /* mode switch */
  function mode(m) {
    document.querySelectorAll("[data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m); });
    $("mode-build").hidden = m !== "build"; $("mode-check").hidden = m !== "check";
    try { history.replaceState(null, "", m === "check" ? "#check" : location.pathname); } catch (e) {}
  }
  document.querySelectorAll("[data-mode]").forEach(function (b) { b.addEventListener("click", function () { mode(b.getAttribute("data-mode")); }); });
  var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); $("own-date").value = d.toISOString().slice(0, 10);
  mode(location.hash === "#check" ? "check" : "build");
  render();
})();
