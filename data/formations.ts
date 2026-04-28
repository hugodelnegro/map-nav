// =============================================================================
// FORMATIONS — opponent piece arrangements indexed by difficulty level
// =============================================================================
//
// Each DifficultyEntry has:
//   difficulty — float rating (e.g. 1.0, 1.5, 4.2) based on piece weight:
//                queen=4  rook=3  bishop=2  pawn=1  (king excluded)
//   variants   — 2–3 layouts for that difficulty level; one is picked at random,
//                never repeating the same variant twice in a row.
//
// Multiple entries can share the same difficulty value — all their variants
// are pooled together when looking up by difficulty.
//
// Primary lookup: getOppFormation(difficulty) → OppPiece[]
// Stage → difficulty:  getFormationDifficulty(stageNumber) → number
//
// Positions use chess-board notation via pos() — see boardNotation.ts.
// =============================================================================


import { pos }      from './boardNotation';
export interface OppPiece {
  name:   string;
  level?: number;   // defaults to 1
  x?:     number;   // 0-1 relative to canvas width
  y?:     number;   // 0-1 relative to canvas height  (top half ≈ 0.05–0.45)
  angle?: number;   // radians, defaults to Math.PI/2 (facing down)
}
// ─── Type ─────────────────────────────────────────────────────────────────────

export interface DifficultyEntry {
  name:       string;    // unique identifier used to track played variants
  difficulty: number;    // auto-assigned: index in DIFFICULTY_TABLE
  variants:   OppPiece[][];
}

// DifficultyEntryDef is used when constructing entries — difficulty is omitted
// because it is derived automatically from the entry's position in the array.
export type DifficultyEntryDef = Omit<DifficultyEntry, 'difficulty'>;

// ─── Difficulty table (primary structure) ─────────────────────────────────────
//
// difficulty = index of the entry in the array (0-based, auto-assigned by
// buildDifficultyTable). Add new entries at the end to extend the range, or
// insert them to shift later difficulties up by one.
//
// Multiple entries can share a difficulty only if the same index position is
// intended — each position in this array maps to exactly one difficulty value.

function buildDifficultyTable(entries: DifficultyEntryDef[]): DifficultyEntry[] {
  return entries.map((entry, i) => ({ ...entry, difficulty: i }));
}

