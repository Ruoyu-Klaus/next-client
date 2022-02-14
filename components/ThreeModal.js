import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {useGLTF} from '@react-three/drei'

export default function Model({url, ...props}) {
    const {scene} = useGLTF(url)
    const myScene = useRef()

    // const [ratio, setRatio] = useState(-20);
    // useEffect(() => {
    //   const timer = setInterval(() => {
    //     setRatio((prev) => {
    //       if (prev > 0) return prev;
    //       return prev + 1;
    //     });
    //   }, 20);
    //   return () => {
    //     clearInterval(timer);
    //   };
    // }, []);

    useFrame(({clock}) => {
        myScene.current.rotation.y = Math.sin(clock.getElapsedTime() / 4) * 0.9 + 4.5
    })

    return <primitive ref={myScene} object={scene} position={[0, -2, 1]} rotation={[0, 4.5, 0]} scale={[1, 1, 1]} {...props} dispose={null} />
}
useGLTF.preload('/farmhouse2.0.glb')
