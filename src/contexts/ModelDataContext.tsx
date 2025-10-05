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
      deltaPhytoplankton?: number;
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
    deltaPhytoplankton: 0,
  });

  // Wrap setter to log updates (helps trace propagation from Sharkmap sliders)
  const _setDeltaGroup = useCallback((d: DeltaGroup) => {
    console.debug('[ModelDataContext] setDeltaGroup called with:', d);
    setDeltaGroup(d);
  }, []);

  const { selectedView } = usePalette();

  const fetchModelData = useCallback(
    async (opts?: { year?: number; month?: number; depth?: number; coords?: number[][]; deltas?: any }) => {
      try {
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
          const coordsToSend = coords ?? [];
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
        return tuples;
      } catch (err) {
        console.error("fetchModelData failed", err);
        setModelData([]);
        return [];
      }
    },
    [monthIndex, depth, selectedView, deltaGroup]
  );

  // Re-fetch when monthIndex, depth, selectedView, deltaGroup change
  // but only when we have visible coords from the map. This avoids
  // sending an empty coords array to the backend on initial mount.
  useEffect(() => {
    if (!visibleCoords || visibleCoords.length === 0) {
      console.debug('[ModelDataContext] visibleCoords empty - skipping auto fetch');
      return;
    }
    // derive year/month
    const year = START_YEAR + Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    // include current deltaGroup so slider-driven changes trigger a full refetch
    void fetchModelData({ year, month, depth, deltas: deltaGroup, coords: visibleCoords });
  }, [monthIndex, depth, selectedView, fetchModelData, visibleCoords, deltaGroup]);

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

export function useModelData() {
  const ctx = useContext(ModelDataContext);
  if (!ctx)
    throw new Error("useModelData must be used within ModelDataProvider");
  return ctx;
}

export default ModelDataContext;
