import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {useGLTF} from '@react-three/drei'

useGLTF.preload('/farmhouse2.0.glb')

export default function Model({url, ...props}) {
    const {scene} = useGLTF(url)
    const myScene = useRef()
    let resetClock = true

    useFrame(({clock}) => {
        const endPoint = Math.min(clock.getElapsedTime() / 5, 1)
        if (endPoint >= 1 || !resetClock) {
            if (resetClock) {
                clock.stop()
                clock.start()
                resetClock = false
            }
            myScene.current.rotation.y = Math.sin(clock.getElapsedTime() / 3) + 4.7
            return
        }
        myScene.current.rotation.y = (1 - Math.pow(1 - endPoint, 4)) * Math.PI * 50 + 4.7
    })

    return <primitive ref={myScene} object={scene} position={[0, -2, 1]} rotation={[0, 0, 0]}
                      scale={[1, 1, 1]} {...props} dispose={null} />
}
