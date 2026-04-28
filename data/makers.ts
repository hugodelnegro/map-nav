import { ImageSourcePropType } from 'react-native';
import { CellCoord } from '../app/MapMarker';
import { DIFFICULTY_TABLE, DifficultyEntry } from './formations';

export interface MarkerData {
  id: string;
  cell: CellCoord;
  source: ImageSourcePropType;
  scale?: number;

  /** Difficulty index used to load the matching opponent formation. */
  difficulty: DifficultyEntry['difficulty'];

  /** Parent marker in the campaign tree. Undefined means this is a root node. */
  parentId?: string;

  /** Child markers unlocked after this marker is completed. */
  childIds: string[];
}

const castle = require('../assets/images/castle1.png');

const markers: MarkerData[] = [
  {
    id: '1',
    cell: { col: 'C', row: 4 },
    source: castle,
    difficulty: 0,
    childIds: ['2', '3'],
  },
  {
    id: '2',
    cell: { col: 'M', row: 12 },
    source: castle,
    difficulty: 1,
    parentId: '1',
    childIds: [],
  },
  {
    id: '3',
    cell: { col: 'R', row: 8 },
    source: castle,
    difficulty: 2,
    parentId: '1',
    childIds: [],
  },
  {
    id: '4',
    cell: { col: 'L', row: 16 },
    source: castle,
    difficulty: 3,
    parentId: '2',
    childIds: [],
  },
];

const markerById = new Map(markers.map(marker => [marker.id, marker]));

export const getMarkerById = (markerId: string): MarkerData | undefined =>
  markerById.get(markerId);

export const getMarkerDifficultyEntry = (markerId: string): DifficultyEntry | undefined => {
  const marker = getMarkerById(markerId);
  if (!marker) return undefined;

  return DIFFICULTY_TABLE.find(entry => entry.difficulty === marker.difficulty);
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
  const difficultyValues = new Set(DIFFICULTY_TABLE.map(entry => entry.difficulty));

  for (const marker of markers) {
    if (!difficultyValues.has(marker.difficulty)) {
      errors.push(`Marker ${marker.id} uses missing difficulty ${marker.difficulty}.`);
    }

    if (marker.parentId && !markerById.has(marker.parentId)) {
      errors.push(`Marker ${marker.id} has missing parent ${marker.parentId}.`);
    }

    for (const childId of marker.childIds) {
      const child = markerById.get(childId);

      if (!child) {
        errors.push(`Marker ${marker.id} has missing child ${childId}.`);
        continue;
      }

      if (child.parentId !== marker.id) {
        errors.push(
          `Marker ${marker.id} lists ${childId} as child, but ${childId}.parentId is ${child.parentId ?? 'undefined'}.`,
        );
      }
    }
  }

  return errors;
};

export default markers;
