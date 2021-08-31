/*
 * @Author: your name
 * @Date: 2021-08-13 12:20:24
 * @LastEditTime: 2021-08-25 10:15:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\context\cursor\CursorContext.js
 */
import React, { createContext, useReducer } from 'react';
import { CursorReducer } from './CursorReducer';
import { SET_CURSORTYPE } from '../types';
export const CursorContext = createContext('');

export function CursorContextProvider(props) {
  const defaultCursorState = {
    type: 'default',
  };

  const [cursorType, dispatch] = useReducer(CursorReducer, defaultCursorState);

  const setCursorType = type => {
    dispatch({
      type: SET_CURSORTYPE,
      payload: { type },
    });
    return;
  };

  return (
    <CursorContext.Provider
      value={{ cursorType: cursorType.type, setCursorType }}
    >
      {props.children}
    </CursorContext.Provider>
  );
}
