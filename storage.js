// ============================================================
// Store — Persistenz über localStorage:
//   - Favoriten (Vorlagen-IDs)
//   - eigene Vorlagen (im Editor/Konverter erstellt)
//   - Projekt-/Einkaufsliste (Vorlage -> Menge)
// ============================================================
const Store = (function () {
  "use strict";

  const K_FAV = "bp_favorites";
  const K_CUSTOM = "bp_custom";
  const K_PROJECT = "bp_project";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage nicht verfügbar:", e);
    }
  }

  // --- Favoriten ---
  function getFavorites() { return read(K_FAV, []); }
  function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }
  function toggleFavorite(id) {
    const favs = getFavorites();
    const i = favs.indexOf(id);
    if (i === -1) favs.push(id); else favs.splice(i, 1);
    write(K_FAV, favs);
    return i === -1; // true = jetzt favorisiert
  }

  // --- Eigene Vorlagen ---
  function getCustom() { return read(K_CUSTOM, []); }
  function saveCustom(tpl) {
    const list = getCustom();
    if (!tpl.id) tpl.id = "custom-" + Date.now();
    const i = list.findIndex((t) => t.id === tpl.id);
    if (i === -1) list.push(tpl); else list[i] = tpl;
    write(K_CUSTOM, list);
    return tpl.id;
  }
  function deleteCustom(id) {
    write(K_CUSTOM, getCustom().filter((t) => t.id !== id));
  }

  // --- Projekt-/Einkaufsliste ---
  function getProject() { return read(K_PROJECT, {}); }
  function setProjectQty(id, qty) {
    const p = getProject();
    if (qty > 0) p[id] = qty; else delete p[id];
    write(K_PROJECT, p);
  }
  function inProject(id) { return getProject()[id] > 0; }
  function clearProject() { write(K_PROJECT, {}); }

  return {
    getFavorites, isFavorite, toggleFavorite,
    getCustom, saveCustom, deleteCustom,
    getProject, setProjectQty, inProject, clearProject,
  };
})();
