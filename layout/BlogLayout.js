import React, {useEffect, useState} from 'react'
import {Flex} from '@chakra-ui/react'
import styles from '../styles/Layout/bloglayout.module.scss'

function BlogLayout({children}) {
    const [displayChildren, setDisplayChildren] = useState(children)
    const [transitionStage, setTransitionStage] = useState('fadeOut')
    useEffect(() => {
        setTransitionStage('fadeIn')
    }, [])

    useEffect(() => {
        if (children !== displayChildren) setTransitionStage('fadeOut')
    }, [children, setTransitionStage, displayChildren])

    return (
        <Flex w="100%" flex={1} flexDir="column">
            <main
                onTransitionEnd={() => {
                    if (transitionStage === 'fadeOut') {
                        setTransitionStage('fadeIn')
                        setDisplayChildren(children)
                    }
                }}
                className={`${styles.root} ${styles[transitionStage]}`}
            >
                {displayChildren}
            </main>
        </Flex>
    )
}

export default BlogLayout
