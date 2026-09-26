/* core subject: Object-Oriented Programming (Java) — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "oops",
  title: "Object-Oriented Programming",
  short: "OOPS",
  icon: "◇",
  blurb: "Interviewers test whether you can explain the four pillars with real Java code, know what the JVM does behind overriding, constructors, equals/hashCode and garbage collection, and can reason about abstract classes vs interfaces, immutability and object copying. Expect a design-pattern or SOLID follow-up at SDE level.",
  topics: [
    "Fundamentals",
    "Classes & Objects",
    "Encapsulation & Abstraction",
    "Inheritance",
    "Polymorphism",
    "Constructors & Object Lifecycle",
    "Memory & References",
    "Java Specifics",
    "Design Principles & Patterns"
  ],
  questions: [

    /* ───────────── Fundamentals ───────────── */
    {
      id: "what-is-oop",
      q: "What is Object-Oriented Programming? How is it different from procedural programming?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "OOP is a paradigm that models a program as a set of objects that bundle data (state) with the methods that operate on it (behaviour). Procedural programming organises code as a sequence of functions acting on separate, often global, data.",
      a: [
        { p: "<b>Object-Oriented Programming</b> is a programming paradigm in which a program is built from <b>objects</b> — instances of <b>classes</b> that combine <i>data</i> (fields) and <i>behaviour</i> (methods). Objects interact by calling each other's methods, and the language enforces boundaries (access modifiers, interfaces) between them." },
        { p: "<b>Procedural programming</b> (C, Pascal) structures a program as a top-down sequence of procedures. Data and functions are separate; any function can usually touch any data it can reach." },
        { table: { head: ["Aspect", "Procedural", "Object-Oriented"], rows: [
          ["Unit of design", "Function / procedure", "Class / object"],
          ["Data & behaviour", "Kept separate", "Bundled together (encapsulation)"],
          ["Approach", "Top-down (break task into steps)", "Bottom-up (model entities, then compose)"],
          ["Data security", "Global data freely modified", "Access modifiers hide internal state"],
          ["Reuse", "Copy / call functions", "Inheritance, composition, polymorphism"],
          ["Extending", "Often edit existing functions (switch on type)", "Add a new subclass; existing code untouched"],
          ["Examples", "C, Pascal, Fortran", "Java, C#, Python, C++"]
        ] } },
        { p: "OOP shines for large systems with many interacting entities and long lifetimes (easier maintenance, modularity, team work). Procedural code is often simpler for small, linear tasks or tight numeric loops." },
        { tip: "Java is class-based: every method lives inside a class. But primitives (<code>int</code>, <code>double</code>) are not objects and static methods run without any object, so Java is not '100% pure' OOP — Smalltalk is the usual example of a pure OO language." }
      ]
    },
    {
      id: "java-pure-oop",
      q: "Is Java a purely object-oriented language? Why or why not?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "No. A pure OO language treats everything as an object and does everything via method calls. Java keeps eight primitive types (int, char, boolean...) that are not objects, allows static methods and fields that belong to no object, and its wrapper classes exist precisely to bridge that gap.",
      a: [
        { p: "A language is called <b>purely object-oriented</b> if it satisfies all seven qualities below. Java satisfies the first four and fails the last three because of primitives and statics." },
        { table: { head: ["Quality", "Java"], rows: [
          ["Encapsulation / data hiding", "Yes — classes and access modifiers"],
          ["Inheritance", "Yes — <code>extends</code> / <code>implements</code>"],
          ["Polymorphism", "Yes — overloading and overriding"],
          ["Abstraction", "Yes — abstract classes and interfaces"],
          ["All predefined types are objects", "<b>No</b> — <code>int</code>, <code>double</code>, <code>boolean</code>… are primitives"],
          ["All user-defined types are objects", "Yes — every class extends <code>Object</code>"],
          ["All operations are method calls on objects", "<b>No</b> — <code>static</code> methods and <code>a + b</code> on primitives need no object"]
        ] } },
        { code: `public class Main {
    public static void main(String[] args) {      // static: runs with no object at all
        int a = 5;                                // primitive: not an object, no methods
        Integer b = a;                            // autoboxing to a wrapper object
        System.out.println(b.compareTo(7));       // now we can call methods on it
        System.out.println(Math.max(a, 9));       // static utility call, no object
    }
}`, lang: "java" },
        { p: "Primitives were kept for <b>performance</b>: an <code>int</code> is 4 bytes on the stack, whereas an <code>Integer</code> is a heap object with a header, and arithmetic on it requires unboxing." },
        { tip: "Follow-up: 'Then why have wrapper classes?' — so primitives can live in collections and generics (<code>List&lt;Integer&gt;</code>), and to provide utility methods like <code>Integer.parseInt</code>." }
      ]
    },
    {
      id: "four-pillars",
      q: "What are the four pillars of OOP?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "Encapsulation (bundle data with methods and restrict access), Abstraction (expose what, hide how), Inheritance (derive new classes from existing ones, is-a reuse) and Polymorphism (one interface, many implementations).",
      a: [
        { p: "The four pillars are the core ideas every OOP language supports:" },
        { table: { head: ["Pillar", "Meaning", "Java mechanism"], rows: [
          ["<b>Encapsulation</b>", "Bundle data and the methods that use it into one unit, and control access to the data", "<code>class</code> + <code>private</code> fields, public getters/setters"],
          ["<b>Abstraction</b>", "Show only essential features, hide implementation details", "<code>abstract class</code>, <code>interface</code>"],
          ["<b>Inheritance</b>", "A class acquires the fields and methods of another (is-a)", "<code>class Dog extends Animal</code>"],
          ["<b>Polymorphism</b>", "Same call behaves differently depending on the object / arguments", "Overloading (compile time), overriding via <code>@Override</code> (run time)"]
        ] } },
        { code: `abstract class Animal {                    // Abstraction: what, not how
    abstract void speak();
}

class Dog extends Animal {                 // Inheritance: Dog is-an Animal
    private String name;                   // Encapsulation: hidden state
    Dog(String name) { this.name = name; }
    @Override
    void speak() {                         // Polymorphism: overriding
        System.out.println(name + " says Woof");
    }
}

class Zoo {
    static void makeNoise(Animal a) { a.speak(); }   // works for any Animal
}`, lang: "java", title: "All four pillars in 15 lines" },
        { tip: "Give a one-line real-world example for each (e.g. ATM: you press 'withdraw' (abstraction), your balance is private (encapsulation), SavingsAccount is-an Account (inheritance), withdraw() behaves differently per account type (polymorphism))." }
      ]
    },
    {
      id: "class-vs-object",
      q: "What is the difference between a class and an object?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "A class is a user-defined blueprint/type that declares fields and methods; it occupies no memory for instance data by itself. An object is a concrete instance of that class created at run time with new, with its own heap memory holding the field values.",
      a: [
        { p: "A <b>class</b> is a blueprint or user-defined type: it describes what data an entity holds and what it can do. An <b>object</b> is an <b>instance</b> of a class — an actual region of heap memory with its own copy of the non-static fields." },
        { table: { head: ["Class", "Object"], rows: [
          ["Logical template / type", "Physical, real instance"],
          ["Declared once", "Many objects can be created from one class"],
          ["No memory for instance fields when declared (only class metadata)", "Memory allocated on the heap at creation"],
          ["Defined with the <code>class</code> keyword", "Created with <code>new</code> (also reflection, <code>clone()</code>, deserialization)"],
          ["Example: <code>Car</code>", "Example: <code>myCar</code>, <code>yourCar</code>"]
        ] } },
        { code: `class Car {
    String brand;
    int speed = 0;
    void accelerate(int d) { speed += d; }
}

public class Main {
    public static void main(String[] args) {
        Car a = new Car();   // object created on the heap; 'a' is a reference to it
        a.brand = "Tata";
        a.accelerate(20);

        Car b = a;           // NOT a new object: second reference to the same Car
        b.accelerate(10);
        System.out.println(a.speed);   // 30
    }
}`, lang: "java", title: "Class definition vs object creation" },
        { warn: "Methods are <b>not</b> stored inside each object. All objects share one copy of the bytecode in the JVM's method area; only instance fields take per-object space (plus a 12–16 byte object header on HotSpot)." }
      ]
    },
    {
      id: "is-a-vs-has-a",
      q: "What is the difference between an IS-A and a HAS-A relationship?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "IS-A is inheritance: a Dog is an Animal, so Dog extends Animal. HAS-A is composition/aggregation: a Car has an Engine, so Car holds an Engine field. Prefer HAS-A unless the subtype truly can be used everywhere the base is expected.",
      a: [
        { p: "<b>IS-A</b> models <b>inheritance</b> (generalisation): the subclass is a specialised kind of the superclass and can be substituted wherever the superclass is expected. <b>HAS-A</b> models <b>containment</b> (association, aggregation or composition): one object owns or uses another through a field." },
        { table: { head: ["", "IS-A", "HAS-A"], rows: [
          ["Mechanism", "<code>extends</code> / <code>implements</code>", "A field holding a reference"],
          ["Coupling", "Tight — subclass depends on superclass internals", "Loose — only on the member's public interface"],
          ["Binding", "Fixed at compile time", "Can be swapped at run time"],
          ["Test", "<code>dog instanceof Animal</code> is true", "<code>car.getEngine()</code> returns an Engine"],
          ["Example", "<code>Circle</code> is-a <code>Shape</code>", "<code>Car</code> has-an <code>Engine</code>"]
        ] } },
        { code: `class Engine  { void start() { System.out.println("vroom"); } }
class Vehicle { }

class Car extends Vehicle {                  // IS-A  : Car is a Vehicle
    private Engine engine = new Engine();    // HAS-A : Car has an Engine
    void drive() { engine.start(); }         // delegation
}`, lang: "java" },
        { tip: "Quick test: if the sentence 'X is a Y' sounds right in every context, inheritance may fit; if 'X has a Y' fits, use a field. A Stack is <i>not</i> a Vector (it must not expose insert-at-middle), so Stack should HAVE a list — Java's <code>Stack extends Vector</code> is the classic mistake." }
      ]
    },
    {
      id: "coupling-cohesion",
      q: "What are coupling and cohesion? Which do we want high or low?",
      topic: "Fundamentals",
      level: 2,
      top: true,
      short: "Coupling is how strongly one module depends on others; cohesion is how closely the responsibilities inside one module belong together. Good design has low coupling and high cohesion.",
      a: [
        { p: "<b>Coupling</b> measures inter-module dependency: how much class A knows about and relies on the internals of class B. <b>Cohesion</b> measures intra-module focus: how strongly the methods and data within one class relate to a single purpose." },
        { table: { head: ["", "Coupling", "Cohesion"], rows: [
          ["Measures", "Dependencies <i>between</i> classes", "Relatedness <i>within</i> a class"],
          ["Goal", "<b>Low</b> (loose)", "<b>High</b>"],
          ["Bad sign", "Changing one class forces changes in many others", "A 'God class' doing DB, UI, email and logging"],
          ["How to improve", "Depend on interfaces, dependency injection, hide internals", "Single Responsibility Principle, split classes"]
        ] } },
        { code: `class MySqlDatabase { /* concrete driver */ }

// Tight coupling: ReportService is hard-wired to MySQL
class ReportService {
    private MySqlDatabase db = new MySqlDatabase();   // concrete class, created inside
}

// Loose coupling: depends on an abstraction, injected from outside
interface Database { String query(String sql); }

class ReportService2 {
    private final Database db;
    ReportService2(Database db) { this.db = db; }     // constructor injection
}
// new ReportService2(new MySqlDb());  in prod
// new ReportService2(new FakeDb());   in unit tests`, lang: "java", title: "Reducing coupling via an interface" },
        { tip: "Link it to SOLID: SRP raises cohesion, DIP and ISP lower coupling. Low coupling makes unit testing easy because dependencies can be mocked — this is exactly what Spring's dependency injection automates." }
      ]
    },

    /* ───────────── Classes & Objects ───────────── */
    {
      id: "access-specifiers",
      q: "Explain the access modifiers in Java. What is package-private (default) access?",
      topic: "Classes & Objects",
      level: 1,
      top: true,
      short: "Java has four access levels: public (everywhere), protected (same package plus subclasses in any package), package-private/default (no keyword: same package only) and private (same class only). A top-level class can only be public or package-private.",
      a: [
        { p: "Access modifiers implement <b>encapsulation</b> by controlling which code can see a class or member." },
        { table: { head: ["Modifier", "Same class", "Same package", "Subclass (other pkg)", "World"], rows: [
          ["<code>public</code>", "Yes", "Yes", "Yes", "Yes"],
          ["<code>protected</code>", "Yes", "Yes", "Yes", "No"],
          ["<i>default</i> (no keyword)", "Yes", "Yes", "No", "No"],
          ["<code>private</code>", "Yes", "No", "No", "No"]
        ] } },
        { code: `package shop;

public class Account {
    public    String owner;      // everywhere
    protected double balance;    // package shop + any subclass anywhere
    String    branch;            // package-private: package shop only
    private   String pin;        // this class only (including its nested classes)

    private Account() {}                                   // private constructor is allowed
    public static Account open() { return new Account(); } // controlled creation
}

// package bank;
// class Savings extends shop.Account {
//     void f() { balance = 0;  /* OK: subclass */
//                branch = "";  /* error: package-private */ }
// }`, lang: "java" },
        { ul: [
          "A <b>top-level class</b> can only be <code>public</code> or package-private; <code>private</code>/<code>protected</code> apply to nested classes and members.",
          "<code>protected</code> is <i>wider</i> than it sounds: it also grants access to every class in the same package.",
          "<code>private</code> is per <b>class</b>, not per object: one <code>Account</code> may read another's <code>pin</code> inside <code>Account</code>'s own methods (that's how <code>equals</code> works).",
          "Interface members are implicitly <code>public</code>; interface fields are <code>public static final</code>.",
          "Access is checked at <b>compile time</b>; reflection with <code>setAccessible(true)</code> can bypass it (modules restrict this)."
        ] },
        { tip: "Classic quick-fire: 'Which is more restrictive, default or protected?' — default. 'Can a method be more restrictive when overridden?' — no, only same or wider." }
      ]
    },
    {
      id: "this-pointer",
      q: "What is the this keyword in Java? Where is it used?",
      topic: "Classes & Objects",
      level: 1,
      top: true,
      short: "this is an implicit reference, available in every constructor and instance method, to the object on which the method was called. It resolves field/parameter name clashes, enables method chaining, passes the current object to others and, as this(...), calls another constructor of the same class.",
      a: [
        { p: "Every non-static method and constructor receives a hidden reference named <code>this</code> to the current object. The compiler inserts it automatically when you write <code>x</code> for a field (<code>this.x</code>), so you only need to write it explicitly in a few situations:" },
        { ul: [
          "Disambiguate a field from a parameter with the same name: <code>this.x = x;</code>",
          "Return <code>this</code> for <b>method chaining</b> (builder / fluent APIs like <code>StringBuilder.append</code>)",
          "Pass the current object to another method: <code>registry.add(this);</code>",
          "<code>this(...)</code> calls another constructor of the same class (<b>constructor chaining</b>) — must be the first statement",
          "Access the outer instance from an inner class: <code>Outer.this.x</code>"
        ] },
        { code: `class Counter {
    private int value;

    Counter()          { this(0); }               // constructor chaining
    Counter(int value) { this.value = value; }    // field vs parameter

    Counter add(int value) {
        this.value += value;
        return this;                              // enable chaining
    }
    int get() { return value; }                   // implicit this.value
}

public class Main {
    public static void main(String[] args) {
        Counter c = new Counter();
        System.out.println(c.add(2).add(3).get());   // 5
    }
}`, lang: "java" },
        { warn: "<code>this</code> is not available in a <b>static</b> context (static methods and static blocks are not called on an object) and cannot be reassigned — <code>this = null;</code> is a compile error." }
      ]
    },
    {
      id: "static-members",
      q: "What are static fields and static methods? Static vs instance members?",
      topic: "Classes & Objects",
      level: 1,
      top: true,
      short: "A static member belongs to the class, not to any object: one shared copy exists for all instances and it is accessed via the class name. Static methods have no this reference so they can only directly use static members. Instance members exist separately in every object.",
      a: [
        { p: "<b>Instance</b> members belong to each object: every object has its own copy of instance fields, and instance methods run on a specific object (have <code>this</code>). <b>Static</b> members belong to the <b>class</b>: one copy shared across all objects, created when the class is loaded and alive for the whole program." },
        { table: { head: ["", "Instance", "Static"], rows: [
          ["Copies", "One per object", "One per class"],
          ["Access", "<code>obj.x</code>", "<code>ClassName.x</code>"],
          ["<code>this</code> available", "Yes", "No"],
          ["Can access", "Static and instance members", "Only static members directly"],
          ["Can be overridden", "Yes", "No (a same-signature static method <i>hides</i> the parent's)"],
          ["Typical use", "Object state", "Counters, constants, factory methods, utility methods, <code>main</code>"]
        ] } },
        { code: `class Student {
    private static int count = 0;           // shared by all Students
    private final String name;              // per object

    static { System.out.println("class loaded"); }   // static block: runs once, at class init

    Student(String name) { this.name = name; count++; }

    static int getCount() { return count; }          // no 'this': cannot touch 'name'
    String getName()      { return name; }           // can use both name and count
}

public class Main {
    public static void main(String[] args) {         // static so the JVM needs no object
        new Student("Asha"); new Student("Ravi");
        System.out.println(Student.getCount());      // 2  (call via class name)
    }
}`, lang: "java" },
        { ul: [
          "A <b>static nested class</b> does not hold a reference to an outer instance; an inner (non-static) class does.",
          "Static methods are bound at <b>compile time</b>, cannot be abstract, and cannot use <code>super</code> or <code>this</code>.",
          "Static fields live with the <code>Class</code> object (heap since Java 8) and are initialised in textual order when the class is first actively used.",
          "Too many statics = global state: hard to test and thread-unsafe. Use them for stateless utilities and constants."
        ] },
        { tip: "Interview favourite: why is <code>main</code> static? Because the JVM must call it before any object exists. Can we overload <code>main</code>? Yes, but only <code>public static void main(String[])</code> is the entry point." }
      ]
    },
    {
      id: "object-class-methods",
      q: "What methods does java.lang.Object provide? Which ones do you usually override?",
      topic: "Classes & Objects",
      level: 2,
      top: true,
      short: "Every class implicitly extends Object, which gives it equals, hashCode, toString, getClass, clone, finalize and the monitor methods wait/notify/notifyAll. You typically override equals, hashCode and toString; clone only when implementing Cloneable; the rest are final or deprecated.",
      a: [
        { p: "<code>Object</code> is the root of Java's single-rooted class hierarchy, so every reference can be treated as an <code>Object</code> and every object has these methods:" },
        { table: { head: ["Method", "Default behaviour", "Override?"], rows: [
          ["<code>equals(Object)</code>", "Reference equality (<code>==</code>)", "Yes, for value semantics — together with <code>hashCode</code>"],
          ["<code>hashCode()</code>", "Identity hash (often address-based)", "Yes, whenever <code>equals</code> is overridden"],
          ["<code>toString()</code>", "<code>ClassName@hexHash</code>", "Yes, for readable logs/debugging"],
          ["<code>getClass()</code>", "Runtime <code>Class</code> object", "<b>final</b> — cannot"],
          ["<code>clone()</code>", "Field-by-field shallow copy; <code>protected</code>; throws unless <code>Cloneable</code>", "Only if the class supports cloning"],
          ["<code>finalize()</code>", "Nothing; called by GC before reclaim", "No — deprecated since Java 9"],
          ["<code>wait()</code> / <code>notify()</code> / <code>notifyAll()</code>", "Thread coordination on the object's monitor", "<b>final</b> — cannot"]
        ] } },
        { code: `import java.util.Objects;

class Employee {
    private final int id;
    private final String name;
    Employee(int id, String name) { this.id = id; this.name = name; }

    @Override public String toString() { return "Employee{" + id + ", " + name + "}"; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Employee)) return false;      // also rejects null
        Employee e = (Employee) o;
        return id == e.id && Objects.equals(name, e.name);
    }
    @Override public int hashCode() { return Objects.hash(id, name); }   // same fields as equals
}`, lang: "java" },
        { ul: [
          "<code>getClass()</code> returns the <b>runtime</b> class: <code>Object o = new Employee(1, \"A\"); o.getClass()</code> is <code>Employee.class</code>.",
          "<code>wait/notify</code> must be called while holding the object's monitor (<code>synchronized</code>), otherwise <code>IllegalMonitorStateException</code>.",
          "Records generate <code>equals</code>, <code>hashCode</code> and <code>toString</code> automatically."
        ] },
        { tip: "Debate to know: <code>instanceof</code> in <code>equals</code> allows subclass equality (may break symmetry), <code>getClass() == o.getClass()</code> is strict. Effective Java recommends <code>instanceof</code> unless the class is final." }
      ]
    },
    {
      id: "nested-inner-classes",
      q: "What are nested classes in Java? Compare static nested, inner, local and anonymous classes.",
      topic: "Classes & Objects",
      level: 2,
      top: true,
      short: "A nested class is declared inside another class. A static nested class is just a namespaced class with no outer instance. An inner (non-static) class holds a hidden reference to its enclosing instance and can use its private members. Local classes live inside a method; anonymous classes are one-off implementations created inline.",
      a: [
        { table: { head: ["Kind", "Declared", "Needs outer instance", "Typical use"], rows: [
          ["Static nested", "<code>static class</code> inside a class", "No", "Helper types: <code>Map.Entry</code>, builders, node classes"],
          ["Inner (member)", "non-static class inside a class", "Yes — <code>Outer.this</code>", "Iterators, objects tightly bound to one outer object"],
          ["Local", "Inside a method body", "Yes if in instance method", "Type needed only within one method"],
          ["Anonymous", "<code>new Interface() { ... }</code>", "Yes if in instance context", "One-off listeners/comparators (mostly replaced by lambdas)"]
        ] } },
        { code: `class Outer {
    private int x = 10;

    static class StaticNested {                  // no reference to an Outer instance
        void hi() { System.out.println("nested"); }
    }
    class Inner {                                // holds Outer.this
        void show() { System.out.println(x); }   // can read Outer's private fields
    }
    void run() {
        class Local { int twice() { return 2 * x; } }   // local class: visible only in run()
        Runnable r = new Runnable() {                   // anonymous class
            @Override public void run() { System.out.println(x + new Local().twice()); }
        };
        r.run();                                        // 30
    }
}

public class Main {
    public static void main(String[] args) {
        Outer.StaticNested n = new Outer.StaticNested();   // no Outer needed
        Outer o = new Outer();
        Outer.Inner in = o.new Inner();                    // needs an Outer instance
        in.show();                                         // 10
    }
}`, lang: "java" },
        { ul: [
          "Nested classes can be <code>private</code>/<code>protected</code>, unlike top-level classes.",
          "Local and anonymous classes can capture only <b>effectively final</b> local variables.",
          "A lambda is <i>not</i> an anonymous class: it has no <code>this</code> of its own (<code>this</code> means the enclosing instance) and no new scope."
        ] },
        { warn: "An inner class silently keeps its outer object alive. Long-lived inner objects (listeners, threads, cached entries) are a classic memory-leak source — prefer <code>static</code> nested classes unless you need the outer instance." }
      ]
    },

    /* ───────────── Encapsulation & Abstraction ───────────── */
    {
      id: "encapsulation-vs-abstraction",
      q: "What is the difference between encapsulation and abstraction?",
      topic: "Encapsulation & Abstraction",
      level: 1,
      top: true,
      short: "Abstraction is a design-level idea: expose only what an object does and hide how (via interfaces/abstract classes). Encapsulation is an implementation-level mechanism: bundle data with its methods and restrict direct access (via access modifiers). Abstraction hides complexity; encapsulation hides and protects data.",
      a: [
        { p: "<b>Abstraction</b> = focusing on <i>what</i> an object does and hiding <i>how</i>. <b>Encapsulation</b> = wrapping data and methods into a single unit and controlling access so the internal state can only change through well-defined methods." },
        { table: { head: ["", "Abstraction", "Encapsulation"], rows: [
          ["Focus", "What the object does (outside view)", "How data is protected (inside view)"],
          ["Level", "Design level", "Implementation level"],
          ["Hides", "Implementation complexity", "Internal data / state"],
          ["Achieved by", "<code>abstract class</code>, <code>interface</code>, public APIs", "<code>private</code> fields + public getters/setters, classes"],
          ["Example", "<code>car.start()</code> — you don't know about the ignition sequence", "<code>fuelLevel</code> is private; only <code>refuel()</code> may change it"]
        ] } },
        { code: `interface Shape {                       // ABSTRACTION: callers only see area()
    double area();
}

class Circle implements Shape {
    private double r;                   // ENCAPSULATION: state hidden
    Circle(double radius) { setRadius(radius); }

    void setRadius(double radius) {     // controlled access, with validation
        if (radius < 0) throw new IllegalArgumentException("negative radius");
        r = radius;
    }
    @Override public double area() { return Math.PI * r * r; }
}`, lang: "java" },
        { tip: "One-liner for interviews: 'Abstraction solves the problem at the design level by hiding complexity; encapsulation solves it at the implementation level by hiding data.' Real-world: a TV remote's buttons are abstraction; the sealed casing around the circuit is encapsulation." }
      ]
    },
    {
      id: "data-hiding",
      q: "What is data hiding? How is it different from encapsulation?",
      topic: "Encapsulation & Abstraction",
      level: 1,
      top: true,
      short: "Data hiding means making a class's fields inaccessible from outside (private) so they can only be changed through validated methods. Encapsulation is the broader idea of bundling data with methods; data hiding is the access-restriction part of it.",
      a: [
        { p: "<b>Data hiding</b> restricts direct access to an object's fields by declaring them <code>private</code> (or <code>protected</code>), so that the object can enforce its own <b>invariants</b> (e.g. balance never negative)." },
        { code: `public class BankAccount {
    private double balance;           // hidden

    public void deposit(double amt) {
        if (amt <= 0) throw new IllegalArgumentException("bad amount");
        balance += amt;
    }
    public boolean withdraw(double amt) {
        if (amt > balance) return false;   // invariant protected
        balance -= amt;
        return true;
    }
    public double getBalance() { return balance; }   // read-only view
}
// acc.balance = -500;   // compile error: balance has private access`, lang: "java" },
        { table: { head: ["Data hiding", "Encapsulation"], rows: [
          ["Concerned with <b>security / access</b> of data", "Concerned with <b>bundling</b> data and behaviour"],
          ["Achieved with <code>private</code>", "Achieved with classes (+ access modifiers)"],
          ["A part / outcome of encapsulation", "The broader concept"]
        ] } },
        { warn: "Blindly adding a public getter and setter for every private field (what IDEs and Lombok generate) gives you encapsulation on paper but no real data hiding — the setter must validate, or the field should not be settable at all." }
      ]
    },
    {
      id: "abstract-class-vs-interface",
      q: "What is the difference between an abstract class and an interface?",
      topic: "Encapsulation & Abstraction",
      level: 1,
      top: true,
      short: "An abstract class can have state (fields), constructors and both abstract and concrete methods; a class can extend only one. An interface defines a contract: no instance state, methods are public abstract by default (plus default/static methods since Java 8, private since Java 9), and a class can implement many.",
      a: [
        { p: "Both define a contract that cannot be instantiated directly. An <b>abstract class</b> is a partially implemented base (a common 'is-a' parent). An <b>interface</b> is a pure capability contract ('can-do': <code>Comparable</code>, <code>Runnable</code>)." },
        { table: { head: ["Feature", "Abstract class", "Interface (Java 8+)"], rows: [
          ["Keyword", "<code>abstract class</code>, <code>extends</code>", "<code>interface</code>, <code>implements</code>"],
          ["Multiple inheritance", "A class extends only one", "A class implements many; an interface extends many"],
          ["Instance fields", "Yes, any", "No — only <code>public static final</code> constants"],
          ["Constructors", "Yes (called via <code>super</code>)", "No"],
          ["Methods", "Abstract + concrete", "Abstract; <code>default</code> and <code>static</code> (Java 8), <code>private</code> (Java 9)"],
          ["Member access", "Any modifier", "Methods implicitly <code>public</code>"],
          ["Speed", "Slightly faster dispatch (<code>invokevirtual</code>)", "<code>invokeinterface</code>; negligible after JIT"],
          ["Use when", "Related classes share code/state", "Unrelated classes share a capability"]
        ] } },
        { code: `interface Drawable {
    void draw();                                  // public abstract
    default void drawTwice() { draw(); draw(); }  // Java 8: default method
}

abstract class Shape {
    protected final String name;                  // state
    Shape(String name) { this.name = name; }      // constructor
    abstract double area();                       // abstract
    void describe() { System.out.println(name + " area=" + area()); }   // concrete
}

class Square extends Shape implements Drawable {  // one base + any number of interfaces
    private final double s;
    Square(double s) { super("Square"); this.s = s; }
    @Override double area() { return s * s; }
    @Override public void draw() { System.out.println("[]"); }
}`, lang: "java", title: "Abstract class + interface together" },
        { tip: "Can an abstract class have a constructor? <b>Yes</b> — it runs via <code>super()</code> when a subclass object is created, to initialise the base part. Can it have no abstract methods? Yes (just marked <code>abstract</code> to prevent instantiation). Follow-up: 'With default methods, why still use abstract classes?' — fields, constructors and non-public members." }
      ]
    },
    {
      id: "abstract-class-rules",
      q: "What is an abstract method? Can an abstract class have constructors, static methods, final methods or no abstract methods at all?",
      topic: "Encapsulation & Abstraction",
      level: 2,
      top: true,
      short: "An abstract method is declared with abstract and no body; its class must be abstract, and the first concrete subclass must implement it. An abstract class can have constructors, fields, static, final and concrete methods, and may even have zero abstract methods. It cannot be instantiated, and abstract cannot be combined with final, private or static.",
      a: [
        { p: "Declaring a method <code>abstract</code> says: 'every concrete subclass must provide this'. Any class with at least one abstract method (declared or inherited and not implemented) must itself be declared <code>abstract</code>, and <code>new</code> on it is a compile error — but references of that type are fine, which is the basis of run-time polymorphism." },
        { code: `abstract class Vehicle {
    protected final String name;
    Vehicle(String name) { this.name = name; }         // constructor: runs via super()

    abstract double maxSpeed();                        // abstract: no body

    void describe() { System.out.println(name + " " + maxSpeed()); }   // concrete
    final void honk() { System.out.println("beep"); }                  // final: fixed for all
    static Vehicle of(String kind) {                                   // static factory
        return kind.equals("car") ? new Car() : new Bike();
    }
}
class Car  extends Vehicle { Car()  { super("Car");  } double maxSpeed() { return 180; } }
class Bike extends Vehicle { Bike() { super("Bike"); } double maxSpeed() { return 120; } }

public class Main {
    public static void main(String[] args) {
        // Vehicle v = new Vehicle("x");      // error: Vehicle is abstract
        Vehicle v = Vehicle.of("car");        // reference of abstract type is fine
        v.describe();                         // Car 180.0
    }
}`, lang: "java" },
        { table: { head: ["Combination", "Allowed?", "Why"], rows: [
          ["<code>abstract</code> + <code>final</code> method/class", "No", "final forbids overriding/extending; abstract requires it"],
          ["<code>abstract</code> + <code>private</code> method", "No", "private methods are invisible to subclasses"],
          ["<code>abstract</code> + <code>static</code> method", "No", "static methods are not overridden"],
          ["Abstract method in a non-abstract class", "No", "The class must be marked abstract"],
          ["Abstract class with no abstract methods", "Yes", "Just prevents instantiation (e.g. <code>HttpServlet</code>)"],
          ["Abstract class with constructor / static methods / fields", "Yes", "Initialises the base part; subclasses call <code>super(...)</code>"],
          ["Abstract constructor", "No", "Constructors are never inherited or overridden"]
        ] } },
        { warn: "Calling an abstract (or any overridable) method from the abstract class's constructor runs the subclass version <i>before</i> the subclass's fields are initialised — they still hold <code>0</code>/<code>null</code>. Avoid it." }
      ]
    },
    {
      id: "immutable-class",
      q: "How do you create an immutable class in Java? Why is immutability useful?",
      topic: "Encapsulation & Abstraction",
      level: 2,
      top: true,
      short: "Make the class final (or all constructors private), make every field private and final, set them only in the constructor, provide no setters, and defensively copy any mutable field on the way in and out. Immutable objects are thread-safe, safe as HashMap keys, freely shareable and easy to reason about.",
      a: [
        { p: "An <b>immutable</b> object's observable state never changes after construction. <code>String</code>, the wrapper classes, <code>BigDecimal</code> and <code>java.time</code> types are all immutable — 'modifying' methods return a new object." },
        { code: `import java.util.*;

public final class Student {                          // 1. final: no subclass can add mutators
    private final String name;                        // 2. private final fields
    private final List<String> courses;

    public Student(String name, List<String> courses) {
        this.name = name;
        this.courses = new ArrayList<>(courses);      // 3. defensive copy IN
    }
    public String getName() { return name; }          // 4. getters only, no setters
    public List<String> getCourses() {
        return Collections.unmodifiableList(courses); // 5. defensive copy / view OUT
    }
    public Student withName(String newName) {         // 'modification' = new object
        return new Student(newName, courses);
    }
}`, lang: "java" },
        { ol: [
          "Declare the class <code>final</code> so a subclass cannot add mutable state or override getters.",
          "Make all fields <code>private final</code>; initialise them in the constructor only.",
          "No setters or any method that changes state.",
          "Deep/defensive copy mutable arguments in the constructor (the caller may still hold the original list).",
          "Never return a mutable field directly — return a copy or an unmodifiable view.",
          "Optionally cache <code>hashCode</code>, since it can never change."
        ] },
        { table: { head: ["Benefit", "Why"], rows: [
          ["Thread safety", "No writes after construction → no synchronisation needed"],
          ["Safe hash keys", "<code>hashCode</code> can't change while the object sits in a <code>HashMap</code>"],
          ["Free sharing / caching", "Any number of references can share one instance (String pool)"],
          ["Simplicity", "No temporal coupling — an object is valid from birth to death"]
        ] } },
        { tip: "A <code>record</code> (Java 16) gives you final class, private final fields, constructor and accessors in one line — but it is only <i>shallowly</i> immutable: you still need defensive copies for mutable components. Also mention: <code>final</code> on a reference does not make the referenced object immutable." }
      ]
    },

    /* ───────────── Inheritance ───────────── */
    {
      id: "inheritance-types",
      q: "What is inheritance? Explain the types of inheritance.",
      topic: "Inheritance",
      level: 1,
      top: true,
      short: "Inheritance lets a subclass acquire the members of a superclass, modelling an is-a relationship and enabling reuse and polymorphism. Types: single, multilevel, hierarchical, multiple and hybrid. Java supports the first three with classes; multiple and hybrid only through interfaces.",
      a: [
        { p: "<b>Inheritance</b> is the mechanism by which a new class (subclass / child / derived) is created from an existing class (superclass / parent / base) using <code>extends</code>, reusing its fields and methods and optionally adding to or overriding them. Every Java class ultimately extends <code>Object</code>." },
        { svg: `<svg viewBox="0 0 720 210" width="720" class="dg">
  <rect class="box-a" x="50" y="36" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="72" y="50" text-anchor="middle" dominant-baseline="middle">A</text>
  <rect class="box" x="50" y="116" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="72" y="130" text-anchor="middle" dominant-baseline="middle">B</text>
  <line class="ln" x1="72" y1="116" x2="72" y2="66" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="194" y="31" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="216" y="45" text-anchor="middle" dominant-baseline="middle">A</text>
  <rect class="box" x="194" y="86" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="216" y="100" text-anchor="middle" dominant-baseline="middle">B</text>
  <rect class="box" x="194" y="141" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="216" y="155" text-anchor="middle" dominant-baseline="middle">C</text>
  <line class="ln" x1="216" y1="86" x2="216" y2="61" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="216" y1="141" x2="216" y2="116" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="303" y="36" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="325" y="50" text-anchor="middle" dominant-baseline="middle">A</text>
  <rect class="box-a" x="373" y="36" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="395" y="50" text-anchor="middle" dominant-baseline="middle">B</text>
  <rect class="box" x="338" y="116" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="360" y="130" text-anchor="middle" dominant-baseline="middle">C</text>
  <line class="ln" x1="350" y1="116" x2="327" y2="66" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="370" y1="116" x2="393" y2="66" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="482" y="36" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="504" y="50" text-anchor="middle" dominant-baseline="middle">A</text>
  <rect class="box" x="447" y="116" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="469" y="130" text-anchor="middle" dominant-baseline="middle">B</text>
  <rect class="box" x="517" y="116" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="539" y="130" text-anchor="middle" dominant-baseline="middle">C</text>
  <line class="ln" x1="469" y1="116" x2="494" y2="66" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="539" y1="116" x2="514" y2="66" marker-end="url(#dg-arr)"/>
  <rect class="box-a" x="626" y="26" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="648" y="40" text-anchor="middle" dominant-baseline="middle">A</text>
  <rect class="box" x="591" y="86" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="613" y="100" text-anchor="middle" dominant-baseline="middle">B</text>
  <rect class="box" x="661" y="86" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="683" y="100" text-anchor="middle" dominant-baseline="middle">C</text>
  <rect class="box-p" x="626" y="146" width="44" height="28" rx="6"/>
  <text class="tx tx-b" x="648" y="160" text-anchor="middle" dominant-baseline="middle">D</text>
  <line class="ln" x1="613" y1="86" x2="638" y2="56" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="683" y1="86" x2="658" y2="56" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="638" y1="146" x2="615" y2="116" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="658" y1="146" x2="681" y2="116" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="72" y="198" text-anchor="middle">Single</text>
  <text class="tx tx-b" x="216" y="198" text-anchor="middle">Multilevel</text>
  <text class="tx tx-b" x="360" y="198" text-anchor="middle">Multiple</text>
  <text class="tx tx-b" x="504" y="198" text-anchor="middle">Hierarchical</text>
  <text class="tx tx-b" x="648" y="198" text-anchor="middle">Hybrid</text>
</svg>`, caption: "Arrows point from subclass to superclass (UML generalisation)." },
        { table: { head: ["Type", "Shape", "Java classes", "Java interfaces"], rows: [
          ["Single", "B extends A", "Yes", "Yes"],
          ["Multilevel", "C → B → A (chain)", "Yes", "Yes"],
          ["Hierarchical", "B and C both extend A", "Yes", "Yes"],
          ["Multiple", "C extends A and B", "<b>No</b>", "Yes — <code>implements A, B</code>"],
          ["Hybrid", "Combination, e.g. diamond", "<b>No</b>", "Yes — via interfaces"]
        ] } },
        { code: `class A { }
class B extends A { }              // single
class C extends B { }              // multilevel  (C -> B -> A)
class H1 extends A { }             // hierarchical: H1 and H2 share parent A
class H2 extends A { }

interface X { }
interface Y extends X { }          // interfaces can extend interfaces
class M implements X, Y { }        // "multiple" only through interfaces
// class Bad extends A, H1 { }     // error: a class extends exactly one class`, lang: "java" },
        { ul: [
          "What is <b>not</b> inherited: constructors, <code>private</code> members (they exist in the object but are inaccessible), and static members are shared rather than inherited.",
          "A <code>final</code> class (<code>String</code>, <code>Integer</code>) cannot be extended; a <code>sealed</code> class (Java 17) lists exactly which classes may extend it."
        ] },
        { tip: "Advantages: code reuse, extensibility, enables runtime polymorphism. Disadvantages: tight coupling to the parent (fragile base class problem), deep hierarchies are hard to follow — mention 'favour composition over inheritance'." }
      ]
    },
    {
      id: "diamond-problem",
      q: "What is the diamond problem? How does Java deal with it?",
      topic: "Inheritance",
      level: 2,
      top: true,
      short: "In the diamond problem, D inherits from B and C which both inherit from A, so D would contain two copies of A's state and any call to an A method is ambiguous. Java sidesteps it for classes by allowing only single inheritance. Interfaces carry no state, so the only conflict is two default methods with the same signature — and then the class must override and pick one with X.super.m().",
      a: [
        { p: "When a type inherits from two types that share a common ancestor, the most-derived type could end up with <b>two copies of the ancestor's fields</b> and an ambiguous answer to 'which inherited <code>m()</code> do I call?'. C++ allows this and needs <i>virtual inheritance</i> to fix it; Java's designers avoided it outright." },
        { svg: `<svg viewBox="0 0 640 220" width="640" class="dg">
  <rect class="box-r" x="60" y="15" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="105" y="30" text-anchor="middle" dominant-baseline="middle">A (copy 1)</text>
  <rect class="box-r" x="190" y="15" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="235" y="30" text-anchor="middle" dominant-baseline="middle">A (copy 2)</text>
  <rect class="box" x="60" y="85" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="105" y="100" text-anchor="middle" dominant-baseline="middle">B</text>
  <rect class="box" x="190" y="85" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="235" y="100" text-anchor="middle" dominant-baseline="middle">C</text>
  <rect class="box-p" x="125" y="155" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="170" y="170" text-anchor="middle" dominant-baseline="middle">D</text>
  <line class="ln" x1="105" y1="85" x2="105" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="235" y1="85" x2="235" y2="47" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="150" y1="155" x2="117" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="190" y1="155" x2="223" y2="117" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="445" y="15" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="490" y="30" text-anchor="middle" dominant-baseline="middle">A (interface)</text>
  <rect class="box" x="365" y="85" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="410" y="100" text-anchor="middle" dominant-baseline="middle">B</text>
  <rect class="box" x="525" y="85" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="570" y="100" text-anchor="middle" dominant-baseline="middle">C</text>
  <rect class="box-p" x="445" y="155" width="90" height="30" rx="6"/>
  <text class="tx tx-b" x="490" y="170" text-anchor="middle" dominant-baseline="middle">D</text>
  <line class="ln-a" x1="420" y1="85" x2="473" y2="47" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="560" y1="85" x2="507" y2="47" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="475" y1="155" x2="425" y2="117" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="505" y1="155" x2="555" y2="117" marker-end="url(#dg-arr)"/>
  <text class="tx-a" x="420" y="60" text-anchor="middle">extends</text>
  <text class="tx-a" x="562" y="60" text-anchor="middle">extends</text>
  <text class="tx tx-b" x="170" y="208" text-anchor="middle">Class diamond: D would hold 2 A's (illegal in Java)</text>
  <text class="tx tx-b" x="490" y="208" text-anchor="middle">Interface diamond: no state, only method conflicts</text>
</svg>`, caption: "Java forbids the class diamond (single inheritance) and resolves the interface diamond by rules." },
        { code: `interface A { default String hello() { return "A"; } }
interface B extends A { default String hello() { return "B"; } }   // more specific
interface C extends A { }                                          // inherits A's

class D1 implements B, C { }          // OK: B.hello() wins (most specific)

interface Flyer   { default String move() { return "fly"; } }
interface Swimmer { default String move() { return "swim"; } }

class Duck implements Flyer, Swimmer {
    @Override
    public String move() {            // REQUIRED: otherwise compile error
        return Flyer.super.move() + " and " + Swimmer.super.move();
    }
}`, lang: "java", title: "Resolving a default-method diamond" },
        { ol: [
          "A method from a <b>class</b> (superclass) always wins over any interface default.",
          "The <b>more specific</b> sub-interface's default wins (B over A above).",
          "Otherwise (two unrelated defaults) the class <b>must override</b> and may delegate with <code>X.super.m()</code>."
        ] },
        { tip: "Abstract methods clash harmlessly: if two interfaces declare the same abstract <code>m()</code>, the class implements it once. The conflict only exists when at least one side provides a body." }
      ]
    },
    {
      id: "java-no-multiple-inheritance",
      q: "Why doesn't Java support multiple inheritance of classes? How does it achieve it otherwise?",
      topic: "Inheritance",
      level: 2,
      top: true,
      short: "To avoid the diamond problem's ambiguity and complexity (duplicate state, which constructor/method to use), Java allows a class to extend only one class. It gets multiple inheritance of type (and, since Java 8, of behaviour via default methods) through interfaces, and a conflicting default method must be overridden explicitly.",
      a: [
        { p: "Java's designers dropped multiple class inheritance to keep the language simple: with two parent classes, fields could be duplicated, constructor chaining (<code>super()</code> — which super?) becomes ambiguous and method resolution needs complex rules." },
        { ul: [
          "<b>Multiple inheritance of state</b> (fields from several classes) — <b>not allowed</b>.",
          "<b>Multiple inheritance of type</b> — allowed: a class can <code>implement</code> many interfaces and be used as any of them.",
          "<b>Multiple inheritance of behaviour</b> — partly allowed since Java 8 via <code>default</code> methods, with explicit conflict resolution."
        ] },
        { code: `interface Flyer   { default String move() { return "fly"; } }
interface Swimmer { default String move() { return "swim"; } }

class Duck implements Flyer, Swimmer {
    // Compile error unless we override the conflicting default method:
    @Override
    public String move() {
        return Flyer.super.move() + " and " + Swimmer.super.move();
    }
}

// Reuse *implementation* from two classes? Compose them:
class Amphibian {
    private final Car car = new Car();        // HAS-A both, delegates to each
    private final Boat boat = new Boat();
    void drive() { car.drive(); }
    void sail()  { boat.sail(); }
}
class Car  { void drive() {} }
class Boat { void sail()  {} }`, lang: "java", title: "Interfaces for type, composition for implementation" },
        { p: "Resolution rules for defaults: (1) a method from a class always wins over an interface default; (2) the more specific sub-interface wins; (3) otherwise the class must override." },
        { tip: "If asked 'so how do I reuse code from two classes?' — composition and delegation (has-a), or move the shared code into a default method / static helper. Mention that interfaces having no fields is exactly what makes the interface diamond safe." }
      ]
    },
    {
      id: "association-aggregation-composition",
      q: "Explain association, aggregation and composition with examples.",
      topic: "Inheritance",
      level: 2,
      top: true,
      short: "Association is any 'uses/knows' relationship between independent objects. Aggregation is a weak has-a: the whole holds parts that can exist independently (Department and Professor). Composition is a strong has-a: the whole creates and owns the parts and they die with it (House and Room).",
      a: [
        { p: "All three are <b>HAS-A / uses</b> relationships (as opposed to IS-A inheritance), differing in <b>ownership</b> and <b>lifetime</b>. In Java every field is a reference, so the difference is about <i>who creates the part and whether anyone else holds it</i>." },
        { svg: `<svg viewBox="0 0 640 210" width="640" class="dg">
  <rect class="box" x="20" y="20" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="80" y="36" text-anchor="middle" dominant-baseline="middle">Teacher</text>
  <line class="ln" x1="140" y1="36" x2="330" y2="36" marker-end="url(#dg-arr)"/>
  <rect class="box" x="330" y="20" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="390" y="36" text-anchor="middle" dominant-baseline="middle">Student</text>
  <text class="tx tx-b" x="470" y="30">Association</text>
  <text class="tx-m" x="470" y="46">uses; independent lifetimes</text>
  <rect class="box" x="20" y="90" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="80" y="106" text-anchor="middle" dominant-baseline="middle">Department</text>
  <polygon class="box" points="140,106 156,98 172,106 156,114"/>
  <line class="ln" x1="172" y1="106" x2="330" y2="106"/>
  <rect class="box" x="330" y="90" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="390" y="106" text-anchor="middle" dominant-baseline="middle">Professor</text>
  <text class="tx tx-b" x="470" y="100">Aggregation</text>
  <text class="tx-m" x="470" y="116">weak has-a; part outlives whole</text>
  <rect class="box" x="20" y="160" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="80" y="176" text-anchor="middle" dominant-baseline="middle">House</text>
  <polygon class="box-a" points="140,176 156,168 172,176 156,184"/>
  <line class="ln-a" x1="172" y1="176" x2="330" y2="176"/>
  <rect class="box-a" x="330" y="160" width="120" height="32" rx="6"/>
  <text class="tx tx-b" x="390" y="176" text-anchor="middle" dominant-baseline="middle">Room</text>
  <text class="tx tx-b" x="470" y="170">Composition</text>
  <text class="tx-m" x="470" y="186">strong has-a; part dies with whole</text>
</svg>`, caption: "UML: plain line = association, hollow diamond = aggregation, filled diamond = composition (diamond sits on the 'whole')." },
        { table: { head: ["", "Association", "Aggregation", "Composition"], rows: [
          ["Relationship", "Uses / knows", "Has-a (weak)", "Part-of / owns (strong)"],
          ["Ownership", "None", "Shared / non-owning", "Exclusive"],
          ["Lifetime", "Independent", "Part can outlive whole", "Part unreachable once whole is gone"],
          ["Java typical code", "Passed as parameter / local variable", "Field referencing an object created elsewhere", "Field created inside the class (<code>new</code> in constructor), never leaked"],
          ["Example", "Doctor – Patient", "Team – Player", "Car – Engine, Human – Heart"]
        ] } },
        { code: `import java.util.*;

class Professor { }
class Room { }

class Department {                                   // AGGREGATION
    private final List<Professor> staff = new ArrayList<>();
    void add(Professor p) { staff.add(p); }          // professors are created elsewhere and
}                                                    // may belong to other departments too

class House {                                        // COMPOSITION
    private final List<Room> rooms = new ArrayList<>();
    House(int n) {
        for (int i = 0; i < n; i++) rooms.add(new Room());   // rooms created with the house
    }                                                        // and never handed out, so they
}                                                            // become garbage with it`, lang: "java" },
        { tip: "Composition and aggregation are both special cases of association. Interviewers often ask for the UML symbols — remember the diamond goes on the <b>container</b> side." }
      ]
    },
    {
      id: "super-keyword",
      q: "What is the super keyword? What happens if the parent has no no-arg constructor?",
      topic: "Inheritance",
      level: 1,
      top: true,
      short: "super refers to the immediate parent class: super(...) calls the parent constructor (must be the first statement; inserted implicitly as super() if omitted), super.method() calls the parent's version of an overridden method, and super.field accesses a hidden parent field. If the parent lacks a no-arg constructor, every child constructor must call super(args) explicitly or compilation fails.",
      a: [
        { ul: [
          "<code>super(args)</code> — invoke the parent constructor. Must be the <b>first statement</b>; if absent the compiler inserts <code>super()</code>.",
          "<code>super.method()</code> — call the overridden parent implementation (extend, not replace).",
          "<code>super.field</code> — access a parent field hidden by a same-named child field.",
          "<code>this()</code> and <code>super()</code> cannot both appear in one constructor (both must be first).",
          "Not usable in a static context; <code>super.super.m()</code> does not exist."
        ] },
        { code: `class Employee {
    protected String name;
    Employee(String name) { this.name = name; }    // no no-arg constructor!
    double salary() { return 50000; }
}

class Manager extends Employee {
    Manager(String name) {
        super(name);                        // REQUIRED: implicit super() would not compile
    }
    @Override
    double salary() {
        return super.salary() + 20000;      // reuse parent logic
    }
}

// class Intern extends Employee { Intern() { } }
// error: constructor Employee in class Employee cannot be applied to given types`, lang: "java" },
        { tip: "Why does a child constructor always call a parent constructor? So the inherited part of the object is fully initialised before the child's body runs — this is why the chain runs all the way up to <code>Object()</code>." }
      ]
    },
    {
      id: "composition-over-inheritance",
      q: "What does 'favour composition over inheritance' mean? When should you still use inheritance?",
      topic: "Inheritance",
      level: 3,
      top: false,
      short: "Build behaviour by holding objects (has-a) and delegating to them rather than by subclassing, because composition is looser coupling, can change at run time and avoids fragile base classes and class explosion. Use inheritance only for a genuine is-a relationship that satisfies Liskov substitution, typically to implement an interface.",
      a: [
        { p: "Inheritance is <b>white-box</b> reuse: the subclass depends on parent internals, is fixed at compile time, and a change in the parent can silently break subclasses (<b>fragile base class problem</b>). Composition is <b>black-box</b> reuse through a member's public interface." },
        { code: `// Inheritance explosion: FlyingDuck, SwimmingDuck, FlyingSwimmingDuck ...
// Composition: plug in behaviours instead
interface FlyBehaviour { void fly(); }
class CanFly implements FlyBehaviour { public void fly() { System.out.println("flap"); } }
class NoFly  implements FlyBehaviour { public void fly() { System.out.println("can't"); } }

class Duck {
    private FlyBehaviour flyer;                          // HAS-A
    Duck(FlyBehaviour f) { this.flyer = f; }
    void setFly(FlyBehaviour f) { this.flyer = f; }      // runtime change
    void performFly() { flyer.fly(); }                   // delegation
}

// Duck mallard = new Duck(new CanFly());
// Duck rubber  = new Duck(new NoFly());`, lang: "java" },
        { table: { head: ["", "Inheritance", "Composition"], rows: [
          ["Coupling", "Tight", "Loose"],
          ["Change behaviour at run time", "No", "Yes"],
          ["Combining N features", "Up to 2<sup>N</sup> subclasses", "N small components"],
          ["Exposes", "Whole parent interface", "Only what you delegate"]
        ] } },
        { tip: "Still use inheritance when (1) there is a true is-a that passes LSP, (2) you need polymorphism through a common interface, or (3) a framework requires it. Classic bad example: <code>Stack extends Vector</code> exposes <code>add(index, e)</code>; <code>Properties extends Hashtable</code> lets you put non-String keys." }
      ]
    },

    /* ───────────── Polymorphism ───────────── */
    {
      id: "compile-vs-runtime-polymorphism",
      q: "What is polymorphism? Compare compile-time and run-time polymorphism.",
      topic: "Polymorphism",
      level: 1,
      top: true,
      short: "Polymorphism means one interface, many forms. Compile-time (static) polymorphism is resolved by javac: method overloading. Run-time (dynamic) polymorphism is resolved by the JVM during execution through method overriding, when a method is called via a superclass or interface reference.",
      a: [
        { p: "<b>Polymorphism</b> ('many forms') lets the same name or call behave differently depending on the argument types or the actual object type." },
        { table: { head: ["", "Compile-time (static)", "Run-time (dynamic)"], rows: [
          ["Resolved by", "<code>javac</code>", "JVM (<code>invokevirtual</code> / <code>invokeinterface</code>)"],
          ["Mechanism", "Method overloading (also generics)", "Method overriding, called through a superclass/interface reference"],
          ["Binding", "Early / static binding", "Late / dynamic binding"],
          ["Inheritance needed", "No", "Yes (or an interface)"],
          ["Decided by", "Static types of the arguments", "Actual class of the object"],
          ["Flexibility", "Less — fixed at build time", "More — new subclasses plug in without recompiling callers"]
        ] } },
        { code: `class MathUtil {                                   // Compile-time: overloading
    static int    add(int a, int b)       { return a + b; }
    static double add(double a, double b) { return a + b; }
}

class Animal { void sound() { System.out.println("..."); } }   // Run-time: overriding
class Cat extends Animal { @Override void sound() { System.out.println("Meow"); } }
class Dog extends Animal { @Override void sound() { System.out.println("Woof"); } }

public class Main {
    public static void main(String[] args) {
        MathUtil.add(1, 2);  MathUtil.add(1.5, 2.5);      // chosen by javac
        Animal[] zoo = { new Cat(), new Dog() };
        for (Animal a : zoo) a.sound();                    // Meow, Woof: chosen at run time
    }
}`, lang: "java" },
        { tip: "In Java every non-static, non-final, non-private instance method is 'virtual' by default — no keyword needed. Static, private and final methods (and fields) are always bound at compile time." }
      ]
    },
    {
      id: "overloading-vs-overriding",
      q: "What is the difference between method overloading and method overriding?",
      topic: "Polymorphism",
      level: 1,
      top: true,
      short: "Overloading is several methods with the same name but different parameter lists in the same class, resolved at compile time. Overriding is a subclass providing a new implementation of an inherited method with the same signature, resolved at run time.",
      a: [
        { table: { head: ["", "Overloading", "Overriding"], rows: [
          ["Where", "Same class (or inherited into subclass)", "Superclass and subclass"],
          ["Signature", "Same name, <b>different</b> parameter list", "Same name <b>and</b> parameters (return type same or covariant)"],
          ["Return type alone differs", "Not allowed (not part of the signature)", "—"],
          ["Binding", "Compile time", "Run time"],
          ["Inheritance needed", "No", "Yes"],
          ["Access modifier", "Any", "Same or wider"],
          ["<code>static</code> / <code>private</code> / <code>final</code> methods", "Can be overloaded", "Cannot be overridden"],
          ["Annotation", "None", "<code>@Override</code> (optional but recommended)"],
          ["Purpose", "Convenience: same operation on different inputs", "Specialise inherited behaviour"]
        ] } },
        { code: `class Printer {
    void print(int x)    { System.out.println("int " + x); }    // overloads
    void print(String s) { System.out.println("str " + s); }
    void hello()         { System.out.println("Printer"); }
}
class LaserPrinter extends Printer {
    @Override
    void hello()         { System.out.println("Laser"); }       // overrides
}

public class Main {
    public static void main(String[] args) {
        Printer p = new LaserPrinter();
        p.print(5); p.print("hi");   // overloading resolved at compile time
        p.hello();                   // "Laser": overriding resolved at run time
    }
}`, lang: "java" },
        { tip: "Always write <code>@Override</code>: if the signature doesn't actually match a parent method (typo, wrong parameter type), the compiler errors instead of silently creating a new overload." },
        { warn: "Can we overload <code>main</code>? Yes, but the JVM only calls <code>public static void main(String[])</code>. Can we override a static method? No — it gets <i>hidden</i>. Can we overload by changing only the return type? No." }
      ]
    },
    {
      id: "overload-resolution-rules",
      q: "How does Java choose between overloaded methods? (widening vs boxing vs varargs, null arguments)",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "javac resolves overloads in three phases: first exact match or primitive widening / reference subtyping without boxing or varargs; then allowing boxing/unboxing; finally varargs. Within a phase the most specific method wins; if none is most specific it is a compile-time ambiguity error. Resolution uses the static (declared) type of the argument, never the runtime type.",
      a: [
        { table: { head: ["Phase", "Allowed conversions", "Example"], rows: [
          ["1", "Identity, primitive widening (<code>byte→short→int→long→float→double</code>, <code>char→int</code>), reference widening (subclass → superclass)", "<code>f(int)</code> chosen for a <code>byte</code> argument"],
          ["2", "Phase 1 + boxing / unboxing", "<code>f(Integer)</code> for an <code>int</code> when no <code>f(int)</code>/<code>f(long)</code> exists"],
          ["3", "Phase 2 + varargs", "<code>f(int...)</code> only if nothing else matches"]
        ] } },
        { code: `public class Main {
    static void f(int x)     { System.out.println("int"); }
    static void f(long x)    { System.out.println("long"); }
    static void f(Integer x) { System.out.println("Integer"); }
    static void f(Object x)  { System.out.println("Object"); }
    static void f(int... x)  { System.out.println("varargs"); }

    static void g(String s)  { System.out.println("String"); }
    static void g(Object o)  { System.out.println("Object"); }
    // static void g(StringBuilder sb) {}   // adding this makes g(null) ambiguous

    public static void main(String[] args) {
        byte b = 1;
        f(b);                    // int      (widening beats boxing)
        f(5L);                   // long     (exact)
        f('a');                  // int      (char widens to int)
        f(Integer.valueOf(5));   // Integer  (exact)
        f(3.5);                  // Object   (double boxes to Double, which is an Object)
        f();                     // varargs  (only candidate)
        g(null);                 // String   (most specific of String/Object)

        Object o = "hello";
        g(o);                    // Object   (static type decides, not runtime type)
    }
}`, lang: "java" },
        { ul: [
          "'Most specific' = its parameter types can be passed to the other candidate, not vice versa (<code>String</code> is more specific than <code>Object</code>).",
          "Return type, parameter names and <code>throws</code> clauses play no part in overload resolution.",
          "Overloads are chosen using the <b>declared type</b> of the argument expression — overloading is <i>not</i> dynamic dispatch."
        ] },
        { warn: "Trick question: <code>f(null)</code> with overloads <code>f(String)</code> and <code>f(Integer)</code> is a compile error (neither is more specific). Also, <code>list.remove(1)</code> on a <code>List&lt;Integer&gt;</code> calls <code>remove(int index)</code>, not <code>remove(Object)</code> — phase 1 wins over boxing." }
      ]
    },
    {
      id: "operator-overloading",
      q: "Does Java support operator overloading? Why not?",
      topic: "Polymorphism",
      level: 1,
      top: true,
      short: "No. Java has no user-defined operator overloading; the only overloaded operator is + for String concatenation (built into the language). The designers left it out for simplicity and readability: a + b should always mean numeric addition. Instead you write named methods such as add(), plus(), compareTo() and equals().",
      a: [
        { p: "In languages like C++ and Kotlin you can define what <code>a + b</code> means for your own types. Java deliberately does not allow this — operators have fixed meanings for primitives and <code>String</code>, and nothing else." },
        { code: `final class Complex {
    private final double re, im;
    Complex(double re, double im) { this.re = re; this.im = im; }

    Complex plus(Complex o) {                          // instead of operator+
        return new Complex(re + o.re, im + o.im);
    }
    @Override public boolean equals(Object o) {        // instead of operator==
        return o instanceof Complex c && c.re == re && c.im == im;
    }
    @Override public int hashCode() { return Double.hashCode(re) * 31 + Double.hashCode(im); }
    @Override public String toString() { return re + " + " + im + "i"; }
}

public class Main {
    public static void main(String[] args) {
        Complex c = new Complex(1, 2).plus(new Complex(3, 4));
        System.out.println(c);                 // 4.0 + 6.0i
        String s = "a" + 1 + 'b' + 2.0;        // the ONE built-in overload: + on String
        System.out.println(s);                 // a1b2.0
        // Complex d = c + c;                  // compile error: bad operand types
    }
}`, lang: "java" },
        { table: { head: ["Instead of", "Java uses"], rows: [
          ["<code>a + b</code>", "<code>a.add(b)</code> — <code>BigInteger.add</code>, <code>BigDecimal.multiply</code>"],
          ["<code>a == b</code> (value)", "<code>a.equals(b)</code>"],
          ["<code>a &lt; b</code>", "<code>a.compareTo(b) &lt; 0</code> (<code>Comparable</code>)"],
          ["<code>a[i]</code>", "<code>list.get(i)</code>, <code>map.get(k)</code>"],
          ["<code>cout &lt;&lt; a</code>", "<code>a.toString()</code>"]
        ] } },
        { ul: [
          "<b>Reasons</b>: keeps the language small, avoids surprising meanings (<code>&lt;&lt;</code> for streams), makes code behave predictably for readers and tools.",
          "<code>+=</code>, <code>++</code> and comparisons work on wrapper types only through <b>autoboxing</b>, not overloading.",
          "Note the built-in <code>+</code> compiles to <code>StringBuilder.append</code> calls (or <code>invokedynamic</code> since Java 9)."
        ] },
        { tip: "Follow-up: 'Is <code>+</code> on String an example of operator overloading?' — yes, but it is done by the compiler; you cannot extend it. Kotlin and Scala (both JVM languages) do allow user-defined operators." }
      ]
    },
    {
      id: "virtual-functions",
      q: "Are methods in Java virtual by default? Which methods are not, and why?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Yes: every non-static, non-private, non-final instance method is virtual — a call through a superclass or interface reference runs the most-derived override, decided at run time. Static methods (class-level), private methods (not inherited) and final methods (not overridable) are bound at compile time, as are constructors and fields.",
      a: [
        { p: "A <b>virtual method</b> is one whose call is resolved by the <b>actual (dynamic) type</b> of the object, not the declared type of the reference. Java makes this the default so that code written against a superclass or interface works with any future subclass — there is no <code>virtual</code> keyword." },
        { svg: `<svg viewBox="0 0 560 185" width="560" class="dg">
  <rect class="box-a" x="200" y="10" width="160" height="56" rx="6"/>
  <text class="tx tx-b" x="280" y="28" text-anchor="middle" dominant-baseline="middle">Shape (abstract)</text>
  <text class="tx-c" x="280" y="50" text-anchor="middle" dominant-baseline="middle">abstract area()</text>
  <rect class="box" x="20" y="120" width="150" height="52" rx="6"/>
  <text class="tx tx-b" x="95" y="138" text-anchor="middle" dominant-baseline="middle">Circle</text>
  <text class="tx-c" x="95" y="158" text-anchor="middle" dominant-baseline="middle">area(): pi*r*r</text>
  <rect class="box" x="205" y="120" width="150" height="52" rx="6"/>
  <text class="tx tx-b" x="280" y="138" text-anchor="middle" dominant-baseline="middle">Rectangle</text>
  <text class="tx-c" x="280" y="158" text-anchor="middle" dominant-baseline="middle">area(): w*h</text>
  <rect class="box" x="390" y="120" width="150" height="52" rx="6"/>
  <text class="tx tx-b" x="465" y="138" text-anchor="middle" dominant-baseline="middle">Triangle</text>
  <text class="tx-c" x="465" y="158" text-anchor="middle" dominant-baseline="middle">area(): b*h/2</text>
  <line class="ln" x1="95" y1="120" x2="228" y2="68" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="120" x2="280" y2="68" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="465" y1="120" x2="332" y2="68" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="480" y="40" text-anchor="middle">Shape s = new Circle();</text>
  <text class="tx-m" x="480" y="56" text-anchor="middle">s.area() runs Circle's</text>
</svg>`, caption: "Client code holds a Shape reference and calls area(); the override of the actual object runs." },
        { code: `abstract class Shape {
    abstract double area();                              // overridden: virtual
    void info()  { System.out.println("Shape"); }        // also virtual (all instance methods are)
    final void id() { System.out.println("shape#1"); }   // final: not overridable, bound statically
    static void kind() { System.out.println("static Shape"); }   // static: no dispatch
    private void secret() { }                            // private: not inherited at all
}
class Circle extends Shape {
    double r; Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }
    @Override void info() { System.out.println("Circle"); }
    static void kind() { System.out.println("static Circle"); }   // hides, not overrides
}

public class Main {
    public static void main(String[] args) {
        Shape s = new Circle(1);
        System.out.println(s.area());   // 3.14159...  (Circle's)
        s.info();                       // Circle
        s.kind();                       // static Shape (reference type decides)
    }
}`, lang: "java" },
        { table: { head: ["Not virtual", "Why"], rows: [
          ["<code>static</code> methods", "Belong to the class; redeclaring in a subclass <i>hides</i> them"],
          ["<code>private</code> methods", "Not inherited, so nothing can override them (called via <code>invokespecial</code>)"],
          ["<code>final</code> methods", "Overriding is forbidden; the JIT can inline them"],
          ["Constructors", "Not inherited; each class has its own"],
          ["Fields", "Never polymorphic — resolved by the reference type"]
        ] } },
        { warn: "Inside a constructor, a call to an overridable method dispatches to the <b>subclass override</b> even though the subclass's fields are not yet initialised — a classic source of <code>NullPointerException</code>. Make such methods <code>final</code> or <code>private</code>." }
      ]
    },
    {
      id: "early-vs-late-binding",
      q: "What is early binding vs late binding?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Binding is linking a method call to the method body. Early (static) binding happens at compile time based on the declared type — used for static, private and final methods, overload selection and field access. Late (dynamic) binding happens at run time based on the actual object type — used for overridden instance methods.",
      a: [
        { table: { head: ["", "Early / static binding", "Late / dynamic binding"], rows: [
          ["When", "Compile time (<code>javac</code>)", "Run time (JVM)"],
          ["Based on", "Static / declared type of the reference", "Dynamic / actual class of the object"],
          ["Applies to", "<code>static</code>, <code>private</code>, <code>final</code> methods; constructors; overload selection; field access", "All other instance methods (overriding)"],
          ["Bytecode", "<code>invokestatic</code>, <code>invokespecial</code>", "<code>invokevirtual</code>, <code>invokeinterface</code>"],
          ["Performance", "Direct call, inlinable", "Table lookup (JIT often devirtualises)"],
          ["Example of", "Compile-time polymorphism", "Run-time polymorphism"]
        ] } },
        { code: `class Base {
    String name = "Base";                                   // fields: early
    static void s()    { System.out.println("Base.s"); }    // static: early
    private void p()   { System.out.println("Base.p"); }    // private: early
    void g()           { System.out.println("Base.g"); }    // instance: late
    void callP()       { p(); }
}
class Derived extends Base {
    String name = "Derived";
    static void s()    { System.out.println("Derived.s"); }
    @Override void g() { System.out.println("Derived.g"); }
}

public class Main {
    public static void main(String[] args) {
        Base b = new Derived();
        b.s();                        // Base.s     - static: reference type
        b.g();                        // Derived.g  - object type, at run time
        b.callP();                    // Base.p     - private: no dispatch
        System.out.println(b.name);   // Base       - fields are never polymorphic
    }
}`, lang: "java" },
        { warn: "In Java, <b>fields are never polymorphic</b>: <code>Base b = new Derived(); b.name</code> reads Base's field even though Derived declares its own (field hiding). Use getters if you need polymorphic behaviour." }
      ]
    },
    {
      id: "upcasting-downcasting",
      q: "What are upcasting and downcasting? When do you get a ClassCastException? How do instanceof and getClass() differ?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Upcasting assigns a subclass object to a superclass/interface reference: implicit and always safe, you just lose access to subclass-only members. Downcasting converts the reference back to the subclass type: explicit, and checked at run time — a ClassCastException is thrown if the object is not actually of that type. Guard downcasts with instanceof; getClass() checks the exact class while instanceof accepts subclasses.",
      a: [
        { p: "Casting in Java changes the <b>static type of the reference</b>, never the object. The object always knows its real class, so an invalid downcast is caught at run time." },
        { code: `class Animal { }
class Dog extends Animal { void bark() { System.out.println("Woof"); } }
class Cat extends Animal { }

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();               // UPCAST: implicit, always safe
        // a.bark();                        // error: static type Animal has no bark()

        Dog d = (Dog) a;                    // DOWNCAST: explicit, checked at run time
        d.bark();                           // Woof

        Animal c = new Cat();
        // Dog bad = (Dog) c;               // compiles, throws ClassCastException at run time

        if (c instanceof Dog) ((Dog) c).bark();          // classic guard (false here)
        if (a instanceof Dog dog) dog.bark();            // Java 16 pattern matching: Woof

        System.out.println(a.getClass() == Dog.class);   // true : exact class
        System.out.println(a instanceof Animal);         // true : is-a, includes subclasses
        System.out.println(null instanceof Dog);         // false: instanceof never throws
    }
}`, lang: "java" },
        { table: { head: ["", "<code>instanceof</code>", "<code>getClass()</code>"], rows: [
          ["Checks", "Is-a: the type or any subtype / implemented interface", "Exact runtime class"],
          ["On <code>null</code>", "<code>false</code>", "<code>NullPointerException</code>"],
          ["Typical use", "Guarding a downcast, <code>equals</code> that tolerates subclasses", "Strict <code>equals</code>, logging, reflection"]
        ] } },
        { ul: [
          "Unrelated types (<code>(String) new Integer(1)</code>) fail at <b>compile</b> time; related-but-wrong types fail at <b>run</b> time.",
          "There is no object slicing in Java: <code>Animal a = dog;</code> copies a reference, the Dog part is not lost — it is just not accessible until you downcast.",
          "Primitives use a different kind of cast: <code>(int) 3.7</code> is a value conversion (truncation), not a type check."
        ] },
        { warn: "Many <code>instanceof</code> checks and downcasts in a method usually mean you are doing polymorphism by hand — add a method to the interface instead (or use sealed types with pattern-matching <code>switch</code>, Java 21)." }
      ]
    },
    {
      id: "java-overriding-rules",
      q: "What are the rules for method overriding in Java?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Same name and parameter list; return type same or a subtype (covariant); access cannot be more restrictive; may throw fewer or narrower checked exceptions but not new/broader ones; final, static and private methods cannot be overridden; constructors are not inherited so cannot be overridden.",
      a: [
        { table: { head: ["Rule", "Detail"], rows: [
          ["Signature", "Same method name and same parameter types/order"],
          ["Return type", "Same, or a subclass for reference types (covariant); primitives must match exactly"],
          ["Access", "Same or <b>wider</b> (protected → public OK; public → protected error)"],
          ["Checked exceptions", "Same, narrower, or none; cannot add new or broader checked exceptions"],
          ["Unchecked exceptions", "Any"],
          ["<code>final</code> method", "Cannot be overridden"],
          ["<code>static</code> method", "Cannot be overridden — redeclaring hides it"],
          ["<code>private</code> method", "Not inherited; a same-named method in subclass is a new method"],
          ["Constructor", "Not inherited, cannot be overridden"],
          ["Package-private method", "Overridable only by subclasses in the same package"],
          ["<code>synchronized</code> / <code>strictfp</code>", "Not part of the contract; the override may add or drop them"]
        ] } },
        { code: `import java.io.*;

class Parent {
    protected Object get() throws IOException { return "p"; }
}
class Child extends Parent {
    @Override
    public String get() throws FileNotFoundException {  // wider access, covariant
        return "c";                                     // return, narrower exception
    }
    // @Override protected Object get() throws Exception  -> error: broader exception
    // @Override Object get()                             -> error: weaker access
    // @Override public Object get(int x)                 -> not an override: overload
}`, lang: "java" },
        { tip: "The <code>@Override</code> annotation is optional but makes the compiler verify all these rules — always mention it. Also: an overriding method can drop a <code>throws</code> clause entirely, which lets callers through the subclass reference skip the try/catch." }
      ]
    },
    {
      id: "covariant-return-types",
      q: "What are covariant return types?",
      topic: "Polymorphism",
      level: 2,
      top: false,
      short: "An overriding method may return a more specific type than the method it overrides: if Animal.create() returns Animal, Dog.create() may return Dog. Supported since Java 5 for reference return types only; primitive return types must match exactly.",
      a: [
        { p: "Normally an override must match the parent signature exactly. <b>Covariant return types</b> relax this for the return type only: it can be a <b>subtype</b> of the original return type, because a Dog is still a valid Animal for any caller using the parent interface." },
        { code: `class Animal {
    Animal create() { return new Animal(); }
}
class Dog extends Animal {
    @Override
    Dog create() { return new Dog(); }     // covariant return: Dog instead of Animal
    void bark() { System.out.println("Woof"); }
}

public class Main {
    public static void main(String[] args) {
        new Dog().create().bark();         // compiles: no cast needed
        Animal a = new Dog();
        Animal b = a.create();             // still works through the parent type
    }
}`, lang: "java" },
        { ul: [
          "Real example: <code>Object.clone()</code> returns <code>Object</code>; your override can return <code>MyClass</code> so callers need no cast.",
          "Also used by builders: <code>StringBuilder.append</code> returns <code>StringBuilder</code> though the interface <code>Appendable.append</code> returns <code>Appendable</code>.",
          "Behind the scenes <code>javac</code> generates a <b>bridge method</b> with the parent's return type so the JVM sees a normal override."
        ] },
        { warn: "Covariance applies to <b>return types only</b>. Parameter types must match exactly — changing them creates an overload, not an override (<code>@Override</code> will catch this). Primitive return types must match exactly: <code>int</code> cannot become <code>long</code>." }
      ]
    },
    {
      id: "vtable-vptr",
      q: "How does the JVM implement method overriding internally? (vtables, invokevirtual, invokeinterface)",
      topic: "Polymorphism",
      level: 3,
      top: true,
      short: "Each loaded class has a virtual method table in metaspace: an array of pointers to the most-derived implementation of every virtual method, with a fixed slot index per method along the hierarchy. Every object header holds a pointer to its class. invokevirtual loads that class pointer, indexes the slot and jumps; invokeinterface searches an itable because interface methods have no fixed slot. The JIT then uses inline caches and devirtualisation to remove most of the cost.",
      a: [
        { p: "The Java spec only defines the semantics; HotSpot implements them with <b>vtables</b>, much like C++ compilers do:" },
        { ol: [
          "<b>vtable</b> — one per <i>class</i>, built at class-loading time in metaspace. A subclass copies its parent's table and overwrites the slots it overrides, appending slots for new methods. So <code>speak()</code> has the same index in <code>Base</code> and <code>Derived</code>.",
          "<b>Object header</b> — every object starts with a mark word (hash, lock, GC bits) and a <b>klass pointer</b> to its class metadata, including the vtable.",
          "<b>Call</b> — <code>invokevirtual Base.speak</code> compiles to: load the klass pointer, load slot <i>i</i>, indirect call. <code>invokeinterface</code> must first find the interface's <b>itable</b> inside the class because slot indices differ per implementing class.",
          "<b>JIT</b> — C2 tracks the receiver types seen at each call site (inline caches): monomorphic sites become a direct call with a cheap type guard, and <code>final</code> or effectively-final methods are inlined outright."
        ] },
        { svg: `<svg viewBox="0 0 700 235" width="700" class="dg">
  <text class="tx-m" x="85" y="22" text-anchor="middle">Derived object d</text>
  <rect class="box-a" x="20" y="30" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="45" text-anchor="middle" dominant-baseline="middle">header: klass ptr</text>
  <rect class="box" x="20" y="60" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="75" text-anchor="middle" dominant-baseline="middle">int x, y</text>
  <text class="tx-m" x="85" y="132" text-anchor="middle">Base object b</text>
  <rect class="box-a" x="20" y="140" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="155" text-anchor="middle" dominant-baseline="middle">header: klass ptr</text>
  <rect class="box" x="20" y="170" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="185" text-anchor="middle" dominant-baseline="middle">int x</text>
  <line class="ln-a" x1="150" y1="45" x2="248" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="150" y1="155" x2="248" y2="155" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="330" y="22" text-anchor="middle">vtable for Derived</text>
  <rect class="box-g" x="250" y="30" width="160" height="90" rx="6"/>
  <text class="tx-c" x="330" y="45" text-anchor="middle" dominant-baseline="middle">[0] Derived.speak</text>
  <text class="tx-c" x="330" y="75" text-anchor="middle" dominant-baseline="middle">[1] Base.eat</text>
  <text class="tx-c" x="330" y="105" text-anchor="middle" dominant-baseline="middle">[2] Object.toString</text>
  <text class="tx-m" x="330" y="132" text-anchor="middle">vtable for Base</text>
  <rect class="box-p" x="250" y="140" width="160" height="90" rx="6"/>
  <text class="tx-c" x="330" y="155" text-anchor="middle" dominant-baseline="middle">[0] Base.speak</text>
  <text class="tx-c" x="330" y="185" text-anchor="middle" dominant-baseline="middle">[1] Base.eat</text>
  <text class="tx-c" x="330" y="215" text-anchor="middle" dominant-baseline="middle">[2] Object.toString</text>
  <text class="tx-m" x="430" y="50">One vtable per class, in metaspace.</text>
  <text class="tx-m" x="430" y="70">Every object header points to its class.</text>
  <text class="tx-m" x="430" y="90">Derived overrides speak, inherits eat.</text>
  <text class="tx-c" x="430" y="160">Base b = new Derived();</text>
  <text class="tx-c" x="430" y="180">b.speak();  // invokevirtual, slot 0</text>
</svg>`, caption: "Two objects, two vtables. Same slot index, different target method." },
        { code: `class Base {
    int x;
    void speak() {}
    void eat()   {}
}
class Derived extends Base {
    int y;
    @Override void speak() {}    // replaces the speak slot in Derived's vtable
}                                // eat slot still points to Base.eat

// javap -c Main   shows the call site:
//   aload_1
//   invokevirtual #7    // Method Base.speak:()V   <- slot resolved at run time`, lang: "java" },
        { table: { head: ["Bytecode", "Used for", "Dispatch"], rows: [
          ["<code>invokevirtual</code>", "Ordinary instance methods", "vtable slot (fast, fixed index)"],
          ["<code>invokeinterface</code>", "Methods called via an interface reference", "itable lookup, then slot"],
          ["<code>invokespecial</code>", "Constructors, <code>private</code> methods, <code>super.m()</code>", "Static — exact method known"],
          ["<code>invokestatic</code>", "<code>static</code> methods", "Static"],
          ["<code>invokedynamic</code>", "Lambdas, string concatenation", "Bootstrap method links the call site once"]
        ] } },
        { tip: "Follow-ups: 'Why can't constructors be overridden?' — they are not virtual and not inherited; the class is fixed at <code>new</code>. 'Where is the vtable stored?' — metaspace, with the class metadata. 'Is interface dispatch slower?' — slightly in the interpreter, negligible after the JIT's inline caches." }
      ]
    },

    /* ───────────── Constructors & Object Lifecycle ───────────── */
    {
      id: "constructor-types",
      q: "What is a constructor? What are the types of constructors in Java?",
      topic: "Constructors & Object Lifecycle",
      level: 1,
      top: true,
      short: "A constructor is a special block with the class's name and no return type that initialises an object when new is called. Types: default (compiler-generated no-arg), no-arg (written by you), parameterised, copy constructor (a convention, not a language feature) and private constructors. Constructors can be overloaded and chained with this() and super().",
      a: [
        { p: "A <b>constructor</b> runs automatically when an object is created, to put it into a valid initial state. It has the same name as the class, no return type (not even <code>void</code>), and can be overloaded." },
        { table: { head: ["Type", "Example", "Notes"], rows: [
          ["Default", "(none written)", "Compiler generates <code>Student() { super(); }</code> only if you declare <b>no</b> constructor; same access as the class"],
          ["No-arg", "<code>Student() { ... }</code>", "Written by you; often delegates via <code>this(...)</code>"],
          ["Parameterised", "<code>Student(String n, int r)</code>", "Most common; use <code>this.x = x</code>"],
          ["Copy", "<code>Student(Student other)</code>", "Just a convention in Java — nothing is generated for you"],
          ["Private", "<code>private Student()</code>", "Singleton, static factories, utility classes"],
          ["Chained", "<code>this(...)</code> / <code>super(...)</code>", "Must be the first statement; only one of them"]
        ] } },
        { code: `class Student {
    private String name;
    private int roll;

    Student() { this("unknown", 0); }                 // no-arg, delegates via this()
    Student(String name, int roll) {                  // parameterised
        this.name = name; this.roll = roll;
    }
    Student(Student other) {                          // "copy constructor" (by convention)
        this(other.name, other.roll);
    }
}

public class Main {
    public static void main(String[] args) {
        Student a = new Student();                    // no-arg
        Student b = new Student("Riya", 7);           // parameterised
        Student c = new Student(b);                   // copy: independent object
        Student d = b;                                // NOT a copy: same object, two references
    }
}`, lang: "java" },
        { ul: [
          "If you declare <i>any</i> constructor, the compiler no longer generates the default one — a common cause of 'constructor X in class X cannot be applied' in subclasses.",
          "Every constructor's first action is another constructor: <code>this(...)</code> or <code>super(...)</code> (inserted implicitly), so the chain always reaches <code>Object()</code>.",
          "A constructor cannot be <code>abstract</code>, <code>static</code>, <code>final</code> or <code>synchronized</code>, and has no return type; it can be <code>private</code>, <code>protected</code>, <code>public</code> or package-private.",
          "Constructors are <b>not inherited</b> and <b>cannot be overridden</b>."
        ] },
        { tip: "Trick question: <code>void Student() {}</code> is <i>not</i> a constructor — it's an ordinary method that happens to share the class name, and the compiler will still generate the default constructor." }
      ]
    },
    {
      id: "constructor-rules",
      q: "Can a constructor be private, static, final, abstract or inherited? Can it be overloaded or overridden, or return a value?",
      topic: "Constructors & Object Lifecycle",
      level: 2,
      top: true,
      short: "Private: yes (Singleton, factories, utility classes). Static, final, abstract: no — a constructor initialises one specific object, is never inherited and never overridden, so those modifiers are meaningless. Overloaded: yes. Overridden or inherited: no. Return a value: no, it has no return type; it may exit early with return; or by throwing.",
      a: [
        { table: { head: ["Question", "Answer", "Reason"], rows: [
          ["Private?", "<b>Yes</b>", "Restrict creation: Singleton, static factory methods, utility classes with only static members"],
          ["Static?", "No", "A constructor initialises a specific object (<code>this</code>); static means 'no object'"],
          ["Final?", "No", "Constructors aren't inherited, so there's nothing to prevent overriding"],
          ["Abstract?", "No", "Abstract means 'subclass must implement' — constructors aren't inherited"],
          ["Inherited?", "No", "Subclass may have extra fields; it must call <code>super(...)</code> instead"],
          ["Overloaded?", "<b>Yes</b>", "Different parameter lists; chain them with <code>this(...)</code>"],
          ["Overridden?", "No", "Not inherited, and not virtual — the class is fixed at <code>new</code>"],
          ["Return a value?", "No", "No return type at all; a bare <code>return;</code> is allowed to exit early"],
          ["Throw an exception?", "<b>Yes</b>", "The standard way to signal failed construction; the object is never handed out"],
          ["Call an overridable method?", "Legal but dangerous", "Runs subclass code before subclass fields are initialised"]
        ] } },
        { code: `final class MathUtils {
    private MathUtils() { throw new AssertionError(); }   // utility class: never instantiated
    static int square(int x) { return x * x; }
}

class Connection {
    private static Connection instance;
    private Connection() { }                              // private: only open() may create
    static synchronized Connection open() {              // factory / lazy singleton
        if (instance == null) instance = new Connection();
        return instance;
    }
}

class Range {
    final int lo, hi;
    Range(int lo, int hi) {
        if (lo > hi) throw new IllegalArgumentException("lo > hi");   // fail fast
        this.lo = lo; this.hi = hi;
    }
}`, lang: "java" },
        { tip: "Follow-up: 'How would you prevent a class from being subclassed without <code>final</code>?' — make all constructors private (subclasses can't call <code>super()</code>). This is how enum-like classes and <code>Integer</code>-style caching classes work." }
      ]
    },
    {
      id: "initialization-order",
      q: "In what order do static blocks, instance initialiser blocks, field initialisers and constructors run?",
      topic: "Constructors & Object Lifecycle",
      level: 2,
      top: true,
      short: "Static field initialisers and static blocks run once, in textual order, when the class is first used, parent before child. For each new object: the parent's instance initialisers and constructor body run first, then the child's field initialisers and instance blocks in textual order, then the child's constructor body.",
      a: [
        { p: "Class initialisation happens once per class, on first active use (creating an instance, calling a static method, touching a non-constant static field). Instance initialisation happens on every <code>new</code>, and always starts with the parent because the constructor's implicit first statement is <code>super()</code>." },
        { code: `class Parent {
    static { System.out.println("1 Parent static block"); }
    { System.out.println("3 Parent instance block"); }
    Parent() { System.out.println("4 Parent constructor"); }
}
class Child extends Parent {
    static int s = log("2 Child static field");
    int f = log("5 Child instance field");
    { System.out.println("6 Child instance block"); }
    Child() { super(); System.out.println("7 Child constructor"); }

    static int log(String msg) { System.out.println(msg); return 0; }
}

public class Main {
    public static void main(String[] args) {
        new Child();
        System.out.println("--- second object ---");
        new Child();          // static parts do NOT run again: only 3..7
    }
}`, lang: "java", title: "Output is 1 2 3 4 5 6 7, then 3 4 5 6 7" },
        { ol: [
          "<b>Parent static</b> initialisers and static blocks (textual order) — once",
          "<b>Child static</b> initialisers and static blocks — once",
          "Parent <b>instance</b> field initialisers and instance blocks (textual order)",
          "Parent <b>constructor body</b>",
          "Child <b>instance</b> field initialisers and instance blocks (textual order)",
          "Child <b>constructor body</b>"
        ] },
        { ul: [
          "Instance blocks are copied by the compiler into <i>every</i> constructor right after the <code>super(...)</code> call — that's why they run before the body.",
          "A <code>static final</code> compile-time constant (<code>static final int N = 5;</code>) does <b>not</b> trigger class initialisation when read.",
          "Static blocks cannot throw checked exceptions; an exception there becomes <code>ExceptionInInitializerError</code>."
        ] },
        { warn: "If <code>Parent()</code> calls an overridable method that <code>Child</code> overrides to print <code>f</code>, it prints <code>0</code> — step 5 hasn't happened yet. Same for a field initialised to a non-null object: it is still <code>null</code> at that moment." }
      ]
    },
    {
      id: "constructor-destructor-order",
      q: "In what order are constructors called in an inheritance chain? Does Java have destructors?",
      topic: "Constructors & Object Lifecycle",
      level: 2,
      top: true,
      short: "Construction goes top-down: Object first, then each superclass down to the actual class, each running its field initialisers and then its constructor body. Java has no destructors — the garbage collector reclaims unreachable objects at an unspecified time; use try-with-resources/close() for deterministic cleanup. finalize() existed for this but is deprecated.",
      a: [
        { p: "An object is built foundation-first so that when a constructor body runs, everything it might use from its superclasses already exists. The implicit <code>super()</code> at the start of every constructor enforces this." },
        { code: `class Member { Member() { System.out.println("Member()"); } }
class Base   { Base()   { System.out.println("Base()"); } }
class Derived extends Base {
    Member m = new Member();          // field initialiser: after super(), before body
    Derived() { System.out.println("Derived()"); }
}

public class Main {
    public static void main(String[] args) { new Derived(); }
}
/* Output:
Base()
Member()
Derived()
*/`, lang: "java" },
        { ol: [
          "<code>super(...)</code> — recursively, all the way up to <code>Object()</code>",
          "This class's instance field initialisers and instance blocks, in textual order",
          "This class's constructor body"
        ] },
        { h: "What about destruction?" },
        { table: { head: ["", "Java", "Languages with destructors (C++)"], rows: [
          ["Who frees memory", "Garbage collector, when the object is unreachable", "Programmer / scope exit, deterministically"],
          ["Order", "Unspecified; GC may reclaim many objects at once", "Reverse of construction"],
          ["Cleanup hook", "<code>AutoCloseable.close()</code> via try-with-resources; <code>Cleaner</code> as a safety net", "Destructor body"],
          ["<code>finalize()</code>", "Deprecated (Java 9), removed for good reason: slow, unpredictable, may never run", "—"]
        ] } },
        { ul: [
          "With multiple levels <code>class C extends B</code>, <code>B extends A</code>: <code>A()</code>, then <code>B()</code>, then <code>C()</code>.",
          "Local variables are popped with the stack frame; the <i>objects</i> they pointed to live until GC finds them unreachable.",
          "If a constructor throws, the partially built object is never returned by <code>new</code> and becomes garbage — unless the constructor leaked <code>this</code> to a static field or another thread."
        ] },
        { tip: "One-liner: 'Java has constructors but no destructors; memory is the GC's job and other resources are released with try-with-resources.'" }
      ]
    },
    {
      id: "shallow-vs-deep-copy",
      q: "How do you copy an object in Java? Explain shallow copy vs deep copy and clone().",
      topic: "Constructors & Object Lifecycle",
      level: 2,
      top: true,
      short: "Assignment copies only the reference. Object.clone() makes a shallow copy: primitive fields are copied but reference fields still point to the same objects, so mutating a nested object affects both copies. A deep copy also copies every referenced mutable object, recursively — via an overridden clone(), a copy constructor or serialization.",
      a: [
        { p: "<code>b = a</code> creates <b>no</b> new object. To copy you need <code>clone()</code>, a copy constructor or a factory method — and you must decide how deep the copy goes." },
        { svg: `<svg viewBox="0 0 620 210" width="620" class="dg">
  <text class="tx-m" x="70" y="20" text-anchor="middle">references</text>
  <text class="tx-m" x="240" y="60" text-anchor="middle">heap</text>
  <rect class="box" x="20" y="30" width="100" height="34" rx="6"/>
  <text class="tx-c" x="70" y="47" text-anchor="middle" dominant-baseline="middle">a.addr</text>
  <rect class="box" x="20" y="110" width="100" height="34" rx="6"/>
  <text class="tx-c" x="70" y="127" text-anchor="middle" dominant-baseline="middle">b.addr</text>
  <rect class="box-r" x="190" y="70" width="100" height="34" rx="6"/>
  <text class="tx-c" x="240" y="87" text-anchor="middle" dominant-baseline="middle">Address</text>
  <line class="ln" x1="120" y1="47" x2="188" y2="80" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="120" y1="127" x2="188" y2="96" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="155" y="178" text-anchor="middle">Shallow: one shared Address</text>
  <text class="tx-m" x="155" y="196" text-anchor="middle">b.addr.city = X changes a too</text>
  <text class="tx-m" x="390" y="20" text-anchor="middle">references</text>
  <text class="tx-m" x="560" y="20" text-anchor="middle">heap</text>
  <rect class="box" x="340" y="30" width="100" height="34" rx="6"/>
  <text class="tx-c" x="390" y="47" text-anchor="middle" dominant-baseline="middle">a.addr</text>
  <rect class="box" x="340" y="110" width="100" height="34" rx="6"/>
  <text class="tx-c" x="390" y="127" text-anchor="middle" dominant-baseline="middle">b.addr</text>
  <rect class="box-g" x="510" y="30" width="100" height="34" rx="6"/>
  <text class="tx-c" x="560" y="47" text-anchor="middle" dominant-baseline="middle">Address</text>
  <rect class="box-g" x="510" y="110" width="100" height="34" rx="6"/>
  <text class="tx-c" x="560" y="127" text-anchor="middle" dominant-baseline="middle">Address (copy)</text>
  <line class="ln-a" x1="440" y1="47" x2="508" y2="47" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="440" y1="127" x2="508" y2="127" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="475" y="178" text-anchor="middle">Deep: each owns its Address</text>
  <text class="tx-m" x="475" y="196" text-anchor="middle">independent objects</text>
</svg>`, caption: "After b = a.clone(): default shallow clone() vs an overridden deep clone()." },
        { code: `class Address implements Cloneable {
    String city;
    Address(String c) { city = c; }
    @Override public Address clone() {
        try { return (Address) super.clone(); }              // only primitives/Strings: shallow is enough
        catch (CloneNotSupportedException e) { throw new AssertionError(e); }
    }
}

class Person implements Cloneable {                         // marker interface: else clone() throws
    String name;
    Address addr;
    Person(String n, Address a) { name = n; addr = a; }

    // SHALLOW: Object.clone() copies fields one by one -> both Persons share ONE Address
    // @Override public Person clone() { return (Person) super.clone(); }

    @Override public Person clone() {                        // DEEP
        try {
            Person p = (Person) super.clone();
            p.addr = addr.clone();                           // copy the referenced object too
            return p;
        } catch (CloneNotSupportedException e) { throw new AssertionError(e); }
    }
}

public class Main {
    public static void main(String[] args) {
        Person a = new Person("Asha", new Address("Pune"));
        Person b = a.clone();
        b.addr.city = "Delhi";
        System.out.println(a.addr.city);   // Pune with deep copy; Delhi with shallow copy
    }
}`, lang: "java" },
        { table: { head: ["", "Shallow copy", "Deep copy"], rows: [
          ["Primitive fields", "Copied", "Copied"],
          ["Reference fields", "Same object shared", "New object, recursively copied"],
          ["Cost", "Cheap", "Proportional to the object graph"],
          ["Safe when", "Referenced objects are immutable (<code>String</code>, <code>Integer</code>)", "Referenced objects are mutable"],
          ["How", "<code>super.clone()</code>, <code>new ArrayList&lt;&gt;(list)</code>", "Overridden <code>clone()</code>, copy constructor, serialization / JSON round-trip"]
        ] } },
        { ul: [
          "<code>Cloneable</code> is a <b>marker interface</b>: it has no methods; <code>Object.clone()</code> checks it at run time and throws <code>CloneNotSupportedException</code> if absent.",
          "<code>Object.clone()</code> is <code>protected</code>; you override it as <code>public</code> with a covariant return type.",
          "Arrays' <code>clone()</code> is shallow too: <code>int[][] g2 = g.clone()</code> shares the inner rows."
        ] },
        { tip: "Effective Java's advice: prefer a <b>copy constructor</b> or copy factory over <code>clone()</code> — no checked exception, no casts, works with final fields, and you control the depth explicitly. Immutable fields never need deep copying." }
      ]
    },
    {
      id: "object-creation-ways",
      q: "In how many ways can you create an object in Java? Which of them do not call a constructor?",
      topic: "Constructors & Object Lifecycle",
      level: 2,
      top: false,
      short: "Five commonly listed ways: the new keyword, reflection (Class.forName(...).getDeclaredConstructor().newInstance()), clone(), deserialization, and factory methods (which call new internally). clone() and deserialization create the object without running its constructor; the others run it.",
      a: [
        { code: `import java.io.*;

class User implements Cloneable, Serializable {
    String name = "default";
    User() { System.out.println("constructor ran"); }
    @Override public User clone() throws CloneNotSupportedException { return (User) super.clone(); }
}

public class Main {
    public static void main(String[] args) throws Exception {
        User a = new User();                                       // 1. new

        User b = User.class.getDeclaredConstructor().newInstance(); // 2. reflection
        // or: (User) Class.forName("User").getDeclaredConstructor().newInstance()

        User c = a.clone();                                        // 3. clone: NO constructor

        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        new ObjectOutputStream(bytes).writeObject(a);
        User d = (User) new ObjectInputStream(                     // 4. deserialization:
            new ByteArrayInputStream(bytes.toByteArray())).readObject();   //    NO constructor

        Integer e = Integer.valueOf(42);                           // 5. factory method
        String  f = "literal";                                     //    (string pool: maybe no new object)
    }
}`, lang: "java" },
        { table: { head: ["Way", "Constructor runs?", "Typical use"], rows: [
          ["<code>new</code>", "Yes", "Everyday code"],
          ["Reflection <code>newInstance()</code>", "Yes", "Frameworks (Spring, JUnit, JDBC drivers) creating classes named in config"],
          ["<code>clone()</code>", "<b>No</b> — memory copied field by field", "Prototype pattern, defensive copies"],
          ["Deserialization", "<b>No</b> for <code>Serializable</code> classes (the first non-serializable superclass's no-arg constructor does run)", "Caching, RPC, session persistence"],
          ["Factory method", "Yes, inside the factory", "<code>List.of()</code>, <code>Integer.valueOf()</code>, <code>LocalDate.now()</code>"]
        ] } },
        { warn: "Because <code>clone()</code> and deserialization bypass constructors, invariants checked in the constructor are <i>not</i> re-checked — validate in <code>readObject</code> / <code>clone()</code> too. This is also why an <code>enum</code> is the safest Singleton: the JVM guarantees one instance even across deserialization." }
      ]
    },
    {
      id: "resource-cleanup-java",
      q: "Java has no destructors. How do you release resources like files, sockets and DB connections deterministically?",
      topic: "Constructors & Object Lifecycle",
      level: 2,
      top: true,
      short: "Implement AutoCloseable and use try-with-resources: close() is guaranteed to run when the block exits, normally or by exception, in reverse order of acquisition. Before Java 7 this was done in a finally block. finalize() is deprecated and Cleaner (Java 9) is only a last-resort safety net, because GC timing is unpredictable.",
      a: [
        { p: "Memory is the GC's job, but files, sockets, locks and connections are <b>not</b> reclaimed by GC in a timely way. Java's answer is a lexical construct instead of a destructor: the resource's lifetime is tied to a <b>block</b>." },
        { code: `class Connection implements AutoCloseable {
    Connection() { System.out.println("open"); }
    void send(String s) { System.out.println("send " + s); }
    @Override public void close() { System.out.println("close"); }   // deterministic
}

public class Main {
    public static void main(String[] args) {
        try (Connection c1 = new Connection();
             Connection c2 = new Connection()) {          // closed in REVERSE order: c2, c1
            c1.send("hi");
            throw new RuntimeException("boom");           // close() still runs, then catch
        } catch (RuntimeException e) {
            System.out.println("caught " + e.getMessage());
        }
    }
}
/* open, open, send hi, close, close, caught boom */`, lang: "java", title: "try-with-resources" },
        { table: { head: ["Mechanism", "When it runs", "Verdict"], rows: [
          ["try-with-resources (<code>AutoCloseable</code>)", "Immediately at block exit, even on exception", "<b>Use this</b>"],
          ["<code>finally { x.close(); }</code>", "Same, but verbose and easy to get wrong with multiple resources", "Pre-Java-7 style"],
          ["<code>Cleaner</code> / <code>PhantomReference</code> (Java 9)", "Some time after the object becomes unreachable", "Safety net only, for native resources"],
          ["<code>finalize()</code>", "Maybe, eventually, on some GC thread — or never", "Deprecated; don't"]
        ] } },
        { ul: [
          "If both the body and <code>close()</code> throw, the body's exception wins and the close exception is attached via <code>getSuppressed()</code>.",
          "Resources must be effectively final; Java 9 lets you write <code>try (existingVar)</code>.",
          "This is Java's equivalent of C++ RAII and Python's <code>with</code> statement — scope-bound cleanup, without relying on the GC."
        ] },
        { tip: "Interview one-liner: 'The GC manages memory, not resources. For resources I tie lifetime to a block with try-with-resources.' Mention that forgetting to close is the top cause of 'too many open files' and connection-pool exhaustion in production." }
      ]
    },

    /* ───────────── Memory & References ───────────── */
    {
      id: "stack-vs-heap",
      q: "What is stored on the stack and what on the heap in Java? Where do static variables live?",
      topic: "Memory & References",
      level: 1,
      top: true,
      short: "Each thread has its own stack of frames holding local primitives, local references and return addresses; frames are pushed on call and popped on return. All objects and arrays live on the shared heap, managed by the GC. Class metadata lives in metaspace, and static fields live with the Class object on the heap (since Java 8).",
      a: [
        { table: { head: ["", "Stack", "Heap"], rows: [
          ["Holds", "Method frames: local primitives, local <i>references</i>, operand stack", "Every object and array, including the ones referenced from the stack"],
          ["Ownership", "One per thread, private", "One per JVM, shared by all threads"],
          ["Lifetime", "Popped automatically on return (LIFO)", "Until unreachable, then reclaimed by GC"],
          ["Size", "Small (~512KB–1MB, <code>-Xss</code>)", "Large (<code>-Xms</code>/<code>-Xmx</code>)"],
          ["Failure", "<code>StackOverflowError</code> (deep recursion)", "<code>OutOfMemoryError: Java heap space</code>"],
          ["Speed", "Very fast (pointer bump)", "Slower allocation, GC cost"]
        ] } },
        { code: `public class Main {
    static int counter = 0;                // static: stored with the Class object (heap)

    public static void main(String[] args) {
        int n = 5;                         // primitive local  -> main's stack frame
        int[] arr = new int[n];            // 'arr' reference -> stack; the array -> heap
        String s = "hi";                   // reference -> stack; "hi" -> string pool (heap)
        Point p = new Point(1, 2);         // reference -> stack; Point object {x, y} -> heap
        helper(p);                         // new frame pushed for helper; popped on return
        System.out.println(p.x);           // 2: helper changed the shared heap object
    }                                      // frame popped: arr, s, p are gone;
                                           // their objects become garbage if unreachable

    static void helper(Point q) { q.x++; } // q: a copy of the reference, in helper's frame
}
class Point { int x, y; Point(int x, int y) { this.x = x; this.y = y; } }`, lang: "java" },
        { ul: [
          "Objects are <b>never</b> on the stack in the language model — even <code>new Point()</code> inside a method goes to the heap (the JIT's escape analysis may optimise this away, but you can't rely on it).",
          "Instance fields live inside their object on the heap, whatever their type; only <i>local</i> primitives are on the stack.",
          "<b>Metaspace</b> (native memory, Java 8+) holds class metadata, method bytecode and the constant pool; it replaced PermGen.",
          "The string pool moved from PermGen to the heap in Java 7."
        ] },
        { tip: "Quick-fire: 'Where is <code>int x</code> stored?' — depends: local → stack, field → inside its object on the heap, static → with the Class object. 'Is the heap per thread?' — no, that's why heap objects need synchronisation." }
      ]
    },
    {
      id: "java-references",
      q: "What is a reference in Java? Does Java have pointers?",
      topic: "Memory & References",
      level: 1,
      top: true,
      short: "A reference is a variable that holds the address of an object on the heap; it is the only way to reach an object. Java has no user-visible pointers: you cannot see or change the address, do arithmetic on it, or point into the middle of an object. A reference can be null, re-pointed to another object, and is passed by value.",
      a: [
        { p: "Every non-primitive variable in Java (<code>String s</code>, <code>int[] a</code>, <code>Dog d</code>) is a <b>reference</b>. Internally it is a pointer (HotSpot even calls them 'oops' — ordinary object pointers), but the language hides all pointer operations, which removes whole categories of bugs (buffer overruns, dangling pointers, double frees)." },
        { table: { head: ["", "Java reference", "C/C++ pointer"], rows: [
          ["Holds", "Address of an object (opaque)", "Any address (visible, castable to int)"],
          ["Arithmetic", "No", "Yes (<code>p + 1</code>)"],
          ["Null", "<code>null</code>; dereferencing throws <code>NullPointerException</code>", "<code>NULL</code>; dereferencing is undefined behaviour"],
          ["Re-pointing", "Yes", "Yes"],
          ["Dangling", "Impossible — GC keeps the object alive while referenced", "Possible after <code>free</code>/<code>delete</code>"],
          ["Points to", "Whole objects/arrays only", "Objects, fields, array elements, functions, stack variables"],
          ["Size", "4 bytes (compressed oops) or 8", "8 bytes on 64-bit"]
        ] } },
        { code: `class Node { int val; Node next; Node(int v) { val = v; } }

public class Main {
    public static void main(String[] args) {
        Node a = new Node(1);
        Node b = a;                       // copies the reference: two names, one object
        b.val = 7;
        System.out.println(a.val);        // 7

        b = new Node(2);                  // b re-pointed; a still refers to the first node
        System.out.println(a.val);        // 7

        Node c = null;                    // reference to nothing
        // c.val = 1;                     // NullPointerException at run time

        System.out.println(a == b);       // false: different objects
        System.out.println(a.equals(b));  // false too: Object.equals is ==
    }
}`, lang: "java" },
        { ul: [
          "<code>==</code> on references compares addresses (same object?), never contents — use <code>equals()</code>.",
          "Since Java 14, NPE messages say <i>what</i> was null: 'Cannot read field \"val\" because \"c\" is null'.",
          "<code>Optional&lt;T&gt;</code> and <code>Objects.requireNonNull</code> are the idiomatic tools for making 'may be absent' explicit."
        ] },
        { tip: "Answer to 'does Java have pointers?': 'Yes internally — every object variable is a pointer — but no pointer <i>arithmetic</i> or address access, which is what people mean by pointers.' <code>NullPointerException</code> in the name is the giveaway." }
      ]
    },
    {
      id: "java-pass-by-value",
      q: "Is Java pass-by-value or pass-by-reference?",
      topic: "Memory & References",
      level: 2,
      top: true,
      short: "Java is always pass-by-value. For objects, the value passed is a copy of the reference, so a method can mutate the object the caller sees, but reassigning the parameter does not affect the caller's variable. There is no way to make a method rebind the caller's variable.",
      a: [
        { p: "Every argument is copied into the parameter. For a primitive, the copy is the number; for an object, the copy is the <b>reference</b> (address). Both the caller and callee references point to the same object, but they are separate variables." },
        { code: `class Box { int v; Box(int v) { this.v = v; } }

public class Main {
    static void mutate(Box b)   { b.v = 99; }          // visible to caller: same object
    static void reassign(Box b) { b = new Box(-1); }   // NOT visible: only the copy is rebound
    static void swap(Box a, Box b) { Box t = a; a = b; b = t; }  // no effect on caller
    static void inc(int x)      { x++; }               // primitives: plain copy

    public static void main(String[] args) {
        Box x = new Box(1), y = new Box(2);
        int n = 5;
        mutate(x);     System.out.println(x.v);        // 99
        reassign(x);   System.out.println(x.v);        // 99
        swap(x, y);    System.out.println(x.v + " " + y.v);  // 99 2
        inc(n);        System.out.println(n);          // 5
    }
}`, lang: "java" },
        { table: { head: ["Inside the method", "Effect on caller"], rows: [
          ["Modify the object's fields via the parameter", "Visible — same heap object"],
          ["Call a mutating method (<code>list.add</code>)", "Visible"],
          ["Assign the parameter to a new object", "Invisible — only the local copy changes"],
          ["Modify a primitive parameter", "Invisible"],
          ["Modify a <code>String</code> parameter", "Invisible — Strings are immutable, so any change creates a new object"]
        ] } },
        { tip: "The swap test is the proof: you cannot write a working <code>swap(a, b)</code> for two object variables in Java, which you could with real pass-by-reference (C++ <code>T&amp;</code>, C# <code>ref</code>). To return two values, return an object or fill an array." }
      ]
    },
    {
      id: "garbage-collection",
      q: "How does garbage collection work in Java? When does an object become eligible?",
      topic: "Memory & References",
      level: 2,
      top: true,
      short: "The JVM's garbage collector automatically frees objects that are no longer reachable from GC roots (thread stacks, static fields, JNI references). It marks everything reachable, sweeps the rest and usually compacts. Modern collectors are generational: most objects die young in the Young Generation (cheap minor GCs); survivors are promoted to the Old Generation.",
      a: [
        { p: "An object becomes <b>eligible for GC</b> when no chain of references from a <b>GC root</b> reaches it — reference counting is not used, so cycles (A → B → A) are collected fine." },
        { ol: [
          "<b>Mark</b>: traverse from roots (local variables on thread stacks, static fields, JNI refs, active threads) and mark every reachable object.",
          "<b>Sweep</b>: reclaim unmarked objects.",
          "<b>Compact</b> (most collectors): move live objects together to avoid fragmentation and make allocation a pointer bump."
        ] },
        { table: { head: ["Region", "Contents", "Collection"], rows: [
          ["Young Gen (Eden + 2 Survivor)", "New objects", "Minor GC — frequent, fast (copying)"],
          ["Old Gen (Tenured)", "Long-lived objects that survived several minor GCs", "Major / full GC — slower"],
          ["Metaspace (Java 8+)", "Class metadata (native memory)", "On class unloading"]
        ] } },
        { code: `class Demo {
    public static void main(String[] args) {
        Object a = new Object();
        a = null;                      // 1. nullify: old object unreachable

        Object b = new Object();
        b = new Object();              // 2. reassign: first object unreachable

        make();                        // 3. object created in a finished method
        island();                      // 4. cycle with no outside reference: collected too

        System.gc();                   // only a HINT; the JVM may ignore it
    }
    static void make() { Object tmp = new Object(); }
    static void island() {
        Node p = new Node(), q = new Node();
        p.next = q; q.next = p;        // p <-> q, but nothing points at them after return
    }
    static class Node { Node next; }
}`, lang: "java", title: "Ways an object becomes eligible" },
        { table: { head: ["Collector", "Notes"], rows: [
          ["Serial", "Single thread; tiny heaps, client apps"],
          ["Parallel", "Multi-threaded stop-the-world; throughput-oriented"],
          ["<b>G1</b>", "Default since Java 9; region-based, predictable pauses"],
          ["ZGC / Shenandoah", "Concurrent, sub-10ms pauses on huge heaps"]
        ] } },
        { tip: "Memory leaks are still possible in Java — objects kept reachable by mistake (static collections, listeners never removed) are never collected. GC frees <i>memory</i>, never files or sockets — those need <code>close()</code>." }
      ]
    },
    {
      id: "reference-types",
      q: "What are strong, soft, weak and phantom references?",
      topic: "Memory & References",
      level: 3,
      top: false,
      short: "A normal variable is a strong reference: the object is never collected while one exists. java.lang.ref adds three weaker kinds. Soft references are cleared only when memory is low (caches). Weak references are cleared at the next GC once no strong refs remain (canonicalising maps, listeners). Phantom references are enqueued after the object is finalized, for post-mortem cleanup, and get() always returns null.",
      a: [
        { table: { head: ["Kind", "Cleared when", "<code>get()</code>", "Use"], rows: [
          ["Strong (<code>Object o = ...</code>)", "Never while reachable", "The object", "Everything by default"],
          ["<code>SoftReference</code>", "Only when the JVM is about to run out of memory", "Object or <code>null</code>", "Memory-sensitive caches"],
          ["<code>WeakReference</code>", "At the next GC after strong refs disappear", "Object or <code>null</code>", "<code>WeakHashMap</code>, listener lists, metadata keyed by object"],
          ["<code>PhantomReference</code>", "Enqueued after finalization, before memory reuse", "Always <code>null</code>", "Cleanup of native resources (<code>Cleaner</code> uses this)"]
        ] } },
        { code: `import java.lang.ref.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Object strong = new Object();                        // never collected while 'strong' lives

        WeakReference<Object> weak = new WeakReference<>(new Object());
        System.gc();                                         // hint, but usually honoured here
        System.out.println(weak.get());                      // null: collected, nothing strong held it

        SoftReference<byte[]> cache = new SoftReference<>(new byte[1024 * 1024]);
        System.out.println(cache.get() != null);             // true: kept until memory pressure

        Map<Object, String> m = new WeakHashMap<>();        // keys held weakly
        Object key = new Object();
        m.put(key, "v");
        key = null;                                          // entry vanishes after the next GC
    }
}`, lang: "java" },
        { ul: [
          "Reachability order: strongly &gt; softly &gt; weakly &gt; phantom reachable &gt; unreachable.",
          "Pair any of them with a <code>ReferenceQueue</code> to be notified when the referent is cleared.",
          "<code>ThreadLocal</code> and <code>WeakHashMap</code> use weak references to avoid pinning keys in memory."
        ] },
        { tip: "Interview follow-up: 'Why not use a <code>WeakHashMap</code> as a cache?' — values are held strongly and keys such as <code>String</code> literals are never collected; caches want <code>SoftReference</code> values or a real library (Caffeine)." }
      ]
    },
    {
      id: "memory-leaks-java",
      q: "Can a Java program leak memory even though it has a garbage collector? Give examples.",
      topic: "Memory & References",
      level: 2,
      top: true,
      short: "Yes. The GC only frees objects that are unreachable; a leak in Java is an object that is still reachable but will never be used again. Classic causes: ever-growing static collections, listeners and callbacks never unregistered, inner classes pinning their outer instance, ThreadLocals not removed in thread pools, caches without eviction and unclosed resources holding native memory.",
      a: [
        { p: "In Java a 'leak' is a <b>logical</b> leak: something you consider dead is still on a path from a GC root. The symptom is a heap that grows until <code>OutOfMemoryError: Java heap space</code>." },
        { code: `import java.util.*;

class LeakDemo {
    static final List<byte[]> LOG = new ArrayList<>();          // 1. static collection, never trimmed
    void handle(byte[] request) { LOG.add(request); }           //    every request pinned forever

    interface Listener { void on(String e); }
    static final List<Listener> LISTENERS = new ArrayList<>();
    void register() {
        LISTENERS.add(e -> System.out.println(e + this));       // 2. lambda/inner class captures 'this'
    }                                                           //    -> the whole LeakDemo stays alive

    static final ThreadLocal<Map<String, String>> CTX = ThreadLocal.withInitial(HashMap::new);
    void work() {
        CTX.get().put("user", "asha");                          // 3. pool thread never dies,
        // CTX.remove();  <- forgotten                          //    so the map is never released
    }

    static final Map<String, Object> CACHE = new HashMap<>();    // 4. cache with no eviction
}`, lang: "java" },
        { table: { head: ["Cause", "Fix"], rows: [
          ["Static / long-lived collections that only grow", "Bound them, evict, or don't use static state"],
          ["Listeners, observers, callbacks never removed", "Unregister in <code>close()</code>; hold them via <code>WeakReference</code>"],
          ["Non-static inner / anonymous classes outliving the outer object", "Use <code>static</code> nested classes"],
          ["<code>ThreadLocal</code> in thread pools", "Always <code>remove()</code> in a <code>finally</code>"],
          ["Unbounded caches, memoisation maps", "LRU with a size limit, <code>SoftReference</code> values, Caffeine"],
          ["Unclosed streams, connections, direct buffers", "try-with-resources"],
          ["Class-loader leaks on redeploy", "Clear static references, stop threads on undeploy"]
        ] } },
        { tip: "How to find one: run with <code>-XX:+HeapDumpOnOutOfMemoryError</code>, open the dump in Eclipse MAT / VisualVM, look at the dominator tree for the biggest retained set. Knowing the tool names impresses more than the theory." }
      ]
    },

    /* ───────────── Java Specifics ───────────── */
    {
      id: "final-finally-finalize",
      q: "What is the difference between final, finally and finalize in Java?",
      topic: "Java Specifics",
      level: 1,
      top: true,
      short: "final is a modifier: a final variable can't be reassigned, a final method can't be overridden, a final class can't be extended. finally is a block after try/catch that always runs, used for cleanup. finalize() was an Object method the GC might call before reclaiming an object; it is deprecated (Java 9) and should not be used.",
      a: [
        { table: { head: ["", "final", "finally", "finalize()"], rows: [
          ["What", "Keyword / modifier", "Block in exception handling", "Method of <code>Object</code>"],
          ["Applies to", "Variables, methods, classes", "try-catch", "Objects, called by GC"],
          ["Purpose", "Restrict change / extension", "Guaranteed cleanup", "Last-chance cleanup before GC"],
          ["Status", "Widely used", "Widely used (or try-with-resources)", "Deprecated since Java 9, for removal"]
        ] } },
        { code: `final class Constants {                     // cannot be subclassed
    static final double PI = 3.14159;       // constant
}

class Base {
    final void audit() {}                   // cannot be overridden
}

class Demo {
    void read() {
        final int[] arr = {1, 2};
        arr[0] = 10;                        // OK: the array object is mutable
        // arr = new int[3];                // error: the reference is final
        try {
            System.out.println(10 / 0);
        } catch (ArithmeticException e) {
            System.out.println("caught");
        } finally {
            System.out.println("always runs"); // even after return in try
        }
    }
}`, lang: "java" },
        { warn: "When does <code>finally</code> NOT run? If <code>System.exit()</code> is called, the JVM crashes, or the thread is killed. A <code>return</code> in <code>finally</code> overrides the try's return and swallows exceptions — avoid it." },
        { tip: "A <code>final</code> reference does not make the object immutable — only the variable can't be reassigned. Blank final fields must be assigned exactly once in every constructor. <code>final</code> also lets the JIT inline methods and is required for lambda capture (effectively final)." }
      ]
    },
    {
      id: "string-immutability",
      q: "Why are Strings immutable in Java? What is the String pool?",
      topic: "Java Specifics",
      level: 2,
      top: true,
      short: "A String's content can never change after creation; 'modifying' methods return new Strings. This enables the String constant pool (literals are interned and shared safely), makes Strings thread-safe, allows caching the hashCode (great as HashMap keys) and prevents security issues with class names, paths and URLs. Use StringBuilder for repeated modification.",
      a: [
        { p: "The <b>String pool</b> (in the heap since Java 7) stores one copy of each string <b>literal</b>. <code>\"hello\"</code> written twice refers to the same object. <code>new String(\"hello\")</code> always creates a new heap object outside the pool; <code>intern()</code> returns the pooled copy." },
        { svg: `<svg viewBox="0 0 640 200" width="640" class="dg">
  <rect class="box" x="20" y="20" width="80" height="30" rx="6"/>
  <text class="tx-c" x="60" y="35" text-anchor="middle" dominant-baseline="middle">s1</text>
  <rect class="box" x="20" y="70" width="80" height="30" rx="6"/>
  <text class="tx-c" x="60" y="85" text-anchor="middle" dominant-baseline="middle">s2</text>
  <rect class="box" x="20" y="130" width="80" height="30" rx="6"/>
  <text class="tx-c" x="60" y="145" text-anchor="middle" dominant-baseline="middle">s3</text>
  <text class="tx-m" x="375" y="26" text-anchor="middle">String pool</text>
  <rect class="box-a" x="300" y="35" width="150" height="40" rx="6"/>
  <text class="tx-c" x="375" y="55" text-anchor="middle" dominant-baseline="middle">"hello"</text>
  <rect class="box" x="300" y="125" width="150" height="40" rx="6"/>
  <text class="tx-c" x="375" y="145" text-anchor="middle" dominant-baseline="middle">"hello"</text>
  <text class="tx-m" x="375" y="182" text-anchor="middle">heap, outside pool</text>
  <line class="ln-a" x1="100" y1="35" x2="298" y2="50" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="100" y1="85" x2="298" y2="62" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="100" y1="145" x2="298" y2="145" marker-end="url(#dg-arr)"/>
  <text class="tx-c" x="470" y="60">s1 == s2      true</text>
  <text class="tx-c" x="470" y="130">s1 == s3      false</text>
  <text class="tx-c" x="470" y="150">s1.equals(s3) true</text>
</svg>`, caption: "s1 = \"hello\"; s2 = \"hello\"; s3 = new String(\"hello\");" },
        { code: `public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "hello";
        String s3 = new String("hello");
        System.out.println(s1 == s2);          // true  (same pooled object)
        System.out.println(s1 == s3);          // false (different objects)
        System.out.println(s1.equals(s3));     // true  (same content)
        System.out.println(s1 == s3.intern()); // true

        String t = s1.concat(" world");        // s1 unchanged; t is new
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 3; i++) sb.append(i);   // mutable, no garbage per step
        System.out.println(sb);                // 012
    }
}`, lang: "java" },
        { h: "Why immutable?" },
        { ul: [
          "<b>Pooling</b>: sharing one object among many references is only safe if nobody can change it.",
          "<b>Security</b>: file paths, URLs, class names and DB credentials passed as Strings can't be altered after validation.",
          "<b>Thread safety</b>: immutable objects need no synchronisation.",
          "<b>Hash caching</b>: <code>hashCode()</code> is computed once and cached — fast <code>HashMap</code> keys that never 'move buckets'."
        ] },
        { table: { head: ["String", "StringBuilder", "StringBuffer"], rows: [
          ["Immutable", "Mutable", "Mutable"],
          ["Thread-safe (immutable)", "Not synchronised, fastest", "Synchronised, slower"]
        ] } },
        { tip: "How is immutability enforced? <code>String</code> is a <code>final</code> class with a <code>private final byte[] value</code> and no mutators. Follow-up: 'How many objects does <code>new String(\"hi\")</code> create?' — up to two: the literal in the pool (if not already there) and the new heap object." }
      ]
    },
    {
      id: "equals-hashcode",
      q: "What is the difference between == and equals()? What is the equals/hashCode contract?",
      topic: "Java Specifics",
      level: 2,
      top: true,
      short: "For objects, == compares references (same object?), while equals() compares logical content as defined by the class (Object's default equals is also ==). Contract: if a.equals(b) then a.hashCode() == b.hashCode(); so whenever you override equals you must override hashCode, or HashMap/HashSet will fail to find equal objects.",
      a: [
        { p: "<code>==</code> on primitives compares values; on references it checks whether both point to the <b>same object</b>. <code>equals()</code> is a method that classes override to define <b>logical equality</b> (String, Integer, collections already do)." },
        { h: "The contract (java.lang.Object)" },
        { ol: [
          "<code>equals</code> is reflexive, symmetric, transitive, consistent, and <code>x.equals(null)</code> is false.",
          "Equal objects <b>must</b> have equal hash codes.",
          "Unequal objects <i>may</i> share a hash code (collision) — allowed but hurts performance.",
          "<code>hashCode</code> must be consistent while the fields used in <code>equals</code> don't change."
        ] },
        { code: `import java.util.*;

final class Point {
    private final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }
    @Override
    public int hashCode() { return Objects.hash(x, y); }   // same fields as equals
}

public class Main {
    public static void main(String[] args) {
        Point a = new Point(1, 2), b = new Point(1, 2);
        System.out.println(a == b);        // false: different objects
        System.out.println(a.equals(b));   // true
        Set<Point> set = new HashSet<>();
        set.add(a);
        System.out.println(set.contains(b));  // true  (false if hashCode not overridden!)
    }
}`, lang: "java" },
        { p: "<b>How HashMap uses both</b>: <code>hashCode()</code> picks the bucket, then <code>equals()</code> finds the key within the bucket. Equal keys with different hash codes land in different buckets and are never compared." },
        { warn: "Override equals but not hashCode → two 'equal' keys land in different buckets, so <code>HashMap.get</code> returns null and HashSet stores duplicates. Also don't use mutable fields in hashCode for objects stored in hash collections." },
        { tip: "Integer caching trap: <code>Integer a = 127, b = 127; a == b</code> is true but for 128 it's false (cache covers -128..127). Always use <code>equals</code> for wrappers and Strings." }
      ]
    },
    {
      id: "wrapper-autoboxing",
      q: "What are wrapper classes? Explain autoboxing and unboxing and their pitfalls.",
      topic: "Java Specifics",
      level: 1,
      top: true,
      short: "Wrapper classes (Integer, Double, Boolean, Character...) are immutable objects that hold a primitive value, so primitives can be used where objects are required: collections, generics, null. Autoboxing (Java 5) converts primitive to wrapper automatically and unboxing does the reverse. Pitfalls: == on wrappers compares references (with a cache for -128..127), unboxing null throws NullPointerException, and boxing in loops is slow.",
      a: [
        { table: { head: ["Primitive", "Wrapper", "Primitive", "Wrapper"], rows: [
          ["<code>byte</code>", "<code>Byte</code>", "<code>float</code>", "<code>Float</code>"],
          ["<code>short</code>", "<code>Short</code>", "<code>double</code>", "<code>Double</code>"],
          ["<code>int</code>", "<code>Integer</code>", "<code>char</code>", "<code>Character</code>"],
          ["<code>long</code>", "<code>Long</code>", "<code>boolean</code>", "<code>Boolean</code>"]
        ] } },
        { code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Integer a = 127, b = 127;          // autoboxing = Integer.valueOf(127): cached -128..127
        Integer c = 128, d = 128;
        System.out.println(a == b);        // true  (same cached object)
        System.out.println(c == d);        // false (two objects) -> always use equals()
        System.out.println(c.equals(d));   // true

        int sum = 0;
        for (Integer i = 0; i < 1000; i++) sum += i;   // boxes/unboxes every iteration: slow

        Integer nothing = null;
        // int x = nothing;                // NullPointerException on unboxing

        List<Integer> list = new ArrayList<>(List.of(1, 2, 3));
        list.add(4);                       // boxing: generics need objects
        list.remove(1);                    // remove(int index) -> removes element at index 1!
        list.remove(Integer.valueOf(1));   // remove(Object) -> removes the value 1
        System.out.println(list);          // [3, 4]

        int n = Integer.parseInt("42");    // utility methods live on the wrapper
    }
}`, lang: "java" },
        { ul: [
          "Why wrappers exist: generics and collections work only with reference types (<code>List&lt;int&gt;</code> is illegal); they can be <code>null</code>; they carry utilities (<code>parseInt</code>, <code>MAX_VALUE</code>, <code>compare</code>).",
          "Wrappers are <b>immutable</b> and <code>final</code>; <code>Integer.valueOf</code> caches small values, <code>new Integer()</code> is deprecated.",
          "Prefer primitives in hot loops and fields; use wrappers only where an object is required."
        ] },
        { warn: "Ternary trap: <code>Integer x = flag ? 1 : null;</code> compiles, but when <code>flag</code> is true the expression type is <code>int</code>… and when false the <code>null</code> is unboxed → <code>NullPointerException</code>. Also <code>Long l = 1;</code> does not compile (int can't box to Long)." }
      ]
    },
    {
      id: "enums-in-java",
      q: "What is an enum in Java? How is it more than a list of constants?",
      topic: "Java Specifics",
      level: 2,
      top: true,
      short: "An enum is a special final class whose instances are a fixed set of named singletons created by the JVM. Unlike int constants it is type-safe, can have fields, constructors and methods, can implement interfaces, and each constant can even override methods. All enums extend java.lang.Enum, so they cannot extend another class.",
      a: [
        { code: `interface Priced { double price(); }

enum Coffee implements Priced {
    ESPRESSO(100), LATTE(150) {                        // constant-specific body
        @Override public String label() { return "Latte (with milk)"; }
    }, MOCHA(180);

    private final double base;                         // fields: one per constant
    Coffee(double base) { this.base = base; }          // constructor: implicitly private

    @Override public double price() { return base; }
    public String label() { return name().toLowerCase(); }
}

public class Main {
    public static void main(String[] args) {
        Coffee c = Coffee.valueOf("LATTE");           // by name (throws if unknown)
        System.out.println(c.ordinal() + " " + c.label() + " " + c.price());   // 1 Latte (with milk) 150.0
        for (Coffee x : Coffee.values()) System.out.println(x);               // ESPRESSO LATTE MOCHA
        switch (c) { case LATTE -> System.out.println("milky"); default -> {} }
        System.out.println(c == Coffee.LATTE);        // true: singletons, == is safe
    }
}`, lang: "java" },
        { table: { head: ["", "<code>static final int</code> constants", "<code>enum</code>"], rows: [
          ["Type safety", "Any int accepted", "Only the declared constants"],
          ["Namespace", "Prefixes by convention", "<code>Coffee.LATTE</code>"],
          ["Printable", "Prints a number", "<code>toString()</code> gives the name"],
          ["Behaviour", "None", "Fields, methods, interfaces, per-constant overrides"],
          ["Iteration", "Manual array", "<code>values()</code>, <code>EnumSet</code>, <code>EnumMap</code>"],
          ["Switch", "Yes", "Yes, with exhaustiveness checks in <code>switch</code> expressions"]
        ] } },
        { ul: [
          "Every enum implicitly extends <code>java.lang.Enum</code> and is <code>final</code> (unless it has constant-specific bodies), so it cannot <code>extends</code> anything else — but it can <code>implements</code> interfaces.",
          "Constructors are private; you cannot <code>new</code> an enum. Instances are created once during class initialisation — the JVM guarantees this even under reflection and serialization.",
          "<code>compareTo</code> uses ordinal; <code>equals</code>/<code>hashCode</code> are final and identity-based."
        ] },
        { tip: "Two interview links: an <b>enum with one constant is the safest Singleton</b> (Effective Java), and enums are the natural home for the <b>Strategy</b> pattern when the set of strategies is fixed (each constant overrides <code>apply()</code>). Never persist <code>ordinal()</code> — store <code>name()</code>." }
      ]
    },
    {
      id: "java-generics",
      q: "What are generics? What is type erasure? Explain bounded types and wildcards (PECS).",
      topic: "Java Specifics",
      level: 2,
      top: true,
      short: "Generics let you write classes and methods parameterised by type (List<T>) so the compiler enforces type safety and you avoid casts. They are implemented by type erasure: after compilation T becomes Object (or its bound) and casts are inserted, so there is one class file, no List<String>.class, no new T() and primitives need wrappers. Bounds (<T extends Comparable<T>>) restrict T; wildcards (? extends / ? super) make APIs flexible: Producer extends, Consumer super.",
      a: [
        { p: "<b>Generic programming</b> lets you write type-independent code — a <code>Stack</code> class or a <code>maxOf</code> method — and have the compiler check each use. Before Java 5, collections held <code>Object</code> and every <code>get</code> needed a cast that could fail at run time." },
        { code: `import java.util.*;

class Stack<T> {                                         // generic class
    private final List<T> items = new ArrayList<>();
    void push(T x) { items.add(x); }
    T pop() { return items.remove(items.size() - 1); }
    boolean isEmpty() { return items.isEmpty(); }
}

class Util {
    static <T extends Comparable<T>> T maxOf(T a, T b) {  // bounded type parameter
        return a.compareTo(b) < 0 ? b : a;
    }
    static double sum(List<? extends Number> nums) {      // PRODUCER: read as Number
        double s = 0;
        for (Number n : nums) s += n.doubleValue();
        return s;                                         // nums.add(1) would not compile
    }
    static void fill(List<? super Integer> out) {         // CONSUMER: write Integers
        out.add(42);                                      // works for List<Integer>, List<Number>, List<Object>
    }
}

public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();                 // Stack<int> is not allowed
        s.push(1); s.push(2);
        System.out.println(s.pop());                      // 2, no cast needed
        System.out.println(Util.maxOf("pear", "apple"));  // pear
        System.out.println(Util.sum(List.of(1, 2.5)));    // 3.5
    }
}`, lang: "java" },
        { h: "Type erasure and its consequences" },
        { table: { head: ["Because T is erased to Object…", "Example"], rows: [
          ["No runtime type information", "<code>new ArrayList&lt;String&gt;().getClass() == new ArrayList&lt;Integer&gt;().getClass()</code> is true"],
          ["Cannot instantiate T", "<code>new T()</code>, <code>new T[10]</code> are illegal — pass a <code>Class&lt;T&gt;</code> or a <code>Supplier&lt;T&gt;</code>"],
          ["Cannot use instanceof with a parameterised type", "<code>obj instanceof List&lt;String&gt;</code> is a compile error; only <code>List&lt;?&gt;</code>"],
          ["No primitives", "<code>List&lt;int&gt;</code> is illegal → boxing to <code>List&lt;Integer&gt;</code>"],
          ["Overloads can't differ only by type argument", "<code>f(List&lt;String&gt;)</code> and <code>f(List&lt;Integer&gt;)</code> clash"],
          ["Static fields are shared", "One <code>static</code> per raw class, not per <code>T</code>"],
          ["Invariance", "<code>List&lt;Integer&gt;</code> is <b>not</b> a <code>List&lt;Number&gt;</code> — hence wildcards"]
        ] } },
        { ul: [
          "<b>PECS</b> — <i>Producer Extends, Consumer Super</i>: use <code>? extends T</code> when you only read from the structure, <code>? super T</code> when you only write into it; a plain <code>T</code> when you do both.",
          "Arrays are covariant (<code>Integer[]</code> is an <code>Object[]</code>) but checked at run time (<code>ArrayStoreException</code>); generics are invariant and checked at compile time.",
          "Raw types (<code>List</code> without <code>&lt;&gt;</code>) exist only for backward compatibility and produce unchecked warnings."
        ] },
        { tip: "Why erasure instead of C++-style templates or C#-style reified generics? Backward compatibility: Java 5 generics run on old JVMs and old libraries keep working. Follow-up: the compiler emits <b>bridge methods</b> so that <code>compareTo(T)</code> still overrides <code>compareTo(Object)</code> after erasure." }
      ]
    },
    {
      id: "exception-handling-oop",
      q: "How does exception handling use OOP in Java? Checked vs unchecked, and how do you design custom exceptions?",
      topic: "Java Specifics",
      level: 2,
      top: true,
      short: "Exceptions are objects in a class hierarchy rooted at Throwable, so catch clauses match polymorphically: a catch for a superclass handles all its subclasses. Checked exceptions (extend Exception, not RuntimeException) must be declared or caught; unchecked ones (RuntimeException, Error) need not. Custom exceptions extend Exception for recoverable conditions the caller must handle, or RuntimeException for programming errors, and add fields for context.",
      a: [
        { p: "When an exception is thrown, the JVM unwinds the call stack until it finds a <code>catch</code> whose type is the exception's class <b>or a superclass</b> — that is inheritance and polymorphism at work. <code>finally</code> and try-with-resources run cleanup on the way out." },
        { svg: `<svg viewBox="0 0 620 200" width="620" class="dg">
  <rect class="box-a" x="250" y="10" width="120" height="30" rx="6"/>
  <text class="tx tx-b" x="310" y="25" text-anchor="middle" dominant-baseline="middle">Throwable</text>
  <rect class="box-r" x="90" y="70" width="120" height="30" rx="6"/>
  <text class="tx tx-b" x="150" y="85" text-anchor="middle" dominant-baseline="middle">Error</text>
  <rect class="box" x="410" y="70" width="120" height="30" rx="6"/>
  <text class="tx tx-b" x="470" y="85" text-anchor="middle" dominant-baseline="middle">Exception</text>
  <rect class="box-p" x="330" y="140" width="130" height="30" rx="6"/>
  <text class="tx tx-b" x="395" y="155" text-anchor="middle" dominant-baseline="middle">RuntimeException</text>
  <rect class="box-g" x="480" y="140" width="130" height="30" rx="6"/>
  <text class="tx tx-b" x="545" y="155" text-anchor="middle" dominant-baseline="middle">IOException, SQLException</text>
  <line class="ln" x1="150" y1="70" x2="270" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="470" y1="70" x2="350" y2="42" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="395" y1="140" x2="450" y2="102" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="545" y1="140" x2="490" y2="102" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="150" y="120" text-anchor="middle">unchecked: OutOfMemoryError,</text>
  <text class="tx-m" x="150" y="136" text-anchor="middle">StackOverflowError</text>
  <text class="tx-m" x="395" y="190" text-anchor="middle">unchecked: NPE, IllegalArgument</text>
  <text class="tx-m" x="545" y="190" text-anchor="middle">checked: must declare or catch</text>
