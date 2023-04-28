import Head from 'next/head'
import BlogLayout from '../../layout/BlogLayout'
import {getAllBlogsList} from '../../helpers'
import BackToTop from '../../components/BackToTop'
import VirtualGridList from '../../components/VirtualGridList'

function Index({posts}) {
    return (
        <>
            <Head>
                <title>Blog | 博客</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="blogs" />
            </Head>
            <VirtualGridList posts={posts} />
            <BackToTop />
        </>
    )
}
export async function getStaticProps() {
    try {
        const posts = getAllBlogsList()
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

Index.getLayout = function getLayout(page) {
    return <BlogLayout showModel>{page}</BlogLayout>
}

export default Index
