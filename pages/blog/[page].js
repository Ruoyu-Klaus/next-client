import Head from 'next/head'

import {getAllBlogsList, pageCount} from '../../helpers'
import {PAGINATION_PER_SIZE} from '../../utils/content'
import BlogLayout from '../../layout/BlogLayout'
import BackToTop from '../../components/BackToTop'
import Pagination from '../../components/Pagination'

import PostCardGridList from '../../components/PostCardGridList'

function Category({posts, totalPageCount}) {
    return (
        <>
            <Head>
                <title>Blogs | Ruoyu </title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="tech blogs" />
            </Head>
            <PostCardGridList posts={posts} />
            <Pagination totalPageCount={totalPageCount} />
            <BackToTop />
        </>
    )
}

export async function getStaticProps({params}) {
    try {
        const currentPage = params.page

        const totalPosts = getAllBlogsList()

        const posts = totalPosts.slice(PAGINATION_PER_SIZE * Number(currentPage) - PAGINATION_PER_SIZE, PAGINATION_PER_SIZE * Number(currentPage))
        const totalPageCount = pageCount(totalPosts.length, PAGINATION_PER_SIZE)
        return {
            props: {
                posts,
                totalPageCount: totalPageCount,
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

export async function getStaticPaths() {
    const posts = getAllBlogsList()
    const totalPageCount = pageCount(posts.length, PAGINATION_PER_SIZE)
    const pageIntoArray = Array.from(Array(totalPageCount).keys())

    let paths = []
    pageIntoArray.map((path) =>
        paths.push({
            params: {
                page: `${path + 1}`,
            },
        }),
    )

    try {
        return {
            paths,
            fallback: false,
        }
    } catch (error) {
        return {
            paths: [],
            fallback: true,
        }
    }
}

Category.getLayout = function getLayout(page) {
    return <BlogLayout showModel>{page}</BlogLayout>
}

Category.showModel = true

export default Category
