/* tech stack: REST APIs — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "rest",
  title: "REST APIs",
  short: "REST",
  icon: "⇄",
  blurb: "With REST APIs on your resume, interviewers skip 'what is GET' and test whether you can design an endpoint end to end: resource URLs, the right method and status code, a sane error format, pagination, auth with JWT/OAuth2, idempotency for payments, caching, CORS, rate limits and the OWASP API bugs (BOLA, mass assignment) that real APIs ship with.",
  topics: ["Fundamentals", "Design", "Request & Response", "Auth & Security", "Performance & Reliability", "Lifecycle & Tooling"],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "rest-constraints",
      q: "What makes an API RESTful, and what do the REST constraints (statelessness, uniform interface, HATEOAS) mean?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "REST is an architectural style from Roy Fielding's 2000 thesis, defined by six constraints: client-server, stateless requests, cacheable responses, a uniform interface, a layered system and optional code-on-demand. In practice a RESTful API exposes resources at URLs, manipulates them with standard HTTP methods and status codes, keeps no client session on the server, and marks responses cacheable where possible. HATEOAS, links in responses that drive the next action, is the part most real APIs skip.",
      a: [
        { p: "<b>REST</b> (Representational State Transfer) is an architectural <i>style</i>, not a protocol or a standard. An API is RESTful when it follows Fielding's constraints. HTTP is simply the most common way to meet them. For the HTTP-level basics see <a href=\"#/core/cn/rest-api\">CN: REST API</a>. This page is about designing one well." },
        { table: { head: ["Constraint", "What it means", "What it looks like in practice"], rows: [
          ["Client–server", "UI and data storage evolve independently", "React app and FastAPI backend deployed separately"],
          ["<b>Stateless</b>", "Each request carries everything needed to process it. No server-side session per client", "<code>Authorization: Bearer &lt;JWT&gt;</code> on every call. Any instance behind the load balancer can serve it"],
          ["Cacheable", "Responses say whether they can be cached", "<code>Cache-Control</code>, <code>ETag</code>, <code>304 Not Modified</code>"],
          ["<b>Uniform interface</b>", "Resources identified by URIs, manipulated through representations, self-descriptive messages, hypermedia", "<code>GET /orders/42</code> returns JSON with <code>Content-Type: application/json</code>"],
          ["Layered system", "Client can't tell if it talks to the origin or an intermediary", "CDN, API gateway, reverse proxy in front of the service"],
          ["Code on demand (optional)", "Server may send executable code", "Rare in APIs (JS for browsers)"]
        ] } },
        { p: "<b>Statelessness</b> is the one interviewers push on. It doesn't mean 'no database'. It means the server keeps no <i>conversation state</i> between requests. Application state (orders, users) lives in the DB. That is why stateless services scale horizontally: see <a href=\"#/core/sd/stateless-services\">SD: stateless services</a>." },
        { p: "<b>HATEOAS</b> (Hypermedia As The Engine Of Application State): the response includes links to the actions you can take next, so clients follow links instead of hard-coding URLs." },
        { code: `{
  "id": 42,
  "status": "pending",
  "total": 49900,
  "_links": {
    "self":    { "href": "/orders/42" },
    "cancel":  { "href": "/orders/42/cancel", "method": "POST" },
    "payment": { "href": "/orders/42/payment" }
  }
}`, lang: "json", title: "HATEOAS-style response (HAL-like links)" },
        { p: "Leonard Richardson's maturity model is a handy way to describe how RESTful an API is: <b>Level 0</b> one endpoint, everything is POST (SOAP-style RPC). <b>Level 1</b> separate resource URLs. <b>Level 2</b> proper HTTP verbs and status codes. <b>Level 3</b> hypermedia controls. Most production 'REST' APIs (GitHub, Stripe, Razorpay) are Level 2 with a few links." },
        { tip: "A good honest answer: 'Most APIs I've built are Level 2: resources, verbs, status codes, stateless JWT auth. I know HATEOAS exists; GitHub's API includes URL fields and pagination <code>Link</code> headers, which is the practical version of it.' If asked REST vs GraphQL vs gRPC, see <a href=\"#/core/sd/rest-vs-graphql-vs-grpc\">SD: REST vs GraphQL vs gRPC</a>." },
        { warn: "'REST = JSON over HTTP' is the common wrong answer. REST is about constraints. An API that is all <code>POST /doAction</code> with JSON bodies is RPC over HTTP, not REST." }
      ]
    },

    /* ───────────── Design ───────────── */
    {
      id: "resource-naming",
      q: "How do you name resources and design URLs for a REST API?",
      topic: "Design",
      level: 1,
      top: true,
      short: "URLs identify resources, so use nouns, not verbs, and let the HTTP method be the verb: GET /orders, POST /orders, GET /orders/42. Use plural collection names, lowercase with hyphens, nest only one level for true ownership like /users/7/orders, and put filtering, sorting and pagination in query parameters. Version in the path (/v1) or a header, and model awkward actions as sub-resources or state changes instead of verbs.",
      a: [
        { p: "The URL names a <b>thing</b> (a resource or collection). The HTTP method says what to <b>do</b> with it. Get that split right and most design questions answer themselves." },
        { table: { head: ["Rule", "Good", "Bad"], rows: [
          ["Nouns, not verbs", "<code>POST /orders</code>", "<code>POST /createOrder</code>"],
          ["Plural collections", "<code>GET /users/7</code>", "<code>GET /user/7</code> + <code>GET /users</code> mix"],
          ["Lowercase, hyphens", "<code>/payment-methods</code>", "<code>/PaymentMethods</code>, <code>/payment_methods</code>"],
          ["Hierarchy for ownership (max ~2 levels)", "<code>/users/7/orders</code>", "<code>/users/7/orders/42/items/3/reviews</code>"],
          ["Query params for filter/sort/page", "<code>/orders?status=paid&amp;sort=-created_at</code>", "<code>/orders/paid/sorted-by-date</code>"],
          ["No file extensions", "<code>Accept: application/json</code>", "<code>/orders.json</code>"],
          ["Stable opaque IDs", "<code>/orders/ord_8f2k</code> or numeric", "<code>/orders/by-name/Asha%20order</code>"]
        ] } },
        { code: `GET    /v1/courses                     # list (filter: ?branch=cse&semester=5)
POST   /v1/courses                     # create -> 201 + Location
GET    /v1/courses/{courseId}          # read one
PATCH  /v1/courses/{courseId}          # partial update
DELETE /v1/courses/{courseId}          # delete -> 204
GET    /v1/courses/{courseId}/students # sub-collection (students enrolled)
PUT    /v1/courses/{courseId}/students/{studentId}   # enroll (idempotent)
DELETE /v1/courses/{courseId}/students/{studentId}   # un-enroll`, lang: "text", title: "A consistent URL scheme" },
        { h: "Actions that aren't CRUD" },
        { ul: [
          "<b>Model it as a sub-resource</b>: cancelling an order becomes <code>POST /orders/42/cancellation</code>, or <code>PATCH /orders/42</code> with <code>{\"status\":\"cancelled\"}</code> if it's just a state change.",
          "<b>Create a 'process' resource</b>: <code>POST /reports</code> returns <code>202 Accepted</code> + <code>Location: /reports/r_9</code> to poll for a long-running export.",
          "<b>Pragmatic custom methods</b>: Google's API guide allows <code>POST /orders/42:cancel</code>. That's fine if it's used consistently across the API."
        ] },
        { h: "Versioning strategies" },
        { table: { head: ["Where", "Example", "Notes"], rows: [
          ["URL path", "<code>/v1/orders</code>", "Most common (Stripe-style major versions, Twitter/X, many Indian fintech APIs). Easy to route and cache"],
          ["Header", "<code>Accept: application/vnd.acme.v2+json</code> or <code>Api-Version: 2026-09-01</code>", "Cleaner URLs. GitHub uses <code>X-GitHub-Api-Version</code>, Stripe uses <code>Stripe-Version</code> dates"],
          ["Query param", "<code>/orders?version=2</code>", "Easy but pollutes caching/query semantics. Least preferred"]
        ] } },
        { tip: "Deep nesting is a smell. If an item has a globally unique id, expose <code>GET /order-items/{id}</code> directly. Keep <code>/orders/{id}/items</code> for listing within a parent." },
        { warn: "Don't leak implementation into URLs (<code>/api/getUsersFromMySQL</code>, table names, <code>.php</code>). URLs are a public contract you'll have to support for years." }
      ]
    },
    {
      id: "put-patch-post",
      q: "PUT vs PATCH vs POST: which do you use when, and which are idempotent?",
      topic: "Design",
      level: 2,
      top: true,
      short: "POST creates a subordinate resource or triggers a process. The server picks the id, and repeating it creates duplicates, so it is not idempotent. PUT replaces the whole resource at a known URL, and sending it twice leaves the same state, so it is idempotent. PATCH applies a partial change. It is idempotent only if the patch is, for example setting city=Delhi, while an increment or append is not. GET, PUT and DELETE are idempotent by spec; POST and PATCH aren't guaranteed to be.",
      a: [
        { p: "Idempotent means that making the same request N times has the <b>same effect on server state</b> as making it once. The response can differ: a second DELETE may return 404. The method table and safety rules are in <a href=\"#/core/cn/http-methods\">CN: HTTP methods</a>. Here's the practical side." },
        { table: { head: ["Method", "Semantics", "Who picks the id", "Idempotent", "Typical success"], rows: [
          ["POST /users", "Create a new member of the collection / run a process", "Server", "No", "201 + <code>Location</code>"],
          ["PUT /users/7", "Replace the full representation (or create at that exact URL)", "Client", "Yes", "200 / 204 (201 if created)"],
          ["PATCH /users/7", "Apply a partial modification", "n/a", "Not guaranteed", "200 / 204"],
          ["DELETE /users/7", "Remove", "n/a", "Yes", "204 (404 on repeat is fine)"]
        ] } },
        { code: `from fastapi import FastAPI, HTTPException, Response
from fastapi.testclient import TestClient
from pydantic import BaseModel

app = FastAPI()
users = {1: {"id": 1, "name": "Asha", "email": "asha@x.com", "city": "Pune"}}
next_id = 2

class UserIn(BaseModel):          # full representation (PUT / POST)
    name: str
    email: str
    city: str | None = None

class UserPatch(BaseModel):       # every field optional (PATCH)
    name: str | None = None
    email: str | None = None
    city: str | None = None

@app.post("/users", status_code=201)
def create(u: UserIn, response: Response):
    global next_id
    user = {"id": next_id, **u.model_dump()}
    users[next_id] = user
    response.headers["Location"] = f"/users/{next_id}"
    next_id += 1
    return user

@app.put("/users/{uid}")
def replace(uid: int, u: UserIn):
    users[uid] = {"id": uid, **u.model_dump()}   # replace the WHOLE resource
    return users[uid]

@app.patch("/users/{uid}")
def update(uid: int, p: UserPatch):
    if uid not in users:
        raise HTTPException(404, "user not found")
    users[uid].update(p.model_dump(exclude_unset=True))  # only fields sent
    return users[uid]

c = TestClient(app)
r1 = c.post("/users", json={"name": "Ravi", "email": "ravi@x.com"})
r2 = c.post("/users", json={"name": "Ravi", "email": "ravi@x.com"})
print("POST twice ->", r1.status_code, r1.headers["location"], r2.headers["location"])
print("PATCH ->", c.patch("/users/1", json={"city": "Delhi"}).json())
print("PUT   ->", c.put("/users/1", json={"name": "Asha", "email": "asha@x.com"}).json())
print("PUT again same body ->", c.put("/users/1", json={"name": "Asha", "email": "asha@x.com"}).json())`, lang: "python", title: "FastAPI: POST vs PUT vs PATCH (run with TestClient)" },
        { code: `POST twice -> 201 /users/2 /users/3
PATCH -> {'id': 1, 'name': 'Asha', 'email': 'asha@x.com', 'city': 'Delhi'}
PUT   -> {'id': 1, 'name': 'Asha', 'email': 'asha@x.com', 'city': None}
PUT again same body -> {'id': 1, 'name': 'Asha', 'email': 'asha@x.com', 'city': None}`, lang: "text", title: "Output" },
        { p: "Notice that PUT <b>wiped <code>city</code></b> because it wasn't in the body. That's the defining difference: PUT sends the whole thing, PATCH sends only what changes. <code>model_dump(exclude_unset=True)</code> is the FastAPI/Pydantic v2 idiom that makes PATCH update only the fields the client actually sent." },
        { ul: [
          "<b>PATCH formats</b>: plain partial JSON / <b>JSON Merge Patch</b> (RFC 7396, <code>application/merge-patch+json</code>, <code>null</code> deletes a field) or <b>JSON Patch</b> (RFC 6902, a list of ops like <code>{\"op\":\"add\",\"path\":\"/tags/-\",\"value\":\"x\"}</code>; append ops are not idempotent).",
          "<b>Non-idempotent PATCH</b>: <code>{\"op\":\"increment\",\"field\":\"stock\",\"by\":1}</code>. Retrying it double-counts.",
          "<b>Making POST safe to retry</b>: accept an <code>Idempotency-Key</code> header (see the idempotency-keys question) or let the client choose the id and use PUT."
        ] },
        { tip: "Follow-up: 'Why does idempotency matter?' Networks time out. Clients, proxies and SDKs retry automatically, and only idempotent requests can be retried blindly. See <a href=\"#/core/sd/idempotency\">SD: idempotency</a>." },
        { warn: "Using PUT for partial updates is the classic bug. A mobile client on an old app version sends PUT without a new field, and the server silently nulls it for every user." }
      ]
    },

    /* ───────────── Request & Response ───────────── */
    {
      id: "status-codes-in-practice",
      q: "Which HTTP status codes do you actually return from a REST API, and when (400 vs 422, 401 vs 403, 404 vs 409)?",
      topic: "Request & Response",
      level: 1,
      top: true,
      short: "Use 200 for a successful read or update with a body, 201 plus Location on create, 204 when there's no body, 202 for accepted async work. On client errors, return 400 for a malformed request, 401 when not authenticated, 403 when authenticated but not allowed, 404 when the resource isn't found or is hidden, 409 for a state conflict like a duplicate, 422 for well-formed but invalid data, and 429 when rate-limited. Use 500 for unexpected server bugs and 502/503/504 for upstream or availability problems. Never return 200 with an error in the body.",
      a: [
        { p: "Status codes are machine-readable. Clients, retries, caches, monitoring and alerting all branch on them. The full list is in <a href=\"#/core/cn/http-status-codes\">CN: HTTP status codes</a>. These are the ones a real API returns:" },
        { table: { head: ["Code", "Return it when", "Example"], rows: [
          ["<b>200</b> OK", "Success with a body", "<code>GET /orders/42</code>, <code>PATCH</code> returning the updated resource"],
          ["<b>201</b> Created", "Resource created. Add <code>Location</code> header", "<code>POST /orders</code>"],
          ["<b>202</b> Accepted", "Queued for async processing", "<code>POST /exports</code> then poll <code>/exports/e_1</code>"],
          ["<b>204</b> No Content", "Success, nothing to return", "<code>DELETE /orders/42</code>"],
          ["<b>304</b> Not Modified", "Conditional GET and the client's copy is fresh", "<code>If-None-Match</code> matches ETag"],
          ["<b>400</b> Bad Request", "Can't parse it: malformed JSON, wrong types in query, missing required header", "<code>{bad json</code>"],
          ["<b>401</b> Unauthorized", "Not authenticated: missing/expired/invalid credentials. Send <code>WWW-Authenticate</code>", "Expired JWT"],
          ["<b>403</b> Forbidden", "Authenticated, but not allowed", "Student calls <code>DELETE /courses/1</code> (admin only)"],
          ["<b>404</b> Not Found", "No such resource, or you want to hide that it exists", "Another user's order id (prevents enumeration)"],
          ["<b>409</b> Conflict", "Request conflicts with current state", "Email already registered, stale version, already cancelled"],
          ["<b>412</b> Precondition Failed", "<code>If-Match</code> ETag doesn't match", "Optimistic locking lost update"],
          ["<b>422</b> Unprocessable Content", "Syntactically valid, semantically invalid", "<code>{\"amount\": -5}</code>. FastAPI's default validation error"],
          ["<b>429</b> Too Many Requests", "Rate limited. Add <code>Retry-After</code>", "101st request in a minute"],
          ["<b>500</b> Internal Server Error", "Unhandled bug. Log it, don't leak the stack trace", "NullPointerException"],
          ["<b>502 / 503 / 504</b>", "Bad upstream / overloaded or in maintenance / upstream timeout", "Gateway can't reach service"]
        ] } },
        { code: `const http = require("node:http");

const books = new Map([[1, { id: 1, title: "SICP" }]]);
let nextId = 2;

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const m = req.url.match(/^\\/books(?:\\/(\\d+))?$/);
  if (!m) return send(res, 404, { title: "Not Found", status: 404 });
  const id = m[1] && Number(m[1]);
  let raw = "";
  req.on("data", c => (raw += c));
  req.on("end", () => {
    if (req.method === "GET" && id) {
      return books.has(id) ? send(res, 200, books.get(id)) : send(res, 404, { title: "Not Found", status: 404 });
    }
    if (req.method === "POST" && !id) {
      let body;
      try { body = JSON.parse(raw); } catch { return send(res, 400, { title: "Malformed JSON", status: 400 }); }
      if (!body.title) return send(res, 422, { title: "Validation failed", status: 422, errors: [{ field: "title", message: "required" }] });
      const book = { id: nextId++, title: body.title };
      books.set(book.id, book);
      return send(res, 201, book, { Location: "/books/" + book.id });
    }
    if (req.method === "DELETE" && id) { books.delete(id); return send(res, 204); }
    send(res, 405, { title: "Method Not Allowed", status: 405 }, { Allow: id ? "GET, DELETE" : "POST" });
  });
});

server.listen(0, async () => {
  const base = "http://127.0.0.1:" + server.address().port;
  const calls = [
    ["GET", "/books/1"], ["GET", "/books/9"],
    ["POST", "/books", "{bad json"], ["POST", "/books", "{}"], ["POST", "/books", '{"title":"CLRS"}'],
    ["DELETE", "/books/1"], ["PUT", "/books/1", "{}"],
  ];
  for (const [method, path, body] of calls) {
    const r = await fetch(base + path, { method, body, headers: { "Content-Type": "application/json" } });
    const extra = r.headers.get("location") || r.headers.get("allow") || "";
    console.log(method.padEnd(6), path.padEnd(8), r.status, extra);
  }
  server.close();
});`, lang: "javascript", title: "Plain Node 22 http server: returns the right code for each case, then calls itself" },
        { code: `GET    /books/1 200
GET    /books/9 404
POST   /books   400
POST   /books   422
POST   /books   201 /books/2
DELETE /books/1 204
PUT    /books/1 405 GET, DELETE`, lang: "text", title: "Output" },
        { tip: "The 4xx/5xx split is the one that matters operationally. 4xx means the client should fix the request, so don't retry. 5xx and 429 mean the client may retry with backoff, and they page the on-call engineer. Returning 500 for validation errors pollutes your alerts." },
        { warn: "Don't return <code>200 {\"success\": false, \"error\": \"not found\"}</code>. Caches will store it, monitoring sees 100% success, and every client has to parse the body to detect failure. Also: 401 is named 'Unauthorized' but means <i>unauthenticated</i>. 403 is the real 'unauthorized'." }
      ]
    },
    {
      id: "response-and-error-format",
      q: "How do you design JSON responses and a consistent error format (RFC 9457 Problem Details)?",
      topic: "Request & Response",
      level: 2,
      top: true,
      short: "Keep responses predictable: one casing convention, ISO-8601 UTC timestamps, string or opaque ids, money in minor units, and a consistent wrapper for collections with data plus pagination metadata. For errors, use a single shape everywhere. The standard is RFC 9457 Problem Details, which replaced RFC 7807: content type application/problem+json with type, title, status, detail and instance, plus extension fields like a per-field errors array. Pair it with the correct HTTP status and never leak stack traces.",
      a: [
        { h: "Success responses" },
        { ul: [
          "<b>One naming convention</b>: <code>snake_case</code> (Stripe, GitHub, Razorpay) or <code>camelCase</code> (Google). Pick one and lint it.",
          "<b>Timestamps</b>: ISO 8601 in UTC, <code>\"2026-10-03T09:30:00Z\"</code>. Never locale strings.",
          "<b>Money</b>: integer minor units + currency, <code>{\"amount\": 49900, \"currency\": \"INR\"}</code> (₹499.00). Floats lose paise.",
          "<b>IDs</b>: strings are safer than big integers (JavaScript loses precision above 2<sup>53</sup>, so Twitter/X returns <code>id_str</code>).",
          "<b>Collections</b>: return an object, not a bare array, so you can add metadata later without breaking clients.",
          "<b>Envelope or not?</b> A single resource is usually returned bare (<code>{\"id\":42,...}</code>). Lists get <code>{\"data\":[...],\"next_cursor\":...}</code>. Don't wrap everything in <code>{\"status\":\"ok\",\"code\":200,\"data\":...}</code>; HTTP already carries the status."
        ] },
        { code: `{
  "data": [
    { "id": "ord_9f2", "status": "paid", "amount": 49900, "currency": "INR",
      "created_at": "2026-10-03T09:30:00Z" }
  ],
  "has_more": true,
  "next_cursor": "WyIyMDI2LTEwLTAzVDA5OjMwOjAwWiIsIm9yZF85ZjIiXQ"
}`, lang: "json", title: "Collection response" },
        { h: "Errors: Problem Details (RFC 9457, 2023)" },
        { table: { head: ["Field", "Meaning"], rows: [
          ["<code>type</code>", "URI identifying the error type (docs page). <code>about:blank</code> if none"],
          ["<code>title</code>", "Short, human-readable summary of the type. Same for every occurrence"],
          ["<code>status</code>", "The HTTP status code (duplicated for convenience)"],
          ["<code>detail</code>", "Explanation specific to this occurrence"],
          ["<code>instance</code>", "URI of this specific occurrence (request path or an error id)"],
          ["extensions", "Anything else: <code>errors</code> per field, <code>balance</code>, <code>trace_id</code>"]
        ] } },
        { code: `from flask import Flask, jsonify, request

app = Flask(__name__)

class ApiError(Exception):
    def __init__(self, status, title, detail, type_="about:blank", **extra):
        self.status, self.title, self.detail, self.type, self.extra = status, title, detail, type_, extra

@app.errorhandler(ApiError)
def problem(e):
    body = {"type": e.type, "title": e.title, "status": e.status,
            "detail": e.detail, "instance": request.path, **e.extra}
    resp = jsonify(body)
    resp.status_code = e.status
    resp.mimetype = "application/problem+json"     # RFC 9457 media type
    return resp

@app.post("/transfers")
def transfer():
    data = request.get_json()
    errors = []
    if not isinstance(data.get("amount"), int) or data["amount"] <= 0:
        errors.append({"field": "amount", "message": "must be a positive integer (paise)"})
    if not data.get("to_account"):
        errors.append({"field": "to_account", "message": "is required"})
    if errors:
        raise ApiError(422, "Validation failed", "2 fields are invalid" if len(errors) > 1 else "1 field is invalid",
                       "https://api.example.com/problems/validation", errors=errors)
    if data["amount"] > 50_000:
        raise ApiError(409, "Insufficient funds", "Balance is 50000, transfer needs %d" % data["amount"],
                       "https://api.example.com/problems/insufficient-funds", balance=50000)
    return jsonify({"data": {"id": "tr_1", "status": "pending"}}), 201

c = app.test_client()
r = c.post("/transfers", json={"amount": -5})
print(r.status_code, r.content_type)
print(r.get_json())
r = c.post("/transfers", json={"amount": 90000, "to_account": "acc_9"})
print(r.status_code, r.get_json()["title"])
r = c.post("/transfers", json={"amount": 100, "to_account": "acc_9"})
print(r.status_code, r.get_json())`, lang: "python", title: "Flask: one error handler that emits application/problem+json" },
        { code: `422 application/problem+json
{'detail': '2 fields are invalid', 'errors': [{'field': 'amount', 'message': 'must be a positive integer (paise)'}, {'field': 'to_account', 'message': 'is required'}], 'instance': '/transfers', 'status': 422, 'title': 'Validation failed', 'type': 'https://api.example.com/problems/validation'}
409 Insufficient funds
201 {'data': {'id': 'tr_1', 'status': 'pending'}}`, lang: "text", title: "Output" },
        { tip: "Clients should branch on <code>type</code> (stable) or a machine <code>code</code> field, never on the English <code>detail</code> text, which you may reword or translate. Include a <code>trace_id</code> so support can find the log line." },
        { warn: "Never put exception messages or stack traces in production 500 responses (<code>psycopg2.errors.UndefinedColumn: column \"pasword\"</code> tells an attacker your schema). Log the details server-side and return a generic problem with a trace id." }
      ]
    },
    {
      id: "pagination",
      q: "How do you paginate a REST API, and how does offset pagination compare with cursor (keyset) pagination in SQL?",
      topic: "Request & Response",
      level: 2,
      top: true,
      short: "Offset pagination (?page=3&size=20 → LIMIT 20 OFFSET 40) is simple and supports jumping to page N, but the database still scans and discards the skipped rows, so deep pages get slow, and rows shift when data is inserted. Cursor or keyset pagination returns an opaque cursor encoding the last row's sort key and queries WHERE (created_at, id) < (last values) using an index. It stays fast at any depth and is stable under inserts, but you can't jump to an arbitrary page. Feeds and large tables use cursors.",
      a: [
        { p: "Never return an unbounded list. Always enforce a default and a maximum page size (e.g. default 20, max 100). Unbounded lists are an OWASP 'unrestricted resource consumption' bug." },
        { table: { head: ["", "Offset / page-number", "Cursor / keyset"], rows: [
          ["Request", "<code>?page=3&amp;size=20</code> or <code>?offset=40&amp;limit=20</code>", "<code>?limit=20&amp;cursor=eyJ0Ijo...</code>"],
          ["SQL", "<code>ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 40</code>", "<code>WHERE (created_at, id) &lt; (?, ?) ORDER BY created_at DESC, id DESC LIMIT 21</code>"],
          ["Deep page cost", "O(offset + limit): DB reads and throws away offset rows", "O(limit) with an index on the sort key"],
          ["New rows inserted", "Items shift: duplicates or skips across pages", "Stable"],
          ["Jump to page 57 / total pages", "Yes", "No (next/prev only)"],
          ["Used by", "Admin tables, search results UI", "Stripe, Slack, GitHub (some endpoints), Twitter/X timelines, infinite scroll"]
        ] } },
        { code: `import sqlite3, base64, json

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE orders (id INTEGER PRIMARY KEY, created_at TEXT, total INTEGER)")
db.executemany("INSERT INTO orders VALUES (?, ?, ?)",
               [(i, f"2026-09-{(i % 28) + 1:02d}", i * 10) for i in range(1, 101)])
db.execute("CREATE INDEX idx_orders_created ON orders(created_at DESC, id DESC)")

# 1) OFFSET pagination: GET /orders?page=3&size=5
def offset_page(page, size):
    return db.execute("SELECT id, created_at FROM orders ORDER BY created_at DESC, id DESC "
                      "LIMIT ? OFFSET ?", (size, (page - 1) * size)).fetchall()

# 2) CURSOR (keyset) pagination: GET /orders?limit=5&cursor=<opaque>
def encode(row):  return base64.urlsafe_b64encode(json.dumps([row[1], row[0]]).encode()).decode()
def decode(cur):  return json.loads(base64.urlsafe_b64decode(cur))

def cursor_page(limit, cursor=None):
    if cursor is None:
        rows = db.execute("SELECT id, created_at FROM orders ORDER BY created_at DESC, id DESC LIMIT ?",
                          (limit + 1,)).fetchall()
    else:
        ts, last_id = decode(cursor)
        rows = db.execute("SELECT id, created_at FROM orders WHERE (created_at, id) < (?, ?) "
                          "ORDER BY created_at DESC, id DESC LIMIT ?", (ts, last_id, limit + 1)).fetchall()
    has_more = len(rows) > limit          # fetched one extra row to know if there is a next page
    rows = rows[:limit]
    return {"data": rows, "next_cursor": encode(rows[-1]) if has_more else None}

print("offset p1:", offset_page(1, 5))
p1 = cursor_page(5)
print("cursor p1:", p1["data"])
print("next_cursor:", p1["next_cursor"])
db.execute("INSERT INTO orders VALUES (101, '2026-09-28', 999)")   # new row arrives at the top
print("offset p2 after insert:", offset_page(2, 5))                 # shifted: repeats a row
print("cursor p2 after insert:", cursor_page(5, p1["next_cursor"])["data"])  # stable`, lang: "python", title: "Offset vs keyset pagination on SQLite (same SQL works on PostgreSQL)" },
        { code: `offset p1: [(83, '2026-09-28'), (55, '2026-09-28'), (27, '2026-09-28'), (82, '2026-09-27'), (54, '2026-09-27')]
cursor p1: [(83, '2026-09-28'), (55, '2026-09-28'), (27, '2026-09-28'), (82, '2026-09-27'), (54, '2026-09-27')]
next_cursor: WyIyMDI2LTA5LTI3IiwgNTRd
offset p2 after insert: [(54, '2026-09-27'), (26, '2026-09-27'), (81, '2026-09-26'), (53, '2026-09-26'), (25, '2026-09-26')]
cursor p2 after insert: [(26, '2026-09-27'), (81, '2026-09-26'), (53, '2026-09-26'), (25, '2026-09-26'), (80, '2026-09-25')]`, lang: "text", title: "Output: offset repeats row 54 after an insert; cursor doesn't" },
        { ul: [
          "<b>Tie-breaker</b>: always add a unique column (<code>id</code>) to the sort, or rows with equal timestamps get skipped or duplicated.",
          "<b>Fetch limit + 1</b> to compute <code>has_more</code> without a <code>COUNT(*)</code>, which is expensive on big tables.",
          "<b>Opaque cursor</b>: base64 of the sort keys (optionally signed) so clients don't build or tamper with it, and you can change the internals later.",
          "<b>Row-value comparison</b> <code>(a, b) &lt; (x, y)</code> works in PostgreSQL and SQLite 3.15+. Otherwise write <code>a &lt; x OR (a = x AND b &lt; y)</code>.",
          "<b>Links</b>: GitHub returns a <code>Link: &lt;...&amp;page=3&gt;; rel=\"next\"</code> header (RFC 8288). A body field like <code>next_cursor</code> is equally common."
        ] },
        { tip: "If they ask 'how would you show total count with cursors?', the answer is a separate, cached or approximate count (PostgreSQL <code>reltuples</code>), or simply don't. Infinite-scroll UIs don't need it. Index details: <a href=\"#/core/sd/indexing-at-scale\">SD: indexing at scale</a>." }
      ]
    },
    {
      id: "filtering-sorting-search",
      q: "How do you design filtering, sorting, field selection and search query parameters?",
      topic: "Request & Response",
      level: 2,
      top: false,
      short: "Put them in query parameters on the collection. Filter with field=value, plus a small operator syntax for ranges like price[gte]=100 or created_after=2026-01-01. Sort with a sort parameter listing fields, a minus prefix for descending (sort=-created_at,name). Use q for full-text search and fields= for sparse fieldsets. Whitelist allowed filter and sort fields, bind values as SQL parameters, index the common combinations, and return 400 for unknown parameters rather than silently ignoring them.",
      a: [
        { code: `GET /v1/products?category=laptops&brand=dell,hp&price[gte]=40000&price[lte]=80000
               &in_stock=true&sort=-rating,price&fields=id,name,price&limit=20
GET /v1/products?q=gaming+laptop          # full-text search
GET /v1/orders?status=paid&created_after=2026-09-01T00:00:00Z`, lang: "text", title: "Typical query-parameter conventions" },
        { table: { head: ["Concern", "Convention", "Notes"], rows: [
          ["Equality filter", "<code>?status=paid</code>", "Comma for IN: <code>?status=paid,refunded</code>"],
          ["Range", "<code>?price[gte]=100</code> or <code>?min_price=100</code>", "Stripe uses <code>created[gte]=</code>"],
          ["Sort", "<code>?sort=-created_at,name</code>", "JSON:API convention: <code>-</code> means descending"],
          ["Sparse fields", "<code>?fields=id,name</code>", "Smaller payloads for mobile"],
          ["Expand related", "<code>?expand=customer</code>", "Avoids N+1 round trips (Stripe <code>expand[]</code>)"],
          ["Search", "<code>?q=...</code>", "Backed by DB full-text index / Elasticsearch, not <code>LIKE '%x%'</code> on big tables"]
        ] } },
        { code: `ALLOWED_SORT = {"created_at", "price", "rating", "name"}

def build_query(params):
    where, args = ["1=1"], []
    if "status" in params:
        values = params["status"].split(",")
        where.append("status IN (" + ",".join("?" * len(values)) + ")")
        args += values
    order = []
    for f in params.get("sort", "-created_at").split(","):
        col, direction = (f[1:], "DESC") if f.startswith("-") else (f, "ASC")
        if col not in ALLOWED_SORT:                 # column names can't be bound as parameters,
            raise ValueError("unknown sort field " + col)   # so whitelist them
        order.append(col + " " + direction)
    order.append("id DESC")                          # unique tie-breaker
    return "SELECT * FROM products WHERE " + " AND ".join(where) + " ORDER BY " + ", ".join(order), args

print(build_query({"status": "paid,refunded", "sort": "-rating,price"}))
try:
    build_query({"sort": "price; DROP TABLE products"})
except ValueError as e:
    print("400 Bad Request:", e)`, lang: "python", title: "Safe dynamic SQL: bind values, whitelist identifiers" },
        { code: `('SELECT * FROM products WHERE 1=1 AND status IN (?,?) ORDER BY rating DESC, price ASC, id DESC', ['paid', 'refunded'])
400 Bad Request: unknown sort field price; DROP TABLE products`, lang: "text", title: "Output" },
        { tip: "When filters get really complex (nested AND/OR, arbitrary joins), that's a signal for a <code>POST /products/search</code> with a JSON body, or GraphQL. Mention it as a trade-off: POST search isn't cacheable by default." },
        { warn: "SQL injection through <code>sort</code> is common because ORMs bind values but not column names. Silently ignoring unknown filters is also a trap: a typo like <code>?stauts=paid</code> returns <i>all</i> orders and looks like a bug in your API." }
      ]
    },

    /* ───────────── Auth & Security ───────────── */
    {
      id: "api-auth-methods",
      q: "What are the ways to authenticate REST API clients (API keys, sessions, JWT, OAuth2), and when do you use each?",
      topic: "Auth & Security",
      level: 1,
      top: true,
      short: "API keys are long random secrets sent in a header. They're simple and good for server-to-server and identifying a project, but they're coarse and long-lived. Session cookies are server-side state looked up by a cookie id, best for your own browser web app. JWT bearer tokens are signed, self-contained, short-lived access tokens that any instance can verify without a DB lookup. OAuth2 is a delegation framework for issuing those tokens when a third-party app acts on a user's behalf, or for machine clients. Always use HTTPS and send credentials in headers, not URLs.",
      a: [
        { p: "<b>Authentication</b> answers 'who are you?'. <b>Authorization</b> answers 'what are you allowed to do?'. Theory of cookies vs tokens: <a href=\"#/core/cn/cookies-sessions-tokens\">CN: cookies, sessions, tokens</a>." },
        { table: { head: ["Method", "How it's sent", "Good for", "Watch out"], rows: [
          ["<b>API key</b>", "<code>Authorization: Bearer sk_live_...</code> or <code>X-API-Key</code>", "Server-to-server, public data APIs, per-project quotas (Google Maps, OpenAI)", "Long-lived. Store only a hash. Support rotation and scopes. Never ship in a mobile/JS bundle"],
          ["<b>Session cookie</b>", "<code>Cookie: sid=...</code> (HttpOnly, Secure, SameSite)", "Your own first-party web app", "Server-side store (Redis). Needs CSRF protection. Awkward for mobile/3rd party"],
          ["<b>JWT access token</b>", "<code>Authorization: Bearer eyJ...</code>", "SPAs + mobile + microservices; stateless verification", "Can't revoke before expiry → keep short (5–15 min) + refresh token"],
          ["<b>OAuth 2.0 / OIDC</b>", "Bearer token issued by an authorization server", "'Login with Google', third-party integrations, M2M with scopes", "It's a framework, not a token format. Use PKCE, validate <code>aud</code>/<code>iss</code>"],
          ["<b>mTLS</b>", "Client certificate in the TLS handshake", "Bank/partner integrations, service mesh", "Certificate lifecycle management"],
          ["HTTP Basic", "<code>Authorization: Basic base64(user:pass)</code>", "Internal tools, quick scripts", "Password on every request; HTTPS mandatory"]
        ] } },
        { code: `# API key (server-to-server)
curl -H "Authorization: Bearer $API_KEY" https://api.example.com/v1/reports

# Log in, then use the short-lived access token
curl -X POST https://api.example.com/v1/auth/login -H "Content-Type: application/json" -d '{"email":"a@x.com","password":"..."}'
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." https://api.example.com/v1/me`, lang: "bash", title: "What clients send" },
        { ul: [
          "<b>Storing API keys</b>: show the key once, store <code>sha256(key)</code> plus a visible prefix (<code>sk_live_ab12…</code>) for lookup, like GitHub and Stripe do.",
          "<b>Where to keep a browser token</b>: an HttpOnly Secure SameSite cookie is safer against XSS than <code>localStorage</code>, but then you need CSRF defences. Many teams use a BFF (backend-for-frontend) that keeps tokens server-side.",
          "<b>Never</b> put credentials in query strings (<code>?api_key=...</code>). URLs end up in server logs, proxy logs, browser history and Referer headers."
        ] },
        { tip: "A strong answer picks per client: 'For our React app I'd use a cookie session or short JWT + refresh in an HttpOnly cookie; for partners, OAuth2 client-credentials with scopes; for internal cron jobs, an API key from the secrets manager.'" }
      ]
    },
    {
      id: "jwt-refresh-tokens",
      q: "How does JWT authentication work, and why do we need refresh tokens?",
      topic: "Auth & Security",
      level: 2,
      top: true,
      short: "A JWT is base64url header.payload.signature. The payload carries claims like sub, exp and roles, and the signature (HMAC-SHA256 or RSA/ECDSA) lets any server verify it wasn't tampered with, with no DB lookup. It is signed, not encrypted, so never put secrets in it. Because a valid JWT can't easily be revoked, access tokens are kept short-lived, around 15 minutes. A long-lived refresh token, stored securely and tracked server-side, gets new access tokens. Rotating it on each use lets you detect theft and log users out.",
      a: [
        { p: "Structure: <code>base64url(header) . base64url(payload) . base64url(signature)</code>. Standard claims (RFC 7519): <code>sub</code> (user id), <code>exp</code> (expiry), <code>iat</code> (issued at), <code>iss</code> (issuer), <code>aud</code> (audience), <code>jti</code> (unique id)." },
        { code: `import base64, hashlib, hmac, json, time

SECRET = b"server-side-secret-from-env"
b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=").decode()
unb64 = lambda s: base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))

def sign(payload: dict) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    h, p = b64(json.dumps(header).encode()), b64(json.dumps(payload).encode())
    sig = hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest()
    return f"{h}.{p}.{b64(sig)}"

def verify(token: str, now: float) -> dict:
    h, p, s = token.split(".")
    if json.loads(unb64(h))["alg"] != "HS256":           # never trust alg from the token ("none" attack)
        raise ValueError("bad alg")
    expected = hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest()
    if not hmac.compare_digest(expected, unb64(s)):      # constant-time compare
        raise ValueError("bad signature")
    claims = json.loads(unb64(p))
    if now >= claims["exp"]:
        raise ValueError("expired")
    return claims

now = 1_790_000_000
tok = sign({"sub": "user_42", "role": "student", "iat": now, "exp": now + 900})   # 15-minute access token
print("token parts:", [len(x) for x in tok.split(".")])
print("payload is only base64, NOT encrypted:", json.loads(unb64(tok.split(".")[1])))
print("verify ok:", verify(tok, now + 60)["sub"])

h, p, s = tok.split(".")
forged_p = b64(json.dumps({"sub": "user_42", "role": "admin", "iat": now, "exp": now + 900}).encode())
for label, t, at in [("tampered role", f"{h}.{forged_p}.{s}", now), ("after 15 min", tok, now + 901)]:
    try: verify(t, at)
    except ValueError as e: print(label, "->", e)`, lang: "python", title: "HS256 JWT from scratch (stdlib only); in real code use PyJWT / jose and let it validate exp, aud, iss" },
        { code: `token parts: [40, 100, 43]
payload is only base64, NOT encrypted: {'sub': 'user_42', 'role': 'student', 'iat': 1790000000, 'exp': 1790000900}
verify ok: user_42
tampered role -> bad signature
after 15 min -> expired`, lang: "text", title: "Output" },
        { h: "Access + refresh token flow" },
        { ol: [
          "Login → server returns a short <b>access token</b> (JWT, ~15 min) and a long <b>refresh token</b> (random opaque string, days–weeks, stored hashed in the DB, sent as an HttpOnly cookie).",
          "Client calls APIs with <code>Authorization: Bearer &lt;access&gt;</code>. Every service verifies the signature locally, with no DB hit.",
          "Access token expires → API returns 401 → client calls <code>POST /auth/refresh</code> with the refresh token.",
          "Server checks the refresh token in the DB, <b>rotates</b> it (issues a new one, invalidates the old) and returns a new access token.",
          "If an <i>already-used</i> refresh token shows up again, it was stolen: revoke the whole token family and force re-login.",
          "Logout / 'log out all devices' = delete refresh tokens. Access tokens die on their own within minutes."
        ] },
        { table: { head: ["", "Access token", "Refresh token"], rows: [
          ["Lifetime", "Minutes", "Days–weeks"],
          ["Format", "JWT (self-contained)", "Opaque random string"],
          ["Checked", "Every request, signature only", "Only at /refresh, against DB"],
          ["Revocable", "Not really (wait for exp, or denylist <code>jti</code>)", "Yes, delete the row"],
          ["Sent to", "Every API", "Only the auth server"]
        ] } },
        { ul: [
          "<b>HS256 vs RS256</b>: HS256 uses one shared secret, so every verifier could also mint tokens. RS256/ES256 sign with a private key and verify with a public key published at a JWKS URL. Prefer asymmetric keys across microservices.",
          "<b>Pin the algorithm</b> when verifying (<code>jwt.decode(t, key, algorithms=[\"RS256\"])</code>). Never accept <code>alg: none</code> or let the token choose."
        ] },
        { warn: "'JWTs are encrypted' is wrong: anyone can base64-decode the payload (paste one into jwt.io). Don't put emails, phone numbers or permissions you'd hate to leak in it, and don't make tokens valid for 30 days to 'avoid refresh logic'." }
      ]
    },
    {
      id: "oauth2-flows",
      q: "Explain OAuth 2.0. What are the main grant types, and how does Authorization Code with PKCE work?",
      topic: "Auth & Security",
      level: 2,
      top: true,
      short: "OAuth 2.0 is a delegation framework: a user lets a client app access their resources on a resource server without giving it their password. An authorization server issues scoped access tokens. Use the Authorization Code flow with PKCE for web, mobile and SPA apps, Client Credentials for machine-to-machine, Device Code for TVs and CLIs, and refresh tokens to renew access. The Implicit and Password grants are deprecated and removed in OAuth 2.1. OpenID Connect adds an ID token on top for login.",
      a: [
        { table: { head: ["Role", "Example ('Sign in with Google' on a resume-builder app)"], rows: [
          ["Resource owner", "You, the user"],
          ["Client", "The resume-builder app"],
          ["Authorization server", "accounts.google.com: shows consent, issues tokens"],
          ["Resource server", "Google Drive API: accepts the access token"]
        ] } },
        { svg: `<svg viewBox="0 0 700 300" width="700" class="dg">
  <rect class="box" x="10" y="10" width="140" height="40" rx="6"/><text class="tx tx-b" x="80" y="30" text-anchor="middle" dominant-baseline="middle">Browser / App</text>
  <rect class="box-a" x="190" y="10" width="140" height="40" rx="6"/><text class="tx tx-b" x="260" y="30" text-anchor="middle" dominant-baseline="middle">Client backend</text>
  <rect class="box-p" x="370" y="10" width="150" height="40" rx="6"/><text class="tx tx-b" x="445" y="30" text-anchor="middle" dominant-baseline="middle">Authorization server</text>
  <rect class="box-g" x="560" y="10" width="130" height="40" rx="6"/><text class="tx tx-b" x="625" y="30" text-anchor="middle" dominant-baseline="middle">Resource API</text>
  <line class="ln ln-d" x1="80" y1="50" x2="80" y2="290"/><line class="ln ln-d" x1="260" y1="50" x2="260" y2="290"/>
  <line class="ln ln-d" x1="445" y1="50" x2="445" y2="290"/><line class="ln ln-d" x1="625" y1="50" x2="625" y2="290"/>
  <line class="ln" x1="80" y1="80" x2="440" y2="80" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="90" y="74">1. /authorize?client_id&amp;scope&amp;state&amp;code_challenge=S256(verifier)</text>
  <text class="tx-m" x="455" y="112">2. user logs in + consents</text>
  <line class="ln" x1="445" y1="140" x2="85" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="95" y="134">3. redirect_uri?code=abc&amp;state (short-lived, one-time code)</text>
  <line class="ln-a" x1="260" y1="180" x2="440" y2="180" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="268" y="174">4. POST /token code + code_verifier</text>
  <line class="ln-a" x1="445" y1="215" x2="265" y2="215" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="270" y="209">5. access_token (+ refresh, id_token)</text>
  <line class="ln" x1="260" y1="260" x2="620" y2="260" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="300" y="254">6. GET /files  Authorization: Bearer access_token</text>
</svg>`, caption: "Authorization Code + PKCE: the token is exchanged on a back channel. The code alone is useless without the verifier" },
        { table: { head: ["Grant", "Use for", "Status"], rows: [
          ["<b>Authorization Code + PKCE</b>", "Any app acting for a user: web, mobile, SPA", "Recommended (PKCE required in OAuth 2.1)"],
          ["<b>Client Credentials</b>", "Machine-to-machine, no user (cron job → billing API)", "Recommended"],
          ["<b>Device Authorization</b> (RFC 8628)", "Smart TVs, CLIs: 'go to example.com/device, enter code ABCD'", "Recommended for input-constrained devices"],
          ["<b>Refresh Token</b>", "Get a new access token without re-consent", "Recommended (rotate for public clients)"],
          ["Implicit", "Old SPAs: token returned in URL fragment", "Deprecated: leaks tokens via history/referrer"],
          ["Resource Owner Password", "App collects the user's password directly", "Deprecated: defeats the point of OAuth"]
        ] } },
        { p: "<b>PKCE</b> (Proof Key for Code Exchange, RFC 7636): the client makes a random <code>code_verifier</code> and sends only <code>code_challenge = BASE64URL(SHA256(verifier))</code> in step 1. In step 4 it proves possession by sending the verifier. An attacker who intercepts the code (malicious app on the same redirect scheme, logs) can't redeem it. The <code>state</code> parameter defends against CSRF on the redirect." },
        { code: `import base64, hashlib, secrets
verifier = secrets.token_urlsafe(32)                       # kept by the client, never sent in step 1
challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
print(len(verifier), len(challenge), "method=S256")`, lang: "python", title: "Generating a PKCE pair" },
        { tip: "Know the difference: <b>OAuth 2.0 = authorization</b> (access tokens with scopes like <code>drive.readonly</code>). <b>OpenID Connect = authentication</b> on top of it: adds an <code>id_token</code> JWT with the user's identity and a <code>/userinfo</code> endpoint. 'Login with Google' is OIDC." },
        { warn: "Validating only the signature of an access token isn't enough. Check <code>aud</code> is <i>your</i> API, <code>iss</code> is the expected server, <code>exp</code>, and the scopes for the operation. Otherwise a token minted for another app is accepted by yours." }
      ]
    },
    {
      id: "owasp-api-security",
      q: "What are the most common REST API security vulnerabilities (OWASP API Top 10: BOLA, mass assignment, injection), and how do you prevent them?",
      topic: "Auth & Security",
      level: 2,
      top: true,
      short: "The OWASP API Security Top 10 (2023) is led by Broken Object Level Authorization (BOLA): GET /orders/102 checks that you are logged in but not that order 102 is yours. Next come broken authentication and broken object property level authorization, which covers mass assignment (sending is_admin=true) and over-exposed fields. Then unrestricted resource consumption, broken function-level authorization and SSRF. Prevent them with per-object ownership checks, allow-listed input and output schemas, parameterized queries and limits.",
      a: [
        { table: { head: ["OWASP API 2023", "What goes wrong", "Fix"], rows: [
          ["<b>API1</b> Broken Object Level Authorization (BOLA / IDOR)", "<code>GET /orders/102</code> returns someone else's order", "Check ownership/tenant on <i>every</i> object access. Scope queries: <code>WHERE id=? AND owner_id=?</code>"],
          ["<b>API2</b> Broken Authentication", "Weak tokens, no brute-force protection, JWT <code>alg:none</code>", "Proven libraries, rate-limit login, MFA, short tokens"],
          ["<b>API3</b> Broken Object Property Level Authorization", "Mass assignment (<code>{\"role\":\"admin\"}</code>) + excessive data exposure (returning <code>password_hash</code>)", "Explicit input DTOs (allow-list), explicit response models"],
          ["<b>API4</b> Unrestricted Resource Consumption", "No pagination cap, 50 MB uploads, unlimited SMS-OTP sends", "Rate limits, max page size, payload limits, timeouts"],
          ["<b>API5</b> Broken Function Level Authorization", "Regular user calls <code>DELETE /admin/users/7</code>", "Role checks on every route, deny by default"],
          ["API6 Unrestricted Access to Sensitive Business Flows", "Bots buying all tickets, coupon abuse", "Per-user limits, CAPTCHA, device fingerprinting"],
          ["API7 Server-Side Request Forgery", "<code>POST /import {\"url\":\"http://169.254.169.254/...\"}</code>", "Allow-list hosts, block private IP ranges"],
          ["API8 Security Misconfiguration", "Verbose errors, permissive CORS, missing TLS", "Hardened defaults, no stack traces"],
          ["API9 Improper Inventory Management", "Forgotten <code>/v1</code> or staging API without auth", "Track every version/host. Retire old ones"],
          ["API10 Unsafe Consumption of APIs", "Blindly trusting a third-party API's response", "Validate upstream data like user input"]
        ] } },
        { code: `from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.testclient import TestClient
from pydantic import BaseModel, ConfigDict

app = FastAPI()
ORDERS = {101: {"id": 101, "owner": "alice", "total": 500, "status": "paid"},
          102: {"id": 102, "owner": "bob",   "total": 900, "status": "paid"}}
USERS = {"alice": {"name": "Alice", "is_admin": False}}
TOKENS = {"tok-alice": "alice", "tok-bob": "bob"}           # stand-in for real JWT verification

def current_user(authorization: str | None = Header(None)) -> str:
    user = TOKENS.get((authorization or "").removeprefix("Bearer "))
    if not user:
        raise HTTPException(401, "invalid or missing token",  # authentication failed
                            headers={"WWW-Authenticate": "Bearer"})
    return user

# BOLA (API1:2023) — VULNERABLE: any logged-in user can read any order by changing the id
@app.get("/v0/orders/{oid}")
def get_order_vulnerable(oid: int, user: str = Depends(current_user)):
    return ORDERS[oid]

# FIXED: object-level check on every access (404 hides that the id exists)
@app.get("/v1/orders/{oid}")
def get_order(oid: int, user: str = Depends(current_user)):
    order = ORDERS.get(oid)
    if order is None or order["owner"] != user:
        raise HTTPException(404, "order not found")
    return order

# Mass assignment (API3:2023) — allow-list the writable fields; reject extras
class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str

@app.patch("/v1/me")
def update_me(body: ProfileUpdate, user: str = Depends(current_user)):
    USERS[user].update(body.model_dump())
    return USERS[user]

c = TestClient(app)
alice = {"Authorization": "Bearer tok-alice"}
print("no token        ->", c.get("/v1/orders/101").status_code)
print("bad token       ->", c.get("/v1/orders/101", headers={"Authorization": "Bearer x"}).status_code)
print("v0 alice->bob's ->", c.get("/v0/orders/102", headers=alice).json())
print("v1 alice->bob's ->", c.get("/v1/orders/102", headers=alice).status_code)
print("v1 alice->own   ->", c.get("/v1/orders/101", headers=alice).status_code)
r = c.patch("/v1/me", json={"name": "Alice K", "is_admin": True}, headers=alice)
print("mass assignment ->", r.status_code, r.json()["detail"][0]["type"])
print("profile         ->", USERS["alice"])`, lang: "python", title: "FastAPI: a BOLA bug, its fix, and blocking mass assignment" },
        { code: `no token        -> 401
bad token       -> 401
v0 alice->bob's -> {'id': 102, 'owner': 'bob', 'total': 900, 'status': 'paid'}
v1 alice->bob's -> 404
v1 alice->own   -> 200
mass assignment -> 422 extra_forbidden
profile         -> {'name': 'Alice', 'is_admin': False}`, lang: "text", title: "Output" },
        { p: "<b>Injection</b> (SQL, NoSQL, command) was its own item in the 2019 list and is still everywhere: use parameterized queries or an ORM, whitelist identifiers like sort columns, and never pass user input to a shell. For MongoDB, reject objects where you expect strings, since <code>{\"password\": {\"$ne\": null}}</code> is a classic login bypass." },
        { tip: "BOLA is the #1 API bug because authentication middleware gives a false sense of safety. Say that the ownership check must live in the data-access layer (every query filtered by <code>user_id</code>/<code>tenant_id</code>), and that random UUIDs reduce guessability but are <i>not</i> authorization." },
        { warn: "Doing <code>user.update(**request.json)</code> or <code>Object.assign(user, req.body)</code> is mass assignment. So is a Spring <code>@RequestBody User</code> bound straight to the JPA entity. Always map from a dedicated input DTO." }
      ]
    },

    /* ───────────── Performance & Reliability ───────────── */
    {
      id: "idempotency-keys",
      q: "How do idempotency keys work, and how would you make a payment API safe to retry?",
      topic: "Performance & Reliability",
      level: 3,
      top: true,
      short: "POST /charges isn't idempotent, so if the client times out and retries, the customer may be charged twice. The client generates a unique Idempotency-Key, a UUID per logical operation, and sends it as a header. The server stores the key with a hash of the request and the final response. A repeat with the same key returns the saved response without re-executing, and the same key with a different body is rejected. Concurrent duplicates are blocked with a lock or unique constraint, and keys expire after about 24 hours. This is how Stripe and Razorpay do it.",
      a: [
        { p: "The failure: the client sends <code>POST /charges</code>, the server charges the card, the response is lost (mobile network drops, gateway timeout). The client can't tell 'failed' from 'succeeded but reply lost'. Retrying blindly double-charges. Theory: <a href=\"#/core/sd/idempotency\">SD: idempotency</a> and <a href=\"#/core/sd/retries-exponential-backoff-jitter\">SD: retries with backoff</a>." },
        { code: `import hashlib, json, uuid
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient
from pydantic import BaseModel

app = FastAPI()
idem_store = {}        # production: Redis/DB row with TTL (e.g. 24 h), keyed by (merchant_id, key)
charges = []

class ChargeIn(BaseModel):
    amount: int        # smallest unit (paise) — never floats for money
    currency: str = "INR"
    source: str

@app.post("/v1/charges")
def create_charge(body: ChargeIn, idempotency_key: str = Header(...)):
    fingerprint = hashlib.sha256(json.dumps(body.model_dump(), sort_keys=True).encode()).hexdigest()
    saved = idem_store.get(idempotency_key)
    if saved:
        if saved["fingerprint"] != fingerprint:      # same key, different request = client bug
            raise HTTPException(422, "Idempotency-Key reused with a different payload")
        return JSONResponse(saved["body"], saved["status"], headers={"Idempotent-Replayed": "true"})
    charge = {"id": f"ch_{len(charges) + 1}", **body.model_dump(), "status": "succeeded"}
    charges.append(charge)                            # the side effect happens ONCE
    idem_store[idempotency_key] = {"fingerprint": fingerprint, "status": 201, "body": charge}
    return JSONResponse(charge, 201)

c = TestClient(app)
key = str(uuid.UUID(int=7))                           # client generates a UUID per logical payment
req = {"amount": 49900, "source": "card_tok_1"}
r1 = c.post("/v1/charges", json=req, headers={"Idempotency-Key": key})
r2 = c.post("/v1/charges", json=req, headers={"Idempotency-Key": key})   # retry after a timeout
print(r1.status_code, r1.json()["id"], "| retry:", r2.status_code, r2.json()["id"], r2.headers.get("idempotent-replayed"))
print("charges created:", len(charges))
r3 = c.post("/v1/charges", json={"amount": 1, "source": "card_tok_1"}, headers={"Idempotency-Key": key})
print("same key, new body ->", r3.status_code)`, lang: "python", title: "FastAPI: Idempotency-Key with request fingerprinting" },
        { code: `201 ch_1 | retry: 201 ch_1 true
charges created: 1
same key, new body -> 422`, lang: "text", title: "Output: the retry replays the first response; only one charge exists" },
        { h: "Production details interviewers probe" },
        { ol: [
          "<b>Atomic claim</b>: insert the key <i>before</i> doing work, using a unique constraint (<code>INSERT ... ON CONFLICT DO NOTHING</code>) or Redis <code>SET key val NX EX 86400</code>. Two concurrent requests with the same key: one wins, the other gets <b>409 Conflict</b> ('request in progress').",
          "<b>Store the outcome</b>: save status code + body once finished, and replay it for retries (even 4xx results).",
          "<b>Scope</b> keys per account/merchant so customers can't collide.",
          "<b>Expiry</b>: ~24 h (Stripe's window). After that the key can be reused.",
          "<b>Same transaction</b>: write the business row and the idempotency record in one DB transaction where possible, so a crash can't leave one without the other.",
          "<b>Downstream</b>: pass the key (or a derived one) to the payment gateway so <i>its</i> side is also deduplicated."
        ] },
        { table: { head: ["Situation", "Response"], rows: [
          ["First request", "Process, store, return result (201)"],
          ["Retry, same key + same body, finished", "Replay stored response"],
          ["Retry while first still running", "409 Conflict, client retries later"],
          ["Same key, different body", "422 (IETF draft) / 400 (Stripe): client bug"],
          ["Missing key on a payment endpoint", "400 if the key is mandatory"]
        ] } },
        { tip: "The <code>Idempotency-Key</code> header is being standardised (IETF httpapi draft). Mention that the client must generate the key <i>once per user intent</i> (when the 'Pay' button is pressed) and reuse it on every retry, not generate a new one per HTTP attempt." },
        { warn: "Deduplicating on the request body alone ('same amount + same card in 1 min = duplicate') is wrong: a user may legitimately buy two ₹499 items. Only the client knows intent, which is why it sends the key." }
      ]
    },
    {
      id: "http-caching-etag",
      q: "How does HTTP caching work for REST APIs (Cache-Control, ETag, 304 Not Modified, If-Match)?",
      topic: "Performance & Reliability",
      level: 2,
      top: false,
      short: "Cache-Control tells clients and CDNs whether and how long a response may be reused: max-age, public or private, no-cache meaning revalidate first, and no-store meaning never store. An ETag is a version identifier for the representation. The client sends it back in If-None-Match, and if nothing changed the server replies 304 Not Modified with no body, saving bandwidth. The same ETag in If-Match on PUT or PATCH gives optimistic concurrency: if someone else changed the resource, the server returns 412 Precondition Failed instead of silently overwriting.",
      a: [
        { table: { head: ["Directive", "Meaning", "Use for"], rows: [
          ["<code>max-age=3600</code>", "Fresh for 1 h, reuse without asking", "Product catalogue, country list"],
          ["<code>public</code> / <code>private</code>", "Shared caches (CDN) may store / only the user's browser", "<code>private</code> for anything user-specific"],
          ["<code>no-cache</code>", "May store, but must revalidate (ETag) before each use", "Data that changes unpredictably"],
          ["<code>no-store</code>", "Never store anywhere", "Bank balances, tokens, PII"],
          ["<code>s-maxage=60</code>", "TTL for shared caches only", "CDN caching of public API responses"],
          ["<code>stale-while-revalidate=30</code>", "Serve stale while refetching in background", "Feeds, dashboards"]
        ] } },
        { code: `import hashlib, json
from fastapi import FastAPI, Header, Response
from fastapi.testclient import TestClient

app = FastAPI()
product = {"id": 42, "name": "Mechanical keyboard", "price": 3499, "version": 1}

def etag_of(obj) -> str:
    return '"' + hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:16] + '"'

@app.get("/products/42")
def get_product(if_none_match: str | None = Header(None)):
    tag = etag_of(product)
    headers = {"ETag": tag, "Cache-Control": "private, no-cache"}   # cache it, but revalidate each time
    if if_none_match == tag:
        return Response(status_code=304, headers=headers)          # no body sent
    return Response(json.dumps(product), media_type="application/json", headers=headers)

@app.put("/products/42")
def put_product(body: dict, if_match: str | None = Header(None)):
    if if_match != etag_of(product):                               # optimistic concurrency
        return Response(status_code=412)                           # Precondition Failed
    product.update(body, version=product["version"] + 1)
    return Response(json.dumps(product), media_type="application/json", headers={"ETag": etag_of(product)})

c = TestClient(app)
r1 = c.get("/products/42")
tag = r1.headers["etag"]
print("first GET:", r1.status_code, tag, len(r1.content), "bytes")
r2 = c.get("/products/42", headers={"If-None-Match": tag})
print("revalidate:", r2.status_code, len(r2.content), "bytes")
print("PUT with fresh ETag:", c.put("/products/42", json={"price": 2999}, headers={"If-Match": tag}).status_code)
print("PUT with stale ETag:", c.put("/products/42", json={"price": 1}, headers={"If-Match": tag}).status_code)
print("GET with old ETag:", c.get("/products/42", headers={"If-None-Match": tag}).status_code)`, lang: "python", title: "FastAPI: ETag revalidation (304) and optimistic locking (412)" },
        { code: `first GET: 200 "b23b3e884422cf44" 70 bytes
revalidate: 304 0 bytes
PUT with fresh ETag: 200
PUT with stale ETag: 412
GET with old ETag: 200`, lang: "text", title: "Output" },
        { ul: [
          "<b>Strong vs weak ETags</b>: <code>\"abc\"</code> means byte-identical. <code>W/\"abc\"</code> means semantically equivalent (e.g. same data, different gzip). Real servers also handle <code>If-None-Match: \"a\", \"b\"</code> lists and <code>*</code>.",
          "<b>Cheap ETags</b>: a <code>version</code> column or <code>updated_at</code> beats hashing the whole body. Hashing still costs a DB read; it only saves bandwidth.",
          "<b>Last-Modified / If-Modified-Since</b>: the older, second-granularity alternative to ETags.",
          "<b>Only GET/HEAD</b> responses are cached in practice. POST responses are effectively uncacheable.",
          "<b>Vary</b>: <code>Vary: Accept-Encoding, Authorization</code> tells caches that the response differs per header value."
        ] },
        { tip: "Distinguish the layers: HTTP caching (browser/CDN, controlled by headers) vs application caching (Redis in front of the DB). For the latter see <a href=\"#/core/sd/caching-strategies\">SD: caching strategies</a> and <a href=\"#/core/sd/cache-invalidation-problems\">SD: cache invalidation</a>." },
        { warn: "<code>no-cache</code> does <b>not</b> mean 'don't cache'. That's <code>no-store</code>. And never mark authenticated responses <code>public</code>: a CDN will happily serve user A's profile to user B." }
      ]
    },
    {
      id: "cors",
      q: "What is CORS? Why do I get a CORS error calling my API from React, and how do you fix it properly?",
      topic: "Performance & Reliability",
      level: 1,
      top: true,
      short: "Browsers enforce the same-origin policy: JavaScript on app.example.com can't read responses from api.example.com, a different origin, unless that server opts in with CORS headers like Access-Control-Allow-Origin. For non-simple requests, such as PATCH, JSON content type or an Authorization header, the browser first sends an OPTIONS preflight asking what's allowed. Fix it on the server by allow-listing your front-end origins, methods and headers. Don't use * with credentials, and remember CORS is a browser rule, not server-side security.",
      a: [
        { p: "An <b>origin</b> is scheme + host + port. <code>http://localhost:5173</code> (Vite dev server) calling <code>http://localhost:8000</code> (FastAPI) is cross-origin because the ports differ, which is why every student hits this on day one." },
        { svg: `<svg viewBox="0 0 640 210" width="640" class="dg">
  <rect class="box" x="10" y="10" width="180" height="40" rx="6"/><text class="tx tx-b" x="100" y="30" text-anchor="middle" dominant-baseline="middle">Browser (app.example.com)</text>
  <rect class="box-a" x="450" y="10" width="180" height="40" rx="6"/><text class="tx tx-b" x="540" y="30" text-anchor="middle" dominant-baseline="middle">api.example.com</text>
  <line class="ln ln-d" x1="100" y1="50" x2="100" y2="200"/><line class="ln ln-d" x1="540" y1="50" x2="540" y2="200"/>
  <line class="ln" x1="100" y1="80" x2="535" y2="80" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="110" y="74">OPTIONS preflight: Origin, Access-Control-Request-Method: PATCH</text>
  <line class="ln" x1="540" y1="115" x2="105" y2="115" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="120" y="109">204/200 Access-Control-Allow-Origin, -Methods, -Headers, -Max-Age</text>
  <line class="ln-a" x1="100" y1="150" x2="535" y2="150" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="110" y="144">actual PATCH with Authorization header</text>
  <line class="ln-a" x1="540" y1="185" x2="105" y2="185" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="120" y="179">200 + Access-Control-Allow-Origin → JS may read it</text>
</svg>`, caption: "Preflighted request: the browser asks permission first, then sends the real call" },
        { ul: [
          "<b>Simple requests</b> (no preflight): GET/HEAD/POST with only 'safe' headers and <code>Content-Type</code> of <code>text/plain</code>, <code>multipart/form-data</code> or <code>application/x-www-form-urlencoded</code>.",
          "<b>Preflighted</b>: PUT/PATCH/DELETE, <code>Content-Type: application/json</code>, custom headers like <code>Authorization</code>. So almost every real API call from a SPA.",
          "<b>Credentials</b> (cookies): client sets <code>credentials: 'include'</code>, server must send <code>Access-Control-Allow-Credentials: true</code> and a <i>specific</i> origin, not <code>*</code>."
        ] },
        { code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],     # explicit list — not "*" when sending cookies
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,                                   # browser may cache the preflight for 10 min
)

@app.patch("/api/notes/1")
def edit():
    return {"ok": True}

c = TestClient(app)
pre = c.options("/api/notes/1", headers={
    "Origin": "https://app.example.com",
    "Access-Control-Request-Method": "PATCH",
    "Access-Control-Request-Headers": "authorization, content-type"})
print("preflight:", pre.status_code)
for h in ["access-control-allow-origin", "access-control-allow-methods",
          "access-control-allow-credentials", "access-control-max-age"]:
    print("  ", h, "=", pre.headers.get(h))
evil = c.options("/api/notes/1", headers={"Origin": "https://evil.com", "Access-Control-Request-Method": "PATCH"})
print("preflight from evil.com:", evil.status_code, evil.headers.get("access-control-allow-origin"))
r = c.patch("/api/notes/1", headers={"Origin": "https://evil.com"})
print("actual request from evil.com still runs on server:", r.status_code, r.json(),
      "| ACAO header:", r.headers.get("access-control-allow-origin"))`, lang: "python", title: "FastAPI CORSMiddleware with an explicit allow-list" },
        { code: `preflight: 200
   access-control-allow-origin = https://app.example.com
   access-control-allow-methods = GET, POST, PATCH, DELETE
   access-control-allow-credentials = true
   access-control-max-age = 600
preflight from evil.com: 400 None
actual request from evil.com still runs on server: 200 {'ok': True} | ACAO header: None`, lang: "text", title: "Output" },
        { p: "The last line is the key insight: the server <b>still executed</b> the request from the disallowed origin. CORS only stops the <i>browser</i> from letting JavaScript read the response. curl, Postman and attackers' servers ignore it. You still need authentication and CSRF protection." },
        { tip: "Alternatives to CORS in dev: a Vite/Next.js dev proxy (<code>server.proxy</code> / <code>rewrites</code>) so the browser sees one origin. In prod: serve the API under the same domain (<code>example.com/api</code>) behind a reverse proxy." },
        { warn: "Reflecting whatever <code>Origin</code> the request sends back into <code>Access-Control-Allow-Origin</code> together with <code>Allow-Credentials: true</code> is a real vulnerability: any site can then read your users' data with their cookies." }
      ]
    },
    {
      id: "rate-limit-headers",
      q: "How do you expose rate limiting in a REST API? What do 429, Retry-After and the RateLimit headers mean?",
      topic: "Performance & Reliability",
      level: 2,
      top: false,
      short: "When a client exceeds its quota, return 429 Too Many Requests with a Retry-After header in seconds, a standard HTTP header, and a problem-details body. On every response, tell clients where they stand with limit, remaining and reset headers. These are traditionally X-RateLimit-Limit, -Remaining and -Reset as used by GitHub, and an IETF draft standardises RateLimit and RateLimit-Policy. Limit per API key or user, not just per IP, keep counters in Redis so all instances share them, and have clients back off with jitter.",
      a: [
        { p: "Algorithms (token bucket, sliding window…) and the distributed design are in <a href=\"#/core/sd/rate-limiting-algorithms\">SD: rate limiting algorithms</a> and <a href=\"#/core/sd/design-rate-limiter\">SD: design a rate limiter</a>. This question is about the API contract." },
        { code: `import time
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient

LIMIT, WINDOW = 3, 60                       # 3 requests per 60 s per API key (tiny for the demo)
buckets = {}                                # production: Redis INCR + EXPIRE, shared by all instances
clock = {"now": 1_790_000_000.0}            # fake clock so output is deterministic

app = FastAPI()

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    key = request.headers.get("x-api-key", request.client.host)
    window_start = int(clock["now"] // WINDOW) * WINDOW
    count = buckets.get((key, window_start), 0) + 1
    buckets[(key, window_start)] = count
    reset_in = int(window_start + WINDOW - clock["now"])
    headers = {"RateLimit-Limit": str(LIMIT),
               "RateLimit-Remaining": str(max(0, LIMIT - count)),
               "RateLimit-Reset": str(reset_in)}
    if count > LIMIT:
        headers["Retry-After"] = str(reset_in)
        return JSONResponse({"title": "Too Many Requests", "status": 429}, 429, headers=headers)
    response = await call_next(request)
    response.headers.update(headers)
    return response

@app.get("/search")
def search(q: str):
    return {"q": q, "results": []}

c = TestClient(app)
clock["now"] += 15
for i in range(4):
    r = c.get("/search", params={"q": "laptop"}, headers={"X-API-Key": "k1"})
    print(r.status_code, "remaining", r.headers["ratelimit-remaining"], "reset", r.headers["ratelimit-reset"],
          "retry-after", r.headers.get("retry-after"))
clock["now"] += 45                          # next window
print("new window:", c.get("/search", params={"q": "x"}, headers={"X-API-Key": "k1"}).status_code)`, lang: "python", title: "FastAPI middleware: fixed-window limit with headers (fake clock for deterministic output)" },
        { code: `200 remaining 2 reset 25 retry-after None
200 remaining 1 reset 25 retry-after None
200 remaining 0 reset 25 retry-after None
429 remaining 0 reset 25 retry-after 25
new window: 200`, lang: "text", title: "Output" },
        { table: { head: ["Header", "Meaning", "Seen at"], rows: [
          ["<code>Retry-After: 25</code>", "Seconds (or an HTTP date) to wait. Standard (RFC 9110), also used with 503", "Everyone"],
          ["<code>X-RateLimit-Limit / -Remaining / -Reset</code>", "Quota, left in window, reset (GitHub: Unix epoch seconds)", "GitHub, Twitter/X, many others"],
          ["<code>RateLimit-Policy</code> + <code>RateLimit</code>", "IETF httpapi draft: structured fields, e.g. <code>RateLimit: \"default\";r=0;t=25</code>", "Emerging. Check the draft version you follow"]
        ] } },
        { ul: [
          "<b>Key choice</b>: per API key / user id for authenticated traffic, per IP for login and OTP endpoints (behind a proxy, read the real IP from a <i>trusted</i> <code>X-Forwarded-For</code> hop).",
          "<b>Tiers</b>: free vs paid quotas, plus stricter limits on expensive endpoints (search, export, SMS).",
          "<b>Where</b>: usually at the API gateway / edge (Kong, NGINX, AWS API Gateway, Cloudflare). See <a href=\"#/core/sd/api-gateway\">SD: API gateway</a>.",
          "<b>Client side</b>: honour <code>Retry-After</code>, use exponential backoff with jitter, and don't retry 4xx other than 429."
        ] },
        { warn: "An in-memory counter (like the demo dict) breaks once you run 4 replicas: each allows the full quota. Use Redis <code>INCR</code> + <code>EXPIRE</code> (or a Lua script for sliding windows) so the count is shared." }
      ]
    },

    /* ───────────── Lifecycle & Tooling ───────────── */
    {
      id: "api-versioning",
      q: "How do you version a REST API and evolve it without breaking existing clients?",
      topic: "Lifecycle & Tooling",
      level: 2,
      top: true,
      short: "Prefer additive, backward-compatible changes so you rarely need a new version: add optional fields, endpoints and enum values that clients are told to tolerate, and never remove, rename or retype fields in place. When a breaking change is unavoidable, ship a new major version, usually /v2 in the path or a version header, run both versions, announce deprecation with Deprecation and Sunset headers and a timeline, monitor who still calls v1, then retire it. Stripe pins each account to a dated version and transforms responses.",
      a: [
        { table: { head: ["Non-breaking (safe)", "Breaking (needs a new version)"], rows: [
          ["Add a new endpoint", "Remove or rename an endpoint or field"],
          ["Add an optional request field / query param", "Make an optional field required"],
          ["Add a response field", "Change a field's type (<code>\"id\": 42</code> → <code>\"id\": \"42\"</code>) or format"],
          ["Add an enum value (if clients were told to tolerate unknowns)", "Change the meaning of a value or default behaviour"],
          ["Relax validation", "Tighten validation, change status codes or error shape"],
          ["", "Change auth scheme, pagination style, URL structure"]
        ] } },
        { p: "<b>Robustness principle (Postel's law)</b> for clients: ignore unknown fields, handle unknown enum values gracefully. Then additive server changes never break them. Generate SDKs that follow this (Jackson: <code>FAIL_ON_UNKNOWN_PROPERTIES=false</code>; Pydantic models default to ignoring extras)." },
        { h: "Deprecation lifecycle" },
        { ol: [
          "Release <code>/v2</code> alongside <code>/v1</code>. Share business logic and only adapt the edges (request/response mapping).",
          "Mark v1 deprecated in docs and with response headers: <code>Deprecation: @1767225600</code> (RFC 9745), <code>Sunset: Thu, 01 Jan 2027 00:00:00 GMT</code> (RFC 8594), <code>Link: &lt;https://docs.../migrate&gt;; rel=\"deprecation\"</code>.",
          "Log usage of v1 per API key. Email the heaviest users.",
          "Brownouts: fail v1 for short scheduled windows to surface forgotten callers.",
          "Remove v1 after the sunset date, returning <code>410 Gone</code> with a link to the migration guide."
        ] },
        { code: `# one request, two ways to pick the version
curl https://api.example.com/v2/orders/42
curl -H "Accept: application/vnd.example.v2+json" https://api.example.com/orders/42
# Stripe style: date-pinned versions
curl https://api.stripe.com/v1/charges -u "$STRIPE_KEY:" -H "Stripe-Version: 2024-06-20"`, lang: "bash", title: "Versioning in practice" },
        { tip: "Mobile apps make versioning hard: users don't update, so an Android build from 2 years ago still calls you. That's why backward compatibility, not version numbers, is the real skill. Contract tests (Pact) or OpenAPI diff checks (<code>oasdiff</code>) in CI catch accidental breaking changes. Tie this to <a href=\"#/core/se/semantic-versioning\">SE: semantic versioning</a>." },
        { warn: "Bumping the version for every small change (<code>/v7</code> in a year) means maintaining seven code paths. Version only for breaking changes, and only the major number goes in the URL." }
      ]
    },
    {
      id: "openapi-docs",
      q: "What is OpenAPI (Swagger), and how do you document a REST API?",
      topic: "Lifecycle & Tooling",
      level: 1,
      top: false,
      short: "OpenAPI is a machine-readable specification, in YAML or JSON, describing an HTTP API: paths, methods, parameters, request and response schemas in JSON Schema, auth schemes, examples and error responses. Swagger was its original name, and Swagger UI and Redoc render it as interactive docs. The spec also drives code generation for client SDKs and server stubs, mock servers, request validation and breaking-change checks in CI. FastAPI generates OpenAPI 3.1 automatically from type hints at /openapi.json with /docs, and Java's springdoc does the same for Spring.",
      a: [
        { p: "Two workflows: <b>design-first</b> (write the OpenAPI YAML, review it with front-end/mobile teams, generate stubs) or <b>code-first</b> (annotate code, generate the spec: FastAPI, springdoc-openapi, NestJS). Design-first catches API mistakes before code exists; code-first never drifts from the implementation." },
        { code: `openapi: 3.1.0
info: { title: Library API, version: 1.2.0 }
paths:
  /books/{bookId}:
    get:
      summary: Get one book
      parameters:
        - { name: bookId, in: path, required: true, schema: { type: integer, minimum: 1 } }
      responses:
        "200":
          description: The book
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Book" }
        "404":
          description: No such book
          content:
            application/problem+json:
              schema: { $ref: "#/components/schemas/Problem" }
      security: [ { bearerAuth: [] } ]
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
  schemas:
    Book:
      type: object
      required: [id, title, isbn]
      properties:
        id: { type: integer }
        title: { type: string, maxLength: 200 }
        isbn: { type: string }`, lang: "yaml", title: "Hand-written OpenAPI 3.1 (design-first)" },
        { code: `import json
from fastapi import FastAPI, Path
from fastapi.testclient import TestClient
from pydantic import BaseModel, Field

app = FastAPI(title="Library API", version="1.2.0")

class Book(BaseModel):
    id: int
    title: str = Field(min_length=1, max_length=200, examples=["Clean Code"])
    isbn: str = Field(pattern=r"^[0-9-]{10,17}$")

class Problem(BaseModel):
    title: str
    status: int
    detail: str | None = None

@app.get("/books/{book_id}", response_model=Book, tags=["books"],
         summary="Get one book", responses={404: {"model": Problem, "description": "No such book"}})
def get_book(book_id: int = Path(gt=0, description="Numeric book id")):
    return Book(id=book_id, title="Clean Code", isbn="978-0132350884")

spec = TestClient(app).get("/openapi.json").json()     # same JSON that powers /docs (Swagger UI) and /redoc
print("openapi:", spec["openapi"], "|", spec["info"])
op = spec["paths"]["/books/{book_id}"]["get"]
print("operationId:", op["operationId"])
print("responses:", sorted(op["responses"]))
print("param:", json.dumps(op["parameters"][0]["schema"]))
print("Book schema required:", spec["components"]["schemas"]["Book"]["required"])`, lang: "python", title: "Code-first: FastAPI generates the spec from type hints" },
        { code: `openapi: 3.1.0 | {'title': 'Library API', 'version': '1.2.0'}
operationId: get_book_books__book_id__get
responses: ['200', '404', '422']
param: {"type": "integer", "exclusiveMinimum": 0, "description": "Numeric book id", "title": "Book Id"}
Book schema required: ['id', 'title', 'isbn']`, lang: "text", title: "Output" },
        { ul: [
          "<b>Good docs include</b>: auth how-to, an example request/response for every endpoint, all error codes with their <code>type</code>, pagination and rate-limit rules, a changelog, and a 'quick start' curl.",
          "<b>Tooling</b>: Swagger UI / Redoc / Scalar (rendering), OpenAPI Generator (SDKs in Java, TS, Python…), Prism (mock server), Spectral (lint style rules), oasdiff (breaking-change detection)."
        ] },
        { tip: "Set explicit <code>operation_id</code>s in FastAPI (<code>@app.get(..., operation_id=\"getBook\")</code>): the auto-generated <code>get_book_books__book_id__get</code> becomes an ugly method name in generated client SDKs." }
      ]
    },
    {
      id: "testing-apis",
      q: "How do you test a REST API (curl, Postman, automated tests)?",
      topic: "Lifecycle & Tooling",
      level: 1,
      top: true,
      short: "Use curl or HTTPie for quick manual checks, and Postman, Insomnia or Bruno for saved collections with environments and scripted assertions, which can run in CI via Newman. Automated tests are what matter: in-process tests with FastAPI's TestClient, Flask's test_client or Supertest for Express check status codes, bodies, validation and auth paths. Integration tests run against a real database, often in Testcontainers, contract tests catch breaking changes, and load tests use k6 or JMeter. Test the unhappy paths, not just 200.",
      a: [
        { code: `# verbose: see request + response headers (-i shows response headers only)
curl -v https://api.example.com/v1/orders/42 -H "Authorization: Bearer $TOKEN"

# create with JSON; -w prints the status code after the body
curl -s -X POST https://api.example.com/v1/orders -H "Content-Type: application/json" -d '{"sku":"BK-1","qty":2}' -w " -> %{http_code}"

# conditional GET with an ETag; expect 304
curl -s -o /dev/null -w "%{http_code}" -H 'If-None-Match: "b23b3e88"' https://api.example.com/v1/products/42

# pretty-print and extract a field with jq
curl -s https://api.github.com/repos/python/cpython | jq '.stargazers_count'`, lang: "bash", title: "curl you should know cold" },
        { code: `from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from pydantic import BaseModel

app = FastAPI()
todos = {}

class TodoIn(BaseModel):
    title: str
    done: bool = False

@app.post("/todos", status_code=201)
def create(t: TodoIn):
    tid = len(todos) + 1
    todos[tid] = {"id": tid, **t.model_dump()}
    return todos[tid]

@app.get("/todos/{tid}")
def read(tid: int):
    if tid not in todos:
        raise HTTPException(404, "todo not found")
    return todos[tid]

@app.delete("/todos/{tid}", status_code=204)
def delete(tid: int):
    todos.pop(tid, None)          # idempotent: deleting twice is still 204

client = TestClient(app)          # in-process: no server, no network, fast

# --- tests (pytest would discover these automatically) ---
def test_create_returns_201_and_body():
    r = client.post("/todos", json={"title": "Revise REST"})
    assert r.status_code == 201
    assert r.json() == {"id": 1, "title": "Revise REST", "done": False}

def test_validation_error_is_422():
    r = client.post("/todos", json={"done": "maybe"})
    assert r.status_code == 422
    assert {e["loc"][-1] for e in r.json()["detail"]} == {"title", "done"}

def test_missing_is_404():
    assert client.get("/todos/999").status_code == 404

def test_delete_is_idempotent():
    assert client.delete("/todos/1").status_code == 204
    assert client.delete("/todos/1").status_code == 204
    assert client.get("/todos/1").status_code == 404

for name, fn in list(globals().items()):
    if name.startswith("test_"):
        fn(); print("PASSED", name)`, lang: "python", title: "Automated API tests with FastAPI's TestClient (pytest style)" },
        { code: `PASSED test_create_returns_201_and_body
PASSED test_validation_error_is_422
PASSED test_missing_is_404
PASSED test_delete_is_idempotent`, lang: "text", title: "Output" },
        { table: { head: ["Layer", "Tool", "Checks"], rows: [
          ["Manual / exploratory", "curl, HTTPie, Postman, Bruno", "Does it work at all, headers, debugging"],
          ["Component (in-process)", "TestClient, Flask test_client, Supertest, Spring MockMvc", "Status codes, validation, auth, error shapes"],
          ["Integration", "pytest + Testcontainers (real PostgreSQL/Redis)", "SQL, transactions, migrations"],
          ["Contract", "Pact, Schemathesis (property-based fuzzing from OpenAPI)", "Provider still matches what consumers expect"],
          ["Load / performance", "k6, JMeter, Locust", "p95 latency, throughput, rate limits under load"]
        ] } },
        { p: "A good test checklist per endpoint: happy path, validation errors (422), malformed JSON (400), missing/expired token (401), wrong role (403), another user's object (404, which is the BOLA test), not found, conflict (409), idempotency on retry, and pagination boundaries (empty page, last page)." },
        { tip: "Mention test isolation: override dependencies (FastAPI <code>app.dependency_overrides[get_db] = fake_db</code>) and reset state between tests with fixtures. Unit vs integration vs mocking theory is in <a href=\"#/core/se/testing-levels\">SE: testing levels</a> and <a href=\"#/core/se/mocking\">SE: mocking</a>." }
      ]
    },
    {
      id: "webhooks",
      q: "What are webhooks, and how do you send and receive them securely and reliably?",
      topic: "Lifecycle & Tooling",
      level: 2,
      top: false,
      short: "A webhook is a reverse API call: when an event happens, like payment captured or PR merged, the provider sends an HTTP POST with a JSON payload to a URL the consumer registered, instead of the consumer polling. Receivers must verify an HMAC signature over the raw body and timestamp, reject old timestamps to stop replays, respond 2xx fast and do the work asynchronously, and deduplicate by event id because delivery is at-least-once with retries. Senders sign payloads, retry with backoff and log deliveries.",
      a: [
        { table: { head: ["", "Polling", "Webhook"], rows: [
          ["Who initiates", "Consumer asks 'anything new?' repeatedly", "Provider pushes when the event happens"],
          ["Latency", "Up to the poll interval", "Near real-time"],
          ["Waste", "Most polls return nothing", "One call per event"],
          ["Consumer needs", "Just a client", "A public HTTPS endpoint"],
          ["Examples", "Cron job hitting <code>GET /payments?since=</code>", "Razorpay <code>payment.captured</code>, GitHub <code>push</code>, Stripe <code>invoice.paid</code>"]
        ] } },
        { code: `import hashlib, hmac, json, time

WEBHOOK_SECRET = b"whsec_shared_once_out_of_band"
processed_events = set()        # production: unique index on event_id in the DB

# ---- sender side (the provider, e.g. a payment gateway) ----
def send(event: dict, ts: int):
    body = json.dumps(event).encode()
    sig = hmac.new(WEBHOOK_SECRET, f"{ts}.".encode() + body, hashlib.sha256).hexdigest()
    return {"Webhook-Timestamp": str(ts), "Webhook-Signature": f"v1={sig}"}, body

# ---- receiver side (your POST /webhooks/payments endpoint) ----
def receive(headers: dict, raw_body: bytes, now: int) -> int:
    ts = int(headers["Webhook-Timestamp"])
    if abs(now - ts) > 300:                                   # 5-min window blocks replays
        return 400
    expected = hmac.new(WEBHOOK_SECRET, f"{ts}.".encode() + raw_body, hashlib.sha256).hexdigest()
    given = headers["Webhook-Signature"].removeprefix("v1=")
    if not hmac.compare_digest(expected, given):              # verify on RAW bytes, constant time
        return 401
    event = json.loads(raw_body)
    if event["id"] in processed_events:                       # provider retries -> at-least-once
        return 200                                            # already handled: ack again, do nothing
    processed_events.add(event["id"])
    # enqueue real work (send email, mark order paid) and return fast
    return 200

now = 1_790_000_000
h, body = send({"id": "evt_1", "type": "payment.captured", "data": {"order": 77, "amount": 49900}}, now)
print("valid          ->", receive(h, body, now + 2))
print("duplicate      ->", receive(h, body, now + 30), "| processed:", len(processed_events))
print("tampered body  ->", receive(h, body.replace(b"49900", b"100"), now + 2))
print("replayed later ->", receive(h, body, now + 3600))`, lang: "python", title: "Signing (sender) and verifying (receiver) a webhook with HMAC-SHA256" },
        { code: `valid          -> 200
duplicate      -> 200 | processed: 1
tampered body  -> 401
replayed later -> 400`, lang: "text", title: "Output" },
        { h: "Receiver checklist" },
        { ol: [
          "Verify the signature on the <b>raw request bytes</b>. Re-serialising parsed JSON changes whitespace/key order and breaks the HMAC. Use constant-time comparison.",
          "Check the timestamp is within a few minutes (replay protection).",
          "Deduplicate by event id (unique constraint). Providers retry on any non-2xx or timeout, so duplicates <i>will</i> happen.",
          "Return 2xx within a few seconds. Push the event to a queue and process it in a worker.",
          "Don't trust ordering: <code>payment.refunded</code> may arrive before <code>payment.captured</code>. Fetch the latest state from the provider's API if order matters."
        ] },
        { p: "<b>Sender side</b>: sign every payload, retry with exponential backoff for hours or days, disable endpoints that keep failing, show a delivery log with a 'resend' button, and keep payloads small (an id + type, and let the consumer fetch details). See <a href=\"#/core/sd/message-queues-pub-sub\">SD: message queues</a> for the async processing part." },
        { warn: "Never treat a webhook as proof by itself: verify the signature, and for money, confirm via the provider's API (<code>GET /payments/{id}</code>) before shipping an order. An unauthenticated webhook endpoint lets anyone mark orders as paid." }
      ]
    },
    {
      id: "design-endpoint-walkthrough",
      q: "How would you design a REST endpoint end to end, for example registering a student for a campus event?",
      topic: "Lifecycle & Tooling",
      level: 3,
      top: true,
      short: "Start from the resource model: events and registrations. Pick the URL and method: POST /v1/events/{id}/registrations, returning 201 with Location. Define the request schema as an allow-listed DTO and the response shape. List every status code: 401 not logged in, 404 no event, 409 already registered or full, 422 bad input. Handle auth and authorization, concurrency (a unique constraint plus a transaction for capacity), idempotency for retries, rate limiting, pagination on the list endpoint, logging and metrics, and document it all in OpenAPI with tests for each path.",
      a: [
        { ol: [
          "<b>Clarify requirements</b>: who calls it (student app), capacity limits, team registrations, can you unregister, expected traffic (spike when registration opens at 10:00).",
          "<b>Resources</b>: <code>Event</code>, <code>Registration</code> (event_id, student_id, team_name, created_at). Registration is a sub-resource of an event.",
          "<b>Endpoints</b>: <code>POST /v1/events/{id}/registrations</code> (register), <code>GET /v1/events/{id}/registrations?cursor=</code> (organisers, paginated), <code>GET /v1/me/registrations</code>, <code>DELETE /v1/events/{id}/registrations/{rid}</code>.",
          "<b>Contract</b>: request DTO (only <code>team_name</code>, and student id comes from the token, <i>never</i> the body), response model, status codes, error format.",
          "<b>Security</b>: JWT auth, role check for organiser endpoints, ownership check on DELETE (BOLA).",
          "<b>Correctness under concurrency</b>: <code>UNIQUE(event_id, student_id)</code> and a capacity check in one transaction: <code>UPDATE events SET registered = registered + 1 WHERE id=? AND registered &lt; capacity</code>, then check rows-affected.",
          "<b>Operational</b>: rate limit per student, idempotency key for retries from flaky mobile networks, structured logs with trace id, metrics (p95 latency, 4xx/5xx rate).",
          "<b>Docs and tests</b>: OpenAPI with examples, tests for every status code below."
        ] },
        { svg: `<svg viewBox="0 0 700 120" width="700" class="dg">
  <rect class="box" x="5" y="40" width="85" height="40" rx="6"/><text class="tx tx-b" x="47" y="60" text-anchor="middle" dominant-baseline="middle">Client</text>
  <rect class="box-a" x="115" y="40" width="95" height="40" rx="6"/><text class="tx tx-b" x="162" y="60" text-anchor="middle" dominant-baseline="middle">Gateway</text>
  <rect class="box-p" x="235" y="40" width="95" height="40" rx="6"/><text class="tx tx-b" x="282" y="60" text-anchor="middle" dominant-baseline="middle">AuthN</text>
  <rect class="box-w" x="355" y="40" width="95" height="40" rx="6"/><text class="tx tx-b" x="402" y="60" text-anchor="middle" dominant-baseline="middle">Validate</text>
  <rect class="box-g" x="475" y="40" width="100" height="40" rx="6"/><text class="tx tx-b" x="525" y="60" text-anchor="middle" dominant-baseline="middle">Handler+AuthZ</text>
  <rect class="box-r" x="600" y="40" width="95" height="40" rx="6"/><text class="tx tx-b" x="647" y="60" text-anchor="middle" dominant-baseline="middle">DB (txn)</text>
  <line class="ln" x1="90" y1="60" x2="113" y2="60" marker-end="url(#dg-arr)"/><line class="ln" x1="210" y1="60" x2="233" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="60" x2="353" y2="60" marker-end="url(#dg-arr)"/><line class="ln" x1="450" y1="60" x2="473" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="575" y1="60" x2="598" y2="60" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="162" y="100" text-anchor="middle">TLS, 429</text>
  <text class="tx-s" x="282" y="100" text-anchor="middle">401</text>
  <text class="tx-s" x="402" y="100" text-anchor="middle">400 / 422</text>
  <text class="tx-s" x="525" y="100" text-anchor="middle">403 / 404 / 409</text>
  <text class="tx-s" x="647" y="100" text-anchor="middle">201 + Location</text>
  <text class="tx-m" x="350" y="22" text-anchor="middle">each layer can short-circuit with its own status code</text>
</svg>`, caption: "Request lifecycle for POST /v1/events/7/registrations" },
        { code: `from datetime import datetime, timezone
from fastapi import FastAPI, Depends, Header, HTTPException, Response
from fastapi.testclient import TestClient
from pydantic import BaseModel, ConfigDict

app = FastAPI(title="Campus Events API", version="1.0.0")
EVENTS = {7: {"id": 7, "title": "Hackathon", "capacity": 2, "registered": set()}}
REGS = {}
TOKENS = {"tok-a": "stu_1", "tok-b": "stu_2", "tok-c": "stu_3"}

def student(authorization: str | None = Header(None)) -> str:
    sid = TOKENS.get((authorization or "").removeprefix("Bearer "))
    if not sid:
        raise HTTPException(401, "login required", headers={"WWW-Authenticate": "Bearer"})
    return sid

class RegistrationIn(BaseModel):
    model_config = ConfigDict(extra="forbid")       # no mass assignment
    team_name: str | None = None

@app.post("/v1/events/{event_id}/registrations", status_code=201)
def register(event_id: int, body: RegistrationIn, response: Response, sid: str = Depends(student)):
    event = EVENTS.get(event_id)
    if event is None:
        raise HTTPException(404, "event not found")
    if sid in event["registered"]:
        raise HTTPException(409, "already registered")                  # state conflict
    if len(event["registered"]) >= event["capacity"]:
        raise HTTPException(409, "event is full")
    event["registered"].add(sid)                    # real DB: one transaction + UNIQUE(event_id, student_id)
    rid = f"reg_{len(REGS) + 1}"
    REGS[rid] = {"id": rid, "event_id": event_id, "student_id": sid, "team_name": body.team_name,
                 "created_at": datetime(2026, 10, 3, 9, 30, tzinfo=timezone.utc).isoformat()}
    response.headers["Location"] = f"/v1/events/{event_id}/registrations/{rid}"
    return REGS[rid]

c = TestClient(app)
r = c.post("/v1/events/7/registrations", json={"team_name": "NullPointers"}, headers={"Authorization": "Bearer tok-a"})
print(r.status_code, r.headers["location"], r.json())
print("again        ->", c.post("/v1/events/7/registrations", json={}, headers={"Authorization": "Bearer tok-a"}).status_code)
print("2nd student  ->", c.post("/v1/events/7/registrations", json={}, headers={"Authorization": "Bearer tok-b"}).status_code)
print("full         ->", c.post("/v1/events/7/registrations", json={}, headers={"Authorization": "Bearer tok-c"}).json())
print("no login     ->", c.post("/v1/events/7/registrations", json={}).status_code)
print("bad event    ->", c.post("/v1/events/99/registrations", json={}, headers={"Authorization": "Bearer tok-c"}).status_code)
print("extra field  ->", c.post("/v1/events/7/registrations", json={"paid": True}, headers={"Authorization": "Bearer tok-c"}).status_code)`, lang: "python", title: "The endpoint in FastAPI, exercised through every status path" },
        { code: `201 /v1/events/7/registrations/reg_1 {'id': 'reg_1', 'event_id': 7, 'student_id': 'stu_1', 'team_name': 'NullPointers', 'created_at': '2026-10-03T09:30:00+00:00'}
again        -> 409
2nd student  -> 201
full         -> {'detail': 'event is full'}
no login     -> 401
bad event    -> 404
extra field  -> 422`, lang: "text", title: "Output" },
        { tip: "Interviewers grade the <i>order</i> of your thinking: requirements → resources → contract → errors → security → concurrency → operations. Say your trade-offs out loud, e.g. '409 for full rather than 422, because the request is valid but conflicts with the event's current state'." },
        { warn: "Taking <code>student_id</code> from the request body is the BOLA bug in disguise: anyone could register (or unregister) anyone. Identity always comes from the verified token." }
      ]
    }
  ]
});
