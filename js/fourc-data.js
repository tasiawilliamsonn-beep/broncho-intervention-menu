/* The 4 C's of a Tier 1 classroom behavior system: Climate, Communication, Curriculum, Culture.
   Each practice cites research; "next" is the action step; "go" links to the tool that helps. */
var FOURC = [
  { c: "Climate", q: "Is my classroom safe, predictable, and welcoming?",
    see: ["Off-task behavior and wandering", "Calling out or clowning for attention", "Chaotic transitions", "Students shutting down or putting their heads down", "Tone and arguing when corrected"],
    items: [
      { t: "My room is arranged so I can see and reach every student, and traffic flows without crowding.", c: "Simonsen et al., 2008", next: "Walk your room from the back corners. Move desks so you can reach every student in a few steps and see every face from where you teach.", go: ["menu.html", "Active supervision"] },
      { t: "The agenda and schedule are posted, and routines happen the same way every day.", c: "Kern & Clemens, 2007", next: "Post today's agenda with times, point to it at each transition, and preview any change in routine before it happens.", go: ["tools.html#tips", "Teacher Tips"] },
      { t: "I greet students at the door at the start of every class.", c: "Cook et al., 2018", next: "Stand at the door for every class: greet each student by name and give a one-line reminder of the first task.", go: ["tools.html#tips", "Teacher Tips"] },
      { t: "My positive interactions outnumber corrections at least 4 to 1.", c: "Caldarella et al., 2020", next: "Tally your praise and corrections for one class period. If the ratio is low, plan specific praise for your first five minutes.", go: ["tools.html#tips", "Teacher Tips"] },
      { t: "Students know an appropriate way to take a short reset or calm-down break.", c: "Majeika et al., 2011", next: "Teach a break card or calm-down routine when students are calm, and practice it before anyone needs it.", go: ["tools.html#posters", "Calm-Down Steps poster"] },
      { t: "I know every student's name and something they care about.", c: "Allen et al., 2018; Cook et al., 2018", next: "Start a 2x10 with two students you know least: 2 minutes of personal conversation a day for 10 days.", go: ["menu.html", "2x10 relationship building"] }
    ] },
  { c: "Communication", q: "Do students and families clearly understand what I expect and how they're doing?",
    see: ["\"I didn't know\" or not following directions", "Refusal and power struggles", "Arguing back when redirected", "Families surprised by a behavior concern", "Escalation after public corrections"],
    items: [
      { t: "I give directions one step at a time, post multi-step directions, and check for understanding.", c: "Ford et al., 2001; Mancil & Maynard, 2007", next: "Use an attention signal, give one step at a time, post the steps, and have a student repeat them before work starts.", go: ["menu.html", "Clear directions and paraphrase"] },
      { t: "My corrections are calm, brief, and private.", c: "Colvin, 2009", next: "Move close, lower your voice, state the expected behavior once, then step away and praise when the student follows through.", go: ["menu.html", "Calm, brief, neutral response"] },
      { t: "I give behavior-specific praise every day, naming the exact behavior.", c: "Royer et al., 2019", next: "Name the behavior and the HEART value: \"You started right away. That's Effort.\" Aim for at least 3 per period for students who need it most.", go: ["menu.html", "Behavior-specific praise"] },
      { t: "I make positive contact with families before I ever call about a problem.", c: "Kraft & Dougherty, 2013", next: "Send two positive notes or calls home this week, starting with students who struggle most.", go: ["tools.html#incent", "Positive notes home"] },
      { t: "For Level 2 behaviors, I contact families as partners and log it as Communication.", c: "Sunnyside Behavior Intervention Matrix; Sheridan et al., 2012", next: "Open with a strength, describe the behavior objectively, share the intervention you're using, and ask what works at home. Log it as Communication.", go: ["log.html", "PowerSchool Log Builder"] },
      { t: "My log entries are objective and include the intervention I used.", c: "Sunnyside Behavior Intervention Matrix", next: "Check your next three log entries with \"Write my own and strengthen it\" before you submit them.", go: ["log.html#check", "Strengthen a log entry"] }
    ] },
  { c: "Curriculum", q: "Does my instruction prevent problem behavior, and do I teach behavior like content?",
    see: ["Off-task behavior, head down, work not started", "Escape behaviors: bathroom requests, refusing, wandering", "Talking out during long lectures", "Work not turned in", "Misbehavior that starts when work gets hard"],
    items: [
      { t: "Work is at the right level of challenge, and I teach missing skills when a student can't do it.", c: "Burns, VanDerHeyden, & Boice, 2008", next: "When a student avoids work, check whether they can do the first problem. If not, model it, give a worked example, or adjust the starting point.", go: ["menu.html", "Instructional match"] },
      { t: "Every student responds often: whiteboards, choral answers, or turn-and-talk.", c: "MacSuga-Gage & Simonsen, 2015", next: "Replace one hands-up question routine with whiteboards or turn-and-talk so everyone answers.", go: ["menu.html", "Opportunities to respond"] },
      { t: "Class runs bell to bell with no dead time: a bell-ringer, materials ready, brisk pacing.", c: "Gettinger & Ball, 2008", next: "Have a bell-ringer posted before students arrive and plan a short task for the last minutes of class.", go: ["tools.html#tips", "Teacher Tips"] },
      { t: "Students get meaningful choices within assignments.", c: "Jolivette et al., 2001", next: "Offer one choice in each assignment this week: which problems first, which text, or alone or with a partner.", go: ["menu.html", "Choice-making"] },
      { t: "Long tasks are chunked, and students have checklists and a \"when I'm stuck\" routine.", c: "Alter et al., 2008; Rosenshine, 2008", next: "Break your next long assignment into 3 or 4 parts with check-ins, and post the \"When I'm Stuck\" steps.", go: ["tools.html#posters", "When I'm Stuck poster"] },
      { t: "I teach behavior expectations as lessons and re-teach them after breaks and when problems rise.", c: "Fairbanks et al., 2007; Center on PBIS, 2022", next: "Teach one routine this week like a lesson: model it, show a non-example, practice, and give feedback.", go: ["tools.html#check", "Behavior Checklist Maker"] }
    ] },
  { c: "Culture", q: "Do we share HEART, respond consistently, and treat every student fairly?",
    see: ["Put-downs, teasing, and peer conflict", "Students testing limits or saying \"that's not fair\"", "Different responses to the same behavior", "Low belonging or students on the outside", "Repeated office referrals for subjective behaviors"],
    items: [
      { t: "HEART is posted, taught, and referenced every day in my classroom.", c: "Center on PBIS, 2022", next: "Post the Bronchos Have HEART matrix and point to it when you praise and when you correct.", go: ["tools.html#posters", "HEART posters"] },
      { t: "I recognize HEART with Broncho Bucks, always paired with specific praise.", c: "Maggin et al., 2011", next: "Give Broncho Bucks for specific HEART behaviors and say the behavior out loud each time.", go: ["tools.html#incent", "Free Incentives"] },
      { t: "I respond to the same behavior the same way for every student, using the matrix.", c: "McIntosh, Ellwood, McCall, & Girvan, 2018", next: "Before responding, check the matrix level. Use the Intervention Menu so the same behavior gets the same Tier 1 response for every student.", go: ["menu.html", "Intervention Menu"] },
      { t: "I describe behavior objectively instead of using subjective labels like \"defiant\" or \"disrespectful.\"", c: "Smolkowski et al., 2016; Girvan et al., 2017", next: "When you notice a judgment word, replace it with what you saw and heard. Ask a colleague to read your next log entries for objectivity.", go: ["log.html#check", "Strengthen a log entry"] },
      { t: "After a correction, I repair the relationship and hold a re-entry or restorative conversation.", c: "Gregory et al., 2016; Cook et al., 2018", next: "After any significant correction, reconnect the same day: \"We're good. Tomorrow is a fresh start.\" Use the restorative questions.", go: ["menu.html", "Re-entry conference"] },
      { t: "Students have meaningful roles and ways to recognize each other.", c: "Allen et al., 2018; Yeager, Dahl, & Dweck, 2018", next: "Set up class jobs so every student has a role, and start a tootle (peer praise) routine.", go: ["tools.html#jobs", "Class Jobs"] }
    ] }
];
var FOURC_SCALE = [["1", "Not yet"], ["2", "Beginning"], ["3", "Most of the time"], ["4", "Consistently"]];
