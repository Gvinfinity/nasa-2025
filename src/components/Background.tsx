
import React from "react";
import { motion } from "framer-motion";

const Background: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 overflow-hidden">
      {/* 🌊 Deep Ocean Animated Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#00111F] via-[#002B44] to-[#004B70] animate-gradient-move"
        style={{
          backgroundSize: "400% 400%",
          filter: "brightness(0.9)",
        }}
      />

      {/* 💫 Floating Bubbles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-200 rounded-full opacity-10 blur-sm"
          style={{
            width: Math.random() * 6 + 4,
            height: Math.random() * 6 + 4,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0.05, 0.3, 0.05],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

export default Background;