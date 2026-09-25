/* core subject: Object-Oriented Programming — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "oops",
  title: "Object-Oriented Programming",
  short: "OOPS",
  icon: "◇",
  blurb: "Interviewers test whether you can explain the four pillars with real code, know what the compiler does behind virtual functions, constructors and copies in C++, and can contrast it with Java's interfaces, GC and equals/hashCode. Expect a design-pattern or SOLID follow-up at SDE level.",
  topics: [
    "Fundamentals",
    "Classes & Objects",
    "Encapsulation & Abstraction",
    "Inheritance",
    "Polymorphism",
    "Constructors & Destructors",
    "Memory & Pointers",
    "C++ Specifics",
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
      short: "OOP is a paradigm that models a program as a set of objects that bundle data (state) with the functions that operate on it (behaviour). Procedural programming organises code as a sequence of functions acting on separate, often global, data.",
      a: [
        { p: "<b>Object-Oriented Programming</b> is a programming paradigm in which a program is built from <b>objects</b> — instances of <b>classes</b> that combine <i>data</i> (attributes) and <i>behaviour</i> (methods). Objects interact by calling each other's methods, and the language enforces boundaries (access control, interfaces) between them." },
        { p: "<b>Procedural programming</b> (C, Pascal) structures a program as a top-down sequence of procedures. Data and functions are separate; any function can usually touch any data it can reach." },
        { table: { head: ["Aspect", "Procedural", "Object-Oriented"], rows: [
          ["Unit of design", "Function / procedure", "Class / object"],
          ["Data & behaviour", "Kept separate", "Bundled together (encapsulation)"],
          ["Approach", "Top-down (break task into steps)", "Bottom-up (model entities, then compose)"],
          ["Data security", "Global data freely modified", "Access specifiers hide internal state"],
          ["Reuse", "Copy / call functions", "Inheritance, composition, polymorphism"],
          ["Extending", "Often edit existing functions (switch on type)", "Add a new subclass; existing code untouched"],
          ["Examples", "C, Pascal, Fortran", "C++, Java, C#, Python"]
        ] } },
        { p: "OOP shines for large systems with many interacting entities and long lifetimes (easier maintenance, modularity, team work). Procedural code is often simpler and faster for small, linear tasks or tight numeric loops." },
        { tip: "C++ is <b>multi-paradigm</b> (procedural + OOP + generic + functional); Java is almost purely class-based (everything lives inside a class, but primitives are not objects, so Java is not '100% pure' OOP)." }
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
        { table: { head: ["Pillar", "Meaning", "C++ / Java mechanism"], rows: [
          ["<b>Encapsulation</b>", "Bundle data and the methods that use it into one unit, and control access to the data", "<code>class</code> + <code>private</code>/<code>public</code>, getters/setters"],
          ["<b>Abstraction</b>", "Show only essential features, hide implementation details", "Abstract classes, pure virtual functions, Java <code>interface</code>"],
          ["<b>Inheritance</b>", "A class acquires the properties and behaviour of another (is-a)", "<code>class Dog : public Animal</code> / <code>extends</code>"],
          ["<b>Polymorphism</b>", "Same call behaves differently depending on the object / arguments", "Overloading (compile time), virtual functions / overriding (run time)"]
        ] } },
        { code: `class Animal {                         // Abstraction: abstract interface
public:
    virtual void speak() const = 0;
    virtual ~Animal() = default;
};

class Dog : public Animal {            // Inheritance
    std::string name;                  // Encapsulation: hidden state
public:
    explicit Dog(std::string n) : name(std::move(n)) {}
    void speak() const override {      // Polymorphism: overriding
        std::cout << name << " says Woof\\n";
    }
};

void makeNoise(const Animal& a) { a.speak(); }  // works for any Animal`, lang: "cpp", title: "All four pillars in 15 lines" },
        { tip: "Give a one-line real-world example for each (e.g. ATM: you press 'withdraw' (abstraction), your balance is private (encapsulation), SavingsAccount is-an Account (inheritance), withdraw() behaves differently per account type (polymorphism))." }
      ]
    },
    {
      id: "class-vs-object",
      q: "What is the difference between a class and an object?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "A class is a user-defined blueprint/type that declares data members and methods; it occupies no memory for data by itself. An object is a concrete instance of that class created at run time, with its own memory holding the member values.",
      a: [
        { p: "A <b>class</b> is a blueprint or user-defined type: it describes what data an entity holds and what it can do. An <b>object</b> is an <b>instance</b> of a class — an actual region of memory with its own copy of the non-static data members." },
        { table: { head: ["Class", "Object"], rows: [
          ["Logical template / type", "Physical, real instance"],
          ["Declared once", "Many objects can be created from one class"],
          ["No memory for data members when declared", "Memory allocated on creation (stack or heap)"],
          ["Defined with <code>class</code> keyword", "Created by declaration (<code>Car c;</code>) or <code>new</code>"],
          ["Example: <code>Car</code>", "Example: <code>myCar</code>, <code>yourCar</code>"]
        ] } },
        { code: [
          { lang: "cpp", src: `class Car {
public:
    std::string brand;
    int speed = 0;
    void accelerate(int d) { speed += d; }
};

int main() {
    Car a;                 // object on the stack
    a.brand = "Tata";
    Car* b = new Car();    // object on the heap
    b->accelerate(20);
    delete b;
}` },
          { lang: "java", src: `class Car {
    String brand;
    int speed = 0;
    void accelerate(int d) { speed += d; }
}

public class Main {
    public static void main(String[] args) {
        Car a = new Car();   // objects always on the heap in Java
        a.brand = "Tata";    // 'a' is a reference to it
        a.accelerate(20);
    }
}` }
        ], title: "Class definition vs object creation" },
        { warn: "Member functions are <b>not</b> stored inside each object. All objects share one copy of the code; only non-static data members take per-object space (plus a vptr if the class has virtual functions)." }
      ]
    },
    {
      id: "is-a-vs-has-a",
      q: "What is the difference between an IS-A and a HAS-A relationship?",
      topic: "Fundamentals",
      level: 1,
      top: true,
      short: "IS-A is inheritance: a Dog is an Animal, so Dog derives from Animal. HAS-A is composition/aggregation: a Car has an Engine, so Car holds an Engine member. Prefer HAS-A unless the subtype truly can be used everywhere the base is expected.",
      a: [
        { p: "<b>IS-A</b> models <b>inheritance</b> (generalisation): the derived class is a specialised kind of the base and can be substituted wherever the base is expected. <b>HAS-A</b> models <b>containment</b> (association, aggregation or composition): one object owns or uses another as a member." },
        { table: { head: ["", "IS-A", "HAS-A"], rows: [
          ["Mechanism", "Inheritance (<code>: public Base</code> / <code>extends</code>)", "Member field / pointer / reference"],
          ["Coupling", "Tight — derived depends on base internals", "Loose — only on the member's public interface"],
          ["Binding", "Fixed at compile time", "Can be swapped at run time"],
          ["Example", "<code>Circle</code> is-a <code>Shape</code>", "<code>Car</code> has-an <code>Engine</code>"]
        ] } },
        { code: `class Engine { public: void start() {} };
class Vehicle { public: virtual ~Vehicle() = default; };

class Car : public Vehicle {   // IS-A  : Car is a Vehicle
    Engine engine;             // HAS-A : Car has an Engine
public:
    void drive() { engine.start(); }
};`, lang: "cpp" },
        { tip: "Quick test: if the sentence 'X is a Y' sounds right in every context, inheritance may fit; if 'X has a Y' fits, use a member. A Stack is <i>not</i> a Vector (it must not expose insert-at-middle), so Stack should HAVE a vector." }
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
        { code: `class MySqlDatabase { /* concrete driver */ };

// Tight coupling: ReportService is hard-wired to MySQL
class ReportService {
    MySqlDatabase db;               // concrete class
};

// Loose coupling: depends on an abstraction, injected from outside
class Database { public: virtual std::string query(const std::string&) = 0;
                 virtual ~Database() = default; };
class ReportService2 {
    Database& db;
public:
    explicit ReportService2(Database& d) : db(d) {}
};`, lang: "cpp", title: "Reducing coupling via an interface" },
        { tip: "Link it to SOLID: SRP raises cohesion, DIP and ISP lower coupling. Low coupling makes unit testing easy because dependencies can be mocked." }
      ]
    },

    /* ───────────── Classes & Objects ───────────── */
    {
      id: "access-specifiers",
      q: "Explain access specifiers in C++ and Java.",
      topic: "Classes & Objects",
      level: 1,
      top: true,
      short: "Access specifiers control who can see a member. C++ has public, protected and private (class default private, struct default public). Java has public, protected, package-private (default, no keyword) and private; Java's protected also grants package access.",
      a: [
        { p: "Access specifiers (access modifiers) implement <b>encapsulation</b> by controlling which code can access a class's members." },
        { h: "C++" },
        { table: { head: ["Specifier", "Same class", "Derived class", "Outside"], rows: [
          ["<code>public</code>", "Yes", "Yes", "Yes"],
          ["<code>protected</code>", "Yes", "Yes", "No"],
          ["<code>private</code>", "Yes", "No", "No"]
        ] } },
        { p: "Default is <code>private</code> for <code>class</code> and <code>public</code> for <code>struct</code>. <code>friend</code> functions/classes bypass these rules." },
        { h: "Java" },
        { table: { head: ["Modifier", "Class", "Package", "Subclass (other pkg)", "World"], rows: [
          ["<code>public</code>", "Yes", "Yes", "Yes", "Yes"],
          ["<code>protected</code>", "Yes", "Yes", "Yes", "No"],
          ["<i>default</i> (no keyword)", "Yes", "Yes", "No", "No"],
          ["<code>private</code>", "Yes", "No", "No", "No"]
        ] } },
        { warn: "Java <code>protected</code> is <i>wider</i> than C++ <code>protected</code>: it is also visible to every class in the same package. And a top-level Java class can only be <code>public</code> or package-private." },
        { tip: "In C++ access is checked per <b>class</b>, not per object: a member function can read <code>other.privateField</code> of another object of the same class (that's how copy constructors work)." }
      ]
    },
    {
      id: "this-pointer",
      q: "What is the this pointer? Where is it used?",
      topic: "Classes & Objects",
      level: 1,
      top: true,
      short: "this is an implicit pointer (a reference in Java) passed to every non-static member function that points to the object on which the function was called. It resolves name clashes, enables method chaining and lets an object pass itself to others.",
      a: [
        { p: "Every non-static member function receives a hidden parameter <code>this</code>. In C++ it is a prvalue pointer of type <code>X*</code> (or <code>const X*</code> inside a const member function). In Java <code>this</code> is a reference to the current object." },
        { ul: [
          "Disambiguate members from parameters with the same name: <code>this-&gt;x = x;</code>",
          "Return <code>*this</code> for <b>method chaining</b> (builder / fluent API, <code>operator=</code>)",
          "Pass the current object to another function: <code>registry.add(this);</code>",
          "Self-assignment check in <code>operator=</code>: <code>if (this == &amp;other) return *this;</code>",
          "Java only: <code>this(...)</code> calls another constructor of the same class (constructor chaining)"
        ] },
        { code: [
          { lang: "cpp", src: `class Counter {
    int value = 0;
public:
    Counter& add(int value) {
        this->value += value;   // member vs parameter
        return *this;           // enable chaining
    }
    int get() const { return value; }
};

int main() {
    Counter c;
    c.add(2).add(3);            // c.get() == 5
}` },
          { lang: "java", src: `class Counter {
    private int value;
    Counter() { this(0); }             // constructor chaining
    Counter(int value) { this.value = value; }
    Counter add(int value) {
        this.value += value;
        return this;                   // chaining
    }
}` }
        ] },
        { warn: "<code>this</code> is not available in <b>static</b> member functions (they are not called on an object). Also, <code>this</code> itself cannot be reassigned." }
      ]
    },
    {
      id: "static-members",
      q: "What are static data members and static member functions? Static vs instance members?",
      topic: "Classes & Objects",
      level: 1,
      top: true,
      short: "A static member belongs to the class, not to any object: one shared copy exists for all instances and it can be accessed via the class name. Static methods have no this pointer so they can only directly use static members. Instance members exist separately in every object.",
      a: [
        { p: "<b>Instance</b> members belong to each object: every object has its own copy of instance fields, and instance methods run on a specific object (have <code>this</code>). <b>Static</b> members belong to the <b>class</b>: one copy shared across all objects, alive for the whole program." },
        { table: { head: ["", "Instance", "Static"], rows: [
          ["Copies", "One per object", "One per class"],
          ["Access", "<code>obj.x</code>", "<code>Class::x</code> (C++) / <code>Class.x</code> (Java)"],
          ["<code>this</code> available", "Yes", "No"],
          ["Can access", "Static and instance members", "Only static members directly"],
          ["Can be virtual / overridden", "Yes", "No (Java: static methods are <i>hidden</i>, not overridden)"],
          ["Typical use", "Object state", "Counters, constants, factory methods, utility functions"]
        ] } },
        { code: [
          { lang: "cpp", src: `class Student {
    static int count;          // declaration
public:
    Student()  { ++count; }
    ~Student() { --count; }
    static int getCount() { return count; }  // no 'this'
};
int Student::count = 0;        // definition (needed pre-C++17)
// C++17 alternative inside class: inline static int count = 0;

int main() {
    Student a, b;
    std::cout << Student::getCount();  // 2
}` },
          { lang: "java", src: `class Student {
    private static int count = 0;
    static { /* static block: runs once when class loads */ }

    Student() { count++; }
    static int getCount() { return count; }
}

