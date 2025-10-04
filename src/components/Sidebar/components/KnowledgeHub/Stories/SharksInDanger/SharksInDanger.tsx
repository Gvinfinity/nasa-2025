import React from "react";
import { SliderProvider } from "../../../../../../contexts/SliderContext";
import Slide1 from "./Slides/Slide1";
import Slide2 from "./Slides/Slide2";

export const SharksInDanger: React.FC = () => {
  return (
      <SliderProvider>
        <Slide1 />
        <Slide2 />
      </SliderProvider>
  );
};
