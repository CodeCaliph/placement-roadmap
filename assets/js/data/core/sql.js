/* core subject: SQL Query Drills — hands-on query-writing interview problems */
(window.CORE = window.CORE || []).push({
  id: "sql",
  title: "SQL Query Drills",
  short: "SQL",
  icon: "⌗",
  blurb: "Hands-on query-writing problems from SQL rounds: joins, GROUP BY / HAVING, subqueries, window functions, top-N, dates and classic puzzles. Each one has sample data, the query, the output and the trap interviewers look for.",
  topics: ["Basics & Filtering", "Aggregation & GROUP BY", "Joins", "Subqueries", "Window Functions", "Ranking & Top-N", "Dates & Time", "Data Cleanup", "Classic Puzzles"],
  questions: [

    /* ───────────── Basics & Filtering ───────────── */
    {
      id: "count-star-vs-count-column",
      q: "Show the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column) on a table that contains NULLs.",
      topic: "Basics & Filtering",
      level: 1,
      top: true,
      short: "COUNT(*) counts rows; COUNT(col) skips rows where col is NULL; COUNT(DISTINCT col) counts unique non-NULL values.",
      a: [
        { p: "<code>COUNT(*)</code> counts every row. <code>COUNT(col)</code> counts only rows where <code>col</code> is <b>not NULL</b>. <code>COUNT(DISTINCT col)</code> counts the unique non-NULL values." },
        { table: { head: ["id", "name", "manager_id"], rows: [["1", "Asha", "NULL"], ["2", "Ravi", "1"], ["3", "Meena", "1"], ["4", "Karan", "3"], ["5", "Divya", "3"], ["6", "Farhan", "1"]] } },
        { code: `SELECT COUNT(*)                   AS all_rows,
       COUNT(manager_id)          AS with_manager,
       COUNT(DISTINCT manager_id) AS distinct_managers
FROM Employee;`, lang: "sql" },
        { table: { head: ["all_rows", "with_manager", "distinct_managers"], rows: [["6", "5", "2"]] } },
        { p: "Asha's NULL <code>manager_id</code> is skipped by the last two counts. The distinct non-NULL values are 1 and 3, so the answer is 2. <code>COUNT(1)</code> behaves exactly like <code>COUNT(*)</code>. Modern engines run them at the same speed." },
        { warn: "Every aggregate ignores NULLs the same way. <code>AVG(bonus)</code> divides by the number of non-NULL bonuses, not by the row count. If NULL should mean 0, write <code>AVG(COALESCE(bonus, 0))</code>." },
        { tip: "A common follow-up: after a LEFT JOIN, count the right table's key (<code>COUNT(o.id)</code>), not <code>COUNT(*)</code>. Otherwise a customer with no orders shows 1 instead of 0." }
      ]
    },
    {
      id: "null-handling-coalesce",
      q: "Some employees have a NULL bonus. Compute each employee's total pay (salary + bonus) so that a missing bonus counts as 0.",
      topic: "Basics & Filtering",
      level: 1,
      top: true,
      short: "Any arithmetic with NULL gives NULL, so wrap the column in COALESCE(bonus, 0). Test for NULL with IS NULL, never with = NULL.",
      a: [
        { p: "NULL means \"unknown\", so <code>70000 + NULL</code> is NULL. <code>COALESCE(a, b, ...)</code> returns its first non-NULL argument, which lets you swap in a default." },
        { table: { head: ["id", "name", "salary", "bonus"], rows: [["1", "Asha", "90000", "5000"], ["2", "Ravi", "70000", "NULL"], ["3", "Meena", "80000", "3000"], ["4", "Karan", "85000", "NULL"]] } },
        { code: `SELECT name,
       bonus,
       salary + bonus               AS naive_total,
       salary + COALESCE(bonus, 0)  AS total_pay
FROM Employee;`, lang: "sql" },
        { table: { head: ["name", "bonus", "naive_total", "total_pay"], rows: [["Asha", "5000", "95000", "95000"], ["Ravi", "NULL", "NULL", "70000"], ["Meena", "3000", "83000", "83000"], ["Karan", "NULL", "NULL", "85000"]] } },
        { ul: [
          "<code>COALESCE</code> is standard SQL and works everywhere. <code>IFNULL(a,b)</code> is MySQL-only and <code>ISNULL(a,b)</code> is SQL Server-only. They are 2-argument shortcuts.",
          "<code>NULLIF(x, 0)</code> returns NULL when x = 0. It is the standard way to avoid division by zero: <code>total / NULLIF(cnt, 0)</code>.",
          "To find the rows with no bonus, write <code>WHERE bonus IS NULL</code>."
        ] },
        { warn: "<code>WHERE bonus = NULL</code> returns <b>no rows</b>, because comparing anything with NULL gives UNKNOWN. In the same way, <code>WHERE bonus &lt;&gt; 5000</code> silently drops the NULL rows too." }
      ]
    },
    {
      id: "string-functions-name-format",
      q: "Names are stored in mixed case. Output the full name in proper case (\"Aditi Sharma\"), the initials, and the email domain.",
      topic: "Basics & Filtering",
      level: 1,
      top: false,
      short: "UPPER(LEFT(x,1)) + LOWER(SUBSTRING(x,2)) for proper case, CONCAT to join, SUBSTRING after POSITION('@') for the domain.",
      a: [
        { table: { head: ["id", "first_name", "last_name", "email"], rows: [["1", "aditi", "SHARMA", "aditi@gmail.com"], ["2", "RAHUL", "verma", "rahul.v@yahoo.com"], ["3", "neha", "Iyer", "neha@company.in"]] } },
        { code: `SELECT CONCAT(UPPER(LEFT(first_name, 1)), LOWER(SUBSTRING(first_name, 2)), ' ',
              UPPER(LEFT(last_name, 1)),  LOWER(SUBSTRING(last_name, 2)))  AS full_name,
       CONCAT(UPPER(LEFT(first_name, 1)), UPPER(LEFT(last_name, 1)))    AS initials,
       SUBSTRING(email FROM POSITION('@' IN email) + 1)                  AS domain
FROM Users;`, lang: "sql" },
        { table: { head: ["full_name", "initials", "domain"], rows: [["Aditi Sharma", "AS", "gmail.com"], ["Rahul Verma", "RV", "yahoo.com"], ["Neha Iyer", "NI", "company.in"]] } },
        { p: "<code>LEFT(s, 1)</code> takes the first character and <code>SUBSTRING(s, 2)</code> takes the rest. Uppercasing the first part and lowercasing the rest gives proper case. <code>POSITION('@' IN email)</code> finds the '@', and the domain starts one character after it. Every function shown works in both MySQL 8 and PostgreSQL." },
        { ul: [
          "PostgreSQL has <code>INITCAP(s)</code>, which proper-cases every word. MySQL has no equivalent.",
          "<code>TRIM(s)</code> removes leading and trailing spaces. Clean the input with it before formatting.",
          "Other useful functions: <code>LENGTH</code> (bytes in MySQL; use <code>CHAR_LENGTH</code> for characters), <code>REPLACE</code>, <code>LPAD</code>, and <code>SUBSTRING_INDEX(email,'@',-1)</code> (MySQL only)."
        ] },
        { warn: "In MySQL, <code>'a' || 'b'</code> is a logical OR and returns 0. Only PostgreSQL and standard SQL treat <code>||</code> as concatenation. <code>CONCAT()</code> works in both. Also note that in MySQL, <code>CONCAT</code> returns NULL if any argument is NULL." }
      ]
    },
    {
      id: "odd-even-rows",
      q: "Fetch the odd-numbered rows (1st, 3rd, 5th, ...) of the Employee table when ordered by id. Note that the ids have gaps.",
      topic: "Basics & Filtering",
      level: 1,
      top: false,
      short: "Number the rows with ROW_NUMBER() OVER (ORDER BY id), then filter rn % 2 = 1. Filtering on id % 2 only works if ids have no gaps.",
      a: [
        { p: "The quick answer is <code>WHERE id % 2 = 1</code>, but that tests whether the <i>id</i> is odd, not the row's <i>position</i>. When ids have gaps, number the rows first." },
        { table: { head: ["id", "name"], rows: [["1", "Asha"], ["2", "Ravi"], ["4", "Karan"], ["5", "Divya"], ["7", "Farhan"], ["8", "Gita"]] } },
        { code: `SELECT id, name
FROM (
    SELECT id, name,
           ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM Employee
) t
WHERE rn % 2 = 1;          -- use rn % 2 = 0 for even rows`, lang: "sql" },
        { table: { head: ["id", "name", "rn"], rows: [["1", "Asha", "1"], ["4", "Karan", "3"], ["7", "Farhan", "5"]] } },
        { p: "Filtering on <code>id % 2 = 1</code> instead would return ids 1, 5 and 7, which is a different answer. <code>MOD(id, 2)</code> works the same as <code>%</code> in both MySQL and PostgreSQL." },
        { warn: "A window function cannot appear in WHERE at the same level, because WHERE runs before SELECT. That is why the ROW_NUMBER goes in a subquery or CTE." }
      ]
    },
    {
      id: "like-pattern-filter",
      q: "Find customers whose name starts with a vowel and whose email is exactly on the gmail.com domain.",
      topic: "Basics & Filtering",
      level: 1,
      top: false,
      short: "LOWER(LEFT(name,1)) IN ('a','e','i','o','u') AND email LIKE '%@gmail.com'. Remember that _ and % are wildcards.",
      a: [
        { table: { head: ["id", "name", "email"], rows: [["1", "Anil", "anil@gmail.com"], ["2", "Bhavna", "bhavna@yahoo.com"], ["3", "Esha", "esha_k@gmail.com"], ["4", "Omar", "omar@gmail.co"], ["5", "Tara", "tara@outlook.com"]] } },
        { code: `SELECT name, email
FROM Customers
WHERE LOWER(LEFT(name, 1)) IN ('a', 'e', 'i', 'o', 'u')
  AND email LIKE '%@gmail.com';`, lang: "sql" },
        { table: { head: ["name", "email"], rows: [["Anil", "anil@gmail.com"], ["Esha", "esha_k@gmail.com"]] } },
        { p: "Omar starts with a vowel but his email is on <code>gmail.co</code>. The pattern ends with the literal <code>.com</code>, so he is excluded. <code>%</code> matches any run of characters, and <code>_</code> matches exactly one." },
        { h: "Regex alternative" },
        { code: `-- MySQL
WHERE name REGEXP '^[AEIOUaeiou]'
-- PostgreSQL (~* = case-insensitive regex)
WHERE name ~* '^[aeiou]'`, lang: "sql" },
        { warn: "Case sensitivity differs by dialect. MySQL's default collation makes <code>LIKE 'a%'</code> case-insensitive, but PostgreSQL's <code>LIKE</code> is case-sensitive (use <code>ILIKE</code>). To search for a literal underscore, escape it: <code>LIKE 'esha\\_%'</code>." }
      ]
    },

    /* ───────────── Aggregation & GROUP BY ───────────── */
    {
      id: "count-per-group-having",
      q: "For each department with at least 2 employees, show the employee count and the average salary.",
      topic: "Aggregation & GROUP BY",
      level: 1,
      top: true,
      short: "GROUP BY dept_id with COUNT(*) and AVG(salary), then HAVING COUNT(*) >= 2. WHERE filters rows before grouping; HAVING filters groups after.",
      a: [
        { table: { head: ["id", "name", "salary", "dept_id"], rows: [["1", "Asha", "90000", "1"], ["2", "Ravi", "70000", "1"], ["3", "Meena", "80000", "2"], ["4", "Karan", "85000", "2"], ["5", "Divya", "60000", "2"], ["6", "Farhan", "95000", "3"]] } },
        { code: `SELECT dept_id,
       COUNT(*)    AS emp_count,
       AVG(salary) AS avg_salary
FROM Employee
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY dept_id;`, lang: "sql" },
        { table: { head: ["dept_id", "emp_count", "avg_salary"], rows: [["1", "2", "80000"], ["2", "3", "75000"]] } },
        { p: "Department 3 has only one employee, so HAVING removes that group. A condition on an aggregate has to go in <b>HAVING</b>, because WHERE runs before the groups exist." },
        { svg: `<svg viewBox="0 0 680 100" width="680" class="dg">
  <rect class="box" x="10" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="42" text-anchor="middle" dominant-baseline="middle">FROM</text>
  <rect class="box-w" x="106" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="146" y="42" text-anchor="middle" dominant-baseline="middle">WHERE</text>
  <rect class="box" x="202" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="242" y="42" text-anchor="middle" dominant-baseline="middle">GROUP BY</text>
  <rect class="box-a" x="298" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="338" y="42" text-anchor="middle" dominant-baseline="middle">HAVING</text>
  <rect class="box" x="394" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="434" y="42" text-anchor="middle" dominant-baseline="middle">SELECT</text>
  <rect class="box" x="490" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="530" y="42" text-anchor="middle" dominant-baseline="middle">ORDER BY</text>
  <rect class="box" x="586" y="24" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="626" y="42" text-anchor="middle" dominant-baseline="middle">LIMIT</text>
  <line class="ln" x1="90" y1="42" x2="104" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="186" y1="42" x2="200" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="282" y1="42" x2="296" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="378" y1="42" x2="392" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="474" y1="42" x2="488" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="570" y1="42" x2="584" y2="42" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="146" y="78" text-anchor="middle">filters rows</text>
  <text class="tx-m" x="338" y="78" text-anchor="middle">filters groups</text>
  <text class="tx-m" x="434" y="78" text-anchor="middle">aliases born here</text>
</svg>`, caption: "Logical order of evaluation: WHERE sees rows, HAVING sees groups" },
        { warn: "In MySQL, <code>AVG</code> of an INT column returns a DECIMAL such as 80000.0000. PostgreSQL returns a numeric. Wrap it in <code>ROUND(AVG(salary), 2)</code> for clean output. Also note that PostgreSQL does not allow a SELECT alias inside HAVING, so repeat <code>COUNT(*)</code> there." }
      ]
    },
    {
      id: "find-duplicate-emails",
      q: "Find all email addresses that appear more than once in the Person table.",
      topic: "Aggregation & GROUP BY",
      level: 1,
      top: true,
      short: "GROUP BY email HAVING COUNT(*) > 1. To see the full duplicate rows, use COUNT(*) OVER (PARTITION BY email).",
      a: [
        { table: { head: ["id", "email"], rows: [["1", "a@x.com"], ["2", "b@x.com"], ["3", "a@x.com"], ["4", "c@x.com"], ["5", "b@x.com"]] } },
        { code: `SELECT email, COUNT(*) AS times
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;`, lang: "sql" },
        { table: { head: ["email", "times"], rows: [["a@x.com", "2"], ["b@x.com", "2"]] } },
        { h: "Show every duplicate row (with its id)" },
        { code: `SELECT id, email
FROM (
    SELECT id, email,
           COUNT(*) OVER (PARTITION BY email) AS cnt
    FROM Person
) t
WHERE cnt > 1
ORDER BY email, id;`, lang: "sql" },
        { p: "The window version keeps every row and attaches the group size to it, so you can see <i>which</i> ids are duplicates. ids 1 and 3 share a@x.com, and ids 2 and 5 share b@x.com." },
        { warn: "Real data hides duplicates behind case and whitespace. 'A@x.com ' and 'a@x.com' form different groups unless you group by <code>LOWER(TRIM(email))</code>." }
      ]
    },
    {
      id: "percentage-of-total",
      q: "For each region, show total sales and that region's percentage of overall sales.",
      topic: "Aggregation & GROUP BY",
      level: 2,
      top: true,
      short: "Divide the group SUM by SUM(SUM(amount)) OVER () (the grand total) and multiply by 100.0 to avoid integer division.",
      a: [
        { table: { head: ["id", "region", "amount"], rows: [["1", "North", "400"], ["2", "South", "300"], ["3", "North", "200"], ["4", "East", "100"]] } },
        { code: `SELECT region,
       SUM(amount) AS total,
       ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 2) AS pct
FROM Sales
GROUP BY region
ORDER BY total DESC;`, lang: "sql" },
        { table: { head: ["region", "total", "pct"], rows: [["North", "600", "60.00"], ["South", "300", "30.00"], ["East", "100", "10.00"]] } },
        { p: "Window functions run <i>after</i> GROUP BY. That means <code>SUM(SUM(amount)) OVER ()</code> adds up the per-region sums across all groups (an empty OVER means the whole result), and the grand total 1000 gets attached to every row." },
        { h: "Alternative: scalar subquery" },
        { code: `SELECT region,
       SUM(amount) AS total,
       ROUND(100.0 * SUM(amount) / (SELECT SUM(amount) FROM Sales), 2) AS pct
FROM Sales
GROUP BY region;`, lang: "sql" },
        { warn: "In PostgreSQL, <code>100 * 600 / 1000</code> on integers is fine, but <code>600 / 1000 * 100</code> gives <b>0</b> because of integer division. Put the <code>100.0</code> first, or cast one side to decimal. MySQL's <code>/</code> always returns a decimal." }
      ]
    },
    {
      id: "pivot-rows-to-columns",
      q: "Pivot quarterly sales so there is one row per product and one column per quarter (Q1, Q2, Q3).",
      topic: "Aggregation & GROUP BY",
      level: 2,
      top: true,
      short: "Conditional aggregation: SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS q1, one expression per column, GROUP BY product.",
      a: [
        { table: { head: ["product", "quarter", "amount"], rows: [["Pen", "Q1", "100"], ["Pen", "Q2", "150"], ["Book", "Q1", "200"], ["Book", "Q3", "120"], ["Pen", "Q1", "50"]] } },
        { code: `SELECT product,
       SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS q1,
       SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS q2,
       SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS q3
FROM Sales
GROUP BY product
ORDER BY product;`, lang: "sql" },
        { table: { head: ["product", "q1", "q2", "q3"], rows: [["Book", "200", "0", "120"], ["Pen", "150", "150", "0"]] } },
        { p: "Every row goes into its product's group. Each CASE lets a row's amount count only toward the column for its quarter. Pen's two Q1 rows (100 + 50) add up to 150." },
        { ul: [
          "PostgreSQL has a cleaner form: <code>SUM(amount) FILTER (WHERE quarter = 'Q1')</code>.",
          "SQL Server has a <code>PIVOT</code> operator. MySQL has none, so CASE is the portable answer.",
          "Unpivot (columns back to rows) with <code>UNION ALL</code>: <code>SELECT product, 'Q1', q1 FROM t UNION ALL SELECT product, 'Q2', q2 FROM t ...</code>"
        ] },
        { warn: "With <code>ELSE 0</code>, a missing quarter shows 0. Leave the ELSE out and it shows NULL, which is better if you need to tell \"no sales\" apart from \"sold zero\". The column list is fixed when you write the query. Dynamic columns need dynamic SQL." }
      ]
    },
    {
      id: "department-highest-total-salary",
      q: "Which department has the highest total salary bill? Return its name and total, and handle ties.",
      topic: "Aggregation & GROUP BY",
      level: 2,
      top: false,
      short: "JOIN Department, GROUP BY department, then keep groups whose SUM equals the max SUM (via RANK() or a HAVING subquery). ORDER BY ... LIMIT 1 drops ties.",
      a: [
        { table: { head: ["name", "salary", "dept_id"], rows: [["Asha", "90000", "1"], ["Ravi", "70000", "1"], ["Meena", "80000", "2"], ["Karan", "85000", "2"], ["Divya", "60000", "2"], ["Farhan", "95000", "3"]] } },
        { p: "Department: 1 = Engineering, 2 = Sales, 3 = HR." },
        { code: `WITH totals AS (
    SELECT d.name AS dept, SUM(e.salary) AS total
    FROM Employee e
    JOIN Department d ON d.id = e.dept_id
    GROUP BY d.name
)
SELECT dept, total
FROM (
    SELECT dept, total, RANK() OVER (ORDER BY total DESC) AS rk
    FROM totals
) t
WHERE rk = 1;`, lang: "sql" },
        { table: { head: ["dept", "total"], rows: [["Sales", "225000"]] } },
        { p: "The totals are Engineering 160000, Sales 225000 and HR 95000. RANK gives the top total rank 1, and if two departments tie, both get rank 1." },
        { h: "Without window functions" },
        { code: `SELECT d.name, SUM(e.salary) AS total
FROM Employee e JOIN Department d ON d.id = e.dept_id
GROUP BY d.name
HAVING SUM(e.salary) >= ALL (SELECT SUM(salary) FROM Employee GROUP BY dept_id);`, lang: "sql" },
        { warn: "<code>ORDER BY total DESC LIMIT 1</code> is what most people write first, and it silently returns only one department when two tie. Say this out loud in the interview. (SQL Server: <code>SELECT TOP 1 WITH TIES ...</code>.)" }
      ]
    },
    {
      id: "managers-with-five-reports",
      q: "Find managers who have at least 5 direct reports.",
      topic: "Aggregation & GROUP BY",
      level: 2,
      top: true,
      short: "Self-join Employee e to Employee m ON e.manager_id = m.id, GROUP BY m.id, m.name, then HAVING COUNT(*) >= 5.",
      a: [
        { table: { head: ["id", "name", "manager_id"], rows: [["1", "Asha", "NULL"], ["2", "Ravi", "1"], ["3", "Meena", "1"], ["4", "Karan", "1"], ["5", "Divya", "1"], ["6", "Farhan", "1"], ["7", "Gita", "2"]] } },
        { code: `SELECT m.id, m.name, COUNT(*) AS reports
FROM Employee e
JOIN Employee m ON e.manager_id = m.id
GROUP BY m.id, m.name
HAVING COUNT(*) >= 5;`, lang: "sql" },
        { table: { head: ["id", "name", "reports"], rows: [["1", "Asha", "5"]] } },
        { p: "Each row of <code>e</code> is joined to its manager's row in <code>m</code>. Grouping by the manager counts direct reports: Asha has 5 and Ravi has 1." },
        { h: "Alternative: aggregate first, then look up names" },
        { code: `SELECT id, name
FROM Employee
WHERE id IN (SELECT manager_id
             FROM Employee
             GROUP BY manager_id
             HAVING COUNT(*) >= 5);`, lang: "sql" },
        { warn: "Group by the manager's <b>id</b>, not just their name, or two managers who share a name get merged. The subquery version also produces a NULL group (employees with no manager). That group is harmless here because <code>id IN (NULL)</code> never matches." },
        { tip: "The follow-up is usually about <i>all</i> reports, direct and indirect. That needs a recursive CTE (see the org hierarchy question)." }
      ]
    },

    /* ───────────── Joins ───────────── */
    {
      id: "customers-who-never-ordered",
      q: "Find customers who have never placed an order.",
      topic: "Joins",
      level: 1,
      top: true,
      short: "Anti-join: LEFT JOIN Orders and keep rows WHERE o.id IS NULL, or use NOT EXISTS. Avoid NOT IN when the subquery can return NULL.",
      a: [
        { table: { head: ["Customers.id", "name"], rows: [["1", "Anil"], ["2", "Bhavna"], ["3", "Chirag"], ["4", "Deepa"]] } },
        { table: { head: ["Orders.id", "customer_id", "amount"], rows: [["101", "1", "500"], ["102", "3", "200"], ["103", "1", "150"]] } },
        { code: `SELECT c.name
FROM Customers c
LEFT JOIN Orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`, lang: "sql" },
        { table: { head: ["name"], rows: [["Bhavna"], ["Deepa"]] } },
        { svg: `<svg viewBox="0 0 460 210" width="460" class="dg">
  <text class="tx tx-b" x="80" y="20" text-anchor="middle">Customers</text>
  <text class="tx tx-b" x="370" y="20" text-anchor="middle">Orders</text>
  <rect class="box" x="20" y="40" width="120" height="36" rx="6"/>
  <text class="tx" x="80" y="58" text-anchor="middle" dominant-baseline="middle">1 Anil</text>
  <rect class="box-r" x="20" y="84" width="120" height="36" rx="6"/>
  <text class="tx" x="80" y="102" text-anchor="middle" dominant-baseline="middle">2 Bhavna</text>
  <rect class="box" x="20" y="128" width="120" height="36" rx="6"/>
  <text class="tx" x="80" y="146" text-anchor="middle" dominant-baseline="middle">3 Chirag</text>
  <rect class="box-r" x="20" y="172" width="120" height="36" rx="6"/>
  <text class="tx" x="80" y="190" text-anchor="middle" dominant-baseline="middle">4 Deepa</text>
  <rect class="box" x="300" y="40" width="140" height="36" rx="6"/>
  <text class="tx tx-c" x="370" y="58" text-anchor="middle" dominant-baseline="middle">101 → cust 1</text>
  <rect class="box" x="300" y="84" width="140" height="36" rx="6"/>
  <text class="tx tx-c" x="370" y="102" text-anchor="middle" dominant-baseline="middle">102 → cust 3</text>
  <rect class="box" x="300" y="128" width="140" height="36" rx="6"/>
  <text class="tx tx-c" x="370" y="146" text-anchor="middle" dominant-baseline="middle">103 → cust 1</text>
  <line class="ln-a" x1="140" y1="58" x2="298" y2="58" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="140" y1="58" x2="298" y2="146" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="140" y1="146" x2="298" y2="102" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="220" y="200" text-anchor="middle">no match → o.id IS NULL</text>
</svg>`, caption: "LEFT JOIN keeps unmatched customers with NULLs on the Orders side" },
        { h: "Alternative: NOT EXISTS (often the fastest)" },
        { code: `SELECT c.name
FROM Customers c
WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customer_id = c.id);`, lang: "sql" },
        { warn: "<code>WHERE c.id NOT IN (SELECT customer_id FROM Orders)</code> returns <b>nothing</b> if even one <code>customer_id</code> in Orders is NULL. NOT EXISTS and LEFT JOIN / IS NULL don't have this problem." }
      ]
    },
    {
      id: "departments-with-no-employees",
      q: "List departments that have no employees. Then show the employee count for every department, including 0 for the empty ones.",
      topic: "Joins",
      level: 1,
      top: true,
      short: "Department LEFT JOIN Employee, filter e.id IS NULL (or use NOT EXISTS). For counts, use COUNT(e.id), not COUNT(*), so empty departments show 0.",
      a: [
        { table: { head: ["Department.id", "name"], rows: [["1", "Engineering"], ["2", "Sales"], ["3", "HR"], ["4", "Legal"]] } },
        { p: "The employees' dept_ids are 1, 1, 2, 2, 2, 3. No employee is in Legal." },
        { code: `-- 1) departments with no employees
SELECT d.name
FROM Department d
WHERE NOT EXISTS (SELECT 1 FROM Employee e WHERE e.dept_id = d.id);

-- 2) head-count for every department
SELECT d.name, COUNT(e.id) AS emp_count
FROM Department d
LEFT JOIN Employee e ON e.dept_id = d.id
GROUP BY d.id, d.name
ORDER BY d.id;`, lang: "sql" },
        { table: { head: ["name", "emp_count"], rows: [["Engineering", "2"], ["Sales", "3"], ["HR", "1"], ["Legal", "0"]] } },
        { p: "Query 1 returns just <b>Legal</b>. In query 2, Legal survives the LEFT JOIN as a single row with NULL employee columns. <code>COUNT(e.id)</code> skips that NULL, which gives 0." },
        { warn: "With <code>COUNT(*)</code>, Legal would show <b>1</b>, because the padded row is still a row. Also, the department table has to be on the LEFT side. <code>Employee LEFT JOIN Department</code> can never produce an empty department." }
      ]
    },
    {
      id: "employees-earning-more-than-manager",
      q: "Find employees who earn more than their manager.",
      topic: "Joins",
      level: 1,
      top: true,
      short: "Self-join: Employee e JOIN Employee m ON e.manager_id = m.id WHERE e.salary > m.salary.",
      a: [
        { table: { head: ["id", "name", "salary", "manager_id"], rows: [["1", "Asha", "90000", "NULL"], ["2", "Ravi", "70000", "1"], ["3", "Meena", "80000", "1"], ["4", "Karan", "85000", "3"], ["5", "Divya", "60000", "3"], ["6", "Farhan", "95000", "1"]] } },
        { code: `SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM Employee e
JOIN Employee m ON e.manager_id = m.id
WHERE e.salary > m.salary;`, lang: "sql" },
        { table: { head: ["employee", "salary", "manager", "manager_salary"], rows: [["Karan", "85000", "Meena", "80000"], ["Farhan", "95000", "Asha", "90000"]] } },
        { svg: `<svg viewBox="0 0 480 190" width="480" class="dg">
  <text class="tx tx-b" x="90" y="20" text-anchor="middle">e (employee copy)</text>
  <text class="tx tx-b" x="380" y="20" text-anchor="middle">m (manager copy)</text>
  <rect class="box" x="20" y="36" width="140" height="36" rx="6"/>
  <text class="tx" x="90" y="54" text-anchor="middle" dominant-baseline="middle">Ravi 70k, mgr 1</text>
  <rect class="box-g" x="20" y="88" width="140" height="36" rx="6"/>
  <text class="tx" x="90" y="106" text-anchor="middle" dominant-baseline="middle">Karan 85k, mgr 3</text>
  <rect class="box-g" x="20" y="140" width="140" height="36" rx="6"/>
  <text class="tx" x="90" y="158" text-anchor="middle" dominant-baseline="middle">Farhan 95k, mgr 1</text>
  <rect class="box" x="320" y="60" width="120" height="36" rx="6"/>
  <text class="tx" x="380" y="78" text-anchor="middle" dominant-baseline="middle">1 Asha 90k</text>
  <rect class="box" x="320" y="120" width="120" height="36" rx="6"/>
  <text class="tx" x="380" y="138" text-anchor="middle" dominant-baseline="middle">3 Meena 80k</text>
  <line class="ln ln-d" x1="160" y1="54" x2="318" y2="74" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="160" y1="106" x2="318" y2="136" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="160" y1="158" x2="318" y2="84" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="240" y="182" text-anchor="middle">green = e.salary > m.salary</text>
</svg>`, caption: "Self-join: the same table aliased twice, each row matched to its manager's row" },
        { p: "A self-join treats one table as two logical copies. Each employee row finds its manager's row through <code>manager_id</code>, and the salary comparison then runs on that joined pair." },
        { warn: "Asha has no manager, so the INNER JOIN drops her, which is what we want here. If the question is \"list everyone with their manager's name\", use a LEFT JOIN so the top boss still appears." }
      ]
    },
    {
      id: "employee-with-manager-name",
      q: "List every employee alongside their manager's name. Show 'No manager' for the top of the hierarchy.",
      topic: "Joins",
      level: 1,
      top: false,
      short: "Self LEFT JOIN Employee m ON e.manager_id = m.id, and COALESCE(m.name, 'No manager').",
      a: [
        { code: `SELECT e.name AS employee,
       COALESCE(m.name, 'No manager') AS manager
FROM Employee e
LEFT JOIN Employee m ON e.manager_id = m.id
ORDER BY e.id;`, lang: "sql" },
        { table: { head: ["employee", "manager"], rows: [["Asha", "No manager"], ["Ravi", "Asha"], ["Meena", "Asha"], ["Karan", "Meena"], ["Divya", "Meena"], ["Farhan", "Asha"]] } },
        { p: "This uses the same 6-row Employee table (Asha's manager_id is NULL, Karan and Divya report to Meena, and the others report to Asha). The LEFT JOIN keeps Asha even though no <code>m</code> row matches, and COALESCE replaces the NULL name." },
        { tip: "Interviewers use this to check that you know when to pick LEFT JOIN over INNER JOIN. Say which rows each one would drop." }
      ]
    },
    {
      id: "left-join-on-vs-where",
      q: "List all customers with their 2024 orders, keeping customers who had no 2024 orders. Why does putting the date filter in WHERE give the wrong result?",
      topic: "Joins",
      level: 2,
      top: false,
      short: "Filters on the right table of a LEFT JOIN go in the ON clause. In WHERE, they drop the NULL-padded rows and turn the join into an INNER JOIN.",
      a: [
        { table: { head: ["Customers.id", "name"], rows: [["1", "Anil"], ["2", "Bhavna"], ["3", "Chirag"]] } },
        { table: { head: ["Orders.id", "customer_id", "order_date", "amount"], rows: [["101", "1", "2023-11-02", "500"], ["102", "1", "2024-02-10", "150"], ["103", "3", "2023-05-01", "200"]] } },
        { code: `-- WRONG: behaves like an INNER JOIN
SELECT c.name, o.id, o.order_date
FROM Customers c
LEFT JOIN Orders o ON o.customer_id = c.id
WHERE o.order_date >= '2024-01-01' AND o.order_date < '2025-01-01';

-- RIGHT: filter while joining
SELECT c.name, o.id, o.order_date
FROM Customers c
LEFT JOIN Orders o
       ON o.customer_id = c.id
      AND o.order_date >= '2024-01-01' AND o.order_date < '2025-01-01';`, lang: "sql" },
        { table: { head: ["query", "rows returned"], rows: [["WRONG", "Anil 102 2024-02-10"], ["RIGHT", "Anil 102 2024-02-10<br>Bhavna NULL NULL<br>Chirag NULL NULL"]] } },
        { p: "The LEFT JOIN pads unmatched customers with NULLs, and then WHERE runs. <code>NULL >= '2024-01-01'</code> is UNKNOWN, so those padded rows are thrown away. A condition in ON only decides <i>which orders match</i>. The customer row is kept either way." },
        { tip: "The date range <code>>= '2024-01-01' AND &lt; '2025-01-01'</code> is portable and can use an index. <code>YEAR(order_date) = 2024</code> is MySQL-only (PostgreSQL uses <code>EXTRACT(YEAR FROM ...)</code>) and wraps the column in a function." }
      ]
    },
    {
      id: "self-join-pairs",
      q: "List every pair of employees who work in the same department, each pair once.",
      topic: "Joins",
      level: 2,
      top: false,
      short: "Self-join on dept_id with e1.id < e2.id. The < removes self-pairs (A,A) and mirror duplicates (B,A).",
      a: [
        { table: { head: ["id", "name", "dept_id"], rows: [["1", "Asha", "1"], ["2", "Ravi", "1"], ["3", "Meena", "2"], ["4", "Karan", "2"], ["5", "Divya", "2"], ["6", "Farhan", "3"]] } },
        { code: `SELECT e1.name AS emp1, e2.name AS emp2, e1.dept_id
FROM Employee e1
JOIN Employee e2
  ON e1.dept_id = e2.dept_id
 AND e1.id < e2.id
ORDER BY e1.dept_id, e1.id, e2.id;`, lang: "sql" },
        { table: { head: ["emp1", "emp2", "dept_id"], rows: [["Asha", "Ravi", "1"], ["Meena", "Karan", "2"], ["Meena", "Divya", "2"], ["Karan", "Divya", "2"]] } },
        { svg: `<svg viewBox="0 0 360 170" width="360" class="dg">
  <text class="tx-m" x="215" y="16" text-anchor="middle">e2 →</text>
  <text class="tx tx-b" x="145" y="34" text-anchor="middle">Meena</text>
  <text class="tx tx-b" x="215" y="34" text-anchor="middle">Karan</text>
  <text class="tx tx-b" x="285" y="34" text-anchor="middle">Divya</text>
  <text class="tx tx-b" x="100" y="62" text-anchor="end">e1 Meena</text>
  <text class="tx tx-b" x="100" y="96" text-anchor="end">Karan</text>
  <text class="tx tx-b" x="100" y="130" text-anchor="end">Divya</text>
  <rect class="box-r" x="112" y="46" width="66" height="30" rx="6"/>
  <rect class="box-g" x="182" y="46" width="66" height="30" rx="6"/>
  <rect class="box-g" x="252" y="46" width="66" height="30" rx="6"/>
  <rect class="box" x="112" y="80" width="66" height="30" rx="6"/>
  <rect class="box-r" x="182" y="80" width="66" height="30" rx="6"/>
  <rect class="box-g" x="252" y="80" width="66" height="30" rx="6"/>
  <rect class="box" x="112" y="114" width="66" height="30" rx="6"/>
  <rect class="box" x="182" y="114" width="66" height="30" rx="6"/>
  <rect class="box-r" x="252" y="114" width="66" height="30" rx="6"/>
  <text class="tx-m" x="180" y="164" text-anchor="middle">green: e1.id &lt; e2.id kept · red: self · grey: mirror</text>
</svg>`, caption: "Sales department (3 people): the < condition keeps only the upper triangle, 3 pairs" },
        { p: "A department with <i>n</i> people gives n(n-1)/2 pairs. With <code>&lt;&gt;</code> instead of <code>&lt;</code> you get each pair twice, as (Meena, Karan) and (Karan, Meena). With no condition at all you also get (Meena, Meena)." },
        { tip: "The same pattern answers \"pairs of students in the same course\" and \"find duplicate rows by comparing ids\"." }
      ]
    },
    {
      id: "cross-join-missing-combinations",
      q: "Using Students, Courses and Enrollments, list every student-course combination the student has NOT enrolled in.",
      topic: "Joins",
      level: 2,
      top: false,
      short: "CROSS JOIN Students and Courses to get every possible pair, then anti-join Enrollments (LEFT JOIN ... IS NULL).",
      a: [
        { table: { head: ["Students", "Courses", "Enrollments (student_id, course_id)"], rows: [["1 Ana", "10 DBMS", "(1, 10)"], ["2 Ben", "20 OS", "(1, 20)"], ["", "30 CN", "(2, 30)"]] } },
        { code: `SELECT s.name AS student, c.name AS course
FROM Students s
CROSS JOIN Courses c
LEFT JOIN Enrollments e
       ON e.student_id = s.id AND e.course_id = c.id
WHERE e.student_id IS NULL
ORDER BY s.name, c.name;`, lang: "sql" },
        { table: { head: ["student", "course"], rows: [["Ana", "CN"], ["Ben", "DBMS"], ["Ben", "OS"]] } },
        { p: "The CROSS JOIN produces all 2 × 3 = 6 possible (student, course) pairs. The LEFT JOIN marks the 3 that exist in Enrollments, and the IS NULL filter keeps the other 3." },
        { tip: "\"Generate all combinations, then subtract what exists\" is the standard way to find missing data, for example days with no sales or products never sold in a region. Know that a CROSS JOIN multiplies row counts." }
      ]
    },

    /* ───────────── Subqueries ───────────── */
    {
      id: "second-highest-salary",
      q: "Find the second highest salary. Return NULL if there is none.",
      topic: "Subqueries",
      level: 1,
      top: true,
      short: "SELECT MAX(salary) WHERE salary < (SELECT MAX(salary)), or DISTINCT salary ORDER BY DESC LIMIT 1 OFFSET 1 wrapped in a scalar subquery so an empty result becomes NULL.",
      a: [
        { table: { head: ["id", "name", "salary"], rows: [["1", "Asha", "90000"], ["2", "Ravi", "70000"], ["3", "Meena", "80000"], ["4", "Karan", "85000"], ["5", "Divya", "60000"], ["6", "Farhan", "95000"]] } },
        { code: `-- Approach 1: max below the max
SELECT MAX(salary) AS second_highest
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Approach 2: skip one distinct value
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS second_highest;`, lang: "sql" },
        { table: { head: ["second_highest"], rows: [["90000"]] } },
        { p: "Approach 1 always returns one row, because MAX over an empty set is NULL. In approach 2 the outer <code>SELECT (subquery)</code> does the same job: if the inner query finds nothing, the scalar subquery becomes NULL instead of returning zero rows." },
        { warn: "<b>Ties:</b> if two people earn 95000, <code>ORDER BY salary DESC LIMIT 1 OFFSET 1</code> <i>without</i> DISTINCT returns 95000 again. Always use DISTINCT, or DENSE_RANK." },
        { table: { head: ["Dialect", "Syntax"], rows: [["MySQL / PostgreSQL", "<code>LIMIT 1 OFFSET 1</code>"], ["SQL Server", "<code>OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY</code> (or TOP with a subquery)"], ["Oracle 12c+", "<code>OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY</code>"]] } }
      ]
    },
    {
      id: "not-in-null-trap",
      q: "Find employees who are not managers of anyone. Why does NOT IN (SELECT manager_id FROM Employee) return nothing?",
      topic: "Subqueries",
      level: 2,
      top: false,
      short: "NOT IN against a list containing NULL is never TRUE. Use NOT EXISTS, or filter the NULLs out of the subquery.",
      a: [
        { table: { head: ["id", "name", "manager_id"], rows: [["1", "Asha", "NULL"], ["2", "Ravi", "1"], ["3", "Meena", "1"], ["4", "Karan", "3"], ["5", "Divya", "3"], ["6", "Farhan", "1"]] } },
        { code: `-- Returns ZERO rows (Asha's manager_id is NULL)
SELECT name FROM Employee
WHERE id NOT IN (SELECT manager_id FROM Employee);

-- Correct
SELECT name FROM Employee e
WHERE NOT EXISTS (SELECT 1 FROM Employee r WHERE r.manager_id = e.id);`, lang: "sql" },
        { table: { head: ["name"], rows: [["Ravi"], ["Karan"], ["Divya"], ["Farhan"]] } },
        { p: "<code>2 NOT IN (1, 1, 3, NULL)</code> expands to <code>2&lt;&gt;1 AND 2&lt;&gt;3 AND 2&lt;&gt;NULL</code>. The last comparison is UNKNOWN, so the whole AND is UNKNOWN, never TRUE, and every row is filtered out." },
        { ul: [
          "Fix 1: <code>NOT EXISTS</code> (compares row by row, so NULLs never match).",
          "Fix 2: <code>NOT IN (SELECT manager_id FROM Employee WHERE manager_id IS NOT NULL)</code>.",
          "Fix 3: <code>LEFT JOIN ... WHERE r.id IS NULL</code>."
        ] },
        { tip: "<code>IN</code> is safe with NULLs, because the TRUE matches still come through. Only <code>NOT IN</code> is dangerous." }
      ]
    },
    {
      id: "above-department-average",
      q: "Find employees who earn more than the average salary of their own department.",
      topic: "Subqueries",
      level: 2,
      top: true,
      short: "Correlated subquery: WHERE salary > (SELECT AVG(salary) FROM Employee WHERE dept_id = e.dept_id), or use AVG(salary) OVER (PARTITION BY dept_id).",
      a: [
        { table: { head: ["name", "salary", "dept_id"], rows: [["Asha", "90000", "1"], ["Ravi", "70000", "1"], ["Meena", "80000", "2"], ["Karan", "85000", "2"], ["Divya", "60000", "2"], ["Farhan", "95000", "3"]] } },
        { code: `SELECT e.name, e.salary, e.dept_id
FROM Employee e
WHERE e.salary > (SELECT AVG(i.salary)
                  FROM Employee i
                  WHERE i.dept_id = e.dept_id);`, lang: "sql" },
        { table: { head: ["name", "salary", "dept_id"], rows: [["Asha", "90000", "1"], ["Meena", "80000", "2"], ["Karan", "85000", "2"]] } },
        { p: "The department averages are 80000, 75000 and 95000. The inner query is <b>correlated</b>: it references <code>e.dept_id</code> from the outer row, so conceptually it runs once per outer row. Farhan equals his department's average (he is the only person in it), so he is excluded." },
        { h: "Alternative: window function (one pass)" },
        { code: `SELECT name, salary, dept_id
FROM (
    SELECT name, salary, dept_id,
           AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
    FROM Employee
) t
WHERE salary > dept_avg;`, lang: "sql" },
        { p: "A third option is to join to a derived table: <code>JOIN (SELECT dept_id, AVG(salary) avg_s FROM Employee GROUP BY dept_id) d USING (dept_id)</code>." }
      ]
    },
    {
      id: "highest-salary-per-department",
      q: "For each department, show the employee(s) with the highest salary, with the department name.",
      topic: "Subqueries",
      level: 2,
      top: true,
      short: "Match (dept_id, salary) against SELECT dept_id, MAX(salary) ... GROUP BY dept_id, or use RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) = 1. Both keep ties.",
      a: [
        { p: "This uses the same Employee table. Department: 1 = Engineering, 2 = Sales, 3 = HR." },
        { code: `SELECT d.name AS department, e.name AS employee, e.salary
FROM Employee e
JOIN Department d ON d.id = e.dept_id
WHERE (e.dept_id, e.salary) IN (
    SELECT dept_id, MAX(salary)
    FROM Employee
    GROUP BY dept_id
);`, lang: "sql" },
        { table: { head: ["department", "employee", "salary"], rows: [["Engineering", "Asha", "90000"], ["Sales", "Karan", "85000"], ["HR", "Farhan", "95000"]] } },
        { h: "Alternative: window function" },
        { code: `SELECT department, employee, salary
FROM (
    SELECT d.name AS department, e.name AS employee, e.salary,
           RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rk
    FROM Employee e JOIN Department d ON d.id = e.dept_id
) t
WHERE rk = 1;`, lang: "sql" },
        { warn: "<code>SELECT dept_id, name, MAX(salary) FROM Employee GROUP BY dept_id</code> is wrong. <code>name</code> is not aggregated, so MySQL's ONLY_FULL_GROUP_BY and PostgreSQL both reject it. Older MySQL returned an <i>arbitrary</i> name that did not have to belong to the max-salary row." },
        { tip: "Both answers above return every employee tied at the top. With ROW_NUMBER you would get just one per department. Ask the interviewer which behaviour they want." }
      ]
    },
    {
      id: "customers-bought-all-products",
      q: "Find customers who have bought every product in the Products table (relational division).",
      topic: "Subqueries",
      level: 3,
      top: true,
      short: "GROUP BY customer HAVING COUNT(DISTINCT product_id) = (SELECT COUNT(*) FROM Products). The classic alternative is a double NOT EXISTS.",
      a: [
        { table: { head: ["Products.id", "name"], rows: [["1", "Pen"], ["2", "Book"], ["3", "Bag"]] } },
        { table: { head: ["customer_id", "product_id"], rows: [["1", "1"], ["1", "2"], ["1", "3"], ["2", "1"], ["2", "1"], ["2", "2"], ["3", "3"]] } },
        { code: `SELECT customer_id
FROM Purchases
GROUP BY customer_id
HAVING COUNT(DISTINCT product_id) = (SELECT COUNT(*) FROM Products);`, lang: "sql" },
        { table: { head: ["customer_id"], rows: [["1"]] } },
        { p: "Customer 1 has 3 distinct products, which matches the 3 in the catalogue. Customer 2 has 3 purchase <i>rows</i> but only 2 distinct products." },
        { warn: "Using <code>COUNT(*)</code> instead of <code>COUNT(DISTINCT product_id)</code> wrongly returns customer 2, because the repeat purchase of Pen gets counted twice. If Purchases can contain product_ids that are not in Products, join to Products first." },
        { h: "Alternative: double NOT EXISTS" },
        { code: `-- customers for whom there is no product they have not bought
SELECT c.id
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 FROM Products p
    WHERE NOT EXISTS (
        SELECT 1 FROM Purchases x
        WHERE x.customer_id = c.id AND x.product_id = p.id
    )
);`, lang: "sql" },
        { tip: "Call it \"relational division\" by name. It is the SQL form of a \"for all\" condition, which SQL lacks directly, so it is written as \"there does not exist a counter-example\"." }
      ]
    },

    /* ───────────── Window Functions ───────────── */
    {
      id: "difference-from-department-average",
      q: "Show every employee with their department's average salary and how far above or below it they are, without collapsing the rows.",
      topic: "Window Functions",
      level: 1,
      top: false,
      short: "AVG(salary) OVER (PARTITION BY dept_id) attaches the group average to each row. GROUP BY would collapse the rows.",
      a: [
        { code: `SELECT name, dept_id, salary,
       AVG(salary) OVER (PARTITION BY dept_id)          AS dept_avg,
       salary - AVG(salary) OVER (PARTITION BY dept_id) AS diff
FROM Employee
ORDER BY dept_id, salary DESC;`, lang: "sql" },
        { table: { head: ["name", "dept_id", "salary", "dept_avg", "diff"], rows: [["Asha", "1", "90000", "80000", "10000"], ["Ravi", "1", "70000", "80000", "-10000"], ["Karan", "2", "85000", "75000", "10000"], ["Meena", "2", "80000", "75000", "5000"], ["Divya", "2", "60000", "75000", "-15000"], ["Farhan", "3", "95000", "95000", "0"]] } },
        { p: "A window function computes over a set of related rows (the <b>partition</b>) but, unlike GROUP BY, it returns one output row per input row. <code>PARTITION BY</code> works like GROUP BY without the collapsing, and <code>ORDER BY</code> inside OVER sets the order for running and ranking functions." },
        { table: { head: ["", "GROUP BY", "Window (OVER)"], rows: [["Rows out", "one per group", "one per input row"], ["Can show non-grouped columns", "no", "yes"], ["Evaluated", "before SELECT", "after WHERE / GROUP BY / HAVING"]] } },
        { tip: "In MySQL 8 and PostgreSQL you can name a window once and reuse it: <code>... OVER w ... WINDOW w AS (PARTITION BY dept_id)</code>." }
      ]
    },
    {
      id: "running-total",
      q: "Compute a running (cumulative) total of daily order amounts.",
      topic: "Window Functions",
      level: 2,
      top: true,
      short: "SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). Add PARTITION BY to restart the total per group.",
      a: [
        { table: { head: ["order_date", "amount"], rows: [["2024-01-01", "100"], ["2024-01-02", "50"], ["2024-01-03", "200"], ["2024-01-04", "150"], ["2024-01-05", "100"]] } },
        { code: `SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM DailyOrders
ORDER BY order_date;`, lang: "sql" },
        { table: { head: ["order_date", "amount", "running_total"], rows: [["2024-01-01", "100", "100"], ["2024-01-02", "50", "150"], ["2024-01-03", "200", "350"], ["2024-01-04", "150", "500"], ["2024-01-05", "100", "600"]] } },
        { svg: `<svg viewBox="0 0 560 120" width="560" class="dg">
  <text class="tx-a" x="221" y="18" text-anchor="middle">frame for row 4: UNBOUNDED PRECEDING → CURRENT ROW</text>
  <polyline class="ln-a" points="20,40 20,28 422,28 422,40"/>
  <rect class="box-a" x="20" y="46" width="90" height="36" rx="6"/>
  <text class="tx" x="65" y="64" text-anchor="middle" dominant-baseline="middle">d1 · 100</text>
  <rect class="box-a" x="124" y="46" width="90" height="36" rx="6"/>
  <text class="tx" x="169" y="64" text-anchor="middle" dominant-baseline="middle">d2 · 50</text>
  <rect class="box-a" x="228" y="46" width="90" height="36" rx="6"/>
  <text class="tx" x="273" y="64" text-anchor="middle" dominant-baseline="middle">d3 · 200</text>
  <rect class="box-g" x="332" y="46" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="377" y="64" text-anchor="middle" dominant-baseline="middle">d4 · 150</text>
  <rect class="box" x="436" y="46" width="90" height="36" rx="6"/>
  <text class="tx" x="481" y="64" text-anchor="middle" dominant-baseline="middle">d5 · 100</text>
  <text class="tx-m" x="65" y="104" text-anchor="middle">100</text>
  <text class="tx-m" x="169" y="104" text-anchor="middle">150</text>
  <text class="tx-m" x="273" y="104" text-anchor="middle">350</text>
  <text class="tx tx-b" x="377" y="104" text-anchor="middle">500</text>
  <text class="tx-m" x="481" y="104" text-anchor="middle">600</text>
</svg>`, caption: "The frame starts at the first row and grows by one row each step" },
        { p: "For each row the frame covers every row from the start of the partition up to the current one, and SUM adds them. Use <code>PARTITION BY customer_id</code> to get a separate running total per customer." },
        { warn: "Without an explicit frame, the default when ORDER BY is present is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. RANGE treats rows with the <b>same</b> order_date as peers and includes them all at once, so two orders on the same day both show the day's full total. Use ROWS, or add a unique tie-breaker to the ORDER BY." },
        { h: "Without window functions (pre-MySQL 8)" },
        { code: `SELECT a.order_date, a.amount,
       (SELECT SUM(b.amount) FROM DailyOrders b
        WHERE b.order_date <= a.order_date) AS running_total
FROM DailyOrders a
ORDER BY a.order_date;`, lang: "sql" },
        { p: "The correlated-subquery version is O(n²). The window version sorts once and scans once." }
      ]
    },
    {
      id: "moving-average",
      q: "Compute a 3-day moving average of daily sales.",
      topic: "Window Functions",
      level: 2,
      top: true,
      short: "AVG(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW). The first rows average fewer values, and ROWS counts rows, not calendar days.",
      a: [
        { table: { head: ["day", "amount"], rows: [["2024-01-01", "100"], ["2024-01-02", "200"], ["2024-01-03", "300"], ["2024-01-04", "100"], ["2024-01-05", "400"], ["2024-01-06", "200"]] } },
        { code: `SELECT day, amount,
       ROUND(AVG(amount) OVER (ORDER BY day
                               ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS mov_avg_3d
FROM DailySales
ORDER BY day;`, lang: "sql" },
        { table: { head: ["day", "amount", "mov_avg_3d"], rows: [["2024-01-01", "100", "100.00"], ["2024-01-02", "200", "150.00"], ["2024-01-03", "300", "200.00"], ["2024-01-04", "100", "200.00"], ["2024-01-05", "400", "266.67"], ["2024-01-06", "200", "233.33"]] } },
        { svg: `<svg viewBox="0 0 560 130" width="560" class="dg">
  <text class="tx-a" x="234" y="16" text-anchor="middle">row d4: avg(200, 300, 100) = 200</text>
  <polyline class="ln-a" points="108,40 108,26 360,26 360,40"/>
  <rect class="box" x="20" y="46" width="76" height="36" rx="6"/>
  <text class="tx" x="58" y="64" text-anchor="middle" dominant-baseline="middle">100</text>
  <rect class="box-a" x="108" y="46" width="76" height="36" rx="6"/>
  <text class="tx" x="146" y="64" text-anchor="middle" dominant-baseline="middle">200</text>
  <rect class="box-a" x="196" y="46" width="76" height="36" rx="6"/>
  <text class="tx" x="234" y="64" text-anchor="middle" dominant-baseline="middle">300</text>
  <rect class="box-a" x="284" y="46" width="76" height="36" rx="6"/>
  <text class="tx" x="322" y="64" text-anchor="middle" dominant-baseline="middle">100</text>
  <rect class="box" x="372" y="46" width="76" height="36" rx="6"/>
  <text class="tx" x="410" y="64" text-anchor="middle" dominant-baseline="middle">400</text>
  <rect class="box" x="460" y="46" width="76" height="36" rx="6"/>
  <text class="tx" x="498" y="64" text-anchor="middle" dominant-baseline="middle">200</text>
  <polyline class="ln ln-d" points="196,88 196,100 448,100 448,88"/>
  <text class="tx-m" x="322" y="120" text-anchor="middle">row d5: window slides → avg(300, 100, 400) = 266.67</text>
</svg>`, caption: "A fixed-size 3-row frame slides forward one row at a time" },
        { p: "The frame <code>2 PRECEDING AND CURRENT ROW</code> always holds at most 3 rows. For the first two days it holds only 1 and 2 rows, which is why day 1 is just 100." },
        { warn: "<b>Missing dates:</b> ROWS counts physical rows. If 2024-01-03 were missing, the \"3-day\" window for 01-04 would reach back to 01-01. To count calendar days, use a range frame (<code>RANGE BETWEEN INTERVAL 2 DAY PRECEDING AND CURRENT ROW</code> in MySQL 8, <code>INTERVAL '2 days'</code> in PostgreSQL 11+), or fill the gaps with a calendar table first." },
        { tip: "If the interviewer wants only full windows, return NULL until 3 rows exist: <code>CASE WHEN COUNT(*) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) = 3 THEN ... END</code>." }
      ]
    },
    {
      id: "lag-lead-previous-next-row",
      q: "For each day, show the previous and next day's stock price and the change from the previous day.",
      topic: "Window Functions",
      level: 2,
      top: true,
      short: "LAG(price) OVER (ORDER BY day) reads the previous row and LEAD(price) the next. price - LAG(price) gives the change. The first row gets NULL unless you pass a default.",
      a: [
        { table: { head: ["day", "price"], rows: [["2024-01-01", "100"], ["2024-01-02", "105"], ["2024-01-03", "102"], ["2024-01-04", "110"], ["2024-01-05", "110"]] } },
        { code: `SELECT day, price,
       LAG(price)  OVER (ORDER BY day)          AS prev_price,
       LEAD(price) OVER (ORDER BY day)          AS next_price,
       price - LAG(price) OVER (ORDER BY day)   AS price_change
FROM Stock
ORDER BY day;`, lang: "sql" },
        { table: { head: ["day", "price", "prev_price", "next_price", "price_change"], rows: [["2024-01-01", "100", "NULL", "105", "NULL"], ["2024-01-02", "105", "100", "102", "5"], ["2024-01-03", "102", "105", "110", "-3"], ["2024-01-04", "110", "102", "110", "8"], ["2024-01-05", "110", "110", "NULL", "0"]] } },
        { ul: [
          "Full signature: <code>LAG(expr, offset, default)</code>. For example, <code>LAG(price, 1, price)</code> makes the first row's change 0 instead of NULL.",
          "<code>LAG(price, 7)</code> looks 7 rows back (week-over-week if you have one row per day).",
          "To find the days when the price rose, put the query in a subquery and filter <code>WHERE price_change > 0</code>. A window function cannot go in WHERE directly."
        ] },
        { h: "Alternative: self-join on the date" },
        { code: `SELECT t.day, t.price, y.price AS prev_price
FROM Stock t
LEFT JOIN Stock y ON y.day = t.day - INTERVAL 1 DAY;   -- PostgreSQL: t.day - 1`, lang: "sql" },
        { warn: "The self-join matches <i>calendar</i> yesterday, while LAG matches the <i>previous row</i>. They differ on weekends and gaps, so make sure you know which one the question asks for." }
      ]
    },
    {
      id: "first-and-last-order-per-customer",
      q: "For each customer, show the date and amount of their first and last order.",
      topic: "Window Functions",
      level: 2,
      top: true,
      short: "ROW_NUMBER() per customer ordered ASC and DESC, then pick rn = 1 for each. FIRST_VALUE/LAST_VALUE also work, but LAST_VALUE needs a full frame.",
      a: [
        { table: { head: ["id", "customer_id", "order_date", "amount"], rows: [["101", "1", "2024-01-05", "500"], ["102", "1", "2024-02-10", "150"], ["103", "1", "2024-03-15", "300"], ["104", "2", "2024-01-20", "200"], ["105", "2", "2024-04-01", "250"], ["106", "3", "2024-02-28", "100"]] } },
        { code: `WITH r AS (
    SELECT o.*,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date)      AS rn_first,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn_last
    FROM Orders o
)
SELECT customer_id,
       MAX(CASE WHEN rn_first = 1 THEN order_date END) AS first_date,
       MAX(CASE WHEN rn_first = 1 THEN amount END)     AS first_amount,
       MAX(CASE WHEN rn_last  = 1 THEN order_date END) AS last_date,
       MAX(CASE WHEN rn_last  = 1 THEN amount END)     AS last_amount
FROM r
GROUP BY customer_id;`, lang: "sql" },
        { table: { head: ["customer_id", "first_date", "first_amount", "last_date", "last_amount"], rows: [["1", "2024-01-05", "500", "2024-03-15", "300"], ["2", "2024-01-20", "200", "2024-04-01", "250"], ["3", "2024-02-28", "100", "2024-02-28", "100"]] } },
        { p: "Each customer has exactly one row with rn_first = 1 and one with rn_last = 1. The <code>MAX(CASE ...)</code> step folds those two rows into one output row. If you only need the dates, <code>MIN(order_date)</code> and <code>MAX(order_date)</code> are enough. The window functions are needed to carry along the <i>other</i> columns of that row." },
        { h: "Alternative: FIRST_VALUE / LAST_VALUE" },
        { code: `SELECT DISTINCT customer_id,
       FIRST_VALUE(amount) OVER w AS first_amount,
       LAST_VALUE(amount)  OVER w AS last_amount
FROM Orders
WINDOW w AS (PARTITION BY customer_id ORDER BY order_date
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING);`, lang: "sql" },
        { warn: "<code>LAST_VALUE</code> with the default frame (which ends at the CURRENT ROW) just returns the current row's value. This is the most common window-function bug. Either widen the frame to UNBOUNDED FOLLOWING, or use <code>FIRST_VALUE(...) OVER (ORDER BY order_date DESC)</code>." }
      ]
    },
    {
      id: "month-over-month-growth",
      q: "Compute monthly revenue and the month-over-month growth percentage.",
      topic: "Window Functions",
      level: 3,
      top: true,
      short: "Aggregate by month in a CTE, then compute 100.0 * (revenue - LAG(revenue)) / LAG(revenue) OVER (ORDER BY month). Guard against division by zero with NULLIF.",
      a: [
        { table: { head: ["order_date", "amount"], rows: [["2024-01-05", "100"], ["2024-01-20", "100"], ["2024-02-11", "250"], ["2024-03-02", "150"], ["2024-03-18", "150"], ["2024-04-09", "330"]] } },
        { code: `WITH monthly AS (
    SELECT DATE_FORMAT(order_date, '%Y-%m') AS month,   -- PostgreSQL: TO_CHAR(order_date, 'YYYY-MM')
           SUM(amount) AS revenue
    FROM Orders
    GROUP BY month
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 2) AS growth_pct
FROM monthly
ORDER BY month;`, lang: "sql" },
        { table: { head: ["month", "revenue", "prev_revenue", "growth_pct"], rows: [["2024-01", "200", "NULL", "NULL"], ["2024-02", "250", "200", "25.00"], ["2024-03", "300", "250", "20.00"], ["2024-04", "330", "300", "10.00"]] } },
        { p: "Step 1 collapses the orders into one row per month. Step 2 uses LAG to pull the previous month's revenue onto the current row, so the growth formula is plain arithmetic. The 'YYYY-MM' strings sort correctly as text." },
        { warn: "<b>Missing months:</b> if March had no orders, LAG would compare April with February and call it month-over-month. Build a month calendar (recursive CTE or <code>generate_series</code> in PostgreSQL) and LEFT JOIN to it so empty months show 0." },
        { tip: "Year-over-year growth uses the same pattern with <code>LAG(revenue, 12)</code>, or a self-join on the same month of the previous year." }
      ]
    },
    {
      id: "cumulative-distinct-count",
      q: "For each day, show the cumulative number of distinct users seen so far.",
      topic: "Window Functions",
      level: 3,
      top: false,
      short: "COUNT(DISTINCT) OVER (ORDER BY ...) is not supported. Instead, find each user's first-seen day with MIN, count new users per day, and run SUM() OVER that count.",
      a: [
        { table: { head: ["user_id", "login_date"], rows: [["1", "2024-01-01"], ["2", "2024-01-01"], ["1", "2024-01-02"], ["3", "2024-01-02"], ["2", "2024-01-03"], ["1", "2024-01-03"]] } },
        { code: `WITH first_seen AS (
    SELECT user_id, MIN(login_date) AS first_day
    FROM Logins
    GROUP BY user_id
),
days AS (
    SELECT DISTINCT login_date AS day FROM Logins
)
SELECT d.day,
       COUNT(f.user_id)                            AS new_users,
       SUM(COUNT(f.user_id)) OVER (ORDER BY d.day) AS cumulative_users
FROM days d
LEFT JOIN first_seen f ON f.first_day = d.day
GROUP BY d.day
ORDER BY d.day;`, lang: "sql" },
        { table: { head: ["day", "new_users", "cumulative_users"], rows: [["2024-01-01", "2", "2"], ["2024-01-02", "1", "3"], ["2024-01-03", "0", "3"]] } },
        { p: "A user counts toward the distinct total only once, on their first day. Summing \"new users per day\" as a running total therefore gives the running distinct count. The <code>days</code> CTE with a LEFT JOIN keeps days with 0 new users." },
        { h: "Alternative: correlated subquery (simple, O(n²))" },
        { code: `SELECT d.day,
       (SELECT COUNT(DISTINCT l.user_id) FROM Logins l WHERE l.login_date <= d.day) AS cumulative_users
FROM (SELECT DISTINCT login_date AS day FROM Logins) d
ORDER BY d.day;`, lang: "sql" },
        { warn: "<code>COUNT(DISTINCT user_id) OVER (ORDER BY day)</code> raises an error in both MySQL and PostgreSQL. DISTINCT is not allowed inside window aggregates there." }
      ]
    },

    /* ───────────── Ranking & Top-N ───────────── */
    {
      id: "rank-vs-dense-rank-vs-row-number",
      q: "Demonstrate the difference between ROW_NUMBER(), RANK() and DENSE_RANK() on scores with ties.",
      topic: "Ranking & Top-N",
      level: 1,
      top: true,
      short: "ROW_NUMBER is always unique (1,2,3,4); RANK gives ties the same number and leaves gaps (1,1,3); DENSE_RANK gives ties the same number with no gaps (1,1,2).",
      a: [
        { table: { head: ["name", "score"], rows: [["Ana", "90"], ["Ben", "85"], ["Cara", "90"], ["Dev", "80"], ["Eli", "85"]] } },
        { code: `SELECT name, score,
       ROW_NUMBER() OVER (ORDER BY score DESC, name) AS row_num,
       RANK()       OVER (ORDER BY score DESC)       AS rnk,
       DENSE_RANK() OVER (ORDER BY score DESC)       AS dense_rnk
FROM Scores
ORDER BY score DESC, name;`, lang: "sql" },
        { table: { head: ["name", "score", "row_num", "rnk", "dense_rnk"], rows: [["Ana", "90", "1", "1", "1"], ["Cara", "90", "2", "1", "1"], ["Ben", "85", "3", "3", "2"], ["Eli", "85", "4", "3", "2"], ["Dev", "80", "5", "5", "3"]] } },
        { table: { head: ["Function", "Ties", "Gaps", "Use it for"], rows: [["ROW_NUMBER", "different numbers (arbitrary unless tie-broken)", "no", "dedup, pagination, exactly N rows"], ["RANK", "same number", "yes (1,1,3)", "competition ranking"], ["DENSE_RANK", "same number", "no (1,1,2)", "Nth highest <i>distinct</i> value"]] } },
        { warn: "ROW_NUMBER over tied values is <b>non-deterministic</b>. Ana and Cara can swap between runs unless you add a tie-breaker (<code>, name</code> or <code>, id</code>) to the ORDER BY." },
        { tip: "Related functions: <code>NTILE(n)</code> splits rows into n buckets, and <code>PERCENT_RANK()</code> and <code>CUME_DIST()</code> give relative position from 0 to 1." }
      ]
    },
    {
      id: "nth-highest-salary",
      q: "Write a query for the Nth highest distinct salary (for example, N = 3).",
      topic: "Ranking & Top-N",
      level: 2,
      top: true,
      short: "DENSE_RANK() OVER (ORDER BY salary DESC) and filter rank = N, or DISTINCT salary ORDER BY DESC LIMIT 1 OFFSET N-1.",
      a: [
        { table: { head: ["id", "salary"], rows: [["1", "70000"], ["2", "90000"], ["3", "90000"], ["4", "80000"], ["5", "60000"]] } },
        { code: `-- N = 3
SELECT DISTINCT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk
    FROM Employee
) t
WHERE rk = 3;`, lang: "sql" },
        { table: { head: ["salary"], rows: [["70000"]] } },
        { p: "DENSE_RANK assigns 90000 → 1 (both rows), 80000 → 2, 70000 → 3 and 60000 → 4. DISTINCT collapses the tied rows. Wrap the query as <code>SELECT (...)</code> if the answer must be NULL when fewer than N distinct salaries exist." },
        { h: "Other approaches" },
        { code: `-- LIMIT / OFFSET (N-1 must be a literal or a variable)
SELECT DISTINCT salary FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 2;

-- Correlated count: exactly N-1 distinct salaries are higher
SELECT DISTINCT salary FROM Employee e1
WHERE 2 = (SELECT COUNT(DISTINCT e2.salary)
           FROM Employee e2
           WHERE e2.salary > e1.salary);`, lang: "sql" },
        { warn: "Using <code>RANK</code> or dropping DISTINCT breaks on ties. <code>ORDER BY salary DESC LIMIT 1 OFFSET 2</code> without DISTINCT returns <b>80000</b> here, because 90000 fills the first two positions. In a MySQL function, LIMIT cannot take an expression like <code>N-1</code>, so do <code>SET N = N - 1;</code> first." }
      ]
    },
    {
      id: "top-three-salaries-per-department",
      q: "Find employees who earn one of the top 3 distinct salaries in their department.",
      topic: "Ranking & Top-N",
      level: 2,
      top: true,
      short: "DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) <= 3 in a subquery. Use ROW_NUMBER instead if you want exactly 3 people.",
      a: [
        { table: { head: ["name", "salary", "dept_id"], rows: [["Asha", "90000", "1"], ["Ravi", "70000", "1"], ["Isha", "70000", "1"], ["Om", "60000", "1"], ["Zoya", "50000", "1"], ["Meena", "80000", "2"], ["Karan", "85000", "2"]] } },
        { code: `SELECT dept_id, name, salary
FROM (
    SELECT e.*,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rk
    FROM Employee e
) t
WHERE rk <= 3
ORDER BY dept_id, salary DESC, name;`, lang: "sql" },
        { table: { head: ["dept_id", "name", "salary"], rows: [["1", "Asha", "90000"], ["1", "Isha", "70000"], ["1", "Ravi", "70000"], ["1", "Om", "60000"], ["2", "Karan", "85000"], ["2", "Meena", "80000"]] } },
        { p: "PARTITION BY restarts the ranking for each department. In dept 1 the distinct salaries 90000, 70000 and 60000 get ranks 1, 2 and 3, so four people qualify. Dept 2 has only two people, and both are returned." },
        { table: { head: ["Function", "Dept 1 result"], rows: [["DENSE_RANK &lt;= 3", "Asha, Ravi, Isha, Om (top 3 <i>salaries</i>)"], ["RANK &lt;= 3", "Asha, Ravi, Isha (Om is rank 4)"], ["ROW_NUMBER &lt;= 3", "Asha + one of Ravi/Isha + the other (exactly 3 people)"]] } },
        { h: "Without window functions" },
        { code: `SELECT e.dept_id, e.name, e.salary
FROM Employee e
WHERE 3 > (SELECT COUNT(DISTINCT e2.salary)
           FROM Employee e2
           WHERE e2.dept_id = e.dept_id AND e2.salary > e.salary);`, lang: "sql" },
        { tip: "Ask \"top 3 salaries or top 3 people?\" before you write the query. The answer tells you which ranking function to use." }
      ]
    },
    {
      id: "second-most-recent-order",
      q: "For each customer, return their second most recent order. Then change it so customers with a single order return that order.",
      topic: "Ranking & Top-N",
      level: 2,
      top: false,
      short: "ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 2. For the fallback, also keep rows where COUNT(*) OVER (PARTITION BY customer_id) = 1.",
      a: [
        { p: "This uses the Orders table from the first/last order problem (customer 1 has 3 orders, customer 2 has 2, customer 3 has 1)." },
        { code: `SELECT customer_id, id AS order_id, order_date
FROM (
    SELECT o.*,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn,
           COUNT(*)     OVER (PARTITION BY customer_id)                          AS cnt
    FROM Orders o
) t
WHERE rn = 2            -- plain version
   OR cnt = 1           -- fallback: only one order -> return it
ORDER BY customer_id;`, lang: "sql" },
        { table: { head: ["customer_id", "order_id", "order_date"], rows: [["1", "102", "2024-02-10"], ["2", "104", "2024-01-20"], ["3", "106", "2024-02-28"]] } },
        { p: "Without the <code>OR cnt = 1</code> line, customer 3 is missing from the output. Sorting DESC means rn = 1 is the latest order and rn = 2 the one before it." },
        { warn: "If a customer can place two orders on the same date, add a tie-breaker (<code>ORDER BY order_date DESC, id DESC</code>). Otherwise \"second most recent\" can change between runs." }
      ]
    },
    {
      id: "median-salary",
      q: "Find the median salary without a built-in MEDIAN function.",
      topic: "Ranking & Top-N",
      level: 3,
      top: true,
      short: "Number the rows with ROW_NUMBER and get the count n with COUNT(*) OVER (), then AVG the rows at positions FLOOR((n+1)/2) and CEIL((n+1)/2). This covers both odd and even n.",
      a: [
        { table: { head: ["name", "salary"], rows: [["Divya", "60000"], ["Ravi", "70000"], ["Meena", "80000"], ["Karan", "85000"], ["Asha", "90000"], ["Farhan", "95000"]] } },
        { code: `WITH r AS (
    SELECT salary,
           ROW_NUMBER() OVER (ORDER BY salary) AS rn,
           COUNT(*)     OVER ()                AS cnt
    FROM Employee
)
SELECT AVG(salary) AS median
FROM r
WHERE rn IN (FLOOR((cnt + 1) / 2.0), CEIL((cnt + 1) / 2.0));`, lang: "sql" },
        { table: { head: ["median"], rows: [["82500"]] } },
        { p: "With n = 6, (n+1)/2 = 3.5, so the query picks rows 3 and 4 (80000 and 85000) and averages them to 82500. With odd n, say 5, (n+1)/2 = 3, FLOOR and CEIL both give 3, and AVG of one row is that row's value." },
        { warn: "Write <code>2.0</code>, not <code>2</code>. In PostgreSQL <code>(6 + 1) / 2</code> is integer division and gives 3, so CEIL also gives 3 and the median becomes 80000." },
        { h: "Built-ins" },
        { ul: [
          "PostgreSQL: <code>PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)</code>",
          "MySQL 8: no median function, so use the ROW_NUMBER query above.",
          "Median per department: add <code>PARTITION BY dept_id</code> to both windows and <code>GROUP BY dept_id</code> in the outer query."
        ] }
      ]
    },
    {
      id: "percentile-50th-and-quartiles",
      q: "Compute the 50th and 90th percentile salaries, and split employees into salary quartiles.",
      topic: "Ranking & Top-N",
      level: 3,
      top: false,
      short: "PostgreSQL: PERCENTILE_CONT(p) (interpolated) or PERCENTILE_DISC(p) (an actual value) WITHIN GROUP (ORDER BY salary). MySQL: filter CUME_DIST() >= p. Quartiles: NTILE(4).",
      a: [
        { p: "This uses the same six salaries: 60000, 70000, 80000, 85000, 90000, 95000." },
        { code: `-- PostgreSQL (ordered-set aggregates)
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS p50_cont,
       PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY salary) AS p50_disc,
       PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY salary) AS p90_cont
FROM Employee;`, lang: "sql" },
        { table: { head: ["p50_cont", "p50_disc", "p90_cont"], rows: [["82500", "80000", "92500"]] } },
        { p: "<b>CONT</b> interpolates between neighbouring values: position 0.5 × (6 − 1) = 2.5 lies halfway between 80000 and 85000. <b>DISC</b> returns the first actual value whose cumulative distribution is ≥ 0.5, which is 80000 (3 of 6 rows). For p90, position 0.9 × 5 = 4.5 lies between 90000 and 95000, giving 92500." },
        { code: `-- MySQL 8: discrete percentile via CUME_DIST
SELECT MIN(salary) AS p50_disc
FROM (SELECT salary, CUME_DIST() OVER (ORDER BY salary) AS cd FROM Employee) t
WHERE cd >= 0.5;

-- Quartiles (both dialects)
SELECT name, salary, NTILE(4) OVER (ORDER BY salary) AS quartile
FROM Employee;`, lang: "sql" },
        { table: { head: ["salary", "quartile"], rows: [["60000", "1"], ["70000", "1"], ["80000", "2"], ["85000", "2"], ["90000", "3"], ["95000", "4"]] } },
        { warn: "NTILE splits by <i>row count</i>, not by value. Six rows into 4 buckets gives sizes 2, 2, 1, 1, and tied salaries can end up in different buckets. For value-based cut-offs, compute percentiles instead." }
      ]
    },

    /* ───────────── Dates & Time ───────────── */
    {
      id: "hired-in-last-30-days",
      q: "Find employees hired in the last 30 days.",
      topic: "Dates & Time",
      level: 1,
      top: true,
      short: "WHERE hire_date >= CURRENT_DATE - INTERVAL '30' DAY AND hire_date <= CURRENT_DATE. Compare the bare column against computed dates so an index can be used.",
      a: [
        { p: "Assume today is <b>2024-06-30</b>." },
        { table: { head: ["name", "hire_date"], rows: [["Asha", "2024-01-10"], ["Ravi", "2024-06-05"], ["Meena", "2024-06-28"], ["Karan", "2024-05-31"], ["Divya", "2024-07-02"]] } },
        { code: `SELECT name, hire_date
FROM Employee
WHERE hire_date >= CURRENT_DATE - INTERVAL '30' DAY
  AND hire_date <= CURRENT_DATE;

-- MySQL shorthand:      hire_date >= CURDATE() - INTERVAL 30 DAY
-- PostgreSQL shorthand: hire_date >= CURRENT_DATE - 30`, lang: "sql" },
        { table: { head: ["name", "hire_date"], rows: [["Ravi", "2024-06-05"], ["Meena", "2024-06-28"], ["Karan", "2024-05-31"]] } },
        { p: "2024-06-30 minus 30 days is 2024-05-31, and <code>>=</code> makes that boundary inclusive, so Karan is included. Divya's future joining date is excluded by the upper bound." },
        { warn: "<b>Timestamps:</b> if <code>hire_date</code> is a DATETIME, <code>&lt;= CURRENT_DATE</code> means &lt;= today 00:00 and misses everyone hired later today. Use <code>&lt; CURRENT_DATE + INTERVAL '1' DAY</code>. Also avoid <code>DATEDIFF(CURDATE(), hire_date) &lt;= 30</code> on large tables: wrapping the column in a function prevents index use." },
        { table: { head: ["Task", "MySQL", "PostgreSQL"], rows: [["today", "<code>CURDATE()</code>", "<code>CURRENT_DATE</code>"], ["days between", "<code>DATEDIFF(a, b)</code>", "<code>a - b</code> (dates → int)"], ["add interval", "<code>d + INTERVAL 1 MONTH</code>", "<code>d + INTERVAL '1 month'</code>"], ["SQL Server", "<code>DATEADD(day, -30, GETDATE())</code>", ""]] } }
      ]
    },
    {
      id: "year-wise-count",
      q: "Count orders per year, including years with zero orders.",
      topic: "Dates & Time",
      level: 1,
      top: false,
      short: "GROUP BY EXTRACT(YEAR FROM order_date). For zero years, LEFT JOIN from a generated list of years (recursive CTE or generate_series).",
      a: [
        { table: { head: ["id", "order_date"], rows: [["1", "2022-03-01"], ["2", "2022-11-15"], ["3", "2023-01-09"], ["4", "2023-06-30"], ["5", "2023-12-31"], ["6", "2025-02-14"]] } },
        { code: `SELECT EXTRACT(YEAR FROM order_date) AS yr, COUNT(*) AS orders
FROM Orders
GROUP BY yr
ORDER BY yr;`, lang: "sql" },
        { table: { head: ["yr", "orders"], rows: [["2022", "2"], ["2023", "3"], ["2025", "1"]] } },
        { p: "2024 is missing because no rows exist for it. GROUP BY can only report groups that exist in the data. To show zeros, generate the years yourself:" },
        { code: `WITH RECURSIVE years AS (
    SELECT 2022 AS yr
    UNION ALL
    SELECT yr + 1 FROM years WHERE yr < 2025
)
SELECT y.yr, COUNT(o.id) AS orders
FROM years y
LEFT JOIN Orders o ON EXTRACT(YEAR FROM o.order_date) = y.yr
GROUP BY y.yr
ORDER BY y.yr;
-- PostgreSQL alternative: FROM generate_series(2022, 2025) AS y(yr)`, lang: "sql" },
        { table: { head: ["yr", "orders"], rows: [["2022", "2"], ["2023", "3"], ["2024", "0"], ["2025", "1"]] } },
        { tip: "<code>YEAR(order_date)</code> is MySQL-only. <code>EXTRACT(YEAR FROM ...)</code> is standard and works in both. For year-month buckets use <code>DATE_FORMAT(d,'%Y-%m')</code> (MySQL) or <code>DATE_TRUNC('month', d)</code> (PostgreSQL)." }
      ]
    },
    {
      id: "days-between-consecutive-orders",
      q: "For each order, compute the number of days since the same customer's previous order.",
      topic: "Dates & Time",
      level: 2,
      top: false,
      short: "LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date), then DATEDIFF (MySQL) or subtract the dates (PostgreSQL).",
      a: [
        { table: { head: ["id", "customer_id", "order_date"], rows: [["101", "1", "2024-01-05"], ["102", "1", "2024-02-10"], ["103", "1", "2024-03-15"], ["104", "2", "2024-01-20"], ["105", "2", "2024-04-01"], ["106", "3", "2024-02-28"]] } },
        { code: `SELECT customer_id, id, order_date, prev_date,
       DATEDIFF(order_date, prev_date) AS gap_days      -- PostgreSQL: order_date - prev_date
FROM (
    SELECT o.*,
           LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_date
    FROM Orders o
) t
WHERE prev_date IS NOT NULL
ORDER BY customer_id, order_date;`, lang: "sql" },
        { table: { head: ["customer_id", "id", "order_date", "prev_date", "gap_days"], rows: [["1", "102", "2024-02-10", "2024-01-05", "36"], ["1", "103", "2024-03-15", "2024-02-10", "34"], ["2", "105", "2024-04-01", "2024-01-20", "72"]] } },
        { p: "PARTITION BY stops LAG from reaching into another customer's orders. Each customer's first order has no predecessor, and <code>WHERE prev_date IS NOT NULL</code> drops it. (2024 is a leap year, so Feb has 29 days.)" },
        { tip: "Follow-ups: \"customers who went more than 60 days between orders\" means filter <code>gap_days > 60</code>, and \"average gap per customer\" means wrapping this in <code>AVG(gap_days) ... GROUP BY customer_id</code>." },
        { warn: "Argument order differs: MySQL <code>DATEDIFF(later, earlier)</code>, but SQL Server <code>DATEDIFF(day, earlier, later)</code>." }
      ]
    },
    {
      id: "day-one-retention",
      q: "What fraction of users logged in again on the day right after their first login? (Round to 2 decimals.)",
      topic: "Dates & Time",
      level: 2,
      top: false,
      short: "Get each user's first_day with MIN, LEFT JOIN Logins ON the same user AND login_date = first_day + 1 day, then divide COUNT(DISTINCT matched) by COUNT(DISTINCT users).",
      a: [
        { table: { head: ["user_id", "login_date"], rows: [["1", "2024-01-01"], ["1", "2024-01-02"], ["2", "2024-01-01"], ["2", "2024-01-05"], ["3", "2024-01-02"], ["3", "2024-01-03"], ["4", "2024-01-03"]] } },
        { code: `WITH f AS (
    SELECT user_id, MIN(login_date) AS first_day
    FROM Logins
    GROUP BY user_id
)
SELECT ROUND(COUNT(DISTINCT l.user_id) * 1.0 / COUNT(DISTINCT f.user_id), 2) AS day1_retention
FROM f
LEFT JOIN Logins l
       ON l.user_id = f.user_id
      AND l.login_date = f.first_day + INTERVAL 1 DAY;    -- PostgreSQL: f.first_day + 1`, lang: "sql" },
        { table: { head: ["day1_retention"], rows: [["0.50"]] } },
        { p: "Users 1 and 3 came back the next day. User 2 returned only on day 5, and user 4 never returned. That gives 2 / 4 = 0.50. The day-after condition is in the <b>ON</b> clause, so every user stays in the denominator." },
        { warn: "Use <code>COUNT(DISTINCT ...)</code> on both sides. If a user logs in twice on the next day, the join produces two rows and a plain COUNT would count them twice. Multiplying by <code>1.0</code> prevents integer division in PostgreSQL." }
      ]
    },
    {
      id: "consecutive-login-days",
      q: "Find users who logged in on at least 3 consecutive days, with the start and end of each streak.",
      topic: "Dates & Time",
      level: 3,
      top: true,
      short: "Gaps-and-islands: dedupe the dates, compute grp = login_date - ROW_NUMBER() days per user, then GROUP BY user_id, grp HAVING COUNT(*) >= 3.",
      a: [
        { table: { head: ["user_id", "login_date"], rows: [["1", "2024-01-01"], ["1", "2024-01-02"], ["1", "2024-01-02"], ["1", "2024-01-03"], ["1", "2024-01-05"], ["2", "2024-01-01"], ["2", "2024-01-03"]] } },
        { code: `WITH d AS (                       -- one row per user per day
    SELECT DISTINCT user_id, login_date FROM Logins
),
r AS (
    SELECT user_id, login_date,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
    FROM d
),
g AS (
    SELECT user_id, login_date,
           DATE_SUB(login_date, INTERVAL rn DAY) AS grp   -- PostgreSQL: login_date - CAST(rn AS INT)
    FROM r
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS days
FROM g
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`, lang: "sql" },
        { table: { head: ["user_id", "streak_start", "streak_end", "days"], rows: [["1", "2024-01-01", "2024-01-03", "3"]] } },
        { svg: `<svg viewBox="0 0 480 190" width="480" class="dg">
  <text class="tx tx-b" x="90" y="20" text-anchor="middle">login_date</text>
  <text class="tx tx-b" x="190" y="20" text-anchor="middle">rn</text>
  <text class="tx tx-b" x="290" y="20" text-anchor="middle">date − rn</text>
  <rect class="box-g" x="20" y="32" width="340" height="30" rx="6"/>
  <text class="tx tx-c" x="90" y="47" text-anchor="middle" dominant-baseline="middle">2024-01-01</text>
  <text class="tx tx-c" x="190" y="47" text-anchor="middle" dominant-baseline="middle">1</text>
  <text class="tx tx-c" x="290" y="47" text-anchor="middle" dominant-baseline="middle">2023-12-31</text>
  <rect class="box-g" x="20" y="70" width="340" height="30" rx="6"/>
  <text class="tx tx-c" x="90" y="85" text-anchor="middle" dominant-baseline="middle">2024-01-02</text>
  <text class="tx tx-c" x="190" y="85" text-anchor="middle" dominant-baseline="middle">2</text>
  <text class="tx tx-c" x="290" y="85" text-anchor="middle" dominant-baseline="middle">2023-12-31</text>
  <rect class="box-g" x="20" y="108" width="340" height="30" rx="6"/>
  <text class="tx tx-c" x="90" y="123" text-anchor="middle" dominant-baseline="middle">2024-01-03</text>
  <text class="tx tx-c" x="190" y="123" text-anchor="middle" dominant-baseline="middle">3</text>
  <text class="tx tx-c" x="290" y="123" text-anchor="middle" dominant-baseline="middle">2023-12-31</text>
  <rect class="box-w" x="20" y="146" width="340" height="30" rx="6"/>
  <text class="tx tx-c" x="90" y="161" text-anchor="middle" dominant-baseline="middle">2024-01-05</text>
  <text class="tx tx-c" x="190" y="161" text-anchor="middle" dominant-baseline="middle">4</text>
  <text class="tx tx-c" x="290" y="161" text-anchor="middle" dominant-baseline="middle">2024-01-01</text>
  <polyline class="ln-a" points="366,34 378,34 378,136 366,136"/>
  <text class="tx-a" x="386" y="80">island:</text>
  <text class="tx-a" x="386" y="96">3 days</text>
</svg>`, caption: "User 1: while dates step by 1 day and rn steps by 1, date − rn stays constant, so each island shares a key" },
        { p: "In a run of consecutive days, the date and the row number both go up by 1 each row, so their difference stays the same. A gap in the dates changes the difference and starts a new group. Grouping by that difference turns each streak into one row." },
        { warn: "<b>Deduplicate first.</b> User 1 logged in twice on 01-02. Without DISTINCT, that date would get rn 2 and 3, the key would shift, and the streak would break." },
        { h: "Alternative: LAG (fixed length of exactly 3)" },
        { code: `SELECT DISTINCT user_id
FROM (
    SELECT user_id, login_date,
           LAG(login_date, 2) OVER (PARTITION BY user_id ORDER BY login_date) AS two_back
    FROM (SELECT DISTINCT user_id, login_date FROM Logins) d
) t
WHERE DATEDIFF(login_date, two_back) = 2;   -- PostgreSQL: login_date - two_back = 2`, lang: "sql" }
      ]
    },

    /* ───────────── Data Cleanup ───────────── */
    {
      id: "swap-values-update-case",
      q: "In a Salary table, swap every 'm' to 'f' and every 'f' to 'm' in the sex column with a single UPDATE and no temporary table.",
      topic: "Data Cleanup",
      level: 1,
      top: true,
      short: "UPDATE Salary SET sex = CASE sex WHEN 'm' THEN 'f' WHEN 'f' THEN 'm' ELSE sex END. It is one statement, so every row is evaluated against its old value.",
      a: [
        { table: { head: ["id", "name", "sex (before)", "sex (after)"], rows: [["1", "A", "m", "f"], ["2", "B", "f", "m"], ["3", "C", "m", "f"], ["4", "D", "f", "m"]] } },
        { code: `UPDATE Salary
SET sex = CASE sex
              WHEN 'm' THEN 'f'
              WHEN 'f' THEN 'm'
              ELSE sex
          END;`, lang: "sql" },
        { p: "The CASE is evaluated per row using that row's current value, so all the flips happen in one pass. The <code>ELSE sex</code> branch leaves unexpected values (or NULL) unchanged. Without it, they would become NULL." },
        { warn: "Two separate updates (<code>SET sex='f' WHERE sex='m'</code>, then <code>SET sex='m' WHERE sex='f'</code>) turn <i>everyone</i> into 'm', because the second statement also catches the rows the first one just changed." },
        { h: "Swapping two columns: a dialect trap" },
        { code: `UPDATE t SET a = b, b = a;
-- PostgreSQL / SQL Server: true swap (right-hand sides use the old row)
-- MySQL: assignments run left to right, so b gets the NEW a -> both columns = old b
-- MySQL numeric workaround:
UPDATE t SET a = a + b, b = a - b, a = a - b;`, lang: "sql" }
      ]
    },
    {
      id: "update-with-join",
      q: "Give a 10% raise to every employee in the 'Sales' department (the department name is in another table).",
      topic: "Data Cleanup",
      level: 2,
      top: false,
      short: "MySQL: UPDATE Employee e JOIN Department d ... SET. PostgreSQL: UPDATE Employee e SET ... FROM Department d WHERE .... Portable: WHERE dept_id IN (SELECT id ...).",
      a: [
        { code: `-- Portable (MySQL + PostgreSQL)
UPDATE Employee
SET salary = salary * 1.10
WHERE dept_id IN (SELECT id FROM Department WHERE name = 'Sales');

-- MySQL join syntax
UPDATE Employee e
JOIN Department d ON d.id = e.dept_id
SET e.salary = e.salary * 1.10
WHERE d.name = 'Sales';

-- PostgreSQL join syntax
UPDATE Employee e
SET salary = e.salary * 1.10          -- no alias on the target column
FROM Department d
WHERE d.id = e.dept_id AND d.name = 'Sales';`, lang: "sql" },
        { table: { head: ["name", "dept", "salary before", "salary after"], rows: [["Meena", "Sales", "80000", "88000"], ["Karan", "Sales", "85000", "93500"], ["Divya", "Sales", "60000", "66000"], ["Asha", "Engineering", "90000", "90000"]] } },
        { p: "The join only identifies which rows to touch. Each Employee row is updated once, using its own old salary." },
        { tip: "Good habit to mention: run the same FROM and WHERE as a <code>SELECT</code> first to check which rows are affected, and wrap the UPDATE in a transaction (<code>BEGIN ... COMMIT</code>) so you can roll back." },
        { warn: "If the joined table has several matching rows per target row, MySQL updates the row only once, and PostgreSQL uses an arbitrary match. Make sure the join is 1-to-1 from the target's side." }
      ]
    },
    {
      id: "upsert-insert-or-update",
      q: "Add stock to an Inventory table: update qty when the product already exists, otherwise insert a new row (upsert).",
      topic: "Data Cleanup",
      level: 2,
      top: false,
      short: "MySQL: INSERT ... ON DUPLICATE KEY UPDATE. PostgreSQL: INSERT ... ON CONFLICT (key) DO UPDATE SET qty = Inventory.qty + EXCLUDED.qty. Both need a PK or UNIQUE constraint.",
      a: [
        { table: { head: ["product_id (PK)", "qty (before)"], rows: [["1", "10"], ["2", "5"]] } },
        { code: `-- MySQL 8.0.19+
INSERT INTO Inventory (product_id, qty)
VALUES (2, 3), (3, 7) AS new
ON DUPLICATE KEY UPDATE qty = Inventory.qty + new.qty;

-- PostgreSQL 9.5+
INSERT INTO Inventory (product_id, qty)
VALUES (2, 3), (3, 7)
ON CONFLICT (product_id)
DO UPDATE SET qty = Inventory.qty + EXCLUDED.qty;`, lang: "sql" },
        { table: { head: ["product_id", "qty (after)"], rows: [["1", "10"], ["2", "8"], ["3", "7"]] } },
        { p: "Product 2 hits the primary key, so its qty is increased by 3. Product 3 has no conflict, so it is inserted. <code>EXCLUDED</code> (PostgreSQL) and the row alias <code>new</code> (MySQL) refer to the values that were being inserted." },
        { ul: [
          "Older MySQL uses <code>VALUES(qty)</code> instead of the alias. It is deprecated since 8.0.20.",
          "<code>MERGE</code> is the SQL-standard upsert (SQL Server, Oracle, PostgreSQL 15+).",
          "PostgreSQL also has <code>ON CONFLICT DO NOTHING</code>, and MySQL has <code>INSERT IGNORE</code> (which also hides other errors, so be careful)."
        ] },
        { warn: "\"SELECT, then INSERT or UPDATE\" in application code has a race condition: two sessions can both see \"not found\" and both insert. A native upsert on a unique key is atomic." }
      ]
    },
    {
      id: "delete-duplicate-emails-keep-one",
      q: "Delete duplicate emails from Person, keeping only the row with the smallest id for each email.",
      topic: "Data Cleanup",
      level: 2,
      top: true,
      short: "Self-join delete where p1.email = p2.email AND p1.id > p2.id, or delete ids whose ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) > 1.",
      a: [
        { table: { head: ["id", "email"], rows: [["1", "a@x.com"], ["2", "b@x.com"], ["3", "a@x.com"], ["4", "c@x.com"], ["5", "b@x.com"]] } },
        { code: `-- MySQL
DELETE p1
FROM Person p1
JOIN Person p2 ON p1.email = p2.email AND p1.id > p2.id;

-- PostgreSQL
DELETE FROM Person p1
USING Person p2
WHERE p1.email = p2.email AND p1.id > p2.id;

-- Portable (works in both)
DELETE FROM Person
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
        FROM Person
    ) t
    WHERE rn > 1
);`, lang: "sql" },
        { table: { head: ["id", "email (after)"], rows: [["1", "a@x.com"], ["2", "b@x.com"], ["4", "c@x.com"]] } },
        { p: "A row is deleted if another row has the same email and a <i>smaller</i> id, which means it is not the first one. ids 3 and 5 go. To keep the <b>latest</b> row instead, flip the condition to <code>p1.id &lt; p2.id</code>, or use <code>ORDER BY id DESC</code>." },
        { warn: "In MySQL, <code>DELETE FROM Person WHERE id NOT IN (SELECT MIN(id) FROM Person GROUP BY email)</code> fails with error 1093 (\"can't specify target table for update in FROM clause\"). Wrapping the subquery in an extra derived table, as in the portable version, makes MySQL materialise it first." },
        { tip: "Finish by preventing the problem from coming back: <code>ALTER TABLE Person ADD UNIQUE (email)</code>." }
      ]
    },
    {
      id: "delete-duplicates-without-primary-key",
      q: "A Contacts(name, phone) table has no primary key and contains fully duplicated rows. Remove the duplicates, keeping one copy of each.",
      topic: "Data Cleanup",
      level: 3,
      top: false,
      short: "With no id to tell copies apart, use PostgreSQL's hidden ctid, or rebuild via SELECT DISTINCT into a new table, or temporarily add an auto-increment id (MySQL).",
      a: [
        { table: { head: ["name", "phone"], rows: [["Anil", "111"], ["Anil", "111"], ["Bina", "222"], ["Anil", "111"], ["Chetan", "333"]] } },
        { code: `-- PostgreSQL: ctid is the physical row address
DELETE FROM Contacts a
USING Contacts b
WHERE a.ctid > b.ctid
  AND a.name = b.name AND a.phone = b.phone;

-- MySQL option 1: rebuild the table
CREATE TABLE Contacts_clean AS SELECT DISTINCT name, phone FROM Contacts;
TRUNCATE TABLE Contacts;
INSERT INTO Contacts SELECT name, phone FROM Contacts_clean;
DROP TABLE Contacts_clean;

-- MySQL option 2: add a temporary surrogate key
ALTER TABLE Contacts ADD COLUMN tmp_id INT AUTO_INCREMENT PRIMARY KEY;
DELETE c1 FROM Contacts c1
JOIN Contacts c2 ON c1.name = c2.name AND c1.phone = c2.phone AND c1.tmp_id > c2.tmp_id;
ALTER TABLE Contacts DROP COLUMN tmp_id;`, lang: "sql" },
        { table: { head: ["name", "phone (after)"], rows: [["Anil", "111"], ["Bina", "222"], ["Chetan", "333"]] } },
        { p: "Deleting a duplicate needs <i>some</i> way to point at one physical copy and not the other. PostgreSQL exposes one (<code>ctid</code>). In MySQL you either create one (the temporary id) or avoid pointing altogether by rebuilding from DISTINCT." },
        { warn: "If a column can be NULL, <code>a.phone = b.phone</code> is never true for two NULLs, so NULL duplicates survive. Use a NULL-safe comparison: <code>IS NOT DISTINCT FROM</code> (PostgreSQL) or <code>&lt;=&gt;</code> (MySQL)." },
        { tip: "SQL Server lets you delete through a CTE: <code>WITH c AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY name, phone ORDER BY (SELECT 0)) rn FROM Contacts) DELETE FROM c WHERE rn > 1;</code>" }
      ]
    },

    /* ───────────── Classic Puzzles ───────────── */
    {
      id: "consecutive-numbers-three-times",
      q: "Find all numbers that appear at least three times in a row (consecutive ids) in the Logs table.",
      topic: "Classic Puzzles",
      level: 2,
      top: true,
      short: "Compare each row with LAG(num, 1) and LAG(num, 2) ordered by id, keep rows where all three are equal, and SELECT DISTINCT num.",
      a: [
        { table: { head: ["id", "num"], rows: [["1", "1"], ["2", "1"], ["3", "1"], ["4", "2"], ["5", "1"], ["6", "2"], ["7", "2"]] } },
        { code: `SELECT DISTINCT num AS consecutive_num
FROM (
    SELECT num,
           LAG(num, 1) OVER (ORDER BY id) AS prev1,
           LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM Logs
) t
WHERE num = prev1 AND num = prev2;`, lang: "sql" },
        { table: { head: ["consecutive_num"], rows: [["1"]] } },
        { p: "At id 3, the current value and the two before it are all 1, so the row qualifies. The value 2 appears only twice in a row (ids 6 and 7). DISTINCT matters because a run of 4 or more would qualify on several rows." },
        { h: "Alternative: triple self-join" },
        { code: `SELECT DISTINCT l1.num AS consecutive_num
FROM Logs l1
JOIN Logs l2 ON l2.id = l1.id + 1 AND l2.num = l1.num
JOIN Logs l3 ON l3.id = l1.id + 2 AND l3.num = l1.num;`, lang: "sql" },
        { warn: "The self-join assumes ids have <b>no gaps</b>. If id 2 were deleted, ids 1 and 3 would still be neighbours but <code>id + 1</code> would not find them. LAG works on row order, so gaps don't matter. For a general \"N in a row\", use the gaps-and-islands trick (id − ROW_NUMBER per num)." }
      ]
    },
    {
      id: "find-gaps-in-sequence",
      q: "Invoice numbers should be continuous. Find the missing ranges.",
      topic: "Classic Puzzles",
      level: 2,
      top: true,
      short: "LEAD(id) OVER (ORDER BY id). Where next_id - id > 1, the gap is id+1 to next_id-1. To list every missing number, generate the full range and anti-join.",
      a: [
        { table: { head: ["id"], rows: [["1"], ["2"], ["3"], ["6"], ["7"], ["10"]] } },
        { code: `SELECT id + 1      AS gap_start,
       next_id - 1 AS gap_end
FROM (
    SELECT id, LEAD(id) OVER (ORDER BY id) AS next_id
    FROM Invoices
) t
WHERE next_id - id > 1;`, lang: "sql" },
        { table: { head: ["gap_start", "gap_end"], rows: [["4", "5"], ["8", "9"]] } },
        { p: "Each row looks at the next existing id. A jump larger than 1 means the numbers in between are missing. For the last row <code>next_id</code> is NULL, the comparison is UNKNOWN, and the row drops out." },
        { h: "List every missing number" },
        { code: `WITH RECURSIVE bounds AS (
    SELECT MIN(id) AS lo, MAX(id) AS hi FROM Invoices
),
seq AS (
    SELECT lo AS n FROM bounds
    UNION ALL
    SELECT s.n + 1 FROM seq s JOIN bounds b ON s.n < b.hi
)
SELECT n AS missing
FROM seq
WHERE n NOT IN (SELECT id FROM Invoices)     -- safe: id is NOT NULL
ORDER BY n;
-- PostgreSQL shortcut: SELECT generate_series(1, 10) EXCEPT SELECT id FROM Invoices;`, lang: "sql" },
        { p: "Output: 4, 5, 8, 9." },
        { tip: "The opposite question, finding continuous <i>ranges</i> (1–3, 6–7, 10), is gaps-and-islands: <code>GROUP BY id - ROW_NUMBER() OVER (ORDER BY id)</code> and take MIN and MAX." }
      ]
    },
    {
      id: "exchange-adjacent-seats",
      q: "Swap the seats of every two adjacent students (1↔2, 3↔4, ...). If the count is odd, the last student stays put.",
      topic: "Classic Puzzles",
      level: 2,
      top: false,
      short: "Recompute the id: odd id → id+1 (unless it is the last), even id → id-1, then ORDER BY the new id. Or use LEAD/LAG to fetch the neighbour's name.",
      a: [
        { table: { head: ["id", "student"], rows: [["1", "Abbot"], ["2", "Doris"], ["3", "Emerson"], ["4", "Green"], ["5", "Jeames"]] } },
        { code: `SELECT CASE
           WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat) THEN id
           WHEN id % 2 = 1 THEN id + 1
           ELSE id - 1
       END AS id,
       student
FROM Seat
ORDER BY id;`, lang: "sql" },
        { table: { head: ["id", "student"], rows: [["1", "Doris"], ["2", "Abbot"], ["3", "Green"], ["4", "Emerson"], ["5", "Jeames"]] } },
        { h: "Alternative: LEAD / LAG" },
        { code: `SELECT id,
       COALESCE(CASE WHEN id % 2 = 1
                     THEN LEAD(student) OVER (ORDER BY id)
                     ELSE LAG(student)  OVER (ORDER BY id)
                END, student) AS student
FROM Seat
ORDER BY id;`, lang: "sql" },
        { p: "Odd seats take the next student's name and even seats take the previous one. For the last odd seat, LEAD is NULL and COALESCE keeps the original name. <code>ORDER BY id</code> in the first query refers to the computed alias, which both MySQL and PostgreSQL allow." }
      ]
    },
    {
      id: "recursive-cte-org-hierarchy",
      q: "Using a recursive CTE, print the whole org chart: every employee with their level and the reporting path from the CEO.",
      topic: "Classic Puzzles",
      level: 3,
      top: true,
      short: "WITH RECURSIVE: the anchor selects the root (manager_id IS NULL), and the recursive part joins Employee to the CTE on e.manager_id = cte.id with level + 1. Stop cycles with a depth limit.",
      a: [
        { table: { head: ["id", "name", "manager_id"], rows: [["1", "Asha", "NULL"], ["2", "Ravi", "1"], ["3", "Meena", "1"], ["4", "Karan", "3"], ["5", "Divya", "3"], ["6", "Farhan", "1"]] } },
        { code: `WITH RECURSIVE org AS (
    -- anchor: the root(s)
    SELECT id, name, manager_id, 1 AS lvl,
           CAST(name AS CHAR(200)) AS path          -- PostgreSQL: CAST(name AS TEXT)
    FROM Employee
    WHERE manager_id IS NULL

    UNION ALL

    -- recursive step: direct reports of rows found so far
    SELECT e.id, e.name, e.manager_id, o.lvl + 1,
           CONCAT(o.path, ' > ', e.name)
    FROM Employee e
    JOIN org o ON e.manager_id = o.id
)
SELECT lvl, name, path
FROM org
ORDER BY path;`, lang: "sql" },
        { table: { head: ["lvl", "name", "path"], rows: [["1", "Asha", "Asha"], ["2", "Farhan", "Asha &gt; Farhan"], ["2", "Meena", "Asha &gt; Meena"], ["3", "Divya", "Asha &gt; Meena &gt; Divya"], ["3", "Karan", "Asha &gt; Meena &gt; Karan"], ["2", "Ravi", "Asha &gt; Ravi"]] } },
        { svg: `<svg viewBox="0 0 520 210" width="520" class="dg">
  <text class="tx-m" x="10" y="42">lvl 1</text>
  <text class="tx-m" x="10" y="112">lvl 2</text>
  <text class="tx-m" x="10" y="182">lvl 3</text>
  <rect class="box-a" x="230" y="24" width="100" height="36" rx="6"/>
  <text class="tx tx-b" x="280" y="42" text-anchor="middle" dominant-baseline="middle">Asha</text>
  <rect class="box" x="100" y="94" width="100" height="36" rx="6"/>
  <text class="tx" x="150" y="112" text-anchor="middle" dominant-baseline="middle">Ravi</text>
  <rect class="box" x="230" y="94" width="100" height="36" rx="6"/>
  <text class="tx" x="280" y="112" text-anchor="middle" dominant-baseline="middle">Meena</text>
  <rect class="box" x="360" y="94" width="100" height="36" rx="6"/>
  <text class="tx" x="410" y="112" text-anchor="middle" dominant-baseline="middle">Farhan</text>
  <rect class="box-g" x="170" y="164" width="100" height="36" rx="6"/>
  <text class="tx" x="220" y="182" text-anchor="middle" dominant-baseline="middle">Karan</text>
  <rect class="box-g" x="290" y="164" width="100" height="36" rx="6"/>
  <text class="tx" x="340" y="182" text-anchor="middle" dominant-baseline="middle">Divya</text>
  <line class="ln" x1="280" y1="60" x2="150" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="60" x2="280" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="60" x2="410" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="130" x2="220" y2="162" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="130" x2="340" y2="162" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Anchor = level 1. Each recursive pass adds the next level, and it stops when a pass finds no new rows." },
        { p: "Execution: the anchor produces {Asha}. Pass 1 joins Employee to {Asha} and finds {Ravi, Meena, Farhan}. Pass 2 joins to those rows and finds {Karan, Divya}. Pass 3 finds nothing, so the recursion stops and UNION ALL returns all the rows collected." },
        { ul: [
          "<b>Subtree of one manager</b> (all direct and indirect reports of Meena): change the anchor to <code>WHERE id = 3</code>.",
          "<b>Path column type:</b> MySQL sizes CTE columns from the anchor, so cast it wide enough. PostgreSQL requires the anchor and recursive types to match exactly, which is why it uses TEXT there, since CONCAT returns text.",
          "SQL Server writes <code>WITH</code> without the <code>RECURSIVE</code> keyword."
        ] },
        { warn: "Bad data containing a cycle (A manages B, B manages A) makes the recursion run until the engine stops it (MySQL <code>cte_max_recursion_depth</code> = 1000). Add <code>WHERE o.lvl &lt; 20</code> in the recursive part, or use PostgreSQL 14's <code>CYCLE id SET is_cycle USING route</code> clause." }
      ]
    }
  ]
});
