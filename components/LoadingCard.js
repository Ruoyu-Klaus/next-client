import React from 'react'
import {Skeleton, SkeletonText} from '@chakra-ui/react'

function LoadingCard({isLoading = true}) {
    return (
        <>
            <Skeleton w="full" h="240px" isLoaded={!isLoading} />
            <SkeletonText p={4} isLoaded={!isLoading} mt="6" noOfLines={6} spacing="4" />
        </>
    )
}

export default LoadingCard
