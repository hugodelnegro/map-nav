import { GridConfig, CellCoord } from '../app/MapMarker';

export const MAP_IMAGE_WIDTH = 1254;
export const MAP_IMAGE_HEIGHT = 1254;

export const GRID_CONFIG: GridConfig = {
  gridSize: 60,
  mapWidth: MAP_IMAGE_WIDTH,
  mapHeight: MAP_IMAGE_HEIGHT,
};

/** Convert a column label (A, B, … Z, AA, AB…) to a 0-based index */
const colLabelToIndex = (col: string): number => {
  const upper = col.toUpperCase();
  let index = 0;
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
};

/** Returns the full pixel rect for a grid cell */
export const cellToPixelRect = (
  cell: CellCoord,
  config: GridConfig = GRID_CONFIG,
) => {
  const cellWidth  = config.mapWidth  / config.gridSize;
  const cellHeight = config.mapHeight / config.gridSize;
  const colIdx     = colLabelToIndex(cell.col);
  const rowIdx     = config.gridSize - cell.row;
  const x          = colIdx * cellWidth;
  const y          = rowIdx * cellHeight;
  return {
    x,
    y,
    width:   cellWidth,
    height:  cellHeight,
    centerX: x + cellWidth  / 2,
    centerY: y + cellHeight / 2,
  };
};

/** Returns the pixel center of a grid cell */
export const cellCenter = (
  cell: CellCoord,
  config: GridConfig = GRID_CONFIG,
): { x: number; y: number } => {
  const { centerX, centerY } = cellToPixelRect(cell, config);
  return { x: centerX, y: centerY };
};