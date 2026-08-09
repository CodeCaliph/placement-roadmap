/* ==========================================================================
   store.js — all persistence + derived progress. Global namespace: window.S

   Storage: a single localStorage key holding one JSON document.
   Everything checkable in the app is one entry in `done` keyed by a stable id:

     b:<blockId>              a daily block          (240)
     p:<blockId>:<i>          a problem inside it    (353)
     q:<bankId>:<t>:<i>       a question-bank item   (929)
     c:<groupId>:<i>          a final-checklist item  (49)
     m:<n>                    one of the 100 mistakes (100)
     mk:<n>                   a mock interview         (13)
     oa:<day>                 a mock OA                 (8)
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "handbook60.v1";
  var H = window.HANDBOOK || {};
  var S = { data: H };

  /* ---- schema ---------------------------------------------------------- */
  function fresh() {
    return {
      v: 1,
      createdAt: new Date().toISOString(),
      startDate: null,
      theme: "auto",
      textSize: "normal",
      lastNudge: null,
      done: {},
      notes: {},
      scores: {},          // week -> { dims: [10], total, savedAt }
      mockScores: {},      // mock n -> { rubric: [8], notes }
      timeLog: [],         // { id, day, slot, seconds, at }
      redo: [],            // { id, name, topic, failedOn, status }
      weakness: [],        // { id, name, note, status }
      mistakeLog: [],      // { id, at, text, category }
      topicSolved: {},     // dsaMaster topic n -> count
      collapsed: {},
      lastView: "dashboard"
    };
  }

  var state = fresh();
  var listeners = [];
  var writeTimer = null;

  /* ---- load / save ----------------------------------------------------- */
  S.load = function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var base = fresh();
        Object.keys(base).forEach(function (k) {
          if (parsed[k] !== undefined && parsed[k] !== null) base[k] = parsed[k];
        });
        state = base;
      }
    } catch (e) {
      console.warn("could not read saved progress:", e);
    }
    return state;
  };

  S.save = function () {
    clearTimeout(writeTimer);
    writeTimer = setTimeout(function () {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        U.toast("Could not save — storage may be full", "bad");
      }
    }, 120);
  };

  S.state = function () { return state; };

  S.onChange = function (fn) { listeners.push(fn); };
  S.emit = function (reason) {
    S.save();
    listeners.forEach(function (fn) { try { fn(reason); } catch (e) { console.error(e); } });
  };

  S.replaceAll = function (obj) {
    var base = fresh();
    Object.keys(base).forEach(function (k) {
      if (obj[k] !== undefined && obj[k] !== null) base[k] = obj[k];
    });
    state = base;
    S.emit("import");
  };

  S.reset = function () {
    state = fresh();
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    S.emit("reset");
  };

  /* ---- the done-set ---------------------------------------------------- */
  S.isDone = function (id) { return !!state.done[id]; };
  S.doneAt = function (id) { return state.done[id] || null; };

  S.setDone = function (id, on) {
    if (on) state.done[id] = new Date().toISOString();
    else delete state.done[id];
  };

  S.toggle = function (id) {
    var next = !S.isDone(id);
    S.setDone(id, next);
    S.emit("toggle");
    return next;
  };

  S.setMany = function (ids, on) {
    ids.forEach(function (id) { S.setDone(id, on); });
    S.emit("toggle-many");
  };

  S.countDone = function (ids) {
    var n = 0;
    for (var i = 0; i < ids.length; i++) if (state.done[ids[i]]) n++;
    return n;
  };

  /* ---- notes ----------------------------------------------------------- */
  S.note = function (key, value) {
    if (value === undefined) return state.notes[key] || "";
    if (value) state.notes[key] = value; else delete state.notes[key];
    S.save();
    return value;
  };

  /* ---- ids ------------------------------------------------------------- */
  S.ids = {
    block: function (b) { return "b:" + b.id; },
    problem: function (b, i) { return "p:" + b.id + ":" + i; },
    bankItem: function (bank, t, i) { return "q:" + bank.id + ":" + t + ":" + i; },
    checkItem: function (g, i) { return "c:" + g.id + ":" + i; },
    mistake: function (n) { return "m:" + n; },
    mock: function (n) { return "mk:" + n; },
    oa: function (day) { return "oa:" + day; }
  };

  /* ---- day helpers ----------------------------------------------------- */
  S.dayById = function (n) {
    var days = H.days || [];
    for (var i = 0; i < days.length; i++) if (days[i].day === Number(n)) return days[i];
    return null;
  };

  S.dayBlockIds = function (day) {
    return (day.blocks || []).map(S.ids.block);
  };

  S.dayProblemIds = function (day) {
    var out = [];
    (day.blocks || []).forEach(function (b) {
      (b.problems || []).forEach(function (_, i) { out.push(S.ids.problem(b, i)); });
    });
    return out;
  };

  /** Day progress counts blocks (the unit of work), not problems. */
  S.dayProgress = function (day) {
    var ids = S.dayBlockIds(day);
    var done = S.countDone(ids);
    return { done: done, total: ids.length, pct: U.pct(done, ids.length), complete: ids.length > 0 && done === ids.length };
  };

  S.blockHoursDone = function () {
    var h = 0;
    (H.days || []).forEach(function (d) {
      (d.blocks || []).forEach(function (b) {
        if (S.isDone(S.ids.block(b))) h += (b.hours || 0);
      });
    });
    return h;
  };

  /* ---- schedule -------------------------------------------------------- */
  S.startDate = function (v) {
    if (v === undefined) return state.startDate;
    state.startDate = v || null;
    S.emit("start-date");
    return v;
  };

  /** Which plan-day is "today"? Prefers the real calendar, else first unfinished. */
  S.currentDay = function () {
    if (state.startDate) {
      var diff = U.dayDiff(state.startDate, U.todayKey());
      if (diff !== null) return Math.min(60, Math.max(1, diff + 1));
    }
    var days = H.days || [];
    for (var i = 0; i < days.length; i++) {
      if (!S.dayProgress(days[i]).complete) return days[i].day;
    }
    return 60;
  };

  S.scheduledDate = function (dayNum) {
    if (!state.startDate) return null;
    return U.addDays(state.startDate, dayNum - 1);
  };

  /** Days behind schedule: elapsed plan-days that are not complete. */
  S.slippage = function () {
    var cur = S.currentDay();
    var behind = [];
    (H.days || []).forEach(function (d) {
      if (d.day < cur && !S.dayProgress(d).complete) behind.push(d.day);
    });
    return behind;
  };

  S.firstIncompleteDay = function () {
    var days = H.days || [];
    for (var i = 0; i < days.length; i++) {
      if (!S.dayProgress(days[i]).complete) return days[i].day;
    }
    return 60;
  };

  /* ---- restart & reschedule -------------------------------------------
     Breaking a streak should not mean losing work. Two separate tools:
       reanchor()  — move the calendar, keep every tick
       resetDays() — clear a chosen range of days
     ---------------------------------------------------------------------- */

  /** The days covered by a scope: all | phase | week | from | day */
  S.daysInScope = function (kind, value) {
    var days = H.days || [];
    switch (kind) {
      case "all":
        return days.slice();
      case "week":
        return days.filter(function (d) { return d.week === Number(value); });
      case "phase":
        var ph = (H.phases || []).filter(function (p) {
          return p.id === value || p.num === Number(value);
        })[0];
        return ph ? days.filter(function (d) { return d.day >= ph.from && d.day <= ph.to; }) : [];
      case "day":
        return days.filter(function (d) { return d.day === Number(value); });
      case "from":
        return days.filter(function (d) { return d.day >= Number(value); });
      default:
        return [];
    }
  };

  /** What a reset would touch — used to show an honest preview first. */
  S.scopeStats = function (list) {
    var blocks = [], probs = [], notes = 0, secs = 0, inScope = {};
    list.forEach(function (d) {
      inScope[d.day] = 1;
      blocks = blocks.concat(S.dayBlockIds(d));
      probs = probs.concat(S.dayProblemIds(d));
      if (state.notes["day:" + d.day]) notes++;
    });
    (state.timeLog || []).forEach(function (l) { if (inScope[l.day]) secs += (l.seconds || 0); });
    return {
      days: list.length,
      first: list.length ? list[0].day : null,
      last: list.length ? list[list.length - 1].day : null,
      blocks: blocks.length, blocksDone: S.countDone(blocks),
      problems: probs.length, problemsDone: S.countDone(probs),
      notes: notes, seconds: secs
    };
  };

  S.resetDays = function (list, opts) {
    opts = opts || {};
    var inScope = {}, cleared = 0;
    list.forEach(function (d) {
      inScope[d.day] = 1;
      S.dayBlockIds(d).concat(S.dayProblemIds(d)).forEach(function (id) {
        if (state.done[id]) cleared++;
        delete state.done[id];
      });
      if (opts.clearNotes) delete state.notes["day:" + d.day];
    });
    if (opts.clearTime) {
      state.timeLog = (state.timeLog || []).filter(function (l) { return !inScope[l.day]; });
    }
    S.emit("reset-scope");
    return cleared;
  };

  /** Make `dayNum` fall on today. Every tick is kept. */
  S.reanchor = function (dayNum) {
    state.startDate = U.addDays(U.todayKey(), -(Number(dayNum) - 1));
    S.emit("reanchor");
    return state.startDate;
  };

  S.shiftSchedule = function (deltaDays) {
    if (!state.startDate) return null;
    state.startDate = U.addDays(state.startDate, Number(deltaDays));
    S.emit("reanchor");
    return state.startDate;
  };

  /** Clean slate for the 60 days, with explicit control over what survives. */
  S.freshStart = function (keep) {
    keep = keep || {};
    var sets = idSets();
    var kill = [].concat(sets.blocks, sets.problems);
    if (!keep.banks) kill = kill.concat(sets.bank);
    if (!keep.checklist) kill = kill.concat(sets.checklist);
    if (!keep.mistakes) kill = kill.concat(sets.mistakes);
    if (!keep.mocks) kill = kill.concat(sets.mocks, sets.oas);
    kill.forEach(function (id) { delete state.done[id]; });

    if (!keep.notes) state.notes = {};
    if (!keep.scores) { state.scores = {}; state.mockScores = {}; }
    if (!keep.trackers) { state.redo = []; state.weakness = []; state.mistakeLog = []; }
    if (!keep.topics) state.topicSolved = {};
    if (!keep.time) state.timeLog = [];

    state.startDate = U.todayKey();
    S.emit("fresh-start");
  };

  /* ---- streak ---------------------------------------------------------- */
  S.activeDayKeys = function () {
    var set = {};
    Object.keys(state.done).forEach(function (id) {
      var iso = state.done[id];
      if (iso && iso.length >= 10) set[iso.slice(0, 10)] = true;
    });
    (state.timeLog || []).forEach(function (l) {
      if (l.at && l.at.length >= 10) set[l.at.slice(0, 10)] = true;
    });
    return set;
  };

  S.streak = function () {
    var active = S.activeDayKeys();
    var today = U.todayKey();
    var cursor = active[today] ? today : U.addDays(today, -1);
    if (!active[cursor]) return { current: 0, best: S.bestStreak(active), today: false };
    var n = 0;
    while (active[cursor]) { n++; cursor = U.addDays(cursor, -1); }
    return { current: n, best: Math.max(n, S.bestStreak(active)), today: !!active[today] };
  };

  S.bestStreak = function (active) {
    active = active || S.activeDayKeys();
    var keys = Object.keys(active).sort();
    var best = 0, run = 0, prev = null;
    keys.forEach(function (k) {
      run = (prev && U.dayDiff(prev, k) === 1) ? run + 1 : 1;
      if (run > best) best = run;
      prev = k;
    });
    return best;
  };

  /* ---- aggregate progress --------------------------------------------- */
  function allBlockIds() {
    var out = [];
    (H.days || []).forEach(function (d) { out = out.concat(S.dayBlockIds(d)); });
    return out;
  }
  function allProblemIds() {
    var out = [];
    (H.days || []).forEach(function (d) { out = out.concat(S.dayProblemIds(d)); });
    return out;
  }
  function allBankIds() {
    var out = [];
    (H.banks || []).forEach(function (bank) {
      bank.tiers.forEach(function (t, ti) {
        t.items.forEach(function (_, ii) { out.push(S.ids.bankItem(bank, ti, ii)); });
      });
    });
    return out;
  }
  function allCheckIds() {
    var out = [];
    (H.checklist || []).forEach(function (g) {
      g.items.forEach(function (_, i) { out.push(S.ids.checkItem(g, i)); });
    });
    return out;
  }

  var CACHE = null;
  function idSets() {
    if (!CACHE) {
      CACHE = {
        blocks: allBlockIds(),
        problems: allProblemIds(),
        bank: allBankIds(),
        checklist: allCheckIds(),
        mistakes: (H.mistakes || []).map(function (m) { return S.ids.mistake(m.n); }),
        mocks: ((H.mocks || {}).schedule || []).map(function (m) { return S.ids.mock(m.n); }),
        oas: ((H.mocks || {}).oaDays || []).map(S.ids.oa)
      };
    }
    return CACHE;
  }
  S.idSets = idSets;

  function bucket(ids) {
    var done = S.countDone(ids);
    return { done: done, total: ids.length, pct: U.pct(done, ids.length) };
  }

  S.progress = function () {
    var sets = idSets();
    var p = {
      plan: bucket(sets.blocks),
      problems: bucket(sets.problems),
      bank: bucket(sets.bank),
      checklist: bucket(sets.checklist),
      mistakes: bucket(sets.mistakes),
      mocks: bucket(sets.mocks),
      oas: bucket(sets.oas)
    };
    p.daysComplete = (H.days || []).filter(function (d) { return S.dayProgress(d).complete; }).length;
    p.hours = S.blockHoursDone();
    p.loggedSeconds = (state.timeLog || []).reduce(function (a, l) { return a + (l.seconds || 0); }, 0);
    // headline = the plan itself, which is what the 60 days actually are
    p.overall = p.plan.pct;
    return p;
  };

  S.phaseProgress = function (phase) {
    var ids = [];
    (H.days || []).forEach(function (d) {
      if (d.day >= phase.from && d.day <= phase.to) ids = ids.concat(S.dayBlockIds(d));
    });
    return bucket(ids);
  };

  S.weekProgress = function (week) {
    var ids = [];
    (H.days || []).forEach(function (d) {
      if (d.week === week) ids = ids.concat(S.dayBlockIds(d));
    });
    return bucket(ids);
  };

  S.bankProgress = function (bank) {
    var ids = [];
    bank.tiers.forEach(function (t, ti) {
      t.items.forEach(function (_, ii) { ids.push(S.ids.bankItem(bank, ti, ii)); });
    });
    return bucket(ids);
  };

  S.tierProgress = function (bank, ti) {
    var ids = bank.tiers[ti].items.map(function (_, ii) { return S.ids.bankItem(bank, ti, ii); });
    return bucket(ids);
  };

  S.checkGroupProgress = function (g) {
    return bucket(g.items.map(function (_, i) { return S.ids.checkItem(g, i); }));
  };

  /* ---- readiness score ------------------------------------------------- */
  S.scoreFor = function (week) {
    return state.scores[String(week)] || null;
  };

  S.saveScore = function (week, dims) {
    var total = dims.reduce(function (a, b) { return a + (Number(b) || 0); }, 0);
    state.scores[String(week)] = { dims: dims.slice(), total: total, savedAt: new Date().toISOString() };
    S.emit("score");
    return total;
  };

  S.deleteScore = function (week) {
    delete state.scores[String(week)];
    S.emit("score");
  };

  S.latestScore = function () {
    var weeks = Object.keys(state.scores).map(Number).sort(function (a, b) { return a - b; });
    if (!weeks.length) return null;
    var w = weeks[weeks.length - 1];
    return { week: w, score: state.scores[String(w)] };
  };

  S.band = function (total) {
    var bands = (H.readiness || {}).bands || [];
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].from && total <= bands[i].to) return bands[i];
    }
    return null;
  };

  S.targetForWeek = function (week) {
    var t = ((H.readiness || {}).trajectory || []);
    for (var i = 0; i < t.length; i++) if (t[i].week === week) return t[i].target;
    return null;
  };

  /* ---- mock rubric ----------------------------------------------------- */
  S.mockScore = function (n, data) {
    if (data === undefined) return state.mockScores[String(n)] || null;
    state.mockScores[String(n)] = data;
    S.emit("mock-score");
    return data;
  };

  /* ---- time log -------------------------------------------------------- */
  S.logTime = function (entry) {
    entry.at = new Date().toISOString();
    state.timeLog.push(entry);
    if (state.timeLog.length > 4000) state.timeLog = state.timeLog.slice(-4000);
    S.emit("time");
  };

  S.secondsToday = function () {
    var today = U.todayKey();
    return (state.timeLog || []).reduce(function (a, l) {
      return a + ((l.at || "").slice(0, 10) === today ? (l.seconds || 0) : 0);
    }, 0);
  };

  /* ---- trackers (redo / weakness / mistake log) ------------------------ */
  function listOps(name) {
    return {
      all: function () { return state[name] || []; },
      add: function (item) {
        item.id = item.id || U.uid();
        item.at = item.at || new Date().toISOString();
        state[name].unshift(item);
        S.emit(name);
        return item;
      },
      update: function (id, patch) {
        (state[name] || []).forEach(function (it) {
          if (it.id === id) Object.keys(patch).forEach(function (k) { it[k] = patch[k]; });
        });
        S.emit(name);
      },
      remove: function (id) {
        state[name] = (state[name] || []).filter(function (it) { return it.id !== id; });
        S.emit(name);
      }
    };
  }
  S.redo = listOps("redo");
  S.weakness = listOps("weakness");
  S.mistakeLog = listOps("mistakeLog");

  /** Spaced repetition: +3 / +10 / +30 from the failure date.
   *
   *  The steps are a sequence, not a set — only the earliest step a problem
   *  still owes is surfaced, so an old failure shows one row, not three.
   */
  S.redoDue = function () {
    var today = U.todayKey();
    var out = [];
    (state.redo || []).forEach(function (it) {
      if (it.status === "retired") return;
      var base = it.failedOn || (it.at || "").slice(0, 10);
      var steps = [3, 10, 30];
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        if (it["done" + step]) continue;          // already re-solved at this step
        var due = U.addDays(base, step);
        if (!due) break;
        var diff = U.dayDiff(due, today);
        if (diff !== null && diff >= 0) out.push({ item: it, step: step, due: due, overdue: diff });
        break;                                     // never queue a later step first
      }
    });
    return out.sort(function (a, b) { return b.overdue - a.overdue; });
  };

  /* ---- topic solved counters ------------------------------------------ */
  S.topicSolved = function (n, v) {
    if (v === undefined) return Number(state.topicSolved[String(n)] || 0);
    var q = 0;
    (H.dsaMaster || []).forEach(function (t) { if (t.n === Number(n)) q = t.q; });
    v = Math.max(0, Math.min(v, Math.max(q, 999)));
    if (v) state.topicSolved[String(n)] = v; else delete state.topicSolved[String(n)];
    S.emit("topic");
    return v;
  };

  S.topicTotals = function () {
    var solved = 0, target = 0;
    (H.dsaMaster || []).forEach(function (t) {
      target += t.q;
      solved += Math.min(S.topicSolved(t.n), t.q);
    });
    return { solved: solved, target: target, pct: U.pct(solved, target) };
  };

  /* ---- collapse memory ------------------------------------------------ */
  S.collapsed = function (key, v) {
    if (v === undefined) return !!state.collapsed[key];
    if (v) state.collapsed[key] = 1; else delete state.collapsed[key];
    S.save();
  };

  /* ---- export / import ------------------------------------------------ */
  S.exportJSON = function () {
    return JSON.stringify({
      _app: "60-Day Placement Handbook Tracker",
      _exportedAt: new Date().toISOString(),
      state: state
    }, null, 1);
  };

  S.importJSON = function (text) {
    var obj = JSON.parse(text);
    var payload = obj && obj.state ? obj.state : obj;
    if (!payload || typeof payload !== "object") throw new Error("Unrecognised file");
    S.replaceAll(payload);
  };

  window.S = S;
})();
