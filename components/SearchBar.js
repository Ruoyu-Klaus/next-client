import { useState } from 'react';
import CloudWords from './Cloudwords';

import {
  Flex,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function SearchBar(props) {
  const { keywords = [], onInputSearch } = props;
  const [searchValue, setSearchValue] = useState('');

  const onInputChange = event => {
    setSearchValue(event.target.value);
  };
  return (
    <>
      <CloudWords keywords={keywords} setSearchTerm={setSearchValue} />
      <Center my={4}>
        <Heading fontSize='1.5rem' as='h5'>
          SEARCH RUOYU.LIFE BLOG
        </Heading>
      </Center>
      <Flex my={4} w='60%' m={'0 auto'}>
        <InputGroup>
          <Input
            placeholder='Try to click words above or enter keywords...'
            autoComplete='off'
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
          <InputRightElement
            children={
              <Button
                onClick={onInputSearch.bind(null, searchValue)}
                variant='ghost'
              >
                <SearchIcon />
              </Button>
            }
          />
        </InputGroup>
      </Flex>
    </>
  );
}

export default SearchBar;
