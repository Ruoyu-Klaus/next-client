/*
 * @Author: your name
 * @Date: 2021-07-29 18:38:13
 * @LastEditTime: 2021-09-04 21:13:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \next-client\components\Header.js
 */
import React, { useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Row, Col, Menu } from 'antd';
import '../styles/Components/Header.less';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CursorContext } from '../context/cursor/CursorContext';
import useRouterScroll from '../hooks/useRouterScroll';
import SearchBar from './SearchBar';
function Header(props) {
  const { navArray = [], handleSearch } = props;
  const { setCursorType } = useContext(CursorContext);
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

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      let a = localStorage.getItem('themeMode') ? true : false;
      return a;
    } else {
      return false;
    }
  });

  const hanleSearchBtn = e => {
    e.preventDefault();
    e.stopPropagation();
    Router.push({
      pathname: `/blog/search/`,
    });
  };

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    isDarkMode && document.body.classList.add('dark-mode');
    setLoaded(true);
  }, []);

  const handleThemeChange = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setIsDarkMode(pre => !pre);
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', !isDarkMode);
      }
      document.body.classList.toggle('dark-mode');
    },
    [isDarkMode]
  );

  return (
    <div className='header'>
      <Row type='flex' justify='center'>
        <Col xs={4} sm={4} md={8} lg={8} xl={8}>
          <Row className='header-left' type='flex'>
            <Col>
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
            </Col>
            <Col xs={0} sm={0} md={8} lg={8} xl={12}>
              <button
                className='search-btn'
                onClick={hanleSearchBtn}
                onMouseEnter={e => setCursorType('magnifier')}
                onMouseLeave={e => setCursorType('default')}
              >
                <FontAwesomeIcon icon={'search'} color='black' />
              </button>
              {/* <SearchBar searchHanlder={handleSearch} /> */}
            </Col>
          </Row>
        </Col>
        <Col xs={20} sm={16} md={8} lg={8} xl={8} flex='1'>
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
        </Col>
        <Col xs={0} sm={4} md={8} lg={8} xl={8}>
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
        </Col>
      </Row>
    </div>
  );
}

Header.propTypes = {
  navArray: PropTypes.array,
  handleSearch: PropTypes.func,
};

export default Header;
