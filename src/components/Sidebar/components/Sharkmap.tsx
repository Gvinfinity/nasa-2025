import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown, Eye, SprayCan } from "lucide-react";
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
    { name: "Temperature", icon: "🌡️", selected: false, color: [255, 0, 0] },
    { name: "Salinity", icon: "🧂", selected: false, color: [0, 0, 255] },
    {
      name: "Ocean Topography",
      icon: "🏔️",
      selected: false,
      color: [0, 255, 0],
    },
    {
      name: "Ocean Currents",
      icon: "🌊",
      selected: false,
      color: [255, 255, 0],
    },
    { name: "Biomass", icon: "🐟", selected: false, color: [255, 165, 0] },
  ]);

  const { setSelectedView, colorblindMode, setColorblindMode } = usePalette();

  const handleItemClick = (i: number) => {
    const selectedOption = sharkMapOptions[i];
    setSelectedView(selectedOption.name);

    setSharkMapOptions((prev) =>
      prev.map((option, index) => ({
        ...option,
        selected: index === i,
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
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-800/60 transition-all"
      >
        <div className="flex items-center gap-3">
          <Map size={20} />
          <span className="font-medium text-blue-100">Shark Map</span>
        </div>
        <motion.div
          animate={{ rotate: openMenu ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

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
                      <SprayCan className="text-white w-6 h-6" />
                      <span className="text-sm">Aerosol</span>
                    </div>

                    <button
                      aria-pressed={!!enabled}
                      onClick={() => setEnabled?.(!enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:opacity-80 focus:outline-none ${
                        enabled ? "bg-green-600" : "bg-white/5"
                      }`}
                      title="Enable map features"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex justify-between w-full gap-3">
                    <div className="flex items-center space-x-2">
                      <Eye className="text-white w-6 h-6" />
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
                onClick={() => handleItemClick(i)}
                className={`
                  cursor-pointer
                  flex flex-col items-center justify-center
                  p-4 rounded-xl border backdrop-blur-sm
                  transition-all duration-300
                  shadow-md
                  ${
                    opt.selected
                      ? "bg-blue-700 border-blue-500 text-white shadow-lg"
                      : "bg-slate-800/40 border-slate-700/50 text-blue-100 hover:bg-slate-700/60 hover:border-slate-600"
                  }
                `}
              >
                {opt.icon && (
                  <span className="text-3xl mb-2 opacity-90 drop-shadow-md">
                    {opt.icon}
                  </span>
                )}
                <span
                  className={`text-sm font-medium tracking-wide ${
                    opt.selected ? "text-white" : "text-blue-100/90"
                  }`}
                >
                  {opt.name}
                </span>

                {opt.selected && (
                  <motion.div
                    layoutId="selectedIndicator"
                    className="mt-2 w-2.5 h-2.5 bg-blue-300 rounded-full shadow-inner"
                  />
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
