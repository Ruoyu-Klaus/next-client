/*
 * @Author: your name
 * @Date: 2021-08-13 12:20:35
 * @LastEditTime: 2021-08-22 15:12:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\context\cursor\CursorReducer.js
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
