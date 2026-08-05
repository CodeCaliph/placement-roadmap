/* ==========================================================================
   views/topics.js — §1.1 master table + §1.2 deep dives, with a per-topic
   problem quota you can count against (~750 problems in 60 days)
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var openTopic = null;
  var tierFilter = "all";

  function tierOf(row) {
    var m = /(\d)/.exec(row.tier || "");
    return m ? Number(m[1]) : 4;
  }

  function deepDive(n) {
    var list = H.dsaTopics || [];
    for (var i = 0; i < list.length; i++) if (list[i].n === n) return list[i];
    return null;
  }

  function counter(row) {
    var solved = S.topicSolved(row.n);
    var valNode = el("span", { class: "tnum", style: "font-weight:650;min-width:46px;text-align:right", text: solved + "/" + row.q });
    var meterHost = el("div", { style: "width:104px" }, [
      R.meter({ done: Math.min(solved, row.q), total: row.q, showValue: false, size: "sm" })
    ]);

    function set(v) {
      var next = S.topicSolved(row.n, v);
      valNode.textContent = next + "/" + row.q;
      U.clear(meterHost).appendChild(
        R.meter({ done: Math.min(next, row.q), total: row.q, showValue: false, size: "sm" })
      );
    }

    return el("div", { class: "row", style: "gap:6px;justify-content:flex-end;flex-wrap:nowrap" }, [
      meterHost, valNode,
      el("button", { class: "btn btn-sm btn-ghost", style: "width:26px;padding:0", text: "−", title: "one fewer", onclick: function () { set(S.topicSolved(row.n) - 1); } }),
      el("button", { class: "btn btn-sm btn-ghost", style: "width:26px;padding:0", text: "+", title: "one more", onclick: function () { set(S.topicSolved(row.n) + 1); } })
    ]);
  }

  Views.topics = {
    title: "DSA Topics",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.topics.render());
    },

    render: function () {
      var root = el("div", {});
      var rows = H.dsaMaster || [];
      var totals = S.topicTotals();

      root.appendChild(R.pageHead(
        "DSA Topics & Quotas",
        "All 35 topics in priority order, with the handbook's per-topic problem quota. " +
        "Count your solved problems here — this is the <b>~750 quality problems</b> target, " +
        "and the tier column is what decides where your hours go.",
        el("div", { style: "min-width:170px;flex:none" }, [
          R.meter({ done: totals.solved, total: totals.target, label: "Problems solved", size: "lg" })
        ])
      ));

      root.appendChild(el("div", { class: "filterbar" }, [
        el("div", { class: "seg" }, [
          ["all", "All 35"], ["1", "Tier 1"], ["2", "Tier 2"], ["3", "Tier 3"], ["4", "Tier 4 · skip"]
        ].map(function (o) {
          return el("button", {
            text: o[1], "aria-pressed": tierFilter === o[0] ? "true" : "false",
            onclick: function () { tierFilter = o[0]; Views.topics.rerender(); }
          });
        })),
        el("span", { class: "small muted", text: "Tier 1 to 90% before any Tier 3 topic." })
      ]));

      var shown = rows.filter(function (r) {
        return tierFilter === "all" || String(tierOf(r)) === tierFilter;
      });

      var list = el("div", {});
      shown.forEach(function (row) {
        var dive = deepDive(row.n);
        var isOpen = openTopic === row.n;
        var card = el("div", { class: "day" + (isOpen ? " is-open" : "") });

        card.appendChild(el("div", { class: "day-head", style: "cursor:default" }, [
          el("div", { class: "day-num", style: "font-size:13px" }, [String(row.n)]),
          el("div", { class: "day-main" }, [
            el("div", { class: "day-title" }, [
              row.topic,
              el("span", { class: "small muted", style: "font-weight:400", text: "  " + row.frequency + " of interviews" })
            ]),
            el("div", { class: "day-meta" }, [
              el("span", { text: row.importance }),
              el("span", { text: row.difficulty }),
              el("span", { text: row.q + " problems to solve" })
            ])
          ]),
          el("div", { class: "day-right" }, [
            R.tierTag(row.tier),
            counter(row),
            dive ? el("button", {
              class: "btn btn-sm", text: isOpen ? "Hide" : "Patterns",
              onclick: function () {
                openTopic = isOpen ? null : row.n;
                Views.topics.rerender();
              }
            }) : el("span", { class: "tiny muted", style: "width:66px;text-align:center", text: "—" })
          ])
        ]));

        if (isOpen && dive) {
          var body = el("div", { class: "day-body", style: "padding-top:16px" });
          (dive.fields || []).forEach(function (f) {
            body.appendChild(el("div", { class: "field" }, [
              el("div", { class: "field-label", text: f.label }),
              el("div", { class: "field-body", html: f.html })
            ]));
          });
          if ((dive.blocks || []).length) {
            body.appendChild(el("div", { class: "doc", style: "margin-top:6px" }, [R.blocks(dive.blocks)]));
          }
          body.appendChild(R.noteBox("topic:" + row.n, "Your own notes on " + row.topic + "…"));
          card.appendChild(body);
        }

        list.appendChild(card);
      });

      root.appendChild(list);

      /* the low-ROI warning is load-bearing advice — keep it visible */
      var p1 = (H.reference || []).filter(function (r) { return r.num === 1; })[0];
      if (p1) {
        var sec = (p1.sections || []).filter(function (s) { return s.title.indexOf("1.1 ") === 0; })[0];
        if (sec) {
          var quotes = (sec.blocks || []).filter(function (b) { return b.type === "quote"; });
          if (quotes.length) {
            root.appendChild(R.sectionHead("Where not to spend time"));
            root.appendChild(el("div", { class: "card doc" }, [R.blocks(quotes)]));
          }
        }
      }

      return root;
    }
  };
})();
