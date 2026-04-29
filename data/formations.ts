// =============================================================================
// FORMATIONS — opponent piece arrangements indexed by difficulty level
// =============================================================================
//
// Each DifficultyEntry has:
//   id         — unique string identifier used to track played variants
//   name       — human-readable display label
//   difficulty — auto-assigned from position in DIFFICULTY_TABLE (0-based)
//   variants   — 2–3 layouts for that difficulty level
//
// Progression (48 entries):
//   0        king alone
//   1–3      king + 1 pawn
//   4–5      king + 2 pawns
//   6–7      king + 1 bishop
//   8–9      king + pawn + bishop
//   10–11    king + 2 bishops
//   12–13    king + 3 pawns
//   14–15    king + 1 rook
//   16–17    king + rook + pawn
//   18–19    king + rook + bishop
//   20–21    king + 2 rooks
//   22–23    king + 2 rooks + pawn
//   24–25    king + 2 rooks + bishop
//   26–27    king + 2 rooks + 2 bishops
//   28–29    king + queen
//   30–31    king + queen + pawn
//   32–33    king + queen + bishop
//   34–35    king + queen + rook
//   36–37    king + queen + 2 rooks
//   38–39    king + queen + 2 rooks + bishop
//   40–41    king + 2 queens
//   42–43    king + 2 queens + rook
//   44–45    king + 2 queens + 2 rooks
//   46–47    king + 2 queens + 2 rooks + bishop
//   48       king + 3 queens + rook
//   49       king + 3 queens + 2 rooks
//   50       king + 3 queens + 2 rooks + bishop
//   51       king + 4 queens + rook
//   52       king + 4 queens + 2 rooks
// =============================================================================

import { pos } from './boardNotation';

export interface OppPiece {
  name:   string;
  level?: number;
  x?:     number;
  y?:     number;
  angle?: number;
}

export interface DifficultyEntry {
  id:         string;
  name:       string;
  difficulty: number;
  variants:   OppPiece[][];
}

export type DifficultyEntryDef = Omit<DifficultyEntry, 'difficulty'>;

function buildDifficultyTable(entries: DifficultyEntryDef[]): DifficultyEntry[] {
  return entries.map((entry, i) => ({ ...entry, difficulty: i }));
}

