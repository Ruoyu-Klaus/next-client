import {
  HStack,
  Divider,
  Text,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';

function NoSearchResult({ text }) {
  return (
    <HStack w='full'>
      <Center w='full'>
        <Divider w='200px' />
        <Text
          mx={4}
          color={useColorModeValue('gray.500', 'gray.300')}
          fontSize='0.7rem'
        >
          {text}
        </Text>
        <Divider w='200px' />
      </Center>
    </HStack>
  );
}

export default NoSearchResult;
