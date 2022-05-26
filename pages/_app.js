import '../styles/comm.scss'
import '../styles/markdown.scss'
import '../styles/Components/CustomCursor.scss'
import '../styles/code-highlight-dark.scss'
import '../styles/code-highlight-light.scss'
import {ChakraProvider} from '@chakra-ui/react'
import theme from '../styles/chakraTheme'

import dynamic from 'next/dynamic'
import {CursorContextProvider} from '../context/cursor/CursorContext'
import categories from '../_posts/categories.json'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
    ssr: false,
})

function MyApp({Component, pageProps}) {
    const getLayout = Component.getLayout || ((page) => page)
    return (
        <ChakraProvider theme={theme}>
            <CursorContextProvider>
                {getLayout(<Component {...pageProps} />, categories)}
                <CustomCursor />
            </CursorContextProvider>
        </ChakraProvider>
    )
}

export default MyApp
