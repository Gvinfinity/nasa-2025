import React, { createContext, useContext, useEffect, useState } from "react";

interface SoundContextProps {
  play: (text: string, voiceName?: string) => void;
  stop: () => void;
  isPlaying: boolean; // Added isPlaying to the context
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prioritize natural-sounding voices
        const preferredVoice =
          voices.find((v) => /Wavenet|Neural/i.test(v.name)) || // Google Wavenet or Microsoft Neural voices
          voices.find((v) =>
            /(Google UK English Female|Google US English|Microsoft Sonia Online|Microsoft Jenny)/i.test(v.name)
          ) ||
          voices.find((v) => v.lang.startsWith("en")) || // Any English voice
          voices[0]; // Fallback to the first available voice

        setVoice(preferredVoice);
        console.log("Selected voice:", preferredVoice?.name); // Log the selected voice
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const play = (text: string, voiceName?: string) => {
    if (isPlaying) {
      stop();
    }

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceName) {
      const selectedVoice = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
      if (selectedVoice) utterance.voice = selectedVoice;
    } else if (voice) {
      utterance.voice = voice;
    }

    // Adjust pitch, rate, and volume for a more natural sound
    utterance.pitch = 1.0; // Neutral pitch
    utterance.rate = 1.0; // Normal speaking rate
    utterance.volume = 1.0; // Full volume

    utterance.onstart = () => {
      console.log("Speech started");
      setIsPlaying(true);
    };
    utterance.onend = () => {
      console.log("Speech ended");
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      console.log("Speech error");
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    console.log("Speech stopped");
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <SoundContext.Provider value={{ play, stop, isPlaying }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
