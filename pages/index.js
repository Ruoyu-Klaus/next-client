import Head from 'next/head'
import NextLink from 'next/link'
import {useRef} from 'react'

import styles from '../styles/Pages/index.module.scss'

import {
    Center,
    Container,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerOverlay,
    HStack,
    Icon,
    Link,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'

import {VscGithubAlt, VscMail} from 'react-icons/vsc'

function Cover() {
    const rightMenuRef = useRef()

    const {isOpen, onOpen, onClose} = useDisclosure()

    return (
        <>
            <Head>
                <title>Home | 首页</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container maxW={'100vw'} p={0}>
                <Center w="100vw" h="100vh" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" bgImage={'url(./SaoPaulo.jpg)'}>
                    <VStack className="noselect">
                        <NextLink href={{pathname: '/blog'}}>
                            <a>
                                <img
                                    className={styles.authorName}
                                    src="../imruoyu.png"
                                    alt="Lettering fonts"
                                    designfrom="https://www.fontspace.com/youth-touch-font-f30771"
                                />
                            </a>
                        </NextLink>
                        <img className={styles.authorInfo} src="../softewaredeveloper.png" alt="Lettering fonts" />
                    </VStack>
                </Center>
                <div className={styles.rightCornor}>
                    <div className={`${styles.menuTrigger} ${isOpen ? `${styles.active}` : 'close'}`} onClick={onOpen} ref={rightMenuRef}>
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <path
                                className={`${styles.line} ${styles.line1}`}
                                d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                            />
                            <path className={`${styles.line} ${styles.line2}`} d="M 20,50 H 80" />
                            <path
                                className={`${styles.line} ${styles.line3}`}
                                d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                            />
                        </svg>
                    </div>
                </div>
                <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={rightMenuRef} size={'sm'}>
                    <DrawerOverlay />
                    <DrawerContent bg={'rgba(101, 88, 83, 0.85)'}>
                        <DrawerCloseButton />
                        <VStack w="full" h="full" my={40} spacing={3} alignItems="flex-end">
                            <DrawerBody>
                                <NextLink href={{pathname: '/blog'}}>
                                    <a className="blog">
                                        <Text fontSize="3xl">Blog.</Text>
                                    </a>
                                </NextLink>
                            </DrawerBody>
                            <DrawerFooter>
                                <HStack spacing={4}>
                                    <Link href="https://github.com/Ruoyu-Klaus" isExternal>
                                        <Icon as={VscGithubAlt} />
                                    </Link>
                                    <Link href="mailto:ruoyuwangruoyu@hotmail.com" isExternal>
                                        <Icon as={VscMail} />
                                    </Link>
                                </HStack>
                            </DrawerFooter>
                        </VStack>
                    </DrawerContent>
                </Drawer>
            </Container>
        </>
    )
}

export default Cover
