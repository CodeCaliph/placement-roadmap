/* core subject: Software Engineering & Tools — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "se",
  title: "Software Engineering & Tools",
  short: "SE",
  icon: "⚒",
  blurb: "SDLC models, Agile/Scrum, testing theory, and the everyday tooling (Git, Linux shell, CI/CD, Docker) that interviewers use to check whether a fresher can actually work in a team codebase.",
  topics: ["SDLC & Models", "Requirements & Design", "Testing", "Git & Version Control", "Linux & Shell", "Practices & DevOps"],
  questions: [
    /* ---------------- SDLC & Models ---------------- */
    {
      id: "sdlc-phases",
      q: "What is the SDLC? Explain its phases.",
      topic: "SDLC & Models",
      level: 1,
      top: true,
      short: "The Software Development Life Cycle is a structured process for building software: requirements, design, implementation, testing, deployment and maintenance, each producing inputs for the next.",
      a: [
        { p: "The <b>Software Development Life Cycle (SDLC)</b> is a framework that defines the stages a software product goes through from idea to retirement. It gives a team predictable deliverables, checkpoints and responsibilities at every stage." },
        { svg: `<svg viewBox="0 0 560 170" width="560" class="dg">
  <rect class="box-a" x="20" y="20" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="90" y="40" text-anchor="middle" dominant-baseline="middle">1. Requirements</text>
  <rect class="box" x="210" y="20" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="280" y="40" text-anchor="middle" dominant-baseline="middle">2. Design</text>
  <rect class="box" x="400" y="20" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="470" y="40" text-anchor="middle" dominant-baseline="middle">3. Implementation</text>
  <rect class="box-w" x="400" y="110" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="470" y="130" text-anchor="middle" dominant-baseline="middle">4. Testing</text>
  <rect class="box-g" x="210" y="110" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="280" y="130" text-anchor="middle" dominant-baseline="middle">5. Deployment</text>
  <rect class="box-p" x="20" y="110" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="90" y="130" text-anchor="middle" dominant-baseline="middle">6. Maintenance</text>
  <line class="ln-a" x1="160" y1="40" x2="208" y2="40" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="350" y1="40" x2="398" y2="40" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="470" y1="60" x2="470" y2="108" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="400" y1="130" x2="352" y2="130" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="210" y1="130" x2="162" y2="130" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="90" y1="110" x2="90" y2="62" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="96" y="88">feedback / new needs</text>
</svg>`, caption: "Classic SDLC phases; maintenance feeds new requirements back into the cycle" },
        { table: { head: ["Phase", "Key activity", "Typical output"], rows: [
          ["Requirements (and planning)", "Talk to stakeholders, feasibility study, scope, estimates", "SRS document, project plan"],
          ["Design", "High-level architecture (HLD) and module-level design (LLD)", "Architecture diagrams, DB schema, API contracts"],
          ["Implementation", "Write code following the design and coding standards", "Source code, unit tests"],
          ["Testing", "Integration, system and acceptance testing; log and fix defects", "Test reports, bug reports"],
          ["Deployment", "Release to production (often staged: dev → staging → prod)", "Running system, release notes"],
          ["Maintenance", "Bug fixes, patches, enhancements, performance tuning", "New versions, change requests"]
        ] } },
        { tip: "Mention that the phases exist in every model, but <b>models differ in how they order and repeat them</b>: Waterfall runs them once in sequence; Agile runs a mini-SDLC every sprint. That naturally leads into the next question they will ask." },
        { warn: "Maintenance is not a minor phase: it often consumes the majority of total lifetime cost of a system. Saying 'the project ends at deployment' is a red flag." }
      ]
    },
    {
      id: "scrum-roles-ceremonies",
      q: "Explain Scrum: its roles, artifacts and ceremonies.",
      topic: "SDLC & Models",
      level: 1,
      top: true,
      short: "Scrum is an Agile framework with three roles (Product Owner, Scrum Master, Developers), three artifacts (Product Backlog, Sprint Backlog, Increment) and five events (Sprint, Planning, Daily Scrum, Review, Retrospective).",
      a: [
        { p: "<b>Scrum</b> is the most widely used Agile framework. Work happens in fixed-length <b>sprints</b> (usually 2 weeks), each producing a potentially shippable <b>increment</b>." },
        { h: "Roles (accountabilities)" },
        { ul: [
          "<b>Product Owner</b> — owns and prioritises the Product Backlog; represents the customer; decides <i>what</i> to build.",
          "<b>Scrum Master</b> — servant-leader and coach; removes impediments, makes sure Scrum is followed. Not a project manager.",
          "<b>Developers</b> — cross-functional, self-managing team (devs, testers, designers) who decide <i>how</i> to build it."
        ] },
        { h: "Artifacts" },
        { ul: [
          "<b>Product Backlog</b> — ordered list of everything the product might need (user stories, bugs).",
          "<b>Sprint Backlog</b> — items picked for this sprint plus the plan to deliver them.",
          "<b>Increment</b> — the done, usable output that meets the <b>Definition of Done</b>."
        ] },
        { svg: `<svg viewBox="0 0 680 200" width="680" class="dg">
  <rect class="box" x="10" y="30" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="70" y="52" text-anchor="middle" dominant-baseline="middle">Product Backlog</text>
  <rect class="box-p" x="160" y="30" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="220" y="52" text-anchor="middle" dominant-baseline="middle">Sprint Planning</text>
  <rect class="box" x="310" y="30" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="370" y="52" text-anchor="middle" dominant-baseline="middle">Sprint Backlog</text>
  <rect class="box-a" x="460" y="30" width="200" height="44" rx="6"/>
  <text class="tx tx-b" x="560" y="52" text-anchor="middle" dominant-baseline="middle">Sprint (1–4 weeks)</text>
  <path class="ln-a" d="M520,30 C520,0 600,0 600,28" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="560" y="12" text-anchor="middle">Daily Scrum (15 min)</text>
  <rect class="box-g" x="520" y="130" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="590" y="152" text-anchor="middle" dominant-baseline="middle">Increment</text>
  <rect class="box-w" x="340" y="130" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="410" y="152" text-anchor="middle" dominant-baseline="middle">Sprint Review</text>
  <rect class="box-w" x="160" y="130" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="230" y="152" text-anchor="middle" dominant-baseline="middle">Retrospective</text>
  <line class="ln" x1="130" y1="52" x2="158" y2="52" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="52" x2="308" y2="52" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="430" y1="52" x2="458" y2="52" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="590" y1="74" x2="590" y2="128" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="520" y1="152" x2="482" y2="152" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="340" y1="152" x2="302" y2="152" marker-end="url(#dg-arr)"/>
  <path class="ln-a ln-d" d="M160,152 L130,152 L130,100 L200,100 L200,76" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="30" y="120">next sprint</text>
</svg>`, caption: "The Scrum sprint cycle" },
        { table: { head: ["Event", "When / time-box (2-week sprint)", "Purpose"], rows: [
          ["Sprint Planning", "Start of sprint, ≤ 4 h", "Choose the sprint goal and backlog items; break them into tasks"],
          ["Daily Scrum (stand-up)", "Every day, 15 min", "What did I do, what will I do, any blockers?"],
          ["Sprint Review", "End of sprint, ≤ 2 h", "Demo the increment to stakeholders; adapt the Product Backlog"],
          ["Sprint Retrospective", "After review, ≤ 1.5 h", "Improve the <i>process</i>: what went well, what to change"],
          ["Backlog Refinement", "Ongoing (not a formal event)", "Clarify, split and estimate upcoming stories (story points)"]
        ] } },
        { tip: "Know the difference between <b>Review</b> (inspect the product) and <b>Retrospective</b> (inspect the process). Also be ready to explain <b>velocity</b> (story points completed per sprint) and a <b>burndown chart</b> (remaining work vs time)." }
      ]
    },
    {
      id: "kanban",
      q: "What is Kanban and how does it differ from Scrum?",
      topic: "SDLC & Models",
      level: 1,
      top: false,
      short: "Kanban is a flow-based Agile method: work items move across a visual board (To Do → In Progress → Done) with WIP limits, and there are no fixed sprints or prescribed roles, unlike Scrum.",
      a: [
        { p: "<b>Kanban</b> (Japanese for 'signboard', from Toyota's production system) manages work as a continuous <b>flow</b>. Every task is a card on a board whose columns represent workflow stages." },
        { h: "Core practices" },
        { ul: [
          "<b>Visualise the workflow</b> — columns like Backlog | To Do | In Progress | Review | Done.",
          "<b>Limit Work-In-Progress (WIP)</b> — e.g. max 3 cards in 'In Progress'. Forces finishing before starting, exposes bottlenecks.",
          "<b>Pull system</b> — a member pulls the next card only when they have capacity.",
          "<b>Measure flow</b> — lead time (request → done), cycle time (start → done), throughput; cumulative flow diagrams."
        ] },
        { table: { head: ["Aspect", "Scrum", "Kanban"], rows: [
          ["Cadence", "Fixed-length sprints", "Continuous flow"],
          ["Roles", "PO, Scrum Master, Developers", "None prescribed"],
          ["Commitment", "Sprint backlog is fixed during the sprint", "New items can enter any time (respecting WIP)"],
          ["Limits work by", "Sprint capacity", "WIP limit per column"],
          ["Metric", "Velocity, burndown", "Lead/cycle time, throughput"],
          ["Good for", "Product development with planned releases", "Support, ops, maintenance, unpredictable incoming work"]
        ] } },
        { tip: "Mention <b>Scrumban</b> — many real teams run sprints but use a Kanban board with WIP limits. Jira and Trello are common tools." }
      ]
    },
    {
      id: "sdlc-models-compare",
      q: "Compare Waterfall, V-Model, Iterative, Spiral and Agile models.",
      topic: "SDLC & Models",
      level: 2,
      top: true,
      short: "Waterfall is strictly sequential; V-Model pairs each dev phase with a test phase; Iterative builds the product in repeated versions; Spiral adds risk analysis to each loop; Agile delivers small working increments in short time-boxed sprints with continuous customer feedback.",
      a: [
        { p: "All models contain the same activities; they differ in <b>sequencing, feedback, and how they handle changing requirements and risk</b>." },
        { table: { head: ["Model", "How it works", "Best for", "Weakness"], rows: [
          ["<b>Waterfall</b>", "Phases run once, strictly in order; each phase signed off before the next", "Small, well-understood, fixed-requirement projects", "Change is expensive; working software appears only at the end"],
          ["<b>V-Model</b>", "Waterfall + a matching test level for each dev phase (requirements ↔ acceptance, design ↔ system/integration, code ↔ unit)", "Safety-critical systems (medical, automotive) needing strict verification", "Still rigid; no early prototypes"],
          ["<b>Iterative / Incremental</b>", "Build a basic version, then refine/extend it in repeated iterations", "Large systems where core needs are known but details evolve", "Needs good architecture up front; can drift in scope"],
          ["<b>Spiral</b>", "Iterative loops, each with 4 quadrants: objectives → <b>risk analysis</b> & prototyping → develop & test → plan next loop", "Large, expensive, high-risk projects", "Complex and costly; needs risk-assessment expertise"],
          ["<b>Agile</b> (Scrum, Kanban, XP)", "Short time-boxed iterations (1–4 weeks) delivering working increments; customer feedback each cycle", "Products with changing requirements; startups; most modern teams", "Less up-front documentation; needs an engaged customer and disciplined team"]
        ] } },
        { h: "Agile Manifesto (the four values)" },
        { ul: [
          "<b>Individuals and interactions</b> over processes and tools",
          "<b>Working software</b> over comprehensive documentation",
          "<b>Customer collaboration</b> over contract negotiation",
          "<b>Responding to change</b> over following a plan"
        ] },
        { tip: "A great closing line: 'Waterfall is plan-driven, Agile is value-driven; Spiral is risk-driven; V-Model is verification-driven.' If asked which you would pick, justify with requirement stability and risk, not personal taste." },
        { warn: "Agile does not mean 'no documentation' or 'no planning'. It means just enough documentation and planning done continuously instead of all up front." }
      ]
    },

    /* ---------------- Requirements & Design ---------------- */
    {
      id: "srs-functional-nonfunctional",
      q: "What is an SRS? Differentiate functional and non-functional requirements.",
      topic: "Requirements & Design",
      level: 1,
      top: true,
      short: "An SRS (Software Requirements Specification) documents what the system must do. Functional requirements describe behaviour (features); non-functional requirements describe quality attributes like performance, security and availability.",
      a: [
        { p: "A <b>Software Requirements Specification (SRS)</b> is the formal agreement between client and developers about <i>what</i> the system will do (not <i>how</i>). It is the input to design and the baseline for acceptance testing." },
        { h: "Typical SRS contents (IEEE 830 style)" },
        { ol: [
          "Introduction — purpose, scope, definitions, references",
          "Overall description — product perspective, user classes, constraints, assumptions",
          "Specific requirements — functional requirements, external interfaces (UI, APIs, hardware)",
          "Non-functional requirements — performance, security, reliability, usability",
          "Appendices — use-case diagrams, data dictionary"
        ] },
        { p: "Good requirements are <b>correct, unambiguous, complete, consistent, verifiable (testable), and traceable</b>." },
        { table: { head: ["", "Functional", "Non-functional"], rows: [
          ["Describes", "<b>What</b> the system does", "<b>How well</b> the system does it"],
          ["Example", "User can reset password via OTP sent to email", "OTP must arrive within 5 s for 99% of requests"],
          ["Example", "Admin can export monthly sales report as CSV", "System supports 10,000 concurrent users; 99.9% uptime"],
          ["Verified by", "Functional testing (black-box cases)", "Performance, load, security, usability testing"],
          ["If missing", "Feature is absent", "System works but is slow, insecure or unusable"]
        ] } },
        { p: "Common non-functional categories: <b>performance, scalability, availability, reliability, security, usability, maintainability, portability, compliance</b>." },
        { tip: "Show you can turn a vague NFR into a testable one: 'the app should be fast' → 'p95 API latency under 200 ms at 1,000 requests/sec'." },
        { warn: "Non-functional requirements are not optional nice-to-haves. Many system failures (crashes on sale day, data leaks) are NFR failures." }
      ]
    },
    {
      id: "uml-diagrams",
      q: "What are the types of UML diagrams? Draw a simple class diagram.",
      topic: "Requirements & Design",
      level: 2,
      top: false,
      short: "UML diagrams are either structural (class, object, component, deployment, package) or behavioural (use case, sequence, activity, state machine, communication). Class diagrams show classes, attributes, methods and relationships.",
      a: [
        { p: "<b>UML (Unified Modeling Language)</b> is a standard visual notation for designing and documenting software. UML 2.x has 14 diagram types split into two families." },
        { table: { head: ["Structural (static)", "Behavioural (dynamic)"], rows: [
          ["<b>Class</b> — classes, attributes, methods, relationships", "<b>Use case</b> — actors and what they can do with the system"],
          ["Object — snapshot of instances at a moment", "<b>Sequence</b> — messages between objects over time"],
          ["Component — modules and their interfaces", "<b>Activity</b> — workflow, like a flowchart with forks/joins"],
          ["Deployment — software mapped to hardware nodes", "<b>State machine</b> — states of one object and transitions"],
          ["Package — grouping of model elements", "Communication, timing, interaction overview"]
        ] } },
        { svg: `<svg viewBox="0 0 480 230" width="480" class="dg">
  <rect class="box-a" x="160" y="10" width="160" height="80" rx="6"/>
  <text class="tx tx-b" x="240" y="26" text-anchor="middle" dominant-baseline="middle">«abstract» Shape</text>
  <line class="ln" x1="160" y1="40" x2="320" y2="40"/>
  <text class="tx-c tx-s" x="170" y="54">- name : string</text>
  <line class="ln" x1="160" y1="62" x2="320" y2="62"/>
  <text class="tx-c tx-s" x="170" y="78">+ area() : double</text>
  <rect class="box" x="30" y="140" width="160" height="80" rx="6"/>
  <text class="tx tx-b" x="110" y="156" text-anchor="middle" dominant-baseline="middle">Circle</text>
  <line class="ln" x1="30" y1="170" x2="190" y2="170"/>
  <text class="tx-c tx-s" x="40" y="184">- radius : double</text>
  <line class="ln" x1="30" y1="192" x2="190" y2="192"/>
  <text class="tx-c tx-s" x="40" y="208">+ area() : double</text>
  <rect class="box" x="290" y="140" width="160" height="80" rx="6"/>
  <text class="tx tx-b" x="370" y="156" text-anchor="middle" dominant-baseline="middle">Rectangle</text>
  <line class="ln" x1="290" y1="170" x2="450" y2="170"/>
  <text class="tx-c tx-s" x="300" y="184">- w, h : double</text>
  <line class="ln" x1="290" y1="192" x2="450" y2="192"/>
  <text class="tx-c tx-s" x="300" y="208">+ area() : double</text>
  <line class="ln-a" x1="110" y1="140" x2="210" y2="92" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="370" y1="140" x2="270" y2="92" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="240" y="122" text-anchor="middle">inherits (is-a)</text>
</svg>`, caption: "Class diagram: Circle and Rectangle inherit from abstract Shape (UML uses a hollow triangle for generalisation)" },
        { h: "Reading a class box" },
        { ul: [
          "Three compartments: <b>name</b>, <b>attributes</b>, <b>operations</b>.",
          "Visibility: <code>+</code> public, <code>-</code> private, <code>#</code> protected, <code>~</code> package.",
          "Relationships: <b>generalisation</b> (hollow triangle, is-a), <b>association</b> (plain line), <b>aggregation</b> (hollow diamond, has-a, parts can live alone), <b>composition</b> (filled diamond, parts die with whole), <b>dependency</b> (dashed arrow), <b>realisation</b> (dashed line + hollow triangle, implements interface)."
        ] },
        { tip: "The three diagrams asked most in interviews are <b>class, sequence and use case</b>. Be ready to sketch a use-case diagram for an ATM or library system." }
      ]
    },
    {
      id: "cohesion-coupling",
      q: "What are cohesion and coupling? Explain their types.",
      topic: "Requirements & Design",
      level: 2,
      top: true,
      short: "Cohesion measures how closely the responsibilities inside one module belong together; coupling measures how dependent modules are on each other. Good design aims for high cohesion and low coupling.",
      a: [
        { p: "<b>Cohesion</b> = strength of relationship <i>within</i> a module. <b>Coupling</b> = degree of interdependence <i>between</i> modules. The design goal is <b>high cohesion, low coupling</b>: modules that do one thing well and can change independently." },
        { table: { head: ["Cohesion (worst → best)", "Meaning"], rows: [
          ["Coincidental", "Unrelated things grouped arbitrarily (a <code>Utils</code> dumping ground)"],
          ["Logical", "Grouped because they are the same category, chosen by a flag (all I/O ops in one function)"],
          ["Temporal", "Executed at the same time (initialisation routines)"],
          ["Procedural", "Executed in a fixed sequence of steps"],
          ["Communicational", "Operate on the same data"],
          ["Sequential", "Output of one part is input to the next"],
          ["<b>Functional</b> (best)", "Everything contributes to one well-defined task (e.g. <code>computeTax()</code>)"]
        ] } },
        { table: { head: ["Coupling (worst → best)", "Meaning"], rows: [
          ["Content", "One module modifies another's internals directly"],
          ["Common", "Modules share global data"],
          ["External", "Share an externally imposed format/protocol/device"],
          ["Control", "One passes a flag that controls the other's logic"],
          ["Stamp", "Pass a whole data structure when only part is needed"],
          ["<b>Data</b> (best)", "Communicate only through simple parameters"],
          ["No coupling", "Independent (rarely practical)"]
        ] } },
        { code: `// High coupling: OrderService builds a concrete MySQL class itself
class OrderService {
    MySqlDatabase db;              // tied to one implementation
};

// Low coupling: depend on an abstraction, inject it (Dependency Inversion)
class Database {
public:
    virtual void save(const std::string& row) = 0;
    virtual ~Database() = default;
};
class OrderService2 {
    Database& db;                  // any implementation, easy to mock in tests
public:
    explicit OrderService2(Database& d) : db(d) {}
    void place(const std::string& order) { db.save(order); }
};`, lang: "cpp", title: "Reducing coupling with an interface" },
        { tip: "Tie it to SOLID: the <b>Single Responsibility Principle</b> raises cohesion; <b>Dependency Inversion</b> and interfaces lower coupling. Low coupling is also what makes code unit-testable." }
      ]
    },

    /* ---------------- Testing ---------------- */
    {
      id: "verification-vs-validation",
      q: "What is the difference between verification and validation?",
      topic: "Testing",
      level: 1,
      top: true,
      short: "Verification asks 'are we building the product right?' (does it match the spec, checked by reviews/inspections, often without running code); validation asks 'are we building the right product?' (does it meet user needs, checked by executing the software).",
      a: [
        { p: "Both are quality activities, but they check against different things: <b>verification</b> checks work products against their <i>specification</i>; <b>validation</b> checks the final product against the <i>user's actual needs</i>." },
        { table: { head: ["", "Verification", "Validation"], rows: [
          ["Question", "Are we building the product <b>right</b>?", "Are we building the <b>right</b> product?"],
          ["Type", "Static — usually no code execution", "Dynamic — executes the software"],
          ["Methods", "Reviews, walkthroughs, inspections, desk-checks, static analysis", "Unit, integration, system, acceptance testing"],
          ["When", "Throughout, from requirements onward", "After a build exists"],
          ["Done by", "QA team, peers, developers", "Testers, and end users for UAT"],
          ["Finds", "Defects early, when cheap to fix", "Defects in behaviour and gaps vs real needs"]
        ] } },
        { p: "In the <b>V-Model</b>, the left arm (requirements → design → code) is verification-heavy and the right arm (unit → integration → system → acceptance testing) is validation." },
        { tip: "A memorable example: code that perfectly implements a spec for a 12-hour clock passes verification, but if users needed a 24-hour clock, it fails validation." }
      ]
    },
    {
      id: "testing-levels",
      q: "Explain the levels of testing: unit, integration, system and acceptance.",
      topic: "Testing",
      level: 1,
      top: true,
      short: "Unit testing checks individual functions/classes in isolation; integration testing checks modules working together; system testing checks the complete application against requirements; acceptance testing checks whether users/clients accept it for release.",
      a: [
        { p: "Testing is done at increasing scope. The <b>test pyramid</b> says you should have many cheap, fast tests at the bottom and few slow, expensive ones at the top." },
        { svg: `<svg viewBox="0 0 720 240" width="720" class="dg">
  <polygon class="box-w" points="220,10 270,65 170,65"/>
  <polygon class="box-p" points="170,65 270,65 320,120 120,120"/>
  <polygon class="box-a" points="120,120 320,120 370,175 70,175"/>
  <polygon class="box-g" points="70,175 370,175 420,230 20,230"/>
  <text class="tx tx-b" x="220" y="48" text-anchor="middle">UAT</text>
  <text class="tx tx-b" x="220" y="96" text-anchor="middle" dominant-baseline="middle">System</text>
  <text class="tx tx-b" x="220" y="150" text-anchor="middle" dominant-baseline="middle">Integration</text>
  <text class="tx tx-b" x="220" y="205" text-anchor="middle" dominant-baseline="middle">Unit</text>
  <text class="tx" x="440" y="44">Acceptance: does it meet user needs?</text>
  <text class="tx" x="440" y="96">System: whole app, end-to-end</text>
  <text class="tx" x="440" y="150">Integration: modules working together</text>
  <text class="tx" x="440" y="205">Unit: one function / class in isolation</text>
  <text class="tx-m" x="440" y="20">few · slow · costly</text>
  <text class="tx-m" x="440" y="228">many · fast · cheap</text>
</svg>`, caption: "The test pyramid: most tests should be unit tests" },
        { table: { head: ["Level", "Scope", "Who / how", "Example"], rows: [
          ["<b>Unit</b>", "Single function, method or class; dependencies mocked", "Developers; white-box; GoogleTest, JUnit, pytest", "<code>isPrime(7)</code> returns true"],
          ["<b>Integration</b>", "Interfaces between modules / services / DB", "Devs or testers; big-bang, top-down (stubs), bottom-up (drivers)", "Login service correctly reads users from the database"],
          ["<b>System</b>", "Complete integrated application, functional + non-functional", "Independent QA; black-box", "Place an order end-to-end; load test with 5k users"],
          ["<b>Acceptance (UAT)</b>", "Business requirements in real-world scenarios", "Client / end users; alpha (in-house) and beta (real users)", "Bank staff confirm the loan workflow matches their process"]
        ] } },
        { p: "Integration strategies: <b>top-down</b> uses <b>stubs</b> (fake lower modules), <b>bottom-up</b> uses <b>drivers</b> (fake callers), <b>sandwich</b> combines both, <b>big-bang</b> integrates everything at once (hard to localise failures)." },
        { tip: "Interviewers love 'stub vs driver': a stub is called <i>by</i> the module under test; a driver <i>calls</i> the module under test." }
      ]
    },
    {
      id: "blackbox-vs-whitebox",
      q: "What is the difference between black-box and white-box testing?",
      topic: "Testing",
      level: 1,
      top: true,
      short: "Black-box testing checks behaviour through inputs and outputs without looking at the code; white-box testing designs tests from the internal code structure (paths, branches, conditions).",
      a: [
        { table: { head: ["", "Black-box", "White-box"], rows: [
          ["Also called", "Behavioural / functional / closed-box", "Structural / glass-box / clear-box"],
          ["Knowledge of code", "Not needed", "Required"],
          ["Based on", "Requirements and specifications", "Code, control flow, data flow"],
          ["Techniques", "Equivalence partitioning, boundary value analysis, decision tables, state-transition, use-case testing", "Statement / branch / path coverage, basis-path (cyclomatic), loop testing, condition coverage"],
          ["Levels mostly used", "System, acceptance", "Unit, some integration"],
          ["Done by", "Testers, users", "Developers"],
          ["Finds", "Missing features, wrong behaviour, spec mismatches", "Dead code, untested branches, logic errors, hidden paths"]
        ] } },
        { p: "<b>Grey-box testing</b> is in between: the tester has partial knowledge (e.g. DB schema or API design) and uses it to design better black-box tests, common in integration and security testing." },
        { tip: "Neither is sufficient alone: black-box cannot find unreachable/dead code; white-box cannot detect a feature that was never implemented, because there is no code to inspect." }
      ]
    },
    {
      id: "regression-smoke-sanity",
      q: "What are regression, smoke and sanity testing?",
      topic: "Testing",
      level: 1,
      top: true,
      short: "Smoke testing is a quick, broad check that a new build's critical features work at all; sanity testing is a narrow check that a specific fix or change works; regression testing re-runs existing tests to ensure changes did not break previously working features.",
      a: [
        { table: { head: ["", "Smoke", "Sanity", "Regression"], rows: [
          ["Goal", "Is the build stable enough to test?", "Does this specific fix/feature work?", "Did the change break anything old?"],
          ["Coverage", "Wide and shallow", "Narrow and deep", "Wide and deep"],
          ["When", "Every new build, first thing", "After a minor change or bug fix", "After any change, before release"],
          ["Scripted?", "Usually scripted, often automated in CI", "Often unscripted", "Scripted and ideally automated"],
          ["Example", "App launches, login works, home page loads", "Discount bug fixed: 10% coupon now applies correctly", "Rerun the full checkout, payment, cart suites"],
          ["If it fails", "Build rejected immediately", "Build rejected, fix returned to dev", "Defect logged; release blocked"]
        ] } },
        { p: "Smoke testing is sometimes called <b>build verification testing</b>. Sanity is often considered a quick subset of regression focused on the changed area." },
        { tip: "Regression suites grow over time, which is why they are the prime candidates for <b>automation</b> and CI. Mention selecting a subset (risk-based / impacted-area regression) when the full suite is too slow." },
        { warn: "Do not confuse <b>retesting</b> with regression: retesting re-runs the <i>failed</i> test to confirm a fix; regression checks the <i>rest</i> of the system still works." }
      ]
    },
    {
      id: "severity-vs-priority",
      q: "What is the difference between bug severity and priority? Give examples.",
      topic: "Testing",
      level: 1,
      top: true,
      short: "Severity is the technical impact of a defect on the system (set by QA); priority is how urgently it must be fixed based on business needs (set by the product owner/manager). They are independent.",
      a: [
        { table: { head: ["", "Severity", "Priority"], rows: [
          ["Meaning", "How badly the bug affects functionality", "How soon the bug must be fixed"],
          ["Driven by", "Technical impact", "Business impact, deadlines, customer visibility"],
          ["Decided by", "Tester / QA", "Product owner / project manager"],
          ["Levels", "Critical, Major, Minor, Trivial", "P1 (High), P2 (Medium), P3 (Low)"],
          ["Changes?", "Usually fixed for a given bug", "Can change as release plans change"]
        ] } },
        { h: "The four classic combinations" },
        { table: { head: ["Combination", "Example"], rows: [
          ["High severity, high priority", "Payment page crashes on submit in production"],
          ["High severity, low priority", "App crashes when exporting a 10-year report, a feature almost no one uses"],
          ["Low severity, high priority", "Company logo or name misspelled on the home page"],
          ["Low severity, low priority", "Minor alignment issue on the rarely visited 'About' page"]
        ] } },
        { tip: "The 'low severity, high priority' logo example and the 'high severity, low priority' rare-crash example are what the interviewer is fishing for. Have one of each ready." }
      ]
    },
    {
      id: "bug-life-cycle",
      q: "Explain the bug (defect) life cycle.",
      topic: "Testing",
      level: 1,
      top: false,
      short: "A defect moves through states: New → Assigned → Open → Fixed → Retest → Verified → Closed; it may be Reopened if the fix fails, or Rejected/Duplicate/Deferred if it is invalid, already reported or postponed.",
      a: [
        { p: "The <b>defect life cycle</b> is the set of states a bug passes through in a tracker such as Jira or Bugzilla, from discovery to closure." },
        { svg: `<svg viewBox="0 0 660 190" width="660" class="dg">
  <rect class="box-a" x="10" y="20" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="55" y="38" text-anchor="middle" dominant-baseline="middle">New</text>
  <rect class="box" x="120" y="20" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="165" y="38" text-anchor="middle" dominant-baseline="middle">Assigned</text>
  <rect class="box" x="230" y="20" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="275" y="38" text-anchor="middle" dominant-baseline="middle">Open</text>
  <rect class="box" x="340" y="20" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="385" y="38" text-anchor="middle" dominant-baseline="middle">Fixed</text>
  <rect class="box-w" x="450" y="20" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="495" y="38" text-anchor="middle" dominant-baseline="middle">Retest</text>
  <rect class="box-g" x="560" y="20" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="605" y="38" text-anchor="middle" dominant-baseline="middle">Verified</text>
  <rect class="box-g" x="560" y="130" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="605" y="148" text-anchor="middle" dominant-baseline="middle">Closed</text>
  <rect class="box-r" x="420" y="130" width="100" height="36" rx="6"/>
  <text class="tx tx-b" x="470" y="148" text-anchor="middle" dominant-baseline="middle">Reopened</text>
  <rect class="box-p" x="10" y="130" width="170" height="36" rx="6"/>
  <text class="tx tx-b" x="95" y="148" text-anchor="middle" dominant-baseline="middle">Rejected / Duplicate / Deferred</text>
  <line class="ln" x1="100" y1="38" x2="118" y2="38" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="210" y1="38" x2="228" y2="38" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="320" y1="38" x2="338" y2="38" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="430" y1="38" x2="448" y2="38" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="540" y1="38" x2="558" y2="38" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="605" y1="56" x2="605" y2="128" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="495" y1="56" x2="480" y2="128" marker-end="url(#dg-arr)"/>
  <path class="ln ln-d" d="M420,148 L200,148 L200,90 L175,90 L175,58" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="55" y1="56" x2="55" y2="128" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="612" y="96">pass</text>
  <text class="tx-m" x="492" y="96">fail</text>
  <text class="tx-m" x="62" y="96">invalid / dup / later</text>
</svg>`, caption: "Typical defect life cycle" },
        { table: { head: ["State", "Meaning"], rows: [
          ["New", "Tester logs the bug with steps to reproduce, expected vs actual, environment, screenshots"],
          ["Assigned", "Lead assigns it to a developer"],
          ["Open", "Developer is analysing/fixing"],
          ["Fixed", "Code change done; build handed to QA"],
          ["Retest", "Tester re-executes the failed case"],
          ["Verified → Closed", "Fix confirmed; bug closed"],
          ["Reopened", "Bug still reproduces; goes back to the developer"],
          ["Rejected / Duplicate / Deferred / Not a bug", "Invalid, already reported, postponed to a later release, or works as designed"]
        ] } },
        { tip: "A good bug report has: title, steps to reproduce, expected result, actual result, environment/build, severity, priority, and evidence (logs, screenshots). Mention this, it shows practical sense." }
      ]
    },
    {
      id: "tdd-bdd",
      q: "What are TDD and BDD?",
      topic: "Testing",
      level: 2,
      top: false,
      short: "TDD (Test-Driven Development) means writing a failing test before the code, then the minimal code to pass, then refactoring (Red-Green-Refactor). BDD (Behaviour-Driven Development) extends it with human-readable Given-When-Then scenarios agreed with business stakeholders.",
      a: [
        { p: "<b>Test-Driven Development</b> reverses the usual order: tests are written <i>first</i> and drive the design. It works in very short cycles:" },
        { svg: `<svg viewBox="0 0 480 150" width="480" class="dg">
  <rect class="box-r" x="20" y="30" width="120" height="50" rx="6"/>
  <text class="tx tx-b" x="80" y="48" text-anchor="middle" dominant-baseline="middle">RED</text>
  <text class="tx-m" x="80" y="66" text-anchor="middle">write failing test</text>
  <rect class="box-g" x="180" y="30" width="120" height="50" rx="6"/>
  <text class="tx tx-b" x="240" y="48" text-anchor="middle" dominant-baseline="middle">GREEN</text>
  <text class="tx-m" x="240" y="66" text-anchor="middle">minimal code to pass</text>
  <rect class="box-a" x="340" y="30" width="120" height="50" rx="6"/>
  <text class="tx tx-b" x="400" y="48" text-anchor="middle" dominant-baseline="middle">REFACTOR</text>
  <text class="tx-m" x="400" y="66" text-anchor="middle">clean up, tests stay green</text>
  <line class="ln-a" x1="140" y1="55" x2="178" y2="55" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="300" y1="55" x2="338" y2="55" marker-end="url(#dg-arr-a)"/>
  <path class="ln-a" d="M400,80 L400,120 L80,120 L80,82" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="240" y="136" text-anchor="middle">next small behaviour</text>
</svg>`, caption: "TDD cycle: Red → Green → Refactor" },
        { ul: [
          "<b>Benefits:</b> high test coverage by construction, simpler and more modular (testable) design, safe refactoring, living documentation.",
          "<b>Costs:</b> slower initially, learning curve, tests must be maintained, hard for UI or exploratory work."
        ] },
        { p: "<b>Behaviour-Driven Development</b> builds on TDD but focuses on <i>behaviour from the user's point of view</i>. Developers, testers and business (the 'three amigos') write scenarios in the <b>Gherkin</b> language, which tools like Cucumber, SpecFlow or behave turn into automated tests." },
        { code: `Feature: ATM cash withdrawal
  Scenario: Withdraw with sufficient balance
    Given my account balance is 5000
    When I withdraw 2000
    Then I should receive 2000 in cash
    And my balance should be 3000`, lang: "text", title: "BDD scenario in Gherkin" },
        { tip: "One-liner: <b>TDD tests the code is written right; BDD tests the right behaviour is written</b>. TDD tests are in the programming language; BDD scenarios are in plain English." }
      ]
    },
    {
      id: "unit-test-example",
      q: "Write a unit test for a simple function in C++ and in Python.",
      topic: "Testing",
      level: 2,
      top: false,
      short: "A unit test calls one function with known inputs and asserts the expected outputs, covering normal cases, edge cases and invalid input; in C++ use assert or GoogleTest, in Python use the unittest module or pytest.",
      a: [
        { p: "A good unit test is <b>F.I.R.S.T.</b>: <b>F</b>ast, <b>I</b>ndependent, <b>R</b>epeatable, <b>S</b>elf-validating (pass/fail without human inspection), <b>T</b>imely. Structure each test as <b>Arrange → Act → Assert</b>." },
        { code: [
          { lang: "cpp", src: `#include <cassert>
#include <iostream>

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; ++i)
        if (n % i == 0) return false;
    return true;
}

void testSmallNumbers() {
    assert(!isPrime(0));
    assert(!isPrime(1));
    assert(isPrime(2));
    assert(isPrime(3));
}
void testComposites() {
    for (int n : {4, 9, 15, 25, 49})
        assert(!isPrime(n));
}
void testNegative() { assert(!isPrime(-7)); }

int main() {
    testSmallNumbers();
    testComposites();
    testNegative();
    std::cout << "All tests passed\\n";
    return 0;
}` },
          { lang: "python", src: `import unittest

def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

class TestIsPrime(unittest.TestCase):
    def test_small_numbers(self):
        self.assertFalse(is_prime(0))
        self.assertFalse(is_prime(1))
        self.assertTrue(is_prime(2))
        self.assertTrue(is_prime(3))

    def test_composites(self):
        for n in (4, 9, 15, 25, 49):
            with self.subTest(n=n):
                self.assertFalse(is_prime(n))

    def test_negative(self):
        self.assertFalse(is_prime(-7))

if __name__ == "__main__":
    unittest.main()   # run: python test_prime.py -v` }
        ], title: "Testing isPrime: normal, edge and invalid inputs" },
        { code: `#include <gtest/gtest.h>

bool isPrime(int n);   // function under test

TEST(IsPrimeTest, SmallNumbers) {
    EXPECT_FALSE(isPrime(0));
    EXPECT_FALSE(isPrime(1));
    EXPECT_TRUE(isPrime(2));
}

TEST(IsPrimeTest, Composites) {
    EXPECT_FALSE(isPrime(9));
    EXPECT_FALSE(isPrime(25));
}
// link with -lgtest -lgtest_main -pthread`, lang: "cpp", title: "Same test in GoogleTest style" },
        { p: "<code>EXPECT_*</code> records a failure and continues; <code>ASSERT_*</code> aborts the current test. Plain <code>assert</code> is disabled when compiled with <code>-DNDEBUG</code>, so real projects use a framework." },
        { tip: "Always mention which cases you chose and why: boundaries (0, 1, 2), a typical value, a perfect square (to catch an off-by-one in <code>i * i &lt;= n</code>), and invalid input." }
      ]
    },
    {
      id: "mocking",
      q: "What is mocking? How are mocks, stubs and fakes different?",
      topic: "Testing",
      level: 2,
      top: false,
      short: "Mocking replaces a real dependency (database, payment API, clock) with a controllable test double so a unit can be tested in isolation; stubs return canned data, fakes are lightweight working implementations, and mocks also verify how they were called.",
      a: [
        { p: "Unit tests must be fast and deterministic, so they should not hit real networks, databases or clocks. A <b>test double</b> stands in for such a dependency. This only works if the code receives its dependencies from outside (<b>dependency injection</b>)." },
        { table: { head: ["Double", "What it does", "Example"], rows: [
          ["<b>Dummy</b>", "Passed around but never used", "A null logger to satisfy a constructor"],
          ["<b>Stub</b>", "Returns hard-coded answers", "<code>getRate()</code> always returns 82.5"],
          ["<b>Fake</b>", "Working but simplified implementation", "In-memory map instead of a real DB"],
          ["<b>Spy</b>", "Stub that also records calls", "Counts emails 'sent'"],
          ["<b>Mock</b>", "Pre-programmed with expectations; the test verifies interactions", "Assert <code>charge(500)</code> was called exactly once"]
        ] } },
        { code: [
          { lang: "python", src: `from unittest.mock import Mock

class OrderService:
    def __init__(self, gateway):
        self.gateway = gateway          # injected dependency

    def checkout(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        return "PAID" if self.gateway.charge(amount) else "FAILED"

def test_checkout_success():
    gateway = Mock()
    gateway.charge.return_value = True  # stub behaviour
    assert OrderService(gateway).checkout(500) == "PAID"
    gateway.charge.assert_called_once_with(500)   # mock verification

def test_checkout_declined():
    gateway = Mock()
    gateway.charge.return_value = False
    assert OrderService(gateway).checkout(500) == "FAILED"` },
          { lang: "cpp", src: `#include <cassert>
#include <string>

struct PaymentGateway {
    virtual bool charge(int amount) = 0;
    virtual ~PaymentGateway() = default;
};

class OrderService {
    PaymentGateway& gw;
public:
    explicit OrderService(PaymentGateway& g) : gw(g) {}
    std::string checkout(int amount) {
        return gw.charge(amount) ? "PAID" : "FAILED";
    }
};

struct MockGateway : PaymentGateway {
    bool result = true;
    int calls = 0, lastAmount = 0;
    bool charge(int amount) override {
        ++calls; lastAmount = amount;
        return result;
    }
};

int main() {
    MockGateway mock;
    OrderService svc(mock);
    assert(svc.checkout(500) == "PAID");
    assert(mock.calls == 1 && mock.lastAmount == 500);
    mock.result = false;
    assert(svc.checkout(100) == "FAILED");
}` }
        ], title: "Mocking a payment gateway" },
        { warn: "Over-mocking makes tests pass while the real integration is broken, and ties tests to implementation details. Mock at architectural boundaries (network, DB, time), not every internal class." },
        { tip: "Libraries to name: <b>unittest.mock</b>/pytest-mock (Python), <b>GoogleMock</b> (C++), <b>Mockito</b> (Java)." }
      ]
    },
    {
      id: "code-coverage",
      q: "What is code coverage? Explain statement, branch and path coverage.",
      topic: "Testing",
      level: 2,
      top: false,
      short: "Code coverage is the percentage of code exercised by tests. Statement coverage counts executed lines, branch coverage counts each true/false outcome of every decision, and path coverage counts every distinct route through the code; each is stronger than the previous.",
      a: [
        { p: "<b>Code coverage</b> is a white-box metric measuring how much of the code the test suite executes. Tools: gcov/lcov (C/C++), coverage.py (Python), JaCoCo (Java)." },
        { code: `int f(int a, int b) {
    int r = 0;
    if (a > 0) r += 1;     // decision 1
    if (b > 0) r += 2;     // decision 2
    return r;
}`, lang: "cpp", title: "Function under test" },
        { table: { head: ["Criterion", "Definition", "Minimum tests for f()"], rows: [
          ["<b>Statement</b> (line)", "Every statement executed at least once", "1: <code>f(1,1)</code>"],
          ["<b>Branch</b> (decision)", "Every decision takes both true and false", "2: <code>f(1,1)</code>, <code>f(0,0)</code>"],
          ["<b>Condition</b>", "Every boolean sub-expression is both true and false", "Matters for <code>if (x &amp;&amp; y)</code>"],
          ["<b>Path</b>", "Every possible route from entry to exit", "4: <code>(1,1) (1,0) (0,1) (0,0)</code>"]
        ] } },
        { p: "Strength: <b>path ⊇ branch ⊇ statement</b>. 100% branch coverage implies 100% statement coverage, but not vice versa. Full path coverage is usually impossible with loops (paths explode), so <b>basis-path testing</b> uses cyclomatic complexity to pick a minimal set of independent paths." },
        { warn: "100% coverage does not mean bug-free: it proves lines ran, not that the assertions were correct or that missing requirements were implemented. Teams typically target ~70–85% with meaningful assertions." }
      ]
    },
    {
      id: "cyclomatic-complexity",
      q: "What is cyclomatic complexity? Compute it for a code snippet.",
      topic: "Testing",
      level: 2,
      top: true,
      short: "Cyclomatic complexity (McCabe) is the number of linearly independent paths through a program's control-flow graph: V(G) = E − N + 2P, or equivalently number of decision points + 1. It gives the minimum number of test cases for basis-path coverage.",
      a: [
        { p: "<b>Cyclomatic complexity</b>, introduced by Thomas McCabe (1976), measures the logical complexity of code from its <b>control flow graph</b> (nodes = blocks of statements, edges = transfers of control)." },
        { ul: [
          "<code>V(G) = E − N + 2P</code> (E edges, N nodes, P connected components, usually 1)",
          "<code>V(G) = P + 1</code> where P = number of predicate (decision) nodes",
          "<code>V(G)</code> = number of closed regions in the planar graph + 1 (the outer region)"
        ] },
        { code: `int sumPositive(const std::vector<int>& v) {
    int sum = 0;                  // node 1
    for (int x : v) {             // node 2 (loop test)
        if (x > 0)                // node 3
            sum += x;             // node 4
    }
    return sum;                   // node 5
}`, lang: "cpp", title: "Code to analyse" },
        { svg: `<svg viewBox="0 0 420 280" width="420" class="dg">
  <circle class="box" cx="140" cy="30" r="16"/>
  <text class="tx tx-b" x="140" y="30" text-anchor="middle" dominant-baseline="middle">1</text>
  <circle class="box-a" cx="140" cy="95" r="16"/>
  <text class="tx tx-b" x="140" y="95" text-anchor="middle" dominant-baseline="middle">2</text>
  <circle class="box-a" cx="140" cy="160" r="16"/>
  <text class="tx tx-b" x="140" y="160" text-anchor="middle" dominant-baseline="middle">3</text>
  <circle class="box" cx="140" cy="225" r="16"/>
  <text class="tx tx-b" x="140" y="225" text-anchor="middle" dominant-baseline="middle">4</text>
  <circle class="box-g" cx="290" cy="95" r="16"/>
  <text class="tx tx-b" x="290" y="95" text-anchor="middle" dominant-baseline="middle">5</text>
  <line class="ln" x1="140" y1="46" x2="140" y2="77" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="140" y1="111" x2="140" y2="142" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="140" y1="176" x2="140" y2="207" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="156" y1="95" x2="272" y2="95" marker-end="url(#dg-arr)"/>
  <path class="ln" d="M125,154 Q95,128 127,106" marker-end="url(#dg-arr)"/>
  <path class="ln" d="M124,225 Q40,160 123,98" marker-end="url(#dg-arr)"/>
  <text class="tx-c tx-s" x="164" y="34">sum = 0</text>
  <text class="tx-c tx-s" x="164" y="160">if (x > 0)</text>
  <text class="tx-c tx-s" x="164" y="229">sum += x</text>
  <text class="tx-c tx-s" x="290" y="124" text-anchor="middle">return sum</text>
  <text class="tx-m" x="214" y="87" text-anchor="middle">loop done</text>
  <text class="tx-m" x="148" y="130">next x</text>
  <text class="tx-m" x="102" y="146">F</text>
  <text class="tx-m" x="148" y="196">T</text>
  <text class="tx tx-b" x="210" y="268" text-anchor="middle">E = 6, N = 5 → V(G) = 6 − 5 + 2 = 3</text>
</svg>`, caption: "Control flow graph of sumPositive (nodes 2 and 3 are decisions)" },
        { ol: [
          "Edges: 1→2, 2→3, 2→5, 3→4, 3→2, 4→2 → <b>E = 6</b>; nodes <b>N = 5</b>.",
          "<code>V(G) = 6 − 5 + 2 = 3</code>. Check: 2 predicates (loop test, <code>if</code>) + 1 = 3.",
          "Basis paths (3 test cases): <code>1-2-5</code> (empty vector), <code>1-2-3-2-5</code> (<code>{-1}</code>), <code>1-2-3-4-2-5</code> (<code>{4}</code>)."
        ] },
        { table: { head: ["V(G)", "Interpretation"], rows: [
          ["1–10", "Simple, low risk"],
          ["11–20", "Moderately complex"],
          ["21–50", "Complex, high risk; consider refactoring"],
          ["&gt; 50", "Untestable in practice"]
        ] } },
        { warn: "Each <code>&amp;&amp;</code> / <code>||</code> in a condition and each <code>case</code> in a switch is its own decision point. <code>if (a &amp;&amp; b)</code> contributes 2, not 1." }
      ]
    },
    {
      id: "bva-equivalence-partitioning",
      q: "Explain boundary value analysis and equivalence partitioning with an example.",
      topic: "Testing",
      level: 2,
      top: true,
      short: "Equivalence partitioning divides inputs into classes that the system should treat the same and tests one representative per class; boundary value analysis tests values at and just around the edges of those classes, where off-by-one bugs cluster.",
      a: [
        { p: "Both are <b>black-box test design techniques</b> that reduce an infinite input space to a small, high-yield set of test cases." },
        { p: "<b>Example requirement:</b> an 'age' field accepts integers from <b>18 to 60</b> inclusive." },
        { h: "Equivalence partitioning (EP)" },
        { table: { head: ["Partition", "Range", "Valid?", "Representative"], rows: [
          ["P1", "age &lt; 18", "Invalid", "10"],
          ["P2", "18 ≤ age ≤ 60", "Valid", "35"],
          ["P3", "age &gt; 60", "Invalid", "70"],
          ["P4 (type)", "non-numeric / empty", "Invalid", "\"abc\", \"\""]
        ] } },
        { h: "Boundary value analysis (BVA)" },
        { p: "Test <b>min−1, min, min+1, max−1, max, max+1</b> (3-value BVA) → <code>17, 18, 19, 59, 60, 61</code>. The 2-value variant uses just the boundary and its outside neighbour: <code>17, 18, 60, 61</code>." },
        { code: `bool isEligible(int age) { return age >= 18 && age <= 60; }
// Typical bug: 'age > 18' instead of 'age >= 18'
// EP value 35 still passes; only BVA value 18 catches it.`, lang: "cpp", title: "Why boundaries matter" },
        { tip: "Combine them: pick EP representatives + BVA edges. For the example, <code>{10, 17, 18, 35, 60, 61, 70, \"abc\"}</code> is a strong, compact suite. Follow-up they may ask: for n independent variables, robust BVA gives <code>6n + 1</code> cases." }
      ]
    },

    /* ---------------- Git & Version Control ---------------- */
    {
      id: "git-vs-github",
      q: "What is Git, and how is it different from GitHub?",
      topic: "Git & Version Control",
      level: 1,
      top: true,
      short: "Git is a distributed version control system that runs locally and tracks changes to files as snapshots; GitHub is a cloud hosting service for Git repositories that adds collaboration features such as pull requests, issues and CI (GitHub Actions).",
      a: [
        { p: "<b>Git</b> (created by Linus Torvalds in 2005) is a <b>distributed version control system (DVCS)</b>: every developer has the full repository history locally, so commits, branches, diffs and logs work offline. Git stores <b>snapshots</b> of the project, identified by hashes." },
        { table: { head: ["", "Git", "GitHub"], rows: [
          ["What", "Version control <b>tool</b> (CLI software)", "Web <b>hosting service</b> for Git repos"],
          ["Runs", "Locally on your machine", "In the cloud (owned by Microsoft)"],
          ["Needs internet?", "No", "Yes"],
          ["Provides", "Commits, branches, merges, history", "Remote repos, pull requests, code review, issues, Actions CI/CD, wikis"],
          ["Alternatives", "Mercurial, SVN (centralised)", "GitLab, Bitbucket, Azure Repos"]
        ] } },
        { h: "The three local areas + remote" },
        { svg: `<svg viewBox="0 0 640 150" width="640" class="dg">
  <rect class="box" x="10" y="30" width="130" height="50" rx="6"/>
  <text class="tx tx-b" x="75" y="50" text-anchor="middle" dominant-baseline="middle">Working Dir</text>
  <text class="tx-m" x="75" y="68" text-anchor="middle">your edited files</text>
  <rect class="box-w" x="175" y="30" width="130" height="50" rx="6"/>
  <text class="tx tx-b" x="240" y="50" text-anchor="middle" dominant-baseline="middle">Staging Area</text>
  <text class="tx-m" x="240" y="68" text-anchor="middle">index</text>
  <rect class="box-a" x="340" y="30" width="130" height="50" rx="6"/>
  <text class="tx tx-b" x="405" y="50" text-anchor="middle" dominant-baseline="middle">Local Repo</text>
  <text class="tx-m" x="405" y="68" text-anchor="middle">.git (commits)</text>
  <rect class="box-g" x="505" y="30" width="125" height="50" rx="6"/>
  <text class="tx tx-b" x="567" y="50" text-anchor="middle" dominant-baseline="middle">Remote</text>
  <text class="tx-m" x="567" y="68" text-anchor="middle">GitHub (origin)</text>
  <line class="ln-a" x1="140" y1="45" x2="173" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="305" y1="45" x2="338" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="470" y1="45" x2="503" y2="45" marker-end="url(#dg-arr-a)"/>
  <text class="tx-c tx-s" x="157" y="22" text-anchor="middle">add</text>
  <text class="tx-c tx-s" x="322" y="22" text-anchor="middle">commit</text>
  <text class="tx-c tx-s" x="487" y="22" text-anchor="middle">push</text>
  <path class="ln ln-d" d="M567,80 L567,120 L75,120 L75,82" marker-end="url(#dg-arr)"/>
  <text class="tx-c tx-s" x="320" y="136" text-anchor="middle">git pull = fetch + merge (remote → local repo → working dir)</text>
</svg>`, caption: "Where changes live in Git" },
        { tip: "Say 'Git is the tool, GitHub is a place to host and collaborate on Git repos'. Bonus: centralised VCS (SVN) has a single server; if it is down you cannot commit, while in Git every clone is a full backup." }
      ]
    },
    {
      id: "git-basics-commit-branch",
      q: "Explain commit, branch, merge and HEAD in Git. What is .gitignore?",
      topic: "Git & Version Control",
      level: 1,
      top: false,
      short: "A commit is a saved snapshot with a message and parent pointer; a branch is a movable pointer to a commit; HEAD points to the current branch/commit; merge combines histories of two branches. .gitignore lists files Git should not track.",
      a: [
        { ul: [
          "<b>Commit</b> — immutable snapshot of the staged files plus author, timestamp, message and a pointer to its parent commit(s). Identified by a SHA hash.",
          "<b>Branch</b> — just a lightweight, movable pointer to a commit. Creating one is instant; new commits advance the current branch pointer.",
          "<b>HEAD</b> — a pointer to what you have checked out, normally a branch name. 'Detached HEAD' means it points directly at a commit.",
          "<b>Merge</b> — integrates another branch. <b>Fast-forward</b> if your branch has no new commits (pointer just moves); otherwise a <b>three-way merge</b> creates a merge commit with two parents."
        ] },
        { code: `git init                         # new repo (or: git clone <url>)
git status                       # what changed / what is staged
git add file.cpp                 # stage (git add . = everything)
git commit -m "Add parser"       # snapshot staged changes
git log --oneline --graph        # history
git diff                         # unstaged changes (--staged for staged)

git branch feature/search        # create branch
git switch feature/search        # move to it (older: git checkout)
git switch -c bugfix/crash       # create + switch in one step

git switch main
git merge feature/search         # bring feature into main
git branch -d feature/search     # delete merged branch`, lang: "bash", title: "Everyday commands" },
        { h: ".gitignore" },
        { p: "A <code>.gitignore</code> file lists patterns of files Git should not track: build outputs, dependencies, IDE files, logs and secrets." },
        { code: `# build output
build/
*.o
*.exe
# Python
__pycache__/
*.pyc
venv/
# dependencies and editor files
node_modules/
.vscode/
# secrets - never commit
.env
# negation: track this one even though *.log is ignored
*.log
!important.log`, lang: "text", title: "Sample .gitignore" },
        { warn: ".gitignore only affects <b>untracked</b> files. If a file is already committed, add it to .gitignore <i>and</i> run <code>git rm --cached file</code>. If a secret was pushed, rotate it: it still exists in history." }
      ]
    },
    {
      id: "merge-vs-rebase",
      q: "What is the difference between git merge and git rebase?",
      topic: "Git & Version Control",
      level: 2,
      top: true,
      short: "Merge combines two branches by creating a merge commit, preserving the exact history; rebase re-applies your commits on top of another branch, rewriting them into a clean linear history. Never rebase commits that others have already pulled.",
      a: [
        { p: "Both integrate changes from one branch into another. Suppose <code>feature</code> branched from <code>main</code> at C2, then main got C4 while feature got C3 and C5." },
        { svg: `<svg viewBox="0 0 640 200" width="640" class="dg">
  <text class="tx tx-b" x="10" y="18">git merge</text>
  <line class="ln" x1="60" y1="45" x2="340" y2="45"/>
  <line class="ln" x1="130" y1="45" x2="200" y2="85"/>
  <line class="ln" x1="200" y1="85" x2="270" y2="85"/>
  <line class="ln" x1="270" y1="85" x2="340" y2="45"/>
  <circle class="box" cx="60" cy="45" r="14"/>
  <text class="tx tx-s" x="60" y="45" text-anchor="middle" dominant-baseline="middle">C1</text>
  <circle class="box" cx="130" cy="45" r="14"/>
  <text class="tx tx-s" x="130" y="45" text-anchor="middle" dominant-baseline="middle">C2</text>
  <circle class="box" cx="200" cy="45" r="14"/>
  <text class="tx tx-s" x="200" y="45" text-anchor="middle" dominant-baseline="middle">C4</text>
  <circle class="box-p" cx="200" cy="85" r="14"/>
  <text class="tx tx-s" x="200" y="85" text-anchor="middle" dominant-baseline="middle">C3</text>
  <circle class="box-p" cx="270" cy="85" r="14"/>
  <text class="tx tx-s" x="270" y="85" text-anchor="middle" dominant-baseline="middle">C5</text>
  <circle class="box-a" cx="340" cy="45" r="14"/>
  <text class="tx tx-s" x="340" y="45" text-anchor="middle" dominant-baseline="middle">M</text>
  <text class="tx" x="380" y="42">Merge commit M has two parents.</text>
  <text class="tx-m" x="380" y="60">History preserved, non-linear.</text>
  <text class="tx tx-b" x="10" y="128">git rebase main (on feature)</text>
  <line class="ln" x1="60" y1="160" x2="340" y2="160"/>
  <circle class="box" cx="60" cy="160" r="14"/>
  <text class="tx tx-s" x="60" y="160" text-anchor="middle" dominant-baseline="middle">C1</text>
  <circle class="box" cx="130" cy="160" r="14"/>
  <text class="tx tx-s" x="130" y="160" text-anchor="middle" dominant-baseline="middle">C2</text>
  <circle class="box" cx="200" cy="160" r="14"/>
  <text class="tx tx-s" x="200" y="160" text-anchor="middle" dominant-baseline="middle">C4</text>
  <circle class="box-a" cx="270" cy="160" r="14"/>
  <text class="tx tx-s" x="270" y="160" text-anchor="middle" dominant-baseline="middle">C3'</text>
  <circle class="box-a" cx="340" cy="160" r="14"/>
  <text class="tx tx-s" x="340" y="160" text-anchor="middle" dominant-baseline="middle">C5'</text>
  <text class="tx" x="380" y="157">C3, C5 replayed as new commits C3', C5'.</text>
  <text class="tx-m" x="380" y="175">Linear history; hashes change.</text>
</svg>`, caption: "Merge keeps both lines of history; rebase rewrites feature commits on top of main" },
        { table: { head: ["", "Merge", "Rebase"], rows: [
          ["History", "True, non-linear; shows when branches joined", "Clean, linear, as if developed sequentially"],
          ["Extra commit", "Merge commit (unless fast-forward)", "None"],
          ["Rewrites commits?", "No, safe for shared branches", "Yes, new hashes"],
          ["Conflicts", "Resolved once", "May need resolving per replayed commit"],
          ["Use for", "Integrating into shared branches (main)", "Updating your private feature branch; cleaning up with <code>git rebase -i</code> (squash, reword)"]
        ] } },
        { code: `# on your feature branch, bring in latest main
git fetch origin
git rebase origin/main        # replay my commits on top
# resolve conflicts, then:
git add <file> && git rebase --continue   # or git rebase --abort
git push --force-with-lease   # needed because history was rewritten`, lang: "bash", title: "Typical rebase" },
        { warn: "<b>Golden rule:</b> never rebase commits that exist on a public/shared branch. Others' history will diverge from yours. Prefer <code>--force-with-lease</code> over <code>--force</code>, which refuses to overwrite commits you have not seen." }
      ]
    },
    {
      id: "reset-revert-restore",
      q: "Differentiate git reset, git revert and git checkout/restore.",
      topic: "Git & Version Control",
      level: 2,
      top: true,
      short: "git revert creates a new commit that undoes an earlier commit (safe for shared history); git reset moves the branch pointer back, optionally discarding staged/working changes (rewrites history); git restore/checkout discards changes to files in the working directory or index without moving the branch.",
      a: [
        { table: { head: ["Command", "What it does", "Rewrites history?", "Use when"], rows: [
          ["<code>git revert &lt;commit&gt;</code>", "Adds a <b>new</b> commit applying the inverse of that commit", "No", "Undoing something already pushed/shared"],
          ["<code>git reset --soft HEAD~1</code>", "Moves branch back 1; changes stay <b>staged</b>", "Yes", "Redo the last commit message or combine commits"],
          ["<code>git reset --mixed HEAD~1</code> (default)", "Moves branch back; changes kept but <b>unstaged</b>", "Yes", "Re-pick what to commit"],
          ["<code>git reset --hard HEAD~1</code>", "Moves branch back; <b>discards</b> staged and working changes", "Yes", "Throw away local commits completely (dangerous)"],
          ["<code>git restore &lt;file&gt;</code>", "Discards working-dir changes to a file", "No", "'I messed up this file, get last committed version'"],
          ["<code>git restore --staged &lt;file&gt;</code>", "Unstages the file (keeps edits)", "No", "Undo a <code>git add</code>"],
          ["<code>git checkout &lt;branch/commit&gt;</code>", "Switches branch or detaches HEAD at a commit (older command overloaded for files too)", "No", "Now split into <code>git switch</code> and <code>git restore</code> (Git 2.23+)"]
        ] } },
        { code: `git log --oneline
# a1b2c3 (HEAD -> main) bad commit
# 9f8e7d good commit

git revert a1b2c3            # safe: new commit "Revert 'bad commit'"
git reset --hard 9f8e7d      # local only: a1b2c3 disappears from the branch

git reflog                   # lists where HEAD has been - rescue lost commits
git reset --hard HEAD@{1}    # jump back to before the reset`, lang: "bash", title: "Undoing a bad commit" },
        { tip: "The key sentence: <b>revert is for public history, reset is for private history</b>. Mentioning <code>git reflog</code> as the safety net after a bad reset impresses interviewers." },
        { warn: "<code>git reset --hard</code> permanently deletes uncommitted work: it was never committed, so even reflog cannot recover it." }
      ]
    },
    {
      id: "merge-conflicts",
      q: "What is a merge conflict and how do you resolve it?",
      topic: "Git & Version Control",
      level: 2,
      top: false,
      short: "A merge conflict occurs when two branches change the same lines (or one edits a file the other deleted) and Git cannot decide automatically; you edit the file to keep the correct content, remove the conflict markers, git add it, and complete the merge.",
      a: [
        { p: "Git merges automatically when changes touch different lines. When both sides modify the <b>same region of the same file</b>, or one side deletes a file the other modified, Git stops and marks the conflict." },
        { code: `$ git merge feature/perf
Auto-merging config.cpp
CONFLICT (content): Merge conflict in config.cpp
Automatic merge failed; fix conflicts and then commit the result.

# config.cpp now contains:
<<<<<<< HEAD
int timeout = 30;          // your current branch (main)
=======
int timeout = 60;          // incoming branch (feature/perf)
>>>>>>> feature/perf`, lang: "text", title: "What a conflict looks like" },
        { ol: [
          "<code>git status</code> — lists 'both modified' files.",
          "Open each file; decide the correct result (ours, theirs, or a combination). Talk to the other author if unsure.",
          "Delete the <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> markers.",
          "Build and run tests. A textually clean merge can still be semantically broken.",
          "<code>git add config.cpp</code> then <code>git commit</code> (or <code>git merge --continue</code>; during rebase <code>git rebase --continue</code>).",
          "Bail out anytime with <code>git merge --abort</code>."
        ] },
        { p: "Shortcuts: <code>git checkout --ours file</code> / <code>--theirs file</code> take one side entirely; VS Code and <code>git mergetool</code> give a 3-way UI." },
        { tip: "Prevention: pull/rebase from main frequently, keep branches short-lived and PRs small, and avoid mass reformatting in feature branches." }
      ]
    },
    {
      id: "git-stash-cherry-pick",
      q: "What do git stash and git cherry-pick do?",
      topic: "Git & Version Control",
      level: 2,
      top: false,
      short: "git stash temporarily shelves uncommitted changes so you get a clean working directory and can reapply them later; git cherry-pick applies the changes of one specific commit from another branch onto the current branch as a new commit.",
      a: [
        { h: "git stash" },
        { p: "Use when you are mid-change and must switch context (urgent bug on main) but are not ready to commit. The stash is a stack of saved changes." },
        { code: `git stash                        # save tracked changes, clean working dir
git stash push -u -m "wip login" # include untracked files, add message
git stash list                   # stash@{0}: On feature: wip login
git switch main                  # ...fix urgent bug, commit...
git switch feature/login
git stash pop                    # reapply latest and remove from stack
git stash apply stash@{1}        # reapply a specific one, keep it in stack
git stash drop stash@{1}         # delete one; git stash clear = all`, lang: "bash", title: "Stash workflow" },
        { h: "git cherry-pick" },
        { p: "Copies a single commit (or a range) onto the current branch. Classic use: a hotfix committed on <code>main</code> must also go to <code>release/2.1</code> without merging everything else." },
        { code: `git switch release/2.1
git cherry-pick 4f2a9c1          # new commit with the same change, new hash
git cherry-pick -x 4f2a9c1       # append "(cherry picked from ...)" to message
git cherry-pick A^..B            # range A through B inclusive
# on conflict: fix, git add, then
git cherry-pick --continue       # or --abort`, lang: "bash", title: "Cherry-pick a hotfix" },
        { warn: "Cherry-picking creates duplicate commits with different hashes. Overusing it instead of merging leads to confusing history and repeated conflicts later." }
      ]
    },
    {
      id: "feature-branch-workflow",
      q: "Walk through a typical feature-branch workflow with Git and pull requests.",
      topic: "Git & Version Control",
      level: 2,
      top: true,
      short: "Update main, create a feature branch, commit small logical changes, rebase/merge main to stay current, push the branch, open a pull request, pass code review and CI, merge (often squash), then delete the branch.",
      a: [
        { p: "In the <b>feature-branch (GitHub Flow)</b> model, <code>main</code> is always deployable and every change happens on a short-lived branch that is merged via a <b>pull request (PR)</b>." },
        { code: `# 1. start from an up-to-date main
git switch main
git pull origin main

# 2. create a descriptive branch
git switch -c feature/otp-login

# 3. work in small commits
git add src/auth.cpp tests/auth_test.cpp
git commit -m "feat(auth): send OTP on login"
git commit -am "test(auth): cover expired OTP"

# 4. stay in sync with main
git fetch origin
git rebase origin/main            # or: git merge origin/main

# 5. publish and open a PR
git push -u origin feature/otp-login
#    -> open Pull Request on GitHub, request reviewers, CI runs

# 6. address review comments
git commit -am "refactor: extract OtpValidator"
git push

# 7. after approval + green CI, merge (squash / rebase / merge commit)
git switch main && git pull
git branch -d feature/otp-login
git push origin --delete feature/otp-login`, lang: "bash", title: "Feature branch from start to finish" },
        { ul: [
          "<b>Branch naming:</b> <code>feature/…</code>, <code>bugfix/…</code>, <code>hotfix/…</code>, often with a ticket id (<code>feature/JIRA-142-otp</code>).",
          "<b>Commit messages:</b> imperative and specific; many teams use Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>docs:</code>).",
          "<b>Protected main:</b> no direct pushes; PR needs approvals and passing checks."
        ] },
        { tip: "Know the alternatives: <b>Git Flow</b> (long-lived <code>develop</code> + release/hotfix branches, suited to versioned releases) and <b>trunk-based development</b> (very short branches or direct commits to main behind feature flags, suited to continuous deployment)." }
      ]
    },

    /* ---------------- Linux & Shell ---------------- */
    {
      id: "linux-common-commands",
      q: "Which Linux commands should every developer know?",
      topic: "Linux & Shell",
      level: 1,
      top: true,
      short: "Core commands include ls, cd, pwd, cp, mv, rm, cat, less, grep, find, chmod, chown, ps, top, kill, df, du, tail -f, ssh and curl for navigating files, searching, managing permissions and processes, checking disk usage and debugging services.",
      a: [
        { table: { head: ["Command", "Purpose", "Example"], rows: [
          ["<code>ls</code>", "List directory contents", "<code>ls -lah</code> (long, all incl. hidden, human sizes)"],
          ["<code>cd / pwd</code>", "Change / print working directory", "<code>cd ~/projects; pwd</code>"],
          ["<code>cp / mv / rm</code>", "Copy / move-rename / remove", "<code>cp -r src/ backup/</code>, <code>rm -rf build/</code>"],
          ["<code>cat / less / head</code>", "Print / page / first lines of a file", "<code>head -n 20 app.log</code>"],
          ["<code>grep</code>", "Search text by pattern", "<code>grep -rn \"TODO\" src/</code>, <code>grep -i error app.log</code>"],
          ["<code>find</code>", "Find files by name, type, size, time", "<code>find . -name \"*.cpp\" -mtime -1</code>"],
          ["<code>chmod / chown</code>", "Change permissions / owner", "<code>chmod 755 deploy.sh</code>"],
          ["<code>ps</code>", "Snapshot of processes", "<code>ps aux | grep python</code>"],
          ["<code>kill</code>", "Send a signal to a process", "<code>kill 4321</code> (SIGTERM), <code>kill -9 4321</code>"],
          ["<code>top / htop</code>", "Live CPU/memory usage per process", "Press <code>M</code> to sort by memory in top"],
          ["<code>df</code>", "Free space per filesystem", "<code>df -h</code>"],
          ["<code>du</code>", "Disk usage of files/dirs", "<code>du -sh * | sort -h</code>"],
          ["<code>tail -f</code>", "Follow a growing file live", "<code>tail -f /var/log/nginx/access.log</code>"],
          ["<code>curl</code>", "Make HTTP requests", "<code>curl -i https://api.example.com/health</code>"],
          ["<code>ssh / scp</code>", "Remote shell / copy over SSH", "<code>ssh user@10.0.0.5</code>"],
          ["<code>man</code>", "Manual page for a command", "<code>man grep</code>"]
        ] } },
        { code: `# Find the 5 biggest directories under /var
du -h /var --max-depth=1 2>/dev/null | sort -rh | head -5

# Count 500 errors in a log
grep -c " 500 " access.log

# Which process is using port 8080?
ss -ltnp | grep 8080          # or: lsof -i :8080

# POST JSON to an API
curl -X POST -H "Content-Type: application/json" \\
     -d '{"name":"test"}' http://localhost:8000/users`, lang: "bash", title: "Real debugging one-liners" },
        { tip: "Interviewers often ask a scenario: 'the server is slow / disk is full, what do you run?' Answer: <code>top</code> (CPU/mem), <code>df -h</code> then <code>du -sh</code> (disk), <code>tail -f</code> / <code>grep</code> the logs, <code>ss</code>/<code>netstat</code> for ports." }
      ]
    },
    {
      id: "file-permissions-chmod",
      q: "Explain Linux file permissions. What does chmod 755 mean?",
      topic: "Linux & Shell",
      level: 1,
      top: true,
      short: "Every file has read (4), write (2) and execute (1) bits for owner, group and others; chmod 755 gives the owner rwx (4+2+1=7) and group and others r-x (4+1=5), shown as -rwxr-xr-x.",
      a: [
        { p: "Linux controls access with three permission bits for three classes of users: <b>u</b>ser (owner), <b>g</b>roup and <b>o</b>thers. <code>ls -l</code> shows them as a 10-character string." },
        { svg: `<svg viewBox="0 0 560 190" width="560" class="dg">
  <rect class="box" x="10" y="40" width="40" height="44" rx="6"/>
  <text class="tx tx-b tx-c" x="30" y="62" text-anchor="middle" dominant-baseline="middle">-</text>
  <text class="tx-m" x="30" y="30" text-anchor="middle">type</text>
  <rect class="box-a" x="70" y="40" width="150" height="44" rx="6"/>
  <text class="tx tx-b tx-c" x="145" y="62" text-anchor="middle" dominant-baseline="middle">r w x</text>
  <text class="tx tx-b" x="145" y="30" text-anchor="middle">Owner (u)</text>
  <rect class="box-g" x="235" y="40" width="150" height="44" rx="6"/>
  <text class="tx tx-b tx-c" x="310" y="62" text-anchor="middle" dominant-baseline="middle">r - x</text>
  <text class="tx tx-b" x="310" y="30" text-anchor="middle">Group (g)</text>
  <rect class="box-p" x="400" y="40" width="150" height="44" rx="6"/>
  <text class="tx tx-b tx-c" x="475" y="62" text-anchor="middle" dominant-baseline="middle">r - x</text>
  <text class="tx tx-b" x="475" y="30" text-anchor="middle">Others (o)</text>
  <text class="tx-c" x="145" y="106" text-anchor="middle">4 + 2 + 1</text>
  <text class="tx-c" x="310" y="106" text-anchor="middle">4 + 0 + 1</text>
  <text class="tx-c" x="475" y="106" text-anchor="middle">4 + 0 + 1</text>
  <line class="ln" x1="145" y1="114" x2="145" y2="130" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="310" y1="114" x2="310" y2="130" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="475" y1="114" x2="475" y2="130" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b tx-a" x="145" y="148" text-anchor="middle">7</text>
  <text class="tx tx-b tx-a" x="310" y="148" text-anchor="middle">5</text>
  <text class="tx tx-b tx-a" x="475" y="148" text-anchor="middle">5</text>
  <text class="tx-m" x="280" y="178" text-anchor="middle">r = 4, w = 2, x = 1  →  chmod 755 = -rwxr-xr-x</text>
</svg>`, caption: "Decoding -rwxr-xr-x as octal 755" },
        { table: { head: ["Bit", "On a file", "On a directory"], rows: [
          ["<b>r</b> (4)", "Read contents", "List names inside (<code>ls</code>)"],
          ["<b>w</b> (2)", "Modify contents", "Create, delete, rename entries inside"],
          ["<b>x</b> (1)", "Execute as program/script", "Enter it (<code>cd</code>) and access files by name"]
        ] } },
        { code: `chmod 755 deploy.sh     # rwxr-xr-x : scripts, directories
chmod 644 notes.txt     # rw-r--r-- : normal files
chmod 600 ~/.ssh/id_rsa # rw------- : private keys (ssh refuses looser)
chmod u+x run.sh        # symbolic: add execute for owner
chmod go-w file         # remove write from group and others
chmod -R 750 app/       # recursive
chown alice:dev app.log # change owner and group
umask                   # 0022 -> new files 644, new dirs 755`, lang: "bash", title: "Numeric and symbolic chmod" },
        { tip: "Special bits for bonus points: <b>setuid</b> (4xxx, runs as file owner, e.g. <code>passwd</code>), <b>setgid</b> (2xxx), <b>sticky bit</b> (1xxx, on <code>/tmp</code>: only owners can delete their files)." },
        { warn: "<code>chmod 777</code> 'to make it work' is a security smell: anyone on the system can modify the file. Fix the owner/group instead." }
      ]
    },
    {
      id: "processes-signals",
      q: "How do you manage processes in Linux? What are signals?",
      topic: "Linux & Shell",
      level: 2,
      top: false,
      short: "Processes are inspected with ps/top and controlled with signals, which are asynchronous notifications like SIGTERM (polite stop), SIGKILL (forced, cannot be caught), SIGINT (Ctrl+C) and SIGTSTP (Ctrl+Z); jobs can be moved between foreground and background with fg, bg and &.",
      a: [
        { p: "Every running program is a <b>process</b> with a PID, a parent (PPID), an owner and a state (running, sleeping, stopped, zombie). A <b>signal</b> is a small asynchronous message the kernel delivers to a process; the process can handle, ignore or take the default action, except for SIGKILL and SIGSTOP." },
        { table: { head: ["Signal", "No.", "Trigger", "Default / notes"], rows: [
          ["SIGHUP", "1", "Terminal closed", "Terminate; daemons often reload config on it"],
          ["SIGINT", "2", "<code>Ctrl+C</code>", "Terminate; can be caught"],
          ["SIGKILL", "9", "<code>kill -9 PID</code>", "Immediate kill; <b>cannot</b> be caught or ignored, no cleanup"],
          ["SIGTERM", "15", "<code>kill PID</code> (default)", "Polite request to exit; app can clean up"],
          ["SIGCHLD", "17", "Child exits", "Parent should <code>wait()</code> to reap it, or it becomes a zombie"],
          ["SIGSTOP / SIGTSTP", "19 / 20", "<code>kill -STOP</code> / <code>Ctrl+Z</code>", "Pause; resume with SIGCONT (<code>fg</code>/<code>bg</code>)"]
        ] } },
        { code: `ps aux | grep server          # find the PID
pgrep -f "python app.py"      # PID by pattern
top                           # live view (htop is nicer)

kill 4321                     # SIGTERM - try this first
kill -9 4321                  # SIGKILL - last resort
pkill -f "python app.py"      # kill by name

./long_job.sh &               # run in background
jobs                          # list background jobs
fg %1                         # bring job 1 to foreground
# Ctrl+Z pauses it, then:
bg %1                         # continue it in background
nohup ./server > out.log 2>&1 &   # survive logout

trap 'echo cleaning up; rm -f /tmp/lock' SIGTERM SIGINT   # handle signals in a script`, lang: "bash", title: "Process control" },
        { tip: "Why prefer SIGTERM over SIGKILL: SIGTERM lets the program flush buffers, close DB connections and delete temp files. Docker and Kubernetes send SIGTERM first and SIGKILL only after a grace period." },
        { warn: "You cannot kill a <b>zombie</b>: it is already dead and only holds an exit status. Fix or kill its <b>parent</b> so it gets reaped (orphans are adopted by init/systemd)." }
      ]
    },
    {
      id: "pipes-redirection-env",
      q: "Explain pipes, I/O redirection and environment variables in the shell.",
      topic: "Linux & Shell",
      level: 2,
      top: false,
      short: "Every process has stdin (0), stdout (1) and stderr (2); redirection (>, >>, <, 2>, 2>&1) connects them to files, a pipe (|) connects one command's stdout to the next's stdin, and environment variables are key-value settings (PATH, HOME) inherited by child processes via export.",
      a: [
        { p: "Unix philosophy: small tools that do one thing, composed with <b>pipes</b>. Each process starts with three file descriptors: <b>0 stdin</b>, <b>1 stdout</b>, <b>2 stderr</b>." },
        { table: { head: ["Syntax", "Meaning"], rows: [
          ["<code>cmd &gt; file</code>", "stdout to file (overwrite)"],
          ["<code>cmd &gt;&gt; file</code>", "stdout appended to file"],
          ["<code>cmd &lt; file</code>", "stdin read from file"],
          ["<code>cmd 2&gt; err.txt</code>", "stderr to file"],
          ["<code>cmd &gt; all.log 2&gt;&amp;1</code>", "stdout and stderr to the same file (order matters)"],
          ["<code>cmd 2&gt;/dev/null</code>", "discard errors"],
          ["<code>cmd1 | cmd2</code>", "stdout of cmd1 becomes stdin of cmd2"],
          ["<code>cmd | tee out.txt</code>", "show on screen and save to file"]
        ] } },
        { code: `# top 5 IPs hitting the server
cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -5

# count lines of C++ code
find . -name "*.cpp" | xargs wc -l | tail -1

# compile, keep errors separately
g++ main.cpp -o app 2> errors.txt

# run and log everything
./app > run.log 2>&1

# feed input from a file
./solution < input.txt > output.txt`, lang: "bash", title: "Pipes and redirection" },
        { h: "Environment variables" },
        { p: "Named values in a process's environment, copied to every child it starts. Used for configuration (<b>12-factor apps</b>: DB URLs, API keys, <code>APP_ENV</code>) without hard-coding." },
        { code: `echo $HOME $USER $PATH        # read variables
NAME=dev                      # shell variable (not inherited)
export APP_ENV=production     # environment variable (inherited by children)
APP_ENV=test ./run.sh         # set only for this one command
env | grep APP                # list environment
unset APP_ENV

export PATH="$PATH:$HOME/bin" # add a directory to the command search path
# make it permanent: add the export line to ~/.bashrc, then: source ~/.bashrc`, lang: "bash", title: "Working with environment variables" },
        { warn: "<code>cmd 2&gt;&amp;1 &gt; file</code> is not the same as <code>cmd &gt; file 2&gt;&amp;1</code>: redirections apply left to right, so the first sends stderr to the terminal (where stdout pointed at that moment)." }
      ]
    },

    /* ---------------- Practices & DevOps ---------------- */
    {
      id: "ci-cd-pipeline",
      q: "What is CI/CD? Describe a typical pipeline.",
      topic: "Practices & DevOps",
      level: 1,
      top: true,
      short: "Continuous Integration means every commit is automatically built and tested; Continuous Delivery keeps every passing build ready to release with a manual approval, and Continuous Deployment pushes it to production automatically.",
      a: [
        { ul: [
          "<b>Continuous Integration (CI)</b> — developers merge small changes to the shared branch often (daily+); each push triggers an automated build and test run, so integration bugs are caught within minutes.",
          "<b>Continuous Delivery (CD)</b> — every build that passes is automatically packaged and deployed to staging; releasing to production is a <b>one-click, manual</b> decision.",
          "<b>Continuous Deployment</b> — goes one step further: every passing change goes to production <b>automatically</b>, no human gate."
        ] },
        { svg: `<svg viewBox="0 0 690 170" width="690" class="dg">
  <rect class="box" x="5" y="40" width="95" height="44" rx="6"/>
  <text class="tx tx-b" x="52" y="62" text-anchor="middle" dominant-baseline="middle">Commit</text>
  <rect class="box" x="120" y="40" width="95" height="44" rx="6"/>
  <text class="tx tx-b" x="167" y="62" text-anchor="middle" dominant-baseline="middle">Build</text>
  <rect class="box-a" x="235" y="40" width="95" height="44" rx="6"/>
  <text class="tx tx-b" x="282" y="62" text-anchor="middle" dominant-baseline="middle">Test</text>
  <rect class="box-p" x="350" y="40" width="95" height="44" rx="6"/>
  <text class="tx tx-b" x="397" y="62" text-anchor="middle" dominant-baseline="middle">Package</text>
  <rect class="box-w" x="465" y="40" width="95" height="44" rx="6"/>
  <text class="tx tx-b" x="512" y="62" text-anchor="middle" dominant-baseline="middle">Staging</text>
  <rect class="box-g" x="580" y="40" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="630" y="62" text-anchor="middle" dominant-baseline="middle">Production</text>
  <line class="ln-a" x1="100" y1="62" x2="118" y2="62" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="215" y1="62" x2="233" y2="62" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="330" y1="62" x2="348" y2="62" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="445" y1="62" x2="463" y2="62" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="560" y1="62" x2="578" y2="62" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="569" y="34" text-anchor="middle">gate?</text>
  <line class="ln" x1="5" y1="100" x2="330" y2="100"/>
  <text class="tx tx-b" x="167" y="116" text-anchor="middle">Continuous Integration</text>
  <line class="ln" x1="350" y1="100" x2="680" y2="100"/>
  <text class="tx tx-b" x="515" y="116" text-anchor="middle">Continuous Delivery / Deployment</text>
  <rect class="box-r" x="235" y="130" width="95" height="32" rx="6"/>
  <text class="tx tx-s" x="282" y="146" text-anchor="middle" dominant-baseline="middle">fail: notify dev</text>
  <text class="tx-s" x="120" y="150">lint, compile</text>
  <text class="tx-s" x="350" y="150">Docker image / artifact</text>
</svg>`, caption: "Typical pipeline: a failing stage stops the line and alerts the author" },
        { code: `# .github/workflows/ci.yml  (GitHub Actions)
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: flake8 .            # lint
      - run: pytest --cov=app    # tests + coverage`, lang: "text", title: "Minimal CI config" },
        { p: "Tools: GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps. Safer releases use <b>blue-green</b> deployment, <b>canary</b> releases and <b>feature flags</b>, with quick rollback." },
        { tip: "Benefits to state: faster feedback, smaller and less risky releases, fewer 'works on my machine' bugs, and the main branch is always releasable." }
      ]
    },
    {
      id: "code-review",
      q: "What are code review best practices?",
      topic: "Practices & DevOps",
      level: 1,
      top: false,
      short: "Keep pull requests small and focused, automate style checks, review for correctness, design, readability, tests and security, give specific and respectful comments, and respond to feedback quickly as the author.",
      a: [
        { p: "<b>Code review</b> is a peer check of changes before they merge, usually via pull requests. It catches defects early, spreads knowledge across the team and keeps the codebase consistent." },
        { h: "What reviewers look for" },
        { ol: [
          "<b>Correctness</b> — does it do what the ticket says? Edge cases, null/empty input, error handling, concurrency.",
          "<b>Design</b> — right place for the code, no duplication, reasonable coupling, not over-engineered.",
          "<b>Readability</b> — clear names, small functions, comments explaining <i>why</i> not <i>what</i>.",
          "<b>Tests</b> — new behaviour is tested, tests are meaningful, CI green.",
          "<b>Security &amp; performance</b> — injection, secrets in code, unbounded loops or N+1 queries."
        ] },
        { table: { head: ["As the author", "As the reviewer"], rows: [
          ["Keep PRs small (~200–400 lines)", "Review promptly (within a working day)"],
          ["Write a clear description: what, why, how to test, screenshots", "Comment on the code, not the person; ask questions"],
          ["Self-review the diff first", "Label severity: blocking vs 'nit:'"],
          ["Let linters/formatters handle style", "Explain the reason and suggest an alternative"],
          ["Respond to every comment", "Approve when it is good enough, not perfect"]
        ] } },
        { tip: "Mention automation: linters (clang-tidy, flake8), formatters (clang-format, black) and static analysis (SonarQube) run in CI so humans focus on logic and design." }
      ]
    },
    {
      id: "semantic-versioning",
      q: "What is semantic versioning?",
      topic: "Practices & DevOps",
      level: 1,
      top: false,
      short: "Semantic versioning uses MAJOR.MINOR.PATCH: increment MAJOR for breaking API changes, MINOR for backward-compatible new features, and PATCH for backward-compatible bug fixes.",
      a: [
        { p: "<b>SemVer</b> (semver.org) gives version numbers a meaning so users can tell whether an upgrade is safe. Format: <code>MAJOR.MINOR.PATCH</code>, e.g. <code>2.4.1</code>." },
        { table: { head: ["Part", "Bump when", "Example", "Resets"], rows: [
          ["<b>MAJOR</b>", "Incompatible / breaking API change", "2.4.1 → <b>3.0.0</b> (removed a function)", "MINOR and PATCH to 0"],
          ["<b>MINOR</b>", "New backward-compatible feature", "2.4.1 → <b>2.5.0</b> (added an endpoint)", "PATCH to 0"],
          ["<b>PATCH</b>", "Backward-compatible bug fix", "2.4.1 → <b>2.4.2</b>", "—"]
        ] } },
        { ul: [
          "<b>Pre-release</b>: <code>1.0.0-alpha.1</code>, <code>1.0.0-rc.2</code> (lower precedence than 1.0.0).",
          "<b>Build metadata</b>: <code>1.0.0+20260925</code> (ignored for precedence).",
          "<b>0.y.z</b> means initial development: anything may change at any time.",
          "Dependency ranges (npm): <code>^1.2.3</code> allows <code>&gt;=1.2.3 &lt;2.0.0</code>; <code>~1.2.3</code> allows <code>&gt;=1.2.3 &lt;1.3.0</code>."
        ] },
        { tip: "Link it to releases: tag them in Git (<code>git tag -a v2.5.0 -m \"...\"</code>) and keep a CHANGELOG. Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>BREAKING CHANGE:</code>) can calculate the next version automatically." }
      ]
    },
    {
      id: "docker-basics",
      q: "What is Docker? Compare an image, a container and a virtual machine.",
      topic: "Practices & DevOps",
      level: 2,
      top: true,
      short: "Docker packages an application with its dependencies into an image; a container is a running, isolated instance of that image sharing the host OS kernel, which makes it far lighter and faster to start than a virtual machine that runs a full guest OS on a hypervisor.",
      a: [
        { p: "<b>Docker</b> is a containerisation platform. It solves 'works on my machine' by shipping the app together with its runtime, libraries and config as one portable unit. Isolation comes from Linux kernel features: <b>namespaces</b> (process, network, filesystem views) and <b>cgroups</b> (CPU/memory limits)." },
        { table: { head: ["", "Image", "Container", "Virtual Machine"], rows: [
          ["What", "Read-only template: layered filesystem + metadata", "Running (or stopped) instance of an image with a writable layer", "Full emulated computer with its own OS"],
          ["Analogy", "Class", "Object", "Separate physical computer"],
          ["OS kernel", "—", "Shares the host kernel", "Own guest kernel on a hypervisor"],
          ["Size", "MBs (layers shared)", "MBs", "GBs"],
          ["Startup", "—", "Milliseconds to seconds", "Tens of seconds to minutes"],
          ["Isolation", "—", "Process-level (weaker)", "Hardware-level (stronger)"],
          ["Created by", "<code>docker build</code> from a Dockerfile", "<code>docker run</code>", "VirtualBox, VMware, KVM, Hyper-V"]
        ] } },
        { code: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]`, lang: "text", title: "Dockerfile (copy requirements first so the pip layer is cached)" },
        { code: `docker build -t myapp:1.0 .            # image from Dockerfile
docker images                          # list images
docker run -d -p 8000:8000 --name web myapp:1.0   # container, host 8000 -> 8000
docker ps                              # running containers (-a for all)
docker logs -f web                     # follow logs
docker exec -it web bash               # shell inside container
docker stop web && docker rm web
docker compose up -d                   # multi-container app from compose.yaml`, lang: "bash", title: "Core commands" },
        { tip: "Follow-ups: <b>Docker Compose</b> runs multi-container apps (app + DB) locally; <b>Kubernetes</b> orchestrates containers across many machines (scaling, self-healing, rolling updates). Containers are ephemeral: persist data in <b>volumes</b>." }
      ]
    },
    {
      id: "technical-debt-refactoring",
      q: "What is technical debt, and what is refactoring?",
      topic: "Practices & DevOps",
      level: 2,
      top: false,
      short: "Technical debt is the future cost of choosing a quick or easy solution now instead of a better one; refactoring is restructuring existing code without changing its external behaviour to improve readability and maintainability, which is the main way to pay that debt down.",
      a: [
        { p: "<b>Technical debt</b> (Ward Cunningham's metaphor): shortcuts are like borrowing money. You ship faster today, but pay <b>interest</b> later as every change becomes slower and riskier until the <b>principal</b> is repaid by cleaning up." },
        { ul: [
          "<b>Causes:</b> deadline pressure, missing tests, copy-paste code, outdated libraries, unclear requirements, lack of design.",
          "<b>Symptoms:</b> small features take long, frequent regressions, fear of touching certain modules, long onboarding.",
          "<b>Managing it:</b> track debt items in the backlog, reserve capacity each sprint (e.g. 15–20%), apply the <b>Boy Scout rule</b> (leave code cleaner than you found it), and measure with tools like SonarQube."
        ] },
        { p: "<b>Refactoring</b> is changing the internal structure of code <b>without changing its observable behaviour</b>. It must be done in small steps, backed by tests that stay green." },
        { table: { head: ["Code smell", "Refactoring"], rows: [
          ["Long method", "Extract Method"],
          ["Duplicated code", "Extract a shared function/class"],
          ["Magic numbers", "Replace with named constant"],
          ["Long parameter list", "Introduce Parameter Object"],
          ["Large switch on type", "Replace Conditional with Polymorphism"],
          ["Unclear names", "Rename Variable/Method"]
        ] } },
        { code: [
          { lang: "cpp", src: `// Before: magic numbers, mixed responsibilities
double price(int qty, double unit) {
    double p = qty * unit;
    if (qty > 100) p = p * 0.9;
    return p * 1.18;
}

// After: same behaviour, intent is clear
constexpr double BULK_DISCOUNT = 0.10;
constexpr int    BULK_THRESHOLD = 100;
constexpr double GST_RATE = 0.18;

double applyBulkDiscount(double amount, int qty) {
    return qty > BULK_THRESHOLD ? amount * (1 - BULK_DISCOUNT) : amount;
}
double withTax(double amount) { return amount * (1 + GST_RATE); }

double price2(int qty, double unit) {
    return withTax(applyBulkDiscount(qty * unit, qty));
}` },
          { lang: "python", src: `# Before
def price(qty, unit):
    p = qty * unit
    if qty > 100:
        p = p * 0.9
    return p * 1.18

# After
BULK_DISCOUNT = 0.10
BULK_THRESHOLD = 100
GST_RATE = 0.18

def apply_bulk_discount(amount, qty):
    return amount * (1 - BULK_DISCOUNT) if qty > BULK_THRESHOLD else amount

def with_tax(amount):
    return amount * (1 + GST_RATE)

def price2(qty, unit):
    return with_tax(apply_bulk_discount(qty * unit, qty))` }
        ], title: "Extract Method + replace magic numbers" },
        { warn: "Refactoring is not rewriting and not adding features. Mixing a refactor with a behaviour change in the same commit makes bugs hard to trace. Refactor first (tests green), then change behaviour in a separate commit." }
      ]
    }
  ]
});
