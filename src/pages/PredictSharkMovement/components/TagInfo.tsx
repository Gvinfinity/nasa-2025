import React from "react";
import { motion } from "framer-motion";
import { Satellite, Radio, MapPin, Clock, LucideIcon } from "lucide-react";
import Background from "../../../components/Background";

interface TagType {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

interface ProcessStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface InfoSection {
  title: string;
  items: string[];
}

const TagCard: React.FC<{ tag: TagType; index: number }> = ({ tag, index }) => {
  const IconComponent = tag.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
    >
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-teal-500 to-green-500 p-3 rounded-full mr-4">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">{tag.title}</h3>
      </div>

      <p className="text-blue-100/80 mb-6">{tag.description}</p>

      <div className="space-y-2">
        <h4 className="text-white font-semibold mb-3">Key Features:</h4>
        {tag.features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            className="flex items-center text-blue-100/70"
          >
            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
            {feature}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProcessStepCard: React.FC<{ step: ProcessStep; index: number }> = ({
  step,
  index,
}) => {
  const IconComponent = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-green-500 to-teal-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-2">{step.title}</h3>
      <p className="text-blue-100/70 text-sm">{step.desc}</p>
    </motion.div>
  );
};

const InfoCard: React.FC<{ section: InfoSection; delay: number }> = ({
  section,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
  >
    <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
    <ul className="space-y-3 text-blue-100/80">
      {section.items.map((item, index) => (
        <li key={index}>• {item}</li>
      ))}
    </ul>
  </motion.div>
);

export const TagInfo: React.FC = () => {
  const tagTypes: TagType[] = [
    {
      icon: Satellite,
      title: "Satellite Tags",
      description:
        "Pop-up satellite archival tags (PSATs) that surface after a programmed time",
      features: [
        "Long-term tracking (months to years)",
        "Deep dive data",
        "Temperature and depth logs",
      ],
    },
    {
      icon: Radio,
      title: "Acoustic Tags",
      description: "Transmit unique ID codes detected by underwater receivers",
      features: [
        "Real-time detection",
        "High-resolution positioning",
        "Network of receivers",
      ],
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      icon: MapPin,
      title: "Capture",
      desc: "Safely catch sharks using specialized techniques",
    },
    {
      icon: Clock,
      title: "Tag Attachment",
      desc: "Quickly attach tags to minimize stress",
    },
    {
      icon: Radio,
      title: "Release",
      desc: "Return sharks to their natural environment",
    },
    {
      icon: Satellite,
      title: "Data Collection",
      desc: "Monitor movements and gather insights",
    },
  ];

  const infoSections: InfoSection[] = [
    {
      title: "Research Discoveries",
      items: [
        "Migration routes spanning thousands of miles",
        "Deep diving behavior up to 2,000+ meters",
        "Seasonal habitat preferences",
        "Social behavior and aggregation patterns",
        "Response to environmental changes",
      ],
    },
    {
      title: "Conservation Impact",
      items: [
        "Identifying critical habitats for protection",
        "Informing fishing regulations and policies",
        "Understanding climate change effects",
        "Reducing human-shark conflicts",
        "Supporting marine protected areas",
      ],
    },
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-100 via-white/90 to-green-200 bg-clip-text text-transparent">
            Mechanical Tag Research
          </h1>
          <p className="text-blue-100/80 text-lg max-w-3xl mx-auto">
            Advanced tagging technology provides direct, real-time data on shark
            movements, behavior, and habitat preferences.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
