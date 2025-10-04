// Mock research data per year (simple static points). Each entry is [lon, lat, weight]
// Mock research data per year and month. Each entry is [lon, lat, weight]
// Structure: researchByYear[year][month] => array of tuples
export const researchByYear: Record<number, Record<number, Array<[number, number, number]>>> = {
  2020: Object.fromEntries(
    Array.from({ length: 12 }).map((_, mi) => {
      const month = mi + 1;
      // small seasonal variation: weights shift by month
      // attach a mock depth (meters) per point — vary by month
      const base = [
        [-50, 10, 2 + (mi % 3), 100 + (mi * 10)],
        [-40, 12, 6 + (mi % 4), 200 + (mi * 15)],
        [-30, 8, 3 + (mi % 2), 300 + (mi * 8)],
        [10, -20, 8 + ((mi + 1) % 5), 500 + (mi * 20)],
        [20, -10, 4 + (mi % 4), 800 + (mi * 12)],
      ];
      return [month, base];
    })
  ) as Record<number, Array<[number, number, number]>>,
  2021: Object.fromEntries(
    Array.from({ length: 12 }).map((_, mi) => {
      const month = mi + 1;
      const base = [
        [-52, 11, 3 + (mi % 3), 120 + (mi * 10)],
        [-42, 14, 7 + (mi % 4), 220 + (mi * 14)],
        [-28, 9, 2 + (mi % 2), 320 + (mi * 9)],
        [12, -18, 6 + ((mi + 1) % 5), 480 + (mi * 18)],
        [22, -12, 5 + (mi % 4), 780 + (mi * 11)],
      ];
      return [month, base];
    })
  ) as Record<number, Array<[number, number, number]>>,
  2022: Object.fromEntries(
    Array.from({ length: 12 }).map((_, mi) => {
      const month = mi + 1;
      const base = [
        [-54, 9, 4 + (mi % 3), 140 + (mi * 9)],
        [-44, 13, 8 + (mi % 4), 240 + (mi * 13)],
        [-26, 10, 5 + (mi % 2), 340 + (mi * 7)],
        [14, -16, 9 + ((mi + 1) % 5), 460 + (mi * 16)],
        [24, -8, 6 + (mi % 4), 760 + (mi * 10)],
      ];
      return [month, base];
    })
  ) as Record<number, Array<[number, number, number]>>,
  2023: Object.fromEntries(
    Array.from({ length: 12 }).map((_, mi) => {
      const month = mi + 1;
      const base = [
        [-56, 8, 5 + (mi % 3), 160 + (mi * 11)],
        [-46, 15, 9 + (mi % 4), 260 + (mi * 12)],
        [-24, 11, 6 + (mi % 2), 360 + (mi * 6)],
        [16, -14, 10 + ((mi + 1) % 5), 440 + (mi * 19)],
        [26, -6, 7 + (mi % 4), 740 + (mi * 9)],
      ];
      return [month, base];
    })
  ) as Record<number, Array<[number, number, number]>>,
  2024: Object.fromEntries(
    Array.from({ length: 12 }).map((_, mi) => {
      const month = mi + 1;
      const base = [
        [-58, 7, 6 + (mi % 3), 180 + (mi * 12)],
        [-48, 16, 10 + (mi % 4), 280 + (mi * 11)],
        [-22, 12, 7 + (mi % 2), 380 + (mi * 8)],
        [18, -12, 11 + ((mi + 1) % 5), 420 + (mi * 17)],
        [28, -4, 8 + (mi % 4), 720 + (mi * 13)],
      ];
      return [month, base];
    })
  ) as Record<number, Array<[number, number, number]>>,
};
