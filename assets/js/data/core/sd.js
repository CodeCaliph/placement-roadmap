/* core subject: System Design Basics — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "sd",
  title: "System Design Basics",
  short: "SD",
  icon: "▦",
  blurb: "Fresher-level system design: scaling, caching, databases, queues, APIs and reliability. Interviewers want clear trade-offs and simple box-and-arrow designs, not buzzwords.",
  topics: ["Fundamentals", "Scaling & Load Balancing", "Caching", "Databases at Scale", "Messaging & Async", "APIs & Communication", "Reliability", "Classic Designs"],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "horizontal-vs-vertical-scaling",
      q: "What is the difference between horizontal and vertical scaling?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Vertical scaling (scale up) makes one machine bigger — more CPU, RAM, disk. Horizontal scaling (scale out) adds more machines behind a load balancer; it is harder to build but has no hard ceiling and removes the single point of failure.",
      a: [
        { p: "<b>Vertical scaling</b> (scale up) = buy a bigger box. <b>Horizontal scaling</b> (scale out) = add more boxes and split the work between them." },
        { svg: `<svg viewBox="0 0 600 190" width="600" class="dg">
  <text class="tx tx-b" x="130" y="18" text-anchor="middle">Vertical (scale up)</text>
  <rect class="box" x="30" y="70" width="60" height="50" rx="6"/>
  <text class="tx" x="60" y="95" text-anchor="middle" dominant-baseline="middle">4 GB</text>
  <line class="ln-a" x1="95" y1="95" x2="150" y2="95" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="155" y="40" width="90" height="110" rx="6"/>
  <text class="tx tx-b" x="200" y="95" text-anchor="middle" dominant-baseline="middle">64 GB</text>
  <line class="ln ln-d" x1="300" y1="30" x2="300" y2="175"/>
  <text class="tx tx-b" x="460" y="18" text-anchor="middle">Horizontal (scale out)</text>
  <rect class="box-p" x="330" y="75" width="70" height="40" rx="6"/>
  <text class="tx" x="365" y="95" text-anchor="middle" dominant-baseline="middle">LB</text>
  <line class="ln" x1="400" y1="95" x2="470" y2="55" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="400" y1="95" x2="470" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="400" y1="95" x2="470" y2="135" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="475" y="38" width="80" height="32" rx="6"/>
  <text class="tx" x="515" y="54" text-anchor="middle" dominant-baseline="middle">Server 1</text>
  <rect class="box-g" x="475" y="79" width="80" height="32" rx="6"/>
  <text class="tx" x="515" y="95" text-anchor="middle" dominant-baseline="middle">Server 2</text>
  <rect class="box-g" x="475" y="120" width="80" height="32" rx="6"/>
  <text class="tx" x="515" y="136" text-anchor="middle" dominant-baseline="middle">Server 3</text>
  <text class="tx-m" x="460" y="178" text-anchor="middle">add more identical nodes</text>
</svg>`, caption: "Scale up = one bigger machine; scale out = many machines behind a load balancer" },
        { table: { head: ["", "Vertical", "Horizontal"], rows: [
          ["How", "Upgrade CPU/RAM/disk of one server", "Add more servers, distribute load"],
          ["Limit", "Hard ceiling (biggest machine money can buy)", "Practically unlimited"],
          ["Failure", "Single point of failure", "One node dies, others keep serving"],
          ["Complexity", "None in the app — just restart on bigger box", "Needs load balancer, stateless app, data partitioning"],
          ["Cost curve", "Gets expensive fast at the high end", "Commodity hardware, roughly linear"],
          ["Downtime", "Often needs a restart to resize", "Add/remove nodes live"]
        ] } },
        { p: "Real systems do both: scale the database vertically as long as possible (it is the hardest thing to distribute), and scale the stateless web/app tier horizontally from day one." },
        { tip: "Say the magic words: horizontal scaling <b>requires stateless services</b> (sessions moved to Redis/DB) and eventually <b>sharding</b> for the data tier. That shows you know why it is harder." }
      ]
    },
    {
      id: "latency-vs-throughput",
      q: "What is the difference between latency and throughput?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Latency is how long one request takes (ms); throughput is how many requests the system completes per unit time (req/s). They are related but different: batching raises throughput but can raise latency.",
      a: [
        { p: "<b>Latency</b> = time for a single operation to complete (e.g. 120 ms per API call). <b>Throughput</b> = amount of work done per unit time (e.g. 5,000 requests/s, 1 Gbps)." },
        { p: "Analogy: a highway. Latency is how long one car takes to drive end to end; throughput is how many cars pass the exit per minute. Adding lanes increases throughput without making any car faster." },
        { h: "Why they diverge" },
        { ul: [
          "<b>Batching</b> (e.g. Kafka producer batches, DB bulk inserts) raises throughput but each item waits longer → higher latency.",
          "<b>Queueing</b>: as utilisation approaches 100%, queues grow and latency shoots up even though throughput is flat (Little's Law: <code>L = λ × W</code>).",
          "<b>Parallelism</b> (more servers) raises throughput; it does not reduce the latency of a single request."
        ] },
        { h: "Latency numbers every engineer should know (approx.)" },
        { table: { head: ["Operation", "Time"], rows: [
          ["L1 cache reference", "~1 ns"],
          ["Main memory reference", "~100 ns"],
          ["SSD random read", "~16–100 µs"],
          ["Round trip within same datacenter", "~0.5 ms"],
          ["HDD disk seek", "~10 ms"],
          ["Round trip India ↔ US", "~150–250 ms"]
        ] } },
        { tip: "Measure latency with <b>percentiles</b> (p50, p95, p99), not averages. p99 = 1 in 100 users sees this or worse; one slow dependency dominates tail latency." }
      ]
    },
    {
      id: "availability-nines",
      q: "What does 'five nines' availability mean? How do you calculate downtime?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Availability = uptime / total time. Each extra 'nine' cuts allowed downtime by 10×: 99.9% allows ~8.8 hours/year, 99.99% ~53 minutes/year, 99.999% ~5 minutes/year.",
      a: [
        { p: "<b>Availability</b> = uptime / (uptime + downtime), usually promised in an <b>SLA</b> as a number of nines." },
        { table: { head: ["Availability", "Downtime / year", "Downtime / month", "Downtime / day"], rows: [
          ["99% (two nines)", "3.65 days", "~7.3 hours", "14.4 min"],
          ["99.9% (three nines)", "8.76 hours", "~43.8 min", "1.44 min"],
          ["99.99% (four nines)", "52.6 min", "~4.4 min", "8.6 s"],
          ["99.999% (five nines)", "5.26 min", "~26 s", "0.86 s"]
        ] } },
        { h: "Combining components" },
        { ul: [
          "<b>In series</b> (request needs A <i>and</i> B): <code>A × B</code>. Two 99.9% services in a chain → 99.8%. Every dependency lowers availability.",
          "<b>In parallel</b> (redundant; either A <i>or</i> B works): <code>1 − (1−A)(1−B)</code>. Two 99% replicas → 99.99%. Redundancy raises availability."
        ] },
        { p: "Terms: <b>SLI</b> = the metric you measure (success rate), <b>SLO</b> = internal target (99.95%), <b>SLA</b> = contractual promise with penalties (99.9%)." },
        { tip: "Point out that five nines leaves no time for a human to respond — it demands automated failover, redundancy in every layer and zero-downtime deploys." }
      ]
    },
    {
      id: "back-of-envelope-estimation",
      q: "How do you do a back-of-the-envelope estimation? Walk through an example.",
      topic: "Fundamentals",
      level: 2,
      top: true,
      short: "Start from daily active users and actions per user, convert to requests per second (divide by ~86,400 ≈ 10^5), apply a read/write ratio and peak factor, then estimate storage (size × count × retention) and bandwidth (QPS × size).",
      a: [
        { p: "Estimation shows you can size a system before designing it. Round aggressively — the goal is the <b>order of magnitude</b>, not the exact number." },
        { h: "Handy constants" },
        { ul: [
          "1 day = 86,400 s ≈ <b>10<sup>5</sup> s</b>; 1 month ≈ 2.5 × 10<sup>6</sup> s",
          "1 million req/day ≈ <b>12 req/s</b>",
          "KB = 10<sup>3</sup>, MB = 10<sup>6</sup>, GB = 10<sup>9</sup>, TB = 10<sup>12</sup>, PB = 10<sup>15</sup> bytes",
          "Peak traffic ≈ 2–3× average"
        ] },
        { h: "Worked example: URL shortener" },
        { ol: [
          "<b>Assume</b>: 100 M new short URLs/day, read:write = 100:1, each record ~500 bytes, keep 5 years.",
          "<b>Write QPS</b>: 10<sup>8</sup> / 10<sup>5</sup> ≈ <b>1,000/s</b> (peak ~2,500/s).",
          "<b>Read QPS</b>: 100 × 1,000 = <b>100,000/s</b> (peak ~250k/s) → needs caching.",
          "<b>Storage</b>: 10<sup>8</sup>/day × 500 B = 50 GB/day → ×365 ≈ 18 TB/year → ×5 ≈ <b>90 TB</b> → must shard.",
          "<b>Bandwidth (read)</b>: 10<sup>5</sup>/s × 500 B = <b>50 MB/s</b>.",
          "<b>Cache</b>: 80/20 rule — cache the hot 20% of a day's reads: 10<sup>10</sup> reads/day × 500 B × 0.2 ≈ 1 TB upper bound (far less once duplicates are removed) → a few Redis nodes.",
          "<b>Key space</b>: 5 years × 365 × 10<sup>8</sup> ≈ 1.8 × 10<sup>11</sup> URLs; 62<sup>7</sup> ≈ 3.5 × 10<sup>12</sup> → 7-char base62 codes are enough."
        ] },
        { tip: "State assumptions out loud and write them down. Interviewers care about the reasoning chain and that you draw conclusions (\"100k reads/s → we need a cache\", \"90 TB → we need sharding\")." },
        { warn: "Do not spend 15 minutes on arithmetic. 3–5 minutes of estimation, then move to the design." }
      ]
    },

    /* ───────────── Scaling & Load Balancing ───────────── */
    {
      id: "load-balancer",
      q: "What is a load balancer and why do we need it? What is L4 vs L7 load balancing?",
      topic: "Scaling & Load Balancing",
      level: 1,
      top: true,
      short: "A load balancer distributes incoming requests across a pool of servers, performs health checks and removes dead servers, enabling horizontal scaling and high availability. L4 balances on IP/port (fast); L7 reads HTTP (URL, headers, cookies) for smarter routing.",
      a: [
        { p: "A <b>load balancer (LB)</b> sits between clients and a pool of servers, spreading traffic so no single server is overloaded and hiding server failures from clients." },
        { svg: `<svg viewBox="0 0 620 220" width="620" class="dg">
  <rect class="box" x="10" y="90" width="90" height="40" rx="6"/>
  <text class="tx tx-b" x="55" y="110" text-anchor="middle" dominant-baseline="middle">Clients</text>
  <line class="ln-a" x1="100" y1="110" x2="165" y2="110" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="170" y="85" width="110" height="50" rx="6"/>
  <text class="tx tx-b" x="225" y="104" text-anchor="middle" dominant-baseline="middle">Load Balancer</text>
  <text class="tx-m" x="225" y="122" text-anchor="middle" dominant-baseline="middle">active</text>
  <rect class="box" x="170" y="160" width="110" height="40" rx="6"/>
  <text class="tx-m" x="225" y="180" text-anchor="middle" dominant-baseline="middle">standby LB</text>
  <line class="ln ln-d" x1="225" y1="135" x2="225" y2="158"/>
  <line class="ln" x1="280" y1="110" x2="360" y2="45" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="110" x2="360" y2="110" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="110" x2="360" y2="175" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="365" y="25" width="100" height="40" rx="6"/>
  <text class="tx" x="415" y="45" text-anchor="middle" dominant-baseline="middle">App server 1</text>
  <rect class="box-g" x="365" y="90" width="100" height="40" rx="6"/>
  <text class="tx" x="415" y="110" text-anchor="middle" dominant-baseline="middle">App server 2</text>
  <rect class="box-r" x="365" y="155" width="100" height="40" rx="6"/>
  <text class="tx" x="415" y="175" text-anchor="middle" dominant-baseline="middle">App 3 (down)</text>
  <line class="ln" x1="465" y1="45" x2="525" y2="100" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="465" y1="110" x2="525" y2="110" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="530" y="90" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="570" y="110" text-anchor="middle" dominant-baseline="middle">Database</text>
  <text class="tx-m" x="415" y="212" text-anchor="middle">health check fails → no traffic</text>
</svg>`, caption: "Clients hit the LB; unhealthy servers are removed from rotation; LB itself has a standby" },
        { h: "What an LB does" },
        { ul: [
          "Distributes requests (round robin, least connections, hashing...)",
          "<b>Health checks</b> — stops sending to dead servers",
          "SSL/TLS termination, compression, connection pooling",
          "Enables zero-downtime deploys (drain a server, update, re-add)"
        ] },
        { table: { head: ["", "L4 (transport)", "L7 (application)"], rows: [
          ["Looks at", "IP address, TCP/UDP port", "HTTP path, headers, cookies, host"],
          ["Speed", "Very fast, low overhead", "Slower — must parse the request"],
          ["Routing", "Connection-level", "Content-based: <code>/api</code> → API pool, <code>/img</code> → static pool"],
          ["Examples", "AWS NLB, LVS", "AWS ALB, Nginx, HAProxy (HTTP mode), Envoy"]
        ] } },
        { warn: "A single LB is itself a single point of failure. Run LBs in an active-passive (or active-active) pair with a floating IP / DNS failover." }
      ]
    },
    {
      id: "load-balancing-algorithms",
      q: "Explain common load balancing algorithms: round robin, least connections, IP hash, consistent hashing.",
      topic: "Scaling & Load Balancing",
      level: 2,
      top: true,
      short: "Round robin cycles through servers in order; weighted round robin favours bigger servers; least connections picks the server with fewest active connections; IP/key hashing sends the same client to the same server; consistent hashing keeps that mapping stable when servers are added or removed.",
      a: [
        { table: { head: ["Algorithm", "How it works", "Good for", "Weakness"], rows: [
          ["Round robin", "Server 1, 2, 3, 1, 2, 3...", "Identical servers, similar requests", "Ignores load; a slow server still gets its share"],
          ["Weighted round robin", "Server with weight 3 gets 3× the requests", "Mixed hardware", "Static weights"],
          ["Least connections", "Pick server with fewest active connections", "Long-lived / uneven requests (WebSockets, uploads)", "Needs connection tracking"],
          ["Least response time", "Fewest connections + lowest latency", "Latency-sensitive APIs", "More monitoring overhead"],
          ["IP hash", "<code>hash(clientIP) % N</code>", "Sticky sessions without cookies", "Adding a server remaps almost every client"],
          ["Consistent hashing", "Servers and keys on a hash ring; key goes to next server clockwise", "Caches, sharded stores", "Needs virtual nodes to balance"],
          ["Random / power of two choices", "Pick 2 random servers, send to less loaded", "Large fleets, distributed LBs", "Slight randomness"]
        ] } },
        { h: "Why plain modulo hashing breaks" },
        { p: "With <code>hash(key) % N</code>, changing N from 4 to 5 changes the server for ~80% of keys — for a cache that means a near-total miss storm. <b>Consistent hashing</b> moves only ~1/N of keys (see the consistent hashing question for the ring diagram)." },
        { code: `# hash(key) % N  when N goes 4 -> 5
key=10: 10 % 4 = 2   ->  10 % 5 = 0   (moved)
key=11: 11 % 4 = 3   ->  11 % 5 = 1   (moved)
key=12: 12 % 4 = 0   ->  12 % 5 = 2   (moved)
key=20: 20 % 4 = 0   ->  20 % 5 = 0   (stayed)`, lang: "text", title: "Modulo remapping" },
        { tip: "Default answer: round robin for stateless HTTP; least connections for long-lived connections; consistent hashing when a key must land on the same node (caches, shards)." }
      ]
    },
    {
      id: "stateless-services",
      q: "What is a stateless service and why does it matter for scaling?",
      topic: "Scaling & Load Balancing",
      level: 1,
      top: false,
      short: "A stateless service keeps no per-client data in its own memory between requests; session and user state live in a shared store (Redis, DB) or in a token. Any server can then handle any request, so you can add, remove or restart servers freely.",
      a: [
        { p: "A service is <b>stateless</b> when each request carries or can fetch everything needed to handle it — the server keeps no session data locally. State is pushed to a shared store (Redis, database) or to the client (a signed JWT)." },
        { svg: `<svg viewBox="0 0 560 190" width="560" class="dg">
  <rect class="box" x="10" y="75" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="50" y="95" text-anchor="middle" dominant-baseline="middle">Users</text>
  <line class="ln" x1="90" y1="95" x2="135" y2="95" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="140" y="75" width="60" height="40" rx="6"/>
  <text class="tx" x="170" y="95" text-anchor="middle" dominant-baseline="middle">LB</text>
  <line class="ln" x1="200" y1="95" x2="255" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="200" y1="95" x2="255" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="200" y1="95" x2="255" y2="150" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="260" y="22" width="100" height="36" rx="6"/>
  <text class="tx" x="310" y="40" text-anchor="middle" dominant-baseline="middle">App (no state)</text>
  <rect class="box-g" x="260" y="77" width="100" height="36" rx="6"/>
  <text class="tx" x="310" y="95" text-anchor="middle" dominant-baseline="middle">App (no state)</text>
  <rect class="box-g" x="260" y="132" width="100" height="36" rx="6"/>
  <text class="tx" x="310" y="150" text-anchor="middle" dominant-baseline="middle">App (no state)</text>
  <line class="ln-a" x1="360" y1="40" x2="425" y2="70" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="360" y1="95" x2="425" y2="85" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="360" y1="150" x2="425" y2="125" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="430" y="55" width="120" height="80" rx="6"/>
  <text class="tx tx-b" x="490" y="85" text-anchor="middle" dominant-baseline="middle">Redis</text>
  <text class="tx-m" x="490" y="105" text-anchor="middle" dominant-baseline="middle">sessions, carts</text>
</svg>`, caption: "Session state lives in a shared store, so any app server can serve any user" },
        { h: "Why it matters" },
        { ul: [
          "LB can use simple round robin — no <b>sticky sessions</b> needed.",
          "Autoscaling: kill or add instances at any time without logging users out.",
          "Crash of one server loses no user data.",
          "Rolling deploys become trivial."
        ] },
        { h: "Sticky sessions — the alternative" },
        { p: "LB pins a user to one server (cookie or IP hash). It works but hurts: uneven load, sessions lost when that server dies, harder scale-down. Prefer externalised state." },
        { tip: "The <i>system</i> is still stateful — you have just moved state into a purpose-built, replicated store. Databases and caches are the stateful tier." }
      ]
    },
    {
      id: "consistent-hashing",
      q: "What is consistent hashing? How do virtual nodes help?",
      topic: "Scaling & Load Balancing",
      level: 2,
      top: true,
      short: "Consistent hashing places both servers and keys on a circular hash space; each key belongs to the first server clockwise from it. Adding or removing a server only moves the keys in its neighbouring arc (~1/N of keys). Virtual nodes give each server many ring positions to even out load.",
      a: [
        { p: "Map the hash output (say 0 … 2<sup>32</sup>−1) onto a <b>ring</b>. Hash each server's name to a point on the ring, hash each key to a point, and walk <b>clockwise</b> — the first server you meet owns the key." },
        { svg: `<svg viewBox="0 0 600 290" width="600" class="dg">
  <circle class="ln" cx="200" cy="145" r="100"/>
  <circle class="box-a" cx="200" cy="45" r="16"/>
  <text class="tx tx-b" x="200" y="45" text-anchor="middle" dominant-baseline="middle">A</text>
  <circle class="box-a" cx="298" cy="162" r="16"/>
  <text class="tx tx-b" x="298" y="162" text-anchor="middle" dominant-baseline="middle">B</text>
  <circle class="box-a" cx="136" cy="222" r="16"/>
  <text class="tx tx-b" x="136" y="222" text-anchor="middle" dominant-baseline="middle">C</text>
  <circle class="box-w" cx="287" cy="95" r="7"/>
  <text class="tx-c" x="300" y="88">k1</text>
  <line class="ln-a ln-d" x1="292" y1="105" x2="297" y2="140" marker-end="url(#dg-arr-a)"/>
  <circle class="box-w" cx="234" cy="239" r="7"/>
  <text class="tx-c" x="244" y="258">k2</text>
  <line class="ln-a ln-d" x1="224" y1="243" x2="156" y2="228" marker-end="url(#dg-arr-a)"/>
  <circle class="box-w" cx="113" cy="95" r="7"/>
  <text class="tx-c" x="88" y="88">k3</text>
  <line class="ln-a ln-d" x1="122" y1="85" x2="182" y2="50" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="200" y="150" text-anchor="middle">clockwise</text>
  <text class="tx tx-b" x="360" y="40">Ownership</text>
  <text class="tx" x="360" y="65">k1 → B   k2 → C   k3 → A</text>
  <text class="tx tx-b" x="360" y="110">Add server D between k1 and B:</text>
  <text class="tx" x="360" y="132">only k1 moves (B → D)</text>
  <text class="tx tx-b" x="360" y="177">Remove B:</text>
  <text class="tx" x="360" y="199">only B's keys move to C</text>
  <text class="tx-m" x="360" y="240">Other keys stay put: ~1/N moved</text>
</svg>`, caption: "Hash ring: servers (A, B, C) and keys (k1–k3); each key belongs to the next server clockwise" },
        { h: "The problem with few servers: uneven arcs" },
        { p: "With 3 random points, one server might own 60% of the ring. <b>Virtual nodes</b>: hash each physical server to 100–200 points (<code>A#1, A#2...</code>). Load evens out statistically, and a removed server's keys spread over <i>all</i> remaining servers instead of dumping on one neighbour. Stronger machines can simply get more vnodes." },
        { h: "Where it is used" },
        { ul: [
          "Distributed caches (Memcached client libraries, Redis Cluster uses a related fixed-slot scheme with 16,384 slots)",
          "DynamoDB / Cassandra partitioning",
          "Load balancers with session affinity, CDNs choosing cache nodes"
        ] },
        { tip: "Implementation: keep the ring as a sorted map <code>hash → server</code>; lookup is <code>lower_bound(hash(key))</code>, wrapping to the first entry — O(log V)." }
      ]
    },

    /* ───────────── Caching ───────────── */
    {
      id: "caching-strategies",
      q: "Explain caching strategies: cache-aside, write-through, write-back and write-around.",
      topic: "Caching",
      level: 2,
      top: true,
      short: "Cache-aside: app reads cache, on miss loads DB and fills cache. Write-through: writes go to cache and DB synchronously. Write-back: writes go to cache only and are flushed to DB later (fast, risk of loss). Write-around: writes go straight to DB, cache fills only on read.",
      a: [
        { p: "A cache stores hot data in fast memory (Redis/Memcached, ~sub-ms) in front of a slow store (DB, ~ms). The <b>strategy</b> decides who loads the cache and when writes reach the DB." },
        { h: "Cache-aside (lazy loading) — the default" },
        { svg: `<svg viewBox="0 0 600 215" width="600" class="dg">
  <rect class="box-a" x="60" y="8" width="80" height="30" rx="6"/>
  <text class="tx tx-b" x="100" y="23" text-anchor="middle" dominant-baseline="middle">App</text>
  <rect class="box-g" x="260" y="8" width="80" height="30" rx="6"/>
  <text class="tx tx-b" x="300" y="23" text-anchor="middle" dominant-baseline="middle">Cache</text>
  <rect class="box-p" x="460" y="8" width="80" height="30" rx="6"/>
  <text class="tx tx-b" x="500" y="23" text-anchor="middle" dominant-baseline="middle">DB</text>
  <line class="ln ln-d" x1="100" y1="38" x2="100" y2="210"/>
  <line class="ln ln-d" x1="300" y1="38" x2="300" y2="210"/>
  <line class="ln ln-d" x1="500" y1="38" x2="500" y2="210"/>
  <line class="ln-a" x1="100" y1="65" x2="296" y2="65" marker-end="url(#dg-arr-a)"/>
  <text class="tx-c" x="200" y="58" text-anchor="middle">1. GET user:42</text>
  <rect class="box-r" x="155" y="75" width="90" height="17" rx="6"/>
  <line class="ln ln-d" x1="300" y1="95" x2="104" y2="95" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="200" y="88" text-anchor="middle">2. miss (nil)</text>
  <line class="ln-a" x1="100" y1="125" x2="496" y2="125" marker-end="url(#dg-arr-a)"/>
  <text class="tx-c" x="300" y="118" text-anchor="middle">3. SELECT * FROM users WHERE id=42</text>
  <line class="ln ln-d" x1="500" y1="155" x2="104" y2="155" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="300" y="148" text-anchor="middle">4. row</text>
  <line class="ln-a" x1="100" y1="190" x2="296" y2="190" marker-end="url(#dg-arr-a)"/>
  <text class="tx-c" x="200" y="183" text-anchor="middle">5. SET user:42 EX 300</text>
</svg>`, caption: "Cache-aside read path: miss → load from DB → populate cache with a TTL" },
        { table: { head: ["Strategy", "Write path", "Pros", "Cons", "Use when"], rows: [
          ["<b>Cache-aside</b>", "App writes DB, then <b>deletes</b> cache key", "Simple; cache holds only requested data; cache failure is survivable", "First read is a miss; small stale window", "General read-heavy apps (default)"],
          ["<b>Write-through</b>", "Write cache <i>and</i> DB synchronously", "Cache always fresh", "Slower writes; caches data nobody reads", "Read-after-write must be fresh"],
          ["<b>Write-back</b> (write-behind)", "Write cache only; flush to DB async in batches", "Fastest writes, absorbs bursts", "Data loss if cache dies before flush; complex", "Counters, metrics, likes"],
          ["<b>Write-around</b>", "Write DB only; cache filled on next read miss", "Cache not polluted by write-once data", "Recent writes always miss", "Logs, bulk imports, rarely re-read data"]
        ] } },
        { tip: "On update in cache-aside, <b>delete</b> the key rather than updating it — two concurrent updaters can otherwise leave the older value in cache. Always set a TTL as a safety net." }
      ]
    },
    {
      id: "cache-eviction-policies",
      q: "What are cache eviction policies? Compare LRU, LFU, FIFO and TTL.",
      topic: "Caching",
      level: 1,
      top: true,
      short: "When the cache is full it must evict something. LRU evicts the least recently used item, LFU the least frequently used, FIFO the oldest inserted; TTL expires items after a fixed time regardless of space. LRU is the most common default.",
      a: [
        { p: "Caches are small relative to the data, so an <b>eviction policy</b> decides which entry to throw out when a new one arrives. The goal is to maximise the <b>hit ratio</b>." },
        { table: { head: ["Policy", "Evicts", "Good for", "Weakness"], rows: [
          ["<b>LRU</b> — Least Recently Used", "Item not accessed for the longest time", "Most workloads (recency ≈ future use)", "A one-off full scan flushes hot items"],
          ["<b>LFU</b> — Least Frequently Used", "Item with the lowest access count", "Stable popularity (top products)", "Old popular items linger; new items evicted early"],
          ["<b>FIFO</b>", "Oldest inserted item", "Very simple", "Ignores usage entirely"],
          ["<b>Random</b>", "Random item", "Cheap, surprisingly OK", "Unpredictable"],
          ["<b>TTL</b> (expiry)", "Items older than their time-to-live", "Freshness bound on stale data", "Not a space policy by itself — combine with LRU/LFU"]
        ] } },
        { p: "LRU is O(1) with a <b>hash map + doubly linked list</b> (see the LRU cache design question). Redis offers <code>allkeys-lru</code>, <code>allkeys-lfu</code>, <code>volatile-ttl</code> and more via <code>maxmemory-policy</code>; it uses <i>approximated</i> LRU by sampling a few keys." },
        { tip: "Mention that eviction (space-driven) and expiration (time-driven) are different, and that production caches use both: TTL for correctness, LRU/LFU for memory." }
      ]
    },
    {
      id: "cdn",
      q: "What is a CDN and how does it work?",
      topic: "Caching",
      level: 1,
      top: true,
      short: "A Content Delivery Network is a set of geographically distributed edge servers (PoPs) that cache static content close to users. DNS or anycast routes a user to the nearest edge; on a miss the edge fetches from the origin, caches it per Cache-Control, and serves later users locally.",
      a: [
        { p: "A <b>CDN</b> (Cloudflare, Akamai, CloudFront) caches content at <b>edge servers</b> in many cities (Points of Presence). Users download from a nearby edge instead of your distant origin — lower latency, less origin load, DDoS absorption." },
        { svg: `<svg viewBox="0 0 600 200" width="600" class="dg">
  <rect class="box" x="10" y="20" width="100" height="36" rx="6"/>
  <text class="tx" x="60" y="38" text-anchor="middle" dominant-baseline="middle">User (Mumbai)</text>
  <rect class="box" x="10" y="140" width="100" height="36" rx="6"/>
  <text class="tx" x="60" y="158" text-anchor="middle" dominant-baseline="middle">User (London)</text>
  <line class="ln-a" x1="110" y1="38" x2="195" y2="38" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="110" y1="158" x2="195" y2="158" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="152" y="30" text-anchor="middle">~10 ms</text>
  <text class="tx-m" x="152" y="150" text-anchor="middle">~10 ms</text>
  <rect class="box-g" x="200" y="18" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="265" y="38" text-anchor="middle" dominant-baseline="middle">Edge PoP Mumbai</text>
  <rect class="box-g" x="200" y="138" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="265" y="158" text-anchor="middle" dominant-baseline="middle">Edge PoP London</text>
  <line class="ln ln-d" x1="330" y1="45" x2="445" y2="90" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="330" y1="150" x2="445" y2="110" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="390" y="55" text-anchor="middle">miss only</text>
  <rect class="box-a" x="450" y="78" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="515" y="95" text-anchor="middle" dominant-baseline="middle">Origin server</text>
  <text class="tx-m" x="515" y="112" text-anchor="middle" dominant-baseline="middle">(Virginia)</text>
</svg>`, caption: "Users hit the nearest edge; the edge goes to the origin only on a cache miss" },
        { h: "Request flow" },
        { ol: [
          "User requests <code>cdn.example.com/logo.png</code>; DNS (geo-DNS or anycast) returns the nearest edge.",
          "Edge hit → serve immediately. Miss → fetch from origin (<b>pull CDN</b>), cache it for the <code>Cache-Control: max-age</code> duration, serve.",
          "Updates: use <b>versioned file names</b> (<code>app.3f9a1c.js</code>) or explicit purge/invalidation."
        ] },
        { table: { head: ["Pull CDN", "Push CDN"], rows: [
          ["Edge fetches from origin on first request", "You upload content to the CDN ahead of time"],
          ["Easy; first user per edge pays a miss", "Full control; more work; good for large, rarely changing files"]
        ] } },
        { tip: "CDNs are not only for images: they cache JS/CSS, video segments (HLS/DASH), and even API responses marked cacheable; they also terminate TLS and absorb DDoS traffic." }
      ]
    },
    {
      id: "redis-use-cases",
      q: "What is Redis and what are its common use cases in system design?",
      topic: "Caching",
      level: 1,
      top: false,
      short: "Redis is an in-memory key-value data-structure store with sub-millisecond latency, optional persistence (RDB/AOF) and replication. It is used as a cache, session store, rate-limit counter, leaderboard (sorted sets), distributed lock, pub/sub bus and lightweight queue.",
      a: [
        { p: "<b>Redis</b> keeps data in RAM and exposes rich data types (strings, hashes, lists, sets, sorted sets, streams, HyperLogLog, geo). Commands are executed by a single thread per shard, so each command is <b>atomic</b>." },
        { table: { head: ["Use case", "Data type / command"], rows: [
          ["Cache", "<code>SET key val EX 300</code>, <code>GET</code>"],
          ["Session store", "Hash per session + TTL"],
          ["Rate limiting", "<code>INCR</code> + <code>EXPIRE</code> per user per window"],
          ["Leaderboard", "Sorted set: <code>ZADD</code>, <code>ZREVRANGE 0 9 WITHSCORES</code>"],
          ["Distributed lock", "<code>SET lock:order42 &lt;token&gt; NX PX 30000</code>"],
          ["Queue / job list", "List <code>LPUSH</code>/<code>BRPOP</code>, or Streams with consumer groups"],
          ["Pub/Sub, presence", "<code>PUBLISH</code>/<code>SUBSCRIBE</code>; online users in a set"],
          ["Unique counts", "HyperLogLog <code>PFADD</code>/<code>PFCOUNT</code> (~0.8% error, 12 KB)"]
        ] } },
        { code: `SET session:ab12 '{"uid":42}' EX 1800     # session, expires in 30 min
INCR rl:user42:1727260800                  # request count for this minute
EXPIRE rl:user42:1727260800 60
ZADD leaderboard 1520 alice 1710 bob
ZREVRANGE leaderboard 0 9 WITHSCORES       # top 10
SET lock:job7 9f3c NX PX 30000             # acquire lock only if absent`, lang: "bash", title: "redis-cli examples" },
        { h: "Durability & scaling" },
        { ul: [
          "<b>RDB</b> snapshots (compact, may lose minutes) and <b>AOF</b> append-only log (fsync every second → lose ≤1 s).",
          "Leader-follower replication + <b>Sentinel</b> for failover; <b>Redis Cluster</b> shards keys over 16,384 hash slots."
        ] },
        { warn: "Redis is not a primary database for data you cannot lose — async replication means a failover can drop recent writes." }
      ]
    },
    {
      id: "cache-invalidation-problems",
      q: "What are cache stampede, cache penetration and cache avalanche? How do you prevent them?",
      topic: "Caching",
      level: 3,
      top: false,
      short: "Stampede: a hot key expires and thousands of requests hit the DB at once — fix with a lock/single-flight or early refresh. Penetration: requests for keys that don't exist always miss — cache nulls or use a Bloom filter. Avalanche: many keys expire together or the cache dies — add TTL jitter and replicate the cache.",
      a: [
        { p: "\"There are only two hard things in computer science: cache invalidation and naming things.\" These three failure modes all end the same way — the database gets flattened." },
        { table: { head: ["Problem", "What happens", "Fixes"], rows: [
          ["<b>Stampede</b> (thundering herd / dog-pile)", "One very hot key expires; all concurrent requests miss and query the DB simultaneously", "Mutex / single-flight: only one request rebuilds, others wait or serve stale; refresh ahead of expiry; probabilistic early expiration"],
          ["<b>Penetration</b>", "Requests for IDs that don't exist (bugs or attacks) never get cached, always hit DB", "Cache the \"not found\" result with a short TTL; <b>Bloom filter</b> of valid keys in front; validate input"],
          ["<b>Avalanche</b>", "Many keys share the same TTL and expire together, or the cache cluster goes down", "Add random <b>jitter</b> to TTLs; replicated / clustered cache; circuit breaker + rate limit to the DB; warm cache on start"]
        ] } },
        { code: `def get_user(uid):
    val = cache.get(f"user:{uid}")
    if val is not None:
        return None if val == "NULL" else val
    # only one worker rebuilds; others briefly wait and retry the cache
    if cache.set(f"lock:user:{uid}", "1", nx=True, ex=5):
        row = db.fetch_user(uid)
        ttl = 300 + random.randint(0, 60)          # jitter against avalanche
        cache.set(f"user:{uid}", row or "NULL", ex=ttl if row else 30)
        cache.delete(f"lock:user:{uid}")
        return row
    time.sleep(0.05)
    return get_user(uid)`, lang: "python", title: "Cache-aside with lock, null caching and TTL jitter" },
        { tip: "Naming the three separately and giving one fix each is usually enough at the fresher level; Bloom filter + TTL jitter + single-flight are the key words." }
      ]
    },

    /* ───────────── Databases at Scale ───────────── */
    {
      id: "sql-vs-nosql",
      q: "SQL vs NoSQL — how do you choose a database?",
      topic: "Databases at Scale",
      level: 1,
      top: true,
      short: "Choose SQL (PostgreSQL, MySQL) for structured, relational data needing joins and ACID transactions. Choose NoSQL (key-value, document, wide-column, graph) for flexible schemas, huge scale with simple access patterns, or very high write throughput, accepting weaker consistency and fewer joins.",
      a: [
        { table: { head: ["", "SQL (relational)", "NoSQL"], rows: [
          ["Data model", "Tables, rows, fixed schema", "Key-value, document, wide-column, graph"],
          ["Schema", "Defined up front, migrations", "Flexible / schema-on-read"],
          ["Queries", "Rich SQL, joins, aggregations", "Mostly by key; limited joins"],
          ["Transactions", "ACID, multi-row", "Often single-item atomicity; BASE"],
          ["Scaling", "Vertical first; sharding is manual/hard", "Built for horizontal scale-out"],
          ["Examples", "PostgreSQL, MySQL, Oracle", "Redis, DynamoDB, MongoDB, Cassandra, Neo4j"]
        ] } },
        { h: "NoSQL families" },
        { ul: [
          "<b>Key-value</b> (Redis, DynamoDB): cache, sessions, carts — lookup by key.",
          "<b>Document</b> (MongoDB): JSON-like records with nested fields — catalogs, CMS, user profiles.",
          "<b>Wide-column</b> (Cassandra, HBase): massive write-heavy time-series — chat messages, logs, IoT.",
          "<b>Graph</b> (Neo4j): relationship traversal — social graphs, recommendations, fraud."
        ] },
        { h: "Decision checklist" },
        { ol: [
          "Need multi-row transactions / strong consistency (payments, orders, inventory)? → <b>SQL</b>.",
          "Relational data with ad-hoc queries and reporting? → <b>SQL</b>.",
          "Simple access by key at very high scale, or huge write volume? → <b>NoSQL</b>.",
          "Rapidly changing, nested schema? → <b>Document</b> store."
        ] },
        { tip: "A great fresher answer: \"Start with PostgreSQL unless there's a clear reason not to; add Redis for caching; move specific high-volume data (messages, events) to Cassandra/DynamoDB when needed.\" Real systems are <b>polyglot</b>." },
        { warn: "\"NoSQL is faster\" is not a reason. It is faster only for the access patterns it was modelled for; ad-hoc queries can be far slower." }
      ]
    },
    {
      id: "database-replication",
      q: "What is database replication? Explain leader-follower replication.",
      topic: "Databases at Scale",
      level: 1,
      top: true,
      short: "Replication keeps copies of the same data on multiple nodes for availability and read scaling. In leader-follower (master-slave), all writes go to the leader, which streams its change log to followers; reads can be served by followers, and a follower is promoted if the leader fails.",
      a: [
        { p: "<b>Replication</b> = the same data on several machines. Goals: <b>high availability</b> (survive a node failure), <b>read scaling</b>, and lower latency (replicas near users)." },
        { svg: `<svg viewBox="0 0 600 230" width="600" class="dg">
  <rect class="box" x="10" y="95" width="100" height="40" rx="6"/>
  <text class="tx tx-b" x="60" y="115" text-anchor="middle" dominant-baseline="middle">App servers</text>
  <line class="ln-a" x1="110" y1="105" x2="225" y2="50" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="150" y="62" text-anchor="middle">writes</text>
  <rect class="box-a" x="230" y="25" width="120" height="50" rx="6"/>
  <text class="tx tx-b" x="290" y="44" text-anchor="middle" dominant-baseline="middle">Leader</text>
  <text class="tx-m" x="290" y="62" text-anchor="middle" dominant-baseline="middle">read + write</text>
  <line class="ln ln-d" x1="350" y1="50" x2="445" y2="50" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="350" y1="60" x2="445" y2="104" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="350" y1="70" x2="445" y2="170" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="398" y="40" text-anchor="middle">replication log</text>
  <rect class="box-g" x="450" y="30" width="120" height="40" rx="6"/>
  <text class="tx" x="510" y="50" text-anchor="middle" dominant-baseline="middle">Follower 1</text>
  <rect class="box-g" x="450" y="95" width="120" height="40" rx="6"/>
  <text class="tx" x="510" y="115" text-anchor="middle" dominant-baseline="middle">Follower 2</text>
  <rect class="box-g" x="450" y="160" width="120" height="40" rx="6"/>
  <text class="tx" x="510" y="180" text-anchor="middle" dominant-baseline="middle">Follower 3</text>
  <line class="ln" x1="110" y1="128" x2="445" y2="192" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="110" y1="124" x2="445" y2="126" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="250" y="212" text-anchor="middle">reads spread over followers (read replicas)</text>
</svg>`, caption: "Leader-follower: writes to leader, change log streamed to followers, reads from followers" },
        { h: "Synchronous vs asynchronous" },
        { table: { head: ["", "Synchronous", "Asynchronous"], rows: [
          ["Leader acks write when", "Follower(s) have it too", "Leader alone has it"],
          ["Durability on leader crash", "No data loss", "Recent writes can be lost"],
          ["Write latency", "Higher; blocked by slow follower", "Low"],
          ["Common setup", "Semi-sync: 1 sync follower, rest async", "Default in MySQL/Postgres"]
        ] } },
        { h: "Issues to mention" },
        { ul: [
          "<b>Replication lag</b>: a user updates their profile then reads a stale follower. Fix: <i>read-your-writes</i> — read own data from the leader for a few seconds after writing.",
          "<b>Failover</b>: detect leader death, promote the most up-to-date follower, redirect writes. Risk: <b>split brain</b> (two leaders) — need fencing / consensus.",
          "Other topologies: <b>multi-leader</b> (multi-region writes, conflict resolution needed) and <b>leaderless</b> (Dynamo/Cassandra, quorum reads/writes: <code>W + R > N</code>)."
        ] },
        { warn: "Replication does not help write throughput — every node still applies every write. To scale writes you need <b>sharding</b>." }
      ]
    },
    {
      id: "indexing-at-scale",
      q: "How does database indexing help at scale, and what are its costs?",
      topic: "Databases at Scale",
      level: 2,
      top: false,
      short: "An index (usually a B+ tree) lets the database find rows in O(log n) instead of scanning the whole table. It speeds up reads, WHERE/JOIN/ORDER BY, but costs extra storage and slows every insert/update, so index the columns your hot queries filter and sort on.",
      a: [
        { p: "Without an index, <code>SELECT * FROM orders WHERE user_id = 42</code> on 500 M rows is a <b>full table scan</b>. A <b>B+ tree index</b> on <code>user_id</code> finds matching rows in ~3–4 page reads because the tree has a huge fan-out." },
        { table: { head: ["Index type", "Use"], rows: [
          ["B+ tree (default)", "Equality and range queries, ORDER BY"],
          ["Hash", "Exact-match only (e.g. Postgres hash, memory tables)"],
          ["Composite <code>(a, b)</code>", "Queries on <code>a</code>, or <code>a AND b</code> — leftmost-prefix rule"],
          ["Covering index", "All selected columns are in the index → no table lookup"],
          ["Inverted index", "Full-text search (Elasticsearch, Postgres GIN)"],
          ["Geospatial (R-tree, geohash)", "\"Drivers within 2 km\""]
        ] } },
        { code: `-- hot query: user's recent orders
SELECT id, total, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;

-- one composite index serves both the filter and the sort
CREATE INDEX idx_orders_user_time ON orders (user_id, created_at DESC);

-- check it is used (Postgres / MySQL)
EXPLAIN SELECT id, total, created_at FROM orders
WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;`, lang: "sql", title: "Index designed for the access pattern" },
        { h: "Costs & rules of thumb" },
        { ul: [
          "Each index is extra storage and must be updated on every write → write-heavy tables should have few indexes.",
          "Low-cardinality columns (<code>gender</code>, <code>is_active</code>) rarely benefit.",
          "Functions on the column (<code>WHERE LOWER(email)=...</code>) skip a plain index — use an expression index.",
          "At scale, indexes are <b>local to each shard</b>; queries not on the shard key must scatter-gather or use a global secondary index."
        ] },
        { tip: "Design indexes from queries, not from tables: list the top 3 queries, then create the composite indexes that serve them." }
      ]
    },
    {
      id: "database-sharding",
      q: "What is sharding? Explain sharding strategies and the hot key problem.",
      topic: "Databases at Scale",
      level: 2,
      top: true,
      short: "Sharding (horizontal partitioning) splits rows of one logical table across multiple database servers by a shard key. Strategies: range, hash, consistent hashing, and directory/lookup-based. A bad key causes hot shards or hot keys (e.g. a celebrity), fixed by better keys, key salting, caching or splitting.",
      a: [
        { p: "<b>Sharding</b> splits data across machines so each holds a subset — this scales <b>writes and storage</b>, which replication cannot. Each shard is usually itself replicated." },
        { table: { head: ["Strategy", "How", "Pros", "Cons"], rows: [
          ["<b>Range</b>", "user_id 1–1M → S1, 1M–2M → S2; or by date", "Range scans are efficient", "Hotspots (all new users/today's data on one shard)"],
          ["<b>Hash</b>", "<code>hash(user_id) % N</code>", "Even distribution", "Range queries scatter; resharding moves most data"],
          ["<b>Consistent hashing</b>", "Hash ring with virtual nodes", "Adding a shard moves ~1/N of data", "Still no efficient range queries"],
          ["<b>Directory / lookup</b>", "Lookup service maps key → shard", "Flexible, can move tenants individually", "Extra hop; directory must be HA"],
          ["<b>Geo / tenant</b>", "By region or customer", "Data locality, compliance", "Uneven tenant sizes"]
        ] } },
        { h: "Choosing a shard key" },
        { ul: [
          "High cardinality and even spread (<code>user_id</code>, not <code>country</code>).",
          "Matches the main query so most requests hit <b>one</b> shard (chat: <code>conversation_id</code>).",
          "Avoid monotonically increasing keys with range sharding (timestamps) — all writes hit the last shard."
        ] },
        { h: "Hot keys / hot shards" },
        { p: "Even with perfect hashing, one key can be enormous — a celebrity with 100 M followers, a viral product. Fixes: <b>cache</b> the hot key aggressively (and replicate it across cache nodes); <b>salt/split</b> the key (<code>post123#0..#9</code>, spread writes, aggregate on read); move the hot tenant to a dedicated shard." },
        { h: "Costs of sharding" },
        { ul: [
          "Cross-shard joins and transactions are hard (avoid or use sagas / 2PC).",
          "Resharding is operationally painful → pre-split into many logical shards mapped to fewer physical nodes.",
          "Globally unique IDs need a generator (Snowflake, UUID)."
        ] },
        { tip: "Say: \"First optimise queries, add indexes, caching and read replicas; shard only when a single leader cannot handle writes or storage.\"" }
      ]
    },
    {
      id: "cap-theorem",
      q: "What is the CAP theorem?",
      topic: "Databases at Scale",
      level: 2,
      top: true,
      short: "CAP says a distributed data store facing a network partition must choose between Consistency (every read sees the latest write) and Availability (every request gets a non-error response). Partition tolerance is not optional, so real systems are CP or AP during a partition.",
      a: [
        { ul: [
          "<b>C — Consistency</b>: every read returns the most recent write (linearizability), or an error.",
          "<b>A — Availability</b>: every request to a non-failed node gets a (non-error) response, possibly stale.",
          "<b>P — Partition tolerance</b>: the system keeps working even if messages between nodes are lost."
        ] },
        { p: "Networks <i>do</i> partition, so P is a given. The real statement: <b>when a partition happens, choose C or A</b>. When there is no partition you can have both." },
        { table: { head: ["Choice", "Behaviour during partition", "Examples", "Good for"], rows: [
          ["<b>CP</b>", "Minority side refuses reads/writes (errors/timeouts)", "ZooKeeper, etcd, HBase, MongoDB (majority writes), bank ledgers", "Payments, inventory, leader election, locks"],
          ["<b>AP</b>", "All nodes answer; may return stale data; reconcile later", "Cassandra, DynamoDB (default), DNS, CouchDB", "Social feeds, carts, likes, product catalog"]
        ] } },
        { p: "Example: two replicas of your bank balance lose connectivity. A CP system rejects the withdrawal on the isolated node; an AP system allows it and risks double-spending, which must be reconciled later." },
        { warn: "\"CA\" systems don't exist in a distributed setting — a single-node RDBMS is CA only because it cannot partition. Also, CAP's C is not the C in ACID (that means integrity constraints)." },
        { tip: "Many databases are tunable per request (Cassandra consistency levels, DynamoDB strongly consistent reads). Mention PACELC as the fuller picture." }
      ]
    },
    {
      id: "strong-vs-eventual-consistency",
      q: "What is the difference between strong consistency and eventual consistency?",
      topic: "Databases at Scale",
      level: 2,
      top: false,
      short: "Strong consistency guarantees every read sees the latest committed write, as if there were one copy. Eventual consistency only guarantees that if writes stop, all replicas converge to the same value; reads in between can be stale. Strong costs latency and availability; eventual is faster and more available.",
      a: [
        { table: { head: ["", "Strong consistency", "Eventual consistency"], rows: [
          ["Guarantee", "Read returns the latest write", "Replicas converge <i>eventually</i>; reads may be stale"],
          ["How", "Sync replication, consensus (Raft/Paxos), quorum <code>R + W > N</code>, read from leader", "Async replication, gossip, read any replica"],
          ["Latency", "Higher (wait for coordination)", "Lower"],
          ["Availability under partition", "Lower (CP)", "Higher (AP)"],
          ["Use cases", "Bank balance, seat booking, inventory count, unique usernames", "Likes, view counts, feeds, DNS, profile photos"]
        ] } },
        { h: "Useful in-between models" },
        { ul: [
          "<b>Read-your-writes</b>: a user always sees their own updates (route their reads to the leader briefly).",
          "<b>Monotonic reads</b>: a user never sees time go backwards (stick them to one replica).",
          "<b>Causal consistency</b>: a reply is never visible before the comment it replies to."
        ] },
        { p: "Quorum example: N = 3 replicas, write to W = 2, read from R = 2. Since R + W > N, every read set overlaps the latest write set → the newest version is always seen." },
        { tip: "Show judgment: most features of an app tolerate eventual consistency; identify the few that don't (money, stock, uniqueness) and make only those strongly consistent." }
      ]
    },
    {
      id: "pacelc-theorem",
      q: "What is the PACELC theorem and how does it extend CAP?",
      topic: "Databases at Scale",
      level: 3,
      top: false,
      short: "PACELC: if there is a Partition, choose Availability or Consistency; Else (normal operation), choose Latency or Consistency. It captures that even without failures, stronger consistency costs latency because replicas must coordinate.",
      a: [
        { p: "CAP only talks about behaviour during a partition — which is rare. <b>PACELC</b> (Daniel Abadi) adds the everyday trade-off: <b>P</b>artition → <b>A</b> or <b>C</b>; <b>E</b>lse → <b>L</b>atency or <b>C</b>onsistency." },
        { table: { head: ["System", "Class", "Meaning"], rows: [
          ["Cassandra, DynamoDB (defaults)", "PA/EL", "Available in partitions, low latency normally; eventual consistency"],
          ["Spanner, CockroachDB, etcd", "PC/EC", "Always consistent; pay latency for consensus"],
          ["MongoDB (typical config)", "PC/EC-ish", "Majority writes; primary reads"],
          ["PNUTS (Yahoo)", "PC/EL", "Consistent under partition, favours latency otherwise"]
        ] } },
        { p: "Why the \"Else\" matters: a strongly consistent write in a 3-region system must wait for a majority across regions (~100 ms), while an eventually consistent write returns after the local replica (~1 ms)." },
        { tip: "Use PACELC to sound precise: \"For the feed I'd choose PA/EL — low latency matters more than seeing a like instantly; for payments PC/EC.\"" }
      ]
    },

    /* ───────────── Messaging & Async ───────────── */
    {
      id: "message-queues-pub-sub",
      q: "What is a message queue? How is it different from pub/sub, and why use one?",
      topic: "Messaging & Async",
      level: 1,
      top: true,
      short: "A message queue is a buffer where producers put messages and consumers take them asynchronously; each message is processed by one consumer. In pub/sub, a message published to a topic is delivered to every subscriber. Both decouple services, absorb traffic spikes and enable retries.",
      a: [
        { p: "Instead of Service A calling Service B directly and waiting, A drops a message into a <b>broker</b> and returns immediately. B processes it when it can. This is <b>asynchronous</b> communication." },
        { svg: `<svg viewBox="0 0 620 250" width="620" class="dg">
  <text class="tx tx-b" x="10" y="18">Point-to-point queue (work distribution)</text>
  <rect class="box" x="10" y="45" width="90" height="36" rx="6"/>
  <text class="tx" x="55" y="63" text-anchor="middle" dominant-baseline="middle">Producer</text>
  <line class="ln-a" x1="100" y1="63" x2="175" y2="63" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="180" y="43" width="170" height="40" rx="6"/>
  <text class="tx-c" x="265" y="63" text-anchor="middle" dominant-baseline="middle">[m5][m4][m3][m2]</text>
  <line class="ln" x1="350" y1="58" x2="445" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="350" y1="70" x2="445" y2="88" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="450" y="24" width="110" height="32" rx="6"/>
  <text class="tx" x="505" y="40" text-anchor="middle" dominant-baseline="middle">Worker 1 (m2)</text>
  <rect class="box-g" x="450" y="72" width="110" height="32" rx="6"/>
  <text class="tx" x="505" y="88" text-anchor="middle" dominant-baseline="middle">Worker 2 (m3)</text>
  <text class="tx tx-b" x="10" y="140">Pub/Sub topic (fan-out: every subscriber gets a copy)</text>
  <rect class="box" x="10" y="180" width="90" height="36" rx="6"/>
  <text class="tx" x="55" y="198" text-anchor="middle" dominant-baseline="middle">Order svc</text>
  <line class="ln-a" x1="100" y1="198" x2="175" y2="198" marker-end="url(#dg-arr-a)"/>
  <rect class="box-p" x="180" y="176" width="170" height="44" rx="6"/>
  <text class="tx tx-b" x="265" y="198" text-anchor="middle" dominant-baseline="middle">topic: order-placed</text>
  <line class="ln" x1="350" y1="190" x2="445" y2="162" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="350" y1="198" x2="445" y2="198" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="350" y1="206" x2="445" y2="234" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="450" y="148" width="110" height="28" rx="6"/>
  <text class="tx" x="505" y="162" text-anchor="middle" dominant-baseline="middle">Email svc</text>
  <rect class="box-g" x="450" y="184" width="110" height="28" rx="6"/>
  <text class="tx" x="505" y="198" text-anchor="middle" dominant-baseline="middle">Inventory svc</text>
  <rect class="box-g" x="450" y="220" width="110" height="28" rx="6"/>
  <text class="tx" x="505" y="234" text-anchor="middle" dominant-baseline="middle">Analytics svc</text>
</svg>`, caption: "Queue: each message to one worker. Pub/sub: each message to every subscriber" },
        { h: "Why use a queue" },
        { ul: [
          "<b>Decoupling</b> — producer does not know or wait for consumers; either can be deployed/scaled independently.",
          "<b>Load levelling</b> — a spike of 50k orders/s is buffered and drained at the rate workers can handle.",
          "<b>Reliability</b> — if a consumer is down, messages wait; failed ones are retried or sent to a <b>dead-letter queue (DLQ)</b>.",
          "<b>Faster responses</b> — slow work (emails, thumbnails, reports) happens in the background."
        ] },
        { h: "Costs" },
        { ul: [
          "Eventual consistency — the result is not ready when the API returns.",
          "Duplicates and reordering are possible → consumers must be <b>idempotent</b>.",
          "One more system to operate and monitor (queue depth / consumer lag)."
        ] },
        { tip: "Classic example: \"User places order → API writes order, publishes <code>OrderPlaced</code> → payment, email, inventory and analytics consume it independently.\"" }
      ]
    },
    {
      id: "kafka-vs-rabbitmq",
      q: "Kafka vs RabbitMQ — what is the difference at a high level?",
      topic: "Messaging & Async",
      level: 2,
      top: false,
      short: "RabbitMQ is a traditional message broker: it routes messages to queues and deletes them once consumers acknowledge. Kafka is a distributed, partitioned, append-only log: messages are retained for a period, consumers track their own offset and can replay, giving very high throughput and ordering per partition.",
      a: [
        { table: { head: ["", "RabbitMQ", "Kafka"], rows: [
          ["Model", "Smart broker, queues; push to consumers", "Distributed commit log; consumers pull"],
          ["After consumption", "Message deleted on ack", "Retained (e.g. 7 days) — can <b>replay</b>"],
          ["Ordering", "Per queue (with one consumer)", "Per <b>partition</b>"],
          ["Scaling consumers", "Competing consumers on a queue", "Consumer group: one consumer per partition"],
          ["Throughput", "Tens of thousands msg/s per node", "Millions msg/s per cluster"],
          ["Routing", "Rich: direct, topic, fanout, headers exchanges", "Simple: topic + partition key"],
          ["Best for", "Task queues, RPC-style jobs, complex routing, per-message ack/retry", "Event streaming, logs, analytics pipelines, event sourcing, CDC"]
        ] } },
        { h: "Kafka vocabulary in one breath" },
        { p: "A <b>topic</b> is split into <b>partitions</b> (ordered logs) spread over <b>brokers</b> and replicated. Producers choose a partition by key (<code>hash(order_id)</code>) so all events for one order stay in order. A <b>consumer group</b> shares partitions; each consumer commits the <b>offset</b> it has processed." },
        { tip: "Rule of thumb: \"Need a job queue with retries and routing? RabbitMQ (or SQS). Need a high-volume event stream many teams read and replay? Kafka.\"" },
        { warn: "Parallelism in Kafka is capped by the partition count — 6 partitions means at most 6 active consumers in a group." }
      ]
    },
    {
      id: "idempotency",
      q: "What is idempotency and why does it matter in distributed systems? How do you implement it?",
      topic: "Messaging & Async",
      level: 2,
      top: true,
      short: "An operation is idempotent if doing it multiple times has the same effect as doing it once. Because networks cause retries and queues deliver at-least-once, handlers must be idempotent — typically using a client-generated idempotency key stored with the result and a unique constraint.",
      a: [
        { p: "<b>Idempotent</b>: f(f(x)) = f(x). Setting <code>balance = 100</code> is idempotent; <code>balance += 100</code> is not. HTTP <code>GET</code>, <code>PUT</code>, <code>DELETE</code> are meant to be idempotent; <code>POST</code> is not." },
        { h: "Why duplicates happen" },
        { ul: [
          "Client sends \"pay ₹500\", times out, retries — but the first request actually succeeded.",
          "Message brokers deliver <b>at-least-once</b>: a consumer crashes after processing but before acking → redelivered."
        ] },
        { table: { head: ["Delivery semantics", "Meaning", "Cost"], rows: [
          ["At-most-once", "Fire and forget; may lose messages", "Cheapest"],
          ["At-least-once", "Retries until acked; may duplicate", "Default for most brokers"],
          ["Exactly-once (effectively)", "At-least-once + idempotent processing / transactions", "Most complex"]
        ] } },
        { h: "Idempotency key pattern" },
        { code: `-- client sends header:  Idempotency-Key: 7f1c9e2a-...
CREATE TABLE payments (
    idempotency_key VARCHAR(64) PRIMARY KEY,   -- unique constraint does the work
    user_id         BIGINT,
    amount          NUMERIC(12,2),
    status          VARCHAR(16),
    response        TEXT
);

-- inside one transaction:
INSERT INTO payments (idempotency_key, user_id, amount, status)
VALUES ('7f1c9e2a-...', 42, 500.00, 'PENDING')
ON CONFLICT (idempotency_key) DO NOTHING;   -- Postgres
-- 0 rows inserted  => duplicate: return the stored response instead of charging again`, lang: "sql", title: "Deduplicating payment requests" },
        { ol: [
          "Client generates a unique key (UUID) per logical operation and reuses it on every retry.",
          "Server checks/inserts the key atomically; first request processes and stores the response.",
          "Duplicate requests get the stored response — no second side effect.",
          "Keys expire after a while (e.g. 24 h)."
        ] },
        { tip: "Stripe's API is the textbook example. For queue consumers, dedupe on the message ID or make the operation naturally idempotent (upserts, \"set status = SHIPPED where status = PAID\")." }
      ]
    },

    /* ───────────── APIs & Communication ───────────── */
    {
      id: "rest-vs-graphql-vs-grpc",
      q: "Compare REST, GraphQL and gRPC. When would you use each?",
      topic: "APIs & Communication",
      level: 1,
      top: true,
      short: "REST exposes resources over HTTP verbs with JSON — simple, cacheable, universal. GraphQL exposes one endpoint where clients ask for exactly the fields they need — good for varied front-ends. gRPC uses HTTP/2 and Protocol Buffers for fast, typed, streaming RPC — ideal for internal service-to-service calls.",
      a: [
        { table: { head: ["", "REST", "GraphQL", "gRPC"], rows: [
          ["Style", "Resources + HTTP verbs", "Query language, single endpoint", "Remote procedure calls"],
          ["Payload", "JSON (text)", "JSON (text)", "Protocol Buffers (binary, compact)"],
          ["Transport", "HTTP/1.1 or 2", "HTTP (usually POST)", "HTTP/2 (multiplexed)"],
          ["Contract", "OpenAPI (optional)", "Strongly typed schema", "<code>.proto</code> file, code-generated clients"],
          ["Over/under-fetching", "Common (fixed responses, N calls)", "Solved — client picks fields", "Fixed messages"],
          ["Caching", "Easy — HTTP/CDN caching of GETs", "Hard (POST, one URL)", "Custom"],
          ["Streaming", "No (use WS/SSE)", "Subscriptions", "Client, server and bidirectional streams"],
          ["Browser support", "Native", "Native", "Needs gRPC-Web proxy"],
          ["Best for", "Public APIs, CRUD, simple services", "Mobile/web apps aggregating many entities", "Internal microservices, low latency, polyglot"]
        ] } },
        { code: `REST     GET /users/42              -> full user object
         GET /users/42/orders?limit=3

GraphQL  POST /graphql
         { user(id: 42) { name orders(last: 3) { id total } } }

gRPC     service UserService {
           rpc GetUser (GetUserRequest) returns (User);
         }`, lang: "text", title: "Same data, three styles" },
        { h: "Good REST habits" },
        { ul: [
          "Nouns in URLs, verbs as methods: <code>POST /orders</code>, not <code>/createOrder</code>.",
          "Correct status codes: 200, 201, 204, 400, 401, 403, 404, 409, 429, 500, 503.",
          "Pagination (cursor-based at scale), versioning (<code>/v1/</code>), idempotency keys for POST."
        ] },
        { tip: "A common real-world answer: REST (or GraphQL) at the edge for clients, gRPC between internal services." }
      ]
    },
    {
      id: "polling-websockets-sse",
      q: "Short polling vs long polling vs WebSockets vs Server-Sent Events — how do you push real-time updates?",
      topic: "APIs & Communication",
      level: 2,
      top: true,
      short: "Short polling asks the server repeatedly on a timer (wasteful). Long polling holds each request open until data arrives, then the client reconnects. SSE keeps one HTTP connection for server-to-client event streaming. WebSockets upgrade to a persistent full-duplex TCP channel for two-way, low-latency messaging.",
      a: [
        { table: { head: ["", "Short polling", "Long polling", "SSE", "WebSocket"], rows: [
          ["Direction", "Client pulls", "Client pulls (server holds)", "Server → client only", "Bidirectional"],
          ["Connection", "New request each interval", "New request after each response", "One long HTTP response", "One persistent TCP connection"],
          ["Latency", "Up to poll interval", "Near real-time", "Real-time", "Real-time"],
          ["Overhead", "High (many empty responses)", "Medium", "Low", "Lowest per message"],
          ["Protocol", "HTTP", "HTTP", "HTTP (<code>text/event-stream</code>), auto-reconnect", "<code>ws://</code> / <code>wss://</code> after HTTP Upgrade"],
          ["Use for", "Rare updates, simplest", "Fallback, older infra", "Live scores, notifications, stock tickers, LLM token streaming", "Chat, multiplayer games, collaborative editing"]
        ] } },
        { h: "Scaling concerns" },
        { ul: [
          "WebSocket/SSE servers are <b>stateful</b> — each holds thousands of open connections. Track <code>user → server</code> in Redis so other services can route messages.",
          "LB must support long-lived connections (L4, or L7 with WebSocket upgrade); use least-connections.",
          "Clients must reconnect with backoff and resume (last event ID)."
        ] },
        { tip: "Pick the simplest thing that fits: server-only updates → SSE; true two-way → WebSockets. Mention heartbeats (ping/pong) to detect dead connections." }
      ]
    },
    {
      id: "api-gateway",
      q: "What is an API gateway? How is it different from a load balancer?",
      topic: "APIs & Communication",
      level: 1,
      top: false,
      short: "An API gateway is a single entry point in front of many backend services that handles cross-cutting concerns: routing, authentication, rate limiting, TLS, request transformation, aggregation and logging. A load balancer only spreads traffic across instances of the same service; gateways often sit in front of load balancers.",
      a: [
        { svg: `<svg viewBox="0 0 620 220" width="620" class="dg">
  <rect class="box" x="10" y="45" width="90" height="36" rx="6"/>
  <text class="tx" x="55" y="63" text-anchor="middle" dominant-baseline="middle">Web app</text>
  <rect class="box" x="10" y="135" width="90" height="36" rx="6"/>
  <text class="tx" x="55" y="153" text-anchor="middle" dominant-baseline="middle">Mobile app</text>
  <line class="ln-a" x1="100" y1="63" x2="175" y2="100" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="100" y1="153" x2="175" y2="120" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="180" y="40" width="150" height="140" rx="6"/>
  <text class="tx tx-b" x="255" y="62" text-anchor="middle">API Gateway</text>
  <text class="tx-m" x="255" y="88" text-anchor="middle">TLS termination</text>
  <text class="tx-m" x="255" y="106" text-anchor="middle">auth (JWT / API key)</text>
  <text class="tx-m" x="255" y="124" text-anchor="middle">rate limiting</text>
  <text class="tx-m" x="255" y="142" text-anchor="middle">routing, aggregation</text>
  <text class="tx-m" x="255" y="160" text-anchor="middle">logging, metrics</text>
  <line class="ln" x1="330" y1="80" x2="435" y2="40" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="110" x2="435" y2="110" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="140" x2="435" y2="180" marker-end="url(#dg-arr)"/>
  <text class="tx-c" x="385" y="52" text-anchor="middle">/users</text>
  <text class="tx-c" x="385" y="103" text-anchor="middle">/orders</text>
  <text class="tx-c" x="385" y="175" text-anchor="middle">/pay</text>
  <rect class="box-g" x="440" y="22" width="150" height="36" rx="6"/>
  <text class="tx" x="515" y="40" text-anchor="middle" dominant-baseline="middle">User service (x3)</text>
  <rect class="box-g" x="440" y="92" width="150" height="36" rx="6"/>
  <text class="tx" x="515" y="110" text-anchor="middle" dominant-baseline="middle">Order service (x5)</text>
  <rect class="box-g" x="440" y="162" width="150" height="36" rx="6"/>
  <text class="tx" x="515" y="180" text-anchor="middle" dominant-baseline="middle">Payment service (x2)</text>
</svg>`, caption: "One public entry point; the gateway routes by path and applies cross-cutting policies" },
        { table: { head: ["", "Load balancer", "API gateway"], rows: [
          ["Main job", "Spread traffic over identical instances", "Single front door for many different services"],
          ["Awareness", "Connections / HTTP basics", "API-level: routes, users, API keys, quotas"],
          ["Features", "Health checks, algorithms, TLS", "Auth, rate limits, request/response transform, aggregation, caching, API versioning"],
          ["Examples", "AWS ALB/NLB, HAProxy", "Kong, AWS API Gateway, Apigee, Nginx/Envoy configured as gateway"]
        ] } },
        { p: "<b>Backend-for-Frontend (BFF)</b>: a separate gateway per client type (mobile BFF, web BFF) that aggregates exactly what that client needs." },
        { warn: "Keep business logic out of the gateway, and run it redundantly — otherwise it becomes a bottleneck and a single point of failure." }
      ]
    },
    {
      id: "rate-limiting-algorithms",
      q: "Explain rate limiting algorithms: token bucket, leaky bucket, fixed window and sliding window.",
      topic: "APIs & Communication",
      level: 2,
      top: true,
      short: "Token bucket refills tokens at a fixed rate and each request spends one, allowing bursts up to bucket size. Leaky bucket queues requests and processes them at a constant rate. Fixed window counts per clock window (bursty at edges). Sliding window log/counter smooths the boundary by looking at the last N seconds.",
      a: [
        { p: "<b>Rate limiting</b> caps how many requests a client (user, IP, API key) can make in a time period — protecting against abuse, DoS and runaway clients. Rejected requests get <code>HTTP 429 Too Many Requests</code> with a <code>Retry-After</code> header." },
        { table: { head: ["Algorithm", "Idea", "Bursts?", "Memory", "Notes"], rows: [
          ["<b>Token bucket</b>", "Bucket of capacity B refills r tokens/s; request needs 1 token", "Yes, up to B", "2 numbers per key", "Most popular (AWS, Stripe)"],
          ["<b>Leaky bucket</b>", "Requests enter a FIFO queue drained at constant rate", "No — output is smooth", "Queue per key", "Traffic shaping; adds latency"],
          ["<b>Fixed window</b>", "Counter per minute: <code>INCR user:12:05</code>", "2× limit at window edge", "1 counter", "Simplest"],
          ["<b>Sliding window log</b>", "Store timestamps; count those in last W s", "No", "One entry per request", "Exact but memory-heavy"],
          ["<b>Sliding window counter</b>", "Weighted mix of current and previous window", "Minimal", "2 counters", "Good approximation, cheap"]
        ] } },
        { code: [
          { lang: "python", src: `import time

class TokenBucket:
    def __init__(self, capacity, refill_per_sec):
        self.capacity = capacity          # max burst size
        self.rate = refill_per_sec        # steady-state rate
        self.tokens = capacity
        self.last = time.monotonic()

    def allow(self):
        now = time.monotonic()
        # add tokens earned since last call, never above capacity
        self.tokens = min(self.capacity,
                          self.tokens + (now - self.last) * self.rate)
        self.last = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False                      # -> HTTP 429` },
          { lang: "text", src: `# Leaky bucket (queue-based)
on request(r):
    if queue.size < CAPACITY: queue.push(r)
    else: reject 429

every 1/RATE seconds:           # constant outflow
    if queue not empty: process(queue.pop())

# Sliding window counter
on request at time t:
    cur  = count[window(t)]
    prev = count[window(t) - 1]
    elapsed = (t mod W) / W                 # fraction into current window
    estimate = cur + prev * (1 - elapsed)
    if estimate < LIMIT: count[window(t)] += 1; allow
    else: reject 429` }
        ], title: "Token bucket (Python) and leaky bucket / sliding window (pseudo-code)" },
        { p: "Fixed-window edge problem: limit 100/min, a client sends 100 at 12:00:59 and 100 at 12:01:00 → 200 requests in 2 seconds. Sliding windows fix this." },
        { tip: "In a distributed system the counters live in <b>Redis</b> (shared by all API servers), updated atomically with <code>INCR</code> or a Lua script. See the rate limiter design question." }
      ]
    },
    {
      id: "microservices-vs-monolith",
      q: "Monolith vs microservices — what are the trade-offs?",
      topic: "APIs & Communication",
      level: 1,
      top: true,
      short: "A monolith is one deployable application with a shared codebase and database — simple to build, test and deploy early on. Microservices split the system into small independently deployable services owning their own data — they scale teams and components independently but add network calls, distributed data and operational complexity.",
      a: [
        { table: { head: ["", "Monolith", "Microservices"], rows: [
          ["Deployment", "One unit; any change redeploys everything", "Each service deploys independently"],
          ["Scaling", "Scale the whole app", "Scale hot services only (e.g. search ×20)"],
          ["Data", "One shared database, easy joins & transactions", "Database per service; sagas, eventual consistency"],
          ["Communication", "In-process function calls (fast, reliable)", "Network calls (latency, partial failure)"],
          ["Tech stack", "One language/framework", "Polyglot per service"],
          ["Failure isolation", "A memory leak can take down everything", "Failures contained (with timeouts/circuit breakers)"],
          ["Team fit", "Small team, early product", "Many teams owning separate domains"],
          ["Ops overhead", "Low", "High: service discovery, tracing, CI/CD per service, K8s"]
        ] } },
        { p: "Middle ground: a <b>modular monolith</b> — one deployable, but strong module boundaries, so modules can later be extracted into services (the <i>strangler fig</i> pattern)." },
        { tip: "Interviewers like pragmatism: \"Start with a well-structured monolith; split out a service when a clear need appears — independent scaling, a separate team, or a different reliability requirement.\"" },
        { warn: "A \"distributed monolith\" — services that share one database or must be deployed together — has the costs of both and the benefits of neither." }
      ]
    },
    {
      id: "service-discovery",
      q: "What is service discovery and why is it needed in microservices?",
      topic: "APIs & Communication",
      level: 2,
      top: false,
      short: "In dynamic environments instances start, stop and move constantly, so hard-coded IPs break. Service discovery keeps a registry of healthy instances (Consul, etcd, Eureka, Kubernetes DNS); clients look up a service name and get current addresses, either directly (client-side) or via a load balancer (server-side).",
      a: [
        { p: "With autoscaling and containers, the <code>order-service</code> might be 3 instances at 10:00 and 12 instances with new IPs at 10:05. Callers need a way to find <i>currently healthy</i> instances by <b>name</b>." },
        { h: "Pieces" },
        { ol: [
          "<b>Service registry</b> — a highly available database of <code>service → [ip:port, ...]</code> (Consul, etcd, ZooKeeper, Eureka).",
          "<b>Registration</b> — instances register on startup and send heartbeats (self-registration), or the platform registers them (Kubernetes).",
          "<b>Health checking</b> — instances missing heartbeats or failing checks are removed.",
          "<b>Lookup</b> — callers resolve the name to addresses."
        ] },
        { table: { head: ["", "Client-side discovery", "Server-side discovery"], rows: [
          ["Who queries registry", "The calling service (library)", "A load balancer / router"],
          ["Load balancing", "In the client", "In the LB"],
          ["Pros", "One less hop; smart client-side LB", "Clients stay simple, language-agnostic"],
          ["Examples", "Netflix Eureka + Ribbon, gRPC client LB", "Kubernetes Service (DNS + kube-proxy), AWS ALB"]
        ] } },
        { tip: "In Kubernetes you get it for free: <code>http://order-service.default.svc.cluster.local</code> resolves to a stable virtual IP that load-balances across healthy pods. A service mesh (Istio, Linkerd) adds retries, mTLS and tracing on top." }
      ]
    },

    /* ───────────── Reliability ───────────── */
    {
      id: "health-checks",
      q: "What are health checks? Explain liveness vs readiness probes.",
      topic: "Reliability",
      level: 1,
      top: false,
      short: "Health checks are periodic probes (usually an HTTP endpoint like /health) that load balancers and orchestrators use to decide whether an instance should get traffic or be restarted. Liveness asks 'is the process alive or stuck?' (restart if not); readiness asks 'can it serve traffic right now?' (remove from LB if not).",
      a: [
        { p: "A load balancer or Kubernetes calls an endpoint every few seconds. After N consecutive failures the instance is taken out of rotation (or restarted); after M successes it is put back." },
        { table: { head: ["", "Liveness", "Readiness"], rows: [
          ["Question", "Is the process alive / not deadlocked?", "Can it handle requests right now?"],
          ["On failure", "Restart the container", "Stop sending traffic (no restart)"],
          ["Should check", "Just the process itself (cheap)", "Warm-up done, DB pool connected, not overloaded"],
          ["Example", "<code>GET /livez</code> → 200", "<code>GET /readyz</code> → 503 during startup or drain"]
        ] } },
        { h: "Other kinds" },
        { ul: [
          "<b>Shallow</b> check: returns 200 if the web server responds.",
          "<b>Deep</b> check: also pings DB, cache, dependencies — more accurate but can cause <i>cascading</i> removal of every instance when a shared dependency blips.",
          "<b>Startup</b> probe: gives slow-booting apps time before liveness kicks in.",
          "<b>Heartbeats</b>: instances push \"I'm alive\" to a registry (service discovery, leader election)."
        ] },
        { warn: "Don't make liveness depend on the database: if the DB goes down, Kubernetes restarts every pod in a loop, making recovery worse." },
        { tip: "Graceful shutdown: on SIGTERM, fail readiness first, let the LB drain in-flight requests, then exit." }
      ]
    },
    {
      id: "monitoring-logging-metrics",
      q: "What is observability? Explain metrics, logs and traces, and what you would monitor.",
      topic: "Reliability",
      level: 1,
      top: false,
      short: "Observability is understanding a system's internal state from its outputs: metrics (numeric time series like QPS, error rate, p99 latency), logs (timestamped event records) and distributed traces (the path and timing of one request across services). Monitor the four golden signals — latency, traffic, errors, saturation — and alert on SLO breaches.",
      a: [
        { table: { head: ["Pillar", "What", "Answers", "Tools"], rows: [
          ["<b>Metrics</b>", "Aggregated numbers over time (counters, gauges, histograms)", "Is something wrong? How big? Trend?", "Prometheus + Grafana, Datadog, CloudWatch"],
          ["<b>Logs</b>", "Discrete events with context, ideally structured JSON", "What exactly happened for this request/user?", "ELK / OpenSearch, Loki, Splunk"],
          ["<b>Traces</b>", "Spans for one request across services, linked by a trace ID", "Where is the time spent? Which service failed?", "OpenTelemetry, Jaeger, Zipkin"]
        ] } },
        { h: "Four golden signals (Google SRE)" },
        { ul: [
          "<b>Latency</b> — p50/p95/p99, separately for successes and errors.",
          "<b>Traffic</b> — requests/s, messages/s.",
          "<b>Errors</b> — 5xx rate, failed jobs.",
          "<b>Saturation</b> — CPU, memory, disk, connection pool usage, <b>queue depth / consumer lag</b>."
        ] },
        { h: "Good practices" },
        { ul: [
          "Structured logs with a <b>correlation / trace ID</b> passed through every service.",
          "Alert on symptoms users feel (SLO burn rate, error rate) rather than every CPU spike; every alert must be actionable.",
          "Dashboards per service; log levels (DEBUG/INFO/WARN/ERROR) with sampling at high volume.",
          "Never log secrets, passwords or full card numbers."
        ] },
        { tip: "In a design interview, ending with \"and we'd monitor QPS, p99 latency, error rate and queue lag with alerts on the SLO\" is an easy win." }
      ]
    },
    {
      id: "retries-exponential-backoff-jitter",
      q: "How should a client retry failed requests? Explain exponential backoff and jitter.",
      topic: "Reliability",
      level: 2,
      top: false,
      short: "Retry only transient failures (timeouts, 503, 429) and only idempotent operations, with a cap on attempts. Wait exponentially longer between attempts (base × 2^n, capped) so an overloaded service can recover, and add random jitter so thousands of clients don't retry in synchronized waves.",
      a: [
        { p: "Naive immediate retries turn a small outage into a <b>retry storm</b>: every client multiplies its load by the retry count exactly when the server is weakest." },
        { h: "Rules" },
        { ol: [
          "Retry only <b>transient</b> errors: timeouts, connection reset, 503, 429 (honour <code>Retry-After</code>). Never retry 400/401/404.",
          "Only retry <b>idempotent</b> operations, or use an idempotency key.",
          "<b>Exponential backoff</b>: wait 100 ms, 200 ms, 400 ms, 800 ms... up to a cap.",
          "<b>Jitter</b>: randomise each wait so clients that failed together don't retry together.",
          "Limit attempts (3–5) and respect an overall deadline; retry at <b>one layer</b> only — retries at every layer multiply (3 × 3 × 3 = 27 calls)."
        ] },
        { code: `import random, time

class TransientError(Exception):
    pass

def call_with_retry(fn, max_attempts=5, base=0.1, cap=10.0):
    for attempt in range(max_attempts):
        try:
            return fn()
        except TransientError:
            if attempt == max_attempts - 1:
                raise                                   # give up, surface error
            backoff = min(cap, base * (2 ** attempt))   # 0.1, 0.2, 0.4, 0.8 ...
            time.sleep(random.uniform(0, backoff))      # "full jitter"`, lang: "python", title: "Exponential backoff with full jitter" },
        { table: { head: ["Attempt", "No jitter", "Full jitter (random in range)"], rows: [
          ["1", "100 ms", "0–100 ms"],
          ["2", "200 ms", "0–200 ms"],
          ["3", "400 ms", "0–400 ms"],
          ["4", "800 ms", "0–800 ms"]
        ] } },
        { tip: "Pair retries with a <b>circuit breaker</b> and a <b>retry budget</b> (e.g. retries ≤ 10% of requests) so retries never become the main source of load." }
      ]
    },
    {
      id: "circuit-breaker",
      q: "What is the circuit breaker pattern?",
      topic: "Reliability",
      level: 2,
      top: true,
      short: "A circuit breaker wraps calls to a remote dependency and tracks failures. When failures cross a threshold it 'opens' and fails fast (or returns a fallback) without calling the dependency; after a timeout it goes 'half-open' to let a few trial requests through, closing again if they succeed. It prevents cascading failures and gives the dependency time to recover.",
      a: [
        { p: "If Payment service is down and every Order request waits 30 s on a timeout, Order's threads fill up and <i>it</i> goes down too — a <b>cascading failure</b>. A circuit breaker stops calling a dependency that is clearly broken." },
        { svg: `<svg viewBox="0 0 600 230" width="600" class="dg">
  <rect class="box-g" x="30" y="40" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="95" y="62" text-anchor="middle" dominant-baseline="middle">CLOSED</text>
  <rect class="box-r" x="430" y="40" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="495" y="62" text-anchor="middle" dominant-baseline="middle">OPEN</text>
  <rect class="box-w" x="230" y="165" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="300" y="187" text-anchor="middle" dominant-baseline="middle">HALF-OPEN</text>
  <line class="ln-a" x1="160" y1="55" x2="428" y2="55" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="295" y="46" text-anchor="middle">failure rate ≥ threshold</text>
  <line class="ln" x1="510" y1="84" x2="372" y2="182" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="505" y="150" text-anchor="middle">after timeout (30 s)</text>
  <line class="ln ln-d" x1="345" y1="165" x2="448" y2="86" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="365" y="112" text-anchor="middle">trial fails</text>
  <line class="ln" x1="230" y1="180" x2="100" y2="86" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="120" y="150" text-anchor="middle">trials succeed</text>
  <text class="tx-m" x="95" y="100" text-anchor="middle">calls pass through</text>
  <rect class="box" x="435" y="8" width="120" height="26" rx="6"/>
  <text class="tx-m" x="495" y="21" text-anchor="middle" dominant-baseline="middle">fail fast / fallback</text>
</svg>`, caption: "Circuit breaker state machine" },
        { table: { head: ["State", "Behaviour"], rows: [
          ["Closed", "Normal: requests go through, failures are counted in a rolling window"],
          ["Open", "Requests fail immediately (or get a fallback) — no load on the dependency"],
          ["Half-open", "Allow a few trial requests; success → Closed, failure → Open again"]
        ] } },
        { h: "Fallbacks" },
        { ul: [
          "Serve cached/stale data (recommendations from yesterday).",
          "Degrade gracefully (hide the reviews widget).",
          "Queue the work for later (accept the order, charge asynchronously)."
        ] },
        { tip: "Mention the resilience toolkit together: <b>timeouts</b> + <b>retries with backoff</b> + <b>circuit breaker</b> + <b>bulkheads</b> (separate thread pools per dependency). Libraries: Resilience4j, Polly; service meshes (Istio/Envoy) provide it at the network layer." }
      ]
    },

    /* ───────────── Classic Designs ───────────── */
    {
      id: "design-url-shortener",
      q: "Design a URL shortener like bit.ly.",
      topic: "Classic Designs",
      level: 2,
      top: true,
      short: "Store a mapping from a short code to the long URL. Generate codes by base62-encoding a unique numeric ID (7 chars ≈ 3.5 trillion codes), store in a sharded key-value/SQL store, cache hot codes in Redis, and serve reads with an HTTP 301/302 redirect. It is extremely read-heavy, so caching dominates the design.",
      a: [
        { h: "Requirements" },
        { ul: [
          "Functional: <code>POST /shorten {longUrl}</code> → short URL; <code>GET /{code}</code> → redirect; optional custom alias & expiry.",
          "Non-functional: very low redirect latency, high availability, codes not guessable in sequence (nice to have).",
          "Scale (see estimation question): ~1k writes/s, ~100k reads/s, ~90 TB over 5 years."
        ] },
        { svg: `<svg viewBox="0 0 620 240" width="620" class="dg">
  <rect class="box" x="10" y="100" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="50" y="120" text-anchor="middle" dominant-baseline="middle">Client</text>
  <line class="ln-a" x1="90" y1="120" x2="125" y2="120" marker-end="url(#dg-arr-a)"/>
  <rect class="box-p" x="130" y="100" width="60" height="40" rx="6"/>
  <text class="tx" x="160" y="120" text-anchor="middle" dominant-baseline="middle">LB</text>
  <line class="ln-a" x1="190" y1="120" x2="235" y2="120" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="240" y="90" width="130" height="60" rx="6"/>
  <text class="tx tx-b" x="305" y="112" text-anchor="middle" dominant-baseline="middle">URL service</text>
  <text class="tx-m" x="305" y="132" text-anchor="middle" dominant-baseline="middle">stateless, xN</text>
  <line class="ln" x1="370" y1="105" x2="445" y2="45" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="395" y="62" text-anchor="middle">1. lookup</text>
  <line class="ln" x1="370" y1="120" x2="445" y2="120" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="408" y="112" text-anchor="middle">2. on miss</text>
  <line class="ln" x1="370" y1="135" x2="445" y2="195" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="395" y="182" text-anchor="middle">new IDs</text>
  <rect class="box-g" x="450" y="25" width="160" height="40" rx="6"/>
  <text class="tx" x="530" y="45" text-anchor="middle" dominant-baseline="middle">Redis cache (hot codes)</text>
  <rect class="box" x="450" y="100" width="160" height="40" rx="6"/>
  <text class="tx" x="530" y="120" text-anchor="middle" dominant-baseline="middle">DB: code → longUrl</text>
  <rect class="box-w" x="450" y="175" width="160" height="40" rx="6"/>
  <text class="tx" x="530" y="195" text-anchor="middle" dominant-baseline="middle">ID generator (ranges)</text>
  <text class="tx-m" x="305" y="225" text-anchor="middle">GET /aZ3kQ9 → 302 Location: https://...</text>
</svg>`, caption: "URL shortener: stateless service, Redis for hot codes, sharded DB, ID range allocator" },
        { h: "Generating the short code" },
        { ul: [
          "<b>Counter + base62</b> (preferred): get a unique ID, encode in <code>[0-9a-zA-Z]</code>. Each app server leases a <b>range</b> of IDs (e.g. 1,000,000 at a time) from ZooKeeper/DB so there's no per-request coordination. Unique by construction — no collision checks.",
          "<b>Hash</b> (MD5/SHA of URL, take 7 chars): same URL → same code, but collisions must be detected and retried.",
          "To avoid guessable sequential codes, shuffle bits of the ID or use a Snowflake-style ID."
        ] },
        { code: `#include <string>
#include <algorithm>
#include <cstdint>

const std::string ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

std::string encode(uint64_t id) {          // 125 -> "21"
    if (id == 0) return "0";
    std::string s;
    while (id > 0) {
        s += ALPHABET[id % 62];
        id /= 62;
    }
    std::reverse(s.begin(), s.end());
    return s;
}

uint64_t decode(const std::string& code) { // "21" -> 125
    uint64_t id = 0;
    for (char c : code) id = id * 62 + ALPHABET.find(c);
    return id;
}`, lang: "cpp", title: "Base62 encode / decode" },
        { h: "Other decisions" },
        { ul: [
          "<b>301 vs 302</b>: 301 (permanent) is cached by browsers → less load but you lose click analytics; 302 (temporary) hits you every time → analytics possible.",
          "Storage: simple key-value access → DynamoDB/Cassandra, or sharded Postgres keyed by code.",
          "Analytics: publish click events to Kafka asynchronously; never slow the redirect.",
          "Expiry: TTL column + lazy deletion on read + periodic cleanup job."
        ] },
        { tip: "Walk the interviewer through: requirements → estimation → API → code generation → data model → read path with cache → scaling. That structure is what they grade." }
      ]
    },
    {
      id: "design-lru-cache",
      q: "Design and implement an LRU cache with O(1) get and put.",
      topic: "Classic Designs",
      level: 2,
      top: true,
      short: "Combine a doubly linked list (ordering items from most to least recently used) with a hash map from key to list node. get: look up in the map, move the node to the front. put: update or insert at the front; if over capacity, remove the tail node and its map entry. Both are O(1).",
      a: [
        { p: "Need two things in O(1): <b>find</b> a key (hash map) and <b>reorder / evict</b> by recency (doubly linked list — any node can be unlinked in O(1) if you hold a pointer to it)." },
        { svg: `<svg viewBox="0 0 620 200" width="620" class="dg">
  <rect class="box-p" x="10" y="30" width="120" height="150" rx="6"/>
  <text class="tx tx-b" x="70" y="50" text-anchor="middle">unordered_map</text>
  <text class="tx-c" x="40" y="85">key 3</text>
  <text class="tx-c" x="40" y="120">key 1</text>
  <text class="tx-c" x="40" y="155">key 2</text>
  <text class="tx tx-b" x="190" y="22" text-anchor="middle">front (MRU)</text>
  <text class="tx tx-b" x="530" y="22" text-anchor="middle">back (LRU)</text>
  <rect class="box-g" x="150" y="100" width="80" height="40" rx="6"/>
  <text class="tx-c" x="190" y="120" text-anchor="middle" dominant-baseline="middle">3 : C</text>
  <rect class="box" x="320" y="100" width="80" height="40" rx="6"/>
  <text class="tx-c" x="360" y="120" text-anchor="middle" dominant-baseline="middle">1 : A</text>
  <rect class="box-r" x="490" y="100" width="80" height="40" rx="6"/>
  <text class="tx-c" x="530" y="120" text-anchor="middle" dominant-baseline="middle">2 : B</text>
  <line class="ln" x1="230" y1="113" x2="318" y2="113" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="320" y1="128" x2="232" y2="128" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="400" y1="113" x2="488" y2="113" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="490" y1="128" x2="402" y2="128" marker-end="url(#dg-arr)"/>
  <line class="ln-a ln-d" x1="90" y1="82" x2="150" y2="104" marker-end="url(#dg-arr-a)"/>
  <path class="ln-a ln-d" d="M 90 120 Q 250 175 355 142" marker-end="url(#dg-arr-a)"/>
  <path class="ln-a ln-d" d="M 90 155 Q 300 200 525 142" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="530" y="90" text-anchor="middle">evicted next</text>
</svg>`, caption: "Hash map points to list nodes; list order = recency. Get/put move a node to the front; evict from the back" },
        { code: `#include <list>
#include <unordered_map>
#include <utility>

class LRUCache {
    int cap;
    std::list<std::pair<int, int>> items;                      // front = most recent
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> pos;

public:
    explicit LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = pos.find(key);
        if (it == pos.end()) return -1;
        items.splice(items.begin(), items, it->second);        // move to front, O(1)
        return it->second->second;
    }

    void put(int key, int value) {
        if (cap <= 0) return;
        auto it = pos.find(key);
        if (it != pos.end()) {                                 // update existing
            it->second->second = value;
            items.splice(items.begin(), items, it->second);
            return;
        }
        if ((int)items.size() == cap) {                        // evict LRU
            pos.erase(items.back().first);
            items.pop_back();
        }
        items.emplace_front(key, value);
        pos[key] = items.begin();
    }
};`, lang: "cpp", title: "LRU cache — std::list + std::unordered_map" },
        { p: "<code>list::splice</code> relinks the node without copying or invalidating iterators, so the iterators stored in the map stay valid. Trace with capacity 2: <code>put(1,A) put(2,B) get(1) put(3,C)</code> → evicts key 2 (least recently used)." },
        { tip: "Follow-ups: make it thread-safe (a mutex around get/put, or sharded locks for throughput); add TTL; LFU variant uses a map of frequency → list. Java shortcut: <code>LinkedHashMap</code> with access order + <code>removeEldestEntry</code>." }
      ]
    },
    {
      id: "design-parking-lot",
      q: "Design a parking lot system (low-level design / OOD).",
      topic: "Classic Designs",
      level: 2,
      top: true,
      short: "Identify entities — ParkingLot, Level, ParkingSpot (small/medium/large), Vehicle, Ticket, Payment — and their relationships. Parking finds the first free spot that fits the vehicle size, marks it occupied and issues a ticket; exit looks up the ticket, frees the spot and computes the fee. Keep it extensible with enums/strategies and thread-safe spot allocation.",
      a: [
        { h: "Clarify requirements first" },
        { ul: [
          "Multiple levels; spot sizes: small (bike), medium (car), large (bus/truck).",
          "Issue a ticket on entry, charge per hour on exit; show free spots per type.",
          "A smaller vehicle may use a bigger spot if its own size is full."
        ] },
        { svg: `<svg viewBox="0 0 620 230" width="620" class="dg">
  <rect class="box-a" x="10" y="20" width="170" height="90" rx="6"/>
  <text class="tx tx-b" x="95" y="38" text-anchor="middle">ParkingLot</text>
  <line class="ln" x1="10" y1="48" x2="180" y2="48"/>
  <text class="tx-c" x="18" y="66">spots, activeTickets</text>
  <text class="tx-c" x="18" y="84">park(v): Ticket</text>
  <text class="tx-c" x="18" y="100">unpark(id): fee</text>
  <rect class="box" x="300" y="20" width="160" height="90" rx="6"/>
  <text class="tx tx-b" x="380" y="38" text-anchor="middle">ParkingSpot</text>
  <line class="ln" x1="300" y1="48" x2="460" y2="48"/>
  <text class="tx-c" x="308" y="66">id, size, free</text>
  <text class="tx-c" x="308" y="84">fits(v): bool</text>
  <rect class="box" x="10" y="140" width="170" height="75" rx="6"/>
  <text class="tx tx-b" x="95" y="158" text-anchor="middle">Ticket</text>
  <line class="ln" x1="10" y1="168" x2="180" y2="168"/>
  <text class="tx-c" x="18" y="186">id, plate, spotId</text>
  <text class="tx-c" x="18" y="204">entryTime</text>
  <rect class="box" x="300" y="140" width="160" height="75" rx="6"/>
  <text class="tx tx-b" x="380" y="158" text-anchor="middle">Vehicle</text>
  <line class="ln" x1="300" y1="168" x2="460" y2="168"/>
  <text class="tx-c" x="308" y="186">plate, size</text>
  <rect class="box-p" x="500" y="60" width="110" height="70" rx="6"/>
  <text class="tx tx-b" x="555" y="78" text-anchor="middle">SpotSize</text>
  <text class="tx-c" x="555" y="98" text-anchor="middle">Small|Medium</text>
  <text class="tx-c" x="555" y="116" text-anchor="middle">|Large</text>
  <line class="ln-a" x1="180" y1="65" x2="298" y2="65" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="240" y="58" text-anchor="middle">1 has *</text>
  <line class="ln-a" x1="95" y1="110" x2="95" y2="138" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="130" y="128" text-anchor="middle">issues</text>
  <line class="ln" x1="180" y1="185" x2="298" y2="185" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="240" y="178" text-anchor="middle">for</text>
  <line class="ln ln-d" x1="460" y1="90" x2="498" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="460" y1="170" x2="520" y2="132" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Core classes and relationships (Level omitted — a lot can hold a list of levels, each holding spots)" },
        { code: `#include <string>
#include <vector>
#include <unordered_map>
#include <optional>
#include <algorithm>
#include <ctime>

enum class SpotSize { Small, Medium, Large };      // ordered: Small < Medium < Large

struct Vehicle {
    std::string plate;
    SpotSize size;                                  // bike=Small, car=Medium, bus=Large
};

struct Ticket {
    int id;
    std::string plate;
    int spotId;
    std::time_t entry;
};

class ParkingSpot {
public:
    int id; SpotSize size; bool free = true;
    ParkingSpot(int i, SpotSize s) : id(i), size(s) {}
    bool fits(const Vehicle& v) const { return free && v.size <= size; }
};

class ParkingLot {
    std::vector<ParkingSpot> spots;                 // sorted small -> large
    std::unordered_map<int, Ticket> active;         // ticketId -> ticket
    int nextTicket = 1;
public:
    void addSpot(int id, SpotSize s) { spots.emplace_back(id, s); }

    std::optional<Ticket> park(const Vehicle& v) {
        for (auto& sp : spots)
            if (sp.fits(v)) {                       // first (smallest) fitting spot
                sp.free = false;
                Ticket t{nextTicket++, v.plate, sp.id, std::time(nullptr)};
                active[t.id] = t;
                return t;
            }
        return std::nullopt;                        // full for this size
    }

    double unpark(int ticketId, double ratePerHour) {
        auto it = active.find(ticketId);
        if (it == active.end()) return -1;          // invalid ticket
        for (auto& sp : spots)
            if (sp.id == it->second.spotId) sp.free = true;
        double hrs = std::difftime(std::time(nullptr), it->second.entry) / 3600.0;
        active.erase(it);
        return std::max(1.0, hrs) * ratePerHour;    // minimum 1 hour
    }
};`, lang: "cpp", title: "Parking lot core (C++17)" },
        { h: "Extensions to mention" },
        { ul: [
          "Per-size free lists (queues of free spot IDs) → O(1) allocation instead of scanning.",
          "<b>Strategy</b> pattern for pricing (hourly, flat, weekend) and for spot selection (nearest to entrance).",
          "<b>Singleton</b>/single instance for the lot; <b>Factory</b> for vehicles.",
          "Concurrency: multiple entry gates → lock per level or atomic compare-and-set on the spot's <code>free</code> flag."
        ] },
        { tip: "In LLD rounds, spend the first minutes on requirements and the class list; interviewers grade clean responsibilities (SOLID) and extensibility more than full code." }
      ]
    },
    {
      id: "design-rate-limiter",
      q: "Design a distributed rate limiter for an API.",
      topic: "Classic Designs",
      level: 2,
      top: false,
      short: "Put rate-limiting middleware in the API gateway. For each request, derive a key (user ID / API key / IP), atomically update a counter or token bucket in a shared Redis cluster using a Lua script, and either forward the request or return 429 with Retry-After and X-RateLimit headers. Rules live in config; fail open if Redis is unavailable.",
      a: [
        { h: "Requirements" },
        { ul: [
          "Limit per user/IP/API key, e.g. 100 req/min; different rules per endpoint.",
          "Very low overhead (&lt;1–2 ms), works across many API servers, highly available.",
          "Tell clients they are throttled (429 + headers)."
        ] },
        { svg: `<svg viewBox="0 0 620 220" width="620" class="dg">
  <rect class="box" x="10" y="85" width="80" height="40" rx="6"/>
  <text class="tx tx-b" x="50" y="105" text-anchor="middle" dominant-baseline="middle">Client</text>
  <line class="ln-a" x1="90" y1="100" x2="175" y2="100" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="180" y="75" width="150" height="60" rx="6"/>
  <text class="tx tx-b" x="255" y="97" text-anchor="middle" dominant-baseline="middle">API gateway</text>
  <text class="tx-m" x="255" y="117" text-anchor="middle" dominant-baseline="middle">rate-limit middleware</text>
  <line class="ln ln-d" x1="180" y1="120" x2="92" y2="120" marker-end="url(#dg-arr)"/>
  <text class="tx-a" x="135" y="140" text-anchor="middle">429</text>
  <line class="ln" x1="255" y1="75" x2="255" y2="42" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="190" y="5" width="130" height="36" rx="6"/>
  <text class="tx" x="255" y="23" text-anchor="middle" dominant-baseline="middle">Redis cluster</text>
  <text class="tx-m" x="330" y="60">counters / buckets</text>
  <line class="ln ln-d" x1="255" y1="175" x2="255" y2="137" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="190" y="175" width="130" height="36" rx="6"/>
  <text class="tx" x="255" y="193" text-anchor="middle" dominant-baseline="middle">Rules config</text>
  <line class="ln-a" x1="330" y1="105" x2="445" y2="105" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="388" y="97" text-anchor="middle">allowed</text>
  <rect class="box" x="450" y="80" width="150" height="50" rx="6"/>
  <text class="tx tx-b" x="525" y="105" text-anchor="middle" dominant-baseline="middle">API servers</text>
</svg>`, caption: "Rate limiter in the gateway, with shared counters in Redis and rules loaded from config" },
        { h: "Key decisions" },
        { ol: [
          "<b>Where</b>: API gateway / middleware (central) rather than each service; client-side limits can't be trusted.",
          "<b>Algorithm</b>: token bucket (allows bursts) or sliding window counter (smooth) — see the rate limiting algorithms question.",
          "<b>Atomicity</b>: read-modify-write races between servers → do it in one Redis Lua script or <code>INCR</code> + <code>EXPIRE</code>.",
          "<b>Response</b>: <code>429 Too Many Requests</code>, headers <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>Retry-After</code>.",
          "<b>Failure</b>: if Redis is down, <b>fail open</b> (allow) for most APIs to avoid a self-inflicted outage; fail closed for sensitive endpoints like login/OTP."
        ] },
        { code: `-- KEYS[1] = "rl:{user42}:1727260800"   ARGV[1] = limit   ARGV[2] = window secs
local n = redis.call("INCR", KEYS[1])
if n == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[2])
end
if n > tonumber(ARGV[1]) then
    return 0          -- reject
end
return 1              -- allow`, lang: "text", title: "Fixed-window check as an atomic Redis Lua script" },
        { tip: "Scale note: shard counters by key across the Redis cluster; for extreme QPS keep a small local in-memory bucket per server and sync periodically, trading a little accuracy for latency." }
      ]
    },
    {
      id: "design-notification-service",
      q: "Design a notification service that sends push, SMS and email notifications.",
      topic: "Classic Designs",
      level: 2,
      top: false,
      short: "Services call a Notification API; it validates the request, checks user preferences and rate limits, renders a template, and enqueues a message on a per-channel queue. Channel workers send via third-party providers (APNs/FCM, SMS gateway, email provider), retry with backoff, move poison messages to a DLQ, and log delivery status.",
      a: [
        { h: "Requirements" },
        { ul: [
          "Channels: mobile push, SMS, email (maybe in-app). Triggered by other services (order shipped, OTP, marketing).",
          "Respect user preferences / opt-outs and quiet hours; no duplicates; OTPs must be fast.",
          "Millions per day; tolerate provider outages."
        ] },
        { svg: `<svg viewBox="0 0 640 240" width="640" class="dg">
  <rect class="box" x="10" y="95" width="95" height="50" rx="6"/>
  <text class="tx" x="57" y="113" text-anchor="middle" dominant-baseline="middle">Order, Auth,</text>
  <text class="tx" x="57" y="130" text-anchor="middle" dominant-baseline="middle">Marketing svcs</text>
  <line class="ln-a" x1="105" y1="120" x2="145" y2="120" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="150" y="90" width="120" height="60" rx="6"/>
  <text class="tx tx-b" x="210" y="112" text-anchor="middle" dominant-baseline="middle">Notification</text>
  <text class="tx tx-b" x="210" y="130" text-anchor="middle" dominant-baseline="middle">service</text>
  <line class="ln ln-d" x1="210" y1="150" x2="210" y2="183" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="150" y="185" width="120" height="40" rx="6"/>
  <text class="tx-m" x="210" y="205" text-anchor="middle" dominant-baseline="middle">prefs + templates</text>
  <line class="ln" x1="270" y1="105" x2="325" y2="45" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="270" y1="120" x2="325" y2="120" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="270" y1="135" x2="325" y2="195" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="330" y="28" width="90" height="34" rx="6"/>
  <text class="tx" x="375" y="45" text-anchor="middle" dominant-baseline="middle">Push queue</text>
  <rect class="box-w" x="330" y="103" width="90" height="34" rx="6"/>
  <text class="tx" x="375" y="120" text-anchor="middle" dominant-baseline="middle">SMS queue</text>
  <rect class="box-w" x="330" y="178" width="90" height="34" rx="6"/>
  <text class="tx" x="375" y="195" text-anchor="middle" dominant-baseline="middle">Email queue</text>
  <line class="ln" x1="420" y1="45" x2="500" y2="45" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="420" y1="120" x2="500" y2="120" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="420" y1="195" x2="500" y2="195" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="460" y="37" text-anchor="middle">workers</text>
  <rect class="box-g" x="505" y="28" width="125" height="34" rx="6"/>
  <text class="tx" x="567" y="45" text-anchor="middle" dominant-baseline="middle">APNs / FCM</text>
  <rect class="box-g" x="505" y="103" width="125" height="34" rx="6"/>
  <text class="tx" x="567" y="120" text-anchor="middle" dominant-baseline="middle">SMS gateway</text>
  <rect class="box-g" x="505" y="178" width="125" height="34" rx="6"/>
  <text class="tx" x="567" y="195" text-anchor="middle" dominant-baseline="middle">Email provider</text>
</svg>`, caption: "Notification pipeline: API → preference/template check → per-channel queues → workers → providers" },
        { h: "Design points" },
        { ul: [
          "<b>Separate queue per channel</b> (and per priority): an email backlog must not delay OTP SMS.",
          "<b>Idempotency</b>: dedupe on a notification ID so retries don't send twice.",
          "<b>Retries</b> with exponential backoff; after N failures → <b>dead-letter queue</b>; fail over to a second provider.",
          "<b>Rate limit</b> per user (no spam) and per provider (their API quotas).",
          "<b>Tracking</b>: store status (queued → sent → delivered → opened) from provider webhooks; analytics via events.",
          "Device tokens / emails / phone numbers kept in a contact store; bulk campaigns processed in batches off-peak."
        ] },
        { tip: "The one-line architecture interviewers want: \"API → validate & prefs → queue per channel → stateless workers → third-party providers, with retries, DLQ and status tracking.\"" }
      ]
    },
    {
      id: "design-chat-app",
      q: "Design a chat application like WhatsApp (1:1 and group messaging).",
      topic: "Classic Designs",
      level: 3,
      top: true,
      short: "Clients keep a persistent WebSocket to a chat server. A session registry in Redis maps each user to the server holding their connection. A sent message is stored (Cassandra, partitioned by conversation), then routed to the recipient's server via pub/sub, or to a push notification if they are offline. Track sent/delivered/read with acks.",
      a: [
        { h: "Requirements" },
        { ul: [
          "1:1 and small group chat, online/last-seen, sent/delivered/read ticks, offline delivery, message history.",
          "Low latency (&lt;200 ms), messages never lost, ordered within a conversation."
        ] },
        { svg: `<svg viewBox="0 0 640 250" width="640" class="dg">
  <rect class="box" x="10" y="40" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="58" text-anchor="middle" dominant-baseline="middle">User A</text>
  <rect class="box" x="550" y="40" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="590" y="58" text-anchor="middle" dominant-baseline="middle">User B</text>
  <line class="ln-a" x1="90" y1="58" x2="145" y2="58" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="118" y="50" text-anchor="middle">WS</text>
  <rect class="box-a" x="150" y="35" width="120" height="46" rx="6"/>
  <text class="tx tx-b" x="210" y="58" text-anchor="middle" dominant-baseline="middle">Chat server 1</text>
  <rect class="box-a" x="370" y="35" width="120" height="46" rx="6"/>
  <text class="tx tx-b" x="430" y="58" text-anchor="middle" dominant-baseline="middle">Chat server 2</text>
  <line class="ln-a" x1="490" y1="58" x2="548" y2="58" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="520" y="50" text-anchor="middle">WS</text>
  <line class="ln-a" x1="270" y1="58" x2="368" y2="58" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="320" y="50" text-anchor="middle">via pub/sub</text>
  <line class="ln" x1="190" y1="81" x2="130" y2="148" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="30" y="150" width="160" height="40" rx="6"/>
  <text class="tx" x="110" y="170" text-anchor="middle" dominant-baseline="middle">Message store</text>
  <text class="tx-m" x="110" y="205" text-anchor="middle">Cassandra, by conversation</text>
  <line class="ln" x1="230" y1="81" x2="300" y2="148" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="240" y="150" width="160" height="40" rx="6"/>
  <text class="tx" x="320" y="170" text-anchor="middle" dominant-baseline="middle">Session registry</text>
  <text class="tx-m" x="320" y="205" text-anchor="middle">Redis: B → server 2</text>
  <line class="ln ln-d" x1="265" y1="81" x2="485" y2="148" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="450" y="150" width="170" height="40" rx="6"/>
  <text class="tx" x="535" y="170" text-anchor="middle" dominant-baseline="middle">Push service</text>
  <text class="tx-m" x="535" y="205" text-anchor="middle">if B offline → APNs / FCM</text>
</svg>`, caption: "Chat: persistent WebSockets, session registry to locate the recipient, durable store, push fallback" },
        { h: "Send flow" },
        { ol: [
          "A sends <code>{convId, clientMsgId, text}</code> over its WebSocket to chat server 1.",
          "Server assigns a time-sortable message ID (Snowflake), persists to the message store, acks A → <b>✓ sent</b>.",
          "Looks up B in the session registry. Online → forward to server 2 (via Redis pub/sub / internal RPC) → delivered to B → B acks → <b>✓✓ delivered</b>.",
          "Offline → push notification; B fetches missed messages on reconnect using its last seen message ID.",
          "B opens the chat → read receipt → <b>blue ticks</b>."
        ] },
        { h: "Data & scale" },
        { ul: [
          "Messages table partitioned by <code>conversation_id</code>, clustered by <code>message_id</code> → fetch recent messages of a chat in one partition read; write-heavy → Cassandra/HBase.",
          "Group messages: fan out to each member's server (fine for small groups; large channels use fan-out on read).",
          "Presence: heartbeat every ~30 s; mark offline after missed heartbeats; publish presence only to friends currently viewing.",
          "<code>clientMsgId</code> makes resends idempotent; per-conversation ordering via message ID."
        ] },
        { tip: "Key words to hit: WebSocket, session/connection registry, message store partitioned by conversation, ack-based delivery states, offline push, idempotent resend." }
      ]
    },
    {
      id: "design-news-feed",
      q: "Design a news feed (like Twitter/Instagram home timeline). Fan-out on write vs fan-out on read?",
      topic: "Classic Designs",
      level: 3,
      top: false,
      short: "Two parts: publishing a post and building each user's feed. Fan-out on write (push) copies the post ID into every follower's pre-computed feed cache at post time — fast reads, expensive for celebrities. Fan-out on read (pull) merges followees' posts at read time — cheap writes, slow reads. Real systems use a hybrid: push for normal users, pull for celebrities.",
      a: [
        { svg: `<svg viewBox="0 0 640 250" width="640" class="dg">
  <text class="tx tx-b" x="10" y="18">Write path</text>
  <rect class="box" x="10" y="35" width="80" height="36" rx="6"/>
  <text class="tx" x="50" y="53" text-anchor="middle" dominant-baseline="middle">Author</text>
  <line class="ln-a" x1="90" y1="53" x2="130" y2="53" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="135" y="35" width="100" height="36" rx="6"/>
  <text class="tx" x="185" y="53" text-anchor="middle" dominant-baseline="middle">Post service</text>
  <line class="ln" x1="185" y1="71" x2="185" y2="103" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="135" y="105" width="100" height="32" rx="6"/>
  <text class="tx" x="185" y="121" text-anchor="middle" dominant-baseline="middle">Post DB</text>
  <line class="ln" x1="235" y1="53" x2="280" y2="53" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="285" y="35" width="80" height="36" rx="6"/>
  <text class="tx" x="325" y="53" text-anchor="middle" dominant-baseline="middle">Queue</text>
  <line class="ln" x1="365" y1="53" x2="405" y2="53" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="410" y="35" width="100" height="36" rx="6"/>
  <text class="tx" x="460" y="53" text-anchor="middle" dominant-baseline="middle">Fan-out workers</text>
  <line class="ln ln-d" x1="460" y1="35" x2="560" y2="22" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="565" y="25">followers</text>
  <line class="ln-a" x1="460" y1="71" x2="460" y2="138" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="400" y="140" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="460" y="156" text-anchor="middle" dominant-baseline="middle">Feed cache</text>
  <text class="tx-m" x="460" y="174" text-anchor="middle" dominant-baseline="middle">user → [postIds]</text>
  <text class="tx tx-b" x="10" y="175">Read path</text>
  <rect class="box" x="10" y="195" width="80" height="36" rx="6"/>
  <text class="tx" x="50" y="213" text-anchor="middle" dominant-baseline="middle">Reader</text>
  <line class="ln-a" x1="90" y1="213" x2="170" y2="213" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="175" y="195" width="110" height="36" rx="6"/>
  <text class="tx" x="230" y="213" text-anchor="middle" dominant-baseline="middle">Feed service</text>
  <line class="ln" x1="285" y1="205" x2="398" y2="170" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="335" y="178" text-anchor="middle">1. IDs</text>
  <line class="ln" x1="285" y1="222" x2="535" y2="222" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="410" y="238" text-anchor="middle">2. hydrate posts</text>
  <rect class="box-p" x="540" y="205" width="90" height="34" rx="6"/>
  <text class="tx" x="585" y="222" text-anchor="middle" dominant-baseline="middle">Post cache</text>
</svg>`, caption: "Fan-out on write: post IDs pushed into each follower's feed cache; reads fetch IDs then hydrate posts" },
        { table: { head: ["", "Fan-out on write (push)", "Fan-out on read (pull)"], rows: [
          ["When work happens", "At post time: insert post ID into every follower's feed", "At read time: fetch recent posts of all followees, merge, sort"],
          ["Read latency", "Very fast (pre-computed list)", "Slow for users following many accounts"],
          ["Write cost", "Huge for celebrities (100 M followers = 100 M writes)", "One write"],
          ["Wasted work", "Feeds computed for inactive users", "None"],
          ["Good for", "Normal users (the majority)", "Celebrities / inactive followers"]
        ] } },
        { h: "Hybrid (what real systems do)" },
        { p: "Push posts of normal users into followers' feed caches. For celebrities (> ~10k followers), <b>don't</b> fan out; at read time, merge the reader's pre-computed feed with recent posts from the celebrities they follow. Only fan out to recently active followers." },
        { h: "Other details" },
        { ul: [
          "Feed cache stores only post IDs (e.g. last 500 per user in a Redis list/sorted set); post bodies, users and like counts come from their own caches.",
          "Pagination with a cursor (last seen post ID / timestamp), not offsets.",
          "Ranking: chronological first; ML ranking is a later step that reorders candidate posts.",
          "Media stored in object storage (S3) and served via CDN."
        ] },
        { tip: "The celebrity problem is the whole point of this question — raise it yourself before the interviewer asks." }
      ]
    }
  ]
});
