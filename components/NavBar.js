import PropTypes from 'prop-types'
import React, {useState} from 'react'

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

    const colorModeText = colorMode === 'light' ? DARK_MODE_ICON : LIGHT_MODE_ICON

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
            <div m="0 auto">
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
            </div>

            <GridItem justifySelf="end">
                {isLargerThan900 ? (
                    <HStack spacing={4}>
                        <MenuItemLink to="/">
                            <Button variant="link">{NAVIGATION_HOMEPAGE}</Button>
                        </MenuItemLink>
                        <MenuItemLink to={`/blog/1`}>
                            <Button variant="link">BLOG</Button>
                        </MenuItemLink>

                        <MenuItemLink to="/about">
                            <Button variant="link">{NAVIGATION_ABOUTPAGE}</Button>
                        </MenuItemLink>

                        <MenuItemLink to="/blog/search">
                            <Button variant="ghost">
                                <SearchIcon />
                            </Button>
                        </MenuItemLink>
                        <Button variant="ghost" onClick={toggleColorMode}>
                            <Text fontSize="lg">{colorModeText}</Text>
                        </Button>
                    </HStack>
                ) : (
                    <HStack spacing={2}>
                        <Button variant="ghost" onClick={toggleColorMode}>
                            <Text fontSize="lg">{colorModeText}</Text>
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
                                        <MenuItemLink to="/">
                                            <Button variant="link">{NAVIGATION_HOMEPAGE}</Button>
                                        </MenuItemLink>
                                        <MenuItemLink to={`/blog/1`}>
                                            <Button variant="link">BLOG</Button>
                                        </MenuItemLink>
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
