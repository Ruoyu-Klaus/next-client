import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'

import PostCardGridList from '../../../../components/PostCardGridList'
import usePostFetch from '../../../../hooks/usePostFetch'
function Category({ posts: postsByCategory }) {
  const router = useRouter()
  const { cname } = router.query

  const [pageNum, setPageNum] = useState(1)

  const getCurrentPageNum = page => {
    setPageNum(page)
  }

  const { isLoading, hasMore, posts } = usePostFetch({
    pageNum,
    clientSidePagination: true,
    originalPosts: postsByCategory,
    limit: 6,
  })

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
  )
}

import { BlogCollection } from '../../../../helpers/'

export async function getStaticProps(context) {
  const { params } = context
  const category_name = params.cname
  try {
    const blogCollection = new BlogCollection()
    const posts = blogCollection.getBlogsByCategory(category_name)
    return {
      props: {
        posts,
      },
    }
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
    }
  }
}
export async function getStaticPaths() {
  try {
    const blogCollection = new BlogCollection()
    const categories = blogCollection.categories

    const paths = categories.map(category => ({
      params: {
        cname: encodeURIComponent(category),
      },
    }))
    return {
      paths: paths,
      fallback: false,
    }
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    }
  }
}

import BlogLayout from '../../../../layout/BlogLayout'
Category.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>
}
export default Category
