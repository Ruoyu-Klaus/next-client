import {useCallback, useMemo, useState} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import SearchBar from '../../../components/SearchBar'
import PostCardGridList from '../../../components/PostCardGridList'
import usePaginationPost from '../../../hooks/usePaginationPost'

import {debounce} from 'lodash'
import {Container, Flex} from '@chakra-ui/react'
import BlogLayout from '../../../layout/BlogLayout'
import {SEARCH_NOT_FOUND} from '../../../utils/content'

import tags from '../../../_posts/tags.json'
import {getAllBlogs} from '../../../helpers'

const CustomDivider = dynamic(() => import('../../../components/CustomDivider'))

const debouncedChangeHandler = (fn) => debounce(fn, 200)

function Index({posts: originalPosts}) {
    const keywords = tags

    const [pageNum, setPageNum] = useState(1)
    const getCurrentPageNum = useCallback((page) => setPageNum(page), [])

    const [hasClickedSearch, setHasClickedSearch] = useState(false)

    const hookConfig = useMemo(() => ({enableSearch: true, pageNum, originalPosts, limit: 9}), [pageNum])

    const {isLoading, hasMore, posts, changeSearchValue} = usePaginationPost(hookConfig)

    const searchHandler = useCallback((str) => {
        const sanitizedText = str.trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\\.]+/gi, '')
        changeSearchValue(sanitizedText)
        sanitizedText ? setHasClickedSearch(true) : setHasClickedSearch(false)
    }, [])

    const onInputSearch = debouncedChangeHandler(searchHandler)

    const loadingBar = useMemo(
        () => (!posts || posts.length === 0) && hasClickedSearch && !isLoading && <CustomDivider text={SEARCH_NOT_FOUND} dividerWidth={'25%'} />,
        [isLoading, hasClickedSearch, posts.length],
    )

    return (
        <>
            <Head>
                <title>搜索 | Ruoyu</title>
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <Container maxW="container.xl" mt={8}>
                <Flex flexDir="column" justify="center">
                    <SearchBar keywords={keywords} onInputSearch={onInputSearch} />
                </Flex>
                <PostCardGridList posts={posts} isLoading={isLoading} hasMore={hasMore} getCurrentPageNum={getCurrentPageNum} />
                {loadingBar}
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
