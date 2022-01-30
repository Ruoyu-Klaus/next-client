import {
  HStack,
  Divider,
  Text,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';

function CustomDivider({ text, dividerWidth = '30%', ...rest }) {
  return (
    <HStack w='full'>
      <Center w='full'>
        <Divider w={dividerWidth} {...rest} />
        <Text
          mx={4}
          color={useColorModeValue('gray.500', 'gray.300')}
          fontSize='0.7rem'
        >
          {text}
        </Text>
        <Divider w={dividerWidth} {...rest} />
      </Center>
    </HStack>
  );
}

export default CustomDivider;
