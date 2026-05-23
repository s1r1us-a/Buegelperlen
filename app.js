(function () {
  "use strict";

  // ============================================================
  // State
  // ============================================================
  const state = {
    game: "all",
    category: "Alle",
    sortBy: "name-asc",
    detail: { id: null, withBg: false, overlay: false },
  };

  // ============================================================
  // Helpers
  // ============================================================

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "class") node.className = attrs[k];
        else if (k === "dataset") Object.assign(node.dataset, attrs[k]);
        else if (k.startsWith("on") && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (k === "style" && typeof attrs[k] === "object") {
          Object.assign(node.style, attrs[k]);
        } else {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children != null) {
      const arr = Array.isArray(children) ? children : [children];
      for (const c of arr) {
        if (c == null) continue;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      }
    }
    return node;
  }

  function countBeads(grid, bgColor) {
    const counts = {};
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        let code = grid[y][x];
        if (code == null) {
          if (bgColor == null) continue;
          code = bgColor;
        }
        counts[code] = (counts[code] || 0) + 1;
      }
    }
    return counts;
  }

  function sumCounts(counts) {
    return Object.values(counts).reduce((a, b) => a + b, 0);
  }

  function paletteEntry(code) {
    return PALETTE[code] || { name: code, hex: "#FF00FF" };
  }

  // ============================================================
  // Render: Pixel Grid
  // ============================================================

  function buildPixelGrid(template, opts) {
    const { withBg = false, pixelSize = null, overlay = false, withTooltip = false } = opts || {};
    const cols = template.width;
    const rows = template.height;
    const gridEl = el("div", { class: "pixel-grid" });
    if (overlay) gridEl.classList.add("with-overlay");

    gridEl.style.gridTemplateColumns = `repeat(${cols}, ${pixelSize ? pixelSize + "px" : "1fr"})`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, ${pixelSize ? pixelSize + "px" : "1fr"})`;
    if (pixelSize) {
      gridEl.style.width = (cols * pixelSize) + "px";
      gridEl.style.height = (rows * pixelSize) + "px";
    } else {
      gridEl.style.width = "100%";
      gridEl.style.maxWidth = (cols * 16) + "px";
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let code = template.grid[y][x];
        const isEmpty = code == null;
        if (isEmpty && withBg) code = template.bgColor;

        const pixel = el("div", { class: "pixel" });
        if (code != null) {
          pixel.style.background = paletteEntry(code).hex;
        } else {
          pixel.style.background = "transparent";
        }

        if (overlay) {
          if ((x + 1) % 5 === 0 && x < cols - 1) pixel.classList.add("gridmark-x");
          if ((y + 1) % 5 === 0 && y < rows - 1) pixel.classList.add("gridmark-y");
        }

        if (withTooltip && code != null) {
          const p = paletteEntry(code);
          pixel.dataset.tooltip = `${code} · ${p.name}`;
        }

        gridEl.appendChild(pixel);
      }
    }
    return gridEl;
  }

  // ============================================================
  // Render: Materials Table
  // ============================================================

  function buildMaterialsTable(counts, opts) {
    const { showHex = false } = opts || {};
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = sumCounts(counts);

    const head = el("thead", null, el("tr", null, [
      el("th", null, "Farbe"),
      el("th", null, "Artikel-Nr."),
      el("th", null, "Name"),
      showHex ? el("th", null, "Hex") : null,
      el("th", null, "Anzahl"),
    ]));

    const body = el("tbody", null, entries.map(([code, n]) => {
      const p = paletteEntry(code);
      return el("tr", null, [
        el("td", null, el("span", { class: "swatch", style: { background: p.hex } })),
        el("td", null, code),
        el("td", null, p.name),
        showHex ? el("td", null, p.hex) : null,
        el("td", { class: "count" }, String(n)),
      ]);
    }));

    const foot = el("tfoot", null, el("tr", null, [
      el("td", { colspan: showHex ? 4 : 3 }, "Gesamt"),
      el("td", { class: "count" }, String(total)),
    ]));

    return el("table", { class: "materials" }, [head, body, foot]);
  }

  // ============================================================
  // Render: Gallery
  // ============================================================

  function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    const filtered = TEMPLATES
      .filter(t => state.game === "all" || t.game === state.game)
      .filter(t => state.category === "Alle" || t.category === state.category);

    const sorted = filtered.slice().sort((a, b) => {
      switch (state.sortBy) {
        case "name-asc":   return a.name.localeCompare(b.name, "de");
        case "name-desc":  return b.name.localeCompare(a.name, "de");
        case "size-asc":   return (a.width * a.height) - (b.width * b.height);
        case "size-desc":  return (b.width * b.height) - (a.width * a.height);
        case "beads-asc":  return sumCounts(countBeads(a.grid)) - sumCounts(countBeads(b.grid));
        case "beads-desc": return sumCounts(countBeads(b.grid)) - sumCounts(countBeads(a.grid));
        default: return 0;
      }
    });

    if (sorted.length === 0) {
      gallery.appendChild(el("p", { class: "card-meta" }, "Keine Vorlagen passen zu den Filtern."));
      return;
    }

    for (const t of sorted) {
      const beadCount = sumCounts(countBeads(t.grid));
      const card = el("div", { class: "card" }, [
        el("h2", { class: "card-name" }, t.name),
        el("p", { class: "card-meta" }, [
          `${t.width}×${t.height} · ${beadCount} Perlen`,
          el("span", { class: "category" }, t.category),
        ]),
        el("div", { class: "card-preview-wrap" },
          buildPixelGrid(t, { withBg: false, pixelSize: Math.min(12, Math.floor(220 / t.width)) })),
        el("div", { class: "card-actions" }, [
          el("button", {
            class: "btn",
            onClick: () => openDetail(t.id),
          }, "Details"),
          el("button", {
            class: "btn btn-secondary",
            onClick: () => printSingle(t.id),
          }, "Drucken"),
        ]),
      ]);
      gallery.appendChild(card);
    }
  }

  // ============================================================
  // Filter / Sort Wiring
  // ============================================================

  function setupToolbar() {
    const games = ["all", ...new Set(TEMPLATES.map(t => t.game))];
    const gameSel = document.getElementById("filter-game");
    gameSel.innerHTML = "";
    for (const g of games) {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g === "all" ? "Alle Spiele" : g;
      gameSel.appendChild(opt);
    }
    gameSel.addEventListener("change", e => {
      state.game = e.target.value;
      renderGallery();
    });

    const catGroup = document.getElementById("filter-categories");
    const cats = ["Alle", ...new Set(TEMPLATES.map(t => t.category))];
    for (const c of cats) {
      const btn = el("button", {
        class: "pill" + (c === state.category ? " active" : ""),
        dataset: { cat: c },
        onClick: () => {
          state.category = c;
          catGroup.querySelectorAll(".pill").forEach(p =>
            p.classList.toggle("active", p.dataset.cat === c));
          renderGallery();
        },
      }, c);
      catGroup.appendChild(btn);
    }

    const sortSel = document.getElementById("sort-by");
    sortSel.addEventListener("change", e => {
      state.sortBy = e.target.value;
      renderGallery();
    });
  }

  // ============================================================
  // Detail Modal
  // ============================================================

  function openDetail(id) {
    state.detail.id = id;
    state.detail.withBg = false;
    state.detail.overlay = false;
    document.getElementById("toggle-bg").setAttribute("aria-pressed", "false");
    document.getElementById("toggle-bg").textContent = "Mit Hintergrund";
    document.getElementById("toggle-overlay").setAttribute("aria-pressed", "false");
    renderDetail();
    document.getElementById("detail-backdrop").classList.add("open");
  }

  function closeDetail() {
    document.getElementById("detail-backdrop").classList.remove("open");
    state.detail.id = null;
  }

  function renderDetail() {
    const t = TEMPLATES.find(x => x.id === state.detail.id);
    if (!t) return;
    document.getElementById("detail-title").textContent = t.name;

    const pixelSize = Math.min(20, Math.floor(360 / t.width));
    const gridContainer = document.getElementById("detail-grid");
    gridContainer.innerHTML = "";
    const grid = buildPixelGrid(t, {
      withBg: state.detail.withBg,
      pixelSize,
      overlay: state.detail.overlay,
      withTooltip: true,
    });
    grid.classList.add("detail-pixel-grid");
    if (state.detail.overlay) grid.classList.add("with-overlay");
    gridContainer.appendChild(grid);

    const counts = countBeads(t.grid, state.detail.withBg ? t.bgColor : null);
    const matWrap = document.getElementById("detail-materials");
    matWrap.innerHTML = "";
    matWrap.appendChild(buildMaterialsTable(counts));

    document.getElementById("detail-meta").textContent =
      `${t.width}×${t.height} · ${t.category} · ${sumCounts(counts)} Perlen` +
      (state.detail.withBg ? ` (inkl. Hintergrund ${t.bgColor})` : "");
  }

  function setupDetailControls() {
    document.getElementById("toggle-bg").addEventListener("click", e => {
      state.detail.withBg = !state.detail.withBg;
      e.target.setAttribute("aria-pressed", String(state.detail.withBg));
      e.target.textContent = state.detail.withBg ? "Ohne Hintergrund" : "Mit Hintergrund";
      renderDetail();
    });
    document.getElementById("toggle-overlay").addEventListener("click", e => {
      state.detail.overlay = !state.detail.overlay;
      e.target.setAttribute("aria-pressed", String(state.detail.overlay));
      renderDetail();
    });
    document.getElementById("detail-print").addEventListener("click", () => {
      if (state.detail.id) printSingle(state.detail.id, state.detail.withBg, state.detail.overlay);
    });
    document.querySelectorAll('[data-close="detail"]').forEach(b =>
      b.addEventListener("click", closeDetail));
    document.getElementById("detail-backdrop").addEventListener("click", e => {
      if (e.target.id === "detail-backdrop") closeDetail();
    });
  }

  // ============================================================
  // Tooltip
  // ============================================================

  function setupTooltip() {
    const tip = document.getElementById("tooltip");
    document.addEventListener("mousemove", e => {
      const target = e.target.closest("[data-tooltip]");
      if (!target) { tip.classList.remove("visible"); return; }
      tip.textContent = target.dataset.tooltip;
      tip.style.left = (e.clientX + 14) + "px";
      tip.style.top = (e.clientY + 14) + "px";
      tip.classList.add("visible");
    });
    document.addEventListener("mouseout", e => {
      if (!e.relatedTarget) tip.classList.remove("visible");
    });
  }

  // ============================================================
  // Gesamtliste
  // ============================================================

  function openTotal() {
    const totals = {};
    for (const t of TEMPLATES) {
      const counts = countBeads(t.grid);
      for (const [k, v] of Object.entries(counts)) {
        totals[k] = (totals[k] || 0) + v;
      }
    }
    const grand = sumCounts(totals);

    document.getElementById("total-meta").innerHTML =
      `Summe über alle ${TEMPLATES.length} Vorlagen (ohne Hintergrund): <strong>${grand} Perlen</strong> in ${Object.keys(totals).length} Farben.`;

    const wrap = document.getElementById("total-materials");
    wrap.innerHTML = "";
    wrap.appendChild(buildMaterialsTable(totals, { showHex: true }));

    document.getElementById("total-backdrop").classList.add("open");
  }

  function closeTotal() {
    document.getElementById("total-backdrop").classList.remove("open");
  }

  function copyTotalAsText() {
    const totals = {};
    for (const t of TEMPLATES) {
      const counts = countBeads(t.grid);
      for (const [k, v] of Object.entries(counts)) {
        totals[k] = (totals[k] || 0) + v;
      }
    }
    const lines = ["Artkal A Mini — Gesamt-Materialliste", "=".repeat(40)];
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    for (const [code, n] of sorted) {
      const p = paletteEntry(code);
      lines.push(`${code.padEnd(8)} ${p.name.padEnd(14)} ${String(n).padStart(5)} Perlen`);
    }
    lines.push("-".repeat(40));
    lines.push(`Gesamt: ${sumCounts(totals)} Perlen`);
    const text = lines.join("\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => flashButton("total-copy", "Kopiert!"),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flashButton("total-copy", "Kopiert!"); }
    catch (e) { alert("Konnte nicht kopieren. Text in der Konsole."); console.log(text); }
    document.body.removeChild(ta);
  }

  function flashButton(id, msg) {
    const btn = document.getElementById(id);
    const original = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => { btn.textContent = original; }, 1500);
  }

  // ============================================================
  // Druck
  // ============================================================

  function printSingle(id, withBg = false, overlay = true) {
    const t = TEMPLATES.find(x => x.id === id);
    if (!t) return;
    const printView = document.getElementById("print-view");
    printView.innerHTML = "";
    printView.appendChild(buildPrintPage(t, withBg, overlay));
    setTimeout(() => window.print(), 50);
  }

  function buildPrintPage(t, withBg, overlay) {
    const counts = countBeads(t.grid, withBg ? t.bgColor : null);
    const page = el("section", { class: "print-page" });

    page.appendChild(el("h1", { class: "print-title" }, t.name));
    page.appendChild(el("p", { class: "print-meta" },
      `${t.game} · ${t.category} · ${t.width}×${t.height} · ${sumCounts(counts)} Perlen` +
      (withBg ? ` (mit Hintergrund ${t.bgColor})` : "") +
      ` · ${new Date().toLocaleDateString("de-DE")}`));

    // Grid mit Achsen-Labels
    const wrap = el("div", { class: "print-grid-wrap" });
    wrap.style.gridTemplateColumns = `14mm 1fr`;
    wrap.style.gridTemplateRows = `14mm 1fr`;

    const colLabels = el("div", { class: "print-col-labels" });
    colLabels.style.gridTemplateColumns = `repeat(${t.width}, 1fr)`;
    for (let x = 0; x < t.width; x++) {
      colLabels.appendChild(el("div", null, ((x + 1) % 5 === 0 || x === 0) ? String(x + 1) : ""));
    }
    wrap.appendChild(colLabels);

    const rowLabels = el("div", { class: "print-row-labels" });
    rowLabels.style.gridTemplateRows = `repeat(${t.height}, 1fr)`;
    for (let y = 0; y < t.height; y++) {
      rowLabels.appendChild(el("div", null, ((y + 1) % 5 === 0 || y === 0) ? String(y + 1) : ""));
    }
    wrap.appendChild(rowLabels);

    const grid = el("div", { class: "print-grid" + (overlay ? " with-marks" : "") });
    grid.style.gridTemplateColumns = `repeat(${t.width}, 1fr)`;
    for (let y = 0; y < t.height; y++) {
      for (let x = 0; x < t.width; x++) {
        let code = t.grid[y][x];
        const isEmpty = code == null;
        if (isEmpty && withBg) code = t.bgColor;
        const pixel = el("div", { class: "pixel" + (code == null ? " empty-bg" : "") });
        if (code != null) pixel.style.background = paletteEntry(code).hex;
        if (overlay) {
          if ((x + 1) % 5 === 0 && x < t.width - 1) pixel.classList.add("gridmark-x");
          if ((y + 1) % 5 === 0 && y < t.height - 1) pixel.classList.add("gridmark-y");
        }
        grid.appendChild(pixel);
      }
    }
    wrap.appendChild(grid);
    page.appendChild(wrap);

    // Materialliste
    const table = el("table", { class: "print-materials" });
    const head = el("thead", null, el("tr", null, [
      el("th", null, "Farbe"),
      el("th", null, "Artikel-Nr."),
      el("th", null, "Name"),
      el("th", null, "Anzahl"),
    ]));
    const body = el("tbody");
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    for (const [code, n] of entries) {
      const p = paletteEntry(code);
      body.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "swatch", style: { background: p.hex } })),
        el("td", null, code),
        el("td", null, p.name),
        el("td", { style: { textAlign: "right" } }, String(n)),
      ]));
    }
    const foot = el("tfoot", null, el("tr", null, [
      el("td", { colspan: "3" }, "Gesamt"),
      el("td", { style: { textAlign: "right" } }, String(sumCounts(counts))),
    ]));
    table.appendChild(head);
    table.appendChild(body);
    table.appendChild(foot);
    page.appendChild(table);

    return page;
  }

  // ============================================================
  // Init
  // ============================================================

  function init() {
    setupToolbar();
    setupDetailControls();
    setupTooltip();
    document.getElementById("open-total").addEventListener("click", openTotal);
    document.getElementById("total-copy").addEventListener("click", copyTotalAsText);
    document.querySelectorAll('[data-close="total"]').forEach(b =>
      b.addEventListener("click", closeTotal));
    document.getElementById("total-backdrop").addEventListener("click", e => {
      if (e.target.id === "total-backdrop") closeTotal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") { closeDetail(); closeTotal(); }
    });
    renderGallery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
