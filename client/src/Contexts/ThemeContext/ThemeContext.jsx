import React, { useState, createContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
  const [theme, settheme] = useState('#00FFFF');

  const ChangeTheme = (color) => {
    settheme(color);
  };
  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        ChangeTheme: ChangeTheme,
      }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
