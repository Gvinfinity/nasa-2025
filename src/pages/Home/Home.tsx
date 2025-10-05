import React from "react";
import { useHome } from "./useHome";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import MapLatitude from "../../components/maps/LatitudeMap";
import { ModelDataProvider } from "../../contexts/ModelDataContext";

export const Home: React.FC = () => {
  useHome();

  return (
    <ModelDataProvider>
      <Sidebar>
        <MapLatitude />
      </Sidebar>
    </ModelDataProvider>
  );
};
