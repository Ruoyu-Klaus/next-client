import { useState } from 'react'
import Head from 'next/head'

import PostCardGridList from '../../components/PostCardGridList'
import usePostFetch from '../../hooks/usePostFetch'

import dynamic from 'next/dynamic'
import FarmModalLoadingSpinner from '../../components/FarmModalContainer'
const ThreejsCanvas = dynamic(() => import('../../components/ThreejsCanvas'), {
  ssr: false,
  loading: () => <FarmModalLoadingSpinner />,
})
function Index({ posts: pagePosts }) {
  const [pageNum, setPageNum] = useState(1)
  const getCurrentPageNum = page => {
    setPageNum(page)
  }

  const { isLoading, hasMore, posts } = usePostFetch({
    pageNum,
    clientSidePagination: true,
    originalPosts: pagePosts,
    limit: 6,
  })

  return (
    <>
      <Head>
        <title>博客 | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ThreejsCanvas />
      <PostCardGridList
        posts={posts}
        isLoading={isLoading}
        hasMore={hasMore}
        getCurrentPageNum={getCurrentPageNum}
      />
    </>
  )
}

import { Blog } from '../../helpers/index'
export async function getStaticProps() {
  try {
    const blog = new Blog()
    const posts = blog.getAllBlogs()

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
Index.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>
}

export default Index
