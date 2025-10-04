import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { usePalette } from './PaletteContext';

type DataPoint = [number, number, number, number]; // [lon, lat, weight, depth]

type ResearchContextType = {
  researchData: DataPoint[] | null;
  monthIndex: number;
  setMonthIndex: (v: number) => void;
  depth: number;
  setDepth: (v: number) => void;
  fetchResearchData: (opts?: { year: number; month: number; depth: number }) => Promise<DataPoint[]>;
};

const ResearchDataContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const START_YEAR = 2020;
  const END_YEAR = 2024;
  const TOTAL_MONTHS = (END_YEAR - START_YEAR + 1) * 12;

  const [researchData, setResearchData] = useState<DataPoint[] | null>(null);
  const [monthIndex, setMonthIndex] = useState<number>(TOTAL_MONTHS - 1);
  const [depth, setDepth] = useState<number>(1000);

  const { selectedView } = usePalette();

  const fetchResearchData = useCallback(async (opts?: { year?: number; month?: number; depth?: number }) => {
    // Simple mock fetch: load local mockResearchByYear and return tuples for the requested year
    try {
  const modAny: any = await import('../data/mock/mockResearchByYear');
  const year = opts?.year ?? (START_YEAR + Math.floor(monthIndex / 12));
  const month = opts?.month ?? ((monthIndex % 12) + 1);
  const yearMap = (modAny.researchByYear || {})[year] || {};
      const requestedDepth = opts?.depth ?? depth;
      const tuples: DataPoint[] = (yearMap[month] || []).filter((t: DataPoint) => {
        // tuple format: [lon, lat, weight, depth]
        return (t[3] ?? 0) <= requestedDepth;
      });
      setResearchData(tuples);
      return tuples;
    } catch (err) {
      console.error('fetchResearchData failed', err);
      setResearchData([]);
      return [];
    }
  }, [monthIndex]);

  // Re-fetch when monthIndex, depth, or selectedView changes
  useEffect(() => {
    // derive year/month
    const year = START_YEAR + Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    fetchResearchData({ year, month, depth });
  }, [monthIndex, depth, selectedView, fetchResearchData]);

  return (
    <ResearchDataContext.Provider value={{ researchData, monthIndex, setMonthIndex, depth, setDepth, fetchResearchData }}>
      {children}
    </ResearchDataContext.Provider>
  );
};

export function useResearchData() {
  const ctx = useContext(ResearchDataContext);
  if (!ctx) throw new Error('useResearchData must be used within ResearchDataProvider');
  return ctx;
}

export default ResearchDataContext;
