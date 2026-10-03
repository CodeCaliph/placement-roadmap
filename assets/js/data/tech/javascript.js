/* tech stack: JavaScript — interview Q&A */
(window.TECH = window.TECH || []).push({
  id: "javascript",
  title: "JavaScript",
  short: "JS",
  icon: "❴",
  blurb: "With JavaScript on your resume, interviewers go straight for the language's sharp edges: hoisting and the TDZ, closures, how this is bound, prototypes, coercion, and the event loop ordering puzzle. Expect to implement debounce, a bind polyfill or a curry function live, and to explain promises and async/await error handling without hand-waving.",
  topics: [
    "Fundamentals",
    "Functions & Scope",
    "Objects & Prototypes",
    "Async JavaScript",
    "Practical Patterns",
    "Runtime & Modules"
  ],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "var-let-const-hoisting",
      q: "What is the difference between var, let and const? What are hoisting and the temporal dead zone?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "var is function-scoped, can be redeclared, and is hoisted and initialised to undefined. let and const are block-scoped and are hoisted too, but stay uninitialised until their declaration runs; touching them earlier throws a ReferenceError, and that window is the temporal dead zone. const prevents reassigning the binding, not mutating the object it points to.",
      a: [
        { p: "Before running any code, the engine creates every declaration in a scope. That is <b>hoisting</b>. The three keywords differ in <i>which</i> scope they belong to and in <i>what value</i> the binding holds before the declaration line runs." },
        { table: { head: ["", "var", "let", "const"], rows: [
          ["Scope", "Function (or global)", "Block <code>{ }</code>", "Block <code>{ }</code>"],
          ["Hoisted?", "Yes, initialised to <code>undefined</code>", "Yes, but <b>uninitialised</b> (TDZ)", "Yes, but <b>uninitialised</b> (TDZ)"],
          ["Redeclare in same scope", "Allowed", "SyntaxError", "SyntaxError"],
          ["Reassign", "Allowed", "Allowed", "TypeError"],
          ["Must initialise at declaration", "No", "No", "Yes"],
          ["Global <code>var</code> becomes <code>window.x</code>", "Yes (in scripts)", "No", "No"]
        ] } },
        { code: `console.log(a);          // undefined: var is hoisted AND initialised
var a = 1;

try { console.log(b); } catch (e) { console.log(e.name + ': ' + e.message); }
let b = 2;               // the lines above b's declaration are its TDZ

const obj = { n: 1 };
obj.n = 2;               // fine: const locks the binding, not the object
console.log(obj.n);
try { obj = {}; } catch (e) { console.log(e.name + ': ' + e.message); }

greet();                 // function declarations are hoisted with their body
function greet() { console.log('hi from a hoisted function'); }

if (true) { var leaks = 'var leaks out'; let stays = 'let stays in'; }
console.log(leaks, typeof stays);`, lang: "javascript", title: "Hoisting and TDZ in action" },
        { code: `undefined
ReferenceError: Cannot access 'b' before initialization
2
TypeError: Assignment to constant variable.
hi from a hoisted function
var leaks out undefined`, lang: "text", title: "Output (Node 22)" },
        { p: "The <b>temporal dead zone</b> runs from the start of the block to the declaration line. It is temporal, not positional: a function defined above <code>let x</code> can safely read <code>x</code> as long as it is <i>called</i> after the declaration has run. Even <code>typeof x</code> throws inside the TDZ, unlike <code>typeof</code> on an undeclared name, which returns <code>'undefined'</code>." },
        { p: "Function <i>expressions</i> and arrow functions follow the rules of the variable they are assigned to. <code>var f = function(){}</code> hoists as <code>undefined</code>, so calling <code>f()</code> early gives <code>TypeError: f is not a function</code>. With <code>const f = () =&gt; {}</code> you get a TDZ ReferenceError instead." },
        { tip: "Modern rule of thumb: <code>const</code> by default, <code>let</code> when you really reassign, never <code>var</code>. If you want to freeze an object's contents, use <code>Object.freeze</code>, and remember it is shallow." }
      ]
    },
    {
      id: "double-vs-triple-equals",
      q: "What is the difference between == and === in JavaScript?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "=== (strict equality) compares value and type with no conversion. == (loose equality) first coerces the operands to a common type using the Abstract Equality algorithm: null equals only undefined, booleans become numbers, strings become numbers, objects become primitives. Use === everywhere; the only common exception is x == null, which checks for null or undefined in one go.",
      a: [
        { p: "<code>===</code> returns true only if both operands have the <b>same type and same value</b>. Objects are compared by <b>reference</b>. <code>==</code> runs the <b>IsLooselyEqual</b> algorithm, which converts types before comparing:" },
        { ol: [
          "Same type? Compare like <code>===</code>.",
          "<code>null == undefined</code> is true. Neither is loosely equal to anything else, so <code>null == 0</code> is false.",
          "Number vs string: convert the string to a number.",
          "Boolean vs anything: convert the boolean to a number first (<code>true</code> becomes 1, <code>false</code> becomes 0).",
          "Object vs primitive: convert the object with <code>ToPrimitive</code> (<code>valueOf</code>, then <code>toString</code>) and compare again."
        ] },
        { code: `console.log(1 == '1', 1 === '1');
console.log(0 == '', 0 == '0', '' == '0');        // not transitive!
console.log(null == undefined, null === undefined);
console.log(null == 0, null >= 0);                // == has a special null rule, >= does not
console.log(NaN == NaN, Object.is(NaN, NaN));
console.log([] == false, [] == ![]);
console.log(0 === -0, Object.is(0, -0));
console.log({} === {}, [1] == 1);`, lang: "javascript", title: "The classic traps" },
        { code: `true false
true true false
true false
false true
false true
true true
true false
false true`, lang: "text", title: "Output" },
        { p: "Here is why <code>[] == ![]</code> is true. <code>![]</code> is <code>false</code> because every object is truthy. Then <code>[] == false</code> turns <code>false</code> into <code>0</code>, and <code>[]</code> goes through ToPrimitive to <code>''</code> and then to <code>0</code>. So the comparison ends up as <code>0 == 0</code>." },
        { table: { head: ["Comparison", "Coercion?", "NaN equals NaN", "+0 equals -0", "Use for"], rows: [
          ["<code>==</code>", "Yes", "No", "Yes", "Only <code>x == null</code>"],
          ["<code>===</code>", "No", "No", "Yes", "Everything else"],
          ["<code>Object.is</code>", "No", "Yes", "No", "Edge cases (React uses it to compare state)"]
        ] } },
        { tip: "Interviewers love asking you to explain one of these outputs step by step. Say the rule out loud (\"boolean converts to number first, then the object goes through ToPrimitive\") instead of just saying \"JS is weird\"." }
      ]
    },
    {
      id: "type-coercion-truthy-falsy",
      q: "Explain type coercion in JavaScript. Which values are falsy?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Coercion is JavaScript converting a value to another type automatically, to string, number or boolean. The + operator prefers string concatenation if either side is a string, while other arithmetic operators convert to numbers. Exactly eight values are falsy: false, 0, -0, 0n, empty string, null, undefined and NaN. Everything else, including '0', [] and {}, is truthy.",
      a: [
        { p: "<b>Implicit coercion</b> happens when an operator receives a type it does not expect. <b>Explicit coercion</b> is when you convert on purpose with <code>String(x)</code>, <code>Number(x)</code>, <code>Boolean(x)</code>, <code>parseInt</code> or unary <code>+</code>. Only three target types exist: string, number and boolean. Objects first become a primitive via <code>Symbol.toPrimitive</code>, <code>valueOf</code> or <code>toString</code>." },
        { code: `console.log(1 + '2', '3' - 1, '3' * '4');     // + concatenates, - and * convert to number
console.log(true + 1, [] + {}, [1, 2] + [3]);
console.log(+'', +' 42 ', +'4x', +[], +null, +undefined);
console.log(parseInt('42px'), Number('42px'));
console.log(Boolean('0'), Boolean([]), Boolean({}), Boolean(''), Boolean(NaN));

const count = 0;
console.log(count || 10, count ?? 10);        // || treats 0 as missing, ?? does not
console.log(!!'false', !!0n);`, lang: "javascript", title: "Coercion rules you should be able to predict" },
        { code: `12 2 12
2 [object Object] 1,23
0 42 NaN 0 0 NaN
42 NaN
true true true false false
10 0
true false`, lang: "text", title: "Output" },
        { table: { head: ["Falsy value", "Type"], rows: [
          ["<code>false</code>", "boolean"],
          ["<code>0</code>, <code>-0</code>", "number"],
          ["<code>0n</code>", "bigint"],
          ["<code>''</code> (empty string)", "string"],
          ["<code>null</code>", "null"],
          ["<code>undefined</code>", "undefined"],
          ["<code>NaN</code>", "number"]
        ] } },
        { p: "Everything else is truthy: <code>'0'</code>, <code>'false'</code>, <code>' '</code>, <code>[]</code>, <code>{}</code>, <code>function(){}</code>, <code>Infinity</code> and <code>new Boolean(false)</code> (it is an object). Browsers add one legacy oddity, <code>document.all</code>, which is falsy." },
        { warn: "<code>value || default</code> replaces <i>every</i> falsy value, so a legitimate <code>0</code>, <code>''</code> or <code>false</code> gets overwritten. Use <code>??</code> (ES2020), which falls back only on <code>null</code>/<code>undefined</code>. The same thinking applies to <code>if (arr.length)</code> versus <code>if (arr)</code>: an empty array is truthy." },
        { tip: "Follow-up: \"What does <code>['1','2','3'].map(parseInt)</code> return?\" Answer: <code>[1, NaN, NaN]</code>. <code>map</code> passes <code>(value, index)</code>, and <code>parseInt</code> reads the index as the radix, so you get <code>parseInt('2', 1)</code> and <code>parseInt('3', 2)</code>." }
      ]
    },
    {
      id: "null-vs-undefined",
      q: "What is the difference between null and undefined?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "undefined means a value was never assigned. JavaScript gives it to uninitialised variables, missing properties, missing arguments and functions with no return. null is an intentional empty value that a programmer assigns. typeof null is 'object' because of a historical bug. They are loosely equal (null == undefined) but not strictly equal, and default parameters and JSON treat them differently.",
      a: [
        { p: "Both mean \"no value\", but they come from different places. <b>undefined</b> is the language's default for things that are absent. <b>null</b> is a deliberate \"empty\" that <i>you</i> put there, for example to reset a reference or to say \"no result\"." },
        { code: `let a;
const o = {};
function f(x) { return x; }
console.log(a, o.missing, f(), (() => {})());

console.log(typeof null, typeof undefined);
console.log(null == undefined, null === undefined);
console.log(Number(null), Number(undefined));
console.log(JSON.stringify({ a: undefined, b: null, c: [undefined] }));

function greet(name = 'guest') { return name; }
console.log(greet(undefined), greet(null));   // defaults only kick in for undefined

console.log(null ?? 'fallback', undefined ?? 'fallback', 0 ?? 'fallback');
console.log(o.user?.address?.city);           // optional chaining short-circuits to undefined`, lang: "javascript", title: "Where each one shows up" },
        { code: `undefined undefined undefined undefined
object undefined
true false
0 NaN
{"b":null,"c":[null]}
guest null
fallback fallback 0
undefined`, lang: "text", title: "Output" },
        { table: { head: ["", "undefined", "null"], rows: [
          ["Meaning", "Not assigned / absent", "Intentionally empty"],
          ["Who sets it", "The engine (by default)", "The programmer"],
          ["<code>typeof</code>", "<code>'undefined'</code>", "<code>'object'</code> (legacy bug from JS 1.0)"],
          ["<code>Number(...)</code>", "<code>NaN</code>", "<code>0</code>"],
          ["Triggers default parameter", "Yes", "No"],
          ["<code>JSON.stringify</code>", "Property dropped (array slot becomes <code>null</code>)", "Kept as <code>null</code>"]
        ] } },
        { p: "To check for either one: <code>x == null</code> or <code>x ?? fallback</code>. To check for null alone: <code>x === null</code>. To check whether a variable is declared at all, without a ReferenceError: <code>typeof x === 'undefined'</code>." },
        { tip: "In APIs, <code>null</code> is the clearer choice for \"field exists but has no value\" because it survives JSON round-trips. Leave <code>undefined</code> for \"not provided\". In a PATCH body this lets the server tell \"clear this field\" (null) apart from \"don't touch it\" (absent)." }
      ]
    },

    /* ───────────── Functions & Scope ───────────── */
    {
      id: "closures-scope",
      q: "What is a closure? What is the classic for-loop closure bug and how do you fix it?",
      topic: "Functions & Scope",
      level: 2,
      top: true,
      short: "A closure is a function bundled with references to the variables of the scope it was created in, so it can still read and update them after the outer function has returned. The classic bug: with var, all callbacks created in a loop share one function-scoped i, so they all see its final value. let creates a fresh binding per iteration, which fixes it. An IIFE or passing i as an argument also works.",
      a: [
        { p: "JavaScript uses <b>lexical scope</b>: a function can see the variables of the place where it was <i>written</i>, not where it is called. When a function is created, it keeps a hidden reference to its surrounding scope (the spec calls it [[Environment]]). That function plus the environment it carries is a <b>closure</b>. It captures <b>variables</b>, not values, so later changes are visible." },
        { code: `// 1. Private state: count is reachable only through the returned functions
function makeCounter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const c1 = makeCounter(), c2 = makeCounter();
c1.inc(); c1.inc(); c2.inc();
console.log(c1.get(), c2.get(), c1.count);   // each call gets its own environment

// 2. The classic bug: one shared var i
var fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map(f => f()));

// Fix A: let gives every iteration a new binding
const fixedA = [];
for (let j = 0; j < 3; j++) fixedA.push(() => j);
console.log(fixedA.map(f => f()));

// Fix B (pre-ES6): an IIFE copies the current value into a new scope
var fixedB = [];
for (var k = 0; k < 3; k++) (function (k) { fixedB.push(() => k); })(k);
console.log(fixedB.map(f => f()));

// Same bug with timers
for (var t = 0; t < 3; t++) setTimeout(() => process.stdout.write('var:' + t + ' '), 0);
for (let u = 0; u < 3; u++) setTimeout(() => process.stdout.write('let:' + u + ' '), 0);
setTimeout(() => console.log(), 0);`, lang: "javascript", title: "Closures: private state and the loop bug" },
        { code: `2 1 undefined
[ 3, 3, 3 ]
[ 0, 1, 2 ]
[ 0, 1, 2 ]
var:3 var:3 var:3 let:0 let:1 let:2 `, lang: "text", title: "Output" },
        { p: "<b>Why var fails:</b> there is a single <code>i</code> for the whole function. The arrow functions all close over that same variable, and by the time they run the loop has already pushed it to 3. <b>Why let works:</b> the spec creates a new lexical environment for each iteration and copies the current value into it, so every callback closes over a different <code>j</code>." },
        { ul: [
          "<b>Data privacy / module pattern:</b> state that only the returned API can reach (as in <code>makeCounter</code>).",
          "<b>Function factories:</b> <code>const add5 = makeAdder(5)</code>, and also currying and partial application.",
          "<b>Callbacks and handlers</b> that remember context: event listeners, <code>setTimeout</code>, React hooks.",
          "<b>Memoisation, once(), debounce/throttle:</b> the timer or cache lives in the closure."
        ] },
        { warn: "Closures keep their whole captured environment alive. A long-lived handler that closes over a huge array keeps that array in memory as long as the handler exists. That is a common source of leaks, and so are React's \"stale closures\", where a callback captured state from an old render." },
        { tip: "Expect the follow-up \"implement <code>once(fn)</code>\": keep a <code>called</code> flag and a <code>result</code> in the closure, call <code>fn</code> the first time, and return the cached result after that." }
      ]
    },
    {
      id: "this-binding",
      q: "How is the value of this determined in JavaScript? How do arrow functions change it?",
      topic: "Functions & Scope",
      level: 2,
      top: true,
      short: "For a normal function, this depends on how it is called. Four rules apply, from highest to lowest priority: new binding (the new object), explicit binding (call, apply or bind), implicit binding (the object before the dot) and default binding (undefined in strict mode, the global object otherwise). Arrow functions have no this of their own; they take it lexically from the enclosing scope, and call, apply and bind cannot change it.",
      a: [
        { p: "<code>this</code> is <b>not</b> set where the function is written. It is set by the <b>call site</b> each time the function is called. The only exception is arrow functions." },
        { table: { head: ["Priority", "Rule", "Call site", "this is"], rows: [
          ["1", "<b>new</b> binding", "<code>new Person()</code>", "The freshly created object"],
          ["2", "<b>Explicit</b> binding", "<code>fn.call(obj)</code>, <code>fn.apply(obj)</code>, <code>fn.bind(obj)()</code>", "<code>obj</code>"],
          ["3", "<b>Implicit</b> binding", "<code>obj.fn()</code>", "<code>obj</code> (the object left of the dot)"],
          ["4", "<b>Default</b> binding", "<code>fn()</code>", "<code>undefined</code> in strict mode / ES modules / classes, otherwise <code>globalThis</code>"]
        ] } },
        { code: `'use strict';
function show() { return this === undefined ? 'undefined' : this.name; }

const user = { name: 'Asha', show };
console.log(show());                        // default binding
console.log(user.show());                   // implicit binding
console.log(show.call({ name: 'Ravi' }));   // explicit binding
function Person(name) { this.name = name; }
console.log(new Person('Meera').name);      // new binding

const lost = user.show;                     // the method is detached from its object
console.log(lost());                        // implicit binding is gone

const timer = {
  name: 'timer',
  regular() { return [1].map(function () { return this; })[0]; },
  arrow()   { return [1].map(() => this.name)[0]; },
};
console.log(timer.regular());   // a plain callback gets default binding
console.log(timer.arrow());     // the arrow inherits this from arrow()

const arrowMethod = { name: 'obj', get: () => typeof this };
console.log(arrowMethod.get(), show.bind(user).call({ name: 'X' }));`, lang: "javascript", title: "All four rules plus arrow functions" },
        { code: `undefined
Asha
Ravi
Meera
undefined
undefined
timer
object Asha`, lang: "text", title: "Output" },
        { p: "In the last line, <code>typeof this</code> inside the arrow method is <code>'object'</code> because a CommonJS module's top-level <code>this</code> is <code>module.exports</code>, not <code>arrowMethod</code>. In an ES module it would be <code>undefined</code>. The same line also shows that a <b>bound</b> function ignores a later <code>call</code>: the bind wins." },
        { ul: [
          "Arrow functions have no own <code>this</code>, <code>arguments</code>, <code>super</code> or <code>prototype</code>, and cannot be used with <code>new</code>.",
          "Use arrows for <b>callbacks inside methods</b> (<code>map</code>, <code>setTimeout</code>, promise chains) so they keep the method's <code>this</code>.",
          "Do <b>not</b> use arrows as object methods or prototype methods when you need <code>this</code> to be the object.",
          "In DOM handlers added with a regular function, <code>this === event.currentTarget</code>. With an arrow it is the outer <code>this</code>.",
          "Class methods run in strict mode, so <code>const f = obj.method; f()</code> gives <code>this === undefined</code>. That is why React class components bound handlers in the constructor."
        ] },
        { tip: "The classic follow-up is \"what is the output\" for <code>setTimeout(obj.method, 0)</code>: <code>this</code> is lost, because only the function reference is passed. Fixes: <code>setTimeout(() =&gt; obj.method())</code> or <code>obj.method.bind(obj)</code>." }
      ]
    },
    {
      id: "call-apply-bind",
      q: "What is the difference between call, apply and bind? Can you write a bind polyfill?",
      topic: "Functions & Scope",
      level: 2,
      top: true,
      short: "All three set this explicitly. call(thisArg, a, b) invokes immediately with arguments listed one by one. apply(thisArg, [a, b]) invokes immediately with an array of arguments. bind(thisArg, a) does not invoke; it returns a new function with this permanently fixed and optional leading arguments preset (partial application). A bound function's this cannot be changed again, except by new.",
      a: [
        { table: { head: ["Method", "Invokes now?", "Arguments", "Returns"], rows: [
          ["<code>fn.call(ctx, a, b)</code>", "Yes", "Listed individually", "fn's return value"],
          ["<code>fn.apply(ctx, [a, b])</code>", "Yes", "As one array (or array-like)", "fn's return value"],
          ["<code>fn.bind(ctx, a)</code>", "No", "Preset leading args, rest at call time", "A new bound function"]
        ] } },
        { code: `function intro(greeting, punct) {
  return \`\${greeting}, I am \${this.name}\${punct}\`;
}
const asha = { name: 'Asha' };

console.log(intro.call(asha, 'Hi', '!'));
console.log(intro.apply(asha, ['Hello', '.']));
const hey = intro.bind(asha, 'Hey');      // this + first argument fixed
console.log(hey('?'));

// bind is permanent: re-binding cannot change this (extra args still append)
console.log(hey.bind({ name: 'Ravi' }, '!')());

// Borrowing methods
console.log(Math.max.apply(null, [3, 9, 4]), Math.max(...[3, 9, 4]));
console.log(Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 }));`, lang: "javascript", title: "call vs apply vs bind" },
        { code: `Hi, I am Asha!
Hello, I am Asha.
Hey, I am Asha?
Hey, I am Asha!
9 9
[ 'a', 'b' ]`, lang: "text", title: "Output" },
        { code: `Function.prototype.myBind = function (ctx, ...preset) {
  if (typeof this !== 'function') throw new TypeError('myBind must be called on a function');
  const fn = this;
  function bound(...later) {
    // when called with new, this should be the new object, not ctx
    const isNew = this instanceof bound;
    return fn.apply(isNew ? this : ctx, [...preset, ...later]);
  }
  bound.prototype = Object.create(fn.prototype);   // keep instanceof working
  return bound;
};

function intro(greeting) { return greeting + ' ' + this.name; }
console.log(intro.myBind({ name: 'Asha' }, 'Namaste')());

function Point(x, y) { this.x = x; this.y = y; }
const P = Point.myBind(null, 10);
const p = new P(20);
console.log(p.x, p.y, p instanceof Point);

// call polyfill idea: temporarily attach fn to ctx as a unique property
Function.prototype.myCall = function (ctx = globalThis, ...args) {
  const key = Symbol('fn');
  ctx[key] = this;
  try { return ctx[key](...args); } finally { delete ctx[key]; }
};
console.log(intro.myCall({ name: 'Ravi' }, 'Hello'));`, lang: "javascript", title: "Polyfills interviewers ask for" },
        { code: `Namaste Asha
10 20 true
Hello Ravi`, lang: "text", title: "Output" },
        { p: "Since ES6, spread covers most uses of <code>apply</code> (<code>fn(...arr)</code>). <code>bind</code> is still common for passing methods as callbacks, for example <code>button.addEventListener('click', this.handle.bind(this))</code>, and for partial application." },
        { tip: "A strong answer mentions the <code>new</code> edge case: a bound function used as a constructor ignores the bound <code>this</code>. Most candidates' polyfills skip it, and the <code>instanceof bound</code> check above handles it." }
      ]
    },
    {
      id: "currying",
      q: "What is currying, and how would you implement a generic curry function?",
      topic: "Functions & Scope",
      level: 2,
      top: false,
      short: "Currying turns a function of n arguments into a chain of unary functions: f(a, b, c) becomes f(a)(b)(c). Each call returns a closure that remembers the arguments so far until all are collected. A generic curry compares the collected argument count with fn.length. It is related to, but not the same as, partial application, which fixes some arguments and returns a function taking the rest.",
      a: [
        { p: "<b>Currying</b> comes from functional programming (named after Haskell Curry). Each call takes one argument (or, in the relaxed JS style, some arguments) and returns another function, until enough arguments have arrived to compute the result. It works because of <b>closures</b>: every returned function remembers the arguments collected earlier." },
        { code: `// Generic curry: keep collecting until we have fn.length arguments
const curry = fn => function curried(...args) {
  return args.length >= fn.length
    ? fn.apply(this, args)
    : (...more) => curried.apply(this, [...args, ...more]);
};

const volume = (l, w, h) => l * w * h;
const cv = curry(volume);
console.log(cv(2)(3)(4), cv(2, 3)(4), cv(2)(3, 4), cv(2, 3, 4));

// Practical use: specialise a general function once, reuse it many times
const log = curry((level, module, msg) => \`[\${level}] \${module}: \${msg}\`);
const authError = log('ERROR')('auth');
console.log(authError('token expired'));
console.log(authError('bad password'));

// Popular puzzle: sum(1)(2)(3)() with an unknown number of calls
const sum = a => b => (b === undefined ? a : sum(a + b));
console.log(sum(1)(2)(3)(4)());

// Partial application for comparison: fix some args, get a function of the rest
const partial = (fn, ...fixed) => (...rest) => fn(...fixed, ...rest);
console.log(partial(volume, 2)(3, 4));`, lang: "javascript", title: "curry, a practical use, and the infinite-sum puzzle" },
        { code: `24 24 24 24
[ERROR] auth: token expired
[ERROR] auth: bad password
10
24`, lang: "text", title: "Output" },
        { table: { head: ["", "Currying", "Partial application"], rows: [
          ["Shape", "f(a)(b)(c): always returns a function until complete", "g = partial(f, a); g(b, c)"],
          ["Number of steps", "One per argument (or group)", "Usually one"],
          ["JS tools", "Hand-written curry, lodash <code>_.curry</code>, Ramda", "<code>fn.bind(null, a)</code>, a closure"]
        ] } },
        { warn: "<code>fn.length</code> does not count rest parameters or parameters after the first one with a default value: <code>((a, b = 1) =&gt; 0).length</code> is 1. Generic curry therefore breaks on variadic functions. That is why the infinite <code>sum</code> puzzle needs an explicit terminator call <code>()</code> (or a <code>valueOf</code> trick)." },
        { tip: "Where you will see currying in real code: Redux middleware <code>store =&gt; next =&gt; action =&gt; …</code>, Express-style middleware factories <code>const auth = role =&gt; (req, res, next) =&gt; …</code>, and event handler factories <code>onClick={select(id)}</code>." }
      ]
    },

    /* ───────────── Objects & Prototypes ───────────── */
    {
      id: "prototypes-inheritance-classes",
      q: "How does prototypal inheritance work in JavaScript? How do ES6 classes relate to it?",
      topic: "Objects & Prototypes",
      level: 2,
      top: true,
      short: "Every object has a hidden [[Prototype]] link to another object. When a property is not found on the object itself, the engine walks up this prototype chain until it finds it or reaches null. Constructor functions set new objects' prototype to Constructor.prototype. ES6 class is mostly syntactic sugar over the same mechanism, adding extends and super, strict mode, mandatory new and private # fields.",
      a: [
        { p: "JavaScript has no classical class-based inheritance under the hood. Objects inherit <b>directly from other objects</b>. Each object has an internal <code>[[Prototype]]</code> slot. You can read it with <code>Object.getPrototypeOf(obj)</code> or the legacy <code>obj.__proto__</code>. Property <b>lookups</b> walk the chain. Property <b>writes</b> always create or update an own property on the object itself (unless there is a setter up the chain)." },
        { svg: `<svg viewBox="0 0 660 200" width="660" class="dg">
  <rect class="box-g" x="10" y="70" width="130" height="60" rx="6"/>
  <text class="tx tx-b" x="75" y="92" text-anchor="middle">d (instance)</text>
  <text class="tx-m" x="75" y="114" text-anchor="middle">name: 'Tommy'</text>
  <rect class="box-a" x="180" y="70" width="140" height="60" rx="6"/>
  <text class="tx tx-b" x="250" y="92" text-anchor="middle">Dog.prototype</text>
  <text class="tx-m" x="250" y="114" text-anchor="middle">speak()</text>
  <rect class="box-a" x="360" y="70" width="140" height="60" rx="6"/>
  <text class="tx tx-b" x="430" y="92" text-anchor="middle">Animal.prototype</text>
  <text class="tx-m" x="430" y="114" text-anchor="middle">speak()</text>
  <rect class="box-p" x="540" y="70" width="110" height="60" rx="6"/>
  <text class="tx tx-b" x="595" y="92" text-anchor="middle">Object.prototype</text>
  <text class="tx-m" x="595" y="114" text-anchor="middle">toString()…</text>
  <line class="ln-a" x1="140" y1="100" x2="178" y2="100" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="320" y1="100" x2="358" y2="100" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="500" y1="100" x2="538" y2="100" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="595" y1="130" x2="595" y2="165" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="595" y="182" text-anchor="middle">null</text>
  <text class="tx-s" x="330" y="40" text-anchor="middle">[[Prototype]] links: d.toString() is found 3 hops up</text>
</svg>`, caption: "Property lookup walks the prototype chain until it finds the key or reaches null." },
        { code: `// 1. Pure prototypal: object inherits from object
const animal = { eats: true, describe() { return \`\${this.name} eats: \${this.eats}\`; } };
const rex = Object.create(animal);
rex.name = 'Rex';
console.log(rex.describe(), Object.getPrototypeOf(rex) === animal, Object.hasOwn(rex, 'eats'));

// 2. Constructor function + prototype (pre-ES6 style)
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + ' makes a sound'; };

// 3. class syntax, the same machinery underneath
class Dog extends Animal {
  #tricks = 0;                                 // truly private field (ES2022)
  static species = 'Canis familiaris';
  speak() { return super.speak() + ' (woof)'; }
  learn() { return ++this.#tricks; }
}
const d = new Dog('Tommy');
console.log(d.speak());
console.log(typeof Dog, Object.getPrototypeOf(Dog.prototype) === Animal.prototype);
console.log(d instanceof Animal, d.learn(), Dog.species);
console.log(Object.keys(d), 'speak' in d, Object.hasOwn(d, 'speak'));
try { Dog('x'); } catch (e) { console.log(e.constructor.name, e.message); }`, lang: "javascript", title: "Object.create, constructors and classes" },
        { code: `Rex eats: true true false
Tommy makes a sound (woof)
function true
true 1 Canis familiaris
[ 'name' ] true false
TypeError Class constructor Dog cannot be invoked without 'new'`, lang: "text", title: "Output" },
        { p: "What <code>new Dog('Tommy')</code> does: (1) create an empty object whose <code>[[Prototype]]</code> is <code>Dog.prototype</code>; (2) run the constructor with <code>this</code> set to it (in a derived class, <code>super()</code> creates the object); (3) return the object, unless the constructor explicitly returns another object." },
        { table: { head: ["", "Constructor function", "class"], rows: [
          ["Callable without <code>new</code>", "Yes (bug-prone)", "No, TypeError"],
          ["Hoisting", "Declaration fully hoisted", "TDZ, like <code>let</code>"],
          ["Strict mode", "Opt-in", "Always"],
          ["Methods enumerable", "Yes, if assigned to <code>prototype</code>", "No"],
          ["Private state", "Closures or conventions (<code>_x</code>)", "<code>#field</code>, enforced by the engine"],
          ["Inheritance", "<code>Object.setPrototypeOf</code> / <code>Object.create</code> boilerplate", "<code>extends</code> + <code>super</code>"]
        ] } },
        { tip: "Methods live once on the prototype and are shared by all instances. Assigning <code>this.speak = function(){}</code> inside the constructor creates a separate copy per object. That is the memory argument for prototypes, and it is also why class fields holding arrow functions (<code>handle = () =&gt; {}</code>) cost one function per instance. For the OOP theory, see <a href=\"#/core/oops/inheritance-types\">inheritance types</a>." }
      ]
    },
    {
      id: "shallow-vs-deep-copy",
      q: "What is the difference between a shallow copy and a deep copy in JavaScript? How do you deep copy an object?",
      topic: "Objects & Prototypes",
      level: 2,
      top: true,
      short: "A shallow copy duplicates only the top level, so nested objects and arrays are still shared references. Spread, Object.assign, Array.from and slice are all shallow. A deep copy recursively duplicates everything. Use structuredClone (built into browsers and Node 17+), which handles Dates, Maps, Sets, typed arrays and circular references. JSON.parse(JSON.stringify()) loses Dates, undefined, functions, Maps and fails on cycles.",
      a: [
        { p: "Objects are assigned and passed <b>by reference</b>: <code>const b = a</code> copies nothing at all. A <b>shallow copy</b> creates a new top-level container but copies nested references as they are. A <b>deep copy</b> creates new containers all the way down." },
        { code: `const original = {
  name: 'Asha',
  marks: [90, 80],
  joined: new Date('2024-01-15T00:00:00Z'),
  meta: new Map([['k', 1]]),
};

const shallow = { ...original };            // same as Object.assign({}, original)
shallow.name = 'Ravi';                      // top level: independent
shallow.marks.push(70);                     // nested: shared!
console.log(original.name, original.marks);

const viaJson = JSON.parse(JSON.stringify(original));
console.log(typeof viaJson.joined, viaJson.meta);      // Date became a string, Map became {}

const deep = structuredClone(original);
deep.marks.push(60);
console.log(original.marks.length, deep.marks.length);
console.log(deep.joined instanceof Date, deep.meta.get('k'));

const cyclic = { id: 1 }; cyclic.self = cyclic;
console.log(structuredClone(cyclic).self.id);          // cycles are fine
try { JSON.stringify(cyclic); } catch (e) { console.log(e.name); }
try { structuredClone({ fn() {} }); } catch (e) { console.log(e.name); }`, lang: "javascript", title: "Spread vs JSON vs structuredClone" },
        { code: `Asha [ 90, 80, 70 ]
string {}
3 4
true 1
1
TypeError
DataCloneError`, lang: "text", title: "Output (Node 22)" },
        { table: { head: ["Technique", "Depth", "Dates / Map / Set", "Cycles", "Functions, class prototypes"], rows: [
          ["<code>{...o}</code>, <code>Object.assign</code>, <code>[...a]</code>, <code>slice</code>", "Shallow", "References kept", "N/A", "Kept (own enumerable props only)"],
          ["<code>JSON.parse(JSON.stringify(o))</code>", "Deep", "Lost / converted", "Throws", "Dropped"],
          ["<code>structuredClone(o)</code>", "Deep", "Preserved", "Preserved", "Functions throw; class instances become plain objects"],
          ["Lodash <code>_.cloneDeep</code>", "Deep", "Preserved", "Preserved", "Keeps prototypes"]
        ] } },
        { p: "Why it matters in practice: React and Redux state updates must be <b>immutable</b>. The idiom is to shallow copy each level you change: <code>{ ...state, user: { ...state.user, name } }</code>. Deep cloning the whole state on every update is wasteful and breaks reference-equality memoisation." },
        { warn: "<code>Object.freeze</code> and spread both work on one level only. A \"frozen\" config object can still have its nested arrays mutated." },
        { tip: "For the language-agnostic theory (and Java's <code>clone()</code>), see <a href=\"#/core/oops/shallow-vs-deep-copy\">shallow vs deep copy in OOP</a>." }
      ]
    },
    {
      id: "spread-rest-destructuring",
      q: "What are spread, rest and destructuring in JavaScript?",
      topic: "Objects & Prototypes",
      level: 1,
      top: true,
      short: "All three use the same ... or pattern syntax but in different positions. Spread expands an iterable or object into individual elements or properties: in calls, array literals and object literals. Rest does the opposite and gathers the remaining items into an array or object: in function parameters and destructuring patterns. Destructuring unpacks values from arrays (by position) or objects (by name) into variables, with defaults, renaming and nesting.",
      a: [
        { p: "Rule of thumb: <code>...</code> on the <b>right side / in a call</b> is <b>spread</b> (it expands). <code>...</code> on the <b>left side / in a parameter list</b> is <b>rest</b> (it collects)." },
        { code: `// Object destructuring: rename, nested, default, rest
const user = { id: 7, name: 'Asha', address: { city: 'Pune' }, role: undefined };
const { name: fullName, address: { city }, role = 'student', ...others } = user;
console.log(fullName, city, role, others);

// Array destructuring: by position, skip, default, rest, swap
const [first, , third = 0, ...tail] = [10, 20, 30, 40, 50];
console.log(first, third, tail);
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);

// Rest parameters: a real array (unlike the old 'arguments')
function sum(label, ...nums) { return label + nums.reduce((s, n) => s + n, 0); }
console.log(sum('total=', 1, 2, 3));

// Spread: calls, arrays, objects (later keys win)
const nums = [5, 1, 9];
console.log(Math.max(...nums), [0, ...nums, 10]);
const defaults = { host: 'localhost', port: 5432, ssl: false };
console.log({ ...defaults, port: 6543, ssl: true });
console.log([...'hey'], [...new Set([1, 1, 2])]);

// Destructuring parameters with defaults (common in React props / options objects)
function connect({ host = 'localhost', port = 3000 } = {}) { return host + ':' + port; }
console.log(connect(), connect({ port: 8080 }));`, lang: "javascript", title: "Everything in one file" },
        { code: `Asha Pune student { id: 7 }
10 30 [ 40, 50 ]
2 1
total=6
9 [ 0, 5, 1, 9, 10 ]
{ host: 'localhost', port: 6543, ssl: true }
[ 'h', 'e', 'y' ] [ 1, 2 ]
localhost:3000 localhost:8080`, lang: "text", title: "Output" },
        { table: { head: ["", "Spread", "Rest"], rows: [
          ["Direction", "Expands one value into many", "Collects many into one"],
          ["Where", "Function calls, array literals, object literals", "Parameter lists, destructuring patterns"],
          ["Position rules", "Anywhere, multiple times", "Must be <b>last</b>, only once"],
          ["Works on", "Any iterable (arrays) / own enumerable props (objects)", "Remaining arguments / elements / keys"]
        ] } },
        { warn: "Spread copies are <b>shallow</b>. Also, destructuring defaults apply only when the value is <code>undefined</code>, not <code>null</code>: <code>const { role = 'x' } = { role: null }</code> leaves <code>role</code> as <code>null</code>. Destructuring <code>null</code> or <code>undefined</code> itself throws a TypeError, which is why <code>= {}</code> is used as the parameter default." },
        { tip: "React connection: <code>const [count, setCount] = useState(0)</code> is array destructuring, and <code>function Card({ title, ...props })</code> plus <code>&lt;div {...props}&gt;</code> is rest plus spread." }
      ]
    },
    {
      id: "map-set-vs-object",
      q: "When would you use a Map or Set instead of a plain object or array?",
      topic: "Objects & Prototypes",
      level: 2,
      top: false,
      short: "Use Map when keys are not strings (objects, numbers, anything), when you add and delete keys frequently, when you need insertion order and size directly, or when keys come from users (no prototype key collisions). Use Set for unique values and fast O(1) membership checks instead of array.includes. Plain objects remain best for fixed-shape records and JSON. WeakMap and WeakSet hold object keys weakly, so they do not prevent garbage collection.",
      a: [
        { code: `const keyObj = { id: 1 };
const m = new Map();
m.set(keyObj, 'by object').set(1, 'number one').set('1', 'string one');
console.log(m.get(keyObj), '|', m.get(1), '|', m.get('1'), '|', m.size);

const o = {};
o[keyObj] = 'x'; o[1] = 'a'; o['1'] = 'b';      // keys are coerced to strings!
console.log(Object.keys(o));

// Map iterates in insertion order and is directly iterable
for (const [k, v] of new Map([['b', 2], ['a', 1]])) process.stdout.write(k + '=' + v + ' ');
console.log();

// Set: uniqueness and O(1) has()
const ids = [3, 1, 3, 2, 1];
console.log([...new Set(ids)], new Set(ids).has(2));

// ES2025 Set methods (available in Node 22)
const js = new Set(['asha', 'ravi', 'meera']), py = new Set(['ravi', 'kabir']);
console.log(js.intersection(py), js.union(py).size, js.difference(py));

// Prototype-key trap with plain objects used as dictionaries
const counts = {};
console.log('constructor' in counts, typeof counts['__proto__']);`, lang: "javascript", title: "Map/Set vs object behaviour" },
        { code: `by object | number one | string one | 3
[ '1', '[object Object]' ]
b=2 a=1
[ 3, 1, 2 ] true
Set(1) { 'ravi' } 4 Set(2) { 'asha', 'meera' }
true object`, lang: "text", title: "Output (Node 22)" },
        { table: { head: ["", "Object", "Map"], rows: [
          ["Key types", "String / Symbol only (others coerced)", "Any value, including objects and NaN"],
          ["Order", "Integer-like keys first (ascending), then insertion order", "Pure insertion order"],
          ["Size", "<code>Object.keys(o).length</code> (O(n))", "<code>m.size</code> (O(1))"],
          ["Iteration", "<code>Object.entries(o)</code>", "Directly iterable, <code>for...of</code>"],
          ["Inherited keys", "Yes (<code>toString</code>, <code>__proto__</code>) unless <code>Object.create(null)</code>", "None"],
          ["Frequent add/delete", "Slower (hidden-class churn in V8)", "Optimised for it"],
          ["JSON", "Native", "Needs <code>Object.fromEntries(m)</code> / custom"]
        ] } },
        { p: "<b>WeakMap / WeakSet</b>: keys must be objects and are held <i>weakly</i>. If nothing else references the key, it can be garbage collected along with its entry. They are not iterable and have no <code>size</code>. Typical uses: caching computed data per object, private data for instances, and tracking DOM nodes without leaking them." },
        { tip: "Classic DSA tie-in: frequency counting (<code>m.set(x, (m.get(x) ?? 0) + 1)</code>), two-sum with a Map of value to index, and LRU cache using a Map's insertion order (delete and re-set on access, evict <code>m.keys().next().value</code>)." }
      ]
    },

    /* ───────────── Async JavaScript ───────────── */
    {
      id: "event-loop",
      q: "How does the JavaScript event loop work, how do microtasks differ from macrotasks, and what does a setTimeout / Promise ordering puzzle print?",
      topic: "Async JavaScript",
      level: 2,
      top: true,
      short: "JavaScript runs on one thread with one call stack. Async work (timers, I/O, network) is handled by the host, browser or libuv, and its callbacks are queued. When the call stack empties, the event loop first drains the entire microtask queue (promise callbacks, await continuations, queueMicrotask), then runs one macrotask (setTimeout, setInterval, I/O, UI events), then drains microtasks again, repeating forever. So a resolved promise's .then always runs before a setTimeout(fn, 0).",
      a: [
        { p: "The JS engine (V8) only has a <b>call stack</b> and a <b>heap</b>. It has no idea about timers or network. Those come from the <b>host environment</b>: Web APIs in the browser, libuv in Node. The host does the waiting and, once something is ready, pushes the callback onto a queue. The <b>event loop</b> moves queued callbacks onto the stack when the stack is empty." },
        { svg: `<svg viewBox="0 0 700 290" width="700" class="dg">
  <rect class="box-a" x="20" y="40" width="150" height="190" rx="8"/>
  <text class="tx tx-b" x="95" y="62" text-anchor="middle">Call stack</text>
  <rect class="box" x="40" y="160" width="110" height="26" rx="4"/>
  <text class="tx-s" x="95" y="173" text-anchor="middle" dominant-baseline="middle">main()</text>
  <rect class="box" x="40" y="128" width="110" height="26" rx="4"/>
  <text class="tx-s" x="95" y="141" text-anchor="middle" dominant-baseline="middle">console.log()</text>
  <rect class="box-p" x="250" y="40" width="200" height="70" rx="8"/>
  <text class="tx tx-b" x="350" y="64" text-anchor="middle">Host APIs</text>
  <text class="tx-m" x="350" y="88" text-anchor="middle">timers · fetch / I/O · DOM events</text>
  <rect class="box-g" x="500" y="40" width="185" height="70" rx="8"/>
  <text class="tx tx-b" x="592" y="64" text-anchor="middle">Microtask queue</text>
  <text class="tx-m" x="592" y="88" text-anchor="middle">.then · await · queueMicrotask</text>
  <rect class="box-w" x="500" y="160" width="185" height="70" rx="8"/>
  <text class="tx tx-b" x="592" y="184" text-anchor="middle">Macrotask queue</text>
  <text class="tx-m" x="592" y="208" text-anchor="middle">setTimeout · I/O · events</text>
  <line class="ln" x1="170" y1="75" x2="248" y2="75" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="209" y="68" text-anchor="middle">register</text>
  <line class="ln" x1="450" y1="95" x2="540" y2="158" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="470" y="140" text-anchor="middle">when ready</text>
  <line class="ln-a" x1="500" y1="98" x2="172" y2="150" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="330" y="128" text-anchor="middle">1. drain ALL</text>
  <line class="ln-a ln-d" x1="500" y1="205" x2="172" y2="205" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="330" y="198" text-anchor="middle">2. then ONE macrotask</text>
  <text class="tx-c" x="350" y="268" text-anchor="middle">Loop: stack empty → all microtasks → one macrotask (→ render in browser) → repeat</text>
</svg>`, caption: "The event loop gives microtasks strict priority over the next macrotask." },
        { code: `console.log('1: sync start');

setTimeout(() => console.log('7: setTimeout (macrotask)'), 0);

Promise.resolve().then(() => console.log('4: promise.then (microtask)'));

queueMicrotask(() => console.log('5: queueMicrotask'));

(async () => {
  console.log('2: async fn body runs synchronously');
  await null;                                   // the rest becomes a microtask
  console.log('6: after await');
})();

setTimeout(() => {
  console.log('8: second timeout');
  Promise.resolve().then(() => console.log('9: microtask queued inside a macrotask'));
}, 0);
setTimeout(() => console.log('10: third timeout'), 0);

console.log('3: sync end');`, lang: "javascript", title: "The ordering puzzle" },
        { code: `1: sync start
2: async fn body runs synchronously
3: sync end
4: promise.then (microtask)
5: queueMicrotask
6: after await
7: setTimeout (macrotask)
8: second timeout
9: microtask queued inside a macrotask
10: third timeout`, lang: "text", title: "Real output (Node 22; browsers print the same)" },
        { ol: [
          "All synchronous code runs first: 1, 2 (an async function runs synchronously until its first <code>await</code>), 3.",
          "The stack is empty, so the <b>whole</b> microtask queue drains in FIFO order: 4, 5, 6.",
          "One macrotask runs: 7. Microtasks are checked (none queued), then the next macrotask: 8. It queues a microtask, which runs <b>before</b> timeout 10. So you get 9, then 10."
        ] },
        { table: { head: ["", "Microtasks", "Macrotasks (tasks)"], rows: [
          ["Sources", "<code>Promise.then/catch/finally</code>, <code>await</code>, <code>queueMicrotask</code>, <code>MutationObserver</code>", "<code>setTimeout</code>, <code>setInterval</code>, I/O, UI events, <code>MessageChannel</code>, <code>setImmediate</code> (Node)"],
          ["When processed", "After the current script/task, before rendering", "One per loop iteration"],
          ["Per turn", "<b>All</b>, including ones added while draining", "<b>One</b>"],
          ["Danger", "An endless microtask chain starves timers and rendering", "Long tasks block the UI (over 50 ms counts as \"jank\")"]
        ] } },
        { warn: "<code>setTimeout(fn, 0)</code> means \"after <i>at least</i> 0 ms, as a macrotask\", not \"immediately\". Browsers clamp timers nested 5+ levels deep to at least 4 ms. A long synchronous loop delays every timer and freezes the page, because the event loop cannot interrupt running code." },
        { tip: "Node adds two twists: <code>process.nextTick</code> callbacks run even before promise microtasks, and macrotasks are split into libuv phases (timers, poll, check). Mention them if the interview is Node-focused. In the browser, rendering (rAF, style, layout, paint) usually happens between macrotasks, after microtasks." }
      ]
    },
    {
      id: "promises-async-await",
      q: "How do Promises and async/await work? How do you handle errors, and how do Promise.all, allSettled, race and any differ?",
      topic: "Async JavaScript",
      level: 2,
      top: true,
      short: "A Promise is an object representing a future value. It is pending, then settles once as fulfilled or rejected, and .then/.catch register callbacks that run as microtasks. async functions always return a promise, and await pauses that function, not the thread, until the promise settles, throwing on rejection so try/catch works. Promise.all fails fast on the first rejection, allSettled waits for every result, race settles with the first to settle, and any resolves with the first success.",
      a: [
        { p: "A <b>Promise</b> has three states: <b>pending</b>, then exactly once <b>fulfilled</b> (with a value) or <b>rejected</b> (with a reason). <code>then</code> returns a <i>new</i> promise, which is what makes chaining work. Returning a value passes it on, returning a promise waits for it, and throwing turns into a rejection that skips to the next <code>catch</code>." },
        { p: "<code>async</code>/<code>await</code> (ES2017) is syntax over promises. An <code>async</code> function always returns a promise. <code>await p</code> suspends the function and schedules the rest as a microtask once <code>p</code> settles. A rejection is <i>thrown</i> at the <code>await</code>, so ordinary <code>try/catch/finally</code> handles async errors." },
        { code: `const wait = (ms, v, fail = false) =>
  new Promise((resolve, reject) => setTimeout(() => (fail ? reject(new Error(v)) : resolve(v)), ms));

async function main() {
  // 1. Error handling with try/catch/finally
  try {
    console.log('got', await wait(20, 'A'));
    await wait(10, 'payment failed', true);
    console.log('never printed');
  } catch (e) {
    console.log('caught:', e.message);
  } finally {
    console.log('finally runs either way');
  }

  // 2. Sequential vs parallel
  let t = Date.now();
  await wait(100, 1); await wait(100, 2);
  const seq = Date.now() - t;
  t = Date.now();
  await Promise.all([wait(100, 1), wait(100, 2)]);
  const par = Date.now() - t;
  console.log('sequential ~200ms:', seq >= 195, '| parallel ~100ms:', par < 180);

  // 3. Combinators
  console.log('all:', await Promise.all([wait(30, 'x'), wait(10, 'y')]));   // input order kept
  try { await Promise.all([wait(30, 'ok'), wait(10, 'db down', true)]); }
  catch (e) { console.log('all rejects fast:', e.message); }
  const settled = await Promise.allSettled([wait(10, 'ok'), wait(5, 'bad', true)]);
  console.log('allSettled:', settled.map(r => r.status + ':' + (r.value ?? r.reason.message)));
  console.log('race:', await Promise.race([wait(30, 'slow'), wait(5, 'fast')]));
  console.log('any:', await Promise.any([wait(5, 'e1', true), wait(15, 'first success')]));
}

main().catch(err => console.error('top-level handler', err));`, lang: "javascript", title: "async/await, errors and combinators" },
        { code: `got A
caught: payment failed
finally runs either way
sequential ~200ms: true | parallel ~100ms: true
all: [ 'x', 'y' ]
all rejects fast: db down
allSettled: [ 'fulfilled:ok', 'rejected:bad' ]
race: fast
any: first success`, lang: "text", title: "Output" },
        { table: { head: ["Combinator", "Resolves when", "Rejects when", "Typical use"], rows: [
          ["<code>Promise.all</code>", "All fulfil (array in input order)", "<b>First</b> rejection (others keep running, results ignored)", "Parallel requests that are all required"],
          ["<code>Promise.allSettled</code>", "All settle (never rejects)", "Never", "Batch jobs, show partial results"],
          ["<code>Promise.race</code>", "First to <b>settle</b> fulfils", "First to settle rejects", "Timeouts: <code>race([fetch(), timeout(5000)])</code>"],
          ["<code>Promise.any</code>", "First to <b>fulfil</b>", "All reject (<code>AggregateError</code>)", "Fastest mirror / fallback servers"]
        ] } },
        { warn: "Traps: (1) <code>await</code> inside a <code>for</code> loop over independent items serialises them. Use <code>Promise.all(items.map(fn))</code>, or a concurrency limit for large lists. (2) <code>arr.forEach(async x =&gt; …)</code> does <b>not</b> wait; use <code>for...of</code> or <code>Promise.all</code>. (3) An unhandled rejection crashes the process in Node 15+, so always <code>await</code> or <code>.catch</code> every promise. (4) <code>return await</code> inside <code>try</code> matters: <code>return promise</code> without await skips that function's <code>catch</code>." },
        { tip: "A common live-coding ask is \"implement <code>Promise.all</code>\". Return a new Promise, keep a <code>results</code> array and a <code>remaining</code> counter, and for each input call <code>Promise.resolve(p).then(v =&gt; { results[i] = v; if (--remaining === 0) resolve(results); }, reject)</code>. Handle the empty array by resolving <code>[]</code> immediately." }
      ]
    },
    {
      id: "callbacks-to-promises",
      q: "What is callback hell? How do you convert a callback-based API to promises?",
      topic: "Async JavaScript",
      level: 1,
      top: false,
      short: "Callback hell is deeply nested callbacks: each async step is passed a function that starts the next step, so code drifts right, error handling is repeated at every level and control flow is hard to follow. The fix is to wrap the callback API in a Promise (new Promise with resolve and reject in the callback) or to use util.promisify for Node's error-first callbacks, then chain with .then or write flat async/await code.",
      a: [
        { p: "Before promises, async APIs took a <b>callback</b>. Node standardised the <b>error-first callback</b> convention: <code>cb(err, result)</code>. When step 2 depends on step 1, which depends on step 0, you end up with a \"pyramid of doom\". There is also <b>inversion of control</b>: you trust the library to call your callback exactly once, and nothing enforces that." },
        { code: `const { promisify } = require('util');

// A callback-style API (error-first, like most of Node's core)
function getUser(id, cb) { setTimeout(() => (id > 0 ? cb(null, { id, name: 'Asha' }) : cb(new Error('bad id'))), 10); }
function getOrders(user, cb) { setTimeout(() => cb(null, [101, 102]), 10); }
function getInvoice(orderId, cb) { setTimeout(() => cb(null, 'INV-' + orderId), 10); }

// Callback hell: nesting + repeated error checks
getUser(1, (err, user) => {
  if (err) return console.error(err);
  getOrders(user, (err, orders) => {
    if (err) return console.error(err);
    getInvoice(orders[0], (err, inv) => {
      if (err) return console.error(err);
      console.log('callbacks:', user.name, inv);
    });
  });
});

// Manual promisification
const getUserP = id => new Promise((resolve, reject) =>
  getUser(id, (err, user) => (err ? reject(err) : resolve(user))));

// util.promisify does the same for any error-first function
const getOrdersP = promisify(getOrders);
const getInvoiceP = promisify(getInvoice);

// Flat, readable, single error handler
(async () => {
  try {
    const user = await getUserP(1);
    const orders = await getOrdersP(user);
    console.log('async/await:', user.name, await getInvoiceP(orders[0]));
    await getUserP(-1);
  } catch (e) {
    console.log('one catch for every step:', e.message);
  }
})();`, lang: "javascript", title: "From pyramid to flat async/await" },
        { code: `callbacks: Asha INV-101
async/await: Asha INV-101
one catch for every step: bad id`, lang: "text", title: "Output" },
        { table: { head: ["", "Callbacks", "Promises / async-await"], rows: [
          ["Error handling", "Check <code>err</code> at every level", "One <code>.catch</code> / <code>try-catch</code>"],
          ["Composition", "Manual counters for parallel work", "<code>Promise.all</code>, <code>race</code>, …"],
          ["Guarantees", "Callback might fire twice or never", "Settles once; callbacks always async"],
          ["Readability", "Nests to the right", "Reads top to bottom"]
        ] } },
        { p: "Most Node core modules now ship promise versions, so you rarely need to promisify them yourself: <code>require('fs/promises')</code>, <code>require('timers/promises')</code> (<code>await setTimeout(100)</code>), <code>require('stream/promises')</code> (<code>pipeline</code>), and <code>dns/promises</code>. Event-based APIs can be awaited with <code>events.once(emitter, 'ready')</code>." },
        { warn: "When writing <code>new Promise</code> by hand, don't forget to <code>reject</code> on the error path, or the promise stays pending forever. Also avoid the \"explicit construction anti-pattern\": wrapping something that already returns a promise in <code>new Promise</code>." }
      ]
    },

    /* ───────────── Practical Patterns ───────────── */
    {
      id: "debounce-throttle",
      q: "What is the difference between debounce and throttle, and how do you implement each?",
      topic: "Practical Patterns",
      level: 2,
      top: true,
      short: "Both limit how often a function runs in response to a burst of events. Debounce waits until events stop for a given delay, then runs once with the last arguments; it suits search-as-you-type and resize-end. Throttle runs at most once per interval while events keep coming; it suits scroll handlers, mousemove and rate-limited API calls. Both are built with closures holding a timer or timestamp.",
      a: [
        { table: { head: ["", "Debounce", "Throttle"], rows: [
          ["Rule", "Run after <b>N ms of silence</b>", "Run at most <b>once every N ms</b>"],
          ["During a continuous burst", "Never fires (keeps resetting)", "Fires regularly"],
          ["Typical use", "Search box autocomplete, form validation, window resize end, autosave", "Infinite scroll, scroll position, mousemove/drag, button spam, game input"],
          ["Mental model", "Elevator door: waits until people stop entering", "Machine gun fire rate: fixed max frequency"]
        ] } },
        { code: `function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                                  // every new event resets the countdown
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {                         // leading-edge throttle
      last = now;
      fn.apply(this, args);
    }
  };
}

// Simulate a user typing 'javascript' (one keystroke every 20 ms)
const apiCalls = [];
const search = debounce(q => apiCalls.push(q), 100);
'javascript'.split('').forEach((ch, i) =>
  setTimeout(() => search('javascript'.slice(0, i + 1)), i * 20));

// Simulate a scroll event every 10 ms for 200 ms
let handled = 0;
const onScroll = throttle(() => handled++, 75);
for (let t = 0; t < 200; t += 10) setTimeout(onScroll, t);

setTimeout(() => {
  console.log('debounced API calls:', apiCalls);      // just one, with the final text
  console.log('scroll events: 20, throttled handler runs:', handled);
}, 500);`, lang: "javascript", title: "Implementations + simulated events" },
        { code: `debounced API calls: [ 'javascript' ]
scroll events: 20, throttled handler runs: 3`, lang: "text", title: "Output" },
        { p: "Production versions (lodash <code>_.debounce</code> / <code>_.throttle</code>) add <code>leading</code>/<code>trailing</code> options, <code>maxWait</code> (debounce that still fires during an endless burst), and <code>cancel()</code>/<code>flush()</code>. A trailing throttle also makes sure the <i>last</i> event is not lost: store the latest args and schedule one final call at the end of the interval." },
        { code: `// React: keep the debounced function stable across renders
function SearchBox() {
  const [q, setQ] = useState('');
  const fetchResults = useMemo(() => debounce(text => api.search(text), 300), []);
  useEffect(() => () => fetchResults.cancel?.(), [fetchResults]);   // cleanup on unmount
  return <input value={q} onChange={e => { setQ(e.target.value); fetchResults(e.target.value); }} />;
}`, lang: "jsx", title: "Common follow-up: using it in React" },
        { warn: "Creating <code>debounce(fn)</code> <b>inside</b> a render or a handler makes a new timer closure every time, so nothing is ever debounced. The debounced function must be created once and reused." },
        { tip: "Don't confuse this with server-side <b>rate limiting</b>, which protects the server and uses token bucket or sliding window counters. See <a href=\"#/core/sd/rate-limiting-algorithms\">rate limiting algorithms</a>." }
      ]
    },
    {
      id: "map-filter-reduce",
      q: "Explain map, filter and reduce. When would you use each, and can you implement map with reduce?",
      topic: "Practical Patterns",
      level: 1,
      top: true,
      short: "All three are non-mutating array methods that take a callback. map transforms each element and returns a new array of the same length. filter keeps elements whose callback returns truthy. reduce folds the array into a single accumulated value of any type: a sum, an object, a Map, even another array. They chain well for declarative data pipelines. Use forEach or a for loop when you need side effects or early exit.",
      a: [
        { table: { head: ["Method", "Callback returns", "Result", "Length"], rows: [
          ["<code>map(fn)</code>", "New value", "New array", "Same as input"],
          ["<code>filter(fn)</code>", "true/false", "New array (subset)", "≤ input"],
          ["<code>reduce(fn, init)</code>", "Next accumulator", "Anything", "N/A"],
          ["<code>forEach(fn)</code>", "Ignored", "<code>undefined</code>", "N/A (side effects only)"],
          ["<code>find</code> / <code>some</code> / <code>every</code>", "true/false", "Element / boolean", "Stop early"]
        ] } },
        { code: `const orders = [
  { id: 1, user: 'asha', amount: 250, status: 'paid' },
  { id: 2, user: 'ravi', amount: 400, status: 'pending' },
  { id: 3, user: 'asha', amount: 150, status: 'paid' },
  { id: 4, user: 'meera', amount: 900, status: 'paid' },
];

const paidTotal = orders
  .filter(o => o.status === 'paid')
  .map(o => o.amount)
  .reduce((sum, amt) => sum + amt, 0);
console.log('paid total:', paidTotal);

// reduce into an object: group order ids by user
const byUser = orders.reduce((acc, o) => {
  (acc[o.user] ??= []).push(o.id);
  return acc;
}, {});
console.log(byUser);

// Built-in grouping (ES2024, Node 21+)
console.log(Object.groupBy(orders, o => o.status));

// map implemented with reduce
const mapViaReduce = (arr, fn) => arr.reduce((out, x, i) => (out.push(fn(x, i, arr)), out), []);
console.log(mapViaReduce([1, 2, 3], x => x * 10));

// Traps
console.log(['1', '2', '3'].map(parseInt));
try { [].reduce((a, b) => a + b); } catch (e) { console.log(e.name + ': ' + e.message); }`, lang: "javascript", title: "A realistic pipeline" },
        { code: `paid total: 1300
{ asha: [ 1, 3 ], ravi: [ 2 ], meera: [ 4 ] }
[Object: null prototype] {
  paid: [
    { id: 1, user: 'asha', amount: 250, status: 'paid' },
    { id: 3, user: 'asha', amount: 150, status: 'paid' },
    { id: 4, user: 'meera', amount: 900, status: 'paid' }
  ],
  pending: [ { id: 2, user: 'ravi', amount: 400, status: 'pending' } ]
}
[ 10, 20, 30 ]
[ 1, NaN, NaN ]
TypeError: Reduce of empty array with no initial value`, lang: "text", title: "Output (Node 22)" },
        { code: `Array.prototype.myMap = function (fn, thisArg) {
  const out = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = fn.call(thisArg, this[i], i, this);   // skip holes like the real map
  }
  return out;
};
Array.prototype.myFilter = function (fn, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) if (i in this && fn.call(thisArg, this[i], i, this)) out.push(this[i]);
  return out;
};
console.log([1, 2, 3, 4].myMap(x => x * x).myFilter(x => x % 2 === 0));   // [ 4, 16 ]`, lang: "javascript", title: "Polyfills (asked often)" },
        { warn: "Always pass an <b>initial value</b> to <code>reduce</code>. Without one, the first element becomes the accumulator, and an empty array throws. Also, <code>map</code> used purely for side effects (ignoring the returned array) signals the wrong tool. Use <code>forEach</code> or <code>for...of</code> there, which also allows <code>break</code>." },
        { tip: "Performance follow-up: chaining makes several passes and intermediate arrays. That is fine for typical UI data, but for very hot paths or huge arrays a single <code>for</code> loop or a single <code>reduce</code> can be faster. Readability usually wins." }
      ]
    },
    {
      id: "event-delegation-bubbling",
      q: "What are event bubbling and capturing? What is event delegation and why use it?",
      topic: "Practical Patterns",
      level: 2,
      top: true,
      short: "A DOM event travels in three phases: capture (from window down to the target), target, then bubble (from the target back up to window). Listeners run in the bubble phase by default; pass {capture: true} for the capture phase. Event delegation puts a single listener on a common ancestor and uses event.target.closest() to work out which child was clicked. It saves memory and automatically works for elements added later.",
      a: [
        { p: "When you click a <code>&lt;button&gt;</code> inside <code>&lt;li&gt;</code> inside <code>&lt;ul&gt;</code>, the event is dispatched along the path <code>window → document → html → body → ul → li → button</code>:" },
        { svg: `<svg viewBox="0 0 640 210" width="640" class="dg">
  <rect class="box-p" x="40" y="20" width="160" height="34" rx="6"/>
  <text class="tx" x="120" y="37" text-anchor="middle" dominant-baseline="middle">document</text>
  <rect class="box-p" x="40" y="78" width="160" height="34" rx="6"/>
  <text class="tx" x="120" y="95" text-anchor="middle" dominant-baseline="middle">ul#todo  (listener)</text>
  <rect class="box-p" x="40" y="136" width="160" height="34" rx="6"/>
  <text class="tx" x="120" y="153" text-anchor="middle" dominant-baseline="middle">li</text>
  <rect class="box-a" x="260" y="136" width="160" height="34" rx="6"/>
  <text class="tx tx-b" x="340" y="153" text-anchor="middle" dominant-baseline="middle">button (target)</text>
  <line class="ln" x1="20" y1="30" x2="20" y2="150" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="14" y="190" text-anchor="start">1. capture ↓</text>
  <line class="ln" x1="200" y1="153" x2="258" y2="153" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="230" y="190" text-anchor="middle">2. target</text>
  <line class="ln-a" x1="440" y1="150" x2="440" y2="30" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="450" y="100">3. bubble ↑ (default phase)</text>
  <text class="tx-m" x="450" y="122">ul's listener sees e.target = button</text>
  <text class="tx-m" x="450" y="140">and e.currentTarget = ul</text>
</svg>`, caption: "Capture goes down, bubble comes back up. Delegation listens on the ancestor during bubbling." },
        { code: [
          { lang: "html", src: `<ul id="todo">
  <li data-id="1">Learn closures <button class="del">x</button></li>
  <li data-id="2">Event loop <button class="del">x</button></li>
</ul>
<button id="add">Add item</button>` },
          { lang: "javascript", run: false, src: `const list = document.getElementById('todo');

// ONE listener for every current and future <li>
list.addEventListener('click', (e) => {
  const delBtn = e.target.closest('button.del');     // the click may land on a nested element
  if (delBtn && list.contains(delBtn)) {
    delBtn.closest('li').remove();
    return;
  }
  const li = e.target.closest('li');
  if (li) li.classList.toggle('done');
  console.log('target:', e.target.tagName, '| currentTarget:', e.currentTarget.id);
});

// Newly added items work automatically: no new listeners needed
document.getElementById('add').addEventListener('click', () => {
  const li = document.createElement('li');
  li.dataset.id = Date.now();
  li.innerHTML = 'New task <button class="del">x</button>';
  list.append(li);
});

// Capture phase listener runs BEFORE bubble listeners
document.addEventListener('click', () => console.log('capture on document'), { capture: true });` }
        ], title: "Delegated to-do list (browser only)" },
        { table: { head: ["API", "Effect"], rows: [
          ["<code>e.target</code>", "The innermost element where the event originated"],
          ["<code>e.currentTarget</code>", "The element whose listener is running now (<code>this</code> in a regular-function handler)"],
          ["<code>e.stopPropagation()</code>", "Stop moving to further ancestors (other listeners on the same element still run)"],
          ["<code>e.stopImmediatePropagation()</code>", "Also skip the remaining listeners on the current element"],
          ["<code>e.preventDefault()</code>", "Cancel the browser's default action (link navigation, form submit). Propagation continues"],
          ["<code>{ once: true, passive: true }</code>", "Auto-remove after first call; promise not to call preventDefault (smooth scrolling)"]
        ] } },
        { ul: [
          "<b>Why delegate:</b> 1 listener instead of 1000 (less memory, faster setup), dynamic children handled for free, and nothing to clean up when rows are removed.",
          "<b>Events that don't bubble:</b> <code>focus</code>, <code>blur</code>, <code>mouseenter</code>, <code>mouseleave</code>, <code>load</code>. Use <code>focusin</code>/<code>focusout</code>/<code>mouseover</code> for delegation, or listen in the capture phase.",
          "<b>React</b> already delegates: since React 17 it attaches one listener per event type at the root container and dispatches synthetic events through the component tree."
        ] },
        { warn: "Overusing <code>stopPropagation()</code> breaks delegated handlers higher up, such as analytics, \"click outside to close\" menus and modals. Prefer checking <code>e.target</code> in the ancestor." }
      ]
    },

    /* ───────────── Runtime & Modules ───────────── */
    {
      id: "esm-vs-commonjs",
      q: "What is the difference between ES Modules and CommonJS?",
      topic: "Runtime & Modules",
      level: 2,
      top: false,
      short: "CommonJS (require and module.exports) is Node's original module system: synchronous, evaluated at runtime, and it exports a copy of the module.exports object. ES Modules (import and export) are the standard: static, so imports are resolved before any code runs, which enables tree-shaking. ESM loads asynchronously, exports live read-only bindings, supports top-level await and runs in strict mode. Node picks ESM for .mjs files or when package.json has \"type\": \"module\".",
      a: [
        { code: [
          { lang: "javascript", run: false, src: `// math.cjs: CommonJS
const PI = 3.14159;
function area(r) { return PI * r * r; }
module.exports = { area, PI };          // or exports.area = area

// app.cjs
const { area } = require('./math.cjs');  // synchronous; can be inside if/else
console.log(area(2), __dirname);` },
          { lang: "javascript", run: false, src: `// math.mjs: ES module
export const PI = 3.14159;
export function area(r) { return PI * r * r; }
export default area;

// app.mjs
import area, { PI } from './math.mjs';      // hoisted, static, must be top-level
const config = await import('./config.mjs'); // dynamic import returns a promise
const data = await fetch('https://example.com/x');  // top-level await (ESM only)
console.log(area(2), import.meta.dirname);   // __dirname replacement (Node 20.11+)` }
        ], title: "Same module, both systems" },
        { table: { head: ["", "CommonJS", "ES Modules"], rows: [
          ["Syntax", "<code>require()</code>, <code>module.exports</code>", "<code>import</code>, <code>export</code>"],
          ["Resolution", "Runtime, dynamic (any expression, anywhere)", "Static, parsed before execution (dynamic only via <code>import()</code>)"],
          ["Loading", "Synchronous", "Asynchronous (fetch, link, evaluate phases)"],
          ["Exports", "A value copy of <code>module.exports</code> at require time", "Live, read-only bindings"],
          ["Top-level await", "No", "Yes"],
          ["Strict mode", "Opt-in", "Always"],
          ["Top-level <code>this</code>", "<code>module.exports</code>", "<code>undefined</code>"],
          ["<code>__dirname</code>, <code>require</code>", "Available", "Use <code>import.meta.dirname</code> / <code>import.meta.url</code>"],
          ["Tree-shaking", "Hard (dynamic)", "Yes, bundlers can drop unused exports"],
          ["Node selects by", "<code>.cjs</code> or default", "<code>.mjs</code> or <code>\"type\": \"module\"</code>"],
          ["Browsers", "No (needs bundler)", "Native <code>&lt;script type=\"module\"&gt;</code>"]
        ] } },
        { code: `// Runs as CommonJS (the default for a .js file without "type": "module")
console.log(typeof require, typeof module.exports, this === module.exports);

// CommonJS can load ESM asynchronously with dynamic import()
import('data:text/javascript,export const x = 1; export default "hello from ESM"')
  .then(m => console.log(m.default, m.x));

// The CJS "copy" semantics: destructured primitives don't update
const lib = (() => {
  const mod = { exports: {} };
  let count = 0;
  mod.exports = { count, inc() { count++; } };
  return mod.exports;
})();
const { count } = lib;
lib.inc();
console.log('cjs copy still sees', count);   // in ESM, an exported let would read 1`, lang: "javascript", title: "Checking it in Node 22" },
        { code: `function object true
cjs copy still sees 0
hello from ESM 1`, lang: "text", title: "Output" },
        { p: "<b>Interop:</b> ESM can <code>import</code> CommonJS (the <code>module.exports</code> object becomes the default export). CommonJS can always <code>await import()</code> ESM. Synchronous <code>require()</code> of an ES module (without top-level await) became available without a flag in Node 22.12 / 20.19. Before that it threw <code>ERR_REQUIRE_ESM</code>, which is why many packages shipped dual builds." },
        { warn: "Circular dependencies behave differently. In CJS you get a partially filled <code>module.exports</code>, often <code>{}</code>. In ESM you get a TDZ ReferenceError if a binding is used before its module has evaluated." },
        { tip: "In 2025-26, new Node projects and every frontend (Vite, Next.js) use ESM. You still meet CommonJS in older Express codebases, Jest configs and many npm packages, so being able to explain the interop story is a plus." }
      ]
    },
    {
      id: "gc-memory-leaks",
      q: "How does garbage collection work in JavaScript? What causes memory leaks and how do you find them?",
      topic: "Runtime & Modules",
      level: 3,
      top: false,
      short: "JavaScript frees memory automatically using reachability. Anything reachable from the roots (globals, the current call stack, active closures) survives, and the rest is collected with mark-and-sweep. V8 is generational: short-lived objects are cheaply scavenged in the young generation, survivors are promoted and later mark-compacted. A leak is memory you no longer need that is still reachable: forgotten timers and listeners, unbounded caches, globals, closures over big data, or detached DOM nodes.",
      a: [
        { p: "Since about 2012, every engine uses <b>mark-and-sweep</b> (tracing), not reference counting. Starting from <b>roots</b> (global object, stack frames, registers, handles held by the host), the GC <b>marks</b> everything reachable, then <b>sweeps</b> (frees) the rest. Two objects that reference each other but are unreachable from any root get collected, so cycles are fine, unlike with pure reference counting." },
        { table: { head: ["V8 space", "Algorithm", "Notes"], rows: [
          ["Young generation (nursery, a few MB)", "<b>Scavenger</b>: semi-space copying (Cheney)", "Most objects die young, so collection is very fast and frequent (minor GC)"],
          ["Old generation", "<b>Mark-Sweep-Compact</b>", "Objects that survive two scavenges are promoted here; major GC"],
          ["Orinoco optimisations", "Incremental, concurrent and parallel marking, lazy sweeping", "Keep main-thread pauses short (usually a few ms)"]
        ] } },
        { code: `const v8 = require('v8'), vm = require('vm');
v8.setFlagsFromString('--expose-gc');             // demo only: lets us force a GC
const gc = vm.runInNewContext('gc');
const heapMB = () => process.memoryUsage().heapUsed / 1024 / 1024;

gc(); const base = heapMB();

// "Cache" that only ever grows: a module-level array is always reachable from a root
const cache = [];
for (let i = 0; i < 100000; i++) cache.push({ id: i, payload: 'x'.repeat(100) + i });
gc(); console.log('while referenced, heap grew > 10 MB:', heapMB() - base > 10);

cache.length = 0;                                   // drop the references
gc(); console.log('after clearing, back near baseline:', heapMB() - base < 3);

// WeakMap: entries vanish when the key object becomes unreachable
const meta = new WeakMap();
let user = { name: 'Asha' };
meta.set(user, { lastSeen: Date.now() });
user = null;                                        // the entry is now collectable
console.log('WeakMap entries cannot leak their keys');`, lang: "javascript", title: "Reachability, shown with heapUsed" },
        { code: `while referenced, heap grew > 10 MB: true
after clearing, back near baseline: true
WeakMap entries cannot leak their keys`, lang: "text", title: "Output (Node 22)" },
        { table: { head: ["Common leak", "Why it stays reachable", "Fix"], rows: [
          ["Forgotten <code>setInterval</code>", "The timer list holds the callback and its closure", "<code>clearInterval</code> on teardown / React effect cleanup"],
          ["Event listeners never removed", "The emitter or element holds the handler", "<code>removeEventListener</code>, <code>{ once: true }</code>, <code>AbortController</code> signal"],
          ["Unbounded in-memory cache / Map", "A module-level Map is a root", "LRU with max size, TTL, <code>WeakMap</code> keyed by object, or Redis"],
          ["Accidental globals", "<code>x = 5</code> without a declaration (sloppy mode) attaches to <code>globalThis</code>", "<code>'use strict'</code>, ESM, linters"],
          ["Closures capturing big objects", "A small long-lived function keeps the whole scope alive", "Copy just what you need, null out references"],
          ["Detached DOM nodes", "Removed from the page but still referenced from JS (array, cache)", "Drop references; use WeakRef/WeakMap"],
          ["Node: storing per-request data globally", "A global array of <code>req</code> objects grows with traffic", "Keep request data request-scoped (<code>AsyncLocalStorage</code>)"]
        ] } },
        { p: "<b>Finding leaks:</b> in Chrome DevTools, use the Memory tab. Take heap snapshot A, perform the action several times, take snapshot B, and use the \"Comparison\" view sorted by <i>Retained Size</i>. The retainers panel shows the chain that keeps an object alive. In Node, watch <code>process.memoryUsage().heapUsed</code> over time, run with <code>node --inspect</code> and attach DevTools, or write snapshots with <code>v8.writeHeapSnapshot()</code>. Heap that keeps rising after every GC, eventually ending in \"JavaScript heap out of memory\", is the signature of a leak." },
        { tip: "Compare with Java GC: the same reachability idea and generational design, but you control heap size with <code>--max-old-space-size</code> in Node instead of <code>-Xmx</code>. See <a href=\"#/core/oops/garbage-collection\">garbage collection</a> and <a href=\"#/core/oops/memory-leaks-java\">memory leaks in Java</a> for the theory." }
      ]
    }
  ]
});
