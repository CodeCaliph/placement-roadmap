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

  /* ---- themes ---------------------------------------------------------- */
  App.THEMES = [
    { id: "auto",     label: "System",   icon: "◐", swatch: ["#fcfcfb", "#1a1a19", "#2a78d6"], note: "Follows your OS" },
    { id: "light",    label: "Light",    icon: "☀", swatch: ["#fcfcfb", "#f2f1ed", "#2a78d6"], note: "Clean and bright" },
    { id: "paper",    label: "Paper",    icon: "◍", swatch: ["#fffdf7", "#f2ebdd", "#a1560f"], note: "Warm cream, best for long reading" },
    { id: "mist",     label: "Mist",     icon: "☁", swatch: ["#fbfcfe", "#eef1f6", "#3f5bd9"], note: "Cool grey-blue, crisp" },
    { id: "sage",     label: "Sage",     icon: "❦", swatch: ["#fbfdfa", "#eaefe9", "#2f7d5b"], note: "Soft green, low glare" },
    { id: "blush",    label: "Blush",    icon: "✿", swatch: ["#fffcfd", "#f6eef1", "#a63d6e"], note: "Warm light, plum accent" },
    { id: "dark",     label: "Dark",     icon: "☾", swatch: ["#1a1a19", "#0d0d0d", "#3987e5"], note: "Neutral near-black" },
    { id: "midnight", label: "Midnight", icon: "✵", swatch: ["#101828", "#080d19", "#5b9dff"], note: "Deep navy" },
    { id: "forest",   label: "Forest",   icon: "❧", swatch: ["#101b16", "#08120e", "#34c08a"], note: "Muted green" },
    { id: "contrast", label: "Contrast", icon: "◑", swatch: ["#0b0b0b", "#000000", "#63b3ff"], note: "Maximum legibility" }
  ];

  App.SIZES = [
    { id: "compact", label: "Compact" },
    { id: "normal", label: "Normal" },
    { id: "large", label: "Large" }
  ];

  App.setTheme = function (mode) {
    S.state().theme = mode;
    S.save();
    App.applyTheme();
    App.paintThemePicker();
  };

  App.applyTheme = function () {
    var mode = S.state().theme || "auto";
    if (mode === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);

    var t = App.THEMES.filter(function (x) { return x.id === mode; })[0] || App.THEMES[0];
    var btn = U.$("#themebtn");
    if (btn) { btn.textContent = t.icon; btn.title = "Theme: " + t.label + " (T)"; }
  };

  App.setTextSize = function (size) {
    S.state().textSize = size;
    S.save();
    App.applyTextSize();
    App.paintThemePicker();
  };

  App.applyTextSize = function () {
    var size = S.state().textSize || "normal";
    document.body.classList.remove("txt-compact", "txt-large");
    if (size === "compact") document.body.classList.add("txt-compact");
    if (size === "large") document.body.classList.add("txt-large");
  };

  /* ---- theme popover --------------------------------------------------- */
  App.themeSwatch = function (t) {
    return el("span", { class: "swatch" }, [
      el("i", { style: "background:" + t.swatch[0] }),
      el("i", { style: "background:" + t.swatch[1] }),
      el("i", { style: "background:" + t.swatch[2] })
    ]);
  };

  App.themeButtons = function () {
    var cur = S.state().theme || "auto";
    return App.THEMES.map(function (t) {
      return el("button", {
        class: "themebtn", "aria-pressed": cur === t.id ? "true" : "false",
        title: t.note, dataset: { theme: t.id },
        onclick: function () { App.setTheme(t.id); }
      }, [App.themeSwatch(t), t.label]);
    });
  };

  App.paintThemePicker = function () {
    var grid = U.$("#theme-grid");
    if (grid) U.clear(grid).appendChild(U.frag(App.themeButtons()));
    var sizes = U.$("#size-seg");
    if (sizes) {
      var cur = S.state().textSize || "normal";
      U.$$("button", sizes).forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.size === cur ? "true" : "false");
      });
    }
    // Settings view mirrors these controls
    if ((location.hash || "").indexOf("settings") >= 0 && Views.settings) Views.settings.rerender();
  };

  function themePopover() {
    var grid = el("div", { class: "themegrid", id: "theme-grid" }, App.themeButtons());
    var seg = el("div", { class: "seg", id: "size-seg" }, App.SIZES.map(function (s) {
      return el("button", {
        text: s.label, dataset: { size: s.id },
        "aria-pressed": (S.state().textSize || "normal") === s.id ? "true" : "false",
        onclick: function () { App.setTextSize(s.id); }
      });
    }));
    return el("div", { class: "pop", id: "theme-pop", hidden: true, role: "dialog", "aria-label": "Appearance" }, [
      el("div", { class: "pop-title", text: "Theme" }),
      grid,
      el("div", { class: "pop-title", style: "padding-top:12px", text: "Text size" }),
      el("div", { class: "sizerow" }, [seg])
    ]);
  }

  App.toggleThemePop = function () {
    var pop = U.$("#theme-pop"), btn = U.$("#themebtn");
    if (!pop || !btn) return;
    if (!pop.hidden) { pop.hidden = true; return; }
    if (window.M) M.close();
    pop.hidden = false;
    U.place(pop, btn);
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

  /* ---- brand mark -----------------------------------------------------
     A rising check: the tick says "done", its long arm carries on upward.
     Inline SVG so the gradient can read the theme's accent tokens.
     -------------------------------------------------------------------- */
  App.logo = function (size) {
    size = size || 34;
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 32 32");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("class", "logo-mark");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="var(--accent-2)"/>' +
          '<stop offset="1" stop-color="var(--accent)"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="32" height="32" rx="9" fill="url(#lg-a)"/>' +
      '<path d="M0 9A9 9 0 0 1 9 0h14a9 9 0 0 1 9 9v4H0Z" fill="#fff" opacity=".13"/>' +
      '<path d="M8.4 16.9l5.2 5.2L27 6.2" fill="none" stroke="#fff" stroke-opacity=".34" ' +
        'stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M8.4 16.9l5.2 5.2L23.4 8.2" fill="none" stroke="#fff" ' +
        'stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>';
    return svg;
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
        el("div", { class: "brand-row" }, [
          App.logo(34),
          el("div", { class: "brand-words" }, [
            el("div", { class: "brand-title", text: "Sixty" }),
            el("div", { class: "brand-kicker", text: "Placement Handbook" })
          ])
        ]),
        el("div", { class: "brand-sub", text: "Java · SDE · Campus · " + ((H.days || []).length) + " days" })
      ]),
      nav,
      el("div", { class: "sidebar-foot" }, [
        el("div", { class: "small muted", style: "margin-bottom:10px" }, [
          "Three things decide this: ", el("b", { text: "unaided solving" }), ", ",
          el("b", { text: "revision" }), ", and ", el("b", { text: "talking while you think" }), "."
        ]),
        el("div", { class: "row", style: "gap:6px;flex-wrap:nowrap" }, [
          window.M ? M.button() : null,
          el("span", { style: "flex:1" }),
          el("button", {
            class: "iconbtn", id: "themebtn", title: "Theme (T)", text: "◐",
            onclick: function (e) { e.stopPropagation(); App.toggleThemePop(); }
          }),
          el("button", { class: "iconbtn", title: "Print this view", onclick: function () { window.print(); }, text: "⎙" }),
          el("button", {
            class: "iconbtn", title: "Export a backup",
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
    document.body.appendChild(themePopover());
    document.body.appendChild(el("div", { class: "toasts", id: "toasts" }));

    /* back to top — the plan and handbook views get long */
    var toTop = el("button", {
      class: "totop", title: "Back to top", "aria-label": "Back to top", text: "↑",
      onclick: function () { window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
    document.body.appendChild(toTop);
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("on", window.scrollY > 520);
    }, { passive: true });

    /* close the theme popover on an outside click */
    document.addEventListener("click", function (e) {
      var pop = U.$("#theme-pop");
      if (!pop || pop.hidden) return;
      if (pop.contains(e.target) || (e.target.closest && e.target.closest("#themebtn"))) return;
      pop.hidden = true;
    });

    if (window.M) M.mount();

    App.applyTheme();
    App.applyTextSize();

    /* keyboard */
    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
      if (e.key === "Escape") { closePalette(); return; }
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); openPalette(); return; }
      if (e.key.toLowerCase() === "t") { App.toggleThemePop(); return; }
      if (e.key.toLowerCase() === "m") {
        var mb = U.$("#momentum-btn");
        if (mb && window.M) M.toggle(mb);
        return;
      }
      if (e.key.toLowerCase() === "g") { location.hash = "#/plan/" + S.currentDay(); return; }
      if (e.key >= "1" && e.key <= "9") {
        var r = ROUTES[Number(e.key) - 1];
        if (r) location.hash = "#/" + r.id;
      }
    });

    /* keep chrome fresh on every state change */
    S.onChange(function () { App.refreshChrome(); });

    window.addEventListener("hashchange", App.render);
    if (window.M) setTimeout(M.nudge, 600);
    if (!location.hash) {
      // resume where they left off, but a first run always starts at the Dashboard
      var resume = Object.keys(S.state().done).length ? (S.state().lastView || "dashboard") : "dashboard";
      location.hash = "#/" + resume;
    } else {
      App.render();
    }
  };

  /* If boot itself throws, the rescue watchdog in index.html takes over — but
     record why first, so the recovery screen can show it. */
  function safeBoot() {
    try {
      App.boot();
    } catch (e) {
      window.__bootError = (e && e.message) || String(e);
      console.error("boot failed:", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", safeBoot);
  else safeBoot();
})();
