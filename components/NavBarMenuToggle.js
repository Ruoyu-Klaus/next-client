import React from 'react';
import { Box } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';

function MenuToggleForSmallScreen({ toggle, isMenuOpen, ...rest }) {
  return (
    <Box onClick={toggle} {...rest}>
      {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
    </Box>
  );
}

export default MenuToggleForSmallScreen;
