// =============================================================================
// BOARD NOTATION
//
//  Converts human-readable chess-style notation into normalised (0-1) x/y
//  coordinates for opponent piece placement.
//
//  Columns  A – G  map left → right across the canvas width.
//  Rows     1 – 5  map top  → bottom within the opponent zone (top half).
//
//  Grid layout (normalised):
//
//       A     B     C     D     E     F     G
//  1  0.14  0.26  0.38  0.50  0.62  0.74  0.86   ← deep back (protected king)
//  2  0.14  0.26  0.38  0.50  0.62  0.74  0.86   ← back
//  3  0.14  0.26  0.38  0.50  0.62  0.74  0.86   ← middle
//  4  0.14  0.26  0.38  0.50  0.62  0.74  0.86   ← forward
//  5  0.14  0.26  0.38  0.50  0.62  0.74  0.86   ← very forward (aggressive)
//
//  y values per row: 1→0.10  2→0.18  3→0.26  4→0.34  5→0.42
//
//  Usage:
//    { name: 'king', ...pos('D1') }
//    { name: 'pawn', ...pos('C3') }
// =============================================================================

const COL: Record<string, number> = {
  A: 0.14, B: 0.26, C: 0.38, D: 0.50, E: 0.62, F: 0.74, G: 0.86,
};

const ROW: Record<number, number> = {
  1: 0.10, 2: 0.18, 3: 0.26, 4: 0.34, 5: 0.42,
};

/**
 * Converts chess-style board notation to normalised canvas coordinates.
 * Column letter (A-G) → x,  row number (1-5) → y.
 *
 * @example  pos('D1')  →  { x: 0.50, y: 0.10 }
 * @example  pos('B3')  →  { x: 0.26, y: 0.26 }
 */
export function pos(notation: string): { x: number; y: number } {
  const col = notation[0].toUpperCase();
  const row = parseInt(notation[1], 10);
  if (!(col in COL) || !(row in ROW)) {
    throw new Error(`boardNotation: invalid notation "${notation}". Columns A-G, rows 1-5.`);
  }
  return { x: COL[col], y: ROW[row] };
}
