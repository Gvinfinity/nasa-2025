import { BookOpen } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const ImportanceOfSharks = () => {
  const navigate = useNavigate();

  const handleStoriesClick = useCallback(() => {
    console.log("sharks-importance button clicked");
    navigate("/sharks-importance");
  }, [navigate]);

  return (
    <button
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer w-full text-left"
      onClick={handleStoriesClick}
    >
      <BookOpen size={20} />
      <span className="font-medium">Importance of Sharks</span>
    </button>
  );
};
