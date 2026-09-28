/* study: OOP in Java + Java language essentials — lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ------------------------------------------------------------------ */
  add({
    id: "java-collections",
    subject: "java",
    title: "Java Collections for DSA: structures, complexities, idioms & fast I/O",
    minutes: 75,
    crux: [
      "Pick by the operation you need most: index access → <code>ArrayList</code>/<code>int[]</code>; lookup by key → <code>HashMap</code>; sorted keys / floor / ceiling → <code>TreeMap</code>; stack or queue → <code>ArrayDeque</code>; repeatedly take the smallest → <code>PriorityQueue</code>.",
      "Hash structures are <b>O(1) average</b>, Tree structures are <b>O(log n)</b> but keep keys sorted, <code>PriorityQueue</code> is O(log n) add/poll with O(1) peek.",
      "<code>PriorityQueue</code> is a <b>min-heap</b> by default. Max-heap: <code>new PriorityQueue&lt;&gt;(Comparator.reverseOrder())</code>. Iterating it does <b>not</b> give sorted order.",
      "Idioms to type without thinking: <code>getOrDefault</code> (counting), <code>merge(k, 1, Integer::sum)</code>, <code>computeIfAbsent(k, x -&gt; new ArrayList&lt;&gt;()).add(v)</code> (grouping), <code>Comparator.comparingInt(a -&gt; a[0])</code>, <code>Arrays.fill</code>.",
      "Never compare boxed <code>Integer</code>s from a collection with <code>==</code> — use <code>.equals()</code> or unbox to <code>int</code>.",
      "Fast I/O = <code>BufferedReader</code> + <code>StringTokenizer</code> for input, one <code>StringBuilder</code> printed once for output."
    ],
    sections: [
      { h: "The family tree — what implements what", blocks: [
        { p: "The Collections framework has two roots: <code>Collection</code> (a group of elements) and <code>Map</code> (key → value pairs; it is <b>not</b> a <code>Collection</code>). Program to the interface on the left side and choose the implementation on the right side: <code>List&lt;Integer&gt; list = new ArrayList&lt;&gt;();</code>." },
        { svg: `<svg viewBox="0 0 720 225" width="720" class="dg">
  <rect class="box-a" x="170" y="15" width="120" height="30" rx="6"/>
  <text class="tx tx-b" x="230" y="30" text-anchor="middle" dominant-baseline="middle">Collection</text>
  <rect class="box-a" x="580" y="15" width="100" height="30" rx="6"/>
  <text class="tx tx-b" x="630" y="30" text-anchor="middle" dominant-baseline="middle">Map</text>
  <rect class="box-p" x="25" y="85" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="70" y="100" text-anchor="middle" dominant-baseline="middle">List</text>
  <rect class="box-p" x="170" y="85" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="215" y="100" text-anchor="middle" dominant-baseline="middle">Set</text>
  <rect class="box-p" x="320" y="85" width="110" height="30" rx="6"/>
  <text class="tx tx-b" x="375" y="100" text-anchor="middle" dominant-baseline="middle">Queue / Deque</text>
  <rect class="box" x="540" y="85" width="90" height="30" rx="6"/>
  <text class="tx" x="585" y="100" text-anchor="middle" dominant-baseline="middle">HashMap</text>
  <rect class="box" x="640" y="85" width="75" height="30" rx="6"/>
  <text class="tx" x="677" y="100" text-anchor="middle" dominant-baseline="middle">TreeMap</text>
  <rect class="box" x="20" y="160" width="100" height="30" rx="6"/>
  <text class="tx" x="70" y="175" text-anchor="middle" dominant-baseline="middle">ArrayList</text>
  <rect class="box" x="125" y="160" width="80" height="30" rx="6"/>
  <text class="tx" x="165" y="175" text-anchor="middle" dominant-baseline="middle">HashSet</text>
  <rect class="box" x="220" y="160" width="80" height="30" rx="6"/>
  <text class="tx" x="260" y="175" text-anchor="middle" dominant-baseline="middle">TreeSet</text>
  <rect class="box" x="310" y="160" width="90" height="30" rx="6"/>
  <text class="tx" x="355" y="175" text-anchor="middle" dominant-baseline="middle">ArrayDeque</text>
  <rect class="box" x="410" y="160" width="110" height="30" rx="6"/>
  <text class="tx" x="465" y="175" text-anchor="middle" dominant-baseline="middle">PriorityQueue</text>
  <rect class="box" x="540" y="160" width="120" height="30" rx="6"/>
  <text class="tx" x="600" y="175" text-anchor="middle" dominant-baseline="middle">LinkedHashMap</text>
  <line class="ln" x1="70" y1="85" x2="200" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="215" y1="85" x2="225" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="375" y1="85" x2="262" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="585" y1="85" x2="615" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="677" y1="85" x2="650" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="70" y1="160" x2="70" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="165" y1="160" x2="200" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="260" y1="160" x2="230" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="355" y1="160" x2="365" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="465" y1="160" x2="395" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="595" y1="160" x2="588" y2="117" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="70" y="208" text-anchor="middle">index O(1)</text>
  <text class="tx-m" x="165" y="208" text-anchor="middle">unordered</text>
  <text class="tx-m" x="260" y="208" text-anchor="middle">sorted</text>
  <text class="tx-m" x="355" y="208" text-anchor="middle">stack + queue</text>
  <text class="tx-m" x="465" y="208" text-anchor="middle">min-heap</text>
  <text class="tx-m" x="600" y="208" text-anchor="middle">insertion order</text>
</svg>`, caption: "Arrows point from implementation to the interface it implements (LinkedHashMap extends HashMap)." },
        { table: { head: ["You need…", "Use", "Why"], rows: [
          ["Dynamic array, random access by index", "<code>ArrayList</code>", "Backed by an array, <code>get(i)</code> is O(1)"],
          ["Fixed size, primitives, speed", "<code>int[]</code>, <code>int[][]</code>", "No boxing, cache-friendly, default value 0"],
          ["Count / look up by key", "<code>HashMap</code>", "O(1) average get/put"],
          ["Map that remembers insertion order (or LRU)", "<code>LinkedHashMap</code>", "Hash table + doubly linked list through entries"],
          ["Sorted keys, floor/ceiling, range queries", "<code>TreeMap</code> / <code>TreeSet</code>", "Red-black tree, O(log n), navigation methods"],
          ["Distinct elements / 'seen' set", "<code>HashSet</code>", "Backed by a <code>HashMap</code> (values are a dummy)"],
          ["Stack (LIFO) or queue (FIFO) or both ends", "<code>ArrayDeque</code>", "Circular array, O(1) at both ends; faster than <code>Stack</code>/<code>LinkedList</code>"],
          ["Repeatedly remove the min (or max)", "<code>PriorityQueue</code>", "Binary heap: O(log n) offer/poll, O(1) peek"],
          ["Build a string piece by piece", "<code>StringBuilder</code>", "Mutable, amortised O(1) append"]
        ] } }
      ] },
      { h: "The complexity table (write this from memory)", blocks: [
        { p: "n = number of elements. \"Amortised O(1)\" means an occasional expensive step (array doubling) averaged over many cheap ones." },
        { table: { head: ["Structure", "Access / search", "Insert", "Delete", "Notes"], rows: [
          ["<code>int[]</code>", "<code>a[i]</code> O(1); search O(n)", "—", "—", "<code>Arrays.sort</code> O(n log n); <code>Arrays.fill</code> O(n)"],
          ["<code>ArrayList</code>", "<code>get(i)</code> O(1); <code>contains</code> O(n)", "<code>add(x)</code> amortised O(1); <code>add(i,x)</code> O(n)", "<code>remove(i)</code> O(n) (shift); last element O(1)", "Growth ≈ 1.5×"],
          ["<code>String</code>", "<code>charAt</code> O(1); <code>indexOf</code> O(n·m) worst", "concat O(n+m) — new String", "—", "<code>substring</code> copies: O(length)"],
          ["<code>StringBuilder</code>", "<code>charAt</code> O(1)", "<code>append</code> amortised O(1); <code>insert(0,…)</code> O(n)", "<code>deleteCharAt(i)</code> O(n)", "<code>reverse</code>, <code>toString</code> O(n)"],
          ["<code>HashMap</code> / <code>HashSet</code>", "O(1) avg; O(log n) worst (tree bins, Java 8+)", "O(1) avg", "O(1) avg", "No order; 1 null key allowed"],
          ["<code>LinkedHashMap</code>", "O(1) avg", "O(1) avg", "O(1) avg", "Iterates in insertion (or access) order"],
          ["<code>TreeMap</code> / <code>TreeSet</code>", "O(log n)", "O(log n)", "O(log n)", "<code>floorKey/ceilingKey/first/last</code> O(log n); no null keys"],
          ["<code>ArrayDeque</code>", "<code>peekFirst/peekLast</code> O(1); <code>contains</code> O(n)", "<code>offerFirst/offerLast/push</code> amortised O(1)", "<code>pollFirst/pollLast/pop</code> O(1)", "No nulls"],
          ["<code>PriorityQueue</code>", "<code>peek</code> O(1); <code>contains</code> O(n)", "<code>offer</code> O(log n)", "<code>poll</code> O(log n); <code>remove(obj)</code> O(n)", "Min-heap; building from a collection O(n)"],
          ["Sorting", "—", "—", "—", "Primitives: dual-pivot quicksort; objects/<code>List.sort</code>: TimSort (stable), both O(n log n)"]
        ] } },
        { warn: "Worst case of <code>HashMap</code> is <b>not</b> O(n) any more in Java 8+: a bucket with too many colliding keys is converted to a red-black tree, so worst case is O(log n). Saying 'O(n) worst case' is outdated — say 'O(n) before Java 8, O(log n) since'." }
      ] },
      { h: "Every structure in one runnable tour", blocks: [
        { p: "Read the comments as the expected output. Type it out once — the method names are what you will reach for in every DSA problem." },
        { code: `import java.util.*;

class CollectionsTour {
    public static void main(String[] args) {
        // ArrayList: resizable array
        List<Integer> list = new ArrayList<>(List.of(5, 3, 8));
        list.add(1);                       // [5, 3, 8, 1]
        list.add(0, 9);                    // [9, 5, 3, 8, 1]   O(n) shift
        list.remove(Integer.valueOf(8));   // removes the VALUE 8 -> [9, 5, 3, 1]
        list.remove(0);                    // removes INDEX 0     -> [5, 3, 1]
        Collections.sort(list);            // [1, 3, 5]
        System.out.println(list + " get(1)=" + list.get(1));   // [1, 3, 5] get(1)=3

        // HashMap: key -> value, no order guarantee
        Map<String, Integer> hm = new HashMap<>();
        hm.put("banana", 2); hm.put("apple", 5); hm.put("cherry", 1);
        System.out.println(hm.get("apple") + " " + hm.containsKey("kiwi") + " " + hm.get("kiwi")); // 5 false null

        // LinkedHashMap: same API, iterates in insertion order
        Map<String, Integer> lhm = new LinkedHashMap<>();
        lhm.put("banana", 2); lhm.put("apple", 5); lhm.put("cherry", 1);
        System.out.println(lhm);           // {banana=2, apple=5, cherry=1}

        // TreeMap: sorted by key + navigation methods
        TreeMap<Integer, String> tm = new TreeMap<>(Map.of(10, "ten", 20, "twenty", 30, "thirty"));
        System.out.println(tm.firstKey() + " " + tm.lastKey() + " " + tm.floorKey(25)
                + " " + tm.ceilingKey(25) + " " + tm.lowerKey(10));   // 10 30 20 30 null

        // HashSet / TreeSet
        Set<Integer> hs = new HashSet<>(List.of(4, 1, 2));
        hs.add(4);                         // duplicate ignored, add returns false
        System.out.println(hs.size() + " " + hs.contains(2));          // 3 true
        TreeSet<Integer> ts = new TreeSet<>(List.of(4, 1, 9, 2));
        System.out.println(ts + " " + ts.first() + " " + ts.higher(4) + " " + ts.headSet(4)); // [1, 2, 4, 9] 1 9 [1, 2]

        // ArrayDeque as a stack (push/pop/peek work on the FRONT)
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1); stack.push(2); stack.push(3);
        System.out.println(stack.pop() + " " + stack.peek());          // 3 2

        // ArrayDeque as a queue (offer at the back, poll from the front)
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(1); queue.offer(2); queue.offer(3);
        System.out.println(queue.poll() + " " + queue.peek());         // 1 2

        // PriorityQueue: min-heap by default
        PriorityQueue<Integer> minPq = new PriorityQueue<>(List.of(5, 1, 8, 3));
        PriorityQueue<Integer> maxPq = new PriorityQueue<>(Comparator.reverseOrder());
        maxPq.addAll(List.of(5, 1, 8, 3));
        System.out.println(minPq.poll() + " " + maxPq.poll());         // 1 8

        // Arrays: 1-D and 2-D
        int[] a = {5, 2, 9, 1};
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));                        // [1, 2, 5, 9]
        int[][] grid = new int[3][4];      // 3 rows x 4 cols, all 0
        grid[1][2] = 7;
        System.out.println(grid.length + "x" + grid[0].length + " " + Arrays.deepToString(grid));
        // 3x4 [[0, 0, 0, 0], [0, 0, 7, 0], [0, 0, 0, 0]]
    }
}`, lang: "java", title: "CollectionsTour.java" },
        { table: { head: ["ArrayDeque as…", "Add", "Remove", "Look"], rows: [
          ["Stack (LIFO)", "<code>push(x)</code> = <code>addFirst</code>", "<code>pop()</code> = <code>removeFirst</code>", "<code>peek()</code> = <code>peekFirst</code>"],
          ["Queue (FIFO)", "<code>offer(x)</code> = <code>offerLast</code>", "<code>poll()</code> = <code>pollFirst</code>", "<code>peek()</code>"],
          ["Deque (sliding window)", "<code>offerFirst / offerLast</code>", "<code>pollFirst / pollLast</code>", "<code>peekFirst / peekLast</code>"]
        ] } },
        { tip: "Say why you avoid the legacy classes: <code>Stack</code> extends <code>Vector</code> (every method synchronized, slower) and <code>LinkedList</code> allocates a node per element. <code>ArrayDeque</code> is the recommended stack and queue." }
      ] },
      { h: "Cheat-sheet: the five idioms that shorten every solution", blocks: [
        { table: { head: ["Idiom", "What it does", "Replaces"], rows: [
          ["<code>m.getOrDefault(k, 0)</code>", "Value for k, or the default if absent (does <b>not</b> insert)", "<code>m.containsKey(k) ? m.get(k) : 0</code>"],
          ["<code>m.merge(k, 1, Integer::sum)</code>", "If absent put 1, else put <code>old + 1</code>; returns the new value", "The whole get-add-put counting dance"],
          ["<code>m.computeIfAbsent(k, x -&gt; new ArrayList&lt;&gt;())</code>", "Creates and stores the value only if absent, then <b>returns</b> it", "Null-check + put before <code>.add()</code> when grouping"],
          ["<code>Comparator.comparingInt(f)</code>", "Comparator from an int key; chain with <code>.thenComparing(...)</code>, <code>.reversed()</code>", "<code>(a, b) -&gt; a[0] - b[0]</code> (which can overflow)"],
          ["<code>Arrays.fill(arr, v)</code>", "Sets every element; for 2-D fill each row", "A manual loop (e.g. <code>dist</code> = ∞, <code>dp</code> = -1)"]
        ] } },
        { code: `import java.util.*;

class CheatSheet {
    public static void main(String[] args) {
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};

        // 1. counting with getOrDefault
        Map<Character, Integer> freq = new TreeMap<>();
        for (char c : "banana".toCharArray()) freq.put(c, freq.getOrDefault(c, 0) + 1);
        System.out.println(freq);                       // {a=3, b=1, n=2}

        // 2. the same with merge
        Map<Character, Integer> freq2 = new TreeMap<>();
        for (char c : "banana".toCharArray()) freq2.merge(c, 1, Integer::sum);
        System.out.println(freq2.equals(freq));         // true

        // 3. grouping with computeIfAbsent (Group Anagrams)
        Map<String, List<String>> groups = new TreeMap<>();
        for (String w : words) {
            char[] key = w.toCharArray();
            Arrays.sort(key);
            groups.computeIfAbsent(new String(key), k -> new ArrayList<>()).add(w);
        }
        System.out.println(groups);   // {abt=[bat], aet=[eat, tea, ate], ant=[tan, nat]}

        // 4. Comparator.comparingInt
        int[][] intervals = {{5, 7}, {1, 3}, {2, 4}};
        Arrays.sort(intervals, Comparator.comparingInt(iv -> iv[0]));
        System.out.println(Arrays.deepToString(intervals));   // [[1, 3], [2, 4], [5, 7]]

        List<String> names = new ArrayList<>(List.of("ravi", "om", "priya", "an"));
        names.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
        System.out.println(names);                      // [an, om, ravi, priya]

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(p -> p[1]));
        pq.offer(new int[]{1, 50}); pq.offer(new int[]{2, 10}); pq.offer(new int[]{3, 30});
        System.out.println(pq.poll()[0]);               // 2  (smallest second value)

        // 5. Arrays.fill
        int[] dist = new int[5];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        System.out.println(Arrays.toString(dist));      // [0, 2147483647, 2147483647, 2147483647, 2147483647]
        int[][] dp = new int[2][3];
        for (int[] row : dp) Arrays.fill(row, -1);     // Arrays.fill(dp, -1) would NOT compile
        System.out.println(Arrays.deepToString(dp));    // [[-1, -1, -1], [-1, -1, -1]]
    }
}`, lang: "java", title: "CheatSheet.java" },
        { warn: "<code>(a, b) -&gt; a - b</code> as a comparator overflows for large values: with <code>a = Integer.MAX_VALUE</code>, <code>b = -1</code> the difference wraps negative and the sort is wrong. Use <code>Integer.compare(a, b)</code> or <code>Comparator.comparingInt</code>." }
      ] },
      { h: "Fast I/O template (for Codeforces / GFG / OAs)", blocks: [
        { p: "<code>Scanner</code> parses every token with regular expressions and <code>System.out.println</code> on a large output can flush repeatedly; with 10⁵–10⁶ numbers that alone can cause TLE. The fix: read whole lines with <code>BufferedReader</code>, split them with <code>StringTokenizer</code>, collect all output in one <code>StringBuilder</code>, print once." },
        { code: `import java.io.*;
import java.util.*;

class Main {
    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    static StringTokenizer st;

    // returns the next token, reading new lines as needed (works whatever the line breaks)
    static String next() throws IOException {
        while (st == null || !st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
        return st.nextToken();
    }
    static int nextInt() throws IOException { return Integer.parseInt(next()); }
    static long nextLong() throws IOException { return Long.parseLong(next()); }

    public static void main(String[] args) throws IOException {
        StringBuilder out = new StringBuilder();
        int t = nextInt();                     // number of test cases
        while (t-- > 0) {
            int n = nextInt();
            long sum = 0;                      // long: n * 10^9 overflows int
            for (int i = 0; i < n; i++) sum += nextLong();
            out.append(sum).append('\\n');
        }
        System.out.print(out);                 // one write at the end
    }
}`, lang: "java", title: "Main.java — type this until you can do it in under a minute" },
        { code: `input:          output:
2               6
3               100
1 2 3
1
100`, lang: "text", title: "Sample run" },
        { ul: [
          "LeetCode does not need it (you write a method), but Codeforces, GFG practice and most company OAs (HackerRank/HackerEarth) read stdin.",
          "Use <code>long</code> for sums and products by default; <code>int</code> overflows past about 2.1 × 10⁹.",
          "If an OA gives the whole input on one line or across many, <code>next()</code> above handles both."
        ] }
      ] },
      { h: "Traps interviewers and judges catch", blocks: [
        { ul: [
          "<b>Boxed equality:</b> <code>list.get(i) == list.get(j)</code> is a reference comparison — true for values in -128..127 (Integer cache), false above. Use <code>.equals()</code> or <code>int x = list.get(i)</code>.",
          "<b><code>remove</code> overloads:</b> on a <code>List&lt;Integer&gt;</code>, <code>remove(1)</code> removes <i>index</i> 1; <code>remove(Integer.valueOf(1))</code> removes the <i>value</i> 1.",
          "<b>ConcurrentModificationException:</b> adding/removing while looping with for-each. Use <code>iterator.remove()</code> or <code>list.removeIf(x -&gt; …)</code>.",
          "<b><code>Arrays.asList</code> / <code>List.of</code>:</b> the first is fixed-size (<code>add</code> throws), the second is fully immutable. Wrap in <code>new ArrayList&lt;&gt;(…)</code> to modify.",
          "<b>PriorityQueue printing:</b> <code>System.out.println(pq)</code> shows the heap array, not sorted order. Only repeated <code>poll()</code> yields sorted order.",
          "<b>TreeMap/TreeSet with a comparator</b> treat <code>compare(a,b) == 0</code> as a duplicate — a comparator on length alone would drop different strings of equal length."
        ] }
      ] }
    ],
    practice: [
      { q: "You need to answer 10⁵ queries 'what is the largest stored value ≤ x?' while values are being inserted. Which structure and which method?", a: "<code>TreeSet&lt;Integer&gt;</code> (or <code>TreeMap</code>) with <code>floor(x)</code> (<code>floorKey</code> on a map). Each insert and query is O(log n), total O(q log n). A <code>HashSet</code> cannot answer 'nearest below' without scanning; a sorted <code>ArrayList</code> would make inserts O(n)." },
      { q: "What does this print? <code>PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;&gt;(); pq.addAll(List.of(7, 2, 9, 4)); pq.poll(); System.out.println(pq.peek());</code>", a: "<code>4</code>. It is a min-heap: <code>poll()</code> removes 2, the new minimum is 4." },
      { q: "Write the one-liner that adds word <code>w</code> to the list of words starting with the same letter, in <code>Map&lt;Character, List&lt;String&gt;&gt; m</code>.", a: "<code>m.computeIfAbsent(w.charAt(0), k -&gt; new ArrayList&lt;&gt;()).add(w);</code> — <code>computeIfAbsent</code> returns the existing list or the freshly created one, so <code>.add</code> always works." },
      { q: "Sort <code>int[][] people</code> (each <code>{height, k}</code>) by height descending, then k ascending.", a: "<code>Arrays.sort(people, (a, b) -&gt; a[0] != b[0] ? Integer.compare(b[0], a[0]) : Integer.compare(a[1], b[1]));</code> or with comparators: <code>Arrays.sort(people, Comparator.comparingInt((int[] p) -&gt; -p[0]).thenComparingInt(p -&gt; p[1]));</code> (negating is safe here because heights are small and non-negative)." },
      { q: "Why is <code>ArrayList.add(x)</code> O(1) amortised and not O(1) always?", a: "When the backing array is full, a new array about 1.5× larger is allocated and all n elements are copied — an O(n) step. Because capacity grows geometrically, these copies happen rarely: over n adds the total copying is O(n), so the average per add is O(1)." },
      { q: "Is <code>Integer a = 1000, b = 1000; System.out.println(a == b);</code> true or false? What about with 100?", a: "With 1000: <code>false</code> — autoboxing calls <code>Integer.valueOf</code>, which caches only -128..127, so two different objects are created. With 100: <code>true</code> — both refer to the same cached object." }
    ],
    related: ["oops:java-generics", "oops:wrapper-autoboxing", "oops:equals-hashcode", "oops:marker-functional-interfaces", "sd:design-lru-cache"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "java-strings",
    subject: "java",
    title: "String handling in Java: immutability, StringBuilder, char tricks & 7 classic problems",
    minutes: 70,
    crux: [
      "A <code>String</code> never changes; every 'modification' creates a new object. So <code>s += c</code> in a loop copies the whole string each time → <b>O(n²)</b>. Use <code>StringBuilder</code> → O(n).",
      "<code>substring(b, e)</code> is <b>end-exclusive</b> and copies (O(e − b)). <code>split</code> takes a <b>regex</b>: split on dot with <code>\"\\\\.\"</code>, on runs of spaces with <code>\"\\\\s+\"</code>.",
      "Chars are small integers: <code>s.charAt(i) - 'a'</code> gives 0..25 (an array index), <code>c - '0'</code> gives the digit, <code>(char) ('a' + k)</code> goes back.",
      "<code>int[26]</code> frequency arrays replace a <code>HashMap&lt;Character,Integer&gt;</code> for lowercase letters — O(1) space and faster.",
      "Compare contents with <code>equals</code>, never <code>==</code> (which compares references and only 'works' for pooled literals)."
    ],
    sections: [
      { h: "Immutability and why += in a loop is O(n²)", blocks: [
        { p: "A <code>String</code> object holds a private, final character array that is never modified after construction. <code>s = s + \"x\"</code> does not change the old object: it allocates a new one, copies all old characters plus the new one, and re-points <code>s</code>." },
        { p: "Build a string of n characters one at a time with <code>+=</code>: the copies cost 1 + 2 + 3 + … + n = n(n+1)/2 character copies. For n = 10⁵ that is about 5 × 10⁹ — a guaranteed TLE. <code>StringBuilder</code> keeps one growable buffer (it doubles capacity when full), so n appends cost O(n) in total." },
        { code: `class ConcatCost {
    public static void main(String[] args) {
        int n = 5;

        String slow = "";
        for (int i = 0; i < n; i++) slow += i;          // new String every iteration: O(n^2) total

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i);       // one buffer: O(n) total
        String fast = sb.toString();

        System.out.println(slow + " " + fast + " " + slow.equals(fast));   // 01234 01234 true

        // StringBuilder is also your mutable char array
        StringBuilder w = new StringBuilder("placement");
        w.setCharAt(0, 'P');
        w.insert(0, ">> ");
        w.deleteCharAt(w.length() - 1);
        w.reverse();
        System.out.println(w + " len=" + w.length());   // nemecalP >> len=11
    }
}`, lang: "java", title: "ConcatCost.java" },
        { tip: "One <code>a + b + c</code> in a single expression is fine — the compiler turns it into one efficient concatenation. The problem is only <b>repeated</b> concatenation onto a growing string (loops, recursion)." }
      ] },
      { h: "The String API you actually use", blocks: [
        { table: { head: ["Call", "Result / meaning", "Cost"], rows: [
          ["<code>s.length()</code>, <code>s.charAt(i)</code>", "Size; char at index (throws if out of range)", "O(1)"],
          ["<code>s.substring(b)</code>, <code>s.substring(b, e)</code>", "Chars b..end, or b..e-1 (<b>e exclusive</b>)", "O(length copied)"],
          ["<code>s.toCharArray()</code>", "A new <code>char[]</code> copy — sort it, modify it freely", "O(n)"],
          ["<code>s.indexOf(x)</code>, <code>s.lastIndexOf(x)</code>, <code>s.contains(x)</code>", "First/last position or -1; boolean", "O(n·m) worst"],
          ["<code>s.split(regex)</code>", "Pieces between matches; <b>trailing</b> empty strings removed", "O(n)"],
          ["<code>String.join(\", \", list)</code>", "Glue elements with a separator", "O(total)"],
          ["<code>s.equals(t)</code>, <code>s.equalsIgnoreCase(t)</code>, <code>s.compareTo(t)</code>", "Content equality; lexicographic order (&lt;0, 0, &gt;0)", "O(n)"],
          ["<code>s.trim()</code> / <code>s.strip()</code>, <code>s.isEmpty()</code> / <code>s.isBlank()</code>", "Remove edge whitespace; length 0 / only whitespace", "O(n)"],
          ["<code>String.valueOf(x)</code>, <code>Integer.parseInt(s)</code>", "Anything → String; String → int", "O(n)"],
          ["<code>new String(charArr)</code> / <code>String.valueOf(charArr)</code>", "char[] → String", "O(n)"]
        ] } },
        { code: `import java.util.*;

class StringApi {
    public static void main(String[] args) {
        String s = "Hello, World";
        System.out.println(s.length() + " " + s.charAt(4));              // 12 o
        System.out.println(s.substring(7) + "|" + s.substring(0, 5));    // World|Hello
        System.out.println(s.indexOf('o') + " " + s.lastIndexOf('o') + " " + s.indexOf("xyz"));  // 4 8 -1

        char[] arr = "listen".toCharArray();
        Arrays.sort(arr);
        System.out.println(new String(arr));                              // eilnst

        System.out.println(Arrays.toString("a,b,,c,,".split(",")));      // [a, b, , c]
        System.out.println("1.2.3".split(".").length);                   // 0  ('.' is regex "any char")
        System.out.println(Arrays.toString("1.2.3".split("\\\\.")));       // [1, 2, 3]
        System.out.println(Arrays.toString("  to   be ".trim().split("\\\\s+")));  // [to, be]

        System.out.println(String.join("-", List.of("2026", "09", "29")));  // 2026-09-29
        System.out.println("apple".compareTo("banana") + " " + "app".compareTo("apple")); // -1 -2
        System.out.println(Integer.parseInt("-17") + 20);                 // 3
    }
}`, lang: "java", title: "StringApi.java" }
      ] },
      { h: "Char arithmetic and int[26] frequency arrays", blocks: [
        { p: "A <code>char</code> is a 16-bit unsigned number (its Unicode code). <code>'a'</code> is 97, <code>'b'</code> 98 … <code>'z'</code> 122; <code>'A'</code> is 65; <code>'0'</code> is 48. Letters and digits are consecutive, so subtraction maps them to 0-based indexes." },
        { table: { head: ["Expression", "Value", "Use"], rows: [
          ["<code>'c' - 'a'</code>", "2 (int)", "Index into <code>int[26]</code>"],
          ["<code>(char) ('a' + 2)</code>", "'c'", "Index back to letter"],
          ["<code>'7' - '0'</code>", "7", "Digit char → int (atoi, add strings)"],
          ["<code>'a' + 1</code>", "98 (int, not 'b')", "char + int promotes to int"],
          ["<code>\"\" + 'a' + 1</code>", "\"a1\"", "Left-to-right: String first, so concatenation"],
          ["<code>'a' + 'b' + \"\"</code>", "\"195\"", "97 + 98 added first, then made a String"],
          ["<code>Character.isLetterOrDigit(c)</code>, <code>Character.toLowerCase(c)</code>", "boolean / char", "Cleaning input (Valid Palindrome)"]
        ] } },
        { code: `class Frequency {
    public static void main(String[] args) {
        String s = "anagram";
        int[] cnt = new int[26];                 // cnt[0] = count of 'a', ... cnt[25] = 'z'
        for (char c : s.toCharArray()) cnt[c - 'a']++;

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++)
            if (cnt[i] > 0) sb.append((char) ('a' + i)).append(cnt[i]);
        System.out.println(sb);                  // a3g1m1n1r1

        // first non-repeating character: second pass over the string, not the array
        String t = "leetcode";
        int[] f = new int[26];
        for (int i = 0; i < t.length(); i++) f[t.charAt(i) - 'a']++;
        for (int i = 0; i < t.length(); i++)
            if (f[t.charAt(i) - 'a'] == 1) { System.out.println(i); break; }   // 0  ('l')
    }
}`, lang: "java", title: "Frequency.java" },
        { warn: "<code>int[26]</code> only works when the input is guaranteed lowercase a–z. For mixed case/digits use <code>int[128]</code> indexed by the char itself (<code>cnt[c]++</code>), and for full Unicode fall back to a <code>HashMap</code>." }
      ] },
      { h: "equals vs == for strings", blocks: [
        { p: "<code>==</code> asks 'are these the same object?'. <code>equals</code> asks 'do they contain the same characters?'. Two literals <code>\"java\"</code> share one object from the string pool, so <code>==</code> happens to be true; a string read from input, built by <code>StringBuilder</code>, or made by <code>substring</code>/<code>+</code> at runtime is a new object, so <code>==</code> is false even when the text is identical." },
        { code: `class StrEq {
    public static void main(String[] args) {
        String a = "java";
        String b = "ja" + "va";                  // constant expression, folded at compile time -> pooled
        String part = "ja";
        String c = part + "va";                  // computed at runtime -> new object
        String d = new StringBuilder("java").toString();
        System.out.println((a == b) + " " + (a == c) + " " + (a == d));   // true false false
        System.out.println(a.equals(c) + " " + a.equals(d));              // true true
    }
}`, lang: "java", title: "StrEq.java" },
        { tip: "Write <code>\"YES\".equals(input)</code> rather than <code>input.equals(\"YES\")</code> — it cannot throw a <code>NullPointerException</code> when <code>input</code> is null." }
      ] },
      { h: "The seven block problems — approach and code", blocks: [
        { table: { head: ["Problem", "Key idea", "Time / space"], rows: [
          ["Valid Anagram", "<code>int[26]</code>: +1 for s, −1 for t, all zero at the end", "O(n) / O(1)"],
          ["Valid Palindrome", "Two pointers from both ends, skip non-alphanumerics, compare lowercase", "O(n) / O(1)"],
          ["Longest Common Prefix", "Start with the first string, shrink it until every string starts with it", "O(total chars) / O(1)"],
          ["Reverse Words in a String", "<code>trim().split(\"\\\\s+\")</code>, append words from the back", "O(n) / O(n)"],
          ["Longest Palindromic Substring (M)", "Expand around each of the 2n−1 centres (odd and even length)", "O(n²) / O(1)"],
          ["String to Integer / atoi (M)", "Skip spaces → optional sign → digits; accumulate in <code>long</code>, clamp on overflow", "O(n) / O(1)"],
          ["Isomorphic Strings", "Remember the last position each char was seen in s and in t; they must always match", "O(n) / O(1)"]
        ] } },
        { code: `class StringProblems {
    // 1. Valid Anagram
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) {
            cnt[s.charAt(i) - 'a']++;
            cnt[t.charAt(i) - 'a']--;
        }
        for (int c : cnt) if (c != 0) return false;
        return true;
    }

    // 2. Valid Palindrome
    static boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            char a = s.charAt(i), b = s.charAt(j);
            if (!Character.isLetterOrDigit(a)) i++;
            else if (!Character.isLetterOrDigit(b)) j--;
            else {
                if (Character.toLowerCase(a) != Character.toLowerCase(b)) return false;
                i++; j--;
            }
        }
        return true;
    }

    // 3. Longest Common Prefix
    static String longestCommonPrefix(String[] strs) {
        String prefix = strs[0];
        for (String s : strs)
            while (!s.startsWith(prefix)) prefix = prefix.substring(0, prefix.length() - 1);
        return prefix;                                   // "" is a prefix of everything, so the loop ends
    }

    // 4. Reverse Words in a String
    static String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(' ');
        }
        return sb.toString();
    }

    // 5. Longest Palindromic Substring — expand around centre
    static String longestPalindrome(String s) {
        int start = 0, best = 0;
        for (int c = 0; c < s.length(); c++) {
            int len = Math.max(expand(s, c, c), expand(s, c, c + 1));   // odd, even
            if (len > best) { best = len; start = c - (len - 1) / 2; }
        }
        return s.substring(start, start + best);
    }
    static int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        return r - l - 1;                                // length of the palindrome found
    }

    // 6. String to Integer (atoi)
    static int myAtoi(String s) {
        int i = 0, n = s.length(), sign = 1;
        long val = 0;
        while (i < n && s.charAt(i) == ' ') i++;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) sign = (s.charAt(i++) == '-') ? -1 : 1;
        while (i < n && s.charAt(i) >= '0' && s.charAt(i) <= '9') {
            val = val * 10 + (s.charAt(i++) - '0');
            if (sign * val > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (sign * val < Integer.MIN_VALUE) return Integer.MIN_VALUE;
        }
        return (int) (sign * val);
    }

    // 7. Isomorphic Strings
    static boolean isIsomorphic(String s, String t) {
        int[] seenS = new int[256], seenT = new int[256];   // last position + 1, 0 = never seen
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (seenS[a] != seenT[b]) return false;
            seenS[a] = i + 1;
            seenT[b] = i + 1;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram") + " " + isAnagram("rat", "car"));        // true false
        System.out.println(isPalindrome("A man, a plan, a canal: Panama") + " " + isPalindrome("race a car")); // true false
        System.out.println(longestCommonPrefix(new String[]{"flower", "flow", "flight"}));         // fl
        System.out.println("[" + reverseWords("  the sky   is blue ") + "]");                     // [blue is sky the]
        System.out.println(longestPalindrome("babad") + " " + longestPalindrome("cbbd"));          // bab bb
        System.out.println(myAtoi("   -42") + " " + myAtoi("4193 with words") + " " + myAtoi("-91283472332")); // -42 4193 -2147483648
        System.out.println(isIsomorphic("egg", "add") + " " + isIsomorphic("foo", "bar") + " " + isIsomorphic("badc", "baba")); // true false false
    }
}`, lang: "java", title: "StringProblems.java — all seven, with tests" },
        { p: "<b>Trace of expand-around-centre on \"babad\":</b> centre 0 → \"b\" (len 1). Centre 1 odd: compare s[0]='b' with s[2]='b' → equal, widen to s[-1] → stop; palindrome \"bab\" (len 3), start = 1 − (3−1)/2 = 0. Centre 2 odd gives \"aba\" (also 3, not larger, so \"bab\" is kept). No even centre matches. Answer \"bab\"." },
        { p: "<b>Why <code>long</code> in atoi:</b> after reading \"2147483648\" the value exceeds <code>Integer.MAX_VALUE</code>; in an <code>int</code> it would silently wrap to a negative number. Checking after every digit also stops a 50-digit input from overflowing the <code>long</code>." }
      ] }
    ],
    practice: [
      { q: "What is printed? <code>String s = \"abc\"; s.toUpperCase(); System.out.println(s);</code>", a: "<code>abc</code>. <code>toUpperCase()</code> returns a <b>new</b> String; the result is discarded and <code>s</code> still points at the unchanged original. Correct: <code>s = s.toUpperCase();</code>" },
      { q: "How many character copies does <code>for (i = 0; i &lt; 1000; i++) s += \"x\";</code> do (starting from empty), roughly?", a: "Iteration k copies k characters into the new string, so 1 + 2 + … + 1000 = 1000·1001/2 = 500,500 copies (O(n²)). With <code>StringBuilder</code> it is about 1000 appends plus occasional buffer growth — O(n)." },
      { q: "What does <code>\"a1b2c3\".split(\"[0-9]\")</code> return, and what about <code>\"x,,y,\".split(\",\")</code>?", a: "<code>[a, b, c]</code> — the trailing empty string after '3' is removed. <code>[x, , y]</code> — the empty string between the two commas stays (it is not trailing), the one after the final comma is removed." },
      { q: "Given lowercase <code>s</code>, return true if any permutation of it is a palindrome.", a: "Count with <code>int[26]</code>; a palindrome permits at most one character with an odd count. <code>int odd = 0; for (int c : cnt) if (c % 2 == 1) odd++; return odd &lt;= 1;</code> O(n) time, O(1) space." },
      { q: "Why does <code>System.out.println('a' + 'b');</code> print 195 and not \"ab\"?", a: "Both operands are <code>char</code>; binary <code>+</code> on chars promotes them to <code>int</code> (97 + 98 = 195). String concatenation only happens when at least one operand is a <code>String</code>: <code>\"\" + 'a' + 'b'</code> gives \"ab\"." }
    ],
    related: ["oops:string-immutability", "oops:equals-hashcode", "oops:wrapper-autoboxing", "oops:immutable-class"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "oop-pillars",
    subject: "oops",
    title: "The 4 pillars in Java + == vs equals, the Integer cache, String immutability",
    minutes: 70,
    crux: [
      "<b>Encapsulation</b>: keep state <code>private</code>, change it only through methods that protect the object's rules (invariants).",
      "<b>Abstraction</b>: expose <i>what</i> an object does (an interface / abstract method) and hide <i>how</i>; callers depend on the contract.",
      "<b>Inheritance</b>: <code>extends</code> reuses and specialises a parent (is-a). <b>Polymorphism</b>: one call, many behaviours — overloading (compile time) and overriding (run time).",
      "<code>==</code> compares <b>references</b> (for objects) or values (for primitives); <code>equals</code> compares <b>contents</b> — but only if the class overrides it (the default in <code>Object</code> is <code>==</code>).",
      "<code>Integer.valueOf</code> (used by autoboxing) caches -128..127, so <code>==</code> on boxed values is true for 127 and false for 128.",
      "Strings are immutable so they can be <b>pooled</b> safely, cache their <b>hashCode</b>, be <b>thread-safe</b>, and stay <b>secure</b> as file names, URLs and class names."
    ],
    sections: [
      { h: "Class, object and reference — the picture to keep in mind", blocks: [
        { p: "A <b>class</b> is a blueprint (fields + methods). An <b>object</b> is one instance of it, living on the <b>heap</b>. A variable of a class type holds a <b>reference</b> (an address-like handle) to an object, not the object itself. Local variables live in the method's stack frame." },
        { code: `class Student {
    String name;
    int cgpaTimes100;
    Student(String name, int cgpaTimes100) { this.name = name; this.cgpaTimes100 = cgpaTimes100; }
}

class RefDemo {
    public static void main(String[] args) {
        Student s1 = new Student("Asha", 870);   // one object on the heap
        Student s2 = s1;                          // copies the REFERENCE, not the object
        s2.cgpaTimes100 = 910;
        System.out.println(s1.cgpaTimes100);      // 910 - both variables point to the same object
        Student s3 = new Student("Asha", 910);
        System.out.println((s1 == s2) + " " + (s1 == s3));   // true false
    }
}`, lang: "java", title: "RefDemo.java" },
        { tip: "Interview line: 'A class is a type; an object is a value of that type allocated on the heap; a variable holds a reference to it. Java passes that reference <b>by value</b>.'" }
      ] },
      { h: "Pillar 1 — Encapsulation (protect the invariant)", blocks: [
        { p: "Bundle data with the methods that operate on it and make the data <code>private</code>. The point is not 'getters and setters for everything' — it is that the object can <b>refuse invalid changes</b>. Below, no caller can ever make the balance negative." },
        { code: `class BankAccount {
    private final String accountNo;
    private long balancePaise;                    // money in paise: no floating-point error

    BankAccount(String accountNo, long openingPaise) {
        if (openingPaise < 0) throw new IllegalArgumentException("negative opening balance");
        this.accountNo = accountNo;
        this.balancePaise = openingPaise;
    }

    long getBalance() { return balancePaise; }    // read access, but no setBalance()

    void deposit(long amt) {
        if (amt <= 0) throw new IllegalArgumentException("deposit must be positive");
        balancePaise += amt;
    }

    boolean withdraw(long amt) {
        if (amt <= 0 || amt > balancePaise) return false;   // invariant: balance >= 0
        balancePaise -= amt;
        return true;
    }
}

class EncapsulationDemo {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("SB-101", 100_000);
        acc.deposit(50_000);
        System.out.println(acc.withdraw(500_000));    // false - rejected
        System.out.println(acc.getBalance());         // 150000
        // acc.balancePaise = -5;                     // compile error: balancePaise has private access
    }
}`, lang: "java", title: "EncapsulationDemo.java" }
      ] },
      { h: "Pillar 2 — Abstraction (depend on what, not how)", blocks: [
        { p: "The checkout code below knows only the <code>PaymentMethod</code> contract. UPI and card details are hidden behind it; adding net-banking later needs no change to <code>Checkout</code>. Abstraction is achieved with <b>interfaces</b> and <b>abstract classes</b>." },
        { code: `interface PaymentMethod {
    boolean pay(long amountPaise);                // WHAT: pay an amount
}

class UpiPayment implements PaymentMethod {
    private final String vpa;
    UpiPayment(String vpa) { this.vpa = vpa; }
    @Override public boolean pay(long amountPaise) {      // HOW: UPI collect request
        System.out.println("UPI request to " + vpa + " for Rs " + amountPaise / 100);
        return true;
    }
}

class CardPayment implements PaymentMethod {
    private final String last4;
    CardPayment(String last4) { this.last4 = last4; }
    @Override public boolean pay(long amountPaise) {      // HOW: card + OTP
        System.out.println("Charging card xx" + last4 + " Rs " + amountPaise / 100 + " after OTP");
        return true;
    }
}

class Checkout {
    static void placeOrder(PaymentMethod pm, long amountPaise) {
        if (pm.pay(amountPaise)) System.out.println("Order confirmed");
    }
    public static void main(String[] args) {
        placeOrder(new UpiPayment("ravi@okbank"), 49_900);   // UPI request to ravi@okbank for Rs 499
        placeOrder(new CardPayment("4242"), 129_900);        // Charging card xx4242 Rs 1299 after OTP
    }
}`, lang: "java", title: "Checkout.java" },
        { table: { head: ["", "Encapsulation", "Abstraction"], rows: [
          ["Question it answers", "Who may touch the data?", "What does the caller need to know?"],
          ["Mechanism", "<code>private</code> fields, validated methods", "Interfaces, abstract classes/methods"],
          ["Level", "Implementation (inside a class)", "Design (between classes)"],
          ["Example above", "<code>balancePaise</code> can't go negative", "<code>Checkout</code> never sees UPI/card details"]
        ] } }
      ] },
      { h: "Pillars 3 & 4 — Inheritance and Polymorphism", blocks: [
        { p: "<b>Inheritance</b>: <code>Manager</code> <i>is an</i> <code>Employee</code>; it reuses the name, salary and <code>describe()</code> and changes only how pay is computed. <b>Runtime polymorphism</b>: <code>describe()</code> is written once in the parent but calls whichever <code>monthlyPay()</code> the actual object has. <b>Compile-time polymorphism</b>: overloaded <code>format</code> methods chosen by argument type." },
        { code: `import java.util.*;

class Employee {
    protected final String name;
    protected final long baseSalary;
    Employee(String name, long baseSalary) { this.name = name; this.baseSalary = baseSalary; }
    long monthlyPay() { return baseSalary; }
    String describe() { return name + " earns " + monthlyPay(); }   // calls the OVERRIDDEN version
}

class Manager extends Employee {
    private final long bonus;
    Manager(String name, long baseSalary, long bonus) {
        super(name, baseSalary);                  // parent initialises its own part
        this.bonus = bonus;
    }
    @Override long monthlyPay() { return baseSalary + bonus; }
}

class Intern extends Employee {
    Intern(String name) { super(name, 25_000); }
    @Override long monthlyPay() { return baseSalary; }       // same as parent, shown for clarity
}

class Formatter {                                 // compile-time polymorphism (overloading)
    static String format(int x)    { return "int:" + x; }
    static String format(double x) { return "double:" + x; }
    static String format(String x) { return "String:" + x; }
}

class PolyDemo {
    public static void main(String[] args) {
        List<Employee> staff = List.of(new Employee("Ravi", 80_000),
                                       new Manager("Asha", 90_000, 20_000),
                                       new Intern("Om"));
        for (Employee e : staff) System.out.println(e.describe());
        // Ravi earns 80000
        // Asha earns 110000
        // Om earns 25000
        System.out.println(Formatter.format(5) + " " + Formatter.format(5.0) + " " + Formatter.format("5"));
        // int:5 double:5.0 String:5
    }
}`, lang: "java", title: "PolyDemo.java" },
        { table: { head: ["", "Compile-time (static)", "Run-time (dynamic)"], rows: [
          ["Mechanism", "Overloading: same name, different parameter lists", "Overriding: subclass redefines an inherited method"],
          ["Decided by", "Declared (static) types of the arguments", "Actual class of the object"],
          ["When", "By javac", "By the JVM at the call (dynamic dispatch)"],
          ["Example", "<code>format(5)</code> vs <code>format(\"5\")</code>", "<code>e.describe()</code> → <code>Manager.monthlyPay()</code>"]
        ] } },
        { tip: "When asked to 'write your own class for each pillar', pick a domain you can talk about (bank, payments, payroll, your project). Interviewers care that you can say <b>what goes wrong without the pillar</b>: without encapsulation, anyone can set balance = -5; without abstraction, Checkout has an if-else per payment type." }
      ] },
      { h: "== vs equals() and the Integer cache", blocks: [
        { table: { head: ["", "<code>==</code>", "<code>equals()</code>"], rows: [
          ["Primitives (<code>int</code>, <code>char</code>…)", "Compares values", "Not available (primitives have no methods)"],
          ["Objects", "Same object? (reference identity)", "Same content? — as defined by the class"],
          ["Default in <code>Object</code>", "—", "<code>return this == obj;</code> (identity!)"],
          ["Overridden by", "—", "<code>String</code>, <code>Integer</code>, <code>List</code>, records, your classes"]
        ] } },
        { p: "Autoboxing <code>Integer x = 127;</code> compiles to <code>Integer.valueOf(127)</code>. <code>valueOf</code> returns a <b>shared cached object</b> for values -128..127 (the upper bound can be raised with <code>-XX:AutoBoxCacheMax</code>), and a <b>new object</b> otherwise. <code>Short</code>, <code>Byte</code>, <code>Long</code> and <code>Character</code> (0..127) cache too; <code>Float</code>/<code>Double</code> do not." },
        { code: `class EqualityDemo {
    public static void main(String[] args) {
        Integer x = 127, y = 127;
        Integer p = 128, q = 128;
        System.out.println(x == y);          // true  - same cached object
        System.out.println(p == q);          // false - two different objects
        System.out.println(p.equals(q));     // true  - same value
        System.out.println(p == 128);        // true  - one side is int, so p is unboxed

        Long big = 127L;
        System.out.println(big.equals(127)); // false - 127 boxes to Integer, and Long.equals needs a Long

        StringBuilder a = new StringBuilder("hi"), b = new StringBuilder("hi");
        System.out.println(a.equals(b));     // false - StringBuilder does NOT override equals
        System.out.println(a.toString().equals(b.toString()));   // true
    }
}`, lang: "java", title: "EqualityDemo.java" },
        { warn: "Unboxing a <code>null</code> throws <code>NullPointerException</code>: <code>Integer v = map.get(\"missing\"); int n = v;</code> crashes. Use <code>getOrDefault</code> or check for null first." }
      ] },
      { h: "Why Strings are immutable (and the string pool)", blocks: [
        { svg: `<svg viewBox="0 0 620 210" width="620" class="dg">
  <rect class="box" x="20" y="20" width="160" height="175" rx="8"/>
  <text class="tx tx-b" x="100" y="40" text-anchor="middle" dominant-baseline="middle">Stack: main()</text>
  <rect class="box-p" x="50" y="65" width="100" height="28" rx="5"/>
  <text class="tx-c" x="100" y="79" text-anchor="middle" dominant-baseline="middle">a</text>
  <rect class="box-p" x="50" y="110" width="100" height="28" rx="5"/>
  <text class="tx-c" x="100" y="124" text-anchor="middle" dominant-baseline="middle">b</text>
  <rect class="box-p" x="50" y="155" width="100" height="28" rx="5"/>
  <text class="tx-c" x="100" y="169" text-anchor="middle" dominant-baseline="middle">c</text>
  <rect class="box" x="240" y="10" width="365" height="190" rx="8"/>
  <text class="tx tx-b" x="422" y="28" text-anchor="middle" dominant-baseline="middle">Heap</text>
  <rect class="box-a" x="260" y="50" width="170" height="80" rx="8"/>
  <text class="tx-m" x="345" y="66" text-anchor="middle" dominant-baseline="middle">String pool</text>
  <rect class="box-g" x="295" y="84" width="100" height="30" rx="5"/>
  <text class="tx-c" x="345" y="99" text-anchor="middle" dominant-baseline="middle">"java"</text>
  <rect class="box-w" x="455" y="140" width="130" height="32" rx="5"/>
  <text class="tx-c" x="520" y="156" text-anchor="middle" dominant-baseline="middle">"java"</text>
  <text class="tx-m" x="520" y="188" text-anchor="middle">new String("java")</text>
  <line class="ln" x1="150" y1="79" x2="293" y2="95" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="150" y1="124" x2="293" y2="106" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="150" y1="169" x2="453" y2="158" marker-end="url(#dg-arr)"/>
</svg>`, caption: "String a = \"java\"; String b = \"java\"; String c = new String(\"java\");  →  a == b is true, a == c is false, a.equals(c) is true." },
        { p: "Literals are <b>interned</b>: the JVM keeps one copy of each literal in the string pool (part of the heap since Java 7) and hands out the same reference. Sharing one object among thousands of variables is only safe because nobody can change it." },
        { table: { head: ["Reason", "What would break if Strings were mutable"], rows: [
          ["String pool / memory", "<code>a</code> changing \"java\" to \"jav\" would silently change <code>b</code> too"],
          ["Cached hashCode", "<code>String</code> computes its hash once and caches it; a mutable key would move to the wrong HashMap bucket after insertion"],
          ["Security", "A path or URL checked by a security manager could be changed between the check and the use (time-of-check/time-of-use)"],
          ["Thread safety", "Immutable objects can be shared across threads with no locking"],
          ["Class loading", "Class names are Strings; <code>Class.forName(\"java.lang.Object\")</code> must load what it was asked"]
        ] } },
        { tip: "Follow-up: 'Then why use <code>char[]</code> for passwords?' — a <code>String</code> password stays in memory (maybe in the pool) until GC, and you cannot wipe it; a <code>char[]</code> can be overwritten with zeros right after use." }
      ] }
    ],
    practice: [
      { q: "Is <code>data hiding</code> the same as encapsulation? Give a one-line difference.", a: "No. Data hiding is making fields inaccessible (<code>private</code>). Encapsulation is bundling data with the methods that maintain its rules; data hiding is the tool that makes encapsulation enforceable." },
      { q: "Predict: <code>Integer a = 100, b = 100, c = 1000, d = 1000; System.out.println((a == b) + \" \" + (c == d) + \" \" + c.equals(d));</code>", a: "<code>true false true</code>. 100 is within the cache, so <code>a</code> and <code>b</code> are the same object; 1000 is not, so <code>c</code> and <code>d</code> are different objects with equal values." },
      { q: "A class <code>Point</code> has fields x, y but no <code>equals</code>. What does <code>new Point(1,2).equals(new Point(1,2))</code> return, and how do you fix it?", a: "<code>false</code> — it inherits <code>Object.equals</code>, which is <code>==</code>. Fix: override <code>equals</code> to compare x and y (and override <code>hashCode</code> consistently, e.g. <code>Objects.hash(x, y)</code>), or declare it as <code>record Point(int x, int y) {}</code>, which generates both." },
      { q: "Which pillar does each violate? (a) <code>public double balance;</code> (b) <code>if (type.equals(\"UPI\")) … else if (type.equals(\"CARD\")) …</code> inside Checkout.", a: "(a) Encapsulation — any code can set an invalid balance. (b) Abstraction/polymorphism — Checkout knows every payment's details; replace the chain with a <code>PaymentMethod</code> interface and let each class implement <code>pay</code>." },
      { q: "How many String objects are created by <code>String s = new String(\"hello\");</code>?", a: "Up to two: the literal <code>\"hello\"</code> in the pool (only if it is not already there — it is created when the class is loaded/resolved) and one new heap object from <code>new</code>. That is why <code>new String(literal)</code> is pointless in real code." }
    ],
    related: ["oops:four-pillars", "oops:what-is-oop", "oops:class-vs-object", "oops:encapsulation-vs-abstraction", "oops:data-hiding", "oops:access-specifiers", "oops:compile-vs-runtime-polymorphism", "oops:inheritance-types", "oops:is-a-vs-has-a", "oops:java-references", "oops:java-pass-by-value", "oops:equals-hashcode", "oops:wrapper-autoboxing", "oops:string-immutability", "oops:java-pure-oop"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "oop-constructors-copy",
    subject: "oops",
    title: "Constructors, init order, static & final, shallow vs deep copy (Matrix class)",
    minutes: 90,
    crux: [
      "The compiler adds a no-arg constructor <b>only if you write none</b>. Overload constructors and funnel them into one 'real' one with <code>this(...)</code>.",
      "<code>this(...)</code> or <code>super(...)</code> must be the <b>first statement</b>; if you write neither, the compiler inserts <code>super()</code> — which fails if the parent has no no-arg constructor.",
      "Order: <b>static</b> fields/blocks (once, parent before child) → per object: parent instance fields/blocks → parent constructor body → child instance fields/blocks → child constructor body.",
      "<code>static</code> = one copy per class; instance = one per object. <code>final</code> variable: assigned once (the referenced object can still change); <code>final</code> method: no override; <code>final</code> class: no subclass.",
      "Shallow copy copies references (inner arrays/objects are <b>shared</b>); deep copy copies the objects they point to. <code>int[][].clone()</code> is shallow!",
      "Override <code>equals</code>, <code>hashCode</code> and <code>toString</code> <b>together</b>. Immutable class = final class + private final fields + no setters + defensive copies in and out."
    ],
    sections: [
      { h: "Constructors, overloading and this()/super() chaining", blocks: [
        { p: "A constructor has the class's name and no return type; it runs once per <code>new</code> to put the object in a valid state. Several constructors with different parameter lists = <b>constructor overloading</b>. To avoid copy-pasted initialisation, let the short ones delegate to the complete one with <code>this(...)</code>. A subclass constructor must first build the parent part with <code>super(...)</code>." },
        { code: `class Student {
    private final String name;
    private final int year;
    private final String branch;

    Student(String name) { this(name, 1); }                       // delegates
    Student(String name, int year) { this(name, year, "CSE"); }   // delegates
    Student(String name, int year, String branch) {               // the one "real" constructor
        if (year < 1 || year > 4) throw new IllegalArgumentException("year 1..4");
        this.name = name;
        this.year = year;
        this.branch = branch;
    }
    @Override public String toString() { return name + "/" + year + "/" + branch; }
}

class TeachingAssistant extends Student {
    private final String course;
    TeachingAssistant(String name, String course) {
        super(name, 4);              // must be the first statement; builds the Student part
        this.course = course;
    }
    @Override public String toString() { return super.toString() + " TA of " + course; }
}

class ChainDemo {
    public static void main(String[] args) {
        System.out.println(new Student("Ravi"));                    // Ravi/1/CSE
        System.out.println(new Student("Om", 3, "ECE"));            // Om/3/ECE
        System.out.println(new TeachingAssistant("Meera", "DSA"));  // Meera/4/CSE TA of DSA
    }
}`, lang: "java", title: "ChainDemo.java" },
        { ul: [
          "Writing any constructor removes the free default one: after declaring <code>Student(String)</code>, <code>new Student()</code> no longer compiles.",
          "If <code>TeachingAssistant</code>'s constructor did not call <code>super(name, 4)</code>, javac would insert <code>super()</code> and fail: 'constructor Student in class Student cannot be applied to given types'.",
          "A constructor cannot contain both <code>this(...)</code> and <code>super(...)</code> — each must be first. The chain always ends in a constructor that calls <code>super</code> (explicitly or implicitly).",
          "Constructors are not inherited and cannot be <code>static</code>, <code>final</code> or <code>abstract</code>; they <i>can</i> be <code>private</code> (singletons, factory methods, utility classes)."
        ] }
      ] },
      { h: "Initialisation order (static block → instance block → constructor)", blocks: [
        { svg: `<svg viewBox="0 0 700 200" width="700" class="dg">
  <text class="tx-m" x="10" y="18">Once, when the class is first used (e.g. first new Child())</text>
  <rect class="box-p" x="10" y="30" width="200" height="40" rx="6"/>
  <text class="tx" x="110" y="50" text-anchor="middle" dominant-baseline="middle">Parent static init</text>
  <rect class="box-p" x="250" y="30" width="200" height="40" rx="6"/>
  <text class="tx" x="350" y="50" text-anchor="middle" dominant-baseline="middle">Child static init</text>
  <line class="ln" x1="210" y1="50" x2="248" y2="50" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="10" y="103">Every new Child()  (Child() first calls super())</text>
  <rect class="box-a" x="10" y="115" width="125" height="50" rx="6"/>
  <text class="tx-s" x="72" y="132" text-anchor="middle" dominant-baseline="middle">Parent fields</text>
  <text class="tx-s" x="72" y="150" text-anchor="middle" dominant-baseline="middle">+ instance blocks</text>
  <rect class="box-a" x="147" y="115" width="125" height="50" rx="6"/>
  <text class="tx-s" x="209" y="132" text-anchor="middle" dominant-baseline="middle">Parent</text>
  <text class="tx-s" x="209" y="150" text-anchor="middle" dominant-baseline="middle">constructor body</text>
  <rect class="box-g" x="284" y="115" width="125" height="50" rx="6"/>
  <text class="tx-s" x="346" y="132" text-anchor="middle" dominant-baseline="middle">Child fields</text>
  <text class="tx-s" x="346" y="150" text-anchor="middle" dominant-baseline="middle">+ instance blocks</text>
  <rect class="box-g" x="421" y="115" width="125" height="50" rx="6"/>
  <text class="tx-s" x="483" y="132" text-anchor="middle" dominant-baseline="middle">Child</text>
  <text class="tx-s" x="483" y="150" text-anchor="middle" dominant-baseline="middle">constructor body</text>
  <rect class="box" x="558" y="115" width="130" height="50" rx="6"/>
  <text class="tx-s" x="623" y="132" text-anchor="middle" dominant-baseline="middle">reference returned</text>
  <text class="tx-s" x="623" y="150" text-anchor="middle" dominant-baseline="middle">to the caller</text>
  <line class="ln" x1="135" y1="140" x2="145" y2="140" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="272" y1="140" x2="282" y2="140" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="409" y1="140" x2="419" y2="140" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="546" y1="140" x2="556" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="350" y="190" text-anchor="middle">Within one step, field initialisers and instance blocks run top-to-bottom in source order.</text>
</svg>`, caption: "Static initialisation happens once per class; steps 3–6 happen for every object." },
        { code: `class Parent {
    static { System.out.println("1. Parent static block"); }
    { System.out.println("3. Parent instance block"); }
    Parent() { System.out.println("4. Parent constructor"); }
}

class Child extends Parent {
    static { System.out.println("2. Child static block"); }
    private int x = initX();                                 // field initialiser
    { System.out.println("6. Child instance block"); }
    Child() {
        super();                                             // implicit if omitted
        System.out.println("7. Child constructor, x=" + x);
    }
    private int initX() { System.out.println("5. Child field initialiser"); return 42; }
}

class InitOrder {
    public static void main(String[] args) {
        System.out.println("-- first object --");
        new Child();
        System.out.println("-- second object --");
        new Child();                                         // static blocks do NOT run again
    }
}`, lang: "java", title: "InitOrder.java" },
        { code: `-- first object --
1. Parent static block
2. Child static block
3. Parent instance block
4. Parent constructor
5. Child field initialiser
6. Child instance block
7. Child constructor, x=42
-- second object --
3. Parent instance block
4. Parent constructor
5. Child field initialiser
6. Child instance block
7. Child constructor, x=42`, lang: "text", title: "Output" },
        { tip: "Notice '-- first object --' prints <b>before</b> the static blocks: a class is initialised lazily, on first active use (<code>new</code>, a static method call, or a non-constant static field access), not when the program starts." }
      ] },
      { h: "static vs instance, and the three meanings of final", blocks: [
        { table: { head: ["", "static member", "instance member"], rows: [
          ["Copies", "One per class (shared)", "One per object"],
          ["Access", "<code>ClassName.member</code>", "<code>ref.member</code>"],
          ["Can use <code>this</code>?", "No — there is no current object", "Yes"],
          ["Can access", "Only other static members directly", "Both static and instance members"],
          ["Typical use", "Counters, constants, factory/utility methods", "The object's own state and behaviour"]
        ] } },
        { code: `import java.util.*;

class Ticket {
    private static int issued = 0;          // shared by all tickets
    private final int number;               // one per ticket
    Ticket() { issued++; number = issued; }
    static int issued() { return issued; }  // static: no 'this' here
    int number() { return number; }
}

final class Limits {                        // final class: cannot be extended
    static final int MAX_SEATS = 60;        // constant (static + final)
    private Limits() { }                    // no instances
}

class Base {
    final void audit() { System.out.println("audited"); }   // final method: cannot be overridden
}
class Derived extends Base {
    // void audit() { }    // error: audit() in Derived cannot override audit() in Base
}
// class MoreLimits extends Limits { }      // error: cannot inherit from final Limits

class StaticFinalDemo {
    public static void main(String[] args) {
        Ticket t1 = new Ticket(), t2 = new Ticket(), t3 = new Ticket();
        System.out.println(t2.number() + " " + Ticket.issued());   // 2 3

        final List<String> names = new ArrayList<>();
        names.add("Asha");                  // allowed: the OBJECT is mutable
        // names = new ArrayList<>();       // error: cannot assign a value to final variable names
        final int half;                     // blank final: assigned exactly once
        half = Limits.MAX_SEATS / 2;
        System.out.println(names + " " + half);                    // [Asha] 30
        new Derived().audit();                                      // audited
    }
}`, lang: "java", title: "StaticFinalDemo.java" },
        { warn: "<code>final</code> makes the <b>variable</b> unassignable, not the <b>object</b> immutable. <code>final int[] a</code> still allows <code>a[0] = 5</code>. That is why an immutable class needs defensive copies, not just <code>final</code>." }
      ] },
      { h: "Shallow vs deep copy", blocks: [
        { svg: `<svg viewBox="0 0 660 200" width="660" class="dg">
  <rect class="box" x="20" y="25" width="120" height="40" rx="6"/>
  <text class="tx" x="80" y="45" text-anchor="middle" dominant-baseline="middle">m1 { data }</text>
  <rect class="box" x="20" y="115" width="120" height="40" rx="6"/>
  <text class="tx" x="80" y="135" text-anchor="middle" dominant-baseline="middle">m2 { data }</text>
  <rect class="box-r" x="190" y="70" width="120" height="40" rx="6"/>
  <text class="tx-c" x="250" y="90" text-anchor="middle" dominant-baseline="middle">{{1,2},{3,4}}</text>
  <line class="ln" x1="140" y1="45" x2="188" y2="82" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="140" y1="135" x2="188" y2="98" marker-end="url(#dg-arr)"/>
  <rect class="box" x="360" y="25" width="120" height="40" rx="6"/>
  <text class="tx" x="420" y="45" text-anchor="middle" dominant-baseline="middle">m1 { data }</text>
  <rect class="box" x="360" y="115" width="120" height="40" rx="6"/>
  <text class="tx" x="420" y="135" text-anchor="middle" dominant-baseline="middle">m2 { data }</text>
  <rect class="box-g" x="520" y="25" width="120" height="40" rx="6"/>
  <text class="tx-c" x="580" y="45" text-anchor="middle" dominant-baseline="middle">{{1,2},{3,4}}</text>
  <rect class="box-g" x="520" y="115" width="120" height="40" rx="6"/>
  <text class="tx-c" x="580" y="135" text-anchor="middle" dominant-baseline="middle">{{1,2},{3,4}}</text>
  <line class="ln" x1="480" y1="45" x2="518" y2="45" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="480" y1="135" x2="518" y2="135" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="165" y="185" text-anchor="middle">Shallow: one shared array</text>
  <text class="tx tx-b" x="500" y="185" text-anchor="middle">Deep: each object owns its copy</text>
</svg>`, caption: "After a shallow copy, m2.set(0,0,9) also changes m1. After a deep copy it cannot." },
        { table: { head: ["Copy method", "Depth for <code>int[][]</code> / object graphs"], rows: [
          ["<code>b = a</code>", "No copy at all — same object"],
          ["<code>a.clone()</code> on an array", "Shallow: new outer array, <b>same</b> row arrays (for <code>int[]</code> this is a full copy, because ints are values)"],
          ["<code>Object.clone()</code> (via <code>Cloneable</code>)", "Shallow field-by-field copy unless you override and copy nested objects"],
          ["Copy constructor <code>new Matrix(other)</code>", "Whatever you write — the recommended way to make a deep copy explicit"],
          ["<code>Arrays.copyOf(row, n)</code> per row", "Deep for primitive 2-D arrays"]
        ] } }
      ] },
      { h: "Build it: Matrix with copy constructor, deep copy, equals/hashCode/toString", blocks: [
        { code: `import java.util.Arrays;

class Matrix {
    private final int rows, cols;
    private final int[][] data;

    Matrix(int rows, int cols) {
        if (rows <= 0 || cols <= 0) throw new IllegalArgumentException("size must be positive");
        this.rows = rows;
        this.cols = cols;
        this.data = new int[rows][cols];
    }

    Matrix(int[][] values) {                     // never keep the caller's array: copy each row
        this(values.length, values[0].length);
        for (int i = 0; i < rows; i++) {
            if (values[i].length != cols) throw new IllegalArgumentException("ragged array");
            data[i] = values[i].clone();         // clone of an int[] is a full copy
        }
    }

    Matrix(Matrix other) {                       // copy constructor = deep copy
        this(other.data);
    }

    int get(int r, int c) { return data[r][c]; }
    void set(int r, int c, int v) { data[r][c] = v; }

    Matrix multiply(Matrix o) {
        if (cols != o.rows) throw new IllegalArgumentException("dimension mismatch");
        Matrix res = new Matrix(rows, o.cols);
        for (int i = 0; i < rows; i++)
            for (int j = 0; j < o.cols; j++) {
                int sum = 0;
                for (int k = 0; k < cols; k++) sum += data[i][k] * o.data[k][j];
                res.data[i][j] = sum;
            }
        return res;
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;                          // same object
        if (o == null || getClass() != o.getClass()) return false;
        Matrix m = (Matrix) o;
        return rows == m.rows && cols == m.cols && Arrays.deepEquals(data, m.data);
    }
    @Override public int hashCode() { return Arrays.deepHashCode(data); }   // equal matrices -> equal hash
    @Override public String toString() { return Arrays.deepToString(data); }
}

class MatrixDemo {
    public static void main(String[] args) {
        int[][] raw = {{1, 2}, {3, 4}};
        Matrix a = new Matrix(raw);
        raw[0][0] = 100;                              // caller changes its own array...
        System.out.println(a);                        // [[1, 2], [3, 4]]  ...Matrix is unaffected

        Matrix b = new Matrix(a);                     // deep copy
        System.out.println(a.equals(b) + " " + (a == b) + " " + (a.hashCode() == b.hashCode())); // true false true
        b.set(0, 0, 9);
        System.out.println(a + " vs " + b);           // [[1, 2], [3, 4]] vs [[9, 2], [3, 4]]
        System.out.println(a.equals(b));              // false

        Matrix identity = new Matrix(new int[][]{{1, 0}, {0, 1}});
        System.out.println(a.multiply(identity).equals(a));   // true
        System.out.println(a.multiply(a));                     // [[7, 10], [15, 22]]

        int[][] shallow = raw.clone();                // clone of a 2-D array is SHALLOW
        shallow[1][1] = -1;
        System.out.println(raw[1][1]);                // -1  (the row arrays are shared)
    }
}`, lang: "java", title: "MatrixDemo.java" },
        { p: "<b>Check the multiply by hand:</b> [[1,2],[3,4]]² → row 1: 1·1 + 2·3 = 7, 1·2 + 2·4 = 10; row 2: 3·1 + 4·3 = 15, 3·2 + 4·4 = 22." },
        { ul: [
          "<code>equals</code> uses <code>Arrays.deepEquals</code> — <code>data.equals(m.data)</code> would compare array <i>references</i> (arrays don't override <code>equals</code>).",
          "<code>getClass() != o.getClass()</code> keeps <code>equals</code> symmetric if someone subclasses <code>Matrix</code>; <code>instanceof</code> is fine when the class is <code>final</code>.",
          "<code>hashCode</code> must use the same fields as <code>equals</code>, so equal matrices land in the same <code>HashSet</code> bucket."
        ] }
      ] },
      { h: "Now make it immutable", blocks: [
        { p: "Recipe: (1) <code>final</code> class so no subclass can add mutable behaviour; (2) all fields <code>private final</code>; (3) no setters — 'modifiers' return a new object; (4) defensive copy of mutable inputs in the constructor; (5) defensive copy of mutable state in getters." },
        { code: `import java.util.Arrays;

final class ImmutableMatrix {                           // (1) cannot be subclassed
    private final int rows, cols;                       // (2) private final
    private final int[][] data;

    ImmutableMatrix(int[][] values) {
        this.rows = values.length;
        this.cols = values[0].length;
        this.data = deepCopy(values);                   // (4) copy IN
    }

    private static int[][] deepCopy(int[][] src) {
        int[][] copy = new int[src.length][];
        for (int i = 0; i < src.length; i++) copy[i] = Arrays.copyOf(src[i], src[i].length);
        return copy;
    }

    int rows() { return rows; }
    int cols() { return cols; }
    int get(int r, int c) { return data[r][c]; }        // primitives are safe to hand out
    int[][] toArray() { return deepCopy(data); }        // (5) copy OUT

    ImmutableMatrix with(int r, int c, int v) {         // (3) "setter" returns a NEW matrix
        int[][] copy = deepCopy(data);
        copy[r][c] = v;
        return new ImmutableMatrix(copy);
    }

    @Override public boolean equals(Object o) {
        return o instanceof ImmutableMatrix m && Arrays.deepEquals(data, m.data);   // class is final: instanceof is fine
    }
    @Override public int hashCode() { return Arrays.deepHashCode(data); }
    @Override public String toString() { return Arrays.deepToString(data); }
}

class ImmutableDemo {
    public static void main(String[] args) {
        int[][] raw = {{1, 2}, {3, 4}};
        ImmutableMatrix m = new ImmutableMatrix(raw);
        raw[0][0] = 50;                                 // no effect on m
        int[][] leaked = m.toArray();
        leaked[1][1] = 70;                              // no effect on m
        ImmutableMatrix m2 = m.with(0, 1, 8);
        System.out.println(m + " " + m2);               // [[1, 2], [3, 4]] [[1, 8], [3, 4]]
    }
}`, lang: "java", title: "ImmutableDemo.java" },
        { warn: "Forgetting step (5) is the classic bug: <code>int[][] getData() { return data; }</code> hands the caller the internal array, and <code>m.getData()[0][0] = 99</code> mutates your 'immutable' object." },
        { tip: "Why bother? Immutable objects are thread-safe without locks, safe as <code>HashMap</code> keys (their hash never changes), and can be shared and cached freely — the same reasons <code>String</code> is immutable." }
      ] }
    ],
    practice: [
      { q: "<code>class A { A(int x) { } } class B extends A { B() { } }</code> — does it compile?", a: "No. <code>B()</code> has no explicit <code>super(...)</code>, so javac inserts <code>super()</code>, but <code>A</code> has no no-arg constructor (declaring <code>A(int)</code> removed the default one). Fix: <code>B() { super(0); }</code> or add <code>A() { }</code>." },
      { q: "A class has a static block printing S, an instance block printing I and a constructor printing C. What does <code>new X(); new X();</code> print?", a: "<code>S I C I C</code> — the static block runs once, when the class is initialised; the instance block and constructor run for each object, instance block first." },
      { q: "<code>final StringBuilder sb = new StringBuilder(\"a\"); sb.append(\"b\");</code> — legal? What about <code>sb = new StringBuilder();</code>?", a: "The append is legal (the object is mutable; <code>final</code> only fixes the reference) — sb now holds \"ab\". Reassigning <code>sb</code> is a compile error." },
      { q: "You store a <code>Matrix</code> in a <code>HashSet</code>, then call <code>set(0,0,5)</code> on it. Why might <code>set.contains(m)</code> now return false?", a: "<code>hashCode</code> depends on the contents. After mutation the new hash usually points to a different bucket than the one the element was stored in, so lookup misses it (and the stale entry can't be removed normally). Mutable objects make bad hash keys — another argument for <code>ImmutableMatrix</code>." },
      { q: "Is <code>Object.clone()</code> on a <code>Matrix</code> (after implementing <code>Cloneable</code>) shallow or deep? How would you make it deep?", a: "Shallow: the clone's <code>data</code> field points to the same <code>int[][]</code>. To make it deep, override <code>clone()</code>, call <code>super.clone()</code>, then replace <code>data</code> with a row-by-row copy — but since <code>data</code> is <code>final</code> you can't reassign it after <code>super.clone()</code>, which is one reason copy constructors are preferred over <code>clone()</code>." }
    ],
    related: ["oops:constructor-types", "oops:constructor-rules", "oops:initialization-order", "oops:constructor-destructor-order", "oops:this-pointer", "oops:super-keyword", "oops:static-members", "oops:final-finally-finalize", "oops:shallow-vs-deep-copy", "oops:immutable-class", "oops:object-class-methods", "oops:equals-hashcode", "oops:object-creation-ways", "oops:stack-vs-heap"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "oop-inheritance-dispatch",
    subject: "oops",
    title: "Inheritance, overriding rules, dynamic dispatch, abstract class vs interface",
    minutes: 90,
    crux: [
      "A Java class <code>extends</code> exactly <b>one</b> class (single inheritance) but can <code>implements</code> many interfaces.",
      "Overriding rules: same name + parameters; return type same or a <b>subtype</b> (covariant); access <b>same or wider</b>; checked exceptions <b>same, narrower or none</b>; always write <code>@Override</code>.",
      "Overloading = same name, different parameters, picked at <b>compile time</b> from declared types. Overriding = picked at <b>run time</b> from the object's class. Static methods are <b>hidden</b>, not overridden.",
      "Every non-static, non-final, non-private instance method is <b>virtual</b>: <code>Animal a = new Dog(); a.speak()</code> runs <code>Dog.speak()</code>. Fields are <b>not</b> polymorphic.",
      "Since Java 8 interfaces have <code>default</code> and <code>static</code> methods; the difference from abstract classes is now <b>state</b> (fields), <b>constructors</b> and <b>single vs multiple</b> inheritance.",
      "Diamond with two defaults: the class must override and can pick one with <code>InterfaceName.super.method()</code>."
    ],
    sections: [
      { h: "extends: what a subclass gets", blocks: [
        { ul: [
          "<b>Inherited:</b> all <code>public</code> and <code>protected</code> fields/methods, and package-private ones if in the same package.",
          "<b>Not inherited:</b> constructors (the child calls them via <code>super(...)</code>) and <code>private</code> members (they exist inside the object but the child can't name them).",
          "<b>Single inheritance of classes:</b> <code>class C extends A, B</code> does not compile — this avoids two copies of shared state (the diamond problem). Multiple inheritance of <i>type</i> is done with interfaces.",
          "<code>super.method()</code> calls the parent's version from inside an override; <code>super(...)</code> calls the parent's constructor."
        ] },
        { tip: "Use inheritance only for a genuine <b>is-a</b> relationship where the child can stand in for the parent everywhere (Liskov). For 'has-a' or 'uses-a', prefer composition — interviewers like hearing 'favour composition over inheritance' with a reason: inheritance couples you to the parent's implementation." }
      ] },
      { h: "Overriding rules — each one with the compiler's verdict", blocks: [
        { table: { head: ["Rule", "Allowed", "Not allowed (compile error)"], rows: [
          ["Signature", "Same name and parameter types", "Different parameters → that's an <i>overload</i>, not an override"],
          ["Return type", "Same, or a subtype (covariant): parent returns <code>Animal</code>, child returns <code>Dog</code>", "Unrelated or wider type; primitives must match exactly"],
          ["Access", "Same or wider: <code>protected</code> → <code>public</code>", "Narrower: <code>public</code> → <code>protected</code>/default/<code>private</code>"],
          ["Checked exceptions", "Same, subclass (narrower), or none; any unchecked exceptions", "New or broader checked exception (<code>IOException</code> → <code>Exception</code>)"],
          ["Modifiers", "Override any non-final instance method", "<code>final</code> methods; <code>static</code> methods (can only be hidden); <code>private</code> methods (not inherited — a same-name method is unrelated)"],
          ["<code>@Override</code>", "Optional but always use it", "If the annotated method doesn't override anything, it's an error — catches typos like <code>equals(Point p)</code>"]
        ] } },
        { code: `import java.io.*;

class Animal {
    protected Animal reproduce() { return new Animal(); }
    void speak() throws IOException { System.out.println("..."); }
    public String name() { return "animal"; }
}

class Dog extends Animal {
    @Override
    public Dog reproduce() { return new Dog(); }        // covariant return + wider access: OK

    @Override
    void speak() throws FileNotFoundException {          // narrower checked exception: OK
        System.out.println("Woof");
    }

    // @Override String name() { return "dog"; }
    //    error: attempting to assign weaker access privileges; was public
    // @Override void speak() throws Exception { }
    //    error: overridden method does not throw Exception
    // @Override void speek() { }
    //    error: method does not override or implement a method from a supertype
}

class OverrideRules {
    public static void main(String[] args) throws IOException {
        Animal a = new Dog();
        a.speak();                                                       // Woof
        System.out.println(a.reproduce().getClass().getSimpleName());    // Dog
    }
}`, lang: "java", title: "OverrideRules.java" },
        { p: "<b>Why these rules?</b> Code written against <code>Animal</code> must keep working when handed a <code>Dog</code>. A caller of <code>Animal.name()</code> expects to reach it (so access can't shrink), handles <code>IOException</code> (so the child can't throw something broader), and expects an <code>Animal</code> back (a <code>Dog</code> is one)." }
      ] },
      { h: "Overloading vs overriding vs static hiding", blocks: [
        { table: { head: ["", "Overloading", "Overriding", "Static method hiding"], rows: [
          ["What", "Same name, different parameter list", "Subclass re-implements an inherited instance method", "Subclass declares a static method with the same signature"],
          ["Where", "Same class or subclass", "Subclass only", "Subclass only"],
          ["Resolved", "Compile time (declared argument types)", "Run time (actual object class)", "Compile time (declared type of the reference/class name)"],
          ["Return type", "Free to differ", "Same or covariant", "Same or covariant"],
          ["Polymorphic?", "Static polymorphism", "Yes — dynamic dispatch", "No"]
        ] } },
        { code: `class Parent {
    static String who() { return "Parent.who"; }
    String greet() { return "Parent.greet"; }
    String show(Object o) { return "Parent.show(Object)"; }
}

class Child extends Parent {
    static String who() { return "Child.who"; }             // HIDES Parent.who
    @Override String greet() { return "Child.greet"; }     // OVERRIDES
    String show(String s) { return "Child.show(String)"; } // OVERLOADS (new signature)
}

class Binding {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(p.greet());      // Child.greet         - object is a Child
        System.out.println(p.who());        // Parent.who          - static: declared type Parent decides
        System.out.println(p.show("hi"));   // Parent.show(Object) - Parent has no show(String); chosen at compile time
        Child c = new Child();
        System.out.println(c.show("hi"));   // Child.show(String)  - most specific overload
        System.out.println(c.show(42));     // Parent.show(Object) - 42 boxes to Integer, only Object fits
    }
}`, lang: "java", title: "Binding.java" },
        { warn: "<code>p.show(\"hi\")</code> surprises people: overload selection uses the <b>declared</b> type <code>Parent</code>, which only knows <code>show(Object)</code>. Dynamic dispatch then looks for an override of <code>show(Object)</code> in <code>Child</code> — there is none, so Parent's runs." }
      ] },
      { h: "Dynamic method dispatch — how a.speak() finds Dog.speak()", blocks: [
        { svg: `<svg viewBox="0 0 680 200" width="680" class="dg">
  <rect class="box-p" x="20" y="70" width="120" height="40" rx="6"/>
  <text class="tx-c" x="80" y="90" text-anchor="middle" dominant-baseline="middle">Animal a</text>
  <text class="tx-m" x="80" y="128" text-anchor="middle">stack: declared type</text>
  <rect class="box" x="190" y="60" width="150" height="60" rx="6"/>
  <text class="tx tx-b" x="265" y="80" text-anchor="middle" dominant-baseline="middle">Dog object</text>
  <text class="tx-s" x="265" y="101" text-anchor="middle" dominant-baseline="middle">header: class = Dog</text>
  <text class="tx-m" x="265" y="138" text-anchor="middle">heap: actual type</text>
  <rect class="box-a" x="400" y="15" width="265" height="170" rx="8"/>
  <text class="tx tx-b" x="532" y="35" text-anchor="middle" dominant-baseline="middle">Dog's method table (vtable)</text>
  <rect class="box-g" x="415" y="55" width="235" height="32" rx="5"/>
  <text class="tx-c" x="532" y="71" text-anchor="middle" dominant-baseline="middle">speak() -&gt; Dog.speak</text>
  <rect class="box" x="415" y="97" width="235" height="32" rx="5"/>
  <text class="tx-c" x="532" y="113" text-anchor="middle" dominant-baseline="middle">eat() -&gt; Animal.eat</text>
  <rect class="box" x="415" y="139" width="235" height="32" rx="5"/>
  <text class="tx-c" x="532" y="155" text-anchor="middle" dominant-baseline="middle">toString() -&gt; Object</text>
  <line class="ln" x1="140" y1="90" x2="188" y2="90" marker-end="url(#dg-arr)"/>
  <line class="ln-a" x1="340" y1="90" x2="413" y2="71" marker-end="url(#dg-arr-a)"/>
</svg>`, caption: "The compiler checks that Animal has speak(); at run time the JVM follows the object's class to its method table and calls the entry there." },
        { p: "Two steps: at <b>compile time</b>, javac checks the method exists on the declared type (<code>Animal</code>) and picks the overload; at <b>run time</b>, <code>invokevirtual</code> looks up that method in the <b>actual</b> object's class, walking up to parents if not overridden. In Java every non-static, non-final, non-private method is virtual by default — there is no <code>virtual</code> keyword. <code>static</code>, <code>private</code>, <code>final</code> methods and constructors are bound early." },
        { code: `class Base {
    String type = "base";
    Base() { init(); }                        // calls an overridable method - a trap
    void init() { System.out.println("Base.init"); }
    void print() { System.out.println("Base.print, type=" + type); }
}

class Derived extends Base {
    String type = "derived";                  // HIDES Base.type - fields are not polymorphic
    private int size = 10;
    @Override void init() { System.out.println("Derived.init, size=" + size); }
    @Override void print() { System.out.println("Derived.print, type=" + type); }
}

class Dispatch {
    public static void main(String[] args) {
        Base b = new Derived();               // Derived.init, size=0   (Derived's fields not yet initialised!)
        b.print();                            // Derived.print, type=derived
        System.out.println(b.type);           // base  (field chosen by the declared type)
    }
}`, lang: "java", title: "Dispatch.java — three traps in one" },
        { ul: [
          "<b>Overridable call in constructor:</b> <code>Base()</code> runs before <code>Derived</code>'s field initialisers, yet dispatch already calls <code>Derived.init()</code>, which sees <code>size = 0</code>. Never call overridable methods from a constructor.",
          "<b>Field hiding:</b> <code>b.type</code> is resolved from the reference type at compile time. Use private fields + getters to get polymorphic behaviour.",
          "<b>Downcasting:</b> <code>((Derived) b)</code> is fine here; <code>(Derived) new Base()</code> compiles but throws <code>ClassCastException</code>. Check with <code>if (b instanceof Derived d)</code>."
        ] }
      ] },
      { h: "Abstract class vs interface (Java 8+) and the diamond", blocks: [
        { table: { head: ["", "Abstract class", "Interface"], rows: [
          ["State", "Any instance fields", "Only <code>public static final</code> constants"],
          ["Constructors", "Yes (run via <code>super(...)</code>)", "No"],
          ["Methods", "Abstract + concrete, any access level", "Abstract; <code>default</code> and <code>static</code> (Java 8); <code>private</code> helpers (Java 9)"],
          ["How many per class", "<code>extends</code> one", "<code>implements</code> many"],
          ["Relationship", "is-a, shared code + state (<code>Shape</code>, <code>AbstractList</code>)", "can-do capability (<code>Comparable</code>, <code>Runnable</code>)"],
          ["Why <code>default</code> exists", "—", "To add methods (e.g. <code>List.sort</code>, <code>forEach</code>) to old interfaces without breaking every implementation"]
        ] } },
        { p: "<b>Conflict rules</b> when two supertypes provide the same method: (1) a method from the <b>class</b> hierarchy always wins over an interface default; (2) otherwise the <b>more specific</b> interface wins (if <code>B extends A</code>, B's default beats A's); (3) otherwise it is ambiguous and the class <b>must override</b>, optionally delegating with <code>X.super.m()</code>." },
        { code: `interface Camera { default String click() { return "Camera click"; } }
interface Phone  { default String click() { return "Phone click"; } }

class SmartPhone implements Camera, Phone {
    @Override
    public String click() {                        // required: otherwise "inherits unrelated defaults" error
        return Camera.super.click() + " + " + Phone.super.click();
    }
}

class Diamond {
    public static void main(String[] args) {
        System.out.println(new SmartPhone().click());   // Camera click + Phone click
    }
}`, lang: "java", title: "Diamond.java" }
      ] },
      { h: "Build it: abstract Shape → Circle / Rectangle, Comparable by area", blocks: [
        { code: `import java.util.*;

abstract class Shape implements Comparable<Shape> {
    private final String name;
    protected Shape(String name) { this.name = name; }     // abstract classes can have constructors

    abstract double area();                                  // every concrete shape must implement

    @Override
    public int compareTo(Shape other) {                      // natural order: by area
        return Double.compare(area(), other.area());         // never (int)(a - b) with doubles
    }

    @Override
    public String toString() {                               // uses the overridden area() - dynamic dispatch
        return String.format("%s(%.2f)", name, area());
    }
}

final class Circle extends Shape {
    private final double r;
    Circle(double r) { super("Circle"); this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}

final class Rectangle extends Shape {
    private final double w, h;
    Rectangle(double w, double h) { super("Rectangle"); this.w = w; this.h = h; }
    @Override double area() { return w * h; }
}

class ShapeDemo {
    public static void main(String[] args) {
        List<Shape> shapes = new ArrayList<>(List.of(
                new Circle(2), new Rectangle(3, 5), new Circle(1), new Rectangle(2, 2)));
        Collections.sort(shapes);                            // uses compareTo
        System.out.println(shapes);
        // [Circle(3.14), Rectangle(4.00), Circle(12.57), Rectangle(15.00)]
        System.out.println("largest: " + Collections.max(shapes));   // largest: Rectangle(15.00)
        shapes.sort(Comparator.reverseOrder());
        System.out.println(shapes.get(0));                   // Rectangle(15.00)
        // Shape s = new Shape("x");   // error: Shape is abstract; cannot be instantiated
    }
}`, lang: "java", title: "ShapeDemo.java" },
        { p: "<b>Areas:</b> Circle(1) = π ≈ 3.14, Rectangle(2,2) = 4, Circle(2) = 4π ≈ 12.57, Rectangle(3,5) = 15 — so ascending order is exactly as printed. <code>toString</code> is written once in <code>Shape</code> yet prints each subclass's own area: that is runtime polymorphism doing the work." },
        { tip: "If asked 'why is Shape abstract and not an interface?' — it holds state (<code>name</code>) and shared behaviour (<code>toString</code>, <code>compareTo</code>) with a constructor to initialise it. If there were no shared state, an interface with a <code>default</code> method would do." }
      ] }
    ],
    practice: [
      { q: "Parent: <code>protected Number value() throws IOException</code>. Which child versions compile? (a) <code>public Integer value()</code> (b) <code>Number value() throws IOException</code> (c) <code>protected Object value()</code> (d) <code>public Number value() throws Exception</code>", a: "(a) compiles — covariant return, wider access, no exception. (b) fails — default (package) access is narrower than protected. (c) fails — <code>Object</code> is not a subtype of <code>Number</code>. (d) fails — <code>Exception</code> is broader than <code>IOException</code>." },
      { q: "<code>class A { static void m() { print(\"A\"); } } class B extends A { static void m() { print(\"B\"); } }</code> — what does <code>A x = new B(); x.m();</code> print?", a: "<code>A</code>. Static methods are hidden, not overridden; the call is bound at compile time using the declared type <code>A</code>." },
      { q: "Which of these calls are dynamically dispatched: a private method, a final method, a static method, a public instance method, a constructor?", a: "Only the public (non-final) instance method. Private (not inherited), final (can't be overridden), static (belongs to the class) and constructors are all bound at compile time." },
      { q: "A class implements interfaces X and Y, both with <code>default void log()</code>, and also extends class Z which has <code>public void log()</code>. Does it compile without overriding? Whose <code>log</code> runs?", a: "Yes, it compiles — rule 1: the class hierarchy wins. <code>Z.log()</code> runs. Without <code>Z</code>, the class would have to override <code>log()</code>." },
      { q: "Add a <code>Triangle(base, height)</code> to the Shape example. What must you write, and what needs to change elsewhere?", a: "<code>final class Triangle extends Shape { private final double b, h; Triangle(double b, double h) { super(\"Triangle\"); this.b = b; this.h = h; } @Override double area() { return 0.5 * b * h; } }</code>. Nothing else changes — sorting, <code>toString</code> and <code>max</code> already work through the abstraction (Open/Closed principle)." }
    ],
    related: ["oops:inheritance-types", "oops:java-overriding-rules", "oops:covariant-return-types", "oops:overloading-vs-overriding", "oops:overload-resolution-rules", "oops:method-hiding-java", "oops:virtual-functions", "oops:early-vs-late-binding", "oops:vtable-vptr", "oops:upcasting-downcasting", "oops:abstract-class-vs-interface", "oops:abstract-class-rules", "oops:interface-default-methods", "oops:diamond-problem", "oops:java-no-multiple-inheritance", "oops:super-keyword", "oops:compile-vs-runtime-polymorphism", "oops:composition-over-inheritance"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "oop-solid",
    subject: "oops",
    title: "SOLID in Java: a real violation and its fix for each principle",
    minutes: 90,
    crux: [
      "<b>S</b>ingle Responsibility: a class should have <b>one reason to change</b> (one actor/stakeholder it answers to).",
      "<b>O</b>pen/Closed: add new behaviour by adding <b>new classes</b>, not by editing a growing if-else/switch.",
      "<b>L</b>iskov Substitution: a subclass must work <b>anywhere its parent is expected</b> — no surprise exceptions, no stronger preconditions, no broken invariants.",
      "<b>I</b>nterface Segregation: many small role interfaces beat one fat interface that forces <code>UnsupportedOperationException</code> stubs.",
      "<b>D</b>ependency Inversion: high-level policy depends on an <b>abstraction</b>; the concrete implementation is <b>injected</b> (usually via the constructor).",
      "The smell to look for in your own project: a class you edit for unrelated reasons, a type switch, an overridden method that throws, empty interface methods, and <code>new ConcreteThing()</code> inside business logic."
    ],
    sections: [
      { h: "The five at a glance", blocks: [
        { table: { head: ["Principle", "One-line test", "Smell in code", "Usual fix"], rows: [
          ["SRP", "Can you describe the class without saying 'and'?", "<code>OrderService</code> validates <i>and</i> prices <i>and</i> saves <i>and</i> emails", "Extract classes; a thin coordinator calls them"],
          ["OCP", "Does a new variant require editing old, tested code?", "<code>if (type.equals(\"PREMIUM\")) … else if …</code>", "Interface + one class per variant (Strategy), or polymorphism"],
          ["LSP", "Can every subclass replace its parent without the caller noticing?", "Override that throws, ignores input, or breaks the parent's promise", "Re-model the hierarchy; don't inherit what you can't honour"],
          ["ISP", "Does any implementer leave methods empty or throwing?", "<code>Machine { print(); scan(); fax(); }</code> on a basic printer", "Split into role interfaces; implement only what applies"],
          ["DIP", "Can you unit-test the business class without the real DB/email/SMS?", "<code>private EmailSender s = new EmailSender();</code>", "Depend on an interface, inject it in the constructor"]
        ] } },
        { p: "The running example below is a small e-commerce / placement-portal style backend. When you do this block, redo each pair with <b>your own project</b>: find one real class that violates the principle, write the violation in 15–30 lines, then the fix. That is exactly the answer interviewers want to hear ('In my project X, the class Y was doing…')." }
      ] },
      { h: "S — Single Responsibility", blocks: [
        { p: "<b>Violation:</b> one method mixes four jobs. The pricing team, the DB schema, and the email template each force changes to the same class, and you cannot test pricing without triggering an email." },
        { code: `import java.util.*;

class OrderService {
    private final List<String> db = new ArrayList<>();

    void placeOrder(String item, int qty, long unitPrice, String email) {
        if (qty <= 0) throw new IllegalArgumentException("qty must be positive");   // 1. validation
        long total = qty * unitPrice;                                               // 2. pricing
        if (total > 1000) total = total * 90 / 100;
        db.add(item + "," + qty + "," + total);                                     // 3. persistence
        System.out.println("MAIL " + email + ": your total is " + total);           // 4. notification
    }
}

class SrpViolation {
    public static void main(String[] args) {
        new OrderService().placeOrder("Book", 3, 400, "a@x.com");   // MAIL a@x.com: your total is 1080
    }
}`, lang: "java", title: "Violation — SrpViolation.java" },
        { code: `import java.util.*;

record Order(String item, int qty, long unitPrice) { }

class OrderValidator {
    void validate(Order o) { if (o.qty() <= 0) throw new IllegalArgumentException("qty must be positive"); }
}
class PriceCalculator {                          // changes only when pricing rules change
    long total(Order o) {
        long t = o.qty() * o.unitPrice();
        return t > 1000 ? t * 90 / 100 : t;
    }
}
class OrderRepository {                          // changes only when storage changes
    private final List<String> rows = new ArrayList<>();
    void save(Order o, long total) { rows.add(o.item() + "," + o.qty() + "," + total); }
    int count() { return rows.size(); }
}
class Mailer {                                   // changes only when notification changes
    void send(String to, String body) { System.out.println("MAIL " + to + ": " + body); }
}

class OrderService {                             // only coordinates the steps
    private final OrderValidator validator = new OrderValidator();
    private final PriceCalculator pricer = new PriceCalculator();
    private final OrderRepository repo = new OrderRepository();
    private final Mailer mailer = new Mailer();

    void placeOrder(Order o, String email) {
        validator.validate(o);
        long total = pricer.total(o);
        repo.save(o, total);
        mailer.send(email, "your total is " + total);
    }
}

class SrpFix {
    public static void main(String[] args) {
        new OrderService().placeOrder(new Order("Book", 3, 400), "a@x.com");   // MAIL a@x.com: your total is 1080
        System.out.println(new PriceCalculator().total(new Order("Pen", 2, 50)));   // 100 - testable alone
    }
}`, lang: "java", title: "Fix — SrpFix.java" },
        { warn: "SRP is not 'one method per class'. It is about <b>reasons to change</b>. A <code>PriceCalculator</code> with ten pricing methods is fine; a <code>User</code> class that also formats PDFs is not." }
      ] },
      { h: "O — Open/Closed", blocks: [
        { p: "<b>Violation:</b> every new customer type means editing and re-testing this method; one wrong <code>else if</code> breaks existing customers." },
        { code: `class DiscountCalculator {
    long discount(String customerType, long amount) {
        if (customerType.equals("REGULAR")) return 0;
        else if (customerType.equals("PREMIUM")) return amount * 10 / 100;
        else if (customerType.equals("STUDENT")) return amount * 15 / 100;
        // next month: "FESTIVE" -> edit this class again
        return 0;
    }
}

class OcpViolation {
    public static void main(String[] args) {
        System.out.println(new DiscountCalculator().discount("STUDENT", 2000));   // 300
    }
}`, lang: "java", title: "Violation — OcpViolation.java" },
        { code: `interface DiscountPolicy {
    long discount(long amount);
}
class RegularDiscount implements DiscountPolicy { public long discount(long a) { return 0; } }
class PremiumDiscount implements DiscountPolicy { public long discount(long a) { return a * 10 / 100; } }
class StudentDiscount implements DiscountPolicy { public long discount(long a) { return a * 15 / 100; } }

// Added later WITHOUT touching any class above:
class FestiveDiscount implements DiscountPolicy {
    public long discount(long a) { return Math.min(a * 20 / 100, 500); }   // 20%, capped at 500
}

class Checkout {
    private final DiscountPolicy policy;
    Checkout(DiscountPolicy policy) { this.policy = policy; }
    long payable(long amount) { return amount - policy.discount(amount); }
}

class OcpFix {
    public static void main(String[] args) {
        System.out.println(new Checkout(new StudentDiscount()).payable(2000));   // 1700
        System.out.println(new Checkout(new FestiveDiscount()).payable(4000));   // 3500
    }
}`, lang: "java", title: "Fix — OcpFix.java (Strategy pattern)" },
        { tip: "Somewhere a factory or config still maps \"STUDENT\" → <code>new StudentDiscount()</code>; OCP doesn't remove that, it keeps the <b>business logic</b> closed. Say this before the interviewer asks." }
      ] },
      { h: "L — Liskov Substitution", blocks: [
        { p: "<b>Violation:</b> mathematically a square is a rectangle, but a <i>mutable</i> <code>Square</code> can't keep <code>Rectangle</code>'s promise that width and height are set independently. Code written for <code>Rectangle</code> breaks when handed a <code>Square</code>." },
        { code: `class Rectangle {
    protected int w, h;
    void setWidth(int w) { this.w = w; }
    void setHeight(int h) { this.h = h; }
    int area() { return w * h; }
}

class Square extends Rectangle {
    @Override void setWidth(int w) { this.w = w; this.h = w; }    // keeps it square...
    @Override void setHeight(int h) { this.w = h; this.h = h; }   // ...but breaks Rectangle's contract
}

class LspViolation {
    static void resize(Rectangle r) {             // written against Rectangle
        r.setWidth(5);
        r.setHeight(4);
        System.out.println("expected 20, got " + r.area());
    }
    public static void main(String[] args) {
        resize(new Rectangle());                  // expected 20, got 20
        resize(new Square());                     // expected 20, got 16  <- substitution failed
    }
}`, lang: "java", title: "Violation — LspViolation.java" },
        { code: `import java.util.*;

interface Shape { int area(); }

record Rect(int w, int h) implements Shape {       // immutable: no setters to disagree about
    public int area() { return w * h; }
    Rect withWidth(int nw) { return new Rect(nw, h); }
}
record Square(int side) implements Shape {
    public int area() { return side * side; }
}

class LspFix {
    public static void main(String[] args) {
        List<Shape> shapes = List.of(new Rect(5, 4), new Square(4));
        for (Shape s : shapes) System.out.println(s + " area=" + s.area());
        // Rect[w=5, h=4] area=20
        // Square[side=4] area=16
        System.out.println(new Rect(2, 3).withWidth(5).area());   // 15
    }
}`, lang: "java", title: "Fix — LspFix.java" },
        { ul: [
          "LSP checklist for an override: it must not demand more (stronger preconditions), deliver less (weaker postconditions), throw new kinds of exceptions, or break an invariant of the parent.",
          "Real JDK example: <code>List.of(...)</code> returns a <code>List</code> whose <code>add</code> throws <code>UnsupportedOperationException</code> — code that expects any <code>List</code> to be mutable breaks. It is a documented 'optional operation', a known compromise.",
          "In your project: a <code>ReadOnlyRepository extends Repository</code> whose <code>save()</code> throws is an LSP violation — split the interface instead (which is also ISP)."
        ] }
      ] },
      { h: "I — Interface Segregation", blocks: [
        { p: "<b>Violation:</b> a fat interface forces a basic printer to 'implement' scanning and faxing by throwing — clients discover the gap only at run time." },
        { code: `interface OfficeMachine {
    void print(String doc);
    void scan(String doc);
    void fax(String doc);
}

class BasicPrinter implements OfficeMachine {
    public void print(String doc) { System.out.println("Printing " + doc); }
    public void scan(String doc) { throw new UnsupportedOperationException("cannot scan"); }
    public void fax(String doc)  { throw new UnsupportedOperationException("cannot fax"); }
}

class IspViolation {
    public static void main(String[] args) {
        OfficeMachine m = new BasicPrinter();
        m.print("resume.pdf");                     // Printing resume.pdf
        try { m.scan("id.png"); }                  // compiles fine, fails at run time
        catch (UnsupportedOperationException e) { System.out.println("Runtime error: " + e.getMessage()); }
    }
}`, lang: "java", title: "Violation — IspViolation.java" },
        { code: `interface Printer { void print(String doc); }
interface DocScanner { void scan(String doc); }
interface Fax { void fax(String doc); }

class BasicPrinter implements Printer {
    public void print(String doc) { System.out.println("Printing " + doc); }
}

class AllInOne implements Printer, DocScanner, Fax {
    public void print(String doc) { System.out.println("AIO printing " + doc); }
    public void scan(String doc)  { System.out.println("AIO scanning " + doc); }
    public void fax(String doc)   { System.out.println("AIO faxing " + doc); }
}

class IspFix {
    static void printAll(Printer p, String... docs) { for (String d : docs) p.print(d); }   // needs only printing
    public static void main(String[] args) {
        printAll(new BasicPrinter(), "resume.pdf");    // Printing resume.pdf
        printAll(new AllInOne(), "offer.pdf");         // AIO printing offer.pdf
        DocScanner s = new AllInOne();
        s.scan("id.png");                              // AIO scanning id.png
        // DocScanner bad = new BasicPrinter();        // compile error - the mistake is caught early
    }
}`, lang: "java", title: "Fix — IspFix.java" }
      ] },
      { h: "D — Dependency Inversion", blocks: [
        { p: "<b>Violation:</b> the high-level <code>OtpService</code> creates a concrete <code>EmailSender</code>. Switching to SMS means editing it, and a unit test would actually send email." },
        { code: `class EmailSender {
    void send(String to, String msg) { System.out.println("EMAIL to " + to + ": " + msg); }
}

class OtpService {
    private final EmailSender sender = new EmailSender();    // hard-wired to one concrete class

    void sendOtp(String user) { sender.send(user, "Your OTP is 4821"); }
}

class DipViolation {
    public static void main(String[] args) {
        new OtpService().sendOtp("asha@x.com");   // EMAIL to asha@x.com: Your OTP is 4821
    }
}`, lang: "java", title: "Violation — DipViolation.java" },
        { code: `import java.util.*;

interface MessageSender {                       // the abstraction, owned by the high-level side
    void send(String to, String msg);
}
class EmailSender implements MessageSender {
    public void send(String to, String msg) { System.out.println("EMAIL to " + to + ": " + msg); }
}
class SmsSender implements MessageSender {
    public void send(String to, String msg) { System.out.println("SMS to " + to + ": " + msg); }
}
class FakeSender implements MessageSender {     // test double: records instead of sending
    final List<String> sent = new ArrayList<>();
    public void send(String to, String msg) { sent.add(to + "|" + msg); }
}

class OtpService {
    private final MessageSender sender;
    OtpService(MessageSender sender) { this.sender = sender; }   // constructor injection
    void sendOtp(String user) { sender.send(user, "Your OTP is 4821"); }
}

class DipFix {
    public static void main(String[] args) {
        new OtpService(new EmailSender()).sendOtp("asha@x.com");   // EMAIL to asha@x.com: Your OTP is 4821
        new OtpService(new SmsSender()).sendOtp("98xxxxxx10");     // SMS to 98xxxxxx10: Your OTP is 4821
        FakeSender fake = new FakeSender();
        new OtpService(fake).sendOtp("u1");
        System.out.println(fake.sent);                             // [u1|Your OTP is 4821]
    }
}`, lang: "java", title: "Fix — DipFix.java" },
        { tip: "DIP (a design principle) vs Dependency Injection (a technique) vs Spring IoC (a framework that does the injection for you). Knowing the distinction is a strong signal. In Spring Boot, constructor injection of an interface is DIP in practice." }
      ] },
      { h: "Doing this block with your own project", blocks: [
        { ol: [
          "<b>SRP:</b> open your biggest service/controller class. List every reason it would change (DB, business rule, API format, notification). More than one → extract.",
          "<b>OCP:</b> search for <code>switch</code>/<code>if-else</code> on a type or status string. Replace with an interface + one class per case, or an enum with behaviour.",
          "<b>LSP:</b> search for overrides that throw <code>UnsupportedOperationException</code> or do nothing. Ask whether the child is truly substitutable.",
          "<b>ISP:</b> look for interfaces with 5+ methods where some implementers stub methods out. Split by client need.",
          "<b>DIP:</b> search business classes for <code>new</code> of infrastructure (repositories, HTTP clients, mailers). Introduce an interface, inject it, and write one unit test with a fake.",
          "Prepare a 60-second story: 'In my project, class X did A, B and C; I split it into…; it let me add Y without touching Z and test W in isolation.'"
        ] },
        { warn: "Don't over-apply: an interface with exactly one implementation and no test double is often YAGNI. Say you apply SOLID where change is <b>likely</b> — interviewers value that judgement." }
      ] }
    ],
    practice: [
      { q: "A <code>ReportService</code> fetches data from MySQL, computes monthly totals, and renders a PDF. Which principle is violated and how do you fix it?", a: "SRP — three reasons to change (data source, business calculation, output format). Split into <code>ReportRepository</code> (fetch), <code>ReportCalculator</code> (totals), <code>PdfRenderer</code> (format) and keep <code>ReportService</code> as the coordinator. Adding Excel output then means adding an <code>ExcelRenderer</code> behind a <code>ReportRenderer</code> interface (OCP too)." },
      { q: "<code>class Bird { void fly() {} } class Penguin extends Bird { void fly() { throw new UnsupportedOperationException(); } }</code> — what's wrong, and what's a correct model?", a: "LSP violation: code that calls <code>bird.fly()</code> on any <code>Bird</code> crashes for a <code>Penguin</code>. Model the capability separately: <code>class Bird { }</code>, <code>interface Flyer { void fly(); }</code>, <code>class Sparrow extends Bird implements Flyer</code>, <code>class Penguin extends Bird</code>. (This also applies ISP.)" },
      { q: "Payment processing has <code>switch (mode) { case \"UPI\": … case \"CARD\": … case \"NETBANKING\": … }</code> repeated in three methods. Which principle and what refactoring?", a: "OCP (and a DRY smell). Create <code>interface PaymentProcessor { boolean pay(long amt); boolean refund(String txnId); }</code> with <code>UpiProcessor</code>, <code>CardProcessor</code>, <code>NetBankingProcessor</code>; a factory or a <code>Map&lt;String, PaymentProcessor&gt;</code> picks one. Adding wallets = one new class, no edits to the switches (which disappear)." },
      { q: "How does DIP make unit testing easier? Give the concrete mechanism.", a: "The class depends on an interface received through its constructor, so a test passes a fake/mock implementation (like <code>FakeSender</code>) that records calls instead of sending email or hitting a DB. The test is fast, deterministic and can assert on what was 'sent'." },
      { q: "Name which letter each smell points to: (a) an interface method implemented as an empty body in 4 of 6 classes; (b) <code>new MySqlUserRepository()</code> inside <code>UserService</code>; (c) a class named <code>UserManagerAndEmailHelper</code>.", a: "(a) ISP — the interface is too fat for those clients. (b) DIP — high-level service depends on a concrete low-level class; inject a <code>UserRepository</code> interface. (c) SRP — the name itself says two responsibilities." }
    ],
    related: ["oops:solid-principles", "oops:coupling-cohesion", "oops:composition-over-inheritance", "oops:dry-kiss-yagni", "oops:strategy-pattern", "oops:factory-pattern", "oops:abstract-class-vs-interface", "oops:interface-default-methods", "oops:decorator-pattern", "oops:observer-pattern", "se:mocking", "se:cohesion-coupling", "se:technical-debt-refactoring"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "java-internals",
    subject: "java",
    title: "Java internals: HashMap, equals/hashCode, string pool, GC, synchronized vs volatile",
    minutes: 90,
    crux: [
      "<code>HashMap</code> = array of buckets. index = <code>(n − 1) &amp; (h ^ (h &gt;&gt;&gt; 16))</code>; collisions chain in a linked list, which becomes a red-black tree when a bucket passes <b>8</b> nodes and the table has ≥ <b>64</b> slots.",
      "Default capacity 16, load factor 0.75 → resize (double) when size exceeds 12. On resize each node stays at index <i>i</i> or moves to <i>i + oldCap</i>.",
      "Contract: <code>a.equals(b)</code> ⇒ <code>a.hashCode() == b.hashCode()</code> (not the reverse). Override both or hash collections break. Never mutate a key after inserting it.",
      "String literals and compile-time constants are pooled (interned); runtime concatenation and <code>new String</code> create new objects. The pool lives in the heap since Java 7.",
      "GC frees objects <b>unreachable from GC roots</b>. A 'leak' in Java is an object that is still reachable but no longer needed: static collections, unremoved listeners, unbounded caches, <code>ThreadLocal</code> in pools.",
      "<code>volatile</code> = visibility + ordering, <b>no atomicity</b> (<code>count++</code> still races). <code>synchronized</code> = mutual exclusion + visibility. For counters use <code>AtomicInteger</code>."
    ],
    sections: [
      { h: "HashMap internals: hashing, buckets, collisions", blocks: [
        { p: "A <code>HashMap</code> holds an array <code>table</code> of buckets (length always a power of two). Each entry is a <code>Node(hash, key, value, next)</code>. To place a key:" },
        { ol: [
          "<b>hash</b> = <code>key.hashCode() ^ (key.hashCode() &gt;&gt;&gt; 16)</code> — mixes the high 16 bits into the low ones, because only the low bits pick the bucket. <code>null</code> key → hash 0 → bucket 0 (one null key allowed).",
          "<b>index</b> = <code>(n - 1) &amp; hash</code> — same as <code>hash mod n</code> for power-of-two n, but a single AND instruction.",
          "Empty bucket → store the node. Otherwise walk the chain: a node with the <b>same hash and</b> (<code>==</code> or <code>equals</code>) key gets its value replaced (<code>put</code> returns the old value); if none matches, append at the <b>tail</b> (Java 8+).",
          "If the chain grows beyond <code>TREEIFY_THRESHOLD = 8</code>, the bucket becomes a red-black tree — but only if <code>table.length ≥ 64</code> (<code>MIN_TREEIFY_CAPACITY</code>); on a smaller table it resizes instead. A tree bin shrinking to 6 or fewer converts back to a list.",
          "After inserting, <code>if (++size &gt; threshold) resize()</code>, where threshold = capacity × load factor."
        ] },
        { svg: `<svg viewBox="0 0 680 230" width="680" class="dg">
  <text class="tx-m" x="40" y="33" text-anchor="end">0</text>
  <rect class="box-a" x="50" y="20" width="50" height="26" rx="4"/>
  <text class="tx-m" x="40" y="65" text-anchor="end">1</text>
  <rect class="box-a" x="50" y="52" width="50" height="26" rx="4"/>
  <text class="tx-m" x="40" y="97" text-anchor="end">2</text>
  <rect class="box-a" x="50" y="84" width="50" height="26" rx="4"/>
  <text class="tx-m" x="40" y="129" text-anchor="end">3</text>
  <rect class="box-a" x="50" y="116" width="50" height="26" rx="4"/>
  <text class="tx" x="75" y="162" text-anchor="middle">...</text>
  <text class="tx-m" x="40" y="193" text-anchor="end">15</text>
  <rect class="box-a" x="50" y="180" width="50" height="26" rx="4"/>
  <rect class="box" x="130" y="20" width="120" height="26" rx="4"/>
  <text class="tx-c" x="190" y="33" text-anchor="middle" dominant-baseline="middle">"Aa" h=2112</text>
  <rect class="box" x="280" y="20" width="120" height="26" rx="4"/>
  <text class="tx-c" x="340" y="33" text-anchor="middle" dominant-baseline="middle">"BB" h=2112</text>
  <rect class="box" x="130" y="52" width="120" height="26" rx="4"/>
  <text class="tx-c" x="190" y="65" text-anchor="middle" dominant-baseline="middle">"a" h=97</text>
  <rect class="box" x="280" y="52" width="120" height="26" rx="4"/>
  <text class="tx-c" x="340" y="65" text-anchor="middle" dominant-baseline="middle">"q" h=113</text>
  <line class="ln" x1="100" y1="33" x2="128" y2="33" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="33" x2="278" y2="33" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="100" y1="65" x2="128" y2="65" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="250" y1="65" x2="278" y2="65" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="265" y="129" text-anchor="middle">empty buckets hold null</text>
  <rect class="box-p" x="530" y="40" width="80" height="28" rx="5"/>
  <text class="tx-c" x="570" y="54" text-anchor="middle" dominant-baseline="middle">k5</text>
  <rect class="box-p" x="470" y="110" width="80" height="28" rx="5"/>
  <text class="tx-c" x="510" y="124" text-anchor="middle" dominant-baseline="middle">k2</text>
  <rect class="box-p" x="590" y="110" width="80" height="28" rx="5"/>
  <text class="tx-c" x="630" y="124" text-anchor="middle" dominant-baseline="middle">k8</text>
  <line class="ln" x1="555" y1="68" x2="515" y2="108" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="585" y1="68" x2="625" y2="108" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="570" y="165" text-anchor="middle">tree bin: &gt; 8 nodes and table &gt;= 64</text>
  <text class="tx-m" x="570" y="183" text-anchor="middle">lookup O(log k) instead of O(k)</text>
</svg>`, caption: "Capacity-16 table: \"Aa\" and \"BB\" have identical hashCodes; \"a\" and \"q\" differ but share the low 4 bits, so both pairs collide." },
        { h: "Worked example: which bucket?" },
        { table: { head: ["Key", "hashCode()", "binary (low bits)", "index, n = 16 (&amp; 15)", "index, n = 32 (&amp; 31)"], rows: [
          ["\"a\"", "97", "0110 0001", "0001 = <b>1</b>", "0 0001 = 1 (bit 16 is 0 → stays)"],
          ["\"q\"", "113", "0111 0001", "0001 = <b>1</b> (collision)", "1 0001 = <b>17</b> (bit 16 is 1 → moves to 1 + 16)"],
          ["\"Aa\"", "65·31 + 97 = 2112", "…0100 0000", "0000 = <b>0</b>", "0"],
          ["\"BB\"", "66·31 + 66 = 2112", "…0100 0000", "<b>0</b> (same hash)", "0 — resizing never separates equal hashes"]
        ] } },
        { p: "For all four keys <code>h &gt;&gt;&gt; 16</code> is 0 (the hashCodes are below 65,536), so the spread hash equals the hashCode. <code>String.hashCode()</code> is s[0]·31^(n−1) + … + s[n−1]; for two chars that is s[0]·31 + s[1]." },
        { code: `import java.util.*;

class HashIndex {
    static int spread(int h) { return h ^ (h >>> 16); }      // same as HashMap.hash()

    public static void main(String[] args) {
        for (String k : new String[]{"a", "q", "Aa", "BB"}) {
            int h = spread(k.hashCode());
            System.out.println(k + " hash=" + k.hashCode() + " idx16=" + (h & 15) + " idx32=" + (h & 31));
        }
        // a hash=97 idx16=1 idx32=1
        // q hash=113 idx16=1 idx32=17
        // Aa hash=2112 idx16=0 idx32=0
        // BB hash=2112 idx16=0 idx32=0

        Map<String, Integer> m = new HashMap<>();
        System.out.println(m.put("Aa", 1) + " " + m.put("BB", 2) + " " + m.put("Aa", 3));  // null null 1
        System.out.println(m.get("Aa") + " " + m.get("BB") + " " + m.size());            // 3 2 2
    }
}`, lang: "java", title: "HashIndex.java" }
      ] },
      { h: "Resize, capacity math and complexity", blocks: [
        { table: { head: ["Constant / fact", "Value"], rows: [
          ["Default initial capacity", "16 (table allocated lazily on first <code>put</code>)"],
          ["Default load factor", "0.75 → threshold = 16 × 0.75 = 12"],
          ["Resize trigger", "size &gt; threshold, i.e. the <b>13th</b> insertion → capacity 32, threshold 24"],
          ["<code>new HashMap&lt;&gt;(100)</code>", "Rounded up to a power of two: capacity 128, threshold 96"],
          ["Treeify / untreeify", "Chain &gt; 8 nodes and table ≥ 64 → tree; tree ≤ 6 nodes → list"],
          ["Complexity", "get/put O(1) average; worst O(log n) with tree bins (O(n) before Java 8)"]
        ] } },
        { p: "<b>Why the split on resize is cheap:</b> doubling n adds one more bit to the mask. For each node, if <code>(hash &amp; oldCap) == 0</code> it stays at index <i>i</i>; otherwise it moves to <i>i + oldCap</i>. No hashCode is recomputed, and each old bucket splits into two lists that keep their relative order. (In the table above, \"q\" has bit 16 set, so it moves from 1 to 17.)" },
        { ul: [
          "<b>Why 0.75?</b> A trade-off: lower wastes memory, higher lengthens chains. With a good hash, chains stay very short at 0.75.",
          "<b>Why power-of-two capacity?</b> So <code>(n − 1) &amp; hash</code> replaces the slower <code>%</code>, and resize splitting works as above.",
          "<b>Not thread-safe:</b> concurrent puts can lose entries (and in Java 7, head insertion during resize could create a cycle → infinite loop). Use <code>ConcurrentHashMap</code> (CAS + per-bin locking, no null keys/values) — not <code>Hashtable</code> or <code>Collections.synchronizedMap</code>, which lock the whole map.",
          "<b>Tree bins need order:</b> nodes in a tree bin are ordered by hash, then by <code>compareTo</code> if keys are <code>Comparable</code>, then a tie-break — which is why making keys <code>Comparable</code> helps under heavy collisions."
        ] },
        { tip: "If you know the final size, pre-size to avoid repeated resizes: <code>new HashMap&lt;&gt;((int) (expected / 0.75f) + 1)</code>, or in Java 19+ <code>HashMap.newHashMap(expected)</code>." }
      ] },
      { h: "The equals / hashCode contract", blocks: [
        { ol: [
          "<b>Consistent:</b> repeated calls return the same result while the fields used don't change.",
          "<b>equals ⇒ same hash:</b> if <code>a.equals(b)</code> then <code>a.hashCode() == b.hashCode()</code>.",
          "<b>Not the reverse:</b> equal hashes do <i>not</i> imply equal objects (\"Aa\"/\"BB\") — that is just a collision.",
          "<code>equals</code> itself must be reflexive, symmetric, transitive, consistent, and <code>x.equals(null)</code> is false."
        ] },
        { p: "<b>Why it matters:</b> <code>HashMap.get</code> first jumps to the bucket by hash, then compares <code>hash == hash &amp;&amp; equals</code>. Override only <code>equals</code> and two 'equal' objects get different identity hashes → different buckets → the lookup never even calls your <code>equals</code>." },
        { code: `import java.util.*;

class BadPoint {                                   // equals without hashCode
    final int x, y;
    BadPoint(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        return o instanceof BadPoint p && p.x == x && p.y == y;
    }
}

class GoodPoint {
    final int x, y;
    GoodPoint(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        return o instanceof GoodPoint p && p.x == x && p.y == y;
    }
    @Override public int hashCode() { return Objects.hash(x, y); }   // same fields as equals
}

record RecPoint(int x, int y) { }                  // records generate both correctly

class Contract {
    public static void main(String[] args) {
        Set<BadPoint> bad = new HashSet<>(List.of(new BadPoint(1, 2)));
        Set<GoodPoint> good = new HashSet<>(List.of(new GoodPoint(1, 2)));
        Set<RecPoint> rec = new HashSet<>(List.of(new RecPoint(1, 2)));
        System.out.println(bad.contains(new BadPoint(1, 2)));    // false (different identity hashes)
        System.out.println(good.contains(new GoodPoint(1, 2)));  // true
        System.out.println(rec.contains(new RecPoint(1, 2)));    // true

        // mutable key trap
        Map<List<Integer>, String> m = new HashMap<>();
        List<Integer> key = new ArrayList<>(List.of(1, 2));
        m.put(key, "v");
        key.add(3);                                              // hashCode changes after insertion
        System.out.println(m.get(key) + " " + m.containsKey(List.of(1, 2)) + " size=" + m.size());
        // null false size=1   -> the entry is stranded
    }
}`, lang: "java", title: "Contract.java" }
      ] },
      { h: "String pool and immutability", blocks: [
        { ul: [
          "Every string <b>literal</b> and every <b>compile-time constant expression</b> (<code>\"hel\" + \"lo\"</code>, or concatenation of <code>final</code> constant variables) is interned: one shared object in the pool.",
          "Strings built at <b>runtime</b> (concatenation with a non-constant, <code>StringBuilder.toString()</code>, <code>substring</code>, input) are new heap objects, even if the text is already in the pool.",
          "<code>s.intern()</code> returns the pooled instance (adding <code>s</code> if absent). Since Java 7 the pool is in the main heap (it was in PermGen before), so pooled strings are garbage-collected like others.",
          "Immutability is what makes the pool safe, lets <code>String</code> cache its <code>hashCode</code> (ideal <code>HashMap</code> key), and makes strings thread-safe and safe for security checks."
        ] },
        { code: `class StringPool {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hel" + "lo";            // constant expression -> folded to "hello" at compile time
        String part = "hel";
        String c = part + "lo";             // part is not final -> runtime concat -> new object
        final String fpart = "hel";
        String d = fpart + "lo";            // fpart is a constant variable -> folded
        String e = new String("hello");     // always a new heap object
        System.out.println((a == b) + " " + (a == c) + " " + (a == d) + " " + (a == e));   // true false true false
        System.out.println((a == c.intern()) + " " + a.equals(c));                          // true true
    }
}`, lang: "java", title: "StringPool.java" }
      ] },
      { h: "Garbage collection and memory leaks", blocks: [
        { svg: `<svg viewBox="0 0 680 175" width="680" class="dg">
  <rect class="box" x="10" y="10" width="560" height="115" rx="8"/>
  <text class="tx tx-b" x="290" y="26" text-anchor="middle" dominant-baseline="middle">Heap</text>
  <rect class="box-g" x="20" y="38" width="305" height="78" rx="6"/>
  <text class="tx-s" x="172" y="52" text-anchor="middle" dominant-baseline="middle">Young generation (minor GC, frequent, fast)</text>
  <rect class="box" x="30" y="66" width="150" height="40" rx="5"/>
  <text class="tx" x="105" y="86" text-anchor="middle" dominant-baseline="middle">Eden (new objects)</text>
  <rect class="box" x="190" y="66" width="60" height="40" rx="5"/>
  <text class="tx" x="220" y="86" text-anchor="middle" dominant-baseline="middle">S0</text>
  <rect class="box" x="258" y="66" width="60" height="40" rx="5"/>
  <text class="tx" x="288" y="86" text-anchor="middle" dominant-baseline="middle">S1</text>
  <rect class="box-w" x="340" y="38" width="220" height="78" rx="6"/>
  <text class="tx-s" x="450" y="56" text-anchor="middle" dominant-baseline="middle">Old / tenured generation</text>
  <text class="tx-s" x="450" y="80" text-anchor="middle" dominant-baseline="middle">long-lived objects</text>
  <text class="tx-s" x="450" y="98" text-anchor="middle" dominant-baseline="middle">(major / full GC, slower)</text>
  <rect class="box-p" x="585" y="38" width="85" height="78" rx="6"/>
  <text class="tx-s" x="627" y="68" text-anchor="middle" dominant-baseline="middle">Metaspace</text>
  <text class="tx-s" x="627" y="88" text-anchor="middle" dominant-baseline="middle">class data</text>
  <text class="tx-m" x="172" y="148" text-anchor="middle">survivors copied Eden -&gt; S0 &lt;-&gt; S1, age +1 per GC</text>
  <text class="tx-m" x="450" y="148" text-anchor="middle">promoted after surviving enough GCs</text>
  <text class="tx-m" x="627" y="148" text-anchor="middle">native memory</text>
</svg>`, caption: "Generational heap (classic layout; G1 uses equal-sized regions that play these roles). Most objects die young, so collecting the young generation often is cheap." },
        { ul: [
          "<b>Reachability:</b> an object is live if a chain of references leads to it from a <b>GC root</b> — local variables on thread stacks, static fields, active threads, JNI references. Unreachable objects (even cycles) are collected.",
          "<b>Mark → sweep/compact:</b> mark everything reachable, reclaim the rest, compact to avoid fragmentation. Young GC copies survivors instead (cost ∝ live objects, not garbage).",
          "<b>Collectors:</b> G1 is the default since Java 9 (region-based, pause-time goals); Parallel for throughput; ZGC/Shenandoah for very low pauses. <code>System.gc()</code> is only a hint.",
          "<b>Stop-the-world:</b> some phases pause application threads; that's why GC tuning matters for latency-sensitive services.",
          "<code>finalize()</code> is deprecated (unpredictable, slow); use try-with-resources / <code>Cleaner</code> for non-memory resources."
        ] },
        { table: { head: ["Leak pattern", "Why it stays reachable", "Fix"], rows: [
          ["Static collection that only grows (caches, registries)", "Static fields are GC roots", "Bounded/LRU cache, eviction, or <code>WeakHashMap</code> for metadata keyed by objects"],
          ["Listeners/callbacks registered but never removed", "The publisher's list references the subscriber", "Unregister in a close/dispose method; weak listeners"],
          ["<code>ThreadLocal</code> in a thread pool", "Pool threads live forever, so do their ThreadLocal values", "<code>threadLocal.remove()</code> in <code>finally</code>"],
          ["Mutable key in HashMap (see above)", "Entry can't be found or removed", "Immutable keys"],
          ["Non-static inner class / lambda captured by long-lived object", "Implicitly holds a reference to the outer instance", "Static nested class; don't let the reference escape"],
          ["Unclosed streams, connections, <code>ResultSet</code>s", "Native resources + buffers held", "try-with-resources"]
        ] } },
        { code: `import java.util.*;

class LeakDemo {
    // LEAK: a static map is reachable for the program's lifetime; it only grows
    static final Map<Integer, byte[]> CACHE = new HashMap<>();
    static byte[] loadLeaky(int id) { return CACHE.computeIfAbsent(id, k -> new byte[1024]); }

    // FIX: bounded LRU cache - LinkedHashMap in access order evicts the eldest entry
    static final Map<Integer, byte[]> LRU = new LinkedHashMap<>(16, 0.75f, true) {
        @Override protected boolean removeEldestEntry(Map.Entry<Integer, byte[]> eldest) {
            return size() > 100;
        }
    };
    static byte[] loadBounded(int id) { return LRU.computeIfAbsent(id, k -> new byte[1024]); }

    public static void main(String[] args) {
        for (int i = 0; i < 10_000; i++) { loadLeaky(i); loadBounded(i); }
        System.out.println(CACHE.size() + " vs " + LRU.size());   // 10000 vs 100
    }
}`, lang: "java", title: "LeakDemo.java" },
        { tip: "How to find a leak (say this): heap usage that keeps climbing after full GCs, then <code>OutOfMemoryError: Java heap space</code>. Capture a heap dump (<code>-XX:+HeapDumpOnOutOfMemoryError</code> or <code>jmap</code>/<code>jcmd GC.heap_dump</code>), open it in Eclipse MAT or VisualVM, look at the dominator tree and the path to GC root of the biggest retainers." }
      ] },
      { h: "synchronized vs volatile", blocks: [
        { p: "Two separate problems in multithreaded code: <b>visibility</b> (a write by one thread may sit in a CPU cache/register and never be seen by another; the compiler/CPU may also reorder instructions) and <b>atomicity</b> (<code>count++</code> is read → add → write; two threads can interleave and lose an update). <code>volatile</code> solves only the first; <code>synchronized</code> solves both." },
        { table: { head: ["", "<code>volatile</code>", "<code>synchronized</code>"], rows: [
          ["Applies to", "Fields only", "Methods and blocks (locks an object's monitor)"],
          ["Visibility", "Yes — every read sees the latest write (happens-before)", "Yes — unlock happens-before the next lock of the same monitor"],
          ["Atomicity of compound actions", "<b>No</b> (<code>x++</code>, check-then-act still race)", "Yes — only one thread in the critical section"],
          ["Blocking", "Never blocks", "Other threads wait for the lock; reentrant"],
          ["Typical use", "Stop/ready flags, publishing an immutable object, the instance field in double-checked-locking Singleton", "Counters, invariants across several fields, check-then-act"],
          ["Lighter alternative", "—", "<code>AtomicInteger</code>/<code>AtomicLong</code> (lock-free CAS) for single variables"]
        ] } },
        { code: `import java.util.concurrent.atomic.AtomicInteger;

class SyncVsVolatile {
    static volatile boolean running = true;           // volatile is right for a stop flag
    static volatile int volatileCount = 0;            // volatile is WRONG for a counter
    static int syncCount = 0;
    static final AtomicInteger atomicCount = new AtomicInteger();

    static synchronized void incSync() { syncCount++; }   // lock on SyncVsVolatile.class

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 100_000; i++) {
                volatileCount++;                      // read-add-write: updates can be lost
                incSync();
                atomicCount.incrementAndGet();        // CAS loop: never loses updates
            }
        };
        Thread t1 = new Thread(task), t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("synchronized: " + syncCount);           // always 200000
        System.out.println("atomic:       " + atomicCount.get());   // always 200000
        System.out.println("volatile:     " + volatileCount);       // usually LESS than 200000

        Thread worker = new Thread(() -> {
            long spins = 0;
            while (running) spins++;                  // without volatile this loop may never see the change
            System.out.println("worker stopped");
        });
        worker.start();
        Thread.sleep(50);
        running = false;
        worker.join();                                // worker stopped
    }
}`, lang: "java", title: "SyncVsVolatile.java" },
        { warn: "Declaring the counter <code>volatile</code> is the classic wrong answer. Visibility is not atomicity. Also, <code>synchronized</code> on two <b>different</b> objects gives no mutual exclusion between them — static synchronized methods lock the <code>Class</code> object, instance ones lock <code>this</code>." }
      ] }
    ],
    practice: [
      { q: "You insert 13 distinct keys into <code>new HashMap&lt;&gt;()</code>. What are the capacity and threshold afterwards? And after 25 keys?", a: "Threshold starts at 12 (16 × 0.75). The 13th insertion makes size 13 &gt; 12 → resize to capacity 32, threshold 24. The 25th insertion makes size 25 &gt; 24 → capacity 64, threshold 48." },
      { q: "Keys with hashCodes 5, 21 and 37 go into a capacity-16 map. Which buckets? What happens to each on resize to 32?", a: "All three give index 5 (5, 21 = 16+5, 37 = 32+5 → low 4 bits 0101), so they chain in bucket 5. On resize to 32 check bit 16: 5 → 0 → stays at 5; 21 → set → moves to 5 + 16 = 21; 37 = 100101₂ → bit 16 is 0 → stays at 5." },
      { q: "A class overrides <code>hashCode</code> to always return 42 but has a correct <code>equals</code>. Is the contract broken? What is the consequence?", a: "The contract is <b>not</b> broken — equal objects do have equal hashes. But every key lands in one bucket, so operations degrade to O(n) per lookup (or O(log n) after treeification if keys are Comparable). Correct but terribly slow." },
      { q: "What does <code>String s1 = \"ab\"; String s2 = \"a\"; String s3 = s2 + \"b\"; System.out.println(s1 == s3);</code> print? How do you make it true?", a: "<code>false</code> — <code>s2</code> isn't a constant variable, so <code>s2 + \"b\"</code> is computed at runtime into a new object. It becomes true with <code>s3.intern()</code>, or by declaring <code>final String s2 = \"a\";</code> (then the expression is a compile-time constant and is folded to the pooled \"ab\")." },
      { q: "Java has a GC, so how can this leak: a <code>static List&lt;Session&gt; active</code> to which sessions are added on login?", a: "If sessions are never removed on logout/timeout, the static list (a GC root) keeps every <code>Session</code> — and everything it references — reachable forever. Heap grows until <code>OutOfMemoryError</code>. Fix: remove on logout, expire with a scheduled cleanup, or use a bounded cache." },
      { q: "Is <code>volatile</code> enough for a boolean flag set by one thread and read by another? Is it enough for <code>if (!initialized) { init(); initialized = true; }</code> run by several threads?", a: "Flag: yes — one writer, readers only need visibility. Check-then-act: no — two threads can both see <code>false</code> and both call <code>init()</code>. Needs <code>synchronized</code> (or an <code>AtomicBoolean.compareAndSet(false, true)</code>)." }
    ],
    related: ["oops:equals-hashcode", "oops:string-immutability", "oops:garbage-collection", "oops:reference-types", "oops:memory-leaks-java", "oops:stack-vs-heap", "oops:immutable-class", "oops:wrapper-autoboxing", "oops:resource-cleanup-java", "oops:final-finally-finalize", "oops:singleton-pattern", "os:race-condition", "os:critical-section", "os:monitors", "os:test-and-set-cas", "os:cache-locality"]
  });

  /* ---------------- block mappings ---------------- */
  map("d1-mo", ["java-collections"]);
  map("d1-ni", ["java-collections"]);
  map("d2-ev", ["oop-pillars"]);
  map("d3-mo", ["java-strings"]);
  map("d3-ev", ["oop-constructors-copy"]);
  map("d4-ev", ["oop-inheritance-dispatch"]);
  map("d25-ev", ["oop-solid"]);
  map("d51-af", ["java-internals"]);
  // revision blocks
  map("d41-ev", ["oop-pillars", "oop-constructors-copy", "oop-inheritance-dispatch", "oop-solid"]);
  map("d51-ev", ["oop-solid", "oop-pillars", "oop-inheritance-dispatch"]);
  map("d54-ev", ["oop-pillars", "oop-solid"]);
})();
