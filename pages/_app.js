/*
 * @Author: Ruoyu
 * @FilePath: \next-client\pages\_app.js
 */
import '../styles/comm.less';
import '../styles/markdown.less';
import 'highlight.js/styles/github.css';

import { CursorContextProvider } from '../context/cursor/CursorContext';
import dynamic from 'next/dynamic';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

import { BackTop } from 'antd';

import { getArticleCategories } from '../request';

const CustomCorsor = dynamic(() => import('../components/CustomCursor'), {
  ssr: false,
});
function MyApp({ Component, pageProps, categories }) {
  const getLayout = Component.getLayout || (page => page);
  return (
    <CursorContextProvider>
      {getLayout(<Component {...pageProps} />, categories)}
      <CustomCorsor />
      <BackTop />
    </CursorContextProvider>
  );
}

// This function gets called at build time
MyApp.getInitialProps = async () => {
  // Call an external API endpoint to get posts
  try {
    const categories = await getArticleCategories();
    // will receive `posts` as a prop at build time
    return { categories: categories || [] };
  } catch (e) {
    return { categories: [] };
  }
};

export default MyApp;
