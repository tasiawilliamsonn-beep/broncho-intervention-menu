/* Team Meeting: calibration scenarios a facilitator projects. The team votes, the facilitator
   reveals the answer, and the team discusses until everyone responds the same way. */
var IO = ["Tier 1 intervention", "Not an intervention"], LV = ["Level 1", "Level 2", "Level 3", "Level 4"], LT = ["Intervention", "Information", "Communication", "Discipline"], RD = ["Ready to submit", "Needs work"];
var SCEN = [
  { cat: "Intervention or not?", opts: IO, ans: 0, t: "Before independent work, you remind the class: \"Voice level 0. Use your help card if you're stuck.\"",
    why: "It's a pre-correction: a reminder right before problems usually start.", talk: "Which routines in your room need a daily pre-correction?", cite: "De Pry & Sugai, 2002" },
  { cat: "Intervention or not?", opts: IO, ans: 1, t: "A student keeps talking during the lesson, so you take away 5 minutes of recess.",
    why: "Losing recess is a consequence. It doesn't teach the expected behavior.", talk: "What could you try first?", cite: "Conroy & Sutherland, 2012" },
  { cat: "Intervention or not?", opts: IO, ans: 0, t: "A student keeps leaving her seat. You teach her to use a break card and practice it with her.",
    why: "Teaching and practicing a replacement behavior is an intervention.", talk: "How will you know if it's working?", cite: "Majeika et al., 2011" },
  { cat: "Intervention or not?", opts: IO, ans: 1, t: "A student calls out again, so you send him to the hallway for the rest of class.",
    why: "Removal is a consequence, and it can reward a student who wants to avoid the work.", talk: "What could you try in the room instead?", cite: "Waller & Higbee, 2010" },
  { cat: "Intervention or not?", opts: IO, ans: 1, t: "You call home only to report that a student was off task all period.",
    why: "A report alone isn't an intervention. Sharing your plan and asking for partnership supports one.", talk: "How would you change this call?", cite: "Sheridan et al., 2012" },
  { cat: "Intervention or not?", opts: IO, ans: 0, t: "After a conflict, you meet privately with the student and agree on a plan for next time.",
    why: "A re-entry conversation teaches and repairs.", talk: "When could you fit in a 3-minute conversation?", cite: "Fields, 2004" },
  { cat: "Which matrix level?", opts: LV, ans: 1, t: "During group work, a student pokes a classmate with a pencil several times.",
    why: "Hands, feet, or objects on others is Level 2: handle it in class and notify the family.", talk: "Which interventions fit?", cite: "Sunnyside matrix" },
  { cat: "Which matrix level?", opts: LV, ans: 0, t: "Asked to start, a student rolls her eyes, says \"Whatever,\" then starts working.",
    why: "Inappropriate voice tone is Level 1. Calling it \"overt defiance\" would be a subjective label.", talk: "What objective words describe it?", cite: "Girvan et al., 2017" },
  { cat: "Which matrix level?", opts: LV, ans: 1, t: "A student refuses to start the assignment: \"I'm not doing this.\"",
    why: "Refusal to comply is Level 2, handled in the classroom.", talk: "What might the student be avoiding?", cite: "Sunnyside matrix" },
  { cat: "Which matrix level?", opts: LV, ans: 2, t: "A student directs a racial slur at a classmate.",
    why: "Racial or sexual comments are Level 3: an office referral.", talk: "How do you support the targeted student?", cite: "Sunnyside matrix" },
  { cat: "Which matrix level?", opts: LV, ans: 3, t: "A student shows a classmate a knife in their backpack.",
    why: "A weapon is Level 4: contact an administrator immediately.", talk: "Who do you call, and what do you do while you wait?", cite: "Sunnyside matrix" },
  { cat: "Which matrix level?", opts: LV, ans: 1, t: "Two friends are play fighting in the hallway during passing time.",
    why: "Horseplay is Level 2.", talk: "What would prevent it?", cite: "Sunnyside matrix" },
  { cat: "Which log type?", opts: LT, ans: 0, t: "A student talked out 4 times. You used proximity and praise, and she stopped.",
    why: "A Level 1 behavior you addressed is logged as Intervention.", talk: "What makes this entry strong?", cite: "Sunnyside matrix" },
  { cat: "Which log type?", opts: LT, ans: 2, t: "You emailed a father to share the break card plan for his son.",
    why: "Contact with a parent or guardian is logged as Communication.", talk: "Do we all log every parent contact?", cite: "Sunnyside matrix" },
  { cat: "Which log type?", opts: LT, ans: 1, t: "A student says they moved this weekend and seems very tired. No behavior occurred.",
    why: "Details to document, with no behavior, are logged as Information.", talk: "Who else should know?", cite: "Sunnyside matrix" },
  { cat: "Which log type?", opts: LT, ans: 3, t: "A Level 2 refusal shows no change after interventions and three logged parent contacts.",
    why: "That meets Level 3: log it as Discipline and check Office Referral.", talk: "What should be in the record first?", cite: "Sunnyside matrix" },
  { cat: "Which log type?", opts: LT, ans: 0, t: "A student was off task all period, and you want an administrator to talk to him.",
    why: "Off task is Level 1. Log it as Intervention, not Discipline.", talk: "What would you try and log first?", cite: "Sunnyside matrix" },
  { cat: "Is this log entry ready?", opts: RD, ans: 1, t: "\"He was disrespectful again and has a bad attitude. I gave him lunch detention.\"",
    why: "Judgment words, no intervention, and no response.", talk: "Rewrite it together. What did he actually say or do?", cite: "Sunnyside matrix" },
  { cat: "Is this log entry ready?", opts: RD, ans: 0, t: "\"During independent work, she called out answers four times. I used proximity and a nonverbal cue, then praised her when she raised her hand. She stopped after the second prompt.\"",
    why: "Observable behavior, the intervention, and the response.", talk: "What makes this easy for the team to use?", cite: "Sunnyside matrix" }
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
  st.tally = st.tally || {}; st.agree = st.agree || AGREEMENTS.join("\n");
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var i = 0, shown = false, counting = false;
  var L = ["A", "B", "C", "D"];

  function slide() {
    var s = SCEN[i], tl = st.tally[i] || s.opts.map(function () { return 0; });
    $("f-count").textContent = (i + 1) + " / " + SCEN.length;
    $("f-bar").style.width = ((i + 1) / SCEN.length * 100) + "%";
    $("f-cat").textContent = s.cat;
    $("f-text").textContent = s.t;
    $("f-opts").innerHTML = s.opts.map(function (o, k) {
      var cls = shown ? (k === s.ans ? " right" : " dim") : "";
      return '<div class="f-opt' + cls + '"><span class="f-l">' + L[k] + '</span><span class="f-o">' + esc(o) + "</span>" +
        (counting ? '<span class="f-tally"><button type="button" data-t="' + k + '" data-d="-1" aria-label="Remove a vote">&minus;</button><b>' + (tl[k] || 0) + '</b><button type="button" data-t="' + k + '" data-d="1" aria-label="Add a vote">+</button></span>' : "") + "</div>";
    }).join("");
    $("f-answer").hidden = !shown;
    if (shown) $("f-answer").innerHTML = '<p class="f-ans">' + esc(s.opts[s.ans]) + "</p><p>" + esc(s.why) + '</p><p class="f-talk">Talk about it: ' + esc(s.talk) + "</p>";
    $("f-reveal").textContent = shown ? "Hide answer" : "Reveal answer";
    $("f-prev").disabled = i === 0;
    $("f-next").textContent = i === SCEN.length - 1 ? "Finish" : "Next \u2192";
    $("f-count-toggle").textContent = counting ? "Stop counting votes" : "Count votes";
  }
  function summary() {
    var rows = SCEN.map(function (s, k) {
      var tl = st.tally[k], total = tl ? tl.reduce(function (a, b) { return a + b; }, 0) : 0;
      return { k: k, s: s, agree: total ? Math.round((tl[s.ans] || 0) / total * 100) : null };
    });
    var voted = rows.filter(function (r) { return r.agree !== null; });
    var low = voted.filter(function (r) { return r.agree < 90; });
    var h = '<h2 class="title">Wrap-up</h2>';
    if (!voted.length) h += '<p class="intro">Finish by agreeing on the team agreements below.</p>';
    else {
      var avg = Math.round(voted.reduce(function (a, r) { return a + r.agree; }, 0) / voted.length);
      h += '<p class="intro">The team matched the matrix on <b>' + avg + "%</b> of votes. " + (low.length ? "Revisit these:" : "Great consistency.") + "</p>" +
        (low.length ? '<ul class="check x">' + low.map(function (r) { return "<li>" + (r.k + 1) + ". " + esc(r.s.t) + " <b>(" + r.agree + "% agreed)</b></li>"; }).join("") + "</ul>" : "");
    }
    $("f-summary").innerHTML = h; $("f-summary").hidden = false; $("f-summary").scrollIntoView({ behavior: "smooth" });
  }

  $("f-start").addEventListener("click", function () { $("facil").hidden = false; i = 0; shown = false; slide(); $("facil").scrollIntoView({ behavior: "smooth" }); });
  $("f-reveal").addEventListener("click", function () { shown = !shown; slide(); });
  $("f-prev").addEventListener("click", function () { if (i > 0) { i--; shown = false; slide(); } });
  $("f-next").addEventListener("click", function () { if (i < SCEN.length - 1) { i++; shown = false; slide(); } else summary(); });
  $("f-count-toggle").addEventListener("click", function () { counting = !counting; slide(); });
  $("f-opts").addEventListener("click", function (e) {
    var b = e.target.closest("[data-t]"); if (!b) return;
    var tl = st.tally[i] = st.tally[i] || SCEN[i].opts.map(function () { return 0; });
    var k = +b.getAttribute("data-t"); tl[k] = Math.max(0, (tl[k] || 0) + +b.getAttribute("data-d")); save(); slide();
  });
  $("f-full").addEventListener("click", function () { var el = $("facil"); if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen(); });
  $("f-reset").addEventListener("click", function () { if (!confirm("Clear all vote counts?")) return; st.tally = {}; save(); slide(); $("f-summary").hidden = true; });
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
            (key ? '<p class="hand-why">' + esc(x.s.why) + " (" + esc(x.s.cite) + ")</p>" : "") + "</li>";
        }).join("") + "</ol>";
      }).join("") + "</div>";
  }
  $("hand-print").addEventListener("click", function () { BIM.printHTML(handout(false)); });
  $("key-print").addEventListener("click", function () { BIM.printHTML(handout(true)); });
})();
