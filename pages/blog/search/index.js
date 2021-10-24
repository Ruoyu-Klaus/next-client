import { useState, useCallback } from 'react';
import Head from 'next/head';

import SearchBar from '../../../components/SearchBar';
import PostCardGridList from '../../../components/PostCardGridList';
import CustomDivider from '../../../components/CustomDivider';
import usePostFetch from '../../../hooks/usePostFetch';

import { debounce } from 'lodash';
import { Container, Flex } from '@chakra-ui/react';
function Search({ keywords }) {
  const [pageNum, setPageNum] = useState(1);
  const getCurrentPageNum = page => {
    setPageNum(page);
  };

  const [hasClickedSearch, setHasClickedSearche] = useState(false);
  const [searchString, setSearchSting] = useState(null);

  const onInputSearch = useCallback(
    debounce(str => {
      let sanitizedText = str
        .trim()
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/gi, '');
      sanitizedText && setSearchSting(sanitizedText);
      setHasClickedSearche(true);
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
        <PostCardGridList
          posts={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          getCurrentPageNum={getCurrentPageNum}
        />
        {(!posts || posts.length === 0) && hasClickedSearch && (
          <CustomDivider text={'没有找到结果'} dividerWidth={'25%'} />
        )}
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
