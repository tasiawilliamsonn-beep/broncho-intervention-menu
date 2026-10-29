/* Team Meeting: calibration scenarios a facilitator projects. The team votes, the facilitator
   reveals the answer, and the team discusses until everyone responds the same way. */
var SCEN = [
  { cat: "Intervention or not?", opts: ["Tier 1 intervention", "Not an intervention"], ans: 0,
    t: "Before independent work, you remind the class: \"Voice level 0, and use your help card if you're stuck.\"",
    why: "This is a pre-correction: a reminder of the expected behavior right before the time problems usually happen (De Pry & Sugai, 2002).",
    talk: "Which routines in your class need a pre-correction every day?" },
  { cat: "Intervention or not?", opts: ["Tier 1 intervention", "Not an intervention"], ans: 1,
    t: "Marcus keeps talking during the lesson, so you take away 5 minutes of his recess.",
    why: "Loss of a privilege is a consequence. The matrix allows mild consequences, but a consequence does not teach the expected behavior and does not count as Tier 1 evidence (Conroy & Sutherland, 2012).",
    talk: "What Tier 1 intervention could you try first for talking out?" },
  { cat: "Intervention or not?", opts: ["Tier 1 intervention", "Not an intervention"], ans: 0,
    t: "Ana keeps leaving her seat during work. You teach her to use a break card and practice it with her when she is calm.",
    why: "Teaching an appropriate way to ask for a break replaces escape-motivated behavior (Majeika et al., 2011). Teaching and practicing is intervention.",
    talk: "How would you know if the break card is working?" },
  { cat: "Intervention or not?", opts: ["Tier 1 intervention", "Not an intervention"], ans: 1,
    t: "Jordan calls out again, so you send him to stand in the hallway for the rest of the lesson.",
    why: "Removal is a consequence, and if Jordan is avoiding the work, it can reward the behavior. Every removal should be documented (Noltemeyer, Ward, & Mcloughlin, 2015; Waller & Higbee, 2010).",
    talk: "What could you try in the room instead? What does the matrix say about calling out?" },
  { cat: "Intervention or not?", opts: ["Tier 1 intervention", "Not an intervention"], ans: 1,
    t: "You call home to tell a parent their child was off task all period.",
    why: "A call that only reports the behavior is not an intervention. A call that shares a strength, describes the behavior objectively, explains the intervention you are using, and asks for partnership supports one (Sheridan et al., 2012).",
    talk: "How would you change this call so it builds a partnership?" },
  { cat: "Intervention or not?", opts: ["Tier 1 intervention", "Not an intervention"], ans: 0,
    t: "After a conflict, you meet privately with the student, ask what happened and who was affected, and agree on a plan for next time.",
    why: "A re-entry or restorative conversation teaches and repairs (Fields, 2004; Gregory et al., 2016).",
    talk: "When during the day could you fit a 3-minute re-entry conversation?" },
  { cat: "Which matrix level?", opts: ["Level 1", "Level 2", "Level 3", "Level 4"], ans: 1,
    t: "During group work, a student pokes a classmate with a pencil several times.",
    why: "Hands, feet, or objects on others is Level 2: handled in the classroom with parent notification.",
    talk: "Which interventions on the menu fit this behavior? Who contacts the family, and how is it logged?" },
  { cat: "Which matrix level?", opts: ["Level 1", "Level 2", "Level 3", "Level 4"], ans: 0,
    t: "When asked to start, a student rolls her eyes and says \"Whatever\" in a sharp tone, then starts working.",
    why: "Inappropriate voice tone is Level 1. Calling it \"overt defiance\" (Level 3) would be a subjective judgment; subjective categories are where discipline gaps grow (Girvan et al., 2017).",
    talk: "Did everyone agree? What words did you want to use to describe this, and are they objective?" },
  { cat: "Which matrix level?", opts: ["Level 1", "Level 2", "Level 3", "Level 4"], ans: 1,
    t: "A student refuses to start the assignment: \"I'm not doing this.\"",
    why: "Refusal to comply is Level 2. It is handled in the classroom with interventions and parent notification, not as an office referral.",
    talk: "What might the student be avoiding? How would you check?" },
  { cat: "Which matrix level?", opts: ["Level 1", "Level 2", "Level 3", "Level 4"], ans: 2,
    t: "A student directs a racial slur at a classmate.",
    why: "Inappropriate racial or sexual comments are Level 3: an office referral, logged as Discipline.",
    talk: "What do you do in the moment to support the targeted student?" },
  { cat: "Which matrix level?", opts: ["Level 1", "Level 2", "Level 3", "Level 4"], ans: 3,
    t: "A student shows a classmate a knife in their backpack.",
    why: "A weapon at school is Level 4: contact an administrator immediately.",
    talk: "Who do you call, and what do you do while you wait?" },
  { cat: "Which matrix level?", opts: ["Level 1", "Level 2", "Level 3", "Level 4"], ans: 1,
    t: "Two friends are wrestling and play fighting in the hallway during passing time.",
    why: "Horseplay or play fighting is Level 2.",
    talk: "Which Tier 1 prevention (pre-correction, active supervision) could stop this from happening in the first place?" },
  { cat: "Which log type?", opts: ["Intervention", "Information", "Communication", "Discipline"], ans: 0,
    t: "A student talked out 4 times. You used proximity and praise, and she stopped. You are documenting it.",
    why: "A Level 1 behavior you addressed is logged as Intervention, and it must include the intervention and the response.",
    talk: "What makes this entry strong evidence later?" },
  { cat: "Which log type?", opts: ["Intervention", "Information", "Communication", "Discipline"], ans: 2,
    t: "You emailed a father to share the break card plan you are using for his son's refusal to work.",
    why: "Written or verbal contact with a parent or guardian is logged as Communication. Three logged communications are required before a Level 3 \"little/no change\" referral.",
    talk: "Do we all log every parent contact? How do we make sure it gets logged?" },
  { cat: "Which log type?", opts: ["Intervention", "Information", "Communication", "Discipline"], ans: 1,
    t: "A student mentions they moved this weekend and seems very tired. No behavior occurred.",
    why: "Details you want documented, with no behavior addressed, are logged as Information.",
    talk: "Who else should know this, and how will you share it?" },
  { cat: "Which log type?", opts: ["Intervention", "Information", "Communication", "Discipline"], ans: 3,
    t: "A Level 2 refusal has shown little or no change after documented interventions and three logged parent communications. You want an administrator to address it.",
    why: "This meets the Level 3 criterion, so it is logged as Discipline with Office Referral checked. Attach the documented interventions.",
    talk: "What should be in the record before this referral? (Hint: the Request for Support packet.)" },
  { cat: "Which log type?", opts: ["Intervention", "Information", "Communication", "Discipline"], ans: 0,
    t: "A student was off task all period, and you want an administrator to talk to him.",
    why: "Off task is Level 1, handled in the classroom. It is logged as Intervention with the intervention you used, not as Discipline.",
    talk: "This is one of our three problems. What intervention would you try and log first?" },
  { cat: "Is this log entry ready?", opts: ["Ready to submit", "Needs work"], ans: 1,
    t: "\"He was disrespectful again today and has a bad attitude. I gave him lunch detention.\"",
    why: "Subjective words, no description of what he did, no intervention, a consequence only, and no response. Rewrite it with the observable behavior, the intervention, and the response.",
    talk: "As a team, rewrite it out loud. What did he actually say or do?" },
  { cat: "Is this log entry ready?", opts: ["Ready to submit", "Needs work"], ans: 0,
    t: "\"During independent work, the student called out answers four times without raising her hand. I used proximity and a nonverbal cue, then praised her when she raised her hand. She stopped calling out after the second prompt. I will continue to pre-correct before independent work.\"",
    why: "Observable behavior, a named intervention, the student's response, and a next step. This is what we want every Intervention log to look like.",
    talk: "What makes this entry easy for an administrator or the MTSS team to use?" }
];
var AGREEMENTS = [
  "We log Level 1 and 2 behaviors as Intervention, not Discipline.",
  "Every Intervention log names the Tier 1 intervention and how the student responded.",
  "We describe behavior objectively: what the student said or did, not labels.",
  "For Level 2 behaviors, we contact the family as partners and log it as Communication.",
  "We try and document Tier 1 interventions for 2 to 3 weeks before asking for more support.",
  "We teach, pre-correct, and praise HEART the same way in every classroom."
];

