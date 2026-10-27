/* Classroom Tools, part 2: tips, posters, visiting pass, class jobs, contracts, incentives. */

(function () {
  var add = {
    allen2018: "Allen, K., Kern, M. L., Vella-Brodrick, D., Hattie, J., & Waters, L. (2018). What schools need to know about fostering school belonging: A meta-analysis. Educational Psychology Review, 30(1), 1-34.",
    bowmanperrott2015: "Bowman-Perrott, L., Burke, M. D., de Marin, S., Zhang, N., & Davis, H. (2015). A meta-analysis of single-case research on behavior contracts: Effects on behavioral and academic outcomes among children and youth. Behavior Modification, 39(2), 247-269.",
    cameron2001: "Cameron, J., Banko, K. M., & Pierce, W. D. (2001). Pervasive negative effects of rewards on intrinsic motivation: The myth continues. The Behavior Analyst, 24(1), 1-44.",
    davis2024: "Davis, J. L., King, H. C., Radley, K. C., Corsi, C. M., Jensen, H. J., & Jenson, W. R. (2024). The Mystery Motivator intervention for challenging behavior: A meta-analysis. Journal of Positive Behavior Interventions. https://doi.org/10.1177/10983007231224048",
    kraft2013: "Kraft, M. A., & Dougherty, S. M. (2013). The effect of teacher-family communication on student engagement: Evidence from a randomized field experiment. Journal of Research on Educational Effectiveness, 6(3), 199-222.",
    maggin2011: "Maggin, D. M., Chafouleas, S. M., Goddard, K. M., & Johnson, A. H. (2011). A systematic evaluation of token economies as a classroom management tool for students with challenging behavior. Journal of School Psychology, 49(5), 529-554.",
    maggin2017: "Maggin, D. M., Pustejovsky, J. E., & Johnson, A. H. (2017). A meta-analysis of school-based group contingency interventions for students with challenging behavior: An update. Remedial and Special Education, 38(6), 353-370.",
    rimmkaufman2014: "Rimm-Kaufman, S. E., Larsen, R. A., Baroody, A. E., Curby, T. W., Ko, M., Thomas, J. B., Merritt, E. G., Abry, T., & DeCoster, J. (2014). Efficacy of the Responsive Classroom approach: Results from a 3-year, longitudinal randomized controlled trial. American Educational Research Journal, 51(3), 567-603.",
    rcbuddy: "Responsive Classroom. (n.d.). Buddy teachers. Center for Responsive Schools. Retrieved from https://www.responsiveclassroom.org/buddy-teachers (practitioner guidance).",
    yeager2018: "Yeager, D. S., Dahl, R. E., & Dweck, C. S. (2018). Why interventions to influence adolescent behavior often fail but could succeed. Perspectives on Psychological Science, 13(1), 101-122.",
    watson2017: "Watson, A., Timperio, A., Brown, H., Best, K., & Hesketh, K. D. (2017). Effect of classroom-based physical activity interventions on academic and physical activity outcomes: A systematic review and meta-analysis. International Journal of Behavioral Nutrition and Physical Activity, 14, 114."
  };
  Object.keys(add).forEach(function (k) { if (!REFS[k]) REFS[k] = add[k]; });
})();

