import '../styles/comm.scss'
import '../styles/markdown.scss'
import '../styles/Components/CustomCursor.scss'
import '../styles/code-highlight-dark.scss'
import '../styles/code-highlight-light.scss'
import {ChakraProvider} from '@chakra-ui/react'
import theme from '../styles/chakraTheme'
import dynamic from 'next/dynamic'

import categories from '../_posts/categories.json'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {ssr: false})
const NavBar = dynamic(() => import('../components/NavBar'), {ssr: false})

import Footer from '../components/Footer'

function MyApp({Component, pageProps}) {
    const getLayout = Component.getLayout || ((page) => page)
    return (
        <ChakraProvider theme={theme}>
            <NavBar navArray={categories} />
            {getLayout(<Component {...pageProps} />)}
            <Footer mb={4} />
            <CustomCursor />
        </ChakraProvider>
    )
}

export default MyApp
