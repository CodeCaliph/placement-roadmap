/* tech stack: Miscellaneous — the smaller tools on the resume, merged into one subject */
(window.TECH = window.TECH || []).push({
  id: "misc",
  title: "Miscellaneous tools",
  short: "Misc",
  icon: "✦",
  blurb: "The smaller tools on your resume, five quick questions each: FastAPI, Flask, SQLite, CI/CD, Agile, TensorFlow, scikit-learn, Hugging Face Transformers, OpenCV and NLP — enough to defend every line.",
  topics: ["FastAPI","Flask","SQLite","CI/CD","Agile","TensorFlow","Scikit-learn","Transformers","OpenCV","NLP"],
  questions: [

    /* ───────────── FastAPI ───────────── */
    {
  id: "fastapi-what-why",
  q: "What is FastAPI and why would you choose it for a Python backend?",
  topic: "FastAPI",
  level: 1,
  top: true,
  short: "FastAPI is a modern Python web framework for building APIs, built on Starlette for the ASGI web layer and Pydantic for data validation. You declare path, query and body parameters with Python type hints, and FastAPI uses them to parse and validate requests, serialise responses and generate interactive OpenAPI docs automatically. It supports async natively, is among the fastest Python frameworks, and runs on an ASGI server such as Uvicorn.",
  a: [
    { p: "<b>FastAPI</b> (first released 2018, 0.11x in 2025) is a framework for building <b>REST/JSON APIs</b>. It is a thin layer that glues together <b>Starlette</b> (routing, requests, websockets, ASGI) and <b>Pydantic v2</b> (validation and serialisation, core written in Rust). Its central idea: <b>type hints are the API contract</b>." },
    { code: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI(title="Placement Prep API")

@app.get("/questions/{qid}")
def get_question(qid: int, lang: str = "python", detailed: bool = False):
    # qid: path param (int); lang, detailed: query params with defaults
    return {"id": qid, "lang": lang, "detailed": detailed}

client = TestClient(app)                 # calls the app in-process, no server needed
r = client.get("/questions/42?detailed=true")
print(r.status_code, r.json())

r = client.get("/questions/abc")         # 'abc' is not an int -> automatic 422
print(r.status_code, r.json()["detail"][0]["msg"])`, lang: "python", title: "Type hints drive parsing and validation" },
    { code: `200 {'id': 42, 'lang': 'python', 'detailed': True}
422 Input should be a valid integer, unable to parse string as an integer`, lang: "text", title: "Output" },
    { h: "Why teams pick it" },
    { ul: [
      "<b>Less code, fewer bugs</b> — no manual <code>int(request.args[...])</code>; invalid input gets a precise 422 error automatically.",
      "<b>Automatic docs</b> — Swagger UI at <code>/docs</code>, ReDoc at <code>/redoc</code>, schema at <code>/openapi.json</code>.",
      "<b>Async-native</b> (ASGI) — good for I/O-heavy services: calling LLM APIs, other microservices, databases with async drivers.",
      "<b>Dependency injection</b> with <code>Depends</code> for DB sessions, auth, pagination.",
      "<b>Editor support</b> — autocomplete and type checking everywhere because everything is typed."
    ] },
    { code: `pip install "fastapi[standard]"      # includes uvicorn and the fastapi CLI
fastapi dev main.py                  # dev server with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4   # production-style`, lang: "bash", title: "Running it" },
    { tip: "Know where it sits: FastAPI handles the HTTP layer; REST design itself (resources, verbs, status codes) is core theory — see <a href=\"#/core/cn/rest-api\">REST APIs</a> and <a href=\"#/core/cn/http-status-codes\">HTTP status codes</a>." },
    { warn: "'FastAPI is fast' refers to the framework overhead. If your route makes a blocking DB call inside <code>async def</code>, it will be slower than Flask — see the async vs def question." }
  ]
},
    {
  id: "fastapi-async-vs-def",
  q: "In FastAPI, what is the difference between declaring a route with async def and with plain def?",
  topic: "FastAPI",
  level: 2,
  top: true,
  short: "An async def route runs directly on the event loop, so it must only await non-blocking I/O; a blocking call such as time.sleep, requests.get or a sync DB driver inside it freezes every other request on that worker. A plain def route is run by FastAPI in a thread pool, so blocking code is safe there. Rule: use async def with async libraries like httpx.AsyncClient or asyncpg, and plain def when you call blocking libraries; CPU-heavy work belongs in a process pool or a task queue.",
  a: [
    { p: "Uvicorn runs one <b>event loop</b> per worker process. FastAPI treats the two kinds of path functions differently:" },
    { table: { head: ["", "<code>async def</code>", "<code>def</code>"], rows: [
      ["Where it runs", "On the event loop itself", "In a thread pool (via Starlette/AnyIO, default 40 threads)"],
      ["Blocking call inside", "Blocks <b>all</b> requests on that worker", "Blocks only that thread — fine"],
      ["Use with", "<code>await</code>-able libraries: httpx.AsyncClient, asyncpg, motor, async SQLAlchemy, async LLM SDKs", "requests, psycopg2, sync SQLAlchemy, most legacy libraries"],
      ["Overhead", "Lowest", "Thread hand-off per request (small)"]
    ] } },
    { code: `import asyncio, time
import httpx
from fastapi import FastAPI

app = FastAPI()

@app.get("/async-nonblocking")
async def a1():
    await asyncio.sleep(0.5)          # simulated non-blocking I/O: yields to the loop
    return {"ok": True}

@app.get("/async-blocking")
async def a2():
    time.sleep(0.5)                   # BUG: blocking call inside async def
    return {"ok": True}

@app.get("/sync")
def s1():
    time.sleep(0.5)                   # blocking, but runs in a worker thread
    return {"ok": True}

async def hit(path, n=4):
    transport = httpx.ASGITransport(app=app)          # call the app in-process
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        t = time.perf_counter()
        await asyncio.gather(*[c.get(path) for _ in range(n)])   # 4 concurrent requests
        return time.perf_counter() - t

for path in ("/async-nonblocking", "/async-blocking", "/sync"):
    print(f"{path:<20} 4 concurrent requests took {asyncio.run(hit(path)):.1f}s")`, lang: "python", title: "Proof: 4 concurrent requests, 0.5 s of 'I/O' each" },
    { code: `/async-nonblocking   4 concurrent requests took 0.5s
/async-blocking      4 concurrent requests took 2.0s
/sync                4 concurrent requests took 0.5s`, lang: "text", title: "Output — the blocking async route serialises every request" },
    { h: "Practical rules" },
    { ul: [
      "Calling an async library? <code>async def</code> + <code>await</code>.",
      "Stuck with a blocking library inside an async route? <code>await run_in_threadpool(func, ...)</code> (from <code>starlette.concurrency</code>) or <code>asyncio.to_thread</code>.",
      "CPU-bound work (image processing, model inference on CPU) blocks threads too because of the GIL — use a <code>ProcessPoolExecutor</code>, Celery/RQ workers, or more Uvicorn/Gunicorn worker processes.",
      "Dependencies follow the same rule: sync dependencies run in the thread pool, async ones on the loop."
    ] },
    { warn: "The classic production bug: <code>async def</code> route using <code>requests.get(...)</code> to call an external API. Under load, p99 latency explodes because one slow upstream call blocks the whole worker. Use <code>httpx.AsyncClient</code>." },
    { tip: "Background on why this happens — threads vs event loops, I/O-bound vs CPU-bound: <a href=\"#/core/os/process-vs-thread\">processes vs threads</a>. Saying 'async improves concurrency for I/O-bound work, not speed for CPU-bound work' is the sentence they want." }
  ]
},
    {
  id: "fastapi-pydantic-validation",
  q: "How do Pydantic models work with FastAPI for request validation and response models?",
  topic: "FastAPI",
  level: 1,
  top: true,
  short: "You declare a class inheriting from Pydantic's BaseModel with typed fields and constraints using Field, such as min_length, gt or pattern. When a route parameter has that type, FastAPI reads the JSON body, validates and converts it, and returns a 422 with field-level errors if it is invalid. response_model, or the return type annotation, filters and validates the output, so a separate output schema can hide fields like password hashes. Pydantic v2 is the current version and is much faster than v1.",
  a: [
    { p: "Use <b>separate schemas</b> for input and output: <code>UserCreate</code> (what the client sends) and <code>UserOut</code> (what you return). The output model is a security boundary — anything not in it is never sent." },
    { code: `from fastapi import FastAPI, status
from fastapi.testclient import TestClient
from pydantic import BaseModel, Field, field_validator

app = FastAPI()

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: str = Field(pattern=r"^[^@]+@[^@]+[.][a-z]+$")
    age: int = Field(ge=16, le=100)
    password: str = Field(min_length=8)

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip().title()

class UserOut(BaseModel):            # no password field -> never leaks
    id: int
    name: str
    email: str

DB = {}

@app.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):   # BaseModel param -> read from JSON body
    uid = len(DB) + 1
    DB[uid] = {"id": uid, **user.model_dump()}     # includes password (hash it in real code!)
    return DB[uid]                                  # filtered through UserOut

c = TestClient(app)
r = c.post("/users", json={"name": "  asha rao ", "email": "asha@x.com", "age": 21, "password": "s3cretpass"})
print(r.status_code, r.json())

r = c.post("/users", json={"name": "A", "email": "bad", "age": "twelve", "password": "x"})
print(r.status_code)
for err in r.json()["detail"]:
    print(" ", err["loc"], "-", err["msg"])`, lang: "python", title: "Input validation + output filtering" },
    { code: `201 {'id': 1, 'name': 'Asha Rao', 'email': 'asha@x.com'}
422
  ['body', 'name'] - String should have at least 2 characters
  ['body', 'email'] - String should match pattern '^[^@]+@[^@]+[.][a-z]+$'
  ['body', 'age'] - Input should be a valid integer, unable to parse string as an integer
  ['body', 'password'] - String should have at least 8 characters`, lang: "text", title: "Output — all errors reported at once, with their location" },
    { table: { head: ["Where the value comes from", "How you declare it"], rows: [
      ["Path <code>/users/{uid}</code>", "<code>uid: int</code> matching the path name"],
      ["Query <code>?page=2</code>", "Simple type not in the path: <code>page: int = 1</code>; constraints via <code>Query(ge=1)</code>"],
      ["JSON body", "A <code>BaseModel</code> parameter"],
      ["Headers / cookies / form / files", "<code>Header()</code>, <code>Cookie()</code>, <code>Form()</code>, <code>UploadFile</code>"]
    ] } },
    { ul: [
      "Pydantic v2 API: <code>model_dump()</code>, <code>model_validate()</code>, <code>@field_validator</code>, <code>model_config = ConfigDict(from_attributes=True)</code> to read ORM objects (v1 names: <code>.dict()</code>, <code>@validator</code>, <code>orm_mode</code>).",
      "By default Pydantic coerces compatible input (<code>\"21\"</code> → 21) in lax mode; use <code>strict=True</code> on a field or model to reject that.",
      "For real email validation use <code>EmailStr</code> (needs the <code>email-validator</code> package)."
    ] },
    { warn: "Returning an ORM object or dict without <code>response_model</code> sends <b>every</b> field — including password hashes or internal flags. Always define an output schema." }
  ]
},
    {
  id: "fastapi-depends",
  q: "What is dependency injection in FastAPI and how do you use Depends?",
  topic: "FastAPI",
  level: 2,
  top: true,
  short: "Depends declares that a route needs the result of another function, the dependency, and FastAPI calls it for each request, resolving its own parameters and sub-dependencies and caching the result within that request. Typical uses are a database session opened and closed with a yield dependency, getting the current user from a token, pagination and shared query params. Tests swap dependencies via app.dependency_overrides, so routes never construct their own resources.",
  a: [
    { p: "A <b>dependency</b> is any callable. FastAPI inspects its parameters the same way it inspects routes (query, headers, other dependencies), calls it before the route, and injects the return value. Code with <code>yield</code> runs setup before and teardown after the response — perfect for DB sessions." },
    { code: `from typing import Annotated
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.testclient import TestClient

app = FastAPI()

# 1) resource with setup/teardown
def get_db():
    db = {"conn": "open"}             # e.g. SessionLocal()
    print("  db opened")
    try:
        yield db
    finally:
        print("  db closed")          # runs even if the route raises

# 2) auth dependency built on a header
FAKE_TOKENS = {"tok-asha": {"id": 1, "name": "asha", "role": "admin"}}
def current_user(authorization: Annotated[str | None, Header()] = None):
    user = FAKE_TOKENS.get((authorization or "").removeprefix("Bearer "))
    if not user:
        raise HTTPException(status_code=401, detail="invalid token")
    return user

# 3) dependency that depends on another one
def admin_user(user: Annotated[dict, Depends(current_user)]):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="admins only")
    return user

# 4) reusable query params
def pagination(page: int = 1, size: int = 10):
    return {"offset": (page - 1) * size, "limit": size}

@app.get("/reports")
def reports(db: Annotated[dict, Depends(get_db)],
            user: Annotated[dict, Depends(admin_user)],
            pg: Annotated[dict, Depends(pagination)]):
    return {"by": user["name"], "db": db["conn"], **pg}

c = TestClient(app)
print(c.get("/reports?page=3", headers={"Authorization": "Bearer tok-asha"}).json())
print(c.get("/reports").status_code)

# Tests: swap the real dependency for a fake
app.dependency_overrides[current_user] = lambda: {"id": 9, "name": "test", "role": "admin"}
print(c.get("/reports").json())
app.dependency_overrides.clear()`, lang: "python", title: "DB session, auth chain, pagination, test overrides" },
    { code: `  db opened
  db closed
{'by': 'asha', 'db': 'open', 'offset': 20, 'limit': 10}
  db opened
  db closed
401
  db opened
  db closed
{'by': 'test', 'db': 'open', 'offset': 0, 'limit': 10}`, lang: "text", title: "Output — teardown runs when the request finishes (before the test prints); the 401 request still opened and closed the DB because get_db is listed first" },
    { ul: [
      "<b>Per-request cache</b>: if two dependencies both need <code>get_db</code>, it runs once per request (disable with <code>Depends(get_db, use_cache=False)</code>).",
      "<b>Router/app-level</b>: <code>APIRouter(dependencies=[Depends(current_user)])</code> protects every route in a router.",
      "<b>Annotated style</b> (<code>Annotated[Session, Depends(get_db)]</code>) is the recommended form since FastAPI 0.95 — define <code>DB = Annotated[...]</code> once and reuse it.",
      "Order of teardown: yield dependencies close in reverse order after the response is produced."
    ] },
    { tip: "Why it matters: routes don't create their own DB connections or parse tokens, so they're easy to test and change — the same idea as constructor injection in Spring. If asked 'how did you test your API?', <code>dependency_overrides</code> with a test DB is the answer." },
    { warn: "Missing 401 vs 403: 401 = not authenticated (no/invalid credentials), 403 = authenticated but not allowed. Interviewers notice when these are swapped." }
  ]
},
    {
  id: "fastapi-openapi-docs",
  q: "How does FastAPI generate automatic API documentation, and how do you improve it?",
  topic: "FastAPI",
  level: 1,
  top: false,
  short: "FastAPI builds an OpenAPI 3 schema from your routes, type hints, Pydantic models, status codes and docstrings and serves it at /openapi.json, with Swagger UI at /docs for trying requests and ReDoc at /redoc. You improve it with tags, summary and description, response_model, documented error responses, Field descriptions and examples. The schema can generate typed client SDKs, for example TypeScript for a React frontend, and docs can be disabled in production.",
  a: [
    { p: "Because every parameter and model is typed, FastAPI can describe the whole API in the <b>OpenAPI</b> standard (formerly Swagger) without extra annotations. The docs are generated from the same code that validates requests, so they don't drift out of date." },
    { code: `from fastapi import FastAPI, Path
from fastapi.testclient import TestClient
from pydantic import BaseModel, Field

app = FastAPI(title="Prep API", version="1.2.0")

class Question(BaseModel):
    id: int
    title: str = Field(description="Question text", examples=["What is FAISS?"])

@app.get("/questions/{qid}", response_model=Question, tags=["questions"],
         summary="Get one question",
         responses={404: {"description": "Question not found"}})
def get_question(qid: int = Path(ge=1, description="Question id")):
    """Returns a single interview question by id."""
    return {"id": qid, "title": "What is FAISS?"}

spec = TestClient(app).get("/openapi.json").json()
op = spec["paths"]["/questions/{qid}"]["get"]
print(spec["openapi"], spec["info"])
print(op["summary"], "|", op["description"], "|", op["tags"])
print("responses:", sorted(op["responses"]))
print("param:", op["parameters"][0]["name"], op["parameters"][0]["schema"])`, lang: "python", title: "What ends up in the schema" },
    { code: `3.1.0 {'title': 'Prep API', 'version': '1.2.0'}
Get one question | Returns a single interview question by id. | ['questions']
responses: ['200', '404', '422']
param: qid {'type': 'integer', 'minimum': 1, 'description': 'Question id', 'title': 'Qid'}`, lang: "text", title: "Output — 422 is documented automatically because validation can fail" },
    { table: { head: ["URL", "What"], rows: [
      ["<code>/docs</code>", "Swagger UI — interactive 'Try it out', supports auth headers"],
      ["<code>/redoc</code>", "ReDoc — clean, read-only reference docs"],
      ["<code>/openapi.json</code>", "Machine-readable schema for client generators, Postman import, contract tests"]
    ] } },
    { ul: [
      "Disable or protect in production if the API is private: <code>FastAPI(docs_url=None, redoc_url=None, openapi_url=None)</code>.",
      "Generate a typed frontend client from <code>openapi.json</code> (e.g. with openapi-typescript / OpenAPI Generator) so React and backend stay in sync.",
      "Flask has no built-in equivalent; you add an extension (flask-smorest, flasgger, APIFlask)."
    ] },
    { tip: "Recent FastAPI versions emit OpenAPI <b>3.1</b> (aligned with JSON Schema). If an older tool chokes on 3.1, that's why." }
  ]
},
    {
  id: "fastapi-vs-flask-django",
  q: "How do FastAPI, Flask and Django compare, and which would you choose for a project?",
  topic: "FastAPI",
  level: 1,
  top: true,
  short: "Django is batteries-included: ORM, migrations, admin panel, auth and templates, great for full web apps with a relational database; Django REST Framework adds APIs. Flask is a minimal synchronous WSGI microframework where you pick extensions yourself. FastAPI is an API-first ASGI framework with type-hint validation, automatic OpenAPI docs and native async. Pick FastAPI for JSON APIs and ML or LLM services, Django for CRUD-heavy products needing an admin, and Flask for small apps or existing codebases.",
  a: [
    { table: { head: ["", "FastAPI", "Flask", "Django"], rows: [
      ["Style", "API-first micro-framework", "Micro-framework", "Full-stack, batteries included"],
      ["Interface", "ASGI (async native)", "WSGI (async views since 2.0, but each runs in a thread)", "WSGI + ASGI (async views since 3.1; ORM async still partial)"],
      ["Validation", "Built in (Pydantic, from type hints)", "Manual or extension (marshmallow, pydantic)", "Forms / DRF serializers"],
      ["API docs", "Automatic OpenAPI + Swagger UI", "Extension", "DRF + extension (e.g. drf-spectacular)"],
      ["ORM / admin / auth", "Bring your own (SQLAlchemy, SQLModel)", "Bring your own (Flask-SQLAlchemy, Flask-Login)", "Built in: ORM, migrations, admin, auth"],
      ["Templates (server HTML)", "Possible (Jinja2) but not the focus", "Jinja2 built in", "Django templates built in"],
      ["Sweet spot", "JSON APIs, microservices, ML/LLM inference, websockets", "Small apps, prototypes, legacy services", "Content sites, e-commerce, internal tools with admin"]
    ] } },
    { code: `# FastAPI — validation + docs from type hints, async-ready
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import BaseModel

fast = FastAPI()
class Item(BaseModel):
    name: str
    price: float

@fast.post("/items")
async def add(item: Item):
    return {"saved": item.name}

# Flask — you parse and validate yourself
from flask import Flask, request, jsonify
flask_app = Flask(__name__)

@flask_app.post("/items")
def add_flask():
    data = request.get_json(silent=True) or {}
    if not isinstance(data.get("name"), str) or not isinstance(data.get("price"), (int, float)):
        return jsonify(error="name (str) and price (number) required"), 400
    return jsonify(saved=data["name"])

bad = {"name": "pen", "price": "cheap"}
print("FastAPI:", TestClient(fast).post("/items", json=bad).status_code)
print("Flask  :", flask_app.test_client().post("/items", json=bad).status_code)
print("FastAPI ok:", TestClient(fast).post("/items", json={"name": "pen", "price": 10}).json())`, lang: "python", title: "Same endpoint in FastAPI and Flask" },
    { code: `FastAPI: 422
Flask  : 400
FastAPI ok: {'saved': 'pen'}`, lang: "text", title: "Output" },
    { h: "How to answer 'why did you choose X?'" },
    { ul: [
      "<b>FastAPI</b>: 'Our backend served a React frontend and called an LLM API — I/O-bound, JSON only, and the auto-generated docs let the frontend team work in parallel.'",
      "<b>Django</b>: 'We needed user accounts, an admin panel for non-technical staff and lots of CRUD models — Django gave all of that on day one.'",
      "<b>Flask</b>: 'A small internal tool / the existing service was already Flask; it was simple and the team knew it.'"
    ] },
    { warn: "Don't claim FastAPI is 'faster' for everything: with blocking DB drivers and CPU-heavy work, throughput is similar. Its real advantages are async I/O concurrency, validation and docs." }
  ]
},

    /* ───────────── Flask ───────────── */
    {
  id: "flask-app-routes",
  q: "How do you create a Flask app and define routes, including URL parameters, HTTP methods and JSON responses?",
  topic: "Flask",
  level: 1,
  top: true,
  short: "You create app = Flask(__name__) and attach view functions to URLs with @app.route, or the shortcuts @app.get and @app.post since Flask 2.0. URL converters like int:uid parse path segments, the methods argument restricts verbs, and returning a dict or jsonify gives a JSON response, optionally with a status code tuple. Flask returns 404 for unknown URLs or failed converters and 405 for a wrong method. test_client lets you exercise routes without running a server.",
  a: [
    { p: "<b>Flask</b> is a WSGI micro-framework built on <b>Werkzeug</b> (HTTP/routing) and <b>Jinja2</b> (templates). 'Micro' means the core gives you routing, request/response and templates; database, auth and validation come from extensions you choose." },
    { code: `from flask import Flask, jsonify, request, abort

app = Flask(__name__)
TODOS = {1: {"id": 1, "title": "Revise DBMS", "done": False}}

@app.get("/todos")                                 # == @app.route("/todos", methods=["GET"])
def list_todos():
    done = request.args.get("done")                # query string ?done=true
    items = list(TODOS.values())
    if done is not None:
        items = [t for t in items if t["done"] == (done == "true")]
    return jsonify(items)                          # lists need jsonify

@app.get("/todos/<int:tid>")                       # converter: only digits match
def get_todo(tid):
    if tid not in TODOS:
        abort(404)
    return TODOS[tid]                              # dict -> JSON automatically

@app.post("/todos")
def create_todo():
    data = request.get_json()
    tid = max(TODOS) + 1
    TODOS[tid] = {"id": tid, "title": data["title"], "done": False}
    return TODOS[tid], 201, {"Location": f"/todos/{tid}"}   # body, status, headers

c = app.test_client()
print(c.get("/todos?done=false").json)
print(c.post("/todos", json={"title": "Mock interview"}).status_code)
print(c.get("/todos/2").json)
print(c.get("/todos/abc").status_code, c.delete("/todos/1").status_code)`, lang: "python", title: "A small JSON API" },
    { code: `[{'done': False, 'id': 1, 'title': 'Revise DBMS'}]
201
{'done': False, 'id': 2, 'title': 'Mock interview'}
404 405`, lang: "text", title: "Output — /todos/abc doesn't match int converter → 404; DELETE not allowed → 405" },
    { table: { head: ["Converter", "Matches"], rows: [
      ["<code>&lt;name&gt;</code> / <code>&lt;string:name&gt;</code>", "Any text without a slash (default)"],
      ["<code>&lt;int:id&gt;</code>, <code>&lt;float:x&gt;</code>", "Positive integers / floats"],
      ["<code>&lt;path:p&gt;</code>", "Text including slashes"],
      ["<code>&lt;uuid:u&gt;</code>", "UUID strings"]
    ] } },
    { ul: [
      "<code>flask --app app run --debug</code> starts the dev server with reloader and debugger (never in production).",
      "<code>url_for(\"get_todo\", tid=2)</code> builds URLs from the function name — no hard-coded paths.",
      "Error handlers: <code>@app.errorhandler(404)</code> to return JSON errors instead of HTML pages."
    ] },
    { warn: "<code>request.get_json()</code> raises a 415/400 error if the body isn't JSON; <code>get_json(silent=True)</code> returns <code>None</code> instead. And <code>data[\"title\"]</code> with a missing key gives a 400 'Bad Request' via <code>KeyError</code> only for <code>request.form</code>/<code>args</code> — for a dict from JSON it's a plain 500. Validate input explicitly." }
  ]
},
    {
  id: "flask-request-context",
  q: "How do request, g, session and current_app work in Flask? What are the application and request contexts?",
  topic: "Flask",
  level: 2,
  top: true,
  short: "Flask exposes request, session, g and current_app as global-looking context locals: proxies that point to the object for the current request or app, stored per thread or coroutine with contextvars, so concurrent requests don't see each other's data. When a request arrives, Flask pushes an application context, which provides current_app and g, and a request context, which provides request and session, and pops them afterwards. Outside a request, for scripts or tests, you push one yourself with app.app_context().",
  a: [
    { p: "In Flask you write <code>request.args</code> without receiving <code>request</code> as a parameter. That works because <code>request</code> is a <b>proxy</b> (Werkzeug <code>LocalProxy</code>) that looks up the object bound to the <b>current context</b> — implemented with <code>contextvars</code>, so each thread/greenlet/coroutine sees its own request." },
    { table: { head: ["Name", "Context", "Lifetime", "Use"], rows: [
      ["<code>current_app</code>", "Application", "Per request / CLI command", "Config, extensions without importing <code>app</code> (avoids circular imports)"],
      ["<code>g</code>", "Application", "One request", "Per-request scratch space: DB connection, current user"],
      ["<code>request</code>", "Request", "One request", "Args, form, JSON, headers, files"],
      ["<code>session</code>", "Request", "Across requests (signed cookie)", "Small user state, e.g. user id; needs <code>SECRET_KEY</code>"]
    ] } },
    { code: `import sqlite3
from flask import Flask, g, request, session, current_app

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-only"          # signs the session cookie
app.config["DB_PATH"] = ":memory:"

def get_db():
    if "db" not in g:                          # one connection per request, created lazily
        g.db = sqlite3.connect(current_app.config["DB_PATH"])
        print("  opened db")
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close(); print("  closed db")

@app.post("/login")
def login():
    session["user"] = request.json["user"]     # stored in a signed cookie
    return {"ok": True}

@app.get("/me")
def me():
    get_db().execute("SELECT 1"); get_db()     # second call reuses g.db
    return {"user": session.get("user"), "ua": request.headers.get("User-Agent")}

c = app.test_client()
c.post("/login", json={"user": "asha"})
print(c.get("/me", headers={"User-Agent": "pytest"}).json)

try:
    request.path                                # no request is active here
except RuntimeError as e:
    print("outside request:", str(e).splitlines()[0])

with app.app_context():                         # e.g. a CLI script or test setup
    print("in app context:", current_app.config["DB_PATH"])`, lang: "python", title: "g for per-request resources, session across requests" },
    { code: `  opened db
  closed db
{'ua': 'pytest', 'user': 'asha'}
outside request: Working outside of request context.
in app context: :memory:`, lang: "text", title: "Output" },
    { warn: "Flask's default <code>session</code> is <b>client-side</b>: data is signed (tamper-proof) but only base64-encoded, <b>not encrypted</b> — anyone can read it. Never store secrets or large data in it; use server-side sessions (Flask-Session + Redis) if needed." },
    { tip: "Follow-up: 'Isn't a global request object unsafe with multiple threads?' — No, because each worker thread/greenlet has its own context; the proxy resolves per context. Cookies vs sessions vs tokens theory: <a href=\"#/core/cn/cookies-sessions-tokens\">core: cookies, sessions & tokens</a>." }
  ]
},
    {
  id: "flask-blueprints",
  q: "What are Flask blueprints and the application factory pattern, and why use them?",
  topic: "Flask",
  level: 2,
  top: true,
  short: "A Blueprint is a group of routes, error handlers and templates that you define separately — say auth, users, admin — and register on an app, optionally with a url_prefix. The application factory, a create_app function that builds and configures the app and registers blueprints and extensions, avoids a global app object. Together they make large Flask projects modular, prevent circular imports, and let tests create apps with different configs, such as a test database.",
  a: [
    { p: "A single <code>app.py</code> with 60 routes becomes unmanageable. <b>Blueprints</b> split the app by feature; the <b>factory</b> creates the app on demand with a given config." },
    { code: `from flask import Flask, Blueprint, jsonify, url_for

# --- users/routes.py ---
users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.get("/")
def list_users():
    return jsonify(["asha", "ravi"])

@users_bp.get("/<int:uid>")
def get_user(uid):
    return {"id": uid, "self": url_for("users.get_user", uid=uid)}   # endpoint = "blueprint.func"

# --- auth/routes.py ---
auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/login")
def login():
    return {"token": "abc"}

@auth_bp.app_errorhandler(404)                 # app-wide JSON 404 from a blueprint
def not_found(e):
    return {"error": "not found"}, 404

# --- app/__init__.py ---
def create_app(config=None):
    app = Flask(__name__)
    app.config.update(DATABASE_URL="sqlite:///prod.db", TESTING=False)
    app.config.update(config or {})
    # db.init_app(app); login_manager.init_app(app)   # extensions bind here
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    return app

app = create_app({"TESTING": True, "DATABASE_URL": "sqlite:///:memory:"})   # e.g. in a test
c = app.test_client()
print(c.get("/users/").json, c.get("/users/7").json)
print(c.post("/api/auth/login").json, c.get("/nope").json)
print(sorted(r.endpoint for r in app.url_map.iter_rules() if r.endpoint != "static"))`, lang: "python", title: "Two blueprints + create_app" },
    { code: `['asha', 'ravi'] {'id': 7, 'self': '/users/7'}
{'token': 'abc'} {'error': 'not found'}
['auth.login', 'users.get_user', 'users.list_users']`, lang: "text", title: "Output" },
    { code: `myapp/
├── app/
│   ├── __init__.py        # create_app()
│   ├── extensions.py      # db = SQLAlchemy(), login_manager = LoginManager()
│   ├── auth/routes.py     # auth_bp
│   └── users/routes.py    # users_bp
├── tests/conftest.py      # app = create_app({"TESTING": True, ...})
└── wsgi.py                # app = create_app()  -> gunicorn wsgi:app`, lang: "text", title: "Typical project layout" },
    { ul: [
      "Extensions are created unbound in <code>extensions.py</code> and attached with <code>ext.init_app(app)</code> inside the factory — that's what breaks circular imports.",
      "A blueprint can have its own <code>templates/</code> and <code>static/</code> folders and <code>before_request</code> hooks (e.g. require login for the whole admin blueprint).",
      "FastAPI's equivalent of a blueprint is <code>APIRouter</code> + <code>app.include_router(router, prefix=...)</code>."
    ] },
    { tip: "Endpoint names are namespaced: <code>url_for('users.get_user')</code>, not <code>url_for('get_user')</code>. Mentioning the factory + <code>init_app</code> pattern signals you've built a real Flask project, not just a tutorial." }
  ]
},
    {
  id: "flask-vs-fastapi",
  q: "When would you still choose Flask over FastAPI, and what are Flask's limitations?",
  topic: "Flask",
  level: 1,
  top: true,
  short: "Choose Flask for server-rendered web apps with Jinja templates and forms, for small internal tools, when the team or codebase already uses Flask, or when you rely on its mature extension ecosystem such as Flask-Login, Flask-SQLAlchemy and Flask-WTF. Its limitations: it is WSGI, so async views in Flask 2.0 and later still occupy a worker thread each and you get no real async concurrency; it has no built-in validation or API docs; and structure is up to you, which can get messy.",
  a: [
    { table: { head: ["Concern", "Flask", "FastAPI"], rows: [
      ["Protocol", "WSGI — one request per worker thread/process", "ASGI — many concurrent requests per worker via async"],
      ["<code>async def</code> views", "Supported since 2.0, but each runs in its own event loop on a worker thread — no concurrency gain", "Native, on the shared event loop"],
      ["WebSockets / SSE", "Extensions (Flask-SocketIO, flask-sock)", "Built in"],
      ["Validation & serialisation", "Manual or extension", "Pydantic, built in"],
      ["API docs", "Extension", "Automatic"],
      ["Server-rendered HTML", "First-class (Jinja2, flash messages, Flask-WTF forms)", "Possible, not the focus"],
      ["Maturity / extensions", "Since 2010, huge ecosystem, lots of tutorials", "Younger, API-focused ecosystem"]
    ] } },
    { code: `import asyncio
from flask import Flask

app = Flask(__name__)

@app.get("/sync")
def sync_view():
    return {"kind": "sync"}

@app.get("/async")
async def async_view():            # allowed (pip install "flask[async]"), but runs via asgiref
    await asyncio.sleep(0.01)      # in a new event loop on this worker's thread
    return {"kind": "async"}

c = app.test_client()
print(c.get("/sync").json, c.get("/async").json)`, lang: "python", run: false, title: "Flask async views work (needs the flask[async] extra), but are not ASGI" },
    { code: `{'kind': 'sync'} {'kind': 'async'}`, lang: "text", title: "Output" },
    { h: "Reasons to pick Flask in 2025–26" },
    { ul: [
      "A classic web app with HTML pages, sessions and forms (admin dashboards, college projects with templates).",
      "Existing Flask services and team expertise — rewriting for marginal gains is rarely worth it.",
      "Simple sync workloads where Gunicorn workers give enough throughput.",
      "Need a specific mature extension; or want the smallest mental model for a tiny service."
    ] },
    { warn: "Don't say 'Flask can't do async'. It can run <code>async def</code> views since 2.0 — they just don't make a WSGI worker handle more concurrent requests. If you need that, use Quart (async Flask API) or FastAPI." },
    { tip: "See the three-way comparison in the FastAPI section for Django. A balanced answer ('FastAPI for the JSON API, Flask/Django where we need server-side pages') beats framework fandom." }
  ]
},
    {
  id: "flask-deployment",
  q: "How do you deploy a Flask app to production, and why not just use flask run?",
  topic: "Flask",
  level: 2,
  top: false,
  short: "The built-in development server is single-process, not hardened or tuned for load, and with debug on exposes an interactive debugger that allows code execution. In production you run the WSGI app under a production server such as Gunicorn, for example gunicorn -w 4 -b 0.0.0.0:8000 wsgi:app, or Waitress on Windows, behind a reverse proxy like Nginx that terminates TLS, serves static files and buffers slow clients. Usually this is packaged in Docker with config and secrets from environment variables.",
  a: [
    { svg: `<svg viewBox="0 0 640 140" width="640" class="dg">
  <rect class="box" x="10" y="50" width="90" height="40" rx="6"/>
  <text class="tx tx-b" x="55" y="70" text-anchor="middle" dominant-baseline="middle">Browser</text>
  <rect class="box-a" x="150" y="50" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="210" y="70" text-anchor="middle" dominant-baseline="middle">Nginx</text>
  <rect class="box-p" x="320" y="35" width="150" height="70" rx="6"/>
  <text class="tx tx-b" x="395" y="58" text-anchor="middle" dominant-baseline="middle">Gunicorn master</text>
  <text class="tx-s" x="395" y="82" text-anchor="middle">worker 1 … worker N</text>
  <rect class="box-g" x="520" y="50" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="575" y="70" text-anchor="middle" dominant-baseline="middle">Flask app (WSGI)</text>
  <line class="ln" x1="100" y1="70" x2="148" y2="70" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="270" y1="70" x2="318" y2="70" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="470" y1="70" x2="518" y2="70" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="124" y="40" text-anchor="middle">HTTPS</text>
  <text class="tx-m" x="294" y="40" text-anchor="middle">HTTP</text>
  <text class="tx-m" x="210" y="120" text-anchor="middle">TLS, static files, buffering</text>
  <text class="tx-m" x="395" y="125" text-anchor="middle">process manager, restarts crashed workers</text>
</svg>`, caption: "Reverse proxy → WSGI server with N worker processes → your app object." },
    { code: `# wsgi.py
from app import create_app
app = create_app()

# run (Linux/macOS)
gunicorn -w 4 -b 0.0.0.0:8000 --timeout 30 --access-logfile - wsgi:app
#   -w workers: start near (2 x CPU cores) + 1 for sync workers, then load-test
#   --threads 4      -> gthread workers for I/O-bound apps
#   -k gevent        -> green threads for many slow I/O requests

# Windows (Gunicorn needs fork, so it doesn't run on Windows)
waitress-serve --listen=0.0.0.0:8000 wsgi:app`, lang: "bash", title: "Production servers" },
    { code: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY . .
ENV FLASK_DEBUG=0
EXPOSE 8000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "wsgi:app"]`, lang: "dockerfile", title: "Container image" },
    { table: { head: ["Concern", "Dev server (<code>flask run</code>)", "Production"], rows: [
      ["Concurrency", "Threaded, one process", "Multiple worker processes (Gunicorn/uWSGI/Waitress)"],
      ["Security", "Debugger = remote code execution if exposed", "Debug off; app behind a proxy"],
      ["Resilience", "Dies with the process", "Master restarts dead workers; systemd/Docker/K8s restart the master"],
      ["TLS & static files", "No", "Nginx / load balancer / CDN"]
    ] } },
    { ul: [
      "Config via environment variables: <code>SECRET_KEY</code>, database URL; never commit them.",
      "Health-check endpoint (<code>/healthz</code>) for the load balancer (<a href=\"#/core/sd/health-checks\">core: health checks</a>).",
      "For FastAPI the same picture with an ASGI server: <code>uvicorn --workers 4</code> or <code>gunicorn -k uvicorn.workers.UvicornWorker</code>."
    ] },
    { warn: "Never deploy with <code>debug=True</code> / <code>FLASK_DEBUG=1</code>: the Werkzeug debugger lets anyone who triggers an error run Python code on your server (it is PIN-protected, but you should never rely on that)." },
    { tip: "Why a reverse proxy at all: <a href=\"#/core/cn/proxy-vs-reverse-proxy\">core: proxy vs reverse proxy</a>." }
  ]
},

    /* ───────────── SQLite ───────────── */
    {
  id: "sqlite-when-to-use",
  q: "What is SQLite and when should (and shouldn't) you use it?",
  topic: "SQLite",
  level: 1,
  top: true,
  short: "SQLite is an embedded, serverless, zero-configuration SQL database: a C library linked into your process that stores the whole database in one file, with full ACID transactions. It is ideal for mobile and desktop apps, embedded devices, local caches, tests, prototypes and low-to-medium traffic websites with a single server. Avoid it when many processes or machines need to write concurrently, when the app runs on several servers, or when you need users, roles and network access.",
  a: [
    { p: "<b>SQLite</b> is not a client–server database: there is no daemon, no port, no users. Your program calls the library directly and reads/writes a single cross-platform file. It's the most widely deployed database in the world — in every Android and iOS device, browsers, and Python's standard library (<code>sqlite3</code>)." },
    { code: `import sqlite3

con = sqlite3.connect(":memory:")       # or "app.db" -> a single file on disk
con.execute("PRAGMA foreign_keys = ON")
con.executescript("""
CREATE TABLE students(id INTEGER PRIMARY KEY, name TEXT NOT NULL, branch TEXT);
CREATE TABLE scores(student_id INTEGER REFERENCES students(id), subject TEXT, marks INTEGER);
""")
con.executemany("INSERT INTO students(name, branch) VALUES (?, ?)",       # parameterised
                [("Asha", "CSE"), ("Ravi", "ECE"), ("Meera", "CSE")])
con.executemany("INSERT INTO scores VALUES (?, ?, ?)",
                [(1, "DBMS", 88), (1, "OS", 92), (2, "DBMS", 75), (3, "DBMS", 95), (3, "OS", 81)])
con.commit()

rows = con.execute("""
    SELECT s.name, ROUND(AVG(m.marks), 1) AS avg_marks,
           RANK() OVER (ORDER BY AVG(m.marks) DESC) AS rnk
    FROM students s JOIN scores m ON m.student_id = s.id
    GROUP BY s.id ORDER BY rnk
""").fetchall()
print(rows)
print("SQLite version:", sqlite3.sqlite_version)`, lang: "python", title: "Full SQL — joins, window functions, transactions — with zero setup" },
    { code: `[('Asha', 90.0, 1), ('Meera', 88.0, 2), ('Ravi', 75.0, 3)]
SQLite version: 3.42.0`, lang: "text", title: "Output (the version depends on your Python build)" },
    { table: { head: ["Great fit", "Poor fit"], rows: [
      ["Mobile / desktop / embedded apps (app-local data)", "Many concurrent writers (busy write-heavy web app)"],
      ["Tests and CI (in-memory DB, fast, disposable)", "App running on multiple servers sharing one DB"],
      ["Prototypes, side projects, single-server sites (most read-heavy sites up to ~100k hits/day are fine)", "Database on a network file system (NFS/SMB) — locking is unreliable"],
      ["Local cache / file format (e.g. app config, offline data)", "Need user accounts, roles, network access, replication"],
      ["Data analysis on a single file", "Very large datasets with heavy concurrent analytics → Postgres/warehouse"]
    ] } },
    { tip: "Quote the SQLite authors' framing: SQLite competes with <code>fopen()</code>, not with Postgres. It replaces ad-hoc files, not your client–server database. DB theory (ACID, transactions) is in <a href=\"#/core/dbms/acid-properties\">core: ACID</a>." },
    { warn: "Always use <code>?</code> placeholders, never f-strings, to build SQL — SQLite is just as vulnerable to <a href=\"#/core/dbms/sql-injection\">SQL injection</a> as any other database." }
  ]
},
    {
  id: "sqlite-concurrency-wal",
  q: "How does SQLite handle concurrency and locking? What is WAL mode and why does it help?",
  topic: "SQLite",
  level: 2,
  top: true,
  short: "SQLite locks the whole database file: any number of readers, but only one writer at a time. In the default rollback-journal mode a writer must wait for all readers to finish before committing, and readers are blocked during the commit. In WAL, write-ahead log mode, changes are appended to a separate -wal file, so readers keep reading a consistent snapshot while one writer writes and commits. Writers still serialise, so set a busy_timeout and keep write transactions short to avoid 'database is locked' errors.",
  a: [
    { p: "SQLite has <b>database-level</b> locking (no row locks). The rule in both modes: <b>one writer at a time</b>. What differs is how readers and the writer interact." },
    { table: { head: ["", "Rollback journal (DELETE, default)", "WAL (<code>PRAGMA journal_mode=WAL</code>)"], rows: [
      ["How a write works", "Copy original pages to <code>-journal</code>, modify the DB file in place", "Append new pages to <code>-wal</code>; checkpoint copies them into the DB later"],
      ["Readers during a write", "Can read until commit; commit needs an EXCLUSIVE lock → waits for readers", "Never blocked; read a snapshot as of their transaction start"],
      ["Writer vs readers", "Long reads can stall commits (and vice versa)", "Don't block each other"],
      ["Writer vs writer", "Serialised", "Serialised"],
      ["Files", "<code>db</code> (+ temporary <code>-journal</code>)", "<code>db</code>, <code>db-wal</code>, <code>db-shm</code>; same machine only"]
    ] } },
    { code: `import sqlite3, os

def demo(mode):
    path = f"shop_{mode}.db"
    for ext in ("", "-wal", "-shm", "-journal"):
        if os.path.exists(path + ext):
            os.remove(path + ext)
    setup = sqlite3.connect(path)
    setup.execute(f"PRAGMA journal_mode={mode}")
    setup.execute("CREATE TABLE orders(id INTEGER PRIMARY KEY, total REAL)")
    setup.execute("INSERT INTO orders(total) VALUES (100)")
    setup.commit(); setup.close()

    # isolation_level=None: we issue BEGIN/COMMIT ourselves; timeout=0: fail instead of waiting
    reader = sqlite3.connect(path, isolation_level=None, timeout=0)
    writer = sqlite3.connect(path, isolation_level=None, timeout=0)
    writer2 = sqlite3.connect(path, isolation_level=None, timeout=0)

    reader.execute("BEGIN")                                  # a long-running read transaction
    print(f"[{mode}] reader sees", reader.execute("SELECT count(*) FROM orders").fetchone()[0], "row")

    writer.execute("BEGIN IMMEDIATE")                        # grab the single write lock
    writer.execute("INSERT INTO orders(total) VALUES (250)")
    try:
        writer2.execute("BEGIN IMMEDIATE")
    except sqlite3.OperationalError as e:
        print(f"[{mode}] second writer:", e)
    try:
        writer.execute("COMMIT")
        print(f"[{mode}] writer committed while the reader was open;",
              "reader's snapshot still sees", reader.execute("SELECT count(*) FROM orders").fetchone()[0], "row")
    except sqlite3.OperationalError as e:
        print(f"[{mode}] writer COMMIT:", e, "(must wait for the reader)")
    reader.execute("COMMIT")
    if writer.in_transaction:
        writer.execute("COMMIT")
    print(f"[{mode}] new read sees", reader.execute("SELECT count(*) FROM orders").fetchone()[0], "rows")
    for c in (reader, writer, writer2):
        c.close()

demo("delete")     # classic rollback journal (the default)
demo("wal")        # write-ahead log`, lang: "python", title: "Same scenario, both journal modes" },
    { code: `[delete] reader sees 1 row
[delete] second writer: database is locked
[delete] writer COMMIT: database is locked (must wait for the reader)
[delete] new read sees 2 rows
[wal] reader sees 1 row
[wal] second writer: database is locked
[wal] writer committed while the reader was open; reader's snapshot still sees 1 row
[wal] new read sees 2 rows`, lang: "text", title: "Output — WAL lets the writer commit under an open reader; two writers still conflict in both modes" },
    { code: `con = sqlite3.connect("app.db", timeout=5)      # Python: wait up to 5 s for a lock (default 5.0)
con.execute("PRAGMA journal_mode=WAL")           # persistent: stored in the DB file
con.execute("PRAGMA busy_timeout=5000")          # same idea at the SQLite level (ms)
con.execute("PRAGMA synchronous=NORMAL")         # common WAL pairing: fewer fsyncs, still consistent`, lang: "python", run: false, title: "Typical settings for a web app on SQLite" },
    { ul: [
      "<b>'database is locked'</b> = a connection waited longer than its busy timeout for a lock. Fixes: WAL, a busy timeout, short write transactions, and never holding a transaction open while doing slow work (HTTP calls).",
      "Start write transactions with <code>BEGIN IMMEDIATE</code> so a read-then-write transaction doesn't fail midway when upgrading its lock.",
      "Funnel heavy writes through one process or a queue if you have many writers."
    ] },
    { tip: "Connect it to theory: WAL here is the same idea as <a href=\"#/core/dbms/log-based-recovery-wal\">write-ahead logging</a>, and snapshot reads are a simple form of <a href=\"#/core/dbms/mvcc\">MVCC</a>. Whole-database locking vs row locking: <a href=\"#/core/dbms/locking-shared-exclusive\">core: shared/exclusive locks</a>." }
  ]
},
    {
  id: "sqlite-type-affinity",
  q: "What is type affinity in SQLite, and how is it different from types in MySQL or PostgreSQL?",
  topic: "SQLite",
  level: 2,
  top: false,
  short: "SQLite uses dynamic typing: a column's declared type only gives it an affinity — INTEGER, REAL, NUMERIC, TEXT or BLOB — and each value carries its own storage class. On insert SQLite tries to convert values to the column's affinity, for example the text '42' into an INTEGER column becomes 42, but if conversion is impossible it stores the value as-is, so 'abc' sits happily in an INTEGER column. PostgreSQL and MySQL strict mode would reject that. Since SQLite 3.37, STRICT tables enforce declared types.",
  a: [
    { p: "Every <b>value</b> in SQLite has one of five storage classes: <code>NULL</code>, <code>INTEGER</code>, <code>REAL</code>, <code>TEXT</code>, <code>BLOB</code>. A <b>column</b> only has an <b>affinity</b> — a preferred type — derived from its declared type name by substring rules." },
    { table: { head: ["Declared type contains…", "Affinity", "Examples"], rows: [
      ["<code>INT</code>", "INTEGER", "INT, INTEGER, BIGINT, TINYINT"],
      ["<code>CHAR</code>, <code>CLOB</code>, <code>TEXT</code>", "TEXT", "VARCHAR(20), TEXT — VARCHAR(20)'s length is <b>not enforced</b>"],
      ["<code>BLOB</code> or no type", "BLOB", "BLOB, (none)"],
      ["<code>REAL</code>, <code>FLOA</code>, <code>DOUB</code>", "REAL", "REAL, DOUBLE, FLOAT"],
      ["anything else", "NUMERIC", "NUMERIC, DECIMAL(10,2), BOOLEAN, DATE, DATETIME"]
    ] } },
    { code: `import sqlite3

con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE t(n INTEGER, name VARCHAR(3), price DECIMAL(10,2), flag BOOLEAN)")
con.executemany("INSERT INTO t VALUES (?, ?, ?, ?)", [
    ("42", "Asha Rao", "19.99", True),      # '42' converted to integer; 8 chars in VARCHAR(3)
    ("abc", 7, "free", "yes"),              # 'abc' can't convert -> stored as TEXT
])
for row in con.execute("SELECT n, typeof(n), name, typeof(name), price, typeof(price), flag, typeof(flag) FROM t"):
    print(row)

# STRICT tables (SQLite 3.37+): declared types are enforced
con.execute("CREATE TABLE s(n INTEGER, name TEXT) STRICT")
con.execute("INSERT INTO s VALUES (?, ?)", ("42", "ok"))             # '42' still converts losslessly
print(con.execute("SELECT n, typeof(n) FROM s").fetchone())
try:
    con.execute("INSERT INTO s VALUES (?, ?)", ("abc", "x"))
except sqlite3.IntegrityError as e:
    print("STRICT:", e)`, lang: "python", title: "Affinity in action" },
    { code: `(42, 'integer', 'Asha Rao', 'text', 19.99, 'real', 1, 'integer')
('abc', 'text', '7', 'text', 'free', 'text', 'yes', 'text')
(42, 'integer')
STRICT: cannot store TEXT value in INTEGER column s.n`, lang: "text", title: "Output — 'abc' in an INTEGER column, 8 chars in VARCHAR(3), 'yes' in BOOLEAN: all accepted" },
    { ul: [
      "<b>No BOOLEAN type</b> — <code>True/False</code> are stored as integers 1/0.",
      "<b>No DATE type</b> — store ISO-8601 text (<code>'2026-10-03 14:00:00'</code>), Unix integers or Julian reals and use <code>date()</code>/<code>datetime()</code> functions.",
      "<b>No DECIMAL</b> — DECIMAL columns use NUMERIC affinity and store REALs (binary floats); keep money as integer paise/cents.",
      "<code>INTEGER PRIMARY KEY</code> is special: it is an alias for the internal <code>rowid</code> and must hold integers."
    ] },
    { warn: "Moving from SQLite (in dev) to PostgreSQL (in prod) often surfaces bad data that SQLite silently accepted — wrong types, over-long strings. Use STRICT tables or test against the production database engine in CI." }
  ]
},
    {
  id: "sqlite-limitations",
  q: "What are the main limitations and gotchas of SQLite compared to a client–server database?",
  topic: "SQLite",
  level: 2,
  top: false,
  short: "Key limitations: a single writer at a time with database-level locking; no network access, users or permissions; foreign key enforcement is off by default per connection; ALTER TABLE is limited — DROP COLUMN only since 3.35 and changing a column type means rebuilding the table; no stored procedures; weak static typing unless you use STRICT; unsafe on network file systems; and no built-in replication. Most are fine for its target use cases but matter for multi-user servers.",
  a: [
    { table: { head: ["Limitation", "Detail", "Workaround"], rows: [
      ["Write concurrency", "One writer at a time, whole-DB lock", "WAL + busy timeout; or move to Postgres/MySQL"],
      ["No server features", "No users/roles/GRANT, no network protocol", "File-system permissions; client–server DB for multi-app access"],
      ["Foreign keys off by default", "Must run <code>PRAGMA foreign_keys = ON</code> on <b>every</b> connection, outside a transaction", "Set it in your connection factory / ORM event hook"],
      ["Limited <code>ALTER TABLE</code>", "RENAME / ADD COLUMN; DROP COLUMN since 3.35 (2021); no type change", "Create new table → copy → drop → rename (migration tools do this)"],
      ["Types", "Dynamic typing; VARCHAR(n) not enforced; no DATE/BOOLEAN/DECIMAL", "STRICT tables (3.37+), CHECK constraints"],
      ["No stored procedures", "Only triggers and views", "Logic in application code; custom functions via <code>create_function</code>"],
      ["Network file systems", "Broken locking on NFS/SMB can corrupt the DB", "Keep the file on local disk"],
      ["Replication / HA", "Not built in", "Third-party tools (e.g. Litestream for streaming backups), or a server DB"],
      ["Older SQL gaps", "RIGHT / FULL OUTER JOIN only since 3.39 (2022)", "Check <code>sqlite3.sqlite_version</code> on the target platform"]
    ] } },
    { code: `import sqlite3

con = sqlite3.connect(":memory:")
con.executescript("""
CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders(id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id));
""")
print("foreign_keys =", con.execute("PRAGMA foreign_keys").fetchone()[0])
con.execute("INSERT INTO orders(user_id) VALUES (999)")        # no such user -- accepted!
print("orphan rows:", con.execute("SELECT count(*) FROM orders").fetchone()[0])

con.execute("PRAGMA foreign_keys = ON")       # silently IGNORED: a transaction is open
print("inside txn, foreign_keys =", con.execute("PRAGMA foreign_keys").fetchone()[0])
con.commit()
con.execute("PRAGMA foreign_keys = ON")       # per connection, outside a transaction
try:
    con.execute("INSERT INTO orders(user_id) VALUES (998)")
except sqlite3.IntegrityError as e:
    print("with FK on:", e)

con.execute("ALTER TABLE users ADD COLUMN email TEXT")         # fine
con.execute("ALTER TABLE users DROP COLUMN email")             # fine on SQLite >= 3.35
print([r[1] for r in con.execute("PRAGMA table_info(users)")])`, lang: "python", title: "The foreign-key gotcha" },
    { code: `foreign_keys = 0
orphan rows: 1
inside txn, foreign_keys = 0
with FK on: FOREIGN KEY constraint failed
['id', 'name']`, lang: "text", title: "Output — FKs are off by default, and the PRAGMA is a silent no-op inside a transaction" },
    { tip: "Frame it positively in an interview: 'SQLite was right for our single-server prototype; we enabled WAL and foreign keys, and planned the move to PostgreSQL once we needed multiple app servers.' That shows you know both the tool and its limits." },
    { warn: "Copying a live SQLite file with <code>cp</code> while it is being written can produce a corrupt backup. Use the backup API (<code>con.backup(dest)</code> in Python), <code>VACUUM INTO 'backup.db'</code>, or the <code>.backup</code> CLI command." }
  ]
},

    /* ───────────── CI/CD ───────────── */
    {
  id: "cicd-ci-vs-cd",
  q: "What is the difference between Continuous Integration, Continuous Delivery and Continuous Deployment?",
  topic: "CI/CD",
  level: 1,
  top: true,
  short: "Continuous Integration means developers merge small changes to the main branch frequently, and every push automatically builds and runs tests, so integration problems surface within minutes. Continuous Delivery extends that: every change that passes the pipeline produces a release-ready artifact deployed to staging, and going to production is a one-click manual decision. Continuous Deployment removes that manual step: every change that passes all automated checks goes to production automatically.",
  a: [
    { svg: `<svg viewBox="0 0 700 190" width="700" class="dg">
  <rect class="box" x="10" y="80" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="55" y="98" text-anchor="middle" dominant-baseline="middle">git push</text>
  <rect class="box-a" x="130" y="80" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="185" y="98" text-anchor="middle" dominant-baseline="middle">build + test</text>
  <rect class="box-a" x="270" y="80" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="325" y="98" text-anchor="middle" dominant-baseline="middle">artifact</text>
  <rect class="box-p" x="410" y="80" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="465" y="98" text-anchor="middle" dominant-baseline="middle">staging</text>
  <rect class="box-g" x="580" y="80" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="635" y="98" text-anchor="middle" dominant-baseline="middle">production</text>
  <line class="ln" x1="100" y1="98" x2="128" y2="98" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="240" y1="98" x2="268" y2="98" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="380" y1="98" x2="408" y2="98" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="520" y1="98" x2="578" y2="98" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="550" y="88" text-anchor="middle">gate</text>
  <line class="ln-d" x1="10" y1="30" x2="240" y2="30"/>
  <text class="tx-m" x="125" y="22" text-anchor="middle">Continuous Integration</text>
  <line class="ln-d" x1="10" y1="140" x2="520" y2="140"/>
  <text class="tx-m" x="265" y="158" text-anchor="middle">Continuous Delivery: automated up to staging, MANUAL approval to prod</text>
  <line class="ln-d" x1="10" y1="172" x2="690" y2="172"/>
  <text class="tx-m" x="350" y="186" text-anchor="middle">Continuous Deployment: fully automated to production</text>
</svg>`, caption: "Each practice extends the previous one; the difference between delivery and deployment is the production gate." },
    { table: { head: ["", "Continuous Integration", "Continuous Delivery", "Continuous Deployment"], rows: [
      ["Goal", "Main branch always builds and passes tests", "Main branch always releasable", "Every good change is released"],
      ["Automated", "Build, lint, unit/integration tests on every push/PR", "+ package artifact, deploy to staging, acceptance tests", "+ deploy to production, smoke tests, auto-rollback"],
      ["Human step", "Code review / merge", "Click 'approve' to release", "None (monitoring watches)"],
      ["Prerequisites", "Good automated tests, small commits", "Infrastructure as code, repeatable deploys", "Excellent test coverage, feature flags, monitoring, fast rollback"],
      ["Typical for", "Every team", "Most product teams, regulated apps", "Mature web teams (many deploys/day)"]
    ] } },
    { ul: [
      "<b>CI is a practice, not a tool</b>: merging to main at least daily with trunk-based or short-lived feature branches. A Jenkins server running tests on a branch nobody merges for 3 weeks is not CI.",
      "<b>'Fix the build first'</b>: a red main branch stops the line until it's green.",
      "Tools: GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines; CD tools such as Argo CD for Kubernetes."
    ] },
    { tip: "Basics of a pipeline are covered in core — <a href=\"#/core/se/ci-cd-pipeline\">CI/CD pipeline</a>. Answer with your own example: 'In my project every PR ran pytest and ESLint in GitHub Actions; merging to main deployed the backend to staging automatically, and production was a manual approval — that's continuous delivery.'" },
    { warn: "Don't use 'CD' without saying which one. Interviewers specifically check whether you know delivery (manual release decision) from deployment (automatic)." }
  ]
},
    {
  id: "cicd-github-actions",
  q: "How would you write a GitHub Actions workflow that tests a Python or Node.js project, and what do on, jobs, steps and uses mean?",
  topic: "CI/CD",
  level: 2,
  top: true,
  short: "A workflow is a YAML file in .github/workflows. 'on' lists the triggers, like push, pull_request, schedule or workflow_dispatch. 'jobs' run in parallel by default on fresh runners chosen with runs-on, and needs creates ordering. Each job has steps that either run shell commands with run or call reusable actions with uses, such as actions/checkout and actions/setup-python. A matrix runs the job on several versions, and dependency caching speeds it up.",
  a: [
    { code: [
      { lang: "yaml", src: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:                 # every PR targeting any branch
  workflow_dispatch:            # manual "Run workflow" button

permissions:
  contents: read                # least privilege for the GITHUB_TOKEN

concurrency:                    # cancel superseded runs on the same branch
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: pip            # cache ~/.cache/pip keyed on requirements files
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: ruff check .                       # lint
      - run: pytest --cov=app --cov-report=xml  # tests + coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-\${{ matrix.python-version }}
          path: coverage.xml

  docker:
    needs: test                 # runs only if all test jobs pass
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:\${{ github.sha }} .` },
      { lang: "yaml", src: `# .github/workflows/node-ci.yml
name: Node CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: npm            # caches ~/.npm keyed on package-lock.json
      - run: npm ci             # clean, lockfile-exact install
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build` }
    ], title: "Python and Node.js CI workflows" },
    { table: { head: ["Key", "Meaning"], rows: [
      ["<code>on</code>", "Events that trigger the workflow: <code>push</code>, <code>pull_request</code>, <code>schedule</code> (cron), <code>workflow_dispatch</code>, <code>release</code>…"],
      ["<code>jobs.&lt;id&gt;</code>", "Unit of work on one runner; jobs run <b>in parallel</b> unless linked with <code>needs</code>"],
      ["<code>runs-on</code>", "Runner image: <code>ubuntu-latest</code>, <code>windows-latest</code>, <code>macos-latest</code> or self-hosted"],
      ["<code>steps</code>", "Sequential; share the job's filesystem. <code>run</code> = shell command, <code>uses</code> = reusable action (repo@version)"],
      ["<code>with</code> / <code>env</code>", "Inputs to an action / environment variables"],
      ["<code>strategy.matrix</code>", "Fan out the job across versions/OSes"],
      ["<code>\${{ … }}</code>", "Expressions/contexts: <code>github.sha</code>, <code>matrix.*</code>, <code>secrets.*</code>"]
    ] } },
    { ul: [
      "Each job starts on a <b>fresh VM</b> — pass files between jobs with <code>upload-artifact</code>/<code>download-artifact</code>, not the filesystem.",
      "<code>npm ci</code> (not <code>npm install</code>) in CI: exact lockfile, fails if <code>package.json</code> and lock disagree.",
      "Protect <code>main</code> with branch protection: required status checks = this workflow must pass before merge.",
      "Pin third-party actions to a major version (or a commit SHA for stronger supply-chain safety); bump them when new majors ship."
    ] },
    { warn: "YAML indentation errors and tabs are the #1 cause of 'workflow not running'. Also, <code>on: push</code> without branch filters runs on every branch push <i>and</i> PR — doubling minutes; filter as above." },
    { tip: "Docker image building is covered in core — <a href=\"#/core/se/docker-basics\">Docker basics</a>. If asked 'how long did your pipeline take and how did you speed it up?', answer: caching dependencies, running lint/tests in parallel jobs, and cancelling superseded runs." }
  ]
},
    {
  id: "cicd-pipeline-stages",
  q: "What stages does a typical CI/CD pipeline have, and in what order?",
  topic: "CI/CD",
  level: 2,
  top: true,
  short: "A typical pipeline: checkout and install dependencies; fast static checks like lint, format and type check; unit tests; build and package the artifact, such as a Docker image tagged with the commit SHA; integration tests and security scans of dependencies, secrets and the image; push the artifact to a registry; deploy to staging and run smoke or end-to-end tests; then deploy to production via approval or automatically, followed by health checks and monitoring with rollback. Fast, cheap checks come first to fail fast.",
  a: [
    { svg: `<svg viewBox="0 0 700 120" width="700" class="dg">
  <rect class="box" x="5" y="40" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="45" y="60" text-anchor="middle" dominant-baseline="middle">install</text>
  <rect class="box" x="100" y="40" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="140" y="60" text-anchor="middle" dominant-baseline="middle">lint/type</text>
  <rect class="box" x="195" y="40" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="235" y="60" text-anchor="middle" dominant-baseline="middle">unit tests</text>
  <rect class="box-a" x="290" y="40" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="330" y="60" text-anchor="middle" dominant-baseline="middle">build</text>
  <rect class="box-a" x="385" y="40" width="90" height="40" rx="6"/>
  <text class="tx tx-b" x="430" y="60" text-anchor="middle" dominant-baseline="middle">integ+scan</text>
  <rect class="box-p" x="490" y="40" width="90" height="40" rx="6"/>
  <text class="tx tx-b" x="535" y="60" text-anchor="middle" dominant-baseline="middle">staging</text>
  <rect class="box-g" x="595" y="40" width="100" height="40" rx="6"/>
  <text class="tx tx-b" x="645" y="60" text-anchor="middle" dominant-baseline="middle">production</text>
  <line class="ln" x1="85" y1="60" x2="98" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="180" y1="60" x2="193" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="275" y1="60" x2="288" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="370" y1="60" x2="383" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="475" y1="60" x2="488" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="580" y1="60" x2="593" y2="60" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="140" y="25" text-anchor="middle">seconds — fail fast</text>
  <text class="tx-m" x="430" y="25" text-anchor="middle">minutes</text>
  <text class="tx-m" x="590" y="105" text-anchor="middle">same artifact promoted, never rebuilt</text>
</svg>`, caption: "Cheap checks first; build the artifact once and promote it through environments." },
    { table: { head: ["Stage", "What runs", "Fails when"], rows: [
      ["Install", "<code>pip install</code> / <code>npm ci</code> from lockfiles (cached)", "Dependency conflict"],
      ["Static checks", "Linters (ruff, ESLint), formatter check, type check (mypy, tsc)", "Style/type errors"],
      ["Unit tests", "pytest / Jest / JUnit with coverage threshold", "Logic bugs, coverage drop"],
      ["Build", "Compile/bundle, Docker image tagged with the commit SHA", "Build errors"],
      ["Integration tests", "Tests against real Postgres/Redis (service containers)", "Contract/DB issues"],
      ["Security", "Dependency audit (pip-audit, npm audit, Dependabot), secret scanning, image scan", "Known CVEs, leaked keys"],
      ["Publish", "Push image to a registry (GHCR, ECR, Docker Hub)", "Auth/registry errors"],
      ["Deploy staging", "Run DB migrations, deploy, smoke/E2E tests (Playwright)", "Broken flows"],
      ["Deploy prod", "Approval gate or automatic; blue-green/canary; health checks", "Health check failures → rollback"]
    ] } },
    { ul: [
      "<b>Fail fast</b>: a lint error should fail in 20 seconds, not after a 10-minute build.",
      "<b>Build once, deploy many</b>: the exact image that passed tests goes to staging then prod; only configuration differs by environment.",
      "<b>Everything as code</b>: pipeline YAML, Dockerfile and infrastructure (Terraform) are versioned with the app.",
      "<b>Database migrations</b> must be backward-compatible (expand → migrate → contract) so old and new versions can run side by side during rollout."
    ] },
    { tip: "Testing levels (unit, integration, system, acceptance) are core theory — <a href=\"#/core/se/testing-levels\">testing levels</a>. Mention the test pyramid: many fast unit tests, fewer integration tests, a handful of E2E tests." },
    { warn: "A pipeline that passes with flaky tests retried until green trains the team to ignore failures. Quarantine and fix flaky tests instead of adding blanket retries." }
  ]
},
    {
  id: "cicd-secrets",
  q: "How do you manage secrets (API keys, passwords) in a CI/CD pipeline?",
  topic: "CI/CD",
  level: 2,
  top: false,
  short: "Never commit secrets to the repo. Store them in the CI platform's encrypted secret store — GitHub Actions repository, environment or organisation secrets — and expose them only to the steps that need them as environment variables; the platform masks them in logs. Prefer short-lived credentials via OIDC federation to the cloud instead of long-lived keys, scope per environment with approval for production, rotate regularly, and run secret scanning to catch leaks.",
  a: [
    { code: `jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production          # environment secrets + required reviewers
    permissions:
      id-token: write                # allow requesting an OIDC token
      contents: read
    steps:
      - uses: actions/checkout@v4
      # Short-lived cloud credentials via OIDC -- no AWS keys stored in GitHub
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deploy
          aws-region: ap-south-1
      - name: Run migrations
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}     # only this step sees it
        run: python manage.py migrate
      - name: Smoke test
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
        run: pytest tests/smoke -q`, lang: "yaml", title: "Secrets scoped to steps, OIDC instead of static cloud keys" },
    { table: { head: ["Practice", "Why"], rows: [
      ["Encrypted secret store (repo / environment / org secrets, Vault, cloud secret managers)", "Secrets never live in Git history"],
      ["Environment-scoped secrets + required reviewers", "Prod credentials only available to approved prod deploys"],
      ["OIDC federation (GitHub → AWS/GCP/Azure)", "Short-lived tokens; nothing long-lived to leak or rotate"],
      ["Step-level <code>env</code>, least-privilege <code>permissions</code>", "Smaller blast radius if a step or action is compromised"],
      ["Secret scanning / push protection, pre-commit hooks", "Catch keys before or right after they are pushed"],
      ["Rotation and revocation plan", "A leaked key is revoked first, then removed from history"]
    ] } },
    { ul: [
      "Secrets are <b>masked</b> in logs, but transformed values (base64, substrings) are not — don't print them at all.",
      "Workflows triggered by <code>pull_request</code> from <b>forks</b> don't receive secrets — by design, so strangers can't exfiltrate them with a PR. Be very careful with <code>pull_request_target</code>, which does have secrets.",
      "At runtime the app reads secrets from environment variables or a secret manager — never bake them into the Docker image (<code>ENV API_KEY=...</code> is visible in image layers)."
    ] },
    { warn: "If a key is committed, deleting it in the next commit is not enough — it's in Git history and probably already scraped by bots within minutes. <b>Revoke/rotate first</b>, then clean history." },
    { tip: "Mention the twelve-factor rule: config (including secrets) comes from the environment, so the same artifact runs in every environment with different config." }
  ]
},
    {
  id: "cicd-blue-green-canary",
  q: "Explain blue-green and canary deployments. How do they compare with rolling deployments, and how do you roll back?",
  topic: "CI/CD",
  level: 2,
  top: true,
  short: "Blue-green runs two identical production environments: blue is live, the new version is deployed to green and tested, then the router or load balancer switches all traffic at once, and rollback is switching back. Canary releases the new version to a small slice of traffic, say five percent, watches error rates and latency, and increases gradually, rolling back automatically if metrics degrade. Rolling deployment replaces instances a few at a time with no extra environment. Feature flags decouple deploying code from releasing features.",
  a: [
    { table: { head: ["Strategy", "How", "Rollback", "Cost / risk"], rows: [
      ["Recreate", "Stop old, start new", "Redeploy old", "Downtime; simplest"],
      ["Rolling", "Replace instances in batches (Kubernetes default)", "Roll back batch by batch (slower)", "No extra infra; old + new versions run together during rollout"],
      ["Blue-green", "Deploy full new env (green), switch traffic from blue in one step", "Instant: switch back to blue", "2× infrastructure during release; all users switch at once"],
      ["Canary", "Route 1–5% → 25% → 100% to the new version while watching metrics", "Shift traffic back; affects only the canary slice", "Needs good metrics and traffic splitting; slowest rollout"],
      ["Feature flags", "Code deployed dark; enable per user/percentage at runtime", "Turn the flag off (no deploy)", "Flag debt; logic complexity"]
    ] } },
    { svg: `<svg viewBox="0 0 640 200" width="640" class="dg">
  <text class="tx-m" x="10" y="18">Blue-green</text>
  <rect class="box-a" x="10" y="30" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="55" y="48" text-anchor="middle" dominant-baseline="middle">Router</text>
  <rect class="box" x="170" y="25" width="110" height="22" rx="4"/>
  <text class="tx" x="225" y="36" text-anchor="middle" dominant-baseline="middle">blue v1 (idle)</text>
  <rect class="box-g" x="170" y="52" width="110" height="22" rx="4"/>
  <text class="tx" x="225" y="63" text-anchor="middle" dominant-baseline="middle">green v2 (live)</text>
  <line class="ln-d" x1="100" y1="44" x2="168" y2="36"/>
  <line class="ln-a" x1="100" y1="52" x2="168" y2="63" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="135" y="90" text-anchor="middle">100% switched at once</text>
  <text class="tx-m" x="340" y="18">Canary</text>
  <rect class="box-a" x="340" y="30" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="385" y="48" text-anchor="middle" dominant-baseline="middle">Router</text>
  <rect class="box" x="500" y="25" width="120" height="22" rx="4"/>
  <text class="tx" x="560" y="36" text-anchor="middle" dominant-baseline="middle">v1 — 95%</text>
  <rect class="box-p" x="500" y="52" width="120" height="22" rx="4"/>
  <text class="tx" x="560" y="63" text-anchor="middle" dominant-baseline="middle">v2 — 5%</text>
  <line class="ln" x1="430" y1="44" x2="498" y2="36" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="430" y1="52" x2="498" y2="63" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="480" y="90" text-anchor="middle">5% → 25% → 100% if metrics OK</text>
  <rect class="box-w" x="10" y="120" width="620" height="60" rx="6"/>
  <text class="tx tx-b" x="320" y="142" text-anchor="middle">Watch during rollout: error rate, p95/p99 latency, saturation, business KPIs</text>
  <text class="tx-s" x="320" y="164" text-anchor="middle">automated analysis promotes or rolls back</text>
</svg>`, caption: "Blue-green swaps everything at once with instant rollback; canary limits the blast radius and decides from metrics." },
    { h: "Rollback and the hard part: data" },
    { ul: [
      "Stateless app code is easy to roll back; <b>database schema changes</b> aren't. Use expand/contract migrations: add new columns first (both versions work), migrate data, remove old columns in a later release.",
      "Blue-green with a shared database means both versions must work with the same schema at the switch moment.",
      "Long-lived connections (websockets) and sessions must drain from the old environment — keep sessions in Redis, not in instance memory.",
      "Automate: health checks + metric thresholds trigger rollback without a human (Argo Rollouts, Flagger, cloud load balancers' weighted routing)."
    ] },
    { tip: "Supporting theory: <a href=\"#/core/sd/load-balancer\">load balancers</a> do the traffic split, <a href=\"#/core/sd/health-checks\">health checks</a> gate promotion, and <a href=\"#/core/sd/monitoring-logging-metrics\">monitoring</a> decides canary success." },
    { warn: "A canary is only as good as its metrics. With 5% of very low traffic you may see no errors simply because no one hit the broken path — define success criteria and minimum sample size before you start." }
  ]
},

    /* ───────────── Agile ───────────── */
    {
  id: "agile-scrum-roles-ceremonies",
  q: "What are Agile and Scrum, and what are the Scrum roles, events and artifacts?",
  topic: "Agile",
  level: 1,
  top: true,
  short: "Agile is a set of values from the 2001 Manifesto: individuals and interactions, working software, customer collaboration and responding to change, delivered in short iterations with frequent feedback. Scrum is the most popular Agile framework. It has three accountabilities — Product Owner, Scrum Master and Developers — five events — the Sprint, Sprint Planning, Daily Scrum, Sprint Review and Retrospective — and three artifacts: Product Backlog, Sprint Backlog and the Increment, each with a commitment: Product Goal, Sprint Goal and Definition of Done.",
  a: [
    { p: "<b>Agile</b> is a mindset (4 values, 12 principles); <b>Scrum</b>, <b>Kanban</b> and XP are concrete frameworks. The theory is in core — <a href=\"#/core/se/scrum-roles-ceremonies\">Scrum roles & ceremonies</a> and <a href=\"#/core/se/sdlc-models-compare\">SDLC models</a>. Here is the practical, one-table version the interviewer expects you to rattle off (per the 2020 Scrum Guide)." },
    { table: { head: ["Element", "Who / what", "Purpose", "Timebox (2-week sprint)"], rows: [
      ["<b>Product Owner</b>", "One person", "Owns and orders the Product Backlog; maximises value; decides <i>what</i>", "—"],
      ["<b>Scrum Master</b>", "Servant-leader / coach", "Removes impediments, protects the team, coaches Scrum; not a project manager", "—"],
      ["<b>Developers</b>", "Everyone building the increment (dev, QA, design)", "Decide <i>how</i>; self-managing; own the Sprint Backlog", "—"],
      ["Sprint Planning", "Whole team", "Pick a Sprint Goal and backlog items; plan the work", "≤ 4 h"],
      ["Daily Scrum", "Developers", "Inspect progress towards the goal, adapt the plan", "15 min"],
      ["Sprint Review", "Team + stakeholders", "Demo the increment, gather feedback, update the backlog", "≤ 2 h"],
      ["Retrospective", "Scrum team", "Improve how the team works (process, tools, people)", "≤ 1.5 h"],
      ["Backlog refinement", "PO + Developers", "Ongoing activity (not a formal event): split, clarify, estimate upcoming items", "~10% of capacity"]
    ] } },
    { table: { head: ["Artifact", "Commitment", "Meaning"], rows: [
      ["Product Backlog", "Product Goal", "Ordered list of everything that might be built"],
      ["Sprint Backlog", "Sprint Goal", "Items selected for this sprint + the plan to deliver them"],
      ["Increment", "Definition of Done", "A usable, potentially releasable piece of product that meets the DoD"]
    ] } },
    { ul: [
      "The 2020 guide replaced the 'Development Team' role with <b>Developers</b> and speaks of accountabilities rather than roles.",
      "Daily Scrum is about the <b>Sprint Goal</b>, not a status report to a manager. The three questions (yesterday / today / blockers) are optional.",
      "Retrospective output should be one or two concrete actions that go into the next sprint."
    ] },
    { tip: "In a fresher interview, connect it to experience: 'In our final-year project the faculty guide acted as Product Owner, I was Scrum Master, and we ran 2-week sprints with a Trello board.' Concrete beats textbook." },
    { warn: "Common mix-ups: the Scrum Master is not the team's boss; the Product Owner is one person, not a committee; and the Sprint Review is not just a demo — it's a feedback session that changes the backlog." }
  ]
},
    {
  id: "agile-user-stories",
  q: "What is a user story, and how do you write good acceptance criteria?",
  topic: "Agile",
  level: 1,
  top: true,
  short: "A user story is a short description of a feature from the user's perspective: As a role, I want a capability, so that I get a benefit. It is a placeholder for a conversation, not a full spec. Good stories follow INVEST: Independent, Negotiable, Valuable, Estimable, Small and Testable. Acceptance criteria are the specific, testable conditions the story must meet to be accepted, often written as Given, When, Then scenarios that can become automated tests; they differ from the Definition of Done, which applies to every story.",
  a: [
    { code: `Title: Reset password via email

As a registered student,
I want to reset my password using my email,
so that I can get back into my account without contacting support.

Acceptance criteria
  Scenario 1: valid email
    Given I am on the "Forgot password" page
    And "asha@college.edu" belongs to an account
    When I submit "asha@college.edu"
    Then I see "If this email is registered, a reset link has been sent"
    And a reset link valid for 30 minutes is emailed to that address

  Scenario 2: unknown email (no account enumeration)
    Given no account uses "x@y.com"
    When I submit "x@y.com"
    Then I see the same message as in Scenario 1
    And no email is sent

  Scenario 3: expired link
    Given my reset link is older than 30 minutes
    When I open it
    Then I see "Link expired" and can request a new one

Estimate: 3 points    Priority: High    Depends on: email service set up`, lang: "text", title: "A story card with Given/When/Then acceptance criteria" },
    { table: { head: ["INVEST", "Meaning", "Smell if violated"], rows: [
      ["Independent", "Can be built and released on its own", "'Can't start until story 14 and 15 are done'"],
      ["Negotiable", "Details agreed in conversation, not a contract", "Story is a 10-page spec"],
      ["Valuable", "Delivers value to a user or the business", "'Create database tables' as a story"],
      ["Estimable", "Team understands it enough to size it", "Nobody can estimate → needs a spike"],
      ["Small", "Fits comfortably in one sprint (ideally a few days)", "13+ points → split it"],
      ["Testable", "Clear pass/fail criteria", "'Page should be fast'"]
    ] } },
    { table: { head: ["", "Acceptance criteria", "Definition of Done"], rows: [
      ["Scope", "Specific to one story", "Applies to every story"],
      ["Example", "'Reset link expires after 30 minutes'", "'Code reviewed, unit tests pass, deployed to staging, docs updated'"],
      ["Owned by", "Product Owner (with team)", "Whole Scrum team"]
    ] } },
    { ul: [
      "Splitting big stories (epics): by workflow step, by user role, by happy path vs edge cases, by data type — keep each slice end-to-end (vertical slice through UI, API and DB).",
      "Non-functional needs (performance, security) become acceptance criteria or part of the DoD, e.g. 'responds within 300 ms for 95% of requests'.",
      "Given/When/Then scenarios map directly to BDD tests (<a href=\"#/core/se/tdd-bdd\">core: TDD & BDD</a>)."
    ] },
    { warn: "A story written from the developer's view ('As a developer I want a REST endpoint…') hides the user value. Technical work belongs as tasks under a user-facing story, or as an explicit enabler/tech-debt item." }
  ]
},
    {
  id: "agile-estimation-story-points",
  q: "What are story points and how does a team estimate work in Agile? Why not estimate in hours?",
  topic: "Agile",
  level: 2,
  top: true,
  short: "Story points are a relative measure of the effort, complexity and uncertainty of a story compared with a reference story, usually on a Fibonacci-like scale of 1, 2, 3, 5, 8 and 13. Teams estimate together, often with Planning Poker: everyone reveals a card at once, the highest and lowest explain, and the team re-votes. Velocity, the points completed per sprint averaged over a few sprints, is used to plan capacity. Relative sizing is faster and more consistent than hours, which vary by person and hide uncertainty.",
  a: [
    { p: "People are bad at absolute estimates ('this will take 13 hours') but good at relative ones ('this is about twice as big as the login story'). Story points exploit that." },
    { ol: [
      "Pick a <b>reference story</b> everyone understands and call it 2 or 3 points.",
      "For each story, the PO explains it and answers questions.",
      "<b>Planning Poker</b>: everyone picks a card (1, 2, 3, 5, 8, 13, 21, ?, ☕) privately and reveals simultaneously — avoids anchoring on the senior's number.",
      "Highest and lowest voters explain their reasoning (often someone knows a hidden complexity or a shortcut).",
      "Re-vote until the team converges; anything ≥ 13 is usually split."
    ] },
    { code: `def plan_sprint(backlog, velocities):
    """Fill a sprint up to the team's average velocity (points per sprint)."""
    capacity = round(sum(velocities[-3:]) / 3)      # rolling average of the last 3 sprints
    chosen, total = [], 0
    for story, points in backlog:                   # backlog is already ordered by the PO
        if total + points > capacity:
            break                                   # stop at the first item that doesn't fit
        chosen.append(story); total += points
    return capacity, chosen, total

velocities = [18, 24, 21, 22]                       # completed points in past sprints
backlog = [("Reset password", 3), ("Search questions", 8), ("Bookmark", 2),
           ("Progress dashboard", 8), ("Dark mode", 3)]
cap, chosen, total = plan_sprint(backlog, velocities)
print(f"capacity ~{cap} pts -> commit {total} pts: {chosen}")`, lang: "python", title: "Velocity-based sprint planning (a forecast, not a promise)" },
    { code: `capacity ~22 pts -> commit 21 pts: ['Reset password', 'Search questions', 'Bookmark', 'Progress dashboard']`, lang: "text", title: "Output" },
    { table: { head: ["", "Story points", "Hours"], rows: [
      ["Measures", "Relative size: effort + complexity + uncertainty", "Duration for a specific person"],
      ["Consistency", "Stable across team members", "Varies with who picks it up"],
      ["Uncertainty", "Fibonacci gaps express it (no '6 vs 7' debates)", "False precision"],
      ["Planning", "Velocity converts to capacity empirically", "Assumes perfect focus time"]
    ] } },
    { warn: "Velocity is a team's planning tool, not a productivity metric. Comparing velocity between teams, or pushing a team to 'increase velocity', just inflates the points (Goodhart's law)." },
    { tip: "Know the alternatives: T-shirt sizes (S/M/L/XL) for rough roadmap estimates, and #NoEstimates / Kanban teams that just count items and measure cycle time." }
  ]
},
    {
  id: "agile-kanban-vs-scrum",
  q: "What is the difference between Kanban and Scrum, and when would you use each?",
  topic: "Agile",
  level: 1,
  top: true,
  short: "Scrum works in fixed-length sprints with defined roles, events and a sprint commitment; change normally waits for the next sprint, and progress is measured by velocity. Kanban is a continuous-flow method: work items move across a visual board, work-in-progress limits per column prevent overload, there are no mandatory roles or sprints, new items can start whenever capacity frees up, and success is measured by cycle time and throughput. Use Scrum for product feature development; Kanban for support, ops and maintenance with unpredictable incoming work.",
  a: [
    { table: { head: ["", "Scrum", "Kanban"], rows: [
      ["Cadence", "Fixed sprints (1–4 weeks)", "Continuous flow"],
      ["Roles", "Product Owner, Scrum Master, Developers", "None required (keep existing roles)"],
      ["Commitment", "Sprint Goal + Sprint Backlog", "WIP limits per column"],
      ["Changes mid-way", "Discouraged; goes to the next sprint", "Anytime — reorder the queue"],
      ["Board", "Reset each sprint", "Persistent"],
      ["Metrics", "Velocity, burndown chart", "Cycle time, lead time, throughput, cumulative flow diagram"],
      ["Best for", "New product features, teams that benefit from rhythm", "Support tickets, bug fixing, ops/DevOps, maintenance"]
    ] } },
    { code: `| Backlog (∞) | To do (5) | In progress (3) | Review (2) | Done |
|-------------|-----------|-----------------|------------|------|
| Dark mode   | Bookmark  | Search API      | Login fix  | ...  |
| Export PDF  | Filters   | Reset password  |            |      |
|             |           | Dashboard       |            |      |

In progress is at its WIP limit (3): nobody starts new work —
they help finish 'Review' items first. "Stop starting, start finishing."`, lang: "text", title: "A Kanban board with WIP limits in brackets" },
    { ul: [
      "<b>WIP limits</b> are the core of Kanban: they expose bottlenecks (if Review is always full, reviewing is the constraint) and reduce context switching.",
      "<b>Lead time</b> = request → done (what the customer feels); <b>cycle time</b> = started → done (what the team controls).",
      "<b>Scrumban</b>: many teams run sprints with Scrum events plus a Kanban board with WIP limits."
    ] },
    { tip: "Theory recap in core: <a href=\"#/core/se/kanban\">Kanban</a>. A good real-world answer: 'Feature work ran in 2-week Scrum sprints, but production bugs went to a Kanban lane with a WIP limit of 2 so they didn't wreck the sprint.'" },
    { warn: "Kanban is not 'Scrum without meetings'. Without explicit WIP limits and flow metrics it's just a to-do list on a board." }
  ]
},
    {
  id: "agile-project-experience",
  q: "How did you work in Agile on your project, and what happened in a typical sprint?",
  topic: "Agile",
  level: 1,
  top: true,
  short: "Structure it as a story: the team and roles, the sprint length and tools, then what happened from planning to retro. For example: four developers, a mentor as Product Owner, two-week sprints on Jira or GitHub Projects; we planned on day one with a sprint goal and estimated stories, held fifteen-minute standups, worked on feature branches with pull-request reviews and CI, demoed at the review and agreed one improvement at the retro. End with a concrete problem you hit and how the process helped.",
  a: [
    { p: "This is a behavioural question wearing a technical label. The interviewer checks that you actually worked iteratively — and that you can talk about collaboration, not just ceremonies. Use <b>STAR</b> (Situation, Task, Action, Result) for the 'problem' part." },
    { table: { head: ["When", "What we did (example 2-week sprint)"], rows: [
      ["Day 1 — Planning", "PO (our mentor) presented top backlog items; we agreed a sprint goal ('students can bookmark and revise questions'), estimated with planning poker, committed ~20 points"],
      ["Daily — Standup", "15 minutes on Discord/Meet: progress towards the goal, blockers; detailed discussions taken offline"],
      ["During the sprint", "Each story on a feature branch → PR with at least one review → GitHub Actions ran tests → merge to main → auto-deploy to staging"],
      ["Mid-sprint", "Backlog refinement for the next sprint: split a 13-point 'analytics dashboard' story into three"],
      ["Last day — Review", "Demoed the working increment on staging to the mentor and a few users; feedback went into the backlog"],
      ["Last day — Retro", "What went well / what didn't / one action, e.g. 'PRs waited 2 days for review → reviews within 24 h, max 2 open PRs per person'"]
    ] } },
    { code: `S: Final-year project, 4 developers, mentor as Product Owner, 2-week sprints.
T: Sprint 3 goal was "users can search questions", but the search story kept slipping.
A: At standup on day 4 I flagged it as blocked on the DB schema. We split the story:
   basic keyword search this sprint, filters next sprint. I paired with a teammate on
   the schema, and we added an index and an API test before building the UI.
R: Basic search shipped and was demoed at the review; in the retro we agreed to
   spike unclear stories during refinement, and later sprints met their goals.`, lang: "text", title: "Answer skeleton (STAR) — replace with your real project" },
    { ul: [
      "Name the <b>tools</b>: Jira / Trello / GitHub Projects for the board, GitHub for PRs and CI, Slack/Discord for communication.",
      "Mention <b>Definition of Done</b>: 'reviewed, tested, merged, deployed to staging'.",
      "Show <b>adaptation</b>: what changed because of a review or retro — that is the point of Agile.",
      "If your team was informal, say so honestly and describe which practices you used — don't invent ceremonies."
    ] },
    { tip: "Link back to engineering practices: feature-branch workflow (<a href=\"#/core/se/feature-branch-workflow\">core</a>), code review (<a href=\"#/core/se/code-review\">core</a>) and CI. Interviewers love hearing that Agile ceremonies were backed by real automation." },
    { warn: "Red flags: blaming teammates, 'the Scrum Master assigned me tasks' (Developers pull work), or describing a sprint where nothing was demoed. Keep the story about the team delivering and improving." }
  ]
},

    /* ───────────── TensorFlow ───────────── */
    {
    id: "tf-vs-pytorch",
    q: "TensorFlow vs PyTorch — what is the difference between eager and graph execution, and what does tf.function do?",
    topic: "TensorFlow",
    level: 2,
    top: true,
    short: "Both are deep learning frameworks with autograd and GPU support. PyTorch runs eagerly, line by line like NumPy, and can optionally compile with torch.compile. TensorFlow 2 is also eager by default, but tf.function traces your Python function into a static graph that TensorFlow can optimise, run without the Python interpreter and export as a SavedModel. The catch is tracing: Python side effects run only once, and new input shapes or Python values cause retracing.",
    a: [
      { p: "<b>Eager execution</b>: every op runs immediately and returns a concrete value — easy to debug with <code>print</code> and a debugger. <b>Graph execution</b>: the computation is first recorded as a dataflow graph, then the runtime optimises it (op fusion, constant folding, parallel scheduling) and runs it without going back to Python. TF 1.x was graph-only (<code>Session.run</code>); TF 2.x is eager by default and you opt into graphs with <code>@tf.function</code>." },
      { code: `import os, sys
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf

# Eager (default in TF 2.x): ops run immediately, like NumPy / PyTorch
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
print(tf.matmul(x, x).numpy())

@tf.function                      # traced into a graph on the first call
def f(a):
    print("tracing with", a.shape, flush=True)            # Python side effect: ONLY while tracing
    tf.print("running with", a, output_stream=sys.stdout)  # graph op: runs on EVERY call
    return a * 2 + 1

f(tf.constant([1.0, 2.0]))        # traces + runs
f(tf.constant([5.0, 6.0]))        # same shape/dtype -> reuses the graph
f(tf.constant([1.0, 2.0, 3.0]))   # new shape -> retrace
print("concrete graphs:", f.experimental_get_tracing_count())
# [[ 7. 10.]
#  [15. 22.]]
# tracing with (2,)
# running with [1 2]
# running with [5 6]
# tracing with (3,)
# running with [1 2 3]
# concrete graphs: 2`, lang: "python", title: "tf.function traces once per input signature" },
      { table: { head: ["Aspect", "TensorFlow 2.x (+ Keras)", "PyTorch"], rows: [
        ["Default mode", "Eager; graphs via <code>@tf.function</code> (AutoGraph converts Python <code>if</code>/<code>for</code> to graph ops)", "Eager; graphs via <code>torch.compile</code> (PyTorch 2.0+)"],
        ["High-level API", "Keras: <code>compile()</code> / <code>fit()</code> built in", "Write your own training loop (or Lightning)"],
        ["Deployment", "SavedModel → TF Serving, TF Lite / LiteRT (mobile), TF.js (browser)", "TorchScript / <code>torch.export</code>, ONNX, TorchServe, ExecuTorch (mobile)"],
        ["Ecosystem", "Strong in production pipelines (TFX), Google Cloud/TPU, mobile", "Dominant in research and Hugging Face models"],
        ["Debugging", "Easy in eager; harder inside traced graphs", "Easy — plain Python"]
      ] } },
      { p: "Keras 3 (default <code>tf.keras</code> since TF 2.16) is <b>multi-backend</b>: the same Keras model can run on TensorFlow, JAX or PyTorch. So 'TF vs PyTorch' is less of a lock-in than it was." },
      { warn: "Classic tf.function traps: (1) a Python <code>print</code> or list append runs only during tracing; use <code>tf.print</code>. (2) Passing Python numbers (<code>f(3)</code>, <code>f(4)</code>) retraces for every new value — pass tensors, or fix the shapes with <code>input_signature=[tf.TensorSpec([None], tf.float32)]</code>. (3) Creating <code>tf.Variable</code>s inside the function on every call raises an error — create them once outside." },
      { tip: "Good answer to 'which would you pick?': PyTorch for research/fine-tuning Hugging Face models; TensorFlow/Keras when the target is TF Serving, TF Lite on Android, or an existing TFX pipeline. Then say you know the shared concepts — tensors, autograd, optimisers — so switching is cheap. Theory refresher: <a href=\"#/core/ai/pytorch-training-loop\">the PyTorch training loop</a>." }
    ]
  },
    {
    id: "tf-keras-model-apis",
    q: "What are the three ways to build a Keras model — Sequential, Functional and subclassing — and when do you use each?",
    topic: "TensorFlow",
    level: 2,
    top: true,
    short: "Sequential is a plain stack of layers with one input and one output, the quickest for simple MLPs and CNNs. The Functional API treats layers as functions on symbolic tensors, so you can build graphs with multiple inputs or outputs, shared layers and skip connections, and Keras can still inspect, plot and save it. Subclassing keras.Model means writing call() yourself, giving full Python control flow for research models, at the cost of less static checking and harder serialization.",
    a: [
      { code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import keras
from keras import layers

# 1) Sequential: a plain stack, one input -> one output
seq = keras.Sequential([
    keras.Input(shape=(10,)),
    layers.Dense(32, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])

# 2) Functional: a graph of layers -> multiple inputs, branches, skip connections
text_feats = keras.Input(shape=(10,), name="text")
meta_feats = keras.Input(shape=(3,), name="meta")
h = layers.Dense(32, activation="relu")(text_feats)
h = layers.concatenate([h, meta_feats])           # merge two branches
out = layers.Dense(1, activation="sigmoid", name="label")(h)
func = keras.Model(inputs=[text_feats, meta_feats], outputs=out)

# 3) Subclassing: you write call() -> full Python control flow
class ResidualMLP(keras.Model):
    def __init__(self):
        super().__init__()
        self.d1 = layers.Dense(10, activation="relu")
        self.drop = layers.Dropout(0.2)
        self.out = layers.Dense(1, activation="sigmoid")
    def call(self, x, training=False):
        h = self.drop(self.d1(x), training=training)
        return self.out(x + h)                     # skip connection

sub = ResidualMLP()
_ = sub(keras.ops.zeros((1, 10)))                 # weights are created on the first call

for name, m in [("Sequential", seq), ("Functional", func), ("Subclassed", sub)]:
    print(f"{name:<11} params={m.count_params()}")
print([t.name for t in func.inputs])
# Sequential  params=385
# Functional  params=388
# Subclassed  params=121
# ['text', 'meta']`, lang: "python", title: "Same idea, three APIs" },
      { table: { head: ["", "Sequential", "Functional", "Subclassing"], rows: [
        ["Topology", "Linear stack only", "Any DAG: multi-input/output, shared layers, residuals", "Anything, incl. dynamic Python logic per call"],
        ["<code>summary()</code> / <code>plot_model</code>", "Yes", "Yes — full graph known up front", "Limited (graph is defined by running code)"],
        ["Shape errors caught", "At build time", "At build time", "Only when <code>call()</code> runs"],
        ["Saving to .keras", "Automatic", "Automatic", "Needs <code>get_config()</code> + <code>@keras.saving.register_keras_serializable()</code>"],
        ["Typical use", "MLP, simple CNN", "Most production models, multi-modal inputs", "Research models, custom training behaviour"]
      ] } },
      { p: "You can mix them: a subclassed custom <i>layer</i> (override <code>build()</code> and <code>call()</code>) used inside a Functional model is a common, clean pattern." },
      { warn: "Inside a subclassed model, pass the <code>training</code> flag through to Dropout/BatchNorm. If you forget, dropout may be active during inference (or never active), and your validation scores will not match production. Why dropout behaves differently in training: <a href=\"#/core/ai/dropout-and-dl-regularization\">dropout and regularisation</a>." },
      { tip: "Default answer: 'Functional unless I have a reason not to' — you get flexibility plus static checks and painless saving." }
    ]
  },
    {
    id: "tf-compile-fit-callbacks",
    q: "Walk through compile(), fit() and evaluate() in Keras — and how do callbacks like EarlyStopping and ModelCheckpoint work?",
    topic: "TensorFlow",
    level: 1,
    top: true,
    short: "compile() configures training: the optimizer, the loss and the metrics; nothing is trained yet. fit() runs the training loop over epochs and batches, doing forward pass, loss, backpropagation and an optimizer step, and returns a History of losses and metrics. evaluate() reports loss and metrics on held-out data and predict() returns raw outputs. Callbacks are hooks run at epoch or batch boundaries: EarlyStopping stops when validation loss stops improving, ModelCheckpoint saves the best model.",
    a: [
      { code: `import os, tempfile
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
import keras
from keras import layers

keras.utils.set_random_seed(42)
X = np.random.rand(1000, 4).astype("float32")
y = (X.sum(axis=1) > 2).astype("float32")
X_test, y_test = X[800:], y[800:]
X_train, y_train = X[:800], y[:800]

model = keras.Sequential([
    keras.Input(shape=(4,)),
    layers.Dense(16, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
# compile = choose optimizer + loss + metrics (no training happens here)
model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.01),
              loss="binary_crossentropy", metrics=["accuracy"])

ckpt_path = os.path.join(tempfile.mkdtemp(), "best.keras")
callbacks = [
    keras.callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
    keras.callbacks.ModelCheckpoint(ckpt_path, monitor="val_loss", save_best_only=True),
    keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2),
]
# fit = the training loop: epochs x batches, forward + loss + backprop + optimizer step
hist = model.fit(X_train, y_train, validation_split=0.2, epochs=200, batch_size=32,
                 callbacks=callbacks, verbose=0)
print("epochs run:", len(hist.history["loss"]), "of 200")
print("history keys:", sorted(hist.history))

# evaluate = loss + metrics on held-out data; predict = raw outputs
loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"test accuracy: {acc:.2f}")
best = keras.models.load_model(ckpt_path)
print("checkpoint test acc:", round(best.evaluate(X_test, y_test, verbose=0)[1], 2))
print(model.predict(X_test[:3], verbose=0).round(2).ravel())
# epochs run: 111 of 200
# history keys: ['accuracy', 'learning_rate', 'loss', 'val_accuracy', 'val_loss']
# test accuracy: 1.00
# checkpoint test acc: 1.0
# [0.94 1.   0.03]`, lang: "python", title: "Binary classifier with the three most-used callbacks" },
      { table: { head: ["Callback", "What it does", "Key arguments"], rows: [
        ["<code>EarlyStopping</code>", "Stops training when the monitored metric stops improving", "<code>monitor</code>, <code>patience</code>, <code>restore_best_weights</code>"],
        ["<code>ModelCheckpoint</code>", "Saves the model (or weights) during training", "<code>filepath</code>, <code>save_best_only</code>, <code>save_weights_only</code>"],
        ["<code>ReduceLROnPlateau</code>", "Lowers the learning rate when progress stalls", "<code>factor</code>, <code>patience</code>, <code>min_lr</code>"],
        ["<code>TensorBoard</code>", "Logs curves, histograms and graphs for TensorBoard", "<code>log_dir</code>"],
        ["Custom <code>keras.callbacks.Callback</code>", "Your code in <code>on_epoch_end</code>, <code>on_train_batch_end</code>…", "e.g. post metrics to Slack, stop on a time budget"]
      ] } },
      { warn: "Three traps: (1) <code>restore_best_weights</code> defaults to <b>False</b> — without it you keep the last, slightly overfit weights. (2) <code>validation_split</code> takes the <b>last</b> fraction of the arrays <i>before</i> shuffling — if your data is sorted by label or time, the validation set is biased; shuffle first or pass <code>validation_data</code>. (3) Loss and output must match: <code>sigmoid</code> + <code>binary_crossentropy</code>; <code>softmax</code> + <code>sparse_categorical_crossentropy</code> for integer labels (or <code>from_logits=True</code> with no final activation)." },
      { p: "<code>model.predict(x)</code> batches large inputs and returns NumPy; for a single small input inside a loop, <code>model(x, training=False)</code> is faster because it skips the predict-loop overhead." },
      { tip: "Follow-up: 'when does fit() not fit your needs?' — GANs, custom gradient tricks, multiple optimisers. Answer: override <code>train_step()</code> in a Model subclass (keeps callbacks and <code>fit()</code>), or write a loop with <code>tf.GradientTape</code>. Choosing the optimiser itself: <a href=\"#/core/ai/optimizers\">optimizers</a>; why early stopping works: <a href=\"#/core/ai/overfitting-underfitting\">overfitting vs underfitting</a>." }
    ]
  },
    {
    id: "tf-data-pipeline",
    q: "What is tf.data and how do you build an efficient input pipeline with it?",
    topic: "TensorFlow",
    level: 2,
    top: true,
    short: "tf.data builds input pipelines as a chain of transformations on a Dataset: read from arrays, files or TFRecords, map preprocessing in parallel, shuffle, batch and prefetch. The point is to keep the GPU busy, so the CPU prepares the next batch while the model trains on the current one. The usual order is: load, cache, shuffle, map with augmentation, batch, prefetch with AUTOTUNE, and fit() accepts the Dataset directly.",
    a: [
      { svg: `<svg viewBox="0 0 700 130" width="700" class="dg">
  <rect class="box" x="10" y="40" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="60" y="66" text-anchor="middle">source</text>
  <rect class="box" x="130" y="40" width="90" height="44" rx="6"/>
  <text class="tx tx-b" x="175" y="66" text-anchor="middle">cache</text>
  <rect class="box" x="240" y="40" width="90" height="44" rx="6"/>
  <text class="tx tx-b" x="285" y="66" text-anchor="middle">shuffle</text>
  <rect class="box-a" x="350" y="40" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="400" y="66" text-anchor="middle">map ‖</text>
  <rect class="box" x="470" y="40" width="90" height="44" rx="6"/>
  <text class="tx tx-b" x="515" y="66" text-anchor="middle">batch</text>
  <rect class="box-g" x="580" y="40" width="110" height="44" rx="6"/>
  <text class="tx tx-b" x="635" y="66" text-anchor="middle">prefetch</text>
  <line class="ln" x1="110" y1="62" x2="128" y2="62" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="220" y1="62" x2="238" y2="62" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="62" x2="348" y2="62" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="450" y1="62" x2="468" y2="62" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="560" y1="62" x2="578" y2="62" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="60" y="104" text-anchor="middle">arrays, files, TFRecord</text>
  <text class="tx-s" x="175" y="104" text-anchor="middle">decode once</text>
  <text class="tx-s" x="285" y="104" text-anchor="middle">new order / epoch</text>
  <text class="tx-s" x="400" y="104" text-anchor="middle">parallel augment</text>
  <text class="tx-s" x="635" y="104" text-anchor="middle">overlap with GPU</text>
  <text class="tx-m" x="350" y="24" text-anchor="middle">CPU prepares batch N+1 while the accelerator trains on batch N</text>
</svg>`, caption: "A typical tf.data pipeline" },
      { code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
import tensorflow as tf
import keras

keras.utils.set_random_seed(0)
X = np.random.rand(1000, 8).astype("float32")
y = (X[:, 0] + X[:, 1] > 1).astype("int32")

def augment(x, label):                       # runs inside the graph, in parallel
    noise = tf.random.normal(tf.shape(x), stddev=0.01)
    return x + noise, label

AUTOTUNE = tf.data.AUTOTUNE
train_ds = (tf.data.Dataset.from_tensor_slices((X, y))
            .cache()                         # keep loaded data in memory after epoch 1
            .shuffle(buffer_size=1000, seed=0)
            .map(augment, num_parallel_calls=AUTOTUNE)
            .batch(64)
            .prefetch(AUTOTUNE))             # prepare batch N+1 while model trains on N

xb, yb = next(iter(train_ds))
print(xb.shape, yb.shape, xb.dtype)
print("batches per epoch:", train_ds.cardinality().numpy())

model = keras.Sequential([keras.Input((8,)), keras.layers.Dense(16, activation="relu"),
                          keras.layers.Dense(1, activation="sigmoid")])
model.compile("adam", "binary_crossentropy", metrics=["accuracy"])
model.fit(train_ds, epochs=30, verbose=0)    # pass the Dataset directly -- no batch_size
print(f"acc: {model.evaluate(train_ds, verbose=0)[1]:.2f}")
# (64, 8) (64,) <dtype: 'float32'>
# batches per epoch: 16
# acc: 0.90`, lang: "python", title: "cache → shuffle → map → batch → prefetch" },
      { ul: [
        "<b>Sources</b>: <code>from_tensor_slices</code> (in-memory), <code>keras.utils.image_dataset_from_directory</code>, <code>TextLineDataset</code>, <code>TFRecordDataset</code> (sharded binary files for large data); <code>interleave</code> reads several files in parallel.",
        "<b>cache()</b> goes after expensive, deterministic steps (decoding, resizing) and <b>before</b> random augmentation — otherwise every epoch sees the same 'random' augmentation.",
        "<b>shuffle(buffer_size)</b> only shuffles within the buffer; a buffer much smaller than the dataset on sorted data gives poor shuffling.",
        "<b>prefetch(AUTOTUNE)</b> at the very end; <b>num_parallel_calls=AUTOTUNE</b> on <code>map</code> lets the runtime pick the parallelism."
      ] },
      { warn: "Functions passed to <code>map</code> are traced into a graph (like <code>tf.function</code>), so use <code>tf.*</code> ops, not NumPy or PIL. If you must call Python code, <code>tf.py_function</code> works but holds the GIL and kills parallelism. Also: with a Dataset you cannot use <code>validation_split</code> — pass a separate <code>validation_data</code> dataset." },
      { tip: "If asked 'my GPU utilisation is 30%, why?' — the input pipeline is the bottleneck. Profile with the TensorBoard profiler, then add parallel map, prefetch and cache, and move heavy decoding offline into TFRecords." }
    ]
  },
    {
    id: "tf-saving-deployment",
    q: "How do you save and deploy a TensorFlow/Keras model — .keras vs SavedModel, TF Serving and TF Lite?",
    topic: "TensorFlow",
    level: 2,
    top: true,
    short: "In Keras 3, model.save('model.keras') writes one zip with architecture, weights and optimizer state, for reloading in Python to resume training or predict. For serving you export a SavedModel with model.export(), an inference-only TensorFlow graph with a serving signature, which TF Serving loads from a versioned folder over REST or gRPC. For mobile and edge you convert the SavedModel to TF Lite, now called LiteRT, usually with quantization to shrink and speed it up.",
    a: [
      { code: `import os, tempfile
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
import tensorflow as tf
import keras

keras.utils.set_random_seed(1)
X = np.random.rand(500, 4).astype("float32")
y = (X.sum(axis=1) > 2).astype("float32")
model = keras.Sequential([keras.Input((4,)), keras.layers.Dense(8, activation="relu"),
                          keras.layers.Dense(1, activation="sigmoid")])
model.compile("adam", "binary_crossentropy", metrics=["accuracy"])
model.fit(X, y, epochs=20, verbose=0)
out = tempfile.mkdtemp()

# 1) Keras native format (Keras 3): architecture + weights + optimizer state, one zip file
path = os.path.join(out, "model.keras")
model.save(path)
restored = keras.models.load_model(path)
print("same predictions:", np.allclose(model.predict(X[:5], verbose=0), restored.predict(X[:5], verbose=0)))

# 2) SavedModel for TF Serving / TFLite: inference-only graph with a serving signature
export_dir = os.path.join(out, "serving", "1")       # TF Serving expects numbered versions
model.export(export_dir, verbose=False)
reloaded = tf.saved_model.load(export_dir)
print("signatures:", list(reloaded.signatures.keys()))

# 3) TensorFlow Lite for mobile/edge, with post-training dynamic-range quantization
conv = tf.lite.TFLiteConverter.from_saved_model(export_dir)
conv.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_bytes = conv.convert()
print("tflite size (bytes):", len(tflite_bytes))
# same predictions: True
# signatures: ['serve', 'serving_default']
# tflite size (bytes): 1884`, lang: "python", title: "One model, three formats" },
      { table: { head: ["Format", "Contains", "Use it for"], rows: [
        ["<code>.keras</code> (Keras 3 default)", "Config + weights + optimizer state", "Reload in Python, resume training, share with teammates"],
        ["<code>.weights.h5</code>", "Weights only", "Checkpoints when you rebuild the model from code"],
        ["SavedModel directory (<code>model.export()</code> / <code>tf.saved_model.save</code>)", "TF graph + variables + signatures; no Python needed", "TF Serving, TF.js / TFLite conversion, Java/C++/Go runtimes"],
        ["<code>.tflite</code> (LiteRT)", "Flatbuffer, optionally quantized int8/float16", "Android, iOS, microcontrollers, edge devices"],
        ["Legacy <code>.h5</code>", "Old Keras 2 full-model format", "Reading old models only"]
      ] } },
      { code: `# serve every version under ./serving/my_model/<N>/ on REST port 8501
docker run -p 8501:8501 \\
  -v "$PWD/serving:/models/my_model" -e MODEL_NAME=my_model tensorflow/serving

curl -X POST http://localhost:8501/v1/models/my_model:predict \\
  -d '{"instances": [[0.9, 0.8, 0.7, 0.6]]}'
# {"predictions": [[0.97]]}`, lang: "bash", title: "TF Serving (gRPC is on port 8500)", run: false },
      { warn: "In Keras 3, <code>model.save(\"my_dir\")</code> without an extension raises an error — use <code>.keras</code> for saving and <code>model.export()</code> for a SavedModel. Also, models with custom layers need <code>@keras.saving.register_keras_serializable()</code> and <code>get_config()</code>, or <code>load_model</code> fails." },
      { p: "<b>Quantization</b> for TFLite: <code>Optimize.DEFAULT</code> alone gives dynamic-range quantization (int8 weights, about 4x smaller). Full integer quantization for NPUs and microcontrollers also needs a <code>representative_dataset</code> to calibrate activation ranges. Always re-measure accuracy after converting. Theory: <a href=\"#/core/ai/model-size-quantization\">model size and quantization</a>." },
      { tip: "Close with the serving story: 'model.export() to a versioned folder, TF Serving in Docker behind the API, a new version is just a new folder number, so rollback is easy.' For the bigger picture see <a href=\"#/core/ai/model-deployment-serving\">model deployment and serving</a>." }
    ]
  },

    /* ───────────── Scikit-learn ───────────── */
    {
    id: "sklearn-estimator-api",
    q: "How does the scikit-learn estimator API work (fit, predict, transform, fit_transform), and what is the fit_transform leakage trap?",
    topic: "Scikit-learn",
    level: 1,
    top: true,
    short: "Every scikit-learn object is an estimator with fit(X, y), which learns from data and stores learned attributes ending in an underscore such as coef_ or mean_. Predictors add predict and often predict_proba and score; transformers add transform, and fit_transform does both in one step. The trap is calling fit or fit_transform on the whole dataset, or on the test set, before splitting: test statistics leak into training and your score is optimistic. Fit on train only, then just transform test.",
    a: [
      { table: { head: ["Kind", "Methods", "Examples"], rows: [
        ["Estimator (all)", "<code>fit(X, y)</code> → returns <code>self</code>; <code>get_params</code>/<code>set_params</code>", "everything"],
        ["Predictor", "<code>predict</code>, <code>predict_proba</code>, <code>decision_function</code>, <code>score</code>", "<code>LogisticRegression</code>, <code>RandomForestClassifier</code>, <code>KMeans</code>"],
        ["Transformer", "<code>transform</code>, <code>fit_transform</code>, <code>inverse_transform</code>", "<code>StandardScaler</code>, <code>OneHotEncoder</code>, <code>PCA</code>, <code>TfidfVectorizer</code>"]
      ] } },
      { code: `import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
X = rng.normal(loc=50, scale=10, size=(200, 2))
y = (X[:, 0] + rng.normal(0, 5, 200) > 50).astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

scaler = StandardScaler()               # a TRANSFORMER: fit() learns, transform() applies
scaler.fit(X_train)                     # learns mean_ and scale_ from TRAIN only
print("learned mean:", scaler.mean_.round(2))
X_train_s = scaler.transform(X_train)
X_test_s = scaler.transform(X_test)     # reuse train statistics -- never refit on test

clf = LogisticRegression()              # a PREDICTOR: fit() learns, predict() outputs
clf.fit(X_train_s, y_train)             # learned params end with "_": coef_, intercept_
print("coef_:", clf.coef_.round(2))
print("predict:", clf.predict(X_test_s[:5]))
print("predict_proba:", clf.predict_proba(X_test_s[:2]).round(3))
print("score (accuracy):", round(clf.score(X_test_s, y_test), 3))
print("hyperparams:", {k: v for k, v in clf.get_params().items() if k in ("C", "max_iter")})

# THE TRAP: fitting the scaler on the full dataset before splitting
leaky = StandardScaler().fit(X)         # test rows influenced mean/std -> leakage
print("train-only mean vs full mean:", scaler.mean_.round(2), leaky.mean_.round(2))
# learned mean: [49.2  49.83]
# coef_: [[ 2.66 -0.1 ]]
# predict: [0 0 0 0 1]
# predict_proba: [[0.847 0.153]
#  [0.941 0.059]]
# score (accuracy): 0.84
# hyperparams: {'C': 1.0, 'max_iter': 100}
# train-only mean vs full mean: [49.2  49.83] [49.02 50.25]`, lang: "python", title: "Transformer + predictor, done correctly" },
      { p: "Conventions worth naming: hyperparameters go in the constructor (<code>LogisticRegression(C=0.5)</code>); learned state appears only after <code>fit</code> and ends in <code>_</code>; <code>fit</code> returns <code>self</code> so you can chain <code>clf.fit(X, y).predict(X2)</code>; input is a 2-D array or DataFrame of shape <code>(n_samples, n_features)</code> — a single sample must be reshaped to <code>(1, n_features)</code>." },
      { warn: "<code>fit_transform(X_test)</code> is the bug interviewers look for. With a scaler the damage is small; with target encoding, feature selection or SMOTE oversampling before the split, the score can be wildly inflated. The fix that makes it impossible to get wrong is a <b>Pipeline</b>. Theory: <a href=\"#/core/ai/data-leakage\">data leakage</a>." },
      { tip: "Mention that because every estimator shares this interface, you can swap models in one line and plug any of them into Pipeline, GridSearchCV and cross_val_score — that is the design idea behind the library (duck typing, no base-class gymnastics)." }
    ]
  },
    {
    id: "sklearn-pipeline-columntransformer",
    q: "What are Pipeline and ColumnTransformer in scikit-learn, and why should you use them?",
    topic: "Scikit-learn",
    level: 2,
    top: true,
    short: "A Pipeline chains preprocessing steps and a final model into one estimator, so fit runs fit_transform on each step in order and predict only transforms. ColumnTransformer applies different preprocessing to different columns, for example impute and scale the numeric ones and one-hot encode the categorical ones, then concatenates the results. Together they prevent leakage during cross-validation, let GridSearchCV tune preprocessing and model together, and give you one object to save and deploy.",
    a: [
      { svg: `<svg viewBox="0 0 680 190" width="680" class="dg">
  <rect class="box" x="10" y="70" width="90" height="44" rx="6"/>
  <text class="tx tx-b" x="55" y="96" text-anchor="middle">raw df</text>
  <rect class="box-a" x="130" y="10" width="330" height="170" rx="10"/>
  <text class="tx tx-b" x="295" y="30" text-anchor="middle">ColumnTransformer</text>
  <rect class="box" x="150" y="44" width="290" height="50" rx="6"/>
  <text class="tx" x="295" y="64" text-anchor="middle">age, salary</text>
  <text class="tx-s" x="295" y="82" text-anchor="middle">SimpleImputer → StandardScaler</text>
  <rect class="box" x="150" y="112" width="290" height="50" rx="6"/>
  <text class="tx" x="295" y="132" text-anchor="middle">city</text>
  <text class="tx-s" x="295" y="150" text-anchor="middle">OneHotEncoder(handle_unknown="ignore")</text>
  <rect class="box-g" x="500" y="70" width="170" height="44" rx="6"/>
  <text class="tx tx-b" x="585" y="96" text-anchor="middle">LogisticRegression</text>
  <line class="ln" x1="100" y1="92" x2="148" y2="69" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="100" y1="92" x2="148" y2="137" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="440" y1="69" x2="498" y2="88" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="440" y1="137" x2="498" y2="98" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Pipeline = [ColumnTransformer, model]; one fit(), one predict(), one file to save" },
      { code: `import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

df = pd.DataFrame({
    "age":    [22, 25, None, 35, 41, 29, 52, 46, 33, 27, 38, 60],
    "salary": [3.2, 4.0, 5.5, 7.1, 9.0, 4.8, 12.0, 10.5, 6.0, 4.1, 8.2, 15.0],
    "city":   ["Pune", "Delhi", "Pune", "Mumbai", "Delhi", "Pune",
               "Mumbai", "Delhi", "Pune", "Mumbai", "Delhi", "Mumbai"],
    "bought": [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1],
})
X, y = df.drop(columns="bought"), df["bought"]

numeric = Pipeline([("impute", SimpleImputer(strategy="median")),
                    ("scale", StandardScaler())])
preprocess = ColumnTransformer([
    ("num", numeric, ["age", "salary"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
model = Pipeline([("prep", preprocess), ("clf", LogisticRegression())])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
model.fit(X_train, y_train)            # every step is fit on TRAIN rows only
print("test accuracy:", model.score(X_test, y_test))
print(model.named_steps["prep"].get_feature_names_out())

new = pd.DataFrame({"age": [30], "salary": [11.0], "city": ["Bengaluru"]})  # unseen city
print("prediction for new row:", model.predict(new))
# test accuracy: 1.0
# ['num__age' 'num__salary' 'cat__city_Delhi' 'cat__city_Mumbai'
#  'cat__city_Pune']
# prediction for new row: [1]`, lang: "python", title: "Mixed numeric + categorical data in one estimator" },
      { ul: [
        "<b>No leakage in CV</b>: <code>cross_val_score(model, X, y)</code> refits the imputer, scaler and encoder inside every fold, on that fold's training part only.",
        "<b>Tune everything together</b>: <code>{\"prep__num__impute__strategy\": [\"mean\", \"median\"], \"clf__C\": [0.1, 1, 10]}</code> — step names joined by double underscores.",
        "<b>One artefact</b>: <code>joblib.dump(model, ...)</code> saves preprocessing and model together, so serving cannot apply different preprocessing from training (training–serving skew).",
        "<code>make_pipeline</code> / <code>make_column_transformer</code> auto-name the steps (lower-cased class names)."
      ] },
      { warn: "ColumnTransformer's <code>remainder</code> defaults to <code>\"drop\"</code> — any column you did not list silently disappears. Use <code>remainder=\"passthrough\"</code> if you want to keep them. And <code>handle_unknown=\"ignore\"</code> on OneHotEncoder is what saves you when production sends a category never seen in training." },
      { tip: "Add <code>model.set_output(transform=\"pandas\")</code> (sklearn 1.2+) to get DataFrames with readable column names out of each step — handy when debugging. Background: <a href=\"#/core/ai/feature-scaling-encoding\">feature scaling and encoding</a>." }
    ]
  },
    {
    id: "sklearn-model-selection",
    q: "How do you use train_test_split, cross_val_score and GridSearchCV correctly in scikit-learn?",
    topic: "Scikit-learn",
    level: 2,
    top: true,
    short: "Split once with train_test_split, using stratify for classification and a fixed random_state, and lock the test set away. On the training part, cross_val_score gives a more reliable estimate than one validation split by averaging k folds. GridSearchCV tries every hyperparameter combination with cross-validation, picks the best by your scoring metric and refits it on all training data. Only then do you score the test set, once.",
    a: [
      { code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV, StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_breast_cancer(return_X_y=True)          # bundled with sklearn, no download
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)  # stratify keeps class ratio

pipe = make_pipeline(StandardScaler(), SVC())
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="f1")
print("5-fold F1:", scores.round(3), "mean", round(scores.mean(), 3))

param_grid = {                       # "<step name>__<param>" reaches inside the pipeline
    "svc__C": [0.1, 1, 10],
    "svc__kernel": ["linear", "rbf"],
}
search = GridSearchCV(pipe, param_grid, cv=cv, scoring="f1", n_jobs=1)
search.fit(X_train, y_train)         # 6 combos x 5 folds = 30 fits, then refit on all train
print("best params:", search.best_params_)
print("best CV F1:", round(search.best_score_, 3))
print("held-out test F1:", round(search.score(X_test, y_test), 3))   # touch test ONCE
# 5-fold F1: [0.957 0.982 0.973 0.974 0.991] mean 0.976
# best params: {'svc__C': 0.1, 'svc__kernel': 'linear'}
# best CV F1: 0.981
# held-out test F1: 0.986`, lang: "python", title: "Split → cross-validate → tune → test once" },
      { table: { head: ["Tool", "What it does", "Use when"], rows: [
        ["<code>train_test_split</code>", "One random split (<code>stratify=y</code>, <code>random_state</code>)", "Creating the final hold-out test set"],
        ["<code>cross_val_score</code> / <code>cross_validate</code>", "k-fold scores for one model (<code>cross_validate</code> supports several metrics + timings)", "Comparing models fairly"],
        ["<code>GridSearchCV</code>", "Exhaustive search over a grid, CV for each combo", "Small grids (cost = combos × folds)"],
        ["<code>RandomizedSearchCV</code>", "Samples <code>n_iter</code> combos from distributions", "Large search spaces — usually finds a good region much faster"],
        ["<code>TimeSeriesSplit</code>, <code>GroupKFold</code>", "Train on past / keep groups together", "Time-ordered data; several rows per user or patient"]
      ] } },
      { warn: "<code>best_score_</code> is <b>optimistic</b> — you picked the max over many combos on the same folds. Report the test score, or use nested CV for an unbiased estimate. Also: for regression, sklearn scorers are 'higher is better', so errors appear as <code>neg_mean_squared_error</code> (negative numbers are expected)." },
      { p: "Defaults to know: <code>cv=5</code>; for classifiers an integer cv uses <code>StratifiedKFold</code> <i>without</i> shuffling; <code>refit=True</code> so <code>search.best_estimator_</code> is ready to use; with several metrics in <code>scoring</code> you must say which one to refit on (<code>refit=\"f1\"</code>)." },
      { tip: "Mention cost control: <code>n_jobs=-1</code> for parallel fits, RandomizedSearchCV or <code>HalvingGridSearchCV</code> for big grids, Optuna for smarter search. The theory behind k-fold: <a href=\"#/core/ai/cross-validation\">cross-validation</a> and <a href=\"#/core/ai/train-validation-test-split\">train/validation/test split</a>." }
    ]
  },
    {
    id: "sklearn-preprocessing",
    q: "Which scikit-learn preprocessing tools do you use — StandardScaler, MinMaxScaler, OneHotEncoder, OrdinalEncoder — and when?",
    topic: "Scikit-learn",
    level: 1,
    top: true,
    short: "StandardScaler gives each feature zero mean and unit variance and is the default for linear models, SVMs, KNN and neural nets. MinMaxScaler maps to 0 to 1 but one outlier squashes everything else, and RobustScaler uses median and IQR to resist outliers. Tree-based models do not need scaling. OneHotEncoder turns nominal categories into binary columns, with handle_unknown='ignore' for unseen values, and OrdinalEncoder maps ordered categories to integers in an order you specify. LabelEncoder is only for target labels.",
    a: [
      { code: `import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, OneHotEncoder, OrdinalEncoder

income = np.array([[20], [25], [30], [35], [400]])        # one outlier (in thousands)
for s in (StandardScaler(), MinMaxScaler(), RobustScaler()):
    print(f"{type(s).__name__:<15}", s.fit_transform(income).ravel().round(2))

cities = np.array([["Pune"], ["Delhi"], ["Pune"], ["Mumbai"]])
ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
ohe.fit(cities)
print(ohe.categories_)
print(ohe.transform([["Delhi"], ["Chennai"]]))           # unseen 'Chennai' -> all zeros

size = np.array([["S"], ["L"], ["M"]])
ord_enc = OrdinalEncoder(categories=[["S", "M", "L"]])  # YOU give the order
print(ord_enc.fit_transform(size).ravel())
# StandardScaler  [-0.55 -0.52 -0.48 -0.45  2.  ]
# MinMaxScaler    [0.   0.01 0.03 0.04 1.  ]
# RobustScaler    [-1.  -0.5  0.   0.5 37. ]
# [array(['Delhi', 'Mumbai', 'Pune'], dtype='<U6')]
# [[1. 0. 0.]
#  [0. 0. 0.]]
# [0. 2. 1.]`, lang: "python", title: "Scalers vs an outlier; encoders vs unseen categories" },
      { table: { head: ["Tool", "Output", "Good for", "Watch out"], rows: [
        ["<code>StandardScaler</code>", "mean 0, std 1", "Linear/logistic regression, SVM, KNN, PCA, neural nets", "Outliers still inflate the std"],
        ["<code>MinMaxScaler</code>", "[0, 1]", "Bounded inputs, e.g. pixel-like features", "One outlier squashes the rest (see output)"],
        ["<code>RobustScaler</code>", "median 0, IQR-scaled", "Data with outliers", "Outliers are kept, just not dominating"],
        ["<code>OneHotEncoder</code>", "one 0/1 column per category", "Nominal categories (city, colour)", "High cardinality explodes columns → <code>min_frequency</code>, <code>max_categories</code>, or target encoding"],
        ["<code>OrdinalEncoder</code>", "integers", "Ordered categories (S&lt;M&lt;L); also fine for tree models", "Default order is alphabetical — pass <code>categories=</code>"],
        ["<code>LabelEncoder</code>", "integers for <b>y</b>", "Encoding target classes", "Not for features (no 2-D, no pipeline support)"]
      ] } },
      { warn: "Using OrdinalEncoder (or LabelEncoder) on a nominal feature like city for a linear model invents a fake order — 'Mumbai = 2 &gt; Delhi = 0'. Use one-hot for linear models; trees cope with ordinal codes. Also remember <code>sparse_output</code> replaced the old <code>sparse</code> argument in sklearn 1.2." },
      { p: "Other tools worth a mention: <code>SimpleImputer</code> / <code>KNNImputer</code> for missing values, <code>PolynomialFeatures</code>, <code>FunctionTransformer(np.log1p)</code> for skewed features, <code>TargetEncoder</code> (sklearn 1.3+, cross-fitted internally to limit leakage)." },
      { tip: "If asked 'does a random forest need scaling?' — no, tree splits only care about order within a feature. Which algorithms are scale-sensitive and why: <a href=\"#/core/ai/feature-scaling-encoding\">feature scaling and encoding</a>." }
    ]
  },
    {
    id: "sklearn-persistence-metrics",
    q: "How do you save a scikit-learn model for production with joblib, and how do you choose the right evaluation metric?",
    topic: "Scikit-learn",
    level: 2,
    top: false,
    short: "Save the whole fitted Pipeline, preprocessing included, with joblib.dump and load it in the API with joblib.load. Pin the exact scikit-learn version, because pickles are not guaranteed to load across versions, and never load a pickle from an untrusted source, since unpickling can run code. For metrics, pick what matches the business cost: accuracy only for balanced classes, precision when false positives are expensive, recall when misses are expensive, F1 or PR-AUC for imbalance, and MAE or RMSE for regression.",
    a: [
      { code: `import os, tempfile, joblib, sklearn
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# imbalanced problem: ~5% positives (think fraud)
X, y = make_classification(n_samples=4000, n_features=10, weights=[0.95], random_state=7)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, test_size=0.25, random_state=7)

model = make_pipeline(StandardScaler(), RandomForestClassifier(n_estimators=100, random_state=7))
model.fit(X_tr, y_tr)
pred = model.predict(X_te)
print("accuracy looks great:", round((pred == y_te).mean(), 3))
print(confusion_matrix(y_te, pred))
print(classification_report(y_te, pred, digits=3))
print("ROC-AUC:", round(roc_auc_score(y_te, model.predict_proba(X_te)[:, 1]), 3))

# persist the WHOLE pipeline (scaler + model), plus the version it was trained with
path = os.path.join(tempfile.mkdtemp(), "model.joblib")
joblib.dump({"model": model, "sklearn": sklearn.__version__}, path)
bundle = joblib.load(path)
print("version matches:", bundle["sklearn"] == sklearn.__version__,
      "| same preds:", (bundle["model"].predict(X_te) == pred).all())
# accuracy looks great: 0.959
# [[942   5]
#  [ 36  17]]
#               precision    recall  f1-score   support
#
#            0      0.963     0.995     0.979       947
#            1      0.773     0.321     0.453        53
#
#     accuracy                          0.959      1000
#    macro avg      0.868     0.658     0.716      1000
# weighted avg      0.953     0.959     0.951      1000
#
# ROC-AUC: 0.901
# version matches: True | same preds: True`, lang: "python", title: "96% accuracy, but recall on fraud is only 32%" },
      { p: "Read the output like an interviewer: 95% of rows are negative, so 'always predict 0' already scores 0.95 accuracy. The real story is in class 1: recall 0.32 — we miss two thirds of the frauds. Next steps would be <code>class_weight=\"balanced\"</code>, tuning the decision threshold on <code>predict_proba</code>, and tracking PR-AUC." },
      { table: { head: ["Situation", "Metric", "sklearn scoring string"], rows: [
        ["Balanced classes, equal error costs", "Accuracy", "<code>accuracy</code>"],
        ["False positives are costly (spam filter hiding real mail)", "Precision", "<code>precision</code>"],
        ["False negatives are costly (fraud, cancer screening)", "Recall", "<code>recall</code>"],
        ["Imbalanced, need one number", "F1 / PR-AUC", "<code>f1</code>, <code>average_precision</code>"],
        ["Ranking quality, threshold-free", "ROC-AUC", "<code>roc_auc</code>"],
        ["Regression, robust to outliers / punish big errors", "MAE / RMSE", "<code>neg_mean_absolute_error</code> / <code>neg_root_mean_squared_error</code>"]
      ] } },
      { warn: "joblib files are pickles: <code>joblib.load</code> on an untrusted file can execute arbitrary code, and loading with a different sklearn version emits <code>InconsistentVersionWarning</code> and may break or silently change behaviour. Pin versions in <code>requirements.txt</code>, store the version with the model, and consider <code>skops.io</code> (safer loading) or ONNX via <code>skl2onnx</code> to serve without Python sklearn." },
      { tip: "Production checklist answer: load the model once at app startup (not per request), validate input columns and types with Pydantic, log predictions to monitor drift. Metric theory: <a href=\"#/core/ai/precision-recall-f1\">precision, recall, F1</a>, <a href=\"#/core/ai/imbalanced-datasets\">imbalanced datasets</a> and <a href=\"#/core/ai/choosing-threshold\">choosing a threshold</a>." }
    ]
  },

    /* ───────────── Transformers ───────────── */
    {
    id: "hf-what-is-transformers",
    q: "What does the Hugging Face Transformers library provide, and how does pipeline() work?",
    topic: "Transformers",
    level: 1,
    top: true,
    short: "Transformers is Hugging Face's library of pretrained transformer models with one consistent API: model classes for BERT, GPT-style, T5, ViT, Whisper and more, matching tokenizers and processors, the Auto classes that pick the right class from a checkpoint name, pipeline() for one-line inference, and Trainer for fine-tuning. Weights come from the Hugging Face Hub. A pipeline wraps three steps: tokenize the input, run the model, and post-process the logits into labels or text.",
    a: [
      { svg: `<svg viewBox="0 0 680 120" width="680" class="dg">
  <rect class="box" x="10" y="35" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="70" y="61" text-anchor="middle">"Loved it!"</text>
  <rect class="box-a" x="160" y="35" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="225" y="61" text-anchor="middle">Tokenizer</text>
  <rect class="box-p" x="320" y="35" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="385" y="61" text-anchor="middle">Model</text>
  <rect class="box-g" x="480" y="35" width="190" height="44" rx="6"/>
  <text class="tx tx-b" x="575" y="61" text-anchor="middle">Post-process</text>
  <line class="ln" x1="130" y1="57" x2="158" y2="57" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="290" y1="57" x2="318" y2="57" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="450" y1="57" x2="478" y2="57" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="225" y="100" text-anchor="middle">input_ids, attention_mask</text>
  <text class="tx-s" x="385" y="100" text-anchor="middle">logits</text>
  <text class="tx-s" x="575" y="100" text-anchor="middle">softmax → POSITIVE 0.99</text>
</svg>`, caption: "What pipeline(\"sentiment-analysis\") does under the hood" },
      { code: `from transformers import pipeline

clf = pipeline("sentiment-analysis",
               model="distilbert-base-uncased-finetuned-sst-2-english")   # downloads once, then cached
print(clf(["Loved it!", "Waste of money."]))
# [{'label': 'POSITIVE', 'score': 0.9998}, {'label': 'NEGATIVE', 'score': 0.9997}]

ner = pipeline("ner", aggregation_strategy="simple")        # merges word pieces into entities
print(ner("Sundar Pichai visited Bengaluru"))
# [{'entity_group': 'PER', 'word': 'Sundar Pichai', ...}, {'entity_group': 'LOC', 'word': 'Bengaluru', ...}]

gen = pipeline("text-generation", model="gpt2")
print(gen("Placement season tip:", max_new_tokens=20)[0]["generated_text"])`, lang: "python", title: "One-line inference (needs the Hub, so not run here)", run: false },
      { table: { head: ["Component", "What it gives you"], rows: [
        ["Model classes", "Architectures (<code>BertModel</code>, <code>LlamaForCausalLM</code>…) with task heads, mainly PyTorch"],
        ["Tokenizers / processors", "Text → ids (fast Rust tokenizers); image/audio processors for vision and speech models"],
        ["Auto classes", "<code>AutoTokenizer</code>, <code>AutoModelFor…</code> pick the right class from the checkpoint's <code>config.json</code>"],
        ["<code>pipeline()</code>", "Task-level inference: sentiment, NER, QA, summarization, translation, ASR, zero-shot…"],
        ["<code>Trainer</code>", "Training loop with eval, checkpointing, mixed precision, multi-GPU (built on Accelerate)"],
        ["<code>generate()</code>", "Decoding for generative models: greedy, beam search, sampling, streaming"]
      ] } },
      { p: "Related libraries in the same ecosystem: <b>datasets</b> (loading and processing data), <b>tokenizers</b>, <b>accelerate</b> (device placement, distributed), <b>peft</b> (LoRA), <b>evaluate</b>, <b>sentence-transformers</b> (embeddings), and the <b>Hub</b> itself (git-based model and dataset hosting with model cards)." },
      { warn: "<code>pipeline(\"sentiment-analysis\")</code> without <code>model=</code> silently picks a default checkpoint and warns. In production always pin <code>model</code> and ideally <code>revision</code> (a commit hash) so a Hub update cannot change your outputs." },
      { tip: "Say what you would look at on the model card: task, training data, language, licence, model size and benchmark scores. The architecture theory itself is in <a href=\"#/core/ai/transformer-architecture\">transformer architecture</a> and <a href=\"#/core/ai/bert-vs-gpt-vs-t5\">BERT vs GPT vs T5</a>." }
    ]
  },
    {
    id: "hf-auto-classes-hub",
    q: "What are AutoModel and AutoTokenizer, how does from_pretrained work, and what is the model hub?",
    topic: "Transformers",
    level: 2,
    top: true,
    short: "The Hub hosts model repositories, each with config.json, weights usually in safetensors, tokenizer files and a model card. from_pretrained downloads them once into a local cache and builds the object. Auto classes read config.json's model_type and pick the matching class, so AutoTokenizer gives the right tokenizer and AutoModelForSequenceClassification gives the encoder plus a classification head. AutoModel alone returns just the body, which outputs hidden states. save_pretrained writes the same layout locally.",
    a: [
      { code: `from transformers import AutoTokenizer, AutoModelForSequenceClassification

name = "bert-base-uncased"
tok = AutoTokenizer.from_pretrained(name)                     # -> BertTokenizerFast
model = AutoModelForSequenceClassification.from_pretrained(
    name, num_labels=3, revision="main")                      # pin a commit hash in prod
# "Some weights ... were newly initialized: ['classifier.bias', 'classifier.weight']"
#  -> expected: the head is new and must be fine-tuned

model.save_pretrained("./my-model"); tok.save_pretrained("./my-model")
# later / offline: from_pretrained("./my-model"), or set HF_HUB_OFFLINE=1`, lang: "python", title: "Typical loading code (downloads, so not run here)", run: false },
      { p: "The same machinery runs fully offline from a config — handy for tests. Here a tiny random BERT goes through <code>AutoModel</code>, a task head, and a <code>save_pretrained</code>/<code>from_pretrained</code> round-trip:" },
      { code: `import os
os.environ["USE_TF"] = "0"           # stop transformers importing TensorFlow (faster start)
import torch
from transformers import BertConfig, AutoConfig, AutoModel, AutoModelForSequenceClassification

torch.manual_seed(0)
# A tiny config built locally -- same classes you'd get from "bert-base-uncased", just small
cfg = BertConfig(vocab_size=100, hidden_size=32, num_hidden_layers=2,
                 num_attention_heads=2, intermediate_size=64, num_labels=3)

body = AutoModel.from_config(cfg)                          # encoder only -> hidden states
clf = AutoModelForSequenceClassification.from_config(cfg)  # same encoder + classification head
print(type(body).__name__, "|", type(clf).__name__)

ids = torch.tensor([[2, 15, 27, 3]])
mask = torch.ones_like(ids)
with torch.no_grad():
    h = body(input_ids=ids, attention_mask=mask)
    out = clf(input_ids=ids, attention_mask=mask, labels=torch.tensor([1]))
print("last_hidden_state:", tuple(h.last_hidden_state.shape))   # (batch, seq, hidden)
print("logits:", tuple(out.logits.shape), "| loss computed:", out.loss is not None)

# config round-trip: exactly what save_pretrained / from_pretrained do on disk
clf.save_pretrained("tiny-clf")
again = AutoModelForSequenceClassification.from_pretrained("tiny-clf")  # local dir, no network
print(sorted(os.listdir("tiny-clf")))
print(AutoConfig.from_pretrained("tiny-clf").model_type)
# BertModel | BertForSequenceClassification
# last_hidden_state: (1, 4, 32)
# logits: (1, 3) | loss computed: True
# ['config.json', 'model.safetensors']
# bert`, lang: "python", title: "Auto classes offline with a tiny random config" },
      { table: { head: ["Class", "Returns", "Use for"], rows: [
        ["<code>AutoModel</code>", "Hidden states (<code>last_hidden_state</code>)", "Embeddings, custom heads"],
        ["<code>AutoModelForSequenceClassification</code>", "<code>logits</code> (batch, num_labels), <code>loss</code> if labels given", "Sentiment, intent, topic classification"],
        ["<code>AutoModelForTokenClassification</code>", "Per-token logits", "NER, POS tagging"],
        ["<code>AutoModelForQuestionAnswering</code>", "Start/end logits", "Extractive QA"],
        ["<code>AutoModelForCausalLM</code> / <code>AutoModelForSeq2SeqLM</code>", "Next-token logits + <code>generate()</code>", "GPT/Llama-style generation / T5, BART"]
      ] } },
      { warn: "The tokenizer and model must come from the <b>same checkpoint</b> — a different tokenizer maps words to different ids and the model outputs garbage without any error. Also avoid <code>trust_remote_code=True</code> on repos you have not reviewed: it executes Python from the repo. Prefer <code>.safetensors</code> weights over pickle-based <code>.bin</code> for the same reason." },
      { tip: "Practical details that impress: the cache lives in <code>~/.cache/huggingface</code> (move it with <code>HF_HOME</code>), gated models such as Llama need <code>huggingface-cli login</code>, and in Docker you bake the weights into the image or a volume so containers don't download on every start." }
    ]
  },
    {
    id: "hf-tokenizer-outputs",
    q: "What does a Hugging Face tokenizer return — input_ids, attention_mask, token_type_ids — and how do padding and truncation work?",
    topic: "Transformers",
    level: 2,
    top: true,
    short: "Calling a tokenizer returns a dict-like BatchEncoding. input_ids are the vocabulary indices of the subword tokens, including special tokens like [CLS] and [SEP]. attention_mask is 1 for real tokens and 0 for padding, so attention ignores the pads. token_type_ids mark sentence A versus B for BERT-style pair tasks. padding=True pads to the longest sequence in the batch, truncation=True cuts to max_length, and return_tensors='pt' gives PyTorch tensors ready for the model.",
    a: [
      { code: `import os, tempfile
os.environ["USE_TF"] = "0"
from transformers import BertTokenizerFast

# A toy WordPiece vocab written locally (a real one ships with the checkpoint, ~30k entries)
vocab = ["[PAD]", "[UNK]", "[CLS]", "[SEP]", "[MASK]", "i", "love", "this", "movie",
         "the", "plot", "was", "bad", "and", "boring", "play", "##ing", "##ed"]
d = tempfile.mkdtemp()
with open(os.path.join(d, "vocab.txt"), "w") as f:
    f.write("\\n".join(vocab))
tok = BertTokenizerFast(vocab_file=os.path.join(d, "vocab.txt"))

texts = ["I love this movie", "the plot was bad and boring and the playing was bad"]
batch = tok(texts, padding=True, truncation=True, max_length=10, return_tensors="pt")
print(list(batch.keys()))
print(batch["input_ids"])
print(batch["attention_mask"])
print(tok.convert_ids_to_tokens(batch["input_ids"][0]))
print(tok.convert_ids_to_tokens(batch["input_ids"][1]))
print(tok.tokenize("played zebra"))           # subwords + unknown word
print(tok.decode(batch["input_ids"][0], skip_special_tokens=True))
# ['input_ids', 'token_type_ids', 'attention_mask']
# tensor([[ 2,  5,  6,  7,  8,  3,  0,  0,  0,  0],
#         [ 2,  9, 10, 11, 12, 13, 14, 13,  9,  3]])
# tensor([[1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
#         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]])
# ['[CLS]', 'i', 'love', 'this', 'movie', '[SEP]', '[PAD]', '[PAD]', '[PAD]', '[PAD]']
# ['[CLS]', 'the', 'plot', 'was', 'bad', 'and', 'boring', 'and', 'the', '[SEP]']
# ['play', '##ed', '[UNK]']
# i love this movie`, lang: "python", title: "Runs offline: a fast BERT tokenizer on a toy vocab" },
      { table: { head: ["Field", "Meaning", "Notes"], rows: [
        ["<code>input_ids</code>", "Token ids incl. special tokens", "BERT adds <code>[CLS] … [SEP]</code>; GPT-2 adds none by default"],
        ["<code>attention_mask</code>", "1 = real token, 0 = padding", "Without it, the model attends to pads and outputs change"],
        ["<code>token_type_ids</code>", "0 for sentence A, 1 for sentence B", "BERT pair tasks (<code>tok(q, context)</code>); RoBERTa/DistilBERT don't use it"],
        ["<code>offset_mapping</code>", "(start, end) char span per token", "Fast tokenizers only; maps NER/QA predictions back to text"]
      ] } },
      { ul: [
        "<code>padding=True</code> / <code>\"longest\"</code>: pad to the longest in this batch (efficient). <code>padding=\"max_length\"</code>: always pad to <code>max_length</code> (fixed shapes, wasteful).",
        "<code>truncation=True</code>: cut to <code>max_length</code> or the model's limit (512 for BERT). For long documents use <code>stride</code> + <code>return_overflowing_tokens=True</code> to get overlapping windows instead of losing the end.",
        "In training, tokenize without padding and let <code>DataCollatorWithPadding</code> pad each batch dynamically.",
        "Decoder-only models (GPT, Llama) often have no pad token: set <code>tok.pad_token = tok.eos_token</code> and use <code>padding_side=\"left\"</code> for batched generation."
      ] },
      { warn: "Note the second sentence above: truncation silently dropped 'playing was bad' — the key words can be lost. Check the token-length distribution of your data before picking <code>max_length</code>. Also, token count is not word count: unknown and rare words split into several pieces, which matters for context limits and API cost." },
      { tip: "Why subwords at all (BPE / WordPiece / SentencePiece, no out-of-vocabulary words) is theory — see <a href=\"#/core/ai/tokenization\">tokenization</a>. Here, show you can read the tensors and explain the mask." }
    ]
  },
    {
    id: "hf-fine-tuning-trainer",
    q: "How do you fine-tune a pretrained model with Hugging Face Trainer, and where does PEFT/LoRA fit in?",
    topic: "Transformers",
    level: 3,
    top: true,
    short: "Load a checkpoint with AutoModelForSequenceClassification and num_labels, tokenize the dataset with datasets.map, and set TrainingArguments: learning rate around 2e-5, batch size, epochs, eval and save strategy, and fp16. Then create a Trainer with the model, datasets, a padding collator and compute_metrics, and call train(), evaluate() and save_model(). PEFT with LoRA freezes the base model and trains small low-rank adapter matrices, often under 1% of parameters, which cuts GPU memory and gives adapters of a few megabytes.",
    a: [
      { ol: [
        "<b>Data</b>: <code>load_dataset</code> (or <code>Dataset.from_pandas</code>), split train/validation, make labels integers.",
        "<b>Tokenize</b>: <code>ds.map(lambda b: tok(b[\"text\"], truncation=True), batched=True)</code> — no padding yet.",
        "<b>Model</b>: <code>AutoModelForSequenceClassification.from_pretrained(ckpt, num_labels=..., id2label=..., label2id=...)</code>.",
        "<b>Arguments</b>: learning rate, batch size, epochs, <code>eval_strategy</code>, <code>save_strategy</code>, <code>load_best_model_at_end</code>, <code>fp16</code>/<code>bf16</code>.",
        "<b>Trainer</b>: model, args, datasets, <code>DataCollatorWithPadding</code>, <code>compute_metrics</code> → <code>train()</code>, <code>evaluate()</code>, <code>save_model()</code> / <code>push_to_hub()</code>."
      ] },
      { code: `import numpy as np
from datasets import load_dataset
from sklearn.metrics import f1_score
from transformers import (AutoTokenizer, AutoModelForSequenceClassification,
                          DataCollatorWithPadding, TrainingArguments, Trainer, EarlyStoppingCallback)

ckpt = "distilbert-base-uncased"
ds = load_dataset("imdb")                                    # train / test splits
tok = AutoTokenizer.from_pretrained(ckpt)
ds = ds.map(lambda b: tok(b["text"], truncation=True, max_length=256), batched=True)

model = AutoModelForSequenceClassification.from_pretrained(
    ckpt, num_labels=2, id2label={0: "NEG", 1: "POS"}, label2id={"NEG": 0, "POS": 1})

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return {"accuracy": (preds == labels).mean(), "f1": f1_score(labels, preds)}

args = TrainingArguments(
    output_dir="out", learning_rate=2e-5, per_device_train_batch_size=16,
    num_train_epochs=3, weight_decay=0.01, warmup_ratio=0.1,
    eval_strategy="epoch", save_strategy="epoch",            # 'evaluation_strategy' in old versions
    load_best_model_at_end=True, metric_for_best_model="f1", fp16=True, seed=42)

trainer = Trainer(model=model, args=args,
                  train_dataset=ds["train"], eval_dataset=ds["test"],
                  data_collator=DataCollatorWithPadding(tok),   # dynamic padding per batch
                  processing_class=tok,                         # 'tokenizer=' before v4.46
                  compute_metrics=compute_metrics,
                  callbacks=[EarlyStoppingCallback(early_stopping_patience=2)])
trainer.train()
print(trainer.evaluate())
trainer.save_model("sentiment-distilbert")`, lang: "python", title: "Full fine-tuning (needs GPU, the Hub, datasets and accelerate)", run: false },
      { code: `from peft import LoraConfig, get_peft_model, TaskType

lora = LoraConfig(task_type=TaskType.SEQ_CLS, r=8, lora_alpha=16, lora_dropout=0.1,
                  target_modules=["q_lin", "v_lin"])      # attention projections (DistilBERT names)
model = get_peft_model(model, lora)
model.print_trainable_parameters()
# trainable params: ~0.7M || all params: ~67M || trainable%: ~1.1  (LoRA weights + classifier head)
# ...then the same Trainer code; model.save_pretrained() writes only the small adapter`, lang: "python", title: "Switching to LoRA with PEFT (not run: peft not installed)", run: false },
      { table: { head: ["", "Full fine-tuning", "LoRA (PEFT)", "QLoRA"], rows: [
        ["Trained params", "All", "Low-rank adapters (~0.1–1%)", "Adapters on a 4-bit frozen base"],
        ["GPU memory", "High (weights + grads + Adam state)", "Much lower", "Lowest — 7B models on one consumer GPU"],
        ["Saved artefact", "Full model (GBs)", "Adapter (MBs) + base reference", "Adapter"],
        ["Quality", "Best ceiling", "Usually close to full", "Slightly below LoRA"]
      ] } },
      { warn: "Common mistakes: learning rate too high for a pretrained model (1e-3 destroys it — use 1e-5 to 5e-5), forgetting <code>num_labels</code> (head shape mismatch), evaluating on the training split, and for LLM fine-tuning, training on the prompt tokens instead of masking them so only the response is learned." },
      { tip: "When to fine-tune at all versus prompting or RAG, and how LoRA works mathematically, is core theory: <a href=\"#/core/ai/fine-tuning-lora\">fine-tuning and LoRA</a>, <a href=\"#/core/ai/transfer-learning-fine-tuning\">transfer learning</a>, <a href=\"#/core/ai/rag-vs-fine-tuning\">RAG vs fine-tuning</a>." }
    ]
  },
    {
    id: "hf-inference-optimisation",
    q: "How do you make Hugging Face model inference faster and cheaper — batching, fp16, quantization?",
    topic: "Transformers",
    level: 3,
    top: false,
    short: "First the basics: model.eval() and torch.inference_mode() to skip autograd, and batch requests with dynamic padding, ideally grouping similar lengths. On GPU, load weights in float16 or bfloat16 to halve memory and use tensor cores. Quantization stores weights in int8 or 4-bit, through bitsandbytes on GPU or dynamic int8 on CPU, trading a little accuracy for big memory savings. Beyond that: smaller distilled models, ONNX Runtime through Optimum, SDPA or flash attention, and for LLMs a server like vLLM or TGI with continuous batching and KV caching.",
    a: [
      { code: `import os, io, time, warnings
os.environ["USE_TF"] = "0"
warnings.filterwarnings("ignore", category=DeprecationWarning)
import torch
from transformers import BertConfig, BertForSequenceClassification

torch.manual_seed(0)
cfg = BertConfig(vocab_size=1000, hidden_size=256, num_hidden_layers=4,
                 num_attention_heads=4, intermediate_size=1024, num_labels=2)
model = BertForSequenceClassification(cfg).eval()

def size_mb(m):
    buf = io.BytesIO(); torch.save(m.state_dict(), buf); return buf.getbuffer().nbytes / 1e6

# post-training dynamic quantization: Linear weights fp32 -> int8 (CPU inference)
qmodel = torch.ao.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)
print(f"fp32: {size_mb(model):.1f} MB   int8: {size_mb(qmodel):.1f} MB")

ids = torch.randint(5, 1000, (64, 32))          # 64 requests x 32 tokens
mask = torch.ones_like(ids)

with torch.inference_mode():                    # no autograd bookkeeping
    t = time.perf_counter()
    for i in range(64):                         # one request at a time
        model(input_ids=ids[i:i+1], attention_mask=mask[i:i+1])
    one_by_one = time.perf_counter() - t

    t = time.perf_counter()
    full = model(input_ids=ids, attention_mask=mask).logits   # one batched call
    batched = time.perf_counter() - t
    q = qmodel(input_ids=ids, attention_mask=mask).logits

print("batched faster than one-by-one:", batched < one_by_one)
print("same argmax after int8:", (full.argmax(-1) == q.argmax(-1)).float().mean().item() > 0.9)
# fp32: 14.5 MB   int8: 4.9 MB
# batched faster than one-by-one: True
# same argmax after int8: True`, lang: "python", title: "Batching and int8 dynamic quantization on a tiny random BERT (CPU)" },
      { code: `import torch
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# half precision on GPU: ~2 bytes/param instead of 4
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct",
                                             torch_dtype=torch.bfloat16, device_map="auto",
                                             attn_implementation="sdpa")

# 4-bit NF4 weights via bitsandbytes (~0.5 byte/param): an 8B model in ~5-6 GB of VRAM
q4 = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                        bnb_4bit_compute_dtype=torch.bfloat16)
model_4bit = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct",
                                                  quantization_config=q4, device_map="auto")`, lang: "python", title: "GPU options (needs a GPU, accelerate, bitsandbytes and the Hub)", run: false },
      { table: { head: ["Technique", "Gain", "Cost / caveat"], rows: [
        ["<code>eval()</code> + <code>inference_mode()</code>", "Less memory, faster; dropout off", "None — always do it"],
        ["Batching + dynamic padding", "Much higher throughput", "Adds a little latency while a batch fills"],
        ["fp16 / bf16", "~2x less memory, faster on tensor cores", "fp16 can overflow; bf16 needs Ampere+ GPUs"],
        ["int8 / 4-bit quantization", "2–4x+ less memory", "Small accuracy drop; re-evaluate on your data"],
        ["Distillation (DistilBERT, MiniLM)", "Smaller and faster model", "Needs a distilled checkpoint or extra training"],
        ["ONNX Runtime / Optimum, <code>torch.compile</code>", "Graph optimisations, faster CPU serving", "Export step; not every op supported"],
        ["vLLM / TGI for LLMs", "Continuous batching, paged KV cache", "Separate serving stack"]
      ] } },
      { warn: "<code>torch.ao.quantization</code> (used above) is deprecated in PyTorch 2.9 and scheduled for removal — new projects should use <b>torchao</b> or Optimum/ONNX Runtime for CPU quantization. Recent transformers releases also accept <code>dtype=</code> in place of <code>torch_dtype=</code>. Always benchmark accuracy and latency before and after; a fast model that got worse is not a win." },
      { tip: "Talk in metrics: p50/p95 latency, throughput (requests/s), GPU memory, cost per 1k requests. Theory: <a href=\"#/core/ai/model-size-quantization\">model size and quantization</a>, <a href=\"#/core/ai/context-window-kv-cache\">KV cache</a>, <a href=\"#/core/ai/cost-and-latency\">cost and latency</a>." }
    ]
  },

    /* ───────────── OpenCV ───────────── */
    {
    id: "cv-images-numpy",
    q: "How does OpenCV represent an image — what are the shape, dtype and BGR order, and what traps come with them?",
    topic: "OpenCV",
    level: 1,
    top: true,
    short: "In Python, cv2.imread returns a NumPy array of shape height by width by channels, dtype uint8 with values from 0 to 255, and channels in BGR order, not RGB. A grayscale image is just height by width. Because it is NumPy, cropping is slicing with rows first, img[y1:y2, x1:x2], and a slice is a view, not a copy. Classic traps: imread returns None instead of raising, matplotlib and deep learning models expect RGB, uint8 arithmetic in NumPy wraps around, and cv2.resize takes width then height.",
    a: [
      { code: `import cv2

img = cv2.imread("photo.jpg")                 # BGR, uint8
if img is None:                               # no exception on a bad path!
    raise FileNotFoundError("photo.jpg")
print(img.shape, img.dtype)                   # e.g. (720, 1280, 3) uint8 -> H, W, C

gray = cv2.imread("photo.jpg", cv2.IMREAD_GRAYSCALE)   # (720, 1280)
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)    # before matplotlib / PIL / a PyTorch model
small = cv2.resize(img, (640, 360))           # dsize is (WIDTH, HEIGHT) -- opposite of .shape
face = img[100:300, 400:600].copy()           # rows (y) first; .copy() to detach from img
cv2.imwrite("out.png", small)`, lang: "python", title: "OpenCV basics (cv2 not installed here, so not run)", run: false },
      { p: "Everything above is plain NumPy underneath, so the behaviour can be shown without OpenCV:" },
      { code: `import numpy as np

# What cv2.imread returns: an (H, W, 3) uint8 array in **BGR** order
img = np.zeros((2, 3, 3), dtype=np.uint8)      # 2 rows (height) x 3 cols (width)
img[0, 0] = [255, 0, 0]                        # in BGR this pixel is BLUE, not red
print(img.shape, img.dtype, img.size)          # (H, W, C) -- note: not (W, H)

rgb = img[:, :, ::-1]                          # same as cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
print("BGR pixel:", img[0, 0], "-> RGB pixel:", rgb[0, 0])

# uint8 arithmetic WRAPS in NumPy; cv2.add SATURATES at 255
a = np.array([250], dtype=np.uint8)
b = np.array([10], dtype=np.uint8)
print("numpy  250+10 =", (a + b)[0])                                     # 4  (wrap-around)
print("cv2.add-like  =", np.clip(a.astype(np.int16) + b, 0, 255).astype(np.uint8)[0])  # 255

crop = img[0:1, 1:3]                           # ROI = slicing, rows first: img[y1:y2, x1:x2]
crop[:] = 7                                    # a VIEW: this writes into img too!
print(img[0, 1:3, 0])
# (2, 3, 3) uint8 18
# BGR pixel: [255   0   0] -> RGB pixel: [  0   0 255]
# numpy  250+10 = 4
# cv2.add-like  = 255
# [7 7]`, lang: "python", title: "The same facts in pure NumPy (runs)" },
      { table: { head: ["Thing", "OpenCV", "PIL / matplotlib / PyTorch"], rows: [
        ["Channel order", "BGR", "RGB"],
        ["Layout", "H × W × C (HWC)", "PIL/matplotlib HWC; PyTorch tensors C × H × W"],
        ["dtype / range", "uint8 0–255", "Models usually want float32 0–1, then mean/std normalised"],
        ["Size arguments", "<code>resize(img, (w, h))</code>, points as (x, y)", "<code>img.shape</code> is (h, w)"]
      ] } },
      { warn: "Feeding a BGR frame to a model trained on RGB does not crash — accuracy just quietly drops. Make conversion explicit at the boundary: <code>cvtColor(BGR2RGB)</code> → <code>astype(float32)/255</code> → normalise → <code>transpose(2, 0, 1)</code> for PyTorch." },
      { tip: "If asked 'why BGR?' — historical: early camera and Windows bitmap formats stored bytes as BGR, and OpenCV kept that default for compatibility." }
    ]
  },
    {
    id: "cv-basic-ops",
    q: "What do the common OpenCV operations do — resize, color conversion, blur, thresholding, Canny edges and contours?",
    topic: "OpenCV",
    level: 2,
    top: true,
    short: "A classic pipeline: resize to a working size, convert BGR to grayscale, blur with GaussianBlur to remove noise, then either threshold into a binary mask, with Otsu or adaptive thresholding for uneven light, or run Canny for edges. findContours on the binary image gives object outlines, which you filter by area and turn into bounding boxes with boundingRect. Blurring is convolution with a small kernel, and Canny is smoothing, gradient magnitude, non-maximum suppression and hysteresis thresholding.",
    a: [
      { code: `import cv2

img = cv2.imread("coins.jpg")
img = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)  # INTER_AREA to shrink
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (5, 5), 0)                 # kernel size must be odd

# binary mask: Otsu picks the threshold automatically (returns (threshold, image))
t, mask = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
# uneven lighting? -> cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#                                           cv2.THRESH_BINARY, 11, 2)
edges = cv2.Canny(blur, 50, 150)                         # hysteresis low / high thresholds

# OpenCV 4.x returns (contours, hierarchy); 3.x returned 3 values
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
coins = [c for c in contours if cv2.contourArea(c) > 100]   # drop noise blobs
for c in coins:
    x, y, w, h = cv2.boundingRect(c)
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)   # colour is BGR -> green
print("coins found:", len(coins))
cv2.imwrite("annotated.jpg", img)`, lang: "python", title: "Count objects in an image (not run: cv2 not installed)", run: false },
      { p: "What those calls compute, in NumPy: grayscale is a weighted sum of channels, blur and Sobel are convolutions, thresholding is a comparison, and a bounding box is the min/max of foreground pixel coordinates." },
      { code: `import numpy as np

rng = np.random.default_rng(0)
# synthetic 10x10 BGR image: dark background, bright 6x6 square, plus noise
img = np.full((10, 10, 3), 30, dtype=np.uint8)
img[2:8, 2:8] = 200
img = np.clip(img + rng.integers(-20, 21, img.shape), 0, 255).astype(np.uint8)

# 1) BGR -> gray, same weights cv2.COLOR_BGR2GRAY uses: 0.299 R + 0.587 G + 0.114 B
b, g, r = img[..., 0], img[..., 1], img[..., 2]
gray = (0.114 * b + 0.587 * g + 0.299 * r).round().astype(np.uint8)

# 2) 3x3 box blur = convolution (what cv2.blur does; GaussianBlur just uses Gaussian weights)
def conv2d(x, k):
    p = k.shape[0] // 2
    xp = np.pad(x.astype(np.float32), p, mode="edge")
    out = np.zeros_like(x, dtype=np.float32)
    for dy in range(k.shape[0]):
        for dx in range(k.shape[1]):
            out += k[dy, dx] * xp[dy:dy + x.shape[0], dx:dx + x.shape[1]]
    return out
blur = conv2d(gray, np.ones((3, 3)) / 9).round().astype(np.uint8)

# 3) Sobel gradients -> edge strength (the first stage of Canny)
sx = conv2d(blur, np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32))
sy = conv2d(blur, np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float32))
mag = np.hypot(sx, sy)

# 4) binary threshold (cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY))
mask = np.where(gray > 127, 255, 0).astype(np.uint8)

print("mask:\\n", mask // 255)
print("edge strength: flat background", int(mag[0, 0]), "| square border", int(mag[4, 2]),
      "| flat inside", int(mag[4, 4:6].mean()))
ys, xs = np.nonzero(mask)
print("bounding box (x, y, w, h):", (xs.min(), ys.min(), xs.max() - xs.min() + 1, ys.max() - ys.min() + 1))
# mask:
#  [[0 0 0 0 0 0 0 0 0 0]
#  [0 0 0 0 0 0 0 0 0 0]
#  [0 0 1 1 1 1 1 1 0 0]
#  ... rows 3-7 the same ...
#  [0 0 0 0 0 0 0 0 0 0]]
# edge strength: flat background 33 | square border 448 | flat inside 21
# bounding box (x, y, w, h): (2, 2, 6, 6)`, lang: "python", title: "Gray, blur, Sobel, threshold, bounding box in pure NumPy (runs)" },
      { table: { head: ["Operation", "Call", "Typical use"], rows: [
        ["Gaussian blur", "<code>GaussianBlur(img, (5,5), 0)</code>", "Denoise before thresholding or edges"],
        ["Median blur", "<code>medianBlur(img, 5)</code>", "Salt-and-pepper noise; keeps edges sharper"],
        ["Threshold / Otsu / adaptive", "<code>threshold</code>, <code>adaptiveThreshold</code>", "Documents, segmentation of a clear foreground"],
        ["Morphology", "<code>erode</code>, <code>dilate</code>, <code>morphologyEx(MORPH_OPEN)</code>", "Remove specks, close holes in masks"],
        ["Canny", "<code>Canny(img, low, high)</code>", "Edge maps, lane detection, document corners"],
        ["Contours", "<code>findContours</code>, <code>contourArea</code>, <code>boundingRect</code>, <code>approxPolyDP</code>", "Count/measure objects, find a 4-corner document"]
      ] } },
      { warn: "<code>findContours</code> expects a binary image with a white object on black background — run it on a mask, not on a colour image, and invert with <code>THRESH_BINARY_INV</code> if your objects are dark. Canny thresholds are image-dependent; a common heuristic is low ≈ 0.66 × median and high ≈ 1.33 × median of the gray image." },
      { tip: "This 'classic CV' pipeline is what a convolutional layer learns automatically — a CNN's first layers learn edge detectors like Sobel. Link it: <a href=\"#/core/ai/cnn\">CNNs</a>." }
    ]
  },
    {
    id: "cv-video-frames",
    q: "How do you read and process video or webcam frames with OpenCV?",
    topic: "OpenCV",
    level: 2,
    top: true,
    short: "cv2.VideoCapture opens a file path, a camera index like 0, or an RTSP stream. In a loop you call cap.read(), which returns an ok flag and a frame as a BGR NumPy array, and you stop when ok is False. Process each frame, optionally write with VideoWriter, and always release the capture. For real-time work you skip frames, resize first, read in a separate thread so slow processing does not lag the stream, and batch frames for a GPU model.",
    a: [
      { code: `import cv2, time

cap = cv2.VideoCapture("traffic.mp4")          # or 0 for the webcam, or "rtsp://..."
if not cap.isOpened():
    raise RuntimeError("cannot open video")
fps = cap.get(cv2.CAP_PROP_FPS)
w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
out = cv2.VideoWriter("out.mp4", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))

frame_id, t0 = 0, time.time()
try:
    while True:
        ok, frame = cap.read()                  # frame: (h, w, 3) uint8 BGR
        if not ok:                              # end of file or camera dropped
            break
        frame_id += 1
        if frame_id % 3:                        # process every 3rd frame for speed
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # ... detection / tracking on gray or a resized copy ...
        out.write(frame)
        cv2.imshow("preview", frame)            # needs a display; skip on servers
        if cv2.waitKey(1) & 0xFF == ord("q"):   # waitKey is what actually paints the window
            break
finally:
    cap.release(); out.release(); cv2.destroyAllWindows()
print(f"processed {frame_id} frames at {frame_id / (time.time() - t0):.1f} fps")`, lang: "python", title: "Read, process, write — with clean-up (not run: cv2 + a video file)", run: false },
      { ul: [
        "<b>Stopping condition</b>: <code>ok == False</code> means end of stream; never assume the frame count from <code>CAP_PROP_FRAME_COUNT</code> (it is an estimate for some codecs).",
        "<b>Speed</b>: resize before heavy processing, skip frames, use motion detection (frame differencing) to decide when to run an expensive model.",
        "<b>Live streams lag</b> if processing is slower than the camera: frames queue up and you process old ones. Read in a background thread that keeps only the latest frame.",
        "<b>Servers</b>: no <code>imshow</code> on a headless machine — install <code>opencv-python-headless</code> in Docker and write frames or stream results instead."
      ] },
      { table: { head: ["Source", "VideoCapture argument"], rows: [
        ["Video file", "<code>\"video.mp4\"</code> (needs FFmpeg support, included in the pip wheels)"],
        ["Webcam", "<code>0</code>, <code>1</code>… (device index)"],
        ["IP / CCTV camera", "<code>\"rtsp://user:pass@host:554/stream\"</code>"],
        ["Image sequence", "<code>\"frames/img_%04d.jpg\"</code>"]
      ] } },
      { warn: "Forgetting <code>cap.release()</code> keeps the camera locked for other processes, and an unreleased <code>VideoWriter</code> can leave a corrupt file. Use <code>try/finally</code>. Also, the VideoWriter frame size must exactly equal the size of the frames you write, or it silently writes an empty file." },
      { tip: "Mention tracking: running a detector every frame is costly, so detect every N frames and track in between with a cheap tracker (e.g. CSRT/KCF in opencv-contrib, or SORT/ByteTrack on top of YOLO detections)." }
    ]
  },
    {
    id: "cv-vs-pil-vs-dl",
    q: "When would you use OpenCV vs PIL (Pillow) vs a deep learning model for a vision task?",
    topic: "OpenCV",
    level: 2,
    top: true,
    short: "Pillow is a light image library for loading, saving, resizing, cropping and drawing, in RGB, and it is what many PyTorch data loaders use. OpenCV is a full computer vision toolkit, fast C++ underneath, with video I/O, filters, geometry, contours, feature matching, camera calibration and a DNN inference module. Deep learning models such as CNNs, YOLO or ViTs are needed when the task requires semantic understanding, like recognising what an object is under varied conditions. In practice they are combined: OpenCV or PIL for I/O and preprocessing, a model for understanding.",
    a: [
      { table: { head: ["", "Pillow (PIL)", "OpenCV", "Deep learning (PyTorch/TF, YOLO…)"], rows: [
        ["Best at", "Simple image I/O, thumbnails, drawing text, format conversion", "Classic CV, video, real-time processing, geometry", "Recognition: classify, detect, segment, OCR in the wild"],
        ["Colour / layout", "RGB, <code>PIL.Image</code> object", "BGR NumPy array", "RGB float tensors, CHW in PyTorch"],
        ["Video / camera", "No", "Yes (<code>VideoCapture</code>)", "Uses OpenCV/decoders for input"],
        ["Needs training data", "No", "No (hand-tuned rules)", "Yes, or a pretrained model to fine-tune"],
        ["Robust to lighting, angle, clutter", "—", "Weak: thresholds break easily", "Strong when trained on varied data"],
        ["Compute", "Tiny", "Low, CPU real-time", "Higher; GPU or optimised runtime for real-time"]
      ] } },
      { ul: [
        "<b>Rule-based is enough</b> (OpenCV): fixed camera and lighting — barcode or QR reading, counting parts on a conveyor, document scanning by finding the largest 4-corner contour, motion detection.",
        "<b>Needs a model</b>: 'is this a helmet?', reading number plates in traffic, defect types, faces in crowds — variation is too large for hand-written thresholds.",
        "<b>Typical hybrid</b>: OpenCV reads frames and resizes → model (YOLO, or OpenCV's own <code>cv2.dnn</code> running an ONNX model) detects → OpenCV draws boxes, crops, tracks and writes video."
      ] },
      { code: `import cv2, numpy as np, torch
from PIL import Image

frame = cv2.imread("img.jpg")                                    # BGR uint8 HWC
pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))    # OpenCV -> PIL (for torchvision)
back = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)             # PIL -> OpenCV

x = torch.from_numpy(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).permute(2, 0, 1).float() / 255
x = x.unsqueeze(0)                                               # (1, 3, H, W) for a CNN`, lang: "python", title: "Converting between the three worlds (not run: cv2)", run: false },
      { warn: "Don't reach for deep learning by reflex. If a 20-line OpenCV pipeline works reliably on fixed industrial images, it is faster, explainable and needs no labelled data. Equally, don't defend a pile of hand-tuned thresholds when the data is varied — that is the classic sign you need a model." },
      { tip: "Good closing line: 'I choose by how much the input varies and whether the task needs semantic understanding.' Model-side theory: <a href=\"#/core/ai/cnn\">CNNs</a> and <a href=\"#/core/ai/transfer-learning-fine-tuning\">transfer learning</a>." }
    ]
  },
    {
    id: "cv-face-detection-project",
    q: "How would you build a face or object detection project with OpenCV — Haar cascades vs DNN models, and what is the full pipeline?",
    topic: "OpenCV",
    level: 3,
    top: true,
    short: "Detection returns boxes plus scores. The classic option is a Haar cascade: fast on CPU, ships with OpenCV, but weak with side faces, poor light and false positives. Modern options are DNN detectors such as OpenCV's YuNet face detector, SSD or YOLO models through cv2.dnn or ultralytics: much more accurate and still real-time. The pipeline is capture frame, preprocess, detect, filter by confidence, apply non-max suppression to remove duplicates, then track, recognise or count and draw. Evaluate with precision, recall and mAP at an IoU threshold.",
    a: [
      { code: `import cv2

# 1) Classic: Haar cascade (Viola-Jones, 2001) -- XML file ships with opencv-python
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
img = cv2.imread("group.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
for (x, y, w, h) in faces:                          # boxes as (x, y, w, h)
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

# 2) Modern: YuNet CNN face detector (OpenCV 4.5.4+), model file from the OpenCV model zoo
det = cv2.FaceDetectorYN.create("face_detection_yunet_2023mar.onnx", "", (0, 0),
                                score_threshold=0.8, nms_threshold=0.3)
det.setInputSize((img.shape[1], img.shape[0]))      # (width, height)
_, results = det.detect(img)                        # rows: x, y, w, h, 5 landmarks, score

# 3) General objects: YOLO via ultralytics
# from ultralytics import YOLO
# boxes = YOLO("yolov8n.pt")(img)[0].boxes          # xyxy, conf, cls`, lang: "python", title: "Three ways to detect (not run: cv2 and model files)", run: false },
      { p: "Every detector produces overlapping boxes for the same object; <b>non-max suppression</b> keeps the best and removes duplicates using IoU. Interviewers like candidates who can write it:" },
      { code: `import numpy as np

def iou(box, boxes):
    """box: [x1, y1, x2, y2]; boxes: (N, 4). Intersection-over-Union."""
    x1 = np.maximum(box[0], boxes[:, 0]); y1 = np.maximum(box[1], boxes[:, 1])
    x2 = np.minimum(box[2], boxes[:, 2]); y2 = np.minimum(box[3], boxes[:, 3])
    inter = np.clip(x2 - x1, 0, None) * np.clip(y2 - y1, 0, None)
    area = lambda b: (b[..., 2] - b[..., 0]) * (b[..., 3] - b[..., 1])
    return inter / (area(box) + area(boxes) - inter)

def nms(boxes, scores, iou_thr=0.5):
    """Non-max suppression: keep the best box, drop overlapping duplicates, repeat."""
    order = scores.argsort()[::-1]
    keep = []
    while order.size:
        best = order[0]
        keep.append(int(best))
        rest = order[1:]
        order = rest[iou(boxes[best], boxes[rest]) < iou_thr]
    return keep

# a detector typically fires several overlapping boxes per face
boxes = np.array([[100, 100, 200, 200],   # face A
                  [105, 98, 205, 195],    # face A again (shifted)
                  [110, 110, 210, 210],   # face A again
                  [300, 120, 380, 200]],  # face B
                 dtype=np.float32)
scores = np.array([0.92, 0.88, 0.75, 0.81])
print("IoU of box0 with others:", iou(boxes[0], boxes[1:]).round(2))
print("kept boxes:", nms(boxes, scores))
# IoU of box0 with others: [0.85 0.68 0.  ]
# kept boxes: [0, 3]`, lang: "python", title: "IoU + NMS in NumPy (runs)" },
      { table: { head: ["", "Haar cascade", "DNN detector (YuNet / SSD / YOLO)"], rows: [
        ["How it works", "Hand-designed Haar features + boosted cascade, sliding window", "CNN trained on large labelled datasets"],
        ["Accuracy", "OK on frontal, well-lit faces; many false positives", "High; handles pose, scale, occlusion"],
        ["Speed", "Very fast on CPU", "Real-time on CPU for small models; GPU for big ones"],
        ["Extensibility", "Retraining is painful", "Fine-tune on your own classes (e.g. YOLO on helmets)"]
      ] } },
      { ul: [
        "<b>Detection vs recognition</b>: detection finds <i>where</i> faces are; recognition says <i>who</i> — crop each face, compute an embedding (FaceNet/ArcFace, or OpenCV's SFace) and compare with cosine similarity against enrolled users.",
        "<b>Evaluation</b>: a detection counts as correct if IoU ≥ 0.5 with a ground-truth box; report precision, recall and mAP@0.5 (or mAP@0.5:0.95).",
        "<b>Deployment</b>: export to ONNX, run with <code>cv2.dnn</code> or ONNX Runtime, process every Nth frame and track in between."
      ] },
      { warn: "Face recognition handles biometric data: mention consent, storing embeddings rather than raw photos, and testing accuracy across skin tones and lighting — see <a href=\"#/core/ai/bias-fairness-explainability\">bias, fairness and explainability</a>. Interviewers notice when you raise this unprompted." },
      { tip: "Tell the story with numbers: 'Haar gave many false positives on our CCTV footage, so I switched to YuNet; precision went from X to Y at 25 fps on CPU.' Concrete trade-offs beat buzzwords." }
    ]
  },

    /* ───────────── NLP ───────────── */
    {
    id: "nlp-preprocessing-pipeline",
    q: "What does a classic NLP text preprocessing pipeline look like — tokenization, lowercasing, stopwords, stemming vs lemmatization?",
    topic: "NLP",
    level: 1,
    top: true,
    short: "Classic preprocessing cleans the text by removing URLs and HTML, lowercases it, tokenizes it into words, removes punctuation and stopwords, and reduces words to a base form. Stemming chops suffixes by rules, so studies becomes studi: fast but crude. Lemmatization uses a vocabulary and part of speech to return a real word, so studies becomes study and better becomes good. This matters for bag-of-words and TF-IDF models, but transformer models need almost none of it, since their own tokenizer handles raw text.",
    a: [
      { code: `import re
from nltk.stem import PorterStemmer, SnowballStemmer          # rule-based: no corpus download
from nltk.tokenize import TreebankWordTokenizer                # regex-based: no download
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

text = "The batteries weren't charging, and the studies were running late! Visit https://x.io"

text = re.sub(r"https?://\\S+", " ", text)                   # 1. clean: strip URLs
tokens = TreebankWordTokenizer().tokenize(text.lower())      # 2. lowercase + tokenize
print(tokens)

tokens = ["not" if t == "n't" else t for t in tokens]          # 3. normalise negation
tokens = [t for t in tokens if t.isalpha()]                  #    drop punctuation / numbers
keep = {"not", "no", "nor"}                                  # negations matter for sentiment!
stop = ENGLISH_STOP_WORDS - keep
tokens = [t for t in tokens if t not in stop]                # 4. stopword removal
print(tokens)

porter = PorterStemmer()
print([porter.stem(t) for t in tokens])                      # 5. stemming: chop suffixes
print([porter.stem(w) for w in ["university", "universe", "was", "better"]])
print(SnowballStemmer("english").stem("generously"))
# ['the', 'batteries', 'were', "n't", 'charging', ',', 'and', 'the', 'studies', 'were', 'running', 'late', '!', 'visit']
# ['batteries', 'not', 'charging', 'studies', 'running', 'late', 'visit']
# ['batteri', 'not', 'charg', 'studi', 'run', 'late', 'visit']
# ['univers', 'univers', 'wa', 'better']
# generous`, lang: "python", title: "Pipeline with NLTK stemmers (no downloads needed)" },
      { code: `import nltk
nltk.download("wordnet")                                  # one-time corpus download
from nltk.stem import WordNetLemmatizer
lem = WordNetLemmatizer()
print(lem.lemmatize("studies"), lem.lemmatize("better", pos="a"), lem.lemmatize("running", pos="v"))
# study good run          <- needs the part of speech for best results

import spacy                                              # pip install spacy; python -m spacy download en_core_web_sm
nlp = spacy.load("en_core_web_sm")
print([(t.text, t.lemma_, t.pos_) for t in nlp("The batteries were charging")])
# [('The', 'the', 'DET'), ('batteries', 'battery', 'NOUN'), ('were', 'be', 'AUX'), ('charging', 'charge', 'VERB')]`, lang: "python", title: "Lemmatization (needs downloaded resources, so not run)", run: false },
      { table: { head: ["", "Stemming", "Lemmatization"], rows: [
        ["How", "Rule-based suffix stripping (Porter, Snowball)", "Dictionary lookup + part of speech (WordNet, spaCy)"],
        ["Output", "May not be a word: <i>studi</i>, <i>univers</i>", "A real word: <i>study</i>, <i>good</i>"],
        ["Speed", "Very fast", "Slower; needs a POS tagger"],
        ["Errors", "Over-stemming (university = universe), under-stemming", "Fewer, but depends on POS accuracy"],
        ["Use when", "Search engines, quick BoW baselines", "When meaning matters, user-facing features"]
      ] } },
      { warn: "Blindly removing stopwords kills sentiment: the default lists include <i>not</i>, <i>no</i>, <i>nor</i>, so 'not good' becomes 'good'. Notice the pipeline above normalises <i>n't</i> to <i>not</i> and keeps negations. For transformer models skip stemming and stopword removal entirely — they need the full sentence." },
      { tip: "Mention that preprocessing must be identical at training and inference time — put it in one function or a scikit-learn Pipeline (TfidfVectorizer accepts a custom <code>tokenizer</code> / <code>preprocessor</code>). Subword tokenization for transformers is a different thing: <a href=\"#/core/ai/tokenization\">tokenization</a>." }
    ]
  },
    {
    id: "nlp-bow-vs-tfidf",
    q: "What is the difference between Bag-of-Words and TF-IDF, and how do you compute them with scikit-learn?",
    topic: "NLP",
    level: 1,
    top: true,
    short: "Bag-of-Words represents a document as a vector of word counts over the vocabulary, ignoring order. TF-IDF multiplies each term's frequency by its inverse document frequency, so words that appear in every document, like 'the', get low weight and words that are distinctive for a document get high weight. In scikit-learn, CountVectorizer gives BoW and TfidfVectorizer gives TF-IDF, both as sparse matrices. Both lose word order and meaning, which n-grams partly fix and embeddings fix properly.",
    a: [
      { code: `from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

docs = ["the movie was good",
        "the movie was bad",
        "the acting was good good good"]

bow = CountVectorizer()
X = bow.fit_transform(docs)                       # sparse matrix: docs x vocabulary
print(bow.get_feature_names_out())
print(X.toarray())

tfidf = TfidfVectorizer()                         # smooth idf + L2-normalised rows by default
T = tfidf.fit_transform(docs)
print(dict(zip(tfidf.get_feature_names_out(), tfidf.idf_.round(2))))
print(T.toarray().round(2))

bigrams = CountVectorizer(ngram_range=(1, 2), min_df=1)
bigrams.fit(["not good", "good"])
print(bigrams.get_feature_names_out())            # 'not good' survives as a feature
# ['acting' 'bad' 'good' 'movie' 'the' 'was']
# [[0 0 1 1 1 1]
#  [0 1 0 1 1 1]
#  [1 0 3 0 1 1]]
# {'acting': 1.69, 'bad': 1.69, 'good': 1.29, 'movie': 1.29, 'the': 1.0, 'was': 1.0}
# [[0.   0.   0.56 0.56 0.43 0.43]
#  [0.   0.66 0.   0.5  0.39 0.39]
#  [0.38 0.   0.87 0.   0.22 0.22]]
# ['good' 'not' 'not good']`, lang: "python", title: "Counts vs TF-IDF weights on three tiny reviews" },
      { p: "Formula as scikit-learn implements it (default <code>smooth_idf=True</code>): <code>idf(t) = ln((1 + n) / (1 + df(t))) + 1</code>, then <code>tfidf = tf × idf</code>, then each row is L2-normalised. Check: 'the' is in all 3 docs → ln(4/4) + 1 = <b>1.0</b>; 'acting' is in 1 doc → ln(4/2) + 1 = <b>1.69</b>. So 'bad' (0.66) outweighs 'the' (0.39) in document 2 even though both appear once." },
      { table: { head: ["", "Bag-of-Words (counts)", "TF-IDF"], rows: [
        ["Value", "Raw term count", "Count × rarity across documents"],
        ["Common words", "Dominate the vector", "Down-weighted automatically"],
        ["Typical use", "Naive Bayes text classification", "Logistic regression / linear SVM baselines, keyword search, document similarity"],
        ["Shared limits", "No word order (except n-grams), no synonyms ('good' vs 'great' unrelated), huge sparse vocab", "Same"]
      ] } },
      { ul: [
        "Useful knobs: <code>ngram_range=(1, 2)</code>, <code>min_df</code> / <code>max_df</code> (drop rare / near-universal terms), <code>max_features</code>, <code>stop_words=\"english\"</code>, <code>sublinear_tf=True</code> (use 1 + log tf).",
        "Output is a SciPy sparse matrix — keep it sparse; <code>.toarray()</code> on 100k docs × 50k terms will exhaust memory.",
        "Fit the vectorizer on training text only (the vocabulary and IDF are learned state) — put it in a Pipeline."
      ] },
      { warn: "Words never seen during <code>fit</code> are silently ignored at <code>transform</code> time — a new product name or slang term simply vanishes. For open vocabularies consider <code>HashingVectorizer</code> or character n-grams (<code>analyzer=\"char_wb\"</code>), which also handle typos." },
      { tip: "TF-IDF + logistic regression is the baseline interviewers expect you to build first, before any transformer. It trains in seconds and is explainable via the coefficients. Why Naive Bayes pairs well with counts: <a href=\"#/core/ai/naive-bayes\">Naive Bayes</a>." }
    ]
  },
    {
    id: "nlp-word-vs-contextual-embeddings",
    q: "What is the difference between word embeddings like Word2Vec/GloVe and contextual embeddings from BERT?",
    topic: "NLP",
    level: 2,
    top: true,
    short: "Word2Vec, GloVe and fastText learn one fixed dense vector per word from co-occurrence, so similar words are close and king minus man plus woman lands near queen. But each word has exactly one vector regardless of context, so bank by the river and bank account share it. Contextual embeddings from transformer models like BERT are computed by running the whole sentence through self-attention, so each token's vector depends on its neighbours and the two banks get different vectors.",
    a: [
      { p: "The difference is visible in code: the embedding <i>table</i> inside BERT is a static lookup (like Word2Vec), while the encoder's <i>output</i> for the same token changes with the sentence. The model below is tiny and untrained — the values are meaningless, but the mechanism is exact:" },
      { code: `import os
os.environ["USE_TF"] = "0"
import torch
import torch.nn.functional as F
from transformers import BertConfig, BertModel

torch.manual_seed(0)
vocab = {"[CLS]": 2, "[SEP]": 3, "i": 5, "sat": 6, "by": 7, "the": 8, "river": 9,
         "bank": 10, "robbed": 11, "a": 12}
s1 = ["[CLS]", "i", "sat", "by", "the", "river", "bank", "[SEP]"]
s2 = ["[CLS]", "i", "robbed", "a", "bank", "[SEP]"]
ids1 = torch.tensor([[vocab[w] for w in s1]])
ids2 = torch.tensor([[vocab[w] for w in s2]])

# untrained tiny BERT: the numbers are meaningless, the MECHANISM is the point
model = BertModel(BertConfig(vocab_size=20, hidden_size=32, num_hidden_layers=2,
                             num_attention_heads=2, intermediate_size=64)).eval()
emb_table = model.embeddings.word_embeddings          # static lookup, like word2vec/GloVe

with torch.no_grad():
    static1 = emb_table(ids1)[0, s1.index("bank")]
    static2 = emb_table(ids2)[0, s2.index("bank")]
    ctx1 = model(input_ids=ids1).last_hidden_state[0, s1.index("bank")]
    ctx2 = model(input_ids=ids2).last_hidden_state[0, s2.index("bank")]

print("static  'bank' vectors identical:", torch.equal(static1, static2))
print("context 'bank' vectors identical:", torch.equal(ctx1, ctx2))
print("context cosine similarity < 1:", F.cosine_similarity(ctx1, ctx2, dim=0).item() < 0.999)
# static  'bank' vectors identical: True
# context 'bank' vectors identical: False
# context cosine similarity < 1: True`, lang: "python", title: "Same word, same static vector, different contextual vectors" },
      { table: { head: ["", "Static (Word2Vec 2013, GloVe 2014, fastText 2016)", "Contextual (ELMo 2018, BERT 2018 → today's encoders)"], rows: [
        ["Vectors per word", "One", "One per occurrence, computed from the sentence"],
        ["Polysemy (bank, apple)", "Mixed into one vector", "Handled"],
        ["Out-of-vocabulary", "Word2Vec/GloVe: none; fastText builds from character n-grams", "Subword tokenizer, so always some representation"],
        ["Cost", "Lookup table — microseconds, tiny", "Full transformer forward pass — needs more compute"],
        ["Typical use today", "Lightweight features, legacy systems, teaching", "Classification, NER, semantic search (sentence-transformers), RAG"]
      ] } },
      { ul: [
        "<b>Sentence embeddings</b>: averaging static vectors is a cheap baseline; for semantic search use models trained for it (sentence-transformers such as all-MiniLM-L6-v2), which pool token vectors into one vector per sentence.",
        "<b>Use in a classifier</b>: static vectors → average → logistic regression; contextual → fine-tune the encoder with a classification head."
      ] },
      { warn: "Don't take the raw BERT <code>[CLS]</code> vector from a model that was not fine-tuned and use it for cosine similarity — it performs poorly for semantic similarity. Use a model trained with a similarity objective (sentence-transformers), or mean-pool with the attention mask." },
      { tip: "The geometry of embeddings and how they power semantic search is core theory — link it: <a href=\"#/core/ai/embeddings\">embeddings</a>, <a href=\"#/core/ai/embeddings-semantic-search\">embeddings and semantic search</a>, <a href=\"#/core/ai/self-attention-qkv\">self-attention</a> (what makes them contextual)." }
    ]
  },
    {
    id: "nlp-sentiment-classifier",
    q: "What are the classic NLP tasks, and how would you build a sentiment classifier end to end?",
    topic: "NLP",
    level: 2,
    top: true,
    short: "Classic tasks: text classification like sentiment, spam or intent; token-level tagging like part-of-speech and named entity recognition; and sequence-to-sequence tasks like translation and summarization, plus question answering. For sentiment, start with labelled data and a stratified split, build a TF-IDF with bigrams plus logistic regression baseline in a Pipeline, evaluate with per-class precision, recall and F1, and inspect errors. If negation and context errors dominate, fine-tune a small transformer like DistilBERT, then serve the model behind an API.",
    a: [
      { table: { head: ["Task", "Input → output", "Example", "Typical model today"], rows: [
        ["Text classification", "Text → label", "Sentiment, spam, intent, topic", "TF-IDF + LR baseline; fine-tuned BERT-style encoder"],
        ["POS tagging", "Token → grammatical tag", "<i>book</i> → NOUN / VERB", "spaCy / fine-tuned encoder"],
        ["NER", "Token spans → entity type", "<i>Sundar Pichai</i> → PER, <i>Bengaluru</i> → LOC", "Token classification (BIO tags) with an encoder"],
        ["Question answering", "Question + context → answer span or text", "Support bots over docs", "Extractive encoder, or LLM + RAG"],
        ["Seq2seq", "Text → text", "Translation, summarization", "T5/BART, or decoder-only LLMs"]
      ] } },
      { code: `import random
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# synthetic reviews (in a real project: IMDb / product reviews / your scraped data)
random.seed(0)
POS = ["amazing", "great", "brilliant", "wonderful", "superb", "enjoyable", "fun"]
NEG = ["bad", "boring", "awful", "terrible", "dull", "weak", "predictable"]
NOUN = ["acting", "story", "music", "ending", "direction", "plot", "cast"]
def review(label):
    words = POS if label else NEG
    s = f"the {random.choice(NOUN)} was {random.choice(words)}"
    if random.random() < 0.3:                    # negated opposite: "and not boring" = positive
        s += f" and not {random.choice(NEG if label else POS)}"
    return s
labels = [random.randint(0, 1) for _ in range(600)]
texts = [review(l) for l in labels]
labels = [1 - l if random.random() < 0.05 else l for l in labels]   # 5% label noise

X_tr, X_te, y_tr, y_te = train_test_split(texts, labels, test_size=0.25,
                                          stratify=labels, random_state=0)
clf = make_pipeline(TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True),  # bigrams catch "not boring"
                    LogisticRegression(max_iter=1000))
clf.fit(X_tr, y_tr)
print(classification_report(y_te, clf.predict(X_te), digits=2))

vec, lr = clf.named_steps["tfidfvectorizer"], clf.named_steps["logisticregression"]
names, order = vec.get_feature_names_out(), lr.coef_[0].argsort()
print("most negative:", list(names[order[:3]]))
print("most positive:", list(names[order[-3:]]))
print(clf.predict(["the music was superb", "the plot was dull", "the cast was not boring"]))
#               precision    recall  f1-score   support
#
#            0       0.96      0.96      0.96        79
#            1       0.96      0.96      0.96        71
#
#     accuracy                           0.96       150
#    macro avg       0.96      0.96      0.96       150
# weighted avg       0.96      0.96      0.96       150
#
# most negative: ['was predictable', 'was terrible', 'was dull']
# most positive: ['was amazing', 'was wonderful', 'was superb']
# [1 0 0]`, lang: "python", title: "TF-IDF + logistic regression baseline" },
      { p: "Look at the last prediction: <i>'the cast was not boring'</i> is classified <b>negative</b>. The training data only had 'and not boring', so the model never saw 'was not boring'; the unigram <i>boring</i> pulls it negative. That is the bag-of-words ceiling — no real understanding of word order or negation scope — and exactly where a fine-tuned transformer earns its cost." },
      { ol: [
        "<b>Data</b>: collect and label (or use star ratings as weak labels); check class balance; dedupe; stratified split, by user or product if the same item appears many times.",
        "<b>Baseline</b>: TF-IDF (1–2 grams) + logistic regression in a Pipeline; tune <code>C</code> with cross-validation.",
        "<b>Evaluate</b>: per-class precision/recall/F1 and the confusion matrix; read 50 misclassified examples (sarcasm? negation? wrong labels?).",
        "<b>Upgrade</b>: fine-tune DistilBERT/RoBERTa with Trainer when errors are about context; try zero-shot LLM prompting as a quick check if you have no labels.",
        "<b>Ship</b>: save the pipeline, serve it with FastAPI, log inputs and predictions, watch for drift (new slang, new products)."
      ] },
      { warn: "Sentiment traps to mention: sarcasm ('great, it broke in a day'), negation, domain shift (a movie model on product reviews), mixed reviews ('great camera, awful battery' → aspect-based sentiment), and Hinglish or code-mixed text, common in Indian user data, which English-only models handle poorly." },
      { tip: "Theory links: <a href=\"#/core/ai/logistic-regression\">logistic regression</a>, <a href=\"#/core/ai/confusion-matrix\">confusion matrix</a>, <a href=\"#/core/ai/transfer-learning-fine-tuning\">transfer learning</a>." }
    ]
  },
    {
    id: "nlp-evaluation-transformers-impact",
    q: "How do you evaluate NLP models, and how have transformers changed NLP?",
    topic: "NLP",
    level: 2,
    top: false,
    short: "Evaluation depends on the task: accuracy and macro-F1 for classification, entity-level F1 for NER where a whole span must match, exact match and F1 for extractive QA, BLEU, chrF or ROUGE for translation and summarization, and perplexity for language models, with human or LLM-as-judge review for open-ended generation. Transformers changed the field from task-specific pipelines with hand-built features to pretrain then fine-tune with one architecture, and now to prompting large language models zero- or few-shot.",
    a: [
      { table: { head: ["Task", "Metric", "Watch out"], rows: [
        ["Classification", "Accuracy, macro-F1, per-class P/R", "Macro-F1 when classes are imbalanced"],
        ["NER", "Entity-level P/R/F1 (seqeval)", "Token accuracy is inflated by the many 'O' tokens"],
        ["Extractive QA", "Exact match (EM), token F1", "Normalise case and punctuation first"],
        ["Translation", "BLEU, chrF, COMET", "BLEU rewards n-gram overlap, not meaning"],
        ["Summarization", "ROUGE-1/2/L", "A fluent but unfaithful summary can score well"],
        ["Language modelling", "Perplexity", "Only comparable with the same tokenizer"],
        ["Open-ended generation / chat", "Human eval, LLM-as-judge, task success rate", "Judge bias; needs a rubric and spot checks"]
      ] } },
      { code: `from sklearn.metrics import f1_score

# NER with BIO tags: token-level vs entity-level scoring
true = ["B-PER", "I-PER", "O", "O", "B-LOC", "O", "O", "O"]
pred = ["B-PER", "O",     "O", "O", "B-LOC", "O", "O", "O"]   # person span cut short

token_acc = sum(t == p for t, p in zip(true, pred)) / len(true)

def spans(tags):
    out, start = set(), None
    for i, t in enumerate(tags + ["O"]):
        if start is not None and not t.startswith("I-"):
            out.add((start, i, tags[start][2:])); start = None
        if t.startswith("B-"):
            start = i
    return out

T, P = spans(true), spans(pred)
prec, rec = len(T & P) / len(P), len(T & P) / len(T)
print(f"token accuracy: {token_acc:.3f}")
print("true entities:", sorted(T), "| predicted:", sorted(P))
print(f"entity-level P={prec:.2f} R={rec:.2f} F1={2 * prec * rec / (prec + rec):.2f}")
print("macro-F1 over tag types:", round(f1_score(true, pred, average="macro", zero_division=0), 2))
# token accuracy: 0.875
# true entities: [(0, 2, 'PER'), (4, 5, 'LOC')] | predicted: [(0, 1, 'PER'), (4, 5, 'LOC')]
# entity-level P=0.50 R=0.50 F1=0.50
# macro-F1 over tag types: 0.73`, lang: "python", title: "Why NER is scored on whole entities" },
      { p: "Token accuracy says 0.875, but the person entity is wrong — only one of two entities is correct, so entity-level F1 is 0.50. That is why NER papers and libraries (seqeval) report entity-level scores." },
      { svg: `<svg viewBox="0 0 700 120" width="700" class="dg">
  <rect class="box" x="10" y="30" width="150" height="56" rx="6"/>
  <text class="tx tx-b" x="85" y="54" text-anchor="middle">Rules + features</text>
  <text class="tx-s" x="85" y="72" text-anchor="middle">regex, BoW, TF-IDF, CRF</text>
  <rect class="box" x="185" y="30" width="150" height="56" rx="6"/>
  <text class="tx tx-b" x="260" y="54" text-anchor="middle">Embeddings + RNN</text>
  <text class="tx-s" x="260" y="72" text-anchor="middle">word2vec, LSTM (2013–17)</text>
  <rect class="box-a" x="360" y="30" width="160" height="56" rx="6"/>
  <text class="tx tx-b" x="440" y="54" text-anchor="middle">Pretrain → fine-tune</text>
  <text class="tx-s" x="440" y="72" text-anchor="middle">BERT, T5 (2018–21)</text>
  <rect class="box-g" x="545" y="30" width="145" height="56" rx="6"/>
  <text class="tx tx-b" x="617" y="54" text-anchor="middle">Prompt LLMs</text>
  <text class="tx-s" x="617" y="72" text-anchor="middle">zero/few-shot, RAG</text>
  <line class="ln" x1="160" y1="58" x2="183" y2="58" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="335" y1="58" x2="358" y2="58" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="520" y1="58" x2="543" y2="58" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="350" y="108" text-anchor="middle">less task-specific engineering, more general pretrained models</text>
</svg>`, caption: "How NLP practice shifted" },
      { ul: [
        "<b>Before</b>: a separate pipeline per task — tokenize, POS-tag, hand-crafted features, a CRF or SVM — and lots of labelled data for each.",
        "<b>Transformers (2017) + BERT (2018)</b>: self-attention handles long-range context in parallel; pretraining on raw text then fine-tuning with a few thousand labels beat task-specific systems across benchmarks.",
        "<b>LLMs</b>: many tasks need no fine-tuning — a prompt with a few examples, or RAG for knowledge. Classic pipelines survive where cost, latency, privacy or explainability matter."
      ] },
      { tip: "A strong ending: 'I still start with a TF-IDF baseline to know what a transformer must beat, then evaluate both on the same held-out set and on a hand-picked set of hard cases (negation, sarcasm, rare entities).' For evaluating LLM outputs see <a href=\"#/core/ai/evaluating-llm-apps\">evaluating LLM apps</a>; architecture background in <a href=\"#/core/ai/what-is-llm\">what is an LLM</a>." }
    ]
  }
  ]
});
