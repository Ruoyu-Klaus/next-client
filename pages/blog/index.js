import { useState } from 'react';
import Head from 'next/head';

import PostCard from '../../components/PostCard';
import FadeIn from '../../components/FadeIn';
import InfiniteScrolling from '../../components/InfiniteScrolling';
import LoadingCard from '../../components/LoadingCard';

import usePostFetch from '../../hooks/usePostFetch';

import { Container, SimpleGrid } from '@chakra-ui/react';

function Blog({ posts }) {
  const [pageNum, setPageNum] = useState(1);
  const [fetchPosts] = useState(posts);
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

import { getArticleList } from '../../request';

// This function gets called at build time
export async function getStaticProps() {
  try {
    const posts = await getArticleList();
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

import BlogLayout from '../../layout/BlogLayout';
Blog.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};

export default Blog;
