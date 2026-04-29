import { ImageSourcePropType } from 'react-native';
import { CellCoord } from '../app/MapMarker';
import { DIFFICULTY_TABLE, DifficultyEntry, getFormationById } from './formations';
import { TeamId } from './teams';

export type Stage = 'green' | 'ice' | 'lava';

export interface MarkerData {
  id: string;
  cell: CellCoord;
  source: ImageSourcePropType;
  scale?: number;
  formationId: DifficultyEntry['id'];
  teamId: TeamId;
  /** Terrain zone this marker sits on. */
  stage: Stage;
  parentId?: string;
  childIds: string[];
}

const castle = require('../assets/images/castle1.png');

// =============================================================================
// CAMPAIGN TREE — 30 markers, teams B / C / D only
//
// Formation index = BFS depth from root → every parent→child jump is exactly 1.
// Sibling branches share the same depth and therefore the same formation tier,
// giving the player equivalent difficulty regardless of which path they choose.
//
// Depth tiers:
//   0        C4         (tutorial root)
//   1        M12
//   2        R8
//   3        L16
//   4        AA7        (open world begins — first fork)
//   5        AP8, Y15
//   6        AK12, BC11, AE18, O23
//   7        AT18, AL26, BA21, AF24, Q23, V26
//   8        BD31, AN37, AU41, AE36, T27, Z40
//   9        BD41, AL41, AM55, AE58, L44, O55
//   10       AO47
// =============================================================================

