/* study: Low-Level Design (LLD) — lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-framework",
    subject: "lld",
    title: "The LLD interview framework, SOLID in design & UML class diagrams",
    minutes: 75,
    crux: [
      "An LLD round is ~45 min. Run it in fixed steps: <b>clarify requirements → entities → relationships → class diagram → key flows/APIs → code the core → patterns, concurrency, extensibility</b>. Say each step out loud.",
      "<b>Nouns</b> in the requirements become candidate classes, <b>verbs</b> become methods, and every \"there are several kinds of X\" becomes an interface or abstract class with implementations.",
      "SOLID is how you <i>justify</i> the diagram: one reason to change per class (SRP), new behaviour = new class not an edited <code>if</code> (OCP), depend on interfaces you inject (DIP).",
      "UML: hollow triangle + solid line = <b>inheritance</b>; hollow triangle + dashed line = <b>realisation</b> (implements); plain line/arrow = <b>association</b>; hollow diamond = <b>aggregation</b>; filled diamond = <b>composition</b>. The diamond always sits on the <b>whole</b>.",
      "Composition: the whole creates and owns the part and they die together (ParkingLot → Floor). Aggregation: the part lives independently (Team → Player). Association: one object merely uses/knows another (Ticket → Vehicle).",
      "Finish by naming the shared mutable state, how you protect it (lock / CAS / <code>ConcurrentHashMap</code>), and what changes if a new type is added — that is what separates a hire from a no-hire."
    ],
    sections: [
      { h: "The 7-step framework (use it for every design)", blocks: [
        { p: "Interviewers score LLD on <b>structure and communication</b> as much as on the final classes. Using the same skeleton every time means you never freeze, and the interviewer can follow you. Budget for a 45-minute round:" },
        { table: { head: ["#", "Step", "Time", "What you actually do"], rows: [
          ["1", "Clarify requirements", "5 min", "Ask about scope, actors, scale, and must-have vs nice-to-have. Write a numbered list of functional requirements and 2–3 non-functional ones (thread-safe, extensible)."],
          ["2", "Identify entities", "3–5 min", "Underline nouns → classes. Drop nouns that are just attributes (\"colour\", \"price\")."],
          ["3", "Relationships", "3 min", "For each pair: is-a (inheritance / interface) or has-a (association / aggregation / composition)? With what multiplicity?"],
          ["4", "Class diagram", "7–10 min", "Boxes with the key fields and methods, correct arrows, enums for fixed sets (SpotType, Direction)."],
          ["5", "Key flows / APIs", "5 min", "Walk the 2–3 main use cases as method calls (e.g. <code>park(vehicle)</code> → <code>allocate()</code> → <code>Ticket</code>). A sequence diagram if asked."],
          ["6", "Code the core", "10–15 min", "Interfaces + the 3–5 most important classes. Skip getters, UI, persistence."],
          ["7", "Patterns, concurrency, extensibility", "5 min", "Name the patterns you used and <i>why</i>; point at the shared state and how it is protected; show how a new requirement plugs in."]
        ] } },
        { p: "Good clarifying questions are specific and change the design: <i>\"Multiple entry gates? (→ concurrency)\", \"Different vehicle sizes? (→ spot types)\", \"Pricing by hour or flat? (→ strategy)\", \"Do we need reservations? (→ extra state on the spot)\"</i>." },
        { tip: "Write requirements as a numbered list on the whiteboard/doc and keep referring back: \"This class covers requirement 3.\" It shows you design from requirements, not from memory." },
        { warn: "The most common fail: jumping straight into code (or into a memorised design) without clarifying. The interviewer usually has a twist in mind (e.g. EV charging spots) that you only hear if you ask." }
      ] },
      { h: "From requirements to classes: nouns, verbs, kinds-of", blocks: [
        { p: "Worked example — <b>\"Design a library system.</b> Members can borrow up to 5 books for 14 days. A title may have several physical copies. Late returns are fined ₹10/day. Librarians add books.\"" },
        { ol: [
          "<b>Nouns</b>: library, member, book, copy, loan, fine, librarian, day. <i>Day</i> is an attribute (a date), not a class.",
          "<b>Verbs</b>: borrow, return, fine, add → <code>borrow(member, copy)</code>, <code>returnCopy(loan)</code>, <code>calculateFine(loan)</code>, <code>addBook(...)</code>.",
          "<b>Kinds-of</b>: member and librarian are both kinds of <i>account</i> → <code>abstract class Account</code>. Fine rules may vary (students vs staff) → <code>FinePolicy</code> interface.",
          "<b>Split look-alikes</b>: <code>Book</code> (title, author, ISBN — the catalogue entry) is different from <code>BookCopy</code> (barcode, status — the physical item). Missing this split is the classic mistake."
        ] },
        { table: { head: ["Class", "Responsibility", "Key relationships"], rows: [
          ["<code>Book</code>", "Catalogue info (ISBN, title, author)", "composes 1..* <code>BookCopy</code>"],
          ["<code>BookCopy</code>", "One physical copy, status AVAILABLE/LOANED", "belongs to exactly one <code>Book</code>"],
          ["<code>Member</code> extends <code>Account</code>", "Holds active loans, enforces the 5-book limit", "associated with 0..5 <code>Loan</code>"],
          ["<code>Loan</code>", "Copy + member + issue date + due date", "association to <code>Member</code> and <code>BookCopy</code>"],
          ["<code>FinePolicy</code> (interface)", "Money owed for a late loan", "<code>PerDayFine</code> realises it"],
          ["<code>LibraryService</code>", "Use-case orchestration (borrow / return)", "depends on repositories + <code>FinePolicy</code>"]
        ] } }
      ] },
      { h: "SOLID applied to a design", blocks: [
        { p: "In LLD you rarely <i>recite</i> SOLID; you use it to justify decisions. For each principle, know the smell that violates it and the design move that fixes it:" },
        { table: { head: ["Principle", "Smell in a design", "Design fix (example)"], rows: [
          ["<b>S</b>ingle responsibility", "<code>ParkingLot</code> allocates spots, computes fees, prints receipts and talks to the card machine", "<code>ParkingLot</code> allocates; <code>FeeStrategy</code> prices; <code>PaymentProcessor</code> pays; <code>ReceiptPrinter</code> prints"],
          ["<b>O</b>pen/closed", "<code>if (type == CAR) … else if (type == BIKE) …</code> sprinkled everywhere", "Polymorphism: <code>vehicle.spotNeeded()</code>; a new <code>Truck</code> class needs no edits elsewhere"],
          ["<b>L</b>iskov substitution", "<code>ElectricCar extends Car</code> but <code>refuel()</code> throws <code>UnsupportedOperationException</code>", "Model capabilities separately: <code>Refuelable</code>, <code>Chargeable</code> — only promise what every subtype can do"],
          ["<b>I</b>nterface segregation", "One fat <code>Machine</code> interface with <code>print/scan/fax</code>, forcing a basic printer to stub <code>fax()</code>", "Small role interfaces: <code>Printer</code>, <code>Scanner</code>, <code>Fax</code>; a class implements what it supports"],
          ["<b>D</b>ependency inversion", "<code>Checkout</code> does <code>new UpiClient()</code> inside", "<code>Checkout</code> takes a <code>PaymentMode</code> interface in its constructor (injected); tests pass a fake"]
        ] } },
        { code: `import java.util.*;

// DIP: Checkout depends only on these abstractions, which are injected.
interface PaymentMode { boolean pay(String user, long amountPaise); }
interface DiscountPolicy { long apply(long amountPaise); }

// OCP: new payment modes / discounts are new classes; Checkout never changes.
class UpiPayment implements PaymentMode {
    public boolean pay(String user, long amt) {
        System.out.println("UPI collect request to " + user + " for " + amt + " paise");
        return true;
    }
}
class CardPayment implements PaymentMode {
    public boolean pay(String user, long amt) {
        System.out.println("Card charged for " + user + ": " + amt + " paise");
        return true;
    }
}
class NoDiscount implements DiscountPolicy { public long apply(long a) { return a; } }
class FestiveDiscount implements DiscountPolicy { public long apply(long a) { return a * 90 / 100; } }

// SRP: printing receipts is its own job.
class ReceiptPrinter {
    void print(String user, long amt) { System.out.println("Receipt: " + user + " paid " + amt + " paise"); }
}

class Checkout {
    private final DiscountPolicy discount;
    private final PaymentMode payment;
    private final ReceiptPrinter printer;

    Checkout(DiscountPolicy discount, PaymentMode payment, ReceiptPrinter printer) {
        this.discount = discount; this.payment = payment; this.printer = printer;
    }
    void checkout(String user, long amountPaise) {
        long finalAmount = discount.apply(amountPaise);
        if (payment.pay(user, finalAmount)) printer.print(user, finalAmount);
    }
}

class SolidDemo {
    public static void main(String[] args) {
        new Checkout(new FestiveDiscount(), new UpiPayment(), new ReceiptPrinter()).checkout("riya", 50000);
        new Checkout(new NoDiscount(), new CardPayment(), new ReceiptPrinter()).checkout("arjun", 50000);
    }
}`, lang: "java", title: "SRP + OCP + DIP in one small checkout" },
        { code: `UPI collect request to riya for 45000 paise
Receipt: riya paid 45000 paise
Card charged for arjun: 50000 paise
Receipt: arjun paid 50000 paise`, lang: "text", title: "Output" },
        { tip: "When you add an interface, say which principle it serves: \"FeeStrategy is an interface so weekend pricing is a new class — open/closed.\" One sentence like this per decision is enough." }
      ] },
      { h: "UML class-diagram notation", blocks: [
        { p: "A class is a box with three compartments: <b>name</b>, <b>fields</b>, <b>methods</b>. Prefix members with their visibility. Relationships are lines whose <i>end-shape</i> carries the meaning." },
        { svg: `<svg viewBox="0 0 720 320" width="720" class="dg">
  <rect class="box" x="16" y="20" width="220" height="150" rx="4"/>
  <text class="tx tx-b" x="126" y="37" text-anchor="middle" dominant-baseline="middle">ParkingSpot</text>
  <line class="ln" x1="16" y1="54" x2="236" y2="54"/>
  <text class="tx-c" x="26" y="74">- id : String</text>
  <text class="tx-c" x="26" y="94">- type : SpotType</text>
  <line class="ln" x1="16" y1="106" x2="236" y2="106"/>
  <text class="tx-c" x="26" y="126">+ tryOccupy(v): bool</text>
  <text class="tx-c" x="26" y="146">+ release() : void</text>
  <text class="tx-m" x="126" y="188" text-anchor="middle">name / fields / methods</text>
  <text class="tx-m" x="126" y="206" text-anchor="middle">+ public  - private  # protected</text>
  <text class="tx-m" x="126" y="224" text-anchor="middle">~ package-private</text>
  <text class="tx-m" x="126" y="242" text-anchor="middle">«interface» / «abstract» above name</text>

  <rect class="box" x="262" y="22" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="36" text-anchor="middle" dominant-baseline="middle">Car</text>
  <line class="ln" x1="342" y1="36" x2="420" y2="36"/>
  <polygon class="box" points="420,28 436,36 420,44"/>
  <rect class="box" x="436" y="22" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="36" text-anchor="middle" dominant-baseline="middle">Vehicle</text>
  <text class="tx tx-b" x="528" y="31">Inheritance</text>
  <text class="tx-m" x="528" y="46">is-a (extends)</text>

  <rect class="box" x="262" y="64" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="78" text-anchor="middle" dominant-baseline="middle">UpiPay</text>
  <line class="ln ln-d" x1="342" y1="78" x2="420" y2="78"/>
  <polygon class="box" points="420,70 436,78 420,86"/>
  <rect class="box" x="436" y="64" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="78" text-anchor="middle" dominant-baseline="middle">Payment</text>
  <text class="tx tx-b" x="528" y="73">Realisation</text>
  <text class="tx-m" x="528" y="88">implements an interface</text>

  <rect class="box" x="262" y="106" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="120" text-anchor="middle" dominant-baseline="middle">Ticket</text>
  <line class="ln" x1="342" y1="120" x2="434" y2="120" marker-end="url(#dg-arr)"/>
  <rect class="box" x="436" y="106" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="120" text-anchor="middle" dominant-baseline="middle">Vehicle</text>
  <text class="tx tx-b" x="528" y="115">Association</text>
  <text class="tx-m" x="528" y="130">knows / uses (a field)</text>

  <rect class="box" x="262" y="148" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="162" text-anchor="middle" dominant-baseline="middle">Checkout</text>
  <line class="ln ln-d" x1="342" y1="162" x2="434" y2="162" marker-end="url(#dg-arr)"/>
  <rect class="box" x="436" y="148" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="162" text-anchor="middle" dominant-baseline="middle">Receipt</text>
  <text class="tx tx-b" x="528" y="157">Dependency</text>
  <text class="tx-m" x="528" y="172">uses briefly (param/local)</text>

  <rect class="box" x="262" y="190" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="204" text-anchor="middle" dominant-baseline="middle">Team</text>
  <polygon class="box" points="342,204 356,197 370,204 356,211"/>
  <line class="ln" x1="370" y1="204" x2="436" y2="204"/>
  <rect class="box" x="436" y="190" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="204" text-anchor="middle" dominant-baseline="middle">Player</text>
  <text class="tx tx-b" x="528" y="199">Aggregation</text>
  <text class="tx-m" x="528" y="214">has-a, part lives on</text>

  <rect class="box" x="262" y="232" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="246" text-anchor="middle" dominant-baseline="middle">House</text>
  <polygon class="box-a" points="342,246 356,239 370,246 356,253"/>
  <line class="ln-a" x1="370" y1="246" x2="436" y2="246"/>
  <rect class="box" x="436" y="232" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="246" text-anchor="middle" dominant-baseline="middle">Room</text>
  <text class="tx tx-b" x="528" y="241">Composition</text>
  <text class="tx-m" x="528" y="256">owns, part dies with it</text>

  <rect class="box" x="262" y="276" width="80" height="28" rx="4"/>
  <text class="tx" x="302" y="290" text-anchor="middle" dominant-baseline="middle">Floor</text>
  <polygon class="box-a" points="342,290 356,283 370,290 356,297"/>
  <line class="ln-a" x1="370" y1="290" x2="436" y2="290"/>
  <text class="tx-s" x="376" y="280">1</text>
  <text class="tx-s" x="408" y="280">1..*</text>
  <rect class="box" x="436" y="276" width="80" height="28" rx="4"/>
  <text class="tx" x="476" y="290" text-anchor="middle" dominant-baseline="middle">Spot</text>
  <text class="tx tx-b" x="528" y="285">Multiplicity</text>
  <text class="tx-m" x="528" y="300">1 floor has 1..* spots</text>
</svg>`, caption: "Legend: a class box and the six relationship ends. Triangles point at the parent/interface; diamonds sit on the whole; multiplicity is written at each end." },
        { table: { head: ["Multiplicity", "Meaning", "Example"], rows: [
          ["<code>1</code>", "exactly one", "a Ticket has 1 Vehicle"],
          ["<code>0..1</code>", "optional", "a Spot has 0..1 parked Vehicle"],
          ["<code>*</code> or <code>0..*</code>", "any number", "a Member has 0..* Loans"],
          ["<code>1..*</code>", "at least one", "a ParkingLot has 1..* Floors"],
          ["<code>0..5</code>", "bounded range", "a Member has at most 5 active Loans"]
        ] } },
        { ul: [
          "Abstract class: name in <i>italics</i> or tagged «abstract». Interface: tagged «interface». Static member: <u>underlined</u>.",
          "Enums get their own small box tagged «enum» listing the constants.",
          "Arrow direction on an association = <b>navigability</b>: <code>Ticket → Vehicle</code> means Ticket holds a reference to Vehicle, not the other way round.",
          "In an interview, show only the fields and methods that matter to the flows. A diagram with 40 getters is harder to read, not more complete."
        ] }
      ] },
      { h: "Association vs aggregation vs composition", blocks: [
        { p: "All three are <b>has-a / uses</b> relations; they differ in <b>ownership</b> and <b>lifetime</b>. Ask one question: <i>\"If the whole is destroyed, is the part destroyed too — and does anybody else hold the part?\"</i>" },
        { table: { head: ["", "Association", "Aggregation", "Composition"], rows: [
          ["Meaning", "uses / knows", "whole–part, shared", "whole–part, exclusive"],
          ["Lifetime", "independent", "part outlives whole", "part dies with whole"],
          ["Who creates the part?", "someone else", "someone else, passed in", "the whole (<code>new</code> inside)"],
          ["UML end", "plain line / arrow", "hollow diamond at whole", "filled diamond at whole"],
          ["LLD examples", "Ticket → Vehicle, Driver → Car", "Team ◇ Player, Playlist ◇ Song, Show ◇ Movie", "ParkingLot ◆ Floor, Order ◆ OrderLine, Board ◆ Cell"]
        ] } },
        { code: `import java.util.*;

class Vehicle { final String plate; Vehicle(String plate) { this.plate = plate; } }
class Player  { final String name;  Player(String name)  { this.name = name; } }
class Floor   { final int no;       Floor(int no)        { this.no = no; } }

// ASSOCIATION: Ticket just refers to a Vehicle that exists on its own.
class Ticket {
    private final Vehicle vehicle;
    Ticket(Vehicle vehicle) { this.vehicle = vehicle; }
    String plate() { return vehicle.plate; }
}

// AGGREGATION: players are created outside and may join another team later.
class Team {
    private final List<Player> players = new ArrayList<>();
    void add(Player p) { players.add(p); }
    int size() { return players.size(); }
}

// COMPOSITION: the lot creates its floors and never hands them out; no lot, no floors.
class ParkingLot {
    private final List<Floor> floors = new ArrayList<>();
    ParkingLot(int count) { for (int i = 0; i < count; i++) floors.add(new Floor(i)); }
    int floorCount() { return floors.size(); }
}

class RelationsDemo {
    public static void main(String[] args) {
        Vehicle v = new Vehicle("KA01AB1234");
        System.out.println("ticket for " + new Ticket(v).plate());
        Player virat = new Player("Virat");
        Team rcb = new Team(); rcb.add(virat);
        Team india = new Team(); india.add(virat);           // same part, two wholes
        System.out.println("teams share a player: " + rcb.size() + " " + india.size());
        System.out.println("floors: " + new ParkingLot(3).floorCount());
    }
}`, lang: "java", title: "The three relations in Java code" },
        { warn: "In Java every field is a reference, so the code for aggregation and composition can look identical. The difference is the <i>contract</i>: composition means the whole creates the part and never leaks it (no getter returning the internal list)." }
      ] },
      { h: "Concurrency and extensibility: the last 5 minutes", blocks: [
        { p: "Almost every LLD question has a hidden concurrency angle. Finding it yourself scores more than answering it when asked." },
        { table: { head: ["Design", "Shared mutable state", "What to say"], rows: [
          ["Parking lot", "a free spot seen by two entry gates", "Allocate with an atomic compare-and-set on the spot (or lock per floor); never lock the whole lot"],
          ["BookMyShow", "seats of one show", "Hold seats with expiry; DB row lock (<code>SELECT … FOR UPDATE</code>) or optimistic conditional update"],
          ["Splitwise", "balances of a group", "Update balances inside one transaction per expense; amounts in paise (<code>long</code>)"],
          ["Elevator", "request queues of each car", "One controller thread per car consuming a thread-safe queue, or synchronized <code>addStop</code>"],
          ["Logger", "the output stream", "Synchronized appenders or an async queue with one writer thread"]
        ] } },
        { ul: [
          "<b>Java toolkit</b>: <code>synchronized</code>/<code>ReentrantLock</code> (mutual exclusion), <code>AtomicInteger</code>/<code>AtomicReference.compareAndSet</code> (lock-free single variable), <code>ConcurrentHashMap.compute</code> (atomic per-key update), <code>BlockingQueue</code> (producer–consumer).",
          "<b>Granularity</b>: lock the smallest thing that keeps the invariant (a spot, a show) — a global lock is correct but kills throughput.",
          "<b>Extensibility check</b>: pick two likely changes (new vehicle type, new pricing) and show that each is \"add one class\", not \"edit five\"."
        ] },
        { tip: "A strong close: \"Patterns used: Strategy for pricing, Factory for vehicles. Shared state is the spot; I use CAS so two gates can't both take it. To add EV charging I'd add a spot type and a charging fee decorator.\"" }
      ] }
    ],
    practice: [
      { q: "Classify each relationship: (a) Order–OrderLine, (b) Department–Professor, (c) Doctor–Patient, (d) Car–Engine in a car-manufacturing system, (e) Playlist–Song.", a: "(a) <b>Composition</b> — order lines are created by and meaningless without the order. (b) <b>Aggregation</b> — professors exist if the department closes. (c) <b>Association</b> — they interact but neither owns the other. (d) <b>Composition</b> — the engine is built into this car's lifecycle (in a scrapyard system where engines are resold it would be aggregation — context decides). (e) <b>Aggregation</b> — deleting a playlist doesn't delete songs." },
      { q: "A class <code>Report</code> has <code>generate()</code>, <code>saveToPdf()</code> and <code>emailTo(address)</code>. Which principle is violated and how do you fix it?", a: "<b>SRP</b> — three reasons to change (content logic, file format, mail transport). Split into <code>Report</code> (data/generation), a <code>ReportExporter</code> interface with <code>PdfExporter</code>, and an <code>EmailSender</code>. The exporter interface also gives OCP: an <code>ExcelExporter</code> is a new class." },
      { q: "Draw (in words) the UML: <code>Shape</code> is abstract with <code>area()</code>; <code>Circle</code> and <code>Square</code> extend it; <code>Shape</code> implements the interface <code>Drawable</code>; a <code>Canvas</code> holds any number of shapes that can also be moved to another canvas.", a: "Box <i>Shape</i> (italics or «abstract») with <code>+ area(): double</code>. <code>Circle</code> and <code>Square</code> each connect to Shape with a <b>solid line + hollow triangle</b> at Shape. Shape connects to «interface» Drawable with a <b>dashed line + hollow triangle</b> at Drawable. Canvas connects to Shape with a <b>hollow diamond at Canvas</b> (aggregation, shapes can move) and multiplicity <code>1</code> near Canvas, <code>0..*</code> near Shape." },
      { q: "Mid-interview the interviewer asks: \"Two cars arrive at two gates at the same time and there is one spot left. What happens in your design?\" Give the answer you would say.", a: "\"Allocation is the critical section. Each spot holds an <code>AtomicReference&lt;Vehicle&gt;</code>; a gate claims it with <code>compareAndSet(null, vehicle)</code>. Only one CAS can succeed; the loser sees false and moves on to the next spot or gets 'lot full'. I avoid a lot-wide lock so different floors/spots don't block each other. If spots were in a DB I'd use a conditional <code>UPDATE … WHERE status='FREE'</code> and check the affected row count.\"" },
      { q: "Why is <code>ElectricCar extends Car</code> with <code>refuel()</code> throwing an exception a design problem, and what would you draw instead?", a: "It breaks <b>Liskov substitution</b>: code holding a <code>Car</code> reference and calling <code>refuel()</code> crashes when handed an <code>ElectricCar</code>. Draw capability interfaces: <code>Car</code> (common behaviour), «interface» <code>Refuelable</code> and «interface» <code>Chargeable</code>; <code>PetrolCar</code> realises Refuelable, <code>ElectricCar</code> realises Chargeable. Callers depend on the capability they need (ISP)." }
    ],
    related: ["oops:solid-principles", "oops:association-aggregation-composition", "oops:is-a-vs-has-a", "oops:composition-over-inheritance", "oops:coupling-cohesion", "oops:abstract-class-vs-interface", "oops:dry-kiss-yagni", "se:uml-diagrams", "sd:design-parking-lot"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-parking-lot",
    subject: "lld",
    title: "Design a Parking Lot — full walkthrough with compiling core classes",
    minutes: 90,
    crux: [
      "Clarify first: floors, spot sizes, vehicle types, number of gates, pricing rule, payment modes. The answers decide your enums and strategies.",
      "Core classes: <code>ParkingLot</code> ◆ <code>ParkingFloor</code> ◆ <code>ParkingSpot</code> (composition chain), <code>Vehicle</code> hierarchy, <code>Ticket</code>, <code>FeeStrategy</code>, <code>PaymentProcessor</code>, entry/exit gates.",
      "Two key flows: <b>park</b> (find spot → occupy → issue ticket) and <b>unpark</b> (close ticket → compute fee → pay → free spot).",
      "Patterns: <b>Strategy</b> for pricing and spot allocation, <b>Factory</b> for vehicles, optional <b>Observer</b> for display boards. Be careful with Singleton: it makes testing harder.",
      "Concurrency: two gates racing for the last spot. Occupy with <code>AtomicReference.compareAndSet</code> (or a per-floor lock) — never one global lock.",
      "Fee example to remember: 10:00 → 12:10 = 130 min → ceil to 3 h → 3 × ₹20 = ₹60 for a car."
    ],
    sections: [
      { h: "Step 1–2: requirements and entities", blocks: [
        { p: "Ask, then write down the answers you'll design for. A typical agreed scope:" },
        { ol: [
          "The lot has multiple floors; each floor has spots of type SMALL (bikes), MEDIUM (cars), LARGE (trucks/buses).",
          "A vehicle is parked in the first free spot of its size, lowest floor first.",
          "Multiple entry and exit gates operate concurrently.",
          "Entry issues a ticket (id, vehicle, spot, entry time). Exit computes the fee and takes payment (cash/card/UPI).",
          "Hourly pricing per vehicle type; a partial hour is billed as a full hour, minimum 1 hour.",
          "Show free-spot counts per type (display board).",
          "Out of scope unless asked: reservations, monthly passes, EV charging, lost tickets."
        ] },
        { table: { head: ["Entity", "Responsibility", "Type"], rows: [
          ["<code>ParkingLot</code>", "Entry point: <code>park()</code>, <code>unpark()</code>, free counts; owns floors and active tickets", "class"],
          ["<code>ParkingFloor</code>", "Owns its spots; finds and claims a free spot of a type", "class"],
          ["<code>ParkingSpot</code>", "id, type, occupant; atomic occupy/release", "class"],
          ["<code>Vehicle</code> → <code>Bike</code>, <code>Car</code>, <code>Truck</code>", "plate, type, which spot size it needs", "abstract class + subclasses"],
          ["<code>Ticket</code>", "id, vehicle, spot, entry time", "class (immutable)"],
          ["<code>FeeStrategy</code> → <code>HourlyFee</code>", "compute amount for a ticket at exit", "interface + impl"],
          ["<code>PaymentProcessor</code> → Cash/Card/UPI", "take payment", "interface + impls"],
          ["<code>EntryGate</code>, <code>ExitGate</code>", "thin adapters calling the lot (one per physical gate)", "class"],
          ["<code>SpotType</code>, <code>VehicleType</code>", "fixed sets", "enum"]
        ] } }
      ] },
      { h: "Step 3–4: class diagram", blocks: [
        { svg: `<svg viewBox="0 0 720 340" width="720" class="dg">
  <rect class="box" x="150" y="16" width="120" height="36" rx="4"/>
  <text class="tx" x="210" y="34" text-anchor="middle" dominant-baseline="middle">EntryGate</text>
  <rect class="box" x="450" y="16" width="120" height="36" rx="4"/>
  <text class="tx" x="510" y="34" text-anchor="middle" dominant-baseline="middle">ExitGate</text>
  <line class="ln" x1="220" y1="52" x2="310" y2="98" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="500" y1="52" x2="410" y2="98" marker-end="url(#dg-arr)"/>

  <rect class="box-a" x="260" y="100" width="200" height="40" rx="4"/>
  <text class="tx tx-b" x="360" y="120" text-anchor="middle" dominant-baseline="middle">ParkingLot</text>

  <rect class="box" x="20" y="100" width="140" height="40" rx="4"/>
  <text class="tx" x="90" y="120" text-anchor="middle" dominant-baseline="middle">Ticket</text>
  <polygon class="box" points="260,120 246,113 232,120 246,127"/>
  <line class="ln" x1="232" y1="120" x2="160" y2="120"/>
  <text class="tx-s" x="166" y="112">0..*</text>

  <rect class="box" x="560" y="100" width="150" height="40" rx="4"/>
  <text class="tx-m" x="635" y="112" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="635" y="128" text-anchor="middle" dominant-baseline="middle">FeeStrategy</text>
  <line class="ln" x1="460" y1="120" x2="558" y2="120" marker-end="url(#dg-arr)"/>

  <polygon class="box-a" points="360,140 368,150 360,160 352,150"/>
  <line class="ln-a" x1="360" y1="160" x2="360" y2="190"/>
  <text class="tx-s" x="368" y="184">1..*</text>
  <rect class="box" x="260" y="190" width="200" height="40" rx="4"/>
  <text class="tx" x="360" y="210" text-anchor="middle" dominant-baseline="middle">ParkingFloor</text>

  <polygon class="box-a" points="360,230 368,240 360,250 352,240"/>
  <line class="ln-a" x1="360" y1="250" x2="360" y2="280"/>
  <text class="tx-s" x="368" y="274">1..*</text>
  <rect class="box" x="260" y="280" width="200" height="40" rx="4"/>
  <text class="tx" x="360" y="300" text-anchor="middle" dominant-baseline="middle">ParkingSpot</text>

  <rect class="box" x="20" y="190" width="140" height="40" rx="4"/>
  <text class="tx-m" x="90" y="202" text-anchor="middle" dominant-baseline="middle">«abstract»</text>
  <text class="tx" x="90" y="218" text-anchor="middle" dominant-baseline="middle">Vehicle</text>
  <line class="ln" x1="90" y1="140" x2="90" y2="188" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="150" y1="140" x2="258" y2="290" marker-end="url(#dg-arr)"/>

  <polygon class="box" points="90,230 82,246 98,246"/>
  <line class="ln" x1="90" y1="246" x2="90" y2="262"/>
  <line class="ln" x1="42" y1="262" x2="192" y2="262"/>
  <line class="ln" x1="42" y1="262" x2="42" y2="284"/>
  <line class="ln" x1="117" y1="262" x2="117" y2="284"/>
  <line class="ln" x1="192" y1="262" x2="192" y2="284"/>
  <rect class="box" x="12" y="284" width="60" height="32" rx="4"/>
  <text class="tx" x="42" y="300" text-anchor="middle" dominant-baseline="middle">Bike</text>
  <rect class="box" x="87" y="284" width="60" height="32" rx="4"/>
  <text class="tx" x="117" y="300" text-anchor="middle" dominant-baseline="middle">Car</text>
  <rect class="box" x="162" y="284" width="60" height="32" rx="4"/>
  <text class="tx" x="192" y="300" text-anchor="middle" dominant-baseline="middle">Truck</text>

  <rect class="box" x="560" y="190" width="150" height="40" rx="4"/>
  <text class="tx" x="635" y="210" text-anchor="middle" dominant-baseline="middle">HourlyFee</text>
  <line class="ln ln-d" x1="635" y1="190" x2="635" y2="156"/>
  <polygon class="box" points="635,140 627,156 643,156"/>

  <rect class="box" x="560" y="280" width="150" height="40" rx="4"/>
  <text class="tx-m" x="635" y="292" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="635" y="308" text-anchor="middle" dominant-baseline="middle">PaymentProcessor</text>
  <line class="ln ln-d" x1="440" y1="140" x2="580" y2="278" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Parking lot class diagram. Filled diamonds: the lot owns floors, a floor owns spots. Hollow diamond: the lot keeps active tickets. Ticket → Vehicle and Ticket → Spot are associations. Dashed arrow: unpark() depends on a PaymentProcessor passed in." },
        { ul: [
          "<b>Composition</b> <code>ParkingLot ◆ ParkingFloor ◆ ParkingSpot</code>: spots are created by their floor and have no meaning outside it.",
          "<b>Association</b> <code>Ticket → Vehicle</code>, <code>Ticket → ParkingSpot</code>: the ticket references things it doesn't own.",
          "<b>Inheritance</b> for vehicles because each subtype answers <code>spotNeeded()</code> differently (OCP: a new <code>Bus</code> is one new class). An enum-only design is also acceptable if vehicles have no behaviour — say so.",
          "<b>Realisation</b> <code>HourlyFee ⇢ FeeStrategy</code>: weekend or flat pricing is another implementation."
        ] }
      ] },
      { h: "Step 5: the two key flows", blocks: [
        { h: "park(vehicle) — at the entry gate" },
        { ol: [
          "<code>EntryGate.enter(vehicle)</code> calls <code>lot.park(vehicle, now)</code>.",
          "The lot asks each floor (lowest first) to <code>allocate(vehicle)</code>.",
          "The floor scans spots of <code>vehicle.spotNeeded()</code> and calls <code>spot.tryOccupy(vehicle)</code> — an atomic CAS. First success wins.",
          "The lot creates a <code>Ticket</code> with a unique id and stores it in <code>activeTickets</code> (a <code>ConcurrentHashMap</code>).",
          "No spot on any floor → <code>ParkingFullException</code>, gate shows \"FULL\"."
        ] },
        { h: "unpark(ticketId) — at the exit gate" },
        { ol: [
          "<code>activeTickets.remove(id)</code> — removing first means the same ticket can't be used at two exits.",
          "<code>fee = feeStrategy.fee(ticket, exitTime)</code>.",
          "<code>paymentProcessor.pay(fee)</code>; on failure put the ticket back and report the error.",
          "<code>spot.release()</code> — the spot is free for the next vehicle."
        ] },
        { p: "Fee worked example (car, ₹20/h, partial hour = full hour): entry 10:00, exit 12:10 → 130 minutes → <code>(130 + 59) / 60 = 3</code> hours → 3 × 20 = <b>₹60</b>. A bike staying 20 minutes: <code>max(1, (20+59)/60) = 1</code> hour → ₹10." }
      ] },
      { h: "Step 6: core classes (compiles and runs)", blocks: [
        { code: `import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

enum VehicleType { BIKE, CAR, TRUCK }
enum SpotType { SMALL, MEDIUM, LARGE }

abstract class Vehicle {
    private final String plate;
    protected Vehicle(String plate) { this.plate = plate; }
    String plate() { return plate; }
    abstract VehicleType type();
    abstract SpotType spotNeeded();
}
class Bike extends Vehicle {
    Bike(String plate) { super(plate); }
    VehicleType type() { return VehicleType.BIKE; }
    SpotType spotNeeded() { return SpotType.SMALL; }
}
class Car extends Vehicle {
    Car(String plate) { super(plate); }
    VehicleType type() { return VehicleType.CAR; }
    SpotType spotNeeded() { return SpotType.MEDIUM; }
}
class Truck extends Vehicle {
    Truck(String plate) { super(plate); }
    VehicleType type() { return VehicleType.TRUCK; }
    SpotType spotNeeded() { return SpotType.LARGE; }
}

class ParkingSpot {
    private final String id;
    private final SpotType type;
    private final AtomicReference<Vehicle> occupant = new AtomicReference<>();
    ParkingSpot(String id, SpotType type) { this.id = id; this.type = type; }
    String id() { return id; }
    SpotType type() { return type; }
    boolean isFree() { return occupant.get() == null; }
    // Atomic claim: if two gates race for this spot, exactly one CAS succeeds.
    boolean tryOccupy(Vehicle v) { return occupant.compareAndSet(null, v); }
    void release() { occupant.set(null); }
}

class ParkingFloor {
    private final int number;
    private final List<ParkingSpot> spots = new ArrayList<>();   // composition

    ParkingFloor(int number, Map<SpotType, Integer> layout) {
        this.number = number;
        for (Map.Entry<SpotType, Integer> e : layout.entrySet())
            for (int i = 1; i <= e.getValue(); i++)
                spots.add(new ParkingSpot(number + "-" + e.getKey().name().charAt(0) + i, e.getKey()));
    }
    Optional<ParkingSpot> allocate(Vehicle v) {
        for (ParkingSpot s : spots)
            if (s.type() == v.spotNeeded() && s.isFree() && s.tryOccupy(v)) return Optional.of(s);
        return Optional.empty();
    }
    long free(SpotType t) { return spots.stream().filter(s -> s.type() == t && s.isFree()).count(); }
}

final class Ticket {
    private final String id;
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final Instant entry;
    Ticket(String id, Vehicle vehicle, ParkingSpot spot, Instant entry) {
        this.id = id; this.vehicle = vehicle; this.spot = spot; this.entry = entry;
    }
    String id() { return id; }
    Vehicle vehicle() { return vehicle; }
    ParkingSpot spot() { return spot; }
    Instant entry() { return entry; }
}

interface FeeStrategy { long fee(Ticket t, Instant exit); }

class HourlyFee implements FeeStrategy {
    private final Map<VehicleType, Long> ratePerHour = new EnumMap<>(VehicleType.class);
    HourlyFee() {
        ratePerHour.put(VehicleType.BIKE, 10L);
        ratePerHour.put(VehicleType.CAR, 20L);
        ratePerHour.put(VehicleType.TRUCK, 50L);
    }
    public long fee(Ticket t, Instant exit) {
        long minutes = Duration.between(t.entry(), exit).toMinutes();
        long hours = Math.max(1, (minutes + 59) / 60);      // partial hour billed as a full hour
        return hours * ratePerHour.get(t.vehicle().type());
    }
}

interface PaymentProcessor { boolean pay(long amount); }
class CashPayment implements PaymentProcessor {
    public boolean pay(long amount) { System.out.println("Cash received: Rs " + amount); return true; }
}

class ParkingFullException extends RuntimeException {
    ParkingFullException(String msg) { super(msg); }
}

class ParkingLot {
    private final List<ParkingFloor> floors = new ArrayList<>();          // composition
    private final Map<String, Ticket> activeTickets = new ConcurrentHashMap<>();
    private final AtomicLong ticketSeq = new AtomicLong();
    private final FeeStrategy feeStrategy;

    ParkingLot(int floorCount, Map<SpotType, Integer> layoutPerFloor, FeeStrategy feeStrategy) {
        for (int i = 0; i < floorCount; i++) floors.add(new ParkingFloor(i, layoutPerFloor));
        this.feeStrategy = feeStrategy;
    }

    Ticket park(Vehicle v, Instant now) {
        for (ParkingFloor floor : floors) {                 // lowest floor first
            Optional<ParkingSpot> spot = floor.allocate(v);
            if (spot.isPresent()) {
                Ticket t = new Ticket("T" + ticketSeq.incrementAndGet(), v, spot.get(), now);
                activeTickets.put(t.id(), t);
                return t;
            }
        }
        throw new ParkingFullException("No " + v.spotNeeded() + " spot for " + v.plate());
    }

    long unpark(String ticketId, Instant exit, PaymentProcessor payment) {
        Ticket t = activeTickets.remove(ticketId);         // remove first: a ticket can be used once
        if (t == null) throw new IllegalArgumentException("Unknown or used ticket " + ticketId);
        long amount = feeStrategy.fee(t, exit);
        if (!payment.pay(amount)) {
            activeTickets.put(ticketId, t);
            throw new IllegalStateException("Payment failed");
        }
        t.spot().release();
        return amount;
    }

    long freeSpots(SpotType type) { return floors.stream().mapToLong(f -> f.free(type)).sum(); }
}

class ParkingLotDemo {
    public static void main(String[] args) {
        Map<SpotType, Integer> layout = new EnumMap<>(SpotType.class);
        layout.put(SpotType.SMALL, 2);
        layout.put(SpotType.MEDIUM, 1);
        layout.put(SpotType.LARGE, 1);
        ParkingLot lot = new ParkingLot(2, layout, new HourlyFee());

        Instant t0 = Instant.parse("2026-01-01T10:00:00Z");
        Ticket a = lot.park(new Car("KA01AB1234"), t0);
        Ticket b = lot.park(new Car("MH12XY9999"), t0);
        System.out.println(a.id() + " -> spot " + a.spot().id());
        System.out.println(b.id() + " -> spot " + b.spot().id());
        try {
            lot.park(new Car("DL3C0001"), t0);
        } catch (ParkingFullException e) {
            System.out.println(e.getMessage());
        }
        long fee = lot.unpark(a.id(), t0.plus(Duration.ofMinutes(130)), new CashPayment());
        System.out.println("Fee = Rs " + fee + ", free MEDIUM spots = " + lot.freeSpots(SpotType.MEDIUM));
    }
}`, lang: "java", title: "ParkingLot.java — core classes + demo" },
        { code: `T1 -> spot 0-M1
T2 -> spot 1-M1
No MEDIUM spot for DL3C0001
Cash received: Rs 60
Fee = Rs 60, free MEDIUM spots = 1`, lang: "text", title: "Output" },
        { tip: "In the interview, write <code>ParkingSpot</code>, <code>ParkingFloor.allocate</code>, <code>ParkingLot.park/unpark</code> and <code>FeeStrategy</code> first. Vehicle subclasses and the demo are the parts to skip if time is short." }
      ] },
      { h: "Step 7: patterns, concurrency, follow-ups", blocks: [
        { table: { head: ["Decision", "Pattern / principle", "Why"], rows: [
          ["<code>FeeStrategy</code> interface", "Strategy (OCP)", "weekend, flat, or dynamic pricing without editing <code>ParkingLot</code>"],
          ["Choosing a spot", "Strategy (<code>SpotAllocationStrategy</code>)", "nearest-to-gate, lowest-floor, or spread-the-load policies"],
          ["Creating vehicles from gate input", "Factory", "<code>VehicleFactory.create(type, plate)</code> keeps the gate free of <code>new Car/Bike</code>"],
          ["Display boards", "Observer", "floors publish \"spot freed / taken\"; boards subscribe and update counts"],
          ["One lot object", "Singleton — use with care", "global state hurts unit tests; prefer creating one instance and injecting it"]
        ] } },
        { p: "<b>Concurrency, said out loud:</b> the shared state is each spot's occupant. Two gates may both see the last spot as free; the <code>compareAndSet(null, v)</code> guarantees exactly one wins and the other continues scanning. Tickets live in a <code>ConcurrentHashMap</code>, and <code>remove()</code> at exit is atomic, so a ticket can't be paid twice. Ticket ids come from an <code>AtomicLong</code>. No lot-wide lock is needed." },
        { table: { head: ["Follow-up", "How the design absorbs it"], rows: [
          ["Add EV charging spots", "new <code>SpotType.EV</code> (or an <code>EVSpot</code> subclass with a charger); fee = hourly + a charging decorator on <code>FeeStrategy</code>"],
          ["A car may use a LARGE spot if MEDIUM is full", "allocation strategy tries a list of acceptable types in order (<code>MEDIUM, LARGE</code>)"],
          ["Reservations", "spot gets a <code>RESERVED</code> state with holder + expiry (same idea as BookMyShow seat holds)"],
          ["Lost ticket", "look up the active ticket by plate (second map <code>plate → ticket</code>), charge a penalty rate"],
          ["Persist to a DB", "spot table with <code>status</code>; claim with <code>UPDATE spot SET status='TAKEN' WHERE id=? AND status='FREE'</code> and check rows affected = 1"]
        ] } },
        { h: "Speaking it in a 45-minute mock (D42)" },
        { ol: [
          "0–5 min: requirements list (above) + ask about gates and pricing.",
          "5–15 min: entities table, then the class diagram.",
          "15–20 min: walk park and unpark as method calls.",
          "20–35 min: code <code>ParkingSpot</code>, <code>ParkingFloor</code>, <code>ParkingLot</code>, <code>FeeStrategy</code>.",
          "35–45 min: concurrency answer + two extensions (EV, reservations). Ask if they want anything deeper."
        ] },
        { warn: "Don't model the lot as a 2D grid of cells or add a <code>ParkingAttendant</code> class nobody asked for. Extra classes cost time and don't earn marks unless they serve a requirement." }
      ] }
    ],
    practice: [
      { q: "A truck enters at 08:45 and leaves at 13:00 (₹50/h, partial hour billed as full). What is the fee?", a: "08:45 → 13:00 = 4 h 15 min = 255 minutes. Hours = <code>(255 + 59) / 60 = 314 / 60 = 5</code> (integer division). Fee = 5 × 50 = <b>₹250</b>." },
      { q: "Why does <code>unpark</code> remove the ticket from the map <i>before</i> charging, and what happens if payment fails?", a: "Removing first makes the ticket single-use even if two exits scan it at the same instant: <code>ConcurrentHashMap.remove</code> is atomic, so only one exit gets a non-null ticket. If payment fails, the ticket is put back so the driver can retry; the spot is released only after a successful payment." },
      { q: "Your interviewer says: \"Add a rule — cars may use a LARGE spot if all MEDIUM spots are full, but never the other way round.\" What changes in the code?", a: "Replace <code>SpotType spotNeeded()</code> with <code>List&lt;SpotType&gt; acceptableSpots()</code> (Car → <code>[MEDIUM, LARGE]</code>, Truck → <code>[LARGE]</code>) and make <code>allocate</code> try each type in order across floors. Better: move this into a <code>SpotAllocationStrategy</code> so the rule can change without touching <code>ParkingFloor</code>. <code>ParkingLot</code>, tickets and pricing don't change." },
      { q: "Is making <code>ParkingLot</code> a Singleton a good idea? Give both sides.", a: "For: there is exactly one physical lot per process and gates need a shared reference. Against: a Singleton is global mutable state — unit tests can't create a fresh lot per test, and a company running several lots needs several instances. Better answer: create one <code>ParkingLot</code> at startup and <b>inject</b> it into the gates (DIP); you get one instance without the global access." },
      { q: "Where exactly is the race condition in parking, and why is <code>s.isFree() &amp;&amp; s.tryOccupy(v)</code> still safe even though <code>isFree()</code> is not atomic with the occupy?", a: "The race is between two gates both finding the same spot free. <code>isFree()</code> is only a cheap pre-check; the real decision is <code>compareAndSet(null, v)</code>, which atomically succeeds for one gate only. If the spot was taken between the check and the CAS, the CAS returns false and the loop moves to the next spot — no double parking." }
    ],
    related: ["sd:design-parking-lot", "oops:strategy-pattern", "oops:factory-pattern", "oops:observer-pattern", "oops:solid-principles", "oops:association-aggregation-composition", "oops:singleton-pattern", "os:test-and-set-cas", "dbms:optimistic-vs-pessimistic"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-creational",
    subject: "lld",
    title: "Creational patterns: Singleton, Factory Method, Abstract Factory, Builder, Prototype",
    minutes: 90,
    crux: [
      "Creational patterns decide <b>who creates objects and how</b>, so client code doesn't hard-wire <code>new ConcreteClass()</code>.",
      "<b>Singleton</b>: one instance + global access. Thread-safe options: eager field, <code>synchronized</code> getter, double-checked locking with <code>volatile</code>, holder class (lazy + no locks), <b>enum</b> (also safe against reflection and serialization).",
      "<b>Factory Method</b>: a method (often overridden by subclasses) decides which concrete product to create; <b>Abstract Factory</b>: an object that creates a whole <i>family</i> of related products that must match (dark button + dark checkbox).",
      "<b>Builder</b>: step-by-step construction of an object with many optional parameters; ends in an immutable object and validates in <code>build()</code>.",
      "<b>Prototype</b>: create new objects by copying a configured existing one; in Java prefer a copy constructor / <code>copy()</code> over <code>Cloneable</code>, and deep-copy mutable fields.",
      "One-line tells: \"exactly one\" → Singleton; \"which subclass?\" → Factory; \"family that must match\" → Abstract Factory; \"10 optional params\" → Builder; \"expensive to set up, many similar copies\" → Prototype."
    ],
    sections: [
      { h: "Singleton — one instance, thread-safe", blocks: [
        { p: "<b>Intent:</b> guarantee a class has exactly one instance and provide a global access point. <b>Use for:</b> configuration, a connection pool, a logger, a cache — shared resources where two instances would be wrong or wasteful." },
        { p: "Recipe: <code>private</code> constructor + a <code>static</code> field holding the instance + a <code>static</code> accessor. The whole difficulty is doing the lazy creation safely when many threads call the accessor at once." },
        { code: `import java.util.Set;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

// 1. Eager: created when the class is loaded. Thread-safe (class init is), not lazy.
class EagerConfig {
    private static final EagerConfig INSTANCE = new EagerConfig();
    private EagerConfig() { }
    static EagerConfig getInstance() { return INSTANCE; }
}

// 2. Lazy + synchronized: correct but every call takes the lock.
class SyncLazyCache {
    private static SyncLazyCache instance;
    private SyncLazyCache() { }
    static synchronized SyncLazyCache getInstance() {
        if (instance == null) instance = new SyncLazyCache();
        return instance;
    }
}

// 3. Double-checked locking: lock only on first creation. volatile is REQUIRED.
class DclRegistry {
    private static volatile DclRegistry instance;
    private DclRegistry() { }
    static DclRegistry getInstance() {
        DclRegistry local = instance;              // one volatile read on the fast path
        if (local == null) {
            synchronized (DclRegistry.class) {
                local = instance;
                if (local == null) instance = local = new DclRegistry();
            }
        }
        return local;
    }
}

// 4. Initialization-on-demand holder (Bill Pugh): lazy, thread-safe, no locking code.
class HolderLogger {
    private HolderLogger() { }
    private static class Holder { static final HolderLogger INSTANCE = new HolderLogger(); }
    static HolderLogger getInstance() { return Holder.INSTANCE; }   // Holder loads on first call
}

// 5. Enum: simplest, and immune to reflection and serialization attacks.
enum IdGenerator {
    INSTANCE;
    private final AtomicLong next = new AtomicLong();
    long nextId() { return next.incrementAndGet(); }
}

class SingletonDemo {
    public static void main(String[] args) throws Exception {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        ExecutorService pool = Executors.newFixedThreadPool(8);
        CountDownLatch go = new CountDownLatch(1);
        for (int i = 0; i < 100; i++) {
            pool.submit(() -> { go.await(); seen.add(DclRegistry.getInstance()); return null; });
        }
        go.countDown();
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("distinct DclRegistry instances: " + seen.size());
        System.out.println("same holder instance: " + (HolderLogger.getInstance() == HolderLogger.getInstance()));
        System.out.println("ids: " + IdGenerator.INSTANCE.nextId() + ", " + IdGenerator.INSTANCE.nextId());
    }
}`, lang: "java", title: "Five thread-safe ways to write a Singleton" },
        { code: `distinct DclRegistry instances: 1
same holder instance: true
ids: 1, 2`, lang: "text", title: "Output" },
        { table: { head: ["Variant", "Lazy?", "Thread-safe?", "Cost / catch"], rows: [
          ["Eager static field", "No", "Yes (class init)", "Created even if never used"],
          ["<code>synchronized</code> getter", "Yes", "Yes", "Lock on every call"],
          ["Double-checked locking", "Yes", "Only with <code>volatile</code>", "Easy to get wrong in an interview"],
          ["Holder class", "Yes", "Yes (class init)", "Best general choice"],
          ["<code>enum</code>", "No (on enum load)", "Yes", "Can't extend a class; safest vs reflection/serialization"]
        ] } },
        { warn: "<b>Why <code>volatile</code> in DCL?</b> <code>instance = new X()</code> is not atomic: allocate memory, run the constructor, publish the reference. Without <code>volatile</code> the JIT/CPU may publish the reference before the constructor finishes, so another thread's first (unlocked) check sees a non-null, half-built object." },
        { ul: [
          "<b>Breaking a Singleton</b>: reflection (<code>ctor.setAccessible(true); ctor.newInstance()</code>) — defend by throwing from the constructor if the instance exists; serialization — add <code>private Object readResolve() { return INSTANCE; }</code>; cloning — don't implement <code>Cloneable</code>. An <code>enum</code> handles all three for free.",
          "<b>Criticism</b>: it is global state, hides dependencies and makes unit tests share state. In LLD answers, say \"one instance, created at startup and injected\" is often better."
        ] }
      ] },
      { h: "Factory Method (and the Simple Factory)", blocks: [
        { p: "<b>Intent:</b> define an interface for creating an object, but let subclasses (or a single decision point) choose the concrete class. Client code talks only to the product interface, so adding a product doesn't ripple through callers." },
        { ul: [
          "<b>Simple (static) factory</b> — not a GoF pattern but what most people mean: one method with a <code>switch</code> that returns the right implementation. Good enough in most LLD answers.",
          "<b>Factory Method (GoF)</b> — an abstract creator class has a workflow method that calls an abstract <code>createX()</code>; each subclass overrides <code>createX()</code>. The workflow is reused, the product varies."
        ] },
        { code: `interface Notification { void deliver(String to, String msg); }

class EmailNotification implements Notification {
    public void deliver(String to, String msg) { System.out.println("EMAIL to " + to + ": " + msg); }
}
class SmsNotification implements Notification {
    public void deliver(String to, String msg) { System.out.println("SMS to " + to + ": " + msg); }
}
class PushNotification implements Notification {
    public void deliver(String to, String msg) { System.out.println("PUSH to " + to + ": " + msg); }
}

// Simple factory: one place that knows the concrete classes.
class NotificationFactory {
    static Notification create(String channel) {
        return switch (channel) {
            case "email" -> new EmailNotification();
            case "sms" -> new SmsNotification();
            case "push" -> new PushNotification();
            default -> throw new IllegalArgumentException("Unknown channel " + channel);
        };
    }
}

// GoF Factory Method: the template (send) is fixed, subclasses choose the product.
abstract class Notifier {
    protected abstract Notification createNotification();      // the factory method
    void send(String to, String msg) {
        Notification n = createNotification();
        n.deliver(to, "[" + getClass().getSimpleName() + "] " + msg);
    }
}
class OtpNotifier extends Notifier {
    protected Notification createNotification() { return new SmsNotification(); }
}
class InvoiceNotifier extends Notifier {
    protected Notification createNotification() { return new EmailNotification(); }
}

class FactoryDemo {
    public static void main(String[] args) {
        NotificationFactory.create("push").deliver("user42", "Your order shipped");
        new OtpNotifier().send("98xxxxxx01", "OTP 4821");
        new InvoiceNotifier().send("a@b.com", "Invoice #77 attached");
    }
}`, lang: "java", title: "Simple factory vs Factory Method" },
        { code: `PUSH to user42: Your order shipped
SMS to 98xxxxxx01: [OtpNotifier] OTP 4821
EMAIL to a@b.com: [InvoiceNotifier] Invoice #77 attached`, lang: "text", title: "Output" },
        { tip: "In the JDK: <code>Calendar.getInstance()</code>, <code>NumberFormat.getInstance()</code>, <code>List.of()</code> are static factories; <code>Collection.iterator()</code> is a factory method — each collection subclass returns its own iterator." }
      ] },
      { h: "Abstract Factory — families that must match", blocks: [
        { p: "<b>Intent:</b> provide an interface for creating <i>families</i> of related objects without naming their concrete classes. The client picks one factory at startup and every product it gets is guaranteed to belong to the same family." },
        { p: "Example: a UI with light and dark themes. A dark button next to a light checkbox is a bug; the factory makes that impossible. Other examples: DB drivers (connection + command + reader for MySQL vs Postgres), cloud providers (AWS storage + queue vs GCP storage + queue)." },
        { code: `interface Button { String render(); }
interface Checkbox { String render(); }

class LightButton implements Button { public String render() { return "[ OK ] (white bg)"; } }
class LightCheckbox implements Checkbox { public String render() { return "[x] (black tick)"; } }
class DarkButton implements Button { public String render() { return "[ OK ] (black bg)"; } }
class DarkCheckbox implements Checkbox { public String render() { return "[x] (white tick)"; } }

interface UiFactory {                 // the abstract factory
    Button createButton();
    Checkbox createCheckbox();
}
class LightThemeFactory implements UiFactory {
    public Button createButton() { return new LightButton(); }
    public Checkbox createCheckbox() { return new LightCheckbox(); }
}
class DarkThemeFactory implements UiFactory {
    public Button createButton() { return new DarkButton(); }
    public Checkbox createCheckbox() { return new DarkCheckbox(); }
}

class SettingsScreen {                // client: never mentions a concrete class
    private final Button save;
    private final Checkbox notify;
    SettingsScreen(UiFactory f) { save = f.createButton(); notify = f.createCheckbox(); }
    void draw() { System.out.println(save.render() + "  " + notify.render()); }
}

class AbstractFactoryDemo {
    public static void main(String[] args) {
        boolean darkMode = true;
        UiFactory factory = darkMode ? new DarkThemeFactory() : new LightThemeFactory();
        new SettingsScreen(factory).draw();
        new SettingsScreen(new LightThemeFactory()).draw();
    }
}`, lang: "java", title: "Abstract Factory: themed UI widgets" },
        { table: { head: ["", "Factory Method", "Abstract Factory"], rows: [
          ["Creates", "one product", "a family of related products"],
          ["Mechanism", "inheritance: subclass overrides a method", "composition: client holds a factory object"],
          ["Adding a new product <i>kind</i>", "new creator subclass", "change the factory interface (every factory changes)"],
          ["Adding a new <i>family</i>", "—", "one new factory class + its products"]
        ] } }
      ] },
      { h: "Builder — many optional parameters", blocks: [
        { p: "<b>Problem:</b> a class with 2 required and 6 optional fields leads to <i>telescoping constructors</i> (<code>new Req(url)</code>, <code>new Req(url, method)</code>, <code>new Req(url, method, timeout, …)</code>) or to a mutable object filled by setters that can be seen half-built. <b>Intent of Builder:</b> separate construction from representation — set parts step by step with readable, named calls, then <code>build()</code> once, validating and producing an <b>immutable</b> object." },
        { code: `import java.util.*;

final class HttpRequest {
    private final String url;                   // required
    private final String method;                // optional, default GET
    private final Map<String, String> headers;  // optional
    private final String body;                  // optional
    private final int timeoutMs;                // optional, default 5000

    private HttpRequest(Builder b) {
        this.url = b.url;
        this.method = b.method;
        this.headers = Collections.unmodifiableMap(new LinkedHashMap<>(b.headers));
        this.body = b.body;
        this.timeoutMs = b.timeoutMs;
    }

    static Builder builder(String url) { return new Builder(url); }

    @Override public String toString() {
        return method + " " + url + " headers=" + headers + " body=" + body + " timeout=" + timeoutMs;
    }

    static final class Builder {
        private final String url;
        private String method = "GET";
        private final Map<String, String> headers = new LinkedHashMap<>();
        private String body;
        private int timeoutMs = 5000;

        private Builder(String url) { this.url = Objects.requireNonNull(url); }
        Builder method(String m) { this.method = m; return this; }       // return this => chaining
        Builder header(String k, String v) { headers.put(k, v); return this; }
        Builder body(String b) { this.body = b; return this; }
        Builder timeoutMs(int t) { this.timeoutMs = t; return this; }

        HttpRequest build() {                                             // validate once, here
            if (timeoutMs <= 0) throw new IllegalStateException("timeout must be > 0");
            if (body != null && method.equals("GET")) throw new IllegalStateException("GET cannot have a body");
            return new HttpRequest(this);
        }
    }
}

class BuilderDemo {
    public static void main(String[] args) {
        HttpRequest r = HttpRequest.builder("https://api.example.com/orders")
                .method("POST")
                .header("Content-Type", "application/json")
                .body("{ \\"item\\": 7 }")
                .timeoutMs(2000)
                .build();
        System.out.println(r);
        System.out.println(HttpRequest.builder("https://api.example.com/health").build());
        try {
            HttpRequest.builder("https://x").body("oops").build();
        } catch (IllegalStateException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}`, lang: "java", title: "Builder with validation and an immutable product" },
        { code: `POST https://api.example.com/orders headers={Content-Type=application/json} body={ "item": 7 } timeout=2000
GET https://api.example.com/health headers={} body=null timeout=5000
rejected: GET cannot have a body`, lang: "text", title: "Output" },
        { tip: "JDK examples: <code>StringBuilder</code>, <code>HttpRequest.newBuilder()</code> (java.net.http), <code>Stream.builder()</code>. Lombok's <code>@Builder</code> generates exactly this code — mention it if you've used it." }
      ] },
      { h: "Prototype — clone a configured object", blocks: [
        { p: "<b>Intent:</b> create new objects by copying an existing, fully configured instance (the prototype) instead of building from scratch. <b>Use when</b> construction is expensive (parsed templates, loaded configs, game units with many stats) or when you need many near-identical objects that differ in a few fields. Often paired with a <b>registry</b> of named prototypes." },
        { code: `import java.util.*;

interface Prototype<T> { T copy(); }

class DocumentTemplate implements Prototype<DocumentTemplate> {
    private String title;
    private final List<String> sections;      // mutable => must be deep-copied
    private final String letterhead;          // imagine this was expensive to load

    DocumentTemplate(String title, List<String> sections, String letterhead) {
        this.title = title; this.sections = sections; this.letterhead = letterhead;
    }
    private DocumentTemplate(DocumentTemplate src) {          // copy constructor
        this.title = src.title;
        this.sections = new ArrayList<>(src.sections);        // deep copy of the list
        this.letterhead = src.letterhead;                     // immutable String: sharing is fine
    }
    public DocumentTemplate copy() { return new DocumentTemplate(this); }

    void setTitle(String t) { title = t; }
    void addSection(String s) { sections.add(s); }
    @Override public String toString() { return title + " " + sections; }
}

class TemplateRegistry {
    private final Map<String, DocumentTemplate> prototypes = new HashMap<>();
    void register(String key, DocumentTemplate t) { prototypes.put(key, t); }
    DocumentTemplate create(String key) { return prototypes.get(key).copy(); }
}

class PrototypeDemo {
    public static void main(String[] args) {
        TemplateRegistry reg = new TemplateRegistry();
        reg.register("offer", new DocumentTemplate("Offer Letter",
                new ArrayList<>(List.of("Role", "CTC", "Joining date")), "ACME letterhead"));

        DocumentTemplate forRiya = reg.create("offer");
        forRiya.setTitle("Offer Letter - Riya");
        forRiya.addSection("Relocation bonus");
        DocumentTemplate forArjun = reg.create("offer");

        System.out.println(forRiya);
        System.out.println(forArjun);          // unaffected: the list was deep-copied
    }
}`, lang: "java", title: "Prototype with a copy constructor and a registry" },
        { code: `Offer Letter - Riya [Role, CTC, Joining date, Relocation bonus]
Offer Letter [Role, CTC, Joining date]`, lang: "text", title: "Output" },
        { warn: "<code>Object.clone()</code> is a <b>shallow</b> copy: the clone shares the same <code>List</code> as the original, so adding a section to one adds it to both. <code>Cloneable</code> is also awkward (checked exception, no constructor runs). Prefer a copy constructor or a <code>copy()</code> method that deep-copies mutable fields." }
      ] },
      { h: "Choosing between them", blocks: [
        { table: { head: ["Pattern", "Problem it solves", "Tell-tale phrase", "LLD example"], rows: [
          ["Singleton", "exactly one shared instance", "\"global config\", \"single logger\"", "Logger, <code>IdGenerator</code>, lot/ATM controller"],
          ["Factory Method", "which concrete class to instantiate", "\"based on type, create …\"", "<code>VehicleFactory</code>, <code>NotificationFactory</code>, <code>PieceFactory</code> in chess"],
          ["Abstract Factory", "consistent families of objects", "\"theme\", \"platform\", \"provider\"", "UI themes, DB-driver families"],
          ["Builder", "many optional parameters, immutability", "\"lots of optional fields\"", "<code>Pizza</code>, <code>HttpRequest</code>, <code>Order</code>, search query"],
          ["Prototype", "copying is cheaper than building", "\"many similar objects\", \"template\"", "document templates, game enemies, pre-set shows"]
        ] } },
        { tip: "Patterns are vocabulary, not goals. In an LLD answer say \"I'll use a factory here <i>because</i> gates receive a type string and I don't want <code>new Car</code> scattered around\" — the <i>because</i> is what earns credit." }
      ] }
    ],
    practice: [
      { q: "Write the double-checked-locking Singleton from memory and explain what goes wrong if you drop <code>volatile</code>.", a: "See the <code>DclRegistry</code> class above: private constructor; <code>private static volatile</code> field; check null → <code>synchronized (X.class)</code> → check null again → create. Without <code>volatile</code>, the write of the reference can be reordered before the constructor's field writes; a second thread doing the unlocked first check may see a non-null reference and use a partially constructed object. <code>volatile</code> establishes happens-before between the write and later reads." },
      { q: "Which pattern? (a) A <code>Pizza</code> with size (required) and up to 10 optional toppings/crust/cheese options. (b) A game that must spawn 500 goblins with the same 40 stats. (c) A payment module that must create <code>Gateway</code>, <code>RefundService</code> and <code>WebhookParser</code> for either Razorpay-like or Stripe-like providers, never mixed.", a: "(a) <b>Builder</b> — required param in the builder's constructor, optional ones as chained setters, immutable Pizza from <code>build()</code>. (b) <b>Prototype</b> — configure one goblin, copy it 500 times, tweak position. (c) <b>Abstract Factory</b> — <code>PaymentProviderFactory</code> with <code>createGateway/createRefundService/createWebhookParser</code>; one factory per provider keeps the family consistent." },
      { q: "How can a Singleton be broken via serialization, and how do you prevent it?", a: "Serializing the instance and deserializing it creates a <b>new</b> object (deserialization doesn't call the constructor, it builds a fresh instance). Fix: add <code>private Object readResolve() { return INSTANCE; }</code> so the deserialized copy is replaced by the real instance — or use an <code>enum</code> Singleton, which the JVM guarantees stays unique across serialization." },
      { q: "Difference between Factory Method and Abstract Factory in one sentence each, with a JDK or real example.", a: "<b>Factory Method</b>: a single method, usually overridden in subclasses, decides which one product to create — e.g. <code>Collection.iterator()</code>, each collection returns its own <code>Iterator</code>. <b>Abstract Factory</b>: an object with several creation methods that produce a matching family — e.g. <code>DocumentBuilderFactory</code>/JDBC drivers, or a theme factory producing matching button + checkbox." },
      { q: "Why does the Builder above copy the headers map in the product's constructor instead of storing <code>b.headers</code> directly?", a: "To keep the product <b>immutable</b>. If the product stored the builder's map, anyone still holding the builder could call <code>header()</code> after <code>build()</code> and silently change the built request. Copying into a new map and wrapping in <code>unmodifiableMap</code> means the request can be shared across threads safely." }
    ],
    related: ["oops:singleton-pattern", "oops:factory-pattern", "oops:builder-pattern", "oops:shallow-vs-deep-copy", "oops:object-creation-ways", "oops:immutable-class", "oops:enums-in-java", "oops:solid-principles"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-patterns-2",
    subject: "lld",
    title: "Strategy, Observer, Decorator, Adapter, Facade, Command, State",
    minutes: 120,
    crux: [
      "<b>Strategy</b>: swap an algorithm behind an interface (pricing, routing, split type). <b>State</b>: same shape, but the object's <i>state</i> picks the behaviour and states switch themselves.",
      "<b>Observer</b>: a subject keeps a list of subscribers and notifies them on change (display boards, notifications). Watch for leaked listeners and thread-safety.",
      "<b>Decorator</b>: wrap an object in another with the same interface to add behaviour at runtime (add-ons, Java I/O streams) — avoids a subclass explosion.",
      "<b>Adapter</b>: convert an incompatible interface into the one you expect (legacy/third-party API). <b>Facade</b>: one simple entry point over a complicated subsystem.",
      "<b>Command</b>: turn a request into an object with <code>execute()</code>/<code>undo()</code> — enables undo/redo, queues, macros and logging.",
      "Structural (wraps/combines objects): Decorator, Adapter, Facade. Behavioural (who does what, when): Strategy, Observer, Command, State."
    ],
    sections: [
      { h: "Strategy — interchangeable algorithms", blocks: [
        { p: "<b>Intent:</b> define a family of algorithms, put each in its own class behind a common interface, and let the client choose at runtime. It replaces <code>if/else</code> or <code>switch</code> on a \"type\" with polymorphism (OCP), and each algorithm can be tested alone." },
        { p: "<b>Use when</b> the same task has several ways to be done: fee calculation, delivery cost, sorting, compression, route finding, split rules in Splitwise, scheduling in an elevator." },
        { code: `import java.util.*;

interface ShippingStrategy { long cost(double weightKg, int distanceKm); }

class StandardShipping implements ShippingStrategy {
    public long cost(double w, int d) { return 40 + Math.round(w * 10); }
}
class ExpressShipping implements ShippingStrategy {
    public long cost(double w, int d) { return 100 + Math.round(w * 15) + d / 10; }
}

class Cart {
    private ShippingStrategy shipping = new StandardShipping();
    void setShipping(ShippingStrategy s) { this.shipping = s; }       // swap at runtime
    long shippingFor(double w, int d) { return shipping.cost(w, d); }
}

class StrategyDemo {
    public static void main(String[] args) {
        Cart cart = new Cart();
        System.out.println("standard: " + cart.shippingFor(2.0, 300));
        cart.setShipping(new ExpressShipping());
        System.out.println("express:  " + cart.shippingFor(2.0, 300));
        cart.setShipping((w, d) -> 0);                                  // one-off strategy as a lambda
        System.out.println("prime:    " + cart.shippingFor(2.0, 300));
    }
}`, lang: "java", title: "Strategy: pluggable shipping cost" },
        { code: `standard: 60
express:  160
prime:    0`, lang: "text", title: "Output (2 kg, 300 km: 40+20; 100+30+30; 0)" },
        { tip: "A single-method strategy interface is a functional interface, so a lambda works as a strategy. <code>Comparator</code> passed to <code>Collections.sort</code> is the textbook JDK example of Strategy." }
      ] },
      { h: "Observer — publish / subscribe inside one process", blocks: [
        { p: "<b>Intent:</b> define a one-to-many dependency so that when one object (the <b>subject</b>) changes, all its dependents (<b>observers</b>) are notified automatically. The subject only knows the <code>Observer</code> interface, so observers can be added without changing it." },
        { p: "<b>Use for</b> display boards in a parking lot, price-drop alerts, event listeners in UIs, notifying users when a show's seats open up." },
        { code: `import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

interface StockObserver { void onPriceChange(String symbol, double price); }

class StockTicker {                                    // the subject
    private final List<StockObserver> observers = new CopyOnWriteArrayList<>();
    private final Map<String, Double> prices = new HashMap<>();

    void subscribe(StockObserver o) { observers.add(o); }
    void unsubscribe(StockObserver o) { observers.remove(o); }

    void setPrice(String symbol, double price) {
        prices.put(symbol, price);
        for (StockObserver o : observers) o.onPriceChange(symbol, price);   // push model
    }
}

class PriceAlert implements StockObserver {
    private final String symbol; private final double threshold;
    PriceAlert(String symbol, double threshold) { this.symbol = symbol; this.threshold = threshold; }
    public void onPriceChange(String s, double p) {
        if (s.equals(symbol) && p < threshold) System.out.println("ALERT: " + s + " fell below " + threshold + " -> " + p);
    }
}
class Dashboard implements StockObserver {
    public void onPriceChange(String s, double p) { System.out.println("dashboard: " + s + " = " + p); }
}

class ObserverDemo {
    public static void main(String[] args) {
        StockTicker ticker = new StockTicker();
        Dashboard board = new Dashboard();
        ticker.subscribe(board);
        ticker.subscribe(new PriceAlert("INFY", 1500));
        ticker.setPrice("INFY", 1520);
        ticker.setPrice("INFY", 1490);
        ticker.unsubscribe(board);
        ticker.setPrice("INFY", 1480);
    }
}`, lang: "java", title: "Observer: stock ticker with two kinds of observers" },
        { code: `dashboard: INFY = 1520.0
dashboard: INFY = 1490.0
ALERT: INFY fell below 1500.0 -> 1490.0
ALERT: INFY fell below 1500.0 -> 1480.0`, lang: "text", title: "Output" },
        { warn: "Two classic bugs: (1) <b>lapsed listener</b> — forgetting to unsubscribe keeps observers alive (memory leak); (2) modifying the list while iterating it (an observer unsubscribing itself inside the callback) → <code>ConcurrentModificationException</code> with <code>ArrayList</code>. <code>CopyOnWriteArrayList</code> fixes (2) and is thread-safe for read-heavy listener lists. Slow observers block the subject — use an executor for async delivery." }
      ] },
      { h: "Decorator — add behaviour by wrapping", blocks: [
        { p: "<b>Intent:</b> attach extra responsibilities to an object dynamically. A decorator <b>implements the same interface</b> as the object it wraps and <b>holds a reference</b> to it, delegating and adding something before/after. Decorators stack in any order." },
        { p: "<b>Why not subclasses?</b> Coffee with milk, sugar, mocha, whip in any combination would need a subclass per combination (2⁴ = 16). With decorators you need one class per add-on." },
        { svg: `<svg viewBox="0 0 640 170" width="640" class="dg">
  <rect class="box-p" x="20" y="20" width="600" height="130" rx="8"/>
  <text class="tx tx-b" x="36" y="40">Whip (+20)</text>
  <rect class="box-w" x="60" y="52" width="520" height="88" rx="8"/>
  <text class="tx tx-b" x="76" y="70">Mocha (+30)</text>
  <rect class="box-g" x="100" y="80" width="440" height="52" rx="8"/>
  <text class="tx tx-b" x="116" y="98">Milk (+20)</text>
  <rect class="box-a" x="330" y="92" width="190" height="30" rx="6"/>
  <text class="tx tx-b" x="425" y="107" text-anchor="middle" dominant-baseline="middle">Espresso (100)</text>
</svg>`, caption: "cost() is called on the outermost wrapper; each layer asks the inner object and adds its own price: 100 + 20 + 30 + 20 = 170." },
        { code: `interface Beverage { String description(); int cost(); }

class Espresso implements Beverage {
    public String description() { return "Espresso"; }
    public int cost() { return 100; }
}

abstract class AddOn implements Beverage {           // the decorator base
    protected final Beverage inner;
    AddOn(Beverage inner) { this.inner = inner; }
}
class Milk extends AddOn {
    Milk(Beverage b) { super(b); }
    public String description() { return inner.description() + " + milk"; }
    public int cost() { return inner.cost() + 20; }
}
class Mocha extends AddOn {
    Mocha(Beverage b) { super(b); }
    public String description() { return inner.description() + " + mocha"; }
    public int cost() { return inner.cost() + 30; }
}
class Whip extends AddOn {
    Whip(Beverage b) { super(b); }
    public String description() { return inner.description() + " + whip"; }
    public int cost() { return inner.cost() + 20; }
}

class DecoratorDemo {
    public static void main(String[] args) {
        Beverage order = new Whip(new Mocha(new Milk(new Espresso())));
        System.out.println(order.description() + " = Rs " + order.cost());
        Beverage doubleMocha = new Mocha(new Mocha(new Espresso()));
        System.out.println(doubleMocha.description() + " = Rs " + doubleMocha.cost());
    }
}`, lang: "java", title: "Decorator: coffee add-ons" },
        { code: `Espresso + milk + mocha + whip = Rs 170
Espresso + mocha + mocha = Rs 160`, lang: "text", title: "Output" },
        { tip: "JDK example to quote: <code>new BufferedReader(new InputStreamReader(new FileInputStream(f)))</code> — each layer is a decorator adding buffering or decoding. Also <code>Collections.unmodifiableList(list)</code> and <code>synchronizedList(list)</code>." }
      ] },
      { h: "Adapter and Facade — making interfaces fit", blocks: [
        { p: "<b>Adapter — intent:</b> convert the interface of an existing class into the interface clients expect, so classes with incompatible interfaces can work together. Typical: integrating a legacy or third-party API you can't change. The adapter implements <i>your</i> interface and translates each call." },
        { code: `// The interface our checkout code is written against.
interface PaymentGateway { boolean charge(String orderId, long amountPaise); }

// A legacy vendor SDK we cannot modify: different names, rupees as double, int status codes.
class OldBankApi {
    int makePayment(String reference, double rupees) {
        System.out.println("OldBankApi: debit Rs " + rupees + " ref=" + reference);
        return 0;                                   // 0 = success in this API
    }
}

class OldBankAdapter implements PaymentGateway {     // object adapter: wraps the adaptee
    private final OldBankApi bank;
    OldBankAdapter(OldBankApi bank) { this.bank = bank; }
    public boolean charge(String orderId, long amountPaise) {
        int status = bank.makePayment("ORD-" + orderId, amountPaise / 100.0);
        return status == 0;
    }
}

class AdapterDemo {
    public static void main(String[] args) {
        PaymentGateway gw = new OldBankAdapter(new OldBankApi());
        System.out.println("paid: " + gw.charge("991", 49950));
    }
}`, lang: "java", title: "Adapter: plugging a legacy bank API into our interface" },
        { code: `OldBankApi: debit Rs 499.5 ref=ORD-991
paid: true`, lang: "text", title: "Output" },
        { p: "<b>Facade — intent:</b> provide one simplified interface to a set of classes in a subsystem. The facade doesn't hide the subsystem (advanced callers can still use it); it just gives the common case a single, easy method." },
        { code: `class Inventory {
    boolean reserve(String sku, int qty) { System.out.println("inventory: reserved " + qty + " x " + sku); return true; }
}
class Payments {
    boolean charge(String user, long paise) { System.out.println("payments: charged " + user + " " + paise); return true; }
}
class Shipping {
    String schedule(String user, String sku) { System.out.println("shipping: pickup scheduled"); return "AWB123"; }
}
class Notifier {
    void send(String user, String msg) { System.out.println("notify " + user + ": " + msg); }
}

class OrderFacade {                                   // one call for the whole checkout flow
    private final Inventory inventory = new Inventory();
    private final Payments payments = new Payments();
    private final Shipping shipping = new Shipping();
    private final Notifier notifier = new Notifier();

    String placeOrder(String user, String sku, int qty, long paise) {
        if (!inventory.reserve(sku, qty)) return "OUT_OF_STOCK";
        if (!payments.charge(user, paise)) return "PAYMENT_FAILED";
        String awb = shipping.schedule(user, sku);
        notifier.send(user, "Order placed, tracking " + awb);
        return "OK";
    }
}

class FacadeDemo {
    public static void main(String[] args) {
        System.out.println(new OrderFacade().placeOrder("neha", "PHONE-128", 1, 1999900));
    }
}`, lang: "java", title: "Facade: one method over four subsystems" },
        { table: { head: ["", "Adapter", "Facade", "Decorator"], rows: [
          ["Interface it exposes", "a <i>different</i> one (the one the client wants)", "a new, <i>simpler</i> one", "the <i>same</i> one as the wrapped object"],
          ["Wraps", "one adaptee", "many subsystem classes", "one component (recursively)"],
          ["Goal", "compatibility", "convenience / decoupling", "add behaviour"],
          ["Example", "<code>Arrays.asList</code>, <code>InputStreamReader</code>", "a service layer, <code>OrderFacade</code>", "<code>BufferedReader</code>"]
        ] } }
      ] },
      { h: "Command — requests as objects (undo/redo)", blocks: [
        { p: "<b>Intent:</b> encapsulate a request as an object, so you can parameterise clients with different requests, queue or log them, and support <b>undo</b>. Roles: <b>Command</b> (interface with <code>execute/undo</code>), <b>ConcreteCommand</b> (knows its receiver and parameters), <b>Receiver</b> (does the real work), <b>Invoker</b> (triggers commands and keeps history)." },
        { svg: `<svg viewBox="0 0 640 150" width="640" class="dg">
  <rect class="box" x="20" y="20" width="130" height="40" rx="4"/>
  <text class="tx" x="85" y="40" text-anchor="middle" dominant-baseline="middle">Invoker (Editor)</text>
  <line class="ln" x1="150" y1="40" x2="248" y2="40" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="160" y="32">history</text>
  <rect class="box-a" x="250" y="20" width="140" height="40" rx="4"/>
  <text class="tx-m" x="320" y="32" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="320" y="48" text-anchor="middle" dominant-baseline="middle">Command</text>
  <rect class="box" x="250" y="100" width="140" height="36" rx="4"/>
  <text class="tx" x="320" y="118" text-anchor="middle" dominant-baseline="middle">AppendCommand</text>
  <line class="ln ln-d" x1="320" y1="100" x2="320" y2="76"/>
  <polygon class="box" points="320,60 312,76 328,76"/>
  <line class="ln" x1="390" y1="118" x2="488" y2="118" marker-end="url(#dg-arr)"/>
  <rect class="box" x="490" y="100" width="130" height="36" rx="4"/>
  <text class="tx" x="555" y="118" text-anchor="middle" dominant-baseline="middle">Receiver (Doc)</text>
  <text class="tx-m" x="410" y="40">execute() / undo()</text>
</svg>`, caption: "The invoker only knows the Command interface; each concrete command stores what it needs to undo itself." },
        { code: `import java.util.*;

class TextDocument {                                   // receiver
    private final StringBuilder text = new StringBuilder();
    void insert(int pos, String s) { text.insert(pos, s); }
    void delete(int pos, int len) { text.delete(pos, pos + len); }
    int length() { return text.length(); }
    @Override public String toString() { return "\\"" + text + "\\""; }
}

interface Command { void execute(); void undo(); }

class AppendCommand implements Command {
    private final TextDocument doc; private final String s; private int at;
    AppendCommand(TextDocument doc, String s) { this.doc = doc; this.s = s; }
    public void execute() { at = doc.length(); doc.insert(at, s); }
    public void undo() { doc.delete(at, s.length()); }
}

class Editor {                                         // invoker with undo/redo stacks
    private final Deque<Command> undoStack = new ArrayDeque<>();
    private final Deque<Command> redoStack = new ArrayDeque<>();
    void run(Command c) { c.execute(); undoStack.push(c); redoStack.clear(); }
    void undo() { if (!undoStack.isEmpty()) { Command c = undoStack.pop(); c.undo(); redoStack.push(c); } }
    void redo() { if (!redoStack.isEmpty()) { Command c = redoStack.pop(); c.execute(); undoStack.push(c); } }
}

class CommandDemo {
    public static void main(String[] args) {
        TextDocument doc = new TextDocument();
        Editor ed = new Editor();
        ed.run(new AppendCommand(doc, "Hello"));
        ed.run(new AppendCommand(doc, " world"));
        System.out.println(doc);
        ed.undo();
        System.out.println("after undo: " + doc);
        ed.redo();
        System.out.println("after redo: " + doc);
    }
}`, lang: "java", title: "Command with undo/redo" },
        { code: `"Hello world"
after undo: "Hello"
after redo: "Hello world"`, lang: "text", title: "Output" },
        { ul: [
          "Other uses: <code>Runnable</code> tasks submitted to an executor (a queued command), remote-control buttons, transactional operations with rollback, a macro = a list of commands.",
          "Doing a new action clears the redo stack — otherwise redo would replay onto a different document."
        ] }
      ] },
      { h: "State — behaviour that depends on the current state", blocks: [
        { p: "<b>Intent:</b> let an object change its behaviour when its internal state changes. Each state is a class implementing the same interface; the <b>context</b> delegates to its current state object, and states decide the transitions. This replaces a large <code>switch(state)</code> duplicated in every method." },
        { p: "<b>Use for</b> anything with a lifecycle: orders, vending machines, ATMs, elevators, traffic lights, document approval. Draw the state-transition diagram first, then one class per state." },
        { code: `interface OrderState {
    default void ship(Order o)    { System.out.println("  cannot ship in " + name()); }
    default void deliver(Order o) { System.out.println("  cannot deliver in " + name()); }
    default void cancel(Order o)  { System.out.println("  cannot cancel in " + name()); }
    String name();
}

class Placed implements OrderState {
    public void ship(Order o)   { o.setState(new Shipped()); }
    public void cancel(Order o) { System.out.println("  refund issued"); o.setState(new Cancelled()); }
    public String name() { return "PLACED"; }
}
class Shipped implements OrderState {
    public void deliver(Order o) { o.setState(new Delivered()); }
    public String name() { return "SHIPPED"; }
}
class Delivered implements OrderState { public String name() { return "DELIVERED"; } }
class Cancelled implements OrderState { public String name() { return "CANCELLED"; } }

class Order {                                          // the context
    private OrderState state = new Placed();
    void setState(OrderState s) { System.out.println("  " + state.name() + " -> " + s.name()); state = s; }
    void ship()    { state.ship(this); }
    void deliver() { state.deliver(this); }
    void cancel()  { state.cancel(this); }
}

class StateDemo {
    public static void main(String[] args) {
        Order a = new Order();
        System.out.println("order A:"); a.deliver(); a.ship(); a.cancel(); a.deliver();
        Order b = new Order();
        System.out.println("order B:"); b.cancel(); b.ship();
    }
}`, lang: "java", title: "State: order lifecycle" },
        { code: `order A:
  cannot deliver in PLACED
  PLACED -> SHIPPED
  cannot cancel in SHIPPED
  SHIPPED -> DELIVERED
order B:
  refund issued
  PLACED -> CANCELLED
  cannot ship in CANCELLED`, lang: "text", title: "Output" },
        { table: { head: ["", "Strategy", "State"], rows: [
          ["Who chooses the implementation?", "the client (<code>setShipping(...)</code>)", "the states themselves, via transitions"],
          ["Do implementations know each other?", "no — independent algorithms", "yes — a state creates the next state"],
          ["Changes over the object's life?", "rarely, by configuration", "constantly, as events arrive"],
          ["Example", "pricing rule, split type", "ATM, vending machine, elevator car"]
        ] } },
        { tip: "The two look identical as UML (context → interface ← implementations). Interviewers love \"What's the difference between Strategy and State?\" — answer with the <i>who switches</i> row above." }
      ] }
    ],
    practice: [
      { q: "A <code>Notification</code> service must support email, SMS and push, and optionally add encryption and retry around any of them in any combination. Which patterns?", a: "Channel choice: <b>Strategy</b> (or Factory to create the channel). Optional encryption/retry in any combination: <b>Decorator</b> — <code>new RetryingSender(new EncryptingSender(new SmsSender()))</code>, each implementing <code>Sender</code>. Subclassing would need a class per combination." },
      { q: "You must use a third-party SMS SDK whose method is <code>sendText(int countryCode, String number, String body)</code>, but your code uses <code>interface SmsSender { void send(String e164Number, String msg); }</code>. Which pattern, and sketch the class.", a: "<b>Adapter</b>: <code>class VendorSmsAdapter implements SmsSender { private final VendorSdk sdk; public void send(String e164, String msg) { int cc = …parse country code…; sdk.sendText(cc, restOfNumber, msg); } }</code>. The rest of the code keeps depending on <code>SmsSender</code>; switching vendor = a new adapter." },
      { q: "Explain how you would add undo to a drawing app where users add, move and delete shapes.", a: "<b>Command</b>: <code>AddShape</code>, <code>MoveShape(dx, dy)</code>, <code>DeleteShape</code> each implement <code>execute()/undo()</code> and store what's needed to reverse (e.g. the deleted shape and its index; the move deltas). The canvas (invoker) pushes each executed command on an undo stack; undo pops and calls <code>undo()</code>, pushing to a redo stack; any new command clears redo." },
      { q: "Strategy vs State: both have a context holding an interface with several implementations. Give two concrete differences.", a: "(1) <b>Who switches</b>: the client sets a strategy; states transition themselves (<code>Placed.ship()</code> sets <code>Shipped</code>). (2) <b>Coupling</b>: strategies are independent and unaware of each other; states know their successor states. Also, a strategy usually stays the same during the object's life, while state changes on every event." },
      { q: "In the Observer example, why is <code>CopyOnWriteArrayList</code> used for observers, and when would it be a bad choice?", a: "Notification iterates the list while observers may subscribe/unsubscribe (even from inside a callback, or from another thread). COW lists iterate over a snapshot, so there's no <code>ConcurrentModificationException</code> and no locking on reads. It's bad when the list is written very often (every add/remove copies the whole array) — then use a synchronized list or a concurrent queue." },
      { q: "Facade vs Adapter — which one is <code>OrderFacade.placeOrder()</code> and why isn't it the other?", a: "Facade: it defines a <i>new, simpler</i> interface over <i>several</i> classes (inventory, payments, shipping, notifier) for convenience. An adapter converts <i>one</i> existing interface into a <i>specific</i> interface the client already expects, for compatibility — nothing is being made compatible here." }
    ],
    related: ["oops:strategy-pattern", "oops:observer-pattern", "oops:decorator-pattern", "oops:adapter-pattern", "oops:composition-over-inheritance", "oops:solid-principles", "oops:marker-functional-interfaces", "oops:compile-vs-runtime-polymorphism"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-elevator",
    subject: "lld",
    title: "Design an Elevator System — states, LOOK scheduling, dispatch",
    minutes: 90,
    crux: [
      "Two kinds of requests: <b>hall calls</b> (floor + direction, from the corridor buttons) go to a <b>dispatcher</b> that picks a car; <b>car calls</b> (destination, from inside) go straight to that car.",
      "Core classes: <code>ElevatorSystem</code> (controller) → <code>DispatchStrategy</code> → <code>ElevatorCar</code> (floor, stops, state) + <code>Door</code>, <code>Request</code>, enums <code>Direction</code>.",
      "The car is a <b>State machine</b>: IDLE → MOVING_UP / MOVING_DOWN → DOORS_OPEN → (next direction or IDLE). One class per state; the car delegates <code>tick()</code> to its state.",
      "Scheduling inside a car = disk-scheduling algorithms. <b>LOOK</b>: keep going in the current direction serving stops, reverse only when no stops remain ahead. Keep two sorted sets: <code>upStops</code>, <code>downStops</code>.",
      "Worked example: at floor 5 going up with stops {8, 2, 9, 3, 6}: LOOK serves 6, 8, 9, 3, 2 = 11 floors; FCFS in arrival order = 25 floors.",
      "Dispatch cost: prefer a car already moving toward the caller in the same direction, then the nearest idle car; penalise cars moving away."
    ],
    sections: [
      { h: "Requirements and entities", blocks: [
        { ol: [
          "A building has <i>M</i> floors and <i>N</i> elevator cars.",
          "Each floor has UP/DOWN hall buttons; each car has a panel of floor buttons, open/close buttons and an alarm.",
          "The system assigns a hall call to the best car; a car serves stops efficiently (no zig-zag).",
          "Car shows current floor and direction; doors open at a stop, close after a timeout.",
          "Capacity limit (weight sensor) — if overloaded, doors stay open.",
          "Maintenance/emergency mode takes a car out of service.",
          "Non-functional: requests arrive concurrently from many buttons; strategy must be swappable (peak-hour mode)."
        ] },
        { table: { head: ["Class", "Responsibility"], rows: [
          ["<code>ElevatorSystem</code>", "Entry point for hall calls and car calls; owns cars; runs the clock/controller loop"],
          ["<code>DispatchStrategy</code> (interface)", "Choose which car serves a hall call (<code>NearestSuitableCar</code>, <code>ZoneBased</code>, <code>LeastLoaded</code>)"],
          ["<code>ElevatorCar</code>", "Current floor, pending stops (up/down sets), current <code>ElevatorState</code>, door, load"],
          ["<code>ElevatorState</code> (interface)", "<code>IdleState</code>, <code>MovingState(dir)</code>, <code>DoorsOpenState</code>, <code>MaintenanceState</code>"],
          ["<code>Request</code>", "floor, direction (for hall calls), type HALL/CAR, timestamp"],
          ["<code>Door</code>, <code>Display</code>, <code>Button</code>", "Hardware abstractions; buttons create requests (Command-like)"],
          ["<code>Direction</code> (enum)", "UP, DOWN"]
        ] } },
        { svg: `<svg viewBox="0 0 700 220" width="700" class="dg">
  <rect class="box-a" x="250" y="20" width="180" height="40" rx="4"/>
  <text class="tx tx-b" x="340" y="40" text-anchor="middle" dominant-baseline="middle">ElevatorSystem</text>
  <rect class="box" x="500" y="20" width="180" height="40" rx="4"/>
  <text class="tx-m" x="590" y="32" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="590" y="48" text-anchor="middle" dominant-baseline="middle">DispatchStrategy</text>
  <line class="ln" x1="430" y1="40" x2="498" y2="40" marker-end="url(#dg-arr)"/>
  <rect class="box" x="20" y="20" width="160" height="40" rx="4"/>
  <text class="tx" x="100" y="40" text-anchor="middle" dominant-baseline="middle">HallButton</text>
  <line class="ln" x1="180" y1="40" x2="248" y2="40" marker-end="url(#dg-arr)"/>
  <polygon class="box-a" points="340,60 348,70 340,80 332,70"/>
  <line class="ln-a" x1="340" y1="80" x2="340" y2="110"/>
  <text class="tx-s" x="348" y="104">1..*</text>
  <rect class="box" x="250" y="110" width="180" height="40" rx="4"/>
  <text class="tx tx-b" x="340" y="130" text-anchor="middle" dominant-baseline="middle">ElevatorCar</text>
  <rect class="box" x="500" y="110" width="180" height="40" rx="4"/>
  <text class="tx-m" x="590" y="122" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="590" y="138" text-anchor="middle" dominant-baseline="middle">ElevatorState</text>
  <line class="ln" x1="430" y1="130" x2="498" y2="130" marker-end="url(#dg-arr)"/>
  <rect class="box" x="20" y="110" width="160" height="40" rx="4"/>
  <text class="tx" x="100" y="130" text-anchor="middle" dominant-baseline="middle">Door</text>
  <polygon class="box-a" points="250,130 236,123 222,130 236,137"/>
  <line class="ln-a" x1="222" y1="130" x2="180" y2="130"/>
  <rect class="box" x="470" y="180" width="70" height="30" rx="4"/>
  <text class="tx-s" x="505" y="195" text-anchor="middle" dominant-baseline="middle">Idle</text>
  <rect class="box" x="555" y="180" width="70" height="30" rx="4"/>
  <text class="tx-s" x="590" y="195" text-anchor="middle" dominant-baseline="middle">Moving</text>
  <rect class="box" x="640" y="180" width="56" height="30" rx="4"/>
  <text class="tx-s" x="668" y="195" text-anchor="middle" dominant-baseline="middle">Doors</text>
  <line class="ln ln-d" x1="590" y1="180" x2="590" y2="166"/>
  <polygon class="box" points="590,150 582,166 598,166"/>
  <line class="ln ln-d" x1="505" y1="180" x2="505" y2="170"/>
  <line class="ln ln-d" x1="668" y1="180" x2="668" y2="170"/>
  <line class="ln ln-d" x1="505" y1="170" x2="668" y2="170"/>
  <rect class="box" x="250" y="180" width="180" height="30" rx="4"/>
  <text class="tx" x="340" y="195" text-anchor="middle" dominant-baseline="middle">upStops / downStops</text>
  <line class="ln" x1="340" y1="150" x2="340" y2="178" marker-end="url(#dg-arr)"/>
</svg>`, caption: "The system composes cars; each car composes its door and holds its current state object (State pattern). Dispatch is a pluggable strategy." }
      ] },
      { h: "The car as a state machine", blocks: [
        { svg: `<svg viewBox="0 0 700 200" width="700" class="dg">
  <rect class="box-g" x="20" y="80" width="110" height="40" rx="20"/>
  <text class="tx tx-b" x="75" y="100" text-anchor="middle" dominant-baseline="middle">IDLE</text>
  <rect class="box-a" x="260" y="20" width="160" height="40" rx="20"/>
  <text class="tx tx-b" x="340" y="40" text-anchor="middle" dominant-baseline="middle">MOVING_UP</text>
  <rect class="box-a" x="260" y="140" width="160" height="40" rx="20"/>
  <text class="tx tx-b" x="340" y="160" text-anchor="middle" dominant-baseline="middle">MOVING_DOWN</text>
  <rect class="box-w" x="550" y="80" width="130" height="40" rx="20"/>
  <text class="tx tx-b" x="615" y="100" text-anchor="middle" dominant-baseline="middle">DOORS_OPEN</text>
  <line class="ln" x1="120" y1="86" x2="258" y2="44" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="130" y="56">stop above</text>
  <line class="ln" x1="120" y1="114" x2="258" y2="156" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="130" y="150">stop below</text>
  <line class="ln" x1="420" y1="44" x2="560" y2="84" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="470" y="52">reached stop</text>
  <line class="ln" x1="420" y1="156" x2="560" y2="116" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="470" y="152">reached stop</text>
  <line class="ln ln-d" x1="550" y1="100" x2="132" y2="100" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="250" y="94">doors close, no stops left</text>
  <line class="ln ln-d" x1="580" y1="80" x2="422" y2="34" marker-end="url(#dg-arr)"/>
  <line class="ln ln-d" x1="580" y1="120" x2="422" y2="166" marker-end="url(#dg-arr)"/>
</svg>`, caption: "After DOORS_OPEN the car keeps its previous direction if stops remain that way (LOOK), otherwise reverses, otherwise goes IDLE. A MAINTENANCE state (not drawn) is reachable from any state." },
        { table: { head: ["State", "On tick()", "Allowed events"], rows: [
          ["IDLE", "if any stop above → MOVING_UP; else if any below → MOVING_DOWN", "new stop at current floor → DOORS_OPEN"],
          ["MOVING_UP / DOWN", "move one floor; if this floor is a stop → DOORS_OPEN", "new stops are added to the up or down set"],
          ["DOORS_OPEN", "close doors, choose next state (LOOK rule)", "door-open button extends the timer; overload keeps doors open"],
          ["MAINTENANCE", "ignore requests; dispatcher skips this car", "technician resets → IDLE"]
        ] } }
      ] },
      { h: "Scheduling: FCFS vs SSTF vs SCAN vs LOOK (worked)", blocks: [
        { p: "Inside one car, choosing the order of stops is the same problem as disk-head scheduling. Take a 10-floor building (floors 0–10). The car is at <b>floor 5, moving up</b>, with pending stops arriving in the order <b>8, 2, 9, 3, 6</b>." },
        { table: { head: ["Algorithm", "Rule", "Order served", "Floors travelled"], rows: [
          ["FCFS", "arrival order", "8, 2, 9, 3, 6", "3 + 6 + 7 + 6 + 3 = <b>25</b>"],
          ["SSTF", "always the nearest stop", "6, 8, 9, 3, 2", "1 + 2 + 1 + 6 + 1 = <b>11</b>"],
          ["SCAN", "go to the end (floor 10) then reverse", "6, 8, 9, (10), 3, 2", "5 (5→10) + 8 (10→2) = <b>13</b>"],
          ["LOOK", "go only as far as the last stop, then reverse", "6, 8, 9, 3, 2", "4 (5→9) + 7 (9→2) = <b>11</b>"]
        ] } },
        { ul: [
          "<b>FCFS</b> zig-zags — terrible for passengers and motors.",
          "<b>SSTF</b> is locally greedy and can <b>starve</b> a far floor if requests keep arriving near the car (same starvation as in disk scheduling). Here it happens to equal LOOK.",
          "<b>SCAN</b> is fair but wastes travel to the end; real elevators don't go to the top floor for nothing.",
          "<b>LOOK</b> is what elevators actually do: fair (no starvation — every stop is reached within one sweep in each direction) and no wasted travel."
        ] },
        { p: "<b>Implementing LOOK with two sorted sets:</b> a new stop <code>f</code> goes into <code>upStops</code> if <code>f &gt; floor</code>, into <code>downStops</code> if <code>f &lt; floor</code>. While moving up, stop whenever the current floor is in <code>upStops</code>; when <code>upStops</code> is empty, reverse and drain <code>downStops</code> (highest first). <code>TreeSet</code> gives O(log n) add/remove and ordered traversal." },
        { tip: "Hall-call refinement worth mentioning: a DOWN call at floor 7 shouldn't stop a car travelling UP past 7 (the passenger wants to go down). Store hall calls with their direction and serve them only on a sweep in that direction." }
      ] },
      { h: "Code skeleton (compiles and runs)", blocks: [
        { code: `import java.util.*;

enum Direction { UP, DOWN }

interface ElevatorState {
    void tick(ElevatorCar car);
    String label();
}

class IdleState implements ElevatorState {
    public void tick(ElevatorCar car) {
        if (car.hasStopsAbove()) car.setState(new MovingState(Direction.UP));
        else if (car.hasStopsBelow()) car.setState(new MovingState(Direction.DOWN));
    }
    public String label() { return "IDLE"; }
}

class MovingState implements ElevatorState {
    private final Direction dir;
    MovingState(Direction dir) { this.dir = dir; }
    Direction direction() { return dir; }
    public void tick(ElevatorCar car) {
        car.moveOneFloor(dir);
        if (car.consumeStopHere(dir)) car.setState(new DoorsOpenState(dir));
    }
    public String label() { return "MOVING_" + dir; }
}

class DoorsOpenState implements ElevatorState {
    private final Direction lastDir;
    DoorsOpenState(Direction lastDir) { this.lastDir = lastDir; }
    public void tick(ElevatorCar car) { car.setState(car.nextStateAfterStop(lastDir)); }  // close + decide
    public String label() { return "DOORS_OPEN"; }
}

class ElevatorCar {
    private final int id;
    private int floor;
    private int floorsTravelled;
    private final TreeSet<Integer> upStops = new TreeSet<>();
    private final TreeSet<Integer> downStops = new TreeSet<>();
    private final List<Integer> served = new ArrayList<>();
    private ElevatorState state = new IdleState();

    ElevatorCar(int id, int startFloor) { this.id = id; this.floor = startFloor; }

    synchronized void addStop(int f) {                  // called from button threads
        if (f > floor) upStops.add(f);
        else if (f < floor) downStops.add(f);
        else if (state instanceof IdleState) { served.add(f); state = new DoorsOpenState(Direction.UP); }
        else if (state instanceof MovingState m) {       // just leaving this floor: catch it on the way back
            if (m.direction() == Direction.UP) downStops.add(f); else upStops.add(f);
        }
    }
    synchronized void tick() { state.tick(this); }

    boolean hasStopsAbove() { return !upStops.isEmpty(); }
    boolean hasStopsBelow() { return !downStops.isEmpty(); }
    void moveOneFloor(Direction d) { floor += (d == Direction.UP) ? 1 : -1; floorsTravelled++; }
    boolean consumeStopHere(Direction d) {
        TreeSet<Integer> stops = (d == Direction.UP) ? upStops : downStops;
        if (stops.remove(floor)) { served.add(floor); return true; }
        return false;
    }
    ElevatorState nextStateAfterStop(Direction last) {   // the LOOK rule
        if (last == Direction.UP && hasStopsAbove()) return new MovingState(Direction.UP);
        if (last == Direction.DOWN && hasStopsBelow()) return new MovingState(Direction.DOWN);
        if (hasStopsAbove()) return new MovingState(Direction.UP);
        if (hasStopsBelow()) return new MovingState(Direction.DOWN);
        return new IdleState();
    }
    void setState(ElevatorState s) { state = s; }

    int id() { return id; }
    synchronized int floor() { return floor; }
    synchronized boolean isIdle() { return state instanceof IdleState && upStops.isEmpty() && downStops.isEmpty(); }
    synchronized Direction movingDirection() { return state instanceof MovingState m ? m.direction() : null; }
    List<Integer> served() { return served; }
    int floorsTravelled() { return floorsTravelled; }
}

interface DispatchStrategy { ElevatorCar select(List<ElevatorCar> cars, int floor, Direction dir); }

class NearestSuitableCar implements DispatchStrategy {
    public ElevatorCar select(List<ElevatorCar> cars, int floor, Direction dir) {
        ElevatorCar best = null;
        int bestCost = Integer.MAX_VALUE;
        for (ElevatorCar c : cars) {
            int cost = cost(c, floor, dir);
            if (cost < bestCost) { bestCost = cost; best = c; }
        }
        return best;
    }
    private int cost(ElevatorCar c, int floor, Direction dir) {
        int distance = Math.abs(c.floor() - floor);
        Direction moving = c.movingDirection();
        if (moving == null) return distance;                         // idle or doors open
        boolean onTheWay = moving == dir && (dir == Direction.UP ? floor >= c.floor() : floor <= c.floor());
        return onTheWay ? distance : distance + 100;                  // moving away: heavy penalty
    }
}

class ElevatorSystem {
    private final List<ElevatorCar> cars = new ArrayList<>();
    private final DispatchStrategy dispatcher;

    ElevatorSystem(DispatchStrategy dispatcher, int... startFloors) {
        this.dispatcher = dispatcher;
        for (int i = 0; i < startFloors.length; i++) cars.add(new ElevatorCar(i, startFloors[i]));
    }
    ElevatorCar hallCall(int floor, Direction dir) {
        ElevatorCar car = dispatcher.select(cars, floor, dir);
        car.addStop(floor);
        return car;
    }
    void carCall(int carId, int floor) { cars.get(carId).addStop(floor); }
    void runUntilIdle(int maxTicks) {
        for (int t = 0; t < maxTicks; t++) {
            cars.forEach(ElevatorCar::tick);
            if (cars.stream().allMatch(ElevatorCar::isIdle)) return;
        }
    }
    ElevatorCar car(int id) { return cars.get(id); }
}

class ElevatorDemo {
    public static void main(String[] args) {
        // 1) LOOK inside one car: at floor 5, stops requested in order 8, 2, 9, 3, 6
        ElevatorSystem one = new ElevatorSystem(new NearestSuitableCar(), 5);
        for (int f : new int[] {8, 2, 9, 3, 6}) one.carCall(0, f);
        one.runUntilIdle(100);
        System.out.println("served " + one.car(0).served() + ", floors travelled " + one.car(0).floorsTravelled());

        // 2) Dispatch: car 0 idle at floor 0, car 1 idle at floor 10; someone presses UP at floor 7
        ElevatorSystem two = new ElevatorSystem(new NearestSuitableCar(), 0, 10);
        ElevatorCar chosen = two.hallCall(7, Direction.UP);
        System.out.println("hall call 7 UP -> car " + chosen.id());
        two.runUntilIdle(100);                              // car 1 comes down 10 -> 7, doors open
        two.carCall(chosen.id(), 12);                       // passenger boards, presses 12
        two.runUntilIdle(100);
        System.out.println("car " + chosen.id() + " served " + chosen.served());
    }
}`, lang: "java", title: "Elevator.java — State pattern + LOOK + dispatch strategy" },
        { code: `served [6, 8, 9, 3, 2], floors travelled 11
hall call 7 UP -> car 1
car 1 served [7, 12]`, lang: "text", title: "Output" },
        { p: "Trace of demo 1: stops 8, 9, 6 are above 5 → <code>upStops = {6, 8, 9}</code>; 2, 3 are below → <code>downStops = {2, 3}</code>. IDLE sees stops above → MOVING_UP; it stops at 6, 8, 9; <code>upStops</code> is now empty, so DOORS_OPEN picks MOVING_DOWN and serves 3, then 2. Travel 4 + 7 = 11." },
        { warn: "The IDLE rule in the skeleton (\"prefer up if anything is above\") is naive: if an idle car at 10 has a hall call waiting at 7 and someone else's stop at 12 arrives at the same moment, it goes to 12 first and the person at 7 waits. Say this out loud and propose a better rule: pick the direction of the <b>oldest</b> pending request (or the nearest)." }
      ] },
      { h: "Sequence of one request + concurrency", blocks: [
        { svg: `<svg viewBox="0 0 700 290" width="700" class="dg">
  <rect class="box" x="20" y="10" width="110" height="30" rx="4"/>
  <text class="tx" x="75" y="25" text-anchor="middle" dominant-baseline="middle">Passenger</text>
  <rect class="box" x="160" y="10" width="120" height="30" rx="4"/>
  <text class="tx" x="220" y="25" text-anchor="middle" dominant-baseline="middle">ElevatorSystem</text>
  <rect class="box" x="310" y="10" width="110" height="30" rx="4"/>
  <text class="tx" x="365" y="25" text-anchor="middle" dominant-baseline="middle">Dispatcher</text>
  <rect class="box" x="450" y="10" width="110" height="30" rx="4"/>
  <text class="tx" x="505" y="25" text-anchor="middle" dominant-baseline="middle">Car 1</text>
  <rect class="box" x="590" y="10" width="90" height="30" rx="4"/>
  <text class="tx" x="635" y="25" text-anchor="middle" dominant-baseline="middle">Door</text>
  <line class="ln ln-d" x1="75" y1="40" x2="75" y2="280"/>
  <line class="ln ln-d" x1="220" y1="40" x2="220" y2="280"/>
  <line class="ln ln-d" x1="365" y1="40" x2="365" y2="280"/>
  <line class="ln ln-d" x1="505" y1="40" x2="505" y2="280"/>
  <line class="ln ln-d" x1="635" y1="40" x2="635" y2="280"/>
  <line class="ln" x1="75" y1="64" x2="218" y2="64" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="84" y="58">hallCall(7, UP)</text>
  <line class="ln" x1="220" y1="94" x2="363" y2="94" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="228" y="88">select(cars, 7, UP)</text>
  <line class="ln ln-d" x1="365" y1="120" x2="222" y2="120" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="300" y="114">car 1</text>
  <line class="ln" x1="220" y1="148" x2="503" y2="148" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="330" y="142">addStop(7)</text>
  <line class="ln-a" x1="505" y1="170" x2="540" y2="170"/>
  <line class="ln-a" x1="540" y1="170" x2="540" y2="190"/>
  <line class="ln-a" x1="540" y1="190" x2="507" y2="190" marker-end="url(#dg-arr-a)"/>
  <text class="tx-s" x="546" y="184">tick()… reach 7</text>
  <line class="ln" x1="505" y1="214" x2="633" y2="214" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="540" y="208">open()</text>
  <line class="ln" x1="75" y1="244" x2="503" y2="244" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="240" y="238">inside: carCall(12)</text>
  <line class="ln" x1="505" y1="270" x2="633" y2="270" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="540" y="264">close()</text>
</svg>`, caption: "Sequence diagram of a hall call: dispatch, stop added, car moves tick by tick, doors open, passenger adds a car call, doors close." },
        { ul: [
          "<b>Threads</b>: buttons fire from many threads; each car runs its own controller loop (a thread ticking every N ms). <code>addStop</code> and <code>tick</code> are <code>synchronized</code> on the car, so a stop can't be added while the car is deciding its next state.",
          "Alternative: each car consumes a <code>BlockingQueue&lt;Request&gt;</code> — a producer–consumer design with no shared locking in the button code.",
          "<b>Dispatcher reads</b> car floor/direction without locking the whole system; a slightly stale view is acceptable (it's a heuristic).",
          "<b>Extensibility</b>: peak-hour dispatch (morning up-peak: send idle cars to the lobby) is just another <code>DispatchStrategy</code>; VIP/fire mode is another state."
        ] }
      ] }
    ],
    practice: [
      { q: "Car at floor 4 moving <b>down</b>; pending stops arrived in order 7, 1, 3, 9, 2 (floors 0–10). Give the LOOK order and total floors; then SCAN.", a: "LOOK going down first: stops below 4 in descending order 3, 2, 1, then reverse: 7, 9. Travel 4→1 = 3, 1→9 = 8 → <b>11 floors</b>. SCAN goes to floor 0 before reversing: 4→0 = 4, 0→9 = 9 → <b>13 floors</b>." },
      { q: "Why does SSTF risk starvation in an elevator but LOOK does not?", a: "SSTF always picks the nearest pending stop. If new requests keep appearing near the car (e.g. floors 3–5 at rush hour), a stop at floor 20 is never nearest and waits indefinitely. LOOK commits to a direction and serves every stop ahead before reversing, so any stop is reached within at most one up-sweep plus one down-sweep." },
      { q: "Draw the state table for the car including MAINTENANCE. Which states can go to MAINTENANCE and what happens to pending stops?", a: "IDLE, MOVING_UP/DOWN, DOORS_OPEN can all go to MAINTENANCE on an alarm/technician event (moving states first stop at the nearest floor and open doors). On entering MAINTENANCE, pending <b>hall</b> calls are handed back to the <code>ElevatorSystem</code> for re-dispatch to other cars; car calls are dropped (passengers exit). MAINTENANCE → IDLE on reset. The dispatcher's cost function returns ∞ for a car in MAINTENANCE." },
      { q: "Three cars: A idle at 2, B at 9 moving down, C at 5 moving up. Hall call: floor 6, UP. Using the cost function in the code, which car is chosen?", a: "A: idle → cost = |2−6| = 4. B: moving DOWN, request is UP → not on the way → 3 + 100 = 103. C: moving UP, request UP and 6 ≥ 5 → on the way → cost 1. <b>C</b> is chosen." },
      { q: "Where are the race conditions in an elevator system, and how does the skeleton handle them?", a: "(1) A button thread adding a stop while the car's controller thread is moving or choosing the next state — both touch <code>upStops/downStops/state</code>; handled by making <code>addStop</code> and <code>tick</code> <code>synchronized</code> on the car. (2) Two hall calls dispatched concurrently reading car positions — acceptable staleness, since dispatch is a heuristic; the stop is then added through the car's synchronized method. A queue-per-car design removes (1) entirely." }
    ],
    related: ["oops:strategy-pattern", "oops:solid-principles", "os:disk-scheduling", "os:monitors", "os:producer-consumer", "os:priority-starvation-aging"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-splitwise",
    subject: "lld",
    title: "Design Splitwise — expenses, split strategies, balances, simplify debts",
    minutes: 70,
    crux: [
      "Entities: <code>User</code>, <code>Group</code>, <code>Expense</code> (payer, amount, shares), <code>SplitStrategy</code> (EQUAL / EXACT / PERCENT), <code>BalanceSheet</code>.",
      "Store money as <code>long</code> <b>paise</b>, never <code>double</code>. Equal split of ₹100 among 3 = 3334 + 3333 + 3333 paise — give the leftover paise to someone deterministically.",
      "For every expense, each participant (other than the payer) owes the payer their share. Keep pairwise debts netted: if B owes A 300 and A owes B 100, store only \"B owes A 200\".",
      "<b>Net balance</b> of a person = total paid − total share. Net balances always sum to 0.",
      "<b>Simplify debts</b> (greedy): repeatedly match the biggest creditor with the biggest debtor and settle min(credit, debt). At most n − 1 transactions. (The true minimum is NP-hard — say so.)",
      "Split rules are a <b>Strategy</b>; validation (exact shares must add up, percents to 100) lives inside each strategy."
    ],
    sections: [
      { h: "Requirements, entities and diagram", blocks: [
        { ol: [
          "Users can create groups and add expenses to a group (or between two people).",
          "An expense has one payer, an amount and a split: EQUAL, EXACT amounts, or PERCENT.",
          "Show each user's balance: who owes them and whom they owe.",
          "Settle up: record a payment from one user to another.",
          "Simplify debts in a group to the fewest reasonable transactions.",
          "Out of scope: currency conversion, recurring expenses, notifications (mention Observer if asked)."
        ] },
        { svg: `<svg viewBox="0 0 700 210" width="700" class="dg">
  <rect class="box-a" x="250" y="20" width="200" height="40" rx="4"/>
  <text class="tx tx-b" x="350" y="40" text-anchor="middle" dominant-baseline="middle">ExpenseManager</text>
  <rect class="box" x="20" y="20" width="140" height="40" rx="4"/>
  <text class="tx" x="90" y="40" text-anchor="middle" dominant-baseline="middle">Group</text>
  <polygon class="box" points="250,40 236,33 222,40 236,47"/>
  <line class="ln" x1="222" y1="40" x2="160" y2="40"/>
  <rect class="box" x="20" y="120" width="140" height="40" rx="4"/>
  <text class="tx" x="90" y="140" text-anchor="middle" dominant-baseline="middle">User</text>
  <polygon class="box" points="90,60 97,73 90,86 83,73"/>
  <line class="ln" x1="90" y1="86" x2="90" y2="120"/>
  <text class="tx-s" x="98" y="112">2..*</text>
  <rect class="box" x="250" y="120" width="200" height="40" rx="4"/>
  <text class="tx" x="350" y="140" text-anchor="middle" dominant-baseline="middle">Expense</text>
  <polygon class="box-a" points="350,60 358,73 350,86 342,73"/>
  <line class="ln-a" x1="350" y1="86" x2="350" y2="120"/>
  <text class="tx-s" x="358" y="112">0..*</text>
  <line class="ln" x1="250" y1="140" x2="162" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="180" y="132">paidBy, shares</text>
  <rect class="box" x="520" y="20" width="160" height="40" rx="4"/>
  <text class="tx" x="600" y="40" text-anchor="middle" dominant-baseline="middle">BalanceSheet</text>
  <polygon class="box-a" points="450,40 464,33 478,40 464,47"/>
  <line class="ln-a" x1="478" y1="40" x2="520" y2="40"/>
  <rect class="box" x="520" y="120" width="160" height="40" rx="4"/>
  <text class="tx-m" x="600" y="132" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="600" y="148" text-anchor="middle" dominant-baseline="middle">SplitStrategy</text>
  <line class="ln ln-d" x1="450" y1="140" x2="518" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="600" y="182" text-anchor="middle">impl: Equal / Exact / Percent</text>
</svg>`, caption: "ExpenseManager owns expenses and the balance sheet; an expense references users; creating an expense depends on a SplitStrategy." }
      ] },
      { h: "Worked example: balances and simplification", blocks: [
        { p: "Four friends A, B, C, D on a trip:" },
        { ol: [
          "<b>Dinner</b> ₹1200 paid by A, split EQUAL among A, B, C, D → ₹300 each.",
          "<b>Cab</b> ₹600 paid by B, split EQUAL among B, C → ₹300 each.",
          "<b>Movie</b> ₹400 paid by C, split EXACT: A ₹100, D ₹300 (C didn't watch)."
        ] },
        { table: { head: ["Person", "Paid", "Share", "Net = paid − share"], rows: [
          ["A", "1200", "300 + 100 = 400", "<b>+800</b> (is owed)"],
          ["B", "600", "300 + 300 = 600", "<b>0</b>"],
          ["C", "400", "300 + 300 = 600", "<b>−200</b> (owes)"],
          ["D", "0", "300 + 300 = 600", "<b>−600</b> (owes)"],
          ["Sum", "2200", "2200", "0 ✓"]
        ] } },
        { p: "<b>Pairwise ledger</b> (each share is a debt to that expense's payer, netted per pair): dinner gives B→A 300, C→A 300, D→A 300; cab gives C→B 300; movie gives A→C 100 which nets against C→A 300 to leave C→A 200, and D→C 300. Result: <b>5 transactions</b> — B→A 300, C→A 200, C→B 300, D→A 300, D→C 300." },
        { p: "<b>Simplified (greedy on net balances)</b>: creditors {A: 800}, debtors {D: 600, C: 200}. Match biggest with biggest: D pays A 600 → A still owed 200. Then C pays A 200. <b>2 transactions</b>, and B (net 0) doesn't have to do anything even though B was part of the pairwise debts." },
        { warn: "Greedy guarantees ≤ n − 1 transactions but not always the minimum. Finding the true minimum is NP-hard (it requires partitioning people into as many zero-sum subgroups as possible). Interviewers want you to know this and still ship greedy." }
      ] },
      { h: "Code: strategies, ledger, simplify (compiles and runs)", blocks: [
        { code: `import java.util.*;

record User(String name) {}

interface SplitStrategy {
    Map<User, Long> shares(long total, List<User> users, List<Long> values);
}

class EqualSplit implements SplitStrategy {
    public Map<User, Long> shares(long total, List<User> users, List<Long> values) {
        Map<User, Long> m = new LinkedHashMap<>();
        long base = total / users.size(), extra = total % users.size();
        for (int i = 0; i < users.size(); i++) m.put(users.get(i), base + (i < extra ? 1 : 0));
        return m;                                  // 10000 among 3 -> 3334, 3333, 3333
    }
}
class ExactSplit implements SplitStrategy {
    public Map<User, Long> shares(long total, List<User> users, List<Long> values) {
        long sum = values.stream().mapToLong(Long::longValue).sum();
        if (sum != total) throw new IllegalArgumentException("exact shares " + sum + " != total " + total);
        Map<User, Long> m = new LinkedHashMap<>();
        for (int i = 0; i < users.size(); i++) m.put(users.get(i), values.get(i));
        return m;
    }
}
class PercentSplit implements SplitStrategy {
    public Map<User, Long> shares(long total, List<User> users, List<Long> pcts) {
        if (pcts.stream().mapToLong(Long::longValue).sum() != 100) throw new IllegalArgumentException("percentages must add to 100");
        Map<User, Long> m = new LinkedHashMap<>();
        long assigned = 0;
        for (int i = 0; i < users.size(); i++) {
            long s = total * pcts.get(i) / 100;
            m.put(users.get(i), s);
            assigned += s;
        }
        User first = users.get(0);
        m.put(first, m.get(first) + (total - assigned));   // leftover paise from rounding
        return m;
    }
}

record Expense(String desc, User paidBy, long amount, Map<User, Long> shares) {}

class ExpenseManager {
    private static final Comparator<User> BY_NAME = Comparator.comparing(User::name);
    private final List<Expense> expenses = new ArrayList<>();
    private final Map<User, Map<User, Long>> owes = new TreeMap<>(BY_NAME);   // owes[a][b] = a owes b
    private final Map<User, Long> net = new TreeMap<>(BY_NAME);

    synchronized void addExpense(String desc, User paidBy, long amount, SplitStrategy how,
                                 List<User> users, List<Long> values) {
        Map<User, Long> shares = how.shares(amount, users, values);
        expenses.add(new Expense(desc, paidBy, amount, shares));
        shares.forEach((u, share) -> {
            net.merge(paidBy, share, Long::sum);
            net.merge(u, -share, Long::sum);
            if (!u.equals(paidBy)) record(u, paidBy, share);
        });
    }

    private long get(User a, User b) { return owes.getOrDefault(a, Map.of()).getOrDefault(b, 0L); }
    private void put(User a, User b, long v) {
        Map<User, Long> row = owes.computeIfAbsent(a, k -> new TreeMap<>(BY_NAME));
        if (v == 0) row.remove(b); else row.put(b, v);
    }
    private void record(User debtor, User creditor, long amt) {
        long reverse = get(creditor, debtor);           // creditor already owes debtor? net it off
        if (reverse >= amt) put(creditor, debtor, reverse - amt);
        else { put(creditor, debtor, 0); put(debtor, creditor, get(debtor, creditor) + amt - reverse); }
    }

    List<String> pairwise() {
        List<String> out = new ArrayList<>();
        owes.forEach((a, row) -> row.forEach((b, v) -> out.add(a.name() + " owes " + b.name() + " " + rs(v))));
        return out;
    }

    List<String> simplify() {
        record Bal(User user, long amt) {}
        Comparator<Bal> biggestFirst = Comparator.comparingLong(Bal::amt).reversed();
        PriorityQueue<Bal> creditors = new PriorityQueue<>(biggestFirst);
        PriorityQueue<Bal> debtors = new PriorityQueue<>(biggestFirst);
        net.forEach((u, v) -> {
            if (v > 0) creditors.add(new Bal(u, v));
            else if (v < 0) debtors.add(new Bal(u, -v));
        });
        List<String> tx = new ArrayList<>();
        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            Bal c = creditors.poll(), d = debtors.poll();
            long x = Math.min(c.amt(), d.amt());
            tx.add(d.user().name() + " pays " + c.user().name() + " " + rs(x));
            if (c.amt() > x) creditors.add(new Bal(c.user(), c.amt() - x));
            if (d.amt() > x) debtors.add(new Bal(d.user(), d.amt() - x));
        }
        return tx;
    }

    Map<User, Long> net() { return net; }
    static String rs(long paise) {
        long a = Math.abs(paise);
        return (paise < 0 ? "-" : "") + String.format("Rs %d.%02d", a / 100, a % 100);
    }
}

class SplitwiseDemo {
    public static void main(String[] args) {
        User a = new User("A"), b = new User("B"), c = new User("C"), d = new User("D");
        ExpenseManager em = new ExpenseManager();
        em.addExpense("Dinner", a, 120000, new EqualSplit(), List.of(a, b, c, d), List.of());
        em.addExpense("Cab", b, 60000, new EqualSplit(), List.of(b, c), List.of());
        em.addExpense("Movie", c, 40000, new ExactSplit(), List.of(a, d), List.of(10000L, 30000L));

        em.net().forEach((u, v) -> System.out.println("net " + u.name() + ": " + ExpenseManager.rs(v)));
        System.out.println("pairwise: " + em.pairwise());
        System.out.println("simplified: " + em.simplify());
        System.out.println("equal split of Rs 100 among 3: "
                + new EqualSplit().shares(10000, List.of(a, b, c), List.of()).values());
    }
}`, lang: "java", title: "Splitwise.java" },
        { code: `net A: Rs 800.00
net B: Rs 0.00
net C: -Rs 200.00
net D: -Rs 600.00
pairwise: [B owes A Rs 300.00, C owes A Rs 200.00, C owes B Rs 300.00, D owes A Rs 300.00, D owes C Rs 300.00]
simplified: [D pays A Rs 600.00, C pays A Rs 200.00]
equal split of Rs 100 among 3: [3334, 3333, 3333]`, lang: "text", title: "Output" },
        { ul: [
          "<code>addExpense</code> is <code>synchronized</code>: two members adding expenses at once must not interleave balance updates. In a DB, all balance rows for an expense are updated in one transaction.",
          "Adding a new split type (by shares: 2:1:1) is a new <code>SplitStrategy</code> class — OCP.",
          "Settle-up is just an expense of type PAYMENT: debtor \"pays\" amount with a 100% EXACT share for the creditor."
        ] }
      ] }
    ],
    practice: [
      { q: "P pays ₹900 for P, Q, R equally. Q pays ₹300 for Q and R equally. Give net balances and the simplified settlements.", a: "Expense 1: shares 300 each → P +600, Q −300, R −300. Expense 2: shares 150 each → Q +150, R −150. Net: P <b>+600</b>, Q −300 + 150 = <b>−150</b>, R −300 − 150 = <b>−450</b> (sum 0 ✓). Greedy: biggest debtor R (450) pays P 450 → P still owed 150; Q pays P 150. <b>2 transactions</b>: R→P ₹450, Q→P ₹150." },
      { q: "Why store amounts in paise as <code>long</code> instead of rupees as <code>double</code>? Show a failure.", a: "<code>double</code> can't represent most decimal fractions exactly: <code>0.1 + 0.2 == 0.30000000000000004</code>, so balances drift and never sum exactly to 0; equality checks (\"is the debt settled?\") fail. Integers in the smallest unit are exact; for division, compute remainders explicitly (e.g. 10000 / 3 → 3333 r 1, give the extra paisa to one person). <code>BigDecimal</code> is the other acceptable answer." },
      { q: "A 30% / 30% / 40% PERCENT split of ₹333.33 (33333 paise). What does <code>PercentSplit</code> produce?", a: "30%: 33333 × 30 / 100 = 999990 / 100 = 9999 (integer division). Same for the second: 9999. 40%: 1333320 / 100 = 13333. Assigned = 33331, leftover = 2 paise → first person gets 10001. Shares: <b>10001, 9999, 13333</b> = 33333 ✓." },
      { q: "Is the greedy simplification always optimal? Give a counter-example.", a: "No. Nets (in ₹): A +4, B +3, C −3, D −2, E −2. <b>Greedy</b> (biggest with biggest): C pays A 3 → A +1; D pays B 2 → B +1; E pays A 1; E pays B 1 → <b>4</b> transactions. <b>Optimal</b>: C pays B 3, D pays A 2, E pays A 2 → <b>3</b> transactions. The optimum splits people into the most disjoint zero-sum groups ({B, C} and {A, D, E}); with k such groups you need n − k transactions. Finding them is NP-hard in general; for small groups (≤ 15–20 people) a bitmask DP over subsets works. Say: \"greedy gives ≤ n − 1, which is what Splitwise-style apps ship\"." }
    ],
    related: ["oops:strategy-pattern", "oops:solid-principles", "oops:immutable-class", "oops:records-sealed-classes", "dbms:acid-properties"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-tictactoe",
    subject: "lld",
    title: "Design Tic-Tac-Toe — n×n board with an O(1) win check",
    minutes: 40,
    crux: [
      "Classes: <code>Game</code> (turns, status), <code>Board</code> (n×n cells), <code>Player</code> (name, symbol), <code>WinChecker</code>, enums <code>Symbol</code> and <code>GameStatus</code>.",
      "Naive win check scans the row, column and diagonals after each move: O(n). The trick is <b>O(1)</b>: keep counters <code>rows[n]</code>, <code>cols[n]</code>, <code>diag</code>, <code>antiDiag</code>; X adds +1, O adds −1; a move wins if any touched counter reaches ±n.",
      "A cell (r, c) is on the main diagonal if <code>r == c</code> and on the anti-diagonal if <code>r + c == n − 1</code>.",
      "Draw = <code>moves == n × n</code> with no winner. Validate: game not over, cell in range and empty, correct player's turn.",
      "Extensions: more than 2 players (one counter array per player), undo (Command pattern), bot player (Strategy)."
    ],
    sections: [
      { h: "Requirements and classes", blocks: [
        { ul: [
          "Two players alternate placing X and O on an n×n board (default 3).",
          "A player wins with n in a row, column or either diagonal; the game is a draw when the board fills.",
          "Reject invalid moves (occupied cell, out of range, game already over).",
          "Nice to have: undo, AI player, k-in-a-row on a larger board (Gomoku)."
        ] },
        { table: { head: ["Class", "Responsibility"], rows: [
          ["<code>Game</code>", "turn order (a queue of players), apply a move, status transitions"],
          ["<code>Board</code>", "n×n <code>Symbol[][]</code>, bounds/empty checks, printing"],
          ["<code>WinChecker</code>", "O(1) counters, decides whether the last move won"],
          ["<code>Player</code> (record)", "name + symbol; later an interface <code>MoveSource</code> for human vs bot"],
          ["<code>Symbol</code>, <code>GameStatus</code>", "X / O; IN_PROGRESS, X_WON, O_WON, DRAW"]
        ] } }
      ] },
      { h: "The O(1) win check", blocks: [
        { p: "Every row, column and the two diagonals get one integer counter. When X plays (r, c) add +1 to <code>rows[r]</code> and <code>cols[c]</code> (and to <code>diag</code> if r == c, to <code>antiDiag</code> if r + c == n − 1); O adds −1. A line with k X's and no O's has counter +k; any O in the line pulls it away from +n. So <code>|counter| == n</code> ⇔ all n cells in that line belong to one player." },
        { p: "Worked on 3×3: X at (0,0): rows[0]=1, cols[0]=1, diag=1. O at (1,1): rows[1]=−1, cols[1]=−1, diag=0, antiDiag=−1. X at (0,1): rows[0]=2, cols[1]=0. O at (2,2): rows[2]=−1, cols[2]=−1, diag=−1. X at (0,2): rows[0]=<b>3</b> → X wins; also cols[2]=0, antiDiag=0." },
        { code: `import java.util.*;

enum Symbol { X, O }
enum GameStatus { IN_PROGRESS, X_WON, O_WON, DRAW }

record Player(String name, Symbol symbol) {}

class Board {
    private final int n;
    private final Symbol[][] cells;
    Board(int n) { this.n = n; this.cells = new Symbol[n][n]; }
    int size() { return n; }
    boolean isFree(int r, int c) { return r >= 0 && r < n && c >= 0 && c < n && cells[r][c] == null; }
    void place(int r, int c, Symbol s) { cells[r][c] = s; }
    void print() {
        for (Symbol[] row : cells) {
            StringBuilder sb = new StringBuilder();
            for (Symbol s : row) sb.append(s == null ? '.' : s.name().charAt(0)).append(' ');
            System.out.println(sb.toString().trim());
        }
    }
}

class WinChecker {
    private final int n;
    private final int[] rows, cols;
    private int diag, antiDiag;
    WinChecker(int n) { this.n = n; rows = new int[n]; cols = new int[n]; }

    /** O(1): returns true if this move completes a line. */
    boolean record(int r, int c, Symbol s) {
        int d = (s == Symbol.X) ? 1 : -1;
        rows[r] += d;
        cols[c] += d;
        if (r == c) diag += d;
        if (r + c == n - 1) antiDiag += d;
        return Math.abs(rows[r]) == n || Math.abs(cols[c]) == n
            || Math.abs(diag) == n || Math.abs(antiDiag) == n;
    }
}

