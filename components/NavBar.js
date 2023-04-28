import PropTypes from 'prop-types'
import React, {useCallback, useState} from 'react'

import MenuItemLink from './MenuItemLink'

import {SearchIcon} from '@chakra-ui/icons'
import {
    Box,
    Button,
    Grid,
    GridItem,
    HStack,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    VStack,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react'
import useRouterScroll from '../hooks/useRouterScroll'
import {DARK_MODE_ICON, LIGHT_MODE_ICON, NAVIGATION_ABOUTPAGE, NAVIGATION_HOMEPAGE} from '../utils/content'

import {CloseIcon, HamburgerIcon} from '@chakra-ui/icons'
import NextImage from 'next/image'
import Link from 'next/link'

Header.propTypes = {
    navArray: PropTypes.array,
}

function Header({navArray = []}) {
    useRouterScroll()
    const {colorMode, toggleColorMode} = useColorMode()
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenuIcon = () => setIsMenuOpen(!isMenuOpen)

    const renderCategoriesLink = useCallback(
        () =>
            navArray.map((item) => {
                return (
                    <MenuItemLink to={`/blog/post/${encodeURIComponent(item)}`} key={item}>
                        <Button variant="link">{item.toUpperCase()}</Button>
                    </MenuItemLink>
                )
            }),
        [navArray],
    )

    return (
        <Grid
            margin="0 auto"
            w="80%"
            maxW="container.xl"
            h={16}
            px={isLargerThan900 ? 8 : 0}
            mt={8}
            templateColumns="repeat(2, 1fr)"
            alignItems={'center'}
        >
            <HStack w={isLargerThan900 ? '80%' : '60%'} m="0 auto">
                <Link href={{pathname: '/'}} as={'/'} passHref>
                    <a title={'home'}>
                        <Box w={{base: 100, md: 300}} h="50" pos="relative">
                            <NextImage
                                overflow="hidden"
                                alt="klauswang"
                                layout="fill"
                                objectFit="scale-down"
                                priority={true}
                                src={colorMode === 'light' ? '/klauswang.png' : '/klauswang-white.png'}
                            />
                        </Box>
                    </a>
                </Link>
            </HStack>

            <GridItem justifySelf="end">
                {isLargerThan900 ? (
                    <HStack w="full" alignItems={'center'} spacing={4}>
                        <MenuItemLink to="/blog">
                            <Button variant="link">{NAVIGATION_HOMEPAGE}</Button>
                        </MenuItemLink>
                        {renderCategoriesLink()}
                        <MenuItemLink to="/about">
                            <Button variant="link">{NAVIGATION_ABOUTPAGE}</Button>
                        </MenuItemLink>
                        <MenuItemLink to="/blog/search">
                            <Button variant="ghost">
                                <SearchIcon />
                            </Button>
                        </MenuItemLink>
                        <Button variant="ghost" onClick={toggleColorMode}>
                            {colorMode === 'light' ? <Text fontSize="lg">{DARK_MODE_ICON}</Text> : <Text fontSize="lg">{LIGHT_MODE_ICON}</Text>}
                        </Button>
                    </HStack>
                ) : (
                    <HStack spacing={0}>
                        <Button variant="ghost" onClick={toggleColorMode}>
                            {colorMode === 'light' ? <Text fontSize="lg">{DARK_MODE_ICON}</Text> : <Text fontSize="lg">{LIGHT_MODE_ICON}</Text>}
                        </Button>
                        <MenuItemLink to="/blog/search">
                            <Button variant="ghost">
                                <SearchIcon />
                            </Button>
                        </MenuItemLink>
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="ghost" onClick={toggleMenuIcon}>
                                    {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent w="100px">
                                <PopoverBody>
                                    <VStack>
                                        <MenuItemLink to="/blog">
                                            <Button variant="link">{NAVIGATION_HOMEPAGE}</Button>
                                        </MenuItemLink>
                                        {renderCategoriesLink()}
                                        <MenuItemLink to="/about">
                                            <Button variant="link">{NAVIGATION_ABOUTPAGE}</Button>
                                        </MenuItemLink>
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </HStack>
                )}
            </GridItem>
        </Grid>
    )
}

export default Header
