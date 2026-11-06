/* Feedback: a button on every page that opens the teacher's email app (Outlook on school computers)
   with a message to the site owner already filled in. The site has no server, so nothing is sent from here. */
(function () {
  var TO = "twilliamson@lsc.k12.in.us";
  var page = (document.querySelector("h1") || {}).textContent || document.title;
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "fb-btn"; btn.textContent = "Send feedback";
  var dlg = document.createElement("dialog");
  dlg.className = "fb-dlg";
  dlg.innerHTML = '<form method="dialog" class="fb-form"><h2>Send feedback</h2>' +
    '<p class="hint">Opens your email (Outlook) with this message to ' + TO + '. Press Send there.</p>' +
    '<label class="f" for="fb-type">Type</label><select id="fb-type"><option>Suggestion</option><option>Something is not working</option><option>Research or content question</option><option>Other</option></select>' +
    '<label class="f" for="fb-msg">Message</label><textarea id="fb-msg" required placeholder="What would make this better?"></textarea>' +
    '<label class="f" for="fb-name">Your name (optional)</label><input type="text" id="fb-name">' +
    '<div class="cta" style="margin-top:12px"><button class="btn" type="button" id="fb-send">Open email</button><button class="btn ghost" value="cancel">Cancel</button></div>' +
    '<p class="hint" style="margin-top:8px">No email app? Copy the address: <b>' + TO + '</b></p></form>';
  document.body.appendChild(btn); document.body.appendChild(dlg);
  btn.addEventListener("click", function () { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
  dlg.querySelector("#fb-send").addEventListener("click", function () {
    var msg = dlg.querySelector("#fb-msg").value.trim();
    if (!msg) { dlg.querySelector("#fb-msg").focus(); return; }
    var name = dlg.querySelector("#fb-name").value.trim(), type = dlg.querySelector("#fb-type").value;
    var subject = "Broncho Intervention Menu feedback: " + type;
    var body = msg + "\n\nPage: " + page.trim() + " (" + location.pathname.split("/").pop() + ")" + (name ? "\nFrom: " + name : "");
    location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    dlg.close ? dlg.close() : dlg.removeAttribute("open");
  });
})();
