import '../styles/comm.scss'
import '../styles/markdown.scss'
import '../styles/Components/CustomCursor.scss'
import '../styles/code-highlight-dark.scss'
import '../styles/code-highlight-light.scss'
import {ChakraProvider} from '@chakra-ui/react'
import theme from '../styles/chakraTheme'

import categories from '../_posts/categories.json'

import CustomCursor from '../components/CustomCursor'

function MyApp({Component, pageProps}) {
    const getLayout = Component.getLayout || ((page) => page)
    return (
        <ChakraProvider theme={theme}>
            {getLayout(<Component {...pageProps} />, categories)}
            <CustomCursor />
        </ChakraProvider>
    )
}

export default MyApp
