import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown } from "lucide-react";
import { usePalette } from "../../../contexts/PaletteContext";

export const Sharkmap = () => {
  const [openMenu, setOpenMenu] = useState(false);

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

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-blue-800/40 transition-all"
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
                      ? "bg-gradient-to-b from-blue-600 to-blue-800 border-blue-500 text-white shadow-lg shadow-blue-700/30"
                      : "bg-gradient-to-b from-blue-950/40 to-blue-900/20 border-blue-800/50 text-blue-100 hover:from-blue-900/50 hover:to-blue-800/40 hover:border-blue-700"
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
