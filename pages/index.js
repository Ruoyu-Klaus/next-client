import Head from 'next/head'
import BlogLayout from '../layout/BlogLayout'
import {getAllBlogsList} from '../helpers'
import BackToTop from '../components/BackToTop'
import PostCardGridList from '../components/PostCardGridList'

function Index({posts}) {
    return (
        <>
            <Head>
                <title>Blog | 博客</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="blogs" />
            </Head>

            <PostCardGridList posts={posts} />
            <BackToTop />
        </>
    )
}
export async function getStaticProps() {
    try {
        const totalPosts = getAllBlogsList()
        const posts = totalPosts.slice(0, 6)
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
                statusCode: 301,
            },
        }
    }
}

Index.getLayout = function getLayout(page) {
    return <BlogLayout showModel>{page}</BlogLayout>
}
Index.showModel = true

export default Index
