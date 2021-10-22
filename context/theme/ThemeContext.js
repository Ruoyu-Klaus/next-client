import React, { createContext, useReducer } from 'react';
import { ThemeReducer } from './ThemeReducer';
import { SET_DARK_THEME, SET_LIGHT_THEME } from '../types';

export const ThemeContext = createContext('');

export function ThemeContextProvider(props) {
  let isDarkMode = null;
  if (typeof window !== 'undefined') {
    isDarkMode = localStorage.getItem('darkMode') === 'true' ? true : false;
  }

  const defaultThemeState = {
    isDarkMode: isDarkMode,
  };

  const [theme, dispatch] = useReducer(ThemeReducer, defaultThemeState);

  const setDarkTheme = _ => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', 'true');
    }
    dispatch({
      type: SET_DARK_THEME,
      payload: {},
    });
    return;
  };
  const setLightTheme = _ => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', 'false');
    }
    dispatch({
      type: SET_LIGHT_THEME,
      payload: {},
    });
    return;
  };

  return (
    <ThemeContext.Provider value={{ theme, setDarkTheme, setLightTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
