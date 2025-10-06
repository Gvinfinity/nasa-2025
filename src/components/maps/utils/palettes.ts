// Simple color palettes for ocean views. Each palette is an array of RGB tuples.
export const PALETTES: Record<string, number[][]> = {
  
  default: [
    [255, 255, 178],
    [254, 204, 92],
    [253, 141, 60],
    [240, 59, 32],
  ],
  // colorblind-friendly palettes — unified blue -> yellow scale
  salinity_cb: [
    [49, 54, 149],
    [69, 117, 180],
    [171, 217, 233],
    [255, 255, 191],
    [254, 196, 79],
  ],
  topography_cb: [
    [49, 54, 149],
    [69, 117, 180],
    [171, 217, 233],
    [255, 255, 191],
    [254, 196, 79],
  ],
  biomass_cb: [
    [49, 54, 149],
    [69, 117, 180],
    [171, 217, 233],
    [255, 255, 191],
    [254, 196, 79],
  ],
  temperature_cb: [
    [49, 54, 149],
    [69, 117, 180],
    [171, 217, 233],
    [255, 255, 191],
    [254, 196, 79],
  ],
  currents_cb: [
    [49, 54, 149],
    [69, 117, 180],
    [171, 217, 233],
    [255, 255, 191],
    [254, 196, 79],
  ],
  default_cb: [
    [49, 54, 149],
    [69, 117, 180],
    [171, 217, 233],
    [255, 255, 191],
    [254, 196, 79],
  ],
  clouds: [
    [255, 255, 255],
    [220, 220, 220],
    [180, 180, 180],
    [140, 140, 140],
    [100, 100, 100],
  ],
  'ocean depth': [
    [173, 216, 230],
    [100, 149, 237],
    [65, 105, 225],
    [0, 0, 139],
    [0, 0, 80],
  ],
  clouds_cb: [
    [253, 231, 37],
    [94, 201, 98],
    [33, 145, 140],
    [59, 82, 139],
    [68, 1, 84],
  ],
  'ocean depth_cb': [
    [68, 1, 84],
    [59, 82, 139],
    [33, 145, 140],
    [94, 201, 98],
    [253, 231, 37],
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
  "Clouds", 
  "Ocean Depth",
];

export default { PALETTES, colorForValue, VIEWS };
