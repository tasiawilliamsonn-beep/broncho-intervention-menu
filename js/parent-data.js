/* Parent Contact: family-friendly wording for each matrix behavior and for common interventions. */
(function () {
  var add = {
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
