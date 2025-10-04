import React from "react";
import { Button } from "../../components/index";
import { useHome } from "./useHome";
import { Sidebar } from "../../components/Sidebar/Sidebar";

export const Home: React.FC = () => {
  const { handleStoriesClick, handleSimulatorClick, handleGamesClick } =
    useHome();

  return (
    <Sidebar>
      <div className="relative flex min-h-screen flex-col justify-center items-center m:py-12">
        <h1 className="text-center text-5xl">Shark Tracking Dashboard 🦈</h1>
        <div className="flex justify-center mt-10 gap-10">
          <Button
            onClick={handleStoriesClick}
            text="Stories"
            variant="primary"
          />
          <Button
            onClick={handleSimulatorClick}
            text="Simulator"
            variant="secondary"
          />
          <Button onClick={handleGamesClick} text="Games" variant="tertiary" />
        </div>
      </div>
    </Sidebar>
  );
};
