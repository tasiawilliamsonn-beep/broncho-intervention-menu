/* Log Builder steps: show one step at a time in "Format it for me". */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var step = 1, max = 3;
  function show(n) {
    step = Math.max(1, Math.min(max, n));
    document.querySelectorAll(".step").forEach(function (s) { s.hidden = +s.getAttribute("data-s") !== step; });
    document.querySelectorAll("[data-step]").forEach(function (b) {
      var k = +b.getAttribute("data-step");
      if (k === step) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.classList.toggle("done", k < step);
    });
    $("step-back").disabled = step === 1;
    $("step-next").textContent = step === max ? "Save to student record" : "Next →";
  }
  document.querySelectorAll("[data-step]").forEach(function (b) { b.addEventListener("click", function () { show(+b.getAttribute("data-step")); }); });
  $("step-back").addEventListener("click", function () { show(step - 1); });
  $("step-next").addEventListener("click", function () {
    if (step === max) { $("save").click(); return; }
    show(step + 1);
    $("form").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  /* a parent-contact-only entry skips the behavior and intervention steps */
  $("purpose").addEventListener("click", function () { setTimeout(function () { if (document.querySelector('[data-p="contact"][aria-pressed="true"]')) show(3); }, 0); });
  $("startover").addEventListener("click", function () { show(1); });
  show(1);
})();

/* Add my own intervention (researched on PBIS World), aligned to the function of the behavior. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  $("own-note").innerHTML = BIM.ownNote();
  $("oi-fn").innerHTML = '<option value="">Choose...</option>' + Object.keys(FUNCTIONS).map(function (f) { return '<option value="' + f + '">' + BIM.esc(FUNCTIONS[f].name) + "</option>"; }).join("");
  $("oi-add").addEventListener("click", function () {
    var v = function (id) { return $(id).value.trim(); };
    var missing = [["oi-name", "the intervention name"], ["oi-did", "what you did"], ["oi-fn", "why the behavior happens"], ["oi-why", "how it matches the behavior"]].filter(function (x) { return !v(x[0]); });
    if (missing.length) { BIM.toast("Add " + missing[0][1] + " first"); $(missing[0][0]).focus(); return; }
    var did = v("oi-did").replace(/^I\s+/i, "").replace(/\.$/, "");
    var id = BIM.addOwn({ name: v("oi-name"), did: did, type: $("oi-type").value, functions: [$("oi-fn").value], why: v("oi-why"), src: v("oi-src") });
    window.BIMAddInt(id);
    ["oi-name", "oi-did", "oi-why"].forEach(function (k) { $(k).value = ""; });
    $("own-int").open = false;
    BIM.toast("Added and checked: " + INTERVENTIONS[id].name);
  });
})();
