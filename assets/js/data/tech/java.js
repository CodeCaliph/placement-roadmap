/* tech stack: Java — interview Q&A (collections, streams, concurrency, JVM, modern Java) */
(window.TECH = window.TECH || []).push({
  id: "java",
  title: "Java",
  short: "Java",
  icon: "◈",
  blurb: "With Java on your resume, interviewers go past OOP into how HashMap and ConcurrentHashMap really work, whether you can write a clean stream pipeline, how you would run tasks on a thread pool without races or deadlocks, what the JVM does with memory and GC, and which Java 8–21 features you actually use.",
  topics: ["Collections", "Streams & Lambdas", "Concurrency", "JVM Internals", "Modern & Practical"],
  questions: [

    /* ───────────── Collections ───────────── */
    {
      id: "hashmap-vs-concurrenthashmap-vs-hashtable",
      q: "How does HashMap work internally, and how is it different from Hashtable and ConcurrentHashMap?",
      topic: "Collections",
      level: 2,
      top: true,
      short: "HashMap is an array of buckets: the key's hashCode is spread and masked to pick a bucket, collisions are chained and turned into a red-black tree once a bucket holds 8 or more entries. It is not thread-safe and allows one null key. Hashtable is the legacy version that synchronizes every method and rejects nulls. ConcurrentHashMap is the modern thread-safe map: lock-free reads, CAS or a per-bucket lock for writes, and atomic compute/merge operations.",
      a: [
        { p: "<b>HashMap internals (Java 8+).</b> The map holds a <code>Node[] table</code> (default capacity 16, load factor 0.75). On <code>put(k, v)</code>:" },
        { ol: [
          "Compute <code>h = k.hashCode() ^ (h &gt;&gt;&gt; 16)</code> — the high bits are mixed into the low bits because only the low bits pick the bucket.",
          "Bucket index = <code>(n - 1) &amp; h</code> (n is always a power of two, so this is a cheap modulo).",
          "Empty bucket → store the node. Otherwise walk the chain comparing <code>hash</code> then <code>equals()</code>; replace the value on a match, else append.",
          "If a chain reaches <b>8</b> nodes and the table has at least <b>64</b> buckets, the chain is <b>treeified</b> into a red-black tree (worst case O(log n) instead of O(n)); it turns back into a list at 6.",
          "When <code>size &gt; capacity × 0.75</code> the table <b>doubles</b> and entries are split between index <i>i</i> and <i>i + oldCap</i>."
        ] },
        { svg: `<svg viewBox="0 0 640 230" width="640" class="dg">
  <text class="tx tx-b" x="20" y="20">Node[] table (n = 8), index = (n - 1) AND hash</text>
  <rect class="box" x="20" y="36" width="64" height="30" rx="4"/><text class="tx" x="52" y="51" text-anchor="middle" dominant-baseline="middle">[0]</text>
  <rect class="box-a" x="96" y="36" width="64" height="30" rx="4"/><text class="tx" x="128" y="51" text-anchor="middle" dominant-baseline="middle">[1]</text>
  <rect class="box" x="172" y="36" width="64" height="30" rx="4"/><text class="tx" x="204" y="51" text-anchor="middle" dominant-baseline="middle">[2]</text>
  <rect class="box" x="248" y="36" width="64" height="30" rx="4"/><text class="tx" x="280" y="51" text-anchor="middle" dominant-baseline="middle">[3]</text>
  <rect class="box-a" x="324" y="36" width="64" height="30" rx="4"/><text class="tx" x="356" y="51" text-anchor="middle" dominant-baseline="middle">[4]</text>
  <rect class="box" x="400" y="36" width="64" height="30" rx="4"/><text class="tx" x="432" y="51" text-anchor="middle" dominant-baseline="middle">[5]</text>
  <rect class="box-p" x="476" y="36" width="64" height="30" rx="4"/><text class="tx" x="508" y="51" text-anchor="middle" dominant-baseline="middle">[6]</text>
  <rect class="box" x="552" y="36" width="64" height="30" rx="4"/><text class="tx" x="584" y="51" text-anchor="middle" dominant-baseline="middle">[7]</text>
  <rect class="box-g" x="83" y="100" width="90" height="28" rx="4"/><text class="tx tx-s" x="128" y="114" text-anchor="middle" dominant-baseline="middle">"ab" = 1</text>
  <rect class="box-g" x="83" y="160" width="90" height="28" rx="4"/><text class="tx tx-s" x="128" y="174" text-anchor="middle" dominant-baseline="middle">"ba" = 2</text>
  <line class="ln" x1="128" y1="66" x2="128" y2="98" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="128" y1="128" x2="128" y2="158" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="311" y="100" width="90" height="28" rx="4"/><text class="tx tx-s" x="356" y="114" text-anchor="middle" dominant-baseline="middle">"key" = 7</text>
  <line class="ln" x1="356" y1="66" x2="356" y2="98" marker-end="url(#dg-arr)"/>
  <rect class="box-p" x="448" y="100" width="120" height="28" rx="4"/><text class="tx tx-s" x="508" y="114" text-anchor="middle" dominant-baseline="middle">TreeNode (red-black)</text>
  <line class="ln" x1="508" y1="66" x2="508" y2="98" marker-end="url(#dg-arr)"/>
  <text class="tx tx-m" x="190" y="178">collision chain (same bucket)</text>
  <text class="tx tx-m" x="430" y="150">chain of 8+ and table of 64+ is treeified</text>
</svg>`, caption: "Buckets hold a linked chain; a long chain becomes a red-black tree" },
        { table: { head: ["", "HashMap", "Hashtable", "ConcurrentHashMap"], rows: [
          ["Thread-safe", "No", "Yes — every method <code>synchronized</code> on the whole map", "Yes — fine-grained"],
          ["Locking (Java 8+)", "—", "One lock for everything", "CAS to fill an empty bucket, <code>synchronized</code> on the bucket's first node otherwise; reads take no lock"],
          ["Null key / values", "One null key, many null values", "Neither (NPE)", "Neither (NPE)"],
          ["Iterator", "Fail-fast", "Fail-fast iterator (legacy <code>Enumeration</code> is not)", "Weakly consistent, never throws CME"],
          ["Atomic compound ops", "No", "Only by external locking", "<code>putIfAbsent</code>, <code>compute</code>, <code>merge</code> are atomic"],
          ["Use today", "Single-threaded default", "Legacy only — don't", "Shared caches, counters, registries"]
        ] } },
        { code: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Map<String, Integer> hm = new HashMap<>();
        hm.put(null, 1);                    // HashMap: one null key allowed
        hm.put("a", null);                  // ...and null values
        System.out.println(hm);             // {null=1, a=null}

        Map<String, Integer> chm = new ConcurrentHashMap<>();
        try { chm.put("a", null); }
        catch (NullPointerException e) { System.out.println("CHM rejects null"); }

        // 4 threads x 10,000 increments of the same key
        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int t = 0; t < 4; t++)
            pool.submit(() -> { for (int i = 0; i < 10_000; i++) chm.merge("hits", 1, Integer::sum); });
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println(chm.get("hits"));   // always 40000 - merge() is atomic
    }
}`, lang: "java", title: "Nulls and an atomic counter" },
        { warn: "A thread-safe map does not make <i>your</i> sequence of calls atomic. <code>if (!map.containsKey(k)) map.put(k, v)</code> or <code>map.put(k, map.get(k) + 1)</code> is a race even on ConcurrentHashMap — use <code>putIfAbsent</code>, <code>computeIfAbsent</code> or <code>merge</code>. CHM bans <code>null</code> precisely so <code>get()</code> returning null unambiguously means 'absent'." },
        { tip: "Expected follow-ups: 'What happens if you mutate a key after inserting it?' (its hash changes, the entry is lost in the wrong bucket — use immutable keys, see <a href=\"#/core/oops/equals-hashcode\">equals &amp; hashCode</a>). 'How was CHM done in Java 7?' (16 <i>segments</i>, each a lock — replaced in Java 8 by per-bucket locking). 'Collections.synchronizedMap?' — one lock like Hashtable, and you must lock manually while iterating." }
      ]
    },
    {
      id: "arraylist-vs-linkedlist",
      q: "ArrayList vs LinkedList — which one would you use and why?",
      topic: "Collections",
      level: 1,
      top: true,
      short: "ArrayList is backed by a resizable array: O(1) random access, amortised O(1) append, O(n) insert or delete in the middle because elements shift. LinkedList is a doubly linked list: O(1) insert/delete once you hold the node, but O(n) to reach an index and poor cache locality. In practice ArrayList wins almost always; for a queue or stack use ArrayDeque.",
      a: [
        { p: "<b>ArrayList</b> wraps an <code>Object[]</code>. The first <code>add</code> allocates 10 slots; when full it grows by 50% (<code>newCap = old + old &gt;&gt; 1</code>) and copies. <b>LinkedList</b> stores each element in a separate <code>Node{prev, item, next}</code> and also implements <code>Deque</code>." },
        { table: { head: ["Operation", "ArrayList", "LinkedList"], rows: [
          ["<code>get(i)</code> / <code>set(i)</code>", "O(1)", "O(n) — walks from the nearer end"],
          ["<code>add(e)</code> at end", "Amortised O(1)", "O(1)"],
          ["<code>add(0, e)</code> / remove first", "O(n) — shifts everything", "O(1)"],
          ["Insert/remove in middle", "O(n) shift (fast <code>System.arraycopy</code>)", "O(n) to find + O(1) to relink"],
          ["Memory per element", "One reference (4–8 bytes)", "Node object: header + 3 references (~24–40 bytes)"],
          ["Cache locality", "Contiguous — CPU prefetch friendly", "Nodes scattered across the heap"],
          ["Implements", "<code>List</code>, <code>RandomAccess</code>", "<code>List</code>, <code>Deque</code>"]
        ] } },
        { p: "Big-O hides constants: shifting a contiguous array with <code>arraycopy</code> is so fast and pointer-chasing so cache-unfriendly that ArrayList usually beats LinkedList even for middle inserts on realistic sizes (see <a href=\"#/core/os/cache-locality\">cache locality</a>)." },
        { code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 1));
        nums.remove(1);                     // remove(int index)  -> removes 20
        nums.remove(Integer.valueOf(1));    // remove(Object o)   -> removes the value 1
        System.out.println(nums);           // [10, 30]

        List<Integer> big = new ArrayList<>(1_000_000);   // pre-size when you know the count

        Deque<Integer> stack = new ArrayDeque<>();        // better than Stack or LinkedList
        stack.push(1); stack.push(2);
        System.out.println(stack.pop());    // 2

        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(1); queue.offer(2);
        System.out.println(queue.poll());   // 1
        System.out.println(big.size());     // 0 - capacity is not size
    }
}`, lang: "java", title: "Practical choices and the remove() trap" },
        { warn: "<code>list.remove(1)</code> on a <code>List&lt;Integer&gt;</code> removes the element at <b>index</b> 1, not the value 1 — overload resolution prefers the exact primitive match over autoboxing." },
        { tip: "Good answer: 'ArrayList by default; ArrayDeque for queue/stack; LinkedList only if I'm constantly inserting/removing through a ListIterator in the middle of a huge list — which is rare.' Mentioning that even Joshua Bloch (who wrote LinkedList) says he never uses it lands well." }
      ]
    },
    {
      id: "fail-fast-vs-fail-safe-iterators",
      q: "What are fail-fast and fail-safe iterators? Why do you get ConcurrentModificationException?",
      topic: "Collections",
      level: 2,
      top: true,
      short: "Fail-fast iterators (ArrayList, HashMap) remember the collection's modCount and throw ConcurrentModificationException if the collection is structurally modified other than through the iterator itself. Fail-safe or weakly consistent iterators (CopyOnWriteArrayList, ConcurrentHashMap) iterate a snapshot or tolerate concurrent changes and never throw. To delete while looping use iterator.remove() or removeIf.",
      a: [
        { p: "Every non-concurrent collection keeps a <code>modCount</code> that increments on each <b>structural</b> change (add/remove, not <code>set</code>). An iterator copies it into <code>expectedModCount</code>; each <code>next()</code> compares the two and throws <code>ConcurrentModificationException</code> on mismatch. It happens even in a <b>single thread</b> — the classic case is removing inside a for-each loop." },
        { table: { head: ["", "Fail-fast", "Fail-safe / weakly consistent"], rows: [
          ["Examples", "<code>ArrayList</code>, <code>HashMap</code>, <code>HashSet</code>, <code>TreeMap</code>", "<code>CopyOnWriteArrayList</code> (snapshot), <code>ConcurrentHashMap</code> (weakly consistent)"],
          ["Modification during iteration", "Throws CME (best effort)", "Allowed, no exception"],
          ["Sees new elements?", "—", "COW: never (old snapshot). CHM: may or may not"],
          ["Cost", "None extra", "COW copies the array on every write"]
        ] } },
        { code: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b", "c", "d"));
        try {
            for (String s : list) if (s.equals("a")) list.remove(s);
        } catch (ConcurrentModificationException e) { System.out.println("CME!"); }

        list = new ArrayList<>(List.of("a", "b", "c", "d"));
        Iterator<String> it = list.iterator();
        while (it.hasNext()) if (it.next().equals("a")) it.remove();   // safe: goes through iterator
        list.removeIf(s -> s.equals("b"));                              // cleanest (Java 8)
        System.out.println(list);                                       // [c, d]

        // Surprise: removing the SECOND-TO-LAST element does not throw
        List<Integer> l = new ArrayList<>(List.of(1, 2, 3));
        for (Integer x : l) if (x == 2) l.remove(x);   // hasNext() sees cursor == size and stops
        System.out.println(l);                         // [1, 3]  - and 3 was never visited!

        List<String> cow = new CopyOnWriteArrayList<>(List.of("x", "y"));
        for (String s : cow) cow.add(s + "!");         // iterates a snapshot: no CME, no infinite loop
        System.out.println(cow);                       // [x, y, x!, y!]
    }
}`, lang: "java", title: "CME, the fixes, and a quirk" },
        { warn: "Fail-fast is <b>best effort</b>, not a guarantee: as the second-to-last example shows, a buggy loop can silently skip elements instead of throwing. Never rely on CME for correctness, and never use it as a thread-safety mechanism." },
        { tip: "For multithreaded iteration say which you'd pick: <code>CopyOnWriteArrayList</code> for read-mostly lists like listener registries; <code>ConcurrentHashMap</code> for maps. And for a plain map loop that deletes: <code>map.entrySet().removeIf(e -&gt; e.getValue() == 0)</code>." }
      ]
    },
    {
      id: "comparable-vs-comparator",
      q: "Comparable vs Comparator — and how do TreeMap and PriorityQueue use them?",
      topic: "Collections",
      level: 1,
      top: true,
      short: "Comparable defines a class's single natural order through compareTo inside the class; Comparator is an external, pluggable ordering you can build per use with Comparator.comparing(...).thenComparing(...). TreeMap/TreeSet keep keys sorted in a red-black tree and PriorityQueue keeps a binary min-heap, both using compareTo unless you pass a Comparator. Trap: sorted sets treat compare() == 0 as a duplicate.",
      a: [
        { table: { head: ["", "Comparable&lt;T&gt;", "Comparator&lt;T&gt;"], rows: [
          ["Package / method", "<code>java.lang</code>, <code>int compareTo(T o)</code>", "<code>java.util</code>, <code>int compare(T a, T b)</code>"],
          ["Where", "Inside the class being sorted", "Separate object / lambda"],
          ["How many orders", "One natural order", "As many as you like"],
          ["Used by", "<code>Collections.sort(list)</code>, <code>TreeMap</code> with no comparator", "<code>list.sort(cmp)</code>, <code>new TreeMap&lt;&gt;(cmp)</code>, <code>new PriorityQueue&lt;&gt;(cmp)</code>"],
          ["Examples in JDK", "<code>String</code>, <code>Integer</code>, <code>LocalDate</code>", "<code>String.CASE_INSENSITIVE_ORDER</code>, <code>Comparator.reverseOrder()</code>"]
        ] } },
        { code: `import java.util.*;

public class Main {
    record Student(String name, int marks) implements Comparable<Student> {
        public int compareTo(Student o) { return Integer.compare(marks, o.marks); }   // natural order
    }

    public static void main(String[] args) {
        List<Student> s = new ArrayList<>(List.of(
            new Student("Ravi", 82), new Student("Asha", 91), new Student("Neel", 82)));

        Collections.sort(s);                               // uses compareTo (stable sort)
        System.out.println(s.get(0).name());               // Ravi

        s.sort(Comparator.comparingInt(Student::marks).reversed()
                         .thenComparing(Student::name));   // marks desc, then name asc
        s.forEach(x -> System.out.print(x.name() + " "));  // Asha Neel Ravi
        System.out.println();

        Set<Student> byMarks = new TreeSet<>(s);           // compare()==0 means "duplicate"!
        System.out.println(byMarks.size());                // 2 - Neel and Ravi both have 82

        // Top-2 marks: keep a MIN-heap of size k, evict the smallest
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int m : new int[]{70, 95, 60, 88, 91}) { pq.offer(m); if (pq.size() > 2) pq.poll(); }
        System.out.println(pq.poll() + " " + pq.poll());   // 91 95

        // TreeMap navigation: grade slab lookup in O(log n)
        TreeMap<Integer, String> slabs = new TreeMap<>(Map.of(0, "F", 40, "C", 60, "B", 80, "A"));
        System.out.println(slabs.floorEntry(73).getValue());   // B
    }
}`, lang: "java", title: "Natural order, chained comparators, TreeSet and a heap" },
        { ul: [
          "<b>TreeMap / TreeSet</b> — red-black tree, O(log n) put/get/remove, sorted iteration, and navigation methods: <code>floorKey</code>, <code>ceilingKey</code>, <code>headMap</code>, <code>tailMap</code>, <code>firstEntry</code>, <code>pollFirstEntry</code>. Use for leaderboards, time-ranged lookups, interval slabs.",
          "<b>PriorityQueue</b> — binary heap in an array: O(log n) <code>offer</code>/<code>poll</code>, O(1) <code>peek</code>. Min-heap by default; <code>new PriorityQueue&lt;&gt;(Comparator.reverseOrder())</code> for max-heap. Not thread-safe (<code>PriorityBlockingQueue</code> is).",
          "<b>LinkedHashMap</b> — keeps insertion (or access) order; with <code>accessOrder=true</code> + <code>removeEldestEntry</code> it is a ready-made <a href=\"#/core/sd/design-lru-cache\">LRU cache</a>."
        ] },
        { warn: "Never write <code>(a, b) -&gt; a - b</code> for ints: <code>Integer.MIN_VALUE - 1</code> overflows to a positive number and the sort silently breaks. Use <code>Integer.compare(a, b)</code> or <code>Comparator.comparingInt</code>. Also, iterating a PriorityQueue (or printing it) does <b>not</b> give sorted order — only repeated <code>poll()</code> does." },
        { tip: "Keep <code>compareTo</code> <i>consistent with equals</i> (compare == 0 exactly when equals is true), otherwise TreeSet and HashSet disagree about duplicates, as the 82-marks example shows." }
      ]
    },

    /* ───────────── Streams & Lambdas ───────────── */
    {
      id: "streams-map-filter-reduce-lazy",
      q: "Explain the Stream API: map, filter, reduce, collect — and what does lazy evaluation mean? When should you use parallel streams?",
      topic: "Streams & Lambdas",
      level: 1,
      top: true,
      short: "A stream is a one-shot pipeline: a source, zero or more lazy intermediate operations (filter, map, sorted) and one terminal operation (collect, reduce, forEach, findFirst) that actually pulls elements through. Nothing runs until the terminal op, elements flow one at a time, and short-circuiting ops stop early. parallel() splits work across the common ForkJoinPool; it only pays off for large, CPU-bound, stateless work on easily splittable sources.",
      a: [
        { p: "A <b>stream</b> is not a data structure — it is a declarative description of a computation over a source (collection, array, <code>IntStream.range</code>, file lines). Lambdas and method references (<code>String::toUpperCase</code>) implement the <a href=\"#/core/oops/marker-functional-interfaces\">functional interfaces</a> each operation expects: <code>Predicate</code> for filter, <code>Function</code> for map, <code>BinaryOperator</code> for reduce." },
        { table: { head: ["Kind", "Examples", "Notes"], rows: [
          ["Intermediate (lazy, return a Stream)", "<code>filter</code>, <code>map</code>, <code>flatMap</code>, <code>distinct</code>, <code>sorted</code>, <code>limit</code>, <code>peek</code>", "<code>sorted</code>/<code>distinct</code> are <i>stateful</i> — they must see many elements"],
          ["Terminal (eager, end the stream)", "<code>collect</code>, <code>toList</code>, <code>reduce</code>, <code>count</code>, <code>forEach</code>, <code>min</code>/<code>max</code>", "Triggers the whole pipeline"],
          ["Short-circuiting", "<code>findFirst</code>, <code>anyMatch</code>, <code>allMatch</code>, <code>limit</code>", "Can finish without reading all input — works on infinite streams"]
        ] } },
        { code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<String> names = List.of("asha", "ravi", "neel", "kabir", "zoya");

        List<String> result = names.stream()
            .filter(n -> n.length() == 4)      // intermediate (lazy)
            .map(String::toUpperCase)          // method reference
            .sorted()
            .toList();                         // terminal (Java 16): runs the pipeline
        System.out.println(result);            // [ASHA, NEEL, RAVI, ZOYA]

        int totalLen = names.stream().mapToInt(String::length).sum();   // primitive stream, no boxing
        int product  = Stream.of(1, 2, 3, 4).reduce(1, (a, b) -> a * b); // identity + accumulator
        System.out.println(totalLen + " " + product);                    // 21 24

        // Laziness: elements go through the pipeline one at a time, and stop early
        Stream.of("a", "bb", "ccc", "dddd")
            .peek(s -> System.out.println("filter " + s))
            .filter(s -> s.length() >= 2)
            .map(s -> { System.out.println("map " + s); return s.length(); })
            .findFirst()
            .ifPresent(len -> System.out.println("got " + len));
        // filter a / filter bb / map bb / got 2   - "ccc" and "dddd" are never touched
    }
}`, lang: "java", title: "A pipeline, a reduce, and laziness made visible" },
        { warn: "A stream can be consumed <b>once</b> — a second terminal operation throws <code>IllegalStateException</code>. A pipeline with no terminal operation does nothing at all. And <code>Stream.toList()</code> (Java 16) returns an <b>unmodifiable</b> list, while <code>Collectors.toList()</code> currently gives a mutable ArrayList (not guaranteed by the spec)." },
        { h: "Parallel streams" },
        { p: "<code>.parallel()</code> / <code>parallelStream()</code> splits the source with a <code>Spliterator</code> and runs chunks on <code>ForkJoinPool.commonPool()</code> (cores − 1 workers, plus the calling thread), then combines results." },
        { table: { head: ["Good fit", "Bad fit"], rows: [
          ["Large data (100k+ elements) with CPU-heavy per-element work", "Small collections — splitting overhead dominates"],
          ["Splittable sources: arrays, <code>ArrayList</code>, <code>IntStream.range</code>", "<code>LinkedList</code>, <code>Stream.iterate</code>, I/O-backed streams"],
          ["Stateless, associative ops: <code>map</code>, <code>filter</code>, <code>sum</code>, <code>reduce</code>", "Order-dependent ops: <code>findFirst</code>, <code>limit</code>, <code>forEachOrdered</code>"],
          ["Pure functions", "Blocking I/O (starves the shared common pool) or shared mutable state"]
        ] } },
        { code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> unsafe = new ArrayList<>();
        try {
            IntStream.range(0, 10_000).parallel().forEach(unsafe::add);   // data race on ArrayList!
        } catch (RuntimeException e) { System.out.println("crashed: " + e.getClass().getSimpleName()); }
        System.out.println("unsafe size: " + unsafe.size());   // often < 10000, varies per run

        List<Integer> safe = IntStream.range(0, 10_000).parallel().boxed().toList();  // let the stream collect
        long sumSq = IntStream.rangeClosed(1, 1000).parallel().mapToLong(i -> (long) i * i).sum();
        System.out.println(safe.size() + " " + sumSq);          // 10000 333833500
    }
}`, lang: "java", title: "Never mutate shared state from a parallel stream" },
        { tip: "Interview line: 'I default to sequential streams; I'd switch to parallel only after measuring, for large CPU-bound work, never for I/O — for that I use an ExecutorService or virtual threads.' Follow-up: reduce with a parallel stream needs an <b>identity</b> that is truly neutral and an <b>associative</b> accumulator, or results change between runs." }
      ]
    },
    {
      id: "collectors-groupingby",
      q: "How do you group, count and aggregate data with Collectors.groupingBy, partitioningBy and toMap?",
      topic: "Streams & Lambdas",
      level: 2,
      top: true,
      short: "groupingBy(classifier) builds a Map from each key to a List of matching elements; a second downstream collector changes what is stored per key — counting(), summingInt, averagingDouble, mapping, maxBy. partitioningBy splits into a true/false map. toMap builds a key-to-value map but throws IllegalStateException on duplicate keys unless you pass a merge function. Pass TreeMap::new or LinkedHashMap::new when you need ordered keys.",
      a: [
        { p: "This is the stream equivalent of SQL's <code>GROUP BY</code> (compare <a href=\"#/core/dbms/group-by\">GROUP BY in DBMS</a>) and the most common 'write it with streams' interview task." },
        { table: { head: ["Collector", "Result type", "SQL analogue"], rows: [
          ["<code>groupingBy(f)</code>", "<code>Map&lt;K, List&lt;T&gt;&gt;</code>", "GROUP BY f"],
          ["<code>groupingBy(f, counting())</code>", "<code>Map&lt;K, Long&gt;</code>", "COUNT(*)"],
          ["<code>groupingBy(f, averagingDouble(g))</code>", "<code>Map&lt;K, Double&gt;</code>", "AVG(g)"],
          ["<code>groupingBy(f, mapping(g, toList()))</code>", "<code>Map&lt;K, List&lt;R&gt;&gt;</code>", "ARRAY_AGG(g)"],
          ["<code>groupingBy(f, maxBy(cmp))</code>", "<code>Map&lt;K, Optional&lt;T&gt;&gt;</code>", "top row per group"],
          ["<code>partitioningBy(pred)</code>", "<code>Map&lt;Boolean, List&lt;T&gt;&gt;</code> (always both keys)", "CASE WHEN … GROUP BY"],
          ["<code>toMap(k, v, merge)</code>", "<code>Map&lt;K, V&gt;</code>", "one row per key"]
        ] } },
        { code: `import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class Main {
    record Emp(String name, String dept, double salary) {}

    public static void main(String[] args) {
        List<Emp> emps = List.of(
            new Emp("Asha", "ENG", 120), new Emp("Ravi", "ENG", 100),
            new Emp("Neel", "HR", 60),   new Emp("Zoya", "SALES", 80),
            new Emp("Kabir", "SALES", 90));

        Map<String, Long> countByDept = emps.stream()
            .collect(Collectors.groupingBy(Emp::dept, TreeMap::new, Collectors.counting()));
        System.out.println(countByDept);   // {ENG=2, HR=1, SALES=2}

        Map<String, Double> avgSal = emps.stream()
            .collect(Collectors.groupingBy(Emp::dept, TreeMap::new, Collectors.averagingDouble(Emp::salary)));
        System.out.println(avgSal);        // {ENG=110.0, HR=60.0, SALES=85.0}

        Map<String, List<String>> names = emps.stream()
            .collect(Collectors.groupingBy(Emp::dept, TreeMap::new,
                     Collectors.mapping(Emp::name, Collectors.toList())));
        System.out.println(names);         // {ENG=[Asha, Ravi], HR=[Neel], SALES=[Zoya, Kabir]}

        Map<String, Optional<Emp>> top = emps.stream()
            .collect(Collectors.groupingBy(Emp::dept, TreeMap::new,
                     Collectors.maxBy(Comparator.comparingDouble(Emp::salary))));
        top.forEach((d, e) -> System.out.println(d + " -> " + e.get().name()));   // ENG -> Asha ...

        Map<Boolean, Long> rich = emps.stream()
            .collect(Collectors.partitioningBy(e -> e.salary() >= 90, Collectors.counting()));
        System.out.println(rich);          // {false=2, true=3}

        // Classic: word frequency, keeping first-seen order
        String text = "the cat and the hat and the bat";
        Map<String, Long> freq = Arrays.stream(text.split(" "))
            .collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()));
        System.out.println(freq);          // {the=3, cat=1, and=2, hat=1, bat=1}

        // toMap with a merge function: total salary per dept
        Map<String, Double> total = emps.stream()
            .collect(Collectors.toMap(Emp::dept, Emp::salary, Double::sum, TreeMap::new));
        System.out.println(total);         // {ENG=220.0, HR=60.0, SALES=170.0}
    }
}`, lang: "java", title: "GROUP BY, the Java way" },
        { warn: "<code>Collectors.toMap(Emp::dept, Emp::salary)</code> without a merge function throws <code>IllegalStateException: Duplicate key ENG</code> as soon as two elements share a key. It also throws NPE if any <i>value</i> is null. And plain <code>groupingBy</code> returns a <code>HashMap</code> — don't promise the interviewer a sorted output unless you passed <code>TreeMap::new</code>." },
        { tip: "Practise these by hand: word/character frequency, 'highest-paid employee per department', 'second highest salary with streams' (<code>sorted(reverseOrder()).skip(1).findFirst()</code>), and 'group anagrams' (<code>groupingBy</code> on the sorted characters of each word)." }
      ]
    },
    {
      id: "optional-pitfalls",
      q: "What is Optional for, and what are the common mistakes people make with it?",
      topic: "Streams & Lambdas",
      level: 2,
      top: false,
      short: "Optional is a container that makes 'this method may return no value' explicit in the return type, so callers handle absence with map, orElse, orElseGet or orElseThrow instead of null checks. Common mistakes: calling get() without checking, using isPresent()+get() like a null check, orElse(expensiveCall()) which always evaluates its argument, Optional.of(null), and using Optional for fields, parameters or collections.",
      a: [
        { p: "<code>Optional&lt;T&gt;</code> (Java 8) was designed for <b>method return types</b> where 'no result' is a normal outcome — e.g. <code>findById</code>, <code>stream.findFirst()</code>, <code>max()</code>. It forces the caller to think about the empty case." },
        { code: `import java.util.*;

