/* ==========================================================================
   render.js — shared UI pieces. Global namespace: window.R
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, R = {};

  /* view registry — each views/*.js file registers itself here */
  window.Views = window.Views || {};

  /* ---- meter: a single ratio against a limit --------------------------- */
  R.meter = function (opts) {
    var pct = opts.pct !== undefined ? opts.pct : U.pct(opts.done, opts.total);
    var full = pct >= 100;
    var head = null;
    if (opts.label || opts.showValue !== false) {
      head = el("div", { class: "meter-head" }, [
        opts.label ? el("span", { class: "meter-label", text: opts.label }) : null,
        opts.showValue === false ? null : el("span", { class: "meter-val" }, [
          opts.valueText !== undefined ? opts.valueText : String(pct) + "%",
          opts.total !== undefined && opts.hideCount !== true
            ? el("span", { text: "  " + opts.done + "/" + opts.total })
            : null
        ])
      ]);
    }
    return el("div", {
      class: "meter" + (opts.size ? " meter-" + opts.size : ""),
      role: "meter", "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100,
      "aria-label": opts.label || opts.aria || "progress",
      title: opts.title || (opts.total !== undefined ? opts.done + " of " + opts.total : pct + "%")
    }, [
      head,
      el("div", { class: "meter-track" }, [
        el("div", { class: "meter-fill" + (full ? " is-full" : ""), style: "width:" + pct + "%" })
      ])
    ]);
  };

  /* ---- stat tile ------------------------------------------------------- */
  R.tile = function (opts) {
    return el("div", { class: "tile" }, [
      el("div", { class: "tile-label", text: opts.label }),
      el("div", { class: "tile-value" }, [
        String(opts.value),
        opts.unit ? el("small", { text: " " + opts.unit }) : null
      ]),
      opts.foot ? el("div", { class: "tile-foot", html: opts.foot }) : null,
      opts.meter ? R.meter(opts.meter) : null
    ]);
  };

  /* ---- markdown block tree -------------------------------------------- */
  R.blocks = function (list, opts) {
    opts = opts || {};
    var out = U.frag(null);
    (list || []).forEach(function (b) {
      out.appendChild(R.block(b, opts));
    });
    return out;
  };

  R.block = function (b, opts) {
    opts = opts || {};
    switch (b.type) {
      case "heading":
        var lvl = Math.min(5, Math.max(3, (b.level || 3) + (opts.shift || 0)));
        return el("h" + lvl, { id: b.id, html: b.html });
      case "para":
        return el("p", { html: b.html });
      case "code":
        return el("pre", {}, [el("code", { text: b.text })]);
      case "quote":
        return el("blockquote", {}, [R.blocks(b.blocks, opts)]);
      case "list":
        var tag = b.ordered ? "ol" : "ul";
        return el(tag, {}, b.items.map(function (it) { return el("li", { html: it.html }); }));
      case "checklist":
        return el("ul", {}, b.items.map(function (it) { return el("li", { html: it.html }); }));
      case "table":
        return R.table(b);
      default:
        return el("div", { html: b.html || "" });
    }
  };

  R.table = function (b) {
    var thead = b.head && b.head.length
      ? el("thead", {}, [el("tr", {}, b.head.map(function (h) { return el("th", { html: h }); }))])
      : null;
    var tbody = el("tbody", {}, b.rows.map(function (r) {
      return el("tr", {}, r.map(function (c) { return el("td", { html: c }); }));
    }));
    return el("div", { class: "tablewrap" }, [el("table", { class: "tbl" }, [thead, tbody])]);
  };

  /* ---- checkable row (question banks, checklists) ---------------------- */
  R.checkRow = function (opts) {
    var id = opts.id;
    var done = S.isDone(id);
    var input = el("input", {
      type: "checkbox", class: "check", checked: done,
      "aria-label": opts.aria || opts.text || "done",
      onchange: function () {
        S.toggle(id);
        row.classList.toggle("is-done", S.isDone(id));
        if (opts.onToggle) opts.onToggle(S.isDone(id));
      }
    });
    var row = el("div", { class: "qrow" + (done ? " is-done" : "") }, [
      opts.n !== undefined ? el("span", { class: "qrow-n", text: opts.n }) : null,
      input,
      el("label", { class: "qrow-text qrow-lab", html: opts.html || U.esc(opts.text) })
    ]);
    row.querySelector("label").addEventListener("click", function () { input.click(); });
    return row;
  };

  /* ---- problem chip --------------------------------------------------- */
  R.chip = function (opts) {
    var id = opts.id, done = S.isDone(id);
    var input = el("input", {
      type: "checkbox", class: "check", checked: done, tabindex: "-1",
      "aria-label": opts.text
    });
    var chip = el("label", {
      class: "chip" + (done ? " is-done" : ""), title: opts.text,
      onclick: function (e) {
        if (e.target !== input) { e.preventDefault(); input.checked = !input.checked; }
        S.setDone(id, input.checked);
        S.emit("toggle");
        chip.classList.toggle("is-done", input.checked);
        if (opts.onToggle) opts.onToggle(input.checked);
      }
    }, [input, el("span", { class: "chip-t", text: opts.text })]);
    return chip;
  };

  /* ---- section head --------------------------------------------------- */
  R.sectionHead = function (title, note, extra) {
    return el("div", { class: "section-head" }, [
      el("h2", { class: "section-title", text: title }),
      note ? el("span", { class: "section-note", html: note }) : null,
      extra || null
    ]);
  };

  R.pageHead = function (title, sub, aside) {
    return el("div", { class: "page-head" }, [
      el("div", { class: "row", style: "align-items:flex-start" }, [
        el("div", { style: "flex:1;min-width:0" }, [
          el("h1", { class: "page-title", text: title }),
          sub ? el("p", { class: "page-sub", html: sub }) : null
        ]),
        aside || null
      ])
    ]);
  };

  R.empty = function (msg) { return el("div", { class: "empty", html: msg }); };

  /* ---- tier tag ------------------------------------------------------- */
  R.tierTag = function (tier) {
    var t = String(tier || "");
    var cls = /1/.test(t) ? "tag-t1" : /2/.test(t) ? "tag-t2" : /3/.test(t) ? "tag-t3" : "tag-t4";
    return el("span", { class: "tag " + cls, text: t });
  };

  /* ---- note editor ---------------------------------------------------- */
  R.noteBox = function (key, placeholder) {
    var ta = el("textarea", {
      class: "inp", rows: 3, placeholder: placeholder || "Notes…",
      oninput: U.debounce(function () { S.note(key, ta.value); }, 350)
    });
    ta.value = S.note(key);
    return el("div", { class: "notebox" }, [
      el("div", { class: "blk-sublabel", text: "Your notes" }), ta
    ]);
  };

  window.R = R;
})();
