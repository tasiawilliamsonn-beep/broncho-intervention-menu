/* Parent Contact: family-friendly wording for each matrix behavior and for common interventions. */
(function () {
  var add = {
    kaminski2008: "Kaminski, J. W., Valle, L. A., Filene, J. H., & Boyle, C. L. (2008). A meta-analytic review of components associated with parent training program effectiveness. Journal of Abnormal Child Psychology, 36(4), 567-589.",
    patall2008: "Patall, E. A., Cooper, H., & Robinson, J. C. (2008). Parent involvement in homework: A research synthesis. Review of Educational Research, 78(4), 1039-1101.",
    paruthi2016: "Paruthi, S., Brooks, L. J., D'Ambrosio, C., Hall, W. A., Kotagal, S., Lloyd, R. M., Malow, B. A., Maski, K., Nichols, C., Quan, S. F., Rosen, C. L., Troester, M. M., & Wise, M. S. (2016). Recommended amount of sleep for pediatric populations: A consensus statement of the American Academy of Sleep Medicine. Journal of Clinical Sleep Medicine, 12(6), 785-786.",
    elnokali2010: "El Nokali, N. E., Bachman, H. J., & Votruba-Drzal, E. (2010). Parent involvement and children's academic and social development in elementary school. Child Development, 81(3), 988-1005.",
    kraft2015: "Kraft, M. A., & Rogers, T. (2015). The underutilized potential of teacher-to-parent communication: Evidence from a field experiment. Economics of Education Review, 47, 49-63."
  };
  Object.keys(add).forEach(function (k) { if (!REFS[k]) REFS[k] = add[k]; });
})();

/* say: what is happening (after the student's name); why: why it matters; home: one idea for home; ask: a question for the family */
var PARENT = {
  talking: { say: "has been talking with classmates and calling out during lessons", why: "which makes it harder for {s} and others to follow the lesson", home: "Ask {s} to tell you one thing they learned in class each day.", ask: "Does {s} find it hard to wait to talk at home too?" },
  offtask: { say: "has had a hard time getting started and staying focused on classwork", why: "so some work isn't getting finished", home: "Set a regular homework time and place, and check in after the first 10 minutes.", ask: "What helps {s} focus at home?" },
  outofarea: { say: "has been leaving their seat and walking around during work time", why: "which takes time away from learning", home: "Talk with {s} about asking first, or using a break pass, before leaving their seat.", ask: "Does {s} need movement breaks at home?" },
  tone: { say: "has been using a sharp tone or arguing when given directions", why: "which can turn a small moment into a bigger one", home: "Practice calm ways to disagree, like \"Can I ask a question about that?\"", ask: "What helps {s} calm down when they're upset?" },
  homework: { say: "has been missing homework or coming to class without materials", why: "which affects grades and makes class harder", home: "Check the planner together each night and pack the bag the night before.", ask: "Is anything making homework hard to finish at home?" },
  language: { say: "has used language that isn't appropriate for school", why: "and I want to help {s} find better words when frustrated", home: "Talk about which words fit at school, and what to say instead when upset.", ask: "Has {s} been frustrated about anything lately?" },
  unsafe: { say: "has been using classroom materials or equipment in an unsafe way", why: "and I want everyone to stay safe", home: "Remind {s} that safety rules protect everyone, including them.", ask: "Is there anything I should know that might help?" },
  running: { say: "has been running in the hallway between classes", why: "which could cause someone to get hurt", home: "Remind {s} to walk and go straight to class.", ask: "Is there anything I should know that might help?" },
  putdowns: { say: "has been teasing classmates or making unkind comments", why: "which hurts other students and our classroom community", home: "Talk about how words can hurt, and practice kind ways to joke.", ask: "Has {s} mentioned any problems with friends?" },
  pda: { say: "has been showing affection to another student during class, like hugging or holding hands", why: "which isn't appropriate during the school day", home: "Talk with {s} about what is and isn't appropriate at school.", ask: "Is there anything I should know that might help?" },
  hands: { say: "has been putting hands or objects on other students, like poking or pushing", why: "and every student needs to feel safe", home: "Practice what to do instead when annoyed: move away, use words, or ask an adult.", ask: "Have you seen this at home, or is it new?" },
  horseplay: { say: "has been play fighting with friends", why: "which can lead to someone getting hurt", home: "Remind {s} that play fighting isn't safe at school, even with friends.", ask: "Is there anything I should know that might help?" },
  intimidation: { say: "said something threatening to a classmate", why: "which we take seriously", home: "Talk about solving problems with words or asking an adult for help.", ask: "Has {s} been having trouble with another student?" },
  vandalism: { say: "damaged school or classmates' property", why: "and I want to help {s} handle frustration safely", home: "Talk about taking care of things that belong to others.", ask: "Has {s} seemed frustrated or upset lately?" },
  refusal: { say: "has been refusing to start work or follow directions", why: "so they're missing important learning time", home: "Ask {s} what feels hard about the work right now.", ask: "Have you noticed {s} avoiding hard tasks at home?" },
  tardy: { say: "has been arriving late to class", why: "and missing the start of the lesson", home: "Talk with {s} about going straight to class between periods.", ask: "Is anything making it hard to get to class on time?" }
};

