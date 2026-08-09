/* ==========================================================================
   momentum.js — the bottom-left motivation panel.

   Generic "you can do it" quotes wear off in about three days. This instead
   leads with a fact computed from the user's own progress, and backs it with a
   line from the handbook they are actually following. Global namespace: window.M
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK || {};
  var M = {};
  var factIdx = 0, lineIdx = 0, panel = null;

  /* ---- lines: the handbook's own voice, plus a few of ours ------------- */
  var CURATED = [
    { text: "The block in front of you is the only one that matters. Not the 239 others.", cite: "This tracker" },
    { text: "You are not behind because you missed a day. You are behind only if you stop.", cite: "This tracker" },
    { text: "Nobody feels ready. The people who get offers did the blocks anyway.", cite: "This tracker" },
    { text: "Two hours of honest, unaided solving beats eight hours of watching someone else solve.", cite: "This tracker" },
    { text: "Tired is not the same as done. Do the Night block — it's one hour.", cite: "This tracker" }
  ];

  var LINES = null;
  function lines() {
    if (LINES) return LINES;
    var out = [];

    (H.groundRules || []).forEach(function (g) {
      out.push({ text: g.text, cite: "Ground rule " + g.n });
    });

    /* the closing three questions — the sharpest lines in the book */
    (H.reference || []).forEach(function (p) {
      (p.sections || []).forEach(function (sec) {
        if (!/FINAL WORD/i.test(sec.title)) return;
        (sec.blocks || []).forEach(function (b) {
          if (b.type === "list") {
            b.items.forEach(function (it) { out.push({ text: it.text, cite: "Final word" }); });
          } else if (b.type === "para" && b.text.length > 40) {
            out.push({ text: b.text, cite: "Final word" });
          }
        });
      });
    });

    /* the mindset fixes from Part 9 are genuinely steadying */
    (H.mistakes || []).forEach(function (m) {
      if (m.n >= 93 && m.fixText && m.fixText.length > 24) {
        out.push({ text: m.fixText, cite: "Mistake #" + m.n + " — the fix" });
      }
    });

    LINES = out.concat(CURATED);
    return LINES;
  }

  /* ---- facts: computed from their own ticks ---------------------------- */
  function nearestTier() {
    var best = null;
    (H.banks || []).forEach(function (bank) {
      bank.tiers.forEach(function (t, ti) {
        var tp = S.tierProgress(bank, ti);
        var left = tp.total - tp.done;
        if (tp.done === 0 || left === 0) return;
        if (!best || left < best.left) {
          best = { left: left, bank: bank, tier: t, done: tp.done, total: tp.total };
        }
      });
    });
    return best;
  }

  function facts() {
    var p = S.progress();
    var st = S.streak();
    var topics = S.topicTotals();
    var out = [];

    if (p.plan.done === 0) {
      out.push({
        kicker: "Day one",
        fig: "1", figUnit: "block",
        sub: "That's all it takes to start. Open today and tick the Morning block."
      });
    }

    if (st.current > 0) {
      out.push({
        kicker: st.current >= st.best ? "Your best streak ever" : "Current streak",
        fig: String(st.current), figUnit: st.current === 1 ? "day" : "days",
        sub: st.current >= st.best
          ? "This is the longest you've kept it going. Don't break it today."
          : "Your best is " + st.best + ". " + (st.best - st.current === 1 ? "One more day ties it." : (st.best - st.current) + " more days ties it.")
      });
    }

    if (p.plan.done > 0) {
      out.push({
        kicker: "Work banked",
        fig: String(p.plan.done), figUnit: "of 240 blocks",
        sub: p.overall + "% of the whole programme is behind you. That cannot be taken away."
      });
    }

    if (p.hours >= 1) {
      out.push({
        kicker: "Hours in",
        fig: String(Math.round(p.hours)), figUnit: "hours",
        sub: "Out of roughly 610 planned. Every one of them was a choice you made."
      });
    }

    var tier = nearestTier();
    if (tier) {
      out.push({
        kicker: "Almost closed out",
        fig: String(tier.left), figUnit: tier.left === 1 ? "problem left" : "problems left",
        sub: "in " + tier.tier.name + " of " + tier.bank.title.replace(/^TOP\s+\d+\s*[—–-]\s*/, "") +
             " (" + tier.done + "/" + tier.total + " done). Finish the set."
      });
    }

    if (p.daysComplete > 0) {
      out.push({
        kicker: "Days fully done",
        fig: String(p.daysComplete), figUnit: "of 60",
        sub: p.daysComplete >= 30 ? "Past halfway. The hard part is behind you." : "All four blocks, no shortcuts."
      });
    }

    if (topics.solved > 0) {
      out.push({
        kicker: "Problems solved",
        fig: U.compact(topics.solved), figUnit: "of " + topics.target,
        sub: "Counted against the handbook's own per-topic quota."
      });
    }

    if (p.mistakes.done > 0) {
      out.push({
        kicker: "Mistakes internalised",
        fig: String(p.mistakes.done), figUnit: "of 100",
        sub: "Each one is a rejection you've already avoided."
      });
    }

    var latest = S.latestScore();
    if (latest) {
      var target = S.targetForWeek(latest.week);
      out.push({
        kicker: "Readiness, week " + latest.week,
        fig: String(latest.score.total), figUnit: "/ 100",
        sub: target === null ? (S.band(latest.score.total) || {}).label || ""
          : latest.score.total >= target
            ? "Above the plan's target of " + target + ". You are ahead of the curve."
            : "The plan's target was " + target + ". Close the gap on one dimension, not all ten."
      });
    }

    if (!out.length) {
      out.push({
        kicker: "Ready when you are",
        fig: "60", figUnit: "days",
        sub: "Set your Day 1 on the dashboard and take the first block."
      });
    }
    return out;
  }

  /* ---- last 7 days of activity ---------------------------------------- */
  function dots() {
    var active = S.activeDayKeys();
    var today = U.todayKey();
    var row = el("div", { class: "mo-dots" });
    for (var i = 6; i >= 0; i--) {
      var key = U.addDays(today, -i);
      var on = !!active[key];
      var d = U.parseKey(key);
      row.appendChild(el("div", {
        class: "mo-dot" + (on ? " on" : "") + (i === 0 ? " today" : ""),
        title: U.prettyDate(key) + (on ? " — worked" : " — nothing logged"),
        text: d ? "SMTWTFS".charAt(d.getDay()) : ""
      }));
    }
    return row;
  }

  /* ---- the panel ------------------------------------------------------ */
  function build() {
    var host = el("div", { class: "mo", id: "momentum-panel", hidden: true, role: "dialog", "aria-label": "Momentum" });
    var head = el("div", { class: "mo-head" });
    var body = el("div", { class: "mo-body" });
    var quote = el("blockquote", { class: "mo-quote" });

    function paintFact() {
      var list = facts();
      if (factIdx >= list.length) factIdx = 0;
      var f = list[factIdx];
      U.clear(head);
      U.append(head, [
        el("div", { class: "mo-kicker" }, [el("span", { text: "✦" }), f.kicker]),
        el("div", { class: "mo-fig" }, [f.fig, el("small", { text: " " + f.figUnit })]),
        el("div", { class: "mo-sub", text: f.sub })
      ]);
    }

    function paintQuote() {
      var list = lines();
      if (lineIdx >= list.length) lineIdx = 0;
      var q = list[lineIdx];
      U.clear(quote);
      U.append(quote, [q.text, el("cite", { text: "— " + q.cite })]);
    }

    U.append(body, [dots(), quote]);

    var foot = el("div", { class: "mo-foot" }, [
      el("button", {
        class: "btn btn-sm btn-primary", text: "Today's blocks →",
        onclick: function () { M.close(); location.hash = "#/plan/" + S.currentDay(); }
      }),
      el("button", {
        class: "btn btn-sm btn-ghost", title: "Another one",
        text: "↻ Next",
        onclick: function () {
          factIdx++; lineIdx++;
          paintFact(); paintQuote();
        }
      }),
      el("span", { style: "flex:1" }),
      el("button", { class: "btn btn-sm btn-ghost", text: "Close", onclick: function () { M.close(); } })
    ]);

    U.append(host, [head, body, foot]);
    host.refresh = function () {
      U.clear(body);
      U.append(body, [dots(), quote]);
      paintFact();
      paintQuote();
    };
    paintFact();
    paintQuote();
    return host;
  }

  /* ---- public --------------------------------------------------------- */
  M.mount = function () {
    panel = build();
    document.body.appendChild(panel);

    document.addEventListener("click", function (e) {
      if (!panel || panel.hidden) return;
      if (panel.contains(e.target)) return;
      if (e.target.closest && e.target.closest("#momentum-btn")) return;
      M.close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") M.close();
    });
  };

  M.close = function () { if (panel) panel.hidden = true; };

  M.toggle = function (anchor) {
    if (!panel) return;
    if (!panel.hidden) { M.close(); return; }
    factIdx = 0; lineIdx = Math.floor((new Date().getDate() + new Date().getHours()) % lines().length);
    panel.refresh();
    panel.hidden = false;
    // position above the anchor, clamped to the viewport
    var r = anchor.getBoundingClientRect();
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
    var top = r.top - h - 10;
    if (top < 8) top = Math.min(r.bottom + 10, window.innerHeight - h - 8);
    panel.style.left = left + "px";
    panel.style.top = top + "px";
    var btn = U.$("#momentum-btn");
    if (btn) btn.classList.remove("has-news");
  };

  /** A gentle once-a-day nudge — never more than that. */
  M.nudge = function () {
    var st = S.state();
    var today = U.todayKey();
    if (st.lastNudge === today) return;
    var btn = U.$("#momentum-btn");
    if (!btn) return;

    var streak = S.streak();
    var worked = streak.today;
    if (!worked || streak.current >= 3) {
      btn.classList.add("has-news");
      st.lastNudge = today;
      S.save();
      setTimeout(function () {
        if (!worked) {
          U.toast(streak.current > 0
            ? "🔥 " + streak.current + "-day streak — one block keeps it alive"
            : "One block today is enough to start again");
        } else {
          U.toast("🔥 " + streak.current + " days in a row. Keep it.", "good");
        }
      }, 1400);
    }
  };

  M.button = function () {
    var btn = el("button", {
      class: "momentum-btn", id: "momentum-btn",
      title: "Momentum — your progress, and a line worth reading",
      "aria-label": "Open the momentum panel",
      text: "✦",
      onclick: function (e) { e.stopPropagation(); M.toggle(btn); }
    });
    return btn;
  };

  window.M = M;
})();
