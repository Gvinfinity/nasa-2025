import { useEffect } from "react";
import { PALETTES } from "../utils/palettes";
import { usePalette } from "../../../contexts/PaletteContext";

function MapGradient() {
  const { selectedView } = usePalette();

  const VIEW_TO_KEY: Record<string, string> = {
    Temperature: "temperature",
    Clouds: "clouds",
    "Ocean Depth": "ocean depth",
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
    console.log(`Selected view changed to: ${selectedView}`);
  }, [selectedView]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="h-3 rounded-full shadow-inner"
        style={{ backgroundImage: gradient }}
      />
      <div className="w-full flex justify-between text-xs text-white font-medium">
        {[0, 50, 100].map((pct) => (
          <span key={pct}>{pct}</span>
        ))}
      </div>
    </div>
  );
}


export default function MapBar() {
  return (
    <div className="w-full absolute top-0 bg-white/30 backdrop-blur-md border border-white/20 text-white h-14 z-[1001] shadow-sm">
      <div className="grid grid-cols-[minmax(200px,1fr)_minmax(220px,300px)_auto] items-center gap-2 px-4 h-full">
        <div className="flex items-center">
          <MapGradient />
        </div>

        <div className="text-center">
          <span className="text-base font-semibold text-white">
            Probability of Sharks (%)
          </span>
        </div>
      </div>
    </div>
  );
}
