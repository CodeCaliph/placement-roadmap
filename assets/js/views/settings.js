/* ==========================================================================
   views/settings.js — schedule, theme, backup, reset
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;

  /* ======================================================================
     Re-anchor — move the calendar without losing a single tick.
     This is the right tool for "I fell off for a week or two".
     ====================================================================== */
  function reanchorCard() {
    var cur = S.currentDay();
    var firstOpen = S.firstIncompleteDay();
    var behind = S.slippage().length;

    var num = el("input", {
      class: "inp", type: "number", min: 1, max: 60, value: firstOpen,
      style: "max-width:88px"
    });
    var preview = el("div", { class: "small muted", style: "margin-top:8px" });

    function refresh() {
      var n = Math.min(60, Math.max(1, Number(num.value) || 1));
      var start = U.addDays(U.todayKey(), -(n - 1));
      U.clear(preview);
      U.append(preview, [
        "Day 1 becomes ", el("b", { text: U.prettyDate(start) }),
        ", Day 60 becomes ", el("b", { text: U.prettyDate(U.addDays(start, 59)) }),
        ". ", el("span", { style: "color:var(--good-text);font-weight:600", text: "No ticks are cleared." })
      ]);
    }
    num.addEventListener("input", refresh);
    refresh();

    return el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
      el("h3", { style: "font-size:15.5px", text: "Fell behind? Re-anchor the calendar" }),
      el("p", { class: "small dim", style: "margin-top:4px;max-width:74ch", html:
        "Missed a few days — or a few weeks? You don't have to erase anything. Re-anchoring slides the whole " +
        "schedule so the day you're actually on becomes <b>today</b>. Every tick, note, score and problem stays exactly as it is." }),
      behind ? el("p", { class: "small", style: "margin-top:8px", html:
        "Right now you're marked <b>" + U.plural(behind, "day") + " behind</b>, and your first unfinished day is <b>Day " + firstOpen + "</b>." }) : null,
      el("div", { class: "row", style: "margin-top:12px" }, [
        el("span", { class: "small", text: "Treat today as Day" }),
        num,
        el("button", {
          class: "btn btn-primary", text: "Re-anchor",
          onclick: function () {
            var n = Math.min(60, Math.max(1, Number(num.value) || 1));
            S.reanchor(n);
            U.toast("Today is now Day " + n, "good");
            Views.settings.rerender();
          }
        }),
        el("span", { class: "muted small", text: "or" }),
        el("button", {
          class: "btn", text: "Shift everything +7 days",
          onclick: function () {
            if (!S.startDate()) { U.toast("Set a start date first"); return; }
            S.shiftSchedule(7);
            U.toast("Schedule pushed back a week", "good");
            Views.settings.rerender();
          }
        })
      ]),
      preview,
      cur !== firstOpen ? el("p", { class: "tiny muted", style: "margin-top:6px", text: "Tip: setting it to " + firstOpen + " lines the plan up with where you genuinely are." }) : null
    ]);
  }

  /* ======================================================================
     Scoped restart — redo one week, one phase, or everything from a day on.
     ====================================================================== */
  function restartCard() {
    var kind = "week";
    var value = String(Math.min(9, Math.max(1, Math.ceil(S.currentDay() / 7))));

    var kindSel = el("select", { class: "inp", style: "max-width:210px", onchange: function (e) {
      kind = e.target.value;
      value = defaultValue(kind);
      rebuild();
    } }, [
      el("option", { value: "week", text: "One week" }),
      el("option", { value: "phase", text: "One phase" }),
      el("option", { value: "day", text: "A single day" }),
      el("option", { value: "from", text: "Everything from a day onward" }),
      el("option", { value: "all", text: "All 60 days" })
    ]);

    function defaultValue(k) {
      if (k === "week") return String(Math.min(9, Math.max(1, Math.ceil(S.currentDay() / 7))));
      if (k === "phase") return String((H.phases || [{ num: 1 }])[0].num);
      return String(S.currentDay());
    }

    var valueHost = el("span", {});
    var clearNotes = el("input", { type: "checkbox", class: "check" });
    var clearTime = el("input", { type: "checkbox", class: "check" });
    var alsoAnchor = el("input", { type: "checkbox", class: "check", checked: true });
    var preview = el("div", {
      class: "card", style: "margin-top:12px;background:var(--surface-2);padding:12px"
    });

    function valueControl() {
      if (kind === "all") return el("span", { class: "small muted", text: "Days 1–60" });
      if (kind === "week") {
        return el("select", { class: "inp", style: "max-width:180px", onchange: function (e) { value = e.target.value; rebuild(); } },
          (H.weeks || []).map(function (w) {
            return el("option", { value: String(w.week), selected: value === String(w.week), text: "Week " + w.week + " (days " + w.days + ")" });
          }));
      }
      if (kind === "phase") {
        return el("select", { class: "inp", style: "max-width:300px", onchange: function (e) { value = e.target.value; rebuild(); } },
          (H.phases || []).map(function (p) {
            return el("option", { value: String(p.num), selected: value === String(p.num), text: "Phase " + p.num + " — " + p.name });
          }));
      }
      return el("input", {
        class: "inp", type: "number", min: 1, max: 60, value: value, style: "max-width:88px",
        oninput: function (e) { value = e.target.value; rebuild(); }
      });
    }

    function rebuild() {
      U.clear(valueHost).appendChild(valueControl());
      var list = S.daysInScope(kind, value);
      var st = S.scopeStats(list);
      U.clear(preview);
      if (!list.length) {
        preview.appendChild(el("div", { class: "small muted", text: "Nothing selected." }));
        return;
      }
      U.append(preview, [
        el("div", { class: "blk-sublabel", style: "margin-bottom:6px", text: "This will clear" }),
        el("div", { class: "small" }, [
          el("b", { text: st.blocksDone + " of " + st.blocks + " ticked blocks" }),
          " and ",
          el("b", { text: st.problemsDone + " of " + st.problems + " ticked problems" }),
          " across ", el("b", { text: U.plural(st.days, "day") }),
          st.first !== null ? el("span", { class: "muted", text: "  (Day " + st.first + (st.last !== st.first ? "–" + st.last : "") + ")" }) : null
        ]),
        el("div", { class: "tiny muted", style: "margin-top:6px", text:
          "Kept: your Redo List, Weakness sheet, mistake log, readiness scores, mock scores, question-bank ticks and the final checklist." +
          (st.notes ? "  " + U.plural(st.notes, "day note") + " in range — tick the box below to clear those too." : "") })
      ]);
    }

    var body = el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
      el("h3", { style: "font-size:15.5px", text: "Restart a stretch of the plan" }),
      el("p", { class: "small dim", style: "margin-top:4px;max-width:74ch", text:
        "Want to genuinely redo Week 2 rather than pretend it happened? Pick a scope and clear it. Only that range's blocks and problems are cleared — nothing else." }),
      el("div", { class: "row", style: "margin-top:12px" }, [kindSel, valueHost]),
      el("div", { class: "row", style: "margin-top:10px;gap:16px" }, [
        el("label", { class: "row", style: "gap:7px;cursor:pointer;font-size:12.6px" }, [clearNotes, "also clear my notes for those days"]),
        el("label", { class: "row", style: "gap:7px;cursor:pointer;font-size:12.6px" }, [clearTime, "also clear logged timer hours"]),
        el("label", { class: "row", style: "gap:7px;cursor:pointer;font-size:12.6px" }, [alsoAnchor, "restart from today (re-anchor the calendar)"])
      ]),
      preview,
      el("div", { class: "row", style: "margin-top:12px" }, [
        el("button", {
          class: "btn btn-danger", text: "Clear this range",
          onclick: function () {
            var list = S.daysInScope(kind, value);
            if (!list.length) { U.toast("Nothing selected"); return; }
            var st = S.scopeStats(list);
            var label = kind === "all" ? "all 60 days"
              : kind === "week" ? "Week " + value
              : kind === "phase" ? "Phase " + value
              : kind === "day" ? "Day " + value
              : "Day " + value + " onward";
            if (!confirm("Restart " + label + "?\n\nClears " + st.blocksDone + " ticked blocks and " +
                         st.problemsDone + " ticked problems across " + st.days + " days.\n\nThis cannot be undone.")) return;
            S.resetDays(list, { clearNotes: clearNotes.checked, clearTime: clearTime.checked });
            if (alsoAnchor.checked && st.first !== null) S.reanchor(st.first);
            U.toast(label.charAt(0).toUpperCase() + label.slice(1) + " restarted", "good");
            Views.settings.rerender();
          }
        }),
        el("span", { class: "tiny muted", text: "Export a backup first if you might want it back." })
      ])
    ]);

    rebuild();
    return body;
  }

  /* ======================================================================
     Full fresh start — day 1 again, with control over what survives.
     ====================================================================== */
  function freshStartCard() {
    var keeps = [
      ["trackers", "Redo List, Weakness sheet & mistake log", true],
      ["notes", "My day, topic and question notes", true],
      ["scores", "Weekly readiness & mock scores", false],
      ["banks", "Question-bank ticks (929 items)", false],
      ["checklist", "Final placement checklist", false],
      ["mistakes", "The 100 mistakes I've internalised", true],
      ["mocks", "Completed mocks & OAs", false],
      ["topics", "Per-topic problem counts", false],
      ["time", "Logged timer hours", false]
    ];
    var boxes = {};

    var grid = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px;margin-top:12px" },
      keeps.map(function (k) {
        var cb = el("input", { type: "checkbox", class: "check", checked: k[2] });
        boxes[k[0]] = cb;
        return el("label", { class: "row", style: "gap:8px;cursor:pointer;font-size:12.8px" }, [cb, k[1]]);
      })
    );

    return el("div", { class: "card card-pad-lg", style: "margin-bottom:14px;border-color:var(--accent-line)" }, [
      el("h3", { style: "font-size:15.5px", text: "Start the whole 60 days over" }),
      el("p", { class: "small dim", style: "margin-top:4px;max-width:74ch", html:
        "Clean slate: all 240 blocks and 353 plan problems cleared, and <b>Day 1 becomes today</b>. " +
        "Tick what you'd like to carry forward — the hard-won stuff (your Redo List, your notes, the mistakes you've already learned) is kept by default, because none of that stops being true." }),
      grid,
      el("div", { class: "row", style: "margin-top:14px" }, [
        el("button", {
          class: "btn btn-danger", text: "Start over from Day 1 (today)",
          onclick: function () {
            var keep = {};
            Object.keys(boxes).forEach(function (k) { keep[k] = boxes[k].checked; });
            var p = S.progress();
            if (!confirm("Start the 60 days over?\n\nClears " + p.plan.done + " ticked blocks and sets Day 1 = today (" +
                         U.prettyDate(U.todayKey()) + ").\n\nThis cannot be undone.")) return;
            S.freshStart(keep);
            U.toast("Fresh start — Day 1 is today. Go.", "good");
            location.hash = "#/dashboard";
            App.render();
          }
        }),
        el("span", { class: "tiny muted", text: "Breaking a streak is normal. Restarting the plan is not failure — abandoning it is." })
      ])
    ]);
  }

  Views.settings = {
    title: "Settings",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.settings.render());
    },

    render: function () {
      var root = el("div", {});
      var st = S.state();
      var p = S.progress();

      root.appendChild(R.pageHead(
        "Settings & Backup",
        "Progress lives in this browser's local storage — nothing leaves your machine. " +
        "<b>Export a backup regularly</b>: clearing site data or switching browser will lose it otherwise."
      ));

      /* ---- schedule ---- */
      var dateInput = el("input", { type: "date", class: "inp", style: "max-width:180px", value: S.startDate() || "" });
      root.appendChild(el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
        el("h3", { style: "font-size:15.5px", text: "Schedule" }),
        el("p", { class: "small dim", style: "margin-top:4px", text: "Day 1's calendar date. Drives today's plan, the per-day dates and the slippage warning." }),
        el("div", { class: "row", style: "margin-top:12px" }, [
          dateInput,
          el("button", {
            class: "btn btn-primary", text: "Save",
            onclick: function () {
              S.startDate(dateInput.value);
              U.toast(dateInput.value ? "Day 1 = " + U.prettyDate(dateInput.value) : "Schedule cleared", "good");
              Views.settings.rerender();
            }
          }),
          S.startDate() ? el("span", { class: "small muted" }, [
            "Day 1 " + U.prettyDate(S.startDate()) + " → Day 60 " + U.prettyDate(S.scheduledDate(60)),
            el("br"),
            el("b", { text: "Today is day " + S.currentDay() + "." })
          ]) : el("span", { class: "small muted", text: "No schedule set — “today” falls back to your first unfinished day." })
        ])
      ]));

      /* ---- restart & reschedule ---- */
      root.appendChild(R.sectionHead("Restart & reschedule", "Broke your consistency? Nothing here is unrecoverable."));
      root.appendChild(reanchorCard());
      root.appendChild(restartCard());
      root.appendChild(freshStartCard());

      /* ---- appearance ---- */
      root.appendChild(R.sectionHead("Preferences"));
      root.appendChild(el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
        el("h3", { style: "font-size:15.5px", text: "Theme" }),
        el("p", { class: "small dim", style: "margin-top:4px", text:
          "Seven looks. Paper is the kindest for long reading sessions; Contrast is for tired eyes or a bright room. Chart colours stay colour-vision-safe in all of them." }),
        el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(196px,1fr));gap:8px;margin-top:14px" },
          App.THEMES.map(function (t) {
            return el("button", {
              class: "themebtn", style: "padding:11px 12px;align-items:flex-start",
              "aria-pressed": (st.theme || "auto") === t.id ? "true" : "false",
              onclick: function () { App.setTheme(t.id); }
            }, [
              App.themeSwatch(t),
              el("span", { style: "min-width:0" }, [
                el("div", { style: "font-weight:620", text: t.label }),
                el("div", { class: "tiny muted", text: t.note })
              ])
            ]);
          })
        ),
        el("h3", { style: "font-size:15.5px;margin-top:22px", text: "Text size" }),
        el("p", { class: "small dim", style: "margin-top:4px", text:
          "Body copy is also capped to a comfortable line length, so a wide screen doesn't give you 200-character lines." }),
        el("div", { class: "row", style: "margin-top:10px" }, [
          el("div", { class: "seg" }, App.SIZES.map(function (s) {
            return el("button", {
              text: s.label, "aria-pressed": (st.textSize || "normal") === s.id ? "true" : "false",
              onclick: function () { App.setTextSize(s.id); }
            });
          })),
          el("span", { class: "tiny muted", text: "Shortcuts: T = theme picker · M = momentum panel" })
        ])
      ]));

      /* ---- backup ---- */
      var fileInput = el("input", {
        type: "file", accept: ".json,application/json", style: "display:none",
        onchange: function (e) {
          var f = e.target.files && e.target.files[0];
          if (!f) return;
          var reader = new FileReader();
          reader.onload = function () {
            try {
              S.importJSON(String(reader.result));
              U.toast("Progress restored", "good");
              location.hash = "#/dashboard";
              App.render();
            } catch (err) {
              U.toast("Could not read that file: " + err.message, "bad");
            }
          };
          reader.readAsText(f);
          e.target.value = "";
        }
      });

      root.appendChild(el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
        el("h3", { style: "font-size:15.5px", text: "Backup & restore" }),
        el("p", { class: "small dim", style: "margin-top:4px", text: "A single JSON file with every tick, note, score and tracker entry." }),
        el("div", { class: "row", style: "margin-top:12px" }, [
          el("button", {
            class: "btn btn-primary", text: "⭳ Export backup",
            onclick: function () {
              U.download("handbook60-progress-" + U.todayKey() + ".json", S.exportJSON());
              U.toast("Backup downloaded", "good");
            }
          }),
          el("button", { class: "btn", text: "⭱ Import backup", onclick: function () { fileInput.click(); } }),
          fileInput,
          el("button", {
            class: "btn", text: "Export progress report (CSV)",
            onclick: function () {
              var rows = [["Day", "Title", "Phase", "Week", "Hours", "BlocksDone", "BlocksTotal", "Complete", "ProblemsDone", "ProblemsTotal", "Note"]];
              (H.days || []).forEach(function (d) {
                var pr = S.dayProgress(d);
                var pids = S.dayProblemIds(d);
                rows.push([
                  d.day, d.title, d.phaseName, d.week, d.hours,
                  pr.done, pr.total, pr.complete ? "yes" : "no",
                  S.countDone(pids), pids.length,
                  (S.note("day:" + d.day) || "").replace(/[\r\n]+/g, " ")
                ]);
              });
              var csv = rows.map(function (r) {
                return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(",");
              }).join("\n");
              U.download("handbook60-days-" + U.todayKey() + ".csv", csv, "text/csv");
            }
          })
        ])
      ]));

      /* ---- stats ---- */
      root.appendChild(el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
        el("h3", { style: "font-size:15.5px", text: "What's stored" }),
        el("div", { class: "grid g4", style: "margin-top:12px" }, [
          R.tile({ label: "Ticks", value: Object.keys(st.done).length }),
          R.tile({ label: "Notes", value: Object.keys(st.notes).length }),
          R.tile({ label: "Weekly scores", value: Object.keys(st.scores).length }),
          R.tile({ label: "Timer entries", value: (st.timeLog || []).length })
        ]),
        el("div", { class: "row", style: "margin-top:14px;padding-top:12px;border-top:1px solid var(--line)" }, [
          el("span", { class: "tiny muted" }, [
            "Build ", el("code", { text: H.buildId || "unknown" })
          ]),
          el("button", {
            class: "btn btn-sm btn-ghost", text: "Force-refresh the app",
            title: "Reloads bypassing the browser cache. Your progress is not touched.",
            onclick: function () { location.reload(true); }
          }),
          el("span", { class: "tiny muted", text: "Seeing an old version after an update? Hard reload with Ctrl+Shift+R." })
        ]),
        el("p", { class: "tiny muted", style: "margin-top:12px", text: "Checkable items in total: " + (p.plan.total + p.problems.total + p.bank.total + p.checklist.total + p.mistakes.total + p.mocks.total + p.oas.total) + " (240 blocks · " + p.problems.total + " plan problems · " + p.bank.total + " question-bank items · " + p.checklist.total + " checklist · 100 mistakes · 13 mocks · 8 OAs)." })
      ]));

      /* ---- rebuild note ---- */
      root.appendChild(el("div", { class: "card card-pad-lg", style: "margin-bottom:14px" }, [
        el("h3", { style: "font-size:15.5px", text: "Editing the handbook" }),
        el("p", { class: "small dim", style: "margin-top:4px" }, [
          "Every word in this app is parsed from ",
          el("code", { text: H.source || "the source markdown" }),
          ". Edit that file, then run ",
          el("code", { text: "python build_handbook.py" }),
          " to regenerate. Your progress is keyed by day and item index, so it survives edits that don't reorder things."
        ])
      ]));

      /* ---- danger ---- */
      root.appendChild(el("div", {
        class: "card card-pad-lg",
        style: "border-color:color-mix(in srgb,var(--critical) 35%,transparent)"
      }, [
        el("h3", { style: "font-size:15.5px", text: "Reset" }),
        el("p", { class: "small dim", style: "margin-top:4px", text: "Wipes every tick, note, score and tracker entry. Export a backup first." }),
        el("button", {
          class: "btn btn-danger", style: "margin-top:12px", text: "Erase all my progress",
          onclick: function () {
            if (!confirm("Erase ALL progress?\n\nThis cannot be undone. Export a backup first if you want to keep it.")) return;
            if (!confirm("Really erase everything?")) return;
            S.reset();
            U.toast("Everything reset");
            location.hash = "#/dashboard";
            App.render();
          }
        })
      ]));

      return root;
    }
  };
})();
