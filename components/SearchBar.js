/*
 * @Author: Ruoyu
 * @FilePath: \next-client\components\SearchBar.js
 */
import { useState, useEffect } from 'react';
import '../styles/Components/SearchBar.less';
import { Typography, Button } from 'antd';
const { Title } = Typography;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SearchBar(props) {
  const { onInputSearch } = props;
  const [searchValue, setSearchValue] = useState('');
  const onInputChange = event => {
    setSearchValue(event.target.value);
  };
  return (
    <div className='searchBar-root'>
      <Title className='searchBar-title'>SEARCH RUOYU.LIFE BLOG</Title>
      <center className='searchBar-bar'>
        <div>
          <input
            autoComplete='off'
            className='searchBar-input'
            type='text'
            title='Search'
            name='Search'
            onChange={onInputChange}
            value={searchValue}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                onInputSearch.call(null, searchValue);
              }
            }}
          />
          <Button
            onClick={onInputSearch.bind(null, searchValue)}
            ghost={true}
            className='searchBar-btn'
            icon={<FontAwesomeIcon icon='search' color='black' />}
          />
        </div>
      </center>
    </div>
  );
}

export default SearchBar;
