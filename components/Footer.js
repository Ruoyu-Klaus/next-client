import { Box, Link, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";

const Footer = (props) => (
    <Box {...props}>
        <VStack className="footer-div">
            <Text fontSize="0.5rem">
                <Link href="https://ruoyu.life">ruoyu.life Made by Ruoyu Klaus</Link>
            </Text>
            <Text fontSize="0.5rem">
                Copyright © {dayjs().year()} <Link href="https://ruoyu.life">ruoyu.life All rights reserved.</Link>
            </Text>
        </VStack>
    </Box>
)

export default Footer
