/* Classroom Tools, part 2: tips, posters, Broncho character, visiting pass, class jobs, contracts, incentives. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var head = function (t) { return window.BIMSheetHead(t); };
  var print = function (html) { window.BIMPrint(html); };
  function cites(keys) { return keys.map(function (k) { return BIM.shortCite(k); }).join("; "); }
  function val(id) { return ($(id) && $(id).value || "").trim(); }
  function line(v, w) { return v ? "<b>" + esc(v) + "</b>" : '<span class="blank" style="min-width:' + (w || 160) + 'px"></span>'; }

  /* ---------- Tips ---------- */
  $("tips-list").innerHTML = TIPS.map(function (g) {
    return '<h3 class="subhead">' + esc(g.group) + '</h3><div class="grid g3">' + g.items.map(function (it) {
      return '<div class="card red-top"><h3>' + esc(it.t) + "</h3><p>" + esc(it.d) + '</p><p class="cite">' + esc(cites(it.c)) + "</p></div>";
    }).join("") + "</div>";
  }).join("");
  $("tips-print").addEventListener("click", function () {
    var card = '<div class="desk-card">' + head("Tier 1 Teacher Moves") + '<ol class="desk">' + DESK_CARD.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ol><p class="sheet-cite">The Broncho Intervention Menu &middot; research on each move is on the Classroom Tools page.</p></div>';
    print('<div class="sheet two-up">' + card + card + "</div>");
  });

  /* ---------- Broncho character (SVG) ---------- */
  var COAT = "#c47a3d", MUZZLE = "#f0c595", MANE = "#3a2418";
  function arm(x1, y1, x2, y2, cls) {
    return '<g class="' + (cls || "") + '"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#111" stroke-width="16" stroke-linecap="round"/>' +
      '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + COAT + '" stroke-width="10" stroke-linecap="round"/><circle cx="' + x2 + '" cy="' + y2 + '" r="8" fill="#111"/></g>';
  }
  /* A cartoon horse: long side-profile head with muzzle, pointed ears, mane, forelock, tail, and hooves */
  function broncho(pose) {
    var p = pose.id, closed = p === "calm";
    var arms = arm(70, 148, 56, 188) + arm(130, 148, 144, 188), extra = "", back = "", bob = "";
    if (p === "raise") arms = arm(70, 148, 38, 76, "bc-wave") + arm(130, 148, 144, 188);
    if (p === "space") back = '<circle class="bc-spin" cx="100" cy="122" r="98" fill="none" stroke="#c8102e" stroke-width="4" stroke-dasharray="12 10"/>';
    if (p === "walk") { bob = "bc-bob"; extra = '<g class="bc-steps" fill="#c8102e"><ellipse cx="40" cy="226" rx="7" ry="4"/><ellipse cx="62" cy="218" rx="7" ry="4"/><ellipse cx="150" cy="226" rx="7" ry="4"/><ellipse cx="172" cy="218" rx="7" ry="4"/></g>'; }
    if (p === "effort") { arms = arm(70, 148, 56, 188) + arm(130, 148, 158, 178, "bc-write"); extra = '<rect x="150" y="180" width="44" height="34" rx="3" fill="#fff" stroke="#111" stroke-width="3"/><line x1="156" y1="190" x2="186" y2="190" stroke="#999" stroke-width="2"/><line x1="156" y1="198" x2="186" y2="198" stroke="#999" stroke-width="2"/><line x1="156" y1="206" x2="176" y2="206" stroke="#999" stroke-width="2"/>'; }
    if (p === "team") { arms = arm(70, 148, 88, 172) + arm(130, 148, 112, 172); extra = '<path class="bc-pulse" d="M100 198 C70 178 78 152 100 166 C122 152 130 178 100 198Z" fill="#c8102e" stroke="#111" stroke-width="3"/>'; }
    if (p === "honest") extra = '<g class="bc-pop"><path d="M6 10 h70 a8 8 0 0 1 8 8 v30 a8 8 0 0 1 -8 8 h-26 l12 14 l-24 -14 h-32 a8 8 0 0 1 -8 -8 v-30 a8 8 0 0 1 8 -8z" fill="#fff" stroke="#111" stroke-width="3"/><text x="41" y="30" text-anchor="middle" font-size="12" font-weight="700" font-family="Arial">I did it.</text><text x="41" y="46" text-anchor="middle" font-size="12" font-family="Arial">I\'ll fix it.</text></g>';
    if (p === "listen") extra = '<g class="bc-waves" fill="none" stroke="#c8102e" stroke-width="4" stroke-linecap="round"><path d="M128 14 q14 12 6 30"/><path d="M140 4 q22 18 10 46"/><path d="M60 40 q-12 16 -4 34"/><path d="M48 32 q-18 24 -6 50"/></g>';
    if (p === "calm") back = '<circle class="bc-breathe" cx="100" cy="112" r="92" fill="#c8102e" opacity=".12"/>';
    var eye = closed
      ? '<path d="M110 62 q8 7 16 0" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<g class="bc-blink"><ellipse cx="118" cy="60" rx="9" ry="11" fill="#fff" stroke="#111" stroke-width="2.5"/><ellipse cx="121" cy="61" rx="6" ry="8" fill="#111"/><circle cx="123" cy="57" r="2.5" fill="#fff"/></g>';
    var mouth = p === "listen" || p === "calm" ? '<path d="M138 106 h12" stroke="#111" stroke-width="3" stroke-linecap="round"/>' : '<path d="M134 102 q9 9 18 2" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>';
    return '<svg class="bc" viewBox="0 0 200 240" role="img" aria-label="Broncho the horse: ' + esc(pose.t) + '">' + back +
      '<g class="' + bob + '">' +
      /* tail */
      '<path d="M70 170 C44 168 30 186 34 214 C44 200 52 196 58 206 C56 190 64 182 74 182 Z" fill="' + MANE + '" stroke="#111" stroke-width="3" stroke-linejoin="round"/>' +
      /* legs and hooves */
      '<rect x="78" y="184" width="16" height="34" rx="7" fill="' + COAT + '" stroke="#111" stroke-width="3"/><rect x="76" y="212" width="20" height="11" rx="3" fill="#111"/>' +
      '<rect x="106" y="184" width="16" height="34" rx="7" fill="' + COAT + '" stroke="#111" stroke-width="3"/><rect x="104" y="212" width="20" height="11" rx="3" fill="#111"/>' +
      /* body */
      '<rect x="62" y="128" width="76" height="70" rx="32" fill="' + COAT + '" stroke="#111" stroke-width="3"/>' +
      '<ellipse cx="100" cy="172" rx="22" ry="16" fill="' + MUZZLE + '" opacity=".55"/>' +
      /* neck */
      '<path d="M84 136 C82 112 86 92 94 80 L122 88 C116 104 116 120 118 136 Z" fill="' + COAT + '" stroke="#111" stroke-width="3" stroke-linejoin="round"/>' +
      /* mane down the neck */
      '<path d="M96 34 C82 46 80 62 84 74 C76 84 80 98 78 110 C74 122 78 132 84 138 C88 124 86 112 90 100 C92 88 92 80 98 70 C98 58 100 46 96 34 Z" fill="' + MANE + '" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>' +
      /* bandana */
      '<path d="M76 132 L124 132 L100 166 Z" fill="#c8102e" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<polygon points="100,138 103,146 111,146 105,151 107,159 100,154 93,159 95,151 89,146 97,146" fill="#fff"/>' +
      arms +
      /* ears */
      '<path d="M100 44 L104 10 L116 42 Z" fill="' + COAT + '" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M104 38 L106 20 L112 38 Z" fill="#e9a6a0"/>' +
      '<path d="M114 46 L124 16 L130 48 Z" fill="' + COAT + '" stroke="#111" stroke-width="3" stroke-linejoin="round"/>' +
      /* long horse head in profile, facing right */
      '<path d="M96 46 C108 36 128 40 138 56 C148 70 160 82 164 94 C168 106 158 116 146 114 C134 112 124 108 114 102 C100 96 92 84 92 68 C92 58 92 52 96 46 Z" fill="' + COAT + '" stroke="#111" stroke-width="3" stroke-linejoin="round"/>' +
      /* muzzle and nostril */
      '<path d="M138 82 C150 82 166 90 164 102 C162 114 148 116 138 110 C130 106 128 86 138 82 Z" fill="' + MUZZLE + '" stroke="#111" stroke-width="2.5"/>' +
      '<ellipse cx="154" cy="96" rx="4" ry="3" fill="#111" transform="rotate(-20 154 96)"/>' +
      /* forelock */
      '<path d="M100 42 C106 34 116 36 120 44 C114 42 112 50 106 48 C104 52 98 52 100 42 Z" fill="' + MANE + '" stroke="#111" stroke-width="2"/>' +
      eye + mouth + "</g>" + extra + "</svg>";
  }
  function poseCard(p) {
    return '<div class="pose-card"><div class="pose-heart">' + esc(p.heart) + "</div>" + broncho(p) + "<h3>" + esc(p.t) + '</h3><ul class="check">' + p.s.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
  }
  $("pose-grid").innerHTML = POSES.map(function (p, i) { return '<div>' + poseCard(p) + '<button class="btn ghost sm no-print" type="button" data-pose="' + i + '">Print this poster</button></div>'; }).join("");
  $("pose-grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-pose]"); if (!b) return;
    var p = POSES[+b.getAttribute("data-pose")];
    print('<div class="sheet poster">' + head("Sunnyside Bronchos Have HEART") + '<div class="poster-pose">' + poseCard(p) + "</div></div>");
  });
  $("pose-all").addEventListener("click", function () {
    print('<div class="sheet">' + head("Sunnyside Bronchos Have HEART: What It Looks Like") + '<div class="pose-print-grid">' + POSES.map(poseCard).join("") + "</div></div>");
  });

  /* ---------- HEART poster (editable) ---------- */
  var HKEY = "bim.heart.v1";
  var saved = {}; try { saved = JSON.parse(localStorage.getItem(HKEY)) || {}; } catch (e) {}
  function heartTable(editable) {
    return '<table class="heart-matrix"><thead><tr><th></th>' + HEART_SETTINGS.map(function (s) { return "<th>" + esc(s) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      Object.keys(HEART_MATRIX).map(function (v) {
        return '<tr><th><span class="hl">' + v.charAt(0) + "</span>" + v.slice(1) + "</th>" + HEART_MATRIX[v].map(function (t, i) {
          var k = v + i, txt = saved[k] != null ? saved[k] : t;
          return "<td" + (editable ? ' contenteditable="true" data-hk="' + k + '"' : "") + ">" + esc(txt) + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table>";
  }
  function renderHeart() { $("heart-edit").innerHTML = heartTable(true); }
  $("heart-edit").addEventListener("input", function (e) {
    var k = e.target.getAttribute("data-hk"); if (!k) return;
    saved[k] = e.target.textContent; try { localStorage.setItem(HKEY, JSON.stringify(saved)); } catch (err) {}
  });
  $("heart-reset").addEventListener("click", function () { saved = {}; try { localStorage.removeItem(HKEY); } catch (e) {} renderHeart(); });
  $("heart-print").addEventListener("click", function () {
    print('<div class="sheet poster landscape"><div class="heart-title"><img src="img/broncho-logo.png" alt=""><div><span>Sunnyside</span><b>Bronchos Have HEART</b></div></div>' + heartTable(false) + "</div>");
  });
  $("heart-print-values").addEventListener("click", function () {
    print('<div class="sheet poster"><div class="heart-title"><img src="img/broncho-logo.png" alt=""><div><span>Sunnyside</span><b>Bronchos Have HEART</b></div></div><div class="heart-values">' +
      Object.keys(HEART_WORDS).map(function (v) { return '<div><span class="hl">' + v.charAt(0) + "</span><b>" + v + "</b><p>" + esc(HEART_WORDS[v]) + "</p></div>"; }).join("") + "</div></div>");
  });
  renderHeart();

  /* ---------- Student reminder posters ---------- */
  function reminder(k) {
    var r = REMINDERS[k];
    return '<div class="reminder"><h3>' + esc(r.t) + "</h3>" + r.rows.map(function (x) { return '<div class="rrow"><span class="rnum">' + esc(x[0]) + "</span><div><b>" + esc(x[1]) + "</b><p>" + esc(x[2]) + "</p></div></div>"; }).join("") + "</div>";
  }
  $("reminders").innerHTML = Object.keys(REMINDERS).map(function (k) {
    return '<div class="card">' + reminder(k) + '<p class="cite">' + esc(BIM.shortCite(REMINDERS[k].c)) + '</p><button class="btn ghost sm no-print" type="button" data-rem="' + k + '">Print poster</button></div>';
  }).join("");
  $("reminders").addEventListener("click", function (e) {
    var b = e.target.closest("[data-rem]"); if (!b) return;
    print('<div class="sheet poster">' + head("Sunnyside Bronchos Have HEART") + '<div class="poster-rem">' + reminder(b.getAttribute("data-rem")) + "</div></div>");
  });

  /* ---------- Visiting pass ---------- */
  function passHtml() {
    var reasons = ["Reset / calm-down break", "Finish work in a quiet space", "Reflection time"];
    var one = '<div class="pass"><div class="pass-head"><img src="img/broncho-logo.png" alt=""><div><b>Broncho Visiting Pass</b><span>A reset, not a punishment</span></div></div>' +
      '<p>Student: ' + line(val("vp-student")) + " &nbsp; Date: " + line("", 90) + "</p>" +
      "<p>From: " + line(val("vp-from")) + " &nbsp; Room " + line(val("vp-fromroom"), 50) + "</p>" +
      "<p>To: " + line(val("vp-to")) + " &nbsp; Room " + line(val("vp-toroom"), 50) + "</p>" +
      '<p>Purpose: ' + reasons.map(function (r) { return '<span class="box"></span> ' + r; }).join(" &nbsp; ") + "</p>" +
      "<p>Time left: " + line("", 70) + " &nbsp; Return by: " + line("", 70) + " <small>(" + esc(val("vp-mins") || "10") + " minutes max)</small></p>" +
      '<p class="pass-recv"><b>Receiving teacher:</b> Arrived ' + line("", 60) + " Returned " + line("", 60) + " Initials " + line("", 40) + "</p></div>";
    var refl = '<div class="pass"><div class="pass-head"><img src="img/broncho-logo.png" alt=""><div><b>Reset &amp; Reflect</b><span>Complete before you return</span></div></div>' +
      "<p><b>1. What happened?</b></p><p class=\"rl\"></p><p class=\"rl\"></p>" +
      "<p><b>2. What was I feeling or needing?</b> <span class=\"box\"></span> frustrated <span class=\"box\"></span> stuck on work <span class=\"box\"></span> upset with someone <span class=\"box\"></span> tired <span class=\"box\"></span> other</p>" +
      "<p><b>3. Which HEART expectation will I use?</b> <span class=\"box\"></span> Honesty <span class=\"box\"></span> Effort <span class=\"box\"></span> Attitude <span class=\"box\"></span> Respect <span class=\"box\"></span> Teamwork</p>" +
      "<p><b>4. When I go back, I will:</b></p><p class=\"rl\"></p>" +
      "<p><b>I am ready to return.</b> Student " + line("", 120) + "</p></div>";
    return '<div class="sheet">' + one + '<div class="cutline">cut here</div>' + one + '</div><div class="sheet page-break">' + refl + '<div class="cutline">cut here</div>' + refl + "</div>";
  }
  function updatePass() { $("vp-preview").innerHTML = passHtml(); }
  ["vp-student", "vp-from", "vp-fromroom", "vp-to", "vp-toroom", "vp-mins"].forEach(function (id) { $(id).addEventListener("input", updatePass); });
  $("vp-print").addEventListener("click", function () { print(passHtml()); });
  updatePass();

  /* ---------- Class jobs ---------- */
  $("jobs-list").innerHTML = JOBS.map(function (j, i) {
    return '<label class="opt"><input type="checkbox" class="job" value="' + i + '" checked><span>' + j.i + " <b>" + esc(j.n) + "</b>: " + esc(j.d) + ' <span class="pill ok">' + esc(j.g) + "</span></span></label>";
  }).join("");
  function chosenJobs() { return Array.prototype.filter.call(document.querySelectorAll(".job"), function (c) { return c.checked; }).map(function (c) { return JOBS[+c.value]; }); }
  $("job-chart").addEventListener("click", function () {
    print('<div class="sheet poster">' + head("Our Class Jobs" + (val("job-class") ? ": " + val("job-class") : "")) + '<p class="sheet-dir">Week of: ________________ &nbsp; Jobs rotate every Monday.</p><div class="job-chart">' +
      chosenJobs().map(function (j) { return '<div class="job-slot"><span class="ji">' + j.i + "</span><b>" + esc(j.n) + '</b><span class="blank"></span></div>'; }).join("") + "</div></div>");
  });
  $("job-cards").addEventListener("click", function () {
    print('<div class="sheet"><div class="job-cards">' + chosenJobs().map(function (j) {
      return '<div class="job-card"><div class="jc-top"><span class="ji">' + j.i + "</span><b>" + esc(j.n) + "</b></div><p>" + esc(j.d) + "</p><ol>" + j.s.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ol><p class="jc-heart">HEART: I do my job without being reminded.</p></div>';
    }).join("") + "</div></div>");
  });
  $("job-app").addEventListener("click", function () {
    var app = '<div class="pass">' + '<div class="pass-head"><img src="img/broncho-logo.png" alt=""><div><b>Class Job Application</b><span>Sunnyside Bronchos Have HEART</span></div></div>' +
      "<p>Name: " + line("", 200) + "</p><p>Job I want (1st choice): " + line("", 160) + "</p><p>2nd choice: " + line("", 160) + "</p>" +
      "<p><b>Why I would be good at this job:</b></p><p class=\"rl\"></p><p class=\"rl\"></p>" +
      "<p><b>One HEART value I will show in this job:</b> <span class=\"box\"></span> Honesty <span class=\"box\"></span> Effort <span class=\"box\"></span> Attitude <span class=\"box\"></span> Respect <span class=\"box\"></span> Teamwork</p>" +
      "<p>Signature: " + line("", 180) + "</p></div>";
    print('<div class="sheet">' + app + '<div class="cutline">cut here</div>' + app + "</div>");
  });
  $("job-log").addEventListener("click", function () {
    var weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"];
    print('<div class="sheet">' + head("Class Job Rotation Log") + '<table class="sheet-grid"><thead><tr><th>Job</th>' + weeks.map(function (w) { return "<th>" + w + "<br><small>__/__</small></th>"; }).join("") + "</tr></thead><tbody>" +
      chosenJobs().map(function (j) { return "<tr><td>" + j.i + " " + esc(j.n) + "</td>" + weeks.map(function () { return "<td></td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
  });

  /* ---------- Contracts ---------- */
  function classAgreement() {
    var list = function (id, n) { var v = val(id).split("\n").map(function (s) { return s.trim(); }).filter(Boolean); while (v.length < n) v.push(""); return "<ol>" + v.map(function (s) { return "<li>" + (s ? esc(s) : '<span class="blank" style="min-width:420px"></span>') + "</li>"; }).join("") + "</ol>"; };
    return '<div class="sheet poster">' + head("Our Class Agreement" + (val("ca-class") ? ": " + val("ca-class") : "")) +
      "<h3>Our goals for this year</h3>" + list("ca-goals", 3) +
      "<h3>To reach our goals, we agree to</h3>" + list("ca-we", 4) +
      "<h3>Our teacher agrees to</h3>" + list("ca-teacher", 3) +
      "<h3>When someone makes a mistake, we will</h3>" + list("ca-repair", 2) +
      '<div class="sig-grid">' + Array(30).join(",").split(",").map(function () { return '<span class="blank"></span>'; }).join("") + "</div>" +
      '<p class="sheet-cite">Co-created classroom rules: Responsive Classroom (Rimm-Kaufman et al., 2014); positively stated expectations: Center on PBIS (2022).</p></div>';
  }
  function studentContract() {
    return '<div class="sheet">' + head("Student Behavior Contract") +
      '<table class="sheet-meta"><tr><td>Student: ' + line(val("sc-student")) + "</td><td>Teacher: " + line(val("sc-teacher")) + "</td></tr>" +
      "<tr><td>Start date: " + line(val("sc-start"), 90) + "</td><td>Review date: " + line(val("sc-review"), 90) + "</td></tr></table>" +
      '<div class="ct-box"><b>My goal (what I WILL do):</b><p>' + (val("sc-goal") ? esc(val("sc-goal")) : '<span class="blank" style="min-width:500px"></span>') + "</p></div>" +
      '<div class="ct-box"><b>How we will know I met it:</b><p>' + (val("sc-measure") ? esc(val("sc-measure")) : '<span class="blank" style="min-width:500px"></span>') + "</p></div>" +
      '<div class="grid g2" style="gap:10px"><div class="ct-box"><b>I will:</b><p>' + esc(val("sc-student-do")) + '</p></div><div class="ct-box"><b>My teacher will help by:</b><p>' + esc(val("sc-teacher-do")) + "</p></div></div>" +
      '<div class="ct-box"><b>When I meet my goal, I earn (I chose this):</b><p>' + (val("sc-reward") ? esc(val("sc-reward")) : '<span class="blank" style="min-width:420px"></span>') + "</p></div>" +
      '<div class="ct-box"><b>If it gets hard, I can:</b><p>' + esc(val("sc-support")) + "</p></div>" +
      '<table class="sheet-grid"><thead><tr><th>Goal met?</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr></thead><tbody><tr><td>Week 1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Week 2</td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>' +
      '<p class="sheet-sign">Student ______________________ &nbsp; Teacher ______________________ &nbsp; Parent/Guardian ______________________</p>' +
      '<p class="sheet-cite">Behavior contracts: Bowman-Perrott, Burke, de Marin, Zhang, &amp; Davis (2015).</p></div>';
  }
  $("ca-print").addEventListener("click", function () { print(classAgreement()); });
  $("sc-print").addEventListener("click", function () { print(studentContract()); });
  $("ca-example").addEventListener("click", function () {
    $("ca-goals").value = "Learn something new every day\nMake our room a place where everyone belongs\nGrow in reading and math";
    $("ca-we").value = "Listen when others are speaking\nTry our best, even when it's hard\nUse kind words and include everyone\nTake care of our room and materials";
    $("ca-teacher").value = "Greet us every day and treat us fairly\nTeach clearly and help when we're stuck\nNotice when we show HEART";
    $("ca-repair").value = "Talk it out calmly and make it right\nGive each other a fresh start";
  });

  /* ---------- Incentives ---------- */
  $("inc-research").innerHTML = INCENTIVE_RESEARCH.map(function (r) { return '<div class="card red-top"><h3>' + esc(r.t) + "</h3><p>" + esc(r.d) + '</p><p class="cite">' + esc(BIM.shortCite(r.c)) + "</p></div>"; }).join("");
  var groups = { individual: "Individual (free)", group: "Table or small group", whole: "Whole class" };
  $("inc-menu").innerHTML = Object.keys(groups).map(function (g) { return '<div class="card"><h3>' + groups[g] + '</h3><ul class="check">' + INCENTIVES[g].map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>"; }).join("");
  $("inc-menu-print").addEventListener("click", function () {
    print('<div class="sheet poster">' + head("Classroom Reward Menu") + '<table class="sheet-grid"><thead><tr><th>Reward</th><th>Broncho Bucks</th></tr></thead><tbody>' +
      INCENTIVES.individual.slice(0, 12).map(function (t) { return "<tr><td>" + esc(t) + "</td><td></td></tr>"; }).join("") + "</tbody></table>" +
      '<p class="sheet-dir">Earn rewards by showing HEART: Honesty, Effort, Attitude, Respect, Teamwork. Spend your Broncho Bucks here.</p></div>');
  });
  $("inc-note").addEventListener("click", function () {
    var note = '<div class="pass"><div class="pass-head"><img src="img/broncho-logo.png" alt=""><div><b>Good News from Sunnyside!</b><span>A Broncho showed HEART today</span></div></div>' +
      "<p>Dear family of " + line("", 180) + ",</p><p>Today your child showed <span class=\"box\"></span> Honesty <span class=\"box\"></span> Effort <span class=\"box\"></span> Attitude <span class=\"box\"></span> Respect <span class=\"box\"></span> Teamwork when they:</p><p class=\"rl\"></p><p class=\"rl\"></p>" +
      "<p>Please celebrate this at home! &nbsp; " + line("", 140) + " &nbsp; Date " + line("", 70) + "</p></div>";
    print('<div class="sheet">' + note + '<div class="cutline">cut here</div>' + note + '<div class="cutline">cut here</div>' + note + "</div>");
  });
  $("inc-mystery").addEventListener("click", function () {
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    print('<div class="sheet poster">' + head("Mystery Motivator") + '<p class="sheet-dir">Class goal: ' + line("", 360) + '</p><p class="sheet-dir">If we meet our goal, we color in today\'s box. A hidden <b>M</b> means the mystery reward is revealed!</p><div class="mystery">' +
      days.map(function (d) { return '<div><b>' + d + '</b><span class="mbox">?</span></div>'; }).join("") + '</div><div class="mystery-env"><b>Mystery reward</b> (sealed until earned)</div><p class="sheet-cite">Davis et al. (2024); Maggin et al. (2017).</p></div>');
  });
  $("inc-punch").addEventListener("click", function () {
    var card = '<div class="punch"><div class="pass-head"><img src="img/broncho-logo.png" alt=""><div><b>HEART Punch Card</b><span>Name ____________</span></div></div><div class="holes">' + Array(10).join(",").split(",").map(function () { return '<span class="hole">&#9825;</span>'; }).join("") + '</div><small>Fill all 10 to choose a reward from the menu.</small></div>';
    print('<div class="sheet"><div class="bucks-grid">' + Array(8).join(",").split(",").map(function () { return card; }).join("") + "</div></div>");
  });
})();