/* ---------- Research-based tips teachers can use tomorrow ---------- */
var TIPS = [
  { group: "Start of class", items: [
    { t: "Greet every student at the door", d: "Stand at the door, greet by name, and add a one-line precorrection: \"Bell-ringer is on the board.\"", c: ["cook2018greet", "allday2007"] },
    { t: "Have the bell-ringer waiting", d: "A short task students start the moment they sit removes the dead time when problems begin.", c: ["gettinger2008", "carnine1976"] },
    { t: "Pre-correct the first routine", d: "Before students enter or start, state the one expectation that matters most right now.", c: ["depry2002"] }] },
  { group: "During instruction", items: [
    { t: "Aim for 3 or more chances to respond per minute", d: "Whiteboards, choral answers, thumbs, and turn-and-talk keep everyone working instead of one hand at a time.", c: ["macsuga2015", "haydon2009"] },
    { t: "Praise 4 times for every correction", d: "Name the behavior: \"Table 2 started right away. That's Effort.\" Tally yourself for one period to check.", c: ["caldarella2020", "royer2019"] },
    { t: "Build in a 2- to 5-minute movement break", d: "Classroom movement breaks increased on-task behavior and reduced off-task behavior in a meta-analysis.", c: ["watson2017"] },
    { t: "Offer a choice inside the task", d: "Which 5 problems, which order, alone or with a partner. Same standard, more buy-in.", c: ["jolivette2001"] },
    { t: "Post the agenda and use a visible timer", d: "When students know what is next and for how long, engagement goes up.", c: ["kern2007"] }] },
  { group: "Transitions", items: [
    { t: "Use one signal, every time", d: "A chime or countdown, then the 3-step routine, then praise the first students ready.", c: ["hirn2012", "mccoy2010"] },
    { t: "Supervise the doorway during passing time", d: "Being visible at the door with a precorrection reduces hallway problems.", c: ["colvin1997"] }] },
  { group: "When behavior happens", items: [
    { t: "Start with the least intrusive response", d: "Look, gesture, proximity, sticky note, then a private one-sentence redirect.", c: ["dhaem2012", "leach2016"] },
    { t: "Stay private, calm, and brief", d: "Lower your voice, restate the expectation once, give space. Don't get pulled into an argument.", c: ["colvin2009"] },
    { t: "Re-teach it like an academic error", d: "\"Let's try that again\": model it, have the student practice, and praise the correct try.", c: ["pbis2022"] },
    { t: "Reconnect the same day", d: "After a correction, repair the relationship: \"We're good. Glad you're here.\"", c: ["cook2018emr"] }] },
  { group: "Relationships and families", items: [
    { t: "2x10 for your hardest-to-reach student", d: "2 minutes of non-academic conversation, 10 school days in a row.", c: ["cook2018emr", "mendler2000"] },
    { t: "Make a positive call home first", d: "In a randomized study, frequent teacher-family contact raised homework completion and reduced the need for redirection.", c: ["kraft2013"] },
    { t: "Let students praise each other", d: "Tootling (peer praise notes) builds kind peer interactions.", c: ["skinner2000"] }] }
];

var DESK_CARD = ["Greet at the door", "Bell-ringer ready", "Pre-correct before routines", "3+ responses per minute", "4 praises : 1 correction",
  "Move and scan the room", "Least intrusive response first", "Private, calm, brief", "Re-teach, don't just punish", "Reconnect the same day"];

/* ---------- Sunnyside Bronchos Have HEART: school-wide expectations matrix ---------- */
var HEART_SETTINGS = ["Classroom", "Hallway", "Cafeteria", "Restroom", "Recess / Gym", "Arrival & Dismissal"];
var HEART_MATRIX = {
  Honesty: ["Do my own work. Tell the truth.", "Go only where my pass says.", "Take only my own food. Report spills.", "Use it for its purpose and return quickly.", "Play by the rules. Admit when I'm out.", "Go straight to where I belong."],
  Effort: ["Start right away. Try again when it's hard.", "Get to class on time.", "Eat, clean up, and be ready to go.", "Wash my hands and get back to learning.", "Join in and give my best.", "Have my materials ready."],
  Attitude: ["Use a positive voice. Accept feedback.", "Greet others. Keep my cool.", "Use kind words and good manners.", "Stay calm and patient.", "Be a good sport, win or lose.", "Start and end the day ready."],
  Respect: ["Listen when others speak. Hands, feet, and objects to myself.", "Walk on the right at voice level 1.", "Voice level 2. Stay seated.", "Give privacy. Keep it clean. Voice level 0-1.", "Take turns. Use equipment safely.", "Follow adult directions the first time."],
  Teamwork: ["Share materials and do my part in groups.", "Keep the line together. Hold the door.", "Help keep our table clean.", "Tell an adult about problems.", "Include others. Solve problems with words.", "Help keep lines and buses safe."]
};
var HEART_WORDS = { Honesty: "I tell the truth and do my own work.", Effort: "I try my best and keep going.", Attitude: "I stay positive and accept feedback.", Respect: "I treat people, places, and things well.", Teamwork: "I help others and do my part." };

