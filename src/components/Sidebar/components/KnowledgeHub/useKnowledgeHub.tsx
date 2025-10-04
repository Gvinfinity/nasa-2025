import { useCallback, useState } from "react";
import { WhatAreSharks } from "./Stories/WhatAreSharks/WhatAreSharks";
import { SharkLivesMatter } from "./Stories/SharkLivesMatter/SharkLivesMatter";
import { SharksFoodChain } from "./Stories/SharksFoodChain/SharksFoodChain";
import { ForagingHabitat } from "./Stories/ForagingHabitat/ForagingHabitat";

export const useKnowledgeHub = (
  setChildren: (component: React.ReactNode) => void
) => {
  const [openMenu, setOpenMenu] = useState(false);

  const [knowledgeOptions, setKnowledgeOptions] = useState([
    { name: "What are Sharks", icon: "🦈", selected: false },
    { name: "Shark Lives Matter", icon: "❤️", selected: false },
    { name: "Sharks in the Food Chain", icon: "🍽️", selected: false },
    { name: "Foraging Habitat", icon: "🏠", selected: false },
    { name: "Sharks are in Danger", icon: "⚠️", selected: false },
  ]);

  const handleStoriesClick = useCallback(() => {
    setOpenMenu(!openMenu);
  }, [openMenu]);

  const handleItemClick = useCallback(
    (i: number) => {
      const selectedOption = knowledgeOptions[i];
      console.log(`${selectedOption.name} button clicked`);

      // Set the appropriate component based on the selected option
      switch (selectedOption.name) {
        case "What are Sharks":
          setChildren(<WhatAreSharks />);
          break;
        case "Shark Lives Matter":
          setChildren(<SharkLivesMatter />);
          break;
        case "Sharks in the Food Chain":
          setChildren(<SharksFoodChain />);
          break;
        case "Foraging Habitat":
          setChildren(<ForagingHabitat />);
          break;
        case "Sharks are in Danger":
          setChildren(<SharkLivesMatter />); // Placeholder, replace with actual component
          break;
        default:
          setChildren(<div>Default Component</div>);
      }

      setKnowledgeOptions((prev) =>
        prev.map((option, index) => ({
          ...option,
          selected: index === i,
        }))
      );
    },
    [ knowledgeOptions, setChildren]
  );

  return {
    handleStoriesClick,
    handleItemClick,
    openMenu,
    knowledgeOptions,
  };
};
