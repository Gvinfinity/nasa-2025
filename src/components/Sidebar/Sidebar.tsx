import { useState } from "react";
import { motion } from "framer-motion";
import { Sharkmap } from "./components/Sharkmap";
import { ImportanceOfSharks } from "./components/ImportanceOfSharks";
import { WhichSharkAreYou } from "./components/WhichSharkAreYou";
import { PredictSharkMovement } from "./components/PredictSharkMovement";
import { NasaDataUsed } from "./components/NasaDataUsed";
import { MeetTheDevelopers } from "./components/MeetTheDevelopers";

interface SidebarProps {
  children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col items-start p-4 shadow-2xl relative overflow-hidden">
        <nav className="flex flex-col gap-3 w-full text-sm mt-6">
          <Sharkmap />
          <ImportanceOfSharks />
          <WhichSharkAreYou />
          <PredictSharkMovement />
          <NasaDataUsed />
          <MeetTheDevelopers />
        </nav>

        {/* Decorative background */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-40 bg-blue-700/30 blur-3xl rounded-t-full"
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-black min-h-screen">
        <h1 className="text-3xl font-bold text-blue-900">
          {children}
        </h1>
      </div>
    </div>
  );
};
