import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import oceanAnimation from "../assets/intro/ocean.json";
import { SliderProvider, useSliderProvider } from "../contexts/SliderContext";
import { useBackgroundMusic } from "../contexts/BackgroundMusicContext";

// Staggered container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

// Individual item animations
const itemVariants = {
  hidden: {
    y: 60,
    opacity: 0,
    scale: 0.8,
    rotateX: -15,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
  exit: {
    y: -60,
    opacity: 0,
    scale: 0.8,
    rotateX: 15,
    transition: {
      duration: 0.3,
    },
  },
};

// Enhanced background animation
const backgroundVariants = {
  initial: {
    opacity: 0,
    scale: 1.2,
    rotate: -2,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 2.5,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: 2,
    transition: {
      duration: 0.8,
    },
  },
};

const Intro1: React.FC = () => {
  const { nextSlide } = useSliderProvider();
  const { playBackground } = useBackgroundMusic();

  const handleStartClick = () => {
    console.log("Start button clicked!");
    nextSlide();
    playBackground();
  };

  return (
    <motion.div
      className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Full screen ocean background */}
      <motion.div
        className="fixed inset-0 -z-10"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={oceanAnimation}
            loop
            autoplay
            className="w-full h-full object-cover scale-[1.4] blur-sm opacity-5.5"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </motion.div>

      {/* Title with enhanced animations */}
      <motion.h1
        className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[15rem] font-extrabold mb-8 sm:mb-12 text-white drop-shadow-[0_0_25px_rgba(59,130,246,0.3)] leading-tight"
        variants={{
          hidden: {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotateX: -30,
            filter: "blur(10px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 80,
              duration: 1.8,
            },
          },
          exit: {
            opacity: 0,
            y: -100,
            scale: 1.2,
            rotateX: 30,
            filter: "blur(10px)",
            transition: { duration: 0.6 },
          },
        }}
      >
        <motion.span
          className="inline-block"
          animate={{
            textShadow: [
              "0 0 25px rgba(59,130,246,0.3)",
              "0 0 35px rgba(34,211,238,0.5)",
              "0 0 25px rgba(59,130,246,0.3)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Shark Seer
        </motion.span>
      </motion.h1>

      {/* Enhanced start button */}
      <motion.button
        className="
    relative overflow-hidden rounded-full font-semibold text-white 
    bg-gradient-to-r from-blue-700 to-cyan-400 shadow-lg hover:shadow-2xl
    px-[clamp(1.5rem,4vw,5rem)]  
    py-[clamp(0.75rem,2vw,2.5rem)] 
    text-[clamp(1rem,2vw,2rem)]   
    mt-[clamp(1rem,3vw,4rem)]
    transition-all duration-300
    z-50 cursor-pointer
  "
        variants={itemVariants}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 20px 40px rgba(59,130,246,0.4)",
          y: -5,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartClick}
        style={{ pointerEvents: "auto" }}
      >
        <span className="relative z-10">Start</span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 opacity-30"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{
            x: ["-200%", "200%"],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
      </motion.button>
    </motion.div>
  );
};

const Intro2: React.FC = () => {
  const { nextSlide } = useSliderProvider();
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Enhanced background */}
      <motion.div
        className="fixed inset-0 -z-10"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={oceanAnimation}
            loop
            autoplay
            className="w-full h-full object-cover scale-[1.4] blur-sm opacity-5"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </motion.div>

      <motion.h1
        className="text-[clamp(1.5rem,6vw,4rem)] sm:text-[clamp(2rem,7vw,5rem)] md:text-[clamp(2.5rem,8vw,6rem)] font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-200 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        <motion.span
          className="inline-block"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          Shark Seer
        </motion.span>
      </motion.h1>

      <motion.div
        className="text-[clamp(0.75rem,3vw,1rem)] sm:text-[clamp(0.875rem,3.5vw,1.125rem)] md:text-[clamp(1rem,4vw,1.25rem)] lg:text-[clamp(1.125rem,4.5vw,1.5rem)] text-blue-100/90 mb-8 sm:mb-10 leading-relaxed space-y-3 sm:space-y-4"
        variants={containerVariants}
      >
        <motion.p variants={itemVariants}>
          This app was developed by 6 students from Brazil in a 48-hour
          hackathon!
        </motion.p>
        <motion.p variants={itemVariants}>
          Given the relevance of sharks in our oceans, we recognize the
          importance of studying where sharks are most (and least) likely to be
          based on environment conditions. So, we developed Shark Seer, a
          mathematical framework for predicting shark foraging behavior, and a
          conceptual model for a new biologging tag to be attached to sharks and
          study their movements and eating habits.
        </motion.p>
        <motion.p variants={itemVariants}>
          We present our methodology with this web tool to share our ideas and
          results with the general public.
        </motion.p>
        <motion.p
          className="font-semibold text-cyan-300"
          variants={{
            ...itemVariants,
            visible: {
              ...itemVariants.visible,
              textShadow: "0 0 20px rgba(34,211,238,0.6)",
            },
          }}
        >
          Come with us learn more about sharks!
        </motion.p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        variants={containerVariants}
      >
        <motion.button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105 transition-all"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
        >
          Start Intro
        </motion.button>
        <motion.button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full border border-blue-400 text-blue-100 hover:bg-blue-500/20 hover:scale-105 transition-all"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(34,211,238,0.8)",
            backgroundColor: "rgba(59,130,246,0.2)",
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
        >
          Skip Intro
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Intro3: React.FC = () => {
  const { nextSlide } = useSliderProvider();
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Enhanced background */}
      <motion.div
        className="fixed inset-0 -z-10"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={oceanAnimation}
            loop
            autoplay
            className="w-full h-full object-cover scale-[1.4] blur-sm opacity-5"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="text-[clamp(0.75rem,3vw,1rem)] sm:text-[clamp(0.875rem,3.5vw,1.125rem)] md:text-[clamp(1rem,4vw,1.25rem)] lg:text-[clamp(1.125rem,4.5vw,1.5rem)] text-blue-100/90 mb-[clamp(1rem,3vw,2.5rem)] leading-relaxed"
        variants={containerVariants}
      >
        <motion.p variants={itemVariants}>
          You have definitely heard about sharks before! They are these
          creatures:
        </motion.p>
        <motion.p
          className="mt-[clamp(0.5rem,2vw,1rem)]"
          variants={itemVariants}
        >
          Sharks are fish whose skeletons are made mostly of cartilage and roam
          around our oceans. Many don't have natural predators in their
          ecosystems, so they play a key role in the food chain.
        </motion.p>
      </motion.div>

      {/* Enhanced shark images with staggered animations */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(0.5rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]"
        variants={containerVariants}
      >
        {[
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Carcharhinus_melanopterus_Luc_Viatour.jpg/500px-Carcharhinus_melanopterus_Luc_Viatour.jpg",
            alt: "Blacktip Reef Shark",
          },
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/250px-White_shark.jpg",
            alt: "Great White Shark",
          },
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Hammerhead_shark,_Cocos_Island,_Costa_Rica.jpg/968px-Hammerhead_shark,_Cocos_Island,_Costa_Rica.jpg",
            alt: "Hammerhead Shark",
          },
          {
            src: "https://www.icr.org/i/articles/af/fossil_sharks_pic2",
            alt: "Fossil Shark",
          },
        ].map((shark, index) => (
          <motion.div
            key={index}
            className="w-full h-[clamp(6rem,15vw,16rem)] rounded-lg overflow-hidden border border-blue-400/30"
            variants={{
              ...itemVariants,
              visible: {
                ...itemVariants.visible,
                transition: {
                  type: "spring" as const,
                  damping: 20,
                  stiffness: 100,
                  delay: index * 0.1,
                },
              },
            }}
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(34,211,238,0.6)",
              boxShadow: "0 10px 30px rgba(59,130,246,0.3)",
              y: -5,
            }}
          >
            <img
              src={shark.src}
              alt={shark.alt}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        variants={containerVariants}
      >
        <motion.button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105 transition-all"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
        >
          Next
        </motion.button>
        <motion.button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full border border-blue-400 text-blue-100 hover:bg-blue-500/20 hover:scale-105 transition-all"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(34,211,238,0.8)",
            backgroundColor: "rgba(59,130,246,0.2)",
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
        >
          Skip
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Intro5: React.FC = () => {
  const { nextSlide } = useSliderProvider();
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="fixed inset-0 -z-10"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={oceanAnimation}
            loop
            autoplay
            className="w-full h-full object-cover scale-[1.4] blur-sm opacity-5"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="text-[clamp(0.75rem,3vw,1rem)] sm:text-[clamp(0.875rem,3.5vw,1.125rem)] md:text-[clamp(1rem,4vw,1.25rem)] lg:text-[clamp(1.125rem,4.5vw,1.5rem)] text-blue-100/90 mb-[clamp(1.5rem,4vw,2.5rem)] leading-relaxed"
        variants={itemVariants}
      >
        <p>
          A tag is a small device attached to an animal to monitor and study its
          movements. It is essential for scientists to know where certain
          animals live and forage in order to better understand their influence
          in ecosystems, so tags are handy instruments.
        </p>
      </motion.div>

      <motion.div
        className="flex justify-center mb-[clamp(1.5rem,4vw,2rem)]"
        variants={itemVariants}
      >
        <motion.div
          className="w-[clamp(16rem,50vw,24rem)] h-[clamp(12rem,35vw,18rem)] rounded-lg overflow-hidden border border-blue-400/30"
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(34,211,238,0.6)",
            boxShadow: "0 15px 35px rgba(59,130,246,0.4)",
            y: -5,
          }}
        >
          <img
            src="https://surftherenow.com/wp-content/uploads/2008/06/shark-tag.jpg"
            alt="Shark Tag"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        variants={containerVariants}
      >
        <motion.button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105 transition-all"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
        >
          Next
        </motion.button>
        <motion.button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full border border-blue-400 text-blue-100 hover:bg-blue-500/20 hover:scale-105 transition-all"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(34,211,238,0.8)",
            backgroundColor: "rgba(59,130,246,0.2)",
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
        >
          Skip
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Intro6: React.FC = () => {
  const { nextSlide } = useSliderProvider();
  const navigate = useNavigate();

  return (
    <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Same background as Intro1 */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={oceanAnimation}
            loop
            autoplay
            className="w-full h-full object-cover scale-[1.4] blur-sm opacity-5"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="text-[clamp(0.75rem,3vw,1rem)] sm:text-[clamp(0.875rem,3.5vw,1.125rem)] md:text-[clamp(1rem,4vw,1.25rem)] lg:text-[clamp(1.125rem,4.5vw,1.5rem)] text-blue-100/90 mb-[clamp(1.5rem,4vw,2.5rem)] leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <p>
          A mathematical framework is a way to use mathematical tools, concepts,
          and models to help describe, analyse, and predict some phenomenon.
          Much of our knowledge in the sciences (Astronomy, Chemistry, Biology,
          Computer Science…) comes from structured, mathematical approaches that
          provide us great tools for understanding our universe, as science is
          all about analyzing data and math is how we do it!
        </p>
      </motion.div>

      <motion.div
        className="flex justify-center mb-[clamp(1.5rem,4vw,2rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="w-[clamp(20rem,60vw,32rem)] h-[clamp(15rem,45vw,24rem)] rounded-lg overflow-hidden border border-blue-400/30">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Leibniz%2C_Gottfried_Wilhelm_von_%E2%80%93_Nova_methodus_pro_maximis_et_minimis_-_Acta_Eruditorum_-_Tabula_XII_-_Graphs%2C_1684.jpg/250px-Leibniz%2C_Gottfried_Wilhelm_von_%E2%80%93_Nova_methodus_pro_maximis_et_minimis_-_Acta_Eruditorum_-_Tabula_XII_-_Graphs%2C_1684.jpg"
            alt="Mathematical Framework"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105 transition-all"
          onClick={nextSlide}
        >
          Next
        </button>
        <button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full border border-blue-400 text-blue-100 hover:bg-blue-500/20 hover:scale-105 transition-all"
          onClick={() => navigate("/home")}
        >
          Skip
        </button>
      </motion.div>
    </div>
  );
};

