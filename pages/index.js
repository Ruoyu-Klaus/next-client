import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef, useContext } from 'react';
import FadeIn from '../components/FadeIn';
import { CursorContext } from '../context/cursor/CursorContext';
import '../styles/Pages/index.less';

function Cover() {
  const { setCursorType } = useContext(CursorContext);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const contactRef = useRef();

  const handleTrigger = () => {
    setIsOpenContact(state => !state);
  };

  return (
    <div className='root'>
      <Head>
        <title>首页 | Ruoyu</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <>
        <div
          className='top-wrapper'
          style={{ backgroundImage: 'url(./SaoPaulo.jpg)' }}
        >
          <div className='top-textImage'>
            <img
              src='../imruoyu.png'
              alt='Lettering fonts'
              designfrom='https://www.fontspace.com/youth-touch-font-f30771'
            />
            <img src='../softewaredeveloper.png' alt='Lettering fonts' />
          </div>
          <div className='rtCorner'>
            <div
              className={`contactTrigger ${isOpenContact ? 'active' : 'close'}`}
              onClick={handleTrigger}
            >
              <svg width='80' height='80' viewBox='0 0 80 80'>
                <path
                  className='line line1'
                  d='M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058'
                />
                <path className='line line2' d='M 20,50 H 80' />
                <path
                  className='line line3'
                  d='M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942'
                />
              </svg>
            </div>
            <div
              ref={contactRef}
              className={`contactContentWrapper ${
                isOpenContact ? 'active' : 'close'
              }`}
            ></div>

            <nav
              className={`contactContent ${isOpenContact ? 'active' : 'close'}`}
            >
              <ul>
                <li>
                  <Link href={{ pathname: '/blog' }}>
                    <a
                      className='blog'
                      onMouseEnter={e => setCursorType('link')}
                      onMouseLeave={e => setCursorType('default')}
                    >
                      Blog.
                    </a>
                  </Link>
                </li>

                <li>
                  <a href='#0'>Timeline.</a>
                </li>
                <li>
                  <a href='ruoyuwangruoyu@hotmail.com'>Projects.</a>
                </li>
                <li>
                  <a href='ruoyuwangruoyu@hotmail.com'>Contact.</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </>

      {/* <div
        style={{
          width: '100vw',
          height: '100vh',
          color: 'black',
          marginTop: '10vh',
        }}
      >
        <FadeIn>
          <div
            style={{
              height: '20vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'blue',
            }}
          >
            Hello
          </div>
        </FadeIn>
        <div
          style={{
            backgroundImage: 'url(./SaoPaulo.jpg)',
            position: 'relative',
            width: '100vw',
            height: '30vh',
            zIndex: -10,
            backgroundAttachment: 'fixed',
          }}
        ></div>
        <FadeIn>
          <div
            style={{
              height: '20vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'blue',
              marginTop: '10vh',
            }}
          >
            Hello
          </div>
        </FadeIn>
      </div> */}
    </div>
  );
}

import { getArticleList } from '../request';

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  // const res = await getArticleList();
  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      // posts: res,
    },
  };
}
export default Cover;
