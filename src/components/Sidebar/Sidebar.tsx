import React, { useState, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sharkmap } from "./components/Sharkmap";
import { KnowledgeHub } from "./components/KnowledgeHub/KnowledgeHub";
import { PredictSharkMovement } from "./components/PredictSharkMovement";
import { Tutorial } from "./components/Tutorial";
import { MeetTheTeam } from "./components/MeetTheDevelopers";

interface SidebarProps {
  children?: React.ReactNode;
}

type OpenTabKey = "knowledgehub" | "sharkmap" | "predict" | "meet" | null;

export const SidebarContext = createContext<{
  openTab: (key: OpenTabKey) => void;
}>({ openTab: () => {} });

export const Sidebar = ({ children }: SidebarProps) => {
  const [mapMode, setMapMode] = useState<"research" | "student">("research");
  const [enabled, setEnabled] = useState<boolean>(false);

  const injectedChildren = (children as any)
    ? React.Children.map(children as any, (child: any) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { mapMode, enabled, setEnabled } as any)
          : child
      )
    : children;

  const [childrenSaved, setChildren] = useState<React.ReactNode | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<OpenTabKey>(null);

  const openTab = (key: OpenTabKey) => {
    console.debug("[Sidebar] openTab", key);
    // knowledgehub is a special case that renders into the main content area
    if (key === "knowledgehub") {
      setChildren(<KnowledgeHub setChildren={setChildren} />);
    } else {
      // other tabs keep the main content unchanged; we only record the active sidebar tab
      setChildren(null);
    }
    setActiveSidebarTab(key);
  };

  return (
    <SidebarContext.Provider value={{ openTab }}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col items-start p-4 shadow-2xl relative overflow-hidden overflow-y-auto">
            <div className="flex flex-row h-fit justify-center items-center gap-3">
            <img src="/public/sharko.png" alt="Sharko, the Shark Seet" className="w-20 h-20 self-center" />
            <h1 className="font-bold text-3xl bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.3)] flex items-center h-14">
              Shark Seer
            </h1>
            </div>
          <nav className="flex flex-col gap-3 w-full text-sm mt-6">
            <div onClick={() => setChildren(null)}>
              <Sharkmap
                setMapMode={setMapMode}
                enabled={enabled}
                setEnabled={setEnabled}
                forcedOpen={activeSidebarTab === "sharkmap"}
              />
            </div>
            <KnowledgeHub setChildren={setChildren} />
            <div onClick={() => setChildren(null)}>
              <PredictSharkMovement />
            </div>
            <div onClick={() => setChildren(null)}>
              <Tutorial />
            </div>
            <div onClick={() => setChildren(null)}>
              <MeetTheTeam />
            </div>
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
              key={childrenSaved ? "panel-custom" : "panel-default"}
              className="w-full h-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {childrenSaved ?? injectedChildren}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};
