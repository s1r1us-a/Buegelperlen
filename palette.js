// Artkal A Mini Farbpalette (2,6 mm Mini-Perlen).
// Codes basieren auf gängigen, öffentlich verfügbaren A-Mini-Listen.
// HINWEIS: Bitte gegen das eigene Sortiment / die Charge prüfen — Codes
// können zwischen Händlern und Produktionschargen leicht abweichen.
const PALETTE = {
  // --- Neutral / Graustufen ---
  "A-001": { name: "Weiß",        hex: "#FFFFFF" },
  "A-101": { name: "Creme",       hex: "#F7F0DC" },
  "A-102": { name: "Hellgrau",    hex: "#C9CDD2" },
  "A-103": { name: "Grau",        hex: "#8A9099" },
  "A-104": { name: "Dunkelgrau",  hex: "#4A4F57" },
  "A-100": { name: "Schwarz",     hex: "#000000" },

  // --- Rot / Orange ---
  "A-005": { name: "Dunkelrot",   hex: "#9E1B1B" },
  "A-006": { name: "Rot",         hex: "#E52521" },
  "A-026": { name: "Koralle",     hex: "#FF6F61" },
  "A-007": { name: "Orange",      hex: "#F89B00" },
  "A-008": { name: "Hellorange",  hex: "#FFB347" },

  // --- Gelb ---
  "A-003": { name: "Gelb",        hex: "#FBD000" },
  "A-004": { name: "Hellgelb",    hex: "#FFE873" },
  "A-009": { name: "Senf",        hex: "#D4A017" },

  // --- Grün ---
  "A-020": { name: "Dunkelgrün",  hex: "#007B0E" },
  "A-021": { name: "Hellgrün",    hex: "#80D010" },
  "A-022": { name: "Limette",     hex: "#B6E62A" },
  "A-023": { name: "Tannengrün",  hex: "#0B5D2E" },
  "A-027": { name: "Mint",        hex: "#8FE3C4" },
  "A-028": { name: "Türkis",      hex: "#0FB7A6" },

  // --- Blau ---
  "A-019": { name: "Dunkelblau",  hex: "#1A3FBA" },
  "A-029": { name: "Hellblau",    hex: "#5C94FC" },
  "A-030": { name: "Himmelblau",  hex: "#9CC6FF" },
  "A-031": { name: "Marineblau",  hex: "#0E1E5B" },
  "A-032": { name: "Petrol",      hex: "#1C6E8C" },

  // --- Violett / Pink ---
  "A-033": { name: "Violett",     hex: "#6A2C91" },
  "A-034": { name: "Lavendel",    hex: "#B89CE0" },
  "A-025": { name: "Pink",        hex: "#F8B8D0" },
  "A-035": { name: "Magenta",     hex: "#D81B7A" },
  "A-036": { name: "Fuchsia",     hex: "#FF4FA3" },

  // --- Braun / Haut ---
  "A-013": { name: "Hellbraun",   hex: "#B86F30" },
  "A-014": { name: "Braun",       hex: "#6B3410" },
  "A-015": { name: "Dunkelbraun", hex: "#3E2113" },
  "A-024": { name: "Hautton",     hex: "#FCBCB0" },
  "A-037": { name: "Hautton 2",   hex: "#E8A07A" },
  "A-038": { name: "Beige",       hex: "#E6CBA8" },

  // --- Spezial ---
  "A-039": { name: "Gold",        hex: "#C8AB24" },
  "A-040": { name: "Silber",      hex: "#BFC3C9" },
};

// Vorberechnete RGB-Werte für die Nächste-Farbe-Suche (Konverter).
const _PALETTE_RGB = Object.keys(PALETTE).map((code) => {
  const hex = PALETTE[code].hex.replace("#", "");
  return {
    code,
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
});

// Liefert den Paletteneintrag zu einem Code (mit Magenta-Fallback bei Unbekannt).
function paletteEntry(code) {
  return PALETTE[code] || { name: code, hex: "#FF00FF" };
}

// Findet den Artkal-Code, dessen Farbe einem RGB-Wert am nächsten liegt.
// Euklidischer Abstand mit leichter Gewichtung nach menschlicher Wahrnehmung.
function nearestPaletteCode(r, g, b) {
  let best = null;
  let bestDist = Infinity;
  for (const p of _PALETTE_RGB) {
    const dr = (r - p.r) * 0.30;
    const dg = (g - p.g) * 0.59;
    const db = (b - p.b) * 0.11;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = p.code;
    }
  }
  return best;
}

// Hex -> {r,g,b}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
