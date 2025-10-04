import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sharkmap } from "./components/Sharkmap";
import { KnowledgeHub } from "./components/KnowledgeHub/KnowledgeHub";
import { WhichSharkAreYou } from "./components/WhichSharkAreYou";
import { PredictSharkMovement } from "./components/PredictSharkMovement";
import { NasaDataUsed } from "./components/NasaDataUsed";
import { MeetTheDevelopers } from "./components/MeetTheDevelopers";

interface SidebarProps {
  childrenProp?: React.ReactNode;
}

export const Sidebar = ({ childrenProp }: SidebarProps) => {
  // map mode lives in the Sidebar and is injected into child map components
  const [mapMode, setMapMode] = useState<"research" | "student">("research");
  // selectedView control will use the PaletteContext via Sharkmap and other components;
  // Sidebar also exposes a small control here to let users switch the active view.
  // We'll clone children and inject `mapMode` so MapLatitude can read it as a prop.

  const injectedChildren = (childrenProp as any)
    ? React.Children.map(childrenProp as any, (child: any) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { mapMode } as any)
          : child
      )
    : childrenProp;

  const [children, setChildren] = useState(injectedChildren);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col items-start p-4 shadow-2xl relative overflow-hidden">
        <nav className="flex flex-col gap-3 w-full text-sm mt-6">
          <Sharkmap />
          <KnowledgeHub setChildren={setChildren} />
          <WhichSharkAreYou />
          <PredictSharkMovement />
          <NasaDataUsed />
          <MeetTheDevelopers />
        </nav>

        <button
          onClick={() =>
            setMapMode((m) => (m === "research" ? "student" : "research"))
          }
          className="absolute bottom-6 left-4 w-fit px-3 py-1 cursor-pointer rounded-lg bg-blue-800/70 hover:bg-blue-700/80 text-sm"
        >
          {mapMode === "research" ? "Student Mode" : "Research Mode"}
        </button>

        {/* Decorative background */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-40 bg-blue-700/30 blur-3xl rounded-t-full pointer-events-none"
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-black min-h-screen">
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
};
