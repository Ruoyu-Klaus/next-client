import {useRouter} from 'next/router'
import {useMemo, useState} from 'react'
import Head from 'next/head'

import PostCardGridList from '../../../../components/PostCardGridList'
import usePaginationPost from '../../../../hooks/usePaginationPost'
import categories from '../../../../_posts/categories.json'
import {getAllBlogs} from '../../../../helpers/'
import BlogLayout from '../../../../layout/BlogLayout'

function Category({posts: originalPosts}) {
    const router = useRouter()
    const {cname} = router.query

    const [pageNum, setPageNum] = useState(1)

    const getCurrentPageNum = (page) => {
        setPageNum(page)
    }
    const hookConfig = useMemo(() => ({pageNum, limit: 9}), [pageNum])
    const {isLoading, hasMore, posts} = usePaginationPost({...hookConfig, originalPosts})

    return (
        <>
            <Head>
                <title>{cname} | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PostCardGridList posts={posts} isLoading={isLoading} hasMore={hasMore} getCurrentPageNum={getCurrentPageNum} />
        </>
    )
}

export async function getStaticProps(context) {
    const {params} = context
    const category_name = params.cname
    try {
        const posts = getAllBlogs().filter((blog) => blog.category === category_name)
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
        const paths = categories.map((category) => ({
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
            fallback: true,
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
