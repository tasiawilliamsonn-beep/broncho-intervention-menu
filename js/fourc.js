/* 4 C's Audit: teachers rate Climate, Communication, Curriculum, and Culture practices,
   then get behaviors they may be seeing and next steps. Ratings stay in this browser. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = "bim.fourc.v1";
  var r = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} }

  function renderItems() {
    $("fc-list").innerHTML = FOURC.map(function (g, gi) {
      return '<div class="panel fc-group" style="margin-bottom:16px"><header><h2><span class="fc-letter">C</span>' + esc(g.c) + '</h2></header><div class="body"><p class="hint">' + esc(g.q) + "</p>" +
        g.items.map(function (it, ii) {
          var k = gi + "." + ii;
          return '<div class="sc-item"><div><b>' + esc(it.t) + '</b><br><span class="cite">' + esc(it.c) + '</span></div><div class="chips fc-chips" role="group" aria-label="Rating">' +
            FOURC_SCALE.map(function (s) { return '<button type="button" class="chip" data-fc="' + k + '" data-v="' + s[0] + '" aria-pressed="' + (r[k] === s[0]) + '" title="' + s[1] + '">' + s[0] + " <small>" + s[1] + "</small></button>"; }).join("") +
            "</div></div>";
        }).join("") + "</div></div>";
    }).join("");
  }

  function groupScore(gi) {
    var vals = FOURC[gi].items.map(function (_, ii) { return r[gi + "." + ii]; }).filter(Boolean).map(Number);
    if (!vals.length) return null;
    var pct = Math.round(vals.reduce(function (a, b) { return a + b - 1; }, 0) / (3 * vals.length) * 100);
    return { pct: pct, n: vals.length, total: FOURC[gi].items.length };
  }
  function status(p) { return p >= 80 ? ["ok", "Strong"] : p >= 55 ? ["warn", "Developing"] : ["red", "Priority"]; }

  function renderResults() {
    var rated = Object.keys(r).length, count = FOURC.reduce(function (n, g) { return n + g.items.length; }, 0);
    if (!rated) {
      $("fc-summary").innerHTML = '<p class="hint">Rate each practice from 1 (Not yet) to 4 (Consistently). Your scores, the behaviors you may be seeing, and your next steps appear here.</p>';
      $("fc-plan").innerHTML = ""; return;
    }
    var h = '<p class="hint">' + rated + " of " + count + " practices rated</p>";
    FOURC.forEach(function (g, gi) {
      var s = groupScore(gi);
      var st = s ? status(s.pct) : null;
      h += '<div class="fc-row"><span>' + esc(g.c) + "</span>" + (s ? '<div class="meter"><span style="width:' + s.pct + '%"></span></div><b>' + s.pct + '%</b> <span class="pill ' + (st[0] === "ok" ? "ok" : "no") + '">' + st[1] + "</span>" : '<span class="hint">not rated</span>') + "</div>";
    });
    var all = [];
    FOURC.forEach(function (g, gi) { g.items.forEach(function (it, ii) { var v = r[gi + "." + ii]; if (v && +v <= 2) all.push({ g: g.c, it: it, v: +v }); }); });
    all.sort(function (a, b) { return a.v - b.v; });
    if (all.length) h += '<h3 class="subhead" style="font-size:1rem;margin:16px 0 6px">Top priorities</h3><ol class="fc-top">' + all.slice(0, 3).map(function (x) { return "<li><b>" + esc(x.g) + ":</b> " + esc(x.it.next) + "</li>"; }).join("") + "</ol>";
    $("fc-summary").innerHTML = h;

    $("fc-plan").innerHTML = '<h2 class="title" style="margin-top:28px">Your 4 C\'s action plan</h2>' + FOURC.map(function (g, gi) {
      var s = groupScore(gi); if (!s) return "";
      var st = status(s.pct);
      var steps = g.items.map(function (it, ii) { return { it: it, v: +(r[gi + "." + ii] || 0) }; }).filter(function (x) { return x.v && x.v <= 3; }).sort(function (a, b) { return a.v - b.v; });
      return '<div class="panel fc-card" style="margin-bottom:16px"><header><h2>' + esc(g.c) + '</h2><span class="pill ' + (st[0] === "ok" ? "ok" : "no") + '">' + st[1] + " &middot; " + s.pct + "%</span></header><div class=\"body\">" +
        (st[1] === "Strong" ? '<p><b>This is a strength.</b> Keep it consistent and share what works with your team.</p>'
          : '<div class="grid g2" style="gap:16px;align-items:start"><div><h3 class="fc-h">Behaviors you may be seeing</h3><ul class="check x">' + g.see.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>" +
            '<div><h3 class="fc-h">Why</h3><p>When ' + esc(g.c.toLowerCase()) + " practices are not yet consistent, these behaviors are more likely across the whole class, not just for one student. Strengthening Tier 1 first often reduces them without individual plans.</p></div></div>") +
        (steps.length ? '<h3 class="fc-h">Next steps</h3><ol class="fc-steps">' + steps.map(function (x) {
          return '<li><span class="pill ' + (x.v <= 2 ? "no" : "ok") + '">' + (x.v <= 2 ? "Start here" : "Make it consistent") + "</span> " + esc(x.it.next) +
            ' <a href="' + x.it.go[0] + '">' + esc(x.it.go[1]) + ' &rarr;</a> <span class="cite">(' + esc(x.it.c) + ")</span></li>";
        }).join("") + "</ol>" : "") +
        (s.n < s.total ? '<p class="hint">' + (s.total - s.n) + " practice(s) not rated yet.</p>" : "") +
        "</div></div>";
    }).join("");
  }

  $("fc-list").addEventListener("click", function (e) {
    var b = e.target.closest("[data-fc]"); if (!b) return;
    var k = b.getAttribute("data-fc"), v = b.getAttribute("data-v");
    if (r[k] === v) delete r[k]; else r[k] = v;
    save();
    b.parentNode.querySelectorAll("[data-fc]").forEach(function (x) { x.setAttribute("aria-pressed", r[k] === x.getAttribute("data-v")); });
    renderResults();
  });
  $("fc-reset").addEventListener("click", function () { if (!confirm("Clear all of your 4 C's ratings?")) return; r = {}; save(); renderItems(); renderResults(); });
  $("fc-print").addEventListener("click", function () { window.print(); });

  /* Links to other tabs on this page (tools.html#posters) switch tabs */
  window.addEventListener("hashchange", function () {
    var t = document.querySelector('[data-tab="' + location.hash.slice(1) + '"]');
    if (t) { t.click(); window.scrollTo(0, 0); }
  });

  renderItems(); renderResults();
})();
