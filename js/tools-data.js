/* Classroom Tools content, from the ONC BOCES MTSS Behavior Day 2 handout
   (Wright, Intervention Central, 2018-2019). */

/* Classroom Behavioral Statement Organizer (Packenham, Shute, & Reid, 2004; Moreno & Bullock, 2011) */
var ABC = {
  antecedents: ["Start of class / bell-ringer activities", "Large-group lecture", "Large-group teacher-led discussion", "Large group: when called on by the teacher",
    "Student work-pairs", "Student groups: cooperative learning", "Reading activities", "Writing activities", "Math activities", "Independent seat work",
    "Independent computer work", "Transitions between academic activities", "Unstructured in-class time", "Homework collection", "In-class homework review",
    "Tests and/or quizzes", "Class dismissal"],
  /* f: functions this behavior often points to */
  behaviors: [
    { t: "sits inactive", f: ["escape", "blocker"] }, { t: "puts head on desk", f: ["escape", "blocker"] },
    { t: "is inattentive (e.g., staring into space, looking out the window)", f: ["blocker", "escape"] },
    { t: "leaves seat without permission", f: ["escape", "peer"] }, { t: "requests bathroom or water breaks", f: ["escape"] },
    { t: "uses a cell phone or other digital device against class rules", f: ["tangible"] },
    { t: "whispers/talks/mutters to self", f: ["blocker"] }, { t: "makes loud or distracting noises", f: ["peer", "adult"] },
    { t: "calls out with non-instructional comments", f: ["peer", "adult"] }, { t: "calls out with instructionally relevant comments", f: ["adult"] },
    { t: "plays with/taps objects", f: ["blocker"] }, { t: "throws objects", f: ["peer"] },
    { t: "destroys work or instructional materials (e.g., rips a worksheet, breaks a pencil)", f: ["escape", "blocker"] },
    { t: "whispers/talks to other students about non-instructional topics", f: ["peer"] },
    { t: "whispers/talks to other students to seek answers or help with directions", f: ["skill", "escape"] },
    { t: "makes verbal threats toward peers", f: ["peer"] }, { t: "uses inappropriate language with peers", f: ["peer"] },
    { t: "taunts/teases/makes fun of peers", f: ["peer"] }, { t: "makes comments to encourage or 'egg on' other students to misbehave", f: ["peer"] },
    { t: "fails to begin in-class assignments (verbal refusal)", f: ["escape", "skill"] }, { t: "fails to begin in-class assignments (silent refusal)", f: ["escape", "skill"] },
    { t: "fails to comply with routine teacher requests (verbal refusal)", f: ["adult", "escape"] }, { t: "fails to comply with routine teacher requests (silent refusal)", f: ["escape"] },
    { t: "makes verbal threats toward an adult", f: ["escape", "adult"] }, { t: "uses inappropriate language with an adult", f: ["escape", "adult"] },
    { t: "taunts/teases/makes fun of an adult", f: ["peer", "adult"] }, { t: "seeks academic help from an adult when not needed", f: ["adult"] },
    { t: "perseverates with the previous activity after the class has transitioned", f: ["tangible", "blocker"] }
  ],
  /* w: weight toward each function. Rank-order matters: the most frequent outcome is the likely pay-off. */
  consequences: [
    { t: "fails to complete work", w: { escape: 3 } },
    { t: "receives positive peer attention", w: { peer: 3 } },
    { t: "receives negative peer attention", w: { peer: 2 } },
    { t: "is briefly timed-out within the classroom", w: { escape: 2 } },
    { t: "is briefly timed-out outside of the classroom", w: { escape: 3 } },
    { t: "is sent to the office or in-school suspension (disciplinary referral)", w: { escape: 3, adult: 1 } },
    { t: "receives a disciplinary consequence outside of class time (e.g., detention)", w: {} },
    { t: "is ignored by the teacher (planned ignoring)", w: {} },
    { t: "is redirected by the teacher", w: { adult: 2 } },
    { t: "is reprimanded by the teacher", w: { adult: 2 } },
    { t: "has a conference with the teacher", w: { adult: 2 } },
    { t: "receives a 'respite' break away from peers", w: { escape: 2, blocker: 1 } },
    { t: "is sent to talk with a counselor/psychologist/social worker", w: { escape: 2, adult: 1 } },
    { t: "receives a snack, nap, or other support", w: { blocker: 3 } },
    { t: "gets access to the item or activity they wanted", w: { tangible: 3 } }
  ]
};

/* Tier 1 Class-Wide Management: MTSS-Behavior Intervention Pathways (Wright, 2019).
   i: related interventions in the menu */
