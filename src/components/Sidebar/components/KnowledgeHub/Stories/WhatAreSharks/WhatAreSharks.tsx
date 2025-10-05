import React from "react";
import { SliderProvider } from "../../../../../../contexts/SliderContext";
import Slide2 from "./Slides/Slide2";
import Slide3 from "./Slides/Slide3";

export const WhatAreSharks: React.FC = () => {
  return (
    <SliderProvider>
      <Slide2 />
      <Slide3 />
    </SliderProvider>
  );
};
