// ============================================================
// BeadCanvas — zeichnet ein Perlen-Gitter als realistische
// Bügelperlen (Donut/Ring mit Loch + Glanz) auf einem Pegboard.
// Reines Canvas, keine Abhängigkeiten außer paletteEntry()/hexToRgb().
// ============================================================
const BeadCanvas = (function () {
  "use strict";

  const BOARD = "#d7dce4";       // Pegboard-Grundfarbe
  const BOARD_PEG = "#c2c8d2";   // Peg-Punkt (etwas dunkler)
  const BOARD_PEG_HI = "#e8ebf0"; // Peg-Glanz

  function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

  // Mischt eine Hex-Farbe Richtung Weiß (amt>0) bzw. Schwarz (amt<0).
  function shade(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const t = amt < 0 ? 0 : 255;
    const p = Math.abs(amt);
    return `rgb(${clamp(Math.round(r + (t - r) * p))},${clamp(
      Math.round(g + (t - g) * p)
    )},${clamp(Math.round(b + (t - b) * p))})`;
  }

  // Zeichnet eine einzelne Perle in die Zelle.
  function drawBead(ctx, px, py, cell, hex, holeColor) {
    const cx = px + cell / 2;
    const cy = py + cell / 2;
    const R = cell * 0.46;

    if (cell < 4) {
      // Sehr klein: nur gefüllter Kreis (Lücke trennt die Perlen).
      ctx.fillStyle = hex;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // 3D-Körper per radialem Verlauf (Glanz oben-links).
    if (cell >= 7) {
      const grad = ctx.createRadialGradient(
        cx - R * 0.35, cy - R * 0.35, R * 0.1,
        cx, cy, R
      );
      grad.addColorStop(0, shade(hex, 0.45));
      grad.addColorStop(0.45, hex);
      grad.addColorStop(1, shade(hex, -0.30));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = hex;
    }
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Kontur für saubere Trennung.
    ctx.lineWidth = Math.max(0.6, cell * 0.045);
    ctx.strokeStyle = "rgba(0,0,0,0.30)";
    ctx.stroke();

    // Loch (Donut) — das typische Bügelperlen-Merkmal.
    const hr = R * 0.30;
    ctx.beginPath();
    ctx.arc(cx, cy, hr, 0, Math.PI * 2);
    ctx.fillStyle = holeColor;
    ctx.fill();
    if (cell >= 7) {
      ctx.lineWidth = Math.max(0.5, cell * 0.03);
      ctx.strokeStyle = "rgba(0,0,0,0.22)";
      ctx.stroke();
    }
  }

  // Zeichnet einen Peg (leeres Lochbrett-Pin).
  function drawPeg(ctx, px, py, cell) {
    if (cell < 5) return;
    const cx = px + cell / 2;
    const cy = py + cell / 2;
    const r = cell * 0.16;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = BOARD_PEG;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = BOARD_PEG_HI;
    ctx.fill();
  }

  // Hauptzeichenroutine.
  // opts: { cellSize, withBg, overlay, board }
  function drawGrid(canvas, template, opts) {
    opts = opts || {};
    const cell = opts.cellSize || 14;
    const cols = template.width;
    const rows = template.height;
    const board = opts.board || BOARD;
    const cssW = cols * cell;
    const cssH = rows * cell;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    // Pegboard-Hintergrund.
    ctx.fillStyle = board;
    ctx.fillRect(0, 0, cssW, cssH);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        drawPeg(ctx, x * cell, y * cell, cell);
      }
    }

    // Perlen.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let code = template.grid[y][x];
        if (code == null) {
          if (!opts.withBg) continue;
          code = template.bgColor;
        }
        const hex = paletteEntry(code).hex;
        // Loch zeigt den Hintergrund (Brett bzw. dunklere Perlenfarbe).
        const holeColor = shade(hex, -0.22);
        drawBead(ctx, x * cell, y * cell, cell, hex, holeColor);
      }
    }

    // 5er-Raster als Zählhilfe.
    if (opts.overlay) {
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = Math.max(1, cell * 0.06);
      ctx.beginPath();
      for (let x = 5; x < cols; x += 5) {
        ctx.moveTo(x * cell, 0);
        ctx.lineTo(x * cell, cssH);
      }
      for (let y = 5; y < rows; y += 5) {
        ctx.moveTo(0, y * cell);
        ctx.lineTo(cssW, y * cell);
      }
      ctx.stroke();
    }

    // Meta für Hit-Testing merken.
    canvas._bead = { cell, cols, rows };
    return canvas;
  }

  // Liefert die Zellkoordinate unter dem Mauszeiger (oder null).
  function hitTest(canvas, clientX, clientY) {
    const meta = canvas._bead;
    if (!meta) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * meta.cols);
    const y = Math.floor(((clientY - rect.top) / rect.height) * meta.rows);
    if (x < 0 || y < 0 || x >= meta.cols || y >= meta.rows) return null;
    return { x, y };
  }

  // Rendert in einen frischen Off-Canvas und gibt ihn zurück (für Druck/Export).
  function toCanvas(template, opts) {
    const c = document.createElement("canvas");
    drawGrid(c, template, opts);
    return c;
  }

  function toDataURL(template, opts) {
    return toCanvas(template, opts).toDataURL("image/png");
  }

  return { drawGrid, hitTest, toCanvas, toDataURL, shade, BOARD };
})();
