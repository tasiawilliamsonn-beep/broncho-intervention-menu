/* Weekly counselor meeting notes: things teachers notice that may not need a PowerSchool log entry
   but should be on the counselor's and administrators' radar. Saved on this device; prints a summary. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = "bim.counsel.v1";
  var st = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  st.items = st.items || []; st.meta = st.meta || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { BIM.toast("This browser blocked saving."); } }
  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function fmt(s) { if (!s) return ""; var p = s.split("-"); return +p[1] + "/" + +p[2] + "/" + p[0]; }

  var CATS = ["Attendance or tardiness pattern", "Mood change, withdrawn, or seems worried", "Peer conflict or friendship issue", "Possible bullying (also report to an administrator)",
    "Basic needs (food, clothing, hygiene, sleep)", "Family change (move, loss, new situation)", "Academic decline or missing work", "Behavior pattern not yet logged",
    "Health concern or frequent nurse visits", "Online or social media concern", "Positive change to celebrate", "Other"];
  var RADAR = { admin: ["Administrator awareness", "red"], counselor: ["Counselor follow-up this week", "warn"], watch: ["Watch and check back next week", "ok"] };
  var DONE = ["Talked with the student", "Contacted the family", "Logged in PowerSchool", "Nothing yet"];
  var WORDS = /\b(lazy|rude|disrespectful|attitude|crazy|liar|manipulative|always|never|bad kid|annoying)\b/i;

  $("cn-cat").innerHTML = CATS.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("");
  $("cn-done").innerHTML = DONE.map(function (d, i) { return '<label class="opt"><input type="checkbox" value="' + i + '"><span>' + esc(d) + "</span></label>"; }).join("");
  ["cn-date", "cn-team", "cn-counselor", "cn-who"].forEach(function (id) {
    $(id).value = st.meta[id] || (id === "cn-date" ? today() : "");
    $(id).addEventListener("input", function () { st.meta[id] = this.value; save(); });
  });
  $("cn-noticed").addEventListener("input", function () {
    $("cn-flag").hidden = !WORDS.test(this.value);
  });

  function render() {
    var open = st.items.filter(function (x) { return !x.closed; });
    var order = ["admin", "counselor", "watch"];
    open.sort(function (a, b) { return order.indexOf(a.radar) - order.indexOf(b.radar) || a.created.localeCompare(b.created); });
    $("cn-count").textContent = open.length ? open.length + " open" : "";
    $("cn-list").innerHTML = open.length ? open.map(function (x) {
      var r = RADAR[x.radar];
      return '<div class="cn-item ' + r[1] + '"><div class="cn-top"><b>' + esc(x.student) + '</b> <span class="pill ' + (r[1] === "ok" ? "ok" : "no") + '">' + esc(r[0]) + '</span> <span class="hint">' + esc(x.cat) + (x.created < (st.meta["cn-date"] || today()) ? " &middot; carried over from " + fmt(x.created) : "") + "</span></div>" +
        "<p>" + esc(x.noticed) + (x.since ? ' <span class="hint">(' + esc(x.since) + ")</span>" : "") + "</p>" +
        '<p class="hint">Already done: ' + esc(x.done.length ? x.done.map(function (i) { return DONE[i]; }).join(", ") : "Not noted") + (x.owner ? " &middot; Follow-up: " + esc(x.owner) + (x.by ? " by " + fmt(x.by) : "") : "") + "</p>" +
        '<div class="cn-actions"><button class="btn ghost sm" type="button" data-close="' + x.id + '">Mark resolved</button><button class="btn ghost sm" type="button" data-del="' + x.id + '">Delete</button></div></div>';
    }).join("") : '<p class="hint">No open notes. Add what your team noticed this week.</p>';
  }

  $("cn-add").addEventListener("click", function () {
    var student = $("cn-student").value.trim(), noticed = $("cn-noticed").value.trim();
    if (!student) { BIM.toast("Add the student's initials"); $("cn-student").focus(); return; }
    if (noticed.split(/\s+/).length < 5) { BIM.toast("Describe what you noticed in a full sentence"); $("cn-noticed").focus(); return; }
    var done = Array.prototype.filter.call($("cn-done").querySelectorAll("input"), function (c) { return c.checked; }).map(function (c) { return +c.value; });
    st.items.push({ id: Date.now().toString(36), student: student, cat: $("cn-cat").value, noticed: noticed, since: $("cn-since").value.trim(), done: done,
      radar: document.querySelector('input[name="cn-radar"]:checked').value, owner: $("cn-owner").value.trim(), by: $("cn-by").value, created: st.meta["cn-date"] || today() });
    save();
    ["cn-student", "cn-noticed", "cn-since", "cn-owner", "cn-by"].forEach(function (id) { $(id).value = ""; });
    $("cn-done").querySelectorAll("input").forEach(function (c) { c.checked = false; });
    $("cn-flag").hidden = true;
    render(); BIM.toast("Added to this week's notes");
  });
  $("cn-list").addEventListener("click", function (e) {
    var c = e.target.getAttribute("data-close"), d = e.target.getAttribute("data-del");
    if (c) { st.items.forEach(function (x) { if (x.id === c) { x.closed = today(); } }); save(); render(); }
    if (d && confirm("Delete this note?")) { st.items = st.items.filter(function (x) { return x.id !== d; }); save(); render(); }
  });

  $("cn-print").addEventListener("click", function () {
    var open = st.items.filter(function (x) { return !x.closed; });
    if (!open.length) { BIM.toast("Add at least one note first"); return; }
    var mdate = st.meta["cn-date"] || today();
    var h = '<div class="sheet">' + BIM.sheetHead("Weekly Counselor Meeting Notes") +
      '<table class="sheet-meta"><tr><td>Date: <b>' + fmt(mdate) + "</b></td><td>Team: <b>" + esc(st.meta["cn-team"] || "") + "</b></td></tr>" +
      "<tr><td>Counselor: <b>" + esc(st.meta["cn-counselor"] || "") + "</b></td><td>Attending: <b>" + esc(st.meta["cn-who"] || "") + "</b></td></tr></table>" +
      '<p class="sheet-dir"><b>Confidential.</b> For Lafayette Sunnyside Intermediate School counselor and administrator use. Store securely and shred when no longer needed.</p>';
    ["admin", "counselor", "watch"].forEach(function (k) {
      var rows = open.filter(function (x) { return x.radar === k; }); if (!rows.length) return;
      h += "<h3>" + esc(RADAR[k][0]) + " (" + rows.length + ")</h3>" +
        '<table class="sheet-grid cn-print"><thead><tr><th>Student</th><th>What we noticed</th><th>Already done</th><th>Follow-up</th><th>Notes</th></tr></thead><tbody>' +
        rows.map(function (x) {
          return "<tr><td><b>" + esc(x.student) + "</b><br><small>" + esc(x.cat) + "</small>" + (x.created < mdate ? "<br><small>Open since " + fmt(x.created) + "</small>" : "") + "</td><td>" + esc(x.noticed) + (x.since ? "<br><small>" + esc(x.since) + "</small>" : "") +
            "</td><td>" + esc(x.done.map(function (i) { return DONE[i]; }).join(", ")) + "</td><td>" + esc(x.owner || "") + (x.by ? "<br>by " + fmt(x.by) : "") + "</td><td></td></tr>";
        }).join("") + "</tbody></table>";
    });
    h += '<p class="sheet-sign">Counselor initials: ______ &nbsp; Shared with administrator: ______________ &nbsp; Date: ________</p></div>';
    BIM.printHTML(h);
  });
  render();
})();
