// Helpers to convert grid-style JSON into formats usable by DeckGL layers
export type GridEntry = [number, number]; // [index, intensity]
export type Grid = GridEntry[]; // list of [index, value]
export type DataPoint = [number, number, number]; // [lon, lat, weight]

/**
 * Convert a linear grid index into (row, col) for a grid with given cols
 */
export function indexToRowCol(index: number, cols: number) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return { row, col };
}

/**
 * Compute the geographic center (lon,lat) of a grid cell
 * bbox: [minLon, minLat, maxLon, maxLat]
 * row0IsTop: whether row 0 corresponds to the top (maxLat)
 */
export function cellCenterLonLat(
  row: number,
  col: number,
  rows: number,
  cols: number,
  bbox: [number, number, number, number],
  row0IsTop = true
): [number, number] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const lon = minLon + (col + 0.5) / cols * (maxLon - minLon);
  const fracY = (row + 0.5) / rows;
  const lat = row0IsTop
    ? maxLat - fracY * (maxLat - minLat)
    : minLat + fracY * (maxLat - minLat);
  return [lon, lat];
}

/**
 * Convert incoming "list of lists" grid data into DeckGL tuple points.
 * Input format expected: [[index, intensity], [index, intensity], ...]
 * cols: number of columns in the grid (required to derive row/col)
 * rows: number of rows in the grid
 * bbox: geographic bbox mapping the whole grid area
 */
export function gridListToTuples(
  gridList: Grid,
  cols: number,
  rows: number,
  bbox: [number, number, number, number],
  row0IsTop = true,
  skipZero = true
): DataPoint[] {
  const out: DataPoint[] = [];
  for (const entry of gridList) {
    const [index, intensity] = entry;
    if (skipZero && !intensity) continue;
    const { row, col } = indexToRowCol(index, cols);
    if (row < 0 || row >= rows || col < 0 || col >= cols) continue;
    const [lon, lat] = cellCenterLonLat(row, col, rows, cols, bbox, row0IsTop);
    out.push([lon, lat, intensity]);
  }
  return out;
}

/**
 * Create a canvas image from a dense grid (rows x cols). If input is sparse list
 * you can first fill an array then call this function. colorForValue should return
 * an rgba() string or you can write your own mapping.
 */
export function gridArrayToCanvas(
  gridArray: number[][],
  colorForValue: (v: number) => string
): HTMLCanvasElement {
  const rows = gridArray.length;
  const cols = rows ? gridArray[0].length : 0;
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d')!;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = gridArray[r][c];
      if (!v) continue;
      ctx.fillStyle = colorForValue(v);
      ctx.fillRect(c, r, 1, 1);
    }
  }
  return canvas;
}

export default {};
