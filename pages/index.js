import Head from 'next/head'
import BlogLayout from '../layout/BlogLayout'
import {getAllBlogsList} from '../helpers'
import BackToTop from '../components/BackToTop'
import PostCardGridList from '../components/PostCardGridList'
import {Text, Box} from '@chakra-ui/react'
import {useRouter} from 'next/router'

function Index({posts}) {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>Blog | 博客</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="blogs" />
            </Head>

            <PostCardGridList posts={posts} />

            <Box my={8}>
                <Text
                    userSelect="none"
                    margin="0 auto"
                    w="fit-content"
                    onClick={() => router.push('blog/1')}
                    cursor="pointer"
                    textDecoration="underline"
                    fontSize="lg"
                    textAlign="center"
                >
                    See More...
                </Text>
            </Box>

            <BackToTop />
        </>
    )
}
export async function getStaticProps() {
    try {
        const totalPosts = getAllBlogsList()
        const posts = totalPosts.slice(0, 4)
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