public class Main {
    static Map<Integer, String> db = Map.of(1, "Asha", 2, "Ravi");

    static Optional<String> findName(int id) { return Optional.ofNullable(db.get(id)); }
    static String expensiveDefault() { System.out.println("  (computing default)"); return "Guest"; }

    public static void main(String[] args) {
        System.out.println(findName(1).map(String::toUpperCase).orElse("NONE"));   // ASHA
        System.out.println(findName(9).orElse("NONE"));                           // NONE

        System.out.println("orElse:");
        findName(1).orElse(expensiveDefault());          // argument evaluated even though a value exists!
        System.out.println("orElseGet:");
        findName(1).orElseGet(Main::expensiveDefault);   // supplier never called

        try { Optional.of(null); }
        catch (NullPointerException e) { System.out.println("Optional.of(null) -> NPE"); }
        try { findName(9).get(); }
        catch (NoSuchElementException e) { System.out.println("get() on empty -> " + e.getMessage()); }
        try { findName(9).orElseThrow(() -> new IllegalArgumentException("no user 9")); }
        catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }
    }
}`, lang: "java", title: "orElse vs orElseGet, and the exceptions" },
        { code: `ASHA
NONE
orElse:
  (computing default)
orElseGet:
Optional.of(null) -> NPE
get() on empty -> No value present
no user 9`, lang: "text", title: "Output" },
        { table: { head: ["Don't", "Do instead"], rows: [
          ["<code>if (opt.isPresent()) return opt.get();</code>", "<code>opt.map(...).orElse(...)</code> / <code>ifPresentOrElse</code>"],
          ["<code>opt.get()</code>", "<code>opt.orElseThrow()</code> (Java 10) — same behaviour, honest name"],
          ["<code>orElse(dbCall())</code>", "<code>orElseGet(() -&gt; dbCall())</code> — lazy"],
          ["<code>Optional.of(maybeNull)</code>", "<code>Optional.ofNullable(maybeNull)</code>"],
          ["Optional fields / method parameters", "Nullable field + Optional-returning getter; overloads for parameters"],
          ["<code>Optional&lt;List&lt;T&gt;&gt;</code>", "Return an empty list"],
          ["Returning <code>null</code> from an Optional method", "Return <code>Optional.empty()</code> — a null Optional defeats the purpose"]
        ] } },
        { p: "Chaining: <code>map</code> transforms the value if present; <code>flatMap</code> is for functions that themselves return Optional (avoids <code>Optional&lt;Optional&lt;T&gt;&gt;</code>); <code>filter</code> keeps it only if a predicate holds; <code>or(() -&gt; other)</code> (Java 9) supplies an alternative Optional; <code>stream()</code> (Java 9) turns it into a 0- or 1-element stream." },
        { warn: "Optional is not <code>Serializable</code> and costs an extra object, which is why it shouldn't be a field in entities/DTOs. Use <code>OptionalInt</code>/<code>OptionalDouble</code> for primitives." },
        { tip: "One-liner for the interviewer: 'Optional is a return-type contract that says absence is expected, not a general null replacement.'" }
      ]
    },

    /* ───────────── Concurrency ───────────── */
    {
      id: "executorservice-runnable-callable",
      q: "Thread vs Runnable vs Callable — and why should you use an ExecutorService instead of creating threads yourself?",
      topic: "Concurrency",
      level: 1,
      top: true,
      short: "Runnable is a task with no result that cannot throw checked exceptions; Callable returns a value and can throw. A Thread is the worker that runs a task; extending Thread wastes your one superclass. ExecutorService manages a pool of reusable threads with a task queue: you submit Runnables or Callables, get Futures back, and avoid the cost and danger of creating one OS thread per task. Configure pools with bounded queues and always shut them down.",
      a: [
        { table: { head: ["", "extends Thread", "Runnable", "Callable&lt;V&gt;"], rows: [
          ["Method", "<code>run()</code>", "<code>void run()</code>", "<code>V call() throws Exception</code>"],
          ["Returns a value", "No", "No", "Yes, via <code>Future&lt;V&gt;</code>"],
          ["Checked exceptions", "No", "No", "Yes"],
          ["Can extend another class", "No (single inheritance used up)", "Yes", "Yes"],
          ["Run it with", "<code>t.start()</code>", "<code>new Thread(r)</code> or executor", "Executor only (<code>submit</code>, <code>invokeAll</code>)"]
        ] } },
        { code: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Runnable r = () -> System.out.println("runnable: no result");
        Callable<Integer> c = () -> 6 * 7;           // returns a value, may throw checked exceptions

        Thread t = new Thread(r);
        t.start();                                   // start() = new thread; calling run() = same thread!
        t.join();

        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            Future<Integer> f = pool.submit(c);
            System.out.println("callable: " + f.get());   // blocks until done -> 42

            List<Callable<String>> jobs = List.of(() -> "A", () -> "B", () -> "C");
            for (Future<String> res : pool.invokeAll(jobs)) System.out.print(res.get());
            System.out.println();                    // ABC - futures come back in submission order

            Future<?> bad = pool.submit(() -> { throw new IllegalStateException("boom"); });
            try { bad.get(); }
            catch (ExecutionException e) { System.out.println("wrapped: " + e.getCause()); }
        } finally {
            pool.shutdown();                         // stop accepting; queued tasks still finish
            pool.awaitTermination(5, TimeUnit.SECONDS);
        }
    }
}`, lang: "java", title: "Runnable, Callable, Future" },
        { p: "<b>Why a pool?</b> A platform thread is an OS thread (~1 MB reserved stack, kernel scheduling, creation cost — see <a href=\"#/core/os/process-vs-thread\">process vs thread</a>). Creating one per request doesn't scale and has no back-pressure. A pool reuses N threads and queues the rest. <code>ThreadPoolExecutor</code> decides like this:" },
        { svg: `<svg viewBox="0 0 700 140" width="700" class="dg">
  <rect class="box-a" x="10" y="50" width="90" height="34" rx="6"/><text class="tx tx-b" x="55" y="67" text-anchor="middle" dominant-baseline="middle">submit(task)</text>
  <rect class="box" x="130" y="50" width="130" height="34" rx="6"/><text class="tx" x="195" y="67" text-anchor="middle" dominant-baseline="middle">threads &lt; core?</text>
  <rect class="box" x="290" y="50" width="120" height="34" rx="6"/><text class="tx" x="350" y="67" text-anchor="middle" dominant-baseline="middle">queue has room?</text>
  <rect class="box" x="440" y="50" width="120" height="34" rx="6"/><text class="tx" x="500" y="67" text-anchor="middle" dominant-baseline="middle">threads &lt; max?</text>
  <rect class="box-r" x="590" y="50" width="100" height="34" rx="6"/><text class="tx tx-b" x="640" y="67" text-anchor="middle" dominant-baseline="middle">reject policy</text>
  <line class="ln" x1="100" y1="67" x2="128" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="260" y1="67" x2="288" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="410" y1="67" x2="438" y2="67" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="560" y1="67" x2="588" y2="67" marker-end="url(#dg-arr)"/>
  <text class="tx tx-m" x="268" y="60">no</text><text class="tx tx-m" x="418" y="60">no</text><text class="tx tx-m" x="566" y="60">no</text>
  <line class="ln-a" x1="195" y1="84" x2="195" y2="112" marker-end="url(#dg-arr-a)"/><text class="tx tx-a" x="195" y="128" text-anchor="middle">yes: new core thread</text>
  <line class="ln-a" x1="350" y1="84" x2="350" y2="112" marker-end="url(#dg-arr-a)"/><text class="tx tx-a" x="350" y="128" text-anchor="middle">yes: enqueue</text>
  <line class="ln-a" x1="500" y1="84" x2="500" y2="112" marker-end="url(#dg-arr-a)"/><text class="tx tx-a" x="500" y="128" text-anchor="middle">yes: extra thread</text>
  <text class="tx tx-s" x="350" y="25" text-anchor="middle">Extra threads beyond core are created only when the queue is FULL</text>
</svg>`, caption: "ThreadPoolExecutor's decision order" },
        { table: { head: ["Factory", "Under the hood", "Risk"], rows: [
          ["<code>newFixedThreadPool(n)</code>", "n threads, <b>unbounded</b> <code>LinkedBlockingQueue</code>", "Queue grows without limit → OOM under load"],
          ["<code>newCachedThreadPool()</code>", "0..∞ threads, <code>SynchronousQueue</code>", "Thread explosion under load"],
          ["<code>newSingleThreadExecutor()</code>", "1 thread, unbounded queue", "Same queue risk; good for ordered work"],
          ["<code>newScheduledThreadPool(n)</code>", "Delayed / periodic tasks", "—"],
          ["<code>newVirtualThreadPerTaskExecutor()</code> (21)", "One virtual thread per task", "See virtual threads question"]
        ] } },
        { code: `import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        int cores = Runtime.getRuntime().availableProcessors();
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            cores, cores * 2,                          // core and max threads
            60, TimeUnit.SECONDS,                      // idle extra threads die after 60 s
            new ArrayBlockingQueue<>(100),             // BOUNDED queue = back-pressure
            new ThreadPoolExecutor.CallerRunsPolicy()); // when saturated, the submitter runs the task
        for (int i = 0; i < 5; i++) {
            int id = i;
            pool.execute(() -> System.out.println("task " + id));
        }
        pool.shutdown();
        System.out.println(pool.awaitTermination(5, TimeUnit.SECONDS));   // true
    }
}`, lang: "java", title: "A production-style pool" },
        { tip: "Sizing rule of thumb: CPU-bound ≈ number of cores; I/O-bound ≈ cores × (1 + wait time / compute time). Know <code>shutdown()</code> (graceful) vs <code>shutdownNow()</code> (interrupts running tasks, returns queued ones), and that since Java 19 <code>ExecutorService</code> is <code>AutoCloseable</code>, so try-with-resources waits for tasks on close." }
      ]
    },
    {
      id: "synchronized-vs-reentrantlock",
      q: "What is the difference between synchronized and ReentrantLock? When would you choose each?",
      topic: "Concurrency",
      level: 2,
      top: true,
      short: "Both give mutual exclusion and memory visibility, and both are reentrant. synchronized uses the object's built-in monitor, is released automatically when the block exits, and is simpler. ReentrantLock is an explicit lock object that adds tryLock with timeout, interruptible waiting, optional fairness and multiple Condition queues, but you must unlock in a finally block. Default to synchronized; reach for ReentrantLock when you need those extras.",
      a: [
        { p: "Every Java object has an intrinsic lock (a <a href=\"#/core/os/monitors\">monitor</a>). <code>synchronized</code> acquires it on entry and releases it on exit — even on an exception. <code>java.util.concurrent.locks.ReentrantLock</code> (Java 5) is a library lock with the same core semantics plus more control. <b>Reentrant</b> means a thread already holding the lock can acquire it again (a hold count is kept), so a synchronized method can call another synchronized method on the same object." },
        { code: `import java.util.concurrent.*;
import java.util.concurrent.locks.*;

public class Main {
    static int a = 0, b = 0;
    static final Object mon = new Object();
    static final ReentrantLock lock = new ReentrantLock();

    static void incA() { synchronized (mon) { a++; } }    // released automatically, even on exception

    static void incB() {
        lock.lock();
        try { b++; }
        finally { lock.unlock(); }                          // MUST unlock in finally
    }

    public static void main(String[] args) throws Exception {
        Thread[] ts = new Thread[4];
        for (int i = 0; i < 4; i++) {
            ts[i] = new Thread(() -> { for (int j = 0; j < 100_000; j++) { incA(); incB(); } });
            ts[i].start();
        }
        for (Thread t : ts) t.join();
        System.out.println(a + " " + b);                    // 400000 400000

        if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {     // give up instead of blocking forever
            try { System.out.println("got lock, hold count = " + lock.getHoldCount()); }
            finally { lock.unlock(); }
        }
    }
}`, lang: "java", title: "Same counter, two locks" },
        { table: { head: ["", "synchronized", "ReentrantLock"], rows: [
          ["Release", "Automatic at block exit", "Manual <code>unlock()</code> in <code>finally</code>"],
          ["Try without blocking / timeout", "No", "<code>tryLock()</code>, <code>tryLock(t, unit)</code>"],
          ["Interruptible wait", "No — a blocked thread ignores interrupts", "<code>lockInterruptibly()</code>"],
          ["Fairness", "No guarantee", "<code>new ReentrantLock(true)</code> — FIFO-ish, slower"],
          ["Wait/notify", "<code>wait()</code>/<code>notify()</code>, one wait set per object", "Multiple <code>Condition</code>s: <code>notFull</code>, <code>notEmpty</code>"],
          ["Lock spanning methods", "Block-structured only", "Can lock in one method, unlock in another"],
          ["Performance", "Comparable on modern JVMs", "Comparable"]
        ] } },
        { p: "Related tools: <code>ReentrantReadWriteLock</code> (many readers or one writer — good for read-heavy caches) and <code>StampedLock</code> (Java 8, optimistic reads). For simple counters, skip locks entirely and use atomics." },
        { warn: "Java 21 virtual threads get <b>pinned</b> to their carrier thread when they block inside a <code>synchronized</code> block, hurting scalability; on 21 the advice was to use <code>ReentrantLock</code> around blocking I/O. JDK 24 (JEP 491) removed most of this pinning. Also: forgetting <code>unlock()</code> on an exception path leaves the lock held forever — that's why <code>finally</code> is non-negotiable." },
        { tip: "Answer with a concrete use for each extra: tryLock with timeout to avoid deadlock in a money transfer, lockInterruptibly for cancellable tasks, two Conditions for a bounded buffer (<a href=\"#/core/os/producer-consumer\">producer–consumer</a>)." }
      ]
    },
    {
      id: "volatile-vs-atomic",
      q: "What does volatile do? Why isn't it enough for count++, and how do AtomicInteger and CAS fix it?",
      topic: "Concurrency",
      level: 2,
      top: true,
      short: "volatile guarantees visibility and ordering: every read sees the latest write, and writes before a volatile write are visible to a thread that reads it. It does not make compound actions atomic, and count++ is read-modify-write, so two threads can still lose updates. AtomicInteger uses a hardware compare-and-swap loop to make increments atomic without locks; LongAdder is faster under heavy contention.",
      a: [
        { p: "Without synchronization, the JIT and CPU may keep a variable in a register or cache and reorder instructions, so one thread may <b>never see</b> another's write. Marking a field <code>volatile</code> forbids that: reads and writes go to main memory semantics and create a <b>happens-before</b> edge." },
        { code: `import java.util.concurrent.atomic.*;

public class Main {
    static volatile boolean running = true;     // visibility: the worker sees the update
    static volatile int volatileCount = 0;      // visible, but ++ is NOT atomic
    static final AtomicInteger atomicCount = new AtomicInteger();

    public static void main(String[] args) throws Exception {
        Thread worker = new Thread(() -> {
            while (running) { }                 // without volatile this loop may spin forever
            System.out.println("worker stopped");
        });
        worker.start();
        Thread.sleep(50);
        running = false;
        worker.join();

        Runnable inc = () -> {
            for (int i = 0; i < 100_000; i++) { volatileCount++; atomicCount.incrementAndGet(); }
        };
        Thread t1 = new Thread(inc), t2 = new Thread(inc);
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("volatile: " + volatileCount);      // usually LESS than 200000 (lost updates)
        System.out.println("atomic:   " + atomicCount.get());  // always 200000
    }
}`, lang: "java", title: "Visibility vs atomicity" },
        { p: "<code>count++</code> is three steps: read, add, write. Two threads can both read 5 and both write 6 — a <a href=\"#/core/os/race-condition\">race condition</a>. <code>AtomicInteger.incrementAndGet()</code> uses <b>CAS</b> (compare-and-swap, a single CPU instruction like <code>LOCK CMPXCHG</code>): 'set to 6 only if it is still 5, otherwise retry'. See <a href=\"#/core/os/test-and-set-cas\">test-and-set / CAS</a>." },
        { table: { head: ["Tool", "Guarantees", "Use for"], rows: [
          ["<code>volatile</code>", "Visibility + ordering, atomic single read/write (even long/double)", "Flags, publishing an immutable object, double-checked locking"],
          ["<code>AtomicInteger</code> / <code>AtomicLong</code> / <code>AtomicReference</code>", "Atomic read-modify-write via CAS", "Counters, sequence numbers, lock-free updates (<code>updateAndGet</code>)"],
          ["<code>LongAdder</code>", "Striped counters summed on read", "Very hot counters (metrics) — less CAS contention"],
          ["<code>synchronized</code> / locks", "Atomicity of whole blocks + visibility", "Invariants across several variables"]
        ] } },
        { code: `public class Main {
    private static volatile Main instance;           // volatile is REQUIRED here

    static Main getInstance() {
        Main local = instance;
        if (local == null) {                         // 1st check, no lock
            synchronized (Main.class) {
                local = instance;
                if (local == null) instance = local = new Main();   // 2nd check, under lock
            }
        }
        return local;
    }

    public static void main(String[] args) {
        System.out.println(getInstance() == getInstance());   // true
    }
}`, lang: "java", title: "Double-checked locking needs volatile" },
        { warn: "Without <code>volatile</code>, the write of <code>instance</code> can be reordered before the constructor finishes, so another thread may see a non-null but half-built object. Simpler alternatives: an <code>enum</code> singleton or the holder-class idiom (see <a href=\"#/core/oops/singleton-pattern\">singleton pattern</a>)." },
        { tip: "Mention the ABA problem as the CAS follow-up (value changes A→B→A and CAS can't tell) and that <code>AtomicStampedReference</code> fixes it with a version stamp." }
      ]
    },
    {
      id: "completablefuture",
      q: "What is CompletableFuture and how do you compose async calls with it?",
      topic: "Concurrency",
      level: 3,
      top: false,
      short: "CompletableFuture (Java 8) is a Future you can complete and chain without blocking: supplyAsync starts work, thenApply transforms a result, thenCompose chains a dependent async call, thenCombine merges two independent ones, allOf waits for many, and exceptionally or handle recover from failures. By default async stages run on the ForkJoinPool common pool, so pass your own executor for blocking I/O.",
      a: [
        { p: "A plain <code>Future</code> only offers a blocking <code>get()</code>. <code>CompletableFuture</code> adds a callback pipeline, so a service that calls user-service and price-service can run both in parallel and combine them — total latency ≈ the slower call, not the sum." },
        { code: `import java.util.concurrent.*;

public class Main {
    static String fetchUser(int id)    { sleep(200); return "user" + id; }
    static double fetchPrice(String p) { sleep(300); return 499.0; }
    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { throw new RuntimeException(e); }
    }

    public static void main(String[] args) {
        ExecutorService io = Executors.newFixedThreadPool(4);   // don't block the common pool with I/O
        long start = System.currentTimeMillis();

        CompletableFuture<String> user  = CompletableFuture.supplyAsync(() -> fetchUser(7), io);
        CompletableFuture<Double> price = CompletableFuture.supplyAsync(() -> fetchPrice("book"), io);

        String receipt = user.thenCombine(price, (u, p) -> u + " pays " + p)   // both run in parallel
                             .thenApply(String::toUpperCase)
                             .join();
        long ms = System.currentTimeMillis() - start;
        System.out.println(receipt);                                   // USER7 PAYS 499.0
        System.out.println(ms < 450 ? "parallel (~300 ms)" : "sequential (~500 ms)");

        String safe = CompletableFuture.supplyAsync(() -> {
                if (true) throw new IllegalStateException("down");
                return "ok";
            }, io)
            .exceptionally(ex -> "fallback (" + ex.getCause().getMessage() + ")")
            .join();
        System.out.println(safe);                                      // fallback (down)

        CompletableFuture<String> chained = CompletableFuture.supplyAsync(() -> 7, io)
            .thenCompose(id -> CompletableFuture.supplyAsync(() -> fetchUser(id), io));  // like flatMap
        System.out.println(chained.join());                            // user7
        io.shutdown();
    }
}`, lang: "java", title: "Fan out, combine, recover" },
        { table: { head: ["Method", "Takes", "Analogy"], rows: [
          ["<code>thenApply(fn)</code>", "T → U", "<code>map</code>"],
          ["<code>thenCompose(fn)</code>", "T → CompletableFuture&lt;U&gt;", "<code>flatMap</code> — dependent async call"],
          ["<code>thenCombine(other, bifn)</code>", "two independent results", "zip"],
          ["<code>thenAccept</code> / <code>thenRun</code>", "consume / no input", "side effect at the end"],
          ["<code>allOf(...)</code> / <code>anyOf(...)</code>", "many futures", "wait for all / first"],
          ["<code>exceptionally</code> / <code>handle</code> / <code>whenComplete</code>", "error (and result)", "catch / finally"],
          ["<code>orTimeout</code> / <code>completeOnTimeout</code> (Java 9)", "duration", "timeouts"]
        ] } },
        { warn: "Exceptions thrown inside an async stage arrive wrapped in <code>CompletionException</code> — hence <code>ex.getCause()</code>. <code>join()</code> throws unchecked <code>CompletionException</code>; <code>get()</code> throws checked <code>ExecutionException</code>. And the <code>*Async</code> variants without an executor all share <code>ForkJoinPool.commonPool()</code> — a few blocking calls there can stall every parallel stream in the JVM." },
        { tip: "In Java 21 an alternative for blocking-style code is virtual threads: write plain sequential calls in two virtual threads and join them. CompletableFuture still shines for composing pipelines and timeouts, and it underpins Spring's <code>@Async</code> return types." }
      ]
    },
    {
      id: "deadlock-in-java",
      q: "Write a program that causes a deadlock in Java. How do you detect and prevent it?",
      topic: "Concurrency",
      level: 2,
      top: true,
      short: "Two threads each hold one lock and wait for the lock the other holds: thread 1 locks A then B, thread 2 locks B then A. Detect it with a thread dump (jstack or jcmd Thread.print shows 'Found one Java-level deadlock') or ThreadMXBean.findDeadlockedThreads. Prevent it by acquiring locks in one global order, using tryLock with a timeout, holding locks briefly and never calling unknown code while holding a lock.",
      a: [
        { p: "A deadlock needs all four <a href=\"#/core/os/deadlock-conditions\">Coffman conditions</a>: mutual exclusion, hold-and-wait, no preemption and circular wait. In Java the usual culprit is <b>inconsistent lock ordering</b> with nested <code>synchronized</code> blocks." },
        { code: `import java.lang.management.*;

public class Main {
    static final Object A = new Object(), B = new Object();
    static void sleep(long ms) { try { Thread.sleep(ms); } catch (InterruptedException ignored) { } }

    public static void main(String[] args) throws Exception {
        Thread t1 = new Thread(() -> {
            synchronized (A) { sleep(100); synchronized (B) { System.out.println("t1 done"); } }
        }, "T1");
        Thread t2 = new Thread(() -> {
            synchronized (B) { sleep(100); synchronized (A) { System.out.println("t2 done"); } }
        }, "T2");
        t1.setDaemon(true); t2.setDaemon(true);   // only so this demo can still exit
        t1.start(); t2.start();
        Thread.sleep(500);

        ThreadMXBean mx = ManagementFactory.getThreadMXBean();
        long[] ids = mx.findDeadlockedThreads();
        System.out.println("deadlocked threads: " + (ids == null ? 0 : ids.length));   // 2
        for (ThreadInfo info : mx.getThreadInfo(ids))
            System.out.println(info.getThreadName() + " waits for lock held by " + info.getLockOwnerName());
    }
}`, lang: "java", title: "Deadlock, then detect it from inside the JVM" },
        { code: `deadlocked threads: 2
T2 waits for lock held by T1
T1 waits for lock held by T2`, lang: "text", title: "Output (line order may vary)" },
        { p: "<b>Detect in production:</b> <code>jstack &lt;pid&gt;</code> or <code>jcmd &lt;pid&gt; Thread.print</code> ends with <i>Found one Java-level deadlock</i> and lists who holds what. VisualVM / JConsole have a 'Detect Deadlock' button. Symptom: CPU near 0, requests hang." },
        { code: `class Account {
    final int id; int balance;
    Account(int id, int balance) { this.id = id; this.balance = balance; }
}

public class Main {
    // Fix: always lock the account with the smaller id first -> no circular wait
    static void transfer(Account from, Account to, int amt) {
        Account first = from.id < to.id ? from : to;
        Account second = (first == from) ? to : from;
        synchronized (first) {
            synchronized (second) { from.balance -= amt; to.balance += amt; }
        }
    }

    public static void main(String[] args) throws Exception {
        Account x = new Account(1, 1000), y = new Account(2, 1000);
        Thread t1 = new Thread(() -> { for (int i = 0; i < 10_000; i++) transfer(x, y, 1); });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 10_000; i++) transfer(y, x, 1); });
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println(x.balance + " " + y.balance);   // 1000 1000 - and it always finishes
    }
}`, lang: "java", title: "Prevention by global lock ordering" },
        { ul: [
          "<b>Lock ordering</b> — break circular wait (shown above).",
          "<b>tryLock with timeout</b> — <code>ReentrantLock.tryLock(50, ms)</code>; on failure release what you hold, back off, retry.",
          "<b>Smaller critical sections</b> — never do I/O or call callbacks/alien methods while holding a lock.",
          "<b>Higher-level tools</b> — <code>ConcurrentHashMap</code>, <code>BlockingQueue</code>, atomics, so you rarely hold two locks."
        ] },
        { tip: "Distinguish the neighbours: <b>livelock</b> (threads keep reacting to each other, no progress, CPU busy) and <b>starvation</b> (a thread never gets the lock, e.g. with unfair locks). Database deadlocks are a separate topic — see <a href=\"#/core/dbms/deadlock-dbms\">deadlock in DBMS</a>." }
      ]
    },
    {
      id: "virtual-threads",
      q: "What are virtual threads in Java 21? How are they different from platform threads, and when should you use them?",
      topic: "Concurrency",
      level: 2,
      top: true,
      short: "Virtual threads (final in Java 21, JEP 444) are lightweight threads managed by the JVM, not the OS. Millions can exist because they are cheap heap objects that get mounted on a small pool of carrier platform threads and unmounted whenever they block on I/O. They make simple blocking thread-per-request code scale like async code. Use them for I/O-bound concurrency, not CPU-bound work; don't pool them, and watch for pinning and heavy ThreadLocal use.",
      a: [
        { p: "A <b>platform thread</b> is a thin wrapper over an OS thread (1:1, see <a href=\"#/core/os/user-vs-kernel-threads\">user vs kernel threads</a>): ~1 MB stack reserved, expensive to create, a few thousand per machine. A <b>virtual thread</b> is a <code>java.lang.Thread</code> whose stack lives on the heap as small chunks; the JVM schedules it M:N onto <b>carrier</b> threads (a ForkJoinPool sized to the core count). When it hits a blocking call (socket read, <code>sleep</code>, <code>BlockingQueue.take</code>) the JVM <b>unmounts</b> it and the carrier runs another virtual thread." },
        { code: `import java.time.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Instant start = Instant.now();
        try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {
            IntStream.range(0, 10_000).forEach(i ->
                ex.submit(() -> { Thread.sleep(Duration.ofSeconds(1)); return i; }));
        }   // close() waits for every task
        long ms = Duration.between(start, Instant.now()).toMillis();
        System.out.println("10,000 blocking tasks done in " + (ms < 3000 ? "about 1 second" : ms + " ms"));

        Thread vt = Thread.ofVirtual().name("v1").start(() ->
            System.out.println("virtual? " + Thread.currentThread().isVirtual()));   // virtual? true
        vt.join();
    }
}`, lang: "java", title: "10,000 sleeping tasks in about a second" },
        { p: "With a fixed pool of 200 platform threads the same job would take ~50 seconds (10,000 / 200 batches)." },
        { table: { head: ["", "Platform thread", "Virtual thread"], rows: [
          ["Backed by", "One OS thread for its whole life", "Mounted on a carrier only while running"],
          ["Creation cost / memory", "High (~1 MB stack reserved)", "Tiny (a few hundred bytes to KBs)"],
          ["How many", "Thousands", "Millions"],
          ["Blocking I/O", "Blocks the OS thread", "Unmounts; carrier is freed"],
          ["Best for", "CPU-bound work, long-lived workers", "High-concurrency I/O: HTTP calls, DB queries, request handling"],
          ["Pooling", "Yes (expensive to create)", "<b>No</b> — create one per task"],
          ["API", "<code>new Thread</code>, <code>Thread.ofPlatform()</code>", "<code>Thread.ofVirtual()</code>, <code>Thread.startVirtualThread</code>, <code>newVirtualThreadPerTaskExecutor()</code>"]
        ] } },
        { warn: "<b>Pinning</b>: on Java 21, a virtual thread that blocks inside <code>synchronized</code> or a native call cannot unmount and holds its carrier hostage — use <code>ReentrantLock</code> around blocking I/O there (largely fixed in JDK 24 by JEP 491). They do not make CPU-bound code faster. To limit concurrency to a fragile downstream (e.g. 20 DB connections), use a <code>Semaphore</code>, not a small pool of virtual threads. Huge numbers of threads each with big <code>ThreadLocal</code> caches can blow memory." },
        { tip: "Frameworks: Spring Boot 3.2+ runs request handling on virtual threads with <code>spring.threads.virtual.enabled=true</code>. Related previews you can name: <i>structured concurrency</i> and <i>scoped values</i>. One-liner: 'virtual threads give you async scalability with synchronous, debuggable code.'" }
      ]
    },

    /* ───────────── JVM Internals ───────────── */
    {
      id: "jvm-memory-areas-oom",
      q: "Explain the JVM memory areas. What kinds of OutOfMemoryError can you get, and what causes each?",
      topic: "JVM Internals",
      level: 2,
      top: true,
      short: "Shared by all threads: the heap (objects, split into young and old generations) and the metaspace (class metadata, native memory since Java 8, replacing PermGen), plus the code cache for JIT-compiled code. Per thread: a JVM stack of frames (locals, operand stack), a PC register and a native method stack. Heap exhaustion gives 'Java heap space' or 'GC overhead limit exceeded', too many classes gives 'Metaspace', too many threads 'unable to create native thread', and deep recursion gives StackOverflowError instead.",
      a: [
        { svg: `<svg viewBox="0 0 660 230" width="660" class="dg">
  <text class="tx tx-b" x="20" y="20">Shared by all threads</text>
  <rect class="box-a" x="20" y="32" width="300" height="80" rx="6"/>
  <text class="tx tx-b" x="170" y="48" text-anchor="middle">Heap (-Xms / -Xmx)</text>
  <rect class="box" x="32" y="60" width="64" height="40" rx="4"/><text class="tx tx-s" x="64" y="80" text-anchor="middle" dominant-baseline="middle">Eden</text>
  <rect class="box" x="102" y="60" width="40" height="40" rx="4"/><text class="tx tx-s" x="122" y="80" text-anchor="middle" dominant-baseline="middle">S0</text>
  <rect class="box" x="148" y="60" width="40" height="40" rx="4"/><text class="tx tx-s" x="168" y="80" text-anchor="middle" dominant-baseline="middle">S1</text>
  <rect class="box-p" x="196" y="60" width="112" height="40" rx="4"/><text class="tx tx-s" x="252" y="80" text-anchor="middle" dominant-baseline="middle">Old generation</text>
  <rect class="box-g" x="340" y="32" width="140" height="36" rx="6"/><text class="tx" x="410" y="50" text-anchor="middle" dominant-baseline="middle">Metaspace (native)</text>
  <rect class="box-g" x="340" y="76" width="140" height="36" rx="6"/><text class="tx" x="410" y="94" text-anchor="middle" dominant-baseline="middle">Code cache (JIT)</text>
  <text class="tx tx-b" x="20" y="142">Per thread</text>
  <rect class="box-w" x="20" y="154" width="140" height="56" rx="6"/><text class="tx" x="90" y="174" text-anchor="middle">JVM stack</text><text class="tx tx-s" x="90" y="194" text-anchor="middle">frames: locals, operands</text>
  <rect class="box-w" x="176" y="154" width="110" height="56" rx="6"/><text class="tx" x="231" y="182" text-anchor="middle" dominant-baseline="middle">PC register</text>
  <rect class="box-w" x="302" y="154" width="150" height="56" rx="6"/><text class="tx" x="377" y="182" text-anchor="middle" dominant-baseline="middle">Native method stack</text>
  <text class="tx tx-m" x="500" y="170">x one set per thread</text>
  <text class="tx tx-m" x="500" y="54">class data, static</text>
  <text class="tx tx-m" x="500" y="70">refs live in heap</text>
</svg>`, caption: "HotSpot runtime data areas (Java 8+)" },
        { table: { head: ["Area", "Holds", "Shared?", "Error when full"], rows: [
          ["Heap", "All objects and arrays (incl. static field values since Java 8, string pool since Java 7)", "Yes", "<code>OutOfMemoryError: Java heap space</code>"],
          ["Metaspace", "Class metadata, method bytecode, constant pools", "Yes", "<code>OutOfMemoryError: Metaspace</code>"],
          ["Code cache", "JIT-compiled native code", "Yes", "Warning 'CodeCache is full', JIT stops compiling"],
          ["JVM stack", "One frame per method call: local variables, operand stack, return address", "Per thread", "<code>StackOverflowError</code>"],
          ["PC register", "Address of the current bytecode instruction", "Per thread", "—"],
          ["Native method stack", "Frames of native (JNI) code", "Per thread", "<code>StackOverflowError</code>"]
        ] } },
        { table: { head: ["OutOfMemoryError message", "Typical cause", "First fix"], rows: [
          ["<code>Java heap space</code>", "Memory leak (static map / cache that only grows, unclosed listeners) or genuinely too-small <code>-Xmx</code>", "Heap dump → find the biggest retainer in Eclipse MAT"],
          ["<code>GC overhead limit exceeded</code>", "Parallel GC spends &gt; 98% of time collecting while freeing &lt; 2% — heap almost full", "Same as above"],
          ["<code>Metaspace</code>", "Classloader leak (redeploys in app servers), runaway dynamic proxies/bytecode generation", "<code>-XX:MaxMetaspaceSize</code>, fix the leak"],
          ["<code>unable to create native thread</code>", "Too many threads for OS limits/memory — unbounded thread creation", "Use a pool or virtual threads"],
          ["<code>Requested array size exceeds VM limit</code>", "Array close to <code>Integer.MAX_VALUE</code> elements", "Chunk the data"],
          ["<code>Direct buffer memory</code>", "NIO <code>ByteBuffer.allocateDirect</code> beyond <code>-XX:MaxDirectMemorySize</code>", "Release / reuse buffers"]
        ] } },
        { code: `public class Main {
    static int depth = 0;
    static void recurse() { depth++; recurse(); }      // no base case

    public static void main(String[] args) {
        try { recurse(); }
        catch (StackOverflowError e) {                 // an Error, not an OOM
            System.out.println("StackOverflowError, depth > 1000: " + (depth > 1000));
        }
        Runtime rt = Runtime.getRuntime();
        System.out.println("max heap MB > 0: " + (rt.maxMemory() / (1024 * 1024) > 0));
    }
}`, lang: "java", title: "Stack depth is limited per thread (-Xss)" },
        { warn: "Java has no manual <code>free</code>, but it absolutely has memory leaks: any object still reachable from a GC root (a static collection, a running thread, a ThreadLocal in a pooled thread) is never collected. See <a href=\"#/core/oops/memory-leaks-java\">memory leaks in Java</a> and <a href=\"#/core/oops/stack-vs-heap\">stack vs heap</a>." },
        { tip: "Show you have debugged one: 'I'd run with <code>-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp</code>, open the .hprof in Eclipse MAT or VisualVM, look at the dominator tree, and follow the path to GC roots of the biggest object.'" }
      ]
    },
    {
      id: "class-loading-and-jit",
      q: "How does class loading work in the JVM, and what does the JIT compiler do?",
      topic: "JVM Internals",
      level: 3,
      top: false,
      short: "A class is loaded lazily on first use in three phases: loading (a class loader finds the bytes), linking (verify the bytecode, prepare static fields with defaults, resolve symbolic references) and initialization (run static initializers). Loaders form a parent-delegation chain: application asks platform, which asks bootstrap, before trying itself. The JIT watches which methods are hot and compiles them to optimized native code in tiers (C1 then C2), using inlining and escape analysis, which is why Java programs warm up.",
      a: [
        { ol: [
          "<b>Loading</b> — a <code>ClassLoader</code> reads the <code>.class</code> bytes (from a JAR, module, network…) and creates a <code>Class</code> object in metaspace.",
          "<b>Linking</b> — <i>verify</i> (bytecode is type-safe, no stack overflow tricks), <i>prepare</i> (allocate static fields with default values 0/null/false), <i>resolve</i> (symbolic references → direct references, often lazily).",
          "<b>Initialization</b> — run <code>&lt;clinit&gt;</code>: static field initializers and <code>static {}</code> blocks, in textual order, exactly once, thread-safely. Triggered by the first <i>active use</i>: <code>new</code>, static method call, non-constant static field access, reflection, subclass init."
        ] },
        { table: { head: ["Loader", "Loads", "Since"], rows: [
          ["Bootstrap (native, shows as <code>null</code>)", "<code>java.base</code>: <code>java.lang.*</code>, <code>java.util.*</code>", "Always"],
          ["Platform", "Other JDK modules (<code>java.sql</code>, …)", "Java 9 (was 'Extension' loader)"],
          ["Application / System", "Your classpath / module path", "Always"],
          ["Custom (<code>extends ClassLoader</code>)", "Plugins, hot reload, app servers isolating webapps", "—"]
        ] } },
        { p: "<b>Parent delegation:</b> a loader first asks its parent; only if the parent can't find the class does it load it itself. This guarantees that <code>java.lang.String</code> always comes from the bootstrap loader, so nobody can sneak in a fake one. A class's identity is <i>(loader, fully qualified name)</i> — the same class loaded by two loaders gives two incompatible types (the source of 'ClassCastException: Foo cannot be cast to Foo')." },
        { code: `public class Main {
    static class Config {
        static { System.out.println("Config initialised"); }   // runs on first ACTIVE use
        static final int CONST = 42;      // compile-time constant: inlined, does not trigger init
        static int counter = 1;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("main started");
        System.out.println(Config.CONST);     // 42, Config still not initialised
        System.out.println(Config.counter);   // triggers initialisation first

        ClassLoader app = Main.class.getClassLoader();
        System.out.println(app.getName() + " -> " + app.getParent().getName());   // app -> platform
        System.out.println(String.class.getClassLoader());                       // null (bootstrap)
        System.out.println(Class.forName("java.util.ArrayList").getSimpleName()); // ArrayList
    }
}`, lang: "java", title: "Lazy initialisation and the loader chain" },
        { code: `main started
42
Config initialised
1
app -> platform
null
ArrayList`, lang: "text", title: "Output (run with java -cp, not the single-file source launcher)" },
        { h: "JIT compilation" },
        { p: "HotSpot starts by <b>interpreting</b> bytecode. It counts method invocations and loop back-edges; hot code is compiled by <b>C1</b> (fast compile, light optimisation) and, if it stays hot, recompiled by <b>C2</b> (aggressive optimisation using the profile gathered so far) — this is <i>tiered compilation</i>, default since Java 8. Key optimisations: <b>inlining</b> small methods, <b>escape analysis</b> (an object that never escapes a method may be scalar-replaced, so no heap allocation), loop unrolling, and devirtualising calls with only one observed receiver type. If an assumption breaks (a new subclass loads), the JVM <b>deoptimises</b> back to the interpreter." },
        { warn: "<code>ClassNotFoundException</code> (checked) = you asked for a class by name (<code>Class.forName</code>) and no loader has it. <code>NoClassDefFoundError</code> (error) = the class existed at compile time but is missing at run time, or its static initializer failed earlier. Also, naive micro-benchmarks measure the interpreter, not JIT'd code — use JMH, which handles warm-up." },
        { tip: "Bonus points: GraalVM Native Image compiles ahead-of-time to a native binary (fast startup, low memory, no JIT warm-up) — popular for serverless and CLIs." }
      ]
    },
    {
      id: "gc-algorithms-and-tuning",
      q: "How does garbage collection work in modern JVMs? How do Serial, Parallel, G1 and ZGC compare, and which JVM flags would you tune?",
      topic: "JVM Internals",
      level: 3,
      top: false,
      short: "GC finds objects unreachable from GC roots and reclaims them. Most collectors are generational because most objects die young: minor GCs copy survivors from eden through the survivor spaces to the old generation, and old-gen collections are rarer and costlier. Serial is single-threaded, Parallel maximises throughput, G1 (default since Java 9) splits the heap into regions and targets a pause goal, and ZGC does almost everything concurrently for sub-millisecond pauses. Key flags: -Xms, -Xmx, -XX:+UseG1GC or -XX:+UseZGC, -XX:MaxGCPauseMillis, -Xlog:gc and heap-dump-on-OOM.",
      a: [
        { p: "Basics (roots, mark-sweep-compact, reference types) are in <a href=\"#/core/oops/garbage-collection\">garbage collection</a> and <a href=\"#/core/oops/reference-types\">strong/soft/weak references</a>. Here's what an interviewer expects on top of that." },
        { ol: [
          "New objects are allocated in <b>Eden</b> (fast bump-the-pointer, per-thread TLABs).",
          "Eden fills → <b>minor (young) GC</b>: live objects are copied to a survivor space (S0/S1); everything else is reclaimed for free. Each survival increments the object's age.",
          "Objects surviving enough cycles (age threshold, max 15) are <b>promoted</b> to the old generation.",
          "Old gen fills → <b>major / mixed / full GC</b> — far more expensive. A long full GC is what causes multi-second 'stop-the-world' pauses."
        ] },
        { table: { head: ["Collector", "Flag", "Design", "Pauses", "Use when"], rows: [
          ["Serial", "<code>-XX:+UseSerialGC</code>", "Single thread, stop-the-world", "Long on big heaps", "Small heaps, 1 CPU containers, CLIs"],
          ["Parallel", "<code>-XX:+UseParallelGC</code>", "Multi-threaded stop-the-world (default in Java 8)", "Medium", "Batch jobs — maximise throughput"],
          ["G1", "<code>-XX:+UseG1GC</code> (default since 9)", "Heap split into equal regions; collects the regions with the most garbage first; concurrent marking", "Targets <code>MaxGCPauseMillis</code> (default 200 ms)", "General-purpose servers, 4 GB–tens of GB"],
          ["ZGC", "<code>-XX:+UseZGC</code>", "Concurrent mark + relocate using coloured pointers and load barriers; generational since JDK 21 (<code>-XX:+ZGenerational</code>), the only mode from JDK 23", "Sub-millisecond, independent of heap size", "Latency-critical services, very large heaps (up to 16 TB)"],
          ["Shenandoah", "<code>-XX:+UseShenandoahGC</code>", "Concurrent compaction (Red Hat)", "Very low", "Similar to ZGC"]
        ] } },
        { code: `# Size the heap (equal min/max avoids resize pauses on servers)
java -Xms2g -Xmx2g -jar app.jar

# In containers, size relative to the container memory limit
java -XX:MaxRAMPercentage=75.0 -jar app.jar

# Pick a collector and a pause goal
java -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -jar app.jar
java -XX:+UseZGC -jar app.jar          # JDK 21: add -XX:+ZGenerational

# Thread stack size and metaspace cap
java -Xss512k -XX:MaxMetaspaceSize=256m -jar app.jar

# Always-on diagnostics in production
java -Xlog:gc*:file=gc.log:time,uptime -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps -jar app.jar

# Inspect a running JVM
jcmd <pid> GC.heap_info
jstat -gcutil <pid> 1000`, lang: "bash", title: "Flags worth knowing" },
        { code: `import java.lang.management.*;

public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 2_000_000; i++) { byte[] garbage = new byte[1024]; }   // churn young gen
        for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans())
            System.out.println(gc.getName() + " collections: " + (gc.getCollectionCount() >= 0));
    }
}`, lang: "java", title: "Which collector am I running?" },
        { p: "On a default JDK 21 server-class machine this prints the three G1 beans: <code>G1 Young Generation</code>, <code>G1 Concurrent GC</code>, <code>G1 Old Generation</code>. (On a container with &lt; 2 CPUs or &lt; ~1.8 GB RAM the JVM silently picks Serial GC — a common surprise.)" },
        { warn: "Don't call <code>System.gc()</code> — it's only a hint and can trigger a full GC. Tuning order that interviewers like: first fix allocation hot spots and leaks, then size the heap, then pick the collector, and only then touch fine-grained flags — always with GC logs as evidence." },
        { tip: "Throughput vs latency vs footprint is the trade-off triangle: Parallel GC wins throughput, ZGC wins latency, Serial wins footprint, G1 is the balanced default." }
      ]
    },

    /* ───────────── Modern & Practical ───────────── */
    {
      id: "java-8-to-21-features",
      q: "Which features from Java 8 to Java 21 do you use? How do var, switch expressions, text blocks, pattern matching, sealed classes and immutable collections work?",
      topic: "Modern & Practical",
      level: 1,
      top: true,
      short: "Java 8 brought lambdas, streams, Optional and java.time; 9 added List.of/Map.of immutable factories; 10 var for local type inference; 14 switch expressions with arrows and yield; 15 text blocks; 16 records and instanceof patterns; 17 sealed classes; and 21 (LTS) pattern matching for switch, record patterns, virtual threads and sequenced collections. Together they let you model data as sealed hierarchies of records and handle each case with an exhaustive switch.",
      a: [
        { table: { head: ["Version", "Feature", "One-liner"], rows: [
          ["8 (LTS)", "Lambdas, streams, <code>Optional</code>, <code>java.time</code>, default methods", "Functional style; finally a sane date API"],
          ["9", "<code>List.of</code>, <code>Set.of</code>, <code>Map.of</code>; modules; JShell", "Immutable collection literals"],
          ["10", "<code>var</code>", "Local variable type inference — still statically typed"],
          ["11 (LTS)", "<code>HttpClient</code>, <code>String.isBlank/strip/lines/repeat</code>, <code>java File.java</code>", "Standard HTTP/2 client"],
          ["14", "Switch expressions (<code>-&gt;</code>, <code>yield</code>)", "switch returns a value; no fall-through"],
          ["15", "Text blocks <code>\"\"\"</code>", "Multi-line strings for JSON/SQL"],
          ["16", "Records, <code>instanceof</code> pattern", "Data carriers; no cast after instanceof"],
          ["17 (LTS)", "Sealed classes", "Closed hierarchies the compiler knows"],
          ["21 (LTS)", "Pattern matching for switch, record patterns, virtual threads, sequenced collections", "Exhaustive type switches; <code>getFirst()</code>/<code>getLast()</code>/<code>reversed()</code>"]
        ] } },
        { code: `import java.util.*;

public class Main {
    sealed interface Shape permits Circle, Square, Rect {}       // Java 17: closed hierarchy
    record Circle(double r) implements Shape {}                  // Java 16: records
    record Square(double side) implements Shape {}
    record Rect(double w, double h) implements Shape {}

    static double area(Shape s) {
        return switch (s) {                                      // Java 21: pattern matching for switch
            case Circle c -> Math.PI * c.r() * c.r();
            case Square(double a) -> a * a;                      // record pattern (deconstruction)
            case Rect(double w, double h) when w == h -> w * w;  // guard
            case Rect(double w, double h) -> w * h;
        };                                                       // no default: compiler proves exhaustiveness
    }

    public static void main(String[] args) {
        var shapes = List.of(new Circle(1), new Square(2), new Rect(2, 3));   // var (10), List.of (9)
        for (var s : shapes) System.out.printf("%.2f%n", area(s));          // 3.14 4.00 6.00

        String day = "FRI";
        int hours = switch (day) {                               // Java 14: switch expression
            case "SAT", "SUN" -> 0;
            case "FRI" -> { int h = 6; yield h; }
            default -> 8;
        };
        System.out.println(hours);                               // 6

        String json = """
            {"name": "Asha", "skills": ["Java", "C"]}
            """;                                                 // Java 15: text block
        System.out.print(json);

        Object o = "hello";
        if (o instanceof String str && str.length() > 3)         // Java 16: instanceof pattern
            System.out.println(str.toUpperCase());               // HELLO
    }
}`, lang: "java", title: "Most of modern Java in one file" },
        { p: "Records and sealed classes as OOP concepts are covered in <a href=\"#/core/oops/records-sealed-classes\">records &amp; sealed classes</a>. The combination above is called <b>data-oriented programming</b>: adding a new <code>Shape</code> makes every non-exhaustive switch a compile error instead of a runtime bug." },
        { h: "Immutable collections" },
        { code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> fixed = List.of("a", "b");
        try { fixed.add("c"); }
        catch (UnsupportedOperationException e) { System.out.println("List.of is immutable"); }
        try { List.of("a", null); }
        catch (NullPointerException e) { System.out.println("List.of rejects nulls"); }

        List<String> src = new ArrayList<>(List.of("x"));
        List<String> view = Collections.unmodifiableList(src);   // read-only VIEW of src
        List<String> copy = List.copyOf(src);                    // true immutable snapshot
        src.add("y");
        System.out.println(view + " " + copy);                   // [x, y] [x]

        List<Integer> arr = Arrays.asList(1, 2, 3);              // fixed-size, backed by the array
        arr.set(0, 9);                                           // allowed
        System.out.println(arr);                                 // [9, 2, 3]
        try { arr.add(4); }
        catch (UnsupportedOperationException e) { System.out.println("Arrays.asList is fixed-size"); }
    }
}`, lang: "java", title: "List.of vs unmodifiableList vs Arrays.asList" },
        { warn: "<code>var</code> is not dynamic typing — <code>var x = 1; x = \"a\";</code> doesn't compile. It only works for locals with an initializer (not fields, parameters or <code>var x = null</code>). And <code>Collections.unmodifiableList</code> is only a view: whoever holds the original list can still change what you see. <code>Map.of</code> also has unspecified iteration order — don't print it in a test and expect a fixed order." },
        { tip: "Know the LTS line: 8, 11, 17, 21, and 25 (September 2025). Saying 'we are on 17/21 and I use records for DTOs and switch patterns for handling event types' sounds like real experience." }
      ]
    },
    {
      id: "string-building-performance",
      q: "Why is string concatenation in a loop slow? How do +, StringBuilder, StringBuffer and String.format compare?",
      topic: "Modern & Practical",
      level: 1,
      top: true,
      short: "Strings are immutable, so s += x in a loop creates a brand-new String and copies all previous characters every iteration, which is O(n squared). StringBuilder appends into one growable buffer in amortised O(1). StringBuffer is the same but synchronized and rarely needed. A single expression like a + b + c is fine because the compiler turns it into one efficient concatenation. String.format is the slowest because it parses the format string each call; use it for readability, not hot loops.",
      a: [
        { p: "Background: <a href=\"#/core/oops/string-immutability\">why String is immutable</a>. Each <code>s += i</code> allocates a new String of length |s| + |i| and copies the old content, so building a string of n pieces costs 1 + 2 + … + n ≈ n²/2 character copies — and leaves n garbage strings for the GC." },
        { code: `public class Main {
    public static void main(String[] args) {
        int n = 20_000;

        long t0 = System.nanoTime();
        String s = "";
        for (int i = 0; i < n; i++) s += i;                    // O(n^2): new String every time
        long t1 = System.nanoTime();

        StringBuilder sb = new StringBuilder(n * 5);           // pre-size: no regrowth
        for (int i = 0; i < n; i++) sb.append(i);
        String s2 = sb.toString();
        long t2 = System.nanoTime();

        StringBuilder sf = new StringBuilder();
        for (int i = 0; i < n; i++) sf.append(String.format("%d", i));   // parses "%d" 20,000 times
        long t3 = System.nanoTime();

        System.out.println(s.equals(s2) && s2.equals(sf.toString()));    // true
        System.out.println("+= slower than StringBuilder: " + ((t1 - t0) > (t2 - t1)));   // true
        System.out.println("format slower than append:   " + ((t3 - t2) > (t2 - t1)));   // true
    }
}`, lang: "java", title: "Same output, very different cost" },
        { table: { head: ["", "Mutable", "Thread-safe", "Speed", "Use for"], rows: [
          ["<code>String</code> + in one expression", "No", "Yes (immutable)", "Fast — compiled to one <code>invokedynamic</code> concat (Java 9, JEP 280)", "<code>\"Hi \" + name + \"!\"</code>"],
          ["<code>+=</code> in a loop", "No", "—", "O(n²)", "Never"],
          ["<code>StringBuilder</code>", "Yes", "No", "Fastest", "Loops, building output"],
          ["<code>StringBuffer</code>", "Yes", "Yes (synchronized methods)", "Slightly slower", "Legacy; a shared builder is a design smell anyway"],
          ["<code>String.format</code> / <code>\"...\".formatted()</code>", "No", "Yes", "Slowest (parses pattern, boxing)", "Readable messages, fixed-width output"],
          ["<code>String.join</code> / <code>Collectors.joining</code>", "No", "Yes", "Fast (uses a builder)", "Joining with a delimiter"]
        ] } },
        { p: "StringBuilder starts with 16 chars of capacity and grows to <code>(old × 2) + 2</code> when full, copying the buffer — pre-sizing with <code>new StringBuilder(expectedLength)</code> avoids that in tight loops." },
        { warn: "Microbenchmarks like the one above are only indicative — JIT warm-up and GC skew single runs. For real numbers use JMH. Also don't 'optimise' a single <code>a + b + c</code> into a StringBuilder by hand; since Java 9 the compiler-generated version is at least as good." },
        { tip: "Related trap: <code>==</code> vs <code>equals</code> on strings — literals are interned in the string pool so <code>\"a\" == \"a\"</code> is true, but a string built at run time is a different object. Always compare with <code>equals</code>." }
      ]
    },
    {
      id: "serialization",
      q: "What is serialization in Java? Explain Serializable, serialVersionUID and transient, and why is Java serialization discouraged today?",
      topic: "Modern & Practical",
      level: 2,
      top: false,
      short: "Serialization converts an object graph into bytes (ObjectOutputStream) so it can be stored or sent and later rebuilt (ObjectInputStream). A class opts in by implementing the Serializable marker interface; transient fields and static fields are skipped; serialVersionUID is the version stamp checked on deserialization. Native Java serialization is discouraged because deserializing untrusted bytes can execute gadget chains, it is brittle across versions and Java-only, so JSON or Protobuf is preferred.",
      a: [
        { p: "<code>Serializable</code> is a <a href=\"#/core/oops/marker-functional-interfaces\">marker interface</a> — no methods, just permission. The JVM walks the whole object graph and writes every non-transient, non-static field; every referenced object must also be serializable or you get <code>NotSerializableException</code>." },
        { code: `import java.io.*;

public class Main {
    static class User implements Serializable {
        private static final long serialVersionUID = 1L;   // version stamp
        String name;
        transient String password;      // skipped -> null after deserialization
        static String org = "ACME";     // static: belongs to the class, never serialized

        User(String name, String password) {
            this.name = name; this.password = password;
            System.out.println("constructor called");
        }
    }

    public static void main(String[] args) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
            out.writeObject(new User("asha", "s3cret"));
        }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            User u = (User) in.readObject();                // constructor is NOT called here
            System.out.println(u.name + " " + u.password);  // asha null
        }
    }
}`, lang: "java", title: "Round trip through a byte array" },
        { code: `constructor called
