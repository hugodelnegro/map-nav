// =============================================================================
// PRICING
//
//  Single source of truth for all gem costs in the campaign.
// =============================================================================

// ── Inventory ─────────────────────────────────────────────────────────────────

export const LOT_COST = 6;

// ── Shop (pawn purchases) ─────────────────────────────────────────────────────

export const PAWN_BASE_COST = 10;
export const PAWN_COST_STEP = 2;

export function pawnCost(playerLevel: number): number {
  return PAWN_BASE_COST + playerLevel * PAWN_COST_STEP;
}

// ── Piece kill rewards ────────────────────────────────────────────────────────
// Gems earned for killing a piece. PIECE_COINS is the source of truth for scoring.

export const PIECE_COINS: Record<string, number> = {
  pawn: 1, bishop: 2, rook: 3, queen: 4, king: 5,
  pawn_2: 1, bishop_2: 2, rook_2: 3, queen_2: 4,
};

// Flat gem bonus earned for participating in any game (win, lose, or draw).
export const PARTICIPATION_GEM = 1;

// ── Store (power-ups) ─────────────────────────────────────────────────────────

export const STORE_COSTS: Record<string, number> = {
  shield:    15,
  magnet:    20,
  bomb:      25,
  hourglass: 10,
};
