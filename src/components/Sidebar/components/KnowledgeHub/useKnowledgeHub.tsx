import { useCallback, useState } from "react";
import { WhatAreSharks } from "./Stories/WhatAreSharks/WhatAreSharks";
import { SharkLivesMatter } from "./Stories/SharkLivesMatter/SharkLivesMatter";
import { SharksFoodChain } from "./Stories/SharksFoodChain/SharksFoodChain";

export const useKnowledgeHub = (
  setChildren: (component: React.ReactNode) => void
) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [knowledgeOptions, setKnowledgeOptions] = useState([
    {
      name: "What are Sharks",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg",
      description: "Learn about shark biology, behavior, and characteristics.",
      selected: false,
    },
    {
      name: "Shark Lives Matter",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/f/f8/Carcharodon_carcharias_-_great_white_shark.jpg",
      description: "Discover the importance of shark conservation efforts.",
      selected: false,
    },
    {
      name: "Sharks in the Food Chain",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Reef_shark.jpg",
      description: "Explore sharks' crucial role in marine ecosystems.",
      selected: false,
    },
    {
      name: "Sharks are in Danger",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/9/9e/Hammerhead_shark.jpg",
      description: "Learn about threats facing shark populations worldwide.",
      selected: false,
    },
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
    [knowledgeOptions, setChildren]
  );

  return {
    handleStoriesClick,
    handleItemClick,
    openMenu,
    knowledgeOptions,
  };
};
