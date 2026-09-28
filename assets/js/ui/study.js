/* ==========================================================================
   ui/study.js — "Study it here" lessons attached to 60-day-plan blocks.

   Data: window.STUDY = { lessons: { id: lesson }, blocks: { blockId: [lessonId] } }
         from assets/js/data/study/*.js. A lesson is:
           { id, subject, title, minutes, crux: [html], sections: [{ h, blocks }],
             practice: [{ q, a }], related: ["<coreSubject>:<questionId>"] }
         Section blocks use the same format as core-subject answers and are
         rendered by the shared DOC renderer (views/core.js).

   UI:   a dropdown under each block (crux → sections → self-check → related),
         and a distraction-free full-screen reader with a table of contents.
   State: "studied" is a normal tick in the done-set: sl:<lessonId>.
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el;
  var SUBJ = {
    oops:     { label: "OOP",           icon: "◇" },
    java:     { label: "Java",          icon: "☕" },
    os:       { label: "OS",            icon: "⚙" },
    dbms:     { label: "DBMS",          icon: "▦" },
    sql:      { label: "SQL",           icon: "⌗" },
    cn:       { label: "Networks",      icon: "⇄" },
    lld:      { label: "LLD",           icon: "▣" },
    hld:      { label: "System Design", icon: "☁" },
    career:   { label: "Interview prep", icon: "✦" },
    aptitude: { label: "Aptitude",      icon: "∑" }
  };

  /* ---- generated revision sheets ---------------------------------------
     "One-page condensed sheets" blocks get a lesson built from the crux of
     every lesson in those subjects, so it can never drift from the lessons. */
  function buildCruxSheet(id, title, subjects, blockIds) {
    var ST = window.STUDY;
    if (!ST) return;
    var all = Object.keys(ST.lessons).map(function (k) { return ST.lessons[k]; });
    var sections = subjects.map(function (sid) {
      var ls = all.filter(function (l) { return l.subject === sid && l.crux && !l.generated; });
      if (!ls.length) return null;
      var blocks = [];
      ls.forEach(function (l) {
        blocks.push({ h: l.title });
        blocks.push({ ul: l.crux.slice() });
      });
      return { h: (SUBJ[sid] || { label: sid }).label + " — " + ls.length + " lessons", blocks: blocks };
    }).filter(Boolean);
    if (!sections.length) return;
    var bullets = sections.reduce(function (a, s) { return a + s.blocks.filter(function (b) { return b.ul; }).reduce(function (x, b) { return x + b.ul.length; }, 0); }, 0);
    ST.lessons[id] = {
      id: id, subject: subjects[0], title: title, generated: true,
      minutes: Math.max(20, Math.round(bullets * 0.6)),
      crux: [
        "Every bullet below is the <b>crux</b> of one lesson you studied — read each one and say the detail behind it out loud.",
        "Anything you can't expand on in 30 seconds: open that lesson from the plan (search it with <b>Ctrl K</b>) and redo its <b>Check yourself</b> questions.",
        "Print this (Ctrl P) or keep it open on your phone for the 20 minutes before an interview."
      ],
      sections: sections,
      practice: [],
      related: []
    };
    blockIds.forEach(function (b) { (ST.blocks[b] = ST.blocks[b] || []).unshift(id); });
  }
  buildCruxSheet("sheet-core-cs", "One-page crux sheet: OS, DBMS, SQL, Networks, OOP",
    ["os", "dbms", "sql", "cn", "oops", "java"], ["d54-ni", "d59-af"]);
  buildCruxSheet("sheet-design", "One-page crux sheet: LLD & System Design",
    ["lld", "hld"], ["d59-af"]);

  /* per-session UI memory: which dropdowns are open, which tab is active */
  var ui = { open: {}, tab: {}, sec: {}, ans: {} };

  function data() { return window.STUDY || { lessons: {}, blocks: {} }; }
  function lesson(id) { return data().lessons[id] || null; }
  function lessonsFor(blockId) {
    return (data().blocks[blockId] || []).map(lesson).filter(Boolean)
      .filter(function (l, i, a) { return a.indexOf(l) === i; });   // de-dupe
  }
  function subj(l) { return SUBJ[l.subject] || { label: l.subject, icon: "◆" }; }
  function doneId(l) { return "sl:" + l.id; }
  function studied(l) { return S.isDone(doneId(l)); }
  function setStudied(l, on) { S.setDone(doneId(l), on); S.emit("toggle"); }
  function mins(n) { return n >= 60 ? (Math.floor(n / 60) + " h" + (n % 60 ? " " + (n % 60) + " min" : "")) : n + " min"; }

  /* where a lesson is first used in the plan — for search results and deep links */
  var firstUse = null;
  function whereUsed(id) {
    if (!firstUse) {
      firstUse = {};
      (window.HANDBOOK && HANDBOOK.days || []).forEach(function (d) {
        (d.blocks || []).forEach(function (b) {
          (data().blocks[b.id] || []).forEach(function (lid) {
            if (!firstUse[lid]) firstUse[lid] = { day: d.day, slot: b.slot, blockId: b.id };
          });
        });
      });
    }
    return firstUse[id] || null;
  }

  function coreLink(ref) {
    var p = ref.split(":"), sid = p[0], qid = p.slice(1).join(":");
    var sub = (window.CORE || []).filter(function (s) { return s.id === sid; })[0];
    var q = sub && sub.questions.filter(function (x) { return x.id === qid; })[0];
    if (!q) return null;
    return { sub: sub, q: q, hash: "#/core/" + sid + "/" + qid };
  }

  /* ---- pieces shared by the inline panel and the reader --------------- */
  function cruxBox(l) {
    return el("div", { class: "st-crux" }, [
      el("div", { class: "st-crux-k" }, [el("span", { "aria-hidden": "true", text: "◎ " }), "The crux"]),
      el("ul", {}, (l.crux || []).map(function (c) { return el("li", { html: c }); }))
    ]);
  }

  function practiceBox(l, prefix) {
    if (!(l.practice || []).length) return null;
    var items = l.practice.map(function (p, i) {
      var k = prefix + ":" + l.id + ":" + i;
      var ans = el("div", { class: "st-ans doc", html: p.a });
      var btn = el("button", { class: "btn btn-sm st-reveal", type: "button" });
      function paint() {
        var on = !!ui.ans[k];
        ans.hidden = !on;
        btn.textContent = on ? "Hide answer" : "Show answer";
        btn.setAttribute("aria-expanded", on ? "true" : "false");
      }
      btn.onclick = function () { ui.ans[k] = !ui.ans[k]; paint(); };
      paint();
      return el("li", { class: "st-pq" }, [
        el("div", { class: "st-pq-q doc", html: p.q }),
        btn, ans
      ]);
    });
    return el("div", { class: "st-practice" }, [
      el("div", { class: "st-h3" }, ["Check yourself ", el("span", { class: "st-count", text: String(items.length) })]),
      el("p", { class: "small muted", style: "margin:0 0 10px", text: "Answer out loud or on paper first, then reveal." }),
      el("ol", { class: "st-pqs" }, items)
    ]);
  }

  function relatedBox(l) {
    var links = (l.related || []).map(coreLink).filter(Boolean);
    if (!links.length) return null;
    return el("div", { class: "st-related" }, [
      el("div", { class: "st-h3" }, ["Interview questions on this ", el("span", { class: "st-count", text: String(links.length) })]),
      el("div", { class: "st-rel-list" }, links.map(function (x) {
        return el("a", {
          class: "st-rel", href: x.hash,
          onclick: function () { closeReader(); }
        }, [
          el("span", { class: "st-rel-k", text: x.sub.short }),
          el("span", { class: "st-rel-t", text: x.q.q }),
          el("span", { class: "st-rel-go", "aria-hidden": "true", text: "→" })
        ]);
      }))
    ]);
  }

  function studiedButton(l, onChange) {
    var b = el("button", { class: "btn btn-sm st-done-btn", type: "button" });
    function paint() {
      var on = studied(l);
      b.textContent = on ? "✓ Studied" : "Mark as studied";
      b.classList.toggle("btn-primary", !on);
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.title = on ? "Click to unmark" : "Tick when you could teach this to someone";
    }
    b.onclick = function () { setStudied(l, !studied(l)); paint(); if (onChange) onChange(); };
    paint();
    return b;
  }

  /* ---- a lesson inside the block dropdown ------------------------------ */
  function inlineLesson(l, ctx) {
    var s = subj(l);
    var root = el("div", { class: "st-lesson" });

    root.appendChild(el("div", { class: "st-lhead" }, [
      el("div", { class: "st-lmeta" }, [
        el("span", { class: "st-subj", dataset: { subj: l.subject } }, [s.icon + " " + s.label]),
        el("span", { class: "st-mins", text: "~" + mins(l.minutes || 30) }),
        (l.sections || []).length ? el("span", { class: "st-mins", text: l.sections.length + " parts" }) : null
      ]),
      el("h3", { class: "st-title", text: l.title })
    ]));

    root.appendChild(cruxBox(l));

    /* the detail, as an accordion: short on phones, easy to scan on desktop */
    var secs = el("div", { class: "st-secs" });
    (l.sections || []).forEach(function (sec, i) {
      var k = l.id + ":" + i;
      var body = null;
      var head = el("button", { class: "st-sec-head", type: "button" }, [
        el("span", { class: "st-sec-n tnum", text: String(i + 1) }),
        el("span", { class: "st-sec-t", text: sec.h }),
        el("span", { class: "st-sec-caret", "aria-hidden": "true", text: "›" })
      ]);
      var wrap = el("div", { class: "st-sec" }, [head]);
      function paint() {
        var on = !!ui.sec[k];
        wrap.classList.toggle("is-open", on);
        head.setAttribute("aria-expanded", on ? "true" : "false");
        if (on && !body) { DOC.ensureDefs(); body = el("div", { class: "st-sec-body" }, [DOC.render(sec.blocks, l.id)]); wrap.appendChild(body); }
        else if (!on && body) { wrap.removeChild(body); body = null; }
      }
      head.onclick = function () { ui.sec[k] = !ui.sec[k]; paint(); };
      paint();
      secs.appendChild(wrap);
    });
    root.appendChild(el("div", { class: "st-secs-head" }, [
      el("span", { class: "st-h3", text: "Go deeper" }),
      el("span", { style: "flex:1" }),
      el("button", {
        class: "btn btn-sm btn-ghost", type: "button", text: "Open all",
        onclick: function () { (l.sections || []).forEach(function (_, i) { ui.sec[l.id + ":" + i] = true; }); ctx.repaint(); }
      }),
      el("button", {
        class: "btn btn-sm", type: "button", text: "⤢ Read full screen",
        onclick: function () { openReader(ctx.lessons, ctx.lessons.indexOf(l)); }
      })
    ]));
    root.appendChild(secs);

    U.append(root, [practiceBox(l, "in"), relatedBox(l)]);   // either may be null (aptitude has no core links)

    root.appendChild(el("div", { class: "st-foot" }, [
      studiedButton(l, ctx.refreshHead),
      el("span", { style: "flex:1" }),
      el("button", {
        class: "btn btn-sm btn-ghost", type: "button", text: "⧉ Copy link",
        onclick: function () {
          var w = ctx.day ? ctx.day.day : (whereUsed(l.id) || {}).day;
          var url = location.href.split("#")[0] + "#/plan/" + w + "/study/" + l.id;
          (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
            .then(function () { U.toast("Link copied", "good"); }, function () { U.toast(url); });
        }
      })
    ]));
    return root;
  }

  /* ---- the dropdown under a plan block --------------------------------- */
  function panel(block, day, opts) {
    var list = lessonsFor(block.id);
    if (!list.length) return null;
    opts = opts || {};
    if (opts.focusLesson && list.some(function (l) { return l.id === opts.focusLesson; })) {
      ui.open[block.id] = true;
      ui.tab[block.id] = opts.focusLesson;
    }

    var wrap = el("div", { class: "st", id: "study-" + block.id });
    var total = list.reduce(function (a, l) { return a + (l.minutes || 30); }, 0);
    var countEl = el("span", { class: "st-tg-count tnum" });
    var toggle = el("button", { class: "st-toggle", type: "button" }, [
      el("span", { class: "st-tg-ico", "aria-hidden": "true", text: "📖" }),
      el("span", { class: "st-tg-main" }, [
        el("b", { text: "Study this here" }),
        el("span", { class: "st-tg-sub", text: list.length === 1 ? list[0].title : list.length + " lessons: " + list.map(function (l) { return subj(l).label; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(" · ") })
      ]),
      /* a total time only means something for a short set; revision blocks are pick-and-choose */
      el("span", { class: "st-tg-meta" }, [countEl, el("span", { class: "st-tg-mins", text: list.length <= 3 ? "~" + mins(total) : "pick what you need" })]),
      el("span", { class: "st-tg-caret", "aria-hidden": "true", text: "›" })
    ]);
    var body = el("div", { class: "st-body" });
    wrap.appendChild(toggle);
    wrap.appendChild(body);

    var ctx = { lessons: list, day: day, repaint: paint, refreshHead: refreshCount };

    function refreshCount() {
      var n = list.filter(studied).length;
      countEl.textContent = n + "/" + list.length + " studied";
      countEl.classList.toggle("is-all", n === list.length);
    }

    function paint() {
      var open = !!ui.open[block.id];
      wrap.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      U.clear(body);
      refreshCount();
      if (!open) return;
      DOC.ensureDefs();
      var active = lesson(ui.tab[block.id]);
      if (!active || list.indexOf(active) < 0) active = list.filter(function (l) { return !studied(l); })[0] || list[0];
      ui.tab[block.id] = active.id;

      if (list.length > 6) {
        /* revision blocks carry many lessons: a grouped picker beats a wall of chips */
        var groups = {};
        list.forEach(function (l) { (groups[l.subject] = groups[l.subject] || []).push(l); });
        var pick = el("select", {
          class: "inp st-pick", "aria-label": "Choose a lesson",
          onchange: function () { ui.tab[block.id] = pick.value; paint(); }
        }, Object.keys(groups).map(function (g) {
          return el("optgroup", { label: (SUBJ[g] || { label: g }).label }, groups[g].map(function (l) {
            return el("option", { value: l.id, selected: l === active, text: (studied(l) ? "✓ " : "") + l.title });
          }));
        }));
        body.appendChild(el("div", { class: "st-pickrow" }, [
          el("span", { class: "st-h3", text: list.length + " lessons to revise" }),
          pick,
          el("span", { class: "tiny muted tnum", text: list.filter(studied).length + " studied" })
        ]));
      } else if (list.length > 1) {
        body.appendChild(el("div", { class: "st-tabs", role: "tablist" }, list.map(function (l) {
          return el("button", {
            class: "st-tab" + (studied(l) ? " is-done" : ""), role: "tab", type: "button",
            "aria-selected": l === active ? "true" : "false",
            onclick: function () { ui.tab[block.id] = l.id; paint(); }
          }, [
            el("span", { class: "st-tab-s", text: subj(l).label }),
            el("span", { class: "st-tab-t", text: l.title }),
            studied(l) ? el("span", { class: "st-tab-ok", "aria-label": "studied", text: "✓" }) : null
          ]);
        })));
      }
      body.appendChild(inlineLesson(active, ctx));

      var i = list.indexOf(active);
      if (list.length > 1) {
        body.appendChild(el("div", { class: "st-nav" }, [
          i > 0 ? el("button", { class: "btn btn-sm btn-ghost", type: "button", text: "← " + list[i - 1].title, onclick: function () { ui.tab[block.id] = list[i - 1].id; paint(); scrollTo(wrap); } }) : el("span"),
          i < list.length - 1 ? el("button", { class: "btn btn-sm", type: "button", text: "Next: " + list[i + 1].title + " →", onclick: function () { ui.tab[block.id] = list[i + 1].id; paint(); scrollTo(wrap); } }) : null
        ]));
      }
    }
    toggle.onclick = function () {
      ui.open[block.id] = !ui.open[block.id];
      paint();
      if (!ui.open[block.id]) scrollTo(wrap, true);
    };
    paint();
    return wrap;
  }

  function scrollTo(node, onlyIfAbove) {
    var r = node.getBoundingClientRect();
    if (onlyIfAbove && r.top >= 60) return;
    window.scrollTo({ top: window.scrollY + r.top - 70, behavior: "smooth" });
  }

  /* ---- full-screen reader ---------------------------------------------- */
  var reader = null;

  function closeReader() {
    if (!reader) return;
    document.removeEventListener("keydown", reader.onKey, true);
    if (reader.scrim.parentNode) reader.scrim.parentNode.removeChild(reader.scrim);
    document.body.classList.remove("no-scroll");
    var after = reader.after;
    reader = null;
    if (after) after();
  }

  function openReader(list, index, after) {
    if (!list || !list.length) return;
    closeReader();
    DOC.ensureDefs();
    var i = Math.max(0, Math.min(index || 0, list.length - 1));

    var scroller = el("div", { class: "rd-scroll" });
    var bar = el("i");
    var scrim = el("div", { class: "scrim rd-scrim", onclick: function (e) { if (e.target === scrim) closeReader(); } });
    var box = el("div", { class: "rd", role: "dialog", "aria-modal": "true" });
    scrim.appendChild(box);

    function render() {
      var l = list[i], s = subj(l);
      box.setAttribute("aria-label", l.title);
      U.clear(box);

      var tocLinks = [];
      var toc = el("nav", { class: "rd-toc", "aria-label": "Contents" }, [
        el("div", { class: "rd-toc-k", text: "Contents" }),
        el("ol", {}, [["crux", "The crux"]].concat((l.sections || []).map(function (sec, si) { return ["s" + si, sec.h]; }))
          .concat((l.practice || []).length ? [["practice", "Check yourself"]] : [])
          .map(function (t) {
            var a = el("a", { href: "#", text: t[1], dataset: { target: t[0] }, onclick: function (e) {
              e.preventDefault();
              var n = scroller.querySelector('[data-anchor="' + t[0] + '"]');
              if (n) scroller.scrollTo({ top: n.offsetTop - 12, behavior: "smooth" });
            } });
            tocLinks.push(a);
            return el("li", {}, [a]);
          }))
      ]);
      var jump = el("select", { class: "inp rd-jump", "aria-label": "Jump to section", onchange: function () {
        var n = scroller.querySelector('[data-anchor="' + jump.value + '"]');
        if (n) scroller.scrollTo({ top: n.offsetTop - 12, behavior: "smooth" });
      } }, [["crux", "The crux"]].concat((l.sections || []).map(function (sec, si) { return ["s" + si, (si + 1) + ". " + sec.h]; }))
        .concat((l.practice || []).length ? [["practice", "Check yourself"]] : [])
        .map(function (t) { return el("option", { value: t[0], text: t[1] }); }));

      var head = el("div", { class: "rd-head" }, [
        el("div", { class: "rd-head-main" }, [
          el("span", { class: "st-subj", dataset: { subj: l.subject } }, [s.icon + " " + s.label]),
          el("span", { class: "rd-head-t", text: l.title })
        ]),
        list.length > 1 ? el("span", { class: "tiny muted tnum nowrap", text: (i + 1) + " / " + list.length }) : null,
        el("button", { class: "iconbtn", type: "button", title: "Close (Esc)", "aria-label": "Close", text: "✕", onclick: closeReader }),
        el("div", { class: "rd-progress" }, [bar])
      ]);

      var content = el("article", { class: "rd-content" }, [
        el("div", { class: "rd-kicker" }, [
          el("span", { text: "~" + mins(l.minutes || 30) + " read + practice" }),
          studied(l) ? el("span", { class: "tag tag-good", text: "✓ studied" }) : null
        ]),
        el("h1", { class: "rd-title", text: l.title }),
        jump,
        el("div", { dataset: { anchor: "crux" } }, [cruxBox(l)])
      ]);
      (l.sections || []).forEach(function (sec, si) {
        content.appendChild(el("section", { class: "rd-sec", dataset: { anchor: "s" + si } }, [
          el("h2", { class: "rd-sec-h" }, [el("span", { class: "st-sec-n tnum", text: String(si + 1) }), sec.h]),
          DOC.render(sec.blocks, l.id)
        ]));
      });
      var pr = practiceBox(l, "rd");
      if (pr) { pr.dataset.anchor = "practice"; content.appendChild(pr); }
      var rel = relatedBox(l);
      if (rel) content.appendChild(rel);
      content.appendChild(el("div", { class: "rd-end" }, [
        studiedButton(l, function () { render(); }),
        el("span", { style: "flex:1" }),
        i > 0 ? el("button", { class: "btn btn-sm btn-ghost", type: "button", text: "← Previous", onclick: function () { i--; render(); scroller.scrollTop = 0; } }) : null,
        i < list.length - 1 ? el("button", { class: "btn btn-sm btn-primary", type: "button", text: "Next lesson →", onclick: function () { i++; render(); scroller.scrollTop = 0; } }) : null
      ]));

      U.clear(scroller);
      scroller.appendChild(el("div", { class: "rd-grid" }, [toc, content]));
      box.appendChild(head);
      box.appendChild(scroller);

      /* reading progress + current-section highlight */
      scroller.onscroll = function () {
        var max = scroller.scrollHeight - scroller.clientHeight;
        bar.style.width = (max > 0 ? Math.min(100, scroller.scrollTop / max * 100) : 100) + "%";
        var cur = "crux";
        U.$$("[data-anchor]", scroller).forEach(function (n) { if (n.offsetTop - 40 <= scroller.scrollTop) cur = n.dataset.anchor; });
        tocLinks.forEach(function (a) { a.classList.toggle("on", a.dataset.target === cur); });
        if (jump.value !== cur) jump.value = cur;
      };
      scroller.onscroll();
    }

    function onKey(e) {
      if (e.key === "Escape") { e.stopPropagation(); closeReader(); return; }
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || "");
      if (typing) return;
      if (e.key === "ArrowRight" && e.altKey && i < list.length - 1) { i++; render(); scroller.scrollTop = 0; }
      if (e.key === "ArrowLeft" && e.altKey && i > 0) { i--; render(); scroller.scrollTop = 0; }
    }

    reader = { scrim: scrim, onKey: onKey, after: after };
    scroller.tabIndex = -1;
    document.body.appendChild(scrim);
    document.body.classList.add("no-scroll");
    document.addEventListener("keydown", onKey, true);
    render();
    scroller.focus({ preventScroll: true });
  }

  /* ---- public API -------------------------------------------------------- */
  window.STUDYUI = {
    SUBJECTS: SUBJ,
    lessonsFor: lessonsFor,
    lesson: lesson,
    panel: panel,
    openReader: function (ids, i, after) { openReader(ids.map(lesson).filter(Boolean), i, after); },
    studied: function (id) { var l = lesson(id); return l ? studied(l) : false; },
    whereUsed: whereUsed,
    all: function () { var L = data().lessons; return Object.keys(L).map(function (k) { return L[k]; }); },
    stats: function () {
      var all = window.STUDYUI.all().filter(function (l) { return !l.generated; });   // sheets are derived, not lessons
      return { total: all.length, done: all.filter(studied).length };
    },
    /* plain text of a lesson, for search */
    text: function (l) {
      var parts = [l.title].concat(l.crux || []);
      (l.sections || []).forEach(function (s) {
        parts.push(s.h);
        (s.blocks || []).forEach(function (b) {
          ["p", "h", "tip", "warn"].forEach(function (k) { if (b[k]) parts.push(b[k]); });
          (b.ul || b.ol || []).forEach(function (x) { parts.push(x); });
        });
      });
      return parts.join(" ").replace(/<[^>]+>/g, " ");
    }
  };
})();
