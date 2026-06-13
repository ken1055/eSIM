/* =====================================================
   qr.js — Shared mock-QR renderer (UI only)
   Draws a QR-looking pattern from a seed string.
   NOT a real eSIM profile.
   ===================================================== */
(function () {
  'use strict';
  window.GJEsim = window.GJEsim || {};

  window.GJEsim.drawMockQR = function (canvas, seedStr) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var N = 25, S = canvas.width / N;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#151515';

    var seed = 0;
    seedStr = String(seedStr || 'GJE');
    for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

    function finder(x, y) {
      ctx.fillStyle = '#151515'; ctx.fillRect(x * S, y * S, S * 7, S * 7);
      ctx.fillStyle = '#fff';    ctx.fillRect((x + 1) * S, (y + 1) * S, S * 5, S * 5);
      ctx.fillStyle = '#151515'; ctx.fillRect((x + 2) * S, (y + 2) * S, S * 3, S * 3);
    }
    function inFinder(x, y) {
      return (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    }
    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N; y++) {
        if (inFinder(x, y)) continue;
        if (rnd() > 0.52) ctx.fillRect(x * S, y * S, S, S);
      }
    }
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  };
})();
