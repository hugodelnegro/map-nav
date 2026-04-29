// =============================================================================
// FORMATIONS — opponent piece arrangements indexed by difficulty level
// =============================================================================
//
// Each DifficultyEntry has:
//   id         — unique string identifier used to track played variants
//   name       — human-readable display label
//   difficulty — float rating auto-assigned from position in DIFFICULTY_TABLE
//   variants   — 2–3 layouts for that difficulty level
//
// Primary lookup: getOppFormation(difficulty) → OppPiece[]
// Stage → difficulty:  getFormationDifficulty(stageNumber) → number
//
// Positions use chess-board notation via pos() — see boardNotation.ts.
// =============================================================================

import { pos } from './boardNotation';

export interface OppPiece {
  name:   string;
  level?: number;   // defaults to 1
  x?:     number;   // 0-1 relative to canvas width
  y?:     number;   // 0-1 relative to canvas height  (top half ≈ 0.05–0.45)
  angle?: number;   // radians, defaults to Math.PI/2 (facing down)
}

// ─── Type ─────────────────────────────────────────────────────────────────────

export interface DifficultyEntry {
  id:         string;   // unique stable identifier
  name:       string;   // human-readable display label
  difficulty: number;   // auto-assigned: index in DIFFICULTY_TABLE
  variants:   OppPiece[][];
}

// DifficultyEntryDef is used when constructing entries — difficulty is omitted
// because it is derived automatically from the entry's position in the array.
export type DifficultyEntryDef = Omit<DifficultyEntry, 'difficulty'>;

// ─── Difficulty table (primary structure) ─────────────────────────────────────

function buildDifficultyTable(entries: DifficultyEntryDef[]): DifficultyEntry[] {
  return entries.map((entry, i) => ({ ...entry, difficulty: i }));
}

