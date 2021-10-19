import React, { useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';

import styles from '../styles/Components/Header.module.scss';

import {
  Box,
  Grid,
  GridItem,
  Center,
  HStack,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import { CursorContext } from '../context/cursor/CursorContext';
import { ThemeContext } from '../context/theme/ThemeContext';
import useRouterScroll from '../hooks/useRouterScroll';

function Header(props) {
  const { navArray = [] } = props;
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

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    isDarkMode
      ? document.body.classList.add('dark-mode')
      : document.body.classList.remove('dark-mode');
    setLoaded(true);
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
              {' '}
              🌙
            </Text>
          ) : (
            <Text
              fontSize='lg'
              onMouseEnter={e => setCursorType('sun')}
              onMouseLeave={e => setCursorType('default')}
            >
              {' '}
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
        <Center>
          <Box
            w={44}
            h={16}
            bgPosition='center'
            bgRepeat='no-repeat'
            bgSize='cover'
            bgImage={
              colorMode === 'light'
                ? `url(/klauswang.png)`
                : `url('/klauswang-white.png')`
            }
          >
            <Link href={{ pathname: '/' }}>
              <a
                className={styles.logoLink}
                onMouseEnter={e => setCursorType('link')}
                onMouseLeave={e => setCursorType('default')}
              ></a>
            </Link>
          </Box>
        </Center>
      </GridItem>

      <GridItem justifySelf='end'>
        <HStack spacing='4'>
          <Button variant='link' leftIcon={'💒'}>
            <Text fontSize='md'>首页</Text>
          </Button>
        </HStack>
      </GridItem>
    </Grid>
  );
}

Header.propTypes = {
  navArray: PropTypes.array,
  handleSearch: PropTypes.func,
};

export default Header;