asha null`, lang: "text", title: "Output" },
        { table: { head: ["Concept", "What to say"], rows: [
          ["<code>serialVersionUID</code>", "If the class's UID differs from the one in the stream → <code>InvalidClassException</code>. Without one, the JVM computes it from the class structure, so adding a method can break old data. Declare it explicitly."],
          ["<code>transient</code>", "Field is skipped; restored as its default value (null/0/false). Use for passwords, caches, non-serializable handles."],
          ["Constructors", "Not run for the serializable class; the no-arg constructor of the first <i>non-serializable</i> superclass is run."],
          ["Custom logic", "<code>private void writeObject/readObject</code> hooks; <code>Externalizable</code> for full manual control; <code>readResolve</code> to keep singletons single."],
          ["Records", "Deserialized through the canonical constructor, so validation runs — safer than classes."],
          ["Enums", "Serialized by name; singleton-safe automatically."]
        ] } },
        { warn: "Deserializing untrusted data with <code>ObjectInputStream</code> has caused remote-code-execution vulnerabilities (e.g. Apache Commons Collections gadget chains, 2015). If you must, use <code>ObjectInputFilter</code> (Java 9) to allow-list classes. For APIs, caches and messages use JSON (Jackson), Protobuf or Avro — language-neutral, versionable and not executable." },
        { tip: "Where you still meet it: HTTP session replication, some caches, RMI. Spring/Redis setups often switch the default JDK serializer to a JSON one — mentioning that shows practical experience." }
      ]
    },
    {
      id: "jdbc-basics",
      q: "How do you query a database with JDBC? Why use PreparedStatement, and how do you handle transactions and connections properly?",
      topic: "Modern & Practical",
      level: 2,
      top: true,
      short: "Get a Connection (from DriverManager or, in real apps, a pool like HikariCP), prepare a SQL statement with ? placeholders, bind parameters, execute, and iterate the ResultSet, closing everything with try-with-resources. PreparedStatement prevents SQL injection because parameters are sent as data, and it can be precompiled and reused. For transactions, turn off auto-commit, commit when all statements succeed and roll back on any exception.",
      a: [
        { p: "JDBC is the low-level API under every Java data framework (JPA/Hibernate, Spring JdbcTemplate, MyBatis). Core types: <code>DriverManager</code>/<code>DataSource</code> → <code>Connection</code> → <code>PreparedStatement</code> → <code>ResultSet</code>. The vendor driver (PostgreSQL, MySQL, SQLite JAR) implements these interfaces and is auto-discovered since JDBC 4 — no more <code>Class.forName(\"…Driver\")</code>." },
        { code: `import java.sql.*;

