import { useState, useCallback } from 'react';
import Head from 'next/head';
import PostCard from '../components/PostCard';
import FadeIn from '../components/FadeIn';
import InfiniteScrolling from '../components/InfiniteScrolling';

import usePostFetch from '../hooks/usePostFetch';

import { Row, Col, Skeleton } from 'antd';

let handleSearch = { func: null };

function Blog({ posts }) {
  const loadingNode = <Skeleton loading={true} avatar active />;

  const [pageNum, setPageNum] = useState(1);
  const [fetchPosts, setFetchPosts] = useState(posts);

  handleSearch.func = searchWords => {
    if (!searchWords) return setFetchPosts(posts);
    const { rows: _rows, count: _count } = posts;
    let rows = _rows.filter(
      post =>
        post.post_title.match(searchWords) ||
        post.post_content.match(searchWords) ||
        post.post_introduce.match(searchWords)
    );
    let count = rows.length;
    let result = { rows, count };
    return setFetchPosts(result);
  };

  const getCurrentPageNum = page => {
    setPageNum(page);
  };

  const {
    isLoading,
    hasMore,
    posts: pagePosts,
  } = usePostFetch({
    pageNum,
    clientSidePagination: true,
    originalPosts: fetchPosts,
    limit: 6,
  });

  return (
    <>
      <Head>
        <title>博客 | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div style={{ height: '100%' }}>
        <Row className='comm-main' type='flex' justify='center'>
          <Col xs={16} sm={16} md={18} lg={18} xxl={18}>
            <Row
              className='post-list'
              type='flex'
              justify='flex-start'
              gutter={[16, 16]}
            >
              <InfiniteScrolling
                hasMore={hasMore}
                loadingNode={loadingNode}
                getPageNum={getCurrentPageNum}
                isLoading={isLoading}
                initialLoad={false}
              >
                {pagePosts.map((post, i) => {
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
    </>
  );
}

import { getArticleList } from '../request';

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  try {
    const posts = await getArticleList();
    // will receive `posts` as a prop at build time
    return {
      props: {
        posts: posts || [],
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

import BlogLayout from '../layout/BlogLayout';
Blog.getLayout = function getLayout(page) {
  return <BlogLayout handleSearch={handleSearch}>{page}</BlogLayout>;
};

export default Blog;
