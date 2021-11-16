import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import NextLink from 'next/link'

import BackToTop from '../../../../components/BackToTop'
import CustomDivider from '../../../../components/CustomDivider'

import { randomEmoji } from '../../../../helpers'

import {
  Container,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Box,
  AspectRatio,
  Image,
  Link,
  Tag,
} from '@chakra-ui/react'

import dayjs from 'dayjs'

function Post({ post = {}, tocTree = [], previousPath, nextPath }) {
  const router = useRouter()
  const [emoji] = useState(randomEmoji())

  useEffect(() => {
    !post.id && router.push('/blog')
  }, [])

  const renderTOC = tocTree => (
    <ul>
      {tocTree.map(item => (
        <li key={item.anchor}>
          <a
            href={`#${item.anchor}`}
            onClick={e => {
              e.preventDefault()
              document.getElementById(`${item.anchor}`).scrollIntoView({
                behavior: 'smooth',
              })
            }}
          >
            {item.text}
          </a>
          {item.children && renderTOC(item.children)}
        </li>
      ))}
    </ul>
  )

  const renderPostLink = (path, isNext) => {
    if (!path) {
      return <div></div>
    }
    return (
      <NextLink href={path.href} as={path.as}>
        <Link>
          <Text fontSize='0.8rem'>
            {isNext ? 'next' : 'previous'}: {path.title}
          </Text>
        </Link>
      </NextLink>
    )
  }

  return (
    <>
      <Head>
        <title>{post?.post_title} | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container maxW='container.xl' my={8}>
        <CustomDivider my={4} text={emoji} dividerWidth='full' />
        <VStack spacing='4'>
          <AspectRatio w={['90%', '80vw', '60vw']} maxW='800px' ratio={3 / 2}>
            <Image objectFit='cover' src={post.post_cover} />
          </AspectRatio>
          <Heading>{post.post_title}</Heading>

          <Flex w='60%' justifyContent='space-between'>
            <Text fontSize='0.8rem'>{post.category}</Text>
            <Text fontSize='0.8rem'>
              {dayjs(post.post_time).format('MM-DD, YYYY')}
            </Text>
          </Flex>

          <HStack spacing={4}>
            {post?.tags?.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </HStack>
          <Box
            w={['90%', '80vw', '60vw']}
            maxW='1000px'
            className='markdown-body'
          >
            {renderTOC(tocTree)}
          </Box>
          <Box
            w={['90%', '80vw', '60vw']}
            maxW='1000px'
            className='markdown-body'
            id='content'
            dangerouslySetInnerHTML={{ __html: post.post_content }}
          />

          <Flex
            w={['auto', 'full']}
            justifyContent={['center', 'space-between']}
            flexDir={['column', 'row']}
          >
            {renderPostLink(previousPath)}
            {renderPostLink(nextPath, true)}
          </Flex>
        </VStack>
        <CustomDivider my={4} text={emoji} dividerWidth='full' />

        <BackToTop />
      </Container>
    </>
  )
}

import { getParsedContentWithTocTree } from '../../../../helpers/markDownRenderer'
import { Blog } from '../../../../helpers'

export async function getStaticProps(context) {
  try {
    const { params } = context
    const category_name = params.cname
    const [id] = params.slug

    const blog = new Blog()
    const linkPaths = blog.getAllPostPaths(true)
    const post = blog.getPostByCategoryAndId(category_name, id)

    if (!post) {
      return {
        props: { post: {} },
      }
    }

    const { sanitizedContent, tocTree } = await getParsedContentWithTocTree(
      post.post_content
    )

    post.post_content = sanitizedContent

    const currentPathIndex = linkPaths.findIndex(path => path.id === post.id)
    let previousPath = null,
      nextPath = null
    if (currentPathIndex !== 0) {
      previousPath = linkPaths[currentPathIndex - 1]
    }
    if (currentPathIndex !== linkPaths.length - 1) {
      nextPath = linkPaths[currentPathIndex + 1]
    }

    return {
      props: {
        post,
        tocTree,
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
    const blog = new Blog()
    const paths = blog.getAllPostPaths()
    return {
      paths: paths,
      fallback: true,
    }
  } catch (error) {
    return {
      paths: [],
      fallback: true,
    }
  }
}

import BlogLayout from '../../../../layout/BlogLayout'
Post.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>
}

export default Post
