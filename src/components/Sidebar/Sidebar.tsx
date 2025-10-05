import React, { useState, createContext, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sharkmap } from "./components/Sharkmap";
import { KnowledgeHub } from "./components/KnowledgeHub/KnowledgeHub";
import { PredictSharkMovement } from "./components/PredictSharkMovement";
import { Tutorial } from "./components/Tutorial";
import { MeetTheTeam } from "./components/MeetTheDevelopers";
import { WhatAreSharks } from "./components/KnowledgeHub/Stories/WhatAreSharks/WhatAreSharks";
import { SharksFoodChain } from "./components/KnowledgeHub/Stories/SharksFoodChain/SharksFoodChain";
import { SharksImportance } from "./components/KnowledgeHub/Stories/SharksImportance/SharksImportance";
import { SharksInDanger } from "./components/KnowledgeHub/Stories/SharksInDanger/SharksInDanger";
import MapLatitude from "../maps/LatitudeMap";
import { PredictSharkMovements } from "../../pages/PredictSharkMovement/PredictSharkMovementPage";
import { ModelInfo } from "../../pages/PredictSharkMovement/components/ModelInfo";
import { TagInfo } from "../../pages/PredictSharkMovement/components/TagInfo";

interface SidebarProps {
  children?: React.ReactNode;
}

export type SidebarItemKey =
  | "sharkmap"
  | "knowledgehub-menu"
  | "tutorial"
  | "meet-the-team"
  | "prediction-menu"
  | "model-info-story"
  | "tag-info-story"
  | "what-are-sharks-story"
  | "sharks-importance-story"
  | "sharks-food-chain-story"
  | "sharks-in-danger-story"
  | null;

export interface KnowledgeOption {
  name: string;
  image: string;
  description: string;
  selected: boolean;
}

interface SidebarState {
  currentItem: SidebarItemKey;
  currentComponent: React.ReactNode;
  history: SidebarItemKey[];
  visitedItems: Set<SidebarItemKey>;
  mapMode: "research" | "student";
  enabled: boolean;
}

interface SidebarContextType {
  // Current state
  currentItem: SidebarItemKey;
  currentComponent: React.ReactNode;
  visitedItems: Set<SidebarItemKey>;
  mapMode: "research" | "student";
  enabled: boolean;

  // Navigation methods
  navigateTo: (item: SidebarItemKey) => void;
  goBack: () => void;
  canGoBack: boolean;

  // Utility methods
  isItemVisited: (item: SidebarItemKey) => boolean;
  getUnvisitedItems: () => SidebarItemKey[];
  resetNavigation: () => void;

  // Component setters (for nested navigation like KnowledgeHub)
  setCustomComponent: (component: React.ReactNode) => void;

  // Map state setters
  setMapMode: (mode: "research" | "student") => void;
  setEnabled: (enabled: boolean) => void;

  // Knowledge Hub state and methods
  knowledgeHubOpenMenu: boolean;
  knowledgeOptions: KnowledgeOption[];
  handleKnowledgeHubStoriesClick: () => void;
  handleKnowledgeHubItemClick: (index: number) => void;

