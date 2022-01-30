import React, { useEffect } from "react";

// import { getArticleList } from '../pages/api/request';

function usePostSearch(query) {
  useEffect(() => {
    // await getArticleList(query);
  }, [query]);
  return <div></div>;
}

export default usePostSearch;
