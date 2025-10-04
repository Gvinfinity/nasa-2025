import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { VIEWS } from "../components/maps/utils/palettes";

type PaletteContextType = {
  selectedView?: string;
  setSelectedView: (v?: string) => void;
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedView, setSelectedView] = useState<string | undefined>(VIEWS[0]);
  useEffect(() => {
    console.log("PaletteContext: selectedView changed to", selectedView);
  }, [selectedView]);
  return (
    <PaletteContext.Provider value={{ selectedView, setSelectedView }}>
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = () => {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
  return ctx;
};

export default PaletteContext;