</svg>`, caption: "Everything under RuntimeException and Error is unchecked; every other Exception subclass is checked." },
        { code: `class InsufficientFundsException extends Exception {    // checked: caller must deal with it
    private final double shortBy;                            // extra context
    InsufficientFundsException(double shortBy) {
        super("insufficient funds, short by " + shortBy);
        this.shortBy = shortBy;
    }
    double getShortBy() { return shortBy; }
}

class Account {
    private double balance = 100;
    void withdraw(double amt) throws InsufficientFundsException {
        if (amt <= 0) throw new IllegalArgumentException("amount must be positive");  // unchecked
        if (amt > balance) throw new InsufficientFundsException(amt - balance);
        balance -= amt;
    }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account();
        try {
            acc.withdraw(150);
        } catch (InsufficientFundsException e) {             // most specific first
            System.out.println(e.getMessage() + " / " + e.getShortBy());
        } catch (RuntimeException e) {                       // base type catches all subclasses
            System.out.println("bug: " + e);
        } finally {
            System.out.println("audit logged");              // always
        }
    }
}`, lang: "java" },
        { table: { head: ["", "Checked", "Unchecked"], rows: [
          ["Extends", "<code>Exception</code> (but not <code>RuntimeException</code>)", "<code>RuntimeException</code> or <code>Error</code>"],
          ["Compiler", "Must be caught or declared with <code>throws</code>", "No requirement"],
          ["Represents", "Recoverable, expected failures: file missing, network down", "Programming errors (NPE, bad argument) or JVM failures"],
          ["Examples", "<code>IOException</code>, <code>SQLException</code>, <code>ParseException</code>", "<code>NullPointerException</code>, <code>IllegalStateException</code>, <code>OutOfMemoryError</code>"]
        ] } },
        { ul: [
          "Catch order matters: a superclass catch before a subclass catch is a <b>compile error</b> ('exception has already been caught').",
          "Overriding methods may throw narrower checked exceptions, never broader ones.",
          "Multi-catch <code>catch (IOException | SQLException e)</code> for unrelated types; wrap and rethrow with a cause to keep the stack trace: <code>throw new ServiceException(\"...\", e)</code>."
        ] },
        { tip: "Design rule from Effective Java: checked for conditions the caller can reasonably recover from, unchecked for programming errors. Modern frameworks (Spring, streams) lean towards unchecked to avoid <code>throws</code> clutter — mention the trade-off." }
      ]
    },
    {
      id: "interface-default-methods",
      q: "What are default and static methods in Java interfaces? Why were they added?",
      topic: "Java Specifics",
      level: 2,
      top: false,
      short: "Since Java 8 an interface can have default methods (with a body, inherited by implementers, overridable) and static methods (called via the interface name, not inherited). They were added so interfaces like Collection could gain new methods (stream(), forEach) without breaking every existing implementation. Java 9 added private interface methods for shared helper code.",
      a: [
        { p: "Before Java 8, adding a method to a published interface broke every class implementing it. <b>Default methods</b> provide a fallback implementation so old classes keep compiling — this is how <code>List.sort</code> and <code>Iterable.forEach</code> were added." },
        { code: `interface Vehicle {
    String name();                                   // abstract

    default String describe() {                      // default: inherited, overridable
        return name() + " with " + wheels() + " wheels";
    }
    private int wheels() { return 4; }               // Java 9: private helper

    static Vehicle of(String n) { return () -> n; }  // static: Vehicle.of(...)
}