const Intro7: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Same background as Intro1 */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Lottie
            animationData={oceanAnimation}
            loop
            autoplay
            className="w-full h-full object-cover scale-[1.4] blur-sm opacity-5"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="text-[clamp(0.75rem,3vw,1rem)] sm:text-[clamp(0.875rem,3.5vw,1.125rem)] md:text-[clamp(1rem,4vw,1.25rem)] lg:text-[clamp(1.125rem,4.5vw,1.5rem)] text-blue-100/90 mb-[clamp(1.5rem,4vw,2.5rem)] leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <p>
          Sharks, tags and math… we saw a way to unite these three topics into
          one fun project while contributing to science. Let's take a look!
        </p>
      </motion.div>

      {/* Placeholder for bigger image */}
      <motion.div
        className="flex justify-center mb-[clamp(1.5rem,4vw,2rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="w-[clamp(24rem,70vw,40rem)] h-[clamp(18rem,50vw,30rem)] rounded-lg overflow-hidden ">
          <img
            src="src/assets/sharko_new.png"
            alt="Shark Research"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105 transition-all"
          onClick={() => navigate("/home")}
        >
          Let's Go!
        </button>
        <button
          className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] text-[clamp(0.875rem,3.5vw,1.125rem)] font-semibold rounded-full border border-blue-400 text-blue-100 hover:bg-blue-500/20 hover:scale-105 transition-all"
          onClick={() => navigate("/home")}
        >
          Skip
        </button>
      </motion.div>
    </div>
  );
};

const Cover: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 🌊 Deep Ocean Animated Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#00111F] via-[#003B5C] to-[#005C99]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* 💨 Moving Light Rays (simulate sunlight underwater) */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.12)_0%,transparent_70%)]"
        animate={{
          opacity: [0.4, 0.6, 0.4],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 🏷️ Developers Logo */}
      <motion.div
        className="absolute top-6 sm:top-8 lg:top-12 opacity-100 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <img
          src={logo}
          alt="Developers Logo"
          className="h-8 sm:h-10 lg:h-12 w-auto"
        />
      </motion.div>

      {/* 🫧 Floating Bubbles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-100 rounded-full opacity-20 blur-sm"
          style={{
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0.05, 0.3, 0.05],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 💎 Content with Enhanced Transitions */}
      <SliderProvider>
        <Intro1 key="intro1" />
        <Intro2 key="intro2" />
        <Intro3 key="intro3" />
        <Intro5 key="intro5" />
        <Intro6 key="intro6" />
        <Intro7 key="intro7" />
      </SliderProvider>
    </div>
  );
};

export default Cover;
