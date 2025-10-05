import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sharkmap } from "./components/Sharkmap";
import { KnowledgeHub } from "./components/KnowledgeHub/KnowledgeHub";
import { PredictSharkMovement } from "./components/PredictSharkMovement";
import { Tutorial } from "./components/Tutorial";
import { MeetTheDevelopers } from "./components/MeetTheDevelopers";

interface SidebarProps {
  children?: React.ReactNode;
}

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col items-start p-4 shadow-2xl relative overflow-hidden overflow-y-auto">
        <nav className="flex flex-col gap-3 w-full text-sm mt-6">
          <div onClick={() => setChildren(null)}>
            <Sharkmap setMapMode={setMapMode} enabled={enabled} setEnabled={setEnabled} />
          </div>
          <KnowledgeHub setChildren={setChildren} />
         <div onClick={() => setChildren(null)}>
           <PredictSharkMovement />
         </div>
        <div onClick={() => setChildren(null)}>
         <Tutorial />
         </div>
          <div onClick={() => setChildren(null)}>
         <MeetTheDevelopers />
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
  );
};