/* plain-language descriptions of interventions for families */
var PARENT_INT = {
  greet: "greeting {s} at the door each day", precorrect: "reminding {s} of the expectation right before the activity", supervise: "checking in more often during work time",
  proximity: "standing nearby during lessons as a quiet reminder", otr: "giving more chances to answer and participate", choice: "giving {s} choices in how to complete the work",
  match: "making sure the work is at the right level and teaching any missing skills", chunk: "breaking assignments into smaller parts", momentum: "starting with a few quick, easy steps to build momentum",
  schedule: "posting the schedule so {s} knows what's coming", seating: "moving {s} to a seat where I can help more quickly", breakcard: "teaching {s} to ask for a short break the right way",
  schedbreak: "giving short planned breaks during long work time", presession: "checking in with {s} before the lesson starts", directions: "giving directions one step at a time",
  transition: "practicing our transition routine", pace: "keeping class moving with no downtime", noalt: "offering an allowed alternative when the answer is no",
  relationship: "taking a few minutes each day to talk with {s} one-on-one", ask: "asking {s} which expectation was missed and what to do instead", teach: "re-teaching and practicing the expectation",
  practice: "practicing the routine together", replacement: "teaching {s} what to do instead", selfmonitor: "having {s} track their own behavior on a checklist",
  goal: "setting a daily goal with {s}", fixup: "teaching {s} what to do when they get stuck", steps: "giving {s} a step-by-step checklist",
  bsp: "praising {s} specifically when they do it right", ratio: "making sure {s} hears much more positive feedback than correction", schedattn: "checking in with {s} on a regular schedule",
  gbg: "using a class team game that rewards good choices", tootling: "having classmates recognize kind behavior", praisepeers: "praising students nearby who are on track",
  feedback: "giving quick feedback on work as {s} goes", homenote: "staying in close contact with you", redirect: "using quiet reminders and redirections",
  ignore: "not giving attention to small attention-seeking behaviors and praising the positive ones", stopstart: "telling {s} clearly what to stop and what to start",
  ifthen: "using clear \"if you do this, then\" statements", positive: "giving directions in a positive way", commands: "giving short, clear directions",
  calm: "responding calmly and privately", openq: "asking {s} what happened before responding", ladder: "using a step-by-step plan of supports",
  reentry: "meeting with {s} privately after a hard moment to make a plan", restorative: "talking with {s} about who was affected and how to make it right",
  abc: "tracking when the behavior happens to understand why", dbr: "rating {s}'s behavior each day to track progress"
};

