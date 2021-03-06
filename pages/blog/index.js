import {useMemo, useState} from 'react'
import Head from 'next/head'

import PostCardGridList from '../../components/PostCardGridList'
import usePaginationPost from '../../hooks/usePaginationPost'
import BlogLayout from '../../layout/BlogLayout'
import {getAllBlogs} from '../../helpers'

function Index({posts: originalPosts}) {
    const [pageNum, setPageNum] = useState(1)
    const getCurrentPageNum = (page) => {
        setPageNum(page)
    }
    const hookConfig = useMemo(() => ({pageNum, originalPosts, limit: 9}), [pageNum])

    const {isLoading, hasMore, posts} = usePaginationPost(hookConfig)

    return (
        <>
            <Head>
                <title>博客 | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PostCardGridList posts={posts} isLoading={isLoading} hasMore={hasMore} getCurrentPageNum={getCurrentPageNum} />
        </>
    )
}
export async function getStaticProps() {
    try {
        const posts = getAllBlogs()
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
                destination: '/',
                statusCode: 304,
            },
        }
    }
}

Index.getLayout = function getLayout(page, categories) {
    return (
        <BlogLayout categories={categories} showModel>
            {page}
        </BlogLayout>
    )
}

export default Index
