import React from 'react'

import {Container, SimpleGrid} from '@chakra-ui/react'

import PostCard from './PostCard'
import LoadingCard from './LoadingCard'
import FadeIn from './FadeIn'

function PostCardGridList({posts}) {
    return (
        <Container maxW='container.xl' my={8}>
            <SimpleGrid minChildWidth='350px' spacing='8' justifyItems='center' alignItems='center'>
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
