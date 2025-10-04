import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown } from "lucide-react";

export const Sharkmap = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const subItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  // const sharkMapOptions = [
  //   "None",
  //   "Temperature",
  //   "Salinity",
  //   "Ocean Topography",
  //   "Ocean Currents",
  //   "Biomass",
  //   "Other Map Variants...",
  // ];
  const [sharkMapOptions, setSharkMapOptions] = useState([
    // { name: "None", icon: null, selected: true },
    { name: "Temperature", icon: "🌡️", selected: false },
    { name: "Salinity", icon: "🧂", selected: false },
    { name: "Ocean Topography", icon: "🏔️", selected: false },
    { name: "Ocean Currents", icon: "🌊", selected: false },
    { name: "Biomass", icon: "🐟", selected: false },
    // { name: "Other Map Variants...", icon: "🗺️", selected: false },
  ]);

  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-blue-800/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <Map size={20} />
          <span className="font-medium">Shark Map</span>
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
              className="ml-6 mt-2 flex flex-col gap-1 overflow-hidden"
            >
              {sharkMapOptions.map((opt, i) => (
                <motion.li
                  key={i}
                  variants={subItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setSharkMapOptions(prev => 
                      prev.map((option, index) => 
                        index === i ? { ...option, selected: !option.selected } : option
                      )
                    );
                    }}
                    className={`cursor-pointer px-3 py-2 rounded-md transition-all flex items-center gap-2 border ${
                    opt.selected
                      ? "bg-blue-600/40 border-blue-500 text-white font-semibold"
                      : "bg-blue-900/30 border-blue-700/50 hover:bg-blue-800/50"
                    }`}
                  >
                    {opt.icon && <span className="text-lg">{opt.icon}</span>}
                  <span className="text-sm">{opt.name}</span>
                  {opt.selected && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </motion.li>
              ))}
            </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
