/* ==========================================================================
   charts.js — hand-rolled inline SVG. No libraries, works offline.
   Specs: 2px lines, r>=4 markers with a 2px surface ring, hairline solid
   gridlines, legend for >=2 series, direct end labels, hover crosshair.
   Global namespace: window.C
   ========================================================================== */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var C = {};

  function svgEl(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined) return;
      n.setAttribute(k, attrs[k]);
    });
    return n;
  }

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* SVG presentation attributes don't reliably accept var() — resolve first. */
  function color(v, fallback) {
    var m = /^var\(\s*(--[\w-]+)\s*\)$/.exec(String(v || "").trim());
    return m ? token(m[1], fallback || "#2a78d6") : (v || fallback);
  }

  /* ======================================================================
     Line chart — trend over time, 1–2 series
     opts: { labels:[], series:[{name, color, values:[num|null]}],
             yMax, yTicks, height, valueSuffix, aria }
     ====================================================================== */
  C.line = function (opts) {
    var host = U.el("div", { class: "chart" });
    var tip = U.el("div", { class: "chart-tip" });
    host.appendChild(tip);

    function draw() {
      var w = Math.max(280, host.clientWidth || 640);
      var h = opts.height || 250;
      var padL = 34, padR = 54, padT = 14, padB = 26;
      var iw = w - padL - padR, ih = h - padT - padB;
      var yMax = opts.yMax || 100;
      var ticks = opts.yTicks || [0, 25, 50, 75, 100];

      var ink3 = token("--ink-3", "#898781");
      var gridC = token("--line", "#e1e0d9");
      var axisC = token("--line-2", "#c3c2b7");
      var surf = token("--surface-1", "#fcfcfb");
      var inkC = token("--ink", "#0b0b0b");

      var n = opts.labels.length;
      var xOf = function (i) { return padL + (n === 1 ? iw / 2 : (iw * i) / (n - 1)); };
      var yOf = function (v) { return padT + ih - (ih * v) / yMax; };

      var old = host.querySelector("svg");
      if (old) host.removeChild(old);

      var svg = svgEl("svg", {
        viewBox: "0 0 " + w + " " + h, width: w, height: h,
        role: "img", "aria-label": opts.aria || "line chart"
      });

      // gridlines + y ticks
      ticks.forEach(function (t) {
        var y = yOf(t);
        svg.appendChild(svgEl("line", {
          x1: padL, x2: padL + iw, y1: y, y2: y,
          stroke: t === 0 ? axisC : gridC, "stroke-width": 1
        }));
        var lab = svgEl("text", {
          x: padL - 8, y: y + 3.5, "text-anchor": "end",
          fill: ink3, "font-size": 10.5, "font-family": "inherit",
          style: "font-variant-numeric:tabular-nums"
        });
        lab.textContent = t;
        svg.appendChild(lab);
      });

      // x labels
      opts.labels.forEach(function (l, i) {
        var t = svgEl("text", {
          x: xOf(i), y: h - 7, "text-anchor": "middle",
          fill: ink3, "font-size": 10.5, "font-family": "inherit"
        });
        t.textContent = l;
        svg.appendChild(t);
      });

      // series
      var endLabels = [];
      opts.series.forEach(function (s) {
        var stroke = color(s.color);
        var pts = [];
        s.values.forEach(function (v, i) {
          if (v === null || v === undefined) return;
          pts.push({ i: i, x: xOf(i), y: yOf(v), v: v });
        });
        if (!pts.length) return;

        // path across contiguous runs only
        var d = "", prevI = null;
        pts.forEach(function (p) {
          d += (prevI === null || p.i !== prevI + 1 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " ";
          prevI = p.i;
        });
        svg.appendChild(svgEl("path", {
          d: d.trim(), fill: "none", stroke: stroke, "stroke-width": 2,
          "stroke-linejoin": "round", "stroke-linecap": "round",
          "stroke-dasharray": s.dashed ? "5 4" : null
        }));

        // markers: 2px surface ring keeps them legible where they overlap
        pts.forEach(function (p) {
          svg.appendChild(svgEl("circle", {
            cx: p.x, cy: p.y, r: 4.5, fill: stroke, stroke: surf, "stroke-width": 2
          }));
        });

        // direct end label — collected, then de-collided below
        var last = pts[pts.length - 1];
        if (s.labelLast !== false) endLabels.push({ x: last.x, y: last.y, v: last.v });
      });

      /* Labels that would stack on top of each other are dropped rather than
         nudged apart — a detached label reads as noise. The tooltip and the
         table view still carry every value, so nothing is gated. Later series
         win, because the reader's own score is the story. */
      endLabels.slice().reverse().forEach(function (lab, ri) {
        var kept = endLabels.length - 1 - ri;
        var collides = endLabels.some(function (other, oi) {
          return oi > kept && Math.abs(other.x - lab.x) < 26 && Math.abs(other.y - lab.y) < 13;
        });
        if (collides) return;
        var t = svgEl("text", {
          x: lab.x + 9, y: lab.y + 3.5, fill: inkC,
          "font-size": 11.5, "font-weight": 650, "font-family": "inherit",
          style: "font-variant-numeric:tabular-nums"
        });
        t.textContent = lab.v + (opts.valueSuffix || "");
        svg.appendChild(t);
      });

      // hover crosshair
      var cross = svgEl("line", {
        y1: padT, y2: padT + ih, stroke: axisC, "stroke-width": 1, opacity: 0
      });
      svg.appendChild(cross);

      var hit = svgEl("rect", {
        x: padL, y: padT, width: iw, height: ih, fill: "transparent", style: "cursor:crosshair"
      });
      svg.appendChild(hit);

      function nearest(clientX) {
        var box = svg.getBoundingClientRect();
        var rel = ((clientX - box.left) / box.width) * w;
        var best = 0, bd = Infinity;
        for (var i = 0; i < n; i++) {
          var d2 = Math.abs(xOf(i) - rel);
          if (d2 < bd) { bd = d2; best = i; }
        }
        return best;
      }

      function show(e) {
        var i = nearest(e.clientX);
        var box = svg.getBoundingClientRect();
        var scale = box.width / w;
        cross.setAttribute("x1", xOf(i));
        cross.setAttribute("x2", xOf(i));
        cross.setAttribute("opacity", 1);
        var rows = opts.series.map(function (s) {
          var v = s.values[i];
          return U.el("div", { class: "tip-row" }, [
            U.el("i", { class: "tip-dot", style: "background:" + s.color }),
            U.el("span", { text: s.name + " " }),
            U.el("b", { text: v === null || v === undefined ? "—" : v + (opts.valueSuffix || "") })
          ]);
        });
        U.clear(tip);
        U.append(tip, [U.el("div", { style: "font-weight:650;margin-bottom:3px" , text: opts.tipPrefix ? opts.tipPrefix + " " + opts.labels[i] : opts.labels[i] })].concat(rows));
        tip.style.left = (xOf(i) * scale) + "px";
        tip.style.top = (padT * scale - 8) + "px";
        tip.classList.add("on");
      }

      hit.addEventListener("mousemove", show);
      hit.addEventListener("mouseleave", function () {
        tip.classList.remove("on");
        cross.setAttribute("opacity", 0);
      });

      host.appendChild(svg);
    }

    draw();
    var redraw = U.debounce(draw, 120);
    if (window.ResizeObserver) { new ResizeObserver(redraw).observe(host); }
    else { window.addEventListener("resize", redraw); }

    var wrap = U.el("div", {}, [host]);
    if (opts.series.length >= 2) {
      wrap.appendChild(U.el("div", { class: "legend" }, opts.series.map(function (s) {
        return U.el("span", { class: "legend-item" }, [
          U.el("i", { class: "legend-key", style: "background:" + s.color }),
          s.name
        ]);
      })));
    }
    return wrap;
  };

  /* ======================================================================
     60-day heat strip — one sequential hue, four ordinal steps
     ====================================================================== */
  C.heat = function (opts) {
    var grid = U.el("div", { class: "heat" });
    (window.HANDBOOK.days || []).forEach(function (d) {
      var p = S.dayProgress(d);
      var level = p.total === 0 ? 0
        : p.done === 0 ? 0
        : p.complete ? 4
        : p.pct >= 66 ? 3 : p.pct >= 34 ? 2 : 1;
      var cell = U.el("button", {
        class: "heat-cell" + (opts && opts.today === d.day ? " is-today" : ""),
        dataset: { p: level, day: d.day },
        title: "Day " + d.day + " — " + d.title + "\n" + p.done + "/" + p.total + " blocks done",
        "aria-label": "Day " + d.day + ", " + p.done + " of " + p.total + " blocks done",
        onclick: function () { location.hash = "#/plan/" + d.day; }
      });
      grid.appendChild(cell);
    });
    return U.el("div", {}, [
      grid,
      U.el("div", { class: "heat-legend", style: "margin-top:10px" }, [
        U.el("span", { text: "Not started" }),
        U.el("i", { "data-p": "0", style: "background:var(--surface-2)" }),
        U.el("i", { "data-p": "1" }), U.el("i", { "data-p": "2" }),
        U.el("i", { "data-p": "3" }), U.el("i", { "data-p": "4" }),
        U.el("span", { text: "All 4 blocks done" })
      ])
    ]);
  };

  window.C = C;
})();
