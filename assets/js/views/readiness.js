/* ==========================================================================
   views/readiness.js — Part 10: weekly Interview Readiness Score
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var week = null;
  var showTable = false;

  function suggest(dimIndex) {
    /* Honest prompts computed from what the app already knows. */
    var p = S.progress(), t = S.topicTotals();
    switch (dimIndex) {
      case 0: return "Tier 1 coverage from your topic counters: " + t.pct + "% of the full quota.";
      case 3: return S.redoDue().length + " redo items due or overdue right now.";
      case 4: return "Core CS banks: " + (function () {
        var d = 0, tot = 0;
        (H.banks || []).forEach(function (b) {
          if (/OPERATING|DBMS|NETWORK|OOP/.test(b.title)) {
            var bp = S.bankProgress(b); d += bp.done; tot += bp.total;
          }
        });
        return d + "/" + tot + " ticked.";
      })();
      case 5: return (function () {
        var b = (H.banks || []).filter(function (x) { return x.id === "bank-sqlarch"; })[0];
        if (!b) return "";
        var bp = S.bankProgress(b);
        return "SQL archetypes ticked: " + bp.done + "/" + bp.total + ".";
      })();
      case 6: return (function () {
        var lld = (H.banks || []).filter(function (x) { return x.id === "bank-lld"; })[0];
        var hld = (H.banks || []).filter(function (x) { return x.id === "bank-hld"; })[0];
        var d = (lld ? S.bankProgress(lld).done : 0) + (hld ? S.bankProgress(hld).done : 0);
        return d + " design problems ticked end-to-end.";
      })();
      case 7: return (function () {
        var best = null;
        Object.keys(S.state().mockScores).forEach(function (k) {
          var s = S.state().mockScores[k];
          if (!s.rubric || !s.rubric.length) return;
          var avg = s.rubric.reduce(function (a, b) { return a + Number(b || 0); }, 0) / s.rubric.length;
          if (best === null || Number(k) > best.n) best = { n: Number(k), avg: avg };
        });
        return best ? "Latest mock rubric average: " + (Math.round(best.avg * 10) / 10) + "/5 → ×2 = " + Math.round(best.avg * 2) + "." : "No mock scored yet.";
      })();
      case 8: return "Resume & project checklist: " + (function () {
        var d = 0, tot = 0;
        (H.checklist || []).forEach(function (g) {
          if (/Resume|Projects/i.test(g.title)) { var gp = S.checkGroupProgress(g); d += gp.done; tot += gp.total; }
        });
        return d + "/" + tot;
      })() + " ticked.";
      case 9: return (function () {
        var b = (H.banks || []).filter(function (x) { return x.id === "bank-star"; })[0];
        return b ? "STAR stories rehearsed: " + S.bankProgress(b).done + "/8." : "";
      })();
      default: return "";
    }
  }

  function editor() {
    var dims = (H.readiness || {}).dimensions || [];
    var existing = S.scoreFor(week);
    var vals = existing ? existing.dims.slice() : dims.map(function () { return 0; });
    while (vals.length < dims.length) vals.push(0);

    var totalNode = el("div", { class: "hero-fig", style: "font-size:44px" });
    var bandNode = el("div", { class: "small" });
    var target = S.targetForWeek(week);

    function refresh() {
      var sum = vals.reduce(function (a, b) { return a + Number(b || 0); }, 0);
      U.clear(totalNode);
      U.append(totalNode, [String(sum), el("small", { text: "/100" })]);
      var band = S.band(sum);
      U.clear(bandNode);
      if (band) {
        U.append(bandNode, [
          el("b", { text: band.label }),
          el("div", { class: "muted tiny", style: "margin-top:2px", text: band.action })
        ]);
      }
      if (target !== null) {
        var delta = sum - target;
        U.append(bandNode, [el("div", {
          class: "tiny", style: "margin-top:6px",
          html: delta >= 0
            ? "<span class='up' style='color:var(--good-text);font-weight:600'>▲ " + delta + " above</span> the plan's week-" + week + " target of " + target
            : "<span style='color:var(--critical);font-weight:600'>▼ " + Math.abs(delta) + " below</span> the plan's week-" + week + " target of " + target
        })]);
      }
    }

    var rows = el("div", {});
    dims.forEach(function (d, i) {
      var valNode = el("span", { class: "dimrow-val", text: String(vals[i] || 0) });
      var range = el("input", {
        type: "range", min: 0, max: 10, step: 1, value: vals[i] || 0, "aria-label": d.name,
        oninput: function (e) { vals[i] = Number(e.target.value); valNode.textContent = vals[i]; refresh(); }
      });
      var hint = suggest(i);
      rows.appendChild(el("div", { class: "dimrow" }, [
        el("span", { class: "dimrow-n", text: d.n }),
        el("div", { style: "min-width:0" }, [
          el("div", { class: "dimrow-name", text: d.name }),
          el("div", { class: "dimrow-how", text: d.how }),
          hint ? el("div", { class: "tiny", style: "color:var(--accent);margin-top:2px", text: "↳ " + hint }) : null
        ]),
        range, valNode
      ]));
    });
    refresh();

    return el("div", { class: "grid g-side" }, [
      el("div", { class: "card card-pad-lg" }, [
        el("div", { class: "row", style: "margin-bottom:6px" }, [
          el("h3", { style: "font-size:16px", text: "Week " + week + " — score each dimension 0–10" }),
          el("span", { class: "small muted", style: "margin-left:auto", text: "Score it honestly. An inflated number costs you the offer, not me." })
        ]),
        rows,
        el("div", { class: "row", style: "margin-top:14px;padding-top:12px;border-top:1px solid var(--line)" }, [
          el("button", {
            class: "btn btn-primary", text: "Save week " + week + " score",
            onclick: function () {
              var total = S.saveScore(week, vals);
              U.toast("Week " + week + ": " + total + "/100", "good");
              Views.readiness.rerender();
            }
          }),
          S.scoreFor(week) ? el("button", {
            class: "btn btn-ghost btn-danger", text: "Delete",
            onclick: function () { S.deleteScore(week); Views.readiness.rerender(); }
          }) : null,
          el("span", { class: "tiny muted", text: S.scoreFor(week) ? "Saved " + U.prettyDate((S.scoreFor(week).savedAt || "").slice(0, 10)) : "Not saved yet" })
        ])
      ]),
      el("div", {}, [
        el("div", { class: "card card-pad-lg", style: "text-align:center" }, [
          el("div", { class: "tile-label", text: "Week " + week + " total" }),
          totalNode,
          bandNode
        ]),
        el("div", { class: "card", style: "margin-top:12px" }, [
          el("div", { class: "blk-sublabel", text: "What each band means" }),
          el("div", {}, ((H.readiness || {}).bands || []).map(function (b) {
            return el("div", { class: "small", style: "padding:5px 0;border-bottom:1px dashed var(--line)" }, [
              el("b", { class: "tnum", text: b.from + "–" + b.to + "  " }),
              b.label
            ]);
          }))
        ])
      ])
    ]);
  }

  Views.readiness = {
    title: "Readiness",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.readiness.render());
    },

    render: function () {
      var root = el("div", {});
      var traj = (H.readiness || {}).trajectory || [];
      var cur = S.currentDay();
      if (week === null) week = Math.min(9, Math.max(1, Math.ceil(cur / 7)));

      var latest = S.latestScore();
      root.appendChild(R.pageHead(
        "Interview Readiness Score",
        "Ten dimensions, 0–10 each, scored on every consolidation day (Days 7, 14, 21, 28, 35, 42, 49, 56). " +
        "The app pre-computes hints from your own ticked progress — but the number is yours to set honestly.",
        latest ? el("div", { style: "text-align:right;flex:none" }, [
          el("div", { class: "tile-label", text: "Latest" }),
          el("div", { style: "font-size:30px;font-weight:700;letter-spacing:-.03em" }, [String(latest.score.total), el("small", { style: "font-size:15px;color:var(--ink-3)", text: "/100" })]),
          el("div", { class: "tiny muted", text: "week " + latest.week })
        ]) : null
      ));

      /* chart */
      var labels = traj.map(function (t) { return t.week === 10 ? "Day 60" : "W" + t.week; });
      root.appendChild(el("div", { class: "card card-pad-lg", style: "margin-bottom:18px" }, [
        el("div", { class: "row", style: "margin-bottom:10px" }, [
          el("h3", { style: "font-size:15px", text: "Your trajectory vs the plan" }),
          el("button", {
            class: "btn btn-sm btn-ghost", style: "margin-left:auto",
            text: showTable ? "Show chart" : "Show table",
            onclick: function () { showTable = !showTable; Views.readiness.rerender(); }
          })
        ]),
        showTable
          ? R.table({
              head: ["Week", "Plan target", "Your score", "Δ"],
              rows: traj.map(function (t) {
                var s = S.scoreFor(t.week);
                var d = s ? s.total - t.target : null;
                return [
                  t.week === 10 ? "Day 60" : "Week " + t.week,
                  String(t.target),
                  s ? String(s.total) : "—",
                  d === null ? "—" : (d >= 0 ? "+" + d : String(d))
                ];
              })
            })
          : C.line({
              labels: labels, yMax: 100, yTicks: [0, 25, 50, 75, 100],
              aria: "Weekly readiness score versus the handbook target trajectory",
              series: [
                { name: "Plan target", color: "var(--s1)", values: traj.map(function (t) { return t.target; }), dashed: true },
                { name: "Your score", color: "var(--s2)", values: traj.map(function (t) { var s = S.scoreFor(t.week); return s ? s.total : null; }) }
              ]
            }),
        el("p", { class: "tiny muted", style: "margin-top:10px", text: "If you're 10+ points below target two weeks running, the cause is almost always one of: not enough unaided solving, no revision, or no speaking practice. Fix that one thing rather than adding hours." })
      ]));

      /* week picker */
      var picker = el("div", { class: "tabs" });
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (w) {
        var s = S.scoreFor(w);
        picker.appendChild(el("button", {
          class: "tab", "aria-selected": week === w ? "true" : "false",
          onclick: function () { week = w; Views.readiness.rerender(); }
        }, [
          "Week " + w,
          s ? el("span", { class: "nav-count tnum", text: s.total }) : null
        ]));
      });
      root.appendChild(picker);
      root.appendChild(editor());

      /* study-hour budget */
      var hours = (H.readiness || {}).hoursBudget || [];
      if (hours.length) {
        root.appendChild(R.sectionHead("Where the ~610 hours are meant to go"));
        var done = S.blockHoursDone();
        root.appendChild(el("div", { class: "card" }, [
          el("div", { class: "small muted", style: "margin-bottom:12px", html: "You have banked <b style='color:var(--ink)'>" + Math.round(done) + " h</b> of block time so far." }),
          el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px" },
            hours.map(function (h) {
              return R.meter({ pct: Math.min(100, U.pct(h.hours, 610)), label: h.block, valueText: h.hours + " h", hideCount: true, size: "sm" });
            })
          )
        ]));
      }

      return root;
    }
  };
})();
