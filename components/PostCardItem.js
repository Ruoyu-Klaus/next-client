import React, {useMemo, useState} from 'react'
import styles from '../styles/Components/PostCard.module.scss'
import {Box, Divider, Flex, Heading, HStack, Skeleton, Tag, Text, VStack} from '@chakra-ui/react'
import NextImage from 'next/image'
import {TimeIcon} from '@chakra-ui/icons'
import dayjs from 'dayjs'
import Link from 'next/link'

function LinkToPostDetail(props) {
    const {category, id, title} = props
    return (
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
            <a title={title}>{props.children}</a>
        </Link>
    )
}

function PostCardItem(props) {
    const {columnIndex, data, rowIndex, style} = props
    const postDetails = data[rowIndex][columnIndex]
    if (!postDetails) return <></>
    const {id, title, date, excerpt, coverImage, category, tags = [], author = 'Ruoyu'} = postDetails
    if (!id) return <></>
    const [isImageLoading, setIsImageLoading] = useState(true)

    const postCover = useMemo(
        () => (
            <LinkToPostDetail category={category} id={id} title={title}>
                {isImageLoading && <Skeleton w="100%" h="100%" />}
                <Box w="100%" h="100%" pos="relative" transition="all 0.3s ease-in-out" _hover={{transform: 'scale(1.05)', opacity: '0.5'}}>
                    <NextImage
                        src={coverImage}
                        overflow="hidden"
                        objectFit="contain"
                        alt={title}
                        layout="fill"
                        sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                        onLoadingComplete={(e) => setIsImageLoading(false)}
                    />
                </Box>
            </LinkToPostDetail>
        ),
        [coverImage, title, category, id, isImageLoading],
    )
    const description = useMemo(
        () => (
            <VStack h="full" spacing={3} alignItems="flex-start">
                <Text mt={1} fontSize={'16px'} color="gray.500">
                    {category}
                </Text>
                <LinkToPostDetail category={category} id={id} title={title}>
                    <Heading as="h3" size="md" className={styles.postTitle}>
                        {title}
                    </Heading>
                </LinkToPostDetail>
                <LinkToPostDetail category={category} id={id} title={title}>
                    <Text fontSize={'16px'} className={styles.postIntroduction}>
                        {excerpt}
                    </Text>
                </LinkToPostDetail>
                <Divider />

                <Box className={styles.postTag} w="full">
                    {tags.map((tag) => (
                        <Tag size="sm" key={tag}>
                            #{tag}
                        </Tag>
                    ))}
                </Box>
            </VStack>
        ),
        [category],
    )

    const meta = useMemo(
        () => (
            <Flex w={'full'} justifyContent="space-between">
                <Text fontSize={'xs'}>
                    By <span>{author}</span>
                </Text>
                <HStack fontSize={'xs'}>
                    <TimeIcon />
                    <Text>{dayjs(date).format('YYYY-MM-DD')}</Text>
                </HStack>
            </Flex>
        ),
        [date, author],
    )
    return (
        <Box p="20px" h="490px" display="flex" justifyContent={'center'} style={style}>
            <Box
                borderWidth="1px"
                w={['320px', '350px']}
                h="480px"
                maxW="350px"
                borderRadius="6"
                display="flex"
                flexDir="column"
                className={styles.postCard}
            >
                <Box w="full" h="240px" minH="240px" overflow="hidden">
                    {postCover}
                </Box>

                <Box flex="1" p={4} py={1}>
                    {description}
                </Box>

                <Box p={4}>{meta}</Box>
            </Box>
        </Box>
    )
}

export default PostCardItem
