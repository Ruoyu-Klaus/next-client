import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';

import BackToTop from '../../../../components/BackToTop';
import CustomDivider from '../../../../components/CustomDivider';

import { randomEmoji } from '../../../../helpers';

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
  Divider,
} from '@chakra-ui/react';

import dayjs from 'dayjs';

function Post({ post = {}, tocTree = [], previousPath, nextPath }) {
  const router = useRouter();

  useEffect(() => {
    !post && router.push('/blog');
  }, []);

  const renderTOC = tocTree => (
    <ul>
      {tocTree.map(item => (
        <li key={item.anchor}>
          <a
            href={`#${item.anchor}`}
            onClick={e => {
              e.preventDefault();
              document.getElementById(`${item.anchor}`).scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            {item.text}
          </a>
          {item.children && renderTOC(item.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Head>
        <title>{post.post_title} | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container maxW='container.xl' my={8}>
        <CustomDivider my={4} text={randomEmoji()} dividerWidth='full' />
        <VStack spacing='4'>
          <AspectRatio w={['90%', '80vw', '60vw']} maxW='800px' ratio={3 / 2}>
            <Image objectFit='cover' src={post.post_cover} />
          </AspectRatio>
          <Heading>{post.post_title}</Heading>

          <Flex w='60%' justifyContent='space-between'>
            <Text fontSize='0.8rem'>{post.category?.category_name}</Text>
            <Text fontSize='0.8rem'>
              {dayjs(post.post_time).format('MM-DD, YYYY')}
            </Text>
          </Flex>

          <HStack spacing={4}>
            {post?.tags?.map((tag, i) => (
              <Tag key={tag.id}>{tag.tag_name}</Tag>
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
            {previousPath ? (
              <NextLink href={previousPath} as={previousPath.as}>
                <Link>
                  <Text fontSize='0.8rem'>
                    previous: {previousPath && previousPath.title}
                  </Text>
                </Link>
              </NextLink>
            ) : (
              <div></div>
            )}
            {nextPath && (
              <NextLink href={nextPath} as={nextPath.as}>
                <Link>
                  <Text fontSize='0.8rem'>
                    next: {nextPath && nextPath.title}
                  </Text>
                </Link>
              </NextLink>
            )}
          </Flex>
        </VStack>
        <CustomDivider my={4} text={randomEmoji()} dividerWidth='full' />

        <BackToTop />
      </Container>
    </>
  );
}

import { getArticleById } from '../../../../request';
import { getParsedContentWithTocTree } from '../../../../helpers/markDownRenderer';
import { getPostPaths } from '../../../../helpers';

export async function getStaticProps(context) {
  try {
    const { params } = context;
    const [id] = params.slug;
    const post = await getArticleById(id);

    const { santizedContent, tocTree } = await getParsedContentWithTocTree(
      post.post_content
    );

    post.post_content = santizedContent;

    const paths = await getPostPaths(true);
    const currentPathIndex = paths.findIndex(
      path => path.query?.slug[0] == post.id
    );
    let previousPath = null,
      nextPath = null;
    if (currentPathIndex !== 0) {
      previousPath = paths[currentPathIndex - 1];
    }
    if (currentPathIndex !== paths.length - 1) {
      nextPath = paths[currentPathIndex + 1];
    }

    return {
      props: {
        post,
        tocTree,
        previousPath,
        nextPath,
      },
    };
  } catch (error) {
    return {
      props: {
        msg: 'server error',
        post: {},
      },
    };
  }
}

export async function getStaticPaths() {
  try {
    const paths = await getPostPaths();
    return {
      paths: paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
}

import BlogLayout from '../../../../layout/BlogLayout';
Post.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};

export default Post;
