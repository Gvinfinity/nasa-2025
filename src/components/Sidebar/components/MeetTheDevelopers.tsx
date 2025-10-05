import { Users } from "lucide-react";

export const MeetTheTeam = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer">
    <Users size={22} className="text-neutral-100" />
    <span className="font-semibold text-neutral-100 tracking-wide">
      Meet the Team
    </span>
  </div>
);
