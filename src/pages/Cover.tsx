import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.svg";

const Cover: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 🌊 Deep Ocean Animated Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#00111F] via-[#003B5C] to-[#005C99]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* 💨 Moving Light Rays (simulate sunlight underwater) */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.12)_0%,transparent_70%)]"
        animate={{
          opacity: [0.4, 0.6, 0.4],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 🏷️ Developers Logo */}
      <motion.div
        className="absolute top-8 left-8 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <img src={logo} alt="Developers Logo" className="h-12 w-auto" />
      </motion.div>

      {/* 🫧 Floating Bubbles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-100 rounded-full opacity-20 blur-sm"
          style={{
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0.05, 0.3, 0.05],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🦈 Shark Shadow Swimming */}
      <motion.div
        className="absolute top-1/3 left-[-20%] w-[200px] h-[80px] bg-[url('/shark-silhouette.png')] bg-no-repeat bg-contain opacity-20"
        animate={{
          x: ["-20%", "120%"],
          y: [0, 10, -10, 0],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "blur(2px)",
        }}
      />

      {/* 💎 Content */}
      <div className="relative z-10 text-center text-white px-6">
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          Shark Explorer
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          Dive into the data that drives the oceans.  
          Explore temperature, salinity, and shark migration like never before.
        </motion.p>

        <motion.button
          className="relative px-10 py-4 text-xl font-semibold rounded-full overflow-hidden text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 30px rgba(56,189,248,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Start Exploring</span>
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0"
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default Cover;
