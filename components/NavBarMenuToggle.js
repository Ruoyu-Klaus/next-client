import React from 'react';
import { Box } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';

function MenuToggleForSmallScreen({ toggle, isMenuOpen }) {
  return (
    <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
      {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
    </Box>
  );
}

export default MenuToggleForSmallScreen;