var SELFCHECK = [
  { area: "Behavioral Expectations", lead: "Students receive explicit training and guidance in expected classroom behaviors.", items: [
    { t: "Teaching behavioral expectations", d: "Classroom expectations have been explicitly taught, and those behaviors are acknowledged and reinforced on an ongoing basis.", c: "Fairbanks et al., 2007", i: ["teach", "bsp"] },
    { t: "Posting positive classroom rules", d: "3 to 8 rules are posted, stated positively as goal behaviors (HEART), and reviewed frequently.", c: "Simonsen et al., 2008", i: ["teach", "precorrect"] },
    { t: "Training students in basic class routines", d: "Routines are taught for start of class (bell-ringer), homework and classwork, transitions, seatwork and group work, leaving and re-entering the room, and dismissal.", c: "Fairbanks et al., 2007; Marzano et al., 2003", i: ["practice", "transition", "pace"] }] },
  { area: "Instruction That Motivates", lead: "Academic instruction holds student attention and promotes engagement.", items: [
    { t: "Delivering effective instruction", d: "Instructional match (not too easy, not too hard), explicit instruction (modeling, guided practice), a high rate of student responding, and timely feedback.", c: "Burns, VanDerHeyden, & Boice, 2008", i: ["match", "otr", "feedback"] },
    { t: "Maintaining a brisk pace / no dead time", d: "Lessons are organized and move briskly, with no long stretches of dead time during roll, setup, or transitions.", c: "Carnine, 1976; Gettinger & Ball, 2008", i: ["pace"] },
    { t: "Giving clear directions", d: "An alerting cue and group focus before directions; multi-step directions are posted; individual students repeat directions back.", c: "Ford et al., 2001", i: ["directions"] },
    { t: "Offering student choice", d: "Students choose among equivalent assignments, materials, or partners.", c: "Jolivette et al., 2001", i: ["choice"] }] },
  { area: "Group Behavior Management", lead: "The teacher uses active, positive techniques to manage the classroom.", items: [
    { t: "Employing effective verbal commands", d: "Directives are calm, brief, stated as DO, in clear language, one at a time, without sarcasm.", c: "Kern & Clemens, 2007; Matheson & Shriver, 2005", i: ["commands"] },
    { t: "Providing active supervision", d: "The teacher moves through the room, recognizing positive behavior and redirecting off-task students.", c: "De Pry & Sugai, 2002", i: ["supervise", "proximity"] },
    { t: "Using group prompts to hold attention", d: "Brief reminders of expected behavior at the point of performance (e.g., \"10 seconds to think, then I'll call on one student\").", c: "DuPaul & Stoner, 2002", i: ["precorrect", "otr"] }] },
  { area: "Student Relationships", lead: "The teacher promotes a sense of classroom connection and belonging.", items: [
    { t: "Greeting students at the door", d: "Each student is greeted by name at the start of class.", c: "Allday & Pakurar, 2007", i: ["greet"] },
    { t: "Shaping behavior through praise", d: "Behavior-specific praise is given at a planned rate (e.g., at least 3 times per period for a target student).", c: "Kern & Clemens, 2007", i: ["bsp"] },
    { t: "Maintaining a high rate of positive interactions", d: "At least 3 positive interactions for every corrective interaction.", c: "Sprick, Borgmeier, & Nolet, 2002", i: ["ratio", "relationship"] }] },
  { area: "Individual Behavior Management", lead: "The teacher uses flexible, positive techniques for particular students.", items: [
    { t: "Giving pre-corrections", d: "Students are reminded of expectations just before situations where problems usually happen.", c: "De Pry & Sugai, 2002", i: ["precorrect"] },
    { t: "Emphasizing the positive in requests", d: "Requests are framed positively (\"I'll help as soon as you're in your seat\").", c: "Braithwaite, 2001", i: ["positive"] },
    { t: "Asking open-ended questions", d: "Neutral who/what/where/when/how questions (not \"why\") before responding to an upset student.", c: "Lanceley, 1999", i: ["openq"] },
    { t: "Keeping responses calm and brief", d: "Neutral, business-like responses that avoid getting hooked into arguments.", c: "Sprick et al., 2002; Walker & Walker, 1991", i: ["calm"] },
    { t: "Using an array of supportive responses", d: "A ladder: nonverbal reminder, verbal reminder, assistance or task change, safe space to de-escalate.", c: "Leach & Helf, 2016", i: ["ladder", "redirect"] },
    { t: "Matching strategies to student need", d: "Strategies are chosen for the individual student, not one-size-fits-all.", c: "Marzano, Marzano, & Pickering, 2003", i: ["abc"] },
    { t: "Employing negative consequences sparingly", d: "Negative consequences are used only after supportive responses, and after ruling out causes beyond the student's control (e.g., a skill deficit).", c: "Conroy & Sutherland, 2012", i: ["ladder", "match"] },
    { t: "Documenting classroom removals", d: "Every removal is recorded with date, time/duration, and a brief narrative.", c: "Noltemeyer, Ward, & Mcloughlin, 2015", i: [] },
    { t: "Holding re-entry conferences", d: "After a significant incident, the teacher meets privately with the student to find triggers and make a plan.", c: "Fields, 2004", i: ["reentry"] }] }
];

/* RTI Daily Behavior Report items (Chafouleas, Riley-Tillman, & Sugai, 2007; Wright) */
var DBR_ITEMS = [
  "The student got along with classmates and used socially appropriate behaviors.",
  "The student was respectful to the teacher and other adults and complied with their requests in a timely manner.",
  "The student paid attention to teacher instructions and classroom lessons and focused on their work assignments."
];

var CHECKLIST_EXAMPLE = {
  goal: "I am ready to learn at the start of class.",
  steps: ["I have a sharpened pencil.", "I have paper for taking notes.", "I cleared my desk of things I don't need.", "I have my homework ready to turn in.",
    "My phone is put away in my backpack.", "I am sitting quietly.", "I am working on the bell-ringer."]
};