export const DIFFICULTY_TABLE: DifficultyEntry[] = buildDifficultyTable([

  // ── difficulty 0 — king only (tutorial / intro) ──────────────────────────
  {
    name: 'KingAloneEasy',
    variants: [
      [{ name: 'king', ...pos('B3'), angle: -Math.PI / 2 }],
    ],
  },

  // ── difficulty 1 ─────────────────────────────────────────────────────────
  {
    name: 'KingWithPawnEasyA',
    variants: [
      [{ name: 'king', ...pos('D5'), angle: -Math.PI / 2  }, { name: 'pawn', ...pos('D4'), angle: -Math.PI }], // player first
      [{ name: 'king', ...pos('F4'), angle: -Math.PI / 2  }, { name: 'pawn', ...pos('E4'), angle:  -Math.PI/4 }], // cpu first
    ],
  },
  {
    name: 'KingWithPawnEasyA',
    variants: [
      [{ name: 'king', ...pos('D5') }, { name: 'pawn', ...pos('D3'), angle: -Math.PI }], // player first
      [{ name: 'king', ...pos('F3') }, { name: 'pawn', ...pos('E3'), angle:  Math.PI }], // cpu first
    ],
  },

  // ── difficulty 2 ─────────────────────────────────────────────────────────
  {
    name: 'KingWithPawnEasyB',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('D4') }], // player first
      [{ name: 'king', ...pos('E3') }, { name: 'pawn', ...pos('F4') }], // cpu first
    ],
  },

  // ── difficulty 3 ─────────────────────────────────────────────────────────
  {
    name: 'KingTwoPawnsA',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'pawn', ...pos('E4') }],   // player first
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('D4') }, { name: 'pawn', ...pos('D2') }],   // cpu first
      [{ name: 'king', ...pos('F3') }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('E4') }],   // player first
    ],
  },

  // ── difficulty 4 ─────────────────────────────────────────────────────────
  {
    name: 'KingTwoPawnsB',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('D4') }],   // player first
      [{ name: 'king', ...pos('D2') }, { name: 'bishop', ...pos('F4'), level: 2 }],   // cpu first
    ],
  },

  // ── difficulty 5 ─────────────────────────────────────────────────────────
  {
    name: 'KingThreePawnsA',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'bishop', ...pos('E4') }],   // player first
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],   // cpu first
      [{ name: 'king', ...pos('C3') }, { name: 'pawn', ...pos('C4'), level: 2 }, { name: 'bishop', ...pos('D5') }],   // player first
    ],
  },

  // ── difficulty 6 ─────────────────────────────────────────────────────────
  {
    name: 'KingThreePawnsB',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('C4') }, { name: 'bishop', ...pos('D4') }],   // player first
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],   // cpu first
      [{ name: 'king', ...pos('E3') }, { name: 'bishop', ...pos('C3') }, { name: 'bishop', ...pos('D4'), level: 2 }],   // player first
    ],
  },

  // ── difficulty 7 ─────────────────────────────────────────────────────────
  {
    name: 'KingThreePawnsC',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }],   // player first
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5') }],   // cpu first
      [{ name: 'king', ...pos('B4') }, { name: 'rook', ...pos('B5'), level: 2 }],   // player first
    ],
  },

  // ── difficulty 8 ─────────────────────────────────────────────────────────
   {
    name: 'KingThreePawnsC',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5')}, { name: 'bishop', ...pos('E5') }],   // player first
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5') },{ name: 'bishop', ...pos('D5') }], ,   // cpu first
      [{ name: 'king', ...pos('B4') }, { name: 'rook', ...pos('B5'), level: 2 }, { name: 'bishop', ...pos('D5'), level: 2 }],   // player first
    ],
  },

   {
    name: 'KingFourPawnsA',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3')  }, { name: 'rook', ...pos('D5')  }],   // player first
      [{ name: 'king', ...pos('D4') }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('F4') }, { name: 'pawn', ...pos('D5') }, { name: 'pawn', ...pos('D2') }],   // cpu first
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2  }, { name: 'rook', ...pos('D5'), level: 2  }], ,   // player first
    ],
  },

  // ── difficulty 9 ─────────────────────────────────────────────────────────
  {
    name: 'KingFourPawnsA',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('D5'), level: 2   }],   // player first
      [{ name: 'king', ...pos('D5') }, { name: 'rook', ...pos('C4') }, { name: 'rook', ...pos('E4')   }],   // cpu first
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5'), level: 2 }],   // player first
    ],
  },

  // ── difficulty 10 ────────────────────────────────────────────────────────
  {
    name: 'KingFourPawnsB',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('C3') }, { name: 'pawn', ...pos('E3') }, { name: 'pawn', ...pos('D5') }, { name: 'pawn', ...pos('A2') }],   // player first
      [{ name: 'king', ...pos('D4') }, { name: 'pawn', ...pos('B5') }, { name: 'rook', ...pos('D5') }, { name: 'pawn', ...pos('E5') }],   // cpu first
      [{ name: 'king', ...pos('D5') }, { name: 'rook', ...pos('C4') }, { name: 'pawn', ...pos('D4') }, { name: 'pawn', ...pos('E4') }, { name: 'pawn', ...pos('G2') }],   // player first
    ],
  },

  // ── difficulty 11 ────────────────────────────────────────────────────────
  {
    name: 'KingBishopTwoPawns',
    variants: [
      // bishop left flank
      [{ name: 'king', ...pos('D4') }, { name: 'bishop', ...pos('B5') }, { name: 'pawn', ...pos('D5') }, { name: 'pawn', ...pos('F2') }],
      // bishop right flank
      [{ name: 'king', ...pos('D4') }, { name: 'pawn', ...pos('F2') }, { name: 'bishop', ...pos('D5'), level: 2 }, { name: 'pawn', ...pos('B2') }],
      // bishop centre
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('D5'), level: 2 }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('F4') }],
    ],
  },

  // ── difficulty 12 ────────────────────────────────────────────────────────
  {
    name: 'KingTwoBishopsPawn',
    variants: [
      // twin bishops flanking
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B3') }, { name: 'pawn', ...pos('F3') }, { name: 'bishop', ...pos('D4') }],
      // bishop + pawn wedge
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('C4') }, { name: 'pawn', ...pos('E3') }, { name: 'bishop', ...pos('D5'), level: 2 }],
      // corner ambush
      [{ name: 'king', ...pos('D4') }, { name: 'bishop', ...pos('A4') }, { name: 'bishop', ...pos('G4') }, { name: 'bishop', ...pos('D5') }],
    ],
  },

  // ── difficulty 13 ────────────────────────────────────────────────────────
  {
    name: 'KingRookBishopPawn',
    variants: [
      // rook shield
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('B2') }, { name: 'pawn', ...pos('F2') }],
      // rook side
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('A3') }, { name: 'bishop', ...pos('F2') }, { name: 'bishop', ...pos('D5'), level: 2 }],
      // rook + twin pawns
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }, { name: 'pawn', ...pos('B5'), level: 2 }, { name: 'pawn', ...pos('F5'), level: 2 }],
    ],
  },

  // ── difficulty 14 ────────────────────────────────────────────────────────
  {
    name: 'KingRookBishopTwoPawns',
    variants: [
      // wide pawns + rook/bishop centre
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('E3') }, { name: 'pawn', ...pos('A2') }, { name: 'pawn', ...pos('G2') }],
      // rook deep, bishop far wing
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D4') }, { name: 'bishop', ...pos('A3') }, { name: 'pawn', ...pos('C3') }, { name: 'pawn', ...pos('G2') }],
      // rook right flank
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('B3') }, { name: 'pawn', ...pos('D4') }, { name: 'pawn', ...pos('F4') }],
    ],
  },

  // ── difficulty 15 ────────────────────────────────────────────────────────
  {
    name: 'KingQueenBishopPawn',
    variants: [
      // queen far forward
      [{ name: 'king', ...pos('D3') }, { name: 'queen', ...pos('D4') }, { name: 'bishop', ...pos('C3') }, { name: 'pawn', ...pos('E3') }],
      // queen off-axis
      [{ name: 'king', ...pos('D3') }, { name: 'queen', ...pos('B3') }, { name: 'pawn', ...pos('E3') }, { name: 'bishop', ...pos('D5') }],
      // queen deep + flanking pawn
      [{ name: 'king', ...pos('D3') }, { name: 'queen', ...pos('C3') }, { name: 'bishop', ...pos('D5') }, { name: 'pawn', ...pos('B3') }],
    ],
  },

  // ── difficulty 16 ────────────────────────────────────────────────────────
  {
    name: 'KingQueenRookBishop',
    variants: [
      // queen + rook + bishop wall
      [{ name: 'king', ...pos('D4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('B2') }, { name: 'bishop', ...pos('F2') }],
      // queen centre, rooks flanking
      [{ name: 'king', ...pos('D5') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      // queen flank, rook + bishop opposite
      [{ name: 'king', ...pos('D5') }, { name: 'queen', ...pos('B3') }, { name: 'rook', ...pos('F2') }, { name: 'bishop', ...pos('D3') }],
    ],
  },

  // ── difficulty 17 ────────────────────────────────────────────────────────
  {
    name: 'KingTwoRooksBishopPawn',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('B3') }, { name: 'bishop', ...pos('F3') }, { name: 'rook', ...pos('D4') }, { name: 'pawn', ...pos('D2') }],
      // rook pincer + bishop deep
      [{ name: 'king', ...pos('D2') }, { name: 'rook', ...pos('B3') }, { name: 'rook', ...pos('F3') }, { name: 'bishop', ...pos('D3') }, { name: 'pawn', ...pos('D5') }],
      // staggered
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('F2') }, { name: 'bishop', ...pos('E4') }, { name: 'pawn', ...pos('C2') }],
    ],
  },

  // ── difficulty 18 ────────────────────────────────────────────────────────
  {
    name: 'KingTwoRooksBishopPawnWide',
    variants: [
      [{ name: 'king', ...pos('D2') }, { name: 'rook', ...pos('B3') }, { name: 'bishop', ...pos('F3') }, { name: 'bishop', ...pos('D3') }, { name: 'rook', ...pos('D5') }],
      // staggered + bishop edge
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('F4') }, { name: 'pawn', ...pos('C3') }],
      // rook + bishop spine
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('A2') }, { name: 'bishop', ...pos('E3') }, { name: 'pawn', ...pos('G4') }],
    ],
  },

  // ── difficulty 19 ────────────────────────────────────────────────────────
  {
    name: 'KingQueenTwoRooksBishop',
    variants: [
      // queen centre, twin rooks, bishop deep
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D4') }],
      // queen flank + twin rooks spread
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('G3') }, { name: 'bishop', ...pos('F2') }],
      // queen + rook wall + bishop
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('C4') }, { name: 'bishop', ...pos('G4') }],
    ],
  },

  // ── difficulty 20 ────────────────────────────────────────────────────────
  {
    name: 'KingQueenTwoRooksTwoBishops',
    variants: [
      // pincer: queen + twin rooks + twin bishops
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('F4') }, { name: 'bishop', ...pos('C2') }, { name: 'bishop', ...pos('E2') }],
      // queen flank, rook spine, twin bishops spread
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('A3') }, { name: 'bishop', ...pos('B4') }, { name: 'bishop', ...pos('E3') }],
      // queen deep + asymmetric rooks + bishops
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'rook', ...pos('G4') }, { name: 'rook', ...pos('E4') }, { name: 'bishop', ...pos('C4') }, { name: 'bishop', ...pos('F2') }],
    ],
  },

  // ── difficulty 21 ────────────────────────────────────────────────────────
  {
    name: 'KingTwoQueensTwoRooksBishop',
    variants: [
      // twin queens close + twin rooks + bishop
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D5') }],
      // twin queens spread + rooks deep
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D4') }],
      // twin queens flanking + rook + bishop spine
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('D2') }, { name: 'bishop', ...pos('E5') }],
    ],
  },

  // ── difficulty 22 ────────────────────────────────────────────────────────
  {
    name: 'KingThreeQueensRook',
    variants: [
      // triple queen fan + rook spine
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D2') }],
      // queens deep + rook guard
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('D3') }],
      // asymmetric queens + rook flank
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E4') }, { name: 'queen', ...pos('B5') }, { name: 'rook', ...pos('F2') }],
    ],
  },

  // ── difficulty 23 ────────────────────────────────────────────────────────
  {
    name: 'KingThreeQueensTwoRooks',
    variants: [
      // triple queen centre + twin rooks wide
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      // queens cluster + rooks pincer
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('E4') }, { name: 'rook', ...pos('B3') }, { name: 'rook', ...pos('F3') }],
      // queens spread + rooks deep
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('C5') }, { name: 'rook', ...pos('E5') }],
    ],
  },

  // ── difficulty 24 ────────────────────────────────────────────────────────
  {
    name: 'KingThreeQueensTwoRooksBishop',
    variants: [
      // triple fan + rooks wide + bishop anchor
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D3') }],
      // queens diagonal + rooks flank + bishop deep
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('C2') }, { name: 'rook', ...pos('E2') }, { name: 'bishop', ...pos('D5') }],
      // queens right side + rooks left + bishop spine
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('E3') }, { name: 'queen', ...pos('F4') }, { name: 'queen', ...pos('G5') }, { name: 'rook', ...pos('B2') }, { name: 'rook', ...pos('A4') }, { name: 'bishop', ...pos('D3') }],
    ],
  },

  // ── difficulty 25 ────────────────────────────────────────────────────────
  {
    name: 'KingFourQueensRook',
    variants: [
      // quad queens box + rook centre
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('F3') }, { name: 'queen', ...pos('B5') }, { name: 'queen', ...pos('F5') }, { name: 'rook', ...pos('D4') }],
      // quad queens arc + rook deep
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('E4') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('D5') }],
      // quad queens spine + rook wing
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D2') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('G3') }],
    ],
  },

  // ── difficulty 26 ────────────────────────────────────────────────────────
  {
    name: 'KingFourQueensTwoRooks',
    variants: [
      // quad queens spread + twin rooks flanking
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'queen', ...pos('D2') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      // quad queens arc + rooks deep corners
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('B5') }, { name: 'rook', ...pos('F5') }],
      // quad queens diamond + rooks mid
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
    ],
  }

]);

