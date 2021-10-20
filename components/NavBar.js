import React, { useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import NavBarLogo from './NavBarLogo';
import MenuItemLink from './MenuItemLink';
import MenuToggleForSmallScreen from './NavBarMenuToggle';

import {
  Box,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import { CursorContext } from '../context/cursor/CursorContext';
import { ThemeContext } from '../context/theme/ThemeContext';
import useRouterScroll from '../hooks/useRouterScroll';

Header.propTypes = {
  navArray: PropTypes.array,
};

function Header({ navArray = [] }) {
  const { setCursorType } = useContext(CursorContext);
  const {
    theme: { isDarkMode },
    setDarkTheme,
    setLightTheme,
  } = useContext(ThemeContext);

  const { colorMode, toggleColorMode } = useColorMode();

  const Router = useRouter();
  useRouterScroll();

  const hanleSearchBtn = e => {
    e.preventDefault();
    e.stopPropagation();
    Router.push({
      pathname: `/blog/search/`,
    });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenuIcon = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    isDarkMode
      ? document.body.classList.add('dark-mode')
      : document.body.classList.remove('dark-mode');
  }, []);

  const handleThemeChange = useCallback(
    e => {
      toggleColorMode();
      e.preventDefault();
      e.stopPropagation();
      isDarkMode ? setLightTheme() : setDarkTheme();
      document.body.classList.toggle('dark-mode');
    },
    [isDarkMode]
  );

  return (
    <Grid
      w='full'
      h={16}
      px={4}
      templateColumns='repeat(3, 1fr)'
      bg={useColorModeValue('gray.100', 'gray.900')}
      borderBottomWidth={'1px'}
      borderBottomStyle={'solid'}
      borderBottomColor={useColorModeValue('gray.200', 'gray.800')}
      alignItems={'center'}
    >
      <HStack spacing={{ base: 'none', md: 4 }}>
        <Button variant='ghost' onClick={handleThemeChange}>
          {colorMode === 'light' ? (
            <Text
              fontSize='lg'
              onMouseEnter={e => setCursorType('moon')}
              onMouseLeave={e => setCursorType('default')}
            >
              🌙
            </Text>
          ) : (
            <Text
              fontSize='lg'
              onMouseEnter={e => setCursorType('sun')}
              onMouseLeave={e => setCursorType('default')}
            >
              🌤️
            </Text>
          )}
        </Button>
        <Button
          variant='ghost'
          onClick={hanleSearchBtn}
          onMouseEnter={e => setCursorType('magnifier')}
          onMouseLeave={e => setCursorType('default')}
        >
          <SearchIcon />
        </Button>
      </HStack>
      <GridItem w={'full'} justifySelf='center'>
        <NavBarLogo />
      </GridItem>

      <GridItem justifySelf='end'>
        <MenuToggleForSmallScreen
          toggle={toggleMenuIcon}
          isMenuOpen={isMenuOpen}
        />
        <Box
          display={{ base: isMenuOpen ? 'flex' : 'none', md: 'flex' }}
          top={16}
          right={0}
          zIndex={20}
          w={{ base: '100vw', md: 'auto' }}
          pos={{ base: 'fixed', md: 'unset' }}
        >
          <Stack
            pt={{ base: 4, md: 'inherit' }}
            w='full'
            alignItems={'center'}
            spacing='4'
            direction={['column', 'column', 'row', 'row']}
          >
            <MenuItemLink>
              <Button variant='link' leftIcon={'💒'}>
                首页
              </Button>
            </MenuItemLink>
            {navArray.map(nav => (
              <MenuItemLink key={nav.category_name}>
                <Button variant='link'>{nav.category_name}</Button>
              </MenuItemLink>
            ))}
          </Stack>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default Header;
