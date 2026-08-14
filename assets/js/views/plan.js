/* ==========================================================================
   views/plan.js — the 60-day plan: phases → weeks → days → 4 blocks
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var filter = { q: "", show: "all" };
  var openDay = null;

  /* ---- focus timer (one at a time) ------------------------------------- */
  var timer = null;

  function stopTimer(save) {
    if (!timer) return;
    clearInterval(timer.tick);
    var secs = Math.round((Date.now() - timer.started) / 1000) + timer.base;
    if (save && secs > 20) {
      S.logTime({ id: timer.blockId, day: timer.day, slot: timer.slot, seconds: secs });
      U.toast("Logged " + U.clock(secs) + " on " + timer.slot, "good");
    }
    if (timer.bar && timer.bar.parentNode) timer.bar.parentNode.removeChild(timer.bar);
    timer = null;
  }

  function startTimer(block, day, host) {
    stopTimer(true);
    var clock = el("div", { class: "timer-clock", text: "0:00" });
    var bar = el("div", { class: "timerbar" }, [
      el("span", { style: "font-size:15px", text: "⏱" }),
      clock,
      el("div", { class: "timer-what small" }, [
        el("b", { text: day ? "Day " + day.day + " · " + block.slot : block.slot }),
        block.hours ? el("span", { class: "muted", text: "  target " + U.hours(block.hours) }) : null
      ]),
      el("div", { style: "margin-left:auto;display:flex;gap:6px" }, [
        el("button", { class: "btn btn-sm", text: "Save & stop", onclick: function () { stopTimer(true); } }),
        el("button", { class: "btn btn-sm btn-ghost", text: "Discard", onclick: function () { stopTimer(false); } })
      ])
    ]);
    host.insertBefore(bar, host.firstChild);
    timer = {
      blockId: block.id, day: day ? day.day : null, slot: block.slot,
      started: Date.now(), base: 0, bar: bar,
      tick: setInterval(function () {
        // the bar is dropped whenever the view re-renders — save and stop
        if (!timer || !timer.bar.isConnected) { stopTimer(true); return; }
        clock.textContent = U.clock(Math.round((Date.now() - timer.started) / 1000));
      }, 1000)
    };
  }

  /* ---- a single block row --------------------------------------------- */
  function blockRow(block, day, opts) {
    opts = opts || {};
    var bid = S.ids.block(block);
    var done = S.isDone(bid);

    var probIds = (block.problems || []).map(function (_, i) { return S.ids.problem(block, i); });
    var probDone = S.countDone(probIds);

    var row = el("div", { class: "blk" + (done ? " is-done" : "") });

    var check = el("input", {
      type: "checkbox", class: "check check-lg", checked: done,
      "aria-label": "Mark " + block.slot + " block done",
      onchange: function () {
        S.setDone(bid, check.checked);
        S.emit("toggle");
        row.classList.toggle("is-done", check.checked);
        if (opts.onToggle) opts.onToggle();
      }
    });

    var actions = el("div", { class: "blk-actions" }, [
      probIds.length ? el("span", {
        class: "tiny muted tnum nowrap",
        text: probDone + "/" + probIds.length + " problems"
      }) : null,
      el("button", {
        class: "btn btn-sm btn-ghost", title: "Start a focus timer for this block",
        text: "⏱", onclick: function () {
          var host = U.$("#view-root");
          startTimer(block, day, host);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      })
    ]);

    var body = el("div", { style: "min-width:0" }, [
      el("div", { class: "blk-head" }, [
        el("span", { class: "blk-slot", dataset: { slot: block.slot }, text: block.slot }),
        block.hours ? el("span", { class: "blk-hours", text: U.hours(block.hours) }) : null,
        opts.highlight ? el("span", { class: "tag tag-t3", text: "now" }) : null,
        actions
      ]),
      el("div", { class: "blk-text", html: block.html })
    ]);

    /* problem chips */
    if (probIds.length) {
      var chips = el("div", { class: "chips" });
      var counter = actions.querySelector("span");
      block.problems.forEach(function (prob, i) {
        chips.appendChild(R.chip({
          id: probIds[i], text: prob.n, item: prob,
          onToggle: function () {
            counter.textContent = S.countDone(probIds) + "/" + probIds.length + " problems";
          }
        }));
      });
      body.appendChild(el("div", { class: "blk-sub" }, [
        el("div", { class: "blk-sublabel" }, [
          "Problems in this block",
          el("button", {
            class: "btn btn-sm btn-ghost", style: "margin-left:8px;height:20px;font-size:11px",
            text: "tick all",
            onclick: function () {
              S.setMany(probIds, true);
              U.$$(".chip", chips).forEach(function (c) {
                c.classList.add("is-done");
                c.querySelector("input").checked = true;
              });
              counter.textContent = probIds.length + "/" + probIds.length + " problems";
            }
          })
        ]),
        chips
      ]));
    }

    /* mock links */
    if ((block.mocks || []).length) {
      body.appendChild(el("div", { class: "row", style: "margin-top:9px" }, block.mocks.map(function (m) {
        return el("button", {
          class: "tag tag-t2", style: "cursor:pointer",
          text: (m.kind === "OA" ? "Mock OA #" : "Mock Interview #") + m.n + " →",
          onclick: function () { location.hash = "#/mocks"; }
        });
      })));
    }

    U.append(row, [el("div", { class: "blk-check" }, [check]), body]);
    return row;
  }

  /* ---- day card ------------------------------------------------------- */
  function dayCard(day, cur) {
    var prog = S.dayProgress(day);
    var isOpen = openDay === day.day;
    var sched = S.scheduledDate(day.day);

    var card = el("div", {
      class: "day" + (isOpen ? " is-open" : "") + (prog.complete ? " is-done" : "") + (day.day === cur ? " is-today" : ""),
      id: "day-" + day.day
    });

    var meterHost = el("div", { style: "width:92px" }, [R.meter({ done: prog.done, total: prog.total, showValue: false })]);
    var metaHost = el("div", { class: "day-meta" }, [
      el("span", { text: U.hours(day.hours) }),
      el("span", { text: prog.done + "/" + prog.total + " blocks" }),
      sched ? el("span", { text: U.shortDate(sched) }) : null,
      day.isConsolidation ? el("span", { style: "color:var(--s2);font-weight:600", text: "Consolidation" }) : null
    ]);

    function refreshHead() {
      var p = S.dayProgress(day);
      U.clear(meterHost).appendChild(R.meter({ done: p.done, total: p.total, showValue: false }));
      card.classList.toggle("is-done", p.complete);
      metaHost.childNodes[1].textContent = p.done + "/" + p.total + " blocks";
    }

    var head = el("button", {
      class: "day-head", "aria-expanded": isOpen ? "true" : "false",
      onclick: function () {
        openDay = (openDay === day.day) ? null : day.day;
        Views.plan.rerender();
      }
    }, [
      el("div", { class: "day-num" }, [el("small", { text: "DAY" }), String(day.day)]),
      el("div", { class: "day-main" }, [
        el("div", { class: "day-title", text: day.title }),
        metaHost
      ]),
      el("div", { class: "day-right" }, [
        prog.complete ? el("span", { class: "tag tag-good", text: "✔ done" }) : null,
        meterHost,
        el("span", { class: "day-caret", text: "▶" })
      ])
    ]);
    card.appendChild(head);

    if (isOpen) {
      var body = el("div", { class: "day-body" });
      (day.blocks || []).forEach(function (b) {
        body.appendChild(blockRow(b, day, { onToggle: refreshHead }));
      });
      body.appendChild(R.noteBox("day:" + day.day, "What actually happened today? Blockers, wins, what to redo…"));
      body.appendChild(el("div", { class: "row", style: "margin-top:14px" }, [
        el("button", {
          class: "btn btn-sm btn-primary", text: "Mark whole day done",
          onclick: function () { S.setMany(S.dayBlockIds(day), true); Views.plan.rerender(); }
        }),
        el("button", {
          class: "btn btn-sm btn-ghost", text: "Clear day",
          onclick: function () {
            S.setMany(S.dayBlockIds(day).concat(S.dayProblemIds(day)), false);
            Views.plan.rerender();
          }
        }),
        day.day > 1 ? el("button", {
          class: "btn btn-sm btn-ghost", text: "← Day " + (day.day - 1),
          onclick: function () { openDay = day.day - 1; Views.plan.rerender(true); }
        }) : null,
        day.day < 60 ? el("button", {
          class: "btn btn-sm btn-ghost", text: "Day " + (day.day + 1) + " →",
          onclick: function () { openDay = day.day + 1; Views.plan.rerender(true); }
        }) : null
      ]));
      card.appendChild(body);
    }

    return card;
  }

  /* ---- view ----------------------------------------------------------- */
  Views.plan = {
    title: "60-Day Plan",
    blockRow: blockRow,

    route: function (param) {
      if (param) openDay = Number(param) || null;
    },

    rerender: function (scroll) {
      var host = U.$("#view-root");
      if (!host) return;
      U.clear(host).appendChild(Views.plan.render());
      if (scroll && openDay) {
        var node = U.$("#day-" + openDay);
        if (node) node.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    },

    render: function () {
      var root = el("div", {});
      var cur = S.currentDay();
      var p = S.progress();

      root.appendChild(R.pageHead(
        "The 60-Day Plan",
        "Every day is four blocks: <b>Morning</b> (new concept + hard problems) · <b>Afternoon</b> (pattern drilling) · " +
        "<b>Evening</b> (theory / SQL / design / project) · <b>Night</b> (revision, Redo List, aptitude). " +
        "Tick a block when it is genuinely done — the numbers are only useful if they are honest.",
        el("div", { style: "text-align:right;flex:none;min-width:150px" }, [
          R.meter({ done: p.plan.done, total: p.plan.total, label: "All blocks", size: "lg" }),
          el("div", { class: "tiny muted", style: "margin-top:6px", text: p.daysComplete + " of 60 days complete" })
        ])
      ));

      /* filters */
      var search = el("input", {
        class: "inp", type: "search", placeholder: "Search all 60 days — topic, problem, keyword…",
        value: filter.q,
        oninput: U.debounce(function (e) { filter.q = e.target.value.trim(); Views.plan.rerender(); }, 220)
      });
      var seg = el("div", { class: "seg" }, [
        ["all", "All"], ["open", "Unfinished"], ["done", "Done"], ["consol", "Consolidation"]
      ].map(function (o) {
        return el("button", {
          text: o[1], "aria-pressed": filter.show === o[0] ? "true" : "false",
          onclick: function () { filter.show = o[0]; Views.plan.rerender(); }
        });
      }));
      root.appendChild(el("div", { class: "filterbar" }, [
        search, seg,
        el("button", {
          class: "btn btn-sm", text: "Jump to today",
          onclick: function () { openDay = cur; Views.plan.rerender(true); }
        }),
        el("button", {
          class: "btn btn-sm btn-ghost", text: openDay ? "Collapse" : "Expand today",
          onclick: function () { openDay = openDay ? null : cur; Views.plan.rerender(); }
        })
      ]));

      /* filter days */
      var q = filter.q.toLowerCase();
      var days = (H.days || []).filter(function (d) {
        var prog = S.dayProgress(d);
        if (filter.show === "open" && prog.complete) return false;
        if (filter.show === "done" && !prog.complete) return false;
        if (filter.show === "consol" && !d.isConsolidation) return false;
        if (!q) return true;
        if (String(d.day) === q) return true;
        var hay = d.title + " " + d.phaseName + " " + (d.blocks || []).map(function (b) {
          return b.text + " " + (b.problems || []).map(function (x) { return x.n; }).join(" ");
        }).join(" ");
        return hay.toLowerCase().indexOf(q) >= 0;
      });

      if (!days.length) {
        root.appendChild(R.empty("No days match <b>" + U.esc(filter.q) + "</b>."));
        return root;
      }

      if (q || filter.show !== "all") {
        root.appendChild(el("div", { class: "small muted", style: "margin-bottom:10px", text: U.plural(days.length, "day") + " shown" }));
      }

      /* group by phase → week */
      var lastPhase = null, lastWeek = null;
      days.forEach(function (d) {
        if (d.phase !== lastPhase && !q && filter.show === "all") {
          lastPhase = d.phase;
          var ph = (H.phases || []).filter(function (x) { return x.id === d.phase; })[0];
          if (ph) {
            var pp = S.phaseProgress(ph);
            root.appendChild(el("div", { class: "phase-band" }, [
              el("span", { class: "phase-n", text: "P" + ph.num }),
              el("div", { style: "flex:1;min-width:0" }, [
                el("div", { class: "phase-name", text: ph.name }),
                ph.goal ? el("div", { class: "phase-goal", text: ph.goal }) : null
              ]),
              el("div", { style: "width:120px;flex:none" }, [
                R.meter({ done: pp.done, total: pp.total, size: "sm", showValue: false }),
                el("div", { class: "tiny muted tnum", style: "margin-top:4px;text-align:right", text: pp.pct + "%" })
              ])
            ]));
            lastWeek = null;
          }
        }
        if (d.week !== lastWeek && !q && filter.show === "all") {
          lastWeek = d.week;
          var wk = (H.weeks || []).filter(function (x) { return x.week === d.week; })[0];
          var wp = S.weekProgress(d.week);
          var target = S.targetForWeek(d.week);
          var score = S.scoreFor(d.week);
          var thisWeek = d.week;
          root.appendChild(el("div", { class: "week-strip" }, [
            el("b", { text: "Week " + thisWeek }),
            wk ? el("span", { class: "muted", text: wk.days }) : null,
            wk ? el("span", { style: "flex:1;min-width:0", text: wk.milestone }) : el("span", { style: "flex:1" }),
            target ? el("span", {
              class: "tag" + (score ? (score.total >= target ? " tag-good" : " tag-t2") : ""),
              text: score ? "score " + score.total + " / target " + target : "target " + target
            }) : null,
            wp.done ? el("button", {
              class: "btn btn-sm btn-ghost", style: "height:22px;padding:0 7px;font-size:11.5px",
              text: "↺ redo week",
              title: "Clear this week's ticks and start it again from today",
              onclick: function () {
                var list = S.daysInScope("week", thisWeek);
                var st = S.scopeStats(list);
                if (!confirm("Restart Week " + thisWeek + "?\n\nClears " + st.blocksDone + " ticked blocks and " +
                             st.problemsDone + " ticked problems across days " + st.first + "–" + st.last +
                             ", and re-anchors the calendar so Day " + st.first + " is today.\n\nThis cannot be undone.")) return;
                S.resetDays(list);
                S.reanchor(st.first);
                U.toast("Week " + thisWeek + " restarted — Day " + st.first + " is today", "good");
                Views.plan.rerender();
              }
            }) : null,
            R.meter({ done: wp.done, total: wp.total, size: "sm", showValue: false })
          ]));
        }
        root.appendChild(dayCard(d, cur));
      });

      return root;
    }
  };
})();
