import '../styles/comm.scss'
import '../styles/markdown.scss'
import 'highlight.js/styles/github.css'
import '../styles/Components/CustomCursor.scss'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'

import { ChakraProvider } from '@chakra-ui/react'

import { CursorContextProvider } from '../context/cursor/CursorContext'
import dynamic from 'next/dynamic'

const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
  ssr: false,
})
function MyApp({ Component, pageProps, blogCollection }) {
  const getLayout = Component.getLayout || (page => page)
  const categories = blogCollection.categories

  return (
    <ChakraProvider>
      <CursorContextProvider>
        {getLayout(
          <Component {...pageProps} blogCollection={blogCollection} />,
          categories
        )}
        <CustomCursor />
      </CursorContextProvider>
    </ChakraProvider>
  )
}

import { BlogCollection } from '../helpers/index'
MyApp.getInitialProps = async appContext => {
  try {
    const blogCollection = new BlogCollection()

    return { blogCollection }
  } catch (e) {
    return { categories: [] }
  }
}

export default MyApp
