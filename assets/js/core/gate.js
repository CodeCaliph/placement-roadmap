/* ==========================================================================
   core/gate.js — sign-in screen shown before the app boots.

   Static-site access gate (GitHub Pages has no server):
   - Only a salted SHA-256 of "id|password" lives in this file; the password
     itself appears nowhere in the code.
   - The app does not boot (nothing is rendered) until the hash matches.
   - "Keep me signed in" stores the token in localStorage, otherwise in
     sessionStorage (cleared when the tab closes).

   Limit: on a public static host the data files can still be fetched by URL.
   This keeps casual visitors out; it is not encryption.
   ========================================================================== */
(function () {
  "use strict";

  var SALT = "handbook60|";
  var EXPECT = "32f44e7ad1e5a99e25c8735f98857ec9d0b15b5c1696f8708576a7ef96b02cff";
  var KEY = "handbook60.auth";

  /* ---- SHA-256 (sync, dependency-free; works on file:// and https) ------ */
  function sha256(str) {
    var bytes = unescape(encodeURIComponent(str));          // UTF-8
    var K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var l = bytes.length, words = [], i;
    for (i = 0; i < l; i++) words[i >> 2] |= (bytes.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    words[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
    var nBlocks = ((l + 8) >> 6) + 1;
    words[nBlocks * 16 - 1] = l * 8;
    for (i = 0; i < nBlocks * 16; i++) words[i] = words[i] | 0;
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
    var W = new Array(64);
    for (var b = 0; b < nBlocks; b++) {
      for (i = 0; i < 16; i++) W[i] = words[b * 16 + i];
      for (i = 16; i < 64; i++) {
        var s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
        var s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
      }
      var a = H[0], bb = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var t2 = (S0 + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function (x) { return ("00000000" + (x >>> 0).toString(16)).slice(-8); }).join("");
  }

  function token(id, pw) { return sha256(SALT + String(id).trim().toLowerCase() + "|" + String(pw)); }

  function read(store) { try { return window[store].getItem(KEY); } catch (e) { return null; } }
  function write(store, v) { try { window[store].setItem(KEY, v); } catch (e) { /* private mode */ } }
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  var unlocked = read("localStorage") === EXPECT || read("sessionStorage") === EXPECT;
  var waiting = [];
  window.__gateLocked = !unlocked;

  function open() {
    unlocked = true;
    window.__gateLocked = false;
    var q = waiting; waiting = [];
    q.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    (window.__afterUnlock || []).forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } });
  }

  /* apply the saved theme early so the sign-in screen matches the app */
  try {
    var st = JSON.parse(localStorage.getItem("handbook60.v1") || "{}");
    if (st.theme && st.theme !== "auto") document.documentElement.setAttribute("data-theme", st.theme);
  } catch (e) { /* ignore */ }

  function render() {
    var wrap = document.createElement("div");
    wrap.className = "gate";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "gate-title");
    wrap.innerHTML =
      '<form class="gate-card" novalidate autocomplete="on">' +
      '  <div class="gate-mark" aria-hidden="true">' +
      '    <svg viewBox="0 0 32 32" width="44" height="44"><defs><linearGradient id="gate-g" x1="0" y1="0" x2="1" y2="1">' +
      '      <stop offset="0" stop-color="var(--accent-2)"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>' +
      '      <rect width="32" height="32" rx="9" fill="url(#gate-g)"/>' +
      '      <path d="M8.4 16.9l5.2 5.2L23.4 8.2" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '  </div>' +
      '  <h1 id="gate-title" class="gate-title">Sixty · Placement Handbook</h1>' +
      '  <p class="gate-sub">Sign in to continue.</p>' +
      '  <label class="gate-label" for="gate-id">ID</label>' +
      '  <input class="inp gate-inp" id="gate-id" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required>' +
      '  <label class="gate-label" for="gate-pw">Password</label>' +
      '  <div class="gate-pwrow">' +
      '    <input class="inp gate-inp" id="gate-pw" name="password" type="password" autocomplete="current-password" required>' +
      '    <button type="button" class="gate-eye" id="gate-eye" aria-label="Show password" title="Show password">Show</button>' +
      '  </div>' +
      '  <label class="gate-keep"><input type="checkbox" class="check" id="gate-keep" checked> Keep me signed in on this device</label>' +
      '  <p class="gate-err" id="gate-err" role="alert" aria-live="assertive"></p>' +
      '  <button type="submit" class="btn btn-primary gate-go" id="gate-go">Sign in</button>' +
      '</form>';
    document.body.appendChild(wrap);

    var form = wrap.querySelector("form"),
        id = wrap.querySelector("#gate-id"),
        pw = wrap.querySelector("#gate-pw"),
        keep = wrap.querySelector("#gate-keep"),
        err = wrap.querySelector("#gate-err"),
        go = wrap.querySelector("#gate-go"),
        eye = wrap.querySelector("#gate-eye");
    var fails = 0;

    eye.onclick = function () {
      var show = pw.type === "password";
      pw.type = show ? "text" : "password";
      eye.textContent = show ? "Hide" : "Show";
      eye.setAttribute("aria-label", show ? "Hide password" : "Show password");
      pw.focus();
    };

    form.onsubmit = function (ev) {
      ev.preventDefault();
      if (go.disabled) return;
      if (!id.value.trim() || !pw.value) { err.textContent = "Enter your ID and password."; (id.value.trim() ? pw : id).focus(); return; }
      var t = token(id.value, pw.value);
      if (t === EXPECT) {
        write(keep.checked ? "localStorage" : "sessionStorage", t);
        wrap.classList.add("is-out");
        setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 220);
        open();
        return;
      }
      fails++;
      pw.value = "";
      err.textContent = "That ID or password is not right.";
      form.classList.remove("is-shake"); void form.offsetWidth; form.classList.add("is-shake");
      /* gentle slow-down after repeated misses */
      if (fails >= 3) {
        var wait = Math.min(30, (fails - 2) * 5), left = wait;
        go.disabled = true;
        var tick = setInterval(function () {
          left--;
          go.textContent = left > 0 ? "Try again in " + left + "s" : "Sign in";
          if (left <= 0) { clearInterval(tick); go.disabled = false; }
        }, 1000);
        go.textContent = "Try again in " + wait + "s";
      }
      pw.focus();
    };

    setTimeout(function () { id.focus(); }, 30);
  }

  window.GATE = {
    unlocked: function () { return unlocked; },
    onUnlock: function (fn) { if (unlocked) fn(); else waiting.push(fn); },
    lock: function () { clear(); location.reload(); }
  };

  if (!unlocked) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
    else render();
  }
})();
