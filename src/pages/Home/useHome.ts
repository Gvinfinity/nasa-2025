import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useHome = () => {
  const navigate = useNavigate();

  const handleStoriesClick = useCallback(() => {
    console.log("Stories button clicked");
    navigate("/stories");
  }, [navigate]);

  const handleSimulatorClick = useCallback(() => {
    console.log("Simulator button clicked");
    navigate("/simulator");
  }, [navigate]);

  const handleGamesClick = useCallback(() => {
    console.log("Games button clicked");
    navigate("/games");
  }, [navigate]);

  return {
    handleStoriesClick,
    handleSimulatorClick,
    handleGamesClick,
  };
};