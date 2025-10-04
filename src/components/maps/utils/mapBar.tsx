import { Button } from "../../ui/button";
import { PALETTES } from '../utils/palettes';
import { usePalette } from '../../../contexts/PaletteContext';


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
                <div className="flex items-center justify-end">
                    <Button
                        className={`text-lg text-zinc-100 mr-2 ${enabled ? "bg-cyan-700" : "bg-red-700"
                            }`}
                        style={{ fontSize: "1.125rem" }}
                        onClick={() => setEnabled(!enabled)}
                    >
                        {enabled ? "Enabled" : "Disabled"}
                    </Button>
                </div>
            </div>
        </div>
    );
}