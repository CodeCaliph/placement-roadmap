/* ==========================================================================
   views/mistakes.js — Part 9: the 100 mistakes, each with its fix
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var q = "", group = "all", only = "all";

  Views.mistakes = {
    title: "100 Mistakes",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.mistakes.render());
    },

    render: function () {
      var root = el("div", {});
      var all = H.mistakes || [];
      var p = S.progress().mistakes;
      var groups = [];
      all.forEach(function (m) { if (groups.indexOf(m.group) < 0) groups.push(m.group); });

      root.appendChild(R.pageHead(
        "The 100 Mistakes",
        "Tick one when you have genuinely internalised it — or better, when you have caught yourself doing it and " +
        "changed the habit. This is the cheapest section in the handbook: every tick is a rejection avoided.",
        el("div", { style: "min-width:170px;flex:none" }, [
          R.meter({ done: p.done, total: p.total, label: "Internalised", size: "lg" })
        ])
      ));

      root.appendChild(el("div", { class: "filterbar" }, [
        el("input", {
          class: "inp", type: "search", placeholder: "Search mistakes and fixes…", value: q,
          oninput: U.debounce(function (e) { q = e.target.value.trim(); Views.mistakes.rerender(); }, 200)
        }),
        el("select", {
          class: "inp", style: "width:auto;max-width:260px",
          onchange: function (e) { group = e.target.value; Views.mistakes.rerender(); }
        }, [el("option", { value: "all", text: "All groups" })].concat(groups.map(function (g) {
          return el("option", { value: g, text: g, selected: group === g });
        }))),
        el("div", { class: "seg" }, [["all", "All"], ["open", "Not yet"], ["done", "Ticked"]].map(function (o) {
          return el("button", {
            text: o[1], "aria-pressed": only === o[0] ? "true" : "false",
            onclick: function () { only = o[0]; Views.mistakes.rerender(); }
          });
        }))
      ]));

      /* per-group meters */
      root.appendChild(el("div", { class: "card", style: "margin-bottom:18px" }, [
        el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px" },
          groups.map(function (g) {
            var ids = all.filter(function (m) { return m.group === g; }).map(function (m) { return S.ids.mistake(m.n); });
            return R.meter({ done: S.countDone(ids), total: ids.length, label: g, size: "sm" });
          })
        )
      ]));

      var list = all.filter(function (m) {
        var id = S.ids.mistake(m.n), done = S.isDone(id);
        if (only === "open" && done) return false;
        if (only === "done" && !done) return false;
        if (group !== "all" && m.group !== group) return false;
        if (q && (m.mistakeText + " " + m.fixText).toLowerCase().indexOf(q.toLowerCase()) < 0) return false;
        return true;
      });

      if (!list.length) return U.append(root, R.empty("Nothing matches those filters."));

      var lastGroup = null;
      list.forEach(function (m) {
        if (m.group !== lastGroup && group === "all" && !q) {
          lastGroup = m.group;
          root.appendChild(R.sectionHead(m.group));
        }
        var id = S.ids.mistake(m.n);
        var done = S.isDone(id);
        var card = el("div", { class: "mistake" + (done ? " is-done" : "") });
        var chk = el("input", {
          type: "checkbox", class: "check", checked: done,
          "aria-label": "Mistake " + m.n + " internalised",
          onchange: function () {
            S.setDone(id, chk.checked); S.emit("toggle");
            card.classList.toggle("is-done", chk.checked);
          }
        });
        U.append(card, [
          el("div", {}, [chk]),
          el("div", { style: "min-width:0" }, [
            el("div", { class: "mistake-n", text: "#" + m.n }),
            el("div", { class: "mistake-bad", html: m.mistake }),
            m.fix ? el("div", { class: "mistake-fix", html: "<b>Fix:</b> " + m.fix }) : null
          ])
        ]);
        root.appendChild(card);
      });

      return root;
    }
  };
})();
