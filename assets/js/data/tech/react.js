/* tech stack: React — interview Q&A
   Function components + hooks only (React 18/19). JSX snippets are illustrative (not executed);
   every `javascript` snippet is plain Node and was executed by the validator. */
(window.TECH = window.TECH || []).push({
  id: "react",
  title: "React",
  short: "React",
  icon: "⚛",
  blurb: "With React on your resume, interviewers check that you understand rendering (virtual DOM, reconciliation, keys, what triggers a re-render), can use hooks correctly (state batching, effect dependencies and cleanup, memoisation that actually helps), and can pick a sensible state-management and data-fetching approach. Strong candidates also know React 18 concurrent rendering and what React 19 added.",
  topics: ["Fundamentals", "Hooks", "State & Data", "Rendering & Performance", "Modern React"],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "virtual-dom-reconciliation",
      q: "What is the virtual DOM, and how does React's reconciliation (diffing) work?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "The virtual DOM is a lightweight tree of plain JavaScript objects (React elements) that describes what the UI should look like. When state changes, React re-runs the component to get a new tree, diffs it against the previous one, and applies only the minimal set of real DOM mutations in a commit phase. The diff is a heuristic O(n) algorithm: a different element type means tear down and rebuild the subtree, the same type means update props, and keys identify list items across renders.",
      a: [
        { p: "Calling <code>&lt;Button color=\"blue\"/&gt;</code> does not touch the DOM; it creates a <b>React element</b>, a plain object like <code>{ type: Button, props: { color: 'blue' } }</code>. A tree of these objects is the <b>virtual DOM</b>. React keeps the previous tree (internally as a <i>fiber</i> tree) and on every update computes the difference." },
        { svg: `<svg viewBox="0 0 700 250" width="700" class="dg">
  <rect class="box-a" x="10" y="20" width="130" height="44" rx="8"/>
  <text class="tx tx-b" x="75" y="42" text-anchor="middle" dominant-baseline="middle">setState()</text>
  <rect class="box" x="180" y="20" width="150" height="44" rx="8"/>
  <text class="tx tx-b" x="255" y="36" text-anchor="middle" dominant-baseline="middle">Render phase</text>
  <text class="tx-s" x="255" y="54" text-anchor="middle" dominant-baseline="middle">call components (pure)</text>
  <rect class="box-p" x="370" y="20" width="150" height="44" rx="8"/>
  <text class="tx tx-b" x="445" y="36" text-anchor="middle" dominant-baseline="middle">Reconcile</text>
  <text class="tx-s" x="445" y="54" text-anchor="middle" dominant-baseline="middle">diff old vs new tree</text>
  <rect class="box-g" x="560" y="20" width="130" height="44" rx="8"/>
  <text class="tx tx-b" x="625" y="36" text-anchor="middle" dominant-baseline="middle">Commit phase</text>
  <text class="tx-s" x="625" y="54" text-anchor="middle" dominant-baseline="middle">patch real DOM</text>
  <line class="ln-a" x1="140" y1="42" x2="176" y2="42" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="330" y1="42" x2="366" y2="42" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="520" y1="42" x2="556" y2="42" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="90" y="100" text-anchor="middle">old tree</text>
  <rect class="box" x="60" y="110" width="60" height="28" rx="5"/>
  <text class="tx" x="90" y="124" text-anchor="middle" dominant-baseline="middle">div</text>
  <rect class="box" x="20" y="170" width="60" height="28" rx="5"/>
  <text class="tx" x="50" y="184" text-anchor="middle" dominant-baseline="middle">h1</text>
  <rect class="box" x="100" y="170" width="60" height="28" rx="5"/>
  <text class="tx" x="130" y="184" text-anchor="middle" dominant-baseline="middle">p "0"</text>
  <line class="ln" x1="80" y1="138" x2="55" y2="170"/>
  <line class="ln" x1="100" y1="138" x2="125" y2="170"/>
  <text class="tx-m" x="300" y="100" text-anchor="middle">new tree</text>
  <rect class="box" x="270" y="110" width="60" height="28" rx="5"/>
  <text class="tx" x="300" y="124" text-anchor="middle" dominant-baseline="middle">div</text>
  <rect class="box" x="230" y="170" width="60" height="28" rx="5"/>
  <text class="tx" x="260" y="184" text-anchor="middle" dominant-baseline="middle">h1</text>
  <rect class="box-w" x="310" y="170" width="60" height="28" rx="5"/>
  <text class="tx" x="340" y="184" text-anchor="middle" dominant-baseline="middle">p "1"</text>
  <line class="ln" x1="290" y1="138" x2="265" y2="170"/>
  <line class="ln" x1="310" y1="138" x2="335" y2="170"/>
  <line class="ln-d" x1="170" y1="184" x2="226" y2="184"/>
  <rect class="box-g" x="430" y="140" width="260" height="70" rx="8"/>
  <text class="tx tx-b" x="560" y="162" text-anchor="middle" dominant-baseline="middle">Only one DOM write:</text>
  <text class="tx-c" x="560" y="188" text-anchor="middle" dominant-baseline="middle">p.textContent = "1"</text>
  <line class="ln-a" x1="372" y1="184" x2="426" y2="178" marker-end="url(#dg-arr-a)"/>
</svg>`, caption: "Render produces a new element tree, reconciliation diffs it, commit applies only the changed bits to the real DOM" },
        { h: "The two heuristics that make diffing O(n)" },
        { ol: [
          "<b>Different type → replace.</b> If <code>&lt;div&gt;</code> becomes <code>&lt;section&gt;</code>, or <code>&lt;Profile&gt;</code> becomes <code>&lt;Settings&gt;</code>, React unmounts the whole old subtree (state is lost, effects clean up) and mounts a new one. It does not try to find moved subtrees.",
          "<b>Same type → update in place.</b> For DOM elements, only changed attributes are patched. For components, the same instance (and its state) is kept and re-rendered with new props.",
          "<b>Keys for lists.</b> Children are matched by <code>key</code> (or by position if there is no key), so reordered items keep their state and DOM nodes."
        ] },
        { code: `// Tiny illustration of the diff rules (not React's real code)
function diff(oldEl, newEl, path = "root") {
  if (!oldEl) return [path + ": CREATE <" + newEl.type + ">"];
  if (!newEl) return [path + ": REMOVE <" + oldEl.type + ">"];
  if (oldEl.type !== newEl.type) return [path + ": REPLACE <" + oldEl.type + "> with <" + newEl.type + ">"];
  const patches = [];
  for (const k of new Set([...Object.keys(oldEl.props), ...Object.keys(newEl.props)]))
    if (k !== "children" && oldEl.props[k] !== newEl.props[k]) patches.push(path + ": SET " + k + "=" + newEl.props[k]);
  const a = oldEl.props.children || [], b = newEl.props.children || [];
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    if (typeof a[i] === "string" || typeof b[i] === "string") { if (a[i] !== b[i]) patches.push(path + ": TEXT '" + b[i] + "'"); }
    else patches.push(...diff(a[i], b[i], path + "." + i));
  return patches;
}
const h = (type, props, ...children) => ({ type, props: { ...props, children } });
const before = h("div", { className: "card" }, h("h1", {}, "Count"), h("p", {}, "0"));
const after  = h("div", { className: "card active" }, h("h1", {}, "Count"), h("p", {}, "1"));
console.log(diff(before, after).join("\\n"));
console.log(diff(h("div", {}, h("p", {}, "x")), h("div", {}, h("span", {}, "x"))).join("\\n"));
// root: SET className=card active
// root.1: TEXT '1'
// root.0: REPLACE <p> with <span>`, lang: "javascript", title: "Diffing rules, simulated" },
        { warn: "\"The virtual DOM is faster than the DOM\" is a myth worth correcting politely. Diffing is extra work; the win is that you write declarative code and React batches minimal DOM writes for you. Hand-written targeted DOM updates can be faster. Frameworks like Svelte and Solid skip the virtual DOM entirely." },
        { tip: "Follow-up: \"What is Fiber?\" Fiber (React 16+) is the re-implementation of reconciliation as a linked list of units of work, so rendering can be paused, prioritised and resumed. It is what makes React 18 concurrent features (transitions, Suspense streaming) possible. The commit phase itself is still synchronous." }
      ]
    },
    {
      id: "jsx-and-components",
      q: "What is JSX, and what exactly is a React component?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "JSX is a syntax extension that lets you write HTML-like markup inside JavaScript; a compiler such as Babel, SWC or esbuild turns it into function calls that create React elements. A component is a JavaScript function that takes a props object and returns JSX describing a piece of UI. Components must start with a capital letter, should be pure during rendering, and are composed together like HTML tags.",
      a: [
        { p: "<b>JSX</b> is not HTML and not a template language; it is sugar for function calls. Since React 17 the <i>automatic JSX runtime</i> compiles it to <code>jsx()</code> calls imported from <code>react/jsx-runtime</code>, which is why you no longer need <code>import React</code> at the top of every file." },
        { code: [
          { lang: "jsx", src: `// What you write
function Greeting({ name, unread }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      {unread > 0 && <p>You have {unread} new messages</p>}
    </div>
  );
}

// Using it like an HTML tag, passing props
<Greeting name="Asha" unread={3} />` },
          { lang: "javascript", run: false, src: `// Roughly what the compiler emits (automatic runtime)
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function Greeting({ name, unread }) {
  return _jsxs("div", {
    className: "greeting",
    children: [
      _jsxs("h1", { children: ["Hello, ", name, "!"] }),
      unread > 0 && _jsxs("p", { children: ["You have ", unread, " new messages"] })
    ]
  });
}` }
        ], title: "JSX and its compiled form" },
        { h: "JSX rules people trip on" },
        { ul: [
          "<code>className</code> not <code>class</code>, <code>htmlFor</code> not <code>for</code>, camelCase events (<code>onClick</code>) and styles (<code>style={{ fontSize: 14 }}</code>).",
          "Return a <b>single root</b>; use a Fragment <code>&lt;&gt;…&lt;/&gt;</code> to avoid an extra div.",
          "<code>{}</code> embeds any <b>expression</b> (not statements): use ternaries, <code>&amp;&amp;</code> or <code>.map()</code> instead of if/for inside JSX.",
          "Lowercase tags are DOM elements (<code>&lt;div&gt;</code>), capitalised tags are components (<code>&lt;Card&gt;</code>).",
          "Text is escaped automatically, which prevents XSS; <code>dangerouslySetInnerHTML</code> is the explicit opt-out."
        ] },
        { h: "What makes a good component" },
        { ul: [
          "<b>Pure render:</b> same props + state → same JSX, no side effects (no fetching, no mutating outside variables) while rendering. Side effects go in event handlers or effects. StrictMode renders twice in development to catch impurity.",
          "<b>Single responsibility:</b> split when a component does unrelated things or grows past what fits on a screen.",
          "<b>Composition over configuration:</b> accept <code>children</code> instead of a dozen boolean props."
        ] },
        { warn: "<code>{count &amp;&amp; &lt;Badge/&gt;}</code> renders a literal <b>0</b> when <code>count</code> is 0, because 0 is a valid React child. Write <code>{count &gt; 0 &amp;&amp; &lt;Badge/&gt;}</code>." },
        { tip: "Class components still exist and still work, but all new code and all modern APIs (hooks, Server Components) are function-based. The one thing that still needs a class is an error boundary (or a library like react-error-boundary)." }
      ]
    },
    {
      id: "props-vs-state-data-flow",
      q: "What is the difference between props and state? What do one-way data flow and lifting state up mean?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Props are inputs passed from parent to child and are read-only in the child. State is data a component owns and changes over time with a setter, which triggers a re-render. Data flows one way, down the tree as props; children talk back by calling callback props. When two siblings need the same data, you lift the state up to their closest common parent and pass it down to both.",
      a: [
        { table: { head: ["", "Props", "State"], rows: [
          ["Owned by", "Parent component", "The component itself"],
          ["Mutable?", "Read-only inside the child", "Changed only via the setter (<code>setX</code>)"],
          ["Changing it", "Parent re-renders with new values", "<code>setState</code> schedules a re-render"],
          ["Purpose", "Configure a component, pass data and callbacks down", "Remember things between renders (input text, toggles, fetched data)"],
          ["Analogy", "Function arguments", "A function's private memory"]
        ] } },
        { p: "<b>One-way data flow:</b> data goes down as props; events go up through callbacks. A child never reaches up and edits its parent's data. This makes it easy to trace where a value came from: find the component that owns the state." },
        { h: "Lifting state up — a classic example" },
        { code: `import { useState } from "react";

// Before: each panel had its own isOpen, so both could be open at once.
// After: the parent owns "which panel is active" — a single source of truth.
export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        Placement-prep notes for SDE interviews.
      </Panel>
      <Panel title="Contact" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        Reach us at hello@example.com.
      </Panel>
    </>
  );
}

function Panel({ title, isActive, onShow, children }) {
  return (
    <section>
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}`, lang: "jsx", title: "Lifting state to the common parent" },
        { ul: [
          "Keep state <b>as low as possible</b> but as high as needed: the closest common ancestor of everything that reads it.",
          "Don't store what you can <b>derive</b>: if <code>fullName</code> is <code>first + ' ' + last</code>, compute it during render instead of keeping a third state variable that can drift out of sync.",
          "Don't copy props into state (<code>useState(props.value)</code>) unless you deliberately want an initial value only; later prop changes will be ignored."
        ] },
        { warn: "Mutating state directly (<code>user.name = 'x'; setUser(user)</code>) does nothing visible: React compares with <code>Object.is</code>, sees the same object reference and may skip the re-render. Always create a new object/array: <code>setUser({ ...user, name: 'x' })</code>." },
        { tip: "If lifting state causes many levels of prop passing, that is the moment to mention composition (passing JSX as children) or Context — see the prop-drilling question." }
      ]
    },
    {
      id: "lists-and-keys",
      q: "Why does React need keys in lists, and why are array indexes bad keys?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Keys tell React which list item is which between renders, so it can reuse the right component instance and DOM node when items are added, removed or reordered. With index keys the identity is the position, so inserting at the top makes every item take over the state of the item that used to be at its index, causing wrong input values, wrong checkbox state and extra DOM work. Use a stable unique id from the data instead.",
      a: [
        { p: "During reconciliation React matches old and new children <b>by key</b>. Same key → same component instance (state, refs, DOM node kept, props updated). New key → mount. Missing key → unmount." },
        { code: `// Each rendered row owns some state, e.g. text typed into its <input>.
function reconcile(oldRows, newItems, getKey) {
  const byKey = new Map(oldRows.map(r => [r.key, r]));
  return newItems.map((item, i) => {
    const key = getKey(item, i);
    const match = byKey.get(key);
    return { key, label: item, action: match ? "reuse" : "create", state: match ? match.state : "" };
  });
}

const before = ["Apple", "Banana"];
const after = ["Cherry", "Apple", "Banana"];          // prepend one item
const strategies = { "index as key": (_, i) => i, "id as key": item => item };

for (const [name, getKey] of Object.entries(strategies)) {
  const mounted = before.map((item, i) => ({ key: getKey(item, i), state: "note about " + item }));
  console.log(name);
  for (const r of reconcile(mounted, after, getKey))
    console.log("  " + r.label.padEnd(8) + r.action.padEnd(8) + JSON.stringify(r.state));
}
/*
index as key
  Cherry  reuse   "note about Apple"     <- Cherry shows Apple's text!
  Apple   reuse   "note about Banana"
  Banana  create  ""
id as key
  Cherry  create  ""
  Apple   reuse   "note about Apple"
  Banana  reuse   "note about Banana"
*/`, lang: "javascript", title: "Why index keys attach state to the wrong row" },
        { code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>              {/* stable id from the data */}
          <input type="checkbox" defaultChecked={todo.done} /> {todo.text}
        </li>
      ))}
    </ul>
  );
}`, lang: "jsx", title: "Correct: key from the data" },
        { ul: [
          "Keys must be <b>unique among siblings</b> and <b>stable across renders</b>; they don't need to be globally unique.",
          "Index keys are fine only when the list is static: never reordered, filtered or inserted into, and items hold no state.",
          "<code>key={Math.random()}</code> is the worst option: every render remounts every item, losing state and focus.",
          "The key goes on the outermost element returned from <code>map</code> (or on <code>&lt;Fragment key=…&gt;</code>), not inside the child component. Keys are not passed as a prop."
        ] },
        { tip: "Bonus trick interviewers like: changing a component's key on purpose resets it. <code>&lt;ProfileForm key={userId} /&gt;</code> throws away the old form state whenever the user changes, with no effect needed." }
      ]
    },
    {
      id: "controlled-vs-uncontrolled-forms",
      q: "What are controlled and uncontrolled inputs? How do you handle forms in React?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "A controlled input gets its value from React state and reports every change through onChange, so React is the single source of truth and you can validate or transform on each keystroke. An uncontrolled input keeps its own value in the DOM; you read it when needed through a ref or FormData on submit. Small forms can use either; large forms usually use a library like React Hook Form, and React 19 adds form actions with useActionState.",
      a: [
        { code: [
          { lang: "jsx", src: `import { useState } from "react";

