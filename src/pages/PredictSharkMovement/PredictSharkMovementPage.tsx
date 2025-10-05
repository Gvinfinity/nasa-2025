import React from "react";
import { motion } from "framer-motion";
import { Brain, Tag } from "lucide-react";
import Background from "../../components/Background";
import { useSidebarContext } from "../../components/Sidebar/Sidebar";

export const PredictSharkMovements: React.FC = () => {
  const { navigateTo } = useSidebarContext();

  const predictionMethods = [
    {
      id: "model-info-story",
      title: "AI Model Predictions",
      description:
        "Learn how machine learning models predict shark movement patterns using environmental data and historical tracking information.",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:from-blue-600 hover:to-cyan-600",
    },
    {
      id: "tag-info-story",
      title: "Mechanical Tag Research",
      description:
        "Discover how satellite and acoustic tags provide real-time data on shark locations and behavior patterns.",
      icon: Tag,
      color: "from-teal-500 to-green-500",
      hoverColor: "hover:from-teal-600 hover:to-green-600",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background />
      <div className="relative z-10 flex-1 p-8 flex flex-col">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-100 via-white/90 to-teal-200 bg-clip-text text-transparent drop-shadow-xl"
        >
          How We Predict Shark Movements
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-blue-100/80 text-lg mb-12 max-w-3xl mx-auto"
        >
          Explore the cutting-edge methods scientists use to track and predict
          shark movements across our oceans.
        </motion.p>

        {/* Cards Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
            {predictionMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                  className={`bg-gradient-to-br ${method.color} ${method.hoverColor} p-8 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl`}
                  onClick={() => navigateTo(method.id as any)}
                >
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="bg-white/20 p-4 rounded-full mb-6">
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">
                      {method.title}
                    </h3>

                    <p className="text-white/90 text-lg leading-relaxed flex-1">
                      {method.description}
                    </p>

                    <div className="mt-6 px-6 py-2 bg-white/20 rounded-full text-white font-medium">
                      Learn More →
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