(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = "bim.team.v1";
  var st = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  st.tally = st.tally || {}; st.flag = st.flag || {}; st.agree = st.agree || AGREEMENTS.join("\n");
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var i = 0, shown = false;
  var L = ["A", "B", "C", "D"];

  function slide() {
    var s = SCEN[i], tl = st.tally[i] || s.opts.map(function () { return 0; });
    $("f-count").textContent = "Scenario " + (i + 1) + " of " + SCEN.length;
    $("f-bar").style.width = ((i + 1) / SCEN.length * 100) + "%";
    $("f-cat").textContent = s.cat;
    $("f-text").textContent = s.t;
    $("f-opts").innerHTML = s.opts.map(function (o, k) {
      var cls = shown ? (k === s.ans ? " right" : " dim") : "";
      return '<div class="f-opt' + cls + '"><span class="f-l">' + L[k] + '</span><span class="f-o">' + esc(o) + '</span><span class="f-tally" aria-label="Votes"><button type="button" data-t="' + k + '" data-d="-1" aria-label="Remove a vote">&minus;</button><b>' + (tl[k] || 0) + '</b><button type="button" data-t="' + k + '" data-d="1" aria-label="Add a vote">+</button></span></div>';
    }).join("");
    $("f-answer").hidden = !shown;
    if (shown) $("f-answer").innerHTML = '<p class="f-ans"><b>Answer: ' + L[s.ans] + ". " + esc(s.opts[s.ans]) + "</b></p><p>" + esc(s.why) + '</p><p class="f-talk"><b>Discuss:</b> ' + esc(s.talk) + "</p>";
    $("f-reveal").textContent = shown ? "Hide answer" : "Reveal answer";
    $("f-flag").checked = !!st.flag[i];
    $("f-prev").disabled = i === 0;
    $("f-next").textContent = i === SCEN.length - 1 ? "Finish" : "Next →";
  }
  function summary() {
    var rows = SCEN.map(function (s, k) {
      var tl = st.tally[k], total = tl ? tl.reduce(function (a, b) { return a + b; }, 0) : 0;
      var agree = total ? Math.round((tl[s.ans] || 0) / total * 100) : null;
      return { k: k, s: s, agree: agree, flag: st.flag[k] };
    });
    var voted = rows.filter(function (r) { return r.agree !== null; });
    var avg = voted.length ? Math.round(voted.reduce(function (a, r) { return a + r.agree; }, 0) / voted.length) : null;
    $("f-summary").innerHTML = '<h2 class="title">Meeting summary</h2>' +
      (avg !== null ? '<p class="intro">On average, <b>' + avg + "%</b> of votes matched the matrix answer. Aim for 90% or more: that is when students get the same response in every room.</p>" : '<p class="intro">No votes were tallied. Next time, count hands with the + buttons to see where the team agrees.</p>') +
      '<table class="hist"><thead><tr><th>#</th><th>Scenario</th><th>Answer</th><th>Team agreement</th><th>Follow up</th></tr></thead><tbody>' +
      rows.map(function (r) { return "<tr><td>" + (r.k + 1) + "</td><td>" + esc(r.s.t.slice(0, 90)) + (r.s.t.length > 90 ? "..." : "") + "</td><td>" + esc(r.s.opts[r.s.ans]) + "</td><td>" + (r.agree === null ? "-" : '<span class="pill ' + (r.agree >= 90 ? "ok" : "no") + '">' + r.agree + "%</span>") + "</td><td>" + (r.flag ? "&#9873; Flagged" : "") + "</td></tr>"; }).join("") +
      "</tbody></table>";
    $("f-summary").hidden = false; $("f-summary").scrollIntoView({ behavior: "smooth" });
  }

  $("f-start").addEventListener("click", function () { $("facil").hidden = false; i = 0; shown = false; slide(); $("facil").scrollIntoView({ behavior: "smooth" }); });
  $("f-reveal").addEventListener("click", function () { shown = !shown; slide(); });
  $("f-prev").addEventListener("click", function () { if (i > 0) { i--; shown = false; slide(); } });
  $("f-next").addEventListener("click", function () { if (i < SCEN.length - 1) { i++; shown = false; slide(); } else summary(); });
  $("f-flag").addEventListener("change", function () { st.flag[i] = this.checked; save(); });
  $("f-opts").addEventListener("click", function (e) {
    var b = e.target.closest("[data-t]"); if (!b) return;
    var tl = st.tally[i] = st.tally[i] || SCEN[i].opts.map(function () { return 0; });
    var k = +b.getAttribute("data-t"); tl[k] = Math.max(0, (tl[k] || 0) + +b.getAttribute("data-d")); save(); slide();
  });
  $("f-full").addEventListener("click", function () { var el = $("facil"); if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen(); });
  $("f-reset").addEventListener("click", function () { if (!confirm("Clear all vote counts and flags?")) return; st.tally = {}; st.flag = {}; save(); slide(); $("f-summary").hidden = true; });
  document.addEventListener("keydown", function (e) {
    if ($("facil").hidden || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") $("f-next").click();
    else if (e.key === "ArrowLeft") $("f-prev").click();
    else if (e.key.toLowerCase() === "r") $("f-reveal").click();
    else if (e.key.toLowerCase() === "f") $("f-full").click();
  });

  /* agreements */
  $("agree").value = st.agree;
  $("agree").addEventListener("input", function () { st.agree = this.value; save(); });
  $("agree-print").addEventListener("click", function () {
    var items = $("agree").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
    BIM.printHTML('<div class="sheet poster">' + BIM.sheetHead("Our Team's Behavior Agreements") + '<p class="sheet-dir">Team: ______________________ &nbsp; Date: __________</p><ol class="agree-list">' +
      items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ol><div class="sig-grid">' + Array(13).join(",").split(",").map(function () { return '<span class="blank"></span>'; }).join("") + "</div></div>");
  });

  /* handouts */
  function handout(key) {
    var cats = [];
    SCEN.forEach(function (s) { if (cats.indexOf(s.cat) < 0) cats.push(s.cat); });
    return '<div class="sheet">' + BIM.sheetHead(key ? "Calibration Scenarios: Answer Key" : "Calibration Scenarios") +
      (key ? "" : '<p class="sheet-dir">For each scenario, circle your answer before the team discussion. Use the Sunnyside Behavior Intervention Matrix.</p>') +
      cats.map(function (c) {
        return "<h3>" + esc(c) + "</h3><ol class=\"hand-list\">" + SCEN.map(function (s, k) { return { s: s, k: k }; }).filter(function (x) { return x.s.cat === c; }).map(function (x) {
          return '<li value="' + (x.k + 1) + '"><p>' + esc(x.s.t) + "</p><p>" + x.s.opts.map(function (o, j) { return '<span class="' + (key && j === x.s.ans ? "hand-right" : "") + '">' + L[j] + ". " + esc(o) + "</span>"; }).join(" &nbsp; ") + "</p>" +
            (key ? '<p class="hand-why">' + esc(x.s.why) + "</p>" : "") + "</li>";
        }).join("") + "</ol>";
      }).join("") + "</div>";
  }
  $("hand-print").addEventListener("click", function () { BIM.printHTML(handout(false)); });
  $("key-print").addEventListener("click", function () { BIM.printHTML(handout(true)); });
})();