  // Legacy method for backward compatibility
  openTab: (key: string) => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const Sidebar = ({ children }: SidebarProps) => {
  const [state, setState] = useState<SidebarState>({
    currentItem: null,
    currentComponent: children || null,
    history: [],
    visitedItems: new Set(),
    mapMode: "research",
    enabled: false,
  });

  // Knowledge Hub state
  const [knowledgeHubOpenMenu, setKnowledgeHubOpenMenu] = useState(false);
  const [knowledgeOptions] = useState<KnowledgeOption[]>([
    {
      name: "What are Sharks",
      image: "/src/assets/shark1.png",
      description: "Learn about shark biology and characteristics",
      selected: false,
    },
    {
      name: "Importance of Sharks",
      image: "/src/assets/shark2.png",
      description: "Discover why sharks are keystone species",
      selected: false,
    },
    {
      name: "Sharks in the Food Chain",
      image: "/src/assets/shark3.png",
      description: "Understand sharks' role in marine ecosystems",
      selected: false,
    },
    {
      name: "Sharks are in Danger",
      image: "/src/assets/shark4.png",
      description: "Learn about threats facing shark populations",
      selected: false,
    },
  ]);

  const setCustomComponent = useCallback((component: React.ReactNode) => {
    setState((prevState) => ({
      ...prevState,
      currentComponent: component,
    }));
  }, []);

  const getComponentForItem = useCallback(
    (item: SidebarItemKey): React.ReactNode => {
      switch (item) {
        case "sharkmap":
          return <MapLatitude />;
        case "knowledgehub-menu":
          return <KnowledgeHub setChildren={setCustomComponent} />;
        case "prediction-menu":
          return <PredictSharkMovements />;
        case "model-info-story":
          return <ModelInfo />;
        case "tag-info-story":
          return <TagInfo />;
        case "tutorial":
          return <Tutorial />;
        case "meet-the-team":
          return <MeetTheTeam />;
        case "what-are-sharks-story":
          return <WhatAreSharks />;
        case "sharks-importance-story":
          return <SharksImportance />;
        case "sharks-food-chain-story":
          return <SharksFoodChain />;
        case "sharks-in-danger-story":
          return <SharksInDanger />;
        default:
          return children || null;
      }
    },
    [children, setCustomComponent]
  );

  const navigateTo = useCallback(
    (item: SidebarItemKey) => {
      setState((prevState) => {
        const newHistory = prevState.currentItem
          ? [...prevState.history, prevState.currentItem]
          : prevState.history;

        const newVisitedItems = new Set(prevState.visitedItems);
        if (item) {
          newVisitedItems.add(item);
        }

        return {
          ...prevState,
          currentItem: item,
          currentComponent: getComponentForItem(item),
          history: newHistory,
          visitedItems: newVisitedItems,
        };
      });
    },
    [getComponentForItem]
  );

  const handleKnowledgeHubStoriesClick = useCallback(() => {
    setKnowledgeHubOpenMenu(!knowledgeHubOpenMenu);
  }, [knowledgeHubOpenMenu]);

  const handleKnowledgeHubItemClick = useCallback(
    (index: number) => {
      const storyKeys: SidebarItemKey[] = [
        "what-are-sharks-story",
        "sharks-importance-story",
        "sharks-food-chain-story",
        "sharks-in-danger-story",
      ];

      if (index < storyKeys.length) {
        navigateTo(storyKeys[index]);
      }
    },
    [navigateTo]
  );

  const goBack = useCallback(() => {
    setState((prevState) => {
      if (prevState.history.length === 0) {
        return prevState;
      }

      const previousItem = prevState.history[prevState.history.length - 1];
      const newHistory = prevState.history.slice(0, -1);

      return {
        ...prevState,
        currentItem: previousItem,
        currentComponent: getComponentForItem(previousItem),
        history: newHistory,
      };
    });
  }, [getComponentForItem]);

  const canGoBack = state.history.length > 0;

  const isItemVisited = useCallback(
    (item: SidebarItemKey): boolean => {
      return state.visitedItems.has(item);
    },
    [state.visitedItems]
  );

  const getUnvisitedItems = useCallback((): SidebarItemKey[] => {
    const allItems: SidebarItemKey[] = [
      "sharkmap",
      "knowledgehub-menu",
      "prediction-menu",
      "model-info-story",
      "tag-info-story",
      "tutorial",
      "meet-the-team",
      "what-are-sharks-story",
      "sharks-importance-story",
      "sharks-food-chain-story",
      "sharks-in-danger-story",
    ];
    return allItems.filter((item) => !state.visitedItems.has(item));
  }, [state.visitedItems]);

  const setMapModeCallback = useCallback((mode: "research" | "student") => {
    setState((prevState) => ({
      ...prevState,
      mapMode: mode,
    }));
  }, []);

  const setEnabledCallback = useCallback((enabled: boolean) => {
    setState((prevState) => ({
      ...prevState,
      enabled,
    }));
  }, []);

  const resetNavigation = useCallback(() => {
    setState({
      currentItem: null,
      currentComponent: children || null,
      history: [],
      visitedItems: new Set(),
      mapMode: "research",
      enabled: false,
    });
  }, [children]);

  // Legacy openTab method for backward compatibility
  const openTab = useCallback(
    (key: string) => {
      console.debug("[Sidebar] openTab", key);
      // Map legacy keys to new keys
      const keyMapping: Record<string, SidebarItemKey> = {
        knowledgehub: "knowledgehub-menu",
        sharkmap: "sharkmap",
        predict: "prediction-menu",
        meet: "meet-the-team",
        tutorial: "tutorial",
      };

      const mappedKey = keyMapping[key] || null;
      navigateTo(mappedKey);
    },
    [navigateTo]
  );

  const contextValue: SidebarContextType = {
    currentItem: state.currentItem,
    currentComponent: state.currentComponent,
    visitedItems: state.visitedItems,
    mapMode: state.mapMode,
    enabled: state.enabled,
    navigateTo,
    goBack,
    canGoBack,
    isItemVisited,
    getUnvisitedItems,
    resetNavigation,
    setCustomComponent,
    setMapMode: setMapModeCallback,
    setEnabled: setEnabledCallback,
    knowledgeHubOpenMenu,
    knowledgeOptions,
    handleKnowledgeHubStoriesClick,
    handleKnowledgeHubItemClick,
    openTab,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col items-start p-4 shadow-2xl relative overflow-hidden overflow-y-auto">
          <div className="flex items-center justify-center gap-3 h-fit">
            <img
              src="/public/sharko.png"
              alt="Sharko, the Shark Seer"
              className="w-20 h-20"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              Shark Seer
            </h1>
          </div>
          <nav className="flex flex-col gap-3 w-full mt-6">
            <a onClick={() => navigateTo("sharkmap")}>
              <Sharkmap
                setMapMode={setMapModeCallback}
                forcedOpen={state.currentItem === "sharkmap"}
              />
            </a>
            <KnowledgeHub />
            <PredictSharkMovement />
            <Tutorial />
            <MeetTheTeam />
          </nav>

          {/* Decorative background */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-40 bg-blue-700/30 blur-3xl rounded-t-full pointer-events-none"
            animate={{ y: [0, -10, 0], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 bg-black min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentComponent ? "panel-custom" : "panel-default"}
              className="w-full h-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {state.currentComponent ?? children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a Sidebar component"
    );
  }
  return context;
};
