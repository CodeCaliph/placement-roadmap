/* study: High-Level Design (system design) — lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ------------------------------------------------------------------ */
  /* D43 — core vocabulary, part 1: scaling, LB, caching, CDN, stateless */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-scaling-lb-caching",
    subject: "hld",
    title: "Scaling, load balancers, caching, CDN & stateless services",
    minutes: 60,
    crux: [
      "<b>Vertical scaling</b> = bigger machine (simple, hard ceiling, single point of failure). <b>Horizontal scaling</b> = more machines behind a load balancer (near-unlimited, but needs stateless services and brings distributed-systems problems).",
      "<b>Stateless service</b>: any instance can serve any request because session/user state lives outside it (Redis, DB, JWT). This is the precondition for horizontal scaling and autoscaling.",
      "<b>L4 load balancer</b> routes by IP/port (fast, content-blind); <b>L7</b> reads HTTP (path/header/cookie routing, TLS termination). Algorithms: round robin, weighted, least connections, IP hash / consistent hash.",
      "Caching patterns: <b>cache-aside</b> (app reads cache, on miss reads DB and fills cache — the default), <b>write-through</b> (write cache + DB together), <b>write-back</b> (write cache, flush DB later — fast but can lose data).",
      "Eviction: <b>LRU</b> (most common), LFU, FIFO, TTL. Invalidation on write: <b>update DB, then delete the cache key</b> + a TTL as safety net.",
      "A <b>CDN</b> caches static (and cacheable dynamic) content at edge locations near users: lower latency, and most bandwidth never reaches your origin.",
    ],
    sections: [
      { h: "Vertical vs horizontal scaling", blocks: [
        { p: "When one server cannot handle the load, you have two options. <b>Scale up</b> (vertical): more CPU, RAM, faster disk on the same box. <b>Scale out</b> (horizontal): add more boxes and spread the load." },
        { table: { head: ["", "Vertical (scale up)", "Horizontal (scale out)"], rows: [
          ["How", "Bigger machine", "More machines + load balancer"],
          ["Limit", "Hard ceiling (largest instance available)", "Practically unlimited"],
          ["Failure", "Single point of failure", "One node dies, others keep serving"],
          ["Complexity", "None in code", "Needs stateless apps, data partitioning, consistency handling"],
          ["Cost curve", "Gets expensive fast at the top end", "Commodity machines, pay per node"],
          ["Typical use", "Databases early on, quick fix", "Web/app tier, caches, sharded DBs"],
        ] } },
        { tip: "Say: <i>Start vertical for the database because it is simplest; scale the stateless app tier horizontally from day one behind a load balancer; shard the DB only when replicas and caching are not enough.</i> Showing you know the order of steps impresses more than naming tools." },
      ] },
      { h: "Stateless services and the standard architecture", blocks: [
        { p: "A service is <b>stateless</b> if it keeps nothing about a user between requests in its own memory. If user session data lives in server A's RAM, the next request must go to A again (sticky sessions) — A becomes special, cannot be killed freely, and autoscaling breaks. Move state out:" },
        { ul: [
          "Sessions → Redis (shared) or a signed <b>JWT</b> carried by the client.",
          "Uploaded files → object storage (S3-like), not local disk.",
          "Data → database; hot data → shared cache.",
        ] },
        { p: "Once the app tier is stateless, the classic picture appears. Almost every HLD answer is a variation of this diagram:" },
        { svg: `<svg viewBox="0 0 710 250" width="710" class="dg">
  <rect class="box" x="10" y="110" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="128" text-anchor="middle" dominant-baseline="middle">Client</text>
  <rect class="box-p" x="10" y="25" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="43" text-anchor="middle" dominant-baseline="middle">CDN</text>
  <line class="ln ln-d" x1="50" y1="110" x2="50" y2="63" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="56" y="90">static</text>
  <rect class="box-a" x="130" y="110" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="175" y="128" text-anchor="middle" dominant-baseline="middle">Load balancer</text>
  <line class="ln-a" x1="90" y1="128" x2="128" y2="128" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="260" y="60" width="100" height="36" rx="6"/>
  <text class="tx tx-b" x="310" y="78" text-anchor="middle" dominant-baseline="middle">App 1</text>
  <rect class="box" x="260" y="110" width="100" height="36" rx="6"/>
  <text class="tx tx-b" x="310" y="128" text-anchor="middle" dominant-baseline="middle">App 2</text>
  <rect class="box" x="260" y="160" width="100" height="36" rx="6"/>
  <text class="tx tx-b" x="310" y="178" text-anchor="middle" dominant-baseline="middle">App 3</text>
  <text class="tx-m" x="310" y="212" text-anchor="middle">stateless</text>
  <line class="ln-a" x1="220" y1="128" x2="258" y2="80" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="220" y1="128" x2="258" y2="128" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="220" y1="128" x2="258" y2="176" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="410" y="30" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="465" y="48" text-anchor="middle" dominant-baseline="middle">Cache (Redis)</text>
  <rect class="box-a" x="410" y="110" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="465" y="128" text-anchor="middle" dominant-baseline="middle">DB leader</text>
  <rect class="box-w" x="410" y="190" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="465" y="208" text-anchor="middle" dominant-baseline="middle">Queue</text>
  <line class="ln" x1="360" y1="78" x2="408" y2="50" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="360" y1="128" x2="408" y2="128" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="360" y1="178" x2="408" y2="206" marker-end="url(#dg-arr)"/>
  <rect class="box" x="575" y="85" width="120" height="30" rx="6"/>
  <text class="tx" x="635" y="100" text-anchor="middle" dominant-baseline="middle">Read replica 1</text>
  <rect class="box" x="575" y="135" width="120" height="30" rx="6"/>
  <text class="tx" x="635" y="150" text-anchor="middle" dominant-baseline="middle">Read replica 2</text>
  <line class="ln ln-d" x1="520" y1="124" x2="573" y2="102" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="520" y1="132" x2="573" y2="148" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="548" y="78" text-anchor="middle">async repl</text>
  <rect class="box" x="575" y="190" width="120" height="36" rx="6"/>
  <text class="tx tx-b" x="635" y="208" text-anchor="middle" dominant-baseline="middle">Workers</text>
  <line class="ln" x1="520" y1="208" x2="573" y2="208" marker-end="url(#dg-arr)"/>
</svg>`, caption: "The default web architecture: CDN for static files, LB in front of stateless app servers, cache + DB (leader with read replicas), queue + async workers for slow jobs." },
      ] },
      { h: "Load balancers: L4 vs L7, algorithms, health checks", blocks: [
        { p: "A load balancer (LB) is the single entry point that spreads requests across healthy servers. It also enables zero-downtime deploys (drain one server, update it, put it back)." },
        { table: { head: ["", "L4 (transport)", "L7 (application)"], rows: [
          ["Looks at", "IP + port (TCP/UDP)", "HTTP method, path, headers, cookies"],
          ["Can do", "Forward connections, very fast", "Path routing (<code>/api</code> vs <code>/img</code>), TLS termination, header rewrite, auth, rate limiting"],
          ["Cost", "Cheap, low latency", "More CPU (parses every request)"],
          ["Examples", "AWS NLB, LVS", "Nginx, HAProxy (HTTP mode), AWS ALB, Envoy"],
        ] } },
        { table: { head: ["Algorithm", "How", "Good when"], rows: [
          ["Round robin", "1, 2, 3, 1, 2, 3 …", "Identical servers, similar requests"],
          ["Weighted round robin", "Bigger server gets more turns", "Mixed hardware"],
          ["Least connections", "Send to server with fewest open connections", "Long/uneven requests (WebSockets, uploads)"],
          ["Least response time", "Fewest connections + lowest latency", "Latency-sensitive APIs"],
          ["IP hash / consistent hash", "hash(client IP or key) picks the server", "Sticky routing, cache locality (same key → same cache node)"],
        ] } },
        { ul: [
          "<b>Health checks</b>: LB pings <code>/health</code> every few seconds; a server failing N checks is removed until it recovers.",
          "<b>LB is itself a SPOF</b> → run a pair (active-passive with a floating IP) or use a managed LB; DNS can spread across several LBs/regions.",
          "<b>Sticky sessions</b> (cookie-based affinity) exist but are a smell — prefer stateless apps.",
        ] },
      ] },
      { h: "Caching: patterns, eviction, invalidation", blocks: [
        { p: "A cache keeps hot data in memory (Redis/Memcached, ~sub-millisecond) so you skip the slower DB (~1–10 ms per query, more under load). It works because access is skewed: a small fraction of keys gets most reads (the 80/20 rule)." },
        { h: "Where to cache" },
        { ul: ["Client/browser (HTTP <code>Cache-Control</code>)", "CDN edge", "Application-local (in-process, e.g. Caffeine) — fastest but each instance has its own copy", "Distributed cache (Redis) — shared by all instances", "DB buffer pool (automatic)"] },
        { h: "Read/write patterns" },
        { table: { head: ["Pattern", "Read path", "Write path", "Trade-off"], rows: [
          ["<b>Cache-aside</b> (lazy loading)", "App checks cache; miss → read DB → put in cache", "Write DB, then <b>delete</b> the key", "Default choice. Only requested data is cached. First read after miss is slow."],
          ["Read-through", "App asks cache; cache itself loads from DB on miss", "—", "Same as cache-aside but logic lives in the cache library."],
          ["<b>Write-through</b>", "Read from cache", "Write cache and DB synchronously", "Cache always fresh; every write pays both latencies; caches data that may never be read."],
          ["<b>Write-back</b> (write-behind)", "Read from cache", "Write cache only; flush to DB asynchronously in batches", "Very fast writes; <b>data loss</b> if cache node dies before flush. Good for counters, likes, metrics."],
          ["Write-around", "Cache-aside reads", "Write DB only, skip cache", "Avoids polluting cache with write-once data (logs, uploads)."],
        ] } },
        { code: `read(key):
    v = cache.get(key)
    if v != null: return v              // hit
    v = db.query(key)                   // miss
    cache.set(key, v, ttl = 10 min)
    return v

write(key, newValue):
    db.update(key, newValue)            // 1. source of truth first
    cache.delete(key)                   // 2. invalidate (do NOT set)`, lang: "text", title: "Cache-aside in pseudo-code" },
        { h: "Eviction policies (when the cache is full)" },
        { table: { head: ["Policy", "Evicts", "Notes"], rows: [
          ["LRU", "Least recently used", "Most common default; O(1) with hashmap + doubly linked list"],
          ["LFU", "Least frequently used", "Better for stable popularity; old-but-once-popular keys can linger"],
          ["FIFO", "Oldest inserted", "Simple, ignores usage"],
          ["TTL", "Expired keys", "Not a full policy, but bounds staleness; combine with LRU"],
        ] } },
        { h: "Invalidation — the hard part" },
        { ul: [
          "<b>Delete, don't update</b> the key on write: two concurrent writers updating the cache can leave it with the older value; deleting just forces a fresh read.",
          "<b>Always set a TTL</b> as a safety net so any missed invalidation heals itself.",
          "<b>Cache stampede</b> (thundering herd): a hot key expires and 10,000 requests hit the DB at once → one request recomputes (lock / request coalescing), others wait or get the stale value.",
          "<b>Cache avalanche</b>: many keys expire at the same moment → add random jitter to TTLs.",
          "<b>Cache penetration</b>: requests for keys that don't exist always miss → cache the 'not found' result briefly, or use a Bloom filter.",
        ] },
        { warn: "Caching is not free: stale reads, invalidation bugs and extra memory. Say what can tolerate staleness (product catalog, profile pictures) and what cannot (bank balance, inventory at checkout)." },
      ] },
      { h: "CDN", blocks: [
        { p: "A Content Delivery Network is a set of edge servers in many cities. The user's DNS lookup resolves to a nearby edge; the edge serves the file from its cache or fetches it once from your <b>origin</b>." },
        { ul: [
          "Serve images, video, JS/CSS, downloads — anything cacheable. Can also cache API responses with short TTLs.",
          "<b>Pull CDN</b>: edge fetches from origin on first miss (easy, default). <b>Push CDN</b>: you upload content ahead of time (large, predictable files).",
          "Invalidation: versioned file names (<code>app.3f9a.js</code>) beat purge calls — new URL = new object, old one just expires.",
          "Bonus: absorbs traffic spikes and DDoS, terminates TLS near the user.",
        ] },
        { tip: "In any design with media (Instagram, YouTube, WhatsApp images) draw <b>object storage + CDN</b> immediately and say the app servers never stream bytes themselves — they hand out URLs." },
      ] },
    ],
    practice: [
      { q: "Your Spring Boot app stores the logged-in user in an <code>HttpSession</code>. You add a second instance behind a round-robin LB and users randomly get logged out. Why, and give two fixes.", a: "The session lives in instance A's memory; round robin sends the next request to B, which has no session. Fixes: (1) move sessions to a shared store (Spring Session + Redis); (2) use a stateless signed JWT sent on every request. Sticky sessions would also 'work' but make instances non-disposable, so they are the weakest fix." },
      { q: "Which caching write pattern would you pick for (a) a like counter on posts, (b) a user's wallet balance, (c) product details pages?", a: "(a) Write-back: increment in Redis, flush to DB periodically — a few lost likes on a crash are acceptable, and it absorbs massive write rates. (b) No write-back; write to DB (source of truth) inside a transaction and either don't cache or cache-aside with delete-on-write and read from DB for payments. (c) Cache-aside with TTL (e.g. 10 min) and delete on product update — read-heavy, slight staleness fine." },
      { q: "Why should the write path in cache-aside <i>delete</i> the cache key instead of setting it to the new value?", a: "Two writers W1 (value 1) and W2 (value 2) can interleave: W1 writes DB, W2 writes DB, W2 sets cache=2, W1 sets cache=1 → cache holds 1 while DB holds 2, forever (until TTL). Deleting avoids writing a possibly-stale value; the next reader loads the current DB value. A TTL bounds any remaining race." },
      { q: "L4 or L7 load balancer: you need <code>/api/*</code> to go to the Java service and <code>/static/*</code> to an Nginx file server, with TLS terminated at the LB.", a: "L7 — routing by URL path and terminating TLS both require reading the HTTP request. An L4 LB only sees IP and port." },
      { q: "A hot key's TTL expires and the DB CPU spikes to 100%. Name the problem and two mitigations.", a: "Cache stampede / thundering herd. Mitigations: request coalescing or a distributed lock so only one request recomputes while others wait/serve stale; refresh hot keys proactively before expiry; add TTL jitter so keys don't expire together." },
    ],
    related: ["sd:horizontal-vs-vertical-scaling", "sd:stateless-services", "sd:load-balancer", "sd:load-balancing-algorithms", "sd:caching-strategies", "sd:cache-eviction-policies", "sd:cache-invalidation-problems", "sd:redis-use-cases", "sd:cdn", "sd:latency-vs-throughput", "cn:load-balancer", "cn:cdn", "cn:proxy-vs-reverse-proxy", "coa:write-through-vs-write-back"]
  });

  /* ------------------------------------------------------------------ */
  /* D43 — core vocabulary, part 2: replication, sharding, CH, CAP       */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-replication-sharding-cap",
    subject: "hld",
    title: "Replication, sharding, consistent hashing, CAP & PACELC",
    minutes: 60,
    crux: [
      "<b>Replication</b> = copies of the same data on several nodes (read scaling + fault tolerance). <b>Sharding</b> = splitting data into disjoint pieces across nodes (write + storage scaling).",
      "<b>Leader-follower</b>: all writes go to the leader, followers replay its log and serve reads. Async replication ⇒ <b>replication lag</b> ⇒ a user may not see their own write; fix with read-your-writes routing.",
      "Sharding strategies: <b>range</b> (good range scans, hot spots), <b>hash</b> (even spread, no range scans), <b>directory</b> (flexible, lookup service). <b>Hot keys</b> (celebrity) need salting/splitting or caching.",
      "<b>Consistent hashing</b>: nodes and keys on a ring, key goes to the next node clockwise. Adding/removing a node moves only ~1/N of keys (vs ~all with <code>hash % N</code>). Virtual nodes even out the load.",
      "<b>CAP</b>: during a network <b>P</b>artition you must choose <b>C</b>onsistency (reject/block) or <b>A</b>vailability (answer, maybe stale). <b>PACELC</b> adds: <b>E</b>lse (no partition), trade <b>L</b>atency vs <b>C</b>onsistency.",
    ],
    sections: [
      { h: "Replication: leader-follower and lag", blocks: [
        { p: "Replication keeps the same data on multiple machines. Reasons: more read capacity, survive a machine dying, keep data close to users in other regions." },
        { table: { head: ["Model", "How writes work", "Pros", "Cons"], rows: [
          ["<b>Single leader</b> (leader-follower / primary-replica)", "Only the leader accepts writes; ships a change log to followers", "Simple, no write conflicts; MySQL/Postgres default", "Leader is the write bottleneck; failover needed"],
          ["Multi-leader", "Several leaders (e.g. one per region) accept writes and sync", "Local writes in each region", "Write conflicts must be resolved (last-write-wins, merge)"],
          ["Leaderless (Dynamo-style)", "Client writes to W of N replicas, reads from R", "No failover, highly available", "Must pick R + W > N for overlap; conflict repair"],
        ] } },
        { p: "<b>Synchronous vs asynchronous.</b> Sync: leader waits for the follower to confirm — no data loss on failover but every write is slower and a slow follower blocks writes. Async: leader confirms immediately — fast, but followers lag behind (usually milliseconds, sometimes seconds under load). Common middle ground: one sync follower, the rest async (semi-sync)." },
        { h: "Problems caused by replication lag" },
        { ul: [
          "<b>Read-your-own-writes</b>: user updates profile (leader), refreshes, the read hits a lagging follower and shows the old profile. Fix: read the user's own data from the leader for a short window after they write, or route by 'last write timestamp'.",
          "<b>Monotonic reads</b>: two reads hit different followers and the user sees data go 'back in time'. Fix: pin a user to one replica (hash user id).",
          "<b>Failover data loss</b>: async leader dies; promoted follower is missing the last writes.",
        ] },
      ] },
      { h: "Sharding (partitioning)", blocks: [
        { p: "When writes or total data outgrow one leader, split the data: each <b>shard</b> holds a subset of rows and has its own leader (and replicas). The <b>shard key</b> decides where a row lives — it is the most important decision in the design." },
        { table: { head: ["Strategy", "Example", "Good", "Bad"], rows: [
          ["Range", "user_id 1–1M → shard 1, 1M–2M → shard 2", "Range queries on the key are cheap", "Hot spots (newest users/time-based keys all hit the last shard)"],
          ["Hash", "shard = hash(user_id) % N", "Even distribution", "Range scans hit all shards; changing N reshuffles almost everything (→ consistent hashing)"],
          ["Directory / lookup", "A lookup table maps key → shard", "Move tenants freely", "Extra lookup hop; the directory must be highly available"],
          ["Geo", "Indian users → Mumbai shard", "Latency, data residency laws", "Uneven region sizes"],
        ] } },
        { h: "Costs of sharding" },
        { ul: [
          "Cross-shard joins and transactions become application problems → choose a key so that most queries hit one shard (e.g. shard chats by <code>conversation_id</code>, orders by <code>user_id</code>).",
          "Secondary-index queries (find by email when sharded by user_id) scatter to every shard → keep a separate global index table.",
          "<b>Hot keys</b>: one celebrity/product gets huge traffic on one shard. Mitigate by caching it, splitting it with a salt suffix (<code>post:42#0..#9</code>, reads merge the 10 parts), or giving it a dedicated shard.",
          "<b>Resharding</b> is painful — design for it (consistent hashing, many logical shards mapped to fewer physical machines).",
        ] },
        { tip: "Before sharding, say what you tried first: indexes, caching, read replicas, vertical scaling, archiving old data. Interviewers like that you treat sharding as the last resort it is." },
      ] },
      { h: "Consistent hashing — diagram and why", blocks: [
        { p: "With <code>node = hash(key) % N</code>, changing N from 3 to 4 changes the result for about <b>75%</b> of keys (a key stays only if <code>h % 3 == h % 4</code>, i.e. <code>h % 12</code> ∈ {0,1,2} = 3 of 12 cases). For a cache cluster that means a sudden flood of misses; for a DB, massive data movement." },
        { p: "Consistent hashing maps both <b>nodes</b> and <b>keys</b> onto the same circular hash space (0 … 2<sup>64</sup>−1). A key belongs to the first node found moving <b>clockwise</b>. Adding node D only takes the keys between D and its predecessor; everything else stays put." },
        { svg: `<svg viewBox="0 0 700 300" width="700" class="dg">
  <circle class="ln" cx="200" cy="150" r="110"/>
  <circle class="box-a" cx="200" cy="40" r="16"/>
  <text class="tx tx-b" x="200" y="40" text-anchor="middle" dominant-baseline="middle">A</text>
  <circle class="box-a" cx="295" cy="205" r="16"/>
  <text class="tx tx-b" x="295" y="205" text-anchor="middle" dominant-baseline="middle">B</text>
  <circle class="box-a" cx="105" cy="205" r="16"/>
  <text class="tx tx-b" x="105" y="205" text-anchor="middle" dominant-baseline="middle">C</text>
  <circle class="box-g" cx="295" cy="95" r="16"/>
  <text class="tx tx-b" x="295" y="95" text-anchor="middle" dominant-baseline="middle">D</text>
  <circle class="box-w" cx="255" cy="55" r="7"/>
  <text class="tx-c" x="266" y="44">k1</text>
  <circle class="box-w" cx="308" cy="169" r="7"/>
  <text class="tx-c" x="320" y="172">k2</text>
  <circle class="box-w" cx="162" cy="253" r="7"/>
  <text class="tx-c" x="148" y="274">k3</text>
  <circle class="box-w" cx="105" cy="95" r="7"/>
  <text class="tx-c" x="80" y="92">k4</text>
  <text class="tx-m" x="200" y="150" text-anchor="middle" dominant-baseline="middle">clockwise ↻</text>
  <text class="tx tx-b" x="380" y="40">Before D joins (A, B, C)</text>
  <text class="tx" x="380" y="62">k1 → B, k2 → B, k3 → C, k4 → A</text>
  <text class="tx tx-b" x="380" y="100">After new node D is added</text>
  <text class="tx" x="380" y="122">k1 → D (moved), others unchanged</text>
  <text class="tx-m" x="380" y="144">Only keys between A and D move.</text>
  <text class="tx tx-b" x="380" y="184">Virtual nodes</text>
  <text class="tx" x="380" y="206">Each server = 100–200 points on ring</text>
  <text class="tx-m" x="380" y="228">→ even load, and a dying node's keys</text>
  <text class="tx-m" x="380" y="246">spread across all survivors.</text>
</svg>`, caption: "Consistent hash ring. Keys (orange) belong to the next node clockwise. Adding D moves only k1." },
        { p: "Without virtual nodes, 3 random points split the ring very unevenly, and when a node dies its whole range lands on one neighbour. With many virtual nodes per server, load evens out. A <code>TreeMap</code> gives the 'next clockwise' lookup in O(log n):" },
        { code: `import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

class ConsistentHashRing {
    private final TreeMap<Long, String> ring = new TreeMap<>();
    private final int vnodes;

    ConsistentHashRing(int vnodes) { this.vnodes = vnodes; }

    void addNode(String node) {
        for (int i = 0; i < vnodes; i++) ring.put(hash(node + "#" + i), node);
    }

    void removeNode(String node) {
        for (int i = 0; i < vnodes; i++) ring.remove(hash(node + "#" + i));
    }

    // first vnode clockwise from the key's position (wrap around to the start)
    String nodeFor(String key) {
        SortedMap<Long, String> tail = ring.tailMap(hash(key));
        return tail.isEmpty() ? ring.firstEntry().getValue() : tail.get(tail.firstKey());
    }

    static long hash(String s) {
        try {
            byte[] d = MessageDigest.getInstance("MD5").digest(s.getBytes(StandardCharsets.UTF_8));
            long h = 0;
            for (int i = 0; i < 8; i++) h = (h << 8) | (d[i] & 0xff);
            return h;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

public class ConsistentHashDemo {
    public static void main(String[] args) {
        ConsistentHashRing ring = new ConsistentHashRing(100);
        for (String n : new String[]{"cache-A", "cache-B", "cache-C"}) ring.addNode(n);

        int keys = 100_000;
        Map<String, String> before = new HashMap<>();
        for (int i = 0; i < keys; i++) before.put("user:" + i, ring.nodeFor("user:" + i));

        ring.addNode("cache-D");
        int moved = 0;
        for (int i = 0; i < keys; i++)
            if (!before.get("user:" + i).equals(ring.nodeFor("user:" + i))) moved++;

        System.out.printf("consistent hashing: %.1f%% of keys moved%n", 100.0 * moved / keys);

        // compare with naive hash(key) % N going from 3 to 4 servers
        int naiveMoved = 0;
        for (int i = 0; i < keys; i++) {
            long h = ConsistentHashRing.hash("user:" + i) & Long.MAX_VALUE;
            if (h % 3 != h % 4) naiveMoved++;
        }
        System.out.printf("hash %% N:           %.1f%% of keys moved%n", 100.0 * naiveMoved / keys);
    }
}`, lang: "java", title: "Consistent hash ring with virtual nodes" },
        { code: `consistent hashing: 28.8% of keys moved
hash % N:           75.2% of keys moved`, lang: "text", title: "Output (ideal for 3 → 4 nodes is 1/4 = 25%)" },
        { p: "Used by: DynamoDB/Cassandra partitioning, Memcached client libraries, CDN and LB request routing." },
      ] },
      { h: "CAP and PACELC", blocks: [
        { p: "<b>CAP theorem</b>: in a distributed data store, when a <b>network partition</b> splits the nodes, you can keep only one of:" },
        { ul: [
          "<b>Consistency</b> (linearizability): every read sees the latest write — so the side that can't confirm the latest value must refuse or block.",
          "<b>Availability</b>: every request to a non-failed node gets a (non-error) response — possibly stale.",
        ] },
        { p: "Partitions are not optional in real networks, so the real choice is <b>CP vs AP</b> <i>during a partition</i>. Examples: a bank ledger or seat booking → CP (better to fail than double-spend). Likes count, feed, product reviews → AP (stale is fine)." },
        { p: "<b>PACELC</b> extends it: if <b>P</b>artition → choose <b>A</b> or <b>C</b>; <b>E</b>lse (normal operation) → choose <b>L</b>atency or <b>C</b>onsistency, because waiting for replicas to confirm costs latency even when nothing is broken." },
        { table: { head: ["System (typical config)", "PACELC", "Meaning"], rows: [
          ["Cassandra, DynamoDB (default settings)", "PA / EL", "Stay available; favour low latency, eventual consistency (tunable per query)"],
          ["Spanner-style globally consistent DBs", "PC / EC", "Always consistent; pay latency for coordination"],
          ["Single-leader RDBMS with async replicas", "reads from replicas are EL", "Leader reads consistent, replica reads may lag"],
        ] } },
        { warn: "Don't say 'MongoDB is CP, Cassandra is AP' as absolute facts — most modern stores are <b>tunable</b> (quorum reads/writes, read concern). Say which setting you would use for this feature and why." },
      ] },
    ],
    practice: [
      { q: "A user changes their display name, refreshes the page and still sees the old name for 2 seconds. The DB is Postgres with async read replicas. Explain and fix.", a: "The write went to the leader; the refresh read hit a replica that hasn't replayed the change yet (replication lag). Fix read-your-writes: for N seconds after a user writes (store last-write time in session/cookie), route that user's reads of their own data to the leader; or read profile from leader always (low volume); or update the cache on write so reads come from cache." },
      { q: "You shard orders with <code>shard = order_id % 4</code>. The product team asks for 'all orders of user X'. What happens, and what shard key is better?", a: "Orders of user X are spread across all 4 shards → scatter-gather query to every shard, slower and heavier. Shard by <code>user_id</code> instead so a user's orders live together (the dominant query). Keep a small lookup (order_id → user_id) or embed the shard id in the order id for lookups by order id." },
      { q: "With 5 cache nodes and <code>hash % N</code>, you add a 6th. Roughly what fraction of keys remap? With consistent hashing?", a: "A key stays only if h % 5 == h % 6, i.e. h mod 30 ∈ {0,1,2,3,4} → 5/30 = 1/6 stay, so ~83% remap. With consistent hashing only the keys taken by the new node move: ~1/6 ≈ 17%." },
      { q: "Payment service vs 'people you may know' service: CP or AP during a partition? Justify in one line each.", a: "Payments: CP — rejecting a request is safer than a double charge or negative balance. PYMK: AP — serving a slightly stale suggestion list is harmless, an error page is not." },
      { q: "One Instagram celebrity's post gets 2M reads/sec, all landing on the same shard. What do you do?", a: "It's a hot key. Cache the post aggressively (CDN / local in-process cache in front of Redis), replicate the key across several cache nodes (key#0..#9, read a random copy), and keep counters (likes) as sharded counters merged periodically. Don't reshard the whole DB for one key." },
    ],
    related: ["sd:database-replication", "sd:database-sharding", "sd:consistent-hashing", "sd:cap-theorem", "sd:pacelc-theorem", "sd:strong-vs-eventual-consistency", "sd:sql-vs-nosql", "sd:indexing-at-scale", "dbms:sharding-partitioning-replication", "dbms:cap-theorem", "dbms:sql-vs-nosql", "dbms:nosql-types"]
  });

  /* ------------------------------------------------------------------ */
  /* D43 / D56 — the HLD interview framework + estimation                */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-interview-framework",
    subject: "hld",
    title: "The HLD interview framework + back-of-envelope estimation",
    minutes: 50,
    crux: [
      "Follow a fixed order in 45 min: <b>requirements → estimation → API → data model → high-level diagram → deep dives → bottlenecks & trade-offs</b>.",
      "Spend the first 5 minutes on <b>functional</b> (what it does) and <b>non-functional</b> (scale, latency, availability vs consistency) requirements. Write them down; design against them.",
      "Estimation: <b>1 day ≈ 86,400 s ≈ 10<sup>5</sup> s</b>, so 1M requests/day ≈ 12/s. Peak ≈ 2–3× average. Compute QPS, read:write ratio, storage/year, bandwidth, cache size.",
      "Numbers decide the design: 20 writes/s → one SQL box is fine; 200K writes/s → partitioned store + queues. Say that link out loud.",
      "Every choice gets a <b>why</b> and a <b>trade-off</b>. Close with bottlenecks, failure handling and what you would monitor.",
    ],
    sections: [
      { h: "The 7-step framework (45-minute budget)", blocks: [
        { table: { head: ["Step", "Time", "What you produce"], rows: [
          ["1. Requirements", "5 min", "3–5 functional features (in scope / out of scope) + non-functional: DAU, latency target, availability, consistency needs, read- or write-heavy"],
          ["2. Estimation", "5 min", "QPS (avg + peak), read:write, storage per year, bandwidth, cache memory"],
          ["3. API", "3–5 min", "3–5 endpoints with params and responses, e.g. <code>POST /v1/posts</code>"],
          ["4. Data model", "5 min", "Main entities/tables, keys, SQL vs NoSQL choice and why, shard key if needed"],
          ["5. High-level diagram", "10 min", "Boxes and arrows: client, LB, services, cache, DB, queue, workers, CDN — walk one request through it"],
          ["6. Deep dives", "10–15 min", "2–3 hard parts the interviewer cares about (ID generation, fan-out, consistency, hot keys)"],
          ["7. Bottlenecks & wrap-up", "3–5 min", "SPOFs, scaling next steps, failure modes, monitoring/alerts, trade-offs you accepted"],
        ] } },
        { tip: "Ask before you draw: <i>How many users? Read-heavy or write-heavy? Is slight staleness OK? Global or single region?</i> Then state assumptions if they say 'you decide'. Clarifying is scored — jumping straight to Kafka is a red flag." },
        { warn: "Common failures: no numbers at all; numbers computed but never used; drawing 15 microservices for a 100 QPS system; saying a technology name without saying what problem it solves." },
      ] },
      { h: "Estimation cheat sheet", blocks: [
        { table: { head: ["Quantity", "Value", "Use"], rows: [
          ["Seconds per day", "86,400 ≈ 10<sup>5</sup>", "per-day → per-second"],
          ["1M per day", "≈ 12 per second", "quick QPS"],
          ["1B per day", "≈ 11,600 per second", "big-tech scale"],
          ["Seconds per month", "≈ 2.6M (30 days)", "monthly volumes"],
          ["KB / MB / GB / TB / PB", "10<sup>3</sup> / 10<sup>6</sup> / 10<sup>9</sup> / 10<sup>12</sup> / 10<sup>15</sup> bytes", "storage math"],
          ["Peak factor", "2–3× average (10× for flash sales)", "capacity planning"],
          ["Memory read", "~100 ns", "in-process cache"],
          ["Same-datacenter round trip", "~0.5 ms", "Redis call ≈ ~1 ms"],
          ["SSD random read", "~0.1 ms", "DB index lookups"],
          ["Cross-continent round trip", "~150 ms", "why CDNs / regions exist"],
        ] } },
        { p: "Typical sizes to assume: a text row/metadata record ≈ 0.5–1 KB, a tweet/message ≈ 100–300 bytes, a compressed photo ≈ 200 KB–1 MB, a minute of video ≈ tens of MB." },
      ] },
      { h: "Worked example: photo-sharing app estimation", blocks: [
        { p: "Assumptions (state them): <b>10M DAU</b>; each user uploads <b>0.2 photos/day</b> and views <b>50 photos/day</b>; average photo <b>500 KB</b>; metadata <b>1 KB</b>/photo; keep 3 replicas; peak = 3× average." },
        { table: { head: ["Metric", "Calculation", "Result"], rows: [
          ["Uploads per day", "10M × 0.2", "2M photos/day"],
          ["Write QPS", "2M / 86,400", "≈ 23/s avg, ≈ 70/s peak"],
          ["Views per day", "10M × 50", "500M views/day"],
          ["Read QPS", "500M / 86,400", "≈ 5,800/s avg, ≈ 17,400/s peak"],
          ["Read : write", "500M : 2M", "250 : 1 → read-heavy, cache hard"],
          ["Photo storage / day", "2M × 500 KB", "1 TB/day"],
          ["Photo storage / year", "1 TB × 365 × 3 replicas", "≈ 1.1 PB/year → object storage, not a DB"],
          ["Metadata / year", "2M × 1 KB × 365", "≈ 730 GB/year → fits a (later sharded) SQL DB"],
          ["Egress bandwidth", "5,800/s × 500 KB", "≈ 2.9 GB/s ≈ 23 Gbps avg → must use a CDN"],
          ["Cache (30 days of hot metadata)", "2M × 30 × 1 KB", "60 GB → 2–3 Redis nodes"],
          ["App servers", "17,400 peak / ~2,000 req/s per server", "≈ 9, run ~12 for headroom + failures"],
        ] } },
        { p: "<b>What the numbers tell you:</b> writes are tiny (70/s peak), so a single leader DB handles metadata writes; reads are 250× more, so add a cache and read replicas; image bytes (23 Gbps) must never flow through app servers → object storage + CDN, app returns signed URLs." },
        { tip: "Round aggressively (86,400 → 10<sup>5</sup>, 5,787 → ~6K) and say you are rounding. Interviewers check the order of magnitude and whether you <b>use</b> the result, not the third digit." },
      ] },
      { h: "Using the framework in a mock (D56)", blocks: [
        { ol: [
          "Restate the problem in one line and list features; mark 2–3 as out of scope.",
          "Write non-functional targets as numbers: e.g. 'p99 redirect &lt; 50 ms, 99.9% availability, eventual consistency OK for counts'.",
          "Do the estimation table above in 3 minutes; underline the 2–3 numbers that drive the design.",
          "Write the API and the main table(s).",
          "Draw the default architecture (client → LB → stateless services → cache → DB; queue → workers; CDN for media) and walk one read and one write through it.",
          "Pick deep dives yourself if the interviewer doesn't: the hardest scaling part (IDs, fan-out, hot keys, consistency).",
          "Finish with: SPOFs and how you removed them, what you'd monitor (QPS, p99 latency, error rate, queue lag, cache hit rate), and what changes at 10× scale.",
        ] },
        { p: "Practise with the reference answers in this plan: URL shortener (D45), rate limiter + notifications (D46), chat + news feed (D47). Time yourself: 45 minutes, speaking out loud, drawing on paper or Excalidraw." },
      ] },
    ],
    practice: [
      { q: "Estimate QPS and yearly storage for a service with 50M DAU where each user posts 2 text messages/day of 200 bytes and reads 100 messages/day.", a: "Writes: 50M × 2 = 100M/day → 100M / 86,400 ≈ 1,160/s (peak ~3,500/s). Reads: 50M × 100 = 5B/day ≈ 58K/s (peak ~170K/s); read:write = 50:1. Storage: 100M × 200 B = 20 GB/day → ×365 ≈ 7.3 TB/year (≈ 22 TB with 3 replicas)." },
      { q: "Your estimate says 25 writes/s and 2,500 reads/s. The interviewer asks if you need Cassandra and sharding. Answer.", a: "No. 25 writes/s is trivial for one Postgres/MySQL leader; 2,500 reads/s is handled by a Redis cache (most reads) plus 1–2 read replicas. Sharding adds cross-shard complexity for no benefit; revisit when writes approach thousands/s or data exceeds one machine (multi-TB)." },
      { q: "List the 7 steps of the HLD framework in order with one output each.", a: "1 Requirements → feature list + NFRs; 2 Estimation → QPS/storage/bandwidth; 3 API → endpoints; 4 Data model → tables + keys + DB choice; 5 High-level design → architecture diagram; 6 Deep dives → detailed design of 2–3 hard parts; 7 Bottlenecks → SPOFs, scaling, monitoring, trade-offs." },
      { q: "A video platform serves 1M video views/day with an average of 50 MB per view. What average egress bandwidth is that, and what does it imply?", a: "1M × 50 MB = 50 TB/day. 50 TB / 86,400 s ≈ 580 MB/s ≈ 4.6 Gbps average (peaks 2–3× higher). Implies a CDN is mandatory; origin should only fill CDN caches, and videos live in object storage." },
    ],
    related: ["sd:back-of-envelope-estimation", "sd:availability-nines", "sd:latency-vs-throughput", "sd:horizontal-vs-vertical-scaling", "sd:sql-vs-nosql", "sd:rest-vs-graphql-vs-grpc", "sd:microservices-vs-monolith", "sd:monitoring-logging-metrics", "sd:design-url-shortener"]
  });

  /* ------------------------------------------------------------------ */
  /* D44 — message queues & Kafka                                         */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-queues-kafka",
    subject: "hld",
    title: "Message queues, Kafka & async workers",
    minutes: 50,
    crux: [
      "A queue <b>decouples</b> producers from consumers: the request returns fast, slow work happens later, and bursts are absorbed (load levelling).",
      "Kafka = an append-only, replicated <b>log</b>. A <b>topic</b> is split into <b>partitions</b>; order is guaranteed <b>only within a partition</b>; the message key picks the partition.",
      "A <b>consumer group</b> shares a topic: each partition is read by exactly one consumer in the group. Parallelism ≤ number of partitions. Different groups each get every message.",
      "An <b>offset</b> is a message's position in a partition; consumers commit offsets. Commit before processing ⇒ <b>at-most-once</b>; after ⇒ <b>at-least-once</b> (duplicates possible).",
      "<b>Exactly-once</b> in practice = at-least-once delivery + idempotent processing (or Kafka transactions for Kafka-to-Kafka pipelines).",
    ],
    sections: [
      { h: "Why queues: async workers", blocks: [
        { p: "Some work is slow (sending email, resizing images, generating PDFs, updating search indexes) or bursty. Doing it inside the HTTP request makes users wait and lets a spike overload the downstream service. Instead:" },
        { ol: [
          "API validates the request, writes the essential data, puts a <b>job message</b> on a queue, returns <code>202 Accepted</code> in milliseconds.",
          "A pool of <b>worker</b> processes pulls jobs and does the slow work at their own pace.",
          "Workers scale independently (add workers when queue lag grows); failed jobs are retried and finally parked in a <b>dead-letter queue (DLQ)</b> for inspection.",
        ] },
        { ul: [
          "<b>Point-to-point queue</b> (RabbitMQ, SQS): each message is processed by one worker, then deleted.",
          "<b>Pub/sub</b>: each message goes to every subscriber (order-placed → email service, inventory service, analytics).",
          "Kafka does both: consumer groups give point-to-point <i>within</i> a group and pub/sub <i>across</i> groups; messages are retained (e.g. 7 days) and can be replayed.",
        ] },
      ] },
      { h: "Kafka concepts: topics, partitions, consumer groups, offsets", blocks: [
        { svg: `<svg viewBox="0 0 720 250" width="720" class="dg">
  <rect class="box-a" x="10" y="98" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="55" y="116" text-anchor="middle" dominant-baseline="middle">Producer</text>
  <text class="tx tx-b" x="170" y="22">topic: orders</text>
  <text class="tx tx-b" x="142" y="60" text-anchor="middle" dominant-baseline="middle">P0</text>
  <text class="tx tx-b" x="142" y="115" text-anchor="middle" dominant-baseline="middle">P1</text>
  <text class="tx tx-b" x="142" y="170" text-anchor="middle" dominant-baseline="middle">P2</text>
  <rect class="box" x="160" y="45" width="30" height="30"/><text class="tx-c" x="175" y="60" text-anchor="middle" dominant-baseline="middle">0</text>
  <rect class="box" x="194" y="45" width="30" height="30"/><text class="tx-c" x="209" y="60" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box" x="228" y="45" width="30" height="30"/><text class="tx-c" x="243" y="60" text-anchor="middle" dominant-baseline="middle">2</text>
  <rect class="box-g" x="262" y="45" width="30" height="30"/><text class="tx-c" x="277" y="60" text-anchor="middle" dominant-baseline="middle">3</text>
  <rect class="box" x="296" y="45" width="30" height="30"/><text class="tx-c" x="311" y="60" text-anchor="middle" dominant-baseline="middle">4</text>
  <rect class="box" x="330" y="45" width="30" height="30"/><text class="tx-c" x="345" y="60" text-anchor="middle" dominant-baseline="middle">5</text>
  <rect class="box" x="160" y="100" width="30" height="30"/><text class="tx-c" x="175" y="115" text-anchor="middle" dominant-baseline="middle">0</text>
  <rect class="box" x="194" y="100" width="30" height="30"/><text class="tx-c" x="209" y="115" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box-g" x="228" y="100" width="30" height="30"/><text class="tx-c" x="243" y="115" text-anchor="middle" dominant-baseline="middle">2</text>
  <rect class="box" x="262" y="100" width="30" height="30"/><text class="tx-c" x="277" y="115" text-anchor="middle" dominant-baseline="middle">3</text>
  <rect class="box" x="160" y="155" width="30" height="30"/><text class="tx-c" x="175" y="170" text-anchor="middle" dominant-baseline="middle">0</text>
  <rect class="box" x="194" y="155" width="30" height="30"/><text class="tx-c" x="209" y="170" text-anchor="middle" dominant-baseline="middle">1</text>
  <rect class="box" x="228" y="155" width="30" height="30"/><text class="tx-c" x="243" y="170" text-anchor="middle" dominant-baseline="middle">2</text>
  <rect class="box" x="262" y="155" width="30" height="30"/><text class="tx-c" x="277" y="170" text-anchor="middle" dominant-baseline="middle">3</text>
  <rect class="box-g" x="296" y="155" width="30" height="30"/><text class="tx-c" x="311" y="170" text-anchor="middle" dominant-baseline="middle">4</text>
  <line class="ln" x1="100" y1="116" x2="128" y2="62" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="100" y1="116" x2="128" y2="116" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="100" y1="116" x2="128" y2="168" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="160" y="210">append-only; green = group A's committed offset</text>
  <text class="tx-m" x="160" y="228">new messages appended on the right →</text>
  <rect class="box" x="440" y="20" width="160" height="190" rx="8"/>
  <text class="tx tx-b" x="520" y="38" text-anchor="middle">Consumer group A</text>
  <rect class="box-a" x="460" y="52" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="520" y="68" text-anchor="middle" dominant-baseline="middle">C1: P0, P1</text>
  <rect class="box-a" x="460" y="152" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="520" y="168" text-anchor="middle" dominant-baseline="middle">C2: P2</text>
  <line class="ln-a" x1="364" y1="60" x2="458" y2="64" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="296" y1="115" x2="458" y2="74" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="330" y1="170" x2="458" y2="168" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="612" y="20" width="100" height="190" rx="8"/>
  <text class="tx tx-b" x="662" y="38" text-anchor="middle">Group B</text>
  <rect class="box-p" x="622" y="100" width="80" height="32" rx="6"/>
  <text class="tx tx-b" x="662" y="116" text-anchor="middle" dominant-baseline="middle">C3</text>
  <text class="tx-m" x="662" y="150" text-anchor="middle">reads all 3</text>
  <text class="tx-m" x="662" y="166" text-anchor="middle">own offsets</text>
</svg>`, caption: "Topic with 3 partitions. Group A splits partitions between C1 and C2; group B independently reads everything." },
        { table: { head: ["Term", "Meaning"], rows: [
          ["Broker", "A Kafka server. A cluster has many; each partition has one leader broker and follower replicas."],
          ["Topic", "Named stream of messages (<code>orders</code>, <code>clicks</code>)."],
          ["Partition", "An ordered, append-only log; the unit of parallelism and ordering. <code>partition = hash(key) % numPartitions</code> (no key → spread across partitions)."],
          ["Offset", "Sequential position of a message inside one partition (0, 1, 2 …)."],
          ["Consumer group", "Consumers sharing one subscription. Each partition → exactly one consumer in the group. Extra consumers beyond #partitions sit idle."],
          ["Committed offset", "Where the group will resume after a restart/rebalance. Stored in Kafka's internal <code>__consumer_offsets</code> topic."],
          ["Rebalance", "When a consumer joins/leaves, partitions are reassigned among the group."],
          ["Retention", "Messages are kept for a time/size limit (default 7 days) whether consumed or not → replay is possible."],
          ["Replication factor / acks", "RF=3 keeps 3 copies; <code>acks=all</code> means the leader waits for all in-sync replicas before acknowledging — no loss if the leader dies."],
        ] } },
        { tip: "Ordering answer that impresses: <i>Kafka only orders within a partition, so I use <code>orderId</code> (or <code>conversationId</code>) as the key — all events for one order land in one partition in order, while different orders are processed in parallel.</i>" },
      ] },
      { h: "Delivery semantics", blocks: [
        { table: { head: ["Semantic", "How it happens", "Risk", "Use for"], rows: [
          ["<b>At-most-once</b>", "Commit offset, then process (or fire-and-forget producer, <code>acks=0</code>)", "Crash after commit ⇒ message <b>lost</b>", "Metrics, logs where loss is OK"],
          ["<b>At-least-once</b>", "Process, then commit offset; producer retries on timeout", "Crash after processing but before commit ⇒ message <b>processed twice</b>", "Default for most business events"],
          ["<b>Exactly-once</b>", "Idempotent producer + Kafka transactions (read-process-write atomically), consumers use <code>read_committed</code>; or at-least-once + idempotent consumer", "More complexity/latency; external side effects (emails, payments) still need idempotency", "Payments, balances, counters that must be exact"],
        ] } },
        { code: `// at-least-once consumer loop (pseudo-code)
while (true) {
    records = consumer.poll(500 ms)
    for (r : records) {
        if (processed.contains(r.eventId)) continue   // dedupe -> effectively-once
        handle(r)                                     // side effect
        processed.add(r.eventId)                      // same DB transaction as handle() ideally
    }
    consumer.commitSync()                             // commit AFTER processing
}`, lang: "text", title: "Process-then-commit + dedupe = effectively exactly-once" },
        { warn: "Saying 'Kafka gives exactly-once, so no duplicates' is a trap. Kafka's exactly-once covers Kafka-to-Kafka processing; the moment you call an external API or DB, you need an idempotency key/dedupe table on your side." },
      ] },
      { h: "Kafka vs a classic queue (RabbitMQ/SQS)", blocks: [
        { table: { head: ["", "Kafka", "RabbitMQ / SQS"], rows: [
          ["Model", "Distributed log; consumers track offsets", "Broker pushes/deletes messages after ack"],
          ["Retention / replay", "Yes, time-based; replay from any offset", "Gone once acknowledged"],
          ["Ordering", "Per partition", "Per queue (FIFO variants), weaker with many consumers"],
          ["Throughput", "Very high (100Ks–millions msgs/s per cluster)", "Lower, but rich routing, per-message ack, delays, priorities"],
          ["Best for", "Event streaming, analytics pipelines, event sourcing, fan-out to many services", "Task queues / job workers, request-reply, complex routing"],
        ] } },
        { p: "Queue health metric to mention: <b>consumer lag</b> = latest offset − committed offset. Growing lag ⇒ add consumers (up to #partitions) or add partitions." },
      ] },
    ],
    practice: [
      { q: "A topic has 6 partitions. Consumer group G has 8 consumers. How many are active? What if a second group H with 2 consumers subscribes?", a: "In G only 6 consumers get a partition each; 2 are idle (standby). H independently receives every message: its 2 consumers get 3 partitions each. Groups don't affect each other's offsets." },
      { q: "Order events (CREATED, PAID, SHIPPED) must be processed in order per order. How do you configure Kafka?", a: "Produce with key = orderId so all events of one order hash to the same partition (ordered). Within a consumer, process a partition's messages sequentially. Enable idempotent producer so retries don't reorder/duplicate. Different orders parallelise across partitions." },
      { q: "A consumer processes a payment message, calls the bank successfully, then crashes before committing the offset. What happens next and how do you make it safe?", a: "After restart/rebalance, the group resumes from the last committed offset, so the same message is delivered again (at-least-once) → double charge risk. Make processing idempotent: use the message's paymentId as an idempotency key (unique constraint in a processed table, or idempotency key sent to the bank), and skip if already done." },
      { q: "Why can't you get more parallelism by just adding consumers to a group?", a: "Each partition is consumed by at most one consumer of a group, so parallelism is capped at the number of partitions. To scale further, increase partitions (plan this up front — changing the count changes key→partition mapping, which breaks per-key ordering for existing keys)." },
    ],
    related: ["sd:message-queues-pub-sub", "sd:kafka-vs-rabbitmq", "sd:idempotency", "sd:microservices-vs-monolith", "sd:strong-vs-eventual-consistency", "os:producer-consumer"]
  });

  /* ------------------------------------------------------------------ */
  /* D44 — rate limiting, idempotency, retries, circuit breaker          */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-rate-limit-resilience",
    subject: "hld",
    title: "Rate limiting algorithms, idempotency, retries & circuit breakers",
    minutes: 60,
    crux: [
      "Five rate-limiting algorithms: <b>token bucket</b> (allows bursts up to capacity; most common), <b>leaky bucket</b> (smooth constant outflow), <b>fixed window</b> (simple, 2× burst at window edges), <b>sliding log</b> (exact, memory-heavy), <b>sliding window counter</b> (weighted approximation, cheap, accurate enough).",
      "<b>Idempotency key</b>: client sends a unique key per logical operation; server stores key → result, and a repeat returns the stored result instead of doing the work twice.",
      "Retry only <b>transient</b> failures (timeouts, 503, 429), with <b>exponential backoff + jitter</b> and a max attempt count — and only for idempotent operations.",
      "<b>Circuit breaker</b>: CLOSED (normal) → OPEN after too many failures (fail fast, no calls) → HALF-OPEN after a cool-down (a few trial calls) → CLOSED on success / OPEN on failure.",
      "Together they stop <b>cascading failures</b>: one slow dependency shouldn't exhaust your threads and take down everything upstream.",
    ],
    sections: [
      { h: "Rate limiting algorithms", blocks: [
        { p: "Rate limiting caps how many requests a client (user, IP, API key) can make in a period — protects servers from abuse, brute force and noisy neighbours, and controls cost. Rejected requests get <code>HTTP 429 Too Many Requests</code>." },
        { h: "Token bucket" },
        { p: "A bucket holds up to <b>capacity</b> tokens and is refilled at <b>r tokens/second</b>. Each request takes one token; no token ⇒ reject. A full bucket allows a burst of <i>capacity</i> requests, and the long-run rate is r. Two parameters, O(1) memory per client — used by AWS API Gateway, Stripe and most gateways." },
        { h: "Leaky bucket" },
        { p: "Requests enter a FIFO queue of fixed size and are processed at a constant rate (the 'leak'). Queue full ⇒ drop. Output is perfectly smooth — good for protecting a downstream that can't handle bursts — but a burst of old requests can delay fresh ones." },
        { h: "Fixed window counter" },
        { p: "Count requests per client per window (e.g. per calendar minute); reset at the boundary. Trap: a client can send 100 at 12:00:59 and 100 at 12:01:00 → <b>200 in 2 seconds</b> with a limit of 100/min." },
        { h: "Sliding window log" },
        { p: "Store the timestamp of every request; on each request drop timestamps older than the window and count the rest. Exact, but memory = one entry per request (a 1000/hour limit stores up to 1000 timestamps per user)." },
        { h: "Sliding window counter" },
        { p: "Keep only two counters (previous and current fixed window) and estimate: <code>count = current + previous × (1 − elapsed fraction of current window)</code>." },
        { p: "<b>Example:</b> limit 100/min. Previous minute had 80 requests, current minute has 30 so far, we are 15 s into the current minute. Weighted count = 30 + 80 × (1 − 15/60) = 30 + 80 × 0.75 = <b>90</b> &lt; 100 ⇒ allow. It assumes the previous window's requests were evenly spread — a small error that is fine in practice." },
        { table: { head: ["Algorithm", "Memory / client", "Bursts", "Accuracy", "Notes"], rows: [
          ["Token bucket", "2 numbers (tokens, last refill)", "Allowed up to capacity", "Good", "Default choice; tunable burst vs rate"],
          ["Leaky bucket", "Queue of size B", "Smoothed out", "Good", "Constant output rate; adds latency"],
          ["Fixed window", "1 counter", "Up to 2× at boundaries", "Weak at edges", "Simplest; Redis INCR + EXPIRE"],
          ["Sliding log", "1 timestamp per request", "None beyond limit", "Exact", "Memory-heavy at high limits"],
          ["Sliding window counter", "2 counters", "Mostly prevented", "Approximate (very close)", "Best cost/accuracy balance"],
        ] } },
        { code: `import java.util.function.LongSupplier;

class TokenBucket {
    private final long capacity;          // max burst
    private final double refillPerNano;   // tokens added per nanosecond
    private final LongSupplier clock;     // injectable clock (System::nanoTime in prod)
    private double tokens;
    private long lastRefill;

    TokenBucket(long capacity, double tokensPerSecond, LongSupplier clock) {
        this.capacity = capacity;
        this.refillPerNano = tokensPerSecond / 1_000_000_000.0;
        this.clock = clock;
        this.tokens = capacity;           // start full
        this.lastRefill = clock.getAsLong();
    }

    synchronized boolean tryAcquire() {
        refill();
        if (tokens >= 1) {
            tokens -= 1;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = clock.getAsLong();
        tokens = Math.min(capacity, tokens + (now - lastRefill) * refillPerNano);
        lastRefill = now;
    }
}

public class TokenBucketDemo {
    static long fakeNow = 0;              // fake clock so the output is deterministic

    public static void main(String[] args) {
        // 5 requests burst, refill 2 tokens/second
        TokenBucket bucket = new TokenBucket(5, 2.0, () -> fakeNow);

        StringBuilder t0 = new StringBuilder();
        for (int i = 0; i < 7; i++) t0.append(bucket.tryAcquire() ? "Y" : "N");
        System.out.println("t=0.0s, 7 requests: " + t0);   // YYYYYNN

        fakeNow += 1_000_000_000L;        // +1 s -> 2 tokens refilled
        StringBuilder t1 = new StringBuilder();
        for (int i = 0; i < 3; i++) t1.append(bucket.tryAcquire() ? "Y" : "N");
        System.out.println("t=1.0s, 3 requests: " + t1);   // YYN

        fakeNow += 10_000_000_000L;       // +10 s -> refills, but capped at 5
        StringBuilder t2 = new StringBuilder();
        for (int i = 0; i < 6; i++) t2.append(bucket.tryAcquire() ? "Y" : "N");
        System.out.println("t=11.0s, 6 requests: " + t2);  // YYYYYN
    }
}`, lang: "java", title: "Token bucket (lazy refill, thread-safe, testable clock)" },
        { code: `t=0.0s, 7 requests: YYYYYNN
t=1.0s, 3 requests: YYN
t=11.0s, 6 requests: YYYYYN`, lang: "text", title: "Output" },
        { tip: "Note the <b>lazy refill</b>: no background thread adds tokens; we compute how many would have been added since the last call. That's also exactly how it's done in Redis (store tokens + timestamp per key)." },
      ] },
      { h: "Idempotency keys", blocks: [
        { p: "An operation is <b>idempotent</b> if doing it twice has the same effect as doing it once. GET, PUT, DELETE are idempotent by definition; POST (create order, charge card) is not. Networks fail <i>after</i> the server did the work but <i>before</i> the client got the response — so clients retry, and you get double orders." },
        { ol: [
          "Client generates a UUID per logical operation (e.g. per 'Pay' button click) and sends <code>Idempotency-Key: 7f3c…</code>.",
          "Server does an atomic insert of the key into an <code>idempotency</code> table (unique constraint) with status IN_PROGRESS.",
          "If the insert fails because the key exists: return the stored response (or 409 if still in progress).",
          "Otherwise do the work, store the response against the key (same transaction as the business write if possible), return it.",
          "Expire keys after e.g. 24 h.",
        ] },
        { code: `CREATE TABLE idempotency_keys (
  idem_key      VARCHAR(64) PRIMARY KEY,
  user_id       BIGINT       NOT NULL,
  status        VARCHAR(16)  NOT NULL,      -- IN_PROGRESS / DONE
  response_code INT,
  response_body TEXT,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- first request: succeeds; a retry with the same key hits the PK and fails -> return stored response
INSERT INTO idempotency_keys (idem_key, user_id, status) VALUES ('7f3c9a', 42, 'IN_PROGRESS');`, lang: "sql", title: "Idempotency table" },
      ] },
      { h: "Retries with exponential backoff + jitter", blocks: [
        { p: "Retrying immediately in a tight loop hammers a service that is already struggling. <b>Exponential backoff</b> waits base, 2×base, 4×base … (capped). But if 10,000 clients failed at the same moment they all retry at the same moments too — synchronized waves. <b>Jitter</b> randomises each wait so retries spread out. 'Full jitter': <code>sleep = random(0, min(cap, base × 2<sup>attempt</sup>))</code>." },
        { code: `import java.util.concurrent.Callable;
import java.util.concurrent.ThreadLocalRandom;

public class RetryDemo {

    // Retry with exponential backoff + "full jitter":
    // sleep = random(0, min(cap, base * 2^attempt))
    static <T> T retry(Callable<T> op, int maxAttempts, long baseMs, long capMs) throws Exception {
        for (int attempt = 0; ; attempt++) {
            try {
                return op.call();
            } catch (Exception e) {
                if (attempt + 1 >= maxAttempts || !isRetryable(e)) throw e;
                long ceiling = Math.min(capMs, baseMs * (1L << attempt));
                long sleep = ThreadLocalRandom.current().nextLong(ceiling + 1);
                System.out.printf("attempt %d failed (%s), sleeping %d ms (ceiling %d)%n",
                        attempt + 1, e.getMessage(), sleep, ceiling);
                Thread.sleep(sleep);
            }
        }
    }

    // Retry only transient errors (timeouts, 503, 429) - never 400/401/404.
    static boolean isRetryable(Exception e) {
        return e instanceof IllegalStateException;
    }

    static int calls = 0;

    public static void main(String[] args) throws Exception {
        String result = retry(() -> {
            calls++;
            if (calls < 4) throw new IllegalStateException("503 Service Unavailable");
            return "200 OK after " + calls + " calls";
        }, 5, 50, 1_000);
        System.out.println(result);
    }
}`, lang: "java", title: "Retry with exponential backoff and full jitter" },
        { code: `attempt 1 failed (503 Service Unavailable), sleeping 1 ms (ceiling 50)
attempt 2 failed (503 Service Unavailable), sleeping 71 ms (ceiling 100)
attempt 3 failed (503 Service Unavailable), sleeping 163 ms (ceiling 200)
200 OK after 4 calls`, lang: "text", title: "Sample output (sleep values are random each run)" },
        { ul: [
          "Retry only idempotent operations, or non-idempotent ones protected by an idempotency key.",
          "Respect <code>Retry-After</code> headers on 429/503.",
          "Set a <b>retry budget</b>: retries across layers multiply (3 layers × 3 retries = 27 calls to the bottom service).",
          "Always pair retries with <b>timeouts</b> — a call without a timeout can hang a thread forever.",
        ] },
      ] },
      { h: "Circuit breaker", blocks: [
        { p: "If a dependency is down, retrying every request just wastes threads and adds latency. A circuit breaker wraps the call and tracks failures:" },
        { svg: `<svg viewBox="0 0 700 270" width="700" class="dg">
  <rect class="box-g" x="30" y="80" width="150" height="50" rx="8"/>
  <text class="tx tx-b" x="105" y="98" text-anchor="middle" dominant-baseline="middle">CLOSED</text>
  <text class="tx-m" x="105" y="116" text-anchor="middle" dominant-baseline="middle">calls pass through</text>
  <rect class="box-r" x="520" y="80" width="150" height="50" rx="8"/>
  <text class="tx tx-b" x="595" y="98" text-anchor="middle" dominant-baseline="middle">OPEN</text>
  <text class="tx-m" x="595" y="116" text-anchor="middle" dominant-baseline="middle">fail fast / fallback</text>
  <rect class="box-w" x="275" y="195" width="150" height="50" rx="8"/>
  <text class="tx tx-b" x="350" y="213" text-anchor="middle" dominant-baseline="middle">HALF-OPEN</text>
  <text class="tx-m" x="350" y="231" text-anchor="middle" dominant-baseline="middle">allow a few trial calls</text>
  <line class="ln-a" x1="180" y1="95" x2="518" y2="95" marker-end="url(#dg-arr-a)"/>
  <text class="tx" x="350" y="85" text-anchor="middle">failure rate ≥ threshold (e.g. 50% of last 20)</text>
  <line class="ln" x1="600" y1="130" x2="427" y2="215" marker-end="url(#dg-arr)"/>
  <text class="tx" x="560" y="190">cool-down elapsed</text>
  <text class="tx-m" x="560" y="206">(e.g. 30 s)</text>
  <line class="ln ln-d" x1="410" y1="195" x2="545" y2="132" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="470" y="150">trial fails</text>
  <line class="ln" x1="275" y1="215" x2="120" y2="132" marker-end="url(#dg-arr)"/>
  <text class="tx" x="120" y="190" text-anchor="middle">trial calls succeed</text>
  <text class="tx-m" x="105" y="60" text-anchor="middle">success: keep counting</text>
</svg>`, caption: "Circuit breaker states. OPEN protects both you (no hung threads) and the failing service (time to recover)." },
        { ul: [
          "<b>CLOSED</b>: normal; record success/failure in a rolling window.",
          "<b>OPEN</b>: every call fails immediately (or returns a <b>fallback</b>: cached value, default, 'try later') without touching the dependency.",
          "<b>HALF-OPEN</b>: after the cool-down, let a limited number of probe calls through; success → CLOSED, failure → OPEN again.",
          "Java: Resilience4j (<code>@CircuitBreaker</code>, <code>@Retry</code>, <code>@RateLimiter</code>, <code>@Bulkhead</code> in Spring Boot).",
          "Companion pattern — <b>bulkhead</b>: separate thread pools per dependency so one slow dependency can't use all threads.",
        ] },
        { tip: "Order of wrappers matters: <i>timeout</i> inside <i>retry</i> inside <i>circuit breaker</i> — so an open breaker stops retries entirely, and each attempt has its own timeout." },
      ] },
    ],
    practice: [
      { q: "Limit = 10 requests/min, fixed window. A client sends 10 requests at 09:00:58 and 10 at 09:01:01. How many are allowed? Which algorithm prevents this?", a: "All 20 are allowed — the first 10 count in the 09:00 window, the next 10 in the new 09:01 window — 20 requests within 3 seconds. A sliding window (log or counter) or a token bucket with capacity 10 and refill 10/60 per second prevents it." },
      { q: "Sliding window counter: limit 50/min, previous window 40 requests, current window 20 so far, 45 s into the current minute. Allow the next request?", a: "Weighted = 20 + 40 × (1 − 45/60) = 20 + 40 × 0.25 = 30 < 50 → allow." },
      { q: "Token bucket, capacity 5, refill 2 tokens/s, starts full. A client sends 7 requests at t=0 and 3 at t=1s. Which are accepted?", a: "At t=0: 5 accepted (bucket 5→0), 2 rejected. By t=1s, 2 tokens refilled: 2 of the 3 accepted, 1 rejected. (Exactly the program's output YYYYYNN, YYN.)" },
      { q: "A mobile app's 'Place order' POST times out, and the app retries. How do you avoid two orders?", a: "Client generates an idempotency key (UUID) once per checkout attempt and sends it with every retry. The server inserts the key under a unique constraint; if it already exists, it returns the stored response of the first request instead of creating another order. Keys expire after ~24 h." },
      { q: "Base 100 ms, cap 2 s, full jitter. What range can the 4th retry's sleep fall in (attempt index 3)?", a: "Ceiling = min(2000, 100 × 2³) = min(2000, 800) = 800 ms, so sleep is uniformly random in [0, 800] ms." },
      { q: "Your service calls a recommendations API that starts timing out at 5 s per call. Tomcat has 200 threads. What happens without a circuit breaker, and with one?", a: "Without: each request holds a thread for 5 s; at 40+ req/s all 200 threads are blocked and the whole service (even unrelated endpoints) stops responding — cascading failure. With a breaker (plus a short timeout, e.g. 300 ms): after the failure threshold it opens, calls fail instantly and return a fallback (e.g. popular items), threads stay free, and half-open probes detect recovery." },
    ],
    related: ["sd:rate-limiting-algorithms", "sd:idempotency", "sd:retries-exponential-backoff-jitter", "sd:circuit-breaker", "sd:api-gateway", "sd:health-checks", "sd:design-rate-limiter", "cn:http-status-codes", "cn:http-methods"]
  });

  /* ------------------------------------------------------------------ */
  /* D45 — URL shortener reference answer                                 */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-url-shortener",
    subject: "hld",
    title: "Design a URL shortener (reference answer)",
    minutes: 75,
    crux: [
      "Read-heavy (≈100:1). Core flows: <b>shorten</b> (write, ~40/s) and <b>redirect</b> (read, ~4,000/s avg, ~8,000/s peak). 6B URLs in 5 years ≈ 3 TB.",
      "<b>6 base62 chars</b> = 62<sup>6</sup> ≈ 56.8B codes ≥ 6B needed. Base62 alphabet = 0-9, a-z, A-Z (URL-safe).",
      "Key generation: <b>counter + base62</b> (no collisions, but predictable — use ranges per server), <b>hash + truncate</b> (collisions must be checked), <b>KGS</b> (pre-generated random keys handed out in batches).",
      "Redirect with <b>302</b> if you need per-click analytics (every click reaches you); <b>301</b> lets browsers cache it (less load, fewer analytics).",
      "Cache hot codes in Redis (80/20 rule → ~35 GB); DB is a simple key-value lookup by <code>short_code</code>; click analytics go <b>async</b> via Kafka so redirects stay fast.",
    ],
    sections: [
      { h: "Requirements", blocks: [
        { table: { head: ["Functional", "Non-functional"], rows: [
          ["Given a long URL, return a short URL (<code>sho.rt/aZ3k9Q</code>)", "Redirect latency p99 &lt; 50 ms"],
          ["Visiting the short URL redirects to the long URL", "Highly available (99.99%) — broken links are very visible"],
          ["Optional custom alias and expiry date", "Short codes must not be guessable in sequence (nice to have)"],
          ["Click analytics (count, country, referrer, device)", "Analytics can be eventually consistent (minutes)"],
          ["Out of scope: user accounts UI, link editing, spam detection details", "Scale: 100M new URLs/month, 5 years retention"],
        ] } },
      ] },
      { h: "Estimation", blocks: [
        { table: { head: ["Metric", "Calculation", "Result"], rows: [
          ["New URLs", "given", "100M / month"],
          ["Write QPS", "100M / (30 × 86,400 ≈ 2.6M s)", "≈ 40/s (peak ~80/s)"],
          ["Read:write ratio", "assumed", "100 : 1"],
          ["Redirect QPS", "40 × 100", "≈ 4,000/s avg, ≈ 8,000/s peak"],
          ["Total URLs in 5 years", "100M × 12 × 5", "6B"],
          ["Storage", "6B × 500 B per record", "3 TB (+ replicas)"],
          ["Code length", "62<sup>6</sup> = 56.8B ≥ 6B; 62<sup>7</sup> ≈ 3.5T", "6 chars (7 for comfort)"],
          ["Redirects per day", "4,000 × 86,400", "≈ 350M/day"],
          ["Cache (20% hot)", "0.2 × 350M × 500 B", "≈ 35 GB → fits in a small Redis cluster"],
          ["Bandwidth", "4,000/s × 500 B", "≈ 2 MB/s (tiny)"],
        ] } },
        { p: "Conclusion: storage and bandwidth are small; the design is driven by <b>read latency</b>, <b>availability</b>, and <b>generating unique short codes</b> across many servers." },
      ] },
      { h: "API and data model", blocks: [
        { code: `POST /api/v1/urls
  body:  { "longUrl": "https://example.com/very/long?x=1", "customAlias": null, "expiresAt": null }
  201 -> { "shortUrl": "https://sho.rt/aZ3k9Q", "code": "aZ3k9Q" }
  409 -> alias already taken

GET /{code}
  302 Found, Location: https://example.com/very/long?x=1
  404 Not Found (unknown)    410 Gone (expired)

GET /api/v1/urls/{code}/stats?from=2026-09-01&to=2026-09-30
  200 -> { "clicks": 12873, "byCountry": {...}, "byDay": [...] }`, lang: "text", title: "API" },
        { code: `CREATE TABLE urls (
  short_code  VARCHAR(7)    PRIMARY KEY,
  long_url    VARCHAR(2048) NOT NULL,
  user_id     BIGINT,
  created_at  TIMESTAMP     NOT NULL,
  expires_at  TIMESTAMP
);

-- redirect path: a single primary-key lookup
SELECT long_url, expires_at FROM urls WHERE short_code = 'aZ3k9Q';`, lang: "sql", title: "Schema" },
        { p: "<b>SQL or NoSQL?</b> The access pattern is pure key → value with no joins, 6B rows, and must scale horizontally. A key-value/wide-column store (DynamoDB, Cassandra) partitioned by <code>short_code</code> fits naturally. Postgres/MySQL also works — shard by <code>short_code</code> (hash) when one machine is no longer enough. Either answer is fine if you justify it." },
      ] },
      { h: "High-level design", blocks: [
        { svg: `<svg viewBox="0 0 720 300" width="720" class="dg">
  <rect class="box" x="10" y="125" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="143" text-anchor="middle" dominant-baseline="middle">Client</text>
  <rect class="box-a" x="120" y="125" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="160" y="143" text-anchor="middle" dominant-baseline="middle">LB</text>
  <line class="ln-a" x1="90" y1="143" x2="118" y2="143" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="240" y="60" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="305" y="80" text-anchor="middle" dominant-baseline="middle">Shorten service</text>
  <rect class="box" x="240" y="185" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="305" y="205" text-anchor="middle" dominant-baseline="middle">Redirect service</text>
  <line class="ln-a" x1="200" y1="138" x2="238" y2="84" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="200" y1="148" x2="238" y2="200" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="205" y="104">POST</text>
  <text class="tx-m" x="205" y="190">GET /code</text>
  <rect class="box-p" x="240" y="5" width="130" height="34" rx="6"/>
  <text class="tx tx-b" x="305" y="22" text-anchor="middle" dominant-baseline="middle">ID ranges (ZK)</text>
  <line class="ln ln-d" x1="305" y1="60" x2="305" y2="41" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="420" y="185" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="475" y="205" text-anchor="middle" dominant-baseline="middle">Redis cache</text>
  <line class="ln" x1="370" y1="205" x2="418" y2="205" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="420" y="60" width="110" height="40" rx="6"/>
  <text class="tx tx-b" x="475" y="80" text-anchor="middle" dominant-baseline="middle">URL DB</text>
  <text class="tx-m" x="475" y="115" text-anchor="middle">sharded by code</text>
  <line class="ln" x1="370" y1="80" x2="418" y2="80" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="475" y1="185" x2="475" y2="122" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="482" y="160">miss</text>
  <rect class="box-w" x="420" y="250" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="475" y="268" text-anchor="middle" dominant-baseline="middle">Kafka: clicks</text>
  <line class="ln ln-d" x1="340" y1="225" x2="418" y2="262" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="330" y="262" text-anchor="end">async event</text>
  <rect class="box" x="580" y="250" width="130" height="36" rx="6"/>
  <text class="tx tx-b" x="645" y="268" text-anchor="middle" dominant-baseline="middle">Stream workers</text>
  <line class="ln" x1="530" y1="268" x2="578" y2="268" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="580" y="175" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="645" y="195" text-anchor="middle" dominant-baseline="middle">Analytics store</text>
  <line class="ln" x1="645" y1="250" x2="645" y2="217" marker-end="url(#dg-arr)"/>
</svg>`, caption: "URL shortener. Writes get unique IDs from pre-allocated ranges; redirects go cache → DB; every click is published to Kafka without blocking the redirect." },
        { ol: [
          "<b>Shorten</b>: validate URL → get next unique id → base62 encode → insert <code>(code, long_url)</code> → return short URL.",
          "<b>Redirect</b>: look up <code>code</code> in Redis; on miss read DB and populate cache (cache-aside, TTL e.g. 24 h); return 302 with <code>Location</code>. Fire a click event to Kafka asynchronously (don't wait).",
          "Services are stateless and scaled independently — redirect traffic is 100× shorten traffic.",
        ] },
      ] },
      { h: "Deep dive: generating the short code", blocks: [
        { table: { head: ["Approach", "How", "Pros", "Cons"], rows: [
          ["<b>Counter + base62</b>", "Global unique 64-bit id → base62 string", "No collisions ever; short codes; simple", "Single counter = SPOF/bottleneck; sequential codes are guessable"],
          ["<b>Hash + truncate</b>", "base62(MD5/SHA-256(longUrl)) → take first 7 chars", "Stateless; same URL → same code (dedupe)", "Collisions: must check DB and retry with a salt; extra DB read per write"],
          ["<b>Key Generation Service (KGS)</b>", "Offline service pre-generates random unique codes; app servers fetch batches (e.g. 1,000) into memory", "Random (not guessable), no collision check at write time, fast", "Extra service to run & keep highly available; keys in a crashed server's batch are lost (acceptable)"],
        ] } },
        { p: "<b>Making the counter scale</b>: don't hit one counter per request. A coordinator (ZooKeeper, or a DB row updated in a transaction) hands each app server a <b>range</b> of 1M ids. At ~40 writes/s total, a 1M range lasts one server ~7 hours (1M / 40 ≈ 25,000 s). A server that crashes simply wastes the rest of its range." },
        { p: "<b>Hash collision risk</b>: once 6B codes exist in a 6-char space of 56.8B, a random new code collides with probability ≈ 6 / 56.8 ≈ <b>10.6%</b> — so the collision-check-and-retry loop is not rare. Use 7 chars (≈ 3.5T space) to make it rare." },
        { p: "<b>Avoiding guessable codes with a counter</b>: start the counter at 62<sup>5</sup> = 916,132,832 so every code is 6 chars (encodes to <code>100000</code>), and optionally scramble the id with a reversible bijection (e.g. multiply by a large odd constant modulo 62<sup>7</sup>) before encoding." },
        { code: `public class Base62 {
    private static final String ALPHABET =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = ALPHABET.length(); // 62

    // id -> short code (most significant digit first)
    static String encode(long id) {
        if (id < 0) throw new IllegalArgumentException("id must be >= 0");
        if (id == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(ALPHABET.charAt((int) (id % BASE)));
            id /= BASE;
        }
        return sb.reverse().toString();
    }

    // short code -> id
    static long decode(String code) {
        long id = 0;
        for (char c : code.toCharArray()) {
            int d = ALPHABET.indexOf(c);
            if (d < 0) throw new IllegalArgumentException("bad char: " + c);
            id = id * BASE + d;
        }
        return id;
    }

    public static void main(String[] args) {
        long[] ids = {125, 1_000_000, 916_132_832L, 56_800_235_583L};
        for (long id : ids) {
            String code = encode(id);
            System.out.println(id + " -> " + code + " -> " + decode(code));
        }
    }
}`, lang: "java", title: "Base62 encoder / decoder" },
        { code: `125 -> 21 -> 125
1000000 -> 4c92 -> 1000000
916132832 -> 100000 -> 916132832
56800235583 -> ZZZZZZ -> 56800235583`, lang: "text", title: "Output" },
        { p: "Check by hand: 125 = 2 × 62 + 1 → digits (2, 1) → <code>21</code>. 1,000,000 = 4·62³ + 12·62² + 9·62 + 2 = 953,312 + 46,128 + 558 + 2 → digits (4, 12, 9, 2) → <code>4c92</code>. 62<sup>6</sup> − 1 = 56,800,235,583 is the largest 6-char code <code>ZZZZZZ</code>." },
        { p: "<b>Custom aliases</b>: insert with the unique primary key; a conflict → 409. Keep alias characters in the same alphabet, and block reserved words (<code>api</code>, <code>admin</code>)." },
      ] },
      { h: "Redirect: 301 vs 302, caching and scaling", blocks: [
        { table: { head: ["", "301 Moved Permanently", "302 Found (temporary)"], rows: [
          ["Browser behaviour", "Caches the redirect; later clicks may never reach your server", "Asks your server every time"],
          ["Server load", "Lower", "Higher (every click)"],
          ["Analytics", "Undercounts clicks", "Every click counted"],
          ["Change destination later", "Hard (cached in browsers)", "Easy"],
          ["Choose when", "Pure redirect service, cost-sensitive", "Analytics, expiry, editable links (usual interview answer)"],
        ] } },
        { ul: [
          "<b>Cache</b>: Redis cluster with ~35 GB of hot mappings, LRU eviction; expected hit rate &gt; 90% because a few links get most clicks. Mappings rarely change → easy invalidation (delete on edit/delete/expiry).",
          "<b>DB</b>: replicate for reads and availability; shard by hash of <code>short_code</code> (consistent hashing) as data grows beyond one node. Every redirect query is a single-key lookup, so sharding has no cross-shard queries.",
          "<b>Expiry</b>: check <code>expires_at</code> on read (return 410) + a background job that deletes expired rows and frees aliases.",
          "<b>Availability</b>: multiple app instances per zone, DB replicas in another zone, Redis with replicas; redirect path works even if the analytics pipeline is down.",
          "<b>Abuse</b>: rate-limit creation per user/IP, scan long URLs against malware/phishing lists.",
        ] },
      ] },
      { h: "Analytics pipeline", blocks: [
        { ol: [
          "Redirect service publishes a click event <code>{code, ts, ip, userAgent, referrer}</code> to Kafka topic <code>clicks</code> (key = code) — fire-and-forget with a local buffer, never blocking the redirect.",
          "Stream workers enrich (IP → country, user-agent → device) and aggregate per <code>(code, minute, country, device)</code>.",
          "Aggregates are written to an OLAP store (ClickHouse / Druid / BigQuery-style) for the stats API; raw events go to cheap object storage for reprocessing.",
          "Real-time total counter: <code>INCR clicks:{code}</code> in Redis, flushed to DB periodically (write-back).",
        ] },
        { warn: "Don't do <code>UPDATE urls SET clicks = clicks + 1</code> on every redirect: a viral link turns one row into a lock hot-spot and makes the read path write to the DB. Count asynchronously." },
        { tip: "Wrap up with numbers: '8K peak redirects/s served ~90% from Redis leaves ~800/s for the DB — two replicas handle that easily; writes are 80/s; storage 3 TB over 5 years. First bottleneck at 10× would be DB read replicas → shard by code.'" },
      ] },
    ],
    practice: [
      { q: "How many characters do you need if you expect 50B URLs total? Show the math.", a: "62⁶ ≈ 56.8B ≥ 50B, so 6 chars technically suffice, but the space would be ~88% full (collision retries for hash/random approaches become constant). Use 7 chars: 62⁷ ≈ 3.52 trillion." },
      { q: "Encode id 3,844 in base62 with alphabet 0-9a-zA-Z.", a: "3,844 = 62², so digits are (1, 0, 0) → <code>100</code>. (Check: 1×3,844 + 0 + 0.)" },
      { q: "Two users shorten the same long URL. With counter-based generation, what happens? With hashing? Which is better?", a: "Counter: two different codes (separate rows) — simple, and each user can have their own analytics/expiry. Hash: the same code (dedupe) unless you salt with user id. Usually separate codes are preferred because links belong to users; dedupe could be added with a lookup index on long_url if storage mattered." },
      { q: "Why is a single auto-increment counter in one DB a problem, and how do ranges fix it?", a: "Every shorten request must hit that one row → a throughput bottleneck and single point of failure. With ranges, a coordinator allocates blocks (e.g. 1M ids) to each server; the server hands out ids from memory and only contacts the coordinator when its block runs out (hours later), so the coordinator is almost never on the request path. Crashed servers just waste unused ids." },
      { q: "Product wants to count every click accurately. Which redirect status and why? What's the cost?", a: "302: the browser doesn't cache it, so every click hits the redirect service and gets logged. Cost: more traffic to your servers (every click served), which the Redis cache and stateless redirect tier absorb." },
    ],
    related: ["sd:design-url-shortener", "sd:back-of-envelope-estimation", "sd:caching-strategies", "sd:database-sharding", "sd:consistent-hashing", "sd:message-queues-pub-sub", "sd:redis-use-cases", "sd:sql-vs-nosql", "cn:http-status-codes", "dbms:hash-index"]
  });

  /* ------------------------------------------------------------------ */
  /* D46 — rate limiter + notification service                           */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-rate-limiter-notification",
    subject: "hld",
    title: "Design a distributed rate limiter and a notification service",
    minutes: 70,
    crux: [
      "A rate limiter normally sits in the <b>API gateway / middleware</b> in front of services; counters live in <b>Redis</b> so all gateway instances share one view.",
      "Redis updates must be <b>atomic</b>: <code>INCR</code> + <code>EXPIRE</code> for fixed window, or a <b>Lua script</b> for token bucket / sliding window — never GET-then-SET from the app.",
      "Return <b>429</b> with <code>Retry-After</code> and <code>X-RateLimit-*</code> headers. Decide fail-open vs fail-closed if Redis is down (usually fail-open).",
      "Notification service: <b>API → preferences + dedupe + template → per-channel queues → workers → providers</b> (push/SMS/email), with retries, DLQ and status tracking.",
      "Separate <b>priority</b> queues (OTP ≫ marketing), dedupe with an idempotency key, and respect user preferences / quiet hours.",
    ],
    sections: [
      { h: "Rate limiter: requirements and placement", blocks: [
        { ul: [
          "<b>Functional</b>: limit requests per key (user id, API key, IP) per rule (e.g. 100/min for <code>/api/search</code>, 5/min for <code>/login</code>); reject with 429.",
          "<b>Non-functional</b>: adds &lt; ~2 ms latency; works across many gateway instances (distributed); highly available; memory efficient; limits configurable without redeploy.",
        ] },
        { table: { head: ["Where", "Pros", "Cons"], rows: [
          ["Client-side", "Saves requests", "Can't be trusted — attackers bypass it"],
          ["<b>API gateway / middleware</b>", "One place for all services; rejects before any work is done", "Gateway must reach a shared store fast"],
          ["Inside each service", "Fine-grained, business-aware limits", "Duplicated logic; per-instance counters are wrong unless shared"],
        ] } },
        { svg: `<svg viewBox="0 0 700 220" width="700" class="dg">
  <rect class="box" x="10" y="80" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="98" text-anchor="middle" dominant-baseline="middle">Clients</text>
  <rect class="box-a" x="150" y="40" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="225" y="60" text-anchor="middle" dominant-baseline="middle">Gateway 1 + limiter</text>
  <rect class="box-a" x="150" y="120" width="150" height="40" rx="6"/>
  <text class="tx tx-b" x="225" y="140" text-anchor="middle" dominant-baseline="middle">Gateway 2 + limiter</text>
  <line class="ln-a" x1="90" y1="92" x2="148" y2="62" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="90" y1="104" x2="148" y2="136" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="360" y="80" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="420" y="100" text-anchor="middle" dominant-baseline="middle">Redis cluster</text>
  <line class="ln" x1="300" y1="64" x2="358" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="300" y1="136" x2="358" y2="108" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="330" y="178" text-anchor="middle">atomic Lua / INCR</text>
  <rect class="box" x="560" y="40" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="625" y="60" text-anchor="middle" dominant-baseline="middle">Services</text>
  <line class="ln-a" x1="300" y1="52" x2="558" y2="52" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="530" y="44" text-anchor="end">allowed</text>
  <rect class="box-r" x="560" y="130" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="625" y="150" text-anchor="middle" dominant-baseline="middle">429 + Retry-After</text>
  <line class="ln ln-d" x1="300" y1="150" x2="558" y2="150" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="530" y="168" text-anchor="end">over limit</text>
  <rect class="box-p" x="360" y="5" width="120" height="30" rx="6"/>
  <text class="tx" x="420" y="20" text-anchor="middle" dominant-baseline="middle">Rules config</text>
</svg>`, caption: "Every gateway instance checks the same Redis counters, so a user can't bypass the limit by hitting a different instance." },
      ] },
      { h: "Rate limiter: Redis implementation", blocks: [
        { p: "<b>Race condition</b>: two gateways both GET count=99, both allow, both SET 100 → 101 requests allowed. The fix is to make read-modify-write atomic inside Redis (single command, or a Lua script, which Redis executes atomically)." },
        { code: `-- Fixed window: KEYS[1] = "rl:{userId}:{route}:{epochMinute}"
-- ARGV[1] = limit, ARGV[2] = window seconds
local c = redis.call('INCR', KEYS[1])
if c == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[2])
end
if c > tonumber(ARGV[1]) then
  return 0   -- reject
end
return 1     -- allow`, lang: "text", title: "Redis Lua script (fixed window)" },
        { code: `-- Token bucket: KEYS[1] = "tb:{userId}"
-- ARGV: capacity, refill_per_sec, now_ms
local cap  = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now  = tonumber(ARGV[3])
local b = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(b[1]) or cap
local ts     = tonumber(b[2]) or now
tokens = math.min(cap, tokens + (now - ts) / 1000 * rate)
local allowed = 0
if tokens >= 1 then tokens = tokens - 1; allowed = 1 end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', KEYS[1], math.ceil(cap / rate * 1000))
return allowed`, lang: "text", title: "Redis Lua script (token bucket, same lazy refill as the Java version)" },
        { ul: [
          "<b>Sliding log</b> in Redis: sorted set per user — <code>ZREMRANGEBYSCORE key 0 now-window</code>, <code>ZADD key now reqId</code>, <code>ZCARD key</code> — exact but memory grows with the limit.",
          "<b>Scaling Redis</b>: shard counters by key across a Redis Cluster; one user's counter lives on one node, so no cross-node coordination. 10M active keys × ~100 bytes ≈ 1 GB — memory is not the issue, round-trip latency is.",
          "<b>Hot path latency</b>: one Redis round trip (~1 ms) per request. For extreme QPS, keep a small local token budget per gateway and sync with Redis periodically (slightly less accurate).",
          "<b>Multi-region</b>: count per region (simple, users mostly stick to one region) or replicate asynchronously and accept small overshoot.",
          "<b>Redis down</b>: fail-open (allow traffic, log/alert) for normal APIs; fail-closed for sensitive ones like login/OTP to stop brute force.",
          "<b>Response</b>: <code>429</code>, <code>Retry-After: 30</code>, <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>.",
        ] },
      ] },
      { h: "Notification service: requirements and estimation", blocks: [
        { ul: [
          "<b>Functional</b>: other services send notifications to users via <b>push</b> (FCM/APNs), <b>SMS</b>, <b>email</b>, in-app; templates with variables; user preferences (opt-out per channel/category); scheduling; delivery status.",
          "<b>Non-functional</b>: OTP/transactional delivered within seconds; marketing can be delayed; at-least-once delivery with <b>no visible duplicates</b>; survive provider outages.",
        ] },
        { p: "<b>Estimation</b> (assume 50M users): 10 push/user/day = 500M push/day ≈ 5,800/s; 2M SMS/day ≈ 23/s; 20M email/day ≈ 230/s. Campaign spikes: a 'sale starts now' push to 50M users must be spread over minutes (rate-limited by providers anyway)." },
      ] },
      { h: "Notification service: design", blocks: [
        { svg: `<svg viewBox="0 0 720 300" width="720" class="dg">
  <rect class="box" x="10" y="115" width="100" height="44" rx="6"/>
  <text class="tx tx-b" x="60" y="131" text-anchor="middle" dominant-baseline="middle">Order, Auth,</text>
  <text class="tx tx-b" x="60" y="147" text-anchor="middle" dominant-baseline="middle">Marketing svcs</text>
  <rect class="box-a" x="150" y="115" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="210" y="131" text-anchor="middle" dominant-baseline="middle">Notification</text>
  <text class="tx tx-b" x="210" y="147" text-anchor="middle" dominant-baseline="middle">API</text>
  <line class="ln-a" x1="110" y1="137" x2="148" y2="137" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="150" y="20" width="120" height="30" rx="6"/>
  <text class="tx" x="210" y="35" text-anchor="middle" dominant-baseline="middle">Preferences DB</text>
  <rect class="box-g" x="150" y="60" width="120" height="30" rx="6"/>
  <text class="tx" x="210" y="75" text-anchor="middle" dominant-baseline="middle">Dedupe (Redis)</text>
  <rect class="box-g" x="150" y="205" width="120" height="30" rx="6"/>
  <text class="tx" x="210" y="220" text-anchor="middle" dominant-baseline="middle">Templates</text>
  <line class="ln ln-d" x1="210" y1="115" x2="210" y2="92" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="210" y1="159" x2="210" y2="203" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="320" y="50" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="380" y="67" text-anchor="middle" dominant-baseline="middle">push queue</text>
  <rect class="box-w" x="320" y="120" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="380" y="137" text-anchor="middle" dominant-baseline="middle">SMS queue</text>
  <rect class="box-w" x="320" y="190" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="380" y="207" text-anchor="middle" dominant-baseline="middle">email queue</text>
  <line class="ln-a" x1="270" y1="130" x2="318" y2="70" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="270" y1="137" x2="318" y2="137" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="270" y1="144" x2="318" y2="204" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="480" y="50" width="90" height="34" rx="6"/>
  <text class="tx" x="525" y="67" text-anchor="middle" dominant-baseline="middle">workers</text>
  <rect class="box" x="480" y="120" width="90" height="34" rx="6"/>
  <text class="tx" x="525" y="137" text-anchor="middle" dominant-baseline="middle">workers</text>
  <rect class="box" x="480" y="190" width="90" height="34" rx="6"/>
  <text class="tx" x="525" y="207" text-anchor="middle" dominant-baseline="middle">workers</text>
  <line class="ln" x1="440" y1="67" x2="478" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="440" y1="137" x2="478" y2="137" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="440" y1="207" x2="478" y2="207" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="605" y="50" width="105" height="34" rx="6"/>
  <text class="tx" x="657" y="67" text-anchor="middle" dominant-baseline="middle">FCM / APNs</text>
  <rect class="box-p" x="605" y="120" width="105" height="34" rx="6"/>
  <text class="tx" x="657" y="137" text-anchor="middle" dominant-baseline="middle">SMS gateway</text>
  <rect class="box-p" x="605" y="190" width="105" height="34" rx="6"/>
  <text class="tx" x="657" y="207" text-anchor="middle" dominant-baseline="middle">Email (SMTP)</text>
  <line class="ln" x1="570" y1="67" x2="603" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="570" y1="137" x2="603" y2="137" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="570" y1="207" x2="603" y2="207" marker-end="url(#dg-arr)"/>
  <rect class="box-r" x="440" y="255" width="130" height="34" rx="6"/>
  <text class="tx tx-b" x="505" y="272" text-anchor="middle" dominant-baseline="middle">retry / DLQ</text>
  <line class="ln ln-d" x1="525" y1="224" x2="512" y2="253" marker-end="url(#dg-arr)"/>
  <rect class="box" x="605" y="255" width="105" height="34" rx="6"/>
  <text class="tx" x="657" y="272" text-anchor="middle" dominant-baseline="middle">Status log DB</text>
  <line class="ln ln-d" x1="570" y1="272" x2="603" y2="272" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Notification service: validate → check preferences & dedupe → render template → per-channel queues → workers call third-party providers; failures go to retry/DLQ; every attempt is logged." },
        { ol: [
          "Caller sends <code>POST /notify {userId, type: ORDER_SHIPPED, params, idempotencyKey, priority}</code>.",
          "API validates, loads user preferences (cached) — drop channels the user opted out of, apply quiet hours (defer non-urgent at night).",
          "<b>Dedupe</b>: <code>SET notif:{idempotencyKey} 1 NX EX 86400</code> in Redis — if the key exists, it's a duplicate, skip.",
          "Look up contact info (device tokens, phone, email) and render the template (e.g. 'Hi {{name}}, your order {{orderId}} has shipped').",
          "Enqueue one message per channel on that channel's queue; <b>separate high-priority queues</b> (OTP, security alerts) so a 50M-user marketing blast never delays an OTP.",
          "Channel workers call providers with timeouts; on transient failure retry with exponential backoff + jitter; after N attempts → DLQ + alert; circuit breaker per provider and optional fallback provider (second SMS vendor).",
          "Record status (QUEUED → SENT → DELIVERED / FAILED) from provider callbacks for debugging and analytics; remove invalid device tokens.",
        ] },
        { table: { head: ["Concern", "Solution"], rows: [
          ["Duplicates from retries", "Idempotency key per notification; workers check it before sending"],
          ["Provider rate limits", "Token bucket per provider in the workers"],
          ["Spam / fatigue", "Per-user caps (e.g. max 3 marketing pushes/day) and preference centre"],
          ["Scheduled sends", "Store in a scheduled table indexed by send time; a scheduler enqueues due items"],
          ["Losing messages", "Durable queue (Kafka/SQS) + persist the notification before ACK to the caller"],
        ] } },
      ] },
    ],
    practice: [
      { q: "Two gateway instances each keep an in-memory counter for a 100/min limit. What's wrong?", a: "Each instance only sees its own traffic, so a user whose requests are spread over 2 instances gets up to 200/min (N instances → N × limit). Counters must be shared (Redis) or the LB must pin users to instances (fragile)." },
      { q: "Why use a Lua script instead of GET, check, SET from Java?", a: "GET-check-SET is three round trips and not atomic: concurrent requests read the same count and both pass, overshooting the limit. Redis executes a Lua script atomically (no other command interleaves), and it is one round trip." },
      { q: "An OTP SMS took 20 minutes to arrive during a marketing campaign. Diagnose and fix.", a: "OTPs and marketing shared one SMS queue, so the OTP waited behind millions of campaign messages. Fix: separate high-priority queue/topic and dedicated workers for transactional messages, rate-limit/throttle campaign sends, and set short TTLs on OTPs (drop if stale)." },
      { q: "The order service retried <code>POST /notify</code> after a timeout, and the user received 2 'Order shipped' pushes. How does your design prevent it?", a: "The caller passes an idempotency key (e.g. <code>orderId + ':SHIPPED'</code>). The API does <code>SET key NX EX 86400</code>; the retry finds the key already present and returns success without enqueueing again. Workers also check the key before sending so queue redeliveries don't double-send." },
      { q: "Redis (used by the rate limiter) is down. Should requests be allowed?", a: "It depends on the endpoint: for general APIs fail-open (allow, raise an alert) — an outage of a protection layer shouldn't take the product down. For login/OTP endpoints fail-closed or fall back to a coarse local in-memory limit, because unlimited attempts enable brute force and SMS cost abuse." },
    ],
    related: ["sd:design-rate-limiter", "sd:rate-limiting-algorithms", "sd:design-notification-service", "sd:api-gateway", "sd:redis-use-cases", "sd:message-queues-pub-sub", "sd:idempotency", "sd:retries-exponential-backoff-jitter", "sd:circuit-breaker"]
  });

  /* ------------------------------------------------------------------ */
  /* D46 — "How would you scale your project to 1M users?"              */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-scale-project-1m",
    subject: "hld",
    title: "\"How would you scale your project to 1M users?\" — a full answer",
    minutes: 45,
    crux: [
      "Start with <b>numbers</b>: 1M users is not 1M requests/second. With 200K DAU the example below is ~600 redirects/s at peak — a few well-built instances handle it.",
      "Say <b>what breaks first</b> and fix in order: measure → DB indexes/pool → cache → stateless + multiple instances behind an LB → async side-work → rate limits → replicas → (much later) sharding.",
      "Key moves for a Spring Boot app: <b>stateless</b> (sessions in Redis/JWT), <b>Redis cache-aside</b> for hot reads, <b>HikariCP</b> pool sizing, <b>read replica</b>, <b>Kafka/queue</b> for analytics, <b>Docker + LB + autoscaling</b>, <b>Prometheus/Grafana</b>.",
      "Mention availability, not just capacity: ≥ 2 instances across zones, DB backups + failover, health checks, zero-downtime deploys.",
    ],
    sections: [
      { h: "Step 1: turn '1M users' into numbers", blocks: [
        { p: "Assume your Project 1 is a Spring Boot URL shortener backed by Postgres (adapt the same template to your own project). State assumptions out loud:" },
        { table: { head: ["Metric", "Assumption / calculation", "Result"], rows: [
          ["Registered users", "given", "1M"],
          ["Daily active users", "20% of 1M", "200K DAU"],
          ["Links created", "2 per DAU per day = 400K/day; ÷ 86,400", "≈ 4.6/s"],
          ["Redirects", "10M/day (links are clicked by the public too); ÷ 86,400", "≈ 116/s avg, ≈ 580/s peak (5× spike)"],
          ["Dashboard/API calls", "200K × 20/day = 4M/day", "≈ 46/s"],
          ["New storage", "400K × 500 B/day", "200 MB/day ≈ 73 GB/year"],
          ["Click events", "10M × 100 B/day", "1 GB/day ≈ 365 GB/year → aggregate, don't store per-row in the main DB"],
          ["DB reads after cache", "580/s peak × 10% miss", "≈ 58/s"],
        ] } },
        { p: "Takeaway to say: <i>'Capacity-wise, one tuned instance could almost do this; what I really need at 1M users is availability, no hot-row contention, and headroom for viral spikes.'</i> That honest framing impresses more than drawing Kubernetes, Kafka and sharding for 600 req/s." },
      ] },
      { h: "Step 2: what breaks first (and the fix)", blocks: [
        { table: { head: ["Bottleneck", "Symptom", "Fix"], rows: [
          ["Synchronous click counting (<code>UPDATE ... clicks = clicks + 1</code>)", "Viral link → row-lock contention, redirect p99 jumps", "<code>INCR</code> in Redis or publish event to a queue; flush aggregates in batches"],
          ["No cache on redirect path", "Every redirect = DB query", "Redis cache-aside for <code>code → longUrl</code>, TTL 24 h, ~90% hit rate"],
          ["DB connection pool", "Threads wait for connections; timeouts at spikes", "Right-size HikariCP (default 10) using measurements, keep queries short, add indexes (<code>user_id</code> for dashboards)"],
          ["Single instance", "Deploy = downtime; crash = outage", "≥ 2 stateless instances behind an LB (Nginx/ALB), health checks, rolling deploys"],
          ["In-memory sessions", "Logged out when LB switches instance", "Spring Session with Redis, or stateless JWT"],
          ["Abuse / bots", "Link-creation spam, scraping", "Rate limit per user/IP at the gateway (token bucket in Redis)"],
          ["Dashboard analytics queries on the main DB", "Heavy GROUP BY slows redirects", "Pre-aggregated tables updated by workers; later a read replica or OLAP store"],
        ] } },
      ] },
      { h: "Step 3: the target architecture", blocks: [
        { svg: `<svg viewBox="0 0 720 250" width="720" class="dg">
  <rect class="box" x="10" y="100" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="118" text-anchor="middle" dominant-baseline="middle">Users</text>
  <rect class="box-p" x="10" y="20" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="38" text-anchor="middle" dominant-baseline="middle">CDN</text>
  <line class="ln ln-d" x1="50" y1="100" x2="50" y2="58" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="125" y="100" width="100" height="36" rx="6"/>
  <text class="tx tx-b" x="175" y="118" text-anchor="middle" dominant-baseline="middle">LB + limiter</text>
  <line class="ln-a" x1="90" y1="118" x2="123" y2="118" marker-end="url(#dg-arr-a)"/>
  <rect class="box" x="265" y="60" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="325" y="77" text-anchor="middle" dominant-baseline="middle">Spring Boot #1</text>
  <rect class="box" x="265" y="140" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="325" y="157" text-anchor="middle" dominant-baseline="middle">Spring Boot #2</text>
  <line class="ln-a" x1="225" y1="112" x2="263" y2="80" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="225" y1="124" x2="263" y2="154" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="325" y="118" text-anchor="middle">stateless, autoscaled</text>
  <rect class="box-g" x="430" y="20" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="490" y="37" text-anchor="middle" dominant-baseline="middle">Redis</text>
  <rect class="box-a" x="430" y="100" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="490" y="117" text-anchor="middle" dominant-baseline="middle">Postgres primary</text>
  <rect class="box-w" x="430" y="180" width="120" height="34" rx="6"/>
  <text class="tx tx-b" x="490" y="197" text-anchor="middle" dominant-baseline="middle">Queue</text>
  <line class="ln" x1="385" y1="72" x2="428" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="385" y1="84" x2="428" y2="112" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="385" y1="160" x2="428" y2="192" marker-end="url(#dg-arr)"/>
  <rect class="box" x="595" y="100" width="115" height="34" rx="6"/>
  <text class="tx" x="652" y="117" text-anchor="middle" dominant-baseline="middle">Read replica</text>
  <line class="ln ln-d" x1="550" y1="117" x2="593" y2="117" marker-end="url(#dg-arr)"/>
  <rect class="box" x="595" y="180" width="115" height="34" rx="6"/>
  <text class="tx" x="652" y="197" text-anchor="middle" dominant-baseline="middle">Stats workers</text>
  <line class="ln" x1="550" y1="197" x2="593" y2="197" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="490" y="236" text-anchor="middle">Prometheus + Grafana on everything</text>
</svg>`, caption: "Project 1 at 1M users: stateless Spring Boot instances behind an LB with rate limiting, Redis for cache/sessions/counters, Postgres primary + replica, a queue for click stats." },
        { ol: [
          "<b>Measure first</b>: Spring Boot Actuator + Micrometer → Prometheus/Grafana (p95/p99 latency, RPS, error rate, DB pool usage, cache hit rate). Load test with JMeter/k6 at 2× the expected peak.",
          "<b>Quick wins</b>: indexes on query columns, fix N+1 queries (JPA fetch joins), pagination on list endpoints, gzip, HTTP keep-alive.",
          "<b>Cache</b>: Redis cache-aside on the redirect path; also store sessions and rate-limit counters there.",
          "<b>Stateless + horizontal</b>: package in Docker, run ≥ 2 instances across availability zones behind an LB, readiness/liveness health checks, rolling deploys, autoscale on CPU/RPS.",
          "<b>Async</b>: click events to a queue (Kafka, RabbitMQ or SQS); workers aggregate into a stats table.",
          "<b>Database</b>: managed Postgres with automated backups and a standby for failover; read replica for dashboards/analytics; archive old click data.",
          "<b>Edge</b>: static frontend on a CDN; rate limiting and TLS at the LB/gateway.",
        ] },
        { p: "<b>Beyond 1M → 10M+ users</b>: more replicas, then shard the <code>urls</code> table by hash of <code>short_code</code>; ID ranges instead of DB sequences; multi-region deployment with geo-DNS; move analytics to a columnar store." },
      ] },
      { h: "Variant: if Project 1 is a custom Java HTTP server", blocks: [
        { ul: [
          "Thread-per-connection with unbounded threads dies under load → bounded thread pool (<code>Executors.newFixedThreadPool</code>) with a bounded queue and rejection (return 503), or Java 21 <b>virtual threads</b> (<code>Executors.newVirtualThreadPerTaskExecutor()</code>) for blocking I/O at high concurrency.",
          "Or event-driven I/O with <code>java.nio</code> Selector (one thread handles thousands of connections) — the Netty model.",
          "Keep-alive + read/write/idle timeouts so slow clients (slowloris) can't hold connections forever.",
          "Serve static files via a CDN or Nginx in front; your server handles dynamic routes only.",
          "Make it stateless and run several instances behind Nginx/HAProxy; add <code>/health</code> for the LB.",
          "Benchmark with <code>wrk</code>/JMeter before and after each change, and quote the numbers in the interview.",
        ] },
        { tip: "Structure the spoken answer as: <b>numbers → current bottlenecks (measured) → fixes in order → architecture diagram → what I'd do at 10×</b>. Two minutes of this beats ten minutes of buzzwords." },
      ] },
    ],
    practice: [
      { q: "Convert: 1M registered users, 10% DAU, each makes 30 API calls/day. Average and peak (3×) QPS?", a: "DAU = 100K. Calls/day = 100K × 30 = 3M. 3M / 86,400 ≈ 35/s average, ≈ 105/s peak. Small — a single instance handles this; run 2 for availability." },
      { q: "Your redirect endpoint does <code>SELECT</code> then <code>UPDATE urls SET clicks = clicks + 1</code>. A link goes viral at 2,000 clicks/s. What happens?", a: "Every click takes a row lock on the same row; updates serialize, lock waits grow, DB connections are held longer, the pool is exhausted and all endpoints slow down. Fix: serve the redirect from Redis cache, count with Redis INCR or send a click event to a queue, and persist aggregated counts periodically." },
      { q: "Why must the Spring Boot app be stateless before adding a second instance? Name what you move out.", a: "The LB may send any request to any instance; state held in one instance's memory (HttpSession, in-memory caches used as truth, uploaded files on local disk) is invisible to others. Move sessions to Redis/JWT, files to object storage, shared counters/caches to Redis, data to the DB." },
      { q: "List 5 metrics you'd put on the dashboard for this service.", a: "Requests per second per endpoint; p95/p99 latency (redirect especially); error rate (5xx, 429); cache hit rate; DB connection pool usage + slow queries; queue consumer lag; JVM heap/GC pauses; instance CPU." },
    ],
    related: ["sd:horizontal-vs-vertical-scaling", "sd:stateless-services", "sd:caching-strategies", "sd:database-replication", "sd:message-queues-pub-sub", "sd:rate-limiting-algorithms", "sd:monitoring-logging-metrics", "sd:health-checks", "sd:back-of-envelope-estimation", "sd:design-url-shortener", "se:docker-basics"]
  });

  /* ------------------------------------------------------------------ */
  /* D47 — chat (WhatsApp)                                                */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-chat-whatsapp",
    subject: "hld",
    title: "Design WhatsApp / a chat system",
    minutes: 70,
    crux: [
      "Clients keep a persistent <b>WebSocket</b> to a <b>chat gateway</b>; a <b>session registry</b> (Redis: userId → gateway) tells the backend where to push a message.",
      "Flow: sender → gateway → chat service assigns a <b>per-conversation sequence id</b>, persists, acks <b>sent ✓</b> → pushes to recipient's gateway → recipient acks <b>delivered ✓✓</b> → opens chat → <b>read</b> (blue).",
      "<b>Offline</b> recipient: message stays in storage; push notification wakes the app; on reconnect the client syncs everything after its last seen sequence id.",
      "Storage: write-heavy, append-only, read by conversation and time → wide-column store (Cassandra/HBase) partitioned by <code>conversation_id</code>, clustered by <code>message_id</code>.",
      "<b>Groups</b>: store the message once, fan out delivery to each member's gateway (groups are capped, ~1K members). <b>Ordering</b> per conversation via server-assigned sequence numbers, not client clocks.",
    ],
    sections: [
      { h: "Requirements and estimation", blocks: [
        { table: { head: ["Functional", "Non-functional"], rows: [
          ["1:1 and group chat (text; media via links)", "Real-time: delivery &lt; ~200 ms when both online"],
          ["Sent / delivered / read receipts", "Never lose a message; no duplicates shown"],
          ["Offline delivery + push notifications", "Messages ordered within a conversation"],
          ["Online / last-seen presence", "Highly available; eventual consistency fine for presence"],
          ["Multi-device sync (mention)", "End-to-end encryption (server stores ciphertext)"],
        ] } },
        { table: { head: ["Metric", "Calculation", "Result"], rows: [
          ["DAU", "assumed", "500M"],
          ["Messages/day", "500M × 40", "20B/day"],
          ["Message QPS", "20B / 86,400", "≈ 230K/s avg, ≈ 460K/s peak"],
          ["Storage", "20B × 100 B", "2 TB/day ≈ 730 TB/year (before replication)"],
          ["Concurrent connections", "20% of DAU online at peak", "100M WebSockets"],
          ["Gateway servers", "100M / ~100K connections per server", "≈ 1,000 servers"],
        ] } },
      ] },
      { h: "Why WebSockets, and the architecture", blocks: [
        { table: { head: ["Technique", "How", "Verdict for chat"], rows: [
          ["Short polling", "Client asks every N seconds", "Wasteful, laggy"],
          ["Long polling", "Server holds request until data or timeout", "Works, but reconnect per message; server→client only"],
          ["Server-Sent Events", "One-way server → client stream over HTTP", "Good for feeds/notifications, not bidirectional"],
          ["<b>WebSocket</b>", "Persistent full-duplex TCP connection after an HTTP upgrade", "Best: low latency both ways, tiny per-message overhead"],
        ] } },
        { svg: `<svg viewBox="0 0 720 300" width="720" class="dg">
  <rect class="box" x="10" y="40" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="58" text-anchor="middle" dominant-baseline="middle">User A</text>
  <rect class="box" x="10" y="200" width="80" height="36" rx="6"/>
  <text class="tx tx-b" x="50" y="218" text-anchor="middle" dominant-baseline="middle">User B</text>
  <rect class="box-a" x="140" y="40" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="195" y="58" text-anchor="middle" dominant-baseline="middle">WS gateway 1</text>
  <rect class="box-a" x="140" y="200" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="195" y="218" text-anchor="middle" dominant-baseline="middle">WS gateway 2</text>
  <line class="ln-a" x1="90" y1="58" x2="138" y2="58" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="114" y="50" text-anchor="middle">1</text>
  <line class="ln-a" x1="140" y1="218" x2="92" y2="218" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="114" y="210" text-anchor="middle">5</text>
  <rect class="box-g" x="310" y="120" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="370" y="140" text-anchor="middle" dominant-baseline="middle">Chat service</text>
  <line class="ln-a" x1="250" y1="64" x2="308" y2="128" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="272" y="104">2</text>
  <line class="ln-a" x1="308" y1="152" x2="252" y2="210" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="272" y="188">4 push</text>
  <rect class="box-p" x="490" y="30" width="140" height="36" rx="6"/>
  <text class="tx tx-b" x="560" y="48" text-anchor="middle" dominant-baseline="middle">Session registry</text>
  <text class="tx-m" x="560" y="80" text-anchor="middle">Redis: user → gateway</text>
  <rect class="box-a" x="490" y="122" width="140" height="36" rx="6"/>
  <text class="tx tx-b" x="560" y="140" text-anchor="middle" dominant-baseline="middle">Message store</text>
  <text class="tx-m" x="560" y="172" text-anchor="middle">Cassandra, by conversation</text>
  <rect class="box-w" x="490" y="215" width="140" height="36" rx="6"/>
  <text class="tx tx-b" x="560" y="233" text-anchor="middle" dominant-baseline="middle">Push notif. svc</text>
  <text class="tx-m" x="560" y="266" text-anchor="middle">if B is offline</text>
  <line class="ln" x1="430" y1="130" x2="488" y2="52" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="450" y="80">3b</text>
  <line class="ln" x1="430" y1="140" x2="488" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="455" y="132">3a</text>
  <line class="ln ln-d" x1="430" y1="150" x2="488" y2="228" marker-end="url(#dg-arr)"/>
  <rect class="box" x="140" y="120" width="110" height="36" rx="6"/>
  <text class="tx" x="195" y="138" text-anchor="middle" dominant-baseline="middle">Presence svc</text>
</svg>`, caption: "1 A sends over WebSocket → 2 gateway forwards → 3a persist with sequence id, ack 'sent' to A → 3b find B's gateway → 4 push → 5 deliver to B (or push notification if offline)." },
      ] },
      { h: "Message flow and receipts", blocks: [
        { ol: [
          "A's app creates the message with a client-generated <code>clientMsgId</code> (UUID) and shows it with a clock icon.",
          "Gateway 1 forwards to the chat service, which dedupes on <code>clientMsgId</code> (A may resend after a network blip), assigns <code>seq</code> = next sequence number for this conversation, and writes to the message store.",
          "Server acks A → <b>single tick (sent)</b>: the server has it durably.",
          "Chat service looks up B in the session registry. Online → push through gateway 2. Offline → keep it for later and call the push notification service (FCM/APNs).",
          "B's device receives it and sends a delivery ack → server forwards to A → <b>double tick (delivered)</b>.",
          "B opens the conversation → client sends 'read up to seq N' → server forwards to A → <b>blue ticks (read)</b>. One 'read up to N' covers all earlier messages, so receipts are cheap.",
        ] },
        { code: `CREATE TABLE messages (
  conversation_id  BIGINT,
  seq              BIGINT,          -- per-conversation, server assigned
  sender_id        BIGINT,
  client_msg_id    UUID,            -- dedupe resends
  body             BLOB,            -- ciphertext with E2E encryption
  created_at       TIMESTAMP,
  PRIMARY KEY ((conversation_id), seq)   -- partition key, clustering key
);
-- sync after reconnect: SELECT * FROM messages WHERE conversation_id = ? AND seq > ?;`, lang: "text", title: "Message table (Cassandra CQL style)" },
        { ul: [
          "<b>Why Cassandra/HBase</b>: ~230K writes/s, append-only, always read 'latest messages of one conversation' → partition by <code>conversation_id</code>, sorted by <code>seq</code>. No joins needed.",
          "<b>Offline sync</b>: each device stores its last <code>seq</code> per conversation; on reconnect it asks for everything newer. (WhatsApp itself deletes messages from servers after delivery and keeps history on devices — a valid storage-saving variant to mention.)",
          "<b>Media</b>: client uploads the image/video to object storage via a pre-signed URL; the chat message only carries the URL + thumbnail; download goes through a CDN.",
        ] },
      ] },
      { h: "Groups, ordering, presence", blocks: [
        { h: "Group fan-out" },
        { ul: [
          "Store the group message <b>once</b> under the group's <code>conversation_id</code>, then fan out a delivery to each member's gateway (look up each in the session registry); offline members get it on sync + a push.",
          "Group size is capped (hundreds to ~1K members), which keeps write-time fan-out affordable. Very large broadcast channels need a pull model (like a feed).",
          "Receipts in groups: 'delivered/read' shown when <i>all</i> members reach it; store per-member 'last delivered seq / last read seq' rather than per-message rows.",
        ] },
        { h: "Ordering" },
        { ul: [
          "Client clocks are wrong and messages travel different paths → never order by client timestamp.",
          "The chat service assigns a monotonically increasing <code>seq</code> per conversation (e.g. Redis <code>INCR conv:{id}:seq</code>, or the conversation's owning shard). Clients render by <code>seq</code>; a gap tells the client to fetch missing messages.",
          "Global unique ids (not ordering) can use <b>Snowflake</b>-style ids: 41-bit timestamp + 10-bit machine id + 12-bit sequence — roughly time-sortable, generated without coordination.",
        ] },
        { h: "Presence (online / last seen)" },
        { ul: [
          "Clients send a heartbeat every ~30 s; presence service stores <code>lastSeen</code> in Redis with a TTL. No heartbeat within the TTL ⇒ offline.",
          "Don't broadcast every change to every contact (a user with 500 contacts flapping on bad network = storm). Push presence only to users who currently have the chat open, or fetch on demand.",
        ] },
        { tip: "Mention failure handling: a gateway crash drops its WebSockets → clients reconnect (with backoff + jitter) to another gateway via the LB, re-register in the session registry, and sync from their last seq. Nothing is lost because the message was persisted before the 'sent' ack." },
      ] },
    ],
    practice: [
      { q: "Why is a message acknowledged as 'sent' only after it's written to the message store, not when the gateway receives it?", a: "If the gateway or chat service crashed after acking but before persisting, the sender would believe it was sent while it's lost. Persist first, then ack — the client keeps retrying (with the same clientMsgId, deduped server-side) until it gets the ack." },
      { q: "B is offline for 3 days, in 12 conversations. How does B get the missed messages in order?", a: "B's device stored the last seq per conversation. On reconnect it registers with a gateway and, for each conversation, requests messages with seq > lastSeq (paged). The store returns them sorted by seq (clustering key). Push notifications were sent while offline, but the sync is the source of truth." },
      { q: "Estimate WebSocket gateway count for 200M DAU, 25% concurrently online, 50K connections per server.", a: "Concurrent = 50M connections. 50M / 50K = 1,000 servers (plus headroom for failover, e.g. ~1,200)." },
      { q: "A group has 500 members, 300 online on different gateways. Walk through delivery of one message.", a: "Chat service assigns seq in the group conversation and writes the message once. It loads the member list (cached), looks up gateways for the 300 online members in the session registry (batch lookup), and sends one push per gateway containing the recipients on it. The 200 offline members get a push notification and will sync by seq. Per-member delivered/read pointers are updated as acks arrive." },
      { q: "Why not order messages by the client's timestamp?", a: "Device clocks drift or are wrong (manually set), and two users' clocks differ, so ordering by client time can show replies before the question. A server-assigned per-conversation sequence gives one agreed order." },
    ],
    related: ["sd:design-chat-app", "sd:polling-websockets-sse", "cn:websocket-vs-polling", "sd:message-queues-pub-sub", "sd:sql-vs-nosql", "sd:database-sharding", "sd:redis-use-cases", "sd:strong-vs-eventual-consistency", "sd:design-notification-service", "dbms:nosql-types"]
  });

  /* ------------------------------------------------------------------ */
  /* D47 — Instagram news feed                                            */
  /* ------------------------------------------------------------------ */
  add({
    id: "hld-news-feed",
    subject: "hld",
    title: "Design the Instagram / Twitter news feed",
    minutes: 60,
    crux: [
      "Two operations: <b>publish a post</b> and <b>get my feed</b>. Feed reads dominate (≈ 100:1), so precompute where possible.",
      "<b>Fan-out on write (push)</b>: when X posts, insert the post id into every follower's feed cache. Reads are instant; celebrities make writes explode.",
      "<b>Fan-out on read (pull)</b>: at read time, fetch recent posts of everyone I follow and merge. Cheap writes; slow, expensive reads.",
      "<b>Hybrid</b> (what real systems do): push for normal users, pull for celebrities (followers above a threshold), merge both at read time.",
      "Feed cache stores only <b>post ids</b> (Redis sorted set/list, capped at a few hundred); post bodies come from a post cache; media from CDN; ranking re-orders candidates by affinity, engagement and recency.",
    ],
    sections: [
      { h: "Requirements and estimation", blocks: [
        { ul: [
          "<b>Functional</b>: create post (photo + caption), follow users, view home feed (posts from followees, newest/ranked first, infinite scroll).",
          "<b>Non-functional</b>: feed load p99 &lt; 200 ms; highly available; a new post may take a few seconds to appear in followers' feeds (eventual consistency OK).",
        ] },
        { table: { head: ["Metric", "Calculation", "Result"], rows: [
          ["DAU", "assumed", "500M"],
          ["Posts/day", "10% of DAU post once", "50M/day ≈ 580/s"],
          ["Feed reads/day", "500M × 10 feed opens", "5B/day ≈ 58K/s (peak ~150K/s)"],
          ["Avg followers", "assumed", "200"],
          ["Fan-out writes (push)", "50M × 200", "10B feed inserts/day ≈ 116K/s"],
          ["Feed cache size", "500M users × 500 ids × 8 B", "2 TB → store only for active users / cap lists"],
        ] } },
        { p: "Notice the numbers: push costs ~116K small writes/s — heavy but feasible with a Redis cluster and async workers. The real problem is the tail: one celebrity with 100M followers would require <b>100M inserts for a single post</b>." },
      ] },
      { h: "Fan-out on write vs fan-out on read", blocks: [
        { table: { head: ["", "Fan-out on write (push)", "Fan-out on read (pull)"], rows: [
          ["When work happens", "At post time", "At feed-read time"],
          ["Read latency", "Very low — feed is precomputed", "High — query N followees, merge, sort"],
          ["Write cost", "O(followers) per post", "O(1) per post"],
          ["Celebrity problem", "100M inserts per post, delayed delivery", "No problem"],
          ["Wasted work", "Precomputes feeds for inactive users", "None"],
          ["Freshness", "Slight delay (async fan-out)", "Always fresh"],
          ["Good for", "Normal users (most accounts)", "Celebrities, inactive readers"],
        ] } },
        { h: "Hybrid" },
        { ul: [
          "If the author has fewer than a threshold of followers (e.g. 10K–100K) → push to followers' feed caches.",
          "If the author is a celebrity → don't fan out; store the post only in the author's timeline.",
          "At read time: take my precomputed feed + pull recent posts from the (few dozen) celebrities I follow + merge + rank.",
          "Optimisation: skip fan-out to users inactive for 30+ days; build their feed by pull when they return.",
        ] },
        { svg: `<svg viewBox="0 0 720 290" width="720" class="dg">
  <rect class="box" x="10" y="40" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="55" y="58" text-anchor="middle" dominant-baseline="middle">Author</text>
  <rect class="box-a" x="140" y="40" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="195" y="58" text-anchor="middle" dominant-baseline="middle">Post service</text>
  <line class="ln-a" x1="100" y1="58" x2="138" y2="58" marker-end="url(#dg-arr-a)"/>
  <rect class="box-a" x="300" y="10" width="120" height="30" rx="6"/>
  <text class="tx" x="360" y="25" text-anchor="middle" dominant-baseline="middle">Post DB + cache</text>
  <rect class="box-w" x="300" y="70" width="120" height="36" rx="6"/>
  <text class="tx tx-b" x="360" y="88" text-anchor="middle" dominant-baseline="middle">Fan-out queue</text>
  <line class="ln" x1="250" y1="52" x2="298" y2="28" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="64" x2="298" y2="84" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="275" y="115" text-anchor="middle">only if not celebrity</text>
  <rect class="box" x="470" y="70" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="525" y="88" text-anchor="middle" dominant-baseline="middle">Fan-out workers</text>
  <line class="ln" x1="420" y1="88" x2="468" y2="88" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="470" y="10" width="110" height="30" rx="6"/>
  <text class="tx" x="525" y="25" text-anchor="middle" dominant-baseline="middle">Follower graph</text>
  <line class="ln ln-d" x1="525" y1="70" x2="525" y2="42" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="610" y="130" width="100" height="50" rx="6"/>
  <text class="tx tx-b" x="660" y="148" text-anchor="middle" dominant-baseline="middle">Feed cache</text>
  <text class="tx-m" x="660" y="166" text-anchor="middle" dominant-baseline="middle">user → post ids</text>
  <line class="ln" x1="560" y1="106" x2="625" y2="128" marker-end="url(#dg-arr)"/>
  <rect class="box" x="10" y="200" width="90" height="36" rx="6"/>
  <text class="tx tx-b" x="55" y="218" text-anchor="middle" dominant-baseline="middle">Reader</text>
  <rect class="box-a" x="140" y="200" width="110" height="36" rx="6"/>
  <text class="tx tx-b" x="195" y="218" text-anchor="middle" dominant-baseline="middle">Feed service</text>
  <line class="ln-a" x1="100" y1="218" x2="138" y2="218" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="250" y1="212" x2="608" y2="160" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="440" y="176" text-anchor="middle">1. read precomputed ids</text>
  <rect class="box-w" x="300" y="240" width="170" height="36" rx="6"/>
  <text class="tx" x="385" y="258" text-anchor="middle" dominant-baseline="middle">Celebrity timelines (pull)</text>
  <line class="ln-a" x1="250" y1="226" x2="298" y2="254" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="480" y="226">2. merge celebrity posts</text>
  <text class="tx-m" x="480" y="244">3. hydrate from post cache</text>
  <text class="tx-m" x="480" y="262">4. rank + paginate</text>
</svg>`, caption: "Hybrid feed: normal authors' posts are pushed into followers' feed caches asynchronously; celebrity posts are pulled and merged at read time." },
      ] },
      { h: "Feed storage, pagination and ranking", blocks: [
        { ul: [
          "<b>Feed cache</b>: per user a Redis sorted set <code>feed:{userId}</code> of (score = timestamp or rank, member = postId), trimmed to the latest ~500 ids. 8-byte ids keep it small; hydration fetches post objects in a batch (<code>MGET</code>) from the post cache.",
          "<b>Posts</b>: post table sharded by <code>post_id</code> (Snowflake ids → time-sortable); user timeline index (author → post ids) for pulls and profile pages.",
          "<b>Follow graph</b>: <code>follows(follower_id, followee_id)</code> with indexes both ways (or a graph store); cached follower lists for fan-out workers.",
          "<b>Media</b>: object storage + CDN; the feed returns URLs of multiple resolutions.",
          "<b>Pagination</b>: cursor-based (<code>?cursor=&lt;last score/postId&gt;</code>), not <code>OFFSET</code>, because new posts keep arriving at the top and offsets would shift.",
          "<b>Feed cache miss</b> (inactive user returns): rebuild by pull from followees' timelines, then keep it warm.",
        ] },
        { h: "Ranking basics" },
        { ol: [
          "<b>Candidate generation</b>: the few hundred post ids from push + pull (plus, on Instagram, suggested posts).",
          "<b>Features</b> per (viewer, post): affinity with the author (likes, comments, DMs, profile visits), post engagement so far (likes/min), content type preference (reels vs photos), recency, whether already seen.",
          "<b>Score</b>: early systems used a formula (EdgeRank ≈ affinity × interaction weight × time decay); modern ones use ML models predicting P(like), P(comment), P(share), combined into one score.",
          "<b>Re-rank</b> for diversity (not 5 posts from one author in a row), remove seen posts, then paginate.",
        ] },
        { warn: "Don't jump straight to ML ranking. Get the data flow (fan-out, storage, hydration, pagination) right first; then add ranking as a stage between candidate fetch and response." },
      ] },
    ],
    practice: [
      { q: "A user with 50M followers posts. Explain what happens in push-only, pull-only and hybrid designs.", a: "Push-only: 50M feed inserts queued; followers see the post over minutes, fan-out workers and Redis are hammered. Pull-only: one write; each follower's feed request queries this author's timeline (fine for this post, but every feed read is expensive for everyone). Hybrid: celebrity → no fan-out; post stored in the author's timeline; followers' feed service pulls it at read time and merges with their pushed feed." },
      { q: "With 30M posts/day and 300 average followers, how many fan-out writes/s does push need?", a: "30M × 300 = 9B inserts/day; 9B / 86,400 ≈ 104K writes/s on average (more at peak)." },
      { q: "Why store only post ids in the feed cache, not the full post?", a: "A post is fanned out to hundreds of feeds; copying the full object would multiply memory by the follower count and make edits/deletes require updating every copy. Ids are 8 bytes; posts are fetched once from a shared post cache (batch MGET) at read time, so edits and deletions show up everywhere." },
      { q: "Why cursor pagination instead of LIMIT/OFFSET for the feed?", a: "New posts are inserted at the top while the user scrolls; with OFFSET, page 2 shifts and shows duplicates or skips posts. A cursor ('posts older than score X / id Y') is stable and also efficient (index seek instead of scanning and discarding offset rows)." },
    ],
    related: ["sd:design-news-feed", "sd:caching-strategies", "sd:redis-use-cases", "sd:message-queues-pub-sub", "sd:database-sharding", "sd:strong-vs-eventual-consistency", "sd:back-of-envelope-estimation", "sd:cdn"]
  });

  /* ---------------------------- block map ---------------------------- */
  map("d43-ev", ["hld-scaling-lb-caching", "hld-replication-sharding-cap", "hld-interview-framework"]);
  map("d44-ev", ["hld-queues-kafka", "hld-rate-limit-resilience"]);
  map("d45-ev", ["hld-url-shortener"]);
  map("d46-ev", ["hld-rate-limiter-notification", "hld-scale-project-1m"]);
  map("d47-ev", ["hld-chat-whatsapp", "hld-news-feed"]);
  map("d56-af", ["hld-interview-framework", "hld-url-shortener"]);
})();
