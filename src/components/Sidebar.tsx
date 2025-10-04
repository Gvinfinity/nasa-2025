import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Map,
  Layers,
  BookOpen,
  Brain,
  Users,
  ChevronDown,
} from "lucide-react";
interface SidebarProps {
  children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const sidebarVariants = {
    open: {
      width: "18rem",
      transition: { type: "spring" as const, stiffness: 200, damping: 20 },
    },
    closed: {
      width: "4.5rem",
      transition: { type: "spring" as const, stiffness: 250, damping: 22 },
    },
  };

  const sectionVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  const subItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const sharkMapOptions = [
    "None",
    "Temperature",
    "Salinity",
    "Ocean Topography",
    "Ocean Currents",
    "Biomass",
    "Other Map Variants...",
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.aside
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col items-start p-4 shadow-2xl relative overflow-hidden"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white mb-6 focus:outline-none self-end"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav className="flex flex-col gap-3 w-full text-sm">
          {/* SHARK MAP */}
          <motion.div
            initial="closed"
            animate="open"
            className="flex flex-col w-full"
          >
            <button
              onClick={() =>
                setOpenMenu(openMenu === "map" ? null : "map")
              }
              className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-blue-800/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <Map size={20} />
                {isOpen && <span className="font-medium">Shark Map</span>}
              </div>
              {isOpen && (
                <motion.div
                  animate={{ rotate: openMenu === "map" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              )}
            </button>

            <AnimatePresence>
              {isOpen && openMenu === "map" && (
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
                      className="cursor-pointer px-2 py-1 rounded-md hover:bg-blue-800/50"
                    >
                      {opt}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          {/* LEARN MORE */}
          <motion.div
            variants={sectionVariants}
            animate={isOpen ? "open" : "closed"}
            className="flex flex-col w-full"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
              <BookOpen size={20} />
              {isOpen && <span className="font-medium">Importance of Sharks</span>}
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
              <Layers size={20} />
              {isOpen && <span className="font-medium">Which Shark Are You?</span>}
            </div>
          </motion.div>

          {/* MODEL */}
          <motion.div
            variants={sectionVariants}
            animate={isOpen ? "open" : "closed"}
            className="flex flex-col w-full"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
              <Brain size={20} />
              {isOpen && (
                <span className="font-medium">How We Predict Shark Movement</span>
              )}
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
              <Layers size={20} />
              {isOpen && <span className="font-medium">NASA Data Used</span>}
            </div>
          </motion.div>

          {/* TEAM */}
          <motion.div
            variants={sectionVariants}
            animate={isOpen ? "open" : "closed"}
            className="flex flex-col w-full"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
              <Users size={20} />
              {isOpen && <span className="font-medium">Meet the Developers</span>}
            </div>
          </motion.div>
        </nav>

        {/* Decorative background */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-40 bg-blue-700/30 blur-3xl rounded-t-full"
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 p-6 bg-slate-100 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-900">
          {children}
        </h1>
      </div>
    </div>
  );
};
