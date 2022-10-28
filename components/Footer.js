import {Box, Link, Text, VStack} from '@chakra-ui/react'

const Footer = (props) => (
    <Box {...props}>
        <VStack className="footer-div">
            <Text fontSize="0.5rem">
                <Link href="https://ruoyu.life">ruoyu.life</Link>
            </Text>
            <Text fontSize="0.5rem">
                Copyright © 2022 <Link href="https://ruoyu.life">ruoyu.life All rights reserved.</Link>
            </Text>
        </VStack>
    </Box>
)

export default Footer
