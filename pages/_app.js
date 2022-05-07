import '../styles/comm.scss'
import '../styles/markdown.scss'
import 'highlight.js/styles/github.css'
import '../styles/Components/CustomCursor.scss'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'

import {ChakraProvider} from '@chakra-ui/react'

import dynamic from 'next/dynamic'
import {CursorContextProvider} from '../context/cursor/CursorContext'
import CanvasLoadingSpinner from '../components/CanvasContainer'

import App from 'next/app'
import categories from '../_posts/categories.json'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
    ssr: false,
})
const ThreeCanvas = dynamic(() => import('../components/ThreejsCanvas'), {
    ssr: false,
    loading: () => <CanvasLoadingSpinner />,
})

function MyApp({Component, pageProps, blogCollection = {}}) {
    const getLayout = Component.getLayout || ((page) => page)
    return (
        <ChakraProvider>
            <CursorContextProvider>
                {getLayout(<Component {...pageProps} blogCollection={blogCollection} />, categories, <ThreeCanvas />)}
                <CustomCursor />
            </CursorContextProvider>
        </ChakraProvider>
    )
}

MyApp.getInitialProps = async (appContext) => {
    const pageProps = await App.getInitialProps(appContext)
    try {
        const {BlogCollection} = await import('../helpers/index')
        const blogCollection = new BlogCollection()
        return {...pageProps, blogCollection}
    } catch (e) {
        return {...pageProps, blogCollection: {}}
    }
}

export default MyApp