// ─── Chapter stage-to-difficulty mappings ─────────────────────────────────────
//
//   Chapter 1 — Ice   (stages  1– 6): diff 0 → 3
//   Chapter 2 — Swamp (stages  7–11): diff 4 → 6
//   Chapter 3 — Lava  (stages 12–16): diff 7 → 10
//
// After all chapters the game loops back, raising every difficulty by
// LOOP_DIFFICULTY_INCREMENT per completed loop (capped at MAX_DIFFICULTY).

const ICE_CHAPTER:   number[] = [0, 1, 1, 2, 2, 3];
const SWAMP_CHAPTER: number[] = [4, 4, 5, 5, 6];
const LAVA_CHAPTER:  number[] = [7, 7, 8, 9, 10];


const FLAT_STAGES:              number[] = [...ICE_CHAPTER, ...SWAMP_CHAPTER, ...LAVA_CHAPTER];
const STAGES_PER_LOOP           = FLAT_STAGES.length;   // 16
const LOOP_DIFFICULTY_INCREMENT = 1;
export const MAX_DIFFICULTY     = DIFFICULTY_TABLE[DIFFICULTY_TABLE.length - 1].difficulty;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

type Variant = { id: string; pieces: OppPiece[] };

const variantsFor = (difficulty: number): Variant[] => {
  const entries = DIFFICULTY_TABLE.filter(e => e.difficulty === difficulty);
  const pool    = entries.length > 0 ? entries : DIFFICULTY_TABLE;
  return pool.flatMap(entry =>
    entry.variants.map((pieces, idx) => ({ id: `${entry.name}_${idx}`, pieces }))
  );
};


const baseDifficultyForStage = (stageNumber: number): number => {
  const loop     = Math.floor((stageNumber - 1) / STAGES_PER_LOOP);
  const position = (stageNumber - 1) % STAGES_PER_LOOP;
  return Math.min(FLAT_STAGES[position] + loop * LOOP_DIFFICULTY_INCREMENT, MAX_DIFFICULTY);
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const getVariantCount = (difficulty: number): number => variantsFor(difficulty).length;

const DEFAULT_ANGLE = Math.PI / 2;

export interface FormationResult {
  pieces:    OppPiece[];
  firstTurn: 'A' | 'B';   // variant 0 → player first, variant 1 → computer first
}

/** Pure: returns the formation for `difficulty` at the given `playCount`.
 *  playCount=0 → first variant (player goes first), playCount=1 → second, etc.
 *  Cycles through all variants then repeats. */
export const getOppFormation = (difficulty: number, playCount: number): FormationResult => {
  const all    = variantsFor(difficulty);
  const index  = playCount % all.length;
  const chosen = all[index];
  return {
    pieces:    chosen.pieces.map(p => ({ ...p, angle: p.angle ?? DEFAULT_ANGLE })),
    firstTurn: index % 2 === 0 ? 'A' : 'B',
  };
};

