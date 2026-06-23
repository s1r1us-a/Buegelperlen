// ============================================================
// Editor — Bügelperlen-Vorlagen selbst malen.
// Werkzeuge: Stift, Füllen, Pipette, Radierer. Undo/Redo.
// Speichern als eigene Vorlage (localStorage via Store).
// Erwartet die zugehörigen DOM-Elemente aus index.html.
// ============================================================
const Editor = (function () {
  "use strict";

  const MAX = 64;
  let el = {};            // gecachte DOM-Knoten
  let onSaved = null;     // Callback nach dem Speichern
  const st = {
    w: 16, h: 16,
    grid: [],             // 2D: Code oder null
    code: "A-006",        // aktive Farbe
    tool: "pencil",
    editId: null,
    name: "Meine Vorlage",
    painting: false,
    undo: [], redo: [],
  };

  function $(id) { return document.getElementById(id); }

  function cacheDom() {
    if (el.cached) return;
    el = {
      backdrop: $("editor-backdrop"),
      w: $("editor-w"), h: $("editor-h"), neu: $("editor-new"),
      tools: $("editor-tools"),
      palette: $("editor-palette"),
      canvas: $("editor-canvas"),
      count: $("editor-count"),
      undo: $("editor-undo"), redo: $("editor-redo"),
      save: $("editor-save"), png: $("editor-png"), print: $("editor-print"),
      cached: true,
    };
    buildPalette();
    bind();
  }

  function buildPalette() {
    el.palette.innerHTML = "";
    // Radierer zuerst.
    const eraser = mkSwatch(null, "Radierer");
    el.palette.appendChild(eraser);
    for (const code of Object.keys(PALETTE)) {
      el.palette.appendChild(mkSwatch(code, code + " · " + PALETTE[code].name));
    }
    highlightActive();
  }

  function mkSwatch(code, title) {
    const b = document.createElement("button");
    b.className = "edit-swatch" + (code == null ? " eraser" : "");
    b.title = title;
    b.dataset.code = code == null ? "" : code;
    if (code != null) b.style.background = PALETTE[code].hex;
    else b.textContent = "⌫";
    b.addEventListener("click", () => {
      if (code == null) { st.tool = "eraser"; }
      else { st.code = code; if (st.tool === "eraser") st.tool = "pencil"; }
      highlightActive();
      highlightTool();
    });
    return b;
  }

  function highlightActive() {
    el.palette.querySelectorAll(".edit-swatch").forEach((b) => {
      const isActive = st.tool === "eraser" ? b.dataset.code === "" : b.dataset.code === st.code;
      b.classList.toggle("active", isActive);
    });
  }

  function highlightTool() {
    el.tools.querySelectorAll("[data-tool]").forEach((b) =>
      b.classList.toggle("active", b.dataset.tool === st.tool));
  }

  function bind() {
    el.neu.addEventListener("click", () => {
      const w = clampSize(parseInt(el.w.value, 10));
      const h = clampSize(parseInt(el.h.value, 10));
      st.w = w; st.h = h; st.editId = null; st.name = "Meine Vorlage";
      st.grid = emptyGrid(w, h);
      st.undo = []; st.redo = [];
      render();
    });
    el.tools.querySelectorAll("[data-tool]").forEach((b) =>
      b.addEventListener("click", () => { st.tool = b.dataset.tool; highlightTool(); highlightActive(); }));

    el.canvas.addEventListener("mousedown", (e) => { pushUndo(); st.painting = true; paintAt(e); });
    window.addEventListener("mouseup", () => { st.painting = false; });
    el.canvas.addEventListener("mousemove", (e) => { if (st.painting) paintAt(e); });
    // Touch
    el.canvas.addEventListener("touchstart", (e) => { pushUndo(); st.painting = true; paintAt(e.touches[0]); e.preventDefault(); }, { passive: false });
    el.canvas.addEventListener("touchmove", (e) => { if (st.painting) { paintAt(e.touches[0]); e.preventDefault(); } }, { passive: false });
    window.addEventListener("touchend", () => { st.painting = false; });

    el.undo.addEventListener("click", undo);
    el.redo.addEventListener("click", redo);
    el.save.addEventListener("click", save);
    el.png.addEventListener("click", exportPng);
    el.print.addEventListener("click", () => {
      if (window.printTemplate) window.printTemplate(currentTemplate(), false, true);
    });
    document.querySelectorAll('[data-close="editor"]').forEach((b) =>
      b.addEventListener("click", close));
    el.backdrop.addEventListener("click", (e) => { if (e.target === el.backdrop) close(); });
  }

  function clampSize(n) { return Math.max(4, Math.min(MAX, n || 16)); }
  function emptyGrid(w, h) {
    return Array.from({ length: h }, () => Array.from({ length: w }, () => null));
  }

  function paintAt(pt) {
    const hit = BeadCanvas.hitTest(el.canvas, pt.clientX, pt.clientY);
    if (!hit) return;
    const cur = st.grid[hit.y][hit.x];
    if (st.tool === "pipette") {
      if (cur != null) { st.code = cur; st.tool = "pencil"; highlightActive(); highlightTool(); }
      return;
    }
    if (st.tool === "fill") {
      floodFill(hit.x, hit.y, cur, st.code);
    } else {
      const val = st.tool === "eraser" ? null : st.code;
      st.grid[hit.y][hit.x] = val;
    }
    render();
  }

  function floodFill(x, y, target, replacement) {
    if (target === replacement) return;
    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= st.w || cy >= st.h) continue;
      if (st.grid[cy][cx] !== target) continue;
      st.grid[cy][cx] = replacement;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  function snapshot() { return JSON.stringify(st.grid); }
  function pushUndo() { st.undo.push(snapshot()); if (st.undo.length > 60) st.undo.shift(); st.redo = []; }
  function undo() {
    if (!st.undo.length) return;
    st.redo.push(snapshot());
    st.grid = JSON.parse(st.undo.pop());
    render();
  }
  function redo() {
    if (!st.redo.length) return;
    st.undo.push(snapshot());
    st.grid = JSON.parse(st.redo.pop());
    render();
  }

  function currentTemplate() {
    return {
      id: st.editId, name: st.name, game: "Meine Vorlagen", category: "Eigene",
      width: st.w, height: st.h, bgColor: "A-001", grid: st.grid,
    };
  }

  function render() {
    const wrapW = el.canvas.parentElement.clientWidth || 480;
    const cell = Math.max(8, Math.min(28, Math.floor((wrapW - 8) / st.w)));
    BeadCanvas.drawGrid(el.canvas, currentTemplate(), { cellSize: cell, overlay: true });
    let n = 0;
    for (const row of st.grid) for (const c of row) if (c != null) n++;
    el.count.textContent = `${st.w}×${st.h} · ${n} Perlen`;
    el.w.value = st.w; el.h.value = st.h;
  }

  function save() {
    const name = prompt("Name der Vorlage:", st.name);
    if (name == null) return;
    st.name = name.trim() || "Meine Vorlage";
    const tpl = currentTemplate();
    st.editId = Store.saveCustom(tpl);
    if (onSaved) onSaved();
    flash(el.save, "Gespeichert!");
  }

  function exportPng() {
    const url = BeadCanvas.toDataURL(currentTemplate(), { cellSize: 16, overlay: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = (st.name || "vorlage").replace(/\s+/g, "_") + ".png";
    a.click();
  }

  function flash(btn, msg) {
    const o = btn.textContent; btn.textContent = msg;
    setTimeout(() => { btn.textContent = o; }, 1400);
  }

  function open(template, savedCb) {
    cacheDom();
    onSaved = savedCb || null;
    if (template) {
      st.w = template.width; st.h = template.height;
      st.grid = template.grid.map((row) => row.slice());
      st.editId = (template.id && template.id.indexOf("custom-") === 0) ? template.id : null;
      st.name = template.name || "Meine Vorlage";
    } else {
      st.w = 16; st.h = 16; st.grid = emptyGrid(16, 16); st.editId = null; st.name = "Meine Vorlage";
    }
    st.undo = []; st.redo = [];
    if (st.tool === "eraser") st.tool = "pencil";
    highlightTool();
    highlightActive();
    el.backdrop.classList.add("open");
    render();
  }

  function close() { el.backdrop.classList.remove("open"); }

  return { open, close };
})();
