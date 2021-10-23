import React from 'react';

import { Container, SimpleGrid, Progress } from '@chakra-ui/react';

import PostCard from './PostCard';
import LoadingCard from './LoadingCard';
import FadeIn from './FadeIn';
import InfiniteScrolling from './InfiniteScrolling';

function PostCardGridList({ posts, isLoading, hasMore, getCurrentPageNum }) {
  return (
    <Container maxW='container.xl' my={8}>
      {isLoading && <Progress size='xs' isIndeterminate />}
      <SimpleGrid
        minChildWidth='350px'
        spacing='8'
        justifyItems='center'
        alignItems='center'
      >
        <InfiniteScrolling
          hasMore={hasMore}
          getPageNum={getCurrentPageNum}
          isLoading={isLoading}
        >
          {posts.map((post, i) => (
            <FadeIn key={i}>
              <PostCard
                postDetails={post}
                isLoading={isLoading}
                LoadingComp={LoadingCard}
              />
            </FadeIn>
          ))}
        </InfiniteScrolling>
      </SimpleGrid>
    </Container>
  );
}

export default PostCardGridList;
