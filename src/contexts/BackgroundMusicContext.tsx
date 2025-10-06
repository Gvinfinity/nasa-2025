import { useState, useContext, createContext } from "react";
import audioFile from "../assets/audio.mp3";

interface BackgroundMusicContextProps {
  playBackground: (loop?: boolean) => void;
  stopBackground: () => void;
  pauseBackground: () => void;
  resumeBackground: () => void;
  isBackgroundPlaying: boolean;
}

const BackgroundMusicContext = createContext<
  BackgroundMusicContextProps | undefined
>(undefined);

export const BackgroundMusicProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);

  const playBackground = (loop: boolean = true) => {
    if (audio) {
      audio.pause();
    }

    try {
      const newAudio = new Audio(audioFile);
      newAudio.loop = loop;
      newAudio.volume = 0.3; // Lower volume for background music

      newAudio.onplay = () => setIsBackgroundPlaying(true);
      newAudio.onpause = () => setIsBackgroundPlaying(false);
      newAudio.onended = () => setIsBackgroundPlaying(false);

      newAudio.play().catch(console.error);
      setAudio(newAudio);
    } catch (error: unknown) {
      console.error("Error loading audio file:", error);
    }
  };

  const stopBackground = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsBackgroundPlaying(false);
    }
  };

  const pauseBackground = () => {
    if (audio) {
      audio.pause();
    }
  };

  const resumeBackground = () => {
    if (audio) {
      audio.play().catch(console.error);
    }
  };

  return (
    <BackgroundMusicContext.Provider
      value={{
        playBackground,
        stopBackground,
        pauseBackground,
        resumeBackground,
        isBackgroundPlaying,
      }}
    >
      {children}
    </BackgroundMusicContext.Provider>
  );
};

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error(
      "useBackgroundMusic must be used within a BackgroundMusicProvider"
    );
  }
  return context;
};
