import '../styles/comm.scss'
import '../styles/markdown.scss'
import 'highlight.js/styles/github.css'
import '../styles/Components/CustomCursor.scss'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'

import {ChakraProvider} from '@chakra-ui/react'

import dynamic from 'next/dynamic'
import App from 'next/app'
import {CursorContextProvider} from '../context/cursor/CursorContext'
import CanvasLoadingSpinner from '../components/CanvasContainer'
import {getCategories} from '../services'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
    ssr: false,
})
const ThreeCanvas = dynamic(() => import('../components/ThreejsCanvas'), {
    ssr: false,
    loading: () => <CanvasLoadingSpinner />,
})

function MyApp({Component, pageProps, categories}) {
    const getLayout = Component.getLayout || ((page) => page)
    return (
        <ChakraProvider>
            <CursorContextProvider>
                {getLayout(<Component {...pageProps} />, categories, <ThreeCanvas />)}
                <CustomCursor />
            </CursorContextProvider>
        </ChakraProvider>
    )
}

MyApp.getInitialProps = async (appContext) => {
    const pageProps = await App.getInitialProps(appContext)
    const categories = await getCategories()
    try {
        return {...pageProps, categories}
    } catch (e) {
        return {...pageProps}
    }
}

export default MyApp
