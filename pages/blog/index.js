import { useState } from 'react'
import Head from 'next/head'

import PostCardGridList from '../../components/PostCardGridList'
import Farm3DModal from '../../components/Farm3DModal'
import usePostFetch from '../../hooks/usePostFetch'

function Blog({ posts: pagePosts }) {
  const [pageNum, setPageNum] = useState(1)
  const [fetchPosts] = useState(pagePosts)
  const getCurrentPageNum = page => {
    setPageNum(page)
  }

  const { isLoading, hasMore, posts } = usePostFetch({
    pageNum,
    clientSidePagination: true,
    originalPosts: fetchPosts,
    limit: 6,
  })
  return (
    <>
      <Head>
        <title>博客 | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Farm3DModal />
      <PostCardGridList
        posts={posts}
        isLoading={isLoading}
        hasMore={hasMore}
        getCurrentPageNum={getCurrentPageNum}
      />
    </>
  )
}

import { getArticleList } from '../../request'

// This function gets called at build time
export async function getStaticProps() {
  try {
    const posts = await getArticleList()
    return {
      props: {
        posts: posts || [],
      },
    }
  } catch (e) {
    return {
      props: {
        msg: 'server error',
        posts: [],
      },
    }
  }
}

import BlogLayout from '../../layout/BlogLayout'
Blog.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>
}

export default Blog
