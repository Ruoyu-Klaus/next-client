import { useCallback, useMemo, useState } from "react";
import Head from "next/head";

import SearchBar from "../../../components/SearchBar";
import PostCardGridList from "../../../components/PostCardGridList";
import CustomDivider from "../../../components/CustomDivider";
import usePaginationPost from "../../../hooks/usePaginationPost";

import { debounce } from "lodash";
import { Container, Flex } from "@chakra-ui/react";

const debouncedChangeHandler = (fn) => debounce(fn, 200);

function Index({ blogCollection }) {
  const { blogs: originalPosts, tags: keywords } = blogCollection;

  const [pageNum, setPageNum] = useState(1);
  const getCurrentPageNum = useCallback((page) => setPageNum(page), []);

  const [hasClickedSearch, setHasClickedSearch] = useState(false);

  const { isLoading, hasMore, posts, changSearchValue } = usePaginationPost({
    enableSearch: true,
    pageNum,
    originalPosts,
    limit: 9,
  });

  const searchHandler = useCallback((str) => {
    const sanitizedText = str
      .trim()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\\.]+/gi, "");
    changSearchValue(sanitizedText);
    sanitizedText ? setHasClickedSearch(true) : setHasClickedSearch(false);
  }, []);

  const onInputSearch = debouncedChangeHandler(searchHandler);

  const searchBar = useMemo(
    () => <SearchBar keywords={keywords} onInputSearch={onInputSearch} />,
    [keywords]
  );

  const loadingBar = useMemo(
    () =>
      (!posts || posts.length === 0) &&
      hasClickedSearch &&
      !isLoading && (
        <CustomDivider text={"没有找到结果"} dividerWidth={"25%"} />
      ),
    [isLoading, hasClickedSearch, posts.length]
  );

  return (
    <>
      <Head>
        <title>搜索 | Ruoyu</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <Container maxW="container.xl" mt={8}>
        <Flex flexDir="column" justify="center">
          {searchBar}
        </Flex>
        <PostCardGridList
          posts={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          getCurrentPageNum={getCurrentPageNum}
        />
        {loadingBar}
      </Container>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

import BlogLayout from "../../../layout/BlogLayout";

Index.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};

export default Index;
