import { useContext } from 'react';
import Link from 'next/link';
import { Center, useColorMode, Image } from '@chakra-ui/react';
import { CursorContext } from '../context/cursor/CursorContext';

function NavBarLogo({ to = '/' }) {
  const { colorMode } = useColorMode();
  const { setCursorType } = useContext(CursorContext);

  return (
    <Center>
      <Link href={{ pathname: to }}>
        <a
          onMouseEnter={e => setCursorType('link')}
          onMouseLeave={e => setCursorType('default')}
        >
          <Image
            objectFit='cover'
            src={
              colorMode === 'light' ? '/klauswang.png' : '/klauswang-white.png'
            }
          />
        </a>
      </Link>
    </Center>
  );
}

export default NavBarLogo;