/* ---------- Broncho character modeling posters ---------- */
var POSES = [
  { id: "listen", heart: "Respect", t: "Eyes on the speaker", s: ["Eyes on the speaker", "Body still", "Mouth quiet", "Think about what they said"] },
  { id: "raise", heart: "Respect", t: "Raise my hand to speak", s: ["Raise my hand", "Wait to be called on", "Speak in a clear voice"] },
  { id: "space", heart: "Respect", t: "Hands and feet to myself", s: ["Keep my hands and feet to myself", "Keep my own space", "Ask before touching things"] },
  { id: "walk", heart: "Respect", t: "Walk in the hall", s: ["Walk on the right", "Voice level 1", "Eyes forward", "Go straight to my spot"] },
  { id: "effort", heart: "Effort", t: "Try, try again", s: ["Start right away", "Use my \"stuck\" steps", "Mistakes help me learn"] },
  { id: "team", heart: "Teamwork", t: "Help a teammate", s: ["Share materials", "Use kind words", "Include everyone"] },
  { id: "honest", heart: "Honesty", t: "Tell the truth", s: ["Say what really happened", "Own my mistakes", "Fix what I can"] },
  { id: "calm", heart: "Attitude", t: "Calm body, calm mind", s: ["Breathe in for 4", "Breathe out for 4", "Ask for a break if I need one"] }
];

/* ---------- Student reminder posters ---------- */
var REMINDERS = {
  voice: { t: "Voice Levels", rows: [["0", "Silent", "Tests, independent work, hallway when classes are in session"], ["1", "Whisper", "Partner work, hallway"], ["2", "Table talk", "Group work, cafeteria"], ["3", "Presenter", "Sharing with the class"], ["4", "Outside", "Recess and outdoor games only"]], c: "kern2007" },
  stuck: { t: "When I'm Stuck", rows: [["1", "Reread", "Read the directions again, slowly"], ["2", "Look back", "Check the example, my notes, or the anchor chart"], ["3", "Try one thing", "Do the part I can do first"], ["4", "Ask 3 before me", "Ask a classmate quietly"], ["5", "Help signal", "Put up my help card and keep working on another problem"]], c: "rosenshine2008" },
  calm: { t: "Calm-Down Steps", rows: [["1", "Notice", "\"My body feels...\""], ["2", "Breathe", "5 slow breaths: in for 4, out for 4"], ["3", "Think", "\"What do I need right now?\""], ["4", "Choose", "Break card, ask for help, or talk later"], ["5", "Return", "Rejoin and try again"]], c: "cipriano2023" },
  enter: { t: "Entering Our Classroom", rows: [["1", "Walk in", "Greet my teacher"], ["2", "Get ready", "Materials out, backpack away"], ["3", "Start", "Begin the bell-ringer right away"], ["4", "Voice 0", "Work quietly until the timer ends"]], c: "fairbanks2007" },
  help: { t: "How to Ask for Help", rows: [["1", "Try first", "Use my stuck steps"], ["2", "Signal", "Raise my hand or show my help card"], ["3", "Keep going", "Work on something else while I wait"], ["4", "Ask clearly", "\"I need help with...\""]], c: "rosenshine2008" }
};

