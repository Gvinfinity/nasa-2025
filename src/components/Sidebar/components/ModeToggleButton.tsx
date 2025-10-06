import { useState, useEffect } from "react";

interface ModeToggleButtonProps {
  onModeChange?: (mode: "research" | "student") => void;
}

export const ModeToggleButton = ({ onModeChange }: ModeToggleButtonProps) => {
  const [mapMode, setMapMode] = useState<"research" | "student">("research");

  const handleModeToggle = () => {
    const newMode = mapMode === "research" ? "student" : "research";
    setMapMode(newMode);
    onModeChange?.(newMode);
  };

  // Notify parent of initial mode
  useEffect(() => {
    onModeChange?.(mapMode);
  }, []);

  return (
    <div className="flex items-center space-x-2 w-full justify-between">
      <div className="flex items-center space-x-2">
        {/* <BookOpenText className="h-6 w-6 text-white/70" /> */}
        <span className="text-xl">📚</span>
        <span className={`text-sm text-white`}>Quiz Mode</span>
      </div>

      <button
        onClick={handleModeToggle}
        aria-label={`Switch to ${
          mapMode === "research" ? "student" : "research"
        } mode`}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:opacity-80 focus:outline-none ${
          mapMode === "student" ? "bg-green-600" : "bg-white/5"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            mapMode === "student" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
