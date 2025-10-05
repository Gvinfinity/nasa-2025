import React from "react";
import { motion } from "framer-motion";
import { Brain, Database, TrendingUp, Zap } from "lucide-react";
import Background from "../../../components/Background";

export const ModelInfo: React.FC = () => {
  const modelFeatures = [
    {
      icon: Database,
      title: "Environmental Data",
      description: "Water temperature, salinity, currents, and prey distribution"
    },
    {
      icon: TrendingUp,
      title: "Historical Patterns",
      description: "Years of tracking data to identify migration routes"
    },
    {
      icon: Brain,
      title: "Machine Learning",
      description: "Advanced algorithms that learn from shark behavior"
    },
    {
      icon: Zap,
      title: "Real-time Predictions",
      description: "Live updates based on current ocean conditions"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Background />
      <div className="relative z-10 flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-100 via-white/90 to-cyan-200 bg-clip-text text-transparent">
            AI Model Predictions
          </h1>
          <p className="text-blue-100/80 text-lg max-w-3xl mx-auto">
            Our machine learning models analyze vast amounts of oceanographic data to predict where sharks are most likely to be found.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* How it Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">How Our AI Models Work</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modelFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-blue-100/70 text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Model Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Data Sources */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Data Sources</h3>
              <ul className="space-y-3 text-blue-100/80">
                <li>• NASA satellite oceanographic data</li>
                <li>• NOAA environmental monitoring</li>
                <li>• Historical shark tracking records</li>
                <li>• Real-time buoy measurements</li>
                <li>• Fisheries and marine biology databases</li>
              </ul>
            </div>

            {/* Model Accuracy */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Model Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Prediction Accuracy</span>
                    <span>78%</span>
                  </div>
                  <div className="bg-blue-900/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Data Coverage</span>
                    <span>92%</span>
                  </div>
                  <div className="bg-blue-900/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-teal-400 to-green-400 h-2 rounded-full w-11/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Real-time Updates</span>
                    <span>85%</span>
                  </div>
                  <div className="bg-blue-900/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Future Improvements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 mt-8"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Continuous Improvement</h3>
            <p className="text-blue-100/80 text-center max-w-4xl mx-auto">
              Our models are constantly learning and improving. As we gather more data from tagged sharks and environmental sensors, 
              the predictions become more accurate. We're also incorporating new data sources like underwater acoustic monitoring 
              and advanced satellite imagery to enhance our understanding of shark behavior patterns.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
