import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import dayjs from 'dayjs'
import styles from '../styles/Components/PostCard.module.scss'

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
  Skeleton,
} from '@chakra-ui/react'
import { TimeIcon } from '@chakra-ui/icons'

PostCard.propTypes = {
  postDetails: PropTypes.object,
  isLoading: PropTypes.bool,
  LoadingComp: PropTypes.elementType,
}

function PostCard({ postDetails, isLoading = false, LoadingComp = Skeleton }) {
  const {
    id,
    post_title,
    post_time,
    post_introduce,
    post_cover,
    category,
    tags,
  } = postDetails

  const postCover = useMemo(
    () => (
      <Link
        href={{
          pathname: `/blog/post/[cname]/[...slug]`,
          query: {
            cname: category,
            slug: [id],
          },
        }}
        as={`/blog/post/${category}/${id}`}
        passHref
      >
        <a title={post_title}>
          <Image
            h='100%'
            w='100%'
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
  )
  const description = useMemo(
    () => (
      <VStack h='full' spacing={3} alignItems='flex-start'>
        <Text mt={1} fontSize={'16px'} color='gray.500'>
          {category}
        </Text>
        <Heading as='h3' size='md' className={styles.postTitle}>
          {post_title}
        </Heading>
        <Text fontSize={'16px'} className={styles.postIntroduction}>
          {post_introduce}
        </Text>
        <Divider />

        <HStack className={styles.postTag} w={'full'} spacing={4}>
          {tags.map(tag => (
            <Tag size='sm' key={tag}>
              {tag}
            </Tag>
          ))}
        </HStack>
      </VStack>
    ),
    [category]
  )

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
  )

  return (
    <Box
      w='350px'
      minW='250px'
      maxW='350px'
      h='480px'
      borderWidth='1px'
      borderRadius='6'
      display='flex'
      flexDir='column'
      className={styles.postCard}
    >
      {isLoading ? (
        <LoadingComp w='full' h='full' />
      ) : (
        <>
          <Box w='full' h='240px' minH='240px' overflow='hidden'>
            {postCover}
          </Box>

          <Box flex='1' p={4} py={1}>
            {description}
          </Box>

          <Box p={4}>{meta}</Box>
        </>
      )}
    </Box>
  )
}

export default PostCard
