// using a small toggle instead of the Button component
import { PALETTES } from "../utils/palettes";
import { usePalette } from "../../../contexts/PaletteContext";
import { useEffect } from "react";

function MapGradient() {
  const { selectedView } = usePalette();
  // map display names (e.g. "Temperature") to PALETTES keys (e.g. "temperature")
  const VIEW_TO_KEY: Record<string, string> = {
    Temperature: "temperature",
    Salinity: "salinity",
    "Ocean Topography": "topography",
    "Ocean Currents": "currents",
    Biomass: "biomass",
    default: "default",
  };
  const paletteKey = VIEW_TO_KEY[selectedView ?? "default"] ?? "default";
  const palette = PALETTES[paletteKey] || PALETTES.default;
  const stops = palette.map((c, i) => {
    const pct = Math.round((i / (palette.length - 1)) * 100);
    return `rgb(${c[0]}, ${c[1]}, ${c[2]}) ${pct}%`;
  });
  const gradient = `linear-gradient(90deg, ${stops.join(", ")})`;

  useEffect(() => {
    // This effect runs whenever selectedView changes
    console.log(`Selected view changed to: ${selectedView}`);
  }, [selectedView]);

  return (
    <div className="ml-2 w-full">
      <div className="h-4 rounded-sm" style={{ backgroundImage: gradient }} />
      <div className="w-full font-medium flex flex-row justify-between h-fit">
        {[0, 50, 100].map((pct) => (
          <span key={pct} className="text-md">
            {pct}
          </span>
        ))}
      </div>
    </div>
  );
}

interface MapBarProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MapBar({ enabled, setEnabled }: MapBarProps) {
  return (
    <div className="w-full absolute top-0 bg-zinc-300 text-black h-12 z-[1001]">
      <div className="grid grid-cols-[minmax(220px,1fr)_1fr_auto] items-center gap-2 h-full">
        <div className="flex items-center">
          <MapGradient />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium" style={{ fontSize: "1.125rem" }}>
            Probability of Sharks (%)
          </p>
        </div>
        <div className="flex items-center justify-end pr-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer-checked:bg-cyan-600 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            <span className="ml-3 text-sm font-medium text-black">
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
