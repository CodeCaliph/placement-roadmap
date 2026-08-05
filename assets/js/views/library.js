/* ==========================================================================
   views/library.js — the full handbook as reference: Parts 1, 2, 4, 5, and
   the ground rules. Nothing is summarised; this is your source text.
   ========================================================================== */
(function () {
  "use strict";

  var el = U.el, H = window.HANDBOOK;
  var partId = null, secId = null, q = "";

  /* Parts that have their own dedicated, interactive view */
  var OWNED = { 3: "#/plan", 6: "#/banks", 7: "#/mocks", 8: "#/checklist", 9: "#/mistakes", 10: "#/readiness" };

  function libraryParts() {
    return (H.reference || []).filter(function (p) { return !OWNED[p.num]; });
  }

  function partById(id) {
    var list = libraryParts();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || null;
  }

  function searchAll(needle) {
    var n = needle.toLowerCase(), hits = [];
    (H.reference || []).forEach(function (part) {
      (part.sections || []).forEach(function (sec) {
        var text = (sec.blocks || []).map(function (b) {
          if (b.type === "table") return (b.rows || []).map(function (r) { return r.join(" "); }).join(" ");
          if (b.type === "list" || b.type === "checklist") return b.items.map(function (i) { return i.text; }).join(" ");
          return b.text || "";
        }).join(" ");
        var hay = (sec.title + " " + text).replace(/<[^>]+>/g, " ");
        if (hay.toLowerCase().indexOf(n) >= 0) {
          hits.push({ part: part, sec: sec });
        }
      });
    });
    return hits;
  }

  Views.library = {
    title: "Handbook",

    route: function (param) {
      if (param) { partId = param; secId = null; }
    },

    rerender: function () {
      var host = U.$("#view-root");
      if (host) U.clear(host).appendChild(Views.library.render());
    },

    render: function () {
      var root = el("div", {});
      var parts = libraryParts();
      var part = partById(partId);
      if (part) partId = part.id;

      root.appendChild(R.pageHead(
        "The Handbook",
        "Your source text, in full — the syllabus, the tier list, the revision protocol and the resources. " +
        "The parts that are checklists live in their own tabs so you can tick them."
      ));

      /* global search */
      var searchInput = el("input", {
        class: "inp", type: "search", value: q,
        placeholder: "Search the whole handbook — “isolation grid”, “Kadane”, “TLS handshake”…",
        oninput: U.debounce(function (e) { q = e.target.value.trim(); Views.library.rerender(); }, 250)
      });
      root.appendChild(el("div", { class: "filterbar" }, [searchInput]));

      if (q.length >= 2) {
        var hits = searchAll(q);
        root.appendChild(R.sectionHead("Search results", U.plural(hits.length, "section") + " mention “" + U.esc(q) + "”"));
        if (!hits.length) return U.append(root, R.empty("No section mentions that."));
        hits.forEach(function (h) {
          root.appendChild(el("div", { class: "card", style: "margin-bottom:8px" }, [
            el("div", { class: "row" }, [
              el("div", { style: "flex:1;min-width:0" }, [
                el("div", { style: "font-weight:600", text: h.sec.title }),
                el("div", { class: "tiny muted", text: h.part.title })
              ]),
              el("button", {
                class: "btn btn-sm",
                text: OWNED[h.part.num] ? "Open tab →" : "Read →",
                onclick: function () {
                  if (OWNED[h.part.num]) { location.hash = OWNED[h.part.num]; return; }
                  q = ""; partId = h.part.id; secId = h.sec.id;
                  Views.library.rerender();
                  setTimeout(function () {
                    var n = U.$("#sec-" + h.sec.id);
                    if (n) n.scrollIntoView({ block: "start", behavior: "smooth" });
                  }, 60);
                }
              })
            ])
          ]));
        });
        return root;
      }

      /* part tabs */
      var tabs = el("div", { class: "tabs" });
      parts.forEach(function (p) {
        tabs.appendChild(el("button", {
          class: "tab", "aria-selected": p.id === partId ? "true" : "false",
          text: p.num ? "Part " + p.num : p.title,
          title: p.title,
          onclick: function () { partId = p.id; secId = null; Views.library.rerender(); window.scrollTo(0, 0); }
        }));
      });
      root.appendChild(tabs);

      if (!part) return U.append(root, R.empty("Nothing to show."));

      root.appendChild(el("h2", { style: "font-size:19px;margin-bottom:4px", text: part.title }));

      /* section index */
      if ((part.sections || []).length > 3) {
        root.appendChild(el("div", { class: "card", style: "margin:12px 0 18px" }, [
          el("div", { class: "blk-sublabel", text: "In this part" }),
          el("div", { class: "row", style: "gap:6px" }, part.sections.map(function (s) {
            return el("button", {
              class: "tag", style: "cursor:pointer",
              text: s.title.length > 46 ? s.title.slice(0, 44) + "…" : s.title,
              onclick: function () {
                var n = U.$("#sec-" + s.id);
                if (n) n.scrollIntoView({ block: "start", behavior: "smooth" });
              }
            });
          }))
        ]));
      }

      if ((part.blocks || []).length) {
        root.appendChild(el("div", { class: "doc card", style: "margin-bottom:14px" }, [R.blocks(part.blocks)]));
      }

      (part.sections || []).forEach(function (sec) {
        var card = el("div", { class: "card card-pad-lg", id: "sec-" + sec.id, style: "margin-bottom:14px" });
        card.appendChild(el("h3", { style: "font-size:16.5px;margin-bottom:10px", text: sec.title }));

        if (sec.kind === "dsa-topics") {
          card.appendChild(el("div", { class: "doc" }, [R.blocks(sec.blocks)]));
          card.appendChild(el("p", { class: "small", style: "margin-top:10px" }, [
            "All 31 topic deep-dives — patterns, signature problems and the mistakes students make — are in ",
            el("a", { href: "#/topics", text: "DSA Topics" }),
            ", where each one also carries its problem quota."
          ]));
        } else {
          card.appendChild(el("div", { class: "doc" }, [R.blocks(sec.blocks)]));
        }
        root.appendChild(card);
      });

      /* ground rules pinned into Part 1's neighbourhood */
      if (part.num === 1 && (H.groundRules || []).length) {
        root.appendChild(R.sectionHead("Ground rules", "Read once, follow for 60 days"));
        root.appendChild(el("div", { class: "card card-pad-lg" }, [
          el("ol", { class: "doc" }, H.groundRules.map(function (g) {
            return el("li", { html: g.html, style: "margin-bottom:8px" });
          }))
        ]));
      }

      return root;
    }
  };
})();
