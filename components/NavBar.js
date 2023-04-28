import PropTypes from 'prop-types'
import React, {useCallback, useEffect, useState} from 'react'

import MenuItemLink from './MenuItemLink'
import NavBarLogo from './NavBarLogo'
import MenuToggleForSmallScreen from './NavBarMenuToggle'

import {SearchIcon} from '@chakra-ui/icons'
import {Box, Text, Button, Grid, GridItem, HStack, Stack, useColorMode, useColorModeValue} from '@chakra-ui/react'
import useRouterScroll from '../hooks/useRouterScroll'
import {NAVIGATION_ABOUTPAGE, NAVIGATION_HOMEPAGE, LIGHT_MODE_ICON, DARK_MODE_ICON} from '../utils/content'

Header.propTypes = {
    navArray: PropTypes.array,
}

function Header({navArray = []}) {
    const {colorMode, toggleColorMode} = useColorMode()
    useRouterScroll()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenuIcon = () => setIsMenuOpen(!isMenuOpen)

    useEffect(() => {
        colorMode === 'dark' ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')
    }, [])

    const handleThemeChange = useCallback(
        (e) => {
            toggleColorMode()
            e.preventDefault()
            e.stopPropagation()
            document.body.classList.toggle('dark-mode')
        },
        [colorMode],
    )

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
        <Grid margin="0 auto" w="80%" maxW="container.xl" h={16} px={8} mt={8} templateColumns="repeat(2, 1fr)" alignItems={'center'}>
            <HStack spacing={{base: 'none', md: 4}}>
                <NavBarLogo w="80%" m="0 auto" />
            </HStack>

            <GridItem justifySelf="end">
                <MenuToggleForSmallScreen display={{base: 'block', md: 'none'}} toggle={toggleMenuIcon} isMenuOpen={isMenuOpen} />
                <Box
                    display={{base: isMenuOpen ? 'flex' : 'none', md: 'flex'}}
                    top={16}
                    right={0}
                    zIndex={20}
                    w={{base: '100vw', md: 'auto'}}
                    pos={{base: 'fixed', md: 'unset'}}
                    bg={{
                        base: useColorModeValue('gray.200', 'gray.900'),
                        md: 'transparent',
                    }}
                >
                    <Stack py={{base: 4, md: 'inherit'}} w="full" alignItems={'center'} spacing="4" direction={['column', 'column', 'row']}>
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
                        <Button variant="ghost" onClick={handleThemeChange}>
                            {colorMode === 'light' ? <Text fontSize="lg">{DARK_MODE_ICON}</Text> : <Text fontSize="lg">{LIGHT_MODE_ICON}</Text>}
                        </Button>
                    </Stack>
                </Box>
            </GridItem>
        </Grid>
    )
}

export default Header
