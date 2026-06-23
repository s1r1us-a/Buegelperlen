// Bügelperlen-Vorlagen.
//
// Jede Vorlage wird mit tpl({ meta }, [zeilen]) gebaut:
//   id, name, game, category
//   bgColor:  Artkal-Code, der im "Mit Hintergrund"-Modus die leeren Pixel füllt.
//   zeilen:   Array von Strings; jedes Zeichen entspricht einer Perle.
//             '.' = leer (transparent), sonst ein Buchstabe aus COLOR_KEY.
//
// width/height werden automatisch aus dem Grid abgeleitet, und tpl() prüft,
// dass alle Zeilen gleich lang sind – so kann die Geometrie nicht mehr von den
// deklarierten Maßen abweichen.
//
// Designprinzip aller Motive: durchgehende dunkle Outline, 2–3 Farbtöne pro
// Bereich für Tiefe (Licht oben-links, Schatten unten-rechts) und saubere
// Symmetrie.

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

// Baut eine Vorlage und leitet width/height aus dem Grid ab.
// Wirft, wenn die Zeilen nicht alle gleich lang sind (Geometrie-Schutz).
function tpl(meta, rows) {
  const height = rows.length;
  const width = rows[0].length;
  rows.forEach((r, y) => {
    if (r.length !== width) {
      throw new Error(`${meta.id}: Zeile ${y} hat ${r.length} statt ${width} Zeichen`);
    }
  });
  return { ...meta, width, height, grid: parseRows(rows) };
}

