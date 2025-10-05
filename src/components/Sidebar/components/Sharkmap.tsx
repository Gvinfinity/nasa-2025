import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown } from "lucide-react";
import { usePalette } from "../../../contexts/PaletteContext";
import { ModeToggleButton } from "./ModeToggleButton";

export const Sharkmap = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [currentMapMode, setCurrentMapMode] = useState<"research" | "student">(
    "research"
  );

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

  const { setSelectedView } = usePalette();

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
    setCurrentMapMode(mode);
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
            {/* Map Toggles here!!! */}
            <div className="col-span-2 mb-4">
              <ModeToggleButton onModeChange={handleModeChange} />
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
