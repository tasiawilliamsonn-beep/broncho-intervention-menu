/* ML & SPED supports page: support cards and printables. */
(function () {
  var esc = BIM.esc, $ = function (id) { return document.getElementById(id); };
  function cards(list) {
    return list.map(function (s) {
      return '<div class="card sup-card"><h3>' + esc(s[0]) + "</h3><p>" + esc(s[1]) + '</p><p class="why"><b>Research:</b> ' + esc(s[2]) + " (" + s[3].map(BIM.shortCite).join("; ") + ")</p></div>";
    }).join("");
  }
  $("ml-list").innerHTML = cards(ML_SUPPORTS);
  $("sped-list").innerHTML = cards(SPED_SUPPORTS);

  function tab(t) {
    document.querySelectorAll("[data-tab]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === t); });
    ["ml", "sped", "print"].forEach(function (k) { $("tab-" + k).hidden = k !== t; });
    try { history.replaceState(null, "", "#" + t); } catch (e) {}
  }
  document.querySelectorAll("[data-tab]").forEach(function (b) { b.addEventListener("click", function () { tab(b.getAttribute("data-tab")); }); });
  tab({ "#sped": "sped", "#print": "print" }[location.hash] || "ml");

  function sheet(title, inner) { return '<div class="sheet">' + BIM.sheetHead(title) + inner + "</div>"; }
  $("pr-req").addEventListener("click", function () {
    var es = $("pr-es").checked;
    BIM.printHTML(sheet("Request Cards", '<div class="sup-cards">' + REQUEST_CARDS.map(function (c) {
      return '<div class="sup-pc"><b>' + esc(c[0]) + "</b>" + (es ? "<i>" + esc(c[1]) + "</i>" : "") + "</div>";
    }).join("") + "</div>"));
  });
  $("pr-talk").addEventListener("click", function () {
    BIM.printHTML(sheet("Partner Talk Frames", '<div class="sup-cards one">' + TALK_FRAMES.map(function (t) { return '<div class="sup-pc"><b>' + esc(t) + "</b></div>"; }).join("") + "</div>"));
  });
  $("pr-ft").addEventListener("click", function () {
    var f = $("ft-first").value.trim(), t = $("ft-then").value.trim();
    BIM.printHTML(sheet("First / Then", '<div class="sup-ft"><div><span>First</span><p>' + (f ? esc(f) : "") + '</p></div><div><span>Then</span><p>' + (t ? esc(t) : "") + "</p></div></div>"));
  });
  $("pr-break").addEventListener("click", function () {
    var one = '<div class="sup-pc big"><b>I need a break.</b><i>Necesito un descanso.</i><small>Hand this card to your teacher.</small></div>';
    BIM.printHTML(sheet("Break Cards", '<div class="sup-cards">' + one + one + one + one + "</div>"));
  });
  $("pr-vs").addEventListener("click", function () {
    var steps = $("vs-steps").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 12);
    BIM.printHTML(sheet(esc($("vs-title").value.trim() || "My schedule"), '<table class="sup-vs"><tbody>' + steps.map(function (s, i) {
      return '<tr><td class="sup-n">' + (i + 1) + "</td><td>" + esc(s) + '</td><td class="sup-ck"><span></span></td></tr>';
    }).join("") + "</tbody></table>"));
  });
})();
