// Bügelperlen-Vorlagen.
//
// Pro Vorlage:
//   id, name, game, category, width, height
//   bgColor:  Artkal-Code, der im "Mit Hintergrund"-Modus die leeren Pixel füllt.
//   rows:     Array von Strings; jedes Zeichen entspricht einer Perle.
//             '.' = leer (transparent), sonst ein Buchstabe aus COLOR_KEY.
//
// Pixel-Sprites sind originalgetreu an die jeweiligen Vorlagen angelehnt; bei
// großflächigen Motiven können einzelne Pixel minimal abweichen — beim Stecken
// lassen sie sich aus den Grids nachjustieren.

const COLOR_KEY = {
  ".": null,
  // Neutral / Grau
  "K": "A-100", // Schwarz
  "D": "A-104", // Dunkelgrau
  "c": "A-103", // Grau
  "C": "A-102", // Hellgrau
  "W": "A-001", // Weiß
  "E": "A-101", // Creme
  // Rot / Orange
  "r": "A-005", // Dunkelrot
  "R": "A-006", // Rot
  "F": "A-026", // Koralle
  "O": "A-007", // Orange
  "o": "A-008", // Hellorange
  // Gelb
  "Y": "A-003", // Gelb
  "y": "A-004", // Hellgelb
  "u": "A-009", // Senf
  // Grün
  "G": "A-020", // Dunkelgrün
  "g": "A-021", // Hellgrün
  "i": "A-022", // Limette
  "M": "A-023", // Tannengrün
  "m": "A-027", // Mint
  // Blau / Türkis
  "t": "A-028", // Türkis
  "T": "A-032", // Petrol
  "B": "A-019", // Dunkelblau
  "L": "A-029", // Hellblau
  "b": "A-030", // Himmelblau
  "d": "A-031", // Marineblau
  // Violett / Pink
  "v": "A-033", // Violett
  "l": "A-034", // Lavendel
  "P": "A-025", // Pink
  "p": "A-035", // Magenta
  "f": "A-036", // Fuchsia
  // Braun / Haut
  "N": "A-014", // Braun
  "n": "A-013", // Hellbraun
  "h": "A-015", // Dunkelbraun
  "S": "A-024", // Hautton
  "s": "A-037", // Hautton 2
  "e": "A-038", // Beige
  // Spezial
  "x": "A-039", // Gold
  "z": "A-040", // Silber
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

// ============================================================
// Super Mario
// ============================================================

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

const FIRE_MARIO = BIG_MARIO.map(row =>
  [...row].map(ch => (ch === "R" ? "W" : ch === "B" ? "R" : ch)).join("")
);

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

const ONE_UP_MUSHROOM = SUPER_MUSHROOM.map(row =>
  [...row].map(ch => (ch === "R" ? "G" : ch)).join("")
);

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

const PIPE = [
  "GGGGGGGGGGGGGGGG",
  "GggggggggggggggG",
  "GggGGGGGGGGGGggG",
  "GggGGGGGGGGGGggG",
  "GGGGGGGGGGGGGGGG",
  "..GGGGGGGGGGGG..",
  "..GggggggggggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GggGGGGGGggG..",
  "..GGGGGGGGGGGG..",
];

const STAR = [
  ".......YY.......",
  ".......YY.......",
  "......YYYY......",
  "......YYYY......",
  "YYYYYYYYYYYYYYYY",
  ".YYYYYYYYYYYYYY.",
  "..YYYYYYYYYYYY..",
  "...YYYYYYYYYY...",
  "...YYYYYYYYYY...",
  "..YYYYYYYYYYYY..",
  "..YYYY....YYYY..",
  ".YYYY......YYYY.",
  "YYY..........YYY",
];

// ============================================================
// Symbole
// ============================================================

const HEART = [
  "..RRR......RRR..",
  ".RRRRR....RRRRR.",
  ".RRRRRR..RRRRRR.",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  ".RRRRRRRRRRRRRR.",
  "..RRRRRRRRRRRR..",
  "...RRRRRRRRRR...",
  "....RRRRRRRR....",
  ".....RRRRRR.....",
  "......RRRR......",
  ".......RR.......",
];

const SMILEY = [
  ".....KKKKKK.....",
  "...KKYYYYYYKK...",
  "..KYYYYYYYYYYK..",
  ".KYYYYYYYYYYYYK.",
  "KYYYYYYYYYYYYYYK",
  "KYYYKKYYYYKKYYYK",
  "KYYYKKYYYYKKYYYK",
  "KYYYYYYYYYYYYYYK",
  "KYYYYYYYYYYYYYYK",
  "KYYYKYYYYYYKYYYK",
  "KYYYKYYYYYYKYYYK",
  "KYYYYKKKKKKYYYYK",
  ".KYYYYYYYYYYYYK.",
  "..KYYYYYYYYYYK..",
  "...KKYYYYYYKK...",
  ".....KKKKKK.....",
];

// ============================================================
// Minecraft
// ============================================================

const CREEPER = [
  "gggggggggggggggg",
  "gggggggggggggggg",
  "gggggggggggggggg",
  "ggKKKKggggKKKKgg",
  "ggKKKKggggKKKKgg",
  "ggKKKKggggKKKKgg",
  "ggKKKKggggKKKKgg",
  "ggggggKKKKgggggg",
  "ggggggKKKKgggggg",
  "gggggKKKKKKggggg",
  "gggggKKKKKKggggg",
  "gggggKKggKKggggg",
  "gggggKKggKKggggg",
  "gggggKKggKKggggg",
  "gggggggggggggggg",
  "gggggggggggggggg",
];

// ============================================================
// Pac-Man
// ============================================================

const PACMAN = [
  ".....YYYYYY.....",
  "...YYYYYYYYYY...",
  "..YYYYYYYYYYYY..",
  ".YYYYYYYYYYYYYY.",
  ".YYYYYYYYY......",
  "YYYYYYYY........",
  "YYYYYYY.........",
  "YYYYYY..........",
  "YYYYYY..........",
  "YYYYYYY.........",
  "YYYYYYYY........",
  ".YYYYYYYYY......",
  ".YYYYYYYYYYYYYY.",
  "..YYYYYYYYYYYY..",
  "...YYYYYYYYYY...",
  ".....YYYYYY.....",
];

const GHOST = [
  ".....RRRRRR.....",
  "...RRRRRRRRRR...",
  "..RRRRRRRRRRRR..",
  ".RRRRRRRRRRRRRR.",
  "RRRRRRRRRRRRRRRR",
  "RRWWWRRRRRRWWWRR",
  "RRWBWRRRRRRWBWRR",
  "RRWWWRRRRRRWWWRR",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  "RRRRRRRRRRRRRRRR",
  "R..RR..RR..RR..R",
];

// ============================================================
// Pokémon
// ============================================================

const POKEBALL = [
  ".....KKKKKK.....",
  "...KKRRRRRRKK...",
  "..KRRRRRRRRRRK..",
  ".KRRRRRRRRRRRRK.",
  ".KRRRRRRRRRRRRK.",
  "KRRRRRRRRRRRRRRK",
  "KRRRRRRRRRRRRRRK",
  "KKKKKKKKKKKKKKKK",
  "WWWWWKKKKKKWWWWW",
  "WWWWWKWWWWKWWWWW",
  "WWWWWKKKKKKWWWWW",
  ".WWWWWWWWWWWWWW.",
  ".KWWWWWWWWWWWWK.",
  "..KWWWWWWWWWWK..",
  "...KKWWWWWWKK...",
  ".....KKKKKK.....",
];

// ============================================================
// Among Us
// ============================================================

const CREWMATE = [
  "...RRRRRR...",
  "..RRRRRRRR..",
  ".RRRRRRRRRR.",
  "RRRRRRRRRRRR",
  "RRRbbbbbbRRR",
  "RRRbbbbbbRRR",
  "RRRRRRRRRRRR",
  "RRRRRRRRRRRR",
  "RRRRRRRRRRRR",
  "RRRRRRRRRRRR",
  "RRRRRRRRRRRR",
  "RRRRRRRRRRRR",
  "RRRRRRRRRRRR",
  "RRRR....RRRR",
  "RRRR....RRRR",
];

// ============================================================
// Sonic
// ============================================================

const RING = [
  ".....xxxxxx.....",
  "...xxxxxxxxxx...",
  "..xxxxxxxxxxxx..",
  ".xxxxx....xxxxx.",
  ".xxxx......xxxx.",
  "xxxx........xxxx",
  "xxxx........xxxx",
  "xxx..........xxx",
  "xxx..........xxx",
  "xxxx........xxxx",
  "xxxx........xxxx",
  ".xxxx......xxxx.",
  ".xxxxx....xxxxx.",
  "..xxxxxxxxxxxx..",
  "...xxxxxxxxxx...",
  ".....xxxxxx.....",
];

// ============================================================
// Zelda
// ============================================================

const EMERALD = [
  ".......gg.......",
  "......gggg......",
  ".....gggggg.....",
  "....gggggggg....",
  "...gggggggggg...",
  "..gggggggggggg..",
  ".gggggggggggggg.",
  "gggggggggggggggg",
  "gggggggggggggggg",
  ".gggggggggggggg.",
  "..gggggggggggg..",
  "...gggggggggg...",
  "....gggggggg....",
  ".....gggggg.....",
  "......gggg......",
  ".......gg.......",
];

const SWORD = [
  ".......zz.......",
  ".......zz.......",
  "......zzzz......",
  "......zzzz......",
  "......zzzz......",
  "......zzzz......",
  "......zzzz......",
  "......zzzz......",
  "......zzzz......",
  "....xxxxxxxx....",
  ".......NN.......",
  ".......NN.......",
  ".......NN.......",
  "......xxxx......",
  ".......xx.......",
  "................",
];

const TEMPLATES = [
  { id: "mario-klein", name: "Kleiner Mario", game: "Super Mario", category: "Charakter", width: 12, height: 16, bgColor: "A-029", grid: parseRows(SMALL_MARIO) },
  { id: "mario-gross", name: "Großer Mario", game: "Super Mario", category: "Charakter", width: 16, height: 32, bgColor: "A-029", grid: parseRows(BIG_MARIO) },
  { id: "mario-feuer", name: "Feuer-Mario", game: "Super Mario", category: "Charakter", width: 16, height: 32, bgColor: "A-029", grid: parseRows(FIRE_MARIO) },
  { id: "goomba", name: "Goomba", game: "Super Mario", category: "Gegner", width: 16, height: 16, bgColor: "A-029", grid: parseRows(GOOMBA) },
  { id: "koopa-gruen", name: "Grüner Koopa Troopa", game: "Super Mario", category: "Gegner", width: 16, height: 24, bgColor: "A-029", grid: parseRows(KOOPA) },
  { id: "super-pilz", name: "Super-Pilz", game: "Super Mario", category: "Item", width: 16, height: 16, bgColor: "A-029", grid: parseRows(SUPER_MUSHROOM) },
  { id: "1up-pilz", name: "1-Up-Pilz", game: "Super Mario", category: "Item", width: 16, height: 16, bgColor: "A-029", grid: parseRows(ONE_UP_MUSHROOM) },
  { id: "feuerblume", name: "Feuerblume", game: "Super Mario", category: "Item", width: 16, height: 16, bgColor: "A-029", grid: parseRows(FIRE_FLOWER) },
  { id: "frageblock", name: "Fragezeichen-Block", game: "Super Mario", category: "Block", width: 16, height: 16, bgColor: "A-029", grid: parseRows(QUESTION_BLOCK) },
  { id: "muenze", name: "Münze", game: "Super Mario", category: "Item", width: 12, height: 16, bgColor: "A-029", grid: parseRows(COIN) },
  { id: "roehre", name: "Röhre", game: "Super Mario", category: "Umgebung", width: 16, height: 16, bgColor: "A-029", grid: parseRows(PIPE) },
  { id: "stern", name: "Super-Stern", game: "Super Mario", category: "Item", width: 16, height: 13, bgColor: "A-029", grid: parseRows(STAR) },

  { id: "herz", name: "Herz", game: "Symbole", category: "Symbol", width: 16, height: 12, bgColor: "A-001", grid: parseRows(HEART) },
  { id: "smiley", name: "Smiley", game: "Symbole", category: "Symbol", width: 16, height: 16, bgColor: "A-001", grid: parseRows(SMILEY) },

  { id: "creeper", name: "Creeper", game: "Minecraft", category: "Charakter", width: 16, height: 16, bgColor: "A-021", grid: parseRows(CREEPER) },

  { id: "pacman", name: "Pac-Man", game: "Pac-Man", category: "Charakter", width: 16, height: 16, bgColor: "A-100", grid: parseRows(PACMAN) },
  { id: "geist", name: "Geist", game: "Pac-Man", category: "Gegner", width: 16, height: 16, bgColor: "A-100", grid: parseRows(GHOST) },

  { id: "pokeball", name: "Pokéball", game: "Pokémon", category: "Item", width: 16, height: 16, bgColor: "A-001", grid: parseRows(POKEBALL) },

  { id: "crewmate", name: "Crewmate", game: "Among Us", category: "Charakter", width: 12, height: 15, bgColor: "A-104", grid: parseRows(CREWMATE) },

  { id: "ring", name: "Ring", game: "Sonic", category: "Item", width: 16, height: 16, bgColor: "A-019", grid: parseRows(RING) },

  { id: "smaragd", name: "Smaragd", game: "Zelda", category: "Item", width: 16, height: 16, bgColor: "A-001", grid: parseRows(EMERALD) },
  { id: "schwert", name: "Schwert", game: "Zelda", category: "Item", width: 16, height: 16, bgColor: "A-001", grid: parseRows(SWORD) },
];
