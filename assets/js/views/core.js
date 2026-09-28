/* ==========================================================================
   views/core.js — Core CS subjects: the most-asked interview questions with
   full answers, code, and diagrams. Each question can be marked mastered
   (a normal tick in the done-set) or starred for revision, and any filtered
   set can be drilled as flashcards.

   Data: window.CORE — one assets/js/data/core/<id>.js file per subject.
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el;
  var LEVELS = { 1: "Basic", 2: "Intermediate", 3: "Advanced" };
  var LANGS = { cpp: "C++", c: "C", java: "Java", python: "Python", sql: "SQL", bash: "Shell", text: "Text" };

  var ui = {
    sub: null, focus: null,       // subject id, question to open + scroll to
    q: "", scope: "top", status: "all", level: 0, topic: "",
    open: {}                      // "<sub>:<qid>" -> true
  };

  function subjects() { return window.CORE || []; }
  function subjectById(id) {
    var list = subjects();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function key(sub, q) { return sub.id + ":" + q.id; }

  /* ---- state ------------------------------------------------------------ */
  var C = {
    id: function (sub, q) { return S.ids.core(sub.id, q.id); },
    mastered: function (sub, q) { return S.isDone(C.id(sub, q)); },
    starred: function (sub, q) { return !!S.state().coreStar[key(sub, q)]; },
    star: function (sub, q, on) {
      var s = S.state().coreStar;
      if (on) s[key(sub, q)] = new Date().toISOString(); else delete s[key(sub, q)];
      S.emit("core-star");
    },
    master: function (sub, q, on) { S.setDone(C.id(sub, q), on); S.emit("toggle"); },
    progress: function (sub, onlyTop) {
      var list = sub.questions.filter(function (q) { return !onlyTop || q.top; });
      var done = list.filter(function (q) { return C.mastered(sub, q); }).length;
      return { done: done, total: list.length, pct: U.pct(done, list.length) };
    },
    starCount: function (sub) {
      return sub.questions.filter(function (q) { return C.starred(sub, q); }).length;
    }
  };

  /* ---- syntax highlighting (small, dependency-free) --------------------- */
  var C_KW = "auto break case char const continue default do double else enum extern float for goto if inline int long " +
    "register return short signed sizeof static struct switch typedef union unsigned void volatile while NULL";
  var KW = {
    c: C_KW + " pid_t size_t pthread_t pthread_mutex_t sem_t FILE bool true false",
    cpp: C_KW + " alignas bool catch class constexpr const_cast decltype delete dynamic_cast explicit false final friend " +
      "mutable namespace new noexcept nullptr operator override private protected public reinterpret_cast static_cast " +
      "template this throw true try typename using virtual std string vector map unordered_map set list pair size_t " +
      "unique_ptr shared_ptr weak_ptr make_unique make_shared mutex thread cout cin endl",
    java: "abstract boolean break byte case catch char class continue default do double else enum extends final finally " +
      "float for if implements import instanceof int interface long new null package private protected public return " +
      "short static super switch synchronized this throw throws try void volatile while true false var String record",
    python: "and as assert async await break class continue def del elif else except False finally for from global if " +
      "import in is lambda None nonlocal not or pass raise return self True try while with yield print",
    sql: "select from where and or not in is null as join inner left right full outer cross on group by order having " +
      "limit offset distinct union all insert into values update set delete create table alter drop index view primary " +
      "key foreign references unique check default case when then else end exists between like count sum avg min max " +
      "over partition rank dense_rank row_number lag lead with recursive coalesce ifnull nullif asc desc begin commit " +
      "rollback transaction grant revoke truncate top if rows range preceding following current row unbounded " +
      "int integer varchar char date decimal numeric text boolean serial cast extract interval year month day",
    bash: "if then else elif fi for in do done while case esac function echo export cd sudo git ls grep cat chmod chown " +
      "mkdir rm cp mv find ps kill top df du tail head curl docker"
  };
  var KWSET = {};
  Object.keys(KW).forEach(function (l) {
    KWSET[l] = {};
    KW[l].split(" ").forEach(function (w) { KWSET[l][l === "sql" ? w.toLowerCase() : w] = 1; });
  });

  function tokenRe(lang) {
    var com = (lang === "python" || lang === "bash") ? "#.*"
      : lang === "sql" ? "--.*|\\/\\*[\\s\\S]*?\\*\\/"
      : "\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/";
    var pre = (lang === "c" || lang === "cpp") ? "^[ \\t]*#[ \\t]*\\w+.*$" : "(?!x)x";
    return new RegExp(
      "(" + com + ")" +
      "|(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')" +
      "|(" + pre + ")" +
      "|(\\b\\d+(?:\\.\\d+)?[fFlLuU]*\\b)" +
      "|([A-Za-z_]\\w*)", "gm");
  }

  function highlight(src, lang) {
    if (!KWSET[lang]) return U.esc(src);
    var re = tokenRe(lang), out = "", last = 0, m;
    while ((m = re.exec(src))) {
      if (!m[0]) { re.lastIndex++; continue; }
      out += U.esc(src.slice(last, m.index));
      var t = U.esc(m[0]), cls = null;
      if (m[1]) cls = "c-com";
      else if (m[2]) cls = "c-str";
      else if (m[3]) cls = "c-pre";
      else if (m[4]) cls = "c-num";
      else if (m[5]) {
        var w = lang === "sql" ? m[5].toLowerCase() : m[5];
        if (KWSET[lang][w]) cls = "c-kw";
        else if (/^\s*\(/.test(src.slice(re.lastIndex, re.lastIndex + 40))) cls = "c-fn";
      }
      out += cls ? '<span class="' + cls + '">' + t + "</span>" : t;
      last = re.lastIndex;
    }
    return out + U.esc(src.slice(last));
  }

  /** Strip the leading newline and common indentation template literals carry. */
  function dedent(src) {
    var lines = String(src).replace(/\t/g, "    ").replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
    var min = Infinity;
    lines.forEach(function (l) { if (l.trim()) min = Math.min(min, l.match(/^ */)[0].length); });
    if (!isFinite(min) || !min) return lines.join("\n");
    return lines.map(function (l) { return l.slice(min); }).join("\n");
  }

  function copyText(text, what) {
    function ok() { U.toast((what || "Copied") + " to clipboard", "good"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else fallback();
    function fallback() {
      var ta = el("textarea", { style: "position:fixed;opacity:0" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) { U.toast("Could not copy", "bad"); }
      document.body.removeChild(ta);
    }
  }

  /* ---- answer blocks ---------------------------------------------------- */
  function codeBlock(b) {
    var variants = Array.isArray(b.code) ? b.code : [{ lang: b.lang || "text", src: b.code }];
    variants = variants.map(function (v) { return { lang: v.lang || "text", src: dedent(v.src || "") }; });
    var cur = 0;
    var codeEl = el("code");
    var tabs = variants.length > 1
      ? variants.map(function (v, i) {
          return el("button", {
            class: "code-tab", role: "tab", text: LANGS[v.lang] || v.lang,
            onclick: function () { show(i); }
          });
        })
      : [el("span", { class: "code-tab is-label", text: LANGS[variants[0].lang] || variants[0].lang })];

    function show(i) {
      cur = i;
      codeEl.innerHTML = highlight(variants[i].src, variants[i].lang);
      if (variants.length > 1) tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === i ? "true" : "false"); });
    }
    show(0);

    return el("div", { class: "code" }, [
      el("div", { class: "code-head" }, [
        el("div", { class: "code-tabs", role: variants.length > 1 ? "tablist" : null }, tabs),
        b.title ? el("span", { class: "code-title", text: b.title }) : null,
        el("button", {
          class: "code-copy", text: "Copy", title: "Copy code",
          onclick: function () { copyText(variants[cur].src, "Code copied"); }
        })
      ]),
      el("pre", { class: "code-pre" }, [codeEl])
    ]);
  }

  function diagram(b) {
    var box = el("div", { class: "dg-scroll", html: b.svg });
    var svg = box.querySelector("svg");
    if (svg) {
      var vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
      var w = Number(svg.getAttribute("width")) || vb[2] || 600;
      svg.removeAttribute("height");
      svg.setAttribute("role", "img");
      if (b.caption) svg.setAttribute("aria-label", b.caption);
      svg.style.width = w + "px";
      svg.style.minWidth = Math.min(w, 430) + "px";   // below this, scroll rather than shrink text away
    }
    return el("figure", { class: "dg-fig" }, [
      box,
      b.caption ? el("figcaption", { text: b.caption }) : null
    ]);
  }

  function callout(kind, label, html) {
    return el("div", { class: "callout callout-" + kind }, [
      el("div", { class: "callout-k", text: label }),
      el("div", { class: "callout-b", html: html })
    ]);
  }

  function block(b) {
    if (b.p != null) return el("p", { html: b.p });
    if (b.h) return el("h4", { text: b.h });
    if (b.ul) return el("ul", {}, b.ul.map(function (x) { return el("li", { html: x }); }));
    if (b.ol) return el("ol", {}, b.ol.map(function (x) { return el("li", { html: x }); }));
    if (b.table) return R.table({ head: b.table.head, rows: b.table.rows });
    if (b.code != null) return codeBlock(b);
    if (b.svg) return diagram(b);
    if (b.tip) return callout("tip", "Interview tip", b.tip);
    if (b.warn) return callout("warn", "Common trap", b.warn);
    return null;
  }

  function answer(q) {
    var out = el("div", { class: "doc cq-doc" });
    (q.a || []).forEach(function (b) {
      try { var n = block(b); if (n) out.appendChild(n); }
      catch (e) { console.error("core block", q.id, e); }
    });
    return out;
  }

  /* global arrowheads for every diagram — defined once, styled by theme */
  function ensureDefs() {
    if (document.getElementById("dg-defs")) return;
    var host = el("div", {
      id: "dg-defs", "aria-hidden": "true",
      style: "position:absolute;width:0;height:0;overflow:hidden",
      html:
        '<svg width="0" height="0"><defs>' +
        '<marker id="dg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0 0L10 5L0 10z" class="dg-ah"/></marker>' +
        '<marker id="dg-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0 0L10 5L0 10z" class="dg-ah-a"/></marker>' +
        "</defs></svg>"
    });
    document.body.appendChild(host);
  }

  /* ---- filtering -------------------------------------------------------- */
  function hasTop(sub) { return sub.questions.some(function (q) { return q.top; }); }
  function topCount(sub) { return sub.questions.filter(function (q) { return q.top; }).length; }

  function scopeList(sub) {
    return (ui.scope === "top" && hasTop(sub)) ? sub.questions.filter(function (q) { return q.top; }) : sub.questions;
  }

  function haystack(q) {
    if (!q._hay) {
      var parts = [q.q, q.short, q.topic];
      (q.a || []).forEach(function (b) {
        ["p", "h", "tip", "warn"].forEach(function (k) { if (b[k]) parts.push(b[k]); });
        (b.ul || b.ol || []).forEach(function (x) { parts.push(x); });
      });
      q._hay = parts.join(" ").replace(/<[^>]+>/g, "").toLowerCase();
    }
    return q._hay;
  }

  function filtered(sub) {
    var term = ui.q.toLowerCase();
    return scopeList(sub).filter(function (q) {
      if (ui.topic && q.topic !== ui.topic) return false;
      if (ui.level && q.level !== ui.level) return false;
      if (ui.status === "open" && C.mastered(sub, q)) return false;
      if (ui.status === "done" && !C.mastered(sub, q)) return false;
      if (ui.status === "star" && !C.starred(sub, q)) return false;
      if (term && haystack(q).indexOf(term) < 0) return false;
      return true;
    });
  }

  function features(q) {
    var f = { code: false, svg: false, table: false };
    (q.a || []).forEach(function (b) {
      if (b.code != null) f.code = true;
      if (b.svg) f.svg = true;
      if (b.table) f.table = true;
    });
    return f;
  }

  /* ---- a question card -------------------------------------------------- */
  function card(sub, q, n) {
    var k = key(sub, q);
    var node = el("article", { class: "cq", id: "cq-" + sub.id + "-" + q.id });
    var body = null;
    var f = features(q);

    var check = el("input", {
      type: "checkbox", class: "check", title: "Mastered", "aria-label": "Mastered: " + q.q,
      onchange: function () { C.master(sub, q, check.checked); rebuild(); }
    });
    var star = el("button", {
      class: "cq-star", title: "Star for revision",
      onclick: function () { C.star(sub, q, !C.starred(sub, q)); rebuild(); }
    });
    var toggle = el("button", {
      class: "cq-toggle",
      onclick: function () { setOpen(!ui.open[k]); }
    }, [
      el("span", { class: "cq-n tnum", text: n }),
      el("span", { class: "cq-main" }, [
        el("span", { class: "cq-q", text: q.q }),
        el("span", { class: "cq-meta" }, [
          q.top && ui.scope !== "top" ? el("span", { class: "tag tag-top", text: "Top " + topCount(sub) }) : null,
          el("span", { class: "lvl lvl-" + q.level, title: LEVELS[q.level] }, [el("i"), el("i"), el("i"), " " + (LEVELS[q.level] || "")]),
          el("span", { class: "cq-topic", text: q.topic }),
          f.code ? el("span", { class: "cq-f", title: "Has code", text: "</>" }) : null,
          f.svg ? el("span", { class: "cq-f", title: "Has a diagram", text: "◫" }) : null
        ])
      ]),
      el("span", { class: "cq-caret", "aria-hidden": "true", text: "›" })
    ]);

    function setOpen(on) {
      if (on) ui.open[k] = true; else delete ui.open[k];
      paint();
    }

    function paint() {
      var open = !!ui.open[k], done = C.mastered(sub, q), starred = C.starred(sub, q);
      node.classList.toggle("is-open", open);
      node.classList.toggle("is-done", done);
      check.checked = done;
      star.textContent = starred ? "★" : "☆";
      star.classList.toggle("on", starred);
      star.setAttribute("aria-pressed", starred ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && !body) {
        body = el("div", { class: "cq-body" }, [
          el("div", { class: "cq-short" }, [el("span", { class: "cq-short-k", text: "30-second answer" }), el("p", { text: q.short })]),
          answer(q),
          el("div", { class: "cq-foot" }, [
            el("button", {
              class: "btn btn-sm " + (done ? "" : "btn-primary"),
              text: done ? "✓ Mastered — undo" : "✓ Mark mastered",
              onclick: function () { C.master(sub, q, !C.mastered(sub, q)); body = rebuild(); }
            }),
            el("button", {
              class: "btn btn-sm btn-ghost", text: starred ? "★ Unstar" : "☆ Star for revision",
              onclick: function () { C.star(sub, q, !C.starred(sub, q)); body = rebuild(); }
            }),
            el("span", { style: "flex:1" }),
            el("button", {
              class: "btn btn-sm btn-ghost", text: "⧉ Copy link",
              onclick: function () {
                copyText(location.href.split("#")[0] + "#/core/" + sub.id + "/" + q.id, "Link copied");
              }
            }),
            el("button", { class: "btn btn-sm btn-ghost", text: "Collapse ↑", onclick: function () { setOpen(false); node.scrollIntoView({ block: "nearest" }); } })
          ])
        ]);
        node.appendChild(body);
      } else if (!open && body) {
        node.removeChild(body);
        body = null;
      }
    }

    function rebuild() {
      if (body) node.removeChild(body);
      body = null;
      paint();
      return body;
    }

    node.appendChild(el("div", { class: "cq-head" }, [
      toggle,
      el("div", { class: "cq-actions" }, [star, check])
    ]));
    paint();
    return node;
  }

  /* ---- quiz / flashcards ----------------------------------------------- */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function openQuiz(items) {
    if (!items.length) { U.toast("Nothing to quiz on with these filters"); return; }
    ensureDefs();
    // unmastered first, so a session always starts with what you don't know yet
    var deck = shuffle(items.filter(function (x) { return !C.mastered(x.sub, x.q); }))
      .concat(shuffle(items.filter(function (x) { return C.mastered(x.sub, x.q); })));
    var i = 0, revealed = false, full = false, knew = 0, again = 0;

    var cardHost = el("div", { class: "quiz-card" });
    var scrim = el("div", {
      class: "scrim quiz-scrim",
      onclick: function (e) { if (e.target === scrim) close(); }
    }, [el("div", { class: "quiz", role: "dialog", "aria-modal": "true", "aria-label": "Flashcards" }, [cardHost])]);

    function close() {
      document.removeEventListener("keydown", onKey, true);
      if (scrim.parentNode) scrim.parentNode.removeChild(scrim);
      document.body.classList.remove("no-scroll");
      Views.core.rerender();
    }

    function next(result) {
      var cur = deck[i];
      if (result === "knew") { knew++; C.master(cur.sub, cur.q, true); }
      if (result === "again") { again++; if (!C.starred(cur.sub, cur.q)) C.star(cur.sub, cur.q, true); }
      i++; revealed = false; full = false;
      paint();
      cardHost.scrollTop = 0;
    }

    function onKey(e) {
      if (e.key === "Escape") { e.stopPropagation(); close(); return; }
      if (i >= deck.length) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); e.stopPropagation(); if (!revealed) { revealed = true; paint(); } else next("knew"); return; }
      if (!revealed) return;
      var k = e.key.toLowerCase();
      if (k === "k" || e.key === "ArrowRight") { e.stopPropagation(); next("knew"); }
      else if (k === "r" || e.key === "ArrowLeft") { e.stopPropagation(); next("again"); }
      else if (k === "f") { e.stopPropagation(); full = !full; paint(); }
    }

    function paint() {
      U.clear(cardHost);
      var head = el("div", { class: "quiz-top" }, [
        el("span", { class: "quiz-count tnum", text: Math.min(i + 1, deck.length) + " / " + deck.length }),
        el("div", { class: "quiz-bar" }, [el("i", { style: "width:" + U.pct(i, deck.length) + "%" })]),
        el("button", { class: "iconbtn", title: "Close (Esc)", text: "✕", onclick: close })
      ]);
      cardHost.appendChild(head);

      if (i >= deck.length) {
        cardHost.appendChild(el("div", { class: "quiz-end" }, [
          el("div", { class: "quiz-end-fig", text: knew + " / " + deck.length }),
          el("p", { class: "dim", text: "known this round. " + again + " starred for revision." }),
          el("div", { class: "row", style: "justify-content:center;margin-top:16px" }, [
            el("button", { class: "btn", text: "↻ Go again", onclick: function () { deck = shuffle(deck); i = 0; knew = 0; again = 0; paint(); } }),
            el("button", { class: "btn btn-primary", text: "Done", onclick: close })
          ])
        ]));
        return;
      }

      var cur = deck[i];
      cardHost.appendChild(el("div", { class: "quiz-tags" }, [
        el("span", { class: "tag", text: cur.sub.short }),
        el("span", { class: "tag", text: cur.q.topic }),
        el("span", { class: "tag", text: LEVELS[cur.q.level] || "" }),
        C.mastered(cur.sub, cur.q) ? el("span", { class: "tag tag-good", text: "✓ mastered" }) : null
      ]));
      cardHost.appendChild(el("h2", { class: "quiz-q", text: cur.q.q }));

      if (!revealed) {
        cardHost.appendChild(el("p", { class: "quiz-hint", text: "Say your answer out loud first — then reveal." }));
        cardHost.appendChild(el("div", { class: "quiz-actions" }, [
          el("button", { class: "btn btn-primary quiz-big", onclick: function () { revealed = true; paint(); } }, ["Reveal answer ", el("span", { class: "kbd", text: "Space" })])
        ]));
        return;
      }

      cardHost.appendChild(el("div", { class: "cq-short quiz-short" }, [el("span", { class: "cq-short-k", text: "30-second answer" }), el("p", { text: cur.q.short })]));
      cardHost.appendChild(el("button", {
        class: "btn btn-sm btn-ghost", style: "margin:4px 0 8px",
        text: full ? "▾ Hide full answer" : "▸ Show full answer (F)",
        onclick: function () { full = !full; paint(); }
      }));
      if (full) cardHost.appendChild(answer(cur.q));
      cardHost.appendChild(el("div", { class: "quiz-actions quiz-sticky" }, [
        el("button", { class: "btn quiz-big quiz-again", onclick: function () { next("again"); } }, ["✗ Review again ", el("span", { class: "kbd", text: "R" })]),
        el("button", { class: "btn btn-primary quiz-big", onclick: function () { next("knew"); } }, ["✓ Knew it ", el("span", { class: "kbd", text: "K" })])
      ]));
    }

    document.body.appendChild(scrim);
    document.body.classList.add("no-scroll");
    document.addEventListener("keydown", onKey, true);
    paint();
  }

  /* ---- overview (all subjects) ----------------------------------------- */
  function overview() {
    var root = el("div", {});
    var list = subjects();
    var all = 0, done = 0, stars = 0, topAll = 0, topDone = 0;
    list.forEach(function (s) {
      var p = C.progress(s, false), t = C.progress(s, true);
      all += p.total; done += p.done; stars += C.starCount(s);
      if (hasTop(s)) { topAll += t.total; topDone += t.done; }
    });

    root.appendChild(R.pageHead(
      "Core CS Subjects",
      "The theory rounds: the <b>most-asked interview questions</b> for OS, OOPS, CN and DBMS — 50 each — plus more " +
      "subjects and deeper extras. Every answer has a 30-second version to say out loud, then the full depth with " +
      "code, SQL and diagrams. Tick what you can explain unaided; star what needs another pass.",
      el("div", { style: "min-width:190px;flex:none" }, [R.meter({ done: done, total: all, label: "Mastered", size: "lg" })])
    ));

    if (!list.length) {
      root.appendChild(R.empty("No subject data loaded. Check that <code>assets/js/data/core/*.js</code> are included in index.html."));
      return root;
    }

    root.appendChild(el("div", { class: "grid g4", style: "margin-bottom:8px" }, [
      R.tile({ label: "Subjects", value: list.length }),
      R.tile({ label: "Questions", value: all, foot: "with full answers" }),
      R.tile({ label: "Top-list mastered", value: topDone, unit: "/ " + topAll, meter: { done: topDone, total: topAll, showValue: false } }),
      R.tile({ label: "Starred", value: stars, foot: stars ? "your revision queue" : "star anything shaky" })
    ]));

    var quizAllStar = [];
    list.forEach(function (s) { s.questions.forEach(function (q) { if (C.starred(s, q)) quizAllStar.push({ sub: s, q: q }); }); });

    root.appendChild(R.sectionHead("Subjects", null, el("div", { class: "row", style: "margin-left:auto" }, [
      stars ? el("button", { class: "btn btn-sm", text: "★ Quiz my starred (" + stars + ")", onclick: function () { openQuiz(quizAllStar); } }) : null
    ])));

    root.appendChild(el("div", { class: "subj-grid" }, list.map(function (s) {
      var p = C.progress(s, false), t = C.progress(s, true), tc = topCount(s), sc = C.starCount(s);
      var go = function () { location.hash = "#/core/" + s.id; };
      return el("div", { class: "subj card", tabindex: "0", role: "link", onclick: go, onkeydown: function (e) { if (e.key === "Enter") go(); } }, [
        el("div", { class: "subj-head" }, [
          el("span", { class: "subj-ico", text: s.icon || "◆" }),
          el("div", { style: "min-width:0;flex:1" }, [
            el("h3", { class: "subj-title", text: s.title }),
            el("div", { class: "small muted", text: s.questions.length + " questions" + (tc ? " · Top " + tc : "") + (sc ? " · ★ " + sc : "") })
          ])
        ]),
        el("p", { class: "subj-blurb small dim", text: s.blurb || "" }),
        tc ? R.meter({ done: t.done, total: t.total, label: "Top " + tc, size: "sm" }) : null,
        el("div", { style: "margin-top:8px" }, [R.meter({ done: p.done, total: p.total, label: "All questions", size: "sm" })]),
        el("div", { class: "row", style: "margin-top:12px" }, [
          el("button", { class: "btn btn-sm btn-primary", text: "Study →", onclick: function (e) { e.stopPropagation(); go(); } }),
          el("button", {
            class: "btn btn-sm", text: "⚡ Quiz" + (tc ? " Top " + tc : ""),
            onclick: function (e) {
              e.stopPropagation();
              openQuiz(s.questions.filter(function (q) { return !tc || q.top; }).map(function (q) { return { sub: s, q: q }; }));
            }
          })
        ])
      ]);
    })));

    root.appendChild(el("div", { class: "card small dim", style: "margin-top:16px" }, [
      el("b", { text: "How to use this. " }),
      "Read the question, answer it out loud in under a minute, then open it and compare against the 30-second answer. " +
      "Only tick ", el("b", { text: "mastered" }), " when you could explain it to an interviewer without looking. " +
      "Flashcards (", el("span", { class: "kbd", text: "Space" }), " reveal, ",
      el("span", { class: "kbd", text: "K" }), " knew it, ", el("span", { class: "kbd", text: "R" }),
      " review again) star anything you miss, so your revision queue builds itself."
    ]));
    return root;
  }

  /* ---- one subject ------------------------------------------------------ */
  function subjectView(sub) {
    var root = el("div", {});
    var rer = Views.core.rerender;

    /* subject switcher */
    root.appendChild(el("div", { class: "tabs tabs-scroll", role: "tablist" }, [
      el("button", { class: "tab", role: "tab", "aria-selected": "false", onclick: function () { location.hash = "#/core"; } }, ["← All"])
    ].concat(subjects().map(function (s) {
      var p = C.progress(s, false);
      return el("button", {
        class: "tab", role: "tab", "aria-selected": s.id === sub.id ? "true" : "false",
        onclick: function () { if (s.id !== sub.id) location.hash = "#/core/" + s.id; }
      }, [s.short, el("span", { class: "nav-count tnum", text: p.done + "/" + p.total })]);
    }))));

    var tc = topCount(sub), pAll = C.progress(sub, false), pTop = C.progress(sub, true);
    root.appendChild(R.pageHead(
      (sub.icon ? sub.icon + "  " : "") + sub.title,
      U.esc(sub.blurb || "") + " <b>" + sub.questions.length + " questions</b>" + (tc ? ", the top " + tc + " flagged." : "."),
      el("div", { style: "min-width:200px;flex:none;display:grid;gap:10px" }, [
        tc ? R.meter({ done: pTop.done, total: pTop.total, label: "Top " + tc + " mastered", size: "lg" }) : null,
        R.meter({ done: pAll.done, total: pAll.total, label: "All mastered", size: tc ? "sm" : "lg" })
      ])
    ));

    /* filters */
    var search = el("input", {
      class: "inp", type: "search", placeholder: "Search questions and answers…", value: ui.q,
      "aria-label": "Search questions",
      oninput: U.debounce(function () { ui.q = search.value.trim(); rer(true); }, 200)
    });
    var segs = [];
    if (tc) {
      segs.push(el("div", { class: "seg" }, [["top", "Top " + tc], ["all", "All " + sub.questions.length]].map(function (o) {
        return el("button", { text: o[1], "aria-pressed": ui.scope === o[0] ? "true" : "false", onclick: function () { ui.scope = o[0]; ui.topic = ""; rer(); } });
      })));
    }
    segs.push(el("div", { class: "seg" }, [["all", "All"], ["open", "To learn"], ["done", "Mastered"], ["star", "★ Starred"]].map(function (o) {
      return el("button", { text: o[1], "aria-pressed": ui.status === o[0] ? "true" : "false", onclick: function () { ui.status = o[0]; rer(); } });
    })));
    var lvl = el("select", {
      class: "inp", style: "width:auto", "aria-label": "Difficulty",
      onchange: function () { ui.level = Number(lvl.value); rer(); }
    }, [["0", "Any level"], ["1", "Basic"], ["2", "Intermediate"], ["3", "Advanced"]].map(function (o) {
      return el("option", { value: o[0], text: o[1], selected: String(ui.level) === o[0] });
    }));
    root.appendChild(el("div", { class: "filterbar" }, [search].concat(segs, [lvl])));

    /* topic chips */
    var scoped = scopeList(sub);
    var counts = {};
    scoped.forEach(function (q) { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    root.appendChild(el("div", { class: "topicbar" }, [
      el("button", { class: "tchip", "aria-pressed": !ui.topic ? "true" : "false", onclick: function () { ui.topic = ""; rer(); } }, ["All topics ", el("b", { text: String(scoped.length) })])
    ].concat((sub.topics || []).filter(function (t) { return counts[t]; }).map(function (t) {
      return el("button", {
        class: "tchip", "aria-pressed": ui.topic === t ? "true" : "false",
        onclick: function () { ui.topic = ui.topic === t ? "" : t; rer(); }
      }, [t + " ", el("b", { text: String(counts[t]) })]);
    }))));

    var shown = filtered(sub);
    root.appendChild(el("div", { class: "cq-toolbar" }, [
      el("span", { class: "small muted tnum", text: shown.length + " shown" }),
      el("span", { style: "flex:1" }),
      el("button", { class: "btn btn-sm btn-ghost", text: "Expand all", onclick: function () { shown.forEach(function (q) { ui.open[key(sub, q)] = true; }); rer(); } }),
      el("button", { class: "btn btn-sm btn-ghost", text: "Collapse all", onclick: function () { shown.forEach(function (q) { delete ui.open[key(sub, q)]; }); rer(); } }),
      el("button", {
        class: "btn btn-sm btn-primary", text: "⚡ Quiz these " + shown.length,
        onclick: function () { openQuiz(shown.map(function (q) { return { sub: sub, q: q }; })); }
      })
    ]));

    if (!shown.length) {
      root.appendChild(R.empty("Nothing matches those filters."));
      return root;
    }

    /* numbered within the scope (Top-N or All), so "#17" means the same thing under any filter */
    var num = {};
    scoped.forEach(function (q, i) { num[q.id] = i + 1; });

    var byTopic = {};
    shown.forEach(function (q) { (byTopic[q.topic] = byTopic[q.topic] || []).push(q); });
    var order = (sub.topics || []).concat(Object.keys(byTopic).filter(function (t) { return (sub.topics || []).indexOf(t) < 0; }));
    order.forEach(function (t) {
      var qs = byTopic[t];
      if (!qs) return;
      var done = qs.filter(function (q) { return C.mastered(sub, q); }).length;
      root.appendChild(R.sectionHead(t, done + "/" + qs.length + " mastered"));
      root.appendChild(el("div", { class: "cq-list" }, qs.map(function (q) { return card(sub, q, num[q.id]); })));
    });

    return root;
  }

  Views.core = {
    title: "Core Subjects",

    route: function (param) {
      var parts = (param || "").split("/");
      var next = parts[0] || null;
      if (next !== ui.sub) { ui.topic = ""; ui.q = ""; ui.status = "all"; ui.level = 0; }
      ui.sub = next;
      ui.focus = parts[1] || null;
      var sub = next && subjectById(next);
      if (sub && ui.focus) {
        var q = sub.questions.filter(function (x) { return x.id === ui.focus; })[0];
        if (q) {
          ui.open[key(sub, q)] = true;
          if (!q.top) ui.scope = "all";
          ui.topic = ""; ui.q = ""; ui.status = "all"; ui.level = 0;
        }
      }
    },

    rerender: function (keepFocus) {
      var host = U.$("#view-root");
      if (!host) return;
      var active = document.activeElement, sel = null;
      if (keepFocus && active && active.type === "search") sel = active.selectionStart;
      U.clear(host).appendChild(Views.core.render());
      if (sel !== null) {
        var s = U.$('#view-root input[type="search"]');
        if (s) { s.focus(); try { s.setSelectionRange(sel, sel); } catch (e) { /* ignore */ } }
      }
    },

    render: function () {
      ensureDefs();
      var sub = ui.sub && subjectById(ui.sub);
      if (!sub) return overview();
      var view = subjectView(sub);
      if (ui.focus) {
        var target = ui.focus;
        ui.focus = null;
        setTimeout(function () {
          var n = document.getElementById("cq-" + sub.id + "-" + target);
          if (n) n.scrollIntoView({ block: "start" });
        }, 60);
      }
      return view;
    },

    /* used by the command palette and the dashboard */
    /* mastery counts: all subjects, or just one when a subject id is given */
    stats: function (subId) {
      var done = 0, total = 0;
      var list = subId ? [subjectById(subId)].filter(Boolean) : subjects();
      list.forEach(function (s) { var p = C.progress(s, false); done += p.done; total += p.total; });
      return { done: done, total: total, pct: U.pct(done, total) };
    },
    subject: subjectById,
    quiz: openQuiz
  };
})();
