import Link from 'next/link'
import {Box, Center, useColorMode} from '@chakra-ui/react'
import NextImage from 'next/image'

function NavBarLogo({to = '/', ...rest}) {
    const {colorMode} = useColorMode()

    return (
        <Center {...rest}>
            <Link href={{pathname: to}} as={to} passHref>
                <a title={to}>
                    <Box w={{base: 200, md: 400}} h="50" pos="relative">
                        <NextImage
                            overflow="hidden"
                            alt="klauswang"
                            layout="fill"
                            objectFit="scale-down"
                            src={colorMode === 'light' ? '/klauswang.png' : '/klauswang-white.png'}
                        />
                    </Box>
                </a>
            </Link>
        </Center>
    )
}

export default NavBarLogo
