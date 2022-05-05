import {useMemo, useState} from 'react'
import Head from 'next/head'

import PostCardGridList from '../../components/PostCardGridList'
import usePaginationPost from '../../hooks/usePaginationPost'
import BlogLayout from '../../layout/BlogLayout'

function Index({blogCollection}) {
    const [pageNum, setPageNum] = useState(1)
    const getCurrentPageNum = (page) => {
        setPageNum(page)
    }
    const originalPosts = blogCollection.blogs

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

Index.getLayout = function getLayout(page, categories, model) {
    return (
        <BlogLayout categories={categories} model={model}>
            {page}
        </BlogLayout>
    )
}

export default Index
