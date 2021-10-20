import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Flex } from '@chakra-ui/react';

function BlogLayout({ categories = [], children }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeOut');

  useEffect(() => {
    setTransitionStage('fadeIn');
  }, []);

  useEffect(() => {
    if (children !== displayChildren) setTransitionStage('fadeOut');
  }, [children, setTransitionStage, displayChildren]);

  return (
    <Flex flexDir='column' minH='100vh'>
      <NavBar navArray={categories} />
      <main
        onTransitionEnd={e => {
          if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn');
            setDisplayChildren(children);
          }
        }}
        className={`blog-main ${transitionStage}`}
      >
        {displayChildren}
      </main>
      <Footer />
    </Flex>
  );
}

export default BlogLayout;
