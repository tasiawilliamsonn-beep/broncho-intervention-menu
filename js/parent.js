/* Parent Contact: builds a phone, voicemail, or email script matched to the behavior. */
(function () {
  var esc = BIM.esc;
  var $ = function (id) { return document.getElementById(id); };
  function v(id) { return ($(id).value || "").trim(); }
  var byId = {}; BEHAVIORS.forEach(function (b) { byId[b.id] = b; });

  $("pc-beh").innerHTML = '<option value="">Choose the behavior...</option>' + [1, 2].map(function (l) {
    return '<optgroup label="Level ' + l + (l === 2 ? " (family contact required)" : "") + '">' + BEHAVIORS.filter(function (b) { return b.level === l && PARENT[b.id]; }).map(function (b) { return '<option value="' + b.id + '">' + esc(b.name) + "</option>"; }).join("") + "</optgroup>";
  }).join("");
  $("hard-list").innerHTML = HARD_CALL.map(function (t) { return "<li>" + esc(t.replace(/\{s\}/g, "your student")) + "</li>"; }).join("");
  $("say-list").innerHTML = SAY_INSTEAD.map(function (r) { return '<tr><td class="say-no">' + esc(r[0]) + '</td><td class="say-yes">' + esc(r[1]) + "</td></tr>"; }).join("");

  function fillInts() {
    var b = byId[$("pc-beh").value], ids = b ? b.ints.filter(function (id) { return PARENT_INT[id]; }) : [];
    var keep = Array.prototype.filter.call(document.querySelectorAll(".pc-int:checked"), function () { return true; }).map(function (c) { return c.value; });
    $("pc-ints").innerHTML = ids.length ? ids.slice(0, 8).map(function (id) {
      return '<label class="opt"><input type="checkbox" class="pc-int" value="' + id + '"' + (keep.indexOf(id) > -1 ? " checked" : "") + "><span>" + esc(INTERVENTIONS[id].name) + "</span></label>";
    }).join("") : '<p class="hint">Choose the behavior to see matched interventions.</p>';
  }
  function homeIds() { var k = $("pc-beh").value; return k && HOME_FOR[k] ? HOME_FOR[k] : Object.keys(HOME); }
  function fillHome() {
    var keep = Array.prototype.map.call(document.querySelectorAll(".pc-hm:checked"), function (c) { return c.value; });
    $("pc-home").innerHTML = $("pc-beh").value ? homeIds().map(function (id) {
      return '<label class="opt"><input type="checkbox" class="pc-hm" value="' + id + '"' + (keep.indexOf(id) > -1 ? " checked" : "") + "><span>" + esc(HOME[id][0]) + ' <span class="hint">(' + HOME[id][2].map(BIM.shortCite).join("; ") + ")</span></span></label>";
    }).join("") : '<p class="hint">Choose the behavior to see matched ideas.</p>';
    var b = byId[$("pc-beh").value];
    $("hm-title").textContent = b ? "Ideas for home: " + b.name : "All ideas for home";
    $("hm-list").innerHTML = homeIds().map(function (id) {
      return '<div class="card"><h3>' + esc(HOME[id][0]) + "</h3><p>" + esc(HOME[id][1].replace(/\{s\}/g, "your student")) + '</p><p class="cite">' + HOME[id][2].map(BIM.shortCite).join("; ") + "</p></div>";
    }).join("");
  }
  function mode() { return document.querySelector('input[name="pc-type"]:checked').value; }
  function showFields() {
    var m = mode();
    document.querySelectorAll("[data-for]").forEach(function (el) { el.hidden = el.getAttribute("data-for").split(" ").indexOf(m) < 0; });
  }

  function script() {
    var m = mode(), s = v("pc-student") || "[student]", par = v("pc-parent"), me = v("pc-me") || "[your name]", subj = v("pc-subject");
    var hello = "Hi" + (par ? " " + par : "") + ", this is " + me + ", " + s + "'s " + (subj ? subj + " " : "") + "teacher at Lafayette Sunnyside Intermediate School.";
    var b = PARENT[$("pc-beh").value], name = byId[$("pc-beh").value];
    var fill = function (t) { return t.replace(/\{s\}/g, s); };
    var ints = Array.prototype.map.call(document.querySelectorAll(".pc-int:checked"), function (c) { return fill(PARENT_INT[c.value]); });
    var strength = v("pc-strength"), example = v("pc-example");
    var steps = [];
    if (m === "concern") {
      steps.push(["Open", hello + " Is now a good time to talk for a few minutes?"]);
      steps.push(["Start with a strength", "First, I want to share something good: " + s + " " + (strength ? strength.replace(/\.$/, "") : "[something " + s + " does well]") + "."]);
      steps.push(["Describe it objectively", "I'm calling because " + s + " " + (b ? b.say + ", " + fill(b.why) : "[describe the behavior]") + ". " + (example ? "For example, " + example.replace(/\.$/, "") + "." : "[Give one specific example of what you saw or heard.]")]);
      steps.push(["Share what you're doing", ints.length ? "Here's what I'm doing in class to help: " + joinAnd(ints) + "." : "[Share the Tier 1 intervention you're using.]"]);
      steps.push(["Ask and listen", (b ? fill(b.ask) + " " : "") + "What has worked at home that I could try in class?"]);
      var hm = Array.prototype.map.call(document.querySelectorAll(".pc-hm:checked"), function (c) { return HOME[c.value]; });
      steps.push(["Offer an idea for home", hm.length ? "Here " + (hm.length > 1 ? "are a few things" : "is one thing") + " that could help at home: " + hm.map(function (x) { return fill(x[1]); }).join(" ") : (b ? "One thing that could help at home: " + fill(b.home) : "[Offer one simple idea for home.]")]);
      steps.push(["Agree on a plan", "Let's try this for the next two weeks. I'll check back with you by [day] to let you know how it's going."]);
      steps.push(["Close", "Thank you for your help. We're on the same team, and I want " + s + " to have a great year."]);
    } else if (m === "good") {
      steps.push(["Open", hello + " Don't worry, I'm calling with good news!"]);
      steps.push(["Share the good news", s + " " + (v("pc-good") || "[what the student did well]") + "."]);
      steps.push(["Connect to HEART", "That's a great example of " + $("pc-heart").value + ", one of our Sunnyside expectations."]);
      steps.push(["Close", "Please celebrate this at home. Thank you for everything you do for " + s + "!"]);
    } else if (m === "followup") {
      steps.push(["Open", hello + " I'm following up on our last conversation."]);
      steps.push(["Share the progress", "Since we talked, " + s + " " + (v("pc-good") || "[describe the improvement]") + "."]);
      steps.push(["Name what's working", ints.length ? "What's been helping: " + joinAnd(ints) + "." : "[Name what has been working.]"]);
      steps.push(["Ask", "Have you noticed any changes at home? Is there anything else I should know?"]);
      steps.push(["Close", "Thank you for your support. I'll keep you posted."]);
    } else if (m === "voicemail") {
      steps.push(["Voicemail", hello + " I'd like to talk with you about how " + s + " is doing in class. Please call me back at " + (v("pc-phone") || "[your number]") + " or reply to my email. Thank you, and have a great day."]);
      steps.push(["Tip", "Keep voicemails short and general. Share details only when you reach the family."]);
    } else {
      var body = "Hello" + (par ? " " + par : "") + ",\n\nThis is " + me + ", " + s + "'s " + (subj ? subj + " " : "") + "teacher at Lafayette Sunnyside Intermediate School. " +
        (strength ? "First, I want to share that " + s + " " + strength.replace(/\.$/, "") + ". " : "") +
        (b ? "I'm reaching out because " + s + " " + b.say + ". " : "") + (ints.length ? "In class, I am " + joinAnd(ints) + ". " : "") +
        (function () { var hm = Array.prototype.map.call(document.querySelectorAll(".pc-hm:checked"), function (c) { return HOME[c.value]; }); return hm.length ? "\n\nIdeas that could help at home:\n" + hm.map(function (x) { return "- " + x[0] + ": " + fill(x[1]); }).join("\n") + "\n\n" : ""; })() +
        "I'd love your ideas on what works at home. Could we talk by phone this week?\n\nThank you,\n" + me;
      steps.push(["Email or message", body]);
    }
    return steps;
  }
  function joinAnd(l) { return l.length < 2 ? l.join("") : l.slice(0, -1).join(", ") + (l.length > 2 ? "," : "") + " and " + l[l.length - 1]; }

  function render() {
    showFields();
    var steps = script();
    $("pc-out").innerHTML = steps.map(function (x, i) {
      return '<div class="pc-step"><span class="pc-n">' + (i + 1) + '</span><div><b>' + esc(x[0]) + "</b><p>" + esc(x[1]).replace(/\n/g, "<br>") + "</p></div></div>";
    }).join("");
    $("pc-copytext").textContent = steps.filter(function (x) { return x[0] !== "Tip"; }).map(function (x) { return x[1]; }).join("\n\n");
    var lvl = byId[$("pc-beh").value] ? byId[$("pc-beh").value].level : 0;
    $("pc-note").innerHTML = lvl === 2 && mode() === "concern" ? '<div class="alert warn"><p><b>Level 2:</b> family contact is required. After the call, log it in PowerSchool as <b>Communication</b>.</p></div>' : "";
  }
  document.querySelectorAll('input[name="pc-type"]').forEach(function (r) { r.addEventListener("change", render); });
  $("pc-beh").addEventListener("change", function () { fillInts(); fillHome(); render(); });
  $("hm-print").addEventListener("click", function () {
    var b = byId[$("pc-beh").value];
    BIM.printHTML('<div class="sheet">' + BIM.sheetHead("Supporting " + (v("pc-student") || "Your Student") + " at Home") +
      "<p>Thank you for partnering with us. Here are a few research-based ideas" + (b ? " that match what we are working on in class" : "") + ". Pick one or two to start.</p>" +
      homeIds().map(function (id) { return '<div class="ct-box"><b>' + esc(HOME[id][0]) + "</b><p>" + esc(HOME[id][1].replace(/\{s\}/g, v("pc-student") || "your student")) + "</p></div>"; }).join("") +
      '<p class="sheet-sign">Questions? Contact ' + esc(v("pc-me") || "your student's teacher") + " at Lafayette Sunnyside Intermediate School.</p>" +
      '<p class="sheet-cite">Sources: ' + uniqRefs().map(function (k) { return esc(BIM.shortCite(k)); }).join("; ") + ".</p></div>");
  });
  function uniqRefs() { var r = []; homeIds().forEach(function (id) { HOME[id][2].forEach(function (k) { if (r.indexOf(k) < 0) r.push(k); }); }); return r; }
  $("pc-form").addEventListener("input", render);
  $("pc-form").addEventListener("change", render);
  $("pc-copy").addEventListener("click", function () { BIM.copy($("pc-copytext").textContent); });
  $("pc-print").addEventListener("click", function () {
    BIM.printHTML('<div class="sheet">' + BIM.sheetHead("Family Contact Script") + $("pc-out").innerHTML.replace(/class="pc-step"/g, 'class="pc-step ct-box"') +
      '<div class="ct-box"><b>Notes from the call</b><p class="rl"></p><p class="rl"></p><p class="rl"></p></div><p class="sheet-sign">Logged in PowerSchool as Communication: <span class="box"></span> Yes &nbsp; Date: ________</p></div>');
  });
  fillInts(); fillHome(); render();
})();
