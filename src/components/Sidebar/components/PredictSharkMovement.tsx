import { Brain } from "lucide-react";

export const PredictSharkMovement = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer">
    <Brain size={22} className="text-neutral-100" />
    <span className="font-semibold text-neutral-100 tracking-wide">
      How We Predict Shark Movement
    </span>
  </div>
);
