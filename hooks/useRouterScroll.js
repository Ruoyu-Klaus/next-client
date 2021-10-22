import { useRouter } from 'next/router';
import { useEffect } from 'react';

function useRouterScroll({ behavior = 'smooth', left = 0, top = 0 } = {}) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChangeComplete = url => {
      window.scrollTo({ top, left, behavior });
      process.env === 'production' &&
        window.gtag('config', 'G-TVHYT0JX36', {
          page_path: url,
        });

      /* 
      load postcard style prevent tansition flash 
      Temp solution
      */
      const tempFix = () => {
        const allStyleElems = document.querySelectorAll('style[media="x"]');
        allStyleElems.forEach(elem => {
          elem.removeAttribute('media');
        });
      };
      tempFix();
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
