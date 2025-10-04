import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  totalSlides?: number;
  initialSlide?: number;
}

export const SliderProvider: React.FC<SliderProviderProps> = ({
  children,
  totalSlides = 0,
  initialSlide = 0
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      totalSlides > 0 ? (prev + 1) % totalSlides : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      totalSlides > 0 ? (prev - 1 + totalSlides) % totalSlides : Math.max(0, prev - 1)
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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
      {children}
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