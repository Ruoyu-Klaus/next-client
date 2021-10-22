import { SET_DARK_THEME, SET_LIGHT_THEME } from '../types';

export const ThemeReducer = (state, actions) => {
  switch (actions.type) {
    case SET_DARK_THEME:
      return {
        ...state,
        isDarkMode: true,
      };
    case SET_LIGHT_THEME:
      return {
        ...state,
        isDarkMode: false,
      };
    default: {
      return {
        ...state,
      };
    }
  }
};
