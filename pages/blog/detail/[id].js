import {Box, Container, Flex, Heading, HStack, Image, Tag, Text, VStack} from '@chakra-ui/react'
import dayjs from 'dayjs'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import BackToTop from '../../../components/BackToTop'
import CustomDivider from '../../../components/CustomDivider'
import LinkToPost from '../../../components/LinkToPost'
import Toc from '../../../components/Toc'
import {getAllPostPaths, getBlogDetailById} from '../../../helpers'
import BlogLayout from '../../../layout/BlogLayout'
import {NEXT_POST_LABEL, PREVIOUS_POST_LABEL} from '../../../utils/content'
import Comments from '../../../components/Comments'
import emojiList from '../../../helpers/emoji.json'

export function randomEmoji() {
    const keys = Object.keys(emojiList)
    const randomIndex = Math.floor(Math.random() * keys.length)
    return emojiList[keys[randomIndex]]
}

function Post({post = {}, previousPath, nextPath}) {
    const router = useRouter()
    const emoji = randomEmoji()

    const {id, title, excerpt, coverImage, tags, category, content, date, tocTree} = post

    useEffect(() => {
        !id && router.push('/blog')
    }, [])

    return (
        <>
            <Head>
                <title>{title} | Ruoyu</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={excerpt} />
            </Head>

            <Container maxW="container.xl" my={8}>
                <CustomDivider my={4} text={emoji} dividerWidth="full" />
                <VStack spacing="4">
                    <Image w={['90%', '80vw', '60vw']} maxW="600px" objectFit="contain" src={coverImage} />
                    <HStack spacing={4}>
                        {tags?.map((tag) => (
                            <Tag key={tag}>#{tag}</Tag>
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
                        <Toc tocTree={tocTree || []} />
                    </Box>

                    <Box
                        w={['90%', '80vw', '60vw']}
                        maxW="1000px"
                        className="markdown-body"
                        id="content"
                        dangerouslySetInnerHTML={{__html: content}}
                    />
                    <CustomDivider my={4} text={emoji} dividerWidth="full" />

                    <Flex w={['90%', '80vw', '60vw']} justifyContent={['center', 'space-between']} flexDir={['column', 'row']}>
                        <LinkToPost payload={previousPath} />
                        <LinkToPost payload={nextPath} />
                    </Flex>
                    <Comments />
                </VStack>

                <BackToTop />
            </Container>
        </>
    )
}

export async function getStaticProps(context) {
    try {
        const {params} = context
        const id = params.id
        const post = getBlogDetailById(id)
        const linkPaths = getAllPostPaths(true)

        if (!post) {
            return {
                props: {post: {}},
            }
        }

        const currentPathIndex = linkPaths.findIndex((path) => path.id === id)

        let previousPath = null,
            nextPath = null
        if (currentPathIndex !== 0) {
            previousPath = linkPaths[currentPathIndex - 1]
            previousPath.title = `${PREVIOUS_POST_LABEL} ${previousPath.title}`
        }
        if (currentPathIndex !== linkPaths.length - 1) {
            nextPath = linkPaths[currentPathIndex + 1]
            nextPath.title = `${nextPath.title} ${NEXT_POST_LABEL}`
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
        const paths = getAllPostPaths()
        return {
            paths,
            fallback: false,
        }
    } catch (error) {
        return {
            paths: [],
            fallback: false,
        }
    }
}

Post.getLayout = function getLayout(page) {
    return <BlogLayout>{page}</BlogLayout>
}

export default Post