public class Main {
    // needs a running database and its driver JAR on the classpath
    static final String URL = "jdbc:postgresql://localhost:5432/shop";

    public static void main(String[] args) throws SQLException {
        try (Connection con = DriverManager.getConnection(URL, "app", "secret")) {

            String sql = "SELECT id, name FROM users WHERE email = ?";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setString(1, "asha@example.com");          // bound as data, never parsed as SQL
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) System.out.println(rs.getInt("id") + " " + rs.getString("name"));
                }
            }

            con.setAutoCommit(false);                         // start a transaction
            try (PreparedStatement debit  = con.prepareStatement("UPDATE account SET bal = bal - ? WHERE id = ?");
                 PreparedStatement credit = con.prepareStatement("UPDATE account SET bal = bal + ? WHERE id = ?")) {
                debit.setInt(1, 500);  debit.setInt(2, 1);  debit.executeUpdate();
                credit.setInt(1, 500); credit.setInt(2, 2); credit.executeUpdate();
                con.commit();                                 // both or neither
            } catch (SQLException e) {
                con.rollback();
                throw e;
            }
        }   // try-with-resources closes ResultSet, statements and connection in reverse order
    }
}`, lang: "java", title: "Query + transaction with try-with-resources" },
        { table: { head: ["", "Statement", "PreparedStatement", "CallableStatement"], rows: [
          ["SQL", "Concatenated string", "<code>?</code> placeholders", "<code>{call proc(?, ?)}</code>"],
          ["SQL injection", "Vulnerable", "Safe for values", "Safe for values"],
          ["Precompiled / reusable plan", "No", "Yes (driver/DB may cache)", "Yes"],
          ["Use for", "Static DDL", "Almost everything", "Stored procedures"]
        ] } },
        { code: `import java.sql.*;

