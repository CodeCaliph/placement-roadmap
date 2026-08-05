/* ==========================================================================
   views/trackers.js — the three companion sheets the handbook demands:
   Redo List (with +3/+10/+30 spaced repetition), Weakness sheet, Mistake log
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var tab = "redo";

  var CATS = [
    ["pattern", "Didn't know the pattern"],
    ["impl", "Knew it, implemented wrong"],
    ["misread", "Misread constraints/statement"],
    ["slow", "Too slow"],
    ["careless", "Careless bug"]
  ];

  /* ---- Redo List ------------------------------------------------------- */
  function redoPanel() {
    var wrap = el("div", {});
    var name = el("input", { class: "inp", placeholder: "Problem you could not solve unaided *" });
    var topic = el("input", { class: "inp", placeholder: "Topic / pattern" });
    var when = el("input", { class: "inp", type: "date", value: U.todayKey() });

    wrap.appendChild(el("div", { class: "card", style: "margin-bottom:16px" }, [
      el("div", { class: "blk-sublabel", text: "Add to the Redo List" }),
      el("div", { class: "grid", style: "grid-template-columns:2fr 1.3fr 1fr auto;gap:8px;align-items:end" }, [
        name, topic, when,
        el("button", {
          class: "btn btn-primary", text: "Add",
          onclick: function () {
            if (!name.value.trim()) { U.toast("Give it a name"); return; }
            S.redo.add({ name: name.value.trim(), topic: topic.value.trim(), failedOn: when.value || U.todayKey(), status: "active" });
            name.value = ""; topic.value = "";
            Views.trackers.rerender();
          }
        })
      ]),
      el("p", { class: "tiny muted", style: "margin-top:8px", text: "Re-solve on Day +3, +10 and +30 from a blank file. Solve it unaided at +10 and +30 → retire it. Fail twice → it goes to the Weakness sheet." })
    ]));

    /* due today */
    var due = S.redoDue();
    if (due.length) {
      wrap.appendChild(R.sectionHead("Due now", U.plural(due.length, "re-solve") + " waiting"));
      var dueBox = el("div", { class: "card" });
      due.slice(0, 40).forEach(function (d) {
        dueBox.appendChild(el("div", { class: "row", style: "padding:8px 0;border-bottom:1px dashed var(--line)" }, [
          el("span", {
            class: "tag " + (d.overdue > 3 ? "tag-t1" : d.overdue > 0 ? "tag-t2" : "tag-t3"),
            text: "+" + d.step + (d.overdue > 0 ? " · " + d.overdue + "d late" : " · today")
          }),
          el("span", { style: "flex:1;min-width:0;font-weight:550", text: d.item.name }),
          d.item.topic ? el("span", { class: "tiny muted", text: d.item.topic }) : null,
          el("button", {
            class: "btn btn-sm", text: "Re-solved ✓",
            onclick: function () {
              var patch = {};
              patch["done" + d.step] = new Date().toISOString();
              if (d.step === 30) patch.status = "retired";
              S.redo.update(d.item.id, patch);
              Views.trackers.rerender();
            }
          }),
          el("button", {
            class: "btn btn-sm btn-ghost btn-danger", text: "Failed again",
            onclick: function () {
              S.weakness.add({ name: d.item.name, note: "Failed the +" + d.step + " re-solve", status: "open" });
              S.redo.update(d.item.id, { failedOn: U.todayKey(), done3: null, done10: null, done30: null });
              U.toast("Moved to the Weakness sheet", "bad");
              Views.trackers.rerender();
            }
          })
        ]));
      });
      wrap.appendChild(dueBox);
    }

    /* full list */
    var items = S.redo.all();
    wrap.appendChild(R.sectionHead("Full Redo List", items.length ? U.plural(items.length, "item") : ""));
    if (!items.length) {
      wrap.appendChild(R.empty("Empty. Every problem you cannot solve unaided goes here — this single habit is worth ~40% of your final ability."));
      return wrap;
    }

    var rows = items.map(function (it) {
      var base = it.failedOn || (it.at || "").slice(0, 10);
      return [
        it.name,
        it.topic || "—",
        U.shortDate(base),
        [3, 10, 30].map(function (s) { return it["done" + s] ? "✔" : U.shortDate(U.addDays(base, s)); }).join("  ·  "),
        it.status === "retired" ? "retired" : "active"
      ];
    });
    var table = R.table({ head: ["Problem", "Topic", "Failed on", "+3 · +10 · +30", "Status"], rows: rows });
    wrap.appendChild(table);

    /* row actions live under the table to keep the table simple */
    var actions = el("div", { class: "card", style: "margin-top:10px" }, [
      el("div", { class: "blk-sublabel", text: "Manage" })
    ]);
    items.forEach(function (it) {
      actions.appendChild(el("div", { class: "row", style: "padding:5px 0" }, [
        el("span", { style: "flex:1;min-width:0", class: "small", text: it.name }),
        el("button", {
          class: "btn btn-sm btn-ghost", text: it.status === "retired" ? "Reactivate" : "Retire",
          onclick: function () {
            S.redo.update(it.id, { status: it.status === "retired" ? "active" : "retired" });
            Views.trackers.rerender();
          }
        }),
        el("button", {
          class: "btn btn-sm btn-ghost btn-danger", text: "Delete",
          onclick: function () { S.redo.remove(it.id); Views.trackers.rerender(); }
        })
      ]));
    });
    wrap.appendChild(actions);
    return wrap;
  }

  /* ---- Weakness sheet -------------------------------------------------- */
  function weaknessPanel() {
    var wrap = el("div", {});
    var name = el("input", { class: "inp", placeholder: "Problem failed twice, or topic scoring <3 in a mock *" });
    var note = el("input", { class: "inp", placeholder: "What exactly breaks?" });

    wrap.appendChild(el("div", { class: "card", style: "margin-bottom:16px" }, [
      el("div", { class: "blk-sublabel", text: "Add a weakness" }),
      el("div", { class: "grid", style: "grid-template-columns:1.4fr 2fr auto;gap:8px" }, [
        name, note,
        el("button", {
          class: "btn btn-primary", text: "Add",
          onclick: function () {
            if (!name.value.trim()) { U.toast("Give it a name"); return; }
            S.weakness.add({ name: name.value.trim(), note: note.value.trim(), status: "open" });
            name.value = ""; note.value = "";
            Views.trackers.rerender();
          }
        })
      ]),
      el("p", { class: "tiny muted", style: "margin-top:8px", text: "Day 48 is the dedicated Weak-Area Repair Day, and Day 56 evening is “everything still failing here”. Keep it current or those days are wasted." })
    ]));

    var items = S.weakness.all();
    var open = items.filter(function (w) { return w.status !== "fixed"; });
    wrap.appendChild(R.sectionHead("Weakness sheet", open.length ? U.plural(open.length, "open item") : "clear"));

    if (!items.length) {
      wrap.appendChild(R.empty("Nothing here yet — good. Anything you fail twice belongs on this sheet."));
      return wrap;
    }

    var box = el("div", { class: "card" });
    items.forEach(function (w) {
      var fixed = w.status === "fixed";
      box.appendChild(el("div", {
        class: "row", style: "padding:9px 0;border-bottom:1px dashed var(--line)" + (fixed ? ";opacity:.5" : "")
      }, [
        el("span", { class: "tag " + (fixed ? "tag-good" : "tag-t1"), text: fixed ? "fixed" : "open" }),
        el("div", { style: "flex:1;min-width:0" }, [
          el("div", { style: "font-weight:560" + (fixed ? ";text-decoration:line-through" : ""), text: w.name }),
          w.note ? el("div", { class: "tiny muted", text: w.note }) : null
        ]),
        el("span", { class: "tiny muted nowrap", text: U.shortDate((w.at || "").slice(0, 10)) }),
        el("button", {
          class: "btn btn-sm", text: fixed ? "Reopen" : "Mark fixed",
          onclick: function () { S.weakness.update(w.id, { status: fixed ? "open" : "fixed" }); Views.trackers.rerender(); }
        }),
        el("button", {
          class: "btn btn-sm btn-ghost btn-danger", text: "×",
          onclick: function () { S.weakness.remove(w.id); Views.trackers.rerender(); }
        })
      ]));
    });
    wrap.appendChild(box);
    return wrap;
  }

  /* ---- Mistake log ---------------------------------------------------- */
  function logPanel() {
    var wrap = el("div", {});
    var text = el("input", { class: "inp", placeholder: "One line: what went wrong *" });
    var cat = el("select", { class: "inp" }, CATS.map(function (c) {
      return el("option", { value: c[0], text: c[1] });
    }));

    wrap.appendChild(el("div", { class: "card", style: "margin-bottom:16px" }, [
      el("div", { class: "blk-sublabel", text: "Log a mistake" }),
      el("div", { class: "grid", style: "grid-template-columns:2fr 1.3fr auto;gap:8px" }, [
        text, cat,
        el("button", {
          class: "btn btn-primary", text: "Log",
          onclick: function () {
            if (!text.value.trim()) { U.toast("Describe it in one line"); return; }
            S.mistakeLog.add({ text: text.value.trim(), category: cat.value });
            text.value = "";
            Views.trackers.rerender();
          }
        })
      ]),
      el("p", { class: "tiny muted", style: "margin-top:8px", text: "Review the tally weekly. Whichever category dominates is the thing to fix — not “work harder”." })
    ]));

    var items = S.mistakeLog.all();
    if (items.length) {
      var tally = {};
      CATS.forEach(function (c) { tally[c[0]] = 0; });
      items.forEach(function (i) { tally[i.category] = (tally[i.category] || 0) + 1; });
      var top = CATS.slice().sort(function (a, b) { return tally[b[0]] - tally[a[0]]; })[0];

      wrap.appendChild(el("div", { class: "card", style: "margin-bottom:16px" }, [
        el("div", { class: "blk-sublabel", text: "Category tally — " + items.length + " logged" }),
        el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px" },
          CATS.map(function (c) {
            return R.meter({ done: tally[c[0]], total: items.length, label: c[1], size: "sm", valueText: String(tally[c[0]]), hideCount: true });
          })
        ),
        tally[top[0]] > 0 ? el("p", { class: "small", style: "margin-top:12px;color:var(--accent)", html: "Dominant category: <b>" + top[1] + "</b> — that is this week's specific fix." }) : null
      ]));
    }

    wrap.appendChild(R.sectionHead("Log", items.length ? U.plural(items.length, "entry", "entries") : ""));
    if (!items.length) {
      wrap.appendChild(R.empty("Nothing logged. One line per error, categorised — it turns vague frustration into a fixable pattern."));
      return wrap;
    }

    var box = el("div", { class: "card" });
    items.forEach(function (m) {
      var label = (CATS.filter(function (c) { return c[0] === m.category; })[0] || ["", m.category])[1];
      box.appendChild(el("div", { class: "row", style: "padding:8px 0;border-bottom:1px dashed var(--line)" }, [
        el("span", { class: "tiny muted nowrap tnum", style: "width:52px", text: U.shortDate((m.at || "").slice(0, 10)) }),
        el("span", { class: "tag", text: label }),
        el("span", { style: "flex:1;min-width:0", class: "small", text: m.text }),
        el("button", {
          class: "btn btn-sm btn-ghost btn-danger", text: "×",
          onclick: function () { S.mistakeLog.remove(m.id); Views.trackers.rerender(); }
        })
      ]));
    });
    wrap.appendChild(box);
    return wrap;
  }

  Views.trackers = {
    title: "Trackers",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.trackers.render());
    },

    render: function () {
      var root = el("div", {});
      var due = S.redoDue().length;
      var openW = S.weakness.all().filter(function (w) { return w.status !== "fixed"; }).length;

      root.appendChild(R.pageHead(
        "Trackers",
        "The three companion sheets from Part 10. The handbook is explicit that these are not optional: " +
        "<b>“You cannot fix what you don't measure.”</b>"
      ));

      var tabs = el("div", { class: "tabs" });
      [
        ["redo", "Redo List", due ? String(due) + " due" : null],
        ["weakness", "Weakness sheet", openW ? String(openW) : null],
        ["log", "Mistake log", String(S.mistakeLog.all().length)]
      ].forEach(function (t) {
        tabs.appendChild(el("button", {
          class: "tab", "aria-selected": tab === t[0] ? "true" : "false",
          onclick: function () { tab = t[0]; Views.trackers.rerender(); }
        }, [t[1], t[2] ? el("span", { class: "nav-count", text: t[2] }) : null]));
      });
      root.appendChild(tabs);

      root.appendChild(tab === "redo" ? redoPanel() : tab === "weakness" ? weaknessPanel() : logPanel());
      return root;
    }
  };
})();
