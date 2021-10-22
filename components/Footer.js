import { Box, VStack, Text, Link } from '@chakra-ui/react';

const Footer = props => (
  <Box {...props}>
    <VStack className='footer-div'>
      <Text fontSize='0.4rem'>
        Powered by <Link href='https://nextjs.org/'>Next.js</Link>
      </Text>
      <Text fontSize='0.4rem'>
        <Link href='https://ruoyu.life'>ruoyu.life</Link>
      </Text>
    </VStack>
  </Box>
);

export default Footer;
