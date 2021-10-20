import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';

import styles from '../styles/Components/PostCard.module.scss';

import {
  Box,
  VStack,
  HStack,
  Image,
  Heading,
  Text,
  Divider,
  Tag,
  Flex,
} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';

const tagColorScheme = [
  'magenta',
  'lime',
  'red',
  'orange',
  'green',
  'geekblue',
  'cyan',
  'gold',
  'blue',
  'volcano',
  'purple',
];

function PostCard({ postData }) {
  const {
    id,
    post_title,
    post_time,
    post_introduce,
    post_cover,
    category,
    tags,
    updated_at,
  } = postData;

  const postCover = useMemo(
    () => (
      <Link
        href={{
          pathname: `/blog/post/[cname]/[...slug]`,
          query: {
            cname: category.category_name,
            slug: [id, post_title],
          },
        }}
        as={`/blog/post/${category.category_name}/${id}/${post_title}`}
        passHref
      >
        <a title={post_title}>
          <Image
            h='100%'
            transition='all 0.3s ease-in-out'
            _hover={{
              transform: 'scale(1.05)',
              opacity: '0.5',
            }}
            overflow='hidden'
            objectFit='cover'
            alt={post_title}
            src={
              post_cover ||
              'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
            }
          />
        </a>
      </Link>
    ),
    [post_cover, post_title]
  );
  const discription = useMemo(
    () => (
      <VStack h='full' spacing={3} alignItems='flex-start'>
        <Text mt={1} fontSize={'16px'} color='gray.500'>
          {category.category_name}
        </Text>
        <Heading as='h3' size='md' className={styles.postTitle}>
          {post_title}撒答打撒打撒打撒打撒打打撒打打撒打打撒打
          撒答打撒打撒打撒打撒打打撒打打撒打
        </Heading>
        <Text fontSize={'16px'} className={styles.postIntroduction}>
          {post_introduce}打打撒撒打撒打撒打撒打打撒打打撒打打撒打
          撒答打撒打撒打撒打撒打打撒打打撒打
        </Text>
        <Divider />

        <HStack className={styles.postTag} w={'full'} spacing={4}>
          <Tag size='sm'>TTT</Tag>
          <Tag size='sm'>aaaa</Tag>
          <Tag size='sm'>aaaa</Tag>
          <Tag size='sm'>aaaa</Tag>
          <Tag size='sm'>aaaa</Tag>
          <Tag size='sm'>a</Tag>

          {tags.map((tag, i) => (
            <Tag size='sm' key={tag.id}>
              {tag.tag_name}
            </Tag>
          ))}
        </HStack>
      </VStack>
    ),
    [category.category_name]
  );

  const meta = useMemo(
    () => (
      <Flex w={'full'} justifyContent='space-between'>
        <Text fontSize={'xs'}>
          By <span>Ruoyu</span>
        </Text>
        <Text fontSize={'xs'}>
          <TimeIcon /> {dayjs(post_time).format('YYYY-MM-DD')}
        </Text>
      </Flex>
    ),
    [post_time]
  );

  return (
    <Box
      w='80'
      h='500px'
      borderWidth='1px'
      borderRadius='6'
      justifySelf='center'
      display='flex'
      flexDir='column'
      className={styles.postCard}
    >
      <Box w='full' h='240px' minH='240px' overflow='hidden'>
        {postCover}
      </Box>

      <Box flex='1' p={4} py={1}>
        {discription}
      </Box>

      <Box p={4}>{meta}</Box>
    </Box>
  );
}

export default PostCard;
