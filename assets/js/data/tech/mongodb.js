/* tech stack: MongoDB — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "mongodb",
  title: "MongoDB",
  short: "MongoDB",
  icon: "❖",
  blurb: "With MongoDB on your resume, expect questions on the document model and when it beats SQL, schema design (embed vs reference), indexes and the ESR rule, the aggregation pipeline, transactions and read/write concerns, replica sets and sharding, Mongoose, and NoSQL injection.",
  topics: ["Basics & Data Model", "Queries & Aggregation", "Indexes & Performance", "Schema Design", "Transactions & Scaling", "Node, Security & Ops"],
  questions: [

    /* ───────────── Basics & Data Model ───────────── */
    {
      id: "what-is-mongodb",
      q: "What is MongoDB, what is BSON, and how does the document model differ from tables?",
      topic: "Basics & Data Model",
      level: 1,
      top: true,
      short: "MongoDB is a document database. It stores records as JSON-like documents grouped into collections, with no fixed schema enforced by default. Documents are stored as BSON, a binary JSON format with extra types such as ObjectId, Date, Decimal128 and 64-bit integers. A single document can hold nested objects and arrays, so data that is read together is stored together and often needs no joins. Each document is limited to 16 MB.",
      a: [
        { p: "<b>MongoDB</b> is a general-purpose, distributed <b>document database</b>, one of the <a href=\"#/core/dbms/nosql-types\">NoSQL families</a>. Instead of spreading an entity over several normalized tables, you store it as one rich document with nested objects and arrays, much like the object your code already uses." },
        { code: `// One document in the "users" collection
{
  _id: ObjectId("66fe5b2a9c1d4e3f5a6b7c8d"),
  name: "Asha Rao",
  email: "asha@x.com",
  joinedAt: ISODate("2026-10-03T10:30:00Z"),     // BSON Date, not a string
  address: { city: "Pune", pin: "411001" },     // embedded object
  skills: ["java", "react", "mongodb"],          // array
  wallet: NumberDecimal("1499.50")               // Decimal128 for money
}`, lang: "javascript", run: false, title: "A document (mongosh notation)" },
        { table: { head: ["SQL term", "MongoDB term"], rows: [
          ["Database", "Database"],
          ["Table", "Collection"],
          ["Row", "Document"],
          ["Column", "Field (can be nested, can differ per document)"],
          ["Primary key", "<code>_id</code> (always present, unique, immutable)"],
          ["JOIN", "Embedding, or <code>$lookup</code> in aggregation"],
          ["Index", "Index (B-tree based; single, compound, multikey, text, TTL…)"]
        ] } },
        { h: "BSON: why not plain JSON?" },
        { ul: [
          "<b>More types</b>: <code>ObjectId</code>, <code>Date</code>, <code>Int32</code>/<code>Int64</code>/<code>Double</code>, <code>Decimal128</code>, <code>BinData</code>, regex. JSON has only string, number, boolean, null, object and array.",
          "<b>Fast to traverse</b>: each element is prefixed with its type and length, so the server can skip fields without parsing them.",
          "Field order is preserved. The maximum document size is <b>16 MB</b> (use GridFS for bigger files) and the maximum nesting depth is 100 levels."
        ] },
        { p: "Under the hood, the default storage engine is <b>WiredTiger</b> (since 3.2). It provides document-level concurrency control, compression and MVCC-style snapshots. Current releases are the MongoDB 8.x series." },
        { warn: "\"Schemaless\" does not mean \"no schema\". The schema moves into your application code (or Mongoose, or <code>$jsonSchema</code> validation). Without discipline, one collection ends up with <code>price</code> stored as a number in some documents and a string in others." },
        { tip: "Show you know the trade-off right away: \"Documents map naturally to objects and avoid joins for data that is read together, at the cost of duplicated data and weaker cross-document constraints.\"" }
      ]
    },
    {
      id: "mongodb-vs-sql",
      q: "When would you choose MongoDB over a relational database like PostgreSQL or MySQL, and when not?",
      topic: "Basics & Data Model",
      level: 1,
      top: true,
      short: "Choose MongoDB when data is naturally hierarchical or varies per record (catalogs, CMS content, user profiles, event payloads), when you read whole aggregates by key, and when you need built-in horizontal scaling through sharding. Choose a relational database when data is highly relational with many-to-many joins, when you need strict cross-entity constraints and complex ad-hoc reporting, or for money movement across many entities. MongoDB has multi-document ACID transactions, but relying on them heavily is a design smell.",
      a: [
        { p: "Both are general-purpose today: MongoDB has transactions and joins (<code>$lookup</code>), and PostgreSQL has JSONB. The real question is which <b>data shape and access pattern</b> dominates. Theory: <a href=\"#/core/dbms/sql-vs-nosql\">SQL vs NoSQL</a>." },
        { table: { head: ["Aspect", "MongoDB", "PostgreSQL / MySQL"], rows: [
          ["Data model", "Documents with nesting and arrays", "Normalized tables and rows"],
          ["Schema", "Flexible; optional <code>$jsonSchema</code> validation", "Fixed; changed with migrations"],
          ["Relationships", "Embed, or reference + <code>$lookup</code>", "Foreign keys + JOINs (excellent optimizer)"],
          ["Integrity", "Unique indexes, validation; no foreign keys", "PK, FK, CHECK, UNIQUE, cascades"],
          ["Transactions", "Single document always atomic; multi-document since 4.0", "Core feature, always"],
          ["Scaling writes", "Native sharding", "Mostly vertical; sharding needs Citus/Vitess or app logic"],
          ["Query language", "MQL + aggregation pipeline", "SQL (standard, very expressive for analytics)"],
          ["Sweet spot", "Catalogs, content, profiles, IoT/events, real-time apps", "Finance, ERP, inventory, reporting, many-to-many data"]
        ] } },
        { h: "Good fits for MongoDB" },
        { ul: [
          "<b>Product catalog</b>: a phone has <code>ram</code> and <code>camera</code>, a shirt has <code>size</code> and <code>fabric</code>. Different attributes per document, no EAV tables.",
          "<b>Aggregates read by key</b>: a blog post with its tags and recent comments, or an order with its line items, fetched in a single read.",
          "<b>High write volume with horizontal scale</b>: telemetry and activity feeds sharded across machines.",
          "<b>Fast iteration</b>: early-stage products whose schema changes every week."
        ] },
        { h: "Poor fits" },
        { ul: [
          "Many-to-many data queried in many directions (students ↔ courses ↔ teachers, social graphs).",
          "Complex ad-hoc reporting across entities. SQL and a relational optimizer (or a warehouse) are better.",
          "Workloads whose correctness depends on constraints across many entities, such as double-entry ledgers."
        ] },
        { warn: "Avoid the answer \"MongoDB is faster\". Neither is inherently faster. MongoDB is fast when the document matches the access pattern (one read, no joins). It is slow when you emulate relational joins with many <code>$lookup</code>s or application-side lookups." },
        { tip: "A great answer mentions polyglot persistence: \"Orders and payments in PostgreSQL, the product catalog and user activity in MongoDB, sessions in Redis.\"" }
      ]
    },
    {
      id: "objectid-and-id",
      q: "What is _id and how is an ObjectId structured? Can you use your own _id?",
      topic: "Basics & Data Model",
      level: 1,
      top: true,
      short: "Every document must have a unique, immutable _id field, and MongoDB automatically creates a unique index on it. If you do not supply one, the driver generates an ObjectId: 12 bytes made of a 4-byte timestamp in seconds, a 5-byte random value fixed per process, and a 3-byte incrementing counter. ObjectIds are unique without coordination and roughly sortable by creation time. You can use any unique value as _id, such as an email or a UUID, as long as it never changes.",
      a: [
        { p: "<code>_id</code> is the primary key of every document. It is required, unique within the collection, immutable after insert, and always indexed. The <b>driver</b> (not the server) usually generates it, so the client knows the id before the insert returns." },
        { table: { head: ["Bytes", "Content", "Purpose"], rows: [
          ["0–3", "Unix timestamp in seconds (big-endian)", "Rough creation time; makes ids increase over time"],
          ["4–8", "Random value, generated once per process", "Separates different machines and processes"],
          ["9–11", "Counter, starting at a random value", "Separates ids created in the same second by the same process"]
        ] } },
        { code: `const crypto = require("crypto");

// How a driver builds an ObjectId: 4-byte time | 5-byte per-process random | 3-byte counter
const processRandom = crypto.randomBytes(5);          // chosen once per process
let counter = crypto.randomInt(0, 0xfffff0);          // starts at a random value

function newObjectId(date = new Date()) {
  const buf = Buffer.alloc(12);
  buf.writeUInt32BE(Math.floor(date.getTime() / 1000), 0);
  processRandom.copy(buf, 4);
  counter = (counter + 1) % 0x1000000;
  buf.writeUIntBE(counter, 9, 3);
  return buf.toString("hex");
}

const a = newObjectId(new Date("2026-10-03T10:30:00Z"));
const b = newObjectId(new Date("2026-10-03T10:30:00Z"));
console.log("length:", a.length, "hex chars =", a.length / 2, "bytes");
console.log("same second, same process -> only the counter differs:", a.slice(0, 18) === b.slice(0, 18));
console.log("b > a (sortable by creation):", b > a);

// Decoding the timestamp of any ObjectId (what ObjectId.getTimestamp() does)
const tsOf = (hex) => new Date(parseInt(hex.slice(0, 8), 16) * 1000).toISOString();
console.log("created at:", tsOf(a));
console.log("created at:", tsOf("507f1f77bcf86cd799439011"));`, lang: "javascript", title: "Build and decode an ObjectId in plain Node" },
        { code: `length: 24 hex chars = 12 bytes
same second, same process -> only the counter differs: true
b > a (sortable by creation): true
created at: 2026-10-03T10:30:00.000Z
created at: 2012-10-17T21:13:27.000Z`, lang: "text" },
        { ul: [
          "<b>Free creation time</b>: <code>ObjectId(\"…\").getTimestamp()</code> in mongosh. Sorting by <code>_id</code> is roughly sorting by insert time (only to the second, and across machines only as accurate as their clocks).",
          "<b>Custom _id</b>: <code>{ _id: \"IN-MH-PUNE\" }</code> or a UUID is fine when you have a natural unique key that never changes. It saves you a separate unique index.",
          "<b>Type matters</b>: <code>\"66fe…\"</code> (string) and <code>ObjectId(\"66fe…\")</code> are different values. A query with the string finds nothing."
        ] },
        { warn: "Classic bug in Node: <code>findOne({ _id: req.params.id })</code> with the raw driver returns <code>null</code> because the parameter is a string. Convert it with <code>new ObjectId(id)</code> (and check <code>ObjectId.isValid(id)</code> first). Mongoose casts automatically based on the schema." }
      ]
    },

    /* ───────────── Queries & Aggregation ───────────── */
    {
      id: "crud-operations",
      q: "How do you do basic CRUD in MongoDB, including update operators and upsert?",
      topic: "Queries & Aggregation",
      level: 1,
      top: true,
      short: "Create with insertOne and insertMany. Read with find(filter, projection), chained with sort, limit and skip, or findOne. Update with updateOne or updateMany using operators such as $set, $inc, $push, $addToSet, $pull and $unset, or replace the whole document with replaceOne. Pass upsert: true to insert when nothing matches. Delete with deleteOne or deleteMany. findOneAndUpdate atomically modifies a document and returns it.",
      a: [
        { p: "Every write to a <b>single document is atomic</b>, including all the fields and arrays nested inside it. This is the foundation of MongoDB schema design." },
        { code: `use shop

// CREATE
db.products.insertOne({ sku: "P-1", name: "Pen", price: 10, stock: 100, tags: ["stationery"] });
db.products.insertMany([
  { sku: "P-2", name: "Notebook", price: 60, stock: 0, tags: ["stationery"] },
  { sku: "P-3", name: "Backpack", price: 900, stock: 12, tags: ["bags"] }
]);

// READ: filter, projection, sort, limit
db.products.find({ price: { $lte: 100 } }, { name: 1, price: 1, _id: 0 }).sort({ price: -1 }).limit(10);
db.products.findOne({ sku: "P-1" });
db.products.countDocuments({ stock: 0 });

// UPDATE with operators
db.products.updateOne(
  { sku: "P-1" },
  { $set: { price: 12 }, $inc: { stock: -1 }, $addToSet: { tags: "sale" } }
);
db.products.updateMany({ stock: 0 }, { $set: { status: "out_of_stock" } });
db.products.updateOne({ sku: "P-3" }, { $pull: { tags: "bags" }, $unset: { status: "" } });

// UPSERT: update if found, insert if not
db.products.updateOne(
  { sku: "P-9" },
  { $set: { name: "Stapler", price: 99 }, $setOnInsert: { createdAt: new Date(), stock: 0 } },
  { upsert: true }
);

// Atomic "decrement stock if available, and give me the new document"
db.products.findOneAndUpdate(
  { sku: "P-1", stock: { $gt: 0 } },
  { $inc: { stock: -1 } },
  { returnDocument: "after" }
);

// DELETE
db.products.deleteOne({ sku: "P-9" });
db.products.deleteMany({ status: "out_of_stock" });`, lang: "javascript", run: false, title: "CRUD in mongosh" },
        { table: { head: ["Operator", "Does", "Example"], rows: [
          ["<code>$set</code> / <code>$unset</code>", "Set / remove a field (dot paths allowed)", "<code>{ $set: { \"address.city\": \"Pune\" } }</code>"],
          ["<code>$inc</code>", "Atomic add (negative to subtract)", "<code>{ $inc: { views: 1 } }</code>"],
          ["<code>$push</code> (+ <code>$each</code>, <code>$slice</code>)", "Append to an array, optionally capped", "<code>{ $push: { recent: { $each: [x], $slice: -10 } } }</code>"],
          ["<code>$addToSet</code>", "Append only if the value is not already present", "<code>{ $addToSet: { tags: \"sale\" } }</code>"],
          ["<code>$pull</code>", "Remove matching array elements", "<code>{ $pull: { tags: \"old\" } }</code>"],
          ["<code>$</code>, <code>$[]</code>, <code>$[id]</code>", "Update the matched / all / filtered array elements", "<code>{ $set: { \"items.$.qty\": 3 } }</code>"],
          ["<code>$setOnInsert</code>", "Set only when an upsert inserts", "<code>createdAt</code> on first insert"]
        ] } },
        { warn: "<code>updateOne({ sku: \"P-1\" }, { price: 12 })</code> without an operator is rejected by modern drivers (\"Update document requires atomic operators\"). If you really mean to overwrite the whole document, use <code>replaceOne</code>. The legacy <code>update()</code> silently replaced the document and wiped every other field." },
        { tip: "Interviewers love the stock-decrement example. Putting the condition in the filter (<code>stock: { $gt: 0 }</code>) together with <code>$inc</code> makes \"check and decrement\" one atomic operation. No transaction and no race condition." }
      ]
    },
    {
      id: "query-operators",
      q: "How do MongoDB query operators, dot notation and array matching (including $elemMatch) work?",
      topic: "Queries & Aggregation",
      level: 2,
      top: false,
      short: "Filters are documents. Comparison operators are $eq, $ne, $gt, $gte, $lt, $lte, $in and $nin; logical ones are $and, $or, $not and $nor; element operators are $exists and $type; array operators are $all, $size and $elemMatch. Dot notation reaches into nested fields, as in \"address.city\". The trap is arrays: a condition on an array field matches if any element matches, and several conditions may be satisfied by different elements unless you wrap them in $elemMatch.",
      a: [
        { code: `db.students.insertMany([
  { name: "Asha",  scores: [85, 92], address: { city: "Pune" },  tags: ["dsa", "web"] },
  { name: "Ravi",  scores: [70, 95], address: { city: "Delhi" }, tags: ["ml"] },
  { name: "Meena", scores: [88],                                 tags: [] }
]);

db.students.find({ "address.city": "Pune" });                      // Asha      (dot notation)
db.students.find({ name: { $in: ["Asha", "Meena"] } });            // Asha, Meena
db.students.find({ tags: "ml" });                                  // Ravi      (any element equals)
db.students.find({ tags: { $all: ["dsa", "web"] } });              // Asha      (contains all)
db.students.find({ tags: { $size: 0 } });                          // Meena
db.students.find({ address: { $exists: false } });                 // Meena

// The array trap
db.students.find({ scores: { $gt: 90, $lt: 93 } });                // Asha AND Ravi (!)
db.students.find({ scores: { $elemMatch: { $gt: 90, $lt: 93 } } }); // Asha only (92)

db.students.find({ $or: [{ "address.city": "Delhi" }, { tags: "dsa" }] });   // Asha, Ravi
db.students.find({ name: /^A/ });                                   // prefix regex can use an index
db.students.find({ $expr: { $gt: [{ $size: "$scores" }, 1] } });    // compare using expressions`, lang: "javascript", run: false, title: "Operators on a small collection" },
        { p: "Why does Ravi match <code>{ $gt: 90, $lt: 93 }</code>? For arrays, each condition only needs <b>some</b> element to satisfy it: 95 &gt; 90 and 70 &lt; 93. <code>$elemMatch</code> forces <b>one element</b> to satisfy all conditions. The same applies to arrays of sub-documents: <code>{ \"items.sku\": \"pen\", \"items.qty\": { $gt: 5 } }</code> can match a pen with qty 1 plus some other item with qty 10." },
        { table: { head: ["Category", "Operators"], rows: [
          ["Comparison", "<code>$eq $ne $gt $gte $lt $lte $in $nin</code>"],
          ["Logical", "<code>$and $or $not $nor</code> (a comma between fields is an implicit AND)"],
          ["Element", "<code>$exists $type</code>"],
          ["Array", "<code>$all $size $elemMatch</code>"],
          ["Evaluation", "<code>$regex $expr $text $mod $jsonSchema</code>"],
          ["Projection", "<code>{ name: 1, _id: 0 }</code>, <code>{ scores: { $slice: 1 } }</code>, <code>{ \"items.$\": 1 }</code>"]
        ] } },
        { warn: "<code>{ $ne: \"x\" }</code> and <code>$nin</code> also match documents where the field is <b>missing</b>, and they are rarely selective enough to use an index well. Likewise, <code>{ field: null }</code> matches both <code>null</code> values and missing fields. Use <code>{ field: { $exists: true, $eq: null } }</code> for null only." },
        { tip: "If you are asked to translate SQL: <code>WHERE city = 'Pune' AND age &gt; 20 ORDER BY age LIMIT 5</code> → <code>find({ city: \"Pune\", age: { $gt: 20 } }).sort({ age: 1 }).limit(5)</code>." }
      ]
    },
    {
      id: "aggregation-pipeline",
      q: "How does the aggregation pipeline work? Can you walk through $match, $unwind, $group, $lookup and $project with an example?",
      topic: "Queries & Aggregation",
      level: 2,
      top: true,
      short: "An aggregation is an array of stages. Documents flow through them in order, and each stage transforms the stream: $match filters (like WHERE), $unwind turns each array element into its own document, $group aggregates by a key (like GROUP BY), $lookup joins another collection (like LEFT OUTER JOIN), $project reshapes fields (like SELECT), and $sort, $limit and $skip work as expected. Put $match and $sort early so they can use indexes.",
      a: [
        { p: "Think of the pipeline as a Unix pipe for documents: <code>orders | match | unwind | group | lookup | project | sort</code>. Each stage receives the output of the previous one." },
        { code: `// orders
{ _id: 1, customerId: "c1", status: "paid",      items: [ { sku: "pen",  qty: 2, price: 10 },
                                                          { sku: "book", qty: 1, price: 250 } ] }
{ _id: 2, customerId: "c2", status: "paid",      items: [ { sku: "pen",  qty: 5, price: 10 } ] }
{ _id: 3, customerId: "c1", status: "cancelled", items: [ { sku: "bag",  qty: 1, price: 900 } ] }
{ _id: 4, customerId: "c3", status: "paid",      items: [ { sku: "book", qty: 2, price: 250 },
                                                          { sku: "bag",  qty: 1, price: 900 } ] }
// customers
{ _id: "c1", name: "Asha",  city: "Pune"  }
{ _id: "c2", name: "Ravi",  city: "Delhi" }
{ _id: "c3", name: "Meena", city: "Pune"  }`, lang: "javascript", run: false, title: "Sample data" },
        { code: `// "Revenue and items sold per customer, paid orders only, highest revenue first"
db.orders.aggregate([
  { $match: { status: "paid" } },                       // 1. WHERE: orders 1, 2, 4 (can use an index)
  { $unwind: "$items" },                                // 2. one document per line item (5 docs)
  { $group: {                                           // 3. GROUP BY customerId
      _id: "$customerId",
      revenue:   { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      itemsSold: { $sum: "$items.qty" }
  } },
  { $lookup: {                                          // 4. LEFT OUTER JOIN customers
      from: "customers", localField: "_id", foreignField: "_id", as: "customer"
  } },
  { $unwind: "$customer" },                             // 5. array of 1 -> object
  { $project: {                                         // 6. SELECT / reshape
      _id: 0, name: "$customer.name", city: "$customer.city",
      revenue: "$revenue", itemsSold: "$itemsSold"
  } },
  { $sort: { revenue: -1 } }                            // 7. ORDER BY revenue DESC
]);`, lang: "javascript", run: false, title: "The pipeline" },
        { code: `{ name: "Meena", city: "Pune",  revenue: 1400, itemsSold: 3 }   // 2×250 + 1×900
{ name: "Asha",  city: "Pune",  revenue: 270,  itemsSold: 3 }   // 2×10 + 1×250 (order 3 was cancelled)
{ name: "Ravi",  city: "Delhi", revenue: 50,   itemsSold: 5 }   // 5×10`, lang: "text", title: "Output" },
        { table: { head: ["SQL", "Aggregation stage"], rows: [
          ["<code>WHERE</code>", "<code>$match</code>"],
          ["<code>GROUP BY</code> + aggregates", "<code>$group</code> with <code>$sum $avg $min $max $push $addToSet $count</code>"],
          ["<code>HAVING</code>", "<code>$match</code> after <code>$group</code>"],
          ["<code>SELECT</code> columns / expressions", "<code>$project</code>, <code>$addFields</code> / <code>$set</code>"],
          ["<code>ORDER BY</code>, <code>LIMIT</code>, <code>OFFSET</code>", "<code>$sort</code>, <code>$limit</code>, <code>$skip</code>"],
          ["<code>LEFT JOIN</code>", "<code>$lookup</code> (result is an array)"],
          ["Unnesting an array", "<code>$unwind</code>"],
          ["Several aggregations in one query", "<code>$facet</code>"],
          ["<code>INSERT INTO … SELECT</code>", "<code>$out</code> / <code>$merge</code>"]
        ] } },
        { ul: [
          "<b>Order matters for performance</b>: only a leading <code>$match</code> or <code>$sort</code> can use an index. The optimizer moves some stages automatically, but write them early anyway.",
          "Each stage has a <b>100 MB memory limit</b>. Since MongoDB 6.0, stages spill to disk by default when needed (<code>allowDiskUseByDefault</code>), which works but is slow.",
          "<code>$unwind</code> drops documents whose array is empty or missing unless you pass <code>preserveNullAndEmptyArrays: true</code>. This is the same trap as an INNER vs LEFT JOIN.",
          "<code>$lookup</code> on a large collection needs an index on <code>foreignField</code>, otherwise every input document scans the other collection."
        ] },
        { tip: "Common follow-up: \"Top 3 best-selling SKUs\". Answer: <code>$match</code> paid → <code>$unwind</code> items → <code>$group</code> by <code>$items.sku</code> summing qty → <code>$sort</code> desc → <code>$limit: 3</code>. On this data: pen 7, book 3, bag 1." }
      ]
    },
    {
      id: "pagination",
      q: "How do you implement pagination in MongoDB, and why is skip/limit a problem on large collections?",
      topic: "Queries & Aggregation",
      level: 2,
      top: true,
      short: "skip(n).limit(k) is easy, but the server still walks and discards n documents or index keys, so deep pages get slower in a straight line. Results also shift when documents are inserted or deleted between requests, causing duplicates or missed items. Keyset (cursor) pagination is better: sort on an indexed, unique key such as _id, or createdAt with _id as a tie-breaker, and ask for documents after the last one seen. Every page then costs the same.",
      a: [
        { code: `// Offset pagination: page 5000 walks 100,000 index entries just to throw them away
db.posts.find().sort({ createdAt: -1, _id: -1 }).skip(5000 * 20).limit(20);

// Keyset pagination. Index: { createdAt: -1, _id: -1 }
// Page 1
db.posts.find().sort({ createdAt: -1, _id: -1 }).limit(20);
// Next page: the client sends back the last item's (createdAt, _id) as an opaque cursor
db.posts.find({
  $or: [
    { createdAt: { $lt: last.createdAt } },
    { createdAt: last.createdAt, _id: { $lt: last._id } }     // tie-breaker for equal timestamps
  ]
}).sort({ createdAt: -1, _id: -1 }).limit(20);

// Simplest case: sorting by _id alone (ObjectIds increase over time)
db.posts.find({ _id: { $lt: lastId } }).sort({ _id: -1 }).limit(20);`, lang: "javascript", run: false, title: "Offset vs keyset in mongosh" },
        { p: "Here is the correctness problem, simulated with an in-memory list: a new post arrives between loading page 1 and page 2." },
        { code: `let posts = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: "post " + (i + 1) }));
const newestFirst = () => [...posts].sort((a, b) => b.id - a.id);

// skip/limit style:   find().sort({_id: -1}).skip(page * size).limit(size)
const offsetPage = (page, size) =>
  newestFirst().slice(page * size, page * size + size).map((p) => p.id);
// keyset style:       find({_id: {$lt: lastSeenId}}).sort({_id: -1}).limit(size)
const keysetPage = (afterId, size) =>
  newestFirst().filter((p) => afterId === null || p.id < afterId).slice(0, size).map((p) => p.id);

const o1 = offsetPage(0, 3);
const k1 = keysetPage(null, 3);
posts.push({ id: 7, title: "post 7" });               // a new post arrives between page loads
console.log("offset pages:", o1, offsetPage(1, 3));
console.log("keyset pages:", k1, keysetPage(k1[k1.length - 1], 3));
// offset pages: [ 6, 5, 4 ] [ 4, 3, 2 ]     <- post 4 shown twice
// keyset pages: [ 6, 5, 4 ] [ 3, 2, 1 ]     <- stable`, lang: "javascript", title: "Why offset pages shift (plain Node)" },
        { table: { head: ["", "skip / limit", "Keyset (range) pagination"], rows: [
          ["Cost of page N", "Grows with N (skipped entries are still scanned)", "Constant: one index seek"],
          ["Stable under inserts/deletes", "No: duplicates or gaps", "Yes"],
          ["Jump to page 37", "Yes", "No; only next/previous (infinite scroll)"],
          ["Total pages count", "Needs <code>countDocuments</code> (expensive on big filters)", "Usually skipped; show \"Load more\""],
          ["Requirement", "None", "Index on the sort keys, with a unique tie-breaker"]
        ] } },
        { warn: "Sorting by a non-unique field alone (<code>createdAt</code>) breaks keyset pagination when two documents share a timestamp: one of them can be skipped. Always add <code>_id</code> as the last sort key and in the cursor condition." },
        { tip: "Encode the cursor (for example base64 of <code>{createdAt, _id}</code>) and return it as <code>nextCursor</code> in the API. Clients treat it as opaque, so you can change the sort later without breaking them." }
      ]
    },

    /* ───────────── Indexes & Performance ───────────── */
    {
      id: "indexes-esr",
      q: "What index types does MongoDB support, and what is the ESR rule for compound indexes?",
      topic: "Indexes & Performance",
      level: 2,
      top: true,
      short: "MongoDB indexes are B-trees. The main types are single-field, compound, multikey (created automatically on array fields, one key per element), text, TTL (deletes documents after a time), hashed (for sharding), 2dsphere (geo), wildcard, unique and partial. For compound indexes, follow the ESR rule: Equality fields first, then Sort fields, then Range fields. That lets the index both narrow the search and return results already sorted, with no in-memory sort.",
      a: [
        { p: "Without an index, a query does a <b>COLLSCAN</b> and reads every document. With one, it does an <b>IXSCAN</b> over a B-tree of keys. Indexing basics: <a href=\"#/core/dbms/what-is-index\">what an index is</a>, <a href=\"#/core/dbms/composite-index\">composite indexes</a>." },
        { code: `db.users.createIndex({ email: 1 }, { unique: true });                  // single field, unique
db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 });    // compound
db.posts.createIndex({ tags: 1 });                                     // multikey: tags is an array
db.articles.createIndex({ title: "text", body: "text" }, { weights: { title: 3 } });   // one text index per collection
db.articles.find({ $text: { $search: "replica set" } }, { score: { $meta: "textScore" } })
           .sort({ score: { $meta: "textScore" } });
db.sessions.createIndex({ lastSeen: 1 }, { expireAfterSeconds: 3600 }); // TTL: delete 1 h after lastSeen
db.orders.createIndex({ createdAt: 1 }, { partialFilterExpression: { status: "pending" } });  // partial
db.events.createIndex({ deviceId: "hashed" });                         // hashed (shard keys)
db.places.createIndex({ location: "2dsphere" });                       // geo queries ($near)
db.orders.getIndexes();
db.orders.dropIndex("createdAt_1");`, lang: "javascript", run: false, title: "Index types in mongosh" },
        { h: "ESR: Equality → Sort → Range" },
        { code: `// Query: one customer's paid orders above Rs 500, newest first
db.orders.find({ customerId: "c42", status: "paid", amount: { $gt: 500 } })
         .sort({ createdAt: -1 });

// Best index by ESR
db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1, amount: 1 });
//                      E            E          S              R

// Range before sort, { customerId: 1, status: 1, amount: 1, createdAt: -1 }:
// the matching keys are ordered by amount, so MongoDB must do an in-memory SORT.`, lang: "javascript", run: false, title: "Applying ESR" },
        { ul: [
          "<b>Equality first</b>: equality matches jump straight to one contiguous section of the index.",
          "<b>Sort next</b>: inside that section, keys are already in sort order, so no SORT stage is needed.",
          "<b>Range last</b>: the range condition filters keys as the scan walks them in sorted order.",
          "A compound index also serves its <b>prefixes</b>: <code>{customerId, status, createdAt}</code> answers queries on <code>customerId</code>, or on <code>customerId + status</code>, but not on <code>status</code> alone.",
          "Sort direction matters only for multi-field sorts: an index on <code>{a: 1, b: -1}</code> supports <code>sort({a: 1, b: -1})</code> and <code>sort({a: -1, b: 1})</code> but not <code>sort({a: 1, b: 1})</code>."
        ] },
        { table: { head: ["Index", "Key facts"], rows: [
          ["Multikey", "One index key per array element. A compound index can include at most one array field per document (\"cannot index parallel arrays\")"],
          ["TTL", "Single Date field. A background task runs about every 60 s, so deletion is not to the second"],
          ["Text", "One per collection; stemming and stop words. For real search, use Atlas Search (Lucene)"],
          ["Unique", "Enforced on insert/update; with <code>partialFilterExpression</code> it applies only to matching documents"],
          ["Covered query", "Filter and projection use only indexed fields (and exclude <code>_id</code> unless indexed): no document fetch at all"]
        ] } },
        { warn: "Every index slows writes and uses RAM, and indexes should fit in memory together with your working set. Remove unused indexes. <code>$indexStats</code> shows how often each one is used. Hide an index first (<code>db.coll.hideIndex(name)</code>) to test its removal safely." }
      ]
    },
    {
      id: "explain-plans",
      q: "How do you use explain() to check whether a MongoDB query uses an index?",
      topic: "Indexes & Performance",
      level: 2,
      top: true,
      short: "Call .explain(\"executionStats\") on the query. Check the winning plan's stages: COLLSCAN means a full collection scan, IXSCAN means an index was used, FETCH means documents were loaded, and a SORT stage means an in-memory sort. Then compare nReturned with totalKeysExamined and totalDocsExamined. In a healthy query all three are close; examining 200,000 documents to return 12 means you need a better index.",
      a: [
        { p: "<code>explain()</code> has three verbosity modes: <code>\"queryPlanner\"</code> (the chosen plan, nothing executed), <code>\"executionStats\"</code> (runs the winning plan and reports counts and time) and <code>\"allPlansExecution\"</code> (also stats for the rejected candidate plans)." },
        { code: `db.orders.find({ customerId: "c42", status: "paid" }).sort({ createdAt: -1 })
         .explain("executionStats");

// BEFORE (no suitable index) - trimmed
queryPlanner.winningPlan:
  { stage: "SORT", sortPattern: { createdAt: -1 },
    inputStage: { stage: "COLLSCAN", filter: { $and: [ ... ] }, direction: "forward" } }
executionStats:
  { nReturned: 12, executionTimeMillis: 85, totalKeysExamined: 0, totalDocsExamined: 200000 }

// AFTER db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 })
queryPlanner.winningPlan:
  { stage: "FETCH",
    inputStage: { stage: "IXSCAN", indexName: "customerId_1_status_1_createdAt_-1",
                  keyPattern: { customerId: 1, status: 1, createdAt: -1 } } }
executionStats:
  { nReturned: 12, executionTimeMillis: 0, totalKeysExamined: 12, totalDocsExamined: 12 }`, lang: "javascript", run: false, title: "Reading explain output (illustrative, trimmed)" },
        { table: { head: ["Stage / metric", "Meaning", "Good or bad"], rows: [
          ["<code>COLLSCAN</code>", "Read every document", "Bad on large collections"],
          ["<code>IXSCAN</code>", "Walk an index", "Good"],
          ["<code>FETCH</code>", "Load full documents for matching keys", "Normal; absent in covered queries"],
          ["<code>SORT</code>", "In-memory sort (spills to disk if large)", "Avoid with an ESR-ordered index"],
          ["<code>PROJECTION_COVERED</code>", "Answered from the index alone", "Best"],
          ["<code>totalDocsExamined / nReturned</code>", "Documents read per result", "Aim for about 1"],
          ["<code>totalKeysExamined / nReturned</code>", "Index keys scanned per result", "High means the index is not selective or not in ESR order"]
        ] } },
        { ul: [
          "Works on aggregations too: <code>db.orders.explain(\"executionStats\").aggregate([...])</code>. Check that the first <code>$match</code> uses an IXSCAN.",
          "The query planner caches the winning plan per query shape. You can force an index with <code>.hint({ customerId: 1, status: 1, createdAt: -1 })</code> while testing.",
          "Since MongoDB 7.0, many queries run on the slot-based execution engine (SBE), and explain output may show <code>queryPlan</code> / <code>slotBasedPlan</code> sections. The stage names and the key/doc counts are still what you read.",
          "In production, find slow queries with the profiler (<code>db.setProfilingLevel(1, { slowms: 100 })</code>), the slow-query log, or the Atlas Performance Advisor."
        ] },
        { tip: "Quote the three numbers in interviews: \"nReturned 12, keys examined 12, docs examined 12, so the index is perfectly selective.\" That is exactly what a reviewer wants to hear." }
      ]
    },
    {
      id: "performance-pitfalls",
      q: "What are the most common MongoDB performance pitfalls, and how do you avoid them?",
      topic: "Indexes & Performance",
      level: 2,
      top: true,
      short: "The usual pitfalls: missing or badly ordered indexes causing collection scans and in-memory sorts; unbounded arrays that grow documents toward the 16 MB limit; unanchored or case-insensitive regex that cannot use an index; deep skip pagination; fetching whole documents without projection; N+1 queries from populate or app-side joins; too many indexes slowing writes; a working set larger than RAM; and a monotonically increasing shard key that creates a hot shard.",
      a: [
        { table: { head: ["Pitfall", "Symptom", "Fix"], rows: [
          ["No index / wrong order", "COLLSCAN or SORT stage, high docsExamined", "Compound index following ESR; check with explain"],
          ["Unbounded array (all comments or events in one doc)", "Documents keep growing, slow updates, 16 MB error", "Separate collection, the <b>bucket</b> pattern, or <code>$push</code> with <code>$slice</code>"],
          ["<code>/.*phone.*/i</code> regex", "Scans the whole index or collection", "Anchored prefix <code>/^pho/</code>; case-insensitive index via collation; Atlas Search"],
          ["Deep <code>skip()</code>", "Later pages get slower and slower", "Keyset pagination"],
          ["No projection", "Large network transfer, memory use", "<code>find(q, { name: 1, price: 1 })</code>"],
          ["N+1 queries", "Hundreds of small queries per request", "Embed, <code>$lookup</code>, or batch with <code>$in</code>"],
          ["Too many indexes", "Slow inserts, RAM pressure", "Drop unused ones (<code>$indexStats</code>)"],
          ["Working set &gt; RAM", "Disk reads, cache eviction, latency spikes", "Better indexes, smaller documents, archive old data, scale up or shard"],
          ["<code>$where</code> / <code>$function</code>", "JavaScript runs per document, no index", "Use <code>$expr</code> and aggregation operators"],
          ["Monotonic shard key", "One shard takes all the inserts", "Hashed or compound shard key"]
        ] } },
        { code: `// Case-insensitive lookup that CAN use an index: a collation with strength 2
db.users.createIndex({ name: 1 }, { collation: { locale: "en", strength: 2 } });
db.users.find({ name: "asha" }).collation({ locale: "en", strength: 2 });  // matches "Asha", "ASHA"

// Bucket pattern: one document per sensor per hour instead of one per reading
db.readings.updateOne(
  { sensorId: "s-17", hour: ISODate("2026-10-03T10:00:00Z"), count: { $lt: 200 } },
  { $push: { samples: { t: new Date(), v: 22.4 } }, $inc: { count: 1 } },
  { upsert: true }
);
// (MongoDB 5.0+ time series collections do this bucketing for you)

// Capped array: keep only the 10 most recent items
db.users.updateOne({ _id: uid }, { $push: { recentViews: { $each: [productId], $slice: -10 } } });`, lang: "javascript", run: false, title: "Fixes in code" },
        { ul: [
          "Use <code>countDocuments(filter)</code> only when necessary. On huge collections it is a scan. <code>estimatedDocumentCount()</code> reads collection metadata instantly but ignores filters.",
          "In Node, reuse <b>one MongoClient</b> per process (it holds a connection pool). Creating a client per request is a common cause of connection storms.",
          "Mongoose: use <code>.lean()</code> for read-only queries. It returns plain objects and skips document hydration, which is much faster for lists.",
          "Large <code>$in</code> lists (thousands of values) and <code>$lookup</code> without an index on <code>foreignField</code> are hidden hot spots."
        ] },
        { tip: "Frame it as a workflow: profiler or Atlas Performance Advisor → explain the worst query shapes → fix the index or schema → measure. Then mention one schema-level fix (bucket or subset pattern). That shows you understand that MongoDB performance is mostly schema design." }
      ]
    },

    /* ───────────── Schema Design ───────────── */
    {
      id: "embedding-vs-referencing",
      q: "Embedding vs referencing: how do you design a MongoDB schema, with a worked example?",
      topic: "Schema Design",
      level: 2,
      top: true,
      short: "Design for how the app reads and writes data: data that is accessed together should be stored together. Embed when the relationship is one-to-few, the child belongs to the parent, it is read with the parent, and it is bounded in size. Reference when the child set is unbounded or large, when entities are shared (many-to-many), or when they are queried or updated independently. Hybrid patterns are common, such as embedding a subset or a snapshot of referenced data.",
      a: [
        { p: "Relational design starts from the entities and normalizes them. MongoDB design starts from the <b>queries</b>: list the screens and API calls, see which data each needs, and shape documents so that the most frequent operations read and write a single document. Some duplication (controlled <a href=\"#/core/dbms/denormalization\">denormalization</a>) is expected." },
        { table: { head: ["Embed when…", "Reference when…"], rows: [
          ["One-to-one or one-to-few (addresses, phone numbers)", "One-to-many with a large or unbounded side (comments, logs, orders of a user)"],
          ["The child has no meaning without the parent (order line items)", "The entity is shared by many parents (products, authors, tags with metadata)"],
          ["Always read together with the parent", "Often queried on its own"],
          ["Updated together, so atomic in one write", "Updated frequently and independently (a product's stock)"],
          ["Bounded size, well under 16 MB", "Would grow the parent without limit"]
        ] } },
        { h: "Worked example: an e-commerce app" },
        { code: `// users: addresses embedded (few, owned, always shown with the profile)
{ _id: ObjectId("…u1"), name: "Asha", email: "asha@x.com",
  addresses: [ { label: "home", city: "Pune", pin: "411001" } ] }

// products: shared by many orders and updated independently -> own collection
{ _id: ObjectId("…p1"), name: "Backpack", price: 900, stock: 12,
  rating: { avg: 4.4, count: 132 },                 // computed pattern: kept up to date on each review
  recentReviews: [ { user: "Ravi", stars: 5, text: "Solid" } ] }   // subset pattern: latest 5 only

// reviews: unbounded -> separate collection that references the product
{ _id: ObjectId("…r1"), productId: ObjectId("…p1"), userId: ObjectId("…u2"), stars: 5, text: "Solid" }

// orders: reference the customer, but EMBED line items and a snapshot of the product
{ _id: ObjectId("…o1"), customerId: ObjectId("…u1"), status: "paid",
  createdAt: ISODate("2026-10-03T10:30:00Z"),
  shipTo: { city: "Pune", pin: "411001" },          // copy: the order must not change if the user moves
  items: [ { productId: ObjectId("…p1"), name: "Backpack", price: 900, qty: 1 } ],   // price at purchase time
  total: 900 }`, lang: "javascript", run: false, title: "Collections and document shapes" },
        { ul: [
          "<b>Order page</b>: one read of the order document gives you everything, with no joins.",
          "<b>Product page</b>: one read shows the product, its rating and the latest reviews. \"See all reviews\" queries the <code>reviews</code> collection with an index on <code>{ productId: 1, _id: -1 }</code>.",
          "<b>Duplication is intentional</b>: the product name and price inside an order are a historical snapshot, not stale data. A user's name copied into <code>recentReviews</code> is stale-tolerant; update it in the background if needed.",
          "<b>Many-to-many</b> (students ↔ courses): store an array of ids on the side that is smaller or queried more, for example <code>courseIds</code> on the student, and add a multikey index."
        ] },
        { table: { head: ["Pattern", "Idea"], rows: [
          ["Extended reference", "Store the id plus the few fields you always display (e.g. <code>{customerId, customerName}</code>)"],
          ["Subset", "Embed the hot part (last 5 reviews); keep the rest in another collection"],
          ["Computed", "Keep running totals or averages updated on write instead of computing on every read"],
          ["Bucket", "Group many small items (time-series readings) into one document per time window"],
          ["Outlier", "Handle the rare huge case (a celebrity with millions of followers) with overflow documents"]
        ] } },
        { warn: "The classic mistake is embedding an ever-growing array, such as every comment inside a viral post, or every order inside the user document. Documents grow toward 16 MB, every update rewrites a big document, and index entries multiply. If the array can grow without a bound, reference it." },
        { tip: "Say the rule out loud: \"Data that is accessed together should be stored together, and I check that every array is bounded.\" Then justify each embed or reference choice by a specific screen or query." }
      ]
    },
    {
      id: "schema-validation",
      q: "How do you enforce a schema in MongoDB with $jsonSchema validation?",
      topic: "Schema Design",
      level: 2,
      top: false,
      short: "Attach a validator to the collection, usually a $jsonSchema document listing required fields, BSON types, enums, patterns and ranges. MongoDB checks every insert and update against it on the server, so every client is covered, not only the one using Mongoose. validationLevel strict checks all writes; moderate checks only documents that are already valid. validationAction error rejects bad writes, while warn only logs them, which is useful when rolling validation out on old data.",
      a: [
        { p: "Application-level schemas (Mongoose, Zod, Pydantic) protect only the code that uses them. A <b>server-side validator</b> protects the collection from every writer: scripts, other services and the shell." },
        { code: `db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "role", "createdAt"],
      properties: {
        email:     { bsonType: "string", pattern: "^[^@\\\\s]+@[^@\\\\s]+$", description: "must be an email" },
        name:      { bsonType: "string", minLength: 1, maxLength: 80 },
        role:      { enum: ["user", "admin"] },
        age:       { bsonType: "int", minimum: 13 },
        createdAt: { bsonType: "date" },
        address: {
          bsonType: "object",
          properties: { city: { bsonType: "string" }, pin: { bsonType: "string", pattern: "^[0-9]{6}$" } }
        }
      }
    }
  },
  validationLevel: "strict",      // or "moderate"
  validationAction: "error"       // or "warn"
});

db.users.insertOne({ email: "asha@x.com", name: "Asha", role: "superuser", createdAt: new Date() });
// MongoServerError: Document failed validation
//   (errInfo.details explains: role is not one of the enum values)

// Change the rules on an existing collection
db.runCommand({ collMod: "users", validator: { $jsonSchema: { /* … */ } }, validationLevel: "moderate" });`, lang: "javascript", run: false, title: "Validator on a collection" },
        { table: { head: ["Setting", "Values", "Meaning"], rows: [
          ["<code>validationLevel</code>", "<code>strict</code> (default)", "Validate every insert and update"],
          ["", "<code>moderate</code>", "Validate inserts, and updates to documents that already pass; existing invalid docs can still be updated"],
          ["", "<code>off</code>", "No validation"],
          ["<code>validationAction</code>", "<code>error</code> (default)", "Reject the write"],
          ["", "<code>warn</code>", "Allow it but write a log entry"]
        ] } },
        { ul: [
          "Since MongoDB 5.0, a failed write includes a detailed explanation in <code>errInfo</code>, which makes debugging much easier.",
          "Use <code>bsonType</code> (not JSON Schema's <code>type</code>) to distinguish <code>int</code>, <code>long</code>, <code>double</code>, <code>decimal</code>, <code>date</code> and <code>objectId</code>.",
          "Rollout on an old collection: start with <code>warn</code>, find bad documents with <code>db.users.find({ $nor: [ { $jsonSchema: schema } ] })</code>, fix them, then switch to <code>error</code>.",
          "Uniqueness is <b>not</b> part of validation: use a unique index."
        ] },
        { warn: "<code>additionalProperties: false</code> also rejects <code>_id</code> unless you list it in <code>properties</code>. Teams switching it on suddenly find that every insert fails." }
      ]
    },

    /* ───────────── Transactions & Scaling ───────────── */
    {
      id: "transactions",
      q: "Does MongoDB support ACID transactions? How do multi-document transactions work and when should you use them?",
      topic: "Transactions & Scaling",
      level: 2,
      top: true,
      short: "Single-document operations have always been atomic, including nested fields and arrays. Multi-document ACID transactions arrived in MongoDB 4.0 for replica sets and in 4.2 for sharded clusters. You start a session, run operations with that session, and commit or abort; the driver's withTransaction helper also retries transient errors. Transactions need a replica set (even a single-node one in development), default to a 60-second lifetime, and cost more than single-document writes, so model data to need them rarely.",
      a: [
        { p: "Because one document can hold a whole aggregate (an order with its items), most operations that need a transaction in SQL are a <b>single atomic document write</b> in MongoDB. For the rest, such as moving money between two accounts or creating an order and decrementing stock in another collection, use a multi-document transaction. See <a href=\"#/core/dbms/acid-properties\">ACID</a>." },
        { code: `const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI);   // must point to a replica set / Atlas

async function transfer(fromId, toId, amount) {
  const accounts = client.db("bank").collection("accounts");
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const debit = await accounts.updateOne(
        { _id: fromId, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session }                                      // every operation must pass the session
      );
      if (debit.modifiedCount !== 1) throw new Error("insufficient funds");   // aborts the transaction
      await accounts.updateOne({ _id: toId }, { $inc: { balance: amount } }, { session });
      await client.db("bank").collection("ledger").insertOne(
        { fromId, toId, amount, at: new Date() }, { session });
    }, {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" }
    });
  } finally {
    await session.endSession();
  }
}`, lang: "javascript", run: false, title: "Node.js driver: withTransaction" },
        { ul: [
          "<code>withTransaction</code> commits automatically, and retries the callback on <code>TransientTransactionError</code> (for example a write conflict or failover) and the commit on <code>UnknownTransactionCommitResult</code>. Keep the callback <b>idempotent</b>, with no side effects such as sending emails inside it.",
          "Isolation: the transaction reads from a snapshot. If two transactions write the same document, the second gets a <b>write conflict</b> and is retried. MongoDB does not wait for row locks the way SQL databases do.",
          "Limits: default maximum runtime is 60 s (<code>transactionLifetimeLimitSeconds</code>). Keep transactions short and touch few documents; changing more than about 1,000 documents in one transaction is discouraged.",
          "Version history: 4.0 replica sets → 4.2 sharded clusters (distributed transactions) → 4.4 creating collections and indexes inside a transaction."
        ] },
        { table: { head: ["Need", "Use"], rows: [
          ["Update an order and its line items", "One document → single atomic update"],
          ["Decrement stock only if available", "<code>updateOne({stock: {$gte: n}}, {$inc: …})</code>, no transaction"],
          ["Debit A and credit B in different documents", "Multi-document transaction"],
          ["Create an order + reserve stock + write an outbox event", "Transaction (or a saga with compensations across services)"]
        ] } },
        { warn: "A standalone <code>mongod</code> does not support transactions; you get \"Transaction numbers are only allowed on a replica set member or mongos\". In development, run a single-node replica set (<code>--replSet rs0</code> then <code>rs.initiate()</code>) or use Atlas." },
        { tip: "If an interviewer says \"MongoDB isn't ACID\", correct it politely: single-document writes always were, and multi-document transactions have existed since 4.0. Then add that a good document design makes them rarely necessary." }
      ]
    },
    {
      id: "write-read-concern",
      q: "What are write concern, read concern and read preference in MongoDB?",
      topic: "Transactions & Scaling",
      level: 3,
      top: true,
      short: "Write concern sets how many replica set members must acknowledge a write before it counts as successful: w:1 is the primary only, w:\"majority\" means most data-bearing members (the default since 5.0), and j:true waits for the on-disk journal. Read concern sets how durable the data you read must be: local, available, majority, linearizable or snapshot. Read preference sets which members you read from: primary by default, or secondaries, which may return stale data.",
      a: [
        { p: "These three knobs let you trade <b>latency</b> against <b>durability and consistency</b> per operation. They only matter because data is replicated (see <a href=\"#/core/sd/database-replication\">replication</a>)." },
        { table: { head: ["Write concern", "Acknowledged when…", "Risk"], rows: [
          ["<code>w: 0</code>", "Never (fire and forget)", "Silent data loss; only for throwaway metrics"],
          ["<code>w: 1</code>", "The primary applied the write", "Can be <b>rolled back</b> if the primary fails before replicating"],
          ["<code>w: \"majority\"</code> (default since 5.0)", "A majority of voting, data-bearing members have it", "Survives failover; a little higher latency"],
          ["<code>j: true</code>", "Also written to the on-disk journal", "Survives a crash of the acknowledging nodes"],
          ["<code>wtimeout</code>", "Gives up waiting after N ms", "The write may still succeed later; the error just means \"not confirmed in time\""]
        ] } },
        { table: { head: ["Read concern", "Returns"], rows: [
          ["<code>local</code> (default)", "The node's latest data, which might later be rolled back"],
          ["<code>available</code>", "Like local; on sharded clusters may even return orphaned documents. Lowest latency"],
          ["<code>majority</code>", "Only data acknowledged by a majority, so it can never be rolled back"],
          ["<code>linearizable</code>", "Majority data that reflects all writes acknowledged before the read started; primary only, slow"],
          ["<code>snapshot</code>", "A consistent point-in-time view (transactions, and some reads since 5.0)"]
        ] } },
        { code: `// Per-operation settings in the Node.js driver
await orders.insertOne(order, { writeConcern: { w: "majority", j: true, wtimeout: 5000 } });

const recent = await orders.find(
  { customerId },
  { readConcern: { level: "majority" }, readPreference: "secondaryPreferred" }
).toArray();

// Or in the connection string
// mongodb+srv://cluster0.example.net/shop?w=majority&readPreference=primary&retryWrites=true`, lang: "javascript", run: false, title: "Setting them in code" },
        { table: { head: ["Read preference", "Reads from", "Use for"], rows: [
          ["<code>primary</code> (default)", "Primary only", "Anything that must see the latest writes"],
          ["<code>primaryPreferred</code>", "Primary, or a secondary if the primary is down", "Read availability during elections"],
          ["<code>secondary</code> / <code>secondaryPreferred</code>", "Secondaries", "Analytics and reports that tolerate lag"],
          ["<code>nearest</code>", "Lowest network latency member", "Geo-distributed reads"]
        ] } },
        { warn: "Reading from secondaries is not a free scaling trick. Secondaries replicate asynchronously, so a user who just saved a profile may read the old version from a secondary. For read-your-own-writes, read from the primary or use causally consistent sessions." },
        { tip: "Tie it to CAP: <code>w: \"majority\"</code> + <code>readConcern: \"majority\"</code> + primary reads gives you strong, durable behaviour. <code>w: 1</code> + secondary reads gives lower latency but weaker guarantees. See <a href=\"#/core/dbms/cap-theorem\">CAP theorem</a>." }
      ]
    },
    {
      id: "replica-sets",
      q: "How does a MongoDB replica set work: primaries, secondaries, the oplog and elections?",
      topic: "Transactions & Scaling",
      level: 2,
      top: true,
      short: "A replica set is a group of mongod processes holding the same data, usually three. One primary accepts all writes and records them in its oplog, a capped collection of idempotent operations. Secondaries continuously pull the oplog and apply it. Members send each other heartbeats every 2 seconds. If the primary is unreachable for electionTimeoutMillis (10 seconds by default), the remaining members hold a Raft-like election and the most up-to-date eligible secondary that wins a majority of votes becomes the new primary. Drivers discover it automatically.",
      a: [
        { p: "Replica sets provide <b>high availability</b> (automatic failover) and <b>redundancy</b>. They are the minimum production deployment, and they are required for transactions and change streams. Atlas clusters are replica sets by default." },
        { svg: `<svg viewBox="0 0 660 270" width="660" class="dg">
  <rect class="box-p" x="250" y="10" width="160" height="36" rx="6"/>
  <text class="tx" x="330" y="28" text-anchor="middle" dominant-baseline="middle">App (driver)</text>
  <line class="ln" x1="330" y1="46" x2="330" y2="84" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="340" y="70">reads + writes</text>
  <rect class="box-a" x="230" y="86" width="200" height="54" rx="6"/>
  <text class="tx tx-b" x="330" y="106" text-anchor="middle">PRIMARY</text>
  <text class="tx-s" x="330" y="126" text-anchor="middle">writes go to oplog</text>
  <rect class="box-g" x="40" y="196" width="200" height="54" rx="6"/>
  <text class="tx tx-b" x="140" y="216" text-anchor="middle">SECONDARY 1</text>
  <text class="tx-s" x="140" y="236" text-anchor="middle">applies oplog</text>
  <rect class="box-g" x="420" y="196" width="200" height="54" rx="6"/>
  <text class="tx tx-b" x="520" y="216" text-anchor="middle">SECONDARY 2</text>
  <text class="tx-s" x="520" y="236" text-anchor="middle">applies oplog</text>
  <line class="ln ln-a" x1="250" y1="140" x2="160" y2="194" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-a" x1="410" y1="140" x2="500" y2="194" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="150" y="160" text-anchor="middle">oplog replication</text>
  <text class="tx-a" x="510" y="160" text-anchor="middle">(secondaries pull)</text>
  <line class="ln ln-d" x1="240" y1="223" x2="420" y2="223"/>
  <text class="tx-m" x="330" y="215" text-anchor="middle">heartbeats every 2 s</text>
</svg>`, caption: "Three-member replica set: one primary, two secondaries replicating its oplog" },
        { h: "Failover step by step" },
        { ol: [
          "The primary crashes or loses its network connection.",
          "Secondaries miss its heartbeats for <code>electionTimeoutMillis</code> (10 s by default).",
          "A secondary calls an election (protocol version 1, based on Raft). Voters prefer the candidate with the most recent oplog and higher <code>priority</code>.",
          "The candidate that wins a <b>majority</b> of votes becomes primary. Drivers detect this and send new writes to it. With retryable writes (default in modern drivers), an interrupted write is retried once.",
          "When the old primary returns, it rejoins as a secondary. Any writes it had accepted but never replicated (only possible with <code>w: 1</code>) are <b>rolled back</b> and saved to rollback files."
        ] },
        { table: { head: ["Member type", "Purpose"], rows: [
          ["Primary", "The only member that accepts writes"],
          ["Secondary", "Copy of the data; can serve reads (stale) and become primary"],
          ["Arbiter", "Votes but holds no data. Discouraged: it weakens <code>majority</code> durability"],
          ["Priority 0", "Never becomes primary (e.g. a node in a far-away data centre)"],
          ["Hidden", "Invisible to app reads; used for backups or analytics"],
          ["Delayed", "Applies the oplog N hours late, as protection against accidental deletes"]
        ] } },
        { ul: [
          "Use an <b>odd number of voting members</b> (3 or 5) so a majority exists after a partition. A replica set can have up to 50 members, but at most 7 voting.",
          "With 3 members, the set survives the loss of 1. With 5, it survives the loss of 2.",
          "The oplog is a fixed-size capped collection (<code>local.oplog.rs</code>). If a secondary is down longer than the oplog window, it needs a full resync. Size the oplog for your maintenance windows."
        ] },
        { tip: "Watch replication health with <code>rs.status()</code> and <code>rs.printSecondaryReplicationInfo()</code> (replication lag). Mention that a partitioned old primary steps down because it can no longer see a majority, which prevents split-brain." }
      ]
    },
    {
      id: "sharding",
      q: "How does sharding work in MongoDB, and how do you choose a good shard key?",
      topic: "Transactions & Scaling",
      level: 3,
      top: true,
      short: "Sharding splits a collection across several shards (each one a replica set) by a shard key. mongos routers send each query to the right shards using metadata held on the config servers, and a balancer moves chunks of key ranges to even out data. A good shard key has high cardinality, low frequency (no single value is very common) and is not monotonically increasing, and it appears in most queries so they can be targeted. A monotonically increasing key such as a timestamp or ObjectId sends every insert to one hot shard.",
      a: [
        { p: "Sharding is MongoDB's built-in <b>horizontal scaling</b>: when one replica set cannot hold the data or handle the write load, you split the collection across many. General theory: <a href=\"#/core/sd/database-sharding\">database sharding</a>." },
        { svg: `<svg viewBox="0 0 660 230" width="660" class="dg">
  <rect class="box-p" x="250" y="10" width="160" height="34" rx="6"/>
  <text class="tx" x="330" y="27" text-anchor="middle" dominant-baseline="middle">App (driver)</text>
  <line class="ln" x1="330" y1="44" x2="330" y2="72" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="250" y="74" width="160" height="40" rx="6"/>
  <text class="tx tx-b" x="330" y="94" text-anchor="middle" dominant-baseline="middle">mongos router</text>
  <rect class="box-w" x="470" y="74" width="170" height="40" rx="6"/>
  <text class="tx" x="555" y="94" text-anchor="middle" dominant-baseline="middle">config servers (RS)</text>
  <line class="ln ln-d" x1="410" y1="94" x2="468" y2="94" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="440" y="86" text-anchor="middle">metadata</text>
  <line class="ln" x1="290" y1="114" x2="120" y2="164" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="114" x2="330" y2="164" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="370" y1="114" x2="540" y2="164" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="30" y="166" width="180" height="50" rx="6"/>
  <text class="tx tx-b" x="120" y="184" text-anchor="middle">Shard A (replica set)</text>
  <text class="tx-s" x="120" y="204" text-anchor="middle">chunks: key MinKey … k1</text>
  <rect class="box-g" x="240" y="166" width="180" height="50" rx="6"/>
  <text class="tx tx-b" x="330" y="184" text-anchor="middle">Shard B (replica set)</text>
  <text class="tx-s" x="330" y="204" text-anchor="middle">chunks: k1 … k2</text>
  <rect class="box-g" x="450" y="166" width="180" height="50" rx="6"/>
  <text class="tx tx-b" x="540" y="184" text-anchor="middle">Shard C (replica set)</text>
  <text class="tx-s" x="540" y="204" text-anchor="middle">chunks: k2 … MaxKey</text>
</svg>`, caption: "Sharded cluster: mongos routes by shard key using metadata on the config servers" },
        { code: `sh.enableSharding("shop");                          // optional since 6.0; still common
sh.shardCollection("shop.orders", { customerId: 1, _id: 1 });   // ranged, compound key
sh.shardCollection("shop.events", { deviceId: "hashed" });      // hashed: even write spread
sh.status();

// Targeted: includes the shard key -> goes to one shard
db.orders.find({ customerId: "c42" });
// Scatter-gather: no shard key -> mongos asks EVERY shard and merges results
db.orders.find({ status: "pending" });`, lang: "javascript", run: false, title: "Sharding a collection" },
        { code: `const crypto = require("crypto");
const shards = ["shardA", "shardB", "shardC"];

// Ranged sharding on createdAt: existing chunk boundaries
const t1 = Date.UTC(2026, 0, 1), t2 = Date.UTC(2026, 6, 1);
const ranged = (ts) => (ts < t1 ? "shardA" : ts < t2 ? "shardB" : "shardC");

// Hashed sharding: MongoDB hashes the key value and splits the HASH space into ranges.
// We mimic it with md5 -> first 4 bytes -> mod 3 (simplified).
const hashed = (key) => shards[crypto.createHash("md5").update(String(key)).digest().readUInt32BE(0) % 3];

function simulate(route) {
  const counts = { shardA: 0, shardB: 0, shardC: 0 };
  const now = Date.UTC(2026, 9, 3);
  for (let i = 0; i < 9000; i++) counts[route(now + i * 1000)]++;   // 9000 new orders, 1 per second
  return counts;
}
console.log("ranged on createdAt:", simulate(ranged));
console.log("hashed on createdAt:", simulate(hashed));
// ranged on createdAt: { shardA: 0, shardB: 0, shardC: 9000 }       <- hot shard
// hashed on createdAt: { shardA: 2934, shardB: 3021, shardC: 3045 }`, lang: "javascript", title: "Why a monotonic shard key creates a hot shard (simulation)" },
        { table: { head: ["Shard key property", "Why", "Bad example"], rows: [
          ["High cardinality", "Enough distinct values to split into many chunks", "<code>country</code> (a few values → jumbo chunks)"],
          ["Low frequency", "No single value dominates", "<code>status</code>: 90% are \"delivered\""],
          ["Non-monotonic", "Inserts spread across shards", "<code>createdAt</code>, <code>ObjectId</code> with ranged sharding"],
          ["Used by queries", "Lets mongos target one shard instead of all", "A hashed <code>_id</code> when every query filters by <code>customerId</code>"]
        ] } },
        { ul: [
          "<b>Ranged</b> keys keep nearby values together (efficient range queries) but risk hot spots. <b>Hashed</b> keys spread writes evenly but turn range queries into scatter-gather. A compound key such as <code>{ customerId: 1, createdAt: 1 }</code> often gives both: spread by customer, ordered within a customer.",
          "Chunks are contiguous key ranges (128 MB by default since 6.0). The balancer migrates chunks between shards in the background. Zones pin key ranges to specific shards, for example to keep Indian users' data in an India region.",
          "Changing your mind: <code>refineCollectionShardKey</code> (4.4) adds suffix fields; <code>reshardCollection</code> (5.0) changes the key online, but it is heavy.",
          "Unique indexes on a sharded collection must include the shard key as a prefix."
        ] },
        { warn: "Do not shard too early. Sharding adds operational complexity (mongos, config servers, balancer) and the shard key is a long-term decision. Exhaust indexes, schema fixes and vertical scaling first; a single replica set handles a lot." }
      ]
    },
    {
      id: "consistency-model",
      q: "What consistency guarantees does MongoDB give? Is it CP or AP, and what are causally consistent sessions?",
      topic: "Transactions & Scaling",
      level: 3,
      top: false,
      short: "With default settings (primary reads and majority writes), MongoDB behaves as a strongly consistent, CP-leaning system: one primary orders all writes, and during an election writes are briefly unavailable. Reads from secondaries are eventually consistent. Causally consistent sessions, combined with majority read and write concerns, guarantee read-your-writes, monotonic reads, monotonic writes and writes-follow-reads, even when reading from secondaries. Single-document operations are atomic and isolated.",
      a: [
        { p: "Consistency in MongoDB is <b>tunable</b>. The guarantees you get depend on read preference plus read and write concern. Theory: <a href=\"#/core/sd/strong-vs-eventual-consistency\">strong vs eventual consistency</a>." },
        { table: { head: ["Configuration", "What you get"], rows: [
          ["Primary reads + <code>w: \"majority\"</code> + <code>readConcern: \"majority\"</code>", "Durable, never-rolled-back data; strong behaviour for most apps"],
          ["Primary reads + <code>readConcern: \"linearizable\"</code>", "Linearizable single-document reads; slowest"],
          ["Secondary reads (<code>local</code>)", "Eventually consistent: may be seconds behind"],
          ["<code>w: 1</code> writes", "Fast, but may be rolled back after a failover"],
          ["Causally consistent session + majority concerns", "Read-your-writes, monotonic reads/writes, writes-follow-reads, even on secondaries"],
          ["Transactions with <code>snapshot</code>", "All-or-nothing changes and a consistent snapshot across documents"]
        ] } },
        { code: `const session = client.startSession({ causalConsistency: true });   // causal is the default for sessions
const users = client.db("app").collection("users");

await users.updateOne(
  { _id: userId }, { $set: { name: "Asha S" } },
  { session, writeConcern: { w: "majority" } }
);

// Even on a lagging secondary, this read waits until that member has
// caught up to the write above (the session carries an operationTime / clusterTime)
const me = await users.findOne(
  { _id: userId },
  { session, readPreference: "secondary", readConcern: { level: "majority" } }
);
await session.endSession();`, lang: "javascript", run: false, title: "Read-your-own-write from a secondary" },
        { h: "CP or AP?" },
        { ul: [
          "During a network partition, only the side with a majority can elect a primary. The minority side cannot accept writes. That is choosing <b>consistency over availability</b> for writes (CP-leaning).",
          "If you allow secondary reads, the minority side can still serve (possibly stale) reads, which is AP-like behaviour for reads.",
          "In <a href=\"#/core/sd/pacelc-theorem\">PACELC</a> terms: with no partition, majority concerns pay latency for consistency (EC), and <code>w: 1</code> with secondary reads trades consistency for latency (EL)."
        ] },
        { warn: "\"MongoDB is eventually consistent\" is an outdated blanket statement. Writes go through a single primary, and with majority concerns reads never see rolled-back data. Only secondary reads are eventually consistent." },
        { tip: "Use a concrete scenario: \"After a user changes their password, the next login must read from the primary or a causally consistent session. A trending-products widget can read from a secondary.\"" }
      ]
    },

    /* ───────────── Node, Security & Ops ───────────── */
    {
      id: "mongoose-basics",
      q: "What is Mongoose, and how do schemas, models, validation, middleware and populate work in a Node.js app?",
      topic: "Node, Security & Ops",
      level: 2,
      top: true,
      short: "Mongoose is an ODM (object document mapper) for MongoDB in Node.js. A Schema defines the fields, types, defaults, validators and indexes; a Model compiled from it is the class you query with (User.find, User.create). Mongoose casts types (such as strings to ObjectId), validates on save, supports middleware hooks like pre('save'), instance and static methods, virtuals, timestamps, and populate() to resolve references. Use lean() for fast read-only queries.",
      a: [
        { p: "The official MongoDB driver is schemaless. <b>Mongoose</b> adds an application-level schema, casting, validation and lifecycle hooks on top of it. It is very common in Express/MERN stacks. Current versions are promise-only (callbacks were removed in Mongoose 7)." },
        { code: `const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:     { type: String, required: true, maxlength: 80 },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: true, minlength: 8, select: false },   // hidden by default
    address:  { city: String, pin: { type: String, match: /^[0-9]{6}$/ } }
  },
  { timestamps: true }                       // adds createdAt / updatedAt
);

// Middleware: hash the password before saving. Use a normal function, not an arrow: "this" is the doc
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPassword = function (plain) {          // instance method
  return bcrypt.compare(plain, this.password);
};
userSchema.statics.findByEmail = function (email) {           // static method
  return this.findOne({ email: email.toLowerCase() });
};
userSchema.virtual("isAdmin").get(function () { return this.role === "admin"; });

const User = mongoose.model("User", userSchema);               // collection name: "users"

const postSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }
});
const Post = mongoose.model("Post", postSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);             // one connection pool per process
  const asha = await User.create({ email: "Asha@X.com", name: "Asha", password: "s3cret-pass" });
  await Post.create({ title: "Hello Mongo", author: asha._id });

  const posts = await Post.find()
    .populate("author", "name email")                          // second query, merged in
    .lean();                                                   // plain JS objects, faster
  console.log(posts[0].author.name);                          // "Asha"

  await User.updateOne({ _id: asha._id }, { role: "boss" }, { runValidators: true });  // fails: enum
}
main();`, lang: "javascript", run: false, title: "Schema, model, middleware, populate" },
        { table: { head: ["Concept", "What it is"], rows: [
          ["Schema", "Shape of documents: types, required, default, enum, min/max, match, custom validators, indexes"],
          ["Model", "A class compiled from a schema; static query API (<code>find</code>, <code>create</code>, <code>updateOne</code>…)"],
          ["Document", "An instance of a model with change tracking and <code>save()</code>"],
          ["Middleware (hooks)", "<code>pre</code>/<code>post</code> for <code>save</code>, <code>validate</code>, <code>findOneAndUpdate</code>, <code>deleteOne</code>, aggregate…"],
          ["populate()", "Replaces an ObjectId reference with the referenced document (extra query, not a server-side join)"],
          ["lean()", "Skips hydration into Mongoose documents: much faster, but no getters, virtuals or <code>save()</code>"]
        ] } },
        { warn: "Three classic traps: (1) <code>unique: true</code> is <b>not a validator</b>; it only builds a unique index, so duplicate errors come from MongoDB as E11000. (2) Validators run on <code>save()</code>/<code>create()</code>, but not on <code>updateOne</code>/<code>findOneAndUpdate</code> unless you pass <code>runValidators: true</code>. (3) <code>pre('save')</code> hooks do not run for <code>updateOne</code>; use query middleware for that." },
        { tip: "Know when not to use Mongoose: for high-throughput services or heavy aggregation work, some teams use the native driver (or Mongoose with <code>lean()</code> everywhere) to avoid hydration overhead." }
      ]
    },
    {
      id: "security-nosql-injection",
      q: "How do you secure MongoDB, and what is NoSQL injection?",
      topic: "Node, Security & Ops",
      level: 2,
      top: true,
      short: "Turn on authentication (SCRAM-SHA-256 or x.509) and role-based access control, give each app a user with only readWrite on its own database, bind to private interfaces, require TLS, and encrypt at rest and in backups. NoSQL injection happens when user input that is an object, such as {\"$ne\": null}, is placed directly into a query filter and changes its meaning, for example logging in without a password. Prevent it by validating input types, rejecting keys that start with $, and using Mongoose's sanitizeFilter.",
      a: [
        { h: "Hardening checklist" },
        { ul: [
          "<b>Authentication on</b>: <code>security.authorization: enabled</code>. Thousands of databases were wiped by ransom bots in 2017 because old versions listened on all interfaces with no auth. Since 3.6, <code>mongod</code> binds to localhost by default.",
          "<b>Least privilege (RBAC)</b>: built-in roles such as <code>read</code>, <code>readWrite</code>, <code>dbAdmin</code>, <code>userAdmin</code>, or custom roles. The app user never gets <code>root</code>.",
          "<b>Network</b>: private subnet or VPC peering, firewall / Atlas IP access list, TLS required.",
          "<b>Encryption</b>: at rest (Atlas, or Enterprise's encrypted storage engine), Client-Side Field Level Encryption or Queryable Encryption (GA in 7.0) for very sensitive fields.",
          "<b>Auditing</b> and secrets kept in a vault, never committed to git."
        ] },
        { code: `# mongod.conf
security:
  authorization: enabled
net:
  bindIp: 127.0.0.1,10.0.1.15
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongo.pem`, lang: "yaml", title: "Server config" },
        { code: `use admin
db.createUser({
  user: "orders_api",
  pwd: passwordPrompt(),                       // never type passwords into history
  roles: [ { role: "readWrite", db: "shop" } ]
});`, lang: "javascript", run: false, title: "Least-privilege app user (mongosh)" },
        { h: "NoSQL injection" },
        { code: `// Express's JSON body parser turns this request body into a nested object:
const body = JSON.parse('{"email": "asha@x.com", "password": {"$ne": null}}');

// VULNERABLE: users.findOne({ email: body.email, password: body.password })
const filter = { email: body.email, password: body.password };
console.log("filter sent to MongoDB:", JSON.stringify(filter));
// -> { password: { $ne: null } } is true for every user: login without the password

// Defence 1: validate types - credentials must be plain strings
function asString(value, field) {
  if (typeof value !== "string") throw new TypeError(field + " must be a string");
  return value;
}
try {
  asString(body.password, "password");
} catch (e) {
  console.log("rejected:", e.message);
}

// Defence 2: strip/deny operator keys anywhere in user input
function containsOperator(value) {
  if (value === null || typeof value !== "object") return false;
  return Object.keys(value).some((k) => k.startsWith("$") || k.includes(".") || containsOperator(value[k]));
}
console.log("operator in body?", containsOperator(body));
console.log("operator in safe body?", containsOperator({ email: "asha@x.com", password: "s3cret" }));
// filter sent to MongoDB: {"email":"asha@x.com","password":{"$ne":null}}
// rejected: password must be a string
// operator in body? true
// operator in safe body? false`, lang: "javascript", title: "How the attack works, and two defences (plain Node)" },
        { ul: [
          "Query strings are attack vectors too: with Express 4's default <code>qs</code> parser, <code>?age[$gt]=0</code> becomes <code>{ age: { $gt: \"0\" } }</code>. (Express 5 uses a simple parser by default.)",
          "Validate every request with a schema library (Zod, Joi, express-validator) so that fields have the expected primitive types.",
          "Mongoose: <code>mongoose.set(\"sanitizeFilter\", true)</code> wraps any <code>$</code>-keys found in filters in <code>$eq</code>, neutralizing them. Schema casting also helps: a String path cannot hold an object.",
          "Never build <code>$where</code>, <code>$function</code> or <code>$accumulator</code> JavaScript from user input. That is server-side JavaScript injection."
        ] },
        { warn: "Never compare plain-text passwords in a query at all. Fetch the user by email, then check the password with <code>bcrypt.compare</code>. That design is not vulnerable to the <code>$ne</code> trick even when other checks are missing." }
      ]
    },
    {
      id: "atlas-overview",
      q: "What is MongoDB Atlas and what does it give you beyond self-hosted MongoDB?",
      topic: "Node, Security & Ops",
      level: 1,
      top: false,
      short: "Atlas is MongoDB's fully managed cloud database service, running on AWS, Google Cloud and Azure. It provisions replica sets or sharded clusters and handles patching, upgrades, monitoring, automated backups with point-in-time restore, scaling and failover. It adds platform features such as Atlas Search (Lucene-based full-text search), Atlas Vector Search for embeddings and RAG, triggers, online archive and the Performance Advisor. There is a free M0 tier for learning and projects.",
      a: [
        { p: "Running MongoDB yourself means installing, securing, backing up, monitoring and upgrading replica sets. <b>Atlas</b> is the managed DBaaS from MongoDB Inc. You choose a cloud provider, region and tier, and connect with a <code>mongodb+srv://</code> connection string." },
        { table: { head: ["Feature", "What it does"], rows: [
          ["Cluster tiers", "Free <b>M0</b> (512 MB, good for student projects), low-cost <b>Flex</b> tier, dedicated <b>M10+</b> clusters with auto-scaling"],
          ["High availability", "Every cluster is at least a 3-member replica set; multi-region and multi-cloud options"],
          ["Backups", "Continuous cloud backups with point-in-time restore"],
          ["Security defaults", "Auth and TLS always on, IP access list, VPC peering / private endpoints, encryption at rest"],
          ["Atlas Search", "Lucene-based full-text search (fuzzy matching, autocomplete, facets) through a <code>$search</code> aggregation stage"],
          ["Atlas Vector Search", "<code>$vectorSearch</code> over embeddings for semantic search and RAG; works with LangChain"],
          ["Performance Advisor", "Suggests indexes from slow-query logs"],
          ["Triggers, Online Archive, Data Federation", "Event-driven functions, moving cold data to cheap storage, querying S3 data with MQL"]
        ] } },
        { code: `// Node.js: connect to Atlas (the URI comes from the Atlas "Connect" dialog, stored in an env var)
const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});
await client.connect();
await client.db("admin").command({ ping: 1 });

// Vector search stage (needs an Atlas Vector Search index named "vec_idx")
db.docs.aggregate([
  { $vectorSearch: { index: "vec_idx", path: "embedding", queryVector: qVec,
                     numCandidates: 100, limit: 5 } },
  { $project: { title: 1, score: { $meta: "vectorSearchScore" } } }
]);`, lang: "javascript", run: false, title: "Connecting and using an Atlas-only feature" },
        { ul: [
          "<b>Pros</b>: minutes to a production-grade cluster, no operations burden, built-in monitoring and alerts, easy scaling.",
          "<b>Cons</b>: cost at scale, some vendor lock-in for Atlas-only features (Search, Vector Search, Triggers), and you still own schema and index design.",
          "Alternatives: self-hosting with the Kubernetes operator, or compatible services such as Amazon DocumentDB and Azure Cosmos DB for MongoDB (API-compatible, but not every feature behaves identically)."
        ] },
        { tip: "If your resume project used Atlas, be ready to say what you configured: the IP access list, a database user with readWrite, the connection string in an environment variable (never committed), and which indexes you created. Interviewers check that you did not just copy and paste the URI." }
      ]
    }
  ]
});
