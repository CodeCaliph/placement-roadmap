# THE 60-DAY CAMPUS PLACEMENT HANDBOOK
### Full-Time Preparation Program for Top Product Companies (India)
**Target roles:** SDE / SWE / Software Engineer — Google, Microsoft, Amazon, Adobe, Atlassian, Uber, Goldman Sachs, JP Morgan, Morgan Stanley, Oracle, Cisco, Walmart Global Tech, Qualcomm, Samsung R&D, Nvidia, Apple, Flipkart, PhonePe, Razorpay, Meesho, Sprinklr, ServiceNow, Intuit, Visa, Amex, PayPal.
**Language:** Java · **Duration:** 60 days · **Load:** 10 hrs/day (≈600 hours total)

---

> **How to read this handbook**
> Part 1 tells you *what* exists. Part 2 tells you *what matters*. Part 3 tells you *what to do each day*. Parts 4–10 are the machinery that keeps you honest.
> If you only have time for one thing: **Part 2 (Tier list) + Part 3 (60-day plan)**. Everything else is support.

---

## TABLE OF CONTENTS

| Part | Section | Pages |
|---|---|---|
| — | Ground Rules & Time Budget | Start here |
| **1** | Complete Interview Syllabus | |
| 1.1 | DSA — Master table (35 topics, priority order) | |
| 1.2 | DSA — Topic deep dives (patterns · problems · mistakes) | |
| 1.3 | Operating Systems | |
| 1.4 | DBMS | |
| 1.5 | Computer Networks | |
| 1.6 | OOP (Java) | |
| 1.7 | Low Level Design (LLD) | |
| 1.8 | High Level Design (HLD) | |
| 1.9 | **Java / Collections Framework for interviews** | |
| 1.10 | SQL | |
| 1.11 | Aptitude & Puzzles | |
| 1.12 | Resume, GitHub, LinkedIn, Portfolio | |
| 1.13 | Projects | |
| 1.14 | HR + Behavioural | |
| 1.15 | Online Assessment (OA) strategy | |
| 1.16 | Company-wise preparation matrix (26 companies) | |
| **2** | Priority Order — Tier 1 to Tier 4 | |
| **3** | The 60-Day Day-by-Day Plan | |
| **4** | Weekly Revision Protocol | |
| **5** | Resources (with reasons) | |
| **6** | Categorized Interview Question Lists | |
| **7** | Mock Interview Schedule | |
| **8** | Final Placement Checklist | |
| **9** | 100 Mistakes and How to Avoid Each | |
| **10** | Progress Tracking + Weekly Readiness Score | |

---

## GROUND RULES (read once, follow for 60 days)

1. **One language, one IDE, no switching.** Java 17 (or whatever your judge supports). Learn to type your I/O template in 20 seconds. Never "explore" a new language mid-prep.
2. **Pattern > problem count.** 500 problems solved by pattern beats 1500 solved randomly. If you cannot name the pattern of a problem you just solved, you have not solved it.
3. **The 25-minute rule.** Stuck for 25 minutes with zero progress → read the editorial → close it → re-solve from a blank file → add to Redo List. Staring for 2 hours is not grit, it is waste.
4. **Redo List is sacred.** Every problem you could not solve unaided goes into a spreadsheet. Re-solve on Day+3, Day+10, Day+30. This single habit is worth ~40% of your final ability.
5. **Speak while you solve.** From Day 15, solve 1 problem per day out loud on camera. Interviews are a *communication* test wearing a DSA costume.
6. **No tutorial hell.** Max 25% of your time watching. 75% typing, writing, speaking.
7. **Sleep 7 hours.** Non-negotiable. Memory consolidation is literally the mechanism you are relying on.
8. **Daily time budget:** Morning 4h (deep DSA) · Afternoon 3h (DSA practice/contest) · Evening 2h (CS theory / SQL / design / project) · Night 1h (revision, notes, aptitude, mistake log).

---

# PART 1 — COMPLETE INTERVIEW SYLLABUS

## 1.1 DSA — Master Table (priority order)

Frequency = % of technical interviews at Indian campus drives where the topic appears (my estimate from ~500 reported loops). Q = number of problems to solve for placement-readiness.

| # | Topic | Importance | Frequency | Difficulty | Q to solve | Verdict |
|---|---|---|---|---|---|---|
| 1 | Arrays | **HIGH** | 90% | Easy–Med | 60 | Tier 1 |
| 2 | Strings | **HIGH** | 60% | Easy–Med | 35 | Tier 1 |
| 3 | Hashing (map/set) | **HIGH** | 85% | Easy | 25 | Tier 1 |
| 4 | Two Pointers | **HIGH** | 55% | Easy–Med | 30 | Tier 1 |
| 5 | Sliding Window | **HIGH** | 45% | Med | 25 | Tier 1 |
| 6 | Prefix Sum / Difference Array | **HIGH** | 40% | Easy–Med | 20 | Tier 1 |
| 7 | Binary Search (incl. on answer) | **HIGH** | 60% | Med | 35 | Tier 1 |
| 8 | Sorting + custom comparators | **HIGH** | 50% | Easy | 15 | Tier 1 |
| 9 | Recursion & Backtracking | **HIGH** | 45% | Med | 35 | Tier 1 |
| 10 | Linked List | **HIGH** | 50% | Easy–Med | 30 | Tier 1 |
| 11 | Stack (+ Monotonic Stack) | **HIGH** | 45% | Med | 30 | Tier 1 |
| 12 | Queue / Deque (+ Monotonic Deque) | MED | 25% | Med | 15 | Tier 2 |
| 13 | Heap / Priority Queue | **HIGH** | 40% | Med | 25 | Tier 1 |
| 14 | Greedy | **HIGH** | 40% | Med | 30 | Tier 1 |
| 15 | Binary Trees | **HIGH** | 70% | Med | 45 | Tier 1 |
| 16 | BST | **HIGH** | 45% | Med | 20 | Tier 1 |
| 17 | Graphs — BFS/DFS | **HIGH** | 65% | Med | 40 | Tier 1 |
| 18 | Topological Sort | **HIGH** | 30% | Med | 12 | Tier 1 |
| 19 | Union-Find (DSU) | **HIGH** | 30% | Med | 15 | Tier 1 |
| 20 | Shortest Path (Dijkstra/Bellman/Floyd) | **HIGH** | 30% | Med–Hard | 15 | Tier 1 |
| 21 | MST (Kruskal/Prim) | MED | 15% | Med | 8 | Tier 2 |
| 22 | Dynamic Programming | **HIGH** | 70% | Med–Hard | 70 | Tier 1 |
| 23 | Bit Manipulation | MED | 35% | Easy–Med | 20 | Tier 2 |
| 24 | Math / Number Theory | MED | 35% | Easy–Med | 25 | Tier 2 |
| 25 | Trie | MED | 20% | Med | 12 | Tier 2 |
| 26 | Intervals / Sweep Line | MED | 25% | Med | 15 | Tier 2 |
| 27 | Matrix / 2D Grid | MED | 30% | Easy–Med | 20 | Tier 2 |
| 28 | Segment Tree / Fenwick (BIT) | LOW–MED | 8% | Hard | 10 | Tier 3 |
| 29 | Advanced Graphs (SCC, bridges, articulation, bipartite, 0-1 BFS) | LOW–MED | 10% | Hard | 12 | Tier 3 |
| 30 | Strings-Advanced (KMP, Z, Rabin-Karp, Manacher) | LOW | 6% | Hard | 8 | Tier 3 |
| 31 | Randomized / Reservoir / Design questions (LRU, LFU, Rate Limiter) | MED | 25% | Med | 12 | Tier 2 |
| 32 | Game Theory / Nim / Grundy | LOW | 2% | Hard | 3 | Tier 4 |
| 33 | Sqrt decomposition, Mo's algorithm, Persistent DS | LOW | <1% | Hard | 0 | **Tier 4 — SKIP** |
| 34 | Suffix Array / Suffix Automaton | LOW | <1% | Hard | 0 | **Tier 4 — SKIP** |
| 35 | Heavy-Light Decomposition, Link-Cut Trees | LOW | ~0% | Hard | 0 | **Tier 4 — SKIP** |

**Total target: ~750 quality problems in 60 days ≈ 12–13/day.** Do not chase 1000+. Chase 750 with a Redo List.

> **Explicit low-ROI warning:** Topics 33–35 and most of competitive-programming-only material (heavy number theory, FFT, matrix exponentiation beyond basics, computational geometry) appear in <1% of campus interviews. If you are spending time there instead of on DP and Graphs, you are optimising the wrong thing. The *only* exception: if you are targeting Google/Codeforces-style OAs and already have Tier 1+2 at 90%, then add 0-1 BFS, bitmask DP, and matrix exponentiation.

---

## 1.2 DSA — Topic Deep Dives

Format for each topic: **Patterns to master → Signature problems → Mistakes students make.**

### 1. Arrays — HIGH · 90% · 60 Q
**Patterns:** traversal + in-place modification · Kadane (max subarray) · Dutch National Flag · cyclic sort / index-as-hash · rotation (reversal trick) · merge intervals · prefix/suffix product · majority element (Boyer-Moore) · next permutation · rain-water trapping.
**Signature problems:** Two Sum, Best Time to Buy & Sell Stock I/II/III, Maximum Subarray, Sort Colors, Set Matrix Zeroes, Rotate Array, Product of Array Except Self, Find Duplicate Number, Missing Number, Next Permutation, Merge Intervals, Trapping Rain Water, Majority Element I/II, Maximum Product Subarray, 3Sum, 4Sum, Container With Most Water, Subarray Sum Equals K.
**Mistakes:** integer overflow (`int` × `int` silently wraps in Java — write `(long) a * b`, because `a * b` is computed in `int` *before* any cast); off-by-one in `l/r` bounds; modifying while iterating; not asking "is the array sorted? can it have duplicates? negatives? empty?"; forgetting O(1)-space constraint means index-as-hash or sign-marking.

### 2. Strings — HIGH · 60% · 35 Q
**Patterns:** frequency array (26/128) · two pointers on chars · palindrome expand-around-center · anagram grouping via sorted key or count key · string parsing/tokenising · rolling hash (basic) · run-length encoding · string builder / in-place compaction.
**Signature:** Valid Anagram, Group Anagrams, Longest Palindromic Substring, Longest Common Prefix, Valid Palindrome I/II, String to Integer (atoi), Roman↔Integer, Compare Version Numbers, Multiply Strings, Add Binary, Count and Say, Reverse Words in a String, Isomorphic Strings, Repeated Substring Pattern, Minimum Window Substring, Longest Substring Without Repeating Characters.
**Mistakes:** building a string with `+=` inside a loop (`String` is immutable, so this is O(n²) — use `StringBuilder.append`); comparing strings with `==` instead of `.equals()`; forgetting Unicode/case assumptions unasked; `s.substring()` inside a loop creating hidden O(n²); assuming only lowercase letters without confirming.

### 3. Hashing — HIGH · 85% · 25 Q
**Patterns:** count map · seen-set · prefix-sum + map (subarray sum k) · map of char→index · grouping key design · custom hash for `pair`/`vector` · two-pass vs one-pass hashing.
**Signature:** Two Sum, Subarray Sum Equals K, Longest Consecutive Sequence, Contains Duplicate II/III, Top K Frequent Elements, Ransom Note, First Unique Character, LRU Cache, Insert Delete GetRandom O(1), 4Sum II.
**Mistakes:** assuming `HashMap` is always O(1) without saying "average case; O(log n) worst after treeify"; iterating a `HashMap` and expecting sorted or insertion order (use `TreeMap` / `LinkedHashMap`); `map.get(k)` returning `null` and NPE-ing on unboxing — use `getOrDefault`; using `==` instead of `.equals()` on `Integer` keys above 127; forgetting to override `hashCode`/`equals` when using a custom class as a key.

### 4. Two Pointers — HIGH · 55% · 30 Q
**Patterns:** opposite ends (sorted) · fast/slow (cycle) · same-direction (read/write index) · partitioning · merging two sorted arrays · k-sum reduction to 2-sum.
**Signature:** 3Sum, 3Sum Closest, 4Sum, Container With Most Water, Trapping Rain Water, Remove Duplicates from Sorted Array I/II, Move Zeroes, Sort Colors, Merge Sorted Array, Linked List Cycle II, Squares of a Sorted Array, Valid Palindrome II, Boats to Save People.
**Mistakes:** forgetting to skip duplicates in 3Sum/4Sum; not sorting first when the pattern requires it; moving both pointers when only one should move; using two pointers on an unsorted array where it is invalid.

### 5. Sliding Window — HIGH · 45% · 25 Q
**Patterns:** fixed-size window · variable window (grow right, shrink left) · window with char-count map · "at most K" trick (`exactly K = atMost(K) − atMost(K−1)`) · window + monotonic deque for max/min.
**Signature:** Longest Substring Without Repeating Characters, Minimum Window Substring, Longest Repeating Character Replacement, Permutation in String, Find All Anagrams, Max Consecutive Ones III, Fruit Into Baskets, Sliding Window Maximum, Subarrays with K Different Integers, Minimum Size Subarray Sum.
**Mistakes:** shrinking with `if` instead of `while` (or vice versa); updating the answer at the wrong moment (before vs after shrink); using sliding window when the array has negatives and the constraint is a sum (window monotonicity breaks — use prefix+map instead); not resetting counts correctly.

### 6. Prefix Sum / Difference Array — HIGH · 40% · 20 Q
**Patterns:** 1-D prefix · 2-D prefix (submatrix sum) · prefix + hashmap (count subarrays with sum k / divisible by k) · prefix XOR · difference array for range updates · prefix of booleans (count in range).
**Signature:** Range Sum Query Immutable / 2D Immutable, Subarray Sum Equals K, Subarray Sums Divisible by K, Continuous Subarray Sum, Product of Array Except Self, Corporate Flight Bookings, Car Pooling, Number of Submatrices That Sum to Target, Count Number of Nice Subarrays.
**Mistakes:** forgetting `mp[0] = 1` seeding; negative modulo in Java (`((x % k) + k) % k` — `%` keeps the sign of the dividend); confusing prefix[i] as "sum up to i" vs "up to i−1" and being inconsistent; overflow in 2-D prefix.

### 7. Binary Search — HIGH · 60% · 35 Q
**Patterns:** classic on sorted array · lower_bound/upper_bound semantics · first/last occurrence · rotated array · search in 2-D matrix · **binary search on the answer** (min-max / max-min feasibility) · binary search on real numbers · peak finding · median of two sorted arrays (partition method).
**Signature:** Binary Search, Search in Rotated Sorted Array I/II, Find Minimum in Rotated Sorted Array, Find First and Last Position, Search a 2D Matrix I/II, Find Peak Element, Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum, Aggressive Cows, Allocate Books, Median of Two Sorted Arrays, Kth Smallest in Sorted Matrix, Minimum Days to Make Bouquets, Square Root / Nth Root.
**Mistakes:** `mid = (l+r)/2` overflow — use `l + (r-l)/2`; infinite loop from wrong `l = mid` vs `l = mid+1`; not being able to state the invariant ("everything left of `l` is bad"); failing to recognise "minimise the maximum" as BS-on-answer; predicate not monotonic.

### 8. Sorting — HIGH · 50% · 15 Q
**Know cold:** merge sort (and it powers inversion count), quick sort + partition (and Quickselect for Kth largest), heap sort, counting/radix sort, stability (`Arrays.sort` on primitives is dual-pivot quicksort and **not** stable; on objects it is TimSort and **is** stable), custom comparators, sorting objects, sorting by multiple keys with `Comparator.comparing().thenComparing()`.
**Signature:** Merge Sort, Quickselect / Kth Largest Element, Count Inversions, Sort Colors, Largest Number, Meeting Rooms I/II, Custom Sort String, H-Index, Relative Sort Array, Wiggle Sort.
**Mistakes:** an inconsistent comparator → `IllegalArgumentException: Comparison method violates its general contract!` thrown by TimSort; writing `(a, b) -> a - b` and overflowing on large values (use `Integer.compare(a, b)`); not knowing `Arrays.sort(int[])` is O(n²) in the worst case on an adversarial test (shuffle first, or box to `Integer[]` for guaranteed O(n log n)); forgetting stability matters in "sort by X keeping original order of Y".

### 9. Recursion & Backtracking — HIGH · 45% · 35 Q
**Patterns:** subsets (pick/not-pick) · permutations (swap vs used-array) · combinations with/without repetition · N-Queens style constraint boards · grid path with visited · palindrome partitioning · word search · sudoku · generating parentheses · recursion-tree → memo conversion.
**Signature:** Subsets I/II, Permutations I/II, Combination Sum I/II/III, Palindrome Partitioning, N-Queens, Sudoku Solver, Word Search, Generate Parentheses, Letter Combinations of a Phone Number, Rat in a Maze, Restore IP Addresses, Word Break II, Expression Add Operators.
**Mistakes:** forgetting to undo state on backtrack (the single most common bug); duplicate subsets because input wasn't sorted / skip-duplicate condition missing; **adding `path` itself to the result instead of `new ArrayList<>(path)`** — you store a reference to a list you keep mutating, so every answer ends up identical or empty; no base case or unreachable base case; not pruning (TLE).

### 10. Linked List — HIGH · 50% · 30 Q
**Patterns:** dummy head · fast/slow pointers · reverse (iterative + recursive) · reverse in k-groups · merge two/K sorted lists · detect + remove cycle (Floyd) · find middle · palindrome check · remove Nth from end · flatten multilevel · copy list with random pointer · LRU via list+map.
**Signature:** Reverse Linked List I/II, Merge Two Sorted Lists, Merge K Sorted Lists, Linked List Cycle I/II, Remove Nth Node From End, Reorder List, Palindrome Linked List, Add Two Numbers, Copy List with Random Pointer, Rotate List, Odd Even Linked List, Sort List (merge sort on list), Flatten a Multilevel List, LRU Cache.
**Mistakes:** losing the head reference; `NullPointerException` on `fast.next.next` (check `fast != null && fast.next != null`); not using a dummy node and then writing 15 lines of edge-case handling; when asked about memory, forgetting that unlinking a node is enough for GC only if nothing else still references it — set the removed node's `next` to `null`; drawing nothing on paper before coding (draw it — always).

### 11. Stack & Monotonic Stack — HIGH · 45% · 30 Q
**Patterns:** balanced parentheses · expression evaluation (infix/postfix/prefix) · min-stack (aux stack or encoded value) · stack via queues · **monotonic increasing/decreasing** for Next Greater/Smaller · histogram / max rectangle · stock span · asteroid collision · remove-k-digits (greedy + stack) · iterative tree traversals.
**Signature:** Valid Parentheses, Min Stack, Next Greater Element I/II, Daily Temperatures, Largest Rectangle in Histogram, Maximal Rectangle, Trapping Rain Water (stack version), Evaluate Reverse Polish Notation, Basic Calculator I/II, Asteroid Collision, Remove K Digits, Decode String, Sum of Subarray Minimums, Car Fleet.
**Mistakes:** not popping equal elements consistently (`>=` vs `>`) — decides whether you get left/right boundaries right; forgetting the sentinel (append 0 / use `n` as boundary); popping an empty stack; using recursion where the interviewer explicitly said iterative.

### 12. Queue / Deque / Monotonic Queue — MED · 25% · 15 Q
**Patterns:** BFS queue · circular queue implementation · queue via stacks · **monotonic deque** for sliding-window max/min · multi-source BFS · deque for 0-1 BFS.
**Signature:** Implement Queue using Stacks, Design Circular Queue, Sliding Window Maximum, Shortest Subarray with Sum at Least K, First Negative in Every Window, Rotting Oranges, Number of Recent Calls, Design Hit Counter.
**Mistakes:** storing values instead of indices in the deque (then you cannot expire the window); forgetting to pop the front when it leaves the window; reaching for `Queue`/`LinkedList` when you need both ends — use `ArrayDeque`.

### 13. Heap / Priority Queue — HIGH · 40% · 25 Q
**Patterns:** top-K (min-heap of size k) · K-way merge · two heaps (median) · heap + hashmap (task scheduler) · lazy deletion · custom comparator structs · heapify O(n) · Dijkstra's engine.
**Signature:** Kth Largest Element, Top K Frequent Elements, K Closest Points to Origin, Merge K Sorted Lists, Find Median from Data Stream, Task Scheduler, Reorganize String, Sliding Window Median, Minimum Cost to Connect Sticks/Ropes, IPO, Meeting Rooms II, Ugly Number II.
**Mistakes:** forgetting Java's `PriorityQueue` is a **min-heap by default** — for a max-heap use `Collections.reverseOrder()` or `(a,b) -> Integer.compare(b,a)`; writing `(a,b) -> b - a` and overflowing on large values; using `pq.remove(obj)` (O(n)) inside a loop instead of lazy deletion; using a max-heap of size n for top-K instead of a min-heap of size k; forgetting `PriorityQueue` iteration order is **not** sorted.

