/* study: SQL — lessons for the 60-day plan (MySQL 8 + PostgreSQL) */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ---------- the one sample schema used by every SQL lesson ---------- */
  var EMP = { table: { head: ["id", "name", "dept_id", "salary", "manager_id", "hired_on"], rows: [
    ["1", "Asha", "1", "90000", "NULL", "2019-04-01"],
    ["2", "Ravi", "1", "75000", "1", "2020-07-15"],
    ["3", "Neha", "1", "75000", "1", "2021-01-10"],
    ["4", "Karan", "2", "60000", "1", "2020-03-20"],
    ["5", "Priya", "2", "52000", "4", "2022-06-01"],
    ["6", "Vikram", "3", "45000", "1", "2021-09-12"],
    ["7", "Meera", "NULL", "40000", "1", "2023-02-01"],
    ["8", "Arjun", "2", "52000", "4", "2023-08-15"]
  ] } };
  var DEPT = { table: { head: ["id", "name"], rows: [["1", "Engineering"], ["2", "Sales"], ["3", "HR"], ["4", "Marketing"]] } };
  var CUST = { table: { head: ["id", "name", "city"], rows: [["1", "Amit", "Delhi"], ["2", "Sara", "Mumbai"], ["3", "Zoya", "Pune"], ["4", "Dev", "Delhi"]] } };
  var ORD = { table: { head: ["id", "customer_id", "order_date", "amount", "status"], rows: [
    ["101", "1", "2024-01-05", "500", "DELIVERED"],
    ["102", "1", "2024-01-20", "300", "CANCELLED"],
    ["103", "2", "2024-02-03", "1200", "DELIVERED"],
    ["104", "3", "2024-02-14", "700", "DELIVERED"],
    ["105", "1", "2024-03-02", "900", "DELIVERED"],
    ["106", "2", "2024-03-18", "400", "RETURNED"],
    ["107", "3", "2024-04-09", "1100", "DELIVERED"]
  ] } };
  var SCHEMA_NOTE = { p: "Things to notice in the data (they drive every trap in these lessons): <b>Meera has no department</b> (dept_id NULL), <b>Marketing has no employees</b>, <b>Asha has no manager</b>, <b>Dev has never ordered</b>, and there are salary ties (Ravi = Neha = 75000, Priya = Arjun = 52000)." };

  /* =====================================================================
     d5-ev  SQL Level 1
     ===================================================================== */
  add({
    id: "sql-basics",
    subject: "sql",
    title: "SQL Level 1: SELECT, filters, NULL, CASE, GROUP BY & HAVING",
    minutes: 75,
    crux: [
      "SQL is <b>written</b> SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT but <b>runs</b> FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. That one fact explains most errors.",
      "<b>NULL means unknown.</b> <code>x = NULL</code> is never true — use <code>IS NULL</code> / <code>IS NOT NULL</code> / <code>COALESCE</code>. <code>&lt;&gt;</code> and <code>NOT IN</code> silently drop NULL rows.",
      "<b>WHERE</b> filters rows before grouping; <b>HAVING</b> filters groups after. An aggregate like <code>AVG(salary)</code> cannot appear in WHERE.",
      "<code>COUNT(*)</code> counts rows, <code>COUNT(col)</code> skips NULLs, <code>COUNT(DISTINCT col)</code> counts distinct non-NULL values. SUM/AVG/MIN/MAX ignore NULLs.",
      "Every column in SELECT that is not inside an aggregate must be in GROUP BY (MySQL 8 <code>ONLY_FULL_GROUP_BY</code> and PostgreSQL both enforce it).",
      "<code>CASE WHEN … THEN … ELSE … END</code> is an expression: use it in SELECT, ORDER BY, GROUP BY and inside aggregates. The first true branch wins.",
      "<code>ORDER BY … LIMIT n</code> is only deterministic if the sort key is unique — add a tiebreaker such as <code>id</code>."
    ],
    sections: [
      { h: "The sample schema (used in every SQL lesson)", blocks: [
        { p: "All SQL lessons use the same four small tables so you can verify every result by hand. Create them once in MySQL 8 or PostgreSQL (the script runs unchanged on both) and run each query as you read." },
        { h: "employees" }, EMP,
        { h: "departments" }, DEPT,
        SCHEMA_NOTE,
        { code: `CREATE TABLE departments (id INT PRIMARY KEY, name VARCHAR(30));
INSERT INTO departments VALUES (1,'Engineering'),(2,'Sales'),(3,'HR'),(4,'Marketing');

CREATE TABLE employees (
  id INT PRIMARY KEY, name VARCHAR(30), dept_id INT, salary INT,
  manager_id INT, hired_on DATE
);
INSERT INTO employees VALUES
 (1,'Asha',1,90000,NULL,'2019-04-01'), (2,'Ravi',1,75000,1,'2020-07-15'),
 (3,'Neha',1,75000,1,'2021-01-10'),    (4,'Karan',2,60000,1,'2020-03-20'),
 (5,'Priya',2,52000,4,'2022-06-01'),   (6,'Vikram',3,45000,1,'2021-09-12'),
 (7,'Meera',NULL,40000,1,'2023-02-01'),(8,'Arjun',2,52000,4,'2023-08-15');

-- used from Level 2 (joins) onwards
CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(30), city VARCHAR(30));
INSERT INTO customers VALUES (1,'Amit','Delhi'),(2,'Sara','Mumbai'),(3,'Zoya','Pune'),(4,'Dev','Delhi');

CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, order_date DATE, amount INT, status VARCHAR(12));
INSERT INTO orders VALUES
 (101,1,'2024-01-05',500,'DELIVERED'), (102,1,'2024-01-20',300,'CANCELLED'),
 (103,2,'2024-02-03',1200,'DELIVERED'),(104,3,'2024-02-14',700,'DELIVERED'),
 (105,1,'2024-03-02',900,'DELIVERED'), (106,2,'2024-03-18',400,'RETURNED'),
 (107,3,'2024-04-09',1100,'DELIVERED');`, lang: "sql", title: "Setup script (MySQL 8 and PostgreSQL)" }
      ] },
      { h: "How a query actually runs (logical order)", blocks: [
        { svg: `<svg viewBox="0 0 720 170" width="720" class="dg">
  <text class="tx-m" x="360" y="14" text-anchor="middle" dominant-baseline="middle">written: SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT</text>
  <rect class="box" x="8" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="45" y="60" text-anchor="middle" dominant-baseline="middle">FROM</text>
  <rect class="box" x="96" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="133" y="60" text-anchor="middle" dominant-baseline="middle">WHERE</text>
  <rect class="box-p" x="184" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="221" y="60" text-anchor="middle" dominant-baseline="middle">GROUP BY</text>
  <rect class="box-p" x="272" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="309" y="60" text-anchor="middle" dominant-baseline="middle">HAVING</text>
  <rect class="box-a" x="360" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="397" y="60" text-anchor="middle" dominant-baseline="middle">SELECT</text>
  <rect class="box-g" x="448" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="485" y="60" text-anchor="middle" dominant-baseline="middle">DISTINCT</text>
  <rect class="box-g" x="536" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="573" y="60" text-anchor="middle" dominant-baseline="middle">ORDER BY</text>
  <rect class="box-g" x="624" y="40" width="74" height="40" rx="6"/>
  <text class="tx tx-b" x="661" y="60" text-anchor="middle" dominant-baseline="middle">LIMIT</text>
  <line class="ln" x1="83" y1="60" x2="94" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="171" y1="60" x2="182" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="259" y1="60" x2="270" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="347" y1="60" x2="358" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="435" y1="60" x2="446" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="523" y1="60" x2="534" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="611" y1="60" x2="622" y2="60" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="45" y="96" text-anchor="middle" dominant-baseline="middle">1 · tables</text>
  <text class="tx-m" x="45" y="112" text-anchor="middle" dominant-baseline="middle">+ JOINs</text>
  <text class="tx-m" x="133" y="96" text-anchor="middle" dominant-baseline="middle">2 · filter rows</text>
  <text class="tx-m" x="221" y="96" text-anchor="middle" dominant-baseline="middle">3 · make groups</text>
  <text class="tx-m" x="309" y="96" text-anchor="middle" dominant-baseline="middle">4 · filter groups</text>
  <text class="tx-m" x="397" y="96" text-anchor="middle" dominant-baseline="middle">5 · columns,</text>
  <text class="tx-m" x="397" y="112" text-anchor="middle" dominant-baseline="middle">aliases, OVER()</text>
  <text class="tx-m" x="485" y="96" text-anchor="middle" dominant-baseline="middle">6 · dedupe</text>
  <text class="tx-m" x="573" y="96" text-anchor="middle" dominant-baseline="middle">7 · sort</text>
  <text class="tx-m" x="661" y="96" text-anchor="middle" dominant-baseline="middle">8 · cut rows</text>
  <text class="tx-a" x="360" y="148" text-anchor="middle" dominant-baseline="middle">an alias created at step 5 is visible only to steps 6–8: fine in ORDER BY, error in WHERE</text>
</svg>`, caption: "Logical processing order. The database may physically optimise, but results always behave as if run in this order." },
        { ul: [
          "<b>FROM/JOIN</b> builds the working set of rows.",
          "<b>WHERE</b> keeps rows whose condition is TRUE (not FALSE, not UNKNOWN). No aggregates here — groups don't exist yet.",
          "<b>GROUP BY</b> collapses rows into one row per group; from now on you may only see group columns and aggregates.",
          "<b>HAVING</b> filters those groups, so it can use <code>COUNT(*)</code>, <code>AVG(salary)</code>, etc.",
          "<b>SELECT</b> computes output expressions, aliases and window functions; <b>DISTINCT</b> then removes duplicate output rows.",
          "<b>ORDER BY</b> sorts (it may use SELECT aliases), and <b>LIMIT/OFFSET</b> cuts the sorted list."
        ] },
        { code: `-- ERROR in both MySQL and PostgreSQL: alias 'annual' does not exist yet at WHERE
SELECT name, salary * 12 AS annual FROM employees WHERE annual > 700000;

-- Fix: repeat the expression (or wrap the query in a subquery/CTE)
SELECT name, salary * 12 AS annual FROM employees WHERE salary * 12 > 700000
ORDER BY annual DESC;          -- alias is fine in ORDER BY`, lang: "sql", title: "Why a SELECT alias fails in WHERE" },
        { tip: "When an interviewer asks \"what's the difference between WHERE and HAVING?\", answer with the order: WHERE runs before GROUP BY on individual rows; HAVING runs after on groups. Then add: filter in WHERE whenever you can — fewer rows reach the grouping step." }
      ] },
      { h: "SELECT, WHERE and the filter operators", blocks: [
        { code: `SELECT name, salary
FROM employees
WHERE salary > 50000
ORDER BY salary DESC, name;`, lang: "sql" },
        { table: { head: ["name", "salary"], rows: [["Asha", "90000"], ["Neha", "75000"], ["Ravi", "75000"], ["Karan", "60000"], ["Arjun", "52000"], ["Priya", "52000"]] } },
        { table: { head: ["Operator", "Example", "Rows from our data", "Remember"], rows: [
          ["<code>IN (list)</code>", "<code>dept_id IN (2, 3)</code>", "Karan, Priya, Vikram, Arjun", "Shorthand for <code>dept_id = 2 OR dept_id = 3</code>"],
          ["<code>BETWEEN a AND b</code>", "<code>hired_on BETWEEN '2021-01-01' AND '2021-12-31'</code>", "Neha, Vikram", "<b>Inclusive</b> on both ends"],
          ["<code>LIKE 'A%'</code>", "names starting with A", "Asha, Arjun", "<code>%</code> = any run of chars (incl. none)"],
          ["<code>LIKE '_a%'</code>", "second letter is a", "Ravi, Karan", "<code>_</code> = exactly one char"],
          ["<code>IS NULL</code>", "<code>dept_id IS NULL</code>", "Meera", "The only correct NULL test"],
          ["<code>DISTINCT</code>", "<code>SELECT DISTINCT dept_id</code>", "1, 2, 3, NULL (4 rows)", "Applies to the whole output row; all NULLs count as one value"]
        ] } },
        { h: "AND binds tighter than OR" },
        { code: `-- Intended: hired before 2021 AND (in Engineering OR earning < 70000)
SELECT name FROM employees
WHERE hired_on < '2021-01-01' AND (dept_id = 1 OR salary < 70000);   -- Asha, Ravi, Karan

-- Without brackets it means (hired < 2021 AND dept 1) OR salary < 50000
SELECT name FROM employees
WHERE hired_on < '2021-01-01' AND dept_id = 1 OR salary < 50000;     -- Asha, Ravi, Vikram, Meera`, lang: "sql" },
        { warn: "<b>BETWEEN with timestamps:</b> if <code>hired_on</code> were a DATETIME, <code>BETWEEN '2021-01-01' AND '2021-12-31'</code> would exclude everything after midnight on 31 Dec. The safe, portable, index-friendly form is <code>hired_on &gt;= '2021-01-01' AND hired_on &lt; '2022-01-01'</code>." },
        { warn: "<b>LIKE and case:</b> MySQL's default collation (utf8mb4_0900_ai_ci) is case-insensitive, so <code>'a%'</code> also matches 'Asha'. PostgreSQL's LIKE is case-sensitive — use <code>ILIKE</code> or <code>LOWER(name) LIKE 'a%'</code>. A leading wildcard (<code>'%a'</code>) cannot use a normal B-tree index." }
      ] },
      { h: "NULL handling: three-valued logic", blocks: [
        { p: "Any comparison with NULL gives <b>UNKNOWN</b>, and WHERE keeps only TRUE rows. So a NULL row disappears from both a condition and its opposite." },
        { table: { head: ["Query", "Result", "Why"], rows: [
          ["<code>WHERE dept_id = NULL</code>", "0 rows", "NULL = NULL is UNKNOWN, not TRUE"],
          ["<code>WHERE dept_id IS NULL</code>", "Meera", "Correct test"],
          ["<code>WHERE dept_id NOT IN (1)</code>", "Karan, Priya, Vikram, Arjun", "Meera is missing: NULL &lt;&gt; 1 is UNKNOWN"],
          ["<code>WHERE dept_id &lt;&gt; 1 OR dept_id IS NULL</code>", "Karan, Priya, Vikram, Meera, Arjun", "Explicitly include NULLs"]
        ] } },
        { table: { head: ["AND", "TRUE", "FALSE", "UNKNOWN"], rows: [
          ["<b>TRUE</b>", "TRUE", "FALSE", "UNKNOWN"],
          ["<b>FALSE</b>", "FALSE", "FALSE", "FALSE"],
          ["<b>UNKNOWN</b>", "UNKNOWN", "FALSE", "UNKNOWN"]
        ] } },
        { p: "OR is the mirror: <code>TRUE OR UNKNOWN = TRUE</code>, <code>FALSE OR UNKNOWN = UNKNOWN</code>. <code>NOT UNKNOWN</code> is still UNKNOWN." },
        { code: `SELECT name,
       COALESCE(dept_id, 0)          AS dept,         -- first non-NULL argument
       COALESCE(manager_id, id)      AS boss_or_self,
       NULLIF(salary, 40000)         AS salary_or_null -- NULL if equal, else salary
FROM employees
WHERE id >= 6;`, lang: "sql" },
        { table: { head: ["name", "dept", "boss_or_self", "salary_or_null"], rows: [["Vikram", "3", "1", "45000"], ["Meera", "0", "1", "NULL"], ["Arjun", "2", "4", "52000"]] } },
        { tip: "<code>NULLIF(x, 0)</code> is the standard guard against division by zero: <code>total / NULLIF(cnt, 0)</code> returns NULL instead of an error." },
        { warn: "<b>Sorting NULLs differs:</b> MySQL puts NULLs <b>first</b> in ascending order, PostgreSQL puts them <b>last</b>. PostgreSQL supports <code>ORDER BY dept_id NULLS FIRST</code>; the portable trick is <code>ORDER BY dept_id IS NULL, dept_id</code> (NULLs last on both)." }
      ] },
      { h: "CASE expressions", blocks: [
        { code: `SELECT name, salary,
       CASE
         WHEN salary >= 75000 THEN 'High'
         WHEN salary >= 50000 THEN 'Mid'     -- only reached if the first WHEN failed
         ELSE 'Low'
       END AS band
FROM employees
ORDER BY salary DESC, id;`, lang: "sql", title: "Searched CASE — first true WHEN wins" },
        { table: { head: ["name", "salary", "band"], rows: [["Asha", "90000", "High"], ["Ravi", "75000", "High"], ["Neha", "75000", "High"], ["Karan", "60000", "Mid"], ["Priya", "52000", "Mid"], ["Arjun", "52000", "Mid"], ["Vikram", "45000", "Low"], ["Meera", "40000", "Low"]] } },
        { ul: [
          "Without <code>ELSE</code>, unmatched rows get NULL.",
          "Simple CASE compares one value: <code>CASE dept_id WHEN 1 THEN 'Eng' WHEN 2 THEN 'Sales' ELSE 'Other' END</code>. It cannot test NULL (<code>WHEN NULL</code> never matches) — use searched CASE with <code>IS NULL</code>.",
          "Custom sort order: <code>ORDER BY CASE status WHEN 'DELIVERED' THEN 1 WHEN 'RETURNED' THEN 2 ELSE 3 END</code>.",
          "Inside aggregates it becomes \"conditional aggregation\" — <code>SUM(CASE WHEN … THEN 1 ELSE 0 END)</code> — covered in Level 2."
        ] }
      ] },
      { h: "Aggregates, GROUP BY and HAVING", blocks: [
        { code: `SELECT COUNT(*), COUNT(dept_id), COUNT(DISTINCT dept_id),
       SUM(salary), AVG(salary), MIN(salary), MAX(salary)
FROM employees;`, lang: "sql" },
        { table: { head: ["COUNT(*)", "COUNT(dept_id)", "COUNT(DISTINCT dept_id)", "SUM", "AVG", "MIN", "MAX"], rows: [["8", "7", "3", "489000", "61125", "40000", "90000"]] } },
        { p: "COUNT(dept_id) is 7 because Meera's NULL is skipped; the distinct non-NULL departments are 1, 2, 3. AVG = 489000 / 8 = 61125 (MySQL shows 61125.0000, PostgreSQL 61125.000…)." },
        { code: `SELECT dept_id,
       COUNT(*)              AS headcount,
       SUM(salary)           AS total,
       ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY dept_id
ORDER BY dept_id;`, lang: "sql", title: "One row per department" },
        { table: { head: ["dept_id", "headcount", "total", "avg_salary"], rows: [["NULL", "1", "40000", "40000.00"], ["1", "3", "240000", "80000.00"], ["2", "3", "164000", "54666.67"], ["3", "1", "45000", "45000.00"]] } },
        { p: "All NULL keys form <b>one group</b>. (That NULL row prints first in MySQL, last in PostgreSQL.) Dept 2 average = 164000 / 3 = 54666.67." },
        { code: `-- groups whose average exceeds 60000
SELECT dept_id, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 60000;            -- -> dept 1, 80000.00

-- WHERE and HAVING together: count only 50k+ earners, keep depts with at least 2 of them
SELECT dept_id, COUNT(*) AS earners_50k
FROM employees
WHERE salary >= 50000                  -- row filter first
GROUP BY dept_id
HAVING COUNT(*) >= 2;                  -- -> (1, 3), (2, 3)`, lang: "sql" },
        { warn: "<code>SELECT dept_id, name, MAX(salary) FROM employees GROUP BY dept_id</code> is <b>invalid</b>: which of the 3 names should Engineering show? MySQL 8 (ONLY_FULL_GROUP_BY, on by default) and PostgreSQL reject it. Old MySQL returned an arbitrary name — never rely on that. To get \"the name of the top earner per department\" you need a subquery or window function (Level 3 / window lessons)." },
        { tip: "Alias rules differ: both databases accept a SELECT alias in GROUP BY and ORDER BY, MySQL also accepts it in HAVING but PostgreSQL does not. In interviews repeat the expression in HAVING — it works everywhere." }
      ] },
      { h: "ORDER BY, LIMIT and dialect differences", blocks: [
        { code: `-- top 3 earners (id breaks the Ravi/Neha tie deterministically)
SELECT name, salary FROM employees ORDER BY salary DESC, id LIMIT 3;          -- Asha, Ravi, Neha

-- page 2 of size 3 (skip 2 rows, then take 3)
SELECT name, salary FROM employees ORDER BY salary DESC, id LIMIT 3 OFFSET 2; -- Neha, Karan, Priya`, lang: "sql" },
        { table: { head: ["Need", "MySQL 8", "PostgreSQL", "Other"], rows: [
          ["First n rows", "<code>LIMIT n</code> / <code>LIMIT off, n</code>", "<code>LIMIT n OFFSET off</code> or <code>FETCH FIRST n ROWS ONLY</code>", "SQL Server: <code>TOP n</code>; Oracle 12c+: <code>FETCH FIRST</code>"],
          ["Year of a date", "<code>YEAR(d)</code> or <code>EXTRACT(YEAR FROM d)</code>", "<code>EXTRACT(YEAR FROM d)</code>", "EXTRACT is portable"],
          ["Concatenate", "<code>CONCAT(a, b)</code> (<code>||</code> means OR!)", "<code>a || b</code> or <code>CONCAT</code>", "CONCAT works on both"],
          ["Case-insensitive match", "LIKE (default collation)", "<code>ILIKE</code>", ""],
          ["Integer division 7/2", "3.5000 (<code>DIV</code> for 3)", "3 (write <code>7.0/2</code>)", "Classic percentage bug in PostgreSQL"],
          ["NULLs in ASC sort", "first", "last (<code>NULLS FIRST/LAST</code>)", ""]
        ] } },
        { warn: "Without ORDER BY, row order is <b>not guaranteed</b> — not even insertion order. <code>LIMIT</code> without <code>ORDER BY</code> returns \"some\" rows." }
      ] }
    ],
    practice: [
      { q: "Sales employees (dept 2) earning at least 52000, highest salary first, ties by name.", a: "<code>SELECT name, salary FROM employees<br>WHERE dept_id = 2 AND salary &gt;= 52000<br>ORDER BY salary DESC, name;</code><br>→ Karan 60000, Arjun 52000, Priya 52000." },
      { q: "In one query return: total employees, employees with a department, number of distinct departments used.", a: "<code>SELECT COUNT(*), COUNT(dept_id), COUNT(DISTINCT dept_id) FROM employees;</code><br>→ 8, 7, 3 (Meera's NULL is skipped by the last two)." },
      { q: "Employees whose name has 'a' as the second letter.", a: "<code>SELECT name FROM employees WHERE name LIKE '_a%';</code><br>→ Ravi, Karan. (In PostgreSQL this is case-sensitive; in MySQL it would also match 'A'.)" },
      { q: "Employees hired in 2021 — write it so it would still be correct if hired_on were a DATETIME.", a: "<code>SELECT name FROM employees<br>WHERE hired_on &gt;= '2021-01-01' AND hired_on &lt; '2022-01-01';</code><br>→ Neha, Vikram." },
      { q: "Who has no manager? And how many employees have no department? (two queries)", a: "<code>SELECT name FROM employees WHERE manager_id IS NULL;</code> → Asha.<br><code>SELECT COUNT(*) - COUNT(dept_id) FROM employees;</code> → 1 (or <code>WHERE dept_id IS NULL</code> with COUNT(*))." },
      { q: "Number of hires per year, oldest year first (portable to MySQL and PostgreSQL).", a: "<code>SELECT EXTRACT(YEAR FROM hired_on) AS yr, COUNT(*) AS hires<br>FROM employees<br>GROUP BY EXTRACT(YEAR FROM hired_on)<br>ORDER BY yr;</code><br>→ 2019: 1, 2020: 2, 2021: 2, 2022: 1, 2023: 2." },
      { q: "How many employees fall in each salary band (High ≥ 75000, Mid ≥ 50000, else Low)?", a: "<code>SELECT CASE WHEN salary &gt;= 75000 THEN 'High' WHEN salary &gt;= 50000 THEN 'Mid' ELSE 'Low' END AS band,<br>COUNT(*) AS cnt<br>FROM employees<br>GROUP BY band;</code><br>→ High 3, Mid 3, Low 2. (Grouping by the alias works in MySQL and PostgreSQL; repeating the CASE works everywhere.)" },
      { q: "Departments (dept_id) whose average salary is above 60000.", a: "<code>SELECT dept_id, AVG(salary) FROM employees<br>GROUP BY dept_id HAVING AVG(salary) &gt; 60000;</code><br>→ only dept 1 (80000). Dept 2 is 54666.67. Putting <code>AVG(salary) &gt; 60000</code> in WHERE is an error." },
      { q: "Salary spread (max − min) per department, ignoring employees without a department.", a: "<code>SELECT dept_id, MAX(salary) - MIN(salary) AS spread<br>FROM employees WHERE dept_id IS NOT NULL<br>GROUP BY dept_id ORDER BY dept_id;</code><br>→ 1: 15000, 2: 8000, 3: 0." },
      { q: "Rows 3 to 5 of the salary leaderboard (highest first, ties by id).", a: "<code>SELECT name, salary FROM employees<br>ORDER BY salary DESC, id<br>LIMIT 3 OFFSET 2;</code><br>→ Neha 75000, Karan 60000, Priya 52000. Without the <code>id</code> tiebreak, Ravi/Neha and Priya/Arjun could swap between runs." }
    ],
    related: ["sql:null-handling-coalesce", "sql:count-star-vs-count-column", "sql:like-pattern-filter", "sql:count-per-group-having", "sql:find-duplicate-emails", "sql:string-functions-name-format", "sql:odd-even-rows", "sql:year-wise-count", "sql:hired-in-last-30-days", "dbms:where-vs-having", "dbms:group-by", "dbms:null-semantics", "dbms:sql-command-types"]
  });

  /* =====================================================================
     d10-ev  SQL Level 2: joins
     ===================================================================== */
  add({
    id: "sql-joins",
    subject: "sql",
    title: "SQL Level 2: JOINs, row counts, UNION & conditional aggregation",
    minutes: 80,
    crux: [
      "A join pairs each row of A with every row of B that satisfies ON. A key appearing <b>m</b> times in A and <b>n</b> times in B produces <b>m × n</b> rows.",
      "INNER = matches only. LEFT = all of A + matches (NULL-padded). RIGHT = mirror. FULL = matches + unmatched from both sides. CROSS = |A| × |B|, no condition.",
      "<b>NULL never equals NULL</b>, so NULL keys never match; they only survive as unmatched rows of an outer join.",
      "A WHERE condition on the right table's columns turns a LEFT JOIN back into an INNER JOIN — put such filters in ON.",
      "After a LEFT JOIN, count with <code>COUNT(right.id)</code>, not <code>COUNT(*)</code>, or empty groups show 1.",
      "UNION removes duplicates (extra sort/hash); UNION ALL keeps every row and is faster. MySQL has no FULL OUTER JOIN — emulate with LEFT JOIN + UNION ALL.",
      "Conditional aggregation — <code>SUM(CASE WHEN cond THEN 1 ELSE 0 END)</code> — computes several category counts in a single pass."
    ],
    sections: [
      { h: "Tables for this lesson", blocks: [
        { p: "Same schema as Level 1 (setup script is in that lesson). Joins use <code>employees.dept_id → departments.id</code>, <code>employees.manager_id → employees.id</code> and <code>orders.customer_id → customers.id</code>." },
        { h: "employees (8 rows)" }, EMP,
        { h: "departments (4 rows)" }, DEPT,
        { h: "customers (4 rows)" }, CUST,
        { h: "orders (7 rows)" }, ORD,
        SCHEMA_NOTE
      ] },
      { h: "Join types on real data", blocks: [
        { p: "Mentally, every join is: take all pairs (the cross product), keep the pairs where ON is TRUE, then — for outer joins — add back the rows that found no partner, padding the other side with NULL." },
        { code: `SELECT e.name AS employee, d.name AS dept
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;       -- 7 rows`, lang: "sql" },
        { table: { head: ["Join", "Rows", "What changes vs INNER"], rows: [
          ["<code>e INNER JOIN d</code>", "7", "Meera (NULL dept) and Marketing (no employees) both vanish"],
          ["<code>e LEFT JOIN d</code>", "8", "+ Meera with dept = NULL"],
          ["<code>e RIGHT JOIN d</code>", "8", "+ Marketing with employee = NULL"],
          ["<code>e FULL OUTER JOIN d</code>", "9", "+ Meera and + Marketing (PostgreSQL only)"],
          ["<code>e CROSS JOIN d</code>", "32", "8 × 4, every pairing"],
          ["<code>e JOIN employees m ON e.manager_id = m.id</code>", "7", "Self join; Asha has no manager so she drops out"]
        ] } },
        { code: `SELECT e.name AS employee, d.name AS dept
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id
ORDER BY e.id;`, lang: "sql", title: "LEFT JOIN — every employee survives" },
        { table: { head: ["employee", "dept"], rows: [["Asha", "Engineering"], ["Ravi", "Engineering"], ["Neha", "Engineering"], ["Karan", "Sales"], ["Priya", "Sales"], ["Vikram", "HR"], ["Meera", "NULL"], ["Arjun", "Sales"]] } },
        { p: "<code>RIGHT JOIN</code> is the same thing with the tables swapped; most people always write LEFT JOIN and put the \"keep all\" table first." }
      ] },
      { h: "Row-count reasoning (the interview favourite)", blocks: [
        { p: "Classic question: <i>A has x-values 1, 1, 2, 3, NULL; B has 1, 1, 1, 2, 4, NULL. How many rows does each join on A.x = B.x return?</i> Work key by key." },
        { svg: `<svg viewBox="0 0 720 280" width="720" class="dg">
  <text class="tx tx-b" x="155" y="14" text-anchor="middle" dominant-baseline="middle">A (5 rows)</text>
  <text class="tx tx-b" x="455" y="14" text-anchor="middle" dominant-baseline="middle">B (6 rows)</text>
  <line class="ln" x1="190" y1="44" x2="420" y2="44"/>
  <line class="ln" x1="190" y1="44" x2="420" y2="84"/>
  <line class="ln" x1="190" y1="44" x2="420" y2="124"/>
  <line class="ln" x1="190" y1="84" x2="420" y2="44"/>
  <line class="ln" x1="190" y1="84" x2="420" y2="84"/>
  <line class="ln" x1="190" y1="84" x2="420" y2="124"/>
  <line class="ln-a" x1="190" y1="124" x2="420" y2="164"/>
  <rect class="box-a" x="120" y="30" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="155" y="44" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-a" x="120" y="70" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="155" y="84" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-a" x="120" y="110" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="155" y="124" text-anchor="middle" dominant-baseline="middle">2</text>
  <rect class="box-r" x="120" y="150" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="155" y="164" text-anchor="middle" dominant-baseline="middle">3</text>
  <rect class="box-r" x="120" y="190" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="155" y="204" text-anchor="middle" dominant-baseline="middle">NULL</text>
  <rect class="box-a" x="420" y="30" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="455" y="44" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-a" x="420" y="70" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="455" y="84" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-a" x="420" y="110" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="455" y="124" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-a" x="420" y="150" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="455" y="164" text-anchor="middle" dominant-baseline="middle">2</text>
  <rect class="box-r" x="420" y="190" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="455" y="204" text-anchor="middle" dominant-baseline="middle">4</text>
  <rect class="box-r" x="420" y="230" width="70" height="28" rx="6"/>
  <text class="tx tx-b" x="455" y="244" text-anchor="middle" dominant-baseline="middle">NULL</text>
  <text class="tx" x="515" y="44" dominant-baseline="middle">key 1: 2 × 3 = 6</text>
  <text class="tx" x="515" y="70" dominant-baseline="middle">key 2: 1 × 1 = 1</text>
  <text class="tx tx-b" x="515" y="100" dominant-baseline="middle">INNER = 7</text>
  <text class="tx" x="515" y="128" dominant-baseline="middle">LEFT = 7 + 2 = 9</text>
  <text class="tx" x="515" y="154" dominant-baseline="middle">RIGHT = 7 + 2 = 9</text>
  <text class="tx" x="515" y="180" dominant-baseline="middle">FULL = 7 + 2 + 2 = 11</text>
  <text class="tx" x="515" y="206" dominant-baseline="middle">CROSS = 5 × 6 = 30</text>
  <text class="tx-m" x="20" y="272" dominant-baseline="middle">red = no partner. NULL does not match NULL, so both NULL rows are unmatched.</text>
</svg>`, caption: "Each line is one output row of the INNER join. Unmatched rows are added back by outer joins." },
        { table: { head: ["Key", "count in A", "count in B", "INNER rows", "Extra in LEFT", "Extra in RIGHT"], rows: [
          ["1", "2", "3", "6", "0", "0"],
          ["2", "1", "1", "1", "0", "0"],
          ["3", "1", "0", "0", "1", "0"],
          ["4", "0", "1", "0", "0", "1"],
          ["NULL", "1", "1", "0 (never matches)", "1", "1"],
          ["<b>Total</b>", "5", "6", "<b>7</b>", "LEFT = <b>9</b>", "RIGHT = <b>9</b>"]
        ] } },
        { ul: [
          "INNER = Σ over keys of (count in A × count in B). Bounds: 0 ≤ INNER ≤ |A| × |B|.",
          "LEFT = INNER + unmatched rows of A, so LEFT ≥ |A| always. RIGHT ≥ |B|. FULL = INNER + unmatched A + unmatched B.",
          "Joining a child to its parent's <b>primary key</b> (orders → customers) can never multiply rows: each order finds at most one customer. So <code>orders LEFT JOIN customers</code> = exactly 7 rows.",
          "Going the other way (customers → orders) multiplies: Amit 3 + Sara 2 + Zoya 2 + Dev 1 (NULL-padded) = <b>8 rows</b>.",
          "If both sides have duplicates of a key (many-to-many), totals explode — the usual cause of \"my SUM doubled after adding a join\"."
        ] },
        { warn: "Summing after a fan-out join double counts. If you join customers → orders → order items and then <code>SUM(o.amount)</code>, each order's amount is repeated once per item. Aggregate each child table in a subquery first, then join the results." }
      ] },
      { h: "Self joins and 3-table joins", blocks: [
        { p: "A self join uses the same table twice under different aliases — one copy plays \"employee\", the other \"manager\". Chaining a third table is just another JOIN; each ON connects the new table to something already in the FROM." },
        { code: `SELECT e.name AS employee,
       d.name AS dept,
       m.name AS manager
FROM employees e
LEFT JOIN departments d ON d.id = e.dept_id      -- keep Meera (no dept)
LEFT JOIN employees  m ON m.id = e.manager_id    -- keep Asha (no manager)
ORDER BY e.id;`, lang: "sql", title: "Employee, department and manager in one row" },
        { table: { head: ["employee", "dept", "manager"], rows: [["Asha", "Engineering", "NULL"], ["Ravi", "Engineering", "Asha"], ["Neha", "Engineering", "Asha"], ["Karan", "Sales", "Asha"], ["Priya", "Sales", "Karan"], ["Vikram", "HR", "Asha"], ["Meera", "NULL", "Asha"], ["Arjun", "Sales", "Karan"]] } },
        { p: "Row count: e has 8 rows; each LEFT JOIN to a primary key adds at most one match per row and never removes rows → 8. If either join were INNER, Meera (first) or Asha (second) would disappear → 7." },
        { warn: "In a chain <code>A LEFT JOIN B … JOIN C ON C.x = B.y</code>, the final INNER JOIN discards the NULL-padded rows that the LEFT JOIN kept. Once you start a LEFT chain, keep later joins LEFT too (or join C to A)." },
        { code: `-- all pairs of colleagues in the same department, each pair once
SELECT a.name, b.name
FROM employees a
JOIN employees b ON a.dept_id = b.dept_id AND a.id < b.id;
-- (Asha,Ravi) (Asha,Neha) (Ravi,Neha) (Karan,Priya) (Karan,Arjun) (Priya,Arjun) = 6 rows`, lang: "sql", title: "Self join for pairs" },
        { p: "Why 6: Engineering has 3 people → 3·2/2 = 3 pairs; Sales 3 → 3; HR 1 → 0; Meera's NULL dept matches nobody. With <code>&lt;&gt;</code> instead of <code>&lt;</code> you'd get 12 (each pair twice)." }
      ] },
      { h: "LEFT JOIN traps: ON vs WHERE, COUNT, anti-join", blocks: [
        { code: `-- A: filter in ON -> filter applies while matching; Dev is still kept (6 rows)
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'DELIVERED';

-- B: filter in WHERE -> Dev's NULL status fails the test; LEFT became INNER (5 rows)
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'DELIVERED';`, lang: "sql" },
        { table: { head: ["Query A (ON)", "Query B (WHERE)"], rows: [["Amit 101", "Amit 101"], ["Amit 105", "Amit 105"], ["Sara 103", "Sara 103"], ["Zoya 104", "Zoya 104"], ["Zoya 107", "Zoya 107"], ["Dev NULL", "—"]] } },
        { code: `SELECT d.name, COUNT(e.id) AS headcount      -- COUNT(*) would give Marketing 1
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.id, d.name;          -- Engineering 3, Sales 3, HR 1, Marketing 0

-- anti-join: rows of the left table with NO match
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;             -- Dev`, lang: "sql" },
        { tip: "For the anti-join, test a column that can never be NULL in a real match — the right table's primary key (<code>o.id</code>) — not a nullable column like <code>o.status</code>." }
      ] },
      { h: "UNION vs UNION ALL (and FULL JOIN in MySQL)", blocks: [
        { code: `-- customers who ordered in January, combined with those who ordered in March
SELECT customer_id FROM orders WHERE order_date >= '2024-01-01' AND order_date < '2024-02-01'
UNION                         -- -> 1, 2          (duplicates removed)
SELECT customer_id FROM orders WHERE order_date >= '2024-03-01' AND order_date < '2024-04-01';

-- same with UNION ALL        -- -> 1, 1, 1, 2    (Jan: 1,1   Mar: 1,2)`, lang: "sql" },
        { table: { head: ["", "UNION", "UNION ALL"], rows: [
          ["Duplicates", "Removed (across and within both inputs)", "Kept"],
          ["Cost", "Extra sort or hash step", "Just appends"],
          ["Use when", "You really need a set", "Default choice; inputs are disjoint anyway"]
        ] } },
        { ul: [
          "Both SELECTs need the same number of columns with compatible types; column names come from the first SELECT.",
          "One <code>ORDER BY</code> at the very end sorts the combined result.",
          "UNION stacks rows vertically; JOIN widens rows horizontally."
        ] },
        { code: `-- PostgreSQL: native
SELECT e.name AS employee, d.name AS dept
FROM employees e FULL OUTER JOIN departments d ON e.dept_id = d.id;   -- 9 rows

-- MySQL 8: no FULL OUTER JOIN -> LEFT JOIN + the right-only rows
SELECT e.name AS employee, d.name AS dept
FROM employees e LEFT JOIN departments d ON e.dept_id = d.id          -- 8 rows
UNION ALL
SELECT e.name, d.name
FROM employees e RIGHT JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL;                                                   -- + Marketing = 9`, lang: "sql", title: "FULL OUTER JOIN emulation" },
        { warn: "The common emulation <code>LEFT JOIN … UNION … RIGHT JOIN</code> (plain UNION) works only if the result has no genuine duplicate rows — UNION would merge them. The UNION ALL + <code>WHERE left.key IS NULL</code> form is always correct." }
      ] },
      { h: "Aggregates with CASE (conditional aggregation)", blocks: [
        { code: `SELECT c.name,
       COUNT(o.id)                                                  AS orders,
       SUM(CASE WHEN o.status = 'DELIVERED' THEN 1 ELSE 0 END)      AS delivered,
       SUM(CASE WHEN o.status = 'DELIVERED' THEN o.amount ELSE 0 END) AS delivered_amt,
       COUNT(CASE WHEN o.status <> 'DELIVERED' THEN 1 END)          AS problems
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;`, lang: "sql" },
        { table: { head: ["name", "orders", "delivered", "delivered_amt", "problems"], rows: [["Amit", "3", "2", "1400", "1"], ["Sara", "2", "1", "1200", "1"], ["Zoya", "2", "2", "1800", "0"], ["Dev", "0", "0", "0", "0"]] } },
        { ul: [
          "<code>COUNT(CASE WHEN … THEN 1 END)</code> works because a CASE without ELSE yields NULL, and COUNT skips NULLs.",
          "Dev's row: the only o.status is NULL, so every CASE goes to ELSE 0 (or NULL for COUNT) — no special handling needed.",
          "Same trick pivots rows into columns: one <code>SUM(CASE …)</code> per category.",
          "PostgreSQL also has <code>COUNT(*) FILTER (WHERE status = 'DELIVERED')</code>; it is not available in MySQL, so CASE is the portable form."
        ] },
        { code: `SELECT d.name,
       SUM(CASE WHEN e.salary >= 60000 THEN 1 ELSE 0 END) AS senior,
       SUM(CASE WHEN e.salary <  60000 THEN 1 ELSE 0 END) AS junior
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.id, d.name
ORDER BY d.id;
-- Engineering 3 0 | Sales 1 2 | HR 0 1 | Marketing 0 0`, lang: "sql", title: "Pivot: headcount by band per department" }
      ] }
    ],
    practice: [
      { q: "Every employee with their department name; show 'Unassigned' when there is none.", a: "<code>SELECT e.name, COALESCE(d.name, 'Unassigned') AS dept<br>FROM employees e LEFT JOIN departments d ON d.id = e.dept_id;</code><br>→ 8 rows; Meera → Unassigned." },
      { q: "Departments that have no employees.", a: "<code>SELECT d.name FROM departments d<br>LEFT JOIN employees e ON e.dept_id = d.id<br>WHERE e.id IS NULL;</code><br>→ Marketing." },
      { q: "Headcount per department including empty ones.", a: "<code>SELECT d.name, COUNT(e.id) FROM departments d<br>LEFT JOIN employees e ON e.dept_id = d.id<br>GROUP BY d.id, d.name;</code><br>→ Engineering 3, Sales 3, HR 1, Marketing 0 (COUNT(*) would wrongly give Marketing 1)." },
      { q: "Each employee next to their manager's name, keeping the CEO. How many rows?", a: "<code>SELECT e.name, m.name AS manager FROM employees e<br>LEFT JOIN employees m ON m.id = e.manager_id;</code><br>→ 8 rows (Asha's manager is NULL). An INNER self join gives 7." },
      { q: "Number of direct reports per manager.", a: "<code>SELECT m.name, COUNT(*) AS reports<br>FROM employees e JOIN employees m ON m.id = e.manager_id<br>GROUP BY m.id, m.name;</code><br>→ Asha 5 (Ravi, Neha, Karan, Vikram, Meera), Karan 2 (Priya, Arjun)." },
      { q: "Employees whose manager works in a different department.", a: "<code>SELECT e.name FROM employees e<br>JOIN employees m ON m.id = e.manager_id<br>WHERE e.dept_id &lt;&gt; m.dept_id;</code><br>→ Karan, Vikram. Meera is <i>not</i> returned because NULL &lt;&gt; 1 is UNKNOWN. To include her use <code>e.dept_id IS DISTINCT FROM m.dept_id</code> (PostgreSQL) or <code>NOT (e.dept_id &lt;=&gt; m.dept_id)</code> (MySQL null-safe equals)." },
      { q: "Customers who never placed an order.", a: "<code>SELECT c.name FROM customers c<br>LEFT JOIN orders o ON o.customer_id = c.id<br>WHERE o.id IS NULL;</code><br>→ Dev." },
      { q: "Order count and total amount per city, including cities whose customers never ordered.", a: "<code>SELECT c.city, COUNT(o.id) AS orders, COALESCE(SUM(o.amount), 0) AS total<br>FROM customers c LEFT JOIN orders o ON o.customer_id = c.id<br>GROUP BY c.city;</code><br>→ Delhi 3 / 1700 (Amit 3 orders + Dev 0), Mumbai 2 / 1600, Pune 2 / 1800." },
      { q: "Without running: how many rows do (a) <code>orders LEFT JOIN customers</code>, (b) <code>customers LEFT JOIN orders</code>, (c) <code>customers CROSS JOIN departments</code> return?", a: "(a) 7 — each order matches exactly one customer (FK → PK), nothing multiplies.<br>(b) 8 — Amit 3 + Sara 2 + Zoya 2 + Dev 1 NULL-padded row.<br>(c) 4 × 4 = 16." },
      { q: "One list of all customer ids who ordered in January or March, once each; then the same keeping duplicates. Row counts?", a: "<code>SELECT customer_id FROM orders WHERE order_date &lt; '2024-02-01'<br>UNION<br>SELECT customer_id FROM orders WHERE order_date &gt;= '2024-03-01' AND order_date &lt; '2024-04-01';</code><br>→ UNION: 2 rows (1, 2). UNION ALL: 4 rows (1, 1, 1, 2)." }
    ],
    related: ["dbms:join-types", "dbms:self-join", "dbms:union-vs-union-all", "sql:left-join-on-vs-where", "sql:customers-who-never-ordered", "sql:departments-with-no-employees", "sql:employee-with-manager-name", "sql:employees-earning-more-than-manager", "sql:self-join-pairs", "sql:cross-join-missing-combinations", "sql:managers-with-five-reports", "sql:department-highest-total-salary", "sql:pivot-rows-to-columns", "sql:percentage-of-total", "sql:update-with-join"]
  });

  /* =====================================================================
     d13-ev  SQL Level 3: subqueries, EXISTS, CTEs, Nth highest
     ===================================================================== */
  add({
    id: "sql-subqueries-ctes",
    subject: "sql",
    title: "SQL Level 3: subqueries, correlated, IN vs EXISTS, CTEs, Nth highest",
    minutes: 85,
    crux: [
      "A subquery is a query inside another. By shape: <b>scalar</b> (one value), <b>list</b> (one column, used with IN/ANY/ALL), <b>table</b> (a derived table in FROM — always give it an alias).",
      "A <b>correlated</b> subquery references the outer row, so it is logically re-evaluated once per outer row (e.g. \"earning more than <i>their</i> department's average\").",
      "<code>EXISTS</code> asks \"is there at least one matching row?\" and stops at the first match; <code>IN</code> compares a value with a list. For positive checks both give the same answer.",
      "<b>NOT IN + NULL trap:</b> if the subquery returns even one NULL, <code>x NOT IN (…)</code> is never TRUE → zero rows. Use <code>NOT EXISTS</code> (or filter the NULLs out).",
      "A CTE (<code>WITH name AS (…)</code>) is a named, readable subquery you can reference several times; <code>WITH RECURSIVE</code> walks hierarchies. MySQL needs 8.0+.",
      "Nth highest salary: (1) <code>DISTINCT … ORDER BY … LIMIT 1 OFFSET N-1</code>, (2) correlated <code>COUNT(DISTINCT)</code> = N-1, (3) <code>DENSE_RANK() = N</code>. Always handle ties and \"no Nth value → NULL\"."
    ],
    sections: [
      { h: "Tables used here", blocks: [
        { p: "Same schema as the other SQL lessons (setup script in Level 1)." },
        EMP, DEPT, CUST, ORD, SCHEMA_NOTE
      ] },
      { h: "Three shapes of subquery", blocks: [
        { code: `-- 1) scalar: returns exactly one value
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);   -- avg = 61125 -> Asha, Ravi, Neha

-- 2) list: one column, many rows
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE amount >= 1000);   -- Sara, Zoya

-- 3) table (derived table): must have an alias
SELECT t.dept_id, t.avg_sal
FROM (SELECT dept_id, AVG(salary) AS avg_sal
      FROM employees GROUP BY dept_id) AS t
WHERE t.avg_sal > 50000;                               -- dept 1 (80000), dept 2 (54666.67)`, lang: "sql" },
        { ul: [
          "A scalar subquery that returns 2+ rows is a runtime error (\"subquery returns more than one row\"). Returning 0 rows gives NULL.",
          "A derived table needs an alias in MySQL (and in PostgreSQL before v16) — just always write <code>AS t</code>.",
          "<code>x &gt; ALL (subquery)</code> = greater than every value (the max); <code>x &gt; ANY (subquery)</code> = greater than at least one (the min). E.g. <code>salary &gt; ALL (SELECT salary FROM employees WHERE dept_id = 2)</code> → above 60000 → Asha, Ravi, Neha.",
          "Row comparison works on both databases: <code>WHERE (dept_id, salary) IN (SELECT dept_id, MAX(salary) FROM employees GROUP BY dept_id)</code> → Asha, Karan, Vikram."
        ] },
        { warn: "MySQL does not support <code>LIMIT</code> inside an <code>IN/ALL/ANY/SOME</code> subquery (\"This version of MySQL doesn't yet support 'LIMIT &amp; IN/ALL/ANY/SOME subquery'\"). Wrap it in a derived table or use a join instead. PostgreSQL allows it." }
      ] },
      { h: "Correlated subqueries", blocks: [
        { p: "The inner query uses a column of the outer query (<code>e.dept_id</code> below). Read it as: \"for each employee e, compute the average of e's department, then compare\"." },
        { code: `SELECT e.name, e.dept_id, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(e2.salary)
                  FROM employees e2
                  WHERE e2.dept_id = e.dept_id);`, lang: "sql", title: "Earning more than their department's average" },
        { table: { head: ["outer row", "inner AVG for its dept", "salary > avg?", "kept"], rows: [
          ["Asha (1, 90000)", "80000", "TRUE", "yes"],
          ["Ravi (1, 75000)", "80000", "FALSE", ""],
          ["Neha (1, 75000)", "80000", "FALSE", ""],
          ["Karan (2, 60000)", "54666.67", "TRUE", "yes"],
          ["Priya (2, 52000)", "54666.67", "FALSE", ""],
          ["Vikram (3, 45000)", "45000", "FALSE (equal)", ""],
          ["Meera (NULL, 40000)", "NULL (<code>e2.dept_id = NULL</code> matches nothing)", "UNKNOWN", ""],
          ["Arjun (2, 52000)", "54666.67", "FALSE", ""]
        ] } },
        { p: "Result: <b>Asha, Karan</b>. The same answer with a join to a pre-aggregated table, which evaluates each department's average once:" },
        { code: `SELECT e.name, e.dept_id, e.salary
FROM employees e
JOIN (SELECT dept_id, AVG(salary) AS avg_sal
      FROM employees GROUP BY dept_id) da ON da.dept_id = e.dept_id
WHERE e.salary > da.avg_sal;`, lang: "sql" },
        { code: `-- highest-paid employee(s) of each department, ties included
SELECT e.name, e.dept_id, e.salary
FROM employees e
WHERE e.salary = (SELECT MAX(e2.salary) FROM employees e2 WHERE e2.dept_id = e.dept_id);
-- Asha (1, 90000), Karan (2, 60000), Vikram (3, 45000)

-- correlated subquery in SELECT: last order date per customer
SELECT c.name,
       (SELECT MAX(o.order_date) FROM orders o WHERE o.customer_id = c.id) AS last_order
FROM customers c;
-- Amit 2024-03-02, Sara 2024-03-18, Zoya 2024-04-09, Dev NULL`, lang: "sql" },
        { tip: "Interviewers like: \"Logically a correlated subquery runs once per outer row — O(n·m) in the naive case — but modern optimizers often decorrelate it into a join. If it's slow, rewrite as a join with a GROUP BY derived table, or a window function.\"" }
      ] },
      { h: "IN vs EXISTS, and the NOT IN + NULL trap", blocks: [
        { code: `-- customers who have ordered: both return Amit, Sara, Zoya
SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders);

SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`, lang: "sql" },
        { p: "Now the trap. \"Departments with no employees\" looks easy:" },
        { code: `SELECT name FROM departments
WHERE id NOT IN (SELECT dept_id FROM employees);      -- returns 0 rows (!)

SELECT name FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);  -- Marketing`, lang: "sql" },
        { p: "The subquery returns <code>1, 1, 1, 2, 2, 3, NULL, 2</code> — Meera's NULL is in the list. For Marketing (id 4): <code>4 NOT IN (1, 2, 3, NULL)</code> means <code>4&lt;&gt;1 AND 4&lt;&gt;2 AND 4&lt;&gt;3 AND 4&lt;&gt;NULL</code> = TRUE AND TRUE AND TRUE AND UNKNOWN = <b>UNKNOWN</b>, so the row is dropped. The same happens for every department." },
        { table: { head: ["Form", "Positive check (has match)", "Negative check (no match)", "NULLs in the subquery"], rows: [
          ["<code>IN</code> / <code>NOT IN</code>", "Fine", "Dangerous", "NOT IN returns nothing if any NULL"],
          ["<code>EXISTS</code> / <code>NOT EXISTS</code>", "Fine; stops at first match", "<b>Safe — preferred</b>", "Ignored (NULL = x just isn't a match)"],
          ["<code>LEFT JOIN … WHERE right.pk IS NULL</code>", "—", "Safe", "Ignored"]
        ] } },
        { code: `-- Fix 1 (preferred)
... WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id)
-- Fix 2: remove NULLs from the list
... WHERE id NOT IN (SELECT dept_id FROM employees WHERE dept_id IS NOT NULL)
-- Fix 3: anti-join
SELECT d.name FROM departments d LEFT JOIN employees e ON e.dept_id = d.id WHERE e.id IS NULL;`, lang: "sql" },
        { warn: "Our data has the trap a second time: \"employees who manage nobody\" via <code>WHERE id NOT IN (SELECT manager_id FROM employees)</code> returns <b>0 rows</b> because Asha's manager_id is NULL. With <code>NOT EXISTS (SELECT 1 FROM employees x WHERE x.manager_id = e.id)</code> you correctly get Ravi, Neha, Priya, Vikram, Meera, Arjun." },
        { tip: "Performance talk: modern optimizers (PostgreSQL, MySQL 8) turn both IN and EXISTS into semi-joins, so for positive checks they usually perform the same. Choose NOT EXISTS for negative checks because of NULL semantics, not speed." }
      ] },
      { h: "CTEs: WITH and WITH RECURSIVE", blocks: [
        { code: `WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept_id
)
SELECT e.name, e.salary, ROUND(da.avg_sal, 2) AS dept_avg,
       ROUND(e.salary - da.avg_sal, 2)          AS diff
FROM employees e
JOIN dept_avg da ON da.dept_id = e.dept_id
ORDER BY e.id;`, lang: "sql", title: "CTE: difference from department average" },
        { table: { head: ["name", "salary", "dept_avg", "diff"], rows: [["Asha", "90000", "80000.00", "10000.00"], ["Ravi", "75000", "80000.00", "-5000.00"], ["Neha", "75000", "80000.00", "-5000.00"], ["Karan", "60000", "54666.67", "5333.33"], ["Priya", "52000", "54666.67", "-2666.67"], ["Vikram", "45000", "45000.00", "0.00"], ["Arjun", "52000", "54666.67", "-2666.67"]] } },
        { p: "Meera is missing: the join <code>da.dept_id = e.dept_id</code> compares NULL with NULL." },
        { code: `-- a CTE can be referenced more than once
WITH dept_total AS (
  SELECT dept_id, SUM(salary) AS total
  FROM employees WHERE dept_id IS NOT NULL
  GROUP BY dept_id
)
SELECT d.name, t.total
FROM dept_total t JOIN departments d ON d.id = t.dept_id
WHERE t.total = (SELECT MAX(total) FROM dept_total);    -- Engineering 240000`, lang: "sql" },
        { code: `WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 0 AS lvl          -- anchor: the root
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.lvl + 1   -- step: direct reports of the previous level
  FROM employees e JOIN chain c ON e.manager_id = c.id
)
SELECT name, lvl FROM chain ORDER BY lvl, id;
-- Asha 0 | Ravi 1, Neha 1, Karan 1, Vikram 1, Meera 1 | Priya 2, Arjun 2`, lang: "sql", title: "Recursive CTE: level of each employee in the org chart" },
        { ul: [
          "Several CTEs: <code>WITH a AS (…), b AS (SELECT … FROM a) SELECT …</code> — each may use the ones before it.",
          "A CTE lives only for that one statement. For reuse across queries, create a VIEW.",
          "Recursion stops when a step returns no new rows. MySQL caps depth at <code>cte_max_recursion_depth</code> (default 1000); a cycle in the data loops until that limit.",
          "PostgreSQL 12+ may inline a CTE like a subquery; <code>AS MATERIALIZED</code> forces it to compute once."
        ] }
      ] },
      { h: "Nth highest salary — three ways (+ one)", blocks: [
        { p: "Distinct salaries in descending order: 90000, 75000, 60000, 52000, 45000, 40000. So the 2nd highest is <b>75000</b> (not the second row, which is also 75000 but a tie), and the 3rd highest is <b>60000</b>. Examples use N = 3." },
        { code: [
          { lang: "sql", src: `-- Way 1: DISTINCT + LIMIT/OFFSET (skip N-1 values, take 1)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;                  -- 60000

-- return NULL (not "no rows") when there is no Nth salary:
SELECT (SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC LIMIT 1 OFFSET 2) AS third_highest;` },
          { lang: "sql", src: `-- Way 2: correlated subquery — the Nth highest has exactly N-1 distinct salaries above it
SELECT DISTINCT e1.salary
FROM employees e1
WHERE 2 = (SELECT COUNT(DISTINCT e2.salary)
           FROM employees e2
           WHERE e2.salary > e1.salary);      -- 60000
-- 60000 has {90000, 75000} above it -> count 2 = N-1` },
          { lang: "sql", src: `-- Way 3: DENSE_RANK window function (MySQL 8+, PostgreSQL)
WITH ranked AS (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
  FROM employees
)
SELECT DISTINCT salary FROM ranked WHERE dr = 3;   -- 60000
-- add PARTITION BY dept_id for "Nth highest per department"` },
          { lang: "sql", src: `-- Bonus (2nd highest only): max of everything below the max
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);   -- 75000, NULL if none` }
        ], title: "Nth highest salary (N = 3)" },
        { table: { head: ["Way", "Ties", "Returns NULL if no Nth?", "Generalises to per-group", "Cost"], rows: [
          ["LIMIT/OFFSET", "Handled by DISTINCT", "Only if wrapped as scalar subquery", "No", "One sort"],
          ["Correlated COUNT", "Handled by COUNT(DISTINCT)", "No (empty result)", "Yes (add dept condition)", "O(n²) naive"],
          ["DENSE_RANK", "Handled (dense ranks)", "No (empty result)", "<b>Yes — PARTITION BY</b>", "One sort per partition"],
          ["MAX &lt; MAX", "Handled", "Yes (MAX of empty = NULL)", "Only N = 2", "Two scans"]
        ] } },
        { warn: "Using <code>ROW_NUMBER</code> or <code>RANK</code> instead of <code>DENSE_RANK</code> breaks with ties: ROW_NUMBER = 3 gives Neha (75000), RANK = 3 doesn't exist (ranks go 1, 2, 2, 4). Also, <code>LIMIT 1 OFFSET N-1</code> without DISTINCT returns 75000 for N = 3." },
        { warn: "In a MySQL stored function (LeetCode 177) LIMIT accepts a variable but not an expression: write <code>SET N = N - 1;</code> first, then <code>LIMIT 1 OFFSET N</code>." }
      ] }
    ],
    practice: [
      { q: "Employees earning more than the company average.", a: "<code>SELECT name, salary FROM employees<br>WHERE salary &gt; (SELECT AVG(salary) FROM employees);</code><br>→ average 61125 → Asha, Ravi, Neha (Karan's 60000 is just below)." },
      { q: "Highest-paid employee(s) in each department, including ties, with a correlated subquery.", a: "<code>SELECT e.name, e.dept_id, e.salary FROM employees e<br>WHERE e.salary = (SELECT MAX(e2.salary) FROM employees e2 WHERE e2.dept_id = e.dept_id);</code><br>→ Asha (1), Karan (2), Vikram (3). Meera is excluded because her correlated MAX is over no rows → NULL." },
      { q: "Customers who have at least one order of 1000 or more — use EXISTS.", a: "<code>SELECT c.name FROM customers c<br>WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.amount &gt;= 1000);</code><br>→ Sara (1200), Zoya (1100)." },
      { q: "Explain why <code>SELECT name FROM departments WHERE id NOT IN (SELECT dept_id FROM employees)</code> returns nothing, and fix it.", a: "The subquery contains Meera's NULL, so <code>id NOT IN (…, NULL)</code> is UNKNOWN for every row. Fix: <code>WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id)</code> → Marketing." },
      { q: "Employees who manage nobody.", a: "<code>SELECT e.name FROM employees e<br>WHERE NOT EXISTS (SELECT 1 FROM employees x WHERE x.manager_id = e.id);</code><br>→ Ravi, Neha, Priya, Vikram, Meera, Arjun. (NOT IN returns 0 rows here because Asha's manager_id is NULL.)" },
      { q: "Department with the highest total salary, using a CTE.", a: "<code>WITH t AS (SELECT dept_id, SUM(salary) AS total FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id)<br>SELECT d.name, t.total FROM t JOIN departments d ON d.id = t.dept_id<br>WHERE t.total = (SELECT MAX(total) FROM t);</code><br>→ Engineering 240000 (Sales 164000, HR 45000)." },
      { q: "Employees paid more than every Sales (dept 2) employee.", a: "<code>SELECT name FROM employees<br>WHERE salary &gt; ALL (SELECT salary FROM employees WHERE dept_id = 2);</code><br>→ must beat 60000 → Asha, Ravi, Neha. (Equivalent: <code>salary &gt; (SELECT MAX(salary) … )</code>.)" },
      { q: "2nd highest distinct salary, returning NULL if it doesn't exist — two different ways.", a: "<code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees);</code><br><code>SELECT (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;</code><br>→ both 75000. If all salaries were equal, both return NULL." }
    ],
    related: ["dbms:subquery-vs-join", "dbms:correlated-subquery", "dbms:nth-highest-salary", "dbms:views", "dbms:null-semantics", "sql:second-highest-salary", "sql:nth-highest-salary", "sql:not-in-null-trap", "sql:above-department-average", "sql:highest-salary-per-department", "sql:customers-bought-all-products", "sql:difference-from-department-average", "sql:recursive-cte-org-hierarchy", "sql:customers-who-never-ordered", "sql:department-highest-total-salary"]
  });

  /* =====================================================================
     d18-ev  Window functions intro
     ===================================================================== */
  add({
    id: "sql-window-intro",
    subject: "sql",
    title: "Window functions I: ROW_NUMBER, RANK, DENSE_RANK & top-N per group",
    minutes: 45,
    crux: [
      "A window function computes a value from a set of related rows but, unlike GROUP BY, <b>keeps every row</b>.",
      "Syntax: <code>func() OVER (PARTITION BY g ORDER BY x)</code>. PARTITION BY = restart per group (optional); ORDER BY = order inside each partition.",
      "On salaries 90, 75, 75, 60: <b>ROW_NUMBER</b> 1, 2, 3, 4 (always unique) · <b>RANK</b> 1, 2, 2, 4 (gaps after ties) · <b>DENSE_RANK</b> 1, 2, 2, 3 (no gaps).",
      "Windows are computed in the SELECT step — after WHERE, GROUP BY and HAVING — so you cannot filter on them in WHERE. Wrap in a CTE/subquery and filter outside.",
      "Top-N per group = rank in a CTE with <code>PARTITION BY group</code>, then <code>WHERE rnk &lt;= N</code>. ROW_NUMBER → exactly N rows; DENSE_RANK → all tied rows.",
      "Give ROW_NUMBER a unique tiebreaker (e.g. <code>ORDER BY salary DESC, id</code>) or its numbering among ties can change between runs.",
      "Supported in MySQL 8.0+ and PostgreSQL. MySQL 5.7 has no window functions."
    ],
    sections: [
      { h: "Tables used here", blocks: [
        { p: "Same employees table as the other SQL lessons. Remember the ties: Ravi = Neha = 75000 and Priya = Arjun = 52000." },
        EMP
      ] },
      { h: "GROUP BY collapses, a window keeps rows", blocks: [
        { svg: `<svg viewBox="0 0 720 190" width="720" class="dg">
  <text class="tx tx-b" x="175" y="14" text-anchor="middle" dominant-baseline="middle">GROUP BY dept_id</text>
  <text class="tx tx-b" x="545" y="14" text-anchor="middle" dominant-baseline="middle">AVG(salary) OVER (PARTITION BY dept_id)</text>
  <rect class="box" x="20" y="34" width="130" height="26" rx="6"/>
  <text class="tx" x="85" y="47" text-anchor="middle" dominant-baseline="middle">Asha 90000</text>
  <rect class="box" x="20" y="66" width="130" height="26" rx="6"/>
  <text class="tx" x="85" y="79" text-anchor="middle" dominant-baseline="middle">Ravi 75000</text>
  <rect class="box" x="20" y="98" width="130" height="26" rx="6"/>
  <text class="tx" x="85" y="111" text-anchor="middle" dominant-baseline="middle">Neha 75000</text>
  <line class="ln" x1="151" y1="47" x2="198" y2="77" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="151" y1="79" x2="198" y2="79" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="151" y1="111" x2="198" y2="81" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="200" y="66" width="130" height="26" rx="6"/>
  <text class="tx tx-b" x="265" y="79" text-anchor="middle" dominant-baseline="middle">dept 1 · 80000</text>
  <rect class="box" x="390" y="34" width="120" height="26" rx="6"/>
  <text class="tx" x="450" y="47" text-anchor="middle" dominant-baseline="middle">Asha 90000</text>
  <rect class="box" x="390" y="66" width="120" height="26" rx="6"/>
  <text class="tx" x="450" y="79" text-anchor="middle" dominant-baseline="middle">Ravi 75000</text>
  <rect class="box" x="390" y="98" width="120" height="26" rx="6"/>
  <text class="tx" x="450" y="111" text-anchor="middle" dominant-baseline="middle">Neha 75000</text>
  <line class="ln-a" x1="511" y1="47" x2="548" y2="47" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="511" y1="79" x2="548" y2="79" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="511" y1="111" x2="548" y2="111" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="550" y="34" width="160" height="26" rx="6"/>
  <text class="tx" x="630" y="47" text-anchor="middle" dominant-baseline="middle">Asha 90000 | 80000</text>
  <rect class="box-a" x="550" y="66" width="160" height="26" rx="6"/>
  <text class="tx" x="630" y="79" text-anchor="middle" dominant-baseline="middle">Ravi 75000 | 80000</text>
  <rect class="box-a" x="550" y="98" width="160" height="26" rx="6"/>
  <text class="tx" x="630" y="111" text-anchor="middle" dominant-baseline="middle">Neha 75000 | 80000</text>
  <text class="tx-m" x="175" y="150" text-anchor="middle" dominant-baseline="middle">3 rows in, 1 row out: names are gone</text>
  <text class="tx-m" x="545" y="150" text-anchor="middle" dominant-baseline="middle">3 rows in, 3 rows out: each row gets the dept avg</text>
</svg>`, caption: "Engineering (dept 1) under GROUP BY versus a window partition." },
        { code: `SELECT name, dept_id, salary,
       ROUND(AVG(salary) OVER (PARTITION BY dept_id), 2) AS dept_avg,
       COUNT(*)     OVER (PARTITION BY dept_id) AS dept_size,
       ROUND(100.0 * salary / SUM(salary) OVER (), 2) AS pct_of_payroll   -- OVER () = whole result
FROM employees
WHERE dept_id IS NOT NULL
ORDER BY dept_id, salary DESC, id;`, lang: "sql" },
        { table: { head: ["name", "dept_id", "salary", "dept_avg", "dept_size", "pct_of_payroll"], rows: [
          ["Asha", "1", "90000", "80000.00", "3", "20.04"],
          ["Ravi", "1", "75000", "80000.00", "3", "16.70"],
          ["Neha", "1", "75000", "80000.00", "3", "16.70"],
          ["Karan", "2", "60000", "54666.67", "3", "13.36"],
          ["Priya", "2", "52000", "54666.67", "3", "11.58"],
          ["Arjun", "2", "52000", "54666.67", "3", "11.58"],
          ["Vikram", "3", "45000", "45000.00", "1", "10.02"]
        ] } },
        { p: "<code>OVER ()</code> sees the rows that survived WHERE, so the payroll here is 489000 − Meera's 40000 = <b>449000</b>: Asha = 90000 / 449000 = 20.04%. Windows run after WHERE — remove the WHERE and every percentage changes." }
      ] },
      { h: "ROW_NUMBER vs RANK vs DENSE_RANK", blocks: [
        { code: `SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC, id) AS rn,
       RANK()       OVER (ORDER BY salary DESC)     AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC)     AS drnk
FROM employees
ORDER BY salary DESC, id;`, lang: "sql" },
        { table: { head: ["name", "salary", "rn", "rnk", "drnk"], rows: [
          ["Asha", "90000", "1", "1", "1"],
          ["Ravi", "75000", "2", "2", "2"],
          ["Neha", "75000", "3", "2", "2"],
          ["Karan", "60000", "4", "<b>4</b>", "<b>3</b>"],
          ["Priya", "52000", "5", "5", "4"],
          ["Arjun", "52000", "6", "5", "4"],
          ["Vikram", "45000", "7", "<b>7</b>", "<b>5</b>"],
          ["Meera", "40000", "8", "8", "6"]
        ] } },
        { table: { head: ["Function", "On ties", "Next value after a tie", "Typical use"], rows: [
          ["<code>ROW_NUMBER()</code>", "Different numbers (arbitrary unless tiebroken)", "+1", "Exactly N rows per group, dedup \"keep one\", pagination"],
          ["<code>RANK()</code>", "Same number", "Skips (1, 2, 2, <b>4</b>)", "Competition ranking (\"joint 2nd, then 4th\")"],
          ["<code>DENSE_RANK()</code>", "Same number", "No gap (1, 2, 2, <b>3</b>)", "Nth highest <i>distinct</i> value, top-N salaries with ties"]
        ] } },
        { p: "RANK = 1 + number of rows strictly ahead. DENSE_RANK = 1 + number of distinct values strictly ahead. Karan: 3 rows ahead → RANK 4; 2 distinct values ahead (90000, 75000) → DENSE_RANK 3." },
        { warn: "RANK and DENSE_RANK need an ORDER BY inside OVER (PostgreSQL gives every row rank 1 without it; MySQL treats all rows as peers too). ROW_NUMBER without ORDER BY numbers rows in an arbitrary order." }
      ] },
      { h: "PARTITION BY: ranking inside each department", blocks: [
        { code: `SELECT name, dept_id, salary,
       ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS rn,
       RANK()       OVER (PARTITION BY dept_id ORDER BY salary DESC)     AS rnk,
       DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)     AS drnk
FROM employees
WHERE dept_id IS NOT NULL
ORDER BY dept_id, salary DESC, id;`, lang: "sql" },
        { table: { head: ["name", "dept_id", "salary", "rn", "rnk", "drnk"], rows: [
          ["Asha", "1", "90000", "1", "1", "1"],
          ["Ravi", "1", "75000", "2", "2", "2"],
          ["Neha", "1", "75000", "3", "2", "2"],
          ["Karan", "2", "60000", "1", "1", "1"],
          ["Priya", "2", "52000", "2", "2", "2"],
          ["Arjun", "2", "52000", "3", "2", "2"],
          ["Vikram", "3", "45000", "1", "1", "1"]
        ] } },
        { p: "Numbering restarts at 1 in every department. Without the WHERE, Meera would form her own partition (all NULL keys are one partition) and get rank 1." }
      ] },
      { h: "The top-N per group pattern", blocks: [
        { code: `-- ERROR in both MySQL and PostgreSQL: window functions are not allowed in WHERE
SELECT name FROM employees
WHERE ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) <= 2;`, lang: "sql", title: "Why the obvious query fails" },
        { p: "WHERE runs at step 2; windows are computed at step 5 (SELECT). Compute the rank first, then filter in an outer query:" },
        { code: `WITH ranked AS (
  SELECT name, dept_id, salary,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS rn
  FROM employees
  WHERE dept_id IS NOT NULL
)
SELECT name, dept_id, salary
FROM ranked
WHERE rn <= 2
ORDER BY dept_id, rn;`, lang: "sql", title: "Top 2 earners per department" },
        { table: { head: ["ROW_NUMBER rn ≤ 2 (exactly 2)", "DENSE_RANK drnk ≤ 2 (all ties)", "RANK rnk = 1 (top earner, ties kept)"], rows: [
          ["Asha 90000 (Eng)", "Asha 90000 (Eng)", "Asha 90000 (Eng)"],
          ["Ravi 75000 (Eng)", "Ravi 75000 (Eng)", "Karan 60000 (Sales)"],
          ["Karan 60000 (Sales)", "Neha 75000 (Eng)", "Vikram 45000 (HR)"],
          ["Priya 52000 (Sales)", "Karan 60000 (Sales)", ""],
          ["Vikram 45000 (HR)", "Priya 52000 (Sales)", ""],
          ["", "Arjun 52000 (Sales)", ""],
          ["", "Vikram 45000 (HR)", ""]
        ] } },
        { p: "Neha is dropped by ROW_NUMBER even though she earns the same as Ravi — only because of the <code>id</code> tiebreak. Ask the interviewer: \"If two people tie, should both appear?\" That question decides ROW_NUMBER vs DENSE_RANK." },
        { code: `-- most recent hire per department
WITH r AS (
  SELECT name, dept_id, hired_on,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hired_on DESC) AS rn
  FROM employees WHERE dept_id IS NOT NULL
)
SELECT name, dept_id, hired_on FROM r WHERE rn = 1;
-- Neha (1, 2021-01-10), Arjun (2, 2023-08-15), Vikram (3, 2021-09-12)`, lang: "sql" },
        { tip: "The same pattern solves \"delete duplicates but keep one\": number rows with <code>ROW_NUMBER() OVER (PARTITION BY email ORDER BY id)</code> and delete where rn &gt; 1. Mentioning this reuse impresses." }
      ] }
    ],
    practice: [
      { q: "Rank all employees by salary (highest = 1) so that ties share a rank and there are no gaps.", a: "<code>SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk FROM employees;</code><br>→ Asha 1, Ravi 2, Neha 2, Karan 3, Priya 4, Arjun 4, Vikram 5, Meera 6." },
      { q: "Number employees 1…8 by hire date (earliest = 1).", a: "<code>SELECT name, hired_on, ROW_NUMBER() OVER (ORDER BY hired_on) AS rn FROM employees;</code><br>→ Asha 1, Karan 2, Ravi 3, Neha 4, Vikram 5, Priya 6, Meera 7, Arjun 8 (hire dates are unique, so no tiebreak needed)." },
      { q: "Exactly two top earners per department (break ties by id).", a: "CTE with <code>ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS rn</code>, then <code>WHERE rn &lt;= 2</code>.<br>→ Asha, Ravi | Karan, Priya | Vikram (HR has only one)." },
      { q: "Top earner(s) per department, keeping ties.", a: "CTE with <code>RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk</code>, then <code>WHERE rnk = 1</code>.<br>→ Asha (Eng), Karan (Sales), Vikram (HR). DENSE_RANK = 1 gives the same result." },
      { q: "Most recently hired employee in each department.", a: "<code>ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hired_on DESC) AS rn</code> in a CTE, keep rn = 1.<br>→ Neha (Eng), Arjun (Sales), Vikram (HR)." },
      { q: "Show every employee with the headcount of their department, without GROUP BY and without a join.", a: "<code>SELECT name, dept_id, COUNT(*) OVER (PARTITION BY dept_id) AS dept_size FROM employees;</code><br>→ Eng rows 3, Sales rows 3, Vikram 1, Meera 1 (NULL partition)." }
    ],
    related: ["dbms:window-functions", "sql:rank-vs-dense-rank-vs-row-number", "sql:top-three-salaries-per-department", "sql:highest-salary-per-department", "sql:nth-highest-salary", "sql:delete-duplicates-without-primary-key", "sql:delete-duplicate-emails-keep-one", "sql:percentage-of-total", "sql:difference-from-department-average"]
  });

  /* =====================================================================
     d23-ev  Window functions deep
     ===================================================================== */
  add({
    id: "sql-window-deep",
    subject: "sql",
    title: "Window functions II: LAG/LEAD, running totals, frames, NTILE, FIRST/LAST_VALUE",
    minutes: 90,
    crux: [
      "<code>LAG(col, n, default)</code> / <code>LEAD(…)</code> read the value n rows before / after within the partition — the tool for every \"compared with previous\" question (MoM growth, gaps between orders).",
      "<code>SUM(x) OVER (ORDER BY d)</code> is a running total; add <code>PARTITION BY g</code> to restart it per group.",
      "The <b>frame</b> decides which rows an aggregate sees: <code>ROWS</code> counts physical rows; <code>RANGE</code> treats rows with equal ORDER BY values (peers) as one step.",
      "<b>Default-frame trap:</b> with ORDER BY and no frame, the frame is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — tied rows get the same running total. Write <code>ROWS …</code> explicitly.",
      "<code>LAST_VALUE</code> with the default frame just returns the current row (or its last peer). Use <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>, or FIRST_VALUE with reversed order.",
      "<code>NTILE(n)</code> deals rows into n buckets as evenly as possible; the first (rows mod n) buckets get one extra row.",
      "Nth highest per group = <code>DENSE_RANK() OVER (PARTITION BY g ORDER BY x DESC) = N</code> filtered in an outer query. Ranking functions, LAG/LEAD and NTILE ignore frames."
    ],
    sections: [
      { h: "Tables used here", blocks: [
        { p: "Same schema as the other SQL lessons. Most examples use <b>orders</b>; frame and NTILE examples use <b>employees</b>." },
        ORD, EMP
      ] },
      { h: "LAG and LEAD: looking at neighbouring rows", blocks: [
        { code: [
          { lang: "sql", src: `-- MySQL 8
SELECT customer_id, id, order_date, amount,
       LAG(order_date) OVER w                          AS prev_date,
       DATEDIFF(order_date, LAG(order_date) OVER w)    AS gap_days,
       LEAD(amount) OVER w                             AS next_amount
FROM orders
WINDOW w AS (PARTITION BY customer_id ORDER BY order_date)
ORDER BY customer_id, order_date;` },
          { lang: "sql", src: `-- PostgreSQL: date - date = integer days
SELECT customer_id, id, order_date, amount,
       LAG(order_date) OVER w                AS prev_date,
       order_date - LAG(order_date) OVER w   AS gap_days,
       LEAD(amount) OVER w                   AS next_amount
FROM orders
WINDOW w AS (PARTITION BY customer_id ORDER BY order_date)
ORDER BY customer_id, order_date;` }
        ], title: "Days between consecutive orders of the same customer" },
        { table: { head: ["customer_id", "id", "order_date", "amount", "prev_date", "gap_days", "next_amount"], rows: [
          ["1", "101", "2024-01-05", "500", "NULL", "NULL", "300"],
          ["1", "102", "2024-01-20", "300", "2024-01-05", "15", "900"],
          ["1", "105", "2024-03-02", "900", "2024-01-20", "42", "NULL"],
          ["2", "103", "2024-02-03", "1200", "NULL", "NULL", "400"],
          ["2", "106", "2024-03-18", "400", "2024-02-03", "44", "NULL"],
          ["3", "104", "2024-02-14", "700", "NULL", "NULL", "1100"],
          ["3", "107", "2024-04-09", "1100", "2024-02-14", "55", "NULL"]
        ] } },
        { p: "Check 42: Jan 20 → Jan 31 is 11 days, + 29 (Feb 2024 is a leap month) + 2 = 42. Check 55: Feb 14 → Feb 29 is 15, + 31 (March) + 9 = 55." },
        { ul: [
          "<code>LAG(x)</code> = <code>LAG(x, 1)</code>. <code>LAG(x, 2)</code> looks two rows back. <code>LAG(x, 1, 0)</code> returns 0 instead of NULL on the first row.",
          "The partition's first row has no previous row → NULL; LAG never crosses into another partition.",
          "<code>WINDOW w AS (…)</code> names a window once and reuses it (MySQL 8 and PostgreSQL)."
        ] }
      ] },
      { h: "Running totals", blocks: [
        { code: `SELECT id, customer_id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS customer_running
FROM orders
ORDER BY order_date;`, lang: "sql" },
        { table: { head: ["id", "customer_id", "order_date", "amount", "running_total", "customer_running"], rows: [
          ["101", "1", "2024-01-05", "500", "500", "500"],
          ["102", "1", "2024-01-20", "300", "800", "800"],
          ["103", "2", "2024-02-03", "1200", "2000", "1200"],
          ["104", "3", "2024-02-14", "700", "2700", "700"],
          ["105", "1", "2024-03-02", "900", "3600", "1700"],
          ["106", "2", "2024-03-18", "400", "4000", "1600"],
          ["107", "3", "2024-04-09", "1100", "5100", "1800"]
        ] } },
        { p: "customer_running for Amit: 500 → 500+300 = 800 → 800+900 = 1700. The partition restarts for Sara and Zoya." },
        { tip: "Before window functions, running totals needed a self join (<code>SUM(b.amount) … WHERE b.order_date &lt;= a.order_date</code>), which is O(n²). Saying so shows you know why windows matter." }
      ] },
      { h: "Frames: ROWS vs RANGE and the default-frame trap", blocks: [
        { table: { head: ["Frame bound", "Meaning"], rows: [
          ["<code>UNBOUNDED PRECEDING</code>", "first row of the partition"],
          ["<code>n PRECEDING</code>", "n rows (ROWS) or n units of the sort value (RANGE) before"],
          ["<code>CURRENT ROW</code>", "this row (with RANGE: this row <i>and all its peers</i>)"],
          ["<code>n FOLLOWING</code>", "n rows / units after"],
          ["<code>UNBOUNDED FOLLOWING</code>", "last row of the partition"]
        ] } },
        { p: "Defaults: <b>no ORDER BY</b> → the frame is the whole partition. <b>ORDER BY present</b> → <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. The difference only shows when the ORDER BY key has ties:" },
        { code: `SELECT name, salary,
       SUM(salary) OVER (ORDER BY salary)                        AS default_range,
       SUM(salary) OVER (ORDER BY salary
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS explicit_rows
FROM employees
ORDER BY salary, id;`, lang: "sql" },
        { table: { head: ["name", "salary", "default_range", "explicit_rows"], rows: [
          ["Meera", "40000", "40000", "40000"],
          ["Vikram", "45000", "85000", "85000"],
          ["Priya", "52000", "<b>189000</b>", "137000"],
          ["Arjun", "52000", "189000", "189000"],
          ["Karan", "60000", "249000", "249000"],
          ["Ravi", "75000", "<b>399000</b>", "324000"],
          ["Neha", "75000", "399000", "399000"],
          ["Asha", "90000", "489000", "489000"]
        ] } },
        { svg: `<svg viewBox="0 0 720 245" width="720" class="dg">
  <rect class="box" x="40" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="78" y="36" text-anchor="middle" dominant-baseline="middle">Meera 40k</text>
  <rect class="box" x="124" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="162" y="36" text-anchor="middle" dominant-baseline="middle">Vikram 45k</text>
  <rect class="box" x="208" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="246" y="36" text-anchor="middle" dominant-baseline="middle">Priya 52k</text>
  <rect class="box" x="292" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="330" y="36" text-anchor="middle" dominant-baseline="middle">Arjun 52k</text>
  <rect class="box" x="376" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="414" y="36" text-anchor="middle" dominant-baseline="middle">Karan 60k</text>
  <rect class="box-a" x="460" y="20" width="76" height="32" rx="6"/>
  <text class="tx tx-b" x="498" y="36" text-anchor="middle" dominant-baseline="middle">Ravi 75k</text>
  <rect class="box-w" x="544" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="582" y="36" text-anchor="middle" dominant-baseline="middle">Neha 75k</text>
  <rect class="box" x="628" y="20" width="76" height="32" rx="6"/>
  <text class="tx" x="666" y="36" text-anchor="middle" dominant-baseline="middle">Asha 90k</text>
  <polyline class="ln-a" points="40,68 40,76 536,76 536,68"/>
  <text class="tx-s" x="40" y="92" dominant-baseline="middle">ROWS UNBOUNDED PRECEDING → CURRENT ROW: 324000</text>
  <polyline class="ln-a" points="40,114 40,122 620,122 620,114"/>
  <text class="tx-s" x="40" y="138" dominant-baseline="middle">RANGE (the default) also includes peer Neha: 399000</text>
  <polyline class="ln-a" points="292,160 292,168 536,168 536,160"/>
  <text class="tx-s" x="292" y="184" dominant-baseline="middle">ROWS 2 PRECEDING → CURRENT ROW: 187000</text>
  <polyline class="ln-a" points="40,206 40,214 704,214 704,206"/>
  <text class="tx-s" x="40" y="230" dominant-baseline="middle">UNBOUNDED PRECEDING → UNBOUNDED FOLLOWING: 489000</text>
</svg>`, caption: "Frames seen from Ravi's row (accent) when ordered by salary. Neha (orange) is Ravi's peer: same ORDER BY value." },
        { code: `-- 3-month moving average of monthly revenue (MySQL; PostgreSQL: TO_CHAR(order_date, 'YYYY-MM'))
WITH monthly AS (
  SELECT DATE_FORMAT(order_date, '%Y-%m') AS mon, SUM(amount) AS revenue
  FROM orders
  GROUP BY DATE_FORMAT(order_date, '%Y-%m')
)
SELECT mon, revenue,
       ROUND(AVG(revenue) OVER (ORDER BY mon
                                ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS ma3
FROM monthly;
-- 2024-01 800 800.00 | 2024-02 1900 1350.00 | 2024-03 1300 1333.33 | 2024-04 1100 1433.33`, lang: "sql", title: "Moving average with a ROWS frame" },
        { p: "Mar = (800 + 1900 + 1300) / 3 = 1333.33; Apr = (1900 + 1300 + 1100) / 3 = 1433.33. The first rows average over fewer months — filter them out if you need full windows only." },
        { warn: "Running totals over a non-unique key (dates with several orders per day, tied salaries) silently jump if you rely on the default frame. Rule: whenever you write ORDER BY inside OVER for an aggregate, also write <code>ROWS BETWEEN …</code> — or make the ORDER BY unique." }
      ] },
      { h: "Month-over-month growth", blocks: [
        { code: [
          { lang: "sql", src: `-- MySQL 8
WITH monthly AS (
  SELECT DATE_FORMAT(order_date, '%Y-%m') AS mon, SUM(amount) AS revenue
  FROM orders
  GROUP BY DATE_FORMAT(order_date, '%Y-%m')
)
SELECT mon, revenue,
       LAG(revenue) OVER (ORDER BY mon) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY mon))
             / NULLIF(LAG(revenue) OVER (ORDER BY mon), 0), 2) AS mom_pct
FROM monthly
ORDER BY mon;` },
          { lang: "sql", src: `-- PostgreSQL
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date)::date AS mon, SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT mon, revenue,
       LAG(revenue) OVER (ORDER BY mon) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY mon))
             / NULLIF(LAG(revenue) OVER (ORDER BY mon), 0), 2) AS mom_pct
FROM monthly
ORDER BY mon;` }
        ], title: "Revenue growth vs previous month" },
        { table: { head: ["mon", "revenue", "prev_revenue", "mom_pct"], rows: [
          ["2024-01", "800", "NULL", "NULL"],
          ["2024-02", "1900", "800", "137.50"],
          ["2024-03", "1300", "1900", "-31.58"],
          ["2024-04", "1100", "1300", "-15.38"]
        ] } },
        { p: "Monthly revenue = all orders in that month: Jan 500 + 300 = 800; Feb 1200 + 700 = 1900; Mar 900 + 400 = 1300; Apr 1100. Growth Feb = (1900 − 800) / 800 = 137.5%; Mar = −600 / 1900 = −31.58%; Apr = −200 / 1300 = −15.38%. (PostgreSQL shows mon as 2024-01-01 etc.)" },
        { warn: "Integer division: in PostgreSQL <code>(1900 - 800) / 800</code> is <b>1</b> (integer), so the percentage becomes 100. Multiplying by <code>100.0</code> first forces decimal arithmetic. MySQL's <code>/</code> always returns a decimal. <code>NULLIF(prev, 0)</code> avoids division by zero." },
        { warn: "LAG over months assumes no month is missing. If a month had no orders, the \"previous row\" is two months back. For strict MoM, generate a calendar (recursive CTE / <code>generate_series</code> in PostgreSQL) and LEFT JOIN revenue onto it." }
      ] },
      { h: "NTILE, FIRST_VALUE, LAST_VALUE", blocks: [
        { code: `SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary DESC, id) AS quartile,
       NTILE(3) OVER (ORDER BY salary DESC, id) AS tercile
FROM employees;`, lang: "sql" },
        { table: { head: ["name", "salary", "quartile", "tercile"], rows: [["Asha", "90000", "1", "1"], ["Ravi", "75000", "1", "1"], ["Neha", "75000", "2", "1"], ["Karan", "60000", "2", "2"], ["Priya", "52000", "3", "2"], ["Arjun", "52000", "3", "2"], ["Vikram", "45000", "4", "3"], ["Meera", "40000", "4", "3"]] } },
        { p: "8 rows / 4 = 2 per bucket. 8 rows / 3: 8 mod 3 = 2, so the first two buckets get 3 rows and the last gets 2 (3, 3, 2). NTILE splits by row position — tied values can land in different buckets (Ravi 1, Neha 2)." },
        { code: `SELECT name, dept_id, salary,
       FIRST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS top_earner,
       LAST_VALUE(name)  OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS last_wrong,
       LAST_VALUE(name)  OVER (PARTITION BY dept_id ORDER BY salary DESC, id
                               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_ok
FROM employees
WHERE dept_id IS NOT NULL
ORDER BY dept_id, salary DESC, id;`, lang: "sql" },
        { table: { head: ["name", "dept_id", "salary", "top_earner", "last_wrong", "last_ok"], rows: [
          ["Asha", "1", "90000", "Asha", "Asha", "Neha"],
          ["Ravi", "1", "75000", "Asha", "Ravi", "Neha"],
          ["Neha", "1", "75000", "Asha", "Neha", "Neha"],
          ["Karan", "2", "60000", "Karan", "Karan", "Arjun"],
          ["Priya", "2", "52000", "Karan", "Priya", "Arjun"],
          ["Arjun", "2", "52000", "Karan", "Arjun", "Arjun"],
          ["Vikram", "3", "45000", "Vikram", "Vikram", "Vikram"]
        ] } },
        { p: "last_wrong just echoes the current row: the default frame ends at CURRENT ROW, so the \"last\" row of the frame is the row itself. FIRST_VALUE is safe because the frame always starts at the partition's first row. Alternative fix: <code>FIRST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary ASC, id DESC)</code>." },
        { tip: "<code>NTH_VALUE(name, 2) OVER (…)</code> exists in both MySQL 8 and PostgreSQL and has the same frame gotcha as LAST_VALUE." }
      ] },
      { h: "Nth highest per group", blocks: [
        { code: `WITH r AS (
  SELECT name, dept_id, salary,
         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS drnk
  FROM employees
  WHERE dept_id IS NOT NULL
)
SELECT name, dept_id, salary
FROM r
WHERE drnk = 2;`, lang: "sql", title: "Second-highest salary in every department" },
        { table: { head: ["name", "dept_id", "salary"], rows: [["Ravi", "1", "75000"], ["Neha", "1", "75000"], ["Priya", "2", "52000"], ["Arjun", "2", "52000"]] } },
        { p: "HR has a single salary so it has no 2nd highest and is absent. If the interviewer wants one row per department with NULL for HR, LEFT JOIN departments to this result." },
        { table: { head: ["Question", "Window tool"], rows: [
          ["Top / Nth per group", "ROW_NUMBER / DENSE_RANK + PARTITION BY, filter outside"],
          ["Previous / next row, gaps, growth", "LAG / LEAD"],
          ["Running total / cumulative count", "SUM / COUNT OVER (ORDER BY … ROWS UNBOUNDED PRECEDING)"],
          ["Moving average", "AVG OVER (ORDER BY … ROWS BETWEEN k PRECEDING AND CURRENT ROW)"],
          ["Share of total / diff from group avg", "x / SUM(x) OVER (PARTITION BY …), x − AVG(x) OVER (…)"],
          ["Quartiles / buckets", "NTILE(n)"],
          ["First / last in group on every row", "FIRST_VALUE, LAST_VALUE with full frame"]
        ] } }
      ] }
    ],
    practice: [
      { q: "For each order, show the same customer's previous and next order amounts.", a: "<code>SELECT id, customer_id, amount,<br>LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amt,<br>LEAD(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_amt<br>FROM orders;</code><br>→ 101: NULL/300, 102: 500/900, 105: 300/NULL, 103: NULL/400, 106: 1200/NULL, 104: NULL/1100, 107: 700/NULL." },
      { q: "Running total of <b>delivered</b> revenue by order date.", a: "<code>SELECT order_date, amount,<br>SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running<br>FROM orders WHERE status = 'DELIVERED';</code><br>→ 500, 1700, 2400, 3300, 4400 (WHERE runs before the window, so cancelled/returned orders never enter)." },
      { q: "Absolute month-over-month revenue change.", a: "Monthly CTE as in the lesson, then <code>revenue - LAG(revenue) OVER (ORDER BY mon)</code>.<br>→ Jan NULL, Feb +1100, Mar −600, Apr −200." },
      { q: "Second-highest distinct salary in each department.", a: "CTE with <code>DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS drnk</code>, keep <code>drnk = 2</code>.<br>→ Ravi, Neha (Eng, 75000); Priya, Arjun (Sales, 52000). HR has none." },
      { q: "Split employees into 4 salary quartiles, highest first (ties by id).", a: "<code>SELECT name, NTILE(4) OVER (ORDER BY salary DESC, id) AS q FROM employees;</code><br>→ 1: Asha, Ravi · 2: Neha, Karan · 3: Priya, Arjun · 4: Vikram, Meera." },
      { q: "On every order row, show that customer's first and last order id.", a: "<code>FIRST_VALUE(id) OVER (PARTITION BY customer_id ORDER BY order_date) AS first_id,<br>LAST_VALUE(id) OVER (PARTITION BY customer_id ORDER BY order_date<br>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_id</code><br>→ Amit 101/105, Sara 103/106, Zoya 104/107 on each of their rows. Without the full frame, last_id would equal the row's own id." },
      { q: "Each customer's second most recent order.", a: "<code>WITH x AS (SELECT customer_id, id, order_date,<br>ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn FROM orders)<br>SELECT * FROM x WHERE rn = 2;</code><br>→ Amit 102 (2024-01-20), Sara 103 (2024-02-03), Zoya 104 (2024-02-14)." },
      { q: "Why do Priya and Arjun both show 189000 in <code>SUM(salary) OVER (ORDER BY salary)</code>, and how do you give them 137000 and 189000?", a: "The default frame is RANGE … CURRENT ROW, which includes all peers (equal salary 52000), so both rows see 40000 + 45000 + 52000 + 52000 = 189000. Use <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> (and a tiebreak such as <code>ORDER BY salary, id</code>) → Priya 137000, Arjun 189000." }
    ],
    related: ["dbms:window-functions", "sql:running-total", "sql:moving-average", "sql:lag-lead-previous-next-row", "sql:month-over-month-growth", "sql:first-and-last-order-per-customer", "sql:days-between-consecutive-orders", "sql:second-most-recent-order", "sql:top-three-salaries-per-department", "sql:cumulative-distinct-count", "sql:median-salary", "sql:percentile-50th-and-quartiles", "sql:consecutive-login-days", "sql:consecutive-numbers-three-times", "sql:day-one-retention"]
  });

  /* =====================================================================
     d54-af  Revision drill
     ===================================================================== */
  add({
    id: "sql-revision-drill",
    subject: "sql",
    title: "SQL revision: 12 mixed queries to write before running",
    minutes: 60,
    crux: [
      "Before writing, name the <b>pattern</b>: filter, group, join/anti-join, compare-with-group, rank-per-group, previous-row, running total.",
      "Predict the result table by hand from the sample data, <i>then</i> run it. A mismatch means you misunderstood something — that is the point of the drill.",
      "Check NULLs every time: NOT IN, &lt;&gt;, inner joins and correlated comparisons all silently drop NULL rows.",
      "After a LEFT JOIN: filters on the right table go in ON; count with <code>COUNT(right.pk)</code>.",
      "Window results can't be filtered in WHERE — wrap in a CTE. Add ROWS frames and unique tiebreakers.",
      "Say which ties you keep (ROW_NUMBER vs RANK vs DENSE_RANK) and which dialect you're writing (LIMIT, date functions, FULL JOIN)."
    ],
    sections: [
      { h: "How to run this drill", blocks: [
        { ol: [
          "Load the setup script from the Level 1 lesson into MySQL 8 or PostgreSQL.",
          "For each of the 12 practice questions below, write the query on paper or in a plain editor — no running.",
          "Write the expected output table by hand from the data below.",
          "Run it. If the output differs, find the cause before looking at the answer.",
          "Time box: about 4 minutes per query. Anything slower is a pattern to revise in the linked lesson."
        ] },
        { h: "employees" }, EMP,
        { h: "departments" }, DEPT,
        { h: "customers" }, CUST,
        { h: "orders" }, ORD
      ] },
      { h: "Pattern → tool cheat-sheet", blocks: [
        { table: { head: ["If the question says…", "Reach for"], rows: [
          ["\"for each X, count/total…\"", "GROUP BY X (+ LEFT JOIN from X if X can have zero)"],
          ["\"…only groups where the total/count…\"", "HAVING"],
          ["\"never / has no / without\"", "NOT EXISTS or LEFT JOIN … WHERE right.pk IS NULL (never NOT IN on nullable columns)"],
          ["\"more than the average of their own …\"", "Correlated subquery, or join to a GROUP BY derived table / CTE"],
          ["\"top N / Nth highest per …\"", "ROW_NUMBER / DENSE_RANK with PARTITION BY in a CTE"],
          ["\"compared with previous / next\"", "LAG / LEAD"],
          ["\"cumulative / running / so far\"", "SUM() OVER (ORDER BY … ROWS UNBOUNDED PRECEDING)"],
          ["\"how many of each status as columns\"", "SUM(CASE WHEN … THEN 1 ELSE 0 END)"],
          ["\"hierarchy / chain / all levels\"", "WITH RECURSIVE"]
        ] } }
      ] },
      { h: "Trap checklist before you say \"done\"", blocks: [
        { ul: [
          "Does any NULL (Meera's dept, Asha's manager, Dev's missing orders) change the answer? Did you mean to drop it?",
          "Did a join multiply rows before a SUM? Aggregate first, then join.",
          "Is every non-aggregated SELECT column in GROUP BY?",
          "Is the ORDER BY inside OVER unique enough for ROW_NUMBER and running totals?",
          "Percentages: <code>100.0 *</code> first (PostgreSQL integer division) and <code>NULLIF(den, 0)</code>.",
          "Date ranges as <code>&gt;= start AND &lt; next_start</code>; month bucketing is dialect-specific (DATE_FORMAT vs TO_CHAR / DATE_TRUNC).",
          "Nth highest: DISTINCT / DENSE_RANK, and what to return when N doesn't exist."
        ] },
        { tip: "In an interview, narrate the pattern first (\"this is top-N per group, so ROW_NUMBER partitioned by department\") and the edge cases last (\"Meera has no department, so she's excluded — should she be?\"). Interviewers grade the reasoning as much as the query." }
      ] }
    ],
    practice: [
      { q: "1. Headcount for every department, including departments with nobody.", a: "<code>SELECT d.name, COUNT(e.id) FROM departments d LEFT JOIN employees e ON e.dept_id = d.id GROUP BY d.id, d.name;</code><br>→ Engineering 3, Sales 3, HR 1, Marketing 0." },
      { q: "2. Employees whose manager is in a different department (include people without a department).", a: "<code>SELECT e.name FROM employees e JOIN employees m ON m.id = e.manager_id<br>WHERE e.dept_id &lt;&gt; m.dept_id OR (e.dept_id IS NULL) &lt;&gt; (m.dept_id IS NULL);</code><br>→ Karan, Vikram, Meera. PostgreSQL shortcut: <code>e.dept_id IS DISTINCT FROM m.dept_id</code>; MySQL: <code>NOT (e.dept_id &lt;=&gt; m.dept_id)</code>. Plain &lt;&gt; misses Meera." },
      { q: "3. Second-highest distinct salary; NULL if it doesn't exist.", a: "<code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees);</code><br>→ 75000." },
      { q: "4. Top earner(s) of each department, ties included.", a: "<code>WITH r AS (SELECT name, dept_id, RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rk FROM employees WHERE dept_id IS NOT NULL)<br>SELECT name, dept_id FROM r WHERE rk = 1;</code><br>→ Asha (1), Karan (2), Vikram (3)." },
      { q: "5. Customers who never ordered — without NOT IN.", a: "<code>SELECT c.name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);</code><br>→ Dev." },
      { q: "6. Running total of delivered revenue by date.", a: "<code>SELECT order_date, SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)<br>FROM orders WHERE status = 'DELIVERED';</code><br>→ 500, 1700, 2400, 3300, 4400." },
      { q: "7. Monthly revenue and the change from the previous month.", a: "CTE <code>monthly</code> grouped by month (DATE_FORMAT / TO_CHAR), then <code>revenue - LAG(revenue) OVER (ORDER BY mon)</code>.<br>→ 2024-01 800 NULL · 2024-02 1900 +1100 · 2024-03 1300 −600 · 2024-04 1100 −200." },
      { q: "8. Each customer's first order (id and date) with their name.", a: "<code>WITH x AS (SELECT c.name, o.id, o.order_date, ROW_NUMBER() OVER (PARTITION BY o.customer_id ORDER BY o.order_date) AS rn<br>FROM orders o JOIN customers c ON c.id = o.customer_id)<br>SELECT name, id, order_date FROM x WHERE rn = 1;</code><br>→ Amit 101 2024-01-05, Sara 103 2024-02-03, Zoya 104 2024-02-14." },
      { q: "9. Department with the highest total salary.", a: "<code>WITH t AS (SELECT dept_id, SUM(salary) AS total FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id)<br>SELECT d.name, t.total FROM t JOIN departments d ON d.id = t.dept_id WHERE t.total = (SELECT MAX(total) FROM t);</code><br>→ Engineering 240000." },
      { q: "10. Employees earning more than their department average.", a: "<code>SELECT e.name FROM employees e<br>WHERE e.salary &gt; (SELECT AVG(salary) FROM employees x WHERE x.dept_id = e.dept_id);</code><br>→ Asha (80000 avg), Karan (54666.67 avg)." },
      { q: "11. Per customer: number of orders and the % that were cancelled or returned.", a: "<code>SELECT c.name, COUNT(o.id) AS orders,<br>ROUND(100.0 * SUM(CASE WHEN o.status IN ('CANCELLED','RETURNED') THEN 1 ELSE 0 END) / COUNT(o.id), 2) AS bad_pct<br>FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name;</code><br>→ Amit 3 33.33, Sara 2 50.00, Zoya 2 0.00." },
      { q: "12. Every employee with their level in the org chart (CEO = 0).", a: "<code>WITH RECURSIVE chain AS (SELECT id, name, 0 AS lvl FROM employees WHERE manager_id IS NULL<br>UNION ALL SELECT e.id, e.name, c.lvl + 1 FROM employees e JOIN chain c ON e.manager_id = c.id)<br>SELECT name, lvl FROM chain;</code><br>→ Asha 0; Ravi, Neha, Karan, Vikram, Meera 1; Priya, Arjun 2." }
    ],
    related: ["dbms:join-types", "dbms:correlated-subquery", "dbms:window-functions", "dbms:nth-highest-salary", "dbms:where-vs-having", "sql:not-in-null-trap", "sql:top-three-salaries-per-department", "sql:month-over-month-growth", "sql:running-total", "sql:recursive-cte-org-hierarchy", "sql:percentage-of-total", "sql:above-department-average", "sql:first-and-last-order-per-customer", "sql:customers-who-never-ordered"]
  });

  map("d5-ev", ["sql-basics"]);
  map("d10-ev", ["sql-joins"]);
  map("d13-ev", ["sql-subqueries-ctes"]);
  map("d18-ev", ["sql-window-intro"]);
  map("d23-ev", ["sql-window-deep"]);
  map("d54-af", ["sql-revision-drill", "sql-basics", "sql-joins", "sql-subqueries-ctes", "sql-window-intro", "sql-window-deep"]);
})();
