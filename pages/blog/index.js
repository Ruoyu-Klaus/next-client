import {useMemo, useState} from 'react'

import PostCardGridList from '../../components/PostCardGridList'
import usePaginationPost from '../../hooks/usePaginationPost'
import {getPosts} from '../../services'
import {isProduction} from '../../helpers/env'
import BlogLayout from '../../layout/BlogLayout'
import HTML_Head from '../../components/HTML_Head'

function Index({posts: originalPosts}) {
    const [pageNum, setPageNum] = useState(1)
    const getCurrentPageNum = (page) => {
        setPageNum(page)
    }

    const hookConfig = useMemo(() => ({pageNum, originalPosts, limit: 9}), [pageNum, originalPosts])

    const {isLoading, hasMore, posts} = usePaginationPost(hookConfig)

    return (
        <>
            <HTML_Head title={'博客'} />
            <PostCardGridList posts={posts} isLoading={isLoading} hasMore={hasMore} getCurrentPageNum={getCurrentPageNum} />
        </>
    )
}

export async function getStaticProps() {
    const posts = await getPosts()
    return {
        props: {
            posts: isProduction ? posts.filter((post) => post.published === true) : posts,
        },
    }
}

Index.getLayout = function getLayout(page, categories, model) {
    return (
        <BlogLayout categories={categories} model={model}>
            {page}
        </BlogLayout>
    )
}

export default Index
