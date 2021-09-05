/*
 * @Author: Ruoyu
 * @FilePath: \next-client\components\LoadingCard.js
 */
import React from 'react';
import { Skeleton } from 'antd';

function LoadingCard() {
  return <Skeleton loading={true} button active block shape='Default' />;
}

export default LoadingCard;
