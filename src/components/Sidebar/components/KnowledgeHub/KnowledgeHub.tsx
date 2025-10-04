import { BookOpen, ChevronDown } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKnowledgeHub } from "./useKnowledgeHub.tsx";

type KnowledgeHubProps = {
  setChildren: (component: React.ReactNode) => void;
};

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ setChildren }) => {
  const { handleStoriesClick, handleItemClick, openMenu, knowledgeOptions } =
    useKnowledgeHub(setChildren);

  const subItemVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Button */}
      <button
        onClick={handleStoriesClick}
        className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-blue-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={22} className="text-neutral-100" />
          <span className="font-semibold text-neutral-100 tracking-wide">
            Knowledge Hub
          </span>
        </div>
        <motion.div
          animate={{ rotate: openMenu ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} className="text-neutral-400" />
        </motion.div>
      </button>

      {/* Suboptions Grid */}
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
            transition={{ duration: 0.35 }}
            className="ml-4 mt-4 grid grid-cols-1 gap-3 overflow-hidden"
          >
            {knowledgeOptions.map((opt, i) => (
              <motion.li
                key={i}
                variants={subItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.05 }}
                onClick={() => handleItemClick(i)}
                className={`
                  relative cursor-pointer overflow-hidden
                  flex flex-col items-center justify-center
                  p-5 rounded-xl border backdrop-blur-sm
                  transition-colors duration-300 shadow-md
                  ${
                    opt.selected
                      ? "bg-gradient-to-br from-amber-400/70 to-yellow-300/40 border-yellow-400 text-neutral-900 shadow-lg shadow-yellow-500/20"
                      : "bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border-neutral-700 text-neutral-100 hover:from-neutral-800/60 hover:to-neutral-700/40"
                  }
                `}
              >
                {/* Left book spine */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    opt.selected ? "bg-yellow-300/70" : "bg-neutral-700/50"
                  }`}
                />

                {/* Page light reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>

                {/* Icon */}
                {opt.icon && (
                  <span
                    className={`text-3xl mb-2 ${
                      opt.selected ? "text-yellow-900" : "text-amber-200"
                    }`}
                  >
                    {opt.icon}
                  </span>
                )}

                {/* Title */}
                <span
                  className={`text-sm font-medium tracking-wide text-center ${
                    opt.selected ? "text-yellow-950" : "text-neutral-100/90"
                  }`}
                >
                  {opt.name}
                </span>

                {/* Selection dot */}
                {opt.selected && (
                  <motion.div
                    layoutId="selectedIndicator"
                    className="absolute bottom-2 right-3 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-inner"
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
