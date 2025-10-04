import { Button } from "../../components/ui/button";
import MapLatitude from "../../components/maps/LatitudeMap";
import { usePalette } from "../../contexts/PaletteContext";
import { PALETTES } from "../../components/maps/utils/palettes";
import { useState } from "react";

function MapGradient() {
  const { selectedView } = usePalette();
  const palette = PALETTES[selectedView] || PALETTES.default;
  const stops = palette.map((c, i) => {
    const pct = Math.round((i / (palette.length - 1)) * 100);
    return `rgb(${c[0]}, ${c[1]}, ${c[2]}) ${pct}%`;
  });
  const gradient = `linear-gradient(90deg, ${stops.join(", ")})`;

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

export default function Map() {
  
  return (
    <>
      
      <MapLatitude />
    </>
  );
}
