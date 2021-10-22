import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import PostCard from '../../../components/PostCard';
import FadeIn from '../../../components/FadeIn';
import InfiniteScrolling from '../../../components/InfiniteScrolling';
import SearchBar from '../../../components/SearchBar';
import LoadingCard from '../../../components/LoadingCard';

import usePostFetch from '../../../hooks/usePostFetch';

import { debounce } from 'lodash';

import { Container, SimpleGrid, Flex } from '@chakra-ui/react';

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
    <>
      <Head>
        <title>搜索 | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container maxW='container.xl' mt={8}>
        <Flex flexDir='column' justify='center'>
          <SearchBar keywords={keywords} onInputSearch={onInputSearch} />
        </Flex>
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
              {posts.map((post, i) => (
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
      </Container>
    </>
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
