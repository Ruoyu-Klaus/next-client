import { useEffect, useState } from 'react';

import { IconButton } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';

function BackToTop() {
  const [isReachHalfScreenHeight, setIsReachHalfScreenHeight] = useState(false);

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const handleWindowScrollEvent = _ => {
      const clientHeight = window.innerHeight;
      const isReachHalfScreenHeight = window.pageYOffset > clientHeight / 2;
      isReachHalfScreenHeight
        ? setIsReachHalfScreenHeight(true)
        : setIsReachHalfScreenHeight(false);
    };

    window.addEventListener('scroll', handleWindowScrollEvent);
    return () => {
      window.removeEventListener('scroll', handleWindowScrollEvent);
    };
  }, []);
  return (
    <IconButton
      display={isReachHalfScreenHeight ? 'block' : 'none'}
      pos='fixed'
      right='50px'
      bottom='50px'
      onClick={scrollToPageTop}
      aria-label='back to top'
      fontSize='30px'
      variant='ghost'
      icon={<ChevronUpIcon />}
    />
  );
}

export default BackToTop;
