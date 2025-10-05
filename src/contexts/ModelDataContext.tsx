import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { usePalette } from "./PaletteContext";
import { fetchModelData as fetchModelDataFromAPI } from "../api/model";

type DataPoint = [number, number, number, number]; // [lon, lat, weight, depth]

type ModelContextType = {
  modelData: DataPoint[] | null;
  monthIndex: number;
  setMonthIndex: (v: number) => void;
  depth: number;
  setDepth: (v: number) => void;
  fetchModelData: (opts?: {
    year?: number;
    month?: number;
    depth?: number;
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
  const [monthIndex, setMonthIndex] = useState<number>(TOTAL_MONTHS - 1);
  const [depth, setDepth] = useState<number>(1000);

  const { selectedView } = usePalette();

  const fetchModelData = useCallback(
    async (opts?: { year?: number; month?: number; depth?: number; acceptMock?: boolean }) => {
      try {
        const year = opts?.year ?? START_YEAR + Math.floor(monthIndex / 12);
        const month = opts?.month ?? (monthIndex % 12) + 1;
        const requestedDepth = opts?.depth ?? depth;

        let tuples: DataPoint[] = [];

        if (opts?.acceptMock) {
          const modAny: any = await import("../data/mock/mockModelDataByYear");
          const yearMap = (modAny.modelDataByYear || {})[year] || {};
          tuples = (yearMap[month] || []).filter((t: DataPoint) => (t[3] ?? 0) <= requestedDepth);
        } else {
          try {
            // call the statically imported API helper
            const res = await fetchModelDataFromAPI({ year, month, depth: requestedDepth, view: selectedView });
            // normalize response: accept either { data: [...] } or an array
            let raw: any[] = [];
            if (Array.isArray(res)) raw = res as any[];
            else if (res && Array.isArray((res as any).data)) raw = (res as any).data;

            // Ensure each item is a DataPoint (4 elements). If API returns 3 elements (no depth), append depth=0
            tuples = raw.map((r) => {
              if (!Array.isArray(r)) return null;
              if (r.length >= 4) return [Number(r[0]), Number(r[1]), Number(r[2]), Number(r[3])] as DataPoint;
              if (r.length === 3) return [Number(r[0]), Number(r[1]), Number(r[2]), 0] as DataPoint;
              return null;
            }).filter(Boolean) as DataPoint[];

            // apply depth filter only when depth value exists (t[3] numeric)
            tuples = tuples.filter((t) => {
              const d = typeof t[3] === "number" ? t[3] : 0;
              return d <= requestedDepth;
            });
          } catch (e) {
            // fallback to mock data on any failure
            const modAny: any = await import("../data/mock/mockModelDataByYear");
            const yearMap = (modAny.modelDataByYear || {})[year] || {};
            tuples = (yearMap[month] || []).filter((t: DataPoint) => (t[3] ?? 0) <= requestedDepth);
          }
        }

        setModelData(tuples);
        return tuples;
      } catch (err) {
        console.error("fetchModelData failed", err);
        setModelData([]);
        return [];
      }
    },
    [monthIndex, depth, selectedView]
  );

  // Re-fetch when monthIndex, depth, or selectedView changes
  useEffect(() => {
    // derive year/month
    const year = START_YEAR + Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    fetchModelData({ year, month, depth, acceptMock: true });
  }, [monthIndex, depth, selectedView, fetchModelData]);

  return (
    <ModelDataContext.Provider
      value={{
        modelData: modelData,
        monthIndex,
        setMonthIndex,
        depth,
        setDepth,
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
