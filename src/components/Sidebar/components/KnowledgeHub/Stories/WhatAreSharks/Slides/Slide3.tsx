import React from "react";
import { motion } from "framer-motion";
import Background from "../../../../../../Background";
import { Button } from "../../../../../../Button";
import TextWithSpeech from "../../../../TextWithSpeech";
import { useSliderProvider } from "../../../../../../../contexts/SliderContext";
import Tooltip from "../../../../Tooltip";
import { useSidebarContext } from "../../../../../Sidebar";
import { StoriesMenu } from "../../StoriesMenu";

const Slide3: React.FC = () => {
  const { prevSlide } = useSliderProvider();
  const { setCustomComponent } = useSidebarContext();

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
            src="https://freerangestock.com/sample/130101/shark-in-sea.jpg"
            alt="Sharks in ocean"
            className="w-full h-80 object-cover rounded-lg mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <TextWithSpeech
            textToRead="Sharks inhabit a wide variety of environments, ranging from marine to freshwater ecosystems. Although they are often perceived as apex predators, their ecological diversity is much broader. Adult body sizes range from about 20 cm to over 18 m, allowing them to occupy distinct ecological niches. Consequently, their feeding strategies vary widely: some species are parasites, others are small predators feeding on invertebrates, while the largest species prey on marine mammals and large fishes."
            textToShow={
              <>
                Sharks inhabit a wide variety of environments, ranging from
                marine to freshwater ecosystems. Although they are often
                perceived as apex predators, their ecological diversity is much
                broader. Adult body sizes range from about 20 cm to over 18 m,
                allowing them to occupy distinct{" "}
                <Tooltip
                  title="Ecological Niches"
                  contents={[
                    {
                      image:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Ifugao_-_2.jpg/1920px-Ifugao_-_2.jpg",
                      text: "An ecological niche is defined as the set of roles and functions a species performs within its environment. It involves the interaction of abiotic conditions, ecological relationships, and the species' role, encompassing its distribution, sources of resources, and contributions to biodiversity and ecological stability.",
                    },
                  ]}
                >
                  ecological niches
                </Tooltip>
                . Consequently, their feeding strategies vary widely: some
                species are parasites, others are small predators feeding on
                invertebrates, while the largest species prey on marine mammals
                and large fishes.
              </>
            }
          />
        </motion.p>
      </div>
      {/* Navigation buttons */}
      <div className="bottom-8 left-0 right-0 flex w-full justify-between px-8 z-20 mb-8">
        <Button onClick={prevSlide}>Back</Button>
        <Button onClick={() => setCustomComponent(<StoriesMenu />)}>
          Return to Menu
        </Button>
      </div>
    </motion.div>
  );
};
export default Slide3;
