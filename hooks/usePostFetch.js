/*
 * @Author: your name
 * @Date: 2021-08-21 14:10:37
 * @LastEditTime: 2021-08-28 17:16:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\hooks\usePostFetch.js
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getArticleList } from '../request';
import { cloneDeep } from 'lodash';

/**
 * @description:
 * @param {
 * clientSidePagination?: boolean
 * originalPosts?: {}
 * pageNum?: number
 * limit?: any
 *      }
 * @return {
 * isLoading: boolean;
 * posts: any[];
 * hasMore: boolean;
 *      }
 */

function usePostFetch(props) {
  const {
    clientSidePagination = false,
    originalPosts = {},
    pageNum = 1,
    limit = null,
  } = props;

  const [hasMore, setHasmore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getData = useCallback(async () => {
    setIsLoading(true);
    const { count, rows } = await getArticleList({ pageNum, limit });
    const left = limit * pageNum - count;
    left <= 0 && setHasmore(false);
    setPosts(pre => [...new Set([...pre, ...rows])]);
    setIsLoading(false);
  }, [pageNum, limit]);

  let { count, rows } = cloneDeep(originalPosts);
  const maxPages = useMemo(() => Math.ceil(count / limit), [count, limit]);

  console.log({ count, maxPages, currentPage: pageNum });

  const getDataFromLocal = useCallback(() => {
    if (pageNum >= maxPages) {
      setHasmore(false);
    }
    if (!rows || !rows.length) return;
    let data = rows.splice((pageNum - 1) * (limit * pageNum), limit);
    setPosts(pre => [...new Set([...pre, ...data])]);
  }, [pageNum, limit, originalPosts, maxPages]);

  useEffect(() => {
    setPosts([]);
  }, [originalPosts]);

  useEffect(() => {
    clientSidePagination ? getDataFromLocal() : getData();
  }, [pageNum, limit, originalPosts]);

  return {
    isLoading,
    posts,
    hasMore,
  };
}

export default usePostFetch;
