import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown } from "lucide-react";
import { usePalette } from "../../../contexts/PaletteContext";
import { ModeToggleButton } from "./ModeToggleButton";

type SharkmapProps = {
  setMapMode?: (m: "research" | "student") => void;
  enabled?: boolean;
  setEnabled?: (b: boolean) => void;
  forcedOpen?: boolean;
};

export const Sharkmap = ({
  setMapMode,
  enabled,
  setEnabled,
  forcedOpen,
}: SharkmapProps) => {
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    // toggle menu based on forcedOpen so Slides can open/close the Sharkmap menu
    if (forcedOpen) setOpenMenu(true);
    else setOpenMenu(false);
  }, [forcedOpen]);

  const subItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const [sharkMapOptions, setSharkMapOptions] = useState([
    { name: "Temperature", icon: "🌡️", color: [255, 0, 0], value: 50 },
    { name: "Clouds", icon: "☁️", color: [200, 200, 200], value: 50 },
    { name: "Ocean Depth", icon: "🌊", color: [0, 100, 200], value: 50 },
    { name: "Phytoplanktons", icon: "🦠", color: [0, 255, 100], value: 50 },
  ]);

  const { setSelectedView, colorblindMode, setColorblindMode } = usePalette();

  const handleValueChange = (index: number, value: number) => {
    setSharkMapOptions((prev) =>
      prev.map((option, i) => ({
        ...option,
        value: i === index ? value : option.value,
      }))
    );
  };

  const handleModeChange = (mode: "research" | "student") => {
    // keep local indicator in sync and notify parent/sidebar
    setSharkMapOptions((opts) => opts);
    setMapMode?.(mode);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
      >
        <Map size={22} className="text-neutral-100" />
        <span className="font-semibold text-neutral-100 tracking-wide">Shark Map</span>
        <motion.div
          animate={{ rotate: openMenu ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-auto"
        >
          <ChevronDown size={18} className="text-neutral-100" />
        </motion.div>
      </div>

  {/* forcedOpen handled via effect */}

      <AnimatePresence>
        {openMenu && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { opacity: 1, height: "auto" },
              hidden: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="ml-4 mt-3 grid grid-cols-2 gap-2 overflow-hidden"
          >
            {/* Map Toggles here: Mode, Enable, Colorblind */}
            <div className="col-span-2 mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <ModeToggleButton onModeChange={handleModeChange} />
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex justify-between w-full gap-3">
                    <div className="flex items-center space-x-2">
                      {/* <Eye className="text-white w-6 h-6" /> */}
                      <span className="text-2xl">👁️</span>
                      <span className="text-sm">Colorblind</span>
                    </div>

                    <button
                      aria-pressed={!!colorblindMode}
                      onClick={() => setColorblindMode?.(!colorblindMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:opacity-80 focus:outline-none ${
                        colorblindMode ? "bg-green-600" : "bg-white/5"
                      }`}
                      title="Colorblind mode"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          colorblindMode ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {sharkMapOptions.map((opt, i) => (
              <motion.li
                key={i}
                variants={subItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.05 }}
                className="col-span-2 mb-4"
              >
                <div
                  className="
                    flex flex-col items-center justify-center
                    p-4 rounded-xl border backdrop-blur-sm
                    transition-all duration-300
                    shadow-md mb-3
                    bg-slate-800/40 border-slate-700/50 text-blue-100
                  "
                >
                  {opt.icon && (
                    <span className="text-2xl mb-2 opacity-90 drop-shadow-md">
                      {opt.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium tracking-wide text-blue-100/90">
                    {opt.name}
                  </span>
                </div>

                {/* Parameter control bar */}
                <div className="px-2">
                  <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
                    <span>Low</span>
                    <span className="font-medium">{opt.value * 2}%</span>
                    <span>High</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={opt.value}
                    onChange={(e) => handleValueChange(i, Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, 
                        rgb(${opt.color[0]}, ${opt.color[1]}, ${opt.color[2]}) 0%, 
                        rgb(${opt.color[0]}, ${opt.color[1]}, ${opt.color[2]}) ${opt.value}%, 
                        #475569 ${opt.value}%, 
                        #475569 100%)`
                    }}
                  />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
