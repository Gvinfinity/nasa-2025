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
            src="https://upload.wikimedia.org/wikipedia/commons/3/39/Tiger_shark.jpg"
            alt="Sharks in ocean"
            className="w-full h-56 object-cover rounded-lg mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <TextWithSpeech textToRead="Beyond movies and folklore, sharks are vital actors in oceanic ecosystems. Some of these species, such as the Great White Shark and the Tiger Shark, are apex predators that play a crucial role as keystone species. A keystone species is define as an organism that has a disproportionately large effect on its environment relative to its abundance, essentially holding an ecosystem together. In other words, even with relatively low populations compared to other animals, keystone species play a critical role in regulating the populations of other species. Their disappearance can trigger a collapse in the food chain, causing significant imbalances in the ecosystem." />
        </motion.p>
      </div>
      <div className="absolute bottom-8 right-8 flex justify-end z-20">
        <Button onClick={nextSlide}>Next</Button>
      </div>
    </motion.div>
  );
};
export default Slide2;
