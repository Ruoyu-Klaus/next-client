import {useCallback} from 'react'
import Head from 'next/head'

import SearchBar from '../../../components/SearchBar'
import PostCardGridList from '../../../components/PostCardGridList'
import useSearchPost from '../../../hooks/useSearchPost'

import {debounce} from 'lodash'
import {Container, Flex} from '@chakra-ui/react'
import BlogLayout from '../../../layout/BlogLayout'

import tags from '../../../_posts/tags.json'
import {getAllBlogs} from '../../../helpers'

const debouncedChangeHandler = (fn) => debounce(fn, 200)

function Index({posts: originalPosts}) {
    const keywords = tags
    const {posts, setSearchValue} = useSearchPost({originalPosts})

    const searchHandler = useCallback((str) => {
        const sanitizedText = str.trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\\.]+/gi, '')
        setSearchValue(sanitizedText)
    }, [])

    const onInputSearch = debouncedChangeHandler(searchHandler)

    return (
        <>
            <Head>
                <title>搜索 | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="search blogs" />
            </Head>
            <Container maxW="container.xl" mt={8}>
                <Flex flexDir="column" justify="center">
                    <SearchBar keywords={keywords} onInputSearch={onInputSearch} />
                </Flex>
                <PostCardGridList posts={posts} />
            </Container>
        </>
    )
}

export async function getStaticProps() {
    const posts = getAllBlogs() || []
    return {
        props: {
            posts,
        },
    }
}

Index.getLayout = function getLayout(page, categories) {
    return <BlogLayout categories={categories}>{page}</BlogLayout>
}

export default Index