const markers: MarkerData[] = [

  // ── d0 ─────────────────────────────────────────────────────────────────────
  {
    id: 'C4',  cell: { col: 'C',  row: 4  }, source: castle,
    formationId: 'king_alone_easy', teamId: 'C', stage: 'green',
    childIds: ['M12'],
  },

  // ── d1 ─────────────────────────────────────────────────────────────────────
  {
    id: 'M12', cell: { col: 'M',  row: 12 }, source: castle,
    formationId: 'king_pawn_easy_a', teamId: 'D', stage: 'green',
    parentId: 'C4', childIds: ['R8'],
  },

  // ── d2 ─────────────────────────────────────────────────────────────────────
  {
    id: 'R8',  cell: { col: 'R',  row: 8  }, source: castle,
    formationId: 'king_pawn_easy_b', teamId: 'C', stage: 'green',
    parentId: 'M12', childIds: ['L16'],
  },

  // ── d3 ─────────────────────────────────────────────────────────────────────
  {
    id: 'L16', cell: { col: 'L',  row: 16 }, source: castle,
    formationId: 'king_pawn_easy_c', teamId: 'C', stage: 'green',
    parentId: 'R8', childIds: ['AA7'],
  },

  // ── d4: first fork — east(D) or centre(C) ──────────────────────────────────
  {
    id: 'AA7',  cell: { col: 'AA', row: 7  }, source: castle,
    formationId: 'king_two_pawns_a', teamId: 'C', stage: 'green',
    parentId: 'L16', childIds: ['AP8', 'Y15'],
  },

  // ── d5 ─────────────────────────────────────────────────────────────────────
  {
    id: 'AP8',  cell: { col: 'AP', row: 8  }, source: castle,
    formationId: 'king_two_pawns_b', teamId: 'D', stage: 'green',
    parentId: 'AA7', childIds: ['AK12', 'BC11'],
  },
  {
    id: 'Y15',  cell: { col: 'Y',  row: 15 }, source: castle,
    formationId: 'king_two_pawns_b', teamId: 'C', stage: 'ice',
    parentId: 'AA7', childIds: ['AE18', 'O23'],
  },

  // ── d6 ─────────────────────────────────────────────────────────────────────
  {
    id: 'AK12', cell: { col: 'AK', row: 12 }, source: castle,
    formationId: 'king_bishop_a', teamId: 'D', stage: 'green',
    parentId: 'AP8', childIds: ['AT18', 'AL26'],
  },
  {
    id: 'BC11', cell: { col: 'BC', row: 11 }, source: castle,
    formationId: 'king_bishop_a', teamId: 'B', stage: 'lava',
    parentId: 'AP8', childIds: ['BA21'],
  },
  {
    id: 'AE18', cell: { col: 'AE', row: 18 }, source: castle,
    formationId: 'king_bishop_a', teamId: 'C', stage: 'ice',
    parentId: 'Y15', childIds: ['AF24'],
  },
  {
    id: 'O23',  cell: { col: 'O',  row: 23 }, source: castle,
    formationId: 'king_bishop_a', teamId: 'C', stage: 'green',
    parentId: 'Y15', childIds: ['Q23', 'V26'],
  },

  // ── d7 ─────────────────────────────────────────────────────────────────────
  {
    id: 'AT18', cell: { col: 'AT', row: 18 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'B', stage: 'lava',
    parentId: 'AK12', childIds: ['BD31'],
  },
  {
    id: 'AL26', cell: { col: 'AL', row: 26 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'D', stage: 'ice',
    parentId: 'AK12', childIds: ['AN37'],
  },
  {
    id: 'BA21', cell: { col: 'BA', row: 21 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'B', stage: 'lava',
    parentId: 'BC11', childIds: ['AU41'],
  },
  {
    id: 'AF24', cell: { col: 'AF', row: 24 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'C', stage: 'ice',
    parentId: 'AE18', childIds: ['AE36'],
  },
  {
    id: 'Q23',  cell: { col: 'Q',  row: 23 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'C', stage: 'ice',
    parentId: 'O23', childIds: ['T27'],
  },
  {
    id: 'V26',  cell: { col: 'V',  row: 26 }, source: castle,
    formationId: 'king_bishop_b', teamId: 'C', stage: 'ice',
    parentId: 'O23', childIds: ['Z40'],
  },

  // ── d8 ─────────────────────────────────────────────────────────────────────
  {
    id: 'BD31', cell: { col: 'BD', row: 31 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'B', stage: 'lava',
    parentId: 'AT18', childIds: ['BD41'],
  },
  {
    id: 'AN37', cell: { col: 'AN', row: 37 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'D', stage: 'lava',
    parentId: 'AL26', childIds: ['AL41'],
  },
  {
    id: 'AU41', cell: { col: 'AU', row: 41 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'B', stage: 'lava',
    parentId: 'BA21', childIds: ['AM55'],
  },
  {
    id: 'AE36', cell: { col: 'AE', row: 36 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'C', stage: 'ice',
    parentId: 'AF24', childIds: ['AE58'],
  },
  {
    id: 'T27',  cell: { col: 'T',  row: 27 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'C', stage: 'ice',
    parentId: 'Q23', childIds: ['L44'],
  },
  {
    id: 'Z40',  cell: { col: 'Z',  row: 40 }, source: castle,
    formationId: 'king_pawn_bishop_a', teamId: 'C', stage: 'ice',
    parentId: 'V26', childIds: ['O55'],
  },

  // ── d9 ─────────────────────────────────────────────────────────────────────
  {
    id: 'BD41', cell: { col: 'BD', row: 41 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'B', stage: 'lava',
    parentId: 'BD31', childIds: [],
  },
  {
    id: 'AL41', cell: { col: 'AL', row: 41 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'D', stage: 'lava',
    parentId: 'AN37', childIds: ['AO47'],
  },
  {
    id: 'AM55', cell: { col: 'AM', row: 55 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'B', stage: 'green',
    parentId: 'AU41', childIds: [],
  },
  {
    id: 'AE58', cell: { col: 'AE', row: 58 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'C', stage: 'green',
    parentId: 'AE36', childIds: [],
  },
  {
    id: 'L44',  cell: { col: 'L',  row: 44 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'C', stage: 'green',
    parentId: 'T27', childIds: [],
  },
  {
    id: 'O55',  cell: { col: 'O',  row: 55 }, source: castle,
    formationId: 'king_pawn_bishop_b', teamId: 'C', stage: 'green',
    parentId: 'Z40', childIds: [],
  },

  // ── d10 ────────────────────────────────────────────────────────────────────
  {
    id: 'AO47', cell: { col: 'AO', row: 47 }, source: castle,
    formationId: 'king_two_bishops_a', teamId: 'D', stage: 'lava',
    parentId: 'AL41', childIds: [],
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