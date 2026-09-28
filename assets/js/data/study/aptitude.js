/* study: Aptitude — quant, reasoning, verbal and puzzle lessons for the 60-day plan */
(function () {
  var ST = window.STUDY = window.STUDY || { lessons: {}, blocks: {} };
  function add(l) { ST.lessons[l.id] = l; }
  function map(blockId, ids) { (ST.blocks[blockId] = ST.blocks[blockId] || []).push.apply(ST.blocks[blockId], ids); }
  // worked example: bold question, then one step per line
  function ex(q, steps) { return { p: "<b>" + q + "</b><br>" + steps.join("<br>") }; }

  /* ───────────────────────── Percentages ───────────────────────── */
  add({
    id: "apt-percentages",
    subject: "aptitude",
    title: "Percentages — fractions, successive change, votes & marks",
    minutes: 30,
    crux: [
      "Think in <b>multiplying factors</b>: +20% → ×1.2, −15% → ×0.85. Chains of changes just multiply.",
      "Successive changes a% then b%: net = <b>a + b + ab/100</b> (use negative sign for a decrease). +20 then −20 → −4%.",
      "If A is r% more than B, then B is <b>r/(100+r) × 100%</b> less than A. (25% more ⇒ 20% less.)",
      "Price up r% ⇒ cut consumption by <b>r/(100+r) × 100%</b> to keep spending the same.",
      "Memorise fraction ↔ % : 1/6 = 16.67, 1/7 ≈ 14.29, 1/8 = 12.5, 1/9 ≈ 11.11, 1/11 ≈ 9.09, 1/12 = 8.33, 1/16 = 6.25.",
      "x% of y = y% of x (8% of 50 = 50% of 8 = 4)."
    ],
    sections: [
      { h: "The one idea: percent = per hundred", blocks: [
        { p: "r% of N = N × r/100. Percentage change is always measured on the <b>original</b> (base) value: change% = (new − old)/old × 100." },
        { p: "Instead of adding and subtracting percentages, convert every change to a <b>multiplying factor</b>. A 10% rise followed by a 10% fall is ×1.1 × 0.9 = ×0.99, i.e. a 1% net fall — not zero." },
        { table: { head: ["Fraction", "%", "Fraction", "%"], rows: [
          ["1/2", "50", "1/9", "11.11"], ["1/3", "33.33", "1/11", "9.09"], ["1/4", "25", "1/12", "8.33"],
          ["1/5", "20", "1/15", "6.67"], ["1/6", "16.67", "1/16", "6.25"], ["1/7", "14.29", "1/20", "5"],
          ["1/8", "12.5", "3/8", "37.5"]
        ] } },
        { tip: "Convert awkward percentages to fractions before multiplying: 37.5% of 480 = 3/8 × 480 = 180 — no long multiplication." }
      ] },
      { h: "Formula sheet", blocks: [
        { table: { head: ["Situation", "Formula"], rows: [
          ["Successive change a%, b%", "a + b + ab/100"],
          ["A is r% more than B → B less than A by", "r/(100 + r) × 100"],
          ["A is r% less than B → B more than A by", "r/(100 − r) × 100"],
          ["Price ↑ r%, keep expense same → consumption ↓", "r/(100 + r) × 100"],
          ["Population / value growing r% a year for n years", "P(1 + r/100)ⁿ"],
          ["Value falling r% a year (depreciation)", "P(1 − r/100)ⁿ"],
          ["Pass mark p%, student gets m and fails by f", "Max = (m + f) × 100/p"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. What is 37.5% of 480?", ["37.5% = 3/8.", "3/8 × 480 = 180. <b>Answer: 180</b>"]),
        ex("Ex 2. A's salary is 25% more than B's. By what % is B's salary less than A's?", ["Let B = 100, A = 125.", "B is 25 less than 125 → 25/125 = 20%. <b>Answer: 20%</b>"]),
        ex("Ex 3. A price rises 20% and then falls 20%. Net change?", ["20 + (−20) + (20 × −20)/100 = −4.", "<b>Answer: 4% decrease</b> (check: 100 → 120 → 96)."]),
        ex("Ex 4. Sugar becomes 25% dearer. By how much must a family cut consumption so the bill is unchanged?", ["25/(100 + 25) × 100 = 20%.", "Check: price ×1.25, quantity ×0.8 → spend ×1.00. <b>Answer: 20%</b>"]),
        ex("Ex 5. A student needs 40% to pass. He scores 178 and fails by 22 marks. Maximum marks?", ["Pass mark = 178 + 22 = 200 = 40% of max.", "Max = 200 × 100/40 = 500. <b>Answer: 500</b>"]),
        ex("Ex 6. A town of 10,000 grows 10%, then shrinks 10%, then grows 20% in three years. Population now?", ["10,000 × 1.1 × 0.9 × 1.2 = 10,000 × 1.188.", "<b>Answer: 11,880</b>"]),
        ex("Ex 7. In an election between two candidates, 20% of votes were invalid. The winner got 58% of the valid votes and won by 1,120 votes. Total votes cast?", ["Margin = 58% − 42% = 16% of valid votes = 1,120 → valid = 7,000.", "Valid = 80% of total → total = 7,000/0.8 = 8,750.", "Check: 4,060 − 2,940 = 1,120 ✓. <b>Answer: 8,750</b>"]),
        ex("Ex 8. Ram spends 75% of his income. His income rises 20% and his spending rises 10%. By what % do his savings change?", ["Income 100 → spend 75, save 25.", "New income 120, new spend 82.5, new saving 37.5.", "Change = 12.5/25 = 50%. <b>Answer: savings rise 50%</b>"])
      ] },
      { h: "Speed tricks & traps", blocks: [
        { ul: [
          "Always assume a base of <b>100</b> when no actual value is given — every percentage becomes a plain number.",
          "Work backwards with factors: final 9,900 after +10% then −10% → original = 9,900/0.99 = 10,000.",
          "For ‘what % of the <i>total</i>’ questions in elections, first convert to valid votes, then to total.",
          "Two overlapping failure rates (failed Maths, failed English, failed both) → use n(A∪B) = A + B − both."
        ] },
        { warn: "‘Increase by 50%’ ≠ ‘increase to 50%’. And a rise of r% followed by a fall of r% is never back to start — it is always a net loss of r²/100 %." }
      ] }
    ],
    practice: [
      { q: "Find 12.5% of 64 + 16.67% of 42.", a: "1/8 × 64 = 8 and 1/6 × 42 = 7 → <b>15</b>." },
      { q: "A number is increased by 10% and then decreased by 10%; the result is 9,900. Find the number.", a: "Net factor 1.1 × 0.9 = 0.99 → number = 9,900/0.99 = <b>10,000</b>." },
      { q: "In an exam, 35% failed in Maths, 25% in English and 10% in both. What % passed both?", a: "Failed at least one = 35 + 25 − 10 = 50% → passed both = <b>50%</b>." },
      { q: "Petrol price rises 30%. By what % must consumption fall to keep expenditure constant?", a: "30/130 × 100 = <b>23.08%</b> (exactly 3/13)." },
      { q: "A salary is raised 20% and then 15%. Net raise?", a: "20 + 15 + (20 × 15)/100 = <b>38%</b> (check 1.2 × 1.15 = 1.38)." },
      { q: "A's income is 20% less than B's. By what % is B's income more than A's?", a: "B = 100, A = 80 → 20/80 = <b>25%</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Ratio & Proportion ───────────────────────── */
  add({
    id: "apt-ratio-proportion",
    subject: "aptitude",
    title: "Ratio & Proportion — combining ratios, partnership, ages",
    minutes: 30,
    crux: [
      "To chain A:B and B:C, make the common term equal (multiply by LCM): 2:3 and 4:5 → 8:12:15.",
      "Split N in ratio a:b:c → shares Na/(a+b+c), Nb/(a+b+c), Nc/(a+b+c).",
      "a:b = c:d ⇔ ad = bc. Fourth proportional of a, b, c = bc/a; third proportional of a, b = b²/a; mean proportional = √(ab).",
      "Partnership: profit ∝ <b>capital × time</b>.",
      "Ages / coins / mixtures: write one variable k for the ratio (4k, 5k) and form one equation from the extra fact.",
      "Adding water to milk: the <b>milk quantity stays fixed</b> — anchor on it."
    ],
    sections: [
      { h: "Concepts", blocks: [
        { p: "A ratio a:b compares two quantities of the same kind; multiplying both terms by the same number does not change it. A <b>proportion</b> says two ratios are equal: a:b :: c:d means a/b = c/d, so ad = bc (product of extremes = product of means)." },
        { p: "When a problem gives a ratio, immediately write the quantities as <b>ak</b> and <b>bk</b>. Every extra piece of information becomes one linear equation in k." }
      ] },
      { h: "Formula table", blocks: [
        { table: { head: ["Need", "Formula"], rows: [
          ["Combine A:B = a:b and B:C = c:d", "A:B:C = ac : bc : bd"],
          ["Fourth proportional to a, b, c", "x = bc/a"],
          ["Third proportional to a, b", "x = b²/a"],
          ["Mean proportional of a, b", "√(ab)"],
          ["Number x added to both terms of a:b gives c:d", "x = (bc − ad)/(d − c)"],
          ["Partnership shares", "C₁T₁ : C₂T₂ : C₃T₃"],
          ["Coins: counts in ratio p:q:r, denominations d₁, d₂, d₃", "value ratio = pd₁ : qd₂ : rd₃"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. A:B = 2:3 and B:C = 4:5. Find A:B:C.", ["Make B common: LCM(3, 4) = 12 → A:B = 8:12, B:C = 12:15.", "<b>Answer: 8:12:15</b>"]),
        ex("Ex 2. Divide ₹1,540 among A, B, C in the ratio 2:3:6.", ["Sum of parts = 11 → one part = 140.", "<b>A = 280, B = 420, C = 840</b>"]),
        ex("Ex 3. Mean proportional of 9 and 16; third proportional to 4 and 6; fourth proportional to 2, 3, 8.", ["√(9 × 16) = 12.", "6²/4 = 9.", "3 × 8/2 = 12. <b>Answers: 12, 9, 12</b>"]),
        ex("Ex 4. Two numbers are in the ratio 3:5. If 10 is added to each, the ratio becomes 5:7. Find the numbers.", ["(3k + 10)/(5k + 10) = 5/7 → 21k + 70 = 25k + 50 → k = 5.", "<b>Answer: 15 and 25</b> (check 25/35 = 5/7 ✓)"]),
        ex("Ex 5. The ages of A and B are in ratio 4:5. Six years ago they were in ratio 3:4. Present ages?", ["(4k − 6)/(5k − 6) = 3/4 → 16k − 24 = 15k − 18 → k = 6.", "<b>Answer: 24 and 30</b> (6 years ago 18:24 = 3:4 ✓)"]),
        ex("Ex 6. A starts a business with ₹20,000. After 5 months B joins with ₹30,000. Year-end profit ₹30,000. Shares?", ["A: 20,000 × 12 = 2,40,000. B: 30,000 × 7 = 2,10,000.", "Ratio 240:210 = 8:7 → one part = 30,000/15 = 2,000.", "<b>A = ₹16,000, B = ₹14,000</b>"]),
        ex("Ex 7. A bag has ₹1, 50p and 25p coins in the ratio 5:6:8, worth ₹210 in all. How many of each?", ["Value ratio = 5 × 1 : 6 × 0.5 : 8 × 0.25 = 5 : 3 : 2 → 10 parts = ₹210 → part = 21.", "₹1 coins = 105, 50p coins = 126, 25p coins = 168.", "Check: 105 + 63 + 42 = 210 ✓"]),
        ex("Ex 8. 60 L of a mixture has milk:water = 2:1. How much water must be added to make it 1:2?", ["Milk = 40 L (fixed), water = 20 L.", "Need water = 2 × 40 = 80 L → add <b>60 L</b>."])
      ] },
      { h: "Tricks & traps", blocks: [
        { ul: [
          "Plug options: in ratio questions, the answer must split in the given ratio — reject options that do not.",
          "‘A:B = 2:3’ does NOT mean A = 2; it means A = 2k.",
          "For partnership, a partner who withdraws money mid-year contributes capital × months <i>for each period separately</i>."
        ] },
        { warn: "When a ratio changes after adding/removing something, only the changed component moves — do not scale the whole mixture." }
      ] }
    ],
    practice: [
      { q: "A:B = 3:4, B:C = 6:7, C:D = 14:15. Find A:B:C:D.", a: "A:B:C with B = 12: 9:12:14. C = 14 already matches → <b>9:12:14:15</b>." },
      { q: "Find x if 5 : x :: x : 20.", a: "x² = 100 → <b>x = 10</b> (mean proportional)." },
      { q: "Divide ₹7,000 among A, B, C with A:B = 2:3 and B:C = 4:5.", a: "A:B:C = 8:12:15 (35 parts, part = 200) → <b>A = 1,600, B = 2,400, C = 3,000</b>." },
      { q: "What number must be subtracted from each of 10, 12, 19, 24 so that they are in proportion?", a: "(10 − x)(24 − x) = (12 − x)(19 − x) → 240 − 34x = 228 − 31x → <b>x = 4</b> (6:8 = 15:20 ✓)." },
      { q: "A, B, C invest ₹5,000, ₹8,000, ₹12,000 for 12, 9 and 6 months. Profit ₹13,600. Shares?", a: "60,000 : 72,000 : 72,000 = 5:6:6 (17 parts, part = 800) → <b>A = 4,000, B = 4,800, C = 4,800</b>." },
      { q: "Father + son = 60 years. Six years ago the father was 5 times as old as the son. Present ages?", a: "F − 6 = 5(S − 6) → F = 5S − 24; 6S − 24 = 60 → <b>S = 14, F = 46</b> (40 = 5 × 8 ✓)." }
    ],
    related: []
  });

  /* ───────────────────────── Time, Speed & Distance ───────────────────────── */
  add({
    id: "apt-tsd",
    subject: "aptitude",
    title: "Time, Speed & Distance — trains, boats, relative speed",
    minutes: 35,
    crux: [
      "D = S × T. km/h → m/s multiply by <b>5/18</b>; m/s → km/h multiply by 18/5.",
      "Equal distances at x and y: average speed = <b>2xy/(x + y)</b> (not (x+y)/2).",
      "Relative speed: same direction <b>subtract</b>, opposite directions <b>add</b>.",
      "Train crossing a pole/man: own length; a platform/bridge/other train: <b>sum of lengths</b>.",
      "Boats: downstream = b + s, upstream = b − s ⇒ b = (D + U)/2, s = (D − U)/2.",
      "Same distance ⇒ time ∝ 1/speed. At ¾ of usual speed you take 4/3 of usual time.",
      "Two bodies start towards each other and take t₁, t₂ after meeting to finish: S₁ : S₂ = √t₂ : √t₁."
    ],
    sections: [
      { h: "Build-up", blocks: [
        { p: "Everything is D = S × T. The skill is choosing <b>which distance</b> and <b>which speed</b>: in a train crossing another train, the distance is the sum of both lengths and the speed is the relative speed." },
        { p: "Average speed = total distance / total time. Only for <b>equal distances</b> does it become 2xy/(x+y); for <b>equal times</b> it is (x+y)/2." },
        { table: { head: ["km/h", "18", "36", "54", "72", "90", "108"], rows: [["m/s", "5", "10", "15", "20", "25", "30"]] } }
      ] },
      { h: "Formula table", blocks: [
        { table: { head: ["Case", "Distance to cover", "Speed to use"], rows: [
          ["Train passes pole / standing man", "L (train)", "S (train)"],
          ["Train passes platform / bridge", "L + P", "S"],
          ["Two trains, opposite directions", "L₁ + L₂", "S₁ + S₂"],
          ["Two trains, same direction", "L₁ + L₂", "S₁ − S₂"],
          ["Chase with head start h", "gap h", "S_chaser − S_runner"],
          ["Boat downstream / upstream", "d", "b + s / b − s"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. A man goes to a place at 40 km/h and returns at 60 km/h. Average speed?", ["Equal distances → 2 × 40 × 60/(40 + 60) = 4,800/100.", "<b>Answer: 48 km/h</b>"]),
        ex("Ex 2. A 150 m train at 54 km/h: time to pass a pole, and a 300 m platform?", ["54 km/h = 15 m/s.", "Pole: 150/15 = 10 s. Platform: (150 + 300)/15 = <b>30 s</b>."]),
        ex("Ex 3. Trains of 120 m and 180 m run at 50 and 40 km/h. Time to cross each other in opposite and in the same direction?", ["Distance = 300 m.", "Opposite: 90 km/h = 25 m/s → 300/25 = <b>12 s</b>.", "Same: 10 km/h = 25/9 m/s → 300 × 9/25 = <b>108 s</b>."]),
        ex("Ex 4. A boat goes 24 km downstream in 2 h and 24 km upstream in 3 h. Speeds of boat and stream?", ["D = 12, U = 8 km/h.", "b = (12 + 8)/2 = <b>10 km/h</b>, s = (12 − 8)/2 = <b>2 km/h</b>."]),
        ex("Ex 5. Walking at 3/4 of his usual speed, a man is 20 minutes late. Usual time?", ["Speed ×3/4 → time ×4/3, i.e. extra = 1/3 of usual time = 20 min.", "<b>Answer: 60 minutes</b>"]),
        ex("Ex 6. At 5 km/h a student is 7 min late; at 6 km/h he is 5 min early. Distance?", ["Time difference = 12 min = 1/5 h.", "d/5 − d/6 = d/30 = 1/5 → <b>d = 6 km</b>."]),
        ex("Ex 7. A thief runs at 8 km/h. A policeman starts 10 min later at 10 km/h. When and where does he catch the thief?", ["Head start = 8 × 10/60 = 4/3 km. Closing speed = 2 km/h.", "Time = (4/3)/2 = 2/3 h = <b>40 min</b> after the policeman starts; distance = 10 × 2/3 ≈ <b>6.67 km</b>."]),
        ex("Ex 8. Two trains start from A and B towards each other. After meeting, they take 9 h and 16 h to reach B and A. Ratio of speeds?", ["S₁ : S₂ = √16 : √9.", "<b>Answer: 4 : 3</b>"])
      ] },
      { h: "Races & traps", blocks: [
        { p: "<b>Races:</b> ‘A beats B by x m’ means when A finishes (L), B has run L − x. Chain ratios: A beats B by 10 m and B beats C by 10 m in a 100 m race → when A runs 100, B runs 90, C runs 90 × 90/100 = 81 → A beats C by 19 m (not 20)." },
        { warn: "Convert units first. Mixing km/h with metres and seconds is the #1 source of wrong answers. Also: when a train passes a man walking, the man's length is 0 but his speed counts in the relative speed." }
      ] }
    ],
    practice: [
      { q: "A car covers the first half of a trip at 30 km/h and the second half at 60 km/h. Average speed?", a: "2 × 30 × 60/90 = <b>40 km/h</b>." },
      { q: "A 240 m train passes a man running at 6 km/h in the same direction in 16 s. Train speed?", a: "Relative = 240/16 = 15 m/s = 54 km/h → train = 54 + 6 = <b>60 km/h</b>." },
      { q: "Boat 15 km/h in still water, stream 3 km/h. Time to go 36 km downstream and come back?", a: "36/18 + 36/12 = 2 + 3 = <b>5 h</b>." },
      { q: "In a 100 m race A beats B by 10 m and B beats C by 10 m. By how much does A beat C?", a: "When A = 100, B = 90, C = 90 × 0.9 = 81 → <b>19 m</b>." },
      { q: "Two 100 m trains at equal speed cross each other (opposite directions) in 8 s. Speed of each?", a: "Relative = 200/8 = 25 m/s → each 12.5 m/s = <b>45 km/h</b>." },
      { q: "A person covers 60 km: 20 km at 10 km/h and the rest at 20 km/h. Average speed?", a: "Time = 2 + 2 = 4 h → 60/4 = <b>15 km/h</b> (unequal distances — do not use 2xy/(x+y))." }
    ],
    related: []
  });

  /* ───────────────────────── Profit & Loss ───────────────────────── */
  add({
    id: "apt-profit-loss",
    subject: "aptitude",
    title: "Profit, Loss & Discount — markup, false weights, successive discounts",
    minutes: 30,
    crux: [
      "Profit % and loss % are on <b>CP</b>; discount % is on <b>MP</b> (marked price).",
      "SP = CP × (100 ± p)/100; SP = MP × (100 − d)/100 ⇒ <b>MP/CP = (100 + p)/(100 − d)</b>.",
      "Successive discounts a%, b% = single discount <b>a + b − ab/100</b>.",
      "Same SP, one item at x% gain and another at x% loss ⇒ overall <b>loss of x²/100 %</b>.",
      "False weight: gain % = <b>error/(true − error) × 100</b> (900 g for 1 kg → 100/900 = 11.11%).",
      "CP of n items = SP of m items ⇒ profit % = (n − m)/m × 100."
    ],
    sections: [
      { h: "Vocabulary", blocks: [
        { table: { head: ["Term", "Meaning"], rows: [
          ["CP", "Cost price — what the seller paid"],
          ["MP / list price", "Price tag before discount"],
          ["SP", "Selling price actually received"],
          ["Profit %", "(SP − CP)/CP × 100"],
          ["Discount %", "(MP − SP)/MP × 100"]
        ] } },
        { p: "Chain everything with factors: a markup of 40% and a discount of 15% → SP = CP × 1.4 × 0.85 = 1.19 CP → 19% profit." }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. An article bought for ₹800 is sold for ₹920. Profit %?", ["120/800 × 100 = <b>15%</b>"]),
        ex("Ex 2. Sold at 10% loss for ₹540. What SP gives 10% profit?", ["CP = 540/0.9 = 600.", "SP = 600 × 1.1 = <b>₹660</b>"]),
        ex("Ex 3. Two phones are sold at ₹9,900 each — one at 10% gain, one at 10% loss. Overall?", ["Formula: loss = 10²/100 = 1%.", "Check: CPs = 9,000 and 11,000 → total 20,000; SP total 19,800 → loss 200 = 1%. <b>Answer: 1% loss</b>"]),
        ex("Ex 4. A shopkeeper sells at cost price but uses a 900 g weight for 1 kg. Gain %?", ["He gives 900 g but charges for 1,000 g.", "Gain = 100/900 × 100 = <b>11.11%</b>"]),
        ex("Ex 5. MP ₹5,000 with successive discounts 20% and 10%. SP and equivalent single discount?", ["Single = 20 + 10 − 2 = 28%.", "SP = 5,000 × 0.72 = <b>₹3,600</b>"]),
        ex("Ex 6. The CP of 20 articles equals the SP of 16. Profit %?", ["(20 − 16)/16 × 100 = <b>25%</b>"]),
        ex("Ex 7. What % above CP must the MP be so that after a 25% discount the profit is 20%?", ["MP/CP = 1.20/0.75 = 1.6.", "<b>Answer: 60% above CP</b>"]),
        ex("Ex 8. A dealer marks goods 20% above CP, allows 10% discount, and also uses a 900 g weight for 1 kg. Actual gain %?", ["For ‘1 kg’ he charges 1.2 × 0.9 = 1.08 × CP of 1 kg.", "He actually gives 900 g, costing 0.9 × CP of 1 kg.", "Gain = 1.08/0.9 − 1 = 0.2 → <b>20%</b>"])
      ] },
      { h: "Tricks & traps", blocks: [
        { ul: [
          "When CP is not given, assume CP = 100.",
          "‘Sold for ₹x more would have given y% gain instead of z% loss’ → (y + z)% of CP = x.",
          "Chain of sellers (A → B → C): multiply the factors; work back from the last price."
        ] },
        { warn: "Profit % is never computed on SP (unless the question says so). And ‘gain equal to SP of 11 metres’ means profit = SP(11), not CP(11)." }
      ] }
    ],
    practice: [
      { q: "By selling 33 m of cloth a trader gains the SP of 11 m. Gain %?", a: "SP(33) − CP(33) = SP(11) → CP(33) = SP(22) → gain = 11/22 = <b>50%</b>." },
      { q: "MP ₹1,200, discount 15%, profit still 2%. CP?", a: "SP = 1,020 = 1.02 × CP → <b>CP = ₹1,000</b>." },
      { q: "A sells to B at 20% gain, B sells to C at 10% loss. C pays ₹1,080. A's cost?", a: "1,080/(1.2 × 0.9) = 1,080/1.08 = <b>₹1,000</b>." },
      { q: "Single discount equivalent to successive 10%, 20%, 25%?", a: "1 − 0.9 × 0.8 × 0.75 = 1 − 0.54 = <b>46%</b>." },
      { q: "An article sold at 5% loss would give 4% gain if sold for ₹90 more. CP?", a: "9% of CP = 90 → <b>CP = ₹1,000</b>." },
      { q: "A trader marks up by 40% and gives a 15% discount. Profit %?", a: "1.4 × 0.85 = 1.19 → <b>19%</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Averages ───────────────────────── */
  add({
    id: "apt-averages",
    subject: "aptitude",
    title: "Averages — replacement, new member, weighted average",
    minutes: 25,
    crux: [
      "Sum = average × count. Work with <b>sums</b>, not averages.",
      "New member joins n people and the average rises by d ⇒ newcomer = old avg + <b>(n + 1)d</b>.",
      "One of n replaced and avg rises by d ⇒ new − old = <b>n × d</b>.",
      "Consecutive / equally spaced numbers: average = middle term = (first + last)/2.",
      "Weighted average = Σ(nᵢ × aᵢ)/Σnᵢ; it always lies between the smallest and largest group average.",
      "Avg of first n naturals = (n+1)/2; first n odd numbers = n; first n even numbers = n + 1."
    ],
    sections: [
      { h: "Idea", blocks: [
        { p: "An average hides a sum. Convert every statement into a <b>sum</b> (avg × count), do the arithmetic on sums, then divide at the end." },
        { p: "<b>Deviation method:</b> if a newcomer lifts the average of n people by d, he brought the old average for himself plus d for each of the n + 1 people now in the group." },
        { table: { head: ["Situation (group of n, average a)", "Unknown value"], rows: [
          ["New member joins, average rises by d", "a + (n + 1)d"],
          ["Member leaves, average rises by d", "a − (n − 1)d"],
          ["Member of weight w replaced, average rises by d", "w + nd"],
          ["Need average X after the next item", "X(n + 1) − na"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. The average of 5 numbers is 18. When one number is excluded, the average is 16. The excluded number?", ["90 − 4 × 16 = 90 − 64 = <b>26</b>"]),
        ex("Ex 2. A class of 30 has average weight 40 kg. When the teacher joins, the average rises by 0.5 kg. Teacher's weight?", ["40 + 31 × 0.5 = <b>55.5 kg</b>", "Check: 31 × 40.5 = 1,255.5; 1,255.5 − 1,200 = 55.5 ✓"]),
        ex("Ex 3. The average weight of 8 men increases by 2.5 kg when a 65 kg man is replaced. New man's weight?", ["65 + 8 × 2.5 = <b>85 kg</b>"]),
        ex("Ex 4. Section A: 40 students, avg 60. Section B: 60 students, avg 70. Combined average?", ["(2,400 + 4,200)/100 = <b>66</b>"]),
        ex("Ex 5. After 16 innings a batsman scores 85 in the 17th and raises his average by 3. New average?", ["16a + 85 = 17(a + 3) → a = 34.", "<b>New average = 37</b>"]),
        ex("Ex 6. The average of 11 results is 50. The first six average 49 and the last six average 52. The 6th result?", ["6th is counted in both groups: 294 + 312 − 550 = <b>56</b>"]),
        ex("Ex 7. Three years ago a family of 5 averaged 17 years. A baby has since been born and the average is still 17. Baby's age?", ["Now the 5 sum to 85 + 15 = 100. Six people sum to 6 × 17 = 102.", "<b>Baby = 2 years</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "Overlapping groups (first six and last six of eleven) share a term — subtract the total once to isolate it." },
        { tip: "For ‘what must he score next to reach average X’: needed = X × (n + 1) − current sum." }
      ] }
    ],
    practice: [
      { q: "Average of the first 50 natural numbers?", a: "(50 + 1)/2 = <b>25.5</b>." },
      { q: "The average of 7 consecutive numbers is 20. The largest?", a: "Middle (4th) = 20 → largest = <b>23</b>." },
      { q: "Three sections of 20, 30, 50 students average 50, 60, 55. Overall average?", a: "(1,000 + 1,800 + 2,750)/100 = <b>55.5</b>." },
      { q: "The average weight of 10 people rises by 1.5 kg when a 50 kg person is replaced. New person's weight?", a: "50 + 10 × 1.5 = <b>65 kg</b>." },
      { q: "A batsman averages 40 in 20 innings. Runs needed in the 21st to make the average 42?", a: "42 × 21 − 800 = 882 − 800 = <b>82</b>." },
      { q: "Three numbers average 20. The first is twice the second and the second is thrice the third. Find them.", a: "Third = x, second = 3x, first = 6x → 10x = 60 → <b>36, 18, 6</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Number System ───────────────────────── */
  add({
    id: "apt-number-system",
    subject: "aptitude",
    title: "Number System — divisibility, remainders, unit digits, HCF/LCM",
    minutes: 40,
    crux: [
      "Divisibility: 3/9 → digit sum; 4 → last 2 digits; 8 → last 3; 11 → (odd-place sum − even-place sum) divisible by 11.",
      "Remainder of a product/sum = product/sum of the individual remainders (then reduce again).",
      "Unit digit cycles: 2, 3, 7, 8 repeat every <b>4</b>; 4, 9 every 2; 0, 1, 5, 6 never change. Use power mod 4 (0 → 4th term).",
      "Find a power that gives remainder ±1 (e.g. 2³ = 8 ≡ 1 mod 7) — then big powers collapse.",
      "N = pᵃ qᵇ rᶜ ⇒ number of factors = (a+1)(b+1)(c+1).",
      "HCF × LCM = product of the two numbers. Same remainder r from all → divisor divides every difference.",
      "Trailing zeros of n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …"
    ],
    sections: [
      { h: "Divisibility rules", blocks: [
        { table: { head: ["By", "Rule", "Example"], rows: [
          ["2, 5, 10", "last digit", "—"],
          ["3 / 9", "digit sum divisible by 3 / 9", "7,254: 18 → both"],
          ["4", "last two digits", "3,516: 16 ✓"],
          ["8", "last three digits", "5,48,976: 976 = 8 × 122 ✓"],
          ["6", "by 2 and by 3", "—"],
          ["7", "double the last digit, subtract from the rest; repeat", "343: 34 − 6 = 28 ✓"],
          ["11", "alternating digit sum divisible by 11", "9,18,082: 2−8+0−8+1−9 = −22 ✓"]
        ] } }
      ] },
      { h: "Remainders & unit digits", blocks: [
        { p: "<b>Remainder arithmetic:</b> replace each number by its remainder before multiplying. Negative remainders are allowed and often faster: 5 ≡ −1 (mod 6), so 5²¹ ≡ −1 ≡ 5." },
        { p: "<b>Fermat's little theorem:</b> if p is prime and does not divide a, then aᵖ⁻¹ ≡ 1 (mod p). Example: 3¹² ≡ 1 (mod 13)." },
        { table: { head: ["Last digit", "Cycle of unit digits", "Length"], rows: [
          ["2", "2, 4, 8, 6", "4"], ["3", "3, 9, 7, 1", "4"], ["7", "7, 9, 3, 1", "4"], ["8", "8, 4, 2, 6", "4"],
          ["4", "4, 6", "2"], ["9", "9, 1", "2"], ["0, 1, 5, 6", "itself", "1"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. Unit digit of 7⁹⁵?", ["95 mod 4 = 3 → 3rd term of 7, 9, 3, 1.", "<b>Answer: 3</b>"]),
        ex("Ex 2. Remainder when 2¹⁰⁰ is divided by 7?", ["2³ = 8 ≡ 1 (mod 7). 2¹⁰⁰ = (2³)³³ × 2 ≡ 1 × 2.", "<b>Answer: 2</b>"]),
        ex("Ex 3. Remainder of 17 × 23 × 29 divided by 5?", ["Remainders 2, 3, 4 → 2 × 3 × 4 = 24 ≡ 4.", "<b>Answer: 4</b> (11,339 = 5 × 2,267 + 4 ✓)"]),
        ex("Ex 4. Number of factors of 360?", ["360 = 2³ × 3² × 5.", "(3+1)(2+1)(1+1) = <b>24</b>"]),
        ex("Ex 5. Trailing zeros in 100!?", ["⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = <b>24</b>"]),
        ex("Ex 6. HCF of two numbers is 12, LCM 360; one number is 72. The other?", ["12 × 360/72 = <b>60</b>"]),
        ex("Ex 7. Smallest number that leaves remainder 3 when divided by 4, 6 and 9?", ["LCM(4, 6, 9) = 36 → 36 + 3 = <b>39</b>"]),
        ex("Ex 8. Remainder when 3²⁵⁰ is divided by 13?", ["3³ = 27 ≡ 1 (mod 13). 250 = 3 × 83 + 1.", "3²⁵⁰ ≡ 1⁸³ × 3 = <b>3</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "When the power is a multiple of 4, take the <b>4th</b> term of the cycle, not the ‘0th’ (2⁴⁰ ends in 6, not 1)." },
        { warn: "HCF × LCM = product holds for <b>two</b> numbers only." },
        { tip: "‘Largest number that divides a, b, c leaving the same remainder’ = HCF(b − a, c − b, c − a)." }
      ] }
    ],
    practice: [
      { q: "Unit digit of 13⁴² × 8²⁷?", a: "3⁴²: 42 mod 4 = 2 → 9. 8²⁷: 27 mod 4 = 3 → 2. 9 × 2 = 18 → <b>8</b>." },
      { q: "Remainder when 5²¹ is divided by 6?", a: "5 ≡ −1 → (−1)²¹ = −1 ≡ <b>5</b>." },
      { q: "Trailing zeros in 250!?", a: "50 + 10 + 2 = <b>62</b>." },
      { q: "How many factors does 1,800 have?", a: "1,800 = 2³ × 3² × 5² → 4 × 3 × 3 = <b>36</b>." },
      { q: "Largest number that divides 1,305, 4,665 and 6,905 leaving the same remainder?", a: "Differences 3,360, 2,240, 5,600 → HCF = <b>1,120</b> (remainder 185 each)." },
      { q: "Is 5,48,976 divisible by 8? By 11?", a: "Last three digits 976 = 8 × 122 → <b>yes by 8</b>. Alternating sum 6−7+9−8+4−5 = −1 → <b>not by 11</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Time & Work ───────────────────────── */
  add({
    id: "apt-time-work",
    subject: "aptitude",
    title: "Time & Work — LCM method, man-days, pipes & cisterns, wages",
    minutes: 35,
    crux: [
      "<b>LCM method:</b> total work = LCM of the given days; each person's efficiency = work/days. No fractions.",
      "A alone a days, B alone b days ⇒ together <b>ab/(a + b)</b> days.",
      "Man-days: <b>M₁D₁H₁/W₁ = M₂D₂H₂/W₂</b>.",
      "Pipes: filling pipes are +, leaks/outlets are −; same maths as work.",
      "Efficiency ratio is the <b>inverse</b> of time ratio (twice as efficient ⇒ half the time).",
      "Wages are shared in the ratio of <b>work done</b> (efficiency × days worked), not days alone."
    ],
    sections: [
      { h: "The LCM method", blocks: [
        { p: "Suppose A takes 10 days and B takes 15 days. Take total work = LCM(10, 15) = 30 units. A does 3 units/day, B does 2 units/day, so together 5 units/day → 30/5 = 6 days. Every Time & Work question becomes integer arithmetic this way." },
        { table: { head: ["Person", "Days", "Units/day (work = 30)"], rows: [["A", "10", "3"], ["B", "15", "2"], ["A + B", "6", "5"]] } },
        { p: "<b>Pipes & cisterns:</b> an inlet filling in 20 min is +, an outlet emptying in 15 min is −. Tank = LCM units." }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. A does a job in 10 days, B in 15. Together?", ["10 × 15/25 = <b>6 days</b>"]),
        ex("Ex 2. A+B take 12 days, B+C 15, C+A 20. How long for all three? For A alone?", ["Work = 60: A+B = 5, B+C = 4, C+A = 3 units/day.", "2(A+B+C) = 12 → A+B+C = 6 → <b>10 days</b>.", "A = 6 − (B+C) = 2 → <b>30 days</b>."]),
        ex("Ex 3. 12 men working 8 h/day finish in 18 days. How many days for 16 men working 9 h/day?", ["12 × 18 × 8 = 16 × D × 9 → D = 1,728/144 = <b>12 days</b>"]),
        ex("Ex 4. A is twice as efficient as B; together they take 14 days. A alone?", ["Efficiencies 2 : 1 → work = 3 × 14 = 42 units.", "A: 42/2 = <b>21 days</b>"]),
        ex("Ex 5. Pipes A and B fill a tank in 20 and 30 min; pipe C empties it in 15 min. All open — time to fill?", ["Tank = 60 units: +3 +2 −4 = +1 unit/min.", "<b>60 minutes</b>"]),
        ex("Ex 6. A can finish a job in 25 days. He works 10 days, then B finishes the rest in 12 days. B alone?", ["A did 10/25 = 2/5; B did 3/5 in 12 days.", "B alone = 12 × 5/3 = <b>20 days</b>"]),
        ex("Ex 7. A and B can do a job in 6 and 8 days. With C's help they finish in 3 days and get ₹2,800. C's share?", ["Work = 24: A = 4, B = 3, all = 8 units/day → C = 1.", "In 3 days: A 12, B 9, C 3 units → ratio 12:9:3.", "C = 3/24 × 2,800 = <b>₹350</b>"]),
        ex("Ex 8. A takes 12 days, B 18 days. They work on alternate days, A first. When is the job done?", ["Work = 36: A = 3, B = 2 → 5 units per 2-day cycle.", "7 cycles = 14 days → 35 units. Day 15: A needs 1 of his 3 units → 1/3 day.", "<b>14⅓ days</b>"])
      ] },
      { h: "Tricks & traps", blocks: [
        { ul: [
          "‘x men or y women’ ⇒ 1 man = y/x women; convert everyone to one unit.",
          "Leak problems: fill time with leak T₂, without T₁ ⇒ leak alone empties in T₁T₂/(T₂ − T₁).",
          "People leaving/joining midway: split the timeline into phases and add work done in each phase."
        ] },
        { warn: "Days do NOT add (A 10 days + B 15 days is not 25 days together) — only <b>rates</b> add." }
      ] }
    ],
    practice: [
      { q: "A, B, C can do a job in 20, 30 and 60 days. Together?", a: "Work 60: 3 + 2 + 1 = 6/day → <b>10 days</b>." },
      { q: "15 men can finish a job in 20 days. After 5 days, 5 more men join. Total days taken?", a: "Total 300 man-days; 75 done; 225 left for 20 men → 11.25 days → <b>16.25 days</b> in all." },
      { q: "A pipe fills a tank in 6 h; because of a leak it takes 8 h. How long would the leak take to empty a full tank?", a: "1/6 − 1/8 = 1/24 → <b>24 h</b>." },
      { q: "A can do a job in 12 days. B is 50% more efficient than A. How long do they take together?", a: "B takes 12/1.5 = 8 days. Together 12 × 8/20 = <b>4.8 days</b>." },
      { q: "A and B together take 8 days; A alone 12. B alone?", a: "1/8 − 1/12 = 1/24 → <b>24 days</b>." },
      { q: "6 men or 10 women can finish a job in 20 days. How long for 3 men and 5 women?", a: "3 men = 5 women, so 3M + 5W = 10 women → <b>20 days</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Permutation & Combination ───────────────────────── */
  add({
    id: "apt-perm-comb",
    subject: "aptitude",
    title: "Permutation & Combination — arrangements, selections, circles, distribution",
    minutes: 40,
    crux: [
      "AND → multiply, OR → add. Order matters → permutation (ⁿPᵣ = n!/(n−r)!); order doesn't → combination (ⁿCᵣ = n!/(r!(n−r)!)).",
      "Letters with repeats: n!/(p! q! …). LEADER → 6!/2! = 360.",
      "Circular arrangements: (n − 1)!; necklace/garland (flip allowed): (n − 1)!/2.",
      "‘Together’ → glue into one block (× internal arrangements). ‘Not together’ = total − together. ‘No two X adjacent’ → place others, put X in gaps.",
      "‘At least one’ → total − none. Selecting any number from n distinct items: 2ⁿ (≥1: 2ⁿ − 1).",
      "n identical items into r distinct boxes: <b>ⁿ⁺ʳ⁻¹Cᵣ₋₁</b>; each box ≥ 1: <b>ⁿ⁻¹Cᵣ₋₁</b>.",
      "Derangements: D₃ = 2, D₄ = 9, D₅ = 44 (nobody in their own place)."
    ],
    sections: [
      { h: "Permutation vs combination", blocks: [
        { p: "Ask: if I swap two chosen items, do I get a <b>different</b> outcome? Seats, ranks, passwords, words → yes → permutation. Committees, teams, handshakes, chords → no → combination. ⁿPᵣ = ⁿCᵣ × r!." },
        { table: { head: ["Pattern", "Count"], rows: [
          ["Arrange n distinct in a row", "n!"],
          ["Choose r from n", "ⁿCᵣ"],
          ["n items, p alike, q alike", "n!/(p! q!)"],
          ["n people around a table", "(n − 1)!"],
          ["Necklace of n distinct beads", "(n − 1)!/2"],
          ["Diagonals of an n-gon", "ⁿC₂ − n"],
          ["Triangles from n points, m collinear", "ⁿC₃ − ᵐC₃"],
          ["Handshakes among n", "ⁿC₂"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. How many arrangements of the letters of LEADER?", ["6 letters, E twice → 6!/2! = <b>360</b>"]),
        ex("Ex 2. Arrangements of MOTHER with both vowels together?", ["Glue O, E: 5 units → 5! = 120; the block itself 2! → <b>240</b>"]),
        ex("Ex 3. A committee of 5 from 6 men and 4 women with at least 2 women?", ["Total ¹⁰C₅ = 252. Subtract 0 women (⁶C₅ = 6) and 1 woman (4 × ⁶C₄ = 60).", "252 − 66 = <b>186</b> (direct: 120 + 60 + 6 ✓)"]),
        ex("Ex 4. 7 people around a round table. In how many ways? With two particular people together?", ["(7 − 1)! = <b>720</b>.", "Glue the pair: 6 units → 5! × 2 = <b>240</b>."]),
        ex("Ex 5. 4-digit numbers with distinct digits (0–9)? How many are even?", ["First digit ≠ 0: 9 × 9 × 8 × 7 = <b>4,536</b>.", "Even, ending 0: 9 × 8 × 7 = 504. Ending 2/4/6/8: first digit 8 ways (not 0, not the last) × 8 × 7 = 448 each → 1,792.", "Even total = <b>2,296</b>"]),
        ex("Ex 6. Diagonals of a 12-gon; triangles from 10 points of which 4 are collinear?", ["¹²C₂ − 12 = 66 − 12 = <b>54</b>.", "¹⁰C₃ − ⁴C₃ = 120 − 4 = <b>116</b>."]),
        ex("Ex 7. 10 identical chocolates among 4 children? If each must get at least one?", ["Stars & bars: ¹³C₃ = <b>286</b>.", "Give 1 each first, distribute 6: ⁹C₃ = <b>84</b>."]),
        ex("Ex 8. Rank of MOTHER among all its arrangements in dictionary order.", ["Sorted letters: E H M O R T.", "Start with E or H: 2 × 5! = 240. M then E/H: 2 × 4! = 48. MO then E/H/R: 3 × 3! = 18. MOT then E: 1 × 2! = 2. MOTH then E…: 0. Then MOTHER itself: +1.", "Rank = 240 + 48 + 18 + 2 + 0 + 1 = <b>309</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "Circular arrangements divide out rotations only. If the seats are numbered (distinct positions), it is back to n!." },
        { warn: "For digits, the first place cannot be 0 — fill the most restricted place first." },
        { tip: "When stuck, count the complement: ‘at least one’, ‘not together’, ‘not all’ are almost always total − bad." }
      ] }
    ],
    practice: [
      { q: "Arrangements of BANANA?", a: "6!/(3! 2!) = <b>60</b>." },
      { q: "5 boys and 3 girls in a row so that no two girls are adjacent?", a: "Boys 5! = 120; 6 gaps, place girls ⁶P₃ = 120 → <b>14,400</b>." },
      { q: "Handshakes when 20 people each shake hands once with everyone else?", a: "²⁰C₂ = <b>190</b>." },
      { q: "Choose 3 of 8 people when 2 particular people must both be included; and when neither may be included?", a: "Both in: pick 1 of the other 6 → <b>6</b>. Neither: ⁶C₃ = <b>20</b>." },
      { q: "Necklaces from 8 distinct beads?", a: "7!/2 = <b>2,520</b>." },
      { q: "4 letters into 4 addressed envelopes so that none is in its correct envelope?", a: "Derangement D₄ = 4!(1 − 1 + 1/2 − 1/6 + 1/24) = <b>9</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Probability ───────────────────────── */
  add({
    id: "apt-probability",
    subject: "aptitude",
    title: "Probability — coins, dice, cards, balls",
    minutes: 30,
    crux: [
      "P(E) = favourable / total equally-likely outcomes; 0 ≤ P ≤ 1.",
      "P(not E) = 1 − P(E). ‘At least one’ = 1 − P(none).",
      "P(A or B) = P(A) + P(B) − P(A and B). Independent: P(A and B) = P(A)·P(B).",
      "Two dice: 36 outcomes; ways to get sum 2…12 = 1, 2, 3, 4, 5, <b>6 (sum 7)</b>, 5, 4, 3, 2, 1.",
      "Cards: 52 = 4 suits × 13; 26 red; 12 face cards (J, Q, K); 4 aces.",
      "Drawing without replacement → use combinations: P = ᵃCₓ·ᵇCᵧ / ⁿCᵣ.",
      "Odds in favour a : b ⇒ P = a/(a + b)."
    ],
    sections: [
      { h: "Sample spaces to know", blocks: [
        { table: { head: ["Experiment", "Outcomes", "Useful fact"], rows: [
          ["n coins", "2ⁿ", "exactly k heads: ⁿCₖ/2ⁿ"],
          ["2 dice", "36", "sum 7 has 6 ways; doubles 6 ways"],
          ["1 card", "52", "red/black 26 each, faces 12, aces 4"],
          ["2 cards", "⁵²C₂ = 1,326", "both aces ⁴C₂ = 6"],
          ["Leap year", "366 days = 52 weeks + 2 days", "P(53 Sundays) = 2/7"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. Two dice: P(sum = 8)?", ["(2,6), (3,5), (4,4), (5,3), (6,2) → <b>5/36</b>"]),
        ex("Ex 2. One card: P(king or heart)?", ["4 + 13 − 1 (king of hearts) = 16 → 16/52 = <b>4/13</b>"]),
        ex("Ex 3. Three coins: P(at least 2 heads)?", ["HHT, HTH, THH, HHH = 4 of 8 → <b>1/2</b>"]),
        ex("Ex 4. Bag: 5 red, 3 blue. Draw 2. P(both red)? P(one of each)?", ["Total ⁸C₂ = 28.", "Both red ⁵C₂ = 10 → <b>5/14</b>. One each 5 × 3 = 15 → <b>15/28</b>."]),
        ex("Ex 5. A hits a target with probability 1/3, B with 1/4. Both fire once. P(target hit)?", ["P(both miss) = 2/3 × 3/4 = 1/2.", "P(hit) = <b>1/2</b>"]),
        ex("Ex 6. P(a leap year has 53 Sundays)?", ["52 full weeks + 2 extra consecutive days: 7 possible pairs (Sun–Mon, Mon–Tue, …, Sat–Sun); 2 contain Sunday.", "<b>2/7</b> (a non-leap year: 1/7)"]),
        ex("Ex 7. Two cards drawn together. P(both aces)?", ["⁴C₂/⁵²C₂ = 6/1,326 = <b>1/221</b>"]),
        ex("Ex 8. A letter is picked from ASSASSINATION. P(vowel)?", ["13 letters; vowels A, A, A, I, I, O = 6.", "<b>6/13</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "‘Or’ needs the overlap subtracted (king AND heart counted twice)." },
        { warn: "With/without replacement changes the denominator on the second draw — read carefully." },
        { tip: "If counting the event is messy, count its complement." }
      ] }
    ],
    practice: [
      { q: "Two dice: P(product is even)?", a: "P(odd product) = both odd = 1/2 × 1/2 = 1/4 → <b>3/4</b>." },
      { q: "One card: P(red or face card)?", a: "26 + 12 − 6 = 32 → 32/52 = <b>8/13</b>." },
      { q: "Four coins: P(exactly 2 heads)?", a: "⁴C₂/16 = 6/16 = <b>3/8</b>." },
      { q: "A number is picked from 1–30. P(multiple of 3 or 5)?", a: "10 + 6 − 2 = 14 → <b>7/15</b>." },
      { q: "Bag: 4 white, 6 black. Draw 3. P(at least one white)?", a: "1 − ⁶C₃/¹⁰C₃ = 1 − 20/120 = <b>5/6</b>." },
      { q: "Odds in favour of an event are 3 : 5. Probability?", a: "3/(3 + 5) = <b>3/8</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Probability (harder) ───────────────────────── */
  add({
    id: "apt-probability-hard",
    subject: "aptitude",
    title: "Probability (harder) — conditional, Bayes, binomial, expectation",
    minutes: 40,
    crux: [
      "Conditional: <b>P(A | B) = P(A ∩ B)/P(B)</b> — shrink the sample space to B.",
      "Bayes: P(Hᵢ | E) = P(E | Hᵢ)P(Hᵢ) / Σ P(E | Hⱼ)P(Hⱼ). Use a table of ‘prior × likelihood’.",
      "Binomial: P(exactly k successes in n) = <b>ⁿCₖ pᵏ(1 − p)ⁿ⁻ᵏ</b>.",
      "Expected value E[X] = Σ x·P(x); expectations add even for dependent variables.",
      "Waiting for a success with probability p: expected trials = <b>1/p</b>.",
      "Alternate turns, A first, each turn succeeds with p: P(A wins) = <b>p / (1 − (1 − p)²)</b>.",
      "Birthday: 23 people → P(some shared birthday) ≈ 50.7%."
    ],
    sections: [
      { h: "Conditional probability & Bayes", blocks: [
        { p: "‘Given that…’ means: throw away every outcome that contradicts the given fact, then count again. Bayes is the same idea when outcomes come from different sources (machines, boxes, tests)." },
        { table: { head: ["Source", "Prior", "P(defective | source)", "Prior × likelihood"], rows: [
          ["Machine A", "0.6", "0.02", "0.012"], ["Machine B", "0.4", "0.05", "0.020"], ["Total", "", "", "0.032"]
        ] } },
        { p: "P(A | defective) = 0.012/0.032 = <b>3/8</b>. This table is Ex 3 below." }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. A family has two children, at least one a boy. P(both boys)?", ["Sample space shrinks to {BB, BG, GB}.", "<b>1/3</b> (not 1/2)"]),
        ex("Ex 2. Box 1: 3 red, 2 black. Box 2: 2 red, 3 black. A box is chosen at random and a red ball drawn. P(it came from Box 1)?", ["½ × 3/5 = 3/10 vs ½ × 2/5 = 2/10.", "P = 3/(3 + 2) = <b>3/5</b>"]),
        ex("Ex 3. Machine A makes 60% of items (2% defective), B makes 40% (5% defective). A random item is defective. P(from A)?", ["See table: 0.012/0.032 = <b>3/8</b>"]),
        ex("Ex 4. A fair coin is tossed 6 times. P(exactly 4 heads)? P(at least 5 heads)?", ["⁶C₄/64 = <b>15/64</b>.", "(⁶C₅ + ⁶C₆)/64 = <b>7/64</b>."]),
        ex("Ex 5. Expected value of a die roll; expected rolls until the first six?", ["(1+2+…+6)/6 = <b>3.5</b>.", "p = 1/6 → <b>6 rolls</b>."]),
        ex("Ex 6. A and B alternately throw a die, A first; the first to throw a six wins. P(A wins)?", ["A wins on throw 1, 3, 5, …: (1/6)[1 + (25/36) + (25/36)² + …].", "= (1/6)/(1 − 25/36) = (1/6)/(11/36) = <b>6/11</b>. (With a coin and heads: 2/3.)"]),
        ex("Ex 7. 5 people sit in a row at random. P(A and B sit together)?", ["Together: 4! × 2 = 48 of 5! = 120.", "<b>2/5</b>"]),
        ex("Ex 8. A test is 99% accurate for sick people and gives 1% false positives. 1% of people are sick. P(sick | positive)?", ["Sick & positive: 0.01 × 0.99 = 0.0099. Healthy & positive: 0.99 × 0.01 = 0.0099.", "P = 0.0099/0.0198 = <b>1/2</b> — rare diseases make positives unreliable."])
      ] },
      { h: "Traps", blocks: [
        { warn: "‘At least one is a boy’ ≠ ‘the elder is a boy’ (the latter gives 1/2)." },
        { warn: "Independence must be given or obvious (separate dice, separate shooters). Draws without replacement are <b>not</b> independent." },
        { tip: "For interviews, say the method out loud: ‘complement’, ‘condition shrinks the space’, ‘Bayes table’ — the method earns credit even if arithmetic slips." }
      ] }
    ],
    practice: [
      { q: "Two dice are thrown and the sum is 8. P(both show even numbers)?", a: "Sum 8: (2,6), (3,5), (4,4), (5,3), (6,2); both even in 3 → <b>3/5</b>." },
      { q: "Expected sum of two dice?", a: "3.5 + 3.5 = <b>7</b> (linearity)." },
      { q: "P(at least one six in 4 throws of a die)?", a: "1 − (5/6)⁴ = 1 − 625/1,296 = <b>671/1,296 ≈ 0.518</b>." },
      { q: "Three dice: P(all show different numbers)?", a: "6 × 5 × 4/216 = 120/216 = <b>5/9</b>." },
      { q: "Two different numbers are picked from 1–10. P(their sum is even)?", a: "Both odd ⁵C₂ = 10 + both even 10 = 20 of ¹⁰C₂ = 45 → <b>4/9</b>." },
      { q: "Probability of exactly 2 sixes in 3 throws of a die?", a: "³C₂ (1/6)² (5/6) = 15/216 = <b>5/72</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Simple & Compound Interest ───────────────────────── */
  add({
    id: "apt-interest",
    subject: "aptitude",
    title: "Simple & Compound Interest — CI−SI, half-yearly, instalments",
    minutes: 30,
    crux: [
      "SI = PRT/100; amount A = P + SI. SI is the same every year.",
      "CI: A = P(1 + R/100)ⁿ; CI = A − P. Year-on-year, interest is earned on interest.",
      "CI − SI (2 years) = <b>P(R/100)²</b>; (3 years) = <b>P(R/100)²(3 + R/100)</b>.",
      "Half-yearly: rate R/2, periods 2n. Quarterly: R/4, 4n.",
      "SI: money becomes k times in T years ⇒ R = (k − 1) × 100/T.",
      "CI: if money doubles in n years it becomes 4× in 2n, 8× in 3n.",
      "Two consecutive CI amounts A₁, A₂ ⇒ R = (A₂ − A₁)/A₁ × 100."
    ],
    sections: [
      { h: "SI vs CI", blocks: [
        { table: { head: ["Year", "SI on ₹10,000 at 10%", "CI on ₹10,000 at 10%"], rows: [
          ["1", "1,000", "1,000"], ["2", "1,000", "1,100"], ["3", "1,000", "1,210"], ["Total 3 yrs", "3,000", "3,310"]
        ] } },
        { p: "Year-1 interest is the same for both; the gap grows because CI earns interest on previous interest. That's why CI − SI for 2 years is just P(R/100)² — interest on the first year's interest." }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. SI on ₹8,000 at 6% p.a. for 3 years?", ["8,000 × 6 × 3/100 = <b>₹1,440</b>"]),
        ex("Ex 2. A sum doubles in 8 years at SI. Rate? When will it be 4 times?", ["SI = P in 8 years → R = 100/8 = <b>12.5%</b>.", "4 times needs SI = 3P → 24 years."]),
        ex("Ex 3. CI on ₹10,000 at 10% for 2 years? Difference from SI?", ["10,000 × 1.21 = 12,100 → CI = <b>₹2,100</b>.", "CI − SI = 10,000 × 0.01 = <b>₹100</b> ✓"]),
        ex("Ex 4. CI − SI for 2 years at 5% is ₹25. Principal?", ["P × (0.05)² = 25 → P = 25/0.0025 = <b>₹10,000</b>"]),
        ex("Ex 5. ₹20,000 at 10% p.a. compounded half-yearly for 1 year?", ["Rate 5% per half-year, 2 periods: 20,000 × 1.05² = 22,050.", "CI = <b>₹2,050</b>"]),
        ex("Ex 6. A sum at CI amounts to ₹6,050 in 2 years and ₹6,655 in 3 years. Rate and principal?", ["R = 605/6,050 = <b>10%</b>.", "P = 6,050/1.21 = <b>₹5,000</b>"]),
        ex("Ex 7. At SI a sum becomes ₹815 in 3 years and ₹854 in 4 years. Principal?", ["1 year's SI = 39 → 3 years = 117.", "P = 815 − 117 = <b>₹698</b>"]),
        ex("Ex 8. A loan of ₹2,100 at 10% CI is repaid in 2 equal annual instalments. Each instalment?", ["Present values: x/1.1 + x/1.21 = 2,100 → x(1.1 + 1)/1.21 = 2,100.", "x = 2,100 × 1.21/2.1 = <b>₹1,210</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "Compounding half-yearly doubles the number of periods AND halves the rate — both, not just one." },
        { tip: "Memorise 1.1² = 1.21, 1.1³ = 1.331, 1.05² = 1.1025, 1.2³ = 1.728 — most CI questions use these." }
      ] }
    ],
    practice: [
      { q: "SI on ₹12,000 at 5% for 4 years?", a: "12,000 × 5 × 4/100 = <b>₹2,400</b>." },
      { q: "CI on ₹5,000 at 20% for 3 years?", a: "5,000 × 1.728 = 8,640 → CI = <b>₹3,640</b>." },
      { q: "CI − SI on ₹1,000 at 10% for 3 years?", a: "1,000 × 0.01 × 3.1 = <b>₹31</b> (CI 331 − SI 300)." },
      { q: "At what SI rate does ₹1,500 become ₹2,100 in 5 years?", a: "600 × 100/(1,500 × 5) = <b>8%</b>." },
      { q: "A sum triples in 2 years at CI. In how many years will it become 27 times?", a: "27 = 3³ → <b>6 years</b>." },
      { q: "₹10,000 at 8% p.a. compounded quarterly for 6 months?", a: "2% per quarter, 2 quarters: 10,000 × 1.02² = <b>₹10,404</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Seating Arrangement ───────────────────────── */
  add({
    id: "apt-seating",
    subject: "aptitude",
    title: "Seating Arrangement — linear and circular",
    minutes: 35,
    crux: [
      "Row drawn with north at the top: people facing <b>north</b> have their left on the west (page-left); people facing <b>south</b> have left and right flipped.",
      "Circle facing the <b>centre</b>: left = <b>clockwise</b>, right = anticlockwise. Facing outward: reversed.",
      "Start with the most <b>definite</b> clue (fixed position, ‘opposite’, ‘immediate’). In a circle, fix one person anywhere — rotations are the same arrangement.",
      "‘Second to the left of X’ = skip one seat; ‘between A and B’ = adjacent to both (for one person).",
      "When a clue allows two placements, draw <b>both cases</b> and let later clues kill one.",
      "Negative clues (‘not adjacent’, ‘not at an end’) are usually used last."
    ],
    sections: [
      { h: "Directions in a row and a circle", blocks: [
        { svg: `<svg viewBox="0 0 560 260" width="560" class="dg">
  <circle class="ln" cx="150" cy="130" r="90"/>
  <text class="tx tx-b" x="150" y="40" text-anchor="middle" dominant-baseline="middle">A</text>
  <text class="tx tx-b" x="223.6" y="66.4" text-anchor="middle" dominant-baseline="middle">F</text>
  <text class="tx tx-b" x="240" y="130" text-anchor="middle" dominant-baseline="middle">C</text>
  <text class="tx tx-b" x="223.6" y="193.6" text-anchor="middle" dominant-baseline="middle">H</text>
  <text class="tx tx-b" x="150" y="220" text-anchor="middle" dominant-baseline="middle">E</text>
  <text class="tx tx-b" x="76.4" y="193.6" text-anchor="middle" dominant-baseline="middle">B</text>
  <text class="tx tx-b" x="60" y="130" text-anchor="middle" dominant-baseline="middle">G</text>
  <text class="tx tx-b" x="76.4" y="66.4" text-anchor="middle" dominant-baseline="middle">D</text>
  <circle class="box-a" cx="150" cy="130" r="18"/>
  <text class="tx-m" x="150" y="130" text-anchor="middle" dominant-baseline="middle">centre</text>
  <path class="ln-a" d="M 186 58 A 80 80 0 0 1 222 94" marker-end="url(#dg-arr-a)"/>
  <text class="tx-a" x="232" y="36" text-anchor="middle" dominant-baseline="middle">clockwise = LEFT</text>
  <rect class="box" x="300" y="70" width="240" height="120" rx="8"/>
  <text class="tx tx-b" x="420" y="92" text-anchor="middle" dominant-baseline="middle">Facing the centre</text>
  <text class="tx" x="420" y="118" text-anchor="middle" dominant-baseline="middle">left  = clockwise neighbour</text>
  <text class="tx" x="420" y="140" text-anchor="middle" dominant-baseline="middle">right = anticlockwise neighbour</text>
  <text class="tx-m" x="420" y="166" text-anchor="middle" dominant-baseline="middle">Facing outward: swap them</text>
</svg>`, caption: "Solved arrangement of Ex 2 (read clockwise from the top: A F C H E B G D). All eight face the centre." },
        { p: "Why clockwise = left: stand at the bottom of the circle facing the centre (north). Your left hand points west, and moving from the bottom towards the west side of the circle is the clockwise direction when the circle is drawn from above." }
      ] },
      { h: "Ex 1 — linear row", blocks: [
        { p: "<b>Six friends P, Q, R, S, T, U sit in a row facing north.</b> (1) R is third from the left end. (2) S sits at an extreme end. (3) P is immediately to the left of R. (4) Q is second to the right of R. (5) T is not adjacent to Q." },
        { ol: [
          "Clue 1: seat 3 = R. Clue 3: seat 2 = P. Clue 4: seat 5 = Q.",
          "Seats 1, 4, 6 remain for S, T, U. Clue 5: seats 4 and 6 touch Q, so T = seat 1.",
          "Clue 2: S is at an end and seat 1 is taken → S = seat 6, U = seat 4.",
          "Row (left → right): <b>T P R U Q S</b>. Between R and Q sits U; S is at the right end."
        ] }
      ] },
      { h: "Ex 2 — circular, 8 people facing the centre", blocks: [
        { p: "<b>A–H sit around a circle facing the centre.</b> (1) E is second to the left of C. (2) H sits between C and E. (3) A is third to the right of H. (4) B is immediately to the left of E. (5) G sits opposite C. (6) D is not a neighbour of C." },
        { ol: [
          "Fix C at the right side of the circle. Clue 1: two seats clockwise from C → E. Clue 2: the seat between them is H.",
          "Clue 3: three seats anticlockwise (right) from H → skip C and one more seat → A (top).",
          "Clue 4: the clockwise neighbour of E is B.",
          "Clue 5: the seat opposite C is G. Remaining two seats, both next to A: one also touches C.",
          "Clue 6: D cannot touch C → D sits between A and G; F sits between A and C.",
          "Answer (clockwise from A): <b>A F C H E B G D</b>. Immediate right of A = D; opposite F = B; clockwise from A to E there are 3 people (F, C, H)."
        ] },
        { tip: "In OAs, draw the circle once and pencil names in lightly; don't redraw for every clue." }
      ] },
      { h: "Traps", blocks: [
        { warn: "The most common error: using ‘left = anticlockwise’ for people facing the centre. Test it with your own body once and then trust the rule." },
        { warn: "If some people face the centre and others face outward, compute left/right per person." }
      ] }
    ],
    practice: [
      { q: "Six people P, Q, R, S, T, U sit around a circle facing the centre. Q is opposite P. R is immediately to the left of P. T is second to the right of U. Who sits between P and U?", a: "Fix P at top. Q opposite (bottom). R = P's clockwise neighbour. Seats left for S, T, U are the three remaining; ‘T second to the right of U’ (two seats anticlockwise) works only with U next to Q on the far side and T next to R. Order clockwise: P R T Q U S → <b>S</b> sits between P and U." },
      { q: "In the same arrangement, who is immediately to the right of Q?", a: "Right = anticlockwise neighbour of Q = <b>T</b>." },
      { q: "In Ex 2, who sits second to the left of G?", a: "Clockwise from G: D, then A → <b>A</b>." },
      { q: "Five people sit in a row facing south. From west to east (page-left to page-right, north at top) they are V, W, X, Y, Z. Who is at W's immediate right?", a: "Facing south, a person's right hand points west → <b>V</b>." },
      { q: "In Ex 1, if T and S swap seats, who sits at the left end and who is now adjacent to Q?", a: "Row becomes S P R U Q T → left end <b>S</b>; Q's neighbours are <b>U and T</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Blood Relations + Direction Sense ───────────────────────── */
  add({
    id: "apt-blood-direction",
    subject: "aptitude",
    title: "Blood Relations & Direction Sense",
    minutes: 30,
    crux: [
      "Draw a <b>family tree</b>: generations as rows, + male / − female, ‘=’ for married couples. Never solve in your head.",
      "Decode phrases from the inside out: ‘only son of my grandfather’ = my father.",
      "Gender is unknown unless stated — ‘child’, ‘sibling’, a name like ‘Kiran’ can be either.",
      "Directions: north up, east right. <b>Right turn = 90° clockwise</b>, left turn = anticlockwise.",
      "Shortest distance: net east–west and net north–south, then <b>Pythagoras</b> (3-4-5, 6-8-10, 5-12-13, 8-15-17).",
      "Shadows: morning sun in the east → shadow to the <b>west</b>; evening → shadow to the east. Noon: no usable shadow."
    ],
    sections: [
      { h: "Blood relations", blocks: [
        { table: { head: ["Phrase", "Means"], rows: [
          ["Father's / mother's only son (speaker male)", "Speaker himself"],
          ["Only son of my grandfather", "My father (on the paternal side)"],
          ["Mother's husband's son", "Me (if male) or my brother"],
          ["Brother's wife's father-in-law", "My father"],
          ["Son of my father's only daughter (speaker male)", "My nephew (sister's son)"]
        ] } },
        ex("Ex 1. Pointing to a photograph, Rahul says, ‘He is the son of the only son of my grandfather.’ Who is the man?", ["Only son of my grandfather = Rahul's father.", "His son (not Rahul, since Rahul is looking at a photo of someone else) = <b>Rahul's brother</b>."]),
        ex("Ex 2. A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?", ["A and B are children of C; C is D's child.", "A is female → <b>granddaughter</b> of D."]),
        ex("Ex 3. ‘P × Q’ means P is the father of Q; ‘P − Q’ means P is the brother of Q; ‘P + Q’ means P is the mother of Q. What does M × N − O + K mean for M and K?", ["M father of N; N brother of O; O mother of K.", "So O is M's daughter and K is O's child → M is K's <b>maternal grandfather</b>."])
      ] },
      { h: "Direction sense", blocks: [
        { svg: `<svg viewBox="0 0 520 280" width="520" class="dg">
  <line class="ln-a" x1="100" y1="200" x2="100" y2="140" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="100" y1="140" x2="190" y2="140" marker-end="url(#dg-arr-a)"/>
  <line class="ln-a" x1="190" y1="140" x2="190" y2="260" marker-end="url(#dg-arr-a)"/>
  <line class="ln ln-d" x1="100" y1="200" x2="190" y2="260"/>
  <circle class="box-g" cx="100" cy="200" r="6"/>
  <text class="tx tx-b" x="82" y="200" text-anchor="middle" dominant-baseline="middle">S</text>
  <circle class="box-r" cx="190" cy="260" r="6"/>
  <text class="tx tx-b" x="208" y="262" text-anchor="middle" dominant-baseline="middle">F</text>
  <text class="tx-m" x="82" y="170" text-anchor="middle" dominant-baseline="middle">4 N</text>
  <text class="tx-m" x="145" y="128" text-anchor="middle" dominant-baseline="middle">6 E</text>
  <text class="tx-m" x="212" y="196" text-anchor="middle" dominant-baseline="middle">12 S</text>
  <text class="tx-a" x="120" y="246" text-anchor="middle" dominant-baseline="middle">10 km SE</text>
  <line class="ln" x1="400" y1="140" x2="400" y2="60" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="400" y1="140" x2="480" y2="140" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="400" y1="140" x2="400" y2="220" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="400" y1="140" x2="320" y2="140" marker-end="url(#dg-arr)"/>
  <text class="tx tx-b" x="400" y="46" text-anchor="middle" dominant-baseline="middle">N</text>
  <text class="tx tx-b" x="496" y="140" text-anchor="middle" dominant-baseline="middle">E</text>
  <text class="tx tx-b" x="400" y="236" text-anchor="middle" dominant-baseline="middle">S</text>
  <text class="tx tx-b" x="304" y="140" text-anchor="middle" dominant-baseline="middle">W</text>
  <text class="tx-m" x="400" y="262" text-anchor="middle" dominant-baseline="middle">right turn = clockwise</text>
</svg>`, caption: "Ex 4: 4 km N, right 6 km E, right 12 km S. Net 6 E and 8 S → 10 km south-east of the start (not to scale)." },
        ex("Ex 4. Walk 4 km north, turn right and walk 6 km, turn right and walk 12 km. Distance and direction from start?", ["Net: east 6, north 4 − 12 = 8 south.", "√(6² + 8²) = <b>10 km, south-east</b>."]),
        ex("Ex 5. Facing north, a man turns 90° clockwise, then 180° anticlockwise, then 45° clockwise. Final direction?", ["N → E → W → 45° clockwise from W = <b>north-west</b>."]),
        ex("Ex 6. At sunrise Ravi faces a pole and its shadow falls exactly to his right. Which way is he facing?", ["Sunrise: sun east, shadow west. His right = west.", "Right is west when facing <b>south</b>."])
      ] },
      { h: "Traps", blocks: [
        { warn: "‘Turns left’ depends on the direction you are currently facing — track the facing direction after every turn, not the map direction." },
        { warn: "Don't assume gender from a relation word like ‘child’, ‘cousin’ or ‘spouse’ — if it isn't fixed, the answer may be ‘cannot be determined’." }
      ] }
    ],
    practice: [
      { q: "Introducing a woman, a man says, ‘Her mother is the only daughter of my mother.’ How is the woman related to him?", a: "Only daughter of his mother = his sister → the woman is his sister's daughter → <b>niece</b>." },
      { q: "X is Y's brother. Y is Z's daughter. Z is W's husband. How is X related to W?", a: "W is the mother of Y and X → <b>son</b>." },
      { q: "‘M # N’ means M is the wife of N; ‘N @ O’ means N is the father of O. What is M to O in M # N @ O?", a: "M is married to O's father → <b>mother</b> (the puzzle assumes the only wife is the parent)." },
      { q: "A man walks 3 km east, 4 km north, then 3 km west. Where is he relative to the start?", a: "East–west cancels → <b>4 km north</b>." },
      { q: "In the evening, A's shadow falls to his left. Which direction is he facing?", a: "Evening sun west → shadow east. Left = east ⇒ facing <b>south</b>." },
      { q: "Ravi drives 15 km south, turns left and drives 8 km. How far is he from home?", a: "Left from south = east. √(15² + 8²) = <b>17 km, south-east</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Syllogism ───────────────────────── */
  add({
    id: "apt-syllogism",
    subject: "aptitude",
    title: "Syllogism — Venn method, definite vs possibility conclusions",
    minutes: 30,
    crux: [
      "Four statement types: <b>All A are B</b>, <b>No A is B</b>, <b>Some A are B</b>, <b>Some A are not B</b>.",
      "A conclusion follows only if it is true in <b>every</b> diagram that satisfies the statements.",
      "Conversions that are safe: All A are B → Some B are A; No A is B ↔ No B is A; Some A are B ↔ Some B are A. ‘Some not’ cannot be converted.",
      "Key combos: All+All = All; All+No = No; Some+All = Some; Some+No = Some-not; All+Some, Some+Some, No+No → nothing definite.",
      "Possibility (‘can be’, ‘is a possibility’) follows if you can draw at least one valid diagram where it is true.",
      "<b>Either–or</b>: two conclusions about the same pair, neither definite, which together cover all cases (Some / No, or All / Some-not)."
    ],
    sections: [
      { h: "Combination table", blocks: [
        { table: { head: ["Statement 1 (A–B)", "Statement 2 (B–C)", "Definite conclusion"], rows: [
          ["All A are B", "All B are C", "All A are C"],
          ["All A are B", "No B is C", "No A is C"],
          ["Some A are B", "All B are C", "Some A are C"],
          ["Some A are B", "No B is C", "Some A are not C"],
          ["No A is B", "All B are C", "Some C are not A"],
          ["All A are B", "Some B are C", "none"],
          ["Some A are B", "Some B are C", "none"],
          ["No A is B", "No B is C", "none"]
        ] } },
        { p: "Why ‘No A is B + All B are C → Some C are not A’: every B is inside C and no B is an A, so the C's that are B's are not A's." }
      ] },
      { h: "Venn method", blocks: [
        { svg: `<svg viewBox="0 0 600 200" width="600" class="dg">
  <circle class="ln" cx="140" cy="105" r="85"/>
  <circle class="ln" cx="140" cy="115" r="55"/>
  <circle class="ln-a" cx="140" cy="125" r="28"/>
  <text class="tx tx-b" x="140" y="35" text-anchor="middle" dominant-baseline="middle">Tables</text>
  <text class="tx tx-b" x="140" y="75" text-anchor="middle" dominant-baseline="middle">Books</text>
  <text class="tx-a" x="140" y="125" text-anchor="middle" dominant-baseline="middle">Pens</text>
  <circle class="ln" cx="360" cy="105" r="60"/>
  <circle class="ln" cx="440" cy="105" r="60"/>
  <circle class="ln" cx="555" cy="105" r="40"/>
  <text class="tx tx-b" x="335" y="105" text-anchor="middle" dominant-baseline="middle">Cats</text>
  <text class="tx tx-b" x="465" y="105" text-anchor="middle" dominant-baseline="middle">Dogs</text>
  <text class="tx tx-b" x="555" y="105" text-anchor="middle" dominant-baseline="middle">Rats</text>
  <text class="tx-m" x="400" y="180" text-anchor="middle" dominant-baseline="middle">cats∩dogs are surely not rats</text>
</svg>`, caption: "Left: Ex 1 (nested). Right: Ex 2 — rats may or may not touch the cats-only part, but never the cat∩dog part." },
        ex("Ex 1. All pens are books. All books are tables. I: All pens are tables. II: Some tables are pens.", ["Nested circles: Pens ⊂ Books ⊂ Tables.", "I follows; II is the conversion of I → follows. <b>Both follow.</b>"]),
        ex("Ex 2. Some cats are dogs. No dog is a rat. I: Some cats are not rats. II: No cat is a rat.", ["The cats that are dogs can never be rats → I follows.", "Cats outside dogs may overlap rats → II not definite. <b>Only I.</b>"]),
        ex("Ex 3. All roses are flowers. Some flowers are red. I: Some roses are red. II: Some red things are roses.", ["Draw the red circle overlapping flowers but not roses — valid diagram where both are false.", "<b>Neither follows.</b>"]),
        ex("Ex 4. Some doors are windows. Some windows are walls. I: Some doors are walls. II: No door is a wall.", ["Neither is definite (Some + Some).", "I and II are a Some/No pair about doors–walls → one must be true. <b>Either I or II.</b>"]),
        ex("Ex 5. All teachers are doctors. No doctor is a lawyer. I: No teacher is a lawyer. II: All lawyers being teachers is a possibility.", ["All + No → No teacher is a lawyer: I follows.", "II contradicts I → impossible. <b>Only I.</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "Do not use real-world knowledge. ‘All cats are dogs’ is accepted as true inside the question." },
        { warn: "Either–or needs <b>both</b> conclusions individually not following AND same subject–predicate pair. If one follows definitely, it's not an either–or." }
      ] }
    ],
    practice: [
      { q: "All phones are laptops. Some laptops are tablets. I: Some phones are tablets. II: Some tablets are laptops.", a: "I is All + Some → no definite conclusion. II is the conversion of statement 2 → follows. <b>Only II.</b>" },
      { q: "No bird is a fish. All fish are animals. I: Some animals are not birds. II: No animal is a bird.", a: "No + All → Some animals (the fish) are not birds → <b>only I</b>." },
      { q: "Some pens are pencils. All pencils are erasers. I: Some pens are erasers. II: All erasers are pencils.", a: "Some + All → Some pens are erasers (I follows). II is not implied. <b>Only I.</b>" },
      { q: "All A are B. No B is C. I: No A is C. II: Some C are A is a possibility.", a: "All + No → I follows; II contradicts I → <b>only I</b>." },
      { q: "Some cups are plates. No plate is a spoon. I: Some cups are spoons. II: No cup is a spoon.", a: "Some + No → Some cups are not spoons, but neither I nor II is definite; they form a Some/No pair → <b>either I or II</b>." },
      { q: "All kings are queens. All queens are jacks. I: Some jacks are kings. II: All jacks are kings.", a: "Kings ⊂ Queens ⊂ Jacks: I follows (conversion of All kings are jacks); II does not → <b>only I</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Data Interpretation ───────────────────────── */
  add({
    id: "apt-di",
    subject: "aptitude",
    title: "Data Interpretation — tables, bar charts, pie charts",
    minutes: 40,
    crux: [
      "Read the <b>title, units and scale</b> first (thousands? ₹ crore? %?).",
      "% change = (new − old)/old × 100. % share = part/total × 100.",
      "Pie charts: angle = % × 3.6°; value = % × total/100.",
      "‘Which is the highest/lowest’ → <b>compare, don't compute</b>: eyeball, approximate with fractions.",
      "Growth over years: simple average ≠ compound growth; read which one is asked.",
      "Ratios of totals: add first, then simplify (don't average ratios)."
    ],
    sections: [
      { h: "Set 1 — table", blocks: [
        { p: "<b>Production (thousand units) of four companies</b>" },
        { table: { head: ["Year", "A", "B", "C", "D", "Total"], rows: [
          ["2019", "40", "55", "30", "25", "150"],
          ["2020", "45", "50", "35", "30", "160"],
          ["2021", "50", "60", "40", "30", "180"],
          ["2022", "60", "65", "45", "35", "205"],
          ["2023", "65", "70", "50", "40", "225"]
        ] } },
        ex("Q1. % increase in A's production from 2019 to 2023?", ["(65 − 40)/40 = 25/40 = <b>62.5%</b>"]),
        ex("Q2. Average production of B over the five years?", ["(55 + 50 + 60 + 65 + 70)/5 = 300/5 = <b>60 thousand</b>"]),
        ex("Q3. Ratio of C's total to D's total?", ["C = 200, D = 160 → <b>5 : 4</b>"]),
        ex("Q4. Which company grew fastest (in %) from 2022 to 2023?", ["Every company grew by 5 → the smallest base wins: D (5/35 ≈ 14.3%) vs C 11.1%, A 8.3%, B 7.7%.", "<b>D</b>"])
      ] },
      { h: "Set 2 — bar chart", blocks: [
        { svg: `<svg viewBox="0 0 480 250" width="480" class="dg">
  <line class="ln ln-d" x1="60" y1="160" x2="460" y2="160"/>
  <line class="ln ln-d" x1="60" y1="120" x2="460" y2="120"/>
  <line class="ln ln-d" x1="60" y1="80" x2="460" y2="80"/>
  <line class="ln ln-d" x1="60" y1="40" x2="460" y2="40"/>
  <line class="ln" x1="60" y1="200" x2="460" y2="200"/>
  <line class="ln" x1="60" y1="30" x2="60" y2="200"/>
  <text class="tx-m" x="48" y="200" text-anchor="middle" dominant-baseline="middle">0</text>
  <text class="tx-m" x="48" y="160" text-anchor="middle" dominant-baseline="middle">10</text>
  <text class="tx-m" x="48" y="120" text-anchor="middle" dominant-baseline="middle">20</text>
  <text class="tx-m" x="48" y="80" text-anchor="middle" dominant-baseline="middle">30</text>
  <text class="tx-m" x="48" y="40" text-anchor="middle" dominant-baseline="middle">40</text>
  <rect class="box-a" x="75" y="120" width="40" height="80"/>
  <rect class="box-a" x="140" y="100" width="40" height="100"/>
  <rect class="box-a" x="205" y="80" width="40" height="120"/>
  <rect class="box-r" x="270" y="140" width="40" height="60"/>
  <rect class="box-a" x="335" y="60" width="40" height="140"/>
  <rect class="box-g" x="400" y="40" width="40" height="160"/>
  <text class="tx" x="95" y="112" text-anchor="middle" dominant-baseline="middle">20</text>
  <text class="tx" x="160" y="92" text-anchor="middle" dominant-baseline="middle">25</text>
  <text class="tx" x="225" y="72" text-anchor="middle" dominant-baseline="middle">30</text>
  <text class="tx" x="290" y="132" text-anchor="middle" dominant-baseline="middle">15</text>
  <text class="tx" x="355" y="52" text-anchor="middle" dominant-baseline="middle">35</text>
  <text class="tx" x="420" y="32" text-anchor="middle" dominant-baseline="middle">40</text>
  <text class="tx-m" x="95" y="216" text-anchor="middle" dominant-baseline="middle">Jan</text>
  <text class="tx-m" x="160" y="216" text-anchor="middle" dominant-baseline="middle">Feb</text>
  <text class="tx-m" x="225" y="216" text-anchor="middle" dominant-baseline="middle">Mar</text>
  <text class="tx-m" x="290" y="216" text-anchor="middle" dominant-baseline="middle">Apr</text>
  <text class="tx-m" x="355" y="216" text-anchor="middle" dominant-baseline="middle">May</text>
  <text class="tx-m" x="420" y="216" text-anchor="middle" dominant-baseline="middle">Jun</text>
  <text class="tx-m" x="260" y="240" text-anchor="middle" dominant-baseline="middle">Monthly sales of a store (₹ lakh)</text>
</svg>`, caption: "Bar chart for Set 2." },
        ex("Q5. % fall in sales from March to April?", ["(30 − 15)/30 = <b>50%</b>"]),
        ex("Q6. Average monthly sales; how many months were above average?", ["(20 + 25 + 30 + 15 + 35 + 40)/6 = 165/6 = <b>27.5 lakh</b>.", "Above 27.5: Mar, May, Jun → <b>3 months</b>."]),
        ex("Q7. % increase from April to May?", ["(35 − 15)/15 = 20/15 = <b>133.3%</b>"])
      ] },
      { h: "Set 3 — pie chart", blocks: [
        { svg: `<svg viewBox="0 0 420 230" width="420" class="dg">
  <path class="box-a" d="M110,110 L110.0,20.0 A90,90 0 0 1 200.0,110.0 Z"/>
  <path class="box-g" d="M110,110 L200.0,110.0 A90,90 0 0 1 82.2,195.6 Z"/>
  <path class="box-p" d="M110,110 L82.2,195.6 A90,90 0 0 1 24.4,137.8 Z"/>
  <path class="box-w" d="M110,110 L24.4,137.8 A90,90 0 0 1 24.4,82.2 Z"/>
  <path class="box" d="M110,110 L24.4,82.2 A90,90 0 0 1 110.0,20.0 Z"/>
  <text class="tx" x="151" y="69" text-anchor="middle" dominant-baseline="middle">25%</text>
  <text class="tx" x="144" y="157" text-anchor="middle" dominant-baseline="middle">30%</text>
  <text class="tx" x="69" y="151" text-anchor="middle" dominant-baseline="middle">15%</text>
  <text class="tx" x="52" y="110" text-anchor="middle" dominant-baseline="middle">10%</text>
  <text class="tx" x="76" y="63" text-anchor="middle" dominant-baseline="middle">20%</text>
  <rect class="box-a" x="250" y="40" width="14" height="14"/>
  <text class="tx" x="274" y="47" dominant-baseline="middle">Rent</text>
  <rect class="box-g" x="250" y="70" width="14" height="14"/>
  <text class="tx" x="274" y="77" dominant-baseline="middle">Food</text>
  <rect class="box-p" x="250" y="100" width="14" height="14"/>
  <text class="tx" x="274" y="107" dominant-baseline="middle">Education</text>
  <rect class="box-w" x="250" y="130" width="14" height="14"/>
  <text class="tx" x="274" y="137" dominant-baseline="middle">Transport</text>
  <rect class="box" x="250" y="160" width="14" height="14"/>
  <text class="tx" x="274" y="167" dominant-baseline="middle">Savings</text>
</svg>`, caption: "A family's monthly income of ₹60,000 split by head." },
        ex("Q8. Central angle of Food?", ["30 × 3.6 = <b>108°</b>"]),
        ex("Q9. How much more is spent on Food than Transport?", ["20% of 60,000 = <b>₹12,000</b>"]),
        ex("Q10. Rent rises by 20% and the increase is taken out of Savings. New Savings share?", ["Rent 15,000 → 18,000 (+3,000). Savings 12,000 → 9,000.", "9,000/60,000 = <b>15%</b>"])
      ] },
      { h: "Speed tricks & traps", blocks: [
        { ul: [
          "Approximate: 27.5/165 ≈ 1/6. Options are usually far enough apart.",
          "Line graphs: the steepest segment = biggest absolute change, not necessarily biggest % change.",
          "Stacked/multiple bars: check whether bars are absolute values or percentages."
        ] },
        { warn: "Percentage-point change ≠ percentage change: a share going from 20% to 25% is +5 points but +25%." }
      ] }
    ],
    practice: [
      { q: "(Set 1) In which year was total production the highest, and what % of it did B produce?", a: "2023 (225); B = 70/225 ≈ <b>31.1%</b>." },
      { q: "(Set 1) By what % did total production grow from 2019 to 2023?", a: "(225 − 150)/150 = <b>50%</b>." },
      { q: "(Set 2) What fraction of the half-year's sales came in June?", a: "40/165 = <b>8/33 ≈ 24.2%</b>." },
      { q: "(Set 3) Ratio of Education to Savings spending? Angle of Rent?", a: "15 : 20 = <b>3 : 4</b>; Rent = 25 × 3.6 = <b>90°</b>." },
      { q: "A company has 1,200 employees; 40% are in tech, and 25% of tech employees are women. Women are 30% of the whole company. How many women work outside tech?", a: "Tech women = 0.25 × 480 = 120. All women = 360. Non-tech women = <b>240</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Clocks & Calendars ───────────────────────── */
  add({
    id: "apt-clocks-calendars",
    subject: "aptitude",
    title: "Clocks & Calendars — hand angles, odd days, day of the week",
    minutes: 35,
    crux: [
      "Minute hand 6°/min, hour hand 0.5°/min ⇒ relative speed <b>5.5°/min</b>.",
      "Angle at H:M = <b>|30H − 5.5M|</b>; if > 180°, take 360° − it.",
      "Hands coincide every 65 5⁄11 min: 11 times in 12 h, <b>22 times a day</b>. Right angle 44 times/day; opposite 22 times/day.",
      "Odd days: normal year 1, leap year 2; 100 yrs = 5, 200 = 3, 300 = 1, <b>400 = 0</b>.",
      "Leap year: divisible by 4; century years only if divisible by 400 (2000 yes, 1900/2100 no).",
      "Month odd days: 31-day month 3, 30-day month 2, Feb 0 (leap 1). Day code: 0 Sun, 1 Mon, …, 6 Sat."
    ],
    sections: [
      { h: "Clocks", blocks: [
        { svg: `<svg viewBox="0 0 440 220" width="440" class="dg">
  <circle class="box" cx="110" cy="110" r="90"/>
  <text class="tx tx-b" x="110" y="32" text-anchor="middle" dominant-baseline="middle">12</text>
  <text class="tx tx-b" x="188" y="110" text-anchor="middle" dominant-baseline="middle">3</text>
  <text class="tx tx-b" x="110" y="188" text-anchor="middle" dominant-baseline="middle">6</text>
  <text class="tx tx-b" x="32" y="110" text-anchor="middle" dominant-baseline="middle">9</text>
  <text class="tx-m" x="42" y="149" text-anchor="middle" dominant-baseline="middle">8</text>
  <line class="ln-a" x1="110" y1="110" x2="45.1" y2="147.5" marker-end="url(#dg-arr-a)"/>
  <line class="ln" x1="110" y1="110" x2="160.8" y2="128.5" marker-end="url(#dg-arr)"/>
  <circle class="box-a" cx="110" cy="110" r="4"/>
  <text class="tx-a" x="300" y="70" text-anchor="middle" dominant-baseline="middle">3:40</text>
  <text class="tx" x="300" y="100" text-anchor="middle" dominant-baseline="middle">hour hand: 30×3 + 0.5×40 = 110°</text>
  <text class="tx" x="300" y="122" text-anchor="middle" dominant-baseline="middle">minute hand: 6×40 = 240°</text>
  <text class="tx tx-b" x="300" y="150" text-anchor="middle" dominant-baseline="middle">angle = 130°</text>
</svg>`, caption: "Both hands measured clockwise from 12. The hour hand has moved 20° past the 3." },
        ex("Ex 1. Angle between the hands at 3:40?", ["|30 × 3 − 5.5 × 40| = |90 − 220| = <b>130°</b>"]),
        ex("Ex 2. Angle at 7:20?", ["|210 − 110| = <b>100°</b>"]),
        ex("Ex 3. When between 4 and 5 o'clock are the hands together?", ["30 × 4 = 5.5M → M = 120/5.5 = <b>21 9⁄11 min past 4</b>"]),
        ex("Ex 4. When between 2 and 3 are the hands at right angles?", ["|60 − 5.5M| = 90 → 5.5M = 150 → M = <b>27 3⁄11 min past 2</b> (the other solution is exactly 3:00, the boundary)."]),
        ex("Ex 5. A clock gains 5 min every hour. It is set right at 8 a.m. What is the true time when it shows 2 p.m.?", ["65 clock-minutes = 60 true minutes. Clock ran 360 min → true = 360 × 60/65 = 332 4⁄13 min = 5 h 32 4⁄13 min.", "<b>≈ 1:32 p.m.</b>"])
      ] },
      { h: "Calendars — odd-day method", blocks: [
        { p: "Count the odd days (days left over after full weeks) from a reference point where the count is 0, then read the weekday: 0 = Sunday, 1 = Monday, …, 6 = Saturday. Years 1–400 (and every 400-year block) have 0 odd days." },
        { table: { head: ["Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], rows: [
          ["Odd days", "3", "0/1", "3", "2", "3", "2", "3", "3", "2", "3", "2", "3"]
        ] } },
        ex("Ex 6. Day of the week on 15 August 1947?", ["1600 yrs → 0. 1601–1900 (300 yrs) → 1. 1901–1946: 11 leap + 35 normal = 57 → 1.", "1947 up to 15 Aug: 3+0+3+2+3+2+3 = 16, plus 15 → 31 → 3.", "Total 0 + 1 + 1 + 3 = 5 → <b>Friday</b>"]),
        ex("Ex 7. Day of the week on 26 January 1950?", ["1900 yrs → 1. 1901–1949: 12 leap + 37 normal = 61 → 5. 26 Jan → 5.", "1 + 5 + 5 = 11 → 4 → <b>Thursday</b>"]),
        ex("Ex 8. 1 Jan 2023 was a Sunday. What day was 1 Jan 2024? 1 Jan 2025?", ["2023 is normal (+1) → <b>Monday</b>. 2024 is leap (+2) → <b>Wednesday</b>."])
      ] },
      { h: "Traps", blocks: [
        { warn: "The same date one year later moves forward <b>2</b> weekdays only if a 29 February lies between the two dates; otherwise it moves 1." },
        { warn: "Right-angle count: 44 per day, not 48 (at 3 and 9 o'clock two occurrences merge each half-day)." }
      ] }
    ],
    practice: [
      { q: "Angle between the hands at 9:15?", a: "|270 − 82.5| = 187.5° → reflex, so <b>172.5°</b>." },
      { q: "When between 7 and 8 are the hands exactly opposite?", a: "210 − 5.5M = 180 → M = <b>5 5⁄11 min past 7</b>." },
      { q: "How many times in a day are the hands in a straight line (together or opposite)?", a: "22 + 22 = <b>44</b>." },
      { q: "What day was 1 January 2000?", a: "1600 → 0, 300 → 1, 1901–1999: 24 leap + 75 normal = 123 → 4; +1 for 1 Jan → total 6 → <b>Saturday</b>." },
      { q: "Is 2100 a leap year?", a: "Century year not divisible by 400 → <b>no</b>." },
      { q: "Today is Monday. What day will it be after 61 days?", a: "61 mod 7 = 5 → Monday + 5 = <b>Saturday</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Cubes & Dice ───────────────────────── */
  add({
    id: "apt-cubes-dice",
    subject: "aptitude",
    title: "Cubes & Dice — painted cubes, opposite faces, nets",
    minutes: 30,
    crux: [
      "Painted cube cut into n × n × n: 3 faces painted = <b>8</b> (corners); 2 faces = <b>12(n − 2)</b>; 1 face = <b>6(n − 2)²</b>; none = <b>(n − 2)³</b>.",
      "Minimum cuts for n³ equal pieces = 3(n − 1).",
      "Two faces that appear together in any view are <b>adjacent</b>, never opposite. The face adjacent to four known numbers is opposite the fifth-missing one.",
      "Standard die: opposite faces sum to 7 (1–6, 2–5, 3–4).",
      "Net: in a straight line of faces, <b>alternate</b> faces (1st & 3rd, 2nd & 4th) are opposite. Two squares sharing an edge in the net are never opposite.",
      "Faces hanging off the two long sides of a 4-in-a-row strip are the top and bottom — opposite each other."
    ],
    sections: [
      { h: "Painted cubes", blocks: [
        { table: { head: ["n (per edge)", "Total", "3 faces", "2 faces", "1 face", "0 faces"], rows: [
          ["3", "27", "8", "12", "6", "1"],
          ["4", "64", "8", "24", "24", "8"],
          ["5", "125", "8", "36", "54", "27"],
          ["6", "216", "8", "48", "96", "64"]
        ] } },
        ex("Ex 1. A painted cube is cut into 125 equal cubes. How many have no paint? Exactly one face?", ["n = 5 → none = 3³ = <b>27</b>; one face = 6 × 9 = <b>54</b>."]),
        ex("Ex 2. A cube has two opposite faces red, two blue, two green, and is cut into 27 cubes. How many small cubes show all three colours? Only red and green?", ["Every corner touches one face from each pair → <b>8</b>.", "Red–green edges: 2 red × 2 green = 4 edges, each with n − 2 = 1 middle cube → <b>4</b>."]),
        ex("Ex 3. Minimum cuts to divide a cube into 27 identical pieces?", ["2 cuts per direction × 3 = <b>6</b>."])
      ] },
      { h: "Dice", blocks: [
        ex("Ex 4. Across four views of a die, the faces seen next to 3 are 1, 2, 5 and 6. Which face is opposite 3?", ["A face adjacent to 3 can't be opposite it; the only number never seen beside 3 is 4.", "<b>4</b>"]),
        ex("Ex 5. Two views of the same die: (top 1, front 2, right 3) and (top 1, front 4, right 2). What is opposite 3?", ["1 is on top in both views, so 2, 3 and 4 are side faces around it.", "Turning the die about the vertical axis keeps the cyclic order front → right. View 2 gives 4 → 2; view 1 gives 2 → 3. So the ring of side faces is 4, 2, 3, (fourth face).", "On a ring of four side faces, faces two steps apart are opposite → 4 ↔ 3. <b>Answer: 4</b>"])
      ] },
      { h: "Cube nets", blocks: [
        { svg: `<svg viewBox="0 0 400 200" width="400" class="dg">
  <rect class="box" x="40" y="70" width="60" height="60"/>
  <rect class="box-a" x="100" y="70" width="60" height="60"/>
  <rect class="box" x="160" y="70" width="60" height="60"/>
  <rect class="box-a" x="220" y="70" width="60" height="60"/>
  <rect class="box-g" x="100" y="10" width="60" height="60"/>
  <rect class="box-g" x="100" y="130" width="60" height="60"/>
  <text class="tx tx-b" x="70" y="100" text-anchor="middle" dominant-baseline="middle">A</text>
  <text class="tx tx-b" x="130" y="100" text-anchor="middle" dominant-baseline="middle">B</text>
  <text class="tx tx-b" x="190" y="100" text-anchor="middle" dominant-baseline="middle">C</text>
  <text class="tx tx-b" x="250" y="100" text-anchor="middle" dominant-baseline="middle">D</text>
  <text class="tx tx-b" x="130" y="40" text-anchor="middle" dominant-baseline="middle">E</text>
  <text class="tx tx-b" x="130" y="160" text-anchor="middle" dominant-baseline="middle">F</text>
  <text class="tx" x="340" y="80" text-anchor="middle" dominant-baseline="middle">A ↔ C</text>
  <text class="tx" x="340" y="102" text-anchor="middle" dominant-baseline="middle">B ↔ D</text>
  <text class="tx" x="340" y="124" text-anchor="middle" dominant-baseline="middle">E ↔ F</text>
</svg>`, caption: "Cross net: the row A-B-C-D wraps into a band (alternate faces opposite); E and F become the lids." },
        { p: "Fold mentally: the 4-strip A B C D becomes the four walls, so A faces C and B faces D. E and F attach to opposite long edges of the strip, so they become top and bottom — opposite each other, whichever wall they hang from." }
      ] },
      { h: "Traps", blocks: [
        { warn: "Not every die is ‘standard’ — use the sum-to-7 rule only when the question says standard die or the views confirm it." },
        { warn: "If only some faces are painted, recount: e.g. only top and bottom painted on a 4×4×4 → unpainted = 64 − 2 × 16 = 32." }
      ] }
    ],
    practice: [
      { q: "A painted 6×6×6 cube is cut into 216 unit cubes. Exactly two faces painted? One face? None?", a: "12 × 4 = <b>48</b>; 6 × 16 = <b>96</b>; 4³ = <b>64</b>." },
      { q: "A 10 cm painted cube is cut into 2 cm cubes. How many have exactly one painted face?", a: "n = 5 → 6 × 3² = <b>54</b>." },
      { q: "A standard die shows 3 on top. What is at the bottom?", a: "7 − 3 = <b>4</b>." },
      { q: "In a net, squares 1-2-3-4 form a row, 5 is attached above 2 and 6 below 3. Which face is opposite 5?", a: "5 and 6 hang off opposite long sides of the strip → <b>6</b> (and 1–3, 2–4 are opposite)." },
      { q: "A 4×4×4 cube has only its top and bottom painted. How many unit cubes have no paint?", a: "64 − 16 − 16 = <b>32</b>." },
      { q: "A painted 3×3×3 cube: how many unit cubes have exactly one face painted?", a: "6 × 1² = <b>6</b> (the face centres)." }
    ],
    related: []
  });

  /* ───────────────────────── Coding-Decoding ───────────────────────── */
  add({
    id: "apt-coding-decoding",
    subject: "aptitude",
    title: "Coding-Decoding — letter shifts, reverse alphabet, word codes",
    minutes: 25,
    crux: [
      "Know positions cold: A1 … Z26. Anchors <b>E J O T Y = 5 10 15 20 25</b>.",
      "Reverse-alphabet pair: letter ↔ (27 − position): A↔Z, B↔Y, M↔N. Pairs sum to 27.",
      "Test the pattern on <b>every</b> letter before using it: +k shift, +1 +2 +3 …, reverse, word reversed then shifted, positional swap.",
      "Wrap-around: after Z comes A (Y + 2 = A).",
      "Sentence codes: the word common to two sentences has the code common to both.",
      "Number codes: sum of positions, product, or letter → digit mapping from given words."
    ],
    sections: [
      { h: "Pattern catalogue", blocks: [
        { table: { head: ["Type", "Example", "Rule"], rows: [
          ["Constant shift", "COLD → DPME", "+1 each"],
          ["Increasing shift", "PAPER → QCSIW", "+1, +2, +3, +4, +5"],
          ["Reverse alphabet", "GIRL → TRIO", "27 − position"],
          ["Reverse then shift", "SING → HOJT", "GNIS, then +1"],
          ["Letter → digit", "DELHI → 73541", "fixed letter-digit map"],
          ["Sum of positions", "CAT → 24", "3 + 1 + 20"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. If COLD → DPME, how is WARM written?", ["Each letter +1 → <b>XBSN</b>"]),
        ex("Ex 2. If GIRL → TRIO, check the rule and code BOX.", ["G7↔T20, I9↔R18, R18↔I9, L12↔O15: pairs sum to 27 → reverse alphabet.", "B↔Y, O↔L, X↔C → <b>YLC</b>"]),
        ex("Ex 3. If PAPER → QCSIW, code TABLE.", ["Shifts +1 +2 +3 +4 +5.", "T+1 = U, A+2 = C, B+3 = E, L+4 = P, E+5 = J → <b>UCEPJ</b>"]),
        ex("Ex 4. If DELHI = 73541 and CALCUTTA = 82589662, code CALICUT.", ["Map: D7 E3 L5 H4 I1 C8 A2 U9 T6.", "C A L I C U T → <b>8251896</b>"]),
        ex("Ex 5. If CAT = 24, what is DOG?", ["3 + 1 + 20 = 24 → sum of positions.", "4 + 15 + 7 = <b>26</b>"]),
        ex("Ex 6. If SING → HOJT, code DANCE.", ["SING reversed = GNIS; +1 → HOJT ✓.", "DANCE reversed = ECNAD; +1 → <b>FDOBE</b>"]),
        ex("Ex 7. ‘pit na sa’ = ‘you are good’, ‘na ka ja’ = ‘we are bad’, ‘sa ho ma’ = ‘good and fine’. Code for ‘you’?", ["Sentences 1 & 2 share ‘are’ ↔ ‘na’. Sentences 1 & 3 share ‘good’ ↔ ‘sa’.", "Remaining in sentence 1: ‘you’ = <b>pit</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "A rule that fits the first two letters may fail at the third — verify all letters; options are designed around half-right rules." },
        { tip: "Write the alphabet with positions once at the top of your rough sheet in the exam; it pays for itself in two questions." }
      ] }
    ],
    practice: [
      { q: "If ROSE → TQUG, code LILY.", a: "+2 each (Y + 2 wraps to A) → <b>NKNA</b>." },
      { q: "If A = 1, B = 2 …, and FACE = 15, what is BEAD?", a: "Sum of positions: 2 + 5 + 1 + 4 = <b>12</b>." },
      { q: "If MONKEY → XDJMNL, code TIGER.", a: "Reverse (YEKNOM) then −1 each → XDJMNL ✓. TIGER → REGIT → <b>QDFHS</b>." },
      { q: "‘tee see pee’ = ‘drink fruit juice’, ‘see kee lee’ = ‘juice is sweet’, ‘lee ree mee’ = ‘he is intelligent’. Code for ‘sweet’?", a: "juice = see (1∩2), is = lee (2∩3) → sweet = <b>kee</b>." },
      { q: "‘art and craft’ = 2 4 5, ‘dance and music’ = 6 1 4, ‘music is art’ = 1 7 2. Code for ‘craft’?", a: "and = 4 (1∩2), art = 2 (1∩3) → craft = <b>5</b> (also music = 1)." },
      { q: "In reverse-alphabet coding, what is WIND?", a: "W↔D, I↔R, N↔M, D↔W → <b>DRMW</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Series & Analogies ───────────────────────── */
  add({
    id: "apt-series-analogies",
    subject: "aptitude",
    title: "Series & Analogies — number, letter, odd one out",
    minutes: 30,
    crux: [
      "Checklist in order: <b>differences</b> (and differences of differences) → <b>ratios</b> → squares/cubes ± k → ×a + b → <b>alternate terms</b> → primes/Fibonacci.",
      "Fast growth (×2, ×3) → think multiplication; slow steady growth → differences.",
      "Letter series: convert to positions and treat as a number series; reverse positions (27 − n) for backwards patterns.",
      "Analogy: state the relationship in a sentence (‘X is used to do Y’, ‘X works in Y’) and apply the same sentence.",
      "Odd one out: look for the property shared by all but one (prime, square, same category, vowel count)."
    ],
    sections: [
      { h: "Patterns to recognise", blocks: [
        { table: { head: ["Series", "Pattern", "Next"], rows: [
          ["2, 6, 12, 20, 30", "n(n + 1)", "42"],
          ["3, 7, 15, 31, 63", "×2 + 1", "127"],
          ["2, 3, 5, 9, 17", "differences 1, 2, 4, 8", "33"],
          ["4, 9, 20, 43, 90", "×2 + 1, ×2 + 2, ×2 + 3, …", "185"],
          ["1, 3, 4, 8, 7, 13, 10", "two series: +3 and +5", "18"],
          ["120, 99, 80, 63, 48", "11² − 1, 10² − 1, …", "35"],
          ["1, 2, 6, 24, 120", "×2, ×3, ×4, ×5", "720"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. 5, 11, 23, 47, ?", ["Each term = previous × 2 + 1.", "47 × 2 + 1 = <b>95</b>"]),
        ex("Ex 2. 4, 9, 20, 43, 90, ?", ["4×2+1 = 9, 9×2+2 = 20, 20×2+3 = 43, 43×2+4 = 90.", "90 × 2 + 5 = <b>185</b>"]),
        ex("Ex 3. 1, 3, 4, 8, 7, 13, 10, ?", ["Odd places: 1, 4, 7, 10 (+3). Even places: 3, 8, 13 (+5).", "Next even-place term = <b>18</b>"]),
        ex("Ex 4. Find the wrong term: 1, 4, 9, 16, 23, 36.", ["Perfect squares; 23 should be 25.", "<b>23</b>"]),
        ex("Ex 5. A, C, F, J, O, ?", ["Positions 1, 3, 6, 10, 15 (differences 2, 3, 4, 5).", "15 + 6 = 21 = <b>U</b>"]),
        ex("Ex 6. AZ, BY, CX, ?", ["First letter +1, second −1 (reverse pairs).", "<b>DW</b>"]),
        ex("Ex 7. Analogies: Doctor : Hospital :: Teacher : ? — Pen : Write :: Knife : ? — 3 : 27 :: 5 : ? — ACE : BDF :: GIK : ?", ["Works in → <b>School</b>. Used to → <b>Cut</b>. Cube → <b>125</b>. Each letter +1 → <b>HJL</b>."]),
        ex("Ex 8. Odd one out: 2, 3, 5, 9, 11.", ["All prime except 9.", "<b>9</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "If differences don't settle after two levels, stop and try ratios or alternate terms — don't compute third differences blindly." },
        { tip: "Analogy options often include a word with the right ‘topic’ but wrong relationship (Doctor : Hospital :: Teacher : Student). Test the sentence, not the topic." }
      ] }
    ],
    practice: [
      { q: "7, 10, 16, 25, 37, ?", a: "Differences 3, 6, 9, 12 → next 15 → <b>52</b>." },
      { q: "120, 99, 80, 63, 48, ?", a: "n² − 1 for n = 11 … 7 → 6² − 1 = <b>35</b>." },
      { q: "Z, X, U, Q, L, ?", a: "Positions 26, 24, 21, 17, 12 (−2, −3, −4, −5) → 12 − 6 = 6 = <b>F</b>." },
      { q: "1, 2, 6, 24, 120, ?", a: "×2, ×3, ×4, ×5, ×6 → <b>720</b>." },
      { q: "Odd one out: 121, 144, 169, 196, 210.", a: "All perfect squares except <b>210</b>." },
      { q: "8 : 64 :: 11 : ?", a: "Square → <b>121</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Statement & Conclusion ───────────────────────── */
  add({
    id: "apt-statement-conclusion",
    subject: "aptitude",
    title: "Statement–Conclusion, Assumption, Course of Action, Arguments",
    minutes: 30,
    crux: [
      "<b>Conclusion</b>: must follow directly from the statement (plus universally known facts). No outside opinions.",
      "<b>Assumption</b>: an unstated belief the speaker must hold for the statement to make sense (ad → people read ads; rule → people will comply).",
      "<b>Course of action</b>: practical, feasible, addresses the stated problem, doesn't create a bigger one.",
      "<b>Strong argument</b>: directly related, important, backed by fact/logic — not ‘everyone does it’, not trivial, not a question in return.",
      "Words like <b>only, all, always, never, best, definitely</b> in a conclusion usually make it fail.",
      "Answer choices typically: only I / only II / either / neither / both — read which scheme the test uses."
    ],
    sections: [
      { h: "How each question type is judged", blocks: [
        { table: { head: ["Type", "Ask yourself", "Rejects"], rows: [
          ["Conclusion", "Is this definitely true given the statement?", "extreme words, predictions, new facts"],
          ["Assumption", "Would the speaker say this if he didn't believe it?", "restatements, consequences"],
          ["Course of action", "Is it practical and does it address the cause?", "drastic bans, ‘shut everything down’"],
          ["Argument", "Is it relevant, significant and true?", "emotional, ‘others do it’, trivial"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1 (Conclusion). ‘Only graduates can apply for this post. Ravi is not a graduate.’ I: Ravi cannot apply. II: Ravi is a post-graduate.", ["I follows directly. II contradicts the statement (a post-graduate is a graduate).", "<b>Only I</b>"]),
        ex("Ex 2 (Conclusion). ‘Onion prices rose 40% in a month after unseasonal rain in the growing states.’ I: Onion supply was affected. II: Onion prices will never come down.", ["I is the implied link between rain and price.", "II is an extreme prediction. <b>Only I</b>"]),
        ex("Ex 3 (Assumption). Notice: ‘Please switch off lights and fans when leaving the room.’ I: Leaving them on wastes electricity. II: People may forget to switch them off.", ["Both beliefs are needed for the notice to make sense.", "<b>Both implicit</b>"]),
        ex("Ex 4 (Course of action). ‘Many students fell ill after eating the mid-day meal at a school.’ I: Scrap the mid-day meal scheme everywhere. II: Investigate the supplier and test food samples.", ["I is drastic and hurts millions. II addresses the cause.", "<b>Only II</b>"]),
        ex("Ex 5 (Argument). ‘Should the voting age be lowered to 16?’ I: Yes, 16-year-olds are more tech-savvy. II: No, most 16-year-olds are not yet mature enough to make informed political choices.", ["I is irrelevant (tech skill ≠ voting judgement).", "II is directly relevant. <b>Only II is strong</b>"]),
        ex("Ex 6 (Conclusion). ‘The company has asked all employees to work from office three days a week.’ I: The company thinks in-office days are useful. II: Employees were not working at all from home.", ["I is the reasonable basis of the rule. II is an unsupported extreme.", "<b>Only I</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "Don't reject a conclusion just because it's unpleasant or you disagree — judge only by the statement." },
        { warn: "A course of action need not solve the problem completely; it must reduce it sensibly." }
      ] }
    ],
    practice: [
      { q: "Statement: ‘Smoking in public places is punishable by a fine.’ Assumptions: I: The rule will deter some smokers. II: Everyone who smokes will stop.", a: "I is implicit; II is extreme → <b>only I</b>." },
      { q: "Statement: ‘The train was late by 3 hours because of fog.’ Conclusions: I: Fog can delay trains. II: All trains that day were late.", a: "I follows; II is a generalisation → <b>only I</b>." },
      { q: "Problem: ‘Road accidents at a junction have doubled this year.’ Courses: I: Install traffic signals and speed breakers at the junction. II: Ban all vehicles on that road.", a: "I is practical; II is drastic → <b>only I</b>." },
      { q: "‘Should exams be abolished in schools?’ I: Yes, students feel stressed. II: No, exams help measure learning and give feedback.", a: "I is weak (stress can be reduced without abolishing); II is relevant → <b>only II</b>." },
      { q: "Ad: ‘Join XYZ coaching for guaranteed selection.’ Assumptions: I: People want to be selected. II: Some people will believe the claim.", a: "Both are needed for the ad to work → <b>both implicit</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Venn Diagrams ───────────────────────── */
  add({
    id: "apt-venn",
    subject: "aptitude",
    title: "Venn Diagrams — two and three sets, logical Venn",
    minutes: 30,
    crux: [
      "n(A∪B) = n(A) + n(B) − n(A∩B). Neither = Total − n(A∪B).",
      "n(A∪B∪C) = ΣA − Σ(pairs) + n(A∩B∩C).",
      "Exactly two = Σ(pairs) − 3·(all three); exactly one = ΣA − 2Σ(pairs) + 3·(all three).",
      "Fill a 3-set diagram from the <b>centre outwards</b>: all three → pair-only regions → single-only regions.",
      "Overlap bounds: max n(A∩B) = min(A, B); min n(A∩B) = A + B − Total (if positive).",
      "Logical Venn: decide for each pair whether it is subset, overlapping or disjoint (Mumbai ⊂ Maharashtra ⊂ India; Men ∩ Women = ∅, both overlap Doctors)."
    ],
    sections: [
      { h: "Two sets", blocks: [
        ex("Ex 1. Of 100 students, 60 like tea, 50 coffee, 20 both. How many like neither?", ["Union = 60 + 50 − 20 = 90.", "Neither = <b>10</b>"]),
        ex("Ex 2. A class of 50: 30 play cricket, 25 football, 5 play neither. How many play both?", ["Union = 45 → both = 30 + 25 − 45 = <b>10</b>"]),
        ex("Ex 3. 70% like cricket and 60% like football. Minimum and maximum % liking both?", ["Min = 70 + 60 − 100 = <b>30%</b>. Max = min(70, 60) = <b>60%</b>."])
      ] },
      { h: "Three sets", blocks: [
        { svg: `<svg viewBox="0 0 440 260" width="440" class="dg">
  <circle class="ln" cx="180" cy="100" r="70"/>
  <circle class="ln" cx="260" cy="100" r="70"/>
  <circle class="ln" cx="220" cy="170" r="70"/>
  <text class="tx tx-b" x="118" y="30" text-anchor="middle" dominant-baseline="middle">A = 45</text>
  <text class="tx tx-b" x="322" y="30" text-anchor="middle" dominant-baseline="middle">B = 40</text>
  <text class="tx tx-b" x="330" y="228" text-anchor="middle" dominant-baseline="middle">C = 35</text>
  <text class="tx" x="140" y="85" text-anchor="middle" dominant-baseline="middle">23</text>
  <text class="tx" x="300" y="85" text-anchor="middle" dominant-baseline="middle">20</text>
  <text class="tx" x="220" y="212" text-anchor="middle" dominant-baseline="middle">18</text>
  <text class="tx" x="220" y="70" text-anchor="middle" dominant-baseline="middle">10</text>
  <text class="tx" x="175" y="150" text-anchor="middle" dominant-baseline="middle">7</text>
  <text class="tx" x="265" y="150" text-anchor="middle" dominant-baseline="middle">5</text>
  <text class="tx-a tx-b" x="220" y="122" text-anchor="middle" dominant-baseline="middle">5</text>
  <text class="tx-m" x="395" y="130" text-anchor="middle" dominant-baseline="middle">none = 12</text>
</svg>`, caption: "Ex 4 filled from the centre outwards. Total 100 people." },
        ex("Ex 4. 100 people: newspaper A 45, B 40, C 35; A∩B 15, B∩C 10, A∩C 12, all three 5. Read none? Exactly one? Exactly two?", ["Centre = 5. Pair-only: AB 15 − 5 = 10, BC 10 − 5 = 5, AC 12 − 5 = 7.", "Only A = 45 − 10 − 7 − 5 = 23; only B = 40 − 10 − 5 − 5 = 20; only C = 35 − 7 − 5 − 5 = 18.", "Union = 23 + 20 + 18 + 10 + 5 + 7 + 5 = 88 → none = <b>12</b>. Exactly one = <b>61</b>; exactly two = <b>22</b>.", "Formula check: 120 − 37 + 5 = 88 ✓"]),
        ex("Ex 5. In a group everyone speaks at least one language: Hindi 18, English 15, Tamil 12; H∩E 7, E∩T 5, H∩T 4; all three 2. Group size?", ["45 − 16 + 2 = <b>31</b>"])
      ] },
      { h: "Logical Venn", blocks: [
        { table: { head: ["Items", "Relationship", "Picture"], rows: [
          ["India, Maharashtra, Mumbai", "each inside the previous", "three nested circles"],
          ["Men, Women, Doctors", "Men and Women disjoint; Doctors overlaps both", "two separate circles, one circle across both"],
          ["Fruits, Apples, Vegetables", "Apples ⊂ Fruits; Vegetables separate", "nested pair + separate circle"],
          ["Students, Athletes, Singers", "all overlap", "three intersecting circles"]
        ] } },
        { warn: "In 3-set problems, the given ‘A∩B’ usually <b>includes</b> the all-three people. Subtract the centre before filling pair regions — unless the question says ‘only A and B’." }
      ] }
    ],
    practice: [
      { q: "40 like apples, 30 like mangoes, 10 like both, 20 like neither. How many people?", a: "Union = 60 → total = <b>80</b>." },
      { q: "Of 200 people, 120 speak Hindi and 100 English; everyone speaks at least one. How many speak both?", a: "120 + 100 − 200 = <b>20</b>." },
      { q: "A = 20, B = 25, C = 30, A∩B = 8, B∩C = 10, A∩C = 7, all three = 3. How many are in C only?", a: "30 − (7 − 3) − (10 − 3) − 3 = 30 − 4 − 7 − 3 = <b>16</b>." },
      { q: "Of 100 people, 80 own a phone, 75 a laptop, 70 a tablet. Minimum number owning all three?", a: "Non-owners: 20 + 25 + 30 = 75 at most distinct → at least 100 − 75 = <b>25</b> own all three." },
      { q: "25 play only chess, 15 only carrom, 10 play both. How many play chess?", a: "25 + 10 = <b>35</b>." },
      { q: "Which Venn picture fits: Pen, Stationery, Pencil?", a: "Pen and Pencil are separate circles, both inside Stationery." }
    ],
    related: []
  });

  /* ───────────────────────── Data Sufficiency ───────────────────────── */
  add({
    id: "apt-data-sufficiency",
    subject: "aptitude",
    title: "Data Sufficiency — decide, don't solve",
    minutes: 25,
    crux: [
      "Standard choices: (a) I alone (b) II alone (c) either alone (d) both together needed (e) neither — the <b>order differs</b> between tests; read the options once.",
      "Check I alone → II alone → then together. Stop computing as soon as you know a <b>unique</b> answer exists.",
      "For yes/no questions, a definite <b>No</b> is sufficient too.",
      "Watch hidden possibilities: negatives, zero, non-integers, x² = 16 → ±4.",
      "Don't carry facts from statement I into statement II when testing ‘alone’."
    ],
    sections: [
      { h: "Procedure", blocks: [
        { table: { head: ["Option (common order)", "Meaning"], rows: [
          ["(a)", "I alone is sufficient, II alone is not"],
          ["(b)", "II alone is sufficient, I alone is not"],
          ["(c)", "Either I alone or II alone is sufficient"],
          ["(d)", "Neither is sufficient, even together"],
          ["(e)", "Both together are needed, neither alone"]
        ] } },
        { ol: [
          "Read the question: what exactly must be pinned down (a value? yes/no?).",
          "Statement I alone: unique answer? Mark sufficient / not.",
          "Statement II alone, forgetting I.",
          "Only if both fail: combine them.",
          "Pick the option letter that matches (I, II, either, both, neither)."
        ] }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. What is x? I: 2x + 3 = 11. II: x² = 16.", ["I: x = 4 unique ✓. II: x = ±4 ✗.", "<b>I alone</b>"]),
        ex("Ex 2. Is x > 0? I: x² > 0. II: x³ > 0.", ["I: only says x ≠ 0 ✗. II: x³ > 0 ⇔ x > 0 ✓.", "<b>II alone</b>"]),
        ex("Ex 3. Speed of a train? I: It crosses a 200 m platform in 20 s. II: It crosses a pole in 12 s.", ["Each alone has two unknowns (length, speed).", "Together: L/12 = (L + 200)/20 → L = 300 m, speed 25 m/s. <b>Both together</b>"]),
        ex("Ex 4. How is P related to Q? I: P is R's son. II: Q is R's daughter.", ["Alone: nothing about the other person.", "Together: siblings, P male → brother. <b>Both together</b>"]),
        ex("Ex 5. What day of the week is 10 March? I: 7 March is a Monday. II: 12 March is a Saturday.", ["I: 10 March = Thursday ✓. II: 10 March = Thursday ✓.", "<b>Either alone</b>"]),
        ex("Ex 6. Is n divisible by 6? I: n is divisible by 3. II: n is even.", ["Alone: 3 or 4 are counter-examples.", "Together: divisible by 2 and 3 → by 6. <b>Both together</b>"]),
        ex("Ex 7. What is the ratio of A's age to B's age? I: A is 20% older than B. II: Their ages add to 44.", ["I: A = 1.2B → 6 : 5 ✓. II: ✗.", "<b>I alone</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "Solving fully wastes time — DS rewards <i>knowing</i> the answer exists." },
        { warn: "‘Is x prime?’ with ‘x is odd’ → not sufficient (9 is odd). One counter-example kills sufficiency." }
      ] }
    ],
    practice: [
      { q: "What is the value of a + b? I: a − b = 4. II: 2a + 2b = 20.", a: "II alone: a + b = 10 ✓; I alone ✗ → <b>II alone</b>." },
      { q: "Is x even? I: 3x is even. II: x + 2 is even.", a: "x is an integer assumed: I → x even ✓ (3 is odd); II → x even ✓ → <b>either alone</b>." },
      { q: "What is the area of a rectangle? I: perimeter 30. II: diagonal 13.", a: "Together: l + b = 15, l² + b² = 169 → 2lb = 225 − 169 = 56 → area 28 ✓. Alone ✗ → <b>both together</b>." },
      { q: "What is x? I: x is a prime between 20 and 30. II: x leaves remainder 1 when divided by 4.", a: "I: 23 or 29 ✗. II: many values ✗. Together: 23 = 4×5 + 3, 29 = 4×7 + 1 → x = 29 ✓ → <b>both together</b>." },
      { q: "Is the integer n odd? I: n² is odd. II: n + 1 is odd.", a: "I: n² odd ⇒ n odd ✓. II: n + 1 odd ⇒ n even — a definite ‘No’ ✓ → <b>either alone</b>." },
      { q: "What is Ravi's rank in a class of 40? I: 12 students are above him. II: 27 are below him.", a: "I: rank 13 ✓. II: rank 40 − 27 = 13 ✓ → <b>either alone</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Mixtures & Alligation ───────────────────────── */
  add({
    id: "apt-mixtures-alligation",
    subject: "aptitude",
    title: "Mixtures & Alligation — the cross rule and repeated replacement",
    minutes: 30,
    crux: [
      "Alligation: <b>cheaper : dearer = (d − m) : (m − c)</b>, where m is the mean (mixture) value.",
      "Works for anything averaged: price/kg, concentration %, speed, marks, profit %.",
      "Water costs ₹0 and has 0% concentration — treat it as c = 0.",
      "Repeated replacement: pure left = <b>V × (1 − x/V)ⁿ</b> after taking out x and refilling with water n times.",
      "Mixing two ratios: convert each to a fraction of the <b>same</b> component, then alligate the fractions.",
      "Selling at CP but gaining g% by adding water ⇒ water : milk = g : 100."
    ],
    sections: [
      { h: "The alligation cross", blocks: [
        { svg: `<svg viewBox="0 0 440 220" width="440" class="dg">
  <rect class="box" x="30" y="20" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="95" y="40" text-anchor="middle" dominant-baseline="middle">Cheaper c = 30</text>
  <rect class="box" x="280" y="20" width="130" height="40" rx="6"/>
  <text class="tx tx-b" x="345" y="40" text-anchor="middle" dominant-baseline="middle">Dearer d = 45</text>
  <rect class="box-a" x="160" y="90" width="120" height="40" rx="6"/>
  <text class="tx tx-b" x="220" y="110" text-anchor="middle" dominant-baseline="middle">Mean m = 39</text>
  <rect class="box-g" x="30" y="160" width="130" height="40" rx="6"/>
  <text class="tx" x="95" y="180" text-anchor="middle" dominant-baseline="middle">d − m = 6</text>
  <rect class="box-g" x="280" y="160" width="130" height="40" rx="6"/>
  <text class="tx" x="345" y="180" text-anchor="middle" dominant-baseline="middle">m − c = 9</text>
  <line class="ln" x1="160" y1="60" x2="280" y2="160" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="280" y1="60" x2="160" y2="160" marker-end="url(#dg-arr)"/>
</svg>`, caption: "Subtract along the diagonals. Cheaper : Dearer = 6 : 9 = 2 : 3." },
        { p: "Why it works: if a kg of cheaper and b kg of dearer average to m, then a(m − c) = b(d − m) — the gain on one side balances the loss on the other." }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. Rice at ₹30/kg and ₹45/kg is mixed to get ₹39/kg. Ratio?", ["(45 − 39) : (39 − 30) = 6 : 9 = <b>2 : 3</b>"]),
        ex("Ex 2. A class averages 60; boys average 55, girls 70. Ratio of boys to girls?", ["Boys : Girls = (70 − 60) : (60 − 55) = <b>2 : 1</b>"]),
        ex("Ex 3. 30 L of 20% acid is mixed with a 50% solution to get 35%. How much of the 50% solution?", ["(50 − 35) : (35 − 20) = 15 : 15 = 1 : 1.", "<b>30 L</b>"]),
        ex("Ex 4. Milk costs ₹50/L. How much water must be added to 40 L so that the mixture is worth ₹40/L?", ["Milk : water = (40 − 0) : (50 − 40) = 4 : 1.", "Water = 40/4 = <b>10 L</b>"]),
        ex("Ex 5. From 80 L of milk, 8 L is taken out and replaced by water; this is done 3 times. Milk left?", ["80 × (1 − 8/80)³ = 80 × 0.729 = <b>58.32 L</b>"]),
        ex("Ex 6. Vessel A has milk : water = 3 : 1, vessel B has 5 : 3. In what ratio should they be mixed to get 2 : 1?", ["Milk fractions: A = 3/4, B = 5/8, target = 2/3.", "A : B = (2/3 − 5/8) : (3/4 − 2/3) = 1/24 : 2/24 = <b>1 : 2</b>"]),
        ex("Ex 7. Equal volumes of the two vessels above are mixed. Resulting ratio?", ["Milk = (3/4 + 5/8)/2 = 11/16.", "Milk : water = <b>11 : 5</b>"]),
        ex("Ex 8. A milkman sells at cost price but gains 25% by adding water. Water : milk?", ["He gets paid for 125 units while buying 100 units of milk → 25 units of water.", "<b>1 : 4</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "The ratio from alligation is cheaper : dearer — don't flip it. Sanity check: the mixture's value should be closer to the component with the larger share." },
        { warn: "Replacement formula needs the vessel volume to stay constant (take out x, put back x)." }
      ] }
    ],
    practice: [
      { q: "Tea at ₹120/kg and ₹180/kg is mixed to sell at ₹160/kg with no profit. Ratio?", a: "(180 − 160) : (160 − 120) = 20 : 40 = <b>1 : 2</b>." },
      { q: "How much water should be added to 60 L of 40% alcohol to make it 30%?", a: "Alcohol 24 L fixed → total 80 L → add <b>20 L</b>." },
      { q: "A 40 L can has milk and water 3 : 1. How much milk must be added to make it 4 : 1?", a: "Water 10 L fixed → milk needed 40 L; has 30 → add <b>10 L</b>." },
      { q: "A 100 L tank of pure milk: 10 L removed and replaced with water, twice. Milk left?", a: "100 × 0.9² = <b>81 L</b>." },
      { q: "A trader mixes two sugars at ₹36 and ₹48/kg in ratio 1 : 2. Mean price?", a: "(36 + 96)/3 = <b>₹44/kg</b>." },
      { q: "A shopkeeper sells part of 50 kg of wheat at 8% profit and the rest at 18% profit, gaining 14% overall. How much was sold at 18%?", a: "(18 − 14) : (14 − 8) = 4 : 6 → 8% part : 18% part = 2 : 3 → <b>30 kg</b> at 18%." }
    ],
    related: []
  });

  /* ───────────────────────── Classic puzzles I ───────────────────────── */
  add({
    id: "apt-puzzles-classic",
    subject: "aptitude",
    title: "Classic Puzzles I — burning ropes, 8 balls, 3 bulbs, jugs, bridge",
    minutes: 35,
    crux: [
      "<b>Burning ropes</b> (each 60 min, uneven): lighting both ends halves the time whatever the unevenness. 45 min = rope A both ends + rope B one end; when A dies (30), light B's other end (+15).",
      "<b>Heavier ball among 3ᵏ</b> balls needs k weighings: 8 or 9 balls → <b>2</b> (split 3-3-rest). 12 balls, odd one heavier <i>or</i> lighter → 3.",
      "<b>3 switches, 3 bulbs, one visit</b>: switch 1 on for 10 min, off; switch 2 on; enter — lit = 2, warm = 1, cold = 3.",
      "<b>Bridge & torch</b> (1, 2, 5, 10 min): 2 fastest cross, fastest returns, 2 slowest cross, 2nd fastest returns, 2 fastest cross = <b>17 min</b>.",
      "<b>Jugs</b> 3 L & 5 L → 4 L: fill 5, pour into 3 (2 left), empty 3, pour 2 in, fill 5, top up 3 → 4 L left.",
      "Pigeonhole: to guarantee a pair from k colours, draw <b>k + 1</b>.",
      "In interviews, <b>think aloud</b>: state the constraint, try a small case, then generalise."
    ],
    sections: [
      { h: "Timing puzzles", blocks: [
        ex("Burning ropes — measure 45 minutes with two 60-minute ropes that burn unevenly.", ["t = 0: light rope A at <b>both</b> ends and rope B at one end.", "A burns out at t = 30 (both flames together consume 60 minutes of rope). B has exactly 30 minutes of rope left.", "Light B's other end → it burns out in 15 more minutes. Total <b>45 min</b>."]),
        ex("Hourglasses of 4 and 7 minutes — measure 9 minutes.", ["t = 0: start both. t = 4: 4-glass empties → flip it.", "t = 7: 7-glass empties → flip it. (4-glass has 1 minute left.)", "t = 8: 4-glass empties. The 7-glass has run 1 minute — flip it; that 1 minute runs back.", "t = <b>9</b>: the 7-glass empties."])
      ] },
      { h: "Weighing puzzles", blocks: [
        { svg: `<svg viewBox="0 0 640 220" width="640" class="dg">
  <rect class="box-a" x="230" y="15" width="180" height="40" rx="6"/>
  <text class="tx tx-b" x="320" y="35" text-anchor="middle" dominant-baseline="middle">Weigh {1,2,3} vs {4,5,6}</text>
  <rect class="box" x="30" y="100" width="250" height="40" rx="6"/>
  <text class="tx" x="155" y="120" text-anchor="middle" dominant-baseline="middle">Balanced → heavy is 7 or 8</text>
  <rect class="box" x="360" y="100" width="250" height="40" rx="6"/>
  <text class="tx" x="485" y="120" text-anchor="middle" dominant-baseline="middle">Left down → heavy in {1,2,3}</text>
  <rect class="box-g" x="30" y="170" width="250" height="40" rx="6"/>
  <text class="tx" x="155" y="190" text-anchor="middle" dominant-baseline="middle">Weigh 7 vs 8 → heavier side</text>
  <rect class="box-g" x="360" y="170" width="250" height="40" rx="6"/>
  <text class="tx" x="485" y="190" text-anchor="middle" dominant-baseline="middle">1 vs 2: tilt → it; level → 3</text>
  <line class="ln" x1="280" y1="55" x2="170" y2="100" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="360" y1="55" x2="470" y2="100" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="155" y1="140" x2="155" y2="170" marker-end="url(#dg-arr)"/>
  <line class="ln" x1="485" y1="140" x2="485" y2="170" marker-end="url(#dg-arr)"/>
</svg>`, caption: "8 balls, one heavier: 2 weighings. (Right down is symmetric.) Each weighing has 3 outcomes, so k weighings separate at most 3ᵏ balls." },
        ex("10 bags of coins; one bag has 9 g fakes instead of 10 g. One weighing on a digital scale — which bag?", ["Take 1 coin from bag 1, 2 from bag 2, …, 10 from bag 10 (55 coins).", "Ideal weight 550 g. Shortfall in grams = <b>number of the fake bag</b>."])
      ] },
      { h: "Information puzzles", blocks: [
        ex("3 switches outside a closed room, 3 bulbs inside; you may enter once. Which switch controls which bulb?", ["Switch 1 on for 10 minutes, then off. Switch 2 on. Enter.", "Lit bulb → switch 2. Off but warm → switch 1. Off and cold → switch 3."]),
        ex("Three boxes labelled Apples, Oranges, Mixed — every label is wrong. Fewest fruits to draw to fix all labels?", ["Draw from the box labelled <b>Mixed</b> (it must be pure). Say you get an apple → it's the Apples box.", "The box labelled Oranges can't be oranges or apples now → Mixed; the last is Oranges. <b>1 draw</b>."]),
        ex("Two doors (freedom / death), two guards — one always lies, one always tells the truth. One question.", ["Ask either guard: ‘Which door would the <i>other</i> guard say leads to freedom?’", "Both answers point to death → take the <b>other</b> door."])
      ] },
      { h: "Crossing & measuring", blocks: [
        ex("Four people cross a bridge at night with one torch; at most two at a time; times 1, 2, 5, 10 min (pair moves at the slower pace). Minimum time?", ["1 & 2 cross (2). 1 returns (1). 5 & 10 cross (10). 2 returns (2). 1 & 2 cross (2).", "Total = <b>17 min</b> (the obvious ‘1 escorts everyone’ gives 19)."]),
        ex("With a 3 L and a 5 L jug, measure exactly 4 L.", ["Fill 5 → pour into 3 → 5-jug has 2. Empty 3; pour the 2 L into it.", "Fill 5 → top up the 3-jug (needs 1) → <b>4 L</b> remain in the 5-jug."]),
        { warn: "The bridge answer is not ‘1 escorts everyone’: sending the two slowest together is the key idea; always compare both strategies." }
      ] }
    ],
    practice: [
      { q: "How many weighings to find the one heavier ball among 9? Among 27?", a: "3² = 9 → <b>2</b>; 3³ = 27 → <b>3</b>." },
      { q: "Using two 60-minute uneven ropes, measure exactly 15 minutes (starting from a moment you choose).", a: "Light rope A at both ends and rope B at one end. When A finishes (30 min), light B's other end — B finishes <b>15 minutes later</b>; that interval is your 15 min." },
      { q: "With 4 L and 9 L jugs, measure 6 L.", a: "Fill 9, pour 4 out twice (empty the 4-jug each time) → 1 L left in the 9-jug. Pour that 1 L into the 4-jug. Fill 9 and top up the 4-jug (3 L) → <b>6 L</b> in the 9-jug." },
      { q: "A drawer has 12 red, 8 blue and 6 green socks. In the dark, how many must you take to be sure of a matching pair? Of two green socks?", a: "3 colours → <b>4</b>. Worst case all red and blue first: 12 + 8 + 2 = <b>22</b>." },
      { q: "Bridge & torch with times 1, 2, 7, 10. Minimum?", a: "1&2 (2) + 1 back (1) + 7&10 (10) + 2 back (2) + 1&2 (2) = <b>17 min</b> (escort-by-1 gives 10 + 1 + 7 + 1 + 2 = 21)." },
      { q: "A snail climbs 3 m up a 20 m well each day and slips 2 m each night. On which day does it get out?", a: "Net +1 m per day; after 17 days it is at 17 m; on day 18 it climbs 3 m to 20 m → <b>day 18</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Classic puzzles II ───────────────────────── */
  add({
    id: "apt-puzzles-advanced",
    subject: "aptitude",
    title: "Classic Puzzles II — 25 horses, poisoned wine, 2 eggs, Monty Hall",
    minutes: 40,
    crux: [
      "<b>25 horses, 5 lanes, no timer, top 3</b>: <b>7 races</b> (5 heats + winners' race + 1 race of A2, A3, B1, B2, C1).",
      "<b>1000 bottles, 1 poisoned, one round of tests</b>: <b>10 testers</b> — number bottles in binary; tester i drinks from bottles whose bit i is 1; the dead set spells the bottle (2¹⁰ = 1024).",
      "<b>2 eggs, 100 floors</b>: worst case <b>14 drops</b> — first drops at 14, 27, 39, 50, … (gaps shrink by 1); need x(x+1)/2 ≥ 100.",
      "<b>Monty Hall</b>: switching wins with probability <b>2/3</b>.",
      "<b>100 doors toggled by every divisor</b>: open doors are the <b>perfect squares</b> → 10 open.",
      "<b>Gold bar for 7 days, 2 cuts</b>: pieces 1, 2, 4 (binary)."
    ],
    sections: [
      { h: "25 horses — 7 races", blocks: [
        { svg: `<svg viewBox="0 0 520 250" width="520" class="dg">
  <text class="tx-m" x="130" y="18" text-anchor="middle" dominant-baseline="middle">1st</text>
  <text class="tx-m" x="190" y="18" text-anchor="middle" dominant-baseline="middle">2nd</text>
  <text class="tx-m" x="250" y="18" text-anchor="middle" dominant-baseline="middle">3rd</text>
  <text class="tx-m" x="310" y="18" text-anchor="middle" dominant-baseline="middle">4th</text>
  <text class="tx-m" x="370" y="18" text-anchor="middle" dominant-baseline="middle">5th</text>
  <text class="tx tx-b" x="70" y="47" text-anchor="middle" dominant-baseline="middle">Group A</text>
  <text class="tx tx-b" x="70" y="87" text-anchor="middle" dominant-baseline="middle">Group B</text>
  <text class="tx tx-b" x="70" y="127" text-anchor="middle" dominant-baseline="middle">Group C</text>
  <text class="tx tx-b" x="70" y="167" text-anchor="middle" dominant-baseline="middle">Group D</text>
  <text class="tx tx-b" x="70" y="207" text-anchor="middle" dominant-baseline="middle">Group E</text>
  <rect class="box-g" x="105" y="30" width="50" height="34" rx="4"/><text class="tx tx-b" x="130" y="47" text-anchor="middle" dominant-baseline="middle">A1</text>
  <rect class="box-a" x="165" y="30" width="50" height="34" rx="4"/><text class="tx" x="190" y="47" text-anchor="middle" dominant-baseline="middle">A2</text>
  <rect class="box-a" x="225" y="30" width="50" height="34" rx="4"/><text class="tx" x="250" y="47" text-anchor="middle" dominant-baseline="middle">A3</text>
  <rect class="box-r" x="285" y="30" width="50" height="34" rx="4"/><text class="tx" x="310" y="47" text-anchor="middle" dominant-baseline="middle">A4</text>
  <rect class="box-r" x="345" y="30" width="50" height="34" rx="4"/><text class="tx" x="370" y="47" text-anchor="middle" dominant-baseline="middle">A5</text>
  <rect class="box-a" x="105" y="70" width="50" height="34" rx="4"/><text class="tx" x="130" y="87" text-anchor="middle" dominant-baseline="middle">B1</text>
  <rect class="box-a" x="165" y="70" width="50" height="34" rx="4"/><text class="tx" x="190" y="87" text-anchor="middle" dominant-baseline="middle">B2</text>
  <rect class="box-r" x="225" y="70" width="50" height="34" rx="4"/><text class="tx" x="250" y="87" text-anchor="middle" dominant-baseline="middle">B3</text>
  <rect class="box-r" x="285" y="70" width="50" height="34" rx="4"/><text class="tx" x="310" y="87" text-anchor="middle" dominant-baseline="middle">B4</text>
  <rect class="box-r" x="345" y="70" width="50" height="34" rx="4"/><text class="tx" x="370" y="87" text-anchor="middle" dominant-baseline="middle">B5</text>
  <rect class="box-a" x="105" y="110" width="50" height="34" rx="4"/><text class="tx" x="130" y="127" text-anchor="middle" dominant-baseline="middle">C1</text>
  <rect class="box-r" x="165" y="110" width="50" height="34" rx="4"/><text class="tx" x="190" y="127" text-anchor="middle" dominant-baseline="middle">C2</text>
  <rect class="box-r" x="225" y="110" width="50" height="34" rx="4"/><text class="tx" x="250" y="127" text-anchor="middle" dominant-baseline="middle">C3</text>
  <rect class="box-r" x="285" y="110" width="50" height="34" rx="4"/><text class="tx" x="310" y="127" text-anchor="middle" dominant-baseline="middle">C4</text>
  <rect class="box-r" x="345" y="110" width="50" height="34" rx="4"/><text class="tx" x="370" y="127" text-anchor="middle" dominant-baseline="middle">C5</text>
  <rect class="box-r" x="105" y="150" width="290" height="34" rx="4"/><text class="tx" x="250" y="167" text-anchor="middle" dominant-baseline="middle">D1 … D5 out (D1 is at best 4th)</text>
  <rect class="box-r" x="105" y="190" width="290" height="34" rx="4"/><text class="tx" x="250" y="207" text-anchor="middle" dominant-baseline="middle">E1 … E5 out</text>
  <text class="tx-a" x="460" y="60" text-anchor="middle" dominant-baseline="middle">race 7:</text>
  <text class="tx-a" x="460" y="80" text-anchor="middle" dominant-baseline="middle">A2 A3 B1</text>
  <text class="tx-a" x="460" y="100" text-anchor="middle" dominant-baseline="middle">B2 C1</text>
  <text class="tx-m" x="250" y="240" text-anchor="middle" dominant-baseline="middle">rows ordered by race 6 (winners' race); columns = finish in own heat</text>
</svg>`, caption: "After race 6, A1 is the fastest. Only the five blue horses can still be 2nd or 3rd." },
        { ol: [
          "Races 1–5: race the five groups. Every horse finishing 4th or 5th in its heat is out (three horses are faster).",
          "Race 6: race the five winners; name groups A–E by this result. A1 is the fastest horse overall. D and E groups are out (D1 already has A1, B1, C1 ahead).",
          "Who can be 2nd or 3rd? A2 (only A1 known faster), A3 (A1, A2 faster); B1, B2 (B2 has B1 and A1 ahead); C1 (C1 has A1, B1 ahead). C2 and B3 have at least three horses ahead.",
          "Race 7: A2, A3, B1, B2, C1. Top two are overall 2nd and 3rd. <b>Total 7 races</b>."
        ] },
        { tip: "Interviewers want the elimination argument, not just ‘7’. Say ‘every horse with three known faster horses is out’ — that one rule generates the whole solution." }
      ] },
      { h: "Poisoned wine — binary encoding", blocks: [
        { p: "1000 bottles, exactly one poisoned; poison kills in, say, 24 hours and you have just enough time for one round. Number the bottles 0–999 in 10-bit binary. Tester i sips from every bottle whose i-th bit is 1. After 24 h, write 1 for each dead tester and 0 for each alive one: the 10-bit number is the poisoned bottle. <b>10 testers</b> suffice because 2¹⁰ = 1024 ≥ 1000; 9 would give only 512 patterns." },
        { table: { head: ["Bottle", "Binary (bits 3..0)", "Testers who drink"], rows: [
          ["5", "0101", "T0, T2"], ["6", "0110", "T1, T2"], ["11", "1011", "T0, T1, T3"]
        ] } }
      ] },
      { h: "Two eggs, 100 floors", blocks: [
        { p: "With one egg you must go floor by floor. With two, use the first egg to narrow a range, then scan the range with the second. If the first drop is at floor x and it breaks, you need x − 1 more drops → x total. If not, the next jump must be x − 1 floors (one drop already used), then x − 2, … So we need x + (x − 1) + … + 1 = x(x + 1)/2 ≥ 100 → <b>x = 14</b> (105 ≥ 100; 13 gives only 91)." },
        { p: "Drop floors: 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100. Worst case <b>14 drops</b>." }
      ] },
      { h: "More classics", blocks: [
        ex("Monty Hall: 3 doors, one car. You pick door 1; the host (who knows) opens a goat door. Switch?", ["Your first pick is right 1/3 of the time. The other 2/3 of the time the car is behind the one closed door the host did not open.", "Switch → win with <b>2/3</b>."]),
        ex("100 closed doors; person k toggles every k-th door, for k = 1…100. Which doors end open?", ["Door n is toggled once per divisor. Divisors come in pairs except for perfect squares.", "Squares have an odd number of toggles → open: 1, 4, 9, …, 100 → <b>10 doors</b>."]),
        ex("A worker is paid 1/7 of a gold bar each day for 7 days. Only 2 cuts allowed.", ["Cut into 1, 2 and 4 parts.", "Day 1: give 1. Day 2: give 2, take back 1. Day 3: give 1. Day 4: give 4, take back 1 and 2. Days 5–7 repeat the pattern with 1 and 2."]),
        ex("Three daughters' ages multiply to 36. Their sum is the house number (not enough). ‘My eldest daughter loves chess.’ Ages?", ["Triples with product 36 and equal sums: only (1, 6, 6) and (2, 2, 9) both sum to 13 — that's why the sum wasn't enough.", "‘Eldest’ rules out twins at the top → <b>2, 2, 9</b>."]),
        ex("100 prisoners in a line, each sees only the hats ahead (red/blue). From the back, each says a colour; correct → freed. Best guaranteed strategy?", ["The last prisoner says ‘red’ if he sees an odd number of red hats, else ‘blue’ (he's 50/50).", "Everyone else tracks parity and deduces their own hat → <b>99 guaranteed</b>."])
      ] }
    ],
    practice: [
      { q: "Using the same method as the 25-horse puzzle, how many races to find the top 3 of 64 horses with 8 lanes?", a: "8 heats + 1 winners' race + 1 race of A2, A3, B1, B2, C1 (5 horses fit in 8 lanes) = <b>10</b>." },
      { q: "2 eggs, 36 floors — minimum worst-case drops?", a: "x(x + 1)/2 ≥ 36 → x = 8 (36) → <b>8 drops</b>." },
      { q: "How many testers for 500 bottles, one poisoned, one round?", a: "2⁹ = 512 ≥ 500 → <b>9</b>." },
      { q: "In the 100-doors puzzle, is door 48 open? How many of doors 1–50 are open?", a: "48 is not a square → <b>closed</b>. Squares ≤ 50: 1, 4, 9, 16, 25, 36, 49 → <b>7</b>." },
      { q: "Monty Hall with 4 doors: you pick one, the host opens one goat door, and you switch to one of the other two closed doors at random. P(win)?", a: "Stay: 1/4. Switch: car is elsewhere with 3/4, then you pick the right one of 2 → 3/4 × 1/2 = <b>3/8</b> (better than staying)." },
      { q: "In the 25-horse puzzle, why can't B3 be 3rd overall?", a: "B1, B2 beat B3 in its heat and A1 beat B1 in race 6 → three faster horses → at best <b>4th</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Logical puzzles ───────────────────────── */
  add({
    id: "apt-logical-puzzles",
    subject: "aptitude",
    title: "Logical Puzzles — ranking, floors, grids, truth-tellers",
    minutes: 35,
    crux: [
      "Make a <b>table</b> (floors / days / people × attributes) before reading clue 2.",
      "Place <b>fixed</b> facts first, then relative ones (above, before, immediately after), then negatives (not, neither).",
      "When a clue gives 2–3 options, branch into cases and kill contradictions quickly.",
      "Ranking: position from top + position from bottom − 1 = total.",
      "Truth/lie puzzles: <b>assume</b> each candidate, count the true statements, keep the case matching the rule.",
      "Knights (always truthful) and knaves (always lie): a statement ‘I am a knave’ is impossible for both."
    ],
    sections: [
      { h: "Ranking & ordering", blocks: [
        ex("Ex 1. P is taller than Q but shorter than R. S is the tallest. T is shorter than Q. Who is in the middle?", ["R > P > Q; S on top; T below Q.", "Order: S > R > P > Q > T → <b>P</b>"]),
        ex("Ex 2. Ravi is 12th from the top and 18th from the bottom. How many students?", ["12 + 18 − 1 = <b>29</b>"])
      ] },
      { h: "Floor puzzle", blocks: [
        { p: "<b>Six people A–F live on floors 1 (bottom) to 6, one per floor.</b> (1) B lives on the top floor. (2) A lives on an odd-numbered floor, not the lowest. (3) Two people live between A and B. (4) C lives immediately above A. (5) D lives below F. (6) E doesn't live on floor 1 or 2." },
        { table: { head: ["Floor", "Reasoning", "Person"], rows: [
          ["6", "clue 1", "B"],
          ["5", "only floor left that isn't 1–2 (clue 6)", "E"],
          ["4", "immediately above A (clue 4)", "C"],
          ["3", "odd, not 1; two between A and 6 → floor 3 (clues 2, 3)", "A"],
          ["2", "D below F (clue 5)", "F"],
          ["1", "", "D"]
        ] } }
      ] },
      { h: "Grid puzzle", blocks: [
        { p: "<b>Amit, Bina, Chetan are from Delhi, Pune, Goa and play chess, tennis, football (one each).</b> (1) The person from Delhi plays tennis. (2) Amit is not from Delhi or Goa. (3) Bina doesn't play tennis. (4) The footballer is not from Pune." },
        { ol: [
          "Clue 2 → Amit = Pune.",
          "Clue 3 + clue 1 → Bina is not from Delhi → Bina = Goa, Chetan = Delhi → Chetan plays tennis.",
          "Clue 4 → Amit (Pune) is not the footballer → Amit = chess, Bina = football."
        ] },
        { table: { head: ["Person", "City", "Sport"], rows: [["Amit", "Pune", "Chess"], ["Bina", "Goa", "Football"], ["Chetan", "Delhi", "Tennis"]] } }
      ] },
      { h: "Truth & lies", blocks: [
        ex("Ex 3. Knights always tell the truth, knaves always lie. A says ‘B is a knave.’ B says ‘A and I are both knights.’", ["If B were a knight, A would be a knight too — but then A's claim ‘B is a knave’ is false. Contradiction → B is a knave.", "Then A's statement is true → A is a knight. B's statement (both knights) is indeed false ✓.", "<b>A knight, B knave</b>"]),
        ex("Ex 4. Exactly one of three suspects tells the truth. A: ‘B did it.’ B: ‘I didn't do it.’ C: ‘I didn't do it.’ Who did it?", ["If A did it: B true, C true → 2 true ✗. If B did it: A true, C true → 2 ✗.", "If C did it: A false, B true, C false → exactly 1 ✓ → <b>C</b>"])
      ] }
    ],
    practice: [
      { q: "Five lectures P, Q, R, S, T are held Monday–Friday, one per day. P is on Wednesday. R is the day after T. Q is not on Monday or Friday. S is before Q. Which lecture is on Monday?", a: "T–R can be Mon–Tue or Thu–Fri. If Mon–Tue, Q and S get Thu/Fri; Q ≠ Fri → Q Thu, S Fri — but S must be before Q ✗. So T Thu, R Fri; Q ≠ Mon → Q Tue, S Mon. <b>S on Monday</b> (order S, Q, P, T, R)." },
      { q: "In that schedule, what is held the day before T?", a: "Wednesday → <b>P</b>." },
      { q: "Three boxes, one contains gold. Box 1: ‘The gold is here.’ Box 2: ‘The gold is not here.’ Box 3: ‘The gold is not in box 1.’ Only one statement is true. Where is the gold?", a: "Gold in 1: statements 1 and 2 true ✗. Gold in 3: statements 2 and 3 true ✗. Gold in 2: only statement 3 true ✓ → <b>Box 2</b>." },
      { q: "In a row of 40 students, Meena is 15th from the left. What is her position from the right?", a: "40 − 15 + 1 = <b>26th</b>." },
      { q: "A says: ‘I am a knave.’ Can A be a knight or a knave?", a: "A knight can't say it (it would be a lie); a knave can't say it (it would be true). <b>Neither</b> — such a speaker can't exist on the island." },
      { q: "In the floor puzzle, who lives immediately below C and who lives just above F?", a: "Below C (floor 4) is <b>A</b> (floor 3). Above F (floor 2) is <b>A</b> as well." }
    ],
    related: []
  });

  /* ───────────────────────── Reading Comprehension ───────────────────────── */
  add({
    id: "apt-reading-comprehension",
    subject: "aptitude",
    title: "Reading Comprehension — question types and elimination",
    minutes: 30,
    crux: [
      "Skim the <b>questions first</b>, then read the passage once for structure (what each paragraph does).",
      "Six question types: <b>main idea, detail, inference, vocabulary-in-context, tone, title</b>.",
      "Answer from the passage, not from your own opinion or general knowledge.",
      "Eliminate options that are <b>too broad, too narrow, extreme</b> (always, never, only) or <b>out of scope</b>.",
      "Inference = what must be true given the text — one small step, not a leap.",
      "Vocabulary questions: substitute each option into the sentence; the dictionary meaning may not fit the context."
    ],
    sections: [
      { h: "Question types", blocks: [
        { table: { head: ["Type", "How to find it", "Trap option"], rows: [
          ["Main idea / title", "What do all paragraphs serve? Often in the first or last lines.", "True but covers only one paragraph"],
          ["Detail", "Scan for the keyword, reread 2 lines around it.", "Right words, wrong relationship"],
          ["Inference", "Must follow with little or no assumption.", "Plausible but unsupported"],
          ["Vocabulary", "Plug options into the sentence.", "Most common dictionary meaning"],
          ["Tone", "Look at adjectives and verbs the author chooses.", "Extreme tones (furious, ecstatic)"]
        ] } }
      ] },
      { h: "Worked passage", blocks: [
        { p: "<i>Cities are often several degrees warmer than the countryside around them, a pattern known as the urban heat island. The causes are not mysterious. Asphalt and concrete absorb sunlight during the day and release it slowly at night, so cities cool down less after sunset. Tall buildings trap heat between them and block breezes, while air-conditioners, vehicles and factories pump waste heat directly into the streets. Trees and open soil, which cool the air by evaporating water, are scarce.</i>" },
        { p: "<i>The effects go beyond discomfort. Hotter nights prevent the body from recovering from daytime heat, which is why heat waves are deadlier in dense neighbourhoods than in leafy suburbs. Higher temperatures also raise electricity demand, and the extra air-conditioning adds still more heat outside — a feedback loop.</i>" },
        { p: "<i>Solutions exist, and many are cheap. Painting roofs white can noticeably lower indoor temperatures; planting street trees provides shade and evaporative cooling; and permeable pavements let rainwater soak in and evaporate later. None of these alone will cool a city, but together they can shave a few degrees off the hottest days — often the difference between an uncomfortable afternoon and a medical emergency.</i>" },
        ex("Q1. The passage is mainly about: (A) how cities cause global warming (B) the causes, effects and affordable remedies of urban heat islands (C) why air-conditioning should be banned (D) why suburbs are healthier than cities", ["(A) out of scope; (C) never suggested; (D) is one detail.", "<b>(B)</b> — each paragraph covers one of causes, effects, remedies."]),
        ex("Q2. According to the passage, cities cool down less at night because: (A) there is less wind in the evening (B) asphalt and concrete release stored heat slowly (C) people use more air-conditioning at night (D) there are no trees", ["Stated directly in paragraph 1. (D) is too extreme (‘scarce’, not ‘none’).", "<b>(B)</b>"]),
        ex("Q3. The ‘feedback loop’ refers to: (A) heat → more AC use → more outdoor heat (B) trees → shade → cooling (C) rain → evaporation → cooling (D) electricity prices rising every year", ["The sentence links higher temperature, AC demand and extra heat outside.", "<b>(A)</b>"]),
        ex("Q4. The author would most likely agree that: (A) white roofs alone can solve the problem (B) combining several low-cost measures is worthwhile (C) nothing can be done without rebuilding cities (D) heat islands only cause discomfort", ["Last paragraph: ‘none of these alone … but together’. (A) contradicts; (C), (D) contradict ‘cheap’ and ‘beyond discomfort’.", "<b>(B)</b>"]),
        ex("Q5. ‘Shave’ in the last paragraph most nearly means: (A) cut hair (B) reduce slightly (C) remove completely (D) sharpen", ["Substitute: ‘reduce a few degrees slightly from the hottest days’ fits; ‘completely’ is too strong.", "<b>(B)</b>. Tone of the passage: informative and cautiously optimistic."])
      ] },
      { h: "Traps", blocks: [
        { warn: "An option can be <b>true in real life</b> and still wrong because the passage doesn't say it." },
        { tip: "If two options look right, pick the one that is closer to the exact words and scope of the passage." }
      ] }
    ],
    practice: [
      { q: "<i>Passage:</i> ‘Most students revise by rereading their notes the night before an exam. It feels productive because the material looks familiar, but familiarity is not the same as memory. Research on learning has repeatedly found that we remember more when we are forced to recall information — by answering questions or explaining an idea without looking — and when that recall is spread over days rather than crammed into one session. The effort of retrieving a half-forgotten fact is precisely what strengthens it. Cramming can still get a student through tomorrow's test, but much of what is learned this way fades within weeks, which is costly in subjects where later topics build on earlier ones.’<br>Q: What is the main point?", a: "Spaced, active recall produces longer-lasting memory than rereading or cramming." },
      { q: "(Same passage) Why does rereading feel productive?", a: "Because the material <b>looks familiar</b> — which the author says is not the same as remembering it." },
      { q: "(Same passage) Which statement would the author accept? (A) Cramming never works (B) Cramming can work short-term but hurts cumulative subjects (C) Rereading is the best method (D) Memory cannot be improved", a: "<b>(B)</b> — ‘can still get a student through tomorrow's test’ but ‘costly where later topics build on earlier ones’. (A) is extreme." },
      { q: "(Same passage) ‘Precisely’ most nearly means: (A) roughly (B) exactly (C) politely (D) rarely", a: "<b>(B) exactly</b>." },
      { q: "(Same passage) What revision plan for DSA fits the author's advice?", a: "Re-solving earlier problems from a blank file at spaced intervals (e.g. after 1, 3 and 7 days) instead of rereading solutions." }
    ],
    related: []
  });

  /* ───────────────────────── Sentence Correction + Para-jumbles ───────────────────────── */
  add({
    id: "apt-sentence-correction",
    subject: "aptitude",
    title: "Sentence Correction & Para-jumbles — the rules that are tested",
    minutes: 30,
    crux: [
      "<b>Subject–verb agreement</b>: find the real subject (‘One of the boys <b>is</b>’, ‘The quality of the mangoes <b>was</b>’). With either/neither…or/nor, the verb agrees with the <b>nearer</b> subject.",
      "‘Along with / as well as / together with’ don't change the subject's number.",
      "Fixed pairs: <b>no sooner … than</b>, <b>hardly/scarcely … when</b>, <b>prefer … to</b>, <b>senior/junior/superior to</b>.",
      "Since = point of time, for = period (‘for five years’).",
      "Parallelism: items in a list take the same form (reading, writing and painting).",
      "Para-jumbles: find the <b>opener</b> (introduces the topic, no pronoun or connector), then link pronouns, ‘however / therefore / this’, and time order."
    ],
    sections: [
      { h: "Error-spotting rules with examples", blocks: [
        { table: { head: ["Wrong", "Right", "Rule"], rows: [
          ["Neither the manager nor his assistants <u>was</u> present.", "… were present.", "verb agrees with nearer subject"],
          ["One of my friends <u>have</u> gone abroad.", "… has gone abroad.", "subject is ‘one’"],
          ["He along with his friends <u>are</u> coming.", "… is coming.", "‘along with’ doesn't add"],
          ["The quality of the mangoes <u>were</u> poor.", "… was poor.", "subject is ‘quality’"],
          ["No sooner did he reach the station <u>when</u> the train left.", "… than the train left.", "no sooner … than"],
          ["Hardly had I left <u>than</u> it started raining.", "… when it started raining.", "hardly … when"],
          ["He is senior <u>than</u> me.", "He is senior to me.", "Latin comparatives take ‘to’"],
          ["I have been living here <u>since</u> five years.", "… for five years.", "since vs for"],
          ["She likes reading, writing and <u>to paint</u>.", "… and painting.", "parallelism"],
          ["Between you and <u>I</u>, the plan is weak.", "Between you and me …", "object after preposition"],
          ["He is <u>an</u> university professor.", "He is a university professor.", "article by sound (‘yoo’)"],
          ["<u>Walking down the road, the trees</u> looked lovely.", "Walking down the road, I found the trees lovely.", "dangling modifier"],
          ["If I <u>was</u> you, I would accept.", "If I were you …", "subjunctive"]
        ] } },
        { tip: "‘The committee has submitted its report’ is correct — a collective noun acting as one unit takes a singular verb. Always keep ‘No error’ as a live option." }
      ] },
      { h: "Para-jumbles", blocks: [
        ex("Ex 1. Arrange: P: However, each call uses stack memory, so very deep recursion can overflow the stack. Q: Recursion is a technique in which a function calls itself. R: It is especially useful for problems that break into smaller copies of themselves, such as tree traversal. S: Therefore, many programmers prefer an iterative solution when the depth may be large.", ["Opener: Q defines the topic (no pronoun, no connector).", "R's ‘It’ = recursion → Q R. P's ‘However’ contrasts with R's benefit. S's ‘Therefore’ concludes from P.", "<b>Q R P S</b>"]),
        ex("Ex 2. Arrange: A: The first step is to understand the problem completely. B: Solving a coding problem in an interview follows a fairly predictable pattern. C: Only after that should you start writing code. D: Next, you discuss a brute-force approach and then improve it.", ["B introduces; A ‘first step’; D ‘Next’; C ‘Only after that’.", "<b>B A D C</b>"]),
        { warn: "Don't pick the opener just because it's the longest or most general-sounding — check it contains no dangling reference (‘this’, ‘it’, ‘however’)." }
      ] }
    ],
    practice: [
      { q: "Correct the error: ‘The news are true.’", a: "‘News’ is uncountable and singular → <b>The news is true.</b>" },
      { q: "Correct the error: ‘I prefer tea than coffee.’", a: "prefer … to → <b>I prefer tea to coffee.</b>" },
      { q: "Correct the error: ‘Scarcely had the play begun than the lights went out.’", a: "scarcely … when → <b>… when the lights went out.</b>" },
      { q: "Correct the error: ‘Each of the boys have finished his homework.’", a: "Subject ‘each’ is singular → <b>has finished</b>." },
      { q: "Arrange: 1: Finally, the results are reviewed and the process is repeated. 2: The scientific method begins with an observation. 3: This leads to a question and a testable hypothesis. 4: An experiment is then designed to test it.", a: "2 opens; 3 ‘This’ refers to the observation; 4 ‘then … test it (the hypothesis)’; 1 ‘Finally’ → <b>2 3 4 1</b>." },
      { q: "Correct the error: ‘Neither of the two answers are correct.’", a: "‘Neither of’ takes a singular verb → <b>Neither of the two answers is correct.</b>" }
    ],
    related: []
  });

  /* ───────────────────────── Mensuration ───────────────────────── */
  add({
    id: "apt-mensuration",
    subject: "aptitude",
    title: "Mensuration — 2D areas, 3D volumes and surface areas",
    minutes: 35,
    crux: [
      "Circle: area πr², circumference 2πr. With r = 7, area = 154, circumference = 44 (π = 22/7).",
      "Triangle: ½ × base × height; Heron √(s(s−a)(s−b)(s−c)); equilateral (√3/4)a².",
      "Cylinder V = πr²h, CSA 2πrh; Cone V = ⅓πr²h, CSA πrl (l = √(r² + h²)); Sphere V = ⁴⁄₃πr³, SA 4πr²; Hemisphere V = ⅔πr³, TSA 3πr².",
      "Cuboid V = lbh, TSA 2(lb + bh + hl), diagonal √(l² + b² + h²). Cube: a³, 6a², a√3.",
      "Melting/recasting: <b>volume is conserved</b>.",
      "Scaling: every length ×k ⇒ area ×k², volume ×k³ (+10% side → +21% area, +33.1% volume)."
    ],
    sections: [
      { h: "2D formulas", blocks: [
        { table: { head: ["Shape", "Area", "Perimeter / other"], rows: [
          ["Rectangle l × b", "lb", "2(l + b); diagonal √(l² + b²)"],
          ["Square a", "a² = d²/2", "4a; diagonal a√2"],
          ["Triangle", "½bh or Heron", "a + b + c"],
          ["Equilateral a", "(√3/4)a²", "height (√3/2)a"],
          ["Parallelogram", "base × height", "—"],
          ["Rhombus d₁, d₂", "½ d₁d₂", "side = √((d₁/2)² + (d₂/2)²)"],
          ["Trapezium", "½(a + b)h", "—"],
          ["Circle r", "πr²", "2πr"],
          ["Sector θ", "(θ/360)πr²", "arc (θ/360)2πr"]
        ] } }
      ] },
      { h: "3D formulas", blocks: [
        { table: { head: ["Solid", "Volume", "Curved / lateral", "Total surface"], rows: [
          ["Cuboid", "lbh", "2h(l + b)", "2(lb + bh + hl)"],
          ["Cube a", "a³", "4a²", "6a²"],
          ["Cylinder", "πr²h", "2πrh", "2πr(r + h)"],
          ["Cone", "⅓πr²h", "πrl", "πr(r + l)"],
          ["Sphere", "⁴⁄₃πr³", "—", "4πr²"],
          ["Hemisphere", "⅔πr³", "2πr²", "3πr²"]
        ] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. Rectangle 20 m × 15 m: area, perimeter, diagonal?", ["300 m², 70 m, √(400 + 225) = <b>25 m</b>"]),
        ex("Ex 2. Triangle with sides 13, 14, 15: area?", ["s = 21 → √(21 × 8 × 7 × 6) = √7,056 = <b>84</b>"]),
        ex("Ex 3. Cylinder r = 7 cm, h = 10 cm: volume, CSA, TSA?", ["V = 154 × 10 = <b>1,540 cm³</b>. CSA = 2 × 22/7 × 7 × 10 = <b>440 cm²</b>. TSA = 440 + 2 × 154 = <b>748 cm²</b>"]),
        ex("Ex 4. Cone r = 3, h = 4: slant height, volume, curved surface?", ["l = 5. V = ⅓π × 9 × 4 = <b>12π ≈ 37.7</b>. CSA = π × 3 × 5 = <b>15π ≈ 47.1</b>"]),
        ex("Ex 5. Volume of a sphere of radius 21 cm?", ["⁴⁄₃ × 22/7 × 9,261 = <b>38,808 cm³</b>"]),
        ex("Ex 6. A metal sphere of radius 9 cm is drawn into a wire of radius 0.3 cm. Length of wire?", ["⁴⁄₃π × 729 = 972π = π × 0.09 × L.", "L = 10,800 cm = <b>108 m</b>"]),
        ex("Ex 7. A 40 m × 30 m garden has a 2 m wide path all around outside it. Area of the path?", ["Outer = 44 × 34 = 1,496. Path = 1,496 − 1,200 = <b>296 m²</b>"]),
        ex("Ex 8. Each edge of a cube increases by 10%. % change in volume and surface area?", ["Volume ×1.331 → <b>+33.1%</b>. Surface ×1.21 → <b>+21%</b>."])
      ] },
      { h: "Traps", blocks: [
        { warn: "CSA vs TSA: open tank/pipe → no top (or no ends). Read whether the solid is open, hollow or closed." },
        { warn: "Units: cm³ to litres — 1,000 cm³ = 1 L; 1 m³ = 1,000 L." }
      ] }
    ],
    practice: [
      { q: "A square's diagonal is 10√2 cm. Area?", a: "Side 10 → <b>100 cm²</b> (or d²/2 = 200/2)." },
      { q: "A wheel of radius 35 cm: revolutions to cover 1.1 km?", a: "Circumference 2 × 22/7 × 35 = 220 cm → 1,10,000/220 = <b>500</b>." },
      { q: "Cuboid 8 × 6 × 5: volume, TSA, diagonal?", a: "<b>240</b>; 2(48 + 30 + 40) = <b>236</b>; √(64 + 36 + 25) = √125 = <b>5√5</b>." },
      { q: "Hemisphere of radius 7 cm: volume and total surface area?", a: "⅔ × 22/7 × 343 ≈ <b>718.67 cm³</b>; 3 × 154 = <b>462 cm²</b>." },
      { q: "Rhombus with diagonals 16 and 12: area and side?", a: "½ × 16 × 12 = <b>96</b>; side √(8² + 6²) = <b>10</b>." },
      { q: "How many 2 cm cubes can be cut from a 10 × 8 × 6 cm cuboid?", a: "5 × 4 × 3 = <b>60</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Progressions ───────────────────────── */
  add({
    id: "apt-progressions",
    subject: "aptitude",
    title: "Progressions — AP, GP, sums, AM–GM–HM",
    minutes: 30,
    crux: [
      "AP: tₙ = a + (n − 1)d; Sₙ = n/2 [2a + (n − 1)d] = n/2 (first + last).",
      "Number of terms = (last − first)/d + 1.",
      "GP: tₙ = arⁿ⁻¹; Sₙ = a(rⁿ − 1)/(r − 1); infinite sum = a/(1 − r) for |r| < 1.",
      "Three terms in AP: take a − d, a, a + d (sum = 3a). In GP: a/r, a, ar (product = a³).",
      "Σn = n(n+1)/2; Σn² = n(n+1)(2n+1)/6; Σn³ = [n(n+1)/2]². Sum of first n odd numbers = n².",
      "For two positive numbers: AM ≥ GM ≥ HM and <b>GM² = AM × HM</b>."
    ],
    sections: [
      { h: "Formula table", blocks: [
        { table: { head: ["Quantity", "AP", "GP"], rows: [
          ["n-th term", "a + (n − 1)d", "arⁿ⁻¹"],
          ["Sum of n terms", "n/2 [2a + (n − 1)d]", "a(rⁿ − 1)/(r − 1)"],
          ["Infinite sum", "diverges (d ≠ 0)", "a/(1 − r), |r| < 1"],
          ["Mean of a, b", "AM = (a + b)/2", "GM = √(ab)"]
        ] } },
        { table: { head: ["n", "Σn", "Σn²", "Σn³"], rows: [["10", "55", "385", "3,025"], ["20", "210", "2,870", "44,100"]] } }
      ] },
      { h: "Worked examples", blocks: [
        ex("Ex 1. 10th term and sum of 20 terms of 3, 7, 11, …", ["t₁₀ = 3 + 9 × 4 = <b>39</b>.", "S₂₀ = 10 × (6 + 19 × 4) = 10 × 82 = <b>820</b>"]),
        ex("Ex 2. How many two-digit numbers are divisible by 7?", ["14 … 98 → (98 − 14)/7 + 1 = <b>13</b>"]),
        ex("Ex 3. Sum of all three-digit multiples of 6?", ["102 … 996: n = (996 − 102)/6 + 1 = 150.", "S = 150/2 × (102 + 996) = 75 × 1,098 = <b>82,350</b>"]),
        ex("Ex 4. GP 2, 6, 18, …: 7th term and sum of 6 terms?", ["t₇ = 2 × 3⁶ = <b>1,458</b>. S₆ = 2(729 − 1)/2 = <b>728</b>"]),
        ex("Ex 5. Three numbers in AP have sum 27 and product 648. Find them.", ["a − d, a, a + d: 3a = 27 → a = 9.", "9(81 − d²) = 648 → d² = 9 → <b>6, 9, 12</b>"]),
        ex("Ex 6. A ball dropped from 10 m rebounds to 3/4 of its height each time. Total distance travelled?", ["Down 10, then each rebound goes up and down: 2 × (7.5 + 5.625 + …) = 2 × 7.5/(1 − 3/4) = 60.", "Total = <b>70 m</b>"]),
        ex("Ex 7. The AM of two numbers is 10 and the GM is 8. HM? The numbers?", ["HM = GM²/AM = 64/10 = <b>6.4</b>.", "Sum 20, product 64 → <b>16 and 4</b>"])
      ] },
      { h: "Traps", blocks: [
        { warn: "‘Between 100 and 200’ usually excludes the endpoints — check before counting terms." },
        { warn: "Infinite GP formula needs |r| < 1; for r ≥ 1 the sum grows without limit." }
      ] }
    ],
    practice: [
      { q: "Which term of 5, 8, 11, … is 95?", a: "(95 − 5)/3 + 1 = <b>31st</b>." },
      { q: "Sum of the first 50 odd numbers?", a: "n² = <b>2,500</b>." },
      { q: "In a GP the 3rd term is 12 and the 6th is 96. First term?", a: "r³ = 8 → r = 2 → a = 12/4 = <b>3</b>." },
      { q: "0.3 + 0.03 + 0.003 + … = ?", a: "0.3/(1 − 0.1) = <b>1/3</b>." },
      { q: "Sum of the integers 1–100 that are not divisible by 5?", a: "5,050 − 5 × (1 + … + 20) = 5,050 − 1,050 = <b>4,000</b>." },
      { q: "Insert 3 arithmetic means between 4 and 20.", a: "5 terms, 4d = 16 → d = 4 → <b>8, 12, 16</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Mock strategy + mixed drill ───────────────────────── */
  add({
    id: "apt-mixed-drill",
    subject: "aptitude",
    title: "Aptitude Mocks — timing strategy, speed maths, mixed drill",
    minutes: 35,
    crux: [
      "<b>Two passes</b>: pass 1 answers everything you can do in ≤ 60 s and marks the rest; pass 2 returns to marked questions.",
      "<b>20-second rule</b>: if no method comes to mind in 20 s, mark and move on.",
      "Use the options: back-substitute, check unit digits, divisibility, and eliminate impossible sizes.",
      "Know the test's marking scheme: with no negative marking, never leave a blank; with it, guess only after eliminating options.",
      "Keep an <b>error log</b> (topic, mistake type, fix). The two topics with most errors × highest frequency are your weak areas.",
      "Speed maths: fractions ↔ %, squares to 30, ×5 = ×10 ÷ 2, ×25 = ×100 ÷ 4, n5² = n(n+1) followed by 25."
    ],
    sections: [
      { h: "Timing plan for a 60-question, 60-minute mock", blocks: [
        { table: { head: ["Phase", "Time", "What you do"], rows: [
          ["Pass 1", "0–40 min", "Answer every quick question; mark anything > 60 s"],
          ["Pass 2", "40–55 min", "Marked questions, easiest-looking first"],
          ["Sweep", "55–60 min", "Fill blanks (if no negative marking); recheck flagged calculations"],
          ["Review", "after", "Every wrong/skipped question goes into the error log"]
        ] } },
        { table: { head: ["Topic", "Error type", "Fix"], rows: [
          ["Time & Work", "calculation", "use LCM units, not fractions"],
          ["Syllogism", "concept", "redraw minimal Venn; test every diagram"],
          ["DI", "misread", "circle units and year before calculating"]
        ] } },
        { tip: "Weakest-area practice (D52): take the top 2 topics from the log, reread their crux lines, then do 20 questions each untimed, then 10 timed." }
      ] },
      { h: "Speed maths", blocks: [
        { table: { head: ["Trick", "Example"], rows: [
          ["×11 (two-digit ab)", "43 × 11 = 4 | 4+3 | 3 = 473"],
          ["Square ending in 5", "35² = 3 × 4 | 25 = 1,225"],
          ["×25", "36 × 25 = 3,600/4 = 900"],
          ["Near-base squares", "48² = (50 − 2)² = 2,500 − 200 + 4 = 2,304"],
          ["% via fraction", "14.28% of 350 ≈ 350/7 = 50"]
        ] } }
      ] },
      { h: "Mixed worked set", blocks: [
        ex("1 [Percent]. A number increased by 20% becomes 90. The number?", ["90/1.2 = <b>75</b>"]),
        ex("2 [TSD]. A 180 m train at 72 km/h crosses a bridge in 25 s. Bridge length?", ["20 m/s × 25 = 500 → 500 − 180 = <b>320 m</b>"]),
        ex("3 [Work]. A takes 18 days and B 12 days. A works 6 days and leaves. How long does B take for the rest?", ["A did 6/18 = 1/3 → 2/3 left → 2/3 × 12 = <b>8 days</b>"]),
        ex("4 [P&C]. Choose 2 boys and 2 girls from 5 boys and 4 girls.", ["⁵C₂ × ⁴C₂ = 10 × 6 = <b>60</b>"]),
        ex("5 [Probability]. Two dice: P(sum ≥ 10)?", ["(4,6), (5,5), (6,4), (5,6), (6,5), (6,6) = 6/36 = <b>1/6</b>"]),
        ex("6 [Number]. Smallest 4-digit number divisible by 12, 15 and 18?", ["LCM = 180; 180 × 6 = <b>1,080</b>"]),
        ex("7 [Ages]. Ages are 3 : 4; in 5 years they will be 4 : 5. Present ages?", ["5(3k + 5) = 4(4k + 5) → k = 5 → <b>15 and 20</b>"]),
        ex("8 [Series]. 3, 5, 9, 17, 33, ?", ["×2 − 1 → <b>65</b>"])
      ] }
    ],
    practice: [
      { q: "A shopkeeper allows 10% discount and still gains 17%. By what % above CP is the MP?", a: "1.17/0.9 = 1.3 → <b>30%</b>." },
      { q: "45 km/h in m/s?", a: "45 × 5/18 = <b>12.5 m/s</b>." },
      { q: "Unit digit of 2²⁰²⁶?", a: "2026 mod 4 = 2 → 2nd in cycle 2, 4, 8, 6 → <b>4</b>." },
      { q: "Two cards are drawn together. P(same suit)?", a: "After the first card, 12 of the remaining 51 match → <b>12/51 = 4/17</b>." },
      { q: "2, 5, 10, 17, 26, ?", a: "n² + 1 → 6² + 1 = <b>37</b>." },
      { q: "The average of 10, 20, 30, 40 and x is 28. Find x.", a: "140 − 100 = <b>40</b>." }
    ],
    related: []
  });

  /* ───────────────────────── Block → lesson map ───────────────────────── */
  map("d1-ni", ["apt-percentages"]);
  map("d2-ni", ["apt-ratio-proportion"]);
  map("d3-ni", ["apt-tsd"]);
  map("d4-ni", ["apt-profit-loss"]);
  map("d5-ni", ["apt-averages"]);
  map("d6-ni", ["apt-number-system"]);
  map("d8-ni", ["apt-time-work"]);
  map("d9-ni", ["apt-perm-comb"]);
  map("d10-ni", ["apt-probability"]);
  map("d11-ni", ["apt-interest"]);
  map("d12-ni", ["apt-seating"]);
  map("d13-ni", ["apt-blood-direction"]);
  map("d15-ni", ["apt-syllogism"]);
  map("d16-ni", ["apt-di"]);
  map("d17-ni", ["apt-clocks-calendars"]);
  map("d18-ni", ["apt-cubes-dice"]);
  map("d19-ni", ["apt-coding-decoding"]);
  map("d20-ni", ["apt-series-analogies"]);
  map("d22-ni", ["apt-statement-conclusion"]);
  map("d23-ni", ["apt-venn"]);
  map("d24-ni", ["apt-data-sufficiency"]);
  map("d25-ni", ["apt-mixtures-alligation"]);
  map("d26-ni", ["apt-puzzles-classic"]);
  map("d27-ni", ["apt-probability-hard"]);
  map("d29-ni", ["apt-logical-puzzles"]);
  map("d30-ni", ["apt-di"]);
  map("d31-ni", ["apt-puzzles-advanced"]);
  map("d32-ni", ["apt-reading-comprehension"]);
  map("d33-ni", ["apt-sentence-correction"]);
  map("d34-ni", ["apt-mensuration"]);
  map("d36-ni", ["apt-progressions"]);
  map("d37-ni", ["apt-puzzles-classic", "apt-puzzles-advanced"]);
  map("d38-ni", ["apt-logical-puzzles", "apt-syllogism", "apt-seating", "apt-blood-direction"]);
  map("d39-ni", ["apt-mixed-drill", "apt-number-system", "apt-tsd", "apt-time-work"]);
  map("d40-ni", ["apt-reading-comprehension", "apt-sentence-correction"]);
  map("d41-ni", ["apt-di", "apt-data-sufficiency"]);
  map("d43-ni", ["apt-puzzles-advanced", "apt-logical-puzzles"]);
  map("d44-ni", ["apt-mixed-drill", "apt-profit-loss", "apt-interest", "apt-mixtures-alligation"]);
  map("d45-ni", ["apt-logical-puzzles", "apt-statement-conclusion", "apt-series-analogies", "apt-cubes-dice"]);
  map("d46-ni", ["apt-mixed-drill", "apt-di", "apt-syllogism"]);
  map("d47-ni", ["apt-puzzles-classic", "apt-puzzles-advanced"]);
  map("d51-af", ["apt-puzzles-classic", "apt-puzzles-advanced"]);
  map("d51-ni", ["apt-mixed-drill"]);
  map("d52-mo", ["apt-mixed-drill", "apt-di", "apt-logical-puzzles", "apt-syllogism"]);
  map("d52-af", ["apt-perm-comb", "apt-probability", "apt-probability-hard", "apt-puzzles-classic", "apt-puzzles-advanced"]);
})();
