/* ==========================================================================
   views/dashboard.js — today's work, headline progress, what's next
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;

  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return "Still up";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 22) return "Good evening";
    return "Late session";
  }

  /* which block should they be doing right now? */
  function liveSlot() {
    var h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 17) return "Afternoon";
    if (h < 21) return "Evening";
    return "Night";
  }

  function startBanner() {
    var wrap = el("div", { class: "card card-pad-lg", style: "border-color:var(--accent-line);background:var(--accent-soft)" });
    var input = el("input", { type: "date", class: "inp", style: "max-width:180px", value: U.todayKey() });
    U.append(wrap, [
      el("h3", { style: "font-size:16px;margin-bottom:4px", text: "Set your Day 1" }),
      el("p", { class: "small dim", style: "max-width:60ch", html: "Pick the date you start (or started). Everything else — today's plan, your schedule, slippage, the weekly readiness scores — keys off this. You can change it later in Settings." }),
      el("div", { class: "row", style: "margin-top:12px" }, [
        input,
        el("button", {
          class: "btn btn-primary", text: "Start the 60 days",
          onclick: function () {
            if (!input.value) { U.toast("Pick a date first"); return; }
            S.startDate(input.value);
            U.toast("Day 1 = " + U.prettyDate(input.value), "good");
          }
        }),
        el("button", {
          class: "btn btn-ghost", text: "Skip — just track progress",
          onclick: function () { S.startDate(""); S.emit("start-date"); }
        })
      ])
    ]);
    return wrap;
  }

  function todayCard(day) {
    var prog = S.dayProgress(day);
    var live = liveSlot();
    var sched = S.scheduledDate(day.day);

    var head = el("div", { class: "row", style: "margin-bottom:14px;align-items:flex-start" }, [
      el("div", { style: "flex:1;min-width:0" }, [
        el("div", { class: "row", style: "gap:8px" }, [
          el("span", { class: "tag tag-t3", text: "Day " + day.day + " of 60" }),
          day.isConsolidation ? el("span", { class: "tag tag-t2", text: "Consolidation day" }) : null,
          el("span", { class: "tag", text: "Week " + day.week }),
          el("span", { class: "tag", text: U.hours(day.hours) })
        ]),
        el("h3", { style: "font-size:19px;margin-top:9px;letter-spacing:-.02em", text: day.title }),
        el("div", { class: "small muted", style: "margin-top:2px", text: sched ? U.weekday(sched) + ", " + U.prettyDate(sched) : day.phaseName })
      ]),
      el("div", { style: "width:130px;flex:none" }, [
        R.meter({ done: prog.done, total: prog.total, label: "Today", size: "lg" })
      ])
    ]);

    var body = el("div", {});
    (day.blocks || []).forEach(function (b) {
      body.appendChild(Views.plan.blockRow(b, day, { compact: true, highlight: b.slot === live }));
    });

    return el("div", { class: "card card-pad-lg" }, [
      head, body,
      el("div", { class: "row", style: "margin-top:16px;padding-top:14px;border-top:1px solid var(--line)" }, [
        el("button", {
          class: "btn", text: "Open full day →",
          onclick: function () { location.hash = "#/plan/" + day.day; }
        }),
        prog.complete ? el("span", { class: "tag tag-good", text: "✔ Day complete" }) : el("button", {
          class: "btn btn-primary", text: "Mark all 4 blocks done",
          onclick: function () {
            S.setMany(S.dayBlockIds(day), true);
            U.toast("Day " + day.day + " complete — well done", "good");
          }
        })
      ])
    ]);
  }

  function nextMock() {
    var sched = (H.mocks || {}).schedule || [];
    var cur = S.currentDay();
    var pending = sched.filter(function (m) { return !S.isDone(S.ids ? S.ids.mock(m.n) : "mk:" + m.n); });
    var upcoming = pending.filter(function (m) { return m.day >= cur; });
    return (upcoming[0] || pending[0] || null);
  }

  Views.dashboard = {
    title: "Dashboard",
    render: function () {
      var root = el("div", {});
      var p = S.progress();
      var streak = S.streak();
      var cur = S.currentDay();
      var day = S.dayById(cur);
      var topics = S.topicTotals();

      /* ---- head ---- */
      root.appendChild(R.pageHead(
        greeting() + " — " + (streak.today ? "you've already logged work today" : "let's get the first block done"),
        S.startDate()
          ? "Day <b>" + cur + "</b> of 60 · started " + U.prettyDate(S.startDate())
          : "Not scheduled yet — set your Day 1 below to unlock the calendar view."
      ));

      if (!S.startDate() && S.startDate() !== "") {
        root.appendChild(startBanner());
        root.appendChild(el("div", { style: "height:24px" }));
      }

      /* ---- hero + tiles ---- */
      var band = null;
      var latest = S.latestScore();
      if (latest) band = S.band(latest.score.total);

      root.appendChild(el("div", { class: "grid g-side", style: "margin-bottom:12px" }, [
        el("div", { class: "card card-pad-lg" }, [
          el("div", { class: "row", style: "justify-content:space-between;align-items:flex-start" }, [
            el("div", {}, [
              el("div", { class: "tile-label", text: "Programme complete" }),
              el("div", { class: "hero", style: "margin-top:6px" }, [
                el("div", { class: "hero-fig" }, [String(p.overall), el("small", { text: "%" })]),
                el("div", { class: "hero-meta small muted" }, [
                  el("div", { html: "<b style='color:var(--ink)'>" + p.plan.done + "</b> of " + p.plan.total + " work blocks" }),
                  el("div", { html: "<b style='color:var(--ink)'>" + p.daysComplete + "</b> of 60 days fully done" })
                ])
              ])
            ]),
            el("div", { style: "text-align:right" }, [
              el("div", { class: "tile-label", text: "Streak" }),
              el("div", { style: "font-size:27px;font-weight:680;letter-spacing:-.03em" }, [
                String(streak.current),
                el("small", { style: "font-size:14px;color:var(--ink-3);font-weight:550", text: streak.current === 1 ? " day" : " days" })
              ]),
              el("div", { class: "tiny muted", text: "best " + streak.best })
            ])
          ]),
          el("div", { style: "margin-top:18px" }, [
            R.meter({ done: p.plan.done, total: p.plan.total, label: "60-day plan", size: "lg" })
          ]),
          el("div", { class: "grid g2", style: "margin-top:14px" }, [
            R.meter({ done: p.problems.done, total: p.problems.total, label: "Problems in the plan", size: "sm" }),
            R.meter({ done: p.bank.done, total: p.bank.total, label: "Question banks", size: "sm" }),
            R.meter({ done: topics.solved, total: topics.target, label: "Per-topic problem quota", size: "sm" }),
            R.meter({ done: p.checklist.done, total: p.checklist.total, label: "Final checklist", size: "sm" })
          ])
        ]),
        el("div", { class: "grid g2" }, [
          R.tile({
            label: "Hours banked", value: Math.round(p.hours), unit: "h",
            foot: "of ~610 planned" + (p.loggedSeconds ? " · " + U.clock(p.loggedSeconds) + " on timer" : "")
          }),
          R.tile({
            label: "Mocks done", value: p.mocks.done, unit: "/ " + p.mocks.total,
            foot: p.oas.done + " of " + p.oas.total + " mock OAs"
          }),
          R.tile({
            label: "Readiness", value: latest ? latest.score.total : "—",
            unit: latest ? "/100" : "",
            foot: latest
              ? (band ? band.label : "") + " · week " + latest.week
              : "Score it on your first consolidation day"
          }),
          R.tile({
            label: "Redo due", value: S.redoDue().length,
            foot: S.weakness.all().filter(function (w) { return w.status !== "fixed"; }).length + " open weaknesses"
          })
        ])
      ]));

      /* ---- slippage warning (status colour + icon + label, never colour alone) ---- */
      var behind = S.slippage();
      if (behind.length) {
        var firstOpen = S.firstIncompleteDay();
        root.appendChild(el("div", {
          class: "card",
          style: "border-color:color-mix(in srgb,var(--warning) 45%,transparent);background:color-mix(in srgb,var(--warning) 9%,transparent);margin-bottom:12px"
        }, [
          el("div", { class: "row" }, [
            el("span", { style: "font-size:15px", text: "⚠" }),
            el("div", { style: "flex:1;min-width:0" }, [
              el("b", { text: U.plural(behind.length, "day") + " behind schedule" }),
              el("span", { class: "small muted", text: "  Day " + behind.slice(0, 12).join(", ") + (behind.length > 12 ? "…" : "") })
            ]),
            el("button", {
              class: "btn btn-sm btn-primary", text: "Catch up: make today Day " + firstOpen,
              title: "Slides the whole schedule so your first unfinished day is today. Nothing is cleared.",
              onclick: function () {
                if (!confirm("Re-anchor the calendar so today is Day " + firstOpen + "?\n\nNo progress is cleared — this only moves the dates.")) return;
                S.reanchor(firstOpen);
                U.toast("Back on track — today is Day " + firstOpen, "good");
                App.render();
              }
            }),
            el("button", {
              class: "btn btn-sm", text: "Review",
              onclick: function () { location.hash = "#/plan/" + behind[0]; }
            }),
            el("button", {
              class: "btn btn-sm btn-ghost", text: "Restart options →",
              onclick: function () { location.hash = "#/settings"; }
            })
          ])
        ]));
      }

      /* ---- today ---- */
      if (day) {
        root.appendChild(R.sectionHead("Today's four blocks", "Morning 4h · Afternoon 3h · Evening 2h · Night 1h"));
        root.appendChild(todayCard(day));
      }

      /* ---- next up ---- */
      var mock = nextMock();
      var week = (H.weeks || []).filter(function (w) { return w.week === (day ? day.week : 1); })[0];
      root.appendChild(R.sectionHead("On the horizon"));
      root.appendChild(el("div", { class: "grid g3" }, [
        week ? el("div", { class: "card" }, [
          el("div", { class: "tile-label", text: "Week " + week.week + " milestone" }),
          el("p", { class: "small", style: "margin-top:6px", text: week.milestone }),
          el("div", { class: "tiny muted", text: "Cumulative target: " + week.cumulative + " problems" }),
          el("div", { style: "margin-top:10px" }, [
            R.meter({ pct: S.weekProgress(week.week).pct, label: "Week " + week.week, size: "sm", hideCount: true })
          ])
        ]) : null,
        mock ? el("div", { class: "card" }, [
          el("div", { class: "tile-label", text: "Next mock" }),
          el("p", { class: "small", style: "margin-top:6px" }, [
            el("b", { text: "#" + mock.n + " · Day " + mock.day }), el("br"),
            mock.type
          ]),
          el("div", { class: "tiny muted", text: mock.focus }),
          el("button", {
            class: "btn btn-sm", style: "margin-top:10px", text: "Open mocks →",
            onclick: function () { location.hash = "#/mocks"; }
          })
        ]) : null,
        el("div", { class: "card" }, [
          el("div", { class: "tile-label", text: "Ground rule to hold today" }),
          (function () {
            var rules = H.groundRules || [];
            var r = rules[new Date().getDate() % (rules.length || 1)];
            return r ? el("p", { class: "small", style: "margin-top:6px", html: r.html }) : null;
          })()
        ])
      ]));

      /* ---- 60-day heat ---- */
      root.appendChild(R.sectionHead("All 60 days", "One square per day. Click any square to open it."));
      root.appendChild(el("div", { class: "card" }, [C.heat({ today: cur })]));

      /* ---- readiness trajectory ---- */
      var traj = (H.readiness || {}).trajectory || [];
      if (traj.length) {
        var labels = traj.map(function (t) { return t.week === 10 ? "D60" : "W" + t.week; });
        var target = traj.map(function (t) { return t.target; });
        var actual = traj.map(function (t) {
          var s = S.scoreFor(t.week);
          return s ? s.total : null;
        });
        root.appendChild(R.sectionHead("Readiness vs the plan's trajectory", "Score yourself every consolidation day"));
        root.appendChild(el("div", { class: "card card-pad-lg" }, [
          C.line({
            labels: labels,
            yMax: 100, yTicks: [0, 25, 50, 75, 100],
            aria: "Weekly readiness score against the handbook's target trajectory",
            tipPrefix: "",
            series: [
              { name: "Plan target", color: "var(--s1)", values: target, dashed: true },
              { name: "Your score", color: "var(--s2)", values: actual }
            ]
          }),
          el("div", { class: "row", style: "margin-top:12px" }, [
            el("button", {
              class: "btn btn-sm", text: "Score this week →",
              onclick: function () { location.hash = "#/readiness"; }
            }),
            el("span", { class: "tiny muted", text: "10 dimensions, 0–10 each" })
          ])
        ]));
      }

      return root;
    }
  };
})();
