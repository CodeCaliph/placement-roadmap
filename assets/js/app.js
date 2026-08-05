/* ==========================================================================
   app.js — shell, router, command palette, keyboard shortcuts
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK || {};
  var App = {};
  window.App = App;

  var ROUTES = [
    { id: "dashboard", label: "Dashboard", icon: "◉", group: "Daily" },
    { id: "plan", label: "60-Day Plan", icon: "▤", group: "Daily", count: function () { var p = S.progress().plan; return p.done + "/" + p.total; } },
    { id: "trackers", label: "Trackers", icon: "⟳", group: "Daily", count: function () { var d = S.redoDue().length; return d ? String(d) : null; } },
    { id: "banks", label: "Problem Sets", icon: "☰", group: "Coverage", count: function () { var p = S.progress().bank; return p.done + "/" + p.total; } },
    { id: "topics", label: "DSA Topics", icon: "◈", group: "Coverage", count: function () { return S.topicTotals().pct + "%"; } },
    { id: "mocks", label: "Mocks", icon: "◎", group: "Coverage", count: function () { var p = S.progress().mocks; return p.done + "/" + p.total; } },
    { id: "readiness", label: "Readiness", icon: "▲", group: "Review", count: function () { var l = S.latestScore(); return l ? String(l.score.total) : null; } },
    { id: "checklist", label: "Final Checklist", icon: "✓", group: "Review", count: function () { var p = S.progress().checklist; return p.done + "/" + p.total; } },
    { id: "mistakes", label: "100 Mistakes", icon: "!", group: "Review", count: function () { var p = S.progress().mistakes; return p.done + "/" + p.total; } },
    { id: "library", label: "Handbook", icon: "▣", group: "Reference" },
    { id: "settings", label: "Settings", icon: "⚙", group: "Reference" }
  ];

  /* ---- theme ----------------------------------------------------------- */
  App.setTheme = function (mode) {
    S.state().theme = mode;
    S.save();
    App.applyTheme();
  };

  App.applyTheme = function () {
    var mode = S.state().theme || "auto";
    if (mode === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
    var btn = U.$("#themebtn");
    if (btn) btn.textContent = mode === "dark" ? "☾" : mode === "light" ? "☀" : "◐";
  };

  App.cycleTheme = function () {
    var order = ["auto", "light", "dark"];
    var cur = S.state().theme || "auto";
    App.setTheme(order[(order.indexOf(cur) + 1) % 3]);
  };

  /* ---- routing --------------------------------------------------------- */
  function parseHash() {
    var raw = (location.hash || "").replace(/^#\/?/, "");
    var parts = raw.split("/").filter(Boolean);
    return { view: parts[0] || "dashboard", param: parts[1] || null };
  }

  App.render = function () {
    var r = parseHash();
    var route = ROUTES.filter(function (x) { return x.id === r.view; })[0];
    if (!route) { location.hash = "#/dashboard"; return; }

    var view = Views[route.id];
    if (!view) { U.toast("That view is unavailable"); return; }

    S.state().lastView = route.id;
    S.save();

    if (view.route) view.route(r.param);

    var host = U.$("#view-root");
    U.clear(host);
    try {
      host.appendChild(view.render());
    } catch (e) {
      console.error(e);
      host.appendChild(el("div", { class: "card card-pad-lg" }, [
        el("h3", { text: "Something went wrong rendering this view" }),
        el("p", { class: "small dim", text: String(e && e.message || e) }),
        el("p", { class: "small dim", text: "Your saved progress is untouched. Try another tab, or reload." })
      ]));
    }

    /* nav state */
    U.$$(".nav-item").forEach(function (b) {
      if (b.dataset.route === route.id) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    App.refreshChrome();
    document.body.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.title = view.title + " · 60-Day Placement Handbook";
  };

  /* ---- chrome (counts, crumb, streak) --------------------------------- */
  App.refreshChrome = function () {
    var r = parseHash();
    var route = ROUTES.filter(function (x) { return x.id === r.view; })[0] || ROUTES[0];

    ROUTES.forEach(function (x) {
      var node = U.$('.nav-item[data-route="' + x.id + '"] .nav-count');
      if (!node) return;
      var v = x.count ? x.count() : null;
      node.textContent = v || "";
      node.style.display = v ? "" : "none";
    });

    var crumb = U.$("#crumb");
    if (crumb) {
      U.clear(crumb);
      U.append(crumb, [
        el("b", { text: (Views[route.id] || {}).title || route.label }),
        r.param ? el("span", { text: " · " + r.param }) : null
      ]);
    }

    var cur = S.currentDay();
    var dayPill = U.$("#daypill");
    if (dayPill) {
      U.clear(dayPill);
      U.append(dayPill, ["Day", el("b", { text: String(cur) }), "of 60"]);
    }

    var st = S.streak();
    var streakPill = U.$("#streakpill");
    if (streakPill) {
      U.clear(streakPill);
      streakPill.classList.toggle("hot", st.current > 0 && st.today);
      U.append(streakPill, [st.current > 0 ? "🔥" : "○", el("b", { text: String(st.current) }), st.current === 1 ? "day" : "days"]);
      streakPill.title = st.today
        ? "You've logged work today. Best streak: " + st.best + " days."
        : "Nothing logged today yet. Best streak: " + st.best + " days.";
    }

    var pp = U.$("#progpill");
    if (pp) {
      var p = S.progress();
      U.clear(pp);
      U.append(pp, [el("b", { text: p.overall + "%" }), "complete"]);
    }
  };

  /* ---- sidebar --------------------------------------------------------- */
  function sidebar() {
    var nav = el("nav", { class: "nav" });
    var lastGroup = null;
    ROUTES.forEach(function (r) {
      if (r.group !== lastGroup) {
        lastGroup = r.group;
        nav.appendChild(el("div", { class: "nav-group-label", text: r.group }));
      }
      nav.appendChild(el("button", {
        class: "nav-item", dataset: { route: r.id },
        onclick: function () { location.hash = "#/" + r.id; }
      }, [
        el("span", { class: "nav-ico", text: r.icon }),
        el("span", { style: "flex:1;min-width:0", text: r.label }),
        el("span", { class: "nav-count tnum" })
      ]));
    });

    return el("aside", { class: "sidebar" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand-mark" }, [el("span", { class: "brand-dot", text: "60" }), "Placement Handbook"]),
        el("div", { class: "brand-title", text: "60 Days to the Offer" }),
        el("div", { class: "brand-sub", text: (H.meta && H.meta.subtitle) || "Java · SDE · Campus" })
      ]),
      nav,
      el("div", { class: "sidebar-foot" }, [
        el("div", { class: "small muted", style: "margin-bottom:8px" }, [
          "Three things decide this: ", el("b", { text: "unaided solving" }), ", ",
          el("b", { text: "revision" }), ", and ", el("b", { text: "talking while you think" }), "."
        ]),
        el("div", { class: "row", style: "gap:6px" }, [
          el("button", { class: "iconbtn", id: "themebtn", title: "Theme (T)", onclick: App.cycleTheme, text: "◐" }),
          el("button", { class: "iconbtn", title: "Print", onclick: function () { window.print(); }, text: "⎙" }),
          el("button", {
            class: "iconbtn", title: "Export backup",
            onclick: function () { U.download("handbook60-progress-" + U.todayKey() + ".json", S.exportJSON()); U.toast("Backup downloaded", "good"); },
            text: "⭳"
          })
        ])
      ])
    ]);
  }

  /* ---- command palette ------------------------------------------------ */
  var paletteIndex = null;

  function buildIndex() {
    if (paletteIndex) return paletteIndex;
    var idx = [];

    ROUTES.forEach(function (r) {
      idx.push({ kind: "Go to", title: r.label, sub: r.group, hash: "#/" + r.id });
    });

    (H.days || []).forEach(function (d) {
      idx.push({
        kind: "Day " + d.day, title: d.title,
        sub: "Week " + d.week + " · " + U.hours(d.hours) + " · " + d.phaseName,
        hash: "#/plan/" + d.day,
        extra: (d.blocks || []).map(function (b) { return b.text; }).join(" ")
      });
    });

    (H.banks || []).forEach(function (b) {
      idx.push({ kind: "Set", title: b.title, sub: b.count + " items", hash: "#/banks/" + b.id });
    });

    (H.dsaMaster || []).forEach(function (t) {
      idx.push({ kind: "Topic", title: t.topic, sub: t.tier + " · " + t.frequency + " · " + t.q + " problems", hash: "#/topics" });
    });

    (H.reference || []).forEach(function (p) {
      (p.sections || []).forEach(function (s) {
        var owned = { 3: "#/plan", 6: "#/banks", 7: "#/mocks", 8: "#/checklist", 9: "#/mistakes", 10: "#/readiness" }[p.num];
        idx.push({ kind: "Handbook", title: s.title, sub: p.title, hash: owned || ("#/library/" + p.id) });
      });
    });

    ((H.mocks || {}).schedule || []).forEach(function (m) {
      idx.push({ kind: "Mock #" + m.n, title: String(m.type).replace(/<[^>]+>/g, ""), sub: "Day " + m.day + " · " + m.focus, hash: "#/mocks" });
    });

    (H.mistakes || []).forEach(function (m) {
      idx.push({ kind: "Mistake " + m.n, title: m.mistakeText, sub: m.fixText, hash: "#/mistakes" });
    });

    paletteIndex = idx;
    return idx;
  }

  var sel = 0, results = [];

  function renderResults(list) {
    var host = U.$("#palette-list");
    U.clear(host);
    results = list;
    if (!list.length) {
      host.appendChild(el("div", { class: "empty", style: "border:0", text: "Nothing found." }));
      return;
    }
    list.forEach(function (r, i) {
      host.appendChild(el("button", {
        class: "pres" + (i === sel ? " sel" : ""),
        onclick: function () { go(r); }
      }, [
        el("span", { class: "pres-kind", text: r.kind }),
        el("div", { class: "pres-main" }, [
          el("div", { class: "pres-t", text: r.title }),
          r.sub ? el("div", { class: "pres-s", text: r.sub }) : null
        ])
      ]));
    });
  }

  function go(r) {
    closePalette();
    location.hash = r.hash;
  }

  function search(term) {
    var idx = buildIndex();
    if (!term) {
      return idx.filter(function (r) { return r.kind === "Go to"; }).concat(
        idx.filter(function (r) { return /^Day /.test(r.kind); }).slice(Math.max(0, S.currentDay() - 2), S.currentDay() + 3)
      );
    }
    var scored = [];
    idx.forEach(function (r) {
      var s = Math.max(
        U.match(r.title, term),
        U.match(r.kind, term) - 4,
        U.match(r.sub || "", term) - 22,
        U.match(r.extra || "", term) - 40
      );
      if (s > 0) scored.push({ r: r, s: s });
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored.slice(0, 40).map(function (x) { return x.r; });
  }

  function openPalette() {
    var scrim = U.$("#palette-scrim");
    scrim.hidden = false;
    var inp = U.$("#palette-inp");
    inp.value = "";
    sel = 0;
    renderResults(search(""));
    inp.focus();
  }

  function closePalette() {
    U.$("#palette-scrim").hidden = true;
  }

  function palette() {
    var inp = el("input", {
      class: "palette-inp", id: "palette-inp", type: "text", autocomplete: "off",
      placeholder: "Jump to a day, topic, problem set, mistake…",
      oninput: function () { sel = 0; renderResults(search(inp.value.trim())); },
      onkeydown: function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); renderResults(results); }
        else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); renderResults(results); }
        else if (e.key === "Enter") { e.preventDefault(); if (results[sel]) go(results[sel]); }
        else if (e.key === "Escape") { closePalette(); }
      }
    });

    return el("div", {
      class: "scrim", id: "palette-scrim", hidden: true,
      onclick: function (e) { if (e.target.id === "palette-scrim") closePalette(); }
    }, [
      el("div", { class: "palette", role: "dialog", "aria-label": "Search" }, [
        inp,
        el("div", { class: "palette-list", id: "palette-list" }),
        el("div", { class: "palette-foot" }, [
          el("span", {}, [el("span", { class: "kbd", text: "↑↓" }), " navigate"]),
          el("span", {}, [el("span", { class: "kbd", text: "↵" }), " open"]),
          el("span", {}, [el("span", { class: "kbd", text: "esc" }), " close"])
        ])
      ])
    ]);
  }

  /* ---- boot ----------------------------------------------------------- */
  App.boot = function () {
    if (!window.HANDBOOK || !(H.days || []).length) {
      document.body.appendChild(el("div", { class: "view" }, [
        el("div", { class: "card card-pad-lg" }, [
          el("h3", { text: "Handbook data not loaded" }),
          el("p", { class: "small dim" }, [
            "Run ", el("code", { text: "python build_handbook.py" }),
            " in the project folder to generate ", el("code", { text: "assets/js/data/handbook.data.js" }), "."
          ])
        ])
      ]));
      return;
    }

    S.load();

    var shell = el("div", { class: "shell" }, [
      sidebar(),
      el("div", { class: "main" }, [
        el("header", { class: "topbar" }, [
          el("button", {
            class: "iconbtn navtoggle", title: "Menu", text: "☰",
            onclick: function () { document.body.classList.toggle("nav-open"); }
          }),
          el("div", { class: "crumb", id: "crumb" }),
          el("div", { class: "topbar-spacer" }),
          el("span", { class: "pill", id: "progpill" }),
          el("span", { class: "pill", id: "daypill" }),
          el("span", { class: "pill", id: "streakpill" }),
          el("button", { class: "searchbtn", onclick: openPalette }, [
            el("span", { text: "⌕" }),
            el("span", { text: "Search everything" }),
            el("span", { class: "kbd", text: "Ctrl K" })
          ])
        ]),
        el("main", { class: "view", id: "view-root" })
      ])
    ]);

    document.body.appendChild(shell);
    document.body.appendChild(palette());
    document.body.appendChild(el("div", { class: "toasts", id: "toasts" }));

    App.applyTheme();

    /* keyboard */
    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
      if (e.key === "Escape") { closePalette(); return; }
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); openPalette(); return; }
      if (e.key.toLowerCase() === "t") { App.cycleTheme(); return; }
      if (e.key.toLowerCase() === "g") { location.hash = "#/plan/" + S.currentDay(); return; }
      if (e.key >= "1" && e.key <= "9") {
        var r = ROUTES[Number(e.key) - 1];
        if (r) location.hash = "#/" + r.id;
      }
    });

    /* keep chrome fresh on every state change */
    S.onChange(function () { App.refreshChrome(); });

    window.addEventListener("hashchange", App.render);
    if (!location.hash) {
      // resume where they left off, but a first run always starts at the Dashboard
      var resume = Object.keys(S.state().done).length ? (S.state().lastView || "dashboard") : "dashboard";
      location.hash = "#/" + resume;
    } else {
      App.render();
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", App.boot);
  else App.boot();
})();
