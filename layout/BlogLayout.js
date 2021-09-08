/*
 * @Author: Ruoyu
 * @FilePath: \next-client\layout\BlogLayout.js
 */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/Layout/bloglayout.less';

function BlogLayout({ categories = [], children }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeOut');

  useEffect(() => {
    setTransitionStage('fadeIn');
  }, []);

  useEffect(() => {
    if (children !== displayChildren) setTransitionStage('fadeOut');
  }, [children, setDisplayChildren, displayChildren]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header navArray={categories} />
      <main
        onTransitionEnd={() => {
          if (transitionStage === 'fadeOut') {
            setDisplayChildren(children);
            setTransitionStage('fadeIn');
          }
        }}
        className={`content ${transitionStage}`}
      >
        {displayChildren}
      </main>
      <Footer />
    </div>
  );
}

export default BlogLayout;
