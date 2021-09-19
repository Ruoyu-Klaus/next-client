/*
 * @Author: Ruoyu
 * @FilePath: \next-client\hooks\useBreakPoint.js
 */
import { useState, useEffect } from 'react';

export const throttle = (fn, time = 1000) => {
  var timer = null,
    curTime = new Date().getTime();
  return function () {
    var _self = this,
      args = arguments,
      startTime = new Date().getTime();
    if (timer) clearTimeout(timer);
    if (startTime - curTime >= time) {
      fn.apply(_self, ...args);
      curTime = startTime;
    } else {
      timer = setTimeout(() => {
        fn.apply(_self, ...args);
      }, time);
    }
  };
};

const getDeviceConfig = width => {
  if (width < 320) {
    return 'xs';
  } else if (width >= 320 && width < 720) {
    return 'sm';
  } else if (width >= 720 && width < 1024) {
    return 'md';
  } else if (width >= 1024) {
    return 'lg';
  }
};

const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState('xs');

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(window.innerWidth));
    });
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return brkPnt;
};
export default useBreakpoint;
