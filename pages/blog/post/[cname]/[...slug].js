import {Box, Container, Flex, Heading, HStack, Image, Tag, Text, VStack} from '@chakra-ui/react'
import dayjs from 'dayjs'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import BackToTop from '../../../../components/BackToTop'
import CustomDivider from '../../../../components/CustomDivider'
import LinkToPost from '../../../../components/LinkToPost'
import Toc from '../../../../components/Toc'
import {randomEmoji} from '../../../../helpers'
import BlogLayout from '../../../../layout/BlogLayout'
import {getPostDetailsBySlug, getPosts, getTagRelatedPosts} from '../../../../services'
import {getParsedContentWithTocTree} from '../../../../helpers/markDownRenderer'
import {RELATED_POST_LABEL} from '../../../../utils/content'

function Post({post = {}, relatedPosts}) {
    const router = useRouter()
    const [emoji] = useState(randomEmoji())

    const {id, title, coverImage, tags, categories = [], parsedContent, tocTree, date} = post
    const category = categories[0] || {}

    const relatedPostLink = relatedPosts.map((relatedPost) => {
        const {categories, slug, id, title, date} = relatedPost
        const category = categories[0]
        return {
            href: {
                pathname: `/blog/post/[cname]/[...slug]`,
                query: {
                    cname: category.slug,
                    slug: [slug],
                },
            },
            id: id,
            title: title,
            as: `/blog/post/${category.slug}/${slug}`,
            date: date,
        }
    })

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
                    <Image w={['90%', '80vw', '60vw']} maxW="600px" objectFit="contain" src={coverImage?.url} />
                    <HStack spacing={4}>
                        {tags?.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </HStack>
                    <Box w={['90%', '80vw', '60vw']} maxW="1000px">
                        <Heading>{title}</Heading>
                    </Box>

                    <Flex w={['90%', '80vw', '60vw']} maxW="1000px" gap={4}>
                        <Text fontSize="0.8rem">{category.name}</Text>
                        <Text fontSize="0.8rem">{date && dayjs(date).format('MM-DD, YYYY')}</Text>
                    </Flex>

                    <Box w={['90%', '80vw', '60vw']} maxW="1000px" className="markdown-body">
                        <Toc tocTree={tocTree} />
                    </Box>

                    <Box
                        w={['90%', '80vw', '60vw']}
                        maxW="1000px"
                        className="markdown-body"
                        id="content"
                        dangerouslySetInnerHTML={{__html: parsedContent}}
                    />
                    <CustomDivider my={4} text={emoji} dividerWidth="full" />

                    <VStack w={['90%', '80vw', '60vw']} justifyItems={'end'}>
                        <Text>{RELATED_POST_LABEL}</Text>
                        {relatedPostLink.map((payload) => (
                            <LinkToPost payload={payload} key={payload.id} />
                        ))}
                    </VStack>
                </VStack>
                <BackToTop />
            </Container>
        </>
    )
}

export async function getStaticProps(context) {
    try {
        const {params} = context
        const [slug] = params.slug
        const post = await getPostDetailsBySlug(slug)
        const relatedPosts = await getTagRelatedPosts(slug, post.tags)
        const {parsedContent, tocTree} = getParsedContentWithTocTree(post?.contentMarkdown)
        return {
            props: {post: {...post, parsedContent, tocTree}, relatedPosts},
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
        const posts = await getPosts()
        const paths = posts.map(({slug, categories}) => ({
            params: {
                cname: categories[0]?.slug,
                slug: [slug],
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

Post.getLayout = function getLayout(page, categories) {
    return <BlogLayout categories={categories}>{page}</BlogLayout>
}

export default Post
