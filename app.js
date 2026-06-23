(function () {
  "use strict";

  // ============================================================
  // State
  // ============================================================
  const state = {
    game: "all",
    category: "Alle",
    sortBy: "name-asc",
    favOnly: false,
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

  // Eingebaute + eigene (gespeicherte) Vorlagen.
  function allTemplates() {
    return TEMPLATES.concat(Store.getCustom());
  }
  function findTemplate(id) {
    return allTemplates().find((t) => t.id === id) || null;
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

  // ============================================================
  // Render: Bead-Canvas + Tooltip
  // ============================================================

  function attachTooltip(canvas, template) {
    const tip = document.getElementById("tooltip");
    canvas.addEventListener("mousemove", (e) => {
      const hit = BeadCanvas.hitTest(canvas, e.clientX, e.clientY);
      if (!hit) { tip.classList.remove("visible"); return; }
      let code = template.grid[hit.y][hit.x];
      if (code == null && state.detail.withBg) code = template.bgColor;
      if (code == null) { tip.classList.remove("visible"); return; }
      const p = paletteEntry(code);
      tip.textContent = `${code} · ${p.name}`;
      tip.style.left = (e.clientX + 14) + "px";
      tip.style.top = (e.clientY + 14) + "px";
      tip.classList.add("visible");
    });
    canvas.addEventListener("mouseleave", () => tip.classList.remove("visible"));
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

    const favs = Store.getFavorites();
    const filtered = allTemplates()
      .filter((t) => state.game === "all" || t.game === state.game)
      .filter((t) => state.category === "Alle" || t.category === state.category)
      .filter((t) => !state.favOnly || favs.indexOf(t.id) !== -1);

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
      gallery.appendChild(el("p", { class: "empty-hint" }, "Keine Vorlagen passen zu den Filtern."));
      return;
    }

    for (const t of sorted) {
      gallery.appendChild(buildCard(t));
    }
  }

  function buildCard(t) {
    const beadCount = sumCounts(countBeads(t.grid));
    const isFav = Store.isFavorite(t.id);
    const inProj = Store.inProject(t.id);
    const isCustom = t.game === "Meine Vorlagen";

    const favBtn = el("button", {
      class: "fav-btn" + (isFav ? " on" : ""),
      title: "Favorit",
      onClick: (e) => {
        const now = Store.toggleFavorite(t.id);
        e.currentTarget.classList.toggle("on", now);
        if (state.favOnly && !now) renderGallery();
      },
    }, isFav ? "♥" : "♡");

    const previewWrap = el("div", { class: "card-preview-wrap" });
    const canvas = el("canvas");
    const cell = Math.max(6, Math.min(16, Math.floor(230 / t.width)));
    previewWrap.appendChild(canvas);
    BeadCanvas.drawGrid(canvas, t, { cellSize: cell });
    attachTooltip(canvas, t);

    const actions = [
      el("button", { class: "btn", onClick: () => openDetail(t.id) }, "Details"),
      el("button", {
        class: "btn btn-secondary" + (inProj ? " active" : ""),
        title: "Zur Projektliste",
        onClick: (e) => {
          const cur = Store.getProject()[t.id] || 0;
          Store.setProjectQty(t.id, cur + 1);
          e.currentTarget.classList.add("active");
          e.currentTarget.textContent = "Im Projekt ✓";
        },
      }, inProj ? "Im Projekt ✓" : "+ Projekt"),
      el("button", { class: "btn btn-secondary", onClick: () => printTemplate(t.id) }, "Drucken"),
    ];
    if (isCustom) {
      actions.push(el("button", { class: "btn btn-secondary", onClick: () => Editor.open(t, refreshAll) }, "Bearbeiten"));
      actions.push(el("button", {
        class: "btn btn-danger",
        onClick: () => { if (confirm(`„${t.name}" löschen?`)) { Store.deleteCustom(t.id); refreshAll(); } },
      }, "Löschen"));
    }

    return el("div", { class: "card" }, [
      el("div", { class: "card-head" }, [
        el("h2", { class: "card-name" }, t.name),
        favBtn,
      ]),
      el("p", { class: "card-meta" }, [
        `${t.width}×${t.height} · ${beadCount} Perlen`,
        el("span", { class: "category" }, t.category),
      ]),
      previewWrap,
      el("div", { class: "card-actions" }, actions),
    ]);
  }

  // ============================================================
  // Filter / Sort / Nav Wiring
  // ============================================================

  function setupToolbar() {
    const tpls = allTemplates();
    const games = ["all", ...new Set(tpls.map((t) => t.game))];
    const gameSel = document.getElementById("filter-game");
    const prev = gameSel.value;
    gameSel.innerHTML = "";
    for (const g of games) {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g === "all" ? "Alle Spiele" : g;
      gameSel.appendChild(opt);
    }
    if (games.indexOf(prev) !== -1) gameSel.value = prev; else state.game = "all";
    gameSel.onchange = (e) => { state.game = e.target.value; renderGallery(); };

    const catGroup = document.getElementById("filter-categories");
    catGroup.innerHTML = "<label>Kategorie</label>";
    const cats = ["Alle", ...new Set(tpls.map((t) => t.category))];
    if (cats.indexOf(state.category) === -1) state.category = "Alle";
    for (const c of cats) {
      catGroup.appendChild(el("button", {
        class: "pill" + (c === state.category ? " active" : ""),
        dataset: { cat: c },
        onClick: () => {
          state.category = c;
          catGroup.querySelectorAll(".pill").forEach((p) =>
            p.classList.toggle("active", p.dataset.cat === c));
          renderGallery();
        },
      }, c));
    }

    const sortSel = document.getElementById("sort-by");
    sortSel.onchange = (e) => { state.sortBy = e.target.value; renderGallery(); };
  }

  // ============================================================
  // Detail Modal
  // ============================================================

  function openDetail(id) {
    state.detail.id = id;
    state.detail.withBg = false;
    state.detail.overlay = false;
    const tb = document.getElementById("toggle-bg");
    tb.setAttribute("aria-pressed", "false");
    tb.textContent = "Mit Hintergrund";
    document.getElementById("toggle-overlay").setAttribute("aria-pressed", "false");
    renderDetail();
    document.getElementById("detail-backdrop").classList.add("open");
  }

  function closeDetail() {
    document.getElementById("detail-backdrop").classList.remove("open");
    state.detail.id = null;
  }

  function renderDetail() {
    const t = findTemplate(state.detail.id);
    if (!t) return;
    document.getElementById("detail-title").textContent = t.name;

    const cell = Math.max(10, Math.min(26, Math.floor(440 / t.width)));
    const gridContainer = document.getElementById("detail-grid");
    gridContainer.innerHTML = "";
    const canvas = el("canvas");
    gridContainer.appendChild(canvas);
    BeadCanvas.drawGrid(canvas, t, {
      cellSize: cell,
      withBg: state.detail.withBg,
      overlay: state.detail.overlay,
    });
    attachTooltip(canvas, t);

    const counts = countBeads(t.grid, state.detail.withBg ? t.bgColor : null);
    const matWrap = document.getElementById("detail-materials");
    matWrap.innerHTML = "";
    matWrap.appendChild(buildMaterialsTable(counts));

    document.getElementById("detail-meta").textContent =
      `${t.width}×${t.height} · ${t.category} · ${sumCounts(counts)} Perlen` +
      (state.detail.withBg ? ` (inkl. Hintergrund ${t.bgColor})` : "");
  }

  function setupDetailControls() {
    document.getElementById("toggle-bg").addEventListener("click", (e) => {
      state.detail.withBg = !state.detail.withBg;
      e.target.setAttribute("aria-pressed", String(state.detail.withBg));
      e.target.textContent = state.detail.withBg ? "Ohne Hintergrund" : "Mit Hintergrund";
      renderDetail();
    });
    document.getElementById("toggle-overlay").addEventListener("click", (e) => {
      state.detail.overlay = !state.detail.overlay;
      e.target.setAttribute("aria-pressed", String(state.detail.overlay));
      renderDetail();
    });
    document.getElementById("detail-print").addEventListener("click", () => {
      if (state.detail.id) printTemplate(state.detail.id, state.detail.withBg, state.detail.overlay);
    });
    document.getElementById("detail-edit").addEventListener("click", () => {
      const t = findTemplate(state.detail.id);
      if (t) { closeDetail(); Editor.open(t, refreshAll); }
    });
    document.querySelectorAll('[data-close="detail"]').forEach((b) =>
      b.addEventListener("click", closeDetail));
    document.getElementById("detail-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "detail-backdrop") closeDetail();
    });
  }

  // ============================================================
  // Projekt-/Einkaufsliste
  // ============================================================

  function projectCombinedCounts() {
    const proj = Store.getProject();
    const totals = {};
    for (const id of Object.keys(proj)) {
      const t = findTemplate(id);
      if (!t) continue;
      const qty = proj[id];
      const counts = countBeads(t.grid);
      for (const [k, v] of Object.entries(counts)) {
        totals[k] = (totals[k] || 0) + v * qty;
      }
    }
    return totals;
  }

  function openProject() {
    renderProject();
    document.getElementById("project-backdrop").classList.add("open");
  }
  function closeProject() {
    document.getElementById("project-backdrop").classList.remove("open");
  }

  function renderProject() {
    const proj = Store.getProject();
    const ids = Object.keys(proj);
    const listWrap = document.getElementById("project-items");
    listWrap.innerHTML = "";

    if (ids.length === 0) {
      listWrap.appendChild(el("p", { class: "empty-hint" }, "Noch keine Vorlagen ausgewählt. Über „+ Projekt“ auf den Karten hinzufügen — oder:"));
      listWrap.appendChild(el("button", {
        class: "btn", onClick: () => {
          for (const t of allTemplates()) Store.setProjectQty(t.id, 1);
          renderProject();
        },
      }, "Alle Vorlagen hinzufügen"));
    } else {
      for (const id of ids) {
        const t = findTemplate(id);
        if (!t) { Store.setProjectQty(id, 0); continue; }
        const qty = proj[id];
        listWrap.appendChild(el("div", { class: "project-item" }, [
          el("span", { class: "project-item-name" }, t.name),
          el("div", { class: "qty" }, [
            el("button", { class: "pill", onClick: () => { Store.setProjectQty(id, Math.max(0, qty - 1)); renderProject(); } }, "−"),
            el("span", { class: "qty-val" }, String(qty)),
            el("button", { class: "pill", onClick: () => { Store.setProjectQty(id, qty + 1); renderProject(); } }, "+"),
            el("button", { class: "btn btn-secondary", onClick: () => { Store.setProjectQty(id, 0); renderProject(); } }, "Entfernen"),
          ]),
        ]));
      }
    }

    const totals = projectCombinedCounts();
    const grand = sumCounts(totals);
    document.getElementById("project-meta").innerHTML =
      ids.length === 0
        ? "Leeres Projekt."
        : `<strong>${grand} Perlen</strong> in ${Object.keys(totals).length} Farben für ${ids.length} Vorlage(n) × Menge.`;

    const matWrap = document.getElementById("project-materials");
    matWrap.innerHTML = "";
    if (grand > 0) matWrap.appendChild(buildMaterialsTable(totals, { showHex: true }));
  }

  function projectAsText() {
    const totals = projectCombinedCounts();
    const lines = ["Artkal A Mini — Projekt-Materialliste", "=".repeat(40)];
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    for (const [code, n] of sorted) {
      const p = paletteEntry(code);
      lines.push(`${code.padEnd(8)} ${p.name.padEnd(14)} ${String(n).padStart(6)} Perlen`);
    }
    lines.push("-".repeat(40));
    lines.push(`Gesamt: ${sumCounts(totals)} Perlen`);
    return lines.join("\n");
  }

  function copyProjectText() {
    const text = projectAsText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => flashButton("project-copy", "Kopiert!"),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }

  function downloadProjectCsv() {
    const totals = projectCombinedCounts();
    const rows = [["Artikel-Nr", "Name", "Hex", "Anzahl"]];
    Object.entries(totals).sort((a, b) => b[1] - a[1]).forEach(([code, n]) => {
      const p = paletteEntry(code);
      rows.push([code, p.name, p.hex, String(n)]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "artkal-projekt.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flashButton("project-copy", "Kopiert!"); }
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

  // Komponiert ein Druck-Canvas mit nummerierten Achsen + Perlen-Gitter.
  function composePrintCanvas(t, withBg, overlay) {
    const cell = 16;
    const pad = 26;
    const cssW = pad + t.width * cell;
    const cssH = pad + t.height * cell;
    const dpr = 2; // feste hohe Auflösung für den Druck
    const canvas = document.createElement("canvas");
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssW, cssH);

    // Perlen-Gitter separat rendern und einsetzen.
    // Quellmaße = Backing-Store des Gitters (berücksichtigt devicePixelRatio).
    const beads = BeadCanvas.toCanvas(t, { cellSize: cell, withBg, overlay, board: "#ffffff" });
    ctx.drawImage(beads, 0, 0, beads.width, beads.height, pad, pad, t.width * cell, t.height * cell);

    // Achsenbeschriftung.
    ctx.fillStyle = "#000";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let x = 0; x < t.width; x++) {
      if ((x + 1) % 5 === 0 || x === 0) ctx.fillText(String(x + 1), pad + x * cell + cell / 2, pad / 2);
    }
    ctx.textAlign = "right";
    for (let y = 0; y < t.height; y++) {
      if ((y + 1) % 5 === 0 || y === 0) ctx.fillText(String(y + 1), pad - 4, pad + y * cell + cell / 2);
    }
    return canvas;
  }

  function printTemplate(idOrTpl, withBg = false, overlay = true) {
    const t = typeof idOrTpl === "string" ? findTemplate(idOrTpl) : idOrTpl;
    if (!t) return;
    const printView = document.getElementById("print-view");
    printView.innerHTML = "";
    printView.appendChild(buildPrintPage(t, withBg, overlay));
    setTimeout(() => window.print(), 60);
  }

  function buildPrintPage(t, withBg, overlay) {
    const counts = countBeads(t.grid, withBg ? t.bgColor : null);
    const page = el("section", { class: "print-page" });

    page.appendChild(el("h1", { class: "print-title" }, t.name));
    page.appendChild(el("p", { class: "print-meta" },
      `${t.game} · ${t.category} · ${t.width}×${t.height} · ${sumCounts(counts)} Perlen` +
      (withBg ? ` (mit Hintergrund ${t.bgColor})` : "") +
      ` · ${new Date().toLocaleDateString("de-DE")}`));

    const imgCanvas = composePrintCanvas(t, withBg, overlay);
    imgCanvas.className = "print-bead-canvas";
    page.appendChild(el("div", { class: "print-grid-wrap" }, imgCanvas));

    // Materialliste.
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
    table.appendChild(head); table.appendChild(body); table.appendChild(foot);
    page.appendChild(table);
    return page;
  }

  // ============================================================
  // Init
  // ============================================================

  function refreshAll() {
    setupToolbar();
    renderGallery();
  }

  function init() {
    setupToolbar();
    setupDetailControls();

    document.getElementById("filter-fav").addEventListener("click", (e) => {
      state.favOnly = !state.favOnly;
      e.currentTarget.classList.toggle("active", state.favOnly);
      e.currentTarget.setAttribute("aria-pressed", String(state.favOnly));
      renderGallery();
    });

    document.getElementById("open-editor").addEventListener("click", () => Editor.open(null, refreshAll));
    document.getElementById("open-converter").addEventListener("click", () => Converter.open(refreshAll));
    document.getElementById("open-project").addEventListener("click", openProject);

    document.getElementById("project-copy").addEventListener("click", copyProjectText);
    document.getElementById("project-csv").addEventListener("click", downloadProjectCsv);
    document.getElementById("project-clear").addEventListener("click", () => {
      if (confirm("Projektliste leeren?")) { Store.clearProject(); renderProject(); renderGallery(); }
    });
    document.querySelectorAll('[data-close="project"]').forEach((b) =>
      b.addEventListener("click", closeProject));
    document.getElementById("project-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "project-backdrop") closeProject();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDetail(); closeProject();
        Editor.close(); Converter.close();
      }
    });

    renderGallery();
  }

  // Globale Helfer für editor.js / converter.js.
  window.countBeads = countBeads;
  window.sumCounts = sumCounts;
  window.buildMaterialsTable = buildMaterialsTable;
  window.printTemplate = printTemplate;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
