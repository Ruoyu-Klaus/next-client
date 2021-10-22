import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';

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

  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    !post && router.push('/blog');
  }, []);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2.2);
  }, []);

  const renderToc = items => {
    // 递归 render
    return items.map(item => (
      <NextLink
        onClick={e => {
          e.preventDefault();
          document.querySelector(`#${item.anchor}`).scrollIntoView({
            behavior: 'smooth',
          });
        }}
        key={item.anchor}
        href={`#${item.anchor}`}
        title={item.text}
      >
        {item.children && renderToc(item.children)}
      </NextLink>
    ));
  };

  // 暂时弃用
  //  const getFlatAnchors = items => {
  //   return items.reduce((acc, item) => {
  //     acc.push(item.anchor);
  //     if (item.children) {
  //       acc.push(...getFlatAnchors(item.children));
  //     }
  //     return acc;
  //   }, []);
  // };

  // 已使用Antd的组件，暂时弃用
  // const toc = tocTree => (
  //   <ul>
  //     {tocTree.map(item => (
  //       <li key={item.anchor}>
  //         <a
  //           href={`#${item.anchor}`}
  //           onClick={e => {
  //             e.preventDefault();
  //             document.getElementById(`${item.anchor}`).scrollIntoView({
  //               behavior: 'smooth',
  //             });
  //           }}
  //         >
  //           {item.text}
  //         </a>
  //         {item.children && toc(item.children)}
  //       </li>
  //     ))}
  //   </ul>
  // );

  return (
    <>
      <Head>
        <title>{post.post_title} | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container maxW='container.xl' my={8}>
        <Divider my={4} />
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
        <Divider my={4} />
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
