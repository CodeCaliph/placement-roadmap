/* ==========================================================================
   views/banks.js — Part 6 question lists + the curated must-know sets
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var active = null;        // bank id
  var q = "";
  var only = "all";         // all | open | done

  function bankById(id) {
    var list = H.banks || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || null;
  }

  function shortName(bank) {
    return bank.title.replace(/^TOP\s+\d+\s*[—–-]\s*/, "").replace(/\s*\(.*\)$/, "");
  }

  Views.banks = {
    title: "Problem Sets",

    route: function (param) { if (param) active = param; },

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.banks.render());
    },

    render: function () {
      var root = el("div", {});
      var banks = H.banks || [];
      var bank = bankById(active);
      if (!bank) return R.empty("No question banks found.");
      active = bank.id;

      var total = S.progress().bank;

      root.appendChild(R.pageHead(
        "Problem & Question Sets",
        "Every enumerated list in the handbook, made tickable: the 10 categorized banks from Part 6 plus the " +
        "curated must-know sets (12 design patterns, 15 LLD, 12 HLD, 20 SQL archetypes, 12 DP families, 8 STAR stories). " +
        "<b>" + total.total + " items</b> in total — this is the coverage map.",
        el("div", { style: "min-width:160px;flex:none" }, [
          R.meter({ done: total.done, total: total.total, label: "All sets", size: "lg" })
        ])
      ));

      /* tabs */
      var tabs = el("div", { class: "tabs", role: "tablist" });
      banks.forEach(function (b) {
        var p = S.bankProgress(b);
        tabs.appendChild(el("button", {
          class: "tab", role: "tab", "aria-selected": b.id === active ? "true" : "false",
          onclick: function () { active = b.id; q = ""; Views.banks.rerender(); }
        }, [
          shortName(b),
          el("span", { class: "nav-count tnum", text: p.done + "/" + p.total })
        ]));
      });
      root.appendChild(tabs);

      /* bank header */
      var bp = S.bankProgress(bank);
      root.appendChild(el("div", { class: "card", style: "margin-bottom:16px" }, [
        el("div", { class: "row", style: "align-items:flex-start" }, [
          el("div", { style: "flex:1;min-width:0" }, [
            el("h3", { style: "font-size:16.5px", text: bank.title }),
            el("div", { class: "small muted", style: "margin-top:3px", text: bank.code + " · " + bank.count + " items" })
          ]),
          el("div", { style: "width:180px;flex:none" }, [
            R.meter({ done: bp.done, total: bp.total, label: "This set", size: "lg" })
          ])
        ]),
        /* a single-tier set would just restate the meter above */
        bank.tiers.length > 1
          ? el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-top:14px;gap:14px" },
              bank.tiers.map(function (t, ti) {
                var tp = S.tierProgress(bank, ti);
                return R.meter({ done: tp.done, total: tp.total, label: t.name, size: "sm" });
              })
            )
          : null
      ]));

      /* filters */
      root.appendChild(el("div", { class: "filterbar" }, [
        el("input", {
          class: "inp", type: "search", placeholder: "Filter within this set…", value: q,
          oninput: U.debounce(function (e) { q = e.target.value.trim(); Views.banks.rerender(); }, 200)
        }),
        el("div", { class: "seg" }, [["all", "All"], ["open", "Not done"], ["done", "Done"]].map(function (o) {
          return el("button", {
            text: o[1], "aria-pressed": only === o[0] ? "true" : "false",
            onclick: function () { only = o[0]; Views.banks.rerender(); }
          });
        })),
        el("button", {
          class: "btn btn-sm btn-ghost", text: "Clear this set",
          onclick: function () {
            if (!confirm("Untick all " + bank.count + " items in “" + shortName(bank) + "”?")) return;
            var ids = [];
            bank.tiers.forEach(function (t, ti) {
              t.items.forEach(function (_, ii) { ids.push(S.ids.bankItem(bank, ti, ii)); });
            });
            S.setMany(ids, false);
            Views.banks.rerender();
          }
        })
      ]));

      /* tiers */
      var shown = 0;
      var offset = 0;
      bank.tiers.forEach(function (tier, ti) {
        var rows = [];
        tier.items.forEach(function (item, ii) {
          var id = S.ids.bankItem(bank, ti, ii);
          var done = S.isDone(id);
          if (only === "open" && done) return;
          if (only === "done" && !done) return;
          if (q && item.toLowerCase().indexOf(q.toLowerCase()) < 0) return;
          rows.push(R.checkRow({ id: id, n: offset + ii + 1, text: item }));
        });
        offset += tier.items.length;
        if (!rows.length) return;
        shown += rows.length;

        var tp = S.tierProgress(bank, ti);
        root.appendChild(el("div", { class: "section-head" }, [
          el("h2", { class: "section-title", text: bank.tiers.length > 1 ? tier.name : "The list" }),
          tier.note ? el("span", { class: "small muted", text: tier.note }) : null,
          el("span", { class: "section-note tnum", text: tp.done + "/" + tp.total + " · " + tp.pct + "%" })
        ]));
        root.appendChild(el("div", { class: "card" }, [
          el("div", { class: "qlist" + (rows.length > 14 ? " cols2" : "") }, rows),
          el("div", { class: "row", style: "margin-top:10px;padding-top:10px;border-top:1px solid var(--line)" }, [
            el("button", {
              class: "btn btn-sm btn-ghost", text: "Tick this whole tier",
              onclick: function () {
                S.setMany(tier.items.map(function (_, ii) { return S.ids.bankItem(bank, ti, ii); }), true);
                Views.banks.rerender();
              }
            })
          ])
        ]));
      });

      if (!shown) root.appendChild(R.empty("Nothing matches those filters in this set."));
      return root;
    }
  };
})();
