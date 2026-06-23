// ============================================================
// Converter — Bild -> Bügelperlen-Vorlage.
// Skaliert ein Bild auf ein Perlen-Raster und mappt jede Zelle
// auf die nächste Artkal-Farbe (optional Floyd-Steinberg-Dithering).
// ============================================================
const Converter = (function () {
  "use strict";

  let el = {};
  let onSaved = null;
  let srcImage = null;     // geladenes Image-Objekt
  let current = null;      // erzeugte Vorlage {width,height,grid,bgColor,name}

  function $(id) { return document.getElementById(id); }

  function cacheDom() {
    if (el.cached) return;
    el = {
      backdrop: $("converter-backdrop"),
      file: $("conv-file"),
      width: $("conv-width"), widthVal: $("conv-width-val"),
      bright: $("conv-bright"), contrast: $("conv-contrast"),
      transparent: $("conv-transparent"), threshold: $("conv-threshold"),
      dither: $("conv-dither"),
      preview: $("conv-preview"),
      materials: $("conv-materials"),
      meta: $("conv-meta"),
      edit: $("conv-edit"), save: $("conv-save"), print: $("conv-print"),
      cached: true,
    };
    bind();
  }

  function bind() {
    el.file.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => { srcImage = img; current && (current.name = f.name.replace(/\.[^.]+$/, "")); regenerate(f.name.replace(/\.[^.]+$/, "")); };
      img.src = URL.createObjectURL(f);
    });
    [el.width, el.bright, el.contrast, el.threshold].forEach((c) =>
      c.addEventListener("input", () => regenerate()));
    [el.transparent, el.dither].forEach((c) =>
      c.addEventListener("change", () => regenerate()));
    el.width.addEventListener("input", () => { el.widthVal.textContent = el.width.value; });

    el.edit.addEventListener("click", () => {
      if (!current) return;
      Converter.close();
      Editor.open(current, onSaved);
    });
    el.save.addEventListener("click", () => {
      if (!current) return;
      const name = prompt("Name der Vorlage:", current.name || "Bild-Vorlage");
      if (name == null) return;
      Store.saveCustom({
        name: name.trim() || "Bild-Vorlage", game: "Meine Vorlagen", category: "Eigene",
        width: current.width, height: current.height, bgColor: "A-001", grid: current.grid,
      });
      if (onSaved) onSaved();
      flash(el.save, "Gespeichert!");
    });
    el.print.addEventListener("click", () => {
      if (current && window.printTemplate) window.printTemplate(current, false, true);
    });
    document.querySelectorAll('[data-close="converter"]').forEach((b) =>
      b.addEventListener("click", close));
    el.backdrop.addEventListener("click", (e) => { if (e.target === el.backdrop) close(); });
  }

  // Helligkeit/Kontrast auf einen Kanal anwenden.
  function adjust(v, bright, contrast) {
    v = v + bright;
    v = (v - 128) * contrast + 128;
    return v < 0 ? 0 : v > 255 ? 255 : v;
  }

  function regenerate(forceName) {
    if (!srcImage) return;
    const targetW = parseInt(el.width.value, 10);
    const ratio = srcImage.height / srcImage.width;
    const targetH = Math.max(1, Math.round(targetW * ratio));
    const bright = parseInt(el.bright.value, 10);
    const contrast = parseInt(el.contrast.value, 10) / 100; // 0.5..2.0
    const useTransparent = el.transparent.checked;
    const thr = parseInt(el.threshold.value, 10); // Helligkeitsschwelle
    const useDither = el.dither.checked;

    // Auf Zielgröße herunterrechnen.
    const off = document.createElement("canvas");
    off.width = targetW; off.height = targetH;
    const octx = off.getContext("2d");
    octx.imageSmoothingEnabled = true;
    octx.drawImage(srcImage, 0, 0, targetW, targetH);
    const data = octx.getImageData(0, 0, targetW, targetH);
    const px = data.data;

    // Helligkeit/Kontrast vorab anwenden (Float-Puffer für Dithering).
    const buf = new Float32Array(targetW * targetH * 3);
    const alpha = new Uint8Array(targetW * targetH);
    for (let i = 0, j = 0; i < px.length; i += 4, j += 3) {
      buf[j] = adjust(px[i], bright, contrast);
      buf[j + 1] = adjust(px[i + 1], bright, contrast);
      buf[j + 2] = adjust(px[i + 2], bright, contrast);
      alpha[i / 4] = px[i + 3];
    }

    const grid = [];
    for (let y = 0; y < targetH; y++) {
      const row = [];
      for (let x = 0; x < targetW; x++) {
        const idx = y * targetW + x;
        const j = idx * 3;
        const r = buf[j], g = buf[j + 1], b = buf[j + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Transparenz: durchsichtige oder (optional) sehr helle Pixel auslassen.
        if (alpha[idx] < 64 || (useTransparent && lum >= thr)) {
          row.push(null);
          continue;
        }
        const code = nearestPaletteCode(Math.round(r), Math.round(g), Math.round(b));
        row.push(code);
        if (useDither) {
          const chosen = hexToRgb(PALETTE[code].hex);
          const er = r - chosen.r, eg = g - chosen.g, eb = b - chosen.b;
          spread(buf, targetW, targetH, x + 1, y, er, eg, eb, 7 / 16);
          spread(buf, targetW, targetH, x - 1, y + 1, er, eg, eb, 3 / 16);
          spread(buf, targetW, targetH, x, y + 1, er, eg, eb, 5 / 16);
          spread(buf, targetW, targetH, x + 1, y + 1, er, eg, eb, 1 / 16);
        }
      }
      grid.push(row);
    }

    current = {
      name: forceName || (current && current.name) || "Bild-Vorlage",
      game: "Meine Vorlagen", category: "Eigene",
      width: targetW, height: targetH, bgColor: "A-001", grid,
    };
    showPreview();
  }

  function spread(buf, w, h, x, y, er, eg, eb, f) {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const j = (y * w + x) * 3;
    buf[j] += er * f; buf[j + 1] += eg * f; buf[j + 2] += eb * f;
  }

  function showPreview() {
    // Vorschau-Canvas (Zellgröße an Containerbreite anpassen).
    el.preview.innerHTML = "";
    const canvas = document.createElement("canvas");
    el.preview.appendChild(canvas);
    const maxW = el.preview.clientWidth || 420;
    const cell = Math.max(3, Math.min(14, Math.floor(maxW / current.width)));
    BeadCanvas.drawGrid(canvas, current, { cellSize: cell });

    // Materialliste + Meta über die globalen Helfer (app.js).
    const counts = window.countBeads(current.grid);
    const total = window.sumCounts(counts);
    el.meta.textContent = `${current.width}×${current.height} · ${total} Perlen · ${Object.keys(counts).length} Farben`;
    el.materials.innerHTML = "";
    el.materials.appendChild(window.buildMaterialsTable(counts));
  }

  function flash(btn, msg) {
    const o = btn.textContent; btn.textContent = msg;
    setTimeout(() => { btn.textContent = o; }, 1400);
  }

  function open(savedCb) {
    cacheDom();
    onSaved = savedCb || null;
    el.widthVal.textContent = el.width.value;
    el.backdrop.classList.add("open");
  }
  function close() { el.backdrop.classList.remove("open"); }

  return { open, close };
})();
