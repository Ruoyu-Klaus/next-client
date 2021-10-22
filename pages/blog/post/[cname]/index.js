import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

import PostCardGridList from '../../../../components/PostCardGridList';
import usePostFetch from '../../../../hooks/usePostFetch';
function Category({ posts: pagePosts }) {
  const router = useRouter();
  const { cname } = router.query;

  const [pageNum, setPageNum] = useState(1);
  const [fetchPosts, setFetchPosts] = useState(() => pagePosts);

  useEffect(() => {
    setFetchPosts(pagePosts);
  }, [pagePosts]);

  const getCurrentPageNum = page => {
    setPageNum(page);
  };

  const { isLoading, hasMore, posts } = usePostFetch({
    pageNum,
    clientSidePagination: true,
    originalPosts: fetchPosts,
    limit: 6,
  });

  return (
    <>
      <Head>
        <title>{cname} | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <PostCardGridList
        posts={posts}
        isLoading={isLoading}
        hasMore={hasMore}
        getCurrentPageNum={getCurrentPageNum}
      />
    </>
  );
}

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
Category.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};
export default Category;
