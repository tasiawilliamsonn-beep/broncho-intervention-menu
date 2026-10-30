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
