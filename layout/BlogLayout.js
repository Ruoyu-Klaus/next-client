import React, { useState, useEffect } from 'react'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Flex } from '@chakra-ui/react'

import styles from '../styles/Layout/bloglayout.module.scss'

// import dynamic from 'next/dynamic'
// import FarmModalLoadingSpinner from '../components/FarmModalContainer'
// const ThreejsCanvas = dynamic(() => import('../components/ThreejsCanvas'), {
//   ssr: false,
//   loading: () => <FarmModalLoadingSpinner />,
// })

function BlogLayout({ categories = [], children }) {
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('fadeOut')

  useEffect(() => {
    setTransitionStage('fadeIn')
  }, [])

  useEffect(() => {
    if (children !== displayChildren) setTransitionStage('fadeOut')
  }, [children, setTransitionStage, displayChildren])

  return (
    <Flex flexDir='column' minH='100vh'>
      <NavBar navArray={categories} />
      {/* <ThreejsCanvas /> */}
      <main
        onTransitionEnd={e => {
          if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn')
            setDisplayChildren(children)
          }
        }}
        className={`${styles.root} ${styles[transitionStage]}`}
      >
        {displayChildren}
      </main>
      <Footer mb={4} />
    </Flex>
  )
}

export default BlogLayout
