import {Box, Container, Flex, Heading, HStack, Image, Tag, Text, VStack} from '@chakra-ui/react'
import dayjs from 'dayjs'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import BackToTop from '../../../../components/BackToTop'
import CustomDivider from '../../../../components/CustomDivider'
import LinkToPost from '../../../../components/LinkToPost'
import Toc from '../../../../components/Toc'
import {BlogCollection, randomEmoji} from '../../../../helpers'
import BlogLayout from '../../../../layout/BlogLayout'
import {NEXT_POST_LABEL, PREVIOUS_POST_LABEL} from '../../../../utils/content'

function Post({post = {}, previousPath, nextPath}) {
    const router = useRouter()
    const [emoji] = useState(randomEmoji())

    const {id, title, coverImage, tags, category, content, date, tocTree} = post
    // const { cname, slug } = router.searchValue
    // const id = slug[0]
    useEffect(() => {
        !id && router.push('/blog')
    }, [])

    return (
        <>
            <Head>
                <title>{title} | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container maxW="container.xl" my={8}>
                <CustomDivider my={4} text={emoji} dividerWidth="full" />
                <VStack spacing="4">
                    <Image w={['90%', '80vw', '60vw']} maxW="600px" objectFit="contain" src={coverImage} />
                    <HStack spacing={4}>
                        {tags?.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </HStack>
                    <Box w={['90%', '80vw', '60vw']} maxW="1000px">
                        <Heading>{title}</Heading>
                    </Box>

                    <Flex w={['90%', '80vw', '60vw']} maxW="1000px" gap={4}>
                        <Text fontSize="0.8rem">{category}</Text>
                        <Text fontSize="0.8rem">{dayjs(date).format('MM-DD, YYYY')}</Text>
                    </Flex>

                    <Box w={['90%', '80vw', '60vw']} maxW="1000px" className="markdown-body">
                        <Toc tocTree={tocTree} />
                    </Box>

                    <Box
                        w={['90%', '80vw', '60vw']}
                        maxW="1000px"
                        className="markdown-body"
                        id="content"
                        dangerouslySetInnerHTML={{__html: content}}
                    />
                    <CustomDivider my={4} text={emoji} dividerWidth="full" />

                    <Flex w={['auto', 'full']} justifyContent={['center', 'space-between']} flexDir={['column', 'row']}>
                        <LinkToPost payload={previousPath} />
                        <LinkToPost payload={nextPath} />
                    </Flex>
                </VStack>
                <BackToTop />
            </Container>
        </>
    )
}

export async function getStaticProps(context) {
    try {
        const {params} = context
        const category_name = params.cname
        const [id] = params.slug

        const blogCollection = new BlogCollection()
        const linkPaths = blogCollection.getAllPostPaths(true)
        const post = blogCollection.getBlogByCategoryAndId(category_name, id)

        if (!post) {
            return {
                props: {post: {}},
            }
        }

        const currentPathIndex = linkPaths.findIndex((path) => path.id === post.id)
        let previousPath = null,
            nextPath = null
        if (currentPathIndex !== 0) {
            previousPath = linkPaths[currentPathIndex - 1]
            previousPath.label = PREVIOUS_POST_LABEL
        }
        if (currentPathIndex !== linkPaths.length - 1) {
            nextPath = linkPaths[currentPathIndex + 1]
            nextPath.label = NEXT_POST_LABEL
        }

        return {
            props: {
                post,
                previousPath,
                nextPath,
            },
        }
    } catch (error) {
        return {
            props: {
                msg: 'server error',
                post: {},
            },
        }
    }
}

export async function getStaticPaths() {
    try {
        const blogCollection = new BlogCollection()
        const paths = blogCollection.getAllPostPaths()
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

Post.getLayout = function getLayout(page, categories) {
    return <BlogLayout categories={categories}>{page}</BlogLayout>
}

export default Post
