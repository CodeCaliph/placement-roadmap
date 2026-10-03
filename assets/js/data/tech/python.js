/* tech stack: Python — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "python",
  title: "Python",
  short: "Python",
  icon: "◈",
  blurb: "With Python on your resume, interviewers go past syntax: they check that you understand the object model (mutability, identity, references), how dicts and generators work inside, the classic traps (mutable defaults, late-binding closures, shallow copies), decorators and context managers, and when to reach for threads, processes or asyncio given the GIL.",
  topics: [
    "Data Model",
    "Functions & Scope",
    "Iteration & Control Flow",
    "OOP in Python",
    "Concurrency & Memory",
    "Tooling & Idioms"
  ],
  questions: [

    /* ───────────── Data Model ───────────── */
    {
      id: "mutable-immutable-is-vs-eq",
      q: "What is the difference between mutable and immutable objects in Python, and between is and ==?",
      topic: "Data Model",
      level: 1,
      top: true,
      short: "Every Python value is an object; variables are just names bound to objects. Immutable objects (int, float, str, tuple, frozenset, bytes) cannot change after creation, so any 'modification' builds a new object. Mutable ones (list, dict, set, most user classes) change in place, visible through every name bound to them. == compares values by calling __eq__, while is compares identity, i.e. whether two names point to the same object. Use is only for singletons like None.",
      a: [
        { p: "In Python <b>names are references</b>. <code>a = [1, 2]</code> creates a list object and binds the name <code>a</code> to it; <code>b = a</code> binds a second name to the <i>same</i> object. Whether a change is visible through both names depends on whether the object is <b>mutable</b>." },
        { table: { head: ["Immutable", "Mutable"], rows: [
          ["<code>int</code>, <code>float</code>, <code>bool</code>, <code>complex</code>, <code>str</code>, <code>bytes</code>, <code>tuple</code>, <code>frozenset</code>, <code>None</code>", "<code>list</code>, <code>dict</code>, <code>set</code>, <code>bytearray</code>, most user-defined objects"],
          ["'Changing' it rebinds the name to a <b>new</b> object", "Changed <b>in place</b>; every alias sees it"],
          ["Hashable (if contents are), so usable as dict keys / set members", "Not hashable — can't be a dict key"],
          ["Safe to share between functions and threads", "Shared state needs care (copies, locks)"]
        ] } },
        { code: `a = [1, 2]
b = a                 # same object, two names
b.append(3)
print(a, a is b)      # mutation visible through a

s = "hi"
t = s
t += "!"              # str is immutable: += builds a NEW string
print(s, t, s is t)

x = [1, 2]; y = [1, 2]
print(x == y, x is y) # equal values, different objects

# small-int cache: CPython pre-creates ints -5..256
n1, n2 = int("256"), int("256")
m1, m2 = int("257"), int("257")
print(n1 is n2, m1 is m2)

t = (1, [2, 3])       # an immutable tuple can hold a mutable list
t[1].append(4)
print(t)`, lang: "python", title: "Identity vs equality, mutable vs immutable" },
        { code: `[1, 2, 3] True
hi hi! False
True False
True False
(1, [2, 3, 4])`, lang: "text", title: "Output" },
        { h: "is vs ==" },
        { ul: [
          "<code>a == b</code> calls <code>a.__eq__(b)</code> — <b>value equality</b>, can be overridden.",
          "<code>a is b</code> compares <code>id(a) == id(b)</code> — <b>identity</b>, cannot be overridden and is slightly faster.",
          "Use <code>is</code> for singletons only: <code>x is None</code>, <code>x is not None</code>, sentinel objects. PEP 8 recommends it because a custom <code>__eq__</code> could make <code>x == None</code> lie."
        ] },
        { warn: "Never write <code>if x is 1000</code> or compare strings with <code>is</code>. Small-int caching (-5..256) and string interning are CPython implementation details; results differ between REPL, scripts and versions (Python 3.8+ even emits a <code>SyntaxWarning</code> for <code>is</code> with a literal). Two literal <code>257</code>s in one script may still be the <i>same</i> object because the compiler shares constants — which is why the demo builds them with <code>int(\"257\")</code>." },
        { tip: "Follow-up: 'Is a tuple always immutable?' — the tuple's <i>slots</i> can't be rebound, but objects inside it can be mutable (last line above). Such a tuple is also <b>not hashable</b>: <code>hash((1, [2]))</code> raises <code>TypeError</code>." }
      ]
    },
    {
      id: "list-tuple-set-dict",
      q: "Compare list, tuple, set and dict. What are the time complexities of their common operations?",
      topic: "Data Model",
      level: 1,
      top: true,
      short: "A list is an ordered, mutable dynamic array: O(1) index and amortised O(1) append, but O(n) search, insert or delete at the front. A tuple is an immutable, hashable (if its items are) fixed sequence, a bit smaller and faster. A set is an unordered hash table of unique hashable items with average O(1) add, remove and membership. A dict is a hash table mapping keys to values with average O(1) get, set and delete, and it preserves insertion order since Python 3.7.",
      a: [
        { table: { head: ["", "list", "tuple", "set", "dict"], rows: [
          ["Literal", "<code>[1, 2]</code>", "<code>(1, 2)</code>", "<code>{1, 2}</code>", "<code>{'a': 1}</code>"],
          ["Mutable", "Yes", "No", "Yes (<code>frozenset</code> is not)", "Yes"],
          ["Ordered", "Yes", "Yes", "No", "Insertion order (3.7+)"],
          ["Duplicates", "Allowed", "Allowed", "No", "Unique keys"],
          ["Implementation", "Dynamic array of pointers", "Fixed array of pointers", "Hash table", "Hash table + compact entries array"],
          ["Typical use", "Sequence you modify", "Fixed record, dict key, return several values", "Membership tests, de-duplication", "Lookup by key, counting, caching"]
        ] } },
        { h: "Average time complexity (CPython)" },
        { table: { head: ["Operation", "list", "set / dict"], rows: [
          ["Index / get by key", "<code>a[i]</code> O(1)", "<code>d[k]</code> O(1)"],
          ["Membership <code>x in c</code>", "O(n) — linear scan", "O(1) average, O(n) worst"],
          ["Append / add", "O(1) amortised", "O(1) average"],
          ["Insert / delete at front", "O(n) — shifts elements (use <code>collections.deque</code>)", "—"],
          ["<code>pop()</code> from end", "O(1)", "<code>dict.popitem()</code> O(1)"],
          ["Delete by value / key", "O(n)", "O(1) average"],
          ["Sort", "O(n log n) (Timsort, stable)", "—"],
          ["Slice <code>a[i:j]</code>", "O(j − i) — makes a copy", "—"]
        ] } },
        { code: `import sys, timeit
data = list(range(100_000))
as_set = set(data)
t_list = timeit.timeit(lambda: 99_999 in data, number=200)
t_set = timeit.timeit(lambda: 99_999 in as_set, number=200)
print(f"list lookup: {t_list * 1e6 / 200:9.1f} us per lookup")
print(f"set  lookup: {t_set * 1e6 / 200:9.1f} us per lookup")
print("list bytes:", sys.getsizeof([1, 2, 3]), " tuple bytes:", sys.getsizeof((1, 2, 3)))

from collections import Counter, defaultdict, deque
print(Counter("mississippi").most_common(2))
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))
q = deque([1, 2, 3]); q.appendleft(0); q.pop()
print(q)`, lang: "python", title: "Why the choice matters (timings vary by machine)" },
        { code: `list lookup:    1159.8 us per lookup
set  lookup:       0.1 us per lookup
list bytes: 88  tuple bytes: 64
[('i', 4), ('s', 4)]
{'a': ['apple', 'avocado'], 'b': ['banana']}
deque([0, 1, 2])`, lang: "text", title: "Output" },
        { p: "Appending to a list is <b>amortised</b> O(1) because CPython over-allocates: when the array is full it grows by roughly 1.125× plus a constant, so the occasional O(n) copy is spread over many cheap appends." },
        { tip: "A very common screening question is 'remove duplicates while preserving order': <code>list(dict.fromkeys(items))</code> — O(n), and it relies on dicts keeping insertion order. <code>list(set(items))</code> loses the order." }
      ]
    },
    {
      id: "dict-internals",
      q: "How does a Python dict work internally? Why must keys be hashable, and why is it ordered?",
      topic: "Data Model",
      level: 2,
      top: true,
      short: "A dict is a hash table. Python calls hash(key) to pick a slot in a sparse index array; collisions are resolved by open addressing with a perturbed probe sequence, and on each candidate it compares the stored hash, then identity, then ==. Since CPython 3.6 the index array only holds small integers pointing into a separate dense entries array kept in insertion order, which is why dicts are compact and ordered (guaranteed by the language from 3.7). Keys must be hashable so their hash never changes while they sit in the table.",
      a: [
        { p: "A <code>dict</code> is an <b>open-addressing hash table</b>. Since CPython 3.6 it is split into two arrays (the 'compact dict' design):" },
        { ul: [
          "<b>indices</b> — a sparse array of small integers (1, 2, 4 or 8 bytes each). The slot is chosen from <code>hash(key)</code>; the value stored is a position in the entries array (or EMPTY / DUMMY).",
          "<b>entries</b> — a dense array of <code>(hash, key, value)</code> rows appended in <b>insertion order</b>. Iterating a dict just walks this array, hence ordering."
        ] },
        { svg: `<svg viewBox="0 0 640 220" width="640" class="dg">
  <text x="20" y="22" class="tx tx-b">d = {"b": 1, "a": 2, "c": 3}</text>
  <text x="20" y="52" class="tx tx-s">indices (sparse, size 8)</text>
  <rect x="20" y="62" width="40" height="32" class="box"/><text x="40" y="83" class="tx tx-c tx-m" text-anchor="middle">-</text>
  <rect x="60" y="62" width="40" height="32" class="box box-a"/><text x="80" y="83" class="tx tx-c tx-m" text-anchor="middle">1</text>
  <rect x="100" y="62" width="40" height="32" class="box"/><text x="120" y="83" class="tx tx-c tx-m" text-anchor="middle">-</text>
  <rect x="140" y="62" width="40" height="32" class="box box-a"/><text x="160" y="83" class="tx tx-c tx-m" text-anchor="middle">0</text>
  <rect x="180" y="62" width="40" height="32" class="box"/><text x="200" y="83" class="tx tx-c tx-m" text-anchor="middle">-</text>
  <rect x="220" y="62" width="40" height="32" class="box"/><text x="240" y="83" class="tx tx-c tx-m" text-anchor="middle">-</text>
  <rect x="260" y="62" width="40" height="32" class="box box-a"/><text x="280" y="83" class="tx tx-c tx-m" text-anchor="middle">2</text>
  <rect x="300" y="62" width="40" height="32" class="box"/><text x="320" y="83" class="tx tx-c tx-m" text-anchor="middle">-</text>
  <text x="380" y="52" class="tx tx-s">entries (dense, insertion order)</text>
  <rect x="380" y="62" width="240" height="32" class="box box-g"/><text x="500" y="83" class="tx tx-c tx-m" text-anchor="middle">0: hash("b"), "b", 1</text>
  <rect x="380" y="102" width="240" height="32" class="box box-g"/><text x="500" y="123" class="tx tx-c tx-m" text-anchor="middle">1: hash("a"), "a", 2</text>
  <rect x="380" y="142" width="240" height="32" class="box box-g"/><text x="500" y="163" class="tx tx-c tx-m" text-anchor="middle">2: hash("c"), "c", 3</text>
  <path d="M160 94 C 200 150, 300 90, 378 78" class="ln ln-a" marker-end="url(#dg-arr-a)"/>
  <path d="M80 94 C 120 190, 300 150, 378 118" class="ln ln-a" marker-end="url(#dg-arr-a)"/>
  <path d="M280 94 C 300 170, 340 160, 378 158" class="ln ln-a" marker-end="url(#dg-arr-a)"/>
  <text x="20" y="205" class="tx tx-s">slot = hash(key) masked to table size; collisions probe other slots</text>
</svg>`, caption: "Compact dict: lookups go through the sparse index; iteration walks the dense, ordered entries." },
        { h: "Lookup d[key]" },
        { ol: [
          "Compute <code>h = hash(key)</code>; start at slot <code>h &amp; (size − 1)</code>.",
          "If the slot is empty → <code>KeyError</code>. Otherwise fetch the entry and compare: same hash <b>and</b> (<code>key is stored_key</code> or <code>key == stored_key</code>) → found.",
          "On a mismatch, probe the next slot using a pseudo-random recurrence that mixes in the high bits of the hash (<code>perturb</code>), and repeat.",
          "When the table is about 2/3 full it is resized and everything is re-inserted — so inserts are amortised O(1)."
        ] },
        { code: `class Point:
    def __init__(self, x, y): self.x, self.y = x, y
    def __eq__(self, other): return (self.x, self.y) == (other.x, other.y)
    def __hash__(self): return hash((self.x, self.y))   # equal objects -> equal hashes

d = {Point(1, 2): "A"}
print(d[Point(1, 2)])            # a different but equal object finds the entry

try:
    {[1, 2]: "x"}
except TypeError as e:
    print("TypeError:", e)

class NoHash:
    def __eq__(self, other): return True   # defining __eq__ alone sets __hash__ = None
print(NoHash.__hash__)

d = {"b": 1, "a": 2}
d["c"] = 3
del d["b"]; d["b"] = 4                    # re-inserting moves the key to the end
print(list(d))`, lang: "python", title: "The hash/eq contract" },
        { code: `A
TypeError: unhashable type: 'list'
None
['a', 'c', 'b']`, lang: "text", title: "Output" },
        { warn: "Rule: <b>if <code>a == b</code> then <code>hash(a) == hash(b)</code></b>, and the hash must not change while the key is in a dict. That is why lists (mutable) are unhashable, and why mutating a field that feeds <code>__hash__</code> after insertion makes the key 'disappear'." },
        { tip: "Worst case is O(n) when many keys collide. Python randomises <code>str</code>/<code>bytes</code> hashes per process (<code>PYTHONHASHSEED</code>) to stop hash-flooding DoS attacks — which is also why <code>hash(\"abc\")</code> differs between runs. Set iteration order is not guaranteed for the same reason." }
      ]
    },
    {
      id: "shallow-vs-deep-copy",
      q: "What is the difference between assignment, a shallow copy and a deep copy in Python?",
      topic: "Data Model",
      level: 1,
      top: true,
      short: "Assignment copies nothing; it just binds another name to the same object. A shallow copy (list(a), a[:], a.copy(), copy.copy) creates a new outer container whose slots still reference the same inner objects, so nested mutable objects are shared. A deep copy (copy.deepcopy) recursively copies every nested object, keeping a memo dict so shared references and cycles are preserved, at a much higher cost.",
      a: [
        { table: { head: ["", "New outer object?", "Nested objects", "How"], rows: [
          ["Assignment", "No", "Shared (it's the same object)", "<code>b = a</code>"],
          ["Shallow copy", "Yes", "Shared", "<code>a.copy()</code>, <code>a[:]</code>, <code>list(a)</code>, <code>dict(d)</code>, <code>{**d}</code>, <code>copy.copy(a)</code>"],
          ["Deep copy", "Yes", "Recursively copied", "<code>copy.deepcopy(a)</code>"]
        ] } },
        { code: `import copy
grid = [[0, 0], [0, 0]]
alias = grid
shallow = copy.copy(grid)
deep = copy.deepcopy(grid)

grid[0][0] = 99          # mutate a NESTED list
grid.append([7, 7])      # mutate the OUTER list
print("alias  :", alias)
print("shallow:", shallow)
print("deep   :", deep)

# the classic 2D-list bug: * copies references
bad = [[0] * 3] * 3
bad[0][0] = 1
print("bad :", bad)
good = [[0] * 3 for _ in range(3)]
good[0][0] = 1
print("good:", good)`, lang: "python", title: "Copies in action" },
        { code: `alias  : [[99, 0], [0, 0], [7, 7]]
shallow: [[99, 0], [0, 0]]
deep   : [[0, 0], [0, 0]]
bad : [[1, 0, 0], [1, 0, 0], [1, 0, 0]]
good: [[1, 0, 0], [0, 0, 0], [0, 0, 0]]`, lang: "text", title: "Output" },
        { p: "<code>deepcopy</code> keeps a <b>memo</b> dictionary of objects already copied, so an object referenced twice is copied once and cycles (a list containing itself) don't recurse forever. Immutable atoms such as ints and strings are not copied at all — sharing them is safe." },
        { ul: [
          "Customise copying with <code>__copy__</code> / <code>__deepcopy__(self, memo)</code>.",
          "Deep copies are slow for big structures; often a better design is to treat data as immutable (tuples, frozen dataclasses) or copy only the part you change.",
          "Tensors, file handles, locks and DB connections often can't or shouldn't be deep-copied."
        ] },
        { tip: "The concept is identical in Java — compare with the core answer <a href=\"#/core/oops/shallow-vs-deep-copy\">shallow vs deep copy (OOP)</a>. In Python the extra trap is <code>[[0]*3]*3</code>, which interviewers love to ask." }
      ]
    },

    /* ───────────── Functions & Scope ───────────── */
    {
      id: "mutable-default-argument",
      q: "What is the mutable default argument trap in Python? How do you fix it?",
      topic: "Functions & Scope",
      level: 1,
      top: true,
      short: "Default values are evaluated once, when the def statement runs, and stored on the function object in __defaults__. If the default is mutable, like a list or dict, every call that relies on it shares and mutates the same object, so state leaks between calls. The fix is to use None as a sentinel and create a fresh object inside the function body.",
      a: [
        { p: "A <code>def</code> statement is executed at runtime and creates a function object. Its default values are evaluated <b>right then, once</b>, and stored in <code>func.__defaults__</code>. They are <b>not</b> re-evaluated per call." },
        { code: `def add_item(item, bucket=[]):      # BUG: one list shared by every call
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))                 # surprise: 'a' is still there
print(add_item.__defaults__)

def add_item_fixed(item, bucket=None):
    if bucket is None:               # fresh list on every call
        bucket = []
    bucket.append(item)
    return bucket

print(add_item_fixed("a"), add_item_fixed("b"))

import time
def log(msg, when=time.time()):      # same trap: the time is frozen at def time
    return when
print(log("x") == log("y"))`, lang: "python", title: "The trap and the fix" },
        { code: `['a']
['a', 'b']
(['a', 'b'],)
['a'] ['b']
True`, lang: "text", title: "Output" },
        { ul: [
          "Same rule for any default that's evaluated: <code>datetime.now()</code>, <code>{}</code>, <code>set()</code>, a new object.",
          "Use <code>None</code> as the sentinel; if <code>None</code> is a legitimate value, use a private <code>_MISSING = object()</code> and test <code>is _MISSING</code>.",
          "Linters catch it: pylint <code>W0102 dangerous-default-value</code>, ruff/flake8-bugbear <code>B006</code>.",
          "In dataclasses the same idea is enforced: a mutable default raises <code>ValueError</code>; use <code>field(default_factory=list)</code>."
        ] },
        { tip: "Occasionally it's used on purpose as a cheap cache (<code>def fib(n, _memo={})</code>). Say you know the trick but prefer <code>functools.lru_cache</code>/<code>cache</code> because it is explicit." }
      ]
    },
    {
      id: "args-kwargs",
      q: "What are *args and **kwargs, and what are the rules for parameter kinds and argument passing in Python?",
      topic: "Functions & Scope",
      level: 1,
      top: true,
      short: "*args collects extra positional arguments into a tuple and **kwargs collects extra keyword arguments into a dict. Parameter order is: positional-only before a slash, normal positional-or-keyword, then *args or a bare star, keyword-only, and finally **kwargs. At the call site * and ** do the reverse, unpacking an iterable or a mapping into arguments. Python passes object references by assignment, so mutating an argument is visible to the caller but rebinding it is not.",
      a: [
        { p: "Full signature order (Python 3.8+ for <code>/</code>):" },
        { code: `def f(pos_only, /, normal, *args, kw_only, **kwargs): ...`, lang: "text" },
        { table: { head: ["Kind", "Syntax", "Can be passed as"], rows: [
          ["Positional-only (3.8+)", "before <code>/</code>", "Position only — the name is free to change later"],
          ["Positional-or-keyword", "plain params", "Either way"],
          ["Var-positional", "<code>*args</code>", "Extra positional args → <code>tuple</code>"],
          ["Keyword-only", "after <code>*args</code> or a bare <code>*</code>", "Keyword only — forces readable call sites"],
          ["Var-keyword", "<code>**kwargs</code>", "Extra keyword args → <code>dict</code>"]
        ] } },
        { code: `def demo(a, b=2, /, c=3, *args, d, e=5, **kwargs):
    print(f"a={a} b={b} c={c} args={args} d={d} e={e} kwargs={kwargs}")

demo(1, d=4)
demo(1, 20, 30, 40, 50, d=4, z=9)

nums = [1, 2, 3]
opts = {"d": 10, "color": "red"}
demo(*nums, **opts)                  # unpacking at the call site

try:
    demo(a=1, d=4)                   # a is positional-only
except TypeError as e:
    print("TypeError:", e)

def wrapper(*args, **kwargs):        # forward everything unchanged
    return demo(*args, **kwargs)
wrapper(7, d=8)

def change(lst, n):
    lst.append(99)                   # mutation: caller sees it
    n += 1                           # rebinding: caller does not
nums, n = [1], 1
change(nums, n)
print(nums, n)`, lang: "python", title: "Every parameter kind" },
        { code: `a=1 b=2 c=3 args=() d=4 e=5 kwargs={}
a=1 b=20 c=30 args=(40, 50) d=4 e=5 kwargs={'z': 9}
a=1 b=2 c=3 args=() d=10 e=5 kwargs={'color': 'red'}
TypeError: demo() missing 1 required positional argument: 'a'
a=7 b=2 c=3 args=() d=8 e=5 kwargs={}
[1, 99] 1`, lang: "text", title: "Output" },
        { warn: "Python is neither 'pass by value' nor 'pass by reference' — it is <b>pass by object reference</b> (call by sharing). The function receives a reference to the same object; rebinding the parameter name never affects the caller. Java behaves the same for objects — see <a href=\"#/core/oops/java-pass-by-value\">Java pass-by-value</a>." },
        { tip: "Good follow-ups to volunteer: the bare <code>*</code> (<code>def connect(host, *, timeout)</code>) to force keyword arguments for clarity, and that <code>*args, **kwargs</code> is exactly how decorators forward arguments they don't know about." }
      ]
    },
    {
      id: "scope-legb-closures",
      q: "Explain Python's LEGB scope rule, global and nonlocal, and closures. What is the late-binding closure trap?",
      topic: "Functions & Scope",
      level: 2,
      top: true,
      short: "Names are resolved Local, then Enclosing function, then Global (module), then Built-in. Assigning to a name anywhere in a function makes it local for the whole function, so you need global to rebind a module variable and nonlocal to rebind a variable of an enclosing function. A closure is an inner function that keeps references to variables of its enclosing scope after that scope returns. Closures capture variables, not values, so lambdas created in a loop all see the loop variable's final value unless you bind it with a default argument.",
      a: [
        { table: { head: ["Scope", "What lives there"], rows: [
          ["<b>L</b>ocal", "Names assigned inside the current function (incl. parameters)"],
          ["<b>E</b>nclosing", "Locals of any outer function(s) — used by closures"],
          ["<b>G</b>lobal", "Top-level names of the module"],
          ["<b>B</b>uilt-in", "<code>len</code>, <code>print</code>, <code>range</code>… (module <code>builtins</code>)"]
        ] } },
        { p: "Scope is decided at <b>compile time</b>: if a function assigns to <code>x</code> anywhere, <code>x</code> is local everywhere in that function. Reading it before the assignment raises <code>UnboundLocalError</code>. <code>if</code>/<code>for</code> blocks do <b>not</b> create scopes; functions, classes, modules and comprehensions do." },
        { code: `count = 0
def broken():
    try:
        count += 1               # assignment makes 'count' local -> read fails
    except UnboundLocalError as e:
        print("UnboundLocalError:", e)
broken()

def inc():
    global count                 # rebind the module-level name
    count += 1
inc(); print("count =", count)

def make_counter():
    n = 0
    def step():
        nonlocal n               # rebind the enclosing function's name
        n += 1
        return n
    return step                  # step is a closure over n
c = make_counter()
print(c(), c(), c())
print(c.__closure__[0].cell_contents)

# late binding: all lambdas look up i when CALLED
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])
funcs = [lambda i=i: i for i in range(3)]   # default arg binds the value now
print([f() for f in funcs])`, lang: "python", title: "LEGB, global/nonlocal and closures" },
        { code: `UnboundLocalError: cannot access local variable 'count' where it is not associated with a value
count = 1
1 2 3
3
[2, 2, 2]
[0, 1, 2]`, lang: "text", title: "Output" },
        { p: "A closure stores <b>cells</b> (<code>__closure__</code>) that point at the enclosing variables, not snapshots of their values. That is what makes counters, decorators and factories work — and what causes the loop trap. Alternatives to the default-argument fix: <code>functools.partial(f, i)</code> or a factory function <code>def make(i): return lambda: i</code>." },
        { warn: "Mutating doesn't need <code>global</code>/<code>nonlocal</code>: <code>items.append(x)</code> on a global list works, because it doesn't rebind the name. Only <b>assignment</b> (<code>=</code>, <code>+=</code>) does. Heavy use of <code>global</code> is a code smell — pass values in and return them." },
        { tip: "Classic gotcha: class bodies are a scope but are <b>not</b> enclosing scopes for methods — a method can't see a class attribute by bare name; it needs <code>self.attr</code> or <code>ClassName.attr</code>." }
      ]
    },
    {
      id: "decorators",
      q: "What is a decorator in Python, and how do you write one with functools.wraps and one that takes arguments?",
      topic: "Functions & Scope",
      level: 2,
      top: true,
      short: "A decorator is a callable that takes a function and returns a replacement, usually a wrapper that adds behaviour before or after calling the original. The @decorator line is just sugar for func = decorator(func). It works because functions are first-class objects and closures keep the original function. Use functools.wraps so the wrapper keeps the original name, docstring and signature. A decorator with arguments is a factory: a function that takes the arguments and returns the real decorator, giving three nested levels.",
      a: [
        { p: "<code>@timer</code> above <code>def f</code> means exactly <code>f = timer(f)</code>. Decorators are used for logging, timing, caching (<code>@functools.cache</code>), retries, auth checks (<code>@login_required</code>), registering routes (<code>@app.get(\"/\")</code> in FastAPI/Flask), and in classes (<code>@property</code>, <code>@staticmethod</code>)." },
        { code: `import functools, time

def timer(func):
    @functools.wraps(func)                 # copy __name__, __doc__, __wrapped__...
    def wrapper(*args, **kwargs):          # accept any signature
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {(time.perf_counter() - start) * 1000:.2f} ms")
        return result                      # don't forget to return!
    return wrapper

def retry(times=3, exceptions=(Exception,)):    # decorator FACTORY
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    print(f"attempt {attempt} failed: {e}")
            raise RuntimeError(f"{func.__name__} failed {times} times")
        return wrapper
    return decorator

calls = {"n": 0}
@timer
@retry(times=3, exceptions=(ConnectionError,))  # applied first (bottom-up)
def fetch():
    """Pretend network call."""
    calls["n"] += 1
    if calls["n"] < 3:
        raise ConnectionError("timeout")
    return "data"

print(fetch())
print(fetch.__name__, "|", fetch.__doc__)`, lang: "python", title: "A plain decorator and a parameterised one" },
        { code: `attempt 1 failed: timeout
attempt 2 failed: timeout
fetch took 0.02 ms
data
fetch | Pretend network call.`, lang: "text", title: "Output" },
        { h: "Why functools.wraps?" },
        { p: "Without it, the decorated function's <code>__name__</code> is <code>'wrapper'</code> and its docstring is lost — breaking logs, <code>help()</code>, debuggers, pytest output and frameworks that inspect names or signatures (FastAPI reads the signature to build request parsing; it follows <code>__wrapped__</code>, which <code>wraps</code> sets)." },
        { table: { head: ["Form", "Levels", "Usage"], rows: [
          ["Simple decorator", "decorator(func) → wrapper", "<code>@timer</code>"],
          ["With arguments", "factory(args) → decorator(func) → wrapper", "<code>@retry(times=3)</code>"],
          ["Class-based", "<code>__init__(func)</code> + <code>__call__</code>", "When the decorator needs state"],
          ["Stacked", "Bottom one applied first", "<code>@a @b def f</code> = <code>a(b(f))</code>"]
        ] } },
        { warn: "Decorators run at <b>import/definition time</b>, not call time — side effects in the outer function happen once. And <code>@retry</code> without parentheses would pass the function itself as <code>times</code>; supporting both forms needs an explicit check." },
        { tip: "The Python decorator is a language feature for wrapping callables; it is related to but not the same as the GoF <a href=\"#/core/oops/decorator-pattern\">Decorator pattern</a>, which wraps objects behind the same interface." }
      ]
    },

    /* ───────────── Iteration & Control Flow ───────────── */
    {
      id: "iterators-iterables",
      q: "What is the difference between an iterable and an iterator? How does a for loop work internally?",
      topic: "Iteration & Control Flow",
      level: 2,
      top: true,
      short: "An iterable is any object that can give you an iterator: it implements __iter__ (or the old __getitem__ protocol), like lists, strings, dicts and files. An iterator is the object that produces values one at a time with __next__, raises StopIteration when exhausted, and returns itself from __iter__. A for loop calls iter() on the iterable once, then calls next() repeatedly until StopIteration. Iterators are single-pass; iterables like lists can be iterated many times.",
      a: [
        { table: { head: ["", "Iterable", "Iterator"], rows: [
          ["Protocol", "<code>__iter__()</code> returns a <b>new</b> iterator", "<code>__next__()</code> returns next item or raises <code>StopIteration</code>; <code>__iter__()</code> returns <code>self</code>"],
          ["Examples", "<code>list</code>, <code>str</code>, <code>dict</code>, <code>range</code>, <code>set</code>", "<code>iter(list)</code>, file objects, generators, <code>zip</code>, <code>map</code>, <code>enumerate</code>"],
          ["Reusable?", "Yes — each <code>for</code> gets a fresh iterator", "No — exhausted after one pass"],
          ["State", "Holds the data", "Holds a position"]
        ] } },
        { code: `nums = [10, 20]
it = iter(nums)               # what 'for' does first
print(next(it), next(it))
try:
    next(it)
except StopIteration:
    print("StopIteration -> loop ends")

# 'for x in nums: body' is roughly:
_it = iter(nums)
while True:
    try:
        x = next(_it)
    except StopIteration:
        break
    print("body", x)

class Countdown:                  # iterable: returns a fresh iterator each time
    def __init__(self, start): self.start = start
    def __iter__(self): return CountdownIter(self.start)

class CountdownIter:              # iterator: holds the position
    def __init__(self, n): self.n = n
    def __iter__(self): return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

cd = Countdown(3)
print(list(cd), list(cd))         # reusable

squares = map(lambda v: v * v, [1, 2, 3])   # map returns an iterator
print(list(squares), list(squares))          # second pass is empty!`, lang: "python", title: "The protocol, by hand" },
        { code: `10 20
StopIteration -> loop ends
body 10
body 20
[3, 2, 1] [3, 2, 1]
[1, 4, 9] []`, lang: "text", title: "Output" },
        { warn: "Single-pass surprise: <code>zip</code>, <code>map</code>, <code>filter</code>, generators and file objects are iterators. Passing one to two consumers (e.g. <code>sum(it)</code> then <code>max(it)</code>) gives empty results the second time. Materialise with <code>list()</code> if you need two passes, or use <code>itertools.tee</code>." },
        { ul: [
          "<code>iter(callable, sentinel)</code> calls until the sentinel appears: <code>for chunk in iter(lambda: f.read(4096), b\"\")</code>.",
          "<code>itertools</code> gives lazy building blocks: <code>islice</code>, <code>chain</code>, <code>groupby</code>, <code>accumulate</code>, <code>product</code>, <code>batched</code> (3.12+).",
          "Writing <code>__iter__</code> as a generator function (with <code>yield</code>) is the idiomatic shortcut — no separate iterator class needed."
        ] },
        { tip: "Interviewers often follow up with 'so what is a generator?' — answer: the easiest way to write an iterator; a function containing <code>yield</code> returns a generator object that implements <code>__iter__</code>/<code>__next__</code> for you." }
      ]
    },
    {
      id: "generators-yield",
      q: "What are generators and yield? How does a generator differ from a list comprehension in memory and behaviour?",
      topic: "Iteration & Control Flow",
      level: 2,
      top: true,
      short: "A generator function contains yield; calling it doesn't run the body but returns a generator object, an iterator that runs the code up to the next yield each time next() is called, then pauses with all its local state intact. Values are produced lazily, one at a time, so memory stays constant no matter how many items there are, and infinite sequences are possible. A list comprehension builds the whole list eagerly in memory; a generator expression in parentheses is its lazy equivalent but can only be consumed once.",
      a: [
        { p: "A <b>generator</b> is a function whose body contains <code>yield</code>. Calling it returns a <b>generator object</b> without executing anything. Each <code>next()</code> resumes the frame until the next <code>yield</code>, hands out the value and <b>suspends</b> — locals and the instruction pointer are preserved. Returning (or falling off the end) raises <code>StopIteration</code>." },
        { code: `import sys

def countdown(n):
    print("  started")
    while n > 0:
        yield n                    # pause here, hand out n
        n -= 1
    print("  finished")

g = countdown(2)                   # nothing printed yet: lazy
print(type(g).__name__)
print(next(g)); print(next(g))
print(list(g))                     # runs to the end -> 'finished'

squares_list = [x * x for x in range(1_000_000)]   # eager: all in RAM
squares_gen = (x * x for x in range(1_000_000))    # lazy: one at a time
print("list bytes:", sys.getsizeof(squares_list))
print("gen  bytes:", sys.getsizeof(squares_gen))
print(sum(squares_gen) == sum(squares_list))

def read_numbers(lines):           # pipeline of generators: streaming, O(1) memory
    for line in lines:
        yield int(line)
def evens(nums):
    yield from (n for n in nums if n % 2 == 0)   # delegate to a sub-iterator
print(list(evens(read_numbers(["1", "2", "3", "4"]))))

import itertools
def naturals():                    # infinite generator
    n = 0
    while True:
        yield n
        n += 1
print(list(itertools.islice(naturals(), 5)))`, lang: "python", title: "Lazy evaluation and constant memory" },
        { code: `generator
  started
2
1
  finished
[]
list bytes: 8448728
gen  bytes: 200
True
[2, 4]
[0, 1, 2, 3, 4]`, lang: "text", title: "Output" },
        { table: { head: ["", "List comprehension <code>[...]</code>", "Generator expression / function"], rows: [
          ["Evaluation", "Eager — computes everything now", "Lazy — computes on demand"],
          ["Memory", "O(n)", "O(1) (just the frame)"],
          ["Passes", "Many, supports <code>len</code>, indexing, slicing", "One pass only; no <code>len</code>, no indexing"],
          ["Speed for small data", "Usually a bit faster", "Slight per-item overhead"],
          ["Best for", "Small/medium results you reuse", "Large files, streams, pipelines, infinite sequences, early exit (<code>any</code>, <code>next</code>)"]
        ] } },
        { ul: [
          "<code>yield from sub</code> (3.3+) delegates to another iterator/generator and forwards <code>send()</code>/<code>throw()</code>.",
          "Generators are also coroutines-lite: <code>gen.send(value)</code> resumes and makes <code>yield</code> evaluate to <code>value</code>; <code>gen.close()</code> raises <code>GeneratorExit</code> inside it.",
          "<code>@contextlib.contextmanager</code> and the old pre-<code>async</code> coroutine style are built on generators."
        ] },
        { tip: "Real-world answer for 'process a 10 GB log file': iterate the file object line by line (it's already a lazy iterator) through a chain of generators — memory stays flat. A function that pre-builds a list of all lines would crash." }
      ]
    },
    {
      id: "context-managers",
      q: "What is a context manager? How does the with statement work, and how do you write one?",
      topic: "Iteration & Control Flow",
      level: 2,
      top: true,
      short: "A context manager is an object that sets something up and guarantees cleanup, used with the with statement. with calls __enter__ at the start, binding its return value to the as target, and always calls __exit__ at the end, even if an exception or return happens inside the block. __exit__ receives the exception type, value and traceback and can suppress the exception by returning True. You can write one as a class or, more simply, as a generator decorated with contextlib.contextmanager, with the code before yield as setup and a finally block as teardown.",
      a: [
        { p: "Context managers wrap a <b>setup / teardown</b> pair so cleanup can't be forgotten: closing files, releasing locks, committing or rolling back DB transactions, restoring state, stopping timers. The <code>with</code> statement is essentially sugar for <code>try/finally</code>." },
        { code: `with EXPR as VAR:
    BLOCK
# is roughly
mgr = EXPR
VAR = mgr.__enter__()
try:
    BLOCK
except BaseException as e:
    if not mgr.__exit__(type(e), e, e.__traceback__):
        raise                 # re-raised unless __exit__ returned True
else:
    mgr.__exit__(None, None, None)`, lang: "text", title: "What with expands to" },
        { code: `import contextlib, sqlite3

class Transaction:                          # class-based
    def __init__(self, conn): self.conn = conn
    def __enter__(self):
        print("BEGIN")
        return self.conn.cursor()
    def __exit__(self, exc_type, exc, tb):
        if exc_type is None:
            self.conn.commit(); print("COMMIT")
        else:
            self.conn.rollback(); print("ROLLBACK because", exc_type.__name__)
        return False                        # don't swallow the exception

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
with Transaction(conn) as cur:
    cur.execute("INSERT INTO t VALUES (1)")
try:
    with Transaction(conn) as cur:
        cur.execute("INSERT INTO t VALUES (2)")
        raise ValueError("bad row")
except ValueError:
    pass
print(conn.execute("SELECT x FROM t").fetchall())

@contextlib.contextmanager                  # generator-based
def tag(name):
    print(f"<{name}>")
    try:
        yield name                          # value bound to 'as'
    finally:
        print(f"</{name}>")                 # runs even on exception

with tag("div"), tag("p"):                  # several managers on one line
    print("hello")

with contextlib.suppress(FileNotFoundError):
    open("no-such-file.txt")
print("suppressed")`, lang: "python", title: "Class-based and @contextmanager" },
        { code: `BEGIN
COMMIT
BEGIN
ROLLBACK because ValueError
[(1,)]
<div>
<p>
hello
</p>
</div>
suppressed`, lang: "text", title: "Output" },
        { table: { head: ["Tool (contextlib)", "Use"], rows: [
          ["<code>@contextmanager</code>", "Write a manager as a generator (one <code>yield</code>)"],
          ["<code>suppress(*excs)</code>", "Ignore specific exceptions"],
          ["<code>closing(obj)</code>", "Call <code>obj.close()</code> on exit"],
          ["<code>ExitStack</code>", "Enter a dynamic number of managers"],
          ["<code>redirect_stdout</code>", "Capture prints in tests"],
          ["<code>asynccontextmanager</code> / <code>async with</code>", "Async setup/teardown (<code>__aenter__</code>/<code>__aexit__</code>)"]
        ] } },
        { warn: "In a <code>@contextmanager</code> generator, wrap the <code>yield</code> in <code>try/finally</code>. Without it, an exception in the <code>with</code> body is thrown into the generator at the <code>yield</code> and the cleanup line after it never runs." },
        { tip: "Real usages to mention: <code>with open(...)</code>, <code>with lock:</code>, <code>with torch.no_grad():</code>, <code>with conn:</code> (sqlite3 commits/rolls back but does not close), FastAPI dependencies with <code>yield</code> and the <code>lifespan</code> handler — all the same pattern." }
      ]
    },
    {
      id: "exceptions-else-finally",
      q: "How does exception handling work in Python? When do the else and finally blocks run?",
      topic: "Iteration & Control Flow",
      level: 1,
      top: true,
      short: "try runs the risky code; the first matching except clause handles an exception (order from specific to general). The else block runs only if the try block raised nothing, which keeps the success path out of the try so you don't accidentally catch its errors. finally always runs, on success, on exception, and even on return, break or continue, and is used for cleanup. raise ... from e chains exceptions, custom exceptions subclass Exception, and you should never use a bare except.",
      a: [
        { code: `def parse(s):
    try:
        n = int(s)                      # only the risky line goes in try
    except ValueError as e:
        print("  except:", e)
        return None
    else:
        print("  else: parsed", n)      # runs only if try raised nothing
        return n
    finally:
        print("  finally: always")      # runs even after 'return'

print(parse("42"))
print(parse("x"))

def tricky():
    try:
        return "from try"
    finally:
        print("  finally runs before the function actually returns")
print(tricky())

class InsufficientFunds(Exception):     # custom exception hierarchy
    def __init__(self, need, have):
        super().__init__(f"need {need}, have {have}")
        self.need, self.have = need, have

def withdraw(balance, amt):
    try:
        if amt > balance:
            raise InsufficientFunds(amt, balance)
    except InsufficientFunds as e:
        raise RuntimeError("withdraw failed") from e   # explicit chaining

try:
    withdraw(100, 500)
except RuntimeError as e:
    print(type(e).__name__, "<- caused by", repr(e.__cause__))`, lang: "python", title: "try / except / else / finally" },
        { code: `  else: parsed 42
  finally: always
42
  except: invalid literal for int() with base 10: 'x'
  finally: always
None
  finally runs before the function actually returns
from try
RuntimeError <- caused by InsufficientFunds('need 500, have 100')`, lang: "text", title: "Output" },
        { table: { head: ["Block", "Runs when"], rows: [
          ["<code>try</code>", "Always first"],
          ["<code>except E</code>", "An exception that <code>isinstance(e, E)</code> was raised in <code>try</code>; first match wins"],
          ["<code>else</code>", "<code>try</code> finished <b>without</b> an exception (and without return/break)"],
          ["<code>finally</code>", "Always — success, handled or unhandled exception, <code>return</code>, <code>break</code>"]
        ] } },
        { ul: [
          "Hierarchy: <code>BaseException</code> → <code>Exception</code> (catch this) and also <code>KeyboardInterrupt</code>, <code>SystemExit</code>, <code>GeneratorExit</code> (don't). A bare <code>except:</code> catches those too — avoid it.",
          "<code>raise</code> alone re-raises the current exception with its traceback; <code>raise New() from e</code> sets <code>__cause__</code>; <code>from None</code> hides the context.",
          "EAFP ('easier to ask forgiveness than permission') is the Pythonic style: <code>try: d[k] except KeyError</code> rather than checking first — also avoids race conditions on files.",
          "Python 3.11 added <code>ExceptionGroup</code> and <code>except*</code> (raised by <code>asyncio.TaskGroup</code>) and <code>e.add_note()</code>."
        ] },
        { warn: "A <code>return</code> inside <code>finally</code> overrides the try's return value <b>and silently swallows any exception</b> in flight (Python 3.14 now warns about it, PEP 765). Keep <code>finally</code> for cleanup only." },
        { tip: "The concepts mirror Java's try/catch/finally (see <a href=\"#/core/oops/exception-handling-oop\">exception handling</a>), but Python has no checked exceptions and adds the <code>else</code> clause — mentioning why <code>else</code> exists (narrow <code>try</code> blocks) is what impresses." }
      ]
    },

    /* ───────────── OOP in Python ───────────── */
    {
      id: "classes-dunder-methods",
      q: "How do classes work in Python: what are self, __init__ vs __new__, and the common dunder methods?",
      topic: "OOP in Python",
      level: 1,
      top: true,
      short: "A class is itself an object that creates instances. Calling the class runs __new__, which allocates and returns the instance, then __init__, which initialises it; self is just the explicit name for that instance, passed automatically when you call a method on it. Dunder (double underscore) methods hook objects into Python syntax: __repr__ and __str__ for printing, __eq__ and __hash__ for comparison and dict keys, __len__, __getitem__ and __iter__ for container behaviour, __add__ for operators, __call__ to make instances callable, and __enter__/__exit__ for with.",
      a: [
        { ul: [
          "<code>obj.method(x)</code> is translated to <code>Class.method(obj, x)</code> — that's why every instance method takes <code>self</code> first. It's a convention, not a keyword.",
          "<b>Class attributes</b> are shared by all instances; <b>instance attributes</b> live in each object's <code>__dict__</code>. Lookup goes instance → class → base classes (MRO).",
          "No real <code>private</code>: <code>_name</code> means 'internal' by convention; <code>__name</code> triggers <b>name mangling</b> to <code>_Class__name</code> to avoid clashes in subclasses."
        ] },
        { code: `class Vector:
    dims = 2                                # class attribute (shared)

    def __new__(cls, *args):                # 1. allocate (rarely overridden)
        return super().__new__(cls)
    def __init__(self, x, y):               # 2. initialise
        self.x, self.y = x, y               # instance attributes

    def __repr__(self):  return f"Vector({self.x}, {self.y})"   # for developers
    def __str__(self):   return f"({self.x}, {self.y})"         # for users / print
    def __eq__(self, o): return isinstance(o, Vector) and (self.x, self.y) == (o.x, o.y)
    def __hash__(self):  return hash((self.x, self.y))
    def __add__(self, o): return Vector(self.x + o.x, self.y + o.y)
    def __mul__(self, k): return Vector(self.x * k, self.y * k)
    __rmul__ = __mul__                      # so 3 * v works too
    def __abs__(self):   return (self.x ** 2 + self.y ** 2) ** 0.5
    def __bool__(self):  return bool(self.x or self.y)
    def __len__(self):   return self.dims
    def __getitem__(self, i): return (self.x, self.y)[i]
    def __call__(self, scale): return self * scale

v, w = Vector(3, 4), Vector(1, 1)
print(repr(v), str(v), v + w, 3 * v, abs(v))
print(v == Vector(3, 4), len(v), v[0], list(v), bool(Vector(0, 0)), v(10))
print({v: "seen"}[Vector(3, 4)])`, lang: "python", title: "A class wired into Python syntax" },
        { code: `Vector(3, 4) (3, 4) (4, 5) (9, 12) 5.0
True 2 3 [3, 4] False (30, 40)
seen`, lang: "text", title: "Output" },
        { table: { head: ["Want…", "Implement"], rows: [
          ["Readable debug output", "<code>__repr__</code> (fallback for <code>__str__</code>)"],
          ["Comparison / sorting", "<code>__eq__</code>, <code>__lt__</code> (+ <code>functools.total_ordering</code>)"],
          ["Dict key / set member", "<code>__hash__</code> consistent with <code>__eq__</code>"],
          ["Container behaviour", "<code>__len__</code>, <code>__getitem__</code>, <code>__contains__</code>, <code>__iter__</code>"],
          ["Operators", "<code>__add__</code>/<code>__radd__</code>/<code>__iadd__</code>, <code>__mul__</code>, <code>__matmul__</code>…"],
          ["Attribute hooks", "<code>__getattr__</code> (only when missing), <code>__getattribute__</code> (always), <code>__setattr__</code>"],
          ["Context manager", "<code>__enter__</code>, <code>__exit__</code>"]
        ] } },
        { p: "<b><code>__new__</code> vs <code>__init__</code></b>: <code>__new__</code> is a static method that <i>creates</i> and returns the object; <code>__init__</code> <i>initialises</i> an already created object and must return <code>None</code>. Override <code>__new__</code> only for subclassing immutable types (<code>class Celsius(float)</code>), singletons or caching instances." },
        { tip: "Python's operator overloading is just these dunders — contrast with Java, which doesn't allow it (<a href=\"#/core/oops/operator-overloading\">operator overloading</a>). Returning <code>NotImplemented</code> from <code>__eq__</code>/<code>__add__</code> for unsupported types lets Python try the other operand's method." }
      ]
    },
    {
      id: "classmethod-staticmethod-property",
      q: "What is the difference between @classmethod, @staticmethod and @property?",
      topic: "OOP in Python",
      level: 1,
      top: true,
      short: "A normal method receives the instance as self. A classmethod receives the class as cls, so it can build instances, which makes it ideal for alternative constructors like from_json, and it works correctly for subclasses. A staticmethod receives nothing implicit; it is a plain function namespaced inside the class. A property turns a method into a computed attribute accessed without parentheses, with optional setter and deleter, so you can add validation later without changing the public API.",
      a: [
        { table: { head: ["", "First argument", "Can access", "Typical use"], rows: [
          ["Instance method", "<code>self</code>", "Instance and class state", "Behaviour of one object"],
          ["<code>@classmethod</code>", "<code>cls</code>", "Class state, can create instances", "Alternative constructors, factories, per-class counters"],
          ["<code>@staticmethod</code>", "none", "Nothing implicit", "Utility logically related to the class"],
          ["<code>@property</code>", "<code>self</code>", "Instance state", "Computed / validated attribute"]
        ] } },
        { code: `import json

class Employee:
    raise_pct = 0.10

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary              # goes through the property setter

    @property
    def salary(self):                     # getter: e.salary (no parentheses)
        return self._salary
    @salary.setter
    def salary(self, value):              # validation without changing the API
        if value < 0:
            raise ValueError("salary must be >= 0")
        self._salary = value

    @property
    def annual(self):                     # read-only computed attribute
        return self._salary * 12

    @classmethod
    def from_json(cls, text):             # alternative constructor
        d = json.loads(text)
        return cls(d["name"], d["salary"])   # cls -> works for subclasses

    @staticmethod
    def is_workday(day):                  # no self / cls needed
        return day not in ("Sat", "Sun")

class Manager(Employee):
    pass

m = Manager.from_json('{"name": "Asha", "salary": 90000}')
print(type(m).__name__, m.name, m.salary, m.annual)
print(Employee.is_workday("Sun"))
try:
    m.salary = -5
except ValueError as e:
    print("ValueError:", e)
try:
    m.annual = 1
except AttributeError as e:
    print("AttributeError:", e)`, lang: "python", title: "All three in one class" },
        { code: `Manager Asha 90000 1080000
False
ValueError: salary must be >= 0
AttributeError: property 'annual' of 'Manager' object has no setter`, lang: "text", title: "Output" },
        { p: "Under the hood all three are <b>descriptors</b> — objects with <code>__get__</code> that customise attribute access. A plain function's <code>__get__</code> binds <code>self</code>; <code>classmethod</code>'s binds the class; <code>staticmethod</code>'s binds nothing; <code>property</code> calls the getter." },
        { warn: "Don't write Java-style <code>get_x()</code>/<code>set_x()</code> by default. Start with a public attribute; if validation is needed later, switch it to a <code>@property</code> — callers don't change. Inside the setter, store to a <i>different</i> name (<code>self._salary</code>) or you'll recurse forever." },
        { tip: "Why <code>cls(...)</code> instead of <code>Employee(...)</code> in <code>from_json</code>? Because <code>Manager.from_json</code> should return a <code>Manager</code>. Real examples: <code>dict.fromkeys</code>, <code>datetime.fromtimestamp</code>, <code>int.from_bytes</code>. Compare Java's static members in <a href=\"#/core/oops/static-members\">static members</a>." }
      ]
    },
    {
      id: "mro-super",
      q: "How does multiple inheritance work in Python? What is the MRO and how does super() use it?",
      topic: "OOP in Python",
      level: 3,
      top: false,
      short: "Python allows multiple inheritance and resolves attribute lookup with a Method Resolution Order computed by the C3 linearisation algorithm: a class comes before its parents, parents keep the order they're listed in, and every class appears once. You can inspect it with Class.__mro__. super() does not mean 'my parent'; it means 'the next class after me in the MRO of the actual instance', which is how the diamond problem is solved: with cooperative super() calls each class's method runs exactly once.",
      a: [
        { p: "Python supports multiple inheritance, so the <a href=\"#/core/oops/diamond-problem\">diamond problem</a> must be resolved. Python does it with a single, deterministic <b>Method Resolution Order (MRO)</b> per class, computed by <b>C3 linearisation</b> (since Python 2.3 for new-style classes)." },
        { ul: [
          "A subclass always comes before its bases.",
          "Bases keep the left-to-right order written in the <code>class</code> statement.",
          "Each class appears once; if no order satisfies the rules, class creation fails with <code>TypeError: Cannot create a consistent method resolution order</code>."
        ] },
        { code: `class Base:
    def __init__(self):
        print("Base.__init__")

class Logger(Base):
    def __init__(self):
        print("Logger.__init__ -> next in MRO")
        super().__init__()          # NOT necessarily Base!

class Cache(Base):
    def __init__(self):
        print("Cache.__init__ -> next in MRO")
        super().__init__()

class Service(Logger, Cache):       # diamond: Service -> Logger, Cache -> Base
    def __init__(self):
        print("Service.__init__")
        super().__init__()

print([c.__name__ for c in Service.__mro__])
Service()                           # Base.__init__ runs exactly once

class A: pass
class B(A): pass
try:
    class C(A, B): pass             # A before its own subclass B: impossible
except TypeError as e:
    print("TypeError:", e)`, lang: "python", title: "Diamond with cooperative super()" },
        { code: `['Service', 'Logger', 'Cache', 'Base', 'object']
Service.__init__
Logger.__init__ -> next in MRO
Cache.__init__ -> next in MRO
Base.__init__
TypeError: Cannot create a consistent method resolution
order (MRO) for bases A, B`, lang: "text", title: "Output" },
        { svg: `<svg viewBox="0 0 520 200" width="520" class="dg">
  <rect x="200" y="12" width="120" height="34" class="box box-a"/><text x="260" y="34" class="tx tx-c tx-m" text-anchor="middle">Service</text>
  <rect x="60" y="82" width="120" height="34" class="box"/><text x="120" y="104" class="tx tx-c tx-m" text-anchor="middle">Logger</text>
  <rect x="340" y="82" width="120" height="34" class="box"/><text x="400" y="104" class="tx tx-c tx-m" text-anchor="middle">Cache</text>
  <rect x="200" y="152" width="120" height="34" class="box box-g"/><text x="260" y="174" class="tx tx-c tx-m" text-anchor="middle">Base</text>
  <path d="M230 46 L150 82" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M290 46 L370 82" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M150 116 L230 152" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M370 116 L290 152" class="ln" marker-end="url(#dg-arr)"/>
  <path d="M180 99 L338 99" class="ln ln-a ln-d" marker-end="url(#dg-arr-a)"/>
  <text x="260" y="92" class="tx tx-a tx-s tx-c" text-anchor="middle">super() in Logger → Cache</text>
</svg>`, caption: "MRO: Service → Logger → Cache → Base → object. Logger's super() jumps sideways to Cache, not up to Base." },
        { warn: "Cooperative <code>super()</code> only works if <b>every</b> class in the chain calls <code>super()</code> and accepts the arguments others might pass (often via <code>**kwargs</code>). Mixing <code>super()</code> with hard-coded <code>Base.__init__(self)</code> calls leads to methods running twice or not at all." },
        { tip: "Practical use is <b>mixins</b>: small classes that add one capability (<code>JSONMixin</code>, <code>LoggingMixin</code>) and are listed before the main base, e.g. Django's class-based views. Java avoids this by allowing multiple inheritance only of interfaces (<a href=\"#/core/oops/java-no-multiple-inheritance\">why</a>)." }
      ]
    },
    {
      id: "type-hints-dataclasses",
      q: "Are Python type hints enforced at runtime? What are dataclasses and when would you use them over a normal class or Pydantic?",
      topic: "OOP in Python",
      level: 2,
      top: false,
      short: "No. Type hints are annotations stored in __annotations__ that the interpreter ignores; static checkers like mypy or pyright and IDEs use them to catch bugs before running. Some libraries, notably Pydantic and FastAPI, read them at runtime to validate and convert data. A dataclass uses the annotations to auto-generate __init__, __repr__ and __eq__, and optionally ordering, immutability (frozen) and __slots__. Use a dataclass for internal plain data, Pydantic at trust boundaries such as API input, and a hand-written class when there's real behaviour or invariants.",
      a: [
        { code: `from dataclasses import dataclass, field, asdict
from typing import Optional

def add(a: int, b: int) -> int:
    return a + b

print(add.__annotations__)
print(add("1", "2"))                 # wrong types: Python runs it anyway -> '12'

@dataclass(order=True, frozen=True, slots=True)   # slots: 3.10+
class Version:
    major: int
    minor: int = 0
    tags: tuple[str, ...] = ()

@dataclass
class Cart:
    owner: str
    items: list[str] = field(default_factory=list)  # never items=[]
    coupon: Optional[str] = None

v1, v2 = Version(1, 2), Version(1, 10)
print(v1, v1 < v2, v1 == Version(1, 2), hash(v1) == hash(Version(1, 2)))
try:
    v1.major = 3
except Exception as e:
    print(type(e).__name__)
c = Cart("ravi"); c.items.append("pen")
print(c, asdict(c))
print(Cart(owner=123))               # not validated!`, lang: "python", title: "Hints are ignored at runtime; dataclasses use them" },
        { code: `{'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
12
Version(major=1, minor=2, tags=()) True True True
FrozenInstanceError
Cart(owner='ravi', items=['pen'], coupon=None) {'owner': 'ravi', 'items': ['pen'], 'coupon': None}
Cart(owner=123, items=[], coupon=None)`, lang: "text", title: "Output" },
        { code: `from pydantic import BaseModel, ValidationError

class CartIn(BaseModel):
    owner: str
    items: list[str] = []          # Pydantic copies defaults, so this is safe here
    qty: int

print(CartIn(owner="ravi", qty="3"))          # "3" coerced to int 3
try:
    CartIn(owner="ravi", qty="three")
except ValidationError as e:
    print(e.error_count(), "error:", e.errors()[0]["type"])`, lang: "python", title: "Pydantic validates at runtime" },
        { code: `owner='ravi' items=[] qty=3
1 error: int_parsing`, lang: "text", title: "Output" },
        { table: { head: ["", "Plain class", "<code>@dataclass</code>", "Pydantic <code>BaseModel</code>", "<code>NamedTuple</code>"], rows: [
          ["Boilerplate", "Write <code>__init__</code>/<code>__repr__</code>/<code>__eq__</code>", "Generated", "Generated", "Generated"],
          ["Runtime validation", "Manual", "No", "Yes (parse + coerce)", "No"],
          ["Mutability", "Mutable", "Mutable or <code>frozen=True</code>", "Mutable (configurable)", "Immutable tuple"],
          ["Speed / deps", "Fast, stdlib", "Fast, stdlib", "Extra dependency, validation cost", "Fast, stdlib"],
          ["Use for", "Behaviour-heavy objects", "Internal records, DTOs, configs", "API bodies, settings, parsing JSON from outside", "Small immutable records"]
        ] } },
        { h: "Typing essentials to know (3.10–3.12)" },
        { ul: [
          "Built-in generics <code>list[int]</code>, <code>dict[str, int]</code> (3.9+); unions <code>int | None</code> (3.10+) instead of <code>Optional[int]</code>.",
          "<code>Protocol</code> for structural ('duck') typing, <code>TypedDict</code> for dict shapes, <code>Literal</code>, <code>Callable</code>, <code>TypeVar</code>/generics; 3.12 adds <code>def first[T](xs: list[T]) -&gt; T</code> and the <code>type</code> alias statement.",
          "Run <code>mypy</code> or <code>pyright</code> in CI — that is where hints actually catch bugs."
        ] },
        { tip: "Good one-liner: 'Type hints are documentation the tooling can check.' Then mention that FastAPI is the place they become runtime behaviour — the function signature drives validation, conversion and the OpenAPI docs." }
      ]
    },

    /* ───────────── Concurrency & Memory ───────────── */
    {
      id: "gil-threading-multiprocessing-asyncio",
      q: "What is the GIL? When would you use threading, multiprocessing or asyncio in Python?",
      topic: "Concurrency & Memory",
      level: 2,
      top: true,
      short: "The Global Interpreter Lock is a mutex in CPython that lets only one thread execute Python bytecode at a time, which keeps reference counting simple but means threads can't speed up CPU-bound pure-Python code. The GIL is released during blocking I/O and inside many C extensions like NumPy. So use threads for I/O-bound work with blocking libraries, multiprocessing (or a ProcessPoolExecutor) for CPU-bound work since each process has its own interpreter and GIL, and asyncio for very high-concurrency I/O such as thousands of sockets using a single-threaded event loop.",
      a: [
        { p: "The <b>GIL</b> exists because CPython's memory management (reference counts) is not thread-safe; one big lock was simpler and faster for single-threaded code than fine-grained locks. Threads still switch (every ~5 ms or on blocking I/O), so you get <b>concurrency</b>, but not <b>parallel</b> execution of Python bytecode." },
        { table: { head: ["", "threading", "multiprocessing", "asyncio"], rows: [
          ["Model", "OS threads, shared memory, preemptive", "Separate processes, separate memory", "One thread, event loop, cooperative (<code>await</code>)"],
          ["GIL impact", "One thread runs Python at a time", "Each process has its own GIL → true parallelism", "N/A — single thread"],
          ["Best for", "I/O-bound with blocking libraries (requests, DB drivers)", "CPU-bound: image processing, number crunching in pure Python", "Massive I/O concurrency: web servers, crawlers, websockets"],
          ["Cost", "~MBs per thread, race conditions, need locks", "Process start-up, pickling data between processes", "Needs async libraries end to end; one blocking call stalls everything"],
          ["API", "<code>ThreadPoolExecutor</code>", "<code>ProcessPoolExecutor</code>, <code>multiprocessing.Pool</code>", "<code>async def</code>, <code>await</code>, <code>asyncio.gather</code>, <code>TaskGroup</code> (3.11+)"]
        ] } },
        { code: `import time, asyncio
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def cpu_task(n):                       # pure-Python CPU work: holds the GIL
    total = 0
    for i in range(n):
        total += i * i
    return total

def io_task(_):                        # blocking I/O releases the GIL
    time.sleep(0.2)

def timed(label, fn):
    t = time.perf_counter(); fn(); print(f"{label:<22}{time.perf_counter() - t:.2f}s")

async def fetch(i):
    await asyncio.sleep(0.2)           # yields to the event loop
    return i

async def main():
    return await asyncio.gather(*(fetch(i) for i in range(100)))

if __name__ == "__main__":             # required for multiprocessing on Windows/macOS
    N, jobs = 4_000_000, 4
    timed("CPU sequential", lambda: [cpu_task(N) for _ in range(jobs)])
    with ThreadPoolExecutor(jobs) as ex:
        timed("CPU threads", lambda: list(ex.map(cpu_task, [N] * jobs)))
    with ProcessPoolExecutor(jobs) as ex:
        timed("CPU processes", lambda: list(ex.map(cpu_task, [N] * jobs)))
    with ThreadPoolExecutor(jobs) as ex:
        timed("I/O threads (4x0.2s)", lambda: list(ex.map(io_task, range(jobs))))
    timed("asyncio 100x0.2s", lambda: asyncio.run(main()))`, lang: "python", title: "Measure it (timings vary by machine)" },
        { code: `CPU sequential        1.38s
CPU threads           1.84s
CPU processes         1.01s
I/O threads (4x0.2s)  0.20s
asyncio 100x0.2s      0.21s`, lang: "text", title: "Output" },
        { p: "Threads give no speed-up on CPU work (sometimes they're slower because of lock contention); processes run in parallel, though here part of the gain is eaten by process start-up and pickling (spawning is especially slow on Windows, so processes pay off for longer jobs); for I/O, both threads and asyncio overlap the waiting — asyncio finishes 100 waits in about the time of one." },
        { warn: "The GIL does <b>not</b> make your code thread-safe. <code>counter += 1</code> is several bytecodes (load, add, store) and threads can interleave between them — use <code>threading.Lock</code>, <code>queue.Queue</code> or atomic designs. See <a href=\"#/core/os/race-condition\">race conditions</a>." },
        { tip: "Version note for strong candidates: PEP 703 added an optional <b>free-threaded</b> CPython build (no GIL) — experimental in 3.13, officially supported but still opt-in in 3.14. The default build still has the GIL, so the advice above holds. Also: <code>asyncio.to_thread()</code> (3.9+) runs a blocking call in a thread from async code." }
      ]
    },
    {
      id: "memory-management-gc",
      q: "How does Python manage memory with reference counting and the cyclic garbage collector?",
      topic: "Concurrency & Memory",
      level: 2,
      top: true,
      short: "CPython keeps a reference count in every object; it goes up when a name, container or argument refers to the object and down when the reference goes away, and the object is freed immediately when it hits zero. That is deterministic but can't free reference cycles, such as two objects pointing at each other, so a generational cyclic garbage collector periodically finds groups of container objects that are only reachable from each other and frees them. Small objects come from the pymalloc allocator's private pools, and weakref lets you reference an object without keeping it alive.",
      a: [
        { h: "1. Reference counting (primary mechanism)" },
        { p: "Every object header stores <code>ob_refcnt</code>. Binding a name, putting the object in a list, or passing it to a function increments it; <code>del</code>, rebinding, or leaving scope decrements it. At zero the object is deallocated <b>immediately</b> (its <code>__del__</code> runs, memory goes back to the allocator)." },
        { h: "2. Cyclic garbage collector (the <code>gc</code> module)" },
        { p: "Reference counting can't reclaim cycles (<code>a.other = b; b.other = a</code>). The cyclic GC tracks container objects (lists, dicts, instances…) and periodically subtracts internal references within a group; anything left with zero external references is unreachable garbage. Objects are grouped into <b>generations</b> (young objects are scanned often, survivors less often) because most objects die young. Python 3.14 made the collector incremental (a young and an old generation, scanned in slices) to shorten pauses — the core idea is unchanged." },
        { code: `import sys, gc, weakref

x = []
print("refcount:", sys.getrefcount(x))      # +1 for the getrefcount argument itself
y = x
print("after alias:", sys.getrefcount(x))
del y

class Node:
    def __init__(self, name): self.name = name
    def __del__(self): print("  freed", self.name)

print("refcount drop:")
n = Node("solo"); del n                   # freed immediately at refcount 0

print("cycle:")
gc.disable()                              # so the demo controls when GC runs
a, b = Node("a"), Node("b")
a.other, b.other = b, a                   # reference cycle
del a, b                                  # refcounts stay at 1 -> not freed
print("  collected:", gc.collect())        # cyclic GC finds and frees them
gc.enable()

cache = weakref.WeakValueDictionary()     # does not keep values alive
obj = Node("cached"); cache["k"] = obj
print("in cache:", "k" in cache)
del obj
print("in cache after del:", "k" in cache)
print("thresholds:", gc.get_threshold())`, lang: "python", title: "Refcounts, cycles and weak references" },
        { code: `refcount: 2
after alias: 3
refcount drop:
  freed solo
cycle:
  freed a
  freed b
  collected: 2
in cache: True
  freed cached
in cache after del: False
thresholds: (700, 10, 10)`, lang: "text", title: "Output" },
        { ul: [
          "<b>pymalloc</b>: objects ≤ 512 bytes come from arenas/pools owned by Python; freed memory is reused by Python but not always returned to the OS, so RSS can stay high after a big list is deleted.",
          "Memory 'leaks' in Python are usually lingering references: global caches, unbounded <code>lru_cache</code>, closures, or keeping tensors with graphs in a list. Diagnose with <code>tracemalloc</code>, <code>gc.get_referrers</code>, or <code>objgraph</code>.",
          "<code>__slots__</code> removes the per-instance <code>__dict__</code> and saves a lot of memory for millions of small objects."
        ] },
        { tip: "Contrast with Java's tracing GC (<a href=\"#/core/oops/garbage-collection\">garbage collection</a>): Java has no refcounts and frees nothing until a GC cycle; CPython frees most objects instantly, which is why <code>with open()</code> 'happens to' close files even when people forget — but you should still use <code>with</code> because PyPy and other implementations don't refcount." }
      ]
    },

    /* ───────────── Tooling & Idioms ───────────── */
    {
      id: "venv-pip-packaging",
      q: "Why use virtual environments in Python? How do pip, requirements.txt and pyproject.toml fit together?",
      topic: "Tooling & Idioms",
      level: 1,
      top: false,
      short: "A virtual environment is an isolated directory with its own interpreter link and site-packages, so each project can pin its own dependency versions without clashing with other projects or the system Python. pip installs packages from PyPI into the active environment. requirements.txt is a simple list of pinned versions for reproducing an environment, while pyproject.toml is the modern standard file that declares project metadata, dependencies and the build system. Tools like Poetry or uv add lock files and faster resolution on top.",
      a: [
        { code: `# create and activate an isolated environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\\Scripts\\activate
python -m pip install --upgrade pip
pip install fastapi "uvicorn[standard]" pytest

pip freeze > requirements.txt      # pin exact versions currently installed
pip install -r requirements.txt    # reproduce on another machine / in Docker
pip list --outdated
deactivate

# modern, much faster alternative (Rust-based)
uv venv && uv pip install -r requirements.txt
uv add fastapi                     # updates pyproject.toml + uv.lock`, lang: "bash", title: "Everyday commands" },
        { code: `[project]
name = "placement-api"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi>=0.115",
  "sqlalchemy>=2.0,<3",
]

[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"`, lang: "text", title: "pyproject.toml (PEP 621)" },
        { table: { head: ["File / tool", "Purpose"], rows: [
          ["<code>venv</code> (stdlib)", "Isolated interpreter + site-packages per project"],
          ["<code>pip</code>", "Installer; resolves and installs from PyPI (wheels preferred over source builds)"],
          ["<code>requirements.txt</code>", "Flat list of (pinned) packages — easy reproducibility for apps and Dockerfiles"],
          ["<code>pyproject.toml</code>", "Standard project config: metadata, dependency ranges, build backend, tool settings (ruff, pytest, mypy)"],
          ["Lock file (<code>poetry.lock</code>, <code>uv.lock</code>)", "Exact resolved versions incl. transitive deps, with hashes"],
          ["<code>conda</code>", "Environments + non-Python binaries (CUDA, MKL) — common in data science"]
        ] } },
        { ul: [
          "Library vs app: a <b>library</b> declares loose ranges (<code>&gt;=2.0,&lt;3</code>) so it composes with others; an <b>app</b> pins exact versions (lock file) for reproducible deploys.",
          "Always run <code>python -m pip</code> to be sure you install into the interpreter you'll run.",
          "Never <code>sudo pip install</code> into the system Python — newer Linux distros block it (PEP 668, 'externally managed environment').",
          "Commit <code>pyproject.toml</code> and the lock file; add <code>.venv/</code> to <code>.gitignore</code>."
        ] },
        { tip: "Tie it to deployment: in a Dockerfile you <code>COPY requirements.txt</code> and <code>pip install</code> <b>before</b> copying source so the dependency layer is cached — see <a href=\"#/core/se/docker-basics\">Docker basics</a>. Mention the 'works on my machine' problem as the reason all of this exists." }
      ]
    },
    {
      id: "pythonic-idioms",
      q: "What does 'Pythonic' code mean, and which idioms would you use in an interview?",
      topic: "Tooling & Idioms",
      level: 1,
      top: false,
      short: "Pythonic code uses the language's built-in features the way they were intended, so it's shorter, clearer and usually faster: iterating directly instead of with index counters, enumerate and zip, comprehensions, unpacking and swapping in one line, dict.get and defaultdict, any, all, sum and sorted with key functions, f-strings, with for resources, and EAFP-style exception handling. It follows PEP 8 and the Zen of Python, where readability counts.",
      a: [
        { table: { head: ["Instead of…", "Write"], rows: [
          ["<code>for i in range(len(xs)): print(i, xs[i])</code>", "<code>for i, x in enumerate(xs):</code>"],
          ["Index-based parallel loops", "<code>for a, b in zip(xs, ys, strict=True):</code> (3.10+)"],
          ["<code>tmp = a; a = b; b = tmp</code>", "<code>a, b = b, a</code>"],
          ["Building a list with <code>append</code> in a loop", "<code>[f(x) for x in xs if cond(x)]</code>"],
          ["<code>if k in d: v = d[k] else: v = 0</code>", "<code>d.get(k, 0)</code>, <code>defaultdict</code>, <code>Counter</code>"],
          ["<code>if len(xs) == 0</code>", "<code>if not xs</code>"],
          ["<code>\"Hi \" + name + \"!\"</code>", "<code>f\"Hi {name}!\"</code>"],
          ["Manual open/close", "<code>with open(path) as f:</code>"],
          ["Flag variable in a search loop", "<code>any(...)</code>, <code>all(...)</code>, <code>next((x for x in xs if p(x)), None)</code>, or <code>for … else</code>"]
        ] } },
        { code: `from collections import Counter
words = "the quick brown fox jumps over the lazy dog the end".split()

freq = Counter(words)                                  # counting
print(freq.most_common(2))

by_len = sorted(set(words), key=lambda w: (-len(w), w))[:3]   # sort by key
print(by_len)

first, *middle, last = [1, 2, 3, 4, 5]                 # extended unpacking
print(first, middle, last)

squares = {n: n * n for n in range(5) if n % 2 == 0}   # dict comprehension
print(squares)

names, scores = ["a", "b", "c"], [90, 75, 82]
print(dict(zip(names, scores)), max(zip(scores, names))[1])

matrix = [[1, 2, 3], [4, 5, 6]]
print([list(col) for col in zip(*matrix)])             # transpose

print(any(len(w) > 4 for w in words), all(w.islower() for w in words))

for n in [3, 5, 7]:
    if n % 2 == 0:
        print("found even"); break
else:                                                  # runs if no break
    print("no even number")

if (n := len(words)) > 10:                             # walrus (3.8+)
    print(f"{n} words, {len(freq)} unique")`, lang: "python", title: "Idioms worth having at your fingertips" },
        { code: `[('the', 3), ('quick', 1)]
['brown', 'jumps', 'quick']
1 [2, 3, 4] 5
{0: 0, 2: 4, 4: 16}
{'a': 90, 'b': 75, 'c': 82} a
[[1, 4], [2, 5], [3, 6]]
True True
no even number
11 words, 9 unique`, lang: "text", title: "Output" },
        { ul: [
          "Know the standard library: <code>collections</code>, <code>itertools</code>, <code>functools</code> (<code>cache</code>, <code>partial</code>, <code>reduce</code>), <code>heapq</code>, <code>bisect</code>, <code>pathlib</code>, <code>dataclasses</code>.",
          "In coding rounds, <code>heapq</code> (min-heap), <code>deque</code> (BFS queue), <code>Counter</code>, <code>defaultdict(list)</code> (graphs) and <code>bisect</code> (binary search) save a lot of time.",
          "Use <code>ruff</code>/<code>black</code> for PEP 8 formatting rather than arguing about style."
        ] },
        { warn: "Pythonic doesn't mean clever. A nested three-level comprehension or a one-liner with side effects is less readable than a plain loop — 'Readability counts' (<code>import this</code>)." }
      ]
    },
  ]
});
