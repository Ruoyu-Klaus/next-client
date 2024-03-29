import React from 'react'
import NextLink from 'next/link'
import {Link, Text} from '@chakra-ui/react'

const LinkToPost = ({payload}) => {
    if (!payload) {
        return <div />
    }
    return (
        <NextLink href={payload.href} as={payload.as}>
            <Link>
                <Text fontSize="1rem" noOfLines={1}>
                    {payload.title}
                </Text>
            </Link>
        </NextLink>
    )
}

export default LinkToPost
