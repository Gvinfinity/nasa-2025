import React from "react";
import { motion } from "framer-motion";
import Background from "../../../../../../Background";
import { Button } from "../../../../../../Button";
import { useSliderProvider } from "../../../../../../../contexts/SliderContext";

const Slide1: React.FC = () => {
  const { nextSlide } = useSliderProvider();

  return (
    <motion.div
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Background />

      {/* 🐋 Text + Button Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.h1
          className="text-white text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(0,100,255,0.3)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          What are Sharks?
        </motion.h1>

        <motion.img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Whale_shark_Georgia_aquarium.jpg/1920px-Whale_shark_Georgia_aquarium.jpg"
          alt="Shark"
          className="mt-12 mb-8 h-64 md:h-80 object-cover rounded-lg shadow-lg mt-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        <motion.p
          className="text-blue-100 text-lg md:text-xl mt-4 mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
         {/* TODO - DESCRIPTION */}
        </motion.p>
        <br />

        <Button onClick={nextSlide}>Start</Button>
      </div>
    </motion.div>
  );
};

export default Slide1;
