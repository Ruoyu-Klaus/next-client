/*
 * @Author: your name
 * @Date: 2021-08-24 16:46:15
 * @LastEditTime: 2021-09-05 17:22:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \next-client\components\_SearchBar.js
 */
import React, { useContext, useState, useRef } from 'react';
import '../styles/Components/_SearchBar.less';

import { CursorContext } from '../context/cursor/CursorContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SearchBar(props) {
  const { searchHanlder } = props;
  const { setCursorType } = useContext(CursorContext);
  const [btnIcon, setBtnIcon] = useState('search');
  const [searchValue, setSearchValue] = useState('');

  const inputSearchRef = useRef();
  const btnRef = useRef();
  let inputEl = inputSearchRef.current;
  let btnEl = btnRef.current;
  const hanleFocus = e => {
    e.preventDefault();
    e.stopPropagation();
    btnEl && btnEl.classList.toggle('focus');
    inputEl && inputEl.classList.toggle('focus');
    btnEl.classList.contains('focus')
      ? setBtnIcon('caret-left')
      : setBtnIcon('search');
  };

  return (
    <div className='search-box'>
      <button
        className='btn-search'
        onClick={hanleFocus}
        ref={btnRef}
        onMouseEnter={e => setCursorType('magnifier')}
        onMouseLeave={e => setCursorType('default')}
      >
        <FontAwesomeIcon icon={btnIcon} color='black' />
      </button>
      <input
        type='text'
        ref={inputSearchRef}
        className='input-search'
        placeholder='搜索一下...'
        value={searchValue}
        onChange={event => {
          searchHanlder(event.target.value);
          setSearchValue(event.target.value);
        }}
      />
    </div>
  );
}

export default SearchBar;
