import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getArticleCategories } from '../request';

import '../styles/Layout/bloglayout.less';

function BlogLayout({ children }) {
  const [category, setCategory] = useState([]);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeOut');

  useEffect(() => {
    setTransitionStage('fadeIn');
  }, []);

  useEffect(() => {
    getArticleCategories().then(categories => {
      setCategory(categories);
    });
  }, []);

  useEffect(() => {
    if (children !== displayChildren) setTransitionStage('fadeOut');
  }, [children, setDisplayChildren, displayChildren]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header navArray={category} />
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
