import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithSpeech from "./TextWithSpeech";

type content = {
  image?: string;
  text?: string;
}

interface TooltipProps {
  title?: string;
  contents?: content[];
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ title, contents, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-block cursor-pointer text-blue-300 font-semibold hover:text-blue-100 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-0 mb-3 z-50 w-72 bg-white/10 backdrop-blur-md border border-blue-400/30 rounded-xl shadow-[0_0_25px_rgba(0,100,255,0.2)] p-3 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: 10, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, x: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {title && (
              <h3 className="text-blue-200 font-semibold text-base mb-3">
                {title}
              </h3>
            )}

            {contents?.map((content, index) => (
              <div key={index} className="mb-3 last:mb-0">
                {content.image && (
                  <motion.img
                    src={content.image}
                    alt="tooltip visual"
                    className="w-full object-cover rounded-lg mb-2"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {content.text && (
                  <TextWithSpeech
                    textToRead={content.text}
                    textToShow={content.text}
                    hasBackground={false}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;
