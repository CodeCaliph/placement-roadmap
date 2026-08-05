/* ==========================================================================
   views/mocks.js — Part 7: the 13 mocks, 8 mock OAs, and the scoring rubric
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var openMock = null;

  function rubricEditor(mock) {
    var dims = (H.mocks || {}).rubric || [];
    var saved = S.mockScore(mock.n) || { rubric: dims.map(function () { return 0; }), notes: "" };
    var vals = (saved.rubric || []).slice();
    while (vals.length < dims.length) vals.push(0);

    var totalNode = el("span", { class: "tnum", style: "font-weight:680" });
    function refresh() {
      var sum = vals.reduce(function (a, b) { return a + Number(b || 0); }, 0);
      var max = dims.length * 5;
      var avg = dims.length ? (sum / dims.length) : 0;
      totalNode.textContent = sum + "/" + max + "  (avg " + (Math.round(avg * 10) / 10) + "/5)";
    }

    var box = el("div", {});
    dims.forEach(function (d, i) {
      var valNode = el("span", { class: "dimrow-val", text: String(vals[i] || 0) });
      var range = el("input", {
        type: "range", min: 0, max: 5, step: 1, value: vals[i] || 0,
        "aria-label": d.name,
        oninput: function (e) {
          vals[i] = Number(e.target.value);
          valNode.textContent = vals[i];
          refresh();
        }
      });
      box.appendChild(el("div", { class: "dimrow" }, [
        el("span", { class: "dimrow-n", text: i + 1 }),
        el("div", { style: "min-width:0" }, [
          el("div", { class: "dimrow-name", text: d.name }),
          el("div", { class: "dimrow-how", text: "A 5: " + d.five })
        ]),
        range, valNode
      ]));
    });
    refresh();

    var notes = el("textarea", { class: "inp", rows: 3, placeholder: "What went wrong, and the one fix for next time…" });
    notes.value = saved.notes || "";

    return el("div", {}, [
      el("div", { class: "row", style: "margin-bottom:8px" }, [
        el("div", { class: "blk-sublabel", style: "margin:0", text: "Rubric — score each 1–5" }),
        el("span", { style: "margin-left:auto" }, [totalNode])
      ]),
      box,
      el("div", { style: "margin-top:12px" }, [
        el("div", { class: "blk-sublabel", text: "Feedback & the one fix" }), notes
      ]),
      el("div", { class: "row", style: "margin-top:12px" }, [
        el("button", {
          class: "btn btn-primary btn-sm", text: "Save score",
          onclick: function () {
            S.mockScore(mock.n, { rubric: vals, notes: notes.value });
            U.toast("Mock #" + mock.n + " scored", "good");
            Views.mocks.rerender();
          }
        }),
        el("span", { class: "tiny muted", text: "Below 3 on any dimension twice in a row → that becomes next week's evening focus." })
      ])
    ]);
  }

  function mockCard(mock) {
    var id = S.ids.mock(mock.n);
    var done = S.isDone(id);
    var score = S.mockScore(mock.n);
    var isOpen = openMock === mock.n;
    var avg = null;
    if (score && score.rubric && score.rubric.length) {
      avg = Math.round((score.rubric.reduce(function (a, b) { return a + Number(b || 0); }, 0) / score.rubric.length) * 10) / 10;
    }
    var sched = S.scheduledDate(mock.day);

    var card = el("div", { class: "mock" + (done ? " is-done" : "") });
    var check = el("input", {
      type: "checkbox", class: "check", checked: done,
      "aria-label": "Mock " + mock.n + " completed",
      onchange: function () { S.setDone(id, check.checked); S.emit("toggle"); Views.mocks.rerender(); }
    });

    U.append(card, [
      el("div", { class: "mock-n", text: mock.n }),
      el("div", { style: "min-width:0" }, [
        el("div", { class: "row", style: "gap:8px" }, [
          el("span", { style: "font-weight:620;font-size:14px", html: mock.type }),
          el("span", { class: "tag", text: "Day " + mock.day }),
          sched ? el("span", { class: "tiny muted", text: U.shortDate(sched) }) : null,
          avg !== null ? el("span", { class: "tag " + (avg >= 4 ? "tag-good" : avg >= 3 ? "tag-t2" : "tag-t1"), text: "avg " + avg + "/5" }) : null
        ]),
        el("div", { class: "small dim", style: "margin-top:3px", html: mock.format }),
        el("div", { class: "tiny muted", style: "margin-top:1px", html: "Focus: " + mock.focus }),
        isOpen ? el("div", { style: "margin-top:14px;padding-top:12px;border-top:1px solid var(--line)" }, [rubricEditor(mock)]) : null
      ]),
      el("div", { class: "row", style: "gap:8px;flex-wrap:nowrap;align-items:flex-start" }, [
        el("button", {
          class: "btn btn-sm", text: isOpen ? "Close" : (score ? "Edit score" : "Score it"),
          onclick: function () { openMock = isOpen ? null : mock.n; Views.mocks.rerender(); }
        }),
        el("label", { class: "row", style: "gap:6px;cursor:pointer;font-size:12px" }, [check, "done"])
      ])
    ]);
    return card;
  }

  Views.mocks = {
    title: "Mocks",

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.mocks.render());
    },

    render: function () {
      var root = el("div", {});
      var m = H.mocks || {};
      var p = S.progress();

      root.appendChild(R.pageHead(
        "Mock Interviews & OAs",
        "13 mocks and 8 mock OAs. The handbook is blunt about this: <b>most students delay mocks until week 6 " +
        "and then discover they cannot speak and code simultaneously.</b> That discovery must happen on Day 14.",
        el("div", { class: "row", style: "gap:12px;flex:none" }, [
          el("div", { style: "width:130px" }, [R.meter({ done: p.mocks.done, total: p.mocks.total, label: "Mocks", size: "lg" })]),
          el("div", { style: "width:130px" }, [R.meter({ done: p.oas.done, total: p.oas.total, label: "Mock OAs", size: "lg" })])
        ])
      ));

      /* mock OAs */
      root.appendChild(R.sectionHead("Mock OAs", "90–120 min each, contest conditions, no help"));
      var oaGrid = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(122px,1fr))" });
      (m.oaDays || []).forEach(function (day, i) {
        var id = S.ids.oa(day);
        var done = S.isDone(id);
        var chk = el("input", {
          type: "checkbox", class: "check", checked: done,
          "aria-label": "Mock OA on day " + day,
          onchange: function () { S.setDone(id, chk.checked); S.emit("toggle"); Views.mocks.rerender(); }
        });
        oaGrid.appendChild(el("label", {
          class: "card", style: "cursor:pointer;padding:12px;display:flex;gap:10px;align-items:center" +
            (done ? ";background:color-mix(in srgb,var(--good) 6%,var(--surface-1));border-color:color-mix(in srgb,var(--good) 26%,transparent)" : "")
        }, [
          chk,
          el("div", {}, [
            el("div", { style: "font-weight:620;font-size:13.4px", text: "OA #" + (i + 1) }),
            el("div", { class: "tiny muted", text: "Day " + day })
          ])
        ]));
      });
      root.appendChild(oaGrid);

      /* the 13 mocks */
      root.appendChild(R.sectionHead("The 13 mocks", "Self-mock from Day 14 · peer from Day 21 · stranger from Day 28"));
      (m.schedule || []).forEach(function (mock) { root.appendChild(mockCard(mock)); });

      /* rubric reference + types */
      var part7 = (H.reference || []).filter(function (r) { return r.num === 7; })[0];
      if (part7) {
        root.appendChild(R.sectionHead("How to run each type"));
        var wrap = el("div", { class: "card doc" });
        (part7.sections || []).forEach(function (sec) {
          if (/schedule/i.test(sec.title)) return;   // already rendered above
          wrap.appendChild(el("h3", { text: sec.title }));
          wrap.appendChild(R.blocks(sec.blocks));
        });
        root.appendChild(wrap);
      }

      return root;
    }
  };
})();
