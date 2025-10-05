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
        className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-slate-800/60 transition-colors"
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
                      ? "bg-amber-600 border-amber-500 text-white shadow-lg"
                      : "bg-slate-800/50 border-slate-700 text-neutral-100 hover:bg-slate-700/60"
                  }
                `}
              >
                {/* Left book spine */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    opt.selected ? "bg-amber-400" : "bg-slate-600"
                  }`}
                />

                {/* Icon */}
                {opt.icon && (
                  <span
                    className={`text-3xl mb-2 ${
                      opt.selected ? "text-white" : "text-amber-200"
                    }`}
                  >
                    {opt.icon}
                  </span>
                )}

                {/* Title */}
                <span
                  className={`text-sm font-medium tracking-wide text-center ${
                    opt.selected ? "text-white" : "text-neutral-100/90"
                  }`}
                >
                  {opt.name}
                </span>

                {/* Selection dot */}
                {opt.selected && (
                  <motion.div
                    layoutId="selectedIndicator"
                    className="absolute bottom-2 right-3 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-inner"
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
