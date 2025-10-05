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
  // colorblind-friendly alternatives (cividis/viridis-like choices)
  salinity_cb: [
    [68, 1, 84],
    [59, 82, 139],
    [33, 145, 140],
    [94, 201, 98],
    [253, 231, 37],
  ],
  topography_cb: [
    [253, 231, 37],
    [94, 201, 98],
    [33, 145, 140],
    [59, 82, 139],
    [68, 1, 84],
  ],
  biomass_cb: [
    [255, 247, 236],
    [254, 196, 79],
    [254, 153, 41],
    [217, 95, 14],
    [153, 52, 4],
  ],
  temperature_cb: [
    [68, 1, 84],
    [59, 82, 139],
    [33, 145, 140],
    [94, 201, 98],
    [253, 231, 37],
    [254, 153, 41],
    [204, 76, 2],
  ],
  currents_cb: [
    [253, 231, 37],
    [94, 201, 98],
    [33, 145, 140],
    [59, 82, 139],
  ],
  default_cb: [
    [253, 231, 37],
    [254, 204, 92],
    [253, 141, 60],
    [240, 59, 32],
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
  phytoplanktons: [
    [144, 238, 144],
    [60, 179, 113],
    [34, 139, 34],
    [0, 100, 0],
    [0, 64, 0],
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
  phytoplanktons_cb: [
    [255, 247, 236],
    [254, 196, 79],
    [254, 153, 41],
    [217, 95, 14],
    [153, 52, 4],
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
  "Phytoplanktons",
];

export default { PALETTES, colorForValue, VIEWS };
