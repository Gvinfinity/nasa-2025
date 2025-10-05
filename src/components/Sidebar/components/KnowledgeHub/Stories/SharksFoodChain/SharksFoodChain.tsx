import React from "react";
import { SliderProvider } from "../../../../../../contexts/SliderContext";
import Slide2 from "./Slides/Slide2";

export const SharksFoodChain: React.FC = () => {
  return (
    <SliderProvider>
        <Slide2 />
      </SliderProvider>
  );
};
