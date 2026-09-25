/* core subject: Database Management Systems — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "dbms",
  title: "Database Management Systems",
  short: "DBMS",
  icon: "⛁",
  blurb: "Interviewers probe keys and normalization, SQL semantics (joins, GROUP BY, NULLs), ACID and isolation levels, locking/MVCC, indexing internals (B+ trees, clustered vs non-clustered), recovery, and when to reach for NoSQL, sharding or replication.",
  topics: ["Basics", "Data Models & ER", "Keys & Constraints", "Normalization", "SQL Concepts", "Joins & Queries", "Transactions & ACID", "Concurrency Control", "Indexing & Storage", "Recovery", "NoSQL & Scaling"],
  questions: [

    /* ───────────── Basics ───────────── */
    {
      id: "what-is-dbms",
      q: "What is a DBMS? What are its main functions?",
      topic: "Basics",
      level: 1,
      top: true,
      short: "A DBMS is software that stores, retrieves and manages data in a database while providing concurrent access, integrity, security, and crash recovery. Examples: MySQL, PostgreSQL, Oracle, SQL Server, MongoDB.",
      a: [
        { p: "A <b>database</b> is an organised collection of related data. A <b>Database Management System (DBMS)</b> is the software layer between applications and that data: it defines how data is stored, lets you query and modify it through a language (usually SQL), and guarantees correctness when many users work on it at once." },
        { h: "Core functions" },
        { ul: [
          "<b>Data definition</b> — create/alter schemas (tables, types, constraints) via DDL.",
          "<b>Data manipulation</b> — insert, update, delete, query via DML; a query optimizer picks the execution plan.",
          "<b>Concurrency control</b> — many transactions run in parallel without corrupting data (locks, MVCC).",
          "<b>Integrity</b> — enforces constraints such as PRIMARY KEY, FOREIGN KEY, CHECK, NOT NULL.",
          "<b>Security</b> — authentication, roles, GRANT/REVOKE.",
          "<b>Recovery</b> — write-ahead logging and backups so committed data survives crashes.",
          "<b>Data independence</b> — applications are shielded from storage-level changes."
        ] },
        { tip: "Name a couple of real systems and their categories: relational (MySQL, PostgreSQL, Oracle) vs NoSQL (MongoDB, Cassandra, Redis). It shows you know the landscape, not just the textbook definition." }
      ]
    },
    {
      id: "dbms-vs-file-system",
      q: "What are the advantages of a DBMS over a traditional file system?",
      topic: "Basics",
      level: 1,
      top: true,
      short: "A file system just stores bytes; a DBMS adds a query language, reduced redundancy, integrity constraints, concurrent access control, security, and crash recovery that applications would otherwise have to hand-code.",
      a: [
        { p: "In a file-based system every application manages its own files and formats. That leads to duplicated data, inconsistent copies, and custom code for searching, locking and backups. A DBMS centralises all of this." },
        { table: { head: ["Aspect", "File system", "DBMS"], rows: [
          ["Redundancy &amp; inconsistency", "Same data copied across files; copies drift apart", "Normalised schema, single source of truth"],
          ["Data access", "Custom program for each new query", "Declarative SQL + optimizer"],
          ["Integrity", "Checks scattered in application code", "Declarative constraints (PK, FK, CHECK)"],
          ["Concurrency", "Simultaneous writes can corrupt files", "Transactions, locking, MVCC"],
          ["Atomicity / recovery", "A crash mid-update leaves partial data", "Logging, rollback, crash recovery"],
          ["Security", "OS-level file permissions only", "Row/column/table-level privileges, roles"],
          ["Data independence", "Programs depend on file layout", "Logical and physical independence"],
          ["Cost / overhead", "Cheap, simple", "Heavier software, needs tuning"]
        ] } },
        { p: "A file system is still the right choice for large blobs (videos, logs) or tiny single-user apps; databases often store only a <i>path</i> to such files." },
        { tip: "Classic answer framing: <b>redundancy, inconsistency, difficulty of access, isolation of data, integrity problems, atomicity problems, concurrent-access anomalies, security</b> — these are the eight file-system drawbacks listed in Korth." }
      ]
    },
    {
      id: "dbms-vs-rdbms",
      q: "What is the difference between DBMS and RDBMS?",
      topic: "Basics",
      level: 1,
      top: true,
      short: "RDBMS is a DBMS based on the relational model: data lives in tables with relationships enforced by keys, it supports SQL, normalization, and ACID transactions. A generic DBMS may store data hierarchically, as files, or as documents.",
      a: [
        { p: "<b>DBMS</b> is the general term for any system that manages a database. An <b>RDBMS</b> is a DBMS that follows E.F. Codd's <b>relational model</b>: data is stored as relations (tables of rows and columns), and relationships are expressed through primary and foreign keys." },
        { table: { head: ["DBMS (generic)", "RDBMS"], rows: [
          ["Data may be stored as files, hierarchies, networks, documents", "Data stored in tables (relations)"],
          ["Relationships not necessarily enforced", "Relationships enforced via foreign keys"],
          ["Normalization often not applicable", "Normalization reduces redundancy"],
          ["May not support multi-user ACID transactions", "Full transactions, concurrency control, ACID"],
          ["No standard query language required", "SQL is the standard interface"],
          ["Examples: early file-based DBs, IMS (hierarchical), XML stores", "MySQL, PostgreSQL, Oracle, SQL Server, SQLite"]
        ] } },
        { warn: "Saying \"DBMS is for single users, RDBMS is for multiple users\" is an outdated textbook oversimplification. The real distinction is the <b>relational model</b> — tables, keys, relational algebra/SQL." }
      ]
    },
    {
      id: "three-schema-architecture",
      q: "Explain the three-schema (ANSI/SPARC) architecture of a DBMS.",
      topic: "Basics",
      level: 2,
      top: true,
      short: "It separates a database into three levels: external (user views), conceptual (logical schema of the whole database), and internal (physical storage). Mappings between levels provide data independence.",
      a: [
        { p: "The <b>ANSI/SPARC three-level architecture</b> separates <i>how users see data</i> from <i>how it is logically organised</i> from <i>how it is physically stored</i>." },
        { svg: `<svg viewBox="0 0 560 300" width="560" class="dg">
  <rect class="box-p" x="30" y="16" width="140" height="40" rx="6"/>
  <text class="tx" x="100" y="36" text-anchor="middle" dominant-baseline="middle">View 1 (Students)</text>
  <rect class="box-p" x="210" y="16" width="140" height="40" rx="6"/>
  <text class="tx" x="280" y="36" text-anchor="middle" dominant-baseline="middle">View 2 (Accounts)</text>
  <rect class="box-p" x="390" y="16" width="140" height="40" rx="6"/>
  <text class="tx" x="460" y="36" text-anchor="middle" dominant-baseline="middle">View 3 (Faculty)</text>
  <text class="tx-m" x="552" y="36" text-anchor="end">External</text>
  <line class="ln" x1="100" y1="56" x2="250" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="56" x2="280" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="460" y1="56" x2="310" y2="112" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="380" y="92">external / conceptual mapping</text>
  <rect class="box-a" x="140" y="114" width="280" height="44" rx="6"/>
  <text class="tx tx-b" x="280" y="136" text-anchor="middle" dominant-baseline="middle">Conceptual schema (tables, keys)</text>
  <text class="tx-m" x="552" y="136" text-anchor="end">Conceptual</text>
  <line class="ln" x1="280" y1="158" x2="280" y2="200" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="290" y="184">conceptual / internal mapping</text>
  <rect class="box-g" x="140" y="202" width="280" height="40" rx="6"/>
  <text class="tx tx-b" x="280" y="222" text-anchor="middle" dominant-baseline="middle">Internal schema (files, indexes)</text>
  <text class="tx-m" x="552" y="222" text-anchor="end">Internal</text>
  <line class="ln" x1="280" y1="242" x2="280" y2="262" marker-end="url(#dg-arr)"/>
  <rect class="box" x="200" y="264" width="160" height="30" rx="6"/>
  <text class="tx" x="280" y="279" text-anchor="middle" dominant-baseline="middle">Stored database (disk)</text>
</svg>`, caption: "Three-schema architecture: views map to one conceptual schema, which maps to physical storage" },
        { table: { head: ["Level", "Describes", "Who uses it", "Example"], rows: [
          ["External (view)", "Part of the DB relevant to one user group", "End users, apps", "A view showing only name and CGPA"],
          ["Conceptual (logical)", "All entities, attributes, relationships, constraints", "DBA, designers", "<code>Student(roll_no, name, dept_id)</code>"],
          ["Internal (physical)", "Storage structures, file organisation, indexes, compression", "DBMS engine", "B+ tree index on roll_no, 16 KB pages"]
        ] } },
        { tip: "Always connect the architecture to its purpose: the two <b>mappings</b> are what give <b>logical</b> and <b>physical data independence</b> — the natural follow-up question." }
      ]
    },
    {
      id: "data-independence",
      q: "What is data independence? Differentiate logical and physical data independence.",
      topic: "Basics",
      level: 2,
      top: true,
      short: "Data independence is the ability to change a schema at one level without changing the level above. Physical independence: change storage without affecting the conceptual schema. Logical independence: change the conceptual schema without affecting user views/apps.",
      a: [
        { p: "<b>Data independence</b> means applications are insulated from changes in how data is organised. It comes from the mappings in the three-schema architecture." },
        { table: { head: ["", "Physical data independence", "Logical data independence"], rows: [
          ["Change made at", "Internal level", "Conceptual level"],
          ["Protects", "Conceptual schema and views", "External views / application programs"],
          ["Examples", "Add an index, move to SSD, change file organisation, partition a table", "Add a column, split a table into two, merge tables"],
          ["Difficulty", "Easier — most DBMSs achieve it well", "Harder — apps often depend on table structure"]
        ] } },
        { code: `-- Logical independence in practice: split a table, keep old apps working via a view
CREATE TABLE student_core    (roll_no INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE student_contact (roll_no INT PRIMARY KEY REFERENCES student_core, phone VARCHAR(15));

CREATE VIEW student AS          -- old applications still query "student"
SELECT c.roll_no, c.name, t.phone
FROM student_core c LEFT JOIN student_contact t ON t.roll_no = c.roll_no;`, lang: "sql", title: "Views preserve the old interface" },
        { tip: "Physical independence is easier to achieve because apps never reference storage details; logical independence is harder because queries name tables and columns directly. Views are the main tool for it." }
      ]
    },

    /* ───────────── Data Models & ER ───────────── */
    {
      id: "data-models",
      q: "What is a data model? Name the main types.",
      topic: "Data Models & ER",
      level: 1,
      top: true,
      short: "A data model is a set of concepts for describing data, relationships, semantics and constraints. Main types: hierarchical, network, relational, entity-relationship, object-oriented/object-relational, and NoSQL models (document, key-value, column-family, graph).",
      a: [
        { p: "A <b>data model</b> defines the building blocks used to describe a database: the structures, the operations allowed on them, and the constraints they must satisfy." },
        { table: { head: ["Model", "Structure", "Example system"], rows: [
          ["Hierarchical", "Tree: each child has one parent", "IBM IMS, Windows Registry"],
          ["Network", "Graph of records linked by pointers (many parents)", "IDMS (CODASYL)"],
          ["Relational", "Tables of rows; links via keys", "MySQL, PostgreSQL, Oracle"],
          ["Entity-Relationship", "Entities, attributes, relationships (design-time)", "ER diagrams"],
          ["Object-oriented / object-relational", "Objects, classes, inheritance", "db4o; PostgreSQL types/inheritance"],
          ["Document", "Nested JSON/BSON documents", "MongoDB, Couchbase"],
          ["Key-value", "Opaque value per key", "Redis, DynamoDB"],
          ["Column-family", "Rows with dynamic column groups", "Cassandra, HBase"],
          ["Graph", "Nodes and edges with properties", "Neo4j"]
        ] } },
        { p: "Models are also classified by abstraction: <b>conceptual</b> (ER — what data exists), <b>logical/representational</b> (relational — how it is organised), and <b>physical</b> (how it is stored)." }
      ]
    },
    {
      id: "er-model",
      q: "What is the ER model? Draw an ER diagram for a small college database.",
      topic: "Data Models & ER",
      level: 1,
      top: true,
      short: "The Entity-Relationship model is a conceptual design tool that describes data as entities (rectangles), their attributes (ellipses), and relationships between them (diamonds), along with cardinality and participation constraints.",
      a: [
        { p: "The <b>ER model</b> (Peter Chen, 1976) is a high-level, conceptual model used before designing tables. Its notation: <b>rectangle</b> = entity set, <b>ellipse</b> = attribute (underlined = key), <b>diamond</b> = relationship, <b>double rectangle</b> = weak entity, <b>double ellipse</b> = multivalued attribute, <b>dashed ellipse</b> = derived attribute." },
        { svg: `<svg viewBox="0 0 640 260" width="640" class="dg">
  <ellipse class="box" cx="70" cy="30" rx="58" ry="18"/>
  <text class="tx tx-b" x="70" y="30" text-anchor="middle" dominant-baseline="middle">roll_no (PK)</text>
  <ellipse class="box" cx="200" cy="30" rx="44" ry="18"/>
  <text class="tx" x="200" y="30" text-anchor="middle" dominant-baseline="middle">name</text>
  <line class="ln" x1="80" y1="48" x2="110" y2="110"/>
  <line class="ln" x1="190" y1="48" x2="150" y2="110"/>
  <rect class="box-a" x="70" y="110" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="130" y="132" text-anchor="middle" dominant-baseline="middle">STUDENT</text>
  <line class="ln" x1="190" y1="132" x2="262" y2="132"/>
  <text class="tx-a" x="226" y="124" text-anchor="middle">M</text>
  <polygon class="box-w" points="320,100 380,132 320,164 260,132"/>
  <text class="tx tx-b" x="320" y="132" text-anchor="middle" dominant-baseline="middle">ENROLLS</text>
  <ellipse class="box" cx="320" cy="212" rx="40" ry="18"/>
  <text class="tx" x="320" y="212" text-anchor="middle" dominant-baseline="middle">grade</text>
  <line class="ln" x1="320" y1="164" x2="320" y2="194"/>
  <line class="ln" x1="380" y1="132" x2="450" y2="132"/>
  <text class="tx-a" x="414" y="124" text-anchor="middle">N</text>
  <rect class="box-a" x="450" y="110" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="510" y="132" text-anchor="middle" dominant-baseline="middle">COURSE</text>
  <ellipse class="box" cx="450" cy="30" rx="60" ry="18"/>
  <text class="tx tx-b" x="450" y="30" text-anchor="middle" dominant-baseline="middle">course_id (PK)</text>
  <ellipse class="box" cx="584" cy="30" rx="48" ry="18"/>
  <text class="tx" x="584" y="30" text-anchor="middle" dominant-baseline="middle">credits</text>
  <line class="ln" x1="460" y1="48" x2="490" y2="110"/>
  <line class="ln" x1="578" y1="48" x2="540" y2="110"/>
  <text class="tx-m" x="130" y="176" text-anchor="middle">STUDENT(roll_no, name)</text>
  <text class="tx-m" x="510" y="176" text-anchor="middle">COURSE(course_id, credits)</text>
  <text class="tx-m" x="320" y="250" text-anchor="middle">ENROLLS(roll_no, course_id, grade)</text>
</svg>`, caption: "Student–Course many-to-many relationship; 'grade' is an attribute of the relationship itself" },
        { p: "Here a student enrolls in many courses and a course has many students (<b>M:N</b>). <code>grade</code> belongs to neither entity alone — it describes the pair — so it sits on the relationship. When mapped to tables, ENROLLS becomes a junction table with a composite key <code>(roll_no, course_id)</code>." },
        { tip: "Interviewers often ask you to sketch a library schema too: MEMBER —(M:N via ISSUE with issue_date, return_date)— BOOK_COPY, and BOOK_COPY as a <b>weak entity</b> of BOOK (copy_no is only unique within an ISBN)." }
      ]
    },
    {
      id: "entity-attribute-types",
      q: "Explain the types of entities and attributes: strong/weak entity, simple, composite, multivalued, derived attributes.",
      topic: "Data Models & ER",
      level: 1,
      top: true,
      short: "A strong entity has its own key; a weak entity depends on an owner entity and is identified by owner key + partial key. Attributes can be simple or composite, single- or multi-valued, stored or derived, and key or non-key.",
      a: [
        { h: "Entities" },
        { ul: [
          "<b>Strong entity</b> — has a primary key of its own. E.g. <code>BOOK(isbn, title)</code>. Drawn as a single rectangle.",
          "<b>Weak entity</b> — cannot be uniquely identified by its own attributes; depends on an <i>owner</i> (identifying) entity through an <i>identifying relationship</i> (double diamond). It has a <b>partial key / discriminator</b> (dashed underline). E.g. <code>BOOK_COPY(copy_no)</code> owned by BOOK: copy 1 of ISBN X vs copy 1 of ISBN Y. Its PK becomes <code>(isbn, copy_no)</code>. Participation of the weak entity is always total."
        ] },
        { h: "Attributes" },
        { table: { head: ["Type", "Meaning", "Example", "ER symbol"], rows: [
          ["Simple (atomic)", "Cannot be divided", "roll_no", "Ellipse"],
          ["Composite", "Made of sub-parts", "name → first, last; address → street, city, pin", "Ellipse with child ellipses"],
          ["Single-valued", "One value per entity", "date_of_birth", "Ellipse"],
          ["Multivalued", "Many values per entity", "phone_numbers, email_ids", "Double ellipse"],
          ["Derived", "Computed from other attributes", "age (from dob), cgpa (from grades)", "Dashed ellipse"],
          ["Key", "Uniquely identifies an entity", "roll_no", "Underlined"],
          ["Complex", "Composite + multivalued", "multiple addresses each with city, pin", "Nested"]
        ] } },
        { warn: "Derived attributes are usually <b>not stored</b> (compute <code>age</code> at query time) unless performance demands it; storing both dob and age invites inconsistency." }
      ]
    },
    {
      id: "cardinality-participation",
      q: "What are cardinality (mapping) constraints and participation constraints in ER modelling?",
      topic: "Data Models & ER",
      level: 2,
      top: true,
      short: "Cardinality says how many entities of one set can relate to entities of another: 1:1, 1:N, N:1, M:N. Participation says whether every entity must take part in the relationship (total) or may not (partial).",
      a: [
        { table: { head: ["Cardinality", "Meaning", "Example"], rows: [
          ["One-to-one (1:1)", "Each A relates to at most one B and vice versa", "Person — Passport; Department — HOD"],
          ["One-to-many (1:N)", "One A relates to many B; each B to one A", "Department — Employees"],
          ["Many-to-one (N:1)", "Mirror of 1:N", "Employees — Department"],
          ["Many-to-many (M:N)", "Many A relate to many B", "Students — Courses; Authors — Books"]
        ] } },
        { h: "Participation" },
        { ul: [
          "<b>Total participation</b> (double line): every entity must participate. Every LOAN must belong to some BRANCH; weak entities always participate totally.",
          "<b>Partial participation</b> (single line): participation optional. Not every EMPLOYEE manages a DEPARTMENT."
        ] },
        { p: "Some notations combine both as <b>(min, max)</b> on each edge: (1, 1) = total and at most one; (0, N) = optional and many. Crow's-foot notation, used by most tools, draws the same information with bars, circles and crow's feet." },
        { tip: "Cardinality directly drives table design: 1:N → foreign key on the N side; M:N → junction table; 1:1 → foreign key (UNIQUE) on the side with total participation." }
      ]
    },
    {
      id: "er-to-tables",
      q: "How do you convert an ER diagram into relational tables?",
      topic: "Data Models & ER",
      level: 2,
      top: true,
      short: "Strong entity → table; weak entity → table whose PK is owner PK + partial key; 1:N → FK on the N side; M:N → junction table with both FKs as a composite PK; multivalued attribute → separate table; composite → flatten; derived → usually not stored.",
      a: [
        { ol: [
          "<b>Strong entity</b> → one table; simple attributes become columns; key becomes PK.",
          "<b>Composite attribute</b> → flatten into its leaf columns (<code>first_name</code>, <code>last_name</code>).",
          "<b>Multivalued attribute</b> → new table <code>(owner_pk, value)</code> with composite PK.",
          "<b>Derived attribute</b> → usually omitted (compute in a query or view).",
          "<b>Weak entity</b> → table with owner's PK as FK; PK = owner PK + partial key; <code>ON DELETE CASCADE</code>.",
          "<b>1:N relationship</b> → add the PK of the '1' side as FK in the 'N' side table (plus any relationship attributes).",
          "<b>1:1 relationship</b> → FK with a UNIQUE constraint on either side (prefer the side with total participation), or merge the tables.",
          "<b>M:N relationship</b> → separate junction table containing both PKs (composite PK) and relationship attributes.",
          "<b>n-ary relationship</b> → table with FKs to all participating entities."
        ] },
        { code: `CREATE TABLE department (dept_id INT PRIMARY KEY, dname VARCHAR(40));

CREATE TABLE student (                       -- strong entity + 1:N to department
    roll_no  INT PRIMARY KEY,
    first_name VARCHAR(30), last_name VARCHAR(30),   -- composite 'name' flattened
    dob      DATE,                                   -- 'age' derived, not stored
    dept_id  INT REFERENCES department(dept_id)
);

CREATE TABLE student_phone (                 -- multivalued attribute
    roll_no INT REFERENCES student(roll_no),
    phone   VARCHAR(15),
    PRIMARY KEY (roll_no, phone)
);

CREATE TABLE course (course_id VARCHAR(10) PRIMARY KEY, credits INT);

CREATE TABLE enrolls (                       -- M:N with attribute 'grade'
    roll_no   INT REFERENCES student(roll_no),
    course_id VARCHAR(10) REFERENCES course(course_id),
    grade     CHAR(2),
    PRIMARY KEY (roll_no, course_id)
);`, lang: "sql", title: "College ER diagram mapped to tables" }
      ]
    },
    {
      id: "generalization-specialization-aggregation",
      q: "Explain generalization, specialization and aggregation in the Extended ER model.",
      topic: "Data Models & ER",
      level: 2,
      top: false,
      short: "Specialization splits an entity into sub-entities (top-down: EMPLOYEE → ENGINEER, MANAGER); generalization merges common features into a super-entity (bottom-up). Aggregation treats a relationship as an entity so it can participate in another relationship.",
      a: [
        { ul: [
          "<b>Specialization</b> (top-down): define subclasses of an entity with extra attributes. EMPLOYEE → FULL_TIME (salary), CONTRACTOR (hourly_rate). Shown with an 'ISA' triangle.",
          "<b>Generalization</b> (bottom-up): CAR and BIKE share reg_no, model → generalise into VEHICLE.",
          "<b>Inheritance</b>: subclasses inherit attributes and relationships of the superclass.",
          "<b>Aggregation</b>: an abstraction where a relationship set is treated as a higher-level entity. E.g. EMPLOYEE works_on PROJECT, and that <i>(employee, project)</i> pair uses MACHINERY — the 'uses' relationship connects to the aggregated works_on."
        ] },
        { h: "Constraints on specialization" },
        { table: { head: ["Constraint", "Options"], rows: [
          ["Disjointness", "<b>Disjoint</b> (entity in at most one subclass) vs <b>overlapping</b>"],
          ["Completeness", "<b>Total</b> (every superclass entity must be in a subclass) vs <b>partial</b>"]
        ] } },
        { h: "Mapping ISA hierarchies to tables" },
        { ol: [
          "One table per class (superclass + subclasses sharing the PK) — normalised, needs joins.",
          "One table per subclass with inherited columns — works when specialization is total and disjoint.",
          "Single table with a type column and nullable subclass columns — fastest reads, many NULLs (common in ORMs as 'single-table inheritance')."
        ] }
      ]
    },

    /* ───────────── Keys & Constraints ───────────── */
    {
      id: "types-of-keys",
      q: "Explain the different types of keys: super, candidate, primary, alternate, foreign, composite and surrogate.",
      topic: "Keys & Constraints",
      level: 1,
      top: true,
      short: "A super key is any attribute set that uniquely identifies a row; a candidate key is a minimal super key; the chosen one is the primary key, the rest are alternate keys. A foreign key references another table's key; a composite key has multiple columns; a surrogate key is a system-generated id.",
      a: [
        { p: "Take this table: <code>STUDENT(roll_no, email, aadhaar, name, dept_id)</code> where roll_no, email and aadhaar are each unique." },
        { table: { head: ["roll_no", "email", "aadhaar", "name", "dept_id"], rows: [
          ["101", "asha@clg.in", "1111 2222 3333", "Asha", "10"],
          ["102", "ravi@clg.in", "4444 5555 6666", "Ravi", "20"],
          ["103", "neha@clg.in", "7777 8888 9999", "Asha", "10"]
        ] } },
        { table: { head: ["Key", "Definition", "In the example"], rows: [
          ["Super key", "Any set of attributes that uniquely identifies a row", "{roll_no}, {roll_no, name}, {email, dept_id}, … (many)"],
          ["Candidate key", "A <b>minimal</b> super key (no proper subset is a super key)", "{roll_no}, {email}, {aadhaar}"],
          ["Primary key", "The candidate key chosen as the main identifier; unique + NOT NULL; one per table", "roll_no"],
          ["Alternate key", "Candidate keys not chosen as primary", "email, aadhaar (enforce with UNIQUE)"],
          ["Foreign key", "Attribute(s) referencing a candidate/primary key in another table", "dept_id → DEPARTMENT(dept_id)"],
          ["Composite key", "A key made of two or more columns", "ENROLLS(roll_no, course_id)"],
          ["Surrogate key", "Artificial, system-generated key with no business meaning", "<code>id BIGINT AUTO_INCREMENT</code> or UUID"],
          ["Natural key", "Key made of real-world data", "aadhaar, ISBN"]
        ] } },
        { p: "Relationship: every candidate key is a super key, but not vice versa. Primary ⊂ candidate ⊂ super." },
        { tip: "Be ready for: <i>How many super keys does R(A,B,C,D) have if A is the only candidate key?</i> Any set containing A works: 2<sup>3</sup> = 8." }
      ]
    },
    {
      id: "primary-vs-unique",
      q: "What is the difference between a primary key and a unique key?",
      topic: "Keys & Constraints",
      level: 1,
      top: true,
      short: "Both enforce uniqueness. A primary key cannot be NULL and there is only one per table (it is often the clustered index); a table can have many unique keys, and they allow NULLs.",
      a: [
        { table: { head: ["", "Primary key", "Unique key"], rows: [
          ["NULLs", "Not allowed", "Allowed (most DBs allow many NULLs; SQL Server allows one)"],
          ["Count per table", "Exactly one", "Any number"],
          ["Default index", "Clustered index in InnoDB / SQL Server", "Non-clustered (secondary) index"],
          ["Purpose", "Row identity; target of foreign keys", "Enforce an alternate key's uniqueness"],
          ["Can be referenced by FK", "Yes", "Yes"]
        ] } },
        { code: `CREATE TABLE users (
    id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,       -- alternate key
    phone VARCHAR(15)  UNIQUE        -- NULLs allowed, duplicates of non-NULL values rejected
);`, lang: "sql" },
        { warn: "\"Unique key allows only one NULL\" is true only for SQL Server. In MySQL, PostgreSQL and Oracle a UNIQUE column can hold multiple NULLs because NULL is not equal to NULL (PostgreSQL 15+ offers <code>NULLS NOT DISTINCT</code> to change this)." }
      ]
    },
    {
      id: "integrity-constraints",
      q: "What are integrity constraints? Explain entity and referential integrity.",
      topic: "Keys & Constraints",
      level: 1,
      top: true,
      short: "Integrity constraints are rules the DBMS enforces to keep data valid: domain (type/CHECK), NOT NULL, key/unique, entity integrity (PK not NULL), and referential integrity (a foreign key must match an existing referenced key or be NULL).",
      a: [
        { table: { head: ["Constraint", "Rule", "SQL"], rows: [
          ["Domain", "Value must belong to the column's type/range", "<code>age INT CHECK (age &gt;= 17)</code>"],
          ["NOT NULL", "Value must be present", "<code>name VARCHAR(50) NOT NULL</code>"],
          ["Key / Unique", "No two rows share the key", "<code>UNIQUE(email)</code>"],
          ["Entity integrity", "Primary key is unique and never NULL", "<code>PRIMARY KEY(roll_no)</code>"],
          ["Referential integrity", "FK value must exist in the parent table (or be NULL)", "<code>FOREIGN KEY … REFERENCES …</code>"],
          ["Assertions / triggers", "Arbitrary business rules", "Triggers (CREATE ASSERTION is rarely supported)"]
        ] } },
        { h: "Referential actions" },
        { p: "When a referenced parent row is deleted or its key updated, the FK declares what happens to children:" },
        { code: `CREATE TABLE enrolls (
    roll_no   INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    grade     CHAR(2) CHECK (grade IN ('A','B','C','D','F')),
    PRIMARY KEY (roll_no, course_id),
    FOREIGN KEY (roll_no)   REFERENCES student(roll_no) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE RESTRICT
);
-- Options: CASCADE | SET NULL | SET DEFAULT | RESTRICT | NO ACTION (default)`, lang: "sql" },
        { tip: "Mention that referential integrity violations can happen on <b>both</b> sides: inserting a child with a non-existent parent, and deleting/updating a parent that still has children." }
      ]
    },
    {
      id: "null-semantics",
      q: "How does NULL behave in SQL? What pitfalls does it cause?",
      topic: "Keys & Constraints",
      level: 2,
      top: false,
      short: "NULL means unknown/missing. Comparisons with NULL yield UNKNOWN (three-valued logic), so use IS NULL / IS NOT NULL. Aggregates skip NULLs, COUNT(*) counts rows but COUNT(col) does not count NULLs, and NOT IN with a NULL in the list returns no rows.",
      a: [
        { p: "SQL uses <b>three-valued logic</b>: TRUE, FALSE, UNKNOWN. Any comparison with NULL — even <code>NULL = NULL</code> — is UNKNOWN, and WHERE keeps only rows that are TRUE." },
        { table: { head: ["Expression", "Result"], rows: [
          ["<code>NULL = NULL</code>", "UNKNOWN (use <code>IS NULL</code>)"],
          ["<code>NULL + 5</code>", "NULL"],
          ["<code>TRUE AND UNKNOWN</code>", "UNKNOWN"],
          ["<code>FALSE AND UNKNOWN</code>", "FALSE"],
          ["<code>TRUE OR UNKNOWN</code>", "TRUE"],
          ["<code>NOT UNKNOWN</code>", "UNKNOWN"]
        ] } },
        { code: `-- emp(salary): 100, 200, NULL
SELECT COUNT(*), COUNT(salary), AVG(salary) FROM emp;
-- 3, 2, 150        (AVG ignores NULL: (100+200)/2)

-- The NOT IN trap: if the subquery returns a NULL, the result is empty
SELECT name FROM student
WHERE dept_id NOT IN (SELECT dept_id FROM department);  -- dept_id contains NULL → 0 rows!

-- Safe alternative
SELECT s.name FROM student s
WHERE NOT EXISTS (SELECT 1 FROM department d WHERE d.dept_id = s.dept_id);

SELECT COALESCE(phone, 'N/A') FROM student;  -- replace NULL for display`, lang: "sql" },
        { ul: [
          "GROUP BY puts all NULLs into one group; ORDER BY places NULLs first (MySQL, SQL Server) or last (PostgreSQL, Oracle ascending).",
          "<code>x NOT IN (1, NULL)</code> is <code>x &lt;&gt; 1 AND x &lt;&gt; NULL</code> → never TRUE.",
          "UNIQUE constraints usually allow multiple NULLs."
        ] },
        { warn: "<code>WHERE col = NULL</code> is a classic bug — it silently returns nothing. Always use <code>IS NULL</code>." }
      ]
    },

    /* ───────────── Normalization ───────────── */
    {
      id: "anomalies",
      q: "What are insertion, update and deletion anomalies?",
      topic: "Normalization",
      level: 1,
      top: true,
      short: "Anomalies are problems caused by redundancy in a poorly designed table: you can't insert a fact without an unrelated one (insertion), must update many copies of one fact (update), or lose a fact when deleting another (deletion). Normalization removes them.",
      a: [
        { p: "Consider one big table storing students with their department details:" },
        { table: { head: ["roll_no", "name", "dept_id", "dept_name", "hod"], rows: [
          ["101", "Asha", "10", "CSE", "Dr. Rao"],
          ["102", "Ravi", "10", "CSE", "Dr. Rao"],
          ["103", "Neha", "20", "ECE", "Dr. Iyer"]
        ] } },
        { ul: [
          "<b>Insertion anomaly</b> — a new department 'MECH' with no students cannot be added without inventing a fake student (roll_no is the PK and cannot be NULL).",
          "<b>Update anomaly</b> — changing CSE's HOD requires updating every CSE student's row; missing one leaves inconsistent data.",
          "<b>Deletion anomaly</b> — deleting Neha (the only ECE student) also erases the fact that ECE exists and its HOD is Dr. Iyer."
        ] },
        { p: "Fix: split into <code>STUDENT(roll_no, name, dept_id)</code> and <code>DEPARTMENT(dept_id, dept_name, hod)</code>. Each fact is now stored once." },
        { tip: "Anomalies are the <i>motivation</i> for normalization. Start any normalization answer with them — it shows you understand why, not just the rules." }
      ]
    },
    {
      id: "functional-dependency",
      q: "What is a functional dependency? How do you compute attribute closure and find candidate keys?",
      topic: "Normalization",
      level: 2,
      top: true,
      short: "X → Y means any two rows that agree on X must agree on Y. The closure X+ is the set of all attributes functionally determined by X using Armstrong's axioms; X is a super key if X+ contains all attributes, and a candidate key if it is also minimal.",
      a: [
        { p: "A <b>functional dependency</b> (FD) <code>X → Y</code> holds on relation R if, for any two tuples, equal X values imply equal Y values. E.g. <code>roll_no → name</code>, <code>(roll_no, course_id) → grade</code>." },
        { h: "Types" },
        { ul: [
          "<b>Trivial</b>: Y ⊆ X (e.g. AB → A). <b>Non-trivial</b>: Y ⊄ X.",
          "<b>Partial</b>: a non-prime attribute depends on part of a composite key.",
          "<b>Transitive</b>: X → Y and Y → Z with Y not a key, so X → Z indirectly."
        ] },
        { h: "Armstrong's axioms" },
        { ul: [
          "<b>Reflexivity</b>: if Y ⊆ X then X → Y.",
          "<b>Augmentation</b>: if X → Y then XZ → YZ.",
          "<b>Transitivity</b>: if X → Y and Y → Z then X → Z.",
          "Derived rules: union, decomposition, pseudo-transitivity."
        ] },
        { h: "Worked example" },
        { code: `R(A, B, C, D, E)      F = { A → B,  B → C,  CD → E }

{A}+ :  start {A}
        A → B       ⇒ {A, B}
        B → C       ⇒ {A, B, C}
        CD → E?  D missing, stop.            {A}+ = {A, B, C}   (not a key)

{A,D}+: start {A, D}
        A → B, B → C ⇒ {A, B, C, D}
        CD → E       ⇒ {A, B, C, D, E}       all attributes → super key

Minimal?  {A}+ ≠ R, {D}+ = {D} ≠ R  ⇒  AD is a candidate key.
Shortcut: attributes never on any right-hand side (A, D) MUST be in every key.`, lang: "text", title: "Closure algorithm" },
        { tip: "The shortcut in the last line — 'attributes that never appear on a right side must be in every candidate key' — lets you solve GATE-style key questions in seconds." }
      ]
    },
    {
      id: "normalization-forms",
      q: "Explain normalization with 1NF, 2NF, 3NF and BCNF using a worked example.",
      topic: "Normalization",
      level: 2,
      top: true,
      short: "Normalization decomposes tables to remove redundancy. 1NF: atomic values. 2NF: 1NF + no partial dependency on part of a composite key. 3NF: 2NF + no transitive dependency of non-key attributes. BCNF: for every non-trivial FD X → Y, X is a super key.",
      a: [
        { p: "<b>Normalization</b> is the process of organising attributes into relations so that each fact is stored once, eliminating insert/update/delete anomalies. Each normal form adds a stricter condition." },
        { h: "Unnormalized data" },
        { table: { head: ["sid", "sname", "courses (cid: cname, instructor, inst_phone, grade)"], rows: [
          ["1", "Asha", "C1: DBMS, Rao, 98xx, A; C2: OS, Iyer, 97xx, B"],
          ["2", "Ravi", "C1: DBMS, Rao, 98xx, B"]
        ] } },
        { h: "1NF — atomic values, no repeating groups" },
        { p: "One value per cell, one row per (student, course): <code>R(sid, sname, cid, cname, instructor, inst_phone, grade)</code>, key <b>(sid, cid)</b>. FDs: <code>sid → sname</code>, <code>cid → cname, instructor</code>, <code>instructor → inst_phone</code>, <code>(sid, cid) → grade</code>." },
        { h: "2NF — remove partial dependencies" },
        { p: "sname depends only on sid; cname/instructor/inst_phone depend only on cid — part of the key. Split:" },
        { ul: [
          "<code>STUDENT(sid, sname)</code>",
          "<code>COURSE(cid, cname, instructor, inst_phone)</code>",
          "<code>ENROLLMENT(sid, cid, grade)</code>"
        ] },
        { h: "3NF — remove transitive dependencies" },
        { p: "In COURSE, <code>cid → instructor → inst_phone</code>: a non-key attribute determines another. Split COURSE into <code>COURSE(cid, cname, instructor)</code> and <code>INSTRUCTOR(instructor, inst_phone)</code>." },
        { svg: `<svg viewBox="0 0 660 250" width="660" class="dg">
  <text class="tx-m" x="8" y="34">1NF</text>
  <rect class="box-r" x="100" y="14" width="460" height="40" rx="6"/>
  <text class="tx tx-c" x="330" y="34" text-anchor="middle" dominant-baseline="middle">R(sid, cid, sname, cname, instructor, inst_phone, grade)</text>
  <line class="ln" x1="220" y1="54" x2="110" y2="104" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="54" x2="330" y2="104" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="440" y1="54" x2="540" y2="104" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="8" y="126">2NF</text>
  <rect class="box-g" x="40" y="106" width="150" height="40" rx="6"/>
  <text class="tx tx-c" x="115" y="126" text-anchor="middle" dominant-baseline="middle">STUDENT(sid, sname)</text>
  <rect class="box-g" x="220" y="106" width="220" height="40" rx="6"/>
  <text class="tx tx-c" x="330" y="126" text-anchor="middle" dominant-baseline="middle">ENROLLMENT(sid, cid, grade)</text>
  <rect class="box-w" x="460" y="106" width="196" height="40" rx="6"/>
  <text class="tx tx-c" x="558" y="120" text-anchor="middle" dominant-baseline="middle">COURSE(cid, cname,</text>
  <text class="tx tx-c" x="558" y="136" text-anchor="middle" dominant-baseline="middle">instructor, inst_phone)</text>
  <line class="ln" x1="520" y1="146" x2="470" y2="196" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="600" y1="146" x2="600" y2="196" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="8" y="218">3NF</text>
  <rect class="box-g" x="320" y="198" width="210" height="40" rx="6"/>
  <text class="tx tx-c" x="425" y="218" text-anchor="middle" dominant-baseline="middle">COURSE(cid, cname, instr)</text>
  <rect class="box-g" x="540" y="198" width="116" height="40" rx="6"/>
  <text class="tx tx-c" x="598" y="212" text-anchor="middle" dominant-baseline="middle">INSTRUCTOR</text>
  <text class="tx tx-c" x="598" y="228" text-anchor="middle" dominant-baseline="middle">(instr, phone)</text>
  <text class="tx-m" x="40" y="176">partial deps removed</text>
  <text class="tx-m" x="40" y="220">transitive dep removed →</text>
</svg>`, caption: "Step-by-step decomposition: 1NF → 2NF (partial dependencies) → 3NF (transitive dependency)" },
        { h: "BCNF — every determinant is a super key" },
        { p: "3NF allows X → A when A is a <i>prime</i> attribute; BCNF does not. Our 3NF tables are already in BCNF because every FD's left side is a key. A table that is 3NF but not BCNF is shown in the next question." },
        { table: { head: ["Form", "Condition"], rows: [
          ["1NF", "Atomic values; no repeating groups; each row unique"],
          ["2NF", "1NF + every non-prime attribute fully depends on every candidate key (no partial dependency)"],
          ["3NF", "2NF + for every FD X → A: X is a super key <b>or</b> A is prime (no transitive dependency)"],
          ["BCNF", "For every non-trivial FD X → Y, X is a super key"],
          ["4NF", "BCNF + no non-trivial multivalued dependency unless its left side is a super key"]
        ] } },
        { tip: "One-liner many interviewers love: <i>\"Every non-key attribute must depend on the key (1NF), the whole key (2NF), and nothing but the key (3NF), so help me Codd.\"</i>" }
      ]
    },
    {
      id: "denormalization",
      q: "What is denormalization? When would you use it?",
      topic: "Normalization",
      level: 2,
      top: true,
      short: "Denormalization deliberately adds redundancy (duplicate columns, pre-joined or pre-aggregated tables) to speed up reads by avoiding joins and aggregations, at the cost of extra storage and more complex, slower writes that must keep copies consistent.",
      a: [
        { p: "<b>Denormalization</b> is intentionally violating normal forms after normalizing, as a performance optimization." },
        { h: "Common techniques" },
        { ul: [
          "Duplicate a column to avoid a join: store <code>customer_name</code> in <code>orders</code>.",
          "Store derived/aggregate values: <code>post.comment_count</code>, <code>account.balance</code>.",
          "Pre-joined reporting tables, materialized views.",
          "Star/snowflake schemas in data warehouses (wide fact tables + dimension tables).",
          "Embedding related data in one document (MongoDB) — the NoSQL default."
        ] },
        { table: { head: ["", "Normalized", "Denormalized"], rows: [
          ["Redundancy", "Minimal", "Intentional"],
          ["Reads", "Need joins", "Fewer joins, faster"],
          ["Writes", "Single place to update", "Must update every copy"],
          ["Integrity risk", "Low", "Copies can drift apart"],
          ["Best for", "OLTP, write-heavy", "OLAP, read-heavy dashboards, feeds"]
        ] } },
        { p: "Keep copies consistent with triggers, application-level transactions, materialized view refresh, or asynchronous events (with eventual consistency)." },
        { tip: "Say you would <b>normalize first, measure, then denormalize specific hot paths</b> — interviewers want to hear that it's a deliberate, measured trade-off, not a default." }
      ]
    },
    {
      id: "3nf-vs-bcnf",
      q: "What is the difference between 3NF and BCNF? Give a relation that is in 3NF but not BCNF.",
      topic: "Normalization",
      level: 3,
      top: false,
      short: "3NF allows an FD X → A where X is not a super key if A is a prime attribute; BCNF forbids it. Decomposing into BCNF is always lossless but may lose dependency preservation, whereas a lossless, dependency-preserving 3NF decomposition always exists.",
      a: [
        { p: "Relation <code>TEACH(student, subject, teacher)</code> with rules: each teacher teaches exactly one subject (<code>teacher → subject</code>), and for each subject a student has one teacher (<code>{student, subject} → teacher</code>)." },
        { table: { head: ["student", "subject", "teacher"], rows: [
          ["Asha", "DBMS", "Rao"],
          ["Ravi", "DBMS", "Mehta"],
          ["Asha", "OS", "Iyer"],
          ["Neha", "DBMS", "Rao"]
        ] } },
        { ul: [
          "Candidate keys: <b>{student, subject}</b> and <b>{student, teacher}</b>. So all three attributes are prime.",
          "<b>3NF?</b> <code>teacher → subject</code>: teacher is not a super key, but subject is prime → allowed. Yes, 3NF.",
          "<b>BCNF?</b> teacher is not a super key → violates BCNF. Redundancy: 'Rao teaches DBMS' is repeated."
        ] },
        { p: "BCNF decomposition: <code>(teacher, subject)</code> and <code>(student, teacher)</code>. It is lossless (common attribute teacher is a key of the first table), but the FD <code>{student, subject} → teacher</code> can no longer be checked within a single table — <b>dependency is not preserved</b>." },
        { table: { head: ["", "3NF", "BCNF"], rows: [
          ["Condition on X → A", "X super key OR A prime", "X super key"],
          ["Redundancy", "Small amount possible", "None due to FDs"],
          ["Lossless decomposition", "Always achievable", "Always achievable"],
          ["Dependency preservation", "Always achievable", "Not always"]
        ] } },
        { tip: "Industry typically stops at 3NF for exactly this reason; BCNF only differs when a table has multiple overlapping composite candidate keys." }
      ]
    },
    {
      id: "fourth-nf",
      q: "What is a multivalued dependency and 4NF? Briefly, what is 5NF?",
      topic: "Normalization",
      level: 3,
      top: false,
      short: "A multivalued dependency X →→ Y means that for a given X the set of Y values is independent of the other attributes. 4NF requires that every non-trivial MVD has a super key on its left. 5NF (PJNF) removes join dependencies not implied by keys.",
      a: [
        { p: "An employee's skills and languages are independent facts. Storing them together forces every combination:" },
        { table: { head: ["emp", "skill", "language"], rows: [
          ["Asha", "Java", "English"],
          ["Asha", "Java", "Hindi"],
          ["Asha", "SQL", "English"],
          ["Asha", "SQL", "Hindi"]
        ] } },
        { p: "Here <code>emp →→ skill</code> and <code>emp →→ language</code>. The table is in BCNF (no non-trivial FDs; key is all three columns) yet adding a new skill requires one row per language. <b>4NF</b> decomposes it into <code>EMP_SKILL(emp, skill)</code> and <code>EMP_LANG(emp, language)</code>." },
        { ul: [
          "<b>4NF</b>: BCNF + for every non-trivial MVD X →→ Y, X is a super key.",
          "<b>5NF / Project-Join NF</b>: every join dependency is implied by candidate keys — the table cannot be losslessly split into three or more smaller tables that aren't already implied by keys. Rare in practice (e.g. agent-company-product rules)."
        ] }
      ]
    },
    {
      id: "lossless-dependency-preservation",
      q: "What are lossless-join decomposition and dependency preservation?",
      topic: "Normalization",
      level: 3,
      top: false,
      short: "A decomposition is lossless if joining the parts gives back exactly the original relation (no spurious tuples); for R into R1, R2 this holds when R1 ∩ R2 is a key of R1 or R2. It is dependency-preserving if all original FDs can be enforced on the individual parts without joining.",
      a: [
        { h: "Lossless join" },
        { p: "Decomposition of R into R1 and R2 is lossless iff <code>R1 ∩ R2 → R1</code> or <code>R1 ∩ R2 → R2</code> (the common attributes form a super key of at least one part). A lossy decomposition creates <b>spurious tuples</b> when joined." },
        { code: `R(sid, cid, grade)   with sid,cid → grade
Lossy:    R1(sid, grade), R2(cid, grade)   common = {grade}, not a key of either
Rows      (1, C1, A), (2, C2, A)
Join R1⋈R2 on grade → (1,C1,A),(1,C2,A),(2,C1,A),(2,C2,A)   ← 2 spurious rows

Lossless: R1(sid, cid, grade) stays whole, or split on a key, e.g.
STUDENT(sid, sname) + ENROLL(sid, cid, grade): common = {sid}, sid → sname ✓`, lang: "text" },
        { h: "Dependency preservation" },
        { p: "If F is the set of FDs on R, and F<sub>i</sub> are the FDs that hold on each part, the decomposition preserves dependencies when <code>(F1 ∪ F2 ∪ …)<sup>+</sup> = F<sup>+</sup></code>. Otherwise checking some FD requires a join on every insert — expensive." },
        { table: { head: ["Property", "Must have?", "3NF synthesis", "BCNF decomposition"], rows: [
          ["Lossless join", "Mandatory (else data is corrupted)", "Guaranteed", "Guaranteed"],
          ["Dependency preservation", "Desirable", "Guaranteed", "Not always"]
        ] } }
      ]
    },

    /* ───────────── SQL Concepts ───────────── */
    {
      id: "sql-command-types",
      q: "What are DDL, DML, DCL and TCL commands?",
      topic: "SQL Concepts",
      level: 1,
      top: true,
      short: "DDL defines structure (CREATE, ALTER, DROP, TRUNCATE), DML manipulates data (SELECT, INSERT, UPDATE, DELETE), DCL controls access (GRANT, REVOKE), and TCL manages transactions (COMMIT, ROLLBACK, SAVEPOINT).",
      a: [
        { table: { head: ["Category", "Purpose", "Commands"], rows: [
          ["DDL — Data Definition Language", "Define / change schema objects", "<code>CREATE, ALTER, DROP, TRUNCATE, RENAME, COMMENT</code>"],
          ["DML — Data Manipulation Language", "Read and modify rows", "<code>INSERT, UPDATE, DELETE, MERGE</code> (and <code>SELECT</code>)"],
          ["DQL — Data Query Language", "Some texts separate reads", "<code>SELECT</code>"],
          ["DCL — Data Control Language", "Permissions", "<code>GRANT, REVOKE</code>"],
          ["TCL — Transaction Control Language", "Group statements into transactions", "<code>COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION</code>"]
        ] } },
        { code: `CREATE TABLE account (id INT PRIMARY KEY, balance DECIMAL(12,2));  -- DDL
INSERT INTO account VALUES (1, 5000), (2, 3000);                   -- DML
GRANT SELECT ON account TO analyst;                                -- DCL

START TRANSACTION;                                                 -- TCL
UPDATE account SET balance = balance - 500 WHERE id = 1;
SAVEPOINT after_debit;
UPDATE account SET balance = balance + 500 WHERE id = 2;
COMMIT;`, lang: "sql" },
        { warn: "DDL auto-commits in MySQL and Oracle — a <code>CREATE</code> or <code>TRUNCATE</code> inside a transaction implicitly commits the pending work. PostgreSQL and SQL Server support transactional DDL that can be rolled back." }
      ]
    },
    {
      id: "delete-truncate-drop",
      q: "What is the difference between DELETE, TRUNCATE and DROP?",
      topic: "SQL Concepts",
      level: 1,
      top: true,
      short: "DELETE is DML that removes selected rows (WHERE allowed, logged per row, fires triggers, can roll back). TRUNCATE is DDL that removes all rows quickly by deallocating pages and resets identity. DROP removes the table itself — structure, data, indexes and constraints.",
      a: [
        { table: { head: ["", "DELETE", "TRUNCATE", "DROP"], rows: [
          ["Type", "DML", "DDL", "DDL"],
          ["Removes", "Selected rows (or all)", "All rows", "Entire table + structure"],
          ["WHERE clause", "Yes", "No", "No"],
          ["Speed", "Slow on big tables (row by row)", "Very fast (deallocates pages)", "Fast"],
          ["Logging", "Each row logged", "Minimal (page deallocation)", "Minimal"],
          ["Row triggers fire", "Yes", "No", "No"],
          ["Rollback", "Yes (within a transaction)", "MySQL/Oracle: no (implicit commit). PostgreSQL/SQL Server: yes inside a transaction", "Same as TRUNCATE"],
          ["Auto-increment", "Not reset", "Reset (PostgreSQL needs <code>RESTART IDENTITY</code>)", "Gone with the table"],
          ["FK-referenced table", "Allowed if no child rows violate", "Usually blocked", "Blocked unless CASCADE"],
          ["Space", "Not always released immediately", "Released", "Released"]
        ] } },
        { code: `DELETE FROM orders WHERE status = 'CANCELLED';   -- selected rows, can ROLLBACK
TRUNCATE TABLE session_log;                      -- empty the table, keep structure
DROP TABLE temp_import;                          -- table no longer exists`, lang: "sql" },
        { tip: "Interviewers expect the one-liner: <b>DELETE removes rows, TRUNCATE removes all data, DROP removes the object.</b> Then add the rollback nuance per database — that's what separates a strong answer." }
      ]
    },
    {
      id: "where-vs-having",
      q: "What is the difference between WHERE and HAVING? What is the logical order of SQL execution?",
      topic: "SQL Concepts",
      level: 1,
      top: true,
      short: "WHERE filters individual rows before grouping and cannot use aggregates; HAVING filters groups after GROUP BY and can use aggregates like COUNT or SUM.",
      a: [
        { p: "Because of the logical processing order, WHERE sees raw rows while HAVING sees the grouped result." },
        { code: `1. FROM / JOIN      build the working set
2. WHERE            filter rows
3. GROUP BY         form groups
4. HAVING           filter groups
5. SELECT           compute expressions, aliases, window functions
6. DISTINCT
7. ORDER BY         can use SELECT aliases
8. LIMIT / OFFSET`, lang: "text", title: "Logical query processing order" },
        { code: `-- Departments with more than 2 employees earning above 30000
SELECT dept_id, COUNT(*) AS cnt
FROM employee
WHERE salary > 30000          -- row filter (before grouping)
GROUP BY dept_id
HAVING COUNT(*) > 2;          -- group filter (after grouping)`, lang: "sql" },
        { table: { head: ["", "WHERE", "HAVING"], rows: [
          ["Filters", "Rows", "Groups"],
          ["Runs", "Before GROUP BY", "After GROUP BY"],
          ["Aggregates allowed", "No", "Yes"],
          ["Without GROUP BY", "Works on any query", "Treats the whole result as one group"],
          ["Performance", "Reduces rows early; can use indexes", "Applied after aggregation"]
        ] } },
        { warn: "Putting a non-aggregate condition in HAVING (<code>HAVING dept_id = 10</code>) works but wastes effort — the DB groups everything first. Put row conditions in WHERE. Also, SELECT aliases can't be used in WHERE because SELECT runs later." }
      ]
    },
    {
      id: "group-by",
      q: "How does GROUP BY work? What are aggregate functions?",
      topic: "SQL Concepts",
      level: 1,
      top: true,
      short: "GROUP BY collapses rows sharing the same values in the grouping columns into one output row per group, on which aggregate functions (COUNT, SUM, AVG, MIN, MAX) are computed. Every selected non-aggregated column must be in the GROUP BY.",
      a: [
        { table: { head: ["emp_id", "name", "dept", "salary"], rows: [
          ["1", "Asha", "CSE", "90000"],
          ["2", "Ravi", "CSE", "70000"],
          ["3", "Neha", "ECE", "60000"],
          ["4", "Kiran", "ECE", "NULL"],
          ["5", "Vikram", "HR", "50000"]
        ] } },
        { code: `SELECT dept,
       COUNT(*)      AS headcount,
       COUNT(salary) AS paid,
       SUM(salary)   AS total,
       AVG(salary)   AS avg_sal,
       MAX(salary)   AS top_sal
FROM employee
GROUP BY dept
ORDER BY dept;

-- dept | headcount | paid | total  | avg_sal | top_sal
-- CSE  |     2     |  2   | 160000 |  80000  |  90000
-- ECE  |     2     |  1   |  60000 |  60000  |  60000
-- HR   |     1     |  1   |  50000 |  50000  |  50000`, lang: "sql" },
        { ul: [
          "Aggregates ignore NULLs (except <code>COUNT(*)</code>) — note ECE's AVG is 60000, not 30000.",
          "<code>COUNT(DISTINCT col)</code> counts unique non-NULL values.",
          "Grouping by multiple columns creates one group per unique combination.",
          "<code>GROUP BY ROLLUP(dept)</code> / <code>WITH ROLLUP</code> adds subtotal and grand-total rows."
        ] },
        { warn: "<code>SELECT dept, name, COUNT(*) FROM employee GROUP BY dept</code> is invalid in standard SQL (which name?). MySQL with <code>ONLY_FULL_GROUP_BY</code> disabled returns an arbitrary name — a silent bug." }
      ]
    },
    {
      id: "union-vs-union-all",
      q: "What is the difference between UNION and UNION ALL? What are INTERSECT and EXCEPT?",
      topic: "SQL Concepts",
      level: 1,
      top: true,
      short: "Both stack results of two SELECTs with compatible columns. UNION removes duplicates (extra sort/hash step); UNION ALL keeps all rows and is faster. INTERSECT returns rows common to both; EXCEPT/MINUS returns rows in the first but not the second.",
      a: [
        { code: `-- A.city: Delhi, Mumbai, Pune       B.city: Mumbai, Chennai
SELECT city FROM A UNION     SELECT city FROM B;  -- Delhi, Mumbai, Pune, Chennai
SELECT city FROM A UNION ALL SELECT city FROM B;  -- Delhi, Mumbai, Pune, Mumbai, Chennai
SELECT city FROM A INTERSECT SELECT city FROM B;  -- Mumbai
SELECT city FROM A EXCEPT    SELECT city FROM B;  -- Delhi, Pune  (Oracle: MINUS)`, lang: "sql" },
        { table: { head: ["", "UNION", "UNION ALL"], rows: [
          ["Duplicates", "Removed", "Kept"],
          ["Performance", "Slower (sort or hash to deduplicate)", "Faster (just appends)"],
          ["Use when", "You need distinct results", "Sets are disjoint or duplicates are meaningful"]
        ] } },
        { ul: [
          "Both queries must have the same number of columns with compatible types; column names come from the first query.",
          "ORDER BY applies to the whole combined result and goes at the end.",
          "UNION stacks rows vertically; JOIN combines columns horizontally."
        ] },
        { tip: "Default to UNION ALL unless you actually need de-duplication — it's a frequent performance fix in real code reviews." }
      ]
    },
    {
      id: "views",
      q: "What is a view? How is it different from a materialized view?",
      topic: "SQL Concepts",
      level: 2,
      top: true,
      short: "A view is a named, stored query — a virtual table computed each time it is queried; it simplifies queries and restricts access. A materialized view stores the query result physically, making reads fast but requiring refresh when base data changes.",
      a: [
        { code: `-- Virtual view: hides salary, joins department name
CREATE VIEW student_public AS
SELECT s.roll_no, s.name, d.dname
FROM student s JOIN department d ON d.dept_id = s.dept_id;

GRANT SELECT ON student_public TO intern;   -- security via views

-- Materialized view (PostgreSQL / Oracle)
CREATE MATERIALIZED VIEW dept_stats AS
SELECT dept_id, COUNT(*) AS n, AVG(salary) AS avg_sal
FROM employee GROUP BY dept_id;

REFRESH MATERIALIZED VIEW CONCURRENTLY dept_stats;  -- needs a UNIQUE index on the MV`, lang: "sql" },
        { table: { head: ["", "View", "Materialized view"], rows: [
          ["Storage", "Only the query definition", "Query result stored on disk"],
          ["Freshness", "Always current", "Stale until refreshed"],
          ["Read speed", "Same as running the query", "Fast (precomputed); can be indexed"],
          ["Write cost", "None", "Refresh cost (full or incremental)"],
          ["Use for", "Abstraction, security, simplifying joins", "Expensive aggregations, reporting dashboards"]
        ] } },
        { h: "Updatable views" },
        { p: "A simple view (one base table, no aggregates, DISTINCT, GROUP BY, or UNION) can usually be INSERTed/UPDATEd through. <code>WITH CHECK OPTION</code> prevents writes that would make the row disappear from the view." },
        { p: "MySQL has no native materialized views — emulate with a summary table refreshed by events or triggers." }
      ]
    },
    {
      id: "stored-procedure-vs-function",
      q: "What is a stored procedure? How is it different from a function?",
      topic: "SQL Concepts",
      level: 2,
      top: true,
      short: "A stored procedure is precompiled SQL logic stored in the database, called with CALL/EXEC; it may have IN/OUT parameters, modify data, and manage transactions. A function must return a value, can be used inside SELECT/WHERE, and generally shouldn't have side effects.",
      a: [
        { code: `DELIMITER //
CREATE PROCEDURE give_raise(IN p_dept INT, IN p_pct DECIMAL(5,2), OUT p_count INT)
BEGIN
    UPDATE employee
    SET salary = salary * (1 + p_pct / 100)
    WHERE dept_id = p_dept;
    SET p_count = ROW_COUNT();
END //

CREATE FUNCTION annual_ctc(monthly DECIMAL(10,2)) RETURNS DECIMAL(12,2)
DETERMINISTIC
BEGIN
    RETURN monthly * 12;
END //
DELIMITER ;

CALL give_raise(10, 5.00, @n);  SELECT @n;          -- procedure: invoked on its own
SELECT name, annual_ctc(salary) FROM employee;     -- function: used inside a query`, lang: "sql", title: "MySQL syntax" },
        { table: { head: ["", "Stored procedure", "Function"], rows: [
          ["Return", "Zero or more values via OUT params / result sets", "Must return exactly one value (or a table for TVFs)"],
          ["Called from", "<code>CALL</code> / <code>EXEC</code>", "Inside SELECT, WHERE, expressions"],
          ["DML (INSERT/UPDATE)", "Allowed", "Restricted or disallowed in most DBs when called from a query"],
          ["Transactions", "Can COMMIT / ROLLBACK", "Cannot (typically)"],
          ["Can call the other", "Can call functions", "Cannot call procedures (SQL Server)"],
          ["Exception handling", "Full (TRY/CATCH, handlers)", "Limited"]
        ] } },
        { h: "Pros and cons of stored procedures" },
        { ul: [
          "Pros: fewer network round trips, reusable logic near the data, permission boundary (grant EXECUTE only), plan caching.",
          "Cons: vendor-specific language, harder to version, test and debug; business logic split between app and DB; scaling the DB tier is harder than scaling app servers."
        ] }
      ]
    },
    {
      id: "triggers",
      q: "What is a trigger? Give an example and discuss when to avoid triggers.",
      topic: "SQL Concepts",
      level: 2,
      top: true,
      short: "A trigger is procedural code the DBMS runs automatically on an INSERT, UPDATE or DELETE (BEFORE or AFTER, per row or per statement). Used for auditing, validation and derived data; overuse hides logic and slows writes.",
      a: [
        { p: "A <b>trigger</b> is an event-condition-action rule bound to a table. Inside a row trigger, <code>OLD</code> and <code>NEW</code> refer to the row before/after the change." },
        { code: `-- Audit every salary change (MySQL)
CREATE TABLE salary_audit (
    emp_id INT, old_salary DECIMAL(10,2), new_salary DECIMAL(10,2), changed_at DATETIME
);

DELIMITER //
CREATE TRIGGER trg_salary_audit
AFTER UPDATE ON employee
FOR EACH ROW
BEGIN
    IF NEW.salary <> OLD.salary THEN
        INSERT INTO salary_audit VALUES (OLD.emp_id, OLD.salary, NEW.salary, NOW());
    END IF;
END //

-- Validation: reject negative salaries
CREATE TRIGGER trg_salary_check
BEFORE INSERT ON employee
FOR EACH ROW
BEGIN
    IF NEW.salary < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'salary cannot be negative';
    END IF;
END //
DELIMITER ;`, lang: "sql" },
        { table: { head: ["Classification", "Options"], rows: [
          ["Timing", "BEFORE, AFTER, INSTEAD OF (on views)"],
          ["Event", "INSERT, UPDATE, DELETE (some DBs: DDL/logon triggers)"],
          ["Granularity", "Row-level (FOR EACH ROW) vs statement-level"]
        ] } },
        { ul: [
          "<b>Good uses</b>: audit trails, enforcing complex constraints, maintaining denormalized counters.",
          "<b>Avoid when</b>: logic belongs in the app, cascading triggers make behaviour hard to trace, bulk loads get slow, or the logic can be a simple CHECK / FK."
        ] },
        { warn: "Triggers run inside the same transaction as the statement — an error in the trigger rolls back the original INSERT/UPDATE too." }
      ]
    },
    {
      id: "cursors",
      q: "What is a cursor in SQL? When should you avoid it?",
      topic: "SQL Concepts",
      level: 2,
      top: false,
      short: "A cursor lets procedural code process a query result one row at a time (DECLARE, OPEN, FETCH, CLOSE). Implicit cursors are created by the DB for single statements; explicit ones are declared by the programmer. Row-by-row processing is slow, so prefer set-based SQL.",
      a: [
        { ul: [
          "<b>Implicit cursor</b> — created automatically for each DML/SELECT INTO (e.g. PL/SQL's <code>SQL%ROWCOUNT</code>).",
          "<b>Explicit cursor</b> — declared for a multi-row query and iterated manually.",
          "Life cycle: <b>DECLARE → OPEN → FETCH (loop) → CLOSE</b> (→ DEALLOCATE in SQL Server)."
        ] },
        { code: `DELIMITER //
CREATE PROCEDURE bonus_low_earners()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_id INT;
    DECLARE v_sal DECIMAL(10,2);
    DECLARE cur CURSOR FOR SELECT emp_id, salary FROM employee;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_sal;
        IF done THEN LEAVE read_loop; END IF;
        IF v_sal < 50000 THEN
            UPDATE employee SET salary = salary + 5000 WHERE emp_id = v_id;
        END IF;
    END LOOP;
    CLOSE cur;
END //
DELIMITER ;

-- Same effect, set-based and far faster:
UPDATE employee SET salary = salary + 5000 WHERE salary < 50000;`, lang: "sql", title: "Explicit cursor (MySQL) vs set-based" },
        { tip: "The expected insight: cursors are a last resort for genuinely row-dependent logic (calling an external procedure per row, complex running state). Set-based statements let the optimizer do the work in one pass." }
      ]
    },
    {
      id: "window-functions",
      q: "What are window functions? Explain ROW_NUMBER, RANK and DENSE_RANK.",
      topic: "SQL Concepts",
      level: 2,
      top: true,
      short: "Window functions compute a value for each row over a set of related rows (the window defined by OVER with PARTITION BY and ORDER BY) without collapsing rows like GROUP BY. ROW_NUMBER gives unique numbers; RANK gives ties the same rank and skips; DENSE_RANK gives ties the same rank without gaps.",
      a: [
        { code: `SELECT name, dept, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employee;`, lang: "sql" },
        { table: { head: ["name", "salary", "ROW_NUMBER", "RANK", "DENSE_RANK"], rows: [
          ["Asha", "90000", "1", "1", "1"],
          ["Ravi", "80000", "2", "2", "2"],
          ["Neha", "80000", "3", "2", "2"],
          ["Kiran", "70000", "4", "<b>4</b>", "<b>3</b>"]
        ] } },
        { p: "Ravi and Neha tie. ROW_NUMBER breaks the tie arbitrarily (add a tiebreaker column to make it deterministic); RANK skips 3; DENSE_RANK doesn't." },
        { h: "PARTITION BY and other window functions" },
        { code: `-- Top earner per department
SELECT * FROM (
    SELECT name, dept, salary,
           DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS r
    FROM employee
) t
WHERE r = 1;

-- Running total and previous row
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total,
       LAG(amount) OVER (ORDER BY order_date) AS prev_amount
FROM orders;`, lang: "sql" },
        { ul: [
          "Aggregate windows: <code>SUM/AVG/COUNT(...) OVER (...)</code>.",
          "Offset: <code>LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTH_VALUE</code>.",
          "Distribution: <code>NTILE(n), PERCENT_RANK, CUME_DIST</code>.",
          "Frames: <code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code> for moving averages."
        ] },
        { warn: "Window functions are evaluated after WHERE/GROUP BY/HAVING, so you can't filter on them in WHERE directly — wrap the query in a subquery or CTE (as above)." }
      ]
    },
    {
      id: "sql-injection",
      q: "What is SQL injection and how do prepared statements prevent it?",
      topic: "SQL Concepts",
      level: 2,
      top: true,
      short: "SQL injection happens when user input is concatenated into a SQL string, letting an attacker change the query's structure. Prepared (parameterized) statements send the query template and the values separately, so input is always treated as data, never as SQL.",
      a: [
        { code: `// Vulnerable: input is pasted into the SQL text
String sql = "SELECT * FROM users WHERE email = '" + email + "' AND pwd = '" + pwd + "'";

// Attacker types email:   ' OR '1'='1' --
// Query becomes:
// SELECT * FROM users WHERE email = '' OR '1'='1' --' AND pwd = '...'
// → the condition is always true, the rest is a comment → logs in as the first user`, lang: "java", title: "The attack" },
        { code: [
          { lang: "java", src: `String sql = "SELECT id, name FROM users WHERE email = ? AND pwd_hash = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, email);          // bound as a value, never parsed as SQL
    ps.setString(2, pwdHash);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            System.out.println("Welcome " + rs.getString("name"));
        }
    }
}` },
          { lang: "python", src: `import sqlite3

conn = sqlite3.connect("app.db")
cur = conn.cursor()
# Placeholder (? for sqlite3, %s for psycopg2 / mysql-connector) — never f-strings
cur.execute("SELECT id, name FROM users WHERE email = ? AND pwd_hash = ?",
            (email, pwd_hash))
row = cur.fetchone()` }
        ], title: "Parameterized queries" },
        { h: "Why it works" },
        { p: "With a prepared statement the DB parses and plans the SQL template <i>before</i> it sees any values. Parameters fill slots in an already-parsed tree, so a quote character is just a character in a string value." },
        { h: "Defence in depth" },
        { ul: [
          "Parameterized queries / ORM query builders everywhere (the primary fix).",
          "Whitelist identifiers that can't be parameterized (column names in ORDER BY, table names).",
          "Least-privilege DB accounts (the app user shouldn't be able to DROP tables).",
          "Input validation, WAF, and never showing raw DB errors to users."
        ] },
        { warn: "Escaping quotes by hand or stored procedures that build dynamic SQL with concatenation are <b>not</b> safe fixes." }
      ]
    },
    {
      id: "orm",
      q: "What is an ORM? What are its advantages and pitfalls (e.g. the N+1 problem)?",
      topic: "SQL Concepts",
      level: 2,
      top: false,
      short: "An Object-Relational Mapper maps tables to classes and rows to objects (Hibernate/JPA, SQLAlchemy, Django ORM), generating SQL for you. It speeds development and prevents injection, but can generate inefficient queries such as N+1 selects from lazy loading.",
      a: [
        { p: "An <b>ORM</b> bridges the <i>object-relational impedance mismatch</i>: classes ↔ tables, fields ↔ columns, object references ↔ foreign keys, collections ↔ joins." },
        { table: { head: ["Advantages", "Pitfalls"], rows: [
          ["Less boilerplate SQL and mapping code", "Hidden, sometimes inefficient SQL"],
          ["Parameterized queries by default (injection-safe)", "N+1 query problem with lazy loading"],
          ["DB portability; migrations tooling", "Complex reports/analytics are awkward"],
          ["Caching, dirty checking, unit of work", "Learning curve; leaky abstraction under load"]
        ] } },
        { code: `# N+1: 1 query for posts, then 1 query per post to fetch its author
posts = session.query(Post).all()                 # SELECT * FROM post
for p in posts:
    print(p.author.name)                          # SELECT * FROM author WHERE id = ?  (N times)

# Fix: eager-load with a JOIN (or a second IN query) → 1-2 queries total
from sqlalchemy.orm import joinedload
posts = session.query(Post).options(joinedload(Post.author)).all()`, lang: "python", title: "SQLAlchemy example" },
        { tip: "Mention the fixes by ecosystem: JPA <code>JOIN FETCH</code> / <code>@EntityGraph</code>, Django <code>select_related</code>/<code>prefetch_related</code>, SQLAlchemy <code>joinedload</code>/<code>selectinload</code> — and turning on SQL logging to catch N+1 early." }
      ]
    },

    /* ───────────── Joins & Queries ───────────── */
    {
      id: "join-types",
      q: "Explain the different types of SQL joins with an example.",
      topic: "Joins & Queries",
      level: 1,
      top: true,
      short: "INNER JOIN returns only matching rows; LEFT JOIN returns all left rows plus matches (NULLs otherwise); RIGHT JOIN is the mirror; FULL OUTER JOIN returns all rows from both; CROSS JOIN returns the Cartesian product; a SELF JOIN joins a table to itself.",
      a: [
        { p: "Sample tables — note Neha has no department and HR has no employee:" },
        { table: { head: ["employee: emp_id", "name", "dept_id", "", "department: dept_id", "dept_name"], rows: [
          ["1", "Asha", "10", "", "10", "Engineering"],
          ["2", "Ravi", "20", "", "20", "Sales"],
          ["3", "Neha", "NULL", "", "30", "HR"]
        ] } },
        { svg: `<svg viewBox="0 0 660 130" width="660" class="dg">
  <circle class="ln" fill="none" cx="48" cy="60" r="30"/>
  <circle class="ln" fill="none" cx="84" cy="60" r="30"/>
  <path class="box-a" d="M66 36 A30 30 0 0 1 66 84 A30 30 0 0 1 66 36 Z"/>
  <text class="tx tx-b" x="66" y="112" text-anchor="middle">INNER</text>
  <circle class="box-a" cx="180" cy="60" r="30"/>
  <circle class="ln" fill="none" cx="216" cy="60" r="30"/>
  <text class="tx tx-b" x="198" y="112" text-anchor="middle">LEFT</text>
  <circle class="box-a" cx="348" cy="60" r="30"/>
  <circle class="ln" fill="none" cx="312" cy="60" r="30"/>
  <text class="tx tx-b" x="330" y="112" text-anchor="middle">RIGHT</text>
  <circle class="box-a" cx="444" cy="60" r="30"/>
  <circle class="box-a" cx="480" cy="60" r="30"/>
  <text class="tx tx-b" x="462" y="112" text-anchor="middle">FULL OUTER</text>
  <circle class="box-a" cx="576" cy="60" r="30"/>
  <path class="box" d="M594 36 A30 30 0 0 1 594 84 A30 30 0 0 1 594 36 Z"/>
  <circle class="ln" fill="none" cx="612" cy="60" r="30"/>
  <text class="tx tx-b" x="594" y="112" text-anchor="middle">LEFT ANTI</text>
  <text class="tx-m" x="48" y="14" text-anchor="middle">A</text>
  <text class="tx-m" x="84" y="14" text-anchor="middle">B</text>
  <text class="tx-m" x="576" y="14" text-anchor="middle">A</text>
  <text class="tx-m" x="612" y="14" text-anchor="middle">B</text>
</svg>`, caption: "Shaded area = rows returned (A = left table, B = right table). LEFT ANTI = LEFT JOIN … WHERE B.key IS NULL" },
        { code: `SELECT e.name, d.dept_name
FROM employee e
INNER JOIN department d ON e.dept_id = d.dept_id;   -- or LEFT / RIGHT / FULL OUTER`, lang: "sql" },
        { table: { head: ["Join", "Result rows (name, dept_name)", "Count"], rows: [
          ["INNER", "(Asha, Engineering), (Ravi, Sales)", "2"],
          ["LEFT", "(Asha, Engineering), (Ravi, Sales), (Neha, NULL)", "3"],
          ["RIGHT", "(Asha, Engineering), (Ravi, Sales), (NULL, HR)", "3"],
          ["FULL OUTER", "(Asha, Engineering), (Ravi, Sales), (Neha, NULL), (NULL, HR)", "4"],
          ["CROSS", "Every employee × every department", "3 × 3 = 9"],
          ["LEFT ANTI (<code>WHERE d.dept_id IS NULL</code>)", "(Neha, NULL)", "1"]
        ] } },
        { ul: [
          "<b>NATURAL JOIN</b> joins on all same-named columns automatically — fragile; avoid in production.",
          "<b>Equi-join</b> uses <code>=</code>; <b>non-equi join</b> uses <code>&lt;</code>, <code>BETWEEN</code> (e.g. matching salary to a grade band).",
          "MySQL has no FULL OUTER JOIN — emulate with <code>LEFT JOIN … UNION … RIGHT JOIN</code>."
        ] },
        { warn: "Filtering the right table in WHERE turns a LEFT JOIN into an INNER JOIN: <code>LEFT JOIN d … WHERE d.dept_name = 'Sales'</code> drops the NULL rows. Put that condition in the <code>ON</code> clause if you want to keep unmatched left rows." }
      ]
    },
    {
      id: "self-join",
      q: "What is a self join? Write a query to list each employee with their manager's name.",
      topic: "Joins & Queries",
      level: 2,
      top: true,
      short: "A self join joins a table with itself using two aliases, typically to relate rows in a hierarchy (employee → manager) or to compare rows within the same table.",
      a: [
        { table: { head: ["emp_id", "name", "manager_id", "salary"], rows: [
          ["1", "Asha", "NULL", "150000"],
          ["2", "Ravi", "1", "90000"],
          ["3", "Neha", "1", "160000"],
          ["4", "Kiran", "2", "70000"]
        ] } },
        { code: `-- Each employee with manager (LEFT keeps the CEO who has none)
SELECT e.name AS employee, m.name AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.emp_id;
-- Asha | NULL
-- Ravi | Asha
-- Neha | Asha
-- Kiran| Ravi

-- Employees who earn more than their manager
SELECT e.name
FROM employee e
JOIN employee m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;
-- Neha`, lang: "sql" },
        { p: "Other self-join uses: finding pairs (students in the same city: <code>a.city = b.city AND a.id &lt; b.id</code> to avoid duplicates and self-pairs), comparing consecutive rows (now often done with <code>LAG</code>)." },
        { tip: "For hierarchies of arbitrary depth (all reports under a manager), mention a <b>recursive CTE</b>: <code>WITH RECURSIVE</code> — one self join can only go one level." }
      ]
    },
    {
      id: "subquery-vs-join",
      q: "What is a subquery? When would you use a subquery vs a join?",
      topic: "Joins & Queries",
      level: 2,
      top: true,
      short: "A subquery is a query nested inside another (in WHERE, FROM, or SELECT). Joins combine columns from multiple tables and are usually better optimized; subqueries are clearer for existence checks, comparisons against aggregates, and derived tables. Modern optimizers often rewrite one into the other.",
      a: [
        { h: "Kinds of subqueries" },
        { ul: [
          "<b>Scalar</b> — returns one value: <code>WHERE salary &gt; (SELECT AVG(salary) FROM employee)</code>.",
          "<b>Row / multi-row</b> — used with <code>IN, ANY, ALL, EXISTS</code>.",
          "<b>Derived table / inline view</b> — in the FROM clause; CTEs (<code>WITH</code>) are the readable form.",
          "<b>Non-correlated</b> runs once independently; <b>correlated</b> references the outer row (next question)."
        ] },
        { code: `-- Students enrolled in at least one course: subquery form
SELECT name FROM student
WHERE roll_no IN (SELECT roll_no FROM enrolls);

-- Join form (needs DISTINCT because a student may have many enrollments)
SELECT DISTINCT s.name
FROM student s JOIN enrolls e ON e.roll_no = s.roll_no;

-- EXISTS form: stops at the first match per student
SELECT s.name FROM student s
WHERE EXISTS (SELECT 1 FROM enrolls e WHERE e.roll_no = s.roll_no);`, lang: "sql" },
        { table: { head: ["", "Join", "Subquery"], rows: [
          ["Returns columns from", "All joined tables", "Outer table only (in WHERE)"],
          ["Readability", "Good for combining data", "Good for 'filter by something' logic"],
          ["Duplicates", "Can multiply rows (1:N)", "IN/EXISTS never duplicate outer rows"],
          ["Performance", "Usually well optimized", "Often rewritten to a semi-join; correlated ones can be slow on older engines"]
        ] } },
        { tip: "Say: <i>prefer a JOIN when you need columns from both tables; use EXISTS/IN when you only need to filter; check EXPLAIN because optimizers (MySQL 8, PostgreSQL) often produce the same plan for both.</i>" }
      ]
    },
    {
      id: "correlated-subquery",
      q: "What is a correlated subquery? Give an example and a faster alternative.",
      topic: "Joins & Queries",
      level: 2,
      top: true,
      short: "A correlated subquery references columns of the outer query, so it is logically re-evaluated for every outer row. Example: employees earning more than their own department's average. It can often be rewritten with a join to a derived table or a window function.",
      a: [
        { code: `-- Employees earning above their department's average
SELECT e.name, e.dept_id, e.salary
FROM employee e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employee e2
    WHERE e2.dept_id = e.dept_id     -- references the outer row → correlated
);`, lang: "sql", title: "Correlated subquery" },
        { p: "Conceptually the inner query runs once per outer row — O(n·m) work without optimization. A non-correlated subquery, by contrast, runs once." },
        { code: `-- Rewrite 1: join to a pre-aggregated derived table (one pass per table)
SELECT e.name, e.dept_id, e.salary
FROM employee e
JOIN (SELECT dept_id, AVG(salary) AS avg_sal
      FROM employee GROUP BY dept_id) d ON d.dept_id = e.dept_id
WHERE e.salary > d.avg_sal;

-- Rewrite 2: window function
SELECT name, dept_id, salary
FROM (SELECT name, dept_id, salary,
             AVG(salary) OVER (PARTITION BY dept_id) AS avg_sal
      FROM employee) t
WHERE salary > avg_sal;`, lang: "sql", title: "Faster equivalents" },
        { tip: "EXISTS / NOT EXISTS subqueries are correlated too, but they are efficient: the optimizer turns them into semi-/anti-joins and stops at the first match. Correlated doesn't automatically mean slow — check the plan." }
      ]
    },
    {
      id: "nth-highest-salary",
      q: "Find the Nth highest salary from an Employee table (multiple approaches).",
      topic: "Joins & Queries",
      level: 2,
      top: true,
      short: "Use DENSE_RANK() OVER (ORDER BY salary DESC) and pick rank N; or SELECT DISTINCT salary ORDER BY salary DESC LIMIT 1 OFFSET N-1; or a correlated subquery counting distinct higher salaries equal to N-1. Handle ties with DISTINCT and return NULL if no Nth salary exists.",
      a: [
        { p: "Salaries: 90000, 80000, 80000, 70000, 60000. The 2nd highest is 80000, the 3rd highest (distinct) is 70000." },
        { code: `-- 1. DENSE_RANK (handles ties, works for per-department too with PARTITION BY)
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r
      FROM employee) t
WHERE r = 3;                                        -- 70000

-- 2. LIMIT / OFFSET (MySQL, PostgreSQL); wrapped so it returns NULL if absent
SELECT (SELECT DISTINCT salary
        FROM employee
        ORDER BY salary DESC
        LIMIT 1 OFFSET 2) AS third_highest;         -- OFFSET N-1

-- 3. Correlated subquery: exactly N-1 distinct salaries are greater
SELECT DISTINCT e1.salary
FROM employee e1
WHERE 2 = (SELECT COUNT(DISTINCT e2.salary)         -- N-1
           FROM employee e2
           WHERE e2.salary > e1.salary);

-- 4. Second highest only: MAX below MAX
SELECT MAX(salary) FROM employee
WHERE salary < (SELECT MAX(salary) FROM employee);  -- 80000

-- 5. SQL Server / Oracle 12c+
SELECT DISTINCT salary FROM employee
ORDER BY salary DESC
OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY;`, lang: "sql" },
        { table: { head: ["Approach", "Ties", "Complexity", "Notes"], rows: [
          ["DENSE_RANK", "Correct", "One sort", "Most flexible; easy per-group"],
          ["LIMIT/OFFSET + DISTINCT", "Correct", "One sort", "Not portable to all DBs"],
          ["Correlated COUNT", "Correct", "O(n²) worst case", "Works on any SQL dialect"],
          ["MAX &lt; MAX", "Correct", "Two scans", "Only for 2nd highest"]
        ] } },
        { warn: "Using ROW_NUMBER or forgetting DISTINCT gives the wrong answer when salaries tie. And <code>LIMIT N-1, 1</code> cannot use an expression in MySQL — inside a function you must <code>SET N = N - 1</code> first." }
      ]
    },

    /* ───────────── Transactions & ACID ───────────── */
    {
      id: "acid-properties",
      q: "What is a transaction? Explain the ACID properties with an example.",
      topic: "Transactions & ACID",
      level: 1,
      top: true,
      short: "A transaction is a logical unit of work that must execute completely or not at all. ACID: Atomicity (all or nothing), Consistency (moves the DB between valid states), Isolation (concurrent transactions don't see each other's partial work), Durability (committed changes survive crashes).",
      a: [
        { p: "Classic example: transfer ₹500 from account A to B." },
        { code: `START TRANSACTION;
UPDATE account SET balance = balance - 500 WHERE id = 'A';
UPDATE account SET balance = balance + 500 WHERE id = 'B';
-- if anything fails: ROLLBACK;
COMMIT;`, lang: "sql" },
        { table: { head: ["Property", "Guarantee", "In the transfer", "How the DBMS implements it"], rows: [
          ["<b>Atomicity</b>", "All operations happen or none do", "Never debit A without crediting B", "Undo log / rollback segments"],
          ["<b>Consistency</b>", "Every transaction preserves integrity constraints", "A + B total unchanged; balance never negative (CHECK)", "Constraints, triggers + correct application logic"],
          ["<b>Isolation</b>", "Concurrent execution looks like some serial order", "Another report doesn't see A debited but B not yet credited", "Locking (2PL) or MVCC; isolation levels"],
          ["<b>Durability</b>", "Once committed, changes persist even after a crash", "After COMMIT returns, power loss doesn't undo the transfer", "Write-ahead log flushed (fsync) at commit, replication"]
        ] } },
        { tip: "Point out that <b>C</b> is partly the application's responsibility — the DB enforces declared constraints, but it can't know that 'total money is conserved' unless the transaction logic is correct. A, I and D are the engine's job." }
      ]
    },
    {
      id: "transaction-states",
      q: "What are the states of a transaction?",
      topic: "Transactions & ACID",
      level: 1,
      top: true,
      short: "Active (executing) → Partially committed (last statement done, changes not yet durable) → Committed. If an error occurs it goes to Failed → Aborted (rolled back), after which it may be restarted or killed. Committed and Aborted lead to Terminated.",
      a: [
        { svg: `<svg viewBox="0 0 640 220" width="640" class="dg">
  <rect class="box-a" x="20" y="90" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="75" y="110" text-anchor="middle" dominant-baseline="middle">Active</text>
  <rect class="box-w" x="180" y="20" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="255" y="40" text-anchor="middle" dominant-baseline="middle">Partially committed</text>
  <rect class="box-g" x="400" y="20" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="455" y="40" text-anchor="middle" dominant-baseline="middle">Committed</text>
  <rect class="box-r" x="180" y="160" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="255" y="180" text-anchor="middle" dominant-baseline="middle">Failed</text>
  <rect class="box-r" x="400" y="160" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="455" y="180" text-anchor="middle" dominant-baseline="middle">Aborted</text>
  <rect class="box" x="545" y="90" width="90" height="40" rx="6"/>
  <text class="tx tx-b" x="590" y="110" text-anchor="middle" dominant-baseline="middle">Terminated</text>
  <line class="ln-a" x1="130" y1="100" x2="180" y2="50" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="330" y1="40" x2="398" y2="40" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="130" y1="120" x2="180" y2="170" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="255" y1="60" x2="255" y2="158" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="180" x2="398" y2="180" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="510" y1="45" x2="560" y2="90" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="510" y1="175" x2="560" y2="130" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="100" y="64">last stmt</text>
  <text class="tx-m" x="364" y="32" text-anchor="middle">log flushed</text>
  <text class="tx-m" x="96" y="160">error</text>
  <text class="tx-m" x="262" y="112">failure</text>
  <text class="tx-m" x="364" y="172" text-anchor="middle">rollback</text>
</svg>`, caption: "Transaction state diagram" },
        { table: { head: ["State", "Meaning"], rows: [
          ["Active", "Executing reads/writes"],
          ["Partially committed", "Final statement executed; changes may still be only in memory"],
          ["Committed", "Commit record durably written to the log; changes are permanent"],
          ["Failed", "Normal execution can't continue (error, constraint violation, deadlock victim, crash)"],
          ["Aborted", "All changes undone; DB restored to state before the transaction. The DBMS can <b>restart</b> it (if the cause was transient) or <b>kill</b> it (logical error)"],
          ["Terminated", "Transaction has left the system"]
        ] } },
        { tip: "The key subtlety: a partially committed transaction can still fail — e.g. the system crashes before the commit log record reaches disk. That's why durability hinges on the log flush." }
      ]
    },
    {
      id: "schedules-serializability",
      q: "What is a schedule? Explain serial vs concurrent schedules and conflict serializability.",
      topic: "Transactions & ACID",
      level: 3,
      top: true,
      short: "A schedule is the interleaved order of operations of concurrent transactions. It is serializable if its effect equals some serial schedule. A schedule is conflict-serializable if its precedence graph (edge Ti → Tj for each conflicting pair where Ti's operation comes first) has no cycle.",
      a: [
        { ul: [
          "<b>Serial schedule</b>: transactions run one after another — always correct but no concurrency.",
          "<b>Concurrent (non-serial) schedule</b>: operations interleave — faster, but only acceptable if <b>serializable</b>.",
          "<b>Conflicting operations</b>: two operations from different transactions on the same item where at least one is a write: R-W, W-R, W-W. Swapping non-conflicting adjacent operations doesn't change the result."
        ] },
        { h: "Testing: precedence graph" },
        { ol: [
          "Create a node for each transaction.",
          "For each conflicting pair where Ti's operation precedes Tj's, add edge Ti → Tj.",
          "If the graph is acyclic, the schedule is conflict-serializable; a topological order gives the equivalent serial schedule."
        ] },
        { code: `S1:  R1(A) W1(A) R2(A) W2(A) R1(B) W1(B) R2(B) W2(B)
     conflicts on A: T1 → T2      on B: T1 → T2
     graph: T1 → T2 (acyclic)  ⇒ conflict-serializable, equivalent to T1; T2

S2:  R1(A) R2(A) W1(A) W2(A)
     R2(A) before W1(A): T2 → T1
     R1(A) before W2(A): T1 → T2
     graph: T1 ⇄ T2 (cycle)    ⇒ NOT conflict-serializable (this is a lost update)`, lang: "text" },
        { svg: `<svg viewBox="0 0 360 110" width="360" class="dg">
  <circle class="box-r" cx="80" cy="55" r="28"/>
  <text class="tx tx-b" x="80" y="55" text-anchor="middle" dominant-baseline="middle">T1</text>
  <circle class="box-r" cx="280" cy="55" r="28"/>
  <text class="tx tx-b" x="280" y="55" text-anchor="middle" dominant-baseline="middle">T2</text>
  <path class="ln-a" fill="none" d="M106 44 Q180 10 252 44" marker-end="url(#dg-arr-a)"/>
  <path class="ln-a" fill="none" d="M254 66 Q180 100 108 66" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="180" y="18" text-anchor="middle">R1(A) before W2(A)</text>
  <text class="tx-m" x="180" y="104" text-anchor="middle">R2(A) before W1(A)</text>
</svg>`, caption: "Precedence graph of S2 has a cycle, so S2 is not conflict-serializable" },
        { p: "<b>View serializability</b> is a weaker (broader) notion: every conflict-serializable schedule is view-serializable, but schedules with <i>blind writes</i> may be view- but not conflict-serializable. Testing view serializability is NP-complete, so DBMSs enforce conflict serializability (via 2PL, timestamps, or SSI)." }
      ]
    },
    {
      id: "recoverable-schedules",
      q: "What are recoverable, cascadeless and strict schedules?",
      topic: "Transactions & ACID",
      level: 3,
      top: false,
      short: "Recoverable: if Tj reads data written by Ti, Ti commits before Tj commits. Cascadeless: transactions read only committed data, so one abort never forces others to abort. Strict: an item written by Ti can't be read or overwritten until Ti commits or aborts. Strict ⊂ cascadeless ⊂ recoverable.",
      a: [
        { table: { head: ["Schedule type", "Rule", "Prevents"], rows: [
          ["Recoverable", "If Tj reads from Ti, then commit(Ti) precedes commit(Tj)", "Committed transaction depending on an aborted one"],
          ["Cascadeless (ACA)", "Tj reads X only after the writer of X has committed", "Cascading rollbacks"],
          ["Strict", "No read or write of X until the last writer of X commits/aborts", "Complex undo; allows simple before-image restore"]
        ] } },
        { code: `Unrecoverable:  W1(A)  R2(A)  C2  ...  A1
                T2 committed a value that T1 then rolled back → can't undo T2

Recoverable but cascading:  W1(A)  R2(A)  A1  → T2 must also abort
Cascadeless:                W1(A)  C1  R2(A)  C2`, lang: "text" },
        { p: "Strict 2PL produces strict schedules, which is why nearly every lock-based DBMS uses it." }
      ]
    },

    /* ───────────── Concurrency Control ───────────── */
    {
      id: "concurrency-problems",
      q: "What problems can occur with concurrent transactions? (dirty read, non-repeatable read, phantom read, lost update)",
      topic: "Concurrency Control",
      level: 2,
      top: true,
      short: "Dirty read: reading another transaction's uncommitted data. Non-repeatable read: re-reading a row gives a different value because another transaction updated it. Phantom read: re-running a range query returns new rows. Lost update: two transactions read-modify-write the same row and one overwrites the other.",
      a: [
        { table: { head: ["Problem", "What happens", "Example"], rows: [
          ["<b>Dirty read</b> (W-R)", "T2 reads a value T1 wrote but hasn't committed; T1 then rolls back", "T2 sees balance 500 that never officially existed"],
          ["<b>Non-repeatable read</b> (R-W)", "T1 reads a row twice; T2 updates and commits in between", "Price read as 100, then 120 in the same transaction"],
          ["<b>Phantom read</b>", "T1 re-runs a range query; T2 inserted/deleted matching rows", "<code>COUNT(*) WHERE dept=10</code> returns 5, then 6"],
          ["<b>Lost update</b> (W-W)", "Both read the same value and write back; first write is overwritten", "Two ₹100 deposits on ₹1000 produce ₹1100"],
          ["<b>Write skew</b>", "Two transactions read overlapping data, write disjoint rows, jointly break a constraint", "Two doctors both go off-call, leaving nobody on call"]
        ] } },
        { code: `Time   T1                               T2
t1     READ balance = 1000
t2                                      READ balance = 1000
t3     balance = 1000 + 100
t4     WRITE balance = 1100
t5                                      balance = 1000 + 100
t6                                      WRITE balance = 1100   ← T1's deposit lost
t7     COMMIT                           COMMIT`, lang: "text", title: "Lost update timeline" },
        { code: `-- Fixes for lost update
UPDATE account SET balance = balance + 100 WHERE id = 1;       -- atomic read-modify-write

SELECT balance FROM account WHERE id = 1 FOR UPDATE;           -- pessimistic row lock

UPDATE account SET balance = 1100, version = version + 1       -- optimistic check
WHERE id = 1 AND version = 7;                                  -- 0 rows → retry`, lang: "sql" },
        { tip: "Map each anomaly to the isolation level that first prevents it (next question). That mapping is usually the follow-up." }
      ]
    },
    {
      id: "isolation-levels",
      q: "What are the SQL isolation levels and which anomalies does each prevent?",
      topic: "Concurrency Control",
      level: 2,
      top: true,
      short: "Read Uncommitted allows dirty reads; Read Committed prevents dirty reads; Repeatable Read also prevents non-repeatable reads; Serializable prevents phantoms too, making execution equivalent to a serial order. Higher isolation means more correctness but less concurrency.",
      a: [
        { table: { head: ["Isolation level", "Dirty read", "Non-repeatable read", "Phantom read", "Default in"], rows: [
          ["READ UNCOMMITTED", "Possible", "Possible", "Possible", "—"],
          ["READ COMMITTED", "Prevented", "Possible", "Possible", "PostgreSQL, Oracle, SQL Server"],
          ["REPEATABLE READ", "Prevented", "Prevented", "Possible (per standard)", "MySQL InnoDB"],
          ["SERIALIZABLE", "Prevented", "Prevented", "Prevented", "—"]
        ] } },
        { code: `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT balance FROM account WHERE id = 1;   -- 1000
-- another session updates and commits balance = 2000
SELECT balance FROM account WHERE id = 1;   -- still 1000 (same snapshot)
COMMIT;`, lang: "sql" },
        { h: "How engines actually implement them" },
        { ul: [
          "MVCC engines implement READ COMMITTED as 'new snapshot per statement' and REPEATABLE READ as 'one snapshot per transaction' (snapshot isolation).",
          "InnoDB's REPEATABLE READ also blocks most phantoms for locking reads via <b>next-key (gap) locks</b>.",
          "PostgreSQL's REPEATABLE READ is snapshot isolation (no phantoms, but write skew possible); its SERIALIZABLE uses <b>Serializable Snapshot Isolation</b> (SSI), aborting transactions that would form a dangerous cycle.",
          "Oracle's 'SERIALIZABLE' is actually snapshot isolation."
        ] },
        { warn: "Serializable isn't free: expect more blocking or serialization failures — the application must be ready to <b>retry</b> aborted transactions." }
      ]
    },
    {
      id: "locking-shared-exclusive",
      q: "Explain shared and exclusive locks, lock granularity and intention locks.",
      topic: "Concurrency Control",
      level: 2,
      top: true,
      short: "A shared (S) lock lets many transactions read an item; an exclusive (X) lock lets one transaction write it and blocks all other locks. Locks can be taken at row, page or table granularity; intention locks (IS, IX) on higher levels signal finer-grained locks below so table-level locks can be checked quickly.",
      a: [
        { table: { head: ["Requested ↓ / Held →", "S (shared)", "X (exclusive)"], rows: [
          ["S", "Compatible ✔", "Wait ✘"],
          ["X", "Wait ✘", "Wait ✘"]
        ] } },
        { h: "Granularity" },
        { p: "Fine-grained (row) locks maximise concurrency but cost memory and lock-manager overhead; coarse (table) locks are cheap but block more. Some DBMSs <b>escalate</b> many row locks into a table lock (SQL Server)." },
        { h: "Intention locks (multiple-granularity locking)" },
        { ul: [
          "<b>IS</b>: I intend to take S locks on some rows of this table.",
          "<b>IX</b>: I intend to take X locks on some rows.",
          "<b>SIX</b>: S on the whole table + IX (read all, update some).",
          "A transaction wanting an X lock on the whole table only needs to check the table-level lock instead of scanning every row lock. IX is compatible with IX (two transactions updating different rows), but not with S or X."
        ] },
        { code: `SELECT * FROM seat WHERE show_id = 7 AND seat_no = 'A1' FOR UPDATE;  -- X lock on the row
SELECT * FROM seat WHERE show_id = 7 FOR SHARE;                        -- S locks (MySQL 8 / PostgreSQL)
LOCK TABLES seat WRITE;                                                -- explicit table lock (MySQL)`, lang: "sql" },
        { tip: "Mention that under MVCC, plain SELECTs don't take S locks at all — readers read a snapshot — which is why <code>FOR UPDATE</code>/<code>FOR SHARE</code> exist for when you <i>do</i> need locks." }
      ]
    },
    {
      id: "deadlock-dbms",
      q: "How do deadlocks occur in a database and how are they handled?",
      topic: "Concurrency Control",
      level: 2,
      top: true,
      short: "A deadlock occurs when transactions wait on each other's locks in a cycle, e.g. T1 locks row A and wants B while T2 locks B and wants A. DBMSs detect cycles in a wait-for graph and roll back a victim, or prevent them with timestamps (wait-die, wound-wait) or lock timeouts.",
      a: [
        { code: `-- Session 1                                   -- Session 2
BEGIN;                                           BEGIN;
UPDATE account SET bal=bal-100 WHERE id=1;       UPDATE account SET bal=bal-50 WHERE id=2;
UPDATE account SET bal=bal+100 WHERE id=2;  -- waits for session 2
                                                 UPDATE account SET bal=bal+50 WHERE id=1;  -- waits → cycle
-- MySQL: ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction`, lang: "sql" },
        { svg: `<svg viewBox="0 0 420 200" width="420" class="dg">
  <circle class="box-r" cx="90" cy="45" r="26"/>
  <text class="tx tx-b" x="90" y="45" text-anchor="middle" dominant-baseline="middle">T1</text>
  <rect class="box" x="290" y="25" width="70" height="40" rx="6"/>
  <text class="tx tx-b" x="325" y="45" text-anchor="middle" dominant-baseline="middle">Row 2</text>
  <circle class="box-r" cx="325" cy="155" r="26"/>
  <text class="tx tx-b" x="325" y="155" text-anchor="middle" dominant-baseline="middle">T2</text>
  <rect class="box" x="55" y="135" width="70" height="40" rx="6"/>
  <text class="tx tx-b" x="90" y="155" text-anchor="middle" dominant-baseline="middle">Row 1</text>
  <line class="ln-a ln-d" x1="116" y1="45" x2="288" y2="45" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="200" y="36" text-anchor="middle">waits for</text>
  <line class="ln" x1="325" y1="65" x2="325" y2="127" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="332" y="100">held by</text>
  <line class="ln-a ln-d" x1="299" y1="155" x2="127" y2="155" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="210" y="146" text-anchor="middle">waits for</text>
  <line class="ln" x1="90" y1="135" x2="90" y2="73" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="30" y="104">held by</text>
</svg>`, caption: "Cycle: T1 → Row 2 → T2 → Row 1 → T1. The wait-for graph T1 → T2 → T1 has a cycle" },
        { h: "Handling strategies" },
        { table: { head: ["Strategy", "How"], rows: [
          ["Detection + recovery", "Build a wait-for graph; on a cycle, abort the cheapest victim (fewest changes). InnoDB, PostgreSQL (after <code>deadlock_timeout</code>), SQL Server"],
          ["Timeout", "Abort a transaction waiting longer than N seconds (<code>innodb_lock_wait_timeout</code>)"],
          ["Wait-die (non-preemptive)", "Older requester waits; younger requester dies (restarts with same TS)"],
          ["Wound-wait (preemptive)", "Older requester wounds (aborts) the younger holder; younger requester waits"],
          ["Conservative 2PL", "Lock everything up front — rarely practical"]
        ] } },
        { h: "Application-side prevention" },
        { ul: [
          "Access rows/tables in a <b>consistent order</b> (e.g. always lock the smaller account id first).",
          "Keep transactions short; don't wait for user input inside a transaction.",
          "Use proper indexes so UPDATE/DELETE lock fewer rows (no index → scans and locks many rows).",
          "Catch deadlock errors and <b>retry</b> the whole transaction."
        ] }
      ]
    },
    {
      id: "optimistic-vs-pessimistic",
      q: "What is the difference between optimistic and pessimistic concurrency control?",
      topic: "Concurrency Control",
      level: 2,
      top: false,
      short: "Pessimistic control locks data before using it, assuming conflicts are likely (SELECT ... FOR UPDATE). Optimistic control lets transactions proceed without locks and validates at commit time (e.g. a version column), retrying on conflict; it suits low-contention workloads.",
      a: [
        { table: { head: ["", "Pessimistic", "Optimistic"], rows: [
          ["Assumption", "Conflicts are common", "Conflicts are rare"],
          ["Mechanism", "Locks (2PL, FOR UPDATE)", "Validate at commit: version number / timestamp / compare values"],
          ["On conflict", "Other transaction waits", "Transaction fails and retries"],
          ["Deadlocks", "Possible", "Not from these checks"],
          ["Best for", "High contention, short critical sections (inventory, seats)", "Read-heavy, low-contention, long user 'think time' (web forms)"]
        ] } },
        { code: `-- Optimistic locking with a version column
SELECT id, stock, version FROM product WHERE id = 42;     -- stock=5, version=3

UPDATE product
SET stock = 4, version = version + 1
WHERE id = 42 AND version = 3;
-- 1 row affected → success; 0 rows → someone else changed it, reload and retry`, lang: "sql" },
        { p: "ORMs support it directly: JPA <code>@Version</code>, Django/SQLAlchemy version counters. Validation-based protocols in textbooks (read, validation, write phases) are the formal version of this idea." }
      ]
    },
    {
      id: "two-phase-locking",
      q: "What is Two-Phase Locking (2PL)? How is strict 2PL different?",
      topic: "Concurrency Control",
      level: 3,
      top: true,
      short: "In 2PL each transaction has a growing phase (acquire locks, release none) followed by a shrinking phase (release locks, acquire none); this guarantees conflict-serializability. Strict 2PL additionally holds all exclusive locks until commit/abort, preventing cascading rollbacks. 2PL does not prevent deadlocks.",
      a: [
        { svg: `<svg viewBox="0 0 640 190" width="640" class="dg">
  <line class="ln" x1="30" y1="20" x2="30" y2="150"/>
  <line class="ln" x1="30" y1="150" x2="300" y2="150" marker-end="url(#dg-arr)"/>
  <polyline class="ln-a" fill="none" points="30,150 60,130 90,110 120,80 150,60 190,90 230,115 270,150"/>
  <line class="ln ln-d" x1="150" y1="60" x2="150" y2="150"/>
  <text class="tx-a" x="150" y="50" text-anchor="middle">lock point</text>
  <text class="tx-m" x="90" y="168" text-anchor="middle">growing</text>
  <text class="tx-m" x="215" y="168" text-anchor="middle">shrinking</text>
  <text class="tx tx-b" x="165" y="186" text-anchor="middle">Basic 2PL</text>
  <text class="tx-s" x="36" y="16">locks held</text>
  <line class="ln" x1="350" y1="20" x2="350" y2="150"/>
  <line class="ln" x1="350" y1="150" x2="620" y2="150" marker-end="url(#dg-arr)"/>
  <polyline class="ln-a" fill="none" points="350,150 380,130 410,110 440,80 470,60 560,60 560,150"/>
  <text class="tx-a" x="560" y="50" text-anchor="middle">commit: release all</text>
  <text class="tx-m" x="410" y="168" text-anchor="middle">growing</text>
  <text class="tx-m" x="515" y="168" text-anchor="middle">locks held to end</text>
  <text class="tx tx-b" x="485" y="186" text-anchor="middle">Strict / rigorous 2PL</text>
</svg>`, caption: "Number of locks held over time: 2PL vs strict 2PL" },
        { table: { head: ["Variant", "Rule", "Serializable", "Cascadeless", "Deadlock-free"], rows: [
          ["Basic 2PL", "No lock acquired after any lock is released", "Yes", "No", "No"],
          ["Conservative (static) 2PL", "Acquire all locks before starting", "Yes", "No", "Yes (but impractical)"],
          ["Strict 2PL", "Hold X locks until commit/abort", "Yes", "Yes", "No"],
          ["Rigorous 2PL", "Hold all (S and X) locks until commit/abort", "Yes", "Yes", "No"]
        ] } },
        { p: "<b>Why it works:</b> the <i>lock point</i> (when the last lock is acquired) orders transactions; the equivalent serial order is the order of lock points." },
        { p: "<b>Why basic 2PL cascades:</b> T1 releases an X lock during shrinking, T2 reads the item, then T1 aborts → T2 read dirty data and must abort too. Strict 2PL closes that window, which is why real systems (InnoDB, SQL Server locking mode) use strict/rigorous 2PL." }
      ]
    },
    {
      id: "timestamp-ordering",
      q: "Explain the timestamp-ordering protocol and Thomas' write rule.",
      topic: "Concurrency Control",
      level: 3,
      top: false,
      short: "Each transaction gets a timestamp at start; the protocol ensures conflicting operations execute in timestamp order by tracking each item's read and write timestamps and aborting (and restarting) any transaction that would violate that order. Thomas' write rule ignores obsolete writes instead of aborting.",
      a: [
        { p: "Every transaction Ti gets TS(Ti). Each data item X stores <b>R-TS(X)</b> (largest TS that read it) and <b>W-TS(X)</b> (largest TS that wrote it)." },
        { code: `Ti issues READ(X):
    if TS(Ti) < W-TS(X):  abort Ti   (a younger txn already overwrote X)
    else: read; R-TS(X) = max(R-TS(X), TS(Ti))

Ti issues WRITE(X):
    if TS(Ti) < R-TS(X):  abort Ti   (a younger txn already read the old value)
    if TS(Ti) < W-TS(X):  abort Ti   [Thomas' write rule: skip the write instead]
    else: write; W-TS(X) = TS(Ti)

Aborted transactions restart with a NEW (larger) timestamp.`, lang: "text" },
        { table: { head: ["", "Timestamp ordering", "2PL"], rows: [
          ["Mechanism", "Order fixed at start by timestamps", "Order fixed at lock points"],
          ["Deadlocks", "Impossible (no waiting)", "Possible"],
          ["Cost", "More aborts/restarts; possible starvation; may be non-recoverable unless commits are delayed", "Blocking and waiting"]
        ] } },
        { p: "<b>Thomas' write rule</b> accepts some view-serializable (not conflict-serializable) schedules: if a younger transaction already wrote X, the older write would be overwritten anyway, so it's skipped. Timestamp ideas live on in MVCC and in deadlock-prevention schemes (wait-die, wound-wait)." }
      ]
    },
    {
      id: "mvcc",
      q: "What is MVCC (Multi-Version Concurrency Control)?",
      topic: "Concurrency Control",
      level: 3,
      top: true,
      short: "MVCC keeps multiple versions of each row; every transaction reads a consistent snapshot as of its start (or statement start), so readers never block writers and writers never block readers. Writers still lock rows against other writers. Old versions are cleaned up later (VACUUM, purge).",
      a: [
        { p: "Instead of overwriting a row in place, an update creates a <b>new version</b> tagged with the creating transaction's id. A reader uses its <b>snapshot</b> (which transactions were committed when it started) to pick the version visible to it." },
        { code: `Row versions of account id=1        (PostgreSQL-style)
   xmin=100  xmax=205  balance=1000     created by T100, superseded by T205
   xmin=205  xmax=  -  balance=1500     created by T205 (committed)

T200 started before T205 committed   → sees balance = 1000
T210 started after  T205 committed   → sees balance = 1500
Neither reader took a lock or waited for T205.`, lang: "text" },
        { table: { head: ["Engine", "Where old versions live", "Cleanup"], rows: [
          ["PostgreSQL", "Old tuples stay in the table heap (xmin/xmax)", "VACUUM / autovacuum removes dead tuples"],
          ["MySQL InnoDB", "Latest row in place; older versions rebuilt from undo log", "Purge thread"],
          ["Oracle", "Undo segments", "Undo retention; 'snapshot too old' if overwritten"]
        ] } },
        { ul: [
          "<b>Pros</b>: high read concurrency, consistent reads without locks, natural snapshot isolation.",
          "<b>Cons</b>: storage bloat, cleanup overhead, long-running transactions keep old versions alive; snapshot isolation alone allows <b>write skew</b>.",
          "Write–write conflicts are still resolved with row locks or first-updater/committer-wins."
        ] },
        { tip: "Link MVCC to isolation levels: READ COMMITTED = fresh snapshot per statement, REPEATABLE READ = one snapshot per transaction. That's the connection interviewers look for." }
      ]
    },

    /* ───────────── Indexing & Storage ───────────── */
    {
      id: "what-is-index",
      q: "What is an index? How does it speed up queries and what does it cost?",
      topic: "Indexing & Storage",
      level: 1,
      top: true,
      short: "An index is a separate data structure (usually a B+ tree) that maps column values to row locations, letting the DBMS find rows in O(log n) instead of scanning the whole table. It costs extra storage and slows INSERT/UPDATE/DELETE because the index must be maintained.",
      a: [
        { p: "Like a book's index: instead of reading every page (a <b>full table scan</b>, O(n)), the DB looks up the value in a sorted structure and jumps to matching rows. With a B+ tree of fan-out ~100s, even a billion rows needs only 3–4 page reads." },
        { code: `CREATE INDEX idx_student_email ON student(email);
CREATE UNIQUE INDEX idx_student_aadhaar ON student(aadhaar);

SELECT * FROM student WHERE email = 'asha@clg.in';   -- index seek, not full scan

DROP INDEX idx_student_email ON student;             -- MySQL syntax`, lang: "sql" },
        { h: "Types of indexes" },
        { ul: [
          "<b>Primary / clustered</b> vs <b>secondary / non-clustered</b> (next question).",
          "<b>Dense</b> (entry for every record) vs <b>sparse</b> (entry per block; needs sorted data).",
          "<b>Unique</b>, <b>composite</b> (multi-column), <b>covering</b> (contains all columns a query needs).",
          "By structure: <b>B+ tree</b> (default), <b>hash</b>, <b>bitmap</b> (low-cardinality analytics), <b>full-text / inverted</b>, <b>GiST/GIN</b>, spatial R-tree."
        ] },
        { table: { head: ["Benefit", "Cost"], rows: [
          ["Fast lookups, range scans, ORDER BY, joins, MIN/MAX", "Extra disk and memory"],
          ["Enforces uniqueness", "Every write must update every index"],
          ["Index-only scans avoid table access", "Optimizer may still ignore it for low selectivity"]
        ] } },
        { tip: "Always index <b>foreign key columns</b> used in joins — a very common real-world performance bug (and in MySQL InnoDB, FKs get an index automatically; PostgreSQL does not)." }
      ]
    },
    {
      id: "clustered-vs-nonclustered",
      q: "What is the difference between a clustered and a non-clustered index?",
      topic: "Indexing & Storage",
      level: 2,
      top: true,
      short: "A clustered index determines the physical order of rows — the table data is stored in the index's leaf pages — so there can be only one per table. A non-clustered index is a separate structure whose leaves hold the key plus a pointer (row id or primary key) to the actual row; a table can have many.",
      a: [
        { svg: `<svg viewBox="0 0 660 240" width="660" class="dg">
  <text class="tx tx-b" x="160" y="14" text-anchor="middle">Clustered index on id</text>
  <rect class="box-a" x="110" y="24" width="100" height="32" rx="6"/>
  <text class="tx tx-c" x="160" y="40" text-anchor="middle" dominant-baseline="middle">[ 4 ]</text>
  <line class="ln" x1="140" y1="56" x2="85" y2="96" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="180" y1="56" x2="235" y2="96" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="20" y="98" width="135" height="70" rx="6"/>
  <text class="tx-s tx-c" x="30" y="118">1 Asha  CSE 90k</text>
  <text class="tx-s tx-c" x="30" y="136">2 Ravi  ECE 70k</text>
  <text class="tx-s tx-c" x="30" y="154">3 Neha  CSE 80k</text>
  <rect class="box-g" x="170" y="98" width="135" height="70" rx="6"/>
  <text class="tx-s tx-c" x="180" y="118">4 Kiran ME  60k</text>
  <text class="tx-s tx-c" x="180" y="136">5 Meera CSE 75k</text>
  <text class="tx-s tx-c" x="180" y="154">6 Vikram HR 50k</text>
  <text class="tx-m" x="160" y="190" text-anchor="middle">leaf pages ARE the table rows,</text>
  <text class="tx-m" x="160" y="206" text-anchor="middle">stored in id order</text>
  <text class="tx tx-b" x="500" y="14" text-anchor="middle">Non-clustered index on name</text>
  <rect class="box-p" x="450" y="24" width="100" height="32" rx="6"/>
  <text class="tx tx-c" x="500" y="40" text-anchor="middle" dominant-baseline="middle">[ Neha ]</text>
  <line class="ln" x1="480" y1="56" x2="425" y2="96" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="520" y1="56" x2="575" y2="96" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="360" y="98" width="135" height="70" rx="6"/>
  <text class="tx-s tx-c" x="372" y="118">Asha  → id 1</text>
  <text class="tx-s tx-c" x="372" y="136">Kiran → id 4</text>
  <text class="tx-s tx-c" x="372" y="154">Meera → id 5</text>
  <rect class="box-w" x="510" y="98" width="135" height="70" rx="6"/>
  <text class="tx-s tx-c" x="522" y="118">Neha  → id 3</text>
  <text class="tx-s tx-c" x="522" y="136">Ravi  → id 2</text>
  <text class="tx-s tx-c" x="522" y="154">Vikram → id 6</text>
  <line class="ln-a ln-d" x1="500" y1="170" x2="500" y2="196" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="370" y="198" width="270" height="32" rx="6"/>
  <text class="tx" x="505" y="214" text-anchor="middle" dominant-baseline="middle">lookup in clustered index / heap</text>
</svg>`, caption: "Clustered: data lives in the index leaves. Non-clustered: leaves hold key + pointer, requiring an extra lookup" },
        { table: { head: ["", "Clustered", "Non-clustered"], rows: [
          ["Data storage", "Rows stored in index order (index = table)", "Separate structure; rows stored elsewhere"],
          ["Per table", "One", "Many"],
          ["Leaf contains", "Entire row", "Key + row locator (PK in InnoDB, RID in heap tables)"],
          ["Lookup cost", "One tree traversal", "Tree traversal + 'key lookup' / 'bookmark lookup' (unless covering)"],
          ["Range scans on key", "Excellent (sequential pages)", "Good for few rows; random I/O for many"],
          ["Insert cost", "Page splits if key is random (e.g. UUIDv4)", "Additional structure to maintain"],
          ["Default", "PRIMARY KEY in InnoDB and SQL Server", "UNIQUE constraints, CREATE INDEX"]
        ] } },
        { p: "A <b>covering index</b> avoids the second lookup by containing every column the query needs: <code>CREATE INDEX idx ON employee(name) INCLUDE (salary)</code> (SQL Server / PostgreSQL 11+) or a composite <code>(name, salary)</code> in MySQL." },
        { tip: "InnoDB secondary indexes store the <b>primary key</b> as the pointer — so a wide PK makes every secondary index bigger. That's a good reason to prefer a compact, monotonically increasing BIGINT PK." }
      ]
    },
    {
      id: "btree-vs-bplus-tree",
      q: "What is the difference between a B-tree and a B+ tree? Why do databases use B+ trees?",
      topic: "Indexing & Storage",
      level: 2,
      top: true,
      short: "Both are balanced, high fan-out search trees. In a B-tree keys and data pointers can be in any node; in a B+ tree internal nodes hold only keys for routing, all data pointers are in the leaves, and leaves are linked. That gives higher fan-out (shorter trees) and fast range scans, so databases use B+ trees.",
      a: [
        { svg: `<svg viewBox="0 0 600 180" width="600" class="dg">
  <rect class="box-a" x="240" y="15" width="120" height="34" rx="6"/>
  <text class="tx tx-b tx-c" x="300" y="32" text-anchor="middle" dominant-baseline="middle">20 | 40</text>
  <line class="ln" x1="255" y1="49" x2="115" y2="106" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="300" y1="49" x2="300" y2="106" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="345" y1="49" x2="485" y2="106" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="160" y="72" text-anchor="middle">k &lt; 20</text>
  <text class="tx-m" x="330" y="84">20 ≤ k &lt; 40</text>
  <text class="tx-m" x="440" y="72" text-anchor="middle">k ≥ 40</text>
  <rect class="box-g" x="40" y="108" width="140" height="34" rx="6"/>
  <text class="tx tx-c" x="110" y="125" text-anchor="middle" dominant-baseline="middle">5 · 10 · 15</text>
  <rect class="box-g" x="230" y="108" width="140" height="34" rx="6"/>
  <text class="tx tx-c" x="300" y="125" text-anchor="middle" dominant-baseline="middle">20 · 25 · 30</text>
  <rect class="box-g" x="420" y="108" width="140" height="34" rx="6"/>
  <text class="tx tx-c" x="490" y="125" text-anchor="middle" dominant-baseline="middle">40 · 45 · 50</text>
  <line class="ln-a ln-d" x1="180" y1="125" x2="228" y2="125" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a ln-d" x1="370" y1="125" x2="418" y2="125" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="300" y="168" text-anchor="middle">leaves hold every key + row pointer and are linked for range scans</text>
</svg>`, caption: "B+ tree of order 4: internal node only routes; keys 20 and 40 are repeated in the leaves" },
        { table: { head: ["", "B-tree", "B+ tree"], rows: [
          ["Data pointers", "In internal and leaf nodes", "Only in leaves"],
          ["Internal nodes", "Keys + data", "Keys only (routing) → higher fan-out, shorter tree"],
          ["Duplicate keys", "Each key stored once", "Separator keys repeated in leaves"],
          ["Leaf linking", "No", "Leaves form a (doubly) linked list"],
          ["Range query", "In-order traversal across levels", "Find start leaf, then walk the list"],
          ["Search cost", "May finish early at an internal node", "Always root → leaf (predictable)"],
          ["Used in", "Some file systems, older systems", "Almost all RDBMS indexes (InnoDB, PostgreSQL, Oracle)"]
        ] } },
        { h: "Why B+ trees fit disks" },
        { ul: [
          "Each node = one disk page (e.g. 16 KB in InnoDB), so fan-out is hundreds; height 3–4 covers billions of rows.",
          "Upper levels are small enough to stay cached in the buffer pool — a lookup often costs 1 disk read.",
          "Linked leaves make <code>BETWEEN</code>, <code>ORDER BY</code>, and <code>&gt;</code> queries sequential.",
          "Insertion splits nodes and grows the tree at the root, keeping it balanced (all leaves same depth)."
        ] },
        { warn: "Don't confuse B-tree with a binary tree: B-trees are <b>multi-way</b> with many keys per node. And in practice, 'B-tree index' in PostgreSQL/MySQL docs actually means a B+ tree." }
      ]
    },
    {
      id: "hash-index",
      q: "What is a hash index? When is it better or worse than a B+ tree index?",
      topic: "Indexing & Storage",
      level: 2,
      top: false,
      short: "A hash index applies a hash function to the key to find a bucket, giving O(1) average equality lookups. It cannot serve range queries, ORDER BY, or prefix matches, and suffers from collisions and resizing; B+ trees handle both equality and ranges.",
      a: [
        { table: { head: ["", "Hash index", "B+ tree index"], rows: [
          ["Equality (<code>=</code>, <code>IN</code>)", "O(1) average", "O(log n)"],
          ["Range (<code>&lt;</code>, <code>BETWEEN</code>)", "Not supported", "Efficient"],
          ["ORDER BY / MIN / MAX", "No", "Yes"],
          ["Leftmost-prefix on composite key", "No — needs the full key", "Yes"],
          ["Degradation", "Collisions, skew, rehashing", "Stays balanced"]
        ] } },
        { ul: [
          "MySQL MEMORY engine supports <code>USING HASH</code>; InnoDB builds an <b>adaptive hash index</b> automatically over hot B+ tree pages.",
          "PostgreSQL hash indexes are crash-safe (WAL-logged) since v10 and can be smaller than B-trees for long keys.",
          "Hashing is also central to <b>hash joins</b> and hash-based sharding.",
          "Static vs <b>extendible</b>/<b>linear</b> hashing: dynamic schemes grow bucket directories without rehashing everything."
        ] },
        { code: `CREATE INDEX idx_session_token ON sessions USING HASH (token);  -- PostgreSQL
SELECT * FROM sessions WHERE token = 'f3a9...';                   -- ✔ uses hash
SELECT * FROM sessions WHERE token > 'f';                         -- ✘ cannot use it`, lang: "sql" }
      ]
    },
    {
      id: "when-indexes-hurt",
      q: "When should you not use an index? Why might a query ignore an existing index?",
      topic: "Indexing & Storage",
      level: 2,
      top: true,
      short: "Indexes hurt write-heavy tables, small tables, and low-selectivity columns, and every extra index costs storage and write time. A query skips an index when the predicate isn't sargable (function on the column, leading wildcard, implicit type cast), when it would return a large fraction of rows, or when a composite index's leading column isn't used.",
      a: [
        { h: "When an index is a bad idea" },
        { ul: [
          "<b>Write-heavy tables</b> (logs, events): each INSERT updates every index.",
          "<b>Low-cardinality columns</b> (gender, boolean status) — a B+ tree lookup returning 50% of rows is slower than a sequential scan.",
          "<b>Tiny tables</b> — a scan of a few pages is already cheap.",
          "<b>Redundant indexes</b> — <code>(a)</code> is redundant if <code>(a, b)</code> exists.",
          "Columns that are frequently updated (index entry moves every time)."
        ] },
        { h: "Why an existing index isn't used" },
        { code: `-- ✘ Function on the indexed column (not sargable)
WHERE YEAR(created_at) = 2025
-- ✔ Rewrite as a range
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'

-- ✘ Leading wildcard                 ✔ Prefix match can use the index
WHERE name LIKE '%kumar'              WHERE name LIKE 'kumar%'

-- ✘ Implicit cast: phone is VARCHAR, compared to a number
WHERE phone = 9876543210              -- ✔ WHERE phone = '9876543210'

-- ✘ Arithmetic on the column         ✔ Move it to the constant side
WHERE salary * 12 > 1200000           WHERE salary > 100000

-- ✘ OR across different columns (may need two indexes + index merge / UNION)
WHERE email = ? OR phone = ?

-- ✘ Composite index (dept, salary) but filtering only on salary
WHERE salary > 50000`, lang: "sql" },
        { tip: "Always verify with <code>EXPLAIN</code>. Also mention stale statistics (<code>ANALYZE TABLE</code>) as a reason the optimizer picks a bad plan, and functional/expression indexes (<code>CREATE INDEX … ((YEAR(created_at)))</code>) as a fix when you can't rewrite the query." }
      ]
    },
    {
      id: "composite-index",
      q: "What is a composite index? Explain the leftmost-prefix rule and how to order columns.",
      topic: "Indexing & Storage",
      level: 2,
      top: true,
      short: "A composite index is built on multiple columns, sorted by the first column, then the second within it, and so on. It can serve queries that filter on a leftmost prefix of its columns; a range condition stops the index from being used for seeks on later columns.",
      a: [
        { p: "<code>INDEX(dept_id, joining_year, salary)</code> is sorted like a phone book: by dept_id, then joining_year within each dept, then salary." },
        { table: { head: ["WHERE clause", "Uses index?", "Why"], rows: [
          ["<code>dept_id = 10</code>", "✔", "Leftmost prefix"],
          ["<code>dept_id = 10 AND joining_year = 2022</code>", "✔", "Prefix (a, b)"],
          ["<code>dept_id = 10 AND joining_year = 2022 AND salary &gt; 50000</code>", "✔ fully", "Equality, equality, range on last"],
          ["<code>joining_year = 2022</code>", "✘ (seek)", "Skips the first column*"],
          ["<code>dept_id = 10 AND salary = 50000</code>", "Partially", "Seeks on dept_id; salary filtered within that range"],
          ["<code>dept_id &gt; 5 AND joining_year = 2022</code>", "Partially", "Range on dept_id stops seeks on later columns"],
          ["<code>dept_id = 10 ORDER BY joining_year</code>", "✔", "Rows already in order — no filesort"]
        ] } },
        { p: "*MySQL 8.0 can sometimes use a <b>skip scan</b> when the first column has few distinct values, and PostgreSQL may do a full index scan, but don't rely on it." },
        { h: "Column ordering guidelines" },
        { ol: [
          "Columns tested with <b>equality</b> first, <b>range</b> columns last.",
          "Among equality columns, the one used by the most queries first (so more queries can use the prefix).",
          "Add columns needed by SELECT/ORDER BY to make it <b>covering</b> when worthwhile.",
          "Don't also create <code>INDEX(dept_id)</code> — the composite already covers it."
        ] },
        { code: `CREATE INDEX idx_emp_dept_year_sal ON employee(dept_id, joining_year, salary);

EXPLAIN SELECT salary FROM employee
WHERE dept_id = 10 AND joining_year = 2022;   -- 'Using index' → covering, no table access`, lang: "sql" }
      ]
    },
    {
      id: "query-optimization-explain",
      q: "How does a query optimizer work? How do you read EXPLAIN output to tune a slow query?",
      topic: "Indexing & Storage",
      level: 3,
      top: false,
      short: "The optimizer parses SQL, rewrites it, enumerates equivalent plans (join orders, access paths, join algorithms), estimates each plan's cost from table statistics, and picks the cheapest. EXPLAIN shows the chosen plan: scan types, indexes used, estimated rows, and join methods, which reveals full scans, missing indexes, and bad estimates.",
      a: [
        { ol: [
          "<b>Parse</b> → syntax tree; <b>bind</b> names to tables/columns.",
          "<b>Rewrite</b> → flatten subqueries into joins, push predicates down, remove redundant conditions.",
          "<b>Plan enumeration</b> → access path per table (full scan, index seek/scan, index-only), join order, join algorithm (nested loop, hash, merge).",
          "<b>Cost estimation</b> → uses statistics (row counts, histograms, distinct values) to estimate I/O and CPU.",
          "<b>Execute</b> the cheapest plan (plans may be cached)."
        ] },
        { code: `EXPLAIN SELECT e.name, d.dept_name
FROM employee e JOIN department d ON d.dept_id = e.dept_id
WHERE e.email = 'asha@clg.in';

-- MySQL (simplified)
-- table | type  | key               | rows | Extra
-- e     | ref   | idx_emp_email     |   1  | NULL
-- d     | eq_ref| PRIMARY           |   1  | NULL`, lang: "sql" },
        { table: { head: ["MySQL 'type'", "Meaning", "PostgreSQL equivalent"], rows: [
          ["ALL", "Full table scan — usually the red flag", "Seq Scan"],
          ["index", "Full index scan", "Index (Only) Scan without condition"],
          ["range", "Index range scan", "Index Scan with range / Bitmap Heap Scan"],
          ["ref / eq_ref", "Index lookup (non-unique / unique per join row)", "Index Scan"],
          ["const", "At most one row via PK/unique", "Index Scan (1 row)"]
        ] } },
        { h: "Tuning checklist" },
        { ul: [
          "Use <code>EXPLAIN ANALYZE</code> (PostgreSQL, MySQL 8.0.18+) to compare <b>estimated vs actual rows</b> — big gaps mean stale stats → run ANALYZE.",
          "Look for full scans on large tables, 'Using filesort' / 'Using temporary', and nested loops over large inputs.",
          "Add or reorder indexes; make predicates sargable; select only needed columns (no <code>SELECT *</code>).",
          "Replace OFFSET pagination on deep pages with keyset pagination (<code>WHERE id &gt; last_id LIMIT 20</code>)."
        ] }
      ]
    },

    /* ───────────── Recovery ───────────── */
    {
      id: "log-based-recovery-wal",
      q: "How does a DBMS recover from a crash? Explain log-based recovery and write-ahead logging (WAL).",
      topic: "Recovery",
      level: 3,
      top: true,
      short: "The DBMS appends every change to a log before applying it to data pages (write-ahead logging), and forces the log to disk at commit. After a crash it redoes the logged changes of committed transactions and undoes those of uncommitted ones, restoring atomicity and durability.",
      a: [
        { p: "Data pages are cached in a buffer pool and written to disk lazily. To survive crashes, the DBMS keeps a sequential, append-only <b>log</b> of records like <code>&lt;T1, A, old=1000, new=500&gt;</code>." },
        { h: "WAL rules" },
        { ol: [
          "A log record describing a change must reach stable storage <b>before</b> the modified data page is written to disk (so any on-disk change can be undone).",
          "All log records of a transaction, including its <code>&lt;COMMIT&gt;</code> record, must be flushed <b>before</b> the commit is acknowledged (so it can be redone)."
        ] },
        { code: `<T1 START>
<T1, A, 1000, 500>        old value (undo), new value (redo)
<T1, B, 2000, 2500>
<T1 COMMIT>
<T2 START>
<T2, C, 700, 600>
--- crash ---

Recovery:  T1 has COMMIT  → REDO: A = 500, B = 2500
           T2 has no COMMIT → UNDO: C = 700`, lang: "text", title: "Undo/redo log" },
        { table: { head: ["Scheme", "Data written to disk", "Needs"], rows: [
          ["Deferred update", "Only after commit", "Redo only (no undo)"],
          ["Immediate update", "Possibly before commit", "Undo + redo (what real systems do)"]
        ] } },
        { h: "ARIES (used by most commercial DBMSs)" },
        { ol: [
          "<b>Analysis</b>: scan from the last checkpoint to find dirty pages and active (loser) transactions.",
          "<b>Redo</b>: repeat history — reapply all changes (even of losers) from the earliest needed LSN.",
          "<b>Undo</b>: roll back loser transactions, writing compensation log records (CLRs) so undo is itself crash-safe."
        ] },
        { tip: "Why WAL is fast: the log is written <b>sequentially</b> and only the log must be fsynced at commit; random writes to data pages happen later in the background ('steal / no-force' buffer policy). PostgreSQL WAL, InnoDB redo log, and SQL Server transaction log are all implementations." }
      ]
    },
    {
      id: "checkpoints",
      q: "What is a checkpoint and why is it needed?",
      topic: "Recovery",
      level: 3,
      top: false,
      short: "A checkpoint periodically flushes dirty pages and writes a checkpoint record to the log, so crash recovery only needs to scan the log from the last checkpoint instead of from the beginning. It bounds recovery time and lets old log segments be recycled.",
      a: [
        { p: "Without checkpoints, recovery would replay the entire log since the database was created." },
        { ol: [
          "Temporarily stop/accept updates (simple checkpoint) or continue (fuzzy checkpoint).",
          "Flush log records in memory to stable storage.",
          "Flush modified (dirty) buffer pages to disk.",
          "Write a <code>&lt;CHECKPOINT L&gt;</code> record listing active transactions L."
        ] },
        { p: "At recovery: transactions that committed before the checkpoint need nothing; those that committed after it are redone; those still active at crash time are undone (possibly scanning back past the checkpoint for transactions in L)." },
        { ul: [
          "<b>Fuzzy checkpoints</b> (ARIES, InnoDB, PostgreSQL) don't stop the world: they record the dirty-page table and active transactions, and pages are flushed gradually.",
          "Trade-off: frequent checkpoints = faster recovery but more I/O during normal operation (PostgreSQL: <code>checkpoint_timeout</code>, <code>max_wal_size</code>)."
        ] }
      ]
    },
    {
      id: "shadow-paging",
      q: "What is shadow paging? How does it compare to log-based recovery?",
      topic: "Recovery",
      level: 3,
      top: false,
      short: "Shadow paging keeps two page tables: the unchanged shadow table and a current table. Updates are written to new copies of pages; commit atomically swaps the root pointer to the current table, and abort simply discards it. It needs no undo/redo log but fragments data and handles concurrency poorly.",
      a: [
        { ol: [
          "At transaction start, copy the page table: <b>shadow page table</b> (on disk, never modified) and <b>current page table</b>.",
          "On write, copy the page to a new free location, modify it, and point the current table at the new copy.",
          "<b>Commit</b>: flush modified pages and the current page table, then atomically update the single root pointer to the current table.",
          "<b>Crash / abort</b>: the root still points to the shadow table — the old state is intact. Free the new pages."
        ] },
        { table: { head: ["", "Shadow paging", "Log-based (WAL)"], rows: [
          ["Undo/redo", "Not needed", "Needed"],
          ["Recovery speed", "Instant", "Proportional to log since checkpoint"],
          ["Commit overhead", "Flush every modified page + page table", "Flush sequential log only"],
          ["Data locality", "Pages scatter → fragmentation", "Pages stay in place"],
          ["Garbage collection", "Old pages must be reclaimed", "Log segments recycled"],
          ["Concurrency", "Hard for many concurrent transactions", "Well supported"]
        ] } },
        { p: "The copy-on-write idea survives in modern systems: LMDB and CouchDB use copy-on-write B-trees, and file systems like ZFS/Btrfs use the same root-pointer-swap trick." }
      ]
    },

    /* ───────────── NoSQL & Scaling ───────────── */
    {
      id: "sql-vs-nosql",
      q: "What is the difference between SQL and NoSQL databases? When would you choose each?",
      topic: "NoSQL & Scaling",
      level: 1,
      top: true,
      short: "SQL databases are relational with fixed schemas, joins and strong ACID transactions, and traditionally scale vertically. NoSQL databases use flexible data models (document, key-value, column, graph), are designed to scale horizontally, and often trade strict consistency for availability and throughput (BASE).",
      a: [
        { table: { head: ["", "SQL (relational)", "NoSQL"], rows: [
          ["Data model", "Tables, rows, columns", "Documents, key-value, wide-column, graph"],
          ["Schema", "Fixed, defined up front (schema-on-write)", "Flexible / schema-on-read"],
          ["Relationships", "Joins, foreign keys", "Embedding/denormalization; limited or no joins"],
          ["Transactions", "ACID, multi-row, multi-table", "Often single-document/row atomicity; many now offer multi-doc transactions"],
          ["Consistency", "Strong", "Often eventual (tunable) — BASE"],
          ["Scaling", "Vertical first; horizontal via replicas/sharding is harder", "Horizontal by design (sharding built in)"],
          ["Query language", "Standard SQL", "Database-specific APIs (MQL, CQL, Cypher)"],
          ["Examples", "MySQL, PostgreSQL, Oracle, SQL Server", "MongoDB, Cassandra, Redis, DynamoDB, Neo4j"]
        ] } },
        { h: "Choosing" },
        { ul: [
          "<b>SQL</b>: structured data with relationships, complex queries/reporting, strong integrity (banking, orders, inventory, ERP).",
          "<b>NoSQL</b>: massive write throughput, flexible or evolving schemas, simple access patterns by key, geo-distributed availability (sessions, catalogs, IoT/time-series, feeds, caching, social graphs)."
        ] },
        { p: "<b>BASE</b> = Basically Available, Soft state, Eventually consistent — the counterpoint to ACID." },
        { tip: "Avoid 'NoSQL is faster / SQL doesn't scale'. Say it depends on access patterns; many systems are <b>polyglot</b> — PostgreSQL for orders, Redis for caching, Elasticsearch for search — and NewSQL systems (Spanner, CockroachDB) offer SQL + horizontal scaling." }
      ]
    },
    {
      id: "nosql-types",
      q: "What are the different types of NoSQL databases?",
      topic: "NoSQL & Scaling",
      level: 1,
      top: false,
      short: "Four main types: key-value stores (Redis, DynamoDB), document stores (MongoDB), wide-column stores (Cassandra, HBase), and graph databases (Neo4j). Each is optimized for a different access pattern.",
      a: [
        { table: { head: ["Type", "Model", "Strengths", "Examples", "Use cases"], rows: [
          ["Key-value", "Opaque value per unique key", "O(1) get/put, extreme speed", "Redis, DynamoDB, Memcached", "Caching, sessions, rate limiting, leaderboards"],
          ["Document", "JSON/BSON documents with nested fields; queryable", "Flexible schema, rich queries, secondary indexes", "MongoDB, Couchbase, Firestore", "Catalogs, CMS, user profiles"],
          ["Wide-column", "Rows keyed by partition key with dynamic columns", "Huge write throughput, linear scaling", "Cassandra, HBase, ScyllaDB, Bigtable", "Time-series, IoT, messaging, logs"],
          ["Graph", "Nodes and edges with properties", "Fast multi-hop traversals", "Neo4j, Amazon Neptune", "Social networks, recommendations, fraud detection"]
        ] } },
        { code: `// MongoDB document: order with embedded items (no join needed)
{
  "_id": "ord_1001",
  "customer": { "id": 42, "name": "Asha" },
  "items": [
    { "sku": "BK-17", "qty": 2, "price": 399 },
    { "sku": "PN-03", "qty": 1, "price": 49 }
  ],
  "status": "SHIPPED"
}`, lang: "text" },
        { p: "Other specialised categories: time-series (InfluxDB, TimescaleDB), search engines (Elasticsearch), and vector databases for embeddings." }
      ]
    },
    {
      id: "cap-theorem",
      q: "What is the CAP theorem?",
      topic: "NoSQL & Scaling",
      level: 2,
      top: true,
      short: "In a distributed data store, when a network partition occurs, you must choose between Consistency (every read sees the latest write) and Availability (every request gets a non-error response). Since partitions are unavoidable, real systems are effectively CP or AP.",
      a: [
        { ul: [
          "<b>C — Consistency</b> (linearizability): every read returns the most recent write or an error.",
          "<b>A — Availability</b>: every request to a non-failed node gets a (non-error) response.",
          "<b>P — Partition tolerance</b>: the system keeps working despite lost/delayed messages between nodes."
        ] },
        { svg: `<svg viewBox="0 0 540 280" width="540" class="dg">
  <polygon class="ln" fill="none" points="270,60 110,225 430,225"/>
  <circle class="box-a" cx="270" cy="60" r="24"/>
  <text class="tx tx-b" x="270" y="60" text-anchor="middle" dominant-baseline="middle">C</text>
  <circle class="box-g" cx="110" cy="225" r="24"/>
  <text class="tx tx-b" x="110" y="225" text-anchor="middle" dominant-baseline="middle">A</text>
  <circle class="box-p" cx="430" cy="225" r="24"/>
  <text class="tx tx-b" x="430" y="225" text-anchor="middle" dominant-baseline="middle">P</text>
  <text class="tx tx-b" x="270" y="24" text-anchor="middle">Consistency</text>
  <text class="tx tx-b" x="110" y="268" text-anchor="middle">Availability</text>
  <text class="tx tx-b" x="430" y="268" text-anchor="middle">Partition tolerance</text>
  <text class="tx tx-a" x="176" y="134" text-anchor="end">CA</text>
  <text class="tx-m" x="176" y="150" text-anchor="end">single-node RDBMS</text>
  <text class="tx tx-a" x="364" y="134">CP</text>
  <text class="tx-m" x="364" y="150">HBase, etcd, ZooKeeper</text>
  <text class="tx tx-a" x="270" y="196" text-anchor="middle">AP</text>
  <text class="tx-m" x="270" y="212" text-anchor="middle">Cassandra, DynamoDB, CouchDB</text>
</svg>`, caption: "CAP triangle: pick two — but in a distributed system P is mandatory, so the real choice is C vs A during a partition" },
        { table: { head: ["Choice during a partition", "Behaviour", "Examples"], rows: [
          ["CP", "Refuse or error on requests that can't be kept consistent", "HBase, ZooKeeper, etcd, MongoDB with majority read/write concern"],
          ["AP", "Keep serving, possibly stale; reconcile later (eventual consistency)", "Cassandra, DynamoDB (default), CouchDB, Riak"],
          ["CA", "Only possible when there are no partitions — i.e. not truly distributed", "A single-node PostgreSQL/MySQL"]
        ] } },
        { h: "PACELC — the fuller picture" },
        { p: "If <b>P</b>artition: choose <b>A</b> or <b>C</b>; <b>E</b>lse (normal operation): choose <b>L</b>atency or <b>C</b>onsistency. Cassandra is PA/EL; Spanner is PC/EC. Many systems are <i>tunable</i> — Cassandra's QUORUM reads+writes (R + W &gt; N) give strong consistency at higher latency." },
        { warn: "The 'C' in CAP is <b>not</b> the 'C' in ACID. CAP-consistency means linearizability across replicas; ACID-consistency means integrity constraints hold." }
      ]
    },
    {
      id: "sharding-partitioning-replication",
      q: "What is the difference between sharding, partitioning and replication?",
      topic: "NoSQL & Scaling",
      level: 2,
      top: true,
      short: "Partitioning splits a table into pieces (by range, list or hash), usually within one server. Sharding is horizontal partitioning across multiple servers, each holding a subset of rows, to scale writes and storage. Replication copies the same data to multiple servers for availability and read scaling.",
      a: [
        { svg: `<svg viewBox="0 0 560 240" width="560" class="dg">
  <rect class="box" x="220" y="10" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="280" y="27" text-anchor="middle" dominant-baseline="middle">Application</text>
  <line class="ln" x1="280" y1="44" x2="280" y2="70" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="180" y="72" width="200" height="34" rx="6"/>
  <text class="tx tx-b" x="280" y="89" text-anchor="middle" dominant-baseline="middle">Router: hash(user_id) % 2</text>
  <line class="ln" x1="240" y1="106" x2="150" y2="138" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="320" y1="106" x2="410" y2="138" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="60" y="140" width="180" height="34" rx="6"/>
  <text class="tx tx-b" x="150" y="157" text-anchor="middle" dominant-baseline="middle">Shard 0 primary</text>
  <rect class="box-g" x="320" y="140" width="180" height="34" rx="6"/>
  <text class="tx tx-b" x="410" y="157" text-anchor="middle" dominant-baseline="middle">Shard 1 primary</text>
  <line class="ln-a ln-d" x1="150" y1="174" x2="150" y2="198" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a ln-d" x1="410" y1="174" x2="410" y2="198" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="70" y="200" width="160" height="30" rx="6"/>
  <text class="tx" x="150" y="215" text-anchor="middle" dominant-baseline="middle">Shard 0 replica</text>
  <rect class="box" x="330" y="200" width="160" height="30" rx="6"/>
  <text class="tx" x="410" y="215" text-anchor="middle" dominant-baseline="middle">Shard 1 replica</text>
  <text class="tx-m" x="160" y="192">replicates</text>
  <text class="tx-m" x="420" y="192">replicates</text>
</svg>`, caption: "Sharding splits data across primaries; replication copies each shard for availability and reads" },
        { table: { head: ["", "Partitioning", "Sharding", "Replication"], rows: [
          ["What", "Split a table into parts", "Split data across servers", "Copy data to multiple servers"],
          ["Each node holds", "N/A (same server)", "A <b>subset</b> of rows", "A <b>full copy</b> (of its shard)"],
          ["Main goal", "Manageability, partition pruning, easy archival", "Scale writes and storage", "High availability, read scaling, disaster recovery"],
          ["Complexity", "Low (built into the DB)", "High: routing, cross-shard joins/transactions, rebalancing", "Medium: replication lag, failover"]
        ] } },
        { h: "Key details" },
        { ul: [
          "<b>Horizontal partitioning</b> splits rows; <b>vertical partitioning</b> splits columns (e.g. move large BLOBs to another table).",
          "Partition/shard strategies: <b>range</b> (dates — risk of hot spots), <b>hash</b> (even spread, no range queries), <b>list</b> (region), <b>directory/lookup</b>, <b>consistent hashing</b> (minimal movement when adding nodes).",
          "Pick a shard key with high cardinality and even access; avoid cross-shard queries on hot paths.",
          "Replication: <b>primary–replica</b> (writes to one leader) vs <b>multi-primary</b>; <b>synchronous</b> (no data loss, slower) vs <b>asynchronous</b> (fast, replica lag → stale reads)."
        ] },
        { code: `-- Native partitioning (MySQL / PostgreSQL similar)
CREATE TABLE orders (
    id BIGINT, order_date DATE, amount DECIMAL(10,2),
    PRIMARY KEY (id, order_date)
)
PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION pmax  VALUES LESS THAN MAXVALUE
);`, lang: "sql" },
        { tip: "Standard scaling order to describe: indexes and query tuning → caching → read replicas → vertical scaling → partitioning → sharding. Sharding is the last resort because it complicates everything." }
      ]
    }
  ]
});
