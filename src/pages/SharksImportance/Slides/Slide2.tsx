import React from "react";
import { motion } from "framer-motion";
import Background from "../../../components/Background";
import { Button } from "../../../components/Button";
import TextWithSpeech from "../../../components/Sidebar/components/TextWithSpeech";
import { useSliderProvider } from "../../../contexts/SliderContext";

const Slide2: React.FC = () => {
  const { prevSlide, nextSlide } = useSliderProvider();

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col justify-between items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Background />
      <div className="relative z-10 h-full justify-center flex flex-col items-center text-center px-8 ">
        <motion.p
          className="text-blue-100 text-lg md:text-xl mt-6 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >

          <motion.img
            src="/path/to/your/image.jpg"
            alt="Sharks in ocean"
            className="w-64 h-48 object-cover rounded-lg mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <TextWithSpeech
            text="In the deep blue, sharks keep the ocean in balance — vital to
          ecosystems, silent guardians of marine life."
          />
        </motion.p>
      </div>
      {/* Navigation buttons */}
      <div className="bottom-8 left-0 right-0 flex w-full justify-between px-8 z-20 mb-8">
        <Button onClick={prevSlide}>Back</Button>
        <Button onClick={nextSlide}>Next</Button>
      </div>
    </motion.div>
  );
};
export default Slide2;