/* ---------- Class jobs ---------- */
var JOBS = [
  { n: "Welcome Ambassador", i: "\uD83E\uDD1D", d: "Greets classmates at the door and helps new students learn our routines.", s: ["Stand by the door with the teacher at the bell", "Greet classmates by name", "Show any new student the routines and where things are"], g: "belonging" },
  { n: "Materials Manager", i: "\u270F\uFE0F", d: "Gets supplies ready and checks them back in.", s: ["Set out supplies before the activity", "Count them back in at the end", "Tell the teacher when something is running low"], g: "movement" },
  { n: "Distribution Manager", i: "\uD83D\uDCC4", d: "Hands out and collects papers and returned work.", s: ["Pass out papers quickly and quietly", "Collect work facing the same way", "Return graded work to the right folders"], g: "movement" },
  { n: "Agenda & Target Leader", i: "\uD83D\uDCC5", d: "Reads the learning target and agenda to start class.", s: ["Read the date and learning target aloud", "Walk the class through the agenda", "Remind the class of any due dates"], g: "leadership" },
  { n: "Timekeeper", i: "\u23F1\uFE0F", d: "Runs the timer for work time, groups, and transitions.", s: ["Start the timer when the teacher says", "Give a 1-minute warning", "Announce when time is up"], g: "responsibility" },
  { n: "Discussion Leader", i: "\uD83D\uDDE3\uFE0F", d: "Keeps class or group discussions moving and fair.", s: ["Read the discussion question", "Call on classmates who haven't shared yet", "Sum up what the group said"], g: "leadership" },
  { n: "Messenger", i: "\u2709\uFE0F", d: "Delivers notes to the office or other classrooms.", s: ["Take the pass", "Walk straight there and back", "Hand the note to an adult"], g: "movement" },
  { n: "Absent Work Coordinator", i: "\uD83D\uDCE5", d: "Makes sure absent classmates get what they missed.", s: ["Check who is absent", "Put a copy of each handout in their folder", "Write a short note about what we did and what is due"], g: "responsibility" },
  { n: "Recognition Coordinator", i: "\u2764\uFE0F", d: "Collects and shares tootles: notes about classmates showing HEART.", s: ["Hand out tootle slips on Monday", "Collect them in the box", "Read three aloud on Friday and update the class total"], g: "leadership" },
  { n: "Class Goal Tracker", i: "\uD83D\uDCC8", d: "Updates the class goal chart, Good Behavior Game score, or Mystery Motivator.", s: ["Check the goal at the end of class with the teacher", "Update the chart neatly", "Announce how close we are to the goal"], g: "responsibility" },
  { n: "Brain Break Leader", i: "\uD83C\uDFC3", d: "Leads a 2- to 3-minute movement or stretch break.", s: ["Pick a break from the approved list", "Lead it with energy", "Help everyone get back to work when the timer ends"], g: "attention" },
  { n: "Classroom Librarian", i: "\uD83D\uDCDA", d: "Keeps the class library organized and tracks checkouts.", s: ["Return books to the right bins", "Log checkouts and returns", "Report missing or damaged books"], g: "responsibility" },
  { n: "Exit Ticket Collector", i: "\uD83C\uDF9F\uFE0F", d: "Collects exit tickets and sorts them for the teacher.", s: ["Collect exit tickets at the door", "Check that each one has a name", "Put them in the teacher's tray"], g: "responsibility" },
  { n: "Substitute Ambassador", i: "\uD83E\uDDED", d: "Helps a guest teacher find things and follow our routines.", s: ["Introduce yourself to the substitute", "Show the sub plans and seating chart", "Answer questions about our routines"], g: "leadership" },
  { n: "Environment Manager", i: "\u267B\uFE0F", d: "Keeps the room clean, organized, and recycling sorted.", s: ["Check that desks and floors are clear at the end of class", "Empty the recycling bin on Friday with a partner", "Report anything broken"], g: "movement" },
  { n: "Peer Help Desk", i: "\uD83D\uDCA1", d: "Helps classmates who are stuck during work time, without giving answers.", s: ["Wait for a classmate to ask for help", "Ask \"What have you tried?\"", "Give a hint or point to the example, not the answer"], g: "leadership" }
];

