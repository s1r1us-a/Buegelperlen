// Bügelperlen-Vorlagen.
//
// Pro Vorlage:
//   id, name, game, category, width, height
//   bgColor:  Artkal-Code, der im "Mit Hintergrund"-Modus die leeren Pixel füllt.
//   rows:     Array von Strings; jedes Zeichen entspricht einer Perle.
//             '.' = leer (transparent), sonst ein Buchstabe aus COLOR_KEY.
//
// Sprites sind originalgetreu an die NES Super-Mario-Bros (1985)-Sprites angelehnt.
// Bei großflächigen Sprites (Großer/Feuer-Mario, Koopa) können einzelne Pixel minimal
// vom Original abweichen — pixelgenaue Referenzen lassen sich aus den Grids beim
// Stecken nachjustieren.

const COLOR_KEY = {
  ".": null,
  "K": "A-100", // Schwarz
  "W": "A-001", // Weiß
  "R": "A-006", // Rot
  "O": "A-007", // Orange
  "Y": "A-003", // Gelb
  "B": "A-019", // Dunkelblau (Mario-Overalls)
  "L": "A-029", // Hellblau (Himmel)
  "G": "A-020", // Dunkelgrün
  "g": "A-021", // Hellgrün
  "N": "A-014", // Braun (Stiefel/Haar)
  "S": "A-024", // Hautton
  "P": "A-025", // Pink
  "n": "A-013", // Hellbraun
};

function parseRows(rows) {
  return rows.map((row, y) => {
    const cells = [...row].map((ch, x) => {
      if (!(ch in COLOR_KEY)) {
        throw new Error(`Unbekanntes Zeichen "${ch}" in Zeile ${y}, Spalte ${x}`);
      }
      return COLOR_KEY[ch];
    });
    return cells;
  });
}

// --- 1. Kleiner Mario (12×16) ---
const SMALL_MARIO = [
  "...RRRRR....",
  "..RRRRRRRRR.",
  "..NNNSSKS...",
  ".NSNSSSKSSS.",
  ".NSNNSSSKSSS",
  ".NNSSSSKKKK.",
  "...SSSSSSS..",
  "....RBRR....",
  "..RRRBRRBRR.",
  "RRRRBBBBRRRR",
  "SSRBYBBYBRSS",
  "SSSBBBBBBSSS",
  "SSBBBBBBBBSS",
  "..BBB...BBB.",
  ".NNN....NNN.",
  "NNNN....NNNN",
];

// --- 2. Großer Mario (16×32) ---
const BIG_MARIO = [
  ".....RRRRRRR....",
  "....RRRRRRRRR...",
  "....NNNSSKS.....",
  "...NSNSSSKSSS...",
  "...NSNNSSSKSSS..",
  "...NNSSSSKKKK...",
  ".....SSSSSSS....",
  "....SS.SS.SS....",
  "...SSSSSSSSSS...",
  "..RRRSSSSSSRRR..",
  ".RRRRSSSSSSRRRR.",
  "RRRRRRSSSSRRRRRR",
  "RRRBRRRSSRRRBRRR",
  "SSRBBRSSSSRBBRSS",
  "SSBBBBBBBBBBBBSS",
  "SSBBBBBBBBBBBBSS",
  "SSBBYBBBBBBYBBSS",
  "SSBBYBBBBBBYBBSS",
  "SSBBBBBBBBBBBBSS",
  "SSBBBBBBBBBBBBSS",
  "SSBBBBBBBBBBBBSS",
  ".SBBBRBBBBRBBBS.",
  "..BBBRRRRRRBBB..",
  "..BBRRRRRRRRBB..",
  "..BBRRRR.RRRBB..",
  "..BBRR....RRBB..",
  "..NNN......NNN..",
  "..NNNN....NNNN..",
  "..NNNNN..NNNNN..",
  ".NNNNNN..NNNNNN.",
  "NNNNNNN..NNNNNNN",
  "NNNNN......NNNNN",
];

// --- 3. Feuer-Mario (16×32) ---
// Identische Silhouette wie Großer Mario, aber Fire-Mario-Palette:
//   Rot (R) der Kappe → Weiß, Dunkelblau (B) der Overalls → Rot.
const FIRE_MARIO = BIG_MARIO.map(row =>
  [...row].map(ch => (ch === "R" ? "W" : ch === "B" ? "R" : ch)).join("")
);

// --- 4. Goomba (16×16) ---
const GOOMBA = [
  "....NNNNNNNN....",
  "..NNNNNNNNNNNN..",
  ".NNNNNNNNNNNNNN.",
  "NNNNNNNNNNNNNNNN",
  "NNWWNNNNNNNNWWNN",
  "NWWKNNNNNNNNKWWN",
  "NWKKNNNNNNNNKKWN",
  "NWKKNNNNNNNNKKWN",
  "NWWKNNNNNNNNKWWN",
  "NWWWNNNNNNNNWWWN",
  ".NNNNNNNNNNNNNN.",
  ".nnnnnnnnnnnnnn.",
  "nnnnnnnnnnnnnnnn",
  "nnnnnnnnnnnnnnnn",
  "NNNNNN....NNNNNN",
  "NNNN........NNNN",
];

// --- 5. Grüner Koopa Troopa (16×24) ---
const KOOPA = [
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "..GggGGGGGGggG..",
  ".GgGgGGGGGGgGgG.",
  ".GGGgggGGgggGGG.",
  ".GGgGGGggGGGgGG.",
  ".GggGGGGggGGggG.",
  ".GGggggGGggggGG.",
  ".GGGGggggGGGGGG.",
  ".GGGGggGGggGGGG.",
  "..GGGGGGGGGGGG..",
  "...gGGGGGGGGg...",
  "...YYYYYYYYYY...",
  "..YYWKYYYYKWYY..",
  ".YYYWKYYYYKWYYY.",
  ".YYYWWYYYYWWYYY.",
  ".YYYYYYYYYYYYYY.",
  ".YYYYOOOOOOYYYY.",
  "..YYYYYYYYYYYY..",
  "...YYYY..YYYY...",
  "...YY......YY...",
  "...YY......YY...",
  "..nnn......nnn..",
  ".nnnn......nnnn.",
];

