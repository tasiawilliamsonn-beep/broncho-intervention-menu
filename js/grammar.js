/* Spelling and grammar clean-up for teacher-written text. Runs on this computer only (no text is sent
   anywhere). It fixes common, unambiguous errors: misspellings, missing apostrophes, "i" for "I",
   capitals, spacing and punctuation, repeated words, "a"/"an", and a few agreement errors.
   It does not rewrite meaning, so teachers should still read the result. */
var GRAMMAR = (function () {
  var SPELL = {
    recieve: "receive", recieved: "received", acheive: "achieve", beleive: "believe", definately: "definitely", definatly: "definitely", seperate: "separate", seperated: "separated",
    untill: "until", occured: "occurred", occuring: "occurring", alot: "a lot", wich: "which", thier: "their", teh: "the", becuase: "because", beacuse: "because", becasue: "because", bc: "because",
    studnet: "student", stduent: "student", studnets: "students", adn: "and", nad: "and", enviroment: "environment", behavoir: "behavior", behavor: "behavior", behaivor: "behavior", behavoirs: "behaviors",
    disrespectfull: "disrespectful", intervension: "intervention", interventon: "intervention", intevention: "intervention", interventons: "interventions", redirction: "redirection", redirectoin: "redirection",
    apropriate: "appropriate", appropiate: "appropriate", approprite: "appropriate", inapropriate: "inappropriate", innapropriate: "inappropriate", inappropiate: "inappropriate",
    expection: "expectation", expectaion: "expectation", expectatoin: "expectation", expections: "expectations", instrution: "instruction", instuction: "instruction",
    assigment: "assignment", assignmnet: "assignment", asignment: "assignment", assigments: "assignments", refered: "referred", refering: "referring", arguement: "argument", arguements: "arguments",
    embarass: "embarrass", embarassed: "embarrassed", neccessary: "necessary", necesary: "necessary", occassion: "occasion", sucess: "success", truely: "truly", tommorow: "tomorrow", tomorow: "tomorrow",
    wierd: "weird", writting: "writing", peice: "piece", peices: "pieces", freind: "friend", freinds: "friends", dissruptive: "disruptive", disruptve: "disruptive", distruptive: "disruptive",
    continuted: "continued", contiuned: "continued", conintued: "continued", conversaton: "conversation", converstation: "conversation", parnet: "parent", parnets: "parents", gaurdian: "guardian", guardain: "guardian",
    classromm: "classroom", calssroom: "classroom", clasroom: "classroom", acedemic: "academic", accross: "across", agressive: "aggressive", agression: "aggression", begining: "beginning",
    calender: "calendar", comming: "coming", completly: "completely", consistant: "consistent", dicussed: "discussed", discusion: "discussion", explaned: "explained", finaly: "finally",
    goverment: "government", happend: "happened", happenned: "happened", immediatly: "immediately", independant: "independent", interupt: "interrupt", interupted: "interrupted", interupting: "interrupting",
    knowlege: "knowledge", lenght: "length", libary: "library", mispelled: "misspelled", noticable: "noticeable", ocasion: "occasion", oppertunity: "opportunity", posible: "possible",
    prefered: "preferred", recomend: "recommend", responce: "response", responsed: "responded", resposne: "response", schedual: "schedule", sentance: "sentence", similiar: "similar",
    speach: "speech", stoped: "stopped", stoping: "stopping", supose: "suppose", suprise: "surprise", threatend: "threatened", thru: "through", tryed: "tried", unfortunatly: "unfortunately",
    usally: "usually", usualy: "usually", wether: "whether", whith: "with", wiht: "with", wtih: "with", yeild: "yield", yelld: "yelled", yeled: "yelled", reponse: "response", recess: "recess",
    distracted: "distracted", distracing: "distracting", distrating: "distracting", repeatly: "repeatedly", repeatidly: "repeatedly", directoins: "directions", diretions: "directions", direcitons: "directions",
    procedure: "procedure", proceedure: "procedure", assesment: "assessment", assessmnet: "assessment", asessment: "assessment", commnon: "common", partcipate: "participate", particpate: "participate",
    agian: "again", agin: "again", remeber: "remember", rember: "remember", probaly: "probably", realy: "really", allways: "always", alway: "always", befor: "before",
    durring: "during", dureing: "during", whent: "went", lerning: "learning", beggining: "beginning", becomming: "becoming", excercise: "exercise", finshed: "finished", finsihed: "finished",
    finsh: "finish", stared: "stared", starring: "staring", srtarted: "started", strated: "started", contineud: "continued", continuted2: "continued", tryied: "tried", promt: "prompt", promted: "prompted",
    seperatly: "separately", privatly: "privately", privatley: "privately", quitely: "quietly", quite: "quite", throught: "throughout", raelly: "really", teh2: "the",
    refused: "refused", refuesd: "refused", refuse: "refuse", compliance: "compliance", complience: "compliance", comply: "comply", acknowlege: "acknowledge", aknowledge: "acknowledge"
  };
  var CONTRACT = { dont: "don't", didnt: "didn't", doesnt: "doesn't", wouldnt: "wouldn't", couldnt: "couldn't", shouldnt: "shouldn't", isnt: "isn't", wasnt: "wasn't", werent: "weren't",
    arent: "aren't", cant: "can't", wont: "won't", hasnt: "hasn't", havent: "haven't", hadnt: "hadn't", im: "I'm", ive: "I've", theyre: "they're", youre: "you're", thats: "that's", whats: "what's",
    hes: "he's", shes: "she's", lets: "let's" };

  function keepCase(src, rep) { return /^[A-Z]/.test(src) ? rep.charAt(0).toUpperCase() + rep.slice(1) : rep; }

  /* initials typed without periods ("jp", "JP") become the student's initials as entered (e.g., "J.P.") */
  function initials(t, student) {
    var st = String(student || "").trim(), letters = st.replace(/[^A-Za-z]/g, "");
    if (!/^[A-Za-z]\.[A-Za-z]\.?$/.test(st) || letters.length !== 2) return t;
    return t.replace(new RegExp("\\b" + letters + "\\b(?!\\.)", "gi"), st.toUpperCase().replace(/\.?$/, "."));
  }
  function fix(text, student) {
    text = initials(String(text || ""), student);
    var changes = [], t = String(text || "");
    if (!t.trim()) return { text: t, changes: changes };
    function rule(rx, rep, why) {
      t = t.replace(rx, function () {
        var args = arguments, m = args[0];
        var out = typeof rep === "function" ? rep.apply(null, args) : rep.replace(/\$(\d)/g, function (x, n) { return args[+n] == null || typeof args[+n] !== "string" ? "" : args[+n]; });
        if (out !== m) changes.push({ from: m.trim(), to: out.trim(), why: why });
        return out;
      });
    }
    /* leave web and email addresses alone */
    var kept = [];
    t = t.replace(/\S+@\S+\.[a-z]{2,}|\bhttps?:\/\/\S+|\bwww\.\S+|\b(?:[a-z0-9-]+\.){2,}[a-z]{2,}\b/gi, function (m) { kept.push(m); return "\u0001" + (kept.length - 1) + "\u0001"; });
    /* words */
    rule(/\b[A-Za-z]+\b/g, function (w) { var k = w.toLowerCase(); return SPELL[k] && SPELL[k] !== k ? keepCase(w, SPELL[k]) : w; }, "spelling");
    rule(/\b(dont|didnt|doesnt|wouldnt|couldnt|shouldnt|isnt|wasnt|werent|arent|cant|wont|hasnt|havent|hadnt|ive|theyre|youre|thats|whats)\b/gi, function (w) { return keepCase(w, CONTRACT[w.toLowerCase()]); }, "apostrophe");
    rule(/\b(im|Im|IM)\b(?=\s+[a-z])/g, function () { return "I'm"; }, "apostrophe");
    rule(/\b(hes|shes)\b(?=\s+(not|been|going|being|always|still|also|very|really|a|an|the|on|in|at|off|out|upset|angry|working|talking|done|finished)\b)/gi, function (w) { return keepCase(w, CONTRACT[w.toLowerCase()]); }, "apostrophe");
    rule(/(^|[\s"(])i(?=[\s,;:!?'’]|\.(?!e\.)|$)/g, function (m, p) { return p + "I"; }, "capital I");
    rule(/\bi'(m|ve|d|ll)\b/g, function (m, e) { return "I'" + e; }, "capital I");
    rule(/\b(could|should|would|must|might) of\b/gi, function (m, v) { return v + " have"; }, "grammar");
    rule(/\b(he|she|it) (don't|dont)\b/gi, function (m, s) { return s + " doesn't"; }, "agreement");
    rule(/\b(he|she|it) were\b/gi, function (m, s) { return s + " was"; }, "agreement");
    rule(/\b(they|we|you) was\b/gi, function (m, s) { return s + " were"; }, "agreement");
    rule(/\b(he|she|it) have\b(?! to\b)/gi, function (m, s) { return s + " has"; }, "agreement");
    rule(/\b(\w+) \1\b/gi, function (m, w) { return /^(had|that|very|so|bye|no)$/i.test(w) ? m : w; }, "repeated word");
    rule(/\b([Aa]) (?=(a|e|i|o)[a-z])(?!one\b|once\b)/g, function (m, a) { return a + "n "; }, "a/an");
    rule(/\b([Aa])n (?=[bcdfgjklmnpqrstvwxyz][a-z])(?!hour|honest|honor|herb)/g, function (m, a) { return a + " "; }, "a/an");
    /* spacing and punctuation */
    rule(/[ \t]{2,}/g, " ", "spacing");
    rule(/ +([,.;:!?])/g, "$1", "spacing");
    rule(/([,;:])(?=[A-Za-z])/g, "$1 ", "spacing");
    rule(/((?:[a-z]{2,}|[0-9])[.!?])(?=[A-Za-z])/g, "$1 ", "spacing");
    rule(/([!?.]){2,}/g, function (m) { return m.charAt(0) === "." && !/[!?]/.test(m) ? (m.length === 3 ? m : ".") : m.charAt(0); }, "punctuation");
    rule(/,{2,}/g, ",", "punctuation");
    /* capital at the start of each sentence (initials such as J.P. are not sentence ends) */
    t = t.replace(/(^|[.!?]["”']?\s+|\n\s*)([a-z])/g, function (m, p, c, i) {
      if (/\b[A-Z]\.[A-Z]?\.?\s+$/.test(t.slice(0, i + p.length)) || /\b(e\.g|i\.e|etc|vs|approx)\.\s+$/i.test(t.slice(0, i + p.length))) return m;
      changes.push({ from: c, to: c.toUpperCase(), why: "capital letter" }); return p + c.toUpperCase();
    });
    t = t.replace(/\u0001(\d+)\u0001/g, function (m, i) { return kept[+i]; });
    /* end with a period */
    var trimmed = t.replace(/\s+$/, "");
    if (/[A-Za-z0-9)"”]$/.test(trimmed)) { t = trimmed + "."; changes.push({ from: "", to: ".", why: "ending punctuation" }); }
    return { text: t, changes: changes };
  }
  function summary(changes) {
    var seen = {}, out = [];
    changes.forEach(function (c) {
      if (c.why === "capital letter" || c.why === "spacing" || c.why === "ending punctuation") { seen[c.why] = (seen[c.why] || 0) + 1; return; }
      var k = c.from + ">" + c.to; if (seen[k]) return; seen[k] = 1; out.push("“" + c.from + "” → “" + c.to + "”");
    });
    if (seen["capital letter"]) out.push("capital letters (" + seen["capital letter"] + ")");
    if (seen.spacing) out.push("spacing (" + seen.spacing + ")");
    if (seen["ending punctuation"]) out.push("ending punctuation");
    return out;
  }
  return { fix: fix, summary: summary, initials: initials };
})();
