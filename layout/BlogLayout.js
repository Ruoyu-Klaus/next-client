import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'

import CanvasLoadingSpinner from '../components/CanvasContainer'
import {Flex} from '@chakra-ui/react'

import styles from '../styles/Layout/bloglayout.module.scss'

const ThreeCanvas = dynamic(() => import('../components/ThreejsCanvas'), {
    ssr: false,
    loading: () => <CanvasLoadingSpinner />,
})

function BlogLayout({children, showModel = false}) {
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
            <main
                onTransitionEnd={() => {
                    if (transitionStage === 'fadeOut') {
                        setTransitionStage('fadeIn')
                        setDisplayChildren(children)
                    }
                }}
                className={`${styles.root} ${styles[transitionStage]}`}
            >
                {showModel && <ThreeCanvas />}
                {displayChildren}
            </main>
        </Flex>
    )
}

export default BlogLayout
