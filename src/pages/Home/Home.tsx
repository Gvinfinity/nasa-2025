import React from "react";
import { useHome } from "./useHome";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import MapLatitude from "../../components/maps/LatitudeMap";
import { ResearchDataProvider } from "../../contexts/ResearchDataContext";

export const Home: React.FC = () => {
  useHome();

  return (
    <ResearchDataProvider>
      <Sidebar>
        <MapLatitude />
      </Sidebar>
    </ResearchDataProvider>
  );
};
