/* Multilingual Learners and students with IEPs / 504 plans: Tier 1 supports layered on the menu. */
(function () {
  var add = {
    baker2014: "Baker, S., Lesaux, N., Jayanthi, M., Dimino, J., Proctor, C. P., Morris, J., Gersten, R., Haymond, K., Kieffer, M. J., Linan-Thompson, S., & Newman-Gonchar, R. (2014). Teaching academic content and literacy to English learners in elementary and middle school (NCEE 2014-4012). National Center for Education Evaluation and Regional Assistance, Institute of Education Sciences, U.S. Department of Education.",
    saenz2005: "Sáenz, L. M., Fuchs, L. S., & Fuchs, D. (2005). Peer-assisted learning strategies for English language learners with learning disabilities. Exceptional Children, 71(3), 231-247.",
    rowe1986: "Rowe, M. B. (1986). Wait time: Slowing down may be a way of speeding up! Journal of Teacher Education, 37(1), 43-50.",
    leverson2021: "Leverson, M., Smith, K., McIntosh, K., Rose, J., & Pinkelman, S. (2021). PBIS cultural responsiveness field guide: Resources for trainers and coaches. Center on PBIS, University of Oregon.",
    dojed2015: "U.S. Department of Justice & U.S. Department of Education. (2015). Dear colleague letter: English learner students and limited English proficient parents. Washington, DC.",
    steinbrenner2020: "Steinbrenner, J. R., Hume, K., Odom, S. L., Morin, K. L., Nowell, S. W., Tomaszewski, B., Szendrey, S., McIntyre, N. S., Yücesoy-Özkan, S., & Savage, M. N. (2020). Evidence-based practices for children, youth, and young adults with autism. The University of North Carolina at Chapel Hill, Frank Porter Graham Child Development Institute, National Clearinghouse on Autism Evidence and Practice Review Team.",
    spriggs2017: "Spriggs, A. D., Mims, P. J., van Dijk, W., & Knight, V. F. (2017). Examination of the evidence base for using visual activity schedules with students with intellectual disability. The Journal of Special Education, 51(1), 14-26.",
    idea300324: "Individuals with Disabilities Education Act regulations, 34 C.F.R. § 300.324(a)(2)(i) (consideration of positive behavioral interventions and supports when behavior impedes learning) and § 300.323(d) (each teacher informed of IEP responsibilities).",
    idea300530: "Individuals with Disabilities Education Act regulations, 34 C.F.R. § 300.530 (discipline procedures, including manifestation determination after removals of more than 10 school days).",
    sec504: "Section 504 of the Rehabilitation Act of 1973, 34 C.F.R. Part 104 (nondiscrimination on the basis of disability in programs receiving federal financial assistance)."
  };
  Object.keys(add).forEach(function (k) { if (!REFS[k]) REFS[k] = add[k]; });
})();

/* [title, how to do it, why / evidence, citation keys] */
var ML_SUPPORTS = [
  ["Check: language or behavior?", "Before you correct, ask: did the student understand the direction? Re-state it with fewer words, a gesture, or a model. Not following a direction a student did not understand is not defiance.", "Behaviors that look like non-compliance can come from language or cultural differences; culturally responsive PBIS asks teachers to check this first.", ["leverson2021"]],
  ["Teach the expectation with visuals", "Show the HEART expectation with a picture or a model and have the student practice it. Post visuals for routines (line up, turn in work, ask for help).", "Visuals and modeling make content and routines comprehensible for English learners.", ["baker2014", "simonsen2008"]],
  ["Sentence frames for asking", "Give request cards with frames like \"May I have a break?\" or \"I don't understand ____.\" Practice them so the student has words to use instead of acting out.", "Structured academic talk with language supports builds oral English and participation.", ["baker2014"]],
  ["Wait time", "After a question or direction, wait at least 3 seconds before repeating or calling on someone else.", "Longer wait time increased the length and quality of student responses.", ["rowe1986"]],
  ["Structured partner talk", "Pair the student with a supportive peer for short, structured turns (Think-Pair-Share, partner reading). Assign roles.", "Peer-assisted learning improved reading comprehension for English learners, including those with learning disabilities.", ["saenz2005", "baker2014"]],
  ["Teach key vocabulary first", "Pre-teach 3 to 5 key words before the lesson with a picture, a student-friendly definition, and a sentence.", "Intensive academic vocabulary instruction across several days is a top recommendation for English learners.", ["baker2014"]],
  ["Family contact in their language", "Use a qualified interpreter or translated message for parent contact. Do not ask the student or a sibling to interpret.", "Schools must communicate essential information to parents in a language they understand and use qualified interpreters.", ["dojed2015"]]
];

