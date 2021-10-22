import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

import PostCard from '../../../../components/PostCard';
import FadeIn from '../../../../components/FadeIn';
import InfiniteScrolling from '../../../../components/InfiniteScrolling';
import LoadingCard from '../../../../components/LoadingCard';
import usePostFetch from '../../../../hooks/usePostFetch';

import { Container, SimpleGrid } from '@chakra-ui/react';

function Category({ posts }) {
  const router = useRouter();
  const { cname } = router.query;

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
  console.log(fetchPosts);

  return (
    <>
      <Head>
        <title>{cname} | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container maxW='container.xl' mt={8}>
        <SimpleGrid
          minChildWidth='350px'
          spacing='8'
          justifyItems='center'
          alignItems='center'
        >
          <InfiniteScrolling
            hasMore={hasMore}
            getPageNum={getCurrentPageNum}
            isLoading={isLoading}
          >
            {pagePosts.map((post, i) => (
              <FadeIn key={i}>
                <PostCard
                  postDetails={post}
                  isLoading={isLoading}
                  LoadingComp={LoadingCard}
                />
              </FadeIn>
            ))}
          </InfiniteScrolling>
        </SimpleGrid>
      </Container>
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
