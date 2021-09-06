/*
 * @Author: Ruoyu
 * @FilePath: \next-client\components\LoadingCard.js
 */
import React from 'react';
import { Skeleton } from 'antd';

function LoadingCard({ isLoading }) {
  return (
    <div id={'loadingBars'}>
      <Skeleton loading={isLoading} paragraph={false} active />
      <Skeleton loading={isLoading} paragraph={false} active />
      <Skeleton loading={isLoading} paragraph={false} active />
    </div>
  );
}

export default LoadingCard;
