/*
 * @Author: your name
 * @Date: 2021-08-24 18:49:54
 * @LastEditTime: 2021-08-24 19:02:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\hooks\usePostSearch.js
 */
import React, { useEffect } from 'react';

import { getArticleList } from '../pages/api/request';

function usePostSearch(query) {
  useEffect(() => {
    // await getArticleList(query);
  }, [query]);
  return <div></div>;
}

export default usePostSearch;
