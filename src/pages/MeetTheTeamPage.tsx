import React from "react";
import { motion } from "framer-motion";
import Background from "../components/Background";
import { User, Crown, Code, Lightbulb, Zap, Rocket } from "lucide-react";
import groupPhoto from "../assets/coding_in_Lua.jpg";

const MeetTheTeamPage: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Gabriel Vinícius dos Santos Soares",
      role: "Developer and Data Scientist",
    },
    {
      id: 2,
      name: "Thales Paulilo Scarpato",
      role: "Reasearcher and Data Scientist",
    },
    {
      id: 3,
      name: "Giulliano Melo Teixeira",
      role: "Reasearcher and Designer",
    },
    {
      id: 4,
      name: "Milena Furuta Shishito",
      role: "Developer and Designer",
    },
    {
      id: 5,
      name: "Heitor Leite de Almeida",
      role: "Developer and Data Scientist",
    },
    {
      id: 6,
      name: "João Vítor Albuquerque Mafra",
      role: "Reasearcher and Designer",
    },
  ];

  // Icon mapping for team members
  const icons = [Crown, Code, Lightbulb, Zap, Rocket, User];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background />
      <div className="relative z-10 flex-1 p-10 flex flex-col ">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-4xl font-bold text-center m-8 bg-gradient-to-r from-blue-100 via-white/80 to-teal-200 bg-clip-text text-transparent drop-shadow-xl"
        >
          Meet The Team
        </motion.h1>

        {/* Group Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={groupPhoto}
              alt="Team Photo"
              className="w-full max-w-2xl h-auto object-cover backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, i) => {
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="
                    relative group overflow-hidden
                    rounded-2xl border backdrop-blur-md
                    transition-all duration-500 ease-out shadow-lg
                    min-h-[220px] bg-white/5 border-white/10 hover:bg-white/10
                    p-6 flex flex-col justify-center
                  "
                >
                  <Icon className="w-8 h-8 text-cyan-300 mb-3 transition-all duration-300 group-hover:scale-110" />
                  <motion.h3
                    className="text-xl font-semibold text-white mb-2"
                    whileHover={{ color: "#A5F3FC" }}
                  >
                    {member.name}
                  </motion.h3>
                  <p className="text-cyan-300 font-medium mb-3 text-sm">
                    {member.role}
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed"></p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetTheTeamPage;
