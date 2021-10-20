/*
 * @Author: Ruoyu
 * @FilePath: \next-client\pages\_app.js
 */
import '../styles/comm.scss';
import '../styles/markdown.scss';
import 'highlight.js/styles/github.css';
import '../styles/Components/CustomCursor.scss';
import '../styles/Layout/bloglayout.scss';

import { ChakraProvider } from '@chakra-ui/react';

import { CursorContextProvider } from '../context/cursor/CursorContext';
import { ThemeContextProvider } from '../context/theme/ThemeContext';
import dynamic from 'next/dynamic';

import { getArticleCategories } from '../request';

const CustomCorsor = dynamic(() => import('../components/CustomCursor'), {
  ssr: false,
});

function MyApp({ Component, pageProps, categories }) {
  const getLayout = Component.getLayout || (page => page);
  return (
    <ChakraProvider>
      <ThemeContextProvider>
        <CursorContextProvider>
          {getLayout(<Component {...pageProps} />, categories)}
          <CustomCorsor />
        </CursorContextProvider>
      </ThemeContextProvider>
    </ChakraProvider>
  );
}

// This function gets called at build time
MyApp.getInitialProps = async () => {
  try {
    const categories = await getArticleCategories();
    return { categories: categories || [] };
  } catch (e) {
    return { categories: [] };
  }
};

export default MyApp;