### 14. Greedy — HIGH · 40% · 30 Q
**Patterns:** sort-then-scan · activity selection / interval scheduling · exchange argument · fractional knapsack · Huffman · jump game reachability · gas station · minimum platforms · job sequencing with deadlines · candy distribution (two-pass) · partition labels.
**Signature:** Jump Game I/II, Gas Station, Candy, Non-overlapping Intervals, Minimum Number of Arrows, Partition Labels, Task Scheduler, Meeting Rooms II, Minimum Platforms, Job Sequencing, Fractional Knapsack, Huffman Encoding, Assign Cookies, Boats to Save People, Two City Scheduling.
**Mistakes:** assuming greedy works without proving/arguing it (interviewers *will* ask "why is greedy correct here?" — have an exchange argument ready); choosing the wrong sort key (start vs end time); applying greedy to 0/1 knapsack (it fails — that's DP).

### 15. Binary Trees — HIGH · 70% · 45 Q
**Patterns:** all traversals recursive + **iterative** + Morris · level order & variants (zigzag, right view, level averages) · height/diameter/balanced · LCA · path sum family · root-to-leaf paths · serialize/deserialize · construct from traversals · vertical/top/bottom view · flatten to list · nodes at distance K · burning tree · children-sum, mirror, symmetry, subtree check.
**Signature:** Inorder/Preorder/Postorder (iterative), Level Order, Zigzag Level Order, Maximum Depth, Diameter of Binary Tree, Balanced Binary Tree, Same Tree, Symmetric Tree, Invert Binary Tree, Path Sum I/II/III, Binary Tree Maximum Path Sum, LCA of Binary Tree, Serialize and Deserialize, Construct from Preorder+Inorder, Right Side View, Vertical Order Traversal, Flatten to Linked List, All Nodes Distance K, Count Complete Tree Nodes, Morris Inorder.
**Mistakes:** not handling `null` root; returning height when the question wants edges (off-by-one in diameter); global-variable answer pattern used sloppily; forgetting that "return value to parent" and "answer" are often *different* quantities (max path sum — classic); recursion depth on skewed trees.

### 16. BST — HIGH · 45% · 20 Q
**Patterns:** BST property (inorder = sorted) · search/insert/delete · validate BST with (min,max) bounds · Kth smallest (inorder / augmented count) · floor & ceil · LCA in BST (O(h)) · inorder predecessor/successor · construct BST from sorted array/preorder · two-sum in BST (BST iterator) · recover swapped nodes · largest BST in a binary tree.
**Signature:** Validate BST, Search/Insert/Delete in BST, Kth Smallest Element in BST, LCA of BST, Convert Sorted Array to BST, BST Iterator, Two Sum IV, Recover BST, Inorder Successor, Range Sum of BST, Largest BST Subtree, Construct BST from Preorder.
**Mistakes:** validating with only parent comparison instead of range bounds (the #1 BST bug); ignoring duplicates policy; forgetting delete's 3 cases; using O(n) traversal when O(h) is available.

### 17. Graphs — BFS / DFS — HIGH · 65% · 40 Q
**Patterns:** adjacency list building from edge list · BFS shortest path in unweighted graph · multi-source BFS · DFS + visited · cycle detection (directed via colors/recursion stack, undirected via parent) · connected components · flood fill / islands · grid-as-graph with 4/8 directions · bipartite check (2-colour) · clone graph · BFS on states (word ladder, knight moves, lock).
**Signature:** Number of Islands, Rotting Oranges, Flood Fill, Clone Graph, Course Schedule I/II, Word Ladder, Number of Provinces, Surrounded Regions, Pacific Atlantic Water Flow, Is Graph Bipartite, Detect Cycle in Directed/Undirected Graph, 01 Matrix, Walls and Gates, Shortest Bridge, Open the Lock, Snakes and Ladders, Number of Enclaves.
**Mistakes:** marking visited when *popping* instead of when *pushing* in BFS → exponential blow-up; not handling disconnected components (loop over all nodes); using DFS recursion on a 10⁵-node graph and stack-overflowing; confusing directed and undirected cycle detection; forgetting 0-indexed vs 1-indexed nodes.

### 18. Topological Sort — HIGH · 30% · 12 Q
**Patterns:** Kahn's BFS (indegree) · DFS + reverse postorder · cycle detection via topo (if count < V) · lexicographically smallest topo (priority queue) · DP on DAG (longest path) · course-schedule family · alien dictionary.
**Signature:** Course Schedule I/II, Alien Dictionary, Minimum Height Trees, Parallel Courses, Sequence Reconstruction, Sort Items by Groups, Longest Path in DAG, Find Eventual Safe States.
**Mistakes:** forgetting that topo order exists only for DAGs; not detecting a cycle and returning a partial order; building the edge direction backwards (prereq→course vs course→prereq).

### 19. Union-Find (DSU) — HIGH · 30% · 15 Q
**Patterns:** union by rank/size + path compression · count components · cycle detection in undirected · Kruskal MST · DSU with offset/weights · DSU on grid (2-D → 1-D index) · "number of islands II" incremental · redundant connection · accounts merge · DSU with rollback (rare).
**Signature:** Number of Provinces, Redundant Connection I/II, Accounts Merge, Number of Islands II, Most Stones Removed, Satisfiability of Equality Equations, Smallest String With Swaps, Evaluate Division (weighted DSU), Kruskal's MST, Largest Component Size by Common Factor.
**Mistakes:** writing `find` without path compression (TLE); forgetting to compare *roots* not nodes before union; not counting components correctly after unions; off-by-one in parent array sizing.

### 20. Shortest Path — HIGH · 30% · 15 Q
**Know:** BFS (unweighted), 0-1 BFS (deque), Dijkstra (PQ, no negative edges — know *why*), Bellman-Ford (negative edges, negative cycle detection, V−1 relaxations), Floyd-Warshall (all-pairs, O(V³)), Dijkstra variants (with states/constraints, k-stops).
**Signature:** Network Delay Time, Cheapest Flights Within K Stops, Path With Minimum Effort, Swim in Rising Water, Path with Maximum Probability, Minimum Cost to Reach Destination in Time, Shortest Path in Binary Matrix, Number of Ways to Arrive at Destination, Find the City With the Smallest Number of Neighbors, Minimum Obstacle Removal (0-1 BFS).
**Mistakes:** running Dijkstra with negative weights; not using lazy deletion / stale-node skip (`if (d > dist[u]) continue;`); wrong PQ comparator; forgetting Bellman-Ford needs *k+1* relaxation rounds for the k-stops variant and must use a snapshot array.

### 21. MST — MED · 15% · 8 Q
**Know:** Kruskal (sort edges + DSU), Prim (PQ), cut property, when MST is unique, Second-best MST (rare).
**Signature:** Min Cost to Connect All Points, Connecting Cities With Minimum Cost, Optimize Water Distribution (virtual node trick), Critical and Pseudo-Critical Edges.
**Mistakes:** forgetting the virtual-node trick for "build well or pipe" problems; using Prim on a dense adjacency list inefficiently.

### 22. Dynamic Programming — HIGH · 70% · 70 Q · **the single highest-leverage topic**
**The 12 DP families you must own:**
| Family | Core problems |
|---|---|
| 1-D linear | Climbing Stairs, House Robber I/II, Min Cost Climbing Stairs, Decode Ways |
| Knapsack 0/1 | Subset Sum, Equal Partition, Target Sum, Count Subsets with Sum, Min Subset Diff |
| Unbounded knapsack | Coin Change I/II, Rod Cutting, Integer Break, Combination Sum IV |
| LIS family | LIS (n² and n log n), Russian Doll Envelopes, Longest Divisible Subset, Max Chain, Number of LIS |
| LCS family | LCS, LPS, Edit Distance, Distinct Subsequences, Shortest Common Supersequence, Wildcard/Regex Matching |
| Grid DP | Unique Paths I/II, Min Path Sum, Triangle, Cherry Pickup I/II, Falling Path Sum, Dungeon Game |
| Partition / MCM | Matrix Chain Multiplication, Burst Balloons, Palindrome Partitioning II, Boolean Parenthesization, Min Cost Cut Stick |
| Stocks | Buy & Sell Stock I, II, III, IV, with cooldown, with fee (all 6 — one template) |
| DP on trees | Diameter, House Robber III, Max Path Sum, Binary Tree Cameras, Distribute Coins |
| DP on subsets (bitmask) | TSP, Assign Cookies/Tasks, Partition to K Equal Subsets, Shortest Path Visiting All Nodes |
| Digit DP | Count numbers with property ≤ N (Google/Adobe occasionally) |
| DP + state machine | Stocks, Regex, Interleaving String, Word Break |
**Method:** always (a) recursion, (b) memo, (c) tabulation, (d) space optimisation. Say all four in the interview even if you code only two.
**Mistakes:** jumping to tabulation without the recurrence; wrong base cases; wrong iteration order in tabulation; not identifying the *state* (the biggest failure — state = "what do I need to know to decide the rest?"); memo array not reset / wrong sentinel (`-1` fails when the answer can be −1); space-optimising before it works; overflow.

### 23. Bit Manipulation — MED · 35% · 20 Q
**Patterns:** `x & (x-1)` clears lowest set bit · `x & -x` isolates it · XOR properties (a^a=0) · counting set bits (Brian Kernighan, or `Integer.bitCount`/`Long.bitCount`) · subset enumeration `for (int s = m; s; s = (s-1) & m)` · bitmask as state · single number family · power-of-two check · swapping without temp · bit DP.
**Signature:** Single Number I/II/III, Number of 1 Bits, Counting Bits, Reverse Bits, Missing Number, Power of Two/Four, Sum of Two Integers without +, Subsets via bitmask, Maximum XOR of Two Numbers (Trie), Divide Two Integers, Bitwise AND of Range, Minimum Flips.
**Mistakes:** shifting an `int` by ≥32 — Java masks the shift count mod 32, so `x << 32` gives back `x`, not 0; using `>>` where you need the unsigned `>>>` on negatives; forgetting `1L << k` for k ≥ 31; precedence bugs (`a & 1 == 0` parses wrong — parenthesise!).

### 24. Math / Number Theory — MED · 35% · 25 Q
**Cover:** GCD/LCM (Euclid), Sieve of Eratosthenes + smallest prime factor, prime factorisation, modular arithmetic (`mod` add/mul/pow), modular inverse (Fermat), fast exponentiation, combinatorics nCr with mod, factorials, catalan (brief), base conversion, integer overflow handling, floor/ceil division tricks, random/probability basics, matrix exponentiation (only if time permits).
**Signature:** Count Primes, Power(x,n), Sqrt(x), Happy Number, Excel Sheet Column Number/Title, Ugly Number, Factorial Trailing Zeroes, GCD of Strings, Fraction to Recurring Decimal, Permutation Sequence, Reverse Integer, Palindrome Number, Add Digits, Multiply Strings.
**Mistakes:** `Math.pow` on integers (it returns a `double` — floating error; write your own fast power on `long`); negative modulo (`%` keeps the *dividend's* sign in Java, so use `((x % m) + m) % m`); overflow in `a * b % m` (cast to `long`; past that use `BigInteger` or `Math.multiplyHigh`); off-by-one in the sieve.

### 25. Trie — MED · 20% · 12 Q
**Patterns:** insert/search/startsWith · Trie node with 26 children vs map · word dictionary with `.` wildcard (DFS in trie) · autocomplete top-K · **binary trie for max XOR** · replace words / longest word · word search II (trie + backtracking on grid) · prefix counting.
**Signature:** Implement Trie, Design Add and Search Words, Word Search II, Maximum XOR of Two Numbers in an Array, Replace Words, Longest Word in Dictionary, Search Suggestions System, Map Sum Pairs, Count Distinct Substrings.
**Mistakes:** memory blow-up (26 children × 10⁵ words) without discussing it; forgetting the `isEnd` flag; when asked about memory, not knowing the trade-off between `TrieNode[26]` children (fast, wasteful) and a `HashMap<Character, TrieNode>` (compact, slower) — and that dropping the root reference is all it takes for GC to reclaim the whole tree; not realising Word Search II is trie + backtracking (pure backtracking TLEs).

### 26. Intervals / Sweep Line — MED · 25% · 15 Q
**Patterns:** sort by start (merge) · sort by end (max non-overlapping) · min-heap of end times (rooms) · event points +1/−1 sorted sweep · difference array on time · interval insertion.
**Signature:** Merge Intervals, Insert Interval, Non-overlapping Intervals, Meeting Rooms I/II, Minimum Number of Arrows, Employee Free Time, My Calendar I/II, Car Pooling, Interval List Intersections, Maximum Population Year.
**Mistakes:** treating `[1,2]` and `[2,3]` as overlapping (or not) without asking; sorting by the wrong endpoint; forgetting to sort start-events before end-events (or after) when boundaries are inclusive.

### 27. Matrix / 2D Grid — MED · 30% · 20 Q
**Patterns:** direction arrays · spiral traversal · rotate in place (transpose + reverse) · set matrix zeroes O(1) space · search in sorted matrix (staircase) · DFS/BFS on grid · DP on grid · diagonal traversal · transpose/flip.
**Signature:** Spiral Matrix I/II, Rotate Image, Set Matrix Zeroes, Search a 2D Matrix I/II, Word Search, Game of Life, Diagonal Traverse, Number of Islands, Max Area of Island, Valid Sudoku.
**Mistakes:** bounds checking written 4 times instead of once in a helper; mutating the grid as "visited" without asking permission; row/col index swapped (write `r` and `c`, never `i` and `j`).

### 28. Segment Tree / Fenwick Tree — LOW-MED · 8% · 10 Q · Tier 3
**Cover only if Tier 1+2 done:** build/query/update segment tree, lazy propagation (basic), BIT for prefix sums, BIT for counting inversions / smaller-to-the-right.
**Signature:** Range Sum Query Mutable, Count of Smaller Numbers After Self, Count of Range Sum, Reverse Pairs, Range Minimum Query, My Calendar III.
**Mistakes:** learning these before finishing DP (bad prioritisation); 1-indexing bugs in BIT; lazy propagation without need.

### 29. Advanced Graph — LOW-MED · 10% · 12 Q · Tier 3
Bridges & articulation points (Tarjan), SCC (Kosaraju/Tarjan), 0-1 BFS, bipartite matching (basic), Euler path (rare), min-cut/max-flow (very rare — Google only).
**Signature:** Critical Connections in a Network, Strongly Connected Components, Minimum Obstacle Removal, Making a Large Island, Redundant Connection II.

### 30. Advanced Strings — LOW · 6% · 8 Q · Tier 3
KMP failure function, Z-algorithm, Rabin-Karp rolling hash, Manacher (know it exists).
**Signature:** Implement strStr(), Repeated Substring Pattern, Shortest Palindrome, Longest Happy Prefix, Repeated String Match.

### 31. Design-in-DSA — MED · 25% · 12 Q
**Signature:** LRU Cache, LFU Cache, Design Twitter, Insert Delete GetRandom O(1) (+ duplicates), Design HashMap/HashSet, Design Underground System, Time Based Key-Value Store, Design Browser History, Snapshot Array, Design Hit Counter, Rate Limiter, Design Tic-Tac-Toe.
**Mistakes:** not stating the required complexity per operation *before* coding; answering LRU with only the `LinkedHashMap(accessOrder=true) + removeEldestEntry` trick — interviewers want the manual `HashMap` + doubly-linked-list version, so know both and lead with the manual one; forgetting to unlink the node from the list when evicting (memory leak).

---
## 1.3 Operating Systems — Tier 2 (Tier 1 for Samsung, Qualcomm, Nvidia, Cisco, Oracle, Microsoft)

Expected depth for campus: **conceptual clarity + one concrete example each + ability to write a producer-consumer.** You will not be asked to write a scheduler.

| Sub-topic | Priority | Frequency | What exactly to know | Classic questions |
|---|---|---|---|---|
| Process vs Thread | ★★★ | Very high | Address space, PCB, TCB, context switch cost, shared vs private (code/data/heap shared; stack/registers/PC private) | "Difference between process and thread?" "What is shared between threads?" |
| Process states & PCB | ★★★ | High | New/Ready/Running/Waiting/Terminated, what a PCB stores | "What happens on a context switch?" |
| Multithreading, concurrency vs parallelism | ★★★ | High | Race condition, critical section, atomicity | "Concurrency vs parallelism with an example" |
| CPU Scheduling | ★★★ | Very high | FCFS, SJF, SRTF, Priority, Round Robin, Multilevel Queue, MLFQ. **Compute AWT/ATAT/response time on paper.** Convoy effect, starvation, aging | "Compute average waiting time for this table" (very common in OA MCQs) |
| Synchronization | ★★★ | Very high | Mutex vs semaphore vs binary semaphore, spinlock, monitor, condition variable, Peterson's solution, TSL/atomic instructions | "Producer-Consumer", "Reader-Writer", "Dining Philosophers" — be able to code producer-consumer |
| Deadlock | ★★★ | Very high | 4 Coffman conditions, prevention vs avoidance vs detection vs recovery, Banker's algorithm (run it by hand), RAG, livelock, starvation | "How do you prevent deadlock?" "Solve Banker's for this matrix" |
| Memory management | ★★★ | High | Contiguous allocation, internal vs external fragmentation, first/best/worst fit, compaction, paging vs segmentation | "Paging vs segmentation" |
| Paging & Virtual Memory | ★★★ | Very high | Page table, multi-level page tables, TLB + hit ratio maths, EAT calculation, demand paging, page fault handling steps, thrashing, working set, Belady's anomaly | "What happens on a page fault, step by step?" "Compute EAT" |
| Page replacement | ★★★ | High | FIFO, LRU, Optimal, Clock/Second-chance; simulate on a reference string | "Simulate LRU for this string" (OA favourite) |
| File Systems | ★★ | Medium | Inode, FAT, contiguous/linked/indexed allocation, directory structures, journaling, hard vs soft link | "Hard link vs soft link" |
| Disk scheduling | ★★ | Medium | FCFS, SSTF, SCAN, C-SCAN, LOOK; compute head movement | "Compute total seek time" |
| System calls & kernel | ★★ | Medium | User vs kernel mode, trap, `fork()`, `exec()`, `wait()`, `pipe()`, what `fork` returns, zombie & orphan processes | "How many processes does `fork(); fork();` create?" (extremely common) |
| IPC | ★★ | Medium | Pipes, named pipes, shared memory, message queues, sockets, signals | "Fastest IPC mechanism and why (shared memory)" |
| Thread models & pools | ★★ | Medium | 1:1, M:1, M:N, user vs kernel threads, thread pool rationale | |
| Cache & memory hierarchy | ★★ | Medium | Locality, cache line, write-through vs write-back, cache coherence (brief) | Qualcomm/Nvidia favourite |
| Boot process, DMA, interrupts | ★ | Low | Polling vs interrupt, ISR, DMA benefit | |
| Real-time / embedded OS | ★ | Low (High for Qualcomm/Samsung) | Hard vs soft real-time, priority inversion + inheritance | "What is priority inversion?" |

**Mistakes students make:** memorising definitions without one example; unable to compute AWT/EAT/page faults numerically (OAs ask numeric MCQs, not definitions); confusing semaphore with mutex (ownership!); saying "deadlock is when two processes wait" without listing all 4 conditions; not knowing `fork()` return values.

---

## 1.4 DBMS — Tier 2 (Tier 1 for Amazon, Oracle, Walmart, GS, JPMC, Morgan Stanley, PayPal, Visa)

| Sub-topic | Priority | Frequency | What to know | Classic questions |
|---|---|---|---|---|
| ER model & keys | ★★★ | High | Entity, attribute, relationship, cardinality; super/candidate/primary/alternate/composite/foreign key | "Design ER for a library" |
| Relational model & constraints | ★★★ | High | Domain, entity, referential integrity; ON DELETE CASCADE/SET NULL | |
| SQL (see §1.9) | ★★★ | Very high | Queries are asked far more than theory | |
| Joins | ★★★ | Very high | INNER, LEFT, RIGHT, FULL, CROSS, SELF, NATURAL; join output row counts; NULL behaviour in joins | "Difference between LEFT JOIN and INNER JOIN with example rows" |
| Normalization | ★★★ | Very high | 1NF, 2NF, 3NF, BCNF, 4NF; functional dependency, closure, candidate key computation, lossless & dependency-preserving decomposition; denormalisation trade-off | "Normalise this table to 3NF" "Find candidate keys given FDs" |
| Indexing | ★★★ | Very high | B-Tree vs B+ Tree (why B+ for DB), clustered vs non-clustered, dense vs sparse, covering index, composite index + leftmost-prefix rule, hash index, when an index *hurts*, index on low-cardinality column | "Why is B+ tree used?" "Will this query use the index?" |
| Transactions & ACID | ★★★ | Very high | Atomicity/Consistency/Isolation/Durability, commit/rollback/savepoint, WAL & logging, checkpoint | "Explain ACID with a bank transfer" |
| Concurrency control | ★★★ | High | Lost update, dirty read, non-repeatable read, phantom read; 2PL, strict 2PL, timestamp ordering, MVCC, optimistic vs pessimistic | "Which anomaly does REPEATABLE READ prevent?" |
| Isolation levels | ★★★ | Very high | READ UNCOMMITTED / READ COMMITTED / REPEATABLE READ / SERIALIZABLE mapped to the 4 anomalies (memorise the grid) | Grid question — near-guaranteed |
| Locks | ★★★ | High | Shared/exclusive, row vs table, intent locks, deadlock in DB + detection (wait-for graph), lock escalation | |
| Schedules & serializability | ★★ | Medium | Conflict serializable, precedence graph, recoverable/cascadeless | GATE-style, appears in OAs |
| Query processing & optimisation | ★★ | Medium | Execution plan, EXPLAIN, cost model, join order, index selection, N+1 problem | "How would you optimise this slow query?" |
| Stored procedures, triggers, views | ★★ | Medium | Materialised vs normal view, when a view is updatable | |
| CAP & distributed DB | ★★ | Medium | CAP, PACELC, eventual consistency, quorum (R+W>N) | Bridge to system design |
| Sharding & partitioning | ★★ | Medium | Horizontal vs vertical, range/hash/directory sharding, hotspot, resharding, consistent hashing | |
| Replication | ★★ | Medium | Master-slave, master-master, sync vs async, read replicas, replication lag | |
| SQL vs NoSQL | ★★★ | High | Document/KV/column/graph stores; when to pick which; schema flexibility vs joins | "When would you choose NoSQL?" |
| Storage internals | ★ | Low | Heap file, page, buffer pool, LSM tree vs B-tree | Nice differentiator |

**Mistakes:** reciting ACID without an example; unable to *compute* candidate keys from FDs; saying "index makes everything faster" (writes get slower, low-cardinality indexes are useless); confusing DELETE/TRUNCATE/DROP; not knowing `NULL != NULL`.

---

## 1.5 Computer Networks — Tier 3 (Tier 1 for Cisco, Qualcomm, Nvidia, Juniper-type; Tier 2 elsewhere)

| Sub-topic | Priority | Frequency | What to know |
|---|---|---|---|
| OSI & TCP/IP models | ★★★ | Very high | 7 vs 4/5 layers, which protocol at which layer, PDU names, encapsulation |
| **"What happens when you type a URL"** | ★★★ | Very high | The full chain: browser cache → OS cache → DNS (recursive/iterative, root→TLD→authoritative) → ARP → TCP 3-way handshake → TLS handshake → HTTP request → server → response → render. **Memorise this end-to-end. It is the single most asked networking question.** |
| TCP vs UDP | ★★★ | Very high | Header fields, reliability, ordering, flow vs congestion control, use cases; 3-way handshake, 4-way termination, TIME_WAIT, why 3 not 2 |
| Congestion & flow control | ★★★ | High | Sliding window, AIMD, slow start, congestion avoidance, fast retransmit/recovery, Nagle |
| IP addressing | ★★★ | High | IPv4 classes, CIDR, subnetting maths, private ranges, NAT, IPv6 basics |
| DNS | ★★★ | Very high | Record types (A, AAAA, CNAME, MX, NS, TXT), TTL, caching, resolver flow, DNS over UDP 53 (and TCP when >512B) |
| HTTP / HTTPS | ★★★ | Very high | Methods, idempotency, status codes (know 2xx/3xx/4xx/5xx incl. 301 vs 302, 401 vs 403), headers, HTTP/1.1 keep-alive vs HTTP/2 multiplexing vs HTTP/3 QUIC |
| TLS/SSL | ★★★ | High | Handshake steps, symmetric vs asymmetric, certificates & CA chain, why hybrid crypto, MITM prevention |
| Cookies, sessions, tokens | ★★★ | High | Cookie attributes (HttpOnly, Secure, SameSite), session vs JWT, CSRF & XSS basics, CORS |
| Application protocols | ★★ | Medium | FTP, SMTP/IMAP/POP3, SSH, DHCP (DORA), ARP, ICMP, NTP |
| Routing | ★★ | Medium | Static vs dynamic, distance vector vs link state, RIP/OSPF/BGP one-liners, routing table |
| Switching & data link | ★★ | Medium | MAC, switch vs hub vs router, VLAN, CSMA/CD, collision vs broadcast domain, Stop-and-Wait / Go-Back-N / Selective Repeat |
| Load balancers | ★★ | Medium | L4 vs L7, round robin / least connections / IP hash, health checks, sticky sessions |
| CDN | ★★ | Medium | Edge caching, origin pull vs push, cache invalidation, geo-routing |
| WebSockets & real-time | ★★ | Medium | WS vs polling vs long-polling vs SSE, upgrade handshake |
| Proxies | ★★ | Medium | Forward vs reverse proxy, API gateway |
| Network security | ★★ | Medium | Firewall, DDoS, symmetric/asymmetric keys, hashing vs encryption, VPN |
| Error/flow control maths | ★ | Low–Med | Checksum, CRC, Hamming distance, throughput & efficiency formulas (GATE-style OA MCQs) |

**Mistakes:** saying "TCP is reliable" and stopping; not knowing which layer a protocol sits in; confusing DNS with DHCP; no crisp URL-to-render answer; confusing 401 (unauthenticated) with 403 (unauthorised).

---

## 1.6 OOP (Java) — Tier 1 (near-universal; heavily asked by Adobe, Samsung, Sprinklr, ServiceNow, Oracle, Amazon)

| Sub-topic | Priority | What to know (Java) |
|---|---|---|
| 4 pillars | ★★★ | Encapsulation, Abstraction, Inheritance, Polymorphism — **each with a Java class you wrote yourself**, not a textbook line |
| Abstraction vs Encapsulation | ★★★ | The distinction that catches 70% of candidates. Abstraction = hiding *complexity* (interface/abstract class, what vs how). Encapsulation = hiding *data* (private fields + getters/setters) |
| Compile-time vs runtime polymorphism | ★★★ | Overloading (compile time, resolved by signature) vs overriding (runtime, dynamic method dispatch via the vtable-equivalent). In Java **all non-static, non-final, non-private methods are virtual by default** |
| Overriding rules | ★★★ | Same signature, covariant return types allowed, access cannot be reduced, cannot throw broader *checked* exceptions, `@Override` annotation, `final` prevents it |
| Method hiding | ★★★ | `static` methods are *hidden*, not overridden — resolved by reference type, not object type. Classic trick question |
| Inheritance | ★★★ | `extends`, single inheritance of classes only, `super()` and constructor chaining, `Object` as the root class |
| **Why no multiple inheritance of classes** | ★★★ | The diamond problem — and how Java 8 `default` methods reintroduce a limited version of it (resolved with `Interface.super.method()`). Near-guaranteed question |
| Interface vs abstract class | ★★★ | **Post-Java-8 version**: interfaces can have `default`, `static`, and `private` methods; still no instance state. Use abstract class for shared state + partial implementation, interface for a capability/contract. A class implements many interfaces, extends one class |
| Access modifiers | ★★★ | `public`, `protected`, **default/package-private**, `private` — reproduce the access table including the package dimension |
| Constructors | ★★★ | Default vs parameterised, constructor overloading, `this()` chaining, `super()` must be first, no constructor inheritance, order of initialisation (static blocks → instance blocks → constructor) |
| `static` | ★★★ | Static variables, methods, blocks, nested classes; why a static method cannot access `this`; static initialisation order |
| `final` | ★★★ | Final variable (constant), final method (no override), final class (no subclass), final reference vs immutable object |
| **`equals()` and `hashCode()`** | ★★★ | The contract, why they must be overridden together, what breaks in `HashMap`/`HashSet` if you don't, a correct implementation, and `Objects.equals`/`Objects.hash` |
| `toString()`, `Object` class methods | ★★ | `equals`, `hashCode`, `toString`, `getClass`, `clone`, `wait/notify/notifyAll` |
| **Immutability** | ★★★ | How to write an immutable class (final class, private final fields, no setters, defensive copies in constructor and getters), why `String` is immutable |
| Shallow vs deep copy, `clone()` | ★★ | `Cloneable`, why `clone()` is criticised, copy constructors as the preferred alternative |
| `Comparable` vs `Comparator` | ★★★ | Natural vs external ordering, `compareTo` vs `compare`, `Comparator.comparing().thenComparing()`, consistency with `equals` |
| Exception handling | ★★★ | Checked vs unchecked, `Exception` vs `RuntimeException` vs `Error` hierarchy, `try-catch-finally`, `try-with-resources`, custom exceptions, when `finally` doesn't run, exception in `finally` swallowing |
| Generics | ★★ | Generic classes/methods, bounded types, wildcards (**PECS**), **type erasure** and its consequences |
| **SOLID** | ★★★ | SRP, OCP, LSP, ISP, DIP — one real violation + fix for each, ideally from your own project. LSP and DIP are the ones interviewers probe |
| Other principles | ★★ | DRY, KISS, YAGNI, **Composition over Inheritance**, Law of Demeter, programming to an interface |
| Coupling & cohesion | ★★ | Loose coupling, high cohesion, with an example; how Dependency Injection reduces coupling (Spring's whole premise) |
| Association / Aggregation / Composition | ★★★ | Distinguish with UML notation and Java code (has-a with independent vs dependent lifecycle) |
| Design Patterns | ★★★ | See §1.7 LLD |
| Inner classes | ★★ | Static nested, inner (non-static), local, anonymous; when each is used; lambdas replacing anonymous classes |
| Memory & GC | ★★★ | Heap vs stack vs metaspace, object lifecycle, garbage collection (mark-and-sweep, generational), what makes an object eligible, memory leaks in Java (static collections, unclosed streams, listeners), why there are no destructors and `finalize()` is deprecated |
| **Pass by value** | ★★★ | Java is *always* pass-by-value; object references are passed by value. Be able to prove it with a swap example |
| Autoboxing, `==` vs `equals`, Integer cache | ★★★ | The `Integer` −128..127 cache, `NullPointerException` on unboxing, string pool behaviour |
| Concurrency in OOP | ★★ | `synchronized` methods/blocks, `volatile`, thread-safe singleton, immutable objects as the easiest thread safety, `ConcurrentHashMap` |
| `instanceof`, casting, RTTI | ★★ | Upcasting vs downcasting, `ClassCastException`, `instanceof` pattern matching (Java 16+) |

**Mistakes:** definitions with zero code; "abstraction is hiding data" (that's encapsulation); saying interfaces can't have method bodies (false since Java 8); overriding `equals` without `hashCode`; claiming Java has multiple inheritance because of interfaces without explaining the state distinction; saying "Java passes objects by reference"; unable to give a *real* SOLID violation from their own project; confusing method overloading with overriding under pressure.

---

## 1.7 Low Level Design (LLD) — Tier 2 for campus (Tier 1 for Adobe, Sprinklr, ServiceNow, Uber, Atlassian, Flipkart, PhonePe)

**Depth expected — campus vs experienced:**
| | Campus (0 yrs) | Experienced (2–5 yrs) |
|---|---|---|
| Asked in | ~30–40% of loops, usually 1 round at Adobe/Uber/Sprinklr/Atlassian/Flipkart; rare at Google/Amazon campus | Almost always a dedicated round |
| Depth | Class diagram + key interfaces + 1–2 patterns + core method signatures, 35–45 min | Full working code, concurrency, extensibility, testability, trade-offs |
| Bar | "Can they model a problem with classes and not write one giant class?" | "Would I merge this design into a codebase?" |

**Must-know Design Patterns (learn these 12, skip the other 11):**
| Pattern | Type | Use it in |
|---|---|---|
| Singleton | Creational | Logger, config, connection pool (+ thread-safety, why it's often an anti-pattern) |
| Factory Method | Creational | Object creation by type — Notification service, Shape factory |
| Abstract Factory | Creational | Families of products — UI toolkit |
| Builder | Creational | Objects with many optional fields — Pizza, HTTP request |
| Prototype | Creational | Cloning heavy objects |
| Strategy | Behavioural | Payment methods, sorting policies, ride pricing |
| Observer | Behavioural | Notification, pub-sub, stock ticker, YouTube subscriber |
| Decorator | Behavioural/Structural | Pizza toppings, coffee add-ons, stream wrappers |
| Adapter | Structural | Third-party integration, legacy API |
| Facade | Structural | Simplified subsystem entry point |
| Command | Behavioural | Undo/redo, remote control, job queue |
| State | Behavioural | Vending machine, elevator, order lifecycle |
*(Awareness only: Chain of Responsibility, Template Method, Iterator, Composite, Proxy, Flyweight, Mediator, Visitor, Bridge, Memento, Interpreter.)*

**UML you must be able to draw in 3 minutes:** class diagram (with association/aggregation/composition/inheritance arrows), sequence diagram for one main flow, and a basic use-case diagram. Nothing else.

**The 15 LLD problems to prepare (in this order):**
1. Parking Lot 2. Elevator / Lift System 3. Splitwise 4. Tic-Tac-Toe 5. Snake & Ladder 6. Library Management 7. BookMyShow / Movie Ticket Booking 8. ATM Machine 9. Vending Machine 10. Logging Framework 11. Rate Limiter 12. Cache (LRU) with eviction policies 13. Chess 14. Food Delivery (Zomato-lite) 15. Ride Hailing (Uber-lite / Cab Booking).

**The LLD answer framework (use every time):**
1. Clarify requirements & scope (3 min) → functional + non-functional, explicitly out-of-scope items.
2. Identify entities/nouns → core classes.
3. Identify behaviours/verbs → methods & interfaces.
4. Draw class diagram; state relationships.
5. Apply patterns *where justified* — name the pattern and the reason.
6. Walk one end-to-end flow (sequence).
7. Discuss extensibility ("if we add X tomorrow, only class Y changes — that's OCP"), concurrency, and edge cases.

**Mistakes:** jumping to code in minute 1; one God class; applying 5 patterns to show off; no interfaces (so no extensibility); ignoring concurrency in Parking Lot / Elevator; not stating assumptions.

---

## 1.8 High Level Design (HLD) — Tier 3 for most campus roles, Tier 2 for a few

**Blunt truth about campus HLD:** For freshers, full system design rounds are **rare** — mostly at Uber, Atlassian, Sprinklr, Razorpay, PhonePe, and some Walmart/Flipkart SDE-1 loops, and often as a "design discussion" rather than a scored round. Google/Microsoft/Amazon campus loops usually skip it. **Do not spend 15 days on HLD at the cost of DP and Graphs.** Budget ~25–30 hours total: enough to sound informed and to handle "how would you scale this project?" which *is* asked about your resume projects in almost every loop.

**Depth expected — campus vs experienced:**
| | Campus | Experienced |
|---|---|---|
| Expected | Vocabulary + a sane box diagram + API + DB schema + one bottleneck discussion | Capacity estimation, deep trade-offs, failure modes, consistency models, cost |
| Time | 30–40 min, forgiving | 45–60 min, adversarial |
| Fatal | Not knowing what a load balancer or cache is | Hand-waving on consistency/partitioning |

**Concepts (learn in this order):**
Client-server & the request path · Horizontal vs vertical scaling · Load balancers (L4/L7, algorithms, health checks) · Stateless services & why · Caching (client, CDN, app, DB; cache-aside vs write-through vs write-back; TTL; eviction LRU/LFU; thundering herd; cache invalidation) · Redis vs Memcached · Databases: SQL vs NoSQL selection, indexing, replication, sharding, consistent hashing, hot partitions · CAP + PACELC + eventual consistency + quorum · Message queues (Kafka vs RabbitMQ vs SQS; topics, partitions, consumer groups, offsets, at-least-once vs exactly-once, DLQ, idempotency) · Async processing & workers · Rate limiting (token bucket, leaky bucket, sliding window) · CDN · Blob/object storage (S3) · Search (inverted index, Elasticsearch basics) · Microservices vs monolith, service discovery, API gateway, circuit breaker, retries + exponential backoff + jitter · REST vs gRPC vs GraphQL, API versioning, pagination, idempotency keys · WebSockets/SSE/long polling · Observability: logs, metrics, tracing, alerting · Security: authN vs authZ, OAuth2, JWT, HTTPS · Back-of-envelope estimation (QPS, storage, bandwidth) · Single points of failure, replication & failover, leader election (ZooKeeper/Raft at awareness level) · Data pipelines/batch vs stream (awareness).

**The 12 HLD problems to prepare:**
1. **URL Shortener** (do this one perfectly — most common) 2. **Rate Limiter** 3. **Pastebin** 4. **Notification Service** (email/SMS/push, fan-out, retries) 5. **WhatsApp / Chat** (WebSockets, delivery receipts, presence) 6. **Instagram / News Feed** (fan-out on write vs read) 7. **YouTube / Netflix** (upload, transcoding, CDN) 8. **Uber / Ride Matching** (geohash/quadtree, driver location updates) 9. **Twitter Search / Typeahead** (trie + ranking) 10. **E-commerce Order & Inventory** (idempotency, payments, consistency) 11. **Dropbox / File Storage** (chunking, dedupe, sync) 12. **Web Crawler / Search Engine** (frontier, politeness, inverted index).

**The HLD answer framework:**
Requirements (functional, non-functional, scale) → Capacity estimation → API design → High-level box diagram → Data model & storage choice → Deep dive on 1–2 components the interviewer picks → Bottlenecks, failure modes, monitoring → Trade-offs summary.

---
## 1.9 Java for Interviews — Tier 1 (this is your instrument; tune it in week 1)

### The competitive/OA template you type from muscle memory
```java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int t = 1; // t = Integer.parseInt(br.readLine().trim());
        while (t-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int n = Integer.parseInt(st.nextToken());
            // ... solve, append to sb
        }
        System.out.print(sb);
    }
}
```
> **Never use `Scanner` for large input** — it is 5–10× slower than `BufferedReader` and is a classic TLE cause on 10⁵–10⁶ input lines. Never print inside a loop with `System.out.println` — accumulate into a `StringBuilder` and print once.
> In *interviews* (not OAs), drop the fast I/O and write clean, readable, well-named methods. Different context, different code.

### Collections Framework — complexity table (memorise this)
| Type | Access | Insert | Delete | Search | Ordered? | Backed by |
|---|---|---|---|---|---|---|
| `int[]` / `T[]` | O(1) | — | — | O(n) | index order | contiguous array |
| `ArrayList` | O(1) | O(1) amortised (end), O(n) middle | O(n) | O(n) | insertion order | dynamic array |
| `LinkedList` | O(n) | O(1) at ends / with iterator | O(1) with iterator | O(n) | insertion order | doubly linked list |
| `ArrayDeque` | O(1) ends | O(1) both ends | O(1) both ends | O(n) | insertion order | circular array |
| `Stack` (legacy) | O(1) top | O(1) | O(1) | O(n) | LIFO | Vector (synchronized — **prefer `ArrayDeque`**) |
| `HashMap` / `HashSet` | — | O(1) avg, O(log n) worst (treeified) | O(1) avg | O(1) avg | **no order** | hash table + red-black bins |
| `LinkedHashMap` / `LinkedHashSet` | — | O(1) avg | O(1) avg | O(1) avg | insertion (or access) order | hash table + linked list |
| `TreeMap` / `TreeSet` | — | O(log n) | O(log n) | O(log n) | sorted | Red-Black tree |
| `PriorityQueue` | O(1) peek | O(log n) | O(log n) poll | O(n) contains | heap order | binary **min-heap** |
| `String` | O(1) charAt | immutable | immutable | O(n) | — | immutable char/byte array |
| `StringBuilder` | O(1) | O(1) amortised append | O(n) middle | O(n) | — | mutable char array |

> **Critical difference from C++:** Java's `PriorityQueue` is a **min-heap by default**. For a max-heap: `new PriorityQueue<>(Collections.reverseOrder())` or `(a,b) -> b - a` (careful: use `Integer.compare(b,a)` to avoid overflow).

### The `lower_bound` / `upper_bound` gap (Java's biggest DSA inconvenience)
Java has no `lower_bound`. Three replacements — know all three:
```java
// 1. On a sorted array: returns index, or -(insertionPoint)-1 if absent
int idx = Arrays.binarySearch(arr, key);
if (idx < 0) idx = -idx - 1;              // this is lower_bound

// 2. On a TreeSet / TreeMap (this is what interviewers expect)
Integer lb = set.ceiling(x);   // first element >= x   (lower_bound)
Integer ub = set.higher(x);    // first element >  x   (upper_bound)
Integer fl = set.floor(x);     // last element <= x
map.floorKey(k); map.ceilingKey(k); map.firstKey(); map.lastKey(); map.headMap(k); map.tailMap(k);

// 3. Write your own — you should be able to do this in 60 seconds
```

### Methods you must know by name
**Arrays:** `Arrays.sort`, `Arrays.sort(arr, fromIndex, toIndex)`, `Arrays.sort(T[], Comparator)`, `Arrays.fill`, `Arrays.copyOf`, `Arrays.copyOfRange`, `Arrays.asList`, `Arrays.toString`, `Arrays.deepToString`, `Arrays.equals`, `Arrays.binarySearch`, `Arrays.stream`.
**Collections:** `Collections.sort`, `Collections.reverse`, `Collections.max/min`, `Collections.swap`, `Collections.shuffle`, `Collections.frequency`, `Collections.unmodifiableList`, `Collections.emptyList`, `Collections.nCopies`, `Collections.reverseOrder`.
**Map:** `getOrDefault`, `putIfAbsent`, `merge`, `computeIfAbsent`, `computeIfPresent`, `entrySet`, `keySet`, `values`, `containsKey`.
**List:** `add`, `add(i,x)`, `get`, `set`, `remove(int)` vs `remove(Object)`, `contains`, `indexOf`, `subList`, `sort(Comparator)`, `toArray`.
**String:** `charAt`, `substring`, `indexOf`, `split`, `toCharArray`, `chars()`, `equals` vs `==`, `equalsIgnoreCase`, `compareTo`, `trim`/`strip`, `replace`, `join`, `String.valueOf`, `format`, `matches`.
**Character:** `isDigit`, `isLetter`, `isLetterOrDigit`, `isUpperCase`, `toLowerCase`, `getNumericValue`.
**Math/bits:** `Math.max/min/abs/pow/sqrt`, `Integer.MAX_VALUE`, `Long.MAX_VALUE`, `Integer.parseInt`, `Integer.toBinaryString`, `Integer.bitCount`, `Integer.highestOneBit`, `Integer.numberOfTrailingZeros`, `Long.bitCount`.

### Smart usage that earns points
```java
map.merge(key, 1, Integer::sum);                      // frequency count in one line
map.computeIfAbsent(u, k -> new ArrayList<>()).add(v); // adjacency list building
list.sort(Comparator.comparingInt(a -> a[0])
         .thenComparing(a -> a[1], Comparator.reverseOrder()));
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
Deque<Integer> stack = new ArrayDeque<>();            // faster than Stack, use push/pop/peek
Deque<Integer> dq = new ArrayDeque<>();               // monotonic deque for sliding window
new StringBuilder(s).reverse().toString();
int[][] grid = new int[n][m];                          // default-initialised to 0
Arrays.fill(dp, -1);  for (int[] row : dp2) Arrays.fill(row, -1);
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
```

### Lambdas, functional interfaces & streams (know, but use sparingly in interviews)
- Functional interfaces: `Comparator<T>`, `Function<T,R>`, `BiFunction`, `Predicate<T>`, `Supplier<T>`, `Consumer<T>`, `Runnable`.
- Method references: `Integer::compare`, `String::length`, `System.out::println`, `ArrayList::new`.
- Streams: `stream().filter().map().collect(Collectors.toList())`, `mapToInt().sum()`, `Collectors.groupingBy`, `Collectors.counting()`, `IntStream.range(0,n)`, `Arrays.stream(arr).boxed()`.
- **Interview rule:** streams are fine for a one-liner transformation, but write the *algorithm* as an explicit loop. A stream chain hides your complexity reasoning, and interviewers want to see the loop.
- Recursion with lambdas isn't natural in Java — just write a private helper method. That's the idiomatic and expected form.

### Generics (interview level)
`List<String>`, `Map<String, List<Integer>>`, `class Box<T>`, `<T extends Comparable<T>>`, wildcards `? extends T` (producer) vs `? super T` (consumer) — the **PECS** rule. **Type erasure**: generics exist only at compile time, so you cannot do `new T[]` or `instanceof List<String>`. Know why. Do not go deeper than this.

### Java-specific things that get asked constantly
- **Java is always pass-by-value** — object *references* are passed by value. Be ready to defend this; it's a favourite trick question.
- `==` vs `.equals()` — for objects `==` compares references. `String` literals live in the **string pool**, so `"a" == "a"` is true but `new String("a") == "a"` is false.
- **Integer caching**: `Integer` values −128..127 are cached, so `Integer a=127, b=127; a==b` is `true` but at 128 it's `false`. Always use `.equals()` or unbox to `int`.
- **`equals()` and `hashCode()` contract** — override both together, or your objects break in `HashMap`/`HashSet`. Know the contract exactly.
- **String immutability** — why it exists (security, caching, thread safety, hashcode caching), and why concatenating in a loop is O(n²) → use `StringBuilder`.
- `String` vs `StringBuilder` vs `StringBuffer` (the last is synchronized).
- **Checked vs unchecked exceptions**, `try-with-resources`, `finally` semantics, custom exceptions.
- **`final`, `finally`, `finalize`** — the classic three-way question.
- **Memory model:** heap vs stack vs metaspace; young/old generation; how GC works (mark-and-sweep, generational); what makes an object eligible for GC; memory leaks in Java (static collections, unclosed resources, listener references).
- **`Comparable` vs `Comparator`** — natural ordering vs external ordering, `compareTo` vs `compare`.
- **Autoboxing/unboxing** and its performance cost; why `int[]` beats `Integer[]` in hot loops; `NullPointerException` from unboxing a `null`.
- **`Arrays.sort` internals:** dual-pivot Quicksort for primitives (O(n²) worst case — **an adversarial anti-quicksort test can TLE you; shuffle the array or box to `Integer[]`**), TimSort for objects (stable, O(n log n) guaranteed).
- `HashMap` internals: buckets, hashing, collision via linked list → **red-black tree after 8 collisions**, load factor 0.75, resizing.
- `ConcurrentModificationException` — modifying a collection while iterating; fix with `Iterator.remove()` or `removeIf`.
- **Concurrency basics:** `Thread` vs `Runnable`, `synchronized`, `volatile`, `AtomicInteger`, `ExecutorService`/thread pools, `ConcurrentHashMap`, `CountDownLatch`, deadlock and how to avoid it. (Directly reusable in your OS answers and LLD rounds.)
- Default recursion stack: roughly 10⁴–10⁵ frames. Deep recursion on a 10⁵-node graph can `StackOverflowError` → write it iteratively, or run the solver in a `new Thread(null, task, "solver", 1 << 26)`.

### Common Java interview questions
"Why is Java platform independent? What is the JVM/JRE/JDK?" · "How does `HashMap` work internally?" · "What happens if you don't override `hashCode`?" · "`HashMap` vs `TreeMap` vs `LinkedHashMap` — when do you pick which?" · "`ArrayList` vs `LinkedList` — which for random access, which for frequent insertion?" · "Is Java pass by value or reference?" · "Why are Strings immutable?" · "`String` vs `StringBuilder` vs `StringBuffer`" · "What is the string pool?" · "Explain `final`, `finally`, `finalize`" · "Checked vs unchecked exceptions" · "What is garbage collection; can you force it?" · "Why doesn't Java support multiple inheritance of classes?" · "Interface vs abstract class after Java 8 default methods" · "What is type erasure?" · "`synchronized` vs `volatile`" · "How would you implement an LRU cache in Java?" (answer: `LinkedHashMap` with `removeEldestEntry`, **and** the manual `HashMap` + doubly-linked-list version — interviewers want the second) · "Fail-fast vs fail-safe iterators" · "What is `Optional` and when should you use it?"

> **Java vs C++ for placements — the honest take:** Java is fully accepted at every company in this handbook and is *preferred* at Amazon, Walmart, Flipkart, PhonePe, Razorpay, Meesho, Oracle, Goldman Sachs, JP Morgan, Morgan Stanley, ServiceNow, Sprinklr and most Indian product companies (their backends are Java/Spring). Java's Collections API is richer and its `TreeMap` gives you ordered-map operations that are genuinely nicer than C++'s.
> The two real costs: (1) **verbosity** — you type ~25% more, so practise typing speed and templates; (2) **no `lower_bound` on arrays** and no built-in pair/tuple — use `int[]{a,b}`, `long` encoding (`a * 1_000_000L + b`), or a small `Pair` class. Neither is a reason to switch.
> **Exception:** for **Qualcomm, Nvidia, and embedded/systems roles at Samsung**, the interviews genuinely lean on C/C++ (pointers, memory, embedded internals). If those are your primary targets, you need C/C++ regardless of your DSA language. For everyone else, Java is a fine and often better choice — just don't switch languages mid-preparation.

---

## 1.10 SQL — Tier 1 for Amazon/Walmart/Oracle/GS/JPMC/Visa/Amex/PayPal/Meesho; Tier 2 elsewhere

You need ~40–50 practised queries, not theory. Interviewers give you 2 tables and ask 3 escalating questions.

**Level 1 — Basics (must be automatic):**
SELECT, DISTINCT, WHERE, AND/OR/NOT, IN, BETWEEN, LIKE, IS NULL, ORDER BY, LIMIT/OFFSET, aliases, arithmetic in SELECT, CASE WHEN, COALESCE/IFNULL/NULLIF, data types, DDL vs DML vs DCL vs TCL.

**Level 2 — Aggregation & Joins:**
COUNT/SUM/AVG/MIN/MAX, GROUP BY, HAVING vs WHERE, INNER/LEFT/RIGHT/FULL/CROSS/SELF JOIN, joining 3+ tables, UNION vs UNION ALL, INTERSECT/EXCEPT, aggregate with CASE (pivoting), `COUNT(*)` vs `COUNT(col)` and NULLs.

**Level 3 — Subqueries & CTE:**
Scalar / correlated / non-correlated subqueries, IN vs EXISTS (and performance), ANY/ALL, derived tables, `WITH` CTE, multiple CTEs, **recursive CTE** (org hierarchy, date series, number chains).

**Level 4 — Window Functions (highest-signal topic — most candidates are weak here):**
`OVER (PARTITION BY ... ORDER BY ...)`, `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, `LAG`, `LEAD`, `FIRST_VALUE`, `LAST_VALUE`, `SUM/AVG OVER` (running totals, moving averages), frame clauses `ROWS BETWEEN n PRECEDING AND CURRENT ROW`, difference between RANK and DENSE_RANK and ROW_NUMBER (guaranteed question).

**Level 5 — Optimisation & internals:**
EXPLAIN / execution plan reading, index usage & leftmost-prefix, why `SELECT *` is bad, why a function on an indexed column kills the index (`WHERE YEAR(d) = 2024`), SARGability, join order, avoiding correlated subqueries in large scans, denormalisation, partitioning, N+1 queries.

**The 20 SQL interview archetypes to be able to write blind:**
1. Nth highest salary (3 ways: LIMIT/OFFSET, DENSE_RANK, correlated subquery) 2. Nth highest salary *per department* 3. Duplicate rows: find & delete keeping one 4. Employees earning more than their manager 5. Employees with no manager / customers with no orders (LEFT JOIN + IS NULL) 6. Department-wise highest salary 7. Running total & moving average 8. Month-over-month growth % (LAG) 9. Top N per group 10. Consecutive occurrences (3 consecutive days of X) 11. Median without a MEDIAN function 12. Pivot rows to columns with CASE 13. Self-join for pairs (employees in the same city) 14. Date arithmetic: last 7 days, first/last day of month 15. Rank with ties — RANK vs DENSE_RANK behaviour 16. Cumulative distinct count 17. Gaps and islands (consecutive ranges) 18. Second most recent order per customer 19. Retention / cohort query (users active in month 1 and month 2) 20. Recursive CTE for a manager hierarchy.

**Mistakes:** using WHERE for aggregate conditions instead of HAVING; forgetting non-aggregated columns must be in GROUP BY; `NOT IN` with NULLs silently returning nothing; assuming JOIN preserves row counts; using `ROW_NUMBER` when ties must share a rank; writing 5 nested subqueries instead of one CTE + window function.

---

## 1.11 Aptitude, Logical & Puzzles — Tier 2 (Tier 1 in the OA stage for service-adjacent and finance companies)

**Do companies still ask? Yes — but selectively:**
| Company type | Aptitude in OA? |
|---|---|
| Google, Microsoft, Amazon, Adobe, Uber, Atlassian, Flipkart, PhonePe, Razorpay | ❌ Almost never — pure DSA |
| Goldman Sachs, Morgan Stanley, JP Morgan, Amex, Visa, PayPal | ✅ Yes — quant + logical + sometimes advanced maths/probability, often a scored section |
| Oracle, Cisco, Samsung, Qualcomm, Nvidia, ServiceNow, Intuit | ⚠️ Sometimes — usually aptitude + CS-MCQ + coding |
| Walmart, Sprinklr, Meesho | ⚠️ Occasional MCQ section (CS fundamentals more than aptitude) |
| TCS Digital / Infosys / Wipro / Accenture (backup) | ✅ Heavily |

**Quant (30 hrs total is plenty):** Percentages · Profit & Loss · Ratio & Proportion · Averages & Mixtures · Time-Speed-Distance · Time & Work · Simple/Compound Interest · Permutations & Combinations · **Probability (highest ROI for GS/MS/JPMC)** · Number System (divisibility, remainders, HCF/LCM) · Progressions · Mensuration · Clocks & Calendars · Data Interpretation (tables, bar, pie, line).
**Logical:** Series (number/letter) · Coding-Decoding · Blood Relations · Direction Sense · Seating Arrangement (linear & circular) · Syllogism · Statement-Assumption/Conclusion · Data Sufficiency · Cubes & Dice · Venn Diagrams · Analogies · Odd-one-out.
**Verbal:** Reading Comprehension · Para-jumbles · Sentence Correction · Fill in the blanks · Synonyms/Antonyms · Error spotting. *(Low ROI for product companies; 5 hrs total.)*
**Puzzles (asked in interviews at Amazon, Adobe, Samsung, GS, MS):** 100 doors · 8 balls & 2 weighings · Poisoned wine bottles/rats · Burning ropes · Bridge crossing with torch · 3 bulbs 3 switches · Egg dropping (also a DP problem!) · Camel & bananas · Truth-teller/liar islands · Measuring water with 3L & 5L jugs · Ants on a pole · Horse racing (25 horses, 5 tracks — **the most asked puzzle**) · Clock angle · Mislabeled jars · Prisoners & hats · Josephus problem · Coin flipping/probability puzzles.
**Method for puzzles:** think out loud, state assumptions, work small cases, look for invariants/parity/information-theoretic bounds ("3 weighings give 3³=27 outcomes"). The reasoning is graded, not the answer.

---

## 1.12 Resume, GitHub, LinkedIn, Portfolio — Tier 1 (it decides whether you get the interview at all)

### The one-page rule
One page. Always. No photo, no date of birth, no marital status, no "Declaration", no address beyond city, no fancy graphics, no two-column layout with sidebars (ATS parsers break), no tables for layout, no icons-only contact info.

### Structure (in this order)
1. **Header:** Name · Phone · Email (professional) · LinkedIn URL · GitHub URL · Portfolio (optional) · City.
2. **Education:** Degree, institute, CGPA, year. (Freshers put this second; move to bottom after 2 yrs of experience.)
3. **Technical Skills:** grouped — Languages / Frameworks & Libraries / Databases / Tools & Platforms / CS Fundamentals (DSA, OOP, OS, DBMS, CN). No skill bars, no "proficiency: 8/10".
4. **Projects (2–3):** the most important section for a fresher.
5. **Experience / Internships** (if any) — above Projects if it's a real SWE internship.
6. **Achievements:** contest ratings, hackathons, ranks, open-source, scholarships, LeetCode/Codeforces profile with a number.
7. **Positions of Responsibility** (only if it took real work).
*(Optional: Certifications — only meaningful ones. Drop "Python for Beginners — Udemy".)*

### ATS optimisation
- Single column, standard fonts (Calibri/Arial/Latin Modern), 10–11.5 pt, black text.
- Export as **PDF**, filename `Firstname_Lastname_Resume.pdf`.
- Section headers with standard names: *Education, Experience, Projects, Skills, Achievements*. ATS looks for these exact words.
- Mirror the job description's keywords **truthfully** (if the JD says "REST APIs, microservices, SQL", those words should appear in your project bullets if you actually did them).
- No headers/footers containing critical info (some parsers drop them), no text inside images/text boxes.
- Test it: paste your PDF into a plain-text editor. If the order scrambles, ATS will scramble it too.

### The bullet formula
> **Action verb + what you built + technology + measurable impact**
> ❌ "Worked on a chat application using React."
> ✅ "Built a real-time chat app (React, Node, Socket.IO, Redis) supporting 500+ concurrent users; cut message latency 60% by replacing polling with WebSockets."
Every bullet: 1–2 lines, starts with a verb (Built, Designed, Implemented, Optimised, Reduced, Automated, Migrated, Scaled), contains a number wherever honestly possible.

### GitHub
Pinned repos = your resume projects, nothing else. Every pinned repo needs: a real README (what/why/stack/screenshots/how to run/architecture diagram), meaningful commit history (not one "initial commit" with 3000 files), `.gitignore`, no committed secrets, a live demo link if deployable, and a LICENSE. **A recruiter who opens your GitHub and finds a folder of LeetCode solutions and nothing else has learned something bad about you.**

### LinkedIn
Professional photo · headline that says what you do and what you want ("Final-year CSE @ X | Java, Spring Boot, DSA | SDE Intern @ Y") · About section 4–6 lines · Experience & Projects mirroring the resume · Skills section filled (recruiters filter on it) · turn on "Open to work" (recruiters-only) · connect with recruiters and alumni with a 2-line personalised note, not a blank request.

### Portfolio (optional — worth it only if you have 3+ visual projects)
Static site, fast, links to GitHub and resume PDF, one page. Do not spend a week on this.

### What interviewers actually notice on your resume
1. Anything they can attack: a technology listed that you can't defend. **Every word on your resume is a valid interview question.**
2. Numbers — because most resumes have none.
3. Whether the project is a tutorial clone or something with a real design decision.
4. Contest rating / problems solved — as a proxy signal only.
5. Consistency between resume, GitHub, and what you say out loud.

---

## 1.13 Projects — Tier 1

**How many:** 2 strong + 1 small = 3 on the resume. **Two excellent projects beat six mediocre ones.** One should be substantial (2–4 weeks of real work), one medium, one small/utility.

**What makes a project "strong" for a product company:**
| Weak signal | Strong signal |
|---|---|
| CRUD to-do app from a tutorial | Something with a non-trivial design decision you can defend |
| No auth, no DB design | JWT/session auth, thought-out schema, indexes |
| Runs only on your laptop | Deployed with a live URL |
| "Used MERN" | "Chose Redis for the leaderboard because sorted sets give O(log n) rank queries" |
| No tests, no error handling | Basic tests, input validation, structured error responses |
| No README | Architecture diagram + setup + design decisions in README |

**Recommended stacks (pick ONE lane, don't spread):**
- **Backend-leaning (best fit for a Java/DSA candidate — pick this lane):** Java + Spring Boot + PostgreSQL/MySQL + Redis + Docker + deployed on Render/Railway/AWS free tier.
- **Full-stack:** React + Node/Express + MongoDB/Postgres + JWT + Docker.
- **Systems/concurrency flavour in Java (a real differentiator — very few freshers do this):** a multithreaded HTTP server using `ServerSocket` + a thread pool, an LRU/LFU cache library, a mini key-value store with a write-ahead log, your own thread pool on top of `BlockingQueue`, a JSON parser, an in-memory rate limiter.

**Good project ideas that interview well:**
1. **Mini URL shortener with analytics** — base62 encoding, Redis cache, rate limiting, click stats. Directly bridges to HLD.
2. **Multithreaded HTTP server / proxy in Java** — `ServerSocket`, `ExecutorService` thread pool, LRU cache, `ConcurrentHashMap`, graceful shutdown. Massive signal, and every concurrency question in the interview then has a real answer.
3. **Real-time chat app** — WebSockets, rooms, presence, message persistence, delivery receipts.
4. **E-commerce/booking backend** — auth, roles, order state machine, payment stub, idempotency, DB transactions & concurrency on inventory.
5. **Mini in-memory key-value DB** — commands, TTL, persistence via append-only log, LRU eviction.
6. **Job scheduler / task queue** — producer-consumer, retries with backoff, dead-letter queue.
7. **Log analyser / data pipeline** — file ingestion, aggregation, indexing, query API.
8. **Code-plagiarism or search tool** — inverted index + trie + ranking (shows DSA applied).

**Interview questions your project *will* attract (prepare answers for all):**
- "Walk me through the architecture." (2-minute version + whiteboard boxes)
- "Why did you choose X over Y?" (DB, framework, cache — have a real reason)
- "What was the hardest bug and how did you debug it?"
- "How does authentication work in your app, end to end?"
- "How would you scale this to 1 million users?" ← the HLD bridge
- "What happens if two users book the last seat at the same time?" (concurrency/race)
- "How is your data modelled? Show me the schema. Which indexes?"
- "What would you do differently now?"
- "Which part did *you* write?" (for team projects — be precise and honest)
- "Is it deployed? Can I see it?"

**How to explain a project (the 90-second script):**
> **Problem** (1 line) → **What I built** (1 line) → **Stack + why** (1 line) → **One interesting technical challenge and how I solved it** (3–4 lines) → **Impact/result** (1 line) → *stop and let them ask.*
Rehearse this out loud 10 times per project. Time it. Most candidates ramble for 6 minutes and lose the room.

---

## 1.14 HR + Behavioural — Tier 2 (but a Tier 1 *filter*: rarely gets you selected, frequently gets you rejected)

**The STAR method:** **S**ituation (context, 1–2 sentences) → **T**ask (your specific responsibility) → **A**ction (what *you* did — 60% of the answer, use "I" not "we") → **R**esult (outcome, ideally quantified, plus what you learned). Keep answers to 90–120 seconds.

**Build a "story bank" of 8 stories** you can remap to any question:
1. A technical challenge you solved. 2. A time you led something. 3. A conflict with a teammate. 4. A failure/mistake and what you learned. 5. A deadline crunch / prioritisation call. 6. Something you learned fast on your own. 7. A time you received hard feedback. 8. A time you helped someone else succeed.

**Questions to have rehearsed:**
*Core:* Tell me about yourself · Why this company · Why software engineering · Where do you see yourself in 5 years · Why should we hire you · What do you know about our products.
*Strengths/weaknesses:* Greatest strength (with evidence) · Greatest weakness (real, plus the concrete system you use to manage it — never "I work too hard") · How do you handle criticism.
*Behavioural (Amazon LP-style):* Tell me about a time you took ownership · disagreed with someone · failed · had to learn something quickly · dealt with an ambiguous problem · had conflicting priorities · went beyond what was asked · made a decision with incomplete data · handled a tight deadline · influenced someone without authority.
*Situational:* What if your teammate isn't contributing · What if you disagree with your manager · What if you can't meet a deadline · How do you prioritise multiple tasks.
*Closers:* Do you have questions for us? (**Always yes — 2 prepared questions.** Ask about the team's work, the tech stack, what success looks like in the first 6 months. Never ask about salary/leave in round 1.)
*Logistics honesty:* relocation, bond/service agreement, higher studies plans, other offers — answer straight; evasiveness reads as dishonesty.

**"Tell me about yourself" — the 60–90 second structure:**
Present (who you are, year, branch, focus) → Journey (what got you into software + 1 concrete proof point) → Highlight (your best project or achievement, one line of detail) → Future (why this role/company). No life story, no hometown, no family details.

**Amazon-specific:** the 16 Leadership Principles. Map at least 2 stories to each of: Customer Obsession, Ownership, Invent and Simplify, Bias for Action, Dive Deep, Deliver Results, Learn and Be Curious, Earn Trust. Amazon interviewers score explicitly against these and will dig 3 layers deep ("what data did you use?", "what would you do differently?").

**Mistakes:** using "we" throughout an ownership story; a fake weakness; badmouthing a teammate/college/company; no questions at the end; unrehearsed "tell me about yourself"; over-long answers; giving a hypothetical when asked for a real example; not knowing anything about the company.

---

## 1.15 Online Assessment (OA) Strategy — Tier 1

**Formats you will meet:**
| Format | Companies | Notes |
|---|---|---|
| 2–4 DSA problems, 60–120 min | Google, Microsoft, Amazon, Adobe, Uber, Atlassian, Flipkart, PhonePe, Razorpay | The dominant format |
| DSA + CS-fundamentals MCQs | Oracle, Cisco, Samsung, ServiceNow, Intuit, Nvidia, Qualcomm | MCQ section can eliminate you even with perfect code |
| Aptitude + Logical + DSA | Goldman Sachs, Morgan Stanley, JPMC, Amex, Visa, PayPal | Aptitude section is scored and often has a cutoff |
| Debugging / output-prediction MCQs | Amazon (workstyle+code), Adobe, Samsung | Practise reading code for bugs, not just writing it |
| Behavioural/workstyle survey | Amazon, Goldman | Be consistent, lean decisive and ownership-oriented, don't over-think |
| Take-home / project round | Some startups, Razorpay, a few product cos | Treat like production code: README, tests, clean commits |

**OA execution protocol (this is worth ~15% extra selection rate on its own):**
1. **Minute 0–3: read ALL problems.** Rank by (expected time ÷ confidence). Never start with problem 1 by default.
2. Solve the easiest with certainty first. A fully-passing easy > a half-passing hard.
3. **Write brute force first if you're stuck** — partial test cases often give partial credit, and a brute force sometimes reveals the pattern.
4. **Read constraints before designing.** n ≤ 10³ → O(n²) is fine. n ≤ 10⁵ → you need O(n log n). n ≤ 20 → bitmask/exponential is intended. n ≤ 10¹⁸ → maths/binary search/log. This single habit prevents most wrong-approach disasters.
5. Test with: the given samples, empty/single element, all-same, max size, negatives, overflow (reach for `long`!).
6. **Time-box.** If a problem is eating >35% of total time with no working solution, submit what you have and move on. Come back only with spare time.
7. Handle I/O exactly as specified; a wrong output format scores zero on a correct algorithm.
8. Keep 5 minutes at the end to re-submit and confirm everything saved.
9. Environment: stable internet, charged laptop, no tab-switching if it's proctored, webcam-ready, quiet room. A proctoring flag is an automatic reject at several companies.
10. For MCQ sections: don't leave blanks unless there's negative marking; do the CS-fundamentals MCQs *fast* and bank time for coding.

---
## 1.16 Company-Wise Preparation Matrix

**Legend:** OA difficulty and DSA level on a 1–5 scale. CS = core CS subjects. SD = system design. Resume = how much the resume itself is interrogated.

| Company | OA diff | DSA level | CS | SD | Resume | Rounds (typical campus) | Strategy in one line |
|---|---|---|---|---|---|---|---|
| **Google** | 4.5 | 5 (Med–Hard, clean code, edge cases) | Low | Low (rare for freshers) | Low | OA → 2–3 technical (45 min each) → sometimes Googliness/HC review | Graphs + DP + clean, tested, communicated code. Hard problems, few of them, judged on *how* you solve. |
| **Microsoft** | 3.5 | 4 (Med, occasionally Hard) | Medium (OS/DBMS/OOP) | Low–Med | Medium | OA (2–3 coding) → 2–3 technical → AA (as-appropriate) round | Trees, LinkedList, Strings, DP. Strong on OOP + OS. Very communication-friendly interviewers — talk. |
| **Amazon** | 3.5 | 4 (Med) | Medium (OS/DBMS/OOP) | Med (LLD for SDE-1) | High | OA (2 coding + workstyle + debugging) → 2–3 technical + **LP-heavy behavioural in every round** | 50% of your prep = Leadership Principles + STAR. DSA: arrays, trees, graphs, DP, design (LRU, Trie). |
| **Adobe** | 3.5 | 4 | High (OOP + OS + DBMS heavy) | Med (LLD common) | High | OA (coding + MCQ) → 2–3 technical → manager/HR | OOP + LLD + Java internals (collections, GC, immutability, concurrency) + puzzles. Adobe loves "design this class" and language internals. |
| **Atlassian** | 4 | 4 | Medium | **High for freshers (LLD + some HLD)** | High | OA → coding → **LLD/system round** → values/behavioural round | Their values round is genuinely scored. Prepare LLD properly + culture answers. |
| **Uber** | 4 | 4.5 | Medium | **High (LLD certain, HLD possible)** | High | OA → 2 coding → LLD/design → hiring manager | Hard DSA + real LLD. Practise Uber-lite design & concurrency. |
| **Oracle** | 3 | 3.5 | **High (DBMS + OS heavy)** | Low–Med | Medium | OA (aptitude + CS MCQ + coding) → 2–3 technical → HR | DBMS/SQL and OS carry real weight here. Don't neglect the MCQ section. |
| **Cisco** | 3 | 3 | **High (CN is king + OS)** | Low | Medium | OA (aptitude + CN/OS MCQ + coding) → technical → HR | Computer Networks is the differentiator. TCP/IP, routing, subnetting. |
| **Samsung R&D (SRI-B/Noida/Delhi)** | 3.5 | 3.5 (implementation-heavy, long simulation problems) | **High (OS/DS; C/C++ for embedded teams)** | Low | Medium | OA (often a 3-hour single hard implementation problem) → technical → HR | Java is accepted in most SRI-B OAs (check the platform's allowed languages each year). Their OA rewards patient, bug-free, long implementations (grid simulations, BFS/DFS). Practise long-form coding under time. |
| **Qualcomm** | 3 | 3 | **Very High (OS, C, embedded, computer architecture)** | Low | Medium | OA → 2–3 technical → HR | ⚠️ **C/C++ expected here**, not Java — pointers, memory, embedded, architecture. If Qualcomm is a primary target, add a C refresher; otherwise deprioritise this company. |
| **Nvidia** | 3.5 | 3.5 | **High (OS, C/C++, architecture, sometimes CUDA/parallelism)** | Low–Med | High | OA → 2–3 technical → manager | ⚠️ **C/C++ leaning.** Java is accepted for DSA rounds, but systems/domain depth is expected. Concurrency projects shine here. |
| **Goldman Sachs** | 3.5 | 3.5 | Medium–High | Low–Med | High | **CoderPad/HackerRank with aptitude+advanced maths+coding** → 2–3 technical → HR/superday | Probability & maths section is real. Plus DSA + OOP + a bit of finance curiosity. |
| **JP Morgan** | 3 | 3 | Medium | Low | High | OA (aptitude + coding + video interview) → technical → HR | Moderate DSA, strong emphasis on communication and the recorded video round. |
| **Morgan Stanley** | 3.5 | 3.5 | Medium–High (OOP, DBMS) | Med | High | OA → 2–3 technical → HR | Solid DSA + OOP + puzzles + clear thinking. Some LLD. |
| **Walmart Global Tech** | 3.5 | 4 | Medium (DBMS/SQL notable) | Med (some HLD for SDE-3, LLD for SDE-1/2) | High | OA (2 coding) → 2–3 technical → hiring manager | Balanced: DSA + SQL + design. Good STAR answers matter. |
| **Visa** | 3 | 3 | Medium–High (DBMS, security basics) | Low–Med | Medium | OA (aptitude + coding) → 2 technical → HR | Moderate DSA; payments-domain curiosity helps. |
| **American Express** | 3 | 3 | Medium (SQL/DBMS notable) | Low | Medium | OA (aptitude + coding + SQL) → technical → HR | SQL is genuinely tested. Aptitude cutoff is real. |
| **Intuit** | 3.5 | 3.5 | Medium | Med (LLD/craft demo) | High | OA → technical → **craft/design round** → behavioural | Product thinking + clean code + customer-obsession style answers. |
| **PayPal** | 3 | 3.5 | Medium–High (DBMS, OOP) | Med | Medium | OA → 2 technical → HR | Balanced; be strong on OOP and DB. |
| **ServiceNow** | 3.5 | 3.5 | High (OOP + DBMS) | Med (LLD) | Medium | OA (coding + MCQ) → 2–3 technical → HR | OOP + LLD + JS/Java-flavoured questions; DSA medium. |
| **Sprinklr** | 4 | 4 | Medium | **High (LLD + machine coding round)** | High | OA → **machine coding (60–90 min, write a working mini-system)** → technical → design → HR | The machine-coding round is the whole game. Practise writing a complete, runnable, class-structured mini app in 90 minutes. |
| **Apple** | 4 | 4.5 | High (OS/domain; language depends on team) | Med | High | OA/phone screen → 3–5 technical, team-specific | Team-dependent and deep. Domain fit + fundamentals + real mastery of whichever language that team uses. |
| **Flipkart** | 4 | 4 | Medium | **High (LLD + HLD for some)** | High | OA (2–3 coding) → 2 technical → design → hiring manager | Hard-ish DSA + genuine design round. E-commerce domain problems. |
| **PhonePe** | 4 | 4.5 | Medium | Med–High | High | OA (hard) → 2–3 technical → design → HM | Among the hardest OAs in India. Heavy DSA. Prepare Hard-level DP & graphs. |
| **Razorpay** | 4 | 4 | Medium | Med–High (LLD) | High | OA → machine coding / LLD → technical → HM | LLD + clean code + payments-domain edge cases (idempotency!). |
| **Meesho** | 3.5 | 4 | Medium (SQL notable) | Med | High | OA → 2 technical → design/HM | Solid DSA + SQL + practical design. |

**Reading the matrix:**
- If you master **Tier 1 DSA + OOP + OS/DBMS basics + one strong project**, you are eligible for ~80% of this list.
- The extra 20% splits into three buckets: **LLD/machine coding** (Sprinklr, Razorpay, Uber, Atlassian, Flipkart, Adobe), **deep CS/systems** (Qualcomm, Nvidia, Samsung, Cisco, Oracle, Apple), and **aptitude+behavioural** (GS, MS, JPMC, Amex, Visa, Amazon).
- Choose your extra bucket based on the companies actually visiting your campus. Ask seniors for last year's actual process — company patterns change yearly and campus processes differ from lateral ones.

---

# PART 2 — PRIORITY ORDER (TIER LIST)

## Tier 1 — MUST MASTER (≈70% of your 60 days)
*Rationale: these appear in the majority of OAs and every technical round. Weakness here is not recoverable by strength elsewhere.*

| Item | Why |
|---|---|
| Arrays, Strings, Hashing | Present in ~90% of interviews; the substrate everything else is built on |
| Two Pointers, Sliding Window, Prefix Sum | The three highest-frequency optimisation patterns for array/string problems |
| Binary Search (incl. on answer) | Extremely common and highly recognisable once you know the pattern |
| Sorting + comparators | Prerequisite for greedy, intervals, and half of all optimisations |
| Recursion & Backtracking | Gateway to trees, graphs, DP; asked directly too |
| Linked List | Highest question-per-topic density at Microsoft/Amazon; pointer manipulation is a core signal |
| Stack + Monotonic Stack | Monotonic stack alone unlocks ~15 famous medium/hard problems |
| Heap / Priority Queue | Top-K family + Dijkstra engine |
| Greedy | Frequent, and the "prove it" follow-up separates candidates |
| Trees + BST | ~70% frequency; the most common single interview round topic |
| Graphs: BFS/DFS, Topo Sort, DSU, Shortest Path | ~65% frequency; the #2 differentiator after DP |
| **Dynamic Programming** | Highest-difficulty, highest-frequency at the top end. The single biggest offer-vs-no-offer topic |
| Java / Collections fluency | You cannot demonstrate anything through a language you fumble |
| OOP (4 pillars + SOLID + real examples) | Asked almost everywhere, cheap to prepare, easy marks |
| Resume (1-page, ATS, honest, defensible) | Gate to *everything*. Zero interviews = zero offers |
| 2 strong, deployed, explainable projects | Every loop has resume/project questions |
| "Tell me about yourself" + 8 STAR stories | Cheap insurance against a stupid rejection |
| OA execution strategy | Purely tactical; converts existing skill into cleared rounds |

## Tier 2 — VERY IMPORTANT (≈20%)
| Item | Why |
|---|---|
| Bit Manipulation, Math/Number Theory | Common in OAs and MCQs; cheap to learn |
| Trie, Intervals, Matrix, Deque/Monotonic Queue | Medium frequency, well-defined patterns, fast to acquire |
| Design-in-DSA (LRU/LFU/Design X) | Appears in ~25% of loops and bridges to LLD |
| **Operating Systems** | Near-universal at Indian campus drives; MCQ sections and viva-style rounds |
| **DBMS + SQL** | Universal; SQL is directly tested at ~40% of these companies |
| **LLD + Design Patterns + UML** | Decisive at Adobe/Uber/Sprinklr/Razorpay/Atlassian/Flipkart |
| Aptitude + Puzzles | Gatekeeping OA sections at finance-adjacent companies |
| Behavioural depth (Amazon LPs) | Amazon rejects strong coders on LP answers routinely |
| LinkedIn + GitHub hygiene | Referrals and recruiter reach-outs come from here |

## Tier 3 — IMPORTANT (≈8%)
| Item | Why |
|---|---|
| **Computer Networks** | Universal-ish but shallow, except at Cisco/Qualcomm where it's Tier 1 |
| **HLD / System Design** | Rare as a scored fresher round, but "how would you scale your project?" is common |
| Segment Tree / Fenwick | ~8% frequency; only after Tier 1 is solid |
| Advanced Graphs (SCC, bridges, 0-1 BFS) | Occasional Google/PhonePe hard problems |
| KMP / Z / Rabin-Karp | Occasional; know the idea and one implementation |
| Verbal aptitude | Only for aptitude-gated OAs |

## Tier 4 — NICE TO HAVE (≈2%, or skip entirely)
| Item | Verdict |
|---|---|
| Mo's algorithm, sqrt decomposition, persistent DS | **Skip.** <1% frequency |
| Suffix arrays/automaton, Manacher | **Skip** (know Manacher exists) |
| Max-flow / min-cut, HLD, Link-cut trees | **Skip** unless you're a CF Candidate Master aiming at Google's hardest bar |
| FFT/NTT, advanced combinatorics, matrix expo | **Skip** for campus |
| Game theory / Grundy | Skim only |
| Certifications (Udemy/Coursera bulk) | **Low ROI.** Replace with one more real project |
| A third/fourth mediocre project | **Negative ROI.** Deepen the two you have |
| Learning a second language mid-prep | **Negative ROI.** Stay on Java (exception: a short C refresher *only* if Qualcomm/Nvidia/embedded Samsung are primary targets) |
| Building a fancy portfolio website | Low ROI unless you're targeting frontend roles |

> **Where students waste the most time (ranked):** (1) watching tutorials instead of solving, (2) advanced CP topics with no campus presence, (3) re-solving easy problems they already know because it feels good, (4) polishing a portfolio site, (5) collecting certificates, (6) starting a new "big" project in week 7, (7) endless roadmap-hunting instead of following one.

---
# PART 3 — THE 60-DAY DAY-BY-DAY PLAN

**Daily template (10 hrs):** Morning 4h (new concept + hard problems, brain freshest) · Afternoon 3h (pattern drilling / timed practice) · Evening 2h (theory: OS/DBMS/CN/OOP/SQL/design/project/resume) · Night 1h (revision of today, Redo List, notes, aptitude, mistake log).
**Every 7th day is a Consolidation Day** (revision + mock OA + mock interview + mistake analysis). Do not skip it — it is where the learning actually sticks.
**Problem counts are minimums.** "E/M/H" = Easy/Medium/Hard.

---

## PHASE 1 — FOUNDATIONS (Days 1–14)
*Goal: Java fluency, array/string/hashing mastery, the 5 core patterns, resume shipped, OS started.*

### Day 1 — Setup, Java Collections, Arrays I · 10h
- **Morning (4h):** Set up: LeetCode + GFG + Codeforces accounts, a Notion/Excel tracker with columns `Date | Problem | Topic | Pattern | Time | Solved unaided? | Redo date`. Learn/revise Collections: `ArrayList, String/StringBuilder, HashMap, LinkedHashMap, TreeMap, HashSet, TreeSet, ArrayDeque, PriorityQueue, int[]/int[][]`. Write the complexity table from §1.9 **by hand from memory** (note: `PriorityQueue` is a min-heap). Type your `BufferedReader + StringBuilder` fast-I/O template 5 times until it's muscle memory.
- **Afternoon (3h):** Arrays basics. Solve **6E + 2M**: Two Sum, Best Time to Buy and Sell Stock, Contains Duplicate, Maximum Subarray (Kadane), Move Zeroes, Remove Duplicates from Sorted Array, Rotate Array (M), Merge Sorted Array (M). Patterns: *linear scan, running-best (Kadane), read/write pointer*.
- **Evening (2h):** Resume — build v1 from the §1.12 structure. Get the skeleton done today; content improves later.
- **Night (1h):** Write a Collections cheat-sheet in your own words (incl. `getOrDefault`, `computeIfAbsent`, `merge`, `Comparator.comparingInt`, `Arrays.fill`). Log every problem in the tracker. Aptitude: 10 questions on Percentages.

### Day 2 — Arrays II + Hashing · 10h
- **Morning (4h):** Hashing patterns: count map, seen-set, prefix-sum + map, grouping keys. Learn `map.merge(k,1,Integer::sum)`, `computeIfAbsent`, `getOrDefault`, and when a custom class needs `equals`/`hashCode` to work as a key. Solve **4M**: Subarray Sum Equals K, Longest Consecutive Sequence, Group Anagrams, Top K Frequent Elements.
- **Afternoon (3h):** Solve **3E + 4M**: Majority Element, Single Number, Intersection of Two Arrays II, Product of Array Except Self (M), Set Matrix Zeroes (M), Sort Colors (M), Find the Duplicate Number (M). Patterns: *index-as-hash, Dutch National Flag, prefix/suffix product, Boyer-Moore*.
- **Evening (2h):** OOP theory: 4 pillars. Write your **own** Java class for each (not copied). Also: `==` vs `.equals()`, the Integer cache, why Strings are immutable. 
- **Night (1h):** Notes: "Hashing patterns" one-pager. Redo the 2 problems you struggled with today from a blank file. Aptitude: 10 Q on Ratio & Proportion.

### Day 3 — Strings · 10h
- **Morning (4h):** String handling in Java: immutability and why `+=` in a loop is O(n²), `StringBuilder`, `substring`, `toCharArray`, `split`, `String.join`, `char` arithmetic (`s.charAt(i) - 'a'`), `int[26]` frequency arrays, `equals` vs `==`. Solve **4E + 3M**: Valid Anagram, Valid Palindrome, Longest Common Prefix, Reverse Words in a String, Longest Palindromic Substring (M), String to Integer/atoi (M), Isomorphic Strings.
- **Afternoon (3h):** Solve **4M**: Group Anagrams (redo unaided), Palindromic Substrings, Multiply Strings, Compare Version Numbers. Pattern: *expand-around-centre, frequency-key grouping, parsing*.
- **Evening (2h):** OOP in Java: constructors & constructor overloading, `this()`/`super()` chaining, initialisation order (static block → instance block → constructor), `static` vs instance members, `final` on a variable/method/class, and shallow vs deep copy. Code a `Matrix` class with a copy constructor, a real deep copy, and `equals()`/`hashCode()`/`toString()` overridden together. Then write an **immutable** version of it: final class, private final fields, no setters, defensive copies in both the constructor and the getters.
- **Night (1h):** Update tracker. Rewrite yesterday's failures. Aptitude: 10 Q Time-Speed-Distance.

### Day 4 — Two Pointers · 10h
- **Morning (4h):** Two-pointer taxonomy: opposite ends, fast/slow, same-direction read/write, k-sum reduction. Solve **1E + 4M**: Two Sum II, 3Sum, 3Sum Closest, Container With Most Water, Sort Colors (unaided redo).
- **Afternoon (3h):** Solve **2E + 3M**: Squares of a Sorted Array, Valid Palindrome II, 4Sum (M), Remove Duplicates from Sorted Array II (M), Boats to Save People (M). **Focus: duplicate-skipping logic in 3Sum/4Sum — write it 3 times until automatic.**
- **Evening (2h):** OOP in Java: `extends` and single class inheritance, overriding rules (covariant return types, access cannot be reduced, no broader *checked* exceptions, `@Override`), overloading vs overriding vs **static method hiding**, dynamic method dispatch — in Java every non-static, non-final, non-private method is virtual by default — abstract class vs interface *after* Java 8 `default` methods, and the diamond problem resolved with `Interface.super.method()`. Code an `abstract class Shape` → `Circle`/`Rectangle` with `area()`, an `@Override toString()`, and a `Comparable<Shape>` ordering by area.
- **Night (1h):** Notes: "Two Pointer decision tree — when is it valid?" Aptitude: 10 Q Profit & Loss.

### Day 5 — Sliding Window · 10h
- **Morning (4h):** Fixed vs variable window; the `while` shrink; the "at most K" trick. Solve **4M**: Longest Substring Without Repeating Characters, Max Consecutive Ones III, Longest Repeating Character Replacement, Fruit Into Baskets.
- **Afternoon (3h):** Solve **1E + 3M + 1H**: Minimum Size Subarray Sum, Permutation in String (M), Find All Anagrams in a String (M), Subarrays with K Different Integers (H), Minimum Window Substring (H).
- **Evening (2h):** SQL Level 1: SELECT/WHERE/ORDER BY/DISTINCT/LIKE/IN/BETWEEN/NULL/CASE/aggregates/GROUP BY/HAVING. Solve 10 easy queries on LeetCode SQL or HackerRank Basic Select.
- **Night (1h):** Notes: "Sliding Window template + when it breaks (negatives)". Aptitude: 10 Q Averages.

### Day 6 — Prefix Sum, Difference Array, Matrix · 10h
- **Morning (4h):** 1-D/2-D prefix, prefix+hashmap, prefix XOR, difference array. Solve **4M**: Subarray Sum Equals K (redo), Subarray Sums Divisible by K, Continuous Subarray Sum, Range Sum Query 2D — Immutable.
- **Afternoon (3h):** Matrix patterns. Solve **2E + 3M**: Transpose Matrix, Matrix Diagonal Sum, Spiral Matrix (M), Rotate Image (M), Search a 2D Matrix II (M). Plus **Corporate Flight Bookings** (difference array).
- **Evening (2h):** Resume v2: rewrite every bullet with the Action+Tech+Impact formula. Add numbers. Cut to exactly one page.
- **Night (1h):** Notes: prefix-sum templates. Aptitude: 10 Q Number System (remainders, divisibility).

### Day 7 — ⚙️ CONSOLIDATION DAY 1 · 9h
- **Morning (3h):** **Mock OA #1** — 90 min, 3 problems (1E + 2M) from a timer-based contest (LeetCode virtual contest or a Codeforces Div3 virtual). No editorials, no Google. Then 60 min post-mortem: for each unsolved problem, write *why* (didn't know pattern / knew pattern but bugged / misread constraints / ran out of time).
- **Afternoon (3h):** Re-solve **all** Redo List items from Days 1–6 from a blank file. Anything you fail twice goes into a "Weakness" sheet.
- **Evening (2h):** Revise notes from Days 1–6 (Collections, hashing, two pointers, sliding window, prefix). Self-explain each pattern out loud in 2 minutes, on camera.
- **Night (1h):** **Week 1 Readiness Score** (see Part 10). Plan any adjustments. Rest early.

### Day 8 — Binary Search I · 10h
- **Morning (4h):** BS invariants, `lower_bound`/`upper_bound` semantics, first/last occurrence, rotated arrays. Solve **2E + 4M**: Binary Search, Search Insert Position, Find First and Last Position (M), Search in Rotated Sorted Array (M), Search in Rotated Sorted Array II (M), Find Minimum in Rotated Sorted Array (M).
- **Afternoon (3h):** Solve **3M**: Find Peak Element, Search a 2D Matrix, Single Element in a Sorted Array. **Write the BS template 5 times from memory** with the invariant comment.
- **Evening (2h):** OS: process vs thread, process states, PCB, context switch, `fork()/exec()/wait()`, zombie & orphan. Solve 10 `fork()` output-prediction questions.
- **Night (1h):** Notes: "Binary Search — the 4 templates". Aptitude: 10 Q Time & Work.

### Day 9 — Binary Search on Answer · 10h
- **Morning (4h):** The BS-on-answer meta-pattern: define `feasible(x)`, prove monotonicity, binary search the answer space. Solve **4M**: Koko Eating Bananas, Capacity to Ship Packages Within D Days, Minimum Days to Make m Bouquets, Find the Smallest Divisor Given a Threshold.
- **Afternoon (3h):** Solve **3M + 1H**: Aggressive Cows, Allocate Minimum Pages / Split Array Largest Sum, Kth Smallest Element in a Sorted Matrix, **Median of Two Sorted Arrays (H)** — do the partition method properly.
- **Evening (2h):** OS: CPU scheduling — FCFS, SJF, SRTF, Priority, Round Robin. **Compute AWT/ATAT by hand for 5 tables.** Convoy effect, starvation, aging.
- **Night (1h):** Notes: "How to spot BS-on-answer: 'minimise the maximum', 'maximum minimum', 'smallest k such that…'". Aptitude: 10 Q Permutation & Combination.

### Day 10 — Sorting + Custom Comparators · 10h
- **Morning (4h):** Implement from scratch: merge sort, quick sort + partition, Quickselect, counting sort. Know introsort/stability. Solve **3M**: Kth Largest Element in an Array (heap + Quickselect), Sort an Array, Count Inversions.
- **Afternoon (3h):** Comparators & sorting-based problems. Solve **2E + 4M**: Merge Intervals (M), Insert Interval (M), Meeting Rooms II (M), Largest Number (M), Relative Sort Array, H-Index. Practise strict-weak-ordering comparators.
- **Evening (2h):** SQL Level 2: all JOIN types with row-count reasoning, 3-table joins, UNION vs UNION ALL, aggregates with CASE. Solve 10 join queries.
- **Night (1h):** Notes: comparator pitfalls. Aptitude: 10 Q Probability.

### Day 11 — Recursion Foundations · 10h
- **Morning (4h):** Recursion mental model: base case, recursive case, recursion tree, stack frames, tail recursion, "return value vs global answer". Solve **6E/M** classics by hand: factorial, power(x,n) fast exponentiation, Fibonacci with memo, reverse a string/array recursively, subset sum (yes/no), print all subsequences.
- **Afternoon (3h):** Solve **1E + 4M**: Subsets, Subsets II, Combination Sum, Combination Sum II, Letter Combinations of a Phone Number. Pattern: *pick / not-pick*.
- **Evening (2h):** OS: synchronization — race condition, critical section, mutex vs semaphore, Peterson's, monitors. **Code producer-consumer with a semaphore (pseudocode is fine).**
- **Night (1h):** Draw recursion trees for 2 of today's problems on paper. Aptitude: 10 Q Simple/Compound Interest.

### Day 12 — Backtracking · 10h
- **Morning (4h):** Backtracking template: choose → explore → un-choose. Pruning. Solve **4M**: Permutations, Permutations II, Palindrome Partitioning, Generate Parentheses.
- **Afternoon (3h):** Solve **3M + 2H**: Word Search (M), Combination Sum III (M), Restore IP Addresses (M), N-Queens (H), Sudoku Solver (H).
- **Evening (2h):** OS: deadlock — 4 Coffman conditions, prevention/avoidance/detection, **run Banker's algorithm by hand twice**, RAG.
- **Night (1h):** Notes: "Backtracking template + the un-choose bug". Aptitude: 10 Q Seating Arrangement.

### Day 13 — Linked List I · 10h
- **Morning (4h):** Build a singly & doubly linked list from scratch in Java (`class Node { int val; Node next; }` — insert/delete/traverse/reverse iterative + recursive). Dummy-node technique, fast/slow pointers. Solve **4E + 2M**: Reverse Linked List, Middle of the Linked List, Merge Two Sorted Lists, Remove Duplicates from Sorted List, Linked List Cycle (E), Linked List Cycle II (M), Remove Nth Node From End (M).
- **Afternoon (3h):** Solve **4M**: Reorder List, Palindrome Linked List, Add Two Numbers, Odd Even Linked List. **Draw every one on paper before coding.**
- **Evening (2h):** SQL Level 3: subqueries, correlated subqueries, IN vs EXISTS, CTEs. Solve 8 queries. Then: Nth highest salary — write it 3 different ways.
- **Night (1h):** Notes: LinkedList technique list. Aptitude: 10 Q Blood Relations + Direction Sense.

### Day 14 — ⚙️ CONSOLIDATION DAY 2 · 9h
- **Morning (3h):** **Mock OA #2** — 90 min, 3 problems (2M + 1H), timed. Post-mortem for 60 min. Compare error categories with Day 7 — is the same failure repeating?
- **Afternoon (3h):** Redo List sweep for Days 8–13 + re-solve 3 items from Week 1's Redo List (spaced repetition kicks in).
- **Evening (2h):** **Mock Interview #1 (self-mock, recorded):** Pick 2 medium problems. Solve on camera, speaking continuously: clarify → examples → brute force → optimise → complexity → code → dry run → edge cases. Watch the recording. Note: filler words, silent gaps >20s, did you dry-run?
- **Night (1h):** Resume v3 review against the §1.12 checklist. Compute Week 2 Readiness Score.

---

## PHASE 2 — CORE DATA STRUCTURES (Days 15–28)
*Goal: Stacks, heaps, greedy, trees, BST — the highest-frequency interview terrain. DBMS + SQL solid. Project 1 built.*

### Day 15 — Linked List II + Stack Basics · 10h
- **Morning (4h):** Solve **1E + 3M + 1H**: Intersection of Two Linked Lists (E), Copy List with Random Pointer (M), Rotate List (M), Sort List (M — merge sort on list), Reverse Nodes in k-Group (H).
- **Afternoon (3h):** Stack: implementation, applications. Solve **2E + 3M**: Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation (M), Implement Queue using Stacks, Decode String (M), Remove All Adjacent Duplicates.
- **Evening (2h):** DBMS: ER model, keys (all types), relational constraints, DDL/DML/DCL/TCL, DELETE vs TRUNCATE vs DROP.
- **Night (1h):** **Start speaking practice: from today, 1 problem/day solved out loud on camera (10 min).** Aptitude: 10 Q Syllogism.

### Day 16 — Monotonic Stack · 10h
- **Morning (4h):** Monotonic stack theory: next greater/smaller on left/right, the `>=` vs `>` decision, sentinels. Solve **4M**: Next Greater Element I, Next Greater Element II, Daily Temperatures, Stock Span.
- **Afternoon (3h):** Solve **3M + 2H**: Asteroid Collision (M), Remove K Digits (M), Sum of Subarray Minimums (M), **Largest Rectangle in Histogram (H)**, Maximal Rectangle (H).
- **Evening (2h):** DBMS: normalization — FDs, closure, candidate keys, 1NF→BCNF. **Normalise 3 given tables by hand and compute candidate keys for 3 FD sets.**
- **Night (1h):** Notes: "Monotonic stack — the 4 variants table". Aptitude: 10 Q Data Interpretation.

### Day 17 — Queue, Deque, Monotonic Deque · 10h
- **Morning (4h):** Queue/deque implementations, circular queue, queue-via-stacks, monotonic deque. Solve **2E + 3M**: Implement Stack using Queues, Design Circular Queue (M), **Sliding Window Maximum (H-ish M)**, First Negative in Window, Number of Recent Calls.
- **Afternoon (3h):** Solve **3M + 1H**: Rotting Oranges (M — BFS preview), Design Hit Counter (M), Shortest Subarray with Sum at Least K (H), Maximum of Minimum for Every Window Size (H).
- **Evening (2h):** DBMS: transactions, ACID, schedules, serializability, concurrency anomalies (dirty/non-repeatable/phantom), **isolation-level grid — memorise and reproduce**.
- **Night (1h):** Reproduce the isolation grid from memory. Aptitude: 10 Q Clocks & Calendars.

### Day 18 — Heap / Priority Queue · 10h
- **Morning (4h):** Heap internals: heapify (O(n)), sift up/down, `PriorityQueue` comparator semantics in Java (**min-heap by default** — `Collections.reverseOrder()` for max; never `(a,b)->b-a` on large ints). Implement a min-heap from scratch on an `int[]`. Solve **3M**: Kth Largest Element, Top K Frequent Elements, K Closest Points to Origin.
- **Afternoon (3h):** Solve **3M + 2H**: Task Scheduler (M), Reorganize String (M), Minimum Cost to Connect Ropes (M), Merge K Sorted Lists (H), **Find Median from Data Stream (H — two heaps)**.
- **Evening (2h):** DBMS: indexing — B-tree vs B+ tree, clustered vs non-clustered, composite index leftmost-prefix, when indexes hurt. Then SQL: window functions introduction — ROW_NUMBER/RANK/DENSE_RANK. Solve 6 window-function queries.
- **Night (1h):** Notes: heap comparator rules (this trips everyone). Aptitude: 10 Q Cubes & Dice.

### Day 19 — Greedy I · 10h
- **Morning (4h):** Greedy theory: exchange argument, when greedy fails, sort-key selection. Solve **1E + 4M**: Assign Cookies (E), Jump Game (M), Jump Game II (M), Gas Station (M), Partition Labels (M). **For each, state the proof sketch out loud.**
- **Afternoon (3h):** Solve **4M + 1H**: Non-overlapping Intervals, Minimum Number of Arrows, Two City Scheduling, Minimum Platforms, Candy (H).
- **Evening (2h):** **Project 1 kickoff.** Choose from §1.13 (recommendation: URL shortener with analytics in Spring Boot, or a multithreaded HTTP server in plain Java). Today: requirements, schema, API design, repo + README skeleton, first commit.
- **Night (1h):** Notes: "Greedy — how to justify". Aptitude: 10 Q Coding-Decoding.

### Day 20 — Greedy II + Intervals · 10h
- **Morning (4h):** Solve **4M**: Job Sequencing with Deadlines, Fractional Knapsack, Huffman Encoding (implement), Minimum Number of Coins (Indian denominations + when greedy fails).
- **Afternoon (3h):** Intervals & sweep line. Solve **4M**: Insert Interval, Interval List Intersections, My Calendar I, Car Pooling. Plus redo Merge Intervals + Meeting Rooms II unaided.
- **Evening (2h):** Project 1: core CRUD + DB schema implemented. Commit.
- **Night (1h):** Redo List sweep. Aptitude: 10 Q Series & Analogies.

### Day 21 — ⚙️ CONSOLIDATION DAY 3 · 9h
- **Morning (3h):** **Mock OA #3** — 90 min, 3 problems (2M + 1H) with a stack/heap/greedy flavour. 60-min post-mortem.
- **Afternoon (3h):** Redo List sweep for Days 15–20 + 3 items from Week 1–2.
- **Evening (2h):** **Mock Interview #2 (peer mock).** Find a peer; 45 min each way, one medium DSA problem each, written feedback on: communication, approach articulation, code quality, complexity analysis, edge cases, dry run.
- **Night (1h):** Week 3 Readiness Score. Update tracker. Rest.

### Day 22 — Binary Trees I · 10h
- **Morning (4h):** Tree fundamentals + all 3 DFS traversals **recursive AND iterative**, plus level order. Solve **5E**: Maximum Depth, Same Tree, Invert Binary Tree, Symmetric Tree, Path Sum. Then implement inorder/preorder/postorder iteratively from scratch.
- **Afternoon (3h):** Solve **4M**: Binary Tree Level Order Traversal, Zigzag Level Order, Right Side View, Binary Tree Level Order Traversal II. Plus **Morris Inorder** (understand and implement once).
- **Evening (2h):** DBMS: locks (shared/exclusive, 2PL, strict 2PL), MVCC, deadlock in DBMS, query optimisation & EXPLAIN, N+1 problem. Project 1: auth layer.
- **Night (1h):** Notes: iterative traversal templates. Aptitude: 10 Q Statement-Conclusion.

### Day 23 — Binary Trees II · 10h
- **Morning (4h):** Height/diameter/balanced, "return value ≠ answer" pattern. Solve **2E + 3M**: Balanced Binary Tree (E), Diameter of Binary Tree (E), Lowest Common Ancestor of a Binary Tree (M), Path Sum II (M), Path Sum III (M).
- **Afternoon (3h):** Solve **3M + 1H**: Vertical Order Traversal (M), Top/Bottom View (M), All Nodes Distance K (M), **Binary Tree Maximum Path Sum (H)**.
- **Evening (2h):** SQL: window functions deep — LAG/LEAD, running totals, frames, NTILE, FIRST/LAST_VALUE. Solve 8 window queries incl. Nth highest per group, month-over-month growth, running total.
- **Night (1h):** Notes: "Tree recursion — what do I return vs what do I record?". Aptitude: 10 Q Venn Diagrams.

### Day 24 — Binary Trees III + Construction · 10h
- **Morning (4h):** Solve **4M + 1H**: Construct Binary Tree from Preorder and Inorder, Construct from Inorder and Postorder, Flatten Binary Tree to Linked List, Populating Next Right Pointers, **Serialize and Deserialize Binary Tree (H)**.
- **Afternoon (3h):** Solve **3M**: Count Complete Tree Nodes, Sum Root to Leaf Numbers, Burning Tree / Minimum Time to Burn. Plus redo Diameter + LCA unaided.
- **Evening (2h):** Project 1: caching (Redis or in-memory LRU) + rate limiting. Commit + README architecture section.
- **Night (1h):** Redo List. Aptitude: 10 Q Data Sufficiency.

### Day 25 — BST · 10h
- **Morning (4h):** BST properties, search/insert/delete (3 cases), validate with bounds. Solve **2E + 4M**: Search in a BST (E), Range Sum of BST (E), Validate BST (M), Insert into BST (M), Delete Node in a BST (M), LCA of a BST (M).
- **Afternoon (3h):** Solve **4M + 1H**: Kth Smallest Element in a BST, BST Iterator, Convert Sorted Array to BST, Two Sum IV, **Recover Binary Search Tree (H)**.
- **Evening (2h):** OOP consolidation: SOLID — write a real violation + fix for each of the 5. Use your own project as the example.
- **Night (1h):** Notes: BST delete's 3 cases + validate-with-bounds. Aptitude: 10 Q Mixtures & Alligation.

### Day 26 — Trie + Design-in-DSA · 10h
- **Morning (4h):** Trie: node design, insert/search/startsWith, wildcard search, binary trie for XOR. Solve **3M + 1H**: Implement Trie, Design Add and Search Words, Maximum XOR of Two Numbers in an Array, **Word Search II (H)**.
- **Afternoon (3h):** Design questions. Solve **3M + 1H**: **LRU Cache (M — do this until it's automatic)**, Insert Delete GetRandom O(1) (M), Time Based Key-Value Store (M), **LFU Cache (H)**.
- **Evening (2h):** Project 1: tests + error handling + Dockerfile. Deploy to Render/Railway. Get a live URL.
- **Night (1h):** Write the LRU Cache from a blank file, timed (target: 12 minutes). Aptitude: 10 Q Puzzles (burning ropes, 8 balls, 3 bulbs).

### Day 27 — Bit Manipulation + Math · 10h
- **Morning (4h):** Bit tricks: `x&(x-1)`, `x&-x`, XOR properties, popcount, subset enumeration, bitmask basics. Solve **3E + 3M**: Number of 1 Bits, Counting Bits, Reverse Bits, Single Number II (M), Single Number III (M), Sum of Two Integers (M).
- **Afternoon (3h):** Math: GCD/LCM, sieve + SPF, modular arithmetic, fast power, nCr mod p. Solve **2E + 3M**: Count Primes, Power(x,n), Sqrt(x), Excel Sheet Column Title, Factorial Trailing Zeroes, Fraction to Recurring Decimal (M).
- **Evening (2h):** OS: memory management, paging, virtual memory, TLB, **EAT calculation practice**, demand paging, page-fault handling steps, thrashing.
- **Night (1h):** Notes: bit-trick cheat sheet + modular arithmetic rules. Aptitude: 10 Q Probability (harder).

### Day 28 — ⚙️ CONSOLIDATION DAY 4 (mid-point audit) · 9h
- **Morning (3h):** **Mock OA #4** — 90 min, 3 problems, tree/BST/heap flavour. Post-mortem.
- **Afternoon (3h):** Redo List sweep Days 22–27 + a 20-question rapid-fire self-quiz on OS + DBMS (write answers, then grade yourself).
- **Evening (2h):** **Mock Interview #3 (technical, peer or platform — Pramp/Exercism/interviewing.io free tier).** One tree problem + 5 OOP/OS questions.
- **Night (1h):** **HALFWAY AUDIT.** Problems solved so far (target ~330). Topics at ≥80% confidence. Weakness sheet review. Adjust the remaining 32 days: if DP feels shaky, borrow hours from Tier 3 topics. Week 4 Readiness Score.

---
## PHASE 3 — GRAPHS & DYNAMIC PROGRAMMING (Days 29–49)
*The two topics that decide top-tier offers. Half your remaining time lives here. CN + LLD run in the evenings.*

### Day 29 — Graph Foundations + BFS/DFS · 10h
- **Morning (4h):** Representations (adjacency list/matrix/edge list), building a graph from input, directed vs undirected, weighted, in/out degree. Implement BFS and DFS templates (iterative + recursive) from scratch. Solve **2E + 2M**: Find if Path Exists, Number of Islands (M), Max Area of Island (M), Flood Fill.
- **Afternoon (3h):** Grid-as-graph. Solve **4M**: Rotting Oranges (multi-source BFS), 01 Matrix, Surrounded Regions, Number of Enclaves. Pattern: *multi-source BFS, boundary DFS, direction arrays*.
- **Evening (2h):** CN: OSI vs TCP/IP, layer responsibilities, encapsulation. **"What happens when you type a URL" — write the full 12-step answer and memorise it.**
- **Night (1h):** Notes: BFS/DFS templates + "mark visited on push, not pop". Aptitude: 10 Q Logical Puzzles.

### Day 30 — Graphs: Cycles, Bipartite, Components · 10h
- **Morning (4h):** Cycle detection: undirected (parent) vs directed (recursion stack / 3-colour). Solve **4M**: Detect Cycle in Undirected Graph, Detect Cycle in Directed Graph, Course Schedule, Is Graph Bipartite.
- **Afternoon (3h):** Solve **3M + 1H**: Number of Provinces, Clone Graph, Pacific Atlantic Water Flow, **Word Ladder (H)**. Pattern: *BFS on state space*.
- **Evening (2h):** CN: TCP vs UDP, 3-way handshake, 4-way termination, flow vs congestion control, sliding window, slow start.
- **Night (1h):** Draw the 3-colour DFS cycle-detection state machine. Aptitude: 10 Q Bar/Pie DI.

### Day 31 — Topological Sort + DSU · 10h
- **Morning (4h):** Kahn's algorithm + DFS topo + cycle detection via topo. Solve **4M**: Course Schedule II, Find Eventual Safe States, Alien Dictionary, Minimum Height Trees.
- **Afternoon (3h):** DSU with path compression + union by size. Implement from scratch. Solve **4M**: Redundant Connection, Accounts Merge, Most Stones Removed with Same Row or Column, Satisfiability of Equality Equations.
- **Evening (2h):** CN: IP addressing, subnetting maths (do 10 subnetting problems), NAT, DNS record types + resolution flow, DHCP DORA.
- **Night (1h):** Notes: Kahn vs DFS topo; DSU template. Aptitude: 10 Q Puzzles (25 horses, poisoned wine).

### Day 32 — Shortest Paths · 10h
- **Morning (4h):** Dijkstra (PQ, lazy deletion, why no negatives), 0-1 BFS with deque. Solve **3M + 1H**: Network Delay Time, Path With Minimum Effort, Shortest Path in Binary Matrix, **Swim in Rising Water (H)**.
- **Afternoon (3h):** Bellman-Ford (negative cycles, V−1 rounds) + Floyd-Warshall. Solve **3M**: Cheapest Flights Within K Stops (do it with the snapshot-array Bellman-Ford), Find the City With the Smallest Number of Neighbors, Path with Maximum Probability.
- **Evening (2h):** CN: HTTP methods & status codes, idempotency, HTTP/1.1 vs /2 vs /3, HTTPS + TLS handshake, cookies/sessions/JWT, CORS, CSRF/XSS basics.
- **Night (1h):** Notes: shortest-path selection table (which algorithm when). Aptitude: 10 Q Reading Comprehension.

### Day 33 — MST + Graph Round-up · 10h
- **Morning (4h):** Kruskal + Prim, cut property. Solve **3M**: Min Cost to Connect All Points, Connecting Cities With Minimum Cost, Optimize Water Distribution (virtual-node trick). Plus **Critical Connections in a Network (H — Tarjan bridges)**.
- **Afternoon (3h):** Solve **4M**: Number of Islands II (DSU), Evaluate Division (weighted DSU/graph), Open the Lock (BFS on states), Snakes and Ladders.
- **Evening (2h):** **LLD Day 1:** SOLID applied, UML class diagram notation, association vs aggregation vs composition. Draw the class diagram for **Parking Lot** (no code yet). Then code the core classes.
- **Night (1h):** Notes: graph algorithm decision tree. Aptitude: 10 Q Sentence Correction + Para-jumbles.

### Day 34 — Graph Practice Marathon · 10h
- **Morning (4h):** Timed mixed-graph set, 4 problems in 3 hours, no hints: pick unseen M/H graph problems (e.g. Making a Large Island, Shortest Path Visiting All Nodes, Minimum Obstacle Removal, Number of Ways to Arrive at Destination). Then 1h review.
- **Afternoon (3h):** Redo **all** graph problems from Days 29–33 that you didn't solve unaided. Target: solve each in ≤20 min now.
- **Evening (2h):** **LLD Day 2:** Design Patterns part 1 — Singleton (thread-safe), Factory, Abstract Factory, Builder, Prototype. Code a small example of each.
- **Night (1h):** Notes: "Graph problem → algorithm" flowchart. Aptitude: 10 Q Mensuration.

### Day 35 — ⚙️ CONSOLIDATION DAY 5 · 9h
- **Morning (3h):** **Mock OA #5** — 90 min, 3 problems, graph-heavy. Post-mortem.
- **Afternoon (3h):** Full Redo List sweep (Days 29–34) + spaced-repetition redo of 4 items from Weeks 1–3.
- **Evening (2h):** **Mock Interview #4 (technical, graphs).** 45 min, one graph medium/hard, spoken end-to-end. Record it.
- **Night (1h):** Week 5 Readiness Score. Resume v4 — add Project 1 with real bullets and the live link.

### Day 36 — DP Foundations: 1-D · 10h
- **Morning (4h):** DP mindset: identify state, recurrence, base case; recursion → memo → tabulation → space optimisation. Do all four steps for: Climbing Stairs, Min Cost Climbing Stairs, House Robber, House Robber II. Solve **2E + 2M**.
- **Afternoon (3h):** Solve **4M**: Decode Ways, Fibonacci variants, Maximum Sum of Non-Adjacent Elements, Frog Jump with k distances. **For each: write the recursion tree on paper first.**
- **Evening (2h):** **LLD Day 3:** Patterns part 2 — Strategy, Observer, Decorator, Adapter, Facade, Command, State. Code a small example of each.
- **Night (1h):** Notes: "DP 4-step method" laminated card. Aptitude: 10 Q Progressions.

### Day 37 — DP: 0/1 Knapsack Family · 10h
- **Morning (4h):** The knapsack template and its 6 disguises. Solve **4M**: 0/1 Knapsack, Subset Sum, Partition Equal Subset Sum, Count Subsets with Given Sum.
- **Afternoon (3h):** Solve **3M + 1H**: Target Sum, Minimum Subset Sum Difference, Partition to K Equal Sum Subsets (H), Last Stone Weight II.
- **Evening (2h):** **LLD Day 4:** Design **Elevator System** end-to-end (requirements → classes → state pattern → scheduling strategy → sequence diagram). Write the code skeleton.
- **Night (1h):** Notes: "knapsack disguises — how to recognise". Aptitude: 10 Q Puzzles.

### Day 38 — DP: Unbounded Knapsack + Grid · 10h
- **Morning (4h):** Unbounded knapsack. Solve **4M**: Coin Change, Coin Change II, Rod Cutting, Combination Sum IV / Integer Break.
- **Afternoon (3h):** Grid DP. Solve **1E + 3M + 1H**: Unique Paths, Unique Paths II, Minimum Path Sum, Triangle, **Dungeon Game (H)** or Falling Path Sum.
- **Evening (2h):** **LLD Day 5:** Design **Splitwise** + **Tic-Tac-Toe**. Class diagrams + core code. 
- **Night (1h):** Redo List. Aptitude: 10 Q Logical Reasoning mixed.

### Day 39 — DP: LIS Family · 10h
- **Morning (4h):** LIS O(n²) and O(n log n) (patience/binary search), reconstruct the sequence. Solve **3M + 1H**: Longest Increasing Subsequence, Number of LIS, Longest Divisible Subset, **Russian Doll Envelopes (H)**.
- **Afternoon (3h):** Solve **3M**: Maximum Length of Pair Chain, Longest String Chain, Longest Bitonic Subsequence. Plus timed redo of Coin Change + Partition Equal Subset Sum.
- **Evening (2h):** **LLD Day 6:** Design **BookMyShow** (seat locking & concurrency!) and **ATM** (state pattern). Discuss the concurrency question out loud.
- **Night (1h):** Notes: LIS n log n explanation in your own words. Aptitude: 10 Q Quant mixed.

### Day 40 — DP: LCS Family · 10h
- **Morning (4h):** LCS template and its variants; print the LCS. Solve **4M**: Longest Common Subsequence, Longest Common Substring, Longest Palindromic Subsequence, Minimum Insertions to Make Palindrome.
- **Afternoon (3h):** Solve **2M + 2H**: Shortest Common Supersequence (H), **Edit Distance (H)**, Distinct Subsequences (H), Delete Operation for Two Strings.
- **Evening (2h):** **LLD Day 7:** Design **Snake & Ladder**, **Vending Machine**, **Logging Framework**. Speed-run: 30 min each, class diagram + key interfaces only.
- **Night (1h):** Notes: LCS variant table. Aptitude: 10 Q verbal.

### Day 41 — DP: Stocks + State Machines · 10h
- **Morning (4h):** The unified stock DP template (buy/sell state + transactions + cooldown + fee). Solve **all 6**: Best Time to Buy and Sell Stock I, II, III, IV, with Cooldown, with Transaction Fee.
- **Afternoon (3h):** State-machine DP. Solve **2M + 2H**: Word Break, Interleaving String (H), **Regular Expression Matching (H)** or Wildcard Matching (H), Palindrome Partitioning II (H).
- **Evening (2h):** OOP + LLD revision quiz (30 questions, self-graded). Project 2 kickoff — a smaller project (2–3 days): e.g. your own thread pool on `BlockingQueue` + task queue in Java, or a mini key-value store with a write-ahead log.
- **Night (1h):** Notes: stock DP one template. Aptitude: 10 Q DI.

### Day 42 — ⚙️ CONSOLIDATION DAY 6 · 9h
- **Morning (3h):** **Mock OA #6** — 90 min, 3 problems, DP-heavy. Post-mortem.
- **Afternoon (3h):** DP-only Redo sweep: re-solve 8 DP problems from Days 36–41 from a blank file, timed.
- **Evening (2h):** **Mock Interview #5 (LLD).** 45 min: "Design a parking lot." Speak the full framework. Record it.
- **Night (1h):** Week 6 Readiness Score. Update tracker.

### Day 43 — DP: Partition / MCM · 10h
- **Morning (4h):** MCM pattern (`i..j` with a partition point `k`). Solve **2M + 2H**: Matrix Chain Multiplication, Minimum Cost to Cut a Stick, **Burst Balloons (H)**, Boolean Parenthesization (H).
- **Afternoon (3h):** Solve **2M + 2H**: Palindrome Partitioning II, Partition Array for Maximum Sum, Minimum Cost to Merge Stones (H), Egg Dropping (H).
- **Evening (2h):** **HLD Day 1:** Core vocabulary — scaling, load balancers, caching (patterns + eviction + invalidation), CDN, stateless services, DB replication & sharding, consistent hashing, CAP. Read + take notes.
- **Night (1h):** Notes: MCM template. Aptitude: 10 Q puzzles.

### Day 44 — DP on Trees + Bitmask DP · 10h
- **Morning (4h):** DP on trees (return-to-parent vs global answer). Solve **3M + 1H**: House Robber III, Binary Tree Cameras (H), Distribute Coins in Binary Tree, Diameter (re-derive as tree DP).
- **Afternoon (3h):** Bitmask DP. Solve **2M + 2H**: Partition to K Equal Sum Subsets (bitmask version), Shortest Path Visiting All Nodes (H), Travelling Salesman (H, n≤15), Assign Tasks/Cookies with bitmask.
- **Evening (2h):** **HLD Day 2:** Message queues (Kafka concepts: topics, partitions, consumer groups, offsets, delivery semantics), async workers, rate limiting algorithms, idempotency, retries + backoff + jitter, circuit breaker.
- **Night (1h):** Notes: "when is bitmask DP intended? n ≤ 20". Aptitude: 10 Q quant.

### Day 45 — DP Marathon + Digit DP awareness · 10h
- **Morning (4h):** **Timed DP set:** 5 unseen DP problems in 3.5 hours (mix M/H). Then review.
- **Afternoon (3h):** Redo every DP problem you failed in Days 36–44. Target ≤25 min each now. Awareness pass on Digit DP (1 problem: count numbers ≤ N with a property).
- **Evening (2h):** **HLD Day 3:** Design **URL Shortener** fully (requirements → estimation → API → schema → encoding scheme → cache → scaling → analytics). Write it up in your notes as a reference answer.
- **Night (1h):** Notes: the DP family checklist — can you name all 12 and one problem each? Aptitude: 10 Q logical.

### Day 46 — Advanced Trees: Segment Tree / Fenwick · 10h
- **Morning (4h):** Segment tree build/query/update; Fenwick tree. Implement both from scratch. Solve **2M + 1H**: Range Sum Query Mutable, Range Minimum Query, **Count of Smaller Numbers After Self (H)**.
- **Afternoon (3h):** Solve **2H**: Reverse Pairs, Count of Range Sum. Plus lazy propagation (concept + one problem). *If Tier 1 topics still feel weak, skip the afternoon and do Tier 1 revision instead — that is the correct trade.*
- **Evening (2h):** **HLD Day 4:** Design **Rate Limiter** + **Notification Service**. Then: "How would you scale Project 1 to 1M users?" — write the full answer.
- **Night (1h):** Notes: segment tree template. Aptitude: 10 Q mixed.

### Day 47 — Advanced Graphs + Advanced Strings · 10h
- **Morning (4h):** Tarjan bridges & articulation points, Kosaraju SCC, 0-1 BFS. Solve **3H/M**: Critical Connections, Strongly Connected Components (implement), Minimum Obstacle Removal.
- **Afternoon (3h):** KMP failure function, Z-algorithm, Rabin-Karp. Solve **3M**: Implement strStr(), Repeated Substring Pattern, Shortest Palindrome / Longest Happy Prefix.
- **Evening (2h):** **HLD Day 5:** Design **WhatsApp/Chat** + **Instagram Feed** (fan-out on write vs read). 
- **Night (1h):** Notes: KMP in your own words. Aptitude: 10 Q puzzles.

### Day 48 — Weak-Area Repair Day · 10h
- **Morning (4h):** Open your **Weakness sheet**. Take the top 2 weakest topics. Re-learn the theory, then solve 6 problems from those topics *only*.
- **Afternoon (3h):** Take the next 2 weakest topics. 6 more problems.
- **Evening (2h):** Project 2 completion: README, tests, deploy or package, commit history cleanup. Add to resume (v5).
- **Night (1h):** Re-record your 90-second explanations for **both** projects. Time them.

### Day 49 — ⚙️ CONSOLIDATION DAY 7 · 9h
- **Morning (3h):** **Mock OA #7** — 120 min, 4 problems (full company-style). Post-mortem.
- **Afternoon (3h):** Redo sweep Days 43–48 + 5 spaced-repetition items from Weeks 1–4.
- **Evening (2h):** **Mock Interview #6 (behavioural).** 45 min: "Tell me about yourself" + 6 STAR questions + "questions for us?" Record and review.
- **Night (1h):** Week 7 Readiness Score. Resume v5 final structural check.

---

## PHASE 4 — COMPANY MODE (Days 50–60)
*Goal: convert knowledge into cleared rounds. Volume drops, intensity and realism rise. No new topics after Day 52.*

### Day 50 — Company Pattern Day: Amazon + Microsoft · 10h
- **Morning (4h):** Amazon-tagged set: 6 problems (arrays, trees, graphs, design). Emphasise: LRU Cache, Number of Islands, Word Ladder, Merge Intervals, Copy List with Random Pointer, K Closest Points.
- **Afternoon (3h):** Microsoft-tagged set: 5 problems (LinkedList, strings, trees, DP).
- **Evening (2h):** **Amazon Leadership Principles workshop.** Map your 8 stories to 16 LPs in a table. Write out 6 full STAR answers. Practise the "dive deep" follow-ups ("what data?", "what was the trade-off?", "what would you change?").
- **Night (1h):** Company research: Amazon & Microsoft products, recent news, why you want to join. 2 questions to ask each.

### Day 51 — Company Pattern Day: Google + Adobe · 10h
- **Morning (4h):** Google-style set: 4 hard problems (graphs/DP/strings), solved with full communication, edge cases, and testing — quality over quantity. Write clean, named, commented code.
- **Afternoon (3h):** Adobe-style set: 5 problems + 5 Java internals questions (`HashMap` internals, `equals`/`hashCode` contract, string pool & immutability, GC and memory leaks, `synchronized` vs `volatile`) + 3 puzzles.
- **Evening (2h):** OOP + LLD rapid revision: SOLID, 12 patterns, 3 LLD problems re-drawn from memory in 20 min each.
- **Night (1h):** Company research: Google & Adobe. Aptitude: 10 Q.

### Day 52 — Company Pattern Day: Finance (GS/MS/JPMC) + Aptitude Sprint · 10h
- **Morning (4h):** Full aptitude mock: 60 questions in 60 min (quant + logical + DI), then review. Then 2 hrs on your weakest 2 aptitude areas.
- **Afternoon (3h):** Probability & combinatorics deep set (30 questions) + 8 classic puzzles solved *out loud*.
- **Evening (2h):** DSA: 4 medium problems (arrays/strings/DP — GS/MS favour clean medium problems + maths).
- **Night (1h):** Company research: GS, MS, JPMC — business lines, why finance-tech.

### Day 53 — Full Loop Simulation Day 1 · 10h
- **Morning (3h):** **Mock OA #8** under exact company conditions (webcam on, no tabs, 90 min).
- **Afternoon (3h):** **Mock Interview #7 (technical round 1):** 45 min, 2 problems, peer or platform. Immediately after: **Mock Interview #8 (technical round 2):** 45 min, 1 hard problem + CS fundamentals rapid-fire (10 questions across OS/DBMS/CN/OOP).
- **Evening (2h):** Feedback processing: write down every stumble. Fix the top 3 tonight (re-solve, re-learn, re-say).
- **Night (1h):** Rest. Light revision of notes only.

### Day 54 — Core CS Blitz · 10h
- **Morning (4h):** **OS full revision** — 60-question self-quiz written from memory, then grade. Redo weak areas. Practise: fork outputs, AWT computation, page-replacement simulation, Banker's, EAT.
- **Afternoon (3h):** **DBMS + SQL full revision** — normalization exercises, isolation grid, indexing Q&A, then 12 SQL queries (mix of window functions, CTE, joins) written *without running them first*, then verify.
- **Evening (2h):** **CN + OOP revision** — the URL question end-to-end, TCP/UDP, DNS, HTTPS, status codes; 4 pillars, SOLID, patterns.
- **Night (1h):** One-page condensed sheets for OS, DBMS, CN, OOP. These are your pre-interview 20-minute revision sheets.

### Day 55 — DSA Revision Sweep 1 (Tier 1 topics) · 10h
- **Morning (4h):** Re-solve, timed, from blank files: 6 problems spanning arrays, hashing, two pointers, sliding window, prefix sum, binary search. Target: all under 20 min each.
- **Afternoon (3h):** Re-solve 5 problems spanning linked list, stack/monotonic, heap, greedy.
- **Evening (2h):** Re-solve 4 tree/BST problems + LRU Cache from memory.
- **Night (1h):** Update the Weakness sheet. Anything still failing goes to tomorrow's list.

### Day 56 — ⚙️ CONSOLIDATION DAY 8 + DSA Revision Sweep 2 · 9h
- **Morning (3h):** Re-solve 5 graph problems + 5 DP problems, timed, from blank files.
- **Afternoon (3h):** **Mock Interview #9 (system/LLD or HLD depending on your target companies).** 45 min. Then a 45-min mixed technical.
- **Evening (2h):** Everything still failing from the Weakness sheet — attack it directly with the editorial, then re-solve.
- **Night (1h):** Week 8 Readiness Score. Resume final version locked. Print 5 copies.

### Day 57 — Resume, Projects & Story Day · 9h
- **Morning (3h):** **Resume interrogation drill:** for every single line on your resume, write the 3 questions an interviewer could ask, and answer them. Every technology listed must survive a 5-minute grilling — remove anything that can't.
- **Afternoon (3h):** Project deep-prep: architecture diagram redrawn from memory for both projects; scaling answer; hardest bug story; "what would you do differently"; race-condition question; schema + indexes justified.
- **Evening (2h):** Behavioural: rehearse all 8 STAR stories out loud, timed at 90–120 seconds. Rehearse "Tell me about yourself" 10 times until it's natural, not recited.
- **Night (1h):** Prepare 3 questions to ask interviewers. Confirm LinkedIn/GitHub are clean and pinned repos are right.

### Day 58 — Full Loop Simulation Day 2 · 9h
- **Morning (3h):** **Mock Interview #10:** 45-min DSA (hard) + **Mock Interview #11:** 45-min DSA (medium + follow-ups) back to back, exactly like a real loop, with a 10-min break only.
- **Afternoon (3h):** **Mock Interview #12:** 45-min CS fundamentals + project deep dive. **Mock Interview #13:** 30-min HR/behavioural.
- **Evening (2h):** Consolidated feedback. Fix the top 3 issues.
- **Night (1h):** Light revision of the one-page sheets. Sleep 8 hours.

### Day 59 — Light Revision & Confidence Day · 7h
- **Morning (3h):** Re-solve 4 problems you *know* you can solve (deliberately building confidence, not finding gaps). Then skim all pattern notes.
- **Afternoon (2h):** Skim the one-page CS sheets + LLD patterns + SQL archetypes. Do **not** learn anything new.
- **Evening (1h):** Re-read your resume, project explanations, and STAR stories once. Say "tell me about yourself" twice.
- **Night (1h):** Logistics: laptop, charger, internet backup (mobile hotspot), IDE set up, ID proof, resume PDF + printed copies, interview links tested, quiet room booked, water. Sleep early.

### Day 60 — Readiness Day · 4h (deliberately light)
- **Morning (2h):** 2 easy + 1 medium problem to warm up the hands. Skim notes.
- **Afternoon (1h):** Final placement checklist (Part 8) — tick every box. Fix anything unticked that takes <30 min; note the rest.
- **Evening (1h):** Mental rehearsal: walk through a full interview in your head — greeting, TMAY, problem, clarifying questions, approach, code, complexity, questions for them, thank you.
- **Night:** **Rest.** No screens after 10 pm. You are prepared. From tomorrow, prep becomes maintenance: 3–4 problems/day + one mock every 2 days + revision of the one-page sheets before each interview.

---
# PART 4 — WEEKLY REVISION PROTOCOL

Every 7th day (Days 7, 14, 21, 28, 35, 42, 49, 56) is a **Consolidation Day**. Same six-block structure every week:

| Block | Time | What happens | Output |
|---|---|---|---|
| **1. Mock OA** | 90 min | 3–4 problems, timed, no help, contest conditions | Score + list of unsolved problems |
| **2. Post-mortem** | 60 min | For each miss, classify the cause: (a) didn't know the pattern, (b) knew but implemented wrong, (c) misread constraints/statement, (d) too slow, (e) careless bug | Error-category tally |
| **3. Redo List sweep** | 2–3 h | Re-solve every unsolved problem of the week from a **blank file**. Plus 3–5 spaced-repetition items from earlier weeks (Day+10, Day+30) | Updated Redo List |
| **4. Mock interview** | 45–60 min | Rotates weekly: technical → peer → technical → LLD → behavioural → full loop (see Part 7) | Recording + written feedback |
| **5. Resume + project review** | 30 min | One improvement to the resume; one improvement to a project (README, test, feature, deploy); re-time your 90-second project pitch | Updated resume version |
| **6. Mistake analysis + score** | 30 min | Update the Weakness sheet; compute the Interview Readiness Score (Part 10); decide **one** change to next week's plan | Weekly score + one adjustment |

**The spaced-repetition schedule for any problem you failed:**
Day 0 (failed) → **Day +3** (re-solve) → **Day +10** (re-solve) → **Day +30** (re-solve). If you solve it unaided at +10 and +30, retire it. If you fail twice, it goes on the Weakness sheet and gets a dedicated relearn.

**Weekly mistake-analysis questions (answer honestly in writing):**
1. Which error category dominated this week? What is the *specific* fix?
2. Which topic did I avoid because it was uncomfortable? (That's the one to schedule first next week.)
3. Did I actually speak while solving at least 5 times this week?
4. How many problems did I solve *unaided* vs *after looking*? (Target: 65%+ unaided by Week 5.)
5. Did I do anything low-ROI this week that I should stop?

**Weekly milestones:**
| Week | Days | Milestone | Cumulative problems |
|---|---|---|---|
| 1 | 1–7 | Collections fluent, 5 array/string patterns owned, resume v1 | ~75 |
| 2 | 8–14 | Binary search (incl. on answer), recursion/backtracking, linked list | ~155 |
| 3 | 15–21 | Stack/monotonic, heap, greedy, intervals; Project 1 started; OS half done | ~235 |
| 4 | 22–28 | Trees + BST + Trie + LRU; DBMS + SQL solid; Project 1 deployed | ~330 |
| 5 | 29–35 | All of graphs; CN done; LLD started | ~415 |
| 6 | 36–42 | DP families 1–8; 12 design patterns; 5 LLD problems | ~505 |
| 7 | 43–49 | DP complete; HLD vocabulary + 5 systems; Project 2 done | ~600 |
| 8 | 50–56 | Company patterns; full CS revision; 6 mock interviews done | ~680 |
| 9 | 57–60 | Resume/story/project polish; full-loop simulations; taper | ~700–750 |

---

# PART 5 — RESOURCES (and why each one)

> **Rule: one primary resource per topic.** Collecting resources is procrastination that feels like work. Pick from column 1, use column 2 only when stuck.

## DSA — structured courses & sheets
| Resource | Use it for | Why |
|---|---|---|
| **Striver's A2Z DSA Course / SDE Sheet (takeUforward)** | Your **primary** DSA spine | Best-structured free Indian resource; topic order matches interview frequency; video + article + practice link per problem; the A2Z sheet is the single best "follow this and don't think" option |
| **NeetCode 150 / NeetCode.io roadmap** | Pattern-first coverage + revision | Cleanest pattern taxonomy; excellent explanations; the 150 is the highest signal-per-problem list in existence. Use NeetCode 150 as your *revision* set in Weeks 8–9 |
| **LeetCode Top Interview 150 + company tags** | Daily practice + company mode | The tags are the closest thing to a leaked question bank; Premium (1 month, Day 45–60) is genuinely worth it for company-specific frequency data |
| **GeeksforGeeks (topic articles + Practice)** | Theory gaps, Indian-company-style questions | Best coverage of Indian OA-style questions (Samsung, Oracle, Amazon MCQs) |
| **InterviewBit** | Structured guided path with time limits | Good for timed discipline; useful secondary path |
| **Codeforces (Div 3/Div 2 A–C)** | Speed, implementation stamina, edge cases | Nothing builds fast, correct implementation like rated contests. Do 2 virtual contests/week from Week 3 |
| **CodeChef / AtCoder Beginner Contest (ABC A–D)** | Same, gentler ramp | ABC problems are exceptionally clean and well-tested; great for DP practice |
| **CSES Problem Set** | DP and graph mastery | The CSES DP and Graph sections are the best free structured problem sets for these two topics anywhere |

## DSA — books & references
| Resource | Use it for |
|---|---|
| **Cracking the Coding Interview (McDowell)** | Interview process, behavioural, classic questions. Read the non-code chapters; the code is dated |
| **Elements of Programming Interviews in Java** | Harder, higher-quality problems if you're targeting Google |
| **Introduction to Algorithms (CLRS)** | Reference only — look things up, don't read cover to cover (low ROI in 60 days) |
| **Competitive Programmer's Handbook (Antti Laaksonen), free PDF** | Concise, correct, excellent for graphs/DP/number theory |

## Core CS
| Subject | Primary | Secondary |
|---|---|---|
| **OS** | Gate Smashers (Hindi) or Neso Academy playlists; **Operating System Concepts (Galvin)** for depth | *OSTEP* (free, excellent) if you want real understanding; GFG OS interview questions for the last-mile |
| **DBMS** | Gate Smashers DBMS playlist; **Database System Concepts (Korth)** chapters on normalization/transactions/indexing | Use The Index, Luke! (free site) for indexing intuition — best resource on the topic |
| **CN** | Kurose & Ross *Computer Networking: A Top-Down Approach* (ch. 1–3 + 4 basics); Neso Academy / Gate Smashers | *High Performance Browser Networking* (free) for HTTP/TLS depth |
| **OOP + Java core** | Learn by writing Java code, not videos. **Effective Java (Joshua Bloch)** — items 10–14 (equals/hashCode), 15–22 (classes & interfaces), 17 (immutability) are exactly what gets asked. *Head First Design Patterns* for pattern intuition | Kunal Kushwaha's Java DSA playlist (free, Java-native, Indian-campus oriented); Telusko/Java Brains for core Java; the official Java Tutorials + Javadoc for semantics; GFG Java interview question sets |

## Design
| Resource | Use it for | Why |
|---|---|---|
| **Refactoring.Guru** | Design patterns | Best pattern explanations on the internet — diagrams + real code + when *not* to use |
| **Head First Design Patterns** | Pattern intuition | Makes patterns memorable; skim, don't read cover-to-cover |
| **Grokking the Low Level Design / LLD repos on GitHub** (e.g. curated "awesome-low-level-design") | LLD problems with solutions | Gives you the expected structure of an LLD answer |
| **System Design Primer (GitHub, donnemartin)** | HLD vocabulary + estimation | The canonical free HLD resource; read the summary sections + 3 case studies |
| **ByteByteGo (Alex Xu) — book + YouTube** | HLD explained visually | Best diagrams; the newsletter/videos are ideal 20-min evening study |
| **Gaurav Sen / Arpit Bhayani / Hussein Nasser (YouTube)** | HLD & DB internals intuition | Gaurav Sen for interview framing; Arpit Bhayani for depth; Hussein Nasser for networking/DB internals |

## SQL
| Resource | Why |
|---|---|
| **LeetCode SQL 50 / Database section** | Exactly interview-format; do all 50 |
| **HackerRank SQL (Basic → Advanced + Certification)** | Good ramp, and the certificate is a small resume line |
| **StrataScratch / DataLemur** | Real company-asked SQL questions, especially window functions |
| **Mode SQL Tutorial (free)** | The clearest window-function explanation available |

## Aptitude & Puzzles
| Resource | Why |
|---|---|
| **R.S. Aggarwal — Quantitative Aptitude & Verbal/Non-Verbal Reasoning** | Standard, exhaustive; use as a question bank, not a textbook |
| **IndiaBix** | Free, topic-wise, company-wise, mock-test format |
| **PrepInsta / Faceprep** | Company-specific aptitude patterns |
| **Brainstellar (puzzles)** | Quant-finance-grade puzzles — exactly what GS/MS ask |
| **"Heard on The Street" (Timothy Crack)** | If targeting GS/MS/quant-flavoured roles |

## Mock interviews & community
| Resource | Why |
|---|---|
| **Pramp / exponent / interviewing.io (free tiers)** | Free peer mocks with strangers — the discomfort is the point |
| **A study partner from your batch** | The single highest-ROI resource in this entire list. Daily 45-min peer mock beats any paid course |
| **LeetCode Discuss + company-tag threads** | Recent OA patterns posted by candidates within days of the drive |
| **Your college seniors placed last year** | Ask for: exact rounds, exact questions, what surprised them. Nothing else is this accurate |
| **Glassdoor / AmbitionBox interview sections** | Company-specific round structure |

## Tracking
| Tool | Use |
|---|---|
| **Notion / Google Sheets tracker** | The `Date/Problem/Topic/Pattern/Time/Unaided?/Redo date` sheet from Day 1 |
| **LeetCode list feature** | Build lists: "Redo", "Weakness", "Company: Amazon" |
| **Anki (optional)** | Flashcards for OS/DBMS/CN facts — 10 min/day, very high retention per minute |

---
# PART 6 — CATEGORIZED INTERVIEW QUESTION LISTS

*Ordered by interview frequency: items 1–30 are the highest-frequency, do those first.*

## 6.1 TOP 100 — ARRAYS, STRINGS, HASHING, TWO POINTERS, SLIDING WINDOW, PREFIX, BINARY SEARCH

**Tier A (1–30) — do these no matter what**
1. Two Sum 2. Best Time to Buy and Sell Stock 3. Maximum Subarray (Kadane) 4. Contains Duplicate 5. Product of Array Except Self 6. Merge Intervals 7. Move Zeroes 8. Sort Colors 9. Set Matrix Zeroes 10. Rotate Array 11. Find the Duplicate Number 12. Missing Number 13. Majority Element 14. Longest Consecutive Sequence 15. 3Sum 16. Container With Most Water 17. Trapping Rain Water 18. Longest Substring Without Repeating Characters 19. Minimum Window Substring 20. Valid Anagram 21. Group Anagrams 22. Longest Palindromic Substring 23. Valid Palindrome 24. Subarray Sum Equals K 25. Binary Search 26. Search in Rotated Sorted Array 27. Find First and Last Position of Element 28. Koko Eating Bananas 29. Median of Two Sorted Arrays 30. Top K Frequent Elements

**Tier B (31–65)**
31. Next Permutation 32. Maximum Product Subarray 33. Best Time to Buy and Sell Stock II 34. Merge Sorted Array 35. Remove Duplicates from Sorted Array 36. Remove Duplicates from Sorted Array II 37. Squares of a Sorted Array 38. Two Sum II (sorted) 39. 3Sum Closest 40. 4Sum 41. Boats to Save People 42. Longest Repeating Character Replacement 43. Max Consecutive Ones III 44. Fruit Into Baskets 45. Permutation in String 46. Find All Anagrams in a String 47. Minimum Size Subarray Sum 48. Subarrays with K Different Integers 49. Sliding Window Maximum 50. Subarray Sums Divisible by K 51. Continuous Subarray Sum 52. Range Sum Query 2D Immutable 53. Corporate Flight Bookings 54. Car Pooling 55. Search a 2D Matrix 56. Search a 2D Matrix II 57. Find Peak Element 58. Find Minimum in Rotated Sorted Array 59. Search in Rotated Sorted Array II 60. Single Element in a Sorted Array 61. Capacity to Ship Packages Within D Days 62. Split Array Largest Sum 63. Aggressive Cows 64. Allocate Minimum Number of Pages 65. Kth Smallest Element in a Sorted Matrix

**Tier C (66–100)**
66. Spiral Matrix 67. Rotate Image 68. Game of Life 69. Diagonal Traverse 70. Valid Sudoku 71. Pascal's Triangle 72. Majority Element II 73. Longest Common Prefix 74. String to Integer (atoi) 75. Reverse Words in a String 76. Isomorphic Strings 77. Roman to Integer / Integer to Roman 78. Multiply Strings 79. Add Binary 80. Count and Say 81. Compare Version Numbers 82. Palindromic Substrings 83. Valid Palindrome II 84. Repeated Substring Pattern 85. Implement strStr() 86. Custom Sort String 87. Ransom Note 88. First Unique Character in a String 89. Longest Word in Dictionary 90. Ransom/Word Pattern 91. Contains Duplicate II 92. Contains Duplicate III 93. 4Sum II 94. Insert Delete GetRandom O(1) 95. Design HashMap 96. H-Index 97. Largest Number 98. Wiggle Sort II 99. Minimum Number of Arrows to Burst Balloons 100. Partition Labels

---

## 6.2 TOP 100 — GRAPHS

**Tier A (1–30)**
1. Number of Islands 2. Clone Graph 3. Course Schedule 4. Course Schedule II 5. Rotting Oranges 6. Max Area of Island 7. Flood Fill 8. Pacific Atlantic Water Flow 9. Surrounded Regions 10. Number of Provinces 11. Word Ladder 12. Is Graph Bipartite 13. 01 Matrix 14. Detect Cycle in Undirected Graph 15. Detect Cycle in Directed Graph 16. Topological Sort (Kahn's) 17. Redundant Connection 18. Accounts Merge 19. Network Delay Time (Dijkstra) 20. Cheapest Flights Within K Stops 21. Path With Minimum Effort 22. Shortest Path in Binary Matrix 23. Min Cost to Connect All Points (MST) 24. Alien Dictionary 25. Critical Connections in a Network 26. Number of Enclaves 27. Walls and Gates 28. Open the Lock 29. Evaluate Division 30. Graph Valid Tree

**Tier B (31–65)**
31. Number of Islands II 32. Most Stones Removed with Same Row or Column 33. Satisfiability of Equality Equations 34. Smallest String With Swaps 35. Largest Component Size by Common Factor 36. Connecting Cities With Minimum Cost 37. Optimize Water Distribution in a Village 38. Find Eventual Safe States 39. Minimum Height Trees 40. Sequence Reconstruction 41. Parallel Courses 42. Sort Items by Groups Respecting Dependencies 43. Reconstruct Itinerary (Euler path) 44. Swim in Rising Water 45. Path with Maximum Probability 46. Minimum Cost to Reach Destination in Time 47. Number of Ways to Arrive at Destination 48. Find the City With the Smallest Number of Neighbors 49. Bellman-Ford implementation 50. Floyd-Warshall implementation 51. Shortest Bridge 52. Making a Large Island 53. As Far from Land as Possible 54. Shortest Path Visiting All Nodes 55. Minimum Obstacle Removal (0-1 BFS) 56. Minimum Weighted Subgraph 57. Snakes and Ladders 58. Jump Game III / IV 59. Word Search 60. Word Search II (Trie + DFS) 61. Keys and Rooms 62. All Paths From Source to Target 63. Count Sub Islands 64. Number of Distinct Islands 65. Nearest Exit from Entrance in Maze

**Tier C (66–100)**
66. Strongly Connected Components (Kosaraju) 67. Tarjan's Articulation Points 68. Bridges in a Graph 69. Eulerian Path/Circuit check 70. Minimum Spanning Tree — Prim's 71. Minimum Spanning Tree — Kruskal's 72. Second Minimum Node in a Path 73. Redundant Connection II 74. Course Schedule IV 75. Longest Path in a DAG 76. Minimum Number of Vertices to Reach All Nodes 77. Maximal Network Rank 78. Find if Path Exists in Graph 79. Detonate the Maximum Bombs 80. Check if There is a Valid Path in a Grid 81. Time Needed to Inform All Employees 82. Reorder Routes to Make All Paths Lead to City Zero 83. The Maze I/II/III 84. Cut Off Trees for Golf Event 85. Bus Routes 86. Minimum Genetic Mutation 87. Sliding Puzzle 88. Water and Jug Problem (BFS on states) 89. Escape a Large Maze 90. Cheapest Flights (Bellman-Ford variant) 91. Frog Jump / Minimum Jumps in a Grid 92. Regions Cut By Slashes (DSU) 93. Number of Operations to Make Network Connected 94. Path with Maximum Minimum Value 95. Maximum Number of Fish in a Grid 96. Count Unreachable Pairs of Nodes 97. Minimum Score of a Path Between Two Cities 98. Find Closest Node to Given Two Nodes 99. Longest Cycle in a Graph 100. Divide Nodes Into the Maximum Number of Groups

---

## 6.3 TOP 100 — DYNAMIC PROGRAMMING

**Tier A (1–30)**
1. Climbing Stairs 2. House Robber 3. House Robber II 4. Min Cost Climbing Stairs 5. Coin Change 6. Coin Change II 7. Longest Increasing Subsequence 8. Longest Common Subsequence 9. Edit Distance 10. 0/1 Knapsack 11. Partition Equal Subset Sum 12. Target Sum 13. Unique Paths 14. Unique Paths II 15. Minimum Path Sum 16. Word Break 17. Decode Ways 18. Best Time to Buy and Sell Stock III 19. Best Time to Buy and Sell Stock IV 20. Best Time to Buy and Sell Stock with Cooldown 21. Longest Palindromic Subsequence 22. Palindromic Substrings (DP) 23. Maximum Product Subarray 24. Jump Game 25. Jump Game II 26. Triangle 27. Maximal Square 28. Perfect Squares 29. Longest Increasing Path in a Matrix 30. Burst Balloons

**Tier B (31–65)**
31. Subset Sum 32. Count Subsets with Given Sum 33. Minimum Subset Sum Difference 34. Rod Cutting 35. Integer Break 36. Combination Sum IV 37. Number of LIS 38. Longest Divisible Subset 39. Russian Doll Envelopes 40. Maximum Length of Pair Chain 41. Longest String Chain 42. Longest Bitonic Subsequence 43. Longest Common Substring 44. Shortest Common Supersequence 45. Distinct Subsequences 46. Minimum Insertions to Make Palindrome 47. Delete Operation for Two Strings 48. Wildcard Matching 49. Regular Expression Matching 50. Interleaving String 51. Matrix Chain Multiplication 52. Minimum Cost to Cut a Stick 53. Boolean Parenthesization 54. Palindrome Partitioning II 55. Minimum Cost to Merge Stones 56. Partition Array for Maximum Sum 57. Egg Dropping 58. Cherry Pickup 59. Cherry Pickup II 60. Falling Path Sum 61. Dungeon Game 62. House Robber III (tree DP) 63. Binary Tree Cameras 64. Distribute Coins in Binary Tree 65. Partition to K Equal Sum Subsets

**Tier C (66–100)**
66. Shortest Path Visiting All Nodes (bitmask) 67. Travelling Salesman (bitmask) 68. Number of Ways to Wear Different Hats 69. Minimum Number of Refueling Stops 70. Frog Jump 71. Frog Jump with K Distances 72. Ninja's Training 73. Count Square Submatrices with All Ones 74. Count Number of Teams 75. Ones and Zeroes 76. Last Stone Weight II 77. Tallest Billboard 78. Profitable Schemes 79. Knight Probability in Chessboard 80. Out of Boundary Paths 81. Number of Dice Rolls With Target Sum 82. Domino and Tromino Tiling 83. Stone Game I/II/III 84. Predict the Winner 85. Minimum Falling Path Sum II 86. Best Team With No Conflicts 87. Maximum Profit in Job Scheduling 88. Constrained Subsequence Sum 89. Filling Bookcase Shelves 90. Scramble String 91. Count Different Palindromic Subsequences 92. Digit DP: Numbers At Most N Given Digit Set 93. Digit DP: Count Numbers with Unique Digits 94. Paint House I/II 95. Paint Fence 96. Decode Ways II 97. Student Attendance Record II 98. Champagne Tower 99. Maximum Sum of 3 Non-Overlapping Subarrays 100. Minimum Difficulty of a Job Schedule

---

## 6.4 TOP 50 — TREES & BST

1. Maximum Depth of Binary Tree 2. Same Tree 3. Invert Binary Tree 4. Symmetric Tree 5. Diameter of Binary Tree 6. Balanced Binary Tree 7. Path Sum 8. Path Sum II 9. Path Sum III 10. Binary Tree Level Order Traversal 11. Zigzag Level Order Traversal 12. Right Side View 13. Binary Tree Inorder Traversal (iterative) 14. Preorder Traversal (iterative) 15. Postorder Traversal (iterative) 16. Morris Inorder Traversal 17. Lowest Common Ancestor of a Binary Tree 18. Binary Tree Maximum Path Sum 19. Serialize and Deserialize Binary Tree 20. Construct Binary Tree from Preorder and Inorder 21. Construct Binary Tree from Inorder and Postorder 22. Flatten Binary Tree to Linked List 23. Populating Next Right Pointers 24. Vertical Order Traversal 25. Top View / Bottom View of Binary Tree 26. All Nodes Distance K in Binary Tree 27. Burning Tree / Minimum Time to Burn 28. Count Complete Tree Nodes 29. Sum Root to Leaf Numbers 30. Subtree of Another Tree 31. Merge Two Binary Trees 32. Binary Tree Paths 33. Maximum Width of Binary Tree 34. Boundary Traversal of Binary Tree 35. Children Sum Property 36. Validate Binary Search Tree 37. Search in a BST 38. Insert into a BST 39. Delete Node in a BST 40. Kth Smallest Element in a BST 41. Lowest Common Ancestor of a BST 42. Convert Sorted Array to BST 43. BST Iterator 44. Two Sum IV — Input is a BST 45. Recover Binary Search Tree 46. Inorder Successor/Predecessor in BST 47. Floor and Ceil in BST 48. Range Sum of BST 49. Largest BST Subtree 50. Construct BST from Preorder Traversal

---

## 6.5 TOP 50 — SQL

**Tier A (1–20) — near-guaranteed**
1. Second/Nth highest salary (3 approaches) 2. Nth highest salary per department 3. Employees earning more than their manager 4. Department-wise highest salary 5. Find duplicate emails/rows 6. Delete duplicate rows keeping one 7. Customers who never ordered (LEFT JOIN + IS NULL) 8. Employees with no manager 9. Count employees per department including zero-employee departments 10. Difference between RANK, DENSE_RANK, ROW_NUMBER (with output) 11. Top N records per group 12. Running total of sales 13. Moving average over 3 rows 14. Month-over-month growth % (LAG) 15. Consecutive available seats / 3 consecutive records 16. Rising temperature (compare with previous day) 17. Pivot rows into columns using CASE 18. Employees in the same department with the same salary (self join) 19. Total revenue per category with HAVING filter 20. WHERE vs HAVING demonstration

**Tier B (21–40)**
21. Median salary without a MEDIAN function 22. Cumulative distinct user count 23. Gaps and islands — find consecutive ID ranges 24. Second most recent order per customer 25. Customer retention / cohort (active in month 1 and month 2) 26. Recursive CTE for manager hierarchy 27. Recursive CTE to generate a date series 28. Users active on N consecutive days 29. Percentage of total per group (window SUM) 30. Rank with ties handled correctly 31. First and last order date per customer 32. Products never sold 33. Orders placed in the last 7 days 34. First/last day of month calculations 35. Find the department with the highest average salary 36. Swap two column values without a temp table 37. Employees whose name starts/ends with a pattern 38. NULL handling: COALESCE/NULLIF/IS NULL vs = NULL 39. UNION vs UNION ALL with duplicates 40. Correlated subquery vs JOIN — same result, compare plans

**Tier C (41–50) — theory & optimisation**
41. Explain the execution order of a SQL query (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT) 42. Why does `WHERE YEAR(date)=2024` not use an index? 43. Clustered vs non-clustered index — with an example query 44. Composite index leftmost-prefix rule — which queries hit it? 45. When would you denormalize? 46. DELETE vs TRUNCATE vs DROP 47. What is a covering index? 48. How would you debug a slow query? (EXPLAIN walkthrough) 49. IN vs EXISTS — behaviour with NULLs and performance 50. Design a schema for [ride booking / e-commerce / library] and write 3 queries on it

---
## 6.6 TOP 100 — OPERATING SYSTEMS

**Tier A (1–35) — asked most often**
1. What is an operating system and what are its functions? 2. Process vs thread 3. What is shared between threads of a process? 4. What is a PCB and what does it store? 5. Process states and transitions 6. What happens during a context switch, and what does it cost? 7. What does `fork()` return? Output of `fork(); fork();` 8. Zombie vs orphan process 9. `fork()` vs `exec()` vs `wait()` vs `vfork()` 10. User mode vs kernel mode; what is a system call? 11. Multiprogramming vs multitasking vs multiprocessing vs multithreading 12. Concurrency vs parallelism 13. What is a race condition? Give an example 14. What is a critical section; the 3 requirements of a solution 15. Mutex vs semaphore (ownership!) 16. Binary semaphore vs counting semaphore 17. What is a spinlock; when is it better than a mutex? 18. What is a monitor / condition variable? 19. Solve producer-consumer with semaphores 20. Solve reader-writer 21. Dining philosophers problem and a deadlock-free solution 22. Four necessary conditions for deadlock 23. Deadlock prevention vs avoidance vs detection vs recovery 24. Banker's algorithm — run it on a given matrix 25. Deadlock vs starvation vs livelock 26. CPU scheduling algorithms — list and compare 27. Compute AWT/ATAT/response time for a given process table (FCFS/SJF/SRTF/RR/Priority) 28. Preemptive vs non-preemptive scheduling 29. Convoy effect; starvation; aging 30. What is paging? Page table, frame, page size trade-off 31. Paging vs segmentation 32. What is virtual memory and why do we need it? 33. What is a TLB? Compute EAT with a hit ratio 34. Step-by-step: what happens on a page fault? 35. Page replacement algorithms — FIFO, LRU, Optimal, Clock; simulate on a reference string

**Tier B (36–70)**
36. Belady's anomaly — which algorithms suffer? 37. Thrashing — cause and cure; working set model 38. Demand paging vs pre-paging 39. Internal vs external fragmentation 40. First fit vs best fit vs worst fit 41. Compaction 42. Multi-level page tables — why? 43. Inverted page table 44. Logical vs physical address; role of MMU 45. Swapping 46. Memory hierarchy and locality of reference 47. Cache: write-through vs write-back; cache line; cache miss types 48. Thread models: 1:1, M:1, M:N 49. User-level vs kernel-level threads 50. Why use a thread pool? 51. What is a daemon process? 52. IPC mechanisms — pipes, named pipes, shared memory, message queues, sockets, signals 53. Which IPC is fastest and why? 54. What is a signal; how are signals handled? 55. Interrupt vs polling; what is an ISR? 56. What is DMA and what problem does it solve? 57. Disk scheduling — FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK; compute head movement 58. File system: inode, superblock, directory structure 59. Contiguous vs linked vs indexed file allocation 60. Hard link vs soft link 61. What is journaling in a file system? 62. File descriptors; what are 0, 1, 2? 63. RAID levels (0, 1, 5, 10) 64. What is a bootloader; the boot sequence 65. Kernel types: monolithic vs microkernel vs hybrid 66. What is a real-time OS; hard vs soft real time 67. Priority inversion and priority inheritance 68. What is a system's "process scheduler queue" structure — MLQ vs MLFQ 69. Round Robin: how do you choose the time quantum? 70. What is starvation-free scheduling?

**Tier C (71–100)**
71. `malloc` vs `calloc` vs `realloc`; where does memory come from? 72. Stack vs heap memory 73. Memory leak — how to detect one? 74. Segmentation fault — common causes 75. What is copy-on-write? 76. What is `mmap`? 77. Kernel preemption 78. Semaphore implementation (wait/signal with atomicity) 79. Test-and-set / compare-and-swap instructions 80. Peterson's solution — does it work on modern CPUs? 81. Busy waiting — why is it bad? 82. What is a context switch between threads vs processes — which is cheaper? 83. Amdahl's law 84. Little's law (rare, but nice) 85. What is virtualization; hypervisor types 86. Container vs virtual machine 87. What is a shell; what does it do? 88. Process synchronization in a multicore system — memory barriers (awareness) 89. Deadlock in a database vs OS — differences 90. What is `nice` value / process priority? 91. What is a critical-section-free algorithm (lock-free)? 92. What are the differences between `sleep()` and `wait()`? 93. What is a mutex deadlock and how do you avoid it (lock ordering)? 94. Explain the dining philosophers deadlock in terms of the 4 conditions 95. What is CPU-bound vs I/O-bound process, and how does it affect scheduling? 96. What is a page table entry's contents (valid bit, dirty bit, reference bit)? 97. What is a dirty bit used for? 98. What is a working set and how is it measured? 99. Explain how a `printf` reaches the screen (user → libc → syscall → kernel → driver) 100. If your program is slow, how would you determine whether it's CPU, memory, disk, or network bound?

---

## 6.7 TOP 100 — DBMS

**Tier A (1–35)**
1. What is a DBMS; DBMS vs RDBMS vs file system 2. What are the levels of data abstraction (physical/logical/view)? 3. Explain the ER model: entity, attribute, relationship 4. Types of keys: super, candidate, primary, alternate, composite, foreign, surrogate 5. What is referential integrity; ON DELETE CASCADE 6. DDL vs DML vs DCL vs TCL 7. DELETE vs TRUNCATE vs DROP 8. What is a functional dependency? Compute the closure of an attribute set 9. Find all candidate keys given a set of FDs 10. 1NF, 2NF, 3NF, BCNF with examples 11. Normalize a given table to 3NF 12. What is the difference between 3NF and BCNF? 13. What is denormalization and when is it justified? 14. Types of JOIN with example output rows 15. INNER JOIN vs LEFT JOIN — show the difference on sample data 16. Self join — a real use case 17. UNION vs UNION ALL 18. What is a view; is it updatable; materialized view 19. What is an index; how does it speed up reads? 20. B-tree vs B+ tree — why do databases use B+ trees? 21. Clustered vs non-clustered index; how many clustered indexes per table? 22. When does an index hurt performance? 23. Composite index and the leftmost-prefix rule 24. What is a covering index? 25. What are ACID properties — explain each with a bank transfer 26. What is a transaction; COMMIT, ROLLBACK, SAVEPOINT 27. Concurrency anomalies: dirty read, non-repeatable read, phantom read, lost update 28. The four isolation levels and which anomalies each prevents (reproduce the grid) 29. What is two-phase locking; strict 2PL 30. Shared vs exclusive locks 31. Deadlock in a database — detection (wait-for graph) and resolution 32. What is MVCC and which databases use it? 33. Optimistic vs pessimistic concurrency control 34. SQL vs NoSQL — when do you choose which? 35. What is the CAP theorem; give an example system for each pair

**Tier B (36–70)**
36. What is PACELC? 37. Types of NoSQL databases with an example each 38. What is sharding; horizontal vs vertical partitioning 39. What is consistent hashing and what problem does it solve? 40. Replication: master-slave vs master-master; sync vs async 41. What is replication lag and how do you handle reads? 42. What is a stored procedure; advantages and disadvantages 43. What is a trigger; when would you avoid triggers? 44. What is a cursor? 45. Conflict serializability; draw a precedence graph 46. Recoverable vs cascadeless schedules 47. What is the WAL (write-ahead log) and why does it exist? 48. What is a checkpoint in recovery? 49. Explain the query execution pipeline (parse → optimise → execute) 50. How do you read an EXPLAIN plan? 51. What is a table scan vs index seek? 52. What is the N+1 query problem? 53. How would you optimise a slow query? (a systematic list) 54. Primary key vs unique key (NULLs!) 55. `CHAR` vs `VARCHAR` 56. `NULL` semantics: why `NULL = NULL` is not true 57. `COUNT(*)` vs `COUNT(column)` 58. `WHERE` vs `HAVING` 59. Execution order of a SQL query's clauses 60. Aggregate functions and GROUP BY rules 61. Window functions — what problem do they solve that GROUP BY can't? 62. RANK vs DENSE_RANK vs ROW_NUMBER 63. CTE vs subquery vs temp table 64. Recursive CTE — a use case 65. IN vs EXISTS vs JOIN 66. Correlated vs non-correlated subquery 67. What is a schema; star vs snowflake schema (OLAP) 68. OLTP vs OLAP 69. Data warehouse vs data lake (awareness) 70. What is an ORM and what are its pitfalls?

**Tier C (71–100)**
71. Design a schema for a library / e-commerce / ride-hailing app 72. How would you model a many-to-many relationship? 73. How would you store hierarchical data in SQL? 74. Soft delete vs hard delete 75. How do you handle schema migrations safely in production? 76. What is connection pooling and why does it matter? 77. What is a hot partition and how do you avoid it? 78. What is eventual consistency; give an example 79. Quorum reads/writes (R + W > N) 80. What is a distributed transaction; two-phase commit and its problems 81. What is the saga pattern? 82. What is idempotency in the context of a database write? 83. Optimistic locking with a version column 84. How would you implement a unique constraint across shards? 85. LSM tree vs B-tree storage engines 86. What is a bloom filter and where is it used in databases? 87. What is a buffer pool / page cache? 88. What is database partitioning by range vs hash vs list? 89. Read replicas — what are the consistency implications? 90. How does an index affect INSERT/UPDATE/DELETE? 91. What is a full-text index? 92. What is a materialized view refresh strategy? 93. How do you prevent SQL injection? 94. What are prepared statements? 95. What is the difference between a database, a schema, and a table? 96. What is normalization's effect on read vs write performance? 97. How do you count rows in a very large table efficiently? 98. How do you paginate efficiently at scale (keyset vs OFFSET)? 99. Two users book the last seat simultaneously — how do you prevent double booking? 100. How would you design an audit log table?

---

## 6.8 TOP 100 — COMPUTER NETWORKS

**Tier A (1–35)**
1. **What happens when you type a URL in a browser and press Enter?** (full end-to-end) 2. OSI model — 7 layers and what each does 3. TCP/IP model vs OSI — mapping 4. Which protocols live at which layer? 5. What is encapsulation; PDU names per layer 6. TCP vs UDP — full comparison 7. TCP three-way handshake — why three and not two? 8. TCP four-way termination; what is TIME_WAIT and why? 9. Flow control vs congestion control 10. TCP congestion control: slow start, congestion avoidance, fast retransmit, fast recovery 11. Sliding window protocol 12. Stop-and-Wait vs Go-Back-N vs Selective Repeat 13. What is DNS; explain the resolution process 14. DNS record types: A, AAAA, CNAME, MX, NS, TXT, PTR 15. Why is DNS mostly UDP; when does it use TCP? 16. What is DHCP; explain DORA 17. What is ARP and where does it fit? 18. HTTP methods and their idempotency/safety 19. HTTP status codes — 2xx, 3xx, 4xx, 5xx; 301 vs 302; 401 vs 403 20. HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) 21. What makes HTTPS secure; the TLS handshake step by step 22. Symmetric vs asymmetric encryption; why does TLS use both? 23. What is a digital certificate; role of a CA; chain of trust 24. Cookies vs sessions vs JWT 25. Cookie attributes: HttpOnly, Secure, SameSite 26. What is CORS and why does it exist? 27. CSRF and XSS — what they are and how to prevent them 28. IPv4 addressing, classes, private ranges 29. Subnetting — given a CIDR, compute network/broadcast/host range 30. What is NAT and why is it needed? 31. IPv4 vs IPv6 32. Router vs switch vs hub vs bridge 33. What is a MAC address vs IP address; why do we need both? 34. Collision domain vs broadcast domain 35. What is a socket; how does a client-server connection work?

**Tier B (36–70)**
36. Statelessness of HTTP — how do we maintain state? 37. What is a load balancer; L4 vs L7 38. Load balancing algorithms: round robin, least connections, IP hash, weighted 39. What is sticky session? 40. What is a reverse proxy vs forward proxy 41. What is a CDN and how does it speed things up? 42. Cache-Control, ETag, Last-Modified headers 43. WebSockets vs long polling vs SSE 44. The WebSocket upgrade handshake 45. What is REST; the constraints of a RESTful API 46. REST vs gRPC vs GraphQL 47. What is an API gateway? 48. Idempotent API design; idempotency keys 49. Rate limiting — algorithms and where to apply them 50. What is a port; well-known ports (80, 443, 22, 21, 25, 53, 3306, 5432, 6379, 27017) 51. What is a firewall; stateful vs stateless 52. What is a VPN 53. Symmetric key exchange problem; Diffie-Hellman idea 54. Hashing vs encryption vs encoding 55. What is a MITM attack and how does TLS prevent it? 56. What is a DDoS attack; mitigation strategies 57. Routing algorithms: distance vector vs link state 58. RIP vs OSPF vs BGP — one line each 59. What is a routing table; default gateway 60. ICMP and how `ping` and `traceroute` work 61. What is MTU and fragmentation? 62. Error detection: parity, checksum, CRC 63. Hamming code / Hamming distance 64. CSMA/CD and CSMA/CA 65. Ethernet frame structure 66. VLANs — what problem do they solve? 67. What is a proxy cache? 68. SMTP, IMAP, POP3 — differences 69. FTP vs SFTP vs FTPS 70. SSH — how does key-based auth work?

**Tier C (71–100)**
71. Throughput vs bandwidth vs latency vs jitter 72. What is RTT; how is it measured? 73. Bandwidth-delay product 74. Compute transmission time / propagation delay for a given link 75. What is head-of-line blocking; how does HTTP/2 and then HTTP/3 address it? 76. Why is QUIC built on UDP? 77. TCP keep-alive vs HTTP keep-alive 78. Nagle's algorithm and when you'd disable it 79. What is TCP slow start restart? 80. Explain SYN flood and SYN cookies 81. What is a socket's 4-tuple? 82. How does a server handle thousands of concurrent connections (select/poll/epoll)? 83. Blocking vs non-blocking I/O 84. What is DNS caching and TTL; negative caching 85. What is a CNAME flattening / apex domain problem? 86. GeoDNS and anycast 87. What is TLS session resumption? 88. What is HSTS? 89. What is certificate pinning? 90. What is OAuth 2.0; authorization code flow 91. Authentication vs authorization 92. What is a JWT's structure; how do you invalidate one? 93. Public key infrastructure basics 94. How would you debug "the website is slow" as a network problem? 95. How would you debug "connection refused" vs "connection timed out"? 96. What happens if the DNS server is down but the IP is cached? 97. Why can two applications not bind to the same port? 98. What is port forwarding? 99. How do WebSockets scale across multiple servers? 100. Explain the full network path of a REST API call from a mobile app to a database and back

---

## 6.9 TOP 100 — OOP & JAVA CORE

**Tier A (1–35)**
1. What is OOP and why does it exist? 2. Four pillars — define each with your own Java code 3. Abstraction vs encapsulation — the precise difference 4. Class vs object vs instance 5. Access modifiers: public, protected, default (package-private), private — reproduce the table 6. What is inheritance; types of inheritance in Java 7. **Why does Java not support multiple inheritance of classes?** The diamond problem 8. How do Java 8 `default` methods reintroduce the diamond problem, and how is it resolved? 9. Compile-time vs runtime polymorphism 10. Method overloading rules — can return type alone overload? 11. Method overriding rules (signature, covariant return, access, checked exceptions) 12. Overloading vs overriding vs **method hiding** (static methods) 13. Can you override a static method? A private method? A final method? 14. **Interface vs abstract class** (post-Java-8 answer) 15. Can an interface have a constructor? Instance variables? 16. What is `super` and `this`; constructor chaining with `this()` and `super()` 17. Order of initialisation: static block → instance block → constructor 18. Can a constructor be private? (Yes — Singleton, factory) 19. **`equals()` and `hashCode()` contract** — what breaks if you violate it 20. Write a correct `equals`/`hashCode` for a `Point` class 21. **Is Java pass-by-value or pass-by-reference?** Prove it 22. `==` vs `.equals()` for objects and Strings 23. **Integer caching** (−128..127) — why `a == b` flips at 128 24. Why are Strings immutable in Java? 25. String pool — `new String("a")` vs `"a"` 26. `String` vs `StringBuilder` vs `StringBuffer` 27. How do you write an immutable class? 28. `final`, `finally`, `finalize` 29. `static` variables, methods, blocks, nested classes 30. Checked vs unchecked exceptions; the exception hierarchy 31. `try-with-resources`; when does `finally` not execute? 32. `Comparable` vs `Comparator` 33. SOLID — each principle with a violation and a fix 34. Composition over inheritance — why, with an example 35. What is a design pattern; the three categories

**Tier B (36–70)**
36. Singleton — 5 implementations (eager, lazy, synchronized, double-checked locking with `volatile`, enum, static holder); which is best and why 37. Factory vs Abstract Factory vs Builder 38. Strategy pattern — implement it in Java 39. Observer pattern — implement it 40. Decorator pattern — and where the JDK uses it (`InputStream`) 41. Adapter vs Facade 42. Command pattern and undo 43. State pattern (vending machine / order lifecycle) 44. Template Method vs Strategy 45. Chain of Responsibility (servlet filters) 46. Proxy pattern; dynamic proxies in Java 47. Iterator pattern; `Iterable`/`Iterator`; fail-fast vs fail-safe iterators 48. Flyweight — where the JDK uses it (Integer cache, String pool) 49. Dependency Injection and Inversion of Control 50. MVC / layered architecture 51. **How does `HashMap` work internally?** (buckets, hash, collisions, treeify at 8, load factor 0.75, resize) 52. `HashMap` vs `TreeMap` vs `LinkedHashMap` 53. `HashSet` vs `TreeSet` vs `LinkedHashSet` 54. `ArrayList` vs `LinkedList` — when each wins 55. `ArrayList` vs `Vector`; `Stack` vs `ArrayDeque` 56. `ConcurrentModificationException` — cause and fix 57. `Arrays.sort` internals: dual-pivot Quicksort vs TimSort; which is stable 58. What is `Collections.unmodifiableList` vs `List.of` 59. Generics: generic class/method, bounded types 60. Wildcards and **PECS** 61. **Type erasure** and its consequences (`new T[]`, `instanceof List<String>`) 62. Autoboxing/unboxing and its performance and NPE risks 63. Inner class vs static nested vs local vs anonymous class 64. Lambdas and functional interfaces; `@FunctionalInterface` 65. Method references; `Optional` — proper use and misuse 66. Streams: intermediate vs terminal operations, laziness 67. JVM vs JRE vs JDK; how Java achieves platform independence 68. **Heap vs stack vs metaspace**; what lives where 69. **Garbage collection** — mark-and-sweep, generational GC, when is an object eligible, can you force GC 70. Memory leaks in Java — how do they happen despite GC?

**Tier C (71–100)**
71. `synchronized` method vs block; what object is locked 72. `volatile` — what guarantee does it give (and not give)? 73. `synchronized` vs `volatile` vs `AtomicInteger` 74. `Thread` vs `Runnable` vs `Callable`; `ExecutorService` and thread pools 75. Thread lifecycle states 76. What causes a deadlock in Java code; how do you prevent it (lock ordering)? 77. `wait()`/`notify()` vs `sleep()` — which releases the lock? 78. Producer-consumer using `BlockingQueue` 79. `ConcurrentHashMap` — how is it thread-safe without locking the whole map? 80. Write a thread-safe Singleton and explain the `volatile` 81. Design an immutable class with a mutable field (defensive copying) 82. **Implement an LRU cache** — `LinkedHashMap` version *and* the manual HashMap + doubly-linked-list version 83. Implement your own `ArrayList` 84. Implement your own `HashMap` 85. Implement a generic `Pair<K,V>` / `Stack<T>` class 86. Design a class hierarchy for [vehicles / payments / notifications] 87. Design a parking-lot / library-management class model 88. Refactor a 1000-line God class — what's your approach? 89. How do you unit test a class with dependencies (mocking, DI)? 90. What is an anti-pattern? Name three 91. `clone()` — shallow vs deep; why is `Cloneable` criticised? 92. Marker interfaces — `Serializable`, `Cloneable`; what is serialization and `serialVersionUID`? 93. `transient` and `static` fields during serialization 94. Covariant return types 95. Can you reduce visibility when overriding? 96. What is a covariant array and why is `Object[] a = new String[1]` dangerous? 97. Upcasting vs downcasting; `ClassCastException`; `instanceof` 98. Where did you use inheritance in your project — would composition have been better? 99. Explain the Open-Closed Principle using a change you actually made in your project 100. Walk me through your project's class design and defend one decision you'd now do differently

---

## 6.10 TOP 50 — HR & BEHAVIOURAL

**Tier A (1–20) — will almost certainly be asked**
1. Tell me about yourself 2. Why do you want to join our company? 3. Why software engineering / this role? 4. Walk me through your resume 5. Tell me about your best project 6. What was the biggest technical challenge you faced and how did you solve it? 7. What are your strengths (with evidence)? 8. What is your greatest weakness (and what are you doing about it)? 9. Where do you see yourself in 5 years? 10. Why should we hire you? 11. Tell me about a time you failed 12. Tell me about a conflict with a teammate and how you resolved it 13. Tell me about a time you led a team or took ownership 14. Tell me about a time you had to learn something quickly 15. Tell me about a time you missed a deadline or made a mistake 16. How do you handle criticism/feedback? 17. How do you prioritise when everything is urgent? 18. What do you do when you're stuck on a problem? 19. Do you have any questions for us? 20. Are you comfortable relocating / with our bond & policies?

**Tier B (21–40)**
21. Describe a time you disagreed with a decision — what did you do? 22. A time you influenced someone without authority 23. A time you went beyond what was asked 24. A time you had to make a decision with incomplete information 25. A time you had conflicting priorities 26. A time you helped a struggling teammate 27. A time you received difficult feedback and acted on it 28. A time you simplified something complex 29. A time you disagreed with your manager/professor 30. A time you took a risk 31. How do you keep learning? What did you learn last month? 32. What's the last technical thing you read that excited you? 33. What's your biggest achievement so far? 34. How do you work in a team vs alone? 35. Describe your ideal work environment/manager 36. What motivates you? 37. How do you handle pressure and long hours? 38. What would your friends/teammates say about you? 39. What do you know about our products/business? 40. What other companies are you interviewing with? (answer honestly and briefly)

**Tier C (41–50) — situational & closing**
41. Your teammate isn't contributing before a deadline — what do you do? 42. You find a critical bug the day before release — what do you do? 43. You disagree with the approach your senior chose — what do you do? 44. You're given a task with unclear requirements — what do you do? 45. You realise you cannot meet a committed deadline — what do you do? 46. A user reports a bug you cannot reproduce — how do you proceed? 47. How would you onboard yourself into a large unfamiliar codebase? 48. What are your salary expectations? (for freshers: "I'm aligned with the standard package for this role") 49. Do you plan to pursue higher studies? (answer honestly) 50. Is there anything else you'd like us to know?

---
# PART 7 — MOCK INTERVIEW SCHEDULE

## When to start
**Self-mocks (recorded): Day 14.** You need ~2 weeks of substance before speaking practice is useful, but not more — most students delay mocks until week 6 and then discover they cannot speak and code simultaneously. That discovery must happen on Day 14, not Day 50.
**Peer mocks: Day 21.** **Platform/stranger mocks: Day 28.** **Full-loop simulations: Day 53 and Day 58.**

## The schedule (13 mocks minimum)
| # | Day | Type | Format | Focus |
|---|---|---|---|---|
| 1 | 14 | **Self-mock** (recorded) | 2 mediums, camera on, speak continuously | Can you narrate while coding at all? |
| 2 | 21 | **Peer mock** | 45 min each way | Structured approach: clarify → examples → brute → optimise → code → test |
| 3 | 28 | **Technical (peer/platform)** | 45 min | Trees + 5 rapid CS-fundamentals questions |
| 4 | 35 | **Technical (recorded)** | 45 min | Graphs — a hard problem, spoken end to end |
| 5 | 42 | **LLD mock** | 45 min | "Design a parking lot" with the full framework |
| 6 | 49 | **Behavioural mock** | 45 min | TMAY + 6 STAR + your questions |
| 7 | 53 | **Full loop R1** | 45 min | 2 problems, timed, stranger if possible |
| 8 | 53 | **Full loop R2** | 45 min | 1 hard + CS rapid-fire, back-to-back with R1 |
| 9 | 56 | **Design mock** | 45 min | LLD *or* HLD depending on target companies |
| 10 | 58 | **Full loop R1** | 45 min | Hard DSA |
| 11 | 58 | **Full loop R2** | 45 min | Medium DSA + deep follow-ups |
| 12 | 58 | **Full loop R3** | 45 min | CS fundamentals + project deep dive |
| 13 | 58 | **HR round** | 30 min | Behavioural + closing |

**Plus 8 Mock OAs** (Days 7, 14, 21, 28, 35, 42, 49, 53) — 90–120 min each, contest conditions.

## Types explained
- **Self-mock (free, do 1/week from Day 15):** Pick a random problem, set a 40-min timer, record your screen + audio, solve out loud as if an interviewer were there. Then *watch it*. This is uncomfortable and it is the fastest single improvement available to you.
- **Peer mock (highest ROI):** Find one serious partner. Alternate interviewer/candidate. The interviewer must not help for the first 10 minutes and must ask "why?" at least three times. Written feedback on a fixed rubric each time.
- **Platform mock:** Pramp / interviewing.io free tier — value comes from the *stranger* factor. Do at least 3.
- **Behavioural mock:** Have your partner ask STAR questions and interrupt with follow-ups ("what data did you use?", "what would you do differently?"). Amazon-style probing.
- **Design mock:** Whiteboard or a shared doc. Timebox: 5 min requirements, 5 min high-level, 20 min deep dive, 10 min trade-offs.

## The rubric to score every mock (1–5 each)
| Dimension | What a 5 looks like |
|---|---|
| Clarifying questions | Asks about input size, types, duplicates, edge cases *before* coding |
| Approach articulation | States brute force, then optimises, and explains *why* the optimisation works |
| Communication | Continuous, no silent gaps >20 s, thinks aloud without rambling |
| Code quality | Meaningful names, no magic numbers, functions where useful, compiles first try |
| Complexity analysis | Correct time *and* space, stated without being asked |
| Testing / dry run | Walks through an example line by line, checks edge cases unprompted |
| Handling hints | Takes a hint gracefully and builds on it instead of resisting or freezing |
| Follow-up handling | Answers "what if the input doesn't fit in memory / is streaming / is sorted?" |

Score below 3 on any dimension twice in a row → that becomes the focus of the next week's evening blocks.

---

# PART 8 — FINAL PLACEMENT CHECKLIST

## A. DSA readiness
- [ ] ~700 problems solved and logged with pattern tags
- [ ] Can solve a random LeetCode Medium unaided in ≤25 minutes, 8 times out of 10
- [ ] Can name the pattern of any problem within 60 seconds of reading it
- [ ] All 12 DP families: can name each + one problem + the recurrence
- [ ] Graphs: BFS, DFS, topo (both ways), DSU, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim — all written from memory
- [ ] Trees: all traversals recursive + iterative + Morris; LCA; serialize/deserialize
- [ ] LRU Cache written from a blank file in ≤12 minutes
- [ ] Binary search template + BS-on-answer recognised instantly
- [ ] Monotonic stack: all 4 variants
- [ ] Redo List empty or fewer than 10 items
- [ ] Weakness sheet addressed

## B. Language
- [ ] Java Collections complexity table reproducible from memory (incl. `PriorityQueue` = min-heap, `TreeMap` navigation methods)
- [ ] `Comparator.comparingInt().thenComparing()`, `PriorityQueue` comparators, `computeIfAbsent`, `merge` — no hesitation
- [ ] Can explain: `HashMap` internals, `equals`/`hashCode` contract, string pool & immutability, pass-by-value, GC, `synchronized` vs `volatile`
- [ ] Fast I/O template (`BufferedReader` + `StringTokenizer` + `StringBuilder`) typed from memory; never reaching for `Scanner` on large input

## C. Core CS
- [ ] OS: one-page sheet written; can compute AWT, EAT, page faults, Banker's
- [ ] DBMS: normalization by hand, isolation grid from memory, indexing Q&A
- [ ] SQL: all 20 archetypes writable blind; window functions fluent
- [ ] CN: the URL question end-to-end in 3 minutes; TCP/UDP; DNS; HTTPS; status codes
- [ ] OOP: 4 pillars with your own code, SOLID with a real violation+fix, 12 patterns

## D. Design
- [ ] 12 design patterns: can name, explain, and code a minimal example of each
- [ ] 5 LLD problems designed end-to-end (Parking Lot, Elevator, Splitwise, BookMyShow, Tic-Tac-Toe)
- [ ] UML class diagram drawable in 3 minutes
- [ ] HLD vocabulary solid; URL shortener + rate limiter + chat designed once each
- [ ] "How would you scale my project to 1M users?" — a rehearsed 5-minute answer

## E. Resume & profile
- [ ] Exactly one page, PDF, ATS-parseable (plain-text test passed)
- [ ] Every bullet: action verb + tech + measurable impact
- [ ] Zero claims you cannot defend for 5 minutes
- [ ] No typos (read it backwards; have two people proofread)
- [ ] GitHub: pinned repos, real READMEs, clean commits, no secrets
- [ ] LinkedIn: headline, about, projects, skills, open-to-work on
- [ ] 5 printed copies + the PDF on your phone and in your email drafts

## F. Projects
- [ ] 2 strong projects, both deployed or runnable in one command
- [ ] Architecture diagram drawable from memory for each
- [ ] 90-second pitch rehearsed and timed for each
- [ ] Answers ready: why this stack, hardest bug, schema + indexes, concurrency, scaling, what I'd change
- [ ] Honest about what you personally wrote

## G. Behavioural
- [ ] "Tell me about yourself" — 90 seconds, natural, rehearsed 10+ times
- [ ] 8 STAR stories written and rehearsed
- [ ] Amazon LP mapping table done (if Amazon is on your list)
- [ ] 3 questions prepared to ask interviewers
- [ ] Company research done for your top 8 target companies

## H. Process & logistics
- [ ] 8 mock OAs and 13 mock interviews completed
- [ ] OA protocol memorised (read all → rank → constraints → time-box → test)
- [ ] Laptop, charger, backup internet (hotspot), quiet room, webcam, ID proof
- [ ] Coding platform accounts tested; IDE/compiler configured; keyboard familiar
- [ ] Placement portal profile complete; eligibility criteria checked; deadlines calendared
- [ ] Seniors consulted for last year's actual process for your top companies
- [ ] Sleep schedule aligned with typical interview times (many are 9–11 am)

---
# PART 9 — THE 100 MISTAKES (and the fix for each)

## A. Planning & strategy (1–14)
1. **Collecting roadmaps instead of following one.** → Pick this one. Close the tabs. Re-plan only on Consolidation Days.
2. **Starting over from scratch every month.** → Never restart; patch gaps in place.
3. **No written plan for the day.** → Write tomorrow's four blocks the night before.
4. **Studying by mood — only the topics you enjoy.** → The topic you avoid is the topic to schedule first tomorrow.
5. **Ignoring the tier list and spending days on segment trees.** → Tier 1 to 90% before any Tier 3 topic.
6. **Prepping for companies that don't visit your campus.** → Ask seniors/placement cell for the actual list; weight your plan to it.
7. **Believing 3 months of light prep beats 2 months of intense prep.** → Intensity + consistency beats duration.
8. **No tracking sheet.** → You cannot fix what you don't measure. Build the tracker on Day 1.
9. **Not measuring "solved unaided" vs "solved after looking".** → Track it. That ratio *is* your readiness.
10. **Never revising.** → 30% of your time is revision. Spaced repetition at +3, +10, +30 days.
11. **Leaving CS theory for the last week.** → It's evening blocks from Day 8. Cramming 4 subjects in 5 days fails.
12. **Leaving the resume for the last week.** → Resume v1 on Day 1. It gates everything.
13. **No mock interviews until the end.** → First self-mock Day 14, and weekly thereafter.
14. **Not asking seniors what actually happened last year.** → 30 minutes with a placed senior is worth 10 hours of guessing.

## B. Learning DSA (15–34)
15. **Watching solutions instead of attempting.** → 25 minutes of honest attempt before any editorial. Always.
16. **Reading the editorial and feeling you "understood" it.** → Understanding ≠ ability. Close it, re-solve from blank in a fresh file.
17. **Never re-solving failed problems.** → The Redo List is the mechanism. Non-negotiable.
18. **Chasing problem count over patterns.** → Tag every problem with its pattern. 750 tagged > 1500 untagged.
19. **Solving only Easy because it feels productive.** → Your ratio should trend to 20% E / 65% M / 15% H by Week 4.
20. **Solving only Hard to feel elite.** → Interviews are mostly Mediums. Master Mediums.
21. **Random problem selection.** → Solve by topic in blocks, then mix in timed sets.
22. **Not writing code — only "thinking" the solution.** → Type it. Compile it. Run it. Fingers must know it.
23. **Solving on paper only.** → And solving only in an IDE with autocomplete. Do both; interviews are somewhere in between.
24. **Copy-pasting a template you don't understand.** → Derive DSU/Dijkstra/segment tree once yourself before templating.
25. **Not learning the Collections Framework properly.** → Half of your speed advantage lives here: `computeIfAbsent`, `merge`, `getOrDefault`, `ArrayDeque`, `TreeMap.floorKey/ceilingKey`, `Comparator.comparing`.
26. **Skipping complexity analysis.** → State time *and* space for every problem you solve. Out loud.
27. **Not knowing why a solution is optimal.** → "Can it be better?" — if you can't argue no, you don't own it.
28. **Ignoring constraints when choosing an approach.** → Read constraints *first*. They tell you the intended complexity.
29. **Not identifying the DP state before writing DP.** → State first, recurrence second, base case third, code fourth.
30. **Learning DP by memorising 50 solutions.** → Learn the 12 families and the 4-step method instead.
31. **Skipping graph implementation from scratch.** → Write BFS/DFS/Dijkstra/DSU by hand at least 5 times each.
32. **Avoiding recursion because it's "confusing".** → Draw recursion trees on paper for 10 problems. It stops being confusing.
33. **Never practising under a timer.** → Contests and timed sets twice a week minimum.
34. **Practising only in comfortable silence.** → Solve out loud daily from Day 15.

## C. Coding & OA execution (35–50)
35. **Starting with problem 1 by default.** → Read all problems in the first 3 minutes; rank by time÷confidence.
36. **Spending 70% of the OA on one hard problem.** → Time-box at 35% of total time, then move on.
37. **No brute force when stuck.** → A brute force earns partial credit and often reveals the pattern.
38. **Not testing edge cases before submitting.** → Empty, single element, all-same, max size, negatives, overflow.
39. **Integer overflow.** → `long` by default when values or sums can exceed ~2×10⁹ — and write `(long) a * b`, because `a * b` is computed in `int` and wraps *before* the cast.
40. **`mid = (l+r)/2` overflow.** → `l + (r-l)/2`, always.
41. **Off-by-one in loops and binary search.** → State the invariant in a comment before writing the loop.
42. **Forgetting to reset globals between test cases.** → Reset inside `solve()`, not at declaration.
43. **Wrong output format / extra whitespace / missing newline.** → Read the I/O spec twice; match it exactly.
44. **`System.out.println` inside a loop, or `Scanner` on large input.** → `BufferedReader` in, `StringBuilder` out, one `print` at the end.
45. **String concatenation with `+` inside a loop (O(n²)).** → `StringBuilder.append`, always.
46. **`Arrays.sort(int[])` TLE'd by an anti-quicksort test.** → Shuffle the array first, or box to `Integer[]` (TimSort, guaranteed O(n log n)).
47. **Recursion depth overflow on 10⁵ nodes.** → Convert to iterative or raise awareness of the limit.
48. **Not reading the problem statement fully (missing a constraint).** → Read twice. Paraphrase it in one sentence before coding.
49. **Panicking after a failed submission.** → Re-read the failing case category, fix one thing, resubmit. Don't rewrite from scratch.
50. **Poor OA environment — unstable internet, tab switching under proctoring.** → Test everything an hour before; proctoring flags = auto-reject at several companies.

## D. In the interview (51–72)
51. **Coding immediately without clarifying.** → 2–3 clarifying questions first, every time. It's a scored behaviour.
52. **Silence for minutes while thinking.** → Narrate: "I'm considering a hashmap here because…". Silence reads as being stuck.
53. **Jumping straight to the optimal without stating brute force.** → State brute force + its complexity, then optimise. It shows range.
54. **Ignoring hints.** → A hint is the interviewer helping you pass. Take it, say thanks, build on it.
55. **Arguing with the interviewer.** → Disagree once, politely, with reasoning. Then adapt.
56. **Not dry-running the code.** → Walk a small example line by line before saying "done".
57. **Saying "done" without checking edge cases.** → Null/empty, single element, duplicates, overflow, negative.
58. **Bad variable names (`a`, `x`, `temp`).** → `left`, `windowStart`, `freq`. Naming is a graded signal.
59. **Writing everything in `main`.** → Helper functions. It shows structure.
60. **Not stating time and space complexity unprompted.** → Always volunteer it.
61. **Being unable to explain your own code back.** → If you can't explain a line, don't write it.
62. **Lying about knowing a technology.** → "I haven't used that, but here's how I'd approach learning it" scores better than being caught.
63. **Being unable to defend a resume line.** → Delete anything you can't discuss for 5 minutes.
64. **Rambling.** → 90–120 seconds per behavioural answer. Then stop and let them ask.
65. **Not asking any questions at the end.** → Always have 2. It's read as disinterest otherwise.
66. **Treating HR round as a formality.** → It's a rejection filter. Prepare it like a technical round.
67. **Giving up visibly after one wrong turn.** → Recovery is scored. "That approach breaks because X, let me try Y."
68. **Not using the whiteboard/shared doc to structure thinking.** → Write the examples, the state, the steps. Visible structure = perceived competence.
69. **Ignoring the follow-up question.** → "What if the data doesn't fit in memory?" is where seniors are separated from juniors.
70. **Bad audio/video/setup in a virtual interview.** → Test the link, mic, camera, lighting, and background an hour before.
71. **Not managing time within the round.** → Aim: 5 min clarify + approach, 20 min code, 10 min test + follow-ups.
72. **Being unprepared for "why do you want to join us?"** → Two specific, researched sentences. Not "great company culture".

## E. CS theory (73–80)
73. **Memorising definitions without examples.** → One example per concept, from your own life or project.
74. **Unable to do numerical OS/DBMS problems.** → Practise AWT, EAT, page faults, Banker's, normalization, subnetting *by hand*.
75. **Ignoring CN because "it's not asked".** → It's asked at Cisco/Qualcomm/Oracle, and "what happens when you type a URL" is asked everywhere.
76. **SQL theory without writing queries.** → 50 written queries beats reading 500 pages.
77. **Not being able to reproduce the isolation-level grid.** → Write it from memory weekly.
78. **Learning OOP definitions but never writing OOP code.** → Every concept gets a code example you wrote.
79. **Not connecting theory to your project.** → "I used an index on `user_id` because…" is a much stronger answer than the textbook definition.
80. **Preparing HLD deeply for a fresher role at the cost of DP.** → Budget 25–30 hours for HLD, no more, unless targeting Uber/Atlassian/Sprinklr.

## F. Resume, GitHub & projects (81–92)
81. **A two-page resume as a fresher.** → One page. Cut ruthlessly.
82. **Photo, DOB, address, declaration, hobbies.** → Delete all of it.
83. **Fancy two-column templates that break ATS.** → Single column, standard fonts, PDF.
84. **Skill bars / "Python: 8/10".** → Group skills as plain text.
85. **Bullets with no numbers.** → Add real, honest metrics — users, latency, size, %, time saved.
86. **Listing 25 technologies.** → List what you can defend. Fewer, deeper.
87. **Typos.** → Read backwards, run a checker, get two humans to proofread.
88. **Tutorial-clone projects.** → Add one non-trivial design decision you can defend, or build something else.
89. **Projects that aren't deployed or runnable.** → Live URL or a one-command Docker run.
90. **GitHub full of only LeetCode solutions and empty repos.** → Pin your real projects; write real READMEs.
91. **Not knowing your own project's schema/architecture.** → Redraw it from memory before every interview.
92. **Claiming solo credit for a team project.** → Be precise: "I built the backend auth and the caching layer."

## G. Behavioural & mindset (93–100)
93. **No STAR structure — vague, unquantified stories.** → 8 written stories, each with a Result.
94. **Using "we" everywhere in an ownership question.** → "I" for your actions, "we" only for context.
95. **A fake weakness ("I'm a perfectionist").** → A real one + the concrete system you use to manage it.
96. **Badmouthing a teammate, professor, or previous company.** → Never. It's read as a future liability.
97. **Comparing yourself to peers daily.** → Compare yourself to your Day-1 self. Track *your* numbers.
98. **Sleeping 4 hours to grind more.** → Sleep 7. Memory consolidation is the mechanism you're relying on; sleep debt directly reduces problem-solving.
99. **No breaks, no exercise, no social contact for 60 days.** → 30 minutes of movement daily and one evening off per week. Burnout at Day 45 costs you more than the hours saved.
100. **Treating one rejection as a verdict on your ability.** → Campus placement outcomes are high-variance. Fix what the feedback says, keep the process, keep applying. Most people who get a top offer were rejected somewhere first.

---

# PART 10 — PROGRESS TRACKING & INTERVIEW READINESS SCORE

## The tracker (build this on Day 1)
| Date | Problem | Topic | Pattern | Difficulty | Time taken | Unaided? (Y/N) | Redo on | Notes |
|---|---|---|---|---|---|---|---|---|

Plus three companion sheets:
- **Redo List:** every problem you failed, with its +3/+10/+30 dates.
- **Weakness sheet:** any problem failed twice, and any topic scoring <3 in a mock.
- **Mistake log:** one line per error, categorised (pattern-unknown / implementation / misread / slow / careless). Review the tally weekly.

## Weekly Interview Readiness Score (score each 0–10, total /100)
| # | Dimension | How to score it honestly |
|---|---|---|
| 1 | **DSA breadth** | Fraction of Tier 1 topics you've covered × 10 |
| 2 | **DSA depth (unaided rate)** | % of this week's problems solved unaided ÷ 10 |
| 3 | **Speed** | Can you do a random Medium in ≤25 min? (10 = 8/10 times) |
| 4 | **Revision health** | 10 − (number of overdue Redo items ÷ 2), floored at 0 |
| 5 | **Core CS** | Self-quiz score across OS/DBMS/CN/OOP ÷ 10 |
| 6 | **SQL** | Archetypes writable blind, out of 20, ÷ 2 |
| 7 | **Design (LLD/HLD)** | Problems you can design end-to-end unaided (×2, cap 10) |
| 8 | **Communication** | Latest mock rubric average × 2 |
| 9 | **Resume & projects** | Checklist §E + §F items ticked, as a % ÷ 10 |
| 10 | **Behavioural** | STAR stories rehearsed out of 8, + TMAY polish |

**Interpretation:**
| Total | Meaning | Action |
|---|---|---|
| 0–35 | Foundation stage | Normal for Weeks 1–2. Keep executing; don't panic |
| 36–55 | Building | Normal for Weeks 3–4. Watch dimension 2 (unaided rate) |
| 56–70 | Interview-capable for mid-tier | You'd clear many OAs; interviews are hit-or-miss. Push depth + communication |
| 71–85 | Strong candidate | You'd clear most loops at most companies on this list |
| 86–100 | Top-offer ready | Focus entirely on consistency, mocks, and not getting careless |

**Expected trajectory (if you follow the plan):**
| End of week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Day 60 |
|---|---|---|---|---|---|---|---|---|---|
| Target score | 20 | 32 | 43 | 55 | 65 | 74 | 82 | 88 | 90+ |

If you're 10+ points below target two weeks running, the cause is almost always one of: not enough unaided solving, no revision, or no speaking practice. Fix that one thing rather than adding hours.

## Estimated study hours
| Block | Hours over 60 days | Share |
|---|---|---|
| DSA (new problems + patterns) | ~300 | 50% |
| Revision, Redo List, consolidation | ~90 | 15% |
| Core CS (OS/DBMS/CN/OOP) | ~65 | 11% |
| SQL | ~20 | 3% |
| LLD + HLD | ~45 | 8% |
| Projects | ~30 | 5% |
| Resume, GitHub, LinkedIn | ~12 | 2% |
| Aptitude & puzzles | ~20 | 3% |
| Mocks + behavioural + company research | ~28 | 5% |
| **Total** | **~610 hours** | 100% |

---

## FINAL WORD

Three things decide this, in order:
1. **Did you solve problems unaided, or did you read solutions?** Everything else is secondary to that ratio.
2. **Did you revise?** A topic learned in Week 2 and never revisited is gone by Week 7.
3. **Can you talk while you think?** The interview measures your ability to solve *out loud, with someone watching*. That's a separate skill from solving, and it's the one most candidates never practise.

Sixty days is enough. Not comfortably — but enough. Follow the plan, keep the Redo List honest, speak every day, and sleep.