export const DIFFICULTY_TABLE: DifficultyEntry[] = buildDifficultyTable([

  // ── 0: King alone ───────────────────────────────────────────────────────────
  {
    id: 'king_alone_easy', name: 'King Alone',
    variants: [
      [{ name: 'king', ...pos('D3'), angle: -Math.PI / 2 }],
    ],
  },

  // ── 1–3: King + 1 pawn ──────────────────────────────────────────────────────
  {
    id: 'king_pawn_easy_a', name: 'King + Pawn A',
    variants: [
      [{ name: 'king', ...pos('D5') }, { name: 'pawn', ...pos('D4'), angle: -Math.PI }],
      [{ name: 'king', ...pos('F4') }, { name: 'pawn', ...pos('E4'), angle: -Math.PI / 4 }],
    ],
  },
  {
    id: 'king_pawn_easy_b', name: 'King + Pawn B',
    variants: [
      [{ name: 'king', ...pos('D5') }, { name: 'pawn', ...pos('D3'), angle: -Math.PI }],
      [{ name: 'king', ...pos('F3') }, { name: 'pawn', ...pos('E3'), angle: Math.PI }],
    ],
  },
  {
    id: 'king_pawn_easy_c', name: 'King + Pawn C',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('D4') }],
      [{ name: 'king', ...pos('E3') }, { name: 'pawn', ...pos('F4') }],
      [{ name: 'king', ...pos('B3') }, { name: 'pawn', ...pos('C4') }],
    ],
  },

  // ── 4–5: King + 2 pawns ─────────────────────────────────────────────────────
  {
    id: 'king_two_pawns_a', name: 'King + 2 Pawns A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'pawn', ...pos('E4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('D4') }, { name: 'pawn', ...pos('D2') }],
      [{ name: 'king', ...pos('F3') }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('E4') }],
    ],
  },
  {
    id: 'king_two_pawns_b', name: 'King + 2 Pawns B',
    variants: [
      [{ name: 'king', ...pos('E3') }, { name: 'pawn', ...pos('C3') }, { name: 'pawn', ...pos('G3') }],
      [{ name: 'king', ...pos('D4') }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('F4') }],
      [{ name: 'king', ...pos('D2') }, { name: 'pawn', ...pos('C4'), level: 2 }, { name: 'pawn', ...pos('E4'), level: 2 }],
    ],
  },

  // ── 6–7: King + 1 bishop ────────────────────────────────────────────────────
  {
    id: 'king_bishop_a', name: 'King + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('F3') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('B3') }, { name: 'bishop', ...pos('D5') }],
    ],
  },
  {
    id: 'king_bishop_b', name: 'King + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('F5') }],
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B5') }],
      [{ name: 'king', ...pos('D2') }, { name: 'bishop', ...pos('D4'), level: 2 }],
    ],
  },

  // ── 8–9: King + pawn + bishop ───────────────────────────────────────────────
  {
    id: 'king_pawn_bishop_a', name: 'King + Pawn + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('E4') }, { name: 'bishop', ...pos('B5') }],
      [{ name: 'king', ...pos('E3') }, { name: 'pawn', ...pos('C4') }, { name: 'bishop', ...pos('D5') }],
    ],
  },
  {
    id: 'king_pawn_bishop_b', name: 'King + Pawn + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('C3') }, { name: 'pawn', ...pos('C4'), level: 2 }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('E3') }, { name: 'pawn', ...pos('E4'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }],
    ],
  },

  // ── 10–11: King + 2 bishops ─────────────────────────────────────────────────
  {
    id: 'king_two_bishops_a', name: 'King + 2 Bishops A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B5') }, { name: 'bishop', ...pos('F5') }],
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('C5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B4') }, { name: 'bishop', ...pos('F4') }],
    ],
  },
  {
    id: 'king_two_bishops_b', name: 'King + 2 Bishops B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('C5') }, { name: 'bishop', ...pos('E5'), level: 2 }],
      [{ name: 'king', ...pos('E3') }, { name: 'bishop', ...pos('B5'), level: 2 }, { name: 'bishop', ...pos('F5'), level: 2 }],
    ],
  },

  // ── 12–13: King + 3 pawns ───────────────────────────────────────────────────
  {
    id: 'king_three_pawns_a', name: 'King + 3 Pawns A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'bishop', ...pos('E4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('C3') }, { name: 'pawn', ...pos('C4'), level: 2 }, { name: 'bishop', ...pos('D5') }],
    ],
  },
  {
    id: 'king_three_pawns_b', name: 'King + 3 Pawns B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('C4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('E3') }, { name: 'bishop', ...pos('C3') }, { name: 'bishop', ...pos('D4'), level: 2 }],
    ],
  },

  // ── 14–15: King + 1 rook ────────────────────────────────────────────────────
  {
    id: 'king_rook_a', name: 'King + Rook A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('F3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('B3') }, { name: 'rook', ...pos('D5') }],
    ],
  },
  {
    id: 'king_rook_b', name: 'King + Rook B',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5') }],
      [{ name: 'king', ...pos('B4') }, { name: 'rook', ...pos('B5'), level: 2 }],
    ],
  },

  // ── 16–17: King + rook + pawn ───────────────────────────────────────────────
  {
    id: 'king_rook_pawn_a', name: 'King + Rook + Pawn A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'pawn', ...pos('C4') }],
      [{ name: 'king', ...pos('F3') }, { name: 'rook', ...pos('D5') }, { name: 'pawn', ...pos('E4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('F5') }, { name: 'pawn', ...pos('E4') }],
    ],
  },
  {
    id: 'king_rook_pawn_b', name: 'King + Rook + Pawn B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('D5'), level: 2 }, { name: 'pawn', ...pos('C4') }],
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5'), level: 2 }, { name: 'pawn', ...pos('D4'), level: 2 }],
    ],
  },

  // ── 18–19: King + rook + bishop ─────────────────────────────────────────────
  {
    id: 'king_rook_bishop_a', name: 'King + Rook + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('B4') }, { name: 'rook', ...pos('B5'), level: 2 }, { name: 'bishop', ...pos('D5'), level: 2 }],
    ],
  },
  {
    id: 'king_rook_bishop_b', name: 'King + Rook + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('F5') }, { name: 'bishop', ...pos('B5') }],
      [{ name: 'king', ...pos('D3') }, { name: 'rook', ...pos('B5'), level: 2 }, { name: 'bishop', ...pos('F5'), level: 2 }],
    ],
  },

  // ── 20–21: King + 2 rooks ───────────────────────────────────────────────────
  {
    id: 'king_two_rooks_a', name: 'King + 2 Rooks A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B5') }, { name: 'rook', ...pos('F5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }, { name: 'rook', ...pos('D3') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('A4') }, { name: 'rook', ...pos('G4') }],
    ],
  },
  {
    id: 'king_two_rooks_b', name: 'King + 2 Rooks B',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B4'), level: 2 }, { name: 'rook', ...pos('F4'), level: 2 }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5'), level: 2 }, { name: 'rook', ...pos('A3'), level: 2 }],
    ],
  },

  // ── 22–23: King + 2 rooks + pawn ────────────────────────────────────────────
  {
    id: 'king_two_rooks_pawn_a', name: 'King + 2 Rooks + Pawn A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B5') }, { name: 'rook', ...pos('F5') }, { name: 'pawn', ...pos('D5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'pawn', ...pos('C4') }],
    ],
  },
  {
    id: 'king_two_rooks_pawn_b', name: 'King + 2 Rooks + Pawn B',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B5'), level: 2 }, { name: 'rook', ...pos('F5'), level: 2 }, { name: 'pawn', ...pos('D5'), level: 2 }],
      [{ name: 'king', ...pos('E4') }, { name: 'rook', ...pos('C5'), level: 2 }, { name: 'rook', ...pos('G5'), level: 2 }, { name: 'pawn', ...pos('E5'), level: 2 }],
    ],
  },

  // ── 24–25: King + 2 rooks + bishop ──────────────────────────────────────────
  {
    id: 'king_two_rooks_bishop_a', name: 'King + 2 Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('F4') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('D5'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }],
    ],
  },
  {
    id: 'king_two_rooks_bishop_b', name: 'King + 2 Rooks + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B5'), level: 2 }, { name: 'rook', ...pos('F5'), level: 2 }, { name: 'bishop', ...pos('D5'), level: 2 }],
      [{ name: 'king', ...pos('E4') }, { name: 'rook', ...pos('C5'), level: 2 }, { name: 'rook', ...pos('G4'), level: 2 }, { name: 'bishop', ...pos('E5'), level: 2 }],
    ],
  },

  // ── 26–27: King + 2 rooks + 2 bishops ───────────────────────────────────────
  {
    id: 'king_two_rooks_two_bishops_a', name: 'King + 2 Rooks + 2 Bishops A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('C5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('F4') }, { name: 'bishop', ...pos('B5') }, { name: 'bishop', ...pos('F5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('D5'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }, { name: 'bishop', ...pos('E5'), level: 2 }],
    ],
  },
  {
    id: 'king_two_rooks_two_bishops_b', name: 'King + 2 Rooks + 2 Bishops B',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('A4'), level: 2 }, { name: 'rook', ...pos('G4'), level: 2 }, { name: 'bishop', ...pos('B5'), level: 2 }, { name: 'bishop', ...pos('F5'), level: 2 }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B3'), level: 2 }, { name: 'rook', ...pos('F3'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }, { name: 'bishop', ...pos('E5'), level: 2 }],
    ],
  },

  // ── 28–29: King + 1 queen ───────────────────────────────────────────────────
  {
    id: 'king_queen_a', name: 'King + Queen A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }],
    ],
  },
  {
    id: 'king_queen_b', name: 'King + Queen B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('G3') }],
    ],
  },

  // ── 30–31: King + queen + pawn ──────────────────────────────────────────────
  {
    id: 'king_queen_pawn_a', name: 'King + Queen + Pawn A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'pawn', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'pawn', ...pos('E4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'pawn', ...pos('C4') }],
    ],
  },
  {
    id: 'king_queen_pawn_b', name: 'King + Queen + Pawn B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D4') }, { name: 'pawn', ...pos('C4'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('E3') }, { name: 'pawn', ...pos('F4'), level: 2 }],
    ],
  },

  // ── 32–33: King + queen + bishop ────────────────────────────────────────────
  {
    id: 'king_queen_bishop_a', name: 'King + Queen + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'bishop', ...pos('E4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'bishop', ...pos('D4') }],
    ],
  },
  {
    id: 'king_queen_bishop_b', name: 'King + Queen + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D4') }, { name: 'bishop', ...pos('F4'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'bishop', ...pos('D4'), level: 2 }],
    ],
  },

  // ── 34–35: King + queen + rook ──────────────────────────────────────────────
  {
    id: 'king_queen_rook_a', name: 'King + Queen + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'rook', ...pos('G3') }],
    ],
  },
  {
    id: 'king_queen_rook_b', name: 'King + Queen + Rook B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('G4'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('B3'), level: 2 }],
    ],
  },

  // ── 36–37: King + queen + 2 rooks ───────────────────────────────────────────
  {
    id: 'king_queen_two_rooks_a', name: 'King + Queen + 2 Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D4') }, { name: 'rook', ...pos('B3') }, { name: 'rook', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('D4') }],
    ],
  },
  {
    id: 'king_queen_two_rooks_b', name: 'King + Queen + 2 Rooks B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A3'), level: 2 }, { name: 'rook', ...pos('G3'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('F3'), level: 2 }],
    ],
  },

  // ── 38–39: King + queen + 2 rooks + bishop ──────────────────────────────────
  {
    id: 'king_queen_two_rooks_bishop_a', name: 'King + Queen + 2 Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }, { name: 'bishop', ...pos('E4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('A3') }, { name: 'bishop', ...pos('B4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'rook', ...pos('G4') }, { name: 'rook', ...pos('E4') }, { name: 'bishop', ...pos('D4') }],
    ],
  },
  {
    id: 'king_queen_two_rooks_bishop_b', name: 'King + Queen + 2 Rooks + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D4') }, { name: 'rook', ...pos('A3'), level: 2 }, { name: 'rook', ...pos('G3'), level: 2 }, { name: 'bishop', ...pos('E5'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('B3'), level: 2 }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }],
    ],
  },

  // ── 40–41: King + 2 queens ──────────────────────────────────────────────────
  {
    id: 'king_two_queens_a', name: 'King + 2 Queens A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G3') }],
    ],
  },
  {
    id: 'king_two_queens_b', name: 'King + 2 Queens B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('E4') }],
    ],
  },

  // ── 42–43: King + 2 queens + rook ───────────────────────────────────────────
  {
    id: 'king_two_queens_rook_a', name: 'King + 2 Queens + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('D3') }],
    ],
  },
  {
    id: 'king_two_queens_rook_b', name: 'King + 2 Queens + Rook B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E4') }, { name: 'rook', ...pos('D5'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('D2'), level: 2 }],
    ],
  },

  // ── 44–45: King + 2 queens + 2 rooks ────────────────────────────────────────
  {
    id: 'king_two_queens_two_rooks_a', name: 'King + 2 Queens + 2 Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('C3') }, { name: 'rook', ...pos('E3') }],
    ],
  },
  {
    id: 'king_two_queens_two_rooks_b', name: 'King + 2 Queens + 2 Rooks B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('A2'), level: 2 }, { name: 'rook', ...pos('G2'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('E4') }, { name: 'rook', ...pos('B2'), level: 2 }, { name: 'rook', ...pos('F2'), level: 2 }],
    ],
  },

  // ── 46–47: King + 2 queens + 2 rooks + bishop ───────────────────────────────
  {
    id: 'king_two_queens_two_rooks_bishop_a', name: 'King + 2 Queens + 2 Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('D2') }, { name: 'bishop', ...pos('E5') }],
    ],
  },
  {
    id: 'king_two_queens_two_rooks_bishop_b', name: 'King + 2 Queens + 2 Rooks + Bishop B',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2'), level: 2 }, { name: 'rook', ...pos('G2'), level: 2 }, { name: 'bishop', ...pos('D5'), level: 2 }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('E4') }, { name: 'rook', ...pos('B2'), level: 2 }, { name: 'rook', ...pos('F2'), level: 2 }, { name: 'bishop', ...pos('D3'), level: 2 }],
    ],
  },

  // ── 48: King + 3 queens + rook ──────────────────────────────────────────────
  {
    id: 'king_three_queens_rook_a', name: 'King + 3 Queens + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('D3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E4') }, { name: 'queen', ...pos('B5') }, { name: 'rook', ...pos('F2') }],
    ],
  },

  // ── 49: King + 3 queens + 2 rooks ───────────────────────────────────────────
  {
    id: 'king_three_queens_two_rooks_a', name: 'King + 3 Queens + 2 Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('E4') }, { name: 'rook', ...pos('B3') }, { name: 'rook', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('C5') }, { name: 'rook', ...pos('E5') }],
    ],
  },

  // ── 50: King + 3 queens + 2 rooks + bishop ──────────────────────────────────
  {
    id: 'king_three_queens_two_rooks_bishop_a', name: 'King + 3 Queens + 2 Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('C2') }, { name: 'rook', ...pos('E2') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('E3') }, { name: 'queen', ...pos('F4') }, { name: 'queen', ...pos('G5') }, { name: 'rook', ...pos('B2') }, { name: 'rook', ...pos('A4') }, { name: 'bishop', ...pos('D3') }],
    ],
  },

  // ── 51: King + 4 queens + rook ──────────────────────────────────────────────
  {
    id: 'king_four_queens_rook_a', name: 'King + 4 Queens + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('F3') }, { name: 'queen', ...pos('B5') }, { name: 'queen', ...pos('F5') }, { name: 'rook', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('E4') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D2') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('G3') }],
    ],
  },

  // ── 52: King + 4 queens + 2 rooks ───────────────────────────────────────────
  {
    id: 'king_four_queens_two_rooks_a', name: 'King + 4 Queens + 2 Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'queen', ...pos('D2') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('B5') }, { name: 'rook', ...pos('F5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
    ],
  },

]);

