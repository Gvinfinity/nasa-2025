import React, { createContext, useContext, useState, ReactNode, Children } from 'react';

interface SliderContextType {
  currentSlide: number;
  totalSlides: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

interface SliderProviderProps {
  children: ReactNode;
  initialSlide?: number;
}

export const SliderProvider: React.FC<SliderProviderProps> = ({
  children,
  initialSlide = 0
}) => {
  const childrenArray = Children.toArray(children);
  const totalSlides = childrenArray.length;
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  const value: SliderContextType = {
    currentSlide,
    totalSlides,
    nextSlide,
    prevSlide,
    goToSlide
  };

  return (
    <SliderContext.Provider value={value}>
      {childrenArray[currentSlide]}
    </SliderContext.Provider>
  );
};

export const useSliderProvider = () => {
  const context = useContext(SliderContext);
  if (context === undefined) {
    throw new Error('useSliderProvider must be used within a SliderProvider');
  }
  return context;
};
