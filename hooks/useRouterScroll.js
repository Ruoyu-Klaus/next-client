/*
 * @Author: your name
 * @Date: 2021-08-23 21:03:17
 * @LastEditTime: 2021-09-08 09:43:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \next-client\hooks\useRouterScroll.js
 */
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function useRouterScroll({ behavior = 'smooth', left = 0, top = 0 } = {}) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChangeComplete = url => {
      window.scrollTo({ top, left, behavior });
      window.gtag('config', 'G-TVHYT0JX36', {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // If the component is unmounted, unsubscribe from the event
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behavior, left, top]);
}

export default useRouterScroll;
