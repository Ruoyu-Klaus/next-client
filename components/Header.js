import React, { useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Menu } from 'antd';
import '../styles/Components/Header.less';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const Router = useRouter();
  useRouterScroll();

  const handleClick = e => {
    if (e.key == 'blog') {
      Router.replace({ pathname: '/blog' });
    } else {
      Router.push({
        pathname: `/blog/post/${encodeURIComponent(e.key)}`,
      });
    }
  };

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
      e.preventDefault();
      e.stopPropagation();
      isDarkMode ? setLightTheme() : setDarkTheme();
      document.body.classList.toggle('dark-mode');
    },
    [isDarkMode]
  );

  return (
    <div className='header'>
      <div className='h-left'>
        <div className='mode-trigger' onClick={handleThemeChange}>
          {loaded &&
            (isDarkMode ? (
              <div
                icon='moon'
                color='#f7b63f'
                size='1x'
                onMouseEnter={e => setCursorType('moon')}
                onMouseLeave={e => setCursorType('default')}
              >
                🌙
              </div>
            ) : (
              <div
                icon='sun'
                color='#f0b400'
                size='1x'
                onMouseEnter={e => setCursorType('sun')}
                onMouseLeave={e => setCursorType('default')}
              >
                🌤️
              </div>
            ))}
        </div>
        <button
          className='search-btn'
          onClick={hanleSearchBtn}
          onMouseEnter={e => setCursorType('magnifier')}
          onMouseLeave={e => setCursorType('default')}
        >
          <FontAwesomeIcon icon={'search'} color='black' />
        </button>
      </div>
      <div className='h-right'>
        <Menu mode='horizontal' onClick={handleClick} className='noselect'>
          <Menu.Item key='blog'>
            <FontAwesomeIcon icon='home' color='black' /> 首页
          </Menu.Item>
          {navArray.map(nav => (
            <Menu.Item key={nav.category_name}>
              <FontAwesomeIcon icon={nav.category_icon} color='black' />{' '}
              {nav.category_name}
            </Menu.Item>
          ))}
        </Menu>
      </div>

      <div className='header-center'>
        <Link href={{ pathname: '/' }}>
          <a
            onMouseEnter={e => setCursorType('link')}
            onMouseLeave={e => setCursorType('default')}
          >
            <div
              className='header-logo'
              style={{
                backgroundImage:
                  loaded &&
                  (isDarkMode
                    ? `url('/klauswang-white.png')`
                    : `url(/klauswang.png)`),
              }}
            />
          </a>
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  navArray: PropTypes.array,
  handleSearch: PropTypes.func,
};

export default Header;
