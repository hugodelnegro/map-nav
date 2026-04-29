// =============================================================================
// PIECE CATALOGUE — single source of truth for all piece definitions
// =============================================================================

import { PieceType } from './gameTypes';
import { PIECE_COINS } from './pricing';

export type PieceMeta = PieceType & { symbol: string; desc: string; face: any };

export const PIECE_CATALOGUE: Record<string, PieceMeta> = {
  // ── Level 1 ──────────────────────────────────────────────────────────────
  king: {
    id: 'king', label: 'King', symbol: '♚', desc: 'Royal piece. Must survive.',
    isRoyal: true, scoreValue: PIECE_COINS.king, radiusRatio: 0.065, weight: 1,
    imageKeyA: 'kingRed', imageKeyB: 'kingBlue',
    face: require('../assets/images/heads/headsking_face.png'),
  },
  queen: {
    id: 'queen', label: 'Queen', symbol: '♛', desc: 'Powerful high-value piece.',
    isRoyal: false, scoreValue: PIECE_COINS.queen, radiusRatio: 0.065, weight: 20,
    imageKeyA: 'queenRed', imageKeyB: 'queenBlue',
    face: require('../assets/images/heads/headsqueen_face.png'),
  },
  rook: {
    id: 'rook', label: 'Rook', symbol: '♜', desc: 'Heavy hitter.',
    isRoyal: false, scoreValue: PIECE_COINS.rook, radiusRatio: 0.065, weight: 10,
    imageKeyA: 'rookRed', imageKeyB: 'rookBlue',
    face: require('../assets/images/heads/headsrook_face.png'),
  },
  bishop: {
    id: 'bishop', label: 'Bishop', symbol: '♝', desc: 'Diagonal force.',
    isRoyal: false, scoreValue: PIECE_COINS.bishop, radiusRatio: 0.065, weight: 5,
    imageKeyA: 'bishopRed', imageKeyB: 'bishopBlue',
    face: require('../assets/images/heads/headsbishop_face.png'),
  },
  pawn: {
    id: 'pawn', label: 'Pawn', symbol: '♟', desc: 'Small but many.',
    isRoyal: false, scoreValue: PIECE_COINS.pawn, radiusRatio: 0.065, weight: 2,
    imageKeyA: 'pawnRed', imageKeyB: 'pawnBlue',
    face: require('../assets/images/heads/headspawn_face.png'),
  },

  // ── Level 2 (upgraded — larger radius, higher score value) ───────────────
  queen_2: {
    id: 'queen_2', label: 'Queen II', symbol: '♛', desc: 'Upgraded queen.',
    isRoyal: false, scoreValue: PIECE_COINS.queen_2, radiusRatio: 0.065, weight: 28,
    imageKeyA: 'queenRed', imageKeyB: 'queenBlue',
    face: require('../assets/images/heads/headsqueen_face.png'),
  },
  rook_2: {
    id: 'rook_2', label: 'Rook II', symbol: '♜', desc: 'Upgraded rook.',
    isRoyal: false, scoreValue: PIECE_COINS.rook_2, radiusRatio: 0.065, weight: 14,
    imageKeyA: 'rookRed', imageKeyB: 'rookBlue',
    face: require('../assets/images/heads/headsrook_face.png'),
  },
  bishop_2: {
    id: 'bishop_2', label: 'Bishop II', symbol: '♝', desc: 'Upgraded bishop.',
    isRoyal: false, scoreValue: PIECE_COINS.bishop_2, radiusRatio: 0.065, weight: 7,
    imageKeyA: 'bishopRed', imageKeyB: 'bishopBlue',
    face: require('../assets/images/heads/headsbishop_face.png'),
  },
  pawn_2: {
    id: 'pawn_2', label: 'Pawn II', symbol: '♟', desc: 'Upgraded pawn.',
    isRoyal: false, scoreValue: PIECE_COINS.pawn_2, radiusRatio: 0.065, weight: 3,
    imageKeyA: 'pawnRed', imageKeyB: 'pawnBlue',
    face: require('../assets/images/heads/headspawn_face.png'),
  },
};

/** Returns the catalogue key for a piece at the given level. */
export function getPieceKey(name: string, level: number): string {
  return level > 1 ? `${name}_${level}` : name;
}

// ─── Piece gem reward (scoring) ───────────────────────────────────────────────
export { PIECE_COINS };

// ─── Piece strategic importance (AI evaluation) ───────────────────────────────
// How much the AI values each piece. King is the supreme objective.

export const PIECE_IMPORTANCE: Record<string, number> = {
  pawn: 2, bishop: 5, rook: 9, queen: 18, king: 99999999999999999999,
  pawn_2: 3, bishop_2: 7, rook_2: 13, queen_2: 26,
};
