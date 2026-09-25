/* core subject: Computer Architecture — interview Q&A */
(window.CORE = window.CORE || []).push({
  id: "coa",
  title: "Computer Architecture",
  short: "COA",
  icon: "▣",
  blurb: "Interviewers check that you can reason from bits up: number representation, gates and flip-flops, how a CPU fetches and executes, why pipelines stall, how caches map addresses, and how I/O and parallel hardware work. Expect short numericals (conversions, cache bits, AMAT, speedup).",
  topics: ["Number Systems & Logic", "CPU & Instructions", "Pipelining", "Memory Hierarchy & Cache", "I/O & Buses", "Parallelism"],
  questions: [

    /* ───────────── Number Systems & Logic ───────────── */
    {
      id: "number-system-conversions",
      q: "How do you convert between decimal, binary, octal and hexadecimal?",
      topic: "Number Systems & Logic",
      level: 1,
      top: true,
      short: "Decimal to base-b: repeatedly divide by b and read the remainders bottom-up (multiply the fraction by b for the fractional part). Binary to octal/hex: group bits in 3s/4s from the binary point.",
      a: [
        { p: "A number in base <i>b</i> is a weighted sum: d<sub>n</sub>·b<sup>n</sup> + … + d<sub>1</sub>·b + d<sub>0</sub> + d<sub>-1</sub>·b<sup>-1</sup> + …. Every conversion is just evaluating or reversing that sum." },
        { h: "Worked example: 156.625 (decimal)" },
        { ol: [
          "<b>Integer part → binary</b> (divide by 2, keep remainders): 156→78 r0, 78→39 r0, 39→19 r1, 19→9 r1, 9→4 r1, 4→2 r0, 2→1 r0, 1→0 r1. Read bottom-up: <code>10011100</code>.",
          "<b>Fraction → binary</b> (multiply by 2, keep integer parts): 0.625×2 = 1.25 → 1, 0.25×2 = 0.5 → 0, 0.5×2 = 1.0 → 1. Read top-down: <code>.101</code>.",
          "So 156.625<sub>10</sub> = <code>10011100.101</code><sub>2</sub>.",
          "<b>Binary → hex</b>: group 4 bits from the point: <code>1001 1100 . 1010</code> = <code>9C.A</code><sub>16</sub>.",
          "<b>Binary → octal</b>: group 3 bits from the point: <code>010 011 100 . 101</code> = <code>234.5</code><sub>8</sub>.",
          "<b>Check</b>: 2·64 + 3·8 + 4 + 5/8 = 156.625 ✓"
        ] },
        { table: { head: ["From → To", "Method"], rows: [
          ["Decimal → base b", "Integer: repeated division by b (remainders bottom-up). Fraction: repeated multiplication by b (integer parts top-down)"],
          ["Base b → decimal", "Sum of digit × b<sup>position</sup>"],
          ["Binary ↔ octal", "Group / expand 3 bits per octal digit"],
          ["Binary ↔ hex", "Group / expand 4 bits per hex digit"],
          ["Octal ↔ hex", "Go through binary"]
        ] } },
        { code: `n = 156
print(bin(n), oct(n), hex(n))      # 0b10011100 0o234 0x9c
print(int("10011100", 2))          # 156
print(int("9C", 16), int("234", 8)) # 156 156`, lang: "python", title: "Quick check in Python" },
        { warn: "Some decimal fractions never terminate in binary: 0.1<sub>10</sub> = 0.000110011…<sub>2</sub>. That is why <code>0.1 + 0.2 != 0.3</code> in floating point." }
      ]
    },
    {
      id: "signed-number-representation",
      q: "What are the ways to represent signed integers in binary?",
      topic: "Number Systems & Logic",
      level: 1,
      top: false,
      short: "Sign-magnitude, 1's complement, 2's complement and biased (excess-K). Almost all hardware uses 2's complement because it has a single zero and addition/subtraction use the same adder.",
      a: [
        { p: "With <i>n</i> bits there are 2<sup>n</sup> patterns; a signed scheme decides which patterns mean negative numbers." },
        { table: { head: ["Scheme", "−5 in 8 bits", "Range (n bits)", "Zeros", "Notes"], rows: [
          ["Sign-magnitude", "<code>1000 0101</code>", "−(2<sup>n−1</sup>−1) … +(2<sup>n−1</sup>−1)", "Two (+0, −0)", "MSB is sign, rest is magnitude. Needs separate add/sub logic"],
          ["1's complement", "<code>1111 1010</code>", "−(2<sup>n−1</sup>−1) … +(2<sup>n−1</sup>−1)", "Two", "Invert all bits. Addition needs end-around carry"],
          ["2's complement", "<code>1111 1011</code>", "−2<sup>n−1</sup> … +(2<sup>n−1</sup>−1)", "One", "Invert and add 1. Used by every modern CPU"],
          ["Excess-K (biased)", "<code>0111 1010</code> (K=127)", "−K … 2<sup>n</sup>−1−K", "One", "Stored = value + K. Used for IEEE 754 exponents"]
        ] } },
        { p: "For 8 bits: sign-magnitude and 1's complement cover −127…+127; 2's complement covers −128…+127 (the extra pattern <code>1000 0000</code> is −128)." },
        { p: "In 2's complement the MSB has weight −2<sup>n−1</sup>: <code>1111 1011</code> = −128 + 64 + 32 + 16 + 8 + 2 + 1 = −5." },
        { tip: "Interviewers often follow up with: <i>why does <code>INT_MIN</code> have no positive counterpart?</i> Because 2's complement has one more negative than positive value; <code>-INT_MIN</code> overflows (undefined behaviour in C)." }
      ]
    },
    {
      id: "ones-vs-twos-complement",
      q: "What is the difference between 1's complement and 2's complement? Why do computers use 2's complement?",
      topic: "Number Systems & Logic",
      level: 1,
      top: true,
      short: "1's complement inverts every bit; 2's complement inverts every bit and adds 1. 2's complement is used because it has a single zero, a wider range by one, and subtraction becomes plain addition with no end-around carry.",
      a: [
        { p: "<b>1's complement</b> of X = invert all bits (= (2<sup>n</sup>−1) − X). <b>2's complement</b> of X = 1's complement + 1 (= 2<sup>n</sup> − X)." },
        { p: "Shortcut for 2's complement: copy bits from the right up to and including the first 1, then invert the rest. <code>0010 1000</code> → <code>1101 1000</code>." },
        { h: "Worked example: 7 − 5 in 4 bits" },
        { table: { head: ["Step", "1's complement", "2's complement"], rows: [
          ["−5", "<code>1010</code>", "<code>1011</code>"],
          ["7 + (−5)", "<code>0111 + 1010 = 1 0001</code>", "<code>0111 + 1011 = 1 0010</code>"],
          ["Carry out", "Add it back (end-around carry): <code>0001 + 1 = 0010</code>", "Discard it: <code>0010</code>"],
          ["Result", "2 ✓", "2 ✓"]
        ] } },
        { table: { head: ["Property", "1's complement", "2's complement"], rows: [
          ["Zero", "Two (<code>0000</code> and <code>1111</code>)", "One (<code>0000</code>)"],
          ["Range (n bits)", "−(2<sup>n−1</sup>−1) … 2<sup>n−1</sup>−1", "−2<sup>n−1</sup> … 2<sup>n−1</sup>−1"],
          ["Adder", "Needs end-around carry", "Plain binary adder; carry out discarded"],
          ["Subtraction A − B", "A + ~B, then add carry back", "A + ~B + 1 (feed 1 into carry-in)"]
        ] } },
        { p: "<b>Overflow</b> in 2's complement happens when two same-sign operands give an opposite-sign result — equivalently when the carry into the MSB differs from the carry out of it." },
        { warn: "A carry out of the MSB is <i>not</i> overflow in 2's complement. 7 + (−5) produces a carry out but the answer is correct." }
      ]
    },
    {
      id: "logic-gates-universal",
      q: "Explain the basic logic gates. Why are NAND and NOR called universal gates?",
      topic: "Number Systems & Logic",
      level: 1,
      top: true,
      short: "AND, OR, NOT are the basic gates; NAND, NOR, XOR, XNOR are derived. NAND and NOR are universal because any Boolean function (including NOT, AND, OR) can be built using only that one gate type.",
      a: [
        { table: { head: ["Gate", "Expression", "Output is 1 when…", "Truth (AB = 00,01,10,11)"], rows: [
          ["AND", "A·B", "all inputs are 1", "0 0 0 1"],
          ["OR", "A + B", "any input is 1", "0 1 1 1"],
          ["NOT", "A′", "input is 0", "(single input) 1 0"],
          ["NAND", "(A·B)′", "not all inputs are 1", "1 1 1 0"],
          ["NOR", "(A + B)′", "all inputs are 0", "1 0 0 0"],
          ["XOR", "A ⊕ B = A′B + AB′", "inputs differ (odd number of 1s)", "0 1 1 0"],
          ["XNOR", "(A ⊕ B)′", "inputs are equal", "1 0 0 1"]
        ] } },
        { h: "Building everything from NAND" },
        { ul: [
          "<b>NOT</b>: A′ = NAND(A, A)",
          "<b>AND</b>: A·B = NOT(NAND(A, B)) — 2 NAND gates",
          "<b>OR</b>: A + B = NAND(A′, B′) — 3 NAND gates (De Morgan: (A′·B′)′ = A + B)",
          "<b>XOR</b>: 4 NAND gates: let X = NAND(A,B); out = NAND(NAND(A,X), NAND(B,X))"
        ] },
        { p: "Since {AND, OR, NOT} is functionally complete and each can be made from NAND alone, NAND is complete. The dual argument works for NOR (NOT = NOR(A,A), OR = NOT(NOR), AND = NOR(A′, B′))." },
        { tip: "Mention <b>why it matters</b>: in CMOS, NAND/NOR are the cheapest gates (4 transistors for 2-input), so real chips are synthesised largely from NAND/NOR cells. AND is actually NAND + inverter." },
        { warn: "XOR is not universal — you cannot build NOT or AND from XOR alone without a constant 1 input." }
      ]
    },
    {
      id: "combinational-vs-sequential",
      q: "What is the difference between combinational and sequential circuits?",
      topic: "Number Systems & Logic",
      level: 1,
      top: true,
      short: "A combinational circuit's output depends only on its current inputs (no memory). A sequential circuit's output depends on current inputs and past state, stored in flip-flops, and is usually driven by a clock.",
      a: [
        { table: { head: ["Aspect", "Combinational", "Sequential"], rows: [
          ["Output depends on", "Present inputs only", "Present inputs + stored state"],
          ["Memory", "None", "Yes — latches / flip-flops"],
          ["Feedback", "No feedback paths", "Output fed back as state"],
          ["Clock", "Not needed", "Synchronous ones use a clock; asynchronous ones don't"],
          ["Described by", "Truth table / Boolean expression", "State table / state diagram (FSM)"],
          ["Examples", "Adders, MUX, DEMUX, encoder, decoder, comparator", "Flip-flops, registers, counters, shift registers, FSMs, RAM"]
        ] } },
        { p: "Real designs combine both: a CPU datapath is combinational logic (ALU, muxes) sandwiched between registers (sequential) that capture the result on each clock edge." },
        { p: "Sequential circuits are <b>synchronous</b> (state changes only on a clock edge — easy to reason about) or <b>asynchronous</b> (state changes whenever inputs change — faster but prone to races and glitches)." },
        { tip: "A clean one-liner: <i>combinational = function of inputs; sequential = function of inputs and history</i>. Then give one example of each." }
      ]
    },
    {
      id: "half-adder-full-adder",
      q: "What are a half adder and a full adder? Give their equations.",
      topic: "Number Systems & Logic",
      level: 2,
      top: true,
      short: "A half adder adds two bits: Sum = A⊕B, Carry = A·B. A full adder adds two bits plus a carry-in: Sum = A⊕B⊕Cin, Cout = A·B + Cin·(A⊕B); it can be built from two half adders and an OR gate.",
      a: [
        { p: "<b>Half adder</b>: 2 inputs (A, B), 2 outputs (Sum, Carry). It cannot accept a carry from a lower bit, so it only works for the least-significant position." },
        { p: "<b>Full adder</b>: 3 inputs (A, B, C<sub>in</sub>), 2 outputs. Chaining n full adders gives an n-bit adder." },
        { table: { head: ["A", "B", "C<sub>in</sub>", "Sum", "C<sub>out</sub>"], rows: [
          ["0","0","0","0","0"], ["0","0","1","1","0"], ["0","1","0","1","0"], ["0","1","1","0","1"],
          ["1","0","0","1","0"], ["1","0","1","0","1"], ["1","1","0","0","1"], ["1","1","1","1","1"]
        ] } },
        { ul: [
          "Half adder: <b>S = A ⊕ B</b>, <b>C = A·B</b> (1 XOR + 1 AND)",
          "Full adder: <b>S = A ⊕ B ⊕ C<sub>in</sub></b>, <b>C<sub>out</sub> = A·B + C<sub>in</sub>·(A ⊕ B)</b> (equivalently AB + BC<sub>in</sub> + AC<sub>in</sub>, the majority function)"
        ] },
        { svg: `<svg viewBox="0 0 620 235" width="620" class="dg">
  <text class="tx tx-b" x="22" y="50" text-anchor="middle" dominant-baseline="middle">A</text>
  <text class="tx tx-b" x="22" y="80" text-anchor="middle" dominant-baseline="middle">B</text>
  <line class="ln" x1="32" y1="50" x2="60" y2="50" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="32" y1="80" x2="60" y2="80" marker-end="url(#dg-arr)"/>
  <rect class="box" x="60" y="30" width="110" height="70" rx="6"/>
  <text class="tx tx-b" x="115" y="65" text-anchor="middle" dominant-baseline="middle">Half Adder 1</text>
  <polyline class="ln" points="170,50 210,50 210,110 250,110" fill="none" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="190" y="42" text-anchor="middle">S1</text>
  <polyline class="ln" points="170,80 190,80 190,210 400,210" fill="none" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="182" y="140" text-anchor="end">C1</text>
  <text class="tx tx-b" x="232" y="150" text-anchor="end" dominant-baseline="middle">Cin</text>
  <line class="ln" x1="236" y1="150" x2="250" y2="150" marker-end="url(#dg-arr)"/>
  <rect class="box" x="250" y="90" width="110" height="80" rx="6"/>
  <text class="tx tx-b" x="305" y="130" text-anchor="middle" dominant-baseline="middle">Half Adder 2</text>
  <line class="ln-a" x1="360" y1="110" x2="560" y2="110" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-a" x="460" y="100" text-anchor="middle">Sum = A⊕B⊕Cin</text>
  <polyline class="ln" points="360,150 380,150 380,190 400,190" fill="none" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="392" y="143" text-anchor="middle">C2</text>
  <rect class="box-a" x="400" y="180" width="70" height="40" rx="6"/>
  <text class="tx tx-b" x="435" y="200" text-anchor="middle" dominant-baseline="middle">OR</text>
  <line class="ln-a" x1="470" y1="200" x2="560" y2="200" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-a" x="590" y="200" text-anchor="middle" dominant-baseline="middle">Cout</text>
</svg>`, caption: "Full adder = two half adders + one OR gate (Cout = C1 + C2)" },
        { p: "<b>Ripple-carry adder</b>: n full adders chained carry-to-carry. Simple but slow — the carry may ripple through all n stages (O(n) delay). A <b>carry look-ahead adder</b> computes generate G<sub>i</sub> = A<sub>i</sub>B<sub>i</sub> and propagate P<sub>i</sub> = A<sub>i</sub>⊕B<sub>i</sub> to produce all carries in parallel (O(log n) delay)." },
        { tip: "A common follow-up: <i>how do you subtract with the same adder?</i> XOR each B bit with a SUB control line and feed SUB into C<sub>in</sub> — that computes A + B′ + 1 = A − B." }
      ]
    },
    {
      id: "multiplexer-decoder",
      q: "What are a multiplexer, demultiplexer, encoder and decoder?",
      topic: "Number Systems & Logic",
      level: 2,
      top: false,
      short: "A multiplexer selects one of 2^n inputs onto one output using n select lines; a demultiplexer does the reverse. A decoder turns an n-bit code into one of 2^n active outputs; an encoder turns one active input into its n-bit code.",
      a: [
        { svg: `<svg viewBox="0 0 560 240" width="560" class="dg">
  <polygon class="box-a" points="200,20 300,50 300,150 200,180"/>
  <text class="tx tx-b" x="250" y="100" text-anchor="middle" dominant-baseline="middle">4:1 MUX</text>
  <line class="ln" x1="120" y1="50" x2="200" y2="50"/>
  <line class="ln" x1="120" y1="85" x2="200" y2="85"/>
  <line class="ln" x1="120" y1="115" x2="200" y2="115"/>
  <line class="ln" x1="120" y1="150" x2="200" y2="150"/>
  <text class="tx tx-c" x="110" y="50" text-anchor="end" dominant-baseline="middle">I0</text>
  <text class="tx tx-c" x="110" y="85" text-anchor="end" dominant-baseline="middle">I1</text>
  <text class="tx tx-c" x="110" y="115" text-anchor="end" dominant-baseline="middle">I2</text>
  <text class="tx tx-c" x="110" y="150" text-anchor="end" dominant-baseline="middle">I3</text>
  <line class="ln" x1="235" y1="215" x2="235" y2="172" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="265" y1="215" x2="265" y2="163" marker-end="url(#dg-arr)"/>
  <text class="tx tx-c" x="235" y="230" text-anchor="middle">S1</text>
  <text class="tx tx-c" x="265" y="230" text-anchor="middle">S0</text>
  <line class="ln-a" x1="300" y1="100" x2="370" y2="100" marker-end="url(#dg-arr-a)"/>
  <text class="tx tx-b" x="382" y="100" dominant-baseline="middle">Y</text>
  <rect class="box" x="420" y="45" width="120" height="110" rx="6"/>
  <text class="tx-m" x="480" y="65" text-anchor="middle">S1 S0 → Y</text>
  <text class="tx tx-c" x="480" y="87" text-anchor="middle">0  0 → I0</text>
  <text class="tx tx-c" x="480" y="107" text-anchor="middle">0  1 → I1</text>
  <text class="tx tx-c" x="480" y="127" text-anchor="middle">1  0 → I2</text>
  <text class="tx tx-c" x="480" y="147" text-anchor="middle">1  1 → I3</text>
</svg>`, caption: "4:1 multiplexer: two select lines choose which input reaches Y" },
        { p: "4:1 MUX output: <b>Y = S1′S0′·I0 + S1′S0·I1 + S1S0′·I2 + S1S0·I3</b>." },
        { table: { head: ["Circuit", "Inputs → Outputs", "Job", "Typical use"], rows: [
          ["Multiplexer (MUX)", "2<sup>n</sup> data + n select → 1", "Many-to-one selector", "Choosing ALU operand, register-file read ports, data routing"],
          ["Demultiplexer (DEMUX)", "1 data + n select → 2<sup>n</sup>", "One-to-many distributor", "Sending a signal to one of many destinations"],
          ["Decoder", "n → 2<sup>n</sup> (one-hot)", "Activates exactly one output line", "Memory address decoding (chip select), instruction opcode decoding"],
          ["Encoder", "2<sup>n</sup> (one active) → n", "Produces the code of the active line", "Keyboard encoding; <b>priority encoder</b> for interrupt requests"]
        ] } },
        { p: "A MUX is itself universal: a 2<sup>n</sup>:1 MUX can implement any n-variable Boolean function by wiring the truth-table column to its data inputs." },
        { tip: "A decoder with an enable input is exactly a DEMUX (enable = data line). Interviewers like that equivalence." }
      ]
    },
    {
      id: "flip-flops",
      q: "Explain SR, JK, D and T flip-flops. What is the difference between a latch and a flip-flop?",
      topic: "Number Systems & Logic",
      level: 2,
      top: true,
      short: "Flip-flops are 1-bit edge-triggered memory elements. SR sets/resets (S=R=1 invalid), JK is SR with J=K=1 meaning toggle, D copies its input to Q, and T toggles when T=1. A latch is level-sensitive; a flip-flop changes only on a clock edge.",
      a: [
        { table: { head: ["Inputs", "SR", "JK", "D", "T"], rows: [
          ["00 / D=0 / T=0", "Q (hold)", "Q (hold)", "0", "Q (hold)"],
          ["01", "0 (reset)", "0 (reset)", "—", "—"],
          ["10", "1 (set)", "1 (set)", "—", "—"],
          ["11 / D=1 / T=1", "<b>Invalid</b>", "Q′ (toggle)", "1", "Q′ (toggle)"],
          ["Characteristic eq.", "Q<sup>+</sup> = S + R′Q (SR = 0)", "Q<sup>+</sup> = JQ′ + K′Q", "Q<sup>+</sup> = D", "Q<sup>+</sup> = T ⊕ Q"]
        ] } },
        { ul: [
          "<b>SR</b>: the basic set/reset storage cell (two cross-coupled NOR or NAND gates). S = R = 1 is forbidden because both outputs are forced to the same value and the next state is unpredictable.",
          "<b>JK</b>: fixes SR's invalid state — J = K = 1 toggles. The most versatile flip-flop.",
          "<b>D (data/delay)</b>: Q takes D on the clock edge. Used for registers and pipeline latches — the workhorse of synchronous design.",
          "<b>T (toggle)</b>: JK with J = K = T. Used for counters and frequency dividers (a T flip-flop with T = 1 halves the clock frequency)."
        ] },
        { h: "Latch vs flip-flop" },
        { table: { head: ["", "Latch", "Flip-flop"], rows: [
          ["Triggering", "Level-sensitive (transparent while enable is high)", "Edge-triggered (samples only on rising/falling edge)"],
          ["Output change", "Any time during the active level", "Only at the clock edge"],
          ["Size / speed", "Smaller, faster", "Larger (often two latches: master–slave)"],
          ["Risk", "Races / timing loops through transparent latches", "Setup / hold-time violations"]
        ] } },
        { warn: "<b>Race-around condition</b>: in a level-triggered JK with J = K = 1, if the clock pulse is longer than the propagation delay, Q toggles repeatedly within one pulse. Fix: master–slave JK or edge triggering." },
        { tip: "Know <b>setup time</b> (input must be stable before the edge) and <b>hold time</b> (stable after the edge). Violations cause metastability — a classic follow-up in hardware-role interviews." }
      ]
    },
    {
      id: "ieee-754-floating-point",
      q: "How are floating-point numbers stored in IEEE 754 format?",
      topic: "Number Systems & Logic",
      level: 2,
      top: true,
      short: "IEEE 754 stores a sign bit, a biased exponent and a fraction (mantissa) with an implicit leading 1: value = (−1)^S × 1.F × 2^(E − bias). Single precision is 1 + 8 + 23 bits (bias 127); double is 1 + 11 + 52 bits (bias 1023).",
      a: [
        { svg: `<svg viewBox="0 0 560 130" width="560" class="dg">
  <text class="tx-m" x="45" y="28" text-anchor="middle">bit 31</text>
  <text class="tx-m" x="150" y="28" text-anchor="middle">bits 30 … 23</text>
  <text class="tx-m" x="385" y="28" text-anchor="middle">bits 22 … 0</text>
  <rect class="box-p" x="20" y="36" width="50" height="40" rx="6"/>
  <rect class="box-w" x="70" y="36" width="160" height="40" rx="6"/>
  <rect class="box-a" x="230" y="36" width="310" height="40" rx="6"/>
  <text class="tx tx-b" x="45" y="56" text-anchor="middle" dominant-baseline="middle">S</text>
  <text class="tx tx-b" x="150" y="56" text-anchor="middle" dominant-baseline="middle">Exponent (8, bias 127)</text>
  <text class="tx tx-b" x="385" y="56" text-anchor="middle" dominant-baseline="middle">Fraction F (23 bits)</text>
  <text class="tx tx-c" x="45" y="100" text-anchor="middle">1</text>
  <text class="tx tx-c" x="150" y="100" text-anchor="middle">10000001</text>
  <text class="tx tx-c" x="385" y="100" text-anchor="middle">10100000000000000000000</text>
  <text class="tx-m" x="280" y="122" text-anchor="middle">example: −6.5 = 0xC0D00000</text>
</svg>`, caption: "Single precision layout: value = (−1)^S × 1.F × 2^(E − 127)" },
        { h: "Worked example: −6.5 to single precision" },
        { ol: [
          "6.5 = <code>110.1</code><sub>2</sub> = <code>1.101</code> × 2<sup>2</sup> (normalise so one 1 is left of the point).",
          "Sign S = 1 (negative).",
          "Exponent E = 2 + 127 = 129 = <code>10000001</code>.",
          "Fraction F = bits after the leading 1: <code>101</code> padded to 23 bits (the leading 1 is implicit, not stored).",
          "Bits: <code>1 10000001 10100000000000000000000</code> = <code>0xC0D00000</code>."
        ] },
        { table: { head: ["Format", "Sign", "Exponent", "Fraction", "Bias", "≈ Decimal digits"], rows: [
          ["Single (float)", "1", "8", "23", "127", "~7"],
          ["Double (double)", "1", "11", "52", "1023", "~15–16"],
          ["Half (fp16)", "1", "5", "10", "15", "~3"]
        ] } },
        { table: { head: ["Exponent field", "Fraction", "Meaning"], rows: [
          ["All 0s", "0", "±0 (signed zero)"],
          ["All 0s", "≠ 0", "Denormal (subnormal): 0.F × 2<sup>−126</sup> — gradual underflow"],
          ["1 … 254", "any", "Normal number"],
          ["All 1s", "0", "±Infinity"],
          ["All 1s", "≠ 0", "NaN (e.g. 0/0, sqrt(−1))"]
        ] } },
        { p: "Why a <b>biased</b> exponent? It makes the exponent unsigned, so two positive floats can be compared as plain integers bit-for-bit." },
        { warn: "Floats are not exact: 0.1 has no finite binary form, so <code>0.1 + 0.2 == 0.3</code> is false. Compare with a tolerance, and never use float for money." }
      ]
    },

    /* ───────────── CPU & Instructions ───────────── */
    {
      id: "von-neumann-vs-harvard",
      q: "What is the difference between Von Neumann and Harvard architecture?",
      topic: "CPU & Instructions",
      level: 1,
      top: true,
      short: "Von Neumann uses one memory and one bus for both instructions and data, so fetches and data accesses compete (the Von Neumann bottleneck). Harvard has separate instruction and data memories and buses, so both can be accessed in the same cycle.",
      a: [
        { p: "<b>Von Neumann (stored-program)</b>: program and data live in the same memory and travel over the same bus. <b>Harvard</b>: physically separate instruction memory and data memory, each with its own bus." },
        { svg: `<svg viewBox="0 0 620 200" width="620" class="dg">
  <text class="tx tx-b" x="150" y="22" text-anchor="middle">Von Neumann</text>
  <rect class="box-a" x="90" y="36" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="150" y="58" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <line class="ln" x1="138" y1="80" x2="138" y2="130" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="162" y1="130" x2="162" y2="80" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="172" y="108">single shared bus</text>
  <rect class="box" x="45" y="130" width="210" height="48" rx="6"/>
  <text class="tx" x="150" y="154" text-anchor="middle" dominant-baseline="middle">Memory: instructions + data</text>
  <line class="ln ln-d" x1="310" y1="15" x2="310" y2="190"/>
  <text class="tx tx-b" x="465" y="22" text-anchor="middle">Harvard</text>
  <rect class="box-a" x="405" y="36" width="120" height="44" rx="6"/>
  <text class="tx tx-b" x="465" y="58" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <line class="ln-a" x1="395" y1="130" x2="430" y2="80" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="370" y="100" text-anchor="middle">instr bus</text>
  <line class="ln" x1="495" y1="80" x2="525" y2="130" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="545" y1="130" x2="515" y2="80" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="565" y="100" text-anchor="middle">data bus</text>
  <rect class="box-g" x="325" y="130" width="130" height="48" rx="6"/>
  <text class="tx" x="390" y="154" text-anchor="middle" dominant-baseline="middle">Instruction memory</text>
  <rect class="box-p" x="470" y="130" width="130" height="48" rx="6"/>
  <text class="tx" x="535" y="154" text-anchor="middle" dominant-baseline="middle">Data memory</text>
</svg>`, caption: "One shared path vs. two independent paths to memory" },
        { table: { head: ["Aspect", "Von Neumann", "Harvard"], rows: [
          ["Memory", "Single, shared for code and data", "Separate instruction and data memories"],
          ["Buses", "One set of address/data buses", "Two independent sets"],
          ["Parallel access", "No — fetch and data access take turns", "Yes — fetch next instruction while accessing data"],
          ["Bottleneck", "Von Neumann bottleneck (bus bandwidth limits throughput)", "Avoided"],
          ["Flexibility", "Self-modifying code possible; memory split is dynamic", "Fixed split; code usually cannot be written as data"],
          ["Cost / complexity", "Simpler, cheaper", "More wiring and pins"],
          ["Used in", "General-purpose PCs (conceptually)", "Microcontrollers (AVR, PIC), DSPs"]
        ] } },
        { p: "<b>Modern CPUs use modified Harvard</b>: split L1 instruction cache and L1 data cache (Harvard at the core, so pipeline fetch and load/store don't collide) backed by one unified main memory (Von Neumann to the programmer)." },
        { tip: "Saying <i>modified Harvard — split L1 I/D caches over a unified memory</i> is the answer that separates a strong candidate from a textbook one." }
      ]
    },
    {
      id: "cpu-components",
      q: "What are the main components of a CPU? Explain ALU, CU, PC, IR, MAR and MDR.",
      topic: "CPU & Instructions",
      level: 1,
      top: true,
      short: "A CPU has an ALU (does arithmetic/logic), a control unit (decodes instructions and generates control signals) and registers. Key registers: PC holds the next instruction address, IR holds the current instruction, MAR holds the memory address being accessed and MDR holds the data moving to/from memory.",
      a: [
        { table: { head: ["Component", "Role"], rows: [
          ["<b>ALU</b> (Arithmetic Logic Unit)", "Performs add, subtract, AND, OR, XOR, shifts, comparisons. Sets status flags"],
          ["<b>CU</b> (Control Unit)", "Decodes the instruction in IR and generates the timing and control signals that drive the datapath, memory and I/O"],
          ["<b>PC</b> (Program Counter)", "Address of the <i>next</i> instruction; incremented after fetch, overwritten by jumps/branches/calls"],
          ["<b>IR</b> (Instruction Register)", "Holds the instruction currently being decoded/executed"],
          ["<b>MAR</b> (Memory Address Register)", "Holds the address the CPU is about to read or write; drives the address bus"],
          ["<b>MDR / MBR</b> (Memory Data/Buffer Register)", "Holds the data word just read from, or about to be written to, memory; connects to the data bus"],
          ["<b>ACC</b> (Accumulator)", "Implicit operand/result register in accumulator-based machines"],
          ["<b>General-purpose registers</b>", "Fast operand storage (e.g. 16 in x86-64, 31 in ARM64, 32 in RISC-V)"],
          ["<b>SP</b> (Stack Pointer)", "Top of the call stack"],
          ["<b>Flags / PSW</b> (Status register)", "Zero, Carry, Sign, Overflow, interrupt-enable bits"]
        ] } },
        { p: "Only MAR and MDR talk directly to the memory buses; everything else goes through them. The ALU + registers + internal buses form the <b>datapath</b>; the CU is the <b>controller</b>." },
        { tip: "A common trap follow-up: <i>does PC point to the current instruction?</i> After the fetch step it points to the <b>next</b> one — which is why PC-relative branch offsets are computed from PC + instruction size." }
      ]
    },
    {
      id: "instruction-cycle",
      q: "Explain the instruction cycle (fetch–decode–execute).",
      topic: "CPU & Instructions",
      level: 1,
      top: true,
      short: "The CPU repeatedly fetches the instruction at PC into IR and increments PC, decodes it, fetches any operands, executes it in the ALU, writes the result back, and then checks for pending interrupts before starting the next cycle.",
      a: [
        { svg: `<svg viewBox="0 0 640 170" width="640" class="dg">
  <rect class="box-a" x="20" y="40" width="100" height="50" rx="6"/>
  <text class="tx tx-b" x="70" y="65" text-anchor="middle" dominant-baseline="middle">Fetch</text>
  <line class="ln" x1="120" y1="65" x2="148" y2="65" marker-end="url(#dg-arr)"/>
  <rect class="box" x="150" y="40" width="100" height="50" rx="6"/>
  <text class="tx tx-b" x="200" y="65" text-anchor="middle" dominant-baseline="middle">Decode</text>
  <line class="ln" x1="250" y1="65" x2="278" y2="65" marker-end="url(#dg-arr)"/>
  <rect class="box" x="280" y="40" width="100" height="50" rx="6"/>
  <text class="tx tx-b" x="330" y="58" text-anchor="middle" dominant-baseline="middle">Execute</text>
  <text class="tx-m" x="330" y="76" text-anchor="middle" dominant-baseline="middle">+ operand fetch</text>
  <line class="ln" x1="380" y1="65" x2="408" y2="65" marker-end="url(#dg-arr)"/>
  <rect class="box-g" x="410" y="40" width="100" height="50" rx="6"/>
  <text class="tx tx-b" x="460" y="65" text-anchor="middle" dominant-baseline="middle">Write back</text>
  <line class="ln" x1="510" y1="65" x2="528" y2="65" marker-end="url(#dg-arr)"/>
  <rect class="box-w" x="530" y="40" width="100" height="50" rx="6"/>
  <text class="tx tx-b" x="580" y="65" text-anchor="middle" dominant-baseline="middle">Interrupt?</text>
  <polyline class="ln-a" points="580,90 580,130 70,130 70,92" fill="none" marker-end="url(#dg-arr-a)"/>
  <text class="tx-m" x="325" y="148" text-anchor="middle">next instruction (PC, or ISR address if interrupt pending)</text>
  <text class="tx-m" x="70" y="30" text-anchor="middle">IR ← M[PC]</text>
  <text class="tx-m" x="200" y="30" text-anchor="middle">CU reads opcode</text>
</svg>`, caption: "The instruction cycle repeats for every instruction" },
        { code: `Fetch:     MAR <- PC
           MDR <- M[MAR]          ; memory read over the data bus
           IR  <- MDR
           PC  <- PC + 1          ; (+ instruction size in bytes)
Decode:    CU decodes opcode and addressing mode in IR
Operand:   compute effective address, read operands (may need MAR/MDR again)
Execute:   ALU performs the operation, flags updated
Writeback: result -> register or memory
Interrupt: if an enabled interrupt is pending, save PC, PC <- ISR address`, lang: "text", title: "Register-transfer view (e.g. ADD R1, X)" },
        { ul: [
          "<b>Machine cycle</b>: one basic memory/bus operation (e.g. a memory read). <b>Instruction cycle</b>: all machine cycles for one instruction. <b>Clock cycle</b>: one tick; a machine cycle takes one or more clock cycles.",
          "The <b>indirect cycle</b> appears when an operand address must itself be read from memory (indirect addressing)."
        ] },
        { tip: "Pipelining (next topic) is simply overlapping these stages for different instructions — mention that link." }
      ]
    },
    {
      id: "risc-vs-cisc",
      q: "What is the difference between RISC and CISC?",
      topic: "CPU & Instructions",
      level: 1,
      top: true,
      short: "RISC uses a small set of simple, fixed-length instructions that mostly execute in one cycle, with load/store-only memory access and many registers, which suits pipelining. CISC has many complex, variable-length instructions that can operate directly on memory, giving denser code but harder decoding.",
      a: [
        { table: { head: ["Aspect", "RISC", "CISC"], rows: [
          ["Instruction set", "Small, simple", "Large, many specialised instructions"],
          ["Instruction length", "Fixed (e.g. 32-bit)", "Variable (x86: 1–15 bytes)"],
          ["Cycles per instruction", "~1 (pipelined)", "Many, varies per instruction"],
          ["Memory access", "Only LOAD/STORE touch memory", "Arithmetic can use memory operands directly"],
          ["Addressing modes", "Few", "Many"],
          ["Registers", "Many general-purpose (32)", "Fewer (historically 8)"],
          ["Control unit", "Hardwired", "Traditionally microprogrammed"],
          ["Code size", "Larger (more instructions)", "Smaller, denser"],
          ["Complexity lives in", "Compiler", "Hardware"],
          ["Pipelining", "Easy (uniform instructions)", "Hard (variable length, complex ops)"],
          ["Examples", "ARM, RISC-V, MIPS, SPARC, PowerPC", "x86 / x86-64, VAX, IBM System/360"]
        ] } },
        { code: `; Multiply two numbers in memory: a = a * b
; CISC (x86-style) - one instruction with memory operands
IMUL  EAX, [b]        ; after MOV EAX,[a]
; RISC (load/store) - explicit loads and store
LW    R1, a
LW    R2, b
MUL   R3, R1, R2
SW    R3, a`, lang: "text", title: "Same work, two philosophies" },
        { p: "<b>Today the line is blurred</b>: x86 CPUs decode CISC instructions into RISC-like <b>micro-ops</b> internally and pipeline those, while ARM has added complex instructions (SIMD, crypto). The ISA is CISC; the core is RISC-like." },
        { tip: "Performance equation to quote: <b>CPU time = Instructions × CPI × clock period</b>. CISC reduces instruction count; RISC reduces CPI and clock period." }
      ]
    },
    {
      id: "addressing-modes",
      q: "What are addressing modes? Explain the common ones with examples.",
      topic: "CPU & Instructions",
      level: 2,
      top: true,
      short: "Addressing modes specify how an instruction finds its operand — as a constant (immediate), in a register, at a memory address given directly or indirectly, or at an address computed from a register plus offset (indexed, base, PC-relative).",
      a: [
        { p: "The <b>effective address (EA)</b> is the actual memory location of the operand. Addressing modes trade instruction size and speed against flexibility." },
        { table: { head: ["Mode", "Example", "Operand / EA", "Memory refs for operand", "Typical use"], rows: [
          ["Immediate", "<code>MOV R1, #5</code>", "Operand = 5 (in the instruction)", "0", "Constants"],
          ["Register", "<code>ADD R1, R2</code>", "Operand = R2", "0", "Fastest; local variables"],
          ["Direct (absolute)", "<code>LOAD R1, 1000</code>", "EA = 1000", "1", "Global/static variables"],
          ["Indirect", "<code>LOAD R1, @1000</code>", "EA = M[1000]", "2", "Pointers stored in memory"],
          ["Register indirect", "<code>LOAD R1, (R2)</code>", "EA = R2", "1", "Pointer dereference <code>*p</code>"],
          ["Indexed / displacement", "<code>LOAD R1, 100(R2)</code>", "EA = 100 + R2", "1", "Arrays <code>a[i]</code>, struct fields, stack frames"],
          ["Base + index", "<code>LOAD R1, (R2 + R3)</code>", "EA = R2 + R3", "1", "2-D arrays, tables"],
          ["PC-relative", "<code>BEQ label</code>", "EA = PC + offset", "0 for branch", "Branches; position-independent code"],
          ["Auto-increment / decrement", "<code>LOAD R1, (R2)+</code>", "EA = R2, then R2 += size", "1", "Walking arrays, stack push/pop"],
          ["Implied (implicit)", "<code>CLC</code>, <code>PUSH</code>", "Operand implied by opcode", "—", "Flag ops, stack ops"]
        ] } },
        { p: "Mapping to C: <code>x = 5</code> → immediate; <code>x = y</code> (both in registers) → register; <code>x = *p</code> → register indirect; <code>x = a[i]</code> → indexed; <code>if (…) goto</code> → PC-relative." },
        { tip: "Indirect needs <b>two</b> memory accesses (one for the pointer, one for the data) — the most common numeric trick question. Immediate needs zero." },
        { warn: "Don't confuse <b>indirect</b> (address stored in <i>memory</i>) with <b>register indirect</b> (address stored in a <i>register</i>)." }
      ]
    },
    {
      id: "instruction-formats",
      q: "What are instruction formats? Explain 3-, 2-, 1- and 0-address instructions.",
      topic: "CPU & Instructions",
      level: 2,
      top: false,
      short: "An instruction format is the layout of an instruction's bits: an opcode field plus operand/address fields. The number of explicit addresses (3, 2, 1 or 0) trades instruction length against the number of instructions needed.",
      a: [
        { p: "Every instruction has an <b>opcode</b> (what to do) and zero or more <b>operand fields</b> (register numbers, memory addresses, immediates, addressing-mode bits). Formats can be <b>fixed-length</b> (RISC: easy decoding) or <b>variable-length</b> (CISC: compact code)." },
        { code: `X = (A + B) * C

3-address:  ADD  T, A, B        ; T = A + B
            MUL  X, T, C        ; X = T * C

2-address:  MOV  X, A           ; X = A
            ADD  X, B           ; X = X + B
            MUL  X, C           ; X = X * C

1-address:  LOAD  A             ; ACC = A    (accumulator machine)
            ADD   B             ; ACC += B
            MUL   C             ; ACC *= C
            STORE X             ; X = ACC

0-address:  PUSH A              ; stack machine
            PUSH B
            ADD                 ; pops 2, pushes A+B
            PUSH C
            MUL
            POP  X`, lang: "text", title: "Same expression in each format" },
        { table: { head: ["Format", "Instruction length", "Instruction count", "Example machines"], rows: [
          ["3-address", "Longest", "Fewest", "RISC register–register (ARM, RISC-V: <code>add x1, x2, x3</code>)"],
          ["2-address", "Medium", "More", "x86 (<code>add eax, ebx</code> — destination is also a source)"],
          ["1-address", "Short", "More", "Early accumulator machines, 8085-style"],
          ["0-address", "Shortest", "Most", "Stack machines — JVM bytecode, .NET CIL"]
        ] } },
        { h: "Worked example: field sizes" },
        { p: "A 32-bit instruction has three register operands and the CPU has 64 registers. Each register field needs log<sub>2</sub>64 = 6 bits → 18 bits for operands, leaving <b>14 bits</b> for the opcode, i.e. up to 2<sup>14</sup> = 16384 distinct opcodes." },
        { tip: "<b>Expanding opcode</b> technique: short opcodes for instructions with many operands, longer opcodes (reusing unused operand bits) for instructions with fewer operands." }
      ]
    },
    {
      id: "hardwired-vs-microprogrammed",
      q: "What is the difference between hardwired and microprogrammed control units?",
      topic: "CPU & Instructions",
      level: 2,
      top: false,
      short: "A hardwired control unit generates control signals with fixed combinational logic (fast but hard to change). A microprogrammed control unit stores control signals as microinstructions in a control memory and steps through them (slower but easy to modify and extend).",
      a: [
        { table: { head: ["Aspect", "Hardwired", "Microprogrammed"], rows: [
          ["Implementation", "Gates, decoders, flip-flops, sequence counter", "Control memory (ROM) holding microprograms + micro-PC"],
          ["Speed", "Fast", "Slower (extra control-memory read per micro-step)"],
          ["Flexibility", "Changing it means redesigning the circuit", "Change the microcode (sometimes even via firmware update)"],
          ["Design complexity", "Hard for large instruction sets", "Systematic, easier for complex ISAs"],
          ["Cost", "Cheaper for small ISAs", "Cheaper to design for large ISAs"],
          ["Typical use", "RISC processors", "CISC processors (x86 uses microcode for complex instructions)"]
        ] } },
        { p: "In microprogrammed control, each machine instruction maps to a <b>microroutine</b>; each <b>microinstruction</b> specifies which control lines to assert in one clock cycle plus how to pick the next microinstruction." },
        { ul: [
          "<b>Horizontal microcode</b>: one bit per control signal — wide words, high parallelism, no decoding.",
          "<b>Vertical microcode</b>: encoded fields that are decoded into signals — narrow words, less parallelism, extra decode delay."
        ] },
        { tip: "Real-world hook: Intel and AMD ship <b>microcode updates</b> to patch CPU bugs (e.g. Spectre mitigations) — only possible because part of control is microprogrammed." }
      ]
    },

    /* ───────────── Pipelining ───────────── */
    {
      id: "pipelining",
      q: "What is instruction pipelining? Explain the classic 5-stage pipeline.",
      topic: "Pipelining",
      level: 1,
      top: true,
      short: "Pipelining overlaps the execution of multiple instructions by splitting each into stages (IF, ID, EX, MEM, WB) so that a different instruction occupies each stage every cycle. It raises throughput to ideally one instruction per cycle without making any single instruction faster.",
      a: [
        { p: "Like an assembly line: while instruction 1 executes, instruction 2 is being decoded and instruction 3 fetched. Pipeline registers (latches) between stages hold intermediate results." },
        { ol: [
          "<b>IF</b> — Instruction Fetch: read instruction at PC from I-cache, PC += 4.",
          "<b>ID</b> — Instruction Decode: decode opcode, read source registers.",
          "<b>EX</b> — Execute: ALU operation or effective-address calculation; branch condition evaluated.",
          "<b>MEM</b> — Memory access: loads read and stores write the D-cache.",
          "<b>WB</b> — Write Back: write the result into the register file."
        ] },
        { svg: `<svg viewBox="0 0 640 215" width="640" class="dg">
  <text class="tx-m" x="120" y="22" text-anchor="middle">1</text>
  <text class="tx-m" x="180" y="22" text-anchor="middle">2</text>
  <text class="tx-m" x="240" y="22" text-anchor="middle">3</text>
  <text class="tx-m" x="300" y="22" text-anchor="middle">4</text>
  <text class="tx-m" x="360" y="22" text-anchor="middle">5</text>
  <text class="tx-m" x="420" y="22" text-anchor="middle">6</text>
  <text class="tx-m" x="480" y="22" text-anchor="middle">7</text>
  <text class="tx-m" x="540" y="22" text-anchor="middle">8</text>
  <text class="tx-m" x="600" y="22" text-anchor="middle">cycle</text>
  <text class="tx tx-b" x="45" y="50" text-anchor="middle" dominant-baseline="middle">I1</text>
  <text class="tx tx-b" x="45" y="90" text-anchor="middle" dominant-baseline="middle">I2</text>
  <text class="tx tx-b" x="45" y="130" text-anchor="middle" dominant-baseline="middle">I3</text>
  <text class="tx tx-b" x="45" y="170" text-anchor="middle" dominant-baseline="middle">I4</text>
  <rect class="box-a" x="90" y="35" width="300" height="30" rx="6"/>
  <rect class="box-g" x="150" y="75" width="300" height="30" rx="6"/>
  <rect class="box-p" x="210" y="115" width="300" height="30" rx="6"/>
  <rect class="box-w" x="270" y="155" width="300" height="30" rx="6"/>
  <text class="tx tx-c" x="120" y="50" text-anchor="middle" dominant-baseline="middle">IF</text>
  <text class="tx tx-c" x="180" y="50" text-anchor="middle" dominant-baseline="middle">ID</text>
  <text class="tx tx-c" x="240" y="50" text-anchor="middle" dominant-baseline="middle">EX</text>
  <text class="tx tx-c" x="300" y="50" text-anchor="middle" dominant-baseline="middle">MEM</text>
  <text class="tx tx-c" x="360" y="50" text-anchor="middle" dominant-baseline="middle">WB</text>
  <text class="tx tx-c" x="180" y="90" text-anchor="middle" dominant-baseline="middle">IF</text>
  <text class="tx tx-c" x="240" y="90" text-anchor="middle" dominant-baseline="middle">ID</text>
  <text class="tx tx-c" x="300" y="90" text-anchor="middle" dominant-baseline="middle">EX</text>
  <text class="tx tx-c" x="360" y="90" text-anchor="middle" dominant-baseline="middle">MEM</text>
  <text class="tx tx-c" x="420" y="90" text-anchor="middle" dominant-baseline="middle">WB</text>
  <text class="tx tx-c" x="240" y="130" text-anchor="middle" dominant-baseline="middle">IF</text>
  <text class="tx tx-c" x="300" y="130" text-anchor="middle" dominant-baseline="middle">ID</text>
  <text class="tx tx-c" x="360" y="130" text-anchor="middle" dominant-baseline="middle">EX</text>
  <text class="tx tx-c" x="420" y="130" text-anchor="middle" dominant-baseline="middle">MEM</text>
  <text class="tx tx-c" x="480" y="130" text-anchor="middle" dominant-baseline="middle">WB</text>
  <text class="tx tx-c" x="300" y="170" text-anchor="middle" dominant-baseline="middle">IF</text>
  <text class="tx tx-c" x="360" y="170" text-anchor="middle" dominant-baseline="middle">ID</text>
  <text class="tx tx-c" x="420" y="170" text-anchor="middle" dominant-baseline="middle">EX</text>
  <text class="tx tx-c" x="480" y="170" text-anchor="middle" dominant-baseline="middle">MEM</text>
  <text class="tx tx-c" x="540" y="170" text-anchor="middle" dominant-baseline="middle">WB</text>
  <line class="ln-a ln-d" x1="330" y1="30" x2="330" y2="190"/>
  <line class="ln-a ln-d" x1="390" y1="30" x2="390" y2="190"/>
  <text class="tx-a" x="360" y="206" text-anchor="middle">cycle 5: pipeline full, one instruction completes per cycle</text>
</svg>`, caption: "4 instructions finish in 8 cycles instead of 20 (k + n − 1 = 5 + 4 − 1)" },
        { p: "<b>Timing</b>: with k stages and n instructions, a non-pipelined CPU needs n·k cycles; a pipelined one needs <b>k + (n − 1)</b> cycles. Speedup = n·k / (k + n − 1), which approaches k as n grows." },
        { ul: [
          "<b>Latency</b> of one instruction does not drop (it may rise slightly due to latch overhead).",
          "<b>Throughput</b> rises — ideally CPI = 1.",
          "The clock period is set by the <b>slowest stage</b>, so stages should be balanced."
        ] },
        { warn: "Pipelining does <b>not</b> make an individual instruction faster — it increases how many instructions finish per unit time." }
      ]
    },
    {
      id: "pipeline-hazards",
      q: "What are pipeline hazards? How are structural, data and control hazards handled?",
      topic: "Pipelining",
      level: 2,
      top: true,
      short: "Hazards are situations that stop the next instruction from executing in its cycle. Structural hazards come from resource conflicts, data hazards from dependencies on results not yet written, and control hazards from branches. Fixes include duplicated resources, forwarding, stalls, branch prediction and delayed branches.",
      a: [
        { table: { head: ["Hazard", "Cause", "Example", "Solutions"], rows: [
          ["<b>Structural</b>", "Two instructions need the same hardware in the same cycle", "Single memory port used by IF of one instr and MEM of another", "Duplicate resources (split I/D caches), multi-ported register file, stall"],
          ["<b>Data</b>", "Instruction needs a result an earlier instruction hasn't written yet", "<code>ADD R1,R2,R3</code> then <code>SUB R4,R1,R5</code>", "Forwarding (bypassing), stalls (bubbles), compiler instruction scheduling"],
          ["<b>Control</b>", "Next PC unknown until a branch resolves", "<code>BEQ R1,R2,L</code> — fetched instructions after it may be wrong", "Stall, predict not-taken, dynamic branch prediction + BTB, delayed branch, resolve branch earlier (in ID)"]
        ] } },
        { h: "Data hazard types" },
        { ul: [
          "<b>RAW</b> (read after write) — true dependency; the only one in a simple in-order 5-stage pipeline.",
          "<b>WAR</b> (write after read) — anti-dependency; matters in out-of-order CPUs.",
          "<b>WAW</b> (write after write) — output dependency; also out-of-order.",
          "WAR and WAW are <i>name</i> dependencies and are removed by <b>register renaming</b>."
        ] },
        { svg: `<svg viewBox="0 0 560 150" width="560" class="dg">
  <text class="tx-m" x="165" y="20" text-anchor="middle">1</text>
  <text class="tx-m" x="235" y="20" text-anchor="middle">2</text>
  <text class="tx-m" x="305" y="20" text-anchor="middle">3</text>
  <text class="tx-m" x="375" y="20" text-anchor="middle">4</text>
  <text class="tx-m" x="445" y="20" text-anchor="middle">5</text>
  <text class="tx-m" x="515" y="20" text-anchor="middle">6</text>
  <text class="tx tx-c" x="122" y="45" text-anchor="end" dominant-baseline="middle">ADD R1,R2,R3</text>
  <text class="tx tx-c" x="122" y="95" text-anchor="end" dominant-baseline="middle">SUB R4,R1,R5</text>
  <rect class="box" x="130" y="30" width="138" height="30" rx="6"/>
  <rect class="box-a" x="270" y="30" width="68" height="30" rx="6"/>
  <rect class="box" x="340" y="30" width="138" height="30" rx="6"/>
  <text class="tx tx-c" x="165" y="45" text-anchor="middle" dominant-baseline="middle">IF</text>
  <text class="tx tx-c" x="235" y="45" text-anchor="middle" dominant-baseline="middle">ID</text>
  <text class="tx tx-c" x="305" y="45" text-anchor="middle" dominant-baseline="middle">EX</text>
  <text class="tx tx-c" x="375" y="45" text-anchor="middle" dominant-baseline="middle">MEM</text>
  <text class="tx tx-c" x="445" y="45" text-anchor="middle" dominant-baseline="middle">WB</text>
  <rect class="box" x="200" y="80" width="138" height="30" rx="6"/>
  <rect class="box-a" x="340" y="80" width="68" height="30" rx="6"/>
  <rect class="box" x="410" y="80" width="138" height="30" rx="6"/>
  <text class="tx tx-c" x="235" y="95" text-anchor="middle" dominant-baseline="middle">IF</text>
  <text class="tx tx-c" x="305" y="95" text-anchor="middle" dominant-baseline="middle">ID</text>
  <text class="tx tx-c" x="375" y="95" text-anchor="middle" dominant-baseline="middle">EX</text>
  <text class="tx tx-c" x="445" y="95" text-anchor="middle" dominant-baseline="middle">MEM</text>
  <text class="tx tx-c" x="515" y="95" text-anchor="middle" dominant-baseline="middle">WB</text>
  <line class="ln-a" x1="330" y1="60" x2="352" y2="79" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="300" y="135" text-anchor="middle">R1 forwarded from ADD's EX output to SUB's EX input</text>
</svg>`, caption: "Forwarding (bypassing) resolves a RAW hazard without waiting for WB" },
        { p: "<b>Load-use hazard</b>: <code>LW R1, 0(R2)</code> followed by <code>ADD R3, R1, R4</code> still needs <b>one stall</b> even with forwarding, because the loaded value only exists at the end of MEM. Compilers hide it by scheduling an independent instruction into that slot." },
        { h: "Branch prediction" },
        { ul: [
          "<b>Static</b>: always predict not-taken, or backward-taken / forward-not-taken (loops branch backward and are usually taken).",
          "<b>Dynamic 1-bit</b>: remember the last outcome — mispredicts twice per loop (exit and re-entry).",
          "<b>Dynamic 2-bit saturating counter</b>: must be wrong twice before flipping the prediction — much better on loops.",
          "<b>BTB</b> (branch target buffer) caches target addresses so the fetch can redirect in IF. Modern CPUs use correlating/TAGE predictors with over 95% accuracy.",
          "<b>Delayed branch</b> (MIPS): the instruction after the branch always executes; the compiler fills the delay slot."
        ] },
        { tip: "Quantify it: pipeline CPI = 1 + stall cycles per instruction. E.g. 20% branches × 30% mispredicted × 3-cycle penalty = 0.18 → CPI 1.18." }
      ]
    },
    {
      id: "pipeline-speedup",
      q: "How do you calculate the speedup, throughput and efficiency of a pipeline? Give a worked example.",
      topic: "Pipelining",
      level: 2,
      top: false,
      short: "Non-pipelined time = n × (sum of stage delays); pipelined time = (k + n − 1) × cycle time, where cycle time = slowest stage + latch delay. Speedup is their ratio; it approaches k only for balanced stages, many instructions and no stalls.",
      a: [
        { table: { head: ["Quantity", "Formula"], rows: [
          ["Pipeline cycle time", "τ = max(stage delay) + latch delay"],
          ["Time for n instructions (pipelined)", "(k + n − 1) · τ"],
          ["Time for n instructions (non-pipelined)", "n · Σ stage delays (no latches)"],
          ["Speedup S", "T<sub>non-pipe</sub> / T<sub>pipe</sub>"],
          ["Ideal speedup (n → ∞, balanced)", "k"],
          ["Efficiency", "S / k"],
          ["Throughput", "n / T<sub>pipe</sub> (→ 1/τ)"],
          ["With stalls", "S = pipeline depth / (1 + stall cycles per instruction) (balanced stages)"]
        ] } },
        { h: "Worked example" },
        { p: "5 stages with delays 150, 120, 160, 140, 130 ps; latch delay 10 ps; 1000 instructions." },
        { ol: [
          "Non-pipelined: each instruction takes 150+120+160+140+130 = <b>700 ps</b> → 1000 × 700 = 700,000 ps.",
          "Cycle time τ = max(160) + 10 = <b>170 ps</b>.",
          "Pipelined: (5 + 1000 − 1) × 170 = 1004 × 170 = <b>170,680 ps</b>.",
          "Speedup = 700,000 / 170,680 ≈ <b>4.10</b> (ideal would be 5; lost to imbalance and latch overhead).",
          "Efficiency = 4.10 / 5 ≈ 82%. Throughput ≈ 1000 / 170.68 ns ≈ 5.86 billion instructions/s."
        ] },
        { p: "Add stalls: if 20% of instructions are branches with a 2-cycle penalty, CPI = 1 + 0.2 × 2 = 1.4, so speedup falls to about 700 / (1.4 × 170) ≈ 2.94." },
        { tip: "Why not make pipelines infinitely deep? Latch overhead grows as a fraction of each stage, and branch-misprediction penalties get larger — which is why Intel's 31-stage Pentium 4 was abandoned for shorter pipelines." }
      ]
    },

    /* ───────────── Memory Hierarchy & Cache ───────────── */
    {
      id: "memory-hierarchy",
      q: "What is the memory hierarchy and why is it needed?",
      topic: "Memory Hierarchy & Cache",
      level: 1,
      top: true,
      short: "The memory hierarchy arranges storage from small, fast, expensive (registers, cache) to large, slow, cheap (DRAM, SSD, disk). Thanks to locality of reference, most accesses hit the fast upper levels, giving near-register speed at near-disk cost per bit.",
      a: [
        { p: "No single technology is fast, large and cheap at once. The hierarchy combines them so that the <b>average</b> access time is close to the top level and the <b>capacity</b> and <b>cost per bit</b> are close to the bottom level." },
        { svg: `<svg viewBox="0 0 640 250" width="640" class="dg">
  <polygon class="box-a" points="220,20 300,20 340,60 180,60"/>
  <text class="tx tx-b" x="260" y="42" text-anchor="middle" dominant-baseline="middle">Registers</text>
  <polygon class="box-p" points="180,60 340,60 380,100 140,100"/>
  <text class="tx tx-b" x="260" y="82" text-anchor="middle" dominant-baseline="middle">Cache L1 / L2 / L3 (SRAM)</text>
  <polygon class="box-g" points="140,100 380,100 420,140 100,140"/>
  <text class="tx tx-b" x="260" y="122" text-anchor="middle" dominant-baseline="middle">Main memory (DRAM)</text>
  <polygon class="box-w" points="100,140 420,140 460,180 60,180"/>
  <text class="tx tx-b" x="260" y="162" text-anchor="middle" dominant-baseline="middle">SSD / Flash</text>
  <polygon class="box" points="60,180 460,180 500,220 20,220"/>
  <text class="tx tx-b" x="260" y="202" text-anchor="middle" dominant-baseline="middle">Hard disk / tape / cloud</text>
  <line class="ln-a" x1="560" y1="215" x2="560" y2="30" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="560" y="16" text-anchor="middle">faster, costlier per bit</text>
  <text class="tx-m" x="560" y="238" text-anchor="middle">bigger, cheaper, slower</text>
</svg>`, caption: "Memory hierarchy pyramid: speed and cost rise toward the top, capacity toward the bottom" },
        { table: { head: ["Level", "Typical size", "Typical latency", "Managed by"], rows: [
          ["Registers", "~1 KB", "&lt; 1 ns (0 cycles)", "Compiler"],
          ["L1 cache", "32–64 KB per core", "~1 ns (~4 cycles)", "Hardware"],
          ["L2 cache", "256 KB – 2 MB per core", "~3–5 ns", "Hardware"],
          ["L3 cache", "8–64 MB shared", "~10–20 ns", "Hardware"],
          ["DRAM", "8–128 GB", "~60–100 ns", "OS (virtual memory)"],
          ["NVMe SSD", "0.5–4 TB", "~20–100 µs", "OS / file system"],
          ["HDD", "1–20 TB", "~5–10 ms", "OS / file system"]
        ] } },
        { p: "It works because programs show <b>locality of reference</b>: they reuse recent data (temporal) and touch nearby data (spatial). Each level acts as a cache for the level below it." },
        { tip: "Quote a ratio: DRAM is ~100× slower than L1, and disk is ~100,000× slower than DRAM — that gap is why cache misses and page faults dominate performance." }
      ]
    },
    {
      id: "locality-of-reference",
      q: "What is locality of reference? Explain temporal and spatial locality.",
      topic: "Memory Hierarchy & Cache",
      level: 1,
      top: false,
      short: "Locality of reference is the tendency of programs to access a small set of addresses repeatedly. Temporal locality means recently used data is likely to be used again soon; spatial locality means data near a recently used address is likely to be used soon.",
      a: [
        { ul: [
          "<b>Temporal locality</b>: the same location is reused within a short time — loop counters, accumulators, the instructions of a loop body. Caches exploit it by <i>keeping</i> recently used blocks (LRU replacement).",
          "<b>Spatial locality</b>: nearby locations are accessed together — array traversal, sequential instructions, struct fields. Caches exploit it by fetching a whole <i>block</i> (e.g. 64 bytes) on a miss, and by prefetching."
        ] },
        { code: `#define N 4096
static int a[N][N];

long sum_row_major(void) {      // good spatial locality
    long s = 0;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            s += a[i][j];       // consecutive addresses
    return s;
}

long sum_col_major(void) {      // poor spatial locality
    long s = 0;
    for (int j = 0; j < N; j++)
        for (int i = 0; i < N; i++)
            s += a[i][j];       // jumps N*4 bytes each step
    return s;
}`, lang: "c", title: "Same sum, very different cache behaviour" },
        { p: "C stores 2-D arrays in <b>row-major</b> order, so the row-wise loop uses all 16 ints in each 64-byte cache line; the column-wise loop touches one int per line and is typically several times slower on large arrays." },
        { tip: "Link it to data structures: arrays beat linked lists in practice largely because of spatial locality, even when the Big-O is the same." }
      ]
    },
    {
      id: "ram-rom-sram-dram",
      q: "What is the difference between RAM and ROM? Between SRAM and DRAM?",
      topic: "Memory Hierarchy & Cache",
      level: 1,
      top: true,
      short: "RAM is volatile read-write working memory; ROM is non-volatile memory that is mostly read (firmware). SRAM stores a bit in a 6-transistor flip-flop — fast, no refresh, expensive, used for caches; DRAM stores a bit as charge on a 1-transistor/1-capacitor cell — dense, cheap, needs refresh, used for main memory.",
      a: [
        { h: "RAM vs ROM" },
        { table: { head: ["Aspect", "RAM", "ROM"], rows: [
          ["Volatility", "Volatile — loses data on power-off", "Non-volatile"],
          ["Access", "Read and write, fast", "Read (writes slow, rare or impossible)"],
          ["Holds", "Running programs and data", "Firmware / BIOS / UEFI / bootloader"],
          ["Types", "SRAM, DRAM (DDR4, DDR5, LPDDR)", "Mask ROM, PROM, EPROM, EEPROM, Flash"]
        ] } },
        { ul: [
          "<b>PROM</b>: programmable once (fuses). <b>EPROM</b>: erased with UV light. <b>EEPROM</b>: erased electrically, byte by byte. <b>Flash</b>: electrically erased in blocks — used in SSDs, USB drives and firmware chips."
        ] },
        { h: "SRAM vs DRAM" },
        { table: { head: ["Aspect", "SRAM (static)", "DRAM (dynamic)"], rows: [
          ["Cell", "6 transistors (cross-coupled inverters = flip-flop)", "1 transistor + 1 capacitor"],
          ["Refresh", "Not needed while powered", "Needed every ~64 ms (charge leaks)"],
          ["Speed", "Fast (~1–10 ns)", "Slower (~50–100 ns)"],
          ["Density", "Low", "High (~4–6× denser)"],
          ["Cost per bit", "High", "Low"],
          ["Power", "Low idle power, higher active", "Refresh power even when idle"],
          ["Used for", "CPU caches, register files, TLBs", "Main memory (DIMMs), GPU memory (GDDR)"]
        ] } },
        { warn: "Both SRAM and DRAM are <b>volatile</b>. <i>Static</i> means no refresh is needed, not that the data survives power loss." },
        { tip: "DRAM reads are destructive (reading drains the capacitor), so every read is followed by a write-back of the row — another reason DRAM is slower." }
      ]
    },
    {
      id: "endianness",
      q: "What is endianness? How would you detect it in C?",
      topic: "Memory Hierarchy & Cache",
      level: 2,
      top: true,
      short: "Endianness is the order in which the bytes of a multi-byte value are stored in memory. Big-endian stores the most significant byte at the lowest address; little-endian stores the least significant byte there. Detect it by storing a known integer and reading its first byte through a char pointer.",
      a: [
        { svg: `<svg viewBox="0 0 500 150" width="500" class="dg">
  <text class="tx tx-c" x="178" y="22" text-anchor="middle">0x100</text>
  <text class="tx tx-c" x="258" y="22" text-anchor="middle">0x101</text>
  <text class="tx tx-c" x="338" y="22" text-anchor="middle">0x102</text>
  <text class="tx tx-c" x="418" y="22" text-anchor="middle">0x103</text>
  <text class="tx tx-b" x="128" y="53" text-anchor="end" dominant-baseline="middle">Big-endian</text>
  <rect class="box-a" x="140" y="35" width="76" height="36" rx="6"/>
  <rect class="box" x="220" y="35" width="76" height="36" rx="6"/>
  <rect class="box" x="300" y="35" width="76" height="36" rx="6"/>
  <rect class="box" x="380" y="35" width="76" height="36" rx="6"/>
  <text class="tx tx-c" x="178" y="53" text-anchor="middle" dominant-baseline="middle">12</text>
  <text class="tx tx-c" x="258" y="53" text-anchor="middle" dominant-baseline="middle">34</text>
  <text class="tx tx-c" x="338" y="53" text-anchor="middle" dominant-baseline="middle">56</text>
  <text class="tx tx-c" x="418" y="53" text-anchor="middle" dominant-baseline="middle">78</text>
  <text class="tx tx-b" x="128" y="103" text-anchor="end" dominant-baseline="middle">Little-endian</text>
  <rect class="box-g" x="140" y="85" width="76" height="36" rx="6"/>
  <rect class="box" x="220" y="85" width="76" height="36" rx="6"/>
  <rect class="box" x="300" y="85" width="76" height="36" rx="6"/>
  <rect class="box-a" x="380" y="85" width="76" height="36" rx="6"/>
  <text class="tx tx-c" x="178" y="103" text-anchor="middle" dominant-baseline="middle">78</text>
  <text class="tx tx-c" x="258" y="103" text-anchor="middle" dominant-baseline="middle">56</text>
  <text class="tx tx-c" x="338" y="103" text-anchor="middle" dominant-baseline="middle">34</text>
  <text class="tx tx-c" x="418" y="103" text-anchor="middle" dominant-baseline="middle">12</text>
  <text class="tx-m" x="298" y="142" text-anchor="middle">storing the 32-bit value 0x12345678 at address 0x100</text>
</svg>`, caption: "The most significant byte (0x12) lands at the lowest address only on big-endian" },
        { table: { head: ["", "Big-endian", "Little-endian"], rows: [
          ["Lowest address holds", "Most significant byte", "Least significant byte"],
          ["Reads like", "The number as written", "Bytes reversed"],
          ["Used by", "Network byte order (TCP/IP headers), Java class files, older SPARC / PowerPC / Motorola 68k", "x86 / x86-64, RISC-V, ARM (bi-endian but runs little-endian in practice)"],
          ["Advantage", "Easy to read in hex dumps; sign at the first byte", "Casting a pointer to a smaller type still gives the low bits"]
        ] } },
        { code: `#include <stdio.h>
#include <stdint.h>

int main(void) {
    uint32_t x = 0x12345678;
    uint8_t *p = (uint8_t *)&x;       /* byte at the lowest address */

    if (*p == 0x78)
        printf("Little-endian\\n");
    else
        printf("Big-endian\\n");

    for (int i = 0; i < 4; i++)
        printf("addr+%d: %02x\\n", i, p[i]);
    return 0;
}`, lang: "c", title: "Detecting endianness at run time" },
        { code: `int is_little_endian(void) {
    union { uint32_t i; uint8_t c[4]; } u = { 0x01020304 };
    return u.c[0] == 0x04;            /* 1 on x86 */
}`, lang: "c", title: "Alternative: union trick" },
        { p: "Endianness only matters when bytes cross a boundary — network packets, binary files, memory-mapped hardware. Convert with <code>htonl/htons</code> (host-to-network) and <code>ntohl/ntohs</code>." },
        { warn: "Endianness is about <b>byte</b> order in memory, not bit order within a byte, and it does not affect how shifts or arithmetic behave in C — <code>x &gt;&gt; 24</code> gives 0x12 on every machine." }
      ]
    },
    {
      id: "cache-mapping",
      q: "Explain cache mapping techniques: direct, fully associative and set associative. How is the address split?",
      topic: "Memory Hierarchy & Cache",
      level: 2,
      top: true,
      short: "Direct mapping puts each memory block in exactly one cache line (index = block mod lines); fully associative lets a block go in any line; k-way set associative maps a block to one set and lets it use any of the k lines there. The address is split into tag, index (set) and block offset.",
      a: [
        { table: { head: ["", "Direct-mapped", "k-way set associative", "Fully associative"], rows: [
          ["Where can block B go?", "Line B mod (number of lines)", "Any of k lines in set B mod (number of sets)", "Any line"],
          ["Address fields", "Tag | Line index | Offset", "Tag | Set index | Offset", "Tag | Offset"],
          ["Tag comparators", "1", "k (in parallel)", "One per line"],
          ["Hit time / hardware", "Fastest, cheapest", "Moderate", "Slowest, most expensive (CAM)"],
          ["Conflict misses", "Most", "Few", "None"],
          ["Replacement policy", "None needed", "LRU / pseudo-LRU / random within set", "LRU / FIFO / random"],
          ["Typical use", "Simple caches", "L1/L2/L3 (4- to 16-way)", "TLBs, small victim caches"]
        ] } },
        { p: "Direct-mapped = 1-way set associative; fully associative = one set containing all lines. Set associative is the practical compromise." },
        { h: "Worked example" },
        { p: "32-bit byte address, <b>64 KB cache</b>, <b>64 B blocks</b>. Number of lines = 64 KB / 64 B = 1024." },
        { ol: [
          "Offset bits = log<sub>2</sub>64 = <b>6</b> (for every scheme).",
          "Direct-mapped: index = log<sub>2</sub>1024 = <b>10</b>, tag = 32 − 10 − 6 = <b>16</b>.",
          "4-way set associative: sets = 1024 / 4 = 256 → set index = <b>8</b>, tag = 32 − 8 − 6 = <b>18</b>.",
          "Fully associative: no index, tag = 32 − 6 = <b>26</b>.",
          "Total tag storage (direct-mapped) = 1024 × 16 bits = 2 KB (plus valid/dirty bits per line)."
        ] },
        { svg: `<svg viewBox="0 0 600 180" width="600" class="dg">
  <text class="tx tx-b" x="20" y="18">Direct-mapped (1024 lines)</text>
  <rect class="box" x="20" y="28" width="280" height="36" rx="6"/>
  <rect class="box-a" x="300" y="28" width="175" height="36" rx="6"/>
  <rect class="box-g" x="475" y="28" width="105" height="36" rx="6"/>
  <text class="tx tx-b" x="160" y="46" text-anchor="middle" dominant-baseline="middle">Tag (16)</text>
  <text class="tx tx-b" x="387" y="46" text-anchor="middle" dominant-baseline="middle">Line index (10)</text>
  <text class="tx tx-b" x="527" y="46" text-anchor="middle" dominant-baseline="middle">Offset (6)</text>
  <text class="tx-m" x="160" y="80" text-anchor="middle">bits 31…16</text>
  <text class="tx-m" x="387" y="80" text-anchor="middle">bits 15…6</text>
  <text class="tx-m" x="527" y="80" text-anchor="middle">bits 5…0</text>
  <text class="tx tx-b" x="20" y="108">4-way set associative (256 sets)</text>
  <rect class="box" x="20" y="118" width="315" height="36" rx="6"/>
  <rect class="box-p" x="335" y="118" width="140" height="36" rx="6"/>
  <rect class="box-g" x="475" y="118" width="105" height="36" rx="6"/>
  <text class="tx tx-b" x="177" y="136" text-anchor="middle" dominant-baseline="middle">Tag (18)</text>
  <text class="tx tx-b" x="405" y="136" text-anchor="middle" dominant-baseline="middle">Set (8)</text>
  <text class="tx tx-b" x="527" y="136" text-anchor="middle" dominant-baseline="middle">Offset (6)</text>
  <text class="tx-m" x="177" y="170" text-anchor="middle">bits 31…14</text>
  <text class="tx-m" x="405" y="170" text-anchor="middle">bits 13…6</text>
  <text class="tx-m" x="527" y="170" text-anchor="middle">bits 5…0</text>
</svg>`, caption: "Address breakdown for a 64 KB cache with 64-byte blocks and a 32-bit address" },
        { p: "<b>Lookup for address 0x00012345</b> (direct-mapped): offset = 0x05, line index = 0x08D (141), tag = 0x0001. The cache reads line 141, checks the valid bit and compares its stored tag with 0x0001: equal → hit, byte 5 of the block is returned; otherwise → miss, the block is fetched from memory into line 141." },
        { code: `addr   = 0x00012345
offset = addr & 0x3F            # low 6 bits   -> 5
index  = (addr >> 6) & 0x3FF    # next 10 bits -> 141
tag    = addr >> 16             # rest         -> 1
print(offset, index, tag)`, lang: "python", title: "Extracting the fields" },
        { tip: "Know the <b>3 Cs</b> of misses: <b>compulsory</b> (first access), <b>capacity</b> (cache too small), <b>conflict</b> (too many blocks map to the same set — reduced by higher associativity)." }
      ]
    },
    {
      id: "cache-hit-miss-amat",
      q: "What are cache hit ratio and miss penalty? How do you compute average memory access time (AMAT)?",
      topic: "Memory Hierarchy & Cache",
      level: 2,
      top: false,
      short: "Hit ratio is the fraction of accesses found in the cache; miss penalty is the extra time to fetch from the next level. AMAT = hit time + miss rate × miss penalty, applied recursively for multi-level caches.",
      a: [
        { ul: [
          "<b>Hit</b>: data found in the cache. <b>Hit ratio</b> h = hits / total accesses. <b>Miss rate</b> = 1 − h.",
          "<b>Hit time</b>: time to access the cache (including tag check).",
          "<b>Miss penalty</b>: extra time to bring the block from the next level."
        ] },
        { p: "<b>AMAT = Hit time + Miss rate × Miss penalty</b>" },
        { h: "Worked example: two-level cache" },
        { p: "L1 hit time 1 ns, L1 miss rate 5%; L2 hit time 10 ns, L2 local miss rate 20%; main memory 100 ns." },
        { ol: [
          "L1 miss penalty = AMAT of L2 = 10 + 0.20 × 100 = <b>30 ns</b>.",
          "AMAT = 1 + 0.05 × 30 = <b>2.5 ns</b>.",
          "Without L2: AMAT = 1 + 0.05 × 100 = 6 ns — L2 makes average access 2.4× faster.",
          "Global L2 miss rate = 0.05 × 0.20 = 1% of all accesses go to DRAM."
        ] },
        { h: "The two textbook formulas (common in exams)" },
        { table: { head: ["Organisation", "Formula", "h = 0.9, T<sub>c</sub> = 10 ns, T<sub>m</sub> = 100 ns"], rows: [
          ["Hierarchical (look in cache first, then memory)", "T = h·T<sub>c</sub> + (1−h)(T<sub>c</sub> + T<sub>m</sub>) = T<sub>c</sub> + (1−h)T<sub>m</sub>", "10 + 0.1 × 100 = <b>20 ns</b>"],
          ["Simultaneous (cache and memory accessed in parallel)", "T = h·T<sub>c</sub> + (1−h)·T<sub>m</sub>", "9 + 10 = <b>19 ns</b>"]
        ] } },
        { h: "Effect on CPI" },
        { p: "Effective CPI = base CPI + (memory accesses per instruction × miss rate × miss penalty in cycles). With base CPI 1, 1.3 accesses/instr, 2% miss rate and 100-cycle penalty: 1 + 1.3 × 0.02 × 100 = <b>3.6</b> — the CPU spends most of its time waiting on memory." },
        { tip: "Always ask (or state) which model the question assumes — hierarchical vs simultaneous changes the answer." }
      ]
    },
    {
      id: "write-through-vs-write-back",
      q: "What is the difference between write-through and write-back caches?",
      topic: "Memory Hierarchy & Cache",
      level: 2,
      top: false,
      short: "Write-through updates both the cache and main memory on every write, keeping memory always consistent but generating heavy traffic. Write-back updates only the cache and marks the line dirty; memory is updated when the dirty line is evicted, saving bandwidth at the cost of complexity.",
      a: [
        { table: { head: ["Aspect", "Write-through", "Write-back"], rows: [
          ["On a write hit", "Write cache <b>and</b> memory", "Write cache only; set <b>dirty bit</b>"],
          ["Memory consistency", "Always up to date", "Stale until the dirty line is evicted"],
          ["Memory traffic", "High (every store)", "Low (only on eviction of dirty lines)"],
          ["Eviction cost", "Just discard", "Must write the dirty block back first"],
          ["Complexity", "Simple; usually paired with a write buffer", "Needs dirty bits and write-back logic"],
          ["Crash / coherence", "Easier recovery and I/O coherence", "Data only in cache can be lost; needs coherence protocol"],
          ["Typical use", "Some L1 caches, embedded systems", "Most L2/L3 and modern L1 data caches"]
        ] } },
        { h: "On a write miss" },
        { ul: [
          "<b>Write-allocate</b> (fetch on write): load the block into the cache, then write it. Usually paired with write-back.",
          "<b>No-write-allocate</b> (write around): write directly to memory without loading the block. Usually paired with write-through."
        ] },
        { p: "A <b>write buffer</b> lets write-through caches avoid stalling: stores are queued and drained to memory in the background." },
        { tip: "In multicore systems, write-back caches rely on coherence protocols such as <b>MESI</b> (Modified, Exclusive, Shared, Invalid) so other cores never read a stale copy." }
      ]
    },
    {
      id: "virtual-memory-tlb",
      q: "What is virtual memory and what does the TLB do?",
      topic: "Memory Hierarchy & Cache",
      level: 3,
      top: false,
      short: "Virtual memory gives each process its own large address space, mapped to physical frames through page tables, with pages brought from disk on demand. The TLB is a small, fast cache of recent virtual-to-physical page translations so most accesses avoid walking the page table.",
      a: [
        { p: "A virtual address is split into <b>virtual page number (VPN)</b> and <b>page offset</b>. The page table maps VPN → physical frame number; the offset is copied unchanged. If the page is not in RAM, a <b>page fault</b> traps to the OS, which loads it from disk." },
        { svg: `<svg viewBox="0 0 620 175" width="620" class="dg">
  <rect class="box" x="10" y="30" width="90" height="44" rx="6"/>
  <text class="tx tx-b" x="55" y="52" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <line class="ln" x1="100" y1="52" x2="148" y2="52" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="124" y="44" text-anchor="middle">VA</text>
  <rect class="box-a" x="150" y="30" width="110" height="44" rx="6"/>
  <text class="tx tx-b" x="205" y="52" text-anchor="middle" dominant-baseline="middle">TLB</text>
  <line class="ln-a" x1="260" y1="52" x2="358" y2="52" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="309" y="44" text-anchor="middle">hit: PA</text>
  <rect class="box-g" x="360" y="30" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="425" y="52" text-anchor="middle" dominant-baseline="middle">Cache / RAM</text>
  <line class="ln" x1="205" y1="74" x2="205" y2="108" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="222" y="95" text-anchor="middle">miss</text>
  <rect class="box-w" x="150" y="110" width="110" height="44" rx="6"/>
  <text class="tx tx-b" x="205" y="132" text-anchor="middle" dominant-baseline="middle">Page table walk</text>
  <line class="ln" x1="260" y1="120" x2="385" y2="76" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="345" y="112" text-anchor="middle">PA, TLB refilled</text>
  <line class="ln ln-d" x1="260" y1="145" x2="478" y2="145" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="370" y="165" text-anchor="middle">page not in RAM: page fault</text>
  <rect class="box-r" x="480" y="125" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="540" y="145" text-anchor="middle" dominant-baseline="middle">Disk (swap)</text>
</svg>`, caption: "Address translation: TLB hit is the fast path; a miss walks the page table; a missing page faults to the OS" },
        { h: "Worked numbers" },
        { ul: [
          "32-bit virtual address, 4 KB pages → offset = 12 bits, VPN = 20 bits → 2<sup>20</sup> page-table entries. At 4 bytes each, that's a <b>4 MB</b> table per process — which is why real systems use <b>multi-level page tables</b> (x86-64 uses 4 or 5 levels).",
          "Effective access time with TLB: EAT = h(t + m) + (1 − h)(t + 2m) for a single-level table. With TLB time t = 10 ns, memory m = 100 ns, TLB hit ratio h = 0.9: 0.9 × 110 + 0.1 × 210 = <b>120 ns</b>."
        ] },
        { p: "Benefits: isolation and protection between processes, programs larger than RAM, simpler linking/loading (every program starts at the same virtual address), and sharing (shared libraries, copy-on-write fork)." },
        { tip: "TLBs are small (tens to a few thousand entries) and usually fully or highly associative. On a context switch they are flushed or tagged with an ASID/PCID." }
      ]
    },

    /* ───────────── I/O & Buses ───────────── */
    {
      id: "system-buses",
      q: "What are the address bus, data bus and control bus?",
      topic: "I/O & Buses",
      level: 1,
      top: false,
      short: "The system bus has three parts: the address bus (unidirectional, CPU sends the location; its width fixes how much memory is addressable), the data bus (bidirectional, carries the actual data; its width sets how much moves per transfer) and the control bus (read/write, clock, interrupt, bus request/grant signals).",
      a: [
        { svg: `<svg viewBox="0 0 600 200" width="600" class="dg">
  <rect class="box-a" x="20" y="20" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="90" y="42" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <rect class="box-g" x="200" y="20" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="270" y="42" text-anchor="middle" dominant-baseline="middle">Memory</text>
  <rect class="box-p" x="380" y="20" width="140" height="44" rx="6"/>
  <text class="tx tx-b" x="450" y="42" text-anchor="middle" dominant-baseline="middle">I/O interface</text>
  <line class="ln" x1="90" y1="64" x2="90" y2="170"/>
  <line class="ln" x1="270" y1="64" x2="270" y2="170"/>
  <line class="ln" x1="450" y1="64" x2="450" y2="170"/>
  <line class="ln-a" x1="20" y1="110" x2="530" y2="110" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="20" y1="140" x2="530" y2="140"/>
  <line class="ln ln-d" x1="20" y1="170" x2="530" y2="170"/>
  <text class="tx-a" x="540" y="110" dominant-baseline="middle">Address</text>
  <text class="tx" x="540" y="140" dominant-baseline="middle">Data</text>
  <text class="tx-m" x="540" y="170" dominant-baseline="middle">Control</text>
  <text class="tx-m" x="300" y="192" text-anchor="middle">address: CPU → others · data: both ways · control: mixed</text>
</svg>`, caption: "A single shared system bus made of three groups of lines" },
        { table: { head: ["Bus", "Direction", "Carries", "Width determines"], rows: [
          ["Address", "Unidirectional (CPU/DMA → memory, I/O)", "Location to read or write", "Addressable space: n lines → 2<sup>n</sup> locations"],
          ["Data", "Bidirectional", "The data / instruction itself", "Bits moved per transfer (word size)"],
          ["Control", "Individual lines in both directions", "RD, WR, clock, IRQ/INTA, bus request/grant, reset, ready/wait", "—"]
        ] } },
        { ul: [
          "8086: 20-bit address bus → 2<sup>20</sup> = 1 MB; 16-bit data bus.",
          "32-bit address bus → 4 GB addressable (the classic 32-bit OS RAM limit).",
          "<b>Bus bandwidth</b> = width × transfer rate, e.g. 64-bit × 3200 MT/s = 25.6 GB/s (one DDR4-3200 channel)."
        ] },
        { p: "When several masters (CPU, DMA controller) share a bus, <b>bus arbitration</b> decides who drives it — centralised (daisy chain, parallel/priority) or distributed. Modern systems replace shared parallel buses with point-to-point serial links (PCIe, QPI/UPI, Infinity Fabric)." },
        { tip: "A one-line differentiator: address bus says <i>where</i>, data bus says <i>what</i>, control bus says <i>how and when</i>." }
      ]
    },
    {
      id: "interrupts",
      q: "What is an interrupt? How does the CPU handle it?",
      topic: "I/O & Buses",
      level: 1,
      top: true,
      short: "An interrupt is a signal that makes the CPU suspend its current program, save its state, run an interrupt service routine (ISR) for the event, and then resume. It lets devices get attention without the CPU constantly polling them.",
      a: [
        { h: "Types" },
        { table: { head: ["Type", "Source", "Examples"], rows: [
          ["Hardware (external)", "Device raises an IRQ line", "Keyboard, timer, NIC packet arrival, disk done"],
          ["Software", "Executed instruction", "<code>INT 0x80</code>, <code>syscall</code>, <code>SVC</code> — system calls"],
          ["Exceptions (internal)", "Error or condition during execution", "<b>Fault</b> (page fault — retried), <b>trap</b> (breakpoint — continues after), <b>abort</b> (machine check — fatal)"],
          ["Maskable vs NMI", "—", "Maskable can be disabled with the interrupt flag; non-maskable (power failure, watchdog) cannot"]
        ] } },
        { h: "Handling sequence" },
        { ol: [
          "Device asserts an interrupt request (IRQ).",
          "CPU finishes the <b>current instruction</b>, then checks for pending, enabled interrupts.",
          "CPU acknowledges and saves context: PC and flags (PSW) pushed on the stack; further interrupts may be disabled.",
          "CPU finds the ISR address — <b>vectored</b> (device supplies a vector number, looked up in the interrupt vector table / IDT) or <b>non-vectored</b> (fixed address, software polls devices).",
          "ISR runs: saves registers it uses, services the device, clears the request.",
          "Return-from-interrupt (<code>IRET</code>/<code>RETI</code>) restores PC and flags; the interrupted program resumes as if nothing happened."
        ] },
        { p: "<b>Priority</b>: when several devices interrupt at once, a priority scheme (daisy chain, priority encoder, PIC/APIC) picks one; higher-priority interrupts may nest inside lower-priority ISRs." },
        { tip: "Mention <b>interrupt latency</b> (time from request to ISR start) and why ISRs should be short — do the minimum, defer the rest (Linux top-half / bottom-half, softirqs)." },
        { warn: "An interrupt is <b>not</b> serviced mid-instruction in a simple CPU — it waits for the current instruction to complete (page faults are the exception: the faulting instruction is restarted)." }
      ]
    },
    {
      id: "io-techniques",
      q: "Compare programmed I/O, interrupt-driven I/O and DMA.",
      topic: "I/O & Buses",
      level: 2,
      top: false,
      short: "In programmed I/O the CPU busy-waits polling the device and moves every word itself. In interrupt-driven I/O the device interrupts when ready, but the CPU still moves each word. With DMA a controller moves the whole block directly between device and memory and interrupts the CPU once at the end.",
      a: [
        { table: { head: ["Aspect", "Programmed I/O (polling)", "Interrupt-driven I/O", "DMA"], rows: [
          ["Who checks readiness", "CPU, in a busy loop", "Device interrupts the CPU", "DMA controller handshakes with device"],
          ["Who moves data", "CPU, every word", "CPU (inside the ISR), every word", "DMA controller, whole block"],
          ["CPU interruptions", "None, but CPU is fully occupied", "One per word/byte", "One per block"],
          ["CPU efficiency", "Worst — cycles wasted waiting", "Better — no waiting, but ISR overhead per word", "Best — CPU free during transfer"],
          ["Hardware cost", "Lowest", "Interrupt controller", "DMA controller"],
          ["Best for", "Very fast or very simple devices; tight embedded loops", "Slow, low-volume devices (keyboard, mouse)", "Bulk transfers (disk, NIC, GPU, audio)"]
        ] } },
        { code: `#define STATUS (*(volatile unsigned int *)0x40001000)
#define DATA   (*(volatile unsigned int *)0x40001004)
#define TX_READY 0x1u

void uart_send(const char *s) {
    while (*s) {
        while (!(STATUS & TX_READY))   /* busy-wait: CPU does nothing useful */
            ;
        DATA = (unsigned char)*s++;    /* CPU moves each byte itself */
    }
}`, lang: "c", title: "Programmed I/O: polling a memory-mapped UART" },
        { p: "Devices are reached either through <b>memory-mapped I/O</b> (device registers occupy memory addresses; normal load/store instructions — ARM, RISC-V) or <b>isolated / port-mapped I/O</b> (separate address space with special <code>IN</code>/<code>OUT</code> instructions — x86)." },
        { tip: "Note the <code>volatile</code>: without it the compiler may read STATUS once and loop forever. Interviewers for embedded roles love this detail." }
      ]
    },
    {
      id: "dma",
      q: "What is DMA (Direct Memory Access) and how does it work?",
      topic: "I/O & Buses",
      level: 2,
      top: true,
      short: "DMA lets a DMA controller transfer a block of data directly between an I/O device and memory without the CPU copying each word. The CPU only programs the transfer (address, count, direction) and gets one interrupt when it completes.",
      a: [
        { svg: `<svg viewBox="0 0 620 210" width="620" class="dg">
  <rect class="box-a" x="20" y="40" width="120" height="50" rx="6"/>
  <text class="tx tx-b" x="80" y="65" text-anchor="middle" dominant-baseline="middle">CPU</text>
  <rect class="box-p" x="250" y="40" width="130" height="50" rx="6"/>
  <text class="tx tx-b" x="315" y="65" text-anchor="middle" dominant-baseline="middle">DMA controller</text>
  <rect class="box-w" x="480" y="40" width="120" height="50" rx="6"/>
  <text class="tx tx-b" x="540" y="65" text-anchor="middle" dominant-baseline="middle">I/O device</text>
  <rect class="box-g" x="250" y="150" width="130" height="44" rx="6"/>
  <text class="tx tx-b" x="315" y="172" text-anchor="middle" dominant-baseline="middle">Main memory</text>
  <line class="ln" x1="140" y1="52" x2="248" y2="52" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="195" y="34" text-anchor="middle">1 setup · 3 grant</text>
  <line class="ln" x1="250" y1="78" x2="142" y2="78" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="195" y="104" text-anchor="middle">2 bus request · 5 done IRQ</text>
  <line class="ln" x1="480" y1="65" x2="382" y2="65" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="430" y="57" text-anchor="middle">DMA request</text>
  <line class="ln" x1="315" y1="90" x2="315" y2="148" marker-end="url(#dg-arr)"/>
  <text class="tx-m" x="322" y="125">address, R/W</text>
  <line class="ln-a" x1="540" y1="90" x2="382" y2="165" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="470" y="160">4 data, CPU bypassed</text>
</svg>`, caption: "DMA: the CPU only sets up the transfer and handles the completion interrupt" },
        { ol: [
          "<b>Setup</b>: CPU writes the DMA controller's registers — memory address, byte count, direction (read/write), device.",
          "<b>Bus request</b>: when the device is ready, the DMAC asserts Bus Request (HOLD on 8085/8086).",
          "<b>Bus grant</b>: CPU finishes its current bus cycle, releases the buses and asserts Bus Grant (HLDA).",
          "<b>Transfer</b>: DMAC drives addresses and moves data between device and memory, incrementing the address and decrementing the count.",
          "<b>Completion</b>: when the count reaches zero the DMAC releases the bus and interrupts the CPU."
        ] },
        { table: { head: ["DMA mode", "How", "Effect"], rows: [
          ["Burst (block)", "DMAC holds the bus until the whole block is done", "Fastest transfer; CPU locked out of memory meanwhile"],
          ["Cycle stealing", "DMAC takes the bus for one word at a time", "CPU slowed slightly but keeps running"],
          ["Transparent", "DMAC uses the bus only when the CPU isn't using it", "No CPU slowdown; slowest transfer"]
        ] } },
        { p: "Modern systems use <b>bus-mastering DMA</b>: devices such as NVMe SSDs, NICs and GPUs contain their own DMA engines and write to memory over PCIe; an <b>IOMMU</b> translates and restricts the addresses they may touch." },
        { warn: "DMA and caches can disagree: the device writes RAM while the CPU holds a stale cached copy. Hardware snooping or explicit cache flush/invalidate by the driver keeps them coherent." }
      ]
    },

    /* ───────────── Parallelism ───────────── */
    {
      id: "flynn-taxonomy",
      q: "Explain Flynn's taxonomy (SISD, SIMD, MISD, MIMD).",
      topic: "Parallelism",
      level: 1,
      top: false,
      short: "Flynn's taxonomy classifies computers by the number of instruction streams and data streams: SISD (one of each — classic uniprocessor), SIMD (one instruction on many data — vector units, GPUs), MISD (many instructions on one data — rare, fault-tolerant systems) and MIMD (many of each — multicore CPUs and clusters).",
      a: [
        { table: { head: ["Class", "Instruction streams", "Data streams", "Examples"], rows: [
          ["<b>SISD</b>", "1", "1", "Classic single-core, non-vector CPU (von Neumann machine)"],
          ["<b>SIMD</b>", "1", "Many", "x86 SSE/AVX, ARM NEON, vector processors (Cray), GPU warps (SIMT)"],
          ["<b>MISD</b>", "Many", "1", "Rare: redundant flight-control computers checking each other; sometimes systolic arrays"],
          ["<b>MIMD</b>", "Many", "Many", "Multicore CPUs, multiprocessor servers, clusters, distributed systems"]
        ] } },
        { code: `#include <immintrin.h>
/* SIMD: one AVX instruction adds 8 floats at once */
void add8(const float *a, const float *b, float *c) {
    __m256 va = _mm256_loadu_ps(a);
    __m256 vb = _mm256_loadu_ps(b);
    _mm256_storeu_ps(c, _mm256_add_ps(va, vb));
}`, lang: "c", title: "SIMD in practice (compile with -mavx)" },
        { p: "MIMD is further split into <b>shared memory</b> (SMP/multicore — threads share one address space; UMA or NUMA) and <b>distributed memory</b> (clusters — nodes communicate by message passing, e.g. MPI)." },
        { tip: "GPUs are usually called <b>SIMT</b> (single instruction, multiple threads) — SIMD execution with a per-thread programming model." }
      ]
    },
    {
      id: "multicore-vs-hyperthreading",
      q: "What is the difference between multicore processors and hyper-threading (SMT)?",
      topic: "Parallelism",
      level: 2,
      top: false,
      short: "A multicore processor has several complete, independent cores on one chip, each with its own execution units. Hyper-threading (simultaneous multithreading) makes one physical core appear as two logical cores by duplicating only the architectural state, so two threads share the same execution units and fill each other's idle slots.",
      a: [
        { table: { head: ["Aspect", "Multicore", "Hyper-threading / SMT"], rows: [
          ["What is duplicated", "Entire core: ALUs, FPUs, pipeline, L1/L2 caches", "Only architectural state: registers, PC, some buffers"],
          ["Shared", "L3 cache, memory controller", "Execution units, caches, TLB, branch predictor"],
          ["True parallelism", "Yes — N cores run N threads fully in parallel", "Partial — threads compete for the same units"],
          ["Typical gain", "Up to ~N× for parallel workloads", "~15–30% throughput on one core"],
          ["Helps when", "Work is parallel and compute-bound", "One thread stalls (cache miss, branch mispredict) and leaves units idle"],
          ["Cost", "Much more silicon and power", "~5% extra die area"]
        ] } },
        { p: "An \"8-core / 16-thread\" CPU has 8 physical cores, each running 2 hardware threads via SMT; the OS sees 16 logical processors and schedules threads onto them." },
        { warn: "Two logical cores on the same physical core are <b>not</b> two cores — a compute-heavy thread pair may see almost no speedup. SMT can also leak data between threads through shared caches (side-channel attacks), so some security-sensitive systems disable it." },
        { tip: "Contrast with <b>temporal multithreading</b> (coarse/fine-grained: switch threads on a stall or every cycle) — SMT issues instructions from multiple threads in the <i>same</i> cycle." }
      ]
    },
    {
      id: "amdahls-law",
      q: "What is Amdahl's law? Solve an example.",
      topic: "Parallelism",
      level: 2,
      top: false,
      short: "Amdahl's law gives the maximum overall speedup when only part of a program is improved: Speedup = 1 / ((1 − P) + P/N), where P is the fraction that benefits and N is the speedup of that part. The serial fraction caps the speedup at 1/(1 − P) no matter how large N gets.",
      a: [
        { p: "<b>Speedup = 1 / ((1 − P) + P / N)</b>, where P = parallelisable (or enhanced) fraction of execution time and N = number of processors (or speedup of that fraction)." },
        { h: "Example 1: parallelising" },
        { ol: [
          "90% of a program is parallel (P = 0.9), run on 8 cores (N = 8).",
          "Speedup = 1 / (0.1 + 0.9/8) = 1 / (0.1 + 0.1125) = 1 / 0.2125 ≈ <b>4.71</b> — not 8.",
          "With infinite cores: 1 / 0.1 = <b>10×</b> maximum. The 10% serial part dominates."
        ] },
        { h: "Example 2: enhancing one unit" },
        { p: "A new FPU makes floating-point operations 10× faster; FP work is 40% of run time. Speedup = 1 / (0.6 + 0.4/10) = 1 / 0.64 ≈ <b>1.56</b>." },
        { code: `def amdahl(p, n):
    return 1 / ((1 - p) + p / n)

for n in (2, 4, 8, 16, 1024):
    print(n, round(amdahl(0.9, n), 2))
# 2 1.82 | 4 3.08 | 8 4.71 | 16 6.4 | 1024 9.91`, lang: "python", title: "Diminishing returns with more cores" },
        { p: "<b>Gustafson's law</b> is the optimistic counterpart: if the problem size grows with the number of processors, scaled speedup = (1 − P) + P·N, which keeps growing — the reason large parallel machines are still useful." },
        { tip: "Takeaway interviewers want: <i>optimise the common case, and the serial part becomes the bottleneck</i>." }
      ]
    },
    {
      id: "gpu-vs-cpu",
      q: "How does a GPU differ from a CPU?",
      topic: "Parallelism",
      level: 2,
      top: false,
      short: "A CPU has a few powerful cores optimised for low latency on sequential, branchy code (large caches, branch prediction, out-of-order execution). A GPU has thousands of simple cores optimised for throughput on data-parallel work, hiding memory latency by switching between many threads.",
      a: [
        { table: { head: ["Aspect", "CPU", "GPU"], rows: [
          ["Design goal", "Latency — finish one task fast", "Throughput — finish many tasks per second"],
          ["Cores", "Few (4–64) complex cores", "Thousands of simple ALUs grouped into SMs / CUs"],
          ["Control logic", "Heavy: out-of-order, speculation, branch prediction", "Light: in-order, threads run in lockstep groups (warps of 32)"],
          ["Caches", "Large (MBs per core of L2/L3)", "Small per core; relies on massive threading to hide latency"],
          ["Memory bandwidth", "~50–100 GB/s (DDR5)", "~1–3+ TB/s (GDDR6X / HBM)"],
          ["Branches", "Handled well", "Divergence within a warp serialises both paths"],
          ["Programming", "Any general code, OS, I/O", "Kernels via CUDA, OpenCL, Vulkan/DirectX compute"],
          ["Best at", "Operating systems, databases, compilers, game logic", "Graphics, matrix math, deep learning, simulations, video encoding"]
        ] } },
        { p: "A GPU runs the <b>same kernel</b> on many data elements (SIMT). When one warp stalls on memory, the scheduler instantly switches to another ready warp — latency is hidden rather than avoided." },
        { warn: "A GPU is not simply a faster CPU: serial or branch-heavy code, or small data with high PCIe transfer overhead, often runs slower on the GPU." },
        { tip: "Tie it back to Amdahl's law: offloading to a GPU only speeds up the parallel fraction — data transfer and serial setup remain." }
      ]
    }
  ]
});