// Student.getCount();  // call via class name` }
        ] },
        { tip: "Java extras interviewers like: static blocks run once at class loading; a <b>static nested class</b> does not hold a reference to the outer object; <code>main</code> is static so the JVM can call it without creating an object." }
      ]
    },
    {
      id: "empty-class-size",
      q: "What is the size of an empty class in C++? Why is it not zero?",
      topic: "Classes & Objects",
      level: 2,
      top: true,
      short: "sizeof an empty class is 1 byte (at least 1), so that every distinct object has a unique address. With a virtual function it becomes the size of a vptr (8 bytes on 64-bit). The Empty Base Optimisation lets an empty base take 0 bytes inside a derived object.",
      a: [
        { p: "The C++ standard requires every complete object to have a <b>non-zero size</b> so that two different objects (e.g. elements of an array <code>Empty arr[10]</code>) have <b>distinct addresses</b>. Compilers therefore insert 1 byte." },
        { code: `#include <iostream>
struct Empty {};
struct WithVirtual { virtual void f() {} };
struct Derived : Empty { int x; };   // Empty Base Optimisation
struct Member { Empty e; int x; };   // empty *member* still costs space

int main() {
    std::cout << sizeof(Empty)       << "\\n"; // 1
    std::cout << sizeof(WithVirtual) << "\\n"; // 8 on 64-bit (vptr)
    std::cout << sizeof(Derived)     << "\\n"; // 4 (EBO: base adds 0)
    std::cout << sizeof(Member)      << "\\n"; // 8 (1 + padding + 4)
}`, lang: "cpp", title: "Output on a typical 64-bit compiler" },
        { ul: [
          "Member functions (non-virtual) and static members add nothing to <code>sizeof</code>.",
          "The first virtual function adds one hidden <b>vptr</b>; more virtual functions do not increase size further.",
          "C++20 adds <code>[[no_unique_address]]</code> to get EBO-like savings for empty members."
        ] },
        { tip: "Follow-up: 'Size of a class with one char and one int?' → 8 because of alignment padding. Reordering members from largest to smallest reduces padding." }
      ]
    },
    {
      id: "friend-function-class",
      q: "What is a friend function and a friend class in C++? Does it violate encapsulation?",
      topic: "Classes & Objects",
      level: 2,
      top: true,
      short: "A friend function or friend class is granted access to a class's private and protected members even though it is not a member. Friendship is granted by the class, is not inherited, not mutual and not transitive. Used sparingly (e.g. for the stream output operator), it extends the class's interface rather than breaking encapsulation.",
      a: [
        { p: "A <b>friend</b> is a non-member function or another class that the class explicitly trusts with access to its <code>private</code>/<code>protected</code> members. It is declared inside the class with the <code>friend</code> keyword." },
        { code: `#include <iostream>
class Box {
    double width;
public:
    explicit Box(double w) : width(w) {}
    friend void printWidth(const Box& b);                 // friend function
    friend std::ostream& operator<<(std::ostream&, const Box&);
    friend class BoxInspector;                            // friend class
};

void printWidth(const Box& b) { std::cout << b.width << "\\n"; }
std::ostream& operator<<(std::ostream& os, const Box& b) {
    return os << "Box(" << b.width << ")";
}
class BoxInspector {
public:
    double peek(const Box& b) { return b.width; }         // allowed
};`, lang: "cpp" },
        { ul: [
          "Not a member: no <code>this</code>, called like a normal function, unaffected by access specifier placement.",
          "<b>Not inherited</b>: a friend of Base is not a friend of Derived.",
          "<b>Not mutual</b>: A friend of B does not make B a friend of A.",
          "<b>Not transitive</b>: friend of a friend is not a friend.",
          "Classic use: <code>operator&lt;&lt;</code> / <code>operator&gt;&gt;</code> (left operand is a stream, so it cannot be a member), and symmetric binary operators."
        ] },
        { tip: "Java has no <code>friend</code>; the closest is package-private access. Say friend 'extends the interface under the class's control' — only the class can grant friendship — but overuse does increase coupling." }
      ]
    },
    {
      id: "const-member-functions",
      q: "What is a const member function? What are const objects?",
      topic: "Classes & Objects",
      level: 2,
      top: true,
      short: "A const member function (declared with const after the parameter list) promises not to modify the object's observable state; inside it this is a pointer to const. Const objects and const references can only call const member functions.",
      a: [
        { p: "Writing <code>const</code> after a member function's parameter list makes <code>this</code> a <code>const X*</code>. The compiler then rejects any modification of non-<code>mutable</code> data members and calls to non-const member functions." },
        { code: `class Account {
    double balance = 0;
public:
    double getBalance() const { return balance; }   // read-only
    void deposit(double amt) { balance += amt; }    // modifies
    // void bad() const { balance = 0; }            // error
};

void show(const Account& acc) {
    acc.getBalance();    // OK: const function
    // acc.deposit(10);  // error: deposit() is not const
}

int main() {
    const Account a;     // const object
    a.getBalance();      // OK
}`, lang: "cpp" },
        { ul: [
          "Const-ness is part of the function signature, so you can overload on it: <code>T&amp; operator[](size_t)</code> and <code>const T&amp; operator[](size_t) const</code>.",
          "Mark every getter <code>const</code> — otherwise it cannot be used via <code>const&amp;</code> parameters, which is how objects are normally passed.",
          "<code>mutable</code> members may still be changed inside const functions (caches, mutexes).",
          "Static member functions cannot be const (there is no <code>this</code>)."
        ] },
        { tip: "Java has no const methods; <code>final</code> on a field only prevents reassignment of the reference, not mutation of the object it points to." }
      ]
    },
    {
      id: "inline-functions",
      q: "What is an inline function? When does the compiler ignore it?",
      topic: "Classes & Objects",
      level: 2,
      top: true,
      short: "inline suggests replacing a call with the function body to avoid call overhead; functions defined inside a class body are implicitly inline. Today inline mainly means 'may be defined in multiple translation units' (ODR); the optimiser decides actual inlining and ignores it for large, recursive or virtual-through-pointer calls.",
      a: [
        { p: "An <b>inline function</b> is one where the compiler may substitute the function body at the call site, removing call/return overhead. Member functions <b>defined inside the class body</b> are implicitly inline." },
        { code: `class Point {
    int x, y;
public:
    int getX() const { return x; }   // implicitly inline
    inline int getY() const;         // explicit
};
inline int Point::getY() const { return y; }  // must be visible in every TU that uses it`, lang: "cpp" },
        { p: "<code>inline</code> is only a <b>hint</b>. Compilers usually won't inline when the function:" },
        { ul: [
          "is large or contains loops/switch that would bloat code",
          "is recursive (unbounded depth)",
          "is virtual and called through a pointer/reference (target unknown at compile time)",
          "has its address taken (a real out-of-line copy must exist)"
        ] },
        { table: { head: ["", "Inline function", "Macro (#define)"], rows: [
          ["Type checking", "Yes", "No (text substitution)"],
          ["Arguments evaluated", "Once", "Possibly multiple times (<code>SQ(i++)</code> bug)"],
          ["Access private members", "Yes (if a member)", "No"],
          ["Debuggable", "Yes", "Hard"]
        ] } },
        { tip: "Modern meaning: <code>inline</code> relaxes the One Definition Rule so the same definition can live in a header included by many .cpp files. C++17 extends this to <code>inline</code> variables." }
      ]
    },
    {
      id: "mutable-keyword",
      q: "What is the mutable keyword in C++?",
      topic: "Classes & Objects",
      level: 2,
      top: false,
      short: "mutable marks a data member that may be modified even inside a const member function or in a const object. It is meant for state that is not part of the object's logical value, such as caches, lazy-computed values, access counters and mutexes.",
      a: [
        { p: "<code>mutable</code> separates <b>logical constness</b> (what the user can observe) from <b>bitwise constness</b>. A <code>mutable</code> member can be changed inside a <code>const</code> function because changing it does not change the object's observable value." },
        { code: `#include <mutex>
#include <string>
class Document {
    std::string text;
    mutable bool   cacheValid = false;
    mutable size_t cachedWords = 0;
    mutable std::mutex m;               // locking is not a logical change
public:
    size_t wordCount() const {
        std::lock_guard<std::mutex> lock(m);
        if (!cacheValid) {
            cachedWords = computeWords();   // allowed: mutable
            cacheValid = true;
        }
        return cachedWords;
    }
private:
    size_t computeWords() const { return text.empty() ? 0 : 1; /* ... */ }
};`, lang: "cpp" },
        { ul: [
          "Also used in lambdas: <code>[x]() mutable { ++x; }</code> lets the lambda modify its by-value captures.",
          "Cannot be applied to <code>const</code>, <code>static</code> or reference members."
        ] },
        { warn: "Don't use <code>mutable</code> to silence the compiler on state that really is part of the object's value — that breaks the const contract and thread-safety expectations." }
      ]
    },

    /* ───────────── Encapsulation & Abstraction ───────────── */
    {
      id: "encapsulation-vs-abstraction",
      q: "What is the difference between encapsulation and abstraction?",
      topic: "Encapsulation & Abstraction",
      level: 1,
      top: true,
      short: "Abstraction is a design-level idea: expose only what an object does and hide how (via interfaces/abstract classes). Encapsulation is an implementation-level mechanism: bundle data with its methods and restrict direct access (via access specifiers). Abstraction hides complexity; encapsulation hides and protects data.",
      a: [
        { p: "<b>Abstraction</b> = focusing on <i>what</i> an object does and hiding <i>how</i>. <b>Encapsulation</b> = wrapping data and methods into a single unit and controlling access so the internal state can only change through well-defined methods." },
        { table: { head: ["", "Abstraction", "Encapsulation"], rows: [
          ["Focus", "What the object does (outside view)", "How data is protected (inside view)"],
          ["Level", "Design level", "Implementation level"],
          ["Hides", "Implementation complexity", "Internal data / state"],
          ["Achieved by", "Abstract classes, interfaces, pure virtual functions, public APIs", "<code>private</code> fields + public getters/setters, classes"],
          ["Example", "<code>car.start()</code> — you don't know about the ignition sequence", "<code>fuelLevel</code> is private; only <code>refuel()</code> may change it"]
        ] } },
        { code: `class Shape {                   // ABSTRACTION: callers only see area()
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double r;                   // ENCAPSULATION: state hidden
public:
    explicit Circle(double radius) {
        setRadius(radius);
    }
    void setRadius(double radius) {   // controlled access, with validation
        if (radius < 0) throw std::invalid_argument("negative radius");
        r = radius;
    }
    double area() const override { return 3.14159 * r * r; }
};`, lang: "cpp" },
        { tip: "One-liner for interviews: 'Abstraction solves the problem at the design level by hiding complexity; encapsulation solves it at the implementation level by hiding data.' Real-world: a TV remote's buttons are abstraction; the sealed casing around the circuit is encapsulation." }
      ]
    },
    {
      id: "data-hiding",
      q: "What is data hiding? How is it different from encapsulation?",
      topic: "Encapsulation & Abstraction",
      level: 1,
      top: true,
      short: "Data hiding means making a class's data members inaccessible from outside (private) so they can only be changed through validated methods. Encapsulation is the broader idea of bundling data with methods; data hiding is the access-restriction part of it.",
      a: [
        { p: "<b>Data hiding</b> restricts direct access to an object's data members by declaring them <code>private</code> (or <code>protected</code>), so that the object can enforce its own <b>invariants</b> (e.g. balance never negative)." },
        { code: [
          { lang: "cpp", src: `class BankAccount {
private:
    double balance = 0;               // hidden
public:
    void deposit(double amt) {
        if (amt <= 0) throw std::invalid_argument("bad amount");
        balance += amt;
    }
    bool withdraw(double amt) {
        if (amt > balance) return false;   // invariant protected
        balance -= amt;
        return true;
    }
    double getBalance() const { return balance; }
};
// acc.balance = -500;   // compile error: private` },
          { lang: "java", src: `public class BankAccount {
    private double balance;           // hidden

    public void deposit(double amt) {
        if (amt <= 0) throw new IllegalArgumentException("bad amount");
        balance += amt;
    }
    public boolean withdraw(double amt) {
        if (amt > balance) return false;
        balance -= amt;
        return true;
    }
    public double getBalance() { return balance; }
}` }
        ] },
        { table: { head: ["Data hiding", "Encapsulation"], rows: [
          ["Concerned with <b>security / access</b> of data", "Concerned with <b>bundling</b> data and behaviour"],
          ["Achieved with <code>private</code>", "Achieved with classes (+ access specifiers)"],
          ["A part / outcome of encapsulation", "The broader concept"]
        ] } },
        { warn: "Blindly adding a public getter and setter for every private field gives you encapsulation on paper but no real data hiding — the setter must validate or the field should not be settable at all." }
      ]
    },
    {
      id: "abstract-class-vs-interface",
      q: "What is the difference between an abstract class and an interface?",
      topic: "Encapsulation & Abstraction",
      level: 1,
      top: true,
      short: "An abstract class can have state (fields), constructors and both abstract and concrete methods; a class can extend only one (in Java). An interface defines a contract: no instance state, methods are abstract by default (plus default/static methods since Java 8), and a class can implement many. C++ has no interface keyword; an interface is a class with only pure virtual functions.",
      a: [
        { p: "Both define a contract that cannot be instantiated directly. An <b>abstract class</b> is a partially implemented base (a common 'is-a' parent). An <b>interface</b> is a pure capability contract ('can-do': <code>Comparable</code>, <code>Runnable</code>)." },
        { table: { head: ["Feature", "Abstract class (Java)", "Interface (Java 8+)"], rows: [
          ["Keyword", "<code>abstract class</code>, <code>extends</code>", "<code>interface</code>, <code>implements</code>"],
          ["Multiple inheritance", "A class extends only one", "A class implements many"],
          ["Instance fields", "Yes, any", "No — only <code>public static final</code> constants"],
          ["Constructors", "Yes (called via <code>super</code>)", "No"],
          ["Methods", "Abstract + concrete", "Abstract; <code>default</code> and <code>static</code> (Java 8), <code>private</code> (Java 9)"],
          ["Member access", "Any modifier", "Methods implicitly <code>public</code>"],
          ["Use when", "Related classes share code/state", "Unrelated classes share a capability"]
        ] } },
        { p: "In <b>C++</b> there is no <code>interface</code> keyword. A class with at least one pure virtual function is abstract; a class with <i>only</i> pure virtual functions (and a virtual destructor) acts as an interface. Multiple inheritance of such classes is safe." },
        { code: [
          { lang: "cpp", src: `// "Interface": only pure virtuals
class Drawable {
public:
    virtual void draw() const = 0;
    virtual ~Drawable() = default;
};

// Abstract class: state + partial implementation
class Shape {
protected:
    std::string name;
public:
    explicit Shape(std::string n) : name(std::move(n)) {}
    virtual double area() const = 0;              // abstract
    void describe() const {                       // concrete
        std::cout << name << " area=" << area() << "\\n";
    }
    virtual ~Shape() = default;
};

class Square : public Shape, public Drawable {    // one base + interface
    double s;
public:
    explicit Square(double side) : Shape("Square"), s(side) {}
    double area() const override { return s * s; }
    void draw() const override { std::cout << "[]\\n"; }
};` },
          { lang: "java", src: `interface Drawable {
    void draw();                                  // public abstract
    default void drawTwice() { draw(); draw(); }  // Java 8
}

abstract class Shape {
    protected final String name;
    Shape(String name) { this.name = name; }
    abstract double area();
    void describe() { System.out.println(name + " area=" + area()); }
}

class Square extends Shape implements Drawable {
    private final double s;
    Square(double s) { super("Square"); this.s = s; }
    @Override double area() { return s * s; }
    @Override public void draw() { System.out.println("[]"); }
}` }
        ], title: "Abstract class + interface together" },
        { tip: "Can an abstract class have a constructor? <b>Yes</b> — it runs when a subclass object is created, to initialise the base part. Can it have no abstract methods? Yes in Java (just marked <code>abstract</code> to prevent instantiation)." }
      ]
    },
    {
      id: "pure-virtual-function",
      q: "What is a pure virtual function? Can it have a body?",
      topic: "Encapsulation & Abstraction",
      level: 2,
      top: true,
      short: "A pure virtual function is declared with = 0; it has no required implementation in the base and makes the class abstract, forcing concrete derived classes to override it. It can still be given a body outside the class, which derived classes may call explicitly; a pure virtual destructor must have one.",
      a: [
        { p: "A <b>pure virtual function</b> is a virtual function declared with the pure-specifier <code>= 0</code>. Any class with at least one pure virtual function (declared or inherited and not overridden) is an <b>abstract class</b>: you cannot create objects of it, but you can have pointers/references to it." },
        { code: `#include <iostream>
class Base {
public:
    virtual void greet() = 0;          // pure virtual
    virtual ~Base() = 0;               // pure virtual destructor
};
void Base::greet() { std::cout << "default greeting\\n"; }  // optional body
Base::~Base() {}                       // REQUIRED: always called by derived dtor

class Derived : public Base {
public:
    void greet() override {
        Base::greet();                 // explicitly reuse base body
        std::cout << "hello from Derived\\n";
    }
};

int main() {
    // Base b;                         // error: abstract class
    Derived d;
    Base& r = d;
    r.greet();
}`, lang: "cpp" },
        { ul: [
          "A derived class that doesn't override every pure virtual function is also abstract.",
          "A pure virtual function <b>can</b> have a definition; it's never called via virtual dispatch, only via qualified call <code>Base::greet()</code>.",
          "A pure virtual destructor is a trick to make a class abstract when it has no other natural pure function — but it must be defined.",
          "Java equivalent: an <code>abstract</code> method (never has a body)."
        ] },
        { warn: "Calling a pure virtual function from the base class constructor or destructor (directly or indirectly) is undefined behaviour — typically a crash with 'pure virtual function called'." }
      ]
    },

    /* ───────────── Inheritance ───────────── */
    {
      id: "inheritance-types",
      q: "What is inheritance? Explain the types of inheritance.",
      topic: "Inheritance",
      level: 1,
      top: true,
      short: "Inheritance lets a derived class acquire the members of a base class, modelling an is-a relationship and enabling reuse and polymorphism. Types: single, multilevel, multiple, hierarchical and hybrid. C++ supports all five; Java supports multiple inheritance only through interfaces.",
      a: [
        { p: "<b>Inheritance</b> is the mechanism by which a new class (derived / child / subclass) is created from an existing class (base / parent / superclass), reusing its data and methods and optionally extending or overriding them." },
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
</svg>`, caption: "Arrows point from derived class to base class (UML generalisation)." },
        { table: { head: ["Type", "Shape", "C++", "Java"], rows: [
          ["Single", "B derives from A", "Yes", "Yes"],
          ["Multilevel", "C → B → A (chain)", "Yes", "Yes"],
          ["Multiple", "C derives from A and B", "Yes", "Only via interfaces"],
          ["Hierarchical", "B and C both derive from A", "Yes", "Yes"],
          ["Hybrid", "Combination, e.g. diamond", "Yes (use <code>virtual</code> bases)", "Only via interfaces"]
        ] } },
        { code: `class A { };
class B : public A { };            // single
class C : public B { };            // multilevel  (C -> B -> A)
class X { };
class M : public A, public X { };  // multiple
class H1 : public A { };           // hierarchical: H1 and H2 share base A
class H2 : public A { };`, lang: "cpp" },
        { tip: "Advantages: code reuse, extensibility, enables runtime polymorphism. Disadvantages: tight coupling to the base (fragile base class problem), deep hierarchies are hard to follow — mention 'favour composition over inheritance'." }
      ]
    },
    {
      id: "diamond-problem",
      q: "What is the diamond problem? How does virtual inheritance solve it in C++?",
      topic: "Inheritance",
      level: 2,
      top: true,
      short: "In the diamond problem, D inherits from B and C which both inherit from A, so D contains two copies of A and any access to A's members is ambiguous. Declaring B and C with virtual public A makes them share a single A subobject, which the most-derived class D constructs directly.",
      a: [
        { p: "When a class inherits from two classes that share a common base, the most-derived object ends up with <b>two separate base subobjects</b>. Accessing a base member (<code>d.value</code>) or converting <code>D*</code> to <code>A*</code> becomes <b>ambiguous</b>, and the duplicated state wastes memory and can diverge." },
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
  <text class="tx tx-b" x="490" y="30" text-anchor="middle" dominant-baseline="middle">A (shared)</text>
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
  <text class="tx-a" x="420" y="60" text-anchor="middle">virtual</text>
  <text class="tx-a" x="562" y="60" text-anchor="middle">virtual</text>
  <text class="tx tx-b" x="170" y="208" text-anchor="middle">Without virtual: D holds 2 A's</text>
  <text class="tx tx-b" x="490" y="208" text-anchor="middle">Virtual inheritance: 1 shared A</text>
</svg>`, caption: "Diamond: B and C both derive from A; D derives from B and C." },
        { code: `#include <iostream>
class A {
public:
    int value;
    explicit A(int v) : value(v) { std::cout << "A(" << v << ")\\n"; }
};
class B : virtual public A {             // virtual base
public:
    B() : A(1) {}                        // ignored when B is a base of D
};
class C : virtual public A {
public:
    C() : A(2) {}                        // ignored when C is a base of D
};
class D : public B, public C {
public:
    D() : A(42), B(), C() {}             // most-derived class builds A
};

int main() {
    D d;                                 // prints A(42) exactly once
    std::cout << d.value << "\\n";       // 42 - no ambiguity
    A* p = &d;                           // OK: unique A subobject
}`, lang: "cpp", title: "Virtual inheritance: one shared A" },
        { ul: [
          "Without <code>virtual</code>, <code>d.value</code> is an ambiguity error; you'd have to write <code>d.B::value</code> or <code>d.C::value</code>.",
          "The <b>most-derived</b> class is responsible for initialising a virtual base; virtual bases are constructed first, before any non-virtual base.",
          "Cost: each B/C subobject keeps a pointer/offset (via vtable) to locate the shared A, so access is slightly slower."
        ] },
        { tip: "Java avoids the state diamond entirely by allowing only single class inheritance. With interfaces, if two <code>default</code> methods clash the class must override and pick one: <code>B.super.hello()</code>." }
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
        { p: "Java's designers dropped multiple class inheritance to keep the language simple: with two parent classes, fields could be duplicated, constructor chaining becomes ambiguous and method resolution needs complex rules (C++ needs virtual inheritance for this)." },
        { ul: [
          "<b>Multiple inheritance of state</b> (fields from several classes) — <b>not allowed</b>.",
          "<b>Multiple inheritance of type</b> — allowed: a class can <code>implement</code> many interfaces.",
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
}`, lang: "java", title: "Resolving a default-method diamond" },
        { p: "Resolution rules for defaults: (1) a method from a class always wins over an interface default; (2) the more specific sub-interface wins; (3) otherwise the class must override." },
        { tip: "Contrast with C++: C++ allows multiple inheritance and resolves the diamond with <code>virtual</code> base classes. Mention both to show breadth." }
      ]
    },
    {
      id: "association-aggregation-composition",
      q: "Explain association, aggregation and composition with examples.",
      topic: "Inheritance",
      level: 2,
      top: true,
      short: "Association is any 'uses/knows' relationship between independent objects. Aggregation is a weak has-a: the whole holds parts that can exist independently (Department and Professor). Composition is a strong has-a: the whole owns the parts and they die with it (House and Room).",
      a: [
        { p: "All three are <b>HAS-A / uses</b> relationships (as opposed to IS-A inheritance), differing in <b>ownership</b> and <b>lifetime</b>." },
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
          ["Lifetime", "Independent", "Part can outlive whole", "Part destroyed with whole"],
          ["C++ typical member", "Pointer/reference, or passed as param", "Raw pointer / reference / <code>shared_ptr</code>", "By value or <code>unique_ptr</code>"],
          ["Example", "Doctor – Patient", "Team – Player", "Car – Engine, Human – Heart"]
        ] } },
        { code: `class Professor { /* ... */ };
class Room { /* ... */ };

class Department {                       // AGGREGATION
    std::vector<Professor*> staff;       // doesn't own; professors live elsewhere
public:
    void add(Professor* p) { staff.push_back(p); }
};

class House {                            // COMPOSITION
    std::vector<Room> rooms;             // owned by value
public:
    explicit House(int n) : rooms(n) {}  // rooms created with house
};                                       // and destroyed with it`, lang: "cpp" },
        { tip: "Composition and aggregation are both special cases of association. Interviewers often ask for the UML symbols — remember the diamond goes on the <b>container</b> side." }
      ]
    },
    {
      id: "inheritance-access-modes",
      q: "What is the difference between public, protected and private inheritance in C++?",
      topic: "Inheritance",
      level: 2,
      top: false,
      short: "The inheritance mode caps the access of inherited members: public inheritance keeps public/protected as-is (true is-a), protected inheritance makes base public members protected, and private inheritance makes them private (implemented-in-terms-of). Base private members are never accessible to the derived class.",
      a: [
        { p: "In <code>class D : MODE B</code>, the mode sets the <b>maximum</b> accessibility of B's members as seen through D. The default is <code>private</code> for <code>class</code> and <code>public</code> for <code>struct</code>." },
        { table: { head: ["Base member", "public inheritance", "protected inheritance", "private inheritance"], rows: [
          ["public", "public", "protected", "private"],
          ["protected", "protected", "protected", "private"],
          ["private", "not accessible", "not accessible", "not accessible"]
        ] } },
        { code: `class Base {
public:    int pub = 1;
protected: int prot = 2;
private:   int priv = 3;
};
class PubD  : public Base    { void f() { pub; prot; /* priv: error */ } };
class PrivD : private Base   { void f() { pub; prot; } };

int main() {
    PubD a;  a.pub;        // OK
    PrivD b; // b.pub;     // error: pub is private in PrivD
    Base* p = &a;          // OK: public inheritance = is-a
    // Base* q = &b;       // error: base is inaccessible
}`, lang: "cpp" },
        { ul: [
          "<b>Public</b> inheritance = <b>is-a</b>; the only mode that allows implicit Derived* → Base* conversion from outside.",
          "<b>Private</b> inheritance = <b>implemented-in-terms-of</b>; usually replace with composition, except to override a virtual or use EBO.",
          "Java has only one mode — effectively public inheritance."
        ] },
        { warn: "Private members of the base <i>are</i> inherited (they occupy space in the derived object); they're just not accessible from derived code." }
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
        { p: "Inheritance is <b>white-box</b> reuse: the subclass depends on base internals, is fixed at compile time, and a change in the base can silently break subclasses (<b>fragile base class problem</b>). Composition is <b>black-box</b> reuse through a member's public interface." },
        { code: `// Inheritance explosion: FlyingDuck, SwimmingDuck, FlyingSwimmingDuck ...
// Composition: plug in behaviours instead
struct FlyBehaviour { virtual void fly() const = 0; virtual ~FlyBehaviour() = default; };
struct CanFly  : FlyBehaviour { void fly() const override { std::cout << "flap\\n"; } };
struct NoFly   : FlyBehaviour { void fly() const override { std::cout << "can't\\n"; } };

class Duck {
    std::unique_ptr<FlyBehaviour> flyer;          // HAS-A
public:
    explicit Duck(std::unique_ptr<FlyBehaviour> f) : flyer(std::move(f)) {}
    void setFly(std::unique_ptr<FlyBehaviour> f) { flyer = std::move(f); } // runtime change
    void performFly() const { flyer->fly(); }     // delegation
};

// Duck mallard(std::make_unique<CanFly>());
// Duck rubber(std::make_unique<NoFly>());`, lang: "cpp" },
        { table: { head: ["", "Inheritance", "Composition"], rows: [
          ["Coupling", "Tight", "Loose"],
          ["Change behaviour at run time", "No", "Yes"],
          ["Combining N features", "Up to 2<sup>N</sup> subclasses", "N small components"],
          ["Exposes", "Whole base interface", "Only what you delegate"]
        ] } },
        { tip: "Still use inheritance when (1) there is a true is-a that passes LSP, (2) you need polymorphism through a common interface, or (3) a framework requires it. Classic bad example: <code>Stack extends Vector</code> in Java exposes <code>add(index, e)</code>." }
      ]
    },

    /* ───────────── Polymorphism ───────────── */
    {
      id: "compile-vs-runtime-polymorphism",
      q: "What is polymorphism? Compare compile-time and run-time polymorphism.",
      topic: "Polymorphism",
      level: 1,
      top: true,
      short: "Polymorphism means one interface, many forms. Compile-time (static) polymorphism is resolved by the compiler: function overloading, operator overloading and templates. Run-time (dynamic) polymorphism is resolved during execution through virtual functions / method overriding called via a base pointer or reference.",
      a: [
        { p: "<b>Polymorphism</b> ('many forms') lets the same name or call behave differently depending on the argument types or the actual object type." },
        { table: { head: ["", "Compile-time (static)", "Run-time (dynamic)"], rows: [
          ["Resolved by", "Compiler", "At execution, via vtable (C++) / JVM dispatch"],
          ["Mechanisms", "Function overloading, operator overloading, templates / generics", "Virtual functions + overriding, called through base pointer/reference"],
          ["Binding", "Early / static binding", "Late / dynamic binding"],
          ["Inheritance needed", "No", "Yes"],
          ["Speed", "Faster, can be inlined", "Small overhead (indirect call)"],
          ["Flexibility", "Less — fixed at build time", "More — new subclasses plug in without recompiling callers"]
        ] } },
        { code: `#include <iostream>
// Compile-time: overloading
int    add(int a, int b)       { return a + b; }
double add(double a, double b) { return a + b; }

// Run-time: virtual + override
struct Animal { virtual void sound() const { std::cout << "...\\n"; }
                virtual ~Animal() = default; };
struct Cat : Animal { void sound() const override { std::cout << "Meow\\n"; } };
struct Dog : Animal { void sound() const override { std::cout << "Woof\\n"; } };

int main() {
    add(1, 2);  add(1.5, 2.5);          // chosen by compiler
    Animal* zoo[] = { new Cat, new Dog };
    for (Animal* a : zoo) { a->sound(); delete a; }   // Meow, Woof: chosen at run time
}`, lang: "cpp" },
        { tip: "In Java all non-static, non-final, non-private instance methods are virtual by default. In C++ you must opt in with <code>virtual</code>." }
      ]
    },
    {
      id: "overloading-vs-overriding",
      q: "What is the difference between method overloading and method overriding?",
      topic: "Polymorphism",
      level: 1,
      top: true,
      short: "Overloading is several functions with the same name but different parameter lists in the same scope, resolved at compile time. Overriding is a derived class providing a new implementation of a base-class virtual method with the same signature, resolved at run time.",
      a: [
        { table: { head: ["", "Overloading", "Overriding"], rows: [
          ["Where", "Same class (scope)", "Base and derived class"],
          ["Signature", "Same name, <b>different</b> parameters", "Same name <b>and</b> parameters (return type same or covariant)"],
          ["Return type alone differs", "Not allowed", "—"],
          ["Binding", "Compile time", "Run time"],
          ["Inheritance needed", "No", "Yes"],
          ["C++ requirement", "—", "Base method must be <code>virtual</code>"],
          ["static / private / final methods", "Can be overloaded", "Cannot be overridden"],
          ["Purpose", "Convenience: same operation on different inputs", "Specialise inherited behaviour"]
        ] } },
        { code: [
          { lang: "cpp", src: `#include <iostream>
class Printer {
public:
    void print(int x)                { std::cout << "int " << x << "\\n"; }     // overloads
    void print(const std::string& s) { std::cout << "str " << s << "\\n"; }
    virtual void hello() const       { std::cout << "Printer\\n"; }
    virtual ~Printer() = default;
};
class LaserPrinter : public Printer {
public:
    void hello() const override      { std::cout << "Laser\\n"; }             // overrides
};

int main() {
    LaserPrinter lp;
    Printer& p = lp;
    p.print(5);  p.print("hi");      // overloading resolved at compile time
    p.hello();                       // "Laser": overriding resolved at run time
}` },
          { lang: "java", src: `class Printer {
    void print(int x)    { System.out.println("int " + x); }  // overloads
    void print(String s) { System.out.println("str " + s); }
    void hello()         { System.out.println("Printer"); }
}
class LaserPrinter extends Printer {
    @Override
    void hello()         { System.out.println("Laser"); }     // overrides
}

public class Main {
    public static void main(String[] args) {
        Printer p = new LaserPrinter();
        p.print(5); p.print("hi");
        p.hello();                   // Laser
    }
}` }
        ] },
        { tip: "Always write <code>override</code> (C++11) or <code>@Override</code> (Java): if the signature doesn't actually match a base method (e.g. missing <code>const</code>), the compiler errors instead of silently creating a new overload." },
        { warn: "Can we overload <code>main</code> in Java? Yes, but the JVM only calls <code>public static void main(String[])</code>. Can we override a static method? No — it gets <i>hidden</i>." }
      ]
    },
    {
      id: "operator-overloading",
      q: "What is operator overloading? Show an example. Which operators cannot be overloaded?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Operator overloading gives user-defined types natural syntax by defining functions named operator+, operator== and so on., either as members or free (often friend) functions. You cannot overload ::, ., .*, ?:, sizeof, typeid, alignof, or create new operators or change precedence. Java does not support it.",
      a: [
        { p: "<b>Operator overloading</b> is compile-time polymorphism: the compiler rewrites <code>a + b</code> into <code>a.operator+(b)</code> or <code>operator+(a, b)</code>." },
        { code: `#include <iostream>
class Complex {
    double re, im;
public:
    Complex(double r = 0, double i = 0) : re(r), im(i) {}

    Complex operator+(const Complex& o) const {         // member binary op
        return Complex(re + o.re, im + o.im);
    }
    Complex& operator+=(const Complex& o) {              // compound: return *this
        re += o.re; im += o.im; return *this;
    }
    bool operator==(const Complex& o) const { return re == o.re && im == o.im; }
    Complex& operator++() { ++re; return *this; }       // prefix ++c
    Complex operator++(int) { Complex t = *this; ++re; return t; }  // postfix c++

    friend std::ostream& operator<<(std::ostream& os, const Complex& c) {
        return os << c.re << " + " << c.im << "i";       // non-member: stream on left
    }
};

int main() {
    Complex a(1, 2), b(3, 4);
    Complex c = a + b;
    c += a;
    std::cout << c << "\\n";     // 5 + 8i
}`, lang: "cpp" },
        { table: { head: ["Cannot overload", "Why"], rows: [
          ["<code>::</code> scope resolution", "Works on names, not values"],
          ["<code>.</code> and <code>.*</code> member access", "Would make it impossible to access members normally"],
          ["<code>?:</code> ternary", "Needs short-circuit evaluation of only one branch"],
          ["<code>sizeof</code>, <code>typeid</code>, <code>alignof</code>", "Compile-time / type operators"],
          ["<code>#</code>, <code>##</code>", "Preprocessor, not C++ operators"]
        ] } },
        { ul: [
          "Must be a <b>member</b>: <code>=</code>, <code>[]</code>, <code>()</code>, <code>-&gt;</code>.",
          "Prefer <b>non-member</b> for symmetric binary operators so implicit conversions work on both sides (<code>2 + c</code>).",
          "Overloading <code>&amp;&amp;</code>, <code>||</code> or <code>,</code> loses short-circuit/sequencing semantics — avoid."
        ] },
        { tip: "Java has no user operator overloading (only built-in <code>+</code> for String concatenation), a deliberate simplicity choice. Postfix <code>++</code> takes a dummy <code>int</code> parameter — a favourite trick question." }
      ]
    },
    {
      id: "virtual-functions",
      q: "What is a virtual function? Why do we need it?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "A virtual function is a member function declared virtual in the base class so that a call through a base pointer or reference executes the most-derived override, decided at run time. Without virtual, the call is bound at compile time to the static (pointer) type.",
      a: [
        { p: "Declaring a member function <code>virtual</code> enables <b>dynamic dispatch</b>: when called through a <code>Base*</code> or <code>Base&amp;</code>, the version belonging to the object's <b>actual (dynamic) type</b> runs. This lets code written against the base class work with any future subclass." },
        { svg: `<svg viewBox="0 0 560 185" width="560" class="dg">
  <rect class="box-a" x="200" y="10" width="160" height="56" rx="6"/>
  <text class="tx tx-b" x="280" y="28" text-anchor="middle" dominant-baseline="middle">Shape (abstract)</text>
  <text class="tx-c" x="280" y="50" text-anchor="middle" dominant-baseline="middle">virtual area() = 0</text>
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
  <text class="tx-m" x="480" y="40" text-anchor="middle">Shape* s = new Circle;</text>
  <text class="tx-m" x="480" y="56" text-anchor="middle">s-&gt;area() runs Circle's</text>
</svg>`, caption: "Client code holds Shape* and calls area(); the override of the actual object runs." },
        { code: `#include <iostream>
#include <memory>
#include <vector>
struct Shape {
    virtual double area() const = 0;
    void info() const { std::cout << "Shape\\n"; }        // NOT virtual
    virtual ~Shape() = default;
};
struct Circle : Shape {
    double r; explicit Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    void info() const { std::cout << "Circle\\n"; }       // hides, not overrides
};
struct Rect : Shape {
    double w, h; Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

int main() {
    std::vector<std::unique_ptr<Shape>> v;
    v.push_back(std::make_unique<Circle>(1));
    v.push_back(std::make_unique<Rect>(2, 3));
    for (auto& s : v) std::cout << s->area() << "\\n";   // 3.14159, 6
    v[0]->info();                                        // "Shape"  (static binding)
}`, lang: "cpp" },
        { ul: [
          "Once virtual, a function stays virtual in all derived classes (the keyword is optional there; use <code>override</code>).",
          "Virtual dispatch happens only through <b>pointers or references</b>; calling on an object by value uses static binding.",
          "Inside constructors/destructors, virtual calls resolve to the class currently being constructed/destroyed, not the derived override.",
          "<code>final</code> (C++11) on a virtual stops further overriding and lets the compiler devirtualise."
        ] },
        { warn: "Static functions, constructors and friend functions cannot be virtual. Default arguments of virtual functions are bound statically (taken from the pointer's type) — a classic trick question." }
      ]
    },
    {
      id: "early-vs-late-binding",
      q: "What is early binding vs late binding?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Binding is linking a function call to the function body. Early (static) binding happens at compile time based on the declared type — used for normal, overloaded, static, non-virtual and private calls. Late (dynamic) binding happens at run time based on the actual object type — used for virtual/overridden methods.",
      a: [
        { table: { head: ["", "Early / static binding", "Late / dynamic binding"], rows: [
          ["When", "Compile / link time", "Run time"],
          ["Based on", "Static type of pointer/reference/expression", "Dynamic type of the object"],
          ["C++", "Non-virtual functions, overloads, templates, calls on objects by value", "Virtual functions via pointer/reference (vtable lookup)"],
          ["Java", "<code>static</code>, <code>private</code>, <code>final</code> methods, overload selection, field access", "All other instance methods"],
          ["Performance", "Direct call, inlinable", "Indirect call through vtable"],
          ["Example of", "Compile-time polymorphism", "Run-time polymorphism"]
        ] } },
        { code: `class Base {
public:
    void f()         { std::cout << "Base::f\\n"; }   // early binding
    virtual void g() { std::cout << "Base::g\\n"; }   // late binding
    virtual ~Base() = default;
};
class Derived : public Base {
public:
    void f()          { std::cout << "Derived::f\\n"; }
    void g() override { std::cout << "Derived::g\\n"; }
};

int main() {
    Base* p = new Derived;
    p->f();   // Base::f    - decided by pointer type at compile time
    p->g();   // Derived::g - decided by object type at run time
    delete p;
}`, lang: "cpp" },
        { warn: "In Java, <b>fields are never polymorphic</b>: <code>Base b = new Derived(); b.x</code> reads Base's <code>x</code> even if Derived declares its own <code>x</code> (field hiding)." }
      ]
    },
    {
      id: "object-slicing",
      q: "What is object slicing in C++? How do you avoid it?",
      topic: "Polymorphism",
      level: 2,
      top: true,
      short: "Object slicing happens when a derived object is copied into a base object by value: only the base part is copied, the derived fields are 'sliced off' and the vptr is the base's, so virtual calls no longer reach the derived override. Avoid it by passing and storing polymorphic objects via references or (smart) pointers.",
      a: [
        { p: "Assigning or passing a derived object <b>by value</b> to a base type invokes the base's copy constructor, which knows only the base members. The result is a genuine <code>Base</code> object." },
        { svg: `<svg viewBox="0 0 560 150" width="560" class="dg">
  <text class="tx tx-b" x="90" y="18" text-anchor="middle">Dog d</text>
  <rect class="box-a" x="20" y="28" width="140" height="36" rx="6"/>
  <text class="tx" x="90" y="46" text-anchor="middle" dominant-baseline="middle">Animal part: name</text>
  <rect class="box-p" x="20" y="64" width="140" height="36" rx="6"/>
  <text class="tx" x="90" y="82" text-anchor="middle" dominant-baseline="middle">Dog part: breed</text>
  <line class="ln-a" x1="162" y1="64" x2="336" y2="46" marker-end="url(#dg-arr-a)"/>
  <text class="tx-c" x="250" y="40" text-anchor="middle">Animal a = d;</text>
  <text class="tx tx-b" x="410" y="18" text-anchor="middle">Animal a</text>
  <rect class="box" x="340" y="28" width="140" height="36" rx="6"/>
  <text class="tx" x="410" y="46" text-anchor="middle" dominant-baseline="middle">Animal part: name</text>
  <rect class="box-r" x="340" y="64" width="140" height="36" rx="6"/>
  <text class="tx" x="410" y="82" text-anchor="middle" dominant-baseline="middle">sliced off</text>
  <text class="tx-m" x="280" y="130" text-anchor="middle">a is a plain Animal: a.speak() runs Animal::speak()</text>
</svg>`, caption: "Copying a Dog into an Animal keeps only the Animal subobject." },
        { code: `#include <iostream>
#include <string>
#include <vector>
struct Animal {
    std::string name = "animal";
    virtual void speak() const { std::cout << "...\\n"; }
    virtual ~Animal() = default;
};
struct Dog : Animal {
    std::string breed = "lab";
    void speak() const override { std::cout << "Woof\\n"; }
};

void byValue(Animal a)      { a.speak(); }   // slices!
void byRef(const Animal& a) { a.speak(); }   // OK

int main() {
    Dog d;
    byValue(d);                   // prints "..."
    byRef(d);                     // prints "Woof"
    std::vector<Animal> v{d};     // slices too: stores Animal copies
}`, lang: "cpp", title: "Slicing on pass-by-value" },
        { ul: [
          "Pass polymorphic objects by <code>const&amp;</code> or pointer.",
          "Store them as <code>std::vector&lt;std::unique_ptr&lt;Base&gt;&gt;</code>, not <code>std::vector&lt;Base&gt;</code>.",
          "Make polymorphic base classes non-copyable (<code>= delete</code> copy ops) or abstract so slicing becomes a compile error; offer a virtual <code>clone()</code> if copying is needed."
        ] },
        { tip: "Java has no slicing: variables hold references, so assigning <code>Animal a = dog;</code> just copies the reference to the same Dog object." }
      ]
    },
    {
      id: "java-overriding-rules",
      q: "What are the rules for method overriding in Java?",
      topic: "Polymorphism",
      level: 2,
      top: false,
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
          ["Package-private method", "Overridable only by subclasses in the same package"]
        ] } },
        { code: [
          { lang: "java", src: `import java.io.*;

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
}` },
          { lang: "cpp", src: `// C++ equivalents: overriding requires 'virtual' in the base;
// access specifier of the override may differ (access is checked
// against the static type), and exception specs are not part of
// overriding except noexcept (an override of a noexcept function
// must also be noexcept).
struct Parent {
    virtual Parent* clone() const { return new Parent(*this); }
    virtual void f() noexcept {}
    virtual ~Parent() = default;
};
struct Child : Parent {
    Child* clone() const override { return new Child(*this); }  // covariant
    void f() noexcept override {}
};` }
        ] },
        { tip: "The <code>@Override</code> annotation is optional but makes the compiler verify all these rules — always mention it." }
      ]
    },
    {
      id: "covariant-return-types",
      q: "What are covariant return types?",
      topic: "Polymorphism",
      level: 2,
      top: false,
      short: "An overriding method may return a more derived type than the method it overrides: if Base::clone() returns Base*, Derived::clone() may return Derived*. Supported in C++ for pointers and references to classes, and in Java (since 5) for reference return types.",
      a: [
        { p: "Normally an override must match the base signature exactly. <b>Covariant return types</b> relax this for the return type only: it can be a <b>subtype</b> of the original return type, because a Derived is still a valid Base for any caller using the base interface." },
        { code: [
          { lang: "cpp", src: `#include <memory>
class Shape {
public:
    virtual Shape* clone() const = 0;
    virtual ~Shape() = default;
};
class Circle : public Shape {
public:
    Circle* clone() const override {       // covariant: Circle* instead of Shape*
        return new Circle(*this);
    }
    void onlyCircle() {}
};

int main() {
    Circle c;
    Circle* copy = c.clone();              // no cast needed
    copy->onlyCircle();
    delete copy;
}` },
          { lang: "java", src: `class Animal {
    Animal create() { return new Animal(); }
}
class Dog extends Animal {
    @Override
    Dog create() { return new Dog(); }     // covariant return
    void bark() {}
}

// new Dog().create().bark();   // compiles: returns Dog` }
        ] },
        { warn: "C++ covariance works only with raw pointers and references to classes — <b>not</b> with smart pointers (<code>unique_ptr&lt;Circle&gt;</code> is not covariant with <code>unique_ptr&lt;Shape&gt;</code>). Primitive return types in Java must match exactly." }
      ]
    },
    {
      id: "vtable-vptr",
      q: "How do virtual functions work internally? Explain vtable and vptr.",
      topic: "Polymorphism",
      level: 3,
      top: true,
      short: "For each class with virtual functions the compiler builds one static vtable: an array of pointers to the most-derived overrides. Every object of such a class carries a hidden vptr pointing to its class's vtable, set by the constructor. A virtual call loads the vptr, indexes the slot for that function and calls through it.",
      a: [
        { p: "The C++ standard doesn't mandate a mechanism, but every mainstream compiler (Itanium ABI on GCC/Clang, MSVC) uses <b>vtables</b>:" },
        { ol: [
          "<b>vtable</b> — one per <i>class</i> (not per object), created at compile time and stored in read-only memory. Each slot holds the address of the function to call for that virtual function: the class's own override, or the inherited one.",
          "<b>vptr</b> — a hidden pointer member in every <i>object</i> of a polymorphic class (usually at offset 0). The constructor sets it to the class's vtable; each constructor in the chain overwrites it, so while <code>Base()</code> runs the object behaves as a Base.",
          "A call <code>p-&gt;speak()</code> compiles to roughly <code>(*(p-&gt;vptr[i]))(p)</code>: load vptr, load slot i, indirect call."
        ] },
        { svg: `<svg viewBox="0 0 700 235" width="700" class="dg">
  <text class="tx-m" x="85" y="22" text-anchor="middle">Derived object d</text>
  <rect class="box-a" x="20" y="30" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="45" text-anchor="middle" dominant-baseline="middle">vptr</text>
  <rect class="box" x="20" y="60" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="75" text-anchor="middle" dominant-baseline="middle">int x, y</text>
  <text class="tx-m" x="85" y="132" text-anchor="middle">Base object b</text>
  <rect class="box-a" x="20" y="140" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="155" text-anchor="middle" dominant-baseline="middle">vptr</text>
  <rect class="box" x="20" y="170" width="130" height="30" rx="6"/>
  <text class="tx-c" x="85" y="185" text-anchor="middle" dominant-baseline="middle">int x</text>
  <line class="ln-a" x1="150" y1="45" x2="248" y2="45" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="150" y1="155" x2="248" y2="155" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="330" y="22" text-anchor="middle">vtable for Derived</text>
  <rect class="box-g" x="250" y="30" width="160" height="90" rx="6"/>
  <text class="tx-c" x="330" y="45" text-anchor="middle" dominant-baseline="middle">[0] &amp;Derived::speak</text>
  <text class="tx-c" x="330" y="75" text-anchor="middle" dominant-baseline="middle">[1] &amp;Base::eat</text>
  <text class="tx-c" x="330" y="105" text-anchor="middle" dominant-baseline="middle">[2] &amp;Derived::~Derived</text>
  <text class="tx-m" x="330" y="132" text-anchor="middle">vtable for Base</text>
  <rect class="box-p" x="250" y="140" width="160" height="90" rx="6"/>
  <text class="tx-c" x="330" y="155" text-anchor="middle" dominant-baseline="middle">[0] &amp;Base::speak</text>
  <text class="tx-c" x="330" y="185" text-anchor="middle" dominant-baseline="middle">[1] &amp;Base::eat</text>
  <text class="tx-c" x="330" y="215" text-anchor="middle" dominant-baseline="middle">[2] &amp;Base::~Base</text>
  <text class="tx-m" x="430" y="50">One vtable per class, read-only.</text>
  <text class="tx-m" x="430" y="70">One vptr per object, set by ctor.</text>
  <text class="tx-m" x="430" y="90">Derived overrides speak, inherits eat.</text>
  <text class="tx-c" x="430" y="160">p-&gt;speak();</text>
  <text class="tx-c" x="430" y="180">// (*p-&gt;vptr[0])(p)</text>
</svg>`, caption: "Two objects, two vtables. Same slot index, different target function." },
        { code: `class Base {
    int x;
public:
    virtual void speak() {}
    virtual void eat() {}
    virtual ~Base() {}
};
class Derived : public Base {
    int y;
public:
    void speak() override {}     // replaces slot 0 in Derived's vtable
};                               // eat() slot still points to Base::eat

// sizeof(Base) == 16 on 64-bit: 8 (vptr) + 4 (x) + 4 padding`, lang: "cpp" },
        { table: { head: ["Cost", "Detail"], rows: [
          ["Memory per object", "One pointer (8 bytes on 64-bit), per polymorphic base in multiple inheritance"],
          ["Memory per class", "One vtable (plus RTTI info pointer)"],
          ["Call cost", "Two loads + indirect call; usually not inlinable, possible branch mispredict"]
        ] } },
        { tip: "Follow-ups: 'Why can't constructors be virtual?' — the vptr is set <i>by</i> the constructor, so there's no vtable to dispatch through yet. 'Where is the vtable stored?' — in the read-only data segment, emitted in the translation unit containing the first non-inline virtual function (the 'key function')." }
      ]
    },
    {
      id: "rtti-dynamic-cast",
      q: "What is RTTI? How do dynamic_cast and typeid work?",
      topic: "Polymorphism",
      level: 3,
      top: false,
      short: "Run-Time Type Information lets a program query an object's dynamic type. dynamic_cast safely downcasts in a polymorphic hierarchy, returning nullptr for pointers (or throwing std::bad_cast for references) on failure; typeid returns a type_info for the dynamic type. Both need the class to have at least one virtual function.",
      a: [
        { p: "<b>RTTI</b> stores a <code>type_info</code> record for each polymorphic class, reachable from its vtable. It powers <code>dynamic_cast</code>, <code>typeid</code> and exception matching." },
        { code: `#include <iostream>
#include <typeinfo>
struct Animal { virtual ~Animal() = default; };
struct Dog : Animal { void bark() { std::cout << "Woof\\n"; } };
struct Cat : Animal {};

void handle(Animal* a) {
    if (Dog* d = dynamic_cast<Dog*>(a))    // checked downcast
        d->bark();
    else
        std::cout << "not a dog\\n";
    std::cout << typeid(*a).name() << "\\n"; // dynamic type (mangled name)
}

int main() {
    Dog d; Cat c;
    handle(&d);                            // Woof
    handle(&c);                            // not a dog
    try {
        Animal& ref = c;
        Dog& bad = dynamic_cast<Dog&>(ref);  // throws
        (void)bad;
    } catch (const std::bad_cast& e) { std::cout << "bad_cast\\n"; }
}`, lang: "cpp" },
        { table: { head: ["Cast", "Checked at", "Use"], rows: [
          ["<code>static_cast</code>", "Compile time", "Related types when you <i>know</i> it's valid; no runtime cost"],
          ["<code>dynamic_cast</code>", "Run time", "Safe downcast / cross-cast in polymorphic hierarchies"],
          ["<code>const_cast</code>", "Compile time", "Add/remove <code>const</code>"],
          ["<code>reinterpret_cast</code>", "None", "Bit-level reinterpretation; low-level only"]
        ] } },
        { warn: "Needing many <code>dynamic_cast</code>s usually signals a design smell — prefer adding a virtual function. RTTI can be disabled (<code>-fno-rtti</code>) in embedded/game builds. Java's equivalent is <code>instanceof</code> + cast (or pattern matching <code>if (a instanceof Dog d)</code>)." }
      ]
    },

    /* ───────────── Constructors & Destructors ───────────── */
    {
      id: "constructor-types",
      q: "What is a constructor? What are the types of constructors?",
      topic: "Constructors & Destructors",
      level: 1,
      top: true,
      short: "A constructor is a special member function with the class's name and no return type that initialises an object when it is created. C++ types: default, parameterised, copy, move (C++11), plus converting and delegating constructors. Java has default/no-arg and parameterised constructors, with constructor chaining via this() and super().",
      a: [
        { p: "A <b>constructor</b> runs automatically when an object is created, to put it into a valid initial state. It has the same name as the class, no return type (not even <code>void</code>), and can be overloaded." },
        { table: { head: ["Type", "Signature", "Called when"], rows: [
          ["Default", "<code>X()</code>", "<code>X a;</code> — compiler generates one if you declare no constructor"],
          ["Parameterised", "<code>X(int, std::string)</code>", "<code>X a(1, \"s\");</code>"],
          ["Copy", "<code>X(const X&amp;)</code>", "<code>X b = a;</code>, pass/return by value"],
          ["Move (C++11)", "<code>X(X&amp;&amp;) noexcept</code>", "<code>X b = std::move(a);</code>, returning temporaries"],
          ["Converting", "Single-arg, non-<code>explicit</code>", "Implicit conversion <code>X a = 5;</code>"],
          ["Delegating (C++11)", "<code>X() : X(0, \"\") {}</code>", "One constructor calls another"]
        ] } },
        { code: `#include <iostream>
#include <string>
#include <utility>
class Student {
    std::string name;
    int roll;
public:
    Student() : Student("unknown", 0) {}                        // default (delegating)
    Student(std::string n, int r) : name(std::move(n)), roll(r) {} // parameterised
    Student(const Student& o) : name(o.name), roll(o.roll) {       // copy
        std::cout << "copy\\n";
    }
    Student(Student&& o) noexcept                                  // move
        : name(std::move(o.name)), roll(o.roll) {
        std::cout << "move\\n";
    }
};

int main() {
    Student a;                    // default
    Student b("Riya", 7);         // parameterised
    Student c = b;                // copy
    Student d = std::move(b);     // move: b.name is now empty
}`, lang: "cpp" },
        { ul: [
          "If you declare <i>any</i> constructor, the compiler no longer generates the default one — write <code>X() = default;</code> if needed.",
          "Java: no copy/move constructors built into the language (you may write a copy constructor by hand, or use <code>clone()</code>); objects are handled by reference.",
          "Constructors cannot be <code>virtual</code>, <code>static</code> or <code>const</code>, but can be <code>private</code>, <code>explicit</code>, <code>constexpr</code>."
        ] },
        { tip: "Why does a constructor have no return type? It is not called like a normal function; the object's storage already exists and the constructor just initialises it. Failure is signalled by throwing an exception." }
      ]
    },
    {
      id: "shallow-vs-deep-copy",
      q: "What is a copy constructor? Explain shallow copy vs deep copy.",
      topic: "Constructors & Destructors",
      level: 2,
      top: true,
      short: "A copy constructor X(const X&) creates a new object as a copy of an existing one. The compiler-generated one does a member-wise (shallow) copy, so pointer members end up pointing to the same heap memory, causing double deletes and shared mutation. A deep copy allocates new memory and copies the pointed-to data.",
      a: [
        { p: "The <b>copy constructor</b> is invoked when an object is initialised from another of the same type: <code>X b = a;</code>, <code>X b(a);</code>, passing by value, returning by value (unless elided)." },
        { svg: `<svg viewBox="0 0 620 210" width="620" class="dg">
  <text class="tx-m" x="70" y="20" text-anchor="middle">stack</text>
  <text class="tx-m" x="240" y="60" text-anchor="middle">heap</text>
  <rect class="box" x="20" y="30" width="100" height="34" rx="6"/>
  <text class="tx-c" x="70" y="47" text-anchor="middle" dominant-baseline="middle">a.data</text>
  <rect class="box" x="20" y="110" width="100" height="34" rx="6"/>
  <text class="tx-c" x="70" y="127" text-anchor="middle" dominant-baseline="middle">b.data</text>
  <rect class="box-r" x="190" y="70" width="100" height="34" rx="6"/>
  <text class="tx-c" x="240" y="87" text-anchor="middle" dominant-baseline="middle">"Hello"</text>
  <line class="ln" x1="120" y1="47" x2="188" y2="80" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="120" y1="127" x2="188" y2="96" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="155" y="178" text-anchor="middle">Shallow: one shared buffer</text>
  <text class="tx-m" x="155" y="196" text-anchor="middle">double delete, aliasing bugs</text>
  <text class="tx-m" x="390" y="20" text-anchor="middle">stack</text>
  <text class="tx-m" x="560" y="20" text-anchor="middle">heap</text>
  <rect class="box" x="340" y="30" width="100" height="34" rx="6"/>
  <text class="tx-c" x="390" y="47" text-anchor="middle" dominant-baseline="middle">a.data</text>
  <rect class="box" x="340" y="110" width="100" height="34" rx="6"/>
  <text class="tx-c" x="390" y="127" text-anchor="middle" dominant-baseline="middle">b.data</text>
  <rect class="box-g" x="510" y="30" width="100" height="34" rx="6"/>
  <text class="tx-c" x="560" y="47" text-anchor="middle" dominant-baseline="middle">"Hello"</text>
  <rect class="box-g" x="510" y="110" width="100" height="34" rx="6"/>
  <text class="tx-c" x="560" y="127" text-anchor="middle" dominant-baseline="middle">"Hello"</text>
  <line class="ln-a" x1="440" y1="47" x2="508" y2="47" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="440" y1="127" x2="508" y2="127" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="475" y="178" text-anchor="middle">Deep: each owns its buffer</text>
  <text class="tx-m" x="475" y="196" text-anchor="middle">independent lifetimes</text>
</svg>`, caption: "After MyString b = a; with the default (shallow) vs a user-written (deep) copy constructor." },
        { code: `#include <cstring>
class MyString {
    char* data;
public:
    explicit MyString(const char* s) {
        data = new char[std::strlen(s) + 1];
        std::strcpy(data, s);
    }
    // Default (shallow) copy would be:  MyString(const MyString& o) : data(o.data) {}
    MyString(const MyString& o) {                     // DEEP copy
        data = new char[std::strlen(o.data) + 1];
        std::strcpy(data, o.data);
    }
    MyString& operator=(const MyString& o) {          // deep copy-assignment
        if (this != &o) {
            char* fresh = new char[std::strlen(o.data) + 1];
            std::strcpy(fresh, o.data);
            delete[] data;
            data = fresh;
        }
        return *this;
    }
    ~MyString() { delete[] data; }                    // with shallow copy: freed twice!
};`, lang: "cpp" },
        { h: "Why must the parameter be a reference?" },
        { p: "If it were <code>X(X o)</code>, passing the argument by value would itself need a copy constructor call, which would pass by value again … infinite recursion. The compiler rejects it. It is <code>const</code> so that temporaries and const objects can be copied and the source can't be modified." },
        { tip: "Best answer in modern C++: avoid owning raw pointers — use <code>std::string</code>/<code>std::vector</code>/<code>unique_ptr</code> and the compiler-generated copies are already correct (Rule of Zero). In Java, <code>clone()</code> of <code>Object</code> is shallow; deep copy needs manual work or a copy constructor." }
      ]
    },
    {
      id: "initializer-list",
      q: "What is a member initializer list? When is it mandatory?",
      topic: "Constructors & Destructors",
      level: 2,
      top: true,
      short: "The initializer list (after the colon in a constructor) directly initialises members and bases before the constructor body runs, instead of default-constructing then assigning. It is mandatory for const members, reference members, members or bases without a default constructor. Members are always initialised in declaration order, not list order.",
      a: [
        { p: "Members are initialised <b>before</b> the constructor body executes. Assigning in the body means default-construct first, then assign — two steps. The initializer list does it in one step." },
        { code: `#include <string>
class Engine {
public:
    explicit Engine(int hp) {}          // no default constructor
};
class Base {
public:
    explicit Base(int id) {}
};

class Car : public Base {
    const int wheels;                   // const: must be initialised
    int& odometer;                      // reference: must be bound
    Engine engine;                      // no default ctor
    std::string model;
public:
    Car(int& odo, const std::string& m)
        : Base(1),                      // base class constructor
          wheels(4),
          odometer(odo),
          engine(150),
          model(m)                      // efficient: one copy, no default+assign
    {}
};`, lang: "cpp" },
        { h: "Mandatory when" },
        { ul: [
          "<code>const</code> data members",
          "Reference data members",
          "Member objects whose class has no default constructor",
          "Calling a base-class constructor that takes arguments",
          "(Performance) class-type members that are expensive to default-construct"
        ] },
        { warn: "Initialisation order is the <b>declaration order in the class</b>, not the order written in the list. <code>class A { int x; int y; A() : y(5), x(y) {} };</code> reads <code>y</code> before it's initialised — undefined behaviour. Compile with <code>-Wreorder</code>." }
      ]
    },
    {
      id: "constructor-destructor-order",
      q: "In what order are constructors and destructors called in inheritance and composition?",
      topic: "Constructors & Destructors",
      level: 2,
      top: true,
      short: "Construction goes from the inside out: virtual bases, then direct bases in declaration order, then members in declaration order, then the class's own constructor body. Destruction is the exact reverse: own destructor body, members in reverse order, then bases in reverse order.",
      a: [
        { p: "An object is built foundation-first so that when a constructor body runs, everything it might use (bases and members) already exists. Destruction mirrors it." },
        { code: `#include <iostream>
struct Member { Member()  { std::cout << "Member()\\n"; }
                ~Member() { std::cout << "~Member()\\n"; } };
struct Base   { Base()    { std::cout << "Base()\\n"; }
                virtual ~Base() { std::cout << "~Base()\\n"; } };
struct Derived : Base {
    Member m;
    Derived()  { std::cout << "Derived()\\n"; }
    ~Derived() { std::cout << "~Derived()\\n"; }
};

int main() { Derived d; }
/* Output:
Base()
Member()
Derived()
~Derived()
~Member()
~Base()
*/`, lang: "cpp" },
        { ol: [
          "Virtual base classes (depth-first, left-to-right)",
          "Direct non-virtual base classes, in the order listed in the class head",
          "Non-static data members, in declaration order",
          "The constructor body"
        ] },
        { ul: [
          "Local objects in a scope are destroyed in reverse order of creation (stack unwinding).",
          "With multiple inheritance <code>class C : A, B</code>: A(), B(), C() then ~C(), ~B(), ~A().",
          "Java: superclass constructor runs first (implicit <code>super()</code>), then instance initialisers/field initialisers, then the constructor body. There are no destructors; GC reclaims objects in no guaranteed order."
        ] },
        { tip: "If a constructor throws, destructors run for the already-constructed bases and members but <b>not</b> for the object itself (its lifetime never began)." }
      ]
    },
    {
      id: "virtual-destructor",
      q: "Why do we need a virtual destructor? What happens without it?",
      topic: "Constructors & Destructors",
      level: 2,
      top: true,
      short: "If you delete a derived object through a base-class pointer and the base destructor is not virtual, the behaviour is undefined — in practice only the base destructor runs, leaking the derived part's resources. Any class meant to be used polymorphically (has virtual functions) should have a public virtual destructor.",
      a: [
        { p: "<code>delete basePtr;</code> calls the destructor chosen by the <b>static type</b> unless the destructor is virtual. With a non-virtual base destructor, the derived destructor is skipped (formally: undefined behaviour)." },
        { code: `#include <iostream>
class Base {
public:
    ~Base() { std::cout << "~Base\\n"; }            // BUG: not virtual
};
class Derived : public Base {
    int* buffer;
public:
    Derived() : buffer(new int[1000]) {}
    ~Derived() { delete[] buffer; std::cout << "~Derived\\n"; }
};

int main() {
    Base* p = new Derived();
    delete p;          // prints only "~Base"  -> buffer leaked (UB)
}`, lang: "cpp", title: "The bug" },
        { code: `class Base {
public:
    virtual ~Base() { std::cout << "~Base\\n"; }    // FIX
};
// delete p;  now prints "~Derived" then "~Base"`, lang: "cpp", title: "The fix" },
        { ul: [
          "Rule: a base class destructor should be either <b>public and virtual</b> or <b>protected and non-virtual</b> (the latter prevents deletion through the base pointer).",
          "Once a class has any virtual function, adding a virtual destructor costs nothing extra (the vptr already exists).",
          "Don't make destructors virtual in classes not designed for inheritance (value types) — mark them <code>final</code> instead.",
          "<code>std::shared_ptr&lt;Base&gt;(new Derived)</code> happens to call the right destructor even without virtual (it captures the deleter), but <code>unique_ptr&lt;Base&gt;</code> does not."
        ] },
        { tip: "Can constructors be virtual? No. Can destructors be pure virtual? Yes, but they still need a definition. Java needs none of this because there are no destructors and GC frees the whole object." }
      ]
    },
    {
      id: "constructor-virtual-private-static",
      q: "Can a constructor be virtual, private, static, const or inherited?",
      topic: "Constructors & Destructors",
      level: 2,
      top: true,
      short: "Virtual: no — the vptr is set up by the constructor and you always know the exact type being created (use a virtual clone() or factory instead). Private: yes, used for Singleton, factories and static-only classes. Static/const: no. Inherited: not by default; C++11 'using Base::Base;' opts in, Java never inherits constructors.",
      a: [
        { table: { head: ["Question", "C++", "Java", "Reason"], rows: [
          ["Virtual?", "No", "N/A (not methods)", "Virtual dispatch needs a vptr, which the constructor itself initialises; and creation requires knowing the exact type"],
          ["Private?", "Yes", "Yes", "Restrict creation: Singleton, static factory methods, named constructors, utility classes"],
          ["Static?", "No", "No", "A constructor initialises a specific object (<code>this</code>)"],
          ["Const / final?", "No", "No", "Constructor must modify the object; <code>final</code> is meaningless since they aren't inherited"],
          ["Inherited?", "Only with <code>using Base::Base;</code>", "No", "Derived may have extra members to initialise"],
          ["Overloaded?", "Yes", "Yes", "Different parameter lists"],
          ["Return a value?", "No", "No", "No return type at all"]
        ] } },
        { code: [
          { lang: "cpp", src: `#include <memory>
class Shape {
public:
    virtual std::unique_ptr<Shape> clone() const = 0;   // "virtual constructor" idiom
    virtual ~Shape() = default;
};
class Circle : public Shape {
    Circle() = default;                                  // private ctor
public:
    static std::unique_ptr<Circle> create() {            // factory
        return std::unique_ptr<Circle>(new Circle());
    }
    std::unique_ptr<Shape> clone() const override {
        return std::unique_ptr<Shape>(new Circle(*this));
    }
};` },
          { lang: "java", src: `final class MathUtils {
    private MathUtils() {}                  // private: no instances
    static int square(int x) { return x * x; }
}

class Connection {
    private Connection() {}
    static Connection open() { return new Connection(); }   // factory
}` }
        ] },
        { tip: "Can a destructor be private? Yes — then objects can only be created on the heap and destroyed via a member like <code>destroy()</code> (useful for ref-counted objects). Can a destructor be overloaded? No — only one, taking no arguments." }
      ]
    },
    {
      id: "explicit-keyword",
      q: "What is the explicit keyword in C++?",
      topic: "Constructors & Destructors",
      level: 2,
      top: false,
      short: "explicit on a constructor (or conversion operator) prevents the compiler from using it for implicit conversions and copy-initialisation, so a single-argument constructor like Array(int size) can't silently turn an int into an Array. Mark single-argument constructors explicit by default.",
      a: [
        { p: "A constructor that can be called with one argument is a <b>converting constructor</b>: the compiler may use it silently to convert that argument type into the class. <code>explicit</code> disables this." },
        { code: `#include <vector>
class Buffer {
    std::vector<int> data;
public:
    explicit Buffer(int size) : data(size) {}
};
void process(const Buffer& b) {}

class Meter {
public:
    Meter(double v) {}                 // implicit: converting constructor
};
void walk(Meter m) {}

int main() {
    // Buffer b = 10;                  // error: copy-init needs implicit conversion
    Buffer b(10);                      // OK: direct init
    // process(42);                    // error: no silent int -> Buffer
    process(Buffer(42));               // OK: explicit
    walk(3.5);                         // compiles silently: 3.5 -> Meter
}`, lang: "cpp" },
        { ul: [
          "Also applies to conversion operators: <code>explicit operator bool() const</code> allows <code>if (obj)</code> but blocks <code>int x = obj;</code>.",
          "C++20: <code>explicit(condition)</code> for conditional explicitness in templates.",
          "Java has no implicit user-defined conversions, so it needs no such keyword."
        ] },
        { tip: "Real-world bug example: <code>std::vector&lt;int&gt; v = 5;</code> doesn't compile precisely because <code>vector(size_type)</code> is explicit." }
      ]
    },
    {
      id: "rule-of-three-five-zero",
      q: "What are the Rule of Three, Rule of Five and Rule of Zero?",
      topic: "Constructors & Destructors",
      level: 3,
      top: true,
      short: "Rule of Three: if a class needs a user-defined destructor, copy constructor or copy assignment, it probably needs all three. Rule of Five (C++11): add the move constructor and move assignment. Rule of Zero: design classes so they need none of them, by owning resources through RAII members like std::vector, std::string and smart pointers.",
      a: [
        { p: "A class that manually manages a resource (raw memory, file handle, socket) must control what happens on copy, move and destruction; the compiler-generated versions only do member-wise shallow operations." },
        { table: { head: ["Rule", "Special members to define"], rows: [
          ["Three (C++98)", "Destructor, copy constructor, copy assignment"],
          ["Five (C++11)", "The three + move constructor + move assignment"],
          ["Zero", "None — let RAII members handle everything"]
        ] } },
        { code: `#include <algorithm>
#include <cstddef>
#include <utility>
class IntArray {                                   // Rule of Five
    std::size_t n;
    int* p;
public:
    explicit IntArray(std::size_t size) : n(size), p(new int[size]{}) {}
    ~IntArray() { delete[] p; }                                     // 1

    IntArray(const IntArray& o) : n(o.n), p(new int[o.n]) {         // 2
        std::copy(o.p, o.p + n, p);
    }
    IntArray& operator=(IntArray o) noexcept {                      // 3 (+5): copy-and-swap
        swap(o);                                                    // handles copy & move
        return *this;
    }
    IntArray(IntArray&& o) noexcept : n(o.n), p(o.p) {              // 4
        o.n = 0; o.p = nullptr;                                     // leave source valid
    }
    void swap(IntArray& o) noexcept { std::swap(n, o.n); std::swap(p, o.p); }
};

#include <vector>
class IntArray0 {                                  // Rule of Zero
    std::vector<int> v;                            // vector already does all five
public:
    explicit IntArray0(std::size_t n) : v(n) {}
};`, lang: "cpp" },
        { ul: [
          "Declaring a destructor or copy operation <b>suppresses</b> the implicit move operations — moves silently fall back to copies.",
          "Mark move operations <code>noexcept</code>, otherwise <code>std::vector</code> will copy instead of move on reallocation.",
          "Use <code>= default</code> / <code>= delete</code> to state intent (e.g. non-copyable: delete copy ctor and copy assignment)."
        ] },
        { tip: "Interviewers love the copy-and-swap idiom: taking the parameter by value gives strong exception safety and handles self-assignment for free." }
      ]
    },

    /* ───────────── Memory & Pointers ───────────── */
    {
      id: "new-delete-vs-malloc-free",
      q: "What is the difference between new/delete and malloc/free?",
      topic: "Memory & Pointers",
      level: 1,
      top: true,
      short: "new is a C++ operator that allocates memory and calls the constructor, returns a typed pointer and throws std::bad_alloc on failure; delete calls the destructor then frees. malloc/free are C library functions that only allocate/free raw bytes, return void*, and signal failure with NULL. Never mix them.",
      a: [
        { table: { head: ["", "new / delete", "malloc / free"], rows: [
          ["Kind", "Operator (overloadable)", "Library function (<code>&lt;cstdlib&gt;</code>)"],
          ["Constructor / destructor", "Called", "Not called"],
          ["Size", "Computed by compiler from type", "Passed in bytes: <code>malloc(n * sizeof(T))</code>"],
          ["Return type", "Typed <code>T*</code>", "<code>void*</code> (cast needed in C++)"],
          ["Failure", "Throws <code>std::bad_alloc</code> (or <code>nullptr</code> with <code>nothrow</code>)", "Returns <code>NULL</code>"],
          ["Arrays", "<code>new T[n]</code> / <code>delete[]</code>", "Same functions"],
          ["Resize", "No (use <code>std::vector</code>)", "<code>realloc</code>"],
          ["Memory area", "Free store", "Heap"]
        ] } },
        { code: `#include <cstdlib>
#include <string>
struct Node { std::string s; Node() : s("hi") {} };

int main() {
    Node* a = new Node;          // allocates + constructs: a->s == "hi"
    delete a;                    // destroys + frees

    Node* arr = new Node[3];     // 3 constructors
    delete[] arr;                // 3 destructors - must use delete[]

    Node* b = static_cast<Node*>(std::malloc(sizeof(Node)));  // raw bytes, s NOT constructed
    // b->s = "x";               // UB: string never constructed
    std::free(b);
}`, lang: "cpp" },
        { warn: "Mixing is undefined behaviour: <code>delete</code> on <code>malloc</code>ed memory, <code>free</code> on <code>new</code>ed memory, or <code>delete</code> on something from <code>new[]</code>. In modern C++ prefer <code>std::make_unique</code> / containers over any of these." },
        { tip: "Java has only <code>new</code>; there's no <code>delete</code> — the garbage collector reclaims unreachable objects." }
      ]
    },
    {
      id: "references-vs-pointers",
      q: "What is the difference between a reference and a pointer in C++?",
      topic: "Memory & Pointers",
      level: 1,
      top: true,
      short: "A reference is an alias for an existing object: it must be initialised, cannot be null and cannot be reseated. A pointer is a variable holding an address: it can be null, reassigned, do arithmetic, and needs explicit dereferencing. Use references for parameters that must refer to something, pointers when 'nothing' or re-pointing is needed.",
      a: [
        { table: { head: ["", "Reference (<code>T&amp;</code>)", "Pointer (<code>T*</code>)"], rows: [
          ["Initialisation", "Must be initialised at declaration", "Can be declared uninitialised (dangerous)"],
          ["Null", "Cannot be null (no 'null reference' legally)", "Can be <code>nullptr</code>"],
          ["Reseating", "Always refers to the same object", "Can point elsewhere"],
          ["Syntax", "Used like the object: <code>r.x</code>", "Dereference: <code>*p</code>, <code>p-&gt;x</code>"],
          ["Arithmetic", "No", "Yes (<code>p + 1</code>)"],
          ["Multiple levels", "No reference to reference", "<code>int**</code>"],
          ["Arrays of", "Not allowed", "Allowed"],
          ["sizeof", "Size of referred object", "Size of pointer (8 on 64-bit)"]
        ] } },
        { code: `#include <iostream>
void byPtr(int* p) { if (p) *p += 1; }   // may receive nullptr
void byRef(int& r) { r += 1; }           // always a valid int

int main() {
    int a = 10, b = 20;
    int& r = a;      // r is another name for a
    r = b;           // assigns 20 to a - does NOT rebind r
    int* p = &a;
    p = &b;          // p now points to b
    byPtr(nullptr);  // fine
    byRef(a);        // a == 21
    std::cout << a << " " << b << "\\n";  // 21 20
}`, lang: "cpp" },
        { tip: "Java has neither in this sense: all object variables are <i>references</i> that behave like nullable, reseatable pointers without arithmetic, and are passed by value. Follow-up: 'dangling reference' — returning a reference to a local variable is UB." }
      ]
    },
    {
      id: "smart-pointers",
      q: "What are smart pointers? Explain unique_ptr, shared_ptr and weak_ptr.",
      topic: "Memory & Pointers",
      level: 2,
      top: true,
      short: "Smart pointers are RAII wrappers that own a heap object and delete it automatically. unique_ptr has sole, move-only ownership with zero overhead. shared_ptr has shared ownership via an atomic reference count; the object dies when the last owner goes. weak_ptr observes a shared_ptr-managed object without owning it, used to break reference cycles.",
      a: [
        { table: { head: ["", "unique_ptr", "shared_ptr", "weak_ptr"], rows: [
          ["Ownership", "Exclusive", "Shared (ref-counted)", "None (observer)"],
          ["Copyable", "No, move-only", "Yes (count++)", "Yes"],
          ["Overhead", "None vs raw pointer", "Control block, atomic counts", "Uses shared_ptr's control block"],
          ["Create with", "<code>std::make_unique&lt;T&gt;()</code>", "<code>std::make_shared&lt;T&gt;()</code>", "From a <code>shared_ptr</code>"],
          ["Access", "<code>*</code>, <code>-&gt;</code>", "<code>*</code>, <code>-&gt;</code>", "<code>lock()</code> gives a shared_ptr or empty"],
          ["Use for", "Default choice for ownership", "Truly shared lifetime", "Caches, parent back-pointers, observers"]
        ] } },
        { code: `#include <iostream>
#include <memory>
#include <string>
struct Node {
    std::string name;
    std::shared_ptr<Node> next;       // owning
    std::weak_ptr<Node>   prev;        // non-owning: breaks the cycle
    explicit Node(std::string n) : name(std::move(n)) {}
    ~Node() { std::cout << "~" << name << "\\n"; }
};

int main() {
    auto u = std::make_unique<Node>("U");
    // auto u2 = u;                    // error: unique_ptr can't be copied
    auto u2 = std::move(u);            // ownership transferred, u is null

    auto a = std::make_shared<Node>("A");
    auto b = std::make_shared<Node>("B");
    a->next = b;                       // b.use_count() == 2
    b->prev = a;                       // weak: a.use_count() stays 1
    if (auto p = b->prev.lock())       // temporarily promote
        std::cout << "prev = " << p->name << "\\n";
}   // ~A, ~B, ~U all printed. With shared_ptr for prev: A and B would LEAK.`, lang: "cpp" },
        { ul: [
          "Prefer <code>make_unique</code>/<code>make_shared</code>: exception-safe, and <code>make_shared</code> does one allocation for object + control block.",
          "Pass <code>unique_ptr</code> by value to transfer ownership; pass <code>T&amp;</code>/<code>T*</code> when a function just uses the object.",
          "<code>auto_ptr</code> is removed in C++17 (broken copy semantics)."
        ] },
        { warn: "Two <code>shared_ptr</code>s created separately from the same raw pointer (<code>shared_ptr&lt;T&gt;(raw)</code> twice) get two control blocks → double delete. Use <code>enable_shared_from_this</code> to get a shared_ptr to <code>this</code>." }
      ]
    },
    {
      id: "raii",
      q: "What is RAII?",
      topic: "Memory & Pointers",
      level: 2,
      top: false,
      short: "Resource Acquisition Is Initialisation: tie a resource's lifetime to an object's lifetime — acquire it in the constructor and release it in the destructor. Because destructors run automatically when objects go out of scope, even during exceptions, resources can't leak. Smart pointers, lock_guard, fstream and containers are RAII types.",
      a: [
        { p: "C++ guarantees that destructors of fully-constructed automatic objects run when control leaves their scope — by <code>return</code>, <code>break</code> or <b>exception</b> (stack unwinding). RAII exploits this for any resource: memory, files, locks, sockets, DB transactions." },
        { code: `#include <cstdio>
#include <mutex>
#include <stdexcept>
class File {                                    // hand-written RAII wrapper
    std::FILE* f;
public:
    explicit File(const char* path) : f(std::fopen(path, "r")) {
        if (!f) throw std::runtime_error("open failed");
    }
    ~File() { std::fclose(f); }                 // always released
    File(const File&) = delete;                 // non-copyable resource
    File& operator=(const File&) = delete;
    std::FILE* get() const { return f; }
};

std::mutex m;
void work() {
    std::lock_guard<std::mutex> lock(m);        // lock acquired
    File in("data.txt");
    // ... if anything throws here, file is closed and mutex unlocked
}                                               // automatic cleanup, reverse order`, lang: "cpp" },
        { tip: "Java's closest equivalents are <code>try-with-resources</code> (<code>AutoCloseable</code>) and <code>finally</code>; they're explicit at the call site, whereas RAII is automatic. Destructors must not throw — an exception during unwinding calls <code>std::terminate</code>." }
      ]
    },

    /* ───────────── C++ Specifics ───────────── */
    {
      id: "templates-vs-generics",
      q: "What are templates in C++ and generics in Java? How do they differ?",
      topic: "C++ Specifics",
      level: 2,
      top: true,
      short: "Both provide parametric (compile-time) polymorphism: write code once for many types. C++ templates generate a separate specialised copy per type at compile time (monomorphisation), work with primitives and allow specialisation. Java generics use type erasure: one compiled class using Object internally, with type checks at compile time only; primitives need wrapper types.",
      a: [
        { p: "<b>Generic programming</b> lets you write type-independent code — a <code>max</code> function or a <code>Stack</code> class — and have the compiler enforce type safety for each use." },
        { code: [
          { lang: "cpp", src: `#include <iostream>
#include <string>
#include <vector>

template <typename T>
T maxOf(const T& a, const T& b) { return (a < b) ? b : a; }

template <typename T>
class Stack {
    std::vector<T> items;
public:
    void push(const T& x) { items.push_back(x); }
    T pop() { T top = items.back(); items.pop_back(); return top; }
    bool empty() const { return items.empty(); }
};

template <>                                    // full specialisation
const char* maxOf(const char* const& a, const char* const& b) {
    return std::string(a) < std::string(b) ? b : a;
}

int main() {
    std::cout << maxOf(3, 7) << " " << maxOf(2.5, 1.5) << "\\n";  // 7 2.5
    Stack<int> s; s.push(1); s.push(2);
    std::cout << s.pop() << "\\n";                                // 2
}` },
          { lang: "java", src: `import java.util.ArrayList;
import java.util.List;

class Util {
    static <T extends Comparable<T>> T maxOf(T a, T b) {  // bounded type
        return a.compareTo(b) < 0 ? b : a;
    }
}

class Stack<T> {
    private final List<T> items = new ArrayList<>();
    void push(T x) { items.add(x); }
    T pop() { return items.remove(items.size() - 1); }
    boolean isEmpty() { return items.isEmpty(); }
}

// Util.maxOf(3, 7);          // autoboxed to Integer
// Stack<Integer> s = new Stack<>();   // Stack<int> not allowed` }
        ] },
        { table: { head: ["", "C++ templates", "Java generics"], rows: [
          ["Implementation", "Code generated per type (monomorphisation)", "Type erasure: one class, casts inserted"],
          ["Primitive types", "Yes (<code>vector&lt;int&gt;</code>)", "No — wrappers (<code>List&lt;Integer&gt;</code>)"],
          ["Runtime type info", "Full (<code>Stack&lt;int&gt;</code> ≠ <code>Stack&lt;double&gt;</code>)", "Erased: <code>List&lt;String&gt;.class</code> doesn't exist; can't do <code>new T()</code>"],
          ["Constraints", "Duck typing; C++20 <code>concepts</code>", "Bounds: <code>&lt;T extends Comparable&lt;T&gt;&gt;</code>, wildcards <code>? extends</code>/<code>? super</code>"],
          ["Specialisation", "Full and partial", "No"],
          ["Non-type params", "Yes (<code>array&lt;int, 5&gt;</code>)", "No"],
          ["Cost", "Code bloat, longer compile, header-only", "Small bytecode, boxing overhead"]
        ] } },
        { tip: "Templates are compile-time polymorphism: no virtual call overhead and full inlining — that's why the STL is fast. Template errors are notoriously long; C++20 concepts fix that." }
      ]
    },
    {
      id: "exception-handling-oop",
      q: "How does exception handling work in OOP? How do you design custom exceptions?",
      topic: "C++ Specifics",
      level: 2,
      top: true,
      short: "Exceptions separate error handling from normal flow: throw an object, the runtime unwinds the stack (running destructors in C++) until a matching catch. Exceptions are classes in a hierarchy, so you catch by base type polymorphically. Custom exceptions derive from std::exception / std::runtime_error in C++ or Exception / RuntimeException in Java. Catch by reference in C++.",
      a: [
        { p: "When an exception is thrown, control jumps to the nearest enclosing <code>catch</code> whose type matches (including a base class). In C++ every local object between throw and catch is destroyed (<b>stack unwinding</b>), which is why RAII makes code exception-safe." },
        { code: [
          { lang: "cpp", src: `#include <iostream>
#include <stdexcept>
#include <string>

class InsufficientFunds : public std::runtime_error {
    double shortBy;
public:
    explicit InsufficientFunds(double s)
        : std::runtime_error("insufficient funds"), shortBy(s) {}
    double amount() const noexcept { return shortBy; }
};

void withdraw(double bal, double amt) {
    if (amt > bal) throw InsufficientFunds(amt - bal);   // throw by value
}

int main() {
    try {
        withdraw(100, 150);
    } catch (const InsufficientFunds& e) {                // most specific first
        std::cout << e.what() << " by " << e.amount() << "\\n";
    } catch (const std::exception& e) {                   // base: catches the rest
        std::cout << "error: " << e.what() << "\\n";
    } catch (...) {                                       // anything
        std::cout << "unknown\\n";
    }
}` },
          { lang: "java", src: `class InsufficientFundsException extends Exception {    // checked
    private final double shortBy;
    InsufficientFundsException(double shortBy) {
        super("insufficient funds");
        this.shortBy = shortBy;
    }
    double getShortBy() { return shortBy; }
}

class Account {
    void withdraw(double bal, double amt) throws InsufficientFundsException {
        if (amt > bal) throw new InsufficientFundsException(amt - bal);
    }
}

// try { acc.withdraw(100, 150); }
// catch (InsufficientFundsException e) { System.out.println(e.getMessage()); }
// catch (Exception e) { ... }
// finally { /* always runs: cleanup */ }` }
        ] },
        { table: { head: ["", "C++", "Java"], rows: [
          ["Can throw", "Any type (even <code>int</code>)", "Only <code>Throwable</code> subclasses"],
          ["Checked exceptions", "No", "Yes — must be declared with <code>throws</code> or caught"],
          ["Cleanup", "Destructors (RAII)", "<code>finally</code>, try-with-resources"],
          ["No-throw spec", "<code>noexcept</code>", "—"],
          ["Root", "<code>std::exception</code>", "<code>Throwable</code> → <code>Error</code> / <code>Exception</code> → <code>RuntimeException</code>"]
        ] } },
        { warn: "C++: catch by <b>reference</b> (<code>const E&amp;</code>) — catching by value slices derived exceptions and copies. Order catch blocks from most-derived to base, otherwise the base handler swallows everything (Java makes this a compile error)." }
      ]
    },
    {
      id: "name-hiding-cpp",
      q: "What is name hiding in C++ inheritance? Why does a derived overload make base overloads disappear?",
      topic: "C++ Specifics",
      level: 3,
      top: false,
      short: "Name lookup stops at the first scope where the name is found. If a derived class declares any function named f, every base-class f (all overloads, virtual or not) is hidden when looked up through the derived type. Bring them back with 'using Base::f;'.",
      a: [
        { p: "C++ first performs <b>name lookup</b>, then <b>overload resolution</b> only among the names found. Declaring <code>f</code> in Derived means lookup finds Derived's <code>f</code> and never looks in Base." },
        { code: `#include <iostream>
struct Base {
    void f(int)    { std::cout << "Base::f(int)\\n"; }
    void f(double) { std::cout << "Base::f(double)\\n"; }
};
struct Derived : Base {
    void f(const char*) { std::cout << "Derived::f(char*)\\n"; }
};
struct Fixed : Base {
    using Base::f;                      // re-expose all base overloads
    void f(const char*) { std::cout << "Fixed::f(char*)\\n"; }
};

int main() {
    Derived d;
    // d.f(5);                          // error: Base::f(int) is hidden
    d.Base::f(5);                       // qualified call still works
    Fixed x;
    x.f(5);                             // Base::f(int)
    x.f("hi");                          // Fixed::f(char*)
}`, lang: "cpp" },
        { ul: [
          "Also happens with virtual functions: overriding one overload of a virtual set hides the others (compilers warn with <code>-Woverloaded-virtual</code>).",
          "Java does <b>not</b> hide overloads this way: a subclass method with a different signature simply adds an overload."
        ] },
        { tip: "This is why the 'overloading doesn't work across inheritance' claim is heard in interviews — it's name hiding, fixable with a <code>using</code>-declaration." }
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
        { code: [
          { lang: "java", src: `final class Constants {                     // cannot be subclassed
    static final double PI = 3.14159;       // constant
}

class Base {
    final void audit() {}                   // cannot be overridden
}

class Demo {
    void read() {
        final int[] arr = {1, 2};
        arr[0] = 10;                        // OK: object mutable
        // arr = new int[3];                // error: reference is final
        try {
            System.out.println(10 / 0);
        } catch (ArithmeticException e) {
            System.out.println("caught");
        } finally {
            System.out.println("always runs"); // even after return in try
        }
    }
}` },
          { lang: "cpp", src: `// C++ counterparts
class Constants final {                 // C++11: class cannot be derived
public:
    static constexpr double PI = 3.14159;  // const / constexpr for values
};
class Base {
public:
    virtual void audit() final {}       // C++11: cannot be overridden
    virtual ~Base() = default;
};
// No 'finally': destructors (RAII) do the cleanup.
// No 'finalize': destructors run deterministically.` }
        ] },
        { warn: "When does <code>finally</code> NOT run? If <code>System.exit()</code> is called, the JVM crashes, or the thread is killed. A <code>return</code> in <code>finally</code> overrides the try's return and swallows exceptions — avoid it." },
        { tip: "A <code>final</code> reference does not make the object immutable — only the variable can't be reassigned. Blank final fields must be assigned exactly once in every constructor." }
      ]
    },
    {
      id: "super-keyword",
      q: "What is the super keyword in Java? What is the C++ equivalent?",
      topic: "Java Specifics",
      level: 1,
      top: true,
      short: "super refers to the immediate parent class: super(...) calls the parent constructor (must be the first statement; inserted implicitly as super() if omitted), super.method() calls the parent's version of an overridden method, and super.field accesses a hidden parent field. C++ has no super; it uses the base class name: Base::method() and the initializer list for constructors.",
      a: [
        { ul: [
          "<code>super(args)</code> — invoke the parent constructor. Must be the <b>first statement</b>; if absent the compiler inserts <code>super()</code>, which fails to compile if the parent has no no-arg constructor.",
          "<code>super.method()</code> — call the overridden parent implementation (extend, not replace).",
          "<code>super.field</code> — access a parent field hidden by a same-named child field.",
          "<code>this()</code> and <code>super()</code> cannot both appear in one constructor (both must be first).",
          "Not usable in a static context."
        ] },
        { code: [
          { lang: "java", src: `class Employee {
    protected String name;
    Employee(String name) { this.name = name; }
    double salary() { return 50000; }
}

class Manager extends Employee {
    Manager(String name) {
        super(name);                       // parent constructor, first line
    }
    @Override
    double salary() {
        return super.salary() + 20000;     // reuse parent logic
    }
}` },
          { lang: "cpp", src: `class Employee {
protected:
    std::string name;
public:
    explicit Employee(std::string n) : name(std::move(n)) {}
    virtual double salary() const { return 50000; }
    virtual ~Employee() = default;
};

class Manager : public Employee {
public:
    explicit Manager(std::string n) : Employee(std::move(n)) {}  // base ctor
    double salary() const override {
        return Employee::salary() + 20000;                     // qualified call
    }
};` }
        ] },
        { tip: "Why no <code>super</code> in C++? Multiple inheritance — with several bases, 'the' parent is ambiguous, so you name the base explicitly. Some codebases add <code>using super = Employee;</code> as a convention." }
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
        { tip: "How to make your own class immutable: <code>final</code> class, <code>private final</code> fields, no setters, defensive copies of mutable fields in constructor and getters. C++ contrast: <code>std::string</code> is mutable; use <code>const std::string</code> or <code>std::string_view</code>." }
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
        { code: [
          { lang: "java", src: `import java.util.*;

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
}` },
          { lang: "cpp", src: `// C++ equivalent: operator== for equality, std::hash specialisation
// for unordered containers. Same contract: equal => equal hash.
#include <functional>
#include <unordered_set>
struct Point {
    int x, y;
    bool operator==(const Point& o) const { return x == o.x && y == o.y; }
};
namespace std {
template <> struct hash<Point> {
    size_t operator()(const Point& p) const noexcept {
        return hash<int>()(p.x) * 31 + hash<int>()(p.y);
    }
};
}
// std::unordered_set<Point> s{{1, 2}};  s.count({1, 2}) == 1
// Pointer comparison (&a == &b) is the analogue of Java's ==` }
        ] },
        { warn: "Override equals but not hashCode → two 'equal' keys land in different buckets, so <code>HashMap.get</code> returns null and HashSet stores duplicates. Also don't use mutable fields in hashCode for objects stored in hash collections." },
        { tip: "Integer caching trap: <code>Integer a = 127, b = 127; a == b</code> is true but for 128 it's false (cache covers -128..127). Always use <code>equals</code> for wrappers." }
      ]
    },
    {
      id: "garbage-collection",
      q: "How does garbage collection work in Java? How does C++ manage memory instead?",
      topic: "Java Specifics",
      level: 2,
      top: true,
      short: "The JVM's garbage collector automatically frees objects that are no longer reachable from GC roots (stack variables, static fields, active threads). Modern collectors are generational: most objects die young in the Young Generation (cheap minor GCs); survivors are promoted to the Old Generation. C++ has no GC; it uses deterministic destruction, RAII and smart pointers.",
      a: [
        { p: "An object becomes <b>eligible for GC</b> when no chain of references from a <b>GC root</b> reaches it — reference counting is not used, so cycles are collected fine." },
        { ol: [
          "<b>Mark</b>: traverse from roots (local variables on thread stacks, static fields, JNI refs) and mark every reachable object.",
          "<b>Sweep</b>: reclaim unmarked objects.",
          "<b>Compact</b> (optional): move live objects together to avoid fragmentation."
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

        make();                        // 3. local in finished method: unreachable
        System.gc();                   // only a HINT; JVM may ignore it
    }
    static void make() { Object tmp = new Object(); }
}`, lang: "java", title: "Ways an object becomes eligible" },
        { table: { head: ["", "Java", "C++"], rows: [
          ["Freeing", "Automatic, non-deterministic", "Deterministic: scope end or <code>delete</code>"],
          ["Cleanup hook", "try-with-resources / Cleaner", "Destructor"],
          ["Cycles", "Collected", "Leak with <code>shared_ptr</code> unless <code>weak_ptr</code> used"],
          ["Pauses", "GC pauses (G1, ZGC keep them short)", "None"]
        ] } },
        { tip: "Collectors to name: Serial, Parallel, <b>G1</b> (default since Java 9), ZGC / Shenandoah (low-latency). Memory leaks are still possible in Java — e.g. objects kept in a static collection stay reachable forever." }
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
        { tip: "C++ analogue: a base class with pure virtual functions plus some non-pure virtual functions that provide default behaviour." }
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
        { code: [
          { lang: "java", src: `class Parent {
    static void greet()   { System.out.println("Parent static"); }
    void show()           { System.out.println("Parent instance"); }
    private void secret() { }
}
class Child extends Parent {
    static void greet()   { System.out.println("Child static"); }   // hides
    @Override void show() { System.out.println("Child instance"); } // overrides
    private void secret() { }        // new method, not an override
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        p.greet();   // "Parent static"  - reference type decides (hiding)
        p.show();    // "Child instance" - object type decides (overriding)
    }
}` },
          { lang: "cpp", src: `#include <iostream>
struct Parent {
    static void greet() { std::cout << "Parent static\\n"; }
    virtual void show() { std::cout << "Parent instance\\n"; }
    virtual ~Parent() = default;
};
struct Child : Parent {
    static void greet() { std::cout << "Child static\\n"; }   // hides
    void show() override { std::cout << "Child instance\\n"; }
};

int main() {
    Parent* p = new Child;
    p->greet();   // Parent static (static binding)
    p->show();    // Child instance
    delete p;
}` }
        ] },
        { ul: [
          "A static method cannot hide an instance method, and an instance method cannot 'override' a static one — both are compile errors in Java.",
          "Adding <code>@Override</code> to a static method is a compile error — a quick way to prove it's not overriding.",
          "C++ differs: a private virtual function <b>can</b> be overridden (the Non-Virtual Interface idiom relies on it)."
        ] }
      ]
    },
    {
      id: "java-pass-by-value",
      q: "Is Java pass-by-value or pass-by-reference?",
      topic: "Java Specifics",
      level: 2,
      top: false,
      short: "Java is always pass-by-value. For objects, the value passed is a copy of the reference, so a method can mutate the object the caller sees, but reassigning the parameter does not affect the caller's variable. C++ supports true pass-by-reference with T&.",
      a: [
        { p: "Every argument is copied into the parameter. For a primitive, the copy is the number; for an object, the copy is the <b>reference</b> (address). Both the caller and callee references point to the same object, but they are separate variables." },
        { code: [
          { lang: "java", src: `class Box { int v; Box(int v) { this.v = v; } }

public class Main {
    static void mutate(Box b)   { b.v = 99; }          // visible to caller
    static void reassign(Box b) { b = new Box(-1); }   // NOT visible
    static void swap(Box a, Box b) { Box t = a; a = b; b = t; }  // no effect

    public static void main(String[] args) {
        Box x = new Box(1), y = new Box(2);
        mutate(x);     System.out.println(x.v);        // 99
        reassign(x);   System.out.println(x.v);        // 99
        swap(x, y);    System.out.println(x.v + " " + y.v);  // 99 2
    }
}` },
          { lang: "cpp", src: `#include <iostream>
#include <utility>
struct Box { int v; };

void byValue(Box b) { b.v = 99; }          // copy: caller unaffected
void byRef(Box& b)  { b.v = 99; }          // true reference
void swapRef(Box& a, Box& b) { std::swap(a, b); }   // works in C++

int main() {
    Box x{1}, y{2};
    byValue(x);  std::cout << x.v << "\\n";          // 1
    byRef(x);    std::cout << x.v << "\\n";          // 99
    swapRef(x, y); std::cout << x.v << " " << y.v;   // 2 99
}` }
        ] },
        { tip: "The swap test is the proof: you cannot write a working <code>swap(a, b)</code> for two object variables in Java, which you could with real pass-by-reference." }
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
          ["<b>DRY</b>", "One source of truth for each rule/logic", "Same GST calculation copy-pasted in 5 places", "Extract a function / class / constant"],
          ["<b>KISS</b>", "Simplest solution that meets the requirement", "Abstract factory + reflection to create one object", "A plain constructor call"],
          ["<b>YAGNI</b>", "Implement only what is needed now", "Plugin system 'in case we need it later'", "Build it when a real requirement appears"]
        ] } },
        { code: `// Violates DRY: discount rule duplicated
double cartTotal(double amt)    { return amt > 1000 ? amt * 0.9 : amt; }
double invoiceTotal(double amt) { return amt > 1000 ? amt * 0.9 : amt; }

// DRY: single place to change the rule
constexpr double kDiscountThreshold = 1000, kDiscountRate = 0.10;
double applyDiscount(double amt) {
    return amt > kDiscountThreshold ? amt * (1 - kDiscountRate) : amt;
}`, lang: "cpp" },
        { warn: "DRY is about duplicated <b>knowledge</b>, not identical-looking code. Two functions that look alike today but change for different reasons should stay separate — merging them couples unrelated features (the 'wrong abstraction')." },
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
          ["L", "Liskov Substitution", "A subclass must honour the base class's contract"],
          ["I", "Interface Segregation", "Clients shouldn't depend on methods they don't use"],
          ["D", "Dependency Inversion", "High-level modules depend on abstractions; details implement them"]
        ] } },
        { h: "S — Single Responsibility" },
        { code: `// Bad: Invoice calculates, prints and saves (3 reasons to change)
// Good:
class Invoice        { public: double total() const; };
class InvoicePrinter { public: void print(const Invoice&); };
class InvoiceRepo    { public: void save(const Invoice&); };`, lang: "cpp" },
        { h: "O — Open/Closed" },
        { code: `struct Discount { virtual double apply(double amt) const = 0; virtual ~Discount() = default; };
struct Festive : Discount { double apply(double a) const override { return a * 0.8; } };
struct Student : Discount { double apply(double a) const override { return a * 0.9; } };
// New discount = new class. Checkout code (below) never changes, no if/else on type.
double checkout(double amt, const Discount& d) { return d.apply(amt); }`, lang: "cpp" },
        { h: "L — Liskov Substitution" },
        { code: `// Classic violation: Square IS-A Rectangle mathematically, but
class Rectangle { public: virtual void setW(int w) { w_ = w; } virtual void setH(int h) { h_ = h; }
                  int area() const { return w_ * h_; } virtual ~Rectangle() = default;
                  protected: int w_ = 0, h_ = 0; };
class Square : public Rectangle {
public: void setW(int w) override { w_ = h_ = w; }   // changes both!
        void setH(int h) override { w_ = h_ = h; } };
// void f(Rectangle& r) { r.setW(5); r.setH(4); assert(r.area() == 20); }  // fails for Square
// Fix: don't derive Square from Rectangle; both implement an immutable Shape.`, lang: "cpp" },
        { h: "I — Interface Segregation" },
        { code: `// Bad: struct Worker { virtual void work() = 0; virtual void eat() = 0; };  Robot can't eat
struct Workable { virtual void work() = 0; virtual ~Workable() = default; };
struct Eatable  { virtual void eat()  = 0; virtual ~Eatable()  = default; };
struct Human : Workable, Eatable { void work() override {} void eat() override {} };
struct Robot : Workable          { void work() override {} };`, lang: "cpp" },
        { h: "D — Dependency Inversion" },
        { code: `struct MessageSender { virtual void send(const std::string&) = 0; virtual ~MessageSender() = default; };
struct EmailSender : MessageSender { void send(const std::string&) override {} };
struct SmsSender   : MessageSender { void send(const std::string&) override {} };

class OrderService {                   // high-level: knows only the abstraction
    MessageSender& sender;
public:
    explicit OrderService(MessageSender& s) : sender(s) {}   // injected
    void place() { /* ... */ sender.send("Order placed"); }
};`, lang: "cpp" },
        { tip: "Tie each to a benefit: SRP → cohesion, OCP → fewer regressions, LSP → safe polymorphism, ISP/DIP → low coupling and easy mocking in unit tests. Many patterns (Strategy, Observer, Factory) are SOLID in action." }
      ]
    },
    {
      id: "singleton-pattern",
      q: "What is the Singleton pattern? Write a thread-safe Singleton in C++ and Java.",
      topic: "Design Principles & Patterns",
      level: 2,
      top: true,
      short: "Singleton ensures a class has exactly one instance and provides a global access point to it: private constructor, deleted copy, and a static getInstance(). In C++11+ a function-local static (Meyers singleton) is thread-safe. In Java use the holder idiom, an enum, or double-checked locking with a volatile field.",
      a: [
        { p: "Used for truly single resources: configuration, logger, connection pool, cache. Ingredients: <b>private constructor</b>, <b>no copying</b>, <b>static accessor</b> returning the one instance." },
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
        { code: [
          { lang: "cpp", src: `#include <string>
class Logger {
public:
    static Logger& getInstance() {
        static Logger instance;     // C++11: initialised once, thread-safe
        return instance;            // (compiler inserts a guard)
    }
    Logger(const Logger&) = delete;             // no copies
    Logger& operator=(const Logger&) = delete;
    Logger(Logger&&) = delete;
    Logger& operator=(Logger&&) = delete;

    void log(const std::string& msg) { /* ... */ }
private:
    Logger() = default;             // private constructor
    ~Logger() = default;
};

// Logger::getInstance().log("started");` },
          { lang: "java", src: `// 1) Bill Pugh / holder idiom: lazy + thread-safe, no locking
public final class Logger {
    private Logger() {}
    private static class Holder {
        static final Logger INSTANCE = new Logger();  // loaded on first use
    }
    public static Logger getInstance() { return Holder.INSTANCE; }
}

// 2) Double-checked locking (volatile is essential)
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

// 3) Enum: also safe against reflection and serialisation
enum Registry { INSTANCE; void register(String s) {} }` }
        ], title: "Thread-safe Singleton" },
        { warn: "Without <code>volatile</code>, double-checked locking in Java is broken: another thread may see a non-null reference to a partially constructed object due to instruction reordering. Reflection and deserialisation can also break non-enum Java singletons." },
        { tip: "Criticisms to mention: global mutable state, hidden dependencies, hard to unit test (can't mock). Prefer dependency injection of a single instance where possible." }
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
        { code: `#include <memory>
#include <stdexcept>
#include <string>

struct Notification {
    virtual void send(const std::string& msg) = 0;
    virtual ~Notification() = default;
};
struct Email : Notification { void send(const std::string&) override { /* SMTP */ } };
struct Sms   : Notification { void send(const std::string&) override { /* SMS gw */ } };
struct Push  : Notification { void send(const std::string&) override { /* FCM */ } };

class NotificationFactory {
public:
    static std::unique_ptr<Notification> create(const std::string& type) {
        if (type == "email") return std::make_unique<Email>();
        if (type == "sms")   return std::make_unique<Sms>();
        if (type == "push")  return std::make_unique<Push>();
        throw std::invalid_argument("unknown type: " + type);
    }
};

int main() {
    auto n = NotificationFactory::create("sms");   // client knows only the interface
    n->send("OTP 4821");
}`, lang: "cpp", title: "Simple factory" },
        { ul: [
          "Pros: clients depend on the interface only; creation logic in one place; easy to add pooling/caching.",
          "Cons: a simple factory's if-chain must be edited for every new type (use a registration map to stay open/closed).",
          "Real examples: <code>std::make_unique</code>, Java's <code>Calendar.getInstance()</code>, <code>List.of()</code>, JDBC <code>DriverManager.getConnection()</code>."
        ] }
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
  <text class="tx-c" x="105" y="128" text-anchor="middle" dominant-baseline="middle">+ notify()</text>
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
  <text class="tx-m" x="105" y="165" text-anchor="middle">notify(): for each o,</text>
  <text class="tx-m" x="105" y="181" text-anchor="middle">o-&gt;update(price)</text>
</svg>`, caption: "Subject holds a list of Observer interfaces; concrete observers implement update()." },
        { code: `#include <algorithm>
#include <iostream>
#include <vector>

struct Observer {
    virtual void update(double price) = 0;
    virtual ~Observer() = default;
};

class Stock {                                   // Subject
    std::vector<Observer*> observers;
    double price = 0;
public:
    void attach(Observer* o) { observers.push_back(o); }
    void detach(Observer* o) {
        observers.erase(std::remove(observers.begin(), observers.end(), o),
                        observers.end());
    }
    void setPrice(double p) { price = p; notify(); }
private:
    void notify() { for (Observer* o : observers) o->update(price); }
};

struct EmailAlert : Observer {
    void update(double p) override { std::cout << "Email: price " << p << "\\n"; }
};
struct MobileApp : Observer {
    void update(double p) override { std::cout << "Push: price " << p << "\\n"; }
};

int main() {
    Stock infy; EmailAlert e; MobileApp m;
    infy.attach(&e); infy.attach(&m);
    infy.setPrice(1520.5);                      // both notified
    infy.detach(&e);
    infy.setPrice(1531.0);                      // only MobileApp
}`, lang: "cpp" },
        { warn: "Pitfalls: dangling observers if one is destroyed without detaching (use <code>weak_ptr</code> or RAII subscriptions); unexpected update order; memory leaks from forgotten listeners (the 'lapsed listener' problem in Java)." },
        { tip: "Push vs pull model: pass the new data in <code>update()</code> (push) or let observers query the subject (pull). Java examples: <code>PropertyChangeListener</code>, Swing listeners, reactive streams." }
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
        { code: `#include <iostream>
#include <memory>

struct PaymentStrategy {
    virtual void pay(double amount) = 0;
    virtual ~PaymentStrategy() = default;
};
struct UpiPayment  : PaymentStrategy { void pay(double a) override { std::cout << "UPI "  << a << "\\n"; } };
struct CardPayment : PaymentStrategy { void pay(double a) override { std::cout << "Card " << a << "\\n"; } };

class Checkout {                                          // Context
    std::unique_ptr<PaymentStrategy> strategy;
public:
    void setStrategy(std::unique_ptr<PaymentStrategy> s) { strategy = std::move(s); }
    void pay(double amount) { strategy->pay(amount); }    // delegate
};

int main() {
    Checkout c;
    c.setStrategy(std::make_unique<UpiPayment>());
    c.pay(499);
    c.setStrategy(std::make_unique<CardPayment>());       // swap at run time
    c.pay(1299);
}`, lang: "cpp" },
        { table: { head: ["if-else / switch", "Strategy"], rows: [
          ["Every new option edits the same function", "New option = new class (OCP)"],
          ["All algorithms compiled into one place", "Each algorithm isolated and unit-testable"],
          ["Fixed at compile time", "Swappable at run time"],
          ["Fine for 2–3 stable cases", "Better when options grow or vary independently"]
        ] } },
        { tip: "In modern C++/Java a strategy can simply be a <code>std::function</code> / lambda (Java: functional interface such as <code>Comparator</code> — <code>Collections.sort(list, comparator)</code> is the Strategy pattern)." }
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
        { p: "Problem: <code>Pizza(size, cheese, pepperoni, olives, mushrooms, extraSauce)</code> — long, error-prone parameter lists (the <b>telescoping constructor</b> anti-pattern). The Builder collects parameters by name and creates the object in one validated step." },
        { code: [
          { lang: "java", src: `public final class User {
    private final String name;          // required
    private final int age;              // optional
    private final String phone;         // optional

    private User(Builder b) { name = b.name; age = b.age; phone = b.phone; }

    public static class Builder {
        private final String name;
        private int age;
        private String phone = "";
        public Builder(String name) { this.name = name; }
        public Builder age(int a)      { this.age = a; return this; }
        public Builder phone(String p) { this.phone = p; return this; }
        public User build() {
            if (age < 0) throw new IllegalStateException("age");
            return new User(this);
        }
    }
}

// User u = new User.Builder("Asha").age(22).phone("98xxxx").build();` },
          { lang: "cpp", src: `#include <string>
class User {
    std::string name; int age = 0; std::string phone;
    User() = default;
public:
    class Builder;
};

class User::Builder {
    User u;
public:
    explicit Builder(std::string name) { u.name = std::move(name); }
    Builder& age(int a)                 { u.age = a; return *this; }
    Builder& phone(std::string p)       { u.phone = std::move(p); return *this; }
    User build() { return u; }          // validate here
};

// User u = User::Builder("Asha").age(22).phone("98xxxx").build();` }
        ] },
        { tip: "Real examples: Java <code>StringBuilder</code>, <code>HttpRequest.newBuilder()</code>, Lombok <code>@Builder</code>. Contrast with Factory: Factory decides <i>which</i> class to create in one call; Builder controls <i>how</i> one complex object is assembled." }
      ]
    },
    {
      id: "adapter-pattern",
      q: "What is the Adapter pattern?",
      topic: "Design Principles & Patterns",
      level: 2,
      top: false,
      short: "Adapter is a structural pattern that converts the interface of an existing class into the interface a client expects, letting incompatible classes work together without modifying them — like a travel plug adapter. Implemented by wrapping (object adapter, via composition) or by multiple inheritance (class adapter).",
      a: [
        { p: "Typical use: integrating a third-party or legacy class whose method names/types don't match your interface." },
        { code: `#include <iostream>
#include <string>

// Target interface our app uses
struct PaymentGateway {
    virtual bool charge(double rupees) = 0;
    virtual ~PaymentGateway() = default;
};

// Third-party class we cannot change (expects paise, different name)
class LegacyPayApi {
public:
    int makePayment(long paise, const std::string& currency) {
        std::cout << "paid " << paise << " " << currency << "\\n";
        return 0;                                // 0 = success
    }
};

// Object adapter: implements Target, wraps Adaptee
class LegacyPayAdapter : public PaymentGateway {
    LegacyPayApi api;
public:
    bool charge(double rupees) override {
        return api.makePayment(static_cast<long>(rupees * 100), "INR") == 0;
    }
};

int main() {
    LegacyPayAdapter gw;
    PaymentGateway& g = gw;                      // client sees only Target
    g.charge(249.50);
}`, lang: "cpp" },
        { tip: "Java examples: <code>Arrays.asList()</code> (array → List), <code>InputStreamReader</code> (byte stream → char reader). STL example: <code>std::stack</code>/<code>std::queue</code> are 'container adapters' over <code>deque</code>." }
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
        { code: `#include <iostream>
#include <memory>
#include <string>

struct Coffee {
    virtual double cost() const = 0;
    virtual std::string desc() const = 0;
    virtual ~Coffee() = default;
};
struct Espresso : Coffee {
    double cost() const override { return 100; }
    std::string desc() const override { return "Espresso"; }
};

class AddOn : public Coffee {                   // base decorator
protected:
    std::unique_ptr<Coffee> inner;
public:
    explicit AddOn(std::unique_ptr<Coffee> c) : inner(std::move(c)) {}
};
struct Milk : AddOn {
    using AddOn::AddOn;
    double cost() const override { return inner->cost() + 30; }
    std::string desc() const override { return inner->desc() + " + milk"; }
};
struct Caramel : AddOn {
    using AddOn::AddOn;
    double cost() const override { return inner->cost() + 45; }
    std::string desc() const override { return inner->desc() + " + caramel"; }
};

int main() {
    std::unique_ptr<Coffee> c = std::make_unique<Caramel>(
        std::make_unique<Milk>(std::make_unique<Espresso>()));
    std::cout << c->desc() << " = " << c->cost() << "\\n";  // Espresso + milk + caramel = 175
}`, lang: "cpp" },
        { table: { head: ["Inheritance", "Decorator"], rows: [
          ["Behaviour fixed at compile time", "Added/removed at run time"],
          ["N features → up to 2<sup>N</sup> subclasses", "N small decorator classes, combined freely"],
          ["Affects every instance of the subclass", "Affects only the wrapped object"]
        ] } },
        { tip: "Java I/O is the textbook example: <code>new BufferedReader(new InputStreamReader(new FileInputStream(f)))</code>. Difference from Adapter: Decorator keeps the <i>same</i> interface and adds behaviour; Adapter <i>changes</i> the interface." }
      ]
    }
  ]
});
