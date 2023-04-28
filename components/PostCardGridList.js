import React from 'react'
import dynamic from 'next/dynamic'

import {Container, SimpleGrid} from '@chakra-ui/react'

import PostCard from './PostCard'
import FadeIn from './FadeIn'

const LoadingCard = dynamic(() => import('./LoadingCard'))

function PostCardGridList({posts}) {
    return (
        <Container w="75%" maxW="container.xl" my={4}>
            <SimpleGrid minChildWidth="290px" spacing="8" justifyItems="center" alignItems="center">
                {posts.map((post) => (
                    <FadeIn key={post.id}>
                        <PostCard postDetails={post} LoadingComp={LoadingCard} />
                    </FadeIn>
                ))}
            </SimpleGrid>
        </Container>
    )
}

export default PostCardGridList
