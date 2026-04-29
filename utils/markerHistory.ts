// =============================================================================
// MARKER HISTORY
//
// Per marker, stores:
//   - roundsPlayed   — total number of full games completed
//   - bestPerRound   — best result for each round index (fewest pieces lost)
//
// A "game" = winning all variants of the formation in order.
// Each round result carries only the pieces lost and killed counts.
// Persisted to AsyncStorage. Call loadMarkerHistory() once at app startup.
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoundRecord {
  piecesLost: string[];
  piecesKilled: string[];
}

export interface RoundBest {
  /** Player pieces lost in the best run of this round. */
  piecesLost: string[];
  /** Opponent pieces killed in the best run of this round. */
  piecesKilled: string[];
}

export interface MarkerHistory {
  /** Total complete games (all rounds won) recorded for this marker. */
  gamesPlayed: number;
  /** Best result per round index. Index matches entry.variants index. */
  bestPerRound: Record<number, RoundBest>;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createRoundBest(round: RoundRecord): RoundBest {
  return {
    piecesLost:   round.piecesLost,
    piecesKilled: round.piecesKilled,
  };
}

// ─── In-memory store ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'marker_history_v3';

const store = new Map<string, MarkerHistory>();

function emptyHistory(): MarkerHistory {
  return { gamesPlayed: 0, bestPerRound: {} };
}

export function getMarkerHistory(markerId: string): MarkerHistory {
  return store.get(markerId) ?? emptyHistory();
}

export function hasBeenPlayed(markerId: string): boolean {
  return (store.get(markerId)?.gamesPlayed ?? 0) > 0;
}

export function getBestForRound(markerId: string, roundIndex: number): RoundBest | undefined {
  return store.get(markerId)?.bestPerRound[roundIndex];
}

/**
 * Returns a star rating (0–3) for a marker based on the best recorded game.
 *
 * Rating is derived from total pieces lost across all rounds in bestPerRound:
 *   0 played  → 0 stars
 *   0 lost    → 3 stars (exceptional — flawless)
 *   1–2 lost  → 2 stars (good)
 *   3+ lost   → 1 star  (barely won)
 */
export function getMarkerStars(markerId: string): 0 | 1 | 2 | 3 {
  const h = store.get(markerId);
  if (!h || h.gamesPlayed === 0) return 0;

  const totalLost = Object.values(h.bestPerRound)
    .reduce((sum, round) => sum + round.piecesLost.length, 0);

  if (totalLost === 0) return 3;
  if (totalLost <= 2)  return 2;
  return 1;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

async function persist(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(store)));
}

export async function loadMarkerHistory(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as Record<string, MarkerHistory>;
    for (const [id, h] of Object.entries(data)) store.set(id, h);
  } catch (e) {
    console.warn('markerHistory: failed to load', e);
  }
}

/**
 * Records a completed game (all rounds won).
 * Increments gamesPlayed and updates bestPerRound for each round
 * if the new result has fewer pieces lost.
 */
export async function recordVictory(
  markerId: string,
  rounds: RoundRecord[],
): Promise<void> {
  const h = store.get(markerId) ?? emptyHistory();

  h.gamesPlayed += 1;

  rounds.forEach((round, i) => {
    const current = h.bestPerRound[i];
    const candidate = createRoundBest(round);
    if (!current || candidate.piecesLost.length < current.piecesLost.length) {
      h.bestPerRound[i] = candidate;
    }
  });

  store.set(markerId, h);
  await persist();
}

/** Wipes all records. Dev only. */
export async function clearMarkerHistory(): Promise<void> {
  store.clear();
  await AsyncStorage.removeItem(STORAGE_KEY);
}