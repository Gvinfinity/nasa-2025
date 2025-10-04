import React, { useEffect } from "react";
import { Volume, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSound } from "../../../contexts/SoundContext";

interface TextWithSpeechProps {
  text: string;
  title?: string;
  voiceName?: string;
  hasBackground?: boolean;
}

const TextWithSpeech: React.FC<TextWithSpeechProps> = ({ 
  text, 
  title, 
  voiceName, 
  hasBackground = false 
}) => {
  const { play, stop, isPlaying } = useSound(); // Use isPlaying from context

  const handleSpeak = () => {
    console.log("isPlaying before toggle:", isPlaying);
    if (isPlaying) {
      stop();
    } else {
      play(text, voiceName);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      console.log("Playing speech for text:", text);
      play(text, voiceName);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, voiceName]);

  // 🌀 Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const content = (
    <>
      <div className="flex items-start justify-between mb-4">
        {title && (
          <motion.h3
            className="text-xl font-semibold text-blue-100 drop-shadow-[0_0_8px_rgba(0,200,255,0.4)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h3>
        )}
        <motion.button
          onClick={handleSpeak}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 backdrop-blur-sm hover:bg-blue-500/30 hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,150,255,0.3)]"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <Volume className="w-5 h-5" />
          )}
        </motion.button>
      </div>
      <motion.p
        className="text-blue-100/90 leading-relaxed text-lg"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {text}
      </motion.p>
    </>
  );

  if (!hasBackground) {
    return <div className="text-blue-100">{content}</div>;
  }

  return (
    <motion.div
      className="relative backdrop-blur-md bg-white/10 border border-blue-400/30 rounded-2xl p-6 text-blue-100 shadow-[0_0_25px_rgba(0,100,255,0.15)]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 40px rgba(0,150,255,0.25)",
        transition: { duration: 0.3 },
      }}
    >
      {content}

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 25px rgba(0,100,255,0.1)",
            "0 0 50px rgba(0,150,255,0.2)",
            "0 0 25px rgba(0,100,255,0.1)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </motion.div>
  );
};

export default TextWithSpeech;
