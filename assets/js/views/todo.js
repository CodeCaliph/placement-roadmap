/* ==========================================================================
   views/todo.js — a planner with five horizons: Day, Week, Month, Year and
   Someday. Every task belongs to exactly one horizon and one period of it:

     day      "YYYY-MM-DD"
     week     "YYYY-MM-DD" of that week's Monday
     month    "YYYY-MM"
     year     "YYYY"
     someday  "-"

   Keys sort as strings, so "unfinished from an earlier period" is a plain
   string comparison. Routines are recurring daily habits, ticked per date.
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el;

  var SCOPES = [
    { id: "day", label: "Day", icon: "◷" },
    { id: "week", label: "Week", icon: "▥" },
    { id: "month", label: "Month", icon: "▦" },
    { id: "year", label: "Year", icon: "◫" },
    { id: "someday", label: "Someday", icon: "∞" }
  ];

  var TAGS = [
    { id: "dsa", label: "DSA", c: "var(--s1)" },
    { id: "core", label: "Core CS", c: "var(--s7)" },
    { id: "dev", label: "Projects", c: "var(--s3)" },
    { id: "apply", label: "Applications", c: "var(--s2)" },
    { id: "mock", label: "Mocks", c: "var(--s4)" },
    { id: "revise", label: "Revision", c: "var(--s5)" },
    { id: "life", label: "Health & Life", c: "var(--s6)" },
    { id: "other", label: "Other", c: "var(--ink-3)" }
  ];
  var PRIOS = { 1: "High", 2: "Medium", 3: "Low" };
  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var ui = {
    scope: "day", anchor: null,   // anchor: a date inside the period being viewed
    tag: "", showDone: true, sort: "manual",
    open: {}, editing: null, manageRoutines: false,
    addTag: "", addPrio: 0
  };

  function tagById(id) {
    for (var i = 0; i < TAGS.length; i++) if (TAGS[i].id === id) return TAGS[i];
    return null;
  }

  /* ---- dates & periods --------------------------------------------------- */
  function today() { return U.todayKey(); }
  function dow(key) { var d = U.parseKey(key); return d ? (d.getDay() + 6) % 7 : 0; }   // Mon = 0
  function weekStart(key) { return U.addDays(key, -dow(key)); }

  function periodOf(scope, key) {
    if (scope === "day") return key;
    if (scope === "week") return weekStart(key);
    if (scope === "month") return key.slice(0, 7);
    if (scope === "year") return key.slice(0, 4);
    return "-";
  }

  function shiftAnchor(scope, key, n) {
    var d = U.parseKey(key);
    if (scope === "day") return U.addDays(key, n);
    if (scope === "week") return U.addDays(key, 7 * n);
    if (scope === "month") return U.todayKey(new Date(d.getFullYear(), d.getMonth() + n, 1));
    if (scope === "year") return U.todayKey(new Date(d.getFullYear() + n, 0, 1));
    return key;
  }

  /** The first date of a period — where "move to next period" lands a task. */
  function periodStart(scope, period) {
    if (scope === "month") return period + "-01";
    if (scope === "year") return period + "-01-01";
    return period;
  }

  function periodLabel(scope, period, long) {
    if (scope === "day") {
      var d = U.parseKey(period);
      return d.toLocaleDateString(undefined, long
        ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
        : { weekday: "short", day: "numeric", month: "short" });
    }
    if (scope === "week") {
      var end = U.addDays(period, 6);
      return U.shortDate(period) + " – " + U.shortDate(end) + (long ? ", " + end.slice(0, 4) : "");
    }
    if (scope === "month") return MONTHS[Number(period.slice(5, 7)) - 1] + " " + period.slice(0, 4);
    if (scope === "year") return period;
    return "Someday";
  }

  function relativeName(scope, period) {
    var cur = periodOf(scope, today());
    if (scope === "someday") return "Backlog";
    var names = {
      day: ["Yesterday", "Today", "Tomorrow"],
      week: ["Last week", "This week", "Next week"],
      month: ["Last month", "This month", "Next month"],
      year: ["Last year", "This year", "Next year"]
    }[scope];
    if (period === cur) return names[1];
    if (period === periodOf(scope, shiftAnchor(scope, today(), -1))) return names[0];
    if (period === periodOf(scope, shiftAnchor(scope, today(), 1))) return names[2];
    return null;
  }

  /* ---- store ------------------------------------------------------------- */
  var T = {
    all: function () { return S.state().todos || (S.state().todos = []); },
    byId: function (id) { return T.all().filter(function (t) { return t.id === id; })[0] || null; },
    list: function (scope, period) {
      return T.all().filter(function (t) { return t.scope === scope && t.period === period; });
    },
    add: function (text, scope, period, extra) {
      var list = T.all();
      var maxOrder = 0;
      list.forEach(function (t) { if (t.scope === scope && t.period === period) maxOrder = Math.max(maxOrder, t.order || 0); });
      var item = {
        id: U.uid(), text: text, scope: scope, period: period,
        done: false, doneAt: null, prio: 0, tag: "", notes: "", subs: [],
        order: maxOrder + 1, at: new Date().toISOString()
      };
      if (extra) Object.keys(extra).forEach(function (k) { item[k] = extra[k]; });
      list.push(item);
      S.emit("todos");
      return item;
    },
    update: function (id, patch) {
      var t = T.byId(id);
      if (!t) return;
      Object.keys(patch).forEach(function (k) { t[k] = patch[k]; });
      S.emit("todos");
    },
    toggle: function (id) {
      var t = T.byId(id);
      if (!t) return;
      T.update(id, { done: !t.done, doneAt: t.done ? null : new Date().toISOString() });
    },
    remove: function (id) {
      S.state().todos = T.all().filter(function (t) { return t.id !== id; });
      S.emit("todos");
    },
    move: function (id, scope, period) {
      var maxOrder = 0;
      T.list(scope, period).forEach(function (t) { maxOrder = Math.max(maxOrder, t.order || 0); });
      T.update(id, { scope: scope, period: period, order: maxOrder + 1 });
    },
    /** Unfinished tasks from earlier periods of the same horizon. */
    carried: function (scope, period) {
      if (scope === "someday") return [];
      return T.all().filter(function (t) { return t.scope === scope && !t.done && t.period < period; });
    },
    sorted: function (list) {
      return list.slice().sort(function (a, b) {
        if (ui.sort === "priority") {
          var pa = a.prio || 9, pb = b.prio || 9;
          if (pa !== pb) return pa - pb;
        }
        return (a.order || 0) - (b.order || 0);
      });
    },
    stats: function (list) {
      var done = list.filter(function (t) { return t.done; }).length;
      return { done: done, total: list.length, pct: U.pct(done, list.length) };
    }
  };

  /* ---- routines ------------------------------------------------------------ */
  var RT = {
    all: function () { return S.state().routines || (S.state().routines = []); },
    on: function (r, key) { return (r.days || [0, 1, 2, 3, 4, 5, 6]).indexOf(dow(key)) >= 0; },
    /* a routine never counts against days before it existed */
    forDay: function (key) { return RT.all().filter(function (r) { return RT.on(r, key) && (r.at || "").slice(0, 10) <= key; }); },
    isDone: function (r, key) { var m = (S.state().routineDone || {})[key]; return !!(m && m[r.id]); },
    toggle: function (r, key) {
      var all = S.state().routineDone || (S.state().routineDone = {});
      var m = all[key] || (all[key] = {});
      if (m[r.id]) delete m[r.id]; else m[r.id] = new Date().toISOString();
      if (!Object.keys(m).length) delete all[key];
      S.emit("routine");
    },
    add: function (text, days) {
      RT.all().push({ id: U.uid(), text: text, days: days, at: new Date().toISOString() });
      S.emit("routine");
    },
    remove: function (id) {
      S.state().routines = RT.all().filter(function (r) { return r.id !== id; });
      S.emit("routine");
    },
    /** Consecutive scheduled days completed, counting back from today (today may still be open). */
    streak: function (r) {
      var key = today(), n = 0, guard = 0;
      if (RT.on(r, key) && !RT.isDone(r, key)) key = U.addDays(key, -1);
      var created = (r.at || "").slice(0, 10);
      while (guard++ < 800) {
        if (created && key < created) break;
        if (RT.on(r, key)) { if (RT.isDone(r, key)) n++; else break; }
        key = U.addDays(key, -1);
      }
      return n;
    },
    dayStats: function (key) {
      var list = RT.forDay(key);
      var done = list.filter(function (r) { return RT.isDone(r, key); }).length;
      return { done: done, total: list.length };
    }
  };

  /* ---- shared pieces -------------------------------------------------------- */
  function rer() { Views.todo.rerender(); }

  function tagPill(id) {
    var t = tagById(id);
    if (!t) return null;
    return el("span", { class: "td-tag", style: "--tc:" + t.c, text: t.label });
  }

  function parseQuick(raw) {
    var tag = ui.addTag, prio = ui.addPrio;
    var s = raw.replace(/(^|\s)#([\w&-]+)/g, function (m, sp, w) {
      w = w.toLowerCase();
      var hit = TAGS.filter(function (t) { return t.id === w || t.label.toLowerCase().indexOf(w) === 0; })[0];
      if (!hit) return m;
      tag = hit.id;
      return sp;
    });
    s = s.replace(/(^|\s)!(1|2|3|h|m|l|high|med|medium|low)(?=\s|$)/i, function (m, sp, p) {
      prio = { "1": 1, h: 1, high: 1, "2": 2, m: 2, med: 2, medium: 2, "3": 3, l: 3, low: 3 }[p.toLowerCase()];
      return sp;
    });
    return { text: s.replace(/\s+/g, " ").trim(), tag: tag, prio: prio };
  }

  /** The add-a-task bar: text + optional tag and priority, with inline #tag !prio. */
  function addBar(scope, period, opts) {
    opts = opts || {};
    var inputId = "td-add-" + scope + "-" + period;
    var inp = el("input", {
      class: "inp td-add-inp", id: inputId, type: "text", autocomplete: "off",
      placeholder: opts.placeholder || "Add a task…  (#dsa  !high)",
      "aria-label": "New task",
      onkeydown: function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } }
    });
    function submit() {
      var p = parseQuick(inp.value);
      if (!p.text) return;
      T.add(p.text, scope, period, { tag: p.tag || "", prio: p.prio || 0 });
      rer();
      var again = document.getElementById(inputId);
      if (again) again.focus();
    }
    if (opts.compact) {
      return el("div", { class: "td-add td-add-compact" }, [inp, el("button", { class: "btn btn-sm", text: "+", title: "Add", onclick: submit })]);
    }
    var tagSel = el("select", {
      class: "inp", "aria-label": "Tag", onchange: function () { ui.addTag = tagSel.value; }
    }, [el("option", { value: "", text: "No tag" })].concat(TAGS.map(function (t) {
      return el("option", { value: t.id, text: t.label, selected: ui.addTag === t.id });
    })));
    var prioSel = el("select", {
      class: "inp", "aria-label": "Priority", onchange: function () { ui.addPrio = Number(prioSel.value); }
    }, [["0", "No priority"], ["1", "High"], ["2", "Medium"], ["3", "Low"]].map(function (o) {
      return el("option", { value: o[0], text: o[1], selected: String(ui.addPrio) === o[0] });
    }));
    return el("div", { class: "td-add" }, [
      inp,
      el("div", { class: "td-add-opts" }, [tagSel, prioSel, el("button", { class: "btn btn-primary", text: "Add", onclick: submit })])
    ]);
  }

  /* ---- drag & drop (desktop); every move also has a button for touch ------- */
  var dragId = null;

  function dropZone(node, scope, period) {
    node.addEventListener("dragover", function (e) {
      if (!dragId) return;
      e.preventDefault();
      node.classList.add("td-over");
    });
    node.addEventListener("dragleave", function (e) {
      if (!node.contains(e.relatedTarget)) node.classList.remove("td-over");
    });
    node.addEventListener("drop", function (e) {
      if (!dragId) return;
      e.preventDefault();
      node.classList.remove("td-over");
      var id = dragId; dragId = null;
      var t = T.byId(id);
      if (!t) return;
      // dropped onto a row: slot in before it; onto empty space: append
      var rowNode = e.target.closest && e.target.closest(".td-row");
      var before = rowNode && rowNode.dataset.id !== id ? T.byId(rowNode.dataset.id) : null;
      if (before && before.scope === scope && before.period === period) {
        var list = T.sorted(T.list(scope, period)).filter(function (x) { return x.id !== id; });
        var idx = list.indexOf(before);
        list.splice(idx, 0, t);
        t.scope = scope; t.period = period;
        list.forEach(function (x, i) { x.order = i + 1; });
        S.emit("todos");
      } else if (t.scope !== scope || t.period !== period) {
        T.move(id, scope, period);
      }
      rer();
    });
  }

  /* ---- a task row ------------------------------------------------------------ */
  function nextPeriodFor(t) {
    if (t.scope === "someday") return { scope: "day", period: today(), label: "→ Today" };
    var base = t.period < periodOf(t.scope, today()) ? periodOf(t.scope, today()) : shiftAnchor(t.scope, periodStart(t.scope, t.period), 1);
    var label = { day: "→ Tomorrow", week: "→ Next week", month: "→ Next month", year: "→ Next year" }[t.scope];
    if (t.period < periodOf(t.scope, today())) label = { day: "→ Today", week: "→ This week", month: "→ This month", year: "→ This year" }[t.scope];
    return { scope: t.scope, period: periodOf(t.scope, base), label: label };
  }

  function row(t, opts) {
    opts = opts || {};
    var open = !!ui.open[t.id];
    var subsDone = (t.subs || []).filter(function (s) { return s.done; }).length;

    var check = el("input", {
      type: "checkbox", class: "check", checked: t.done, "aria-label": "Done: " + t.text,
      onchange: function () { T.toggle(t.id); rer(); }
    });

    var textNode;
    if (ui.editing === t.id) {
      textNode = el("input", {
        class: "inp td-edit", type: "text", value: t.text, "aria-label": "Edit task",
        onkeydown: function (e) {
          if (e.key === "Enter") { e.preventDefault(); save(); }
          if (e.key === "Escape") { e.stopPropagation(); saved = true; ui.editing = null; rer(); }
        },
        onblur: function () { save(); }
      });
      var saved = false;
      var save = function () {
        if (saved) return;
        saved = true;
        var v = textNode.value.trim();
        ui.editing = null;
        if (v && v !== t.text) T.update(t.id, { text: v });
        rer();
      };
      setTimeout(function () { textNode.focus(); textNode.select(); }, 0);
    } else {
      textNode = el("span", {
        class: "td-text", text: t.text, title: "Double-click to edit",
        ondblclick: function () { ui.editing = t.id; rer(); }
      });
    }

    var meta = el("div", { class: "td-meta" }, [
      tagPill(t.tag),
      opts.showPeriod ? el("span", { class: "td-from", text: "from " + (relativeName(t.scope, t.period) || periodLabel(t.scope, t.period)) }) : null,
      (t.subs || []).length ? el("span", { class: "td-sub-count tnum", text: "☑ " + subsDone + "/" + t.subs.length }) : null,
      t.notes ? el("span", { class: "td-has-note", title: "Has notes", text: "✎" }) : null
    ]);

    var prioBtn = el("button", {
      class: "td-prio", "data-p": String(t.prio || 0), "aria-label": "Priority: " + (PRIOS[t.prio] || "none"),
      title: "Priority: " + (PRIOS[t.prio] || "none") + " — click to change",
      onclick: function () { T.update(t.id, { prio: ((t.prio || 0) + 1) % 4 }); rer(); }
    }, [el("span", { text: "⚑" })]);

    var node = el("div", {
      class: "td-row" + (t.done ? " is-done" : "") + (open ? " is-open" : "") + (opts.compact ? " is-compact" : ""),
      // an open row holds text fields; keeping it draggable would hijack text selection
      draggable: open || ui.editing === t.id ? null : "true", dataset: { id: t.id, p: String(t.prio || 0) },
      ondragstart: function (e) {
        if (ui.editing) { e.preventDefault(); return; }
        dragId = t.id;
        try { e.dataTransfer.setData("text/plain", t.text); e.dataTransfer.effectAllowed = "move"; } catch (x) { /* ignore */ }
        node.classList.add("is-drag");
      },
      ondragend: function () { dragId = null; node.classList.remove("is-drag"); }
    }, [
      el("div", { class: "td-line" }, [
        opts.compact ? null : el("span", { class: "td-grip", "aria-hidden": "true", title: "Drag to reorder or move", text: "⋮⋮" }),
        check,
        el("div", { class: "td-body" }, [textNode, meta.childNodes.length ? meta : null]),
        el("div", { class: "td-acts" }, [
          opts.compact ? null : prioBtn,
          el("button", {
            class: "td-more", title: open ? "Close details" : "Details, subtasks, move…", "aria-expanded": open ? "true" : "false",
            text: open ? "▴" : "⋯",
            onclick: function () { if (open) delete ui.open[t.id]; else ui.open[t.id] = true; rer(); }
          })
        ])
      ]),
      open ? details(t) : null
    ]);
    return node;
  }

  function details(t) {
    var np = nextPeriodFor(t);

    var notes = el("textarea", {
      class: "inp", rows: 2, placeholder: "Notes, links, what 'done' means…",
      oninput: U.debounce(function () { t.notes = notes.value; S.save(); }, 300)
    });
    notes.value = t.notes || "";

    var subInp = el("input", {
      class: "inp", type: "text", placeholder: "Add a subtask and press Enter",
      onkeydown: function (e) {
        if (e.key !== "Enter" || !subInp.value.trim()) return;
        e.preventDefault();
        t.subs = (t.subs || []).concat([{ t: subInp.value.trim(), done: false }]);
        S.emit("todos");
        rer();
        var again = U.$('.td-row[data-id="' + t.id + '"] .td-subadd');
        if (again) again.focus();
      }
    });
    subInp.classList.add("td-subadd");

    var subs = (t.subs || []).map(function (s, i) {
      return el("div", { class: "td-subrow" + (s.done ? " is-done" : "") }, [
        el("input", {
          type: "checkbox", class: "check", checked: s.done, "aria-label": s.t,
          onchange: function () { s.done = !s.done; S.emit("todos"); rer(); }
        }),
        el("span", { class: "td-subtext", text: s.t }),
        el("button", {
          class: "td-x", title: "Remove subtask", text: "✕",
          onclick: function () { t.subs.splice(i, 1); S.emit("todos"); rer(); }
        })
      ]);
    });

    var scopeSel = el("select", {
      class: "inp", "aria-label": "Horizon",
      onchange: function () {
        var sc = scopeSel.value;
        T.move(t.id, sc, periodOf(sc, sc === "someday" ? today() : (t.scope === "someday" ? today() : periodStart(t.scope, t.period))));
        rer();
      }
    }, SCOPES.map(function (s) { return el("option", { value: s.id, text: s.label, selected: s.id === t.scope }); }));

    var tagSel = el("select", {
      class: "inp", "aria-label": "Tag",
      onchange: function () { T.update(t.id, { tag: tagSel.value }); rer(); }
    }, [el("option", { value: "", text: "No tag" })].concat(TAGS.map(function (x) {
      return el("option", { value: x.id, text: x.label, selected: t.tag === x.id });
    })));

    var dateInp = t.scope === "day" ? el("input", {
      class: "inp", type: "date", value: t.period, "aria-label": "Date",
      onchange: function () { if (dateInp.value) { T.move(t.id, "day", dateInp.value); rer(); } }
    }) : null;

    return el("div", { class: "td-details" }, [
      el("div", { class: "td-subs" }, subs.concat([subInp])),
      notes,
      el("div", { class: "td-detail-row" }, [
        el("label", { class: "td-field" }, [el("span", { text: "Horizon" }), scopeSel]),
        dateInp ? el("label", { class: "td-field" }, [el("span", { text: "Date" }), dateInp]) : null,
        el("label", { class: "td-field" }, [el("span", { text: "Tag" }), tagSel])
      ]),
      el("div", { class: "row" }, [
        !t.done ? el("button", { class: "btn btn-sm", text: np.label, onclick: function () { T.move(t.id, np.scope, np.period); delete ui.open[t.id]; rer(); } }) : null,
        t.scope !== "someday" && !t.done ? el("button", { class: "btn btn-sm btn-ghost", text: "→ Someday", onclick: function () { T.move(t.id, "someday", "-"); delete ui.open[t.id]; rer(); } }) : null,
        el("button", { class: "btn btn-sm btn-ghost", text: "✎ Rename", onclick: function () { ui.editing = t.id; rer(); } }),
        el("button", {
          class: "btn btn-sm btn-ghost", text: "⧉ Duplicate",
          onclick: function () {
            T.add(t.text, t.scope, t.period, { tag: t.tag, prio: t.prio, notes: t.notes, subs: (t.subs || []).map(function (s) { return { t: s.t, done: false }; }) });
            rer();
          }
        }),
        el("span", { style: "flex:1" }),
        el("button", {
          class: "btn btn-sm btn-danger", text: "Delete",
          onclick: function () { if (confirm("Delete “" + t.text + "”?")) { T.remove(t.id); rer(); } }
        })
      ])
    ]);
  }

  /** A task list for one period: open tasks (drop zone) then done ones. */
  function taskList(scope, period, opts) {
    opts = opts || {};
    var list = T.list(scope, period).filter(function (t) { return !ui.tag || t.tag === ui.tag; });
    var openL = T.sorted(list.filter(function (t) { return !t.done; }));
    var doneL = list.filter(function (t) { return t.done; }).sort(function (a, b) { return (b.doneAt || "") < (a.doneAt || "") ? -1 : 1; });

    var zone = el("div", { class: "td-list" }, openL.map(function (t) { return row(t, opts); }));
    if (!openL.length) {
      zone.appendChild(el("div", { class: "td-empty", text: opts.emptyText || (doneL.length ? "All done here. ✓" : "Nothing yet.") }));
    }
    dropZone(zone, scope, period);

    var out = [zone];
    if (doneL.length && ui.showDone) {
      out.push(el("details", { class: "td-done-wrap", open: opts.openDone ? true : null }, [
        el("summary", { class: "small muted", text: "Completed (" + doneL.length + ")" }),
        el("div", { class: "td-list" }, doneL.map(function (t) { return row(t, opts); }))
      ]));
    }
    return el("div", {}, out);
  }

  function carriedBlock(scope, period) {
    var list = T.carried(scope, period).filter(function (t) { return !ui.tag || t.tag === ui.tag; });
    if (!list.length) return null;
    return el("div", { class: "card td-carry" }, [
      el("div", { class: "row", style: "margin-bottom:8px" }, [
        el("b", { class: "small", text: "↺ Carried over — " + U.plural(list.length, "unfinished task") }),
        el("span", { style: "flex:1" }),
        el("button", {
          class: "btn btn-sm", text: "Move all to " + (relativeName(scope, period) || periodLabel(scope, period)).toLowerCase(),
          onclick: function () { list.forEach(function (t) { T.move(t.id, scope, period); }); rer(); }
        })
      ]),
      el("div", { class: "td-list" }, T.sorted(list).map(function (t) { return row(t, { showPeriod: true }); }))
    ]);
  }

  /* ---- period navigator ------------------------------------------------------- */
  function navigator(scope, period) {
    var rel = relativeName(scope, period);
    var isCur = period === periodOf(scope, today());
    return el("div", { class: "td-nav" }, [
      el("button", { class: "iconbtn", title: "Previous", "aria-label": "Previous", text: "‹", onclick: function () { ui.anchor = shiftAnchor(scope, ui.anchor, -1); rer(); } }),
      el("div", { class: "td-nav-label" }, [
        el("div", { class: "td-nav-main", text: periodLabel(scope, period, true) }),
        rel ? el("div", { class: "td-nav-rel" + (isCur ? " is-cur" : ""), text: rel }) : null
      ]),
      el("button", { class: "iconbtn", title: "Next", "aria-label": "Next", text: "›", onclick: function () { ui.anchor = shiftAnchor(scope, ui.anchor, 1); rer(); } }),
      !isCur ? el("button", { class: "btn btn-sm", text: "Today", onclick: function () { ui.anchor = today(); rer(); } }) : null,
      scope === "day" ? el("input", {
        class: "inp td-date", type: "date", value: period, "aria-label": "Jump to date",
        onchange: function (e) { if (e.target.value) { ui.anchor = e.target.value; rer(); } }
      }) : null
    ]);
  }

  /* ---- routines --------------------------------------------------------------- */
  function routinesCard(key) {
    var list = RT.forDay(key);
    var isFuture = key > today();
    var body = [];

    if (ui.manageRoutines) {
      var txt = el("input", { class: "inp", type: "text", placeholder: "e.g. Solve 3 DSA problems", "aria-label": "Routine" });
      var picked = [0, 1, 2, 3, 4, 5, 6];
      var dayBtns = DOW.map(function (d, i) {
        var b = el("button", {
          class: "td-dow", "aria-pressed": "true", text: d.charAt(0), title: d,
          onclick: function () {
            var at = picked.indexOf(i);
            if (at >= 0) picked.splice(at, 1); else picked.push(i);
            b.setAttribute("aria-pressed", picked.indexOf(i) >= 0 ? "true" : "false");
          }
        });
        return b;
      });
      var addIt = function () {
        if (!txt.value.trim() || !picked.length) return;
        RT.add(txt.value.trim(), picked.slice().sort());
        rer();
      };
      txt.addEventListener("keydown", function (e) { if (e.key === "Enter") addIt(); });
      body.push(el("div", { class: "td-rt-form" }, [
        txt,
        el("div", { class: "row", style: "gap:4px" }, dayBtns.concat([el("span", { style: "flex:1" }), el("button", { class: "btn btn-sm btn-primary", text: "Add routine", onclick: addIt })]))
      ]));
      RT.all().forEach(function (r) {
        body.push(el("div", { class: "td-rt-edit" }, [
          el("span", { class: "td-text", text: r.text }),
          el("span", { class: "tiny muted", text: (r.days || []).length === 7 ? "Every day" : (r.days || []).map(function (i) { return DOW[i]; }).join(" ") }),
          el("button", { class: "td-x", title: "Delete routine", text: "✕", onclick: function () { if (confirm("Delete routine “" + r.text + "”? Its history goes too.")) { RT.remove(r.id); rer(); } } })
        ]));
      });
    } else if (!list.length) {
      body.push(el("div", { class: "td-empty" }, [
        RT.all().length ? "No routines scheduled for this day." : "Routines are things you do every day — solve 3 problems, revise 5 core questions, one mock answer out loud. ",
        !RT.all().length ? el("button", { class: "btn btn-sm", style: "margin-top:8px", text: "＋ Add starter routines", onclick: starterRoutines }) : null
      ]));
    } else {
      list.forEach(function (r) {
        var done = RT.isDone(r, key), st = RT.streak(r);
        body.push(el("label", { class: "td-rt" + (done ? " is-done" : "") + (isFuture ? " is-future" : "") }, [
          el("input", {
            type: "checkbox", class: "check", checked: done, disabled: isFuture ? true : null,
            onchange: function () { RT.toggle(r, key); rer(); }
          }),
          el("span", { class: "td-text", text: r.text }),
          st ? el("span", { class: "td-streak tnum", title: st + "-day streak", text: "🔥 " + st }) : null
        ]));
      });
    }

    var s = RT.dayStats(key);
    return el("div", { class: "card" }, [
      el("div", { class: "td-card-head" }, [
        el("h3", { class: "td-card-title", text: "Routines" }),
        s.total && !ui.manageRoutines ? el("span", { class: "small muted tnum", text: s.done + "/" + s.total }) : null,
        el("span", { style: "flex:1" }),
        el("button", { class: "btn btn-sm btn-ghost", text: ui.manageRoutines ? "Done" : "Manage", onclick: function () { ui.manageRoutines = !ui.manageRoutines; rer(); } })
      ]),
      s.total && !ui.manageRoutines ? el("div", { style: "margin-bottom:8px" }, [R.meter({ done: s.done, total: s.total, showValue: false, size: "sm" })]) : null,
      el("div", { class: "td-rt-list" }, body)
    ]);
  }

  function starterRoutines() {
    RT.add("Solve 3 DSA problems (timed)", [0, 1, 2, 3, 4, 5, 6]);
    RT.add("Revise 5 core-subject questions out loud", [0, 1, 2, 3, 4, 5, 6]);
    RT.add("Re-solve one problem from the Redo list", [0, 1, 2, 3, 4]);
    RT.add("30 min of project / dev work", [0, 1, 2, 3, 4]);
    RT.add("Apply to 2 openings / follow up on one", [0, 2, 4]);
    RT.add("Exercise or a walk", [0, 1, 2, 3, 4, 5, 6]);
    rer();
  }

  /* ---- context mini-lists (the bigger horizons, shown beside smaller ones) ---- */
  function miniGoals(scope, period, title) {
    var list = T.sorted(T.list(scope, period));
    var s = T.stats(list);
    return el("div", { class: "card" }, [
      el("div", { class: "td-card-head" }, [
        el("h3", { class: "td-card-title", text: title }),
        el("span", { class: "small muted tnum", text: s.total ? s.done + "/" + s.total : "" }),
        el("span", { style: "flex:1" }),
        el("button", { class: "btn btn-sm btn-ghost", text: "Open →", onclick: function () { ui.scope = scope; ui.anchor = periodStart(scope, period); rer(); } })
      ]),
      s.total ? el("div", { style: "margin-bottom:6px" }, [R.meter({ done: s.done, total: s.total, showValue: false, size: "sm" })]) : null,
      el("div", { class: "td-list" }, list.filter(function (t) { return !t.done; }).map(function (t) { return row(t, { compact: true }); })
        .concat(list.length && !list.some(function (t) { return !t.done; }) ? [el("div", { class: "td-empty", text: "All done. ✓" })] : [])),
      addBar(scope, period, { compact: true, placeholder: "Add a " + scope + " goal…" })
    ]);
  }

  /* ---- views per horizon -------------------------------------------------------- */
  function dayView(key) {
    var main = el("div", {}, [
      carriedBlock("day", key),
      el("div", { class: "card" }, [
        el("div", { class: "td-card-head" }, [
          el("h3", { class: "td-card-title", text: "Tasks" }),
          el("span", { style: "flex:1" }),
          sortToggle()
        ]),
        addBar("day", key),
        taskList("day", key, { openDone: false })
      ])
    ]);
    var side = el("div", { class: "td-side" }, [
      routinesCard(key),
      miniGoals("week", weekStart(key), "This week's goals"),
      miniGoals("month", key.slice(0, 7), MONTHS[Number(key.slice(5, 7)) - 1] + " goals")
    ]);
    return el("div", { class: "grid g-side td-layout" }, [main, side]);
  }

  function weekView(start) {
    var root = el("div", {});
    var cur = today();

    root.appendChild(el("div", { class: "grid g-side td-layout" }, [
      el("div", {}, [
        carriedBlock("week", start),
        el("div", { class: "card" }, [
          el("div", { class: "td-card-head" }, [el("h3", { class: "td-card-title", text: "Week goals" }), el("span", { style: "flex:1" }), sortToggle()]),
          addBar("week", start, { placeholder: "What must be true by Sunday?  (#core !high)" }),
          taskList("week", start)
        ])
      ]),
      el("div", { class: "td-side" }, [
        weekSummary(start),
        miniGoals("month", start.slice(0, 7), MONTHS[Number(start.slice(5, 7)) - 1] + " goals")
      ])
    ]));

    root.appendChild(R.sectionHead("Day by day", "drag tasks between days"));
    var board = el("div", { class: "td-board" });
    for (var i = 0; i < 7; i++) {
      (function (key) {
        var list = T.list("day", key).filter(function (t) { return !ui.tag || t.tag === ui.tag; });
        var s = T.stats(list), rs = RT.dayStats(key);
        var col = el("div", { class: "td-col" + (key === cur ? " is-today" : "") + (key < cur ? " is-past" : "") }, [
          el("button", {
            class: "td-col-head", title: "Open this day",
            onclick: function () { ui.scope = "day"; ui.anchor = key; rer(); }
          }, [
            el("span", { class: "td-col-dow", text: DOW[i] }),
            el("span", { class: "td-col-date", text: String(Number(key.slice(8, 10))) }),
            el("span", { class: "td-col-count tnum", text: s.total ? s.done + "/" + s.total : "" })
          ]),
          s.total ? R.meter({ done: s.done, total: s.total, showValue: false, size: "sm" }) : null,
          rs.total ? el("div", { class: "tiny muted", style: "margin-top:4px", text: "Routines " + rs.done + "/" + rs.total }) : null
        ]);
        var zone = el("div", { class: "td-list td-col-list" }, T.sorted(list).map(function (t) { return row(t, { compact: true }); }));
        dropZone(zone, "day", key);
        col.appendChild(zone);
        col.appendChild(addBar("day", key, { compact: true, placeholder: "Add…" }));
        board.appendChild(col);
      })(U.addDays(start, i));
    }
    root.appendChild(board);
    return root;
  }

  function weekSummary(start) {
    var dayTasks = [], rDone = 0, rTotal = 0;
    for (var i = 0; i < 7; i++) {
      var k = U.addDays(start, i);
      dayTasks = dayTasks.concat(T.list("day", k));
      if (k <= today()) { var r = RT.dayStats(k); rDone += r.done; rTotal += r.total; }
    }
    var g = T.stats(T.list("week", start)), d = T.stats(dayTasks);
    return el("div", { class: "card" }, [
      el("h3", { class: "td-card-title", style: "margin-bottom:10px", text: "Week at a glance" }),
      el("div", { style: "display:grid;gap:10px" }, [
        R.meter({ done: g.done, total: g.total, label: "Week goals", size: "sm" }),
        R.meter({ done: d.done, total: d.total, label: "Daily tasks", size: "sm" }),
        rTotal ? R.meter({ done: rDone, total: rTotal, label: "Routines so far", size: "sm" }) : null
      ])
    ]);
  }

  function monthView(month) {
    var root = el("div", {});
    root.appendChild(el("div", { class: "grid g-side td-layout" }, [
      el("div", {}, [
        carriedBlock("month", month),
        el("div", { class: "card" }, [
          el("div", { class: "td-card-head" }, [el("h3", { class: "td-card-title", text: "Month goals" }), el("span", { style: "flex:1" }), sortToggle()]),
          addBar("month", month, { placeholder: "A goal for the month…  (#dsa !high)" }),
          taskList("month", month)
        ])
      ]),
      el("div", { class: "td-side" }, [
        monthSummary(month),
        miniGoals("year", month.slice(0, 4), month.slice(0, 4) + " goals")
      ])
    ]));

    root.appendChild(R.sectionHead("Calendar", "click a day to plan it"));
    var first = month + "-01";
    var gridStart = weekStart(first);
    var d0 = U.parseKey(first);
    var daysIn = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate();
    var cells = Math.ceil((dow(first) + daysIn) / 7) * 7;
    var cur = today();

    var cal = el("div", { class: "td-cal" }, DOW.map(function (d) { return el("div", { class: "td-cal-dow", text: d }); }));
    for (var i = 0; i < cells; i++) {
      (function (key) {
        var inMonth = key.slice(0, 7) === month;
        var list = T.sorted(T.list("day", key).filter(function (t) { return !ui.tag || t.tag === ui.tag; }));
        var s = T.stats(list), rs = RT.dayStats(key);
        var cell = el("button", {
          class: "td-cal-cell" + (inMonth ? "" : " is-out") + (key === cur ? " is-today" : "") +
            (s.total && s.done === s.total ? " is-clear" : ""),
          title: periodLabel("day", key, true),
          onclick: function () { ui.scope = "day"; ui.anchor = key; rer(); }
        }, [
          el("div", { class: "td-cal-top" }, [
            el("span", { class: "td-cal-n", text: String(Number(key.slice(8, 10))) }),
            s.total ? el("span", { class: "td-cal-count tnum", text: s.done + "/" + s.total }) : null
          ]),
          el("div", { class: "td-cal-items" }, list.slice(0, 3).map(function (t) {
            var tg = tagById(t.tag);
            return el("div", { class: "td-cal-item" + (t.done ? " is-done" : ""), style: tg ? "--tc:" + tg.c : null, text: t.text });
          }).concat(list.length > 3 ? [el("div", { class: "td-cal-more", text: "+" + (list.length - 3) + " more" })] : [])),
          rs.total && key <= cur ? el("div", { class: "td-cal-rt", style: "--p:" + U.pct(rs.done, rs.total) + "%", title: "Routines " + rs.done + "/" + rs.total }) : null
        ]);
        dropZone(cell, "day", key);
        cal.appendChild(cell);
      })(U.addDays(gridStart, i));
    }
    root.appendChild(el("div", { class: "td-cal-wrap" }, [cal]));
    return root;
  }

  function monthSummary(month) {
    var dayTasks = T.all().filter(function (t) { return t.scope === "day" && t.period.slice(0, 7) === month; });
    var weekGoals = T.all().filter(function (t) { return t.scope === "week" && (t.period.slice(0, 7) === month || U.addDays(t.period, 6).slice(0, 7) === month); });
    var g = T.stats(T.list("month", month)), d = T.stats(dayTasks), w = T.stats(weekGoals);
    var activeDays = {};
    dayTasks.forEach(function (t) { if (t.done) activeDays[t.period] = 1; });
    return el("div", { class: "card" }, [
      el("h3", { class: "td-card-title", style: "margin-bottom:10px", text: "Month at a glance" }),
      el("div", { style: "display:grid;gap:10px" }, [
        R.meter({ done: g.done, total: g.total, label: "Month goals", size: "sm" }),
        R.meter({ done: w.done, total: w.total, label: "Week goals", size: "sm" }),
        R.meter({ done: d.done, total: d.total, label: "Daily tasks", size: "sm" }),
        el("div", { class: "small muted", text: U.plural(Object.keys(activeDays).length, "day") + " with at least one task done" })
      ])
    ]);
  }

  function yearView(year) {
    var root = el("div", {});
    root.appendChild(el("div", { class: "grid g-side td-layout" }, [
      el("div", {}, [
        carriedBlock("year", year),
        el("div", { class: "card" }, [
          el("div", { class: "td-card-head" }, [el("h3", { class: "td-card-title", text: year + " goals" }), el("span", { style: "flex:1" }), sortToggle()]),
          addBar("year", year, { placeholder: "A big goal for the year…  (e.g. Land an SDE offer)" }),
          taskList("year", year)
        ])
      ]),
      el("div", { class: "td-side" }, [
        el("div", { class: "card small dim" }, [
          el("b", { text: "Break it down. " }),
          "A year goal is only real once it has month goals under it, month goals once they have week goals, " +
          "and week goals once they are on specific days. Plan top-down, execute bottom-up."
        ])
      ])
    ]));

    root.appendChild(R.sectionHead("Months", "click to open"));
    var curMonth = today().slice(0, 7);
    root.appendChild(el("div", { class: "td-months" }, MONTHS.map(function (name, i) {
      var m = year + "-" + ("0" + (i + 1)).slice(-2);
      var goals = T.list("month", m), s = T.stats(goals);
      var dayTasks = T.all().filter(function (t) { return t.scope === "day" && t.period.slice(0, 7) === m; });
      var ds = T.stats(dayTasks);
      return el("button", {
        class: "td-month card" + (m === curMonth ? " is-cur" : "") + (m < curMonth ? " is-past" : ""),
        onclick: function () { ui.scope = "month"; ui.anchor = m + "-01"; rer(); }
      }, [
        el("div", { class: "td-month-name", text: name }),
        el("div", { class: "tiny muted tnum", text: (s.total ? s.done + "/" + s.total + " goals" : "No goals") + (ds.total ? " · " + ds.done + "/" + ds.total + " tasks" : "") }),
        s.total ? R.meter({ done: s.done, total: s.total, showValue: false, size: "sm" }) : null,
        el("div", { class: "td-month-goals" }, goals.slice(0, 3).map(function (t) {
          return el("div", { class: "td-month-goal" + (t.done ? " is-done" : ""), text: (t.done ? "✓ " : "· ") + t.text });
        }))
      ]);
    })));
    return root;
  }

  function somedayView() {
    return el("div", { class: "grid g-side td-layout" }, [
      el("div", { class: "card" }, [
        el("div", { class: "td-card-head" }, [el("h3", { class: "td-card-title", text: "Backlog" }), el("span", { style: "flex:1" }), sortToggle()]),
        addBar("someday", "-", { placeholder: "Ideas, maybe-laters, things to not forget…" }),
        taskList("someday", "-", { emptyText: "Park anything here that doesn't have a date yet." })
      ]),
      el("div", { class: "td-side" }, [
        el("div", { class: "card small dim" }, [
          el("b", { text: "Someday is a parking lot, not a to-do list. " }),
          "Review it once a week, pull one or two items into this week with ", el("b", { text: "→ Today" }),
          " or the Horizon picker, and delete what no longer matters."
        ])
      ])
    ]);
  }

  function sortToggle() {
    return el("div", { class: "seg" }, [["manual", "My order"], ["priority", "Priority"]].map(function (o) {
      return el("button", { text: o[1], "aria-pressed": ui.sort === o[0] ? "true" : "false", onclick: function () { ui.sort = o[0]; rer(); } });
    }));
  }

  /* ---- headline tiles ---------------------------------------------------------- */
  function headline() {
    var k = today();
    var d = T.stats(T.list("day", k));
    var ws = weekStart(k), wk = [];
    for (var i = 0; i < 7; i++) wk = wk.concat(T.list("day", U.addDays(ws, i)));
    wk = wk.concat(T.list("week", ws));
    var w = T.stats(wk);
    var m = T.stats(T.list("month", k.slice(0, 7)));
    var r = RT.dayStats(k);
    var overdue = T.all().filter(function (t) { return !t.done && t.scope === "day" && t.period < k; }).length;

    // last 14 days: share of day tasks + routines completed — a quick consistency read
    var bars = [];
    for (var j = 13; j >= 0; j--) {
      var key = U.addDays(k, -j);
      var ts = T.stats(T.list("day", key)), rs = RT.dayStats(key);
      var tot = ts.total + rs.total, dn = ts.done + rs.done;
      bars.push(el("i", {
        class: "td-spark-bar" + (key === k ? " is-today" : ""),
        style: "height:" + (tot ? Math.max(8, U.pct(dn, tot)) : 4) + "%;" + (tot ? "" : "opacity:.35"),
        title: U.shortDate(key) + ": " + dn + "/" + tot + " done"
      }));
    }

    return el("div", { class: "grid g4 td-tiles" }, [
      R.tile({ label: "Today", value: d.done, unit: "/ " + d.total, foot: overdue ? "<span class='down'>" + overdue + " carried over</span>" : (d.total && d.done === d.total ? "<span class='up'>All clear</span>" : "tasks done"), meter: d.total ? { done: d.done, total: d.total, showValue: false, size: "sm" } : null }),
      R.tile({ label: "This week", value: w.done, unit: "/ " + w.total, foot: "goals + daily tasks", meter: w.total ? { done: w.done, total: w.total, showValue: false, size: "sm" } : null }),
      R.tile({ label: "This month", value: m.done, unit: "/ " + m.total, foot: "month goals", meter: m.total ? { done: m.done, total: m.total, showValue: false, size: "sm" } : null }),
      el("div", { class: "tile" }, [
        el("div", { class: "tile-label", text: "Last 14 days" }),
        el("div", { class: "td-spark", "aria-label": "Completion over the last 14 days" }, bars),
        el("div", { class: "tile-foot", text: r.total ? "Routines today " + r.done + "/" + r.total : "tasks + routines done per day" })
      ])
    ]);
  }

  /* ---- the view ----------------------------------------------------------------- */
  Views.todo = {
    title: "To-Do Planner",

    route: function (param) {
      var p = (param || "").split("/");
      if (p[0] && SCOPES.some(function (s) { return s.id === p[0]; })) ui.scope = p[0];
      if (p[1] && U.parseKey(p[1])) ui.anchor = p[1];
    },

    rerender: function () {
      var host = U.$("#view-root");
      if (!host) return;
      var y = window.scrollY;
      U.clear(host).appendChild(Views.todo.render());
      window.scrollTo(0, y);
    },

    /** Open tasks for today (plus carried-over day tasks) — the sidebar badge. */
    openToday: function () {
      var k = today();
      return T.all().filter(function (t) { return !t.done && t.scope === "day" && t.period <= k; }).length;
    },

    render: function () {
      if (!ui.anchor) ui.anchor = today();
      var scope = ui.scope, period = periodOf(scope, ui.anchor);
      var root = el("div", { class: "td" });

      root.appendChild(R.pageHead(
        "To-Do Planner",
        "Plan on five horizons — <b>year → month → week → day</b>, plus a someday backlog. Unfinished tasks carry " +
        "forward instead of vanishing, routines repeat on the days you choose, and every task can hold notes and subtasks. " +
        "Type <code>#dsa</code> or <code>!high</code> while adding to tag and prioritise.",
        null
      ));
      root.appendChild(headline());

      /* horizon tabs + filters */
      root.appendChild(el("div", { class: "td-toolbar" }, [
        el("div", { class: "seg td-scopes", role: "tablist" }, SCOPES.map(function (s) {
          var n = s.id === "someday" ? T.list("someday", "-").filter(function (t) { return !t.done; }).length : null;
          return el("button", {
            role: "tab", "aria-pressed": scope === s.id ? "true" : "false", "aria-selected": scope === s.id ? "true" : "false",
            onclick: function () { ui.scope = s.id; rer(); }
          }, [el("span", { class: "td-scope-ico", text: s.icon }), " " + s.label, n ? el("span", { class: "nav-count tnum", text: String(n) }) : null]);
        })),
        el("span", { style: "flex:1" }),
        el("select", {
          class: "inp", style: "width:auto", "aria-label": "Filter by tag",
          onchange: function (e) { ui.tag = e.target.value; rer(); }
        }, [el("option", { value: "", text: "All tags" })].concat(TAGS.map(function (t) {
          return el("option", { value: t.id, text: t.label, selected: ui.tag === t.id });
        }))),
        el("button", {
          class: "btn btn-sm btn-ghost", text: ui.showDone ? "Hide completed" : "Show completed",
          onclick: function () { ui.showDone = !ui.showDone; rer(); }
        })
      ]));

      if (scope !== "someday") root.appendChild(navigator(scope, period));

      if (scope === "day") root.appendChild(dayView(period));
      else if (scope === "week") root.appendChild(weekView(period));
      else if (scope === "month") root.appendChild(monthView(period));
      else if (scope === "year") root.appendChild(yearView(period));
      else root.appendChild(somedayView());

      return root;
    }
  };
})();
