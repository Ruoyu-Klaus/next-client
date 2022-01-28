import { useCallback, useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";

usePostFetch.propTypes = {
  pageNum: PropTypes.number,
  limit: PropTypes.number,
  query: PropTypes.string,
  initialLoad: PropTypes.bool,
  clientSidePagination: PropTypes.bool,
  originalPosts: PropTypes.object,
};

const filterPost = (post, query) => {
  const _query = query.toLowerCase();

  return post.filter((post) => {
    return (
      post.title.toLowerCase().includes(_query) ||
      post.tags.join(" ").toLowerCase().includes(_query) ||
      post.excerpt.toLowerCase().includes(_query) ||
      post.category.toLowerCase().includes(_query)
    );
  });
};

function usePostFetch(props) {
  const {
    pageNum = 1,
    limit = 6,
    query = "",
    useSearch = false,
    clientSidePagination = false,
    originalPosts = [],
  } = props;

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getCountAndData = useCallback(() => {
    if (useSearch && !query) {
      return { count: 0, rows: [] };
    }
    const copyPosts = query
      ? filterPost(originalPosts, query)
      : cloneDeep(originalPosts);
    console.log({ query, copyPosts });
    return { count: copyPosts.length, rows: copyPosts };
  }, [query, useSearch, originalPosts]);

  const getPostsByPage = () => {
    const { count, rows } = getCountAndData();
    if (count === 0) {
      setPosts([]);
      return;
    }
    const maxPages = count / limit;
    if (pageNum >= maxPages) {
      setHasMore(false);
    }
    let data = rows.splice((pageNum - 1) * (limit * (pageNum - 1)), limit);
    setPosts((pre) => [...new Set([...pre, ...data])]);
  };

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setIsLoading(false);
  }, [query]);

  useEffect(() => {
    getPostsByPage();
  }, [pageNum, query]);

  return {
    isLoading,
    posts,
    hasMore,
  };
}

export default usePostFetch;