import { PIECE_CATALOGUE, getPieceKey } from './pieces';

/**
 * Formation level = total non-king weight across all variants,
 * divided by variant count (normalises for formations with different
 * numbers of variants), then divided by 2 (scales pawn weight=2 → level 1).
 *
 *   king alone                →  0
 *   king + pawn               →  1
 *   king + 2 pawns            →  2
 *   king + bishop             →  3
 *   king + pawn + bishop      →  4
 *   king + 2 bishops          →  5
 *   king + rook               →  6
 *   king + rook + bishop      →  9
 *   king + queen              → 10
 *   king + 2 queens + 2 rooks → 30
 */
export const getFormationLevel = (entry: DifficultyEntry): number => {
  let totalWeight = 0;

  for (const variant of entry.variants) {
    for (const piece of variant) {
      if (piece.name === 'king') continue;
      const key    = getPieceKey(piece.name, piece.level ?? 1);
      const meta   = PIECE_CATALOGUE[key] ?? PIECE_CATALOGUE[piece.name];
      totalWeight += meta?.weight ?? 0;
    }
  }

  return Math.round(totalWeight / entry.variants.length / 2);
};

// ─── Fast lookup by id ────────────────────────────────────────────────────────

const formationById = new Map(DIFFICULTY_TABLE.map(e => [e.id, e]));

