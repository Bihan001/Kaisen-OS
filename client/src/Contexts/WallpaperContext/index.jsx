import React, { useState, createContext } from 'react';

export const WallpaperContext = createContext();

export const WallpaperProvider = (props) => {
  const [wallpaper, setWallpaper] = useState('#F5CFCF');

  const changeWallpaper = (color) => {
    setWallpaper(color);
  };
  return (
    <WallpaperContext.Provider
      value={{
        wallpaper: wallpaper,
        changeWallpaper: changeWallpaper,
      }}>
      {props.children}
    </WallpaperContext.Provider>
  );
};
