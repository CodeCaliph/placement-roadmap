/* tech stack: Redis — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "redis",
  title: "Redis",
  short: "Redis",
  icon: "◆",
  blurb: "With Redis on your resume, interviewers check that you know why it is fast, which data structure fits which problem, how expiry, eviction and persistence really work, and whether you can build a cache, lock or rate limiter with it correctly — including the race conditions and the failure modes (stampede, big keys, failover data loss).",
  topics: ["Basics", "Data Structures", "Expiry & Memory", "Persistence & Scaling", "Atomicity & Messaging", "Patterns & Pitfalls"],
  questions: [

    /* ───────────── Basics ───────────── */
    {
      id: "what-is-redis-why-fast",
      q: "What is Redis and why is it so fast even though it is single-threaded?",
      topic: "Basics",
      level: 1,
      top: true,
      short: "Redis is an in-memory data-structure server: keys map to strings, hashes, lists, sets, sorted sets, streams and more. It is fast because all data lives in RAM, commands run on one main thread so there are no locks or context switches, it uses an epoll-based event loop to multiplex thousands of connections, and its data structures are tuned C implementations. Since 6.0 optional I/O threads handle socket reads and writes, but command execution is still single-threaded.",
      a: [
        { p: "<b>Redis</b> (REmote DIctionary Server) is an open-source, <b>in-memory key–value store</b> where values are rich data structures, not just blobs. Clients talk to it over TCP using the simple RESP protocol. Typical latency is well under a millisecond, and one instance handles on the order of 100k+ simple ops/sec. For where it fits in an architecture, see <a href=\"#/core/sd/redis-use-cases\">Redis use cases in system design</a>." },
        { h: "Why it is fast" },
        { ul: [
          "<b>RAM, not disk</b> — a memory access is ~100 ns, an SSD read is ~100 µs. Persistence (RDB/AOF) happens in the background.",
          "<b>Single-threaded command execution</b> — one thread runs every command in turn, so there are no locks, no lock contention and no race conditions <i>inside</i> Redis. Each command is atomic for free.",
          "<b>I/O multiplexing</b> — an event loop on <code>epoll</code>/<code>kqueue</code> serves thousands of sockets from that one thread without blocking (see <a href=\"#/core/os/process-vs-thread\">process vs thread</a>).",
          "<b>Efficient encodings</b> — small hashes, sets and sorted sets are stored as compact <i>listpacks</i> or <i>intsets</i>; big ones switch to hash tables and skiplists. Most commands are O(1) or O(log N).",
          "<b>Cheap protocol</b> — RESP is trivial to parse, and clients can pipeline many commands per round trip."
        ] },
        { h: "Is it really single-threaded?" },
        { table: { head: ["Version", "What runs on other threads"], rows: [
          ["Up to 5.x", "Background threads only for closing files, <code>fsync</code> and lazy freeing (<code>UNLINK</code>, 4.0+)"],
          ["6.0+", "Optional <b>I/O threads</b> (<code>io-threads 4</code>) read/parse requests and write replies; the main thread still executes every command"],
          ["8.0", "I/O threading reworked for much better multi-core throughput; same single-threaded execution model"]
        ] } },
        { p: "The bottleneck for Redis is usually <b>network and memory</b>, not CPU — which is why a single thread is enough, and why I/O threads help on busy, many-client servers." },
        { warn: "Single-threaded means <b>one slow command blocks everyone</b>: <code>KEYS *</code>, <code>HGETALL</code> on a 1M-field hash, <code>SMEMBERS</code> on a huge set, or a long Lua script freezes all clients. Use <code>SCAN</code>/<code>HSCAN</code> and keep values small." },
        { tip: "Licensing follow-up: Redis 7.4 moved to source-available licences (RSAL/SSPL), the Linux Foundation forked it as <b>Valkey</b>, and Redis 8 (2025) added AGPLv3 as an open-source option. Mentioning this shows you follow the ecosystem." }
      ]
    },
    {
      id: "redis-vs-memcached",
      q: "Redis vs Memcached — which would you choose for caching and why?",
      topic: "Basics",
      level: 1,
      top: true,
      short: "Both are in-memory caches with sub-millisecond latency. Memcached is a simple multi-threaded string cache with no persistence or replication. Redis supports rich data structures, TTL per key, persistence, replication, clustering, Lua scripting, pub/sub and streams. I choose Redis by default because it also covers sessions, counters, leaderboards, locks and rate limits; Memcached only wins for a pure, very large, multi-core blob cache.",
      a: [
        { p: "Both keep data in RAM and are used as look-aside caches in front of a database. The difference is scope: Memcached is a <b>cache</b>; Redis is a <b>data-structure server</b> that can also be a cache." },
        { table: { head: ["Aspect", "Redis", "Memcached"], rows: [
          ["Data model", "Strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog, geo, JSON (8.0)", "Strings (opaque byte blobs) only"],
          ["Threading", "Single-threaded execution (+ I/O threads 6.0+)", "Multi-threaded — scales across cores natively"],
          ["Max value size", "512 MB per string", "1 MB per item by default (configurable)"],
          ["Persistence", "RDB snapshots, AOF log", "None — restart = empty cache"],
          ["Replication / HA", "Replicas, Sentinel, Redis Cluster", "None built in; client-side sharding"],
          ["Eviction", "8 policies (LRU, LFU, TTL, random…)", "LRU per slab class"],
          ["Atomic ops", "INCR, transactions, Lua scripts", "incr/decr, CAS"],
          ["Messaging", "Pub/Sub, Streams", "No"]
        ] } },
        { p: "<b>Choose Redis</b> when you need anything beyond get/set: counters, sorted leaderboards, sessions that should survive a restart, distributed locks, rate limiters, queues, or high availability." },
        { p: "<b>Choose Memcached</b> for a huge, simple HTML/object cache where multi-core throughput on a single node matters more than features, and losing the cache on restart is fine." },
        { tip: "Good answer shape: 'Redis by default, because one technology covers caching plus sessions, rate limiting and leaderboards — fewer moving parts. I'd only pick Memcached for a pure blob cache that needs to use many cores per node.'" }
      ]
    },

    /* ───────────── Data Structures ───────────── */
    {
      id: "redis-core-data-types",
      q: "What are Redis strings, hashes, lists and sets, their main commands, and a use case for each?",
      topic: "Data Structures",
      level: 1,
      top: true,
      short: "Strings hold text, numbers or binary up to 512 MB and support SET/GET, INCR and SET with EX/NX — used for caching and counters. Hashes are field-value maps (HSET, HGET, HINCRBY) for objects like a user profile. Lists are ordered sequences with O(1) push/pop at both ends (LPUSH, RPOP, BLPOP) for queues and recent-items feeds. Sets are unordered unique members (SADD, SISMEMBER, SINTER) for tags, unique visitors and mutual friends.",
      a: [
        { p: "Every Redis key has exactly one type. Picking the right type is the most common Redis design question." },
        { table: { head: ["Type", "Key commands", "Complexity", "Typical use"], rows: [
          ["<b>String</b>", "<code>SET k v EX 60 NX</code>, <code>GET</code>, <code>INCR</code>, <code>INCRBY</code>, <code>MGET</code>, <code>SETRANGE</code>", "O(1)", "Cached JSON/HTML, counters, feature flags, simple locks"],
          ["<b>Hash</b>", "<code>HSET</code>, <code>HGET</code>, <code>HMGET</code>, <code>HINCRBY</code>, <code>HDEL</code>, <code>HGETALL</code>", "O(1) per field", "Objects: <code>user:42</code> → name, email, plan; shopping carts"],
          ["<b>List</b>", "<code>LPUSH</code>/<code>RPUSH</code>, <code>LPOP</code>/<code>RPOP</code>, <code>BLPOP</code>, <code>LRANGE</code>, <code>LTRIM</code>", "O(1) at ends, O(N) in middle", "Job queues, latest-N activity feed, chat history"],
          ["<b>Set</b>", "<code>SADD</code>, <code>SREM</code>, <code>SISMEMBER</code>, <code>SCARD</code>, <code>SINTER</code>, <code>SUNION</code>", "O(1) add/check", "Tags, unique visitors per day, mutual friends, de-duplication"]
        ] } },
        { code: `# String: cache + counter
SET page:home "<html>..." EX 300
INCR views:article:7            # (integer) 1  -- atomic, no read-modify-write race
# Hash: an object with partial updates
HSET user:42 name "Asha" plan "free" logins 0
HINCRBY user:42 logins 1        # (integer) 1
HGET user:42 plan               # "free"
# List: latest 100 events, newest first
LPUSH feed:42 "liked post 9"
LTRIM feed:42 0 99              # cap the list
LRANGE feed:42 0 9              # 10 newest
# List as a queue: worker blocks until a job arrives
RPUSH jobs "email:1001"
BLPOP jobs 0                    # 1) "jobs" 2) "email:1001"
# Set: mutual friends
SADD friends:a b c d
SADD friends:b a c d e
SINTER friends:a friends:b      # 1) "c" 2) "d"`, lang: "bash", title: "redis-cli" },
        { p: "<b>Internals worth knowing</b>: small hashes, lists and sets are stored as a compact <b>listpack</b> (contiguous memory, Redis 7+; previously ziplist); a set of only integers uses an <b>intset</b>. Once they cross thresholds such as <code>hash-max-listpack-entries 128</code> or a value bigger than 64 bytes, Redis converts them to a real hash table. Lists are a <b>quicklist</b> — a linked list of listpacks." },
        { warn: "A Redis list is not a reliable queue: if a worker pops a job and crashes, the job is gone. Use <code>LMOVE</code> into a processing list (the reliable-queue pattern) or, better, a <b>Stream</b> with consumer groups and acknowledgements." },
        { tip: "Follow-up 'how do you count unique visitors for a billion events?' — a Set is exact but costs memory per member; a <b>HyperLogLog</b> uses 12 KB with ~0.81% error." }
      ]
    },
    {
      id: "sorted-sets-leaderboard",
      q: "How would you build a real-time leaderboard with Redis sorted sets, and how are sorted sets implemented?",
      topic: "Data Structures",
      level: 2,
      top: true,
      short: "A sorted set (ZSET) stores unique members each with a numeric score, kept ordered by score. ZADD or ZINCRBY updates a player's score in O(log N), ZREVRANGE ... WITHSCORES gets the top K, and ZREVRANK gives a player's rank in O(log N). Internally a large ZSET is a skiplist (for ordered range and rank queries) plus a hash table (for O(1) member-to-score lookup); small ones use a listpack.",
      a: [
        { p: "A <b>sorted set</b> is a set of unique string members where each member has a floating-point <b>score</b>. Members are always kept ordered by (score, member). That makes leaderboards, priority queues, time-ordered indexes and sliding-window rate limiters natural." },
        { code: `ZADD lb:2026-10 1500 "asha" 1720 "ravi" 980 "neha"
ZINCRBY lb:2026-10 300 "neha"          # "1280"  -- atomic score update
ZREVRANGE lb:2026-10 0 2 WITHSCORES    # top 3, highest first
# 1) "ravi"  2) "1720"  3) "asha"  4) "1500"  5) "neha"  6) "1280"
ZREVRANK lb:2026-10 "asha"             # (integer) 1   -- 0-based rank
ZSCORE lb:2026-10 "asha"               # "1500"
ZCOUNT lb:2026-10 1000 +inf            # players with score >= 1000
ZRANGE lb:2026-10 0 2 REV WITHSCORES   # Redis 6.2+ unified form of ZREVRANGE`, lang: "bash", title: "Leaderboard in redis-cli" },
        { code: `import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def add_points(board: str, player: str, pts: int) -> float:
    return r.zincrby(board, pts, player)

def top(board: str, k: int = 10):
    return r.zrevrange(board, 0, k - 1, withscores=True)   # [("ravi", 1720.0), ...]

def rank_of(board: str, player: str):
    rank = r.zrevrank(board, player)                         # None if absent
    return None if rank is None else rank + 1                # 1-based for the UI`, lang: "python", run: false, title: "redis-py (needs a running server)" },
        { table: { head: ["Operation", "Command", "Cost"], rows: [
          ["Add / update score", "<code>ZADD</code>, <code>ZINCRBY</code>", "O(log N)"],
          ["Top K", "<code>ZREVRANGE 0 K-1</code>", "O(log N + K)"],
          ["Rank of a player", "<code>ZREVRANK</code>", "O(log N)"],
          ["Score of a player", "<code>ZSCORE</code>", "O(1) (hash lookup)"],
          ["Remove old entries by score", "<code>ZREMRANGEBYSCORE</code>", "O(log N + M)"]
        ] } },
        { p: "<b>Implementation</b>: above 128 members (or members longer than 64 bytes) a ZSET is a <b>skiplist + hash table</b>. The skiplist is a probabilistic multi-level linked list giving O(log N) insert, delete and range scans, and each node stores a span so rank is O(log N) too. The hash table maps member → score for O(1) <code>ZSCORE</code>. Redis chose a skiplist over a balanced tree because it is simpler, range scans are just following forward pointers, and it performs as well in practice." },
        { warn: "Ties: members with equal scores are ordered lexicographically, not by who reached it first. To break ties by time, encode it in the score, e.g. <code>score = points * 1e10 + (MAX_TS - ts)</code> — but remember scores are doubles, exact only up to 2<sup>53</sup>." },
        { tip: "For daily/weekly boards use one key per period (<code>lb:2026-10-03</code>) with a TTL, and combine periods with <code>ZUNIONSTORE</code>." }
      ]
    },
    {
      id: "bitmaps-hyperloglog-geo",
      q: "What are bitmaps, HyperLogLog and geospatial indexes in Redis and when would you use them?",
      topic: "Data Structures",
      level: 2,
      top: false,
      short: "Bitmaps are strings treated as bit arrays: SETBIT/GETBIT/BITCOUNT give one bit per user ID, ideal for daily-active flags (100M users is about 12 MB). HyperLogLog (PFADD, PFCOUNT) estimates the number of unique items using at most 12 KB with about 0.81% standard error. Geo commands (GEOADD, GEOSEARCH) store longitude and latitude in a sorted set via geohash to find nearby points by radius or box.",
      a: [
        { p: "These are <b>space-efficient</b> structures built on top of strings and sorted sets. Interviewers like them because they show you think about memory at scale." },
        { table: { head: ["Structure", "Commands", "Memory", "Use case"], rows: [
          ["<b>Bitmap</b>", "<code>SETBIT</code>, <code>GETBIT</code>, <code>BITCOUNT</code>, <code>BITOP AND/OR</code>, <code>BITPOS</code>", "1 bit per ID (max offset 2<sup>32</sup>-1)", "Daily active users, attendance, feature flags per user"],
          ["<b>HyperLogLog</b>", "<code>PFADD</code>, <code>PFCOUNT</code>, <code>PFMERGE</code>", "≤ 12 KB per key, any cardinality", "Unique visitors / searches when ~1% error is fine"],
          ["<b>Geo</b>", "<code>GEOADD</code>, <code>GEOSEARCH</code>, <code>GEODIST</code>, <code>GEOPOS</code>", "A sorted set (52-bit geohash score)", "Nearby drivers, stores within 5 km"]
        ] } },
        { code: `# Bitmap: did user 1042 log in today? (user id = bit offset)
SETBIT active:2026-10-03 1042 1
GETBIT active:2026-10-03 1042             # (integer) 1
BITCOUNT active:2026-10-03                # DAU
BITOP AND active:both active:2026-10-02 active:2026-10-03   # active on both days
# HyperLogLog: approximate unique visitors
PFADD uv:home u1 u2 u3 u2
PFCOUNT uv:home                           # (integer) 3
PFMERGE uv:week uv:mon uv:tue uv:wed      # union of days, still 12 KB
# Geo: nearest drivers
GEOADD drivers 77.5946 12.9716 "d1" 77.6100 12.9300 "d2"   # lon lat member
GEOSEARCH drivers FROMLONLAT 77.60 12.97 BYRADIUS 5 km ASC WITHDIST`, lang: "bash", title: "redis-cli" },
        { p: "<b>Bitmap maths</b>: 100 million users × 1 bit = 12.5 MB per day. A Set of the same IDs would take gigabytes. The catch: IDs must be dense integers — a sparse ID like 4,000,000,000 allocates a ~500 MB string." },
        { p: "<b>HyperLogLog</b> hashes each element and tracks, across 16384 registers, the longest run of leading zeros seen. Rare long runs imply many distinct elements. You get the count but cannot list or test membership — it is an estimator, not a set." },
        { warn: "GEOADD takes <b>longitude first, then latitude</b>. Swapping them is the classic bug (and Redis rejects latitudes beyond ±85.05°)." },
        { tip: "If asked 'has this user already seen this item?' at huge scale, mention a <b>Bloom filter</b> (<code>BF.ADD</code>/<code>BF.EXISTS</code>), part of Redis 8 (earlier the RedisBloom module): tiny memory, no false negatives, small false-positive rate." }
      ]
    },
    {
      id: "string-vs-hash-for-objects",
      q: "Should you store an object such as a user session in Redis as a JSON string or as a hash?",
      topic: "Data Structures",
      level: 2,
      top: false,
      short: "A JSON string is simplest: one GET/SET, supports nesting, and the whole object shares one TTL — good when you always read and write the whole thing. A hash stores fields separately, so you can read or update one field (HGET, HINCRBY) without rewriting the object and without read-modify-write races, and small hashes are very memory-compact. Hashes are flat, though, and before Redis 7.4 TTLs applied only to the whole key. For deep documents with field updates, use the JSON type in Redis 8.",
      a: [
        { table: { head: ["", "JSON string", "Hash", "JSON type (Redis 8 / RedisJSON)"], rows: [
          ["Read whole object", "<code>GET</code> + parse", "<code>HGETALL</code>", "<code>JSON.GET key $</code>"],
          ["Update one field", "GET → modify → SET (race unless WATCH/Lua)", "<code>HSET</code> / <code>HINCRBY</code> — atomic", "<code>JSON.SET key $.plan '\"pro\"'</code>"],
          ["Nesting", "Yes", "No — flat field → string", "Yes"],
          ["Expiry", "Whole key", "Whole key; per field via <code>HEXPIRE</code> (7.4+)", "Whole key"],
          ["Memory", "One string", "Very compact while small (listpack)", "Tree structure, more overhead"]
        ] } },
        { code: `# Session as a hash: partial updates without rewriting the session
HSET sess:9f2c user_id 42 role "admin" cart_items 0
EXPIRE sess:9f2c 1800                      # 30-minute session
HINCRBY sess:9f2c cart_items 1             # atomic, no read-modify-write
HGET sess:9f2c role                        # "admin"
EXPIRE sess:9f2c 1800                      # sliding expiry: reset on each request

# Same thing as a JSON string: must rewrite the whole value to change a field
SET sess:9f2c '{"user_id":42,"role":"admin","cart_items":0}' EX 1800`, lang: "bash", title: "redis-cli" },
        { code: `import json
import redis

r = redis.Redis(decode_responses=True)

def touch_session(sid: str, ttl: int = 1800) -> dict | None:
    key = f"sess:{sid}"
    with r.pipeline() as p:                # MULTI: read + refresh TTL together
        p.hgetall(key)
        p.expire(key, ttl)
        data, _ = p.execute()
    return data or None                    # {} means missing/expired

def cache_product(pid: int, product: dict) -> None:
    r.set(f"product:{pid}", json.dumps(product), ex=600)   # read-mostly blob: JSON string`, lang: "python", run: false, title: "redis-py" },
        { p: "<b>Memory trick</b> (Instagram's well-known write-up): millions of tiny top-level keys each carry per-key overhead. Bucketing them into hashes — <code>HSET media:1155 1155315 939</code> for ID 1155315, bucket = id / 1000 — keeps each hash small enough for the compact listpack encoding and cut their memory several-fold." },
        { warn: "Hash values are strings: <code>HGETALL</code> returns <code>{\"user_id\": \"42\"}</code>, not an int — convert types in your code. And numbers in JSON strings can't be incremented atomically at all without Lua." },
        { tip: "Key naming: <code>object:id[:sub]</code> with colons (<code>user:42:settings</code>), a version prefix when the schema changes, and never unbounded user input in key names." }
      ]
    },
    {
      id: "streams-vs-pubsub",
      q: "What is the difference between Redis Pub/Sub and Redis Streams?",
      topic: "Data Structures",
      level: 2,
      top: true,
      short: "Pub/Sub is fire-and-forget broadcasting: PUBLISH pushes a message to whoever is subscribed right now; nothing is stored, so offline or slow subscribers lose messages. Streams (Redis 5+) are an append-only log stored in Redis: XADD appends entries with IDs, consumers read history, and consumer groups (XREADGROUP, XACK) split work among workers with acknowledgements and redelivery. Use Pub/Sub for live notifications, Streams for durable event processing.",
      a: [
        { p: "<b>Pub/Sub</b> is a message <i>bus</i>; <b>Streams</b> are a message <i>log</i> — a mini-Kafka inside Redis. For the general queue vs pub/sub theory see <a href=\"#/core/sd/message-queues-pub-sub\">message queues & pub/sub</a>." },
        { table: { head: ["Aspect", "Pub/Sub", "Streams"], rows: [
          ["Storage", "None — delivered and forgotten", "Persisted in a key (RDB/AOF), trimmed by <code>MAXLEN</code>/<code>MINID</code>"],
          ["Delivery", "At-most-once, only to connected subscribers", "At-least-once with consumer groups + <code>XACK</code>"],
          ["Replay / history", "No", "Yes — read from any ID (<code>XRANGE</code>, <code>XREAD</code>)"],
          ["Work sharing", "Every subscriber gets every message", "Consumer group: each entry goes to one consumer in the group"],
          ["Crash handling", "Message lost", "Unacked entries sit in the Pending Entries List; <code>XAUTOCLAIM</code> reassigns them"],
          ["Use for", "Live chat fan-out, cache-invalidation broadcasts, WebSocket fan-out", "Order events, background jobs, activity pipelines"]
        ] } },
        { code: `# --- Pub/Sub ---
SUBSCRIBE chat:room1                 # terminal 1 (blocks, receives only new messages)
PUBLISH chat:room1 "hello"           # terminal 2 -> (integer) 1 subscriber received it
# --- Streams ---
XADD orders * user 42 total 499      # "1759478400000-0"  (ms timestamp - sequence)
XGROUP CREATE orders billing $ MKSTREAM
XREADGROUP GROUP billing w1 COUNT 10 BLOCK 5000 STREAMS orders >
XACK orders billing 1759478400000-0  # done; removed from pending list
XPENDING orders billing              # entries delivered but not acked
XAUTOCLAIM orders billing w2 60000 0-0   # take over entries idle > 60 s (Redis 6.2+)
XADD orders MAXLEN ~ 100000 * user 7 total 99   # cap stream length (approximate trim)`, lang: "bash", title: "redis-cli" },
        { p: "In <code>XREADGROUP</code>, the special ID <code>&gt;</code> means 'entries never delivered to this group'; passing <code>0</code> instead re-reads your own pending (unacked) entries after a restart." },
        { warn: "A slow Pub/Sub subscriber does not slow publishers — Redis buffers its output and <b>disconnects</b> it once <code>client-output-buffer-limit pubsub</code> (default 32 MB hard / 8 MB for 60 s) is hit. Messages are then simply lost." },
        { tip: "Follow-up 'Streams or Kafka?' — Streams are great for moderate volume when Redis is already in the stack; Kafka wins for very high throughput, long retention on disk, and partition-level scaling. Redis 7.0 also added <b>sharded Pub/Sub</b> (<code>SPUBLISH</code>) so Pub/Sub scales in a cluster." }
      ]
    },

    /* ───────────── Expiry & Memory ───────────── */
    {
      id: "ttl-and-expiry",
      q: "How do TTLs work in Redis, and how does Redis actually delete expired keys?",
      topic: "Expiry & Memory",
      level: 2,
      top: true,
      short: "You set a TTL with EXPIRE/PEXPIRE or SET key value EX seconds; TTL shows the remaining time (-1 = no expiry, -2 = key missing). Redis stores the absolute expiry time and deletes expired keys in two ways: lazily, when a client touches the key, and actively, by a background cycle that about ten times a second samples random keys that have a TTL and deletes the expired ones, repeating while more than 25% of a sample was expired.",
      a: [
        { code: `SET otp:9876 "482913" EX 300        # value + 5-minute TTL in one atomic command
TTL otp:9876                        # (integer) 300
EXPIRE session:abc 1800             # set / reset TTL on an existing key
EXPIRE session:abc 1800 NX          # Redis 7.0+: only if it has no TTL yet (also XX, GT, LT)
PERSIST session:abc                 # remove TTL
TTL nope                            # (integer) -2  -> key does not exist
SET counter 5
TTL counter                         # (integer) -1  -> exists, no expiry
SET session:abc "new"               # plain SET clears the TTL!  use SET ... KEEPTTL (6.0+)
HEXPIRE cart:42 600 FIELDS 1 coupon # Redis 7.4+: TTL on a single hash field`, lang: "bash", title: "redis-cli" },
        { h: "How expired keys are removed" },
        { ol: [
          "<b>Lazy (passive) expiry</b> — on every access Redis checks the key's expiry timestamp; if it is in the past the key is deleted and the command behaves as if it never existed.",
          "<b>Active expiry</b> — keys nobody reads would otherwise live forever, so a periodic job (driven by <code>hz</code>, default 10/s) samples ~20 random keys from the set of keys with a TTL, deletes the expired ones and repeats while more than 25% of the sample was expired, within a CPU time budget. So at most ~25% of memory is held by already-expired keys."
        ] },
        { code: `import random
random.seed(42)

class MiniRedis:
    """Toy model of Redis expiry: lazy check on access + periodic active sampling."""
    def __init__(self):
        self.data, self.expires = {}, {}       # Redis also keeps TTLs in a separate dict
        self.now = 0.0                         # fake clock (seconds)

    def set(self, key, val, ex=None):
        self.data[key] = val
        if ex is not None:
            self.expires[key] = self.now + ex
        else:
            self.expires.pop(key, None)

    def _expired(self, key):
        return key in self.expires and self.expires[key] <= self.now

    def get(self, key):                        # LAZY expiry
        if self._expired(key):
            del self.data[key], self.expires[key]
            return None
        return self.data.get(key)

    def active_expire_cycle(self, sample=20):  # ACTIVE expiry (runs ~10x/sec in Redis)
        rounds = 0
        while self.expires:
            rounds += 1
            keys = random.sample(list(self.expires), min(sample, len(self.expires)))
            dead = [k for k in keys if self._expired(k)]
            for k in dead:
                del self.data[k], self.expires[k]
            if len(dead) <= sample * 0.25:     # <=25% expired: stop, try next tick
                break
        return rounds

r = MiniRedis()
for i in range(1000):
    r.set(f"session:{i}", "x", ex=10 if i < 900 else 3600)   # 900 short-lived keys
r.set("config", "v1")                                       # no TTL, never sampled

r.now = 11                                    # 900 keys are now logically expired
print("get session:5 ->", r.get("session:5"))  # lazy delete on access
print("keys in memory before cycle:", len(r.data))
rounds = r.active_expire_cycle()
print("sampling rounds:", rounds, "| keys in memory after cycle:", len(r.data))`, lang: "python", title: "Simulation of lazy + active expiry" },
        { code: `get session:5 -> None
keys in memory before cycle: 1000
sampling rounds: 57 | keys in memory after cycle: 157`, lang: "text", title: "Output — some expired keys survive until a later cycle or an access" },
        { p: "<b>Replicas</b> do not expire keys on their own clock: the primary sends a <code>DEL</code> through the replication stream when a key expires, so replicas stay consistent (they still hide logically-expired keys on reads)." },
        { warn: "<code>SET key value</code> followed by <code>EXPIRE key 60</code> is two commands — if the client dies between them the key never expires. Always use <code>SET key value EX 60</code>. And a plain <code>SET</code> on an existing key <b>removes</b> its TTL." },
        { tip: "Add <b>random jitter</b> to TTLs (e.g. 300 ± 30 s) for keys written together so they don't all expire in the same second — the fix for a cache avalanche." }
      ]
    },
    {
      id: "eviction-policies",
      q: "What happens when Redis runs out of memory, and how do its eviction policies work?",
      topic: "Expiry & Memory",
      level: 2,
      top: true,
      short: "When used memory reaches maxmemory, Redis applies maxmemory-policy. The default noeviction rejects writes with an OOM error. allkeys-lru / allkeys-lfu / allkeys-random evict from all keys; volatile-lru / volatile-lfu / volatile-random / volatile-ttl evict only keys that have a TTL. LRU and LFU are approximated by sampling a few keys (maxmemory-samples, default 5) instead of keeping an exact list. For a pure cache use allkeys-lru or allkeys-lfu.",
      a: [
        { p: "Set a ceiling with <code>maxmemory</code>; when a write would exceed it, Redis evicts keys according to <code>maxmemory-policy</code> <i>before</i> executing the command. General LRU/LFU theory is in <a href=\"#/core/sd/cache-eviction-policies\">cache eviction policies</a>; here is the Redis-specific part." },
        { table: { head: ["Policy", "Evicts from", "Picks"], rows: [
          ["<code>noeviction</code> (default)", "—", "Nothing; writes fail with <code>OOM command not allowed</code>, reads still work"],
          ["<code>allkeys-lru</code>", "All keys", "Least recently used (approx.)"],
          ["<code>allkeys-lfu</code> (4.0+)", "All keys", "Least frequently used (approx., decaying counter)"],
          ["<code>allkeys-random</code>", "All keys", "Random"],
          ["<code>volatile-lru</code>", "Keys with a TTL", "Least recently used"],
          ["<code>volatile-lfu</code>", "Keys with a TTL", "Least frequently used"],
          ["<code>volatile-random</code>", "Keys with a TTL", "Random"],
          ["<code>volatile-ttl</code>", "Keys with a TTL", "Shortest remaining TTL"]
        ] } },
        { code: `CONFIG SET maxmemory 2gb
CONFIG SET maxmemory-policy allkeys-lfu
INFO memory          # used_memory_human, maxmemory_human, mem_fragmentation_ratio
INFO stats           # evicted_keys, expired_keys, keyspace_hits, keyspace_misses
OBJECT FREQ some:key # LFU counter (only with an LFU policy)`, lang: "bash", title: "redis-cli" },
        { h: "Approximated LRU and LFU" },
        { p: "Redis does not keep a linked list of all keys (that would cost two pointers per key). Each key carries a 24-bit field: a last-access clock for LRU, or for LFU an 8-bit <b>logarithmic</b> counter plus a decay timestamp. On eviction Redis samples <code>maxmemory-samples</code> keys (default 5), merges them into a small pool of best candidates and evicts the worst. With 10 samples it is very close to true LRU." },
        { code: `import random
random.seed(7)
LFU_INIT_VAL, LOG_FACTOR = 5, 10     # Redis defaults: new keys start at 5, lfu-log-factor 10

def incr(counter):
    """Redis's probabilistic LFU increment: harder to bump as the counter grows."""
    if counter == 255:
        return 255
    base = max(counter - LFU_INIT_VAL, 0)
    p = 1.0 / (base * LOG_FACTOR + 1)
    return counter + 1 if random.random() < p else counter

for hits in [100, 1_000, 10_000, 100_000, 1_000_000]:
    c = LFU_INIT_VAL
    for _ in range(hits):
        c = incr(c)
    print(f"{hits:>9} hits -> counter {c}")`, lang: "python", title: "Why 8 bits are enough for LFU: a Morris-style log counter" },
        { code: `      100 hits -> counter 9
     1000 hits -> counter 23
    10000 hits -> counter 52
   100000 hits -> counter 145
  1000000 hits -> counter 255`, lang: "text" },
        { p: "The counter also <b>decays</b> (by default by 1 per minute idle, <code>lfu-decay-time 1</code>), so a key that was hot yesterday can still be evicted today." },
        { warn: "With a <code>volatile-*</code> policy and keys that have no TTL, Redis has nothing to evict and behaves like <code>noeviction</code> — writes start failing. Mixing a cache and durable data (sessions, queues) in one instance is the root problem; use separate instances or databases with different policies." },
        { tip: "LRU vs LFU: LFU resists <b>scan pollution</b> — a one-off batch job reading a million cold keys makes them 'recently used' and pushes hot keys out under LRU, but barely moves their LFU counters." }
      ]
    },
    {
      id: "big-keys-hot-keys",
      q: "What are big keys and hot keys in Redis, why are they dangerous, and how do you find and fix them?",
      topic: "Expiry & Memory",
      level: 3,
      top: false,
      short: "A big key is one with a huge value or millions of elements; reading or deleting it blocks the single thread, causes latency spikes, uneven cluster memory and slow migrations. A hot key receives a disproportionate share of traffic and overloads the one node or shard that owns it. Find them with redis-cli --bigkeys / --memkeys / --hotkeys, MEMORY USAGE and SLOWLOG. Fix big keys by splitting them and deleting with UNLINK; fix hot keys with a local in-process cache, read replicas or by replicating the key under several suffixes.",
      a: [
        { table: { head: ["", "Big key", "Hot key"], rows: [
          ["What", "A 50 MB string, or a hash/set/zset/list with millions of members", "One key gets e.g. 50% of all requests (celebrity profile, flash-sale item)"],
          ["Why it hurts", "O(N) commands (<code>HGETALL</code>, <code>DEL</code>, <code>SMEMBERS</code>) block every other client; network saturation; uneven shards; slow failover and resharding", "All traffic lands on one shard's single thread — adding nodes does not help"],
          ["Detect", "<code>redis-cli --bigkeys</code>, <code>--memkeys</code>, <code>MEMORY USAGE key</code>, <code>SLOWLOG GET</code>", "<code>redis-cli --hotkeys</code> (needs an LFU policy), <code>OBJECT FREQ</code>, client-side metrics"],
          ["Fix", "Split by hash: <code>user:42:followers:{0..63}</code>; paginate with <code>HSCAN</code>/<code>ZRANGE</code>; delete with <code>UNLINK</code>", "Local L1 cache with a short TTL; read from replicas; copy key to <code>item:7:{1..N}</code> and read a random copy"]
        ] } },
        { code: `redis-cli --bigkeys          # biggest key per type (uses SCAN, safe in production)
redis-cli --memkeys          # biggest keys by memory
redis-cli --hotkeys          # needs maxmemory-policy *-lfu
redis-cli MEMORY USAGE user:42:followers
redis-cli SLOWLOG GET 10     # commands slower than slowlog-log-slower-than (10 ms default)
redis-cli --latency          # live latency sampling`, lang: "bash", title: "Finding them" },
        { h: "KEYS vs SCAN, DEL vs UNLINK" },
        { code: `KEYS user:*                  # O(N) over the whole keyspace, blocks: never in production
SCAN 0 MATCH user:* COUNT 1000
# 1) "1792"            <- next cursor; keep calling until it returns "0"
# 2) 1) "user:17" ...
DEL big:set                  # frees memory on the main thread: can block for seconds
UNLINK big:set               # 4.0+: removes key now, frees memory in a background thread`, lang: "bash" },
        { p: "<code>SCAN</code> is cursor-based and non-blocking; it can return a key more than once and does not guarantee a snapshot, so make your processing idempotent. Since Redis 4.0 you can also turn on <code>lazyfree-lazy-eviction</code>, <code>lazyfree-lazy-expire</code> and <code>lazyfree-lazy-user-del</code> so evictions, expiries and even <code>DEL</code> free memory in the background." },
        { warn: "A big key on a cluster is also a <b>migration</b> problem: a slot is moved key by key with <code>MIGRATE</code>, and moving one huge key blocks both nodes." },
        { tip: "Rule of thumb many teams use: keep strings under ~10 KB and collections under ~10k elements, or design them to be read in pages." }
      ]
    },

    /* ───────────── Persistence & Scaling ───────────── */
    {
      id: "persistence-rdb-vs-aof",
      q: "How does Redis persist data — RDB vs AOF, and what do the fsync options mean?",
      topic: "Persistence & Scaling",
      level: 2,
      top: true,
      short: "RDB takes point-in-time binary snapshots: BGSAVE forks a child that writes the whole dataset using copy-on-write; it is compact and fast to restart from, but you lose everything since the last snapshot. AOF appends every write command to a log; with appendfsync everysec (the default) you lose at most about a second, with always almost nothing but slower writes. AOF is periodically rewritten to stay small. Production usually enables both: AOF for durability, RDB for backups and fast restarts.",
      a: [
        { p: "Redis is in-memory, but it can write data to disk so it survives a restart. There are two mechanisms, and they can be combined." },
        { table: { head: ["Aspect", "RDB (snapshot)", "AOF (append-only file)"], rows: [
          ["What is written", "Compact binary dump of all data at a moment", "Every write command, appended as it happens"],
          ["How", "<code>BGSAVE</code>: <code>fork()</code>; child writes the snapshot while the parent keeps serving (copy-on-write)", "Main thread appends to a buffer; <code>fsync</code> per policy"],
          ["Data loss on crash", "Everything since the last snapshot (minutes)", "≤ ~1 s with <code>everysec</code>; ~0 with <code>always</code>"],
          ["Restart speed", "Fast — load one binary file", "Slower — replay commands (faster with RDB preamble)"],
          ["File size", "Small", "Larger; shrunk by rewrite"],
          ["Good for", "Backups, disaster recovery, replica full sync", "Durability"]
        ] } },
        { code: `# redis.conf
save 3600 1 300 100 60 10000   # RDB: snapshot if >=1 change in 1h, >=100 in 5min, >=10000 in 1min
appendonly yes                 # enable AOF (default: no)
appendfsync everysec           # always | everysec (default) | no
aof-use-rdb-preamble yes       # rewritten AOF starts with an RDB snapshot (default yes)
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb`, lang: "text", title: "redis.conf" },
        { table: { head: ["appendfsync", "Behaviour", "Max loss", "Speed"], rows: [
          ["<code>always</code>", "fsync after every write batch", "~ nothing", "Slowest (disk-bound)"],
          ["<code>everysec</code>", "Background thread fsyncs once a second", "~1 s of writes", "Near RDB speed — the default"],
          ["<code>no</code>", "Leave it to the OS (Linux flushes ~every 30 s)", "Up to ~30 s", "Fastest"]
        ] } },
        { p: "<b>AOF rewrite</b> (<code>BGREWRITEAOF</code>, automatic by size): a forked child writes the shortest command set that recreates the current data (100 <code>INCR</code>s become one <code>SET</code>). Since Redis 7.0 AOF is <b>multi-part</b>: a base file plus incremental files tracked by a manifest in <code>appenddirname</code>." },
        { warn: "<code>fork()</code> on a 20 GB instance is not free: page-table copying can stall the server for tens of milliseconds, and heavy writes during a snapshot can nearly double memory via copy-on-write. Leave memory headroom and disable Linux transparent huge pages (see <a href=\"#/core/os/copy-on-write\">copy-on-write</a>)." },
        { tip: "If Redis is <i>only</i> a cache that can be rebuilt from the DB, you may disable persistence entirely (<code>save \"\"</code>, <code>appendonly no</code>) — just say why." }
      ]
    },
    {
      id: "replication-and-sentinel",
      q: "How does Redis replication work, and what does Redis Sentinel do?",
      topic: "Persistence & Scaling",
      level: 2,
      top: true,
      short: "A replica connects to the primary with REPLICAOF; the first time it gets a full RDB snapshot, then a continuous stream of write commands. Replication is asynchronous, so a failover can lose the last few writes. After short disconnects a replica resumes with PSYNC from the replication backlog instead of a full resync. Sentinel is a separate set of processes (at least three) that monitor the primary, agree it is down by quorum, promote a replica, reconfigure the others and tell clients the new primary's address.",
      a: [
        { svg: `<svg viewBox="0 0 640 230" width="640" class="dg">
  <rect class="box-a" x="250" y="20" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="320" y="42" text-anchor="middle" dominant-baseline="middle">Primary (R/W)</text>
  <rect class="box-g" x="110" y="150" width="130" height="40" rx="6"/>
  <text class="tx" x="175" y="170" text-anchor="middle" dominant-baseline="middle">Replica 1 (RO)</text>
  <rect class="box-g" x="400" y="150" width="130" height="40" rx="6"/>
  <text class="tx" x="465" y="170" text-anchor="middle" dominant-baseline="middle">Replica 2 (RO)</text>
  <line class="ln-a" x1="290" y1="64" x2="190" y2="148" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="350" y1="64" x2="450" y2="148" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="320" y="110" text-anchor="middle">async command stream</text>
  <rect class="box-p" x="20" y="20" width="110" height="34" rx="6"/>
  <text class="tx-s" x="75" y="37" text-anchor="middle" dominant-baseline="middle">Sentinel 1</text>
  <rect class="box-p" x="20" y="70" width="110" height="34" rx="6"/>
  <text class="tx-s" x="75" y="87" text-anchor="middle" dominant-baseline="middle">Sentinel 2</text>
  <rect class="box-p" x="510" y="20" width="110" height="34" rx="6"/>
  <text class="tx-s" x="565" y="37" text-anchor="middle" dominant-baseline="middle">Sentinel 3</text>
  <line class="ln ln-d" x1="130" y1="37" x2="248" y2="40"/>
  <line class="ln ln-d" x1="130" y1="87" x2="248" y2="52"/>
  <line class="ln ln-d" x1="510" y1="37" x2="392" y2="40"/>
  <text class="tx-m" x="320" y="215" text-anchor="middle">Sentinels ping every node; on failure they vote and promote a replica</text>
</svg>`, caption: "One primary, two replicas, three Sentinels watching" },
        { h: "Replication" },
        { ol: [
          "Replica runs <code>REPLICAOF 10.0.0.1 6379</code> and sends <code>PSYNC &lt;replid&gt; &lt;offset&gt;</code>.",
          "<b>Full sync</b> (first time or too far behind): primary does a <code>BGSAVE</code>, streams the RDB, buffers writes meanwhile, then sends them.",
          "<b>Steady state</b>: every write command is forwarded to replicas asynchronously; each side tracks a replication offset.",
          "<b>Partial resync</b>: after a brief network blip the replica asks for the bytes after its offset, served from the circular <code>repl-backlog-size</code> buffer (default 1 MB — usually worth raising)."
        ] },
        { p: "Replicas are read-only by default and can serve reads (scale reads, but reads may be slightly stale). For general replication theory see <a href=\"#/core/sd/database-replication\">database replication</a>." },
        { h: "Sentinel" },
        { ul: [
          "<b>Monitoring</b>: each Sentinel pings the primary and replicas. If one Sentinel gets no valid reply for <code>down-after-milliseconds</code>, it marks the primary <i>subjectively down</i> (SDOWN).",
          "<b>Agreement</b>: when <code>quorum</code> Sentinels agree, it becomes <i>objectively down</i> (ODOWN). A leader Sentinel is then elected, which needs a <b>majority</b> of all Sentinels.",
          "<b>Failover</b>: the leader promotes the best replica (priority, replication offset), points the others at it, and reconfigures the old primary as a replica when it returns.",
          "<b>Service discovery</b>: clients ask Sentinel <code>SENTINEL get-master-addr-by-name mymaster</code> instead of hard-coding the primary's IP."
        ] },
        { warn: "Because replication is asynchronous, writes acknowledged by the old primary but not yet replicated are <b>lost on failover</b>. <code>WAIT 1 100</code> (block until 1 replica acks, max 100 ms) narrows the window but does not make Redis strongly consistent. <code>min-replicas-to-write 1</code> makes a primary that has lost its replicas stop accepting writes, limiting split-brain damage." },
        { tip: "Why at least 3 Sentinels on separate machines? With 2, a network partition leaves no majority to authorise a failover. Sentinel gives HA but not sharding — for more data than one machine holds, you need Redis Cluster." }
      ]
    },
    {
      id: "redis-cluster-hash-slots",
      q: "How does Redis Cluster shard data using hash slots, hash tags and MOVED/ASK redirects?",
      topic: "Persistence & Scaling",
      level: 3,
      top: true,
      short: "Redis Cluster splits the keyspace into 16384 hash slots; a key's slot is CRC16(key) mod 16384, and each primary owns a range of slots and has its own replicas. Clients cache the slot-to-node map and are redirected with MOVED if they ask the wrong node, or ASK while a slot is being migrated. Multi-key commands only work when all keys are in the same slot, which you force with hash tags such as {user:42}:cart. Failover is built in: replicas are promoted by a majority of primaries, no Sentinel needed.",
      a: [
        { svg: `<svg viewBox="0 0 660 230" width="660" class="dg">
  <rect class="box-w" x="230" y="10" width="200" height="40" rx="6"/>
  <text class="tx" x="330" y="30" text-anchor="middle" dominant-baseline="middle">CRC16(key) mod 16384</text>
  <line class="ln" x1="290" y1="50" x2="120" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="330" y1="50" x2="330" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="370" y1="50" x2="540" y2="95" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="40" y="98" width="160" height="50" rx="6"/>
  <text class="tx tx-b" x="120" y="116" text-anchor="middle" dominant-baseline="middle">Primary A</text>
  <text class="tx-s" x="120" y="135" text-anchor="middle" dominant-baseline="middle">slots 0 – 5460</text>
  <rect class="box-a" x="250" y="98" width="160" height="50" rx="6"/>
  <text class="tx tx-b" x="330" y="116" text-anchor="middle" dominant-baseline="middle">Primary B</text>
  <text class="tx-s" x="330" y="135" text-anchor="middle" dominant-baseline="middle">slots 5461 – 10922</text>
  <rect class="box-a" x="460" y="98" width="160" height="50" rx="6"/>
  <text class="tx tx-b" x="540" y="116" text-anchor="middle" dominant-baseline="middle">Primary C</text>
  <text class="tx-s" x="540" y="135" text-anchor="middle" dominant-baseline="middle">slots 10923 – 16383</text>
  <rect class="box-g" x="60" y="178" width="120" height="32" rx="6"/>
  <text class="tx-s" x="120" y="194" text-anchor="middle" dominant-baseline="middle">Replica A1</text>
  <rect class="box-g" x="270" y="178" width="120" height="32" rx="6"/>
  <text class="tx-s" x="330" y="194" text-anchor="middle" dominant-baseline="middle">Replica B1</text>
  <rect class="box-g" x="480" y="178" width="120" height="32" rx="6"/>
  <text class="tx-s" x="540" y="194" text-anchor="middle" dominant-baseline="middle">Replica C1</text>
  <line class="ln-a" x1="120" y1="148" x2="120" y2="176" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="330" y1="148" x2="330" y2="176" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="540" y1="148" x2="540" y2="176" marker-end="url(#dg-arr-a)"/>
</svg>`, caption: "Minimal production cluster: 3 primaries, each with a replica; slots are the unit of ownership and migration" },
        { p: "Instead of hashing keys straight to nodes (which reshuffles everything when nodes change), Cluster hashes keys to a fixed set of <b>16384 slots</b> and assigns slots to nodes. Adding a node means moving <i>some slots</i>, not rehashing all keys — the same goal as <a href=\"#/core/sd/consistent-hashing\">consistent hashing</a>, achieved with an explicit slot table." },
        { code: `import binascii

def key_slot(key: str) -> int:
    k = key.encode()
    s = k.find(b"{")
    if s != -1:
        e = k.find(b"}", s + 1)
        if e != -1 and e != s + 1:      # non-empty {...} -> hash only the tag
            k = k[s + 1:e]
    return binascii.crc_hqx(k, 0) % 16384   # CRC16-CCITT (XMODEM), as Redis uses

for key in ["foo", "user:1000", "user:1001", "{user:1000}:cart", "{user:1000}:orders", "a{}b"]:
    print(f"{key:20} -> slot {key_slot(key)}")`, lang: "python", title: "Same algorithm as CLUSTER KEYSLOT" },
        { code: `foo                  -> slot 12182
user:1000            -> slot 1649
user:1001            -> slot 5712
{user:1000}:cart     -> slot 1649
{user:1000}:orders   -> slot 1649
a{}b                 -> slot 13694`, lang: "text" },
        { h: "Redirects" },
        { ul: [
          "<b>MOVED 1649 10.0.0.2:6379</b> — 'this slot lives on another node, permanently'. Smart clients update their slot map and retry there.",
          "<b>ASK 1649 10.0.0.3:6379</b> — during resharding the slot is half-migrated; the client retries <i>this one request</i> on the target with <code>ASKING</code> but keeps its slot map.",
          "Nodes gossip over a cluster bus (data port + 10000) and detect failures; a majority of primaries must agree before a replica is promoted."
        ] },
        { warn: "Multi-key operations (<code>MGET</code>, <code>SUNION</code>, <code>MULTI</code> blocks, Lua scripts) fail with <code>CROSSSLOT</code> unless every key hashes to the same slot. Use hash tags deliberately — but putting too much under one tag recreates a hot shard. Cluster also supports only database 0 (no <code>SELECT</code>)." },
        { tip: "Why 16384 and not 65536? Nodes exchange their slot ownership as a bitmap in every heartbeat: 16384 bits = 2 KB, while 65536 would be 8 KB per ping. And Cluster is designed for at most ~1000 primaries, so 16384 slots is plenty." }
      ]
    },

    /* ───────────── Atomicity & Messaging ───────────── */
    {
      id: "transactions-multi-watch",
      q: "How do Redis transactions (MULTI/EXEC, WATCH) work, and why is there no rollback?",
      topic: "Atomicity & Messaging",
      level: 2,
      top: true,
      short: "MULTI starts queuing commands, EXEC runs the whole queue atomically — no other client's command runs in between — and DISCARD drops it. There is no rollback: if one command fails at runtime (say a WRONGTYPE error), the others still execute. WATCH gives optimistic locking: if any watched key is modified before EXEC, EXEC returns nil and nothing runs, so the client retries. For read-compute-write logic, a Lua script is usually simpler.",
      a: [
        { code: `MULTI
INCRBY account:a -100      # QUEUED
INCRBY account:b 100       # QUEUED
EXEC                       # 1) (integer) 400  2) (integer) 600  -- run back-to-back, atomically`, lang: "bash", title: "Basic transaction" },
        { table: { head: ["Guarantee", "Redis MULTI/EXEC"], rows: [
          ["Isolation", "Yes — the queued commands run consecutively; nothing interleaves"],
          ["All-or-nothing on syntax errors", "Yes — an error while queuing (unknown command, wrong arity) makes EXEC abort (<code>EXECABORT</code>)"],
          ["All-or-nothing on runtime errors", "<b>No</b> — e.g. <code>LPUSH</code> on a string fails, the rest still run"],
          ["Rollback", "<b>No</b>"],
          ["Read your own writes inside", "No — commands only return QUEUED until EXEC, so you cannot branch on a result"]
        ] } },
        { p: "Redis skips rollback on purpose: runtime errors are programming bugs (wrong type), which should be caught in development, and not supporting rollback keeps Redis simple and fast. Compare with <a href=\"#/core/dbms/acid-properties\">ACID in relational databases</a>." },
        { h: "WATCH = optimistic locking (check-and-set)" },
        { code: `import redis

r = redis.Redis(decode_responses=True)

def withdraw(acct: str, amount: int) -> bool:
    with r.pipeline() as pipe:                 # transaction=True by default
        while True:
            try:
                pipe.watch(acct)               # WATCH acct
                bal = int(pipe.get(acct) or 0) # immediate-mode read while watching
                if bal < amount:
                    pipe.unwatch()
                    return False
                pipe.multi()                   # MULTI: start queuing
                pipe.decrby(acct, amount)
                pipe.execute()                 # EXEC -> raises WatchError if acct changed
                return True
            except redis.WatchError:
                continue                       # someone else wrote acct: retry`, lang: "python", run: false, title: "Check-and-set withdraw with redis-py" },
        { p: "If another client modifies <code>acct</code> between <code>WATCH</code> and <code>EXEC</code>, Redis returns a null reply for EXEC and redis-py raises <code>WatchError</code>. This is <a href=\"#/core/dbms/optimistic-vs-pessimistic\">optimistic concurrency control</a> — great under low contention, wasteful retries under high contention." },
        { tip: "Interviewers often ask 'is a Redis transaction ACID?' — Atomic in the sense of isolated execution, but no rollback; Durability depends on AOF with <code>appendfsync always</code>. Say exactly that." }
      ]
    },
    {
      id: "lua-scripting",
      q: "Why use Lua scripts in Redis, and what makes them atomic?",
      topic: "Atomicity & Messaging",
      level: 3,
      top: false,
      short: "A Lua script sent with EVAL (or a Redis 7 Function via FCALL) runs entirely on the server's single thread, so no other command executes while it runs — it is atomic. Unlike MULTI it can read values and branch on them, so check-then-act logic such as 'release the lock only if I own it' or a sliding-window rate limit happens in one round trip with no race. Scripts must be short because they block the server, and every key must be passed in KEYS so Cluster can route them.",
      a: [
        { p: "Redis embeds a Lua 5.1 interpreter. A script runs as one indivisible operation: the event loop does not serve any other client until it returns. That gives you atomic <b>read-modify-write</b>, which MULTI/EXEC cannot do because queued commands cannot see each other's results." },
        { code: `# Atomic "decrement stock only if available"
EVAL "local s = tonumber(redis.call('GET', KEYS[1]) or '0')
if s >= tonumber(ARGV[1]) then
  return redis.call('DECRBY', KEYS[1], ARGV[1])
end
return -1" 1 stock:item:7 2
# (integer) 8     or  (integer) -1 if not enough stock

SCRIPT LOAD "return redis.call('GET', KEYS[1])"   # -> "d3c21d0c2b9ca22f82737626a27bcaf5d288f99f" (SHA1)
EVALSHA d3c21d0c2b9ca22f82737626a27bcaf5d288f99f 1 somekey  # send hash instead of body`, lang: "bash", title: "EVAL numkeys key... arg..." },
        { code: `import redis

r = redis.Redis(decode_responses=True)

RESERVE = r.register_script("""
local s = tonumber(redis.call('GET', KEYS[1]) or '0')
if s >= tonumber(ARGV[1]) then
  return redis.call('DECRBY', KEYS[1], ARGV[1])
end
return -1
""")

left = RESERVE(keys=["stock:item:7"], args=[2])   # uses EVALSHA, falls back to EVAL
print("sold out" if left == -1 else f"reserved, {left} left")`, lang: "python", run: false, title: "redis-py Script object" },
        { table: { head: ["", "MULTI/EXEC", "Lua script / Function"], rows: [
          ["Atomic execution", "Yes", "Yes"],
          ["Can branch on values read", "No (needs WATCH + retry)", "Yes"],
          ["Round trips", "Several (WATCH, GET, MULTI, ..., EXEC)", "One"],
          ["Rollback on error", "No", "No — writes done before the error stay"],
          ["Risk", "Retry storms under contention", "A slow script blocks the whole server"]
        ] } },
        { p: "<b>Redis 7.0 Functions</b> (<code>FUNCTION LOAD</code>, <code>FCALL</code>) are named, versioned libraries stored on the server and replicated/persisted with the data — the modern alternative to managing <code>EVALSHA</code> hashes yourself." },
        { warn: "A script past <code>busy-reply-threshold</code> (formerly <code>lua-time-limit</code>, 5 s) is not killed: Redis just starts answering other clients with <code>BUSY</code>. You can <code>SCRIPT KILL</code> it only if it has not written anything; otherwise <code>SHUTDOWN NOSAVE</code> is the only way out. Keep scripts O(small)." },
        { tip: "Always pass key names via <code>KEYS[]</code>, never build them inside the script — Redis Cluster uses the declared keys to route the script and to check they share a slot." }
      ]
    },
    {
      id: "pipelining",
      q: "What is pipelining in Redis, and how is it different from a transaction?",
      topic: "Atomicity & Messaging",
      level: 2,
      top: true,
      short: "Pipelining sends many commands without waiting for each reply, then reads all replies together. It removes per-command network round trips and syscalls, so 10,000 SETs can go from seconds to milliseconds. It is purely a client-side batching optimisation — commands from other clients can interleave, so it is not atomic. A transaction (MULTI/EXEC) guarantees isolation but on its own is not about performance; the two can be combined.",
      a: [
        { p: "Each Redis command is fast (microseconds), but a network round trip is ~0.2–1 ms in a datacenter. Sending commands one by one, the client spends almost all its time waiting on the network:" },
        { table: { head: ["10,000 SETs, 0.5 ms RTT", "Time ≈"], rows: [
          ["One at a time", "10,000 × 0.5 ms = <b>5 s</b>"],
          ["Pipelined in batches of 1,000", "10 RTTs + server work ≈ <b>tens of ms</b>"]
        ] } },
        { code: `import redis

r = redis.Redis()

# Pipelined but NOT a transaction: fastest bulk load
pipe = r.pipeline(transaction=False)
for i in range(10_000):
    pipe.set(f"k:{i}", i)
    if i % 1000 == 999:
        pipe.execute()            # one network write, one batch of 1000 replies

# Pipelined AND atomic: redis-py wraps it in MULTI ... EXEC
with r.pipeline() as p:           # transaction=True is the default!
    p.incr("orders:count")
    p.lpush("orders:recent", "o-1001")
    count, _ = p.execute()`, lang: "python", run: false, title: "redis-py" },
        { table: { head: ["", "Pipelining", "MULTI/EXEC"], rows: [
          ["Purpose", "Throughput (fewer round trips)", "Isolation (no interleaving)"],
          ["Atomic", "No — other clients' commands can run between yours", "Yes"],
          ["Where it happens", "Client batches on the wire", "Server queues and executes together"],
          ["Cluster", "Client splits the batch per node", "All keys must be in one slot"]
        ] } },
        { warn: "In redis-py, <code>r.pipeline()</code> defaults to <code>transaction=True</code>, so it also sends MULTI/EXEC. That's fine on one node, but on Redis Cluster a transaction pipeline with keys in different slots fails — use <code>transaction=False</code> for bulk work." },
        { tip: "Do not pipeline 1 million commands in one batch — the server buffers all replies in memory. Batches of a few hundred to a few thousand are typical. For bulk imports, <code>redis-cli --pipe</code> streams raw RESP." }
      ]
    },

    /* ───────────── Patterns & Pitfalls ───────────── */
    {
      id: "cache-aside-implementation",
      q: "Implement the cache-aside pattern with Redis. How do you keep the cache consistent on writes?",
      topic: "Patterns & Pitfalls",
      level: 2,
      top: true,
      short: "On read: GET the key; on a hit return it; on a miss load from the database, SET it with a TTL, and return. On write: update the database first, then DELETE the cache key rather than updating it, so the next read repopulates fresh data. Always set a TTL as a safety net, serialise consistently (JSON), cache 'not found' briefly to stop penetration, and treat Redis as optional — if it is down, fall back to the database.",
      a: [
        { p: "Cache-aside (lazy loading) is the most common Redis pattern: the application, not Redis, talks to the database. Strategy comparison is in <a href=\"#/core/sd/caching-strategies\">caching strategies</a>; here is a production-quality implementation." },
        { code: `import json
import logging
import random
import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True,
                socket_timeout=0.2)                 # never let the cache hang a request
TTL = 300
NULL = "__null__"                                    # sentinel for "row does not exist"

def get_user(user_id: int, db) -> dict | None:
    key = f"user:v1:{user_id}"                       # version prefix: bump on schema change
    try:
        cached = r.get(key)
        if cached is not None:
            return None if cached == NULL else json.loads(cached)     # HIT
    except redis.RedisError:
        logging.warning("redis down, reading DB directly")
        return db.fetch_user(user_id)

    user = db.fetch_user(user_id)                    # MISS -> source of truth
    try:
        if user is None:
            r.set(key, NULL, ex=60)                  # short negative cache
        else:
            r.set(key, json.dumps(user), ex=TTL + random.randint(0, 30))  # TTL jitter
    except redis.RedisError:
        pass
    return user

def update_email(user_id: int, email: str, db) -> None:
    db.update_email(user_id, email)                  # 1. write the DB (commit)
    r.delete(f"user:v1:{user_id}")                   # 2. invalidate, don't overwrite`, lang: "python", run: false, title: "Cache-aside with redis-py (needs a running Redis + DB)" },
        { h: "Why delete instead of update on writes?" },
        { ul: [
          "Two concurrent writers can update the DB in order A, B but the cache in order B, A — the cache then holds A's stale value <b>forever</b>. Deleting is idempotent; the next reader loads whatever the DB has.",
          "Computing the cached value may be expensive or need joins; let the read path do it only if someone actually reads it."
        ] },
        { table: { head: ["Write ordering", "Failure mode"], rows: [
          ["Update DB → delete cache (recommended)", "Tiny race: a reader that loaded the old row before the commit can write it back after the delete. TTL bounds the staleness"],
          ["Delete cache → update DB", "A reader between the two steps re-caches the old value — stale until TTL. Worse"],
          ["Update DB → update cache", "Concurrent writers can leave the cache permanently wrong"]
        ] } },
        { p: "Stricter options: <b>delayed double delete</b> (delete, write DB, delete again after ~500 ms), or drive invalidation from the database's change stream (CDC with Debezium → delete keys), which also catches writes made by other services." },
        { warn: "No TTL = no safety net. Any missed invalidation (a bug, a failed DELETE, a manual DB fix) leaves stale data indefinitely. Every cache key should have a TTL." },
        { tip: "Mention what you would measure: hit ratio from <code>INFO stats</code> (<code>keyspace_hits / (hits + misses)</code>), p99 latency, and evictions. A hit ratio under ~80% means the cache is undersized or the keys are badly chosen." }
      ]
    },
    {
      id: "stampede-penetration-avalanche",
      q: "How do you handle cache stampede, cache penetration and cache avalanche when using Redis?",
      topic: "Patterns & Pitfalls",
      level: 3,
      top: true,
      short: "Stampede: a hot key expires and many requests rebuild it at once — let only one rebuild it using a SET NX lock (others wait and re-read) or refresh it early before expiry. Penetration: requests for IDs that don't exist always miss and hit the DB — cache the null result with a short TTL and put a Bloom filter in front. Avalanche: many keys expire together or Redis goes down — add TTL jitter, stagger warm-up, run Redis with replicas, and protect the DB with circuit breakers and rate limits.",
      a: [
        { p: "The definitions are in <a href=\"#/core/sd/cache-invalidation-problems\">cache invalidation problems</a>. Interviewers then ask: <i>show me how you'd fix it with Redis</i>." },
        { table: { head: ["Problem", "Trigger", "Redis-level fixes"], rows: [
          ["<b>Stampede</b> (dog-piling)", "One hot key expires; 5,000 requests miss at once", "Mutex with <code>SET lock:k token NX PX 5000</code>; probabilistic early refresh; never-expire + background refresh"],
          ["<b>Penetration</b>", "Lookups of non-existent IDs (bugs or attacks: <code>id=-1</code>)", "Cache a null marker with a short TTL; Bloom filter (<code>BF.EXISTS</code>) of valid IDs; validate input"],
          ["<b>Avalanche</b>", "Thousands of keys share an expiry time, or the Redis node dies", "TTL jitter; replicas + Sentinel/Cluster; local L1 cache; DB circuit breaker and request limiting"]
        ] } },
        { code: `import threading, time

class FakeRedis:
    """Just enough of Redis: GET, SET with NX, DEL - each op atomic (single-threaded server)."""
    def __init__(self):
        self.d, self.mu = {}, threading.Lock()
    def get(self, k):
        with self.mu:
            return self.d.get(k)
    def set(self, k, v, nx=False):
        with self.mu:
            if nx and k in self.d:
                return False
            self.d[k] = v
            return True
    def delete(self, k):
        with self.mu:
            self.d.pop(k, None)

db_calls = 0
db_mu = threading.Lock()
def slow_db_query():
    global db_calls
    with db_mu:
        db_calls += 1
    time.sleep(0.05)                       # 50 ms query
    return "top-10-products"

def get_naive(r, start):
    start.wait()
    v = r.get("hot")
    if v is None:                          # everyone misses at once
        v = slow_db_query()
        r.set("hot", v)
    return v

def get_with_lock(r, start):
    start.wait()
    while True:
        v = r.get("hot")
        if v is not None:
            return v
        if r.set("lock:hot", "1", nx=True):   # real Redis: SET lock:hot <token> NX PX 5000
            try:
                v = slow_db_query()
                r.set("hot", v)
                return v
            finally:
                r.delete("lock:hot")
        time.sleep(0.01)                   # lost the race: wait, then re-read cache

for fn in (get_naive, get_with_lock):
    db_calls, r = 0, FakeRedis()
    start = threading.Barrier(50)
    ts = [threading.Thread(target=fn, args=(r, start)) for _ in range(50)]
    for t in ts: t.start()
    for t in ts: t.join()
    print(f"{fn.__name__:14} 50 concurrent requests -> DB queries: {db_calls}")`, lang: "python", title: "Simulating a stampede, then fixing it with a SET NX mutex" },
        { code: `get_naive      50 concurrent requests -> DB queries: 50
get_with_lock  50 concurrent requests -> DB queries: 1`, lang: "text" },
        { p: "<b>Probabilistic early expiration</b> (XFetch): each reader recomputes the value early with a probability that rises as expiry approaches, so usually exactly one request refreshes it before it expires and nobody ever sees a miss. Simpler variant: store a 'soft expiry' inside the value, serve the stale value and trigger one async refresh once it is passed." },
        { warn: "The lock in a stampede fix must have a TTL (<code>PX</code>) — if the rebuilding process crashes, a lock without expiry blocks the key forever. Waiters should also give up after a timeout and fall back (serve stale data or an error), not spin indefinitely." },
        { tip: "For penetration, a Bloom filter has <b>no false negatives</b>: if it says 'not present', skip the DB. False positives just cost one DB lookup. Remember to add new IDs to the filter on insert." }
      ]
    },
    {
      id: "distributed-lock",
      q: "How do you implement a distributed lock with Redis? What are the pitfalls, and what is Redlock?",
      topic: "Patterns & Pitfalls",
      level: 3,
      top: true,
      short: "Acquire with SET lock:resource with a unique token, NX and PX 30000 — set only if absent, with an expiry so a crashed holder can't block forever. Release with a Lua script that deletes the key only if it still holds your token, so you never delete someone else's lock. Pitfalls: the lock can expire mid-work (GC pause) and failover can lose it. Redlock locks a majority of 5 independent nodes but still relies on timing; for correctness use fencing tokens or ZooKeeper/etcd.",
      a: [
        { code: `# Acquire: only if nobody holds it, auto-expire after 30 s
SET lock:invoice:77 "c0b4e1-worker-3" NX PX 30000
# OK        -> you own the lock
# (nil)     -> someone else does; retry with backoff or give up

# Release: compare-and-delete must be atomic -> Lua
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
else
  return 0
end" 1 lock:invoice:77 "c0b4e1-worker-3"`, lang: "bash", title: "Single-instance lock" },
        { h: "Why each piece is needed" },
        { table: { head: ["Mistake", "What goes wrong"], rows: [
          ["<code>SETNX</code> then <code>EXPIRE</code> (two commands)", "Crash in between → lock never expires → deadlock"],
          ["No expiry at all", "Holder crashes → resource locked forever"],
          ["Plain <code>DEL</code> to release", "Your lock expired, B acquired it, you DEL B's lock → C enters too"],
          ["GET then DEL from the client", "Lock can expire and be re-acquired between the two calls → use Lua"],
          ["Same token for every client", "Can't tell owners apart; use a UUID per acquisition"]
        ] } },
        { code: `import uuid
import redis

r = redis.Redis(decode_responses=True)

# redis-py ships a correct implementation (token + Lua release)
lock = r.lock("lock:invoice:77", timeout=30, blocking_timeout=5)
if lock.acquire():
    try:
        generate_invoice(77)             # your critical section
        lock.extend(30)                  # extend TTL if the work runs long
    finally:
        lock.release()                   # raises LockNotOwnedError if it had expired
else:
    print("busy, try later")`, lang: "python", run: false, title: "redis-py Lock" },
        { h: "Redlock and its critique" },
        { p: "<b>Redlock</b> (the algorithm by Redis's author): with N = 5 independent primaries, a client tries <code>SET NX PX</code> on each with a short timeout; it holds the lock only if it got a <b>majority (3)</b> and the elapsed time is less than the lock validity. It removes the single point of failure of one Redis." },
        { p: "Martin Kleppmann's well-known critique: any lease-based lock can fail if the holder pauses (GC, VM migration, page fault) longer than the TTL — it wakes up believing it still holds the lock. Redlock also assumes bounded clock drift. The fix is a <b>fencing token</b>: a monotonically increasing number issued with the lock that the storage layer checks, rejecting writes with an older token. Redis locks don't produce such tokens natively." },
        { warn: "Use Redis locks for <b>efficiency</b> (avoid doing the same job twice, e.g. a cron running on 3 servers). For <b>correctness</b> (money, inventory), also make the operation idempotent or guarded in the database — a unique constraint, a version column, or <code>SELECT ... FOR UPDATE</code>. See <a href=\"#/core/sd/idempotency\">idempotency</a>." },
        { tip: "Follow-up 'what TTL would you choose?' — comfortably longer than the p99 of the critical section, plus a watchdog that extends the lock while work is still progressing (what Redisson does in Java)." }
      ]
    },
    {
      id: "rate-limiter-redis",
      q: "How would you implement a rate limiter with Redis — INCR + EXPIRE vs a sliding window on sorted sets?",
      topic: "Patterns & Pitfalls",
      level: 2,
      top: true,
      short: "Fixed window: INCR a key like rl:user:window and set EXPIRE when the count is 1; reject when the count exceeds the limit. It is O(1) and tiny, but allows up to 2x the limit across a window boundary. Sliding log: keep a sorted set of request timestamps per user; ZREMRANGEBYSCORE removes old ones, ZCARD counts the rest, ZADD records the new one — exact, but costs memory per request. Run the check-and-add atomically in a Lua script, and remember all app servers share Redis, so the limit is global.",
      a: [
        { p: "Algorithms in general are covered in <a href=\"#/core/sd/rate-limiting-algorithms\">rate-limiting algorithms</a> and <a href=\"#/core/sd/design-rate-limiter\">design a rate limiter</a>. Redis is the usual store because every API server sees the same counters and the operations are atomic." },
        { h: "1. Fixed window counter" },
        { code: `# limit: 100 requests/minute for user 42; window = floor(now / 60)
INCR rl:42:29324640          # (integer) 1   first request in this window
EXPIRE rl:42:29324640 60 NX  # set TTL only on first increment (NX needs Redis 7.0+)
# ...app rejects when INCR returns > 100`, lang: "bash" },
        { p: "Before Redis 7 the pattern was 'if INCR returned 1, then EXPIRE' — two round trips, and a crash between them leaves a counter that never expires. Wrap both in <code>MULTI/EXEC</code> or a Lua script." },
        { h: "2. Sliding window log (sorted set)" },
        { code: `-- KEYS[1] = rl:42   ARGV: now_ms, window_ms, limit, unique request id
local now, win, limit = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - win)   -- drop old entries
if redis.call('ZCARD', KEYS[1]) >= limit then
  return 0                                                   -- reject
end
redis.call('ZADD', KEYS[1], now, ARGV[4])                    -- record this request
redis.call('PEXPIRE', KEYS[1], win)                          -- idle users cost nothing
return 1                                                     -- allow`, lang: "text", title: "sliding_window.lua (run with EVALSHA)" },
        { p: "Simulation of both, showing the boundary burst that the fixed window lets through:" },
        { code: `from collections import defaultdict
import bisect

LIMIT, WINDOW = 5, 60            # 5 requests per 60 s

class FixedWindow:               # INCR rl:{user}:{window_start}  +  EXPIRE
    def __init__(self):
        self.counters = defaultdict(int)
    def allow(self, user, t):
        key = (user, t // WINDOW)
        self.counters[key] += 1                  # INCR
        return self.counters[key] <= LIMIT

class SlidingLog:                # ZSET of timestamps per user
    def __init__(self):
        self.log = defaultdict(list)             # sorted list = ZSET scored by time
    def allow(self, user, t):
        z = self.log[user]
        del z[:bisect.bisect_right(z, t - WINDOW)]   # ZREMRANGEBYSCORE key -inf t-WINDOW
        if len(z) >= LIMIT:                          # ZCARD
            return False
        z.append(t)                                  # ZADD key t t
        return True

# burst at the window edge: 5 requests at t=59 and 5 at t=60
times = [59] * 5 + [60] * 5
for algo in (FixedWindow(), SlidingLog()):
    ok = sum(algo.allow("u1", t) for t in times)
    print(f"{type(algo).__name__:12} allowed {ok}/10 within 2 seconds")`, lang: "python" },
        { code: `FixedWindow  allowed 10/10 within 2 seconds
SlidingLog   allowed 5/10 within 2 seconds`, lang: "text" },
        { table: { head: ["", "Fixed window (INCR)", "Sliding log (ZSET)", "Sliding window counter"], rows: [
          ["Accuracy", "Up to 2× burst at edges", "Exact", "Approximate (weights previous window)"],
          ["Memory per user", "One integer", "One entry per request in the window", "Two integers"],
          ["Cost per request", "O(1)", "O(log N)", "O(1)"],
          ["Good for", "Login attempts, simple quotas", "Strict, low-volume limits (OTP sends)", "High-volume APIs"]
        ] } },
        { warn: "Members of a sorted set are unique: if two requests arrive in the same millisecond and you use the timestamp as the member, the second <code>ZADD</code> just overwrites the first and is never counted. Use a unique member (timestamp + random suffix / request id)." },
        { tip: "Return HTTP <code>429 Too Many Requests</code> with a <code>Retry-After</code> header, and decide what happens if Redis is unreachable — usually <b>fail open</b> (allow) for normal APIs and fail closed for security-sensitive ones like login." }
      ]
    }
  ]
});
