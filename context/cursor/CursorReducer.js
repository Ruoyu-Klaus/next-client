/*
 * @Author: Ruoyu
 * @FilePath: \next-client\context\cursor\CursorReducer.js
 */
import { SET_CURSORTYPE } from '../types';

export const CursorReducer = (state, action) => {
  switch (action.type) {
    case SET_CURSORTYPE:
      return {
        ...state,
        ...action.payload,
      };
    default: {
      return {
        ...state,
      };
    }
  }
};
