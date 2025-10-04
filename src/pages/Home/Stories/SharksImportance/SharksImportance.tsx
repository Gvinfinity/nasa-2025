import React from "react";
import { Sidebar } from "../../../../Sidebar";
import { SliderProvider } from "../../../../../../contexts/SliderContext";
import Slide1 from "./Slides/Slide1";
import Slide2 from "./Slides/Slide2";

export const SharksImportance: React.FC = () => {
  return (
    <Sidebar>
      <SliderProvider>
        <Slide1 />
        <Slide2 />
      </SliderProvider>
    </Sidebar>
  );
};
