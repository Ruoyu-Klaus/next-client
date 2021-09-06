/*
 * @Author: your name
 * @Date: 2021-08-26 12:32:45
 * @LastEditTime: 2021-09-06 11:12:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \next-client\pages\blog\post\[cname]\index.js
 */
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PostCard from '../../../../components/PostCard';
import FadeIn from '../../../../components/FadeIn';
import InfiniteScrolling from '../../../../components/InfiniteScrolling';
import LoadingCard from '../../../../components/LoadingCard';
import usePostFetch from '../../../../hooks/usePostFetch';

import { Row, Col } from 'antd';

const Category = ({ posts }) => {
  const [pageNum, setPageNum] = useState(1);
  const [fetchPosts, setFetchPosts] = useState(() => posts);

  useEffect(() => {
    setFetchPosts(posts);
  }, [posts]);

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
              LoadingComp={LoadingCard}
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
  );
};

import {
  getArticleCategories,
  getArticleByCategoryId,
} from '../../../../request';

// This function gets called at build time
export async function getStaticProps(context) {
  const { params } = context;
  const category_name = params.cname;
  try {
    const categorys = await getArticleCategories();
    const thisCategory = categorys.filter(
      category => category.category_name === category_name
    )[0];
    const posts = await getArticleByCategoryId(thisCategory.id);
    // will receive `posts` as a prop at build time
    return {
      props: {
        posts,
      },
    };
  } catch (e) {
    return {
      props: {
        msg: 'server error',
        posts: [],
      },
      redirect: {
        destination: '/blog',
        statusCode: 304,
      },
    };
  }
}
export async function getStaticPaths() {
  try {
    const categorys = await getArticleCategories();
    const paths = categorys.map(category => ({
      params: {
        cname: encodeURIComponent(category.category_name),
      },
    }));
    return {
      paths: paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
}

import BlogLayout from '../../../../layout/BlogLayout';
Category.getLayout = function getLayout(page) {
  return <BlogLayout>{page}</BlogLayout>;
};
export default Category;
