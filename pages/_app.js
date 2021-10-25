import '../styles/comm.scss';
import '../styles/markdown.scss';
import 'highlight.js/styles/github.css';
import '../styles/Components/CustomCursor.scss';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import { ChakraProvider } from '@chakra-ui/react';

import { CursorContextProvider } from '../context/cursor/CursorContext';
import dynamic from 'next/dynamic';

import { getArticleCategories } from '../request';

const CustomCorsor = dynamic(() => import('../components/CustomCursor'), {
  ssr: false,
});

function MyApp({ Component, pageProps, categories }) {
  const getLayout = Component.getLayout || (page => page);
  return (
    <ChakraProvider>
      <CursorContextProvider>
        {getLayout(<Component {...pageProps} />, categories)}
        <CustomCorsor />
      </CursorContextProvider>
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
