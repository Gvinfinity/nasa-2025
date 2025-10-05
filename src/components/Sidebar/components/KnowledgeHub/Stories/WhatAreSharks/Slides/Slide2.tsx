import React from "react";
import { motion } from "framer-motion";
import Background from "../../../../../../Background";
import { Button } from "../../../../../../Button";
import TextWithSpeech from "../../../../TextWithSpeech";
import { useSliderProvider } from "../../../../../../../contexts/SliderContext";
import Tooltip from "../../../../Tooltip";

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
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Whale_shark_Georgia_aquarium.jpg/1920px-Whale_shark_Georgia_aquarium.jpg"
            alt="Shark"
            className="mt-12 mb-8 h-64 md:h-80 object-cover rounded-lg shadow-lg mt-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          <TextWithSpeech
            textToRead="Sharks are a highly diverse group, comprising more than 500 species. They belong to the class Chondrichthyes, a group of fishes characterized by skeletons made primarily of cartilage. This class is divided into two subclasses: Elasmobranchii which includes sharks, skates, rays, and sawfishes and Holocephali, chimaeras, known informally as ghost sharks."
            textToShow={
              <>
                Sharks are a highly diverse group, comprising more than 500
                species. They belong to the class Chondrichthyes, a group of
                fishes characterized by skeletons made primarily of cartilage.
                This class is divided into two subclasses:{" "}
                <Tooltip
                  title="Elasmobranchii"
                  contents={[
                    {
                      image: undefined,
                      text: "Examples of animals that belong to the subclass *Elasmobranchii*, besides sharks, include rays, skates, and sawfishes.",
                    },
                    {
                      image:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Raya_pel%C3%A1gica_%28Pteroplatytrygon_violacea%29%2C_Cabo_de_Palos%2C_Espa%C3%B1a%2C_2022-07-16%2C_DD_69.jpg/1920px-Raya_pel%C3%A1gica_%28Pteroplatytrygon_violacea%29%2C_Cabo_de_Palos%2C_Espa%C3%B1a%2C_2022-07-16%2C_DD_69.jpg",
                      text: "Rays are the largest group of cartilaginous fishes, with around 600 known species. Most of them live on the sea floor, although some inhabit the open ocean, and a few species can also be found in freshwater environments.",
                    },
                    {
                      image:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Amblyraja_hyperborea1.jpg/960px-Amblyraja_hyperborea1.jpg",
                      text: "Skates comprise about 150 species. They possess an electric organ in their tails that produces a weak shock, which researchers believe may play a role in reproduction.",
                    },
                    {
                      image:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Sawfish_Pristis_zijsron_Genova_Aquarium.jpg/1024px-Sawfish_Pristis_zijsron_Genova_Aquarium.jpg",
                      text: "Sawfishes are a distinct group of cartilaginous fishes, characterized by a long snout lined with sharp teeth. Today, only five species remain, and all of them are critically endangered due to human activities.",
                    },
                  ]}
                >
                  Elasmobranchii
                </Tooltip>
                (which includes sharks, skates, rays, and sawfishes) and{" "}
                <Tooltip
                  title="Holocephali"
                  contents={[
                    {
                      image:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Deep_sea_chimaera.jpg/330px-Deep_sea_chimaera.jpg",
                      text: "Chimaeras are the only living representatives of the subclass *Holocephali*. Their lineage dates back nearly 400 million years. Today, about 50 species are known. They are characterized by bulky heads, long tapered tails, and can reach lengths of up to 150 cm. Chimaeras inhabit deep environments, often found at depths greater than 2,000 meters.",
                    },
                  ]}
                >
                  Holocephali
                </Tooltip>{" "}
                (chimaeras, known informally as ghost sharks).
              </>
            }
          />
        </motion.p>
      </div>
      {/* Navigation buttons */}
      <div className="absolute bottom-8 right-8 flex justify-end z-20">
        <Button onClick={nextSlide}>Next</Button>
      </div>
    </motion.div>
  );
};
export default Slide2;
