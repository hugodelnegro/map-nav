// =============================================================================
// GAME TYPES — shared across all game modes
// =============================================================================

export type Team = 'A' | 'B';

// ─── Piece Definition (data-driven, replaces hard-coded isKing) ───────────────

export interface PieceType {
  id:           string;           // e.g. 'pawn', 'king', 'queen'
  label:        string;           // human-readable
  radiusRatio:  number;           // multiplied by base unit to get px radius
  weight:       number;           // collision mass (only ratios matter; higher = harder to move)
  isRoyal:      boolean;          // losing this piece ends the round
  scoreValue:   number;           // points awarded if eliminated
  imageKeyA:    string;           // asset key for team A texture
  imageKeyB:    string;           // asset key for team B texture
}

// ─── Ball (physics body) ─────────────────────────────────────────────────────

export interface Ball {
  id:               number;
  team:             Team;
  pieceTypeId:      string;       // references PieceType.id
  radius:           number;
  originalRadius:   number;
  x:                number;
  y:                number;
  vx:               number;
  vy:               number;
  angle:            number;
  omega:            number;
  shrinking:        boolean;
  crossedBoundary:  boolean;
  shrinkVelocity:   number;
  mass:             number;
}

// ─── Game State ───────────────────────────────────────────────────────────────

export interface GameState {
  balls:                Ball[];
  nextBallId:           number;
  boardVersion:         number;
  score:                { teamA: number; teamB: number };
  currentTurn:          Team;
  waitingForSettle:     boolean;
  ballLaunchedThisTurn: boolean;
  roundOver:            boolean;
  roundOverMessage:     string;
  canvasWidth:          number;
  canvasHeight:         number;
}

// ─── Game Mode Config (replaces engine-level hardcoding) ─────────────────────

export interface GameModeConfig {
  /** Unique id, e.g. 'chess-brawl', 'billiards' */
  id:          string;
  label:       string;
  /** All piece types used by this mode */
  pieceTypes:  Record<string, PieceType>;
  /**
   * Pure factory: given canvas dimensions, return the starting ball layout.
   * Lets each game mode own its formation.
   */
  makeBalls:   (width: number, height: number, pieceTypes: Record<string, PieceType>) => Ball[];
  /**
   * Given the current ball list, decide if the round is over and who won.
   * Return null to continue playing.
   */
  checkRoundOver: (
    balls: Ball[],
    pieceTypes: Record<string, PieceType>,
    state: GameState,
  ) => { message: string; scoreA: number; scoreB: number } | null;
  /** Which team takes the first turn. Defaults to 'A' (player) if omitted. */
  firstTurn?: Team;
}

// ─── Visual / UI types (canvas-side only) ────────────────────────────────────

export interface ImpactFlash {
  id:        number;
  x:         number;
  y:         number;
  radius:    number;
  spawnedAt: number;
}

export interface DyingBall {
  ball:    Ball;
  abyssAt: number;
  x:       number;
  y:       number;
}

export interface UIOverlay {
  scoreA:           number;
  scoreB:           number;
  currentTurn:      Team;
  roundOver:        boolean;
  roundOverMessage: string;
}

export interface TrailEntry {
  id:    number;
  team:  Team;
  baseX: number;
  baseY: number;
  tipX:  number;
  tipY:  number;
  halfW: number;
}
