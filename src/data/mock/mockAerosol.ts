// Mock aerosol data: small 2D grid of intensities (0..1)
export const ROWS = 64;
export const COLS = 128;

// World bbox for the raster [minLon, minLat, maxLon, maxLat]
export const BBOX: [number, number, number, number] = [-180, -90, 180, 90];

// create a smooth mock field with a couple of hotspots
export const mockAerosol: number[][] = (() => {
  const rows = ROWS;
  const cols = COLS;
  const data: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  const blobs = [
    { r: Math.floor(rows * 0.18), c: Math.floor(cols * 0.2), s: Math.min(rows, cols) * 0.18, v: 0.9 },
    { r: Math.floor(rows * 0.35), c: Math.floor(cols * 0.7), s: Math.min(rows, cols) * 0.12, v: 0.7 },
    { r: Math.floor(rows * 0.7), c: Math.floor(cols * 0.5), s: Math.min(rows, cols) * 0.14, v: 0.6 },
    { r: Math.floor(rows * 0.2), c: Math.floor(cols * 0.85), s: Math.min(rows, cols) * 0.08, v: 0.5 },
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let val = 0;
      for (const b of blobs) {
        const dr = (i - b.r) / b.s;
        const dc = (j - b.c) / b.s;
        const d = Math.sqrt(dr * dr + dc * dc);
        if (d < 1) val += b.v * (1 - d) * (1 - d);
      }
      data[i][j] = Math.min(1, val * (0.9 + Math.random() * 0.2));
    }
  }
  return data;
})();

export default { ROWS, COLS, BBOX, mockAerosol };
