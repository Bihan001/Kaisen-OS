import React, { useState, useEffect, createContext } from 'react';

export const ScreenContext = createContext();

export const ScreenProvider = (props) => {
  const [screenState, setScreenState] = useState({
    mobileView: false,
    screenWidth: 0,
    screenHeight: 0,
  });
  const handleResize = () => {
    setScreenState({
      mobileView:
        (window.innerWidth <= 414 && window.innerHeight <= 812) ||
        (window.innerHeight <= 414 && window.innerWidth <= 812)
          ? true
          : false,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  };
  useEffect(() => {
    setScreenState({
      mobileView:
        (window.innerWidth <= 414 && window.innerHeight <= 812) ||
        (window.innerHeight <= 414 && window.innerWidth <= 812)
          ? true
          : false,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  }, []);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return (
    <ScreenContext.Provider
      value={{
        screenState: screenState,
      }}>
      {props.children}
    </ScreenContext.Provider>
  );
};