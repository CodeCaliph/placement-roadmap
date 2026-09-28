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

  /* ---- practice links -------------------------------------------------- */
  R.links = function (item, opts) {
    opts = opts || {};
    if (!item || (!item.lc && !item.gfg)) return null;
    var wrap = el("span", { class: "plinks" + (opts.tight ? " tight" : "") });
    function stop(e) { e.stopPropagation(); }
    if (item.lc) {
      wrap.appendChild(el("a", {
        class: "plink lc", href: item.lc, target: "_blank", rel: "noopener",
        title: (item.lcSearch ? "Find on LeetCode: " : "Open on LeetCode: ") + item.n,
        "aria-label": "LeetCode: " + item.n,
        onclick: stop, text: "LC"
      }));
    }
    if (item.gfg) {
      wrap.appendChild(el("a", {
        class: "plink gfg", href: item.gfg, target: "_blank", rel: "noopener",
        title: "Find on GeeksforGeeks: " + item.n,
        "aria-label": "GeeksforGeeks: " + item.n,
        onclick: stop, text: "GfG"
      }));
    }
    return wrap;
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
    var noteBtn = opts.noteKey ? el("button", {
      class: "qrow-note", type: "button",
      onclick: function () { setNoteOpen(!noteOpen, true); }
    }) : null;
    var row = el("div", { class: "qrow" + (done ? " is-done" : "") }, [
      opts.n !== undefined ? el("span", { class: "qrow-n", text: opts.n }) : null,
      input,
      el("label", { class: "qrow-text qrow-lab", html: opts.html || U.esc(opts.text) }),
      opts.item ? R.links(opts.item) : null,
      noteBtn
    ]);
    row.querySelector("label").addEventListener("click", function () { input.click(); });
    if (!opts.noteKey) return row;

    /* ---- optional per-row notes: ✎ toggles an editor, a saved note shows as a preview ---- */
    var wrap = el("div", { class: "qitem" }, [row]);
    var noteOpen = false, panel = null, preview = null;

    function paintNote() {
      var text = S.note(opts.noteKey);
      noteBtn.textContent = text ? "✎ Note" : "✎";
      noteBtn.classList.toggle("has", !!text);
      noteBtn.title = noteOpen ? "Close note" : (text ? "Edit your note" : "Add a note");
      noteBtn.setAttribute("aria-expanded", noteOpen ? "true" : "false");
      noteBtn.setAttribute("aria-label", (text ? "Edit note: " : "Add note: ") + (opts.text || ""));
      if (preview) { wrap.removeChild(preview); preview = null; }
      if (text && !noteOpen) {
        preview = el("button", {
          class: "qnote-preview", type: "button", title: "Edit note",
          onclick: function () { setNoteOpen(true, true); }
        }, [el("span", { "aria-hidden": "true", text: "✎ " }), R.noteSnippet(text)]);
        wrap.appendChild(preview);
      }
    }
    function setNoteOpen(on, focus) {
      noteOpen = on;
      if (on && !panel) {
        panel = el("div", { class: "qnote-panel" }, [
          R.noteBox(opts.noteKey, opts.notePlaceholder || "Approach, edge cases, where you got stuck, links…", {
            rows: 2, autofocus: focus, onChange: function () { paintNote(); }
          })
        ]);
        wrap.appendChild(panel);
      } else if (!on && panel) {
        var ta = panel.querySelector("textarea");
        if (ta) ta.blur();                     // flushes any pending save
        wrap.removeChild(panel);
        panel = null;
      }
      paintNote();
    }
    paintNote();
    return wrap;
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
    if (opts.item) chip.appendChild(R.links(opts.item, { tight: true }));
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
  /* opts: { label, rows, onChange(value), autofocus }
     Autosaves while typing, saves immediately on blur, and grows with its content. */
  R.noteBox = function (key, placeholder, opts) {
    opts = opts || {};
    var status = el("span", { class: "notebox-status", "aria-live": "polite" });
    var last = S.note(key);
    var statusTimer = null;

    function grow() {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight + 2, 480) + "px";
    }
    function commit() {
      var v = ta.value.replace(/\s+$/, "");
      if (v === last) return;
      last = v;
      S.note(key, v);
      status.textContent = v ? "Saved" : "Cleared";
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { status.textContent = ""; }, 1600);
      if (opts.onChange) opts.onChange(v);
    }
    var save = U.debounce(commit, 350);

    var ta = el("textarea", {
      class: "inp notebox-ta", rows: opts.rows || 3, placeholder: placeholder || "Notes…",
      "aria-label": opts.label || "Your notes",
      oninput: function () { grow(); save(); },
      onblur: commit
    });
    ta.value = last;
    if (last) setTimeout(grow, 0);
    if (opts.autofocus) setTimeout(function () { ta.focus(); }, 0);

    return el("div", { class: "notebox" }, [
      el("div", { class: "notebox-head" }, [
        el("span", { class: "blk-sublabel", text: opts.label || "Your notes" }),
        status
      ]),
      ta
    ]);
  };

  /* first line of a note, trimmed for one-line previews */
  R.noteSnippet = function (text, max) {
    var s = String(text || "").replace(/\s+/g, " ").trim();
    max = max || 110;
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
  };

  window.R = R;
})();
