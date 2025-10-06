import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { usePalette } from "./PaletteContext";
import { fetchModelData as fetchModelDataFromAPI, DeltaGroup } from "../api/model";

type DataPoint = [number, number, number, number]; // [lon, lat, weight, depth]

type ModelContextType = {
  modelData: DataPoint[] | null;
  visibleCoords: Array<[number, number]>;
  loading: boolean;
  updateVisibleCoords: (coords: Array<[number, number]>) => void;
  monthIndex: number;
  setMonthIndex: (v: number) => void;
  depth: number;
  setDepth: (v: number) => void;
  deltaGroup: DeltaGroup;
  setDeltaGroup: (d: DeltaGroup) => void;
  fetchModelData: (opts?: {
    year?: number;
    month?: number;
    depth?: number;
    coords?: number[][];
    deltas?: {
      deltaTemp?: number;
      deltaClouds?: number;
      deltaOceanDepth?: number;
    } | null;
    acceptMock?: boolean;
  }) => Promise<DataPoint[]>;
};

const ModelDataContext = createContext<ModelContextType | undefined>(undefined);

export const ModelDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const START_YEAR = 2020;
  const END_YEAR = 2024;
  const TOTAL_MONTHS = (END_YEAR - START_YEAR + 1) * 12;

  const [modelData, setModelData] = useState<DataPoint[] | null>(null);
  const [visibleCoords, setVisibleCoords] = useState<Array<[number, number]>>([]);
  const [monthIndex, setMonthIndex] = useState<number>(TOTAL_MONTHS - 1);
  const [depth, setDepth] = useState<number>(1000);
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>({
    deltaTemp: 0,
    deltaClouds: 0,
    deltaOceanDepth: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Wrap setter to log updates (helps trace propagation from Sharkmap sliders)
  const _setDeltaGroup = useCallback((d: DeltaGroup) => {
    console.debug('[ModelDataContext] setDeltaGroup called with:', d);
    setDeltaGroup(d);
  }, []);

  const { selectedView } = usePalette();

  const fetchModelData = useCallback(
    async (opts?: { year?: number; month?: number; depth?: number; coords?: number[][]; deltas?: any }) => {
      try {
        setLoading(true);
        const year = opts?.year ?? START_YEAR + Math.floor(monthIndex / 12);
        const month = opts?.month ?? (monthIndex % 12) + 1;
              const requestedDepth = opts?.depth ?? depth;
        // prefer explicit coords passed by caller; otherwise use the
        // last known visibleCoords sampled by the map. This ensures the
        // provider won't call the API with an empty coords array.
        const coords = opts?.coords ?? visibleCoords;

        // construct full ISO datetime (first day of month at midnight UTC) accepted by Python datetime
        const date = `${year.toString().padStart(4, '0')}-${month
          .toString()
          .padStart(2, '0')}-01T00:00:00Z`;

              let tuples: DataPoint[] = [];

        try {
          // ensure we have coordinates to send; server returns 400 when none
          

          const coordsToSend = coords;

          if (!coordsToSend || coordsToSend.length === 0) {
            console.debug('[ModelDataContext] no coords available - skipping API call');
            setModelData([]);
            return [];
          }

          // call the statically imported API helper (include coords, date, and deltas)
          const deltasToSend = (opts && (opts as any).deltas) ? (opts as any).deltas : deltaGroup;
          console.debug('[ModelDataContext] calling API with date, depth, view, coords length, deltas:', date, requestedDepth, selectedView, coordsToSend.length, deltasToSend);
          const res = await fetchModelDataFromAPI({ date, depth: requestedDepth, view: selectedView, coords: coordsToSend, deltas: deltasToSend });
          console.debug('[ModelDataContext] raw API response:', res);
          // normalize response: accept either { data: [...] } or an array
          let raw: any[] = [];
          if (Array.isArray(res)) raw = res as any[];
          else if (res && Array.isArray((res as any).data)) raw = (res as any).data;
          console.debug('[ModelDataContext] normalized raw length:', raw.length, 'sample:', raw.slice(0,3));

          // Ensure each item is a DataPoint (4 elements). Accept either
          // array-shaped items [lon, lat, count, depth?] or object-shaped
          // items { longitude, latitude, count, depth? }.
          tuples = raw
            .map((r) => {
              // array-shaped
              if (Array.isArray(r)) {
                if (r.length >= 4) return [Number(r[0]), Number(r[1]), Number(r[2]), Number(r[3])] as DataPoint;
                if (r.length === 3) return [Number(r[0]), Number(r[1]), Number(r[2]), 0] as DataPoint;
                return null;
              }
              // object-shaped
              if (r && typeof r === 'object') {
                const maybe = r as any;
                if (typeof maybe.longitude === 'number' || typeof maybe.longitude === 'string') {
                  const lon = Number(maybe.longitude);
                  const lat = Number(maybe.latitude);
                  const cnt = Number(maybe.count ?? maybe.value ?? 0);
                  const d = typeof maybe.depth === 'number' ? maybe.depth : (typeof maybe.depth === 'string' ? Number(maybe.depth) : 0);
                  return [lon, lat, cnt, d] as DataPoint;
                }
              }
              return null;
            })
            .filter(Boolean) as DataPoint[];

          console.debug('[ModelDataContext] mapped tuples length after supporting object-shape:', tuples.length);

          console.debug('[ModelDataContext] tuples after mapping length:', tuples.length, 'sample:', tuples.slice(0,3));

          // apply depth filter only when depth value exists (t[3] numeric)
          tuples = tuples.filter((t) => {
            const d = typeof t[3] === "number" ? t[3] : 0;
            return d <= requestedDepth;
          });
        } catch (e) {
          console.error('[ModelDataContext] API call failed while fetching real data:', e);
          tuples = [];
        }

        setModelData(tuples);
        setLoading(false);
        return tuples;
      } catch (err) {
        console.error("fetchModelData failed", err);
        setModelData([]);
        setLoading(false);
        return [];
      }
    },
    [monthIndex, depth, selectedView, deltaGroup]
  );

  // Re-fetch when monthIndex, depth, selectedView, deltaGroup change
  // but only when we have visible coords from the map. This avoids
  // sending an empty coords array to the backend on initial mount.
  useEffect(() => {
    const defaltCoords = getLatLonCoords();
    // derive year/month
    const year = START_YEAR + Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    // include current deltaGroup so slider-driven changes trigger a full refetch
    void fetchModelData({ year, month, depth, deltas: deltaGroup, coords: defaltCoords });
  }, [monthIndex, depth, selectedView, fetchModelData, deltaGroup]);

  const updateVisibleCoords = useCallback((coords: Array<[number, number]>) => {
    setVisibleCoords(coords);
    console.log('ModelDataProvider.visibleCoords updated (count):', coords.length);
    // NOTE: do not automatically call fetchModelData here. The caller
    // (e.g. LatitudeMap) should decide when to request model data (for
    // example, only when the zoom/scale threshold is reached). This keeps
    // the provider free of viewport-specific heuristics and avoids
    // feedback loops between model updates and viewport sampling.
  }, []);

  return (
    <ModelDataContext.Provider
      value={{
        modelData: modelData,
        visibleCoords,
        updateVisibleCoords,
        loading,
        monthIndex,
        setMonthIndex,
        depth,
        setDepth,
        deltaGroup,
        setDeltaGroup: _setDeltaGroup,
        fetchModelData,
      }}
    >
      {children}
    </ModelDataContext.Provider>
  );
};

const getLatLonCoords = () => {
  const latitudes = Array(281).fill(0).map((_, i) => -70 + i / 2);
  const longitudes = Array(251).fill(0).map((_, i) => -100 + i / 2);

  console.log('latitudes', latitudes)
  const coords = latitudes.flatMap((lat) => {
    const combinations = longitudes.map((lon) => [lon,lat]);

    return combinations
  })

  return coords;
}

// const aggregatePoints = () => {
//   const freeZone = [
//     [-35.722043, -76.632797],
//     [-22.045760, -73.037875],
//     [-11.853743, -79.720994],
//     [4.654758, -82.157878],
//     [17.468727, -107.536686],
//     [28.347414, -85.545737],
//     [34.195506, -75.371206],
//     [13.807854, -64.773424],
//     [3.994784, -46.892608],
//     [-7.565940, -31.776830],
//     [-23.506177, -39.315641],
//     [-36.370607, -52.348186],
//     [40.449024, -67.931416],
//     [55.445083, -48.955977],
//     [55.023848, -12.520895],
//     [46.166846, -31.862449],
//     [37.341664, -10.734173],
//     [32.163831, -40.654228],
//     [31.365778, -16.253585],
//     [20.016229, -41.625494],
//     [16.699318, -21.174584],
//     [6.820932, -30.634833],
//     [3.806339, -11.385403],
//     [1.190498, 4.225133],
//     [-6.053715, 8.191291],
//     [-18.450209, 7.684075],
//     [-34.544063, 10.828603],
//     [-28.517178, -15.241603],
//     [-45.074065, -17.113540],
//     [38.249232, 1.688369],
//     [31.566701, 18.559420],
//     [39.388265, 18.926371],
//     [36.584043, 25.935153],
//   ];

//   const landZone = [
//     [-16.327265, -55.411455],
//     [-37.961141, -66.277328],
//     [40.180892, -68.517595],
//     [46.939684, -69.261486],
//     [18.599059, -65.404659],
//     [-7.393596, -51.397591],
//     [-1.151521, -58.746973],
//     [-1.227447, -65.735658],
//     [4.371076, -69.997533],
//     [22.676201, -102.090551],
//     [32.619657, -104.079448],
//     [35.831120, -94.428648],
//   ]


//   const freeZoneLonLat = freeZone.map((zone) => [zone[1], zone[0]]);
//   const landZoneLonLat = landZone.map((zone) => [zone[1], zone[0]]);

//   const view1 = freeZoneLonLat;
//   const max_points = {
//     2: 100,
//     3: 150,
//     4: 200,
//     5: 500
//   }

  
// }

export const aggregatePoints = () => {
  const freeZone: Array<[number, number]> = [
    [-35.722043, -76.632797],
    [-22.045760, -73.037875],
    [-11.853743, -79.720994],
    [4.654758, -82.157878],
    [17.468727, -107.536686],
    [28.347414, -85.545737],
    [34.195506, -75.371206],
    [13.807854, -64.773424],
    [3.994784, -46.892608],
    [-7.565940, -31.776830],
    [-23.506177, -39.315641],
    [-36.370607, -52.348186],
    [40.449024, -67.931416],
    [55.445083, -48.955977],
    [55.023848, -12.520895],
    [46.166846, -31.862449],
    [37.341664, -10.734173],
    [32.163831, -40.654228],
    [31.365778, -16.253585],
    [20.016229, -41.625494],
    [16.699318, -21.174584],
    [6.820932, -30.634833],
    [3.806339, -11.385403],
    [1.190498, 4.225133],
    [-6.053715, 8.191291],
    [-18.450209, 7.684075],
    [-34.544063, 10.828603],
    [-28.517178, -15.241603],
    [-45.074065, -17.113540],
    [38.249232, 1.688369],
    [31.566701, 18.559420],
    [39.388265, 18.926371],
    [36.584043, 25.935153],
  ];
  
  const landZone: Array<[number, number]> = [
    [-16.327265, -55.411455],
    [-37.961141, -66.277328],
    [40.180892, -68.517595],
    [46.939684, -69.261486],
    [18.599059, -65.404659],
    [-7.393596, -51.397591],
    [-1.151521, -58.746973],
    [-1.227447, -65.735658],
    [4.371076, -69.997533],
    [22.676201, -102.090551],
    [32.619657, -104.079448],
    [35.831120, -94.428648],
  ];
  
  const freeZoneLonLat: Array<[number, number]> = freeZone.map((zone) => [zone[1], zone[0]] as [number, number]);
  const landZoneLonLat: Array<[number, number]> = landZone.map((zone) => [zone[1], zone[0]] as [number, number]);
  
  const max_points = {
    2: 100,
    3: 150,
  };
  
  // Helper function to calculate distance between two points
    const distance = (p1: [number, number], p2: [number, number]): number => {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Helper function to check if a point is too close to land
    const isTooCloseToLand = (point: [number, number], minDistance = 3): boolean => {
    return landZoneLonLat.some(landPoint => distance(point, landPoint) < minDistance);
  };
  
  // Helper function to check if a point is too close to existing points
    const isTooCloseToExisting = (
      point: [number, number],
      existingPoints: Array<[number, number]>,
      minDistance = 2,
    ): boolean => {
    return existingPoints.some(existing => distance(point, existing) < minDistance);
  };
  
  // Interpolate between two points
    const interpolate = (p1: [number, number], p2: [number, number], t: number): [number, number] => {
    return [
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t
    ];
  };
  
  // Generate points for a given view level
  const generatePointsForView = (view: number) => {
    if (view < 2) {
      return freeZoneLonLat;
    }
    
  // @ts-ignore -- best-effort target counts per zoom level
  const targetCount = (max_points as any)[view] || (max_points as any)[5];
  const result: Array<[number, number]> = [...freeZoneLonLat];
    const attempts = targetCount * 10; // Max attempts to avoid infinite loops
    
    for (let i = 0; i < attempts && result.length < targetCount; i++) {
      let newPoint: [number, number] | undefined;
      
      // Strategy 1: Interpolate between two random existing points (70% of time)
      if (Math.random() < 0.7) {
        const idx1 = Math.floor(Math.random() * result.length);
        const idx2 = Math.floor(Math.random() * result.length);
        if (idx1 !== idx2) {
          const t = 0.3 + Math.random() * 0.4; // Interpolate between 30% and 70%
    newPoint = interpolate(result[idx1], result[idx2], t);
        } else {
          continue;
        }
      } 
      // Strategy 2: Create points in ocean regions with some randomness (30% of time)
      else {
        const baseIdx = Math.floor(Math.random() * result.length);
        const basePoint = result[baseIdx];
        const offset = 5 + Math.random() * 10; // Random offset
        const angle = Math.random() * 2 * Math.PI;
        newPoint = [
          basePoint[0] + offset * Math.cos(angle),
          basePoint[1] + offset * Math.sin(angle),
        ] as [number, number];
      }
      
      // Validate the new point
      const minLandDist = view >= 4 ? 5 : 3; // Stricter for higher zoom
      const minPointDist = view >= 4 ? 1.5 : 2;
      
      if (
        newPoint &&
        !isTooCloseToLand(newPoint, minLandDist) &&
        !isTooCloseToExisting(newPoint, result, minPointDist)
      ) {
        result.push(newPoint);
      }
    }
    
    return result;
  };
  
  // Return a function that can be called with different view levels
    return (view: number): Array<[number, number]> => {
    if (view < 2) {
      return freeZoneLonLat;
    }
    return generatePointsForView(Math.floor(view));
  };
};

export const aggregateWeights = (
  pointsView: Array<[number, number]>,
  pointsRaw: Array<[number, number, number, number]>,
  searchRadius = 10,
): Array<[number, number, number, number]> => {
  const distance = (p1: [number, number], p2: [number, number]): number => {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  const result: Array<[number, number, number, number]> = [];


  // For each point in pointsView
  for (let i = 0; i < pointsView.length; i++) {
    const viewPoint = pointsView[i];
    let maxWeight = 0;
    let closestDistance = Infinity;
    
  // Find all pointsRaw within searchRadius and get their weights
  const nearbyWeights: Array<{ weight: number; distance: number }> = [];
    
    for (let j = 0; j < pointsRaw.length; j++) {
      const rawPoint = pointsRaw[j];
      const dist = distance(
        [viewPoint[0], viewPoint[1]], 
        [rawPoint[0], rawPoint[1]]
      );
      
      // If within search radius, consider this point
      if (dist <= searchRadius) {
        nearbyWeights.push({
          weight: rawPoint[2], // The weight is in index 2
          distance: dist
        });
        
        if (dist < closestDistance) {
          closestDistance = dist;
        }
      }
    }
    
    // Get the maximum weight from nearby points
    if (nearbyWeights.length > 0) {
      maxWeight = Math.max(...nearbyWeights.map(p => p.weight));
    } else {
      // If no points within radius, find the absolute closest point
      let closestWeight = 0;
      let minDist = Infinity;
      
      for (let j = 0; j < pointsRaw.length; j++) {
        const rawPoint = pointsRaw[j];
        const dist = distance(
          [viewPoint[0], viewPoint[1]], 
          [rawPoint[0], rawPoint[1]]
        );
        
        if (dist < minDist) {
          minDist = dist;
          closestWeight = rawPoint[2];
        }
      }
      
      maxWeight = closestWeight;
    }
    
    // Create the weighted point in format [lon, lat, weight, 0]
    result.push([viewPoint[0], viewPoint[1], maxWeight, 0]);
  }
  
  return result;
};

// Usage example:


export function useModelData() {
  const ctx = useContext(ModelDataContext);
  if (!ctx)
    throw new Error("useModelData must be used within ModelDataProvider");
  return ctx;
}

export default ModelDataContext;
