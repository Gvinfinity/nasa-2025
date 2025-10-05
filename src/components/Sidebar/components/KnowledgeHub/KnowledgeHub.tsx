import { BookOpen } from "lucide-react";
import React from "react";
import { StoriesMenu } from "./Stories/StoriesMenu.tsx";
import { useSidebarContext } from "../../Sidebar.tsx";

export const KnowledgeHub: React.FC = () => {
  const { setCustomComponent } = useSidebarContext();

  const handleKnowledgeHubClick = () => {
    setCustomComponent(<StoriesMenu />);
  };

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={handleKnowledgeHubClick}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors"
      >
        <BookOpen size={22} className="text-neutral-100" />
        <span className="font-semibold text-neutral-100 tracking-wide">
          Knowledge Hub
        </span>
      </button>
    </div>
  );
};
