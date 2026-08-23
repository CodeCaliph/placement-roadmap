/* ==========================================================================
   util.js — DOM + formatting helpers. Global namespace: window.U
   ========================================================================== */
(function () {
  "use strict";

  var U = {};

  /* ---- DOM ---- */
  U.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k === "text") node.textContent = v;
        else if (k === "dataset") Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
        else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2), v);
        else if (v === true) node.setAttribute(k, "");
        else node.setAttribute(k, v);
      });
    }
    U.append(node, children);
    return node;
  };

  U.append = function (node, children) {
    if (children === null || children === undefined || children === false) return node;
    if (Array.isArray(children)) {
      children.forEach(function (c) { U.append(node, c); });
      return node;
    }
    node.appendChild(children.nodeType ? children : document.createTextNode(String(children)));
    return node;
  };

  U.frag = function (children) {
    var f = document.createDocumentFragment();
    U.append(f, children);
    return f;
  };

  U.clear = function (node) { while (node.firstChild) node.removeChild(node.firstChild); return node; };
  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  U.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /* ---- numbers & text ---- */
  U.pct = function (done, total) { return total > 0 ? Math.round((done / total) * 100) : 0; };

  U.compact = function (n) {
    n = Number(n) || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + "M";
    if (n >= 1e4) return (n / 1e3).toFixed(n % 1e3 ? 1 : 0) + "K";
    return String(Math.round(n));
  };

  U.plural = function (n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); };

  U.hours = function (h) {
    h = Number(h) || 0;
    if (h < 1 && h > 0) return Math.round(h * 60) + "m";
    return (Math.round(h * 10) / 10) + "h";
  };

  U.clock = function (seconds) {
    var s = Math.max(0, Math.floor(seconds));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    var p = function (v) { return (v < 10 ? "0" : "") + v; };
    return (h > 0 ? h + ":" + p(m) : m) + ":" + p(x);
  };

  U.slug = function (s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  /* ---- dates (local, no timezone drift) ---- */
  U.todayKey = function (d) {
    d = d || new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  };

  U.parseKey = function (key) {
    if (!key) return null;
    var p = String(key).split("-");
    if (p.length !== 3) return null;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return isNaN(d.getTime()) ? null : d;
  };

  U.dayDiff = function (aKey, bKey) {
    var a = U.parseKey(aKey), b = U.parseKey(bKey);
    if (!a || !b) return null;
    return Math.round((b - a) / 86400000);
  };

  U.addDays = function (key, n) {
    var d = U.parseKey(key);
    if (!d) return null;
    d.setDate(d.getDate() + n);
    return U.todayKey(d);
  };

  U.prettyDate = function (key) {
    var d = U.parseKey(key);
    if (!d) return "—";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  U.shortDate = function (key) {
    var d = U.parseKey(key);
    if (!d) return "—";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  };

  U.weekday = function (key) {
    var d = U.parseKey(key);
    return d ? d.toLocaleDateString(undefined, { weekday: "long" }) : "";
  };

  /* ---- misc ---- */
  U.debounce = function (fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms || 180);
    };
  };

  U.uid = function () {
    return "x" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  };

  U.download = function (filename, text, mime) {
    var blob = new Blob([text], { type: mime || "application/json" });
    var url = URL.createObjectURL(blob);
    var a = U.el("a", { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 400);
  };

  /** Place a fixed popover next to an anchor, always clamped inside the
   *  viewport. Prefers above the anchor, falls back to below, and never lets
   *  a stale or odd rect push the panel out of sight. */
  U.place = function (panel, anchor) {
    var r = anchor.getBoundingClientRect();
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = r.top - h - 10;
    if (top < 8) top = r.bottom + 10;
    top = Math.max(8, Math.min(top, Math.max(8, vh - h - 8)));
    var left = Math.max(8, Math.min(r.left, Math.max(8, vw - w - 8)));
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  };

  U.toast = function (msg, kind) {
    var host = U.$("#toasts");
    if (!host) return;
    var icon = kind === "good" ? "✔" : kind === "bad" ? "!" : "";
    var t = U.el("div", { class: "toast" }, [icon ? U.el("span", { text: icon }) : null, U.el("span", { text: msg })]);
    host.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .25s";
      t.style.opacity = "0";
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, 2200);
  };

  /* fuzzy-ish scoring for the command palette */
  U.match = function (haystack, needle) {
    if (!needle) return 0;
    var h = haystack.toLowerCase(), n = needle.toLowerCase();
    var i = h.indexOf(n);
    if (i === 0) return 100;
    if (i > 0) return 70 - Math.min(i, 40) / 4;
    // subsequence
    var hi = 0, hits = 0;
    for (var k = 0; k < n.length; k++) {
      var j = h.indexOf(n[k], hi);
      if (j < 0) return -1;
      hits++; hi = j + 1;
    }
    return hits === n.length ? 30 : -1;
  };

  window.U = U;
})();