class Game {
    private final Board board;
    private final WinChecker checker;
    private final Deque<Player> turns = new ArrayDeque<>();
    private GameStatus status = GameStatus.IN_PROGRESS;
    private int moves;

    Game(int n, Player first, Player second) {
        board = new Board(n);
        checker = new WinChecker(n);
        turns.add(first);
        turns.add(second);
    }

    GameStatus play(int r, int c) {
        if (status != GameStatus.IN_PROGRESS) throw new IllegalStateException("game is over: " + status);
        if (!board.isFree(r, c)) throw new IllegalArgumentException("cell (" + r + "," + c + ") taken or off the board");
        Player p = turns.pollFirst();
        board.place(r, c, p.symbol());
        moves++;
        if (checker.record(r, c, p.symbol())) status = (p.symbol() == Symbol.X) ? GameStatus.X_WON : GameStatus.O_WON;
        else if (moves == board.size() * board.size()) status = GameStatus.DRAW;
        turns.addLast(p);
        return status;
    }
    Board board() { return board; }
}

class TicTacToeDemo {
    public static void main(String[] args) {
        Game g = new Game(3, new Player("Asha", Symbol.X), new Player("Ravi", Symbol.O));
        int[][] moves = { {0, 0}, {1, 1}, {0, 1}, {2, 2}, {0, 2} };
        GameStatus st = null;
        for (int[] m : moves) {
            try {
                st = g.play(m[0], m[1]);
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
        g.board().print();
        System.out.println("status: " + st);
        try { g.play(2, 0); } catch (IllegalStateException e) { System.out.println(e.getMessage()); }
    }
}`, lang: "java", title: "TicTacToe.java" },
        { code: `X X X
. O .
. . O
status: X_WON
game is over: X_WON`, lang: "text", title: "Output" },
        { tip: "Say the complexity explicitly: O(1) time per move and O(n) extra space for counters, versus O(n) time per move for re-scanning the lines (O(n²) if you re-scan the whole board)." }
      ] },
      { h: "Extensions interviewers ask for", blocks: [
        { table: { head: ["Ask", "Change"], rows: [
          ["3+ players with symbols X, O, Δ", "the ±1 trick breaks; keep counters per player: <code>rows[p][r]</code> etc. — win when a player's counter hits n"],
          ["Undo last move", "Command: each move is an object that knows how to revert board + counters (subtract d); keep a stack"],
          ["Computer player", "<code>interface MoveStrategy { int[] next(Board b); }</code> — random, rule-based, or minimax; human input is another implementation"],
          ["k-in-a-row on an m×n board (Gomoku)", "counters don't work (lines are longer than k); after each move count consecutive same symbols in the 4 directions through the move: O(k)"],
          ["Online multiplayer", "Game becomes server state; moves arrive concurrently → <code>play()</code> synchronized or per-game single-threaded actor; check it's that player's turn"]
        ] } }
      ] }
    ],
    practice: [
      { q: "On a 4×4 board, which counters does a move at (1, 2) update?", a: "<code>rows[1]</code> and <code>cols[2]</code>. Main diagonal needs r == c (1 ≠ 2) → no. Anti-diagonal needs r + c == n − 1 = 3 → 1 + 2 = 3 → <b>yes</b>, update <code>antiDiag</code>." },
      { q: "Prove that |rows[r]| == n implies one player owns all of row r.", a: "The row has n cells, each contributing +1 (X), −1 (O) or 0 (empty). The sum of n terms each in {−1, 0, 1} equals ±n only if every term is +1 (or every term is −1). So all n cells are X (or all O)." },
      { q: "Why is <code>Player</code> a record and <code>Board</code> a class?", a: "<code>Player</code> is pure immutable data (name + symbol) with value equality — exactly what a record is for. <code>Board</code> holds mutable state (the cells) and behaviour (<code>isFree</code>, <code>place</code>), and must not expose its array, so it's a regular class with private fields." },
      { q: "What bug appears if you check for a draw <i>before</i> checking for a win?", a: "The last move on a full board can also be a winning move (e.g. X completes a line with the 9th move). Checking <code>moves == n*n</code> first would report DRAW instead of X_WON. Always check the win first, then the draw." }
    ],
    related: ["oops:encapsulation-vs-abstraction", "oops:records-sealed-classes", "oops:enums-in-java", "oops:strategy-pattern"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-bookmyshow",
    subject: "lld",
    title: "Design BookMyShow — seat holds, lock expiry and concurrency",
    minutes: 80,
    crux: [
      "Entities: <code>Movie</code>, <code>Cinema</code> ◆ <code>Screen</code> ◆ <code>Seat</code>, <code>Show</code> (movie + screen + time), <code>ShowSeat</code> (a seat's status <i>for one show</i>), <code>Booking</code>, <code>Payment</code>.",
      "The key idea: a <code>Seat</code> is physical; availability belongs to <code>ShowSeat</code> = (show, seat, status AVAILABLE / LOCKED / BOOKED, lockedBy, lockExpiry).",
      "Booking is two-phase: <b>hold</b> the selected seats for ~10 minutes (all-or-nothing), then <b>confirm</b> after payment. Expired holds become available again.",
      "<b>Pessimistic</b>: <code>SELECT … FOR UPDATE</code> locks the rows, check, update, commit — simple, blocks others. <b>Optimistic</b>: one conditional <code>UPDATE … WHERE status='AVAILABLE'</code> (or <code>version = ?</code>) and check rows affected — no blocking, retry on conflict.",
      "In Java memory: <code>ConcurrentHashMap.compute()</code> gives an atomic check-and-set per seat; acquire seats in <b>sorted order</b> and roll back partial holds.",
      "Expiry: store <code>expiresAt</code>; treat an expired hold as free when checking (lazy) plus a periodic sweeper. Reject confirmation after expiry and refund."
    ],
    sections: [
      { h: "Requirements and entities", blocks: [
        { ol: [
          "Users pick a city, see movies playing, and the shows (cinema, screen, time) for a movie.",
          "For a show, see the seat map with prices per seat category (SILVER / GOLD / RECLINER).",
          "Select up to 10 seats → seats are held for 10 minutes while the user pays.",
          "Payment success → booking confirmed, tickets issued. Failure or timeout → seats released.",
          "<b>No seat may ever be sold twice</b>, even when thousands of users hit a popular show at once.",
          "Out of scope: reviews, food add-ons, dynamic pricing (mention Strategy for pricing)."
        ] },
        { svg: `<svg viewBox="0 0 700 250" width="700" class="dg">
  <rect class="box" x="20" y="20" width="120" height="36" rx="4"/>
  <text class="tx" x="80" y="38" text-anchor="middle" dominant-baseline="middle">Cinema</text>
  <polygon class="box-a" points="140,38 154,31 168,38 154,45"/>
  <line class="ln-a" x1="168" y1="38" x2="220" y2="38"/>
  <rect class="box" x="220" y="20" width="120" height="36" rx="4"/>
  <text class="tx" x="280" y="38" text-anchor="middle" dominant-baseline="middle">Screen</text>
  <polygon class="box-a" points="340,38 354,31 368,38 354,45"/>
  <line class="ln-a" x1="368" y1="38" x2="420" y2="38"/>
  <rect class="box" x="420" y="20" width="120" height="36" rx="4"/>
  <text class="tx" x="480" y="38" text-anchor="middle" dominant-baseline="middle">Seat</text>

  <rect class="box" x="20" y="110" width="120" height="36" rx="4"/>
  <text class="tx" x="80" y="128" text-anchor="middle" dominant-baseline="middle">Movie</text>
  <rect class="box-a" x="220" y="110" width="120" height="36" rx="4"/>
  <text class="tx tx-b" x="280" y="128" text-anchor="middle" dominant-baseline="middle">Show</text>
  <line class="ln" x1="220" y1="128" x2="142" y2="128" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="110" x2="280" y2="58" marker-end="url(#dg-arr)"/>
  <polygon class="box-a" points="340,128 354,121 368,128 354,135"/>
  <line class="ln-a" x1="368" y1="128" x2="420" y2="128"/>
  <text class="tx-s" x="392" y="120">1..*</text>
  <rect class="box-w" x="420" y="110" width="140" height="36" rx="4"/>
  <text class="tx tx-b" x="490" y="128" text-anchor="middle" dominant-baseline="middle">ShowSeat</text>
  <line class="ln" x1="480" y1="110" x2="480" y2="58" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="570" y="122">status, lockedBy,</text>
  <text class="tx-m" x="570" y="138">lockExpiry, version</text>

  <rect class="box" x="220" y="195" width="120" height="36" rx="4"/>
  <text class="tx" x="280" y="213" text-anchor="middle" dominant-baseline="middle">Booking</text>
  <line class="ln" x1="280" y1="195" x2="280" y2="148" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="340" y1="213" x2="470" y2="148" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="410" y="196">1..10 seats</text>
  <rect class="box" x="20" y="195" width="120" height="36" rx="4"/>
  <text class="tx" x="80" y="213" text-anchor="middle" dominant-baseline="middle">User</text>
  <line class="ln" x1="220" y1="213" x2="142" y2="213" marker-end="url(#dg-arr)"/>
  <rect class="box" x="560" y="195" width="120" height="36" rx="4"/>
  <text class="tx" x="620" y="213" text-anchor="middle" dominant-baseline="middle">Payment</text>
  <polygon class="box-a" points="340,222 354,229 340,236 326,229"/>
  <line class="ln-a" x1="340" y1="236" x2="560" y2="220"/>
</svg>`, caption: "Cinema ◆ Screen ◆ Seat are physical. A Show composes one ShowSeat per seat — that is where status and locks live. A Booking references the show, the user and 1..10 show-seats, and owns its payment." },
        { warn: "Putting <code>status</code> on <code>Seat</code> is the classic mistake: the same physical seat is free for the 6 pm show and booked for the 9 pm show. Status must be per (show, seat)." }
      ] },
      { h: "The booking flow", blocks: [
        { ol: [
          "User opens the seat map → read all <code>ShowSeat</code> rows for the show (a hold that has expired is shown as available).",
          "User selects A1, A2 → <code>holdSeats(show, [A1, A2], user)</code>: atomically move <i>all</i> of them from AVAILABLE to LOCKED(user, now + 10 min). If any one fails, release the ones taken and tell the user \"seat just got taken\".",
          "Create a <code>Booking</code> in PENDING and redirect to payment.",
          "Payment callback success → <code>confirm</code>: for every seat check it is still LOCKED by this user and not expired, set BOOKED, booking → CONFIRMED.",
          "Payment failure / user closes tab / 10 minutes pass → the hold expires; seats are available again. A late payment success for an expired hold → refund."
        ] },
        { tip: "Why hold instead of booking immediately on click? Payment takes minutes and can fail. Holding with a TTL stops two people paying for the same seat while guaranteeing seats can't be locked forever by abandoned sessions." }
      ] },
      { h: "Concurrency: pessimistic vs optimistic (say this out loud)", blocks: [
        { p: "The race: users X and Y click A1 within the same millisecond. Both read AVAILABLE. Without protection both write LOCKED and both pay. There are two standard fixes at the database level:" },
        { code: [
          { lang: "sql", src: `CREATE TABLE show_seat (
  show_id     INT         NOT NULL,
  seat_no     VARCHAR(5)  NOT NULL,
  status      VARCHAR(10) NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE | LOCKED | BOOKED
  locked_by   INT,
  lock_expiry TIMESTAMP,
  version     INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (show_id, seat_no)
);

-- PESSIMISTIC: lock the rows first; other transactions touching them wait.
BEGIN;
SELECT seat_no, status, lock_expiry
FROM show_seat
WHERE show_id = 42 AND seat_no IN ('A1', 'A2')
ORDER BY seat_no            -- same lock order for everyone: no deadlocks
FOR UPDATE;
-- application checks: every row AVAILABLE, or LOCKED with lock_expiry < now
UPDATE show_seat
SET status = 'LOCKED', locked_by = 7,
    lock_expiry = CURRENT_TIMESTAMP + INTERVAL '10' MINUTE
WHERE show_id = 42 AND seat_no IN ('A1', 'A2');
COMMIT;` },
          { lang: "sql", src: `-- OPTIMISTIC: no read lock. One conditional UPDATE does check-and-set atomically.
UPDATE show_seat
SET status = 'LOCKED', locked_by = 7,
    lock_expiry = CURRENT_TIMESTAMP + INTERVAL '10' MINUTE,
    version = version + 1
WHERE show_id = 42
  AND seat_no IN ('A1', 'A2')
  AND (status = 'AVAILABLE'
       OR (status = 'LOCKED' AND lock_expiry < CURRENT_TIMESTAMP));
-- rows affected must be 2. If it is 1, someone got the other seat:
-- ROLLBACK (inside a transaction) and tell the user.

-- Version-column variant: read (status, version), then
-- UPDATE ... SET version = version + 1 WHERE show_id = 42 AND seat_no = 'A1' AND version = 5;
-- 0 rows affected = somebody changed it since you read -> retry or fail.` }
        ], title: "Seat holds in SQL: pessimistic (tab 1) and optimistic (tab 2)" },
        { table: { head: ["", "Pessimistic locking", "Optimistic locking"], rows: [
          ["Idea", "lock first, then work", "work, then verify nobody interfered"],
          ["Mechanism", "<code>SELECT … FOR UPDATE</code>, <code>synchronized</code>, <code>ReentrantLock</code>", "version column / conditional update / CAS"],
          ["Under low contention", "pays lock overhead for nothing", "almost always succeeds first try — fast"],
          ["Under high contention", "requests queue up but each eventually decides", "many conflicts → retries / failures"],
          ["Risks", "deadlocks (fix: fixed lock order), long-held locks", "starvation of unlucky clients, retry storms"],
          ["Fits", "popular show opening sale, short transactions", "typical shows, read-heavy seat maps"]
        ] } },
        { ul: [
          "<b>Lock expiry</b>: never rely only on a cleanup job. Check expiry <i>inside</i> the atomic operation (the <code>OR lock_expiry &lt; now</code> above), so an expired hold is immediately takeable; a sweeper just tidies the table.",
          "<b>Distributed cache variant</b>: <code>SET seat:42:A1 user7 NX EX 600</code> in Redis — NX = only if absent, EX = auto-expire. Multi-seat holds need all-or-nothing handling (Lua script or release on partial failure).",
          "<b>Deadlocks</b>: user X locks A1 then A2 while Y locks A2 then A1 → both wait forever. Always acquire in sorted seat order."
        ] }
      ] },
      { h: "In-memory seat lock service (compiles and runs)", blocks: [
        { p: "The same logic in Java for an LLD round: <code>ConcurrentHashMap.compute</code> runs the lambda atomically for that key, so \"read current hold, decide, write\" can't interleave with another thread on the same seat. A mutable clock makes expiry testable." },
        { code: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

record Hold(String user, long expiresAt, boolean booked) {}

class SeatLockService {
    private final ConcurrentHashMap<String, Hold> holds = new ConcurrentHashMap<>();
    private final long ttlMillis;
    private final AtomicLong clock;                       // injected so tests can fast-forward

    SeatLockService(long ttlMillis, AtomicLong clock) { this.ttlMillis = ttlMillis; this.clock = clock; }

    private static String key(String show, String seat) { return show + ":" + seat; }
    private static boolean isFree(Hold h, long now) { return h == null || (!h.booked() && h.expiresAt() <= now); }

    /** All-or-nothing hold. Sorted order => two users always contend on the same first seat. */
    boolean lock(String show, List<String> seats, String user) {
        List<String> sorted = new ArrayList<>(seats);
        Collections.sort(sorted);
        long now = clock.get();
        List<String> acquired = new ArrayList<>();
        for (String seat : sorted) {
            Hold mine = new Hold(user, now + ttlMillis, false);
            Hold result = holds.compute(key(show, seat), (k, cur) -> isFree(cur, now) ? mine : cur);
            if (result != mine) {                          // someone else holds it: roll back ours
                release(show, acquired, user);
                return false;
            }
            acquired.add(seat);
        }
        return true;
    }

    /** After payment. Fails if any hold expired or was taken over. */
    boolean confirm(String show, List<String> seats, String user) {
        long now = clock.get();
        List<String> done = new ArrayList<>();
        for (String seat : seats) {
            Hold after = holds.computeIfPresent(key(show, seat), (k, cur) ->
                    cur.user().equals(user) && !cur.booked() && cur.expiresAt() > now
                            ? new Hold(user, Long.MAX_VALUE, true) : cur);
            if (after == null || !after.booked() || !after.user().equals(user)) {
                for (String d : done)                      // undo partial confirmation -> refund path
                    holds.computeIfPresent(key(show, d), (k, cur) -> new Hold(user, now, false));
                return false;
            }
            done.add(seat);
        }
        return true;
    }

    void release(String show, List<String> seats, String user) {
        for (String seat : seats)
            holds.computeIfPresent(key(show, seat), (k, cur) -> cur.user().equals(user) && !cur.booked() ? null : cur);
    }

    boolean isAvailable(String show, String seat) { return isFree(holds.get(key(show, seat)), clock.get()); }
}

class BookMyShowDemo {
    public static void main(String[] args) throws Exception {
        AtomicLong clock = new AtomicLong(0);
        SeatLockService svc = new SeatLockService(10 * 60_000, clock);

        // 1) Race: 8 users click the same two seats at the same instant.
        int users = 8;
        ExecutorService pool = Executors.newFixedThreadPool(users);
        CountDownLatch start = new CountDownLatch(1);
        AtomicInteger winners = new AtomicInteger();
        List<Future<?>> futures = new ArrayList<>();
        for (int i = 0; i < users; i++) {
            String u = "user" + i;
            futures.add(pool.submit(() -> {
                start.await();
                if (svc.lock("show42", List.of("A1", "A2"), u)) winners.incrementAndGet();
                return null;
            }));
        }
        start.countDown();
        for (Future<?> f : futures) f.get();
        pool.shutdown();
        System.out.println("winners = " + winners.get());

        // 2) Expiry: the winner never pays; after 10 minutes the seats are free again.
        System.out.println("A1 available now? " + svc.isAvailable("show42", "A1"));
        clock.addAndGet(10 * 60_000);
        System.out.println("A1 available after 10 min? " + svc.isAvailable("show42", "A1"));
        System.out.println("late user locks: " + svc.lock("show42", List.of("A2", "A1"), "late"));
        System.out.println("late user confirms: " + svc.confirm("show42", List.of("A1", "A2"), "late"));

        // 3) Confirming after your own hold expired fails.
        svc.lock("show42", List.of("B5"), "slow");
        clock.addAndGet(11 * 60_000);
        System.out.println("slow user confirms after 11 min: " + svc.confirm("show42", List.of("B5"), "slow"));
    }
}`, lang: "java", title: "SeatLockService.java — atomic multi-seat hold with expiry" },
        { code: `winners = 1
A1 available now? false
A1 available after 10 min? true
late user locks: true
late user confirms: true
slow user confirms after 11 min: false`, lang: "text", title: "Output (winners is always exactly 1)" },
        { tip: "Explain <i>why</i> exactly one wins: seats are sorted, so every thread first competes for A1; <code>compute</code> on key A1 runs one lambda at a time, so only the first sees it free. Everyone else fails on A1 before touching A2, so there's nothing to roll back." }
      ] }
    ],
    practice: [
      { q: "X and Y both want seats {A1, A2}, but X acquires in the order A1, A2 and Y in the order A2, A1. What happens (a) with blocking per-seat locks, (b) with the non-blocking all-or-nothing CAS service? How does sorting fix it?", a: "(a) X holds A1 and waits for A2; Y holds A2 and waits for A1 → a cycle → <b>deadlock</b>, both hang (the DB would detect it and abort one transaction). (b) The CAS service never waits: X takes A1, Y takes A2, each then fails on the other seat and rolls back → <b>both fail</b> although one of them could have succeeded. Sorting gives every thread the same acquisition order (A1 first), so whoever wins A1 goes on to win A2 and the other fails immediately — no cycle, exactly one winner." },
      { q: "A user's payment succeeds at minute 11 but the hold expired at minute 10 and another user has already locked the seat. What should the system do?", a: "<code>confirm</code> fails because the hold is no longer this user's (or is expired). Mark the booking FAILED and trigger an automatic <b>refund</b> through the payment service, and notify the user. Never overwrite the new holder. To reduce this, the payment page shows a countdown and the payment session's expiry is set slightly shorter than the seat hold." },
      { q: "Optimistic or pessimistic for (a) the first 5 minutes of a superstar movie's advance booking, (b) a Tuesday matinee? Justify.", a: "(a) Very high contention on the same rows: optimistic would produce huge numbers of failed conditional updates and retries; <b>pessimistic</b> (short <code>FOR UPDATE</code> transactions, or a queue/virtual waiting room in front) gives orderly progress. (b) Low contention: <b>optimistic</b> — a single conditional UPDATE, no lock waits, almost always succeeds." },
      { q: "Write the one SQL statement that holds seat C7 of show 9 for user 3 only if it is free or its hold has expired. How does the application know if it worked?", a: "<code>UPDATE show_seat SET status='LOCKED', locked_by=3, lock_expiry=CURRENT_TIMESTAMP + INTERVAL '10' MINUTE WHERE show_id=9 AND seat_no='C7' AND (status='AVAILABLE' OR (status='LOCKED' AND lock_expiry &lt; CURRENT_TIMESTAMP));</code> — the driver returns the <b>rows-affected</b> count (<code>executeUpdate()</code> in JDBC). 1 = held, 0 = someone else has it." },
      { q: "Why is a background job that releases expired locks every minute not enough on its own?", a: "Between expiry and the next sweep (up to a minute) the seat is shown as taken and can't be booked, losing sales; and if the job crashes, seats stay locked forever. Checking <code>lock_expiry &lt; now</code> inside the atomic hold operation makes expiry exact and self-healing; the sweeper is only housekeeping." }
    ],
    related: ["dbms:optimistic-vs-pessimistic", "dbms:locking-shared-exclusive", "dbms:isolation-levels", "dbms:deadlock-dbms", "dbms:concurrency-problems", "os:race-condition", "os:deadlock-conditions", "os:test-and-set-cas", "sd:idempotency"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-atm",
    subject: "lld",
    title: "Design an ATM — State pattern and cash dispensing",
    minutes: 50,
    crux: [
      "The ATM is a <b>state machine</b>: IDLE → CARD_INSERTED → AUTHENTICATED → (transaction) → back to IDLE on eject; OUT_OF_SERVICE when cash or hardware fails.",
      "State pattern: an <code>AtmState</code> interface with every user action (<code>insertCard</code>, <code>enterPin</code>, <code>withdraw</code>, <code>ejectCard</code>); each state implements only the actions valid in it, the rest reject.",
      "Collaborators: <code>BankService</code> (verify PIN, balance, debit — an interface, the ATM never holds account data), <code>CashDispenser</code>, <code>CardReader</code>, <code>Screen</code>.",
      "Cash dispensing = <b>Chain of Responsibility</b> of note dispensers (₹2000 → ₹500 → ₹100), each taking as many notes as it can and passing the rest on. Check feasibility <i>before</i> debiting.",
      "Order of operations for withdraw: validate amount → check ATM can dispense → debit account → dispense. If dispensing fails after debit → reverse the debit."
    ],
    sections: [
      { h: "Requirements, classes, state diagram", blocks: [
        { ol: [
          "Insert card, enter PIN (3 wrong attempts → card retained).",
          "Operations: balance enquiry, cash withdrawal, (deposit, PIN change — optional).",
          "Dispense cash in available denominations; amount must be a multiple of ₹100 and within daily limit.",
          "Eject card at the end or on cancel at any point.",
          "Go OUT_OF_SERVICE when cash runs out or hardware fails."
        ] },
        { svg: `<svg viewBox="0 0 700 200" width="700" class="dg">
  <rect class="box-g" x="20" y="80" width="110" height="40" rx="20"/>
  <text class="tx tx-b" x="75" y="100" text-anchor="middle" dominant-baseline="middle">IDLE</text>
  <rect class="box-a" x="220" y="80" width="150" height="40" rx="20"/>
  <text class="tx tx-b" x="295" y="100" text-anchor="middle" dominant-baseline="middle">CARD_INSERTED</text>
  <rect class="box-a" x="470" y="80" width="160" height="40" rx="20"/>
  <text class="tx tx-b" x="550" y="100" text-anchor="middle" dominant-baseline="middle">AUTHENTICATED</text>
  <rect class="box-r" x="220" y="150" width="150" height="36" rx="18"/>
  <text class="tx tx-b" x="295" y="168" text-anchor="middle" dominant-baseline="middle">OUT_OF_SERVICE</text>
  <line class="ln" x1="130" y1="100" x2="218" y2="100" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="136" y="92">insertCard</text>
  <line class="ln" x1="370" y1="100" x2="468" y2="100" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="378" y="92">correct PIN</text>
  <path class="ln" d="M 580 80 C 600 40, 520 40, 540 78" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="610" y="50">withdraw / balance</text>
  <path class="ln" d="M 280 80 C 260 40, 330 40, 312 78" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="200" y="40">wrong PIN (&lt;3)</text>
  <path class="ln ln-d" d="M 550 120 C 520 190, 110 200, 75 122" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="420" y="186">ejectCard</text>
  <path class="ln ln-d" d="M 250 80 C 200 30, 120 40, 90 78" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="100" y="40">eject / 3rd wrong PIN</text>
</svg>`, caption: "ATM states. Any state can move to OUT_OF_SERVICE on a hardware/cash failure; OUT_OF_SERVICE returns to IDLE after maintenance." },
        { table: { head: ["State", "insertCard", "enterPin", "withdraw", "ejectCard"], rows: [
          ["IDLE", "→ CARD_INSERTED", "reject", "reject", "reject"],
          ["CARD_INSERTED", "reject", "ok → AUTHENTICATED; wrong → retry; 3rd wrong → retain card → IDLE", "reject", "→ IDLE"],
          ["AUTHENTICATED", "reject", "reject", "dispense, stay", "→ IDLE"],
          ["OUT_OF_SERVICE", "reject", "reject", "reject", "reject"]
        ] } },
        { tip: "Draw this table before coding — each row becomes one state class, each cell one method. Without the State pattern you'd write this table as a <code>switch(state)</code> inside every one of the four methods." }
      ] },
      { h: "Cash dispensing with Chain of Responsibility", blocks: [
        { p: "Each dispenser handles one denomination: take <code>min(amount / note, notesAvailable)</code> notes, pass the remainder to the next handler. If the last handler still has a remainder, the amount can't be dispensed." },
        { p: "Worked: ATM holds 2 × ₹2000, 5 × ₹500, 10 × ₹100. Withdraw <b>₹3700</b>: ₹2000 handler takes 1 (3700/2000 = 1) → 1700 left; ₹500 takes 3 → 200 left; ₹100 takes 2 → 0. Dispense 1×2000 + 3×500 + 2×100. Withdraw <b>₹5000</b> now: 2000 handler has 1 note left → takes 1 → 3000; 500 has 2 left → takes 2 → 2000; 100 has 8 left → takes 8 → 1200 remains → <b>cannot dispense</b>, even though the ATM holds ₹3800 — and it's more than it holds anyway." },
        { warn: "Always call <code>canDispense(amount)</code> first (a dry run that changes nothing), then debit the bank account, then actually dispense. Debiting first and discovering you can't dispense means reversing a bank transaction for no reason." }
      ] },
      { h: "Code (compiles and runs)", blocks: [
        { code: `import java.util.*;

interface BankService {
    boolean verifyPin(String card, int pin);
    long balance(String card);
    boolean debit(String card, long amount);
}

class InMemoryBank implements BankService {
    private final Map<String, Integer> pins = new HashMap<>();
    private final Map<String, Long> balances = new HashMap<>();
    void open(String card, int pin, long balance) { pins.put(card, pin); balances.put(card, balance); }
    public boolean verifyPin(String card, int pin) { return pins.getOrDefault(card, -1) == pin; }
    public long balance(String card) { return balances.getOrDefault(card, 0L); }
    public synchronized boolean debit(String card, long amt) {
        long b = balance(card);
        if (b < amt) return false;
        balances.put(card, b - amt);
        return true;
    }
}

class NoteDispenser {                                  // one link in the chain
    private final int note;
    private int count;
    private NoteDispenser next;
    NoteDispenser(int note, int count) { this.note = note; this.count = count; }
    NoteDispenser then(NoteDispenser next) { this.next = next; return next; }

    boolean canDispense(long amount) {                 // dry run, no side effects
        long use = Math.min(amount / note, count);
        long rest = amount - use * note;
        return rest == 0 || (next != null && next.canDispense(rest));
    }
    void dispense(long amount, List<String> out) {
        long use = Math.min(amount / note, count);
        if (use > 0) { count -= use; out.add(use + " x " + note); }
        long rest = amount - use * note;
        if (rest > 0) next.dispense(rest, out);
    }
}

interface AtmState {
    default void insertCard(ATM atm, String card) { atm.show("insertCard not allowed in " + name()); }
    default void enterPin(ATM atm, int pin)       { atm.show("enterPin not allowed in " + name()); }
    default void withdraw(ATM atm, long amount)   { atm.show("withdraw not allowed in " + name()); }
    default void ejectCard(ATM atm)               { atm.show("ejectCard not allowed in " + name()); }
    String name();
}

class IdleState implements AtmState {
    public void insertCard(ATM atm, String card) {
        atm.setCard(card);
        atm.show("card inserted, enter PIN");
        atm.setState(new CardInsertedState());
    }
    public String name() { return "IDLE"; }
}

class CardInsertedState implements AtmState {
    private int wrongAttempts;
    public void enterPin(ATM atm, int pin) {
        if (atm.bank().verifyPin(atm.card(), pin)) {
            atm.show("PIN ok");
            atm.setState(new AuthenticatedState());
        } else if (++wrongAttempts == 3) {
            atm.show("3 wrong PINs, card retained");
            atm.setCard(null);
            atm.setState(new IdleState());
        } else {
            atm.show("wrong PIN (" + wrongAttempts + "/3)");
        }
    }
    public void ejectCard(ATM atm) { atm.show("card ejected"); atm.setCard(null); atm.setState(new IdleState()); }
    public String name() { return "CARD_INSERTED"; }
}

class AuthenticatedState implements AtmState {
    public void withdraw(ATM atm, long amount) {
        if (amount <= 0 || amount % 100 != 0) { atm.show("amount must be a positive multiple of 100"); return; }
        if (!atm.cash().canDispense(amount)) { atm.show("ATM cannot dispense " + amount); return; }
        if (!atm.bank().debit(atm.card(), amount)) { atm.show("insufficient balance"); return; }
        List<String> notes = new ArrayList<>();
        atm.cash().dispense(amount, notes);
        atm.show("dispensed " + notes + ", balance " + atm.bank().balance(atm.card()));
    }
    public void ejectCard(ATM atm) { atm.show("card ejected"); atm.setCard(null); atm.setState(new IdleState()); }
    public String name() { return "AUTHENTICATED"; }
}

class ATM {                                            // the context
    private AtmState state = new IdleState();
    private String card;
    private final BankService bank;
    private final NoteDispenser cash;
    ATM(BankService bank, NoteDispenser cash) { this.bank = bank; this.cash = cash; }

    void insertCard(String c) { state.insertCard(this, c); }
    void enterPin(int pin)    { state.enterPin(this, pin); }
    void withdraw(long amt)   { state.withdraw(this, amt); }
    void ejectCard()          { state.ejectCard(this); }

    void setState(AtmState s) { state = s; }
    void setCard(String c) { card = c; }
    String card() { return card; }
    BankService bank() { return bank; }
    NoteDispenser cash() { return cash; }
    void show(String msg) { System.out.println("[" + state.name() + "] " + msg); }
}

class AtmDemo {
    public static void main(String[] args) {
        InMemoryBank bank = new InMemoryBank();
        bank.open("4111", 1234, 10000);
        NoteDispenser chain = new NoteDispenser(2000, 2);
        chain.then(new NoteDispenser(500, 5)).then(new NoteDispenser(100, 10));

        ATM atm = new ATM(bank, chain);
        atm.withdraw(500);
        atm.insertCard("4111");
        atm.enterPin(1111);
        atm.enterPin(1234);
        atm.withdraw(3700);
        atm.withdraw(5000);
        atm.withdraw(250);
        atm.ejectCard();
    }
}`, lang: "java", title: "ATM.java — State pattern + dispenser chain" },
        { code: `[IDLE] withdraw not allowed in IDLE
[IDLE] card inserted, enter PIN
[CARD_INSERTED] wrong PIN (1/3)
[CARD_INSERTED] PIN ok
[AUTHENTICATED] dispensed [1 x 2000, 3 x 500, 2 x 100], balance 6300
[AUTHENTICATED] ATM cannot dispense 5000
[AUTHENTICATED] amount must be a positive multiple of 100
[AUTHENTICATED] card ejected`, lang: "text", title: "Output" },
        { p: "Note the log prefix shows the state <i>at the moment the message is printed</i>: \"card inserted\" prints before the switch to CARD_INSERTED, \"PIN ok\" before the switch to AUTHENTICATED." }
      ] },
      { h: "Follow-ups", blocks: [
        { ul: [
          "<b>Concurrency</b>: one ATM serves one user, but the <i>account</i> can be hit from two ATMs + UPI at once → the bank's <code>debit</code> must be atomic (DB transaction / <code>UPDATE account SET bal = bal - ? WHERE id = ? AND bal &gt;= ?</code>).",
          "<b>Failure after debit</b> (notes jam): record the transaction as PENDING, and auto-reverse if the dispenser reports failure — idempotent reversal keyed by transaction id.",
          "<b>Greedy dispensing</b> is always correct for 2000/500/100 because each note is a multiple of the next smaller one. With 500 and 200 notes (no 100s), greedy fails for 600 (takes 500, can't make 100) although 3×200 works — you'd need a DP/backtracking.",
          "<b>New operation</b> (mini statement, PIN change) = a new method on <code>AtmState</code> with a default reject, implemented only in AUTHENTICATED."
        ] }
      ] }
    ],
    practice: [
      { q: "The ATM holds 1×₹2000, 4×₹500, 10×₹100. Can it dispense ₹2800? ₹4200? Trace the chain.", a: "₹2800: 2000 takes 1 → 800; 500 takes 1 → 300; 100 takes 3 → 0 ✓ (1×2000, 1×500, 3×100). ₹4200: 2000 takes 1 → 2200; 500 takes min(4, 4) = 4 → 200; 100 takes 2 → 0 ✓ (1×2000, 4×500, 2×100). Both succeed." },
      { q: "Why does the code check <code>canDispense</code> before <code>debit</code>, and <code>debit</code> before <code>dispense</code>?", a: "<code>canDispense</code> is a side-effect-free check, so doing it first avoids debiting an account for cash the ATM can't produce (which would need a reversal). Debit before dispense because giving out cash is irreversible — if the debit fails (insufficient balance, concurrent withdrawal elsewhere), no notes must have left the machine." },
      { q: "In <code>CardInsertedState</code>, <code>wrongAttempts</code> is a field of the state object. What would go wrong if states were shared singletons?", a: "The counter would be shared across all customers (and all ATMs if static) — one customer's wrong attempts would count against the next customer. With a fresh <code>CardInsertedState</code> created on each card insertion, the counter is per session. If you want singleton (stateless) states, move the counter into the ATM context/session object instead." },
      { q: "Write the transition for a hardware fault: which class changes and how?", a: "Add <code>OutOfServiceState</code> whose methods all reject (the interface defaults already do). Add a method <code>atm.fault()</code> that ejects any card if possible and calls <code>setState(new OutOfServiceState())</code>; <code>atm.repaired()</code> sets IDLE. No existing state class changes — that's the OCP benefit of the State pattern." }
    ],
    related: ["oops:solid-principles", "oops:interface-default-methods", "oops:encapsulation-vs-abstraction", "dbms:acid-properties", "sd:idempotency"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-speedrun",
    subject: "lld",
    title: "30-minute speed-runs: Snake & Ladder, Vending Machine, Logging Framework",
    minutes: 100,
    crux: [
      "Speed-run format (30 min each): <b>5</b> requirements → <b>10</b> class diagram → <b>10</b> key interfaces/core method → <b>5</b> patterns + extensions. Stop at interfaces; don't write getters.",
      "<b>Snake & Ladder</b>: snakes and ladders are the same thing — a <code>Map&lt;Integer, Integer&gt;</code> of jumps. <code>Dice</code> is an interface (random, crooked, multi-dice), players take turns from a queue.",
      "<b>Vending Machine</b>: State pattern — IDLE → HAS_MONEY → DISPENSING → IDLE (+ SOLD_OUT). Money in, product out, change returned; cancel refunds.",
      "<b>Logging framework</b>: Singleton <code>Logger</code> + <b>Chain of Responsibility</b> of handlers (console ≥ DEBUG, file ≥ INFO, alert ≥ ERROR), each handles if the level meets its threshold and passes it on. Formatter = Strategy.",
      "What gets marks in a speed-run: correct entities, one clean interface per variation point, the pattern named with a reason, and one concurrency remark."
    ],
    sections: [
      { h: "Snake & Ladder", blocks: [
        { p: "<b>Requirements (agree in 2 min):</b> board of N cells (100), k players, a 6-sided dice; land on a ladder's foot → climb, on a snake's head → slide; must land <i>exactly</i> on N to win (overshoot = stay); first to N wins. Extensions: multiple dice, extra turn on 6, crooked dice for testing." },
        { svg: `<svg viewBox="0 0 700 170" width="700" class="dg">
  <rect class="box-a" x="250" y="20" width="200" height="40" rx="4"/>
  <text class="tx tx-b" x="350" y="40" text-anchor="middle" dominant-baseline="middle">SnakeLadderGame</text>
  <rect class="box" x="20" y="110" width="170" height="40" rx="4"/>
  <text class="tx" x="105" y="124" text-anchor="middle" dominant-baseline="middle">Board</text>
  <text class="tx-s" x="105" y="140" text-anchor="middle" dominant-baseline="middle">size, jumps: Map</text>
  <rect class="box" x="265" y="110" width="170" height="40" rx="4"/>
  <text class="tx" x="350" y="124" text-anchor="middle" dominant-baseline="middle">Player</text>
  <text class="tx-s" x="350" y="140" text-anchor="middle" dominant-baseline="middle">name, position</text>
  <rect class="box" x="510" y="110" width="170" height="40" rx="4"/>
  <text class="tx-m" x="595" y="122" text-anchor="middle" dominant-baseline="middle">«interface»</text>
  <text class="tx" x="595" y="138" text-anchor="middle" dominant-baseline="middle">Dice</text>
  <polygon class="box-a" points="300,60 308,70 300,80 292,70"/>
  <line class="ln-a" x1="300" y1="80" x2="140" y2="110"/>
  <polygon class="box" points="350,60 358,70 350,80 342,70"/>
  <line class="ln" x1="350" y1="80" x2="350" y2="110"/>
  <text class="tx-s" x="358" y="100">2..*</text>
  <line class="ln" x1="400" y1="60" x2="560" y2="108" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="520" y="80">Random / Scripted</text>
</svg>`, caption: "Game composes the board, aggregates players (turn queue) and uses a Dice strategy." },
        { code: `import java.util.*;

interface Dice { int roll(); }

class RandomDice implements Dice {
    private final Random rnd = new Random();
    public int roll() { return 1 + rnd.nextInt(6); }
}
class ScriptedDice implements Dice {                  // deterministic, for tests and demos
    private final Iterator<Integer> it;
    ScriptedDice(Integer... rolls) { it = List.of(rolls).iterator(); }
    public int roll() { return it.next(); }
}

class Board {
    private final int size;
    private final Map<Integer, Integer> jumps = new HashMap<>();   // snakes AND ladders
    Board(int size) { this.size = size; }
    Board ladder(int from, int to) { if (to <= from) throw new IllegalArgumentException(); jumps.put(from, to); return this; }
    Board snake(int from, int to)  { if (to >= from) throw new IllegalArgumentException(); jumps.put(from, to); return this; }
    int size() { return size; }
    int landing(int cell) { return jumps.getOrDefault(cell, cell); }
}

class Player {
    final String name;
    int position;
    Player(String name) { this.name = name; }
}

class SnakeLadderGame {
    private final Board board;
    private final Dice dice;
    private final Deque<Player> turns = new ArrayDeque<>();
    SnakeLadderGame(Board board, Dice dice, String... names) {
        this.board = board; this.dice = dice;
        for (String n : names) turns.add(new Player(n));
    }
    String play() {
        while (true) {
            Player p = turns.poll();
            int roll = dice.roll();
            int target = p.position + roll;
            if (target > board.size()) {
                System.out.println(p.name + " rolls " + roll + ": overshoot, stays at " + p.position);
            } else {
                int end = board.landing(target);
                System.out.println(p.name + " rolls " + roll + ": " + p.position + " -> " + target
                        + (end != target ? " -> " + end + (end > target ? " (ladder)" : " (snake)") : ""));
                p.position = end;
                if (end == board.size()) return p.name;
            }
            turns.add(p);
        }
    }
}

class SnakeLadderDemo {
    public static void main(String[] args) {
        Board board = new Board(30).ladder(3, 22).ladder(11, 26).snake(27, 1).snake(19, 7);
        Dice dice = new ScriptedDice(3, 5, 5, 6, 2, 6, 6, 4);
        System.out.println("winner: " + new SnakeLadderGame(board, dice, "Asha", "Ravi").play());
    }
}`, lang: "java", title: "SnakeLadder.java" },
        { code: `Asha rolls 3: 0 -> 3 -> 22 (ladder)
Ravi rolls 5: 0 -> 5
Asha rolls 5: 22 -> 27 -> 1 (snake)
Ravi rolls 6: 5 -> 11 -> 26 (ladder)
Asha rolls 2: 1 -> 3 -> 22 (ladder)
Ravi rolls 6: overshoot, stays at 26
Asha rolls 6: 22 -> 28
Ravi rolls 4: 26 -> 30
winner: Ravi`, lang: "text", title: "Output" },
        { tip: "Point out the <code>ScriptedDice</code>: injecting the dice (DIP) is what makes a random game unit-testable. Interviewers like hearing \"how would you test this?\" answered before they ask." }
      ] },
      { h: "Vending Machine", blocks: [
        { p: "<b>Requirements:</b> products in slots with price and count; accept coins/notes; select a product; dispense if paid enough and in stock; return change; cancel refunds everything; admin restocks. <b>Core insight:</b> the same button (select, insert coin) means different things depending on the state → State pattern." },
        { svg: `<svg viewBox="0 0 700 150" width="700" class="dg">
  <rect class="box-g" x="20" y="55" width="120" height="40" rx="20"/>
  <text class="tx tx-b" x="80" y="75" text-anchor="middle" dominant-baseline="middle">IDLE</text>
  <rect class="box-a" x="270" y="55" width="150" height="40" rx="20"/>
  <text class="tx tx-b" x="345" y="75" text-anchor="middle" dominant-baseline="middle">HAS_MONEY</text>
  <rect class="box-w" x="540" y="55" width="140" height="40" rx="20"/>
  <text class="tx tx-b" x="610" y="75" text-anchor="middle" dominant-baseline="middle">DISPENSING</text>
  <line class="ln" x1="140" y1="68" x2="268" y2="68" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="160" y="60">insertCoin</text>
  <line class="ln" x1="420" y1="68" x2="538" y2="68" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="428" y="60">select (paid enough)</text>
  <path class="ln" d="M 330 55 C 310 15, 380 15, 362 53" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="390" y="24">more coins / low balance</text>
  <line class="ln ln-d" x1="268" y1="84" x2="142" y2="84" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="160" y="100">cancel → refund</text>
  <path class="ln ln-d" d="M 610 95 C 580 145, 120 145, 80 97" marker-end="url(#dg-arr)"/>
  <text class="tx-s" x="300" y="140">product + change returned</text>
</svg>`, caption: "Vending machine states. SOLD_OUT (all slots empty) can be added as a fourth state that rejects coins." },
        { code: `import java.util.*;

enum Coin { ONE(1), TWO(2), FIVE(5), TEN(10), TWENTY(20);
    final int value; Coin(int v) { value = v; } }

record Product(String code, String name, int price) {}

class Inventory {
    private final Map<String, Product> products = new HashMap<>();
    private final Map<String, Integer> stock = new HashMap<>();
    void add(Product p, int qty) { products.put(p.code(), p); stock.merge(p.code(), qty, Integer::sum); }
    Product get(String code) { return products.get(code); }
    boolean inStock(String code) { return stock.getOrDefault(code, 0) > 0; }
    void take(String code) { stock.merge(code, -1, Integer::sum); }
}

interface VendingState {
    default void insertCoin(VendingMachine m, Coin c) { m.say("cannot insert coin now"); }
    default void select(VendingMachine m, String code) { m.say("insert money first"); }
    default void cancel(VendingMachine m)             { m.say("nothing to cancel"); }
}

class IdleState implements VendingState {
    public void insertCoin(VendingMachine m, Coin c) { m.addBalance(c.value); m.setState(new HasMoneyState()); }
}

class HasMoneyState implements VendingState {
    public void insertCoin(VendingMachine m, Coin c) { m.addBalance(c.value); }
    public void select(VendingMachine m, String code) {
        Product p = m.inventory().get(code);
        if (p == null || !m.inventory().inStock(code)) { m.say("sold out / unknown: " + code); return; }
        if (m.balance() < p.price()) { m.say("insert " + (p.price() - m.balance()) + " more for " + p.name()); return; }
        m.setState(new DispensingState());
        m.dispense(p);                                       // DispensingState is transient
    }
    public void cancel(VendingMachine m) { m.say("refund " + m.balance()); m.resetBalance(); m.setState(new IdleState()); }
}

class DispensingState implements VendingState {
    public void insertCoin(VendingMachine m, Coin c) { m.say("busy dispensing, coin returned"); }
    public void select(VendingMachine m, String code) { m.say("busy dispensing"); }
}

class VendingMachine {
    private VendingState state = new IdleState();
    private final Inventory inventory = new Inventory();
    private int balance;

    void insertCoin(Coin c) { state.insertCoin(this, c); }
    void select(String code) { state.select(this, code); }
    void cancel() { state.cancel(this); }

    void dispense(Product p) {
        inventory.take(p.code());
        int change = balance - p.price();
        say("dispensed " + p.name() + (change > 0 ? ", change " + change : ""));
        balance = 0;
        state = new IdleState();
    }
    Inventory inventory() { return inventory; }
    int balance() { return balance; }
    void addBalance(int v) { balance += v; }
    void resetBalance() { balance = 0; }
    void setState(VendingState s) { state = s; }
    void say(String msg) { System.out.println(msg); }
}

class VendingDemo {
    public static void main(String[] args) {
        VendingMachine vm = new VendingMachine();
        vm.inventory().add(new Product("A1", "Chips", 15), 2);
        vm.inventory().add(new Product("B2", "Juice", 25), 0);
        vm.select("A1");
        vm.insertCoin(Coin.TEN);
        vm.select("A1");
        vm.insertCoin(Coin.TEN);
        vm.select("A1");
        vm.insertCoin(Coin.TWENTY);
        vm.select("B2");
        vm.cancel();
    }
}`, lang: "java", title: "VendingMachine.java" },
        { code: `insert money first
insert 5 more for Chips
dispensed Chips, change 5
sold out / unknown: B2
refund 20`, lang: "text", title: "Output" },
        { ul: [
          "<b>Change-making</b> with limited coins in the machine is the coin-change problem: greedy works for canonical coin systems like 1/2/5/10/20; otherwise use DP. Also check change is possible <i>before</i> dispensing.",
          "<b>Concurrency</b>: a physical machine has one user at a time — make the public methods <code>synchronized</code> anyway, since coin sensor and keypad events arrive on different threads."
        ] }
      ] },
      { h: "Logging Framework", blocks: [
        { p: "<b>Requirements:</b> log levels DEBUG &lt; INFO &lt; WARN &lt; ERROR; a global minimum level; multiple destinations (console, file, alerting) each with its own threshold; pluggable message format; thread-safe; cheap when a level is disabled." },
        { svg: `<svg viewBox="0 0 700 150" width="700" class="dg">
  <rect class="box-a" x="20" y="50" width="130" height="44" rx="4"/>
  <text class="tx-m" x="85" y="62" text-anchor="middle" dominant-baseline="middle">«singleton»</text>
  <text class="tx tx-b" x="85" y="80" text-anchor="middle" dominant-baseline="middle">Logger</text>
  <line class="ln" x1="150" y1="72" x2="198" y2="72" marker-end="url(#dg-arr)"/>
  <rect class="box" x="200" y="52" width="140" height="40" rx="4"/>
  <text class="tx" x="270" y="66" text-anchor="middle" dominant-baseline="middle">ConsoleHandler</text>
  <text class="tx-s" x="270" y="82" text-anchor="middle" dominant-baseline="middle">≥ DEBUG</text>
  <line class="ln" x1="340" y1="72" x2="378" y2="72" marker-end="url(#dg-arr)"/>
  <rect class="box" x="380" y="52" width="140" height="40" rx="4"/>
  <text class="tx" x="450" y="66" text-anchor="middle" dominant-baseline="middle">FileHandler</text>
  <text class="tx-s" x="450" y="82" text-anchor="middle" dominant-baseline="middle">≥ INFO</text>
  <line class="ln" x1="520" y1="72" x2="558" y2="72" marker-end="url(#dg-arr)"/>
  <rect class="box-r" x="560" y="52" width="130" height="40" rx="4"/>
  <text class="tx" x="625" y="66" text-anchor="middle" dominant-baseline="middle">AlertHandler</text>
  <text class="tx-s" x="625" y="82" text-anchor="middle" dominant-baseline="middle">≥ ERROR</text>
  <text class="tx-m" x="350" y="120" text-anchor="middle">each handler: write if level ≥ threshold, then pass to next</text>
  <text class="tx-m" x="350" y="30" text-anchor="middle">Formatter (Strategy) shared by handlers</text>
</svg>`, caption: "Chain of Responsibility: every record walks the whole chain; each handler decides independently. (Classic variant: a handler that handles a request stops the chain.)" },
        { code: `import java.util.*;

enum LogLevel { DEBUG, INFO, WARN, ERROR }

interface Formatter { String format(LogLevel level, String msg); }

abstract class LogHandler {                           // Chain of Responsibility node
    private final LogLevel threshold;
    private LogHandler next;
    protected Formatter formatter = (l, m) -> "[" + l + "] " + m;
    LogHandler(LogLevel threshold) { this.threshold = threshold; }
    LogHandler setNext(LogHandler next) { this.next = next; return next; }

    final void handle(LogLevel level, String msg) {
        if (level.compareTo(threshold) >= 0) write(formatter.format(level, msg));
        if (next != null) next.handle(level, msg);     // always pass along
    }
    protected abstract void write(String line);
}

class ConsoleHandler extends LogHandler {
    ConsoleHandler(LogLevel t) { super(t); }
    protected void write(String line) { System.out.println("console " + line); }
}
class FileHandler extends LogHandler {               // real one: BufferedWriter to app.log
    final List<String> lines = new ArrayList<>();
    FileHandler(LogLevel t) { super(t); }
    protected void write(String line) { lines.add(line); System.out.println("file    " + line); }
}
class AlertHandler extends LogHandler {
    AlertHandler(LogLevel t) { super(t); }
    protected void write(String line) { System.out.println("PAGE ON-CALL " + line); }
}

final class Logger {                                  // Singleton (holder idiom)
    private volatile LogLevel minLevel = LogLevel.DEBUG;
    private volatile LogHandler chain;
    private Logger() { }
    private static class Holder { static final Logger INSTANCE = new Logger(); }
    static Logger get() { return Holder.INSTANCE; }

    void configure(LogLevel min, LogHandler head) { this.minLevel = min; this.chain = head; }
    synchronized void log(LogLevel level, String msg) {   // one record at a time: lines never interleave
        if (level.compareTo(minLevel) < 0 || chain == null) return;   // cheap early exit
        chain.handle(level, msg);
    }
    void debug(String m) { log(LogLevel.DEBUG, m); }
    void info(String m)  { log(LogLevel.INFO, m); }
    void warn(String m)  { log(LogLevel.WARN, m); }
    void error(String m) { log(LogLevel.ERROR, m); }
}

class LoggerDemo {
    public static void main(String[] args) {
        LogHandler head = new ConsoleHandler(LogLevel.DEBUG);
        head.setNext(new FileHandler(LogLevel.INFO)).setNext(new AlertHandler(LogLevel.ERROR));
        Logger log = Logger.get();
        log.configure(LogLevel.INFO, head);

        log.debug("cache miss for user 42");       // below global minimum: dropped
        log.info("server started on :8080");
        log.error("payment DB unreachable");
        System.out.println("same logger everywhere: " + (Logger.get() == log));
    }
}`, lang: "java", title: "Logger.java — Singleton + Chain of Responsibility + Strategy formatter" },
        { code: `console [INFO] server started on :8080
file    [INFO] server started on :8080
console [ERROR] payment DB unreachable
file    [ERROR] payment DB unreachable
PAGE ON-CALL [ERROR] payment DB unreachable
same logger everywhere: true`, lang: "text", title: "Output" },
        { ul: [
          "<b>Thread-safety</b>: <code>log()</code> is synchronized so lines don't interleave. At high volume, make it <b>asynchronous</b>: callers put records on a <code>BlockingQueue</code>, one background thread drains it to the handlers (what Log4j2's async logger does).",
          "<b>Cheap when disabled</b>: check the level before building the message; APIs accept <code>Supplier&lt;String&gt;</code> or <code>{}</code> placeholders so string concatenation doesn't run for DEBUG in production.",
          "<b>Extensibility</b>: new destination (Kafka, Slack) = new <code>LogHandler</code> subclass; JSON output = new <code>Formatter</code> — neither touches <code>Logger</code>."
        ] }
      ] },
      { h: "Speed-run checklist", blocks: [
        { table: { head: ["Design", "Must-have classes", "Pattern(s) to name", "Likely twist"], rows: [
          ["Snake & Ladder", "Game, Board (jumps map), Player, Dice", "Strategy (Dice), DIP for testability", "multiple dice, extra turn on 6, 3 sixes = lose turn"],
          ["Vending Machine", "VendingMachine, VendingState ×3–4, Inventory, Product, Coin", "State", "change-making with limited coins, card payment"],
          ["Logging Framework", "Logger, LogLevel, LogHandler chain, Formatter", "Singleton, Chain of Responsibility, Strategy", "async logging, per-package levels, log rotation"],
          ["Parking Lot", "Lot, Floor, Spot, Vehicle, Ticket, FeeStrategy", "Strategy, Factory", "gate race, EV spots"],
          ["Elevator", "System, Car, ElevatorState, DispatchStrategy", "State, Strategy", "scheduling algorithm, peak mode"],
          ["BookMyShow", "Show, ShowSeat, Booking, SeatLockService", "(concurrency is the pattern)", "two users, same seat; lock expiry"]
        ] } },
        { warn: "In a 30-minute slot, the fatal error is spending 20 minutes on one class's code. Time-box: at 20 minutes you must be naming patterns and extensions, even if some methods are only signatures." }
      ] }
    ],
    practice: [
      { q: "In the Snake & Ladder demo, add a rule \"rolling a 6 gives an extra turn\". Which method changes and how?", a: "Only <code>SnakeLadderGame.play()</code>: after moving (and not winning), put the player back at the <b>front</b> of the deque if <code>roll == 6</code> (<code>turns.addFirst(p)</code>) instead of the back (<code>turns.add(p)</code>). To cap it at three sixes, keep a per-turn counter and on the third 6 revert the move and pass the turn. Board, Dice and Player are untouched." },
      { q: "Vending machine: a user inserts ₹20 and selects a ₹15 item, but the machine has no ₹5 or smaller coins for change. What should happen and where does that check go?", a: "The machine must not dispense and keep the extra ₹5. In <code>HasMoneyState.select</code>, before switching to DISPENSING, call something like <code>coinBox.canMakeChange(balance − price)</code>; if false, say \"exact change only\" and stay in HAS_MONEY (the user can cancel for a refund or pick another item). The check comes before any inventory or state change." },
      { q: "Why is the logger's chain \"always pass along\" rather than the textbook \"stop when handled\"? When would you use the stop variant?", a: "For logging, one record should reach <i>every</i> interested destination (an ERROR goes to console, file and pager), so each handler decides independently and forwards. The <b>stop-when-handled</b> variant fits when exactly one handler should act: support-ticket escalation (L1 → L2 → manager), ATM note dispensing (each takes its share of the rest), approval chains by amount, servlet filters that can reject a request." },
      { q: "Name the three patterns in the logging framework and the one-line reason for each.", a: "<b>Singleton</b> — one shared, globally accessible logger configuration for the whole app. <b>Chain of Responsibility</b> — destinations can be added/removed/reordered without the Logger knowing them. <b>Strategy</b> — the output format (plain, JSON) is swappable per handler." },
      { q: "Draw from memory (in words) the vending machine state table for events insertCoin / select / cancel.", a: "IDLE: insertCoin → add balance, go HAS_MONEY; select → \"insert money first\"; cancel → nothing. HAS_MONEY: insertCoin → add balance; select → if unknown/sold out say so, if short say how much more, else go DISPENSING and dispense; cancel → refund, IDLE. DISPENSING: insertCoin → return coin; select → busy; after dispensing → product + change, IDLE. (SOLD_OUT: reject coins, admin restock → IDLE.)" }
    ],
    related: ["oops:singleton-pattern", "oops:strategy-pattern", "oops:enums-in-java", "oops:solid-principles", "os:producer-consumer"]
  });

  /* ------------------------------------------------------------------ */
  add({
    id: "lld-revision",
    subject: "lld",
    title: "OOP + LLD rapid revision: cheat sheet and 30-question self-graded quiz",
    minutes: 75,
    crux: [
      "SOLID in one line each: one reason to change · extend by adding classes · subtypes must be substitutable · small role interfaces · depend on injected abstractions.",
      "12 patterns: creational (Singleton, Factory Method, Abstract Factory, Builder, Prototype), structural (Adapter, Decorator, Facade), behavioural (Strategy, Observer, Command, State).",
      "Every LLD answer: requirements → entities → relationships → class diagram → flows → core code → patterns + concurrency + extensions.",
      "Re-draw from memory in 20 minutes each: Parking Lot (spot CAS), Elevator (State + LOOK), BookMyShow (ShowSeat + hold with expiry). Compare against the lessons and mark what you missed.",
      "Grading the quiz: 1 point per question answered correctly <i>before</i> opening the answer. 25+ = ready; below 20 = redo the pattern lessons."
    ],
    sections: [
      { h: "The 12 patterns on one page", blocks: [
        { table: { head: ["Pattern", "Type", "Intent in one line", "Where you'd use it in LLD"], rows: [
          ["Singleton", "Creational", "exactly one instance, global access", "Logger, config, ID generator"],
          ["Factory Method", "Creational", "subclass/decision point chooses the concrete class", "VehicleFactory, NotificationFactory"],
          ["Abstract Factory", "Creational", "create matching families of objects", "UI themes, payment-provider families"],
          ["Builder", "Creational", "step-by-step build of an immutable object with many options", "Order, HttpRequest, search filters"],
          ["Prototype", "Creational", "copy a configured object instead of building", "templates, game units"],
          ["Adapter", "Structural", "make an incompatible interface fit the expected one", "legacy/third-party payment or SMS SDK"],
          ["Decorator", "Structural", "wrap to add behaviour, same interface", "add-ons, pricing surcharges, I/O streams"],
          ["Facade", "Structural", "one simple entry over a subsystem", "OrderFacade, BookingService"],
          ["Strategy", "Behavioural", "swap algorithms behind an interface", "fee rules, split types, dispatch, dice"],
          ["Observer", "Behavioural", "notify subscribers on change", "display boards, notifications, price alerts"],
          ["Command", "Behavioural", "request as an object; undo/queue/log", "editor undo, remote buttons, job queues"],
          ["State", "Behavioural", "behaviour changes with internal state; states switch themselves", "ATM, vending machine, elevator, order"]
        ] } },
        { p: "Plus two that showed up in the designs: <b>Chain of Responsibility</b> (logging handlers, ATM note dispensers) and <b>Template Method</b> (the <code>Notifier.send</code> workflow calling an abstract step)." }
      ] },
      { h: "Re-draw drills (D51) and what the grader checks", blocks: [
        { table: { head: ["Design (20 min)", "Must appear on your drawing", "Must be said out loud"], rows: [
          ["Parking Lot", "Lot ◆ Floor ◆ Spot, Vehicle hierarchy, Ticket, FeeStrategy, PaymentProcessor", "CAS on spot for the gate race; ceil-hour fee example; EV extension"],
          ["Elevator", "System, Car, ElevatorState (Idle/Moving/DoorsOpen), DispatchStrategy, up/down stop sets", "LOOK vs SCAN vs SSTF; dispatcher cost; synchronized addStop/tick"],
          ["BookMyShow", "Show ◆ ShowSeat (status per show), Booking, SeatLockService", "hold with TTL; optimistic vs pessimistic; sorted acquisition; refund after expiry"]
        ] } },
        { tip: "Self-grade honestly: for each row, tick what you drew or said without looking. Anything unticked goes on tomorrow's revision list — the grader in a real interview is stricter than you." }
      ] }
    ],
    practice: [
      { q: "1. State SRP and give an LLD violation.", a: "A class should have one reason to change. Violation: <code>ParkingLot</code> that also computes fees and prints receipts — pricing changes and printer changes would both edit it." },
      { q: "2. What does OCP look like in code?", a: "New behaviour is a new class implementing an existing interface (<code>WeekendFee implements FeeStrategy</code>) instead of a new <code>else if</code> in existing code." },
      { q: "3. Give a Liskov violation.", a: "<code>Square extends Rectangle</code> where <code>setWidth</code> also changes height, or <code>ElectricCar.refuel()</code> throwing — code written for the parent breaks with the child." },
      { q: "4. ISP in one sentence and example.", a: "Clients shouldn't depend on methods they don't use: split a fat <code>Machine</code> (print/scan/fax) into <code>Printer</code>, <code>Scanner</code>, <code>Fax</code>." },
      { q: "5. DIP: what exactly is inverted?", a: "The dependency direction: high-level policy (<code>Checkout</code>) and low-level detail (<code>UpiClient</code>) both depend on an abstraction (<code>PaymentMode</code>) owned by the high level; the detail is injected." },
      { q: "6. Composition vs aggregation — the one-question test.", a: "\"If the whole is destroyed, does the part die with it (and is it owned exclusively)?\" Yes → composition (filled diamond). No → aggregation (hollow diamond)." },
      { q: "7. UML: dashed line with hollow triangle?", a: "Realisation — a class implements an interface." },
      { q: "8. Where does the diamond go?", a: "On the <b>whole</b> (container) end of the line." },
      { q: "9. Why must the DCL Singleton field be <code>volatile</code>?", a: "To prevent another thread from seeing a non-null reference to a partially constructed object due to reordering of the constructor writes and the publish." },
      { q: "10. Which Singleton is safe against reflection and serialization?", a: "The <code>enum</code> Singleton." },
      { q: "11. Factory Method vs Abstract Factory.", a: "Factory Method: one product, chosen by a (usually overridden) method. Abstract Factory: an object creating a whole family of related products that must match." },
      { q: "12. When is Builder better than constructors?", a: "Many optional parameters (telescoping constructors), need for readable named steps, validation before creation, and an immutable result." },
      { q: "13. Shallow vs deep copy in Prototype.", a: "Shallow copies share mutable fields (a list) between original and clone; deep copy duplicates them so changes don't leak. Prefer copy constructors over <code>clone()</code>." },
      { q: "14. Strategy vs State.", a: "Strategy is chosen by the client and strategies are independent; State objects switch the context's state themselves and know their successors." },
      { q: "15. Decorator vs Adapter.", a: "Decorator keeps the same interface and adds behaviour; Adapter changes an interface into a different one for compatibility." },
      { q: "16. Facade — does it prevent direct use of the subsystem?", a: "No. It offers a simpler entry point for common cases; advanced clients can still use subsystem classes." },
      { q: "17. What does Command enable that direct method calls don't?", a: "Undo/redo, queuing/scheduling, logging and replaying requests, macros — because the request is an object." },
      { q: "18. Two Observer pitfalls.", a: "Lapsed listeners (memory leaks) and modifying the listener list during notification (<code>ConcurrentModificationException</code>) — use <code>CopyOnWriteArrayList</code> or iterate a snapshot." },
      { q: "19. Parking lot: where is the race and the fix?", a: "Two gates claiming the same free spot; claim with <code>AtomicReference.compareAndSet(null, vehicle)</code> (or DB conditional update), no global lock." },
      { q: "20. Parking fee for a car, ₹20/h ceil, 09:10 → 11:20.", a: "130 min → (130+59)/60 = 3 h → ₹60." },
      { q: "21. Elevator: LOOK order from floor 5 going up with stops {8, 2, 9, 3, 6}.", a: "6, 8, 9, then 3, 2 — 11 floors." },
      { q: "22. Why is SSTF risky for elevators?", a: "Starvation: far floors may wait forever if nearby requests keep arriving." },
      { q: "23. BookMyShow: where does seat status live and why?", a: "On <code>ShowSeat</code> (show × seat), because the same physical seat has different availability per show." },
      { q: "24. Optimistic locking in one SQL statement.", a: "<code>UPDATE show_seat SET status='LOCKED', … WHERE show_id=? AND seat_no=? AND status='AVAILABLE'</code> and check rows affected (or <code>WHERE version = ?</code>)." },
      { q: "25. How do you avoid deadlock when locking several seats?", a: "Acquire locks in a fixed global order (sort seat ids)." },
      { q: "26. Splitwise: how many transactions does greedy simplification need at most for n people?", a: "n − 1 (each settlement zeroes at least one person)." },
      { q: "27. Tic-Tac-Toe O(1) win check — the data structure.", a: "Counters <code>rows[n]</code>, <code>cols[n]</code>, <code>diag</code>, <code>antiDiag</code>; X +1, O −1; win when |counter| == n." },
      { q: "28. ATM: why check dispensability before debiting?", a: "So you never debit money you can't physically hand out (avoiding a reversal); dispense only after a successful debit because cash out is irreversible." },
      { q: "29. Logging framework: three patterns.", a: "Singleton (logger), Chain of Responsibility (handlers), Strategy (formatter)." },
      { q: "30. What do you say in the last 5 minutes of any LLD round?", a: "Patterns used and why, the shared mutable state and how it's protected, and how two likely new requirements plug in as new classes." }
    ],
    related: ["oops:solid-principles", "oops:singleton-pattern", "oops:factory-pattern", "oops:builder-pattern", "oops:strategy-pattern", "oops:observer-pattern", "oops:decorator-pattern", "oops:adapter-pattern", "oops:association-aggregation-composition", "sd:design-parking-lot", "sd:design-lru-cache"]
  });

  /* ---- block mappings ---- */
  map("d33-ev", ["lld-framework", "lld-parking-lot"]);
  map("d34-ev", ["lld-creational"]);
  map("d36-ev", ["lld-patterns-2"]);
  map("d37-ev", ["lld-elevator"]);
  map("d38-ev", ["lld-splitwise", "lld-tictactoe"]);
  map("d39-ev", ["lld-bookmyshow", "lld-atm"]);
  map("d40-ev", ["lld-speedrun"]);
  map("d41-ev", ["lld-revision", "lld-framework", "lld-creational", "lld-patterns-2"]);
  map("d42-ev", ["lld-parking-lot", "lld-framework"]);
  map("d51-ev", ["lld-revision", "lld-framework", "lld-creational", "lld-patterns-2", "lld-parking-lot"]);
  map("d56-af", ["lld-framework"]);
})();