function SignupControlled() {
  const [email, setEmail] = useState("");
  const isValid = /^\\S+@\\S+\\.\\S+$/.test(email);

  return (
    <form onSubmit={e => { e.preventDefault(); register(email); }}>
      <input
        type="email"
        value={email}                                  // React owns the value
        onChange={e => setEmail(e.target.value.trim())}
      />
      {!isValid && email && <small>Enter a valid email</small>}
      <button disabled={!isValid}>Sign up</button>
    </form>
  );
}` },
          { lang: "jsx", src: `function SignupUncontrolled() {
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);  // the DOM owns the values
    register(data.get("email"));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" defaultValue="" required />
      <button>Sign up</button>
    </form>
  );
}` }
        ], title: "Controlled vs uncontrolled" },
        { table: { head: ["", "Controlled", "Uncontrolled"], rows: [
          ["Source of truth", "React state", "The DOM"],
          ["Props used", "<code>value</code> + <code>onChange</code> (<code>checked</code> for checkboxes)", "<code>defaultValue</code> / <code>defaultChecked</code>, <code>name</code>, a ref"],
          ["Re-renders", "On every keystroke", "None while typing"],
          ["Good for", "Live validation, formatting, dependent fields, disabling submit", "Simple forms, file inputs (always uncontrolled), wrapping non-React widgets"]
        ] } },
        { h: "Forms in practice" },
        { ul: [
          "<b>React Hook Form</b> (uncontrolled by default, registers inputs via refs) + a schema validator like <b>Zod</b> is the common production choice: very few re-renders, good TypeScript support.",
          "<b>React 19 form actions:</b> <code>&lt;form action={fn}&gt;</code> calls <code>fn(formData)</code>; <code>useActionState</code> gives you the returned state and a pending flag, <code>useFormStatus</code> lets a submit button know the parent form is pending. In Next.js the action can be a Server Action.",
          "Always validate again on the server: client validation is UX, not security."
        ] },
        { warn: "Passing <code>value</code> without <code>onChange</code> makes a read-only input (React warns). Switching between <code>value={undefined}</code> and a string flips the input from uncontrolled to controlled and triggers the \"changing an uncontrolled input to be controlled\" warning — initialise with <code>''</code>, not <code>undefined</code>." },
        { tip: "<code>e.preventDefault()</code> in onSubmit stops the browser's full-page form submission. With a React 19 <code>action</code> prop React handles that for you and also resets uncontrolled fields after a successful submit." }
      ]
    },

    /* ───────────── Hooks ───────────── */
    {
      id: "usestate-batching-stale-state",
      q: "How does useState work? What are batching, functional updates and stale state?",
      topic: "Hooks",
      level: 2,
      top: true,
      short: "useState returns the current value and a setter. Calling the setter does not change the variable immediately; it queues an update and React re-renders later, and since React 18 all updates in the same event, timeout or promise are batched into one render. Inside one render the state variable is a constant snapshot, so calling setCount(count + 1) three times only adds one. Use the functional form setCount(c => c + 1) when the next value depends on the previous one.",
      a: [
        { p: "Each render is a <b>snapshot</b>: <code>count</code> is a plain constant captured by that render's handlers and effects. <code>setCount</code> asks React for a new render where <code>count</code> has a new value; it never mutates the current one." },
        { code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function addThreeWrong() {
    setCount(count + 1);   // queue "replace with 0 + 1"
    setCount(count + 1);   // queue "replace with 0 + 1"
    setCount(count + 1);   // queue "replace with 0 + 1"
    console.log(count);    // still 0 — this render's snapshot
  }                        // result after re-render: 1

  function addThree() {
    setCount(c => c + 1);  // queue "take previous, add 1"
    setCount(c => c + 1);
    setCount(c => c + 1);
  }                        // result after re-render: 3

  return <button onClick={addThree}>{count}</button>;
}`, lang: "jsx", title: "Snapshot semantics" },
        { code: `// How React processes the update queue for one state hook
const processQueue = (base, queue) =>
  queue.reduce((state, update) => (typeof update === "function" ? update(state) : update), base);

const count = 0; // value seen by the handler's render
console.log(processQueue(count, [count + 1, count + 1, count + 1]));       // 1
console.log(processQueue(count, [c => c + 1, c => c + 1, c => c + 1]));    // 3
console.log(processQueue(count, [count + 5, c => c + 1]));                 // 6`, lang: "javascript", title: "Value updates vs updater functions" },
        { h: "Batching" },
        { ul: [
          "<b>React 17:</b> updates were batched only inside React event handlers; in <code>setTimeout</code>, promises or native listeners each <code>setState</code> caused its own render.",
          "<b>React 18+ (createRoot):</b> <b>automatic batching</b> everywhere — handlers, timeouts, promises, native events. Several setters in a row produce one render.",
          "Need the DOM updated synchronously right now (rare, e.g. to measure before scrolling)? <code>flushSync(() =&gt; setX(v))</code> from <code>react-dom</code>."
        ] },
        { h: "Stale state / stale closures" },
        { code: `function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // BUG: closure captured seconds = 0 forever -> shows 1, 1, 1 ...
    // const id = setInterval(() => setSeconds(seconds + 1), 1000);

    // FIX: updater function always receives the latest value
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds}s</p>;
}`, lang: "jsx", title: "The classic interval bug" },
        { ul: [
          "Lazy initial state: <code>useState(() =&gt; expensiveParse(raw))</code> runs the function only on the first render; <code>useState(expensiveParse(raw))</code> runs it every render and throws the result away.",
          "Setting the same value (<code>Object.is</code> equal) lets React bail out of re-rendering children.",
          "Several related values that change together → one object in state or <code>useReducer</code>."
        ] },
        { tip: "Interview one-liner: \"State updates are asynchronous and batched; the state variable is a snapshot for that render; use an updater function when the new state depends on the old.\"" }
      ]
    },
    {
      id: "useeffect-deps-cleanup",
      q: "How does useEffect work? What do the dependency array and cleanup do, and what are the common bugs?",
      topic: "Hooks",
      level: 2,
      top: true,
      short: "useEffect runs a side effect after React has committed the render to the screen, to synchronise the component with something outside React such as a subscription, timer, socket or manual DOM API. The dependency array controls when it re-runs: no array means after every render, an empty array means once after mount, and listed values mean whenever one of them changes. The function you return is the cleanup, which runs before the next effect and on unmount. Common bugs are missing dependencies, infinite loops and forgetting cleanup.",
      a: [
        { table: { head: ["Dependency array", "Effect runs", "Typical use"], rows: [
          ["<i>omitted</i>", "After every render", "Rarely what you want"],
          ["<code>[]</code>", "After the first render (mount); cleanup on unmount", "Subscribe once, connect a widget"],
          ["<code>[roomId, user]</code>", "After mount and whenever any listed value changes (<code>Object.is</code>)", "Re-sync when inputs change"]
        ] } },
        { code: `import { useEffect, useState } from "react";

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const conn = createConnection(roomId);         // setup
    conn.on("message", m => setMessages(prev => [...prev, m]));
    conn.connect();

    return () => conn.disconnect();                 // cleanup
  }, [roomId]);                                     // re-sync when roomId changes

  return <MessageList items={messages} />;
}
// roomId "general" -> "random":
//   1. render with "random"   2. commit DOM
//   3. cleanup of "general" effect (disconnect)   4. run effect for "random" (connect)`, lang: "jsx", title: "Setup, cleanup, re-sync" },
        { h: "Common bugs" },
        { ul: [
          "<b>Missing dependencies</b> → the effect reads stale props/state. Trust the <code>react-hooks/exhaustive-deps</code> lint rule; if a dependency changes too often, restructure (move the object inside the effect, use an updater function) rather than silencing the rule.",
          "<b>Infinite loop</b>: the effect sets state that is also a dependency, or depends on an object/array/function created fresh every render (<code>{}</code> !== <code>{}</code>).",
          "<b>No cleanup</b>: intervals, listeners and sockets keep running after unmount (leaks, \"setState on unmounted component\" bugs, duplicate subscriptions).",
          "<b>Fetch race conditions</b>: a slow old request resolves after a fast new one and overwrites it. Use an <code>ignore</code> flag or <code>AbortController</code> in the cleanup (see data fetching).",
          "<b><code>async</code> effect function</b>: <code>useEffect(async () =&gt; …)</code> returns a Promise, not a cleanup. Define an async function inside and call it."
        ] },
        { warn: "In development with <code>&lt;StrictMode&gt;</code>, React 18+ mounts, unmounts and re-mounts every component once, so effects run <b>setup → cleanup → setup</b>. That is intentional: it exposes effects with missing cleanup. Don't \"fix\" it with a ref flag; write a correct cleanup. Production runs once." },
        { ul: [
          "<code>useLayoutEffect</code> runs synchronously after DOM mutation but <b>before paint</b>: use it only to measure layout and adjust (tooltips) without flicker.",
          "React 19.2 adds <code>useEffectEvent</code> for logic that should read the latest props inside an effect without becoming a dependency (e.g. a theme used when logging a connection)."
        ] },
        { tip: "Frame effects as <b>synchronisation</b>, not lifecycle: \"keep this external system in sync with these values\" rather than \"run on mount\". Interviewers who know React well listen for that wording." }
      ]
    },
    {
      id: "when-not-to-use-effect",
      q: "When should you NOT use useEffect?",
      topic: "Hooks",
      level: 2,
      top: false,
      short: "Effects are an escape hatch for synchronising with systems outside React. You don't need one to compute derived values from props or state (calculate during render, or useMemo if expensive), to respond to a user event (do it in the event handler), to reset state when a prop changes (use a key), or to pass data to a parent (call the callback in the handler). Fetching is better done by a framework or a library like React Query than a hand-written effect.",
      a: [
        { p: "Unnecessary effects cause an extra render pass (render → effect sets state → render again), flashes of stale UI and chains of effects that are hard to follow." },
        { table: { head: ["Situation", "Effect-based anti-pattern", "Better"], rows: [
          ["Derived data", "<code>useEffect(() =&gt; setFiltered(todos.filter(f)), [todos, f])</code>", "<code>const filtered = todos.filter(f)</code> during render; <code>useMemo</code> if expensive"],
          ["User action", "Set a flag in onClick, react to it in an effect to POST", "Call the API directly in the event handler"],
          ["Reset all state when a prop changes", "<code>useEffect(() =&gt; setComment(''), [userId])</code>", "<code>&lt;Profile key={userId} /&gt;</code>"],
          ["Notify parent of change", "Effect calls <code>onChange(value)</code> after state updates", "Call <code>onChange</code> in the same handler that sets state, or lift state up"],
          ["Initialise app once", "Effect with <code>[]</code> in root (runs twice in dev)", "Module-level code or a guarded top-level call"],
          ["Subscribe to external store", "Manual subscribe/unsubscribe effect", "<code>useSyncExternalStore</code>"]
        ] } },
        { code: `// Anti-pattern: redundant state + effect
function TodoList({ todos, filter }) {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    setVisible(todos.filter(t => matches(t, filter)));
  }, [todos, filter]);              // extra render, one frame of stale list
  return <List items={visible} />;
}

// Better: derive during render
function TodoList({ todos, filter }) {
  const visible = useMemo(() => todos.filter(t => matches(t, filter)), [todos, filter]);
  return <List items={visible} />;
}`, lang: "jsx", title: "Derive, don't sync" },
        { p: "<b>Rule of thumb:</b> ask <i>why</i> the code runs. Because the user did something → event handler. Because the component is on screen and must stay in sync with something external (socket, browser API, non-React widget, analytics on view) → effect." },
        { warn: "Effect chains (\"effect A sets X, effect B watches X and sets Y\") are a smell: each link costs a render and makes the order of updates hard to reason about. Compute everything you can in the handler that started the change." },
        { tip: "This topic is straight from the official react.dev page \"You Might Not Need an Effect\". Naming it shows you've read current docs, not 2019 tutorials." }
      ]
    },
    {
      id: "useref-uses",
      q: "What is useRef used for, and how is it different from useState?",
      topic: "Hooks",
      level: 1,
      top: true,
      short: "useRef returns a mutable object with a current property that persists across renders. Changing ref.current does not trigger a re-render, which makes refs suitable for two things: holding a reference to a DOM node (focus, scroll, measure, third-party widgets) and storing mutable values that don't affect what is rendered, such as a timer id or the previous value. If the value should appear on screen, it belongs in state.",
      a: [
        { table: { head: ["", "useState", "useRef"], rows: [
          ["Returns", "<code>[value, setValue]</code>", "<code>{ current: value }</code>"],
          ["Change triggers re-render?", "Yes", "No"],
          ["Update timing", "Next render (snapshot)", "Immediately (plain mutation)"],
          ["Read during render?", "Yes", "Avoid (except lazy init) — it makes render impure"],
          ["Use for", "Anything shown in the UI", "DOM nodes, timer ids, previous values, instance-like variables"]
        ] } },
        { code: `import { useRef, useState } from "react";

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);   // not rendered -> ref
  const inputRef = useRef(null);      // DOM node

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }
  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    inputRef.current.focus();          // imperative DOM access
  }

  return (
    <>
      <p>{elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <input ref={inputRef} placeholder="Lap note" />
    </>
  );
}`, lang: "jsx", title: "Both uses of useRef" },
        { h: "Refs to child components" },
        { ul: [
          "<b>React 19:</b> <code>ref</code> is a regular prop on function components: <code>function Input({ ref, ...props }) { return &lt;input ref={ref} {...props}/&gt; }</code>.",
          "<b>React 18 and earlier:</b> wrap the child in <code>forwardRef</code> (now deprecated going forward).",
          "<code>useImperativeHandle(ref, () =&gt; ({ focus, clear }))</code> exposes a limited API instead of the raw DOM node."
        ] },
        { warn: "<code>ref.current</code> is <code>null</code> during the first render; the DOM node is attached during commit. Read DOM refs in effects or event handlers, never in the render body." },
        { tip: "Callback refs (<code>ref={node =&gt; …}</code>) run when the node attaches/detaches; useful for measuring an element that may appear later. In React 19 a callback ref may return a cleanup function." }
      ]
    },
    {
      id: "rules-of-hooks",
      q: "What are the rules of hooks, and why do they exist?",
      topic: "Hooks",
      level: 1,
      top: true,
      short: "Only call hooks at the top level of a function component or custom hook, never inside conditions, loops, nested functions or after an early return, and only call them from React functions, not plain JavaScript functions. The reason is that React does not identify hooks by name; it stores each component's hook state in an ordered list and matches calls by their position. If the order changes between renders, a hook reads another hook's state.",
      a: [
        { ol: [
          "<b>Top level only:</b> not inside <code>if</code>, loops, nested functions, <code>try/catch</code>, or after a conditional <code>return</code>.",
          "<b>React functions only:</b> function components and custom hooks (names starting with <code>use</code>)."
        ] },
        { p: "Internally each component instance (fiber) has a linked list of hook slots. The first <code>useState</code> call gets slot 0, the second slot 1 and so on. This toy implementation shows exactly what breaks:" },
        { code: `// Toy hooks runtime: state stored by call ORDER, like React
let slots = [], cursor = 0;
function useState(initial) {
  const i = cursor++;
  if (slots.length <= i) slots.push(initial);
  const setState = v => { slots[i] = typeof v === "function" ? v(slots[i]) : v; };
  return [slots[i], setState];
}
const render = (Component, props) => { cursor = 0; return Component(props); };

function Profile({ showAge }) {
  const [name] = useState("Asha");
  let age;
  if (showAge) [age] = useState(21);   // conditional hook: breaks the rules
  const [city] = useState("Pune");
  return { name, age, city };
}

console.log(render(Profile, { showAge: true }));   // { name: 'Asha', age: 21, city: 'Pune' }
console.log(render(Profile, { showAge: false }));  // { name: 'Asha', age: undefined, city: 21 }
// city read slot 1, which belongs to age`, lang: "javascript", title: "Why order matters" },
        { code: `// Wrong
function Profile({ userId }) {
  if (!userId) return null;
  const [user, setUser] = useState(null);   // called conditionally
}

// Right: hooks first, condition inside or after
function Profile({ userId }) {
  const [user, setUser] = useState(null);
  if (!userId) return null;
  return <UserCard user={user} />;
}`, lang: "jsx", title: "Early returns come after hooks" },
        { ul: [
          "Enforced by the <code>eslint-plugin-react-hooks</code> <code>rules-of-hooks</code> rule; keep it on.",
          "Need conditional behaviour? Put the condition <i>inside</i> the hook (<code>useEffect(() =&gt; { if (!enabled) return; … })</code>) or conditionally render a child component that uses the hook.",
          "Exception: React 19's <code>use(promiseOrContext)</code> is not a hook in this sense and <b>may</b> be called inside conditions and loops (still only during render)."
        ] },
        { tip: "If asked \"how does React know which useState is which?\" — answer \"by call order on the fiber's hook list\" and the rules become self-explanatory." }
      ]
    },
    {
      id: "custom-hooks",
      q: "What are custom hooks, and how would you write one?",
      topic: "Hooks",
      level: 2,
      top: true,
      short: "A custom hook is a JavaScript function whose name starts with use and which calls other hooks, letting you extract and reuse stateful logic between components. Each component that calls it gets its own independent state; hooks share logic, not state. Good examples are useDebounce, useLocalStorage, useOnlineStatus or useFetch. They replaced older patterns like higher-order components and render props for logic reuse.",
      a: [
        { p: "If two components contain the same <code>useState</code> + <code>useEffect</code> combination, move it into a function called <code>useSomething</code>. The <code>use</code> prefix matters: it tells the linter (and readers) that the rules of hooks apply inside." },
        { code: `import { useEffect, useState } from "react";

// Returns value only after it has stopped changing for "delay" ms
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);           // restart timer on every change
  }, [value, delay]);

  return debounced;
}

// Usage: search box that queries only after the user pauses typing
function SearchUsers() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const { data, isLoading } = useUserSearch(debouncedQuery);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {isLoading ? <Spinner /> : <UserList users={data} />}
    </>
  );
}`, lang: "jsx", title: "useDebounce" },
        { code: `import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;          // private mode / bad JSON
    }
  });

  function update(next) {
    setValue(prev => {
      const resolved = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  }

  return [value, update];
}

// const [theme, setTheme] = useLocalStorage("theme", "light");`, lang: "jsx", title: "useLocalStorage (same shape as useState)" },
        { ul: [
          "<b>Logic, not state, is shared:</b> two components calling <code>useDebounce</code> each get their own timer and value. For shared state use context or a store.",
          "Return what callers need: a tuple for useState-like hooks, an object (<code>{ data, error, isLoading }</code>) when there are many fields.",
          "Don't create \"lifecycle\" hooks like <code>useMount</code>; name hooks after the purpose (<code>useOnlineStatus</code>, <code>useChatRoom</code>).",
          "Custom hooks are easy to unit test with <code>renderHook</code> from React Testing Library."
        ] },
        { tip: "Compare with what came before: HOCs (<code>withUser(Component)</code>) and render props caused \"wrapper hell\" and prop-name collisions. Hooks compose as plain function calls." }
      ]
    },

    /* ───────────── State & Data ───────────── */
    {
      id: "context-prop-drilling",
      q: "What is prop drilling, and how does the Context API solve it? What are its downsides?",
      topic: "State & Data",
      level: 2,
      top: true,
      short: "Prop drilling is passing a prop through several intermediate components that don't use it, just to reach a deep child. Context lets a provider make a value available to any descendant, which reads it with useContext, skipping the middle layers. Its main downside is performance: every consumer re-renders whenever the provider's value changes, so it suits low-frequency global data like theme, locale or the logged-in user, not rapidly changing state.",
      a: [
        { code: `import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // memoise so consumers don't re-render on every parent render
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user]);
  return <AuthContext value={value}>{children}</AuthContext>;   // React 19
  // React 18: <AuthContext.Provider value={value}>
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// Any depth below the provider:
function NavbarAvatar() {
  const { user, logout } = useAuth();
  return user ? <button onClick={logout}>{user.name}</button> : <LoginLink />;
}`, lang: "jsx", title: "Context + custom hook pattern" },
        { h: "Downsides and how to mitigate them" },
        { ul: [
          "<b>All consumers re-render</b> when the value changes (compared with <code>Object.is</code>). There's no built-in selector. Mitigate by splitting contexts (state vs dispatch, theme vs user) and memoising the value object.",
          "Passing <code>value={{ user, setUser }}</code> inline creates a new object every render → every consumer re-renders even if <code>user</code> didn't change.",
          "Components that use context are less reusable and harder to test in isolation (you need to wrap them in the provider).",
          "Context is a <b>transport</b> mechanism, not a state manager: it has no middleware, devtools or derived state."
        ] },
        { p: "<b>Try composition first.</b> Often the middle components don't need to know about the prop at all if you pass the rendered child down instead:" },
        { code: `// Instead of Layout -> Sidebar -> Menu -> Avatar all receiving "user"...
<Layout sidebar={<Sidebar footer={<Avatar user={user} />} />} />`, lang: "jsx", title: "Composition avoids drilling without context" },
        { tip: "Context implements a form of the observer pattern — consumers subscribe to the nearest provider (<a href=\"#/core/oops/observer-pattern\">see Observer pattern</a>). Mention that libraries like Zustand or Redux use selectors so components re-render only when their slice changes." }
      ]
    },
    {
      id: "state-management-choices",
      q: "How do you choose between local state, Context, Redux/Zustand and server-state libraries like React Query?",
      topic: "State & Data",
      level: 2,
      top: true,
      short: "First separate server state from client state. Server state, data that lives on the backend and is cached on the client, is best handled by TanStack Query, SWR or your framework, which give caching, deduplication, refetching and invalidation for free. Client state should stay local with useState or useReducer whenever possible, use Context for rarely-changing global values, and reach for Zustand or Redux Toolkit when lots of components read and update shared, frequently changing state.",
      a: [
        { table: { head: ["Kind of state", "Tool", "Why"], rows: [
          ["Local UI (input text, open/closed)", "<code>useState</code> / <code>useReducer</code>", "Simplest; lives and dies with the component"],
          ["Global, rarely changes (theme, locale, auth user)", "Context", "Built in; re-render cost acceptable"],
          ["Global, changes often, many readers (editor, cart, filters)", "Zustand, Redux Toolkit, Jotai", "Selectors → only affected components re-render; devtools; middleware"],
          ["Server data (lists, profiles, search results)", "TanStack Query, SWR, RTK Query, Next.js server fetching", "Caching, dedupe, background refetch, retries, stale-while-revalidate, invalidation after mutations"],
          ["URL state (page, filters, tab)", "Router search params", "Shareable, survives refresh, back button works"],
          ["Form state", "React Hook Form / form actions", "Validation, dirty/touched tracking, few re-renders"]
        ] } },
        { p: "<code>useReducer</code> is the step between useState and a store: all transitions in one pure function, easy to test. Redux uses exactly the same reducer idea at app scope." },
        { code: `function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const found = state.items.find(i => i.id === action.item.id);
      const items = found
        ? state.items.map(i => (i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { ...action.item, qty: 1 }];
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    default:
      throw new Error("unknown action " + action.type);
  }
}

const actions = [
  { type: "add", item: { id: 1, name: "Pen", price: 10 } },
  { type: "add", item: { id: 2, name: "Book", price: 250 } },
  { type: "add", item: { id: 1, name: "Pen", price: 10 } },
  { type: "remove", id: 2 }
];
const s0 = { items: [] };
const final = actions.reduce(cartReducer, s0);
console.log(JSON.stringify(final.items));       // [{"id":1,"name":"Pen","price":10,"qty":2}]
console.log("original untouched:", s0.items.length === 0);  // true (immutable updates)
// In a component: const [state, dispatch] = useReducer(cartReducer, { items: [] });`, lang: "javascript", title: "A reducer is a pure function you can test in plain Node" },
        { code: `// Zustand: a tiny store with selectors
import { create } from "zustand";

const useCart = create(set => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
}));

function CartBadge() {
  const count = useCart(s => s.items.length);  // re-renders only when count changes
  return <span>{count}</span>;
}

// TanStack Query: server state
import { useQuery } from "@tanstack/react-query";
function Profile({ id }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetch("/api/users/" + id).then(r => r.json()),
    staleTime: 60_000,
  });
  if (isPending) return <Spinner />;
  if (error) return <ErrorMsg error={error} />;
  return <h2>{data.name}</h2>;
}`, lang: "jsx", title: "Zustand for client state, TanStack Query for server state" },
        { warn: "The most common real-world mistake is putting API responses into Redux and hand-writing loading/error/caching logic. Most \"global state\" in typical apps is actually server cache; once that moves to React Query the remaining client state is small." },
        { tip: "Good answer structure: \"Start local. Lift when siblings need it. Context for low-frequency globals. Server cache library for API data. A store only when profiling or complexity justifies it.\" Redux Toolkit (not legacy hand-written Redux) is the modern Redux." }
      ]
    },
    {
      id: "data-fetching-patterns",
      q: "How do you fetch data in React, and what problems does a naive useEffect fetch have?",
      topic: "State & Data",
      level: 2,
      top: true,
      short: "The naive approach is fetching in useEffect and storing data, loading and error in state. It works but has problems: race conditions when inputs change quickly, no caching or deduplication, request waterfalls between parent and child, no data on first paint for SEO, and double requests in StrictMode development. In production you usually use a framework (Next.js Server Components or loaders) or a library like TanStack Query or SWR; if you do use an effect, cancel stale requests in cleanup.",
      a: [
        { code: `import { useEffect, useState } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setUser(null);
    setError(null);

    fetch("/api/users/" + userId, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(setUser)
      .catch(err => { if (err.name !== "AbortError") setError(err); });

    return () => controller.abort();     // cancel when userId changes / unmount
  }, [userId]);

  if (error) return <p>Failed: {error.message}</p>;
  if (!user) return <Spinner />;
  return <h2>{user.name}</h2>;
}`, lang: "jsx", title: "A correct effect-based fetch" },
        { p: "Why the cleanup matters — a race condition simulated in Node (user clicks profile 1, then quickly profile 2; the first request is slower):" },
        { code: `const fakeFetch = (id, ms, signal) => new Promise((resolve, reject) => {
  const t = setTimeout(() => resolve("user" + id), ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("aborted", "AbortError")); });
});

async function run(withAbort) {
  let shown = null, controller = null;
  const effect = id => {                       // what useEffect does on each userId change
    if (withAbort && controller) controller.abort();  // cleanup of previous effect
    controller = new AbortController();
    fakeFetch(id, id === 1 ? 300 : 100, withAbort ? controller.signal : undefined)
      .then(u => { shown = u; })
      .catch(e => { if (e.name !== "AbortError") throw e; });
  };
  effect(1);                                   // slow request
  setTimeout(() => effect(2), 50);             // user switches profile
  await new Promise(r => setTimeout(r, 400));
  console.log((withAbort ? "with abort:   " : "naive effect: ") + "showing " + shown + " (wanted user2)");
}
run(false).then(() => run(true));
// naive effect: showing user1 (wanted user2)   <- stale response won the race
// with abort:   showing user2 (wanted user2)`, lang: "javascript", title: "Race condition: naive vs cancelled" },
        { h: "Problems a library or framework solves" },
        { table: { head: ["Problem", "Hand-written effect", "TanStack Query / SWR / framework"], rows: [
          ["Caching & dedupe", "Every mount refetches; two components = two requests", "Shared cache keyed by query key"],
          ["Race conditions", "Manual AbortController/ignore flag", "Handled"],
          ["Refetch on focus/reconnect, retries", "Manual", "Built in"],
          ["Mutations + invalidation", "Manual refetch", "<code>invalidateQueries</code>, optimistic updates"],
          ["Waterfalls", "Child fetch starts only after parent renders", "Prefetch / parallel queries / server-side loading"],
          ["SEO, first paint", "Empty HTML until JS runs", "SSR / Server Components send data in HTML"]
        ] } },
        { ul: [
          "<b>Avoid waterfalls:</b> start independent requests together (<code>Promise.all</code>, parallel <code>useQuery</code>s) and fetch as high in the tree as is reasonable.",
          "<b>Suspense for data</b>: with React 19 <code>use(promise)</code> or <code>useSuspenseQuery</code>, the component \"waits\" and the nearest <code>&lt;Suspense fallback&gt;</code> shows the loading UI — no isLoading branches.",
          "Real-time data → WebSocket/SSE subscription in an effect (<a href=\"#/core/cn/websocket-vs-polling\">see WebSocket vs polling</a>)."
        ] },
        { tip: "If asked \"where would you fetch in a Next.js app?\" — in a Server Component with <code>await fetch()</code> or a DB call, so data arrives with the HTML; use client-side fetching only for user-specific, interactive or frequently refreshed data." }
      ]
    },

    /* ───────────── Rendering & Performance ───────────── */
    {
      id: "rerender-causes-lifecycle",
      q: "What causes a React component to re-render? What is the render lifecycle of a function component?",
      topic: "Rendering & Performance",
      level: 2,
      top: true,
      short: "A component re-renders when its own state changes, when its parent re-renders (by default all children re-render, even if their props are identical), or when a context it consumes changes. Props changing is not itself a trigger; it is a consequence of the parent re-rendering. Each update goes through render (calling the function), commit (DOM updates and refs), then layout effects, browser paint, and finally regular effects.",
      a: [
        { h: "The four triggers" },
        { ol: [
          "<b>State change</b> in the component (<code>useState</code>/<code>useReducer</code> setter with a new value).",
          "<b>Parent re-renders</b> → every child re-renders by default, whether or not its props changed.",
          "<b>Context change</b> → every component calling <code>useContext</code> on that context.",
          "<b>External store change</b> via <code>useSyncExternalStore</code> (what Redux/Zustand hooks use)."
        ] },
        { svg: `<svg viewBox="0 0 700 200" width="700" class="dg">
  <rect class="box-a" x="10" y="20" width="120" height="50" rx="8"/>
  <text class="tx tx-b" x="70" y="38" text-anchor="middle" dominant-baseline="middle">Trigger</text>
  <text class="tx-s" x="70" y="56" text-anchor="middle" dominant-baseline="middle">state / parent / ctx</text>
  <rect class="box" x="160" y="20" width="120" height="50" rx="8"/>
  <text class="tx tx-b" x="220" y="38" text-anchor="middle" dominant-baseline="middle">Render</text>
  <text class="tx-s" x="220" y="56" text-anchor="middle" dominant-baseline="middle">call fn, run hooks</text>
  <rect class="box-p" x="310" y="20" width="120" height="50" rx="8"/>
  <text class="tx tx-b" x="370" y="38" text-anchor="middle" dominant-baseline="middle">Commit</text>
  <text class="tx-s" x="370" y="56" text-anchor="middle" dominant-baseline="middle">DOM writes, refs</text>
  <rect class="box-w" x="460" y="20" width="110" height="50" rx="8"/>
  <text class="tx tx-b" x="515" y="38" text-anchor="middle" dominant-baseline="middle">Layout effects</text>
  <text class="tx-s" x="515" y="56" text-anchor="middle" dominant-baseline="middle">before paint</text>
  <rect class="box-g" x="600" y="20" width="90" height="50" rx="8"/>
  <text class="tx tx-b" x="645" y="45" text-anchor="middle" dominant-baseline="middle">Paint</text>
  <line class="ln-a" x1="130" y1="45" x2="156" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="280" y1="45" x2="306" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="430" y1="45" x2="456" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="570" y1="45" x2="596" y2="45" marker-end="url(#dg-arr-a)"/>
  <rect class="box-g" x="460" y="120" width="230" height="50" rx="8"/>
  <text class="tx tx-b" x="575" y="138" text-anchor="middle" dominant-baseline="middle">useEffect cleanups, then effects</text>
  <text class="tx-s" x="575" y="156" text-anchor="middle" dominant-baseline="middle">after paint (async)</text>
  <line class="ln-a" x1="645" y1="70" x2="645" y2="116" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="220" y="110" text-anchor="middle">pure, may be paused,</text>
  <text class="tx-m" x="220" y="128" text-anchor="middle">restarted or run twice (StrictMode)</text>
  <text class="tx-m" x="370" y="110" text-anchor="middle">synchronous,</text>
  <text class="tx-m" x="370" y="128" text-anchor="middle">never interrupted</text>
  <line class="ln-d" x1="10" y1="185" x2="430" y2="185"/>
  <text class="tx-s" x="220" y="198" text-anchor="middle">mount: same steps, effects run for the first time · unmount: cleanups only</text>
</svg>`, caption: "One update in a function component" },
        { code: `function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <StaticFooter />          {/* re-renders on every click, props are empty! */}
    </>
  );
}

// Fix 1: memo — skip if props are shallow-equal
const StaticFooter = memo(function StaticFooter() { return <footer>…</footer>; });

// Fix 2 (often better): move state down so Parent doesn't own it
function CounterButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`, lang: "jsx", title: "Parent re-render cascades to children" },
        { ul: [
          "<b>Re-render ≠ DOM update.</b> A render that produces the same output results in no DOM writes; the cost is only running your component functions.",
          "Bail-out: if a setter receives a value <code>Object.is</code>-equal to the current one, React skips re-rendering children.",
          "\"Children as props\" trick: <code>&lt;Wrapper&gt;&lt;Expensive/&gt;&lt;/Wrapper&gt;</code> — when Wrapper's state changes, <code>Expensive</code> isn't re-rendered because its element was created by Wrapper's parent.",
          "Diagnose with React DevTools Profiler (\"Highlight updates\", \"Why did this render?\")."
        ] },
        { warn: "Saying \"a component re-renders when its props change\" is incomplete — the interviewer will ask about a child with unchanged props. The precise answer: it re-renders because its parent rendered; <code>memo</code> is what makes props comparison matter." },
        { tip: "Map to class lifecycle if asked: mount ≈ effect with <code>[]</code>, update ≈ effect with deps, unmount ≈ cleanup. Then add that hooks are about synchronisation, not lifecycle events." }
      ]
    },
    {
      id: "usememo-usecallback-memo",
      q: "What is the difference between useMemo, useCallback and React.memo, and when do they actually help?",
      topic: "Rendering & Performance",
      level: 2,
      top: true,
      short: "React.memo wraps a component so it skips re-rendering when its props are shallowly equal to last time. useMemo caches the result of a calculation between renders until its dependencies change, and useCallback caches a function reference, which is just useMemo for functions. They help in two cases: an expensive calculation, or keeping props referentially stable so a memoised child or an effect dependency doesn't change every render. Used everywhere else they add cost without benefit, and the React Compiler can now insert them automatically.",
      a: [
        { table: { head: ["", "Caches", "Signature", "Use when"], rows: [
          ["<code>React.memo</code>", "A component's rendered output", "<code>memo(Component, arePropsEqual?)</code>", "Child re-renders often with the same props and is costly to render"],
          ["<code>useMemo</code>", "A computed value", "<code>useMemo(() =&gt; compute(a, b), [a, b])</code>", "Expensive calculation, or an object/array passed to a memo child / used as a dependency"],
          ["<code>useCallback</code>", "A function reference", "<code>useCallback(fn, [deps])</code>", "Callback passed to a memo child, or used in a dependency array"]
        ] } },
        { p: "Why referential stability matters — <code>memo</code> compares props with <code>Object.is</code>, and a new function or object literal is a new reference every render:" },
        { code: `function shallowEqual(a, b) {
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every(k => Object.is(a[k], b[k]));
}

// Two renders of a parent that writes <Row onSelect={() => select(id)} style={{ color: "red" }} />
const render = () => ({ id: 7, onSelect: () => {}, style: { color: "red" } });
console.log("inline props equal?", shallowEqual(render(), render()));     // false -> memo useless

// With useCallback/useMemo the same references are reused across renders
const onSelect = () => {}, style = { color: "red" };
const stable = () => ({ id: 7, onSelect, style });
console.log("stable props equal?", shallowEqual(stable(), stable()));     // true  -> memo skips render`, lang: "javascript", title: "memo only works if props are stable" },
        { code: `import { memo, useCallback, useMemo, useState } from "react";

const ProductRow = memo(function ProductRow({ product, onAdd }) {
  return <li>{product.name} <button onClick={() => onAdd(product.id)}>Add</button></li>;
});

function ProductList({ products, query }) {
  const [cart, setCart] = useState([]);

  const visible = useMemo(                       // expensive filter + sort on 10k items
    () => products.filter(p => p.name.includes(query)).sort((a, b) => a.price - b.price),
    [products, query]
  );

  const handleAdd = useCallback(id => {          // stable reference for memo rows
    setCart(c => [...c, id]);                    // updater -> no "cart" dependency
  }, []);

  return <ul>{visible.map(p => <ProductRow key={p.id} product={p} onAdd={handleAdd} />)}</ul>;
}`, lang: "jsx", title: "All three working together" },
        { h: "When they don't help" },
        { ul: [
          "Cheap calculations (<code>a + b</code>, a filter over 20 items): the dependency comparison costs about as much as recomputing.",
          "<code>useCallback</code> for a handler passed to a plain DOM element (<code>&lt;button onClick&gt;</code>) or a non-memo child: nothing compares it.",
          "<code>memo</code> on a component whose props include <code>children</code> JSX: children is a new element every render, so the comparison always fails.",
          "Memoisation is a performance hint, not a semantic guarantee: React may discard cached values."
        ] },
        { warn: "Don't reach for memo first. Measure with the Profiler, then try cheaper structural fixes: move state down, pass content as children, split a big component, virtualise long lists." },
        { tip: "<b>React Compiler</b> (1.0 released October 2025; opt-in in Next.js 16 via <code>reactCompiler: true</code>) memoises components and values automatically at build time. In compiler-enabled codebases manual useMemo/useCallback is mostly unnecessary — knowing this is a strong signal in 2026 interviews." }
      ]
    },
    {
      id: "performance-code-splitting-virtualization",
      q: "How do you optimise the performance of a large React app (code splitting, lazy loading, Suspense, virtualization)?",
      topic: "Rendering & Performance",
      level: 2,
      top: true,
      short: "Measure first with the React Profiler and Lighthouse or Web Vitals. Then reduce what is shipped: split code by route and heavy component with React.lazy and Suspense or dynamic import, and trim dependencies. Reduce render work: keep state local, avoid unnecessary re-renders with memo where profiling shows it, and virtualise long lists so only visible rows exist in the DOM. Also optimise images, debounce expensive input handlers and use transitions to keep typing responsive.",
      a: [
        { h: "1. Ship less JavaScript: code splitting" },
        { code: `import { lazy, Suspense, useState } from "react";

// Bundler creates a separate chunk; downloaded only when first rendered
const ChartsDashboard = lazy(() => import("./ChartsDashboard"));
const MarkdownEditor = lazy(() => import("./MarkdownEditor"));

export default function App() {
  const [showEditor, setShowEditor] = useState(false);
  return (
    <>
      <Suspense fallback={<Skeleton height={300} />}>
        <ChartsDashboard />
      </Suspense>

      <button onClick={() => setShowEditor(true)}>Write note</button>
      {showEditor && (
        <Suspense fallback={<p>Loading editor…</p>}>
          <MarkdownEditor />
        </Suspense>
      )}
    </>
  );
}`, lang: "jsx", title: "React.lazy + Suspense" },
        { ul: [
          "Split by <b>route</b> first (router frameworks and Next.js do this automatically), then by heavy, rarely used components (charts, editors, maps, modals).",
          "<code>lazy</code> needs a <b>default export</b> and must be declared at module level, not inside a component (else state resets each render).",
          "Analyse bundles (<code>vite-bundle-visualizer</code>, <code>@next/bundle-analyzer</code>); replace heavy libraries (moment → date-fns/dayjs; import single lodash functions)."
        ] },
        { h: "2. Render less: virtualisation" },
        { p: "Rendering 10,000 rows creates 10,000 DOM nodes even though ~20 are visible. <b>Windowing</b> libraries (<code>@tanstack/react-virtual</code>, <code>react-window</code>) render only the rows in the viewport plus a small overscan and absolutely position them inside a tall spacer." },
        { code: `import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

function BigList({ rows }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,          // px per row
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map(item => (
          <div key={item.key}
               style={{ position: "absolute", top: 0, width: "100%", height: item.size,
                        transform: "translateY(" + item.start + "px)" }}>
            {rows[item.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`, lang: "jsx", title: "Only ~20 DOM rows for any list length" },
        { h: "3. Checklist" },
        { table: { head: ["Symptom", "Fix"], rows: [
          ["Large initial bundle, slow first load", "Route/component code splitting, tree shaking, SSR/streaming"],
          ["Typing lags in a search box over big data", "<code>useTransition</code> / <code>useDeferredValue</code>, debounce"],
          ["Whole page re-renders on a small change", "Move state down, split context, memo on hot children"],
          ["Long list scroll jank", "Virtualisation"],
          ["Layout shift from images", "Fixed width/height, lazy loading, modern formats"],
          ["Repeated identical API calls", "Query cache (TanStack Query/SWR)"]
        ] } },
        { tip: "Always mention you'd use a <b>production build</b> when measuring: development React is much slower (extra checks, StrictMode double renders)." }
      ]
    },
    {
      id: "error-boundaries",
      q: "What are error boundaries in React, and what errors do they not catch?",
      topic: "Rendering & Performance",
      level: 2,
      top: false,
      short: "An error boundary is a component that catches JavaScript errors thrown while rendering its children, in lifecycle methods or constructors below it, and shows a fallback UI instead of unmounting the whole app. They are still written as class components using getDerivedStateFromError and componentDidCatch, or via the react-error-boundary library. They do not catch errors in event handlers, asynchronous code like timeouts and promises, server-side rendering, or errors thrown in the boundary itself.",
      a: [
        { p: "Since React 16, an uncaught render error <b>unmounts the entire root</b> (a blank page) — React would rather show nothing than corrupted UI. Error boundaries contain the damage to one section." },
        { code: `import { Component } from "react";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {      // render phase: switch to fallback
    return { error };
  }

  componentDidCatch(error, info) {              // commit phase: side effects
    logToService(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}

// Usage: one boundary per independent widget
<ErrorBoundary fallback={<p>Comments failed to load.</p>}>
  <Comments postId={id} />
</ErrorBoundary>`, lang: "jsx", title: "A minimal error boundary (still a class)" },
        { table: { head: ["Caught by boundary", "Not caught"], rows: [
          ["Errors thrown during render of descendants", "Event handlers (use try/catch there)"],
          ["Errors in class lifecycle methods / constructors below", "Async code: <code>setTimeout</code>, promise callbacks"],
          ["Errors thrown from hooks during render", "Server-side rendering errors (handled by the framework)"],
          ["Rejected promise read with <code>use()</code> / Suspense data", "Errors in the boundary component itself"]
        ] } },
        { code: `// Pushing an async/handler error into the nearest boundary
import { useState } from "react";

function SaveButton() {
  const [, setState] = useState();
  async function handleClick() {
    try {
      await save();
    } catch (e) {
      setState(() => { throw e; });   // rethrow during render -> boundary catches it
    }
  }
  return <button onClick={handleClick}>Save</button>;
}
// react-error-boundary offers the same via useErrorBoundary().showBoundary(e)`, lang: "jsx", title: "Routing non-render errors to a boundary" },
        { ul: [
          "Place boundaries at route level (whole page fallback) and around independent widgets (sidebar, comments, charts).",
          "<b>react-error-boundary</b> gives a function-component API: <code>&lt;ErrorBoundary FallbackComponent={…} onReset={…} resetKeys={[id]}&gt;</code>.",
          "In Next.js App Router, an <code>error.js</code> file is an automatic error boundary for that route segment.",
          "React 19 adds root options <code>onCaughtError</code> / <code>onUncaughtError</code> to <code>createRoot</code> for centralised logging."
        ] },
        { tip: "Pair with Suspense in the answer: Suspense handles the \"loading\" state of a subtree, an error boundary handles its \"failed\" state. Together they replace isLoading/isError branches." }
      ]
    },

    /* ───────────── Modern React ───────────── */
    {
      id: "react-18-concurrent-features",
      q: "What did React 18 introduce? How do concurrent rendering, transitions and automatic batching work?",
      topic: "Modern React",
      level: 3,
      top: false,
      short: "React 18 introduced concurrent rendering through the new createRoot API: rendering can be interrupted, so urgent updates like typing are not blocked by expensive background renders. You opt in per update with startTransition or useTransition to mark an update as non-urgent, or useDeferredValue to show a lagging copy of a value. It also added automatic batching everywhere, Suspense on the server with streaming SSR and selective hydration, and hooks like useId and useSyncExternalStore.",
      a: [
        { p: "Before React 18, rendering was <b>synchronous and blocking</b>: once a big render started, the browser couldn't handle a keystroke until it finished. Concurrent React can work on a render, yield to the browser, and throw away a stale render if a newer update arrives." },
        { table: { head: ["Feature", "What it does"], rows: [
          ["<code>createRoot</code>", "New root API; required to enable all React 18 features (<code>ReactDOM.render</code> is legacy mode, removed in React 19)"],
          ["Automatic batching", "Multiple state updates in timeouts, promises and native handlers → one render"],
          ["<code>useTransition</code> / <code>startTransition</code>", "Mark updates as non-urgent; they can be interrupted by urgent ones; <code>isPending</code> flag for UI"],
          ["<code>useDeferredValue</code>", "Render with the old value first, re-render with the new value in the background"],
          ["Streaming SSR + selective hydration", "<code>renderToPipeableStream</code> sends HTML in chunks per Suspense boundary; hydrates the parts the user interacts with first"],
          ["<code>useId</code>", "Stable unique ids that match between server and client (for <code>htmlFor</code>/aria)"],
          ["<code>useSyncExternalStore</code>", "Tear-free subscription to external stores (used by Redux, Zustand)"],
          ["StrictMode double-mount", "Dev-only mount → unmount → mount to catch missing effect cleanup"]
        ] } },
        { code: `import { useState, useTransition, useDeferredValue, memo } from "react";

function SearchPage({ allProducts }) {
  const [query, setQuery] = useState("");       // urgent: what the input shows
  const [filter, setFilter] = useState("");     // non-urgent: drives heavy list
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value);                   // update input immediately
    startTransition(() => {
      setFilter(e.target.value);                // can be interrupted by next keystroke
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <small>Updating…</small>}
      <ProductGrid products={allProducts} filter={filter} />
    </>
  );
}

// Alternative when you don't own the setter (e.g. value comes from props):
function Results({ query }) {
  const deferredQuery = useDeferredValue(query);
  const stale = query !== deferredQuery;
  return <div style={{ opacity: stale ? 0.6 : 1 }}><SlowList query={deferredQuery} /></div>;
}
const SlowList = memo(function SlowList({ query }) { /* expensive render */ });`, lang: "jsx", title: "Keeping input responsive during heavy renders" },
        { ul: [
          "Transitions are not debouncing: no fixed delay, and work starts immediately; it's just lower priority and abandonable.",
          "You can't put controlled-input updates in a transition — the input must update urgently.",
          "<code>useDeferredValue</code> only helps if the slow child is wrapped in <code>memo</code> (otherwise it re-renders with the parent anyway).",
          "Transitions also stop Suspense from replacing already-visible content with a fallback during navigation."
        ] },
        { warn: "\"Concurrent\" doesn't mean multi-threaded. React still runs on the single JS main thread; it time-slices rendering work and checks between units of work whether something more urgent is waiting." },
        { tip: "Good concrete example to give: filtering a 10k-row table while typing, or switching tabs where one tab renders slowly — with a transition the old tab stays interactive until the new one is ready." }
      ]
    },
    {
      id: "react-19-features",
      q: "What are the main new features in React 19 (Actions, use, useActionState, useOptimistic)?",
      topic: "Modern React",
      level: 2,
      top: false,
      short: "React 19 (stable December 2024) centres on Actions: async functions passed to a transition or a form's action prop, with React tracking pending state, errors and form resets. useActionState gives an action's result and pending flag, useFormStatus lets a submit button read its form's status, and useOptimistic shows instant updates that roll back on failure. The use API reads a promise or context during render, even conditionally. ref is now a normal prop and Server Components are stable.",
      a: [
        { table: { head: ["Feature", "Purpose"], rows: [
          ["Actions (async transitions)", "<code>startTransition(async () =&gt; {...})</code>: React tracks pending state across the await"],
          ["<code>&lt;form action={fn}&gt;</code>", "Calls <code>fn(formData)</code> on submit; resets uncontrolled fields on success"],
          ["<code>useActionState(action, initial)</code>", "Returns <code>[state, formAction, isPending]</code>; state is the action's last return value"],
          ["<code>useFormStatus()</code> (react-dom)", "<code>{ pending, data, method }</code> of the parent <code>&lt;form&gt;</code>, for submit buttons"],
          ["<code>useOptimistic(state, updateFn)</code>", "Show the expected result immediately; reverts automatically when the action ends"],
          ["<code>use(promise | context)</code>", "Read a resource during render; suspends on pending promises; allowed inside if/loops"],
          ["<code>ref</code> as a prop", "No more <code>forwardRef</code> for function components"],
          ["<code>&lt;Context value&gt;</code>", "Render the context itself as provider (<code>.Provider</code> still works)"],
          ["Document metadata", "<code>&lt;title&gt;</code>, <code>&lt;meta&gt;</code>, <code>&lt;link&gt;</code> rendered anywhere are hoisted to <code>&lt;head&gt;</code>"],
          ["Server Components / Server Actions", "Stable in React 19; used through frameworks like Next.js App Router"]
        ] } },
        { code: `"use client";
import { useActionState, useOptimistic } from "react";
import { useFormStatus } from "react-dom";

async function addComment(prevState, formData) {
  const text = formData.get("text");
  if (!text) return { error: "Comment can't be empty" };
  await saveCommentToServer(text);             // could be a Next.js Server Action
  return { error: null };
}

function SubmitButton() {
  const { pending } = useFormStatus();         // reads the parent <form>
  return <button disabled={pending}>{pending ? "Posting…" : "Post"}</button>;
}

export function Comments({ comments }) {
  const [optimistic, addOptimistic] = useOptimistic(
    comments,
    (current, text) => [...current, { id: "temp", text, sending: true }]
  );
  const [state, formAction] = useActionState(async (prev, formData) => {
    addOptimistic(formData.get("text"));       // appears instantly
    return addComment(prev, formData);
  }, { error: null });

  return (
    <>
      <ul>{optimistic.map(c => <li key={c.id}>{c.text}{c.sending && " (sending)"}</li>)}</ul>
      <form action={formAction}>
        <input name="text" />
        <SubmitButton />
        {state.error && <p role="alert">{state.error}</p>}
      </form>
    </>
  );
}`, lang: "jsx", title: "Form action + useActionState + useFormStatus + useOptimistic" },
        { code: `import { use, Suspense } from "react";

// The promise is created by a parent / Server Component, not inside this component
function UserName({ userPromise }) {
  const user = use(userPromise);               // suspends until resolved
  return <span>{user.name}</span>;
}

function Header({ userPromise, showUser }) {
  if (!showUser) return null;
  const theme = use(ThemeContext);             // conditional call is allowed for use()
  return (
    <header className={theme}>
      <Suspense fallback={<span>…</span>}>
        <UserName userPromise={userPromise} />
      </Suspense>
    </header>
  );
}`, lang: "jsx", title: "use() for promises and context" },
        { warn: "Don't create the promise inside the same component that calls <code>use()</code> (<code>use(fetch(url))</code>): every render creates a new promise and it suspends forever. Promises must be cached/stable — created by a Server Component, a framework loader or a cache." },
        { tip: "Also worth one line: React 19.2 (October 2025) added <code>&lt;Activity&gt;</code> (hide UI while preserving its state) and <code>useEffectEvent</code>; and the React Compiler 1.0 automates memoisation. Mentioning versions shows you track the ecosystem." }
      ]
    }
  ]
});
