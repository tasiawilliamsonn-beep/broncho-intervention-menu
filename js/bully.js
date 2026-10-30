/* Possible bullying: Indiana's definition, why the word stays out of PowerSchool logs until an
   administrator investigates, and objective wording to use instead. Used by the Menu and Log Builder. */
var BULLY = {
  rx: /\b(bull(y|ies|ied|ying)|cyber-?bull\w*)\b/i,
  alts: [
    ["He bullied her.", "He called her \"[exact word]\" three times at lunch this week."],
    ["She is being bullied.", "She told me two students said she can't sit with them and posted comments about her online."],
    ["Bullying in the hallway.", "He pushed a classmate into the lockers twice during passing time."],
    ["Cyberbullying.", "A student showed me a post about a classmate that she said another student shared."],
    ["He's a bully.", "He took a classmate's lunch on Monday and Wednesday after being asked to stop."]
  ],
  phrases: ["I observed...", "The student reported that...", "repeated unwanted comments directed at a classmate", "excluded a classmate from the group and laughed when she asked to join", "took a classmate's belongings without permission"],
  html: function (compact) {
    var esc = BIM.esc;
    return '<div class="alert red bully"><h3>Possible bullying: report it, don\'t label it</h3>' +
      "<p><b>Indiana's definition</b> (IC 20-33-8-0.2, summarized; see the <a href=\"https://www.in.gov/doe/files/bullying-definitions-catagories.pdf\" target=\"_blank\" rel=\"noopener\">Indiana Department of Education guidance</a>): bullying means <b>\"overt, unwanted, repeated acts or gestures\"</b>, verbal, written, digital, or physical, by a student or group of students against another student, <b>\"with the intent to harass, ridicule, humiliate, intimidate, or harm the targeted student\"</b>, that create an <b>\"objectively hostile school environment\"</b> by doing at least one of these:</p>" +
      "<ol><li>placing the student in reasonable fear of harm to their person or property</li><li>substantially harming the student's physical or mental health</li><li>substantially interfering with the student's academic performance</li><li>substantially interfering with the student's ability to participate in or benefit from school activities and services</li></ol>" +
      "<p><b>What to do:</b> tell an administrator right away (Level 3 on the matrix) and follow Sunnyside's bullying reporting procedure. The administrator investigates and decides whether the behavior meets the definition.</p>" +
      "<p><b>In PowerSchool, leave out the words \"bully,\" \"bullied,\" and \"bullying.\"</b> Until an investigation is complete, describe exactly what you saw or were told. Write \"I observed\" for what you saw and \"The student reported\" for what you were told.</p>" +
      (compact ? "" : '<table class="hist say"><thead><tr><th>Instead of</th><th>Write</th></tr></thead><tbody>' +
        BULLY.alts.map(function (r) { return '<tr><td class="say-no">' + esc(r[0]) + '</td><td class="say-yes">' + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table>" +
        '<p class="hint" style="margin-top:8px">Other objective phrases: ' + esc(BULLY.phrases.join("; ")) + ".</p>") +
      "</div>";
  }
};
