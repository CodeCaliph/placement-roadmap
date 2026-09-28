/* study: Career — resume, projects, mock OAs & interviews, behavioural, company research, interview day */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ───────────────────────── RESUME ───────────────────────── */
  add({
    id: "car-resume",
    subject: "career",
    title: "Resume: one page, ATS-safe, every bullet Action + Tech + Impact",
    minutes: 60,
    crux: [
      "<b>One page, single column, PDF.</b> No photo, DOB, marital status, full address, \"Declaration\", skill bars or two-column templates — ATS parsers scramble them.",
      "Fresher order: <b>Header → Education → Technical Skills → Projects → (Experience, above Projects if it is a real SWE internship) → Achievements → Positions of Responsibility</b>.",
      "Every bullet: <b>Action verb + what you built + technology + measurable impact</b>, 1–2 lines, a number wherever it is honestly measurable.",
      "<b>Every word on the resume is a valid interview question.</b> List only what you can defend for 5 minutes. Fewer, deeper.",
      "Numbers are not invented — they are <b>measured</b>: a load test, a test count, a dataset size, a before/after timing.",
      "Versions: v1 skeleton (D1) → v2 bullets (D6) → v3 checklist (D14) → v4 + Project 1 with live link (D35) → v5 + Project 2, structure check (D48–49) → <b>locked, 5 printed copies</b> (D56)."
    ],
    sections: [
      { h: "The version plan — the resume is built in six passes", blocks: [
        { p: "Do not try to write the perfect resume on Day 1. You do not yet have the projects or numbers. Build the skeleton now, then improve one layer at a time on the days the plan tells you to." },
        { table: { head: ["Version", "Day", "What changes", "Done when"], rows: [
          ["v1", "D1", "Skeleton in the right section order; education, skills, whatever projects you have today", "It exists as a one-page PDF with correct headers"],
          ["v2", "D6", "Every bullet rewritten with the Action+Tech+Impact formula; numbers added; cut to exactly one page", "No bullet starts with \"Worked on\" / \"Responsible for\""],
          ["v3", "D14", "Reviewed against the checklist at the end of this lesson", "Every checklist box ticked or has a fix date"],
          ["v4", "D35", "Project 1 added with real bullets and the <b>live URL</b>", "Link opens on a phone; GitHub README matches the bullets"],
          ["v5", "D48–49", "Project 2 added; final structural check (order, spacing, one page, keywords)", "Plain-text ATS test passes"],
          ["final", "D56", "Locked. Proofread by two people. PDF + 5 printed copies", "No edits after this unless something is wrong"]
        ] } },
        { tip: "Keep every version (<code>Resume_v1.pdf</code> … <code>v5</code>) in one folder. Seeing v1 next to v5 is a good morale check and lets you roll back a bad edit." }
      ] },
      { h: "Structure & layout (v1)", blocks: [
        { p: "Recruiters spend well under a minute on a first pass. They read top-down and left-aligned. The layout's job is to get them to your <b>projects</b> and <b>numbers</b> fast." },
        { code: `FIRSTNAME LASTNAME
+91 98xxxxxx10 | firstname.lastname@gmail.com | linkedin.com/in/yourname | github.com/yourname | Pune

EDUCATION
B.Tech, Computer Science and Engineering — XYZ Institute of Technology        2022 – 2026
CGPA: 8.4 / 10

TECHNICAL SKILLS
Languages:            Java, SQL, Python (basic)
Frameworks/Libraries: Spring Boot, Spring Security, JUnit 5, Mockito
Databases:            PostgreSQL, MySQL, Redis (basic)
Tools/Platforms:      Git, Docker, Linux, Postman, Render
CS Fundamentals:      DSA, OOP, Operating Systems, DBMS, Computer Networks

PROJECTS
URL Shortener with Analytics | Java, Spring Boot, PostgreSQL, Docker | Live | GitHub
  - bullet (what + scale)
  - bullet (the design decision)
  - bullet (quality / deployment)
Multithreaded HTTP Server | Java (no frameworks) | GitHub
  - bullet
  - bullet

EXPERIENCE                      (move above PROJECTS if it is a real SWE internship)
Software Engineering Intern — Company, City                                   May – Jul 2025
  - bullet

ACHIEVEMENTS
  - LeetCode: 600+ problems, contest rating 1,800 (link) | Codeforces: Specialist (link)
  - Hackathon result with rank and field size

POSITIONS OF RESPONSIBILITY     (only if it took real work)
  - Role, club — one line with a number`, lang: "text", title: "v1 skeleton (content is illustrative — replace with yours)" },
        { table: { head: ["Section", "Rules"], rows: [
          ["Header", "Name, phone, professional email, LinkedIn, GitHub, (portfolio), city. Plain text links — not icons alone."],
          ["Education", "Degree, institute, CGPA, years. Keep 10th/12th marks (one line each) only if your placement cell's format or a company's eligibility criteria ask for them."],
          ["Technical Skills", "Grouped as plain text: Languages / Frameworks &amp; Libraries / Databases / Tools &amp; Platforms / CS Fundamentals. No skill bars, no \"8/10\". Only what you can defend."],
          ["Projects", "The most important section for a fresher. 2–3 projects, 2–3 bullets each. Title line: name | stack | Live | GitHub."],
          ["Experience", "Real internships. Above Projects if it was genuine SWE work."],
          ["Achievements", "Ratings, ranks with field size (\"Top 10 of 350 teams\"), open source, scholarships. A number every time."],
          ["Positions of Responsibility", "Only if it took real work, with an outcome."],
          ["Certifications (optional)", "Only meaningful ones. Drop beginner course certificates."]
        ] } },
        { warn: "Delete: objective/career summary paragraphs (\"Seeking a challenging role…\"), hobbies, languages spoken, photo, DOB, father's name, full postal address, \"Declaration: I hereby declare…\". They cost space and add nothing." }
      ] },
      { h: "The bullet formula (v2) — with 8 before/after rewrites", blocks: [
        { p: "<b>Action verb + what you built + technology + measurable impact.</b> The verb shows ownership, the tech feeds the ATS keyword match, the number makes the line believable and memorable." },
        { p: "Strong verbs: <i>Built, Designed, Implemented, Optimised, Reduced, Automated, Migrated, Scaled, Led, Wrote, Deployed, Profiled, Cut, Raised</i>. Weak openers to remove: <i>Worked on, Helped with, Responsible for, Involved in, Did, Made</i>." },
        { table: { head: ["#", "Before (weak)", "After (Action + Tech + Impact)", "What changed"], rows: [
          ["1", "Worked on a URL shortener using Spring Boot.", "Built a URL-shortener REST API (Java 21, Spring Boot, PostgreSQL) with Base62 short codes and click analytics; sustained 1,200 redirects/s at p95 &lt; 40 ms in a k6 load test.", "Verb, stack, a measured number"],
          ["2", "Implemented caching.", "Added an in-memory LRU cache (cache-aside) in front of PostgreSQL for hot short codes, reaching an 85% hit rate and cutting median redirect latency from 18 ms to 3 ms.", "Names the pattern and the before/after"],
          ["3", "Made a login system with JWT.", "Implemented stateless JWT authentication (HS256, 15-minute access tokens) with salted password hashing and role-based access across 12 endpoints.", "Specific design details you can defend"],
          ["4", "Did a web development internship at XYZ.", "Migrated 8 legacy JSP reporting pages at XYZ to a Spring Boot REST API + React UI, cutting page load from 4.2 s to 1.1 s.", "Scope + measurable outcome"],
          ["5", "Wrote test cases.", "Raised service-layer coverage to 82% with 60 JUnit 5 + Mockito tests; wired a GitHub Actions pipeline that blocks merges on failures.", "Count + effect on the team"],
          ["6", "Built a multithreaded server.", "Wrote a multithreaded HTTP/1.1 server in plain Java (ServerSocket, fixed thread pool, ConcurrentHashMap-backed LRU) sustaining 3,000 req/s over 200 concurrent clients in a wrk benchmark.", "Shows concurrency depth — a rare signal"],
          ["7", "Good knowledge of DSA. (in Skills)", "Achievements: Solved 600+ problems on LeetCode (contest rating 1,800, link).", "A claim became evidence, moved to the right section"],
          ["8", "Responsible for managing the coding club.", "Led a 6-member coding-club core team; ran 14 weekly contests, growing active participants from 40 to 160.", "Leadership with a result"]
        ] } },
        { warn: "All numbers above are <b>illustrative</b>. Never copy a number you did not measure. Every number will be asked: \"How did you measure that?\" — and you must be able to answer." },
        { h: "Where honest numbers come from" },
        { table: { head: ["Metric type", "How to get it honestly (1–2 hours of work)"], rows: [
          ["Throughput / latency", "Run a load test (k6, JMeter, wrk, or a small Java client) on your deployed or local app; record req/s and p95. Note the machine."],
          ["Before/after improvement", "Measure once without the change (e.g. no cache), once with it. Same test, same machine."],
          ["Scale of data", "Seed the DB with a script (e.g. 1M rows) and report query time with and without the index."],
          ["Quality", "Number of tests, coverage % from JaCoCo, number of endpoints, CI checks."],
          ["Users / adoption", "Real users only: classmates who used your tool, downloads, GitHub stars, club attendance."],
          ["Time saved", "\"Automated the weekly attendance report: 2 hours → 5 minutes\" — time it once each way."]
        ] } },
        { h: "Cutting to exactly one page" },
        { ol: [
          "Delete everything in the warning list above.",
          "Drop the weakest project (keep 2 strong + at most 1 small).",
          "Merge bullets that say the same thing; keep 2–3 bullets per project.",
          "Shorten bullets that wrap by one or two words onto a new line (\"widow\" lines waste a full line).",
          "Only then shrink: margins ≥ 0.5 inch, font 10–11.5 pt. Never below 10 pt."
        ] }
      ] },
      { h: "ATS basics — how the machine reads you", blocks: [
        { p: "An <b>Applicant Tracking System</b> converts your PDF to plain text, splits it into sections by recognising headers, and lets recruiters search and filter (\"Java AND Spring AND SQL\"). If the parse breaks, a strong resume can be invisible." },
        { ul: [
          "Single column, standard fonts (Calibri, Arial, Latin Modern), black text, 10–11.5 pt.",
          "Standard headers: <b>Education, Experience, Projects, Skills, Achievements</b>. Not \"My Journey\" or \"What I Know\".",
          "No text inside images, text boxes, tables used for layout, or page headers/footers (some parsers drop them).",
          "Export as PDF named <code>Firstname_Lastname_Resume.pdf</code>.",
          "Mirror the job description's keywords <b>truthfully</b>: if the JD says \"REST APIs, SQL, microservices\" and you built REST APIs with SQL, those exact words should appear in your bullets."
        ] },
        { p: "<b>The plain-text test:</b> open your PDF, select all, paste into Notepad. The text should read top-to-bottom in the same order as the page, with headers on their own lines. If sections interleave or words split, a parser will do the same — fix the layout." },
        { tip: "LaTeX templates (e.g. Jake's Resume on Overleaf) and plain Word/Google Docs single-column templates both parse well. Canva-style designer templates with sidebars usually do not." }
      ] },
      { h: "Adding projects (v4, v5)", blocks: [
        { p: "When a project is deployed (D26) and Project 2 is done (D48), each gets a title line plus 2–3 bullets following a fixed pattern:" },
        { table: { head: ["Bullet", "Answers", "Example (URL shortener)"], rows: [
          ["1. What + scale", "What is it and how big/fast?", "Built a URL-shortener REST API (Java, Spring Boot, PostgreSQL) with Base62 codes and per-link click analytics; deployed on Render with a live demo."],
          ["2. The design decision", "What did you choose and why?", "Added an LRU cache (cache-aside) and a token-bucket rate limiter (5-request burst, 1 req/s per IP) to protect the DB; hit rate 85% on a replayed access log."],
          ["3. Quality / engineering", "Is it production-shaped?", "Secured with JWT auth and hashed passwords; 40 JUnit/MockMvc tests, Dockerised, CI on GitHub Actions."]
        ] } },
        { tip: "The title line should carry a clickable <b>Live</b> link and <b>GitHub</b> link. Test both from your phone. A dead link is worse than no link." }
      ] },
      { h: "The checklist (v3 on D14, final lock on D56)", blocks: [
        { ul: [
          "Exactly one page, PDF, file named <code>Firstname_Lastname_Resume.pdf</code>; plain-text test passed.",
          "Section order correct for a fresher; standard header names.",
          "Every bullet starts with an action verb and contains tech + impact; a number wherever honest.",
          "Zero claims you cannot defend for 5 minutes (see the Resume Grilling lesson).",
          "No typos: read it backwards line by line, run a spell-checker, get two humans to proofread.",
          "Consistent formatting: same date format, same bullet style, aligned dates, consistent tense (past for finished work).",
          "Links work: LinkedIn, GitHub, live demo — clicked from a phone.",
          "GitHub pinned repos = resume projects, each with a real README, clean commits, no secrets.",
          "LinkedIn headline, About, Projects and Skills mirror the resume.",
          "Final (D56): PDF on your phone and in email drafts, 5 printed copies."
        ] },
        { warn: "Do not keep editing after D56. Last-minute edits introduce typos and inconsistencies with the version companies already have." }
      ] }
    ],
    practice: [
      { q: "Rewrite this bullet: <i>\"Worked on a college event website using React and Node.\"</i> You know: 1,400 students registered through it, you built the registration API and the admin dashboard, and you cut registration time from paper forms (≈3 days of manual entry) to instant.",
        a: "\"Built the registration API (Node.js, Express, MongoDB) and admin dashboard (React) for the college tech fest; handled 1,400 sign-ups and replaced 3 days of manual data entry with instant online registration.\" — verb (Built), what (API + dashboard), tech, two honest numbers, and it says precisely which part <i>you</i> built." },
      { q: "Your Skills line reads: <i>Java, C, C++, Python, JavaScript, Go, Kotlin, React, Angular, Spring, Django, Docker, Kubernetes, AWS, MongoDB, MySQL</i>. You have used Go and Kubernetes once in a tutorial. What do you do?",
        a: "Cut to what you can defend for 5 minutes: e.g. <i>Languages: Java, SQL, Python · Frameworks: Spring Boot, React · Databases: MySQL, MongoDB · Tools: Git, Docker</i>. Remove Go, Kotlin, Kubernetes, Angular, Django unless you can survive a grilling. Sixteen shallow skills invite questions you will fail; six deep ones invite questions you will ace." },
      { q: "You paste your PDF into Notepad and the text reads: <i>\"Java Spring Boot B.Tech CSE Projects URL Shortener 2022–2026 PostgreSQL…\"</i> — skills and education are interleaved. What is wrong and how do you fix it?",
        a: "The template is two-column (sidebar), so the parser reads across both columns line by line. Move to a single-column layout with sections stacked vertically, then re-run the test until the text order matches the visual order." },
      { q: "Your resume is 1 page + 4 lines. List the cuts in the right order.",
        a: "(1) Delete objective, hobbies, declaration, photo/DOB if present. (2) Remove the weakest project or merge its bullets. (3) Trim bullets that wrap by 1–2 words. (4) Merge duplicate bullets. Only then (5) reduce margins (≥0.5 in) or font (≥10 pt). Shrinking fonts first hides the problem and hurts readability." },
      { q: "An interviewer says: \"You wrote '85% cache hit rate'. How did you measure it?\" Give a good answer.",
        a: "\"I added two counters to the cache wrapper — hits and misses — and exposed them on a stats endpoint. Then I replayed an access log of 50,000 redirects where a few popular links dominate, like real traffic. Hits divided by total was 0.85. With a uniform random workload it's much lower, around 30%, which is why I mention it was a skewed workload.\" — shows the method, the caveat, and honesty." }
    ],
    related: ["se:git-basics-commit-branch"]
  });

  /* ───────────────────────── RESUME GRILLING ───────────────────────── */
  add({
    id: "car-resume-grilling",
    subject: "career",
    title: "Resume interrogation drill: every line → 3 questions",
    minutes: 90,
    crux: [
      "For every line, write the 3 questions an interviewer would ask: <b>What</b> is it / <b>Why</b> this choice / <b>How deep</b> (internals, failure, scale).",
      "A technology survives only if you can talk for 5 minutes: <b>what it is, how you used it, one internal, one limitation, one alternative</b>.",
      "Anything that cannot survive is <b>removed or downgraded</b> (e.g. moved from a bullet to \"basic\" in Skills, or deleted).",
      "Every number will be challenged: know <b>how it was measured</b> and its caveat.",
      "Resume, GitHub and your spoken answers must tell the same story — interviewers cross-check.",
      "When you don't know: state the boundary honestly, then reason — never bluff."
    ],
    sections: [
      { h: "The drill (D57 morning, ~3 hours)", blocks: [
        { ol: [
          "Print the final resume. Number every line that carries content (skills group, each bullet, each achievement) — typically 20–30 lines.",
          "For each line, write 3 questions in the worksheet below — use the generator table in the next section.",
          "Answer each question <b>out loud</b> first, then write a 2–3 line answer. If you cannot answer, mark it red.",
          "For red items: re-learn it now (30 min cap each) or remove/downgrade the line.",
          "Finally pick the 5 most attackable lines and have a friend grill you on them for 5 minutes each."
        ] },
        { code: `Line # | Resume line                         | Q1 (what)                 | Q2 (why)                          | Q3 (how deep)                        | Ready?
-------+-------------------------------------+---------------------------+-----------------------------------+--------------------------------------+-------
7      | "...LRU cache ... 85% hit rate"     | What is LRU? How built?   | Why LRU and not LFU/TTL? Why not  | Thread safety? What happens with 2   | Y
       |                                     |                           | Redis?                            | app instances? How was 85% measured? |
12     | Skills: Docker                      | What is a container vs VM?| Why Docker for this project?      | Layers & caching? Multi-stage build? | N -> learn layers today
`, lang: "text", title: "Worksheet format" }
      ] },
      { h: "Question generators by line type", blocks: [
        { table: { head: ["Line type", "Q1 — What", "Q2 — Why", "Q3 — How deep"], rows: [
          ["Language (Java)", "Explain HashMap internals / equals–hashCode contract", "Why Java for this project?", "GC basics, String immutability, synchronized vs volatile, what changed in recent Java versions you used"],
          ["Framework (Spring Boot)", "What does Spring Boot add over Spring? What is dependency injection?", "Why Spring Boot over Node/Express?", "Bean lifecycle/scopes, how a request flows through DispatcherServlet → controller, how you handled exceptions globally"],
          ["Database (PostgreSQL)", "Show your schema. Which indexes?", "Why SQL over MongoDB here?", "Isolation level used, what happens on concurrent updates, how you'd find a slow query (EXPLAIN)"],
          ["Tool (Docker / Git)", "What is a container? What is a commit/branch?", "Why containerise?", "Image layers, multi-stage builds; merge vs rebase, resolving a conflict"],
          ["Bullet with a number", "What exactly did you build?", "Why that approach?", "How was the number measured? On what hardware/workload? What would change it?"],
          ["Auth (JWT)", "Walk me through login end to end", "Why JWT and not sessions?", "How do you log a user out / revoke? Where is the secret? What if the token is stolen?"],
          ["Achievement (rating/rank)", "What's your rating/rank?", "How did you prepare?", "Solve a problem at that rating now; explain a contest problem you're proud of"],
          ["Internship", "What did the team do; what did <i>you</i> ship?", "Why that design?", "Hardest bug, code review feedback you got, how you tested"],
          ["CS Fundamentals line", "Any core definition", "—", "Numericals: scheduling, paging, normalization, subnetting — expect at least one"]
        ] } },
        { tip: "Q3 is where interviews are decided. Most candidates can say what a technology is; far fewer can say what breaks it." }
      ] },
      { h: "Worked example: grilling four lines", blocks: [
        { h: "Line: \"Implemented stateless JWT authentication (HS256, 15-minute tokens)…\"" },
        { ul: [
          "<b>What:</b> \"On login the server checks the password hash, then issues a token: base64url(header).base64url(payload).signature, where the signature is HMAC-SHA256 of the first two parts with a server secret. The client sends it as <code>Authorization: Bearer …</code>; a filter verifies signature and expiry on every request.\"",
          "<b>Why:</b> \"Stateless — any app instance can verify it without a shared session store, which matters when I run more than one instance behind a load balancer.\"",
          "<b>Deep:</b> \"Revocation is the weakness: a stolen token is valid until it expires. That's why access tokens are short (15 min). For real logout you add a refresh token stored server-side that you can delete, or a deny-list of token ids in Redis. The secret comes from an environment variable, never the repo.\""
        ] },
        { h: "Line: \"…LRU cache… 85% hit rate\"" },
        { ul: [
          "<b>What:</b> \"LinkedHashMap with access order and removeEldestEntry, wrapped with synchronized methods; cache-aside: read cache, on miss read DB and populate.\"",
          "<b>Why LRU:</b> \"Link popularity is skewed and recent — recently used codes are likely to be used again. LFU would keep yesterday's viral link forever.\"",
          "<b>Deep:</b> \"With two instances each has its own cache, so a deleted link can still resolve on the other instance — that's the point where I'd move to Redis with explicit invalidation. Hit rate was measured with hit/miss counters on a replayed skewed log.\""
        ] },
        { h: "Line: \"Skills: Docker\"" },
        { ul: [
          "<b>What:</b> \"A container packages the app and its dependencies and runs as an isolated process sharing the host kernel; a VM virtualises hardware and runs its own kernel, so it's heavier.\"",
          "<b>Why:</b> \"Same image runs on my laptop and on Render; no 'works on my machine'.\"",
          "<b>Deep:</b> \"Each Dockerfile instruction creates a layer; I copy <code>pom.xml</code> and download dependencies before copying source, so code changes don't invalidate the dependency layer. Multi-stage build: JDK + Maven to build, a JRE-only image to run, so the final image is much smaller.\""
        ] },
        { h: "Line: \"LeetCode 600+ problems, rating 1,800\"" },
        { ul: [
          "<b>What/Why:</b> \"I solved by pattern — tracked topic and pattern for each problem and re-solved failures after 3, 10 and 30 days.\"",
          "<b>Deep:</b> expect \"solve one now\". Your DSA prep is the answer; the line only earns you the harder question."
        ] }
      ] },
      { h: "The 5-minute survival test and what to do with failures", blocks: [
        { table: { head: ["Minute", "You must be able to say…"], rows: [
          ["1", "What it is, in one clear sentence, and where you used it"],
          ["2", "How you used it — the concrete code/config you wrote"],
          ["3", "One internal: how it works underneath"],
          ["4", "One limitation or failure mode, and what you'd do about it"],
          ["5", "One alternative and why you did (or would) choose it instead"]
        ] } },
        { table: { head: ["Result", "Action"], rows: [
          ["Survives 5 minutes", "Keep it."],
          ["Survives 2–3 minutes", "Re-learn the internal and the limitation today, or mark it \"(basic)\" in Skills."],
          ["Can't explain it", "Delete it. An empty spot is better than a failed question."]
        ] } },
        { tip: "Safe way to hit a boundary: \"I used Redis only as a cache with GET/SET and TTL; I haven't configured persistence or clustering. My understanding is RDB takes snapshots and AOF logs every write — is that the direction you're asking about?\" Honest scope + reasoning scores; bluffing gets caught in the next follow-up." },
        { warn: "\"Which part did <i>you</i> write?\" is always asked for team projects. Be exact: \"I built the auth module and the caching layer; my teammate did the React frontend.\" Claiming solo credit for team work is a classic rejection reason." }
      ] }
    ],
    practice: [
      { q: "Write the 3 questions for this bullet: <i>\"Designed PostgreSQL schema with indexes on short_code and (url_id, clicked_at), cutting stats-query time from 900 ms to 12 ms on 1M rows.\"</i>",
        a: "Q1 (what): \"Show me the tables and the two indexes.\" Q2 (why): \"Why a composite index on (url_id, clicked_at) instead of two single-column indexes?\" — because the stats query filters by url_id and ranges/sorts by clicked_at; a composite with url_id first serves both (leftmost-prefix rule). Q3 (deep): \"What does the index cost you?\" — slower inserts on the high-write clicks table and extra storage; \"How did you get 900 → 12 ms?\" — EXPLAIN ANALYZE before/after on 1M seeded rows showing a sequential scan become an index scan." },
      { q: "You listed Kafka in Skills after watching one tutorial. The interviewer asks \"How do consumer groups work?\" What should you have done, and what do you say now?",
        a: "It should have been removed in the drill. Now: be honest and reason — \"I've only done a tutorial-level producer/consumer. My understanding is a topic is split into partitions, and within a consumer group each partition is read by exactly one consumer, so partitions cap the group's parallelism. I haven't run it in a project.\" Then remove it from the resume afterwards." },
      { q: "An interviewer says: \"Your GitHub shows one commit with 3,000 files, but your resume says you built this over four weeks.\" What went wrong and how do you prevent it?",
        a: "The story (four weeks of work) and the evidence (a single dump commit) conflict, which invites doubt about authorship. Prevent it by committing small, meaningful steps as you build (the project lessons ask for a commit after every feature). If it already happened, say so plainly: \"I developed locally and pushed late — the commit history doesn't reflect it; I can walk you through any part of the code.\"" }
    ],
    related: ["cn:cookies-sessions-tokens", "sd:cache-eviction-policies", "se:docker-basics", "dbms:composite-index", "oops:equals-hashcode"]
  });

  /* ───────────────────────── PROJECT: PLAN ───────────────────────── */
  add({
    id: "car-project-plan",
    subject: "career",
    title: "Project kickoff: requirements, schema, REST API, repo & first commits",
    minutes: 90,
    crux: [
      "Pick <b>one</b> project with a real design decision you can defend. Recommended: <b>URL shortener with analytics in Spring Boot</b> (bridges straight to HLD) or a <b>multithreaded HTTP server in plain Java</b>.",
      "Kickoff day output: <b>requirements</b> (functional, non-functional, out of scope) → <b>schema</b> → <b>API table</b> → <b>repo + README skeleton</b> → first commit.",
      "Scope an MVP you can finish in ~2 weeks of evenings; write stretch goals down but do not start them.",
      "Layered code: <b>Controller → Service → Repository</b>; DTOs at the edge; one JSON error format decided on Day 1.",
      "Constraints in the database, not only in code: <code>UNIQUE(short_code)</code> is what actually stops duplicates under concurrency.",
      "Commit small and often with meaningful messages — interviewers do open your commit history.",
      "Project 2 (D41) is a small systems project (2–3 days): your own thread pool on <code>BlockingQueue</code> or a key-value store with a write-ahead log."
    ],
    sections: [
      { h: "Choosing the project (D19)", blocks: [
        { p: "Interviewers do not reward the idea; they reward the <b>decisions</b> inside it. Choose a project where you will make at least one choice you can argue both ways (cache or not, SQL or NoSQL, sync or async, lock or constraint)." },
        { table: { head: ["Project", "Design decisions it forces", "Interview bridge", "Effort"], rows: [
          ["<b>URL shortener + analytics</b> (Spring Boot, PostgreSQL)", "Code generation (Base62 vs random), cache, rate limiting, 301 vs 302, analytics write volume", "HLD \"Design a URL shortener\", caching, DB indexing", "~2 weeks of evenings"],
          ["<b>Multithreaded HTTP server</b> (plain Java)", "Thread-per-connection vs pool, bounded queue, keep-alive, graceful shutdown, LRU for static files", "Every OS/concurrency question gets a real answer", "~2 weeks"],
          ["Booking backend", "Seat locking, idempotency, order state machine, transactions", "LLD BookMyShow, DBMS isolation", "~3 weeks"],
          ["Real-time chat", "WebSockets vs polling, presence, delivery receipts", "HLD chat design", "~3 weeks"]
        ] } },
        { tip: "If unsure, pick the URL shortener. It is small enough to finish, deployable on a free tier, and the HLD round on D45 will literally ask you to design it — you will be answering from experience." },
        { warn: "Avoid tutorial clones (to-do app, weather app, Netflix UI clone). If you follow a tutorial to learn the framework, change the problem and add one decision of your own." }
      ] },
      { h: "Requirements — write them before any code", blocks: [
        { p: "Write this in the README under <i>Requirements</i>. It keeps scope honest and becomes the first 2 minutes of your project explanation." },
        { table: { head: ["Type", "URL shortener (MVP)"], rows: [
          ["Functional", "Register/login; create a short link (optional custom alias, optional expiry); redirect <code>/{code}</code> → long URL; list my links; delete my link; per-link stats (clicks per day, last 7 days)"],
          ["Non-functional", "Redirect p95 &lt; 50 ms on a small instance; short codes unique; links never redirect to the wrong URL; abuse protection (rate limit); deployable with one command"],
          ["Out of scope (write it down!)", "Custom domains, QR codes, link editing, geo dashboards, multi-region"],
          ["Assumptions", "Reads ≫ writes (redirects are ~100× creations); a few links get most of the traffic"]
        ] } },
        { h: "Short-code generation — your first defendable decision" },
        { table: { head: ["Option", "How", "Pros", "Cons"], rows: [
          ["Counter + Base62", "Take the next value of a DB sequence, encode in base 62 (0-9, A-Z, a-z)", "No collisions, short codes, O(1)", "Sequential codes are guessable/enumerable"],
          ["Random 7 chars", "Pick 7 random Base62 chars, insert, retry on unique violation", "Not guessable", "Needs retry logic; collisions grow as the table fills"],
          ["Hash of URL (e.g. first 7 chars of an MD5 in Base62)", "Deterministic from the URL", "Same URL → same code", "Collisions must still be handled; one URL can't have two owners' links"]
        ] } },
        { p: "Capacity check: 7 Base62 characters give 62<sup>7</sup> = 3,521,614,606,208 ≈ 3.5 trillion codes — far more than a project will ever use. The code below encodes and decodes ids; run it and note that 62<sup>7</sup> − 1 is <code>zzzzzzz</code>." },
        { code: `public class Base62 {
    private static final String ALPHABET =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    static String encode(long id) {
        if (id == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(ALPHABET.charAt((int) (id % 62)));   // least-significant digit first
            id /= 62;
        }
        return sb.reverse().toString();
    }

    static long decode(String code) {
        long id = 0;
        for (char c : code.toCharArray()) id = id * 62 + ALPHABET.indexOf(c);
        return id;
    }

    public static void main(String[] args) {
        long[] ids = {1, 61, 62, 125, 3844, 1_000_000, 3_521_614_606_207L};
        for (long id : ids) {
            String code = encode(id);
            System.out.println(id + " -> " + code + " -> " + decode(code));
        }
    }
}`, lang: "java", title: "Base62 encode/decode" },
        { code: `1 -> 1 -> 1
61 -> z -> 61
62 -> 10 -> 62
125 -> 21 -> 125
3844 -> 100 -> 3844
1000000 -> 4C92 -> 1000000
3521614606207 -> zzzzzzz -> 3521614606207`, lang: "text", title: "Output" }
      ] },
      { h: "Schema — tables, constraints, and indexes you can justify", blocks: [
        { code: `-- PostgreSQL
CREATE TABLE users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,             -- BCrypt hash, never the password
  role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE urls (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  short_code  VARCHAR(16) NOT NULL UNIQUE,         -- UNIQUE also creates the lookup index
  long_url    TEXT        NOT NULL,
  owner_id    BIGINT      REFERENCES users(id),
  expires_at  TIMESTAMP,
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_urls_owner ON urls(owner_id);     -- "list my links"

CREATE TABLE clicks (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url_id      BIGINT    NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  referrer    VARCHAR(255)
);
CREATE INDEX idx_clicks_url_time ON clicks(url_id, clicked_at);   -- stats by link, by time

CREATE SEQUENCE url_code_seq START 100000;         -- feeds Base62 codes

-- the stats query the composite index serves
SELECT CAST(clicked_at AS DATE) AS day, COUNT(*) AS clicks
FROM clicks
WHERE url_id = 42 AND clicked_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY CAST(clicked_at AS DATE)
ORDER BY day;`, lang: "sql", title: "Schema (PostgreSQL)" },
        { table: { head: ["Index / constraint", "Query it serves", "Why"], rows: [
          ["<code>UNIQUE(short_code)</code>", "Every redirect: <code>WHERE short_code = ?</code>", "The hottest query; also guarantees no duplicate alias even if two requests race"],
          ["<code>idx_urls_owner</code>", "\"My links\" page", "Without it, a full scan of urls per dashboard load"],
          ["<code>idx_clicks_url_time (url_id, clicked_at)</code>", "Stats: one link, a time range", "Leftmost-prefix: filters on url_id, then range-scans clicked_at in order"],
          ["No index on <code>referrer</code>", "—", "Nothing filters on it; an index would only slow the high-volume click inserts"]
        ] } },
        { tip: "Say the trade-off unprompted: \"clicks is the write-heavy table, so I kept it to one composite index.\" That single sentence shows you understand that indexes cost writes." }
      ] },
      { h: "REST API design", blocks: [
        { table: { head: ["Method &amp; path", "Body / params", "Success", "Errors"], rows: [
          ["POST /api/v1/auth/register", "{email, password}", "201 Created", "400 invalid, 409 email exists"],
          ["POST /api/v1/auth/login", "{email, password}", "200 {accessToken}", "401 bad credentials"],
          ["POST /api/v1/urls", "{longUrl, customAlias?, expiresAt?}", "201 Created + <code>Location</code> header + {code, shortUrl}", "400 invalid URL, 401, 409 alias taken, 429"],
          ["GET /{code}", "—", "302 Found + <code>Location: longUrl</code>", "404 unknown, 410 Gone (expired)"],
          ["GET /api/v1/urls?page=0&amp;size=20", "—", "200 page of my links", "401"],
          ["GET /api/v1/urls/{code}/stats", "?days=7", "200 {total, perDay[]}", "401, 403 not owner, 404"],
          ["DELETE /api/v1/urls/{code}", "—", "204 No Content", "401, 403, 404"]
        ] } },
        { ul: [
          "Nouns in paths, verbs as HTTP methods; plural collections; version prefix <code>/api/v1</code>.",
          "<b>302 vs 301:</b> 301 (permanent) is cached by browsers, so repeat clicks never reach your server and are not counted. Use 302 when you need analytics.",
          "One error shape everywhere: <code>{\"code\": \"ALIAS_TAKEN\", \"message\": \"…\"}</code>.",
          "Paginate every list endpoint from day one."
        ] }
      ] },
      { h: "Code layout and core CRUD (D20)", blocks: [
        { code: `url-shortener/
├── src/main/java/com/yourname/shortener/
│   ├── controller/   UrlController, RedirectController, AuthController
│   ├── service/      UrlService, AuthService, CodeGenerator
│   ├── repository/   UrlRepository, ClickRepository, UserRepository
│   ├── model/        UrlEntity, ClickEntity, UserEntity
│   ├── dto/          CreateUrlRequest, UrlResponse, StatsResponse
│   ├── security/     JwtService, JwtAuthFilter, SecurityConfig
│   └── error/        ApiErrors (@RestControllerAdvice), custom exceptions
├── src/main/resources/application.properties
├── src/test/java/...
├── Dockerfile
├── .gitignore
└── README.md`, lang: "text", title: "Package layout (by layer)" },
        { p: "Each layer has one job. <b>Controller</b>: HTTP in/out, validation, status codes. <b>Service</b>: business rules and transactions. <b>Repository</b>: data access only. This is also your answer when the OOP round asks about Single Responsibility with \"your own project\"." },
        { code: `// Spring Boot 3 — needs spring-boot-starter-web, -data-jpa, -validation (shown as text: not standalone-compilable)

public record CreateUrlRequest(
        @NotBlank @URL String longUrl,              // @URL = org.hibernate.validator.constraints.URL
        @Size(max = 16) String customAlias) { }

public record UrlResponse(String code, String shortUrl, String longUrl) { }

@Entity @Table(name = "urls")
public class UrlEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Column(name = "short_code", nullable = false, unique = true) String shortCode;
    @Column(name = "long_url", nullable = false) String longUrl;
    // getters/setters omitted
}

public interface UrlRepository extends JpaRepository<UrlEntity, Long> {
    Optional<UrlEntity> findByShortCode(String shortCode);   // Spring derives the SQL from the name
}

@Service
public class UrlService {
    private final UrlRepository repo;
    private final CodeGenerator codes;                       // wraps Base62 + a DB sequence
    public UrlService(UrlRepository repo, CodeGenerator codes) { this.repo = repo; this.codes = codes; }

    @Transactional
    public UrlResponse create(CreateUrlRequest req) {
        String code = req.customAlias() != null ? req.customAlias() : codes.next();
        UrlEntity e = new UrlEntity(code, req.longUrl());
        try {
            repo.saveAndFlush(e);                            // UNIQUE(short_code) is the real guard
        } catch (DataIntegrityViolationException dup) {
            throw new AliasTakenException(code);             // mapped to 409 Conflict
        }
        return new UrlResponse(code, "https://sho.rt/" + code, req.longUrl());
    }

    public String resolve(String code) {
        return repo.findByShortCode(code)
                   .map(UrlEntity::getLongUrl)
                   .orElseThrow(() -> new UrlNotFoundException(code));   // mapped to 404
    }
}

@RestController
@RequestMapping("/api/v1/urls")
public class UrlController {
    private final UrlService service;
    public UrlController(UrlService service) { this.service = service; }   // constructor injection

    @PostMapping
    public ResponseEntity<UrlResponse> create(@Valid @RequestBody CreateUrlRequest req) {
        UrlResponse res = service.create(req);
        return ResponseEntity.created(URI.create("/api/v1/urls/" + res.code())).body(res);   // 201 + Location
    }
}

@RestController
public class RedirectController {
    private final UrlService service;
    public RedirectController(UrlService service) { this.service = service; }

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        return ResponseEntity.status(HttpStatus.FOUND)                            // 302
                             .location(URI.create(service.resolve(code))).build();
    }
}`, lang: "text", title: "Core CRUD path in Spring Boot (create + redirect)" },
        { warn: "Do not check \"does the alias exist?\" and then insert — two requests can both pass the check. Let the <code>UNIQUE</code> constraint decide and translate the violation into 409. This is exactly the race-condition question you will be asked later." }
      ] },
      { h: "Repo, README skeleton and commit hygiene", blocks: [
        { code: `# Sho.rt — URL shortener with click analytics

Live: https://your-app.onrender.com   ·   API docs: /swagger-ui.html

## Why
One paragraph: the problem and what this does.

## Features
- Short links with optional custom alias and expiry
- 302 redirects with per-day click stats
- JWT auth, per-IP rate limiting

## Architecture
(diagram image) + 5 lines: request path, cache, DB, where rate limiting happens

## Design decisions
- Base62 over a DB sequence (why) · 302 not 301 (why) · LRU cache-aside (why)

## Run locally
docker compose up        # or: ./mvnw spring-boot:run

## API
Table of endpoints (method, path, status codes)

## Tests
./mvnw test   — what is covered

## What I'd do next
Redis for shared cache, async click ingestion via a queue`, lang: "text", title: "README.md skeleton (write the headings on day 1, fill as you go)" },
        { ul: [
          "Day 1 commits: <code>chore: initialise Spring Boot project</code>, <code>docs: add README with requirements and API table</code>, <code>feat: add schema migration for users/urls/clicks</code>.",
          "Message style (Conventional Commits): <code>feat:</code>, <code>fix:</code>, <code>test:</code>, <code>refactor:</code>, <code>docs:</code>, <code>chore:</code> + an imperative summary under ~60 characters.",
          "One logical change per commit; commit at least once per work session.",
          "<code>.gitignore</code> from day 1: <code>target/</code>, <code>.idea/</code>, <code>*.iml</code>, <code>.env</code>.",
          "Secrets (DB password, JWT secret) only in environment variables — never in <code>application.properties</code> committed to Git. If one leaks, rotate it; deleting the commit is not enough because history keeps it."
        ] }
      ] },
      { h: "Project 2 kickoff (D41): a small systems project", blocks: [
        { p: "Project 2 is deliberately small (2–3 days) and deliberately <b>systems-flavoured</b>, so that concurrency and data-structure questions have a real answer. Two good options:" },
        { table: { head: ["Option", "MVP scope", "What it lets you talk about"], rows: [
          ["Thread pool on <code>BlockingQueue</code>", "Fixed workers, bounded queue, submit/reject, graceful shutdown, a benchmark vs <code>Executors.newFixedThreadPool</code>", "Producer–consumer, back-pressure, why bounded queues, interrupts, poison pills"],
          ["Key-value store with a write-ahead log", "GET/PUT/DELETE over a socket or CLI, every write appended + flushed to a log before applying, replay on start-up, optional TTL", "Durability, fsync cost, crash recovery, log compaction"]
        ] } },
        { code: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;

class SimpleThreadPool {
    private static final Runnable POISON = () -> { };   // tells a worker to exit
    private final BlockingQueue<Runnable> queue;
    private final List<Thread> workers = new ArrayList<>();
    private volatile boolean shutdown = false;

    SimpleThreadPool(int nThreads, int queueCapacity) {
        queue = new ArrayBlockingQueue<>(queueCapacity);   // bounded = back-pressure
        for (int i = 0; i < nThreads; i++) {
            Thread t = new Thread(this::workLoop, "worker-" + i);
            workers.add(t);
            t.start();
        }
    }

    private void workLoop() {
        try {
            while (true) {
                Runnable task = queue.take();               // blocks while the queue is empty
                if (task == POISON) return;
                try {
                    task.run();
                } catch (RuntimeException e) {              // one bad task must not kill the worker
                    System.err.println(Thread.currentThread().getName() + " task failed: " + e);
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /** Returns false when the queue is full (the caller decides: retry, drop, or run it itself). */
    boolean submit(Runnable task) {
        if (shutdown) throw new IllegalStateException("pool is shut down");
        return queue.offer(task);
    }

    /** Graceful shutdown: queued tasks finish first, because POISON is FIFO-behind them. */
    void shutdownAndWait() throws InterruptedException {
        shutdown = true;
        for (int i = 0; i < workers.size(); i++) queue.put(POISON);
        for (Thread t : workers) t.join();
    }
}

public class PoolDemo {
    public static void main(String[] args) throws InterruptedException {
        SimpleThreadPool pool = new SimpleThreadPool(4, 100);
        AtomicInteger done = new AtomicInteger();
        for (int i = 0; i < 20; i++) pool.submit(done::incrementAndGet);
        pool.shutdownAndWait();
        System.out.println("completed = " + done.get());
    }
}`, lang: "java", title: "Thread-pool core (prints completed = 20)" },
        { tip: "Stretch goals that interview well: a rejection policy (caller-runs), per-task timing metrics, and a JMH or simple timing comparison with the JDK pool. Put the numbers in the README and the resume bullet." }
      ] }
    ],
    practice: [
      { q: "Encode id 238,328 in Base62 using the alphabet <code>0-9A-Za-z</code>. (Hint: 62³ = 238,328.)",
        a: "238,328 = 1·62³ + 0·62² + 0·62 + 0, so the digits are 1,0,0,0 → <code>\"1000\"</code>. Check with the algorithm: 238328 % 62 = 0, /62 = 3844; 3844 % 62 = 0, /62 = 62; 62 % 62 = 0, /62 = 1; 1 % 62 = 1 → digits reversed: 1000." },
      { q: "Your stats page is slow. The query is <code>WHERE url_id = ? AND clicked_at &gt;= ?</code>. You have an index on <code>(clicked_at, url_id)</code>. Why is it not ideal and what do you change?",
        a: "With <code>clicked_at</code> first, the index is ordered by time across <i>all</i> links, so the range condition scans every link's clicks in that window and filters url_id afterwards. Put the equality column first: <code>(url_id, clicked_at)</code> — the engine jumps to one link and range-scans only its clicks in time order." },
      { q: "Should <code>GET /{code}</code> return 301 or 302 for your project? Justify.",
        a: "302. A 301 is permanent and browsers cache it, so repeat visits skip your server and your click analytics undercount. 301 is better only if you don't need analytics and want to minimise server load." },
      { q: "Write three good commit messages for: adding the redirect endpoint; fixing a bug where expired links still redirected; adding tests for the service.",
        a: "<code>feat: add GET /{code} redirect with 302</code> · <code>fix: return 410 for expired links instead of redirecting</code> · <code>test: cover UrlService create/resolve incl. alias conflict</code>. Imperative mood, type prefix, specific." },
      { q: "In the thread pool above, why is the queue bounded, and why does shutdown put one POISON per worker?",
        a: "Bounded: if producers outpace workers, an unbounded queue grows until memory runs out; a bounded one applies back-pressure (<code>offer</code> returns false, so the caller can retry, drop, or slow down). One POISON per worker: each worker exits after taking exactly one POISON; because the queue is FIFO the poisons sit behind all queued tasks, so every submitted task runs before the workers stop." }
    ],
    related: ["sd:design-url-shortener", "cn:rest-api", "cn:http-status-codes", "cn:http-methods", "dbms:composite-index", "dbms:what-is-index", "se:git-basics-commit-branch", "os:producer-consumer"]
  });

  /* ───────────────────────── PROJECT: BUILD ───────────────────────── */
  add({
    id: "car-project-build",
    subject: "career",
    title: "Project build: JWT auth, LRU cache, rate limiting, tests, Docker, deploy",
    minutes: 120,
    crux: [
      "Build order: <b>auth (D22) → cache + rate limit (D24) → tests, errors, Docker, deploy (D26)</b>; commit and update the README after each.",
      "<b>JWT</b> = <code>base64url(header).base64url(payload).signature</code>; HS256 signs the first two parts with a server secret. Verify signature <i>and</i> expiry on every request. It is signed, <b>not encrypted</b>.",
      "Passwords: store only a salted, slow hash (BCrypt via Spring Security). Secrets come from environment variables.",
      "<b>Cache-aside:</b> read cache → on miss read DB and populate → on delete/update invalidate. LRU = <code>LinkedHashMap(accessOrder=true)</code> + <code>removeEldestEntry</code>.",
      "<b>Token bucket</b> per client: capacity = burst, refill rate = sustained limit; over limit → <b>429</b> with <code>Retry-After</code>.",
      "Deployable = multi-stage Dockerfile + config from env vars + a live URL + a README architecture section with a diagram and design decisions."
    ],
    sections: [
      { h: "What you are building", blocks: [
        { svg: `<svg viewBox="0 0 720 250" width="720" class="dg">
  <rect class="box" x="10" y="105" width="100" height="40" rx="6"/>
  <text class="tx tx-b" x="60" y="125" text-anchor="middle" dominant-baseline="middle">Client</text>
  <text class="tx-m" x="60" y="160" text-anchor="middle">browser / curl</text>
  <rect class="box-w" x="140" y="95" width="130" height="60" rx="6"/>
  <text class="tx" x="205" y="115" text-anchor="middle" dominant-baseline="middle">Rate limiter</text>
  <text class="tx" x="205" y="137" text-anchor="middle" dominant-baseline="middle">JWT filter</text>
  <rect class="box-a" x="300" y="105" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="355" y="125" text-anchor="middle" dominant-baseline="middle">Controller</text>
  <rect class="box-a" x="440" y="105" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="495" y="125" text-anchor="middle" dominant-baseline="middle">Service</text>
  <rect class="box-g" x="590" y="30" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="650" y="50" text-anchor="middle" dominant-baseline="middle">LRU cache</text>
  <rect class="box" x="590" y="105" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="650" y="125" text-anchor="middle" dominant-baseline="middle">Repository</text>
  <rect class="box-p" x="590" y="185" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="650" y="205" text-anchor="middle" dominant-baseline="middle">PostgreSQL</text>
  <line class="ln" x1="110" y1="125" x2="138" y2="125" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="270" y1="125" x2="298" y2="125" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="410" y1="125" x2="438" y2="125" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="550" y1="115" x2="588" y2="58" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="550" y1="125" x2="588" y2="125" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="650" y1="145" x2="650" y2="183" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="530" y="80" text-anchor="middle">1. try cache</text>
  <text class="tx-s" x="530" y="160" text-anchor="middle">2. on miss</text>
  <line class="ln ln-d" x1="205" y1="155" x2="205" y2="185" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="205" y="202" text-anchor="middle">429 / 401 rejected early</text>
  <text class="tx-m" x="425" y="240" text-anchor="middle">Everything except PostgreSQL runs in one Docker container</text>
</svg>`, caption: "Request path of the finished Project 1. Cheap checks (rate limit, auth) run first; the service tries the cache before the database." },
        { table: { head: ["Day", "Feature", "Commit when…"], rows: [
          ["D22", "Register/login, password hashing, JWT filter, protected endpoints", "Unauthenticated POST /api/v1/urls returns 401; with a token returns 201"],
          ["D24", "LRU cache for redirects, token-bucket rate limiter, README architecture section", "Hit/miss counters visible; the 6th rapid request gets 429"],
          ["D26", "Tests, global error handler, Dockerfile, deploy", "<code>mvn test</code> green; live URL works from your phone"]
        ] } }
      ] },
      { h: "Authentication with JWT (D22)", blocks: [
        { ol: [
          "<b>Register:</b> client sends email + password → server stores <code>BCrypt(password)</code> (the hash includes a random salt) → 201.",
          "<b>Login:</b> server loads the user by email, checks <code>encoder.matches(raw, hash)</code>, then <b>issues a token</b> whose payload holds <code>sub</code> (user id), <code>exp</code> (expiry) and optionally a role.",
          "<b>Every request:</b> client sends <code>Authorization: Bearer &lt;token&gt;</code>. A filter recomputes the signature over <code>header.payload</code> with the server secret, compares it, checks <code>exp</code>, and puts the user into the security context.",
          "<b>No session store:</b> any instance holding the secret can verify the token — that is what \"stateless\" means and why it scales horizontally."
        ] },
        { p: "The whole idea fits in plain Java — no libraries. Building it once makes the interview explanation effortless:" },
        { code: `import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class MiniJwt {
    private static final Base64.Encoder B64 = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder B64D = Base64.getUrlDecoder();
    private final byte[] secret;

    MiniJwt(String secret) { this.secret = secret.getBytes(StandardCharsets.UTF_8); }

    private byte[] hmacSha256(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    static String b64(String json) { return B64.encodeToString(json.getBytes(StandardCharsets.UTF_8)); }

    String issue(String userId, long expEpochSec) throws Exception {
        String header  = b64("{\\"alg\\":\\"HS256\\",\\"typ\\":\\"JWT\\"}");
        String payload = b64("{\\"sub\\":\\"" + userId + "\\",\\"exp\\":" + expEpochSec + "}");
        String signingInput = header + "." + payload;
        return signingInput + "." + B64.encodeToString(hmacSha256(signingInput));
    }

    /** Returns the payload JSON if signature is valid and token not expired, else null. */
    String verify(String token, long nowEpochSec) throws Exception {
        String[] parts = token.split("[.]");
        if (parts.length != 3) return null;
        byte[] expected = hmacSha256(parts[0] + "." + parts[1]);
        byte[] given = B64D.decode(parts[2]);
        if (!MessageDigest.isEqual(expected, given)) return null;      // constant-time compare
        String payload = new String(B64D.decode(parts[1]), StandardCharsets.UTF_8);
        int from = payload.indexOf("\\"exp\\":") + 6;
        long exp = Long.parseLong(payload.substring(from, payload.indexOf('}', from)));
        return nowEpochSec < exp ? payload : null;
    }

    public static void main(String[] args) throws Exception {
        MiniJwt jwt = new MiniJwt("read-me-from-an-env-var-not-code!");
        long now = 1_700_000_000L;
        String token = jwt.issue("user42", now + 900);              // 15-minute access token
        System.out.println("valid    -> " + jwt.verify(token, now + 60));
        System.out.println("expired  -> " + jwt.verify(token, now + 901));

        // attacker edits the payload to become "admin" but cannot recompute the signature
        String[] p = token.split("[.]");
        String forged = p[0] + "." + b64("{\\"sub\\":\\"admin\\",\\"exp\\":" + (now + 900) + "}") + "." + p[2];
        System.out.println("tampered -> " + jwt.verify(forged, now + 60));
    }
}`, lang: "java", title: "JWT sign & verify with HMAC-SHA256 (JDK only)" },
        { code: `valid    -> {"sub":"user42","exp":1700000900}
expired  -> null
tampered -> null`, lang: "text", title: "Output" },
        { p: "In the real project use a library (jjwt or Spring Security's resource-server support) and wire it as a filter:" },
        { code: `// Spring Boot 3 / Spring Security 6 wiring (shown as text: needs spring-boot-starter-security)

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwt;                    // wraps the sign/verify logic shown above (or a library like jjwt)
    public JwtAuthFilter(JwtService jwt) { this.jwt = jwt; }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String userId = jwt.verifyAndGetSubject(header.substring(7));   // null if bad signature/expired
            if (userId != null) {
                var auth = new UsernamePasswordAuthenticationToken(userId, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);                     // unauthenticated requests are rejected later (401)
    }
}

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain api(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())                                   // stateless API, token not in a cookie
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a
                .requestMatchers("/api/v1/auth/**").permitAll()             // register + login
                .requestMatchers(HttpMethod.GET, "/{code}").permitAll()     // public redirects
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }   // salted, deliberately slow
}`, lang: "text", title: "Spring Security wiring" },
        { warn: "The payload is only base64url-<b>encoded</b> — anyone can decode and read it. Never put passwords or personal data in it. The signature prevents <i>modification</i>, not <i>reading</i>." },
        { warn: "Revocation is JWT's weak spot: a stolen token stays valid until <code>exp</code>. Keep access tokens short (≈15 min). For real logout add a server-side refresh token you can delete, or a deny-list of token ids in Redis." }
      ] },
      { h: "Caching with an in-memory LRU (D24)", blocks: [
        { p: "Redirects are read-heavy and skewed (a few codes get most traffic), so caching the <code>code → longUrl</code> mapping removes most database reads. The pattern is <b>cache-aside</b>: the application checks the cache, falls back to the DB on a miss, and fills the cache." },
        { code: `import java.util.LinkedHashMap;
import java.util.Map;

class LruCache<K, V> {
    private final int capacity;
    private final LinkedHashMap<K, V> map;
    private long hits, misses;

    LruCache(int capacity) {
        this.capacity = capacity;
        // accessOrder = true: every get() moves the entry to the tail (most recently used)
        this.map = new LinkedHashMap<>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > LruCache.this.capacity;      // evict the head (least recent)
            }
        };
    }

    synchronized V get(K key) {
        V v = map.get(key);
        if (v == null) misses++; else hits++;
        return v;
    }
    synchronized void put(K key, V value) { map.put(key, value); }
    synchronized void invalidate(K key) { map.remove(key); }
    synchronized double hitRate() { long t = hits + misses; return t == 0 ? 0 : (double) hits / t; }
    synchronized String keysLruToMru() { return map.keySet().toString(); }
}

public class CacheAsideDemo {
    static final Map<String, String> DB = Map.of(
        "aZ3", "https://example.com/a",
        "k9Q", "https://example.com/b",
        "p0L", "https://example.com/c");
    static final LruCache<String, String> CACHE = new LruCache<>(2);
    static int dbReads = 0;

    static String resolve(String code) {
        String url = CACHE.get(code);                 // 1. try the cache
        if (url == null) {
            url = DB.get(code);                       // 2. miss: read the database
            dbReads++;
            if (url != null) CACHE.put(code, url);    // 3. populate for next time
        }
        return url;
    }

    public static void main(String[] args) {
        String[] requests = {"aZ3", "aZ3", "k9Q", "aZ3", "p0L", "k9Q", "aZ3"};
        for (String c : requests) resolve(c);
        System.out.println("cache (LRU -> MRU): " + CACHE.keysLruToMru());
        System.out.println("db reads: " + dbReads + ", hit rate: " + CACHE.hitRate());
    }
}`, lang: "java", title: "LRU cache + cache-aside, with hit-rate counters" },
        { code: `cache (LRU -> MRU): [k9Q, aZ3]
db reads: 5, hit rate: 0.2857142857142857`, lang: "text", title: "Output" },
        { table: { head: ["Request", "Hit?", "Cache after (LRU → MRU)"], rows: [
          ["aZ3", "miss (DB 1)", "[aZ3]"],
          ["aZ3", "hit", "[aZ3]"],
          ["k9Q", "miss (DB 2)", "[aZ3, k9Q]"],
          ["aZ3", "hit", "[k9Q, aZ3]"],
          ["p0L", "miss (DB 3) → evict k9Q", "[aZ3, p0L]"],
          ["k9Q", "miss (DB 4) → evict aZ3", "[p0L, k9Q]"],
          ["aZ3", "miss (DB 5) → evict p0L", "[k9Q, aZ3]"]
        ] } },
        { p: "Hit rate 2/7 ≈ 0.29 here because capacity 2 is tiny and the access pattern cycles through 3 keys. Real traffic is skewed, which is why measured hit rates are usually far higher — measure yours on a realistic replay." },
        { ul: [
          "<b>Invalidate on delete/expiry:</b> <code>cache.invalidate(code)</code> in the same service method that deletes the row, otherwise a deleted link keeps redirecting.",
          "<b>Negative results:</b> don't cache \"not found\" forever, or a newly created alias stays 404. Either skip caching misses or give them a short TTL.",
          "<b>Multiple instances:</b> each app instance has its own in-memory cache, so invalidation on one does not reach the others. That is the point to move to <b>Redis</b> (shared cache, TTLs, eviction policies like <code>allkeys-lru</code>).",
          "Spring shortcut: <code>@Cacheable(\"urls\")</code> on <code>resolve</code> + <code>@CacheEvict</code> on delete, backed by Caffeine or Redis — but build the manual version once so you can explain it."
        ] }
      ] },
      { h: "Rate limiting with a token bucket (D24)", blocks: [
        { p: "A bucket holds up to <b>C</b> tokens and refills at <b>r</b> tokens/second. Each request takes one token; with no token the request is rejected. So a client can burst C requests, then sustain r per second." },
        { p: "<b>Worked numbers</b> (C = 5, r = 1/s): at t = 0 the bucket is full; 7 requests → 5 allowed, 2 rejected, 0 tokens left. At t = 2.5 s, 2.5 tokens have refilled → 3 requests → 2 allowed, 1 rejected (0.5 tokens left). A different IP has its own full bucket." },
        { code: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

class TokenBucket {
    private final double capacity;        // max burst
    private final double refillPerMs;     // steady rate
    private double tokens;
    private long lastRefillMs;

    TokenBucket(int capacity, double refillPerSecond, long nowMs) {
        this.capacity = capacity;
        this.refillPerMs = refillPerSecond / 1000.0;
        this.tokens = capacity;           // start full
        this.lastRefillMs = nowMs;
    }

    synchronized boolean tryConsume(long nowMs) {
        tokens = Math.min(capacity, tokens + (nowMs - lastRefillMs) * refillPerMs);
        lastRefillMs = nowMs;
        if (tokens >= 1) { tokens -= 1; return true; }
        return false;                     // caller responds 429 Too Many Requests
    }
}

public class RateLimitDemo {
    // one bucket per client key (user id or IP): 5-request burst, 1 request/second sustained
    static final Map<String, TokenBucket> BUCKETS = new ConcurrentHashMap<>();

    static boolean allow(String clientKey, long nowMs) {
        return BUCKETS.computeIfAbsent(clientKey, k -> new TokenBucket(5, 1.0, nowMs)).tryConsume(nowMs);
    }

    public static void main(String[] args) {
        StringBuilder out = new StringBuilder("t=0ms    : ");
        for (int i = 0; i < 7; i++) out.append(allow("ip-1", 0) ? "OK " : "429 ");
        out.append("\\nt=2500ms : ");
        for (int i = 0; i < 3; i++) out.append(allow("ip-1", 2500) ? "OK " : "429 ");
        out.append("\\nother ip : ").append(allow("ip-2", 2500) ? "OK" : "429");
        System.out.println(out);
    }
}`, lang: "java", title: "Token bucket per client key" },
        { code: `t=0ms    : OK OK OK OK OK 429 429
t=2500ms : OK OK 429
other ip : OK`, lang: "text", title: "Output" },
        { ul: [
          "Plug it in as the <b>first</b> servlet filter (before JWT) so abusive traffic is rejected cheaply: on reject, <code>response.setStatus(429)</code>, set <code>Retry-After</code>, and return without calling the chain.",
          "Key choice: user id for authenticated endpoints, client IP for public ones (<code>/{code}</code>, <code>/login</code> — the login limit also slows password guessing).",
          "Memory: one bucket per key forever is a leak — evict idle buckets (e.g. keep them in the LRU from the previous section).",
          "Multiple instances need a shared counter (Redis <code>INCR</code> + <code>EXPIRE</code>, or a Lua script for the token bucket)."
        ] },
        { tip: "Know one alternative: fixed window (simple, but allows 2× bursts at window edges), sliding window log (exact, memory-heavy), sliding window counter (good approximation). Token bucket is the usual default because it allows controlled bursts." }
      ] },
      { h: "Tests and error handling (D26)", blocks: [
        { table: { head: ["Level", "What it checks", "Tooling", "How many"], rows: [
          ["Unit", "Service rules: alias conflict, expiry, code generation", "JUnit 5 + Mockito (repository mocked)", "Most tests; milliseconds each"],
          ["Web slice", "Validation → 400, status codes, JSON error shape", "<code>@WebMvcTest</code> + MockMvc", "One or two per endpoint"],
          ["Integration", "Real SQL, constraints, migrations", "<code>@SpringBootTest</code> + Testcontainers PostgreSQL", "A handful of happy paths"]
        ] } },
        { code: `// JUnit 5 + Mockito + Spring test slices (shown as text: needs spring-boot-starter-test)

// 1) Unit test: service logic with the repository mocked — fast, no Spring context
@ExtendWith(MockitoExtension.class)
class UrlServiceTest {
    @Mock UrlRepository repo;
    @Mock CodeGenerator codes;
    @InjectMocks UrlService service;

    @Test
    void resolveUnknownCodeThrowsNotFound() {
        when(repo.findByShortCode("nope")).thenReturn(Optional.empty());
        assertThrows(UrlNotFoundException.class, () -> service.resolve("nope"));
    }
}

// 2) Web-slice test: controller + validation + error JSON, service mocked
@WebMvcTest(UrlController.class)
@AutoConfigureMockMvc(addFilters = false)          // skip security filters in this slice
class UrlControllerTest {
    @Autowired MockMvc mvc;
    @MockBean UrlService service;                  // @MockitoBean on Spring Boot 3.4+

    @Test
    void blankUrlIsRejectedWith400() throws Exception {
        mvc.perform(post("/api/v1/urls")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"longUrl\\": \\"\\"}"))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
    }
}

// 3) Global error handler: one JSON shape for every error
@RestControllerAdvice
public class ApiErrors {
    record ErrorBody(String code, String message) { }

    @ExceptionHandler(UrlNotFoundException.class)
    ResponseEntity<ErrorBody> notFound(UrlNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorBody("NOT_FOUND", e.getMessage()));
    }

    @ExceptionHandler(AliasTakenException.class)
    ResponseEntity<ErrorBody> taken(AliasTakenException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorBody("ALIAS_TAKEN", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorBody> invalid(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(new ErrorBody("VALIDATION_FAILED", msg));
    }
}`, lang: "text", title: "Test examples + one global error handler" },
        { ul: [
          "Validate input at the edge (<code>@Valid</code> on request DTOs) so bad data never reaches the service.",
          "Map exceptions to status codes in one <code>@RestControllerAdvice</code>: not found → 404, alias taken → 409, validation → 400, expired → 410, anything unexpected → 500 with a generic message (log the stack trace, don't return it).",
          "Test the unhappy paths first — they are where the bugs and the interview questions are."
        ] }
      ] },
      { h: "Dockerfile and deployment (D26)", blocks: [
        { code: `# ---- build stage: JDK + Maven ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline          # cached layer: only re-runs when pom.xml changes
COPY src ./src
RUN mvn -q package -DskipTests

# ---- run stage: JRE only, much smaller image ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`, lang: "text", title: "Dockerfile (multi-stage)" },
        { code: `server.port=\${PORT:8080}
spring.datasource.url=\${JDBC_DATABASE_URL}
spring.datasource.username=\${DB_USER}
spring.datasource.password=\${DB_PASSWORD}
app.jwt.secret=\${JWT_SECRET}
management.endpoints.web.exposure.include=health`, lang: "text", title: "application.properties — every secret from the environment" },
        { ol: [
          "Run locally: <code>docker build -t shortener .</code> then <code>docker run -p 8080:8080 -e JDBC_DATABASE_URL=… -e DB_USER=… -e DB_PASSWORD=… -e JWT_SECRET=… shortener</code>.",
          "Create a managed PostgreSQL on Render or Railway (free/trial tiers exist; check current limits).",
          "Create a web service from your GitHub repo; choose Docker as the runtime; add the environment variables in the dashboard.",
          "Set the health-check path to <code>/actuator/health</code> (needs <code>spring-boot-starter-actuator</code>).",
          "Deploy, then test from your phone: register, login, create a link, open it, see the stats.",
          "Put the live URL at the top of the README and on the resume."
        ] },
        { warn: "Managed Postgres dashboards usually show a URL like <code>postgres://user:pass@host:5432/db</code>. Spring needs <code>jdbc:postgresql://host:5432/db</code> with the user and password as separate properties — the most common first-deploy failure." },
        { tip: "Free tiers may sleep when idle, so the first request after a pause can take many seconds. Mention it in the README (\"first load may be slow — free tier\") and open the link a minute before an interview if you plan to demo it." }
      ] },
      { h: "README architecture section — and finishing Project 2 (D48)", blocks: [
        { code: `## Architecture

![architecture](docs/architecture.png)

Request path: Client -> rate-limit filter (token bucket, 5 burst / 1 per s per IP)
-> JWT filter -> controller -> service -> LRU cache (cache-aside) -> PostgreSQL.

### Design decisions
| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| Short codes | Base62 of a DB sequence | random 7 chars | no collisions, O(1); codes are guessable (acceptable here) |
| Redirect | 302 | 301 | 301 is cached by browsers, so clicks would not be counted |
| Cache | in-memory LRU | Redis | single instance today; Redis once there are 2+ instances |
| Auth | JWT (15 min) | server sessions | stateless, any instance can verify |

### Known limitations
- Cache and rate-limit state are per instance
- Click inserts are synchronous; at scale they would go through a queue`, lang: "text", title: "README — Architecture section" },
        { p: "<b>Project 2 completion checklist (D48):</b>" },
        { ul: [
          "README: what/why, how to run in one command, a benchmark table, design decisions, limitations.",
          "Tests: the core behaviour (e.g. all tasks run before shutdown; a full queue rejects; a replayed WAL restores state).",
          "Package: runnable jar (<code>java -jar</code>) or a Docker image; a live URL if it has an HTTP interface.",
          "Commit-history cleanup: rewrite only <b>unpushed</b> commits (squash \"wip\"/\"fix typo\" into meaningful ones); never force-push a shared branch. If it is already pushed, leave it and write better messages from now on.",
          "Resume v5: add Project 2 with 2 bullets, and pin the repo on GitHub."
        ] }
      ] }
    ],
    practice: [
      { q: "A user reports that after deleting a short link, it still redirects for a few minutes — but only sometimes. You run 2 instances behind a load balancer, each with its own in-memory LRU. Explain and fix.",
        a: "The delete request hit instance A, which removed the DB row and invalidated A's cache. Instance B still has the mapping cached, so requests routed to B keep redirecting until B evicts it. Fixes: move the cache to a shared Redis and delete the key on removal; or add a short TTL to local entries plus a pub/sub invalidation message; at minimum, re-check expiry/deletion flags on hit." },
      { q: "Token bucket with capacity 10 and refill 2 tokens/s. A client sends 10 requests at t = 0, then 5 requests at t = 1.5 s. How many of the second batch succeed?",
        a: "After the burst the bucket has 0 tokens. By t = 1.5 s it has refilled 1.5 × 2 = 3 tokens. So 3 of the 5 requests succeed and 2 get 429 (0 tokens left afterwards)." },
      { q: "An interviewer asks: \"Your JWT payload is visible to anyone — so what stops me from changing <code>sub</code> to admin?\"",
        a: "The signature. It is HMAC-SHA256 over <code>header.payload</code> with a secret only the server knows. If you change the payload, the signature no longer matches and verification fails (the <i>tampered</i> case in the code). You can read the token but you cannot forge a valid one without the secret — which is why the secret lives in an environment variable and must be long and random." },
      { q: "Why does the Dockerfile copy <code>pom.xml</code> and run <code>dependency:go-offline</code> before copying <code>src</code>?",
        a: "Docker caches each layer and rebuilds from the first changed instruction. Dependencies change rarely, source changes constantly. Copying pom.xml first means a code change only invalidates the layers from <code>COPY src</code> onward, so rebuilds skip re-downloading all dependencies — builds go from minutes to seconds." },
      { q: "Why is disabling CSRF protection acceptable in this API but dangerous in a cookie-based web app?",
        a: "CSRF works because the browser automatically attaches cookies to cross-site requests. This API reads the token from the <code>Authorization</code> header, which the browser never adds automatically, so a forged cross-site request carries no credentials. If you stored the JWT in a cookie, the browser would attach it and CSRF protection would be needed again." }
    ],
    related: ["cn:cookies-sessions-tokens", "cn:http-status-codes", "sd:rate-limiting-algorithms", "sd:design-rate-limiter", "sd:caching-strategies", "sd:cache-eviction-policies", "sd:design-lru-cache", "sd:redis-use-cases", "se:docker-basics", "se:unit-test-example", "se:mocking", "se:ci-cd-pipeline", "cn:symmetric-vs-asymmetric"]
  });

  /* ───────────────────────── PROJECT: DEEP PREP ───────────────────────── */
  add({
    id: "car-project-deep-prep",
    subject: "career",
    title: "Project deep-prep: 90-second pitch, architecture, scaling, bugs, races",
    minutes: 90,
    crux: [
      "<b>90-second pitch:</b> Problem (1 line) → What I built (1) → Stack + why (1) → One technical challenge and how I solved it (3–4) → Impact (1) → <b>stop</b> and let them ask.",
      "Redraw the architecture <b>from memory</b> in 2 minutes: boxes, arrows, the request path, the data store, where cache and auth sit.",
      "Scaling answer = a ladder driven by measurement: measure → vertical → stateless + load balancer → cache → read replicas → async writes (queue) → partition.",
      "Hardest-bug story: symptom → impact → hypotheses → evidence → root cause → fix → prevention. It is a STAR story with technical depth.",
      "Race-condition answers name the <b>check-then-act</b> and fix it with a DB constraint, an atomic/conditional UPDATE, a row lock, or optimistic versioning.",
      "\"What would you change?\" — one technical and one process change, each with a reason. Shows growth, not regret."
    ],
    sections: [
      { h: "The 90-second pitch (D48 night: record and time it)", blocks: [
        { table: { head: ["Part", "Length", "URL shortener example"], rows: [
          ["Problem", "1 line", "Long links are awkward to share and you can't tell whether anyone clicked them."],
          ["What I built", "1 line", "A URL shortener with click analytics: a Spring Boot REST API on PostgreSQL, deployed on Render."],
          ["Stack + why", "1 line", "Spring Boot for production-style Java with security and validation; PostgreSQL because I needed unique constraints and range queries for stats."],
          ["Challenge + solution", "3–4 lines", "Redirects are ~100× more frequent than creations and a few links take most traffic, so the DB kept doing the same lookup. I added a cache-aside LRU with hit/miss counters, invalidated on delete, and a per-IP token-bucket limiter. On a replayed skewed log the hit rate was 85% and median redirect latency dropped from 18 ms to 3 ms."],
          ["Impact", "1 line", "It's live, has 40 tests with CI, and our coding club uses it for event links."]
        ] } },
        { p: "Spoken at a calm pace (~130–150 words per minute) that is about 70–90 seconds. Then stop. Every sentence was chosen to invite a question you have prepared: <i>why 302?</i>, <i>why LRU?</i>, <i>how did you measure?</i>, <i>what about two instances?</i>" },
        { h: "Project 2 example (thread pool)" },
        { p: "\"I wanted to understand what <code>ExecutorService</code> actually does, so I built a fixed-size thread pool on a bounded <code>ArrayBlockingQueue</code>. Plain Java, no libraries. The interesting part was shutdown: I used one poison-pill task per worker so every queued task finishes before workers exit, and a bounded queue so a fast producer gets rejected instead of exhausting memory. I benchmarked it against the JDK pool on 100,000 small tasks and it was within 10%, and writing it is why I can explain producer-consumer and back-pressure concretely.\"" },
        { warn: "Numbers in these examples are illustrative. Use only your own measurements. The most common failure is a 6-minute ramble that never reaches the interesting part — time yourself with a stopwatch." }
      ] },
      { h: "Redraw the architecture from memory (D57)", blocks: [
        { ol: [
          "Blank paper, 2-minute timer. Draw client → entry point → layers → data stores. Label every arrow with what flows (HTTP + JWT, SQL, cache get/put).",
          "Mark where each cross-cutting concern lives: rate limiting, auth, validation, error handling, logging.",
          "Write the schema next to the DB box: tables, primary keys, the 2–3 indexes and the query each serves.",
          "Trace one request out loud (\"a GET /aZ3 arrives…\") from start to response, including the cache miss path.",
          "Compare with the README diagram. Anything you forgot is what you'll forget in the interview — redraw once more."
        ] },
        { tip: "In a virtual interview you'll draw in a shared doc or whiteboard tool. Practise the same diagram with plain text boxes (<code>[Client] --&gt; [Filter] --&gt; …</code>) so you're not fighting the tool." }
      ] },
      { h: "\"How would you scale this to 1M users?\" (D46, D57)", blocks: [
        { p: "Start with numbers, then climb the ladder only as far as the numbers require. Interviewers reward <i>reasoned</i> scaling, not a list of buzzwords." },
        { p: "<b>Estimate.</b> Assume 1M registered users, 10% daily active = 100k DAU, each creates 1 link/day → 100k writes/day ≈ 100,000 / 86,400 ≈ <b>1.2 writes/s</b>. Reads 100:1 → 10M redirects/day ≈ <b>116 reads/s</b> average, maybe ~1,000/s at peak. Storage: 100k links × ~500 B ≈ 50 MB/day ≈ 18 GB/year. Clicks: 10M rows/day × ~100 B ≈ 1 GB/day — <b>the click table, not the links, is the real scaling problem.</b>" },
        { table: { head: ["Step", "Trigger (measured)", "Change", "Trade-off"], rows: [
          ["0. Measure", "Always first", "p95 latency, CPU, DB connection usage, slow-query log", "—"],
          ["1. Vertical", "CPU or memory bound on one box", "Bigger instance, tune connection pool and JVM heap", "Cheap and fast, but has a ceiling and is a single point of failure"],
          ["2. Stateless + LB", "One instance can't keep up / need availability", "N app instances behind a load balancer; JWT is already stateless; move cache and rate-limit state to Redis", "Need shared state (Redis) and health checks"],
          ["3. Cache harder", "DB read load on redirects", "Redis for hot codes; long TTLs (mappings rarely change)", "Invalidation on delete must reach Redis"],
          ["4. Read replicas", "Stats queries compete with redirects", "Serve stats from a replica; writes to the primary", "Replication lag: stats may be seconds behind"],
          ["5. Async writes", "Click inserts dominate write load", "Publish click events to a queue (e.g. Kafka); a consumer batch-inserts or keeps per-day counters", "Stats become eventually consistent; need idempotent consumers"],
          ["6. Partition", "Single DB too big/hot", "Partition clicks by time (monthly tables); shard urls by hash(short_code)", "Cross-shard queries get harder; resharding is painful"],
          ["7. ID generation", "One sequence is a bottleneck / single point", "Each instance leases a block of ids (e.g. 1,000 at a time) and encodes locally", "Gaps in the sequence (harmless)"]
        ] } },
        { tip: "Close with: \"I'd do steps 0–3 first; that probably handles 1M users. Steps 5–6 are for when clicks outgrow a single database.\" Knowing where to <i>stop</i> is the senior signal." }
      ] },
      { h: "The hardest-bug story", blocks: [
        { table: { head: ["Beat", "What to say", "Example (use your own real bug)"], rows: [
          ["Symptom", "What was observed", "After deploying analytics, redirects intermittently took 30 s and then failed with 500."],
          ["Impact", "Why it mattered", "Only under load — a load test at 20 concurrent users made 30% of requests fail."],
          ["Hypotheses", "2–3 candidates you considered", "Slow DB query? Free-tier CPU? Cache not working?"],
          ["Evidence", "How you narrowed it", "DB queries were fast in EXPLAIN; logs showed HikariCP \"Connection is not available, request timed out after 30000ms\"; a thread dump showed 10 threads holding connections while waiting on an HTTP call."],
          ["Root cause", "The actual mechanism", "The click-recording method was <code>@Transactional</code> and called a slow external geo-IP API inside the transaction, so each request held one of only 10 pooled connections for ~2 s."],
          ["Fix", "What you changed", "Moved the external call outside the transaction, added a 500 ms timeout, and recorded clicks asynchronously."],
          ["Prevention / learning", "What changed in how you work", "Never do network I/O inside a DB transaction; I now run a small load test before each deploy."]
        ] } },
        { tip: "Good bug stories involve concurrency, caching, configuration, or resource exhaustion — they show debugging method. \"I had a typo\" or \"a missing semicolon\" does not." }
      ] },
      { h: "The race-condition question", blocks: [
        { p: "Typical forms: <i>\"What if two users pick the same custom alias at the same time?\"</i>, <i>\"What if two people book the last seat?\"</i>, <i>\"Can your click counter lose updates?\"</i> They all hide a <b>check-then-act</b> or <b>read-modify-write</b> sequence that two threads/transactions can interleave." },
        { code: `import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

public class LostUpdateDemo {
    static long unsafeClicks = 0;                          // read-modify-write, not atomic
    static final AtomicLong safeClicks = new AtomicLong(); // single atomic CAS increment

    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(8);
        for (int i = 0; i < 100_000; i++) {
            pool.execute(() -> {
                unsafeClicks++;                 // = read, add 1, write back: two threads can read the same value
                safeClicks.incrementAndGet();
            });
        }
        pool.shutdown();
        pool.awaitTermination(1, TimeUnit.MINUTES);
        System.out.println("expected 100000");
        System.out.println("unsafe   " + unsafeClicks + "   (usually less: lost updates)");
        System.out.println("atomic   " + safeClicks.get());
    }
}`, lang: "java", title: "Lost update: counter++ is read-modify-write" },
        { code: `expected 100000
unsafe   99603   (usually less: lost updates)
atomic   100000`, lang: "text", title: "One run (the unsafe number varies run to run)" },
        { p: "The same bug exists in the database if Java reads a value, changes it, and writes it back. Fix it where the data lives:" },
        { code: `-- 1. Duplicate alias: let a constraint decide (already in the schema)
--    short_code VARCHAR(16) NOT NULL UNIQUE  -> second insert fails -> map to 409 Conflict

-- 2. Counter: atomic update, no read in Java
UPDATE urls SET click_count = click_count + 1 WHERE id = 42;

-- 3. Last seat / limited stock: conditional update, then check rows affected
UPDATE shows SET seats_left = seats_left - 1
WHERE id = 7 AND seats_left > 0;          -- 1 row = you got it, 0 rows = sold out

-- 4. Must read, decide, then write: pessimistic row lock
BEGIN;
SELECT seats_left FROM shows WHERE id = 7 FOR UPDATE;   -- others wait on this row
UPDATE shows SET seats_left = seats_left - 1 WHERE id = 7;
COMMIT;

-- 5. Optimistic locking with a version column (JPA @Version does this)
UPDATE urls SET long_url = 'https://new.example', version = version + 1
WHERE id = 42 AND version = 3;            -- 0 rows = someone changed it first -> retry or 409`, lang: "sql", title: "Database-level fixes" },
        { table: { head: ["Fix", "Use when", "Cost"], rows: [
          ["Unique constraint", "Preventing duplicates", "Almost free; handle the exception"],
          ["Atomic / conditional UPDATE", "Counters, stock, seats", "Single statement; the best default"],
          ["SELECT … FOR UPDATE", "Complex decision needs the current value", "Blocks other writers; keep transactions short; deadlock risk if lock order differs"],
          ["Optimistic version", "Conflicts are rare (edits of one record)", "Retries on conflict"],
          ["Java <code>synchronized</code>/locks", "In-memory state only (cache, rate limiter)", "Does not work across multiple instances"]
        ] } },
        { tip: "Point out design choices that avoid races entirely: \"I insert one row per click instead of incrementing a counter, so concurrent clicks never contend — the stats query aggregates.\"" }
      ] },
      { h: "The other questions your project will attract", blocks: [
        { table: { head: ["Question", "Answer shape"], rows: [
          ["Why X over Y? (Spring vs Node, SQL vs NoSQL)", "Requirement → property of X that meets it → what Y would have cost. \"Relational data + unique constraints + range queries → PostgreSQL. Mongo could work but I'd be re-implementing uniqueness and joins.\""],
          ["Show me the schema. Which indexes?", "Tables + keys; each index paired with the query it serves; one index you deliberately did <i>not</i> add and why."],
          ["How does auth work end to end?", "Register (hash) → login (verify, issue JWT) → each request (filter verifies signature + exp) → limitation (revocation) and mitigation."],
          ["What would you do differently?", "One technical (\"async click ingestion from day one; I'd use Flyway migrations instead of auto-DDL\") + one process (\"write tests alongside features, not at the end\"), each with the reason."],
          ["Which part did you write?", "Exact modules. \"All of it\" only if true."],
          ["Is it deployed? Can I see it?", "Live URL ready; open it a minute before the interview if the host sleeps."]
        ] } }
      ] }
    ],
    practice: [
      { q: "Time yourself: deliver the 90-second pitch for your Project 1. What are the three most common reasons it runs over?",
        a: "(1) Starting with history (\"in my third semester I wanted to learn…\") instead of the problem. (2) Listing every feature instead of one challenge. (3) Explaining the stack in detail before the interviewer asks. Fix: keep the five-part script, one challenge only, and stop after the impact line." },
      { q: "Estimate: 5M users, 5% daily active, each creates 2 links/day and each link gets 20 clicks on average. Writes/s and reads/s on average?",
        a: "DAU = 250,000. Links/day = 500,000 → 500,000 / 86,400 ≈ 5.8 writes/s. Clicks/day = 500,000 × 20 = 10,000,000 → ≈ 116 reads/s average (plan for ~5–10× at peak, so ~600–1,200/s)." },
      { q: "Two users submit custom alias \"fest\" at the same instant. Your code does <code>if (!repo.existsByShortCode(alias)) repo.save(...)</code>. What happens and what is the fix?",
        a: "Both requests can run <code>exists</code> before either inserts; both see false, both try to save. Without a unique constraint you get two rows with the same alias (redirect becomes ambiguous); with the constraint one insert fails with an uncaught exception → 500. Fix: keep the <code>UNIQUE</code> constraint as the source of truth, drop the pre-check (or keep it only for a friendly early message), and catch <code>DataIntegrityViolationException</code> → 409 Conflict." },
      { q: "Why doesn't adding <code>synchronized</code> to the service method fix the duplicate-alias race in production?",
        a: "<code>synchronized</code> only serialises threads inside one JVM. With two app instances behind a load balancer, the two requests can land on different JVMs and still interleave at the database. The guarantee has to live in the shared resource — the DB constraint or a DB/Redis lock." }
    ],
    related: ["sd:design-url-shortener", "sd:horizontal-vs-vertical-scaling", "sd:back-of-envelope-estimation", "sd:database-replication", "sd:message-queues-pub-sub", "sd:database-sharding", "os:race-condition", "dbms:optimistic-vs-pessimistic", "dbms:concurrency-problems", "dbms:locking-shared-exclusive"]
  });

  /* ───────────────────────── MOCK OA ───────────────────────── */
  add({
    id: "car-mock-oa",
    subject: "career",
    title: "Mock OAs: timed contest conditions + the 60-minute post-mortem",
    minutes: 45,
    crux: [
      "Contest conditions: one sitting, timer on, <b>no editorials, no Google, no AI</b>, submit on a real judge.",
      "<b>Minutes 0–3: read all problems</b>, rank by (expected time ÷ confidence), solve the surest first. Never start with problem 1 by default.",
      "Read constraints before designing: they tell you the intended complexity (n ≤ 20 → exponential, n ≤ 10⁵ → n log n).",
      "Time-box: a problem eating &gt; 35% of total time with no working solution → submit what you have (brute force earns partial credit) and move on.",
      "Post-mortem (60 min): classify every miss — (a) pattern unknown, (b) implementation wrong, (c) misread, (d) too slow, (e) careless — and write one <b>specific</b> fix for each.",
      "Compare the error tally week to week. A repeating category is the thing to fix next week, not \"do more problems\"."
    ],
    sections: [
      { h: "The 8 mock OAs in the plan", blocks: [
        { table: { head: ["#", "Day", "Format", "Flavour / special rule"], rows: [
          ["1", "D7", "90 min, 3 problems (1E + 2M)", "Arrays/strings/hashing/two-pointer/window/prefix"],
          ["2", "D14", "90 min, 3 problems (2M + 1H)", "Compare error categories with D7 — is the same failure repeating?"],
          ["3", "D21", "90 min, 3 problems (2M + 1H)", "Stack / heap / greedy"],
          ["4", "D28", "90 min, 3 problems", "Tree / BST / heap"],
          ["5", "D35", "90 min, 3 problems", "Graph-heavy"],
          ["6", "D42", "90 min, 3 problems", "DP-heavy"],
          ["7", "D49", "120 min, 4 problems", "Full company-style set"],
          ["8", "D53", "90 min", "Exact company conditions: webcam on, no other tabs, platform IDE"]
        ] } },
        { ul: [
          "<b>LeetCode virtual contest:</b> past weekly/biweekly contests are 4 problems in 90 minutes with the real scoreboard. For a 3-problem set, attempt problems 1–3; for D49 do all 4 in 120 min.",
          "<b>Codeforces virtual participation</b> (Div. 3 / Div. 4): contest clock and standings replayed; good for implementation speed.",
          "<b>Topic-flavoured sets</b> (D21–D42): pick 3 unseen problems of the right difficulty from the day's topic list on LeetCode and put a 90-minute timer on. Unseen matters more than source.",
          "<b>Company-style (D49, D53):</b> HackerRank / HackerEarth-style environment — plain editor, stdin/stdout, hidden test cases, no autocomplete."
        ] }
      ] },
      { h: "Time plan and constraint reading", blocks: [
        { svg: `<svg viewBox="0 0 720 150" width="720" class="dg">
  <rect class="box" x="20" y="50" width="23" height="44" rx="3"/>
  <rect class="box-g" x="43" y="50" width="113" height="44" rx="3"/>
  <rect class="box-a" x="156" y="50" width="227" height="44" rx="3"/>
  <rect class="box-a" x="383" y="50" width="241" height="44" rx="3"/>
  <rect class="box-w" x="624" y="50" width="76" height="44" rx="3"/>
  <text class="tx-s" x="31" y="36" text-anchor="middle">read all</text>
  <line class="ln" x1="31" y1="40" x2="31" y2="48"/>
  <text class="tx tx-b" x="99" y="72" text-anchor="middle" dominant-baseline="middle">Easy</text>
  <text class="tx tx-b" x="269" y="72" text-anchor="middle" dominant-baseline="middle">Medium 1</text>
  <text class="tx tx-b" x="503" y="72" text-anchor="middle" dominant-baseline="middle">Medium 2</text>
  <text class="tx tx-b" x="662" y="72" text-anchor="middle" dominant-baseline="middle">Test</text>
  <text class="tx-m" x="20" y="112" text-anchor="middle">0</text>
  <text class="tx-m" x="43" y="126" text-anchor="middle">3</text>
  <text class="tx-m" x="156" y="112" text-anchor="middle">18</text>
  <text class="tx-m" x="383" y="112" text-anchor="middle">48</text>
  <text class="tx-m" x="624" y="112" text-anchor="middle">80</text>
  <text class="tx-m" x="700" y="112" text-anchor="middle">90 min</text>
  <text class="tx-s" x="360" y="143" text-anchor="middle">Time-box: stop any single problem at ~31 min (35% of 90) if nothing passes</text>
</svg>`, caption: "A 90-minute, 3-problem OA (1E + 2M). Budget the surest problem first and keep the last 10 minutes for re-testing and re-submitting." },
        { table: { head: ["OA", "Read &amp; rank", "Problem budgets", "Final check", "35% time-box"], rows: [
          ["90 min, 3 problems", "3 min", "E ≈ 15, M ≈ 30, M/H ≈ 30–32", "~10 min", "≈ 31 min"],
          ["120 min, 4 problems", "4 min", "E ≈ 15, M ≈ 25, M ≈ 30, H ≈ 35", "~10 min", "≈ 42 min"]
        ] } },
        { table: { head: ["Constraint on n", "Intended complexity (roughly ≤ 10⁸ simple operations)", "Typical technique"], rows: [
          ["n ≤ 10–11", "O(n!)", "Permutations / brute force"],
          ["n ≤ 20–25", "O(2ⁿ) or O(2ⁿ·n)", "Bitmask, subsets, meet-in-the-middle"],
          ["n ≤ 500", "O(n³)", "Interval DP, Floyd-Warshall"],
          ["n ≤ 5·10³", "O(n²)", "2-D DP, all pairs"],
          ["n ≤ 10⁵ – 10⁶", "O(n log n) or O(n)", "Sorting, heap, binary search, two pointers, prefix sums"],
          ["n ≤ 10¹²", "O(√n)", "Divisor enumeration"],
          ["n ≤ 10¹⁸", "O(log n) or O(1)", "Maths, binary search on answer, fast power"]
        ] } }
      ] },
      { h: "Execution protocol during the OA", blocks: [
        { ol: [
          "Read all problems; for each, jot the likely pattern and a confidence (high/medium/low).",
          "Start with the highest confidence ÷ time. A fully-passing easy beats a half-passing hard.",
          "Before coding: paraphrase the problem in one sentence, re-read the constraints, hand-run the first sample.",
          "Stuck after ~10 minutes on the approach? Write the brute force — partial tests score, and it often reveals the pattern.",
          "Test before submitting: samples, empty/single element, all-same, max size, negatives, overflow.",
          "Hit the time-box → submit what passes, move on, come back only with spare time.",
          "Last 5–10 minutes: re-submit everything, confirm it's saved, check output format."
        ] },
        { table: { head: ["Java trap in OAs", "Fix"], rows: [
          ["<code>a * b</code> overflows before assignment to long", "<code>(long) a * b</code>; use <code>long</code> for sums"],
          ["<code>Scanner</code> TLE on 10⁵+ tokens", "BufferedReader + StringTokenizer, StringBuilder for output"],
          ["<code>Arrays.sort(int[])</code> hit by an anti-quicksort test", "Shuffle first or sort <code>Integer[]</code>"],
          ["Recursion depth 10⁵ → StackOverflowError", "Iterative version or explicit stack"],
          ["Static arrays/maps not reset between test cases", "Reset inside <code>solve()</code>"],
          ["Extra spaces / missing newline in output", "Match the I/O spec exactly"]
        ] } }
      ] },
      { h: "The 60-minute post-mortem", blocks: [
        { p: "The mock OA is only the measurement. The <b>post-mortem</b> is where the improvement happens. For every problem not solved cleanly (including \"solved but took too long\"), assign one primary category:" },
        { table: { head: ["Category", "Looks like", "Specific fix"], rows: [
          ["(a) Pattern unknown", "No idea for 15+ min; the editorial uses a technique you haven't learned", "Learn the pattern (theory + 3 problems) this week; add to the Weakness sheet if it repeats"],
          ["(b) Knew it, implemented wrong", "Right idea, wrong answer / runtime error you couldn't find", "Re-code from a blank file; stress-test against brute force; drill the template 3×"],
          ["(c) Misread statement / constraints", "Solved a different problem; missed \"distinct\", 1-indexed, modulo", "One-sentence paraphrase + constraint re-read before coding, every time"],
          ["(d) Too slow / ran out of time", "Would have solved with 15 more minutes", "Timed sets twice a week; templates to muscle memory; obey the time-box earlier"],
          ["(e) Careless bug", "Overflow, off-by-one, forgot reset, output format", "Add the exact bug to a personal pre-submit checklist"]
        ] } },
        { p: "D7's four causes map onto these: <i>didn't know pattern</i> = (a), <i>knew pattern but bugged</i> = (b)/(e), <i>misread constraints</i> = (c), <i>ran out of time</i> = (d)." },
        { code: `MOCK OA #2 — D14 — LeetCode virtual contest — 90 min
Score: 2/3  (P1 ✓ 11 min · P2 ✓ 34 min, 1 WA · P3 ✗ 9/40 tests)

Problem | Result   | Time | Cat | Root cause (one line)                       | Fix action                          | Redo on
P3      | ✗        | 38m  | (a) | didn't see monotonic deque for window max   | learn + 3 problems on D17           | D17, D24, D44
P2      | ✓ (1 WA) | 34m  | (e) | int overflow in running sum                 | add "long for sums?" to checklist   | —
P2      | slow     |      | (d) | 12 min choosing between two approaches      | decide in ≤5 min, commit, iterate   | —

Tally so far:  (a) 3  (b) 1  (c) 1  (d) 2  (e) 2     ← D7 had (e) 2 as well: careless bugs repeating
This week's one change: run the pre-submit checklist before every submit.`, lang: "text", title: "Post-mortem worksheet (example)" },
        { p: "Every miss goes onto the <b>Redo List</b> with re-solve dates at <b>+3, +10 and +30 days</b>, from a blank file. Solved unaided at +10 and +30 → retire it. Failed twice → Weakness sheet and a dedicated relearn." }
      ] },
      { h: "Stress testing: finding the bug in (b) fast", blocks: [
        { p: "When a solution fails hidden tests and you can't see why, compare it against an obviously-correct brute force on thousands of small random inputs. The first mismatch is a tiny failing case you can debug by hand. Build this during the post-mortem, not the OA (unless you have lots of spare time)." },
        { code: `import java.util.Arrays;
import java.util.Random;

public class StressTest {
    // the "clever" solution you submitted (Kadane)
    static long fast(int[] a) {
        long best = a[0], cur = a[0];
        for (int i = 1; i < a.length; i++) {
            cur = Math.max(a[i], cur + a[i]);
            best = Math.max(best, cur);
        }
        return best;
    }

    // an obviously-correct brute force: try every subarray, O(n^2)
    static long brute(int[] a) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i < a.length; i++) {
            long sum = 0;
            for (int j = i; j < a.length; j++) {
                sum += a[j];
                best = Math.max(best, sum);
            }
        }
        return best;
    }

    public static void main(String[] args) {
        Random rnd = new Random(42);                  // fixed seed = reproducible failures
        for (int test = 1; test <= 1000; test++) {
            int n = 1 + rnd.nextInt(8);               // SMALL inputs: easy to read when it fails
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd.nextInt(21) - 10;   // values in [-10, 10]
            long f = fast(a), b = brute(a);
            if (f != b) {
                System.out.println("MISMATCH on " + Arrays.toString(a) + " fast=" + f + " brute=" + b);
                return;
            }
        }
        System.out.println("all 1000 random tests passed");
    }
}`, lang: "java", title: "Brute force vs optimised on random small inputs" },
        { code: `all 1000 random tests passed`, lang: "text", title: "Output" },
        { tip: "Keep inputs small (n ≤ 8, values in a small range). Bugs almost always show up on small cases, and a small failing case is readable. A fixed seed makes the failure reproducible." }
      ] },
      { h: "D53: exact company conditions", blocks: [
        { ul: [
          "Webcam on, one browser tab (the platform), phone out of reach, notifications off — the way proctoring will be.",
          "Use the platform's editor (no autocomplete, no local IDE) — you must be fluent without it.",
          "Read input from stdin and print to stdout yourself; hidden tests, no expected output shown.",
          "Do the MCQ section fast (CS fundamentals, aptitude, output prediction) and bank time for coding; don't leave blanks unless there is negative marking."
        ] },
        { warn: "Proctoring flags (tab switches, another face, looking away for long, copy-paste from outside) are automatic rejections at several companies. Practise clean habits now so they are automatic on the real day." }
      ] }
    ],
    practice: [
      { q: "A problem says n ≤ 2·10⁵ and your idea is O(n²). Should you code it?",
        a: "Not as the final answer: (2·10⁵)² = 4·10¹⁰ operations — far beyond ~10⁸/second. The intended solution is O(n log n) or O(n). But if you have no better idea after ~10 minutes, code the O(n²) anyway to collect the partial test cases (small n), then keep thinking." },
      { q: "In a 120-minute, 4-problem OA you've spent 45 minutes on problem 3 with 0 tests passing. What do you do?",
        a: "You've passed the 35% time-box (42 minutes). Submit a brute force if you can write one in a few minutes (partial credit), otherwise stop, move to problem 4, and come back to 3 only if time remains. Sunk cost is not a reason to continue." },
      { q: "Classify: you knew it was binary search on the answer, but your <code>feasible()</code> loop used <code>int</code> and summed values up to 10⁹ × 10⁵.",
        a: "(e) careless — or (b) if it happens repeatedly. The pattern was known; the bug is overflow (sum can reach 10¹⁴, far above ~2.1·10⁹). Fix: <code>long</code> for any sum or product; add \"sums in long?\" to the pre-submit checklist." },
      { q: "Your tally after D7 and D14 is: (a) 1, (b) 1, (c) 4, (d) 1, (e) 1. What is next week's single change?",
        a: "Misreading (c) dominates. The change: before any code, write a one-sentence paraphrase of the problem, list the constraints and the output format, and hand-run sample 1. It costs ~2 minutes per problem and removes the dominant error." }
    ],
    related: []
  });

  /* ───────────────────────── MOCK INTERVIEW ───────────────────────── */
  add({
    id: "car-mock-interview",
    subject: "career",
    title: "Mock interviews: think aloud, record yourself, run peer mocks",
    minutes: 60,
    crux: [
      "The interview scores <b>solving out loud with someone watching</b> — a separate skill from solving. Practise it on purpose, from D14.",
      "The 8 steps: <b>clarify → examples → brute force → optimise → complexity → code → dry run → edge cases</b>. Get a nod before coding.",
      "45-minute budget: ~7 min clarify + approach, ~20 min code, ~8 min dry run + edge cases, the rest for follow-ups and your questions.",
      "No silence longer than ~20 seconds: narrate your <i>reasoning</i> (\"I'm considering a heap because…\"), not your keystrokes.",
      "Record every self-mock and <b>watch it</b>: count filler words, silent gaps &gt; 20 s, and whether you dry-ran. Score the 8-dimension rubric.",
      "Peer mocks: interviewer gives no help for the first 10 minutes and asks \"why?\" at least 3 times; feedback is written, on a fixed form.",
      "After each mock: list every stumble, fix the <b>top 3</b> the same day — re-solve, re-learn, re-say."
    ],
    sections: [
      { h: "The 8-step framework", blocks: [
        { table: { head: ["Step", "What you do", "What you say (example)"], rows: [
          ["1. Clarify", "2–3 questions: input size and type, duplicates, negatives, empty input, sorted?, output format, in-place allowed?", "\"Can the string contain any ASCII character or only lowercase? And for an empty string I return 0?\""],
          ["2. Examples", "Write one normal and one edge example; compute expected output by hand", "\"For 'abcabcbb' the answer is 3 — 'abc'. For 'bbbb' it's 1.\""],
          ["3. Brute force", "State it with its complexity — even if you already see better", "\"Brute force: check every substring for uniqueness — O(n³), or O(n²) with a set.\""],
          ["4. Optimise", "Name the repeated work and the tool that removes it", "\"When I extend by one character I re-check the whole substring. A sliding window with last-seen positions avoids that.\""],
          ["5. Complexity", "Time and space, before coding; ask to proceed", "\"That's O(n) time, O(k) space for the map. Shall I code it?\""],
          ["6. Code", "Clean names, helper functions, narrate intent", "\"windowStart jumps past the previous occurrence, but only forward…\""],
          ["7. Dry run", "Trace an example line by line with variable values", "\"end=3, c='a', prev=0 ≥ start 0, so start=1, length 3…\""],
          ["8. Edge cases", "Empty, single, all same, duplicates, overflow; fix; restate complexity", "\"Empty string: loop doesn't run, returns 0. 'abba' — start must not move backwards; the prev ≥ windowStart check handles it.\""]
        ] } },
        { svg: `<svg viewBox="0 0 720 140" width="720" class="dg">
  <rect class="box" x="20" y="45" width="45" height="44" rx="3"/>
  <rect class="box-w" x="65" y="45" width="106" height="44" rx="3"/>
  <rect class="box-a" x="171" y="45" width="302" height="44" rx="3"/>
  <rect class="box-g" x="473" y="45" width="121" height="44" rx="3"/>
  <rect class="box-p" x="594" y="45" width="106" height="44" rx="3"/>
  <text class="tx-s" x="42" y="67" text-anchor="middle" dominant-baseline="middle">intro</text>
  <text class="tx tx-b" x="118" y="60" text-anchor="middle" dominant-baseline="middle">Clarify</text>
  <text class="tx-s" x="118" y="77" text-anchor="middle" dominant-baseline="middle">+ approach</text>
  <text class="tx tx-b" x="322" y="67" text-anchor="middle" dominant-baseline="middle">Code (narrated)</text>
  <text class="tx tx-b" x="533" y="60" text-anchor="middle" dominant-baseline="middle">Dry run</text>
  <text class="tx-s" x="533" y="77" text-anchor="middle" dominant-baseline="middle">edge cases</text>
  <text class="tx tx-b" x="647" y="60" text-anchor="middle" dominant-baseline="middle">Follow-ups</text>
  <text class="tx-s" x="647" y="77" text-anchor="middle" dominant-baseline="middle">your questions</text>
  <text class="tx-m" x="20" y="108" text-anchor="middle">0</text>
  <text class="tx-m" x="65" y="108" text-anchor="middle">3</text>
  <text class="tx-m" x="171" y="108" text-anchor="middle">10</text>
  <text class="tx-m" x="473" y="108" text-anchor="middle">30</text>
  <text class="tx-m" x="594" y="108" text-anchor="middle">38</text>
  <text class="tx-m" x="700" y="108" text-anchor="middle">45 min</text>
  <text class="tx-s" x="360" y="30" text-anchor="middle">One medium problem in a 45-minute round</text>
</svg>`, caption: "Where the time goes in a 45-minute coding round. If coding runs long, cut the follow-up time — never the dry run." },
        { warn: "Jumping straight to the optimal solution without stating brute force hides your reasoning. Coding before clarifying is a scored negative at most companies — even when you guess the problem right." }
      ] },
      { h: "Worked example: one round, spoken", blocks: [
        { code: `Interviewer: Given a string, find the length of the longest substring without repeating characters.

You: Let me restate: contiguous substring, all characters distinct, return its length. A few questions —
     can it be empty? Any character set? ... OK: empty returns 0, any ASCII.
     Examples: "abcabcbb" -> 3 ("abc"), "bbbbb" -> 1, "pwwkew" -> 3 ("wke", not "pwke" — that's a subsequence).
You: Brute force: every start i, extend j while a set has no duplicate — O(n^2) time, O(k) space.
     The waste: when I hit a duplicate I restart from i+1 and re-add characters I already know are unique.
     Better: a sliding window [windowStart, end]. I store each character's last index. When s[end] was
     seen inside the window, windowStart jumps to lastIndex + 1. Each index is visited once: O(n) time,
     O(k) space where k is the alphabet size. Shall I code that?
Interviewer: Go ahead.
You: (codes, narrating) ... the check prev >= windowStart matters: in "abba", when the second 'a' arrives
     its old index 0 is already outside the window, so the start must not move backwards to 1.
You: Dry run "abba": end0 a -> len1; end1 b -> len2; end2 b prev1 -> start2, len1; end3 a prev0 < 2 -> stays,
     len2. Answer 2. Correct.
     Edge cases: "" -> loop skipped, 0. One char -> 1. All same -> 1. Time O(n), space O(k).
Interviewer: What if the input is a stream too large for memory?
You: The window only needs the last-seen map and two counters, so I can process characters one at a time —
     memory stays O(k); I just can't return the substring itself unless I store its start index.`, lang: "text", title: "Condensed transcript" },
        { code: `import java.util.HashMap;
import java.util.Map;

public class LongestUniqueSubstring {
    // Sliding window: [windowStart, end] never contains a repeated character.
    // Time O(n), space O(min(n, alphabet)).
    static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int best = 0, windowStart = 0;
        for (int end = 0; end < s.length(); end++) {
            char c = s.charAt(end);
            Integer prev = lastSeen.get(c);
            if (prev != null && prev >= windowStart) windowStart = prev + 1;  // jump past the duplicate
            lastSeen.put(c, end);
            best = Math.max(best, end - windowStart + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        String[] tests = {"abcabcbb", "bbbbb", "pwwkew", "", "abba"};
        for (String t : tests) System.out.println("'" + t + "' -> " + lengthOfLongestSubstring(t));
    }
}`, lang: "java", title: "The code you'd write" },
        { code: `'abcabcbb' -> 3
'bbbbb' -> 1
'pwwkew' -> 3
'' -> 0
'abba' -> 2`, lang: "text", title: "Output" }
      ] },
      { h: "Phrases that help — and what to avoid", blocks: [
        { table: { head: ["Situation", "Say", "Avoid"], rows: [
          ["Need time to think", "\"Let me think for a moment — I'll talk through what I'm considering.\"", "Two minutes of silence"],
          ["No idea yet", "\"I don't see the optimal yet. Let me start from brute force and look for repeated work.\"", "\"I haven't seen this problem.\""],
          ["Got a hint", "\"That helps — if I keep a heap of size k, then each insert is log k, so…\"", "\"Yes, I was going to do that.\""],
          ["Found your own bug", "\"This breaks for duplicates because… let me fix that line.\"", "Silently rewriting everything"],
          ["Disagree with a suggestion", "\"I considered that; my concern is X. Would you like me to go that way?\"", "Arguing twice"],
          ["Finished coding", "\"Before I call it done, let me dry-run and check edge cases.\"", "\"Done.\""],
          ["Complexity", "\"O(n) time: each index enters and leaves the window once. O(k) space for the map.\"", "\"It's O(n) I think.\""],
          ["Unknown theory question", "\"I'm not certain. My understanding is…, and I'd verify by…\"", "Bluffing a definition"]
        ] } },
        { tip: "Recovery is scored. \"That approach fails when the array has negatives, because the window sum isn't monotonic — let me switch to prefix sums with a hashmap\" is a strong moment, not a weak one." }
      ] },
      { h: "Self-mocks and daily speaking practice (D7, D14, D15 onward)", blocks: [
        { ol: [
          "Pick an unseen medium. Set a 40-minute timer. Record screen + voice (OBS, or phone on a stand + screen recorder). Camera on your face if you can — it recreates the pressure.",
          "Solve as if an interviewer were there: all 8 steps, out loud, continuously.",
          "Watch the whole recording the same day (1.25× is fine). Fill the metrics below.",
          "Pick <b>one</b> behaviour to fix in the next session."
        ] },
        { table: { head: ["Metric (per self-mock)", "How to count", "Target"], rows: [
          ["Filler words (um, basically, like, so…)", "Tally for any 5-minute stretch", "Falling week to week"],
          ["Silent gaps &gt; 20 s", "Count them", "0–1"],
          ["Clarifying questions before coding", "Count", "≥ 2"],
          ["Brute force stated with complexity", "Yes/No", "Yes"],
          ["Complexity stated unprompted", "Yes/No", "Yes"],
          ["Dry run done before \"done\"", "Yes/No", "Yes"],
          ["Edge cases checked unprompted", "Count", "≥ 2"]
        ] } },
        { p: "<b>D15 onward:</b> one problem a day solved out loud on camera for 10 minutes — short, daily reps beat occasional long ones. <b>D7 evening:</b> explain each pattern in 2 minutes on camera using the same shape every time: <i>what it is → the signals that it applies → the template → one example → the classic bug.</i>" },
        { h: "The rubric (score every mock 1–5)" },
        { table: { head: ["Dimension", "What a 5 looks like"], rows: [
          ["Clarifying questions", "Asks about input size, types, duplicates, edge cases before coding"],
          ["Approach articulation", "States brute force, then optimises, and explains why the optimisation works"],
          ["Communication", "Continuous, no silent gaps &gt; 20 s, thinks aloud without rambling"],
          ["Code quality", "Meaningful names, no magic numbers, helpers where useful, compiles first try"],
          ["Complexity analysis", "Correct time and space, stated without being asked"],
          ["Testing / dry run", "Walks through an example line by line, checks edge cases unprompted"],
          ["Handling hints", "Takes a hint gracefully and builds on it"],
          ["Follow-up handling", "Answers \"what if it doesn't fit in memory / is streaming / is sorted?\""]
        ] } },
        { p: "A score below 3 on any dimension twice in a row becomes the focus of next week's evening blocks." }
      ] },
      { h: "Peer and platform mocks (D21, D28, D35)", blocks: [
        { ul: [
          "<b>Peer mock (highest value):</b> 45 minutes each way, one unseen medium each. The interviewer picks the problem in advance and has read the solution.",
          "<b>Interviewer rules:</b> no help for the first 10 minutes; ask \"why?\" at least three times; ask one follow-up (\"what if the input is sorted / streaming / huge?\"); keep time; take notes with timestamps.",
          "<b>Platform mock:</b> free-tier peer-matching platforms (e.g. Pramp-style or interviewing.io-style sites — check what is currently free) give you the <i>stranger</i> factor. Do at least 3 before D53.",
          "<b>Recorded technical (D35):</b> 45 minutes, one graph medium/hard, spoken end to end — watch it back with the rubric."
        ] },
        { code: `MOCK #2 FEEDBACK   Candidate: ______   Interviewer: ______   Date: ___   Problem: ____________

Score 1-5 and write ONE piece of evidence (what was said/done, with a timestamp) for each:
Communication ............ _  evidence: ______________________________________
Approach articulation .... _  evidence: ______________________________________
Code quality ............. _  evidence: ______________________________________
Complexity analysis ...... _  evidence: ______________________________________
Edge cases ............... _  evidence: ______________________________________
Dry run .................. _  evidence: ______________________________________

Would you move this candidate to the next round?  Yes / Lean yes / Lean no / No
One thing to KEEP doing: ___________________________________________________
One thing to CHANGE next time: _____________________________________________`, lang: "text", title: "Written peer-mock feedback form" },
        { tip: "Feedback without evidence (\"communication was fine\") is useless. \"At 14:20 you went silent for 90 seconds while choosing between BFS and DFS\" is actionable." }
      ] },
      { h: "Mock types across the plan, full loops, and feedback processing", blocks: [
        { table: { head: ["Mock", "Day", "Type", "How to run it"], rows: [
          ["#1", "D14", "Self-mock, recorded", "2 mediums, speak continuously, watch back"],
          ["#2", "D21", "Peer", "45 min each way, written feedback form"],
          ["#3", "D28", "Technical (peer/platform)", "1 tree problem + 5 OOP/OS questions"],
          ["#4", "D35", "Technical, recorded", "1 graph medium/hard end to end"],
          ["#5", "D42", "LLD", "\"Design a parking lot\": 5 min requirements, 5 min core classes/diagram, 20 min deep dive (key classes, patterns, code), 10 min trade-offs/extensions"],
          ["#6", "D49", "Behavioural", "TMAY + 6 STAR + your questions (see Behavioural lesson)"],
          ["#7–8", "D53", "Full loop R1 + R2", "2 problems; then 1 hard + 10 CS rapid-fire (OS/DBMS/CN/OOP), back to back"],
          ["#9", "D56", "Design (LLD or HLD)", "Pick by your target companies; then a 45-min mixed technical"],
          ["#10–11", "D58 AM", "Full loop", "45-min hard DSA + 45-min medium with deep follow-ups, 10-minute break only"],
          ["#12–13", "D58 PM", "CS + project, then HR", "45-min CS fundamentals + project deep dive; 30-min behavioural"]
        ] } },
        { ul: [
          "<b>CS rapid-fire:</b> answer each in 60–90 s as <i>definition → example → one nuance</i> (\"a deadlock needs four conditions… e.g. two threads locking A then B in opposite orders… prevent it by a global lock order\").",
          "<b>Back-to-back rounds:</b> in the 10-minute break stand up, drink water, and do not replay the last round. Start the next round fresh with the same framework.",
          "<b>Feedback processing (D53 and D58 evenings):</b> write every stumble, tag it <i>knowledge / approach / communication / code</i>, then fix the top 3 tonight: <b>re-solve</b> the problem from a blank file, <b>re-learn</b> the concept you fumbled, and <b>re-say</b> the answer you gave badly — recorded, until it's clean."
        ] }
      ] }
    ],
    practice: [
      { q: "You've been silent for 40 seconds thinking about whether a problem needs DP or greedy. What should you have said?",
        a: "Narrate the decision: \"I'm deciding between greedy and DP. Greedy would take the largest coin first, but with coins {1, 3, 4} and amount 6 greedy gives 4+1+1 = 3 coins while 3+3 = 2 coins — so greedy fails and I'll use DP over amounts.\" The interviewer sees your reasoning and can nudge you if you're heading the wrong way." },
      { q: "Your self-mock recording shows: 3 clarifying questions, brute force stated, 4 silent gaps over 20 s during coding, no dry run. What is next session's single focus and how do you practise it?",
        a: "Dry run first (it's a correctness risk and a scored behaviour). Practise: after every problem, before running the code, trace one example out loud with variable values. Secondary: during coding narrate intent at each block (\"now the shrink step\"), which removes most silent gaps." },
      { q: "The interviewer says: \"Can you do it without the extra hashmap?\" You don't know. Respond.",
        a: "\"Let me think about what the map gives us — last-seen positions. If the alphabet is small and fixed, I can use an int[128] array instead: still O(1) lookups, and space is a constant 128 regardless of n. If you mean truly O(1) extra space with no array at all, I'd fall back to checking the window for duplicates, which is O(n·k) — shall I go with the array?\" You reason from what the structure provides and offer trade-offs instead of freezing." },
      { q: "Fill the feedback form line for this observation: the candidate coded a correct BFS in 15 minutes but never stated complexity until asked at the end.",
        a: "\"Complexity analysis: 2 — evidence: at 31:00, after coding, asked 'what's the complexity?' and answered O(V+E) correctly but only when prompted; space not mentioned. Change: state time and space right after describing the approach, before coding.\"" }
    ],
    related: []
  });

  /* ───────────────────────── BEHAVIOURAL ───────────────────────── */
  add({
    id: "car-behavioural",
    subject: "career",
    title: "Behavioural & HR: STAR, TMAY, the 8-story bank, Amazon LPs",
    minutes: 120,
    crux: [
      "<b>STAR:</b> Situation (1–2 sentences) → Task (your responsibility) → <b>Action (~60%, \"I\" not \"we\")</b> → Result (quantified + what you learned). 90–120 seconds.",
      "Build <b>8 stories</b> once and remap them to any question: technical challenge, led something, conflict, failure, deadline crunch, learned fast, hard feedback, helped someone.",
      "<b>Tell me about yourself</b> (60–90 s): Present → Journey (+1 proof point) → Highlight → Future (why this role). No life story.",
      "Weakness = real + the concrete system you use to manage it. Never badmouth anyone. Never give a hypothetical when asked for a real example.",
      "Amazon scores every round against <b>16 Leadership Principles</b>; map ≥ 2 stories to the core ones and expect 3 layers of \"dive deep\" follow-ups.",
      "Rehearse from keyword cards, not scripts — natural, not recited. Always have 2–3 questions for them."
    ],
    sections: [
      { h: "STAR — structure and a full example", blocks: [
        { table: { head: ["Part", "Share", "Purpose"], rows: [
          ["Situation", "~10%", "Just enough context to follow: where, when, what was at stake"],
          ["Task", "~10%", "What <i>you</i> were responsible for"],
          ["Action", "~60%", "What <i>you</i> did, step by step, and why — decisions, not activity"],
          ["Result", "~20%", "Outcome with a number if possible + what you learned / would repeat"]
        ] } },
        { p: "<b>Question:</b> \"Tell me about a conflict with a teammate.\"" },
        { ul: [
          "<b>S:</b> \"In our four-person final-year project — an attendance app — two weeks before the mid-term demo, a teammate and I disagreed: he wanted to keep adding features, I wanted to freeze and fix the Android build that kept crashing.\"",
          "<b>T:</b> \"I owned the backend and the demo integration, so a crash during the demo was my problem too.\"",
          "<b>A:</b> \"Instead of arguing in the group chat, I asked him for a 20-minute call. I brought data from our test log — 7 crashes in the last 20 runs. He explained the professor had specifically asked for a reports screen, which I hadn't known. So we split it: I'd spend two days fixing the crash, he'd build a minimal reports screen, and we'd freeze features three days before the demo. I wrote a checklist of the demo flow and we ran it together every evening.\"",
          "<b>R:</b> \"The demo ran three times without a crash, the reports screen was shown, and we got the top grade in the batch for that review. I learned to bring evidence to a disagreement and to ask what requirement sits behind the other person's position.\""
        ] },
        { p: "That's ~170 words — about 75–90 seconds spoken. Notice: \"I\" for actions, a number in the Situation and in the Result, no blame, and a learning at the end." },
        { warn: "Classic failures: \"we\" throughout (the interviewer can't tell what <i>you</i> did); no result; a 4-minute Situation; a story where you were simply right and the other person wrong; a hypothetical (\"I would…\") when they asked \"tell me about a time\"." }
      ] },
      { h: "Tell me about yourself", blocks: [
        { table: { head: ["Part", "Length", "Content"], rows: [
          ["Present", "1–2 sentences", "Who you are now: year, branch, focus area"],
          ["Journey", "2 sentences", "What got you into software + one concrete proof point"],
          ["Highlight", "2–3 sentences", "Your best project or achievement with one line of technical detail and a number"],
          ["Future", "1–2 sentences", "What you want next and why this role / company"]
        ] } },
        { p: "<b>Example (≈ 80 seconds):</b> \"I'm Aarav, a final-year Computer Science student at XYZ Institute, focused on backend engineering in Java. I got into software in my second year when I automated our hostel's mess-feedback forms with a small Spring app — about 300 students used it, and I enjoyed that more than any assignment. Since then I've gone deep on two things: problem solving — 600-plus problems and a 1,800 rating on LeetCode — and building backend systems. My best project is a URL shortener with analytics in Spring Boot and PostgreSQL, with an LRU cache and a rate limiter I wrote myself; it's deployed and our coding club uses it. Last summer I interned at ABC, where I moved eight reporting pages to a REST API and cut load time from about four seconds to one. I'm looking for a backend-leaning SDE role, and [company]'s work on [specific product/engineering problem] is exactly the kind of scale I want to learn from.\"" },
        { ul: [
          "Leave out: hometown, family, school history, hobbies (unless asked), your entire resume in order.",
          "End on the future — it hands the interviewer an easy next question (\"why us?\") you have prepared.",
          "Rehearse 10 times (D57) from a 4-keyword card: <i>backend-Java · hostel app · shortener · why-you</i>. Record the 1st and the 10th — the 10th should sound like conversation."
        ] }
      ] },
      { h: "The 8-story bank", blocks: [
        { table: { head: ["#", "Story", "Answers questions like", "Amazon LPs it can cover"], rows: [
          ["1", "A technical challenge you solved", "Biggest challenge · hardest bug · a time you went deep", "Dive Deep, Invent and Simplify, Insist on the Highest Standards"],
          ["2", "A time you led something", "Leadership · ownership · influence without authority", "Ownership, Think Big, Hire and Develop the Best"],
          ["3", "A conflict with a teammate", "Conflict · disagreement · difficult person", "Have Backbone; Disagree and Commit, Earn Trust"],
          ["4", "A failure / mistake", "Failure · missed deadline · what went wrong", "Earn Trust, Learn and Be Curious, Are Right, A Lot"],
          ["5", "A deadline crunch / prioritisation call", "Conflicting priorities · pressure · tight deadline", "Deliver Results, Bias for Action, Frugality"],
          ["6", "Something you learned fast on your own", "Learn quickly · ambiguity · new technology", "Learn and Be Curious, Bias for Action"],
          ["7", "A time you received hard feedback", "Criticism · feedback · changed your approach", "Earn Trust, Insist on the Highest Standards"],
          ["8", "A time you helped someone else succeed", "Helped a teammate · went beyond · mentoring", "Hire and Develop the Best, Strive to be Earth's Best Employer"]
        ] } },
        { p: "Sources: projects, internships, hackathons, club work, lab/team assignments, part-time work, teaching juniors. Make sure at least two stories involve a real <b>user</b> of something you built (for Customer Obsession) and at least one involves a decision with incomplete information (Bias for Action / Are Right, A Lot)." },
        { code: `STORY 3 — Conflict with teammate
Hook (one line):  Demo crash vs new feature, 2 weeks before mid-term review
S:  4-person final-year project, attendance app; teammate wants features, I want to freeze & fix crash
T:  I own backend + demo integration
A:  - asked for a 20-min call instead of arguing in chat
    - brought data: 7 crashes in last 20 test runs
    - learned the professor had asked for reports -> proposed split + feature freeze 3 days before
    - wrote demo checklist; ran it with him every evening
R:  3 clean demo runs, reports shown, top grade in the batch for that review
    Learning: bring evidence; ask what requirement sits behind the other position
LPs: Have Backbone; Disagree and Commit · Earn Trust · Deliver Results
Follow-ups ready:  What data? | What did you give up? | What would you change? | How is the relationship now?`, lang: "text", title: "Story card (one per story, keywords not full sentences)" }
      ] },
      { h: "Common HR questions with model answers", blocks: [
        { table: { head: ["Question", "Model answer / shape"], rows: [
          ["Why this company?", "Two specific, researched sentences: a product or engineering fact + how it connects to your evidence + what you want to learn. \"Your payments systems have to be correct under huge concurrency — that's the problem I enjoyed most in my project's rate limiter and race-condition fixes, and I want to learn how it's done at your scale.\" Never \"great culture\"."],
          ["Why software engineering?", "A concrete moment (the first thing you built that people used) + what keeps you in it (solving problems for real users, the feedback loop)."],
          ["Where do you see yourself in 5 years?", "\"Owning a significant component end to end, being someone new engineers come to for help, and having gone deep in [backend / distributed systems].\" Ambitious, compatible with staying."],
          ["Greatest strength?", "One strength + a story as evidence. \"I debug systematically — e.g. the connection-pool bug where I used logs and a thread dump to find the root cause.\""],
          ["Greatest weakness?", "Real + your system. \"I used to stay stuck too long before asking for help — I lost two days on a Docker networking issue in my internship. Now I time-box: after 45 minutes with no new hypothesis, I write down what I tried and ask. Last month that turned a day-long problem into a 20-minute conversation.\""],
          ["Why should we hire you?", "Three points matched to the role, each with proof: problem solving (numbers), a deployed project with real decisions, how you work (story)."],
          ["How do you handle criticism?", "Story 7: the feedback, what you changed, the measurable result."],
          ["How do you prioritise when everything is urgent?", "Story 5 + your method: impact vs effort, ask the stakeholder what matters most, communicate what will slip early."],
          ["Salary expectations? (fresher)", "\"I'm aligned with the standard package for this role.\""],
          ["Higher studies? / Relocation? / Bond? / Other offers?", "Answer honestly and briefly. Evasiveness reads as dishonesty; honesty rarely costs the offer."],
          ["Do you have any questions for us?", "Always yes — 2–3 prepared (see Company Research lesson). Never salary or leave in round 1."]
        ] } }
      ] },
      { h: "Amazon Leadership Principles — what each one probes", blocks: [
        { table: { head: ["#", "Leadership Principle", "What they probe", "Typical question"], rows: [
          ["1", "Customer Obsession", "You start from the user and work backwards", "A time you went out of your way for a user."],
          ["2", "Ownership", "You act beyond your scope and think long-term", "A time you took on something that wasn't your job."],
          ["3", "Invent and Simplify", "You find simpler, new ways", "A time you simplified a complex process."],
          ["4", "Are Right, A Lot", "Good judgment; you seek views that disconfirm yours", "A time you changed your mind because of data."],
          ["5", "Learn and Be Curious", "You keep learning on your own", "Something you learned recently without being asked."],
          ["6", "Hire and Develop the Best", "You raise others", "A time you mentored or helped someone grow."],
          ["7", "Insist on the Highest Standards", "You don't ship what isn't good enough", "A time you refused to compromise on quality."],
          ["8", "Think Big", "Bold direction beyond the obvious", "A time you proposed something bigger than asked."],
          ["9", "Bias for Action", "Calculated risk; speed matters", "A decision you made without complete information."],
          ["10", "Frugality", "More with less", "A time you achieved a goal with limited resources."],
          ["11", "Earn Trust", "Candour, admitting mistakes, listening", "A time you admitted a mistake / got tough feedback."],
          ["12", "Dive Deep", "You know the details; data over anecdotes", "A time you found a root cause others missed."],
          ["13", "Have Backbone; Disagree and Commit", "Respectful challenge, then full commitment", "A time you disagreed with a decision."],
          ["14", "Deliver Results", "You deliver on time despite setbacks", "A time you delivered under a tight deadline."],
          ["15", "Strive to be Earth's Best Employer", "You make the team environment better", "How have you made a team better to work in?"],
          ["16", "Success and Scale Bring Broad Responsibility", "You consider wider impact of your work", "A time you considered the wider effects of something you built."]
        ] } },
        { p: "<b>D50 workshop:</b> make a 16-row table (one per LP) and write the <b>two</b> stories you'd use for each (primary + backup). Every story from the bank should appear 3–5 times. Then write out 6 full STAR answers for the LPs where you have the weakest coverage. The handbook's priority set: Customer Obsession, Ownership, Invent and Simplify, Bias for Action, Dive Deep, Deliver Results, Learn and Be Curious, Earn Trust." },
        { tip: "Amazon's online workstyle survey and every interview round are LP-based. Consistency matters: lean decisive and ownership-oriented, but answer honestly — trying to game the survey tends to produce contradictions." }
      ] },
      { h: "Dive-deep follow-ups (what separates prepared from rehearsed)", blocks: [
        { table: { head: ["Follow-up", "What it tests", "Answer (conflict story)"], rows: [
          ["\"What data did you use?\"", "Did you decide on evidence?", "\"Our test log: 7 crashes in 20 runs, all in the camera module on Android 10.\""],
          ["\"What was the trade-off?\"", "Do you see costs?", "\"We dropped the CSV export for the review; it came a week later.\""],
          ["\"What exactly did <i>you</i> do?\"", "Ownership vs team credit", "\"I reproduced the crash, found we were opening the camera twice, fixed it, and wrote the checklist.\""],
          ["\"What would you do differently?\"", "Self-awareness", "\"Set a feature freeze date at the start of each milestone, and add crash reporting on day one.\""],
          ["\"How did you measure the result?\"", "Rigour", "\"Three full demo runs with zero crashes, versus 7 in 20 earlier.\""],
          ["\"What did your teammate think afterwards?\"", "Relationships", "\"He suggested we use the same freeze rule for the final review.\""],
          ["\"What if that hadn't worked?\"", "Judgment", "\"I'd have gone to our guide with both options and the data and let him decide — before the deadline, not after.\""]
        ] } },
        { p: "Rule: every story needs <b>two levels of detail</b> below what you say at first. If you can't answer three \"why/how\" questions deep, the story is too thin — pick another or reconstruct the details now." }
      ] },
      { h: "Rehearsal and the behavioural mocks (D49, D57, D58)", blocks: [
        { ol: [
          "<b>D49 — Mock Interview #6 (45 min):</b> TMAY (≈5 min incl. follow-ups) → 6 STAR questions with follow-ups (≈6 min each) → your questions (≈4 min). Partner interrupts with dive-deep follow-ups. Record it.",
          "Review with the scorecard: structure (STAR visible?), specificity (\"I\", numbers), length (90–120 s), authenticity (sounds real, not memorised), fit (answered the actual question).",
          "<b>D57 evening:</b> all 8 stories out loud, timed at 90–120 s each. Anything over 2 minutes: cut the Situation. TMAY 10 times until natural.",
          "<b>D58 — Mock #13 (30-min HR round):</b> treat it as a real rejection filter — TMAY, why us, strengths/weakness, 2–3 STAR, relocation/bond, questions."
        ] },
        { warn: "Memorised scripts sound recited and collapse at the first interruption. Memorise the <b>beats</b> (keywords on the story card) and say the sentences fresh each time." }
      ] }
    ],
    practice: [
      { q: "Rewrite this answer to \"Tell me about a time you took ownership\": <i>\"In our hackathon we built an app. We divided the work and we finished it on time and got a prize.\"</i>",
        a: "Use STAR with \"I\": S — \"At a 36-hour college hackathon, our team of 4 was building a bus-tracking app.\" T — \"Nobody owned deployment, and at hour 30 we had no working server.\" A — \"I took it on: set up a free-tier server, wrote a Dockerfile, fixed two environment bugs, and wrote a 5-step run script so anyone could redeploy.\" R — \"We demoed live, placed 3rd of 60 teams, and I now set up deployment on day one of every project.\" Specific, personal, quantified, with a learning." },
      { q: "Is this a good weakness answer? <i>\"I'm a perfectionist — I work too hard.\"</i> Give a better one.",
        a: "No — it's a disguised strength and interviewers hear it constantly; it reads as evasive. Better: a real, non-fatal weakness + a system + evidence: \"Public speaking used to make me rush. I joined the coding club's weekly talks and I record my practice runs; my last talk was 12 minutes and I got asked follow-up questions instead of 'can you repeat that'.\"" },
      { q: "Map this story to two Amazon LPs: <i>You noticed your project's stats page took 9 s, profiled it, found a missing index, added it, and it dropped to 150 ms.</i>",
        a: "Dive Deep (profiled, found the root cause in the query plan) and Insist on the Highest Standards (didn't accept a slow page). With a user angle (\"club members complained\") it can also serve Customer Obsession." },
      { q: "The interviewer asks \"What would you do differently?\" after your failure story and you say \"Nothing, it went well in the end.\" What's wrong?",
        a: "It signals no reflection — the whole point of the follow-up. Always have one concrete change tied to the root cause: \"I'd have told my guide about the delay on day 2 instead of day 6; he could have given us the extra dataset earlier.\"" }
    ],
    related: []
  });

  /* ───────────────────────── COMPANY RESEARCH ───────────────────────── */
  add({
    id: "car-company-research",
    subject: "career",
    title: "Company research, \"why us?\", and questions to ask",
    minutes: 60,
    crux: [
      "Research answers four things: <b>what they build</b>, <b>how they make money</b>, <b>what the role/team does</b>, and <b>what the process looks like on your campus</b>.",
      "\"Why this company?\" = <b>two specific sentences</b>: a real product/engineering fact + how it connects to your evidence + what you want to learn.",
      "Best sources: seniors placed there last year, the company's engineering blog and careers pages, its annual report / investor pages, recent news, and actually using the product.",
      "Prepare 2–3 smart questions per interviewer type. Never salary or leave in round 1; never something answered on their home page.",
      "Clean up LinkedIn and GitHub: pinned repos = resume projects; LinkedIn mirrors the resume.",
      "Company processes change yearly — verify the round structure with seniors and the placement cell, not just the internet."
    ],
    sections: [
      { h: "The 45-minute research routine (per company)", blocks: [
        { ol: [
          "<b>10 min — business:</b> main products and business lines; who pays them; the Indian engineering centres and what they build.",
          "<b>10 min — engineering:</b> 2 posts from their engineering blog or tech talks; note one system/problem you find interesting.",
          "<b>5 min — news:</b> what they launched or announced in the last 6 months (search \"company name + launch/announces\").",
          "<b>10 min — process:</b> talk to a senior or read recent campus interview experiences: OA format, number of rounds, what was asked, what the bar felt like.",
          "<b>10 min — write the card:</b> the one-page company card below, including your \"why us\" and your questions."
        ] },
        { code: `COMPANY CARD — ______________          Date: ____
Business:     main products / business lines, how they earn
India teams:  locations + what they build
Engineering:  1 interesting system/blog post (1 line) — ________________________
Recent news:  1–2 items (last 6 months)
Process:      OA format ____ | rounds ____ | focus (DSA/CS/LLD/LP) ____ | from senior: ____
Why us (2 sentences):
  1. ______________________________________________________________
  2. ______________________________________________________________
My questions: 1. ______   2. ______   3. ______
Prep emphasis for this company: ____________________________________`, lang: "text", title: "One-page company card" }
      ] },
      { h: "Company notes (D50–D52)", blocks: [
        { p: "Starting points only — confirm current details from the company's own pages and your seniors. Interview focus is from the handbook's company matrix." },
        { table: { head: ["Company", "Know about", "Interview focus", "\"Why us\" angle to build on"], rows: [
          ["Amazon", "Retail marketplace, AWS, Prime, advertising, devices (Alexa, Kindle); Amazon.in and Amazon Pay in India", "Medium DSA (arrays, trees, graphs, LRU/Trie), OOP/OS/DBMS, <b>LP-heavy behavioural in every round</b>", "Customer-facing systems at huge scale; ownership culture"],
          ["Microsoft", "Azure, Microsoft 365, Windows, GitHub, LinkedIn, Xbox, Copilot; large India Development Center", "Trees, linked lists, strings, DP; strong on OOP + OS; talkative, collaborative rounds", "Developer tools and platforms used by millions of engineers"],
          ["Google", "Search, Ads, YouTube, Android, Chrome, Cloud, Maps; Google Pay (UPI) in India", "Medium–hard DSA, graphs + DP, judged on clean, tested, communicated code", "Problems where algorithms genuinely decide product quality"],
          ["Adobe", "Creative Cloud (Photoshop, Premiere Pro), Document Cloud (Acrobat/PDF), Experience Cloud; generative AI (Firefly); big Noida/Bengaluru presence", "OOP + LLD + Java internals (collections, GC, immutability, concurrency) + puzzles", "Product engineering on tools creators use daily"],
          ["Goldman Sachs", "Global Banking &amp; Markets, Asset &amp; Wealth Management; large Bengaluru/Hyderabad engineering", "Aptitude + probability/maths section, DSA, OOP", "Correctness-critical, real-time financial systems"],
          ["Morgan Stanley", "Institutional Securities, Wealth Management, Investment Management; Mumbai/Bengaluru tech centres", "Solid DSA + OOP + puzzles; some LLD", "Engineering where reliability and risk matter"],
          ["JPMorgan Chase", "Consumer banking (Chase), corporate &amp; investment banking, commercial banking, asset &amp; wealth management; large India tech centres", "Moderate DSA, communication, a recorded video round", "Payments and banking platforms at global scale"]
        ] } },
        { h: "\"Why finance-tech?\" (D52)" },
        { ul: [
          "<b>Correctness matters more than anywhere:</b> a bug moves real money — you want to learn engineering discipline (testing, auditability, idempotency).",
          "<b>Performance and reliability:</b> trading and payments systems have strict latency and uptime requirements.",
          "<b>Data scale:</b> market and transaction data volumes are enormous.",
          "<b>Genuine curiosity, with proof:</b> \"While building my project's rate limiter I read how payment APIs use idempotency keys so a retried request doesn't charge twice — I want to work where that's a daily concern.\""
        ] },
        { warn: "Don't fake finance knowledge. Engineers are not expected to know markets; they are expected to be curious and to understand why correctness and reliability matter there." }
      ] },
      { h: "Writing \"why this company\" — formula and examples", blocks: [
        { p: "<b>Formula:</b> [specific fact about their product/engineering] + [link to something you have actually done] + [what you want to learn/do there]." },
        { table: { head: ["Weak", "Strong"], rows: [
          ["\"It's a great company with a great culture and good work-life balance.\"", "\"Your India teams build parts of [specific product] that serve millions of users. My URL-shortener project taught me how much caching and rate limiting matter even at small scale, and I want to learn how it's done when the scale is real.\""],
          ["\"I have always dreamt of working at Google.\"", "\"I enjoy problems where the algorithm is the product — I liked building an inverted index for my search tool. Search and Maps are full of those problems, and your emphasis on code quality in interviews tells me that's valued day to day.\""],
          ["\"Finance pays well.\"", "\"I like systems where correctness is non-negotiable — the race-condition work in my booking project was my favourite part. Payments and trading systems are that problem every day.\""]
        ] } }
      ] },
      { h: "Questions to ask the interviewer (D57 night: pick 3)", blocks: [
        { table: { head: ["Interviewer", "Good questions"], rows: [
          ["Engineer", "\"What does a typical week look like for a new engineer on your team?\" · \"What's an interesting technical problem your team solved recently?\" · \"How does code get from a pull request to production here — reviews, tests, release cadence?\""],
          ["Manager", "\"What does success look like for a new graduate in the first six months?\" · \"What distinguishes the new grads who grow fastest on your team?\" · \"How are new graduates onboarded to a large codebase?\""],
          ["HR / final round", "\"What are the next steps and the timeline?\" · \"How are teams allocated for new graduates?\""],
          ["Tailored (best)", "\"I read that your team moved X to Y — what drove that decision?\" (only if your research found something real)"]
        ] } },
        { ul: [
          "Avoid in round 1: salary, leave, work-from-home, \"did I pass?\".",
          "Avoid questions answered on their home page (\"what does the company do?\") — it shows you didn't research.",
          "Prefer open questions (what/how) over yes/no. Listen to the answer and ask one follow-up — it turns into a conversation."
        ] }
      ] },
      { h: "LinkedIn and GitHub clean-up (D57 night)", blocks: [
        { ul: [
          "<b>LinkedIn:</b> professional photo; headline that says what you do and want (\"Final-year CSE @ X | Java, Spring Boot, DSA | SDE Intern @ Y\"); 4–6-line About; Experience and Projects mirroring the resume; Skills filled (recruiters filter on them); \"Open to work\" visible to recruiters only.",
          "<b>GitHub:</b> pinned repos = your resume projects, nothing else; each with a real README (what/why/stack/screenshots/how to run/architecture), meaningful commits, <code>.gitignore</code>, no committed secrets, live link, licence.",
          "Unpin (or archive) half-finished and tutorial repos; a folder of LeetCode solutions should not be the first thing a recruiter sees.",
          "Check that names, dates, numbers and links match across resume, LinkedIn and GitHub — interviewers cross-check."
        ] }
      ] }
    ],
    practice: [
      { q: "Turn this into a strong \"why us\": <i>\"I want to join Adobe because it is a big company and I like its products.\"</i>",
        a: "\"I use Acrobat and Photoshop every week, and what interests me is that they are huge, long-lived codebases where performance and backward compatibility really matter — I got a small taste of that refactoring my project's layers without breaking its API. Adobe also asks a lot about OOP and Java internals, which is where I've put a lot of my preparation.\" — specific products, a link to your evidence, what you want." },
      { q: "You have 2 minutes left in an interview and the engineer asks for your questions. Which one do you ask, and why?",
        a: "One open, team-specific question, e.g. \"What's an interesting technical problem your team solved recently?\" It's easy for them to answer with enthusiasm, shows curiosity about the work, and may give you material for a thank-you note. Save process questions for HR." },
      { q: "Name three places to learn what last year's campus process looked like for a company.",
        a: "Seniors placed there (best — 30 minutes with one is worth hours of guessing); your placement cell's records and previous-year notices; recent campus interview-experience posts (e.g. company-tagged interview experiences on coding sites). Cross-check, because processes change each year." }
    ],
    related: []
  });

  /* ───────────────────────── INTERVIEW DAY ───────────────────────── */
  add({
    id: "car-interview-day",
    subject: "career",
    title: "Interview day: taper, logistics, warm-up, mental rehearsal, handling blanks",
    minutes: 40,
    crux: [
      "Days 59–60 are a <b>taper</b>: re-solve problems you <i>can</i> solve, skim one-page sheets, learn nothing new, sleep 8 hours.",
      "Night before: laptop, charger, hotspot, IDE, ID proof, resume PDF + printed copies, links tested, quiet room, water. Sleep early.",
      "Morning: 2 easy + 1 medium to warm up the hands, spoken out loud; skim notes. Join 5–10 minutes early.",
      "Online: camera at eye level, light in front, headphones with mic, notifications off, screen-share permission tested, plain editor practised.",
      "Mentally rehearse the full round: greeting → TMAY → problem → clarify → approach → code → complexity → questions → thanks.",
      "Blank or panic: say so calmly, restate the problem, write an example, start from brute force. Recovery is scored; one bad round is not the verdict."
    ],
    sections: [
      { h: "The taper (D58 night → D60)", blocks: [
        { table: { head: ["When", "Do", "Why"], rows: [
          ["D58 night", "Light revision of one-page sheets. Sleep 8 hours.", "Consolidation happens in sleep"],
          ["D59 morning", "Re-solve 4 problems you know you can solve; skim all pattern notes", "Confidence and fluency, not gap-finding"],
          ["D59 afternoon", "Skim one-page CS sheets + LLD patterns + SQL archetypes", "Refresh, don't learn — new material now creates anxiety, not skill"],
          ["D59 evening", "Re-read resume, project explanations, STAR stories once; say TMAY twice", "Your own story should be the freshest thing in memory"],
          ["D59 night", "Logistics checklist (next section). Sleep early.", "Remove every avoidable failure"],
          ["D60 morning", "2 easy + 1 medium, out loud; skim notes", "Warm hands and voice"],
          ["D60 afternoon", "Final placement checklist — tick every box; fix anything under 30 minutes, note the rest", "Close loops"],
          ["D60 evening", "Mental rehearsal of a full interview", "Rehearsed calm"],
          ["D60 night", "Rest. No screens after 10 pm.", "You are prepared"]
        ] } }
      ] },
      { h: "Logistics checklist (night before)", blocks: [
        { table: { head: ["Item", "Online round", "On-campus round"], rows: [
          ["Device", "Laptop charged + charger plugged in; restart it the night before (and install pending updates then, not in the morning)", "Charged phone; laptop only if told"],
          ["Internet", "Primary Wi-Fi tested + <b>mobile hotspot</b> tested as backup", "—"],
          ["Tools", "Coding platform login tested; IDE/compiler set up; practised in a plain editor without autocomplete", "Pen, notebook, printed resume (5 copies)"],
          ["Documents", "ID proof nearby; resume PDF open; company card open", "College ID + government ID, admit card/email if any"],
          ["Links", "Interview link opened once; audio/video/screen-share tested", "Venue, reporting time, route; arrive 30 min early"],
          ["Room", "Quiet room booked, plain background, light facing you, door closed, family informed", "—"],
          ["Body", "Water, light meal, set 2 alarms", "Water, snack, formal clothes ready"]
        ] } }
      ] },
      { h: "Online interview setup", blocks: [
        { ul: [
          "Camera at eye level (stack books under the laptop), face lit from the front, not a window behind you.",
          "Wired or good wireless headphones with a mic — avoids echo and background noise.",
          "Close everything else: messaging apps, notifications (Focus mode / Do Not Disturb), extra browser tabs — some platforms flag tab switches.",
          "Grant screen-sharing permission to the browser/app beforehand (some operating systems require a restart after granting it).",
          "Keep pen and paper for drawing examples; tell the interviewer when you look down to write.",
          "If the connection drops: rejoin immediately, switch to hotspot, and message the recruiter/interviewer through the channel they gave you. Stay calm — it happens constantly and is not held against you."
        ] },
        { tip: "In a shared editor, type the examples and your plan as comments before code. It shows structure, and if you get stuck the interviewer can see where to nudge." }
      ] },
      { h: "Warm-up and the final checklist (D60)", blocks: [
        { p: "<b>Warm-up (also every interview morning):</b> 2 easy + 1 medium, typed from scratch and explained out loud. The goal is a warm voice and hands, not challenge. Then 20 minutes on the one-page sheets." },
        { table: { head: ["Final checklist section", "One-line test"], rows: [
          ["A. DSA", "Random medium unaided in ≤ 25 minutes; LRU from a blank file in ≤ 12 minutes"],
          ["B. Language", "HashMap internals, equals/hashCode, String pool, GC, synchronized vs volatile — explainable now"],
          ["C. Core CS", "One-page sheets exist for OS, DBMS, CN, OOP; the URL question in 3 minutes"],
          ["D. Design", "5 LLD problems + URL shortener / rate limiter designed once; \"scale my project\" answer rehearsed"],
          ["E. Resume &amp; profile", "One page, PDF, typo-free, links work, LinkedIn/GitHub clean, 5 printed copies"],
          ["F. Projects", "Both pitches timed; architecture redrawn from memory; bug, race, scaling, what-I'd-change answers ready"],
          ["G. Behavioural", "TMAY natural; 8 STAR stories; LP map (if Amazon); 3 questions ready; company cards done"],
          ["H. Logistics", "Everything in the night-before checklist; sleep aligned with 9–11 am interview slots"]
        ] } }
      ] },
      { h: "Mental rehearsal script (D60 evening)", blocks: [
        { p: "Close your eyes and walk through a full round in real time, including what you will say. Rehearsing the sequence makes the real one feel familiar." },
        { svg: `<svg viewBox="0 0 720 150" width="720" class="dg">
  <rect class="box" x="10" y="20" width="128" height="40" rx="6"/>
  <text class="tx" x="74" y="40" text-anchor="middle" dominant-baseline="middle">Greet + TMAY</text>
  <rect class="box-w" x="152" y="20" width="128" height="40" rx="6"/>
  <text class="tx" x="216" y="40" text-anchor="middle" dominant-baseline="middle">Restate, clarify</text>
  <rect class="box-a" x="294" y="20" width="128" height="40" rx="6"/>
  <text class="tx" x="358" y="40" text-anchor="middle" dominant-baseline="middle">Brute → optimise</text>
  <rect class="box-a" x="436" y="20" width="128" height="40" rx="6"/>
  <text class="tx" x="500" y="40" text-anchor="middle" dominant-baseline="middle">Code, narrated</text>
  <rect class="box-g" x="578" y="20" width="132" height="40" rx="6"/>
  <text class="tx" x="644" y="40" text-anchor="middle" dominant-baseline="middle">Dry run, edges</text>
  <rect class="box-g" x="420" y="95" width="170" height="40" rx="6"/>
  <text class="tx" x="505" y="115" text-anchor="middle" dominant-baseline="middle">Complexity, follow-up</text>
  <rect class="box-p" x="250" y="95" width="140" height="40" rx="6"/>
  <text class="tx" x="320" y="115" text-anchor="middle" dominant-baseline="middle">Your 2 questions</text>
  <rect class="box" x="90" y="95" width="120" height="40" rx="6"/>
  <text class="tx" x="150" y="115" text-anchor="middle" dominant-baseline="middle">Thank you</text>
  <line class="ln" x1="138" y1="40" x2="150" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="40" x2="292" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="422" y1="40" x2="434" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="564" y1="40" x2="576" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="644" y1="60" x2="565" y2="93" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="420" y1="115" x2="392" y2="115" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="115" x2="212" y2="115" marker-end="url(#dg-arr)"/>
</svg>`, caption: "The sequence to rehearse, scene by scene." },
        { ol: [
          "<b>Greeting:</b> join early, smile, \"Hi, I'm ___ — thanks for taking the time.\"",
          "<b>TMAY:</b> your 60–90 second version; end on why this role.",
          "<b>Problem:</b> listen fully; restate it in your own words.",
          "<b>Clarify:</b> 2–3 questions (size, duplicates, empty input, output format).",
          "<b>Approach:</b> example by hand → brute force + complexity → optimisation → \"shall I code it?\"",
          "<b>Code:</b> narrate intent, clean names.",
          "<b>Dry run + edge cases</b>, then state final time and space.",
          "<b>Follow-up:</b> \"what if it's streaming / huge / sorted?\" — reason aloud.",
          "<b>Your questions:</b> two, prepared, listen to the answers.",
          "<b>Close:</b> \"Thank you — I enjoyed the problem, especially the part about ___.\""
        ] },
        { p: "Rehearse one bad moment too: picture going blank on step 5, and see yourself using the recovery protocol below. Then finish the round in your head." }
      ] },
      { h: "Handling blanks, stress, and a bad round", blocks: [
        { ol: [
          "<b>Say it calmly:</b> \"Let me take a moment to think this through.\" Silence you announce is fine; unexplained silence isn't.",
          "<b>Restate and write an example</b> — concrete numbers unlock pattern recognition.",
          "<b>Brute force out loud.</b> It gets you moving and shows the repeated work.",
          "<b>Scan the signals:</b> sorted → two pointers/binary search; contiguous subarray → sliding window/prefix sums; top-k → heap; dependencies → graph/topological sort; \"minimise the maximum\" → binary search on answer; choices over a sequence with overlap → DP.",
          "<b>Ask well if still stuck</b> after a genuine attempt: \"I'm considering X and Y; X fails because… Am I missing a property of the input?\""
        ] },
        { ul: [
          "<b>Physical reset:</b> slow breathing — in for 4 counts, hold 4, out for 4, hold 4 — for a minute before the round or during a break.",
          "<b>Between rounds:</b> don't replay the last round. Water, stand up, reset to the framework.",
          "<b>After a bad round:</b> interviewers score independently and you often can't judge how it went. Treat the next round as the first.",
          "<b>After a rejection:</b> write down what happened while fresh, fix what the feedback says, keep going. Campus outcomes are high-variance; most people who land a top offer were rejected somewhere first."
        ] },
        { tip: "From D61 prep becomes maintenance: 3–4 problems a day, one mock every two days, and the one-page sheets before each interview." }
      ] }
    ],
    practice: [
      { q: "Your interview is at 10 am tomorrow (online). List the five checks you do tonight that prevent the most common failures.",
        a: "(1) Open the interview link and test audio, video and screen-share. (2) Test the hotspot as backup internet. (3) Charge the laptop and install pending updates tonight. (4) Log in to the coding platform once. (5) Set up the room: light in front, camera at eye level, quiet, 2 alarms set. Then sleep early." },
      { q: "Five minutes into coding you realise your approach is wrong and your mind goes blank. Script your next 60 seconds.",
        a: "\"I just realised this breaks when the array has duplicates — let me step back for a moment.\" Write a small example with duplicates, walk through why it fails, state the brute force that definitely works and its complexity, then look for the repeated work in it. Speak throughout; the interviewer is watching how you recover, not whether you were right first time." },
      { q: "Why re-solve problems you already know on D59 instead of attempting new hard ones?",
        a: "The last days are for confidence and fluency. New hard problems the day before mostly produce failures and anxiety without enough time to learn from them. Re-solving known problems rehearses fast, clean execution — exactly what you need tomorrow." }
    ],
    related: []
  });

  /* ───────────────────────── READINESS ───────────────────────── */
  add({
    id: "car-readiness",
    subject: "career",
    title: "Tracking & the weekly Readiness Score (incl. the halfway audit)",
    minutes: 30,
    crux: [
      "Four sheets form the measurement system: <b>Tracker</b> (every problem), <b>Redo List</b> (+3/+10/+30), <b>Weakness sheet</b> (failed twice / mock score &lt; 3), <b>Mistake log</b> (categorised errors).",
      "Weekly <b>Readiness Score</b>: 10 dimensions × 0–10 = /100. Score from evidence, round <b>down</b> when unsure.",
      "The unaided-solve rate is the single most important number: target 65%+ unaided by Week 5.",
      "Compare with the expected trajectory (20, 32, 43, 55, 65, 74, 82, 88, 90+). 10+ points below for two weeks → fix the cause: unaided solving, revision, or speaking practice.",
      "Change <b>one</b> thing per week, chosen from the lowest dimension.",
      "D28 halfway audit: ~330 problems, topics at ≥ 80% confidence, Weakness sheet review, and re-plan the remaining 32 days."
    ],
    sections: [
      { h: "The tracking system (set up on D1)", blocks: [
        { table: { head: ["Sheet", "Columns / content", "Updated"], rows: [
          ["Tracker", "Date | Problem | Topic | Pattern | Difficulty | Time taken | Unaided? (Y/N) | Redo on | Notes", "After every problem"],
          ["Redo List", "Every problem not solved unaided, with re-solve dates at +3, +10, +30 days", "Nightly"],
          ["Weakness sheet", "Any problem failed twice; any topic scoring &lt; 3 in a mock; any recurring mistake category", "Weekly + after mocks"],
          ["Mistake log", "One line per error: pattern-unknown / implementation / misread / slow / careless", "After OAs and bad submissions"]
        ] } },
        { p: "<b>Spaced repetition:</b> failed on day 0 → re-solve from a blank file on day +3 → +10 → +30. Solved unaided at +10 and +30 → retire it. Failed twice → it moves to the Weakness sheet and gets a dedicated relearn (theory + 3 fresh problems)." },
        { tip: "\"Unaided\" means no editorial, no hints, no looking at your old code. If you peeked at anything, it's N. That column is your real readiness — be strict with it." }
      ] },
      { h: "Computing the weekly Readiness Score", blocks: [
        { table: { head: ["#", "Dimension", "How to score (0–10)", "Example: end of Week 4", "Score"], rows: [
          ["1", "DSA breadth", "Fraction of Tier 1 topics covered × 10", "About 60% of Tier 1 topics covered", "6"],
          ["2", "DSA depth (unaided rate)", "% of this week's problems solved unaided ÷ 10", "58% unaided → 5.8, round down", "5"],
          ["3", "Speed", "Random medium in ≤ 25 min; 8 of 10 = 10", "5 of 10 → 5/8 × 10 = 6.25", "6"],
          ["4", "Revision health", "10 − (overdue Redo items ÷ 2), floor 0", "6 overdue → 10 − 3", "7"],
          ["5", "Core CS", "Self-quiz % across OS/DBMS/CN/OOP ÷ 10", "55% on a 20-question quiz", "5"],
          ["6", "SQL", "Archetypes writable blind, out of 20, ÷ 2", "12 of 20", "6"],
          ["7", "Design (LLD/HLD)", "Problems designable end to end × 2, cap 10", "None yet (starts D33)", "0"],
          ["8", "Communication", "Latest mock rubric average × 2", "Average 2.5", "5"],
          ["9", "Resume &amp; projects", "% of checklist §E + §F items ticked ÷ 10", "6 of 12 items → 50%", "5"],
          ["10", "Behavioural", "STAR stories rehearsed (of 8) + TMAY polish", "2 stories + rough TMAY", "3"]
        ] } },
        { p: "<b>Total = 6 + 5 + 6 + 7 + 5 + 6 + 0 + 5 + 5 + 3 = 48.</b> The Week 4 target is 55, so this student is 7 below — in the <i>Building</i> band and within 10 of target. The lowest actionable dimensions are behavioural (3) and depth (5). Design at 0 is expected at this point in the plan, so it isn't the week's focus." }
      ] },
      { h: "Interpreting the score", blocks: [
        { table: { head: ["Total", "Meaning", "Action"], rows: [
          ["0–35", "Foundation stage", "Normal for Weeks 1–2. Keep executing; don't panic"],
          ["36–55", "Building", "Normal for Weeks 3–4. Watch the unaided rate"],
          ["56–70", "Interview-capable for mid-tier", "Would clear many OAs; interviews hit-or-miss. Push depth + communication"],
          ["71–85", "Strong candidate", "Would clear most loops at most companies"],
          ["86–100", "Top-offer ready", "Focus on consistency, mocks, not getting careless"]
        ] } },
        { table: { head: ["End of week", "1", "2", "3", "4", "5", "6", "7", "8", "Day 60"], rows: [
          ["Target score", "20", "32", "43", "55", "65", "74", "82", "88", "90+"]
        ] } },
        { warn: "Inflating the score only fools you. If two honest weeks are 10+ below target, the cause is almost always one of: not enough <b>unaided</b> solving, <b>no revision</b>, or <b>no speaking practice</b>. Fix that one thing rather than adding hours." }
      ] },
      { h: "The halfway audit (D28)", blocks: [
        { ol: [
          "<b>Count:</b> problems solved so far (target ~330) and the unaided rate for Weeks 3–4.",
          "<b>Confidence map:</b> list every topic covered; mark each ≥ 80% (can solve a random medium unaided), 50–80%, or &lt; 50%.",
          "<b>Weakness sheet review:</b> which items are still failing? Which mistake category dominates the log?",
          "<b>Re-plan the remaining 32 days:</b> if a Tier 1 topic is &lt; 50% (DP later, or e.g. trees now), borrow hours from Tier 3 topics (segment trees, advanced strings/graphs on D46–47).",
          "<b>Score Week 4</b> and write the one change for Week 5."
        ] },
        { code: `HALFWAY AUDIT — D28
Problems: 312 (target ~330)     Unaided rate wk3: 54%  wk4: 58%
>= 80%: arrays, hashing, two pointers, sliding window, binary search, stack
50-80%: linked list, heap, greedy, trees
< 50%:  backtracking (failed N-Queens, Sudoku twice), monotonic stack variants
Mistake log (4 weeks): (a) 9  (b) 6  (c) 3  (d) 5  (e) 7
Decision: D46 afternoon (lazy propagation) -> backtracking relearn + 6 problems.
          Add 1 monotonic-stack problem to every Redo sweep until D35.
Readiness wk4: 48 / target 55. One change for wk5: record the daily speaking problem (communication = 5).`, lang: "text", title: "Example audit (write yours in the same shape)" }
      ] },
      { h: "Weekly mistake-analysis questions", blocks: [
        { ol: [
          "Which error category dominated this week? What is the <i>specific</i> fix?",
          "Which topic did I avoid because it was uncomfortable? (Schedule it first next week.)",
          "Did I actually speak while solving at least 5 times this week?",
          "How many problems did I solve unaided vs after looking?",
          "Did I do anything low-value this week that I should stop?"
        ] },
        { p: "Answer in writing, then pick <b>one</b> adjustment for next week. Several changes at once make it impossible to tell which one helped." }
      ] }
    ],
    practice: [
      { q: "Compute: breadth 8, unaided 71% this week, 6 of 10 mediums in ≤ 25 min, 10 overdue Redo items, core CS quiz 70%, 16 SQL archetypes, 3 LLD problems designable, mock average 3.5, 9 of 12 checklist items, 6 stories + good TMAY (score 7). Total and band?",
        a: "Breadth 8; depth 7 (7.1 rounded down); speed 6/8 × 10 = 7.5 → 7; revision 10 − 10/2 = 5; core CS 7; SQL 16/2 = 8; design 3 × 2 = 6; communication 3.5 × 2 = 7; resume 9/12 = 75% → 7 (7.5 rounded down); behavioural 7. Total = 8+7+7+5+7+8+6+7+7+7 = 69 → \"Interview-capable for mid-tier\" (56–70). Lowest: revision (5) — clear the overdue Redo items next week." },
      { q: "A problem was failed on D10. When are its re-solves, and what happens if you fail it on D20?",
        a: "Re-solves on D13 (+3), D20 (+10) and D40 (+30). Failing on D20 makes it a problem failed twice (D10 was the first), so it moves to the Weakness sheet and gets a dedicated relearn of the underlying pattern plus fresh problems, rather than just another attempt." },
      { q: "Your score was 30 in Week 3 and 38 in Week 4 (targets 43 and 55). What does the handbook say to do?",
        a: "You are 10+ below target two weeks running. Don't add hours — find which of the three usual causes applies (low unaided rate, overdue revision, no speaking practice) by looking at dimensions 2, 4 and 8, and fix that one cause next week." }
    ],
    related: []
  });

  /* ───────────────────────── BLOCK MAP ───────────────────────── */
  // resume
  map("d1-ev",  ["car-resume"]);
  map("d6-ev",  ["car-resume"]);
  map("d14-ni", ["car-resume", "car-readiness"]);
  map("d35-ni", ["car-readiness", "car-resume"]);
  map("d49-ni", ["car-readiness", "car-resume"]);
  map("d56-ni", ["car-readiness", "car-resume"]);
  map("d57-mo", ["car-resume-grilling"]);

  // projects
  map("d19-ev", ["car-project-plan"]);
  map("d20-ev", ["car-project-plan"]);
  map("d22-ev", ["car-project-build"]);
  map("d24-ev", ["car-project-build"]);
  map("d26-ev", ["car-project-build"]);
  map("d41-ev", ["car-project-plan"]);
  map("d48-ev", ["car-project-build", "car-resume"]);
  map("d48-ni", ["car-project-deep-prep"]);
  map("d57-af", ["car-project-deep-prep"]);

  // mock OAs
  map("d7-mo",  ["car-mock-oa"]);
  map("d14-mo", ["car-mock-oa"]);
  map("d21-mo", ["car-mock-oa"]);
  map("d28-mo", ["car-mock-oa"]);
  map("d35-mo", ["car-mock-oa"]);
  map("d42-mo", ["car-mock-oa"]);
  map("d49-mo", ["car-mock-oa"]);
  map("d53-mo", ["car-mock-oa"]);

  // mock interviews & speaking practice
  map("d7-ev",  ["car-mock-interview"]);
  map("d14-ev", ["car-mock-interview"]);
  map("d15-ni", ["car-mock-interview"]);
  map("d21-ev", ["car-mock-interview"]);
  map("d28-ev", ["car-mock-interview"]);
  map("d35-ev", ["car-mock-interview"]);
  map("d42-ev", ["car-mock-interview"]);
  map("d53-af", ["car-mock-interview"]);
  map("d53-ev", ["car-mock-interview"]);
  map("d56-af", ["car-mock-interview"]);
  map("d58-mo", ["car-mock-interview"]);
  map("d58-af", ["car-mock-interview", "car-project-deep-prep", "car-behavioural"]);
  map("d58-ev", ["car-mock-interview"]);

  // behavioural
  map("d49-ev", ["car-behavioural"]);
  map("d50-ev", ["car-behavioural"]);
  map("d57-ev", ["car-behavioural"]);

  // company research
  map("d50-ni", ["car-company-research"]);
  map("d51-ni", ["car-company-research"]);
  map("d52-ni", ["car-company-research"]);
  map("d57-ni", ["car-company-research"]);

  // readiness / audits
  map("d1-mo",  ["car-readiness"]);
  map("d7-ni",  ["car-readiness"]);
  map("d21-ni", ["car-readiness"]);
  map("d28-ni", ["car-readiness"]);
  map("d42-ni", ["car-readiness"]);
  map("d55-ni", ["car-readiness"]);

  // taper & interview day
  map("d58-ni", ["car-interview-day"]);
  map("d59-mo", ["car-interview-day"]);
  map("d59-af", ["car-interview-day"]);
  map("d59-ev", ["car-interview-day", "car-behavioural"]);
  map("d59-ni", ["car-interview-day"]);
  map("d60-mo", ["car-interview-day"]);
  map("d60-af", ["car-interview-day"]);
  map("d60-ev", ["car-interview-day"]);
  map("d60-ni", ["car-interview-day"]);
})();
