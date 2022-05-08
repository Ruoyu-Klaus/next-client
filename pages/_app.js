import '../styles/comm.scss'
import '../styles/markdown.scss'
import 'highlight.js/styles/github.css'
import '../styles/Components/CustomCursor.scss'

import {ChakraProvider} from '@chakra-ui/react'

import dynamic from 'next/dynamic'
import {CursorContextProvider} from '../context/cursor/CursorContext'
import CanvasLoadingSpinner from '../components/CanvasContainer'
import categories from '../_posts/categories.json'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
    ssr: false,
})
const ThreeCanvas = dynamic(() => import('../components/ThreejsCanvas'), {
    ssr: false,
    loading: () => <CanvasLoadingSpinner />,
})

function MyApp({Component, pageProps}) {
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

export default MyApp
