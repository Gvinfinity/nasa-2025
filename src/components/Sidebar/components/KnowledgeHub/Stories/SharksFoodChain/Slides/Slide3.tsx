import React from "react";
import { motion } from "framer-motion";
import Background from "../../../../../../Background";
import { Button } from "../../../../../../Button";
import TextWithSpeech from "../../../../TextWithSpeech";
import { useSliderProvider } from "../../../../../../../contexts/SliderContext";
import { useSidebarContext } from "../../../../../Sidebar";
import { StoriesMenu } from "../../StoriesMenu";

const Slide3: React.FC = () => {
  const { prevSlide } = useSliderProvider();
  const { setCustomComponent } = useSidebarContext();

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
            src="https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg"
            alt="Sharks in ocean"
            className="w-full h-72 object-cover rounded-lg mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <TextWithSpeech textToRead="Apex predators are animals that have no natural predators and occupy the highest position in the trophic chain. A well-known example is the great white shark (Carcharodon carcharias). By keeping populations of lower trophic levels under control (a process known as top-down regulation), apex predators prevent excessive population growth and thus contribute to maintaining ecological balance." />
        </motion.p>
      </div>
      {/* Navigation buttons */}
      <div className="bottom-8 left-0 right-0 flex w-full justify-end px-8 z-20 mb-8">
        <Button onClick={prevSlide}>Back</Button>
        <Button onClick={() => setCustomComponent(<StoriesMenu />)}>
          Return to Menu
        </Button>
      </div>
    </motion.div>
  );
};
export default Slide3;
