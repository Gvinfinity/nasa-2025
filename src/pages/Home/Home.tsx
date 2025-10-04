import React from "react";
import { useHome } from "./useHome";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import MapLatitude from "../../components/maps/LatitudeMap";

export const Home: React.FC = () => {
  // const { handleStoriesClick, handleSimulatorClick, handleGamesClick } =
    useHome();

  return (
    <Sidebar>
      <MapLatitude />
    </Sidebar>
  );
};
