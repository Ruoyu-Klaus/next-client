import { useState } from "react";
import Head from "next/head";

import SearchBar from "../../../components/SearchBar";
import PostCardGridList from "../../../components/PostCardGridList";
import CustomDivider from "../../../components/CustomDivider";
import usePostFetch from "../../../hooks/usePostFetch";

import { debounce } from "lodash";
import { Container, Flex } from "@chakra-ui/react";

function Search({ blogCollection }) {
  const [pageNum, setPageNum] = useState(1);
  const getCurrentPageNum = (page) => {
    setPageNum(page);
  };

  const [hasClickedSearch, setHasClickedSearch] = useState(false);
  const [searchString, setSearchSting] = useState("");

  const onInputSearch = debounce((str) => {
    const sanitizedText = str
      .trim()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\\.]+/gi, "");
    setSearchSting(sanitizedText);
    sanitizedText ? setHasClickedSearch(true) : setHasClickedSearch(false);
  }, 500);

  const { blogs: originalPosts, tags: keywords } = blogCollection;

  const { isLoading, hasMore, posts } = usePostFetch({
    useSearch: true,
    query: searchString,
    initialLoad: false,
    pageNum,
    originalPosts,
    limit: 6,
  });

  return (
    <>
      <Head>
        <title>搜索 | Ruoyu</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <Container maxW="container.xl" mt={8}>
        <Flex flexDir="column" justify="center">
          <SearchBar keywords={keywords} onInputSearch={onInputSearch} />
        </Flex>
        <PostCardGridList
          posts={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          getCurrentPageNum={getCurrentPageNum}
        />
        {(!posts || posts.length === 0) && hasClickedSearch && !isLoading && (
          <CustomDivider text={"没有找到结果"} dividerWidth={"25%"} />
        )}
      </Container>
    </>
  );
}

import BlogLayout from "../../../layout/BlogLayout";
Search.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};
export default Search;
