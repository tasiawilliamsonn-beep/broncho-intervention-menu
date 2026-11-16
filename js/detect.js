/* Shared reading rules: which matrix behavior and which Tier 1 interventions a teacher's
   own words describe. Used by the Log Builder (Strengthen my own) and the Parent Contact script builder. */
var DETECT = (function () {
  /* Matrix behaviors: [id or "L3:i"/"L4:i", regex] */
  var BEH = [
    ["L4:1", /\b(weapon|knife|gun|firearm)\b/i],
    ["L4:2", /\b(drugs?|alcohol|vap(e|ing)|marijuana|thc|edible)\b/i],
    ["L4:4", /\b(fight|fighting|punch(ed|ing)?|hit (him|her|them|a student|another student|a classmate)|battery|beat up)\b/i],
    ["L4:5", /\b(hit|kick(ed)?|push(ed)?|shov(ed)?|assault(ed)?) (a |the )?(teacher|adult|staff|sub|substitute)\b/i],
    ["L4:0", /(could not|couldn'?t|unable to) (be )?(locate|find)|left campus|missing from (campus|school)/i],
    ["L3:2", /\b(bull(y|ied|ying)|harass(ed|ing|ment)?)\b/i],
    ["L3:3", /\b(racial|racist|slur|n-word|sexual(ly)?)\b/i],
    ["L3:5", /\b(stole|steal(ing)?|theft)\b/i],
    ["L3:6", /\b(shov(e|ed|ing)|pushed .{0,20}(down|hard|into))\b/i],
    ["L3:1", /\b(cuss(ed)?|swore|cursed) (at|out)\b|aggressive language|(profanity|curse words?) (at|toward|directed)/i],
    ["L3:4", /\b(destroyed|serious (damage|vandalism))\b/i],
    ["L3:7", /\bovert(ly)? defian/i],
    ["tardy", /\b(tardy|late to class|arrived late|skipp(ed|ing) class|truan)/i],
    ["intimidation", /\b(threat(en(ed|ing)?)?|intimidat(e|ed|ing))\b/i],
    ["horseplay", /\b(horseplay|play[- ]?fight(ing)?|wrestl(e|ed|ing)|chas(e|ed|ing))\b/i],
    ["hands", /\b(pok(e|ed|ing)|kick(ed|ing)?|grabb(ed|ing)|touch(ed|ing) (another|a|his|her|their) (student|peer|classmate)|hands on (a|another)|pushed)\b/i],
    ["vandalism", /\b(wr(ote|iting) on (the |a )?(desk|wall|table)|ripp(ed|ing)|tore up|broke (a|the|his|her|their)? ?(pencil|marker|crayon|ruler)|damag(ed|ing)|graffiti|vandal)/i],
    ["refusal", /\b(refus(ed|al|ing)|would not|wouldn'?t|did not follow|didn'?t follow|ignored (the |my )?(direction|request|instruction)|non-?complian)/i],
    ["pda", /\b(kiss(ed|ing)?|hugg(ed|ing)|holding hands|display(s)? of affection|on (his|her|their) lap)\b/i],
    ["putdowns", /\b(teas(e|ed|ing)|name[- ]calling|called (him|her|them) (names|a name|an? [a-z]+ name)|called (a |another )?(classmate|peer|student)( a| an)? [a-z]+|put[- ]?downs?|laughed at|made fun)\b/i],
    ["running", /\b(running|ran) (in|down|through) the hall/i],
    ["unsafe", /\b(tipp(ed|ing)|rock(ed|ing)) (in |on )?(his|her|their|the)? ?chair|\bunsafe|misus(ed|ing)|thr(ew|owing) (a |an |the |his |her )?(pencil|paper|eraser|object|ball)/i],
    ["language", /\b(profan(e|ity)|curs(e|ed|ing)|swear(ing)?|bad words?|inappropriate (language|comments?|words?))\b/i],
    ["homework", /\b(homework|did not turn in|didn'?t turn in|missing (work|assignments?|materials)|no pencil|unprepared|without (his|her|their) materials)\b/i],
    ["tone", /\b(tone|eye[- ]?roll(ed|ing)?|rolled (his|her|their) eyes|sigh(ed|ing)|argu(ed|ing)|talk(ed)? back|raised (his|her|their) voice|yell(ed|ing))\b/i],
    ["outofarea", /\bout of (his |her |their )?(assigned )?(seat|area)|wander(ed|ing)|left (the |his |her |their )?(room|class|group|seat)|walk(ed|ing) around\b/i],
    ["offtask", /\b(off[- ]task|not working|did not (start|begin|complete|finish)|didn'?t (start|begin|complete|finish)|head (down|on (the|his|her|their) desk)|turned away from the (board|lesson|teacher)|doodl(ed|ing)|sleep(ing)?|daydream|distract(ed|ing))/i],
    ["talking", /\b((kept|continued|keeps) (on )?talking|talk(ed|ing) during|talk(ed|ing)? (to|with) (another student|a (peer|friend|classmate|neighbor)|(his|her|their) friends|friends|peers|classmates)|conversations? with|pass(ed|ing)? notes|talk(ed|ing) (out|during|while|to (his|her|their) (neighbor|friend|peer))|call(ed|ing)? out|blurt(ed|ing)?|side conversations?|interrupt(ed|ing)?|making noises|noises)\b/i]
  ];

  var INT = [
    ["redirect", /\b(redirect(ed|ion)?|remind(ed)?|reminder|nonverbal|cue(d)?|sticky note)\b/i],
    ["proximity", /\b(proximity|stood (near|by|next to)|moved (closer|near)|walked over)\b/i],
    ["bsp", /\b(prais(e|ed|ing)|thanked (him|her|them|the student)|positive (feedback|attention)|acknowledg(ed|ing))\b/i],
    ["teach", /\b(re-?taught|re-?teach|modeled|taught (the|him|her|them)|reviewed the expectation|explained the expectation)\b/i],
    ["practice", /\bpractic(e|ed)\b/i],
    ["ask", /asked (him|her|them|the student) (which|what) expectation/i],
    ["precorrect", /\bpre-?correct(ed|ion)?\b/i],
    ["choice", /\b(gave (him|her|them|the student) (a )?choice|offered (a )?choice|choice of|let (him|her|them) choose)\b/i],
    ["seating", /\b(moved (his|her|their|the student'?s)? ?seat|seat change|changed (his|her|their)? ?seat|new seat|strategic seat)/i],
    ["breakcard", /\b(break card|offered a break|gave (him|her|them|the student) a (short )?break|calm[- ]down (break|corner|space|area))\b/i],
    ["chunk", /\b(chunk(ed)?|broke (the |it )?(task|assignment|work)? ?(into|down)|smaller (parts|pieces|steps))\b/i],
    ["match", /\b(checked (for )?understanding|helped (him|her|them|the student) (get )?start|one-on-one help|scaffold(ed)?|modified the)\b/i],
    ["momentum", /\b(behavioral momentum|easy requests|high[- ]p(robability)?)\b/i],
    ["calm", /\b(calm(ly)?|lowered my voice|privately)\b/i],
    ["openq", /\b(asked (him|her|them|the student) what|asked what happened)\b/i],
    ["reentry", /\b(re-?entry|conferenced|private conference|talked (privately|1:1|one-on-one) with)\b/i],
    ["restorative", /\b(restorative|repair (the )?harm|make it right)\b/i],
    ["ifthen", /\b(if\/then|first\/then|if (he|she|they) .{0,40} then)\b/i],
    ["schedattn", /\b(checked (in|back) (with|on)|check-ins?|timer)\b/i],
    ["gbg", /good behavior game/i], ["tootling", /\btootl/i], ["greet", /\bgreet(ed|ing)?\b/i],
    ["relationship", /\b(2x10|two by ten|2-by-10)\b/i], ["selfmonitor", /\bself-?monitor/i], ["goal", /\b(set a goal|goal[- ]setting)\b/i],
    ["dbr", /daily behavior (report|rating)|\bdbr\b/i], ["abc", /\babc (data|chart)/i], ["ignore", /planned ignor|ignored the behavior/i],
    ["replacement", /\b(replacement behavior|taught (him|her|them) to (ask|use|say))\b/i], ["ladder", /\bsupportive response/i]
  ];
  return {
    BEH: BEH, INT: INT,
    behaviors: function (t) { return BEH.filter(function (r) { return r[1].test(t); }).map(function (r) { return r[0]; }); },
    interventions: function (t) { return INT.filter(function (r) { return r[1].test(t); }).map(function (r) { return r[0]; }); }
  };
})();