class Car implements Vehicle {
    public String name() { return "Car"; }
    // describe() inherited automatically
}

// Vehicle.of("Bike").describe();   // "Bike with 4 wheels"
// new Car().of("x");               // error: static interface methods are not inherited`, lang: "java" },
        { ul: [
          "Default methods cannot override <code>equals</code>, <code>hashCode</code> or <code>toString</code> of <code>Object</code>.",
          "Diamond conflict between two defaults → implementing class must override (use <code>A.super.m()</code>).",
          "Interfaces still cannot have instance fields or constructors, so the abstract class vs interface distinction remains about <b>state</b>.",
          "An interface with exactly one abstract method is a <b>functional interface</b> usable with lambdas."
        ] },
        { tip: "Follow-up: 'Now that interfaces have default methods, why still use abstract classes?' — fields, constructors, non-public members, and the ability to hold state across the template methods." }
      ]
    },
    {
      id: "method-hiding-java",
      q: "What is method hiding? Can we override static or private methods?",
      topic: "Java Specifics",
      level: 2,
      top: false,
      short: "If a subclass declares a static method with the same signature as a static method in the parent, it hides it rather than overriding: which one runs depends on the reference's compile-time type, not the object. Private methods are not inherited, so a same-named subclass method is unrelated. Neither can be overridden.",
      a: [
        { p: "Overriding requires dynamic dispatch on an instance. Static methods belong to the class and are bound at compile time, so redeclaring one in a subclass only <b>hides</b> the parent's version." },
        { code: `class Parent {
    static void greet()   { System.out.println("Parent static"); }
    void show()           { System.out.println("Parent instance"); }
    private void secret() { System.out.println("Parent secret"); }
    void reveal()         { secret(); }                              // always Parent.secret
}
class Child extends Parent {
    static void greet()   { System.out.println("Child static"); }   // hides
    @Override void show() { System.out.println("Child instance"); } // overrides
    private void secret() { System.out.println("Child secret"); }   // new method, not an override
    // @Override static void greet() {}   // compile error: static methods cannot be annotated @Override
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        p.greet();    // "Parent static"   - reference type decides (hiding)
        p.show();     // "Child instance"  - object type decides (overriding)
        p.reveal();   // "Parent secret"   - private: no dispatch
    }
}`, lang: "java" },
        { table: { head: ["", "Overriding", "Hiding"], rows: [
          ["Applies to", "Instance methods", "Static methods (and fields)"],
          ["Resolved by", "Runtime object type", "Compile-time reference type"],
          ["<code>@Override</code>", "Allowed", "Compile error"],
          ["Access rule", "Same or wider", "Same or wider (still enforced)"]
        ] } },
        { ul: [
          "A static method cannot hide an instance method, and an instance method cannot 'override' a static one — both are compile errors.",
          "Fields are also hidden, never overridden: <code>p.name</code> uses the reference type.",
          "Adding <code>@Override</code> to a static method is a compile error — a quick way to prove it's not overriding."
        ] }
      ]
    },
    {
      id: "marker-functional-interfaces",
      q: "What are marker interfaces and functional interfaces?",
      topic: "Java Specifics",
      level: 2,
      top: false,
      short: "A marker interface has no methods; implementing it tags the class so the JVM or library can check it with instanceof (Serializable, Cloneable, RandomAccess). A functional interface has exactly one abstract method (default and static methods don't count), so a lambda or method reference can implement it (Runnable, Comparator, Function); @FunctionalInterface asks the compiler to enforce that.",
      a: [
        { code: `import java.io.Serializable;
import java.util.*;
import java.util.function.*;

class Token implements Serializable, Cloneable { }   // markers: no methods to implement

@FunctionalInterface
interface Validator<T> {
    boolean validate(T t);                              // exactly one abstract method
    default Validator<T> and(Validator<T> o) {          // defaults allowed
        return t -> validate(t) && o.validate(t);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Token() instanceof Serializable);   // true: the tag is checked at run time

        Validator<String> notEmpty = s -> !s.isEmpty();            // lambda implements the interface
        Validator<String> shortStr = s -> s.length() < 5;
        System.out.println(notEmpty.and(shortStr).validate("abc")); // true

        Comparator<String> byLen = Comparator.comparingInt(String::length);   // built-in functional interfaces
        Function<Integer, Integer> square = x -> x * x;
        Supplier<List<String>> newList = ArrayList::new;                      // method reference
        Runnable r = () -> System.out.println("run");
    }
}`, lang: "java" },
        { table: { head: ["", "Marker interface", "Functional interface"], rows: [
          ["Methods", "None", "Exactly one abstract (plus any defaults/statics)"],
          ["Purpose", "Metadata / capability tag checked with <code>instanceof</code>", "Target type for lambdas and method references"],
          ["Examples", "<code>Serializable</code>, <code>Cloneable</code>, <code>RandomAccess</code>", "<code>Runnable</code>, <code>Callable</code>, <code>Comparator</code>, <code>Function</code>, <code>Predicate</code>"],
          ["Modern alternative", "Annotations (<code>@Entity</code>) — but they aren't types, so no <code>instanceof</code> or generics bound", "—"]
        ] } },
        { ul: [
          "A functional interface may also declare <code>Object</code>'s methods abstractly (<code>Comparator</code> declares <code>equals</code>) — they don't count.",
          "<code>@FunctionalInterface</code> is optional; it only makes the compiler reject a second abstract method.",
          "Lambdas are compiled with <code>invokedynamic</code>, not as anonymous classes — no extra <code>.class</code> files."
        ] },
        { tip: "Why is <code>Serializable</code> a marker rather than an annotation? Historical (1997), but also because <code>ObjectOutputStream</code> can do <code>instanceof Serializable</code> and generic bounds like <code>&lt;T extends Serializable&gt;</code> work." }
      ]
    },
    {
      id: "records-sealed-classes",
      q: "What are records and sealed classes? How do they relate to OOP?",
      topic: "Java Specifics",
      level: 2,
      top: false,
      short: "A record (Java 16) is a concise final class for immutable data: you declare the components and the compiler generates the private final fields, canonical constructor, accessors, equals, hashCode and toString. A sealed class or interface (Java 17) restricts which classes may extend it with permits, giving a closed hierarchy the compiler can check exhaustively in pattern-matching switch.",
      a: [
        { code: `record Point(int x, int y) {                     // final class, private final fields,
    Point {                                      // canonical ctor + equals/hashCode/toString
        if (x < 0 || y < 0) throw new IllegalArgumentException("negative");   // compact constructor
    }
    double dist() { return Math.sqrt(x * x + y * y); }      // extra methods are fine
    static Point origin() { return new Point(0, 0); }       // static members are fine
}

sealed interface Shape permits Circle, Square { }          // closed hierarchy
record Circle(double r) implements Shape { }
record Square(double s) implements Shape { }

public class Main {
    static double area(Shape s) {
        return switch (s) {                                 // Java 21: exhaustive, no default needed
            case Circle c -> Math.PI * c.r() * c.r();       // accessor is r(), not getR()
            case Square q -> q.s() * q.s();
        };
    }
    public static void main(String[] args) {
        Point p = new Point(3, 4);
        System.out.println(p + " " + p.dist());             // Point[x=3, y=4] 5.0
        System.out.println(p.equals(new Point(3, 4)));      // true: value-based
        System.out.println(area(new Circle(1)));            // 3.14159...
    }
}`, lang: "java" },
        { table: { head: ["", "Record", "Ordinary class"], rows: [
          ["Fields", "Implicit <code>private final</code>, from the header", "Anything"],
          ["Mutability", "Shallowly immutable — no setters, no instance fields beyond components", "Your choice"],
          ["Inheritance", "Implicitly <code>final</code>; extends <code>Record</code>, so cannot extend a class; may implement interfaces", "Free"],
          ["equals / hashCode / toString", "Generated from all components", "Hand-written"],
          ["Accessors", "<code>x()</code> not <code>getX()</code>", "Convention"],
          ["Use for", "DTOs, value objects, map keys, tuples", "Entities with identity and behaviour"]
        ] } },
        { ul: [
          "<b>Sealed</b>: <code>permits</code> lists the allowed subclasses, which must be <code>final</code>, <code>sealed</code> or <code>non-sealed</code>, and live in the same module/package.",
          "Sealed types + records = <b>algebraic data types</b>; the compiler knows every case, so a <code>switch</code> without <code>default</code> is safe and adding a case becomes a compile error everywhere it matters.",
          "This is a deliberate alternative to the Visitor pattern and to 'open' polymorphism for <i>closed</i> sets of types."
        ] },
        { tip: "Interview angle: records enforce the immutable-class recipe by construction (but still need defensive copies for mutable components), and sealed classes give you the exhaustiveness of enums with per-case data. Both are heavily asked at companies on Java 17+." }
      ]
    },

    /* ───────────── Design Principles & Patterns ───────────── */
    {
      id: "dry-kiss-yagni",
      q: "What are the DRY, KISS and YAGNI principles?",
      topic: "Design Principles & Patterns",
      level: 1,
      top: true,
      short: "DRY (Don't Repeat Yourself): every piece of knowledge should have a single authoritative place in the code. KISS (Keep It Simple, Stupid): prefer the simplest design that works. YAGNI (You Aren't Gonna Need It): don't build features or abstractions until they are actually required.",
      a: [
        { table: { head: ["Principle", "Meaning", "Violation", "Fix"], rows: [
          ["<b>DRY</b>", "One source of truth for each rule/logic", "Same GST calculation copy-pasted in 5 places", "Extract a method / class / constant"],
          ["<b>KISS</b>", "Simplest solution that meets the requirement", "Abstract factory + reflection to create one object", "A plain constructor call"],
          ["<b>YAGNI</b>", "Implement only what is needed now", "Plugin system 'in case we need it later'", "Build it when a real requirement appears"]
        ] } },
        { code: `class Billing {
    // Violates DRY: discount rule duplicated
    double cartTotal(double amt)    { return amt > 1000 ? amt * 0.9 : amt; }
    double invoiceTotal(double amt) { return amt > 1000 ? amt * 0.9 : amt; }

    // DRY: single place to change the rule
    private static final double DISCOUNT_THRESHOLD = 1000, DISCOUNT_RATE = 0.10;
    double applyDiscount(double amt) {
        return amt > DISCOUNT_THRESHOLD ? amt * (1 - DISCOUNT_RATE) : amt;
    }
}`, lang: "java" },
        { warn: "DRY is about duplicated <b>knowledge</b>, not identical-looking code. Two methods that look alike today but change for different reasons should stay separate — merging them couples unrelated features (the 'wrong abstraction')." },
        { tip: "These principles balance each other: aggressive DRY can violate KISS/YAGNI by creating premature abstractions. Mention 'rule of three' — abstract after the third repetition." }
      ]
    },
    {
      id: "solid-principles",
      q: "Explain the SOLID principles with examples.",
      topic: "Design Principles & Patterns",
      level: 2,
      top: true,
      short: "S: Single Responsibility — a class has one reason to change. O: Open/Closed — open for extension, closed for modification. L: Liskov Substitution — subtypes must be usable wherever the base is expected. I: Interface Segregation — many small client-specific interfaces over one fat one. D: Dependency Inversion — depend on abstractions, not concrete classes.",
      a: [
        { table: { head: ["Letter", "Principle", "One-liner"], rows: [
          ["S", "Single Responsibility", "A class should have only one reason to change"],
          ["O", "Open / Closed", "Add behaviour by adding code, not editing tested code"],
          ["L", "Liskov Substitution", "A subclass must honour the superclass's contract"],
          ["I", "Interface Segregation", "Clients shouldn't depend on methods they don't use"],
          ["D", "Dependency Inversion", "High-level modules depend on abstractions; details implement them"]
        ] } },
        { h: "S — Single Responsibility" },
        { code: `// Bad: Invoice calculates, prints and saves (3 reasons to change)
// Good:
class Invoice        { double total() { /* ... */ return 0; } }
class InvoicePrinter { void print(Invoice inv) { /* ... */ } }
class InvoiceRepo    { void save(Invoice inv)  { /* ... */ } }`, lang: "java" },
        { h: "O — Open/Closed" },
        { code: `interface Discount { double apply(double amt); }
class Festive implements Discount { public double apply(double a) { return a * 0.8; } }
class Student implements Discount { public double apply(double a) { return a * 0.9; } }
// New discount = new class. Checkout never changes, no if/else on type.
class Checkout { double total(double amt, Discount d) { return d.apply(amt); } }`, lang: "java" },
        { h: "L — Liskov Substitution" },
        { code: `// Classic violation: Square IS-A Rectangle mathematically, but...
class Rectangle {
    protected int w, h;
    void setW(int w) { this.w = w; }
    void setH(int h) { this.h = h; }
    int area() { return w * h; }
}
class Square extends Rectangle {
    @Override void setW(int w) { this.w = this.h = w; }   // changes both!
    @Override void setH(int h) { this.w = this.h = h; }
}
// void f(Rectangle r) { r.setW(5); r.setH(4); assert r.area() == 20; }  // fails for Square
// Fix: don't derive Square from Rectangle; make both immutable implementations of Shape.`, lang: "java" },
        { h: "I — Interface Segregation" },
        { code: `// Bad: interface Worker { void work(); void eat(); }   -> Robot can't eat
interface Workable { void work(); }
interface Eatable  { void eat();  }
class Human implements Workable, Eatable { public void work() {} public void eat() {} }
class Robot implements Workable          { public void work() {} }`, lang: "java" },
        { h: "D — Dependency Inversion" },
        { code: `interface MessageSender { void send(String msg); }
class EmailSender implements MessageSender { public void send(String m) { /* SMTP */ } }
class SmsSender   implements MessageSender { public void send(String m) { /* SMS  */ } }

class OrderService {                                   // high-level: knows only the abstraction
    private final MessageSender sender;
    OrderService(MessageSender s) { this.sender = s; } // injected (Spring's @Autowired does this)
    void place() { /* ... */ sender.send("Order placed"); }
}`, lang: "java" },
        { tip: "Tie each to a benefit: SRP → cohesion, OCP → fewer regressions, LSP → safe polymorphism, ISP/DIP → low coupling and easy mocking in unit tests. Many patterns (Strategy, Observer, Factory) are SOLID in action, and Spring's DI container exists to make DIP the default." }
      ]
    },
    {
      id: "singleton-pattern",
      q: "What is the Singleton pattern? Write a thread-safe Singleton in Java.",
      topic: "Design Principles & Patterns",
      level: 2,
      top: true,
      short: "Singleton ensures a class has exactly one instance and provides a global access point to it: private constructor, a static instance and a static getInstance(). Thread-safe options in Java: eager static initialisation, the holder (Bill Pugh) idiom for lazy init without locking, double-checked locking with a volatile field, or an enum, which is also safe against reflection and serialization.",
      a: [
        { p: "Used for truly single resources: configuration, logger, connection pool, cache. Ingredients: <b>private constructor</b>, <b>static instance</b>, <b>static accessor</b> returning the one instance." },
        { svg: `<svg viewBox="0 0 560 185" width="560" class="dg">
  <rect class="box-a" x="190" y="20" width="180" height="36" rx="6"/>
  <text class="tx tx-b" x="280" y="38" text-anchor="middle" dominant-baseline="middle">Singleton</text>
  <rect class="box" x="190" y="56" width="180" height="30" rx="6"/>
  <text class="tx-c" x="280" y="71" text-anchor="middle" dominant-baseline="middle">- static instance</text>
  <rect class="box" x="190" y="86" width="180" height="50" rx="6"/>
  <text class="tx-c" x="280" y="102" text-anchor="middle" dominant-baseline="middle">- Singleton()</text>
  <text class="tx-c" x="280" y="122" text-anchor="middle" dominant-baseline="middle">+ getInstance()</text>
  <rect class="box" x="20" y="30" width="100" height="30" rx="6"/>
  <text class="tx" x="70" y="45" text-anchor="middle" dominant-baseline="middle">Client A</text>
  <rect class="box" x="20" y="100" width="100" height="30" rx="6"/>
  <text class="tx" x="70" y="115" text-anchor="middle" dominant-baseline="middle">Client B</text>
  <rect class="box" x="440" y="65" width="100" height="30" rx="6"/>
  <text class="tx" x="490" y="80" text-anchor="middle" dominant-baseline="middle">Client C</text>
  <line class="ln-a" x1="120" y1="45" x2="188" y2="100" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="120" y1="115" x2="188" y2="120" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="440" y1="80" x2="372" y2="110" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="280" y="165" text-anchor="middle">every getInstance() call returns the same object</text>
</svg>`, caption: "Singleton structure: private constructor, one static instance, global accessor." },
        { code: `// 1) Eager: simplest; thread-safe because class init is guarded by the JVM
final class AppConfig {
    private static final AppConfig INSTANCE = new AppConfig();
    private AppConfig() {}
    static AppConfig getInstance() { return INSTANCE; }
}

// 2) Bill Pugh / holder idiom: LAZY + thread-safe, no locking
public final class Logger {
    private Logger() {}
    private static class Holder {
        static final Logger INSTANCE = new Logger();  // Holder loaded on first getInstance()
    }
    public static Logger getInstance() { return Holder.INSTANCE; }
}

// 3) Double-checked locking (volatile is essential)
final class Config {
    private static volatile Config instance;
    private Config() {}
    static Config getInstance() {
        if (instance == null) {                    // 1st check, no lock
            synchronized (Config.class) {
                if (instance == null)              // 2nd check, with lock
                    instance = new Config();
            }
        }
        return instance;
    }
}

// 4) Enum: also safe against reflection and serialization
enum Registry { INSTANCE; void register(String s) { /* ... */ } }`, lang: "java", title: "Four thread-safe Singletons" },
        { table: { head: ["Variant", "Lazy", "Locking", "Reflection/serialization safe"], rows: [
          ["Eager static field", "No", "None", "No (needs <code>readResolve</code>, ctor guard)"],
          ["Holder idiom", "Yes", "None (JVM class-init lock)", "No"],
          ["Double-checked locking", "Yes", "Once, on first call", "No"],
          ["Enum", "Class-load time", "None", "<b>Yes</b> — recommended by Effective Java"]
        ] } },
        { warn: "Without <code>volatile</code>, double-checked locking is broken: another thread may see a non-null reference to a partially constructed object due to instruction reordering. Also, a naive <code>synchronized getInstance()</code> works but locks on every call." },
        { tip: "Criticisms to mention: global mutable state, hidden dependencies, hard to unit test (can't mock). Prefer dependency injection of a single instance — Spring beans are singletons <i>per container</i>, not per JVM." }
      ]
    },
    {
      id: "factory-pattern",
      q: "What is the Factory pattern? When would you use it?",
      topic: "Design Principles & Patterns",
      level: 2,
      top: true,
      short: "A creational pattern that moves object creation into a factory method or class, so client code asks for an object by type/parameters and receives it through an interface without knowing the concrete class. Use it when the exact type is decided at run time or creation logic is complex, to keep clients decoupled (OCP, DIP).",
      a: [
        { p: "Instead of scattering <code>new ConcreteX()</code> across the code, a <b>factory</b> centralises the decision of which concrete class to instantiate. Variants: <b>Simple Factory</b> (one static method with a switch), <b>Factory Method</b> (subclasses decide which product to create), <b>Abstract Factory</b> (creates families of related products, e.g. Windows vs Mac widgets)." },
        { code: `import java.util.*;
import java.util.function.Supplier;

interface Notification { void send(String msg); }
class Email implements Notification { public void send(String m) { /* SMTP */ } }
class Sms   implements Notification { public void send(String m) { /* SMS gateway */ } }
class Push  implements Notification { public void send(String m) { /* FCM */ } }

class NotificationFactory {
    static Notification create(String type) {                 // simple factory
        switch (type) {
            case "email": return new Email();
            case "sms":   return new Sms();
            case "push":  return new Push();
            default: throw new IllegalArgumentException("unknown type: " + type);
        }
    }

    // Open/Closed variant: register new types without editing the factory
    private static final Map<String, Supplier<Notification>> REGISTRY = new HashMap<>();
    static void register(String type, Supplier<Notification> s) { REGISTRY.put(type, s); }
    static Notification make(String type) { return REGISTRY.get(type).get(); }
}

public class Main {
    public static void main(String[] args) {
        Notification n = NotificationFactory.create("sms");   // client knows only the interface
        n.send("OTP 4821");
    }
}`, lang: "java", title: "Simple factory (+ registry variant)" },
        { ul: [
          "Pros: clients depend on the interface only; creation logic in one place; easy to add pooling/caching.",
          "Cons: a simple factory's switch must be edited for every new type (use the registration map to stay open/closed).",
          "JDK examples: <code>Integer.valueOf()</code>, <code>List.of()</code>, <code>Calendar.getInstance()</code>, <code>DriverManager.getConnection()</code>, <code>Executors.newFixedThreadPool()</code>."
        ] },
        { tip: "Factory Method proper: an abstract <code>createProduct()</code> in a base class, overridden by subclasses — e.g. <code>Collection.iterator()</code>. Abstract Factory: an interface with several such methods (<code>createButton()</code>, <code>createMenu()</code>) per theme." }
      ]
    },
    {
      id: "observer-pattern",
      q: "Explain the Observer pattern with an example.",
      topic: "Design Principles & Patterns",
      level: 2,
      top: true,
      short: "Observer (publish–subscribe) defines a one-to-many dependency: a Subject keeps a list of Observers and notifies all of them when its state changes, without knowing their concrete types. Used in event systems, GUI listeners, MVC, stock tickers and notification services.",
      a: [
        { p: "A behavioural pattern that decouples the source of events from the code that reacts to them. Observers register (<code>attach</code>) with a subject; on change the subject calls <code>update()</code> on each." },
        { svg: `<svg viewBox="0 0 620 210" width="620" class="dg">
  <rect class="box-a" x="20" y="40" width="170" height="36" rx="6"/>
  <text class="tx tx-b" x="105" y="58" text-anchor="middle" dominant-baseline="middle">Subject</text>
  <rect class="box" x="20" y="76" width="170" height="66" rx="6"/>
  <text class="tx-c" x="105" y="92" text-anchor="middle" dominant-baseline="middle">+ attach(o)</text>
  <text class="tx-c" x="105" y="110" text-anchor="middle" dominant-baseline="middle">+ detach(o)</text>
  <text class="tx-c" x="105" y="128" text-anchor="middle" dominant-baseline="middle">+ notifyObservers()</text>
  <rect class="box-p" x="380" y="40" width="200" height="36" rx="6"/>
  <text class="tx tx-b" x="480" y="58" text-anchor="middle" dominant-baseline="middle">Observer (interface)</text>
  <rect class="box" x="380" y="76" width="200" height="30" rx="6"/>
  <text class="tx-c" x="480" y="91" text-anchor="middle" dominant-baseline="middle">+ update(price)</text>
  <line class="ln-a" x1="190" y1="58" x2="378" y2="58" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="285" y="50" text-anchor="middle">observers 0..*</text>
  <rect class="box" x="340" y="160" width="120" height="34" rx="6"/>
  <text class="tx" x="400" y="177" text-anchor="middle" dominant-baseline="middle">EmailAlert</text>
  <rect class="box" x="490" y="160" width="120" height="34" rx="6"/>
  <text class="tx" x="550" y="177" text-anchor="middle" dominant-baseline="middle">MobileApp</text>
  <line class="ln ln-d" x1="400" y1="160" x2="450" y2="108" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="550" y1="160" x2="510" y2="108" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="105" y="165" text-anchor="middle">notifyObservers(): for each o,</text>
  <text class="tx-m" x="105" y="181" text-anchor="middle">o.update(price)</text>
</svg>`, caption: "Subject holds a list of Observer interfaces; concrete observers implement update()." },
        { code: `import java.util.*;

interface Observer { void update(double price); }

class Stock {                                              // Subject
    private final List<Observer> observers = new ArrayList<>();
    private double price;

    void attach(Observer o) { observers.add(o); }
    void detach(Observer o) { observers.remove(o); }
    void setPrice(double p) { price = p; notifyObservers(); }
    private void notifyObservers() {
        for (Observer o : new ArrayList<>(observers)) o.update(price);   // copy: safe if one detaches mid-loop
    }
}

class EmailAlert implements Observer {
    public void update(double p) { System.out.println("Email: price " + p); }
}
class MobileApp implements Observer {
    public void update(double p) { System.out.println("Push: price " + p); }
}

public class Main {
    public static void main(String[] args) {
        Stock infy = new Stock();
        EmailAlert e = new EmailAlert(); MobileApp m = new MobileApp();
        infy.attach(e); infy.attach(m);
        infy.attach(p -> System.out.println("Lambda: " + p));   // functional interface: lambda works too
        infy.setPrice(1520.5);                              // all three notified
        infy.detach(e);
        infy.setPrice(1531.0);                              // MobileApp + lambda
    }
}`, lang: "java" },
        { warn: "Pitfalls: the <b>lapsed listener</b> leak (observers never detached stay reachable forever — use <code>WeakReference</code> or unsubscribe in <code>close()</code>); <code>ConcurrentModificationException</code> if an observer detaches during notification (iterate a copy or use <code>CopyOnWriteArrayList</code>); slow or throwing observers block the subject." },
        { tip: "Push vs pull model: pass the new data in <code>update()</code> (push) or let observers query the subject (pull). JDK examples: <code>PropertyChangeListener</code>, Swing/Android listeners, <code>java.util.concurrent.Flow</code> (reactive streams). <code>java.util.Observable</code> is deprecated — don't cite it." }
      ]
    },
    {
      id: "strategy-pattern",
      q: "What is the Strategy pattern? How is it different from using if-else?",
      topic: "Design Principles & Patterns",
      level: 2,
      top: true,
      short: "Strategy encapsulates a family of interchangeable algorithms behind a common interface and lets the client (context) choose or swap one at run time. It replaces growing if-else/switch chains on type with polymorphism, so new algorithms are added as new classes without touching the context (Open/Closed).",
      a: [
        { p: "The <b>Context</b> holds a reference to a <b>Strategy</b> interface and delegates the varying behaviour to it. Examples: payment methods, sorting/compression algorithms, route calculation (car/bike/walk), pricing rules." },
        { code: `interface PaymentStrategy { void pay(double amount); }
class UpiPayment  implements PaymentStrategy { public void pay(double a) { System.out.println("UPI "  + a); } }
class CardPayment implements PaymentStrategy { public void pay(double a) { System.out.println("Card " + a); } }

class Checkout {                                           // Context
    private PaymentStrategy strategy;
    void setStrategy(PaymentStrategy s) { strategy = s; }
    void pay(double amount) { strategy.pay(amount); }      // delegate
}

public class Main {
    public static void main(String[] args) {
        Checkout c = new Checkout();
        c.setStrategy(new UpiPayment());
        c.pay(499);
        c.setStrategy(new CardPayment());                  // swap at run time
        c.pay(1299);
        c.setStrategy(a -> System.out.println("Wallet " + a));   // lambda: one-method strategy
        c.pay(99);
    }
}`, lang: "java" },
        { table: { head: ["if-else / switch", "Strategy"], rows: [
          ["Every new option edits the same method", "New option = new class (OCP)"],
          ["All algorithms compiled into one place", "Each algorithm isolated and unit-testable"],
          ["Fixed at compile time", "Swappable at run time"],
          ["Fine for 2–3 stable cases", "Better when options grow or vary independently"]
        ] } },
        { tip: "In modern Java a strategy is often just a functional interface + lambda: <code>Collections.sort(list, comparator)</code> and <code>Comparator</code> <i>are</i> the Strategy pattern. If the set of strategies is fixed, an <code>enum</code> with an abstract method is a tidy alternative." }
      ]
    },
    {
      id: "builder-pattern",
      q: "What is the Builder pattern?",
      topic: "Design Principles & Patterns",
      level: 2,
      top: false,
      short: "Builder constructs a complex object step by step through a separate builder object with chained setter-like methods and a final build(), instead of a constructor with many (often optional) parameters. It avoids telescoping constructors, makes calls readable and lets the product be immutable and validated once.",
      a: [
        { p: "Problem: <code>Pizza(size, cheese, pepperoni, olives, mushrooms, extraSauce)</code> — long, error-prone parameter lists (the <b>telescoping constructor</b> anti-pattern), and Java has no named or default arguments. The Builder collects parameters by name and creates the object in one validated step." },
        { code: `public final class User {
    private final String name;          // required
    private final int age;              // optional
    private final String phone;         // optional

    private User(Builder b) { name = b.name; age = b.age; phone = b.phone; }   // only the builder may call

    public static class Builder {                                 // static nested class
        private final String name;
        private int age;
        private String phone = "";
        public Builder(String name) { this.name = name; }        // required params in the ctor
        public Builder age(int a)      { this.age = a; return this; }     // return this: chaining
        public Builder phone(String p) { this.phone = p; return this; }
        public User build() {
            if (age < 0) throw new IllegalStateException("age");  // validate once, here
            return new User(this);
        }
    }
}

// User u = new User.Builder("Asha").age(22).phone("98xxxx").build();`, lang: "java" },
        { ul: [
          "The product stays <b>immutable</b> (all fields final, no setters) while still being configurable.",
          "Optional parameters get sensible defaults; required ones go in the builder's constructor.",
          "Pairs well with records for the product and with <code>toBuilder()</code> for 'copy with changes'."
        ] },
        { tip: "Real examples: <code>StringBuilder</code>, <code>HttpRequest.newBuilder()</code>, <code>Stream.builder()</code>, Lombok <code>@Builder</code>. Contrast with Factory: Factory decides <i>which</i> class to create in one call; Builder controls <i>how</i> one complex object is assembled." }
      ]
    },
    {
      id: "adapter-pattern",
      q: "What is the Adapter pattern?",
      topic: "Design Principles & Patterns",
      level: 2,
      top: false,
      short: "Adapter is a structural pattern that converts the interface of an existing class into the interface a client expects, letting incompatible classes work together without modifying them — like a travel plug adapter. In Java it is usually an object adapter: a class that implements the target interface and wraps (composes) the adaptee.",
      a: [
        { p: "Typical use: integrating a third-party or legacy class whose method names/types don't match your interface." },
        { code: `// Target interface our app uses
interface PaymentGateway { boolean charge(double rupees); }

// Third-party class we cannot change (expects paise, different method name)
class LegacyPayApi {
    int makePayment(long paise, String currency) {
        System.out.println("paid " + paise + " " + currency);
        return 0;                                          // 0 = success
    }
}

// Object adapter: implements Target, wraps Adaptee
class LegacyPayAdapter implements PaymentGateway {
    private final LegacyPayApi api = new LegacyPayApi();
    @Override public boolean charge(double rupees) {
        return api.makePayment(Math.round(rupees * 100), "INR") == 0;
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentGateway g = new LegacyPayAdapter();         // client sees only Target
        g.charge(249.50);                                  // paid 24950 INR
    }
}`, lang: "java" },
        { table: { head: ["Object adapter", "Class adapter"], rows: [
          ["Implements target, <b>holds</b> the adaptee", "Implements target, <b>extends</b> the adaptee"],
          ["Works with any subclass of the adaptee; can adapt several", "Limited by single inheritance; can override adaptee methods"],
          ["The Java default", "Rare in Java"]
        ] } },
        { tip: "JDK examples: <code>Arrays.asList()</code> (array → List), <code>InputStreamReader</code> (byte stream → char reader), <code>Collections.enumeration()</code>. Difference from Decorator: Adapter <i>changes</i> the interface; Decorator keeps it and adds behaviour." }
      ]
    },
    {
      id: "decorator-pattern",
      q: "What is the Decorator pattern? How does it differ from inheritance?",
      topic: "Design Principles & Patterns",
      level: 2,
      top: false,
      short: "Decorator attaches extra responsibilities to an object dynamically by wrapping it in another object that implements the same interface and forwards calls, adding behaviour before or after. Decorators can be stacked at run time, avoiding a subclass for every combination of features.",
      a: [
        { p: "Each decorator <b>is-a</b> Component (same interface) and <b>has-a</b> Component (the wrapped object). Clients can't tell the difference, so wrappers compose freely." },
        { code: `interface Coffee { double cost(); String desc(); }
class Espresso implements Coffee {
    public double cost() { return 100; }
    public String desc() { return "Espresso"; }
}

abstract class AddOn implements Coffee {          // base decorator: is-a Coffee, has-a Coffee
    protected final Coffee inner;
    AddOn(Coffee c) { inner = c; }
}
class Milk extends AddOn {
    Milk(Coffee c) { super(c); }
    public double cost() { return inner.cost() + 30; }
    public String desc() { return inner.desc() + " + milk"; }
}
class Caramel extends AddOn {
    Caramel(Coffee c) { super(c); }
    public double cost() { return inner.cost() + 45; }
    public String desc() { return inner.desc() + " + caramel"; }
}

public class Main {
    public static void main(String[] args) {
        Coffee c = new Caramel(new Milk(new Espresso()));
        System.out.println(c.desc() + " = " + c.cost());   // Espresso + milk + caramel = 175.0
    }
}`, lang: "java" },
        { table: { head: ["Inheritance", "Decorator"], rows: [
          ["Behaviour fixed at compile time", "Added/removed at run time"],
          ["N features → up to 2<sup>N</sup> subclasses", "N small decorator classes, combined freely"],
          ["Affects every instance of the subclass", "Affects only the wrapped object"]
        ] } },
        { tip: "Java I/O is the textbook example: <code>new BufferedReader(new InputStreamReader(new FileInputStream(f)))</code>; also <code>Collections.unmodifiableList()</code> and <code>synchronizedList()</code>. Difference from Adapter: Decorator keeps the <i>same</i> interface and adds behaviour; Adapter <i>changes</i> the interface." }
      ]
    }
  ]
});
