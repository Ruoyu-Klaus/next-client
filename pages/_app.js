import '../styles/comm.scss'
import '../styles/markdown.scss'
import '../styles/Components/CustomCursor.scss'
import '../styles/code-highlight-dark.scss'
import '../styles/code-highlight-light.scss'
import {ChakraProvider, VStack} from '@chakra-ui/react'
import theme from '../styles/chakraTheme'
import dynamic from 'next/dynamic'

import categories from '../_posts/categories.json'
import CanvasLoadingSpinner from '../components/CanvasContainer'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {ssr: false})
const NavBar = dynamic(() => import('../components/NavBar'), {ssr: false})
const ThreeCanvas = dynamic(() => import('../components/ThreejsCanvas'), {
    ssr: false,
    loading: () => <CanvasLoadingSpinner />,
})

import Footer from '../components/Footer'

function MyApp({Component, pageProps}) {
    const getLayout = Component.getLayout || ((page) => page)
    return (
        <ChakraProvider theme={theme}>
            <VStack minH="100vh">
                <NavBar navArray={categories} />
                {Component.showModel ? <ThreeCanvas /> : <></>}
                {getLayout(<Component {...pageProps} />)}
                <Footer mb={4} />
            </VStack>

            <CustomCursor />
        </ChakraProvider>
    )
}

export default MyApp
