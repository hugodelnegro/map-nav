/**
 * gridUtils.ts
 *
 * All grid math lives here. Components and image-placement logic
 * import from this file so the coordinate system is defined once.
 *
 * Grid convention:
 *   - Columns: A … (A + gridSize - 1)  — left → right
 *   - Rows:    gridSize … 1             — top  → bottom
 *     (row 1 is the bottom row, matching map/tactical conventions)
 */

export interface GridConfig {
  gridSize: number;   // number of cells per side (e.g. 12)
  mapWidth: number;   // full map width  in pixels
  mapHeight: number;  // full map height in pixels
}

export interface CellCoord {
  col: string;  // "A" … "L"
  row: number;  // 1 … gridSize  (1 = bottom row)
}

export interface PixelRect {
  x: number;      // left edge of cell in map pixels
  y: number;      // top  edge of cell in map pixels
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/** Width of a single cell in map pixels. */
export const getCellWidth = ({ mapWidth, gridSize }: GridConfig): number =>
  mapWidth / gridSize;

/** Height of a single cell in map pixels. */
export const getCellHeight = ({ mapHeight, gridSize }: GridConfig): number =>
  mapHeight / gridSize;

/**
 * Convert a column letter to a 0-based column index.
 * "A" → 0, "B" → 1, …
 */
export const colLetterToIndex = (col: string): number =>
  col.toUpperCase().charCodeAt(0) - 65;

/**
 * Convert a 0-based column index to a column letter.
 * 0 → "A", 1 → "B", …
 */
export const colIndexToLetter = (index: number): string =>
  String.fromCharCode(65 + index);

/**
 * Convert a tap/pixel position on the map to a grid CellCoord.
 * Returns null if the position is outside the grid.
 */
export const pixelToCell = (
  x: number,
  y: number,
  config: GridConfig,
): CellCoord | null => {
  const cellWidth = getCellWidth(config);
  const cellHeight = getCellHeight(config);

  const colIdx = Math.floor(x / cellWidth);
  const rowIdx = Math.floor(y / cellHeight);

  if (
    colIdx < 0 || colIdx >= config.gridSize ||
    rowIdx < 0 || rowIdx >= config.gridSize
  ) {
    return null;
  }

  return {
    col: colIndexToLetter(colIdx),
    row: config.gridSize - rowIdx, // invert so row 1 = bottom
  };
};

/**
 * Convert a CellCoord to the pixel rectangle it occupies on the map.
 * Use this to position images, markers, or overlays on the map.
 *
 * Example:
 *   const rect = cellToPixelRect({ col: 'C', row: 3 }, config);
 *   // place your image at (rect.x, rect.y) with rect.width × rect.height
 *   // or use rect.centerX / rect.centerY to pin to the middle of the cell
 */
export const cellToPixelRect = (
  cell: CellCoord,
  config: GridConfig,
): PixelRect => {
  const cellWidth = getCellWidth(config);
  const cellHeight = getCellHeight(config);

  const colIdx = colLetterToIndex(cell.col);
  // invert row back to a top-based row index
  const rowIdx = config.gridSize - cell.row;

  const x = colIdx * cellWidth;
  const y = rowIdx * cellHeight;

  return {
    x,
    y,
    width: cellWidth,
    height: cellHeight,
    centerX: x + cellWidth / 2,
    centerY: y + cellHeight / 2,
  };
};

/**
 * Returns true if a CellCoord is within the grid bounds.
 */
export const isValidCell = (cell: CellCoord, config: GridConfig): boolean =>
  colLetterToIndex(cell.col) >= 0 &&
  colLetterToIndex(cell.col) < config.gridSize &&
  cell.row >= 1 &&
  cell.row <= config.gridSize;

/**
 * Returns every cell in the grid, row by row, top to bottom.
 * Useful for rendering all cells or building a lookup table.
 */
export const getAllCells = (config: GridConfig): CellCoord[] => {
  const cells: CellCoord[] = [];
  for (let rowIdx = 0; rowIdx < config.gridSize; rowIdx++) {
    for (let colIdx = 0; colIdx < config.gridSize; colIdx++) {
      cells.push({
        col: colIndexToLetter(colIdx),
        row: config.gridSize - rowIdx,
      });
    }
  }
  return cells;
};