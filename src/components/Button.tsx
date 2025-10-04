import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <motion.button
      onClick={onClick}
      className="px-8 py-3 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/40 text-blue-100 font-semibold text-lg hover:bg-blue-500/30 hover:scale-105 transition-all shadow-lg shadow-blue-900/40"
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1.8,
        delay: 1,
        repeat: Infinity,
        repeatType: "mirror",
      }}
    >
      {children}
    </motion.button>
  );
};