const TEMPLATES = [

  // ============================================================
  // Super Mario
  // ============================================================

  tpl({ id: "mario-klein", name: "Kleiner Mario", game: "Super Mario", category: "Charakter", bgColor: "A-029" }, [
    "....RRRR....",
    "...RRRRRRRR.",
    "...RRRRRRRR.",
    "..NNNSSSSS..",
    "..NNSSSKSS..",
    "..NSSSSSSS..",
    "..NNNNNNSS..",
    "...SSSSSS...",
    "...RRRRRR...",
    "..RRBRRBRR..",
    ".RRRBYYBRRR.",
    ".SSBBBBBBSS.",
    ".SSBBBBBBSS.",
    "..BBB..BBB..",
    "..hhh..hhh..",
    ".hhhh..hhhh.",
  ]),

  tpl({ id: "mario-gross", name: "Großer Mario", game: "Super Mario", category: "Charakter", bgColor: "A-029" }, [
    ".....RRRRRR.....",
    "....RRRRRRRRRR..",
    "...RRRRRRRRRRRR.",
    "...NNNSSSSSSSS..",
    "..NNNSSSSSSKSS..",
    "..NSSSSSSSSKSS..",
    "..NSSSSSSSSSSS..",
    "..NNNNNNNNSSSS..",
    "...SSSSSSSSSS...",
    "...RRRRRRRRRRR..",
    "..RRRRRRRRRRRRR.",
    "..RRRBRRRRBRRRr.",
    ".SSRBBYBBYBBRSSr",
    ".SSRBBBBBBBBRSS.",
    ".SSBBBBBBBBBBSS.",
    "...BBBBBBBBBB...",
    "...BBBBBBBBBB...",
    "...BBBBBBBBBB...",
    "...BBBBBBBBBB...",
    "...BBBBBBBBBB...",
    "..BBBBBBBBBBBB..",
    "..BBBBBBBBBBBB..",
    "..BBBBB..BBBBB..",
    "..BBBB....BBBB..",
    "..NNNN....NNNN..",
    ".NNNNN....NNNNN.",
    ".hhhhh....hhhhh.",
    "hhhhhh....hhhhhh",
    "hhhhh......hhhhh",
    "................",
    "................",
    "................",
  ]),

  // Feuer-Mario: weiße Latzhose + roter Hut/Pulli (klassisch).
  tpl({ id: "mario-feuer", name: "Feuer-Mario", game: "Super Mario", category: "Charakter", bgColor: "A-029" }, [
    ".....WWWWWW.....",
    "....WWWWWWWWWW..",
    "...WWWWWWWWWWWW.",
    "...NNNSSSSSSSS..",
    "..NNNSSSSSSKSS..",
    "..NSSSSSSSSKSS..",
    "..NSSSSSSSSSSS..",
    "..NNNNNNNNSSSS..",
    "...SSSSSSSSSS...",
    "...RRRRRRRRRRR..",
    "..RRRRRRRRRRRRR.",
    "..RRRWRRRRWRRRr.",
    ".SSRWWRWWRWWRSSr",
    ".SSRWWWWWWWWRSS.",
    ".SSWWWWWWWWWWSS.",
    "...WWWWWWWWWW...",
    "...WWWRRRRWWW...",
    "...WWWWWWWWWW...",
    "...WWWWWWWWWW...",
    "...WWWWWWWWWW...",
    "..WWWWWWWWWWWW..",
    "..WWWWWWWWWWWW..",
    "..WWWWW..WWWWW..",
    "..WWWW....WWWW..",
    "..RRRR....RRRR..",
    ".RRRRR....RRRRR.",
    ".rrrrr....rrrrr.",
    "rrrrrr....rrrrrr",
    "rrrrr......rrrrr",
    "................",
    "................",
    "................",
  ]),

  tpl({ id: "goomba", name: "Goomba", game: "Super Mario", category: "Gegner", bgColor: "A-029" }, [
    "....hhhhhhhh....",
    "..hhNNNNNNNNhh..",
    ".hNNNNNNNNNNNNh.",
    ".hNNNNNNNNNNNNh.",
    "hNNKKNNNNNNKKNNh",
    "hNWWKNNNNNNKWWNh",
    "hNWKKNNNNNNKKWNh",
    "hNWWWNNNNNNWWWNh",
    "hNNNNNNNNNNNNNNh",
    ".hNNNNNNNNNNNNh.",
    ".hnnnnnnnnnnnnh.",
    ".hnnnnnnnnnnnnh.",
    "..nnnnnnnnnnnn..",
    ".hhhhh....hhhhh.",
    "hhhhh......hhhhh",
    "................",
  ]),

  tpl({ id: "koopa-gruen", name: "Grüner Koopa", game: "Super Mario", category: "Gegner", bgColor: "A-029" }, [
    "......GGGG......",
    ".....GggggG.....",
    ".....GgWKgG.....",
    ".....GggggG.....",
    "......GGGG......",
    ".....OOOOOO.....",
    "....OOOOOOOO....",
    "...MMMMMMMMMM...",
    "..MMGGGGGGGGMM..",
    ".MMGiiGGGGiiGMM.",
    ".MGiiGGGGGGiiGM.",
    ".MGGGGGiiGGGGGM.",
    ".MGiiGGGGGGiiGM.",
    ".MMGiiGGGGiiGMM.",
    "..MMGGGGGGGGMM..",
    "...MMMMMMMMMM...",
    "....OOOOOOOO....",
    ".....OOOOOO.....",
    "....OO....OO....",
    "...nnn....nnn...",
    "..nnnn....nnnn..",
    "................",
    "................",
    "................",
  ]),

  tpl({ id: "super-pilz", name: "Super-Pilz", game: "Super Mario", category: "Item", bgColor: "A-029" }, [
    "....KKKKKKKK....",
    "..KKRRRRRRRRKK..",
    ".KRRRRRRRRRRRRK.",
    ".KRWWRRRRRRWWRK.",
    "KRWWWWRRRRWWWWRK",
    "KRWWWWRRRRWWWWRK",
    "KRRRRRRRRRRRRRRK",
    "KRRRRWWWWWWRRRRK",
    ".KKKKKKKKKKKKKK.",
    ".KWWWWWWWWWWWWK.",
    "KWWKKWWWWWWKKWWK",
    "KWWKKWWWWWWKKWWK",
    "KWWWWWWWWWWWWWWK",
    ".KWWWWWWWWWWWWK.",
    "..KWWWWWWWWWWK..",
    "...KKKKKKKKKK...",
  ]),

  tpl({ id: "1up-pilz", name: "1-Up-Pilz", game: "Super Mario", category: "Item", bgColor: "A-029" }, [
    "....KKKKKKKK....",
    "..KKGGGGGGGGKK..",
    ".KGGGGGGGGGGGGK.",
    ".KGWWGGGGGGWWGK.",
    "KGWWWWGGGGWWWWGK",
    "KGWWWWGGGGWWWWGK",
    "KGGGGGGGGGGGGGGK",
    "KGGGGWWWWWWGGGGK",
    ".KKKKKKKKKKKKKK.",
    ".KWWWWWWWWWWWWK.",
    "KWWKKWWWWWWKKWWK",
    "KWWKKWWWWWWKKWWK",
    "KWWWWWWWWWWWWWWK",
    ".KWWWWWWWWWWWWK.",
    "..KWWWWWWWWWWK..",
    "...KKKKKKKKKK...",
  ]),

  tpl({ id: "feuerblume", name: "Feuerblume", game: "Super Mario", category: "Item", bgColor: "A-029" }, [
    "....KKKKKK......",
    "..KKWWWWWWKK....",
    ".KWWOOOOOOWWK...",
    ".KWOOYYYYOOWK...",
    ".KWOYYRRYYOWK...",
    ".KWOYRRRRYOWK...",
    ".KWOYYRRYYOWK...",
    ".KWOOYYYYOOWK...",
    ".KWWOOOOOOWWK...",
    "..KKWGGGGWKK....",
    "....GGGGGG......",
    "...GMGGGGMG.....",
    "..GMMGGGGMMG....",
    "..GMGGGGGGMG....",
    "...gGGGGGGg.....",
    "....gggggg......",
  ]),

  tpl({ id: "frageblock", name: "Fragezeichen-Block", game: "Super Mario", category: "Block", bgColor: "A-029" }, [
    "KKKKKKKKKKKKKKKK",
    "KOOOOOOOOOOOOOOK",
    "KOYYYYYYYYYYYYrK",
    "KOYYYKKKKKKYYYrK",
    "KOYYKKYYYYKKYYrK",
    "KOYYKKYYYYKKYYrK",
    "KOYYYYYYYKKYYYrK",
    "KOYYYYYYKKYYYYrK",
    "KOYYYYYKKYYYYYrK",
    "KOYYYYYKKYYYYYrK",
    "KOYYYYYYYYYYYYrK",
    "KOYYYYYKKYYYYYrK",
    "KOYYYYYKKYYYYYrK",
    "KOrrrrrrrrrrrrrK",
    "KKKKKKKKKKKKKKKK",
    "K..K........K..K",
  ]),

  tpl({ id: "muenze", name: "Münze", game: "Super Mario", category: "Item", bgColor: "A-029" }, [
    "...xxxxxx...",
    "..xxYYYYxx..",
    ".xxYYYYYYxx.",
    "xxYYxYYxYYxx",
    "xxYYxYYxYYxx",
    "xYYYxYYxYYYx",
    "xYYYxYYxYYYx",
    "xYYYxYYxYYYx",
    "xYYYxYYxYYYx",
    "xYYYxYYxYYYx",
    "xxYYxYYxYYxx",
    "xxYYxYYxYYxx",
    ".xxYYYYYYxx.",
    "..xxYYYYxx..",
    "...xxxxxx...",
    "............",
  ]),

  tpl({ id: "roehre", name: "Röhre", game: "Super Mario", category: "Umgebung", bgColor: "A-029" }, [
    "GGGGGGGGGGGGGGGG",
    "GiiiiiiiiiiiiiiG",
    "GiGGGGGGGGGGGGMG",
    "GiGMMMMMMMMMMGMG",
    "GiGMMMMMMMMMMGMG",
    "GGGGGGGGGGGGGGGG",
    "..GiGGGGGGGGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GiGMMMMMMGMG..",
    "..GGGGGGGGGGGG..",
  ]),

  tpl({ id: "stern", name: "Super-Stern", game: "Super Mario", category: "Item", bgColor: "A-029" }, [
    ".......KK.......",
    "......KYYK......",
    "......KYYK......",
    ".....KYYYYK.....",
    ".....KYYYYK.....",
    "KKKKKKYYYYKKKKKK",
    "KYYYYYYYYYYYYYYK",
    ".KYYYYYYYYYYYYK.",
    "..KYYYYYYYYYYK..",
    "...KYYYYYYYYK...",
    "...KYYYKKYYYK...",
    "..KYYYK..KYYYK..",
    "..KYYK....KYYK..",
    ".KYYK......KYYK.",
    ".KKK........KKK.",
    "................",
  ]),

  // ============================================================
  // Symbole
  // ============================================================

  tpl({ id: "herz", name: "Herz", game: "Symbole", category: "Symbol", bgColor: "A-001" }, [
    "...rrr....rrr...",
    "..rRRRrr.rrRRr..",
    ".rRRWRRRrRRRRRr.",
    ".rRWWRRRRRRRRRr.",
    "rRRWRRRRRRRRRRRr",
    "rRRRRRRRRRRRRRRr",
    "rRRRRRRRRRRRRRRr",
    ".rRRRRRRRRRRRRr.",
    ".rRRRRRRRRRRRRr.",
    "..rRRRRRRRRRRr..",
    "...rRRRRRRRRr...",
    "....rRRRRRRr....",
    ".....rRRRRr.....",
    "......rRRr......",
    ".......rr.......",
    "................",
  ]),

  tpl({ id: "smiley", name: "Smiley", game: "Symbole", category: "Symbol", bgColor: "A-001" }, [
    ".....KKKKKK.....",
    "...KKYYYYYYKK...",
    "..KYYYYYYYYYYK..",
    ".KYYYYYYYYYYYYK.",
    ".KYYYYYYYYYYYYK.",
    "KYYKKYYYYKKYYYYK",
    "KYYKKYYYYKKYYYYK",
    "KYYYYYYYYYYYYYYK",
    "KYYYYYYYYYYYYYYK",
    "KYKYYYYYYYYYYKYK",
    "KYKKYYYYYYYYKKYK",
    ".KYKKKKKKKKKKYK.",
    ".KYYYKKKKKKYYYK.",
    "..KYYYYYYYYYYK..",
    "...KKYYYYYYKK...",
    ".....KKKKKK.....",
  ]),

  // ============================================================
  // Minecraft
  // ============================================================

  tpl({ id: "creeper", name: "Creeper", game: "Minecraft", category: "Charakter", bgColor: "A-021" }, [
    "iggiggiggiggiggi",
    "giggiggiggiggigg",
    "ggMMMMggggMMMMgg",
    "ggMKKMggggMKKMgg",
    "ggMKKMggggMKKMgg",
    "ggMMMMggggMMMMgg",
    "ggggggMMMMgggggg",
    "ggggggMKKMgggggg",
    "gggggMKKKKMggggg",
    "gggggMKKKKMggggg",
    "gggggMKKKKMggggg",
    "gggggMKMMKMggggg",
    "gggggMKMMKMggggg",
    "gggggKKMMKKggggg",
    "iggiggiggiggiggi",
    "giggiggiggiggigg",
  ]),

  tpl({ id: "steve", name: "Steve", game: "Minecraft", category: "Charakter", bgColor: "A-021" }, [
    "..hhhhhhhhhhhh..",
    ".hhhhhhhhhhhhhh.",
    ".hNNNNNNNNNNNNh.",
    ".hNNNNNNNNNNNNh.",
    ".SSSSSSSSSSSSSS.",
    ".SSSSSSSSSSSSSS.",
    ".SWWBSSSSSSBWWS.",
    ".SWWBSSSSSSBWWS.",
    ".SSSSSSSSSSSSSS.",
    ".SSSSNNNNNNSSSS.",
    ".SSSNhhhhhhNSSS.",
    ".SSSSNNNNNNSSSS.",
    ".SSSSSSSSSSSSSS.",
    ".SSSSSSSSSSSSSS.",
    "..SSSSSSSSSSSS..",
    "................",
  ]),

  tpl({ id: "mc-diamant", name: "Diamant", game: "Minecraft", category: "Item", bgColor: "A-100" }, [
    "................",
    "......tttt......",
    ".....tttttt.....",
    "....tmmmmmmt....",
    "...tmWmmmmmmt...",
    "..tmmmmmmmmmmt..",
    ".tmmmmmmmmmmmmt.",
    "tmmmmmmmmmmmmmmt",
    ".tmmmmmmmmmmmmt.",
    "..tmmmmmmmmmmt..",
    "...tmmmmmmmmt...",
    "....tmmmmmmt....",
    ".....tmmmmt.....",
    "......tmmt......",
    ".......tt.......",
    "................",
  ]),

  // ============================================================
  // Pac-Man
  // ============================================================

  tpl({ id: "pacman", name: "Pac-Man", game: "Pac-Man", category: "Charakter", bgColor: "A-100" }, [
    ".....YYYYYY.....",
    "...YYYYYYYYYY...",
    "..YYYYYYYYYYYY..",
    ".YYYYYYYYKYYYYY.",
    ".YYYYYYYKYYYY...",
    "YYYYYYYKYYY.....",
    "YYYYYYKYY.......",
    "YYYYYYKY........",
    "YYYYYYKY........",
    "YYYYYYKYY.......",
    "YYYYYYYKYYY.....",
    ".YYYYYYYKYYYY...",
    ".YYYYYYYYKYYYYY.",
    "..YYYYYYYYYYYY..",
    "...YYYYYYYYYY...",
    ".....YYYYYY.....",
  ]),

  tpl({ id: "geist", name: "Geist", game: "Pac-Man", category: "Gegner", bgColor: "A-100" }, [
    ".....RRRRRR.....",
    "...RRRRRRRRRR...",
    "..RRRRRRRRRRRR..",
    ".RRWWWRRRRWWWRR.",
    ".RWWWWRRRRWWWWR.",
    "RRWWBBRRRRWWBBRR",
    "RRWWBBRRRRWWBBRR",
    "RRWWWWRRRRWWWWRR",
    "RRRRWRRRRRRWRRRR",
    "RRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRR",
    "RRR..RRRR..RRR..",
  ]),

  // ============================================================
  // Pokémon
  // ============================================================

  tpl({ id: "pikachu", name: "Pikachu", game: "Pokémon", category: "Charakter", bgColor: "A-001" }, [
    "...K........K...",
    "..KKK......KKK..",
    "..KYK......KYK..",
    "..KYKK....KKYK..",
    ".KYYYKK..KKYYYK.",
    ".KYYYYKKKKYYYYK.",
    "KYYYYYYYYYYYYYYK",
    "KYKKYYYYYYYYKKYK",
    "KYWKYYYYYYYYKWYK",
    "KYKKYYYYYYYYKKYK",
    "KYRRYYYKKYYYRRYK",
    "KYRRYYKYYKYYRRYK",
    ".KYYYYYKKYYYYYK.",
    ".KYYYYYYYYYYYYK.",
    "..KYYYYYYYYYYK..",
    "...KKKKKKKKKK...",
  ]),

  tpl({ id: "glumanda", name: "Glumanda", game: "Pokémon", category: "Charakter", bgColor: "A-001" }, [
    "....OOOOOO......",
    "...OOOOOOOO.....",
    "...OWKOOWKO.....",
    "...OWKOOWKO...x.",
    "...OOOOOOOO..xYx",
    "...OEEEEEEO.xYYx",
    "....OOOOOO..xYx.",
    "...OOOOOOOO.xx..",
    "..OEEEEEEEEO....",
    "..OEEEEEEEEO....",
    "..OEEEEEEEEO....",
    "..OOEEEEEEOO....",
    "...OOOOOOOO.....",
    "...OO....OO.....",
    "..OOO....OOO....",
    "................",
  ]),

  tpl({ id: "schiggy", name: "Schiggy", game: "Pokémon", category: "Charakter", bgColor: "A-001" }, [
    ".....mmmmmm.....",
    "...mmbbbbbbmm...",
    "..mbbbbbbbbbbm..",
    "..mbWKbbbbWKbm..",
    "..mbWKbbbbWKbm..",
    "..mbbbbRRbbbbm..",
    "...mbbbbbbbbm...",
    "..NNmbbbbbbmNN..",
    ".NeeNmmmmmmNeeN.",
    ".NeeOOOOOOOOeeN.",
    "..NOEEEEEEEEON..",
    "..OEEEEEEEEEEO..",
    "..OEEOOOOOOEEO..",
    "...OOO....OOO...",
    "...NN......NN...",
    "................",
  ]),

  tpl({ id: "bisasam", name: "Bisasam", game: "Pokémon", category: "Charakter", bgColor: "A-001" }, [
    ".....MGGGGM.....",
    "....MGGGGGGM....",
    "...MGiGGGGiGM...",
    "..mGGGGGGGGGGm..",
    "..mtttttttttttm.",
    ".mttWKtttttWKtm.",
    ".mttWKtttttWKtm.",
    ".mtttttGGttttttm",
    ".mttttGGGGtttttm",
    ".mmttttttttttmm.",
    "..mttttttttttm..",
    "..GttttttttttG..",
    "..GGtttttttGGG..",
    "...GG.tttt.GG...",
    "..GG........GG..",
    "................",
  ]),

  tpl({ id: "evoli", name: "Evoli", game: "Pokémon", category: "Charakter", bgColor: "A-001" }, [
    "..N........N....",
    "..NN......NN....",
    ".NEN.....NEN....",
    ".NEEN...NEEN....",
    ".NEEEN.NEEEN....",
    "..NNNEEENNNN....",
    "..NEEEEEEEEN....",
    ".NEWKEEEEWKEN...",
    ".NEEEEEEEEEEN...",
    ".NEEEERREEEEN...",
    "..NEEEEEEEEEEEE.",
    "..eeeeeeeeeeeeE.",
    "..eeeeeeeeeeeEE.",
    "...eeeeeeeeeEE..",
    "...ee..ee..EE...",
    "..NN..NN........",
  ]),

  // ============================================================
  // Among Us
  // ============================================================

  tpl({ id: "crewmate-rot", name: "Crewmate Rot", game: "Among Us", category: "Charakter", bgColor: "A-104" }, [
    "....rrrrrr......",
    "..rrRRRRRRrr....",
    ".rRRRRRRRRRRr...",
    ".rRRbbbbbbbCr...",
    "rRRbCCCCCCbbCrr.",
    "rRbCCCCCCCCbbCr.",
    "rRRbbbbbbbbbCrrr",
    "rRRRRRRRRRRRRrrr",
    "rRRRRRRRRRRRRrrr",
    "rRRRRRRRRRRRRrr.",
    "rRRRRRRRRRRRRrr.",
    "rRRRRRRRRRRRRrr.",
    "rRRRRRRRRRRRRr..",
    "rRRRr..rRRRRr...",
    "rrrr...rrrrrr...",
    "................",
  ]),

  tpl({ id: "crewmate-blau", name: "Crewmate Blau", game: "Among Us", category: "Charakter", bgColor: "A-104" }, [
    "....BBBBBB......",
    "..BBLLLLLLBB....",
    ".BLLLLLLLLLLB...",
    ".BLLbbbbbbbCB...",
    "BLLbCCCCCCbbCBB.",
    "BLbCCCCCCCCbbCB.",
    "BLLbbbbbbbbbCBBB",
    "BLLLLLLLLLLLLBBB",
    "BLLLLLLLLLLLLBBB",
    "BLLLLLLLLLLLLBB.",
    "BLLLLLLLLLLLLBB.",
    "BLLLLLLLLLLLLBB.",
    "BLLLLLLLLLLLLB..",
    "BLLLB..BLLLLB...",
    "BBBB...BBBBBB...",
    "................",
  ]),

  // ============================================================
  // Sonic
  // ============================================================

  tpl({ id: "ring", name: "Ring", game: "Sonic", category: "Item", bgColor: "A-019" }, [
    ".....xxxxxx.....",
    "...xxxyyyyxxx...",
    "..xxyyxxxxyyxx..",
    ".xxyyx....xyyxx.",
    ".xyyx......xyyx.",
    "xxyx........xyxx",
    "xxyx........xyxx",
    "xyyx........xyyx",
    "xyyx........xyyx",
    "xxyx........xyxx",
    "xxyx........xyxx",
    ".xyyx......xyyx.",
    ".xxyyx....xyyxx.",
    "..xxyyxxxxyyxx..",
    "...xxxyyyyxxx...",
    ".....xxxxxx.....",
  ]),

  // ============================================================
  // Zelda
  // ============================================================

  tpl({ id: "smaragd", name: "Smaragd", game: "Zelda", category: "Item", bgColor: "A-001" }, [
    ".....GGGGGG.....",
    "....GiiiiiiG....",
    "...GimmmmmmiG...",
    "..GimmmmmmmmiG..",
    ".GimmWWmmmmmmiG.",
    "GimmWWmmmmmmmmiG",
    "GimmmmmmmmmmmmiG",
    "GimmmmmmmmmmmmiG",
    ".GimmmmmmmmmmiG.",
    ".GGimmmmmmmmiGG.",
    "..GGimmmmmmiGG..",
    "...GGimmmmiGG...",
    "....GGimmiGG....",
    ".....GGiiGG.....",
    "......GGGG......",
    "................",
  ]),

  tpl({ id: "schwert", name: "Schwert", game: "Zelda", category: "Item", bgColor: "A-001" }, [
    ".......CC.......",
    "......CzzC......",
    "......CzzC......",
    "......CzzC......",
    "......CzzC......",
    "......CzzC......",
    "......CzzC......",
    "......CzzC......",
    "...xxxxxxxxxx...",
    "...xxxxxxxxxx...",
    "......NhhN......",
    "......NhhN......",
    "......NhhN......",
    ".....xxNNxx.....",
    "......xNNx......",
    ".......xx.......",
  ]),

  // ============================================================
  // Mehr Super Mario
  // ============================================================

  tpl({ id: "luigi", name: "Luigi", game: "Super Mario", category: "Charakter", bgColor: "A-029" }, [
    "....GGGGG...",
    "...GGGGGGGG.",
    "...NNNSSSS..",
    "..NSNNSSKSS.",
    "..NSNNSSSSS.",
    "..NNSSSKKSS.",
    "...SSSSSSS..",
    "...GGGGGGG..",
    "..GGGBGGBGG.",
    ".GGGGBYYBGGG",
    ".SSGBBBBBBSS",
    ".SSSBBBBBSSS",
    "...BBBBBBB..",
    "..BBB..BBB..",
    "..hhh..hhh..",
    ".hhhh..hhhh.",
  ]),

  tpl({ id: "yoshi", name: "Yoshi", game: "Super Mario", category: "Charakter", bgColor: "A-029" }, [
    ".....GGGGGG.....",
    "...GGGGGGGGGG...",
    "..GGGGGGGGGGGG..",
    "..GWWWGGGGWWWG..",
    "..GWKWGGGGWKWG..",
    "..GWWWGGGGWWWG..",
    "..GGGGGGGGGGGG..",
    "...GGGGGGGGGG...",
    "...GGGGGGGGGG...",
    "..GGEEEEEEEEGG..",
    "..GEEEEEEEEEEG..",
    "..GEEEEEEEEEEG..",
    "...GEEEEEEEEG...",
    "...GGGGGGGGGG...",
    "..OOO......OOO..",
    ".OOOO......OOOO.",
  ]),

  tpl({ id: "toad", name: "Toad", game: "Super Mario", category: "Charakter", bgColor: "A-029" }, [
    "....WWWWWWWW....",
    "..WWRRWWWWRRWW..",
    ".WWRRRWWWWRRRWW.",
    ".WRRRRWWWWRRRRW.",
    "WWWWWWWWWWWWWWWW",
    "WWRRWWWWWWWWRRWW",
    "WWRRWWWWWWWWRRWW",
    ".WWWWWWWWWWWWWW.",
    "...SSSSSSSSSS...",
    "..SSKSSSSSSKSS..",
    "..SSKSSSSSSKSS..",
    "..SSSSSSSSSSSS..",
    "...SSEEEEEESS...",
    "...WWWWWWWWWW...",
    "...WWWW..WWWW...",
    "...nnn....nnn...",
  ]),

  tpl({ id: "boo", name: "Boo", game: "Super Mario", category: "Gegner", bgColor: "A-031" }, [
    ".....WWWWWW.....",
    "...WWWWWWWWWW...",
    "..WWWWWWWWWWWW..",
    ".WWWWWWWWWWWWWW.",
    ".WWWKKWWWWKKWWW.",
    "WWWWKKWWWWKKWWWW",
    "WWWWKKWWWWKKWWWW",
    "WWWWWWWWWWWWWWWW",
    "WWWWWKKKKKKWWWWW",
    "WWWWKKKKKKKKWWWW",
    "WWWWWKKKKKKWWWWW",
    ".WWWWWWWWWWWWWW.",
    ".WWWWWWWWWWWWWW.",
    ".WW.WWW..WWW.WW.",
    "..W..WW..WW..W..",
    "................",
  ]),

  tpl({ id: "piranha", name: "Piranha-Pflanze", game: "Super Mario", category: "Gegner", bgColor: "A-029" }, [
    "....RRRRRRRR....",
    "..RRRRRRRRRRRR..",
    ".RRWWRRRRRRWWRR.",
    "RRWWWRRRRRRWWWRR",
    "RRWWRRRRRRRRWWRR",
    "RRRRRRRRRRRRRRRR",
    "RRWWWWWWWWWWWWRR",
    ".RWKWKWKWKWKWKR.",
    "..RRRRRRRRRRRR..",
    "....rRRRRRRr....",
    ".....GGGGGG.....",
    "...iGGGGGGGGi...",
    "..iGGiGGGGiGGi..",
    "...GGGGGGGGGG...",
    "....MMMMMMMM....",
    ".....MMMMMM.....",
  ]),

  // ============================================================
  // Tiere
  // ============================================================

  tpl({ id: "katze", name: "Katze", game: "Tiere", category: "Charakter", bgColor: "A-001" }, [
    "..D........D....",
    "..DD......DD....",
    "..DPD....DPD....",
    "..DDDDDDDDDDD...",
    ".DDDDDDDDDDDDD..",
    ".DDWKDDDDDDKWD..",
    ".DDWKDDDDDDKWD..",
    ".DDDDDDPPDDDDD..",
    ".DDDWDDPPDDDWD..",
    ".DDWWDDDDDDWWD..",
    ".DDDWDDDDDDWDD..",
    "..DDDDDDDDDDD...",
    "..DDDDDDDDDDD...",
    "...DDDDDDDDD....",
    "...DD.DDD.DD....",
    "................",
  ]),

  tpl({ id: "hund", name: "Hund", game: "Tiere", category: "Charakter", bgColor: "A-001" }, [
    ".hhh......hhh...",
    ".hNNh....hNNh...",
    ".hNNNh..hNNNh...",
    ".hNNNNNNNNNNh...",
    "..NNnnnnnnNNN...",
    "..NnnnnnnnnnN...",
    "..NnKnnnnKnnN...",
    "..NnnnnnnnnnN...",
    "..NnnnKKnnnnN...",
    "..NnnKKKKnnnN...",
    "..NnnnKKnnnnN...",
    "...NnnnnnnnN....",
    "...NNnnnnNN.....",
    "....NNNNNN......",
    "................",
    "................",
  ]),

  tpl({ id: "pinguin", name: "Pinguin", game: "Tiere", category: "Charakter", bgColor: "A-029" }, [
    ".....KKKK......",
    "...KKKKKKKK....",
    "..KKKKKKKKKK...",
    "..KKWWKKWWKK...",
    "..KKWKKKKWKK...",
    "..KKWWKKWWKK...",
    "..KKKOOOOKKK...",
    "..KKWWWWWWKK...",
    ".KKWWWWWWWWKK..",
    ".KWWWWWWWWWWK..",
    ".KWWWWWWWWWWK..",
    ".KKWWWWWWWWKK..",
    "..KKWWWWWWKK...",
    "...KKKKKKKK....",
    "...OO....OO....",
    "..OOO....OOO...",
  ]),

  tpl({ id: "einhorn", name: "Einhorn", game: "Tiere", category: "Charakter", bgColor: "A-001" }, [
    ".......xx.......",
    ".......xx.......",
    "......yyx.......",
    "..l.........l...",
    ".lWl.......lWl..",
    ".lWWWWWWWWWWWWl.",
    ".WWWWWWWWWWWWfPf",
    ".WWKWWWWWWKWWfPf",
    ".WWWWWWWWWWWWPPf",
    ".WWWWWWWWWWWWfPf",
    ".WWWWWWWWWWWWPPf",
    ".WWWWPWWPWWWWfPf",
    "..WWWWWWWWWWWPf.",
    "...WWWWWWWWWWf..",
    "....WWWWWWWW....",
    "................",
  ]),

  // ============================================================
  // Essen
  // ============================================================

  tpl({ id: "eis", name: "Eiscreme", game: "Essen", category: "Symbol", bgColor: "A-001" }, [
    "...ppppp...",
    "..pPPPPPp..",
    ".pPPPPPPPp.",
    ".pPPPWPPPp.",
    "pPPPPPPPPPp",
    "pmmmmmmmmmp",
    ".mMMMMMMMm.",
    ".OEEEEEEEO.",
    ".OeEEEEEeO.",
    "..OeEEEeO..",
    "..OEEEEEO..",
    "...OeEeO...",
    "...OEEEO...",
    "....OeO....",
    "....OEO....",
    ".....O.....",
  ]),

  tpl({ id: "cupcake", name: "Cupcake", game: "Essen", category: "Symbol", bgColor: "A-001" }, [
    ".......R........",
    "....P..R..P.....",
    "..P.fPPPPf.P....",
    ".fPPPPPPPPPPf...",
    "fPPPPPPPPPPPPf..",
    "fPfPPPPPPPPfPf..",
    ".fPPPPPPPPPPf...",
    "..nnnnnnnnnn....",
    "..nEnEnEnEnE....",
    ".nEnEnEnEnEnE...",
    ".nNEnEnEnEnNn...",
    ".nNnEnEnEnNNn...",
    "..NnEnEnEnNN....",
    "..NNnnnnnnNN....",
    "...NNNNNNNN.....",
    "................",
  ]),

  tpl({ id: "erdbeere", name: "Erdbeere", game: "Essen", category: "Symbol", bgColor: "A-001" }, [
    ".....G.G.G.....",
    "....GGGGGGG....",
    "...GGiGGGiGG...",
    "....rRRRRRr....",
    "...rRRYRRYRr...",
    "..rRRRRRRRRRr..",
    "..rRYRRRRRYRr..",
    "..rRRRRYRRRRr..",
    "..rRRYRRRRYRr..",
    "...rRRRRRRRr...",
    "...rRRYRRYRr...",
    "....rRRRRRr....",
    ".....rRRRr.....",
    "......rRr......",
    ".......r.......",
    "...............",
  ]),

  // ============================================================
  // Natur / Symbole
  // ============================================================

  tpl({ id: "regenbogen", name: "Regenbogen", game: "Natur", category: "Symbol", bgColor: "A-029" }, [
    "....RRRRRRRR....",
    "..RRRRRRRRRRRR..",
    ".RROOOOOOOOOORR.",
    "ROOYYYYYYYYYYOOR",
    "ROYYGGGGGGGGYYOR",
    "OYYGGbbbbbbGGYYO",
    "OYGGbbBBBBbbGGYO",
    "OYGbbBB..BBbbGYO",
    "OGGbBB....BBGGGO",
    ".OGbB......BbGO.",
    "..OB........BO..",
    "..W..........W..",
    ".WWW........WWW.",
    "..W..........W..",
    "................",
    "................",
  ]),

  tpl({ id: "blume", name: "Blume", game: "Natur", category: "Symbol", bgColor: "A-001" }, [
    "....ppp..ppp....",
    "...pPPPppPPPp...",
    "..pPPPPppPPPPp..",
    "..pPPPYYYYPPPp..",
    "ppp.PPYYYYPP.ppp",
    "pPPppPYYYYPppPPp",
    "pPPPPYYYYYYPPPPp",
    "pPPppPYYYYPppPPp",
    "ppp.PPYYYYPP.ppp",
    "..pPPPYYYYPPPp..",
    "..pPPPPppPPPPp..",
    "...pPPPGGPPPp...",
    "....ppGGGGpp....",
    "......GGGG......",
    ".....GiGGiG.....",
    "....GG.GG.GG....",
  ]),

  tpl({ id: "pixelherz", name: "Pixel-Herz", game: "Retro", category: "Symbol", bgColor: "A-001" }, [
    "................",
    "..KK......KK....",
    ".KppKK..KKppK...",
    "KpppppKKpppppK..",
    "KppWppppppppppK.",
    "KpWppppppppppfK.",
    "KppppppppppppfK.",
    ".KppppppppppfK..",
    ".KppppppppppfK..",
    "..KpppppppppfK..",
    "...KpppppppfK...",
    "....KppppfK.....",
    ".....KppfK......",
    "......KfK.......",
    ".......K........",
    "................",
  ]),

  // ============================================================
  // Halloween
  // ============================================================

  tpl({ id: "kuerbis", name: "Kürbis", game: "Halloween", category: "Symbol", bgColor: "A-100" }, [
    ".......GG.......",
    ".......GG.......",
    "......MGGM......",
    "...OOOOOOOOOO...",
    "..OoOOOOOOOOoO..",
    ".OoOOOOOOOOOOoO.",
    "OoOOOOOOOOOOOOoO",
    "OOKKKOOOOKKKOOOO",
    "OOOKKOOOOKKOOOOO",
    "OoOOOOKKOOOOOOoO",
    "OoOKOOOOOOKOOOoO",
    "OoOKKOOOOKKOOOoO",
    ".OoOKKKKKKOOOoO.",
    "..OoOOOOOOOOoO..",
    "...OOOOOOOOOO...",
    "................",
  ]),

  tpl({ id: "gespenst", name: "Gespenst", game: "Halloween", category: "Charakter", bgColor: "A-033" }, [
    ".....WWWWWW.....",
    "...WWWWWWWWWW...",
    "..WWWWWWWWWWWW..",
    ".WWWWWWWWWWWWWW.",
    ".WWKKWWWWWWKKWW.",
    "WWWKKWWWWWWKKWWW",
    "WWWKKWWWWWWKKWWW",
    "WWWWWWWWWWWWWWWW",
    "WWWWWWPPWWWWWWWW",
    "WWWWWWPPWWWWWWWW",
    "WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWW",
    "WWCWWWCWWCWWWCWW",
    "WC.CWC.CWC.CWC.C",
    "................",
  ]),

  // ============================================================
  // Weihnachten
  // ============================================================

  tpl({ id: "tannenbaum", name: "Tannenbaum", game: "Weihnachten", category: "Symbol", bgColor: "A-001" }, [
    ".......xx.......",
    "......xYYx......",
    ".......YY.......",
    "......MGGM......",
    ".....MGGGGM.....",
    ".....GGRGGG.....",
    "....MGGGGGGM....",
    "...MGGGYGGGGM...",
    "...GGRGGGGGGG...",
    "..MGGGGGGGRGGM..",
    ".MGGGYGGGGGGGGM.",
    ".GGGGGGGRGGGGGG.",
    "MGGGGYGGGGGGYGGM",
    "......NhhN......",
    "......NhhN......",
    ".....hhhhhh.....",
  ]),

  tpl({ id: "schneemann", name: "Schneemann", game: "Weihnachten", category: "Charakter", bgColor: "A-029" }, [
    "...KKKKKK...",
    "...KKKKKK...",
    "..KKKKKKKK..",
    "...CWWWWC...",
    "..CWWWWWWC..",
    "..CWKWWKWC..",
    "..CWWOOWWC..",
    "..CWWWWWWC..",
    "...CWWWWC...",
    "..CWWWWWWC..",
    ".CWWWKWWWWC.",
    ".CWWWWWWWWC.",
    ".CWWWKWWWWC.",
    ".CWWWWWWWWC.",
    "..CWWWWWWC..",
    "...CCCCCC...",
  ]),

  // ============================================================
  // Ostern
  // ============================================================

  tpl({ id: "osterhase", name: "Osterhase", game: "Ostern", category: "Charakter", bgColor: "A-001" }, [
    "....cc....cc....",
    "...cWc....cWc...",
    "...cWc....cWc...",
    "...cWPc..cPWc...",
    "...cWPc..cPWc...",
    "...cWWc..cWWc...",
    "...ccWccccWcc...",
    "..cWWWWWWWWWWc..",
    ".cWWWWWWWWWWWWc.",
    ".cWKWWWWWWWWKWc.",
    ".cWWWWWWWWWWWWc.",
    ".cWWWWWPPWWWWWc.",
    ".cWWWWPPPPWWWWc.",
    "..cWWWWWWWWWWc..",
    "...cWWWWWWWWc...",
    "....cccccccc....",
  ]),

  tpl({ id: "osterei", name: "Osterei", game: "Ostern", category: "Symbol", bgColor: "A-001" }, [
    "....KKKK....",
    "..KKbbbbKK..",
    ".KbbbbbbbbK.",
    ".KbPPbbPPbK.",
    "KbbbbbbbbbbK",
    "KbYYbbbbYYbK",
    "KbbbbbbbbbbK",
    "KPPbbPPbbPPK",
    "KbbbbbbbbbbK",
    "KbgggbbgggbK",
    "KbbbbbbbbbbK",
    ".KbYYbbYYbK.",
    ".KbbbbbbbbK.",
    "..KbbbbbbK..",
    "...KKbbKK...",
    ".....KK.....",
  ]),

  // ============================================================
  // Retro-Klassiker
  // ============================================================

  tpl({ id: "invader", name: "Space Invader", game: "Space Invaders", category: "Gegner", bgColor: "A-100" }, [
    "....g......g....",
    "....gg....gg....",
    "....gggggggg....",
    "..ggggKKgggggg..",
    ".gggggKKggggggg.",
    "ggggggggggggggg.",
    "gg.gggggggg.gg..",
    "gg.gg....gg.gg..",
    "gg.gg....gg.gg..",
    "...gg....gg.....",
    "..gg......gg....",
    ".gg........gg...",
    ".gg........gg...",
    "gg..........gg..",
    "................",
    "................",
  ]),

  tpl({ id: "tetris-t", name: "Tetris T", game: "Tetris", category: "Block", bgColor: "A-100" }, [
    "vvvvvvvvvvvv",
    "vllvllvllvDv",
    "vlvvlvvlvvDv",
    "vlvvlvvlvvDv",
    "vDDvDDvDDvDv",
    "vvvvvvvvvvvv",
    "....vvvv....",
    "....vllvD...",
    "....vlvvD...",
    "....vlvvD...",
    "....vDDvD...",
    "....vvvv....",
  ]),

  tpl({ id: "tetris-l", name: "Tetris L", game: "Tetris", category: "Block", bgColor: "A-100" }, [
    "OOOO........",
    "OooOD.......",
    "OoOOD.......",
    "ODDDD.......",
    "OOOO........",
    "OooOD.......",
    "OoOOD.......",
    "ODDDD.......",
    "OOOOOOOOOOOO",
    "OooOOooOOooD",
    "OoOOOoOOOoOD",
    "ODDDDDDDDDDD",
  ]),

  tpl({ id: "tetris-o", name: "Tetris O", game: "Tetris", category: "Block", bgColor: "A-100" }, [
    "YYYYYYYY",
    "YyyYYyyY",
    "YyYYYyYY",
    "YyYYYyYY",
    "YDDYYDDY",
    "YYYYYYYY",
    "YyyYYyyY",
    "YyYYYyYY",
    "YyYYYyYY",
    "YDDYYDDY",
    "YDDDYDDY",
    "YYYYYYYY",
  ]),
];
