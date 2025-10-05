import React from "react";
import { motion } from "framer-motion";
import Background from "../../../../../../Background";
import { Button } from "../../../../../../Button";
import TextWithSpeech from "../../../../TextWithSpeech";
import { useSliderProvider } from "../../../../../../../contexts/SliderContext";

const Slide2: React.FC = () => {
  const { nextSlide } = useSliderProvider();

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col justify-between items-center overflow-auto"
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
            src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Male_whale_shark_at_Georgia_Aquarium.jpg"
            alt="Sharks in ocean"
            className="w-full  h-64 object-cover rounded-lg mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <TextWithSpeech textToRead="According to the International Union for Conservation of Nature (IUCN) Red List, approximately 31% of the 536 shark species worldwide are threatened with extinction, along with 60% of coral reef–associated sharks and rays. Given the crucial role of sharks in aquatic ecosystems, their conservation and preservation are essential for maintaining ecosystem balance and proper functioning." />
        </motion.p>
      </div>
      {/* Navigation buttons */}
      <div className="bottom-8 left-0 right-0 flex w-full justify-end px-8 z-20 mb-8">
        <Button onClick={nextSlide}>Next</Button>
      </div>
    </motion.div>
  );
};
export default Slide2;
