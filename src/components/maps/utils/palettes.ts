// Simple color palettes for ocean views. Each palette is an array of RGB tuples.
export const PALETTES: Record<string, number[][]> = {
  salinity: [
    [237, 248, 251],
    [204, 236, 230],
    [153, 216, 201],
    [102, 194, 164],
    [35, 139, 69],
  ],
  topography: [
    [255, 255, 204],
    [255, 237, 160],
    [254, 204, 92],
    [253, 141, 60],
    [240, 59, 32],
  ],
  biomass: [
    [255, 245, 240],
    [254, 224, 210],
    [252, 187, 161],
    [252, 146, 114],
    [215, 48, 31],
  ],
  temperature: [
    [49, 54, 149],
    [69, 117, 180],
    [116, 173, 209],
    [171, 217, 233],
    [255, 255, 191],
    [254, 153, 41],
    [204, 76, 2],
  ],
  currents: [
    [229, 245, 249],
    [153, 216, 201],
    [44, 162, 95],
    [0, 109, 44],
  ],
  default: [
    [255, 255, 178],
    [254, 204, 92],
    [253, 141, 60],
    [240, 59, 32],
  ],
};

// Map a 0..1 value to an RGB tuple from the palette using linear interpolation between stops
export function colorForValue(palette: number[][], t: number) {
  const n = palette.length;
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(n - 1, Math.ceil(idx));
  const frac = idx - lo;
  const c0 = palette[lo];
  const c1 = palette[hi];
  const r = Math.round(c0[0] + (c1[0] - c0[0]) * frac);
  const g = Math.round(c0[1] + (c1[1] - c0[1]) * frac);
  const b = Math.round(c0[2] + (c1[2] - c0[2]) * frac);
  return [r, g, b];
}
export const VIEWS = [
  "Temperature",
  "Salinity",
  "Ocean Topography",
  "Ocean Currents",
  "Biomass",
];

export default { PALETTES, colorForValue, VIEWS };
