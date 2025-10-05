import { Brain } from "lucide-react";

export const PredictSharkMovement = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer">
    <Brain size={22} className="text-neutral-100" />
    <a className="font-semibold text-neutral-100 tracking-wide hover:text-gray-300" target="_blank" rel="noopener noreferrer" href="https://www.spaceappschallenge.org/2025/find-a-team/coding-in-lua1/?tab=project">
      How We Predict Shark Movement
    </a>
  </div>
);
