import { useState } from "react";
import Head from "next/head";

import PostCardGridList from "../../components/PostCardGridList";
import usePaginationPost from "../../hooks/usePaginationPost";

function Index({ blogCollection }) {
  const [pageNum, setPageNum] = useState(1);
  const getCurrentPageNum = (page) => {
    setPageNum(page);
  };
  const originalPosts = blogCollection.blogs;

  const { isLoading, hasMore, posts } = usePaginationPost({
    pageNum,
    originalPosts,
    limit: 9,
  });

  return (
    <>
      <Head>
        <title>博客 | Ruoyu</title>
        <link rel="icon" href="/favicon.ico" />
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

export async function getStaticProps() {
  return {
    props: {},
  };
}

import BlogLayout from "../../layout/BlogLayout";

Index.getLayout = function getLayout(page, categories, model) {
  return (
    <BlogLayout categories={categories} model={model}>
      {page}
    </BlogLayout>
  );
};

export default Index;
