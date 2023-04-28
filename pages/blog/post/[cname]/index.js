import {useRouter} from 'next/router'
import Head from 'next/head'
import categories from '../../../../_posts/categories.json'
import {getAllBlogsList} from '../../../../helpers/'
import BlogLayout from '../../../../layout/BlogLayout'
import BackToTop from '../../../../components/BackToTop'
import VirtualGridList from '../../../../components/VirtualGridList'

function Category({posts}) {
    const router = useRouter()
    const {cname} = router.query

    return (
        <>
            <Head>
                <title>{cname} | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={`${cname} blogs`} />
            </Head>
            <VirtualGridList posts={posts} />
            <BackToTop />
        </>
    )
}

export async function getStaticProps(context) {
    const {params} = context
    const category_name = params.cname
    try {
        const posts = getAllBlogsList().filter((blog) => blog.category === category_name)
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

Category.getLayout = function getLayout(page) {
    return <BlogLayout showModel>{page}</BlogLayout>
}
export default Category
