import React, {useEffect, useState} from 'react'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import {Flex} from '@chakra-ui/react'

import styles from '../styles/Layout/bloglayout.module.scss'

function BlogLayout({categories = [], model, children}) {
    const [displayChildren, setDisplayChildren] = useState(children)
    const [transitionStage, setTransitionStage] = useState('fadeOut')
    useEffect(() => {
        setTransitionStage('fadeIn')
    }, [])

    useEffect(() => {
        if (children !== displayChildren) setTransitionStage('fadeOut')
    }, [children, setTransitionStage, displayChildren])

    return (
        <Flex flexDir="column" minH="100vh">
            <NavBar navArray={categories} />
            <main
                onTransitionEnd={() => {
                    if (transitionStage === 'fadeOut') {
                        setTransitionStage('fadeIn')
                        setDisplayChildren(children)
                    }
                }}
                className={`${styles.root} ${styles[transitionStage]}`}
            >
                {model && model}
                {displayChildren}
            </main>
            <Footer mb={4} />
        </Flex>
    )
}

export default BlogLayout
