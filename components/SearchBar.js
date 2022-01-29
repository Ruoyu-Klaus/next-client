import { useEffect, useState } from "react";
import CloudWords from "./Cloudwords";

import {
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function SearchBar(props) {
  const { keywords = [], onInputSearch } = props;
  const [searchValue, setSearchValue] = useState("");

  const onInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    onInputSearch(searchValue);
  }, [searchValue]);

  return (
    <>
      <CloudWords keywords={keywords} setSearchTerm={setSearchValue} />
      <Center my={4}>
        <Heading fontSize="1.5rem" as="h5">
          SEARCH RUOYU.LIFE BLOG
        </Heading>
      </Center>
      <Flex my={4} w="60%" m={"0 auto"}>
        <InputGroup>
          <Input
            placeholder="Try to click words above or enter keywords..."
            autoComplete="off"
            type="text"
            title="Index"
            name="Search"
            onChange={onInputChange}
            value={searchValue}
            onKeyPress={(e) => e.key === "Enter" && onInputSearch(searchValue)}
          />
          <InputRightElement
            children={
              <Button
                onClick={() => onInputSearch(searchValue)}
                variant="ghost"
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
