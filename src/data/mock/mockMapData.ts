// Mock data for GridMap demo — separate from the component
export const exampleGridList: Array<[number, number]> = [
  [0, 1],
  [5, 3],
  [23, 10],
  [48, 6]
];

export const ROWS = 10;
export const COLS = 10;

// World bbox [minLon, minLat, maxLon, maxLat]
export const BBOX: [number, number, number, number] = [-180, -90, 180, 90];

export default { exampleGridList, ROWS, COLS, BBOX };