export const DIFFICULTY_TABLE: DifficultyEntry[] = buildDifficultyTable([

  // ── difficulty 0 — king only (tutorial / intro) ──────────────────────────
  {
    id: 'king_alone_easy',
    name: 'King Alone (Easy)',
    variants: [
      [{ name: 'king', ...pos('B3'), angle: -Math.PI / 2 }],
    ],
  },

  // ── difficulty 1 ─────────────────────────────────────────────────────────
  {
    id: 'king_pawn_easy_a',
    name: 'King + Pawn (Easy A)',
    variants: [
      [{ name: 'king', ...pos('D5'), angle: -Math.PI / 2 }, { name: 'pawn', ...pos('D4'), angle: -Math.PI }],
      [{ name: 'king', ...pos('F4'), angle: -Math.PI / 2 }, { name: 'pawn', ...pos('E4'), angle: -Math.PI / 4 }],
    ],
  },
  {
    id: 'king_pawn_easy_b',
    name: 'King + Pawn (Easy B)',
    variants: [
      [{ name: 'king', ...pos('D5') }, { name: 'pawn', ...pos('D3'), angle: -Math.PI }],
      [{ name: 'king', ...pos('F3') }, { name: 'pawn', ...pos('E3'), angle: Math.PI }],
    ],
  },

  // ── difficulty 2 ─────────────────────────────────────────────────────────
  {
    id: 'king_pawn_easy_c',
    name: 'King + Pawn (Easy C)',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('D4') }],
      [{ name: 'king', ...pos('E3') }, { name: 'pawn', ...pos('F4') }],
    ],
  },

  // ── difficulty 3 ─────────────────────────────────────────────────────────
  {
    id: 'king_two_pawns_a',
    name: 'King + Two Pawns A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'pawn', ...pos('E4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('D4') }, { name: 'pawn', ...pos('D2') }],
      [{ name: 'king', ...pos('F3') }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('E4') }],
    ],
  },

  // ── difficulty 4 ─────────────────────────────────────────────────────────
  {
    id: 'king_two_pawns_b',
    name: 'King + Two Pawns B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D2') }, { name: 'bishop', ...pos('F4'), level: 2 }],
    ],
  },

  // ── difficulty 5 ─────────────────────────────────────────────────────────
  {
    id: 'king_three_pawns_a',
    name: 'King + Three Pawns A',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('C4') }, { name: 'bishop', ...pos('E4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'pawn', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('C3') }, { name: 'pawn', ...pos('C4'), level: 2 }, { name: 'bishop', ...pos('D5') }],
    ],
  },

  // ── difficulty 6 ─────────────────────────────────────────────────────────
  {
    id: 'king_three_pawns_b',
    name: 'King + Three Pawns B',
    variants: [
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('C4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D3') }, { name: 'bishop', ...pos('B4') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('E3') }, { name: 'bishop', ...pos('C3') }, { name: 'bishop', ...pos('D4'), level: 2 }],
    ],
  },

  // ── difficulty 7 ─────────────────────────────────────────────────────────
  {
    id: 'king_three_pawns_c',
    name: 'King + Three Pawns C',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5') }],
      [{ name: 'king', ...pos('B4') }, { name: 'rook', ...pos('B5'), level: 2 }],
    ],
  },

  // ── difficulty 8 ─────────────────────────────────────────────────────────
  {
    id: 'king_rook_bishop_a',
    name: 'King + Rook + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('E3') }, { name: 'rook', ...pos('E5') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('B4') }, { name: 'rook', ...pos('B5'), level: 2 }, { name: 'bishop', ...pos('D5'), level: 2 }],
    ],
  },
  {
    id: 'king_four_pawns_a',
    name: 'King + Four Pawns A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'pawn', ...pos('B4') }, { name: 'pawn', ...pos('F4') }, { name: 'pawn', ...pos('D5') }, { name: 'pawn', ...pos('D2') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('D5'), level: 2 }],
    ],
  },

  // ── difficulty 9 ─────────────────────────────────────────────────────────
  {
    id: 'king_four_pawns_b',
    name: 'King + Four Pawns B',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('F4') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('D5'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }],
    ],
  },

  // ── difficulty 10 ────────────────────────────────────────────────────────
  {
    id: 'king_two_rooks_two_bishops_a',
    name: 'King + Two Rooks + Two Bishops A',
    variants: [
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3') }, { name: 'rook', ...pos('D5') }, { name: 'bishop', ...pos('C5') }, { name: 'bishop', ...pos('E5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('F4') }, { name: 'bishop', ...pos('B5') }, { name: 'bishop', ...pos('F5') }],
      [{ name: 'king', ...pos('D4') }, { name: 'rook', ...pos('D3'), level: 2 }, { name: 'rook', ...pos('D5'), level: 2 }, { name: 'bishop', ...pos('C5'), level: 2 }, { name: 'bishop', ...pos('E5'), level: 2 }],
    ],
  },

  // ── difficulty 11 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_a',
    name: 'King + Queen A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }],
    ],
  },

  // ── difficulty 12 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_pawn_a',
    name: 'King + Queen + Pawn A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'pawn', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'pawn', ...pos('E4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'pawn', ...pos('C4') }],
    ],
  },

  // ── difficulty 13 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_bishop_a',
    name: 'King + Queen + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'bishop', ...pos('E4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'bishop', ...pos('D4') }],
    ],
  },

  // ── difficulty 14 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_rook_a',
    name: 'King + Queen + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'rook', ...pos('G3') }],
    ],
  },

  // ── difficulty 15 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_two_rooks_a',
    name: 'King + Queen + Two Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D4') }, { name: 'rook', ...pos('B3') }, { name: 'rook', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('D4') }],
    ],
  },

  // ── difficulty 16 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_two_rooks_bishop_a',
    name: 'King + Queen + Two Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }, { name: 'bishop', ...pos('E4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('A3') }, { name: 'bishop', ...pos('B4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'rook', ...pos('G4') }, { name: 'rook', ...pos('E4') }, { name: 'bishop', ...pos('D4') }],
    ],
  },

  // ── difficulty 17 ────────────────────────────────────────────────────────
  {
    id: 'king_two_queens_a',
    name: 'King + Two Queens A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G3') }],
    ],
  },

  // ── difficulty 18 ────────────────────────────────────────────────────────
  {
    id: 'king_two_queens_rook_a',
    name: 'King + Two Queens + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('D3') }],
    ],
  },

  // ── difficulty 19 ────────────────────────────────────────────────────────
  {
    id: 'king_two_queens_two_rooks_a',
    name: 'King + Two Queens + Two Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('C3') }, { name: 'rook', ...pos('E3') }],
    ],
  },

  // ── difficulty 20 ────────────────────────────────────────────────────────
  {
    id: 'king_queen_two_rooks_two_bishops_a',
    name: 'King + Queen + Two Rooks + Two Bishops A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'rook', ...pos('B4') }, { name: 'rook', ...pos('F4') }, { name: 'bishop', ...pos('C2') }, { name: 'bishop', ...pos('E2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('A3') }, { name: 'bishop', ...pos('B4') }, { name: 'bishop', ...pos('E3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'rook', ...pos('G4') }, { name: 'rook', ...pos('E4') }, { name: 'bishop', ...pos('C4') }, { name: 'bishop', ...pos('F2') }],
    ],
  },

  // ── difficulty 21 ────────────────────────────────────────────────────────
  {
    id: 'king_two_queens_two_rooks_bishop_a',
    name: 'King + Two Queens + Two Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('D4') }, { name: 'rook', ...pos('D2') }, { name: 'bishop', ...pos('E5') }],
    ],
  },

  // ── difficulty 22 ────────────────────────────────────────────────────────
  {
    id: 'king_three_queens_rook_a',
    name: 'King + Three Queens + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('D2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('D3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E4') }, { name: 'queen', ...pos('B5') }, { name: 'rook', ...pos('F2') }],
    ],
  },

  // ── difficulty 23 ────────────────────────────────────────────────────────
  {
    id: 'king_three_queens_two_rooks_a',
    name: 'King + Three Queens + Two Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('E4') }, { name: 'rook', ...pos('B3') }, { name: 'rook', ...pos('F3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('C5') }, { name: 'rook', ...pos('E5') }],
    ],
  },

  // ── difficulty 24 ────────────────────────────────────────────────────────
  {
    id: 'king_three_queens_two_rooks_bishop_a',
    name: 'King + Three Queens + Two Rooks + Bishop A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('D5') }, { name: 'queen', ...pos('F4') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }, { name: 'bishop', ...pos('D3') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('C2') }, { name: 'rook', ...pos('E2') }, { name: 'bishop', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('E3') }, { name: 'queen', ...pos('F4') }, { name: 'queen', ...pos('G5') }, { name: 'rook', ...pos('B2') }, { name: 'rook', ...pos('A4') }, { name: 'bishop', ...pos('D3') }],
    ],
  },

  // ── difficulty 25 ────────────────────────────────────────────────────────
  {
    id: 'king_four_queens_rook_a',
    name: 'King + Four Queens + Rook A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('F3') }, { name: 'queen', ...pos('B5') }, { name: 'queen', ...pos('F5') }, { name: 'rook', ...pos('D4') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A3') }, { name: 'queen', ...pos('C4') }, { name: 'queen', ...pos('E4') }, { name: 'queen', ...pos('G3') }, { name: 'rook', ...pos('D5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D2') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('G3') }],
    ],
  },

  // ── difficulty 26 ────────────────────────────────────────────────────────
  {
    id: 'king_four_queens_two_rooks_a',
    name: 'King + Four Queens + Two Rooks A',
    variants: [
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('B3') }, { name: 'queen', ...pos('D4') }, { name: 'queen', ...pos('F3') }, { name: 'queen', ...pos('D2') }, { name: 'rook', ...pos('A2') }, { name: 'rook', ...pos('G2') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('A4') }, { name: 'queen', ...pos('C3') }, { name: 'queen', ...pos('E3') }, { name: 'queen', ...pos('G4') }, { name: 'rook', ...pos('B5') }, { name: 'rook', ...pos('F5') }],
      [{ name: 'king', ...pos('D1') }, { name: 'queen', ...pos('D3') }, { name: 'queen', ...pos('B4') }, { name: 'queen', ...pos('F4') }, { name: 'queen', ...pos('D5') }, { name: 'rook', ...pos('A3') }, { name: 'rook', ...pos('G3') }],
    ],
  },

]);

// ─── Fast lookup by id ────────────────────────────────────────────────────────

const formationById = new Map(DIFFICULTY_TABLE.map(e => [e.id, e]));

export const getFormationById = (id: string): DifficultyEntry | undefined =>
  formationById.get(id);

// ─── Chapter stage-to-difficulty mappings ─────────────────────────────────────

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