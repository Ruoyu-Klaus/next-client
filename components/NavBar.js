import React, {useCallback, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

import NavBarLogo from "./NavBarLogo";
import MenuItemLink from "./MenuItemLink";
import MenuToggleForSmallScreen from "./NavBarMenuToggle";

import {Box, Button, Grid, GridItem, HStack, Stack, Text, useColorMode, useColorModeValue,} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";

import {CursorContext} from "../context/cursor/CursorContext";
import useRouterScroll from "../hooks/useRouterScroll";
import {DARK_MODE_ICON, LIGHT_MODE_ICON, NAVIGATION_HOMEPAGE,} from "../utils/content";

Header.propTypes = {
  navArray: PropTypes.array,
};

function Header({ navArray = [] }) {
  const { setCursorType } = useContext(CursorContext);

  const { colorMode, toggleColorMode } = useColorMode();
  useRouterScroll();

  const hoverMouseHandler = useCallback((e, cursorType) => {
    e.preventDefault();
    setCursorType(cursorType);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenuIcon = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    colorMode === "dark"
      ? document.body.classList.add("dark-mode")
      : document.body.classList.remove("dark-mode");
  }, []);

  const handleThemeChange = useCallback(
    (e) => {
      toggleColorMode();
      e.preventDefault();
      e.stopPropagation();
      document.body.classList.toggle("dark-mode");
    },
    [colorMode]
  );

  return (
    <Grid
      className="header"
      w="full"
      h={16}
      px={4}
      templateColumns="repeat(3, 1fr)"
      bg={useColorModeValue("gray.50", "#333")}
      borderBottomWidth={"1px"}
      borderBottomStyle={"solid"}
      borderBottomColor={useColorModeValue("gray.200", "gray.800")}
      alignItems={"center"}
    >
      <HStack spacing={{ base: "none", md: 4 }}>
        <Button variant="ghost" onClick={handleThemeChange}>
          {colorMode === "light" ? (
            <Text
              fontSize="lg"
              onMouseEnter={(e) => hoverMouseHandler(e, "moon")}
              onMouseLeave={(e) => hoverMouseHandler(e, "default")}
            >
              {DARK_MODE_ICON}
            </Text>
          ) : (
            <Text
              fontSize="lg"
              onMouseEnter={(e) => hoverMouseHandler(e, "sun")}
              onMouseLeave={(e) => hoverMouseHandler(e, "default")}
            >
              {LIGHT_MODE_ICON}
            </Text>
          )}
        </Button>
        <MenuItemLink to="/blog/search">
          <Button
            variant="ghost"
            onMouseEnter={(e) => hoverMouseHandler(e, "magnifier")}
            onMouseLeave={(e) => hoverMouseHandler(e, "default")}
          >
            <SearchIcon />
          </Button>
        </MenuItemLink>
      </HStack>
      <GridItem justifySelf="center">
        <NavBarLogo w="80%" m="0 auto" />
      </GridItem>

      <GridItem justifySelf="end">
        <MenuToggleForSmallScreen
          display={{ base: "block", md: "none" }}
          toggle={toggleMenuIcon}
          isMenuOpen={isMenuOpen}
        />
        <Box
          display={{ base: isMenuOpen ? "flex" : "none", md: "flex" }}
          top={16}
          right={0}
          zIndex={20}
          w={{ base: "100vw", md: "auto" }}
          pos={{ base: "fixed", md: "unset" }}
          bg={{
            base: useColorModeValue("gray.200", "gray.900"),
            md: "transparent",
          }}
        >
          <Stack
            py={{ base: 4, md: "inherit" }}
            w="full"
            alignItems={"center"}
            spacing="4"
            direction={["column", "column", "row"]}
          >
            <MenuItemLink to="/blog">
              <Button variant="link">{NAVIGATION_HOMEPAGE}</Button>
            </MenuItemLink>
            {navArray.map((item) => (
              <MenuItemLink
                to={`/blog/post/${encodeURIComponent(item)}`}
                key={item}
              >
                <Button variant="link">{item.toUpperCase()}</Button>
              </MenuItemLink>
            ))}
          </Stack>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default Header;
