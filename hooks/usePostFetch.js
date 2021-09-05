import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { getArticleList } from '../request';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

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

usePostFetch.propTypes = {
  pageNum: PropTypes.number,
  limit: PropTypes.number,
  query: PropTypes.string,
  initialLoad: PropTypes.bool,
  clientSidePagination: PropTypes.bool,
  originalPosts: PropTypes.object,
};

function usePostFetch(props) {
  const {
    pageNum = 1,
    limit = 6,
    query = '',
    initialLoad = true,
    clientSidePagination = false,
    originalPosts = null,
  } = props;

  const [hasMore, setHasmore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const _initialLoad = useRef();
  _initialLoad.current = initialLoad;
  console.log(_initialLoad);

  const getData = useCallback(async () => {
    const axios = require('axios');
    const searchRequest = axios.CancelToken.source();
    const cancelToken = searchRequest.token;
    setIsLoading(true);
    const { count, rows } = await getArticleList({
      query,
      pageNum,
      limit,
      cancelToken,
    });
    const left = limit * pageNum - count;
    left <= 0 && setHasmore(false);
    setPosts(pre => [...new Set([...pre, ...rows])]);
    setIsLoading(false);
    return () => searchRequest.cancel();
  }, [query, pageNum, limit]);

  // used for local search
  let count, rows;
  if (originalPosts && clientSidePagination) {
    count = cloneDeep(originalPosts).count;
    rows = cloneDeep(originalPosts).rows;
  }
  const maxPages = useMemo(() => Math.ceil(count / limit), [count, limit]);

  // console.log({ count, maxPages, currentPage: pageNum });

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

  // used for server side search
  useEffect(() => {
    if (clientSidePagination) return;
    if (!_initialLoad.current) {
      _initialLoad.current = false;
      return;
    }
    const axios = require('axios');
    const searchRequest = axios.CancelToken.source();
    const cancelToken = searchRequest.token;
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { count, rows } = await getArticleList({
          query,
          pageNum,
          limit,
          cancelToken,
        });
        const left = count - limit * pageNum;
        // console.log({ count, left, pageNum, limit });
        left <= 0 && setHasmore(false);
        setPosts(pre => [...new Set([...pre, ...rows])]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(true);
      }
    };

    fetchPosts();

    return () => searchRequest.cancel();
  }, [clientSidePagination, query, pageNum, limit]);

  useEffect(() => {
    if (!clientSidePagination) return;
    getDataFromLocal();
  }, [clientSidePagination]);

  return {
    isLoading,
    posts,
    hasMore,
  };
}

export default usePostFetch;