export const getFormationById = (id: string): DifficultyEntry | undefined =>
  formationById.get(id);

// ─── Chapter stage-to-difficulty mappings ─────────────────────────────────────

const ICE_CHAPTER:   number[] = [0, 1, 2, 3, 4, 5];
const SWAMP_CHAPTER: number[] = [6, 7, 8, 9, 10, 11, 12, 13];
const LAVA_CHAPTER:  number[] = [14, 15, 16, 17, 18, 19, 20, 21];

const FLAT_STAGES:              number[] = [...ICE_CHAPTER, ...SWAMP_CHAPTER, ...LAVA_CHAPTER];
const STAGES_PER_LOOP           = FLAT_STAGES.length;
const LOOP_DIFFICULTY_INCREMENT = 1;
export const MAX_DIFFICULTY     = DIFFICULTY_TABLE[DIFFICULTY_TABLE.length - 1].difficulty;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

type Variant = { id: string; pieces: OppPiece[] };

const variantsFor = (difficulty: number): Variant[] => {
  const entries = DIFFICULTY_TABLE.filter(e => e.difficulty === difficulty);
  const pool    = entries.length > 0 ? entries : DIFFICULTY_TABLE;
  return pool.flatMap(entry =>
    entry.variants.map((pieces, idx) => ({ id: `${entry.id}_${idx}`, pieces }))
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
  firstTurn: 'A' | 'B';
}

export const getOppFormation = (difficulty: number, playCount: number): FormationResult => {
  const all    = variantsFor(difficulty);
  const index  = playCount % all.length;
  const chosen = all[index];
  return {
    pieces:    chosen.pieces.map(p => ({ ...p, angle: p.angle ?? DEFAULT_ANGLE })),
    firstTurn: index % 2 === 0 ? 'A' : 'B',
  };
};