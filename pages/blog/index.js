import Head from 'next/head'

import PostCardGridList from '../../components/PostCardGridList'
import BlogLayout from '../../layout/BlogLayout'
import {getAllBlogs} from '../../helpers'

function Index({posts}) {
    return (
        <>
            <Head>
                <title>博客 | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="blogs" />
            </Head>
            <PostCardGridList posts={posts} />
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
