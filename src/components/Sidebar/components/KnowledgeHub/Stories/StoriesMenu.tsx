import React from "react";
import { motion } from "framer-motion";
import { useKnowledgeHub } from "../useKnowledgeHub";
import Background from "../../../../Background";
import { BookOpen, Globe2, Waves, AlertTriangle } from "lucide-react"; // icons
import { useSidebarContext } from "../../../Sidebar";

// type StoriesMenuProp = {
//   setChildren: (component: React.ReactNode) => void;
// };

export const StoriesMenu: React.FC = () => {
  const { setCustomComponent } = useSidebarContext();

  const { handleItemClick, knowledgeOptions } = useKnowledgeHub(setCustomComponent);

  // Icon mapping
  const icons = [BookOpen, Globe2, Waves, AlertTriangle];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background />
      <div className="relative z-10 flex-1 p-10 flex flex-col">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-4xl font-bold text-center m-8 bg-gradient-to-r from-blue-100 via-white/80 to-teal-200 bg-clip-text text-transparent drop-shadow-xl"
        >
          What would you like to explore?
        </motion.h2>

        {/* Cards Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {knowledgeOptions.map((story, i) => {
              const Icon = icons[i % icons.length]; // pick icon by index
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() => handleItemClick(i)}
                  className={`
                    relative cursor-pointer group overflow-hidden
                    rounded-2xl border backdrop-blur-md
                    transition-all duration-500 ease-out shadow-lg flex
                    min-h-[220px]
                    ${
                      story.selected
                        ? "bg-cyan-500/20 border-cyan-300/40 shadow-cyan-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  {/* Image */}
                  <motion.div className="w-1/2 h-full overflow-hidden">
                    <motion.img
                      src={story.image || "/placeholder.jpg"}
                      alt={story.name}
                      className="object-cover w-full h-full brightness-75 group-hover:brightness-100 transition-all duration-700 ease-out"
                      whileHover={{ scale: 1.1 }}
                    />
                  </motion.div>

                  {/* Text Section */}
                  <div className="w-1/2 p-6 flex flex-col justify-center">
                    <Icon className="w-8 h-8 text-cyan-300 mb-3 transition-all duration-300 group-hover:scale-110" />
                    <motion.h3
                      className="text-xl font-semibold text-white mb-2"
                      whileHover={{ color: "#A5F3FC" }}
                    >
                      {story.name}
                    </motion.h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {story.description ||
                        "Dive into fascinating data stories about the deep sea, marine life, and more."}
                    </p>
                  </div>

                  {/* Selection Glow */}
                  {story.selected && (
                    <motion.div
                      layoutId="selectedStoryGlow"
                      className="absolute inset-0 rounded-2xl border-2 border-cyan-300/60 shadow-[0_0_25px_rgba(34,211,238,0.3)] pointer-events-none"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
