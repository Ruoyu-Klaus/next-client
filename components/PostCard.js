import React, {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import NextImage from 'next/image'

import dayjs from 'dayjs'
import styles from '../styles/Components/PostCard.module.scss'

import {Box, Divider, Flex, Heading, HStack, Skeleton, Tag, Text, VStack} from '@chakra-ui/react'
import {TimeIcon} from '@chakra-ui/icons'

function LinkToPostDetail(props) {
    const {id, title} = props
    return (
        <Link
            href={{
                pathname: `/blog/detail/[id]`,
                query: {
                    slug: [id],
                },
            }}
            as={`/blog/detail/${id}`}
            passHref
        >
            <a title={title}>{props.children}</a>
        </Link>
    )
}

LinkToPostDetail.propTypes = {children: PropTypes.node}

PostCard.propTypes = {
    postDetails: PropTypes.object,
    isLoading: PropTypes.bool,
    LoadingComp: PropTypes.elementType,
}

function PostCard({postDetails, isLoading = false, LoadingComp = Skeleton}) {
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
                        objectFit="cover"
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
                {/* <Text mt={1} fontSize={'16px'} color="gray.500">
                    {category}
                </Text> */}
                <LinkToPostDetail category={category} id={id} title={title}>
                    <Heading mt={1} as="h3" size="md" className={styles.postTitle}>
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
        <Box minW="290px" maxW="350px" h="380px" borderWidth="1px" borderRadius="6" display="flex" flexDir="column" className={styles.postCard}>
            {isLoading ? (
                <LoadingComp w="full" h="full" />
            ) : (
                <>
                    <Box w="full" h="190px" overflow="hidden">
                        {postCover}
                    </Box>

                    <Box flex="1" p={4} py={1}>
                        {description}
                    </Box>

                    <Box p={4}>{meta}</Box>
                </>
            )}
        </Box>
    )
}

export default PostCard
