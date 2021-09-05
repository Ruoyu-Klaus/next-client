/*
 * @Author: your name
 * @Date: 2021-08-20 23:28:12
 * @LastEditTime: 2021-09-05 21:59:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \next-client\components\InfiniteScrolling.js
 */
import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

function InfiniteScrolling(props) {
  const {
    getPageNum,
    pageStart,
    children,
    isLoading,
    hasMore = true,
    LoadingComp,
  } = props;
  const [page, setPage] = useState(pageStart || 1);

  const observer = useRef();
  const lastChildRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          getPageNum(page + 1);
          setPage(pre => pre + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <>
      {children.map((child, index) => {
        if (children.length - 1 === index) {
          return React.cloneElement(child, { ref: lastChildRef });
        } else {
          return child;
        }
      })}
      {isLoading && <LoadingComp />}
    </>
  );
}

InfiniteScrolling.propTypes = {
  children: PropTypes.node.isRequired,
  getPageNum: PropTypes.func.isRequired,
  pageStart: PropTypes.number,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  LoadingComp: PropTypes.elementType,
};

export default InfiniteScrolling;
