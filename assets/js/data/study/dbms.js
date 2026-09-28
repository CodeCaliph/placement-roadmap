/* study: DBMS — lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ------------------------------------------------------------------ */
  /* D15 — ER model, keys, constraints, SQL command types                */
  /* ------------------------------------------------------------------ */
  add({
    id: "dbms-er-keys-constraints",
    subject: "dbms",
    title: "ER model, keys, constraints & DDL/DML/DCL/TCL",
    minutes: 70,
    crux: [
      "ER model = <b>entities</b> (rectangles), <b>attributes</b> (ovals), <b>relationships</b> (diamonds). A <b>weak entity</b> (double rectangle) has no key of its own and is identified through its owner.",
      "Cardinality is 1:1, 1:N or M:N. Mapping to tables: 1:N → foreign key on the N side; M:N → a separate junction table whose PK is both FKs.",
      "<b>Super key</b> ⊇ <b>candidate key</b> (minimal super key) ⊇ one chosen <b>primary key</b>; the unchosen candidates are <b>alternate keys</b>. <b>Foreign key</b> references another table's key. <b>Composite</b> = more than one column; <b>surrogate</b> = system-generated id with no business meaning.",
      "Integrity: <b>entity integrity</b> (PK is unique and NOT NULL), <b>referential integrity</b> (FK value must exist in parent or be NULL), plus domain, NOT NULL, UNIQUE, CHECK constraints.",
      "<b>DDL</b> CREATE/ALTER/DROP/TRUNCATE · <b>DML</b> INSERT/UPDATE/DELETE (+SELECT) · <b>DCL</b> GRANT/REVOKE · <b>TCL</b> COMMIT/ROLLBACK/SAVEPOINT.",
      "<b>DELETE</b> = row-by-row DML, WHERE allowed, rollback-able, fires triggers. <b>TRUNCATE</b> = DDL, removes all rows fast, resets auto-increment in MySQL. <b>DROP</b> = removes the table itself (structure, indexes, privileges)."
    ],
    sections: [
      {
        h: "The ER model — drawing the design before the tables",
        blocks: [
          { p: "Before writing <code>CREATE TABLE</code> you model the real world: <b>what things</b> exist (entities), <b>what we know about them</b> (attributes) and <b>how they are connected</b> (relationships). Interviewers usually give a mini-scenario (college, library, e-commerce) and ask you to draw this." },
          { svg: `<svg viewBox="0 0 720 280" width="720" class="dg">
  <ellipse class="box" cx="70" cy="45" rx="52" ry="20"/>
  <text class="tx" x="70" y="45" text-anchor="middle" dominant-baseline="middle" text-decoration="underline">roll_no</text>
  <ellipse class="box" cx="190" cy="45" rx="48" ry="20"/>
  <text class="tx" x="190" y="45" text-anchor="middle" dominant-baseline="middle">name</text>
  <ellipse class="box" cx="65" cy="240" rx="56" ry="24"/>
  <ellipse class="box" cx="65" cy="240" rx="50" ry="19"/>
  <text class="tx" x="65" y="240" text-anchor="middle" dominant-baseline="middle">phone</text>
  <ellipse class="box ln-d" cx="195" cy="240" rx="52" ry="20"/>
  <text class="tx" x="195" y="240" text-anchor="middle" dominant-baseline="middle">age</text>
  <line class="ln" x1="80" y1="65" x2="105" y2="120"/>
  <line class="ln" x1="180" y1="65" x2="150" y2="120"/>
  <line class="ln" x1="75" y1="216" x2="105" y2="160"/>
  <line class="ln" x1="185" y1="220" x2="150" y2="160"/>
  <rect class="box-a" x="70" y="120" width="120" height="40" rx="4"/>
  <text class="tx tx-b" x="130" y="140" text-anchor="middle" dominant-baseline="middle">Student</text>
  <polygon class="box-p" points="360,105 430,140 360,175 290,140"/>
  <text class="tx tx-b" x="360" y="140" text-anchor="middle" dominant-baseline="middle">Enrols</text>
  <ellipse class="box" cx="360" cy="45" rx="46" ry="20"/>
  <text class="tx" x="360" y="45" text-anchor="middle" dominant-baseline="middle">grade</text>
  <line class="ln" x1="360" y1="65" x2="360" y2="105"/>
  <line class="ln" x1="190" y1="140" x2="290" y2="140"/>
  <line class="ln" x1="430" y1="136" x2="530" y2="136"/>
  <line class="ln" x1="430" y1="144" x2="530" y2="144"/>
  <text class="tx tx-b" x="240" y="128" text-anchor="middle">M</text>
  <text class="tx tx-b" x="480" y="126" text-anchor="middle">N</text>
  <rect class="box-a" x="530" y="120" width="120" height="40" rx="4"/>
  <text class="tx tx-b" x="590" y="140" text-anchor="middle" dominant-baseline="middle">Course</text>
  <ellipse class="box" cx="545" cy="45" rx="56" ry="20"/>
  <text class="tx" x="545" y="45" text-anchor="middle" dominant-baseline="middle" text-decoration="underline">course_id</text>
  <ellipse class="box" cx="665" cy="45" rx="46" ry="20"/>
  <text class="tx" x="665" y="45" text-anchor="middle" dominant-baseline="middle">title</text>
  <ellipse class="box" cx="600" cy="240" rx="50" ry="20"/>
  <text class="tx" x="600" y="240" text-anchor="middle" dominant-baseline="middle">credits</text>
  <line class="ln" x1="555" y1="65" x2="570" y2="120"/>
  <line class="ln" x1="655" y1="65" x2="620" y2="120"/>
  <line class="ln" x1="600" y1="220" x2="595" y2="160"/>
  <text class="tx-m" x="480" y="190" text-anchor="middle">double line = total participation</text>
</svg>`, caption: "Student M:N Course through Enrols. Underlined = key attribute, double oval = multi-valued (phone), dashed oval = derived (age from dob). grade belongs to the relationship, not to either entity. Every course must have at least one student here (double line)." },
          { table: { head: ["Notation", "Meaning", "Example"], rows: [
            ["Rectangle", "Strong entity (has its own key)", "Student, Course"],
            ["Double rectangle", "Weak entity — identified by owner + <b>partial key</b> (discriminator)", "Dependent(name) of Employee; Room(number) of Building"],
            ["Diamond / double diamond", "Relationship / identifying relationship of a weak entity", "Enrols; Has_Dependent"],
            ["Oval, underlined", "Key attribute", "roll_no"],
            ["Composite attribute", "Splits into sub-parts", "name → first, last; address → city, pin"],
            ["Double oval", "Multi-valued attribute", "phone numbers, skills"],
            ["Dashed oval", "Derived attribute (computed, not stored)", "age from dob; total from line items"],
            ["Single / double line", "Partial / total participation", "Every Loan must belong to a Customer → total"]
          ] } },
          { h: "Cardinality and participation" },
          { ul: [
            "<b>1:1</b> — one Person has one Passport. <b>1:N</b> — one Department has many Employees. <b>M:N</b> — Students ↔ Courses.",
            "<b>Participation</b> answers \"must every entity take part?\" — total (every Employee must work in a Department) vs partial (not every Employee manages a Department).",
            "Read cardinality from both sides out loud: \"one department has <i>many</i> employees; one employee belongs to <i>one</i> department\" → 1:N."
          ] },
          { h: "ER → tables (the part they actually test)" },
          { table: { head: ["ER construct", "Becomes"], rows: [
            ["Strong entity", "Its own table; key attribute → PK; composite attribute → one column per part"],
            ["Multi-valued attribute", "Separate table <code>student_phone(roll_no FK, phone)</code>, PK = (roll_no, phone)"],
            ["Derived attribute", "Usually not stored (compute age from dob)"],
            ["1:1 relationship", "FK on either side (prefer the side with total participation), with UNIQUE"],
            ["1:N relationship", "FK on the <b>N</b> side: <code>employee.dept_id → department</code>"],
            ["M:N relationship", "Junction table <code>enrolment(roll_no, course_id, grade)</code>, PK = (roll_no, course_id)"],
            ["Weak entity", "Table whose PK = owner's PK + partial key; FK to owner with ON DELETE CASCADE"]
          ] } },
          { warn: "Putting an M:N relationship as a comma-separated column (<code>courses = 'DBMS,OS'</code>) breaks 1NF and makes joins impossible. M:N <i>always</i> needs a junction table." }
        ]
      },
      {
        h: "Keys — all seven, on one table",
        blocks: [
          { p: "Use this one table for every key definition. Assume each student has a unique roll number, a unique email and a unique Aadhaar number (may be missing for some students)." },
          { code: `student
+------------+---------+-----------------+--------------+-------+---------+
| student_id | roll_no | email           | aadhaar      | name  | dept_id |
+------------+---------+-----------------+--------------+-------+---------+
|          1 | 21CS001 | asha@clg.edu    | 1234 5678 90 | Asha  | CS      |
|          2 | 21CS002 | ravi@clg.edu    | NULL         | Ravi  | CS      |
|          3 | 21EC001 | asha2@clg.edu   | 9876 5432 10 | Asha  | EC      |
+------------+---------+-----------------+--------------+-------+---------+`, lang: "text", title: "Example table" },
          { table: { head: ["Key", "Definition", "In this table"], rows: [
            ["Super key", "Any set of columns that uniquely identifies a row (may have extra columns)", "{roll_no}, {roll_no, name}, {email, dept_id}, {student_id, email, name} … many"],
            ["Candidate key", "A <b>minimal</b> super key — remove any column and it stops being unique", "{student_id}, {roll_no}, {email} (aadhaar is unique but nullable, so it cannot be the PK)"],
            ["Primary key", "The one candidate key chosen; UNIQUE + NOT NULL; one per table", "student_id"],
            ["Alternate key", "Candidate keys not chosen as PK (enforce them with UNIQUE)", "roll_no, email"],
            ["Foreign key", "Column(s) referring to a key of another (or the same) table", "dept_id → department(dept_id)"],
            ["Composite key", "A key made of 2+ columns", "enrolment PK (roll_no, course_id)"],
            ["Surrogate key", "Artificial, system-generated, no business meaning (auto-increment / UUID)", "student_id (roll_no is the <b>natural key</b>)"]
          ] } },
          { p: "Relationship to remember: <b>every candidate key is a super key, but not every super key is a candidate key</b>. Primary ⊂ candidate ⊂ super. Name alone is not even a super key (two Ashas)." },
          { tip: "Why pick a surrogate PK? Natural keys change (email, roll number format), can be long (worse for every index that stores the PK), and may be composite. Say: \"surrogate PK for joins, UNIQUE constraint on the natural key so business rules still hold\"." },
          { h: "Primary key vs UNIQUE" },
          { table: { head: ["", "PRIMARY KEY", "UNIQUE"], rows: [
            ["NULLs", "Not allowed", "Allowed — MySQL and PostgreSQL both allow many NULLs in a UNIQUE column"],
            ["How many per table", "Exactly one", "Any number"],
            ["Index", "Creates a unique index (clustered in MySQL InnoDB)", "Creates a unique (secondary) index"]
          ] } }
        ]
      },
      {
        h: "Relational integrity constraints",
        blocks: [
          { ul: [
            "<b>Domain constraint</b> — value must come from the column's type/range: <code>age INT CHECK (age BETWEEN 16 AND 60)</code>.",
            "<b>Key constraint</b> — key values are unique (PRIMARY KEY, UNIQUE).",
            "<b>Entity integrity</b> — PK can never be NULL (otherwise the row cannot be identified).",
            "<b>Referential integrity</b> — every FK value matches an existing parent key, or is NULL. Decide what happens when the parent row is deleted/updated: <code>RESTRICT</code>/<code>NO ACTION</code> (block), <code>CASCADE</code> (delete children too), <code>SET NULL</code>.",
            "<b>NOT NULL, DEFAULT, CHECK</b> — column-level rules. MySQL enforces CHECK only from 8.0.16 (older versions parsed and ignored it — a classic gotcha)."
          ] },
          { code: `CREATE TABLE department (
  dept_id   VARCHAR(5)  PRIMARY KEY,
  dept_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE student (
  student_id INT          PRIMARY KEY,          -- surrogate key (use AUTO_INCREMENT in MySQL,
                                                --  GENERATED ALWAYS AS IDENTITY in PostgreSQL)
  roll_no    VARCHAR(10)  NOT NULL UNIQUE,      -- alternate key
  email      VARCHAR(100) NOT NULL UNIQUE,      -- alternate key
  name       VARCHAR(50)  NOT NULL,
  cgpa       DECIMAL(4,2) CHECK (cgpa BETWEEN 0 AND 10),   -- domain constraint
  dept_id    VARCHAR(5),
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)
    ON DELETE SET NULL ON UPDATE CASCADE                   -- referential integrity
);

CREATE TABLE course (
  course_id VARCHAR(10) PRIMARY KEY,
  title     VARCHAR(80) NOT NULL
);

CREATE TABLE enrolment (                          -- M:N junction table
  student_id INT         NOT NULL,
  course_id  VARCHAR(10) NOT NULL,
  grade      CHAR(1),
  PRIMARY KEY (student_id, course_id),            -- composite key
  FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES course(course_id)
);`, lang: "sql", title: "The college schema with every constraint type (MySQL 8 / PostgreSQL)" },
          { p: "Now <code>INSERT INTO enrolment VALUES (99, 'CS301', 'A')</code> fails if student 99 does not exist (referential integrity), and <code>UPDATE student SET cgpa = 11</code> fails the CHECK." }
        ]
      },
      {
        h: "SQL command families: DDL / DML / DCL / TCL",
        blocks: [
          { table: { head: ["Family", "Commands", "Acts on", "Auto-commit?"], rows: [
            ["DDL — Data Definition", "CREATE, ALTER, DROP, TRUNCATE, RENAME", "Structure (schema objects)", "In MySQL/Oracle each DDL statement implicitly commits. PostgreSQL DDL is transactional (can be rolled back)."],
            ["DML — Data Manipulation", "INSERT, UPDATE, DELETE, MERGE (SELECT is sometimes split out as <b>DQL</b>)", "Rows / data", "No — part of the current transaction"],
            ["DCL — Data Control", "GRANT, REVOKE", "Permissions", "Implicit commit in MySQL"],
            ["TCL — Transaction Control", "COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION", "Transactions", "They <i>are</i> the commit/rollback"]
          ] } },
          { code: `-- DDL
ALTER TABLE student ADD COLUMN phone VARCHAR(15);

-- DCL (report_user must already exist)
GRANT SELECT ON student TO report_user;
REVOKE SELECT ON student FROM report_user;

-- TCL + DML
START TRANSACTION;
UPDATE student SET cgpa = 8.5 WHERE roll_no = '21CS001';
SAVEPOINT after_cgpa;
DELETE FROM enrolment WHERE student_id = 1;
ROLLBACK TO SAVEPOINT after_cgpa;   -- undoes only the DELETE
COMMIT;                             -- the cgpa update is now permanent`, lang: "sql", title: "One example per family" }
        ]
      },
      {
        h: "DELETE vs TRUNCATE vs DROP",
        blocks: [
          { table: { head: ["", "DELETE", "TRUNCATE", "DROP"], rows: [
            ["Type", "DML", "DDL", "DDL"],
            ["Removes", "Selected rows (WHERE) or all rows", "All rows, keeps structure", "Rows + structure + indexes + triggers + privileges"],
            ["WHERE clause", "Yes", "No", "No"],
            ["How", "Row by row, each row logged", "Deallocates data pages / recreates the table — minimal logging", "Removes the table definition"],
            ["Speed on big table", "Slow", "Fast", "Fast"],
            ["Rollback", "Yes (inside a transaction)", "MySQL: no (implicit commit). PostgreSQL: yes, inside a transaction", "MySQL: no. PostgreSQL: yes, inside a transaction"],
            ["DELETE triggers", "Fire", "Do not fire", "Do not fire (triggers are dropped)"],
            ["Auto-increment", "Continues from last value", "Reset (MySQL); PostgreSQL only with <code>RESTART IDENTITY</code>", "Gone with the table"],
            ["Referenced by a FK", "Allowed if the FK rule permits", "MySQL refuses if another table's FK references it; PostgreSQL needs <code>TRUNCATE … CASCADE</code>", "Refused unless the FK is dropped first (or <code>DROP … CASCADE</code> in PostgreSQL)"]
          ] } },
          { tip: "One-line answer: \"DELETE removes chosen rows and can be rolled back; TRUNCATE empties the table fast as a DDL operation; DROP deletes the table itself.\" Then add the PostgreSQL nuance that TRUNCATE is transactional there — it shows real knowledge." },
          { warn: "\"TRUNCATE can never be rolled back\" is only true for MySQL/Oracle. Say \"in MySQL\" when you claim it." }
        ]
      }
    ],
    practice: [
      { q: "Library: a Member can borrow many Books; a Book copy can be borrowed by many Members over time; we store issue_date and return_date. Give the tables.", a: "M:N with relationship attributes → <code>member(member_id PK, …)</code>, <code>book(book_id PK, …)</code>, <code>borrow(member_id FK, book_id FK, issue_date, return_date)</code>. PK of borrow must include <code>issue_date</code> — (member_id, book_id, issue_date) — because the same member can borrow the same book twice. Many designs use a surrogate <code>borrow_id</code> instead." },
      { q: "R(roll_no, email, name, dept). roll_no and email are each unique. List the candidate keys, one alternate key and two super keys.", a: "Candidate keys: {roll_no}, {email}. If roll_no is the PK, email is the alternate key. Super keys: any superset of a candidate key, e.g. {roll_no, name}, {email, dept}, {roll_no, email}. {name, dept} is not a super key (two students can share both)." },
      { q: "Can a foreign key be NULL? Can it reference a non-PK column?", a: "Yes to both. A NULL FK means \"no parent\" (e.g. an employee without a manager) unless the column is also NOT NULL. A FK can reference any column with a UNIQUE (or PK) constraint. It can even reference the same table — <code>employee.manager_id → employee.emp_id</code> (self-referencing FK)." },
      { q: "A weak entity Dependent(name, age) belongs to Employee(emp_id). What is the PK of the dependent table?", a: "(emp_id, name): owner's PK + the partial key. emp_id is also a FK to employee, typically with ON DELETE CASCADE because a dependent cannot exist without its employee." },
      { q: "You ran <code>DELETE FROM orders;</code> on a 50-million row table and it is taking forever. What would you use instead and what do you lose?", a: "<code>TRUNCATE TABLE orders;</code> — deallocates pages instead of logging every row, so it finishes in seconds. You lose: the WHERE clause, DELETE triggers do not fire, auto-increment resets (MySQL), and in MySQL it commits implicitly so you cannot roll it back. It also fails in MySQL if another table has a FK referencing orders." }
    ],
    related: ["dbms:er-model", "dbms:entity-attribute-types", "dbms:cardinality-participation", "dbms:er-to-tables", "dbms:generalization-specialization-aggregation", "dbms:types-of-keys", "dbms:primary-vs-unique", "dbms:integrity-constraints", "dbms:null-semantics", "dbms:sql-command-types", "dbms:delete-truncate-drop", "dbms:dbms-vs-rdbms"]
  });

  /* ------------------------------------------------------------------ */
  /* D16 — Normalization                                                 */
  /* ------------------------------------------------------------------ */
  add({
    id: "dbms-normalization",
    subject: "dbms",
    title: "Normalization: FDs, closure, candidate keys, 1NF → BCNF",
    minutes: 90,
    crux: [
      "A <b>functional dependency</b> X → Y means: two rows that agree on X must agree on Y.",
      "<b>Closure X⁺</b> = every attribute X determines; keep applying FDs whose left side is already inside the set. X is a super key iff X⁺ = all attributes.",
      "Finding keys: attributes <b>never on any right side must be in every key</b>. Start from them, compute the closure, add attributes only if needed.",
      "<b>1NF</b> atomic values · <b>2NF</b> no non-prime attribute depends on <i>part</i> of a candidate key · <b>3NF</b> for every X → A, X is a super key <i>or</i> A is prime · <b>BCNF</b> for every X → A, X is a super key.",
      "Normalisation removes <b>insert / update / delete anomalies</b> caused by storing one fact many times.",
      "A decomposition R → R1, R2 is <b>lossless</b> iff (R1 ∩ R2) is a key of R1 or of R2. 3NF can always be lossless <i>and</i> dependency-preserving; BCNF sometimes loses a dependency."
    ],
    sections: [
      {
        h: "Why normalise — the three anomalies",
        blocks: [
          { p: "Take this table where each employee row also carries department details:" },
          { code: `emp_dept
+--------+-------+---------+-----------+--------+
| emp_id | name  | dept_id | dept_name | hod    |
+--------+-------+---------+-----------+--------+
| 1      | Asha  | D1      | Sales     | Mehta  |
| 2      | Ravi  | D1      | Sales     | Mehta  |
| 3      | Kiran | D2      | HR        | Rao    |
+--------+-------+---------+-----------+--------+`, lang: "text" },
          { table: { head: ["Anomaly", "What goes wrong here"], rows: [
            ["Insertion", "Cannot add a new department D3 'Legal' until it has at least one employee (emp_id is the PK and cannot be NULL)."],
            ["Update", "Sales gets a new HOD → must update 2 rows. Miss one and the data contradicts itself."],
            ["Deletion", "Delete Kiran (only HR employee) → we lose the fact that HR exists and Rao heads it."]
          ] } },
          { p: "Root cause: the fact <i>\"D1 is Sales, headed by Mehta\"</i> is stored once per employee. Normalisation = split the table so each fact is stored exactly once, <b>without losing information</b>." }
        ]
      },
      {
        h: "Functional dependencies and attribute closure",
        blocks: [
          { ul: [
            "<b>X → Y</b>: if two rows have the same X, they have the same Y. In emp_dept: <code>emp_id → name, dept_id</code> and <code>dept_id → dept_name, hod</code>.",
            "<b>Trivial</b> FD: Y ⊆ X (e.g. AB → A). Always true, never interesting.",
            "<b>Armstrong's axioms</b>: reflexivity (Y ⊆ X ⇒ X → Y), augmentation (X → Y ⇒ XZ → YZ), transitivity (X → Y, Y → Z ⇒ X → Z). Derived: union, decomposition (X → YZ ⇒ X → Y and X → Z), pseudo-transitivity.",
            "<b>Prime attribute</b>: belongs to at least one candidate key. <b>Non-prime</b>: belongs to none."
          ] },
          { h: "Closure algorithm (X⁺)" },
          { ol: [
            "result = X.",
            "Scan the FDs. For any FD L → R with L ⊆ result, add R to result.",
            "Repeat the scan until a full pass adds nothing."
          ] },
          { p: "<b>Worked:</b> R(A,B,C,D,E,F), F = {A → B, B → C, CD → E, E → F}. Find (AD)⁺." },
          { table: { head: ["Step", "FD used", "result"], rows: [
            ["start", "—", "{A, D}"],
            ["1", "A → B", "{A, B, D}"],
            ["2", "B → C", "{A, B, C, D}"],
            ["3", "CD → E (C and D both present)", "{A, B, C, D, E}"],
            ["4", "E → F", "{A, B, C, D, E, F} = all attributes"]
          ] } },
          { p: "So AD is a super key. Is it minimal? A⁺ = {A, B, C} and D⁺ = {D} — neither alone reaches everything, so <b>AD is a candidate key</b>." }
        ]
      },
      {
        h: "Finding all candidate keys — 3 worked FD sets",
        blocks: [
          { p: "Recipe: (1) put attributes into three groups — only on the left of FDs (or in none) = <b>must be in every key</b>; only on the right = <b>never in any key</b>; on both sides = <b>maybe</b>. (2) Compute the closure of the \"must\" set. If it is everything, that is the only key. (3) Otherwise add \"maybe\" attributes one at a time, then two at a time…, and keep only minimal ones." },
          { h: "Set 1: R(A,B,C,D,E), F = {A → B, BC → D, D → E}" },
          { ul: [
            "Never on a right side: A, C → must be in every key. Only on right: E → never in a key. Both sides: B, D.",
            "(AC)⁺: AC → (A → B) ABC → (BC → D) ABCD → (D → E) ABCDE = all.",
            "<b>Only candidate key: AC.</b> Prime: A, C. Non-prime: B, D, E.",
            "Normal form: A → B has A ⊂ key AC and B non-prime → <b>partial dependency → not in 2NF</b> (so highest is 1NF)."
          ] },
          { h: "Set 2: R(A,B,C,D), F = {AB → C, C → D, D → A}" },
          { ul: [
            "B is never on a right side → in every key. B⁺ = {B}, not enough.",
            "Try B with one more: (AB)⁺ = AB → C → D = ABCD ✓. (BC)⁺ = BC → D → A = ABCD ✓. (BD)⁺ = BD → A → (AB → C) = ABCD ✓.",
            "<b>Candidate keys: AB, BC, BD.</b> Every attribute appears in some key → all are prime.",
            "3NF? Every FD's right side (C, D, A) is prime → <b>yes, 3NF</b>. BCNF? C → D, but C is not a super key → <b>not BCNF</b>."
          ] },
          { h: "Set 3: R(A,B,C,D,E), F = {A → BC, CD → E, B → D, E → A}" },
          { ul: [
            "Every attribute appears on some right side, so there is no mandatory attribute — test single attributes first.",
            "A⁺ = A → BC → (B → D) ABCD → (CD → E) ABCDE ✓ → <b>A</b> is a key. E⁺ = E → A → … = all ✓ → <b>E</b> is a key. B⁺ = {B, D}, C⁺ = {C}, D⁺ = {D} ✗.",
            "Pairs not containing A or E: BC, BD, CD. (BC)⁺ = BC → D → (CD → E) → A = all ✓. (CD)⁺ = CD → E → A → B = all ✓. (BD)⁺ = {B, D} ✗.",
            "<b>Candidate keys: A, E, BC, CD.</b> All five attributes are prime → 3NF. B → D: B is not a super key → <b>not BCNF</b>."
          ] },
          { code: `import java.util.*;

public class Closure {
    record FD(String lhs, String rhs) {}

    // X+ : keep applying every FD whose left side is already inside the set
    static Set<Character> closure(String attrs, List<FD> fds) {
        Set<Character> res = new TreeSet<>();
        for (char c : attrs.toCharArray()) res.add(c);
        boolean changed = true;
        while (changed) {
            changed = false;
            for (FD fd : fds) {
                if (containsAll(res, fd.lhs())) {
                    for (char c : fd.rhs().toCharArray()) if (res.add(c)) changed = true;
                }
            }
        }
        return res;
    }

    static boolean containsAll(Set<Character> s, String a) {
        for (char c : a.toCharArray()) if (!s.contains(c)) return false;
        return true;
    }

    // try every subset, smallest first; skip supersets of keys already found (minimality)
    static List<String> candidateKeys(String all, List<FD> fds) {
        int n = all.length();
        List<Integer> masks = new ArrayList<>();
        for (int m = 1; m < (1 << n); m++) masks.add(m);
        masks.sort(Comparator.comparingInt(Integer::bitCount));
        List<Integer> keyMasks = new ArrayList<>();
        List<String> keys = new ArrayList<>();
        for (int m : masks) {
            boolean containsKey = false;
            for (int k : keyMasks) if ((m & k) == k) { containsKey = true; break; }
            if (containsKey) continue;
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) if (((m >> i) & 1) == 1) sb.append(all.charAt(i));
            if (closure(sb.toString(), fds).size() == n) { keyMasks.add(m); keys.add(sb.toString()); }
        }
        return keys;
    }

    static List<FD> parse(String s) {            // "A->B, BC->D"
        List<FD> list = new ArrayList<>();
        for (String part : s.split(",")) {
            String[] lr = part.trim().split("->");
            list.add(new FD(lr[0].trim(), lr[1].trim()));
        }
        return list;
    }

    public static void main(String[] args) {
        System.out.println("(AD)+ = " + closure("AD", parse("A->B, B->C, CD->E, E->F")));
        String[][] sets = {
            {"ABCDE", "A->B, BC->D, D->E"},
            {"ABCD",  "AB->C, C->D, D->A"},
            {"ABCDE", "A->BC, CD->E, B->D, E->A"}
        };
        for (String[] s : sets)
            System.out.println("R(" + s[0] + ") {" + s[1] + "} keys = " + candidateKeys(s[0], parse(s[1])));
    }
}`, lang: "java", title: "Check your hand answers — closure + brute-force candidate keys" },
          { code: `(AD)+ = [A, B, C, D, E, F]
R(ABCDE) {A->B, BC->D, D->E} keys = [AC]
R(ABCD) {AB->C, C->D, D->A} keys = [AB, BC, BD]
R(ABCDE) {A->BC, CD->E, B->D, E->A} keys = [A, E, BC, CD]`, lang: "text", title: "Output" },
          { tip: "In MCQs (GATE-style, also in TCS/Infosys tests) the \"never on the right side\" trick solves most key questions in under a minute. Say it out loud in interviews — it shows method, not guessing." }
        ]
      },
      {
        h: "The normal forms, precisely",
        blocks: [
          { table: { head: ["Form", "Rule", "Violation looks like", "Fix"], rows: [
            ["1NF", "Every cell holds one atomic value; no repeating groups; rows identifiable by a key", "<code>courses = 'DBMS, OS'</code>, or columns phone1, phone2, phone3", "One row per value, or a child table"],
            ["2NF", "1NF + no <b>non-prime</b> attribute depends on a <b>proper subset</b> of any candidate key (no partial dependency)", "Key (roll, course_id) but <code>roll → name</code>", "Move the partial FD into its own table"],
            ["3NF", "2NF + for every non-trivial X → A: X is a super key <b>or</b> A is prime (no transitive dependency of non-prime on key)", "<code>emp_id → dept_id → dept_name</code>", "Move <code>dept_id → dept_name</code> into its own table"],
            ["BCNF", "For every non-trivial X → A: X is a super key. (3NF minus the \"A is prime\" escape)", "<code>teacher → subject</code> where teacher is not a key", "Decompose on the violating FD"]
          ] } },
          { p: "Quick consequences worth memorising:" },
          { ul: [
            "If every candidate key is a <b>single attribute</b>, the relation is automatically in 2NF (no proper subset to depend on).",
            "If <b>every attribute is prime</b>, the relation is automatically in 3NF (the escape clause always applies) — but may still fail BCNF.",
            "A relation with only <b>two attributes</b> is always in BCNF.",
            "BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF. Beyond BCNF: 4NF removes multi-valued dependencies; 5NF join dependencies (rarely asked beyond definition)."
          ] }
        ]
      },
      {
        h: "Three tables normalised step by step",
        blocks: [
          { h: "Table 1 — UNF → 1NF → 2NF (partial dependency)" },
          { code: `UNF:  student_courses
+------+------+--------------------------+
| roll | name | courses (id name grade)  |
+------+------+--------------------------+
| 101  | Asha | CS301 DBMS A, CS302 OS B |
| 102  | Ravi | CS301 DBMS A             |
+------+------+--------------------------+

1NF: one course per row  -> key = (roll, course_id)
+------+------+-----------+-------------+-------+
| roll | name | course_id | course_name | grade |
+------+------+-----------+-------------+-------+
| 101  | Asha | CS301     | DBMS        | A     |
| 101  | Asha | CS302     | OS          | B     |
| 102  | Ravi | CS301     | DBMS        | A     |
+------+------+-----------+-------------+-------+
FDs: roll -> name ;  course_id -> course_name ;  (roll, course_id) -> grade`, lang: "text" },
          { ul: [
            "Candidate key: (roll, course_id). Non-prime: name, course_name, grade.",
            "<code>roll → name</code> and <code>course_id → course_name</code> are <b>partial</b> dependencies → not 2NF. (Symptom: \"DBMS\" repeated for every student.)",
            "Decompose: <b>Student(roll, name)</b>, <b>Course(course_id, course_name)</b>, <b>Enrolment(roll, course_id, grade)</b>.",
            "Each new table: every determinant is its key → already <b>3NF and BCNF</b>."
          ] },
          { h: "Table 2 — 2NF → 3NF (transitive dependency)" },
          { ul: [
            "emp_dept(emp_id, name, dept_id, dept_name, hod) from the anomalies section. FDs: <code>emp_id → name, dept_id</code>; <code>dept_id → dept_name, hod</code>.",
            "Key: emp_id (single attribute) → automatically 2NF.",
            "<code>emp_id → dept_id → dept_name, hod</code>: dept_id is not a super key and dept_name/hod are non-prime → <b>transitive dependency, not 3NF</b>.",
            "Decompose: <b>Employee(emp_id, name, dept_id)</b> + <b>Department(dept_id, dept_name, hod)</b>. Common attribute dept_id is the key of Department → <b>lossless</b>. Both FDs live in one table each → <b>dependency preserving</b>. Both tables are BCNF.",
            "All three anomalies disappear: add a department with no employees, change HOD in one row, delete Kiran without losing HR."
          ] },
          { h: "Table 3 — 3NF → BCNF (and what it costs)" },
          { code: `teaches
+---------+---------+---------+
| student | subject | teacher |
+---------+---------+---------+
| Asha    | DBMS    | Mehta   |
| Asha    | OS      | Rao     |
| Ravi    | DBMS    | Mehta   |
| Kiran   | DBMS    | Iyer    |
+---------+---------+---------+
FDs: (student, subject) -> teacher   -- a student has one teacher per subject
     teacher -> subject              -- each teacher teaches only one subject`, lang: "text" },
          { ul: [
            "Candidate keys: (student, subject) and (student, teacher) — check: (student, teacher)⁺ = {student, teacher, subject} ✓.",
            "All three attributes are prime → <b>3NF holds</b>.",
            "<code>teacher → subject</code>: teacher is not a super key → <b>BCNF violated</b>. Anomaly: \"Mehta teaches DBMS\" is repeated per student; if Kiran drops out we lose that Iyer teaches DBMS.",
            "Decompose on the violator: <b>TeacherSubject(teacher, subject)</b> + <b>StudentTeacher(student, teacher)</b>. Common attribute teacher is the key of TeacherSubject → lossless.",
            "Cost: <code>(student, subject) → teacher</code> spans both tables → <b>not dependency preserving</b>. The DB can no longer stop Asha from getting two DBMS teachers with a simple constraint. This is why many designs stop at 3NF."
          ] },
          { svg: `<svg viewBox="0 0 700 150" width="700" class="dg">
  <rect class="box-w" x="10" y="55" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="85" y="75" text-anchor="middle" dominant-baseline="middle">1NF: atomic</text>
  <line class="ln" x1="160" y1="75" x2="190" y2="75" marker-end="url(#dg-arr)"/>
  <rect class="box" x="190" y="55" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="265" y="75" text-anchor="middle" dominant-baseline="middle">2NF</text>
  <line class="ln" x1="340" y1="75" x2="370" y2="75" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="370" y="55" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="445" y="75" text-anchor="middle" dominant-baseline="middle">3NF</text>
  <line class="ln" x1="520" y1="75" x2="550" y2="75" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="550" y="55" width="140" height="40" rx="6"/>
  <text class="tx tx-b" x="620" y="75" text-anchor="middle" dominant-baseline="middle">BCNF</text>
  <text class="tx-m" x="175" y="120" text-anchor="middle">remove partial deps</text>
  <text class="tx-m" x="355" y="120" text-anchor="middle">remove transitive deps</text>
  <text class="tx-m" x="535" y="120" text-anchor="middle">every determinant a key</text>
  <text class="tx-m" x="175" y="30" text-anchor="middle">Table 1</text>
  <text class="tx-m" x="355" y="30" text-anchor="middle">Table 2</text>
  <text class="tx-m" x="535" y="30" text-anchor="middle">Table 3</text>
</svg>`, caption: "Which step each worked table exercises." }
        ]
      },
      {
        h: "Lossless join and dependency preservation",
        blocks: [
          { p: "<b>Lossless join:</b> joining the pieces gives back exactly the original rows — no missing rows, no <b>spurious</b> (fake) rows. Test for a binary split R → R1, R2: <b>(R1 ∩ R2) → R1 or (R1 ∩ R2) → R2</b>, i.e. the common attributes form a key of at least one side." },
          { code: `R(A, B, C)          split into R1(A, B) and R2(B, C)   -- B is not a key of either
+---+---+---+       R1: (1,x) (2,x)     R2: (x,p) (x,q)
| 1 | x | p |
| 2 | x | q |       R1 JOIN R2 on B:
+---+---+---+       (1,x,p) (1,x,q) (2,x,p) (2,x,q)   <- 2 spurious rows: LOSSY`, lang: "text", title: "A lossy decomposition" },
          { p: "<b>Dependency preservation:</b> every original FD can be checked inside a single decomposed table (or is implied by the FDs that can). If not, enforcing it needs a join on every insert." },
          { table: { head: ["Target", "Lossless", "Dependency preserving"], rows: [
            ["3NF (synthesis algorithm)", "Always achievable", "Always achievable"],
            ["BCNF (decomposition algorithm)", "Always achievable", "<b>Not always</b> (Table 3)"]
          ] } },
          { warn: "Lossless is <b>mandatory</b> — a lossy design corrupts data. Dependency preservation is <b>desirable</b>. Never trade the first for the second." },
          { tip: "Denormalisation is the deliberate reverse: in read-heavy systems (reporting, feeds) you may copy dept_name into orders to avoid a join, and accept the update cost. Mention it after normalisation questions — it shows judgment." }
        ]
      }
    ],
    practice: [
      { q: "R(A,B,C,D,E), F = {A → B, BC → D, D → E} (Set 1). Decompose into 3NF, lossless and dependency preserving.", a: "3NF synthesis: one table per FD (the cover is already minimal) → (A,B), (B,C,D), (D,E). No table contains the key AC, so add (A,C). Result: <b>R1(A,B), R2(B,C,D), R3(D,E), R4(A,C)</b>. Every FD is inside one table, the key table guarantees losslessness, and each table is actually BCNF (A, BC, D are the keys of their tables)." },
      { q: "R(P,Q,R,S), F = {P → Q, Q → R, R → S}. Candidate keys? Highest normal form?", a: "P is never on the right → in every key; P⁺ = PQRS → <b>only key P</b>. Single-attribute key → 2NF holds. Q → R: Q is not a super key and R is non-prime → transitive → <b>not 3NF. Highest = 2NF</b>. Fix: (P,Q), (Q,R), (R,S)." },
      { q: "R(A,B,C,D), F = {A → B, C → D}. Keys and normal form?", a: "A and C never appear on the right → key must include both; (AC)⁺ = ABCD → <b>only key AC</b>. A → B: A is part of the key, B non-prime → partial dependency → <b>1NF only</b>. Decompose: (A,B), (C,D), (A,C)." },
      { q: "Is R(A,B,C) with F = {AB → C, C → B} in BCNF? In 3NF?", a: "Keys: A never on the right. (AB)⁺ = ABC ✓, (AC)⁺ = ACB ✓ → keys AB and AC; A, B, C all prime. C → B: C is not a super key → <b>not BCNF</b>. B is prime → <b>3NF holds</b>. (Same shape as the student/subject/teacher table.)" },
      { q: "Is splitting R(A,B,C) with F = {A → B} into (A,B) and (A,C) lossless? Into (A,B) and (B,C)?", a: "(A,B) ∩ (A,C) = A, and A → B makes A a key of (A,B) → <b>lossless</b>. (A,B) ∩ (B,C) = B; B → A? no; B → C? no → B is a key of neither → <b>lossy</b>." }
    ],
    related: ["dbms:functional-dependency", "dbms:normalization-forms", "dbms:3nf-vs-bcnf", "dbms:anomalies", "dbms:lossless-dependency-preservation", "dbms:fourth-nf", "dbms:denormalization", "dbms:types-of-keys"]
  });

  /* ------------------------------------------------------------------ */
  /* D17 — Transactions, serializability, isolation levels               */
  /* ------------------------------------------------------------------ */
  add({
    id: "dbms-transactions-isolation",
    subject: "dbms",
    title: "Transactions, ACID, serializability & the isolation-level grid",
    minutes: 90,
    crux: [
      "A <b>transaction</b> is a unit of work that must happen entirely or not at all. <b>ACID</b>: Atomicity (undo log), Consistency (constraints hold), Isolation (concurrency control), Durability (redo log / WAL).",
      "States: Active → Partially committed → Committed; or Active/Partially committed → Failed → Aborted.",
      "Two operations <b>conflict</b> if they are from different transactions, touch the same item, and at least one is a <b>write</b>. A schedule is <b>conflict serializable</b> iff its <b>precedence graph has no cycle</b>.",
      "Anomalies: <b>dirty read</b> (read uncommitted data), <b>non-repeatable read</b> (same row, different value), <b>phantom</b> (same query, new rows), <b>lost update</b> (one write overwrites another).",
      "Grid: <b>Read Uncommitted</b> allows all three; <b>Read Committed</b> stops dirty; <b>Repeatable Read</b> stops dirty + non-repeatable; <b>Serializable</b> stops all. Each level up kills one more anomaly.",
      "Defaults: <b>MySQL InnoDB = REPEATABLE READ</b>, <b>PostgreSQL / Oracle / SQL Server = READ COMMITTED</b>."
    ],
    sections: [
      {
        h: "Transactions and ACID",
        blocks: [
          { p: "Transferring ₹500 from A to B is two writes: <code>A = A − 500</code> and <code>B = B + 500</code>. If the server crashes between them, money vanishes. A transaction wraps both so the database treats them as one indivisible step." },
          { table: { head: ["Property", "Guarantee", "How the DBMS provides it"], rows: [
            ["Atomicity", "All operations happen or none do", "Undo log / rollback segment: on failure, undo partial changes"],
            ["Consistency", "A transaction moves the DB from one valid state to another (constraints, FKs, business rules)", "Constraints + correct application logic (A + B is the same before and after)"],
            ["Isolation", "Concurrent transactions do not see each other's intermediate state; result as if run in some serial order (at SERIALIZABLE)", "Locks (2PL) or MVCC snapshots"],
            ["Durability", "Once committed, it survives a crash", "Write-ahead log (redo) flushed to disk at commit"]
          ] } },
          { code: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Transfer {
    // A JDBC connection is in auto-commit mode by default: every statement is its own transaction.
    static void transfer(Connection con, long from, long to, long amount) throws SQLException {
        boolean oldAuto = con.getAutoCommit();
        con.setAutoCommit(false);                                    // BEGIN
        con.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
        try (PreparedStatement debit = con.prepareStatement(
                 "UPDATE account SET balance = balance - ? WHERE id = ? AND balance >= ?");
             PreparedStatement credit = con.prepareStatement(
                 "UPDATE account SET balance = balance + ? WHERE id = ?")) {
            debit.setLong(1, amount); debit.setLong(2, from); debit.setLong(3, amount);
            if (debit.executeUpdate() != 1) throw new SQLException("insufficient funds");
            credit.setLong(1, amount); credit.setLong(2, to);
            credit.executeUpdate();
            con.commit();                                            // both or ...
        } catch (SQLException e) {
            con.rollback();                                          // ... neither
            throw e;
        } finally {
            con.setAutoCommit(oldAuto);
        }
    }

    public static void main(String[] args) {
        System.out.println("transfer() needs a live Connection, e.g. DriverManager.getConnection(url)");
    }
}`, lang: "java", title: "ACID from Java — manual commit / rollback" },
          { h: "Transaction states" },
          { svg: `<svg viewBox="0 0 720 175" width="720" class="dg">
  <rect class="box-a" x="20" y="70" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="75" y="88" text-anchor="middle" dominant-baseline="middle">Active</text>
  <rect class="box" x="190" y="20" width="160" height="36" rx="6"/>
  <text class="tx tx-b" x="270" y="38" text-anchor="middle" dominant-baseline="middle">Partially committed</text>
  <rect class="box-g" x="420" y="20" width="120" height="36" rx="6"/>
  <text class="tx tx-b" x="480" y="38" text-anchor="middle" dominant-baseline="middle">Committed</text>
  <rect class="box-r" x="190" y="120" width="160" height="36" rx="6"/>
  <text class="tx tx-b" x="270" y="138" text-anchor="middle" dominant-baseline="middle">Failed</text>
  <rect class="box-r" x="420" y="120" width="120" height="36" rx="6"/>
  <text class="tx tx-b" x="480" y="138" text-anchor="middle" dominant-baseline="middle">Aborted</text>
  <rect class="box" x="590" y="70" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="645" y="88" text-anchor="middle" dominant-baseline="middle">Terminated</text>
  <line class="ln" x1="130" y1="80" x2="188" y2="46" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="130" y1="96" x2="188" y2="130" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="350" y1="38" x2="418" y2="38" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="270" y1="56" x2="270" y2="118" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="350" y1="138" x2="418" y2="138" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="540" y1="44" x2="588" y2="78" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="540" y1="132" x2="588" y2="98" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="384" y="30" text-anchor="middle">log flushed</text>
  <text class="tx-m" x="384" y="130" text-anchor="middle">rolled back</text>
  <text class="tx-m" x="140" y="58" text-anchor="middle">last stmt</text>
  <text class="tx-m" x="140" y="124" text-anchor="middle">error</text>
</svg>`, caption: "Partially committed = last statement executed, changes may still be only in memory. A crash here still leads to Failed." },
          { p: "After <b>Aborted</b> the system can <b>restart</b> the transaction (if the failure was not a logic error, e.g. deadlock victim) or <b>kill</b> it." }
        ]
      },
      {
        h: "Schedules and serializability",
        blocks: [
          { p: "A <b>schedule</b> is the interleaved order of operations of concurrent transactions. Notation: <code>R1(A)</code> = T1 reads A, <code>W2(B)</code> = T2 writes B." },
          { ul: [
            "<b>Serial</b> schedule — one transaction finishes before the next starts. Always correct, no concurrency.",
            "<b>Serializable</b> schedule — interleaved, but produces the same result as <i>some</i> serial order. This is our correctness goal.",
            "<b>Conflict serializable</b> — can be turned into a serial schedule by swapping adjacent <i>non-conflicting</i> operations.",
            "<b>View serializable</b> — same reads-from relationships and same final writer as some serial schedule. Every conflict-serializable schedule is view serializable, not vice versa (difference = <b>blind writes</b>)."
          ] },
          { table: { head: ["Pair (different txns, same item)", "Conflict?"], rows: [
            ["R–R", "No — order does not matter"],
            ["R–W", "Yes"],
            ["W–R", "Yes"],
            ["W–W", "Yes"]
          ] } },
          { h: "Precedence-graph test (worked)" },
          { ol: [
            "One node per transaction.",
            "For every conflicting pair where Ti's operation comes <b>before</b> Tj's, draw Ti → Tj.",
            "No cycle → conflict serializable; a <b>topological order</b> of the graph is an equivalent serial order. Cycle → not conflict serializable."
          ] },
          { p: "<b>Example 1:</b> S = R2(A) R1(B) W2(A) R3(A) W1(B) W3(A) R2(B) W2(B)" },
          { table: { head: ["Item", "Conflicting pairs in order", "Edge"], rows: [
            ["A", "W2(A) … R3(A); R2(A)/W2(A) … W3(A)", "T2 → T3"],
            ["B", "W1(B) … R2(B); R1(B)/W1(B) … W2(B)", "T1 → T2"]
          ] } },
          { p: "Edges T1 → T2 → T3, no cycle → <b>conflict serializable, equivalent to T1, T2, T3</b>." },
          { p: "<b>Example 2:</b> S = R1(A) R2(A) W1(A) W2(A) (both read the balance, both write it)." },
          { ul: [
            "R1(A) before W2(A) → T1 → T2.",
            "R2(A) before W1(A) → T2 → T1.",
            "Cycle → <b>not conflict serializable</b>. This is exactly the <b>lost update</b> — T1's write is overwritten by T2, which never saw it."
          ] },
          { svg: `<svg viewBox="0 0 700 140" width="700" class="dg">
  <text class="tx tx-b" x="180" y="16" text-anchor="middle">Example 1 — acyclic</text>
  <circle class="box-g" cx="60" cy="75" r="24"/>
  <text class="tx tx-b" x="60" y="75" text-anchor="middle" dominant-baseline="middle">T1</text>
  <circle class="box-g" cx="180" cy="75" r="24"/>
  <text class="tx tx-b" x="180" y="75" text-anchor="middle" dominant-baseline="middle">T2</text>
  <circle class="box-g" cx="300" cy="75" r="24"/>
  <text class="tx tx-b" x="300" y="75" text-anchor="middle" dominant-baseline="middle">T3</text>
  <line class="ln" x1="84" y1="75" x2="154" y2="75" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="204" y1="75" x2="274" y2="75" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="119" y="65" text-anchor="middle">B</text>
  <text class="tx-m" x="239" y="65" text-anchor="middle">A</text>
  <text class="tx-m" x="180" y="125" text-anchor="middle">serial order T1, T2, T3</text>
  <text class="tx tx-b" x="540" y="16" text-anchor="middle">Example 2 — cycle</text>
  <circle class="box-r" cx="460" cy="75" r="24"/>
  <text class="tx tx-b" x="460" y="75" text-anchor="middle" dominant-baseline="middle">T1</text>
  <circle class="box-r" cx="620" cy="75" r="24"/>
  <text class="tx tx-b" x="620" y="75" text-anchor="middle" dominant-baseline="middle">T2</text>
  <path class="ln" d="M 480 62 Q 540 30 598 62" marker-end="url(#dg-arr)"/>
  <path class="ln" d="M 600 88 Q 540 120 482 88" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="540" y="36" text-anchor="middle">R1(A) → W2(A)</text>
  <text class="tx-m" x="540" y="125" text-anchor="middle">R2(A) → W1(A)</text>
</svg>`, caption: "Precedence graphs. Edge labels show the item (or the conflicting pair) that created the edge." },
          { p: "<b>Example 3 (view but not conflict serializable):</b> S = R1(A) W2(A) W1(A) W3(A). Conflicts give T1 → T2 (R1 before W2) and T2 → T1 (W2 before W1) — cycle. But compare with serial T1, T2, T3: T1 reads the initial A in both, and T3 does the final write in both → <b>view equivalent</b>, so the schedule is view serializable. W2(A) and W3(A) are blind writes (write without reading)." },
          { h: "Recoverability (often asked right after)" },
          { ul: [
            "<b>Recoverable</b>: if Tj reads a value written by Ti, Ti commits before Tj commits. Otherwise Tj could commit data that later gets rolled back — unrecoverable.",
            "<b>Cascadeless</b>: transactions only read <i>committed</i> data, so one abort never forces others to abort (no cascading rollback).",
            "<b>Strict</b>: no one reads <i>or writes</i> an item until the last writer of it commits/aborts. Strict ⊂ cascadeless ⊂ recoverable. Strict 2PL produces strict schedules."
          ] }
        ]
      },
      {
        h: "Concurrency anomalies — with timelines",
        blocks: [
          { p: "Account balance starts at ₹1000. Read each table top to bottom." },
          { h: "Dirty read" },
          { table: { head: ["t", "T1", "T2"], rows: [
            ["1", "UPDATE acc SET bal = 500", ""],
            ["2", "", "SELECT bal → <b>500</b>"],
            ["3", "ROLLBACK (bal back to 1000)", ""],
            ["4", "", "uses 500 — a value that never officially existed"]
          ] } },
          { h: "Non-repeatable read" },
          { table: { head: ["t", "T1", "T2"], rows: [
            ["1", "SELECT bal → 1000", ""],
            ["2", "", "UPDATE acc SET bal = 500; COMMIT"],
            ["3", "SELECT bal → <b>500</b> (same row, different value)", ""]
          ] } },
          { h: "Phantom read" },
          { table: { head: ["t", "T1", "T2"], rows: [
            ["1", "SELECT COUNT(*) FROM emp WHERE dept='CS' → 10", ""],
            ["2", "", "INSERT INTO emp (…, dept) VALUES (…, 'CS'); COMMIT"],
            ["3", "SELECT COUNT(*) … → <b>11</b> (a new \"phantom\" row)", ""]
          ] } },
          { h: "Lost update" },
          { table: { head: ["t", "T1 (withdraw 200)", "T2 (deposit 300)"], rows: [
            ["1", "read bal → 1000", ""],
            ["2", "", "read bal → 1000"],
            ["3", "write bal = 800; COMMIT", ""],
            ["4", "", "write bal = 1300; COMMIT"],
            ["5", "final = <b>1300</b>, should be 1100 — T1's withdrawal is lost", ""]
          ] } },
          { p: "Fixes for lost update: write it atomically (<code>UPDATE acc SET bal = bal - 200</code>), lock the row when reading (<code>SELECT … FOR UPDATE</code>), or optimistic locking with a version column (<code>UPDATE … SET bal = ?, version = version + 1 WHERE id = ? AND version = ?</code> and retry if 0 rows)." },
          { warn: "Non-repeatable read vs phantom: non-repeatable = an <b>existing row changed</b> (UPDATE/DELETE by others); phantom = the <b>set of rows matching a condition changed</b> (INSERT by others). Interviewers probe exactly this difference." }
        ]
      },
      {
        h: "The isolation-level grid (memorise and reproduce)",
        blocks: [
          { table: { head: ["Isolation level", "Dirty read", "Non-repeatable read", "Phantom read"], rows: [
            ["READ UNCOMMITTED", "Possible", "Possible", "Possible"],
            ["READ COMMITTED", "<b>Prevented</b>", "Possible", "Possible"],
            ["REPEATABLE READ", "<b>Prevented</b>", "<b>Prevented</b>", "Possible (per SQL standard)"],
            ["SERIALIZABLE", "<b>Prevented</b>", "<b>Prevented</b>", "<b>Prevented</b>"]
          ] } },
          { p: "<b>Reproduce it in 20 seconds:</b> write the four levels top to bottom and the three anomalies left to right in the order <i>dirty → non-repeatable → phantom</i>. Then draw a staircase: each row down prevents one more column. That is the whole grid." },
          { h: "What real databases do (bonus points)" },
          { table: { head: ["", "MySQL 8 (InnoDB)", "PostgreSQL"], rows: [
            ["Default level", "REPEATABLE READ", "READ COMMITTED"],
            ["READ UNCOMMITTED", "Really allows dirty reads", "Behaves as READ COMMITTED (never dirty)"],
            ["REPEATABLE READ", "Plain SELECTs read one snapshot (MVCC); locking reads use next-key (gap) locks, so phantoms are largely prevented", "Snapshot isolation — no phantoms; a conflicting concurrent update aborts with a serialization error"],
            ["Lost update at REPEATABLE READ", "<b>Still possible</b> for read-then-write in the app — use <code>SELECT … FOR UPDATE</code>", "Detected: second writer gets \"could not serialize access\" and must retry"],
            ["SERIALIZABLE", "Plain SELECTs become locking reads (FOR SHARE) when autocommit is off", "Serializable Snapshot Isolation (SSI) — aborts transactions that could form a cycle"]
          ] } },
          { code: `-- MySQL: for this session
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT @@transaction_isolation;

-- PostgreSQL: for one transaction
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM account WHERE id = 1;
COMMIT;
SHOW transaction_isolation;`, lang: "sql", title: "Setting the level" },
          { tip: "Higher isolation = fewer anomalies but more blocking / aborts and lower throughput. A strong answer: \"Most OLTP apps run at READ COMMITTED and protect critical read-modify-write paths with row locks or optimistic versioning, instead of paying for SERIALIZABLE everywhere.\"" },
          { warn: "Snapshot isolation (PostgreSQL REPEATABLE READ) still allows <b>write skew</b>: two doctors each check \"at least one other doctor is on call\", both go off call, both commit — zero doctors on call. Only SERIALIZABLE prevents it." }
        ]
      }
    ],
    practice: [
      { q: "Write the isolation grid from memory, then state which level is the default in MySQL and in PostgreSQL.", a: "RU: dirty ✓, NRR ✓, phantom ✓ (all possible). RC: dirty ✗, NRR ✓, phantom ✓. RR: dirty ✗, NRR ✗, phantom ✓. SERIALIZABLE: all ✗. Defaults: MySQL InnoDB = REPEATABLE READ; PostgreSQL = READ COMMITTED." },
      { q: "Is S = R1(X) R2(X) W2(X) R3(X) W1(Y) W3(X) conflict serializable? If yes, give the serial order.", a: "On X: R1(X) before W2(X) → T1 → T2; R1(X) before W3(X) → T1 → T3; W2(X) before R3(X) and before W3(X) → T2 → T3; R2(X) before W3(X) → T2 → T3. On Y only T1 writes — no conflict. Edges: T1 → T2, T1 → T3, T2 → T3. No cycle → <b>serializable as T1, T2, T3</b>." },
      { q: "Is S = R1(A) W2(A) R2(B) W1(B) conflict serializable?", a: "A: R1(A) before W2(A) → T1 → T2. B: R2(B) before W1(B) → T2 → T1. <b>Cycle → not conflict serializable.</b> (No blind writes, so it is not view serializable either.)" },
      { q: "T2 reads a value written by T1 and commits. Then T1 aborts. What property is violated and how does strict 2PL prevent it?", a: "The schedule is <b>not recoverable</b>: T2 committed based on data that no longer exists. Strict 2PL holds T1's exclusive lock until T1 commits/aborts, so T2 cannot read the item until then — no dirty read, schedule is strict (hence recoverable and cascadeless)." },
      { q: "A ticket-booking service reads available_seats, checks > 0, then writes available_seats − 1. Under MySQL's default level two users both get the last seat. Why, and give two fixes.", a: "REPEATABLE READ does not stop a read-then-write <b>lost update</b>: both plain SELECTs read 1 from their snapshot, both write 0. Fixes: (1) <code>SELECT available_seats FROM show WHERE id = ? FOR UPDATE</code> so the second transaction waits; (2) do it atomically: <code>UPDATE show SET available_seats = available_seats - 1 WHERE id = ? AND available_seats > 0</code> and check that 1 row was updated. (3) Optimistic version column also works." }
    ],
    related: ["dbms:acid-properties", "dbms:transaction-states", "dbms:schedules-serializability", "dbms:recoverable-schedules", "dbms:concurrency-problems", "dbms:isolation-levels", "dbms:optimistic-vs-pessimistic", "dbms:log-based-recovery-wal", "dbms:mvcc"]
  });

  /* ------------------------------------------------------------------ */
  /* D18 — Indexing (window functions are in the SQL lessons)            */
  /* ------------------------------------------------------------------ */
  add({
    id: "dbms-indexing",
    subject: "dbms",
    title: "Indexing: B-tree vs B+ tree, clustered, composite, when indexes hurt",
    minutes: 60,
    crux: [
      "An index is a separate sorted structure (usually a <b>B+ tree</b>) that turns a full table scan O(n) into a lookup O(log n) — at the cost of extra storage and slower writes.",
      "<b>B+ tree</b>: data/row pointers only in the <b>leaves</b>, leaves are <b>linked</b>; internal nodes hold only keys → higher fan-out, shorter tree, fast range scans. That is why databases use B+ trees, not plain B-trees.",
      "<b>Clustered</b> index = the table rows themselves are stored in index order (one per table; InnoDB clusters on the PK). <b>Non-clustered</b> = separate structure pointing to rows; can have many.",
      "Composite index (a, b, c) works for filters on <b>a</b>, <b>a,b</b>, <b>a,b,c</b> — the <b>leftmost prefix</b>. Not for b or c alone. A range on a column stops the seek from using later columns.",
      "Indexes hurt on write-heavy tables, low-selectivity columns, tiny tables, and are silently skipped when you wrap the column in a function, use a leading <code>%</code>, or force a type conversion."
    ],
    sections: [
      {
        h: "Why an index, and why a tree",
        blocks: [
          { p: "Without an index, <code>SELECT * FROM orders WHERE customer_id = 42</code> reads every row (full table scan). Disk and buffer pool work in <b>pages</b> (InnoDB: 16 KB; PostgreSQL: 8 KB), so the goal is to <b>touch as few pages as possible</b>. A balanced tree with hundreds of keys per node does this: each level is one page read." },
          { p: "<b>Height math:</b> if one internal page holds about 1000 child pointers, 3 levels reach 1000 × 1000 = 10⁶ leaf pages; with ~100 rows per leaf that is ~10⁸ rows in 3–4 page reads, and the top levels are almost always cached in memory." },
          { table: { head: ["Structure", "Equality", "Range / ORDER BY", "Notes"], rows: [
            ["B+ tree", "O(log n)", "Yes — walk linked leaves", "Default in MySQL, PostgreSQL, Oracle"],
            ["Hash index", "O(1) average", "No", "PostgreSQL <code>USING HASH</code>; InnoDB builds an internal adaptive hash index automatically"],
            ["Bitmap", "Good for low-cardinality columns", "Combines well with AND/OR", "Data warehouses (Oracle); PostgreSQL builds bitmaps at query time (Bitmap Heap Scan)"]
          ] } }
        ]
      },
      {
        h: "B-tree vs B+ tree",
        blocks: [
          { svg: `<svg viewBox="0 0 720 200" width="720" class="dg">
  <text class="tx tx-b" x="170" y="14" text-anchor="middle">B-tree</text>
  <rect class="box" x="110" y="30" width="120" height="30" rx="4"/>
  <text class="tx tx-c" x="170" y="45" text-anchor="middle" dominant-baseline="middle">30* | 60*</text>
  <rect class="box" x="10" y="110" width="100" height="30" rx="4"/>
  <text class="tx tx-c" x="60" y="125" text-anchor="middle" dominant-baseline="middle">10* | 20*</text>
  <rect class="box" x="120" y="110" width="100" height="30" rx="4"/>
  <text class="tx tx-c" x="170" y="125" text-anchor="middle" dominant-baseline="middle">40* | 50*</text>
  <rect class="box" x="230" y="110" width="100" height="30" rx="4"/>
  <text class="tx tx-c" x="280" y="125" text-anchor="middle" dominant-baseline="middle">70* | 80*</text>
  <line class="ln" x1="125" y1="60" x2="60" y2="110"/>
  <line class="ln" x1="170" y1="60" x2="170" y2="110"/>
  <line class="ln" x1="215" y1="60" x2="280" y2="110"/>
  <text class="tx-m" x="170" y="170" text-anchor="middle">* = key + row data/pointer, in every node</text>
  <text class="tx-m" x="170" y="188" text-anchor="middle">each key appears once; no leaf links</text>
  <text class="tx tx-b" x="545" y="14" text-anchor="middle">B+ tree</text>
  <rect class="box-a" x="485" y="30" width="120" height="30" rx="4"/>
  <text class="tx tx-c" x="545" y="45" text-anchor="middle" dominant-baseline="middle">30 | 60</text>
  <rect class="box-g" x="380" y="110" width="90" height="30" rx="4"/>
  <text class="tx tx-c" x="425" y="125" text-anchor="middle" dominant-baseline="middle">10* 20*</text>
  <rect class="box-g" x="490" y="110" width="100" height="30" rx="4"/>
  <text class="tx tx-c" x="540" y="125" text-anchor="middle" dominant-baseline="middle">30* 40* 50*</text>
  <rect class="box-g" x="610" y="110" width="100" height="30" rx="4"/>
  <text class="tx tx-c" x="660" y="125" text-anchor="middle" dominant-baseline="middle">60* 70* 80*</text>
  <line class="ln" x1="500" y1="60" x2="425" y2="110"/>
  <line class="ln" x1="545" y1="60" x2="540" y2="110"/>
  <line class="ln" x1="590" y1="60" x2="660" y2="110"/>
  <line class="ln-a" x1="470" y1="125" x2="488" y2="125" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="590" y1="125" x2="608" y2="125" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="545" y="170" text-anchor="middle">internal nodes: routing keys only (30, 60 repeat in leaves)</text>
  <text class="tx-m" x="545" y="188" text-anchor="middle">leaves: all keys + data, linked for range scans</text>
</svg>`, caption: "Same keys, two structures. A range query 25–65 in the B+ tree: descend once to the leaf holding 30, then follow the leaf links until 70." },
          { table: { head: ["", "B-tree", "B+ tree"], rows: [
            ["Where data lives", "In internal nodes and leaves", "Only in leaves"],
            ["Internal nodes", "Keys + data pointers", "Keys only → more keys per page → <b>higher fan-out, shorter tree</b>"],
            ["Duplicate keys across levels", "No", "Yes — separator keys are copies of leaf keys"],
            ["Search cost", "Can stop early at an internal node", "Always goes to a leaf (uniform, predictable)"],
            ["Range scan", "In-order traversal across levels (slow)", "Find the start leaf, then follow <b>linked leaves</b>"],
            ["Used by", "Some file systems / key-value stores", "Almost every RDBMS index (InnoDB, PostgreSQL btree)"]
          ] } },
          { tip: "Why B+ trees for databases, in one breath: \"Internal nodes carry no data, so a 16 KB page fits hundreds of keys and the tree stays 3–4 levels deep; and the linked leaves make range queries and ORDER BY a sequential scan.\"" }
        ]
      },
      {
        h: "Clustered vs non-clustered",
        blocks: [
          { table: { head: ["", "Clustered", "Non-clustered (secondary)"], rows: [
            ["What it is", "The table's rows are physically stored in index-key order — the leaf level <i>is</i> the table", "A separate B+ tree whose leaves hold the key + a pointer to the row"],
            ["How many", "At most one per table", "Many"],
            ["Range on the key", "Very fast — rows are contiguous", "Each match may need a random read of the row"],
            ["MySQL InnoDB", "Always the PRIMARY KEY (else first NOT NULL UNIQUE, else hidden row id)", "Leaf stores the <b>PK value</b>; row fetch = second lookup in the clustered index"],
            ["PostgreSQL", "No maintained clustered index; table is a heap. <code>CLUSTER</code> reorders once only", "All indexes point to heap tuple ids (ctid)"]
          ] } },
          { p: "<b>Covering index:</b> if the index contains every column the query needs, the DB answers from the index alone — no row lookup. MySQL EXPLAIN shows <code>Using index</code>; PostgreSQL shows <code>Index Only Scan</code>." },
          { code: `CREATE INDEX idx_orders_cust_date ON orders (customer_id, order_date);

-- Covered: both columns are in the index, no table lookup needed
SELECT customer_id, order_date FROM orders WHERE customer_id = 42;

-- Not covered: amount is not in the index -> lookup for each match
SELECT order_date, amount       FROM orders WHERE customer_id = 42;`, lang: "sql" },
          { warn: "In InnoDB every secondary index stores the primary key. A long PK (e.g. a VARCHAR(100) email, or a random UUID string) bloats every index. Random UUID PKs also insert into random leaf pages → page splits and fragmentation. Prefer a compact, increasing PK (BIGINT auto-increment or time-ordered UUID)." }
        ]
      },
      {
        h: "Composite indexes and the leftmost prefix",
        blocks: [
          { p: "An index on <code>(dept_id, salary, age)</code> is sorted like a phone book: by dept_id, then salary within a dept, then age within a salary. You can only binary-search a phone book starting from the <b>first</b> sort key." },
          { code: `CREATE INDEX idx_emp_d_s_a ON employee (dept_id, salary, age);`, lang: "sql" },
          { table: { head: ["WHERE clause", "Index used for the seek?", "Why"], rows: [
            ["dept_id = 10", "Yes (dept_id)", "Leftmost column"],
            ["dept_id = 10 AND salary = 50000", "Yes (dept_id, salary)", "Leftmost prefix of 2"],
            ["dept_id = 10 AND salary = 50000 AND age = 30", "Yes (all three)", "Full prefix"],
            ["age = 30 AND dept_id = 10 AND salary = 50000", "Yes (all three)", "Order inside WHERE does not matter; the optimiser reorders"],
            ["dept_id = 10 AND salary > 50000 AND age = 30", "dept_id, salary", "Range on salary — rows after it are not sorted by age, so age is only filtered"],
            ["dept_id = 10 AND age = 30", "dept_id only", "Gap at salary; age checked on index entries (MySQL: index condition pushdown)"],
            ["salary = 50000", "Normally no", "Leading column missing (MySQL 8 may use a <i>skip scan</i> when dept_id has very few values)"],
            ["age = 30", "No", "Not a prefix"]
          ] } },
          { p: "Also: <code>ORDER BY dept_id, salary</code> can read the index in order and skip the sort; <code>ORDER BY salary</code> alone cannot." },
          { tip: "Column order rule of thumb: <b>equality columns first, then the range/sort column</b>; among equality columns, put the one used by the most queries first. Selectivity matters less than prefix reuse." }
        ]
      },
      {
        h: "When indexes hurt (or silently do nothing)",
        blocks: [
          { table: { head: ["Situation", "Problem", "Better"], rows: [
            ["Write-heavy table", "Every INSERT/UPDATE/DELETE must update every index; more page splits, more WAL", "Index only what queries need; drop unused indexes"],
            ["Low-selectivity column (gender, is_active)", "Matches a large fraction of rows; random row lookups cost more than one sequential scan, so the optimiser ignores the index", "Composite index with a selective column, or a partial index (PostgreSQL <code>WHERE is_active</code>)"],
            ["Tiny table", "A scan of a few pages is already cheapest", "No index needed beyond the PK"],
            ["Function on the column: <code>WHERE YEAR(created_at) = 2024</code>", "Index on created_at is not used", "<code>created_at &gt;= '2024-01-01' AND created_at &lt; '2025-01-01'</code>, or an expression index"],
            ["Leading wildcard: <code>LIKE '%kumar'</code>", "B+ tree is sorted by prefix, cannot seek", "<code>LIKE 'kumar%'</code> works; use full-text / trigram index for contains-search"],
            ["Type mismatch: VARCHAR phone compared to a number", "Implicit cast on the column disables the index (MySQL)", "Compare with the same type: <code>phone = '9876543210'</code>"],
            ["OR across different columns", "May fall back to a full scan", "Separate indexes (index merge / bitmap OR) or UNION"],
            ["Too many overlapping indexes", "(a) and (a, b) — the first is redundant", "Keep (a, b); it serves both"]
          ] } },
          { warn: "\"Just add an index on every column\" is a red-flag answer. Say: index the columns in WHERE / JOIN / ORDER BY of the <i>frequent</i> queries, verify with EXPLAIN, and watch write latency." }
        ]
      }
    ],
    practice: [
      { q: "Index on (city, age). Which of these can seek with the index: (a) WHERE city='Pune' (b) WHERE age=25 (c) WHERE city='Pune' AND age > 25 (d) WHERE age=25 AND city='Pune' ORDER BY age?", a: "(a) yes — leftmost. (b) no — leading column missing. (c) yes — equality on city then range on age, both used. (d) yes — both columns (WHERE order is irrelevant), and since city is fixed, rows come out already sorted by age, so no extra sort." },
      { q: "Why does InnoDB's secondary index lookup sometimes cost two tree descents?", a: "Secondary-index leaves store the primary key, not a physical address. After finding the PK in the secondary B+ tree, InnoDB descends the clustered (PK) B+ tree to fetch the row. A covering index avoids the second descent." },
      { q: "A B+ tree internal page holds 500 pointers and each leaf holds 50 records. How many records can a 3-level tree (root + 1 internal level + leaves) index?", a: "Root → 500 internal nodes → 500 × 500 = 250,000 leaves → 250,000 × 50 = <b>12,500,000 records</b>, reachable in 3 page reads." },
      { q: "Query <code>WHERE LOWER(email) = 'a@b.com'</code> is slow despite an index on email. Why and fix?", a: "Applying a function to the column means the index (sorted by raw email) cannot be searched. Fix: store emails already lower-cased and compare directly, or create an expression index — PostgreSQL <code>CREATE INDEX ON users (LOWER(email))</code>, MySQL 8.0.13+ <code>CREATE INDEX idx ON users ((LOWER(email)))</code>." },
      { q: "Clustered vs non-clustered in two lines, and how many of each per table?", a: "Clustered: the table rows themselves are stored in key order (the index leaves <i>are</i> the rows) — one per table. Non-clustered: a separate sorted structure with pointers (or PKs) to rows — many per table." }
    ],
    related: ["dbms:what-is-index", "dbms:btree-vs-bplus-tree", "dbms:clustered-vs-nonclustered", "dbms:composite-index", "dbms:when-indexes-hurt", "dbms:hash-index", "dbms:query-optimization-explain"]
  });

  /* ------------------------------------------------------------------ */
  /* D22 — Locks, 2PL, MVCC, deadlock, EXPLAIN, N+1                      */
  /* ------------------------------------------------------------------ */
  add({
    id: "dbms-locking-mvcc-optimisation",
    subject: "dbms",
    title: "Locks, 2PL, MVCC, deadlocks, EXPLAIN & the N+1 problem",
    minutes: 80,
    crux: [
      "<b>Shared (S)</b> lock for reading — many holders; <b>Exclusive (X)</b> lock for writing — one holder, blocks S and X. Only S–S is compatible.",
      "<b>2PL</b>: a growing phase (acquire only) then a shrinking phase (release only) → guarantees <b>conflict serializability</b>, but not freedom from deadlock or cascading aborts. <b>Strict 2PL</b> keeps X locks until commit → no cascading aborts.",
      "<b>MVCC</b> keeps old versions of rows so <b>readers never block writers and writers never block readers</b>; each transaction reads a consistent snapshot. Writers still lock rows against other writers.",
      "Deadlock = cycle in the <b>wait-for graph</b>. Databases detect it and roll back a victim (MySQL error 1213, PostgreSQL 40P01). Prevention: lock in a fixed order, keep transactions short, retry.",
      "Read plans with <b>EXPLAIN</b> (estimates) / <b>EXPLAIN ANALYZE</b> (actually runs). Red flags: full scan (<code>type=ALL</code> / Seq Scan) on big tables, <code>Using filesort</code>, <code>Using temporary</code>, big estimate-vs-actual gaps.",
      "<b>N+1</b>: 1 query for the parents + 1 query per parent for children. Fix with one JOIN (JPA <code>JOIN FETCH</code> / <code>@EntityGraph</code>) or one batched <code>IN (…)</code> query."
    ],
    sections: [
      {
        h: "Shared and exclusive locks",
        blocks: [
          { table: { head: ["Held \\ Requested", "S (read)", "X (write)"], rows: [
            ["S", "<b>Granted</b>", "Wait"],
            ["X", "Wait", "Wait"]
          ] } },
          { ul: [
            "Lock <b>granularity</b>: row, page, table. Finer = more concurrency, more lock-management overhead. InnoDB and PostgreSQL lock rows.",
            "<b>Intention locks</b> (IS, IX) are table-level flags saying \"someone holds row locks inside\" so a table-level lock request can be checked quickly without scanning every row lock.",
            "<b>Lock upgrade</b>: S → X when a transaction that read a row now wants to write it — a classic deadlock source when two transactions do it at once.",
            "Explicit row locks in SQL: <code>SELECT … FOR SHARE</code> (S) and <code>SELECT … FOR UPDATE</code> (X). Both work in MySQL 8 and PostgreSQL."
          ] },
          { code: `START TRANSACTION;
SELECT balance FROM account WHERE id = 1 FOR UPDATE;   -- X lock on row 1; others wait
UPDATE account SET balance = balance - 500 WHERE id = 1;
COMMIT;                                                -- lock released here`, lang: "sql", title: "Pessimistic row lock" }
        ]
      },
      {
        h: "Two-phase locking (2PL) and strict 2PL",
        blocks: [
          { p: "<b>Rule:</b> once a transaction releases <i>any</i> lock, it may never acquire another. The moment it holds its last new lock is the <b>lock point</b>; ordering transactions by lock point gives the equivalent serial order — that is why 2PL guarantees conflict serializability." },
          { svg: `<svg viewBox="0 0 700 175" width="700" class="dg">
  <text class="tx tx-b" x="180" y="12" text-anchor="middle">Basic 2PL</text>
  <line class="ln" x1="40" y1="140" x2="320" y2="140"/>
  <line class="ln" x1="40" y1="140" x2="40" y2="25"/>
  <polyline class="ln-a" points="40,140 80,112 120,82 160,50 200,82 240,112 280,140"/>
  <text class="tx-m" x="160" y="40" text-anchor="middle">lock point</text>
  <text class="tx-m" x="100" y="158" text-anchor="middle">growing</text>
  <text class="tx-m" x="230" y="158" text-anchor="middle">shrinking</text>
  <text class="tx-m" x="30" y="85" text-anchor="middle" transform="rotate(-90 30 85)">locks held</text>
  <text class="tx tx-b" x="530" y="12" text-anchor="middle">Strict 2PL</text>
  <line class="ln" x1="390" y1="140" x2="670" y2="140"/>
  <line class="ln" x1="390" y1="140" x2="390" y2="25"/>
  <polyline class="ln-a" points="390,140 430,112 470,82 510,50 610,50 610,140"/>
  <text class="tx-m" x="610" y="40" text-anchor="middle">commit</text>
  <text class="tx-m" x="450" y="158" text-anchor="middle">growing</text>
  <text class="tx-m" x="610" y="158" text-anchor="middle">release X locks at commit</text>
  <text class="tx-m" x="380" y="85" text-anchor="middle" transform="rotate(-90 380 85)">locks held</text>
</svg>`, caption: "Basic 2PL may release locks before commit; strict 2PL holds exclusive locks until the transaction ends." },
          { table: { head: ["Variant", "Rule", "Serializable", "Cascading aborts", "Deadlock-free"], rows: [
            ["Basic 2PL", "Growing then shrinking", "Yes", "Possible (others may read data unlocked before commit)", "No"],
            ["Strict 2PL", "+ hold all <b>X</b> locks until commit/abort", "Yes", "No", "No"],
            ["Rigorous 2PL", "+ hold <b>all</b> locks (S and X) until commit/abort", "Yes (commit order = serial order)", "No", "No"],
            ["Conservative 2PL", "Acquire every lock needed <b>before starting</b> (predeclare)", "Yes", "Possible", "<b>Yes</b>"]
          ] } },
          { p: "<b>Worked check:</b> T1: <code>lock-X(A) R(A) W(A) unlock(A) lock-X(B) W(B) unlock(B)</code>. Not 2PL — it acquires B after releasing A. Fix: <code>lock-X(A) R(A) W(A) lock-X(B) unlock(A) W(B) unlock(B)</code> is 2PL (all locks before the first unlock), but not strict; strict 2PL would release both at commit." },
          { h: "Alternative: timestamp ordering" },
          { p: "Each transaction gets a timestamp; conflicting operations must run in timestamp order, otherwise the late transaction is rolled back and restarted. No locks → <b>no deadlocks</b>, but more restarts. (Thomas' write rule: an obsolete write can simply be ignored.)" }
        ]
      },
      {
        h: "MVCC — multi-version concurrency control",
        blocks: [
          { p: "Instead of making readers wait for writers, the DB keeps <b>several versions</b> of a row, each stamped with the transaction that created it. A reader sees the newest version committed <i>before its snapshot was taken</i>." },
          { table: { head: ["t", "T1 (reader, REPEATABLE READ)", "T2 (writer)", "Row versions"], rows: [
            ["1", "BEGIN; SELECT bal → 1000", "", "v1: 1000"],
            ["2", "", "UPDATE bal = 500 (row-level X lock)", "v1: 1000, v2: 500 (uncommitted)"],
            ["3", "SELECT bal → 1000 — <b>not blocked</b>", "", "reads v1"],
            ["4", "", "COMMIT", "v2 committed"],
            ["5", "SELECT bal → 1000 (same snapshot)", "", "at READ COMMITTED this would return 500"]
          ] } },
          { ul: [
            "<b>PostgreSQL</b>: every UPDATE writes a new tuple; old tuples carry xmin/xmax transaction ids. <b>VACUUM</b> removes versions no snapshot can see anymore.",
            "<b>InnoDB</b>: the row is updated in place; the old version goes to the <b>undo log</b>, and readers rebuild it using their <b>read view</b>. A long-running transaction keeps undo from being purged.",
            "Snapshot timing: READ COMMITTED takes a new snapshot per statement; REPEATABLE READ keeps one per transaction.",
            "MVCC does <b>not</b> remove write–write conflicts: two writers on the same row still need a lock (or the second aborts)."
          ] },
          { tip: "Optimistic vs pessimistic: pessimistic = lock first (FOR UPDATE) — good when conflicts are frequent. Optimistic = read freely, check a version column at write time and retry — good when conflicts are rare (JPA <code>@Version</code>)." }
        ]
      },
      {
        h: "Deadlocks in a DBMS",
        blocks: [
          { table: { head: ["t", "T1", "T2"], rows: [
            ["1", "UPDATE account … WHERE id = 1 (X on row 1)", ""],
            ["2", "", "UPDATE account … WHERE id = 2 (X on row 2)"],
            ["3", "UPDATE account … WHERE id = 2 → waits for T2", ""],
            ["4", "", "UPDATE account … WHERE id = 1 → waits for T1 → <b>cycle</b>"]
          ] } },
          { p: "The <b>wait-for graph</b> has T1 → T2 → T1. InnoDB detects it immediately and rolls back the transaction that is cheapest to undo (<code>ERROR 1213: Deadlock found</code>); PostgreSQL checks after <code>deadlock_timeout</code> (1 s default) and aborts one (<code>SQLSTATE 40P01</code>). The application must <b>catch and retry</b>." },
          { table: { head: ["Strategy", "How"], rows: [
            ["Detection + recovery", "Wait-for graph cycle check; abort a victim (fewest locks / least work / youngest). What real RDBMSs do."],
            ["Timeout", "Give up after waiting N seconds (<code>innodb_lock_wait_timeout</code>, default 50 s)."],
            ["Wait-die (non-preemptive)", "Older requester <b>waits</b> for younger; younger requester <b>dies</b> (restarts with the same timestamp)."],
            ["Wound-wait (preemptive)", "Older requester <b>wounds</b> (aborts) the younger holder; younger requester <b>waits</b>."],
            ["Application-level prevention", "Always lock rows in the same order (e.g. lower account id first), keep transactions short, add indexes so UPDATE locks fewer rows."]
          ] } },
          { warn: "Missing indexes cause \"mystery\" deadlocks: an UPDATE with a WHERE on an unindexed column scans and locks many rows (InnoDB locks every row it examines under REPEATABLE READ), so two unrelated updates collide." }
        ]
      },
      {
        h: "Query optimisation and EXPLAIN",
        blocks: [
          { p: "Pipeline: <b>parse</b> → <b>rewrite</b> (expand views, simplify) → <b>optimise</b> (cost-based: estimate rows from table statistics, try join orders, access paths and join algorithms, pick the cheapest) → <b>execute</b>. Classic heuristics: push selections/projections down, join small results first, use indexes for selective predicates." },
          { table: { head: ["Join algorithm", "Best when"], rows: [
            ["Nested loop (with index on inner)", "Outer side small, inner side indexed on the join key"],
            ["Hash join", "Large unsorted inputs with an equality join (MySQL 8.0.18+, PostgreSQL)"],
            ["Merge join", "Both inputs already sorted on the join key (PostgreSQL)"]
          ] } },
          { code: [
            { lang: "sql", src: `EXPLAIN SELECT id, amount FROM orders WHERE customer_id = 42;

CREATE INDEX idx_orders_customer ON orders (customer_id);

EXPLAIN SELECT id, amount FROM orders WHERE customer_id = 42;
-- PostgreSQL: EXPLAIN ANALYZE ... actually runs the query and shows real rows + time
-- MySQL 8.0.18+: EXPLAIN ANALYZE ... as well` },
            { lang: "text", src: `MySQL (illustrative numbers, 1M-row table)
before:  type=ALL  key=NULL                 rows=998123  Extra=Using where
after:   type=ref  key=idx_orders_customer  rows=12      Extra=NULL

PostgreSQL (illustrative)
before:  Seq Scan on orders  (cost=0.00..18334.00 rows=12 width=16)
           Filter: (customer_id = 42)
after:   Index Scan using idx_orders_customer on orders  (cost=0.42..52.61 rows=12 width=16)
           Index Cond: (customer_id = 42)` }
          ], title: "Reading a plan before and after an index" },
          { table: { head: ["MySQL <code>type</code> (best → worst)", "Meaning"], rows: [
            ["const / eq_ref", "At most one row via PK/UNIQUE"],
            ["ref", "Index lookup on a non-unique key"],
            ["range", "Index range scan (BETWEEN, &gt;, IN)"],
            ["index", "Full scan of the index (cheaper than table, still full)"],
            ["ALL", "Full table scan — investigate on large tables"]
          ] } },
          { ul: [
            "<b>Extra</b> to watch: <code>Using index</code> (covering, good), <code>Using filesort</code> (sorting outside an index), <code>Using temporary</code> (temp table for GROUP BY/DISTINCT).",
            "PostgreSQL nodes: Seq Scan, Index Scan, Index Only Scan, Bitmap Heap Scan, Nested Loop, Hash Join, Merge Join. <code>cost=startup..total</code> is in arbitrary planner units, not ms.",
            "When estimates are far from actual rows, statistics are stale → <code>ANALYZE table</code> (both DBs; MySQL <code>ANALYZE TABLE t</code>).",
            "Common rewrites: avoid <code>SELECT *</code>, make predicates sargable (no functions on indexed columns), replace correlated subqueries with joins when the optimiser does not, paginate with keyset (<code>WHERE id &gt; last_id LIMIT 20</code>) instead of huge OFFSETs."
          ] }
        ]
      },
      {
        h: "The N+1 query problem",
        blocks: [
          { p: "Load 100 customers, then for each customer lazily load their orders → <b>1 + 100 = 101 round trips</b>. Each is fast alone; together they dominate page latency. ORMs make this invisible because <code>customer.getOrders()</code> looks like a field access." },
          { code: `// JPA / Hibernate shape (pseudo-code; needs a JPA provider to run)
@Entity class Customer {
    @Id Long id;
    String name;
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    List<Order> orders;
}

List<Customer> cs = em.createQuery("SELECT c FROM Customer c", Customer.class)
                      .getResultList();                    // 1 query
for (Customer c : cs)
    total += c.getOrders().size();                         // +1 query PER customer  => N+1

// Fix 1: fetch join — one SQL with a JOIN
em.createQuery("SELECT DISTINCT c FROM Customer c LEFT JOIN FETCH c.orders", Customer.class)

// Fix 2: Spring Data
@EntityGraph(attributePaths = "orders")
List<Customer> findAll();

// Fix 3: batch lazy loads — Hibernate @BatchSize(size = 50) on the collection
//        => 1 + ceil(N / 50) queries using WHERE customer_id IN (...)`, lang: "text", title: "How N+1 appears in JPA and the three standard fixes" },
          { code: `import java.sql.*;
import java.util.*;

public class NPlusOne {
    record Order(long id, double amount) {}

    // N+1: one query for customers, then one query per customer
    static Map<Long, List<Order>> slow(Connection con) throws SQLException {
        Map<Long, List<Order>> out = new LinkedHashMap<>();
        try (Statement st = con.createStatement();
             ResultSet rs = st.executeQuery("SELECT id FROM customer");
             PreparedStatement ps = con.prepareStatement(
                 "SELECT id, amount FROM orders WHERE customer_id = ?")) {
            while (rs.next()) {                                   // N iterations
                long cid = rs.getLong("id");
                List<Order> list = new ArrayList<>();
                ps.setLong(1, cid);
                try (ResultSet r2 = ps.executeQuery()) {          // +1 round trip each
                    while (r2.next()) list.add(new Order(r2.getLong("id"), r2.getDouble("amount")));
                }
                out.put(cid, list);
            }
        }
        return out;
    }

    // Fix: one LEFT JOIN, group rows in Java
    static Map<Long, List<Order>> fast(Connection con) throws SQLException {
        String sql = "SELECT c.id AS cid, o.id AS oid, o.amount "
                   + "FROM customer c LEFT JOIN orders o ON o.customer_id = c.id "
                   + "ORDER BY c.id";
        Map<Long, List<Order>> out = new LinkedHashMap<>();
        try (Statement st = con.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                List<Order> list = out.computeIfAbsent(rs.getLong("cid"), k -> new ArrayList<>());
                long oid = rs.getLong("oid");
                if (!rs.wasNull()) list.add(new Order(oid, rs.getDouble("amount")));   // customer with no orders
            }
        }
        return out;
    }

    public static void main(String[] args) throws SQLException {
        if (args.length == 0) {
            System.out.println("usage: java NPlusOne <jdbc-url>   (with 100 customers: slow = 101 queries, fast = 1)");
            return;
        }
        try (Connection con = DriverManager.getConnection(args[0])) {
            System.out.println(slow(con).equals(fast(con)) ? "same result" : "different result");
        }
    }
}`, lang: "java", title: "Plain JDBC: the N+1 shape and the JOIN fix" },
          { warn: "JOIN FETCH on <b>two</b> collections at once multiplies rows (Cartesian product) and Hibernate refuses to fetch two <code>List</code> bags (MultipleBagFetchException). Fetch one collection by join, batch the other. Also, JOIN FETCH combined with pagination paginates in memory — use batch fetching for paged lists." },
          { tip: "How to spot N+1 in a project: enable SQL logging (<code>spring.jpa.show-sql=true</code> or Hibernate statistics) and count statements per request. Mentioning that you <i>measured</i> it is what impresses in a project discussion." }
        ]
      }
    ],
    practice: [
      { q: "T1 holds an S lock on row A. T2 requests S on A, then T3 requests X on A. What happens?", a: "T2 is granted immediately (S–S compatible). T3 waits until both T1 and T2 release their S locks, because X is incompatible with S." },
      { q: "Does 2PL prevent deadlocks? Give a counter-example.", a: "No. T1: lock-X(A); T2: lock-X(B); T1 requests X(B) → waits; T2 requests X(A) → waits. Both are still in their growing phase — perfectly legal 2PL — and deadlocked. Only conservative 2PL (lock everything up front) avoids it." },
      { q: "Under wait-die, T5 (timestamp 5, older) requests a lock held by T9 (younger). Then T9 requests a lock held by T5. What happens in each case? And under wound-wait?", a: "Wait-die: T5 (older) <b>waits</b> for T9; T9 (younger) requesting from T5 <b>dies</b> and restarts later with timestamp 9. Wound-wait: T5 (older) <b>wounds</b> T9 — T9 is aborted and T5 gets the lock; T9 requesting from T5 <b>waits</b>." },
      { q: "Page shows 50 posts with author names. Logs show 51 SQL statements per request. Diagnose and fix.", a: "N+1: one query for posts, then one lazy load of the author per post. Fix with a fetch join (<code>SELECT p FROM Post p JOIN FETCH p.author</code>), an <code>@EntityGraph(attributePaths = \"author\")</code>, or batch fetching → 1 query (or 1 + a few with batch size)." },
      { q: "EXPLAIN in MySQL shows <code>type=ALL, rows=2,000,000, Extra=Using where; Using filesort</code> for <code>SELECT * FROM orders WHERE status='NEW' ORDER BY created_at DESC LIMIT 20</code>. What index would you add?", a: "Composite <code>(status, created_at)</code>: equality column first, then the sort column. The optimiser seeks to status='NEW', reads index entries already ordered by created_at (backward scan for DESC), stops after 20 rows — no full scan, no filesort. Expected <code>type=ref</code>." },
      { q: "Why don't readers block writers in PostgreSQL even at REPEATABLE READ?", a: "MVCC: the writer creates a new row version while the reader keeps reading the older version visible to its snapshot. No read locks are taken, so neither waits. Writers only conflict with other writers on the same row." }
    ],
    related: ["dbms:locking-shared-exclusive", "dbms:two-phase-locking", "dbms:mvcc", "dbms:deadlock-dbms", "dbms:optimistic-vs-pessimistic", "dbms:timestamp-ordering", "dbms:query-optimization-explain", "dbms:orm", "dbms:isolation-levels", "dbms:composite-index"]
  });

  var ALL = ["dbms-er-keys-constraints", "dbms-normalization", "dbms-transactions-isolation", "dbms-indexing", "dbms-locking-mvcc-optimisation"];
  map("d15-ev", ["dbms-er-keys-constraints"]);
  map("d16-ev", ["dbms-normalization"]);
  map("d17-ev", ["dbms-transactions-isolation"]);
  map("d17-ni", ["dbms-transactions-isolation"]);
  map("d18-ev", ["dbms-indexing"]);
  map("d22-ev", ["dbms-locking-mvcc-optimisation"]);
  map("d28-af", ALL);
  map("d54-af", ALL);
})();
