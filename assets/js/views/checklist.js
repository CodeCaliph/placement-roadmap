/* ==========================================================================
   views/checklist.js — Part 8: the final placement checklist
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var only = "all";

  Views.checklist = {
    title: "Final Checklist",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.checklist.render());
    },

    render: function () {
      var root = el("div", {});
      var groups = H.checklist || [];
      var p = S.progress().checklist;

      root.appendChild(R.pageHead(
        "Final Placement Checklist",
        "Day 60's job is to tick every box here. Anything unticked that takes under 30 minutes, fix it; " +
        "note the rest. Work through it early too — an unticked box in week 4 is a plan, in week 9 it's a problem.",
        el("div", { style: "min-width:170px;flex:none" }, [
          R.meter({ done: p.done, total: p.total, label: "Checklist", size: "lg" })
        ])
      ));

      root.appendChild(el("div", { class: "filterbar" }, [
        el("div", { class: "seg" }, [["all", "All"], ["open", "Unticked only"]].map(function (o) {
          return el("button", {
            text: o[1], "aria-pressed": only === o[0] ? "true" : "false",
            onclick: function () { only = o[0]; Views.checklist.rerender(); }
          });
        })),
        el("button", { class: "btn btn-sm btn-ghost", text: "Print this page", onclick: function () { window.print(); } })
      ]));

      /* group meters overview */
      root.appendChild(el("div", { class: "card", style: "margin-bottom:18px" }, [
        el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px" },
          groups.map(function (g) {
            var gp = S.checkGroupProgress(g);
            return R.meter({ done: gp.done, total: gp.total, label: g.title, size: "sm" });
          })
        )
      ]));

      var shownAny = false;
      groups.forEach(function (g) {
        var gp = S.checkGroupProgress(g);
        var rows = [];
        g.items.forEach(function (item, i) {
          var id = S.ids.checkItem(g, i);
          if (only === "open" && S.isDone(id)) return;
          rows.push(R.checkRow({
            id: id, html: item.html, aria: item.text,
            onToggle: function () { Views.checklist.rerender(); }
          }));
        });
        if (!rows.length) return;
        shownAny = true;

        root.appendChild(el("div", { class: "card", style: "margin-bottom:12px" }, [
          el("div", { class: "row", style: "margin-bottom:8px" }, [
            el("h3", { style: "font-size:15px", text: g.title }),
            el("span", {
              class: "tag" + (gp.pct === 100 ? " tag-good" : ""),
              style: "margin-left:auto",
              text: gp.pct === 100 ? "✔ all clear" : gp.done + " / " + gp.total
            })
          ]),
          R.meter({ done: gp.done, total: gp.total, showValue: false, size: "sm" }),
          el("div", { class: "qlist", style: "margin-top:10px" }, rows)
        ]));
      });

      if (!shownAny) {
        root.appendChild(el("div", {
          class: "card card-pad-lg center",
          style: "border-color:color-mix(in srgb,var(--good) 40%,transparent);background:color-mix(in srgb,var(--good) 7%,transparent)"
        }, [
          el("div", { style: "font-size:30px", text: "✔" }),
          el("h3", { style: "margin-top:8px", text: "Every box ticked." }),
          el("p", { class: "small dim", style: "margin-top:4px", text: "You are prepared. Rest, and walk in." })
        ]));
      }

      return root;
    }
  };
})();
