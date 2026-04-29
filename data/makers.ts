import { ImageSourcePropType } from 'react-native';
import { CellCoord } from '../app/MapMarker';
import { DIFFICULTY_TABLE, DifficultyEntry, getFormationById } from './formations';
import { TeamId } from './teams';

export interface MarkerData {
  id: string;
  cell: CellCoord;
  source: ImageSourcePropType;
  scale?: number;
  formationId: DifficultyEntry['id'];
  teamId: TeamId;
  parentId?: string;
  childIds: string[];
}

const castle = require('../assets/images/castle1.png');

// =============================================================================
// CAMPAIGN TREE — 30 markers, teams B / C / D only
//
// Team B is the hardest faction — their markers have a LOWER difficulty index
// than the C/D sibling offered at the same fork. This means the player can
// unlock B territory earlier/easier, but B itself is the tough enemy.
//
// At every fork with a B option:
//   B child diff = C/D sibling diff − 2  (two formations easier = unlocked sooner)
//
// Opening: C4 → M12 → R8 → L16 → AA7 (linear tutorial d0–d4)
// Then open world branches across C, D, and B territories.
// =============================================================================

const markers: MarkerData[] = [

  // ── Tutorial d0–d3 ─────────────────────────────────────────────────────────
  {
    id: 'C4',  cell: { col: 'C',  row: 4  }, source: castle,
    formationId: 'king_alone_easy', teamId: 'C',
    childIds: ['M12'],
  },
  {
    id: 'M12', cell: { col: 'M',  row: 12 }, source: castle,
    formationId: 'king_pawn_easy_a', teamId: 'D',
    parentId: 'C4', childIds: ['R8'],
  },
  {
    id: 'R8',  cell: { col: 'R',  row: 8  }, source: castle,
    formationId: 'king_pawn_easy_b', teamId: 'C',
    parentId: 'M12', childIds: ['L16'],
  },
  {
    id: 'L16', cell: { col: 'L',  row: 16 }, source: castle,
    formationId: 'king_pawn_easy_c', teamId: 'C',
    parentId: 'R8', childIds: ['AA7'],
  },

  // ── d4: first open-world fork — east(D) or south(C) ───────────────────────
  {
    id: 'AA7',  cell: { col: 'AA', row: 7  }, source: castle,
    formationId: 'king_two_pawns_a', teamId: 'C',
    parentId: 'L16', childIds: ['AP8', 'Y15'],
  },

  // ── East branch — D then B ─────────────────────────────────────────────────
  // AP8(D,d5) forks: AK12(D,d7) normal path, BC11(B,d5) B path (d7-2=5)
  {
    id: 'AP8',  cell: { col: 'AP', row: 8  }, source: castle,
    formationId: 'king_two_pawns_b', teamId: 'D',
    parentId: 'AA7', childIds: ['AK12', 'BC11'],
  },
  {
    id: 'AK12', cell: { col: 'AK', row: 12 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'D',
    parentId: 'AP8', childIds: ['AT18', 'AL26'],
  },
  // BC11(B,d5) — 2 below AK12(d7)
  {
    id: 'BC11', cell: { col: 'BC', row: 11 }, source: castle,
    formationId: 'king_two_pawns_b', teamId: 'B',
    parentId: 'AP8', childIds: ['BA21'],
  },
  // AK12 forks: AL26(D,d9) normal, AT18(B,d7) = d9-2
  {
    id: 'AT18', cell: { col: 'AT', row: 18 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'B',
    parentId: 'AK12', childIds: ['BD31'],
  },
  {
    id: 'BA21', cell: { col: 'BA', row: 21 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'B',
    parentId: 'BC11', childIds: ['AU41'],
  },
  {
    id: 'AL26', cell: { col: 'AL', row: 26 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'D',
    parentId: 'AK12', childIds: ['AN37'],
  },

  // ── Centre-south branch — C then D ────────────────────────────────────────
  // Y15(C,d6) forks: AE18(C,d8), O23(C,d10)
  {
    id: 'Y15',  cell: { col: 'Y',  row: 15 }, source: castle,
    formationId: 'king_bishop_a', teamId: 'C',
    parentId: 'AA7', childIds: ['AE18', 'O23'],
  },
  {
    id: 'AE18', cell: { col: 'AE', row: 18 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'C',
    parentId: 'Y15', childIds: ['AF24'],
  },
  {
    id: 'O23',  cell: { col: 'O',  row: 23 }, source: castle,
    formationId: 'king_two_bishops_a', teamId: 'C',
    parentId: 'Y15', childIds: ['Q23', 'V26'],
  },
  // AF24(C,d11) forks: AE36(C,d13), AL26 already placed — just AE36
  {
    id: 'AF24', cell: { col: 'AF', row: 24 }, source: castle,
    formationId: 'king_two_bishops_b', teamId: 'C',
    parentId: 'AE18', childIds: ['AE36'],
  },
  {
    id: 'AN37', cell: { col: 'AN', row: 37 }, source: castle,
    formationId: 'king_three_pawns_a', teamId: 'D',
    parentId: 'AL26', childIds: ['AL41'],
  },
  {
    id: 'Q23',  cell: { col: 'Q',  row: 23 }, source: castle,
    formationId: 'king_two_bishops_b', teamId: 'C',
    parentId: 'O23', childIds: ['T27'],
  },
  {
    id: 'V26',  cell: { col: 'V',  row: 26 }, source: castle,
    formationId: 'king_three_pawns_a', teamId: 'C',
    parentId: 'O23', childIds: ['Z40'],
  },
  {
    id: 'T27',  cell: { col: 'T',  row: 27 }, source: castle,
    formationId: 'king_three_pawns_b', teamId: 'C',
    parentId: 'Q23', childIds: ['L44'],
  },

  // ── B deep chain — always 2 below D peers ──────────────────────────────────
  // BD31(B,d8) — 2 below AL26(d9)+AT18 chain
  {
    id: 'BD31', cell: { col: 'BD', row: 31 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'B',
    parentId: 'AT18', childIds: ['BD41'],
  },
  {
    id: 'AU41', cell: { col: 'AU', row: 41 }, source: castle,
    formationId: 'king_rook_a', teamId: 'B',
    parentId: 'BA21', childIds: ['AM55'],
  },
  {
    id: 'BD41', cell: { col: 'BD', row: 41 }, source: castle,
    formationId: 'king_rook_b', teamId: 'B',
    parentId: 'BD31', childIds: [],
  },

  // ── Centre-east deep ───────────────────────────────────────────────────────
  {
    id: 'AE36', cell: { col: 'AE', row: 36 }, source: castle,
    formationId: 'king_rook_a', teamId: 'C',
    parentId: 'AF24', childIds: ['AE58'],
  },
  {
    id: 'AL41', cell: { col: 'AL', row: 41 }, source: castle,
    formationId: 'king_rook_bishop_a', teamId: 'D',
    parentId: 'AN37', childIds: ['AO47'],
  },
  {
    id: 'Z40',  cell: { col: 'Z',  row: 40 }, source: castle,
    formationId: 'king_rook_pawn_a', teamId: 'C',
    parentId: 'V26', childIds: ['O55'],
  },
  {
    id: 'L44',  cell: { col: 'L',  row: 44 }, source: castle,
    formationId: 'king_rook_pawn_b', teamId: 'C',
    parentId: 'T27', childIds: [],
  },

  // ── Endgame ────────────────────────────────────────────────────────────────
  {
    id: 'AO47', cell: { col: 'AO', row: 47 }, source: castle,
    formationId: 'king_rook_bishop_b', teamId: 'D',
    parentId: 'AL41', childIds: [],
  },
  {
    id: 'O55',  cell: { col: 'O',  row: 55 }, source: castle,
    formationId: 'king_two_rooks_a', teamId: 'C',
    parentId: 'Z40', childIds: [],
  },
  {
    id: 'AE58', cell: { col: 'AE', row: 58 }, source: castle,
    formationId: 'king_two_rooks_b', teamId: 'C',
    parentId: 'AE36', childIds: [],
  },
  // AM55(B) — 2 below O55(king_two_rooks_a=20), so king_two_rooks_pawn_b... 
  // Actually B endgame: AU41(king_rook_a=14) → AM55(king_rook_pawn_a=16) +2 steps in B chain
  {
    id: 'AM55', cell: { col: 'AM', row: 55 }, source: castle,
    formationId: 'king_two_rooks_a', teamId: 'B',
    parentId: 'AU41', childIds: [],
  },
];

const markerById = new Map(markers.map(marker => [marker.id, marker]));

export const getMarkerById = (markerId: string): MarkerData | undefined =>
  markerById.get(markerId);

export const getMarkerFormationEntry = (markerId: string): DifficultyEntry | undefined => {
  const marker = getMarkerById(markerId);
  if (!marker) return undefined;
  return getFormationById(marker.formationId);
};

export const getMarkerChildren = (markerId: string): MarkerData[] => {
  const marker = getMarkerById(markerId);
  if (!marker) return [];
  return marker.childIds
    .map(childId => markerById.get(childId))
    .filter((child): child is MarkerData => Boolean(child));
};

export const getRootMarkers = (): MarkerData[] =>
  markers.filter(marker => !marker.parentId);

export const isMarkerUnlocked = (
  markerId: string,
  completedMarkerIds: ReadonlySet<string>,
): boolean => {
  const marker = getMarkerById(markerId);
  if (!marker) return false;
  return !marker.parentId || completedMarkerIds.has(marker.parentId);
};

export const validateMarkerTree = (): string[] => {
  const errors: string[] = [];
  const formationIds = new Set(DIFFICULTY_TABLE.map(entry => entry.id));
  for (const marker of markers) {
    if (!formationIds.has(marker.formationId))
      errors.push(`Marker ${marker.id} references missing formationId '${marker.formationId}'.`);
    if (marker.parentId && !markerById.has(marker.parentId))
      errors.push(`Marker ${marker.id} has missing parent ${marker.parentId}.`);
    for (const childId of marker.childIds) {
      const child = markerById.get(childId);
      if (!child) { errors.push(`Marker ${marker.id} has missing child ${childId}.`); continue; }
      if (child.parentId !== marker.id)
        errors.push(`Marker ${marker.id} lists ${childId} as child, but ${childId}.parentId is ${child.parentId ?? 'undefined'}.`);
    }
  }
  return errors;
};

export default markers;