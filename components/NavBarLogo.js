import Link from "next/link";
import {Center, Image, useColorMode} from "@chakra-ui/react";

function NavBarLogo({ to = "/", ...rest }) {
  const { colorMode } = useColorMode();

  return (
    <Center {...rest}>
      <Link href={{ pathname: to }}>
        <a>
          <Image
            objectFit="cover"
            src={
              colorMode === "light" ? "/klauswang.png" : "/klauswang-white.png"
            }
          />
        </a>
      </Link>
    </Center>
  );
}

export default NavBarLogo;
