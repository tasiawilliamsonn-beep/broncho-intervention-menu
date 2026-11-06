/* Excel Log Workbook: builds a Broncho-themed .xlsx from the logs saved in this browser.
   Everything happens on this computer; nothing is uploaded. Uses ExcelJS (MIT), included in js/vendor. */
(function () {
  var esc = BIM.esc, $ = function (id) { return document.getElementById(id); };
  var RED = "FFC8102E", BLACK = "FF111111", WHITE = "FFFFFFFF", GRAY = "FFF3F1F1", LINE = "FFD9D4D4", PINK = "FFFBE9EC", MUTED = "FFBFBFBF";
  var HEAD = "Oswald", BODY = "Source Sans 3";
  var TYPE_FILL = { INTERVENTION: BLACK, COMMUNICATION: "FF4A4A4A", INFORMATION: "FF8A8A8A", DISCIPLINE: RED };
  var RESPONSES = ["Corrected the behavior right away", "Corrected the behavior after a second prompt", "Partial improvement", "No change", "Behavior escalated"];
  var SETTINGS = ["Start of class / bell-ringer", "Whole-group instruction", "Teacher-led discussion", "Independent work", "Partner work", "Small-group / cooperative work",
    "Computer / device work", "Test or quiz", "Transition between activities", "Hallway", "Cafeteria / lunch", "Recess", "Specials / related arts", "Arrival / dismissal", "Other"];

  function fmt(s) { if (!s) return ""; var p = s.split("-"); return +p[1] + "/" + +p[2] + "/" + p[0]; }
  function xlDate(s) { if (!s) return null; var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function intName(id) { return INTERVENTIONS[id] ? INTERVENTIONS[id].name : id; }
  function tn(t) { return t ? t.charAt(0) + t.slice(1).toLowerCase() : ""; }
  function contact(l) { return !!((l.contact && l.contact.made) || l.type === "COMMUNICATION"); }
  function days(a, b) { return a && b ? Math.round((xlDate(b) - xlDate(a)) / 864e5) : 0; }

  /* ---------- which logs ---------- */
  var logs = BIM.getLogs();
  function chosen() {
    var stu = $("xl-student").value, from = $("xl-from").value, to = $("xl-to").value;
    return logs.filter(function (l) {
      if (stu && BIM.skey(l.student) !== stu) return false;
      if (from && (l.date || "") < from) return false;
      if (to && (l.date || "") > to) return false;
      return true;
    }).sort(function (a, b) { return (a.date || "").localeCompare(b.date || "") || BIM.skey(a.student).localeCompare(BIM.skey(b.student)); });
  }
  function fillStudents() {
    var names = {}; logs.forEach(function (l) { names[BIM.skey(l.student)] = l.student.trim(); });
    $("xl-student").innerHTML = '<option value="">All students</option>' + Object.keys(names).sort().map(function (k) { return '<option value="' + esc(k) + '">' + esc(names[k]) + "</option>"; }).join("");
  }
  function preview() {
    var list = chosen(), stu = {}; list.forEach(function (l) { stu[BIM.skey(l.student)] = 1; });
    var n = Object.keys(stu).length;
    $("xl-count").innerHTML = logs.length
      ? "<b>" + list.length + "</b> log entr" + (list.length === 1 ? "y" : "ies") + " for <b>" + n + "</b> student" + (n === 1 ? "" : "s") + " will be included, plus " + $("xl-blank").value + " blank rows for new entries."
      : "No logs are saved on this computer yet. You can still create a blank workbook to log in Excel.";
  }

  /* ---------- styling helpers ---------- */
  function font(o) { return Object.assign({ name: BODY, size: 11, color: { argb: BLACK } }, o || {}); }
  function fill(c) { return { type: "pattern", pattern: "solid", fgColor: { argb: c } }; }
  var thin = { style: "thin", color: { argb: LINE } };
  var box = { top: thin, left: thin, bottom: thin, right: thin };

  /* banner: logo tile, title, school, details, red stripe; returns the header row number */
  function banner(wb, ws, cols, sub, logoId) {
    var last = String.fromCharCode(64 + cols);
    ws.getRow(1).height = 30; ws.getRow(2).height = 18; ws.getRow(3).height = 18; ws.getRow(4).height = 6;
    for (var r = 1; r <= 3; r++) for (var c = 1; c <= cols; c++) ws.getCell(r, c).fill = fill(BLACK);
    for (var c2 = 1; c2 <= cols; c2++) ws.getCell(4, c2).fill = fill(RED);
    ws.mergeCells("B1:" + last + "1"); ws.mergeCells("B2:" + last + "2"); ws.mergeCells("B3:" + last + "3"); ws.mergeCells("A1:A3");
    var t = ws.getCell("B1"); t.value = "THE BRONCHO INTERVENTION MENU"; t.font = { name: HEAD, size: 20, bold: true, color: { argb: WHITE } }; t.alignment = { vertical: "middle", indent: 1 };
    var s = ws.getCell("B2"); s.value = "Lafayette Sunnyside Intermediate School  ·  " + sub; s.font = font({ size: 11, color: { argb: "FFE6E6E6" } }); s.alignment = { vertical: "middle", indent: 1 };
    var teacher = $("xl-teacher").value.trim();
    var d = ws.getCell("B3"); d.value = (teacher ? "Teacher: " + teacher + "  ·  " : "") + "Created " + fmt(new Date().toISOString().slice(0, 10)) + "  ·  Confidential student information: store on your school OneDrive";
    d.font = font({ size: 9, italic: true, color: { argb: MUTED } }); d.alignment = { vertical: "middle", indent: 1 };
    if (logoId != null) ws.addImage(logoId, { tl: { col: 0.15, row: 0.12 }, ext: { width: 58, height: 58 }, editAs: "absolute" });
    return 5;
  }
  function headerRow(ws, row, labels) {
    var r = ws.getRow(row); r.height = 34;
    labels.forEach(function (h, i) {
      var c = r.getCell(i + 1); c.value = h.toUpperCase();
      c.font = { name: HEAD, size: 11, bold: true, color: { argb: WHITE } }; c.fill = fill(RED);
      c.alignment = { vertical: "middle", horizontal: "left", wrapText: true, indent: 1 }; c.border = { top: thin, left: thin, right: thin, bottom: { style: "medium", color: { argb: BLACK } } };
    });
    ws.views = [{ state: "frozen", ySplit: row, xSplit: 0, showGridLines: false }];
  }
  function bodyCell(c, zebra) { c.font = font(); c.alignment = { vertical: "top", wrapText: true }; c.border = box; if (zebra) c.fill = fill(GRAY); }
  function printSetup(ws, headRow) {
    ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 1, printTitlesRow: "1:" + headRow,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.2, footer: 0.25 } };
    ws.headerFooter = { oddFooter: "&L&8Sunnyside Broncho Intervention Menu&C&8Confidential student information&R&8Page &P of &N" };
  }

  /* ---------- the workbook ---------- */
  function build(list, logoB64) {
    var wb = new ExcelJS.Workbook();
    wb.creator = "The Broncho Intervention Menu"; wb.created = new Date();
    var logoId = logoB64 ? wb.addImage({ base64: logoB64, extension: "png" }) : null;
    var blanks = +$("xl-blank").value;

    /* All Logs */
    var COLS = [["Date", 12], ["Student", 11], ["Period", 10], ["Location", 20], ["Log Type", 15], ["Level", 8], ["Behavior", 22], ["What It Looked Like", 28],
      ["Intervention(s)", 32], ["Student Response", 22], ["Parent Contact", 12], ["Title", 26], ["Log Entry", 70]];
    var ws = wb.addWorksheet("All Logs", { properties: { tabColor: { argb: RED } } });
    COLS.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    var h = banner(wb, ws, COLS.length, "Behavior Log Workbook", logoId);
    headerRow(ws, h, COLS.map(function (c) { return c[0]; }));
    var r = h + 1;
    list.forEach(function (l, i) {
      var row = ws.getRow(r);
      var vals = [xlDate(l.date), l.student, l.period || "", l.setting || "", tn(l.type), l.level || "",
        (l.behaviors || []).map(function (b) { return b.name; }).join("; "), (l.behaviors || []).map(function (b) { return b.look; }).filter(function (x, j, a) { return x && a.indexOf(x) === j; }).join("; "),
        (l.ints || []).map(intName).join("; "), l.response || "", contact(l) ? "Yes" : "No", l.title || "", l.text || ""];
      vals.forEach(function (v, j) { var c = row.getCell(j + 1); c.value = v; bodyCell(c, i % 2 === 1); });
      row.getCell(1).numFmt = "m/d/yyyy";
      var lvl = row.getCell(6); lvl.font = font({ bold: true, size: 12 }); lvl.alignment = { vertical: "top", horizontal: "center" };
      var ty = row.getCell(5); ty.font = font({ bold: true, color: { argb: WHITE } }); ty.fill = fill(TYPE_FILL[l.type] || BLACK);
      if (l.type === "DISCIPLINE") for (var j = 1; j <= COLS.length; j++) if (j !== 5) row.getCell(j).fill = fill(PINK);
      r++;
    });
    /* blank rows with drop-downs, so teachers can keep logging in Excel */
    for (var b = 0; b < blanks; b++) {
      var br = ws.getRow(r + b);
      for (var k = 1; k <= COLS.length; k++) bodyCell(br.getCell(k), (list.length + b) % 2 === 1);
      br.getCell(1).numFmt = "m/d/yyyy";
      br.getCell(1).dataValidation = { type: "date", operator: "greaterThan", formulae: [new Date(Date.UTC(2020, 0, 1))], allowBlank: true, showErrorMessage: true, errorTitle: "Date", error: "Enter a date, for example 11/6/2026." };
      br.getCell(4).dataValidation = { type: "list", allowBlank: true, formulae: ["Lists!$A$2:$A$" + (SETTINGS.length + 1)] };
      br.getCell(5).dataValidation = { type: "list", allowBlank: true, formulae: ['"Intervention,Communication,Information,Discipline"'], showErrorMessage: true, errorTitle: "Log Type", error: "Choose a Log Type from the Sunnyside matrix." };
      br.getCell(6).dataValidation = { type: "list", allowBlank: true, formulae: ['"1,2,3,4"'], showErrorMessage: true, errorTitle: "Level", error: "Choose a matrix level from 1 to 4." };
      br.getCell(7).dataValidation = { type: "list", allowBlank: true, formulae: ["Lists!$B$2:$B$" + (BEHAVIORS.length + 1)] };
      br.getCell(10).dataValidation = { type: "list", allowBlank: true, formulae: ["Lists!$C$2:$C$" + (RESPONSES.length + 1)] };
      br.getCell(11).dataValidation = { type: "list", allowBlank: true, formulae: ['"Yes,No"'] };
      br.getCell(6).alignment = { vertical: "top", horizontal: "center" };
    }
    var lastRow = Math.max(r + blanks - 1, h + 1);
    ws.autoFilter = { from: { row: h, column: 1 }, to: { row: lastRow, column: COLS.length } };
    /* Discipline rows turn red when typed in Excel too */
    ws.addConditionalFormatting({ ref: "E" + (h + 1) + ":E" + lastRow, rules: [
      { type: "containsText", operator: "containsText", text: "Discipline", priority: 1, style: { fill: fill(RED), font: { color: { argb: WHITE }, bold: true } } }] });
    printSetup(ws, h);

    /* Summary by Student */
    if ($("xl-sum").checked) {
      var SC = [["Student", 14], ["Log Entries", 13], ["Intervention Logs", 16], ["Interventions Tried", 17], ["Used 2+ Weeks", 15], ["Parent Contacts", 16], ["First Entry", 13], ["Last Entry", 13], ["Days Logged", 13], ["Tier 1 Timeline", 17]];
      var ss = wb.addWorksheet("Summary by Student", { properties: { tabColor: { argb: BLACK } } });
      SC.forEach(function (c, i) { ss.getColumn(i + 1).width = c[1]; });
      var sh = banner(wb, ss, SC.length, "Summary by Student", logoId);
      headerRow(ss, sh, SC.map(function (c) { return c[0]; }));
      var by = {}; list.forEach(function (l) { (by[BIM.skey(l.student)] = by[BIM.skey(l.student)] || []).push(l); });
      Object.keys(by).sort().forEach(function (k, i) {
        var L = by[k], used = {};
        L.forEach(function (l) { if (!l.date) return; (l.ints || []).forEach(function (id) { var u = used[id] = used[id] || { a: l.date, b: l.date }; if (l.date < u.a) u.a = l.date; if (l.date > u.b) u.b = l.date; }); });
        var ids = Object.keys(used), full = ids.filter(function (id) { return days(used[id].a, used[id].b) >= 14; }).length;
        var ds = L.map(function (l) { return l.date; }).filter(Boolean).sort();
        var met = ids.length >= 3 && full >= 3;
        var vals = [L[0].student, L.length, L.filter(function (l) { return l.ints && l.ints.length; }).length, ids.length, full, L.filter(contact).length,
          xlDate(ds[0]), xlDate(ds[ds.length - 1]), days(ds[0], ds[ds.length - 1]), met ? "Met" : "Not yet"];
        var row = ss.getRow(sh + 1 + i);
        vals.forEach(function (v, j) { var c = row.getCell(j + 1); c.value = v; bodyCell(c, i % 2 === 1); if (j > 0 && j < 6 || j === 8) c.alignment = { vertical: "top", horizontal: "center" }; });
        row.getCell(7).numFmt = row.getCell(8).numFmt = "m/d/yyyy";
        var tl = row.getCell(10); tl.font = font({ bold: true, color: { argb: WHITE } }); tl.fill = fill(met ? "FF1F7A46" : RED); tl.alignment = { vertical: "top", horizontal: "center" };
      });
      var note = ss.getRow(sh + Object.keys(by).length + 2).getCell(1);
      note.value = "Tier 1 timeline: at least 3 different Tier 1 interventions, each used for 2 to 3 weeks (Sunnyside MTSS process). Counts reflect the logs saved when this workbook was created.";
      note.font = font({ size: 9, italic: true, color: { argb: "FF5B5B5B" } }); note.alignment = { wrapText: true, vertical: "top" }; ss.getRow(note.row).height = 30; ss.mergeCells(note.address + ":" + String.fromCharCode(64 + SC.length) + note.row);
      printSetup(ss, sh);
    }

    /* Interventions Tried */
    if ($("xl-ints").checked) {
      var IC = [["Student", 14], ["Intervention", 36], ["Type", 12], ["Times Logged", 13], ["First Used", 13], ["Last Used", 13], ["Days", 9], ["2+ Weeks", 12]];
      var wi = wb.addWorksheet("Interventions Tried", { properties: { tabColor: { argb: RED } } });
      IC.forEach(function (c, i) { wi.getColumn(i + 1).width = c[1]; });
      var ih = banner(wb, wi, IC.length, "Interventions Tried", logoId);
      headerRow(wi, ih, IC.map(function (c) { return c[0]; }));
      var rows = [], seen = {};
      list.forEach(function (l) {
        (l.ints || []).forEach(function (id) {
          var key = BIM.skey(l.student) + "|" + id, u = seen[key];
          if (!u) { u = seen[key] = { s: l.student, id: id, n: 0, a: l.date, b: l.date }; rows.push(u); }
          u.n++; if (l.date && (!u.a || l.date < u.a)) u.a = l.date; if (l.date && (!u.b || l.date > u.b)) u.b = l.date;
        });
      });
      rows.sort(function (x, y) { return BIM.skey(x.s).localeCompare(BIM.skey(y.s)) || (x.a || "").localeCompare(y.a || ""); });
      rows.forEach(function (u, i) {
        var d = days(u.a, u.b), it = INTERVENTIONS[u.id];
        var vals = [u.s, intName(u.id), it ? TYPES[it.type].name : "", u.n, xlDate(u.a), xlDate(u.b), d, d >= 14 ? "Yes" : "No"];
        var row = wi.getRow(ih + 1 + i);
        vals.forEach(function (v, j) { var c = row.getCell(j + 1); c.value = v; bodyCell(c, i % 2 === 1); if (j >= 3) c.alignment = { vertical: "top", horizontal: "center" }; });
        row.getCell(5).numFmt = row.getCell(6).numFmt = "m/d/yyyy";
        var w = row.getCell(8); w.font = font({ bold: true, color: { argb: d >= 14 ? "FF1F7A46" : RED } });
      });
      printSetup(wi, ih);
    }

    /* How to Log: the Sunnyside standards, so the workbook stands on its own */
    if ($("xl-guide").checked) {
      var g = wb.addWorksheet("How to Log", { properties: { tabColor: { argb: BLACK } } });
      g.getColumn(1).width = 26; g.getColumn(2).width = 90;
      var gh = banner(wb, g, 2, "How to Write a Strong Log Entry", logoId);
      var gr = gh;
      function section(title) { var c = g.getRow(gr).getCell(1); g.mergeCells("A" + gr + ":B" + gr); c.value = title.toUpperCase(); c.font = { name: HEAD, size: 12, bold: true, color: { argb: WHITE } }; c.fill = fill(RED); c.alignment = { vertical: "middle", indent: 1 }; g.getRow(gr).height = 22; gr++; }
      function line(a, b, i) { var row = g.getRow(gr); row.getCell(1).value = a; row.getCell(2).value = b; bodyCell(row.getCell(1), i % 2 === 1); bodyCell(row.getCell(2), i % 2 === 1); row.getCell(1).font = font({ bold: true }); gr++; }
      section("A strong entry includes");
      [["Behavior identified", "Matches the Sunnyside Behavior Intervention Matrix, with the expectation that was missed."], ["Specific description", "What the student said or did, where, and how often (20+ words), in order."],
        ["Objective language", "Factual, nonjudgmental wording."], ["Appropriate log type", "Matches the matrix."], ["Intervention documented", "Names the Tier 1 intervention used."],
        ["Student response", "How the student responded to the intervention."], ["Next steps", "Parent contact, follow-up, or additional support when needed."]].forEach(function (x, i) { line(x[0], x[1], i); });
      gr++; section("Log types (Sunnyside matrix)");
      Object.keys(LOG_TYPES).forEach(function (k, i) { line(tn(k), LOG_TYPES[k], i); });
      gr++; section("Matrix levels");
      Object.keys(LEVELS).forEach(function (k, i) { line(LEVELS[k].name, LEVELS[k].who + ". Log as " + LEVELS[k].log + ".", i); });
      gr++; section("Tier 1 timeline");
      [["Weeks 1-3", "Intervention 1: a matched Prevent or Teach strategy, used and logged daily. Contact the family for Level 2."], ["Weeks 4-6", "Intervention 2: keep what works, change what does not."],
        ["Weeks 7-9", "Intervention 3."], ["After 6-9 weeks", "Little or no change after 3 interventions: bring the record to the MTSS team."]].forEach(function (x, i) { line(x[0], x[1], i); });
      gr++; section("Keeping this file safe (FERPA)");
      [["Where to save it", "Your school OneDrive or Teams, not a personal device, USB drive, or personal email."], ["Who sees it", "Only staff who work with the student, such as your administrator, counselor, or MTSS team."],
        ["Students", "Use initials or student ID only."], ["Old copies", "Delete copies you no longer need. PowerSchool remains the official record."]].forEach(function (x, i) { line(x[0], x[1], i); });
      g.pageSetup = { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
      g.headerFooter = { oddFooter: "&L&8Sunnyside Broncho Intervention Menu&R&8Page &P of &N" };
    }

    /* drop-down lists (hidden) */
    var ls = wb.addWorksheet("Lists", { state: "veryHidden" });
    ls.getCell("A1").value = "Locations"; ls.getCell("B1").value = "Behaviors"; ls.getCell("C1").value = "Responses";
    SETTINGS.forEach(function (x, i) { ls.getCell("A" + (i + 2)).value = x; });
    BEHAVIORS.forEach(function (x, i) { ls.getCell("B" + (i + 2)).value = x.name; });
    RESPONSES.forEach(function (x, i) { ls.getCell("C" + (i + 2)).value = x; });
    return wb;
  }

  function logo() {
    return fetch("img/broncho-logo.png").then(function (r) { return r.blob(); }).then(function (b) {
      return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = function () { res(null); }; fr.readAsDataURL(b); });
    }).catch(function () { return null; });
  }
  function create(blank) {
    if (!window.ExcelJS) { BIM.toast("The Excel tool did not load. Refresh the page and try again."); return; }
    var btn = blank ? $("xl-blankbook") : $("xl-make"); btn.disabled = true;
    var list = blank ? [] : chosen();
    logo().then(function (b64) { return build(list, b64).xlsx.writeBuffer(); }).then(function (buf) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      a.download = "Sunnyside-Behavior-Logs-" + (blank ? "Blank-" : "") + new Date().toISOString().slice(0, 10) + ".xlsx";
      document.body.appendChild(a); a.click(); a.remove();
      BIM.toast(blank ? "Blank workbook saved to your downloads" : "Workbook saved to your downloads");
    }).catch(function () { BIM.toast("Something went wrong creating the workbook."); }).then(function () { btn.disabled = false; });
  }

  fillStudents(); preview();
  document.querySelector(".xl-form").addEventListener("input", preview);
  document.querySelector(".xl-form").addEventListener("change", preview);
  $("xl-make").addEventListener("click", function () { create(false); });
  $("xl-blankbook").addEventListener("click", function () { create(true); });
  window.BIMExcel = { build: build, chosen: chosen };
})();
