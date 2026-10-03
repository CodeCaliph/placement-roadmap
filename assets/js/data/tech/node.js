/* tech stack: Node.js & Express — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "node",
  title: "Node.js & Express",
  short: "Node",
  icon: "⬢",
  blurb: "When Node.js and Express are on your resume, interviewers check whether you understand what happens under the hood (V8, libuv, the event loop phases, the thread pool), whether you can work with streams and buffers without blocking the loop, and whether you can build and secure a real REST API: middleware order, error handling, JWT and bcrypt, CORS, config, scaling and tests.",
  topics: [
    "Internals",
    "Core APIs",
    "Express",
    "APIs & Auth",
    "Production"
  ],
  questions: [

    /* ───────────── Internals ───────────── */
    {
      id: "what-is-node",
      q: "What is Node.js? How is it built, and how is it different from JavaScript in the browser?",
      topic: "Internals",
      level: 1,
      top: true,
      short: "Node.js is a JavaScript runtime for running JS outside the browser, mainly for servers and tooling. It combines Google's V8 engine, which compiles and runs JS, with libuv, a C library that provides the event loop, non-blocking I/O and a thread pool, plus C++ bindings and a standard library (fs, http, crypto, stream). The browser gives you the DOM and window. Node gives you the file system, sockets, processes and modules, with no DOM.",
      a: [
        { p: "<b>Node.js</b> (2009, Ryan Dahl) is <i>not</i> a language or a framework. It is a <b>runtime environment</b>. The key idea was to apply the browser's event-driven, non-blocking model to servers, so that one process can juggle thousands of concurrent connections without one thread per connection." },
        { svg: `<svg viewBox="0 0 640 250" width="640" class="dg">
  <rect class="box-g" x="20" y="15" width="600" height="40" rx="6"/>
  <text class="tx tx-b" x="320" y="35" text-anchor="middle" dominant-baseline="middle">Your JavaScript (app code + npm packages)</text>
  <rect class="box-p" x="20" y="70" width="600" height="40" rx="6"/>
  <text class="tx" x="320" y="90" text-anchor="middle" dominant-baseline="middle">Node.js standard library (JS): fs · http · stream · crypto · events · worker_threads</text>
  <rect class="box" x="20" y="125" width="600" height="30" rx="6"/>
  <text class="tx-m" x="320" y="140" text-anchor="middle" dominant-baseline="middle">Node bindings (C++): bridge between JS and native code</text>
  <rect class="box-a" x="20" y="170" width="250" height="60" rx="6"/>
  <text class="tx tx-b" x="145" y="192" text-anchor="middle">V8</text>
  <text class="tx-m" x="145" y="213" text-anchor="middle">parse · JIT compile · GC · call stack</text>
  <rect class="box-a" x="290" y="170" width="330" height="60" rx="6"/>
  <text class="tx tx-b" x="455" y="192" text-anchor="middle">libuv</text>
  <text class="tx-m" x="455" y="213" text-anchor="middle">event loop · epoll/kqueue/IOCP · thread pool (4)</text>
</svg>`, caption: "Node = V8 (runs JS) + libuv (async I/O and the event loop), glued together by C++ bindings." },
        { code: `const { versions, platform } = process;
console.log('node', versions.node, '| v8', versions.v8.split('-')[0], '| libuv', versions.uv);
console.log('platform:', platform === 'win32' || platform === 'linux' || platform === 'darwin');

// Things the browser does not have
const os = require('node:os');
const fs = require('node:fs');
console.log('cpus > 0:', os.cpus().length > 0, '| can read files:', fs.existsSync(__filename));
console.log(typeof window, typeof document, typeof globalThis.fetch);   // fetch is built in since Node 18`, lang: "javascript", title: "What the runtime exposes" },
        { code: `node 22.12.0 | v8 12.4.254.21 | libuv 1.49.1
platform: true
cpus > 0: true | can read files: true
undefined undefined function`, lang: "text", title: "Output on the machine that ran it (versions vary)" },
        { table: { head: ["", "Browser JS", "Node.js"], rows: [
          ["Engine", "V8 / SpiderMonkey / JavaScriptCore", "V8"],
          ["Globals", "<code>window</code>, <code>document</code>, DOM, <code>localStorage</code>", "<code>global</code>/<code>globalThis</code>, <code>process</code>, <code>Buffer</code>, <code>require</code>"],
          ["I/O access", "Sandboxed (no file system, limited network)", "Full: files, sockets, child processes, env vars"],
          ["Async backend", "Browser's Web APIs + event loop", "libuv event loop with phases + thread pool"],
          ["Modules", "ES modules", "CommonJS and ES modules"],
          ["Runtime version", "Whatever the user's browser has", "You choose (LTS lines such as 20, 22, 24)"]
        ] } },
        { p: "<b>Good fits:</b> I/O-heavy, high-concurrency work such as REST/GraphQL APIs, real-time apps (chat, WebSockets), streaming, BFF/API gateways, and CLIs and build tools (npm, Vite, ESLint). <b>Poor fit:</b> CPU-heavy work (video encoding, big number crunching, ML training) on the main thread, because it blocks every other request. Offload it with worker threads or another service." },
        { tip: "A crisp line to say: \"Node is single-threaded for <i>JavaScript</i> but not single-threaded overall. libuv uses the OS's async I/O and a small thread pool behind the scenes.\" That naturally leads into the event loop question that follows." }
      ]
    },
    {
      id: "non-blocking-io",
      q: "Node.js is single-threaded. How can it handle thousands of concurrent requests? What does non-blocking I/O mean?",
      topic: "Internals",
      level: 1,
      top: true,
      short: "Your JS runs on one main thread, but I/O is not performed by that thread. When a request needs the database or a file, Node hands the operation to the OS (epoll, kqueue, IOCP) or libuv's thread pool, registers a callback, and moves on to the next request. When the I/O completes, the event loop runs the callback. Waiting costs nothing, so one thread serves many connections. The catch: CPU-heavy synchronous code blocks everyone.",
      a: [
        { p: "<b>Blocking I/O</b>: the thread sits idle until the disk or network answers. Traditional servers (Apache prefork, classic Java servlets) dedicate a thread per request, and each one costs memory (about 1 MB of stack) plus context-switch overhead. <b>Non-blocking I/O</b>: the call returns immediately, and the result is delivered later through an event. Node's main thread only does the <i>short</i> CPU work of each request: parsing, business logic, serialising. Most of a request's lifetime is spent waiting on I/O, and Node does that waiting for free." },
        { table: { head: ["", "Thread-per-request", "Node event loop"], rows: [
          ["Concurrency unit", "OS thread", "Callback / promise on one thread"],
          ["Memory per connection", "Stack per thread (high)", "A few KB of objects (low)"],
          ["Shared state", "Needs locks (race conditions)", "No data races in JS code (one thread)"],
          ["CPU-bound work", "Other threads keep serving", "<b>Blocks every request</b>"],
          ["Best for", "CPU-heavy, blocking libraries", "I/O-heavy, many idle connections"]
        ] } },
        { code: `const http = require('node:http');

const busy = ms => { const end = Date.now() + ms; while (Date.now() < end); };   // CPU-bound, blocking

const server = http.createServer(async (req, res) => {
  if (req.url === '/cpu')  { busy(300); return res.end('cpu done'); }            // blocks the loop
  if (req.url === '/io')   { await new Promise(r => setTimeout(r, 300)); return res.end('io done'); } // non-blocking wait
  res.end('fast');
});

server.listen(0, '127.0.0.1', async () => {
  const base = 'http://127.0.0.1:' + server.address().port;
  const timed = async path => { const t = Date.now(); await (await fetch(base + path)).text(); return Date.now() - t; };

  // /fast while /io is waiting: answered immediately
  const [, fastDuringIo] = await Promise.all([timed('/io'), timed('/fast')]);
  console.log('fast request during I/O wait was quick (<150ms):', fastDuringIo < 150);

  // /fast while /cpu is spinning: stuck behind it
  const [, fastDuringCpu] = await Promise.all([timed('/cpu'), timed('/fast')]);
  console.log('fast request during CPU work had to wait (>250ms):', fastDuringCpu > 250);
  server.close();
});`, lang: "javascript", title: "One server, two kinds of slow" },
        { code: `fast request during I/O wait was quick (<150ms): true
fast request during CPU work had to wait (>250ms): true`, lang: "text", title: "Output" },
        { ul: [
          "Network sockets use the OS's readiness notification (<b>epoll</b> on Linux, <b>kqueue</b> on macOS, <b>IOCP</b> on Windows). No thread is needed per connection.",
          "File system calls, <code>dns.lookup</code>, and some <code>crypto</code>/<code>zlib</code> work have no good OS async API, so libuv runs them on its <b>thread pool</b> and posts the result back to the loop.",
          "Avoid <code>*Sync</code> APIs (<code>readFileSync</code>, <code>execSync</code>) in request handlers, as well as big <code>JSON.parse</code> of huge payloads, catastrophic regexes and heavy loops. They are fine at startup or in CLIs."
        ] },
        { tip: "Follow-up: \"So is Node good for a CPU-heavy image-resize API?\" Answer: not on the main thread. Use <code>worker_threads</code> or a job queue (BullMQ + workers), or call a service written for that, and keep the event loop free. For the OS view of threads, see <a href=\"#/core/os/process-vs-thread\">process vs thread</a>." }
      ]
    },
    {
      id: "event-loop-phases",
      q: "What are the phases of the Node.js event loop? How do process.nextTick, setImmediate and setTimeout differ?",
      topic: "Internals",
      level: 2,
      top: true,
      short: "libuv's loop cycles through phases: timers (expired setTimeout and setInterval callbacks), pending callbacks, idle/prepare, poll (wait for and run I/O callbacks), check (setImmediate) and close callbacks. Between every callback, Node drains the process.nextTick queue and then the promise microtask queue. So nextTick runs first, then promises, then setImmediate in the check phase right after I/O. setTimeout(fn, 0) waits for the next timers phase.",
      a: [
        { svg: `<svg viewBox="0 0 660 330" width="660" class="dg">
  <rect class="box-a" x="140" y="10" width="220" height="36" rx="6"/>
  <text class="tx tx-b" x="250" y="28" text-anchor="middle" dominant-baseline="middle">timers</text>
  <rect class="box" x="140" y="62" width="220" height="36" rx="6"/>
  <text class="tx" x="250" y="80" text-anchor="middle" dominant-baseline="middle">pending callbacks</text>
  <rect class="box" x="140" y="114" width="220" height="36" rx="6"/>
  <text class="tx" x="250" y="132" text-anchor="middle" dominant-baseline="middle">idle, prepare (internal)</text>
  <rect class="box-a" x="140" y="166" width="220" height="36" rx="6"/>
  <text class="tx tx-b" x="250" y="184" text-anchor="middle" dominant-baseline="middle">poll</text>
  <rect class="box-a" x="140" y="218" width="220" height="36" rx="6"/>
  <text class="tx tx-b" x="250" y="236" text-anchor="middle" dominant-baseline="middle">check</text>
  <rect class="box" x="140" y="270" width="220" height="36" rx="6"/>
  <text class="tx" x="250" y="288" text-anchor="middle" dominant-baseline="middle">close callbacks</text>
  <line class="ln" x1="250" y1="46" x2="250" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="98" x2="250" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="150" x2="250" y2="164" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="202" x2="250" y2="216" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="254" x2="250" y2="268" marker-end="url(#dg-arr)"/>
  <path class="ln" d="M140 288 L100 288 L100 28 L136 28" fill="none" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="92" y="160" text-anchor="end">next</text>
  <text class="tx-s" x="92" y="175" text-anchor="end">iteration</text>
  <text class="tx-m" x="372" y="28" dominant-baseline="middle">setTimeout / setInterval</text>
  <text class="tx-m" x="372" y="80" dominant-baseline="middle">deferred system errors</text>
  <text class="tx-m" x="372" y="184" dominant-baseline="middle">I/O callbacks; blocks here if idle</text>
  <text class="tx-m" x="372" y="236" dominant-baseline="middle">setImmediate</text>
  <text class="tx-m" x="372" y="288" dominant-baseline="middle">socket.on('close')</text>
  <rect class="box-g" x="440" y="100" width="210" height="58" rx="6"/>
  <text class="tx tx-b" x="545" y="122" text-anchor="middle">After EVERY callback:</text>
  <text class="tx-s" x="545" y="142" text-anchor="middle">1. nextTick queue  2. promise microtasks</text>
</svg>`, caption: "libuv event loop phases (Node 11+ drains microtasks after each individual callback)." },
        { table: { head: ["API", "Queue / phase", "Runs"], rows: [
          ["<code>process.nextTick(fn)</code>", "nextTick queue (Node-specific)", "As soon as the current operation finishes, before promises and before the loop continues"],
          ["<code>Promise.then</code> / <code>await</code> / <code>queueMicrotask</code>", "Microtask queue (V8)", "Right after the nextTick queue empties"],
          ["<code>setImmediate(fn)</code>", "<b>check</b> phase", "After the current poll phase, i.e. right after I/O callbacks"],
          ["<code>setTimeout(fn, 0)</code>", "<b>timers</b> phase", "Next loop iteration, once at least 1 ms has passed (0 is coerced to 1)"]
        ] } },
        { code: `const fs = require('node:fs');

console.log('1. sync');
setTimeout(() => {
  console.log('5. timers phase: setTimeout');
  fs.readFile(__filename, () => {
    console.log('6. poll phase: I/O callback');
    setTimeout(() => console.log('10. timers phase (next iteration)'), 0);
    setImmediate(() => console.log('9. check phase: setImmediate'));
    Promise.resolve().then(() => console.log('8. promise microtask'));
    process.nextTick(() => console.log('7. nextTick (beats the promise)'));
  });
}, 0);
Promise.resolve().then(() => console.log('4. promise microtask'));
process.nextTick(() => console.log('3. nextTick'));
console.log('2. sync');`, lang: "javascript", title: "Deterministic ordering demo" },
        { code: `1. sync
2. sync
3. nextTick
4. promise microtask
5. timers phase: setTimeout
6. poll phase: I/O callback
7. nextTick (beats the promise)
8. promise microtask
9. check phase: setImmediate
10. timers phase (next iteration)`, lang: "text", title: "Real output (Node 22)" },
        { warn: "Classic trick question: <code>setTimeout(a, 0); setImmediate(b);</code> in the <b>main module</b> has <b>non-deterministic</b> order. It depends on whether 1 ms has passed by the time the loop starts. Inside an I/O callback (as above), <code>setImmediate</code> always wins because check comes right after poll." },
        { p: "Recursive <code>process.nextTick</code> (or an endless promise chain) <b>starves</b> the event loop, because the loop never gets to the poll phase to accept I/O. Prefer <code>setImmediate</code> to yield between chunks of a long job. That is why the Node docs recommend <code>setImmediate</code> over <code>nextTick</code> for most deferral needs. Use <code>nextTick</code> mainly to emit events or errors after a constructor returns, so users can attach listeners first." },
        { tip: "The names are misleading. <code>nextTick</code> fires more immediately than <code>setImmediate</code>. Saying that out loud shows you have really used both. For the browser model (no phases, no nextTick) see the JavaScript event loop question." }
      ]
    },
    {
      id: "thread-pool-workers-cluster",
      q: "What is the libuv thread pool? When would you use worker_threads versus the cluster module?",
      topic: "Internals",
      level: 2,
      top: true,
      short: "libuv keeps a pool of 4 threads by default (UV_THREADPOOL_SIZE, max 1024) for operations without an async OS API: fs, dns.lookup, crypto pbkdf2/scrypt/randomBytes and zlib. Network I/O does not use it. worker_threads runs JavaScript in parallel threads inside one process, with message passing and optional SharedArrayBuffer; it is for CPU-heavy tasks. cluster forks several processes sharing one server port, one per core, to scale request throughput.",
      a: [
        { table: { head: ["", "libuv thread pool", "worker_threads", "cluster / child_process"], rows: [
          ["What runs there", "Native C work queued by Node core", "<b>Your JS</b> in a separate V8 isolate + event loop", "Whole separate Node <b>processes</b>"],
          ["You control it?", "Only the size (<code>UV_THREADPOOL_SIZE</code>)", "Yes: <code>new Worker(file)</code>", "Yes: <code>cluster.fork()</code>"],
          ["Memory", "Shared (C++)", "Separate heap per worker; can share <code>SharedArrayBuffer</code>", "Fully separate"],
          ["Communication", "N/A", "<code>postMessage</code> (structured clone), transferables", "IPC messages; ports shared via master"],
          ["Use for", "Automatic", "CPU-bound tasks: image processing, hashing, parsing big files", "Using all cores for an HTTP server"],
          ["Crash isolation", "N/A", "A worker error can be caught", "One worker dies, others keep serving"]
        ] } },
        { code: `const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }   // deliberately CPU-heavy

if (isMainThread) {
  let ticks = 0;
  const ticker = setInterval(() => ticks++, 10);          // proves the main loop stays free

  const worker = new Worker(__filename, { workerData: 35 });   // same file, worker branch
  worker.once('message', result => {
    clearInterval(ticker);
    console.log('fib(35) from worker =', result);
    console.log('main thread kept ticking meanwhile:', ticks > 3);
  });
  worker.once('error', err => console.error('worker failed', err));
} else {
  parentPort.postMessage(fib(workerData));               // runs on another thread
}`, lang: "javascript", title: "Offloading CPU work to a worker thread" },
        { code: `fib(35) from worker = 9227465
main thread kept ticking meanwhile: true`, lang: "text", title: "Output" },
        { code: `// server.js: one process per CPU core, all sharing port 3000
const cluster = require('node:cluster');
const http = require('node:http');
const os = require('node:os');

if (cluster.isPrimary) {
  const n = os.availableParallelism();               // Node 18.14+
  console.log(\`primary \${process.pid} forking \${n} workers\`);
  for (let i = 0; i < n; i++) cluster.fork();
  cluster.on('exit', (worker, code) => {
    console.log(\`worker \${worker.process.pid} died (\${code}), restarting\`);
    cluster.fork();                                   // self-healing
  });
} else {
  http.createServer((req, res) => res.end(\`handled by \${process.pid}\\n\`)).listen(3000);
}`, lang: "javascript", run: false, title: "cluster: scale an HTTP server across cores" },
        { ul: [
          "The pool is shared. Four slow <code>fs</code> or <code>crypto.pbkdf2</code> calls can delay a fifth <code>fs.readFile</code> or <code>dns.lookup</code>. That is a classic hidden latency source, and raising <code>UV_THREADPOOL_SIZE</code> (set before the pool is first used) is a known fix.",
          "<code>dns.lookup</code> (used by <code>http.get</code>) goes through the pool. <code>dns.resolve*</code> uses c-ares on the network and does not.",
          "Starting a worker costs a few ms and several MB of memory, so reuse workers through a pool (<code>piscina</code>) instead of spawning one per request.",
          "In production, PM2's cluster mode or several containers behind a load balancer usually replace hand-written <code>cluster</code> code."
        ] },
        { tip: "The one-sentence distinction: <b>workers for CPU, cluster for throughput, the thread pool is automatic</b>. For a refresher on processes and threads see <a href=\"#/core/os/process-vs-thread\">process vs thread</a>." }
      ]
    },

    /* ───────────── Core APIs ───────────── */
    {
      id: "streams-backpressure",
      q: "What are streams in Node.js? What is backpressure and how does pipe/pipeline handle it?",
      topic: "Core APIs",
      level: 2,
      top: true,
      short: "Streams process data piece by piece instead of loading it all into memory. There are four types: Readable, Writable, Duplex (both, like a TCP socket) and Transform (modify data in flight, like gzip). Backpressure happens when the consumer is slower than the producer: write() returns false once the internal buffer passes highWaterMark, and the producer should pause until 'drain'. pipe() and stream.pipeline() do this automatically; pipeline also forwards errors and cleans up every stream.",
      a: [
        { p: "Reading a 2 GB log with <code>fs.readFile</code> puts 2 GB in memory, and may fail outright. With <code>fs.createReadStream</code> memory stays at about one 64 KB chunk, and you can start sending bytes before the end of the file has been read. HTTP requests and responses, TCP sockets, <code>process.stdin/stdout</code>, zlib and crypto ciphers are all streams." },
        { table: { head: ["Type", "Example", "Key methods / events"], rows: [
          ["Readable", "<code>fs.createReadStream</code>, <code>req</code> (incoming HTTP)", "<code>'data'</code>, <code>'end'</code>, <code>pause()</code>, <code>for await...of</code>"],
          ["Writable", "<code>fs.createWriteStream</code>, <code>res</code> (HTTP response)", "<code>write()</code> → boolean, <code>end()</code>, <code>'drain'</code>, <code>'finish'</code>"],
          ["Duplex", "<code>net.Socket</code>", "Independent read and write sides"],
          ["Transform", "<code>zlib.createGzip()</code>, CSV parser", "Output is computed from input"]
        ] } },
        { code: `const { Writable, Readable, Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');

// 1. Backpressure by hand: a slow consumer with a tiny 4-byte buffer
const slow = new Writable({
  highWaterMark: 4,
  write(chunk, enc, done) { setTimeout(done, 5); },      // pretend this is a slow disk
});
let sent = 0, pauses = 0;
function produce() {
  while (sent < 10) {
    const ok = slow.write('ab'); sent++;
    if (!ok) { pauses++; slow.once('drain', produce); return; }  // respect backpressure
  }
  slow.end();
}
slow.on('finish', async () => {
  console.log(\`wrote \${sent} chunks, paused \${pauses} times for 'drain'\`);

  // 2. pipeline: source -> transform -> file, with backpressure + error handling built in
  async function* lines() { for (let n = 1; n <= 3; n++) yield \`line \${n}\\n\`; }
  const upper = new Transform({
    transform(chunk, enc, cb) { cb(null, chunk.toString().toUpperCase()); },
  });
  const file = path.join(os.tmpdir(), 'pipeline-demo.txt');
  await pipeline(Readable.from(lines()), upper, fs.createWriteStream(file));
  process.stdout.write(fs.readFileSync(file, 'utf8'));

  // 3. Readable streams are async iterables
  let bytes = 0;
  for await (const chunk of fs.createReadStream(__filename)) bytes += chunk.length;
  console.log('streamed this file, bytes match:', bytes === fs.statSync(__filename).size);
});
produce();`, lang: "javascript", title: "Backpressure, pipeline and async iteration" },
        { code: `wrote 10 chunks, paused 5 times for 'drain'
LINE 1
LINE 2
LINE 3
streamed this file, bytes match: true`, lang: "text", title: "Output" },
        { code: `// Serving a large file over HTTP without buffering it in memory
const { pipeline } = require('node:stream/promises');
const zlib = require('node:zlib');

app.get('/export', async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Encoding', 'gzip');
  try {
    await pipeline(fs.createReadStream('big.csv'), zlib.createGzip(), res);
  } catch (err) {
    // client disconnected or the file is missing: pipeline already destroyed every stream
    req.log?.warn(err);
  }
});`, lang: "javascript", run: false, title: "Real-world use (Express)" },
        { warn: "<code>src.pipe(dest)</code> handles backpressure but <b>not errors</b>. If <code>src</code> errors, <code>dest</code> is not closed, which leaks file descriptors. Prefer <code>stream.pipeline</code> (or <code>stream/promises</code>), which propagates errors and destroys all streams. Ignoring the return value of <code>write()</code> in a loop fills memory with buffered chunks, and that is the textbook backpressure bug." },
        { tip: "Default <code>highWaterMark</code> (Node 22): 64 KiB for <code>fs</code> read streams, 16 KiB for other byte streams (check with <code>stream.getDefaultHighWaterMark()</code>), and 16 objects in objectMode. It is a threshold, not a hard limit: you <i>can</i> keep writing past it, you just shouldn't." }
      ]
    },
    {
      id: "buffers",
      q: "What is a Buffer in Node.js, and why do we need it?",
      topic: "Core APIs",
      level: 2,
      top: false,
      short: "A Buffer is a fixed-size chunk of raw binary memory, allocated outside the V8 heap. It is a subclass of Uint8Array, used for bytes that are not text or that arrive in pieces: file contents, TCP packets, images, crypto output. You convert between bytes and strings with an explicit encoding (utf8, base64, hex). String length and byte length differ for non-ASCII text, and a multi-byte character can be split across chunks.",
      a: [
        { p: "JavaScript strings are UTF-16 text and cannot represent arbitrary bytes. Node needed binary data before typed arrays existed, so it introduced <code>Buffer</code>. Today <code>Buffer extends Uint8Array</code>, so typed-array methods work on it, and streams emit Buffers by default." },
        { code: `const b = Buffer.from('héllo ₹', 'utf8');
console.log(b);
console.log('bytes:', b.length, '| chars:', 'héllo ₹'.length, '| byteLength:', Buffer.byteLength('₹'));
console.log(b.toString('hex'));
console.log(b.toString('base64'), '->', Buffer.from(b.toString('base64'), 'base64').toString());

// subarray shares memory, Buffer.from(buf) copies
const view = b.subarray(0, 1);
view[0] = 0x48;                                     // 'H'
console.log(b.toString(), b instanceof Uint8Array);

// A multi-byte char split across two chunks (it happens with streams!)
const rupee = Buffer.from('₹');                     // 3 bytes: e2 82 b9
const [c1, c2] = [rupee.subarray(0, 2), rupee.subarray(2)];
console.log('naive:', JSON.stringify(c1.toString() + c2.toString()));
const { StringDecoder } = require('node:string_decoder');
const dec = new StringDecoder('utf8');
console.log('decoder:', dec.write(c1) + dec.end(c2));

// Binary protocols: fixed-width integers
const header = Buffer.alloc(6);
header.writeUInt16BE(0xCAFE, 0);
header.writeUInt32BE(258, 2);
console.log(header, header.readUInt32BE(2));
console.log(Buffer.concat([Buffer.from('ab'), Buffer.from('cd')]).toString());`, lang: "javascript", title: "Encoding, sharing, chunk boundaries, binary I/O" },
        { code: `<Buffer 68 c3 a9 6c 6c 6f 20 e2 82 b9>
bytes: 10 | chars: 7 | byteLength: 3
68c3a96c6c6f20e282b9
aMOpbGxvIOKCuQ== -> héllo ₹
Héllo ₹ true
naive: "��"
decoder: ₹
<Buffer ca fe 00 00 01 02> 258
abcd`, lang: "text", title: "Output" },
        { table: { head: ["Creation", "Behaviour"], rows: [
          ["<code>Buffer.alloc(n)</code>", "Zero-filled, safe"],
          ["<code>Buffer.allocUnsafe(n)</code>", "Not initialised (may contain old memory), faster. Overwrite before use"],
          ["<code>Buffer.from(string, enc)</code>", "Encode text to bytes"],
          ["<code>Buffer.from(arrayOrBuffer)</code>", "Copy"],
          ["<code>buf.subarray(s, e)</code>", "View over the same memory, no copy (<code>slice</code> is deprecated for Buffers)"],
          ["<code>new Buffer(n)</code>", "Deprecated and unsafe. Never use"]
        ] } },
        { warn: "Concatenating stream chunks with <code>data += chunk</code> converts each chunk to a string separately and corrupts multi-byte characters at chunk boundaries. Collect Buffers in an array and <code>Buffer.concat()</code> at the end, or call <code>stream.setEncoding('utf8')</code>, which uses a StringDecoder internally." },
        { tip: "Where Buffers show up in interviews: reading an uploaded file (multer gives <code>file.buffer</code>), base64-encoding images, hashing with <code>crypto</code>, JWT base64url segments, and \"why is <code>Content-Length</code> not <code>str.length</code>?\" (use <code>Buffer.byteLength</code>)." }
      ]
    },
    {
      id: "event-emitter",
      q: "What is the EventEmitter in Node.js? Is emit synchronous or asynchronous?",
      topic: "Core APIs",
      level: 2,
      top: false,
      short: "EventEmitter from node:events implements the observer pattern: on/addListener registers handlers, emit(name, ...args) calls them, once registers a one-shot handler and off removes one. Streams, HTTP servers, sockets and child processes all extend it. emit is synchronous: listeners run immediately, in registration order, before emit returns. An 'error' event with no listener throws and can crash the process.",
      a: [
        { p: "Much of Node's core is event-driven: <code>server.on('request')</code>, <code>stream.on('data')</code>, <code>process.on('exit')</code>. All of those objects inherit from <code>EventEmitter</code>, and you can extend it for your own decoupled modules, for example an order service that announces <code>'placed'</code> without knowing who listens (email, analytics, inventory)." },
        { code: `const EventEmitter = require('node:events');
const { once } = require('node:events');

class OrderService extends EventEmitter {
  place(order) {
    this.emit('placed', order);       // synchronous: all listeners run right here
    return order.id;
  }
}

const svc = new OrderService();
svc.on('placed', o => console.log('  email sent for order', o.id));
svc.once('placed', o => console.log('  first-order coupon for', o.id));
svc.prependListener('placed', o => console.log('  audit log', o.id));

console.log('before place()');
svc.place({ id: 1 });
console.log('after place(1)');
svc.place({ id: 2 });
console.log('listeners left:', svc.listenerCount('placed'));

// 'error' is special: with no listener, emit throws
try { svc.emit('error', new Error('payment gateway down')); }
catch (e) { console.log('unhandled error event throws:', e.message); }

// Await a single event as a promise
(async () => {
  setTimeout(() => svc.emit('ready', 'db connected'), 10);
  const [msg] = await once(svc, 'ready');
  console.log('awaited event:', msg);
})();`, lang: "javascript", title: "Custom emitter, once, ordering, error event" },
        { code: `before place()
  audit log 1
  email sent for order 1
  first-order coupon for 1
after place(1)
  audit log 2
  email sent for order 2
listeners left: 2
unhandled error event throws: payment gateway down
awaited event: db connected`, lang: "text", title: "Output" },
        { table: { head: ["Method", "Purpose"], rows: [
          ["<code>on(e, fn)</code> / <code>addListener</code>", "Subscribe (appends)"],
          ["<code>once(e, fn)</code>", "Subscribe for one call, then auto-remove"],
          ["<code>prependListener(e, fn)</code>", "Subscribe at the front of the list"],
          ["<code>off(e, fn)</code> / <code>removeListener</code>", "Unsubscribe (same function reference needed)"],
          ["<code>emit(e, ...args)</code>", "Call listeners synchronously; returns true if there were any"],
          ["<code>events.once(emitter, e)</code>", "Promise that resolves on the next event"],
          ["<code>setMaxListeners(n)</code>", "Change the leak warning threshold (default 10)"]
        ] } },
        { warn: "\"MaxListenersExceededWarning: Possible EventEmitter memory leak detected\" means you are adding listeners repeatedly, for example inside a request handler, and never removing them. Fix the leak (use <code>once</code> or <code>off</code>) instead of just raising the limit." },
        { tip: "If you need listeners to run asynchronously, wrap the work in <code>setImmediate</code> or <code>queueMicrotask</code> inside the listener. For the design-pattern view, see <a href=\"#/core/oops/observer-pattern\">observer pattern</a>." }
      ]
    },
    {
      id: "npm-package-json",
      q: "What are package.json, semantic versioning and package-lock.json, and how do dependencies differ from devDependencies?",
      topic: "Core APIs",
      level: 1,
      top: true,
      short: "package.json is the project manifest: name, version, scripts, entry point, module type, engines and dependency ranges. Versions follow semver MAJOR.MINOR.PATCH; ^1.4.2 allows any 1.x.x at or above 1.4.2, ~1.4.2 allows only 1.4.x patches. package-lock.json records the exact resolved version and integrity hash of every package in the tree, so installs are reproducible; commit it and use npm ci in CI. dependencies are needed at runtime, devDependencies only for development and build.",
      a: [
        { code: `{
  "name": "orders-api",
  "version": "1.3.0",
  "type": "module",
  "main": "src/server.js",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "node --watch --env-file=.env src/server.js",
    "start": "node src/server.js",
    "test": "jest --coverage",
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "pg": "~8.13.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "eslint": "^9.0.0"
  }
}`, lang: "json", title: "A typical Express API package.json" },
        { table: { head: ["Range", "Means", "Example matches"], rows: [
          ["<code>1.4.2</code>", "Exactly this version", "1.4.2"],
          ["<code>^1.4.2</code> (npm default)", "Same MAJOR: <code>&gt;=1.4.2 &lt;2.0.0</code>", "1.4.9, 1.9.0. Not 2.0.0"],
          ["<code>~1.4.2</code>", "Same MAJOR.MINOR: <code>&gt;=1.4.2 &lt;1.5.0</code>", "1.4.3, 1.4.9. Not 1.5.0"],
          ["<code>^0.3.1</code>", "For 0.x, caret locks the MINOR: <code>&lt;0.4.0</code>", "0.3.5. Not 0.4.0"],
          ["<code>*</code> / <code>latest</code>", "Anything (avoid)", "-"]
        ] } },
        { table: { head: ["Field", "Installed by <code>npm install</code> in the project", "Installed when someone installs <i>your</i> package", "Examples"], rows: [
          ["<code>dependencies</code>", "Yes", "Yes", "express, pg, mongoose, jsonwebtoken"],
          ["<code>devDependencies</code>", "Yes (skipped with <code>--omit=dev</code>)", "No", "jest, eslint, nodemon, typescript, @types/*"],
          ["<code>peerDependencies</code>", "Auto-installed since npm 7", "Host must provide a compatible copy", "react for a React component library"],
          ["<code>optionalDependencies</code>", "Tried; failure is OK", "Tried", "Platform-specific native add-ons"]
        ] } },
        { code: `npm install express            # add to dependencies (updates package.json + lock)
npm install -D jest            # add to devDependencies
npm ci                         # clean, exact install from package-lock.json (CI / Docker)
npm install --omit=dev         # production install without dev tools
npm outdated                   # what is behind the allowed / latest versions
npm audit                      # known vulnerabilities in the tree
npx eslint .                   # run a package binary without a global install
npm run dev                    # run a script from package.json`, lang: "bash", title: "Commands you should know" },
        { p: "<b>Why the lockfile matters:</b> <code>^4.18.0</code> could resolve to 4.18.0 on your laptop and 4.21.2 on the server six months later. The lockfile pins every transitive version and its integrity hash (SHA-512). <code>npm ci</code> deletes <code>node_modules</code>, installs exactly what the lockfile says, and fails if it disagrees with package.json. That makes it faster and reproducible, which is why it is the right command for Dockerfiles and CI." },
        { warn: "Don't commit <code>node_modules</code>, but <b>do</b> commit <code>package-lock.json</code>, for applications and libraries alike. Deleting the lockfile \"to fix install errors\" silently upgrades dozens of packages." },
        { tip: "For semver rules in general (what counts as a breaking change), see <a href=\"#/core/se/semantic-versioning\">semantic versioning</a>. Bonus points: mention <code>\"type\": \"module\"</code> for ESM, <code>engines</code> to pin the Node version, and pnpm/yarn as alternatives with their own lockfiles." }
      ]
    },
    {
      id: "error-handling-process",
      q: "How do you handle errors in Node.js? What are uncaughtException and unhandledRejection?",
      topic: "Core APIs",
      level: 2,
      top: true,
      short: "Handle each async style properly: try/catch for sync code and await, the err argument for error-first callbacks, .catch for promise chains and 'error' listeners for emitters and streams. uncaughtException fires when a thrown error reaches the event loop, and unhandledRejection fires when a rejected promise has no handler; since Node 15 an unhandled rejection crashes the process by default. Use these hooks only to log and exit, then let a process manager restart a clean process.",
      a: [
        { table: { head: ["Style", "How errors arrive", "How you handle them"], rows: [
          ["Synchronous", "<code>throw</code>", "<code>try/catch</code>"],
          ["Error-first callback", "<code>cb(err, data)</code>", "<code>if (err) return …</code>. A <code>try/catch</code> around the call does <b>not</b> work"],
          ["Promise / async-await", "Rejection", "<code>await</code> inside <code>try/catch</code>, or <code>.catch()</code>"],
          ["EventEmitter / stream", "<code>'error'</code> event", "<code>emitter.on('error', …)</code>, or <code>pipeline()</code>"]
        ] } },
        { p: "Separate <b>operational errors</b> (expected failures: DB timeout, invalid input, file not found, 3rd-party API down), which you handle, retry or report to the client, from <b>programmer errors</b> (bugs: reading a property of undefined, wrong argument type). For programmer errors, the safe response is to crash and restart, because the process may be in an inconsistent state." },
        { code: `const { spawnSync } = require('node:child_process');
const run = code => {
  const r = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8' });
  return { exit: r.status, out: r.stdout.trim(), err: r.stderr.split(/\\r?\\n/).find(l => l.startsWith('Error')) };
};

// 1. Default behaviour since Node 15: an unhandled rejection kills the process
console.log(run(\`Promise.reject(new Error('db timeout')); setTimeout(() => console.log('never'), 50);\`));

// 2. An uncaught throw inside a callback also kills it (try/catch outside cannot help)
console.log(run(\`try { setTimeout(() => { throw new Error('bug in callback'); }, 0); } catch { console.log('not caught here'); }\`));

// 3. The recommended last-resort handlers: log, then exit with failure
console.log(run(\`
  process.on('unhandledRejection', (reason) => { throw reason; });   // funnel into one handler
  process.on('uncaughtException', (err, origin) => {
    console.log('fatal (' + origin + '):', err.message);
    // flush logs, close server/DB here, then:
    process.exit(1);
  });
  Promise.reject(new Error('lost promise'));
\`));`, lang: "javascript", title: "What actually happens (child processes so we can see the exit codes)" },
        { code: `{ exit: 1, out: '', err: 'Error: db timeout' }
{ exit: 1, out: '', err: 'Error: bug in callback' }
{
  exit: 1,
  out: 'fatal (uncaughtException): lost promise',
  err: undefined
}`, lang: "text", title: "Output" },
        { code: `// Graceful shutdown: stop accepting work, finish in-flight requests, then exit
const server = app.listen(PORT);

function shutdown(signal) {
  logger.info({ signal }, 'shutting down');
  server.close(async () => {             // waits for open requests to finish
    await db.end();                      // close pools / queues
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();   // hard deadline
}
process.on('SIGTERM', shutdown);         // sent by Docker / Kubernetes / PM2
process.on('SIGINT', shutdown);          // Ctrl+C`, lang: "javascript", run: false, title: "Production pattern" },
        { warn: "Do <b>not</b> use <code>process.on('uncaughtException')</code> to \"keep the server alive\" and carry on. After an unknown exception, state such as open transactions, locks or half-written responses is undefined. Log it, exit, and let PM2, systemd or Kubernetes restart the process." },
        { tip: "Always throw <code>Error</code> objects (not strings) so you get a stack trace. You can add <code>{ cause }</code> (ES2022) to wrap low-level errors: <code>throw new Error('Order failed', { cause: dbErr })</code>." }
      ]
    },

    /* ───────────── Express ───────────── */
    {
      id: "express-basics",
      q: "What is Express.js and why use it over the plain http module? How do routing, req and res work?",
      topic: "Express",
      level: 1,
      top: true,
      short: "Express is a minimal web framework on top of Node's http module. It adds a router (method plus path patterns with params), a middleware pipeline, request helpers (req.params, req.query, req.body via express.json) and response helpers (res.status().json(), res.send, res.redirect). With plain http you parse URLs, bodies and headers and dispatch routes yourself. Express 5 is the current major version and natively catches rejected promises.",
      a: [
        { p: "Here is what Express saves you from writing, using raw <code>node:http</code>, which is runnable as-is:" },
        { code: `const http = require('node:http');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, \`http://\${req.headers.host}\`);
  const match = url.pathname.match(/^\\/users\\/(\\d+)$/);           // manual routing
  if (req.method === 'GET' && match) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ id: Number(match[1]), name: 'Asha', fields: url.searchParams.get('fields') }));
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(0, '127.0.0.1', async () => {
  const base = \`http://127.0.0.1:\${server.address().port}\`;
  const r1 = await fetch(base + '/users/42?fields=name');
  console.log(r1.status, r1.headers.get('content-type'), await r1.json());
  const r2 = await fetch(base + '/orders');
  console.log(r2.status, await r2.text());
  server.close();
});`, lang: "javascript", title: "Plain http: routing, query parsing and JSON by hand" },
        { code: `200 application/json { id: 42, name: 'Asha', fields: 'name' }
404 Not found`, lang: "text", title: "Output" },
        { code: `const express = require('express');
const app = express();

app.use(express.json());                       // parses JSON bodies into req.body

app.get('/users/:id', (req, res) => {          // route params
  const { id } = req.params;                   // '42' (always a string)
  const { fields } = req.query;                // ?fields=name
  res.json({ id: Number(id), name: 'Asha', fields });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).location('/users/43').json({ id: 43, name, email });
});

// Group routes with a Router (mounted at /api/orders)
const orders = express.Router();
orders.get('/', (req, res) => res.json([]));
orders.get('/:orderId', (req, res) => res.json({ id: req.params.orderId }));
app.use('/api/orders', orders);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));   // catch-all, registered last

app.listen(3000, () => console.log('listening on 3000'));`, lang: "javascript", run: false, title: "The same in Express" },
        { table: { head: ["req", "res"], rows: [
          ["<code>req.params</code>: path params (<code>/users/:id</code>)", "<code>res.status(201)</code>: set the status (chainable)"],
          ["<code>req.query</code>: query string object", "<code>res.json(obj)</code>: serialise and set Content-Type"],
          ["<code>req.body</code>: needs <code>express.json()</code> / <code>urlencoded()</code>", "<code>res.send(str|buf)</code>, <code>res.sendStatus(204)</code>"],
          ["<code>req.headers</code>, <code>req.get('Authorization')</code>", "<code>res.set(header, v)</code>, <code>res.cookie()</code>"],
          ["<code>req.method</code>, <code>req.path</code>, <code>req.ip</code>", "<code>res.redirect(302, url)</code>, <code>res.download()</code>"]
        ] } },
        { warn: "Send exactly <b>one</b> response per request. Calling <code>res.json()</code> twice, or forgetting <code>return</code> after an early <code>res.status(400).json()</code>, throws \"Cannot set headers after they are sent to the client\". The opposite mistake, never responding, leaves the request hanging until it times out." },
        { tip: "Express 5 (stable since late 2024, the npm <code>latest</code> since 2025) changes path syntax (<code>/*splat</code> instead of <code>*</code>, no <code>?</code> optional chars), removes old methods (<code>req.param()</code>, <code>res.send(status)</code>) and forwards rejected promises from async handlers to the error middleware. Mention which version you used. Alternatives: Fastify (faster, schema-based), NestJS (structured, DI, TypeScript)." }
      ]
    },
    {
      id: "express-middleware",
      q: "What is middleware in Express? How does next() work, and why does the order of middleware matter?",
      topic: "Express",
      level: 1,
      top: true,
      short: "Middleware is a function (req, res, next) that sits in the request pipeline. It can read or modify req and res, end the request by sending a response, or call next() to pass control to the next matching middleware or route. Express runs them strictly in registration order, so body parsers, CORS, auth and logging must be registered before the routes that need them, and 404 and error handlers go last. next(err) skips straight to error-handling middleware.",
      a: [
        { svg: `<svg viewBox="0 0 700 170" width="700" class="dg">
  <rect class="box-p" x="10" y="55" width="80" height="44" rx="6"/>
  <text class="tx tx-b" x="50" y="77" text-anchor="middle" dominant-baseline="middle">request</text>
  <rect class="box" x="115" y="55" width="100" height="44" rx="6"/>
  <text class="tx-s" x="165" y="77" text-anchor="middle" dominant-baseline="middle">logger</text>
  <rect class="box" x="235" y="55" width="100" height="44" rx="6"/>
  <text class="tx-s" x="285" y="77" text-anchor="middle" dominant-baseline="middle">express.json()</text>
  <rect class="box" x="355" y="55" width="100" height="44" rx="6"/>
  <text class="tx-s" x="405" y="77" text-anchor="middle" dominant-baseline="middle">auth</text>
  <rect class="box-a" x="475" y="55" width="100" height="44" rx="6"/>
  <text class="tx-s" x="525" y="77" text-anchor="middle" dominant-baseline="middle">route handler</text>
  <rect class="box-g" x="600" y="55" width="90" height="44" rx="6"/>
  <text class="tx tx-b" x="645" y="77" text-anchor="middle" dominant-baseline="middle">response</text>
  <line class="ln" x1="90" y1="77" x2="113" y2="77" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="215" y1="77" x2="233" y2="77" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="335" y1="77" x2="353" y2="77" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="455" y1="77" x2="473" y2="77" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="575" y1="77" x2="598" y2="77" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="345" y="40" text-anchor="middle">each arrow = next()</text>
  <rect class="box-r" x="355" y="120" width="220" height="36" rx="6"/>
  <text class="tx-s" x="465" y="138" text-anchor="middle" dominant-baseline="middle">error handler (err, req, res, next)</text>
  <line class="ln-a ln-d" x1="405" y1="99" x2="405" y2="118" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="300" y="113" text-anchor="middle">next(err) / 401</text>
</svg>`, caption: "Middleware forms a chain. Any step can respond and stop, call next(), or call next(err) to jump to the error handler." },
        { code: `const express = require('express');
const app = express();

// 1. App-level middleware: runs for every request, in this order
app.use((req, res, next) => {                       // custom logger
  const start = Date.now();
  res.on('finish', () => console.log(req.method, req.originalUrl, res.statusCode, Date.now() - start + 'ms'));
  next();                                           // forget this and the request hangs
});
app.use(express.json({ limit: '100kb' }));          // built-in body parser
app.use(cors({ origin: 'https://myapp.com' }));     // third-party

// 2. Middleware factory (closure) for route-level auth
const requireRole = role => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ error: 'Forbidden' });   // ends the chain
  next();
};

app.get('/health', (req, res) => res.send('ok'));                     // public, before auth
app.use('/api', authenticate);                                        // everything below /api needs a token
app.delete('/api/users/:id', requireRole('admin'), deleteUser);       // chain several per route

// 3. Must be LAST: 404 then error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));`, lang: "javascript", run: false, title: "Middleware types and ordering in a real app" },
        { p: "To understand <code>next()</code>, it helps to see that Express is essentially an array of functions plus an index. Here is a runnable 20-line version:" },
        { code: `function createApp() {
  const stack = [];
  return {
    use(fn) { stack.push(fn); },
    handle(req, res) {
      let i = 0;
      function next(err) {
        const fn = stack[i++];
        if (!fn) return res.end(err ? '500 ' + err.message : '404');
        const isErrorHandler = fn.length === 4;          // Express checks arity too!
        try {
          if (err && isErrorHandler) fn(err, req, res, next);
          else if (!err && !isErrorHandler) fn(req, res, next);
          else next(err);                                 // skip non-matching kind
        } catch (e) { next(e); }
      }
      next();
    },
  };
}

const app = createApp();
app.use((req, res, next) => { req.log = ['logger']; next(); });
app.use((req, res, next) => { if (!req.token) return next(new Error('no token')); next(); });
app.use((req, res, next) => { req.log.push('route'); res.end('200 hello'); });
app.use((err, req, res, next) => { req.log.push('errorHandler'); res.end('401 ' + err.message); });

const fakeRes = () => ({ end(body) { console.log(body); } });
const r1 = { token: 'abc' }; app.handle(r1, fakeRes()); console.log(r1.log);
const r2 = {};               app.handle(r2, fakeRes()); console.log(r2.log);`, lang: "javascript", title: "How next() works under the hood" },
        { code: `200 hello
[ 'logger', 'route' ]
401 no token
[ 'logger', 'errorHandler' ]`, lang: "text", title: "Output" },
        { warn: "Ordering bugs to recognise: (1) <code>express.json()</code> registered after the routes leaves <code>req.body</code> undefined. (2) A 404 catch-all registered before the routes makes every request return 404. (3) Auth registered globally before <code>/health</code> or <code>/login</code> locks out public routes. (4) The error handler is not last, or has only 3 parameters, so Express treats it as normal middleware." },
        { tip: "Calling <code>next('route')</code> skips the remaining handlers of the current route and moves to the next matching route. <code>next('router')</code> exits the current Router. Few candidates know these, so they make good bonus points." }
      ]
    },
    {
      id: "express-error-handling",
      q: "How do you handle errors in Express, including errors thrown in async route handlers?",
      topic: "Express",
      level: 2,
      top: true,
      short: "Define error-handling middleware with exactly four parameters (err, req, res, next) and register it after all routes. Synchronous throws in handlers are caught automatically. In Express 4, rejected promises from async handlers are not caught, so you need try/catch with next(err) or an asyncHandler wrapper. Express 5 forwards rejections to the error handler automatically. Use a custom error class with a status code, log the stack server-side, and send clients a safe message.",
      a: [
        { code: `// errors.js: an operational error carries its HTTP status
class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.expose = status < 500;           // safe to show the message to clients?
  }
}
const NotFound = what => new AppError(404, \`\${what} not found\`);

// Express 4 helper: forward async rejections to next()
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// routes
app.get('/users/:id', asyncHandler(async (req, res) => {     // Express 5: the wrapper is not needed
  const user = await db.users.findById(req.params.id);
  if (!user) throw NotFound('User');                           // caught -> error middleware
  res.json(user);
}));

app.get('/legacy', (req, res, next) => {
  fs.readFile('missing.txt', (err, data) => {
    if (err) return next(err);           // callbacks must call next(err) explicitly in any version
    res.send(data);
  });
});

// 404 for unknown routes
app.use((req, res, next) => next(NotFound(\`Route \${req.method} \${req.path}\`)));

// central error handler: 4 params, registered LAST
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);                      // delegate to Express's default handler
  const status = err.status ?? 500;
  req.log?.error({ err, path: req.path }, 'request failed');  // full stack in server logs only
  res.status(status).json({
    error: err.expose ? err.message : 'Internal Server Error',
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});`, lang: "javascript", run: false, title: "A production-style error setup" },
        { table: { head: ["Where the error happens", "Express 4", "Express 5"], rows: [
          ["<code>throw</code> in a sync handler", "Caught → error middleware", "Caught"],
          ["<code>throw</code> / rejection in an <code>async</code> handler", "<b>Not caught</b>: unhandled rejection, request hangs (or the process crashes on Node 15+)", "Caught automatically"],
          ["Error inside a callback (<code>fs.readFile</code>, <code>setTimeout</code>)", "Must call <code>next(err)</code>", "Must call <code>next(err)</code>"],
          ["<code>next(err)</code>", "Skips to error middleware", "Same"]
        ] } },
        { p: "Express identifies an error handler by <b>arity</b> (<code>fn.length === 4</code>). If you drop the unused <code>next</code> parameter because ESLint complains, Express treats the function as normal middleware and your errors fall through to the default HTML error page. You can have several error handlers, for example one that maps DB errors (unique violation → 409) and calls <code>next(err)</code>, then a final one that responds." },
        { warn: "Never send <code>err.stack</code> or raw DB error messages to clients in production. They leak table names, file paths and library versions. Also don't swallow errors with an empty <code>catch {}</code>: log them with context such as a request id." },
        { tip: "Mention validation errors: a schema library (zod/joi) failure becomes a <code>400</code> with field-level <code>details</code>, auth failures become <code>401</code>/<code>403</code>, and conflicts become <code>409</code>. A single error format across the API (or RFC 9457 \"problem details\") is what senior reviewers look for." }
      ]
    },

    /* ───────────── APIs & Auth ───────────── */
    {
      id: "rest-api-crud",
      q: "How would you build a CRUD REST API in Express with validation and correct status codes?",
      topic: "APIs & Auth",
      level: 2,
      top: true,
      short: "Model the resource as nouns under /api/v1/books and map HTTP methods to actions: GET list (with pagination), GET by id, POST create (201 with Location), PUT replace or PATCH partial update (200), DELETE (204). Validate every input (body, params, query) with a schema and return 400 on failure. Return 404 for missing ids and 409 for conflicts. Keep handlers thin by moving data access to a service layer, and send errors to a central error handler.",
      a: [
        { table: { head: ["Action", "Method + path", "Success", "Common errors"], rows: [
          ["List (paginated, filtered)", "<code>GET /api/v1/books?page=2&amp;limit=20&amp;author=x</code>", "200 + array (+ total)", "400 bad query"],
          ["Read one", "<code>GET /api/v1/books/:id</code>", "200", "404"],
          ["Create", "<code>POST /api/v1/books</code>", "<b>201</b> + <code>Location</code> header + body", "400 validation, 409 duplicate ISBN"],
          ["Replace", "<code>PUT /api/v1/books/:id</code>", "200 (or 204)", "400, 404"],
          ["Partial update", "<code>PATCH /api/v1/books/:id</code>", "200", "400, 404"],
          ["Delete", "<code>DELETE /api/v1/books/:id</code>", "<b>204</b> (no body)", "404 (or 204 if idempotent-friendly)"],
          ["Any, no/invalid token", "-", "-", "401 unauthenticated, 403 forbidden"]
        ] } },
        { code: `const express = require('express');
const { z } = require('zod');
const router = express.Router();

const BookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1),
  isbn: z.string().regex(/^\\d{13}$/, 'ISBN must be 13 digits'),
  price: z.number().nonnegative(),
});
const IdParam = z.object({ id: z.coerce.number().int().positive() });
const ListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Reusable validation middleware
const validate = (schema, where = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[where]);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors });
  }
  req.valid = { ...req.valid, [where]: result.data };      // use the parsed, typed values
  next();
};

router.get('/', validate(ListQuery, 'query'), async (req, res) => {
  const { page, limit } = req.valid.query;
  const { rows, total } = await books.list({ offset: (page - 1) * limit, limit });
  res.json({ data: rows, page, limit, total });
});

router.get('/:id', validate(IdParam, 'params'), async (req, res) => {
  const book = await books.get(req.valid.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

router.post('/', validate(BookSchema), async (req, res) => {
  if (await books.findByIsbn(req.valid.body.isbn)) return res.status(409).json({ error: 'ISBN already exists' });
  const created = await books.create(req.valid.body);
  res.status(201).location(\`/api/v1/books/\${created.id}\`).json(created);
});

router.patch('/:id', validate(IdParam, 'params'), validate(BookSchema.partial()), async (req, res) => {
  const updated = await books.update(req.valid.params.id, req.valid.body);
  if (!updated) return res.status(404).json({ error: 'Book not found' });
  res.json(updated);
});

router.delete('/:id', validate(IdParam, 'params'), async (req, res) => {
  const deleted = await books.remove(req.valid.params.id);
  if (!deleted) return res.status(404).json({ error: 'Book not found' });
  res.sendStatus(204);
});

module.exports = router;     // app.use('/api/v1/books', authenticate, router);`, lang: "javascript", run: false, title: "routes/books.js (Express 5: async errors reach the error handler)" },
        { ul: [
          "<b>Layering:</b> route (HTTP concerns) → service (business rules) → repository/model (SQL/ORM). Handlers stay testable and the DB can change.",
          "<b>Never trust the client:</b> whitelist fields (zod strips unknown keys by default), so <code>{ \"role\": \"admin\" }</code> in a body cannot reach your update. This is called mass-assignment protection.",
          "<b>Idempotency:</b> GET, PUT and DELETE should be safe to retry. For POST payments, accept an <code>Idempotency-Key</code> header.",
          "<b>Consistency:</b> plural nouns, no verbs in paths (<code>/books/:id/publish</code> is acceptable for real actions), a version prefix, and one error shape."
        ] },
        { warn: "Common mistakes: returning 200 with <code>{ error: … }</code> in the body, 500 for validation failures, <code>req.params.id</code> used as a number without converting it (it is always a string), and no upper bound on <code>limit</code> (<code>?limit=1000000</code> is an easy DoS)." },
        { tip: "Review the theory behind this: <a href=\"#/core/cn/rest-api\">REST principles</a>, <a href=\"#/core/cn/http-status-codes\">HTTP status codes</a>, <a href=\"#/core/cn/http-methods\">HTTP methods</a> and <a href=\"#/core/sd/idempotency\">idempotency</a>." }
      ]
    },
    {
      id: "jwt-authentication",
      q: "How does JWT authentication work in a Node/Express app? How does it compare with session-based auth?",
      topic: "APIs & Auth",
      level: 2,
      top: true,
      short: "On login the server verifies the password, then signs a JWT (header.payload.signature, base64url-encoded) containing claims like sub, role and exp, using a secret (HS256) or a private key (RS256). The client sends it in each request's Authorization: Bearer header or in a cookie, and middleware verifies the signature and expiry with no DB lookup. Sessions store state on the server, which is easy to revoke but needs a shared store. JWTs are stateless and scale easily but are hard to revoke, so keep them short-lived and add refresh tokens.",
      a: [
        { svg: `<svg viewBox="0 0 640 260" width="640" class="dg">
  <rect class="box-p" x="20" y="10" width="140" height="36" rx="6"/>
  <text class="tx tx-b" x="90" y="28" text-anchor="middle" dominant-baseline="middle">Client</text>
  <rect class="box-a" x="480" y="10" width="140" height="36" rx="6"/>
  <text class="tx tx-b" x="550" y="28" text-anchor="middle" dominant-baseline="middle">API server</text>
  <line class="ln ln-d" x1="90" y1="46" x2="90" y2="250"/>
  <line class="ln ln-d" x1="550" y1="46" x2="550" y2="250"/>
  <line class="ln" x1="90" y1="72" x2="546" y2="72" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="320" y="65" text-anchor="middle">1. POST /login { email, password }</text>
  <text class="tx-m" x="545" y="96" text-anchor="end">2. bcrypt.compare → sign JWT (secret)</text>
  <line class="ln-a" x1="550" y1="116" x2="94" y2="116" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="320" y="109" text-anchor="middle">3. { accessToken } (+ refresh token in httpOnly cookie)</text>
  <line class="ln" x1="90" y1="160" x2="546" y2="160" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="320" y="153" text-anchor="middle">4. GET /api/orders  Authorization: Bearer eyJ…</text>
  <text class="tx-m" x="545" y="184" text-anchor="end">5. verify signature + exp → req.user</text>
  <line class="ln-a" x1="550" y1="208" x2="94" y2="208" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="320" y="201" text-anchor="middle">6. 200 data   (or 401 if invalid / expired)</text>
  <text class="tx-c" x="320" y="240" text-anchor="middle">No session lookup: any server instance holding the key can verify.</text>
</svg>`, caption: "JWT login and request flow." },
        { p: "A JWT has three base64url parts joined by dots. <b>Header</b> <code>{\"alg\":\"HS256\",\"typ\":\"JWT\"}</code>, <b>payload</b> (claims such as <code>sub</code>, <code>role</code>, <code>iat</code>, <code>exp</code>) and <b>signature</b> = HMAC-SHA256(header.payload, secret). It is <b>signed, not encrypted</b>: anyone can decode the payload, but nobody can change it without the key. Here is HS256 built from scratch with <code>node:crypto</code>:" },
        { code: `const crypto = require('node:crypto');
const SECRET = 'dev-only-secret-use-32+-random-bytes';
const b64url = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
const hmac = data => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');

function sign(payload, expiresInSec) {
  const now = Math.floor(Date.now() / 1000);
  const data = b64url({ alg: 'HS256', typ: 'JWT' }) + '.' + b64url({ ...payload, iat: now, exp: now + expiresInSec });
  return data + '.' + hmac(data);
}

function verify(token) {
  const [h, p, s] = token.split('.');
  const header = JSON.parse(Buffer.from(h, 'base64url'));
  if (header.alg !== 'HS256') throw new Error('unexpected alg');       // block alg:none / alg confusion
  const expected = Buffer.from(hmac(h + '.' + p)), given = Buffer.from(s);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) throw new Error('invalid signature');
  const claims = JSON.parse(Buffer.from(p, 'base64url'));
  if (claims.exp <= Math.floor(Date.now() / 1000)) throw new Error('token expired');
  return claims;
}

const token = sign({ sub: 'user_42', role: 'student' }, 15 * 60);
console.log('parts:', token.split('.').length);
const { sub, role } = verify(token);
console.log('verified:', sub, role);

// Anyone can READ the payload without the secret
console.log('decoded without key:', JSON.parse(Buffer.from(token.split('.')[1], 'base64url')).role);

// ...but tampering breaks the signature
const [h, , s] = token.split('.');
const forged = h + '.' + b64url({ sub: 'user_42', role: 'admin', exp: 9999999999 }) + '.' + s;
try { verify(forged); } catch (e) { console.log('forged token:', e.message); }
try { verify(sign({ sub: 'user_42' }, -10)); } catch (e) { console.log('old token:', e.message); }`, lang: "javascript", title: "JWT sign/verify from first principles" },
        { code: `parts: 3
verified: user_42 student
decoded without key: student
forged token: invalid signature
old token: token expired`, lang: "text", title: "Output" },
        { code: `const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const user = await Users.findByEmail(req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });        // same message for both cases
  }
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken });
});

function authenticate(req, res, next) {
  const [scheme, token] = (req.get('Authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    res.status(401).json({ error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
  }
}`, lang: "javascript", run: false, title: "With the jsonwebtoken library" },
        { table: { head: ["", "Server sessions (express-session + Redis)", "JWT (stateless)"], rows: [
          ["Where state lives", "Server store; client has an opaque session id cookie", "In the token itself (client side)"],
          ["Per-request cost", "Store lookup (Redis ~1 ms)", "Signature check (CPU only)"],
          ["Scaling out", "Needs a shared store or sticky sessions", "Any instance with the key can verify"],
          ["Logout / revoke", "Delete the session: instant", "Hard: wait for <code>exp</code>, or keep a denylist (which reintroduces state)"],
          ["Size", "Small cookie (~32 bytes id)", "Hundreds of bytes on every request"],
          ["Best for", "Classic server-rendered web apps, admin panels", "Mobile apps, SPAs calling APIs, service-to-service, SSO"]
        ] } },
        { warn: "Security checklist: short access token TTL (5-15 min) plus a <b>rotating refresh token</b> in an <code>httpOnly; Secure; SameSite</code> cookie. Don't put secrets or PII in the payload. Pin <code>algorithms</code> in <code>verify</code>. Use a long random secret, or RS256 when other services must verify without being able to sign. <code>localStorage</code> tokens can be read by any XSS, while cookies need CSRF protection (SameSite=Lax/Strict or a CSRF token)." },
        { tip: "For the HTTP-level comparison of cookies, sessions and tokens, see <a href=\"#/core/cn/cookies-sessions-tokens\">cookies vs sessions vs tokens</a>. For signatures (HS256 vs RS256), see <a href=\"#/core/cn/digital-signatures-certificates\">digital signatures</a>." }
      ]
    },
    {
      id: "password-hashing-bcrypt",
      q: "How should you store user passwords in a Node.js app? Why bcrypt instead of SHA-256?",
      topic: "APIs & Auth",
      level: 2,
      top: true,
      short: "Never store passwords in plain text or encrypted form. Store a slow, salted, one-way hash produced by a password-hashing function: bcrypt, scrypt or Argon2id. The salt (random per user, stored in the hash string) defeats rainbow tables and makes identical passwords hash differently. The cost factor makes each guess deliberately expensive. SHA-256 is designed to be fast, so GPUs can try billions of guesses per second against a leaked database.",
      a: [
        { table: { head: ["Approach", "Problem"], rows: [
          ["Plain text", "One DB leak exposes every account (and other sites, because people reuse passwords)"],
          ["Encryption (AES)", "Reversible: whoever gets the key gets every password"],
          ["Plain SHA-256 / MD5", "Fast (GPU: billions/s) + unsalted identical hashes → rainbow tables, mass cracking"],
          ["SHA-256 + salt", "Rainbow tables defeated, but still fast to brute force"],
          ["<b>bcrypt / scrypt / Argon2id</b>", "Salted and <b>deliberately slow</b> (tunable cost; scrypt/Argon2 are also memory-hard) → recommended"]
        ] } },
        { code: `const bcrypt = require('bcrypt');          // or 'bcryptjs' (pure JS, no native build)
const SALT_ROUNDS = 12;                      // cost: 2^12 iterations, ~250 ms on a server CPU

async function register(email, password) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);   // generates + embeds the salt
  // e.g. $2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
  //       alg cost  22-char salt          31-char hash
  return Users.create({ email, passwordHash });
}

async function login(email, password) {
  const user = await Users.findByEmail(email);
  const ok = user && await bcrypt.compare(password, user.passwordHash);   // re-hashes with the stored salt
  if (!ok) throw new AppError(401, 'Invalid email or password');
  return user;
}`, lang: "javascript", run: false, title: "bcrypt in practice (async API: hashing runs on the libuv thread pool)" },
        { code: `const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);

// Built into Node, no npm package: scrypt is memory-hard
async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, 64, { N: 2 ** 14, r: 8, p: 1 });
  return \`scrypt$\${salt.toString('base64')}$\${key.toString('base64')}\`;   // store all parts together
}

async function verifyPassword(password, stored) {
  const [, saltB64, keyB64] = stored.split('$');
  const expected = Buffer.from(keyB64, 'base64');
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length, { N: 2 ** 14, r: 8, p: 1 });
  return crypto.timingSafeEqual(actual, expected);                       // constant-time compare
}

(async () => {
  const h1 = await hashPassword('Secret@123');
  const h2 = await hashPassword('Secret@123');
  console.log('format:', h1.split('$')[0], '| same password, different hashes:', h1 !== h2);
  console.log('correct password:', await verifyPassword('Secret@123', h1));
  console.log('wrong password:', await verifyPassword('secret@123', h1));

  const t = Date.now();
  for (let i = 0; i < 100000; i++) crypto.createHash('sha256').update('guess' + i).digest();
  console.log('100k SHA-256 guesses in under 2s on one core:', Date.now() - t < 2000);
})();`, lang: "javascript", title: "Runnable equivalent with node:crypto scrypt" },
        { code: `format: scrypt | same password, different hashes: true
correct password: true
wrong password: false
100k SHA-256 guesses in under 2s on one core: true`, lang: "text", title: "Output" },
        { ul: [
          "Use the <b>async</b> <code>bcrypt.hash</code>/<code>compare</code>. The sync versions block the event loop for about 250 ms per login.",
          "bcrypt only uses the first <b>72 bytes</b> of the password. Argon2id (the OWASP first choice) has no such limit.",
          "Raise the cost factor as hardware improves, and <b>rehash on login</b> when the stored cost is lower than the current one.",
          "Rate-limit the login endpoint and return the <b>same error</b> for \"no such user\" and \"wrong password\" so attackers can't enumerate accounts."
        ] },
        { tip: "Interviewers often ask \"what is a salt vs a pepper?\" A salt is random per user and stored next to the hash. A pepper is a secret shared by all users, stored outside the DB (env or KMS), and mixed in so that a DB-only leak is not enough. For hashing basics see <a href=\"#/core/cn/hashing\">hashing</a>." }
      ]
    },
    {
      id: "cors",
      q: "What is CORS, and how do you configure it correctly in an Express API?",
      topic: "APIs & Auth",
      level: 2,
      top: true,
      short: "Browsers enforce the same-origin policy: a page from one origin (scheme, host and port) cannot read responses from another origin unless that server allows it with CORS headers such as Access-Control-Allow-Origin. Non-simple requests (JSON bodies, Authorization headers, PUT or DELETE) first trigger an OPTIONS preflight, which the server must answer with allowed origin, methods and headers. In Express, use the cors middleware with an explicit allow-list. CORS is a browser rule; it does not protect your API from curl or other servers.",
      a: [
        { p: "<code>http://localhost:5173</code> (a Vite React app) calling <code>http://localhost:3000/api</code> is <b>cross-origin</b> because the port differs. The browser still <i>sends</i> simple requests, but it hides the response from your JS unless the server says the origin is allowed. For anything non-simple, it first asks permission with a <b>preflight</b>." },
        { table: { head: ["", "Simple request", "Preflighted request"], rows: [
          ["Methods", "GET, HEAD, POST", "PUT, PATCH, DELETE, …"],
          ["Headers / body", "Only safelisted headers; Content-Type form/text", "<code>Authorization</code>, <code>Content-Type: application/json</code>, custom headers"],
          ["Flow", "Request → check <code>Allow-Origin</code> on the response", "<code>OPTIONS</code> preflight → 2xx with allow headers → actual request"]
        ] } },
        { code: `const http = require('node:http');
const ALLOWED = new Set(['http://localhost:5173', 'https://myapp.com']);

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);     // echo the allowed origin
    res.setHeader('Vary', 'Origin');                         // caches must key on Origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {                            // preflight
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '600');          // browser may cache this for 10 min
    return res.writeHead(204).end();
  }
  res.setHeader('Content-Type', 'application/json');
  res.end('{"ok":true}');
});

// http.request lets us send the headers a browser would send
const send = (port, method, origin, extra = {}) => new Promise(resolve => {
  http.request({ host: '127.0.0.1', port, method, path: '/api/orders', headers: { Origin: origin, ...extra } }, res => {
    const cors = Object.fromEntries(Object.entries(res.headers).filter(([k]) => k.startsWith('access-control')));
    res.resume(); res.on('end', () => resolve({ status: res.statusCode, ...cors }));
  }).end();
});

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  console.log('preflight:', await send(port, 'OPTIONS', 'http://localhost:5173', {
    'Access-Control-Request-Method': 'DELETE', 'Access-Control-Request-Headers': 'authorization' }));
  console.log('allowed GET:', await send(port, 'GET', 'https://myapp.com'));
  console.log('evil origin:', await send(port, 'GET', 'https://evil.example'));
  server.close();
});`, lang: "javascript", title: "What CORS looks like on the wire (plain http)" },
        { code: `preflight: {
  status: 204,
  'access-control-allow-origin': 'http://localhost:5173',
  'access-control-allow-credentials': 'true',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE',
  'access-control-allow-headers': 'Content-Type,Authorization',
  'access-control-max-age': '600'
}
allowed GET: {
  status: 200,
  'access-control-allow-origin': 'https://myapp.com',
  'access-control-allow-credentials': 'true'
}
evil origin: { status: 200 }`, lang: "text", title: "Output: the evil origin gets data, but no allow header, so its browser blocks the JS from reading it" },
        { code: `const cors = require('cors');
const allowList = (process.env.CORS_ORIGINS || '').split(',');   // e.g. "https://myapp.com,http://localhost:5173"

app.use(cors({
  origin: (origin, cb) => (!origin || allowList.includes(origin))   // !origin: curl, mobile apps, same-origin
    ? cb(null, true)
    : cb(new Error('Not allowed by CORS')),
  credentials: true,                                     // allow cookies / Authorization
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}));                                                     // register BEFORE routes (also answers OPTIONS)`, lang: "javascript", run: false, title: "Express with the cors package" },
        { warn: "<code>Access-Control-Allow-Origin: *</code> cannot be combined with credentials; the browser rejects it. Reflecting <i>any</i> <code>Origin</code> together with <code>credentials: true</code> is a real vulnerability, because any site could make authenticated requests as your user and read the results. In development, a Vite/Next proxy avoids CORS entirely." },
        { tip: "Say this explicitly: <b>CORS is not authentication or a firewall.</b> It only stops <i>browsers</i> from exposing responses to other origins. Postman, curl and attacker servers ignore it, so your API still needs auth, rate limiting and validation." }
      ]
    },

    /* ───────────── Production ───────────── */
    {
      id: "env-config-dotenv",
      q: "How do you manage configuration and secrets in a Node.js app? What does dotenv do?",
      topic: "Production",
      level: 1,
      top: false,
      short: "Following the twelve-factor app, config that varies between environments (DB URLs, API keys, ports, JWT secrets) lives in environment variables, read via process.env, never hard-coded or committed. dotenv loads a local .env file into process.env for development. Since Node 20.6 you can use node --env-file=.env, and process.loadEnvFile() since 20.12 / 21.7. Validate and type-convert all config once at startup and fail fast; in production, inject secrets from the platform or a secrets manager.",
      a: [
        { code: `# .env  (git-ignored; commit a .env.example with dummy values instead)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://app:devpass@localhost:5432/orders
JWT_SECRET=change-me-to-64-random-bytes
CORS_ORIGINS=http://localhost:5173`, lang: "bash", title: ".env file" },
        { code: [
          { lang: "javascript", run: false, src: `// Option A: the dotenv package (works on every Node version)
require('dotenv').config();              // import 'dotenv/config' in ESM; must run before config is read
console.log(process.env.PORT);           // '3000' (always a string!)` },
          { lang: "bash", src: `# Option B: built into Node (20.6+), no dependency
node --env-file=.env src/server.js
node --watch --env-file=.env src/server.js      # dev mode with auto-restart (Node 22 stable)` }
        ], title: "Loading it" },
        { code: `const fs = require('node:fs'), os = require('node:os'), path = require('node:path');

// Write a demo .env and load it with Node 22's built-in loader
const envFile = path.join(os.tmpdir(), 'demo.env');
fs.writeFileSync(envFile, 'PORT=8080\\nJWT_SECRET=s3cr3t-from-file\\nFEATURE_X=true\\n# comment\\n');
process.env.PORT = '9000';                       // real env vars win over the file
process.loadEnvFile(envFile);

// config.js: read, convert, validate ONCE, then export a frozen object
function required(name) {
  const v = process.env[name];
  if (v === undefined || v === '') throw new Error(\`Missing required env var \${name}\`);
  return v;
}
const config = Object.freeze({
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: required('JWT_SECRET'),
  featureX: process.env.FEATURE_X === 'true',     // 'false' would be truthy as a string!
});
console.log(config.port, typeof config.port, config.featureX, config.jwtSecret.length > 0);

try { required('DATABASE_URL'); } catch (e) { console.log('fail fast at boot:', e.message); }`, lang: "javascript", title: "Loading and validating config (Node 22)" },
        { code: `9000 number true true
fail fast at boot: Missing required env var DATABASE_URL`, lang: "text", title: "Output" },
        { ul: [
          "<b>Everything in <code>process.env</code> is a string.</b> Convert numbers and booleans explicitly, or validate with zod/envalid.",
          "Neither dotenv nor <code>--env-file</code> overrides variables already set in the environment, which is exactly what you want in production.",
          "<b>Production:</b> no .env files on servers. Use Docker/Kubernetes env and secrets, CI secrets, or AWS Secrets Manager / Vault. Rotate them, and never log them.",
          "<code>NODE_ENV=production</code> matters: Express caches views and hides stack traces, and many libraries switch to faster code paths."
        ] },
        { warn: "If a secret is ever committed, deleting the file in a later commit does not help, because it stays in git history and forks. <b>Rotate the secret immediately</b>, then clean the history if needed. Add <code>.env</code> to <code>.gitignore</code> on day one." },
        { tip: "In a frontend bundle (React/Vite/Next.js), env values prefixed <code>VITE_</code> / <code>NEXT_PUBLIC_</code> are baked into public JS. Never put secrets there. Secrets belong only on the server." }
      ]
    },
    {
      id: "node-security",
      q: "What security best practices do you follow in a Node/Express API (helmet, rate limiting, validation, injection)?",
      topic: "Production",
      level: 2,
      top: true,
      short: "Defence in depth. Set secure HTTP headers with helmet, rate-limit (especially login and OTP routes), validate and whitelist every input with a schema, and prevent SQL injection with parameterised queries or an ORM. Prevent NoSQL injection by rejecting objects where strings are expected (the $ne/$gt trick). Cap body sizes, hash passwords, use HTTPS, keep dependencies patched with npm audit, never leak stack traces, and keep secrets in env vars.",
      a: [
        { table: { head: ["Threat", "Mitigation in Node/Express"], rows: [
          ["Missing security headers (clickjacking, MIME sniffing, XSS)", "<code>helmet()</code>: sets CSP, X-Frame-Options, HSTS, nosniff, removes X-Powered-By"],
          ["Brute force / credential stuffing / DoS", "<code>express-rate-limit</code> (Redis store when clustered), stricter on <code>/login</code>"],
          ["SQL injection", "Parameterised queries (<code>$1</code>, <code>?</code>) or an ORM. Never string-concatenate SQL"],
          ["NoSQL (operator) injection", "Validate types (zod), cast to String, strip <code>$</code> keys, Mongoose <code>sanitizeFilter</code>"],
          ["Mass assignment", "Whitelist fields from <code>req.body</code>; never <code>Model.update(req.body)</code>"],
          ["Large payload / ReDoS", "<code>express.json({ limit: '100kb' })</code>, avoid catastrophic regexes on user input"],
          ["XSS (rendered pages)", "Escape output (template engines do), CSP, <code>httpOnly</code> cookies"],
          ["Vulnerable dependencies", "<code>npm audit</code>, Dependabot/Renovate, lockfile, minimal deps"],
          ["Info leakage", "Generic 500 messages, no stack traces, <code>NODE_ENV=production</code>"]
        ] } },
        { code: `const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(express.json({ limit: '100kb' }));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
app.post('/auth/login', loginLimiter, login);
app.use('/api', rateLimit({ windowMs: 60 * 1000, limit: 100 }));

// SQL injection: BAD vs GOOD (node-postgres)
const bad  = await pool.query(\`SELECT * FROM users WHERE email = '\${req.body.email}'\`);   // ' OR '1'='1
const good = await pool.query('SELECT id, email FROM users WHERE email = $1', [req.body.email]);

// NoSQL injection: body {"email":"a@b.com","password":{"$ne":null}} matches ANY password
const user = await User.findOne({ email: req.body.email, password: req.body.password });   // BAD
// GOOD: validate types first, compare hashes, never query by raw password
const { email, password } = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);`, lang: "javascript", run: false, title: "The essentials in code" },
        { code: `// Why type validation stops operator injection: JSON bodies can contain objects, not just strings
const body = JSON.parse('{"email":"admin@site.com","password":{"$ne":null}}');

// A toy matcher with Mongo-like $ne semantics
const users = [{ email: 'admin@site.com', password: 'hash-of-real-password' }];
const matches = (doc, query) => Object.entries(query).every(([k, v]) =>
  v && typeof v === 'object' && '$ne' in v ? doc[k] !== v.$ne : doc[k] === v);

console.log('naive query logs in as admin:', users.some(u => matches(u, body)));

// Defence 1: reject non-strings
const isValid = typeof body.email === 'string' && typeof body.password === 'string';
console.log('type check rejects the payload:', !isValid);

// Defence 2: strip keys starting with $ (what mongo-sanitize does)
const strip = o => (o && typeof o === 'object')
  ? Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, strip(v)]))
  : o;
console.log('sanitized:', JSON.stringify(strip(body)));`, lang: "javascript", title: "NoSQL operator injection, demonstrated" },
        { code: `naive query logs in as admin: true
type check rejects the payload: true
sanitized: {"email":"admin@site.com","password":{}}`, lang: "text", title: "Output" },
        { warn: "Behind a proxy or load balancer (Nginx, Render, Heroku, AWS ALB), set <code>app.set('trust proxy', 1)</code>, or every request appears to come from the proxy's IP and rate limiting either blocks everyone or no one. Also: in-memory rate-limit counters don't work across cluster/PM2 instances, so use a Redis store." },
        { tip: "Structure the answer as the OWASP Top 10 mapped to Node tools, and you will sound senior. Theory links: <a href=\"#/core/dbms/sql-injection\">SQL injection</a>, <a href=\"#/core/sd/rate-limiting-algorithms\">rate limiting algorithms</a>, <a href=\"#/core/cn/network-attacks\">network attacks</a>." }
      ]
    },
    {
      id: "scaling-node",
      q: "How do you improve performance and scale a Node.js application (clustering, PM2, caching)?",
      topic: "Production",
      level: 3,
      top: true,
      short: "First keep the event loop free: no sync I/O or heavy CPU in handlers, offload CPU work to worker threads or queues, and stream large data. Then use all cores with cluster or PM2 cluster mode, and scale horizontally with stateless instances behind a load balancer (sessions and rate limits in Redis). Cut repeated work with caching (in-process LRU, Redis, HTTP caching or CDN), tune DB access (pooling, indexes, no N+1 queries), and measure with profiling and event-loop-lag metrics.",
      a: [
        { ol: [
          "<b>Measure first</b>: p95/p99 latency, throughput, <b>event loop lag</b> (<code>perf_hooks.monitorEventLoopDelay</code>), CPU, heap. Load test with autocannon or k6, and profile with <code>node --cpu-prof</code>, <code>--inspect</code> or clinic.js.",
          "<b>Unblock the loop</b>: async APIs only, worker threads for CPU tasks, a job queue (BullMQ + Redis) for slow side-work such as emails, PDFs and image resizing, and streams for big files.",
          "<b>Use every core</b>: cluster / PM2 <code>-i max</code>, or one container per core with Kubernetes doing the replication.",
          "<b>Scale out statelessly</b>: no in-memory sessions or uploads on local disk. Use a shared Redis/DB/S3 and put a load balancer (Nginx/ALB) in front. WebSockets need sticky sessions or a Redis pub/sub adapter.",
          "<b>Cache</b>: HTTP <code>Cache-Control</code>/ETag + CDN for public data; Redis for shared hot data (cache-aside with TTL); in-process LRU for tiny, hot, rarely-changing data.",
          "<b>Database</b>: connection pooling (<code>pg.Pool</code>), indexes, avoid N+1 (joins / batching / DataLoader), pagination, read replicas.",
          "<b>Cheap wins</b>: gzip/brotli at the proxy, <code>NODE_ENV=production</code>, keep-alive agents for outbound HTTP, a faster framework (Fastify) if routing overhead matters."
        ] },
        { code: `// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'orders-api',
    script: 'src/server.js',
    instances: 'max',            // one per CPU core
    exec_mode: 'cluster',        // PM2 uses node:cluster under the hood
    max_memory_restart: '500M',  // restart a leaking worker
    env_production: { NODE_ENV: 'production', PORT: 3000 },
  }],
};
// pm2 start ecosystem.config.js --env production
// pm2 reload orders-api      <- zero-downtime rolling restart
// pm2 logs | pm2 monit       <- logs and live CPU/memory
// pm2 startup && pm2 save    <- restart on server reboot`, lang: "javascript", run: false, title: "PM2: process manager with cluster mode" },
        { code: `// Cache-aside with TTL + in-flight de-duplication (prevents a cache stampede)
function cached(fn, ttlMs) {
  const store = new Map();                 // key -> { value, expires } or { promise }
  let hits = 0, misses = 0;
  const get = async key => {
    const e = store.get(key);
    if (e && (e.promise || e.expires > Date.now())) { hits++; return e.promise ?? e.value; }
    misses++;
    const promise = fn(key).then(value => { store.set(key, { value, expires: Date.now() + ttlMs }); return value; },
                                 err => { store.delete(key); throw err; });
    store.set(key, { promise });           // concurrent callers share this one promise
    return promise;
  };
  get.stats = () => ({ hits, misses });
  return get;
}

let dbCalls = 0;
const slowDbQuery = async id => { dbCalls++; await new Promise(r => setTimeout(r, 50)); return { id, name: 'Product ' + id }; };
const getProduct = cached(slowDbQuery, 200);

(async () => {
  await Promise.all(Array.from({ length: 100 }, () => getProduct(7)));   // 100 concurrent requests
  console.log('after burst:', getProduct.stats(), 'db calls:', dbCalls);
  await getProduct(7);
  await new Promise(r => setTimeout(r, 250));                              // TTL expires
  await getProduct(7);
  console.log('after TTL expiry:', getProduct.stats(), 'db calls:', dbCalls);
})();`, lang: "javascript", title: "In-process caching (same pattern as Redis cache-aside)" },
        { code: `after burst: { hits: 99, misses: 1 } db calls: 1
after TTL expiry: { hits: 100, misses: 2 } db calls: 2`, lang: "text", title: "Output" },
        { warn: "An in-process cache is per instance. With 8 PM2 workers you have 8 copies that can disagree after an update, and memory use is multiplied by 8. For shared or invalidatable data use Redis. Also cap any in-memory cache (LRU) or it becomes a memory leak." },
        { tip: "Link it to system design: <a href=\"#/core/sd/horizontal-vs-vertical-scaling\">horizontal vs vertical scaling</a>, <a href=\"#/core/sd/stateless-services\">stateless services</a>, <a href=\"#/core/sd/caching-strategies\">caching strategies</a> and <a href=\"#/core/sd/load-balancer\">load balancers</a>." }
      ]
    },
    {
      id: "testing-node-apis",
      q: "How do you test a Node.js/Express API? What are Jest and Supertest used for?",
      topic: "Production",
      level: 2,
      top: false,
      short: "Use a test pyramid: many fast unit tests for pure logic and services with dependencies mocked, fewer integration tests that hit real routes, and a few end-to-end tests. Jest (or Vitest, or the built-in node:test) is the runner and assertion and mocking library. Supertest drives your Express app in-process with HTTP requests, without opening a real port, so you can assert status codes, headers and JSON bodies. Export the app separately from app.listen so tests can import it.",
      a: [
        { table: { head: ["Level", "What it covers", "Tools", "Speed"], rows: [
          ["Unit", "Pure functions, services, validators (DB/HTTP mocked)", "Jest / Vitest / node:test, <code>jest.fn()</code>, <code>jest.mock()</code>", "ms each, run on every save"],
          ["Integration", "Route → middleware → service → test DB", "Supertest + Jest, Testcontainers / test DB, mongodb-memory-server", "Seconds"],
          ["E2E / contract", "Whole deployed system, real HTTP", "Playwright, Postman/Newman, Pact", "Slowest, fewest"]
        ] } },
        { code: [
          { lang: "javascript", run: false, src: `// app.js: build and export the app WITHOUT listening
const express = require('express');
const app = express();
app.use(express.json());
app.post('/api/sum', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') return res.status(400).json({ error: 'a and b must be numbers' });
  res.json({ result: a + b });
});
module.exports = app;

// server.js: the only file that listens
// require('./app').listen(process.env.PORT || 3000);` },
          { lang: "javascript", run: false, src: `// app.test.js: run with: npx jest
const request = require('supertest');
const app = require('./app');

describe('POST /api/sum', () => {
  it('adds two numbers', async () => {
    const res = await request(app).post('/api/sum').send({ a: 2, b: 3 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 5 });
  });

  it('rejects bad input with 400', async () => {
    const res = await request(app).post('/api/sum').send({ a: '2', b: 3 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/numbers/);
  });
});

// Mocking a dependency in a unit test
jest.mock('./mailer', () => ({ send: jest.fn().mockResolvedValue(true) }));
const mailer = require('./mailer');
it('sends a welcome email', async () => {
  await registerUser({ email: 'a@b.com' });
  expect(mailer.send).toHaveBeenCalledWith(expect.objectContaining({ to: 'a@b.com' }));
});` }
        ], title: "Jest + Supertest (the industry-standard combo)" },
        { p: "No npm packages? Node 20+ ships a stable test runner (<code>node:test</code>) and <code>node:assert</code>, and you can test an <code>http</code> handler by starting it on port 0:" },
        { code: `const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// unit under test
function validateSum(body) {
  if (typeof body.a !== 'number' || typeof body.b !== 'number') return { status: 400, error: 'a and b must be numbers' };
  return { status: 200, result: body.a + body.b };
}

test('validateSum: happy path', () => {
  assert.deepEqual(validateSum({ a: 2, b: 3 }), { status: 200, result: 5 });
});

test('validateSum: rejects strings', () => {
  assert.equal(validateSum({ a: '2', b: 3 }).status, 400);
});

test('HTTP integration: POST /api/sum', async () => {
  const server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', c => (raw += c)).on('end', () => {
      const out = validateSum(JSON.parse(raw));
      res.writeHead(out.status, { 'Content-Type': 'application/json' }).end(JSON.stringify(out));
    });
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try {
    const res = await fetch(\`http://127.0.0.1:\${server.address().port}/api/sum\`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ a: 4, b: 5 }),
    });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).result, 9);
  } finally {
    server.close();
  }
});`, lang: "javascript", title: "Built-in node:test (run with: node file.js or node --test)" },
        { code: `✔ validateSum: happy path (3.0715ms)
✔ validateSum: rejects strings (0.3223ms)
✔ HTTP integration: POST /api/sum (100.5307ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 116.9256`, lang: "text", title: "Output in a terminal (spec reporter; piped output uses TAP; timings vary)" },
        { ul: [
          "Use a <b>separate test database</b> (or Testcontainers), reset it between tests, and never point tests at production.",
          "Mock at the boundaries (email, payment, third-party HTTP with <code>nock</code>/<code>msw</code>), not your own code under test.",
          "Run tests in CI on every PR with coverage (<code>jest --coverage</code>). Aim for meaningful coverage of the business logic, not 100%."
        ] },
        { tip: "Interviewers like hearing \"I separated <code>app</code> from <code>server</code> so Supertest can inject requests without a port\", which shows you have actually done it. For general testing concepts see <a href=\"#/core/se/unit-test-example\">unit testing</a> and <a href=\"#/core/se/mocking\">mocking</a>." }
      ]
    }
  ]
});
