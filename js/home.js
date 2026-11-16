/* Home page: behavior search, "Your students" reminders (from logs saved on this computer only),
   and the one-page printable desk reference. */
(function () {
  var esc = BIM.esc, $ = function (id) { return document.getElementById(id); };

  /* ---------- 1. behavior search ---------- */
  var WORDS = {
    talking: "talk talking calling out blurting chatty chatting side conversation conversations noise noises interrupting",
    offtask: "off task not working distracted head down doodling daydreaming wont start not starting device website unfinished classwork",
    outofarea: "out of seat wandering walking around leaving seat out of area hall pass",
    tone: "attitude arguing argue back talk talking back eye rolling sighing muttering yelling loud voice tone disrespect disrespectful",
    homework: "homework missing work materials pencil late work copying copied incomplete planner forgot assignment",
    language: "cursing swearing profanity bad words cuss inappropriate comments language",
    unsafe: "chair tipping rocking throwing scissors unsafe equipment tossing",
    running: "running hallway hall loud line route",
    putdowns: "teasing name calling mean laughing excluding put downs rude to peer",
    pda: "hugging kissing holding hands affection pda",
    hands: "poking pushing kicking touching grabbing hands on throwing at",
    horseplay: "play fighting wrestling chasing rough play horseplay",
    intimidation: "threat threatening intimidating intimidation pressuring",
    vandalism: "writing on desk drawing on desk ripping breaking damage damaging vandalism",
    refusal: "refusing refuse refused wont work defiance defiant noncompliance not following directions arguing negotiating shut down",
    tardy: "late tardy skipping lingering",
    chronic: "keeps happening repeated chronic daily"
  };
  /* extra words for specific "what it looked like" options */
  var VWORDS = { "talking:3": "test quiz assessment silent quiet work", "talking:1": "chatting talking to friends neighbor", "talking:0": "blurting answers raising hand",
    "hands:1": "push pushed pushing shove line", "hands:0": "kicking poking under the table", "offtask:0": "wont start not starting wont work",
    "homework:0": "missing homework not turned in", "homework:6": "cheating copied copying", "tone:1": "eye rolling sighing muttering", "refusal:0": "wont work refuses to work",
    "tardy:0": "late to class tardy", "outofarea:0": "out of seat up out of seat", "language:0": "cursing swearing" };
  var INDEX = [];
  BEHAVIORS.forEach(function (b) {
    b.v.forEach(function (v, i) {
      var vw = VWORDS[b.id + ":" + i] || "";
      INDEX.push({ key: b.id + ":" + i, level: b.level, name: b.name, look: v.t, text: (b.name + " " + v.t + " " + (WORDS[b.id] || "") + " " + vw + " " + vw).toLowerCase(), vw: vw });
    });
  });
  LEVEL3.forEach(function (t, i) { INDEX.push({ key: "L3:" + i, level: 3, name: "Level 3", look: t, text: ("level 3 office referral " + t).toLowerCase() }); });
  LEVEL4.forEach(function (t, i) { INDEX.push({ key: "L4:" + i, level: 4, name: "Level 4", look: t, text: ("level 4 administrator emergency " + t).toLowerCase() }); });

  function search(q) {
    var words = q.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/'/g, "").split(/\s+/).filter(function (w) { return w.length > 1 && !/^(the|a|an|is|was|and|to|of|in|on|he|she|my|student|kid|keeps)$/.test(w); });
    if (!words.length) return [];
    return INDEX.map(function (e) {
      var score = 0, flat = e.text.replace(/'/g, "");
      words.forEach(function (w) { if (flat.indexOf(w) > -1) score += 2; else if (w.length > 4 && flat.indexOf(w.slice(0, -2)) > -1) score += 1; if (e.vw && e.vw.indexOf(w) > -1) score += 2; });
      if (e.look.toLowerCase().replace(/'/g, "").indexOf(words.join(" ")) > -1) score += 3;
      return { e: e, score: score };
    }).filter(function (r) { return r.score > 0; }).sort(function (a, b) { return b.score - a.score || a.e.level - b.e.level; }).slice(0, 6).map(function (r) { return r.e; });
  }
  function showResults() {
    var q = $("hs-q").value.trim(), list = q ? search(q) : [];
    $("hs-results").innerHTML = !q ? "" : list.length ? list.map(function (e, i) {
      return '<a class="hs-item" href="menu.html?b=' + e.key + '"' + (i === 0 ? ' aria-selected="true"' : "") + '><span class="lvl-badge l' + e.level + '">Level ' + e.level + "</span><span><b>" + esc(e.look) + "</b>" +
        (e.level <= 2 ? "<small>" + esc(e.name) + "</small>" : "") + "</span></a>";
    }).join("") : '<p class="hint" style="padding:10px 12px;margin:0">No match. Try other words, or <a href="menu.html">browse all behaviors</a>.</p>';
  }
  $("hs-q").addEventListener("input", showResults);
  $("hs-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var first = document.querySelector("#hs-results .hs-item");
    location.href = first ? first.getAttribute("href") : "menu.html";
  });

  /* ---------- 2. Your students (this computer only) ---------- */
  function dayDiff(a, b) { return Math.round((new Date(b) - new Date(a)) / 864e5); }
  var today = new Date().toISOString().slice(0, 10);
  function studentStatus(L) {
    L = L.slice().sort(function (a, b) { return (a.date || "").localeCompare(b.date || ""); });
    var lv = L.reduce(function (m, l) { return Math.max(m, l.level || 0); }, 0);
    var comms = L.filter(function (l) { return l.type === "COMMUNICATION" || (l.contact && l.contact.made); }).length;
    var used = {}, order = [];
    L.forEach(function (l) { if (!l.date) return; (l.ints || []).forEach(function (id) { if (!used[id]) { used[id] = { a: l.date, b: l.date }; order.push(id); } if (l.date > used[id].b) used[id].b = l.date; }); });
    var ids = Object.keys(used), full = ids.filter(function (id) { return dayDiff(used[id].a, used[id].b) >= 14; }).length;
    var dates = L.map(function (l) { return l.date; }).filter(Boolean), first = dates[0], last = dates[dates.length - 1];
    var since = last ? dayDiff(last, today) : 0, span = first ? dayDiff(first, last) : 0;
    var cur = order[order.length - 1], curDay = cur ? dayDiff(used[cur].a, today) : 0;
    var lastResp = (L.filter(function (l) { return l.response; }).pop() || {}).response || "";
    var s;
    if (lv >= 3) s = { p: 1, cls: "red", msg: "Level " + lv + " behavior logged. Follow up with your administrator.", link: "logs.html?student=" };
    else if (lv === 2 && !comms) s = { p: 0, cls: "red", msg: "Level 2: no family contact logged yet.", link: "parent.html", btn: "Contact the family" };
    else if (ids.length >= 3 && full >= 3 && /no change|partial|escalat/i.test(lastResp)) s = { p: 2, cls: "warn", msg: "3 interventions documented with little change. Ready for the MTSS team.", link: "log.html#records", btn: "Print the packet" };
    else if (since > 14) s = { p: 3, cls: "warn", msg: "No log in " + since + " days. If the behavior continues, keep logging your interventions.", link: "log.html", btn: "Write a log" };
    else if (ids.length < 3 && cur && curDay >= 14) s = { p: 3, cls: "warn", msg: "Intervention " + ids.length + " of 3 (" + INTERVENTIONS[cur].name + ") has reached 2 weeks. Review the data: keep it or change it.", link: "logs.html?student=" };
    else if (since > 14) s = { p: 4, cls: "warn", msg: "No log in " + since + " days.", link: "log.html", btn: "Write a log" };
    else if (ids.length < 3) s = { p: 5, cls: "", msg: cur ? "Intervention " + ids.length + " of 3: " + INTERVENTIONS[cur].name + ", day " + Math.max(0, curDay) + " of 14." : "No Tier 1 intervention logged yet.", link: "logs.html?student=" };
    else s = { p: 6, cls: "ok", msg: "On track: " + ids.length + " interventions documented.", link: "logs.html?student=" };
    s.facts = L.length + " entr" + (L.length === 1 ? "y" : "ies") + " · " + span + " day" + (span === 1 ? "" : "s") + " documented · " + comms + " family contact" + (comms === 1 ? "" : "s");
    return s;
  }
  function renderStudents() {
    var logs = BIM.getLogs();
    if (!logs.length) { $("my-students").hidden = true; return; }
    var by = {}; logs.forEach(function (l) { var k = BIM.skey(l.student); (by[k] = by[k] || { name: l.student.trim(), L: [] }).L.push(l); });
    var rows = Object.keys(by).map(function (k) { var st = studentStatus(by[k].L); st.k = k; st.name = by[k].name; return st; }).sort(function (a, b) { return a.p - b.p || a.name.localeCompare(b.name); });
    var shown = rows.slice(0, 6);
    $("ms-list").innerHTML = shown.map(function (r) {
      var href = r.link === "logs.html?student=" ? "logs.html?student=" + encodeURIComponent(r.k) : r.link;
      return '<div class="ms-card ' + r.cls + '"><div class="ms-top"><b>' + esc(r.name) + '</b><span class="hint">' + esc(r.facts) + "</span></div><p>" + esc(r.msg) + '</p><a href="' + href + '">' + esc(r.btn || "Open record") + " &rarr;</a></div>";
    }).join("");
    $("ms-more").innerHTML = rows.length > shown.length ? '<a href="logs.html">See all ' + rows.length + " students &rarr;</a>" : "";
    $("my-students").hidden = false;
  }
  renderStudents();

  /* ---------- 3. one-page desk reference ---------- */
  function deskRef() {
    var lv = [1, 2, 3, 4].map(function (n) {
      var ex = n <= 2 ? BEHAVIORS.filter(function (b) { return b.level === n; }).map(function (b) { return b.name; }) : (n === 3 ? LEVEL3 : LEVEL4);
      return '<div class="dr-lvl l' + n + '"><b>Level ' + n + ": " + esc(LEVELS[n].who) + "</b><p>" + esc(ex.slice(0, n <= 2 ? 10 : 8).join(" · ")) + '</p><p class="dr-log">Log as: ' + esc(LEVELS[n].log) + "</p></div>";
    }).join("");
    var html = '<div class="sheet desk">' + BIM.sheetHead("Desk Reference: Tier 1 Behavior") +
      '<div class="dr-heart">' + ["Honesty", "Effort", "Attitude", "Respect", "Teamwork"].map(function (h) { return "<span><b>" + h.charAt(0) + "</b>" + h.slice(1) + "</span>"; }).join("") + "</div>" +
      '<h3>Sunnyside Behavior Intervention Matrix</h3><div class="dr-grid">' + lv + "</div>" +
      '<div class="dr-two"><div><h3>Three rules</h3><ol>' +
        "<li><b>An intervention is not a consequence.</b> Teach, prevent, or reinforce first.</li>" +
        "<li><b>Level 1 and 2 stay in the classroom.</b> Log them as Intervention. Level 2 needs family contact.</li>" +
        "<li><b>3 interventions, 2 to 3 weeks each,</b> before bringing a student to the MTSS team.</li></ol>" +
        "<h3>Log types</h3><ul>" + Object.keys(LOG_TYPES).map(function (k) { return "<li><b>" + k.charAt(0) + k.slice(1).toLowerCase() + ":</b> " + esc(LOG_TYPES[k]) + "</li>"; }).join("") + "</ul></div>" +
      "<div><h3>A strong log entry</h3><ol>" +
        "<li><b>Behavior identified</b> on the matrix, with the expectation missed</li><li><b>Specific description:</b> what, where, how often, in order</li>" +
        "<li><b>Objective language:</b> no judgment words</li><li><b>Appropriate log type</b></li><li><b>Intervention documented</b> by name</li>" +
        "<li><b>Student response</b> to the intervention</li><li><b>Next steps:</b> family contact, follow-up, support</li></ol>" +
        "<h3>Tier 1 timeline</h3><p>Weeks 1-3: Intervention 1 → Weeks 4-6: Intervention 2 → Weeks 7-9: Intervention 3 → little or no change: MTSS team.</p></div></div>" +
      '<p class="sheet-cite">The Broncho Intervention Menu · Sunnyside Behavior Intervention Matrix; Sunnyside MTSS process; Girvan et al., 2017; Kratochwill et al., 2013.</p></div>';
    BIM.printHTML(html);
  }
  $("desk-print").addEventListener("click", deskRef);
})();
