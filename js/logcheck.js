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
    ["offtask", /\b(off[- ]task|not working|did not (start|begin|complete|finish)|didn'?t (start|begin|complete|finish)|head (down|on (the|his|her|their) desk)|turned away from the (board|lesson|teacher)|doodl(ed|ing)|sleep(ing)?|daydream|distract(ed|ing))/i],
    ["talking", /\b(talk(ed|ing)? (to|with) (another student|a (peer|friend|classmate|neighbor)|(his|her|their) friends|friends|peers|classmates)|conversations? with|pass(ed|ing)? notes|talk(ed|ing) (out|during|while|to (his|her|their) (neighbor|friend|peer))|call(ed|ing)? out|blurt(ed|ing)?|side conversations?|interrupt(ed|ing)?|making noises|noises)\b/i]
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
  var CONSEQ_RX = /\b((owe|owes|owed|owing) (me )?(recess|lunch|time)|(miss|missing|lose|losing) (recess|lunch)|detention|silent lunch|lost (recess|privileges?)|loss of (recess|privileges?)|no recess|took away|sent (him|her|them|the student)? ?(out|to the office|to the hall|into the hall)|removed (him|her|them|the student)? ?from (class|the room)|write[- ]?up|wrote (him|her|them) up|suspend|clip (down|moved)|moved (his|her|their) clip|points? (taken|deducted|lost))\b/i;
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

  var COMMON = ("the a an and or but to of in on at for with was were is are be been being he she they him her them his hers their i me my we our you it its this that " +
    "then when after before during while student students class classroom teacher work did not no had has have asked said told would could again from by as so because " +
    "about into out up down time minutes seat assignment directions peer peers classmate other went got used gave called refused started stopped stayed sat walked " +
    "talked put took will mom mother dad father parent guardian family home school lesson group partner desk room hallway lunch recess behavior").split(" ");
  function quality(text) {
    var toks = (text.toLowerCase().match(/[a-z']+/g) || []);
    if (!toks.length) return { ok: false, why: "Write the log entry in words." };
    var common = toks.filter(function (t) { return COMMON.indexOf(t) > -1; }).length / toks.length;
    var junk = toks.filter(function (t) { return t.length >= 4 && (!/[aeiouy]/.test(t) || /(.)\1\1/.test(t)); }).length / toks.length;
    if (toks.length >= 3 && (common < 0.2 || junk > 0.3)) return { ok: false, why: "This doesn't read like a log entry. Write in full sentences: what the student did, what you did, and how the student responded." };
    if (toks.length < 3) return { ok: false, why: "Keep writing. Describe what the student did, what you did, and how the student responded." };
    return { ok: true, words: toks.length };
  }

  function analyze(text, chosen) {
    if (!text.trim()) return null;
    var q = quality(text);
    if (!q.ok) return { invalid: true, why: q.why, behs: [], ints: [], lv: 0, rec: "", refer: false, align: [], fixes: [], good: [], req: [], parent: false, rating: ["red", "Not a log entry yet"] };
    var behs = BEH_RX.filter(function (r) { return r[1].test(text); }).map(function (r) { return behFromKey(r[0]); });
    var picked = $("own-beh") ? $("own-beh").value : "";
    if (picked && !behs.some(function (b) { return b.key === picked; })) behs.unshift(behFromKey(picked));
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
    if (!behs.length && rec !== "COMMUNICATION" && chosen !== "INFORMATION")
      align.push(["red", "No matrix behavior found", "Name the behavior in plain terms (for example \"refused to start the assignment\" or \"called out during instruction\"), or choose it from the matrix list under the entry box."]);
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

    /* required elements decide the rating */
    var type = rec || chosen, subj = (window.BIM_SUBJECTIVE || []).some(function (r) { return r[0].test(text); });
    var req = [];
    function need(label, ok, required, src) { req.push({ label: label, ok: !!ok, required: required, src: src }); }
    if (type === "COMMUNICATION") {
      need("Says who you contacted and how", parent, true, "Sunnyside matrix");
      need("Explains the reason and what was shared", q.words >= 15, true, "Sheridan et al., 2012");
      need("Objective language", !subj, true, "Girvan et al., 2017");
    } else if (type === "INFORMATION") {
      need("Enough detail to be useful (15+ words)", q.words >= 15, true, "Sunnyside matrix");
      need("Objective language", !subj, true, "Girvan et al., 2017");
    } else {
      need("Behavior identified on the matrix", behs.length, true, "Sunnyside matrix");
      need("Describes what the student said or did (20+ words)", q.words >= 20, true, "Girvan et al., 2017");
      need("Objective language (no judgment words)", !subj, true, "Girvan et al., 2017");
      need("Log Type matches the matrix", !align.some(function (f) { return f[0] === "red"; }), true, "Sunnyside matrix");
      if (lv && lv <= 2) {
        need("Names the Tier 1 intervention you used", ints.length, true, "Sunnyside matrix; Conroy & Sutherland, 2012");
        need("Says how the student responded", RESPONSE_RX.test(text), true, "Chafouleas et al., 2007");
        if (lv === 2) need("Parent/guardian contact (required for Level 2)", parent, true, "Sunnyside matrix; Sheridan et al., 2012");
        need("Names the HEART expectation", HEART_RX.test(text), false, "Simonsen et al., 2008");
        need("Includes a next step", NEXT_RX.test(text), false, "Chafouleas et al., 2007");
      }
      if (noChange) need("Mentions the parent communications already logged", parent || NOCHANGE_RX.test(text), true, "Sunnyside matrix, Level 3");
    }
    need("No [bracketed] text left to fill in", !/\[[^\]]+\]/.test(text), true);
    need("No dates, times, or labels (PowerSchool has its own fields)", !DATE_RX.test(text) && !LABEL_RX.test(text), false, "PowerSchool log format");
    var missReq = req.filter(function (x) { return x.required && !x.ok; }).length, missOpt = req.filter(function (x) { return !x.required && !x.ok; }).length;
    var rating = missReq ? ["red", "Not ready yet: " + missReq + " required element" + (missReq > 1 ? "s" : "") + " missing"] : missOpt ? ["warn", "Almost there: all required elements are in"] : ["ok", "Strong entry: ready to submit"];
    return { behs: behs, ints: ints, lv: lv, rec: type, refer: refer, align: align, fixes: fixes, good: good, req: req, rating: rating, parent: parent, noChange: noChange };
  }

  function suggest(behs, types) {
    var ids = [];
    behs.forEach(function (b) { var x = byId[b.key]; if (x) x.ints.forEach(function (id) { if (ids.indexOf(id) < 0 && (!types || types.indexOf(INTERVENTIONS[id].type) > -1)) ids.push(id); }); });
    ids = ids.slice(0, 3);
    if (!ids.length) return " Use the Intervention Menu to find one matched to the behavior.";
    return " Matched options from the menu: " + ids.map(function (id) { return INTERVENTIONS[id].name + " (\"I " + INTERVENTIONS[id].log + "\")"; }).join("; ") + ".";
  }

  var last = null;

  /* ---------- Objective rewrite: sort each sentence into behavior, intervention, response,
     parent contact, or consequence, and turn common teacher phrasing into objective language. ---------- */
  var SUBJ_SUMMARY = /\b(rough|bad|tough|hard|off) day\b|\bhaving a day\b|\bwith (following|meeting) (the )?expectations\b|\bstruggled (with|today)\b|\bwas (bad|awful|terrible|out of control)\b/i;
  var REWRITES = [
    [/\b(spent )?(a|the) majority of (the )?class( period)?\b/gi, function (m, a) { return (a ? "spent " : "") + "most of the class period"; }],
    [/\bthe whole (class|period|time)\b/gi, "the entire class period"],
    [/\bthe board\b/gi, "the instructional board"],
    [/\btalk(ing|ed)? to (another student|a friend|a classmate|a peer|(his|her|their) neighbor)\b/gi, function (m, e) { return "talk" + (e || "") + " with a peer during instruction"; }],
    [/\btalk(ing|ed)? to (his |her |their )?(friends|classmates|peers)\b/gi, function (m, e) { return "talk" + (e || "") + " with peers"; }],
    [/\b(mom|mommy|momma)\b/gi, "mother"], [/\b(dad|daddy)\b/gi, "father"], [/\bgrandma\b/gi, "grandmother"], [/\bgrandpa\b/gi, "grandfather"],
    [/\bI talked to\b/g, "I spoke with"], [/\bI told\b/g, "I informed"],
    [/\bexplained the behaviors? I (was seeing|saw|have been seeing)\b/gi, "explained the behaviors observed in class"],
    [/\b(kept|keeps) (on )?/gi, "continued "], [/\bacting out\b/gi, "[describe what the student did]"], [/\bgoofing (off|around)\b/gi, "[describe what the student did]"],
    [/\bwould not stop\b/gi, "continued"], [/\bwouldn'?t stop\b/gi, "continued"]
  ];
  var SUBJECTS = /\b(?:in|during)\s+(language arts|ela|reading|writing|math(?:ematics)?|science|social studies|spelling|grammar|specials|art|music|p\.?e\.?|gym|library|homeroom|advisory|health|stem)(?:\s+class)?\b/i;
  var SETTING_WORDS = [[/\b(lunch|cafeteria)\b/i, "Cafeteria / lunch"], [/\bhall(way)?\b/i, "Hallway"], [/\brecess\b/i, "Recess"], [/\b(arrival|dismissal|bus)\b/i, "Arrival / dismissal"],
    [/\b(test|quiz|assessment)\b/i, "Test or quiz"], [/\bindependent(ly)? work\b/i, "Independent work"], [/\bpartner\b/i, "Partner work"], [/\b(small[- ]group|group work|stations?)\b/i, "Small-group / cooperative work"],
    [/\btransition\b/i, "Transition between activities"], [/\b(board|instruction|lesson|mini-?lesson|direct instruction)\b/i, "Whole-group instruction"]];
  var PRON = { he: "his", she: "her", they: "their" };
  function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
  function objectify(text) {
    var res = { parts: [], date: "", subject: "", setting: "", name: "" };
    var t = text.replace(/^\s*[A-Z][A-Za-z /]{2,25}:\s*/gm, "").replace(/\|/g, ". ");
    var dm = t.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
    if (dm) { var y = dm[3] ? (dm[3].length === 2 ? "20" + dm[3] : dm[3]) : String(new Date().getFullYear()); res.date = y + "-" + ("0" + dm[1]).slice(-2) + "-" + ("0" + dm[2]).slice(-2); }
    t = t.replace(/,?\s*\b(on\s+)?\d{1,2}\/\d{1,2}(\/\d{2,4})?\b,?/g, " ").replace(/,?\s*\b(at|around)?\s*\d{1,2}:\d{2}\s*(am|pm)?\b/gi, " ");
    var sm = t.match(SUBJECTS); if (sm) res.subject = sm[1].length <= 4 && !/math|art|gym/i.test(sm[1]) ? sm[1].toUpperCase() : sm[1].replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    var tSet = t.split(/(?<=[.!?])\s+/).filter(function (x) { return !CONSEQ_RX.test(x); }).join(" ");
    SETTING_WORDS.some(function (x) { if (x[0].test(tSet)) { res.setting = x[1]; return true; } return false; });
    var nm = t.trim().match(/^([A-Z][a-z]+)\b/); if (nm && !/^(The|He|She|They|I|During|In|At|When|After|Before|Today|This|Student|While|Following|Verbal)$/.test(nm[1])) res.name = nm[1];
    var pron = (t.match(/\b(he|she|they)\b/i) || [, "they"])[1].toLowerCase(), poss = PRON[pron];
    var sentences = t.split(/(?<=[.!?])\s+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var hadInt = false;
    sentences.forEach(function (orig) {
      var x = orig;
      REWRITES.forEach(function (r) { x = x.replace(r[0], r[1]); });
      if (res.name) x = x.replace(new RegExp("\\b(spoke with|informed|called|emailed|contacted|messaged|met with) (the student's )?(mother|father|grandmother|grandfather|parents?|guardian)\\b", "i"), "$1 " + res.name + "'s $3");
      x = x.replace(/\s{2,}/g, " ").replace(/\s+([.,])/g, "$1").replace(/,\s*,/g, ",").replace(/^[,\s]+/, "").trim();
      if (x && !/[.!?]$/.test(x)) x += ".";
      var cat;
      if (CONSEQ_RX.test(x)) cat = "consequence";
      else if (PARENT_RX.test(x)) cat = "parent";
      else if (SUBJ_SUMMARY.test(orig) && !BEH_RX.some(function (r) { return r[1].test(orig); })) cat = "removed";
      else if (/^(I|We)\b/.test(x) && INT_RX.some(function (r) { return r[1].test(x); })) { cat = "intervention"; hadInt = true; }
      else if (hadInt && RESPONSE_RX.test(x)) cat = "response";
      else cat = "behavior";
      /* "despite redirection" inside a behavior sentence: pull the intervention out */
      var dr = cat === "behavior" && x.match(/,?\s*(despite|even after|after) (my |several |multiple |repeated )?(verbal )?(redirections?|reminders?|warnings?|prompts?)/i);
      if (dr) {
        res.parts.push({ cat: "behavior", orig: orig, out: x.replace(dr[0], "").replace(/\s+\./, ".") });
        var many = /several|multiple|repeated|redirections|reminders|warnings|prompts/i.test(dr[0]);
        res.parts.push({ cat: "intervention", orig: dr[0].replace(/^,?\s*/, ""), out: "Verbal redirection was provided" + (many ? " multiple times" : "") + " to return " + poss + " attention to the lesson and the classroom expectations." });
        hadInt = true; return;
      }
      if (cat === "response" && /^(he|she|they)\b/i.test(x) && !/^following/i.test(x)) x = "Following redirection, " + x.charAt(0).toLowerCase() + x.slice(1);
      res.parts.push({ cat: cat, orig: orig, out: x });
    });
    /* order: behavior, intervention, response, parent contact */
    var order = ["behavior", "intervention", "response", "parent"], out = [];
    order.forEach(function (c) { res.parts.filter(function (p) { return p.cat === c; }).forEach(function (p) { out.push(p.out); }); });
    if (out.length) {
      if (res.name) out[0] = out[0].replace(/^(He|She|They)\b/, res.name);
      if (res.subject && !/^(during|in|at|while)\b/i.test(out[0])) out[0] = "During " + res.subject + ", " + (/^[A-Z][a-z]+\b/.test(out[0]) && out[0].split(" ")[0] === res.name ? out[0] : out[0].charAt(0).toLowerCase() + out[0].slice(1));
    }
    res.text = out.join(" ");
    return res;
  }
  var CAT_LABEL = { behavior: "Behavior", intervention: "Intervention", response: "Student response", parent: "Parent contact", consequence: "Consequence", removed: "Removed" };
  var CAT_NOTE = {
    removed: "A summary judgment, not an observable behavior (Girvan et al., 2017).",
    consequence: "A consequence, not an intervention. It is left out of the Intervention entry. If you assign it, document it after the intervention (Conroy & Sutherland, 2012; Sunnyside matrix)."
  };
  function breakdown(o) {
    if (!o.parts.length) return "";
    return '<details class="lb-more ob-break" open><summary>How your entry was rewritten</summary><table class="hist ob-table"><thead><tr><th>Category</th><th>You wrote</th><th>Objective version</th></tr></thead><tbody>' +
      o.parts.map(function (p) {
        return '<tr class="ob-' + p.cat + '"><td><span class="pill' + (p.cat === "consequence" || p.cat === "removed" ? " no" : " ok") + '">' + CAT_LABEL[p.cat] + "</span></td><td>" + esc(p.orig) + "</td><td>" +
          (CAT_NOTE[p.cat] ? '<i>' + esc(CAT_NOTE[p.cat]) + "</i>" : esc(p.out)) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      ((o.date || o.subject) ? '<p class="hint">' + (o.date ? "Date moved to PowerSchool's Incident Date field. " : "") + (o.subject ? "Class: " + esc(o.subject) + ". " : "") + "</p>" : "") + "</details>";
  }

  /* ---------- Strengthen: clean the teacher's text and add what's missing ---------- */
  var add = { ints: [], resp: "", heart: [], pWho: "", pMethod: "", next: "" };
  var sig = "";
  var RESP = ["The student corrected the behavior right away.", "The student corrected the behavior after a second prompt.", "The student showed partial improvement.", "The behavior did not change.", "The behavior escalated."];
  var METHODS = { "": "", "phone": "by phone", "email": "by email", "conference": "in a conference", "note": "with a written note", "app": "through the school messaging app", "voicemail": "by phone and left a voicemail" };
  var NEXTS = ["I will continue these interventions and monitor progress.", "I will add or adjust an intervention.", "I will follow up with the family.", "I will begin a Daily Behavior Report to monitor progress.", "I will bring the documented interventions to the MTSS team."];
  function joinAnd(l) { return l.length < 2 ? l.join("") : l.slice(0, -1).join(", ") + (l.length > 2 ? "," : "") + " and " + l[l.length - 1]; }
  function cleanText(t) {
    var s = t.replace(/^\s*[A-Z][A-Za-z /]{2,25}:\s*/gm, "");
    s = s.replace(/\s*\b(on|at)?\s*\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/gi, "").replace(/\s*\b(at|around)?\s*\b\d{1,2}:\d{2}(\s?(am|pm|a\.m\.|p\.m\.)(?![a-z]))?/gi, "").replace(/\s*\bon (monday|tuesday|wednesday|thursday|friday)\b/gi, "");
    s = s.split(/\n+/).map(function (x) { x = x.trim(); return x && !/[.!?"]$/.test(x) ? x + "." : x; }).filter(Boolean).join(" ");
    (window.BIM_SUBJECTIVE || []).filter(function (r) { return !/always|defian/.test(r[0].source); }).forEach(function (r) {
      var rx = new RegExp(r[0].source, "gi");
      s = s.replace(rx, function (m) { return "[replace \"" + m + "\" with what the student said or did]"; });
    });
    s = s.replace(/\s{2,}/g, " ").replace(/\s+([.,])/g, "$1").replace(/,(\s*,)+/g, ",").replace(/(^|[.!?]\s+)[,;]\s*/g, "$1").trim();
    return s.replace(/(^|[.!?]\s+)([a-z])/g, function (m, p, c) { return p + c.toUpperCase(); });
  }
  function strongText(a, text) {
    var ob = objectify(text), s = cleanText(ob.text || text), out = [];
    var rec = a.rec;
    if (rec === "DISCIPLINE" && !/administrator/i.test(s)) out.push("I am requesting that an administrator address this behavior.");
    if (s) out.push(s);
    if (a.lv && !/\blevel \d\b/i.test(s)) out.push("This is a Level " + a.lv + " behavior on the Sunnyside Behavior Intervention Matrix.");
    if (add.heart.length) out.push("This did not meet our " + (add.heart.length > 1 ? "expectations" : "expectation") + " of " + joinAnd(add.heart) + ".");
    if (add.ints.length) out.push((rec === "DISCIPLINE" ? "Tier 1 interventions already used: I " : (a.ints.length ? "I also " : "To address the behavior, I ")) + joinAnd(add.ints.map(function (id) { return INTERVENTIONS[id].log; })) + ".");
    if (add.resp) out.push(add.resp);
    if (add.pMethod || add.pWho) out.push("I contacted " + (add.pWho ? "the student's " + add.pWho : "the student's parent/guardian") + (METHODS[add.pMethod] ? " " + METHODS[add.pMethod] : "") + ".");
    if (add.next) out.push(add.next);
    var lvl = a.lv;
    if ((rec === "INTERVENTION" || (lvl && lvl <= 2)) && !a.ints.length && !add.ints.length) out.push("[Add the Tier 1 intervention you used.]");
    if (lvl && lvl <= 2 && !RESPONSE_RX.test(text) && !add.resp) out.push("[Add how the student responded.]");
    if (lvl === 2 && !a.parent && !add.pMethod && !add.pWho) out.push("[Add your parent/guardian contact, or log it as a separate Communication entry.]");
    return out.join(" ");
  }
  function titleFor(a) {
    var names = a.behs.filter(function (b) { return a.lv < 3 || b.level >= 3; }).map(function (b) { return b.key === "L3:2" ? "Peer concern for administrator review" : b.name.split(" after ")[0]; }).slice(0, 2).join(" / ");
    var t = { INTERVENTION: names ? names + " - Tier 1 intervention" : "Tier 1 intervention", COMMUNICATION: names ? "Parent contact - " + names : "Parent contact",
      INFORMATION: names ? "Information - " + names : "Information", DISCIPLINE: names ? "Office referral - " + names : "Office referral" }[a.rec] || names || "";
    return t.length > 60 ? t.slice(0, 57).replace(/\s+\S*$/, "") + "..." : t;
  }
  function matched(a) {
    var ids = [];
    a.behs.forEach(function (b) { var x = byId[b.key]; if (x) x.ints.forEach(function (id) { if (ids.indexOf(id) < 0 && a.ints.indexOf(id) < 0) ids.push(id); }); });
    if (!ids.length) ids = ["redirect", "teach", "bsp", "precorrect", "proximity", "reentry"].filter(function (id) { return a.ints.indexOf(id) < 0; });
    return ids.slice(0, 8);
  }
  function renderStrongControls(a, text) {
    var need = { ints: (a.rec === "INTERVENTION" || a.rec === "DISCIPLINE") && a.lv && a.lv <= 3, resp: a.lv && a.lv <= 2 && !/\b(responded|corrected|stopped|complied|returned to|got back to work|began|started (working|the)|improv|no change|did not change|continued|escalat|refused again|was able to|followed)/i.test(text),
      heart: a.lv && a.lv <= 2 && !/\b(honesty|effort|attitude|respect|teamwork)\b/i.test(text), parent: a.lv === 2 && !a.parent, next: a.lv && !/\b(will |plan|next step|follow[- ]?up|continue|monitor)\b/i.test(text) };
    var s2 = JSON.stringify([a.behs.map(function (b) { return b.key; }), a.ints, need, a.rec]);
    if (s2 === sig) return;
    sig = s2;
    var h = "";
    if (need.ints) {
      var m = matched(a);
      h += '<label class="f">' + (a.ints.length ? "Add another Tier 1 intervention you used" : "Which Tier 1 intervention did you use?") + "</label>" +
        m.map(function (id) { return '<label class="opt"><input type="checkbox" data-sint="' + id + '"' + (add.ints.indexOf(id) > -1 ? " checked" : "") + "><span>" + esc(INTERVENTIONS[id].name) + ' <span class="pill ok">' + esc(TYPES[INTERVENTIONS[id].type].name) + "</span></span></label>"; }).join("");
    }
    if (need.heart) h += '<label class="f">Expectation(s) missed</label><div class="chips">' + ["Honesty", "Effort", "Attitude", "Respect", "Teamwork"].map(function (v) { return '<button type="button" class="chip" data-sheart="' + v + '" aria-pressed="' + (add.heart.indexOf(v) > -1) + '">' + v + "</button>"; }).join("") + "</div>";
    if (need.resp) h += '<label class="f" for="s-resp">How did the student respond?</label><select id="s-resp"><option value="">Choose...</option>' + RESP.map(function (r) { return "<option" + (add.resp === r ? " selected" : "") + ">" + esc(r) + "</option>"; }).join("") + "</select>";
    if (need.parent) h += '<label class="f">Parent contact (required for Level 2)</label><div class="row2"><input type="text" id="s-who" placeholder="Who? e.g., mother" value="' + esc(add.pWho) + '"><select id="s-method"><option value="">How?</option><option value="phone">Phone</option><option value="email">Email</option><option value="conference">Conference</option><option value="note">Written note</option><option value="app">Messaging app</option><option value="voicemail">Voicemail</option></select></div>';
    if (need.next) h += '<label class="f" for="s-next">Next step</label><select id="s-next"><option value="">Choose...</option>' + NEXTS.map(function (n) { return "<option" + (add.next === n ? " selected" : "") + ">" + esc(n) + "</option>"; }).join("") + "</select>";
    $("own-add").innerHTML = h ? '<p class="hint" style="margin:0 0 4px"><b>Add what\'s missing</b> (it is added to the entry below):</p>' + h : "";
    if ($("s-method")) $("s-method").value = add.pMethod;
  }
  function renderStrong(a) {
    var text = $("own-text").value;
    if (!a) { $("own-strong").innerHTML = '<p class="hint">Write or paste your log entry on the left. A strengthened version that aligns with the matrix will appear here.</p>'; sig = ""; return; }
    if (a.invalid) { $("own-strong").innerHTML = '<div class="alert red"><h3>No strengthened version yet</h3><p>' + esc(a.why) + "</p></div>"; sig = ""; return; }
    if (!a.behs.length && a.rec !== "COMMUNICATION" && a.rec !== "INFORMATION") {
      $("own-strong").innerHTML = '<div class="alert red"><h3>Choose the matrix behavior first</h3><p>The checker could not find a behavior from the Sunnyside matrix in your entry. Describe the behavior in plain terms, or pick it in <b>Matrix behavior</b> under your entry. The strengthened version appears once the behavior is known.</p></div>'; sig = ""; return;
    }
    if (!$("own-add")) $("own-strong").innerHTML = '<div id="own-add"></div><div class="ps-form" style="margin-top:12px">' +
      '<div class="ps-row"><span class="ps-lab">Log Type</span><div><b id="s-type"></b></div></div>' +
      '<div class="ps-row"><span class="ps-lab">Title</span><div><div class="output ps-title" id="s-title"></div><button class="btn ghost sm" type="button" data-copy="s-title">Copy title</button></div></div>' +
      '<div class="ps-row"><span class="ps-lab">Log Entry</span><div><div class="output" id="s-text"></div><button class="btn sm" type="button" data-copy="s-text">Copy log entry</button> <button class="btn ghost sm" type="button" id="s-use">Use this version</button></div></div>' +
      '<div class="ps-row"><span class="ps-lab">Office Referral</span><div id="s-ref"></div></div></div>' +
      '<div id="s-ready" style="margin-top:10px"></div><p class="hint" style="margin-top:8px">Anything in [brackets] needs your words. Replace it before you submit.</p><div id="s-break"></div>';
    renderStrongControls(a, text);
    $("s-type").textContent = a.rec ? a.rec.charAt(0) + a.rec.slice(1).toLowerCase() : "Choose the behavior to decide";
    $("s-title").textContent = $("own-title").value.trim() || titleFor(a);
    var st2 = strongText(a, text);
    $("s-text").textContent = st2;
    var a2 = analyze(st2, a.rec);
    var miss2 = a2 && a2.req ? a2.req.filter(function (x) { return x.required && !x.ok; }).map(function (x) { return x.label; }) : [];
    $("s-ready").innerHTML = miss2.length
      ? '<div class="alert warn"><h3>Not ready to submit yet</h3><p>Still needed: ' + esc(miss2.join("; ")) + ". Use the choices above, or edit your entry and replace anything in [brackets].</p></div>"
      : '<div class="alert ok"><h3>Ready to submit</h3><p>All required elements are included. Read it once more, then copy it into PowerSchool.</p></div>';
    $("s-ref").innerHTML = a.refer ? '<span class="pill no">Check it</span>' : '<span class="pill ok">Leave unchecked</span>';
  }
  $("own-strong").addEventListener("change", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-sint")) { var id = t.getAttribute("data-sint"), i = add.ints.indexOf(id); if (t.checked && i < 0) add.ints.push(id); if (!t.checked && i > -1) add.ints.splice(i, 1); }
    if (t.id === "s-resp") add.resp = t.value;
    if (t.id === "s-method") add.pMethod = t.value;
    if (t.id === "s-next") add.next = t.value;
    renderStrong(last);
  });
  $("own-strong").addEventListener("input", function (e) { if (e.target.id === "s-who") { add.pWho = e.target.value.trim(); $("s-text").textContent = strongText(last, $("own-text").value); } });
  $("own-strong").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sheart]");
    if (b) { var v = b.getAttribute("data-sheart"), i = add.heart.indexOf(v); if (i > -1) add.heart.splice(i, 1); else add.heart.push(v); b.setAttribute("aria-pressed", i < 0); renderStrong(last); }
    if (e.target.id === "s-use") {
      $("own-text").value = $("s-text").textContent;
      if (!$("own-title").value.trim()) $("own-title").value = $("s-title").textContent;
      if (last && last.rec) $("own-type").value = last.rec;
      add = { ints: [], resp: "", heart: [], pWho: "", pMethod: "", next: "" }; sig = "";
      render(); BIM.toast("Your entry was updated. Check the feedback again.");
    }
  });

  /* wrong Log Type: an error, and no save or copy until it is fixed */
  var TYPE_WHY = {
    DISCIPLINE: "It describes a Level 3 or 4 behavior, which an administrator addresses. Use Discipline and check Office Referral.",
    INTERVENTION: "It describes a Level 1 or 2 behavior handled in the classroom. Use Intervention and name the Tier 1 intervention you used.",
    COMMUNICATION: "It documents contact with a parent or guardian and no matrix behavior. Use Communication."
  };
  function blocker(a, chosen) {
    if (!a || a.invalid) return null;
    var ok = !chosen || !a.rec || chosen === a.rec || (chosen === "INFORMATION" && a.lv === 1);
    if (!ok) return { title: "Wrong Log Type: this should be " + a.rec.charAt(0) + a.rec.slice(1).toLowerCase() + ", not " + chosen.charAt(0) + chosen.slice(1).toLowerCase(),
      text: (TYPE_WHY[a.rec] || "") + " Change the Log Type, or click Use this version to switch to the correct one, before you save or copy it.", src: "Sunnyside Behavior Intervention Matrix" };
    if (a.rec === "INTERVENTION" && !a.ints.length && CONSEQ_RX.test($("own-text").value))
      return { title: "This is a consequence, not an intervention", text: "The entry lists only a consequence. An Intervention log must name the Tier 1 intervention you used first. Add it before you save or copy.", src: "Conroy & Sutherland, 2012; Sunnyside matrix" };
    return null;
  }
  function lock(on) {
    ["own-save"].forEach(function (id) { if ($(id)) $(id).disabled = on; });
    document.querySelectorAll('#own-strong [data-copy]').forEach(function (b) { b.disabled = on; });
    var w = document.querySelector("#own-strong .ps-form"); if (w) w.classList.toggle("locked", on);
  }

  function render() {
    var text = $("own-text").value, chosen = $("own-type").value;
    var a = analyze(text, chosen); last = a;
    var ob = text.trim() ? objectify(text) : null;
    if (ob && ob.date && !dateTouched) $("own-date").value = ob.date;
    if (ob && ob.setting && !settingTouched) $("own-setting").value = ob.setting;
    $("own-block").innerHTML = "";
    $("own-save").disabled = false;
    if (!a) { renderStrong(null); $("own-out").innerHTML = '<p class="hint">Paste or type your log entry, choose the Log Type you plan to use, and the feedback will appear here.</p>'; return; }
    if (a.invalid) { renderStrong(a); $("own-out").innerHTML = '<div class="alert red"><h3>' + esc(a.rating[1]) + "</h3><p>" + esc(a.why) + "</p></div>"; return; }
    var typeName = a.rec ? a.rec.charAt(0) + a.rec.slice(1).toLowerCase() : "Not sure yet";
    var h = '<div class="alert ' + a.rating[0] + '"><h3>' + esc(a.rating[1]) + "</h3></div>";
    if (window.BULLY && (BULLY.rx.test(text) || a.behs.some(function (b) { return b.key === "L3:2"; }))) h += BULLY.html();
    h += '<ul class="checklist" style="margin-bottom:12px">' + a.req.map(function (x) {
      return '<li><span class="ic ' + (x.ok ? "yes" : x.required ? "no" : "") + '">' + (x.ok ? "\u2713" : x.required ? "\u2715" : "\u2013") + "</span><span>" + esc(x.label) + (x.required ? "" : ' <span class="hint">(recommended)</span>') + (x.src ? ' <span class="hint"><i>' + esc(x.src) + "</i></span>" : "") + "</span></li>";
    }).join("") + "</ul>";
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
    renderStrong(a);
    if ($("s-break")) $("s-break").innerHTML = ob ? breakdown(ob) : "";
    var bl = blocker(a, chosen);
    $("own-block").innerHTML = bl ? '<div class="alert red"><h3>' + esc(bl.title) + "</h3><p>" + esc(bl.text) + '<span class="src">' + esc(bl.src) + "</span></p></div>" : "";
    lock(!!bl);
  }
  var dateTouched = false, settingTouched = false;
  $("own-date").addEventListener("input", function () { dateTouched = true; });
  $("own-setting").addEventListener("change", function () { settingTouched = true; });
  function box(f) {
    var cls = f[0] === "tip" ? "" : f[0];
    return '<div class="alert ' + (cls || "tipbox") + '"><h3>' + (f[0] === "tip" ? "Tip: " : "") + esc(f[1]) + "</h3><p>" + esc(f[2]) + "</p></div>";
  }

  /* matrix behavior picker (fallback when keywords miss the behavior) */
  $("own-beh").innerHTML = '<option value="">Found automatically</option>' + [1, 2].map(function (l) {
    return '<optgroup label="Level ' + l + '">' + BEHAVIORS.filter(function (b) { return b.level === l; }).map(function (b) { return '<option value="' + b.id + '">' + esc(b.name) + "</option>"; }).join("") + "</optgroup>";
  }).join("") + '<optgroup label="Level 3">' + LEVEL3.map(function (t, i) { return '<option value="L3:' + i + '">' + esc(t) + "</option>"; }).join("") + "</optgroup>" +
    '<optgroup label="Level 4">' + LEVEL4.map(function (t, i) { return '<option value="L4:' + i + '">' + esc(t) + "</option>"; }).join("") + "</optgroup>";
  $("own-beh").addEventListener("change", function () { sig = ""; render(); });
  $("own-text").addEventListener("input", render);
  $("own-type").addEventListener("change", render);
  $("own-title").addEventListener("input", render);
  $("own-save").addEventListener("click", function () {
    var stu = $("own-student").value.trim();
    if (!stu) { BIM.toast("Add student initials or ID first"); $("own-student").focus(); return; }
    if (!last || last.invalid) { BIM.toast("Write a complete log entry first"); return; }
    if (blocker(last, $("own-type").value)) { BIM.toast("Fix the Log Type error first"); return; }
    var logs = BIM.getLogs();
    logs.push({ id: Date.now().toString(36), student: stu, date: $("own-date").value, period: "", setting: $("own-setting").value, type: last.rec || $("own-type").value || "INFORMATION", level: last.lv,
      behaviors: last.behs.map(function (b) { return { name: b.name, look: b.name, level: b.level }; }), ints: last.ints.slice(), response: "",
      contact: { made: last.parent, method: last.parent ? "See entry" : "", with: "", date: "", summary: "" }, title: $("own-title").value.trim(), text: $("own-text").value.trim(), savedAt: new Date().toISOString() });
    if (BIM.setLogs(logs)) BIM.toast("Saved to " + stu + "'s Proof of Intervention record");
    if (window.BIMRenderProof) window.BIMRenderProof(stu);
  });

  /* tabs: build, check, records */
  function mode(m) {
    document.querySelectorAll("[data-mode]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m); });
    ["build", "check", "records"].forEach(function (k) { $("mode-" + k).hidden = k !== m; });
    try { history.replaceState(null, "", m === "build" ? location.pathname : "#" + m); } catch (e) {}
  }
  document.querySelectorAll("[data-mode]").forEach(function (b) { b.addEventListener("click", function () { mode(b.getAttribute("data-mode")); }); });
  var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); $("own-date").value = d.toISOString().slice(0, 10);
  function fromHash() { mode({ "#check": "check", "#records": "records" }[location.hash] || "build"); }
  window.addEventListener("hashchange", fromHash);
  fromHash();
  render();
})();