var SPED_SUPPORTS = [
  ["Read and follow the plan", "Before choosing an intervention, read the student's IEP or 504 accommodations and any Behavior Intervention Plan (BIP). Implement them as written, every day. Ask the Teacher of Record if anything is unclear.", "Every teacher must be informed of and carry out their IEP responsibilities; 504 plans are also required.", ["idea300324", "sec504"]],
  ["Visual schedule", "Post the day's or period's steps with pictures or words. Have the student check off each step.", "Visual supports and visual activity schedules are evidence-based practices for students with autism and intellectual disability.", ["steinbrenner2020", "spriggs2017"]],
  ["First / Then", "Show what comes first (the task) and then (a preferred activity or break). Keep the first part short and doable.", "Visual supports increase predictability and task completion; predictability reduces problem behavior.", ["steinbrenner2020", "kern2007"]],
  ["Break card", "Teach the student to hand you a break card instead of escaping or shutting down. Honor it quickly at first, then slowly stretch the work time.", "Teaching an appropriate way to ask for a break replaces escape-motivated behavior.", ["kern2007", "steinbrenner2020"]],
  ["Choice-making", "Offer two acceptable choices: which problem first, pencil or marker, where to sit.", "Choice-making reduced problem behavior and increased engagement for students with emotional and behavioral disorders.", ["jolivette2001"]],
  ["Self-monitoring", "Give a simple checklist the student marks each interval (Was I on task? ✓ / ✗). Review it together.", "A systematic review found self-monitoring improves behavior for students with behavior problems, including students with disabilities.", ["bruhn2015"]],
  ["More praise than correction", "Give specific praise often (aim for at least 4 praise statements to 1 correction).", "Behavior-specific praise increased on-task behavior for students with emotional and behavioral disorders.", ["sutherland2000", "simonsen2008"]],
  ["Log it, and tell the Teacher of Record", "If behavior impedes learning, document the Tier 1 interventions and share them with the Teacher of Record. The IEP team must consider positive behavioral supports. Tell an administrator about any removal from class.", "IDEA requires the IEP team to consider positive behavioral interventions when behavior impedes learning, and removals of more than 10 school days trigger additional protections.", ["idea300324", "idea300530"]]
];

/* request cards: English and Spanish */
var REQUEST_CARDS = [
  ["May I have a break, please?", "¿Puedo tomar un descanso, por favor?"],
  ["I need help with ____.", "Necesito ayuda con ____."],
  ["Can you say that again, please?", "¿Puede repetirlo, por favor?"],
  ["I don't understand ____.", "No entiendo ____."],
  ["May I get a drink of water?", "¿Puedo tomar agua?"],
  ["May I go to the restroom?", "¿Puedo ir al baño?"],
  ["I am finished. What do I do next?", "Terminé. ¿Qué hago ahora?"],
  ["I feel upset. I need a minute.", "Me siento molesto/a. Necesito un minuto."]
];
var TALK_FRAMES = [
  "I agree with ____ because ____.",
  "I disagree with ____ because ____.",
  "I think ____ because ____.",
  "Can you explain ____ again?",
  "I would like to add ____.",
  "First ____, then ____, last ____."
];