// --- 6. Super-Pilz (16×16) ---
const SUPER_MUSHROOM = [
  "....KKKKKKKK....",
  "..KKRRRRRRRRKK..",
  ".KRWWRRRRRRWWRK.",
  ".KWWWRRRRRRWWWK.",
  "KRWWWWRRRRWWWWRK",
  "KRWWRRRRRRRRWWRK",
  "KRRRRRWWWWRRRRRK",
  "KRRRRRWWWWRRRRRK",
  ".KKWWWWWWWWWWKK.",
  ".KWWKKWWWWKKWWK.",
  ".KWWKKWWWWKKWWK.",
  ".KWWWWWWWWWWWWK.",
  ".KWWWWWWWWWWWWK.",
  "..KWWWWWWWWWWK..",
  "...KKKKKKKKKK...",
  "................",
];

// --- 7. 1-Up-Pilz (16×16) ---
// Wie Super-Pilz, aber grüner Hut: R → G.
const ONE_UP_MUSHROOM = SUPER_MUSHROOM.map(row =>
  [...row].map(ch => (ch === "R" ? "G" : ch)).join("")
);

// --- 8. Feuerblume (16×16) ---
const FIRE_FLOWER = [
  "....KKKKKKKK....",
  "..KKWWWWWWWWKK..",
  ".KWWOOOOOOOOWWK.",
  ".KWORRYYYYRROWK.",
  "KWORRYYKKYYRROWK",
  "KWORRYKKKKYRROWK",
  "KWORRYKKKKYRROWK",
  "KWORRYYKKYYRROWK",
  ".KWORRYYYYRROWK.",
  ".KWWOOOOOOOOWWK.",
  "..KKWGGGGGGWKK..",
  "....KGGGGGGK....",
  ".....GGGGGG.....",
  ".....GGGGGG.....",
  "....ggGGGGgg....",
  "...gggGGGGggg...",
];

// --- 9. Fragezeichen-Block (16×16) ---
const QUESTION_BLOCK = [
  "KKKKKKKKKKKKKKKK",
  "KOOOOOOOOOOOOOOK",
  "KOYYYYYYYYYYYYOK",
  "KOYYYKKKKKKYYYOK",
  "KOYYKKKKKKKKYYOK",
  "KOYYKKYYYYKKYYOK",
  "KOYYYYYYYYKKYYOK",
  "KOYYYYYYKKKKYYOK",
  "KOYYYYKKKKYYYYOK",
  "KOYYYYYYYYYYYYOK",
  "KOYYYYYYYYYYYYOK",
  "KOYYYYKKYYYYYYOK",
  "KOYYYYKKYYYYYYOK",
  "KOYYYYYYYYYYYYOK",
  "KOOOOOOOOOOOOOOK",
  "KKKKKKKKKKKKKKKK",
];

// --- 10. Münze (12×16) ---
const COIN = [
  "....OOOO....",
  "..OOYYYYOO..",
  ".OYYYYYYYYO.",
  ".OYYYYYYYYO.",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  "OYYOYYYYOYYO",
  ".OYYYYYYYYO.",
  ".OYYYYYYYYO.",
  "..OOYYYYOO..",
  "....OOOO....",
];

const TEMPLATES = [
  {
    id: "mario-klein",
    name: "Kleiner Mario",
    game: "Super Mario",
    category: "Charakter",
    width: 12,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(SMALL_MARIO),
  },
  {
    id: "mario-gross",
    name: "Großer Mario",
    game: "Super Mario",
    category: "Charakter",
    width: 16,
    height: 32,
    bgColor: "A-029",
    grid: parseRows(BIG_MARIO),
  },
  {
    id: "mario-feuer",
    name: "Feuer-Mario",
    game: "Super Mario",
    category: "Charakter",
    width: 16,
    height: 32,
    bgColor: "A-029",
    grid: parseRows(FIRE_MARIO),
  },
  {
    id: "goomba",
    name: "Goomba",
    game: "Super Mario",
    category: "Gegner",
    width: 16,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(GOOMBA),
  },
  {
    id: "koopa-gruen",
    name: "Grüner Koopa Troopa",
    game: "Super Mario",
    category: "Gegner",
    width: 16,
    height: 24,
    bgColor: "A-029",
    grid: parseRows(KOOPA),
  },
  {
    id: "super-pilz",
    name: "Super-Pilz",
    game: "Super Mario",
    category: "Item",
    width: 16,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(SUPER_MUSHROOM),
  },
  {
    id: "1up-pilz",
    name: "1-Up-Pilz",
    game: "Super Mario",
    category: "Item",
    width: 16,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(ONE_UP_MUSHROOM),
  },
  {
    id: "feuerblume",
    name: "Feuerblume",
    game: "Super Mario",
    category: "Item",
    width: 16,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(FIRE_FLOWER),
  },
  {
    id: "frageblock",
    name: "Fragezeichen-Block",
    game: "Super Mario",
    category: "Block",
    width: 16,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(QUESTION_BLOCK),
  },
  {
    id: "muenze",
    name: "Münze",
    game: "Super Mario",
    category: "Item",
    width: 12,
    height: 16,
    bgColor: "A-029",
    grid: parseRows(COIN),
  },
];
