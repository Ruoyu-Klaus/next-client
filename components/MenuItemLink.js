import React from 'react'
import Link from 'next/link'
import {Text} from '@chakra-ui/react'

function MenuItemLink({children, isLast, to = '/', ...rest}) {
    return (
        <Link href={{pathname: to}}>
            <Text {...rest}>{children}</Text>
        </Link>
    )
}

export default MenuItemLink
