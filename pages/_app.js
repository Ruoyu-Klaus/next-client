/*
 * @Author: your name
 * @Date: 2021-07-29 18:38:13
 * @LastEditTime: 2021-08-26 11:51:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\pages\_app.js
 */
import '../styles/comm.less';
import 'highlight.js/styles/monokai-sublime.css';

import { CursorContextProvider } from '../context/cursor/CursorContext';
import CustomCorsor from '../components/CustomCursor';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
import { BackTop } from 'antd';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);

  return (
    <CursorContextProvider>
      {getLayout(<Component {...pageProps} />)}
      <CustomCorsor />
      <BackTop />
    </CursorContextProvider>
  );
}

export default MyApp;
