/*
 * @Author: Ruoyu
 * @FilePath: \next-client\pages\blog\search\index.js
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import PostCard from '../../../components/PostCard';
import FadeIn from '../../../components/FadeIn';
import InfiniteScrolling from '../../../components/InfiniteScrolling';
import SearchBar from '../../../components/SearchBar';
import LoadingCard from '../../../components/LoadingCard';

import usePostFetch from '../../../hooks/usePostFetch';

import { debounce } from 'lodash';

import { Row, Col } from 'antd';

function Search({ keywords }) {
  const Router = useRouter();
  const { cname, pid } = Router.query;
  const [pageNum, setPageNum] = useState(1);
  const getCurrentPageNum = page => {
    setPageNum(page);
  };

  const [searchString, setSearchSting] = useState('');

  const onInputSearch = useCallback(
    debounce(str => {
      let sanitizedText = str
        .trim()
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/gi, '');
      sanitizedText && setSearchSting(sanitizedText);
    }, 300)
  );
  const { isLoading, hasMore, posts } = usePostFetch({
    query: searchString,
    initialLoad: false,
    pageNum,
    limit: 6,
  });

  return (
    <div style={{ height: '100%' }}>
      <Row className='comm-main' justify='center'>
        <Col xs={16} sm={16} md={18} lg={18} xxl={18}>
          <SearchBar keywords={keywords} onInputSearch={onInputSearch} />
        </Col>
      </Row>
      <Row className='comm-main' justify='center'>
        <Col xs={16} sm={16} md={18} lg={18} xxl={18}>
          <Row className='post-list' justify='center' gutter={[18, 18]}>
            <InfiniteScrolling
              hasMore={hasMore}
              LoadingComp={LoadingCard}
              getPageNum={getCurrentPageNum}
              isLoading={isLoading}
              initialLoad={false}
            >
              {posts.map((post, i) => {
                return (
                  <Col xs={24} sm={24} md={10} xl={8} xxl={5} key={post.id}>
                    <FadeIn>
                      <PostCard postData={post} />
                    </FadeIn>
                  </Col>
                );
              })}
            </InfiniteScrolling>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
import { getArticleList } from '../../../request';

export async function getStaticProps() {
  try {
    const posts = await getArticleList();
    const keywords = posts.keywords;
    return {
      props: {
        keywords: keywords || [],
      },
    };
  } catch (e) {
    return {
      props: {
        msg: 'server error',
        posts: [],
      },
    };
  }
}

import BlogLayout from '../../../layout/BlogLayout';
Search.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};
export default Search;