var SAY_INSTEAD = [
  ["He's disrespectful.", "When I asked him to start, he said \"No\" and put his head down."],
  ["She never listens.", "She followed directions after a second reminder three times today."],
  ["He has a bad attitude.", "He's been frustrated when work gets hard, and I'd like to help with that."],
  ["You need to do something about this.", "What has worked at home that I could try in class?"],
  ["She's always talking.", "She talked with classmates during the lesson four times today."],
  ["If this doesn't stop, there will be consequences.", "Here's what I'm trying, and I'll check back with you next week."]
];
var HARD_CALL = [
  "Stay calm and keep your voice low and steady.",
  "Listen all the way through before you respond.",
  "Name the feeling: \"I can hear how frustrating this is.\"",
  "Return to the shared goal: \"We both want {s} to be successful.\"",
  "Don't debate details. Offer a next step: \"Could we meet with our counselor together?\"",
  "If the call becomes abusive, end it politely and let an administrator know."
];

/* At-home menu: research-based things families can do, matched to the behavior. [title, how (family wording), citation keys] */
var HOME = {
  note: ["Check the daily note", "Look at {s}'s daily note or behavior report each evening. Praise the good parts first, and give a small, agreed-on reward when {s} meets the goal.", ["kelley1990"]],
  praise: ["Notice and name it", "When {s} does the expected behavior at home, say exactly what you liked: \"You started your homework without a reminder. That's effort.\" Give many more positive comments than corrections.", ["kaminski2008"]],
  practice: ["Practice the skill", "Act out the school situation for a few minutes: raising a hand, asking for help, walking away, or disagreeing politely. Practicing works better than only talking about it.", ["kaminski2008"]],
  commands: ["Short, clear directions", "Get {s}'s attention, give one direction at a time, say what to do instead of what to stop, then wait calmly and follow through every time.", ["kaminski2008", "kazdin2013"]],
  routine: ["A set homework routine", "Same time and place each day, materials ready, phone and TV off. Set clear rules, check in after the first 10 minutes, and help with planning instead of doing the work.", ["patall2008"]],
  planner: ["Check the planner together", "Look at the planner or assignment list together each night and pack the bag before bed.", ["patall2008", "kelley1990"]],
  feelings: ["Name feelings and plan a calm-down", "Help {s} name the feeling (\"You seem frustrated\") and pick a calm-down step to use: deep breaths, a short break, a drink of water, then try again.", ["kaminski2008"]],
  sleep: ["Protect sleep", "Children ages 6 to 12 need 9 to 12 hours of sleep. Too little sleep is linked to attention, behavior, and learning problems. Keep a regular bedtime with screens off.", ["paruthi2016"]],
  talk: ["Talk about school every day", "Ask about one good thing and one hard thing from the school day. Family involvement in school is linked to better social skills and fewer behavior problems.", ["elnokali2010"]],
  same: ["Use the same words as school", "Use our HEART words (Honesty, Effort, Attitude, Respect, Teamwork) and the same plan the teacher is using, so {s} hears one consistent message.", ["sheridan2012"]]
};
var HOME_FOR = {
  talking: ["praise", "practice", "note", "same"], offtask: ["routine", "sleep", "note", "praise"], outofarea: ["practice", "sleep", "praise", "note"],
  tone: ["feelings", "practice", "commands", "praise", "same"], homework: ["routine", "planner", "note", "praise", "sleep"], language: ["feelings", "practice", "praise", "same"],
  unsafe: ["practice", "commands", "praise", "same"], running: ["practice", "praise", "same"], putdowns: ["practice", "feelings", "talk", "praise", "same"],
  pda: ["talk", "practice", "same"], hands: ["feelings", "practice", "commands", "praise"], horseplay: ["practice", "praise", "same"],
  intimidation: ["feelings", "talk", "practice", "same"], vandalism: ["feelings", "talk", "practice"], refusal: ["commands", "feelings", "routine", "praise", "note"],
  tardy: ["routine", "sleep", "note", "praise"]
};
