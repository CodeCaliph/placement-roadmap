/* tech stack: PostgreSQL & MySQL — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "postgres",
  title: "PostgreSQL & MySQL",
  short: "PG/MySQL",
  icon: "⛁",
  blurb: "With PostgreSQL or MySQL on your resume, interviewers move past textbook DBMS theory. They ask how the engines actually differ: data types, MVCC and VACUUM vs undo logs, default isolation levels, index types and EXPLAIN, locking, pooling, UPSERT, migrations, replication and SQL injection.",
  topics: ["Engines & Data Types", "MVCC & Locking", "Indexes & Query Plans", "SQL Features", "Operations & Scaling", "Security & Performance"],
  questions: [

    /* ───────────── Engines & Data Types ───────────── */
    {
      id: "pg-vs-mysql",
      q: "What are the practical differences between PostgreSQL and MySQL (InnoDB)? When would you pick each?",
      topic: "Engines & Data Types",
      level: 1,
      top: true,
      short: "Both are mature open-source relational databases with ACID transactions. PostgreSQL has richer types (JSONB, arrays, ranges), more index types, transactional DDL, extensions like PostGIS and pgvector, and Read Committed as the default isolation level. MySQL with InnoDB is simpler to run, stores tables clustered on the primary key, defaults to Repeatable Read, and has a huge ecosystem of read-heavy web deployments.",
      a: [
        { p: "Both are mature, ACID-compliant relational databases, and either one runs a typical CRUD app well. The differences show up in <b>internals</b> (how rows and old versions are stored), <b>features</b> (types, indexes, SQL extensions) and <b>operations</b> (replication, tooling). Below, \"MySQL\" means MySQL 8.x with the default InnoDB engine." },
        { table: { head: ["Area", "PostgreSQL (16–18)", "MySQL 8 (InnoDB)"], rows: [
          ["Connection model", "One OS <b>process</b> per connection", "One <b>thread</b> per connection"],
          ["Table storage", "Heap table; every index points to a tuple location", "<b>Clustered</b> B+ tree on the primary key; secondary indexes store the PK"],
          ["MVCC old versions", "Kept in the table itself, cleaned by <b>VACUUM</b>", "Kept in the <b>undo log</b>, cleaned by the purge thread"],
          ["Default isolation", "<b>Read Committed</b>", "<b>Repeatable Read</b>"],
          ["DDL inside a transaction", "Transactional: <code>ALTER TABLE</code> can be rolled back", "Implicit commit: DDL cannot be rolled back"],
          ["Types", "JSONB, arrays, ranges, UUID, enums, custom types, domains", "JSON (binary), ENUM/SET; no arrays, no native UUID type"],
          ["Index types", "B-tree, Hash, GIN, GiST, SP-GiST, BRIN; partial, expression, INCLUDE", "B+ tree, FULLTEXT, SPATIAL; functional (8.0.13+), multi-valued for JSON arrays, invisible indexes"],
          ["UPSERT / RETURNING", "<code>ON CONFLICT … DO UPDATE</code>; <code>RETURNING</code>", "<code>ON DUPLICATE KEY UPDATE</code>; no <code>RETURNING</code>"],
          ["String comparison", "Case-sensitive by default", "Default collation <code>utf8mb4_0900_ai_ci</code> is case- and accent-insensitive"],
          ["Replication", "Physical streaming + logical (publications)", "Binlog (row-based) async/semi-sync, Group Replication"],
          ["Extensions", "PostGIS, pgvector, pg_trgm, TimescaleDB, Citus", "Plugins; less common"],
          ["License", "PostgreSQL License (permissive)", "GPLv2 community edition, Oracle-owned"]
        ] } },
        { h: "How to choose" },
        { ul: [
          "<b>PostgreSQL</b>: complex queries and reporting, strict data integrity, JSON and relational data in one place, geospatial (PostGIS), vector search (pgvector), and when you want many features in one database.",
          "<b>MySQL</b>: simple, read-heavy web workloads, teams with MySQL expertise, and managed setups like PlanetScale/Vitess or Aurora MySQL. Its replication setup is simple and widely used.",
          "For a new project with no constraints, many teams default to PostgreSQL today. That is a reasonable answer, as long as you can say <i>why</i>."
        ] },
        { warn: "Porting trap: <code>WHERE email = 'Asha@X.com'</code> finds <code>asha@x.com</code> in MySQL (case-insensitive collation) but not in PostgreSQL. In PostgreSQL, use <code>lower(email)</code> with an expression index, or the <code>citext</code> type." },
        { tip: "Do not say \"MySQL is not ACID\". That was true for the old MyISAM engine, but InnoDB has been the default since MySQL 5.5 and is fully transactional. Mention InnoDB by name; it shows you know the history." }
      ]
    },
    {
      id: "auto-increment-identity-uuid",
      q: "SERIAL vs IDENTITY vs AUTO_INCREMENT — and when would you use a UUID primary key instead?",
      topic: "Engines & Data Types",
      level: 2,
      top: true,
      short: "SERIAL is PostgreSQL's old shorthand for an integer column plus a sequence default. IDENTITY (PostgreSQL 10+) is the SQL-standard replacement and is preferred. MySQL uses AUTO_INCREMENT. All of them can leave gaps. UUIDs are useful when IDs must be generated outside the database or must not be guessable, but random UUIDv4 keys hurt B-tree insert locality. Time-ordered UUIDv7 avoids most of that.",
      a: [
        { p: "All three give you an auto-generated integer key. They differ in standards compliance, how they handle permissions and explicit inserts, and how the counter is stored." },
        { code: `-- PostgreSQL: old style (avoid in new code)
CREATE TABLE users_old (id SERIAL PRIMARY KEY, email text);
--   = integer column + CREATE SEQUENCE users_old_id_seq + DEFAULT nextval('users_old_id_seq')

-- PostgreSQL 10+: SQL-standard identity column (preferred)
CREATE TABLE users (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- explicit INSERT of id is an error
  email text NOT NULL UNIQUE
);
-- GENERATED BY DEFAULT AS IDENTITY allows explicit ids (useful for data imports)

-- MySQL
CREATE TABLE users (
  id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE
);
SELECT LAST_INSERT_ID();          -- MySQL: id of the last insert on this connection
-- PostgreSQL: INSERT ... RETURNING id;`, lang: "sql", title: "Auto-generated integer keys" },
        { table: { head: ["", "SERIAL", "IDENTITY", "AUTO_INCREMENT"], rows: [
          ["Engine", "PostgreSQL (legacy)", "PostgreSQL 10+ (SQL standard)", "MySQL / MariaDB"],
          ["Under the hood", "Sequence + DEFAULT; separate object", "Sequence tied to the column", "Counter kept by InnoDB per table"],
          ["Blocks manual ids?", "No", "Yes with <code>ALWAYS</code>", "No (explicit values are accepted)"],
          ["Gotchas", "Sequence needs its own GRANT; copying the table carries the default", "Cleaner permissions and schema dumps", "Before 8.0 the counter reset to MAX(id)+1 after restart; 8.0 persists it"]
        ] } },
        { p: "<b>Gaps are normal everywhere.</b> Sequences and auto-increment counters are not transactional. A rolled-back insert, or an UPSERT that hit a conflict, still uses up a value. Never rely on IDs being consecutive, for example for invoice numbers." },
        { h: "UUID primary keys" },
        { ul: [
          "<b>Why</b>: IDs can be generated in the app or on mobile clients before the insert. They are unique across shards and merged databases, and they are not enumerable (<code>/orders/1001</code> reveals your order count; a UUID does not).",
          "<b>Cost</b>: 16 bytes instead of 8. Random <b>UUIDv4</b> values insert at random positions in the B-tree. That causes page splits and poor cache locality. In InnoDB it is worse: the table itself is clustered on the PK, and every secondary index stores a copy of the PK.",
          "<b>Fix</b>: use time-ordered <b>UUIDv7</b> (RFC 9562). New values land at the right edge of the index, just like a sequence. PostgreSQL 18 has <code>uuidv7()</code> built in (<code>gen_random_uuid()</code> for v4 since PG 13). In MySQL, generate it in the app or use <code>UUID_TO_BIN(UUID(), 1)</code>, which reorders the time fields of a v1 UUID. Store it as <code>BINARY(16)</code>, not <code>CHAR(36)</code>.",
          "A common middle ground: a <code>bigint</code> identity as the internal PK, plus a separate unique UUID column as the public ID used in URLs."
        ] },
        { warn: "Storing UUIDs as <code>VARCHAR(36)</code> in MySQL more than doubles the key size (36+ bytes vs 16) and slows comparisons. PostgreSQL has a native 16-byte <code>uuid</code> type; always use it." },
        { tip: "If asked \"auto-increment or UUID?\", answer with the trade-off: integers are smaller and faster; UUIDs are better for distributed generation and hiding counts; UUIDv7 gets most of both." }
      ]
    },
    {
      id: "json-vs-jsonb",
      q: "What is the difference between JSON and JSONB in PostgreSQL, and how does MySQL's JSON type compare?",
      topic: "Engines & Data Types",
      level: 2,
      top: true,
      short: "PostgreSQL's json stores the exact input text and re-parses it on every access. jsonb stores a parsed binary form: it drops whitespace and duplicate keys and reorders keys, but it is much faster to query and supports GIN indexes and operators like @> (contains). Use jsonb almost always. MySQL's JSON type is also binary, but you index it through generated columns or functional indexes.",
      a: [
        { table: { head: ["", "json", "jsonb"], rows: [
          ["Stored as", "Exact text copy", "Decomposed binary format"],
          ["Whitespace, key order, duplicate keys", "Preserved", "Whitespace dropped, keys reordered, last duplicate key wins"],
          ["Insert speed", "Slightly faster (only validated)", "Slightly slower (parsed and converted)"],
          ["Read / query speed", "Re-parsed on every access", "Fast, no re-parsing"],
          ["Indexing", "Expression indexes only", "GIN on the whole document, plus expression indexes"],
          ["Operators", "<code>-&gt;</code>, <code>-&gt;&gt;</code>, <code>#&gt;</code>", "All of those plus <code>@&gt;</code>, <code>?</code>, <code>?|</code>, <code>?&amp;</code>, <code>jsonb_set</code>, <code>||</code>, jsonpath"]
        ] } },
        { code: `SELECT '{"b":1, "a":2, "a":3}'::json  AS j,
       '{"b":1, "a":2, "a":3}'::jsonb AS jb;
--  j  = {"b":1, "a":2, "a":3}
--  jb = {"a": 3, "b": 1}

CREATE TABLE products (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  text  NOT NULL,
  attrs jsonb NOT NULL DEFAULT '{}'
);
INSERT INTO products (name, attrs)
VALUES ('Laptop', '{"brand": "Dell", "ram_gb": 16, "tags": ["work", "ssd"]}');

SELECT name, attrs->>'brand' AS brand, (attrs->>'ram_gb')::int AS ram
FROM products
WHERE attrs @> '{"brand": "Dell"}';                 -- containment: can use the GIN index

CREATE INDEX idx_products_attrs ON products USING gin (attrs jsonb_path_ops);
CREATE INDEX idx_products_brand ON products ((attrs->>'brand'));   -- B-tree on one key

UPDATE products SET attrs = jsonb_set(attrs, '{ram_gb}', '32') WHERE id = 1;`, lang: "sql", title: "PostgreSQL jsonb in practice" },
        { p: "<code>-&gt;</code> returns jsonb, while <code>-&gt;&gt;</code> returns text, which you then cast. A GIN index with <code>jsonb_path_ops</code> is smaller and faster but supports only containment (<code>@&gt;</code>). The default <code>jsonb_ops</code> also supports the key-exists operators <code>?</code>, <code>?|</code> and <code>?&amp;</code>." },
        { code: `-- MySQL 8: JSON is stored in a binary format and validated on insert
CREATE TABLE products (
  id    BIGINT AUTO_INCREMENT PRIMARY KEY,
  attrs JSON NOT NULL,
  brand VARCHAR(50) GENERATED ALWAYS AS (attrs->>'$.brand') VIRTUAL,
  INDEX idx_brand (brand)                    -- JSON columns cannot be indexed directly
);
SELECT id FROM products WHERE brand = 'Dell';            -- uses idx_brand
SELECT id FROM products WHERE JSON_CONTAINS(attrs->'$.tags', '"ssd"');`, lang: "sql", title: "MySQL: index JSON through a generated column" },
        { warn: "JSONB is not a licence to skip schema design. Columns you filter, join or enforce constraints on (status, user_id, price) belong in real columns with types, foreign keys and NOT NULL. Keep JSONB for genuinely variable attributes, such as product specs or webhook payloads." },
        { tip: "Choose <code>json</code> only when you must keep the exact original text, for example to verify a signed webhook payload byte for byte. Otherwise use <code>jsonb</code>." }
      ]
    },
    {
      id: "text-varchar-timestamps",
      q: "TEXT vs VARCHAR — does it matter? And how should you store timestamps and time zones in PostgreSQL and MySQL?",
      topic: "Engines & Data Types",
      level: 2,
      top: false,
      short: "In PostgreSQL, text and varchar perform the same; varchar(n) only adds a length check. In MySQL they differ: VARCHAR is stored inline and can be fully indexed and have defaults, while TEXT may be stored off-page and needs a prefix length to be indexed. For time, store absolute instants: timestamptz in PostgreSQL, and in MySQL either UTC DATETIME or TIMESTAMP (which converts via the session time zone and ends in 2038).",
      a: [
        { h: "Strings" },
        { table: { head: ["", "PostgreSQL", "MySQL (InnoDB)"], rows: [
          ["<code>VARCHAR(n)</code>", "Same storage as text; n is just a CHECK on length", "Stored inline; n counts characters; row limit 65,535 bytes total"],
          ["<code>TEXT</code>", "Same as varchar with no limit (up to 1 GB). Idiomatic choice", "Large values stored off-page; index needs a prefix, e.g. <code>INDEX (body(100))</code>; literal DEFAULT not allowed"],
          ["<code>CHAR(n)</code>", "Space-padded; rarely useful", "Space-padded; fine for fixed codes like country 'IN'"],
          ["Encoding", "UTF-8 database encoding", "Use <code>utf8mb4</code> (default since 8.0). Old <code>utf8</code> = utf8mb3, which cannot store emoji"]
        ] } },
        { h: "Timestamps" },
        { table: { head: ["Type", "Stores", "Notes"], rows: [
          ["PG <code>timestamptz</code>", "An absolute instant (stored as UTC)", "Input is converted to UTC; output is shown in the session <code>TimeZone</code>. Use this by default"],
          ["PG <code>timestamp</code>", "A wall-clock reading with no zone", "Fine for \"store opens at 09:00\"; wrong for events"],
          ["MySQL <code>TIMESTAMP</code>", "Instant; converted using the session <code>time_zone</code>", "Range ends <b>2038-01-19 03:14:07 UTC</b> (32-bit seconds)"],
          ["MySQL <code>DATETIME</code>", "Wall-clock value, no conversion", "Range 1000–9999. Store UTC and convert in the app"]
        ] } },
        { code: `from datetime import datetime, timezone, timedelta
IST = timezone(timedelta(hours=5, minutes=30), "IST")

# What a timestamptz column stores: one absolute instant (UTC internally)
paid_at = datetime(2026, 10, 3, 18, 45, tzinfo=IST)
stored = paid_at.astimezone(timezone.utc)
print("stored (UTC):", stored.isoformat())
print("shown in IST:", stored.astimezone(IST).isoformat())
print("shown in NY (-4):", stored.astimezone(timezone(timedelta(hours=-4))).isoformat())

# What a timestamp WITHOUT time zone stores: a wall-clock reading, no instant
naive = datetime(2026, 10, 3, 18, 45)
print("naive:", naive.isoformat(), "| tzinfo =", naive.tzinfo)
print("TIMESTAMP max (MySQL):", datetime.fromtimestamp(2**31 - 1, timezone.utc))`, lang: "python", title: "Instant vs wall-clock" },
        { code: `stored (UTC): 2026-10-03T13:15:00+00:00
shown in IST: 2026-10-03T18:45:00+05:30
shown in NY (-4): 2026-10-03T09:15:00-04:00
naive: 2026-10-03T18:45:00 | tzinfo = None
TIMESTAMP max (MySQL): 2038-01-19 03:14:07+00:00`, lang: "text" },
        { code: `-- PostgreSQL
SET TIME ZONE 'Asia/Kolkata';
SELECT '2026-10-03 13:15:00+00'::timestamptz;      -- 2026-10-03 18:45:00+05:30

-- MySQL: TIMESTAMP converts, DATETIME does not
SET time_zone = '+05:30';
CREATE TABLE t (ts TIMESTAMP, dt DATETIME);
INSERT INTO t VALUES ('2026-10-03 18:45:00', '2026-10-03 18:45:00');
SET time_zone = '+00:00';
SELECT ts, dt FROM t;      -- ts = 2026-10-03 13:15:00, dt = 2026-10-03 18:45:00`, lang: "sql" },
        { warn: "Despite the name, PostgreSQL's <code>timestamptz</code> does <b>not</b> store the time zone. It stores a UTC instant. If you need the user's original zone (for example to show \"booked at 6:45 pm their time\"), store it in a separate column such as <code>tz text = 'Asia/Kolkata'</code>." }
      ]
    },

    /* ───────────── MVCC & Locking ───────────── */
    {
      id: "mvcc-pg-vs-innodb",
      q: "How is MVCC implemented in PostgreSQL vs InnoDB? What is VACUUM and why does it matter?",
      topic: "MVCC & Locking",
      level: 3,
      top: true,
      short: "PostgreSQL never updates a row in place. An UPDATE writes a new tuple version into the table and marks the old one dead (xmax), and VACUUM later reclaims the dead tuples. InnoDB updates the row in place in the clustered index and writes the old version to the undo log. Readers rebuild older versions from the undo chain, and a purge thread discards undo records nobody needs. Long-running transactions hurt both: table bloat in PostgreSQL, undo history growth in InnoDB.",
      a: [
        { p: "Both engines use <a href=\"#/core/dbms/mvcc\">MVCC</a>: readers see a consistent snapshot and do not block writers. The difference is <b>where the old versions live</b>." },
        { svg: `<svg viewBox="0 0 700 250" width="700" class="dg">
  <text class="tx tx-b" x="170" y="20" text-anchor="middle">PostgreSQL: versions in the table</text>
  <rect class="box-r" x="30" y="40" width="280" height="44" rx="6"/>
  <text class="tx" x="170" y="57" text-anchor="middle">v1  balance=500</text>
  <text class="tx-s" x="170" y="74" text-anchor="middle">xmin=100  xmax=205  (dead after 205 commits)</text>
  <line class="ln" x1="170" y1="84" x2="170" y2="114" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="30" y="116" width="280" height="44" rx="6"/>
  <text class="tx" x="170" y="133" text-anchor="middle">v2  balance=400</text>
  <text class="tx-s" x="170" y="150" text-anchor="middle">xmin=205  xmax=0  (live)</text>
  <rect class="box-w" x="30" y="186" width="280" height="40" rx="6"/>
  <text class="tx" x="170" y="206" text-anchor="middle" dominant-baseline="middle">VACUUM marks v1's space reusable</text>
  <text class="tx tx-b" x="530" y="20" text-anchor="middle">InnoDB: versions in the undo log</text>
  <rect class="box-g" x="390" y="40" width="280" height="44" rx="6"/>
  <text class="tx" x="530" y="57" text-anchor="middle">row in clustered index  balance=400</text>
  <text class="tx-s" x="530" y="74" text-anchor="middle">DB_TRX_ID=205  DB_ROLL_PTR</text>
  <line class="ln ln-a" x1="530" y1="84" x2="530" y2="114" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="540" y="104">roll pointer</text>
  <rect class="box-p" x="390" y="116" width="280" height="44" rx="6"/>
  <text class="tx" x="530" y="133" text-anchor="middle">undo record  balance=500</text>
  <text class="tx-s" x="530" y="150" text-anchor="middle">trx_id=100 (older snapshots read this)</text>
  <rect class="box-w" x="390" y="186" width="280" height="40" rx="6"/>
  <text class="tx" x="530" y="206" text-anchor="middle" dominant-baseline="middle">purge thread drops unneeded undo</text>
</svg>`, caption: "Same UPDATE balance 500 → 400 by transaction 205, stored two different ways" },
        { table: { head: ["", "PostgreSQL", "InnoDB"], rows: [
          ["UPDATE does", "Inserts a new tuple and sets xmax on the old one", "Changes the row in place and copies the old values to undo"],
          ["Old versions live in", "The table (heap) pages", "Undo tablespace (rollback segments)"],
          ["Visibility check", "Compare the tuple's xmin/xmax with the snapshot", "Compare DB_TRX_ID with the read view; walk the undo chain if needed"],
          ["Cleanup", "VACUUM / autovacuum", "Purge threads"],
          ["Indexes on UPDATE", "New index entries for the new tuple, unless it is a <b>HOT</b> update (no indexed column changed and there is room in the same page)", "Secondary index entries are delete-marked and re-inserted only if an indexed column changed"],
          ["Rollback cost", "Cheap: the new tuple simply never becomes visible", "Must apply undo records, so a huge rollback is slow"],
          ["Pain point", "Table and index <b>bloat</b>; transaction ID wraparound", "Growing <b>history list length</b>; slow reads that walk long undo chains"]
        ] } },
        { h: "What VACUUM does" },
        { ul: [
          "Marks space used by dead tuples as reusable (it does not shrink the file). <code>VACUUM FULL</code> rewrites the table compactly but takes an <code>ACCESS EXCLUSIVE</code> lock, so avoid it on live tables (use <code>pg_repack</code> instead).",
          "Updates the <b>visibility map</b>, which is what makes <i>index-only scans</i> possible.",
          "<b>Freezes</b> old tuples so the 32-bit transaction ID counter can wrap around safely. If freezing falls too far behind, PostgreSQL eventually stops accepting writes to protect your data.",
          "<b>Autovacuum</b> runs all of this automatically, triggered by the number of dead tuples. On hot tables, tune it per table (for example <code>autovacuum_vacuum_scale_factor</code>) instead of turning it off."
        ] },
        { code: `-- Which tables have the most dead tuples, and when were they last vacuumed?
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 5;

-- Find long-running / idle-in-transaction sessions that block cleanup
SELECT pid, state, now() - xact_start AS xact_age, left(query, 60)
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_age DESC;`, lang: "sql", title: "PostgreSQL: spotting bloat" },
        { warn: "A session left <b>idle in transaction</b> (for example an app that opened a transaction and then waited on an HTTP call) holds back the oldest snapshot. VACUUM cannot remove any tuple that is newer than that snapshot, so every busy table bloats. In MySQL the same mistake makes the undo history grow. Set <code>idle_in_transaction_session_timeout</code> in PostgreSQL." },
        { tip: "One-line summary for interviews: \"Postgres keeps old versions in the table and needs VACUUM; InnoDB keeps them in undo logs and needs purge. Either way, long transactions are the enemy.\"" }
      ]
    },
    {
      id: "default-isolation-levels",
      q: "PostgreSQL defaults to Read Committed and MySQL to Repeatable Read. What does that mean in practice?",
      topic: "MVCC & Locking",
      level: 2,
      top: true,
      short: "In PostgreSQL Read Committed, each statement takes a fresh snapshot, so two SELECTs in one transaction can see different data. In MySQL Repeatable Read, plain SELECTs reuse the snapshot from the first read, but locking reads and UPDATEs read the latest committed row and take next-key (gap) locks. PostgreSQL Repeatable Read is true snapshot isolation and aborts a conflicting update with a serialization error that you must retry; MySQL silently applies it.",
      a: [
        { p: "The <a href=\"#/core/dbms/isolation-levels\">four ANSI isolation levels</a> are defined by which anomalies they prevent. Each engine implements them differently, and the differences matter when you write read-modify-write code." },
        { table: { head: ["Level", "PostgreSQL", "MySQL InnoDB"], rows: [
          ["Read Uncommitted", "Behaves like Read Committed (no dirty reads ever)", "Dirty reads possible"],
          ["Read Committed", "<b>Default.</b> New snapshot per statement", "New snapshot per statement; no gap locks"],
          ["Repeatable Read", "Snapshot for the whole transaction. A concurrent update of the same row raises <code>could not serialize access</code> (SQLSTATE 40001)", "<b>Default.</b> Plain SELECTs use the snapshot from the first read; locking reads/UPDATE/DELETE see the latest data and take next-key locks"],
          ["Serializable", "SSI (Serializable Snapshot Isolation): detects dangerous patterns and aborts one transaction with 40001", "Plain SELECTs become <code>FOR SHARE</code> (when autocommit is off): more locking"]
        ] } },
        { h: "The same code, two engines" },
        { code: `-- Two sessions both run this: "read the balance, compute in the app, write it back"
BEGIN;
SELECT balance FROM accounts WHERE id = 1;      -- both read 500
-- app computes 500 - 100 = 400
UPDATE accounts SET balance = 400 WHERE id = 1;
COMMIT;
-- Result: 400, but two withdrawals happened -> LOST UPDATE
-- PG Read Committed: lost update (no error)
-- MySQL Repeatable Read: lost update (no error)
-- PG Repeatable Read: the second UPDATE fails with
--   ERROR: could not serialize access due to concurrent update  -> retry the transaction

-- Fix 1: let the database do the arithmetic (safe in every engine/level)
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;

-- Fix 2: pessimistic lock when the logic must live in the app
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;   -- second session waits here
UPDATE accounts SET balance = 400 WHERE id = 1;
COMMIT;`, lang: "sql", title: "Lost update and how to avoid it" },
        { p: "Why is <code>balance = balance - 100</code> safe even in Read Committed? An UPDATE waits for the row lock, then works on the <b>latest committed version</b> of the row (PostgreSQL re-checks the WHERE clause against it). The arithmetic is never based on a stale read." },
        { h: "MySQL Repeatable Read quirks" },
        { ul: [
          "Within one transaction, <code>SELECT</code> can show 500 (snapshot) while <code>UPDATE … SET balance = balance - 100</code> works on 400 (latest), and a later SELECT shows 300. Snapshot reads and current reads mix.",
          "<b>Next-key locks</b> (record + gap) on range scans block inserts into the gaps. That prevents phantoms for locking reads, but it causes more lock waits and deadlocks. Many high-traffic MySQL shops switch to <code>READ COMMITTED</code> with <code>binlog_format=ROW</code>."
        ] },
        { warn: "In PostgreSQL Repeatable Read and Serializable, serialization failures are <b>expected</b>, not bugs. Your code must catch SQLSTATE <code>40001</code> and retry the whole transaction. Raising the isolation level without adding a retry loop just turns silent anomalies into 500 errors." },
        { tip: "Follow-up: \"How would you prevent double-booking a seat?\" Good answers: a UNIQUE constraint on (show_id, seat_no) (best), <code>SELECT … FOR UPDATE</code>, or Serializable with retries. Link it to <a href=\"#/core/dbms/optimistic-vs-pessimistic\">optimistic vs pessimistic locking</a>." }
      ]
    },
    {
      id: "select-for-update-deadlocks",
      q: "How do you use SELECT … FOR UPDATE, SKIP LOCKED and advisory locks? How do deadlocks happen and how do you handle them?",
      topic: "MVCC & Locking",
      level: 2,
      top: true,
      short: "SELECT … FOR UPDATE locks the selected rows until commit, so other writers and locking readers wait. NOWAIT fails immediately instead of waiting, and SKIP LOCKED skips locked rows, which is ideal for job queues. Deadlocks happen when two transactions lock the same rows in opposite order. Both engines detect them and abort one transaction, so always lock in a consistent order, keep transactions short, and retry on deadlock errors. Advisory locks are application-defined named locks.",
      a: [
        { p: "Row locks are taken automatically by UPDATE and DELETE. <code>SELECT … FOR UPDATE</code> lets you take them <b>while reading</b>, so you can check something and then change it safely in the same transaction (pessimistic locking). Plain SELECTs are never blocked, thanks to MVCC." },
        { table: { head: ["Clause", "Effect", "Engines"], rows: [
          ["<code>FOR UPDATE</code>", "Exclusive row lock until COMMIT/ROLLBACK", "PG, MySQL"],
          ["<code>FOR SHARE</code>", "Shared lock: others can read-lock but cannot update", "PG, MySQL 8 (older: <code>LOCK IN SHARE MODE</code>)"],
          ["<code>FOR NO KEY UPDATE</code> / <code>FOR KEY SHARE</code>", "Weaker locks that do not conflict with foreign-key checks", "PG only"],
          ["<code>NOWAIT</code>", "Raise an error at once if a row is locked", "PG, MySQL 8"],
          ["<code>SKIP LOCKED</code>", "Silently skip locked rows", "PG 9.5+, MySQL 8"]
        ] } },
        { code: `-- Many workers pull jobs from one table without blocking each other
BEGIN;
SELECT id, payload
FROM jobs
WHERE status = 'queued'
ORDER BY id
LIMIT 10
FOR UPDATE SKIP LOCKED;          -- each worker gets a different batch
-- ... process the batch ...
UPDATE jobs SET status = 'done' WHERE id IN (101, 102, 103);
COMMIT;

-- Advisory lock: "only one instance runs the nightly report"
SELECT pg_try_advisory_lock(hashtext('nightly-report'));    -- PostgreSQL: true / false
SELECT pg_advisory_unlock(hashtext('nightly-report'));
-- pg_advisory_xact_lock(key) releases automatically at transaction end
SELECT GET_LOCK('nightly-report', 0);                        -- MySQL: 1 = got it, 0 = busy
SELECT RELEASE_LOCK('nightly-report');`, lang: "sql", title: "Job queue with SKIP LOCKED, and advisory locks" },
        { h: "Deadlocks" },
        { p: "T1 locks account 1 and then wants account 2. T2 locks account 2 and then wants account 1. Neither can proceed (see <a href=\"#/core/dbms/deadlock-dbms\">deadlock theory</a>). PostgreSQL checks for cycles after <code>deadlock_timeout</code> (default 1 s) and aborts one transaction with SQLSTATE <code>40P01</code>. InnoDB detects the cycle immediately, rolls back the transaction with less work, and returns error 1213 (SQLSTATE <code>40001</code>). Run <code>SHOW ENGINE INNODB STATUS</code> to see the latest deadlock." },
        { code: `import java.sql.*;

public class TransferService {
    private final Connection con;
    public TransferService(Connection con) { this.con = con; }

    public void transfer(long from, long to, long amount) throws SQLException {
        for (int attempt = 1; ; attempt++) {
            try {
                con.setAutoCommit(false);
                // Lock both rows in a FIXED order (lower id first) -> no lock-order deadlock
                try (PreparedStatement lock = con.prepareStatement(
                        "SELECT id, balance FROM accounts WHERE id IN (?, ?) ORDER BY id FOR UPDATE")) {
                    lock.setLong(1, Math.min(from, to));
                    lock.setLong(2, Math.max(from, to));
                    lock.executeQuery().close();
                }
                try (PreparedStatement debit = con.prepareStatement(
                         "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?");
                     PreparedStatement credit = con.prepareStatement(
                         "UPDATE accounts SET balance = balance + ? WHERE id = ?")) {
                    debit.setLong(1, amount); debit.setLong(2, from); debit.setLong(3, amount);
                    if (debit.executeUpdate() == 0) throw new SQLException("insufficient funds");
                    credit.setLong(1, amount); credit.setLong(2, to);
                    credit.executeUpdate();
                }
                con.commit();
                return;
            } catch (SQLException e) {
                con.rollback();
                String state = e.getSQLState();
                boolean retryable = "40001".equals(state) || "40P01".equals(state);
                if (!retryable || attempt == 3) throw e;      // deadlock / serialization: retry
            }
        }
    }
}`, lang: "java", title: "JDBC: consistent lock order + retry on deadlock" },
        { ul: [
          "Lock rows in a <b>consistent order</b> (by primary key) across all code paths.",
          "Keep transactions <b>short</b>: no network calls or user input while holding locks.",
          "Index the columns in your WHERE clause. An UPDATE without a usable index scans, and in InnoDB it locks far more rows than needed.",
          "Treat deadlocks as normal at scale: log them and <b>retry</b> the whole transaction."
        ] },
        { warn: "<code>FOR UPDATE</code> outside an explicit transaction is useless. In autocommit mode the lock is released as soon as the SELECT finishes." }
      ]
    },

    /* ───────────── Indexes & Query Plans ───────────── */
    {
      id: "pg-index-types",
      q: "What index types does PostgreSQL offer (B-tree, Hash, GIN, GiST, BRIN), and when do you use each?",
      topic: "Indexes & Query Plans",
      level: 2,
      top: true,
      short: "B-tree is the default and handles equality, ranges, sorting and prefix LIKE. Hash handles equality only. GIN is an inverted index for values containing many items: jsonb, arrays, full-text search, trigrams. GiST handles overlap and nearest-neighbour queries for geometry, ranges and exclusion constraints. BRIN stores min/max per block range and is tiny, which suits huge append-only tables ordered by time. PostgreSQL also supports partial, expression and covering (INCLUDE) indexes.",
      a: [
        { p: "MySQL InnoDB essentially gives you B+ trees (plus FULLTEXT and SPATIAL). PostgreSQL has pluggable <b>index access methods</b>, so picking the right one is a common practical question. For basics, see <a href=\"#/core/dbms/what-is-index\">what an index is</a> and <a href=\"#/core/dbms/btree-vs-bplus-tree\">B-tree vs B+ tree</a>." },
        { table: { head: ["Type", "Good for", "Operators", "Example"], rows: [
          ["<b>B-tree</b> (default)", "Most columns: ids, emails, dates", "<code>= &lt; &gt; BETWEEN IN</code>, <code>ORDER BY</code>, <code>LIKE 'abc%'</code>", "<code>CREATE INDEX ON orders (customer_id, created_at)</code>"],
          ["<b>Hash</b>", "Equality on long values", "<code>=</code> only", "<code>USING hash (url)</code>. Crash-safe only since PG 10; rarely beats B-tree"],
          ["<b>GIN</b>", "Values containing many keys", "jsonb <code>@&gt;</code> <code>?</code>, arrays <code>&amp;&amp;</code> <code>@&gt;</code>, full-text <code>@@</code>, pg_trgm <code>LIKE '%x%'</code>", "<code>USING gin (tags)</code>"],
          ["<b>GiST</b>", "Geometric/range data, \"overlaps\", nearest neighbour", "<code>&amp;&amp;</code> on ranges, PostGIS, <code>&lt;-&gt;</code> distance", "<code>USING gist (during)</code> for bookings"],
          ["<b>SP-GiST</b>", "Non-balanced partitioning (quadtrees, tries)", "Points, IP ranges, text prefixes", "<code>USING spgist (ip inet_ops)</code>"],
          ["<b>BRIN</b>", "Huge tables physically ordered by the column", "Ranges on naturally ordered data", "<code>USING brin (created_at)</code> on an append-only events log"]
        ] } },
        { code: `-- Partial index: index only the rows you query (small and fast)
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- Expression index: case-insensitive lookup
CREATE UNIQUE INDEX idx_users_email_lower ON users (lower(email));
SELECT * FROM users WHERE lower(email) = lower('Asha@X.com');   -- must use the same expression

-- Covering index (PG 11+): extra columns stored in the leaf for index-only scans
CREATE INDEX idx_orders_cust ON orders (customer_id) INCLUDE (total, status);

-- GIN for jsonb and arrays
CREATE INDEX idx_products_attrs ON products USING gin (attrs);
CREATE INDEX idx_posts_tags     ON posts    USING gin (tags);       -- WHERE tags @> ARRAY['sql']

-- BRIN: orders of magnitude smaller than a B-tree on a time-ordered log table
CREATE INDEX idx_events_time ON events USING brin (created_at);

-- GiST exclusion constraint: no two bookings of a room may overlap
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE bookings ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (room_id WITH =, during WITH &&);

-- Build without blocking writes on a live table
CREATE INDEX CONCURRENTLY idx_orders_status ON orders (status);`, lang: "sql", title: "PostgreSQL index recipes" },
        { ul: [
          "For multicolumn B-trees, the <b>leftmost-prefix rule</b> applies: <code>(customer_id, created_at)</code> serves <code>WHERE customer_id = ?</code> but not <code>WHERE created_at &gt; ?</code> alone. See <a href=\"#/core/dbms/composite-index\">composite indexes</a>.",
          "GIN indexes are slower to update than B-trees (PostgreSQL batches the work using a pending list). That is fine for read-heavy data, but think twice on write-heavy tables.",
          "BRIN only helps when the physical row order correlates with the column, for example an insert-only table with <code>created_at</code>. On randomly ordered data it is useless."
        ] },
        { warn: "Every index slows down INSERT/UPDATE and uses disk and RAM. Find unused indexes with <code>SELECT indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0;</code> and drop them. See <a href=\"#/core/dbms/when-indexes-hurt\">when indexes hurt</a>." },
        { tip: "A strong answer pairs each index type with a real use case: \"GIN on a jsonb attributes column, BRIN on a 2-billion-row events table, a GiST exclusion constraint to prevent overlapping hotel bookings.\"" }
      ]
    },
    {
      id: "innodb-clustered-index",
      q: "How does InnoDB's clustered primary key work, and what happens on a secondary index lookup?",
      topic: "Indexes & Query Plans",
      level: 2,
      top: true,
      short: "In InnoDB the table is the primary key's B+ tree: leaf pages hold the full rows in PK order. A secondary index stores the indexed columns plus the primary key value, so a lookup by a secondary index traverses that index to find the PK, then traverses the clustered index to fetch the row. That second lookup is skipped when the index covers the query. Consequences: keep PKs short and increasing, and know that PostgreSQL works differently (heap plus tuple pointers).",
      a: [
        { p: "InnoDB <b>always</b> clusters the table on a key. It uses the PRIMARY KEY; if there is none, the first <code>UNIQUE NOT NULL</code> index; otherwise a hidden 6-byte row ID. Rows are physically stored in the leaves of that B+ tree. Theory: <a href=\"#/core/dbms/clustered-vs-nonclustered\">clustered vs non-clustered indexes</a>." },
        { svg: `<svg viewBox="0 0 700 220" width="700" class="dg">
  <text class="tx tx-b" x="150" y="20" text-anchor="middle">Secondary index on email</text>
  <rect class="box-a" x="40" y="34" width="220" height="34" rx="6"/>
  <text class="tx" x="150" y="51" text-anchor="middle" dominant-baseline="middle">B+ tree internal nodes</text>
  <line class="ln" x1="150" y1="68" x2="150" y2="94" marker-end="url(#dg-arr)"/>
  <rect class="box" x="40" y="96" width="220" height="56" rx="6"/>
  <text class="tx" x="150" y="114" text-anchor="middle">leaf: (asha@x.com → id 7)</text>
  <text class="tx" x="150" y="136" text-anchor="middle">leaf: (ravi@x.com → id 3)</text>
  <line class="ln ln-a" x1="260" y1="114" x2="430" y2="114" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="345" y="104" text-anchor="middle">2nd lookup by PK = 7</text>
  <text class="tx tx-b" x="550" y="20" text-anchor="middle">Clustered index (the table)</text>
  <rect class="box-a" x="440" y="34" width="220" height="34" rx="6"/>
  <text class="tx" x="550" y="51" text-anchor="middle" dominant-baseline="middle">B+ tree internal nodes (by id)</text>
  <line class="ln" x1="550" y1="68" x2="550" y2="94" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="440" y="96" width="220" height="56" rx="6"/>
  <text class="tx" x="550" y="114" text-anchor="middle">leaf: id 7 | asha@x.com | Asha | …</text>
  <text class="tx-s" x="550" y="136" text-anchor="middle">full rows, stored in id order</text>
  <text class="tx-m" x="350" y="190" text-anchor="middle">WHERE email = 'asha@x.com' → walk the secondary tree, get id 7, walk the clustered tree</text>
</svg>`, caption: "A non-covering secondary index lookup in InnoDB costs two B+ tree traversals" },
        { h: "Consequences you should mention" },
        { ul: [
          "<b>PK lookups and PK range scans are very fast</b>: the row is right in the leaf, and neighbouring ids are on the same page.",
          "<b>Every secondary index contains the PK.</b> A 16-byte UUID or a long composite PK makes every index bigger.",
          "<b>Random PKs (UUIDv4) cause page splits</b>: each insert lands in a random leaf page. Increasing keys (AUTO_INCREMENT, UUIDv7) always append at the right edge.",
          "<b>Covering indexes</b> skip the second lookup: if the index has every column the query needs (the PK is included for free), EXPLAIN shows <code>Using index</code>.",
          "Updating a PK value physically moves the row and rewrites every secondary index entry. Keep PKs immutable."
        ] },
        { code: `CREATE TABLE users (
  id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  email   VARCHAR(255) NOT NULL,
  name    VARCHAR(100),
  city    VARCHAR(50),
  INDEX idx_email (email)
);

EXPLAIN SELECT id, email FROM users WHERE email = 'asha@x.com';
-- type: ref, key: idx_email, Extra: Using index      <- covered: id is inside idx_email

EXPLAIN SELECT * FROM users WHERE email = 'asha@x.com';
-- type: ref, key: idx_email, Extra: NULL             <- needs the clustered-index lookup for name, city`, lang: "sql", title: "Covering vs non-covering in MySQL" },
        { table: { head: ["", "InnoDB", "PostgreSQL"], rows: [
          ["Table layout", "Clustered on PK (always)", "Heap in insertion/free-space order"],
          ["Secondary index leaf stores", "Indexed columns + PK value", "Indexed columns + tuple pointer (ctid)"],
          ["Lookup by secondary index", "Index → PK → clustered tree", "Index → heap page directly"],
          ["Covering scan", "Index has all needed columns", "<i>Index-only scan</i>; also needs the visibility map to be current (VACUUM)"],
          ["Clustering control", "Automatic, by PK", "<code>CLUSTER</code> reorders once; not maintained afterwards"]
        ] } },
        { tip: "Interviewers like the follow-up \"So why not use a UUID as the primary key in MySQL?\" Answer: larger secondary indexes and random insert positions. Use an auto-increment or UUIDv7 PK, and add a public UUID column if needed." }
      ]
    },
    {
      id: "explain-analyze",
      q: "How do you read EXPLAIN and EXPLAIN ANALYZE output to fix a slow query?",
      topic: "Indexes & Query Plans",
      level: 2,
      top: true,
      short: "EXPLAIN shows the planner's chosen plan with estimated costs and row counts. EXPLAIN ANALYZE actually runs the query and adds real times and row counts. Read the tree from the innermost node outward. Look for sequential scans on big tables, large gaps between estimated and actual rows (stale statistics), many rows removed by filters, expensive sorts, and nested loops over many rows. Then add the right index, rewrite the query, or run ANALYZE.",
      a: [
        { p: "The planner turns SQL into a tree of operators (scan, join, sort, aggregate). Each node feeds rows to its parent. <code>EXPLAIN</code> prints the tree. <code>EXPLAIN (ANALYZE, BUFFERS)</code> in PostgreSQL also <b>runs</b> the query and reports actual time, rows and pages read. See also <a href=\"#/core/dbms/query-optimization-explain\">query optimization basics</a>." },
        { code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 5;

-- BEFORE: no useful index
Limit  (cost=1986.30..1986.31 rows=5 width=36) (actual time=18.91..18.91 rows=5 loops=1)
  Buffers: shared hit=736
  ->  Sort  (cost=1986.30..1986.35 rows=20 width=36) (actual time=18.91..18.91 rows=5 loops=1)
        Sort Key: created_at DESC
        Sort Method: top-N heapsort  Memory: 25kB
        ->  Seq Scan on orders  (cost=0.00..1986.00 rows=20 width=36) (actual time=0.04..18.87 rows=19 loops=1)
              Filter: (customer_id = 42)
              Rows Removed by Filter: 99981
Planning Time: 0.110 ms
Execution Time: 18.940 ms

-- AFTER: CREATE INDEX idx_orders_cust_created ON orders (customer_id, created_at);
Limit  (cost=0.42..20.31 rows=5 width=36) (actual time=0.03..0.04 rows=5 loops=1)
  Buffers: shared hit=8
  ->  Index Scan Backward using idx_orders_cust_created on orders  (cost=0.42..80.00 rows=20 width=36) (actual time=0.03..0.04 rows=5 loops=1)
        Index Cond: (customer_id = 42)
Planning Time: 0.150 ms
Execution Time: 0.062 ms`, lang: "text", title: "PostgreSQL plan, before and after (illustrative)" },
        { ul: [
          "<b>cost=a..b</b>: planner units (not ms). a = cost before the first row is returned, b = total cost. <b>rows</b> = estimated row count.",
          "<b>actual time / rows / loops</b>: real numbers. Multiply per-loop figures by <code>loops</code> for nested-loop inner sides.",
          "<b>Rows Removed by Filter: 99981</b> means 99,981 rows were read for nothing. That is a strong sign an index is missing.",
          "<b>Estimate far from actual</b> (e.g. rows=20 vs actual 50,000) means stale or insufficient statistics. Run <code>ANALYZE orders;</code> or raise the statistics target for that column.",
          "The fixed plan scans the index <b>backward</b>, so it gets rows already sorted by <code>created_at DESC</code>. The Sort node disappears."
        ] },
        { table: { head: ["Node / value", "Meaning", "Usually fine when…"], rows: [
          ["Seq Scan", "Read the whole table", "The table is small, or most rows are needed"],
          ["Index Scan / Index Only Scan", "Walk the index (then the heap) / index alone", "Selective predicates"],
          ["Bitmap Index + Bitmap Heap Scan", "Collect matching pages, then read them in order", "Medium selectivity, or OR of several indexes"],
          ["Nested Loop", "For each outer row, probe the inner side", "Outer side is small and inner side is indexed"],
          ["Hash Join", "Build a hash table on the smaller side", "Large unsorted inputs joined on equality"],
          ["Merge Join", "Merge two sorted inputs", "Both sides already sorted (e.g. by an index)"],
          ["MySQL <code>type</code> column", "<code>const</code> &gt; <code>eq_ref</code> &gt; <code>ref</code> &gt; <code>range</code> &gt; <code>index</code> &gt; <code>ALL</code>", "Avoid ALL (full scan) on large tables; watch for <code>Using filesort</code> and <code>Using temporary</code> in Extra"]
        ] } },
        { code: `import sqlite3, random
random.seed(7)
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INT, status TEXT, created_at TEXT)")
con.executemany("INSERT INTO orders (customer_id, status, created_at) VALUES (?, ?, ?)",
                [(random.randint(1, 5000), random.choice(["NEW", "PAID", "SHIPPED"]),
                  f"2026-{random.randint(1, 9):02d}-{random.randint(1, 28):02d}") for _ in range(100_000)])
q = "SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 5"
plan = lambda: [r[-1] for r in con.execute("EXPLAIN QUERY PLAN " + q)]
print("before:", plan())
con.execute("CREATE INDEX idx_orders_cust_created ON orders(customer_id, created_at)")
con.execute("ANALYZE")
print("after: ", plan())
# before: ['SCAN orders', 'USE TEMP B-TREE FOR ORDER BY']
# after:  ['SEARCH orders USING INDEX idx_orders_cust_created (customer_id=?)']`, lang: "python", title: "Same idea, runnable with SQLite's EXPLAIN QUERY PLAN" },
        { warn: "<code>EXPLAIN ANALYZE</code> really executes the statement. On an UPDATE or DELETE, wrap it: <code>BEGIN; EXPLAIN ANALYZE DELETE …; ROLLBACK;</code>. MySQL 8.0.18+ also has <code>EXPLAIN ANALYZE</code> (tree format) and it executes the query too." },
        { tip: "Describe your process, not just the syntax: find the slow query (pg_stat_statements or the slow query log), EXPLAIN ANALYZE it, find the most expensive node, fix it (index, rewrite, statistics), then measure again." }
      ]
    },

    /* ───────────── SQL Features ───────────── */
    {
      id: "upsert-on-conflict",
      q: "How do you write an UPSERT in PostgreSQL vs MySQL, and what are the gotchas?",
      topic: "SQL Features",
      level: 1,
      top: true,
      short: "PostgreSQL uses INSERT … ON CONFLICT (column) DO UPDATE SET col = EXCLUDED.col, or DO NOTHING, and the conflict target must match a unique index or constraint. MySQL uses INSERT … ON DUPLICATE KEY UPDATE, which fires on any unique key conflict; since 8.0.20 you reference the new row through an alias instead of the deprecated VALUES(). Both are atomic, unlike SELECT-then-INSERT, which races. Avoid REPLACE INTO, because it deletes and re-inserts the row.",
      a: [
        { p: "\"Insert the row, or update it if it already exists\" must be <b>one atomic statement</b>. Doing SELECT first and then INSERT or UPDATE has a race: two requests can both see \"not found\" and both insert. The query-drill version is in <a href=\"#/core/sql/upsert-insert-or-update\">SQL drills: upsert</a>." },
        { code: `-- PostgreSQL 9.5+
INSERT INTO users (email, name) VALUES ('asha@x.com', 'Asha S')
ON CONFLICT (email) DO UPDATE
   SET name   = EXCLUDED.name,          -- EXCLUDED = the row you tried to insert
       logins = users.logins + 1
RETURNING id, (xmax = 0) AS inserted;    -- common trick: xmax = 0 means a fresh insert

INSERT INTO page_views (page, day, views) VALUES ('/home', CURRENT_DATE, 1)
ON CONFLICT (page, day) DO UPDATE SET views = page_views.views + 1;

INSERT INTO tags (name) VALUES ('sql') ON CONFLICT DO NOTHING;

-- MySQL 8.0.19+ (row alias; VALUES(col) is deprecated since 8.0.20)
INSERT INTO users (email, name) VALUES ('asha@x.com', 'Asha S') AS new
ON DUPLICATE KEY UPDATE name = new.name, logins = logins + 1;
-- affected rows: 1 = inserted, 2 = updated, 0 = existing row unchanged

INSERT IGNORE INTO tags (name) VALUES ('sql');     -- MySQL "do nothing" (also hides other errors!)`, lang: "sql", title: "UPSERT syntax" },
        { p: "SQLite borrowed PostgreSQL's syntax (including <code>excluded</code> and <code>RETURNING</code>), so we can run it:" },
        { code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE users (email TEXT PRIMARY KEY, name TEXT, logins INTEGER NOT NULL DEFAULT 1)")
UPSERT = """
INSERT INTO users (email, name) VALUES (?, ?)
ON CONFLICT (email) DO UPDATE
   SET name   = excluded.name,          -- the row we tried to insert
       logins = users.logins + 1        -- the row already in the table
RETURNING email, name, logins
"""
for email, name in [("asha@x.com", "Asha"), ("ravi@x.com", "Ravi"), ("asha@x.com", "Asha S")]:
    print(con.execute(UPSERT, (email, name)).fetchone())

con.execute("INSERT INTO users (email, name) VALUES ('ravi@x.com', 'IGNORED') ON CONFLICT DO NOTHING")
print(con.execute("SELECT * FROM users ORDER BY email").fetchall())
# ('asha@x.com', 'Asha', 1)
# ('ravi@x.com', 'Ravi', 1)
# ('asha@x.com', 'Asha S', 2)
# [('asha@x.com', 'Asha S', 2), ('ravi@x.com', 'Ravi', 1)]`, lang: "python", title: "Runnable ON CONFLICT demo" },
        { table: { head: ["", "PostgreSQL ON CONFLICT", "MySQL ON DUPLICATE KEY"], rows: [
          ["Which conflict?", "The target you name (must have a unique index/constraint)", "<b>Any</b> PRIMARY or UNIQUE key; unpredictable with several unique keys"],
          ["Do nothing", "<code>DO NOTHING</code>", "<code>INSERT IGNORE</code> (also turns other errors into warnings)"],
          ["Conditional update", "<code>DO UPDATE … WHERE</code>", "Use <code>IF()</code> inside the SET"],
          ["Get the id back", "<code>RETURNING</code>", "<code>LAST_INSERT_ID()</code>; use the <code>id = LAST_INSERT_ID(id)</code> trick on update"]
        ] } },
        { warn: "<code>REPLACE INTO</code> (MySQL) is not an upsert. It <b>deletes</b> the old row and inserts a new one: you get a new auto-increment id, <code>ON DELETE CASCADE</code> children are deleted, and columns you did not supply are reset to their defaults." },
        { tip: "Mention that both engines use up a sequence or auto-increment value even when the row is updated. That is why upsert-heavy tables show big gaps in their ids." }
      ]
    },
    {
      id: "cte-recursive-queries",
      q: "What are CTEs and recursive CTEs, and are there engine-specific behaviours to know?",
      topic: "SQL Features",
      level: 2,
      top: true,
      short: "A CTE (WITH name AS (…)) is a named subquery that makes complex SQL readable and reusable within one statement. A recursive CTE has an anchor part UNION ALL a recursive part that references the CTE itself, which lets you walk trees and graphs such as org charts or category hierarchies. Since PostgreSQL 12, non-recursive CTEs are inlined unless you write MATERIALIZED. MySQL supports CTEs from 8.0, with a default recursion limit of 1000.",
      a: [
        { p: "A <b>common table expression</b> is a temporary, named result set that exists only for one statement. Use it to break a long query into readable steps, or to reference the same subquery twice. With <code>RECURSIVE</code> it can reference itself, which plain SQL otherwise cannot do." },
        { code: `import sqlite3
con = sqlite3.connect(":memory:")
con.executescript("""
CREATE TABLE category (id INTEGER PRIMARY KEY, name TEXT, parent_id INTEGER REFERENCES category(id));
INSERT INTO category VALUES
  (1, 'Electronics', NULL), (2, 'Computers', 1), (3, 'Laptops', 2),
  (4, 'Gaming Laptops', 3), (5, 'Phones', 1), (6, 'Books', NULL);
""")
# Breadcrumb for every category under 'Electronics'
rows = con.execute("""
WITH RECURSIVE tree(id, name, depth, path) AS (
    SELECT id, name, 0, name                    -- anchor: the root
    FROM category WHERE parent_id IS NULL AND name = 'Electronics'
  UNION ALL
    SELECT c.id, c.name, t.depth + 1, t.path || ' > ' || c.name
    FROM category c JOIN tree t ON c.parent_id = t.id   -- recursive step
)
SELECT depth, path FROM tree ORDER BY path
""").fetchall()
for depth, path in rows:
    print(depth, path)
# 0 Electronics
# 1 Electronics > Computers
# 2 Electronics > Computers > Laptops
# 3 Electronics > Computers > Laptops > Gaming Laptops
# 1 Electronics > Phones`, lang: "python", title: "Category tree with a recursive CTE (portable SQL, run on SQLite)" },
        { p: "How it runs: the anchor produces the first rows (the root). The recursive part joins the rows produced in the <i>previous</i> step to find their children. This repeats until a step produces no rows. Then all steps are combined with UNION ALL." },
        { h: "Engine-specific behaviour" },
        { table: { head: ["Feature", "PostgreSQL", "MySQL 8"], rows: [
          ["CTE support", "Since 8.4; recursive too", "Since 8.0"],
          ["Optimization fence", "Before PG 12 every CTE was materialized (a fence). PG 12+ inlines it if it is non-recursive, side-effect free and referenced once. Force with <code>AS MATERIALIZED</code> / <code>NOT MATERIALIZED</code>", "Optimizer may merge or materialize it"],
          ["Cycle protection", "PG 14+: <code>CYCLE id SET is_cycle USING path</code>; or track a path array", "<code>cte_max_recursion_depth</code> (default 1000) raises an error"],
          ["Data-modifying CTEs", "<code>WITH moved AS (DELETE … RETURNING *) INSERT INTO archive SELECT * FROM moved</code>", "Not supported"],
          ["String concat in examples", "<code>||</code>", "<code>CONCAT()</code> (<code>||</code> means OR by default)"]
        ] } },
        { code: `-- PostgreSQL: move old orders to an archive table atomically, in one statement
WITH moved AS (
  DELETE FROM orders
  WHERE created_at < now() - interval '2 years'
  RETURNING *
)
INSERT INTO orders_archive SELECT * FROM moved;

-- Generate a calendar to fill gaps in a daily report
SELECT d::date AS day FROM generate_series('2026-10-01'::date, '2026-10-07'::date, interval '1 day') AS d;   -- PG
-- MySQL: WITH RECURSIVE days(d) AS (SELECT DATE('2026-10-01') UNION ALL
--          SELECT d + INTERVAL 1 DAY FROM days WHERE d < '2026-10-07') SELECT d FROM days;`, lang: "sql", title: "Beyond trees" },
        { warn: "Bad data with a cycle (A's parent is B, and B's parent is A) makes a recursive CTE loop forever in PostgreSQL. Add a depth limit (<code>WHERE t.depth &lt; 50</code>) or the <code>CYCLE</code> clause." },
        { tip: "Classic follow-up: \"Print the manager chain of an employee.\" It is the same pattern starting from the employee and walking up. See <a href=\"#/core/sql/recursive-cte-org-hierarchy\">recursive CTE org hierarchy</a>." }
      ]
    },
    {
      id: "constraints-fk-cascades",
      q: "How do constraints, foreign keys and ON DELETE CASCADE behave in PostgreSQL and MySQL?",
      topic: "SQL Features",
      level: 1,
      top: true,
      short: "Constraints (NOT NULL, UNIQUE, PRIMARY KEY, CHECK, FOREIGN KEY) let the database reject bad data no matter which app writes it. A foreign key's ON DELETE action decides what happens to child rows: RESTRICT or NO ACTION blocks the delete, CASCADE deletes the children, SET NULL clears the reference. Gotchas: MySQL ignored CHECK constraints before 8.0.16; MySQL auto-creates an index on FK columns but PostgreSQL does not; PostgreSQL supports deferrable constraints.",
      a: [
        { p: "Application validation is not enough: there are other services, scripts, admin consoles and race conditions. <b>Constraints are the last line of defence</b> and they are enforced atomically. Theory: <a href=\"#/core/dbms/integrity-constraints\">integrity constraints</a>." },
        { code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("PRAGMA foreign_keys = ON")       # SQLite needs this; PG/MySQL InnoDB always enforce
con.executescript("""
CREATE TABLE customer (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE);
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL CHECK (amount > 0)
);
CREATE INDEX idx_orders_customer ON orders(customer_id);   -- PG does NOT create this for you
INSERT INTO customer VALUES (1, 'asha@x.com'), (2, 'ravi@x.com');
INSERT INTO orders VALUES (10, 1, 499), (11, 1, 99), (12, 2, 250);
""")
for bad in ["INSERT INTO orders VALUES (13, 99, 10)",      # no such customer
            "INSERT INTO orders VALUES (14, 2, -5)",       # violates CHECK
            "INSERT INTO customer VALUES (3, 'asha@x.com')"]:  # violates UNIQUE
    try:
        con.execute(bad)
    except sqlite3.IntegrityError as e:
        print("rejected:", e)
con.execute("DELETE FROM customer WHERE id = 1")
print(con.execute("SELECT id, customer_id FROM orders").fetchall())
# rejected: FOREIGN KEY constraint failed
# rejected: CHECK constraint failed: amount > 0
# rejected: UNIQUE constraint failed: customer.email
# [(12, 2)]          <- Asha's orders 10 and 11 were cascaded away`, lang: "python", title: "Constraints rejecting bad data (portable SQL, run on SQLite)" },
        { table: { head: ["ON DELETE …", "Effect on child rows", "Typical use"], rows: [
          ["<code>NO ACTION</code> (default)", "Delete fails if children exist (checked at end of statement; deferrable in PG)", "Most relationships"],
          ["<code>RESTRICT</code>", "Delete fails immediately", "Same as above, never deferred"],
          ["<code>CASCADE</code>", "Children are deleted too", "Parts of a whole: order → order_items"],
          ["<code>SET NULL</code>", "FK column set to NULL", "Optional link: post.editor_id when an editor leaves"],
          ["<code>SET DEFAULT</code>", "FK set to its default", "Rare. PG only (InnoDB rejects it)"]
        ] } },
        { h: "Engine differences that bite" },
        { ul: [
          "<b>CHECK</b>: MySQL parsed and silently <i>ignored</i> CHECK constraints until <b>8.0.16</b>. PostgreSQL has always enforced them.",
          "<b>FK index</b>: InnoDB requires an index on the referencing column and creates one if missing. PostgreSQL does <b>not</b>. Without it, every parent DELETE or key UPDATE scans the child table, and cascades get slow. Always index FK columns in PostgreSQL.",
          "<b>Deferrable</b>: PostgreSQL supports <code>DEFERRABLE INITIALLY DEFERRED</code>, so constraints are checked at COMMIT. This is useful for circular references or swapping unique values. MySQL checks immediately.",
          "<b>Exclusion constraints</b> (no overlapping ranges) exist only in PostgreSQL.",
          "Adding an FK to a big existing PostgreSQL table: use <code>ADD CONSTRAINT … NOT VALID</code>, then <code>VALIDATE CONSTRAINT</code>, which avoids a long blocking lock."
        ] },
        { warn: "<code>ON DELETE CASCADE</code> on the wrong relationship is dangerous. Deleting one user can silently wipe their orders, payments and audit logs. For business records, prefer soft deletes (<code>deleted_at</code>) or RESTRICT, and cascade only for true child rows." }
      ]
    },
    {
      id: "full-text-search",
      q: "How do you implement full-text search in PostgreSQL and MySQL, and when do you need Elasticsearch?",
      topic: "SQL Features",
      level: 2,
      top: false,
      short: "LIKE '%word%' cannot use a B-tree index and does not understand language. PostgreSQL has built-in full-text search: to_tsvector turns text into stemmed lexemes, to_tsquery or websearch_to_tsquery builds the query, @@ matches, ts_rank ranks, and a GIN index makes it fast. MySQL has FULLTEXT indexes with MATCH … AGAINST in natural-language or boolean mode. Move to Elasticsearch or OpenSearch when you need typo tolerance, facets, complex relevance tuning or very large search volume.",
      a: [
        { p: "<code>WHERE body LIKE '%index%'</code> scans every row and misses \"indexing\" vs \"indexes\". Full-text search <b>tokenizes</b> text, removes stop words, <b>stems</b> words to a root (indexes → index), and stores an <b>inverted index</b> from word to rows." },
        { code: `-- PostgreSQL: stored generated tsvector column + GIN index (PG 12+)
ALTER TABLE articles ADD COLUMN search tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body,  '')), 'B')
  ) STORED;
CREATE INDEX idx_articles_search ON articles USING gin (search);

SELECT title, ts_rank(search, q) AS rank
FROM articles, websearch_to_tsquery('english', 'postgres index -mysql') AS q
WHERE search @@ q
ORDER BY rank DESC
LIMIT 10;

-- Fuzzy / substring matching: trigram index makes ILIKE '%dell%' fast
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

-- MySQL (InnoDB FULLTEXT, 5.6+)
ALTER TABLE articles ADD FULLTEXT INDEX ft_articles (title, body);
SELECT title, MATCH(title, body) AGAINST ('postgres index') AS score
FROM articles
WHERE MATCH(title, body) AGAINST ('postgres index' IN NATURAL LANGUAGE MODE)
ORDER BY score DESC;
SELECT title FROM articles
WHERE MATCH(title, body) AGAINST ('+postgres -mysql' IN BOOLEAN MODE);`, lang: "sql", title: "Full-text search in both engines" },
        { p: "SQLite's FTS5 works on the same principles (stemming tokenizer, inverted index, BM25 ranking), so here is a runnable version:" },
        { code: `import sqlite3
con = sqlite3.connect(":memory:")
# porter = English stemming, like to_tsvector('english', ...) in PostgreSQL
con.execute("CREATE VIRTUAL TABLE docs USING fts5(title, body, tokenize='porter')")
con.executemany("INSERT INTO docs VALUES (?, ?)", [
    ("Postgres indexing", "B-tree, GIN and BRIN indexes explained"),
    ("MySQL replication", "Binlog based replication and GTIDs"),
    ("Index tuning tips", "Composite indexes, covering indexes and index-only scans in MySQL"),
    ("Docker basics", "Images, containers and volumes"),
    ("Redis caching", "Cache-aside and TTLs"),
    ("Git rebase", "Rewriting history safely"),
])
q = "SELECT title, round(bm25(docs), 2) FROM docs WHERE docs MATCH ? ORDER BY bm25(docs)"
print(con.execute(q, ("index",)).fetchall())          # matches indexing / indexes / index
print(con.execute(q, ("mysql NOT replication",)).fetchall())
# [('Index tuning tips', -0.89), ('Postgres indexing', -0.77)]
# [('Index tuning tips', -0.46)]          (bm25: more negative = better match)`, lang: "python", title: "Stemming + ranking with SQLite FTS5" },
        { table: { head: ["Need", "Built-in FTS is enough?"], rows: [
          ["Search box on a blog, docs, product names", "Yes"],
          ["Ranking by title vs body weight", "Yes (setweight / column weights)"],
          ["Typo tolerance (\"postgers\")", "Partly (pg_trgm similarity); Elasticsearch is better"],
          ["Facets, aggregations, autocomplete, synonyms at scale", "Elasticsearch / OpenSearch / Meilisearch"],
          ["Search load that would hurt the OLTP database", "Separate search engine, synced via CDC or a queue"]
        ] } },
        { warn: "MySQL ignores words shorter than <code>innodb_ft_min_token_size</code> (default 3) and words in its stopword list, so a search for \"go\" or \"AI\" returns nothing until you change the setting and rebuild the index. For Chinese/Japanese text, use the <code>ngram</code> parser." }
      ]
    },

    /* ───────────── Operations & Scaling ───────────── */
    {
      id: "connection-pooling",
      q: "Why do you need connection pooling with PostgreSQL/MySQL, and how do PgBouncer and HikariCP fit in?",
      topic: "Operations & Scaling",
      level: 2,
      top: true,
      short: "Opening a database connection is expensive (TCP, TLS, authentication, and in PostgreSQL a forked backend process using several MB). The server also handles only a limited number of connections efficiently. A pool keeps a small set of open connections and lends them to requests. HikariCP (Java), SQLAlchemy's pool and node-postgres Pool are in-app pools. PgBouncer is an external pooler that lets thousands of clients share a few dozen server connections, usually in transaction mode.",
      a: [
        { p: "Without a pool, every request pays for a connection handshake and the database may face thousands of mostly idle connections. PostgreSQL forks one <b>process</b> per connection (default <code>max_connections = 100</code>). MySQL uses one <b>thread</b> per connection (default 151). Past a few hundred active connections, both spend more time context-switching and contending for locks than doing work." },
        { code: `from sqlalchemy import create_engine, event, text

engine = create_engine("sqlite:///pool_demo.db", pool_size=2, max_overflow=0)
opened = 0

@event.listens_for(engine, "connect")      # fires only when a NEW physical connection is made
def on_connect(dbapi_conn, record):
    global opened
    opened += 1

for _ in range(100):                      # 100 "requests"
    with engine.connect() as conn:        # borrow from the pool ...
        conn.execute(text("SELECT 1"))
                                          # ... and return it on exit
print("requests: 100, physical connections opened:", opened)
print(engine.pool.status())
# requests: 100, physical connections opened: 1
# Pool size: 2  Connections in pool: 1 Current Overflow: -1 Current Checked out connections: 0`, lang: "python", title: "A pool reuses connections (SQLAlchemy, runnable on SQLite)" },
        { h: "Two layers of pooling" },
        { table: { head: ["", "In-app pool", "External pooler"], rows: [
          ["Examples", "HikariCP (Spring Boot default), SQLAlchemy QueuePool, node-postgres <code>Pool</code>, psycopg_pool", "PgBouncer, Pgpool-II, RDS Proxy, ProxySQL (MySQL)"],
          ["Scope", "One app instance", "All instances share it"],
          ["Solves", "Handshake cost per request", "Too many total connections (many pods, serverless functions)"],
          ["Config", "<code>maximumPoolSize</code>, timeouts, max lifetime", "<code>pool_mode</code>, <code>default_pool_size</code>, <code>max_client_conn</code>"]
        ] } },
        { code: `spring:
  datasource:
    url: jdbc:postgresql://db:5432/shop
    username: app
    hikari:
      maximum-pool-size: 10        # Hikari default is 10; bigger is NOT automatically faster
      minimum-idle: 10             # fixed-size pool is recommended
      connection-timeout: 30000    # ms to wait for a free connection before failing
      max-lifetime: 1800000        # recycle before the DB or a firewall kills idle sockets`, lang: "yaml", title: "Spring Boot + HikariCP" },
        { code: `; pgbouncer.ini
[databases]
shop = host=10.0.0.5 port=5432 dbname=shop

[pgbouncer]
listen_port = 6432
pool_mode = transaction      ; server connection is held only for one transaction
max_client_conn = 2000       ; app-side connections PgBouncer accepts
default_pool_size = 20       ; real PostgreSQL connections per db/user pair`, lang: "text", title: "PgBouncer in transaction mode" },
        { ul: [
          "<b>Session mode</b>: a client keeps one server connection until it disconnects. Safe, but little gain.",
          "<b>Transaction mode</b>: the server connection returns to the pool after each COMMIT. This gives the best sharing, but session state does not survive between transactions: <code>SET</code>, session advisory locks, <code>LISTEN</code>, temp tables. Protocol-level prepared statements are supported since PgBouncer 1.21 (<code>max_prepared_statements</code>).",
          "<b>Statement mode</b>: multi-statement transactions are not allowed. Rarely used."
        ] },
        { warn: "Bigger pools are often slower. The HikariCP guidance is roughly <code>connections = (CPU cores × 2) + effective spindle count</code> on the <i>database</i> server, so a 4-core database usually wants about 10 active connections, not 200. Also check the total: 20 pods × pool size 20 = 400 connections, which exceeds the server limit. That is exactly when you add PgBouncer." },
        { tip: "Serverless (Lambda, Vercel functions) is the classic case: each invocation may open its own connection. Use RDS Proxy, PgBouncer/Supavisor, or a serverless driver, and say so in the interview." }
      ]
    },
    {
      id: "migrations",
      q: "How do you manage schema migrations (Flyway, Alembic, Prisma), and how do you change a schema without downtime?",
      topic: "Operations & Scaling",
      level: 2,
      top: false,
      short: "Migrations are versioned, ordered scripts kept in git. A tool (Flyway or Liquibase for Java, Alembic for SQLAlchemy, Prisma Migrate for Node) applies the pending ones and records them in a history table, so every environment ends up with the same schema. For zero downtime, use expand-and-contract: add new things in a backward-compatible way, deploy code that uses them, backfill, then remove the old things later. Watch out for locking DDL; PostgreSQL DDL is transactional but MySQL DDL is not.",
      a: [
        { p: "Never change production schemas by hand. A <b>migration</b> is a small, versioned change (\"add column phone to users\") that is code-reviewed and applied by CI/CD. The tool tracks what has run in a table such as <code>flyway_schema_history</code>, <code>alembic_version</code> or <code>_prisma_migrations</code>." },
        { table: { head: ["Tool", "Ecosystem", "Migration format", "Commands"], rows: [
          ["Flyway", "Java / Spring Boot (runs on startup)", "<code>V1__init.sql</code>, <code>V2__add_phone.sql</code>", "<code>flyway migrate</code>, <code>info</code>, <code>validate</code>"],
          ["Liquibase", "Java", "XML/YAML/SQL changesets", "<code>liquibase update</code>, <code>rollback</code>"],
          ["Alembic", "Python / SQLAlchemy, FastAPI, Flask", "Python files with <code>upgrade()</code> / <code>downgrade()</code>; can autogenerate from models", "<code>alembic revision --autogenerate -m \"…\"</code>, <code>alembic upgrade head</code>"],
          ["Prisma Migrate", "Node / TypeScript", "SQL generated from <code>schema.prisma</code>", "<code>prisma migrate dev</code> (local), <code>prisma migrate deploy</code> (CI/prod)"]
        ] } },
        { code: `"""add phone to users

Revision ID: 3f2a1c9d8e7b
Revises: 9b1e4d2c7a10
"""
from alembic import op
import sqlalchemy as sa

revision = "3f2a1c9d8e7b"
down_revision = "9b1e4d2c7a10"

def upgrade():
    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))
    # build the index without blocking writes (PostgreSQL); must run outside a transaction
    with op.get_context().autocommit_block():
        op.create_index("ix_users_phone", "users", ["phone"], postgresql_concurrently=True)

def downgrade():
    op.drop_index("ix_users_phone", table_name="users")
    op.drop_column("users", "phone")`, lang: "python", run: false, title: "An Alembic migration" },
        { h: "Zero-downtime: expand and contract" },
        { ol: [
          "<b>Expand</b>: add the new column or table as nullable or with a default. Old code keeps working.",
          "Deploy code that <b>writes to both</b> old and new columns and reads from the old one.",
          "<b>Backfill</b> existing rows in small batches (for example 5,000 rows per transaction) to avoid long locks and replication lag.",
          "Switch reads to the new column. Add <code>NOT NULL</code> and constraints once the data is clean.",
          "<b>Contract</b>: in a later release, stop writing the old column and then drop it."
        ] },
        { table: { head: ["Concern", "PostgreSQL", "MySQL 8"], rows: [
          ["DDL in a transaction", "Yes. A failed migration rolls back cleanly", "No. Each DDL implicitly commits, so a half-applied migration needs manual repair"],
          ["Add column with default", "Instant since PG 11 (non-volatile default)", "<code>ALGORITHM=INSTANT</code> since 8.0.12 (any position since 8.0.29)"],
          ["Add index on a live table", "<code>CREATE INDEX CONCURRENTLY</code>", "Online DDL (<code>ALGORITHM=INPLACE, LOCK=NONE</code>), or gh-ost / pt-online-schema-change"],
          ["Lock danger", "Even a quick <code>ALTER</code> waits for an ACCESS EXCLUSIVE lock and blocks everything queued behind it. Set <code>lock_timeout = '5s'</code>", "Metadata lock waits behind long transactions in the same way"]
        ] } },
        { warn: "Renaming a column in one step breaks every running app instance that still uses the old name during a rolling deploy. Do it as add-new → dual-write → backfill → switch → drop-old." },
        { tip: "Mention that migrations should be <b>forward-only in production</b>. Rolling back a migration that dropped data does not bring the data back, so fix forward with a new migration." }
      ]
    },
    {
      id: "backups-replication",
      q: "How do backups and replication work in PostgreSQL (streaming, logical) and MySQL (binlog)?",
      topic: "Operations & Scaling",
      level: 2,
      top: true,
      short: "Backups are either logical (pg_dump, mysqldump: SQL or archive files, portable but slow to restore) or physical (pg_basebackup, Percona XtraBackup: file copies), plus continuous WAL or binlog archiving for point-in-time recovery. PostgreSQL streaming replication ships WAL to byte-identical read-only standbys; logical replication sends row changes per table through publications and subscriptions. MySQL replicas pull the source's binary log (row-based by default) and replay it, ideally with GTIDs. Replication is asynchronous by default, so replicas can lag.",
      a: [
        { p: "Both engines write every change to a log before touching the data files (<a href=\"#/core/dbms/log-based-recovery-wal\">write-ahead logging</a>). PostgreSQL calls it the <b>WAL</b>; MySQL has the InnoDB redo log for crash recovery plus a separate <b>binary log</b> for replication and point-in-time recovery. Replication is simply \"ship that log to another server and replay it\"." },
        { svg: `<svg viewBox="0 0 700 240" width="700" class="dg">
  <rect class="box-a" x="20" y="30" width="150" height="50" rx="6"/>
  <text class="tx tx-b" x="95" y="50" text-anchor="middle">PG primary</text>
  <text class="tx-s" x="95" y="68" text-anchor="middle">writes WAL</text>
  <line class="ln" x1="170" y1="45" x2="300" y2="30" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="232" y="26" text-anchor="middle">WAL stream</text>
  <rect class="box-g" x="302" y="10" width="180" height="40" rx="6"/>
  <text class="tx" x="392" y="30" text-anchor="middle" dominant-baseline="middle">hot standby (read-only)</text>
  <line class="ln ln-d" x1="170" y1="60" x2="300" y2="78" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="232" y="88" text-anchor="middle">row changes</text>
  <rect class="box-p" x="302" y="60" width="180" height="40" rx="6"/>
  <text class="tx" x="392" y="80" text-anchor="middle" dominant-baseline="middle">logical subscriber</text>
  <line class="ln ln-d" x1="95" y1="80" x2="95" y2="104" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="20" y="106" width="150" height="30" rx="6"/>
  <text class="tx" x="95" y="121" text-anchor="middle" dominant-baseline="middle">WAL archive → PITR</text>
  <text class="tx-s" x="600" y="30" text-anchor="middle">byte-identical copy</text>
  <text class="tx-s" x="600" y="80" text-anchor="middle">selected tables only</text>
  <rect class="box-a" x="20" y="170" width="150" height="50" rx="6"/>
  <text class="tx tx-b" x="95" y="190" text-anchor="middle">MySQL source</text>
  <text class="tx-s" x="95" y="208" text-anchor="middle">writes binlog</text>
  <line class="ln" x1="170" y1="195" x2="230" y2="195" marker-end="url(#dg-arr)"/>
  <rect class="box" x="232" y="175" width="130" height="40" rx="6"/>
  <text class="tx" x="297" y="195" text-anchor="middle" dominant-baseline="middle">IO thread</text>
  <line class="ln" x1="362" y1="195" x2="402" y2="195" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="404" y="175" width="110" height="40" rx="6"/>
  <text class="tx" x="459" y="195" text-anchor="middle" dominant-baseline="middle">relay log</text>
  <line class="ln" x1="514" y1="195" x2="554" y2="195" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="556" y="175" width="130" height="40" rx="6"/>
  <text class="tx" x="621" y="195" text-anchor="middle" dominant-baseline="middle">SQL/applier</text>
</svg>`, caption: "Top: PostgreSQL physical and logical replication plus WAL archiving. Bottom: a MySQL replica pulling the binlog" },
        { table: { head: ["", "PG streaming (physical)", "PG logical", "MySQL binlog replication"], rows: [
          ["What is shipped", "WAL bytes (page changes)", "Decoded row changes per table", "Binlog events (ROW format by default since 5.7.7)"],
          ["Replica is", "Exact copy of the whole cluster, read-only", "Independent, writable database", "Read-only by convention (<code>super_read_only</code>)"],
          ["Versions", "Same major version only", "Can differ: used for near-zero-downtime upgrades", "Replica same or newer"],
          ["Granularity", "Whole cluster", "Chosen tables (publication)", "Whole server, with filters"],
          ["Sync options", "Async default; <code>synchronous_standby_names</code> for sync", "Async", "Async default; semi-sync plugin; Group Replication"],
          ["Setup keywords", "<code>pg_basebackup -R</code>, <code>primary_conninfo</code>", "<code>CREATE PUBLICATION</code> / <code>CREATE SUBSCRIPTION</code>", "<code>CHANGE REPLICATION SOURCE TO …</code> (8.0.23+), GTIDs"]
        ] } },
        { code: `# PostgreSQL logical backup (consistent snapshot, custom format, parallel restore)
pg_dump -Fc -d shop -f shop_2026-10-03.dump
pg_restore -d shop_restored -j 4 shop_2026-10-03.dump

# PostgreSQL physical base backup that can become a streaming standby
pg_basebackup -h primary -D /var/lib/postgresql/data -R -X stream -P

# MySQL logical backup without locking InnoDB tables
mysqldump --single-transaction --routines --triggers shop > shop.sql
# Point-in-time recovery: restore last night's backup, then replay binlogs up to the bad DELETE
mysqlbinlog --stop-datetime="2026-10-03 14:59:00" binlog.000042 | mysql shop`, lang: "bash", title: "Backup commands" },
        { ul: [
          "<b>Replication is not a backup.</b> A <code>DROP TABLE</code> replicates to every replica within milliseconds. You need backups + WAL/binlog archives for <b>point-in-time recovery</b>, and you must regularly <b>test restores</b>.",
          "<b>Replication lag</b>: async replicas can be seconds behind. A user who updates their profile and then reads from a replica may see old data. Route read-your-own-writes to the primary. See <a href=\"#/core/sd/database-replication\">replication in system design</a>.",
          "<b>Failover</b>: promoting a replica is done by tools such as Patroni (PostgreSQL), Orchestrator or InnoDB Cluster (MySQL), or by managed services (RDS, Cloud SQL) automatically."
        ] },
        { tip: "Define RPO and RTO: \"With continuous WAL archiving our RPO is seconds; restoring a 200 GB base backup and replaying WAL gives an RTO of about an hour.\" Using those terms signals real operational thinking." }
      ]
    },
    {
      id: "partitioning",
      q: "What is table partitioning in PostgreSQL and MySQL, and when does it actually help?",
      topic: "Operations & Scaling",
      level: 3,
      top: false,
      short: "Partitioning splits one logical table into child tables by a key, usually by RANGE on a date, or by LIST or HASH. Queries that filter on the key touch only the relevant partitions (partition pruning), and old data can be dropped instantly by dropping a partition instead of running a huge DELETE. It helps very large, time-series-like tables. It is not sharding: all partitions live on one server, and unique keys must include the partition key.",
      a: [
        { p: "A partitioned table is a parent that holds no rows itself. Each row is routed to exactly one <b>partition</b> by the partition key. Unlike <a href=\"#/core/dbms/sharding-partitioning-replication\">sharding</a>, every partition lives in the same database server." },
        { code: `-- PostgreSQL declarative partitioning (10+; HASH since 11)
CREATE TABLE events (
  id         bigint GENERATED ALWAYS AS IDENTITY,
  user_id    bigint NOT NULL,
  created_at timestamptz NOT NULL,
  payload    jsonb,
  PRIMARY KEY (id, created_at)                 -- PK/UNIQUE must include the partition key
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_09 PARTITION OF events
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE events_2026_10 PARTITION OF events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE INDEX ON events (user_id, created_at);   -- created on every partition

-- Pruning: only events_2026_10 is scanned
EXPLAIN SELECT count(*) FROM events WHERE created_at >= '2026-10-01';

-- Retention: instant, no VACUUM debt (compare with DELETE of 50M rows)
ALTER TABLE events DETACH PARTITION events_2026_09;
DROP TABLE events_2026_09;

-- MySQL
CREATE TABLE logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created DATE NOT NULL,
  msg TEXT,
  PRIMARY KEY (id, created)
) PARTITION BY RANGE (YEAR(created)) (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION pmax  VALUES LESS THAN MAXVALUE
);`, lang: "sql", title: "Range partitioning by time" },
        { table: { head: ["Strategy", "Key example", "Use when"], rows: [
          ["RANGE", "created_at by month", "Time-series, logs, orders with retention"],
          ["LIST", "region IN ('IN','US')", "Data naturally grouped by a category"],
          ["HASH", "hash(user_id) mod 8", "Spread writes evenly when there is no natural range"]
        ] } },
        { h: "Helps vs does not help" },
        { ul: [
          "<b>Helps</b>: queries always filter on the partition key; dropping old data; per-partition maintenance (VACUUM/ANALYZE, index rebuilds on a smaller table); keeping recent hot partitions in memory.",
          "<b>Does not help</b>: queries that do not filter on the key (they scan every partition, which is slower than one big index); tables of a few million rows (a good index is enough).",
          "PostgreSQL limits: unique constraints must include the partition key; too many partitions (thousands) slow planning. Tools like <code>pg_partman</code> create future partitions automatically.",
          "MySQL limits: every unique key must include all partitioning columns, and partitioned InnoDB tables cannot have foreign keys."
        ] },
        { warn: "Forgetting to create next month's partition makes inserts fail (\"no partition of relation found for row\"). Automate partition creation, or add a <code>DEFAULT</code> partition as a safety net." },
        { tip: "If asked \"partitioning or sharding?\": partitioning first, because it is one server and transparent to the app. Shard (Citus, Vitess, app-level) only when one server's CPU, RAM or disk cannot keep up. See <a href=\"#/core/sd/database-sharding\">database sharding</a>." }
      ]
    },

    /* ───────────── Security & Performance ───────────── */
    {
      id: "roles-grants-sql-injection",
      q: "How do you secure a PostgreSQL/MySQL database: roles, grants, least privilege, and preventing SQL injection in Python and Java?",
      topic: "Security & Performance",
      level: 1,
      top: true,
      short: "Give each application its own login role with only the privileges it needs (SELECT, INSERT, UPDATE on its own schema, no DDL and no superuser), require strong authentication (scram-sha-256 or caching_sha2_password) and TLS, and restrict network access. Prevent SQL injection by always passing user input as bound parameters (cursor.execute(sql, params) in Python, PreparedStatement in Java), never by string concatenation. Identifiers like column names cannot be parameters, so whitelist them.",
      a: [
        { h: "Least privilege with roles" },
        { code: `-- PostgreSQL: roles are both users and groups
CREATE ROLE app_readwrite NOLOGIN;
GRANT USAGE ON SCHEMA shop TO app_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shop TO app_readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA shop TO app_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA shop
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_readwrite;   -- future tables too

CREATE ROLE orders_api LOGIN PASSWORD 'from-a-secret-manager' IN ROLE app_readwrite;
CREATE ROLE analyst LOGIN PASSWORD '…';
GRANT SELECT ON shop.orders TO analyst;                -- read-only, one table
-- Row-level security: each tenant sees only its own rows
ALTER TABLE shop.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON shop.orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);

-- MySQL 8: accounts are user@host; roles exist since 8.0
CREATE USER 'orders_api'@'10.0.%' IDENTIFIED BY '…';
CREATE ROLE 'app_rw';
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'app_rw';
GRANT 'app_rw' TO 'orders_api'@'10.0.%';
SET DEFAULT ROLE 'app_rw' TO 'orders_api'@'10.0.%';`, lang: "sql", title: "Roles and grants" },
        { ul: [
          "The app never connects as <code>postgres</code> or <code>root</code>. Migrations run with a separate, more privileged role.",
          "Authentication: <code>scram-sha-256</code> is the PostgreSQL default since 14 (configured in <code>pg_hba.conf</code>). MySQL 8 defaults to <code>caching_sha2_password</code>. Require TLS.",
          "Network: keep the database in a private subnet or VPC, with no public IP; allow only app servers. PostgreSQL 15 removed the default CREATE privilege on the <code>public</code> schema for all users.",
          "Keep secrets in a vault or environment variables, never in git. Encrypt backups."
        ] },
        { h: "SQL injection: parameterize everything" },
        { code: `import sqlite3
con = sqlite3.connect(":memory:")
con.executescript("""
CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password_hash TEXT);
INSERT INTO users (email, password_hash) VALUES ('asha@x.com', 'h1'), ('ravi@x.com', 'h2');
""")
evil = "nobody@x.com' OR '1'='1"

# VULNERABLE: user input becomes part of the SQL text
sql = f"SELECT id, email FROM users WHERE email = '{evil}'"
print("f-string :", con.execute(sql).fetchall())

# SAFE: the SQL text is fixed; the value travels separately as a bound parameter
print("parameter:", con.execute("SELECT id, email FROM users WHERE email = ?", (evil,)).fetchall())

# Identifiers (column names, ORDER BY) cannot be parameters -> whitelist them
def list_users(sort_by):
    allowed = {"email": "email", "newest": "id DESC"}
    return con.execute(f"SELECT email FROM users ORDER BY {allowed[sort_by]}").fetchall()
print(list_users("newest"))
# f-string : [(1, 'asha@x.com'), (2, 'ravi@x.com')]      <- every user leaked
# parameter: []
# [('ravi@x.com',), ('asha@x.com',)]
# With psycopg / PyMySQL the placeholder is %s:  cur.execute("... WHERE email = %s", (email,))`, lang: "python", title: "Python: injection vs bound parameters" },
        { code: `import java.sql.*;

public class UserDao {
    // SAFE: the driver sends the SQL and the value separately
    public static String findName(Connection con, String email) throws SQLException {
        String sql = "SELECT name FROM users WHERE email = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getString("name") : null;
            }
        }
    }
    // VULNERABLE (never do this):
    // con.createStatement().executeQuery("SELECT name FROM users WHERE email = '" + email + "'");
}`, lang: "java", title: "Java: PreparedStatement" },
        { warn: "ORMs do not make you immune. <code>session.execute(text(f\"... {user_input}\"))</code> in SQLAlchemy, <code>$queryRawUnsafe</code> in Prisma and string-built JPQL are all injectable. Escaping functions are a fallback, not a fix. Theory: <a href=\"#/core/dbms/sql-injection\">SQL injection</a>." }
      ]
    },
    {
      id: "performance-checklist",
      q: "A PostgreSQL/MySQL-backed API is slow. What is your database performance checklist?",
      topic: "Security & Performance",
      level: 2,
      top: true,
      short: "Measure first: find the queries with the highest total time using pg_stat_statements or the MySQL slow query log. EXPLAIN ANALYZE them and fix the plan with the right composite or covering index, a sargable rewrite, or fresh statistics. Then check the app side: N+1 queries, SELECT *, missing pagination, no connection pool. Then the server: memory settings, bloat and vacuum, lock waits, replication lag. Scale with read replicas, caching or partitioning only after that.",
      a: [
        { ol: [
          "<b>Find the expensive queries</b>, by <i>total</i> time (calls × mean), not just the slowest single query.",
          "<b>EXPLAIN ANALYZE</b> each one. Look for sequential scans on big tables, bad row estimates, sorts spilling to disk, and nested loops over many rows.",
          "<b>Index properly</b>: composite indexes in the right column order (equality columns first, then range/sort), covering indexes for hot queries, partial indexes for hot subsets. Drop unused indexes.",
          "<b>Write sargable predicates</b>: <code>WHERE created_at &gt;= '2026-10-01'</code>, not <code>WHERE DATE(created_at) = …</code>; no leading-wildcard LIKE; no implicit type casts (comparing a varchar column with a number in MySQL defeats the index).",
          "<b>Fix the app's access pattern</b>: N+1 queries from an ORM (use joins or eager loading), <code>SELECT *</code> over the network, OFFSET pagination on deep pages (use keyset pagination), batching inserts.",
          "<b>Connections</b>: a correctly sized pool, plus PgBouncer if there are many app instances.",
          "<b>Server health</b>: <code>shared_buffers</code> (~25% RAM) / <code>innodb_buffer_pool_size</code> (~50–75% RAM on a dedicated host), autovacuum keeping up, lock waits, long transactions, disk I/O, replication lag.",
          "<b>Scale out last</b>: read replicas, a cache (Redis) for hot reads, partitioning for huge tables, and sharding only when one server truly is not enough."
        ] },
        { code: `-- PostgreSQL: top queries by total time (CREATE EXTENSION pg_stat_statements; PG 13+ column names)
SELECT left(query, 80) AS query, calls,
       round(mean_exec_time::numeric, 2)  AS mean_ms,
       round(total_exec_time::numeric)    AS total_ms
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- PostgreSQL: who is blocking whom right now
SELECT pid, pg_blocking_pids(pid) AS blocked_by, state, left(query, 60)
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;

-- MySQL: log queries slower than 500 ms, then summarize with pt-query-digest
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 0.5;
SELECT * FROM sys.statement_analysis ORDER BY total_latency DESC LIMIT 10;`, lang: "sql", title: "Where to look first" },
        { code: `-- Non-sargable: the function hides the column from the index
SELECT * FROM orders WHERE DATE(created_at) = '2026-10-03';
-- Sargable rewrite: a range on the raw column uses an index on created_at
SELECT * FROM orders
WHERE created_at >= '2026-10-03' AND created_at < '2026-10-04';

-- N+1: 1 query for 50 orders, then 50 queries for their customers ...
-- ... replace with one join (or the ORM's eager loading: joinedload / JOIN FETCH / include)
SELECT o.id, o.total, c.name
FROM orders o JOIN customers c ON c.id = o.customer_id
WHERE o.created_at >= now() - interval '1 day';`, lang: "sql", title: "Two of the most common fixes" },
        { table: { head: ["Symptom", "Likely cause", "Fix"], rows: [
          ["One endpoint slow, DB CPU high", "Missing or wrong index", "EXPLAIN ANALYZE, then add a composite or covering index"],
          ["Hundreds of tiny queries per request", "ORM N+1", "Eager loading or joins"],
          ["Slow over time, table much larger than its row count suggests", "PG bloat / autovacuum lagging", "Tune autovacuum, kill idle-in-transaction sessions, <code>pg_repack</code>"],
          ["Random timeouts under load", "Pool exhausted or lock waits", "Shorter transactions, right-sized pool, check blocking PIDs"],
          ["Reads show stale data", "Reading from a lagging replica", "Read your own writes from the primary"]
        ] } },
        { tip: "Structure beats a list of tricks: <b>measure → explain → fix the biggest item → measure again</b>. Link back to <a href=\"#/core/dbms/query-optimization-explain\">query optimization</a> and <a href=\"#/core/dbms/when-indexes-hurt\">when indexes hurt</a> for the theory." }
      ]
    }
  ]
});