public class Main {
    static String vulnerable(String email) {
        return "SELECT * FROM users WHERE email = '" + email + "'";   // NEVER do this
    }

    public static void main(String[] args) {
        System.out.println(vulnerable("x' OR '1'='1"));
        // SELECT * FROM users WHERE email = 'x' OR '1'='1'   -> returns every user
    }
}`, lang: "java", title: "What PreparedStatement protects you from" },
        { ul: [
          "<b>Connection pooling</b> — opening a DB connection costs a TCP + auth handshake (tens of ms). Real apps use a <code>DataSource</code> pool (HikariCP is Spring Boot's default) and 'closing' a pooled connection just returns it.",
          "<b>Batching</b> — <code>ps.addBatch()</code> in a loop + <code>ps.executeBatch()</code> sends many inserts in one round trip.",
          "<b>Isolation</b> — <code>con.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED)</code>; theory in <a href=\"#/core/dbms/isolation-levels\">isolation levels</a> and <a href=\"#/core/dbms/acid-properties\">ACID</a>.",
          "<b>Placeholders bind values only</b> — table/column names and <code>ORDER BY</code> fields can't be <code>?</code>; allow-list them in code."
        ] },
        { warn: "Classic leaks: not closing ResultSet/Statement/Connection in a <code>finally</code> (or try-with-resources) exhausts the pool and the app hangs waiting for connections. See <a href=\"#/core/dbms/sql-injection\">SQL injection</a> for the attack side." },
        { tip: "If asked 'JDBC vs Hibernate': JDBC gives full SQL control and no magic but lots of boilerplate; JPA/Hibernate maps objects to tables (see <a href=\"#/core/dbms/orm\">ORM</a>) but you must watch for the N+1 query problem and lazy-loading exceptions." }
      ]
    }
  ]
});