/* ---------- Free incentives ---------- */
var INCENTIVES = {
  individual: ["Positive phone call, text, or note home", "Lunch with the teacher (and a friend)", "Choose your seat for the day", "Pick a class job for the week", "Line leader for the day", "Be the class DJ during work time (teacher-approved list)", "Sit at the teacher's desk for a lesson", "5 minutes of choice time", "Use the special pens, markers, or clipboard", "Share a talent or a show-and-tell", "Your name on the HEART shout-out board", "A positive office referral (the principal calls home with good news)", "Pick the class brain break", "First to choose a partner or activity", "Help teach part of a lesson", "No-shoes / comfy-seat pass for a period"],
  group: ["Table points: first table to line up", "Table chooses the brain break", "Table sits anywhere for a period", "Group picks the read-aloud book", "Group earns first choice of materials"],
  whole: ["Mystery Motivator: a hidden reward revealed on a random day", "Good Behavior Game team wins", "Class goal bar or marble jar toward a class reward", "Extra 10 minutes of recess or outdoor lesson", "Music during independent work", "Game or puzzle time on Friday", "An extra chapter of the read-aloud", "3-minute dance party", "Class chooses a theme day (check with an administrator)", "Teacher does a silly challenge the class picks"]
};
var INCENTIVE_RESEARCH = [
  { t: "Token and point systems work", d: "Students earn points or tickets for specific positive behaviors and trade them for rewards. Reviews support token economies for classroom behavior.", c: "maggin2011" },
  { t: "Whole-class goals work", d: "Group contingencies, where the class earns a reward together, are a strongly supported classroom intervention.", c: "maggin2017" },
  { t: "Mystery rewards motivate", d: "A meta-analysis of 24 studies found a strong effect for the Mystery Motivator, where the reward and the day it is given stay a surprise.", c: "davis2024" },
  { t: "Rewards don't kill motivation", d: "Rewards tied to meeting a specific standard do not reduce intrinsic motivation. Pair every reward with specific praise.", c: "cameron2001" },
  { t: "Good news home matters", d: "Frequent, positive teacher-family contact increased homework completion and reduced redirection in a randomized study.", c: "kraft2013" },
  { t: "Let students choose", d: "Let students pick their reward from a menu before a hard task. Choice makes rewards more motivating.", c: "depry2002" }
];

/* ---------- Daily Behavior Report: positively stated replacement behaviors for each struggle ----------
   Rate the replacement behavior you want to see, not the problem behavior (Chafouleas, Riley-Tillman, & Sugai, 2007; Gable et al., 2009). */
var REPLACEMENTS = {
  talking: ["The student raised a hand and waited to be called on before speaking.", "The student kept conversations on topic during partner and group time.", "The student used voice level 0 during independent work."],
  offtask: ["The student started work within 2 minutes of the directions.", "The student stayed on task during independent work.", "The student used the \"When I'm stuck\" steps or help signal instead of stopping."],
  outofarea: ["The student stayed in the assigned seat or area unless given permission.", "The student asked permission or used the break card before leaving the area."],
  tone: ["The student used a calm, respectful voice with adults and classmates.", "The student accepted feedback and directions without arguing."],
  homework: ["The student turned in homework and classwork on time.", "The student came to class with the needed materials.", "The student wrote assignments in the planner."],
  language: ["The student used school-appropriate words.", "The student used calm replacement words when frustrated."],
  unsafe: ["The student used materials and equipment safely and as intended.", "The student kept all four chair legs on the floor."],
  running: ["The student walked in the hallway at voice level 1.", "The student followed the hallway route and stayed with the line."],
  putdowns: ["The student used kind words with classmates.", "The student encouraged or helped a classmate."],
  pda: ["The student kept hands to self and respected others' personal space."],
  hands: ["The student kept hands, feet, and objects to self.", "The student kept personal space in line and at the desk."],
  horseplay: ["The student played safely and followed the game rules.", "The student kept hands to self during unstructured time."],
  intimidation: ["The student solved conflicts with calm words or asked an adult for help.", "The student used kind, non-threatening words and body language."],
  vandalism: ["The student took care of school and classmates' property.", "The student used the break card when frustrated instead of damaging materials."],
  refusal: ["The student followed directions within 1 minute of the first request.", "The student started tasks when asked, or asked for help or a choice."],
  tardy: ["The student arrived to class on time.", "The student went directly to class during passing time."],
  chronic: []
};
