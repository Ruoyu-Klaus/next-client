import React from 'react'
import Link from 'next/link'

function MenuItemLink({children, isLast, to = '/', }) {
    return (
        <Link href={{pathname: to}}>
            {children}
        </Link>
    )
}

export default MenuItemLink
