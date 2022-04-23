import {useRouter} from 'next/router'
import {useMemo, useState} from 'react'

import PostCardGridList from '../../../../components/PostCardGridList'
import usePaginationPost from '../../../../hooks/usePaginationPost'
import {getCategories, getPostsByCategoryId} from '../../../../services'
import {isProduction} from '../../../../helpers/env'
import BlogLayout from '../../../../layout/BlogLayout'
import HTML_Head from '../../../../components/HTML_Head'

function Category({posts: originalPosts}) {
    const router = useRouter()
    const {cname} = router.query

    const [pageNum, setPageNum] = useState(1)

    const getCurrentPageNum = (page) => {
        setPageNum(page)
    }
    const hookConfig = useMemo(() => ({pageNum, originalPosts, limit: 9}), [pageNum, originalPosts])

    const {isLoading, hasMore, posts} = usePaginationPost(hookConfig)

    return (
        <>
            <HTML_Head title={cname} />
            <PostCardGridList posts={posts} isLoading={isLoading} hasMore={hasMore} getCurrentPageNum={getCurrentPageNum} />
        </>
    )
}

export async function getStaticProps(context) {
    const {params} = context
    const category_slug = params.cname
    const categories = await getCategories()
    const _category = categories.find((c) => c.slug === category_slug)
    if (!_category) {
        return {
            props: {
                posts: [],
            },
            redirect: {
                destination: '/blog',
                statusCode: 304,
            },
        }
    }
    const {id} = _category
    const posts = await getPostsByCategoryId(id)
    return {
        props: {
            posts: isProduction ? posts.filter((post) => post.published === true) : posts,
        },
    }
}

export async function getStaticPaths() {
    try {
        const categories = await getCategories()
        const paths = categories.map((category) => ({params: {cname: encodeURIComponent(category.slug)}}))
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

Category.getLayout = function getLayout(page, categories, model) {
    return (
        <BlogLayout categories={categories} model={model}>
            {page}
        </BlogLayout>
    )
}
export default Category
